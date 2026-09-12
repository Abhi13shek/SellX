import { db } from "../config/database.js";
import { genId } from "../utils/helpers.js";

export const ProductModel = {
  findAll({ category, search, sortBy, city, condition } = {}) {
    let list = [...db.data.products];

    if (category && category !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (city && city !== "All") {
      list = list.filter((p) => (p.city || "").toLowerCase() === city.toLowerCase());
    }

    if (condition && condition !== "All") {
      list = list.filter((p) => (p.condition || "").toLowerCase().includes(condition.toLowerCase()));
    }

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.supplier && p.supplier.toLowerCase().includes(q)) ||
          (p.locality && p.locality.toLowerCase().includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q)) ||
          (p.condition && p.condition.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.basePrice - b.basePrice);
    if (sortBy === "price-desc") list.sort((a, b) => b.basePrice - a.basePrice);
    if (sortBy === "lead-asc") list.sort((a, b) => a.leadTimeDays - b.leadTimeDays);

    return list;
  },

  findById(id) {
    return db.data.products.find((p) => p.id === id) || null;
  },

  create(productData) {
    const basePrice = Number(productData.basePrice);
    const minAcceptablePrice = productData.minAcceptablePrice != null
      ? Number(productData.minAcceptablePrice)
      : Math.round(basePrice * 0.85);

    const newProduct = {
      id: productData.id || `P-${genId("item")}`,
      sku: productData.sku || `USED-${productData.name.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      name: productData.name,
      category: productData.category || "Mobile",
      image: productData.image || null,
      basePrice,
      cost: Number(productData.cost || basePrice * 0.75),
      minAcceptablePrice,
      condition: productData.condition || "Like New",
      city: productData.city || "Bangalore",
      locality: productData.locality || "Indiranagar",
      distanceKm: productData.distanceKm || 2.4,
      leadTimeDays: Number(productData.leadTimeDays || 1),
      supplier: productData.supplier || "Verified Owner (You)",
      sellerTrust: productData.sellerTrust || {
        rating: 4.9,
        reviewsCount: 12,
        verified: true,
        memberSince: "2024",
      },
      handoverOptions: productData.handoverOptions || ["Local Meetup", "Instant Courier"],
      description: productData.description || "Pre-owned item in verified condition with genuine accessories.",
      highlights: productData.highlights || ["Verified Working Condition", "Direct Owner Listing", "Handover OTP Protection"],
      includes: productData.includes || ["Original Box", "Charging Cable", "Purchase Bill"],
      sellerAdded: !!productData.sellerAdded,
      createdAt: Date.now(),
      automationRules: productData.automationRules || {
        enabled: true,
        floorPrice: minAcceptablePrice,
        autoAcceptPrice: Math.round(basePrice * 0.92),
        autoCounterPrice: Math.round(basePrice * 0.88),
        autoAcceptEnabled: true,
        autoDeclineEnabled: true,
        autoCounterEnabled: true,
      },
    };

    db.data.products.unshift(newProduct);
    db.saveSync();
    return newProduct;
  },

  update(id, updates) {
    const idx = db.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    db.data.products[idx] = { ...db.data.products[idx], ...updates };
    db.saveSync();
    return db.data.products[idx];
  },

  delete(id) {
    const idx = db.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    db.data.products.splice(idx, 1);
    db.saveSync();
    return true;
  },
};
