import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Lock, CheckCircle2, Copy, Check, Timer, IndianRupee, ShieldCheck, MapPin } from "lucide-react";
import { SummaryRow } from "../common/SummaryRow.jsx";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { GhostButton, PrimaryButton } from "../common/Buttons.jsx";
import { useCountdown } from "../../hooks/useCountdown.js";
import { fmtINR } from "../../utils/formatters.js";

export function AcceptConfirmModal({ deal, role, onClose, onConfirm, viewOnly, onOpenPayment }) {
  const [step, setStep] = useState(viewOnly ? "success" : "confirm");
  const [copied, setCopied] = useState(false);

  useEffect(() => setStep(viewOnly ? "success" : "confirm"), [deal?.id, viewOnly]);

  const ts = deal ? deal.termSheet : null;
  const checkoutCountdown = useCountdown(ts ? ts.checkoutExpiresAt : 0);

  if (!deal) return null;

  const otp = deal.handoverOtp || ts?.handoverOtp || "8429";
  const meetupSpot = deal.meetupLocation || ts?.meetupLocation || (deal.product?.locality ? `${deal.product.locality}, ${deal.product.city || "BLR"}` : "Indiranagar Metro Station");

  const handleConfirm = () => {
    onConfirm(deal.id);
    setStep("success");
  };

  const copyCode = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`SellX Deal ${deal.id} - Handover Passcode: ${otp} for ${deal.product.name} at ${fmtINR(ts.unitPrice)}`).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sellx-pop relative w-full sm:max-w-md bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {step === "confirm" ? (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)]">Confirm &amp; Accept Bargain</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--paper)] leading-relaxed">
                  Accepting this offer locks the price for both parties and generates your <b>4-digit Handover Passcode</b> for physical verification.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--line)] divide-y divide-[var(--line-soft)] overflow-hidden">
                <SummaryRow label="Item" value={deal.product.name} />
                <SummaryRow label="Counterparty" value={role === "buyer" ? deal.sellerName : deal.buyerName} />
                <SummaryRow label="Agreed Price" value={fmtINR(ts.unitPrice)} accent />
                <SummaryRow label="Handover Mode" value={deal.handoverType || ts.handoverType || "Local Meetup"} />
                <SummaryRow label="Meetup Spot" value={meetupSpot} />
              </div>
            </div>
            <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
              <GhostButton onClick={onClose} className="flex-1">
                Cancel
              </GhostButton>
              <PrimaryButton tone="green" icon={CheckCircle2} className="flex-1 font-bold shadow-md" onClick={handleConfirm}>
                Accept &amp; Generate OTP
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[var(--green)]" /> Deal Agreed &amp; Passcode Ready
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Handover Passcode Banner */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5">
                <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 block">
                  🔒 Handover Passcode (OTP)
                </span>
                <div className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-widest py-1">
                  {otp}
                </div>
                <p className="text-xs text-[var(--mist)] leading-relaxed">
                  {role === "buyer"
                    ? "Verify the item condition in person during meetup, then give this 4-digit code to the seller to complete handover."
                    : "Meet the buyer at the designated spot. Collect this 4-digit code before handing over the item."}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                <span className="text-xs text-[var(--mist)]">Agreed Price</span>
                <span className="font-mono text-lg font-bold text-[var(--price)] tabular-nums">
                  {fmtINR(ts.unitPrice)}
                </span>
              </div>

              <div>
                <FieldLabel>Meetup Location</FieldLabel>
                <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5">
                  <MapPin size={15} className="text-rose-500 shrink-0" />
                  <span className="flex-1 truncate text-xs font-semibold text-[var(--paper)]">
                    {meetupSpot}
                  </span>
                  <button onClick={copyCode} className="text-[var(--mist)] hover:text-[var(--paper)] shrink-0" title="Copy deal details">
                    {copied ? <Check size={14} className="text-[var(--green)]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--line)] flex items-center gap-2">
              <GhostButton onClick={onClose} className="flex-1">
                Done
              </GhostButton>
              {role === "buyer" && (
                <PrimaryButton
                  tone="teal"
                  icon={IndianRupee}
                  className="flex-1 font-bold shadow-md"
                  onClick={() => {
                    onClose();
                    onOpenPayment(deal.id);
                  }}
                >
                  Pay via Safe Escrow
                </PrimaryButton>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
