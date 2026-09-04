import React from "react";
import { OfferCard } from "./OfferCard.jsx";
import { ProductImageTile } from "../common/ProductImageTile.jsx";
import { ShieldCheck, User, Store, Clock } from "lucide-react";

export function ChatMessage({ msg, role, deal, onAccept, onCounter, onDecline, isLatest }) {
  const product = deal?.product;

  // Format time (e.g. "2:45 PM")
  const timeStr = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  if (msg.sender === "system") {
    return (
      <div className="flex justify-center my-3 sellx-rise">
        <div className="inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full bg-[var(--surface2)] text-[var(--mist)] border border-[var(--line)] shadow-sm">
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
  const align = mine ? "items-end ml-auto" : "items-start mr-auto";
  const bubbleTone = mine
    ? "bg-[var(--teal)] text-[var(--on-teal)] border-transparent shadow-sm"
    : "bg-[var(--surface2)] text-[var(--paper)] border-[var(--line)] shadow-sm";

  return (
    <div className={`flex flex-col gap-1 max-w-[92%] sm:max-w-[78%] ${align} sellx-rise`}>
      {/* Sender Header */}
      <div className="flex items-center gap-1.5 text-[11px] text-[var(--mist-dim)] px-1">
        <span className="font-semibold text-[var(--mist)]">
          {displayName}
        </span>
        <span>&middot;</span>
        <span className="capitalize">{msg.sender}</span>
        {timeStr && (
          <>
            <span>&middot;</span>
            <span className="font-mono text-[10px]">{timeStr}</span>
          </>
        )}
      </div>

      {msg.type === "text" ? (
        <div className={`rounded-2xl border px-4 py-2.5 text-sm leading-relaxed ${bubbleTone}`}>
          {msg.text}
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
  );
}
