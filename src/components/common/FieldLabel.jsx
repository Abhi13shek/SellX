import React from "react";

export function FieldLabel({ children, hint }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">{children}</label>
      {hint && <span className="text-[11px] text-[var(--mist-dim)] font-mono">{hint}</span>}
    </div>
  );
}
