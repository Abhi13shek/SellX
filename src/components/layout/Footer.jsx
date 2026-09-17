import React from "react";
import { Mail, Globe, Linkedin, Github, BadgeCheck } from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { FOOTER_LINKS } from "../../data/constants.js";
import { CATEGORY_STYLES } from "../../utils/styles.js";

export function Footer({ onNavigate, onOpenInfo, onSelectCategory }) {
  const PLATFORM_ACTIONS = {
    Catalog: () => onNavigate("buyer", "catalog"),
    "Trade Desk": () => onNavigate("seller", "desk"),
    "Deal Room": () => onNavigate(null, "dealroom"),
    Pricing: () => onOpenInfo("Pricing"),
  };

  const handleSocialClick = (label) => {
    if (label === "GitHub") {
      window.open("https://github.com/Abhi13shek/SellX", "_blank", "noopener,noreferrer");
    } else if (label === "Mail") {
      onOpenInfo("Contact");
    } else if (label === "Globe") {
      onOpenInfo("About");
    } else if (label === "LinkedIn") {
      onOpenInfo("Careers");
    } else {
      onOpenInfo(label);
    }
  };

  return (
    <footer className="mt-14 border-t border-[var(--line)] bg-[var(--surface)] text-[var(--paper)] transition-colors shadow-2xl relative overflow-hidden">
      {/* Sleek Gradient Accent Line */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, transparent, #10B981, #F59E0B, #10B981, transparent)` }}
      />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size="md" wordmark={true} inverted={false} />
            </div>
            <p className="text-sm text-[var(--mist)] mt-3.5 leading-relaxed max-w-xs">
              Direct bilateral trade desk. Automated floor protection, fair market equilibrium, faster closings.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[var(--mist)] font-medium">All trading systems operational</span>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => handleSocialClick("Mail")}
                className="w-8 h-8 rounded-lg border border-[var(--line)] bg-[var(--surface2)] flex items-center justify-center text-[var(--paper)] hover:bg-[var(--surface3)] hover:border-[#10B981] transition-all shadow-sm cursor-pointer"
                title="Contact Support"
              >
                <Mail size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("Globe")}
                className="w-8 h-8 rounded-lg border border-[var(--line)] bg-[var(--surface2)] flex items-center justify-center text-[var(--paper)] hover:bg-[var(--surface3)] hover:border-[#10B981] transition-all shadow-sm cursor-pointer"
                title="Global Marketplace"
              >
                <Globe size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("LinkedIn")}
                className="w-8 h-8 rounded-lg border border-[var(--line)] bg-[var(--surface2)] flex items-center justify-center text-[var(--paper)] hover:bg-[var(--surface3)] hover:border-[#10B981] transition-all shadow-sm cursor-pointer"
                title="Careers at SellX"
              >
                <Linkedin size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("GitHub")}
                className="w-8 h-8 rounded-lg border border-[var(--line)] bg-[var(--surface2)] flex items-center justify-center text-[var(--paper)] hover:bg-[var(--surface3)] hover:border-[#10B981] transition-all shadow-sm cursor-pointer"
                title="View Source on GitHub"
              >
                <Github size={14} />
              </button>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--paper)] mb-3.5">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => (heading === "Platform" && PLATFORM_ACTIONS[l] ? PLATFORM_ACTIONS[l]() : onOpenInfo(l))}
                      className="text-sm text-[var(--mist)] hover:text-[#34D399] hover:translate-x-0.5 transition-all text-left font-medium cursor-pointer"
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
        <div className="mt-10 pt-8 border-t border-[var(--line)]">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--mist)] mb-3">
            Quick Browse by Category
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {Object.entries(CATEGORY_STYLES).map(([name, color]) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(name);
                  if (onNavigate) onNavigate("buyer", "catalog");
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] hover:border-[#10B981]/50 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full shrink-0 ring-1 ring-white/20" style={{ background: color }} />
                <span className="font-medium">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => onOpenInfo("Trust & Safety")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] text-[11px] font-bold text-[var(--paper)] bg-[var(--surface2)] hover:bg-[var(--surface3)] hover:border-[#10B981] transition-all shadow-sm cursor-pointer"
          >
            <BadgeCheck size={14} className="text-emerald-400" /> 100% Escrow Backed &middot; Verified Suppliers &rarr;
          </button>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-[var(--line)]">
          <span className="text-xs text-[var(--mist)]">&copy; 2026 SellX Trade Desk, Inc. All rights reserved.</span>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Security"].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onOpenInfo(l)}
                className="text-xs text-[var(--mist)] hover:text-[var(--paper)] transition-colors font-medium cursor-pointer"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
