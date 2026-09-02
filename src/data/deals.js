import { PRODUCTS } from "./products.js";
import { genId } from "../utils/helpers.js";

const now = Date.now();

export const seedDeal = ({ id, product, buyerName, offers }) => {
  const messages = [
    {
      id: genId("m"),
      sender: "system",
      type: "text",
      text: `Negotiation opened for ${product.name}.`,
      timestamp: now - offers.length * 55 * 60000 - 60000,
    },
  ];
  offers.forEach((o, i) => {
    messages.push({
      id: genId("m"),
      sender: o.sender,
      type: "offer",
      timestamp: now - (offers.length - i) * 50 * 60000,
      offer: {
        unitPrice: o.unitPrice,
        leadTimeDays: o.leadTimeDays,
        status: i === offers.length - 1 ? "proposed" : "superseded",
        previousUnitPrice: i === 0 ? null : offers[i - 1].unitPrice,
      },
    });
    if (o.note) {
      messages.push({
        id: genId("m"),
        sender: o.sender,
        type: "text",
        text: o.note,
        timestamp: now - (offers.length - i) * 50 * 60000 + 60000,
      });
    }
  });
  const last = offers[offers.length - 1];
  return {
    id,
    product,
    buyerName,
    sellerName: product.supplier,
    targetMarginPct: 0.22,
    messages,
    termSheet: {
      unitPrice: last.unitPrice,
      leadTimeDays: last.leadTimeDays,
      status: "proposed",
      expiresAt: now + 90 * 60000,
      lastProposedBy: last.sender,
    },
    createdAt: now - offers.length * 55 * 60000 - 60000,
  };
};

export const INITIAL_DEALS = [
  seedDeal({
    id: "D-1001",
    product: PRODUCTS.find((p) => p.id === "P-200") || PRODUCTS[0], // MacBook Air M1
    buyerName: "Tanmay V.",
    offers: [
      { sender: "buyer", unitPrice: 36000, leadTimeDays: 3, note: "Hey! Can you do ₹36,000? I can pick it up tomorrow in Indiranagar with cash/UPI." },
      { sender: "seller", unitPrice: 39500, leadTimeDays: 2, note: "Hi! ₹36k is a bit low since battery health is 91% and includes 6-mo warranty. Best I can do is ₹39,500." },
      { sender: "buyer", unitPrice: 38000, leadTimeDays: 2, note: "Could we meet halfway at ₹38,000? Ready to lock now." },
    ],
  }),
  seedDeal({
    id: "D-1002",
    product: PRODUCTS.find((p) => p.id === "P-701") || PRODUCTS[1], // Honda Activa 6G
    buyerName: "Suresh Patil",
    offers: [
      { sender: "buyer", unitPrice: 41000, leadTimeDays: 4, note: "Interested in the Activa. If RC transfer and insurance are all clear, offering ₹41,000." },
    ],
  }),
  seedDeal({
    id: "D-1003",
    product: PRODUCTS.find((p) => p.id === "P-101") || PRODUCTS[0], // iPhone 13 Pro
    buyerName: "Aman Gupta",
    offers: [
      { sender: "buyer", unitPrice: 29000, leadTimeDays: 2 },
      { sender: "seller", unitPrice: 32500, leadTimeDays: 2, note: "Original bill and box are included, tempered glass is already installed." },
      { sender: "buyer", unitPrice: 30500, leadTimeDays: 2 },
      { sender: "seller", unitPrice: 31200, leadTimeDays: 2, note: "₹31,200 is my bottom line and I will ship it today." },
    ],
  }),
];
