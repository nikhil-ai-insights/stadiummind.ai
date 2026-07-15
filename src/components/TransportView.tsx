import React, { useState } from "react";
import { 
  Compass, Bus, Landmark, MessageSquare, AlertCircle, 
  Clock, ArrowRight, Sparkles, Navigation, Leaf
} from "lucide-react";
import { TransportOption } from "../types";

interface TransportViewProps {
  transport: TransportOption[];
  onNavigate: (view: string, prefillPrompt?: string) => void;
}

export default function TransportView({ transport, onNavigate }: TransportViewProps) {
  const [selectedTransit, setSelectedTransit] = useState<TransportOption | null>(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-brand-border pb-4">
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center space-x-2">
          <Compass className="w-5 h-5 text-brand-primary" />
          <span>Post-Match Transit Coordinator</span>
        </h2>
        <p className="text-xs text-brand-text-secondary mt-1">
          Coordinate your stadium departure using real-time timetable telemetry and environmental footprint guides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timetables Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono">
            Active Egress Timetables
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {transport.map((opt) => {
              const isGreen = opt.statusLevel === "green";
              const isOrange = opt.statusLevel === "orange";
              const isYellow = opt.statusLevel === "yellow";

              return (
                <div 
                  key={opt.name} 
                  onClick={() => setSelectedTransit(opt)}
                  className={`p-4 bg-brand-card hover:bg-brand-primary/5 border rounded-2xl cursor-pointer transition-all ${
                    selectedTransit?.name === opt.name ? "border-brand-primary" : "border-brand-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      isGreen ? "bg-brand-success/10 text-brand-success" : isOrange ? "bg-brand-danger/10 text-brand-danger" : "bg-yellow-400/10 text-yellow-400"
                    }`}>
                      {opt.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{opt.frequency}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{opt.name}</h4>
                  <p className="text-xs text-brand-text-secondary mt-1">{opt.status}</p>

                  <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-text-secondary font-mono">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{opt.estTravelTime}</span>
                    </span>
                    <span className="text-brand-primary hover:underline">Select Method</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Eco transit info banner */}
          <div className="p-4 bg-emerald-950/20 border border-brand-success/20 rounded-2xl flex items-start space-x-3">
            <Leaf className="w-5 h-5 text-brand-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Meadowlands Green Egress Initiative</p>
              <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed">
                Fans utilizing the **Metro Express** or walking trails bypass the standard motor taxi queue, preventing idling emissions. Reusable water station checkpoints are located directly outside the Metro Station gate.
              </p>
            </div>
          </div>
        </div>

        {/* Selected transit advice panel */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between h-fit">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2 border-b border-brand-border pb-3">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Transit AI Analyst</span>
            </h3>

            {selectedTransit ? (
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider">Selected Option</p>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedTransit.name}</p>
                  <p className="text-brand-text-secondary mt-1">Status: {selectedTransit.status}</p>
                </div>

                <div className="p-3 bg-brand-surface border border-brand-border rounded-xl space-y-2">
                  <p className="font-bold text-brand-primary">AI Recommendation:</p>
                  {selectedTransit.type === "Metro" ? (
                    <p className="text-brand-text-secondary leading-relaxed">
                      "Metro trains are arriving at 4-minute intervals. Pre-purchase transit tokens via the FIFA Portal to prevent ticketing bottlenecks. Board via Gate C bypass tunnels to save 15 minutes."
                    </p>
                  ) : selectedTransit.type === "Walking" ? (
                    <p className="text-brand-text-secondary leading-relaxed">
                      "Walking Meadowlands Trail is the fastest method to bypass congestion. Path is fully lit with security posts active. Refill water bottles at Sec 132 Eco Hub before embarking."
                    </p>
                  ) : (
                    <p className="text-brand-text-secondary leading-relaxed">
                      "Ride share and Bus Shuttles currently experience peak delay. Rerouting via Metro or walking is highly advised to optimize your post-match transit duration."
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onNavigate("chat", `Give me a dynamic post-match routing plan to NYC Manhattan from MetLife stadium utilizing: ${selectedTransit.name}`)}
                  className="w-full py-2 bg-brand-primary text-brand-bg font-bold rounded-lg text-xs hover:opacity-90 transition-all flex items-center justify-center space-x-1.5 glow-btn cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Request Custom AI Routing</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-brand-text-secondary italic">
                Select any active departures card on the left to activate the AI Transit Coordinator.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border space-y-1 text-[11px] text-brand-text-secondary">
            <p className="font-semibold text-white">Live-Updating Schedule</p>
            <p>Schedules are synced to the main Metropolitan Transit Authority and Aztec Metro Link channels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
