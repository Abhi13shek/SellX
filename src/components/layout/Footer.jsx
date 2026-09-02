import React from "react";
import { Mail, Globe, Linkedin, Github, BadgeCheck } from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { FOOTER_LINKS } from "../../data/constants.js";
import { CATEGORY_STYLES } from "../../utils/styles.js";

export function Footer({ onNavigate, onDemoAction }) {
  const PLATFORM_ACTIONS = {
    Catalog: () => onNavigate("buyer", "catalog"),
    "Trade Desk": () => onNavigate("seller", "desk"),
    "Deal Room": () => onNavigate(null, "dealroom"),
    Pricing: () => onDemoAction("Pricing"),
  };

  return (
    <footer className="mt-14 border-t border-[var(--line)] bg-[var(--surface)] transition-colors">
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, #2563eb, #38bdf8, #6366f1)` }}
      />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size="md" />
            </div>
            <p className="text-sm text-[var(--mist)] mt-3.5 leading-relaxed max-w-xs">
              Direct buyer-to-seller trade desk. Transparent margin intelligence, fair terms, faster closings.
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] sellx-pulse" />
              <span className="text-xs text-[var(--mist)]">All systems operational</span>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <a
                href="mailto:hello@sellx.trade"
                className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)] hover:border-[var(--teal)]/40 transition-colors"
                title="hello@sellx.trade"
              >
                <Mail size={14} />
              </a>
              {[
                ["Globe", Globe],
                ["LinkedIn", Linkedin],
                ["GitHub", Github],
              ].map(([label, Icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onDemoAction(label)}
                  className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface2)] hover:border-[var(--teal)]/40 transition-colors"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--paper)] mb-3.5">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => (heading === "Platform" ? PLATFORM_ACTIONS[l]() : onDemoAction(l))}
                      className="text-sm text-[var(--mist)] hover:text-[var(--paper)] transition-colors text-left"
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
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--mist-dim)] mb-3">Categories on the desk</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {Object.entries(CATEGORY_STYLES).map(([name, color]) => (
              <span key={name} className="flex items-center gap-1.5 text-xs text-[var(--mist)]">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] text-[11px] font-semibold text-[var(--mist)] bg-[var(--surface2)]">
            <BadgeCheck size={12} className="text-[var(--teal)]" /> Verified enterprise suppliers
          </span>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-[var(--line-soft)]">
          <span className="text-xs text-[var(--mist-dim)]">&copy; 2026 SellX Trade Desk, Inc. All rights reserved.</span>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Security"].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onDemoAction(l)}
                className="text-xs text-[var(--mist-dim)] hover:text-[var(--paper)] transition-colors"
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
