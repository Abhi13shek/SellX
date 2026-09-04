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
    <footer className="mt-14 border-t border-[#0262b9] bg-[#0275DD] text-white transition-colors shadow-lg">
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, #ffffff, #93c5fd, #ffffff)` }}
      />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size="md" wordmark={true} inverted={true} />
            </div>
            <p className="text-sm text-blue-100 mt-3.5 leading-relaxed max-w-xs">
              Direct bilateral trade desk. Automated floor protection, fair market equilibrium, faster closings.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-xs text-blue-100 font-medium">All trading systems operational</span>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => handleSocialClick("Mail")}
                className="w-8 h-8 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/60 transition-all shadow-sm"
                title="Contact Support"
              >
                <Mail size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("Globe")}
                className="w-8 h-8 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/60 transition-all shadow-sm"
                title="Global Marketplace"
              >
                <Globe size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("LinkedIn")}
                className="w-8 h-8 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/60 transition-all shadow-sm"
                title="Careers at SellX"
              >
                <Linkedin size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleSocialClick("GitHub")}
                className="w-8 h-8 rounded-lg border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/60 transition-all shadow-sm"
                title="View Source on GitHub"
              >
                <Github size={14} />
              </button>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3.5">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => (heading === "Platform" && PLATFORM_ACTIONS[l] ? PLATFORM_ACTIONS[l]() : onOpenInfo(l))}
                      className="text-sm text-blue-100 hover:text-white hover:translate-x-0.5 transition-all text-left font-medium"
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
        <div className="mt-10 pt-8 border-t border-white/20">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-3">
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
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/25 bg-white/10 text-xs text-blue-50 hover:text-white hover:bg-white/20 hover:border-white/50 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full shrink-0 ring-1 ring-white/40" style={{ background: color }} />
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-[11px] font-bold text-white bg-white/10 hover:bg-white/20 hover:border-white/60 transition-all shadow-sm"
          >
            <BadgeCheck size={14} className="text-cyan-200" /> 100% Escrow Backed &middot; Verified Suppliers &rarr;
          </button>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-white/20">
          <span className="text-xs text-blue-200">&copy; 2026 SellX Trade Desk, Inc. All rights reserved.</span>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Security"].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onOpenInfo(l)}
                className="text-xs text-blue-200 hover:text-white transition-colors font-medium"
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
