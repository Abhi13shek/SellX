let uidCounter = 1;

export const genId = (prefix) =>
  `${prefix}-${(uidCounter++).toString(36)}${Date.now().toString(36).slice(-4)}`;

export function getStage(deal) {
  if (deal.termSheet.status === "locked") return "Closed/Won";
  if (deal.termSheet.status === "declined") return "Closed/Won";
  const offerCount = deal.messages.filter((m) => m.type === "offer").length;
  if (offerCount <= 1) return "New Requests";
  if (offerCount >= 4) return "Pending Acceptance";
  return "In Negotiation";
}

export function marginPct(unitPrice, cost) {
  if (!unitPrice) return 0;
  return (unitPrice - cost) / unitPrice;
}

export function marginHealth(unitPrice, cost, targetPct) {
  const m = marginPct(unitPrice, cost);
  if (m < 0) return { level: "critical", label: "Below cost", m };
  if (m < targetPct * 0.6) return { level: "low", label: "Below floor", m };
  if (m < targetPct) return { level: "warn", label: "Below target", m };
  return { level: "healthy", label: "Healthy margin", m };
}
