import React from "react";

export function SummaryRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface)]">
      <span className="text-xs text-[var(--mist)]">{label}</span>
      <span
        className={`text-sm font-semibold font-mono ${
          accent ? "text-[var(--brass-text)]" : "text-[var(--paper)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
