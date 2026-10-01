import React, { useState, useEffect } from "react";
import { Bot, Sparkles, X, Zap } from "lucide-react";

export function BuyerCopilotFloatingButton({ onClick, hasInteracted = false }) {
  const [showTooltip, setShowTooltip] = useState(!hasInteracted);

  useEffect(() => {
    // Auto-dismiss tooltip after 10s if not interacted
    const timer = setTimeout(() => setShowTooltip(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 animate-fade-in">
      {/* Interactive Tooltip Callout */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-emerald-500/30 shadow-2xl text-xs font-bold text-[var(--paper)] backdrop-blur-xl animate-bounce-subtle">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
            <Sparkles size={13} />
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--paper)] font-black">Can't decide on an item?</span>
            <span className="text-[10px] text-[var(--mist)]">Give 2-3 details & get the best verified deal</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="p-1 text-[var(--mist)] hover:text-[var(--paper)] rounded-full hover:bg-[var(--surface2)] cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Floating Glowing Button */}
      <button
        onClick={() => {
          setShowTooltip(false);
          onClick();
        }}
        className="relative group flex items-center gap-2.5 px-4 sm:px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-2xl shadow-teal-500/35 hover:shadow-teal-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-white/20"
        title="Open Buyer Copilot AI"
      >
        {/* Pulsing indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-xs" />
        </span>

        <Bot size={19} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="tracking-wider font-black">BUYER COPILOT</span>
        <span className="px-1.5 py-0.5 rounded-md bg-black/30 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider text-emerald-300 border border-white/10">
          AI
        </span>
      </button>
    </div>
  );
}
