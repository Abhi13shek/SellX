import React from "react";
import { X } from "lucide-react";
import { IconWrap } from "../common/Icons.jsx";

export function NotificationDrawer({ open, onClose, notifications, role, onClear, onNotificationClick }) {
  const dealNotifications = notifications.filter((notification) => notification.dealId);
  const otherNotifications = notifications.filter((notification) => !notification.dealId);

  const renderNotification = (notification) => (
    <button
      key={notification.id}
      type="button"
      onClick={() => onNotificationClick?.(notification)}
      className="sellx-rise w-full rounded-xl border border-[var(--line)] bg-[var(--surface2)] p-3 text-left transition-colors hover:border-[var(--teal)]/40 hover:bg-[var(--surface3)]"
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">
          <IconWrap Icon={notification.icon} tone={notification.tone === "brass" ? "brass" : "teal"} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm leading-snug text-[var(--paper)]">{notification.text}</div>
          {notification.dealId && <div className="mt-1 text-[11px] font-semibold text-[var(--teal)]">Open offer · {notification.dealId}</div>}
          {role === "seller" && !notification.dealId && (
            <div className="mt-1 font-mono text-[11px] text-[var(--mist-dim)]">System</div>
          )}
        </div>
      </div>
    </button>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--surface)] border-l border-[var(--line)] shadow-2xl transition-all duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--line)]">
          <div>
            <h3 className="font-display font-semibold text-[var(--paper)]">Notifications</h3>
            <p className="mt-0.5 text-[11px] text-[var(--mist)]">Deal updates appear first.</p>
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button onClick={onClear} className="px-2 py-1 text-[11px] font-semibold text-[var(--teal)] hover:underline">Clear</button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)] p-3 space-y-2">
          {notifications.length === 0 && (
            <div className="text-center text-sm text-[var(--mist)] py-16">
              No notifications yet. Actions on deals will show up here.
            </div>
          )}
          {dealNotifications.length > 0 && (
            <section className="space-y-2">
              <h4 className="px-1 text-[10px] font-bold uppercase tracking-wider text-[var(--teal)]">Offers and deal updates</h4>
              {dealNotifications.map(renderNotification)}
            </section>
          )}
          {otherNotifications.length > 0 && (
            <section className="space-y-2 pt-2">
              {dealNotifications.length > 0 && <h4 className="px-1 text-[10px] font-bold uppercase tracking-wider text-[var(--mist-dim)]">Other updates</h4>}
              {otherNotifications.map(renderNotification)}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
