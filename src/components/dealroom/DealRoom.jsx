import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Search,
  ArrowRight,
  Clock,
  ShieldCheck,
  XCircle,
  Sparkles,
  Store,
  ChevronRight,
  Building2,
  Calendar,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { CategoryIcon } from "../common/Icons.jsx";
import { Badge } from "../common/Badge.jsx";
import { DealRoomActive } from "./DealRoomActive.jsx";
import { getStage } from "../../utils/helpers.js";
import { fmtINR } from "../../utils/formatters.js";
import { ProductImageTile } from "../common/ProductImageTile.jsx";

export function DealRoom({
  role,
  deals = [],
  activeDeal,
  activeDealId,
  setActiveDealId,
  onSelectDeal,
  onSendMessage,
  onProposeCounter,
  onOpenAccept,
  onRequestLock,
  onDecline,
  onRequestDecline,
  onOpenPayment,
  onOpenCatalog,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const selectDeal = onSelectDeal || setActiveDealId || (() => {});
  const handleLock = onRequestLock || onOpenAccept || (() => {});
  const handleDecline = onRequestDecline || onDecline || (() => {});

  // Resolve current active deal safely
  const resolvedDeal = activeDeal || (activeDealId ? deals.find((d) => d.id === activeDealId) : null);

  // If a deal is active, render the dedicated deal room
  if (resolvedDeal) {
    return (
      <DealRoomActive
        role={role}
        deal={resolvedDeal}
        deals={deals}
        setActiveDealId={selectDeal}
        onSendMessage={onSendMessage}
        onProposeCounter={onProposeCounter}
        onOpenAccept={handleLock}
        onDecline={handleDecline}
        onOpenPayment={onOpenPayment}
        onOpenCatalog={onOpenCatalog}
      />
    );
  }

  // Filter deals for Inbox List View
  const filteredDeals = deals.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      d.product?.name.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      (d.buyerName && d.buyerName.toLowerCase().includes(q)) ||
      (d.sellerName && d.sellerName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    const status = d.termSheet?.status;
    if (statusFilter === "all") return true;
    if (statusFilter === "proposed") return status === "proposed";
    if (statusFilter === "locked") return status === "locked";
    if (statusFilter === "declined") return status === "declined";
    return true;
  });

  return (
    <div className="sellx-rise max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--paper)]">
              Deal Room &amp; Negotiations
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--line)] text-[var(--mist)]">
              {deals.length} active chats
            </span>
          </div>
          <p className="text-sm text-[var(--mist)]">
            Each pre-owned item has its own dedicated negotiation thread, price history, and term sheet.
          </p>
        </div>

        {onOpenCatalog && (
          <button
            onClick={onOpenCatalog}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] text-xs font-semibold hover:bg-[var(--teal-dim)] transition-all shadow-sm shrink-0"
          >
            <span>+ Request New Quote</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--mist)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations by item name, seller, buyer, or deal ID..."
            className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--paper)] outline-none focus:border-[var(--teal)] transition-colors placeholder:text-[var(--mist-dim)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--mist)] hover:text-[var(--paper)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Chats" },
            { id: "proposed", label: "Active Offers" },
            { id: "locked", label: "Locked" },
            { id: "declined", label: "Declined" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-[var(--paper)] text-[var(--ink)] font-semibold shadow-sm"
                  : "bg-[var(--surface)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      {filteredDeals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)]/50 py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--surface2)] border border-[var(--line)] flex items-center justify-center mx-auto mb-3 text-[var(--mist)]">
            <MessageSquare size={20} />
          </div>
          <h3 className="font-display font-semibold text-base text-[var(--paper)]">No conversations found</h3>
          <p className="text-xs text-[var(--mist)] mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No chats matched "${searchQuery}". Try a different search term or clear the filter.`
              : "You don't have any negotiations yet. Browse the catalog to make an offer on any pre-owned item."}
          </p>
          {onOpenCatalog && (
            <button
              onClick={onOpenCatalog}
              className="mt-4 px-4 py-2 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] text-xs font-semibold hover:bg-[var(--teal-dim)] transition-all"
            >
              Browse Catalog
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDeals.map((deal) => {
            const product = deal.product || {};
            const ts = deal.termSheet || {};
            const lastMsg = deal.messages && deal.messages.length > 0 ? deal.messages[deal.messages.length - 1] : null;
            const stage = getStage(deal);
            const isLocked = ts.status === "locked";
            const isDeclined = ts.status === "declined";

            return (
              <div
                key={deal.id}
                onClick={() => selectDeal(deal.id)}
                className="group text-left rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--teal)]/50 hover:shadow-[0_14px_28px_-16px_rgba(50,96,128,0.35)] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top row: thumbnail + category + status badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-[var(--line)] shrink-0 bg-[var(--surface2)]">
                        <ProductImageTile
                          src={product.image}
                          category={product.category}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mist)] font-mono">
                            {product.category || "Item"}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--mist-dim)]">
                            {deal.id}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-sm sm:text-base text-[var(--paper)] truncate group-hover:text-[var(--teal)] transition-colors mt-0.5">
                          {product.name}
                        </h3>
                        <div className="text-xs text-[var(--mist)] flex items-center gap-1.5 mt-0.5">
                          <Building2 size={11} /> {role === "buyer" ? deal.sellerName : deal.buyerName}
                        </div>
                      </div>
                    </div>

                    <Badge
                      tone={
                        isLocked
                          ? "green"
                          : isDeclined
                          ? "red"
                          : ts.status === "proposed"
                          ? "amber"
                          : "neutral"
                      }
                    >
                      {isLocked ? "Locked" : isDeclined ? "Declined" : stage}
                    </Badge>
                  </div>

                  {/* Message Preview */}
                  <div className="p-3 rounded-xl bg-[var(--surface2)]/60 border border-[var(--line)]/60 my-3">
                    <div className="flex items-center justify-between text-[11px] text-[var(--mist)] mb-1">
                      <span className="font-medium flex items-center gap-1">
                        <MessageSquare size={11} className="text-[var(--mist)]" />
                        {lastMsg?.sender === role ? "You" : lastMsg?.sender === "buyer" ? "Buyer" : "Seller"}:
                      </span>
                      <span className="font-mono text-[10px] text-[var(--mist-dim)]">
                        {deal.messages?.length || 0} messages
                      </span>
                    </div>
                    <p className="text-xs text-[var(--paper)] line-clamp-2 leading-relaxed">
                      {lastMsg?.type === "offer"
                        ? `Proposed counter-offer: ${fmtINR(lastMsg.offer?.unitPrice)} (${lastMsg.offer?.leadTimeDays}d lead)`
                        : lastMsg?.text || "Negotiation thread opened."}
                    </p>
                  </div>
                </div>

                {/* Bottom row: Price & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--line)]/50 mt-1">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[var(--mist-dim)] block">
                      Current Offer
                    </span>
                    <span className="font-mono text-lg sm:text-xl font-bold text-[var(--price)] tabular-nums">
                      {fmtINR(ts.unitPrice || product.basePrice)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectDeal(deal.id);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] text-xs font-semibold hover:bg-[var(--teal-dim)] transition-all shadow-sm"
                  >
                    <span>Open Chat</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
