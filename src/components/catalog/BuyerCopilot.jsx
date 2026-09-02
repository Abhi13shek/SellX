import React from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { fmtINR } from "../../utils/formatters.js";

export function BuyerCopilot({ product, onUseSuggested }) {
  const suggested = product.basePrice * 0.87;
  const acceptanceRate = 68;

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[var(--teal)]/8 border border-[var(--teal)]/25">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-[var(--mist)]">Suggested target price</span>
          <Badge tone="teal">
            <Sparkles size={10} /> Benchmark
          </Badge>
        </div>
        <div className="flex items-end justify-between mt-1.5">
          <span className="font-mono text-xl font-bold text-[var(--price)] tabular-nums">{fmtINR(suggested)}</span>
          <button
            onClick={() => onUseSuggested(Number(suggested.toFixed(2)))}
            className="text-xs font-semibold text-[var(--navy)] hover:underline"
          >
            Use this price
          </button>
        </div>
        <p className="text-[11px] text-[var(--mist)] mt-1.5 leading-relaxed">
          Based on 30-day category benchmarks, 13% below list price is a common landing point.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-wide text-[var(--mist)]">Historical seller acceptance</span>
          <span className="font-mono text-xs font-bold text-[var(--paper)]">{acceptanceRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface3)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--teal)]" style={{ width: `${acceptanceRate}%` }} />
        </div>
        <p className="text-[11px] text-[var(--mist-dim)] mt-1.5">
          Sellers in this category accepted first counters at this discount 68% of the time.
        </p>
      </div>
    </div>
  );
}
