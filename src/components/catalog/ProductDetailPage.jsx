import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  ArrowLeftRight,
  Sparkles,
  ShieldCheck,
  Package,
  Lock,
  Share2,
  Heart,
  Zap,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { CategoryBadge } from "../common/Badge.jsx";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { SimilarProductsSection } from "./SimilarProductsSection.jsx";
import { catColor } from "../../utils/styles.js";
import { fmtINR } from "../../utils/formatters.js";

export function ProductDetailPage({
  product,
  allProducts = [],
  onOpenProduct,
  onBack,
  onRequestQuote,
  onToggleCart,
  inCart,
  cart = [],
}) {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const condition = product.condition || "Mint / Like New";
  const includes = product.includes || [
    "Original Retail Box",
    "Charging Cable / Power Adapter",
    "Purchase Bill / GST Invoice",
  ];

  const highlights = product.highlights && product.highlights.length > 0
    ? product.highlights
    : [
        "100% Tested Working & Fully Functional",
        "Original Battery & All Native Sensors Active",
        "Factory Reset & Free of Any Activation Lock",
      ];

  const imageList = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }
    if (product.image) {
      return [product.image];
    }
    return [];
  }, [product.images, product.image]);

  const angleLabels = [
    "Front Display",
    "Back & Chassis",
    "Sides & Camera Module",
    "Packaging & Accessories",
  ];
  const activeImage = imageList[selectedPhotoIdx] || imageList[0] || product.image;

  // Commercial / Market valuation estimates
  const estMsrp = Math.round(product.basePrice * 1.85);
  const savingsAmount = estMsrp - product.basePrice;
  const savingsPct = Math.round((savingsAmount / estMsrp) * 100);
  const fairMarketLow = Math.round(product.basePrice * 0.92);
  const fairMarketHigh = Math.round(product.basePrice * 1.06);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="sellx-rise max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--line)]/60">
        <div className="flex items-center gap-2 text-xs text-[var(--mist)] font-medium">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--paper)] font-semibold transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft size={14} /> Back to marketplace
          </button>
          <span className="text-[var(--mist-dim)]">/</span>
          <span className="text-[var(--mist)] hover:underline cursor-pointer" onClick={onBack}>
            {product.category}
          </span>
          <span className="text-[var(--mist-dim)]">/</span>
          <span className="text-[var(--paper)] font-semibold truncate max-w-[200px] sm:max-w-[320px]">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-xs font-semibold text-[var(--mist)] hover:text-[var(--paper)] transition-all cursor-pointer"
            title="Share item link"
          >
            <Share2 size={13} />
            <span>{copiedLink ? "Link Copied!" : "Share"}</span>
          </button>

          <button
            onClick={() => onToggleCart(product)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              inCart
                ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                : "border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--mist)] hover:text-[var(--paper)]"
            }`}
            title={inCart ? "Saved to watchlist" : "Save to watchlist"}
          >
            <Heart size={13} className={inCart ? "fill-current text-rose-500" : ""} />
            <span>{inCart ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Main Product Stage: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* ================= LEFT COLUMN: Visual Gallery & Protection ================= */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Hero Product Stage */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--surface)] shadow-md group">
            <div className="relative w-full aspect-[4/3] bg-[var(--surface2)] flex items-center justify-center overflow-hidden">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Floating Top Left Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                <CategoryBadge category={product.category} />
                <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold shadow-md border border-white/20 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>{condition}</span>
                </span>
              </div>

              {/* Floating Top Right Verification Badge */}
              <div className="absolute top-3.5 right-3.5">
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold shadow-md border border-emerald-500/40 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>Verified Device</span>
                </span>
              </div>

              {/* Floating Bottom View Indicator */}
              <div className="absolute bottom-3.5 right-3.5">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-bold shadow-md border border-white/20">
                  Angle {selectedPhotoIdx + 1}/{imageList.length} &middot; {angleLabels[selectedPhotoIdx % angleLabels.length]}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Angle Gallery Thumbnails */}
          {imageList.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {imageList.map((img, idx) => {
                const isSelected = selectedPhotoIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-[var(--surface)] text-left group cursor-pointer ${
                      isSelected
                        ? "border-[var(--teal)] ring-2 ring-[var(--teal)]/30 shadow-md scale-[1.02]"
                        : "border-[var(--line)] hover:border-[var(--teal)]/50 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <span className="block text-[9px] font-bold text-[var(--mist)] group-hover:text-[var(--paper)] text-center py-1 truncate">
                      {angleLabels[idx % angleLabels.length]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* SellX Safe Handover Protection Info Box */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-500 shrink-0">
              <Lock size={18} />
            </div>
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[var(--paper)] block text-sm">
                SellX Safe Handover Protection
              </span>
              <p className="text-[var(--mist)] leading-relaxed">
                When you agree on a price, a private <strong>4-digit Handover Passcode</strong> is issued. Meet safely, inspect the device hands-on, and only release the passcode when 100% satisfied.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Commercial Details & Bargain Deck ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header & Product Vital Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--mist-dim)]">
              <span className="px-2 py-0.5 rounded-md bg-[var(--surface2)] border border-[var(--line)] text-[var(--paper)] font-bold">
                {product.sku}
              </span>
              <span>&middot;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={13} /> Direct Owner Listing
              </span>
              <span>&middot;</span>
              <span className="text-[var(--mist)]">Listed 2d ago</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--paper)] tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Valuation Intelligence Card */}
          <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--mist-dim)] block">
                  Asking Price
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[var(--price)] tracking-tight">
                    {fmtINR(product.basePrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Negotiable
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-[var(--mist-dim)] block">Original New MSRP:</span>
                <div className="flex sm:justify-end items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-sm text-[var(--mist)] line-through">
                    {fmtINR(estMsrp)}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    (Save {savingsPct}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Fair Market Price Range Bar */}
            <div className="pt-3 border-t border-[var(--line-soft)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--mist)] flex items-center gap-1.5">
                  <TrendingDown size={14} className="text-emerald-500" />
                  Estimated Fair Market Value
                </span>
                <span className="font-mono font-bold text-[var(--paper)]">
                  {fmtINR(fairMarketLow)} – {fmtINR(fairMarketHigh)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--surface2)] overflow-hidden relative">
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ left: "20%", width: "60%" }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--mist-dim)] font-mono">
                <span>Below Market</span>
                <span className="text-emerald-500 font-bold">● Institutional Fair Value</span>
                <span>Above Market</span>
              </div>
            </div>
          </div>

          {/* Description / Owner Narrative */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-extrabold text-[var(--mist-dim)] tracking-wider">
              Seller Narrative & Details
            </h3>
            <div className="text-sm text-[var(--paper)] leading-relaxed bg-[var(--surface)] p-4 rounded-2xl border border-[var(--line)]">
              {product.description}
            </div>
          </div>

          {/* Highlights & Inclusions Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2">
              <h4 className="text-xs font-bold text-[var(--paper)] flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>Condition Highlights</span>
              </h4>
              <ul className="space-y-2 text-xs text-[var(--mist)]">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-2">
              <h4 className="text-xs font-bold text-[var(--paper)] flex items-center gap-1.5">
                <Package size={15} className="text-teal-500 shrink-0" />
                <span>Package Includes</span>
              </h4>
              <ul className="space-y-2 text-xs text-[var(--mist)]">
                {includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={13} className="text-teal-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs: Make an Offer / Buy Direct */}
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/80 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <PrimaryButton
                icon={ArrowLeftRight}
                tone="teal"
                onClick={() => onRequestQuote(product)}
                className="w-full sm:flex-1 py-3.5 text-sm font-extrabold shadow-md shadow-teal-500/20 active:scale-98 cursor-pointer"
              >
                Make an Offer / Bargain
              </PrimaryButton>

              <button
                type="button"
                onClick={() => onRequestQuote(product, product.basePrice)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface3)] border border-[var(--line)] text-[var(--paper)] text-sm font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
                title="Instant Buy at Asking Price"
              >
                <Zap size={16} className="text-amber-500" />
                <span>Buy at {fmtINR(product.basePrice)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Semantic Similar Products Section */}
      <SimilarProductsSection
        targetProduct={product}
        allProducts={allProducts}
        onSelectProduct={(p) => {
          setSelectedPhotoIdx(0);
          if (onOpenProduct) onOpenProduct(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onToggleCart={onToggleCart}
        cart={cart}
        onRequestQuote={onRequestQuote}
      />
    </div>
  );
}


