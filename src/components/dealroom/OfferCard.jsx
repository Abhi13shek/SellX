import React from "react";
import { CheckCircle2, ArrowLeftRight, Clock, TrendingUp, TrendingDown, ShieldCheck, XCircle } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { MiniStat } from "../common/MiniStat.jsx";
import { fmtINR } from "../../utils/formatters.js";
import { ProductImageTile } from "../common/ProductImageTile.jsx";

export function OfferCard({ offer, role, mine, product, onAccept, onCounter, onDecline, isLatest }) {
  const delta = offer.previousUnitPrice != null ? offer.unitPrice - offer.previousUnitPrice : null;
  const deltaPct = delta != null && offer.previousUnitPrice ? (delta / offer.previousUnitPrice) * 100 : null;
  const statusTone = offer.status === "accepted" ? "green" : offer.status === "superseded" ? "neutral" : "amber";
  const isProposed = offer.status === "proposed";

  return (
    <div className={`sellx-ticket rounded-2xl p-4 sm:p-5 w-full max-w-sm border border-[var(--line)] bg-[var(--surface)] shadow-md transition-all ${offer.status === "superseded" ? "opacity-60" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[var(--line-soft)]">
        <div className="flex items-center gap-2">
          {product && (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[var(--line)] shrink-0 bg-[var(--surface2)]">
              <ProductImageTile
                src={product.image}
                category={product.category}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--mist-dim)] block">
              {mine ? "Your Offer" : "Inbound Offer"}
            </span>
            <span className="text-xs font-semibold text-[var(--paper)]">
              {offer.status === "accepted" ? "Agreed Terms" : isProposed ? "Pending Response" : "Superseded"}
            </span>
          </div>
        </div>

        <Badge tone={statusTone}>
          {offer.status === "accepted" && <CheckCircle2 size={10} />}
          {offer.status === "superseded" && <ArrowLeftRight size={10} />}
          {offer.status === "proposed" && <Clock size={10} />}
          {offer.status}
        </Badge>
      </div>

      {/* Main Price Figures */}
      <div className="flex items-baseline gap-2 my-1">
        <span className="font-mono text-2xl sm:text-3xl font-bold text-[var(--price)] tabular-nums">
          {fmtINR(offer.unitPrice)}
        </span>
        <span className="text-xs text-[var(--mist)]">/ unit</span>

        {deltaPct != null && (
          <span
            className={`ml-auto flex items-center gap-0.5 text-xs font-semibold font-mono px-2 py-0.5 rounded-full ${
              delta > 0
                ? "bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20"
                : delta < 0
                ? "bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/20"
                : "bg-[var(--surface2)] text-[var(--mist)]"
            }`}
          >
            {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : null}
            {delta === 0 ? "flat" : `${delta > 0 ? "+" : ""}${deltaPct.toFixed(1)}%`}
          </span>
        )}
      </div>

      {/* Details Row */}
      <div className="mt-3 pt-3 border-t border-[var(--line)] border-dashed grid grid-cols-2 gap-2 text-xs">
        <MiniStat label="Delivery Lead" value={`${offer.leadTimeDays} days`} />
        {product?.basePrice && (
          <MiniStat
            label="From List"
            value={`${Math.round(((product.basePrice - offer.unitPrice) / product.basePrice) * 100)}% off`}
          />
        )}
      </div>

      {/* 1-Click Quick Actions on latest incoming offer */}
      {!mine && isProposed && isLatest && onAccept && (
        <div className="mt-3.5 pt-3 border-t border-[var(--line)] flex items-center gap-2">
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--green)] text-[var(--on-green)] text-xs font-semibold hover:brightness-110 transition-all shadow-sm active:scale-95"
          >
            <ShieldCheck size={13} />
            <span>Accept {fmtINR(offer.unitPrice)}</span>
          </button>
          {onDecline && (
            <button
              onClick={onDecline}
              className="py-2 px-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--red)] hover:bg-[var(--red)]/10 hover:border-[var(--red)]/30 transition-all"
              title="Decline Offer"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
