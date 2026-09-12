import React from "react";
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  ArrowLeftRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  Package,
  FileCheck,
  Lock,
  Clock,
  Send,
} from "lucide-react";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { CategoryBadge } from "../common/Badge.jsx";
import { MiniStat } from "../common/MiniStat.jsx";
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
}) {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = React.useState(0);
  if (!product) return null;
  const c = catColor(product.category);

  const condition = product.condition || "Like New";
  const locationStr = product.locality ? `${product.locality}, ${product.city || "Bangalore"}` : product.supplier;
  const distance = product.distanceKm ? `${product.distanceKm} km` : "2.4 km";
  const sellerTrust = product.sellerTrust || {
    rating: 4.9,
    reviewsCount: 16,
    verified: true,
    memberSince: "2023",
  };
  const includes = product.includes || ["Original Box", "Original Charger / Accessories", "Purchase Bill / Invoice"];

  const imageList = React.useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }
    if (product.image) {
      return [product.image];
    }
    return [];
  }, [product.images, product.image]);

  const angleLabels = ["Front View", "Back & Body", "Side & Ports", "Accessories Included"];
  const activeImage = imageList[selectedPhotoIdx] || imageList[0] || product.image;

  return (
    <div className="sellx-rise max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--mist)] hover:text-[var(--paper)] mb-5 transition-colors"
      >
        <ArrowLeft size={15} /> Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left: Image & Multi-Angle Thumbnails */}
        <div className="lg:col-span-5 h-max space-y-3">
          {/* Main Photo Viewer */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--surface2)] shadow-sm">
            <img
              src={activeImage}
              alt={`Angle ${selectedPhotoIdx + 1}`}
              className="w-full h-80 object-cover transition-all duration-300"
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <CategoryBadge category={product.category} />
              <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-bold shadow-md border border-white/20 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400" />
                {condition}
              </span>
            </div>

            {/* Bottom active angle label */}
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold shadow-md border border-white/20">
                Angle {selectedPhotoIdx + 1}/{imageList.length} &middot; {angleLabels[selectedPhotoIdx % angleLabels.length]}
              </span>
            </div>
          </div>

          {/* 3-Angle Thumbnail Selector */}
          {imageList.length > 1 && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              {imageList.map((img, idx) => {
                const isSelected = selectedPhotoIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-[var(--surface)] text-left group ${
                      isSelected
                        ? "border-[var(--teal)] ring-2 ring-[var(--teal)]/30 shadow-md scale-[1.02]"
                        : "border-[var(--line)] hover:border-[var(--teal)]/50 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle thumbnail ${idx + 1}`}
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <span className="block text-[9px] font-semibold text-[var(--mist)] group-hover:text-[var(--paper)] text-center py-1 truncate">
                      {angleLabels[idx % angleLabels.length]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Seller Trust Profile Card */}
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[var(--teal)]/15 border border-[var(--teal)]/30 flex items-center justify-center font-bold text-sm text-[var(--teal)]">
                  {(product.supplier || "S")[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm font-bold text-[var(--paper)]">
                    <span>{product.supplier || "Verified Seller"}</span>
                    <ShieldCheck size={14} className="text-emerald-500" title="Verified Owner" />
                  </div>
                  <div className="text-[11px] text-[var(--mist-dim)]">Member since {sellerTrust.memberSince || "2023"}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  100% Response Rate
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--line-soft)] flex items-center justify-between text-xs text-[var(--mist)]">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-rose-500 shrink-0" />
                <span>{locationStr}</span>
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {distance} away
              </span>
            </div>
          </div>
        </div>

        {/* Right: Details & Bargaining Actions */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--mist-dim)]">
              <span>{product.sku}</span>
              <span>&middot;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> Direct Owner Listing
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mt-1.5 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Bargain tag */}
          <div className="flex items-baseline justify-between p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
            <div>
              <span className="text-xs uppercase font-bold text-[var(--mist-dim)] block">Asking Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-mono text-3xl font-bold tabular-nums text-[var(--price)]">
                  {fmtINR(product.basePrice)}
                </span>
                <span className="text-xs text-[var(--mist)]">(Negotiable)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles size={11} /> Open to Counter-Offers
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs uppercase font-bold text-[var(--mist-dim)] tracking-wider mb-2">Item Description</h3>
            <p className="text-sm text-[var(--paper)] leading-relaxed bg-[var(--surface2)]/50 p-3.5 rounded-xl border border-[var(--line)]">
              {product.description}
            </p>
          </div>

          {/* Highlights & Included Accessories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
              <h4 className="text-xs font-bold text-[var(--paper)] flex items-center gap-1.5 mb-2">
                <Check size={14} className="text-emerald-500" /> Condition Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-[var(--mist)]">
                {product.highlights && product.highlights.length > 0 ? (
                  product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <span>{h}</span>
                    </li>
                  ))
                ) : (
                  <li>100% Tested Working &middot; Minor cosmetic use</li>
                )}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)]">
              <h4 className="text-xs font-bold text-[var(--paper)] flex items-center gap-1.5 mb-2">
                <Package size={14} className="text-indigo-500" /> Package Includes
              </h4>
              <ul className="space-y-1.5 text-xs text-[var(--mist)]">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Handover & Trust Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
            <Lock size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-[var(--paper)] block">SellX Safe Handover Protection</span>
              <p className="text-[var(--mist)] mt-0.5 leading-relaxed">
                When you agree on a price, a 4-digit Handover Passcode is generated. Inspect the item in person before sharing the passcode.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton
              icon={ArrowLeftRight}
              tone="teal"
              onClick={() => onRequestQuote(product)}
              className="flex-1 py-3 text-sm font-bold shadow-md active:scale-98"
            >
              Make an Offer / Bargain
            </PrimaryButton>

            <GhostButton
              icon={inCart ? Check : ShoppingCart}
              onClick={() => onToggleCart(product)}
              className="py-3 px-4 font-semibold"
              tone={inCart ? "success" : "default"}
            >
              {inCart ? "Saved" : "Save Item"}
            </GhostButton>
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
      />
    </div>
  );
}
