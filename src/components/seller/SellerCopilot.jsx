import React from "react";
import { Gauge } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { QUICK_REPLIES } from "../../data/constants.js";
import { marginHealth } from "../../utils/helpers.js";
import { healthColor } from "../../utils/styles.js";
import { fmtINR } from "../../utils/formatters.js";

export function SellerCopilot({ product, unitPrice, targetMarginPct, onQuickReply }) {
  const health = marginHealth(unitPrice, product.cost, targetMarginPct);
  const margin = unitPrice - product.cost;
  const floorPrice = product.cost / (1 - targetMarginPct * 0.6);

  return (
    <div className="space-y-3">
      <div
        className="p-3 rounded-xl border"
        style={{
          background: `${healthColor[health.level]}14`,
          borderColor: `${healthColor[health.level]}40`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-[var(--mist)]">Live profit margin</span>
          <Badge tone={health.level === "healthy" ? "green" : health.level === "warn" ? "amber" : "red"}>
            {health.label}
          </Badge>
        </div>
        <div className="flex items-end gap-3 mt-1.5">
          <span className="font-mono text-xl font-bold tabular-nums" style={{ color: healthColor[health.level] }}>
            {(health.m * 100).toFixed(1)}%
          </span>
          <span className="text-xs text-[var(--mist)] font-mono">{fmtINR(margin)} margin</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[var(--mist)]">
          <Gauge size={12} /> Floor price
        </div>
        <p className="text-xs text-[var(--paper)] mt-1.5 leading-relaxed">
          Don't counter below <span className="font-mono font-semibold">{fmtINR(floorPrice)}</span> — that's where your
          margin starts to fall below target on this item.
        </p>
      </div>

      <div>
        <span className="text-[11px] uppercase tracking-wide text-[var(--mist)]">Quick-reply templates</span>
        <div className="flex flex-col gap-1.5 mt-1.5">
          {QUICK_REPLIES.map((t) => (
            <button
              key={t}
              onClick={() => onQuickReply(t)}
              className="text-left text-xs px-3 py-2 rounded-lg bg-[var(--surface2)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--brass)]/40 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
