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

  recommendBuyerProduct({ category, budget, priorities = [], query = "", products = [] }) {
    const cleanQuery = (query || "").toLowerCase();
    const queryWords = cleanQuery.split(/\s+/).filter((w) => w.length > 2);

    const scored = products.map((item) => {
      let score = 50;
      const rationale = [];

      const itemText = [
        item.name || "",
        item.category || "",
        item.description || "",
        ...(item.highlights || []),
        item.supplier || "",
        item.locality || "",
        item.city || "",
        item.condition || "",
      ].join(" ").toLowerCase();

      // Category matching
      if (category && category !== "All") {
        if (item.category?.toLowerCase() === category.toLowerCase()) {
          score += 30;
          rationale.push(`Matches your category preference (${item.category})`);
        } else {
          score -= 25;
        }
      }

      // Budget scoring
      if (budget && budget > 0) {
        if (item.basePrice <= budget) {
          const savings = budget - item.basePrice;
          const savingsPct = Math.round((savings / budget) * 100);
          if (savingsPct <= 20) {
            score += 30;
            rationale.push(`Optimally utilizes your ₹${budget.toLocaleString("en-IN")} budget at ₹${item.basePrice.toLocaleString("en-IN")}`);
          } else {
            score += 22;
            rationale.push(`Saves you ₹${savings.toLocaleString("en-IN")} below your max budget`);
          }
        } else {
          const over = (item.basePrice - budget) / budget;
          if (over <= 0.15) {
            score += 5;
          } else {
            score -= Math.min(45, Math.round(over * 50));
          }
        }
      }

      // Priority matching
      priorities.forEach((p) => {
        if (p === "battery" && (itemText.includes("battery") || itemText.includes("health") || itemText.includes("mah"))) {
          score += 15;
          rationale.push("High battery health and longevity verified");
        } else if (p === "camera" && (itemText.includes("camera") || itemText.includes("mp") || itemText.includes("lens"))) {
          score += 15;
          rationale.push("Flagship-grade optical sensor and portrait capture");
        } else if (p === "performance" && (itemText.includes("ram") || itemText.includes("ssd") || itemText.includes("m1") || itemText.includes("m2") || itemText.includes("i7") || itemText.includes("fast"))) {
          score += 15;
          rationale.push("Top-tier processing memory and speed for heavy use");
        } else if (p === "condition" && (itemText.includes("mint") || itemText.includes("scratchless") || itemText.includes("like new"))) {
          score += 15;
          rationale.push("Excellent aesthetic condition with no major flaws");
        }
      });

      // Query word matches
      queryWords.forEach((word) => {
        if (itemText.includes(word)) {
          score += 6;
        }
      });

      const normalizedMatch = Math.min(99, Math.max(62, Math.round(score)));
      const suggestedOffer = Math.round((item.basePrice * 0.88) / 100) * 100;

      return {
        product: item,
        rawScore: score,
        matchPercentage: normalizedMatch,
        rationale: rationale.slice(0, 3),
        suggestedOffer,
        potentialSavings: item.basePrice - suggestedOffer,
      };
    });

    scored.sort((a, b) => b.rawScore - a.rawScore);

    return {
      topPick: scored[0] || null,
      runnerUp: scored[1] || null,
      budgetAlternative: scored.find((s, idx) => idx > 0 && scored[0] && s.product.basePrice < scored[0].product.basePrice * 0.85) || scored[2] || null,
      totalEvaluated: products.length,
    };
  },
};
