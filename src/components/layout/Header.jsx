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
    <header className="sticky top-0 z-30 transition-colors duration-200 bg-[#0474C4] border-b border-[#035fa3] text-white shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="hover:scale-[1.02] transition-transform cursor-pointer"
              onClick={() => setActiveTab(role === "buyer" ? "catalog" : "desk")}
            >
              <BrandMark size="md" wordmark={true} inverted={true} />
            </div>
            <span className="hidden md:inline-flex items-center gap-2 ml-1 px-3 py-1 rounded-full border border-white/30 bg-white/15 text-[11px] font-semibold text-white shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Live desk
            </span>
          </div>

          {/* Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#035ca0] border border-[#024a80] rounded-2xl p-1 shadow-inner">
            {role === "buyer" && (
              <TabButton active={activeTab === "catalog"} onClick={() => setActiveTab("catalog")} icon={LayoutGrid} label="Catalog" onBlue={true} />
            )}
            {role === "seller" && (
              <TabButton active={activeTab === "desk"} onClick={() => setActiveTab("desk")} icon={ListChecks} label="Trade Desk" onBlue={true} />
            )}
            <TabButton active={activeTab === "dealroom"} onClick={() => setActiveTab("dealroom")} icon={MessageSquare} label="Deal Room" badge={stats.activeRFQs} onBlue={true} />
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-4 mr-2 px-3.5 py-1 rounded-xl bg-[#035ca0] border border-white/20">
              <StatPill label="Active RFQs" value={stats.activeRFQs} onBlue={true} />
              <div className="w-[1px] h-6 bg-white/20" />
              <StatPill label="Locked Deals" value={stats.lockedDeals} tone="green" onBlue={true} />
              <div className="w-[1px] h-6 bg-white/20" />
              <StatPill
                label={role === "buyer" ? "Total Savings" : "Total Margin"}
                value={fmtINR(role === "buyer" ? stats.totalSavings : stats.totalMargin, { maximumFractionDigits: 0 })}
                tone="brass"
                onBlue={true}
              />
            </div>

            {role === "buyer" && (
              <button
                onClick={onOpenCart}
                className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-xl border border-white/30 bg-white/15 text-white hover:bg-white/25 hover:border-white/60 transition-all"
                title="Cart"
              >
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md ring-2 ring-[#0474C4]">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-white/30 bg-white/15 text-white hover:bg-white/25 hover:border-white/60 transition-all"
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0474C4]" />
              )}
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/30 bg-white/15 text-white hover:bg-white/25 hover:border-white/60 transition-all"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={() => {
                const nextRole = role === "buyer" ? "seller" : "buyer";
                setRole(nextRole);
                setActiveTab(nextRole === "buyer" ? "catalog" : "desk");
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white bg-white text-[#0474C4] hover:bg-blue-50 text-xs font-bold shadow-sm transition-all"
            >
              {role === "buyer" ? (
                <Store size={14} className="text-[#0474C4]" />
              ) : (
                <User size={14} className="text-[#0474C4]" />
              )}
              <span className="hidden sm:inline font-bold">{role === "buyer" ? "Seller Mode" : "Buyer Mode"}</span>
            </button>

            {role === "seller" && sellerAuthed && (
              <button
                onClick={onSignOut}
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-red-300 bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm"
                title="Sign out from Seller Desk"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
