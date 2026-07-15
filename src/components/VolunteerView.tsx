import React, { useState } from "react";
import { 
  ClipboardList, Search, Plus, CheckCircle2, 
  HelpCircle, Sparkles, RefreshCw, AlertCircle, BookmarkCheck
} from "lucide-react";
import { VolunteerTask } from "../types";

interface VolunteerViewProps {
  tasks: VolunteerTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, category: string) => void;
}

const CATEGORIES = ["General", "Lost & Found", "Medical SOP", "Crowd Control"];

export default function VolunteerView({
  tasks,
  onToggleTask,
  onAddTask
}: VolunteerViewProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("General");
  
  const [sopCategory, setSopCategory] = useState("Lost & Found");
  const [sopQuery, setSopQuery] = useState("");
  const [sopResult, setSopResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const [lostItemName, setLostItemName] = useState("");
  const [lostItemLoc, setLostItemLoc] = useState("");
  const [lostItems, setLostItems] = useState<Array<{ name: string; loc: string; status: string }>>([
    { name: "iPhone 15 Pro (Red Case)", loc: "Section 114 Row F", status: "Handed to Gate D Security" },
    { name: "Leather Wallet (Black)", loc: "Metro Station Exit Gates", status: "Registered at HQ desk" }
  ]);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskCategory);
    setNewTaskTitle("");
  };

  const handleRegisterLostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostItemName.trim() || !lostItemLoc.trim()) return;
    setLostItems([...lostItems, { name: lostItemName, loc: lostItemLoc, status: "Pending Registration" }]);
    setLostItemName("");
    setLostItemLoc("");
  };

  const handleSopSearch = async () => {
    setSearching(true);
    setSopResult(null);
    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: sopCategory, query: sopQuery || "Standard Lost Case Procedure" })
      });
      if (!response.ok) throw new Error("Failed to search SOPs");
      const data = await response.json();
      setSopResult(data);
    } catch (err) {
      console.error(err);
      setSopResult({
        answer: "Escort lost fans to nearest Gate security hub. Collect details (match ticket section, clothes worn). Check database.",
        checklist: ["Ask for parents' phone number", "Do not broadcast child name publicly on speakers", "Page dispatcher on radio channel 5"]
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="border-b border-brand-border pb-4">
        <h2 className="text-xl md:text-2xl font-display font-black text-white flex items-center space-x-2">
          <ClipboardList className="w-5 h-5 text-brand-primary" />
          <span>Volunteer Support Dashboard</span>
        </h2>
        <p className="text-xs text-brand-text-secondary mt-1">
          Review active task assignments, query Gemini-generated emergency protocols, and log recovered lost-and-found belongings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Task Checklist & Task Adder */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono">
            Active Duty Task Assignments
          </h3>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                  task.completed 
                    ? "bg-brand-surface/30 border-brand-border text-brand-text-secondary opacity-60 line-through" 
                    : "bg-brand-surface border-brand-border hover:border-brand-primary text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    task.category === "Medical SOP" ? "bg-brand-danger" : task.category === "Crowd Control" ? "bg-yellow-400" : "bg-brand-primary"
                  }`}></span>
                  <div>
                    <p className="font-medium leading-snug">{task.title}</p>
                    <p className="text-[10px] text-brand-text-secondary font-mono mt-0.5">{task.assignedTo} • {task.category}</p>
                  </div>
                </div>
                <BookmarkCheck className={`w-4.5 h-4.5 flex-shrink-0 ${task.completed ? "text-brand-primary" : "text-brand-border"}`} />
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTaskSubmit} className="border-t border-brand-border pt-4 space-y-3">
            <p className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider">Assign New Task</p>
            <input
              type="text"
              placeholder="e.g. Conduct water station check (Sec 132)..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
            />
            <div className="flex gap-2">
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="text-xs bg-brand-surface border border-brand-border text-white rounded-lg p-2 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="submit"
                className="flex-1 py-2 bg-brand-primary text-brand-bg font-bold rounded-lg text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Task</span>
              </button>
            </div>
          </form>
        </div>

        {/* Center: SOP Search via Gemini */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5 border-b border-brand-border pb-3">
              <Sparkles className="w-4 h-4 text-brand-primary pulse-glow-element" />
              <span>Gemini Operational SOP Search</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">SOP Incident Category</label>
                <select
                  value={sopCategory}
                  onChange={(e) => setSopCategory(e.target.value)}
                  className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider block mb-1">Specific Incident Details</label>
                <input
                  type="text"
                  placeholder="e.g. Lost child in Section 128 wearing red cap..."
                  value={sopQuery}
                  onChange={(e) => setSopQuery(e.target.value)}
                  className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSopSearch}
                disabled={searching}
                className="w-full py-2 bg-brand-surface border border-brand-border hover:border-brand-primary text-white hover:text-brand-primary rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                {searching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5 text-brand-primary" />}
                <span>Fetch AI Protocol SOP</span>
              </button>
            </div>

            {searching && (
              <div className="p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3 animate-pulse">
                <div className="h-3 bg-brand-border rounded w-1/3"></div>
                <div className="h-3 bg-brand-border rounded w-5/6"></div>
              </div>
            )}

            {sopResult && (
              <div className="p-4 bg-brand-surface border border-brand-border rounded-xl space-y-3 text-xs leading-relaxed">
                <div>
                  <p className="text-[9px] text-brand-primary font-mono uppercase tracking-wider font-bold">Standard Procedure</p>
                  <p className="text-white mt-0.5">{sopResult.answer}</p>
                </div>
                <div>
                  <p className="text-[9px] text-yellow-400 font-mono uppercase tracking-wider font-bold">SOP Step Checklist</p>
                  <div className="mt-1 space-y-1">
                    {sopResult.checklist?.map((item: string, idx: number) => (
                      <p key={idx} className="text-brand-text-secondary flex items-start space-x-1.5">
                        <span className="text-brand-primary font-bold">•</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-brand-border text-xs text-brand-text-secondary leading-snug flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-brand-primary flex-shrink-0" />
            <span>AI protocols dynamically check stadium-specific dispatch configurations, ensuring volunteers cooperate safely with security.</span>
          </div>
        </div>

        {/* Right Column: Lost & Found Registry */}
        <div className="bg-brand-card border border-brand-border p-5 rounded-2xl flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider font-mono border-b border-brand-border pb-3">
              Lost & Found Dispatch Log
            </h3>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {lostItems.map((item, i) => (
                <div key={i} className="p-2.5 bg-brand-surface border border-brand-border rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <p className="text-[10px] text-brand-text-secondary mt-0.5">Found at: {item.loc}</p>
                  </div>
                  <span className="text-[9px] font-mono bg-brand-card border border-brand-border text-brand-primary px-2 py-0.5 rounded-full font-bold">
                    {item.status.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleRegisterLostItem} className="border-t border-brand-border pt-3 space-y-2.5">
              <p className="text-[10px] text-brand-text-secondary font-mono uppercase tracking-wider">Log Recovered Item</p>
              <input
                type="text"
                placeholder="Item name/description..."
                value={lostItemName}
                onChange={(e) => setLostItemName(e.target.value)}
                className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Specific location found..."
                value={lostItemLoc}
                onChange={(e) => setLostItemLoc(e.target.value)}
                className="w-full text-xs bg-brand-surface border border-brand-border focus:border-brand-primary text-white rounded-lg p-2 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!lostItemName.trim() || !lostItemLoc.trim()}
                className="w-full py-1.5 bg-brand-surface border border-brand-border hover:border-brand-primary text-white hover:text-brand-primary text-xs font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                Log Recovered Item
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
