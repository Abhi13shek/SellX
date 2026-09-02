import React from "react";
import { X } from "lucide-react";
import { IconWrap } from "../common/Icons.jsx";

export function NotificationDrawer({ open, onClose, notifications, role }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--surface)] border-l border-[var(--line)] shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--line)]">
          <h3 className="font-display font-semibold text-[var(--paper)]">Notifications</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)] p-3 space-y-2">
          {notifications.length === 0 && (
            <div className="text-center text-sm text-[var(--mist)] py-16">
              No notifications yet. Actions on deals will show up here.
            </div>
          )}
          {notifications.map((n) => (
            <div key={n.id} className="sellx-rise p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  <IconWrap Icon={n.icon} tone={n.tone === "brass" ? "brass" : "teal"} size="sm" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-[var(--paper)] leading-snug">{n.text}</div>
                  {role === "seller" && (
                    <div className="text-[11px] text-[var(--mist-dim)] mt-1 font-mono">{n.dealId || "System"}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
