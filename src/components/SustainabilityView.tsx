import React, { useState } from "react";
import { 
  Leaf, Zap, Activity, HelpCircle, Sparkles, 
  Trash2, Footprints, Plus, Compass, Info, CheckCircle
} from "lucide-react";

interface SustainabilityViewProps {
  onNavigate: (view: string, prefillPrompt?: string) => void;
}

export default function SustainabilityView({ onNavigate }: SustainabilityViewProps) {
  const [station1Count, setStation1Count] = useState(1420);
  const [station2Count, setStation2Count] = useState(2980);
  
  const [travelDistance, setTravelDistance] = useState("15");
  const [transitMethod, setTransitMethod] = useState("Metro");
  const [carbonOffset, setCarbonOffset] = useState<number | null>(null);

  const handleRefillSimulate = (stationNum: number) => {
    if (stationNum === 1) {
      setStation1Count(prev => prev + 1);
    } else {
      setStation2Count(prev => prev + 1);
    }
  };

  const handleCalculateOffset = () => {
    const dist = parseFloat(travelDistance);
    if (isNaN(dist) || dist <= 0) return;
    
    // Standard car emissions: ~0.17 kg CO2 per kilometer
    const carEmissions = dist * 0.17;
    let methodEmissions = 0;
    
    if (transitMethod === "Metro") {
      methodEmissions = dist * 0.02; // ultra low
    } else if (transitMethod === "Bus") {
      methodEmissions = dist * 0.05;
    } else if (transitMethod === "Ride Share") {
      methodEmissions = dist * 0.11;
    } else if (transitMethod === "Walking") {
      methodEmissions = 0;
    }
    
    const saved = carEmissions - methodEmissions;
    setCarbonOffset(parseFloat(saved.toFixed(2)));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-brand-border pb-4">
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-brand-primary" />
          <span>Sustainability & Eco Hub</span>
        </h2>
        <p className="text-xs text-brand-text-secondary mt-1">
          Monitor arena carbon mitigation, simulate water bottle refill counts, and evaluate carbon footprints using transit metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Eco telemetry cards */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono">
            Meadowlands Green Stats
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <p className="text-2xl font-display font-black text-brand-primary">182.4 kg</p>
              <p className="text-[10px] text-brand-text-secondary font-mono uppercase mt-1">Total CO2 Saved</p>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
              <p className="text-2xl font-display font-black text-brand-primary">
                {(station1Count + station2Count).toLocaleString()}
              </p>
              <p className="text-[10px] text-brand-text-secondary font-mono uppercase mt-1">Plastics Avoided</p>
            </div>
          </div>

          {/* Interactive Stations */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider">Hydration Hub Telemetry</p>
            
            <div className="p-3 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white">Refill Hub (Sec 108)</h4>
                <p className="text-brand-text-secondary mt-0.5">{station1Count} refilled bottles</p>
              </div>
              <button
                onClick={() => handleRefillSimulate(1)}
                className="px-2.5 py-1 rounded bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-[10px] hover:bg-brand-primary/20 transition-all font-bold cursor-pointer"
              >
                + Refill
              </button>
            </div>

            <div className="p-3 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white">Refill Hub (Sec 132)</h4>
                <p className="text-brand-text-secondary mt-0.5">{station2Count} refilled bottles</p>
              </div>
              <button
                onClick={() => handleRefillSimulate(2)}
                className="px-2.5 py-1 rounded bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-[10px] hover:bg-brand-primary/20 transition-all font-bold cursor-pointer"
              >
                + Refill
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Carbon Footprint Calculator */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5 border-b border-brand-border pb-3">
              <Footprints className="w-4.5 h-4.5 text-brand-primary" />
              <span>Carbon Offset Calculator</span>
            </h3>

            <p className="text-xs text-brand-text-secondary leading-relaxed">
              Estimate your personal emissions reduction by comparing public transit departures against conventional motor travel.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Travel Distance (Kilometers)</label>
                <input
                  type="number"
                  value={travelDistance}
                  onChange={(e) => setTravelDistance(e.target.value)}
                  className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Transit Choice</label>
                <select
                  value={transitMethod}
                  onChange={(e) => setTransitMethod(e.target.value)}
                  className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
                >
                  <option value="Metro">Metro Link Express</option>
                  <option value="Bus">Stadium Eco Shuttle</option>
                  <option value="Ride Share">Ride Share Pool</option>
                  <option value="Walking">Walking Eco-Trail</option>
                </select>
              </div>

              <button
                onClick={handleCalculateOffset}
                className="w-full py-2 bg-brand-primary text-brand-bg font-bold rounded-lg text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-1 cursor-pointer glow-btn"
              >
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span>Evaluate Carbon Saving</span>
              </button>
            </div>

            {carbonOffset !== null && (
              <div className="p-3.5 bg-brand-surface border border-brand-primary/30 rounded-xl space-y-2 text-xs">
                <p className="text-[9px] text-brand-primary font-mono uppercase tracking-wider font-bold">Calculation Result</p>
                <p className="text-sm font-bold text-white leading-snug">
                  You avoid <span className="text-brand-success">{carbonOffset} kg CO2</span> compared to standard motor travel.
                </p>
                <p className="text-[10px] text-brand-text-secondary leading-relaxed">
                  Equivalent to planting approximately {Math.max(1, Math.round(carbonOffset * 0.05))} tree seedlings growing for a week!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Eco Recommendation panel */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2 border-b border-brand-border pb-3">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Sustainability Advisor AI</span>
            </h3>

            <p className="text-xs text-brand-text-secondary leading-relaxed">
              Consult the Gemini operations advisor on waste-segregation policies, reusable bottle sponsorships, or green trail crowd management.
            </p>

            <div className="p-3.5 bg-brand-surface border border-brand-border rounded-xl space-y-2 text-xs">
              <p className="font-bold text-brand-primary">Active Directives:</p>
              <p className="text-brand-text-secondary leading-relaxed">
                "Directing 15% of outgoing NYC metro traffic through the Meadowlands Eco trail offsets stadium peak grid demand, keeping our eco ranking score at Level A."
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border">
            <button
              onClick={() => onNavigate("chat", "Give me an operational overview of the FIFA 2026 Stadium sustainability targets.")}
              className="text-xs font-bold text-brand-primary hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Query targets on Chat</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
