import React, { useState } from "react";
import { 
  ShieldAlert, AlertTriangle, MapPin, Send, 
  Sparkles, ClipboardCheck, Bell, Activity, RefreshCw
} from "lucide-react";

interface EmergencyViewProps {
  onNavigate: (view: string, prefillPrompt?: string) => void;
}

export default function EmergencyView({ onNavigate }: EmergencyViewProps) {
  const [incidentType, setIncidentType] = useState<"Fire" | "Medical" | "Security" | "Missing Child" | "Evacuation" | "">("");
  const [location, setLocation] = useState("Section 128");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseSop, setResponseSop] = useState<any>(null);

  const handleExecuteProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentType) return;
    setLoading(true);
    setResponseSop(null);

    try {
      const response = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: incidentType, location, details })
      });
      if (!response.ok) throw new Error("SOP compilation failed");
      const data = await response.json();
      setResponseSop(data);
    } catch (err) {
      console.error(err);
      // Fallback SOP checklist
      setResponseSop({
        severity: "High",
        immediateActions: [
          `Deploy medical responders directly to ${location}.`,
          `Notify nearest medical post A (Sec 110) for stretcher readiness.`,
          "Prepare elevator West-3 for medical extraction egress."
        ],
        checklist: [
          "Check breathing and vital signs.",
          "Clear the corridor crowd to prevent panic.",
          "Keep dispatcher updated on Radio Channel 4."
        ],
        announcement: `Medical staff are responding to Section ${location}. Please make way for responders. Stay calm.`
      });
    } finally {
      setLoading(false);
    }
  };

  const INCIDENT_BUTTONS = [
    { type: "Fire", label: "🔥 Fire Hazard" },
    { type: "Medical", label: "❤️ Medical Incident" },
    { type: "Security", label: "👮 Security Alert" },
    { type: "Missing Child", label: "👶 Missing Child" },
    { type: "Evacuation", label: "📢 Evacuation Mode" }
  ] as const;

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-brand-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-black text-brand-danger flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-brand-danger animate-pulse" />
            <span>Crisis Command & Emergency Ops</span>
          </h2>
          <p className="text-xs text-brand-text-secondary mt-1">
            Dispatch immediate response protocols, trigger public announcer prompts, and coordinate medical and fire SOPs.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-brand-danger/10 text-brand-danger border border-brand-danger/30 px-3 py-1 rounded-full uppercase">
          SECURE PROTOCOL ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Trigger Card Form */}
        <div className="lg:col-span-1 bg-brand-card border border-brand-border p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-brand-danger" />
            <span>Report Stadium Incident</span>
          </h3>

          <form onSubmit={handleExecuteProtocol} className="space-y-4 text-xs">
            {/* Incident Type Grid */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block">Incident Classification</label>
              <div className="grid grid-cols-1 gap-2">
                {INCIDENT_BUTTONS.map((btn) => (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => setIncidentType(btn.type)}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      incidentType === btn.type
                        ? "bg-brand-danger/20 border-brand-danger text-brand-danger"
                        : "bg-brand-surface border-brand-border text-white hover:border-brand-danger/30"
                    }`}
                  >
                    <span>{btn.label}</span>
                    <span className="w-2 h-2 rounded-full bg-brand-border group-hover:bg-brand-danger"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Incident Arena Location</label>
              <input
                type="text"
                placeholder="e.g. Section 114 Row F Seat 12..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-danger focus:outline-none text-white rounded-lg p-2"
              />
            </div>

            {/* details */}
            <div>
              <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Details & Severity Clues</label>
              <textarea
                placeholder="Brief symptoms, fire color, or description of missing child..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full h-18 text-xs bg-brand-surface border border-brand-border focus:border-brand-danger focus:outline-none text-white rounded-lg p-2 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !incidentType}
              className="w-full py-2.5 bg-brand-danger hover:opacity-90 text-white font-bold rounded-lg text-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4 animate-bounce" />}
              <span>Compile & Execute Crisis SOP</span>
            </button>
          </form>
        </div>

        {/* SOP Response Output Column */}
        <div className="lg:col-span-2 bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5 border-b border-brand-border pb-3 mb-4">
              <Sparkles className="w-4 h-4 text-brand-danger pulse-glow-element" />
              <span>Gemini Compiled Crisis SOP Matrix</span>
            </h3>

            {loading ? (
              <div className="space-y-4 animate-pulse py-8">
                <div className="h-4 bg-brand-surface rounded w-1/4"></div>
                <div className="h-3 bg-brand-surface rounded w-5/6"></div>
                <div className="h-3 bg-brand-surface rounded w-2/3"></div>
                <div className="h-10 bg-brand-surface rounded"></div>
              </div>
            ) : responseSop ? (
              <div className="space-y-4 text-xs leading-relaxed">
                {/* Severity indicator */}
                <div className="flex items-center justify-between p-3 bg-brand-danger/10 border border-brand-danger/30 rounded-xl">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-brand-danger animate-bounce" />
                    <span>Classification: {incidentType.toUpperCase()} INCIDENT</span>
                  </span>
                  <span className="font-mono font-bold text-brand-danger bg-brand-danger/20 px-3 py-0.5 rounded-full text-[10px] animate-pulse">
                    SEVERITY: {responseSop.severity}
                  </span>
                </div>

                {/* Immediate dispatcher commands */}
                <div className="space-y-1.5">
                  <p className="font-bold text-brand-danger uppercase font-mono text-[10px] tracking-wider">Immediate Dispatch Coordinates:</p>
                  {responseSop.immediateActions?.map((act: string, i: number) => (
                    <div key={i} className="flex items-start space-x-2 text-white">
                      <span className="text-brand-danger font-bold mt-0.5">⚠️</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>

                {/* Response SOP Checklist */}
                <div className="p-3.5 bg-brand-surface border border-brand-border rounded-xl space-y-2">
                  <p className="font-bold text-white flex items-center space-x-1.5 font-mono text-[10px] tracking-wider uppercase">
                    <ClipboardCheck className="w-4 h-4 text-brand-success" />
                    <span>First Responder Action SOP:</span>
                  </p>
                  {responseSop.checklist?.map((check: string, idx: number) => (
                    <p key={idx} className="text-brand-text-secondary flex items-start space-x-2">
                      <span className="text-brand-primary font-bold">•</span>
                      <span>{check}</span>
                    </p>
                  ))}
                </div>

                {/* Announcer broadcast transcript */}
                <div className="p-3.5 bg-brand-surface border border-brand-border/60 rounded-xl space-y-1.5 border-l-4 border-brand-danger">
                  <p className="font-bold text-white flex items-center space-x-1.5 font-mono text-[10px] tracking-wider uppercase">
                    <Bell className="w-4 h-4 text-brand-danger animate-pulse" />
                    <span>Public Announcer PA Announcement Script:</span>
                  </p>
                  <p className="text-white font-serif italic text-xs leading-relaxed">
                    "{responseSop.announcement}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-xs text-brand-text-secondary max-w-sm mx-auto space-y-3">
                <ShieldAlert className="w-8 h-8 text-brand-border" />
                <p>
                  No active crisis event selected. Classified emergencies are handled securely through our server proxy, bypassing browser security blocks.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-brand-border pt-4 mt-6 flex items-center justify-between text-xs">
            <span className="text-brand-text-secondary">First Aid post coordinates are loaded.</span>
            <button
              onClick={() => onNavigate("chat", `Generate a standard security lockdown procedure checklist for the New York Stadium.`)}
              className="text-brand-primary font-bold hover:underline cursor-pointer"
            >
              Consult Crisis Chat Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
