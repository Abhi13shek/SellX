import { DealModel } from "../models/DealModel.js";
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
};
