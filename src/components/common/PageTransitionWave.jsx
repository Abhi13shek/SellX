import React, { useEffect, useState } from "react";

export function PageTransitionWave({ triggerKey }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!active) return null;

  return (
    <div
      className="w-full h-8 overflow-hidden pointer-events-none select-none relative mb-2 -mt-2 animate-fadeIn"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 40"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trans-buyer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
            <stop offset="30%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="1" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
          <filter id="trans-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Transition Sweeping Sine Wave */}
        <path
          d="M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20"
          fill="none"
          stroke="url(#trans-buyer-grad)"
          strokeWidth="2.5"
          filter="url(#trans-glow)"
          style={{
            animation: "transition-wave-sweep 0.75s ease-out forwards",
          }}
        />
        
        {/* Subtle Counter Sine Wave */}
        <path
          d="M0,20 Q150,35 300,20 T600,20 T900,20 T1200,20"
          fill="none"
          stroke="#FBBF24"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeOpacity="0.7"
          filter="url(#trans-glow)"
          style={{
            animation: "transition-wave-sweep 0.75s ease-out forwards",
          }}
        />
      </svg>
    </div>
  );
}
