import React from "react";

export function WaveformBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* =========================================================================
          1. FLUID AURORA BOREALIS / DEEP SPACE NEON MESH ORBS
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Aurora Orb 1: Electric Mint & Emerald Nebula (Top-Left) */}
        <div
          className="aurora-orb-1 absolute -top-[15%] -left-[10%] w-[680px] h-[680px] rounded-full opacity-35 dark:opacity-45 mix-blend-screen pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(16, 185, 129, 0.45) 0%, rgba(52, 211, 153, 0.25) 45%, rgba(16, 185, 129, 0) 70%)",
            filter: "blur(90px)",
            transform: "translate3d(0, 0, 0)",
          }}
        />

        {/* Aurora Orb 2: Cyber Violet & Neon Indigo Nebula (Top-Right) */}
        <div
          className="aurora-orb-2 absolute -top-[10%] -right-[12%] w-[720px] h-[720px] rounded-full opacity-30 dark:opacity-40 mix-blend-screen pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(139, 92, 246, 0.45) 0%, rgba(99, 102, 241, 0.25) 45%, rgba(139, 92, 246, 0) 70%)",
            filter: "blur(100px)",
            transform: "translate3d(0, 0, 0)",
          }}
        />

        {/* Aurora Orb 3: Electric Cyan & Aqua Pulse (Mid-Center Left) */}
        <div
          className="aurora-orb-3 absolute top-[35%] -left-[15%] w-[600px] h-[600px] rounded-full opacity-25 dark:opacity-35 mix-blend-screen pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(6, 182, 212, 0.4) 0%, rgba(20, 184, 166, 0.2) 50%, rgba(6, 182, 212, 0) 75%)",
            filter: "blur(85px)",
            transform: "translate3d(0, 0, 0)",
          }}
        />

        {/* Aurora Orb 4: Burnished Gold & Amber Sunburst (Bottom-Right) */}
        <div
          className="aurora-orb-4 absolute -bottom-[15%] -right-[10%] w-[650px] h-[650px] rounded-full opacity-25 dark:opacity-35 mix-blend-screen pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.18) 45%, rgba(245, 158, 11, 0) 70%)",
            filter: "blur(95px)",
            transform: "translate3d(0, 0, 0)",
          }}
        />
      </div>

      {/* =========================================================================
          2. LUMINESCENT HARMONIC SOUNDWAVE RIBBONS (Bilateral Equilibrium Curves)
          ========================================================================= */}
      {/* Top Ambient Wave Ribbon */}
      <div className="absolute -top-12 left-0 right-0 h-96 opacity-20 dark:opacity-30 overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full preserve-3d animate-wave-slow"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="aurora-grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.05" />
              <stop offset="30%" stopColor="#34D399" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="aurora-grad-violet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
            </linearGradient>
            <filter id="aurora-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sine Wave 1 (Buyer Demand Curve) */}
          <path
            d="M0,96 C240,180 480,20 720,120 C960,220 1200,60 1440,110 L1440,0 L0,0 Z"
            fill="url(#aurora-grad-emerald)"
            fillOpacity="0.08"
          />
          <path
            d="M0,96 C240,180 480,20 720,120 C960,220 1200,60 1440,110"
            fill="none"
            stroke="url(#aurora-grad-emerald)"
            strokeWidth="2.5"
            filter="url(#aurora-glow)"
            className="animate-wave-flow-1"
          />

          {/* Sine Wave 2 (Seller Supply Curve in Counter-Phase) */}
          <path
            d="M0,160 C320,40 640,240 960,100 C1200,180 1360,90 1440,140"
            fill="none"
            stroke="url(#aurora-grad-violet)"
            strokeWidth="2"
            filter="url(#aurora-glow)"
            strokeDasharray="6 4"
            className="animate-wave-flow-2"
          />
        </svg>
      </div>

      {/* Mid-Screen Subtle Drift Ribbon */}
      <div className="absolute top-[40%] -left-[5%] -right-[5%] h-72 opacity-15 dark:opacity-25 pointer-events-none">
        <svg
          viewBox="0 0 1600 240"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C200,40 400,200 600,120 C800,40 1000,200 1200,120 C1400,40 1500,180 1600,120"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.6"
            strokeOpacity="0.6"
            className="animate-wave-flow-3"
          />
          <path
            d="M0,140 C220,210 440,70 660,140 C880,210 1100,70 1320,140 C1480,190 1550,110 1600,140"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="1.4"
            strokeOpacity="0.5"
            className="animate-wave-flow-1"
          />
        </svg>
      </div>

      {/* Lower Harmonic Stream */}
      <div className="absolute -bottom-10 left-0 right-0 h-96 opacity-20 dark:opacity-30 overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,224 C288,140 576,280 864,192 C1152,104 1344,240 1440,210"
            fill="none"
            stroke="url(#aurora-grad-emerald)"
            strokeWidth="2.5"
            filter="url(#aurora-glow)"
            className="animate-wave-flow-2"
          />
          <path
            d="M0,170 C360,260 720,120 1080,230 C1260,180 1380,250 1440,200"
            fill="none"
            stroke="url(#aurora-grad-violet)"
            strokeWidth="1.8"
            filter="url(#aurora-glow)"
            className="animate-wave-flow-3"
          />
        </svg>
      </div>

      {/* =========================================================================
          3. PULSING CELESTIAL EQUILIBRIUM NODES & STARDUST POINTS
          ========================================================================= */}
      <div className="absolute top-[18%] left-[22%] w-3 h-3 rounded-full bg-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.9)] animate-ping opacity-60" />
      <div className="absolute top-[26%] right-[28%] w-2.5 h-2.5 rounded-full bg-violet-400/80 shadow-[0_0_18px_rgba(139,92,246,0.9)] animate-pulse opacity-70" />
      <div className="absolute top-[48%] left-[38%] w-2 h-2 rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(6,182,212,0.9)] animate-pulse opacity-60" />
      <div className="absolute bottom-[28%] right-[35%] w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_18px_rgba(245,158,11,0.9)] animate-pulse opacity-65" />
      <div className="absolute bottom-[20%] left-[18%] w-2.5 h-2.5 rounded-full bg-teal-300/80 shadow-[0_0_16px_rgba(52,211,153,0.9)] animate-ping opacity-55" />

      {/* =========================================================================
          4. ARCHITECTURAL RADIAL DOT MATRIX MESH
          ========================================================================= */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: "radial-gradient(var(--line) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
