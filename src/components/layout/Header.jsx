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
  MapPin,
  ChevronDown,
} from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { TabButton } from "../common/TabButton.jsx";
import { StatPill } from "../common/StatPill.jsx";
import { fmtINR } from "../../utils/formatters.js";
import { CITIES } from "../../data/constants.js";

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
  selectedCity = "blr",
  onSelectCity,
}) {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const currentCity = CITIES.find((c) => c.id === selectedCity) || CITIES[1];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & Location */}
          <div className="flex items-center gap-3 shrink-0">
            <BrandMark size="md" wordmark={true} />

            {/* City / Location Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface2)] text-xs font-semibold text-[var(--paper)] hover:border-[var(--teal)]/40 transition-colors shadow-sm"
              >
                <MapPin size={12} className="text-[var(--teal)] shrink-0" />
                <span className="truncate max-w-[100px] sm:max-w-[130px]">{currentCity.name}</span>
                <ChevronDown size={11} className="text-[var(--mist)] shrink-0" />
              </button>

              {cityDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCityDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl p-2 z-50 sellx-rise space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--mist-dim)] font-mono">
                      Select Location
                    </div>
                    {CITIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (onSelectCity) onSelectCity(c.id);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                          selectedCity === c.id
                            ? "bg-[var(--teal)]/10 text-[var(--teal)] font-semibold"
                            : "text-[var(--paper)] hover:bg-[var(--surface2)]"
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] font-mono text-[var(--mist-dim)]">{c.short}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
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
                title="Cart"
              >
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--teal)] text-[var(--on-teal)] text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] transition-colors"
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--teal)]" />
              )}
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] transition-colors"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface2)] text-xs font-semibold text-[var(--paper)] hover:bg-[var(--surface3)] transition-colors"
            >
              {role === "buyer" ? <Store size={14} className="text-[var(--teal)]" /> : <User size={14} className="text-[var(--teal)]" />}
              <span className="hidden sm:inline">{role === "buyer" ? "Seller Mode" : "Buyer Mode"}</span>
            </button>

            {role === "seller" && sellerAuthed && (
              <button
                onClick={onSignOut}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--red)]/30 text-[var(--red)] hover:bg-[var(--red)]/10 transition-colors"
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
