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
  Sparkles,
  Star,
  ShieldCheck,
} from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { TabButton } from "../common/TabButton.jsx";
import { LiveTradeTicker } from "../common/LiveTradeTicker.jsx";

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
  onOpenCopilot,
  onOpenAuth,
}) {
  return (
    <header className="sticky top-0 z-30 transition-all duration-300 backdrop-blur-2xl bg-black/95 border-b border-zinc-800 shadow-2xl text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Desktop/Tablet Bar (Balanced 1:1:1 Flank-Center-Flank Ratio) */}
        <div className="flex items-center justify-between h-16 md:h-[68px] gap-3 sm:gap-4">
          
          {/* Left Flank: Brand Logo & Live Status Badge */}
          <div className="flex-1 flex items-center justify-start gap-3 min-w-0">
            <div
              className="hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer shrink-0"
              onClick={() => setActiveTab("catalog")}
              title="SellX Home"
            >
              <BrandMark size="md" wordmark={true} inverted={false} />
            </div>

            <div className="hidden xl:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-[11px] font-medium text-zinc-300 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-zinc-200 font-semibold">C2C Recommerce Desk</span>
            </div>
          </div>

          {/* Center: Exactly Centered Segmented Navigation Pills */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <nav className="flex items-center gap-1 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-full p-1 shadow-inner shadow-black/50">
              <TabButton
                active={activeTab === "catalog"}
                onClick={() => setActiveTab("catalog")}
                icon={LayoutGrid}
                label="Explore Marketplace"
              />
              <TabButton
                active={activeTab === "desk"}
                onClick={() => setActiveTab("desk")}
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
          </div>

          {/* Right Flank: Action CTAs & Utility Controls */}
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-2.5 min-w-0">
            {/* Buyer Copilot Button */}
            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-200 hover:text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                title="Open AI Buyer Copilot"
              >
                <Sparkles size={14} className="animate-spin-slow text-zinc-400 shrink-0" />
                <span className="hidden lg:inline">Buyer Copilot</span>
                <span className="lg:hidden hidden sm:inline">Copilot</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white text-black text-[9px] font-black leading-none">
                  AI
                </span>
              </button>
            )}

            {/* Authenticated User Profile & Role Switcher Pill */}
            {!sellerAuthed ? (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 sm:px-4 rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                title="Sign in to your Seller Trade Desk or access active deal chats"
              >
                <User size={14} className="shrink-0 text-zinc-400" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const nextRole = role === "buyer" ? "seller" : "buyer";
                  setRole(nextRole);
                  setActiveTab(nextRole === "buyer" ? "catalog" : "desk");
                }}
                className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0 group"
                title={`Switch to ${role === "buyer" ? "Seller" : "Buyer"} Mode (Click to toggle)`}
              >
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 text-[10px] font-black">
                  {role === "buyer" ? "B" : "S"}
                </div>
                <span>{role === "buyer" ? "Buyer Mode" : "Seller Desk"}</span>
                <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-400 font-bold text-[10px] font-mono">
                  <Star size={9} className="fill-current" /> {role === "buyer" ? "4.9" : "5.0"}
                </span>
              </button>
            )}

            <div className="h-5 w-[1px] bg-zinc-800 mx-0.5 hidden sm:block shrink-0" />

            {/* Saved Items Cart (Buyer Only) */}
            {role === "buyer" && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center justify-center w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0"
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
              className="relative flex items-center justify-center w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0"
              title="Notifications"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black" />
              )}
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun size={15} className="text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={15} className="text-zinc-400 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Seller Sign Out */}
            {sellerAuthed && (
              <button
                onClick={onSignOut}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs shrink-0"
                title="Sign out from Seller Desk"
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Sub-Bar (Equal 3-Column Ratio Grid) */}
        <div className="flex md:hidden items-center justify-center w-full pb-2.5 pt-1 border-t border-zinc-800/80">
          <nav className="grid grid-cols-3 w-full max-w-md mx-auto gap-1 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-full p-1 shadow-inner">
            <TabButton
              active={activeTab === "catalog"}
              onClick={() => setActiveTab("catalog")}
              icon={LayoutGrid}
              label="Explore"
              compact={true}
            />
            <TabButton
              active={activeTab === "desk"}
              onClick={() => setActiveTab("desk")}
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

      {/* Live Continuous Trade Activity Marquee Sub-Bar */}
      <LiveTradeTicker />
    </header>
  );
}
