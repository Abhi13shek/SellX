import { ProductModel } from "../models/ProductModel.js";
import { negotiationService } from "../services/negotiationService.js";

export const productController = {
  getAllProducts(req, res, next) {
    try {
      const { category, search, sortBy } = req.query;
      const products = ProductModel.findAll({ category, search, sortBy });
      res.json({ success: true, count: products.length, data: products });
    } catch (err) {
      next(err);
    }
  },

  getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }
      res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  createProduct(req, res, next) {
    try {
      const { name, basePrice, category, description, supplier, leadTimeDays, highlights, image, sku, cost, automationRules } = req.body;
      const product = ProductModel.create({
        name,
        basePrice,
        category,
        description,
        supplier,
        leadTimeDays,
        highlights,
        image,
        sku,
        cost,
        automationRules: automationRules || {
          enabled: true,
          floorPrice: Math.round(Number(basePrice) * 0.8),
          autoAcceptPrice: Math.round(Number(basePrice) * 0.95),
          autoCounterPrice: Math.round(Number(basePrice) * 0.9),
          autoAcceptEnabled: true,
          autoDeclineEnabled: true,
          autoCounterEnabled: true,
        },
        sellerAdded: true,
      });
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  updateAutomationRules(req, res, next) {
    try {
      const { id } = req.params;
      const { automationRules } = req.body;
      const product = ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }

      const updated = ProductModel.update(id, { automationRules });
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  simulateAutomation(req, res, next) {
    try {
      const { id } = req.params;
      const { testOfferPrice, testLeadTimeDays } = req.body;
      const product = ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }

      const result = negotiationService.evaluateAutomationRules(product, Number(testOfferPrice), Number(testLeadTimeDays || 3));
      res.json({
        success: true,
        data: {
          testOfferPrice: Number(testOfferPrice),
          productBasePrice: product.basePrice,
          decision: result ? result.action : "manual_review",
          matchedRule: result ? result.matchedRule : "No rule matched (Escalates to Seller Inbox)",
          details: result,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = ProductModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
