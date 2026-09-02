import { DealModel } from "../models/DealModel.js";
import { ProductModel } from "../models/ProductModel.js";

export const statsController = {
  getPlatformStats(req, res, next) {
    try {
      const deals = DealModel.findAll();
      const products = ProductModel.findAll();

      const activeRFQs = deals.filter((d) => d.termSheet?.status === "proposed" || d.termSheet?.status === "countered").length;
      const lockedDeals = deals.filter((d) => d.termSheet?.status === "locked").length;

      let totalSavings = 0;
      let totalMargin = 0;

      deals.forEach((d) => {
        const base = d.product?.basePrice || 0;
        const current = d.termSheet?.unitPrice || base;
        const cost = d.product?.cost || base * 0.75;

        if (d.termSheet?.status === "locked") {
          totalSavings += Math.max(0, base - current);
          totalMargin += Math.max(0, current - cost);
        }
      });

      res.json({
        success: true,
        data: {
          totalListings: products.length,
          totalDeals: deals.length,
          activeRFQs,
          lockedDeals,
          totalSavings,
          totalMargin,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
