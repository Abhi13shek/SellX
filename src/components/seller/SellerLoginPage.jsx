import React, { useState } from "react";
import {
  ArrowLeft,
  Sun,
  Moon,
  Store,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertTriangle,
  Info,
  Shield,
} from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { Badge } from "../common/Badge.jsx";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { SELLER_PERKS } from "../../data/constants.js";

export function SellerLoginPage({ theme, setTheme, onLogin, onContinueAsBuyer }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoNote, setDemoNote] = useState("");

  const flashDemoNote = (msg) => {
    setDemoNote(msg);
    setTimeout(() => setDemoNote(""), 3200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
    if (!emailOk) {
      setError("Enter a valid business email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--ink)]">
      {/* Left Side (50% Equal Split) */}
      <div
        className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--line)]"
        style={{ background: "linear-gradient(155deg, #181c2b 0%, #262B40 50%, #06457F 100%)" }}
      >
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #0474C4, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full opacity-20 translate-x-1/3 translate-y-1/3 pointer-events-none"
          style={{ background: "radial-gradient(circle, #A8C4EC, transparent 70%)" }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <BrandMark size="lg" wordmark={true} />
        </div>

        <div className="relative z-10 max-w-lg my-auto py-10 lg:py-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-400 mb-5">
            <Shield size={13} /> Verified Seller Trade Desk
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-100">
            The seller's side of the table.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            SellX gives verified pre-owned sellers a private trade desk — real-time profit margin analytics, automated floor price
            protection, and direct negotiation channels.
          </p>

          <div className="mt-8 space-y-4">
            {SELLER_PERKS.map((p) => (
              <div key={p} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Check size={12} className="text-blue-400" strokeWidth={3} />
                </div>
                <span className="text-sm text-slate-200 leading-relaxed font-medium">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-mono pt-6 border-t border-slate-800">
          <span>&copy; {new Date().getFullYear()} SellX Trade Desk, Inc.</span>
          <span>Institutional Grade P2P</span>
        </div>
      </div>

      {/* Right Side (50% Equal Split) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-[var(--surface)]">
        {/* Top bar controls */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onContinueAsBuyer}
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--mist)] hover:text-[var(--paper)] transition-colors"
          >
            <ArrowLeft size={15} /> Continue as buyer
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)] transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-10 lg:py-0">
          <Badge tone="brass">
            <Store size={11} /> Seller portal
          </Badge>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--paper)] mt-3">
            Sign in to your trade desk
          </h2>
          <p className="text-sm text-[var(--mist)] mt-1.5">
            Manage inbound RFQs, negotiate live terms, and lock deals directly.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30 ledgr-rise">
                <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
                <span className="text-xs text-[var(--paper)]">{error}</span>
              </div>
            )}

            <div>
              <FieldLabel>Business email</FieldLabel>
              <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 focus-within:border-[var(--teal)] transition-colors">
                <Mail size={15} className="text-[var(--mist)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full bg-transparent py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">Password</label>
                <button
                  type="button"
                  onClick={() =>
                    flashDemoNote(
                      "Password reset isn't wired up in this demo — try any email with a 6+ character password."
                    )
                  }
                  className="text-[11px] font-semibold text-[var(--teal)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 focus-within:border-[var(--teal)] transition-colors">
                <KeyRound size={15} className="text-[var(--mist)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-transparent py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[var(--mist)] hover:text-[var(--paper)] shrink-0"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--teal)]"
              />
              <span className="text-xs text-[var(--mist)]">Keep me signed in on this device</span>
            </label>

            <PrimaryButton type="submit" tone="teal" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" /> Signing in…
                </span>
              ) : (
                "Sign in to trade desk"
              )}
            </PrimaryButton>

            <p className="text-[11px] text-center text-[var(--mist-dim)] pt-1">
              Demo mode — enter any business email &amp; a password of 6+ characters.
            </p>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[var(--line)]" />
            <span className="text-[11px] uppercase tracking-wider text-[var(--mist-dim)] font-mono">or</span>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <GhostButton
            className="w-full"
            onClick={() => flashDemoNote("Google SSO is simulated in this demo — use the form above instead.")}
          >
            Continue with Google Workspace
          </GhostButton>

          <p className="text-sm text-center text-[var(--mist)] mt-6">
            New to SellX?{" "}
            <button
              onClick={() =>
                flashDemoNote("Seller applications are open — sign in above to explore the trade desk.")
              }
              className="font-semibold text-[var(--teal)] hover:underline"
            >
              Apply to become a verified supplier
            </button>
          </p>

          {demoNote && (
            <div className="ledgr-rise mt-4 flex items-start gap-2 p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
              <Info size={14} className="text-[var(--teal)] shrink-0 mt-0.5" />
              <span className="text-xs text-[var(--mist)] leading-relaxed">{demoNote}</span>
            </div>
          )}
        </div>

        {/* Empty bottom spacer for equal vertical alignment */}
        <div className="hidden lg:block text-transparent text-xs select-none">
          Spacer
        </div>
      </div>
    </div>
  );
}
