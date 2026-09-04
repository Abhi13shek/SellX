import React from "react";

export function StatPill({ label, value, tone = "default", onBlue = false }) {
  const toneClass = onBlue
    ? tone === "green"
      ? "text-emerald-300 font-bold"
      : tone === "brass"
      ? "text-sky-200 font-bold"
      : "text-white font-bold"
    : tone === "green"
    ? "text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
    : tone === "brass"
    ? "text-sky-400 font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"
    : "text-[var(--paper)] font-bold";

  return (
    <div className="leading-tight select-none">
      <div className={`font-mono text-[13px] tabular-nums ${toneClass}`}>{value}</div>
      <div className={`text-[9px] uppercase tracking-wider font-semibold ${onBlue ? "text-blue-200" : "text-[var(--mist)]"}`}>
        {label}
      </div>
    </div>
  );
}
