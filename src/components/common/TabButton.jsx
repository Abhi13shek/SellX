import React from "react";

export function TabButton({ active, onClick, icon: Icon, label, badge, compact }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg font-semibold transition-colors ${
        compact ? "px-3 py-1.5 text-xs" : "px-3.5 py-1.5 text-sm"
      } ${
        active
          ? "bg-[var(--surface3)] text-[var(--paper)]"
          : "text-[var(--mist)] hover:text-[var(--paper)]"
      }`}
    >
      <Icon size={14} />
      {label}
      {badge > 0 && (
        <span
          className={`px-1.5 rounded-full text-[10px] font-bold ${
            active ? "bg-[var(--teal)] text-[var(--on-teal)]" : "bg-[var(--surface3)] text-[var(--mist)]"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
