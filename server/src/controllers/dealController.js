import { DealModel } from "../models/DealModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { dealService } from "../services/dealService.js";

export const dealController = {
  getAllDeals(req, res, next) {
    try {
      const { search, role } = req.query;
      const allDeals = DealModel.findAll({ search, role });
      const deals = allDeals.filter(d => d.buyerId === req.user.id || d.sellerId === req.user.id);
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
      if (deal.buyerId !== req.user.id && deal.sellerId !== req.user.id) {
        return res.status(403).json({ success: false, error: { message: "Forbidden", statusCode: 403 } });
      }
      res.json({ success: true, data: deal });
    } catch (err) {
      next(err);
    }
  },

  createDeal(req, res, next) {
    try {
      const { productId, buyerName, initialOffer } = req.body;
      const product = productId ? ProductModel.findById(productId) : null;
      if (!product) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }
      // Safe legacy catalog ownership fallback:
      // Seed catalog listings without an explicit owner map to the platform verified trade partner ('usr-seller-01').
      const sellerId = product.userId || "usr-seller-01";

      if (req.user.id === sellerId) {
        return res.status(400).json({
          success: false,
          error: { message: "Cannot submit an offer on your own listing.", statusCode: 400 },
        });
      }

      let deal = DealModel.create({
        product,
        buyerId: req.user.id,
        buyerName: req.user.name,
        sellerId,
        initialOffer,
      });

      // Apply seller automation rules if defined
      deal = dealService.evaluateNewDealAutomation(deal);

      res.status(201).json({ success: true, data: deal });
    } catch (err) {
      next(err);
    }
  },

  acceptDeal(req, res, next) {
    try {
      const { id } = req.params;
      const deal = DealModel.findById(id);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }

      let actor;
      if (req.user.id === deal.buyerId) actor = "buyer";
      else if (req.user.id === deal.sellerId) actor = "seller";
      else return res.status(403).json({ success: false, error: { message: "Forbidden", statusCode: 403 } });

      const updated = dealService.acceptDeal(id, actor);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  declineDeal(req, res, next) {
    try {
      const { id } = req.params;
      const { reason = "" } = req.body;
      const deal = DealModel.findById(id);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }

      let actor;
      if (req.user.id === deal.buyerId) actor = "buyer";
      else if (req.user.id === deal.sellerId) actor = "seller";
      else return res.status(403).json({ success: false, error: { message: "Forbidden", statusCode: 403 } });

      const updated = dealService.declineDeal(id, actor, reason);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  submitCounter(req, res, next) {
    try {
      const { id } = req.params;
      const { unitPrice, leadTimeDays, note = "" } = req.body;
      const deal = DealModel.findById(id);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }

      let sender;
      if (req.user.id === deal.buyerId) sender = "buyer";
      else if (req.user.id === deal.sellerId) sender = "seller";
      else return res.status(403).json({ success: false, error: { message: "Forbidden", statusCode: 403 } });

      const updated = dealService.submitCounter(id, { sender, unitPrice, leadTimeDays, note });
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },
};
