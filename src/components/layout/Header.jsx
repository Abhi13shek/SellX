import React, { useState } from "react";
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
  MoreHorizontal,
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
  isAuthenticated,
  onRequestAuth,
  onSignOut,
  onOpenAddItem,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isSeller = role === "seller";
  const primaryTabs = isSeller
    ? [
        { id: "desk", label: "Dashboard", shortLabel: "Dashboard", icon: ListChecks },
        { id: "dealroom", label: "Buyer Offers", shortLabel: "Offers", icon: MessageSquare, badge: stats.activeRFQs },
      ]
    : [
        { id: "catalog", label: "Marketplace", shortLabel: "Browse", icon: LayoutGrid },
        { id: "dealroom", label: "My Offers", shortLabel: "Offers", icon: MessageSquare, badge: stats.activeRFQs },
      ];

  const openTab = (tab) => {
    if ((tab.id === "desk" || tab.id === "dealroom") && !isAuthenticated) {
      onRequestAuth?.(tab.id === "desk" ? "open Seller Portal" : "view your offers");
      return;
    }
    if (tab.id === "desk" && !isSeller) setRole("seller");
    setActiveTab(tab.id);
  };

  const switchRole = () => {
    const nextRole = isSeller ? "buyer" : "seller";
    if (nextRole === "seller" && !isAuthenticated) {
      onRequestAuth?.("open Seller Portal");
      return;
    }
    setRole(nextRole);
    setActiveTab(nextRole === "buyer" ? "catalog" : "desk");
  };

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

          {/* Keep navigation role-specific so users see only their next useful actions. */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--surface2)]/80 border border-[var(--line)] rounded-full p-1 shadow-inner">
            {primaryTabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => openTab(tab)}
                icon={tab.icon}
                label={tab.label}
                badge={tab.badge}
              />
            ))}
          </nav>

          {/* Right: Quick Action CTAs & Utility Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Primary Action: Sell Item Button (Only visible in Seller Mode) */}
            {isSeller && (
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
              onClick={switchRole}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--paper)] text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title={isSeller ? "Browse the marketplace as a buyer" : "Open the seller workspace"}
            >
              {!isSeller ? (
                <>
                  <Store size={14} className="text-[#10B981]" />
                  <span>Start Selling</span>
                </>
              ) : (
                <>
                  <User size={14} className="text-emerald-500" />
                  <span>Browse as Buyer</span>
                </>
              )}
            </button>

            <div className="h-5 w-[1px] bg-[var(--line)] mx-0.5 hidden sm:block" />

            {/* Saved Items Cart (Buyer Only) */}
            {!isSeller && (
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
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] bg-[var(--surface2)]/70 hover:bg-[var(--surface3)] text-[var(--paper)] transition-all cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun size={15} className="text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={15} className="text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Seller Sign Out */}
            {sellerAuthed && (
              <button
                onClick={onSignOut}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                title="Sign out from Seller Desk"
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            )}

            <div className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface2)]/70 text-[var(--paper)] transition-colors hover:bg-[var(--surface3)]"
                aria-label="Open more options"
                aria-expanded={mobileMenuOpen}
              >
                <MoreHorizontal size={17} />
              </button>
              {mobileMenuOpen && (
                <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1.5 shadow-xl sellx-rise">
                  <button
                    type="button"
                    onClick={() => {
                      switchRole();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[var(--paper)] hover:bg-[var(--surface2)]"
                  >
                    {isSeller ? <User size={14} className="text-emerald-500" /> : <Store size={14} className="text-emerald-500" />}
                    {isSeller ? "Browse as buyer" : "Open seller workspace"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[var(--paper)] hover:bg-[var(--surface2)]"
                  >
                    {theme === "dark" ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
                    Use {theme === "dark" ? "light" : "dark"} theme
                  </button>
                  {sellerAuthed && (
                    <button
                      type="button"
                      onClick={() => {
                        onSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[var(--red)] hover:bg-red-500/10"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="flex md:hidden items-center justify-between gap-1 py-2 border-t border-[var(--line)]/50">
          <nav className="flex items-center justify-around w-full gap-1 bg-[var(--surface2)]/70 border border-[var(--line)]/70 rounded-full p-0.5">
            {primaryTabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => openTab(tab)}
                icon={tab.icon}
                label={tab.shortLabel}
                badge={tab.badge}
                compact={true}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
