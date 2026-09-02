import { db } from "../config/database.js";
import { genId } from "../utils/helpers.js";

export const ProductModel = {
  findAll({ category, search, sortBy } = {}) {
    let list = [...db.data.products];

    if (category && category !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.supplier && p.supplier.toLowerCase().includes(q))
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
    const newProduct = {
      id: productData.id || `P-${genId("item")}`,
      sku: productData.sku || `USED-${productData.name.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      name: productData.name,
      category: productData.category || "Mobile",
      image: productData.image || null,
      basePrice: Number(productData.basePrice),
      cost: Number(productData.cost || productData.basePrice * 0.75),
      leadTimeDays: Number(productData.leadTimeDays || 3),
      supplier: productData.supplier || "Verified Seller",
      description: productData.description || "Pre-owned item in verified condition.",
      highlights: productData.highlights || ["Verified Condition", "Direct Seller Listing"],
      sellerAdded: !!productData.sellerAdded,
      createdAt: Date.now(),
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
