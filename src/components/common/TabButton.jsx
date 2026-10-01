import React from "react";

export function TabButton({ active, onClick, icon: Icon, label, badge, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 select-none cursor-pointer whitespace-nowrap ${
        compact
          ? "w-full py-2 px-2 text-xs"
          : "h-9 px-4 text-xs md:text-sm"
      } ${
        active
          ? "bg-white text-black dark:bg-white dark:text-black font-bold shadow-md shadow-white/10 ring-1 ring-white/60"
          : "text-zinc-400 dark:text-zinc-400 text-zinc-600 hover:text-white dark:hover:text-white hover:bg-zinc-800/60 dark:hover:bg-zinc-800/60"
      }`}
    >
      {Icon && (
        <Icon
          size={compact ? 14 : 15}
          className={`transition-colors shrink-0 ${
            active ? "text-black dark:text-black text-black" : "text-zinc-400"
          }`}
        />
      )}
      <span className="truncate">{label}</span>
      {badge > 0 && (
        <span
          className={`inline-flex items-center justify-center px-1.5 py-0.5 min-w-[18px] h-4 rounded-full text-[10px] font-bold leading-none tracking-tight shrink-0 transition-transform ${
            active
              ? "bg-black text-white dark:bg-black dark:text-white"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

