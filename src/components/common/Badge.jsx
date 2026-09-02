import React from "react";

export function Badge({ children, tone = "neutral", className = "", style }) {
  const tones = {
    neutral: "bg-[var(--surface2)] text-[var(--mist)] border-[var(--line)]",
    teal: "bg-[var(--teal)]/10 text-[var(--teal)] border-[var(--teal)]/30",
    brass: "bg-[var(--teal)]/10 text-[var(--teal)] border-[var(--teal)]/30",
    green: "bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/30",
    red: "bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/30",
    amber: "bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/30",
    custom: "",
  };
  return (
    <span
      style={style}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function CategoryBadge({ category, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider bg-[var(--surface)]/90 text-[var(--mist)] border-[var(--line)] shadow-sm backdrop-blur-md ${className}`}>
      {category}
    </span>
  );
}
