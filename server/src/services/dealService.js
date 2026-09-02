import { DealModel } from "../models/DealModel.js";
import { genId } from "../utils/helpers.js";

export const dealService = {
  acceptDeal(dealId, actor = "seller") {
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
      text: `Deal agreed and locked at ₹${deal.termSheet.unitPrice.toLocaleString("en-IN")} with ${deal.termSheet.leadTimeDays}-day delivery. Escrow payment ready.`,
    });

    return updated;
  },

  declineDeal(dealId, actor = "seller", reason = "") {
    const deal = DealModel.findById(dealId);
    if (!deal) throw new Error(`Deal with id ${dealId} not found`);

    const updated = DealModel.updateTermSheet(dealId, {
      status: "declined",
      declinedBy: actor,
      declinedAt: Date.now(),
      declineReason: reason,
    });

    DealModel.addMessage(dealId, {
      sender: "system",
      type: "text",
      text: `Negotiation was closed without agreement by ${actor}.${reason ? ` Reason: "${reason}"` : ""}`,
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

    return DealModel.findById(dealId);
  },
};
