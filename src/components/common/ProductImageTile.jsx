import React, { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { IMAGE_RATIOS } from "../../data/constants.js";
import { catColor, hexToRgba } from "../../utils/styles.js";

export function ProductImageTile({ category, Icon, image, size = "lg", interactiveRatio = true }) {
  const c = catColor(category);
  const [ratioIdx, setRatioIdx] = useState(0);
  const [hasError, setHasError] = useState(false);
  const ratio = IMAGE_RATIOS[ratioIdx];
  const canCycle = interactiveRatio && size === "lg" && !!image && !hasError;

  const dims = { sm: "h-14 w-14 rounded-lg", lg: "w-full rounded-xl" };
  const iconSize = { sm: 22, lg: 52 };

  const cycleRatio = (e) => {
    e.stopPropagation();
    setRatioIdx((i) => (i + 1) % IMAGE_RATIOS.length);
  };

  if (image && !hasError) {
    return (
      <div
        className={`relative overflow-hidden shrink-0 ${dims[size]} group/img bg-[var(--surface2)]`}
        style={size === "lg" ? { aspectRatio: ratio.value, transition: "aspect-ratio .25s ease" } : undefined}
      >
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
        {canCycle && (
          <button
            type="button"
            onClick={cycleRatio}
            aria-label={`Change photo aspect ratio (currently ${ratio.label})`}
            title="Change aspect ratio"
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white text-[10px] font-mono opacity-0 group-hover/img:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ArrowLeftRight size={10} className="rotate-45" />
            {ratio.label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center shrink-0 ${dims[size]}`}
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(c, 0.24)}, ${hexToRgba(c, 0.06)})`,
        ...(size === "lg" ? { aspectRatio: "4 / 3" } : {}),
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`,
          backgroundSize: size === "lg" ? "14px 14px" : "8px 8px",
        }}
      />
      {Icon && <Icon size={iconSize[size]} strokeWidth={1.5} style={{ color: c }} className="relative z-10" />}
    </div>
  );
}
