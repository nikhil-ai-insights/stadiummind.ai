import React, { useState } from "react";
import { 
  ShieldAlert, TrendingUp, Users, HeartHandshake, Map, 
  Sparkles, Bell, Send, AlertTriangle, CheckCircle, Info
} from "lucide-react";

interface OrganizerViewProps {
  matchTimer: string;
}

export default function OrganizerView({ matchTimer }: OrganizerViewProps) {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcasts, setBroadcasts] = useState<string[]>([
    "NY Transit Alert: Metro trains running at peak frequency. No delays reported.",
    "Eco Hub Check: Hydration station Sec 132 has reached 2,900 bottle counts."
  ]);
  const [dispatched, setDispatched] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcasts([broadcastMessage.trim(), ...broadcasts]);
    setBroadcastMessage("");
    setDispatched(true);
    setTimeout(() => setDispatched(false), 3000);
  };

  const STADIUM_STATS = [
    { label: "Active Attendees", value: "81,240 / 82,500", detail: "98.4% Capacity", icon: Users, color: "text-brand-primary" },
    { label: "Gate Inflow Rate", value: "248 fans / min", detail: "Peaked at Minute 15", icon: TrendingUp, color: "text-blue-400" },
    { label: "Staff on Duty", value: "148 Volunteers", detail: "10 posts active", icon: HeartHandshake, color: "text-purple-400" },
    { label: "Active SOS Cases", value: "0", detail: "All Resolved", icon: ShieldAlert, color: "text-brand-success" }
  ];

  const GATE_HEATMAPS = [
    { name: "North Plaza (Gate A)", count: "16,400 entries", load: 60, status: "Normal", color: "bg-brand-primary" },
    { name: "East Plaza (Gate B)", count: "24,800 entries", load: 92, status: "Congested", color: "bg-brand-danger" },
    { name: "South Plaza (Gate C)", count: "14,100 entries", load: 45, status: "Fluid", color: "bg-brand-success" },
    { name: "West Plaza (Gate D)", count: "25,940 entries", load: 78, status: "Busy", color: "bg-yellow-400" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-brand-border pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-brand-primary" />
            <span>FIFA Organizer Command Center</span>
          </h2>
          <p className="text-xs text-brand-text-secondary mt-1">
            Real-time operations terminal, gate heatmaps, volunteer dispatch coordinates, and security broadcasting.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-xs font-mono font-bold text-white flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>Match Timer: {matchTimer}</span>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STADIUM_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-brand-card border border-brand-border p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider">{stat.label}</p>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <h4 className="text-xl font-display font-bold text-white">{stat.value}</h4>
              <p className="text-xs text-brand-text-secondary mt-0.5">{stat.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gate Entry Heatmap */}
        <div className="lg:col-span-2 bg-brand-card border border-brand-border p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <Map className="w-4 h-4 text-brand-primary" />
              <span>Gate Loading Heatmap Distribution</span>
            </h3>
            <span className="text-[9px] font-mono text-brand-text-secondary">Refreshed: Just now</span>
          </div>

          <div className="space-y-4">
            {GATE_HEATMAPS.map((gate) => (
              <div key={gate.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{gate.name}</span>
                  <span className="text-brand-text-secondary font-mono">{gate.count} ({gate.load}%)</span>
                </div>
                <div className="w-full bg-brand-surface h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${gate.color}`}
                    style={{ width: `${gate.load}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-brand-text-secondary">
                  <span>Capacity Level: {gate.status}</span>
                  {gate.load > 90 && (
                    <span className="text-brand-danger flex items-center space-x-1 font-bold animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Reroute Triggered</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Volunteer Radio Broadcast Control */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2 border-b border-brand-border pb-3">
              <Bell className="w-4 h-4 text-brand-primary" />
              <span>Operations Radio Broadcast</span>
            </h3>

            <p className="text-xs text-brand-text-secondary leading-relaxed">
              Dispatch global notifications directly to active volunteer tablets, gate security panels, and eco stations.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-2.5">
              <textarea
                placeholder="Type dispatch broadcast (e.g. Expand lanes at Gate B immediately due to surge)..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full h-24 text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={!broadcastMessage.trim()}
                className="w-full py-2 bg-brand-primary text-brand-bg font-bold rounded-lg text-xs hover:opacity-90 transition-all flex items-center justify-center space-x-1.5 glow-btn cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Dispatch</span>
              </button>
            </form>

            {dispatched && (
              <div className="p-2 bg-brand-success/10 border border-brand-success/20 rounded-lg text-[11px] text-brand-success flex items-center space-x-1.5 animate-pulse">
                <CheckCircle className="w-4 h-4" />
                <span>Broadcast dispatched successfully!</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-brand-border space-y-2">
            <p className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider">Active Broadcast Logs:</p>
            <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
              {broadcasts.map((log, idx) => (
                <p key={idx} className="text-[10px] text-brand-text-secondary leading-snug border-l border-brand-primary pl-2">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
