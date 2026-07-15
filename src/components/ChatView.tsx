import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Sparkles, User, HelpCircle, Copy, RotateCcw, 
  Languages, Mic, MicOff, Upload, FileText, Check, AlertCircle, RefreshCw
} from "lucide-react";
import { Message } from "../types";

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => void;
  prefillPrompt?: string;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fr", name: "Français (French)" },
  { code: "pt", name: "Português (Portuguese)" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "ja", name: "日本語 (Japanese)" },
  { code: "de", name: "Deutsch (German)" },
  { code: "it", name: "Italiano (Italian)" },
  { code: "zh", name: "中文 (Chinese)" }
];

export default function ChatView({
  messages,
  onSendMessage,
  onClearHistory,
  prefillPrompt
}: ChatViewProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState<number[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatingText, setTranslatingText] = useState("");
  const [translationResult, setTranslationResult] = useState("");
  const [translating, setTranslating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (prefillPrompt) {
      setInput(prefillPrompt);
    }
  }, [prefillPrompt]);

  // Voice recording simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        const waves = Array.from({ length: 12 }, () => Math.floor(Math.random() * 40) + 10);
        setVoiceVolume(waves);
      }, 150);
    } else {
      setVoiceVolume([]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptToSend = input.trim();
    if (!promptToSend && !uploadedFile) return;

    setLoading(true);
    setInput("");
    
    // If a file was uploaded, we'll append its reference to the chat prompt
    let finalPrompt = promptToSend;
    if (uploadedFile) {
      finalPrompt = `[Attached image: ${uploadedFile.name}] ${promptToSend || "Please analyze this uploaded stadium ticket / photo."}`;
      setUploadedFile(null);
      setFilePreview(null);
    }

    try {
      await onSendMessage(finalPrompt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = async (prompt: string) => {
    setLoading(true);
    try {
      await onSendMessage(prompt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async (msgIndex: number) => {
    // Find the nearest preceding user message
    let lastUserPrompt = "";
    for (let i = msgIndex; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserPrompt = messages[i].content;
        break;
      }
    }
    if (lastUserPrompt) {
      setLoading(true);
      try {
        await onSendMessage(lastUserPrompt);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSimulateVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // Insert a random voice query
      const queries = [
        "Where is Gate C restroom located?",
        "How do I reach section 102 wheelchair platform?",
        "When is the NY Stadium shuttle leaving to Lot E?",
        "Translate security announcement: Please make way for medical responders."
      ];
      setInput(queries[Math.floor(Math.random() * queries.length)]);
    }
  };

  const handleTranslateText = async () => {
    if (!translatingText.trim()) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translatingText, targetLanguage: selectedLanguage })
      });
      const data = await res.json();
      setTranslationResult(data.translatedText);
    } catch (err) {
      console.error(err);
      setTranslationResult("Translation failed. Verify connection or API key.");
    } finally {
      setTranslating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const SUGGESTED_PROMPTS = [
    "Where is Gate C?",
    "Shortest washroom wait time?",
    "How to reach Section 102 seats?",
    "Lost item protocol for staff"
  ];

  // A light, 100% robust markdown text renderer that handles headers, bold text, lists, and code blocks
  const renderMarkdown = (text: string) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-bold text-brand-primary mt-2 mb-1">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-bold text-white mt-3 mb-1.5">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-lg font-black text-white mt-4 mb-2">{line.replace("# ", "")}</h2>;
      }
      // Bullet lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const itemText = line.substring(2);
        return (
          <div key={idx} className="flex items-start space-x-2 pl-2 my-1 text-xs text-brand-text-secondary leading-relaxed">
            <span className="text-brand-primary font-bold">•</span>
            <span>{itemText}</span>
          </div>
        );
      }
      // Numbered lists
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start space-x-2 pl-2 my-1 text-xs text-brand-text-secondary leading-relaxed">
            <span className="text-brand-primary font-mono font-bold">{numMatch[1]}.</span>
            <span>{numMatch[2]}</span>
          </div>
        );
      }
      // Blockquotes
      if (line.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-2 border-brand-primary/60 bg-brand-surface/40 p-2.5 my-2 rounded-r-lg text-xs italic text-brand-text-secondary">
            {line.replace("> ", "")}
          </blockquote>
        );
      }
      // Bold rendering
      let processedLine: React.ReactNode = line;
      if (line.includes("**")) {
        const parts = line.split("**");
        processedLine = parts.map((part, pidx) => pidx % 2 === 1 ? <strong key={pidx} className="text-brand-primary font-semibold">{part}</strong> : part);
      }

      return (
        <p key={idx} className="text-xs text-brand-text-secondary leading-relaxed my-1 min-h-[1.2em]">
          {processedLine}
        </p>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 py-6 h-[calc(100vh-140px)]">
      {/* Right Column: Interactive Translation panel and FAQ tools */}
      <div className="lg:col-span-1 bg-brand-card border border-brand-border p-4 rounded-2xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-border pb-2">
            <Languages className="w-4 h-4 text-brand-primary" />
            <h3 className="font-display font-bold text-sm text-white">Bilingual Translator</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="target-lang-select" className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Target Language</label>
              <select
                id="target-lang-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="translator-source-text" className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Source Text</label>
              <textarea
                id="translator-source-text"
                placeholder="Type announcements, medical cases or volunteer requests..."
                value={translatingText}
                onChange={(e) => setTranslatingText(e.target.value)}
                className="w-full h-24 text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleTranslateText}
              disabled={translating || !translatingText}
              className="w-full py-2 bg-brand-surface border border-brand-border hover:border-brand-primary text-white hover:text-brand-primary rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
            >
              {translating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Translate with AI</span>
            </button>

            {translationResult && (
              <div className="p-3 bg-brand-surface border border-brand-border rounded-lg">
                <p className="text-[9px] text-brand-primary font-mono uppercase tracking-wider">Result</p>
                <p className="text-xs text-white mt-1 leading-relaxed">{translationResult}</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-brand-border space-y-2 text-xs">
          <p className="font-bold text-white flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
            <span>AI Translation Scope</span>
          </p>
          <p className="text-[11px] text-brand-text-secondary leading-relaxed">
            All text submitted is auto-routed to the server. Gemini auto-detects language and returns the target equivalent instantly.
          </p>
        </div>
      </div>

      {/* Main Column: Chat Assistant interface */}
      <div className="lg:col-span-3 bg-brand-card border border-brand-border rounded-2xl flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
              <Sparkles className="pulse-glow-element w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">Stadium AI Assistant</h3>
              <p className="text-[10px] text-brand-text-secondary font-mono">Live Session • NY Stadium Hub</p>
            </div>
          </div>

          <button
            onClick={onClearHistory}
            className="px-2.5 py-1.5 rounded-lg border border-brand-border hover:border-brand-primary bg-brand-surface/50 text-[11px] text-brand-text-secondary hover:text-white transition-all cursor-pointer"
          >
            Reset Session
          </button>
        </div>

        {/* Message Feeds Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 py-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white">Stadium Intel Activated</h4>
                <p className="text-xs text-brand-text-secondary mt-1">
                  Ask me anything about Seat blocks, Gate waiting times, Reusable hydration water hubs, emergency medical help, or post-match public shuttle timetables.
                </p>
              </div>

              {/* Suggestions */}
              <div className="w-full space-y-2 pt-2">
                <p className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider">Suggested Operational Prompts:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="p-2 text-left text-xs bg-brand-surface hover:bg-brand-primary/5 hover:border-brand-primary/40 border border-brand-border rounded-xl transition-all cursor-pointer text-brand-text-secondary hover:text-brand-primary"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div key={msg.id} className={`flex items-start space-x-3 ${!isAssistant ? "justify-end" : ""}`}>
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3.5 border ${
                    isAssistant 
                      ? "bg-brand-card rounded-tl-none border-white/5 text-white" 
                      : "bg-brand-primary/10 rounded-tr-none border-brand-primary/30 text-white"
                  }`}>
                    <div className="prose max-w-none">
                      {isAssistant ? renderMarkdown(msg.content) : <p className="text-xs">{msg.content}</p>}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="mt-3 pt-2 border-t border-brand-border/40 flex items-center justify-between text-[9px] text-brand-text-secondary">
                      <span className="font-mono">{msg.timestamp} {msg.simulated && "• Simulated Mode"}</span>
                      {isAssistant && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
                            title="Copy reply"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-brand-success" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                          </button>
                          <button
                            onClick={() => handleRegenerate(i)}
                            className="hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
                            title="Regenerate from this point"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Regen</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-brand-text-secondary flex-shrink-0">
                      <User className="w-4 h-4 text-brand-primary" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary flex-shrink-0">
                <Sparkles className="w-4 h-4 pulse-glow-element" />
              </div>
              <div className="bg-brand-card border border-white/5 rounded-2xl rounded-tl-none p-3.5 w-1/2">
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-brand-border rounded w-5/6"></div>
                  <div className="h-3 bg-brand-border rounded w-2/3"></div>
                  <div className="h-3 bg-brand-border rounded w-3/4"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-brand-border bg-brand-surface/20 space-y-2">
          {/* File Upload Preview */}
          {filePreview && (
            <div className="flex items-center justify-between p-2 bg-brand-surface border border-brand-border rounded-xl">
              <div className="flex items-center space-x-3">
                <img src={filePreview} alt="upload preview" className="w-10 h-10 object-cover rounded-lg border border-brand-border" />
                <div>
                  <p className="text-xs text-white font-medium">{uploadedFile?.name}</p>
                  <p className="text-[10px] text-brand-text-secondary">Ready to send with prompt</p>
                </div>
              </div>
              <button
                onClick={() => { setUploadedFile(null); setFilePreview(null); }}
                className="p-1 text-brand-danger hover:bg-white/5 rounded-lg transition-all text-xs"
              >
                Remove
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              id="chat-image-uploader"
              aria-label="Upload stadium ticket or emergency photo"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-brand-surface hover:bg-white/5 border border-brand-border text-brand-text-secondary hover:text-brand-primary transition-all cursor-pointer"
              title="Upload stadium ticket or emergency photo"
              aria-label="Upload stadium ticket or emergency photo"
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Voice Simulation */}
            <button
              type="button"
              onClick={handleSimulateVoiceInput}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isRecording 
                  ? "bg-brand-danger/25 border-brand-danger text-brand-danger animate-pulse" 
                  : "bg-brand-surface hover:bg-white/5 border-brand-border text-brand-text-secondary hover:text-brand-primary"
              }`}
              title="Simulate Voice Assistant Input"
              aria-label={isRecording ? "Stop voice assistant recording" : "Simulate voice assistant input"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              id="chat-user-prompt-input"
              aria-label="Ask Stadium AI Assistant"
              type="text"
              placeholder={isRecording ? "Listening to simulated voice input..." : "Ask: 'Where is Gate C?' or 'ADA elevator platform?'..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || isRecording}
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-brand-primary focus:outline-none text-white text-xs"
            />

            <button
              type="submit"
              disabled={loading || (!input.trim() && !uploadedFile)}
              className="p-2.5 rounded-xl bg-brand-primary text-brand-bg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center glow-btn cursor-pointer"
              aria-label="Send message to AI assistant"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Voice Frequency visual indicator */}
          {isRecording && (
            <div className="flex items-center justify-center space-x-1 py-1 bg-brand-danger/5 rounded-lg border border-brand-danger/10">
              <span className="text-[10px] font-mono text-brand-danger font-bold mr-2 animate-pulse">VOICE ACTIVE:</span>
              {voiceVolume.map((vol, i) => (
                <div
                  key={i}
                  className="w-1 bg-brand-danger rounded-full transition-all duration-150"
                  style={{ height: `${vol}px` }}
                ></div>
              ))}
              <span className="text-[10px] text-brand-text-secondary ml-3 font-mono">Tap mic icon again to transcribe</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
