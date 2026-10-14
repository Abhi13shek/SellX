import React, { useState, useMemo } from "react";
import { PackagePlus, Bot, MapPin, MessageSquare, Handshake, PackageCheck } from "lucide-react";
import { PrimaryButton } from "../common/Buttons.jsx";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { SellerDealCard } from "./SellerDealCard.jsx";
import { STAGES } from "../../data/constants.js";
import { getStage } from "../../utils/helpers.js";
import { fmtINR } from "../../utils/formatters.js";

export function SellerDesk({
  deals = [],
  myListings = [],
  onOpenDeal,
  onQuickAccept,
  onQuickCounter,
  onQuickReject,
  onAddItem,
  onOpenAutomationRules,
}) {
  const grouped = useMemo(() => {
    const g = Object.fromEntries(STAGES.map((stage) => [stage, []]));
    const stageMap = {
      "New Requests": "Incoming Offers",
      "In Negotiation": "Active Bargains",
      "Pending Acceptance": "Agreed / Handover Pending",
      "Closed/Won": "Completed Deals",
    };

    deals.forEach((d) => {
      const stage = d.termSheet?.status === "locked"
        ? "Agreed / Handover Pending"
        : stageMap[getStage(d)] || "Active Bargains";
      g[stage].push(d);
    });
    return g;
  }, [deals]);

  const [activeStage, setActiveStage] = useState(STAGES[0]);
  const actionCards = [
    {
      stage: "Incoming Offers",
      label: "Needs your reply",
      description: "New buyer offers waiting for a decision",
      icon: MessageSquare,
      tone: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      stage: "Active Bargains",
      label: "In negotiation",
      description: "Conversations with an open counter-offer",
      icon: Handshake,
      tone: "text-[var(--teal)] bg-[var(--teal)]/10 border-[var(--teal)]/20",
    },
    {
      stage: "Agreed / Handover Pending",
      label: "Ready for handover",
      description: "Agreed deals that need a safe completion",
      icon: PackageCheck,
      tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];
  const visibleDeals = grouped[activeStage] || [];

  return (
    <div className="sellx-rise">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)]">
            Seller workspace
          </h1>
          <p className="text-sm text-[var(--mist)] mt-1">
            Start with the offers that need you, then manage listings and automation.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <PrimaryButton tone="teal" icon={PackagePlus} onClick={onAddItem} className="font-bold shadow-md">
            + Post New Listing
          </PrimaryButton>
        </div>
      </div>

      <section aria-label="Seller priorities" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
        {actionCards.map(({ stage, label, description, icon: Icon, tone }) => {
          const count = grouped[stage]?.length || 0;
          const isActive = activeStage === stage;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setActiveStage(stage)}
              className={`text-left rounded-2xl border p-4 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/50 ${
                isActive ? "border-[var(--teal)] bg-[var(--surface2)] shadow-sm" : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--teal)]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${tone}`}><Icon size={17} /></div>
                <span className="font-mono text-xl font-bold text-[var(--paper)] tabular-nums">{count}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--paper)]">{label}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--mist)]">{description}</p>
            </button>
          );
        })}
      </section>

      {/* Active Listings Row */}
      {myListings.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--mist)]">
              Your Listed Items ({myListings.length})
            </h3>
            <span className="text-xs text-[var(--teal)] font-semibold">Live in Marketplace</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {myListings.map((p) => {
              const hasRules = p.automationRules?.enabled;
              const condition = p.condition || "Like New";
              const locality = p.locality || "Indiranagar, BLR";

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--teal)]/40 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="relative">
                      <ProductImageTile category={p.category} Icon={p.icon} image={p.image} size="lg" />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-white text-[10px] font-bold">
                          {condition}
                        </span>
                      </div>
                    </div>

                    <div className="font-display font-semibold text-sm text-[var(--paper)] mt-3 leading-snug truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-[var(--mist-dim)] flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-rose-400" /> {locality}
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--line-soft)]">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[var(--mist-dim)] block">Asking</span>
                        <span className="font-mono text-sm font-bold text-[var(--price)]">{fmtINR(p.basePrice)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-[var(--mist-dim)] block">Auto-Floor</span>
                        <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {fmtINR(p.minAcceptablePrice || p.basePrice * 0.85)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[var(--line-soft)]">
                    <button
                      onClick={() => onOpenAutomationRules && onOpenAutomationRules(p)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        hasRules
                          ? "bg-[var(--teal)]/10 text-[var(--teal)] border-[var(--teal)]/30 hover:bg-[var(--teal)]/20"
                          : "bg-[var(--surface2)] text-[var(--mist)] border-[var(--line)] hover:text-[var(--paper)] hover:bg-[var(--surface3)]"
                      }`}
                    >
                      <Bot size={13} />
                      <span>{hasRules ? "⚡ Auto-Accept Bot On" : "Setup Auto-Accept"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bargain Pipeline Tabs */}
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--mist)]">All negotiations</h3>
          <p className="text-xs text-[var(--mist-dim)] mt-1">
            Showing {visibleDeals.length} {visibleDeals.length === 1 ? "deal" : "deals"} in {activeStage.toLowerCase()}.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {STAGES.map((s) => {
          const count = (grouped[s] || []).length;
          const isSelected = activeStage === s;
          return (
            <button
              key={s}
              onClick={() => setActiveStage(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[var(--teal)] text-[var(--on-teal)] border-[var(--teal)] shadow-sm"
                  : "bg-[var(--surface)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)]"
              }`}
            >
              <span>{s}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isSelected ? "bg-white/20" : "bg-[var(--surface2)] text-[var(--mist-dim)]"}`}>
                {count}
              </span>
              {isSelected && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[var(--teal)] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[120px]">
        {visibleDeals.length === 0 && (
          <div className="sm:col-span-2 xl:col-span-3 rounded-xl border border-dashed border-[var(--line)] py-10 text-center text-[11px] text-[var(--mist-dim)]">
            No deals in {activeStage}
          </div>
        )}
        {visibleDeals.map((deal) => (
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
