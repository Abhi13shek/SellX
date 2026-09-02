import React from "react";
import { ArrowLeft, Check, ShoppingCart, ArrowLeftRight, MapPin, ShieldCheck, Navigation } from "lucide-react";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { CategoryBadge, Badge } from "../common/Badge.jsx";
import { MiniStat } from "../common/MiniStat.jsx";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { catColor } from "../../utils/styles.js";
import { fmtINR } from "../../utils/formatters.js";
import { SAFE_MEETUP_ZONES } from "../../data/constants.js";

export function ProductDetailPage({ product, onBack, onRequestQuote, onToggleCart, inCart }) {
  if (!product) return null;
  const c = catColor(product.category);
  const locationSnippet = product.supplier?.includes("(")
    ? product.supplier.split("(")[1]?.replace(")", "")
    : "Indiranagar, Bengaluru";

  return (
    <div className="sellx-rise">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--mist)] hover:text-[var(--paper)] mb-5 transition-colors"
      >
        <ArrowLeft size={15} /> Back to catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: image */}
        <div className="lg:sticky lg:top-24 h-max space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-[var(--line)]">
            <ProductImageTile category={product.category} Icon={product.icon} image={product.image} size="lg" />
            <div className="absolute top-3 left-3">
              <CategoryBadge category={product.category} />
            </div>
          </div>

          {/* Safe Exchange Zones Card */}
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--paper)] flex items-center gap-1.5">
                <MapPin size={13} className="text-[var(--teal)]" /> Safe Exchange Points ({locationSnippet})
              </span>
              <Badge tone="green">Verified Zone</Badge>
            </div>
            <div className="space-y-2 text-xs">
              {SAFE_MEETUP_ZONES.map((zone) => (
                <div key={zone.id} className="p-2.5 rounded-xl bg-[var(--surface2)]/60 border border-[var(--line)] flex items-start gap-2">
                  <ShieldCheck size={14} className="text-[var(--green)] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[var(--paper)]">{zone.name}</div>
                    <div className="text-[11px] text-[var(--mist)]">{zone.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--mist-dim)]">
            <span>{product.sku}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1 text-[var(--mist)]">
              <MapPin size={11} className="text-[var(--teal)]" /> {locationSnippet}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mt-1.5 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-mono text-3xl font-bold tabular-nums text-[var(--price)]">
              {fmtINR(product.basePrice)}
            </span>
            <span className="text-sm text-[var(--mist)]">list price</span>
          </div>

          <p className="text-sm text-[var(--mist)] mt-4 leading-relaxed">{product.description}</p>

          {product.highlights && product.highlights.length > 0 && (
            <ul className="mt-4 space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-[var(--paper)]">
                  <Check size={15} className="mt-0.5 shrink-0 text-[var(--green)]" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="grid grid-cols-2 gap-3 mt-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
            <MiniStat label="Category" value={product.category} />
            <MiniStat label="Lead time" value={`${product.leadTimeDays} days`} />
            <MiniStat label="Location" value={locationSnippet} />
            <MiniStat label="SKU" value={product.sku} />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <GhostButton
              icon={inCart ? Check : ShoppingCart}
              onClick={() => onToggleCart(product)}
              className="flex-1"
              tone={inCart ? "success" : "default"}
            >
              {inCart ? "Added to cart" : "Add to cart"}
            </GhostButton>
            <PrimaryButton icon={ArrowLeftRight} tone="teal" onClick={() => onRequestQuote(product)} className="flex-1">
              Negotiate price
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
