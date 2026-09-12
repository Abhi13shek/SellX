import React from "react";
import { Gauge, Sparkles, MessageCircle } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { QUICK_REPLIES } from "../../data/constants.js";
import { fmtINR } from "../../utils/formatters.js";

export function SellerCopilot({ product, unitPrice, onQuickReply }) {
  const minFloor = product.minAcceptablePrice || Math.round(product.basePrice * 0.85);
  const isAboveFloor = unitPrice >= minFloor;

  return (
    <div className="space-y-3">
      <div
        className="p-3 rounded-xl border"
        style={{
          background: isAboveFloor ? "rgba(16, 185, 129, 0.08)" : "rgba(245, 158, 11, 0.08)",
          borderColor: isAboveFloor ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-bold tracking-wide text-[var(--mist)]">Offer Evaluation</span>
          <Badge tone={isAboveFloor ? "green" : "amber"}>
            {isAboveFloor ? "Good Deal" : "Below Min Floor"}
          </Badge>
        </div>
        <div className="flex items-end gap-2 mt-1.5">
          <span className="font-mono text-xl font-bold tabular-nums text-[var(--price)]">
            {fmtINR(unitPrice)}
          </span>
          <span className="text-xs text-[var(--mist)] font-mono">
            ({Math.round(((product.basePrice - unitPrice) / product.basePrice) * 100)}% off asking)
          </span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
        <div className="flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-wide text-[var(--mist)]">
          <Gauge size={12} className="text-[var(--teal)]" /> Reserve Floor Price
        </div>
        <p className="text-xs text-[var(--paper)] mt-1.5 leading-relaxed">
          Your minimum target for this item is <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{fmtINR(minFloor)}</span>.
          Offers at or above this generate immediate safe deals.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-wide text-[var(--mist)] mb-1.5">
          <MessageCircle size={12} />
          <span>Quick 1-Tap Replies</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {QUICK_REPLIES.map((t) => (
            <button
              key={t}
              onClick={() => onQuickReply(t)}
              className="text-left text-xs px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--teal)]/40 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
