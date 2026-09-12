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
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { TabButton } from "../common/TabButton.jsx";

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
  onOpenAddItem,
}) {
  return (
    <header className="sticky top-0 z-30 transition-all duration-300 backdrop-blur-xl bg-[var(--surface)]/90 border-b border-[var(--line)] shadow-xs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Live Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer"
              onClick={() => setActiveTab(role === "buyer" ? "catalog" : "desk")}
              title="SellX Home"
            >
              <BrandMark size="md" wordmark={true} inverted={false} />
            </div>

            <div className="hidden lg:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--surface2)] text-[11px] font-medium text-[var(--mist)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[var(--paper)] font-semibold">C2C Recommerce Desk</span>
            </div>
          </div>

          {/* Center: Sleek Segmented Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--surface2)]/80 border border-[var(--line)] rounded-full p-1 shadow-inner">
            <TabButton
              active={activeTab === "catalog"}
              onClick={() => setActiveTab("catalog")}
              icon={LayoutGrid}
              label="Explore Marketplace"
            />
            <TabButton
              active={activeTab === "desk"}
              onClick={() => {
                if (role !== "seller") setRole("seller");
                setActiveTab("desk");
              }}
              icon={ListChecks}
              label="My Listings"
            />
            <TabButton
              active={activeTab === "dealroom"}
              onClick={() => setActiveTab("dealroom")}
              icon={MessageSquare}
              label="Bargain Chats"
              badge={stats.activeRFQs}
            />
          </nav>

          {/* Right: Quick Action CTAs & Utility Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Primary Action: Sell Item Button (Only visible in Seller Mode) */}
            {role === "seller" && (
              <button
                onClick={onOpenAddItem}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
                title="Post a new listing to sell your item"
              >
                <PlusCircle size={15} className="shrink-0" />
                <span>Sell Item</span>
              </button>
            )}

            {/* Role Switcher Pill */}
            <button
              onClick={() => {
                const nextRole = role === "buyer" ? "seller" : "buyer";
                setRole(nextRole);
                setActiveTab(nextRole === "buyer" ? "catalog" : "desk");
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--paper)] text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title={`Switch to ${role === "buyer" ? "Seller" : "Buyer"} Mode`}
            >
              {role === "buyer" ? (
                <>
                  <Store size={14} className="text-[#0474C4]" />
                  <span>Seller Mode</span>
                </>
              ) : (
                <>
                  <User size={14} className="text-emerald-500" />
                  <span>Buyer Mode</span>
                </>
              )}
            </button>

            <div className="h-5 w-[1px] bg-[var(--line)] mx-0.5 hidden sm:block" />

            {/* Saved Items Cart (Buyer Only) */}
            {role === "buyer" && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] bg-[var(--surface2)]/70 hover:bg-[var(--surface3)] text-[var(--paper)] transition-all cursor-pointer"
                title="Saved Items"
              >
                <ShoppingCart size={15} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] bg-[var(--surface2)]/70 hover:bg-[var(--surface3)] text-[var(--paper)] transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[var(--surface)]" />
              )}
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] bg-[var(--surface2)]/70 hover:bg-[var(--surface3)] text-[var(--paper)] transition-all cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun size={15} className="text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={15} className="text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Seller Sign Out */}
            {role === "seller" && sellerAuthed && (
              <button
                onClick={onSignOut}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-xs"
                title="Sign out from Seller Desk"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="flex md:hidden items-center justify-between gap-1 py-2 border-t border-[var(--line)]/50">
          <nav className="flex items-center justify-around w-full gap-1 bg-[var(--surface2)]/70 border border-[var(--line)]/70 rounded-full p-0.5">
            <TabButton
              active={activeTab === "catalog"}
              onClick={() => setActiveTab("catalog")}
              icon={LayoutGrid}
              label="Explore"
              compact={true}
            />
            <TabButton
              active={activeTab === "desk"}
              onClick={() => {
                if (role !== "seller") setRole("seller");
                setActiveTab("desk");
              }}
              icon={ListChecks}
              label="Listings"
              compact={true}
            />
            <TabButton
              active={activeTab === "dealroom"}
              onClick={() => setActiveTab("dealroom")}
              icon={MessageSquare}
              label="Chats"
              badge={stats.activeRFQs}
              compact={true}
            />
          </nav>
        </div>
      </div>
    </header>
  );
}
