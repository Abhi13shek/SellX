import React from "react";
import {
  Car,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Home,
  Music,
  Dumbbell,
  Sparkles,
} from "lucide-react";

export const CATEGORY_ICONS = {
  Mobile: Smartphone,
  Computing: Laptop,
  Gaming: Gamepad2,
  Appliances: Home,
  Audio: Headphones,
  Vehicles: Car,
  Photography: Camera,
  "Music & Gear": Music,
  "Fitness & Outdoors": Dumbbell,
  Wearables: Watch,
};

export function IconWrap({ Icon, tone = "neutral", size = "md", style }) {
  const tones = {
    neutral: "bg-[var(--surface2)] text-[var(--mist)] border border-[var(--line)]",
    teal: "bg-[var(--teal)]/10 text-[var(--teal)] border border-[var(--teal)]/30",
    green: "bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/30",
    red: "bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/30",
    custom: "",
  };
  const sizes = { sm: "w-7 h-7", md: "w-10 h-10", lg: "w-12 h-12" };
  const iconSizes = { sm: 14, md: 18, lg: 22 };
  const ActualIcon = Icon || Sparkles;

  return (
    <div style={style} className={`flex items-center justify-center rounded-xl ${tones[tone]} ${sizes[size]}`}>
      <ActualIcon size={iconSizes[size]} strokeWidth={2} />
    </div>
  );
}

export function CategoryIcon({ category, Icon, size = "md" }) {
  const ActualIcon = Icon || CATEGORY_ICONS[category] || Sparkles;
  return <IconWrap Icon={ActualIcon} tone="neutral" size={size} />;
}
