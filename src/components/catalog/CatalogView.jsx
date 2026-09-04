import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Check,
  ArrowLeftRight,
  X,
} from "lucide-react";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { CategoryBadge, Badge } from "../common/Badge.jsx";
import { SORT_OPTIONS } from "../../data/constants.js";
import { fmtINR } from "../../utils/formatters.js";
import { catColor } from "../../utils/styles.js";

export function CatalogView({
  products,
  onOpenProduct,
  onRequestQuote,
  onToggleCart,
  cartItems = [],
  cartIds: propCartIds,
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const cartIds = useMemo(() => {
    if (propCartIds) return propCartIds;
    return new Set(cartItems.map((c) => c.id));
  }, [cartItems, propCartIds]);

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.supplier && p.supplier.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.basePrice - b.basePrice);
    if (sortBy === "price-desc") list.sort((a, b) => b.basePrice - a.basePrice);
    if (sortBy === "lead-asc") list.sort((a, b) => a.leadTimeDays - b.leadTimeDays);

    return list;
  }, [products, activeCategory, search, sortBy]);

  return (
    <div className="space-y-4 sellx-rise">
      {/* Top Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3.5 shadow-sm focus-within:border-[var(--teal)] transition-colors">
          <Search size={16} className="text-[var(--mist)] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phones, laptops, bikes, cameras..."
            className="w-full bg-transparent py-2.5 px-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[var(--mist)] hover:text-[var(--paper)] p-1 rounded-md"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-xs font-medium text-[var(--mist)] shadow-sm">
            <SlidersHorizontal size={14} className="text-[var(--mist)] shrink-0" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[var(--paper)] outline-none cursor-pointer font-semibold"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[var(--surface)] text-[var(--paper)]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-[var(--teal)] text-[var(--on-teal)] border-[var(--teal)] shadow-sm"
                  : "bg-[var(--surface)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {visibleProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] py-20 text-center text-sm text-[var(--mist)] bg-[var(--surface)]/50">
          <p className="text-base font-semibold text-[var(--paper)]">No items found</p>
          <p className="text-xs text-[var(--mist-dim)] mt-1">Try adjusting your search or category filter</p>
          {(search || activeCategory !== "All" || sortBy !== "default") && (
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
                setSortBy("default");
              }}
              className="mt-3 text-xs font-semibold text-[var(--teal)] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleProducts.map((p) => {
            const inCart = cartIds.has(p.id);

            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenProduct(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onOpenProduct(p);
                }}
                className="group rounded-2xl border bg-[var(--surface)] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 cursor-pointer border-[var(--line)] hover:border-[var(--teal)]/40 hover:shadow-lg"
              >
                <div className="relative">
                  <ProductImageTile category={p.category} Icon={p.icon} image={p.image} size="lg" />
                  <div className="absolute top-2.5 left-2.5">
                    <CategoryBadge category={p.category} />
                  </div>
                  {p.sellerAdded && (
                    <div className="absolute top-2.5 right-2.5">
                      <Badge tone="green">New</Badge>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCart(p);
                    }}
                    aria-label={inCart ? "Remove from cart" : "Add to cart"}
                    className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors ${
                      inCart
                        ? "bg-[var(--teal)] text-[var(--on-teal)] border-transparent"
                        : "bg-[var(--surface)]/90 text-[var(--paper)] border-[var(--line)] hover:bg-[var(--surface3)]"
                    }`}
                  >
                    {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
                  </button>
                </div>

                <div className="p-3.5 flex flex-col flex-1">
                  <h3 className="font-display text-sm font-semibold text-[var(--paper)] leading-snug line-clamp-2 group-hover:text-[var(--teal)] transition-colors">
                    {p.name}
                  </h3>

                  <div className="text-[11px] text-[var(--mist-dim)] mt-1 truncate">
                    {p.supplier}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-[var(--line-soft)]">
                    <span className="font-mono text-base font-bold text-[var(--price)] tabular-nums">
                      {fmtINR(p.basePrice)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestQuote(p);
                      }}
                      className="text-xs font-semibold text-[var(--teal)] hover:underline flex items-center gap-1 shrink-0"
                    >
                      <ArrowLeftRight size={11} /> Negotiate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
