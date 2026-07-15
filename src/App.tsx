import React, { useState, useEffect } from "react";
import { 
  Home, Activity, MessageSquare, Map, Compass, 
  Accessibility, ClipboardList, ShieldAlert, Leaf, 
  ShieldCheck, AlertTriangle, Settings, User, Users, Sparkles, LogOut, Menu, X, ArrowRight
} from "lucide-react";

// Sub-views
import Navbar from "./components/Navbar";
import LandingView from "./components/LandingView";
import DashboardView from "./components/DashboardView";
import ChatView from "./components/ChatView";
import MapView from "./components/MapView";
import TransportView from "./components/TransportView";
import AccessibilityView from "./components/AccessibilityView";
import VolunteerView from "./components/VolunteerView";
import OrganizerView from "./components/OrganizerView";
import SustainabilityView from "./components/SustainabilityView";
import EmergencyView from "./components/EmergencyView";

// Initial datasets
import { 
  INITIAL_MATCHES, INITIAL_GATES, INITIAL_TRANSPORT, 
  INITIAL_VOLUNTEER_TASKS 
} from "./data";
import { 
  Message, Match, Gate, TransportOption, VolunteerTask, 
  AccessibilityConfig 
} from "./types";

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>("landing");
  const [prefillPrompt, setPrefillPrompt] = useState<string>("");

  // Drawer / Mobile Navbar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Simulation States
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [gates, setGates] = useState<{ [key: string]: Gate }>(INITIAL_GATES);
  const [transport, setTransport] = useState<TransportOption[]>(INITIAL_TRANSPORT);
  const [tasks, setTasks] = useState<VolunteerTask[]>(INITIAL_VOLUNTEER_TASKS);

  // Chat message state, persisted in localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("stadiummind_chats");
    return saved ? JSON.parse(saved) : [];
  });

  // ADA Accessibility state
  const [accessibility, setAccessibility] = useState<AccessibilityConfig>({
    fontSize: "normal",
    highContrast: false,
    screenReader: false,
    voiceGuided: false,
    reducedMotion: false
  });

  // Notification / Toast triggers
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "danger" | null }>({
    message: "",
    type: null
  });

  // Simulated Live Match Timer ticker
  const [matchMinutes, setMatchMinutes] = useState(64);
  const [matchSeconds, setMatchSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchSeconds((prevSec) => {
        if (prevSec >= 59) {
          setMatchMinutes((prevMin) => prevMin + 1);
          return 0;
        }
        return prevSec + 1;
      });
    }, 1500); // slightly sped up tick
    return () => clearInterval(interval);
  }, []);

  const formattedTimer = `${matchMinutes}:${matchSeconds.toString().padStart(2, "0")}`;

  // Persist Chats
  useEffect(() => {
    localStorage.setItem("stadiummind_chats", JSON.stringify(messages));
  }, [messages]);

  // Update timer in Match Object
  useEffect(() => {
    setMatches((prevMatches) =>
      prevMatches.map((m) =>
        m.status === "Live"
          ? { ...m, currentMinute: matchMinutes.toString() }
          : m
      )
    );
  }, [matchMinutes]);

  // Toast dispatch helper
  const triggerToast = (msg: string, type: "success" | "warning" | "danger") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: null }), 4000);
  };

  // 1. Goal Simulation trigger
  const handleTriggerGoal = () => {
    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.status === "Live") {
          const scoreParts = m.score.split("-").map((s) => parseInt(s.trim()));
          scoreParts[0] += 1; // USA Goal!
          return { ...m, score: `${scoreParts[0]} - ${scoreParts[1]}` };
        }
        return m;
      })
    );
    triggerToast("⚽ GOAL FOR USA! Score updated to 3 - 1. Decibel index peaking at 112dB.", "success");
  };

  // 2. Inflow spike simulation
  const handleSimulateInflow = () => {
    setGates((prevGates) => {
      const updated = { ...prevGates };
      updated["Gate B"] = {
        ...updated["Gate B"],
        waitTime: "35 mins",
        queues: "Peak Surge Congestion"
      };
      return updated;
    });
    triggerToast("⚠️ Gate B Congestion Alert: Ingress rate peaked at 480/min. Volunteers dispatched.", "warning");
  };

  // Chat message dispatcher
  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrefillPrompt(""); // reset carryover

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.slice(-10) })
      });
      const data = await res.json();

      const assistantMsg: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        simulated: data.simulated
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: "⚠️ **System Offline**: Unable to establish secure link with Gemini gateway. Please verify your internet connection or configure your `GEMINI_API_KEY` environment secret.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        simulated: true
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem("stadiummind_chats");
    triggerToast("Chat history database successfully flushed.", "success");
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (title: string, category: string) => {
    const newTask: VolunteerTask = {
      id: `VT-${Date.now()}`,
      title,
      completed: false,
      category: category as any,
      assignedTo: `Volunteer #${Math.floor(Math.random() * 50) + 1}`
    };
    setTasks((prev) => [...prev, newTask]);
    triggerToast(`Task successfully dispatched: "${title}"`, "success");
  };

  // Router dispatcher
  const navigateTo = (view: string, prefill?: string) => {
    setCurrentView(view);
    if (prefill) {
      setPrefillPrompt(prefill);
    }
    setIsSidebarOpen(false); // close drawer on navigate
  };

  const SIDEBAR_ITEMS = [
    { id: "landing", label: "Home (Landing)", shortLabel: "Home", icon: Home },
    { id: "dashboard", label: "Live Telemetry", shortLabel: "Live Ops", icon: Activity },
    { id: "chat", label: "AI Chat Assistant", shortLabel: "AI Desk", icon: MessageSquare },
    { id: "map", label: "Stadium Arena Map", shortLabel: "3D Map", icon: Map },
    { id: "transport", label: "Egress Transit", shortLabel: "Transit", icon: Compass },
    { id: "accessibility", label: "ADA Assistance", shortLabel: "ADA Ops", icon: Accessibility },
    { id: "volunteer", label: "Volunteer Hub", shortLabel: "Volunteers", icon: ClipboardList },
    { id: "organizer", label: "Organizer Command", shortLabel: "HQ Hub", icon: Users },
    { id: "sustainability", label: "Sustainability AI", shortLabel: "Eco AI", icon: Leaf },
    { id: "emergency", label: "SOS Crisis center", shortLabel: "SOS Ops", icon: AlertTriangle }
  ];

  // Font sizing CSS trigger
  const fontStyle = 
    accessibility.fontSize === "large" 
      ? "text-lg md:text-xl" 
      : accessibility.fontSize === "extra-large" 
        ? "text-xl md:text-2xl font-bold" 
        : "";

  return (
    <div className={`min-h-screen bg-brand-bg text-white flex flex-col ${
      accessibility.highContrast ? "contrast-125 saturate-150" : ""
    } ${fontStyle}`}>
      {/* Navbar always sticky on top */}
      <Navbar 
        currentView={currentView} 
        onNavigate={navigateTo} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        matchTimer={formattedTimer}
        isHighContrast={accessibility.highContrast}
      />

      <div className="flex-1 flex relative overflow-hidden">
        {/* Responsive Desktop Left Sidebar (always shown on md/lg screens, hidden on sm) */}
        <aside className="hidden lg:flex flex-col justify-between w-24 border-r border-white/10 bg-[#101010] py-6 px-1 flex-shrink-0 items-center">
          <div className="w-full flex flex-col items-center space-y-6">
            <nav className="w-full space-y-3.5 flex flex-col items-center">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    title={item.label}
                    className={`w-20 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer border ${
                      isActive 
                        ? "bg-white/5 text-brand-primary border-white/10 shadow-[0_0_15px_rgba(0,230,118,0.2)] font-bold animate-pulse-subtle" 
                        : "text-brand-text-secondary hover:text-white hover:bg-white/5 border-transparent"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 mb-1" />
                    <span className="text-[9px] font-mono uppercase tracking-wider font-semibold text-center leading-none">{item.shortLabel}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border border-white/20 bg-gradient-to-tr from-emerald-500 to-green-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]" title="HQ Supervisor Profile"></div>
          </div>
        </aside>

        {/* Mobile floating view navigation triggers */}
        <div className="lg:hidden absolute bottom-5 right-5 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-4 rounded-full bg-brand-primary text-brand-bg glow-btn shadow-2xl flex items-center justify-center cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile drawer backdrop overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          >
            {/* Drawer Content block */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-64 bg-brand-surface border-r border-brand-border p-4 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <h3 className="font-display font-bold text-white">Operations Cabin</h3>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-5 h-5 text-brand-text-secondary hover:text-white" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive 
                            ? "bg-brand-primary text-brand-bg font-bold" 
                            : "text-brand-text-secondary hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-brand-border text-[10px] text-brand-text-secondary">
                <p>© 2026 StadiumMind AI</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto bg-brand-bg relative">
          {/* Active view renderer */}
          {currentView === "landing" && (
            <LandingView onEnterApp={(prefillView, prefillPrompt) => navigateTo(prefillView || "dashboard", prefillPrompt)} />
          )}
          {currentView === "dashboard" && (
            <DashboardView 
              matches={matches} 
              gates={gates} 
              transport={transport}
              onTriggerGoal={handleTriggerGoal}
              onSimulateInflow={handleSimulateInflow}
              onNavigate={navigateTo}
            />
          )}
          {currentView === "chat" && (
            <ChatView 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              onClearHistory={handleClearHistory}
              prefillPrompt={prefillPrompt}
            />
          )}
          {currentView === "map" && (
            <MapView onNavigate={navigateTo} />
          )}
          {currentView === "transport" && (
            <TransportView transport={transport} onNavigate={navigateTo} />
          )}
          {currentView === "accessibility" && (
            <AccessibilityView 
              config={accessibility} 
              onUpdateConfig={(cfg) => setAccessibility((prev) => ({ ...prev, ...cfg }))} 
              onNavigate={navigateTo}
            />
          )}
          {currentView === "volunteer" && (
            <VolunteerView 
              tasks={tasks} 
              onToggleTask={handleToggleTask} 
              onAddTask={handleAddTask}
            />
          )}
          {currentView === "organizer" && (
            <OrganizerView matchTimer={formattedTimer} />
          )}
          {currentView === "sustainability" && (
            <SustainabilityView onNavigate={navigateTo} />
          )}
          {currentView === "emergency" && (
            <EmergencyView onNavigate={navigateTo} />
          )}
        </main>
      </div>

      {/* Global Status Toast Notification */}
      {toast.message && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border flex items-center space-x-3 shadow-2xl animate-bounce ${
          toast.type === "success" 
            ? "bg-brand-success/15 border-brand-success text-brand-success" 
            : toast.type === "warning" 
              ? "bg-yellow-400/15 border-yellow-400 text-yellow-400" 
              : "bg-brand-danger/15 border-brand-danger text-brand-danger"
        }`}>
          <span className="text-sm">🔔</span>
          <p className="text-xs font-semibold">{toast.message}</p>
        </div>
      )}

      {/* System Settings/Profile Modal overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="font-display font-bold text-white text-base">Stadium Credentials & Environment</h3>
              <button onClick={() => setIsSettingsOpen(false)}>
                <X className="w-5 h-5 text-brand-text-secondary hover:text-white" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-brand-surface border border-brand-border rounded-xl">
                <p className="text-[10px] text-brand-primary font-mono uppercase tracking-wider font-bold">API Security Status</p>
                <div className="mt-2 space-y-1 leading-relaxed">
                  <p className="text-white">Gemini API Connection: <span className="text-brand-success font-bold font-mono">PROXY ACTIVE</span></p>
                  <p className="text-brand-text-secondary">Key Visibility: <span className="text-yellow-400">Server-Side Secret Protected (Bypasses browser inspect)</span></p>
                </div>
              </div>

              <div className="p-3 bg-brand-surface border border-brand-border rounded-xl">
                <p className="text-[10px] text-brand-primary font-mono uppercase tracking-wider font-bold">Stadium Identification</p>
                <p className="text-white mt-1.5 font-bold">New York New Jersey Stadium (MetLife Arena)</p>
                <p className="text-brand-text-secondary mt-0.5">Capacity: 82,500 seats | Tournament Code: NY-MET</p>
              </div>

              <div className="p-3 bg-brand-surface border border-brand-border rounded-xl space-y-1 leading-snug">
                <p className="text-[10px] text-brand-primary font-mono uppercase tracking-wider font-bold">Software Environment</p>
                <p className="text-white">Build Release: v2.4.0 (Production-Ready)</p>
                <p className="text-brand-text-secondary">Render Platform: Google Cloud Run container</p>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2 bg-brand-primary text-brand-bg font-bold rounded-lg text-xs hover:opacity-90 transition-all cursor-pointer flex items-center justify-center space-x-1.5 glow-btn"
            >
              <span>Verify & Close settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
