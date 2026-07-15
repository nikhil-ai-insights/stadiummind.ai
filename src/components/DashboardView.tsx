import React, { useState, useEffect } from "react";
import { 
  Activity, Users, Clock, Leaf, AlertTriangle, 
  Sparkles, RotateCcw, TrendingUp, Compass, ArrowRight, CheckCircle
} from "lucide-react";
import { Gate, Match, TransportOption } from "../types";

interface DashboardViewProps {
  matches: Match[];
  gates: { [key: string]: Gate };
  transport: TransportOption[];
  onTriggerGoal: () => void;
  onSimulateInflow: () => void;
  onNavigate: (view: string, prefillPrompt?: string) => void;
}

export default function DashboardView({
  matches,
  gates,
  transport,
  onTriggerGoal,
  onSimulateInflow,
  onNavigate
}: DashboardViewProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [errorInsights, setErrorInsights] = useState("");

  const activeMatch = matches.find(m => m.status === "Live") || matches[0];

  const fetchAIInsights = async () => {
    setLoadingInsights(true);
    setErrorInsights("");
    try {
      const response = await fetch("/api/organizer/insights");
      if (!response.ok) {
        throw new Error("Failed to load organizer insights");
      }
      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      console.error(err);
      setErrorInsights(err.message || "Error reaching AI proxy.");
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <h2 className="text-2xl font-display font-black tracking-tight text-white flex items-center">
            Stadium Operations Cockpit
          </h2>
          <p className="text-xs text-brand-text-secondary mt-1">
            Real-time FIFA World Cup 2026 telemetry and predictive crowd intelligence.
          </p>
        </div>
        
        {/* Dynamic Controls / Simulators */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onTriggerGoal}
            className="px-3.5 py-1.5 rounded-lg bg-brand-primary text-brand-bg font-mono font-bold text-xs hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 glow-btn cursor-pointer"
          >
            <span>⚽ Trigger USA Goal</span>
          </button>
          <button
            onClick={onSimulateInflow}
            className="px-3.5 py-1.5 rounded-lg bg-brand-surface border border-brand-border hover:bg-white/5 text-white font-mono text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
            <span>⚡ Sim Ingress Spike</span>
          </button>
          <button
            onClick={fetchAIInsights}
            className="p-1.5 rounded-lg bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-white hover:border-brand-primary transition-all cursor-pointer"
            title="Reload AI Insights"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Active Match Card */}
        <div className="md:col-span-2 bg-brand-card border border-brand-border/80 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-brand-danger/10 border border-brand-danger/20 text-brand-danger font-bold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-danger animate-ping"></span>
              <span>{activeMatch.stage}</span>
            </span>
            <span className="text-xs font-mono text-brand-text-secondary">NY Stadium (MetLife)</span>
          </div>
          
          <div className="flex items-center justify-around py-2">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-white">{activeMatch.teamA}</p>
              <p className="text-xs text-brand-text-secondary">Host</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-brand-surface border border-brand-border">
              <p className="text-3xl font-mono font-black text-brand-primary glow-text tracking-wider">{activeMatch.score}</p>
              <p className="text-[10px] font-mono text-brand-danger mt-1 animate-pulse">{activeMatch.currentMinute}' MIN</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-white">{activeMatch.teamB}</p>
              <p className="text-xs text-brand-text-secondary">Visitor</p>
            </div>
          </div>
        </div>

        {/* Live Attendance */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs text-brand-text-secondary font-mono uppercase tracking-wider">Attendance</p>
            <Users className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-display font-black text-white">
              {activeMatch.attendance.toLocaleString()}
            </p>
            <div className="mt-1 w-full bg-brand-surface h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-brand-primary h-full transition-all duration-1000" 
                style={{ width: `${(activeMatch.attendance / 82500) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-brand-text-secondary mt-1 text-right">
              {((activeMatch.attendance / 82500) * 100).toFixed(1)}% Arena Capacity
            </p>
          </div>
        </div>

        {/* Crowd Density Card */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs text-brand-text-secondary font-mono uppercase tracking-wider">Crowd Density Index</p>
            <Activity className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-display font-black text-yellow-400">78%</p>
            <div className="mt-1 flex items-center space-x-1 text-[11px] text-brand-text-secondary">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span>Yellow Alert: Ingress bottlenecking</span>
            </div>
            <p className="text-[10px] text-brand-text-secondary mt-1">Recommended: Divert traffic to Gate C</p>
          </div>
        </div>
      </div>

      {/* Detail Rows (Gate Delays + Gemini Smart Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gate Delay Telemetry */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>Gate Queuing Times</span>
            </h3>
            <span className="text-[10px] font-mono bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">
              Live Scans
            </span>
          </div>

          <div className="space-y-3">
            {Object.values(gates).map((gate) => {
              const isHigh = gate.waitTime.includes("25") || gate.waitTime.includes("20");
              const isLow = gate.waitTime.includes("5") || gate.waitTime.includes("2");
              const barWidth = gate.waitTime.includes("25") ? "w-4/5" : gate.waitTime.includes("12") ? "w-1/2" : "w-1/4";
              
              return (
                <div key={gate.name} className="p-3 bg-brand-surface border border-brand-border rounded-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{gate.name}</span>
                    <span className={`font-mono font-bold ${isHigh ? "text-brand-danger" : isLow ? "text-brand-success" : "text-yellow-400"}`}>
                      {gate.waitTime}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-brand-card h-1 rounded-full overflow-hidden">
                    <div className={`h-full ${isHigh ? "bg-brand-danger" : isLow ? "bg-brand-success" : "bg-yellow-400"} ${barWidth}`}></div>
                  </div>
                  <p className="text-[10px] text-brand-text-secondary mt-1">{gate.queues} • access to {gate.accessTo.split(",")[0]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gemini Generated Smart Recommendations */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-primary pulse-glow-element" />
                <span>AI Operational Recommendations</span>
              </h3>
              <span className="text-[10px] font-mono text-brand-text-secondary">
                Model: gemini-3.5-flash
              </span>
            </div>

            <div className="py-4">
              {loadingInsights ? (
                <div className="space-y-3">
                  <div className="h-4 bg-brand-surface rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-brand-surface rounded-full w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-brand-surface rounded-full w-2/3 animate-pulse"></div>
                </div>
              ) : errorInsights ? (
                <div className="p-4 bg-brand-danger/10 border border-brand-danger/20 rounded-xl text-brand-danger text-xs">
                  <p className="font-bold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Failed to query AI insights</span>
                  </p>
                  <p className="mt-1 opacity-80">{errorInsights}. Currently showing default recommendations.</p>
                </div>
              ) : insights ? (
                <div className="space-y-3.5">
                  <div className="flex items-start space-x-2.5 bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Flow Assessment: Alert {insights.alertLevel}</p>
                      <p className="text-[11px] text-brand-text-secondary mt-0.5">{insights.crowdTrend}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-brand-primary uppercase font-mono">Immediate Actions Required:</p>
                    {insights.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-brand-text-secondary">
                        <span className="text-brand-primary font-bold mt-0.5">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-brand-surface/60 border border-brand-border rounded-xl">
                    <p className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1.5">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Eco Optimization Insight</span>
                    </p>
                    <p className="text-[11px] text-brand-text-secondary mt-0.5">{insights.greenOptimization}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-brand-text-secondary">No recommendations loaded. Tap reload icon to query.</p>
              )}
            </div>
          </div>

          <div className="border-t border-brand-border pt-3 flex items-center justify-between">
            <button
              onClick={() => onNavigate("chat", "Give me a crowd mitigation plan for New York stadium Gate B bottleneck.")}
              className="text-xs font-bold text-brand-primary flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span>Consult Assistant for details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-brand-text-secondary italic">Last updated: Just now</span>
          </div>
        </div>
      </div>

      {/* Lower Dashboard Blocks (Eco Saving and Public Transit Status) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environmental sustainability telemetry */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2 border-b border-brand-border pb-3 mb-4">
              <Leaf className="w-4 h-4 text-brand-primary" />
              <span>Environmental & Carbon Analytics</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-brand-surface border border-brand-border rounded-xl text-center">
                <p className="text-2xl font-display font-black text-brand-success">182.4 kg</p>
                <p className="text-[10px] text-brand-text-secondary font-mono uppercase mt-1">CO2 Emissions Avoided</p>
              </div>
              <div className="p-3 bg-brand-surface border border-brand-border rounded-xl text-center">
                <p className="text-2xl font-display font-black text-brand-success">4,400</p>
                <p className="text-[10px] text-brand-text-secondary font-mono uppercase mt-1">Free Water Bottle Refills</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-brand-surface border border-brand-border/60 rounded-xl">
              <p className="text-xs text-brand-text-secondary flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>**Sustainability Score**: **92/100** (MetLife Eco-Level A). Zero-single-use plastics deployment active.</span>
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
            <span className="text-brand-text-secondary">Eco-Paths Active</span>
            <button 
              onClick={() => onNavigate("sustainability")}
              className="text-brand-primary font-bold hover:underline cursor-pointer"
            >
              Configure Eco Hub
            </button>
          </div>
        </div>

        {/* Public Transport Telemetry */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2 border-b border-brand-border pb-3 mb-4">
              <Compass className="w-4 h-4 text-brand-primary" />
              <span>Public Transit & Egress Status</span>
            </h3>

            <div className="space-y-2">
              {transport.map((opt) => (
                <div key={opt.name} className="flex items-center justify-between p-2 rounded-lg bg-brand-surface/60 border border-brand-border text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.statusLevel === "green" ? "bg-brand-success" : opt.statusLevel === "yellow" ? "bg-yellow-400" : "bg-brand-danger"}`}></span>
                    <span className="text-white font-medium">{opt.name.split("(")[0]}</span>
                  </div>
                  <div className="text-right text-brand-text-secondary font-mono text-[11px]">
                    <p className="text-white">{opt.frequency}</p>
                    <p className="text-[10px] opacity-75">Est: {opt.estTravelTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
            <span className="text-brand-text-secondary">Optimal Method: Metro Express</span>
            <button 
              onClick={() => onNavigate("transport")}
              className="text-brand-primary font-bold hover:underline cursor-pointer"
            >
              Route Transit AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
