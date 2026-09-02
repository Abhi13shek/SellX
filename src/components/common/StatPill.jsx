import React from "react";

export function StatPill({ label, value, tone = "default" }) {
  const toneClass =
    tone === "green"
      ? "text-[var(--green)]"
      : tone === "brass"
      ? "text-[var(--brass-text)]"
      : "text-[var(--paper)]";
  return (
    <div className="leading-tight">
      <div className={`font-mono font-semibold text-sm tabular-nums ${toneClass}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--mist-dim)]">{label}</div>
    </div>
  );
}
