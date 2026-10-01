import { DealModel } from "../models/DealModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { aiEngineService } from "../services/aiEngineService.js";

export const copilotController = {
  getBuyerInsights(req, res, next) {
    try {
      const { dealId } = req.params;
      const deal = DealModel.findById(dealId);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }

      const insights = aiEngineService.getBuyerInsights(deal);
      res.json({ success: true, data: insights });
    } catch (err) {
      next(err);
    }
  },

  getSellerInsights(req, res, next) {
    try {
      const { dealId } = req.params;
      const deal = DealModel.findById(dealId);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }

      const insights = aiEngineService.getSellerInsights(deal);
      res.json({ success: true, data: insights });
    } catch (err) {
      next(err);
    }
  },

  recommendBuyerProduct(req, res, next) {
    try {
      const { category, budget, priorities = [], query = "" } = req.body;
      const products = ProductModel.findAll();
      const recommendation = aiEngineService.recommendBuyerProduct({
        category,
        budget: Number(budget) || null,
        priorities,
        query,
        products,
      });
      res.json({ success: true, data: recommendation });
    } catch (err) {
      next(err);
    }
  },
};
