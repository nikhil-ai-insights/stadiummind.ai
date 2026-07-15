import React from "react";
import { Sparkles, Calendar, Settings, Shield, User } from "lucide-react";
import { STADIUM_NAME } from "../data";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSettings: () => void;
  matchTimer: string;
  isHighContrast: boolean;
}

export default function Navbar({
  currentView,
  onNavigate,
  onOpenSettings,
  matchTimer,
  isHighContrast
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-brand-border py-3 px-4 md:px-8 flex items-center justify-between">
      {/* Brand Logo & Name */}
      <div 
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => onNavigate("landing")}
      >
        <div className="w-10 h-10 rounded-xl bg-[#00E676] flex items-center justify-center shadow-[0_0_20px_rgba(0,230,118,0.45)]">
          <Sparkles className="w-5 h-5 text-black pulse-glow-element fill-black" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-display font-black tracking-tight text-white uppercase italic flex items-center">
            Stadium<span className="text-[#00E676]">Mind</span>
            <span className="hidden sm:inline-flex ml-2.5 px-2.5 py-0.5 bg-[#00E676]/10 text-[#00E676] text-[9px] rounded-full border border-[#00E676]/20 font-mono tracking-normal not-italic uppercase font-bold">World Cup 2026 Edition</span>
          </h1>
          <p className="text-[10px] text-brand-text-secondary font-mono tracking-wider uppercase">
            MetLife Stadium • New Jersey • Match Day 14
          </p>
        </div>
      </div>

      {/* Center Live Match Indicator */}
      <div className="hidden lg:flex items-center space-x-4 bg-brand-surface/80 border border-brand-border px-4 py-1.5 rounded-full">
        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-mono font-medium text-white">USA vs ITA</span>
        </div>
        <div className="w-[1px] h-4 bg-brand-border"></div>
        <div className="text-xs font-mono text-brand-primary flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>LIVE: NY Stadium • {matchTimer}</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Quick View Navigation Triggers */}
        <button
          onClick={() => onNavigate("emergency")}
          className="px-3 py-1.5 rounded-lg bg-brand-danger/10 border border-brand-danger/30 hover:bg-brand-danger/25 text-brand-danger text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
          aria-label="Trigger Emergency Protocol"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SOS Ops</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-brand-surface hover:bg-white/5 border border-brand-border text-brand-text-secondary hover:text-white transition-all cursor-pointer"
          aria-label="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Profile indicator */}
        <div className="flex items-center space-x-2 pl-1.5 border-l border-brand-border">
          <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary font-mono text-xs font-bold">
            <User className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[11px] leading-none font-semibold text-white">HQ-Ops-3</p>
            <p className="text-[9px] text-brand-text-secondary">Supervisor</p>
          </div>
        </div>
      </div>
    </header>
  );
}
