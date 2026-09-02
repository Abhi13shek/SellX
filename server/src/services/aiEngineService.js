import { negotiationService } from "./negotiationService.js";

export const aiEngineService = {
  getBuyerInsights(deal) {
    const currentPrice = deal.termSheet?.unitPrice || deal.product?.basePrice;
    const basePrice = deal.product?.basePrice;
    const savings = Math.max(0, basePrice - currentPrice);
    const savingsPct = basePrice > 0 ? (savings / basePrice) * 100 : 0;

    const offerCount = deal.messages?.filter((m) => m.type === "offer").length || 0;
    const lastOffer = deal.termSheet;

    let recommendation = "Make an initial offer 12-15% below list price.";
    let fairPrice = Math.round(basePrice * 0.88);

    if (offerCount > 0) {
      if (lastOffer.lastProposedBy === "seller") {
        recommendation = `Seller countered with ₹${lastOffer.unitPrice.toLocaleString("en-IN")}. Counter at ₹${Math.round((lastOffer.unitPrice + currentPrice) / 2).toLocaleString("en-IN")} to close.`;
        fairPrice = Math.round((lastOffer.unitPrice + currentPrice) / 2);
      } else {
        recommendation = "Waiting for seller's counter-proposal or acceptance.";
      }
    }

    return {
      dealId: deal.id,
      productName: deal.product?.name,
      basePrice,
      currentPrice,
      savings,
      savingsPct: Math.round(savingsPct * 10) / 10,
      fairTargetPrice: fairPrice,
      recommendation,
      marketInsight: "Similar pre-owned items typically close within 8-14% discount range on the platform.",
      generatedAt: Date.now(),
    };
  },

  getSellerInsights(deal) {
    const currentPrice = deal.termSheet?.unitPrice || deal.product?.basePrice;
    const currentLead = deal.termSheet?.leadTimeDays || deal.product?.leadTimeDays || 3;
    const analysis = negotiationService.analyzeOffer(deal, currentPrice, currentLead);
    const suggestedCounter = negotiationService.generateSellerCounter(deal, currentPrice, currentLead);

    let summary = "Offer meets healthy margin target.";
    if (analysis.health === "critical") {
      summary = "Critical: Current proposed price is dangerously close to or below item acquisition cost.";
    } else if (analysis.health === "warn") {
      summary = "Margin is slightly below your 22% target. Recommend counter-proposing.";
    }

    return {
      dealId: deal.id,
      productName: deal.product?.name,
      margin: Math.round(analysis.margin * 1000) / 10,
      marginHealth: analysis.health,
      summary,
      isBelowFloor: analysis.isBelowFloor,
      suggestedCounter,
      upsellPrompts: [
        "Offer free fast delivery if closed today",
        "Bundle accessories or original box for faster commitment",
      ],
      generatedAt: Date.now(),
    };
  },
};
