import React from "react";
import { OfferCard } from "./OfferCard.jsx";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { ShieldCheck, User, Store, Clock, CheckCheck } from "lucide-react";

export function ChatMessage({ msg, role, deal, onAccept, onCounter, onDecline, isLatest }) {
  const product = deal?.product;

  // Format time (e.g. "2:45 PM")
  const timeStr = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  if (msg.sender === "system") {
    return (
      <div className="flex justify-center my-3 sellx-rise">
        <div className="inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full bg-[var(--surface2)] text-[var(--mist)] border border-[var(--line)] shadow-xs">
          {product && (
            <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-[var(--line)]">
              <ProductImageTile
                src={product.image}
                category={product.category}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span>{msg.text}</span>
          {timeStr && <span className="text-[10px] text-[var(--mist-dim)] font-mono ml-1">{timeStr}</span>}
        </div>
      </div>
    );
  }

  const mine = msg.sender === role;
  const displayName = mine
    ? "You"
    : msg.sender === "buyer"
    ? deal?.buyerName || "Buyer"
    : deal?.sellerName || "Seller";

  return (
    <div className={`flex items-end gap-2 max-w-[92%] sm:max-w-[80%] my-1.5 sellx-rise ${mine ? "ml-auto flex-row-reverse" : "mr-auto flex-row"}`}>
      {/* Avatar Chip */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs border ${
          mine
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
            : "bg-[var(--surface3)] text-[var(--paper)] border-[var(--line)]"
        }`}
        title={displayName}
      >
        {msg.sender === "buyer" ? "B" : "S"}
      </div>

      {/* Bubble Container */}
      <div className={`flex flex-col gap-1 min-w-0 ${mine ? "items-end" : "items-start"}`}>
        {/* Sender Name */}
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--mist-dim)] px-1">
          <span className="font-semibold text-[var(--mist)]">{displayName}</span>
          <span>&middot;</span>
          <span className="capitalize">{msg.sender}</span>
        </div>

        {msg.type === "text" ? (
          <div
            className={`relative rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
              mine
                ? "bg-[var(--teal)] text-[var(--on-teal)] rounded-br-xs font-medium"
                : "bg-[var(--surface2)] text-[var(--paper)] border border-[var(--line)] rounded-bl-xs"
            }`}
          >
            <p className="break-words">{msg.text}</p>
            <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono ${mine ? "text-white/80" : "text-[var(--mist-dim)]"}`}>
              <span>{timeStr}</span>
              {mine && <CheckCheck size={13} className="text-white shrink-0" />}
            </div>
          </div>
        ) : (
          <OfferCard
            offer={msg.offer}
            role={role}
            mine={mine}
            product={product}
            onAccept={onAccept}
            onCounter={onCounter}
            onDecline={onDecline}
            isLatest={isLatest}
          />
        )}
      </div>
    </div>
  );
}

