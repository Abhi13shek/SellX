import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Check,
  ShoppingCart,
  Tag,
  Zap,
  Compass,
  ArrowUpRight,
  SlidersHorizontal,
  Flame,
} from "lucide-react";
import { fmtINR } from "../../utils/formatters.js";
import { findSimilarProducts } from "../../utils/semanticSimilarity.js";
import { catColor } from "../../utils/styles.js";

export function SimilarProductsSection({
  targetProduct,
  allProducts,
  onSelectProduct,
  onToggleCart,
  cart = [],
  onRequestQuote,
}) {
  const [filterTab, setFilterTab] = useState("all"); // "all" | "cheaper" | "nearby"

  // Compute semantic matches
  const allSimilarItems = useMemo(() => {
    return findSimilarProducts(targetProduct, allProducts, 6);
  }, [targetProduct, allProducts]);

  // Derived filtered items
  const cheaperItems = useMemo(() => {
    return allSimilarItems.filter((item) => item.product.basePrice < targetProduct.basePrice);
  }, [allSimilarItems, targetProduct]);

  const nearbyItems = useMemo(() => {
    return allSimilarItems.filter((item) => (item.product.distanceKm || 2.5) <= 5);
  }, [allSimilarItems]);

  const activeList = useMemo(() => {
    if (filterTab === "cheaper") return cheaperItems.length > 0 ? cheaperItems : allSimilarItems;
    if (filterTab === "nearby") return nearbyItems.length > 0 ? nearbyItems : allSimilarItems;
    return allSimilarItems;
  }, [filterTab, allSimilarItems, cheaperItems, nearbyItems]);

  if (!allSimilarItems || allSimilarItems.length === 0) return null;

  return (
    <section className="mt-12 pt-10 border-t border-[var(--line)]">
      {/* Top Banner / AI Header Card */}
      <div className="relative rounded-2xl p-5 md:p-6 overflow-hidden border border-[var(--line)] bg-[var(--surface)] shadow-md mb-6 transition-all">
        {/* Ambient background glow */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-15 pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(circle, var(--teal), transparent 70%)" }}
        />
        <div
          className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full opacity-10 pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(circle, var(--brass), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[var(--paper)] tracking-tight">
                  Suggested Alternatives & Similar Deals
                </h3>
                <p className="text-xs text-[var(--mist)] mt-0.5">
                  AI vector similarity matched with <span className="font-semibold text-[var(--paper)] truncate inline-block max-w-[220px] align-bottom">"{targetProduct.name}"</span>
                </p>
              </div>
            </div>
          </div>

          {/* AI Status & MiniLM Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Semantic Neural Vector Rank</span>
            </div>
          </div>
        </div>

        {/* Interactive Filter Pills */}
        <div className="relative z-10 flex items-center gap-2 mt-5 pt-4 border-t border-[var(--line-soft)] overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none shrink-0 ${
              filterTab === "all"
                ? "bg-[var(--teal)] text-[var(--on-teal)] shadow-sm scale-[1.02]"
                : "bg-[var(--surface2)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)]"
            }`}
          >
            <Flame size={13} />
            <span>Top AI Matches ({allSimilarItems.length})</span>
          </button>

          {cheaperItems.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab("cheaper")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none shrink-0 ${
                filterTab === "cheaper"
                  ? "bg-[var(--teal)] text-[var(--on-teal)] shadow-sm scale-[1.02]"
                  : "bg-[var(--surface2)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)]"
              }`}
            >
              <TrendingDown size={13} className="text-emerald-400" />
              <span>Budget Alternatives ({cheaperItems.length})</span>
            </button>
          )}

          {nearbyItems.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterTab("nearby")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none shrink-0 ${
                filterTab === "nearby"
                  ? "bg-[var(--teal)] text-[var(--on-teal)] shadow-sm scale-[1.02]"
                  : "bg-[var(--surface2)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)]"
              }`}
            >
              <MapPin size={13} className="text-amber-400" />
              <span>Nearby Sellers ({nearbyItems.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Suggested Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeList.map(({ product, matchPercent, priceBadge }) => {
          const displayImage = (product.images && product.images[0]) || product.image;
          const locStr = product.locality ? `${product.locality}, ${product.city || "Bangalore"}` : product.city || "Bangalore";
          const distStr = product.distanceKm ? `${product.distanceKm} km` : "2.4 km";
          const isCurrentInCart = cart && cart.some ? cart.some((item) => item.id === product.id) : false;
          const categoryCol = catColor(product.category);

          const priceDiff = product.basePrice - targetProduct.basePrice;
          const isCheaper = priceDiff < 0;
          const isMoreExpensive = priceDiff > 0;
          const diffAbsFormatted = fmtINR(Math.abs(priceDiff));

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group relative flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--teal)]/70 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.22)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Top gradient highlight strip on card hover */}
              <div
                className="h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, var(--teal), var(--brass))` }}
              />

              {/* Product Image Stage */}
              <div className="relative h-48 w-full overflow-hidden bg-[var(--surface2)] select-none">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />

                {/* Ambient vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Match percentage badge (Top Left) */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-black/75 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{matchPercent}% Match</span>
                </div>

                {/* Condition badge (Top Right) */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-md">
                  {product.condition || "Like New"}
                </div>

                {/* Bottom Overlay: Location & Distance info */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                  <div className="flex items-center gap-1 truncate max-w-[170px] drop-shadow-sm">
                    <MapPin size={12} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{locStr}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md font-mono font-bold shrink-0">
                    {distStr}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Category & Verified Seller Trust */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--surface2)] border border-[var(--line)]"
                      style={{ color: categoryCol }}
                    >
                      {product.category}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck size={13} className="shrink-0" />
                      <span>Verified (4.9★)</span>
                    </span>
                  </div>

                  {/* Product Title */}
                  <h4 className="text-sm sm:text-base font-bold text-[var(--paper)] group-hover:text-[var(--teal)] transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h4>

                  {/* Highlight Feature snippet */}
                  {product.highlights && product.highlights.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface2)] border border-[var(--line-soft)] text-xs text-[var(--mist)] truncate max-w-full">
                      <Tag size={11} className="text-[var(--brass)] shrink-0" />
                      <span className="truncate font-medium">{product.highlights[0]}</span>
                    </div>
                  )}
                </div>

                {/* Comparison Insight Callout Banner */}
                <div>
                  {priceDiff !== 0 ? (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                        isCheaper
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shadow-xs"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs"
                      }`}
                    >
                      {isCheaper ? (
                        <>
                          <TrendingDown size={14} className="shrink-0 text-emerald-500" />
                          <span>Save {diffAbsFormatted} vs this item</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp size={14} className="shrink-0 text-amber-500" />
                          <span>+{diffAbsFormatted} Premium Upgrade</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                      <Zap size={14} className="shrink-0 text-blue-500" />
                      <span>Equal Price Alternative</span>
                    </div>
                  )}
                </div>

                {/* Price & Action Section */}
                <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[var(--mist)] font-medium block uppercase tracking-wider">
                      Asking Price
                    </span>
                    <div className="text-base sm:text-lg font-extrabold text-[var(--paper)] font-mono tracking-tight">
                      {fmtINR(product.basePrice)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onToggleCart && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCart(product);
                        }}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                          isCurrentInCart
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                            : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--teal)]"
                        }`}
                        title={isCurrentInCart ? "Remove from saved" : "Save item"}
                      >
                        {isCurrentInCart ? <Check size={15} /> : <ShoppingCart size={15} />}
                      </button>
                    )}

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface2)] group-hover:bg-[var(--teal)] group-hover:text-white text-[var(--paper)] text-xs font-bold transition-all shadow-xs"
                    >
                      <span>View Deal</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
