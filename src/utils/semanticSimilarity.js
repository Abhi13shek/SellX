/**
 * Semantic Similarity Engine using explicit tiered relevance scoring.
 * Guarantees that similar product types outrank unrelated products sharing the same brand.
 */

// 1. Lightweight Type Inference with Safe Word-Boundary Matching
// Defined as an array to guarantee deterministic iteration order.
// Specific/compound types (like smartwatch) are evaluated before generic ones (like smartphone).
const TYPE_MAPPINGS = [
  { type: 'smartwatch', keywords: ['galaxy watch', 'apple watch', 'smartwatch', 'watch'] },
  { type: 'handheld_gaming', keywords: ['steam deck', 'switch'] },
  { type: 'vr', keywords: ['vr headset', 'quest', 'vr'] },
  { type: 'smartphone', keywords: ['iphone', 'galaxy', 'oneplus', 'pixel', 'smartphone', 'phone', 'redmi', 'poco', 'realme', 'vivo', 'oppo', 'motorola', 'nord'] },
  { type: 'tablet', keywords: ['ipad', 'tablet', 'tab'] },
  { type: 'laptop', keywords: ['macbook', 'thinkpad', 'laptop', 'notebook', 'ideapad', 'vivobook', 'pavilion'] },
  { type: 'monitor', keywords: ['monitor', 'display'] },
  { type: 'keyboard', keywords: ['keyboard'] },
  { type: 'mouse', keywords: ['mouse'] },
  { type: 'console', keywords: ['ps5', 'ps4', 'xbox', 'playstation', 'console'] },
  { type: 'headphones', keywords: ['headphones', 'headset', 'airpods', 'buds', 'earbuds'] },
  { type: 'speaker', keywords: ['speaker'] },
  { type: 'microphone', keywords: ['microphone', 'mic'] },
  { type: 'camera', keywords: ['camera', 'dslr', 'mirrorless', 'gopro'] },
  { type: 'printer', keywords: ['printer'] },
  { type: 'router', keywords: ['router'] },
  { type: 'ereader', keywords: ['kindle', 'ereader', 'e-reader'] }
];

function inferProductType(name) {
  if (!name) return 'other';
  const lowerName = name.toLowerCase();
  for (const mapping of TYPE_MAPPINGS) {
    // Use word boundaries to prevent substring mismatches (e.g. "vr" matching "chevron")
    if (mapping.keywords.some(k => new RegExp(`\\b${k}\\b`).test(lowerName))) {
      return mapping.type;
    }
  }
  return 'other';
}

// Map of closely related types within the same broad categories (Tier 2 Fallback)
const RELATED_TYPES = {
  smartphone: ['tablet', 'ereader'],
  tablet: ['smartphone', 'ereader'],
  ereader: ['tablet', 'smartphone'],
  laptop: ['monitor', 'keyboard', 'mouse'],
  monitor: ['laptop', 'keyboard', 'mouse'],
  keyboard: ['mouse', 'laptop', 'monitor'],
  mouse: ['keyboard', 'laptop', 'monitor'],
  console: ['handheld_gaming', 'vr'],
  handheld_gaming: ['console', 'vr'],
  vr: ['console', 'handheld_gaming'],
  headphones: ['speaker', 'microphone'],
  speaker: ['headphones', 'microphone'],
  microphone: ['headphones', 'speaker']
};

// 2. Lightweight Brand Inference
const BRANDS = [
  'apple', 'samsung', 'oneplus', 'google', 'xiaomi', 'redmi', 'realme', 'vivo', 'oppo',
  'sony', 'lenovo', 'dell', 'hp', 'asus', 'acer', 'microsoft', 'nintendo', 'xbox', 'canon',
  'nikon', 'jbl', 'bose', 'logitech', 'dyson', 'philips', 'lg', 'marshall', 'casio', 'yamaha'
];

function inferBrand(name) {
  if (!name) return null;
  const lowerName = name.toLowerCase();
  for (const brand of BRANDS) {
    if (new RegExp(`\\b${brand}\\b`).test(lowerName)) {
      return brand;
    }
  }
  return null;
}

/**
 * Find the top N semantically similar products for a given target product.
 */
export function findSimilarProducts(targetProduct, allProducts, limit = 4) {
  if (!targetProduct || !allProducts || allProducts.length <= 1) return [];

  // Always exclude the target product itself
  const otherProducts = allProducts.filter((p) => p.id !== targetProduct.id);

  const targetType = inferProductType(targetProduct.name);
  const targetBrand = inferBrand(targetProduct.name);

  const scored = otherProducts.map((p) => {
    const candidateType = inferProductType(p.name);
    const candidateBrand = inferBrand(p.name);

    // --- DETERMINE TIER ---
    let tier = 4;
    let baseMatchPercent = 20;

    // TIER 1: Same inferred product type
    if (targetType !== 'other' && targetType === candidateType) {
      tier = 1;
      baseMatchPercent = 80;
    }
    // TIER 2: Closely related product type (within same broad category)
    else if (
      targetType !== 'other' &&
      RELATED_TYPES[targetType]?.includes(candidateType) &&
      targetProduct.category === p.category
    ) {
      tier = 2;
      baseMatchPercent = 60;
    }
    // TIER 3: Same broad category
    else if (targetProduct.category && targetProduct.category === p.category) {
      tier = 3;
      baseMatchPercent = 40;
    }
    // TIER 4: Broader fallback
    else {
      tier = 4;
      baseMatchPercent = 20;
    }

    // --- CALCULATE MODIFIERS ---
    let modifiers = 0;

    // Same Brand (only boosts within its tier, cannot jump tiers)
    if (targetBrand && targetBrand === candidateBrand) {
      modifiers += 15;
    }

    // Price Similarity (Max 10 points)
    if (targetProduct.basePrice && p.basePrice) {
      const diffRatio = Math.abs(p.basePrice - targetProduct.basePrice) / targetProduct.basePrice;
      if (diffRatio <= 0.20) {
        modifiers += 10;
      } else {
        // Linearly decay score the further away it is.
        const decay = Math.max(0, 10 - ((diffRatio - 0.20) * 20));
        modifiers += decay;
      }
    }

    // Same Condition
    if (targetProduct.condition && targetProduct.condition === p.condition) {
      modifiers += 5;
    }

    // Same City
    if (targetProduct.city && targetProduct.city === p.city) {
      modifiers += 5;
    }

    // --- FINAL SCORING ---
    // sortingScore dictates exact absolute rank (Tier 1 is 4000+, Tier 2 is 3000+, etc.)
    const sortingScore = ((5 - tier) * 1000) + modifiers;

    // Scale the 0-35 modifiers into a maximum of 19 points to prevent boundary crossover
    // Tier 1: 80 + 0 to 19 = 80-99%
    // Tier 2: 60 + 0 to 19 = 60-79%
    const scaledModifiers = (modifiers / 35) * 19;
    const matchPercent = Math.min(99, Math.round(baseMatchPercent + scaledModifiers));
    const similarity = matchPercent / 100;

    // Legacy price badge logic required by the UI
    const priceDiff = (p.basePrice || 0) - (targetProduct.basePrice || 0);
    let priceBadge = null;

    if (priceDiff < -1000) {
      priceBadge = {
        type: "cheaper",
        text: `₹${Math.abs(priceDiff).toLocaleString("en-IN")} Cheaper Alternative`,
        diff: priceDiff,
      };
    } else if (priceDiff > 1000) {
      priceBadge = {
        type: "premium",
        text: `+₹${priceDiff.toLocaleString("en-IN")} Higher Spec`,
        diff: priceDiff,
      };
    } else {
      priceBadge = {
        type: "similar",
        text: "Similar Price Range",
        diff: 0,
      };
    }

    return {
      product: p,
      sortingScore,
      similarity,
      matchPercent,
      priceBadge,
    };
  });

  // Sort strictly by the hierarchical sortingScore
  scored.sort((a, b) => b.sortingScore - a.sortingScore);

  return scored.slice(0, limit);
}
