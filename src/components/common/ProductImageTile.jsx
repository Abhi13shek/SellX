import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Camera, ImageOff } from "lucide-react";
import { catColor, hexToRgba } from "../../utils/styles.js";

export function ProductImageTile({
  category,
  Icon,
  image,
  images,
  src,
  alt = "Product Photo",
  size = "lg",
  showControls = true,
  className = "",
}) {
  const c = catColor(category);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [errorUrls, setErrorUrls] = useState({});

  // Normalize image list from images, image, or src
  const imageList = useMemo(() => {
    if (Array.isArray(images) && images.length > 0) {
      return images.filter((img) => typeof img === "string" && img.trim().length > 0);
    }
    if (Array.isArray(src) && src.length > 0) {
      return src.filter((img) => typeof img === "string" && img.trim().length > 0);
    }
    if (typeof image === "string" && image.trim().length > 0) {
      return [image.trim()];
    }
    if (typeof src === "string" && src.trim().length > 0) {
      return [src.trim()];
    }
    return [];
  }, [images, image, src]);

  const total = imageList.length;
  const activeImg = imageList[currentIdx] || imageList[0];
  const hasError = activeImg ? !!errorUrls[activeImg] : true;

  const handlePrev = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const angleLabels = ["Front View", "Back & Body", "Side & Details", "Accessories"];

  if (activeImg && !hasError) {
    return (
      <div
        className={`relative overflow-hidden shrink-0 group/gallery bg-[var(--surface2)] ${
          size === "sm" ? "h-14 w-14 rounded-lg" : "w-full rounded-xl aspect-[4/3]"
        } ${className}`}
      >
        <img
          src={activeImg}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/gallery:scale-[1.03]"
          loading="eager"
          crossOrigin="anonymous"
          onError={() => {
            setErrorUrls((prev) => ({ ...prev, [activeImg]: true }));
          }}
        />

        {/* Multi-angle controls for larger tile size */}
        {size === "lg" && showControls && total > 1 && (
          <>
            {/* Prev button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo angle"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/65 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 hover:bg-black/90 transition-all shadow-md active:scale-95 cursor-pointer z-10"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo angle"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/65 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 hover:bg-black/90 transition-all shadow-md active:scale-95 cursor-pointer z-10"
            >
              <ChevronRight size={16} />
            </button>

            {/* Bottom Angle Indicator */}
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center pointer-events-none z-10">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono shadow-sm border border-white/10">
                <Camera size={10} className="text-emerald-400 shrink-0" />
                <span className="font-semibold">{currentIdx + 1}/{total}</span>
                <span className="text-white/40">&middot;</span>
                <span className="text-[10px] text-white/90">{angleLabels[currentIdx % angleLabels.length]}</span>
              </div>
            </div>

            {/* Top Right Total Photo Count Badge */}
            <div className="absolute top-2.5 right-2.5 pointer-events-none z-10">
              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold shadow-sm border border-white/15">
                {total} Photos
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  // Graceful visual fallback with Category styling & Icon
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center shrink-0 ${
        size === "sm" ? "h-14 w-14 rounded-lg" : "w-full rounded-xl aspect-[4/3]"
      } ${className}`}
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(c, 0.28)}, ${hexToRgba(c, 0.08)})`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`,
          backgroundSize: size === "lg" ? "14px 14px" : "8px 8px",
        }}
      />
      {Icon ? (
        <Icon size={size === "lg" ? 48 : 22} strokeWidth={1.6} style={{ color: c }} className="relative z-10" />
      ) : (
        <Camera size={size === "lg" ? 44 : 20} strokeWidth={1.6} style={{ color: c }} className="relative z-10" />
      )}
      {size === "lg" && (
        <span className="relative z-10 mt-2 text-[11px] font-semibold text-[var(--mist)]">
          {category || "Verified Listing"}
        </span>
      )}
    </div>
  );
}
