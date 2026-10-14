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
      const { productId, buyerName, initialOffer } = req.body;
      let product = productId ? ProductModel.findById(productId) : null;
      if (!product && req.body.product) {
        product = ProductModel.create(req.body.product);
      }
      if (!product) {
        return res.status(404).json({ success: false, error: { message: "Product not found", statusCode: 404 } });
      }

      let deal = DealModel.create({
        product,
        buyerName: buyerName || "You (Buyer)",
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

  recordPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { method = "upi" } = req.body;
      const deal = DealModel.findById(id);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }
      if (deal.termSheet?.status !== "locked") {
        return res.status(409).json({ success: false, error: { message: "Agree the deal before recording a payment.", statusCode: 409 } });
      }
      if (deal.termSheet?.paymentStatus === "paid") {
        return res.json({ success: true, data: deal });
      }

      DealModel.updateTermSheet(id, {
        paymentStatus: "paid",
        paymentMethod: method,
        paidAt: Date.now(),
      });
      DealModel.addMessage(id, {
        sender: "system",
        type: "text",
        text: `Payment recorded via ${method.toUpperCase()}. Funds are marked as held for safe handover.`,
      });

      res.json({ success: true, data: DealModel.findById(id) });
    } catch (err) {
      next(err);
    }
  },

  verifyHandoverOtp(req, res, next) {
    try {
      const { id } = req.params;
      const otp = String(req.body?.otp || "").trim();
      const deal = DealModel.findById(id);

      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }
      if (deal.termSheet?.status === "completed") {
        return res.json({ success: true, data: deal });
      }
      if (deal.termSheet?.status !== "locked" || deal.termSheet?.paymentStatus !== "paid") {
        return res.status(409).json({ success: false, error: { message: "Payment must be recorded before handover can be verified.", statusCode: 409 } });
      }
      if (!/^\d{4}$/.test(otp)) {
        return res.status(400).json({ success: false, error: { message: "Enter the 4-digit handover OTP.", statusCode: 400 } });
      }

      const expectedOtp = String(deal.handoverOtp || deal.termSheet?.handoverOtp || "");
      if (!expectedOtp || otp !== expectedOtp) {
        return res.status(400).json({ success: false, error: { message: "That OTP does not match this deal. Please ask the buyer to confirm it.", statusCode: 400 } });
      }

      const completedAt = Date.now();
      DealModel.updateTermSheet(id, {
        status: "completed",
        handoverVerifiedAt: completedAt,
        completedAt,
        completedBy: "seller",
      });
      DealModel.addMessage(id, {
        sender: "system",
        type: "text",
        text: "Handover OTP verified. Deal completed successfully and escrow can be released.",
      });

      res.json({ success: true, data: DealModel.findById(id) });
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
