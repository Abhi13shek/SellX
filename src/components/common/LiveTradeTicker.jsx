import React from "react";
import { Zap, ShieldCheck, TrendingUp, CheckCircle2, Lock, Flame } from "lucide-react";

export function LiveTradeTicker() {
  const tickerItems = [
    {
      icon: Flame,
      color: "text-amber-400",
      text: "Rohit K. locked iPhone 13 Pro for ₹51,500",
      highlight: "Saved ₹68,400 (57% OFF)",
      time: "2m ago",
    },
    {
      icon: Lock,
      color: "text-emerald-400",
      text: "SellX Escrow Vault Protected",
      highlight: "₹4,82,500 Volume Today",
      time: "Live",
    },
    {
      icon: CheckCircle2,
      color: "text-teal-400",
      text: "Doorstep OTP Handover Completed",
      highlight: "Sony WH-1000XM5 @ ₹21,000",
      time: "7m ago",
    },
    {
      icon: TrendingUp,
      color: "text-cyan-400",
      text: "14 Active Bargain Chats in Progress",
      highlight: "Avg Discount 22.4%",
      time: "Real-time",
    },
    {
      icon: ShieldCheck,
      color: "text-emerald-400",
      text: "48-Hour Institutional Inspection Warranty",
      highlight: "Zero-Risk C2C",
      time: "Active",
    },
  ];

  return (
    <div className="w-full bg-black/95 border-b border-zinc-800/80 py-1.5 overflow-hidden text-xs select-none backdrop-blur-md">
      <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
        {/* Render twice for seamless infinite loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="inline-flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 font-semibold text-zinc-200">
                <Icon size={12} className={item.color} />
                <span>{item.text}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 font-mono font-bold text-[10px] border border-zinc-800">
                {item.highlight}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                &bull; {item.time}
              </span>
              <span className="text-zinc-700 mx-2">&middot;</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
