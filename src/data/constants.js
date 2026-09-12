import { Smartphone, CreditCard, Landmark, MapPin, Sparkles, ShieldCheck } from "lucide-react";

export const CITIES = [
  "All India",
  "Bangalore",
  "Mumbai",
  "Delhi NCR",
  "Pune",
  "Hyderabad",
];

export const CONDITIONS = [
  "All",
  "Mint / Like New",
  "Like New",
  "Gently Used",
  "Good Condition",
];

export const SORT_OPTIONS = [
  { id: "default", label: "Recommended" },
  { id: "distance-asc", label: "Nearest Distance" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "lead-asc", label: "Pickup: Fastest" },
];

export const STAGES = ["Incoming Offers", "Active Bargains", "Agreed / Handover Pending", "Completed Deals"];

export const QUICK_REPLIES = [
  "Can do this price if you can pick it up today.",
  "Original box and bill are included in this price.",
  "Let's meet halfway and lock this deal right now.",
  "Can you do cash or UPI on spot inspection?",
  "I can meet at Indiranagar Metro Station this evening.",
];

export const BUYER_QUICK_OFFERS = [
  { label: "-5%", pct: 0.95 },
  { label: "-10%", pct: 0.90 },
  { label: "-15%", pct: 0.85 },
];

export const PAYMENT_METHODS = [
  { key: "upi", label: "Instant UPI (GPay / PhonePe / Paytm)", icon: Smartphone, hint: "Safe escrow hold until handover" },
  { key: "card", label: "Credit / Debit Card", icon: CreditCard, hint: "Visa, Mastercard, RuPay" },
  { key: "netbanking", label: "Net Banking", icon: Landmark, hint: "All major Indian banks" },
];

export const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
];

export const FOOTER_LINKS = {
  Marketplace: ["Browse All Ads", "Post an Ad (Sell)", "Bargain Room", "Local Meetups"],
  "Trust & Safety": ["Handover Passcode System", "Escrow Protection", "Buyer Safety Guide", "Report Scam"],
  Company: ["About SellX", "Recommerce Mission", "Contact Support", "Careers"],
};

export const SELLER_PERKS = [
  "Direct 1-on-1 chat & instant bargaining with verified local buyers",
  "Smart auto-accept price bot saves time on back-and-forth messages",
  "Secure 4-digit Handover OTP protects you from fraudulent pickups",
];
