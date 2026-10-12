import { DealModel } from "../models/DealModel.js";

export const messageController = {
  getMessages(req, res, next) {
    try {
      const { id } = req.params;
      const deal = DealModel.findById(id);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }
      if (deal.buyerId !== req.user.id && deal.sellerId !== req.user.id) {
        return res.status(403).json({ success: false, error: { message: "Forbidden", statusCode: 403 } });
      }
      res.json({ success: true, count: deal.messages.length, data: deal.messages });
    } catch (err) {
      next(err);
    }
  },

  postMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { text, type = "text", offer = null } = req.body;

      const deal = DealModel.findById(id);
      if (!deal) {
        return res.status(404).json({ success: false, error: { message: "Deal not found", statusCode: 404 } });
      }

      let sender;
      if (req.user.id === deal.buyerId) sender = "buyer";
      else if (req.user.id === deal.sellerId) sender = "seller";
      else return res.status(403).json({ success: false, error: { message: "Forbidden", statusCode: 403 } });

      const updated = DealModel.addMessage(id, {
        sender,
        text,
        type,
        offer,
      });

      const latestMessage = updated.messages[updated.messages.length - 1];
      res.status(201).json({ success: true, data: latestMessage, deal: updated });
    } catch (err) {
      next(err);
    }
  },
};
