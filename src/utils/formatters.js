export const fmtINR = (n, opts = {}) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0, ...opts }).format(n || 0);

export const fmtInt = (n) => new Intl.NumberFormat("en-IN").format(Math.round(n || 0));

export const pad2 = (n) => String(n).padStart(2, "0");
