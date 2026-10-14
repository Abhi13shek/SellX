import React, { useState, useEffect } from "react";
import { X, IndianRupee, Send, Sparkles, MapPin, ShieldCheck, Zap } from "lucide-react";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { GhostButton, PrimaryButton } from "../common/Buttons.jsx";
import { BUYER_QUICK_OFFERS } from "../../data/constants.js";
import { fmtINR } from "../../utils/formatters.js";

export function RFQModal({ product, onClose, onSubmit, initialPrice = null }) {
  const [targetPrice, setTargetPrice] = useState(
    initialPrice ? initialPrice.toString() : product ? Math.round(product.basePrice * 0.9).toString() : ""
  );
  const [handoverType, setHandoverType] = useState("Local Meetup");
  const [notes, setNotes] = useState("Can pick up today and pay via UPI upon inspection!");
  const [offerError, setOfferError] = useState("");

  useEffect(() => {
    if (product) {
      setTargetPrice(initialPrice ? initialPrice.toString() : Math.round(product.basePrice * 0.9).toString());
      setHandoverType("Local Meetup");
      setNotes("Can pick up today and pay via UPI upon inspection!");
      setOfferError("");
    }
  }, [product, initialPrice]);

  if (!product) return null;

  const currentPrice = Number(targetPrice || 0);
  const discountPct = product.basePrice > 0 ? Math.round(((product.basePrice - currentPrice) / product.basePrice) * 100) : 0;

  const setQuickDiscount = (pct) => {
    setTargetPrice(Math.round(product.basePrice * pct).toString());
    setOfferError("");
  };

  const submitOffer = () => {
    if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
      setOfferError("Enter an offer amount greater than ₹0 to continue.");
      return;
    }

    onSubmit({
      product,
      targetPrice: currentPrice,
      leadTime: 1,
      handoverType,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sellx-pop relative w-full sm:max-w-md bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] sticky top-0 bg-[var(--surface)] z-10">
          <div>
            <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-1.5">
              <Sparkles size={16} className="text-[var(--teal)]" /> Make an Offer &middot; Bargain
            </h3>
            <div className="text-xs text-[var(--mist)] mt-0.5 truncate max-w-xs">{product.name}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Offer price */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <FieldLabel>Enter your offer</FieldLabel>
                <p id="offer-price-help" className="mt-1 text-[11px] text-[var(--mist)]">
                  Type the amount you want to pay. Asking price: {fmtINR(product.basePrice)}.
                </p>
              </div>
              {discountPct > 0 && (
                <span className="text-[11px] font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {discountPct}% off asking
                </span>
              )}
            </div>

            <label
              htmlFor="offer-price"
              className="flex items-center gap-3 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-4 focus-within:border-[var(--teal)] focus-within:ring-2 focus-within:ring-[var(--teal)]/15 transition-all cursor-text"
            >
              <IndianRupee size={19} className="text-[var(--teal)] shrink-0" />
              <input
                id="offer-price"
                name="offerPrice"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={targetPrice}
                onChange={(e) => {
                  setTargetPrice(e.target.value);
                  setOfferError("");
                }}
                aria-describedby="offer-price-help"
                aria-invalid={Boolean(offerError)}
                className="w-full bg-transparent py-3 text-lg font-mono font-bold text-[var(--paper)] outline-none"
              />
            </label>
            {offerError && <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{offerError}</p>}

            {/* One-click suggestions */}
            <div className="mt-3">
              <span className="text-[10px] uppercase font-bold text-[var(--mist-dim)] tracking-wider">Quick suggestions</span>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
              {BUYER_QUICK_OFFERS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setQuickDiscount(opt.pct)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-mono font-semibold transition-colors ${
                    currentPrice === Math.round(product.basePrice * opt.pct)
                      ? "border-[var(--teal)] bg-[var(--teal)]/10 text-[var(--teal)]"
                      : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--teal)]/40"
                  }`}
                >
                  <span className="block">{opt.label}</span>
                  <span className="block mt-0.5">{fmtINR(Math.round(product.basePrice * opt.pct))}</span>
                </button>
              ))}
              </div>
            </div>
          </div>

          {/* Handover Type */}
          <div>
            <FieldLabel>Handover Preference</FieldLabel>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setHandoverType("Local Meetup")}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                  handoverType === "Local Meetup"
                    ? "bg-[var(--teal)]/10 border-[var(--teal)]/50 text-[var(--paper)] shadow-sm"
                    : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <MapPin size={13} className="text-rose-500" />
                  <span>Face-to-Face Meetup</span>
                </div>
                <div className="text-[10px] text-[var(--mist)] mt-0.5 font-normal">
                  {product.locality || "Indiranagar"} area
                </div>
              </button>

              <button
                type="button"
                onClick={() => setHandoverType("Courier Delivery")}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                  handoverType === "Courier Delivery"
                    ? "bg-[var(--teal)]/10 border-[var(--teal)]/50 text-[var(--paper)] shadow-sm"
                    : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Zap size={13} className="text-amber-500" />
                  <span>Instant Courier</span>
                </div>
                <div className="text-[10px] text-[var(--mist)] mt-0.5 font-normal">
                  Dunzo / Porter door-to-door
                </div>
              </button>
            </div>
          </div>

          {/* Note to Seller */}
          <div>
            <FieldLabel>Message for Owner</FieldLabel>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Can meet at metro station this evening..."
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--paper)] outline-none resize-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          {/* Safe Handover Tip */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-700 dark:text-emerald-300">
            <ShieldCheck size={14} className="shrink-0 mt-0.5" />
            <span>4-Digit Handover OTP generated once owner accepts. Inspect before releasing passcode.</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
          <GhostButton onClick={onClose} className="flex-1">
            Cancel
          </GhostButton>
          <PrimaryButton
            tone="teal"
            icon={Send}
            className="flex-1 font-bold shadow-md"
            onClick={submitOffer}
          >
            Send Offer ({fmtINR(currentPrice || Math.round(product.basePrice * 0.9))})
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
