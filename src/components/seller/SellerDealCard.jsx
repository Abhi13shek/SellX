import React from "react";
import { Building2, CheckCircle2, Lock, XCircle, Clock } from "lucide-react";
import { CategoryIcon } from "../common/Icons.jsx";
import { MiniStat } from "../common/MiniStat.jsx";
import { Badge } from "../common/Badge.jsx";
import { catColor, hexToRgba, healthColor } from "../../utils/styles.js";
import { fmtINR } from "../../utils/formatters.js";
import { marginHealth } from "../../utils/helpers.js";

export function SellerDealCard({ deal, onOpen, onQuickAccept, onQuickCounter, onQuickReject }) {
  const ts = deal.termSheet;
  const health = marginHealth(ts.unitPrice, deal.product.cost, deal.targetMarginPct);
  const isOpen = ts.status === "proposed";
  const isLocked = ts.status === "locked";
  const isDeclined = ts.status === "declined";

  const cardColor = catColor(deal.product.category);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 pl-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: "var(--line)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hexToRgba(cardColor, 0.5);
        e.currentTarget.style.boxShadow = `0 14px 28px -16px ${hexToRgba(cardColor, 0.5)}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: cardColor }} />
      <button onClick={onOpen} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-[var(--mist-dim)]">{deal.id}</div>
            <div className="font-display font-semibold text-sm text-[var(--paper)] leading-snug mt-0.5 truncate">
              {deal.product.name}
            </div>
            <div className="text-xs text-[var(--mist)] mt-0.5 flex items-center gap-1">
              <Building2 size={11} />
              {deal.buyerName}
            </div>
          </div>
          <CategoryIcon category={deal.product.category} Icon={deal.product.icon} size="sm" />
        </div>

        <div className="mt-3">
          <MiniStat label="Offer price" value={fmtINR(ts.unitPrice)} />
        </div>

        <div className="flex items-center justify-between mt-3">
          {isLocked ? (
            <Badge tone={ts.paymentStatus === "paid" ? "green" : "brass"}>
              {ts.paymentStatus === "paid" ? <CheckCircle2 size={10} /> : <Lock size={10} />}
              {ts.paymentStatus === "paid" ? "Paid" : "Locked"}
            </Badge>
          ) : isDeclined ? (
            <Badge tone="red">
              <XCircle size={10} /> Declined
            </Badge>
          ) : (
            <Badge tone="amber">
              <Clock size={10} /> Awaiting reply
            </Badge>
          )}
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: healthColor[health.level] }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor[health.level] }} />
            {(health.m * 100).toFixed(0)}% margin
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-[var(--line-soft)]">
          <button
            onClick={onQuickAccept}
            className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--green)]/10 text-[var(--green)] hover:bg-[var(--green)]/20 transition-colors"
          >
            Accept target
          </button>
          <button
            onClick={() => onQuickCounter(0.05)}
            className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--surface3)] text-[var(--paper)] hover:bg-[var(--line)] transition-colors"
          >
            Counter +5%
          </button>
          <button
            onClick={() => onQuickCounter(0.1)}
            className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--surface3)] text-[var(--paper)] hover:bg-[var(--line)] transition-colors"
          >
            Counter +10%
          </button>
          <button
            onClick={onQuickReject}
            className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--red)]/10 text-[var(--red)] hover:bg-[var(--red)]/20 transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
