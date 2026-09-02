import React from "react";
import { ShoppingCart, X, ArrowLeftRight } from "lucide-react";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { GhostButton } from "../common/Buttons.jsx";
import { fmtINR } from "../../utils/formatters.js";

export function CartDrawer({ open, onClose, items, onRemove, onClear, onGoToCatalog, onNegotiateItem }) {
  const subtotal = items.reduce((sum, product) => sum + product.basePrice, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--surface)] border-l border-[var(--line)] shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--line)] shrink-0">
          <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
            <ShoppingCart size={16} /> Cart <span className="text-xs font-mono text-[var(--mist-dim)] font-normal">({items.length})</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--mist)]">Your cart is empty.</p>
              <p className="text-xs text-[var(--mist-dim)] mt-1 max-w-[220px] mx-auto leading-relaxed">
                Add items at list price, or open a negotiation to work out a better one.
              </p>
              <button onClick={onGoToCatalog} className="mt-3 text-sm font-semibold text-[var(--navy)] hover:underline">
                Browse the catalog
              </button>
            </div>
          )}
          {items.map((product) => (
            <div
              key={product.id}
              className="ledgr-rise group flex gap-3 p-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] hover:border-[var(--teal)]/40 transition-colors"
            >
              <ProductImageTile category={product.category} Icon={product.icon} image={product.image} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-[var(--paper)] leading-snug truncate">{product.name}</div>
                  <button onClick={() => onRemove(product.id)} className="text-[var(--mist)] hover:text-[var(--red)] shrink-0">
                    <X size={14} />
                  </button>
                </div>
                <div className="text-xs font-mono text-[var(--mist-dim)] mt-0.5">{product.sku}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-mono font-semibold text-[var(--brass-text)]">{fmtINR(product.basePrice)}</span>
                  <button
                    onClick={() => onNegotiateItem(product)}
                    className="text-[11px] font-semibold text-[var(--navy)] hover:underline flex items-center gap-1"
                  >
                    <ArrowLeftRight size={11} /> Negotiate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--line)] shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-[var(--mist)]">Subtotal &middot; list price</span>
              <span className="font-mono text-lg font-bold text-[var(--price)] tabular-nums">{fmtINR(subtotal)}</span>
            </div>
            <p className="text-[11px] text-[var(--mist-dim)] leading-relaxed">
              Buy at list price, or open a negotiation on any item to agree on a better one.
            </p>
            <GhostButton onClick={onClear} className="w-full">
              Clear cart
            </GhostButton>
          </div>
        )}
      </div>
    </>
  );
}
