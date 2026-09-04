import React, { useState } from "react";
import {
  X,
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
  ExternalLink,
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
} from "lucide-react";
import { fmtINR } from "../../utils/formatters.js";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { Badge } from "../common/Badge.jsx";

export function FooterInfoModal({ isOpen, topic, onClose, onNavigate }) {
  const [activeTab, setActiveTab] = useState(topic || "Pricing");
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
  const [faqSearch, setFaqSearch] = useState("");
  const [appliedJob, setAppliedJob] = useState(null);

  // Sync state when topic prop changes
  React.useEffect(() => {
    if (topic) {
      setActiveTab(topic);
      setContactSubmitted(false);
      setAppliedJob(null);
    }
  }, [topic]);

  if (!isOpen) return null;

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

  const TABS = [
    { id: "Pricing", label: "Pricing & Fees", icon: CreditCard },
    { id: "Help Center", label: "Help & FAQ", icon: HelpCircle },
    { id: "Negotiation Guide", label: "Bargaining Guide", icon: BookOpen },
    { id: "API Docs", label: "API Reference", icon: Code2 },
    { id: "Trust & Safety", label: "Trust & Safety", icon: ShieldCheck },
    { id: "About", label: "About SellX", icon: Building2 },
    { id: "Careers", label: "Careers (3)", icon: Briefcase },
    { id: "Contact", label: "Contact Us", icon: Mail },
    { id: "Press", label: "Press Kit", icon: Newspaper },
    { id: "Privacy", label: "Privacy Policy", icon: Lock },
    { id: "Terms", label: "Terms of Service", icon: FileText },
    { id: "Security", label: "Escrow Security", icon: Shield },
  ];

  const FAQS = [
    {
      q: "How does the SellX Escrow Protection work?",
      a: "When a deal is locked, the buyer deposits funds into the secure SellX escrow account. Funds are only disbursed to the seller once the buyer receives and inspects the item within the 48-hour verification window.",
    },
    {
      q: "Are prices negotiable on all items?",
      a: "Yes! Every listing on SellX features direct RFQ (Request for Quote) bargaining. Buyers can submit target prices and sellers can accept, counter-offer, or enable automatic floor price bots.",
    },
    {
      q: "What if an item is not as described?",
      a: "Buyers have a guaranteed 48-hour inspection window after delivery. If the item differs from its listing description, our Trust & Safety team issues a full 100% refund from escrow.",
    },
    {
      q: "How do seller automated floor price rules work?",
      a: "Sellers can set minimum floor prices and auto-accept thresholds in their Trade Desk. Inbound offers at or above the threshold lock instantly, while lowball offers are automatically filtered.",
    },
    {
      q: "What payment methods are supported for escrow checkout?",
      a: "We support UPI (GPay, PhonePe, Paytm), all major Credit/Debit cards (Visa, Mastercard, RuPay), and Net Banking across 50+ Indian banks.",
    },
  ];

  const filteredFaqs = FAQS.filter(
    (f) => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const CAREERS = [
    {
      id: "eng-01",
      title: "Senior Full-Stack Engineer (Node.js & React)",
      department: "Engineering",
      location: "Bengaluru (Hybrid / Remote)",
      type: "Full-Time",
      desc: "Build high-throughput negotiation pipelines, real-time WebSocket state engines, and secure escrow ledgers.",
    },
    {
      id: "prod-02",
      title: "Product Manager — Trust, Verification & Escrow",
      department: "Product",
      location: "Bengaluru, KA",
      type: "Full-Time",
      desc: "Lead seller KYC verification workflows, AI price estimation tools, and buyer protection guarantees.",
    },
    {
      id: "ops-03",
      title: "Dispute Resolution & Operations Lead",
      department: "Trust & Safety",
      location: "Mumbai / Remote",
      type: "Full-Time",
      desc: "Oversee fair trade arbitration, inspection guarantees, and customer satisfaction during high-value deals.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 sellx-rise">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface2)]/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--teal)]/10 border border-[var(--teal)]/20 flex items-center justify-center text-[var(--teal)]">
              {React.createElement(TABS.find((t) => t.id === activeTab)?.icon || FileText, { size: 16 })}
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[var(--paper)]">
                {TABS.find((t) => t.id === activeTab)?.label || activeTab}
              </h2>
              <p className="text-[11px] text-[var(--mist)]">SellX Platform Resources &amp; Documentation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] flex items-center justify-center transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Layout: Left Nav + Right Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Nav */}
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[var(--line)] bg-[var(--surface2)]/20 p-2 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 shrink-0 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setContactSubmitted(false);
                    setAppliedJob(null);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all text-left ${
                    isSelected
                      ? "bg-[var(--teal)] text-[var(--on-teal)] shadow-sm font-semibold"
                      : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)]"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Scrollable Body */}
          <div className="flex-1 p-5 md:p-7 overflow-y-auto space-y-6">
            {/* PRICING & FEES */}
            {activeTab === "Pricing" && (
              <div className="space-y-6 sellx-rise">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--paper)]">Transparent Fee Schedule</h3>
                  <p className="text-xs text-[var(--mist)] mt-1 leading-relaxed">
                    Zero surprise charges. Sellers keep up to 98.5% of closing amounts with zero listing fees.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[var(--surface2)]/50 border border-[var(--line)]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--teal)] font-mono">Buyers</div>
                    <div className="text-2xl font-bold font-mono text-[var(--paper)] mt-1">₹0</div>
                    <p className="text-xs text-[var(--mist)] mt-1">100% Free for buyers. Zero commission or hidden markups.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--surface2)]/50 border border-[var(--line)]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--green)] font-mono">Verified Sellers</div>
                    <div className="text-2xl font-bold font-mono text-[var(--paper)] mt-1">1.5%</div>
                    <p className="text-xs text-[var(--mist)] mt-1">Only charged when a deal successfully closes &amp; pays.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--surface2)]/50 border border-[var(--line)]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--amber)] font-mono">Escrow Protection</div>
                    <div className="text-2xl font-bold font-mono text-[var(--paper)] mt-1">Included</div>
                    <p className="text-xs text-[var(--mist)] mt-1">Bank-grade vault hold &amp; 48-hr buyer inspection guarantee.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/30 space-y-2">
                  <h4 className="text-xs font-bold text-[var(--paper)] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[var(--teal)]" /> Trade Desk Perks for Power Sellers
                  </h4>
                  <ul className="text-xs text-[var(--mist)] space-y-1.5 list-disc list-inside">
                    <li>24/7 Automated Floor-Price Negotiation Bots with custom strategy thresholds</li>
                    <li>Live Margin Health Intelligence and real-time counter offer simulator</li>
                    <li>Priority placement in category search and Instant 1-Click checkout generation</li>
                  </ul>
                </div>

                <div className="flex justify-end pt-2">
                  <PrimaryButton
                    tone="teal"
                    onClick={() => {
                      onClose();
                      if (onNavigate) onNavigate("seller", "desk");
                    }}
                  >
                    Open Seller Trade Desk &rarr;
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* HELP CENTER & FAQ */}
            {activeTab === "Help Center" && (
              <div className="space-y-5 sellx-rise">
                <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3.5 py-2">
                  <Search size={15} className="text-[var(--mist)] shrink-0" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search help topics, return policy, escrow..."
                    className="w-full bg-transparent text-xs text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
                  />
                </div>

                <div className="space-y-3">
                  {filteredFaqs.map((faq, i) => (
                    <details key={i} className="group p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 open:bg-[var(--surface2)]/80 transition-colors">
                      <summary className="text-xs font-semibold text-[var(--paper)] cursor-pointer list-none flex items-center justify-between">
                        <span>{faq.q}</span>
                        <ChevronRight size={14} className="text-[var(--mist)] group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="text-xs text-[var(--mist)] mt-2.5 leading-relaxed border-t border-[var(--line-soft)] pt-2.5">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/20 flex items-center justify-between">
                  <span className="text-xs text-[var(--mist)]">Need direct assistance with an active negotiation?</span>
                  <button
                    onClick={() => setActiveTab("Contact")}
                    className="text-xs font-semibold text-[var(--teal)] hover:underline"
                  >
                    Contact Support &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* NEGOTIATION GUIDE */}
            {activeTab === "Negotiation Guide" && (
              <div className="space-y-5 sellx-rise">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--paper)]">Bargaining &amp; Counter-Offer Playbook</h3>
                  <p className="text-xs text-[var(--mist)] mt-1">
                    Master the art of high-conversion bilateral trade negotiation on SellX.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1.5">
                    <span className="font-bold text-[var(--paper)] flex items-center gap-1.5">
                      1. The First Anchor Offer
                    </span>
                    <p className="text-[var(--mist)] leading-relaxed">
                      Propose an opening offer within 10–18% of list price. Extreme lowballs (&gt;35% discount) frequently trigger automated seller bot rejections.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1.5">
                    <span className="font-bold text-[var(--paper)] flex items-center gap-1.5">
                      2. Split the Difference (Halfway Rule)
                    </span>
                    <p className="text-[var(--mist)] leading-relaxed">
                      Use the quick-counter presets in the Deal Room (-5%, -10%, Halfway) to converge on a fair market equilibrium without endless back-and-forth messaging.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1.5">
                    <span className="font-bold text-[var(--paper)] flex items-center gap-1.5">
                      3. Fast Closing with Locked Terms
                    </span>
                    <p className="text-[var(--mist)] leading-relaxed">
                      When either party clicks <strong>Accept &amp; Lock</strong>, the price is guaranteed for 24 hours. The item is held exclusively while escrow checkout completes.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <PrimaryButton
                    tone="teal"
                    onClick={() => {
                      onClose();
                      if (onNavigate) onNavigate("buyer", "catalog");
                    }}
                  >
                    Start Negotiating on Catalog &rarr;
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* API DOCS */}
            {activeTab === "API Docs" && (
              <div className="space-y-4 sellx-rise font-mono">
                <div>
                  <h3 className="font-display font-sans text-lg font-bold text-[var(--paper)]">Developer REST API</h3>
                  <p className="text-xs font-sans text-[var(--mist)] mt-1">
                    Integrate your inventory, automated trading bots, and deal hooks via JSON endpoints.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { method: "GET", path: "/api/products", desc: "List all active catalog products & pricing" },
                    { method: "POST", path: "/api/deals", desc: "Open a new RFQ negotiation deal thread" },
                    { method: "POST", path: "/api/deals/:id/messages", desc: "Post a chat message or offer to thread" },
                    { method: "POST", path: "/api/deals/:id/counter", desc: "Propose structured counter terms" },
                    { method: "PUT", path: "/api/products/:id/automation", desc: "Configure seller auto-accept & floor rules" },
                  ].map((ep, i) => (
                    <div key={i} className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--teal)]/20 text-[var(--teal)]">
                          {ep.method}
                        </span>
                        <span className="text-xs text-[var(--paper)] truncate">{ep.path}</span>
                        <span className="text-[11px] font-sans text-[var(--mist)] hidden sm:inline">&mdash; {ep.desc}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`curl http://localhost:5001${ep.path}`, `ep-${i}`)}
                        className="text-xs text-[var(--mist)] hover:text-[var(--paper)] flex items-center gap-1 shrink-0 p-1 rounded hover:bg-[var(--surface3)]"
                      >
                        {copiedEndpoint === `ep-${i}` ? <Check size={13} className="text-[var(--green)]" /> : <Copy size={13} />}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--ink)] text-[11px] text-[var(--paper)]">
                  <div className="text-[10px] text-[var(--mist-dim)] mb-1"># Quick Test Example</div>
                  <code>curl -X GET http://localhost:5001/api/deals -H "Accept: application/json"</code>
                </div>
              </div>
            )}

            {/* TRUST & SAFETY */}
            {activeTab === "Trust & Safety" && (
              <div className="space-y-5 sellx-rise">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--paper)]">100% Secure Trade Guarantee</h3>
                  <p className="text-xs text-[var(--mist)] mt-1">
                    Every transaction on SellX is protected by tripartite escrow and seller identity verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1.5">
                    <ShieldCheck size={18} className="text-[var(--green)]" />
                    <div className="font-bold text-[var(--paper)]">Escrow Vault Protection</div>
                    <p className="text-[var(--mist)] leading-relaxed">
                      Sellers do not receive payout until the buyer inspects and approves the item upon physical delivery.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1.5">
                    <Lock size={18} className="text-[var(--teal)]" />
                    <div className="font-bold text-[var(--paper)]">Verified Seller KYC</div>
                    <p className="text-[var(--mist)] leading-relaxed">
                      High-volume sellers undergo identity verification and trade history auditing before receiving the Live Desk badge.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1.5">
                    <CheckCircle2 size={18} className="text-[var(--amber)]" />
                    <div className="font-bold text-[var(--paper)]">48-Hour Inspection Window</div>
                    <p className="text-[var(--mist)] leading-relaxed">
                      Full money-back refund guarantee if electronics have undisclosed defects, battery health mismatches, or counterfeit parts.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1.5">
                    <AlertCircle size={18} className="text-[var(--price)]" />
                    <div className="font-bold text-[var(--paper)]">Dispute Arbitration</div>
                    <p className="text-[var(--mist)] leading-relaxed">
                      Dedicated support arbitrators resolve payment or logistics disputes within 4 business hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT */}
            {activeTab === "About" && (
              <div className="space-y-4 sellx-rise text-xs">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--paper)]">About SellX Trade Desk</h3>
                  <p className="text-[var(--mist)] mt-1 leading-relaxed">
                    SellX is India's premier bilateral negotiation marketplace for high-value pre-owned electronics, vehicles, computing hardware, and luxury photography gear.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <h4 className="font-bold text-[var(--paper)]">Our Philosophy</h4>
                  <p className="text-[var(--mist)] leading-relaxed">
                    Traditional classifieds are broken with spam, unverified lowballers, and risky offline cash meetings. SellX replaces chaos with structured term sheets, automated floor price protection, and trusted escrow settlement.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                    <div className="font-mono text-base font-bold text-[var(--teal)]">38+</div>
                    <div className="text-[10px] text-[var(--mist)] mt-0.5">Verified Listings</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                    <div className="font-mono text-base font-bold text-[var(--green)]">100%</div>
                    <div className="text-[10px] text-[var(--mist)] mt-0.5">Escrow Backed</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                    <div className="font-mono text-base font-bold text-[var(--amber)]">&lt; 24h</div>
                    <div className="text-[10px] text-[var(--mist)] mt-0.5">Average Deal Close</div>
                  </div>
                </div>
              </div>
            )}

            {/* CAREERS */}
            {activeTab === "Careers" && (
              <div className="space-y-4 sellx-rise">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--paper)]">Join the SellX Team</h3>
                  <p className="text-xs text-[var(--mist)] mt-1">
                    We're building the future of bilateral commerce. Explore our open positions below.
                  </p>
                </div>

                {appliedJob && (
                  <div className="p-3 rounded-xl bg-[var(--green)]/10 border border-[var(--green)]/30 text-xs text-[var(--green)] flex items-center gap-2">
                    <CheckCircle2 size={15} /> Application received for <strong>{appliedJob}</strong>! Our talent team will reach out shortly.
                  </div>
                )}

                <div className="space-y-3">
                  {CAREERS.map((job) => (
                    <div key={job.id} className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-[var(--paper)]">{job.title}</h4>
                        <span className="text-[10px] font-mono text-[var(--teal)] bg-[var(--teal)]/10 px-2 py-0.5 rounded w-max">
                          {job.type} &middot; {job.location}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--mist)] leading-relaxed">{job.desc}</p>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setAppliedJob(job.title)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--teal)] text-[var(--on-teal)] text-xs font-semibold hover:bg-[var(--teal-dim)] transition-colors"
                        >
                          Apply for this role &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT */}
            {activeTab === "Contact" && (
              <div className="space-y-4 sellx-rise">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--paper)]">Contact Support &amp; Partnerships</h3>
                  <p className="text-xs text-[var(--mist)] mt-1">
                    Send us a message and our team will respond within 2 business hours.
                  </p>
                </div>

                {contactSubmitted ? (
                  <div className="p-6 rounded-2xl bg-[var(--green)]/10 border border-[var(--green)]/30 text-center space-y-2">
                    <CheckCircle2 size={28} className="text-[var(--green)] mx-auto" />
                    <h4 className="text-sm font-bold text-[var(--paper)]">Message Delivered</h4>
                    <p className="text-xs text-[var(--mist)]">
                      Thanks {contactForm.name || "there"}! We have received your inquiry and sent a confirmation to {contactForm.email}.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-3 text-xs text-[var(--teal)] font-semibold hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[var(--mist)] block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Abhishek Singh"
                          className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[var(--mist)] block mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="you@domain.com"
                          className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[var(--mist)] block mb-1">Subject</label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--teal)]"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Active Deal Support">Active Deal Support</option>
                        <option value="Seller Onboarding">Seller Onboarding &amp; Verification</option>
                        <option value="API & Partnerships">API Integration &amp; Partnerships</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[var(--mist)] block mb-1">Message</label>
                      <textarea
                        required
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="How can we assist you today?"
                        className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--paper)] outline-none focus:border-[var(--teal)] resize-none"
                      />
                    </div>

                    <PrimaryButton tone="teal" icon={Send} type="submit" className="w-full">
                      Submit Message
                    </PrimaryButton>
                  </form>
                )}
              </div>
            )}

            {/* PRESS */}
            {activeTab === "Press" && (
              <div className="space-y-4 sellx-rise text-xs">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--paper)]">Press &amp; Media Kit</h3>
                  <p className="text-[var(--mist)] mt-1">Official brand assets, logos, and media announcements.</p>
                </div>

                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-2">
                  <span className="font-bold text-[var(--paper)]">About SellX Media Relations</span>
                  <p className="text-[var(--mist)] leading-relaxed">
                    For press inquiries, founder interviews, or high-res brand kit requests, please reach out directly to <strong>press@sellx.trade</strong>.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                  <div>
                    <div className="font-bold text-[var(--paper)]">Brand Assets &amp; Logo Pack (2026)</div>
                    <div className="text-[11px] text-[var(--mist)]">SVG, PNG, and Sapphire Nightfall Color Guidelines</div>
                  </div>
                  <button
                    onClick={() => alert("Downloading SellX Brand Assets kit (ZIP)...")}
                    className="px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--paper)] hover:bg-[var(--surface3)] font-semibold transition-colors"
                  >
                    Download Assets
                  </button>
                </div>
              </div>
            )}

            {/* PRIVACY POLICY */}
            {activeTab === "Privacy" && (
              <div className="space-y-3.5 sellx-rise text-xs text-[var(--mist)] leading-relaxed">
                <h3 className="font-display text-lg font-bold text-[var(--paper)]">Privacy Policy</h3>
                <p>Last updated: September 2026</p>
                <div className="space-y-2 border-t border-[var(--line)] pt-3">
                  <h4 className="font-bold text-[var(--paper)]">1. Information We Collect</h4>
                  <p>We collect essential transactional data required to facilitate bilateral negotiation, escrow processing, and delivery coordination.</p>
                  <h4 className="font-bold text-[var(--paper)]">2. Zero Data Selling</h4>
                  <p>SellX does not sell, rent, or monetize personal buyer/seller information with third-party advertising networks.</p>
                  <h4 className="font-bold text-[var(--paper)]">3. Data Encryption</h4>
                  <p>All deal messages, counter-offers, and payment data are encrypted in transit via TLS 1.3 and at rest via AES-256.</p>
                </div>
              </div>
            )}

            {/* TERMS OF SERVICE */}
            {activeTab === "Terms" && (
              <div className="space-y-3.5 sellx-rise text-xs text-[var(--mist)] leading-relaxed">
                <h3 className="font-display text-lg font-bold text-[var(--paper)]">Terms of Service &amp; Trading Rules</h3>
                <p>Last updated: September 2026</p>
                <div className="space-y-2 border-t border-[var(--line)] pt-3">
                  <h4 className="font-bold text-[var(--paper)]">1. Binding Term Sheets</h4>
                  <p>When an offer is locked via the Accept button, both buyer and seller agree to honor the locked price and delivery timeline.</p>
                  <h4 className="font-bold text-[var(--paper)]">2. Escrow Hold Period</h4>
                  <p>Funds deposited by the buyer are held securely until the buyer completes the 48-hour inspection period or signs off on delivery.</p>
                  <h4 className="font-bold text-[var(--paper)]">3. Prohibited Items</h4>
                  <p>Trading counterfeit goods, blacklisted electronics, or damaged items without explicit condition disclosure is strictly prohibited.</p>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {activeTab === "Security" && (
              <div className="space-y-4 sellx-rise text-xs">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--paper)]">Platform &amp; Financial Security</h3>
                  <p className="text-[var(--mist)] mt-1">Enterprise-grade protection protecting every deal.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1">
                    <Shield size={16} className="text-[var(--green)]" />
                    <div className="font-bold text-[var(--paper)]">PCI-DSS Compliant</div>
                    <p className="text-[var(--mist)]">All payments processed through Level 1 PCI-DSS certified banking gateways.</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 space-y-1">
                    <Lock size={16} className="text-[var(--teal)]" />
                    <div className="font-bold text-[var(--paper)]">Anti-Fraud Engine</div>
                    <p className="text-[var(--mist)]">Automated anomaly detection filters bot spam and suspicious offer patterns.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-[var(--line)] bg-[var(--surface2)]/40 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[var(--mist-dim)]">&copy; 2026 SellX Trade Desk &middot; Live bilateral negotiation platform</span>
          <GhostButton onClick={onClose}>Close</GhostButton>
        </div>
      </div>
    </div>
  );
}
