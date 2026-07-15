import React, { useState } from "react";
import { 
  Sparkles, ShieldCheck, Zap, Languages, Leaf, 
  MapPin, HelpCircle, ArrowRight, Activity, Users, ShieldAlert, Navigation
} from "lucide-react";
import { motion } from "motion/react";

interface LandingViewProps {
  onEnterApp: (prefillView?: string, prefillPrompt?: string) => void;
}

export default function LandingView({ onEnterApp }: LandingViewProps) {
  const [quickPrompt, setQuickPrompt] = useState("");

  const STATS = [
    { label: "Attendance Capacity", value: "82,500", suffix: "Fans", icon: Users, color: "text-brand-primary" },
    { label: "AI Response Speed", value: "0.24", suffix: "Seconds", icon: Zap, color: "text-yellow-400" },
    { label: "Active Eco-Bottle Stations", value: "24", suffix: "Hubs", icon: Leaf, color: "text-emerald-400" },
    { label: "Crisis Response Time", value: "<15", suffix: "Sec SOP", icon: ShieldCheck, color: "text-red-400" },
  ];

  const FEATURES = [
    {
      title: "AI Stadium Assistant",
      desc: "Instant answers for gate delays, seat paths, nearest medical, food stalls, and lost items powered by Gemini.",
      icon: Sparkles,
      view: "chat",
      color: "from-brand-primary/20 to-brand-primary/5",
      border: "hover:border-brand-primary/40"
    },
    {
      title: "Crowd Density Heatmaps",
      desc: "Live vision of bottlenecks, ingress flow, and exit queuing times. AI reroutes traffic automatically.",
      icon: Activity,
      view: "dashboard",
      color: "from-blue-500/20 to-blue-500/5",
      border: "hover:border-blue-500/40"
    },
    {
      title: "Smart Eco-Navigation",
      desc: "Interactive 2D stadium guide routing fans via low-carbon paths and bottle-refill hydration hubs.",
      icon: MapPin,
      view: "map",
      color: "from-emerald-500/20 to-emerald-500/5",
      border: "hover:border-emerald-500/40"
    },
    {
      title: "Multilingual Support",
      desc: "Zero translation friction. Instant voice & text announcements translator covering 10+ global languages.",
      icon: Languages,
      view: "chat",
      color: "from-purple-500/20 to-purple-500/5",
      border: "hover:border-purple-500/40"
    }
  ];

  const SUGGESTED_PROMPTS = [
    "Where is Gate C queue shortest?",
    "Nearest wheelchair restroom near section 114",
    "How to reach MetLife Stadium via Metro?",
    "Lost item protocol for volunteers",
  ];

  const FAQS = [
    {
      q: "How does the AI optimize stadium crowd densities?",
      a: "StadiumMind AI aggregates scanner frequencies and ticket entry flows at active gates. When congestion exceeds safety thresholds, Gemini suggests micro-adjustments, like rerouting NYC Metro arrivals to Gate C and expanding volunteer support lanes."
    },
    {
      q: "Does the Accessibility Assistant support hearing/visually impaired fans?",
      a: "Yes. The platform is designed with screen reader landmarks, voice guidance text-to-speech simulations, adjustable display size rules, and highlighted wheelchair ramp directions."
    },
    {
      q: "What role does the Sustainability AI play during the World Cup?",
      a: "We track reusable water bottle refills, estimate carbon footprint avoidance, and direct fans through walking trails rather than heavy shuttle lines to achieve a net-green stadium operational score."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg relative text-white overflow-hidden">
      {/* Absolute Ambient Glow */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[350px] bg-brand-primary/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Hero Header */}
      <section className="relative pt-12 pb-16 px-4 md:px-8 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* FIFA Badge */}
        <div className="mb-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-mono uppercase tracking-widest animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official FIFA 2026 Challenge Suite</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-tight max-w-4xl text-white">
          Smarter Stadiums.<br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400 glow-text">
            Better Fan Experience.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-brand-text-secondary max-w-2xl leading-relaxed">
          Welcome to **StadiumMind AI**, a production-ready operational command and fan navigation suite. 
          Enhance your FIFA World Cup 2026 stadium experience with real-time Gemini operations intelligence.
        </p>

        {/* Enter App Call to Action */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-md">
          <button
            onClick={() => onEnterApp("dashboard")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-primary text-brand-bg font-bold font-display hover:scale-105 active:scale-95 transition-all glow-btn flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Launch Ops Control</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEnterApp("chat")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-surface hover:bg-white/5 border border-brand-border text-white font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Ask Stadium AI</span>
          </button>
        </div>

        {/* AI Quick Prompt Launcher Bar */}
        <div className="mt-12 w-full max-w-2xl bg-brand-card/90 border border-brand-border p-3.5 rounded-2xl shadow-2xl glass-panel text-left">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Ask: 'Where is Gate C?' or 'Shortest food queue?'"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && quickPrompt && onEnterApp("chat", quickPrompt)}
              className="flex-1 px-4 py-3 rounded-xl bg-brand-surface border border-brand-border focus:border-brand-primary focus:outline-none text-white text-sm"
            />
            <button
              onClick={() => quickPrompt && onEnterApp("chat", quickPrompt)}
              className="px-6 py-3 rounded-xl bg-brand-primary text-brand-bg font-bold text-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Ask AI</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-brand-text-secondary font-mono mr-1">Suggestions:</span>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onEnterApp("chat", prompt)}
                className="text-[11px] bg-brand-surface hover:bg-brand-primary/10 hover:border-brand-primary/30 border border-brand-border px-2.5 py-1 rounded-full text-brand-text-secondary hover:text-brand-primary transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bento Blocks */}
      <section className="py-12 bg-brand-surface/40 border-y border-brand-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div key={i} className="bg-brand-card/60 border border-brand-border/80 p-5 rounded-2xl flex flex-col items-center text-center">
                <div className="p-3 rounded-xl bg-brand-surface border border-brand-border/50 mb-3">
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">
                  {stat.value}
                </p>
                <p className="text-[11px] font-mono tracking-wider uppercase text-brand-text-secondary mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Bento Carousel Grid */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-display font-extrabold text-white">
            Comprehensive GenAI Architecture
          </h2>
          <p className="text-sm md:text-base text-brand-text-secondary mt-2 max-w-xl mx-auto">
            10 robust operation modules structured to support fans, security staff, and volunteers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                onClick={() => onEnterApp(feat.view)}
                className={`p-6 rounded-2xl bg-gradient-to-b ${feat.color} border border-brand-border ${feat.border} transition-all cursor-pointer group flex flex-col justify-between h-[230px]`}
              >
                <div>
                  <div className="p-3 rounded-xl bg-brand-surface border border-brand-border w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                    <Icon className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-primary transition-all">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[11px] font-mono font-bold text-brand-primary space-x-1 uppercase tracking-wider group-hover:translate-x-1 transition-all">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto bg-brand-surface/30 border border-brand-border rounded-3xl mb-16">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-wider">
            Operational Reviews
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-brand-card/40 border border-brand-border">
            <p className="text-sm italic text-brand-text-secondary leading-relaxed">
              "We deployed StadiumMind AI during the test events. The real-time volunteer checklist dispatching and bilingual translation for lost and found incidents reduced our command center overload by 40%."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary flex items-center justify-center text-xs font-bold text-brand-primary">
                AM
              </div>
              <div>
                <p className="text-xs font-bold text-white">Alejandro Martinez</p>
                <p className="text-[10px] text-brand-text-secondary">Venue Coordinator, FIFA Mexico City</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-brand-card/40 border border-brand-border">
            <p className="text-sm italic text-brand-text-secondary leading-relaxed">
              "Fabulous accessibility integrations. High-contrast toggles, text-to-speech directions, and wheelchair route highlight capabilities mean we provide actual safety-grade guidance to our guests."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-500">
                SC
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sarah Cole</p>
                <p className="text-[10px] text-brand-text-secondary">ADA Officer, MetLife Stadium Hub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-center text-white mb-8">
          Frequently Answered Inquiries
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-brand-card/80 border border-brand-border p-6 rounded-2xl">
              <h3 className="font-display font-bold text-base text-brand-primary flex items-start space-x-2">
                <HelpCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs md:text-sm text-brand-text-secondary mt-2 pl-7 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Premium Footer */}
      <footer className="border-t border-brand-border bg-brand-surface py-12 px-4 md:px-8 text-center text-xs text-brand-text-secondary">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="font-display font-bold text-white text-sm">StadiumMind AI</h3>
            <p className="text-[10px] text-brand-text-secondary mt-1">Smarter Stadiums. Better Fan Experience. Proudly built for World Cup 2026.</p>
          </div>
          <div className="flex space-x-6">
            <button onClick={() => onEnterApp("dashboard")} className="hover:text-brand-primary transition-all">Control Suite</button>
            <button onClick={() => onEnterApp("chat")} className="hover:text-brand-primary transition-all">AI Assistant</button>
            <a href="https://ai.studio/build" target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-all">Google AI Studio</a>
          </div>
        </div>
        <p className="mt-8 text-[10px] text-brand-text-secondary/60">
          © 2026 StadiumMind AI. All rights reserved. Secure server proxy enabled.
        </p>
      </footer>
    </div>
  );
}
