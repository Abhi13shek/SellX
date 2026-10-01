import React, { useEffect, useState } from "react";

export function Confetti({ active = true, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = [
      "#10B981", // Emerald
      "#34D399", // Mint
      "#F59E0B", // Amber Gold
      "#38BDF8", // Sky Blue
      "#F43F5E", // Rose
      "#A855F7", // Purple
      "#E2E8F0", // Slate
    ];

    const generated = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage from left
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6, // 6px to 14px
      delay: Math.random() * 0.6,
      duration: Math.random() * 1.5 + 2,
      shape: Math.random() > 0.4 ? "rect" : "circle",
    }));

    setParticles(generated);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: p.shape === "rect" ? `${p.size * 1.4}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
