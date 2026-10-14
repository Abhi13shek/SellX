import React from "react";

export function WaveformBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 82% 42%, rgba(167, 227, 190, 0.32) 0%, rgba(167, 227, 190, 0.1) 17%, transparent 34%), radial-gradient(circle at 18% 80%, rgba(189, 232, 203, 0.18) 0%, transparent 28%)",
      }}
    >
      {/* Calm workspace photography adds warmth to open desktop canvas areas. */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat opacity-[0.22] lg:block dark:opacity-[0.13]"
        style={{ backgroundImage: "url('/images/marketplace-workspace-background.png')" }}
      />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[var(--ink)]/80 via-[var(--ink)]/58 to-[var(--ink)]/30 lg:block" />

      {/* Quiet marketplace canvas — gives sparse product grids a deliberate sense of depth. */}
      <div className="absolute hidden xl:block right-[9%] top-[31%] h-[360px] w-[360px] rounded-full border border-emerald-200/55 bg-white/20 shadow-[0_20px_80px_rgba(16,185,129,0.08)]" />
      <div className="absolute hidden xl:block right-[13%] top-[35%] h-[280px] w-[280px] rounded-full border border-emerald-200/50" />
      <div className="absolute hidden xl:block right-[17%] top-[39%] h-[200px] w-[200px] rounded-full border border-emerald-200/45 bg-emerald-100/20" />
      <div className="absolute hidden xl:block right-[24%] top-[46%] h-14 w-14 rotate-45 rounded-2xl border border-emerald-300/60 bg-white/45 shadow-sm" />
      <div className="absolute hidden xl:block right-[19%] top-[39%] h-3 w-3 rounded-full bg-emerald-300/80 shadow-[0_0_18px_rgba(16,185,129,0.45)]" />
      <div className="absolute hidden xl:block right-[35%] top-[58%] h-2.5 w-2.5 rounded-full bg-amber-200/85" />

      {/* Ambient Top Soundwave / Harmonic Ribbons */}
      <div className="absolute -top-10 left-0 right-0 h-96 opacity-25 dark:opacity-35 overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full preserve-3d animate-wave-slow"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#34D399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="wave-grad-gold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
            </linearGradient>
            <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sine Wave 1 (Emerald Buyer Demand Curve) */}
          <path
            d="M0,96 C240,180 480,20 720,120 C960,220 1200,60 1440,110 L1440,0 L0,0 Z"
            fill="url(#wave-grad-emerald)"
            fillOpacity="0.15"
          />
          <path
            d="M0,96 C240,180 480,20 720,120 C960,220 1200,60 1440,110"
            fill="none"
            stroke="url(#wave-grad-emerald)"
            strokeWidth="2.5"
            filter="url(#wave-glow)"
            className="animate-wave-flow-1"
          />

          {/* Sine Wave 2 (Gold Seller Supply Curve in counter-phase) */}
          <path
            d="M0,160 C320,40 640,240 960,100 C1200,180 1360,90 1440,140"
            fill="none"
            stroke="url(#wave-grad-gold)"
            strokeWidth="2"
            filter="url(#wave-glow)"
            strokeDasharray="6 4"
            className="animate-wave-flow-2"
          />
        </svg>
      </div>

      {/* Mid-Canvas Ambient Soundwave Ribbons */}
      <div className="absolute top-[35%] -left-[10%] -right-[10%] h-80 opacity-20 dark:opacity-30 pointer-events-none">
        <svg
          viewBox="0 0 1600 240"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C200,40 400,200 600,120 C800,40 1000,200 1200,120 C1400,40 1500,180 1600,120"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.8"
            strokeOpacity="0.5"
            className="animate-wave-flow-3"
          />
          <path
            d="M0,140 C220,210 440,70 660,140 C880,210 1100,70 1320,140 C1480,190 1550,110 1600,140"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            className="animate-wave-flow-1"
          />
        </svg>
      </div>

      {/* Lower Soundwave Floor / Bilateral Equilibrium Stream */}
      <div className="absolute -bottom-10 left-0 right-0 h-96 opacity-25 dark:opacity-35 overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Bottom Emerald Harmonic Gradient Fill */}
          <path
            d="M0,224 C288,140 576,280 864,192 C1152,104 1344,240 1440,210 L1440,320 L0,320 Z"
            fill="url(#wave-grad-emerald)"
            fillOpacity="0.12"
          />
          <path
            d="M0,224 C288,140 576,280 864,192 C1152,104 1344,240 1440,210"
            fill="none"
            stroke="url(#wave-grad-emerald)"
            strokeWidth="2.5"
            filter="url(#wave-glow)"
            className="animate-wave-flow-2"
          />
          <path
            d="M0,170 C360,260 720,120 1080,230 C1260,180 1380,250 1440,200"
            fill="none"
            stroke="url(#wave-grad-gold)"
            strokeWidth="1.8"
            filter="url(#wave-glow)"
            className="animate-wave-flow-3"
          />
        </svg>
      </div>

      {/* Pulsing Bilateral Equilibrium Nodes */}
      <div className="absolute top-[18%] left-[25%] w-3 h-3 rounded-full bg-emerald-400/80 shadow-[0_0_16px_rgba(16,185,129,0.9)] animate-ping opacity-60" />
      <div className="absolute top-[22%] right-[30%] w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-[0_0_14px_rgba(245,158,11,0.9)] animate-pulse opacity-70" />
      <div className="absolute bottom-[30%] left-[45%] w-3 h-3 rounded-full bg-teal-300/80 shadow-[0_0_18px_rgba(52,211,153,0.9)] animate-pulse opacity-60" />

      {/* Soft Ambient Depth Mesh Grid */}
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
