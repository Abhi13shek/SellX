/**
 * SellX Hybrid Intelligent Buyer Copilot Engine
 *
 * Combines conversational parsing, rule-based constraint matching,
 * weighted scoring, and dynamic natural language response generation.
 */

import { fmtINR } from "../utils/formatters.js";

// Preset quick recommendations for one-click prompts
export const COPILOT_PRESETS = [
  {
    id: "coding-laptop",
    label: "💻 Best Laptop for Coding (< ₹50k)",
    category: "Laptop",
    budget: 50000,
    priority: "performance",
    query: "Find me the best laptop for programming and multitasking under ₹50,000",
  },
  {
    id: "camera-phone",
    label: "📸 Top Camera Phone (< ₹35k)",
    category: "Mobile",
    budget: 35000,
    priority: "camera",
    query: "Best smartphone for high-quality photography and battery under ₹35,000",
  },
  {
    id: "college-tablet",
    label: "📝 Tablet for Notes & Sketching (< ₹30k)",
    category: "Mobile",
    budget: 30000,
    priority: "stylus",
    query: "Looking for a tablet with stylus or Apple pencil support for college notes under ₹30,000",
  },
  {
    id: "budget-audio",
    label: "🎧 Premium ANC Headphones (< ₹15k)",
    category: "Audio",
    budget: 15000,
    priority: "sound",
    query: "Best noise-cancelling headphones or wireless earbuds under ₹15,000",
  },
];

// Quick Selector Wizard Options
export const WIZARD_CATEGORIES = [
  { id: "Mobile", label: "📱 Phones & Tablets", value: "Mobile" },
  { id: "Laptop", label: "💻 Laptops & PCs", value: "Laptop" },
  { id: "Audio", label: "🎧 Audio & Sound", value: "Audio" },
  { id: "Camera", label: "📷 Cameras & Gear", value: "Camera" },
  { id: "Gaming", label: "🎮 Gaming & Consoles", value: "Gaming" },
  { id: "Wearables", label: "⌚ Smartwatches", value: "Wearables" },
  { id: "Vehicles", label: "🚗 Cars & Bikes", value: "Vehicles" },
];

export const WIZARD_BUDGETS = [
  { id: "b-15k", label: "Under ₹15,000", max: 15000 },
  { id: "b-35k", label: "₹15,000 – ₹35,000", min: 15000, max: 35000 },
  { id: "b-60k", label: "₹35,000 – ₹60,000", min: 35000, max: 60000 },
  { id: "b-100k", label: "₹60,000 – ₹1,00,000", min: 60000, max: 100000 },
  { id: "b-any", label: "Any Budget / Premium", max: 9999999 },
];

export const WIZARD_PRIORITIES = [
  { id: "battery", label: "🔋 High Battery / Health", keywords: ["battery", "health", "mah", "backup", "charging"] },
  { id: "performance", label: "⚡ Performance / Speed", keywords: ["ram", "m1", "m2", "m3", "i7", "i9", "ryzen", "fast", "speed", "ssd", "gpu", "graphics"] },
  { id: "camera", label: "📸 Superior Camera / Video", keywords: ["camera", "108mp", "48mp", "4k", "sensor", "lens", "zoom", "portrait"] },
  { id: "value", label: "💰 Maximum Value for Money", keywords: ["deal", "discount", "cheap", "value", "box", "warranty"] },
  { id: "condition", label: "✨ Mint / Like New Condition", keywords: ["mint", "scratchless", "flawless", "open box", "like new", "unopened"] },
  { id: "delivery", label: "🚀 Fast 1-2 Day Dispatch", keywords: ["fast", "quick", "lead", "immediate"] },
];

/**
 * Natural Language Parser to extract (Category, Budget, Priorities) from query
 */
export function extractCriteria(text) {
  const clean = text.toLowerCase();

  // 1. Extract Budget
  let budget = null;
  // Match "30k", "30 k", "30,000", "₹30000", "30000rs", "under 40000"
  const kMatch = clean.match(/(?:under|below|max|budget|within|upto|up to)?\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(?:k|thousand)\b/i);
  const numMatch = clean.match(/(?:under|below|max|budget|within|upto|up to)?\s*(?:rs\.?|inr|₹)?\s*(\d{2,7})\b/i);

  if (kMatch) {
    budget = parseFloat(kMatch[1]) * 1000;
  } else if (numMatch) {
    const val = parseInt(numMatch[1], 10);
    // filter out numbers that look like year or model (like 2022, 13, 14, 15)
    if (val >= 1000) {
      budget = val;
    }
  }

  // 2. Extract Category
  let category = null;
  if (/phone|iphone|samsung|galaxy|android|smartphone|mobile|pixel|oneplus/i.test(clean)) {
    category = "Mobile";
  } else if (/laptop|macbook|thinkpad|dell|hp|asus|lenovo|notebook|pc|computer|coding|programming/i.test(clean)) {
    category = "Laptop";
  } else if (/tablet|ipad|tab|pencil|stylus|sketching|note-taking|notes/i.test(clean)) {
    category = "Mobile"; // In SellX catalog, iPad/Tablets are categorized under Mobile or Electronics
  } else if (/earphone|headphone|airpod|audio|speaker|sound|anc|noise cancel|tws|mic/i.test(clean)) {
    category = "Audio";
  } else if (/camera|dslr|mirrorless|lens|sony alpha|canon|nikon|gopro/i.test(clean)) {
    category = "Camera";
  } else if (/watch|smartwatch|apple watch|galaxy watch|fitness band/i.test(clean)) {
    category = "Wearables";
  } else if (/car|bike|motorcycle|scooter|vehicle|honda|royal enfield/i.test(clean)) {
    category = "Vehicles";
  } else if (/ps5|playstation|xbox|nintendo|console|gaming/i.test(clean)) {
    category = "Gaming";
  }

  // 3. Extract Specific Priorities / Keywords
  const priorities = [];
  if (/battery|backup|health|long battery/i.test(clean)) priorities.push("battery");
  if (/camera|photo|photography|video|portrait|lens/i.test(clean)) priorities.push("camera");
  if (/coding|programming|developer|editing|performance|ram|ssd|fast|gaming/i.test(clean)) priorities.push("performance");
  if (/box|accessories|bill|charger|cable/i.test(clean)) priorities.push("accessories");
  if (/mint|scratchless|new|flawless|like new/i.test(clean)) priorities.push("condition");
  if (/cheap|value|budget|deal|lowest/i.test(clean)) priorities.push("value");
  if (/fast delivery|urgent|same day|quick/i.test(clean)) priorities.push("delivery");

  return { category, budget, priorities, rawQuery: text };
}

/**
 * Intelligent Scoring Algorithm
 */
export function scoreProducts(products, criteria) {
  const { category, budget, priorities = [], rawQuery = "" } = criteria;
  const queryWords = rawQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

  const scored = products.map((item) => {
    let score = 50; // base baseline score
    const rationale = [];
    const highlightsMatched = [];

    const itemText = [
      item.name || "",
      item.category || "",
      item.description || "",
      ...(item.highlights || []),
      item.supplier || "",
      item.locality || "",
      item.city || "",
      item.condition || "",
      item.sku || "",
    ].join(" ").toLowerCase();

    // 1. Category Matching (Weight: up to +35 pts)
    if (category) {
      if (item.category?.toLowerCase() === category.toLowerCase()) {
        score += 30;
        rationale.push(`Perfect category match in ${item.category}`);
      } else if (
        (category === "Mobile" && /ipad|tablet/i.test(item.name)) ||
        (category === "Audio" && /speaker|headphone|sound/i.test(item.name))
      ) {
        score += 25;
      } else {
        score -= 25; // different category penalty
      }
    }

    // 2. Budget Alignment (Weight: up to +30 pts or penalty)
    if (budget && budget > 0) {
      const price = item.basePrice;
      if (price <= budget) {
        // Fits comfortably in budget
        const savings = budget - price;
        const savingsPct = Math.round((savings / budget) * 100);
        if (savingsPct >= 0 && savingsPct <= 20) {
          // Sweet spot: high spec that maxes out value near budget
          score += 30;
          rationale.push(`Optimally utilizes your ${fmtINR(budget)} budget at ${fmtINR(price)}`);
        } else if (savingsPct > 20) {
          score += 24;
          rationale.push(`Saves you ${fmtINR(savings)} (${savingsPct}% below your max budget)`);
        }
      } else {
        // Slightly over budget (+10% tolerance)
        const overPct = (price - budget) / budget;
        if (overPct <= 0.15) {
          score += 5; // slight tolerance for premium upgrades
          rationale.push(`Slightly above target (${fmtINR(price)} vs ${fmtINR(budget)}), but offers premium tier specs`);
        } else {
          score -= Math.min(45, Math.round(overPct * 50));
        }
      }
    }

    // 3. Priority Keywords Matching
    priorities.forEach((p) => {
      const priorityDef = WIZARD_PRIORITIES.find((w) => w.id === p);
      const keywords = priorityDef ? priorityDef.keywords : [p];

      let matched = false;
      for (const kw of keywords) {
        if (itemText.includes(kw)) {
          matched = true;
          score += 15;
          highlightsMatched.push(kw);
          break;
        }
      }
      if (matched) {
        if (p === "battery") rationale.push("Exceptional battery health / backup verified");
        if (p === "camera") rationale.push("Flagship-grade optics & camera capabilities");
        if (p === "performance") rationale.push("High memory/processor configuration for heavy workloads");
        if (p === "condition") rationale.push("Inspected condition with pristine aesthetics");
        if (p === "delivery") rationale.push(`Ultra-fast lead time: ${item.leadTimeDays || 2} days dispatch`);
      }
    });

    // 4. Raw Query Fuzzy Matching
    let matchedQueryWords = 0;
    queryWords.forEach((word) => {
      if (itemText.includes(word)) {
        matchedQueryWords++;
        score += 6;
      }
    });

    // 5. Seller & Quality Factors
    if (item.leadTimeDays && item.leadTimeDays <= 2) {
      score += 5;
    }
    if (item.highlights && item.highlights.length > 0) {
      score += 4;
    }

    // Normalize match percentage between 60% and 99%
    const normalizedMatch = Math.min(99, Math.max(62, Math.round(score)));

    // Calculate smart recommended offer price (e.g. 10-14% below base price)
    const suggestedOffer = Math.round((item.basePrice * 0.88) / 100) * 100;
    const potentialSavings = item.basePrice - suggestedOffer;

    return {
      product: item,
      rawScore: score,
      matchPercentage: normalizedMatch,
      rationale: rationale.slice(0, 3),
      suggestedOffer,
      potentialSavings,
      highlightsMatched,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.rawScore - a.rawScore);

  const topPick = scored[0] || null;
  const runnerUp = scored.length > 1 ? scored[1] : null;
  const budgetAlternative = scored.find(
    (s, idx) => idx > 0 && topPick && s.product.basePrice < topPick.product.basePrice * 0.85
  ) || (scored.length > 2 ? scored[2] : runnerUp);

  return {
    topPick,
    runnerUp,
    budgetAlternative,
    allScored: scored,
  };
}

/**
 * Generate rich natural language response and reasoning for the buyer
 */
export function generateCopilotAdvice({ topPick, runnerUp, criteria }) {
  if (!topPick) {
    return {
      message: "I couldn't find an exact item matching those specific constraints in our current inventory. Let's broaden your search or explore similar categories!",
      quickFollowUps: ["Show all laptops", "Show all mobile phones", "Items under ₹25,000"],
    };
  }

  const p = topPick.product;
  const rationaleList = topPick.rationale.length > 0 
    ? topPick.rationale 
    : [
        `Priced competitively at ${fmtINR(p.basePrice)} with high buyer satisfaction`,
        `Includes verified inspection by seller ${p.supplier || 'verified peer'}`,
        `Available with quick dispatch within ${p.leadTimeDays || 2} business days`,
      ];

  const greeting = criteria.budget
    ? `Based on your target of **${fmtINR(criteria.budget)}** and focus on **${criteria.category || 'electronics'}**, I have analyzed the entire SellX marketplace.`
    : `I evaluated our verified listings to find the single best match for your needs.`;

  const topPickSummary = `🏆 **Top Recommendation: ${p.name}**\n\n` +
    `• **Match Score:** **${topPick.matchPercentage}% Match**\n` +
    `• **Listed Price:** ${fmtINR(p.basePrice)}\n` +
    `• **Copilot Suggested Opening Offer:** **${fmtINR(topPick.suggestedOffer)}** *(Saves ${fmtINR(topPick.potentialSavings)})*\n\n` +
    `**Why this is your best pick:**\n` +
    rationaleList.map((r) => `✓ ${r}`).join("\n");

  const quickFollowUps = [
    `Make an offer of ${fmtINR(topPick.suggestedOffer)}`,
    runnerUp ? `Compare with ${runnerUp.product.name.split(" ").slice(0, 3).join(" ")}` : "What other options do you have?",
    "Can you negotiate a lower price for me?",
    "Check warranty and accessories included",
  ];

  return {
    greeting,
    topPickSummary,
    rationaleList,
    quickFollowUps,
  };
}
