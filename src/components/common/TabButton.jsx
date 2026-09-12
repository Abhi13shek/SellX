import React from "react";

export function TabButton({ active, onClick, icon: Icon, label, badge, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-full font-medium transition-all duration-200 select-none cursor-pointer ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-xs md:text-sm"
      } ${
        active
          ? "bg-gradient-to-r from-[#0474C4] to-[#025694] text-white font-semibold shadow-md shadow-[#0474C4]/25 ring-1 ring-white/20 scale-[1.02]"
          : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)]/60"
      }`}
    >
      {Icon && (
        <Icon
          size={15}
          className={`transition-colors shrink-0 ${
            active ? "text-white" : "text-[var(--mist)] group-hover:text-[var(--paper)]"
          }`}
        />
      )}
      <span>{label}</span>
      {badge > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none tracking-tight transition-transform ${
            active
              ? "bg-white text-[#0474C4] shadow-sm"
              : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
