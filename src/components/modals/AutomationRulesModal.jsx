import React, { useState, useEffect } from "react";
import {
  X,
  Bot,
  Zap,
  ShieldCheck,
  ArrowLeftRight,
  XCircle,
  CheckCircle2,
  Sliders,
  Sparkles,
  HelpCircle,
  Play,
  TrendingUp,
} from "lucide-react";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { Badge } from "../common/Badge.jsx";
import { fmtINR } from "../../utils/formatters.js";
import { marginPct, marginHealth } from "../../utils/helpers.js";
import { healthColor } from "../../utils/styles.js";
import { ProductImageTile } from "../common/ProductImageTile.jsx";

export function AutomationRulesModal({ product, isOpen, onClose, onSaveRules }) {
  if (!isOpen || !product) return null;

  const cost = product.cost || Math.round(product.basePrice * 0.75);
  const existingRules = product.automationRules || {};

  const [enabled, setEnabled] = useState(existingRules.enabled ?? true);
  const [autoAcceptEnabled, setAutoAcceptEnabled] = useState(existingRules.autoAcceptEnabled ?? true);
  const [autoAcceptPrice, setAutoAcceptPrice] = useState(
    existingRules.autoAcceptPrice || Math.round(product.basePrice * 0.95)
  );

  const [autoCounterEnabled, setAutoCounterEnabled] = useState(existingRules.autoCounterEnabled ?? true);
  const [autoCounterPrice, setAutoCounterPrice] = useState(
    existingRules.autoCounterPrice || Math.round(product.basePrice * 0.9)
  );
  const [autoCounterLeadTime, setAutoCounterLeadTime] = useState(
    existingRules.autoCounterLeadTime || product.leadTimeDays || 2
  );
  const [customNote, setCustomNote] = useState(
    existingRules.customNote || "Special counter price for immediate deal closing."
  );

  const [autoDeclineEnabled, setAutoDeclineEnabled] = useState(existingRules.autoDeclineEnabled ?? true);
  const [floorPrice, setFloorPrice] = useState(
    existingRules.floorPrice || Math.round(product.basePrice * 0.8)
  );

  // Simulator state
  const [testOffer, setTestOffer] = useState(Math.round(product.basePrice * 0.88));
  const [saving, setSaving] = useState(false);

  // Calculate health margins
  const acceptMargin = marginPct(Number(autoAcceptPrice), cost);
  const counterMargin = marginPct(Number(autoCounterPrice), cost);
  const floorMargin = marginPct(Number(floorPrice), cost);

  // Simulated bot evaluation
  const getSimulationResult = (offer) => {
    if (!enabled) {
      return {
        action: "manual",
        title: "Bot Disabled · Manual Review",
        desc: "Offer goes directly to your seller inbox for manual review.",
        tone: "neutral",
        icon: HelpCircle,
      };
    }
    if (autoAcceptEnabled && offer >= Number(autoAcceptPrice)) {
      return {
        action: "accept",
        title: `🟢 Auto-Accept & Lock at ${fmtINR(offer)}`,
        desc: `Offer meets your instant approval threshold (≥ ${fmtINR(autoAcceptPrice)}). Deal locks automatically.`,
        tone: "green",
        icon: ShieldCheck,
      };
    }
    if (autoDeclineEnabled && offer < Number(floorPrice)) {
      return {
        action: "decline",
        title: `🔴 Auto-Reject Lowball Offer (${fmtINR(offer)})`,
        desc: `Offer is below your firm floor price (${fmtINR(floorPrice)}). Bot politely rejects to save your time.`,
        tone: "red",
        icon: XCircle,
      };
    }
    if (autoCounterEnabled) {
      return {
        action: "counter",
        title: `🟡 Auto-Counter with ${fmtINR(autoCounterPrice)}`,
        desc: `Offer falls in the bargaining zone. Bot automatically proposes ${fmtINR(autoCounterPrice)} with "${customNote}".`,
        tone: "teal",
        icon: ArrowLeftRight,
      };
    }
    return {
      action: "manual",
      title: "Manual Seller Review",
      desc: "Offer falls outside automated rules and is sent to your inbox.",
      tone: "neutral",
      icon: HelpCircle,
    };
  };

  const simResult = getSimulationResult(Number(testOffer));

  const handleSave = async () => {
    setSaving(true);
    const rules = {
      enabled,
      autoAcceptEnabled,
      autoAcceptPrice: Number(autoAcceptPrice),
      autoCounterEnabled,
      autoCounterPrice: Number(autoCounterPrice),
      autoCounterLeadTime: Number(autoCounterLeadTime),
      customNote: customNote.trim(),
      autoDeclineEnabled,
      floorPrice: Number(floorPrice),
      updatedAt: Date.now(),
    };

    if (onSaveRules) {
      await onSaveRules(product.id, rules);
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md sellx-rise">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--surface2)] text-[var(--mist)] hover:text-[var(--paper)] flex items-center justify-center border border-[var(--line)] transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-[var(--teal)]/12 text-[var(--teal)] border border-[var(--teal)]/30 flex items-center justify-center">
              <Bot size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--teal)] font-mono">
              Smart Deal Automation
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--paper)]">
            Floor Price &amp; Auto-Bargaining Rules
          </h2>
          <p className="text-xs text-[var(--mist)] mt-1">
            Configure automated acceptance, counter-offers, and lowball protection for this listing.
          </p>
        </div>

        {/* Product Info Strip & Master Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--line)] shrink-0 bg-[var(--surface)]">
              <ProductImageTile
                src={product.image}
                category={product.category}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-sm text-[var(--paper)] truncate">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--mist)]">
                <span>List: <strong className="text-[var(--paper)] font-mono">{fmtINR(product.basePrice)}</strong></span>
                <span>&middot;</span>
                <span>Estimated Cost: <strong className="text-[var(--mist-dim)] font-mono">{fmtINR(cost)}</strong></span>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none shrink-0 bg-[var(--surface)] border border-[var(--line)] px-3 py-1.5 rounded-xl">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="accent-[var(--teal)] w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-[var(--paper)]">
              {enabled ? "⚡ Bot Active" : "Bot Paused"}
            </span>
          </label>
        </div>

        {/* 3 Tiered Strategy Config */}
        <div className="space-y-4">
          {/* 1. Auto-Accept Zone (Green) */}
          <div className="p-4 rounded-2xl border border-[var(--green)]/30 bg-[var(--green)]/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[var(--green)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--green)]">
                  1. Auto-Accept Zone (Instant Approval)
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--mist)]">
                <input
                  type="checkbox"
                  checked={autoAcceptEnabled}
                  onChange={(e) => setAutoAcceptEnabled(e.target.checked)}
                  className="accent-[var(--green)] w-3.5 h-3.5"
                />
                <span>Enable</span>
              </label>
            </div>

            <p className="text-xs text-[var(--mist)]">
              Instantly locks and approves any buyer offer equal to or above this price without waiting for your response.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <FieldLabel hint={`${(acceptMargin * 100).toFixed(1)}% profit margin`}>
                  Auto-Accept Threshold (≥)
                </FieldLabel>
                <input
                  type="range"
                  min={Math.round(cost * 1.05)}
                  max={product.basePrice}
                  step="250"
                  value={autoAcceptPrice}
                  disabled={!autoAcceptEnabled}
                  onChange={(e) => setAutoAcceptPrice(Number(e.target.value))}
                  className="w-full accent-[var(--green)] cursor-pointer mt-1 disabled:opacity-40"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  value={autoAcceptPrice}
                  disabled={!autoAcceptEnabled}
                  onChange={(e) => setAutoAcceptPrice(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm font-mono font-bold text-[var(--green)] text-right disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* 2. Auto-Counter Zone (Yellow/Teal) */}
          <div className="p-4 rounded-2xl border border-[var(--teal)]/30 bg-[var(--teal)]/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-[var(--teal)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--teal)]">
                  2. Auto-Counter Target (Bargaining Zone)
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--mist)]">
                <input
                  type="checkbox"
                  checked={autoCounterEnabled}
                  onChange={(e) => setAutoCounterEnabled(e.target.checked)}
                  className="accent-[var(--teal)] w-3.5 h-3.5"
                />
                <span>Enable</span>
              </label>
            </div>

            <p className="text-xs text-[var(--mist)]">
              When an offer is between floor and auto-accept, bot automatically proposes this counter price with your customized message.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel hint={`${(counterMargin * 100).toFixed(1)}% margin`}>
                  Counter Target Price
                </FieldLabel>
                <input
                  type="number"
                  value={autoCounterPrice}
                  disabled={!autoCounterEnabled}
                  onChange={(e) => setAutoCounterPrice(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm font-mono font-bold text-[var(--paper)] disabled:opacity-40"
                />
              </div>
              <div>
                <FieldLabel>Delivery Lead (Days)</FieldLabel>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={autoCounterLeadTime}
                  disabled={!autoCounterEnabled}
                  onChange={(e) => setAutoCounterLeadTime(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm font-mono text-[var(--paper)] disabled:opacity-40"
                />
              </div>
            </div>

            <div>
              <FieldLabel>Automated Note with Counter</FieldLabel>
              <input
                type="text"
                value={customNote}
                disabled={!autoCounterEnabled}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Best price for immediate closing with all accessories included."
                className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--paper)] disabled:opacity-40"
              />
            </div>
          </div>

          {/* 3. Floor Price / Auto-Decline (Red) */}
          <div className="p-4 rounded-2xl border border-[var(--red)]/30 bg-[var(--red)]/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-[var(--red)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--red)]">
                  3. Minimum Floor Price (Lowball Protection)
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer text-[var(--mist)]">
                <input
                  type="checkbox"
                  checked={autoDeclineEnabled}
                  onChange={(e) => setAutoDeclineEnabled(e.target.checked)}
                  className="accent-[var(--red)] w-3.5 h-3.5"
                />
                <span>Enable</span>
              </label>
            </div>

            <p className="text-xs text-[var(--mist)]">
              Any offer below this hard floor price is instantly declined automatically to save you from unrealistic lowballers.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <FieldLabel hint={`${(floorMargin * 100).toFixed(1)}% break-even floor`}>
                  Hard Floor Price Threshold (&lt;)
                </FieldLabel>
                <input
                  type="range"
                  min={Math.round(cost * 0.8)}
                  max={Math.round(product.basePrice * 0.9)}
                  step="250"
                  value={floorPrice}
                  disabled={!autoDeclineEnabled}
                  onChange={(e) => setFloorPrice(Number(e.target.value))}
                  className="w-full accent-[var(--red)] cursor-pointer mt-1 disabled:opacity-40"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  value={floorPrice}
                  disabled={!autoDeclineEnabled}
                  onChange={(e) => setFloorPrice(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm font-mono font-bold text-[var(--red)] text-right disabled:opacity-40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Bot Simulator */}
        <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--mist-dim)] flex items-center gap-1.5">
              <Play size={13} className="text-[var(--teal)]" /> Live Rule Simulator
            </span>
            <span className="text-xs font-mono font-bold text-[var(--price)]">
              Testing Offer: {fmtINR(testOffer)}
            </span>
          </div>

          <input
            type="range"
            min={Math.round(cost * 0.7)}
            max={Math.round(product.basePrice * 1.05)}
            step="250"
            value={testOffer}
            onChange={(e) => setTestOffer(Number(e.target.value))}
            className="w-full accent-[var(--teal)] cursor-pointer"
          />

          <div className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
            simResult.tone === "green"
              ? "bg-[var(--green)]/10 border-[var(--green)]/30 text-[var(--green)]"
              : simResult.tone === "red"
              ? "bg-[var(--red)]/10 border-[var(--red)]/30 text-[var(--red)]"
              : "bg-[var(--teal)]/10 border-[var(--teal)]/30 text-[var(--teal)]"
          }`}>
            <simResult.icon size={16} className="shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold">{simResult.title}</div>
              <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed text-[var(--paper)]">
                {simResult.desc}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line)]">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton tone="teal" onClick={handleSave} disabled={saving} icon={Bot}>
            {saving ? "Saving Rules..." : "Save & Activate Rules"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
