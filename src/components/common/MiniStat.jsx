import React from "react";

export function MiniStat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--mist-dim)]">{label}</div>
      <div className="font-mono text-[13px] font-semibold text-[var(--paper)] tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

export function TermStat({ label, value, accent }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--mist-dim)]">{label}</div>
      <div
        className={`font-mono text-base font-bold tabular-nums mt-0.5 ${
          accent ? "text-[var(--brass-text)]" : "text-[var(--paper)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
