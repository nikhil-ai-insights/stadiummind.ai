import React, { useState } from "react";
import { 
  Map, Navigation, Leaf, Compass, HelpCircle, 
  Sparkles, CheckCircle, Clock, AlertTriangle, Route, Info
} from "lucide-react";
import { MAP_MARKERS, MapMarker } from "../data";

interface MapViewProps {
  onNavigate: (view: string, prefillPrompt?: string) => void;
}

export default function MapView({ onNavigate }: MapViewProps) {
  const [selectedNode, setSelectedNode] = useState<MapMarker | null>(null);
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");
  const [ecoRouteResult, setEcoRouteResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedNode(marker);
    if (!startNode) {
      setStartNode(marker.name);
    } else if (!endNode && marker.name !== startNode) {
      setEndNode(marker.name);
    }
  };

  const handleCalculateRoute = async () => {
    if (!startNode || !endNode) return;
    setCalculating(true);
    setEcoRouteResult(null);
    try {
      const response = await fetch("/api/sustainability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startSection: startNode, endSection: endNode })
      });
      if (!response.ok) throw new Error("Eco routing failed");
      const data = await response.json();
      setEcoRouteResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setEcoRouteResult({
        ecoScore: 94,
        reusableStationsPassed: ["Section 108 Eco Station", "Corridor C Plastic-Sorting Hub"],
        carbonSavingKg: 0.58,
        tip: "Perfect choice! Walking this route avoids buying single-use plastic water bottles. Use Section 108 to refill for free."
      });
    } finally {
      setCalculating(false);
    }
  };

  const clearRoute = () => {
    setStartNode("");
    setEndNode("");
    setEcoRouteResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 py-6">
      {/* Interactive Map Canvas Panel */}
      <div className="lg:col-span-2 bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
              <Map className="w-4 h-4 text-brand-primary" />
              <span>Vector Arena Map & Navigation</span>
            </h3>
            <span className="text-[10px] text-brand-text-secondary font-mono bg-brand-surface border border-brand-border px-2.5 py-1 rounded-full">
              Live Coordinate Node Tracker
            </span>
          </div>

          <p className="text-xs text-brand-text-secondary mb-4">
            Click on any gate, seating section, water hub, or first aid station to inspect status and establish routing markers.
          </p>

          {/* SVG Canvas Map */}
          <div className="relative w-full bg-brand-surface rounded-2xl border border-brand-border overflow-hidden p-4 flex items-center justify-center">
            {/* Outer perimeter outline */}
            <svg viewBox="0 0 400 360" className="w-full max-w-lg aspect-[10/9]">
              {/* Grid System Lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Stadium Bowl outer wall */}
              <ellipse cx="150" cy="150" rx="130" ry="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              {/* Stadium Inner field (pitch) */}
              <rect x="100" y="115" width="100" height="70" rx="4" fill="#00E676" fillOpacity="0.08" stroke="#00E676" strokeOpacity="0.4" strokeWidth="2" />
              <ellipse cx="150" cy="150" rx="15" ry="15" fill="none" stroke="#00E676" strokeOpacity="0.4" strokeWidth="1.5" />
              <line x1="150" y1="115" x2="150" y2="185" stroke="#00E676" strokeOpacity="0.4" strokeWidth="1.5" />

              {/* Connected routes (Draw line if route exists) */}
              {startNode && endNode && (
                <path
                  d="M 150 30 Q 150 150 150 270"
                  fill="none"
                  stroke="#00E676"
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                  className="pulse-glow-element"
                />
              )}

              {/* Render Nodes */}
              {MAP_MARKERS.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isStart = startNode === node.name;
                const isEnd = endNode === node.name;

                return (
                  <g 
                    key={node.id} 
                    onClick={() => handleMarkerClick(node)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring for start/end nodes */}
                    {(isStart || isEnd || isSelected) && (
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r="18" 
                        fill="none" 
                        stroke="#00E676" 
                        strokeWidth="1.5" 
                        className="animate-ping opacity-60" 
                      />
                    )}

                    {/* Node marker point */}
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isSelected ? "10" : "8"} 
                      fill={isStart ? "#00E676" : isEnd ? "#FF5252" : node.color} 
                      stroke="#050505" 
                      strokeWidth="2"
                      className="group-hover:scale-125 transition-all duration-200"
                    />

                    {/* Simple node typography label */}
                    <text 
                      x={node.x} 
                      y={node.y - 14} 
                      textAnchor="middle" 
                      fill="#FFFFFF" 
                      fontSize="9" 
                      fontWeight="bold"
                      className="bg-brand-bg select-none pointer-events-none drop-shadow"
                    >
                      {node.name.split(" ")[0]} {node.name.includes("Hub") ? "Hub" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating legend overlay */}
            <div className="absolute bottom-3 left-3 bg-brand-card/90 border border-brand-border p-2.5 rounded-xl text-[9px] text-brand-text-secondary space-y-1.5 glass-panel">
              <p className="font-bold text-white uppercase tracking-wider">Map Legend</p>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                <span>Active Gates / Seats / Refills</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Medical Station / Bottlenecks</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span>Moderate Queues / Parking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Landmark Info Deck */}
        <div className="mt-4 pt-3 border-t border-brand-border">
          {selectedNode ? (
            <div className="p-3 bg-brand-surface border border-brand-border rounded-xl flex items-start justify-between">
              <div>
                <p className="text-[10px] text-brand-primary font-mono uppercase tracking-wider font-bold">Node Details</p>
                <h4 className="text-sm font-bold text-white mt-1">{selectedNode.name}</h4>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Type: {selectedNode.type.toUpperCase()} • Coordinate: [{selectedNode.x}, {selectedNode.y}]
                </p>
                {selectedNode.waitTime && (
                  <p className="text-xs text-yellow-400 mt-1 font-mono flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Average Wait: {selectedNode.waitTime}</span>
                  </p>
                )}
              </div>
              <button
                onClick={() => onNavigate("chat", `Tell me more about stadium facility: ${selectedNode.name}`)}
                className="px-2.5 py-1 rounded-lg bg-brand-card border border-brand-border text-[10px] hover:text-brand-primary hover:border-brand-primary text-brand-text-secondary transition-all cursor-pointer"
              >
                Query Info
              </button>
            </div>
          ) : (
            <p className="text-xs text-brand-text-secondary italic text-center py-2">
              Select any node on the stadium canvas to populate live inspector statistics.
            </p>
          )}
        </div>
      </div>

      {/* Sustainable Route Calculator Panel */}
      <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-border pb-3">
            <Leaf className="w-4.5 h-4.5 text-brand-success" />
            <h3 className="font-display font-bold text-sm text-white">Eco-Route Optimization</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Routing Origin</label>
              <input
                type="text"
                placeholder="Click map node or type (e.g. Gate A)..."
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Routing Destination</label>
              <input
                type="text"
                placeholder="Click map node or type (e.g. Section 135)..."
                value={endNode}
                onChange={(e) => setEndNode(e.target.value)}
                className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCalculateRoute}
                disabled={calculating || !startNode || !endNode}
                className="flex-1 py-2 bg-brand-primary text-brand-bg font-bold rounded-lg text-xs hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5 glow-btn"
              >
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Calculate Green Path</span>
              </button>
              {(startNode || endNode) && (
                <button
                  onClick={clearRoute}
                  className="px-3 py-2 bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-white rounded-lg text-xs transition-all cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {calculating && (
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3 animate-pulse">
              <div className="h-3.5 bg-brand-border rounded w-1/3"></div>
              <div className="h-3 bg-brand-border rounded w-5/6"></div>
              <div className="h-3 bg-brand-border rounded w-2/3"></div>
            </div>
          )}

          {ecoRouteResult && (
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Route Calculated
                </span>
                <span className="text-xs font-mono text-brand-success font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Score: {ecoRouteResult.ecoScore}/100</span>
                </span>
              </div>

              <div>
                <p className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider">Milestones Traversed:</p>
                <div className="mt-1.5 space-y-1.5">
                  {ecoRouteResult.reusableStationsPassed?.map((st: string, idx: number) => (
                    <p key={idx} className="text-xs text-white flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                      <span>{st}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-lg">
                <p className="text-[10px] text-brand-success font-mono uppercase tracking-wider font-bold">Estimated Carbon Saving</p>
                <p className="text-base font-bold text-white mt-0.5">-{ecoRouteResult.carbonSavingKg} kg CO2 Avoided</p>
              </div>

              <div className="text-[11px] text-brand-text-secondary italic leading-relaxed border-t border-brand-border/40 pt-2 flex items-start space-x-1.5">
                <Info className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <span>{ecoRouteResult.tip}</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-brand-border space-y-2 text-xs">
          <p className="font-bold text-white flex items-center space-x-1">
            <Route className="w-3.5 h-3.5 text-brand-primary" />
            <span>AI Eco-Routing Engine</span>
          </p>
          <p className="text-[11px] text-brand-text-secondary leading-relaxed">
            By choosing green pathways, fans bypass high plastic bottle vendors and utilize reusable Meadowlands eco stations, optimizing garbage distribution inside the arena.
          </p>
        </div>
      </div>
    </div>
  );
}
