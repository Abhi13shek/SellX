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
  ChevronDown,
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
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeCities, setActiveCities] = useState([]);
  const [activeConditions, setActiveConditions] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openSubfilter, setOpenSubfilter] = useState(null);
  const [citySearch, setCitySearch] = useState("");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const categoryCards = useMemo(
    () => categories.filter((category) => category !== "All").map((category) => ({
      category,
      product: products.find((product) => product.category === category),
    })),
    [categories, products]
  );

  const cartIds = useMemo(() => {
    if (propCartIds) return propCartIds;
    return new Set(cartItems.map((c) => c.id));
  }, [cartItems, propCartIds]);

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (activeCategories.length > 0) {
      list = list.filter((p) => activeCategories.includes(p.category));
    }

    if (activeCities.length > 0) {
      list = list.filter((p) => activeCities.some((city) => (p.city || "").toLowerCase() === city.toLowerCase()));
    }

    if (activeConditions.length > 0) {
      list = list.filter((p) => activeConditions.some((condition) => (p.condition || "").toLowerCase().includes(condition.toLowerCase())));
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
  }, [products, activeCategories, activeCities, activeConditions, search, sortBy]);

  const hasActiveFilters = Boolean(
    search.trim() || activeCategories.length > 0 || activeCities.length > 0 || activeConditions.length > 0 || sortBy !== "default"
  );

  const clearFilters = () => {
    setSearch("");
    setActiveCategories([]);
    setActiveCities([]);
    setActiveConditions([]);
    setSortBy("default");
  };
  const activeFilterLabels = [
    ...activeCities,
    ...activeCategories,
    ...activeConditions,
    sortBy !== "default" ? SORT_OPTIONS.find((option) => option.id === sortBy)?.label : null,
    search.trim() ? `“${search.trim()}”` : null,
  ].filter(Boolean);
  const selectedFilterCount = activeCities.length + activeCategories.length + activeConditions.length + (sortBy !== "default" ? 1 : 0);
  const toggleSelection = (setSelection, option, allOption) => {
    if (option === allOption) {
      setSelection([]);
      return;
    }
    setSelection((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  };
  const filterSections = [
    { id: "city", label: "Location", value: activeCities, options: CITIES, onSelect: (option) => toggleSelection(setActiveCities, option, "All India"), isSelected: (option) => option === "All India" ? activeCities.length === 0 : activeCities.includes(option), icon: MapPin, iconClass: "text-rose-500", multiple: true, display: (values) => values.length ? `${values.length} location${values.length === 1 ? "" : "s"} selected` : "All India" },
    { id: "category", label: "Category", value: activeCategories, options: categories, onSelect: (option) => toggleSelection(setActiveCategories, option, "All"), isSelected: (option) => option === "All" ? activeCategories.length === 0 : activeCategories.includes(option), icon: Tag, iconClass: "text-[var(--teal)]", multiple: true, display: (values) => values.length ? `${values.length} categor${values.length === 1 ? "y" : "ies"} selected` : "All categories" },
    { id: "condition", label: "Condition", value: activeConditions, options: CONDITIONS, onSelect: (option) => toggleSelection(setActiveConditions, option, "All"), isSelected: (option) => option === "All" ? activeConditions.length === 0 : activeConditions.includes(option), icon: ShieldCheck, iconClass: "text-amber-500", multiple: true, display: (values) => values.length ? `${values.length} condition${values.length === 1 ? "" : "s"} selected` : "All conditions" },
    { id: "sort", label: "Sort by", value: sortBy, options: SORT_OPTIONS.map((option) => option.id), onSelect: setSortBy, icon: SlidersHorizontal, iconClass: "text-[var(--mist)]", display: (value) => SORT_OPTIONS.find((option) => option.id === value)?.label || "Recommended" },
  ];

  return (
    <div className="space-y-4 sellx-rise">
      {/* Compact search followed immediately by every filter. */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex w-full items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 shadow-sm transition-colors focus-within:border-[var(--teal)] xl:flex-1">
          <Search size={16} className="text-[var(--mist)] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full bg-transparent px-2.5 py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
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

        <div className="relative xl:w-48 xl:shrink-0">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className={`flex w-full items-center justify-between rounded-xl border bg-[var(--surface)] px-3 py-2.5 text-sm font-semibold text-[var(--paper)] shadow-sm transition-all hover:bg-[var(--surface2)] ${filtersOpen ? "border-[var(--teal)] ring-2 ring-[var(--teal)]/10" : "border-[var(--line)] hover:border-[var(--teal)]/50"}`}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-[var(--teal)]" />
              Filters
              {selectedFilterCount > 0 && <span className="rounded-full bg-[var(--teal)]/12 px-1.5 py-0.5 text-[10px] font-mono text-[var(--teal)]">{selectedFilterCount}</span>}
            </span>
            <ChevronDown size={16} className={`text-[var(--mist)] transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
          </button>

          {filtersOpen && (
            <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl shadow-black/10 sellx-rise xl:left-auto xl:w-[360px]">
              <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface2)]/45 px-4 py-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--paper)]">Filter listings</span>
                  <p className="mt-0.5 text-[11px] text-[var(--mist)]">Choose one filter to refine your results.</p>
                </div>
                {selectedFilterCount > 0 && (
                  <button type="button" onClick={clearFilters} className="shrink-0 rounded-lg border border-[var(--teal)]/25 bg-[var(--teal)]/8 px-2 py-1 text-[11px] font-semibold text-[var(--teal)] transition-colors hover:bg-[var(--teal)]/15">Reset</button>
                )}
              </div>
              <div className="space-y-2 p-3">
                {filterSections.map(({ id, label, value, options, onSelect, isSelected, multiple, icon: Icon, iconClass, display }) => {
                  const isOpen = openSubfilter === id;
                  const currentLabel = display ? display(value) : value;
                  const visibleOptions = id === "city"
                    ? options.filter((option) => option.toLowerCase().includes(citySearch.trim().toLowerCase()))
                    : options;
                  return (
                    <div key={id} className={`overflow-hidden rounded-xl border transition-colors ${isOpen ? "border-[var(--teal)]/45 bg-[var(--teal)]/5" : "border-[var(--line)] bg-[var(--surface2)]/35 hover:border-[var(--teal)]/25"}`}>
                      <button
                        type="button"
                        onClick={() => setOpenSubfilter(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-xs font-semibold text-[var(--paper)]"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--line)] ${iconClass}`}><Icon size={14} /></span>
                          <span className="min-w-0">
                            <span className="block">{label}</span>
                            <span className="mt-0.5 block truncate text-[10px] font-normal text-[var(--mist)]">{currentLabel}</span>
                          </span>
                        </span>
                        <ChevronDown size={14} className={`shrink-0 text-[var(--mist)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="border-t border-[var(--teal)]/15 bg-[var(--surface)]/65 p-2.5">
                          {id === "city" && (
                            <div className="mb-2 flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-2 focus-within:border-[var(--teal)]">
                              <Search size={13} className="shrink-0 text-[var(--mist)]" />
                              <input
                                value={citySearch}
                                onChange={(event) => setCitySearch(event.target.value)}
                                placeholder="Search a city..."
                                className="min-w-0 flex-1 bg-transparent text-[11px] text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                              />
                            </div>
                          )}
                          <div className={`grid grid-cols-2 gap-1.5 sm:grid-cols-3 ${id === "city" ? "max-h-44 overflow-y-auto pr-1" : ""}`}>
                          {visibleOptions.map((option) => {
                            const optionLabel = multiple ? option : display ? display(option) : option;
                            const selected = isSelected ? isSelected(option) : option === value;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => { onSelect(option); if (!multiple) setOpenSubfilter(null); }}
                                className={`flex min-h-8 items-center gap-1 rounded-lg border px-2 py-1.5 text-left text-[11px] transition-all ${selected ? "border-[var(--teal)] bg-[var(--teal)] text-[var(--on-teal)] font-semibold shadow-sm" : "border-transparent text-[var(--mist)] hover:border-[var(--line)] hover:bg-[var(--surface2)] hover:text-[var(--paper)]"}`}
                              >
                                {selected && <Check size={11} className="shrink-0" />}
                                {optionLabel}
                              </button>
                            );
                          })}
                          {visibleOptions.length === 0 && <p className="col-span-full px-1 py-3 text-center text-[11px] text-[var(--mist)]">No cities found.</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <section aria-label="Marketplace assurances" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface)]/85 px-4 py-2.5 text-[11px] font-semibold text-[var(--mist)] shadow-sm">
        <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[var(--teal)]" /> Verified local listings</span>
        <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
        <span className="inline-flex items-center gap-1.5"><ArrowLeftRight size={14} className="text-[var(--teal)]" /> Direct bargaining</span>
        <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
        <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--teal)]" /> Secure OTP handover</span>
      </section>

      <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--paper)]">Explore categories</h2>
            <p className="mt-0.5 text-[11px] text-[var(--mist)]">Verified pre-owned finds, ready to bargain.</p>
          </div>
          {activeCategories.length > 0 && <button type="button" onClick={() => setActiveCategories([])} className="text-[11px] font-semibold text-[var(--teal)] hover:underline">View all</button>}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategories([])}
            className={`flex min-w-[92px] flex-col items-center gap-1.5 rounded-xl border px-2 py-2 text-center text-[11px] font-semibold transition-all ${activeCategories.length === 0 ? "border-[var(--teal)] bg-[var(--teal)] text-[var(--on-teal)] shadow-sm" : "border-[var(--line)] bg-[var(--surface2)]/45 text-[var(--mist)] hover:border-[var(--teal)]/35 hover:text-[var(--paper)]"}`}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeCategories.length === 0 ? "bg-white/15" : "bg-[var(--teal)]/10 text-[var(--teal)]"}`}><Sparkles size={18} /></span>
            For you
          </button>
          {categoryCards.map(({ category, product }) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleSelection(setActiveCategories, category, "All")}
              className={`flex min-w-[92px] flex-col items-center gap-1.5 rounded-xl border px-2 py-2 text-center text-[11px] font-semibold transition-all ${activeCategories.includes(category) ? "border-[var(--teal)] bg-[var(--teal)]/10 text-[var(--teal)] shadow-sm" : "border-[var(--line)] bg-[var(--surface2)]/45 text-[var(--mist)] hover:border-[var(--teal)]/35 hover:text-[var(--paper)]"}`}
            >
              <span className="h-10 w-10 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <ProductImageTile image={product?.image} category={category} alt={category} className="h-full w-full object-cover" />
              </span>
              <span className="max-w-[82px] truncate">{category}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Listings Count Bar */}
      <div className="flex items-center justify-between text-xs text-[var(--mist)] pt-1 px-1">
        <span>
          Showing <b className="text-[var(--paper)]">{visibleProducts.length}</b> pre-owned listings in{" "}
          <span className="text-[var(--teal)] font-semibold">{activeCities.length === 0 ? "All India" : activeCities.length === 1 ? activeCities[0] : `${activeCities.length} selected locations`}</span>
        </span>
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="text-[11px] text-[var(--teal)] font-semibold hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {activeFilterLabels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-[11px]">
          <span className="font-semibold text-[var(--mist-dim)]">Active:</span>
          {activeFilterLabels.map((label) => (
            <span key={label} className="rounded-full border border-[var(--teal)]/25 bg-[var(--teal)]/8 px-2 py-0.5 font-medium text-[var(--teal)]">{label}</span>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {visibleProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] py-16 text-center text-sm text-[var(--mist)] bg-[var(--surface)]/50">
          <p className="text-base font-semibold text-[var(--paper)]">No listings match your search or location</p>
          <p className="text-xs text-[var(--mist-dim)] mt-1">Try resetting your city or category filters</p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategories([]);
              setActiveCities([]);
              setActiveConditions([]);
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
