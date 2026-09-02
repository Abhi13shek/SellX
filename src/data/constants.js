import { Smartphone, CreditCard, Landmark, MapPin, Building, Shield } from "lucide-react";

export const SORT_OPTIONS = [
  { id: "default", label: "Featured" },
  { id: "distance-asc", label: "Distance: Nearest First" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "lead-asc", label: "Lead time: Fastest" },
];

export const CITIES = [
  { id: "all", name: "All Locations", short: "All India" },
  { id: "blr", name: "Bengaluru", short: "BLR", localities: ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield", "Jayanagar"] },
  { id: "mum", name: "Mumbai", short: "MUM", localities: ["Bandra West", "Andheri", "Powai", "Juhu", "Colaba"] },
  { id: "del", name: "Delhi NCR", short: "DEL", localities: ["Hauz Khas", "Connaught Place", "Cyber City", "Saket", "Noida"] },
  { id: "hyd", name: "Hyderabad", short: "HYD", localities: ["Hitec City", "Gachibowli", "Jubilee Hills", "Banjara Hills"] },
  { id: "pune", name: "Pune", short: "PUN", localities: ["Koregaon Park", "Kothrud", "Viman Nagar", "Baner"] },
];

export const SAFE_MEETUP_ZONES = [
  {
    id: "metro",
    name: "CCTV Monitored Metro Station Exit",
    type: "Public Transit Hub",
    description: "Well-lit entrance with security personnel and active CCTV cameras.",
    badge: "Verified Safe Zone",
  },
  {
    id: "kiosk",
    name: "Police / Traffic Assistance Kiosk",
    type: "Official Safety Point",
    description: "Designated community exchange point near local traffic beat kiosk.",
    badge: "Maximum Security",
  },
  {
    id: "cafe",
    name: "Partner Cafe / Co-working Lobby",
    type: "High Footfall Public Spot",
    description: "Safe public area with seating, Wi-Fi, and power outlets to test electronics.",
    badge: "Power & Wi-Fi Available",
  },
];

export const STAGES = ["New Requests", "In Negotiation", "Pending Acceptance", "Closed/Won"];

export const QUICK_REPLIES = [
  "Thanks for the offer — reviewing internally now.",
  "This is close to our floor price at this volume.",
  "We can hold this rate if you commit today.",
  "Happy to lock this in today if terms work for you.",
];

export const IMAGE_RATIOS = [
  { key: "4:3", value: "4 / 3", label: "4:3" },
  { key: "1:1", value: "1 / 1", label: "1:1" },
  { key: "16:9", value: "16 / 9", label: "16:9" },
  { key: "3:4", value: "3 / 4", label: "3:4" },
];

export const PAYMENT_METHODS = [
  { key: "upi", label: "UPI", icon: Smartphone, hint: "Pay via any UPI app" },
  { key: "card", label: "Card", icon: CreditCard, hint: "Credit or debit card" },
  { key: "netbanking", label: "Net Banking", icon: Landmark, hint: "Pay via your bank" },
];

export const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
];

export const FOOTER_LINKS = {
  Platform: ["Catalog", "Trade Desk", "Deal Room", "Pricing"],
  Resources: ["Help Center", "Negotiation Guide", "API Docs", "Trust & Safety"],
  Company: ["About", "Careers", "Contact", "Press"],
};

export const SELLER_PERKS = [
  "Live profit-margin intelligence on every counter-offer",
  "Direct, unmediated negotiation with verified buyers",
  "24-hour locked checkout links the moment a deal closes",
];
