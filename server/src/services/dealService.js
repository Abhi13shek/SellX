import { DealModel } from "../models/DealModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { negotiationService } from "./negotiationService.js";
import { genId } from "../utils/helpers.js";

export const dealService = {
  acceptDeal(dealId, actor = "seller", automatedNote = "") {
    const deal = DealModel.findById(dealId);
    if (!deal) throw new Error(`Deal with id ${dealId} not found`);

    if (deal.termSheet.status === "locked") {
      throw new Error("Deal is already locked and accepted.");
    }

    const updated = DealModel.updateTermSheet(dealId, {
      status: "locked",
      acceptedBy: actor,
      acceptedAt: Date.now(),
    });

    DealModel.addMessage(dealId, {
      sender: "system",
      type: "text",
      text: automatedNote || `Deal agreed and locked at ₹${deal.termSheet.unitPrice.toLocaleString("en-IN")} with ${deal.termSheet.leadTimeDays}-day delivery. Escrow payment ready.`,
    });

    return updated;
  },

  declineDeal(dealId, actor = "seller", reason = "", automatedNote = "") {
    const deal = DealModel.findById(dealId);
    if (!deal) throw new Error(`Deal with id ${dealId} not found`);

    const updated = DealModel.updateTermSheet(dealId, {
      status: "declined",
      declinedBy: actor,
      declinedAt: Date.now(),
      declineReason: reason || "Below threshold",
    });

    DealModel.addMessage(dealId, {
      sender: "system",
      type: "text",
      text: automatedNote || `Negotiation was closed without agreement by ${actor}.${reason ? ` Reason: "${reason}"` : ""}`,
    });

    return updated;
  },

  submitCounter(dealId, { sender = "seller", unitPrice, leadTimeDays, note = "" }) {
    const deal = DealModel.findById(dealId);
    if (!deal) throw new Error(`Deal with id ${dealId} not found`);

    const prevPrice = deal.termSheet.unitPrice;

    // Add offer message
    DealModel.addMessage(dealId, {
      sender,
      type: "offer",
      offer: {
        unitPrice: Number(unitPrice),
        leadTimeDays: Number(leadTimeDays),
        status: "proposed",
        previousUnitPrice: prevPrice,
      },
    });

    // If there's an accompanying note, add as text message
    if (note && note.trim()) {
      DealModel.addMessage(dealId, {
        sender,
        type: "text",
        text: note.trim(),
      });
    }

    // Check Automation Rules if the buyer submitted this offer
    if (sender === "buyer" && deal.product) {
      const product = ProductModel.findById(deal.product.id) || deal.product;
      const automationResult = negotiationService.evaluateAutomationRules(product, Number(unitPrice), Number(leadTimeDays));

      if (automationResult) {
        if (automationResult.action === "accept") {
          dealService.acceptDeal(dealId, "seller (bot)", automationResult.message);
        } else if (automationResult.action === "decline") {
          dealService.declineDeal(dealId, "seller (bot)", automationResult.reason, automationResult.message);
        } else if (automationResult.action === "counter") {
          DealModel.addMessage(dealId, {
            sender: "seller",
            type: "offer",
            offer: {
              unitPrice: automationResult.unitPrice,
              leadTimeDays: automationResult.leadTimeDays,
              status: "proposed",
              previousUnitPrice: Number(unitPrice),
            },
          });
          DealModel.addMessage(dealId, {
            sender: "seller",
            type: "text",
            text: automationResult.message,
          });
        }
      }
    }

    return DealModel.findById(dealId);
  },

  evaluateNewDealAutomation(deal) {
    if (!deal || !deal.product) return deal;
    const product = ProductModel.findById(deal.product.id) || deal.product;
    const initialPrice = deal.termSheet?.unitPrice || product.basePrice;
    const initialLead = deal.termSheet?.leadTimeDays || 3;

    const automationResult = negotiationService.evaluateAutomationRules(product, initialPrice, initialLead);

    if (automationResult) {
      if (automationResult.action === "accept") {
        return dealService.acceptDeal(deal.id, "seller (bot)", automationResult.message);
      } else if (automationResult.action === "decline") {
        return dealService.declineDeal(deal.id, "seller (bot)", automationResult.reason, automationResult.message);
      } else if (automationResult.action === "counter") {
        DealModel.addMessage(deal.id, {
          sender: "seller",
          type: "offer",
          offer: {
            unitPrice: automationResult.unitPrice,
            leadTimeDays: automationResult.leadTimeDays,
            status: "proposed",
            previousUnitPrice: initialPrice,
          },
        });
        DealModel.addMessage(deal.id, {
          sender: "seller",
          type: "text",
          text: automationResult.message,
        });
        return DealModel.findById(deal.id);
      }
    }

    return deal;
  },
};
