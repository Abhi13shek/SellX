import React from "react";
import {
  ShoppingCart,
  Bell,
  Sun,
  Moon,
  User,
  Store,
  LogOut,
  LayoutGrid,
  ListChecks,
  MessageSquare,
} from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { TabButton } from "../common/TabButton.jsx";
import { StatPill } from "../common/StatPill.jsx";
import { fmtINR } from "../../utils/formatters.js";

export function Header({
  role,
  setRole,
  theme,
  setTheme,
  stats,
  cartCount,
  onOpenCart,
  onOpenNotifications,
  unreadCount,
  activeTab,
  setActiveTab,
  sellerAuthed,
  onSignOut,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <BrandMark size="md" wordmark={true} />
            <span className="hidden md:inline-flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--surface2)] text-[11px] font-medium text-[var(--mist)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] sellx-pulse" />
              Live desk
            </span>
          </div>

          {/* Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--surface2)] border border-[var(--line)] rounded-xl p-1">
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
            <div className="relative flex items-center bg-[var(--surface2)] border border-[var(--line)] rounded-xl p-1 ml-1">
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-[var(--surface)] border border-[var(--line)] shadow-sm transition-transform duration-300 ease-out"
                style={{ transform: role === "buyer" ? "translateX(0%)" : "translateX(calc(100% + 4px))" }}
              />
              <button
                onClick={() => setRole("buyer")}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${role === "buyer" ? "text-[var(--teal)]" : "text-[var(--mist)]"}`}
              >
                <User size={13} /> <span className="hidden sm:inline">Buyer</span>
              </button>
              <button
                onClick={() => setRole("seller")}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${role === "seller" ? "text-[var(--brass)]" : "text-[var(--mist)]"}`}
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
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, #2563eb, #38bdf8, #6366f1)` }}
      />
    </header>
  );
}
