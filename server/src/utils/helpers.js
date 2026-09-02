export function genId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function marginPct(unitPrice, cost) {
  if (!unitPrice || unitPrice <= 0 || cost == null) return 0;
  return (unitPrice - cost) / unitPrice;
}

export function marginHealth(actualMargin, targetMargin = 0.22) {
  if (actualMargin == null) return "critical";
  if (actualMargin < 0.08) return "critical";
  if (actualMargin < targetMargin * 0.75) return "low";
  if (actualMargin < targetMargin) return "warn";
  return "healthy";
}

export function getStage(deal) {
  const status = deal?.termSheet?.status;
  if (status === "locked") return "Closed/Won";
  if (status === "declined") return "Closed/Lost";
  if (status === "countered" || status === "proposed") {
    if (deal.messages && deal.messages.length > 2) return "In Negotiation";
    return "New Requests";
  }
  return "In Negotiation";
}
