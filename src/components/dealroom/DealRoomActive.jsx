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
  IndianRupee,
  Clock,
  CheckCircle2,
  ArrowLeftRight,
  Sparkles,
  Gauge,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingDown,
  TrendingUp,
  Percent,
  Check,
  Info,
  CreditCard,
  Lock,
} from "lucide-react";
import { CategoryIcon } from "../common/Icons.jsx";
import { ChatMessage } from "./ChatMessage.jsx";
import { TermStat } from "../common/MiniStat.jsx";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { Badge } from "../common/Badge.jsx";
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
}) {
  const [chatText, setChatText] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const scrollRef = useRef(null);

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
  const disabled = locked || declined;

  const product = deal?.product || { name: "Pre-Owned Item", basePrice: 10000, cost: 7500, category: "Mobile" };
  const cost = product.cost != null ? product.cost : product.basePrice * 0.75;
  const targetMargin = deal?.targetMarginPct || 0.22;
  const health = marginHealth(Number(unitPrice), cost, targetMargin);
  const countdown = useCountdown(ts.expiresAt);

  // Financial calculations
  const savings = Math.max(0, product.basePrice - Number(unitPrice));
  const savingsPct = product.basePrice > 0 ? (savings / product.basePrice) * 100 : 0;

  const handleSend = () => {
    if (!chatText.trim()) return;
    if (typeof onSendMessage === "function") {
      onSendMessage(chatText.trim());
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

  // Find latest offer message index
  const latestOfferIndex = deal?.messages
    ? deal.messages.map((m) => m.type).lastIndexOf("offer")
    : -1;

  // Progression Stepper determination
  const steps = [
    { label: "1. Request Sent", done: true },
    { label: "2. Bargaining", done: deal?.messages?.length > 1, active: !locked && !declined },
    { label: "3. Terms Agreed", done: locked, active: locked && ts.paymentStatus !== "paid" },
    { label: "4. Escrow Paid", done: ts.paymentStatus === "paid", active: ts.paymentStatus === "paid" },
  ];

  return (
    <div className="sellx-rise">
      {/* Top Breadcrumbs & Progression Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDealId && setActiveDealId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)] hover:border-[var(--teal)]/40 shrink-0 transition-all text-xs font-semibold shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>All Conversations</span>
          </button>

          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--mist)] hover:text-[var(--paper)] text-xs font-medium transition-colors"
            title={sidebarOpen ? "Hide Chat Sidebar" : "Show Chat Sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            <span>{sidebarOpen ? "Hide List" : "Show List"}</span>
          </button>
        </div>

        {/* Stepper Progression */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div
                className={`flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors ${
                  step.done
                    ? "bg-[var(--green)]/12 border-[var(--green)]/30 text-[var(--green)]"
                    : step.active
                    ? "bg-[var(--teal)]/12 border-[var(--teal)]/30 text-[var(--teal)]"
                    : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist-dim)]"
                }`}
              >
                {step.done ? <Check size={11} strokeWidth={3} /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                {step.label}
              </div>
              {idx < steps.length - 1 && (
                <div className="w-2 sm:w-3 h-px bg-[var(--line)] shrink-0" />
              )}
            </React.Fragment>
          ))}
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

        {/* CENTER / MAIN CHAT WORKSPACE (6 or 7 cols) */}
        <div className={`${sidebarOpen && deals.length > 1 ? "lg:col-span-5" : "lg:col-span-7"} flex flex-col gap-4`}>
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
                  <span className="text-xs text-[var(--mist-dim)] flex items-center gap-1 font-mono">
                    <MapPin size={11} className="text-[var(--teal)]" /> {product.supplier?.includes("(") ? product.supplier.split("(")[1]?.replace(")", "") : "Indiranagar, BLR"}
                  </span>
                </div>
                <h2 className="font-display font-bold text-sm sm:text-base text-[var(--paper)] truncate">
                  {product.name}
                </h2>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-semibold text-[var(--mist-dim)] block">
                Offer Price
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
                  Live Negotiation Stream
                </span>
              </div>
              <span className="text-[11px] font-mono text-[var(--mist-dim)] px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)]">
                {deal?.messages?.length || 0} messages
              </span>
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
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={disabled ? "Negotiation is closed." : "Type a message or bargaining counter..."}
                disabled={disabled}
                className="flex-1 bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--paper)] outline-none focus:border-[var(--teal)] disabled:opacity-50 placeholder:text-[var(--mist-dim)] transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={disabled || !chatText.trim()}
                className="w-10 h-10 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--teal-dim)] transition-all shrink-0 shadow-sm active:scale-95"
                title="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: TERM SHEET + INTERACTIVE COUNTER + COPILOT (4 or 5 cols) */}
        <div className={`${sidebarOpen && deals.length > 1 ? "lg:col-span-4" : "lg:col-span-5"} space-y-4`}>
          {/* Term Sheet Card */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 relative overflow-hidden shadow-sm">
            {locked && (
              <div className="sellx-stamp absolute top-3 right-3 border-2 border-[var(--green)] text-[var(--green)] rounded-lg px-2.5 py-1 text-[11px] font-display font-bold tracking-widest -rotate-6 bg-[var(--green)]/10">
                LOCKED
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[var(--mist)]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--mist)]">
                  Active Term Sheet
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TermStat label="Agreed Price" value={fmtINR(ts.unitPrice)} accent />
              <TermStat label="Delivery Timeline" value={`${ts.leadTimeDays} days`} />
            </div>

            <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-[var(--line)]/50">
              {locked ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--green)]">
                  <ShieldCheck size={15} /> Term sheet locked
                </span>
              ) : declined ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--red)]">
                  <XCircle size={15} /> Deal declined
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
                    <CreditCard size={14} /> Pay {fmtINR(ts.unitPrice)} via Escrow
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
                  {ts.paymentStatus === "paid" ? "Buyer has paid · Escrow ready for payout" : "Awaiting buyer escrow payment"}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Counter Proposal Tool */}
          {!disabled && (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight size={14} className="text-[var(--teal)]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--paper)]">
                    Submit Counter-Offer
                  </span>
                </div>
                {role === "buyer" && savings > 0 && (
                  <span className="text-[11px] font-mono text-[var(--green)] font-semibold flex items-center gap-1">
                    <TrendingDown size={11} /> Save {fmtINR(savings)} ({savingsPct.toFixed(1)}%)
                  </span>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[var(--mist-dim)] mr-1">Quick:</span>
                <button
                  type="button"
                  onClick={() => applyPresetDiscount(0.05)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-[11px] font-mono text-[var(--paper)] transition-colors"
                >
                  -5%
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetDiscount(0.10)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-[11px] font-mono text-[var(--paper)] transition-colors"
                >
                  -10%
                </button>
                <button
                  type="button"
                  onClick={applyMidpoint}
                  className="px-2.5 py-1 rounded-lg bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-[11px] font-mono text-[var(--paper)] transition-colors"
                >
                  Halfway
                </button>
              </div>

              {/* Price Slider */}
              <div>
                <FieldLabel hint={fmtINR(unitPrice)}>Proposed Unit Price</FieldLabel>
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
                <FieldLabel>Expedited Lead Time (Days)</FieldLabel>
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
                <FieldLabel>Note with proposal (Optional)</FieldLabel>
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

              {/* Actions */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                <PrimaryButton
                  tone="teal"
                  icon={ArrowLeftRight}
                  onClick={handleProposeCounter}
                >
                  Propose Counter {fmtINR(unitPrice)}
                </PrimaryButton>
                <div className="grid grid-cols-2 gap-2">
                  <PrimaryButton
                    tone="green"
                    icon={ShieldCheck}
                    onClick={() => onOpenAccept && onOpenAccept(deal.id)}
                  >
                    Accept &amp; Lock
                  </PrimaryButton>
                  <GhostButton
                    tone="danger"
                    icon={XCircle}
                    onClick={() => onDecline && onDecline(deal.id, role)}
                  >
                    Decline Deal
                  </GhostButton>
                </div>
              </div>
            </div>
          )}

          {/* AI Copilot Box */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden shadow-sm">
            <button
              onClick={() => setCopilotOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--surface2)]/40 transition-colors"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--paper)]">
                <Sparkles size={14} className="text-[var(--teal)]" /> {role === "buyer" ? "Buyer" : "Seller"} Copilot
                <Badge tone="neutral">AI Advisor</Badge>
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
