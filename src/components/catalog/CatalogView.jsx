import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Check,
  ArrowLeftRight,
  X,
  MapPin,
  Sparkles,
  ShieldCheck,
  Tag,
  Clock,
} from "lucide-react";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { CategoryBadge, Badge } from "../common/Badge.jsx";
import { ScrollRevealCard } from "../common/ScrollRevealCard.jsx";
import { SORT_OPTIONS, CITIES, CONDITIONS } from "../../data/constants.js";
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
  const [activeCity, setActiveCity] = useState("All India");
  const [activeCondition, setActiveCondition] = useState("All");
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

    if (activeCity !== "All India") {
      list = list.filter((p) => (p.city || "").toLowerCase() === activeCity.toLowerCase());
    }

    if (activeCondition !== "All") {
      list = list.filter((p) => (p.condition || "").toLowerCase().includes(activeCondition.toLowerCase()));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.supplier && p.supplier.toLowerCase().includes(q)) ||
          (p.locality && p.locality.toLowerCase().includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q)) ||
          (p.condition && p.condition.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.basePrice - b.basePrice);
    if (sortBy === "price-desc") list.sort((a, b) => b.basePrice - a.basePrice);
    if (sortBy === "distance-asc") list.sort((a, b) => (a.distanceKm || 5) - (b.distanceKm || 5));
    if (sortBy === "lead-asc") list.sort((a, b) => a.leadTimeDays - b.leadTimeDays);

    return list;
  }, [products, activeCategory, activeCity, activeCondition, search, sortBy]);

  return (
    <div className="space-y-4 sellx-rise">
      {/* Top Search & Location Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="flex-1 flex items-center bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3.5 shadow-sm focus-within:border-[var(--teal)] transition-colors">
          <Search size={16} className="text-[var(--mist)] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phones, laptops, bikes, cameras, localities..."
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

        {/* City Filter Pills Dropdown */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-xs font-medium text-[var(--mist)] shadow-sm">
          <MapPin size={14} className="text-rose-500 shrink-0" />
          <span className="hidden sm:inline">City:</span>
          <select
            value={activeCity}
            onChange={(e) => setActiveCity(e.target.value)}
            className="bg-transparent text-[var(--paper)] outline-none cursor-pointer font-semibold"
          >
            {CITIES.map((c) => (
              <option key={c} value={c} className="bg-[var(--surface)] text-[var(--paper)]">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-xs font-medium text-[var(--mist)] shadow-sm shrink-0">
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

      {/* Category & Condition Filter Row */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Categories */}
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

        {/* Condition Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-[11px] font-semibold text-[var(--mist-dim)] uppercase tracking-wider mr-1">
            Condition:
          </span>
          {CONDITIONS.map((cond) => {
            const isSelected = activeCondition === cond;
            return (
              <button
                key={cond}
                onClick={() => setActiveCondition(cond)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? "bg-amber-500/15 text-amber-500 border border-amber-500/40 font-bold"
                    : "bg-[var(--surface2)] text-[var(--mist)] hover:text-[var(--paper)] border border-transparent"
                }`}
              >
                {cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Count Bar */}
      <div className="flex items-center justify-between text-xs text-[var(--mist)] pt-1 px-1">
        <span>
          Showing <b className="text-[var(--paper)]">{visibleProducts.length}</b> pre-owned listings in{" "}
          <span className="text-[var(--teal)] font-semibold">{activeCity}</span>
        </span>
        {activeCondition !== "All" && (
          <span className="text-[11px] text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">
            Filtered: {activeCondition}
          </span>
        )}
      </div>

      {/* Product Grid */}
      {visibleProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] py-16 text-center text-sm text-[var(--mist)] bg-[var(--surface)]/50">
          <p className="text-base font-semibold text-[var(--paper)]">No listings match your search or location</p>
          <p className="text-xs text-[var(--mist-dim)] mt-1">Try resetting your city or category filters</p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
              setActiveCity("All India");
              setActiveCondition("All");
              setSortBy("default");
            }}
            className="mt-3.5 px-4 py-2 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] text-xs font-semibold hover:brightness-110"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleProducts.map((p, idx) => {
            const inCart = cartIds.has(p.id);

            return (
              <ScrollRevealCard key={p.id} index={idx} className="h-full">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenProduct(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onOpenProduct(p);
                  }}
                  className="group rounded-2xl border bg-[var(--surface)] overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1.5 cursor-pointer border-[var(--line)] hover:border-[var(--teal)]/50 hover:shadow-xl hover:shadow-[var(--teal)]/5"
                >
                  {/* Clean Cover Photo */}
                  <div className="relative overflow-hidden bg-[var(--surface2)]">
                    <ProductImageTile
                      images={p.images}
                      image={p.image}
                      category={p.category}
                      Icon={p.icon}
                      alt={p.name}
                      showControls={false}
                      className="w-full h-48 object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  </div>

                  {/* Clean Body Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="mb-2">
                        <CategoryBadge category={p.category} size="xs" />
                      </div>

                      <h3 className="font-display text-sm font-semibold text-[var(--paper)] leading-snug line-clamp-2 group-hover:text-[var(--teal)] transition-colors">
                        {p.name}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--line-soft)] flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[var(--mist-dim)] block tracking-wider">Asking Price</span>
                        <span className="font-mono text-base font-extrabold text-[var(--price)] tabular-nums">
                          {fmtINR(p.basePrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestQuote(p);
                          }}
                          className="py-1.5 px-3 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] text-xs font-bold hover:brightness-110 flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <ArrowLeftRight size={11} /> Bargain
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCart(p);
                          }}
                          aria-label={inCart ? "Remove from saved" : "Save item"}
                          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                            inCart
                              ? "bg-[var(--green)]/15 border-[var(--green)] text-[var(--green)]"
                              : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                          }`}
                        >
                          {inCart ? <Check size={13} /> : <ShoppingCart size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollRevealCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
