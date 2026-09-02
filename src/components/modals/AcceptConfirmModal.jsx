import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Lock, CheckCircle2, Copy, Check, Timer, IndianRupee } from "lucide-react";
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

  const handleConfirm = () => {
    onConfirm(deal.id);
    setStep("success");
  };

  const copyLink = () => {
    const url = ts.checkoutUrl || `https://sellx.trade/checkout/${deal.id.toLowerCase()}`;
    if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(url).catch(() => {});
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
              <h3 className="font-display font-semibold text-[var(--paper)]">Confirm &amp; lock term sheet</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--amber)]/10 border border-[var(--amber)]/30">
                <AlertTriangle size={16} className="text-[var(--amber)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--paper)] leading-relaxed">
                  This is a binding acceptance. Once confirmed, the term sheet locks for both parties and a time-limited
                  checkout link is generated.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--line)] divide-y divide-[var(--line-soft)] overflow-hidden">
                <SummaryRow label="Product" value={deal.product.name} />
                <SummaryRow label="Counterparty" value={role === "buyer" ? deal.sellerName : deal.buyerName} />
                <SummaryRow label="Agreed price" value={fmtINR(ts.unitPrice)} accent />
                <SummaryRow label="Lead time" value={`${ts.leadTimeDays} days`} />
              </div>
            </div>
            <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
              <GhostButton onClick={onClose} className="flex-1">
                Cancel
              </GhostButton>
              <PrimaryButton tone="green" icon={Lock} className="flex-1" onClick={handleConfirm}>
                Confirm &amp; lock deal
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[var(--green)]" /> Deal locked
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                <span className="text-xs text-[var(--mist)]">Locked price</span>
                <span className="font-mono text-lg font-bold text-[var(--price)] tabular-nums">
                  {fmtINR(ts.unitPrice)}
                </span>
              </div>

              <div>
                <FieldLabel>Locked checkout link</FieldLabel>
                <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5">
                  <span className="flex-1 truncate text-xs font-mono text-[var(--navy)]">
                    {ts.checkoutUrl || `https://sellx.trade/checkout/${deal.id.toLowerCase()}`}
                  </span>
                  <button onClick={copyLink} className="text-[var(--mist)] hover:text-[var(--paper)] shrink-0">
                    {copied ? <Check size={14} className="text-[var(--green)]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--red)]/8 border border-[var(--red)]/25">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--paper)]">
                  <Timer size={13} /> Link expires in
                </span>
                <span
                  className={`font-mono text-sm font-bold tabular-nums ${
                    checkoutCountdown.expired ? "text-[var(--red)]" : "text-[var(--red)]"
                  }`}
                >
                  {checkoutCountdown.expired ? "Expired" : checkoutCountdown.label}
                </span>
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
                  className="flex-1"
                  onClick={() => {
                    onClose();
                    onOpenPayment(deal.id);
                  }}
                >
                  Pay now
                </PrimaryButton>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
