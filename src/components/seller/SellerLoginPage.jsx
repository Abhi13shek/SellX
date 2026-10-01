import React, { useState } from "react";
import {
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
  Shield,
  ArrowLeft,
} from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { Badge } from "../common/Badge.jsx";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { PrimaryButton } from "../common/Buttons.jsx";
import { SELLER_PERKS } from "../../data/constants.js";
import { api } from "../../services/api.js";

export function SellerLoginPage({ theme, setTheme, onLogin, onBack, titleHint }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
    if (!emailOk) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "register" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (mode === "register" && password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const session = mode === "register"
        ? await api.register({ email: email.trim(), password })
        : await api.login({ email: email.trim(), password });
      onLogin(session);
    } catch (requestError) {
      setError(requestError.message || "Unable to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setPassword("");
    setPasswordConfirm("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--ink)]">
      {/* Left Side (50% Equal Split) */}
      <div
        className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--line)]"
        style={{ background: "linear-gradient(155deg, #080D0B 0%, #0F1A16 50%, #1A2E20 100%)" }}
      >
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #10B981, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full opacity-20 translate-x-1/3 translate-y-1/3 pointer-events-none"
          style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <BrandMark size="lg" wordmark={true} />
        </div>

        <div className="relative z-10 max-w-lg my-auto py-10 lg:py-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-400 mb-5">
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
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Check size={12} className="text-emerald-400" strokeWidth={3} />
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
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--mist)] hover:text-[var(--paper)] transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-[var(--surface2)]"
            >
              <ArrowLeft size={16} />
              <span>Back to Marketplace</span>
            </button>
          ) : (
            <BrandMark size="sm" wordmark={true} />
          )}

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
            <Store size={11} /> {titleHint || "Sign in / Register"}
          </Badge>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--paper)] mt-3">
            {mode === "login"
              ? "Sign in to your trade desk"
              : "Create your account"}
          </h2>
          <p className="text-sm text-[var(--mist)] mt-1.5">
            {mode === "login"
              ? "Manage inbound RFQs, negotiate live terms, and lock deals directly."
              : "Create an account to manage listings, bargain chats, and secure trade desks."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface2)] p-1" role="tablist" aria-label="Seller account mode">
            {[{ id: "login", label: "Sign in" }, { id: "register", label: "Create account" }].map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={mode === item.id}
                onClick={() => switchMode(item.id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${mode === item.id ? "bg-[var(--surface)] text-[var(--paper)] shadow-sm" : "text-[var(--mist)] hover:text-[var(--paper)]"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                  required
                  className="w-full bg-transparent py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">Password</label>
                {mode === "register" && <span className="text-[11px] text-[var(--mist-dim)]">At least 8 characters</span>}
              </div>
              <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 focus-within:border-[var(--teal)] transition-colors">
                <KeyRound size={15} className="text-[var(--mist)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  minLength={mode === "register" ? 8 : undefined}
                  required
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

            {mode === "register" && (
              <div>
                <FieldLabel>Confirm password</FieldLabel>
                <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 focus-within:border-[var(--teal)] transition-colors">
                  <KeyRound size={15} className="text-[var(--mist)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full bg-transparent py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                  />
                </div>
              </div>
            )}

            <PrimaryButton type="submit" tone="teal" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" /> {mode === "login" ? "Signing in…" : "Creating account…"}
                </span>
              ) : (
                mode === "login" ? "Sign in to trade desk" : "Create account"
              )}
            </PrimaryButton>
          </form>

          <p className="text-sm text-center text-[var(--mist)] mt-6">
            {mode === "login" ? "New to SellX?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-[var(--teal)] hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Empty bottom spacer for equal vertical alignment */}
        <div className="hidden lg:block text-transparent text-xs select-none">
          Spacer
        </div>
      </div>
    </div>
  );
}
