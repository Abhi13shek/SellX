import React from "react";

export function TabButton({ active, onClick, icon: Icon, label, badge, compact, onBlue = false }) {
  if (onBlue) {
    return (
      <button
        onClick={onClick}
        className={`relative flex items-center gap-2 rounded-lg font-bold transition-all duration-200 select-none ${
          compact ? "px-3 py-1.5 text-xs" : "px-3.5 py-1.5 text-sm"
        } ${
          active
            ? "bg-white text-[#0474C4] shadow-md ring-1 ring-black/5"
            : "text-blue-100 hover:text-white hover:bg-white/15"
        }`}
      >
        <Icon size={14} className={active ? "text-[#0474C4]" : "text-blue-100"} />
        <span>{label}</span>
        {badge > 0 && (
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold tracking-tight ${
              active
                ? "bg-[#0474C4] text-white"
                : "bg-white/25 text-white border border-white/30"
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-lg font-semibold transition-all duration-200 select-none ${
        compact ? "px-3 py-1.5 text-xs" : "px-3.5 py-1.5 text-sm"
      } ${
        active
          ? "bg-gradient-to-r from-[#0474C4] to-[#025694] text-white shadow-md shadow-[#0474C4]/30 ring-1 ring-white/20"
          : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)]/60"
      }`}
    >
      <Icon size={14} className={active ? "text-white" : "text-[var(--mist)]"} />
      <span>{label}</span>
      {badge > 0 && (
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold tracking-tight transition-transform ${
            active
              ? "bg-white text-[#0474C4] shadow-sm"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
