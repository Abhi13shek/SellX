import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  BookOpen,
  Code2,
  Briefcase,
  Mail,
  Newspaper,
  Lock,
  FileText,
  Check,
  Copy,
  ChevronRight,
  Sparkles,
  Send,
  Search,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Percent,
  AlertCircle,
  Building2,
  DollarSign,
  Download,
  Share2,
  Layers,
  Headphones,
  CheckCheck,
} from "lucide-react";
import { fmtINR } from "../../utils/formatters.js";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { Badge } from "../common/Badge.jsx";

export function FooterInfoPage({ topic = "Pricing", onClose, onNavigate }) {
  const [currentTab, setCurrentTab] = useState(topic);
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [calcPrice, setCalcPrice] = useState(35000);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    department: "General Support",
    subject: "",
    priority: "Standard",
    message: "",
  });
  const [faqSearch, setFaqSearch] = useState("");
  const [activeFaqCategory, setActiveFaqCategory] = useState("All");
  const [appliedJob, setAppliedJob] = useState(null);
  const [jobModal, setJobModal] = useState(null);
  const [applicantForm, setApplicantForm] = useState({ name: "", email: "", portfolio: "", cover: "" });

  useEffect(() => {
    if (topic) setCurrentTab(topic);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [topic]);

  const copyToClipboard = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedEndpoint(id);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (!applicantForm.name || !applicantForm.email) return;
    setAppliedJob(jobModal.title);
    setJobModal(null);
  };

  // Nav categories
  const NAV_SECTIONS = [
    {
      heading: "Platform & Economics",
      items: [
        { id: "Pricing", label: "Fee Schedule & Calculator", icon: CreditCard },
        { id: "Negotiation Guide", label: "Bargaining Playbook", icon: BookOpen },
        { id: "API Docs", label: "Developer REST API", icon: Code2 },
      ],
    },
    {
      heading: "Trust & Support",
      items: [
        { id: "Help Center", label: "Help Center & FAQ", icon: HelpCircle },
        { id: "Trust & Safety", label: "Escrow & Guarantee", icon: ShieldCheck },
        { id: "Contact", label: "Enterprise Support Form", icon: Mail },
      ],
    },
    {
      heading: "Company",
      items: [
        { id: "About", label: "About SellX", icon: Building2 },
        { id: "Careers", label: "Careers & Open Roles", icon: Briefcase },
        { id: "Press", label: "Press & Media Kit", icon: Newspaper },
      ],
    },
    {
      heading: "Legal & Compliance",
      items: [
        { id: "Privacy", label: "Privacy Policy", icon: Lock },
        { id: "Terms", label: "Terms of Service", icon: FileText },
        { id: "Security", label: "Platform Security", icon: Shield },
      ],
    },
  ];

  // FAQs
  const FAQS = [
    {
      category: "Escrow & Payments",
      q: "How does the SellX Escrow Protection work?",
      a: "When a deal is locked, the buyer deposits funds into the secure SellX escrow account. Funds are only disbursed to the seller once the buyer receives and inspects the item within the 48-hour verification window.",
    },
    {
      category: "Trading & RFQs",
      q: "Are prices negotiable on all items?",
      a: "Yes! Every listing on SellX features direct RFQ (Request for Quote) bargaining. Buyers can submit target prices and sellers can accept, counter-offer, or enable automatic floor price bots.",
    },
    {
      category: "Returns & Disputes",
      q: "What if an item is not as described upon physical inspection?",
      a: "Buyers have a guaranteed 48-hour inspection window after delivery. If the item differs from its listing description or health metrics, our Trust & Safety team issues a full 100% refund from escrow.",
    },
    {
      category: "Seller Tools",
      q: "How do seller automated floor price rules work?",
      a: "Sellers can set minimum floor prices and auto-accept thresholds in their Trade Desk. Inbound offers at or above the threshold lock instantly, while lowball offers are automatically filtered.",
    },
    {
      category: "Escrow & Payments",
      q: "What payment methods are supported for escrow checkout?",
      a: "We support UPI (GPay, PhonePe, Paytm), all major Credit/Debit cards (Visa, Mastercard, RuPay), and Net Banking across 50+ Indian banks.",
    },
  ];

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCat = activeFaqCategory === "All" || f.category === activeFaqCategory;
    const matchesQuery =
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Career positions
  const CAREERS = [
    {
      id: "eng-01",
      title: "Senior Full-Stack Engineer (Node.js & React)",
      department: "Engineering",
      location: "Bengaluru, KA (Hybrid / Remote)",
      type: "Full-Time",
      salary: "₹28L - ₹42L + ESOPs",
      desc: "Build high-throughput bilateral negotiation pipelines, real-time WebSocket state engines, and secure escrow ledgers.",
    },
    {
      id: "prod-02",
      title: "Product Manager — Trust, Verification & Escrow",
      department: "Product",
      location: "Bengaluru, KA",
      type: "Full-Time",
      salary: "₹24L - ₹36L + ESOPs",
      desc: "Lead seller KYC verification workflows, AI price estimation tools, and buyer protection guarantee systems.",
    },
    {
      id: "ops-03",
      title: "Dispute Resolution & Operations Lead",
      department: "Trust & Safety",
      location: "Mumbai / Remote",
      type: "Full-Time",
      salary: "₹14L - ₹20L",
      desc: "Oversee fair trade arbitration, inspection guarantees, and customer satisfaction during high-value deals.",
    },
  ];

  // Commission math
  const sellerFeeRate = 0.015;
  const sellerFee = Math.round(calcPrice * sellerFeeRate);
  const sellerPayout = calcPrice - sellerFee;

  return (
    <div className="sellx-rise space-y-8 pb-12">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--line)]">
        <div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--mist)] hover:text-[var(--paper)] mb-2 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Trade Desk
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--paper)] tracking-tight">
              {NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.id === currentTab)?.label || currentTab}
            </h1>
            <Badge tone="teal">Official Documentation</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton onClick={onClose} icon={ArrowLeft}>
            Exit to Platform
          </GhostButton>
        </div>
      </div>

      {/* Main 2-Column Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm space-y-5">
            {NAV_SECTIONS.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--mist-dim)] font-mono px-3">
                  {section.heading}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setContactSubmitted(false);
                          setAppliedJob(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                          isActive
                            ? "bg-[var(--teal)] text-[var(--on-teal)] shadow-sm font-semibold"
                            : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={14} className="shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight size={13} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Direct Assistance Card */}
          <div className="p-4 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--paper)]">
              <Headphones size={14} className="text-[var(--teal)]" />
              <span>Live Support Hotline</span>
            </div>
            <p className="text-[11px] text-[var(--mist)] leading-relaxed">
              Have an active high-value trade negotiation requiring escrow mediation?
            </p>
            <button
              onClick={() => setCurrentTab("Contact")}
              className="w-full py-2 px-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold text-[var(--paper)] hover:border-[var(--teal)] transition-colors"
            >
              Open Support Ticket &rarr;
            </button>
          </div>
        </div>

        {/* Right Content Area (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
          {/* PRICING & FEE CALCULATOR */}
          {currentTab === "Pricing" && (
            <div className="space-y-8 sellx-rise">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Commercial Structure
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Transparent 1.5% Fee Schedule
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1.5 leading-relaxed">
                  SellX operates on a pure success-based model. Zero listing fees, zero buyer markups, and zero recurring charges.
                </p>
              </div>

              {/* 3 Tier Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/50 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--teal)] font-mono">
                    Buyer Access
                  </div>
                  <div className="text-3xl font-bold font-mono text-[var(--paper)]">₹0</div>
                  <div className="text-xs font-semibold text-[var(--green)] flex items-center gap-1">
                    <CheckCheck size={13} /> 100% Free Forever
                  </div>
                  <p className="text-xs text-[var(--mist)] leading-relaxed pt-1">
                    Direct access to verified listings, bilateral negotiation room, and buyer escrow protection.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--teal)]/40 bg-[var(--teal)]/5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <Badge tone="teal">Standard</Badge>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--teal)] font-mono">
                    Seller Closing Fee
                  </div>
                  <div className="text-3xl font-bold font-mono text-[var(--paper)]">1.5%</div>
                  <div className="text-xs font-semibold text-[var(--paper)] flex items-center gap-1">
                    <Percent size={13} className="text-[var(--teal)]" /> Only on Successful Payout
                  </div>
                  <p className="text-xs text-[var(--mist)] leading-relaxed pt-1">
                    Covers payment processing, automated negotiation bots, and dispute resolution guarantee.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/50 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--amber)] font-mono">
                    Escrow &amp; Logistics
                  </div>
                  <div className="text-3xl font-bold font-mono text-[var(--paper)]">Included</div>
                  <div className="text-xs font-semibold text-[var(--amber)] flex items-center gap-1">
                    <ShieldCheck size={13} /> Bank-Vault Held
                  </div>
                  <p className="text-xs text-[var(--mist)] leading-relaxed pt-1">
                    48-hour inspection window and verified safe delivery verification before fund disbursement.
                  </p>
                </div>
              </div>

              {/* Interactive Earnings Calculator Form */}
              <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/30 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[var(--paper)] flex items-center gap-2">
                    <TrendingUp size={16} className="text-[var(--teal)]" /> Live Seller Net Payout Simulator
                  </h3>
                  <span className="text-xs font-mono text-[var(--mist-dim)]">1.5% Commission</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--mist)]">Negotiated Closing Price:</span>
                    <span className="font-mono text-base font-bold text-[var(--paper)]">{fmtINR(calcPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="250000"
                    step="1000"
                    value={calcPrice}
                    onChange={(e) => setCalcPrice(Number(e.target.value))}
                    className="w-full accent-[var(--teal)] cursor-pointer h-2 bg-[var(--surface)] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[var(--mist-dim)]">
                    <span>₹5,000</span>
                    <span>₹1,00,000</span>
                    <span>₹2,50,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--line)]">
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                    <span className="text-[10px] uppercase font-bold text-[var(--mist)] block">Platform Fee (1.5%)</span>
                    <span className="text-base font-mono font-bold text-[var(--price)] tabular-nums">
                      - {fmtINR(sellerFee)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--green)]/10 border border-[var(--green)]/30">
                    <span className="text-[10px] uppercase font-bold text-[var(--green)] block">Your Net Bank Deposit</span>
                    <span className="text-lg font-mono font-bold text-[var(--green)] tabular-nums">
                      {fmtINR(sellerPayout)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
                <span className="text-xs text-[var(--mist)]">Ready to list and configure your floor-price bots?</span>
                <PrimaryButton
                  tone="teal"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate("seller", "desk");
                  }}
                >
                  Go to Seller Trade Desk &rarr;
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* NEGOTIATION PLAYBOOK */}
          {currentTab === "Negotiation Guide" && (
            <div className="space-y-6 sellx-rise">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Trade Desk Playbook
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Bargaining &amp; Term Sheet Strategy
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1 leading-relaxed">
                  Proven techniques to reach fair bilateral market clearing without endless messaging friction.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--paper)]">
                    <span className="w-6 h-6 rounded-full bg-[var(--teal)]/20 text-[var(--teal)] flex items-center justify-center font-mono text-xs">
                      01
                    </span>
                    The 10–18% Anchor Principle
                  </div>
                  <p className="text-xs text-[var(--mist)] leading-relaxed pl-8">
                    Data shows opening offers between 10% and 18% below list price have an <strong>84% counter-offer rate</strong>. Offers exceeding 35% discount trigger seller automated floor price bots and are rejected instantly.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--paper)]">
                    <span className="w-6 h-6 rounded-full bg-[var(--teal)]/20 text-[var(--teal)] flex items-center justify-center font-mono text-xs">
                      02
                    </span>
                    The Halfway Equilibrium Rule
                  </div>
                  <p className="text-xs text-[var(--mist)] leading-relaxed pl-8">
                    When negotiating, use the <strong>Split Halfway</strong> preset in the Deal Room. Reaching a midpoint concession signals serious buyer commitment and unlocks fast seller agreement.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--paper)]">
                    <span className="w-6 h-6 rounded-full bg-[var(--teal)]/20 text-[var(--teal)] flex items-center justify-center font-mono text-xs">
                      03
                    </span>
                    Time-Limited Locks &amp; Escrow Deposit
                  </div>
                  <p className="text-xs text-[var(--mist)] leading-relaxed pl-8">
                    Clicking <strong>Accept &amp; Lock</strong> freezes the offer terms for exactly 24 hours. During this window, the item is removed from public catalog to ensure exclusive closing.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <PrimaryButton
                  tone="teal"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate("buyer", "catalog");
                  }}
                >
                  Browse Catalog &amp; Negotiate &rarr;
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* DEVELOPER REST API */}
          {currentTab === "API Docs" && (
            <div className="space-y-6 sellx-rise">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  API Reference v1.0
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Developer REST &amp; Webhook Endpoints
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1">
                  Connect your automated inventory feed, floor pricing engines, and order management tools.
                </p>
              </div>

              <div className="space-y-3 font-mono">
                {[
                  { method: "GET", path: "/api/products", desc: "Retrieve all active pre-owned listings & pricing" },
                  { method: "POST", path: "/api/deals", desc: "Initialize a bilateral negotiation thread" },
                  { method: "POST", path: "/api/deals/:id/messages", desc: "Send chat messages or new counter offers" },
                  { method: "POST", path: "/api/deals/:id/accept", desc: "Lock terms and generate 24h checkout token" },
                  { method: "PUT", path: "/api/products/:id/automation", desc: "Configure seller floor & auto-accept bot rules" },
                  { method: "POST", path: "/api/products/:id/automation/simulate", desc: "Test hypothetical offer responses" },
                ].map((ep, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--teal)]/20 text-[var(--teal)]">
                        {ep.method}
                      </span>
                      <span className="text-xs text-[var(--paper)] truncate font-semibold">{ep.path}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-sans text-[var(--mist)] hidden md:inline">{ep.desc}</span>
                      <button
                        onClick={() => copyToClipboard(`curl http://localhost:5001${ep.path}`, `ep-${i}`)}
                        className="px-2 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--mist)] hover:text-[var(--paper)] flex items-center gap-1 shrink-0"
                      >
                        {copiedEndpoint === `ep-${i}` ? <Check size={12} className="text-[var(--green)]" /> : <Copy size={12} />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--ink)] text-xs text-[var(--paper)] font-mono space-y-2">
                <div className="text-[10px] text-[var(--mist-dim)] uppercase tracking-wider">Example cURL Request:</div>
                <code>curl -X GET http://localhost:5001/api/deals/D-1001 -H "Content-Type: application/json"</code>
              </div>
            </div>
          )}

          {/* HELP CENTER & FAQ */}
          {currentTab === "Help Center" && (
            <div className="space-y-6 sellx-rise">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Support Knowledge Base
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1">
                  Everything you need to know about trading, inspection guarantees, and escrow protection.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2.5">
                  <Search size={16} className="text-[var(--mist)] shrink-0" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search question keywords..."
                    className="w-full bg-transparent text-xs text-[var(--paper)] outline-none pl-2.5 placeholder:text-[var(--mist-dim)]"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {["All", "Escrow & Payments", "Trading & RFQs", "Returns & Disputes", "Seller Tools"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFaqCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                        activeFaqCategory === cat
                          ? "bg-[var(--teal)] text-[var(--on-teal)] border-[var(--teal)]"
                          : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 open:bg-[var(--surface2)]/80 transition-colors"
                  >
                    <summary className="text-xs font-semibold text-[var(--paper)] cursor-pointer list-none flex items-center justify-between">
                      <span className="pr-4">{faq.q}</span>
                      <ChevronRight size={15} className="text-[var(--mist)] group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="text-xs text-[var(--mist)] mt-3 leading-relaxed border-t border-[var(--line-soft)] pt-3">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* TRUST & SAFETY */}
          {currentTab === "Trust & Safety" && (
            <div className="space-y-6 sellx-rise">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Security Architecture
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Tripartite Escrow Guarantee
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1">
                  We eliminate fraud and counterparty risk from the pre-owned commerce ecosystem.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <ShieldCheck size={22} className="text-[var(--green)]" />
                  <div className="font-bold text-sm text-[var(--paper)]">Bank-Grade Escrow Vault</div>
                  <p className="text-[var(--mist)] leading-relaxed">
                    Buyer payment is held in an encrypted escrow trust account. The seller is only paid after delivery is confirmed and the 48-hour inspection period passes without disputes.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <Lock size={22} className="text-[var(--teal)]" />
                  <div className="font-bold text-sm text-[var(--paper)]">Seller Identity Verification</div>
                  <p className="text-[var(--mist)] leading-relaxed">
                    Sellers must submit government ID and trade history verification before publishing listings on the live desk.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <CheckCircle2 size={22} className="text-[var(--amber)]" />
                  <div className="font-bold text-sm text-[var(--paper)]">48-Hour Inspection Guarantee</div>
                  <p className="text-[var(--mist)] leading-relaxed">
                    Test hardware, inspect battery health, and verify IMEI/serial numbers. If the item differs from the listing, you receive an immediate 100% refund.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <AlertCircle size={22} className="text-[var(--price)]" />
                  <div className="font-bold text-sm text-[var(--paper)]">Dedicated Arbitrators</div>
                  <p className="text-[var(--mist)] leading-relaxed">
                    Our neutral support team arbitrates disputes with a target resolution window under 4 business hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT SELLX */}
          {currentTab === "About" && (
            <div className="space-y-6 sellx-rise">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Company Mission
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  The Future of Bilateral Commerce
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1 leading-relaxed">
                  SellX was founded with a singular goal: replace chaotic classifieds with professional trade desk infrastructure.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-3 text-xs leading-relaxed text-[var(--mist)]">
                <h3 className="font-bold text-sm text-[var(--paper)]">Why We Built SellX</h3>
                <p>
                  High-value pre-owned transactions (smartphones, performance laptops, motorbikes, luxury cameras) have traditionally suffered from spam, unverified lowballing, and risky cash handovers.
                </p>
                <p>
                  SellX provides institutional-grade trading mechanics: structured term sheets, automated floor price protection, real-time margin calculations, and trusted escrow settlement.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)]">
                  <div className="text-2xl font-bold font-mono text-[var(--teal)]">38+</div>
                  <div className="text-xs text-[var(--mist)] mt-1">Active Catalog Listings</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)]">
                  <div className="text-2xl font-bold font-mono text-[var(--green)]">100%</div>
                  <div className="text-xs text-[var(--mist)] mt-1">Escrow Backed Trades</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)]">
                  <div className="text-2xl font-bold font-mono text-[var(--amber)]">&lt; 24h</div>
                  <div className="text-xs text-[var(--mist)] mt-1">Average Closing Time</div>
                </div>
              </div>
            </div>
          )}

          {/* CAREERS */}
          {currentTab === "Careers" && (
            <div className="space-y-6 sellx-rise">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  We're Hiring
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Join the Engineering &amp; Product Team
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1">
                  Help us build the next generation of financial trading mechanics for pre-owned goods.
                </p>
              </div>

              {appliedJob && (
                <div className="p-4 rounded-2xl bg-[var(--green)]/10 border border-[var(--green)]/30 text-xs text-[var(--green)] flex items-center gap-2.5">
                  <CheckCircle2 size={18} />
                  <span>
                    Application received for <strong>{appliedJob}</strong>! Our recruitment team will review your details within 48 hours.
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {CAREERS.map((job) => (
                  <div key={job.id} className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-[var(--paper)]">{job.title}</h3>
                        <div className="text-xs text-[var(--mist)] mt-0.5">
                          {job.department} &middot; {job.location}
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[var(--teal)] px-2.5 py-1 rounded-lg bg-[var(--teal)]/10 border border-[var(--teal)]/20 w-max">
                        {job.salary}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--mist)] leading-relaxed">{job.desc}</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => setJobModal(job)}
                        className="px-4 py-2 rounded-xl bg-[var(--teal)] text-[var(--on-teal)] text-xs font-semibold hover:bg-[var(--teal-dim)] transition-colors"
                      >
                        Apply for Position &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Job Application Modal Form */}
              {jobModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                  <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4 sellx-pop">
                    <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                      <div>
                        <h3 className="font-bold text-sm text-[var(--paper)]">Apply: {jobModal.title}</h3>
                        <span className="text-[11px] text-[var(--mist)]">{jobModal.department} &middot; {jobModal.location}</span>
                      </div>
                      <button onClick={() => setJobModal(null)} className="text-[var(--mist)] hover:text-[var(--paper)]">
                        <X size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleJobSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={applicantForm.name}
                          onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                          placeholder="e.g. Abhishek Singh"
                          className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={applicantForm.email}
                          onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                          placeholder="you@email.com"
                          className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1">Portfolio / GitHub / LinkedIn URL</label>
                        <input
                          type="url"
                          required
                          value={applicantForm.portfolio}
                          onChange={(e) => setApplicantForm({ ...applicantForm, portfolio: e.target.value })}
                          placeholder="https://github.com/yourhandle"
                          className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1">Why SellX?</label>
                        <textarea
                          rows={3}
                          value={applicantForm.cover}
                          onChange={(e) => setApplicantForm({ ...applicantForm, cover: e.target.value })}
                          placeholder="Briefly tell us what excites you about bilateral trading..."
                          className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-[var(--paper)] outline-none focus:border-[var(--teal)] resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <GhostButton onClick={() => setJobModal(null)} className="flex-1">
                          Cancel
                        </GhostButton>
                        <PrimaryButton tone="teal" type="submit" className="flex-1">
                          Submit Application
                        </PrimaryButton>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTACT & ENTERPRISE INQUIRIES */}
          {currentTab === "Contact" && (
            <div className="space-y-6 sellx-rise">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Direct Inquiries
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Enterprise Support &amp; Partnerships
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1">
                  Our trade desk operations team responds within 2 business hours.
                </p>
              </div>

              {contactSubmitted ? (
                <div className="p-8 rounded-2xl bg-[var(--green)]/10 border border-[var(--green)]/30 text-center space-y-3">
                  <CheckCircle2 size={36} className="text-[var(--green)] mx-auto" />
                  <h3 className="font-bold text-base text-[var(--paper)]">Support Request Logged</h3>
                  <p className="text-xs text-[var(--mist)] max-w-md mx-auto leading-relaxed">
                    Thank you {contactForm.name}! Your ticket has been assigned ID <strong>#TKT-{Math.floor(100000 + Math.random() * 900000)}</strong>. A confirmation email has been dispatched to {contactForm.email}.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="mt-4 text-xs font-semibold text-[var(--teal)] hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Abhishek Singh"
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1.5">Work Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="abhishek@domain.com"
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1.5">Department / Inquiry Type</label>
                      <select
                        value={contactForm.department}
                        onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                      >
                        <option value="General Support">General Platform Support</option>
                        <option value="Escrow Mediation">Escrow &amp; Payment Mediation</option>
                        <option value="Seller Onboarding">Verified Seller Onboarding</option>
                        <option value="API Partnerships">Developer API &amp; Integrations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1.5">Priority Level</label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                      >
                        <option value="Standard">Standard (2–4 hours)</option>
                        <option value="Urgent">Urgent (Active Negotiation Hold)</option>
                        <option value="Enterprise">Enterprise Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--mist)] mb-1.5">Message / Inquiry Details</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your inquiry or reference active Deal ID..."
                      className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--paper)] outline-none focus:border-[var(--teal)] resize-none"
                    />
                  </div>

                  <PrimaryButton tone="teal" icon={Send} type="submit" className="w-full sm:w-auto">
                    Submit Inquiry Form
                  </PrimaryButton>
                </form>
              )}
            </div>
          )}

          {/* PRESS & MEDIA */}
          {currentTab === "Press" && (
            <div className="space-y-6 sellx-rise text-xs">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Media &amp; Public Relations
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  SellX Media Kit &amp; Press Assets
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1">
                  Brand assets, press releases, and editorial photography guidelines.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                <span className="font-bold text-sm text-[var(--paper)]">Press Contact</span>
                <p className="text-[var(--mist)] leading-relaxed">
                  For interviews with our founding team, platform data requests, or commentary on pre-owned electronics trading trends, email <strong>press@sellx.trade</strong>.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)]">
                <div>
                  <div className="font-bold text-sm text-[var(--paper)]">Official Brand Asset Pack (2026)</div>
                  <div className="text-[11px] text-[var(--mist)] mt-0.5">High-res SVG marks, Sapphire Nightfall tokens, and typeface guides.</div>
                </div>
                <button
                  onClick={() => alert("Downloading SellX Brand Asset Kit (.ZIP)...")}
                  className="px-4 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--paper)] hover:bg-[var(--surface3)] font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Download size={14} /> Download ZIP
                </button>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {currentTab === "Privacy" && (
            <div className="space-y-5 sellx-rise text-xs text-[var(--mist)] leading-relaxed">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Compliance
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">Privacy Policy</h2>
                <p className="text-xs text-[var(--mist-dim)] mt-1">Last revised: September 2026</p>
              </div>

              <div className="space-y-4 border-t border-[var(--line)] pt-4">
                <div>
                  <h3 className="font-bold text-sm text-[var(--paper)] mb-1">1. Information Governance</h3>
                  <p>
                    SellX strictly collects data required to execute bilateral negotiations, manage escrow transactions, and coordinate verified courier handoffs. We never monetize or distribute trading transcripts to third-party ad brokers.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--paper)] mb-1">2. Cryptographic Security</h3>
                  <p>
                    All deal communications, counter offers, and banking details are encrypted in transit with TLS 1.3 and at rest with AES-256 standard encryption.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {currentTab === "Terms" && (
            <div className="space-y-5 sellx-rise text-xs text-[var(--mist)] leading-relaxed">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Trading Rules
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Terms of Service &amp; Trading Rules
                </h2>
                <p className="text-xs text-[var(--mist-dim)] mt-1">Last revised: September 2026</p>
              </div>

              <div className="space-y-4 border-t border-[var(--line)] pt-4">
                <div>
                  <h3 className="font-bold text-sm text-[var(--paper)] mb-1">1. Binding Term Sheets</h3>
                  <p>
                    Once an offer is locked by both parties via the <strong>Accept &amp; Lock</strong> control, the price and timeline terms become legally binding for the 24-hour checkout window.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--paper)] mb-1">2. Condition Disclosures</h3>
                  <p>
                    Sellers are legally liable for battery health, cosmetic flaws, and accessory accuracy stated in listing descriptions. Failure to disclose defects triggers automated escrow refunding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ESCROW SECURITY */}
          {currentTab === "Security" && (
            <div className="space-y-6 sellx-rise text-xs">
              <div>
                <div className="text-[11px] font-mono text-[var(--teal)] uppercase tracking-wider font-semibold">
                  Cybersecurity
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--paper)] mt-1">
                  Platform &amp; Financial Security
                </h2>
                <p className="text-sm text-[var(--mist)] mt-1">
                  Enterprise infrastructure safeguarding millions in bilateral trades.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <Shield size={20} className="text-[var(--green)]" />
                  <div className="font-bold text-sm text-[var(--paper)]">PCI-DSS Level 1</div>
                  <p className="text-[var(--mist)] leading-relaxed">
                    Zero raw card data touches SellX application servers. All processing is tokenized through RBI-authorized banking partners.
                  </p>
                </div>
                <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <Lock size={20} className="text-[var(--teal)]" />
                  <div className="font-bold text-sm text-[var(--paper)]">Bargaining Bot Safeguards</div>
                  <p className="text-[var(--mist)] leading-relaxed">
                    Automated rate limiting and fraud scoring prevent adversarial price manipulation and rapid-fire spam offers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
