import React, { useState } from "react";
import {
  Sun,
  Moon,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertTriangle,
  Shield,
  X,
} from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { PrimaryButton } from "../common/Buttons.jsx";
import { api } from "../../services/api.js";

const ACCOUNT_PERKS = [
  "Browse verified local listings and save the items you like",
  "Make direct offers and negotiate safely in one conversation",
  "Switch to selling whenever you are ready to post a listing",
];

export function SellerLoginPage({ theme, setTheme, onLogin, onClose, modal = false, authReason = "" }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
    if (!emailOk) {
      setError("Enter a valid email address.");
      return;
    }
    if ((mode === "register" || mode === "reset") && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if ((mode === "register" || mode === "reset") && password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "reset" && !/^\d{6}$/.test(resetCode)) {
      setError("Enter the 6-digit reset code.");
      return;
    }

    setError("");
    setNotice("");
    setLoading(true);
    try {
      if (mode === "reset-request") {
        const response = await api.requestPasswordReset({ email: email.trim() });
        setResetCode(response.resetCode || "");
        setNotice(response.resetCode
          ? `Development reset code: ${response.resetCode}. It expires in 15 minutes.`
          : "If an account exists, check your email for the reset code.");
        setMode("reset");
        return;
      }
      if (mode === "reset") {
        const response = await api.resetPassword({ email: email.trim(), code: resetCode, password });
        setPassword("");
        setPasswordConfirm("");
        setResetCode("");
        setMode("login");
        setNotice(response.message || "Password updated. Sign in with your new password.");
        return;
      }
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
    setNotice("");
    setPassword("");
    setPasswordConfirm("");
    setResetCode("");
  };

  return (
    <div className={modal ? "fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm" : ""} role={modal ? "dialog" : undefined} aria-modal={modal || undefined} aria-label={modal ? "Sign in or create a SellX account" : undefined}>
      <div className={`w-full flex flex-col lg:flex-row bg-[var(--ink)] ${modal ? "max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-[var(--line)] shadow-2xl" : "min-h-screen"}`}>
      {/* Left Side (50% Equal Split) */}
      <div
        className={`relative w-full lg:w-1/2 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--line)] ${modal ? "min-h-[290px] p-8 sm:p-10" : "p-8 sm:p-12 lg:p-16"}`}
        style={{ background: "linear-gradient(145deg, #EEF9F1 0%, #D9F1E2 100%)" }}
      >
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-35 pointer-events-none"
          style={{ background: "radial-gradient(circle, #A7E3BE, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-30 translate-x-1/3 translate-y-1/3 pointer-events-none"
          style={{ background: "radial-gradient(circle, #BDE8CB, transparent 70%)" }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <BrandMark size={modal ? "md" : "lg"} wordmark={true} />
        </div>

        <div className={`relative z-10 max-w-lg my-auto ${modal ? "py-7" : "py-10 lg:py-0"}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#9ED9B4] bg-white/50 text-xs font-semibold text-[#1F6A43] mb-4">
            <Shield size={13} /> SellX marketplace
          </div>
          <h1 className={`font-display font-bold leading-tight text-[#174B32] ${modal ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"}`}>
            Buy, sell, and negotiate simply.
          </h1>
          <p className="text-sm text-[#4C7060] mt-3 leading-relaxed">
            One account gives you access to the marketplace and Seller Portal whenever you need it.
          </p>

          <div className={`space-y-3 ${modal ? "mt-6" : "mt-8"}`}>
            {(modal ? ACCOUNT_PERKS.slice(0, 2) : ACCOUNT_PERKS).map((p) => (
              <div key={p} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-[#CBEBD7] flex items-center justify-center shrink-0 border border-[#9ED9B4]">
                  <Check size={12} className="text-[#2F8F5B]" strokeWidth={3} />
                </div>
                <span className="text-sm text-[#2B523F] leading-relaxed font-medium">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative z-10 flex items-center justify-between text-xs text-[#638473] ${modal ? "pt-4" : "font-mono pt-6"} border-t border-[#BFDFC9]`}>
          <span>&copy; {new Date().getFullYear()} SellX Trade Desk, Inc.</span>
          <span>{modal ? "Simple, secure trading" : "Institutional Grade P2P"}</span>
        </div>
      </div>

      {/* Right Side (50% Equal Split) */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-between bg-[var(--surface)] ${modal ? "p-8 sm:p-10" : "p-8 sm:p-12 lg:p-16"}`}>
        {/* Top bar controls */}
        <div className="flex items-center justify-between w-full">
          <BrandMark size="sm" wordmark={true} />
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)] transition-colors"
                aria-label="Close sign in"
                title="Close"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)] transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className={`w-full max-w-md mx-auto my-auto ${modal ? "py-7" : "py-10 lg:py-0"}`}>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--paper)] mt-3">
            {mode === "login" ? "Sign in to continue" : mode === "register" ? "Create your account" : "Reset your password"}
          </h2>
          <p className="text-sm text-[var(--mist)] mt-1.5">
            {mode === "login"
              ? "Use your SellX account to continue."
              : mode === "register"
                ? "One account works for buying and selling."
                : mode === "reset-request"
                  ? "Enter your account email to request a one-time reset code."
                  : "Use your one-time code to choose a new password."}
          </p>

          {authReason && (
            <div className="mt-4 rounded-xl border border-[var(--teal)]/25 bg-[var(--teal)]/10 px-3 py-2 text-xs font-medium text-[var(--paper)]">
              Sign in or create an account to {authReason}.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30 ledgr-rise">
                <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
                <span className="text-xs text-[var(--paper)]">{error}</span>
              </div>
            )}

            {notice && (
              <div className="p-3 rounded-xl bg-[var(--teal)]/10 border border-[var(--teal)]/25 text-xs text-[var(--paper)] leading-relaxed">
                {notice}
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
                  autoFocus
                  required
                  className="w-full bg-transparent py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                />
              </div>
            </div>

            {mode !== "reset-request" && <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">{mode === "reset" ? "New password" : "Password"}</label>
                {(mode === "register" || mode === "reset") && <span className="text-[11px] text-[var(--mist-dim)]">At least 8 characters</span>}
                {mode === "login" && <button type="button" onClick={() => switchMode("reset-request")} className="text-[11px] font-semibold text-[var(--teal)] hover:underline">Forgot password?</button>}
              </div>
              <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 focus-within:border-[var(--teal)] transition-colors">
                <KeyRound size={15} className="text-[var(--mist)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={mode === "login" ? undefined : 8}
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
            </div>}

            {mode === "reset" && (
              <div>
                <FieldLabel>6-digit reset code</FieldLabel>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none focus:border-[var(--teal)] placeholder:text-[var(--mist-dim)]"
                  required
                />
              </div>
            )}

            {(mode === "register" || mode === "reset") && (
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
                  <Loader2 size={15} className="animate-spin" /> {mode === "login" ? "Signing in…" : mode === "register" ? "Creating account…" : "Please wait…"}
                </span>
              ) : (
                mode === "login" ? "Sign in" : mode === "register" ? "Create account" : mode === "reset-request" ? "Get reset code" : "Update password"
              )}
            </PrimaryButton>
          </form>

          {(mode === "login" || mode === "register") ? <p className="text-sm text-center text-[var(--mist)] mt-5">
            {mode === "login" ? "New to SellX?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-[var(--teal)] hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p> : <p className="text-sm text-center text-[var(--mist)] mt-6">
            Remembered your password? <button type="button" onClick={() => switchMode("login")} className="font-semibold text-[var(--teal)] hover:underline">Back to sign in</button>
          </p>}
        </div>

        {/* Empty bottom spacer for equal vertical alignment */}
        <div className="hidden lg:block text-transparent text-xs select-none">
          Spacer
        </div>
      </div>
      </div>
    </div>
  );
}
