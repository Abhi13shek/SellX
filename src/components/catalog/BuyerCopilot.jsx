import React from "react";
import { Sparkles, MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { fmtINR } from "../../utils/formatters.js";

export function BuyerCopilot({ product, onUseSuggested }) {
  const suggested = Math.round(product.basePrice * 0.88);
  const locality = product.locality || "Indiranagar, BLR";
  const acceptanceRate = 72;

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[var(--teal)]/8 border border-[var(--teal)]/25">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-bold tracking-wide text-[var(--mist)]">Fair Second-Hand Valuation</span>
          <Badge tone="teal">
            <Sparkles size={10} /> AI Market Match
          </Badge>
        </div>
        <div className="flex items-end justify-between mt-1.5">
          <span className="font-mono text-xl font-bold text-[var(--price)] tabular-nums">{fmtINR(suggested)}</span>
          <button
            onClick={() => onUseSuggested(suggested)}
            className="text-xs font-semibold text-[var(--navy)] hover:underline"
          >
            Apply ₹{suggested.toLocaleString("en-IN")}
          </button>
        </div>
        <p className="text-[11px] text-[var(--mist)] mt-1.5 leading-relaxed">
          Pre-owned {product.category || "items"} in <b>{product.condition || "Like New"}</b> condition typically close between 10%–15% below list.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-bold tracking-wide text-[var(--mist)]">Owner Acceptance Probability</span>
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{acceptanceRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface3)] overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${acceptanceRate}%` }} />
        </div>
        <div className="text-[11px] text-[var(--mist-dim)] flex items-center gap-1 mt-1">
          <MapPin size={11} className="text-rose-400" />
          <span>Sellers in <b>{locality}</b> usually close fast if cash/UPI on pickup is offered.</span>
        </div>
      </div>
    </div>
  );
}
