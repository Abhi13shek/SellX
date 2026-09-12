import React, { useMemo } from "react";
import { Sparkles, ArrowRight, TrendingDown, TrendingUp, MapPin, ShieldCheck } from "lucide-react";
import { fmtINR } from "../../utils/formatters.js";
import { findSimilarProducts } from "../../utils/semanticSimilarity.js";

export function SimilarProductsSection({ targetProduct, allProducts, onSelectProduct }) {
  const similarItems = useMemo(() => {
    return findSimilarProducts(targetProduct, allProducts, 3);
  }, [targetProduct, allProducts]);

  if (!similarItems || similarItems.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-[var(--line)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-[#0474C4] flex items-center justify-center text-white shadow-sm">
              <Sparkles size={15} />
            </div>
            <h3 className="text-base font-bold text-[var(--paper)] tracking-tight">
              Similar Pre-Owned Listings You Might Like
            </h3>
          </div>
          <p className="text-xs text-[var(--mist)] mt-1">
            Real-time semantic vector recommendations powered by <span className="font-mono text-[#0474C4] dark:text-sky-400 font-semibold">all-MiniLM-L6-v2</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            AI Embeddings Active
          </span>
        </div>
      </div>

      {/* Similar Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {similarItems.map(({ product, matchPercent, priceBadge }) => {
          const displayImage = (product.images && product.images[0]) || product.image;
          const locStr = product.locality ? `${product.locality}, ${product.city}` : product.city || "Bangalore";
          const distStr = product.distanceKm ? `${product.distanceKm} km` : "2.5 km";

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group relative flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--teal)]/60 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
            >
              {/* Image Preview Container */}
              <div className="relative h-40 w-full overflow-hidden bg-[var(--surface2)]">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Match Percentage Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-sm flex items-center gap-1">
                  <Sparkles size={10} className="text-emerald-400" />
                  <span>{matchPercent}% Match</span>
                </div>

                {/* Condition Tag */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[var(--paper)] border border-black/10 shadow-xs">
                  {product.condition || "Gently Used"}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Category & Locality */}
                  <div className="flex items-center justify-between text-[11px] text-[var(--mist)] mb-1">
                    <span className="font-semibold text-[var(--teal)]">{product.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-rose-500 shrink-0" />
                      <span className="truncate max-w-[110px]">{locStr}</span>
                    </span>
                  </div>

                  {/* Product Title */}
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--paper)] group-hover:text-[var(--teal)] transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h4>
                </div>

                {/* Price & Alternative Badge */}
                <div className="pt-2 border-t border-[var(--line-soft)]">
                  {priceBadge && priceBadge.diff !== 0 && (
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold mb-2 ${
                        priceBadge.type === "cheaper"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25"
                      }`}
                    >
                      {priceBadge.type === "cheaper" ? (
                        <TrendingDown size={11} className="shrink-0" />
                      ) : (
                        <TrendingUp size={11} className="shrink-0" />
                      )}
                      <span>{priceBadge.text}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[var(--mist-dim)]">Asking Price</div>
                      <div className="text-sm font-extrabold text-[var(--paper)] font-mono">
                        {fmtINR(product.basePrice)}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--surface2)] group-hover:bg-[var(--teal)] group-hover:text-white text-[var(--paper)] text-xs font-bold transition-all shadow-xs"
                    >
                      <span>View</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
