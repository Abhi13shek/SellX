import React from "react";

export function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Orb 1: Mint Emerald (Top Left / Floating) */}
      <div
        className="aurora-orb-1 absolute -top-[15%] -left-[10%] w-[38rem] md:w-[50rem] h-[38rem] md:h-[50rem] rounded-full blur-[100px] md:blur-[140px] opacity-20 dark:opacity-25"
        style={{
          background: "radial-gradient(circle, var(--teal) 0%, rgba(16, 185, 129, 0.4) 50%, transparent 70%)",
        }}
      />

      {/* Orb 2: Warm Gold / Amber (Top Right / Ambient Glow) */}
      <div
        className="aurora-orb-2 absolute top-[5%] -right-[15%] w-[32rem] md:w-[45rem] h-[32rem] md:h-[45rem] rounded-full blur-[110px] md:blur-[150px] opacity-15 dark:opacity-20"
        style={{
          background: "radial-gradient(circle, var(--brass) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 70%)",
        }}
      />

      {/* Orb 3: Deep Jade / Forest (Bottom Left / Anchor) */}
      <div
        className="aurora-orb-3 absolute -bottom-[15%] left-[10%] w-[40rem] md:w-[55rem] h-[40rem] md:h-[55rem] rounded-full blur-[120px] md:blur-[160px] opacity-20 dark:opacity-30"
        style={{
          background: "radial-gradient(circle, var(--teal-accent) 0%, rgba(6, 78, 59, 0.5) 50%, transparent 70%)",
        }}
      />

      {/* Orb 4: Vibrant Jade / Mint (Center Right / Counterweight) */}
      <div
        className="aurora-orb-4 absolute top-[45%] right-[5%] w-[28rem] md:w-[38rem] h-[28rem] md:h-[38rem] rounded-full blur-[100px] md:blur-[130px] opacity-15 dark:opacity-20"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, rgba(52, 211, 153, 0.35) 50%, transparent 70%)",
        }}
      />

      {/* Faint Tech Dot Matrix Overlay for depth */}
      <div
        className="absolute inset-0 opacity-25 dark:opacity-35"
        style={{
          backgroundImage: "radial-gradient(var(--line) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
