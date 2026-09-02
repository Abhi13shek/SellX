import React, { useState, useEffect } from "react";
import { X, AlertTriangle, XCircle } from "lucide-react";
import { SummaryRow } from "../common/SummaryRow.jsx";
import { GhostButton, PrimaryButton } from "../common/Buttons.jsx";
import { fmtINR } from "../../utils/formatters.js";

export function DeclineConfirmModal({ deal, role, onClose, onConfirm }) {
  const [step, setStep] = useState("confirm");

  useEffect(() => setStep("confirm"), [deal?.id]);

  if (!deal) return null;
  const ts = deal.termSheet;

  const handleConfirm = () => {
    onConfirm(deal.id, role);
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sellx-pop relative w-full sm:max-w-md bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {step === "confirm" ? (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)]">Confirm decline</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30">
                <AlertTriangle size={16} className="text-[var(--red)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--paper)] leading-relaxed">
                  This will end the deal for both parties. Once declined, this offer can no longer be accepted or
                  countered — this action can't be undone.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--line)] divide-y divide-[var(--line-soft)] overflow-hidden">
                <SummaryRow label="Product" value={deal.product.name} />
                <SummaryRow label="Counterparty" value={role === "buyer" ? deal.sellerName : deal.buyerName} />
                <SummaryRow label="Current offer" value={fmtINR(ts.unitPrice)} accent />
              </div>
            </div>
            <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
              <GhostButton onClick={onClose} className="flex-1">
                Cancel
              </GhostButton>
              <PrimaryButton tone="red" icon={XCircle} className="flex-1" onClick={handleConfirm}>
                Decline deal
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
                <XCircle size={16} className="text-[var(--red)]" /> Deal declined
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-[var(--mist)] leading-relaxed">
                {role === "seller" ? `${deal.id} for ${deal.product.name}` : deal.product.name} has been marked as
                declined and moved to your closed deals.
              </p>
            </div>
            <div className="p-5 border-t border-[var(--line)]">
              <PrimaryButton tone="teal" className="w-full" onClick={onClose}>
                Done
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
