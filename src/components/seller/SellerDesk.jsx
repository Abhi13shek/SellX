import React, { useState, useMemo } from "react";
import { PackagePlus } from "lucide-react";
import { PrimaryButton } from "../common/Buttons.jsx";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { SellerDealCard } from "./SellerDealCard.jsx";
import { STAGES } from "../../data/constants.js";
import { getStage, marginHealth } from "../../utils/helpers.js";
import { healthColor } from "../../utils/styles.js";
import { fmtINR } from "../../utils/formatters.js";

export function SellerDesk({
  deals,
  myListings,
  onOpenDeal,
  onQuickAccept,
  onQuickCounter,
  onQuickReject,
  onAddItem,
}) {
  const grouped = useMemo(() => {
    const g = { "New Requests": [], "In Negotiation": [], "Pending Acceptance": [], "Closed/Won": [] };
    deals.forEach((d) => g[getStage(d)].push(d));
    return g;
  }, [deals]);
  const [activeStage, setActiveStage] = useState(STAGES[0]);

  return (
    <div className="sellx-rise">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)]">Seller Trade Desk</h1>
          <p className="text-sm text-[var(--mist)] mt-1">
            Inbound buyer offers, active negotiations, and closed deals for your pre-owned listings.
          </p>
        </div>
        <PrimaryButton tone="teal" icon={PackagePlus} onClick={onAddItem}>
          List used item
        </PrimaryButton>
      </div>

      {myListings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--mist)] mb-3">Your listings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {myListings.map((p) => {
              const health = marginHealth(p.basePrice, p.cost, 0.24);
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--teal)]/40 transition-colors"
                >
                  <ProductImageTile category={p.category} Icon={p.icon} image={p.image} size="lg" />
                  <div className="font-display font-semibold text-sm text-[var(--paper)] mt-3 leading-snug">
                    {p.name}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--mist-dim)] mt-0.5">{p.sku}</div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-mono text-sm font-bold text-[var(--price)]">{fmtINR(p.basePrice)}</span>
                    <span
                      className="flex items-center gap-1 text-[11px] font-semibold"
                      style={{ color: healthColor[health.level] }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor[health.level] }} />
                      {(health.m * 100).toFixed(0)}% margin
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--mist)] mb-3">Negotiation pipeline</h3>

      <div className="flex flex-wrap gap-2 mb-5 border-b border-[var(--line-soft)] pb-0">
        {STAGES.map((stage) => {
          const isActive = stage === activeStage;
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`relative px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-2 ${
                isActive ? "text-[var(--paper)]" : "text-[var(--mist-dim)] hover:text-[var(--mist)]"
              }`}
            >
              {stage}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-[var(--teal)] text-[var(--on-teal)]" : "bg-[var(--surface2)] text-[var(--mist-dim)]"
                }`}
              >
                {grouped[stage].length}
              </span>
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[var(--teal)] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[120px]">
        {grouped[activeStage].length === 0 && (
          <div className="sm:col-span-2 xl:col-span-3 rounded-xl border border-dashed border-[var(--line)] py-10 text-center text-[11px] text-[var(--mist-dim)]">
            No deals in {activeStage}
          </div>
        )}
        {grouped[activeStage].map((deal) => (
          <SellerDealCard
            key={deal.id}
            deal={deal}
            onOpen={() => onOpenDeal(deal.id)}
            onQuickAccept={() => onQuickAccept(deal.id)}
            onQuickCounter={(pct) => onQuickCounter(deal.id, pct)}
            onQuickReject={() => onQuickReject(deal.id)}
          />
        ))}
      </div>
    </div>
  );
}
