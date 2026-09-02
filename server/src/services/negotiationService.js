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
};
