import React, { useRef, useState, useEffect } from "react";

export function ScrollRevealCard({ children, index = 0, className = "", ...props }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback if IntersectionObserver is not supported
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Stagger column animation slightly for a natural cascading flow
  const staggerDelay = `${Math.min((index % 4) * 55, 200)}ms`;

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: isVisible ? staggerDelay : "0ms",
      }}
      className={`${isVisible ? "sellx-card-revealed" : "sellx-card-hidden"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
