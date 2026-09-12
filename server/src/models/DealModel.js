import { db } from "../config/database.js";
import { genId } from "../utils/helpers.js";

export const DealModel = {
  findAll({ role, search } = {}) {
    let list = [...db.data.deals];

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.product?.name.toLowerCase().includes(q) ||
          d.buyerName?.toLowerCase().includes(q) ||
          d.sellerName?.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
  },

  findById(id) {
    return db.data.deals.find((d) => d.id === id) || null;
  },

  create({ product, buyerName = "You (Buyer)", initialOffer = null }) {
    const now = Date.now();
    const dealId = `D-${Math.floor(1000 + Math.random() * 9000)}`;

    const unitPrice = initialOffer?.unitPrice != null ? Number(initialOffer.unitPrice) : product.basePrice;
    const leadTimeDays = initialOffer?.leadTimeDays != null ? Number(initialOffer.leadTimeDays) : product.leadTimeDays;

    const messages = [
      {
        id: genId("m"),
        sender: "system",
        type: "text",
        text: `Negotiation opened for ${product.name}.`,
        timestamp: now,
      },
    ];

    if (initialOffer) {
      messages.push({
        id: genId("m"),
        sender: "buyer",
        type: "offer",
        timestamp: now + 500,
        offer: {
          unitPrice,
          leadTimeDays,
          status: "proposed",
          previousUnitPrice: product.basePrice,
        },
      });
      if (initialOffer.note) {
        messages.push({
          id: genId("m"),
          sender: "buyer",
          type: "text",
          text: initialOffer.note,
          timestamp: now + 1000,
        });
      }
    }

    const handoverType = initialOffer?.handoverType || "Local Meetup";
    const meetupLocation = initialOffer?.meetupLocation || product.locality ? `${product.locality}, ${product.city || "Bangalore"}` : "Designated Public Spot";

    const newDeal = {
      id: dealId,
      productId: product.id,
      product,
      buyerName,
      sellerName: product.supplier || "Verified Owner",
      targetMarginPct: 0.22,
      handoverType,
      meetupLocation,
      handoverOtp: null,
      createdAt: now,
      updatedAt: now,
      messages,
      termSheet: {
        unitPrice,
        leadTimeDays,
        handoverType,
        meetupLocation,
        status: "proposed",
        expiresAt: now + 90 * 60000,
        lastProposedBy: initialOffer ? "buyer" : "seller",
      },
    };

    db.data.deals.unshift(newDeal);
    db.saveSync();
    return newDeal;
  },

  addMessage(dealId, message) {
    const deal = this.findById(dealId);
    if (!deal) return null;

    const msgWithId = {
      id: message.id || genId("m"),
      sender: message.sender || "buyer",
      type: message.type || "text",
      text: message.text || "",
      offer: message.offer || null,
      timestamp: message.timestamp || Date.now(),
    };

    deal.messages.push(msgWithId);
    deal.updatedAt = Date.now();

    // If it is an offer, mark previous offers as superseded and update termsheet
    if (message.type === "offer" && message.offer) {
      deal.messages.forEach((m, idx) => {
        if (m.type === "offer" && idx !== deal.messages.length - 1 && m.offer) {
          m.offer.status = "superseded";
        }
      });

      deal.termSheet = {
        ...deal.termSheet,
        unitPrice: message.offer.unitPrice,
        leadTimeDays: message.offer.leadTimeDays,
        handoverType: message.offer.handoverType || deal.termSheet.handoverType || "Local Meetup",
        status: "proposed",
        expiresAt: Date.now() + 90 * 60000,
        lastProposedBy: message.sender,
      };
    }

    db.saveSync();
    return deal;
  },

  updateTermSheet(dealId, termSheetUpdates) {
    const deal = this.findById(dealId);
    if (!deal) return null;

    // If status is transitioning to locked, ensure handoverOtp exists
    if (termSheetUpdates.status === "locked" && !deal.handoverOtp && !termSheetUpdates.handoverOtp) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      termSheetUpdates.handoverOtp = otp;
      deal.handoverOtp = otp;
    }

    deal.termSheet = { ...deal.termSheet, ...termSheetUpdates };
    deal.updatedAt = Date.now();
    db.saveSync();
    return deal;
  },
};
