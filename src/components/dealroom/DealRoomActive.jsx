import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Send,
  FileText,
  ShieldCheck,
  XCircle,
  Timer,
  Clock,
  CheckCircle2,
  ArrowLeftRight,
  Sparkles,
  Gauge,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingDown,
  CreditCard,
} from "lucide-react";
import { ChatMessage } from "./ChatMessage.jsx";
import { TermStat } from "../common/MiniStat.jsx";
import { PrimaryButton } from "../common/Buttons.jsx";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { BuyerCopilot } from "../catalog/BuyerCopilot.jsx";
import { SellerCopilot } from "../seller/SellerCopilot.jsx";
import { useCountdown } from "../../hooks/useCountdown.js";
import { fmtINR } from "../../utils/formatters.js";
import { marginHealth } from "../../utils/helpers.js";
import { healthColor } from "../../utils/styles.js";
import { ProductImageTile } from "../common/ProductImageTile.jsx";

export function DealRoomActive({
  role,
  deal,
  deals = [],
  setActiveDealId,
  onSendMessage,
  onProposeCounter,
  onOpenAccept,
  onDecline,
  onOpenPayment,
  onVerifyHandoverOtp,
}) {
  const [chatText, setChatText] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [handoverOtp, setHandoverOtp] = useState("");
  const [handoverOtpError, setHandoverOtpError] = useState("");
  const [verifyingHandover, setVerifyingHandover] = useState(false);

  const scrollRef = useRef(null);
  const chatInputRef = useRef(null);

  const ts = deal?.termSheet || { unitPrice: 10000, leadTimeDays: 3, status: "proposed" };
  const [unitPrice, setUnitPrice] = useState(ts.unitPrice);
  const [leadTimeDays, setLeadTimeDays] = useState(ts.leadTimeDays);

  useEffect(() => {
    setUnitPrice(ts.unitPrice);
    setLeadTimeDays(ts.leadTimeDays);
  }, [deal?.id, ts.unitPrice, ts.leadTimeDays]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [deal?.messages?.length]);

  const locked = ts.status === "locked";
  const declined = ts.status === "declined";
  const completed = ts.status === "completed";
  const dealAgreed = locked || completed;
  const disabled = dealAgreed || declined;
  const conversationClosed = completed || declined;

  const product = deal?.product || { name: "Pre-Owned Item", basePrice: 10000, cost: 7500, category: "Mobile" };
  const cost = product.cost != null ? product.cost : product.basePrice * 0.75;
  const targetMargin = deal?.targetMarginPct || 0.22;
  const health = marginHealth(Number(unitPrice), cost, targetMargin);
  const countdown = useCountdown(ts.expiresAt);

  // Financial calculations
  const savings = Math.max(0, product.basePrice - Number(unitPrice));
  const savingsPct = product.basePrice > 0 ? (savings / product.basePrice) * 100 : 0;

  const handleSend = () => {
    if (conversationClosed) return;
    if (!chatText.trim()) return;
    const textToSend = chatText.trim();
    if (typeof onSendMessage === "function") {
      onSendMessage(textToSend, deal?.id);
    }
    setChatText("");
  };

  const handleProposeCounter = () => {
    if (onProposeCounter) {
      onProposeCounter({
        unitPrice: Number(unitPrice),
        leadTimeDays: Number(leadTimeDays),
      });
      if (counterNote.trim() && onSendMessage) {
        onSendMessage(counterNote.trim());
        setCounterNote("");
      }
      setCounterOpen(false);
    }
  };

  const applyPresetDiscount = (pct) => {
    const discounted = Math.round(product.basePrice * (1 - pct));
    setUnitPrice(discounted);
  };

  const applyMidpoint = () => {
    const mid = Math.round((ts.unitPrice + product.basePrice) / 2);
    setUnitPrice(mid);
  };

  const focusMessage = () => {
    chatInputRef.current?.focus();
    chatInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const verifyHandover = async () => {
    const otp = handoverOtp.trim();
    if (!/^\d{4}$/.test(otp)) {
      setHandoverOtpError("Enter the 4-digit code shared by the buyer.");
      return;
    }
    if (!onVerifyHandoverOtp) return;
    setVerifyingHandover(true);
    setHandoverOtpError("");
    try {
      await onVerifyHandoverOtp(deal.id, otp);
    } catch (error) {
      setHandoverOtpError(error?.message || "We could not verify that code. Please try again.");
    } finally {
      setVerifyingHandover(false);
    }
  };

  // Find latest offer message index
  const latestOfferIndex = deal?.messages
    ? deal.messages.map((m) => m.type).lastIndexOf("offer")
    : -1;
  const latestOffer = [...(deal?.messages || [])].reverse().find((message) => message.type === "offer");
  const needsMyResponse = !disabled && latestOffer?.sender && latestOffer.sender !== role && latestOffer.offer?.status === "proposed";
  const nextStep = completed
    ? "Deal complete"
    : declined
    ? "This offer is closed"
    : locked && ts.paymentStatus === "paid"
    ? "Handover is ready"
    : locked
    ? role === "buyer"
      ? "Pay safely to continue"
      : "Waiting for the buyer to pay"
    : needsMyResponse
    ? "Review their latest offer"
    : "Waiting for their reply";

  const nextStepDescription = completed
    ? "The handover OTP was verified. This agreement is closed successfully."
    : declined
    ? "This negotiation is closed. You can return to your offers whenever you are ready."
    : locked && ts.paymentStatus === "paid"
    ? "Arrange the handover, inspect the item, then use the one-time passcode."
    : locked
    ? role === "buyer"
      ? "Your price is agreed. Complete the secure payment to move to handover."
      : "The price is agreed. The buyer needs to complete payment before handover."
    : needsMyResponse
    ? "Choose to accept, decline, or send a counter offer."
    : "You can wait for a reply, or send a message or counter offer to keep things moving.";
  const handoverSteps = [
    { label: "Agree price", complete: dealAgreed, active: !dealAgreed && !declined },
    { label: "Secure payment", complete: dealAgreed && ts.paymentStatus === "paid", active: locked && ts.paymentStatus !== "paid" },
    { label: "Inspect & handover", complete: completed, active: locked && ts.paymentStatus === "paid" },
  ];

  return (
    <div className="sellx-rise">
      {/* A simple status header keeps the next action obvious. */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDealId && setActiveDealId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)] hover:border-[var(--teal)]/40 shrink-0 transition-all text-xs font-semibold shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>All offers</span>
          </button>

          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--mist)] hover:text-[var(--paper)] text-xs font-medium transition-colors"
            title={sidebarOpen ? "Hide conversations list" : "Show conversations list"}
          >
            {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            <span>{sidebarOpen ? "Hide list" : "Show list"}</span>
          </button>
        </div>

        <div className={`inline-flex items-center gap-2 self-start sm:self-auto rounded-full border px-3 py-1.5 text-xs font-semibold ${
          declined
            ? "border-[var(--red)]/30 bg-[var(--red)]/10 text-[var(--red)]"
            : dealAgreed
            ? "border-[var(--green)]/30 bg-[var(--green)]/10 text-[var(--green)]"
            : "border-[var(--teal)]/30 bg-[var(--teal)]/10 text-[var(--teal)]"
        }`}>
          {dealAgreed ? <CheckCircle2 size={14} /> : declined ? <XCircle size={14} /> : <ArrowLeftRight size={14} />}
          <span>Next: {nextStep}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SIDEBAR: Active Conversations List (Optional 3 cols on desktop) */}
        {sidebarOpen && deals.length > 1 && (
          <div className="hidden lg:block lg:col-span-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 space-y-2 h-[720px] overflow-y-auto shadow-sm sellx-rise">
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--mist-dim)] font-mono">
                Conversations ({deals.length})
              </span>
            </div>

            {deals.map((d) => {
              const isSelected = d.id === deal?.id;
              const dProduct = d.product || {};
              const dTs = d.termSheet || {};
              const dLastMsg = d.messages && d.messages.length > 0 ? d.messages[d.messages.length - 1] : null;

              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDealId && setActiveDealId(d.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-[var(--surface2)] border-[var(--teal)] shadow-sm"
                      : "bg-transparent border-transparent hover:bg-[var(--surface2)]/60 hover:border-[var(--line)]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--line)] shrink-0 bg-[var(--surface2)]">
                    <ProductImageTile
                      src={dProduct.image}
                      category={dProduct.category}
                      alt={dProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-display font-semibold text-xs text-[var(--paper)] truncate">
                        {dProduct.name}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[var(--price)] shrink-0">
                        {fmtINR(dTs.unitPrice || dProduct.basePrice)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--mist)] truncate">
                      {dLastMsg?.type === "offer"
                        ? `Offer: ${fmtINR(dLastMsg.offer?.unitPrice)}`
                        : dLastMsg?.text || "Started conversation"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* CENTER / MAIN CHAT WORKSPACE */}
        <div className={`${sidebarOpen && deals.length > 1 ? "lg:col-span-5" : "lg:col-span-8"} flex flex-col gap-4`}>
          {/* Item Banner Card with Photo */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-[var(--line)] shrink-0 bg-[var(--surface2)] shadow-sm">
                <ProductImageTile
                  src={product.image}
                  category={product.category}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mist)] font-mono px-2 py-0.5 rounded bg-[var(--surface2)] border border-[var(--line)]">
                    {product.category || "Item"}
                  </span>
                  <span className="text-xs text-[var(--mist)] flex items-center gap-1">
                    <Building2 size={11} /> {role === "buyer" ? deal?.sellerName : deal?.buyerName}
                  </span>
                </div>
                <h2 className="font-display font-bold text-sm sm:text-base text-[var(--paper)] truncate">
                  {product.name}
                </h2>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-semibold text-[var(--mist-dim)] block">
                Current offer
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-[var(--price)] tabular-nums">
                {fmtINR(ts.unitPrice || product.basePrice)}
              </span>
            </div>
          </div>

          {/* Chat Container */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] flex flex-col h-[580px] shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)] bg-[var(--surface2)]/30 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-[var(--teal)]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--paper)]">
                  Conversation
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[var(--green)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" /> Shared deal
                </span>
                <span className="text-[11px] font-mono text-[var(--mist-dim)] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)]">
                  {deal?.messages?.length || 0} messages
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {deal?.messages?.map((m, idx) => (
                <ChatMessage
                  key={m.id}
                  msg={m}
                  role={role}
                  deal={deal}
                  onAccept={() => onOpenAccept && onOpenAccept(deal.id)}
                  onDecline={() => onDecline && onDecline(deal.id, role)}
                  isLatest={idx === latestOfferIndex}
                />
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-[var(--line)] flex items-center gap-2 bg-[var(--surface2)]/40 rounded-b-2xl">
              <input
                ref={chatInputRef}
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={conversationClosed}
                placeholder={completed ? "This deal is completed." : declined ? "This negotiation is closed." : "Type a message or counter note..."}
                className="flex-1 bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--paper)] outline-none focus:border-[var(--teal)] placeholder:text-[var(--mist-dim)] transition-colors shadow-inner disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={conversationClosed || !chatText.trim()}
                className="w-10 h-10 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--teal-dim)] transition-all shrink-0 shadow-sm active:scale-95"
                title="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: concise deal details and optional decision tools */}
        <div className="lg:col-span-4 space-y-4">
          {/* A single, plain-language decision card keeps the important action in one place. */}
          <div className="rounded-2xl border border-[var(--teal)]/30 bg-[var(--teal)]/5 p-4 sm:p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--teal)]/15 text-[var(--teal)]">
                {dealAgreed ? <ShieldCheck size={16} /> : declined ? <XCircle size={16} /> : <ArrowLeftRight size={16} />}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--teal)]">Your next step</span>
                <h3 className="mt-0.5 font-display text-sm font-bold text-[var(--paper)]">{nextStep}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--mist)]">{nextStepDescription}</p>
              </div>
            </div>

            {needsMyResponse && (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <button
                  type="button"
                  onClick={() => onOpenAccept && onOpenAccept(deal.id)}
                  className="rounded-xl bg-[var(--teal)] px-3 py-2.5 text-xs font-semibold text-[var(--on-teal)] transition-colors hover:bg-[var(--teal-dim)]"
                >
                  Accept offer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCounterOpen(true);
                    setTimeout(() => document.getElementById(`counter-offer-${deal.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
                  }}
                  className="rounded-xl border border-[var(--teal)]/40 bg-[var(--surface)] px-3 py-2.5 text-xs font-semibold text-[var(--teal)] transition-colors hover:bg-[var(--teal)]/10"
                >
                  Counter offer
                </button>
                <button
                  type="button"
                  onClick={() => onDecline && onDecline(deal.id, role)}
                  className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-xs font-semibold text-[var(--mist)] transition-colors hover:border-[var(--red)]/40 hover:text-[var(--red)]"
                >
                  Decline
                </button>
              </div>
            )}

            {locked && role === "buyer" && ts.paymentStatus !== "paid" && (
              <button
                type="button"
                onClick={() => onOpenPayment && onOpenPayment(deal.id)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--teal)] px-3 py-2.5 text-xs font-semibold text-[var(--on-teal)] transition-colors hover:bg-[var(--teal-dim)]"
              >
                <CreditCard size={14} /> Complete secure payment
              </button>
            )}

            {!disabled && !needsMyResponse && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={focusMessage}
                  className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-xs font-semibold text-[var(--paper)] transition-colors hover:border-[var(--teal)]/40"
                >
                  Send message
                </button>
                <button
                  type="button"
                  onClick={() => setCounterOpen(true)}
                  className="rounded-xl border border-[var(--teal)]/40 bg-[var(--surface)] px-3 py-2.5 text-xs font-semibold text-[var(--teal)] transition-colors hover:bg-[var(--teal)]/10"
                >
                  Make counter
                </button>
              </div>
            )}
          </div>

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--paper)]">Safe handover journey</h3>
                <p className="mt-0.5 text-[11px] text-[var(--mist)]">Complete each step before sharing the OTP.</p>
              </div>
              <ShieldCheck size={16} className="text-[var(--teal)]" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1">
              {handoverSteps.map((step, index) => (
                <div key={step.label} className="relative text-center">
                  {index < handoverSteps.length - 1 && <span className="absolute left-[60%] right-[-40%] top-3 h-px bg-[var(--line)]" />}
                  <span className={`relative z-10 mx-auto flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold ${step.complete ? "border-[var(--green)] bg-[var(--green)]/15 text-[var(--green)]" : step.active ? "border-[var(--teal)] bg-[var(--teal)]/12 text-[var(--teal)]" : "border-[var(--line)] bg-[var(--surface2)] text-[var(--mist-dim)]"}`}>
                    {step.complete ? "✓" : index + 1}
                  </span>
                  <span className={`mt-1.5 block text-[10px] font-semibold ${step.active ? "text-[var(--paper)]" : "text-[var(--mist)]"}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Term Sheet / Handover Agreement Card */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 relative overflow-hidden shadow-sm">
            {dealAgreed && (
              <div className="sellx-stamp absolute top-3 right-3 border-2 border-[var(--green)] text-[var(--green)] rounded-lg px-2.5 py-1 text-[11px] font-display font-bold tracking-widest -rotate-6 bg-[var(--green)]/10">
                {completed ? "COMPLETED" : "AGREED"}
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[var(--mist)]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--mist)]">
                  {dealAgreed ? (completed ? "Deal completed" : "Deal confirmed") : "Deal details"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TermStat label={dealAgreed ? "Agreed price" : "Current offer"} value={fmtINR(ts.unitPrice)} accent />
              <TermStat label="Handover Mode" value={deal?.handoverType || ts.handoverType || "Local Meetup"} />
            </div>

            {/* Meetup Location */}
            <div className="mt-3 p-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] flex items-center gap-2 text-xs">
              <span className="text-[var(--mist-dim)] font-semibold">📍 Meetup Spot:</span>
              <span className="text-[var(--paper)] font-medium truncate">
                {deal?.meetupLocation || ts.meetupLocation || (product.locality ? `${product.locality}, ${product.city || "BLR"}` : "Indiranagar Metro Station")}
              </span>
            </div>

            {/* Only the buyer sees the code; the seller must enter it to verify handover. */}
            {dealAgreed && role === "buyer" && !completed && (
              <div className="mt-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 block">
                  🔒 Handover Passcode (OTP)
                </span>
                <div className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-widest">
                  {deal?.handoverOtp || ts.handoverOtp || "8429"}
                </div>
                <p className="text-[11px] text-[var(--mist)] leading-snug">Share this 4-digit passcode with the seller ONLY after physical inspection.</p>
              </div>
            )}

            {locked && role === "seller" && ts.paymentStatus === "paid" && (
              <div className="mt-3 rounded-xl border border-[var(--green)]/30 bg-[var(--green)]/10 p-3.5">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--green)]">Verify buyer handover OTP</span>
                <p className="mt-1 text-[11px] leading-snug text-[var(--mist)]">Inspect the item first, then enter the 4-digit code provided by the buyer.</p>
                <div className="mt-3 flex gap-2">
                  <input
                    value={handoverOtp}
                    onChange={(event) => {
                      setHandoverOtp(event.target.value.replace(/\D/g, "").slice(0, 4));
                      setHandoverOtpError("");
                    }}
                    onKeyDown={(event) => event.key === "Enter" && verifyHandover()}
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Enter OTP"
                    aria-label="Buyer handover OTP"
                    className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-center font-mono text-base font-bold tracking-[0.35em] text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                  />
                  <button
                    type="button"
                    onClick={verifyHandover}
                    disabled={verifyingHandover || handoverOtp.length !== 4}
                    className="shrink-0 rounded-xl bg-[var(--teal)] px-3 py-2.5 text-xs font-semibold text-[var(--on-teal)] shadow-sm transition-all hover:bg-[var(--teal-dim)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {verifyingHandover ? "Verifying…" : "Verify & close"}
                  </button>
                </div>
                {handoverOtpError && <p className="mt-2 text-[11px] font-medium text-[var(--red)]">{handoverOtpError}</p>}
              </div>
            )}

            {completed && (
              <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[var(--green)]/30 bg-[var(--green)]/10 p-3 text-xs font-semibold text-[var(--green)]">
                <CheckCircle2 size={15} /> Handover verified · Deal closed successfully
              </div>
            )}

            <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-[var(--line)]/50">
              {completed ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--green)]">
                  <CheckCircle2 size={15} /> Deal completed
                </span>
              ) : locked ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--green)]">
                  <ShieldCheck size={15} /> Deal agreed &amp; OTP active
                </span>
              ) : declined ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--red)]">
                  <XCircle size={15} /> Bargain closed without agreement
                </span>
              ) : (
                <>
                  <span className="text-[11px] uppercase tracking-wide text-[var(--mist)] flex items-center gap-1">
                    <Timer size={12} /> Offer expires in
                  </span>
                  <span
                    className={`font-mono text-sm font-bold tabular-nums ${
                      countdown.expired ? "text-[var(--red)]" : "text-[var(--amber)]"
                    }`}
                  >
                    {countdown.expired ? "Expired" : countdown.label}
                  </span>
                </>
              )}
            </div>

            {/* Escrow Lock Banner / 1-Click Pay */}
            {locked && role === "buyer" && (
              <div className="mt-4 pt-3 border-t border-[var(--line)]">
                {ts.paymentStatus === "paid" ? (
                  <div className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--green)]/10 border border-[var(--green)]/30 text-xs font-semibold text-[var(--green)]">
                    <CheckCircle2 size={14} /> Payment Complete · Escrow Held Safely
                  </div>
                ) : (
                  <button
                    onClick={() => onOpenPayment && onOpenPayment(deal.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] text-xs font-semibold hover:bg-[var(--teal-dim)] transition-all shadow-md active:scale-95"
                  >
                    <CreditCard size={14} /> Pay {fmtINR(ts.unitPrice)} via Safe Escrow
                  </button>
                )}
              </div>
            )}

            {locked && role === "seller" && (
              <div className="mt-4 pt-3 border-t border-[var(--line)]">
                <div
                  className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold ${
                    ts.paymentStatus === "paid"
                      ? "bg-[var(--green)]/10 border-[var(--green)]/30 text-[var(--green)]"
                      : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)]"
                  }`}
                >
                  {ts.paymentStatus === "paid" ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                  {ts.paymentStatus === "paid" ? "Buyer has deposited funds in Escrow" : "Buyer preparing payment / local cash"}
                </div>
              </div>
            )}
          </div>

          {/* Counter tools stay out of the way until the user chooses to counter. */}
          {!disabled && (
            <div id={`counter-offer-${deal.id}`} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 shadow-sm">
              <button
                type="button"
                onClick={() => setCounterOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 text-left"
                aria-expanded={counterOpen}
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftRight size={14} className="text-[var(--teal)]" />
                  <div>
                    <span className="block text-xs font-semibold text-[var(--paper)]">Make a counter offer</span>
                    <span className="mt-0.5 block text-[11px] text-[var(--mist)]">Choose a new price and optional message.</span>
                  </div>
                </div>
                <ChevronDown size={16} className={`shrink-0 text-[var(--mist)] transition-transform ${counterOpen ? "rotate-180" : ""}`} />
              </button>

              {counterOpen && (
                <div className="mt-4 space-y-4 border-t border-[var(--line)] pt-4 sellx-rise">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--mist)]">Your proposal</span>
                    {role === "buyer" && savings > 0 && (
                      <span className="text-[11px] font-mono text-[var(--green)] font-semibold flex items-center gap-1">
                        <TrendingDown size={11} /> Save {fmtINR(savings)} ({savingsPct.toFixed(1)}%)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-[var(--mist-dim)] mr-1">Suggestions:</span>
                    <button
                      type="button"
                      onClick={() => applyPresetDiscount(0.05)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-[11px] font-mono text-[var(--paper)] transition-colors"
                    >
                      5% below list
                    </button>
                    <button
                      type="button"
                      onClick={applyMidpoint}
                      className="px-2.5 py-1 rounded-lg bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-[11px] font-mono text-[var(--paper)] transition-colors"
                    >
                      Meet halfway
                    </button>
                  </div>

              {/* A direct price field makes the counter amount explicit; the slider remains for quick adjustments. */}
              <div>
                <FieldLabel>Enter your counter price (₹)</FieldLabel>
                <input
                  type="number"
                  min="0"
                  step="250"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-[var(--line)] bg-[var(--surface2)] px-3 py-2.5 font-mono text-base font-bold text-[var(--paper)] outline-none transition-colors focus:border-[var(--teal)]"
                />
              </div>

              <div>
                <FieldLabel hint={fmtINR(unitPrice)}>Fine-tune price</FieldLabel>
                <input
                  type="range"
                  min={Math.max(500, Math.round(cost * 0.6))}
                  max={Math.round(product.basePrice * 1.35)}
                  step="250"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full accent-[var(--teal)] cursor-pointer mt-1"
                />
              </div>

              {/* Lead Time */}
              <div>
                <FieldLabel>Pickup or delivery window (days)</FieldLabel>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                  className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm font-mono text-[var(--paper)] outline-none focus:border-[var(--teal)] transition-colors"
                />
              </div>

              {/* Accompanying Note */}
              <div>
                <FieldLabel>Message with offer (optional)</FieldLabel>
                <input
                  type="text"
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  placeholder="e.g. Can pay immediately via UPI if accepted"
                  className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--teal)] transition-colors placeholder:text-[var(--mist-dim)]"
                />
              </div>

              {role === "seller" && health && (
                <div
                  className="flex items-center gap-1.5 text-[11px] font-semibold"
                  style={{ color: healthColor[health.level] || "var(--mist)" }}
                >
                  <Gauge size={12} /> {(health.m * 100).toFixed(1)}% profit margin &middot; {health.label}
                </div>
              )}

                  <PrimaryButton tone="teal" icon={ArrowLeftRight} className="w-full" onClick={handleProposeCounter}>
                    Send counter offer {fmtINR(unitPrice)}
                  </PrimaryButton>
                  <p className="text-center text-[11px] text-[var(--mist)]">
                    Accept or decline the newest offer directly in the conversation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI Copilot Box */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden shadow-sm">
            <button
              onClick={() => setCopilotOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--surface2)]/40 transition-colors"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--paper)]">
                <Sparkles size={14} className="text-[var(--teal)]" /> Need help deciding?
              </span>
              <ChevronRight
                size={15}
                className={`text-[var(--mist)] transition-transform duration-200 ${
                  copilotOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {copilotOpen && (
              <div className="px-4 pb-4 sellx-rise border-t border-[var(--line)] pt-3">
                {role === "buyer" ? (
                  <BuyerCopilot product={product} onUseSuggested={(v) => setUnitPrice(v)} />
                ) : (
                  <SellerCopilot
                    product={product}
                    unitPrice={Number(unitPrice)}
                    targetMarginPct={targetMargin}
                    onQuickReply={(text) => onSendMessage && onSendMessage(text)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
