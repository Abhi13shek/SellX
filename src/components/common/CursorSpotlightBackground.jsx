import React, { useEffect, useRef, useState } from "react";

export function CursorSpotlightBackground() {
  const containerRef = useRef(null);
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    let animId;
    let isMoving = false;
    let idleAngle = 0;

    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      isMoving = true;
    };

    const handleClick = (e) => {
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1200);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    const loop = () => {
      if (!isMoving) {
        // Idle gentle float along infinity curve
        idleAngle += 0.015;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 3;
        targetRef.current = {
          x: cx + Math.sin(idleAngle) * (window.innerWidth * 0.25),
          y: cy + Math.sin(idleAngle * 2) * 80,
        };
      }

      // Smooth lag / interpolation (lerp)
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.08;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.08;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--cursor-x", `${posRef.current.x.toFixed(1)}px`);
        containerRef.current.style.setProperty("--cursor-y", `${posRef.current.y.toFixed(1)}px`);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const idleTimeout = setInterval(() => {
      isMoving = false;
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
      clearInterval(idleTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
      style={{
        "--cursor-x": "50vw",
        "--cursor-y": "35vh",
      }}
    >
      {/* 1. Primary Pure Diamond Silver / Crisp Crystal Spotlight (No green tint) */}
      <div
        className="absolute inset-0 opacity-80 dark:opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(700px circle at var(--cursor-x) var(--cursor-y), rgba(255, 255, 255, 0.12), rgba(241, 245, 249, 0.03) 45%, transparent 75%)`,
        }}
      />

      {/* 2. Secondary Warm Gold Ambient Halo (Upper-right offset) */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-35 transition-opacity duration-700"
        style={{
          background: `radial-gradient(450px circle at calc(var(--cursor-x) + 45px) calc(var(--cursor-y) - 35px), rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.02) 45%, transparent 70%)`,
        }}
      />

      {/* 3. Tertiary Electric Cyan / Azure Glaze (Lower-left offset) */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-30 transition-opacity duration-700"
        style={{
          background: `radial-gradient(420px circle at calc(var(--cursor-x) - 40px) calc(var(--cursor-y) + 40px), rgba(6, 182, 212, 0.07), rgba(14, 165, 233, 0.01) 45%, transparent 70%)`,
        }}
      />

      {/* 4. Interactive Cyber Dot Matrix (Lit up around cursor with neutral tones) */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-40"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "rgba(148, 163, 184, 0.35)",
          WebkitMaskImage: `radial-gradient(550px circle at var(--cursor-x) var(--cursor-y), black 25%, transparent 80%)`,
          maskImage: `radial-gradient(550px circle at var(--cursor-x) var(--cursor-y), black 25%, transparent 80%)`,
        }}
      />

      {/* 5. Fine Technical Crosshair Grid Lines (Pure Neutral Slate / Silver) */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: "84px 84px",
          WebkitMaskImage: `radial-gradient(480px circle at var(--cursor-x) var(--cursor-y), black 15%, transparent 75%)`,
          maskImage: `radial-gradient(480px circle at var(--cursor-x) var(--cursor-y), black 15%, transparent 75%)`,
        }}
      />

      {/* 6. Crisp Neutral Ambient Glow Vignettes */}
      <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* 7. Click Micro-Ripple Wave (Silver / Cyan / Gold Shimmer) */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full border border-cyan-400/50 dark:border-white/40 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "20px",
            height: "20px",
            transform: "translate(-50%, -50%)",
            animation: "cursor-ripple 1.1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
          }}
        />
      ))}
    </div>
  );
}
