import React from "react";

export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  tone = "teal",
  disabled,
  className = "",
  type = "button",
}) {
  const tones = {
    teal: "bg-[var(--teal)] text-[var(--on-teal)] hover:bg-[var(--teal-dim)]",
    brass: "bg-[var(--brass)] text-[var(--on-brass)] hover:brightness-110",
    green: "bg-[var(--green)] text-[var(--on-green)] hover:brightness-110",
    red: "bg-[var(--red)] text-white hover:brightness-110",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] hover:-translate-y-px hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ${tones[tone]} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={2.4} />}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  icon: Icon,
  disabled,
  className = "",
  tone = "default",
  type = "button",
}) {
  const toneClass =
    tone === "danger"
      ? "text-[var(--red)] border-[var(--red)]/30 hover:bg-[var(--red)]/10"
      : tone === "success"
      ? "text-[var(--navy)] border-[var(--teal)]/40 bg-[var(--teal)]/8 hover:bg-[var(--teal)]/14"
      : "text-[var(--paper)] border-[var(--line)] hover:bg-[var(--surface3)]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-[0.98] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${toneClass} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={2.4} />}
      {children}
    </button>
  );
}
