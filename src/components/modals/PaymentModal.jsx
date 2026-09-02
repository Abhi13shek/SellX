import React, { useState, useEffect } from "react";
import { X, AlertTriangle, ShieldCheck, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { SummaryRow } from "../common/SummaryRow.jsx";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { GhostButton, PrimaryButton } from "../common/Buttons.jsx";
import { PAYMENT_METHODS, BANKS } from "../../data/constants.js";
import { fmtINR } from "../../utils/formatters.js";

export function PaymentModal({ deal, onClose, onConfirm }) {
  const [step, setStep] = useState("select");
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState(BANKS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    setStep("select");
    setMethod("upi");
    setUpiId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setBank(BANKS[0]);
    setError("");
  }, [deal?.id]);

  if (!deal) return null;
  const ts = deal.termSheet;

  const handlePay = () => {
    if (method === "upi" && !upiId.trim()) {
      setError("Enter a valid UPI ID.");
      return;
    }
    if (method === "card" && (cardNumber.replace(/\s/g, "").length < 12 || !cardExpiry || cardCvv.length < 3)) {
      setError("Enter valid card details.");
      return;
    }
    setError("");
    setStep("processing");
    setTimeout(() => {
      onConfirm(deal.id, method);
      setStep("success");
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={step === "processing" ? undefined : onClose} />
      <div className="sellx-pop relative w-full sm:max-w-md bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {step === "select" && (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)]">Pay for this order</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                <span className="text-xs text-[var(--mist)]">Amount due</span>
                <span className="font-mono text-lg font-bold text-[var(--price)] tabular-nums">
                  {fmtINR(ts.unitPrice)}
                </span>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30">
                  <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
                  <span className="text-xs text-[var(--paper)]">{error}</span>
                </div>
              )}

              <div>
                <FieldLabel>Payment method</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => {
                        setMethod(m.key);
                        setError("");
                      }}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-colors ${
                        method === m.key
                          ? "bg-[var(--teal)]/15 border-[var(--teal)]/40 text-[var(--navy)]"
                          : "border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                      }`}
                    >
                      <m.icon size={18} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {method === "upi" && (
                <div>
                  <FieldLabel>UPI ID</FieldLabel>
                  <input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@bank"
                    className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                  />
                </div>
              )}

              {method === "card" && (
                <div className="space-y-3">
                  <div>
                    <FieldLabel>Card number</FieldLabel>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Expiry</FieldLabel>
                      <input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                      />
                    </div>
                    <div>
                      <FieldLabel>CVV</FieldLabel>
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        type="password"
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === "netbanking" && (
                <div>
                  <FieldLabel>Select bank</FieldLabel>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none appearance-none"
                  >
                    {BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-[var(--mist-dim)]">
                <ShieldCheck size={12} /> Payments are simulated in this demo — no real transaction occurs.
              </div>
            </div>
            <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
              <GhostButton onClick={onClose} className="flex-1">
                Cancel
              </GhostButton>
              <PrimaryButton tone="teal" icon={Lock} className="flex-1" onClick={handlePay}>
                Pay {fmtINR(ts.unitPrice)}
              </PrimaryButton>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="p-10 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 size={28} className="text-[var(--teal)] animate-spin" />
            <div className="text-sm font-semibold text-[var(--paper)]">Processing payment&hellip;</div>
            <div className="text-xs text-[var(--mist)]">Don&apos;t close this window.</div>
          </div>
        )}

        {step === "success" && (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[var(--green)]" /> Payment successful
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-xl border border-[var(--line)] divide-y divide-[var(--line-soft)] overflow-hidden">
                <SummaryRow label="Product" value={deal.product.name} />
                <SummaryRow label="Amount paid" value={fmtINR(ts.unitPrice)} accent />
                <SummaryRow
                  label="Method"
                  value={PAYMENT_METHODS.find((m) => m.key === method)?.label || method}
                />
              </div>
              <p className="text-xs text-[var(--mist)] leading-relaxed">
                {deal.sellerName} has been notified. Order fulfillment begins now.
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
