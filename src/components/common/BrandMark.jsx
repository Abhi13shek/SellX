import React, { useId } from "react";

export function BrandMark({ size = "md", wordmark = true }) {
  const gradId = useId();
  const dims = { sm: 28, md: 36, lg: 52, xl: 72 };
  const px = dims[size] || dims.md;
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-2xl", xl: "text-4xl" };

  return (
    <div className="flex items-center gap-2.5 shrink-0 select-none">
      <svg
        width={px}
        height={px}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`sx-grad-1-${gradId}`}
            x1="8"
            y1="8"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0474C4" />
            <stop offset="100%" stopColor="#06457F" />
          </linearGradient>
          <linearGradient
            id={`sx-grad-2-${gradId}`}
            x1="40"
            y1="8"
            x2="8"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#A8C4EC" />
            <stop offset="100%" stopColor="#0474C4" />
          </linearGradient>
        </defs>

        {/* Soft rounded icon badge */}
        <rect width="48" height="48" rx="13" fill={`url(#sx-grad-1-${gradId})`} opacity="0.16" />
        <rect
          x="0.75"
          y="0.75"
          width="46.5"
          height="46.5"
          rx="12.25"
          stroke={`url(#sx-grad-1-${gradId})`}
          strokeOpacity="0.35"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Diagonal stroke 1: Top-Left to Bottom-Right */}
        <path
          d="M14 14L34 34"
          stroke={`url(#sx-grad-1-${gradId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Diagonal stroke 2: Top-Right to Bottom-Left with modern depth separation */}
        <path
          d="M34 14L26.5 21.5"
          stroke={`url(#sx-grad-2-${gradId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M21.5 26.5L14 34"
          stroke={`url(#sx-grad-2-${gradId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </svg>

      {wordmark && (
        <span className={`sx-wordmark ${textSizes[size] || textSizes.md} font-extrabold leading-none tracking-tight`}>
          <span style={{ color: "var(--paper)" }}>Sell</span>
          <span
            style={{
              background: "linear-gradient(135deg, #0474C4 0%, #A8C4EC 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            X
          </span>
        </span>
      )}
    </div>
  );
}
