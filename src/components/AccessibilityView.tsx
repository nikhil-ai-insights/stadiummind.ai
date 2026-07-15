import React, { useState } from "react";
import { 
  Accessibility, Volume2, HelpCircle, Eye, 
  MapPin, Check, Settings, Sparkles, MessageSquare, VolumeX
} from "lucide-react";
import { AccessibilityConfig } from "../types";

interface AccessibilityViewProps {
  config: AccessibilityConfig;
  onUpdateConfig: (config: Partial<AccessibilityConfig>) => void;
  onNavigate: (view: string, prefillPrompt?: string) => void;
}

export default function AccessibilityView({
  config,
  onUpdateConfig,
  onNavigate
}: AccessibilityViewProps) {
  const [playingAudio, setPlayingAudio] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState("");

  const playAudioGuide = (transcript: string) => {
    setAudioTranscript(transcript);
    setPlayingAudio(true);
    // Simulate speech-to-text audio playback duration
    setTimeout(() => {
      setPlayingAudio(false);
    }, 6000);
  };

  const ELEVATORS = [
    { name: "Elevator North-1 (Gate A)", status: "Operational", access: "Sections 101-118, 301-315", type: "Wheelchair Approved" },
    { name: "Elevator East-4 (Gate B)", status: "Operational", access: "Sections 119-128, 316-328", type: "Wheelchair Approved" },
    { name: "Elevator South-2 (Gate C)", status: "Under Maintenance", access: "Section 130 Ramp Alternate", type: "Ramp Available" },
    { name: "Elevator West-3 (Gate D)", status: "Operational", access: "Sections 141-149, 339-349", type: "Wheelchair Approved" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-brand-border pb-4">
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center space-x-2">
          <Accessibility className="w-5 h-5 text-brand-primary" />
          <span>Accessibility Operations Assistant</span>
        </h2>
        <p className="text-xs text-brand-text-secondary mt-1">
          Customize physical assistance settings, inspect elevator availability, and stream voice-guided terminal directions conforming to WCAG AA guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: ADA Preferences Dashboard */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-5">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <Settings className="w-4 h-4 text-brand-primary" />
            <span>ADA Interface Controls</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Font Size Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block">Font Scale Size</label>
              <div className="grid grid-cols-3 gap-2">
                {(["normal", "large", "extra-large"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onUpdateConfig({ fontSize: sz })}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      config.fontSize === sz 
                        ? "bg-brand-primary border-brand-primary text-brand-bg" 
                        : "bg-brand-surface border-brand-border text-brand-text-secondary hover:text-white"
                    }`}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
              <div>
                <p className="font-bold text-white flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-brand-primary" />
                  <span>High Contrast Mode</span>
                </p>
                <p className="text-[10px] text-brand-text-secondary mt-0.5">Increases text color ratios to 7:1</p>
              </div>
              <input
                type="checkbox"
                checked={config.highContrast}
                onChange={(e) => onUpdateConfig({ highContrast: e.target.checked })}
                className="w-4 h-4 text-brand-primary accent-brand-primary cursor-pointer"
              />
            </div>

            {/* Screen Reader Enablement */}
            <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
              <div>
                <p className="font-bold text-white">ARIA Screen Reader Helpers</p>
                <p className="text-[10px] text-brand-text-secondary mt-0.5">Injects verbal alt-text descriptions</p>
              </div>
              <input
                type="checkbox"
                checked={config.screenReader}
                onChange={(e) => onUpdateConfig({ screenReader: e.target.checked })}
                className="w-4 h-4 text-brand-primary accent-brand-primary cursor-pointer"
              />
            </div>

            {/* Voice Guidance Toggle */}
            <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
              <div>
                <p className="font-bold text-white">Voice Guided Audio Help</p>
                <p className="text-[10px] text-brand-text-secondary mt-0.5">Triggers automatic text-to-speech audio</p>
              </div>
              <input
                type="checkbox"
                checked={config.voiceGuided}
                onChange={(e) => onUpdateConfig({ voiceGuided: e.target.checked })}
                className="w-4 h-4 text-brand-primary accent-brand-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center: Live Elevator & Ramp Guides */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <span>Barrier-Free Access Guide</span>
          </h3>

          <div className="space-y-3">
            {ELEVATORS.map((el) => {
              const isMaintenance = el.status.includes("Maintenance");
              return (
                <div key={el.name} className="p-3 bg-brand-surface border border-brand-border rounded-xl flex items-start justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{el.name}</h4>
                    <p className="text-brand-text-secondary mt-0.5">{el.access}</p>
                    <span className="mt-1.5 inline-block text-[9px] font-mono bg-brand-card border border-brand-border text-brand-text-secondary px-2 py-0.5 rounded">
                      {el.type}
                    </span>
                  </div>
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isMaintenance ? "bg-brand-danger/10 text-brand-danger" : "bg-brand-success/10 text-brand-success"
                  }`}>
                    {el.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Audio Instruction Streamer */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2 border-b border-brand-border pb-3">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Voice Accessibility AI</span>
            </h3>

            <p className="text-xs text-brand-text-secondary leading-relaxed">
              Generate instant verbal guidance instructions for any stadium section or active egress gate. Perfect for vision-impaired fans.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => playAudioGuide("Elevator North-One is fully functional. Please proceed through Gate A. ADA seats are located adjacent to Section 102. Escorts are active near the ticketing turnstile.")}
                disabled={playingAudio}
                className="w-full text-left p-2.5 bg-brand-surface hover:bg-brand-primary/5 border border-brand-border rounded-xl text-xs hover:border-brand-primary transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white">Stream: Gate A & Sec 102 Path</p>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Duration: 6 seconds • English</p>
                </div>
                <Volume2 className="w-4 h-4 text-brand-primary" />
              </button>

              <button
                onClick={() => playAudioGuide("Atención. Para ruta libre de escaleras hacia la plataforma Metro, por favor diríjase al Corredor Este de la Puerta C. Los voluntarios de chaleco verde están listos para asistir.")}
                disabled={playingAudio}
                className="w-full text-left p-2.5 bg-brand-surface hover:bg-brand-primary/5 border border-brand-border rounded-xl text-xs hover:border-brand-primary transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white">Stream: Metro Access (Spanish)</p>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Duration: 6 seconds • Español</p>
                </div>
                <Volume2 className="w-4 h-4 text-brand-primary" />
              </button>
            </div>

            {playingAudio && (
              <div className="p-3 bg-brand-surface border border-brand-primary/30 rounded-xl space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-brand-primary font-bold">STREAMING VERBAL AUDIO</span>
                  <VolumeX className="w-3.5 h-3.5 text-brand-danger cursor-pointer" onClick={() => setPlayingAudio(false)} title="Stop Stream" />
                </div>
                <p className="text-xs text-brand-text-secondary italic leading-relaxed">"{audioTranscript}"</p>
                
                {/* Audio Wave Amplitude */}
                <div className="flex items-center space-x-1 justify-center pt-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-1 bg-brand-primary rounded-full animate-bounce h-4" style={{ animationDelay: `${i * 100}ms` }}></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border text-xs">
            <button
              onClick={() => onNavigate("chat", "Explain the full wheelchair accessible routes for MetLife stadium Azteca Arena.")}
              className="text-brand-primary font-bold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Ask Voice AI Coordinator</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
