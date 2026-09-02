import React, { useState, useEffect } from "react";
import { X, IndianRupee, Paperclip, Send } from "lucide-react";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { GhostButton, PrimaryButton } from "../common/Buttons.jsx";
import { fmtINR } from "../../utils/formatters.js";

export function RFQModal({ product, onClose, onSubmit }) {
  const [targetPrice, setTargetPrice] = useState(product ? (product.basePrice * 0.88).toFixed(2) : "");
  const [leadTime, setLeadTime] = useState(product ? product.leadTimeDays : 0);
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (product) {
      setTargetPrice((product.basePrice * 0.88).toFixed(2));
      setLeadTime(product.leadTimeDays);
      setNotes("");
      setFileName("");
    }
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sellx-pop relative w-full sm:max-w-lg bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] sticky top-0 bg-[var(--surface)] z-10">
          <div>
            <h3 className="font-display font-semibold text-[var(--paper)]">Make an offer</h3>
            <div className="text-xs text-[var(--mist)] mt-0.5">{product.name}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <FieldLabel hint={`list ${fmtINR(product.basePrice)}`}>Your target price</FieldLabel>
            <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3">
              <IndianRupee size={14} className="text-[var(--mist)]" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Required lead time (days)</FieldLabel>
            <input
              type="number"
              min="0"
              value={leadTime}
              onChange={(e) => setLeadTime(Number(e.target.value))}
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
            />
          </div>

          <div>
            <FieldLabel>Notes for the seller</FieldLabel>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Quality specs, packaging, timing..."
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none resize-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          <div>
            <FieldLabel>Attachments</FieldLabel>
            <label className="flex items-center gap-2 border border-dashed border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--mist)] cursor-pointer hover:border-[var(--teal)]/50 transition-colors">
              <Paperclip size={14} />
              {fileName || "Attach spec sheet or drawing"}
              <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
            <span className="text-xs uppercase tracking-wide text-[var(--mist)]">Your offer</span>
            <span className="font-mono text-lg font-bold text-[var(--navy)] tabular-nums">
              {fmtINR(Number(targetPrice || 0))}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
          <GhostButton onClick={onClose} className="flex-1">
            Cancel
          </GhostButton>
          <PrimaryButton
            tone="teal"
            icon={Send}
            className="flex-1"
            onClick={() =>
              onSubmit({
                product,
                targetPrice: Number(targetPrice),
                leadTime: Number(leadTime),
                notes,
                fileName,
              })
            }
          >
            Submit offer
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
