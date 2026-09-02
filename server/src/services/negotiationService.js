import { marginPct, marginHealth } from "../utils/helpers.js";

export const negotiationService = {
  analyzeOffer(deal, newUnitPrice, newLeadTimeDays) {
    const cost = deal.product?.cost || deal.product?.basePrice * 0.75;
    const basePrice = deal.product?.basePrice || cost / 0.75;
    const margin = marginPct(newUnitPrice, cost);
    const health = marginHealth(margin, deal.targetMarginPct || 0.22);
    const isBelowFloor = newUnitPrice < cost;
    const discountFromBase = basePrice > 0 ? (basePrice - newUnitPrice) / basePrice : 0;

    return {
      unitPrice: newUnitPrice,
      leadTimeDays: newLeadTimeDays,
      cost,
      basePrice,
      margin,
      health,
      isBelowFloor,
      discountFromBase,
      targetMargin: deal.targetMarginPct || 0.22,
    };
  },

  generateSellerCounter(deal, buyerUnitPrice, buyerLeadTimeDays) {
    const cost = deal.product?.cost || deal.product?.basePrice * 0.75;
    const basePrice = deal.product?.basePrice || cost / 0.75;
    const targetPrice = cost / (1 - (deal.targetMarginPct || 0.22));

    // Offer halfway between buyer's offer and base/target
    const midpoint = Math.round((buyerUnitPrice + targetPrice) / 2);
    const counterPrice = Math.max(Math.round(cost * 1.08), midpoint);
    const counterLeadTime = Math.max(1, (buyerLeadTimeDays || 3) - 1);

    return {
      unitPrice: counterPrice,
      leadTimeDays: counterLeadTime,
      note: `We can accept ₹${counterPrice.toLocaleString("en-IN")} with expedited delivery in ${counterLeadTime} days.`,
    };
  },

  evaluateAutomationRules(product, offerPrice, leadTimeDays = 3) {
    if (!product?.automationRules || !product.automationRules.enabled) {
      return null;
    }

    const rules = product.automationRules;
    const price = Number(offerPrice);

    // 1. Auto-Accept Rule (Green Zone: Offer >= Auto-Accept Threshold)
    if (rules.autoAcceptEnabled && rules.autoAcceptPrice != null && price >= Number(rules.autoAcceptPrice)) {
      return {
        action: "accept",
        message: `⚡ [Seller Auto-Accept]: Inbound offer of ₹${price.toLocaleString("en-IN")} meets instant approval threshold (≥ ₹${Number(rules.autoAcceptPrice).toLocaleString("en-IN")}). Term sheet locked!`,
        reason: "auto_accept_threshold_met",
        matchedRule: "Auto-Accept (Green Zone)",
      };
    }

    // 2. Auto-Decline / Floor Price Rule (Red Zone: Offer < Floor Price)
    if (rules.autoDeclineEnabled && rules.floorPrice != null && price < Number(rules.floorPrice)) {
      return {
        action: "decline",
        message: `⚡ [Seller Floor Price Bot]: Offer of ₹${price.toLocaleString("en-IN")} is below seller's minimum floor price (₹${Number(rules.floorPrice).toLocaleString("en-IN")}). Negotiation closed.`,
        reason: "below_floor_price",
        matchedRule: "Floor Price Rejection (Red Zone)",
      };
    }

    // 3. Auto-Counter Rule (Yellow Zone: Offer between Floor and Auto-Accept)
    if (rules.autoCounterEnabled && rules.autoCounterPrice != null) {
      const counterPrice = Number(rules.autoCounterPrice);
      const counterLead = rules.autoCounterLeadTime || Math.max(1, (leadTimeDays || 3) - 1);
      return {
        action: "counter",
        unitPrice: counterPrice,
        leadTimeDays: counterLead,
        message: `⚡ [Seller Auto-Counter]: Counter-offer proposed at ₹${counterPrice.toLocaleString("en-IN")} (${counterLead}-day delivery). ${rules.customNote || "Special counter price for immediate closing."}`,
        reason: "auto_counter_zone",
        matchedRule: "Auto-Counter (Bargaining Zone)",
      };
    }

    return null;
  },
};
