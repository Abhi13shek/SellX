import { DealModel } from "../models/DealModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { dealService } from "../services/dealService.js";

export const dealController = {
  getAllDeals(req, res, next) {
    try {
      const { search, role } = req.query;
      const deals = DealModel.findAll({ search, role });
      res.json({ success: true, count: deals.length, data: deals });
    } catch (err) {
      next(err);
    }
  },

  getDealById(req, res, next) {
    try {
      const { id } = req.params;
      const deal = DealModel.findById(id);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }
      res.json({ success: true, data: deal });
    } catch (err) {
      next(err);
    }
  },

  createDeal(req, res, next) {
    try {
      let product = ProductModel.findById(productId);
      if (!product && req.body.product) {
        product = ProductModel.create(req.body.product);
      }
      if (!product) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }

      const deal = DealModel.create({
        product,
        buyerName: buyerName || "You (Buyer)",
        initialOffer,
      });

      res.status(201).json({ success: true, data: deal });
    } catch (err) {
      next(err);
    }
  },

  acceptDeal(req, res, next) {
    try {
      const { id } = req.params;
      const { actor = "seller" } = req.body;
      const updated = dealService.acceptDeal(id, actor);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  declineDeal(req, res, next) {
    try {
      const { id } = req.params;
      const { actor = "seller", reason = "" } = req.body;
      const updated = dealService.declineDeal(id, actor, reason);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  submitCounter(req, res, next) {
    try {
      const { id } = req.params;
      const { sender = "seller", unitPrice, leadTimeDays, note = "" } = req.body;
      const updated = dealService.submitCounter(id, { sender, unitPrice, leadTimeDays, note });
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },
};
