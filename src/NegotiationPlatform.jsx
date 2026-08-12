import React, { useState, useEffect, useRef, useMemo, useId } from "react";
import {
  Bell, ChevronDown, ChevronRight,
  X, Send, TrendingUp, TrendingDown, Sparkles, ShieldCheck, Clock, IndianRupee,
  CheckCircle2, XCircle, ArrowLeftRight, Lock, Plus, Minus, FileText,
  Paperclip, MessageSquare, Gauge, AlertTriangle, Copy, ExternalLink, Timer, User,
  Store, LayoutGrid, ListChecks, BadgeCheck,
  Building2, ShoppingCart, Sun, Moon, Info, Check, ArrowLeft,
  Car, Laptop, Smartphone, Tablet, Watch, Headphones, Monitor, Camera,
  Mail, Globe, Linkedin, Github, Eye, EyeOff, Loader2, LogOut, KeyRound,
  Filter, Search, ImagePlus, PackagePlus, RotateCcw, CreditCard, Landmark, Wallet,
} from "lucide-react";

/* ============================================================================
   SellX — Direct Buyer↔Seller Trade Desk
   Single-file production-grade demo component.
   ========================================================================== */

/* ----------------------------- Design tokens ----------------------------- */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  .sellx-root{
    /* True dark palette — page/card/elevated surfaces step up in lightness,
       off-white body text, and a GitHub-style light-blue accent for
       "Negotiate" buttons and links. */
    --ink:#121212; --surface:#1e1e1e; --surface2:#2d2d2d; --surface3:#262626;
    --line:#333333; --line-soft:#2a2a2a; --paper:#e1e1e1; --mist:#8b949e; --mist-dim:#6e6e6e;
    /* Primary accent (buyer/negotiate): light blue, brightens on hover */
    --teal:#58a6ff; --teal-dim:#79c0ff; --brass:#5379AE; --brass-dim:#06457F; --brass-text:#06457F;
    --green:#84A96E; --red:#D0765C; --amber:#D2A657; --navy:#58a6ff;
    --on-teal:#0d1117; --on-brass:#F5F8FF; --on-green:#17240F; --on-red:#2E1109;
    --price:#ffffff;
    --shadow: 0 12px 40px -12px rgba(0,0,0,0.55);
    color-scheme: dark;
  }
  .sellx-root.light{
    /* Editorial palette — strict brief, applied literally:
       bg #F7FAFF beige · surfaces #FFFFFF / #DCEAF8 tan · text #262B40 charcoal ·
       borders #A8C4EC taupe · accents Neptune buyer #0474C4 / seller #5379AE. */
    --ink:#F7FAFF; --surface:#FFFFFF; --surface2:#E8F1FB; --surface3:#DCEAF8;
    --line:#A8C4EC; --line-soft:#C5D5EA; --paper:#262B40; --mist:#5379AE; --mist-dim:#6E829A;
    /* Sapphire Nightfall — buyer: bright blue/light blue, seller: sapphire/deep blue */
    --teal:#0474C4; --teal-dim:#A8C4EC; --brass:#5379AE; --brass-dim:#06457F; --brass-text:#06457F;
    --green:#4C6B3B; --red:#9C4934; --amber:#7A5620; --navy:#A8C4EC;
    --on-teal:#0B2E38; --on-brass:#F5F8FF; --on-green:#FBF7F2; --on-red:#FBF7F2;
    --price:#262B40;
    --shadow: 0 12px 32px -14px rgba(102,97,97,0.18);
    color-scheme: light;
  }
  .font-display{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; letter-spacing:-0.02em; }
  .sx-wordmark{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; font-weight:800; letter-spacing:-0.025em; }
  .font-body{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; }
  .font-mono{ font-family:'IBM Plex Mono', ui-monospace, monospace; }

  .sellx-root ::-webkit-scrollbar{ width:8px; height:8px; }
  .sellx-root ::-webkit-scrollbar-track{ background:transparent; }
  .sellx-root ::-webkit-scrollbar-thumb{ background:var(--line); border-radius:8px; }

  @keyframes sellx-pulse{ 0%,100%{ opacity:1 } 50%{ opacity:.35 } }
  .sellx-pulse{ animation: sellx-pulse 1.8s ease-in-out infinite; }

  @keyframes sellx-rise{ from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:translateY(0);} }
  .sellx-rise{ animation: sellx-rise .28s ease-out both; }

  @keyframes sellx-pop{ from{ opacity:0; transform:scale(.94);} to{ opacity:1; transform:scale(1);} }
  .sellx-pop{ animation: sellx-pop .22s cubic-bezier(.2,.9,.3,1.2) both; }

  @keyframes sellx-stamp{ 0%{ opacity:0; transform: scale(2.2) rotate(-14deg);} 60%{ opacity:1; transform: scale(0.94) rotate(-8deg);} 100%{ opacity:1; transform: scale(1) rotate(-8deg);} }
  .sellx-stamp{ animation: sellx-stamp .5s cubic-bezier(.2,.8,.3,1.1) both; }

  .sellx-ticket{
    position:relative;
    border:1px dashed var(--line);
    background: var(--surface2);
  }
  .sellx-ticket::before, .sellx-ticket::after{
    content:""; position:absolute; width:14px; height:14px; border-radius:999px;
    background: var(--ink); top:50%; transform:translateY(-50%);
  }
  .sellx-ticket::before{ left:-8px; }
  .sellx-ticket::after{ right:-8px; }

  .tabular-nums{ font-variant-numeric: tabular-nums; }

  @media (prefers-reduced-motion: reduce){
    .sellx-pulse, .sellx-rise, .sellx-pop, .sellx-stamp{ animation:none !important; }
  }
`;

/* --------------------------------- Data ---------------------------------- */

/* Category colour system — each category gets a distinct accent used across
   catalog cards, deal icons, and the footer legend. Every tint is a shade
   within the editorial family (charcoal, taupe, tan, lavender) so new
   categories never introduce an off-brief hue. */
const CATEGORY_STYLES = {
  Vehicles: "#06457F", // deep plum (darkened lavender — keeps AA contrast as text)
  Computing: "#5379AE", // slate violet
  Mobile: "#A8C4EC", // slate blue-grey
  Wearables: "#0474C4", // terracotta rust
  Audio: "#5379AE", // chestnut
  Photography: "#06457F", // deep espresso
};

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255, g = (int >> 8) & 255, b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const catColor = (category) => CATEGORY_STYLES[category] || "#5379AE";

const PRODUCTS = [
  {
    id: "P-100", sku: "VEH-EV-SDN", name: "Compact Electric Fleet Sedan",
    category: "Vehicles", icon: Car,
    image: "https://loremflickr.com/1600/1200/sedan,car,electricvehicle/all?lock=1001",
    basePrice: 2250000, cost: 1900000, leadTimeDays: 45,
    supplier: "Voltra Motors",
    description: "320-mile range, telematics-ready, fully loaded electric sedan. Comes with a 3-year service plan and OTA software updates.",
    highlights: ["320 mi range · single charge", "Telematics & fleet-ready hardware", "3-year service plan included"],
  },
  {
    id: "P-200", sku: "LPT-ULT-14", name: "Business Ultrabook 14\"",
    category: "Computing", icon: Laptop,
    image: "https://loremflickr.com/1600/1200/laptop,notebook,keyboard/all?lock=1002",
    basePrice: 92000, cost: 64000, leadTimeDays: 20,
    supplier: "NimbusTech",
    description: "A 14\" ultrabook built for all-day work — 32GB RAM, 1TB SSD, and an MDM-ready image out of the box.",
    highlights: ["32GB RAM · 1TB SSD", "18-hour battery life", "MDM-preloaded, ready to deploy"],
  },
  {
    id: "P-300", sku: "MOB-5G-FLG", name: "5G Flagship Smartphone",
    category: "Mobile", icon: Smartphone,
    image: "https://loremflickr.com/1600/1200/smartphone,mobilephone/all?lock=1003",
    basePrice: 52000, cost: 34000, leadTimeDays: 15,
    supplier: "Halcyon Devices",
    description: "A 6.5\" flagship handset with dual-SIM support, carrier-unlocked and ready to use anywhere.",
    highlights: ["6.5\" flagship display", "Dual-SIM, carrier unlocked", "5G, fast charging"],
  },
  {
    id: "P-400", sku: "WBL-SW-HLT", name: "Smartwatch (Health Edition)",
    category: "Wearables", icon: Watch,
    image: "https://loremflickr.com/1600/1200/smartwatch,wristwatch/all?lock=1004",
    basePrice: 11900, cost: 7500, leadTimeDays: 18,
    supplier: "Pulseline Wearables",
    description: "Track what matters — ECG, SpO2, and sleep, in a watch that lasts 10 days on a single charge.",
    highlights: ["ECG + SpO2 tracking", "10-day battery life", "5ATM water resistance"],
  },
  {
    id: "P-500", sku: "AUD-ANC-OE", name: "Noise-Cancelling Headphones",
    category: "Audio", icon: Headphones,
    image: "https://loremflickr.com/1600/1200/headphones,earphones/all?lock=1005",
    basePrice: 7200, cost: 4200, leadTimeDays: 14,
    supplier: "Aurora Audio",
    description: "Over-ear active noise cancellation with a 40-hour battery, tuned for long listening sessions.",
    highlights: ["Active noise cancellation", "40-hour battery life", "Plush over-ear comfort"],
  },
  {
    id: "P-600", sku: "CPT-4K-27", name: "27\" 4K Monitor",
    category: "Computing", icon: Monitor,
    image: "https://loremflickr.com/1600/1200/computermonitor,screen/all?lock=1006",
    basePrice: 25500, cost: 17200, leadTimeDays: 22,
    supplier: "NimbusTech",
    description: "A crisp 27\" 4K IPS panel with 90W USB-C passthrough — one cable for power, video, and data.",
    highlights: ["27\" 4K IPS panel", "90W USB-C passthrough", "VESA mount compatible"],
  },
  {
    id: "P-700", sku: "PHT-MIR-KIT", name: "Mirrorless Camera Kit",
    category: "Photography", icon: Camera,
    image: "https://loremflickr.com/1600/1200/mirrorlesscamera,camera/all?lock=1007",
    basePrice: 73000, cost: 52000, leadTimeDays: 25,
    supplier: "Lucent Optics",
    description: "A full-frame mirrorless body paired with a versatile 24-70mm kit lens, ready for studio or the field.",
    highlights: ["Full-frame sensor", "24-70mm kit lens included", "4K video, in-body stabilization"],
  },
  {
    id: "P-800", sku: "CPT-TAB-11", name: "Compact Tablet 11\"",
    category: "Computing", icon: Tablet,
    image: "https://loremflickr.com/1600/1200/tablet,ipad,stylus/all?lock=8021",
    basePrice: 34500, cost: 23800, leadTimeDays: 16,
    supplier: "NimbusTech",
    description: "An 11\" tablet with stylus support and an optional rugged case, built for work on the move.",
    highlights: ["Stylus support included", "Rugged case option", "All-day battery life"],
  },
  {
    id: "P-900", sku: "VEH-EV-SUV", name: "Electric Fleet SUV",
    category: "Vehicles", icon: Car,
    image: "https://loremflickr.com/1600/1200/suv,electricvehicle,car/all?lock=1009",
    basePrice: 3150000, cost: 2680000, leadTimeDays: 50,
    supplier: "Voltra Motors",
    description: "A 7-seat electric SUV built for fleet duty — 280-mile range, tow-rated, with the same telematics package as the sedan line.",
    highlights: ["280 mi range · 7-seat layout", "Tow-rated, fleet telematics", "3-year service plan included"],
  },
  {
    id: "P-1000", sku: "CPT-DSK-TWR", name: "Workstation Desktop Tower",
    category: "Computing", icon: Monitor,
    image: "https://loremflickr.com/1600/1200/desktopcomputer,workstation/all?lock=1010",
    basePrice: 138000, cost: 96000, leadTimeDays: 28,
    supplier: "NimbusTech",
    description: "A tower workstation with a discrete GPU and ECC memory, sized for CAD, rendering, and heavier compute loads.",
    highlights: ["Discrete GPU · ECC memory", "Tool-less chassis for upgrades", "3-year on-site warranty"],
  },
  {
    id: "P-1100", sku: "MOB-RGD-FLD", name: "Rugged Field Phone",
    category: "Mobile", icon: Smartphone,
    image: "https://loremflickr.com/1600/1200/ruggedphone,militaryphone/all?lock=8022",
    basePrice: 38500, cost: 26000, leadTimeDays: 17,
    supplier: "Halcyon Devices",
    description: "A MIL-STD-810H rated handset built for outdoor and field-service teams, with a swappable battery and glove-friendly display.",
    highlights: ["MIL-STD-810H rated", "Swappable battery", "Glove-friendly touchscreen"],
  },
  {
    id: "P-1200", sku: "AUD-CNF-SPK", name: "Conference Room Speakerphone",
    category: "Audio", icon: Headphones,
    image: "https://loremflickr.com/1600/1200/speakerphone,conferencephone/all?lock=8023",
    basePrice: 16800, cost: 10500, leadTimeDays: 12,
    supplier: "Aurora Audio",
    description: "A 360° pickup speakerphone for mid-size rooms, with noise suppression and USB-C / Bluetooth pairing.",
    highlights: ["360° mic pickup", "AI noise suppression", "USB-C & Bluetooth pairing"],
  },
];

let uidCounter = 1;
const genId = (prefix) => `${prefix}-${(uidCounter++).toString(36)}${Date.now().toString(36).slice(-4)}`;

const now = Date.now();

const seedDeal = ({ id, product, buyerName, offers, notes }) => {
  const messages = [
    {
      id: genId("m"),
      sender: "system",
      type: "text",
      text: `Offer opened for ${product.name}.`,
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
    targetMarginPct: 0.24,
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

const INITIAL_DEALS = [
  seedDeal({
    id: "D-1001",
    product: PRODUCTS[1], // Business Ultrabook
    buyerName: "Northbridge Robotics",
    offers: [
      { sender: "buyer", unitPrice: 78000, leadTimeDays: 25, note: "Hoping pricing can land closer to ₹78,000 for this unit." },
      { sender: "seller", unitPrice: 88000, leadTimeDays: 20, note: "Appreciate the interest. ₹78,000 is below our floor — here's our best counter." },
      { sender: "buyer", unitPrice: 82500, leadTimeDays: 20, note: "Could you meet us closer to ₹82,500?" },
    ],
  }),
  seedDeal({
    id: "D-1002",
    product: PRODUCTS[0], // Electric Fleet Sedan
    buyerName: "Atlas Logistics Group",
    offers: [
      { sender: "buyer", unitPrice: 2100000, leadTimeDays: 40, note: "First order with you — hoping to build a long-term relationship." },
    ],
  }),
  seedDeal({
    id: "D-1003",
    product: PRODUCTS[2], // 5G Flagship Smartphone
    buyerName: "GreenPack Retail Group",
    offers: [
      { sender: "buyer", unitPrice: 45000, leadTimeDays: 15 },
      { sender: "seller", unitPrice: 50000, leadTimeDays: 12 },
      { sender: "buyer", unitPrice: 47500, leadTimeDays: 12 },
      { sender: "seller", unitPrice: 48500, leadTimeDays: 12, note: "This is close to a clean deal — ₹48,500 works if we lock it in today." },
    ],
  }),
];




const QUICK_REPLIES = [
  "Thanks for the offer — reviewing internally now.",
  "This is close to our floor price at this volume.",
  "We can hold this rate if you commit today.",
  "Happy to lock this in today if terms work for you.",
];

/* -------------------------------- Helpers -------------------------------- */

const fmtINR = (n, opts = {}) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0, ...opts }).format(n || 0);

const fmtInt = (n) => new Intl.NumberFormat("en-IN").format(Math.round(n || 0));

const pad2 = (n) => String(n).padStart(2, "0");

function useTick(intervalMs = 1000) {
  const [, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

function useCountdown(targetTs) {
  useTick(1000);
  const remaining = Math.max(0, (targetTs || 0) - Date.now());
  const hh = Math.floor(remaining / 3600000);
  const mm = Math.floor((remaining % 3600000) / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  const label = hh > 0 ? `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}` : `${pad2(mm)}:${pad2(ss)}`;
  return { remaining, label, expired: remaining <= 0 };
}

function getStage(deal) {
  if (deal.termSheet.status === "locked") return "Closed/Won";
  if (deal.termSheet.status === "declined") return "Closed/Won";
  const offerCount = deal.messages.filter((m) => m.type === "offer").length;
  if (offerCount <= 1) return "New Requests";
  if (offerCount >= 4) return "Pending Acceptance";
  return "In Negotiation";
}

function marginPct(unitPrice, cost) {
  if (!unitPrice) return 0;
  return (unitPrice - cost) / unitPrice;
}

function marginHealth(unitPrice, cost, targetPct) {
  const m = marginPct(unitPrice, cost);
  if (m < 0) return { level: "critical", label: "Below cost", m };
  if (m < targetPct * 0.6) return { level: "low", label: "Below floor", m };
  if (m < targetPct) return { level: "warn", label: "Below target", m };
  return { level: "healthy", label: "Healthy margin", m };
}

const healthColor = {
  critical: "var(--red)",
  low: "var(--red)",
  warn: "var(--amber)",
  healthy: "var(--green)",
};

/* ------------------------------ Small atoms ------------------------------- */

function Badge({ children, tone = "neutral", className = "", style }) {
  const tones = {
    neutral: "bg-[var(--surface3)] text-[var(--mist)] border-[var(--line)]",
    teal: "bg-[var(--teal)]/10 text-[var(--navy)] border-[var(--teal)]/30",
    brass: "bg-[var(--brass)]/10 text-[var(--brass-text)] border-[var(--brass)]/30",
    green: "bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/30",
    red: "bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/30",
    amber: "bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/30",
    custom: "",
  };
  return (
    <span style={style} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide uppercase ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

function CategoryBadge({ category, className = "" }) {
  const c = catColor(category);
  return (
    <Badge tone="custom" className={className} style={{ background: hexToRgba(c, 0.12), color: c, borderColor: hexToRgba(c, 0.35) }}>
      {category}
    </Badge>
  );
}

function IconWrap({ Icon, tone = "neutral", size = "md", style }) {
  const tones = {
    neutral: "bg-[var(--surface3)] text-[var(--mist)]",
    teal: "bg-[var(--teal)]/12 text-[var(--navy)]",
    brass: "bg-[var(--brass)]/12 text-[var(--brass-text)]",
    custom: "",
  };
  const sizes = { sm: "w-7 h-7", md: "w-10 h-10", lg: "w-12 h-12" };
  const iconSizes = { sm: 14, md: 18, lg: 22 };
  return (
    <div style={style} className={`flex items-center justify-center rounded-xl ${tones[tone]} ${sizes[size]}`}>
      <Icon size={iconSizes[size]} strokeWidth={2} />
    </div>
  );
}

function CategoryIcon({ category, Icon, size = "md" }) {
  const c = catColor(category);
  return <IconWrap Icon={Icon} tone="custom" size={size} style={{ background: hexToRgba(c, 0.14), color: c }} />;
}

/* Tap-to-cycle aspect ratios for product photography. Order chosen so the
   default (4:3) is a natural, mostly-square starting point for catalog
   cards, with wider/taller/square options a tap away. */
const IMAGE_RATIOS = [
  { key: "4:3", value: "4 / 3", label: "4:3" },
  { key: "1:1", value: "1 / 1", label: "1:1" },
  { key: "16:9", value: "16 / 9", label: "16:9" },
  { key: "3:4", value: "3 / 4", label: "3:4" },
];

/* Product image tile — a textured, category-tinted illustration used wherever
   a real product photo would normally sit (catalog cards, cart thumbnails).
   When a real photo is present and the tile is interactive (size="lg"),
   tapping the image cycles through a few common aspect ratios. */
function ProductImageTile({ category, Icon, image, size = "lg", interactiveRatio = true }) {
  const c = catColor(category);
  const [ratioIdx, setRatioIdx] = useState(0);
  const ratio = IMAGE_RATIOS[ratioIdx];
  const canCycle = interactiveRatio && size === "lg" && !!image;

  const dims = { sm: "h-14 w-14 rounded-lg", lg: "w-full rounded-xl" };
  const iconSize = { sm: 22, lg: 52 };

  const cycleRatio = (e) => {
    e.stopPropagation();
    setRatioIdx((i) => (i + 1) % IMAGE_RATIOS.length);
  };

  if (image) {
    return (
      <div
        className={`relative overflow-hidden shrink-0 ${dims[size]} group/img`}
        style={size === "lg" ? { aspectRatio: ratio.value, transition: "aspect-ratio .25s ease" } : undefined}
      >
        <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
        {canCycle && (
          <button
            type="button"
            onClick={cycleRatio}
            aria-label={`Change photo aspect ratio (currently ${ratio.label})`}
            title="Change aspect ratio"
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white text-[10px] font-mono opacity-0 group-hover/img:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ArrowLeftRight size={10} className="rotate-45" />
            {ratio.label}
          </button>
        )}
      </div>
    );
  }
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center shrink-0 ${dims[size]}`}
      style={{ background: `linear-gradient(135deg, ${hexToRgba(c, 0.24)}, ${hexToRgba(c, 0.06)})`, ...(size === "lg" ? { aspectRatio: "4 / 3" } : {}) }}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{ backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`, backgroundSize: size === "lg" ? "14px 14px" : "8px 8px" }}
      />
      <Icon size={iconSize[size]} strokeWidth={1.5} style={{ color: c }} className="relative z-10" />
    </div>
  );
}

/* Brand mark — interlocking "X" glyph in the SellX identity lavender, fixed
   across both themes (a logo's colours shouldn't invert with dark mode). */
function BrandMark({ size = "md", wordmark = true }) {
  const gradId = useId();
  const dims = { sm: 26, md: 34, lg: 56, xl: 84 };
  const px = dims[size] || dims.md;
  const textSizes = { sm: "text-sm", md: "text-[15px]", lg: "text-2xl", xl: "text-4xl" };
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <svg width={px} height={px} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`sx-grad-${gradId}`} x1="4" y1="4" x2="30" y2="44">
            <stop offset="0%" stopColor="#0474C4" />
            <stop offset="100%" stopColor="#06457F" />
          </linearGradient>
        </defs>
        <path d="M6 6 L24 24 L6 42" stroke={`url(#sx-grad-${gradId})`} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M42 6 L24 24 L42 42" stroke="#A8C4EC" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.88" />
      </svg>
      {wordmark && (
        <span className={`sx-wordmark ${textSizes[size] || textSizes.md} leading-none`}>
          <span style={{ color: "var(--paper)" }}>Sell</span>
          <span style={{ background: "linear-gradient(135deg,#0474C4,#06457F)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>X</span>
        </span>
      )}
    </div>
  );
}

function PrimaryButton({ children, onClick, icon: Icon, tone = "teal", disabled, className = "", type = "button" }) {
  const tones = {
    teal: "bg-[var(--teal)] text-[var(--on-teal)] hover:bg-[var(--teal-dim)]",
    brass: "bg-[var(--brass)] text-[var(--on-brass)] hover:brightness-110",
    green: "bg-[var(--green)] text-[var(--on-green)] hover:brightness-110",
    red: "bg-[var(--red)] text-white hover:brightness-110",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] hover:-translate-y-px hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ${tones[tone]} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={2.4} />}
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon, disabled, className = "", tone = "default", type = "button" }) {
  const toneClass =
    tone === "danger" ? "text-[var(--red)] border-[var(--red)]/30 hover:bg-[var(--red)]/10" :
    tone === "success" ? "text-[var(--navy)] border-[var(--teal)]/40 bg-[var(--teal)]/8 hover:bg-[var(--teal)]/14" :
    "text-[var(--paper)] border-[var(--line)] hover:bg-[var(--surface3)]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-[0.98] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${toneClass} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={2.4} />}
      {children}
    </button>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">{children}</label>
      {hint && <span className="text-[11px] text-[var(--mist-dim)] font-mono">{hint}</span>}
    </div>
  );
}

/* --------------------------------- Header --------------------------------- */

function Header({ role, setRole, theme, setTheme, stats, cartCount, onOpenCart, onOpenNotifications, unreadCount, activeTab, setActiveTab, sellerAuthed, onSignOut }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--ink)]/85 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <BrandMark size="md" wordmark={false} />
            <div className="hidden sm:block leading-tight">
              <div className="sx-wordmark text-[15px] leading-none text-[var(--paper)]">
                Sell<span style={{ background: "linear-gradient(135deg,#0474C4,#06457F)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>X</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--mist-dim)] mt-0.5">Trade Desk</div>
            </div>
            <span className="hidden md:inline-flex items-center gap-1.5 ml-2 px-2 py-1 rounded-full border border-[var(--line)] text-[11px] text-[var(--mist)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] sellx-pulse" />
              Live desk
            </span>
          </div>

          {/* Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--surface)] border border-[var(--line)] rounded-xl p-1">
            {role === "buyer" && (
              <TabButton active={activeTab === "catalog"} onClick={() => setActiveTab("catalog")} icon={LayoutGrid} label="Catalog" />
            )}
            {role === "seller" && (
              <TabButton active={activeTab === "desk"} onClick={() => setActiveTab("desk")} icon={ListChecks} label="Trade Desk" />
            )}
            <TabButton active={activeTab === "dealroom"} onClick={() => setActiveTab("dealroom")} icon={MessageSquare} label="Deal Room" badge={stats.activeRFQs} />
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-4 mr-2 pr-4 border-r border-[var(--line)]">
              <StatPill label="Active RFQs" value={stats.activeRFQs} />
              <StatPill label="Locked Deals" value={stats.lockedDeals} tone="green" />
              <StatPill
                label={role === "buyer" ? "Total Savings" : "Total Margin"}
                value={fmtINR(role === "buyer" ? stats.totalSavings : stats.totalMargin, { maximumFractionDigits: 0 })}
                tone="brass"
              />
            </div>

            {role === "buyer" && (
              <button
                onClick={onOpenCart}
                className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] transition-colors"
              >
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--teal)] text-[var(--on-teal)] text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] transition-colors"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[var(--red)] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] transition-colors"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Role switcher */}
            <div className="relative flex items-center bg-[var(--surface)] border border-[var(--line)] rounded-xl p-1 ml-1">
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-[var(--surface3)] border border-[var(--line)] transition-transform duration-300 ease-out"
                style={{ transform: role === "buyer" ? "translateX(0%)" : "translateX(calc(100% + 4px))" }}
              />
              <button
                onClick={() => setRole("buyer")}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${role === "buyer" ? "text-[var(--navy)]" : "text-[var(--mist)]"}`}
              >
                <User size={13} /> <span className="hidden sm:inline">Buyer</span>
              </button>
              <button
                onClick={() => setRole("seller")}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${role === "seller" ? "text-[var(--brass-text)]" : "text-[var(--mist)]"}`}
              >
                <Store size={13} /> <span className="hidden sm:inline">Seller</span>
              </button>
            </div>

            {role === "seller" && sellerAuthed && (
              <button
                onClick={onSignOut}
                title="Sign out of seller account"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--red)] hover:border-[var(--red)]/30 transition-colors"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden items-center gap-1 pb-2 -mt-1">
          {role === "buyer" && (
            <TabButton active={activeTab === "catalog"} onClick={() => setActiveTab("catalog")} icon={LayoutGrid} label="Catalog" compact />
          )}
          {role === "seller" && (
            <TabButton active={activeTab === "desk"} onClick={() => setActiveTab("desk")} icon={ListChecks} label="Trade Desk" compact />
          )}
          <TabButton active={activeTab === "dealroom"} onClick={() => setActiveTab("dealroom")} icon={MessageSquare} label="Deal Room" badge={stats.activeRFQs} compact />
        </div>
      </div>
      <div
        className="h-[3px] w-full"
        style={{ background: `linear-gradient(90deg, #0474C4, #A8C4EC, #06457F)` }}
      />
    </header>
  );
}

function TabButton({ active, onClick, icon: Icon, label, badge, compact }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg font-semibold transition-colors ${compact ? "px-3 py-1.5 text-xs" : "px-3.5 py-1.5 text-sm"} ${
        active ? "bg-[var(--surface3)] text-[var(--paper)]" : "text-[var(--mist)] hover:text-[var(--paper)]"
      }`}
    >
      <Icon size={14} />
      {label}
      {badge > 0 && (
        <span className={`px-1.5 rounded-full text-[10px] font-bold ${active ? "bg-[var(--teal)] text-[var(--on-teal)]" : "bg-[var(--surface3)] text-[var(--mist)]"}`}>{badge}</span>
      )}
    </button>
  );
}

function StatPill({ label, value, tone = "default" }) {
  const toneClass = tone === "green" ? "text-[var(--green)]" : tone === "brass" ? "text-[var(--brass-text)]" : "text-[var(--paper)]";
  return (
    <div className="leading-tight">
      <div className={`font-mono font-semibold text-sm tabular-nums ${toneClass}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--mist-dim)]">{label}</div>
    </div>
  );
}

/* --------------------------- Notification drawer --------------------------- */

function NotificationDrawer({ open, onClose, notifications, role }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--surface)] border-l border-[var(--line)] shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--line)]">
          <h3 className="font-display font-semibold text-[var(--paper)]">Notifications</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)] p-3 space-y-2">
          {notifications.length === 0 && (
            <div className="text-center text-sm text-[var(--mist)] py-16">No notifications yet. Actions on deals will show up here.</div>
          )}
          {notifications.map((n) => (
            <div key={n.id} className="sellx-rise p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  <IconWrap Icon={n.icon} tone={n.tone === "brass" ? "brass" : "teal"} size="sm" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-[var(--paper)] leading-snug">{n.text}</div>
                  {role === "seller" && <div className="text-[11px] text-[var(--mist-dim)] mt-1 font-mono">{n.dealId || "System"}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CartDrawer({ open, onClose, items, onRemove, onClear, onGoToCatalog, onNegotiateItem }) {
  const subtotal = items.reduce((sum, product) => sum + product.basePrice, 0);
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--surface)] border-l border-[var(--line)] shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--line)] shrink-0">
          <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
            <ShoppingCart size={16} /> Cart <span className="text-xs font-mono text-[var(--mist-dim)] font-normal">({items.length})</span>
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--mist)]">Your cart is empty.</p>
              <p className="text-xs text-[var(--mist-dim)] mt-1 max-w-[220px] mx-auto leading-relaxed">Add items at list price, or open a negotiation to work out a better one.</p>
              <button onClick={onGoToCatalog} className="mt-3 text-sm font-semibold text-[var(--navy)] hover:underline">Browse the catalog</button>
            </div>
          )}
          {items.map((product) => (
            <div key={product.id} className="ledgr-rise group flex gap-3 p-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] hover:border-[var(--teal)]/40 transition-colors">
              <ProductImageTile category={product.category} Icon={product.icon} image={product.image} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-[var(--paper)] leading-snug truncate">{product.name}</div>
                  <button onClick={() => onRemove(product.id)} className="text-[var(--mist)] hover:text-[var(--red)] shrink-0">
                    <X size={14} />
                  </button>
                </div>
                <div className="text-xs font-mono text-[var(--mist-dim)] mt-0.5">{product.sku}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-mono font-semibold text-[var(--brass-text)]">{fmtINR(product.basePrice)}</span>
                  <button onClick={() => onNegotiateItem(product)} className="text-[11px] font-semibold text-[var(--navy)] hover:underline flex items-center gap-1">
                    <ArrowLeftRight size={11} /> Negotiate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--line)] shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-[var(--mist)]">Subtotal &middot; list price</span>
              <span className="font-mono text-lg font-bold text-[var(--price)] tabular-nums">{fmtINR(subtotal)}</span>
            </div>
            <p className="text-[11px] text-[var(--mist-dim)] leading-relaxed">
              Buy at list price, or open a negotiation on any item to agree on a better one.
            </p>
            <GhostButton onClick={onClear} className="w-full">Clear cart</GhostButton>
          </div>
        )}
      </div>
    </>
  );
}

/* --------------------------------- Catalog --------------------------------- */

const SORT_OPTIONS = [
  { id: "default", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "lead-asc", label: "Lead time: Fastest" },
];

function CatalogView({ products, onRequestQuote, onToggleCart, cartIds, onOpenProduct }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCats, setActiveCats] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const toggleCat = (cat) => setActiveCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  const resetFilters = () => { setSearch(""); setActiveCats([]); setSortBy("default"); };
  const filtersActive = search.trim() !== "" || activeCats.length > 0 || sortBy !== "default";

  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch = search.trim() === "" || p.name.toLowerCase().includes(search.trim().toLowerCase()) || p.category.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCat = activeCats.length === 0 || activeCats.includes(p.category);
      return matchesSearch && matchesCat;
    });
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    if (sortBy === "lead-asc") list = [...list].sort((a, b) => a.leadTimeDays - b.leadTimeDays);
    return list;
  }, [products, search, activeCats, sortBy]);

  return (
    <div className="sellx-rise">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)]">Sourcing catalog</h1>
          <p className="text-sm text-[var(--mist)] mt-1">Browse verified suppliers. Buy at list price, or open direct negotiation on any line item.</p>
        </div>
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
            filterOpen || filtersActive ? "bg-[var(--teal)]/12 border-[var(--teal)]/40 text-[var(--navy)]" : "border-[var(--line)] text-[var(--paper)] hover:bg-[var(--surface3)]"
          }`}
        >
          <Filter size={15} />
          Filter
          {filtersActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />}
        </button>
      </div>

      {filterOpen && (
        <div className="ledgr-rise mb-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] space-y-4">
          <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3">
            <Search size={14} className="text-[var(--mist)]" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product or category..."
              className="w-full bg-transparent py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          <div>
            <FieldLabel>Category</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const c = catColor(cat);
                const active = activeCats.includes(cat);
                return (
                  <button
                    key={cat} onClick={() => toggleCat(cat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all"
                    style={active ? { background: hexToRgba(c, 0.16), borderColor: hexToRgba(c, 0.5), color: c } : { borderColor: "var(--line)", color: "var(--mist)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <FieldLabel>Sort by</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id} onClick={() => setSortBy(opt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      sortBy === opt.id ? "bg-[var(--surface3)] border-[var(--line)] text-[var(--paper)]" : "border-transparent text-[var(--mist)] hover:text-[var(--paper)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {filtersActive && (
              <GhostButton icon={RotateCcw} onClick={resetFilters}>Reset filters</GhostButton>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-[var(--mist-dim)] mb-3">{visibleProducts.length} of {products.length} listings</div>

      {visibleProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] py-16 text-center text-sm text-[var(--mist)]">
          No listings match your filters. <button onClick={resetFilters} className="text-[var(--navy)] font-semibold hover:underline">Reset filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleProducts.map((p) => {
            const c = catColor(p.category);
            const inCart = cartIds.has(p.id);
            return (
              <div
                key={p.id}
                role="button" tabIndex={0}
                onClick={() => onOpenProduct(p)}
                onKeyDown={(e) => { if (e.key === "Enter") onOpenProduct(p); }}
                className="group rounded-2xl border bg-[var(--surface)] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                style={{ borderColor: "var(--line)", boxShadow: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = hexToRgba(c, 0.5); e.currentTarget.style.boxShadow = `0 16px 32px -18px ${hexToRgba(c, 0.55)}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="relative">
                  <ProductImageTile category={p.category} Icon={p.icon} image={p.image} size="lg" />
                  <div className="absolute top-2.5 left-2.5"><CategoryBadge category={p.category} /></div>
                  {p.sellerAdded && (
                    <div className="absolute top-2.5 right-2.5"><Badge tone="green"><Sparkles size={10} /> New</Badge></div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleCart(p); }}
                    aria-label={inCart ? "Remove from cart" : "Add to cart"}
                    className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors ${
                      inCart ? "bg-[var(--teal)] text-[var(--on-teal)] border-transparent" : "bg-[var(--surface)]/85 text-[var(--paper)] border-[var(--line)] hover:bg-[var(--surface3)]"
                    }`}
                  >
                    {inCart ? <Check size={15} /> : <ShoppingCart size={15} />}
                  </button>
                </div>
                <div className="p-3.5 flex flex-col flex-1">
                  <h3 className="font-display text-sm font-semibold text-[var(--paper)] leading-snug transition-colors line-clamp-2" style={{ color: "var(--paper)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = c)} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--paper)")}>
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-[var(--line-soft)]">
                    <span className="font-mono text-base font-bold text-[var(--price)] tabular-nums">{fmtINR(p.basePrice)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRequestQuote(p); }}
                      className="text-[11px] font-semibold text-[var(--navy)] hover:underline flex items-center gap-1 shrink-0"
                    >
                      <ArrowLeftRight size={11} /> Negotiate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Product detail -------------------------------- */

function ProductDetailPage({ product, onBack, onRequestQuote, onToggleCart, inCart }) {
  if (!product) return null;
  const c = catColor(product.category);
  return (
    <div className="sellx-rise">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--mist)] hover:text-[var(--paper)] mb-5 transition-colors"
      >
        <ArrowLeft size={15} /> Back to catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: image */}
        <div className="lg:sticky lg:top-24 h-max">
          <div className="relative rounded-2xl overflow-hidden border border-[var(--line)]">
            <ProductImageTile category={product.category} Icon={product.icon} image={product.image} size="lg" />
            <div className="absolute top-3 left-3"><CategoryBadge category={product.category} /></div>
          </div>
        </div>

        {/* Right: details */}
        <div>
          <div className="text-[11px] font-mono text-[var(--mist-dim)]">{product.sku} &middot; sold by {product.supplier}</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mt-1.5 leading-tight">{product.name}</h1>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-mono text-3xl font-bold tabular-nums text-[var(--price)]">{fmtINR(product.basePrice)}</span>
            <span className="text-sm text-[var(--mist)]">list price</span>
          </div>

          <p className="text-sm text-[var(--mist)] mt-4 leading-relaxed">{product.description}</p>

          {product.highlights && product.highlights.length > 0 && (
            <ul className="mt-4 space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-[var(--paper)]">
                  <Check size={15} className="mt-0.5 shrink-0" style={{ color: c }} />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="grid grid-cols-2 gap-3 mt-6 p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
            <MiniStat label="Category" value={product.category} />
            <MiniStat label="Lead time" value={`${product.leadTimeDays} days`} />
            <MiniStat label="Supplier" value={product.supplier} />
            <MiniStat label="SKU" value={product.sku} />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <GhostButton
              icon={inCart ? Check : ShoppingCart} onClick={() => onToggleCart(product)} className="flex-1"
              tone={inCart ? "success" : "default"}
            >
              {inCart ? "Added to cart" : "Add to cart"}
            </GhostButton>
            <PrimaryButton icon={ArrowLeftRight} tone="teal" onClick={() => onRequestQuote(product)} className="flex-1">
              Negotiate price
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--mist-dim)]">{label}</div>
      <div className="font-mono text-[13px] font-semibold text-[var(--paper)] tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

/* --------------------------------- RFQ modal -------------------------------- */

function RFQModal({ product, onClose, onSubmit }) {
  const [targetPrice, setTargetPrice] = useState(product ? (product.basePrice * 0.88).toFixed(2) : "");
  const [leadTime, setLeadTime] = useState(product ? product.leadTimeDays : 0);
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (product) {
      setTargetPrice((product.basePrice * 0.88).toFixed(2));
      setLeadTime(product.leadTimeDays);
      setNotes("");
      setFileName("");
    }
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sellx-pop relative w-full sm:max-w-lg bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] sticky top-0 bg-[var(--surface)] z-10">
          <div>
            <h3 className="font-display font-semibold text-[var(--paper)]">Make an offer</h3>
            <div className="text-xs text-[var(--mist)] mt-0.5">{product.name}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <FieldLabel hint={`list ${fmtINR(product.basePrice)}`}>Your target price</FieldLabel>
            <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3">
              <IndianRupee size={14} className="text-[var(--mist)]" />
              <input
                type="number" step="0.01" min="0" value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Required lead time (days)</FieldLabel>
            <input
              type="number" min="0" value={leadTime}
              onChange={(e) => setLeadTime(Number(e.target.value))}
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
            />
          </div>

          <div>
            <FieldLabel>Notes for the seller</FieldLabel>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Quality specs, packaging, timing..."
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none resize-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          <div>
            <FieldLabel>Attachments</FieldLabel>
            <label className="flex items-center gap-2 border border-dashed border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--mist)] cursor-pointer hover:border-[var(--teal)]/50 transition-colors">
              <Paperclip size={14} />
              {fileName || "Attach spec sheet or drawing"}
              <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
            <span className="text-xs uppercase tracking-wide text-[var(--mist)]">Your offer</span>
            <span className="font-mono text-lg font-bold text-[var(--navy)] tabular-nums">{fmtINR(Number(targetPrice || 0))}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
          <GhostButton onClick={onClose} className="flex-1">Cancel</GhostButton>
          <PrimaryButton
            tone="teal" icon={Send} className="flex-1"
            onClick={() =>
              onSubmit({
                product, targetPrice: Number(targetPrice),
                leadTime: Number(leadTime), notes, fileName,
              })
            }
          >
            Submit offer
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Add item modal ------------------------------ */

const CATEGORY_ICONS = { Vehicles: Car, Computing: Laptop, Mobile: Smartphone, Wearables: Watch, Audio: Headphones, Photography: Camera };

function AddItemModal({ open, onClose, onSubmit }) {
  const blank = { name: "", category: "Computing", sku: "", basePrice: "", leadTimeDays: "", description: "", supplier: "Your Company" };
  const [form, setForm] = useState(blank);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) { setForm(blank); setImagePreview(""); setError(""); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Give the listing a name."); return; }
    if (!form.basePrice || Number(form.basePrice) <= 0) { setError("Enter a valid list price."); return; }
    setError("");
    onSubmit({
      id: `SP-${genId("p")}`,
      name: form.name.trim(),
      category: form.category,
      icon: CATEGORY_ICONS[form.category] || Laptop,
      image: imagePreview || null,
      sku: form.sku.trim() || `SX-${form.name.trim().slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      basePrice: Number(form.basePrice),
      cost: Number(form.basePrice) * 0.7,
      leadTimeDays: Number(form.leadTimeDays) || 14,
      description: form.description.trim() || "Newly listed by a verified seller.",
      supplier: form.supplier.trim() || "Your Company",
      sellerAdded: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="ledgr-pop relative w-full sm:max-w-lg bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] sticky top-0 bg-[var(--surface)] z-10">
          <div>
            <h3 className="font-display font-semibold text-[var(--paper)]">List a new product</h3>
            <div className="text-xs text-[var(--mist)] mt-0.5">Goes live on the buyer catalog immediately.</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30 ledgr-rise">
              <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
              <span className="text-xs text-[var(--paper)]">{error}</span>
            </div>
          )}

          <div>
            <FieldLabel>Product photo</FieldLabel>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                <button
                  type="button" onClick={() => setImagePreview("")}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-[var(--line)] flex flex-col items-center justify-center gap-2 text-[var(--mist)] hover:border-[var(--teal)]/50 hover:text-[var(--paper)] transition-colors"
              >
                <ImagePlus size={22} />
                <span className="text-xs font-semibold">Upload a photo</span>
                <span className="text-[11px] text-[var(--mist-dim)]">No photo? A styled placeholder is used instead.</span>
              </button>
            )}
          </div>

          <div>
            <FieldLabel>Product name</FieldLabel>
            <input
              value={form.name} onChange={set("name")} placeholder="e.g. Industrial 3D Printer"
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          <div>
            <FieldLabel>Category</FieldLabel>
            <select
              value={form.category} onChange={set("category")}
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none appearance-none"
            >
              {Object.keys(CATEGORY_STYLES).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <FieldLabel hint="buyer-facing">List price (₹)</FieldLabel>
            <input
              type="number" min="0" value={form.basePrice} onChange={set("basePrice")} placeholder="0"
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
            />
          </div>

          <div>
            <FieldLabel>Lead time (days)</FieldLabel>
            <input
              type="number" min="0" value={form.leadTimeDays} onChange={set("leadTimeDays")} placeholder="14"
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
            />
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={form.description} onChange={set("description")} rows={3}
              placeholder="Specs, certifications, packaging..."
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none resize-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <GhostButton onClick={onClose} className="flex-1" type="button">Cancel</GhostButton>
            <PrimaryButton type="submit" tone="brass" icon={PackagePlus} className="flex-1">List product</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------- Seller desk ------------------------------- */

const STAGES = ["New Requests", "In Negotiation", "Pending Acceptance", "Closed/Won"];

function SellerDesk({ deals, myListings, onOpenDeal, onQuickAccept, onQuickCounter, onQuickReject, onAddItem }) {
  const grouped = useMemo(() => {
    const g = { "New Requests": [], "In Negotiation": [], "Pending Acceptance": [], "Closed/Won": [] };
    deals.forEach((d) => g[getStage(d)].push(d));
    return g;
  }, [deals]);
  const [activeStage, setActiveStage] = useState(STAGES[0]);

  return (
    <div className="sellx-rise">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)]">Seller trade desk</h1>
          <p className="text-sm text-[var(--mist)] mt-1">Inbound RFQs, active negotiations, and closed deals across your catalog.</p>
        </div>
        <PrimaryButton tone="brass" icon={PackagePlus} onClick={onAddItem}>Add item</PrimaryButton>
      </div>

      {myListings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--mist)] mb-3">Your listings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {myListings.map((p) => {
              const health = marginHealth(p.basePrice, p.cost, 0.24);
              return (
                <div key={p.id} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--brass)]/40 transition-colors">
                  <ProductImageTile category={p.category} Icon={p.icon} image={p.image} size="lg" />
                  <div className="font-display font-semibold text-sm text-[var(--paper)] mt-3 leading-snug">{p.name}</div>
                  <div className="text-[11px] font-mono text-[var(--mist-dim)] mt-0.5">{p.sku}</div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-mono text-sm font-bold text-[var(--price)]">{fmtINR(p.basePrice)}</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: healthColor[health.level] }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor[health.level] }} />
                      {(health.m * 100).toFixed(0)}% margin
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--mist)] mb-3">Negotiation pipeline</h3>

      <div className="flex flex-wrap gap-2 mb-5 border-b border-[var(--line-soft)] pb-0">
        {STAGES.map((stage) => {
          const isActive = stage === activeStage;
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`relative px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-2 ${
                isActive ? "text-[var(--paper)]" : "text-[var(--mist-dim)] hover:text-[var(--mist)]"
              }`}
            >
              {stage}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-[var(--brass)] text-[var(--on-brass)]" : "bg-[var(--surface3)] text-[var(--mist-dim)]"
                }`}
              >
                {grouped[stage].length}
              </span>
              {isActive && <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[var(--brass)] rounded-full" />}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[120px]">
        {grouped[activeStage].length === 0 && (
          <div className="sm:col-span-2 xl:col-span-3 rounded-xl border border-dashed border-[var(--line)] py-10 text-center text-[11px] text-[var(--mist-dim)]">
            No deals in {activeStage}
          </div>
        )}
        {grouped[activeStage].map((deal) => (
          <SellerDealCard
            key={deal.id} deal={deal}
            onOpen={() => onOpenDeal(deal.id)}
            onQuickAccept={() => onQuickAccept(deal.id)}
            onQuickCounter={(pct) => onQuickCounter(deal.id, pct)}
            onQuickReject={() => onQuickReject(deal.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SellerDealCard({ deal, onOpen, onQuickAccept, onQuickCounter, onQuickReject }) {
  const ts = deal.termSheet;
  const health = marginHealth(ts.unitPrice, deal.product.cost, deal.targetMarginPct);
  const isOpen = ts.status === "proposed";
  const isLocked = ts.status === "locked";
  const isDeclined = ts.status === "declined";

  const cardColor = catColor(deal.product.category);
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 pl-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: "var(--line)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = hexToRgba(cardColor, 0.5); e.currentTarget.style.boxShadow = `0 14px 28px -16px ${hexToRgba(cardColor, 0.5)}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: cardColor }} />
      <button onClick={onOpen} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-[var(--mist-dim)]">{deal.id}</div>
            <div className="font-display font-semibold text-sm text-[var(--paper)] leading-snug mt-0.5 truncate">{deal.product.name}</div>
            <div className="text-xs text-[var(--mist)] mt-0.5 flex items-center gap-1"><Building2 size={11} />{deal.buyerName}</div>
          </div>
          <CategoryIcon category={deal.product.category} Icon={deal.product.icon} size="sm" />
        </div>

        <div className="mt-3">
          <MiniStat label="Offer price" value={fmtINR(ts.unitPrice)} />
        </div>

        <div className="flex items-center justify-between mt-3">
          {isLocked ? (
            <Badge tone={ts.paymentStatus === "paid" ? "green" : "brass"}>
              {ts.paymentStatus === "paid" ? <CheckCircle2 size={10} /> : <Lock size={10} />}
              {ts.paymentStatus === "paid" ? "Paid" : "Locked"}
            </Badge>
          ) : isDeclined ? (
            <Badge tone="red"><XCircle size={10} /> Declined</Badge>
          ) : (
            <Badge tone="amber"><Clock size={10} /> Awaiting reply</Badge>
          )}
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: healthColor[health.level] }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor[health.level] }} />
            {(health.m * 100).toFixed(0)}% margin
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-[var(--line-soft)]">
          <button onClick={onQuickAccept} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--green)]/10 text-[var(--green)] hover:bg-[var(--green)]/20 transition-colors">Accept target</button>
          <button onClick={() => onQuickCounter(0.05)} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--surface3)] text-[var(--paper)] hover:bg-[var(--line)] transition-colors">Counter +5%</button>
          <button onClick={() => onQuickCounter(0.1)} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--surface3)] text-[var(--paper)] hover:bg-[var(--line)] transition-colors">Counter +10%</button>
          <button onClick={onQuickReject} className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--red)]/10 text-[var(--red)] hover:bg-[var(--red)]/20 transition-colors">Reject</button>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Deal room -------------------------------- */

function OfferCard({ offer, role, mine }) {
  const delta = offer.previousUnitPrice != null ? offer.unitPrice - offer.previousUnitPrice : null;
  const deltaPct = delta != null && offer.previousUnitPrice ? (delta / offer.previousUnitPrice) * 100 : null;
  const statusTone = offer.status === "accepted" ? "green" : offer.status === "superseded" ? "neutral" : "amber";

  return (
    <div className={`sellx-ticket rounded-xl p-4 w-full max-w-sm ${offer.status === "superseded" ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--mist-dim)]">Counter-offer</span>
        <Badge tone={statusTone}>
          {offer.status === "accepted" && <CheckCircle2 size={10} />}
          {offer.status === "superseded" && <ArrowLeftRight size={10} />}
          {offer.status === "proposed" && <Clock size={10} />}
          {offer.status}
        </Badge>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-[var(--price)] tabular-nums">{fmtINR(offer.unitPrice)}</span>
        <span className="text-xs text-[var(--mist)]">/ unit</span>
        {deltaPct != null && (
          <span className={`ml-auto flex items-center gap-0.5 text-xs font-semibold font-mono ${delta > 0 ? "text-[var(--red)]" : delta < 0 ? "text-[var(--green)]" : "text-[var(--mist)]"}`}>
            {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : null}
            {delta === 0 ? "flat" : `${delta > 0 ? "+" : ""}${deltaPct.toFixed(1)}%`}
          </span>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--line)] border-dashed">
        <MiniStat label="Lead" value={`${offer.leadTimeDays}d`} />
      </div>
    </div>
  );
}

function ChatMessage({ msg, role, deal }) {
  if (msg.sender === "system") {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[11px] px-3 py-1 rounded-full bg-[var(--surface2)] text-[var(--mist)] border border-[var(--line)]">{msg.text}</span>
      </div>
    );
  }

  const mine = msg.sender === role;
  const displayName = mine ? "You" : msg.sender === "buyer" ? deal.buyerName : deal.sellerName;
  const align = mine ? "items-end ml-auto" : "items-start mr-auto";
  const bubbleTone = mine
    ? role === "buyer" ? "bg-[var(--teal)]/12 border-[var(--teal)]/30" : "bg-[var(--brass)]/12 border-[var(--brass)]/30"
    : "bg-[var(--surface2)] border-[var(--line)]";

  return (
    <div className={`flex flex-col gap-1 max-w-[92%] sm:max-w-[80%] ${align} sellx-rise`}>
      <span className="text-[11px] text-[var(--mist-dim)] px-1">{displayName} &middot; {msg.sender === "buyer" ? "Buyer" : "Seller"}</span>
      {msg.type === "text" ? (
        <div className={`rounded-2xl border px-4 py-2.5 text-sm text-[var(--paper)] leading-relaxed ${bubbleTone}`}>{msg.text}</div>
      ) : (
        <OfferCard offer={msg.offer} role={role} mine={mine} />
      )}
    </div>
  );
}

function DealRoom({ role, deals, activeDealId, setActiveDealId, onSendMessage, onProposeCounter, onOpenAccept, onDecline, onOpenPayment }) {
  const deal = deals.find((d) => d.id === activeDealId);

  if (!deal) {
    return (
      <div className="sellx-rise">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)]">Deal room</h1>
          <p className="text-sm text-[var(--mist)] mt-1">Select an active negotiation to open the bargaining workspace.</p>
        </div>
        {deals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] py-16 text-center text-sm text-[var(--mist)]">
            No deals yet. Submit an RFQ from the catalog to start a negotiation.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {deals.map((d) => {
              const stage = getStage(d);
              return (
                <button
                  key={d.id} onClick={() => setActiveDealId(d.id)}
                  className="text-left rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--teal)]/50 hover:shadow-[0_14px_28px_-16px_rgba(50,96,128,0.35)]"
                >
                  <div className="flex items-start justify-between">
                    <CategoryIcon category={d.product.category} Icon={d.product.icon} size="md" />
                    <Badge tone={stage === "Closed/Won" ? (d.termSheet.status === "locked" ? "green" : "red") : "neutral"}>{stage}</Badge>
                  </div>
                  <div className="font-display font-semibold text-sm text-[var(--paper)] mt-3">{d.product.name}</div>
                  <div className="text-xs text-[var(--mist)] mt-1">{role === "buyer" ? d.sellerName : d.buyerName}</div>
                  <div className="font-mono text-lg font-bold text-[var(--price)] mt-2 tabular-nums">{fmtINR(d.termSheet.unitPrice)}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <DealRoomActive
      role={role} deal={deal} deals={deals} setActiveDealId={setActiveDealId}
      onSendMessage={onSendMessage} onProposeCounter={onProposeCounter}
      onOpenAccept={onOpenAccept} onDecline={onDecline} onOpenPayment={onOpenPayment}
    />
  );
}

function DealRoomActive({ role, deal, deals, setActiveDealId, onSendMessage, onProposeCounter, onOpenAccept, onDecline, onOpenPayment }) {
  const [chatText, setChatText] = useState("");
  const [copilotOpen, setCopilotOpen] = useState(true);

  const scrollRef = useRef(null);

  const ts = deal.termSheet;
  const [unitPrice, setUnitPrice] = useState(ts.unitPrice);
  const [leadTimeDays, setLeadTimeDays] = useState(ts.leadTimeDays);

  useEffect(() => {
    setUnitPrice(ts.unitPrice);
    setLeadTimeDays(ts.leadTimeDays);
  }, [deal.id, ts.unitPrice, ts.leadTimeDays]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [deal.messages.length]);

  const locked = ts.status === "locked";
  const declined = ts.status === "declined";
  const disabled = locked || declined;
  const health = marginHealth(Number(unitPrice), deal.product.cost, deal.targetMarginPct);
  const countdown = useCountdown(ts.expiresAt);

  const handleSend = () => {
    if (!chatText.trim()) return;
    onSendMessage(deal.id, role, chatText.trim());
    setChatText("");
  };

  const otherDeals = deals.filter((d) => d.id !== deal.id);

  return (
    <div className="sellx-rise">
      {/* Deal room header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setActiveDealId(null)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] shrink-0">
            <ArrowLeft size={16} />
          </button>
          <CategoryIcon category={deal.product.category} Icon={deal.product.icon} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-[var(--paper)] truncate">{deal.product.name}</h2>
              {role === "seller" && (
                <span className="text-[11px] font-mono text-[var(--mist-dim)] hidden sm:inline">{deal.id}</span>
              )}
            </div>
            <div className="text-xs text-[var(--mist)] flex items-center gap-1 mt-0.5">
              <Building2 size={11} /> {role === "buyer" ? deal.sellerName : deal.buyerName}
            </div>
          </div>
        </div>

        {otherDeals.length > 0 && (
          <div className="relative">
            <select
              value={deal.id}
              onChange={(e) => setActiveDealId(e.target.value)}
              className="bg-[var(--surface)] border border-[var(--line)] rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-[var(--paper)] outline-none appearance-none cursor-pointer"
            >
              <option value={deal.id}>{role === "seller" ? `${deal.id} — current` : `${deal.product.name} — current`}</option>
              {otherDeals.map((d) => (
                <option key={d.id} value={d.id}>{role === "seller" ? `${d.id} — ${d.product.name}` : d.product.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--mist)] pointer-events-none" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* LEFT: chat + audit trail */}
        <div className="lg:col-span-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] flex flex-col h-[560px]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)]">
            <MessageSquare size={14} className="text-[var(--mist)]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">Direct chat &amp; audit trail</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {deal.messages.map((m) => (
              <ChatMessage key={m.id} msg={m} role={role} deal={deal} />
            ))}
          </div>
          <div className="p-3 border-t border-[var(--line)] flex items-center gap-2">
            <input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={disabled ? "This deal is closed." : "Type a message..."}
              disabled={disabled}
              className="flex-1 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--paper)] outline-none disabled:opacity-50 placeholder:text-[var(--mist-dim)]"
            />
            <button
              onClick={handleSend} disabled={disabled}
              className="w-10 h-10 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--teal-dim)] transition-all shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* RIGHT: term sheet + counter tool + copilot */}
        <div className="lg:col-span-2 space-y-4">
          {/* Term sheet */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 relative overflow-hidden">
            {locked && (
              <div className="sellx-stamp absolute top-3 right-3 border-2 border-[var(--brass-text)] text-[var(--brass-text)] rounded-lg px-2.5 py-1 text-[11px] font-display font-bold tracking-widest -rotate-6">
                LOCKED
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-[var(--mist)]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">Active term sheet</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TermStat label="Offer price" value={fmtINR(ts.unitPrice)} accent />
              <TermStat label="Lead time" value={`${ts.leadTimeDays} days`} />
            </div>

            <div className="mt-3 flex items-center justify-between">
              {locked ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--green)]"><ShieldCheck size={14} /> Term sheet locked</span>
              ) : declined ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--red)]"><XCircle size={14} /> Deal declined</span>
              ) : (
                <>
                  <span className="text-[11px] uppercase tracking-wide text-[var(--mist)] flex items-center gap-1"><Timer size={12} /> Offer expires</span>
                  <span className={`font-mono text-sm font-bold tabular-nums ${countdown.expired ? "text-[var(--red)]" : "text-[var(--amber)]"}`}>
                    {countdown.expired ? "Expired" : countdown.label}
                  </span>
                </>
              )}
            </div>

            {locked && role === "buyer" && (
              ts.paymentStatus === "paid" ? (
                <div className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[var(--green)]/10 border border-[var(--green)]/30 text-xs font-semibold text-[var(--green)]">
                  <CheckCircle2 size={13} /> Payment complete
                </div>
              ) : (
                <button
                  onClick={() => onOpenPayment(deal.id)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] text-xs font-semibold hover:bg-[var(--teal-dim)] transition-all"
                >
                  <IndianRupee size={13} /> Pay now
                </button>
              )
            )}

            {locked && role === "seller" && (
              <div className={`mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                ts.paymentStatus === "paid"
                  ? "bg-[var(--green)]/10 border-[var(--green)]/30 text-[var(--green)]"
                  : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)]"
              }`}>
                {ts.paymentStatus === "paid" ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                {ts.paymentStatus === "paid" ? "Buyer has paid" : "Awaiting buyer payment"}
              </div>
            )}
          </div>

          {/* Counter tool */}
          {!disabled && (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight size={14} className="text-[var(--mist)]" />
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">Interactive counter tool</span>
              </div>

              <FieldLabel hint={fmtINR(unitPrice)}>Unit price</FieldLabel>
              <input
                type="range" min={(deal.product.cost * 0.7).toFixed(2)} max={(deal.product.basePrice * 1.3).toFixed(2)} step="0.01"
                value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full accent-[var(--teal)]"
              />

              <div className="mt-3">
                <FieldLabel>Lead time (days)</FieldLabel>
                <input
                  type="number" value={leadTimeDays} onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                  className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm font-mono text-[var(--paper)] outline-none"
                />
              </div>

              {role === "seller" && (
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold" style={{ color: healthColor[health.level] }}>
                  <Gauge size={12} /> {(health.m * 100).toFixed(1)}% margin &middot; {health.label}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 mt-4">
                <PrimaryButton
                  tone={role === "buyer" ? "teal" : "brass"} icon={ArrowLeftRight}
                  onClick={() => onProposeCounter(deal.id, role, { unitPrice: Number(unitPrice), leadTimeDays: Number(leadTimeDays) })}
                >
                  Propose counter-offer
                </PrimaryButton>
                <div className="grid grid-cols-2 gap-2">
                  <PrimaryButton tone="green" icon={ShieldCheck} onClick={() => onOpenAccept(deal.id)}>Accept &amp; lock</PrimaryButton>
                  <GhostButton
                    tone="danger" icon={XCircle}
                    onClick={() => onDecline(deal.id, role)}
                  >
                    Decline deal
                  </GhostButton>
                </div>
              </div>
            </div>
          )}

          {/* AI Copilot */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
            <button onClick={() => setCopilotOpen((v) => !v)} className="w-full flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--paper)]">
                <Sparkles size={14} className="text-[var(--navy)]" /> {role === "buyer" ? "Buyer" : "Seller"} AI copilot
                <Badge tone="neutral">Private</Badge>
              </span>
              <ChevronRight size={15} className={`text-[var(--mist)] transition-transform ${copilotOpen ? "rotate-90" : ""}`} />
            </button>
            {copilotOpen && (
              <div className="px-4 pb-4 sellx-rise">
                {role === "buyer" ? (
                  <BuyerCopilot product={deal.product} onUseSuggested={(v) => setUnitPrice(v)} />
                ) : (
                  <SellerCopilot
                    product={deal.product} unitPrice={Number(unitPrice)} targetMarginPct={deal.targetMarginPct}
                    onQuickReply={(text) => onSendMessage(deal.id, "seller", text)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TermStat({ label, value, accent }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--mist-dim)]">{label}</div>
      <div className={`font-mono text-base font-bold tabular-nums mt-0.5 ${accent ? "text-[var(--brass-text)]" : "text-[var(--paper)]"}`}>{value}</div>
    </div>
  );
}

function BuyerCopilot({ product, onUseSuggested }) {
  const suggested = product.basePrice * 0.87;
  const acceptanceRate = 68;
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-[var(--teal)]/8 border border-[var(--teal)]/25">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-[var(--mist)]">Suggested target price</span>
          <Badge tone="teal"><Sparkles size={10} /> Benchmark</Badge>
        </div>
        <div className="flex items-end justify-between mt-1.5">
          <span className="font-mono text-xl font-bold text-[var(--price)] tabular-nums">{fmtINR(suggested)}</span>
          <button onClick={() => onUseSuggested(Number(suggested.toFixed(2)))} className="text-xs font-semibold text-[var(--navy)] hover:underline">Use this price</button>
        </div>
        <p className="text-[11px] text-[var(--mist)] mt-1.5 leading-relaxed">Based on 30-day category benchmarks, {13}% below list price is a common landing point.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-wide text-[var(--mist)]">Historical seller acceptance</span>
          <span className="font-mono text-xs font-bold text-[var(--paper)]">{acceptanceRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface3)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--teal)]" style={{ width: `${acceptanceRate}%` }} />
        </div>
        <p className="text-[11px] text-[var(--mist-dim)] mt-1.5">Sellers in this category accepted first counters at this discount 68% of the time.</p>
      </div>
    </div>
  );
}

function SellerCopilot({ product, unitPrice, targetMarginPct, onQuickReply }) {
  const health = marginHealth(unitPrice, product.cost, targetMarginPct);
  const margin = unitPrice - product.cost;
  const floorPrice = product.cost / (1 - targetMarginPct * 0.6);

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl border" style={{ background: `${healthColor[health.level]}14`, borderColor: `${healthColor[health.level]}40` }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-[var(--mist)]">Live profit margin</span>
          <Badge tone={health.level === "healthy" ? "green" : health.level === "warn" ? "amber" : "red"}>{health.label}</Badge>
        </div>
        <div className="flex items-end gap-3 mt-1.5">
          <span className="font-mono text-xl font-bold tabular-nums" style={{ color: healthColor[health.level] }}>{(health.m * 100).toFixed(1)}%</span>
          <span className="text-xs text-[var(--mist)] font-mono">{fmtINR(margin)} margin</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[var(--mist)]"><Gauge size={12} /> Floor price</div>
        <p className="text-xs text-[var(--paper)] mt-1.5 leading-relaxed">
          Don't counter below <span className="font-mono font-semibold">{fmtINR(floorPrice)}</span> — that's where your margin starts to fall below target on this item.
        </p>
      </div>

      <div>
        <span className="text-[11px] uppercase tracking-wide text-[var(--mist)]">Quick-reply templates</span>
        <div className="flex flex-col gap-1.5 mt-1.5">
          {QUICK_REPLIES.map((t) => (
            <button key={t} onClick={() => onQuickReply(t)} className="text-left text-xs px-3 py-2 rounded-lg bg-[var(--surface2)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--brass)]/40 transition-colors">
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Accept confirm modal --------------------------- */

function AcceptConfirmModal({ deal, role, onClose, onConfirm, viewOnly, onOpenPayment }) {
  const [step, setStep] = useState(viewOnly ? "success" : "confirm");
  const [copied, setCopied] = useState(false);

  useEffect(() => setStep(viewOnly ? "success" : "confirm"), [deal?.id, viewOnly]);

  const ts = deal ? deal.termSheet : null;
  const checkoutCountdown = useCountdown(ts ? ts.checkoutExpiresAt : 0);

  if (!deal) return null;

  const handleConfirm = () => {
    onConfirm(deal.id);
    setStep("success");
  };

  const copyLink = () => {
    const url = ts.checkoutUrl || `https://sellx.trade/checkout/${deal.id.toLowerCase()}`;
    if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sellx-pop relative w-full sm:max-w-md bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {step === "confirm" ? (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)]">Confirm &amp; lock term sheet</h3>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--amber)]/10 border border-[var(--amber)]/30">
                <AlertTriangle size={16} className="text-[var(--amber)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--paper)] leading-relaxed">
                  This is a binding acceptance. Once confirmed, the term sheet locks for both parties and a time-limited checkout link is generated.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--line)] divide-y divide-[var(--line-soft)] overflow-hidden">
                <SummaryRow label="Product" value={deal.product.name} />
                <SummaryRow label="Counterparty" value={role === "buyer" ? deal.sellerName : deal.buyerName} />
                <SummaryRow label="Agreed price" value={fmtINR(ts.unitPrice)} accent />
                <SummaryRow label="Lead time" value={`${ts.leadTimeDays} days`} />
              </div>
            </div>
            <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
              <GhostButton onClick={onClose} className="flex-1">Cancel</GhostButton>
              <PrimaryButton tone="green" icon={Lock} className="flex-1" onClick={handleConfirm}>Confirm &amp; lock deal</PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[var(--green)]" /> Deal locked
              </h3>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                <span className="text-xs text-[var(--mist)]">Locked price</span>
                <span className="font-mono text-lg font-bold text-[var(--price)] tabular-nums">{fmtINR(ts.unitPrice)}</span>
              </div>

              <div>
                <FieldLabel>Locked checkout link</FieldLabel>
                <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5">
                  <span className="flex-1 truncate text-xs font-mono text-[var(--navy)]">{ts.checkoutUrl || `https://sellx.trade/checkout/${deal.id.toLowerCase()}`}</span>
                  <button onClick={copyLink} className="text-[var(--mist)] hover:text-[var(--paper)] shrink-0">
                    {copied ? <Check size={14} className="text-[var(--green)]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--red)]/8 border border-[var(--red)]/25">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--paper)]"><Timer size={13} /> Link expires in</span>
                <span className={`font-mono text-sm font-bold tabular-nums ${checkoutCountdown.expired ? "text-[var(--red)]" : "text-[var(--red)]"}`}>
                  {checkoutCountdown.expired ? "Expired" : checkoutCountdown.label}
                </span>
              </div>
            </div>
            <div className="p-5 border-t border-[var(--line)] flex items-center gap-2">
              <GhostButton onClick={onClose} className="flex-1">Done</GhostButton>
              {role === "buyer" && (
                <PrimaryButton
                  tone="teal" icon={IndianRupee} className="flex-1"
                  onClick={() => { onClose(); onOpenPayment(deal.id); }}
                >
                  Pay now
                </PrimaryButton>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DeclineConfirmModal({ deal, role, onClose, onConfirm }) {
  const [step, setStep] = useState("confirm");

  useEffect(() => setStep("confirm"), [deal?.id]);

  if (!deal) return null;
  const ts = deal.termSheet;

  const handleConfirm = () => {
    onConfirm(deal.id, role);
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sellx-pop relative w-full sm:max-w-md bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {step === "confirm" ? (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)]">Confirm decline</h3>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30">
                <AlertTriangle size={16} className="text-[var(--red)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--paper)] leading-relaxed">
                  This will end the deal for both parties. Once declined, this offer can no longer be accepted or countered — this action can't be undone.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--line)] divide-y divide-[var(--line-soft)] overflow-hidden">
                <SummaryRow label="Product" value={deal.product.name} />
                <SummaryRow label="Counterparty" value={role === "buyer" ? deal.sellerName : deal.buyerName} />
                <SummaryRow label="Current offer" value={fmtINR(ts.unitPrice)} accent />
              </div>
            </div>
            <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
              <GhostButton onClick={onClose} className="flex-1">Cancel</GhostButton>
              <PrimaryButton tone="red" icon={XCircle} className="flex-1" onClick={handleConfirm}>Decline deal</PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
                <XCircle size={16} className="text-[var(--red)]" /> Deal declined
              </h3>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-[var(--mist)] leading-relaxed">
                {role === "seller" ? `${deal.id} for ${deal.product.name}` : deal.product.name} has been marked as declined and moved to your closed deals.
              </p>
            </div>
            <div className="p-5 border-t border-[var(--line)]">
              <PrimaryButton tone="teal" className="w-full" onClick={onClose}>Done</PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const PAYMENT_METHODS = [
  { key: "upi", label: "UPI", icon: Smartphone, hint: "Pay via any UPI app" },
  { key: "card", label: "Card", icon: CreditCard, hint: "Credit or debit card" },
  { key: "netbanking", label: "Net Banking", icon: Landmark, hint: "Pay via your bank" },
];

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank"];

function PaymentModal({ deal, onClose, onConfirm }) {
  const [step, setStep] = useState("select");
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState(BANKS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    setStep("select"); setMethod("upi"); setUpiId(""); setCardNumber(""); setCardExpiry(""); setCardCvv(""); setBank(BANKS[0]); setError("");
  }, [deal?.id]);

  if (!deal) return null;
  const ts = deal.termSheet;

  const handlePay = () => {
    if (method === "upi" && !upiId.trim()) { setError("Enter a valid UPI ID."); return; }
    if (method === "card" && (cardNumber.replace(/\s/g, "").length < 12 || !cardExpiry || cardCvv.length < 3)) { setError("Enter valid card details."); return; }
    setError("");
    setStep("processing");
    setTimeout(() => {
      onConfirm(deal.id, method);
      setStep("success");
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={step === "processing" ? undefined : onClose} />
      <div className="sellx-pop relative w-full sm:max-w-md bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {step === "select" && (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)]">Pay for this order</h3>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                <span className="text-xs text-[var(--mist)]">Amount due</span>
                <span className="font-mono text-lg font-bold text-[var(--price)] tabular-nums">{fmtINR(ts.unitPrice)}</span>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30">
                  <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
                  <span className="text-xs text-[var(--paper)]">{error}</span>
                </div>
              )}

              <div>
                <FieldLabel>Payment method</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.key} onClick={() => { setMethod(m.key); setError(""); }}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-colors ${
                        method === m.key ? "bg-[var(--teal)]/15 border-[var(--teal)]/40 text-[var(--navy)]" : "border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                      }`}
                    >
                      <m.icon size={18} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {method === "upi" && (
                <div>
                  <FieldLabel>UPI ID</FieldLabel>
                  <input
                    value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@bank"
                    className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                  />
                </div>
              )}

              {method === "card" && (
                <div className="space-y-3">
                  <div>
                    <FieldLabel>Card number</FieldLabel>
                    <input
                      value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456"
                      className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Expiry</FieldLabel>
                      <input
                        value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY"
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                      />
                    </div>
                    <div>
                      <FieldLabel>CVV</FieldLabel>
                      <input
                        value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="123" type="password"
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === "netbanking" && (
                <div>
                  <FieldLabel>Select bank</FieldLabel>
                  <select
                    value={bank} onChange={(e) => setBank(e.target.value)}
                    className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none appearance-none"
                  >
                    {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-[var(--mist-dim)]">
                <ShieldCheck size={12} /> Payments are simulated in this demo — no real transaction occurs.
              </div>
            </div>
            <div className="flex items-center gap-2 p-5 border-t border-[var(--line)]">
              <GhostButton onClick={onClose} className="flex-1">Cancel</GhostButton>
              <PrimaryButton tone="teal" icon={Lock} className="flex-1" onClick={handlePay}>Pay {fmtINR(ts.unitPrice)}</PrimaryButton>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="p-10 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 size={28} className="text-[var(--teal)] animate-spin" />
            <div className="text-sm font-semibold text-[var(--paper)]">Processing payment&hellip;</div>
            <div className="text-xs text-[var(--mist)]">Don&apos;t close this window.</div>
          </div>
        )}

        {step === "success" && (
          <>
            <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
              <h3 className="font-display font-semibold text-[var(--paper)] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[var(--green)]" /> Payment successful
              </h3>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-xl border border-[var(--line)] divide-y divide-[var(--line-soft)] overflow-hidden">
                <SummaryRow label="Product" value={deal.product.name} />
                <SummaryRow label="Amount paid" value={fmtINR(ts.unitPrice)} accent />
                <SummaryRow label="Method" value={PAYMENT_METHODS.find((m) => m.key === method)?.label || method} />
              </div>
              <p className="text-xs text-[var(--mist)] leading-relaxed">
                {deal.sellerName} has been notified. Order fulfillment begins now.
              </p>
            </div>
            <div className="p-5 border-t border-[var(--line)]">
              <PrimaryButton tone="teal" className="w-full" onClick={onClose}>Done</PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface)]">
      <span className="text-xs text-[var(--mist)]">{label}</span>
      <span className={`text-sm font-semibold font-mono ${accent ? "text-[var(--brass-text)]" : "text-[var(--paper)]"}`}>{value}</span>
    </div>
  );
}

/* ---------------------------------- Footer ----------------------------------- */

const FOOTER_LINKS = {
  Platform: ["Catalog", "Trade Desk", "Deal Room", "Pricing"],
  Resources: ["Help Center", "Negotiation Guide", "API Docs", "Trust & Safety"],
  Company: ["About", "Careers", "Contact", "Press"],
};

function Footer({ onNavigate, onDemoAction }) {
  const PLATFORM_ACTIONS = {
    Catalog: () => onNavigate("buyer", "catalog"),
    "Trade Desk": () => onNavigate("seller", "desk"),
    "Deal Room": () => onNavigate(null, "dealroom"),
    Pricing: () => onDemoAction("Pricing"),
  };
  return (
    <footer className="mt-14 border-t border-[var(--line)]" style={{ background: "#6eacec" }}>
      <div
        className="h-[3px] w-full"
        style={{ background: `linear-gradient(90deg, #06457F, #5379AE, #0474C4)` }}
      />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size="md" />
            </div>
            <p className="text-sm text-[#1a2233] mt-3.5 leading-relaxed max-w-xs">
              Direct buyer-to-seller negotiation. Fair terms, faster deals.
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] sellx-pulse" />
              <span className="text-xs text-[#1a2233]">All systems operational</span>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <a
                href="mailto:hello@sellx.trade"
                className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-[#1a2233] hover:text-[#0a0f1a] hover:border-[var(--teal)]/40 transition-colors"
                title="hello@sellx.trade"
              >
                <Mail size={14} />
              </a>
              {[["Globe", Globe], ["LinkedIn", Linkedin], ["GitHub", Github]].map(([label, Icon]) => (
                <button
                  key={label} type="button" onClick={() => onDemoAction(label)}
                  className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-[#1a2233] hover:text-[#0a0f1a] hover:border-[var(--teal)]/40 transition-colors"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#0a0f1a] mb-3.5">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => (heading === "Platform" ? PLATFORM_ACTIONS[l]() : onDemoAction(l))}
                      className="text-sm text-[#1a2233] hover:text-[#0a0f1a] transition-colors text-left"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Category legend */}
        <div className="mt-10 pt-8 border-t border-[var(--line-soft)]">
          <div className="text-xs font-bold uppercase tracking-wide text-[#1a2233] mb-3">Categories on the desk</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {Object.entries(CATEGORY_STYLES).map(([name, color]) => (
              <span key={name} className="flex items-center gap-1.5 text-xs text-[#1a2233]">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] text-[11px] font-semibold text-[#1a2233]">
            <BadgeCheck size={12} className="text-[var(--brass-text)]" /> Verified suppliers
          </span>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-[var(--line-soft)]">
          <span className="text-xs text-[#2c3648]">&copy; 2026 SellX Trade Desk, Inc. All rights reserved.</span>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Security"].map((l) => (
              <button key={l} type="button" onClick={() => onDemoAction(l)} className="text-xs text-[#2c3648] hover:text-[#0a0f1a] transition-colors">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------- Seller login page ----------------------------- */

const SELLER_PERKS = [
  "Live profit-margin intelligence on every counter-offer",
  "Direct, unmediated negotiation with verified buyers",
  "24-hour locked checkout links the moment a deal closes",
];

function SellerLoginPage({ theme, setTheme, onLogin, onContinueAsBuyer }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoNote, setDemoNote] = useState("");

  const flashDemoNote = (msg) => {
    setDemoNote(msg);
    setTimeout(() => setDemoNote(""), 3200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
    if (!emailOk) {
      setError("Enter a valid business email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--ink)]">
      {/* Left — brand hero */}
      <div
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(155deg, #5379AE 0%, #06457F 100%)" }}
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25" style={{ background: "radial-gradient(circle, #0474C4, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full opacity-15 translate-x-1/3 translate-y-1/3" style={{ background: "radial-gradient(circle, #FBF7F2, transparent 70%)" }} />

        <div className="relative z-10">
          <BrandMark size="lg" />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="sx-wordmark text-4xl leading-tight text-[#FBF7F2]">The seller's side of the table.</h1>
          <p className="text-sm text-[#A8C4EC] mt-4 leading-relaxed">
            SellX gives sellers a private negotiation cockpit — real-time margin math, upsell prompts, and quick-reply tools buyers never see.
          </p>
          <div className="mt-8 space-y-3.5">
            {SELLER_PERKS.map((p) => (
              <div key={p} className="flex items-start gap-2.5">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-[#A8C4EC]" strokeWidth={3} />
                </div>
                <span className="text-sm text-[#E8F1FB] leading-relaxed">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-[#C5D5EA]">&copy; 2026 SellX Trade Desk, Inc.</div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 sm:px-10 py-6">
          <button onClick={onContinueAsBuyer} className="flex items-center gap-1.5 text-sm font-semibold text-[var(--mist)] hover:text-[var(--paper)] transition-colors">
            <ArrowLeft size={15} /> Continue as buyer
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-12">
          <div className="w-full max-w-sm ledgr-rise">
            <div className="lg:hidden mb-6"><BrandMark size="md" /></div>

            <Badge tone="brass"><Store size={11} /> Seller portal</Badge>
            <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-3">Sign in to your seller account</h2>
            <p className="text-sm text-[var(--mist)] mt-1.5">Manage RFQs, negotiate live, and lock deals from your trade desk.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30 ledgr-rise">
                  <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
                  <span className="text-xs text-[var(--paper)]">{error}</span>
                </div>
              )}

              <div>
                <FieldLabel>Business email</FieldLabel>
                <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 focus-within:border-[var(--teal)]/50 transition-colors">
                  <Mail size={15} className="text-[var(--mist)]" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com" autoComplete="email"
                    className="w-full bg-transparent py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">Password</label>
                  <button type="button" onClick={() => flashDemoNote("Password reset isn't wired up in this demo — try any email with a 6+ character password.")} className="text-[11px] font-semibold text-[var(--navy)] hover:underline">Forgot password?</button>
                </div>
                <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 focus-within:border-[var(--teal)]/50 transition-colors">
                  <KeyRound size={15} className="text-[var(--mist)]" />
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" autoComplete="current-password"
                    className="w-full bg-transparent py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-[var(--mist)] hover:text-[var(--paper)] shrink-0">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-[var(--teal)]" />
                <span className="text-xs text-[var(--mist)]">Keep me signed in on this device</span>
              </label>

              <PrimaryButton type="submit" tone="brass" disabled={loading} className="w-full">
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> Signing in…</span>
                ) : (
                  "Sign in to trade desk"
                )}
              </PrimaryButton>

              <p className="text-[11px] text-center text-[var(--mist-dim)] pt-1">
                Demo mode — any business email &amp; a password of 6+ characters will sign you in.
              </p>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-[var(--line)]" />
              <span className="text-[11px] uppercase tracking-wide text-[var(--mist-dim)]">or</span>
              <div className="h-px flex-1 bg-[var(--line)]" />
            </div>

            <GhostButton className="w-full" onClick={() => flashDemoNote("Google sign-in isn't connected in this demo — use the form above instead.")}>
              Continue with Google
            </GhostButton>

            <p className="text-sm text-center text-[var(--mist)] mt-6">
              New to SellX? <button onClick={() => flashDemoNote("Seller applications aren't part of this demo — sign in above to explore the desk.")} className="font-semibold text-[var(--navy)] hover:underline">Apply to become a seller</button>
            </p>

            {demoNote && (
              <div className="ledgr-rise mt-4 flex items-start gap-2 p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                <Info size={14} className="text-[var(--navy)] shrink-0 mt-0.5" />
                <span className="text-xs text-[var(--mist)] leading-relaxed">{demoNote}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------- App ------------------------------------ */

export default function App() {
  const [theme, setTheme] = useState("light");
  const [role, setRole] = useState("buyer");
  const [sellerAuthed, setSellerAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("catalog");
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [activeDealId, setActiveDealId] = useState(null);

  const [rfqProduct, setRfqProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [addItemOpen, setAddItemOpen] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: genId("n"), text: "Welcome to SellX. Three sample negotiations are already in motion on the Trade Desk.", icon: Info, tone: "teal" },
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  const [acceptModal, setAcceptModal] = useState({ dealId: null, viewOnly: false });
  const [declineModal, setDeclineModal] = useState({ dealId: null, role: null });
  const [paymentModal, setPaymentModal] = useState({ dealId: null });

  useEffect(() => {
    setActiveTab(role === "buyer" ? "catalog" : "desk");
    setDetailProduct(null);
  }, [role]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key !== "Escape") return;
      if (rfqProduct) setRfqProduct(null);
      else if (addItemOpen) setAddItemOpen(false);
      else if (detailProduct) setDetailProduct(null);
      else if (acceptModal.dealId) setAcceptModal({ dealId: null, viewOnly: false });
      else if (declineModal.dealId) setDeclineModal({ dealId: null, role: null });
      else if (paymentModal.dealId) setPaymentModal({ dealId: null });
      else if (cartOpen) setCartOpen(false);
      else if (notifOpen) setNotifOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [rfqProduct, addItemOpen, detailProduct, acceptModal.dealId, declineModal.dealId, paymentModal.dealId, cartOpen, notifOpen]);

  const pushNotification = (text, { icon = Info, tone = "teal", dealId } = {}) => {
    setNotifications((prev) => [{ id: genId("n"), text, icon, tone, dealId }, ...prev].slice(0, 30));
    setUnreadCount((c) => c + 1);
  };

  const allProducts = useMemo(() => [...sellerProducts, ...PRODUCTS], [sellerProducts]);
  const cartIds = useMemo(() => new Set(cartItems.map((p) => p.id)), [cartItems]);

  const goToTab = (tab) => { setDetailProduct(null); setActiveTab(tab); };

  const addSellerProduct = (product) => {
    setSellerProducts((prev) => [product, ...prev]);
    setAddItemOpen(false);
    pushNotification(`"${product.name}" is now live on the buyer catalog.`, { icon: PackagePlus, tone: "brass" });
  };

  const stats = useMemo(() => {
    const activeRFQs = deals.filter((d) => getStage(d) !== "Closed/Won").length;
    const lockedDeals = deals.filter((d) => d.termSheet.status === "locked").length;
    const totalSavings = deals
      .filter((d) => d.termSheet.status === "locked")
      .reduce((sum, d) => sum + (d.product.basePrice - d.termSheet.unitPrice), 0);
    const totalMargin = deals
      .filter((d) => d.termSheet.status === "locked")
      .reduce((sum, d) => sum + (d.termSheet.unitPrice - d.product.cost), 0);
    return { activeRFQs, lockedDeals, totalSavings: Math.max(0, totalSavings), totalMargin: Math.max(0, totalMargin) };
  }, [deals]);

  /* ---- actions ---- */

  const submitRFQ = ({ product, targetPrice, leadTime, notes }) => {
    const id = `D-${1000 + deals.length + 1}`;
    const offerMsg = {
      id: genId("m"), sender: "buyer", type: "offer", timestamp: Date.now(),
      offer: { unitPrice: targetPrice, leadTimeDays: leadTime, status: "proposed", previousUnitPrice: null },
    };
    const sysMsg = { id: genId("m"), sender: "system", type: "text", text: "Offer submitted by buyer.", timestamp: Date.now() - 1000 };
    const messages = notes
      ? [sysMsg, offerMsg, { id: genId("m"), sender: "buyer", type: "text", text: notes, timestamp: Date.now() + 1000 }]
      : [sysMsg, offerMsg];

    const deal = {
      id, product, buyerName: "Your Company", sellerName: product.supplier, targetMarginPct: 0.24,
      messages,
      termSheet: { unitPrice: targetPrice, leadTimeDays: leadTime, status: "proposed", expiresAt: Date.now() + 2 * 3600000, lastProposedBy: "buyer" },
      createdAt: Date.now(),
    };
    setDeals((prev) => [deal, ...prev]);
    setRfqProduct(null);
    setActiveDealId(id);
    setActiveTab("dealroom");
    pushNotification(`Offer submitted to ${product.supplier} for ${product.name}.`, { icon: Send, tone: "teal", dealId: id });
  };

  const sendMessage = (dealId, senderRole, text) => {
    setDeals((prev) => prev.map((d) => (d.id !== dealId ? d : { ...d, messages: [...d.messages, { id: genId("m"), sender: senderRole, type: "text", text, timestamp: Date.now() }] })));
  };

  const proposeCounter = (dealId, senderRole, { unitPrice, leadTimeDays }) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const prevOffer = [...d.messages].reverse().find((m) => m.type === "offer" && m.offer.status === "proposed");
        const messages = d.messages.map((m) => (m.type === "offer" && m.offer.status === "proposed" ? { ...m, offer: { ...m.offer, status: "superseded" } } : m));
        const newMsg = {
          id: genId("m"), sender: senderRole, type: "offer", timestamp: Date.now(),
          offer: { unitPrice, leadTimeDays, status: "proposed", previousUnitPrice: prevOffer ? prevOffer.offer.unitPrice : null },
        };
        return {
          ...d,
          messages: [...messages, newMsg],
          termSheet: { unitPrice, leadTimeDays, status: "proposed", expiresAt: Date.now() + 2 * 3600000, lastProposedBy: senderRole },
        };
      })
    );
    pushNotification(`${senderRole === "buyer" ? "Buyer" : "Seller"} proposed a counter-offer on ${deals.find((d) => d.id === dealId)?.product.name || dealId}.`, { icon: ArrowLeftRight, tone: senderRole === "buyer" ? "teal" : "brass", dealId });
  };

  const quickCounter = (dealId, pct) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;
    const ts = deal.termSheet;
    proposeCounter(dealId, "seller", { unitPrice: Number((ts.unitPrice * (1 + pct)).toFixed(2)), leadTimeDays: ts.leadTimeDays });
  };

  const requestLock = (dealId, viewOnly = false) => setAcceptModal({ dealId, viewOnly });

  const requestDecline = (dealId, senderRole) => setDeclineModal({ dealId, role: senderRole });

  const confirmLock = (dealId) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const messages = d.messages.map((m) => (m.type === "offer" && m.offer.status === "proposed" ? { ...m, offer: { ...m.offer, status: "accepted" } } : m));
        const checkoutUrl = `https://sellx.trade/checkout/${dealId.toLowerCase()}`;
        const termSheet = { ...d.termSheet, status: "locked", paymentStatus: "unpaid", checkoutUrl, checkoutExpiresAt: Date.now() + 24 * 3600000 };
        const sysMsg = { id: genId("m"), sender: "system", type: "text", text: `Term sheet locked at ${fmtINR(d.termSheet.unitPrice)}. Checkout link generated.`, timestamp: Date.now() };
        return { ...d, messages: [...messages, sysMsg], termSheet };
      })
    );
    pushNotification(`Deal locked for ${deals.find((d) => d.id === dealId)?.product.name || dealId}. Checkout link generated (24h expiry).`, { icon: Lock, tone: "brass", dealId });
  };

  const declineDeal = (dealId, senderRole) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const sysMsg = { id: genId("m"), sender: "system", type: "text", text: `${senderRole === "buyer" ? "Buyer" : "Seller"} declined the deal.`, timestamp: Date.now() };
        return { ...d, termSheet: { ...d.termSheet, status: "declined" }, messages: [...d.messages, sysMsg] };
      })
    );
    pushNotification(`Deal declined for ${deals.find((d) => d.id === dealId)?.product.name || dealId}.`, { icon: XCircle, tone: "brass", dealId });
  };

  const openPayment = (dealId) => setPaymentModal({ dealId });

  const confirmPayment = (dealId, method) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const termSheet = { ...d.termSheet, paymentStatus: "paid", paymentMethod: method, paidAt: Date.now() };
        const label = PAYMENT_METHODS.find((m) => m.key === method)?.label || method;
        const sysMsg = { id: genId("m"), sender: "system", type: "text", text: `Payment received via ${label}.`, timestamp: Date.now() };
        return { ...d, messages: [...d.messages, sysMsg], termSheet };
      })
    );
    pushNotification(`Payment received for ${deals.find((d) => d.id === dealId)?.product.name || dealId}.`, { icon: CheckCircle2, tone: "brass", dealId });
  };

  const toggleCart = (product) => {
    setCartItems((prev) => {
      const inCart = prev.some((p) => p.id === product.id);
      if (inCart) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };
  const removeCartItem = (productId) => setCartItems((prev) => prev.filter((p) => p.id !== productId));
  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.length;

  const notifyDemo = (label) => pushNotification(`${label} isn't wired up in this demo.`, { icon: Info, tone: "teal" });

  const acceptModalDeal = deals.find((d) => d.id === acceptModal.dealId) || null;
  const declineModalDeal = deals.find((d) => d.id === declineModal.dealId) || null;
  const paymentModalDeal = deals.find((d) => d.id === paymentModal.dealId) || null;
  const showSellerLogin = role === "seller" && !sellerAuthed;

  return (
    <div className={`sellx-root font-body ${theme === "light" ? "light" : ""} min-h-screen flex flex-col bg-[var(--ink)] text-[var(--paper)]`}>
      <style>{GLOBAL_STYLES}</style>

      {showSellerLogin ? (
        <SellerLoginPage
          theme={theme} setTheme={setTheme}
          onLogin={() => { setSellerAuthed(true); pushNotification("Signed in to the seller trade desk.", { icon: Store, tone: "brass" }); }}
          onContinueAsBuyer={() => setRole("buyer")}
        />
      ) : (
        <>
          <Header
            role={role} setRole={(r) => { if (r === "buyer") setSellerAuthed(false); setRole(r); }}
            theme={theme} setTheme={setTheme} stats={stats}
            cartCount={cartCount} onOpenCart={() => setCartOpen(true)}
            onOpenNotifications={() => { setNotifOpen(true); setUnreadCount(0); }}
            unreadCount={unreadCount} activeTab={activeTab} setActiveTab={goToTab}
            sellerAuthed={sellerAuthed} onSignOut={() => { setSellerAuthed(false); }}
          />

          <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6">
            {activeTab === "catalog" && role === "buyer" && (
              detailProduct ? (
                <ProductDetailPage
                  product={detailProduct}
                  onBack={() => setDetailProduct(null)}
                  onRequestQuote={setRfqProduct}
                  onToggleCart={toggleCart}
                  inCart={cartIds.has(detailProduct.id)}
                />
              ) : (
                <CatalogView products={allProducts} onRequestQuote={setRfqProduct} onToggleCart={toggleCart} cartIds={cartIds} onOpenProduct={setDetailProduct} />
              )
            )}
            {activeTab === "desk" && role === "seller" && (
              <SellerDesk
                deals={deals} myListings={sellerProducts}
                onOpenDeal={(id) => { setActiveDealId(id); setActiveTab("dealroom"); }}
                onQuickAccept={(id) => requestLock(id)}
                onQuickCounter={quickCounter}
                onQuickReject={(id) => requestDecline(id, "seller")}
                onAddItem={() => setAddItemOpen(true)}
              />
            )}
            {activeTab === "dealroom" && (
              <DealRoom
                role={role} deals={deals} activeDealId={activeDealId} setActiveDealId={setActiveDealId}
                onSendMessage={sendMessage} onProposeCounter={proposeCounter}
                onOpenAccept={requestLock} onDecline={requestDecline} onOpenPayment={openPayment}
              />
            )}
          </main>

          <Footer
            onNavigate={(r, tab) => { if (r) setRole(r); goToTab(tab); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            onDemoAction={notifyDemo}
          />

          <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} role={role} />

          <CartDrawer
            open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems}
            onRemove={removeCartItem} onClear={clearCart}
            onGoToCatalog={() => { setCartOpen(false); setRole("buyer"); goToTab("catalog"); }}
            onNegotiateItem={(product) => { setCartOpen(false); setRfqProduct(product); }}
          />

          <RFQModal product={rfqProduct} onClose={() => setRfqProduct(null)} onSubmit={submitRFQ} />

          <AddItemModal open={addItemOpen} onClose={() => setAddItemOpen(false)} onSubmit={addSellerProduct} />

          {acceptModal.dealId && (
            <AcceptConfirmModal
              deal={acceptModalDeal} role={role} viewOnly={acceptModal.viewOnly}
              onClose={() => setAcceptModal({ dealId: null, viewOnly: false })}
              onConfirm={confirmLock}
              onOpenPayment={openPayment}
            />
          )}

          {declineModal.dealId && (
            <DeclineConfirmModal
              deal={declineModalDeal} role={declineModal.role}
              onClose={() => setDeclineModal({ dealId: null, role: null })}
              onConfirm={declineDeal}
            />
          )}

          {paymentModal.dealId && (
            <PaymentModal
              deal={paymentModalDeal}
              onClose={() => setPaymentModal({ dealId: null })}
              onConfirm={confirmPayment}
            />
          )}
        </>
      )}
    </div>
  );
}