import React, { useState, useRef } from "react";
import { Sparkles, ArrowLeftRight, Activity } from "lucide-react";

export function NegotiationWaveRibbon({
  title = "Bilateral Negotiation Waveform",
  subtitle = "Dynamic Buyer-Seller Fair Market Equilibrium",
  compact = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative w-full overflow-hidden select-none transition-all duration-500 ${
        compact ? "py-4 my-6" : "py-8 my-10"
      }`}
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      {/* Background Soft Glow Aura */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-30 blur-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(ellipse 60% 80% at ${mousePos.x * 100}% 50%, rgba(16, 185, 129, 0.4), rgba(245, 158, 11, 0.25), transparent 75%)`
            : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(16, 185, 129, 0.2), rgba(245, 158, 11, 0.15), transparent 75%)",
        }}
      />

      {/* SVG Multi-Layer Sine Wave Canvas */}
      <div className="relative w-full h-16 md:h-20 flex items-center justify-center">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-full preserve-3d overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Buyer Mint-Emerald Gradient */}
            <linearGradient id="buyer-sine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#34D399" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="1" />
              <stop offset="75%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
            </linearGradient>

            {/* Seller Burnished-Gold Gradient */}
            <linearGradient id="seller-sine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.1" />
              <stop offset="30%" stopColor="#FBBF24" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
              <stop offset="70%" stopColor="#D97706" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="ribbon-glow" x="-20%" y="-30%" width="140%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Harmonic Grid Guidelines */}
          <line
            x1="0"
            y1="60"
            x2="1200"
            y2="60"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeDasharray="4 6"
          />

          {/* 1. Buyer Sine Wave (Emerald Demand Oscillation) */}
          <path
            d="M0,60 C150,15 300,105 450,60 C600,15 750,105 900,60 C1050,15 1200,60 1200,60"
            fill="none"
            stroke="url(#buyer-sine-grad)"
            strokeWidth={isHovered ? "3.2" : "2.4"}
            filter="url(#ribbon-glow)"
            className="animate-wave-flow-1 transition-all duration-300"
          />

          {/* 2. Seller Sine Wave (Gold Supply Oscillation - Counter Phase) */}
          <path
            d="M0,60 C150,105 300,15 450,60 C600,105 750,15 900,60 C1050,105 1200,60 1200,60"
            fill="none"
            stroke="url(#seller-sine-grad)"
            strokeWidth={isHovered ? "2.8" : "2"}
            filter="url(#ribbon-glow)"
            strokeDasharray="8 4"
            className="animate-wave-flow-2 transition-all duration-300"
          />

          {/* 3. High-Frequency Harmonic Shimmer Ribbon */}
          <path
            d="M0,60 C100,40 200,80 300,60 C400,40 500,80 600,60 C700,40 800,80 900,60 C1000,40 1100,80 1200,60"
            fill="none"
            stroke="#34D399"
            strokeWidth="1.2"
            strokeOpacity={isHovered ? "0.6" : "0.35"}
            className="animate-wave-flow-3"
          />

          {/* Equilibrium Settlement Intersection Nodes */}
          {/* Node 1: Left Crossing */}
          <circle cx="225" cy="60" r="4" fill="#34D399" className="animate-ping opacity-75" />
          <circle cx="225" cy="60" r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />

          {/* Node 2: Center Equilibrium Focus */}
          <circle cx="450" cy="60" r="5.5" fill="#FBBF24" className="animate-pulse opacity-90" />
          <circle cx="450" cy="60" r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Node 3: Center-Right Crossing */}
          <circle cx="675" cy="60" r="4" fill="#34D399" className="animate-ping opacity-75" />
          <circle cx="675" cy="60" r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />

          {/* Node 4: Right Equilibrium Focus */}
          <circle cx="900" cy="60" r="5" fill="#FBBF24" className="animate-pulse opacity-90" />
          <circle cx="900" cy="60" r="3.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
        </svg>

        {/* Center Glassmorphic Equilibrium Pill */}
        <div className="absolute z-10 flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#10B981]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="text-xs font-semibold tracking-wide text-[var(--paper)] flex items-center gap-1.5">
            <span className="text-emerald-500 font-mono">Buyer Demand α</span>
            <ArrowLeftRight size={11} className="text-[var(--mist)]" />
            <span className="text-amber-500 font-mono">Seller Supply β</span>
          </span>

          <span className="hidden sm:inline-block w-[1px] h-3 bg-[var(--line)]" />

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[var(--mist)]">
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            Fair Settlement Equilibrium
          </span>
        </div>
      </div>
    </div>
  );
}
