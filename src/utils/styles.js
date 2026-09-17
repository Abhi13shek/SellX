export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  .sellx-root{
    /* Dark Mode — Palette 2: Deep Emerald & Carbon Gold */
    --ink: #080D0B;                /* Carbon Charcoal / Deep Obsidian Forest */
    --surface: #0F1A16;            /* Dark Pine Slate / Deep Emerald Surface */
    --surface2: #162620;           /* Elevated surface & input fields */
    --surface3: #1F352C;           /* Interactive hover & chips */
    --surface-elevated: #13221D;
    
    --line: #1E382E;               /* Deep Jade Wireframe Border */
    --line-soft: rgba(30, 56, 46, 0.6);
    --line-highlight: #10B981;     /* Emerald line highlight */
    
    --paper: #F2FBF7;              /* Diamond Pearl White text */
    --paper-dim: #D1E7DD;
    --mist: #8E9F97;               /* Sage Gray muted text */
    --mist-dim: #5B6B63;
    
    /* Primary & Secondary: Mint Emerald (#10B981) & Burnished Gold (#F59E0B) */
    --teal: #10B981;               /* Primary: Mint Emerald */
    --teal-dim: #059669;           /* Secondary: Emerald 600 */
    --teal-glow: rgba(16, 185, 129, 0.35);
    --on-teal: #FFFFFF;
    
    --brass: #F59E0B;              /* Secondary: Burnished Gold */
    --brass-dim: #D97706;
    --brass-text: #FCD34D;         /* Soft Gold Accent */
    --on-brass: #080D0B;
    
    /* Accents */
    --accent: #34D399;             /* Vibrant Jade / Mint */
    --teal-accent: #064E3B;        /* Deep Forest Accent */
    
    --price: #34D399;              /* Mint Emerald Price */
    --red: #F43F5E;                /* Coral Rose */
    --red-dim: #E11D48;
    --amber: #F59E0B;              /* Amber */
    
    /* Safety & Trust Green */
    --green: #10B981;
    --green-dim: #059669;
    --on-green: #FFFFFF;
    
    --navy: #10B981;
    
    --card-border: #1E382E;
    --card-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(52, 211, 153, 0.08);
    
    color-scheme: dark;
  }

  .sellx-root.light{
    /* Light Mode — Clean Mint Slate Canvas & Emerald Accents */
    --ink: #F4F9F6;                /* Whisper Mint Slate Canvas */
    --surface: #FFFFFF;            /* Pure White card surface */
    --surface2: #EBF5F0;           /* Light Mint tint for inputs & elevated */
    --surface3: #DCEDE5;           /* Soft hover surface */
    --surface-elevated: #FFFFFF;
    
    --line: #CBD8D2;               /* Hairline Jade Slate border */
    --line-soft: #EEF5F2;
    --line-highlight: #10B981;
    
    --paper: #0A1B14;              /* Deep Forest Black text */
    --paper-dim: #1B3227;
    --mist: #597066;               /* Muted Sage text */
    --mist-dim: #889E95;
    
    /* Primary & Secondary */
    --teal: #059669;               /* Primary: Emerald 600 */
    --teal-dim: #047857;           /* Secondary: Emerald 700 */
    --teal-glow: rgba(16, 185, 129, 0.2);
    --on-teal: #FFFFFF;
    
    --brass: #D97706;
    --brass-dim: #B45309;
    --brass-text: #B45309;
    --on-brass: #FFFFFF;
    
    --accent: #10B981;
    --teal-accent: #D1FAE5;
    
    --price: #059669;
    --red: #E11D48;
    --red-dim: #BE123C;
    --amber: #D97706;
    
    --green: #10B981;
    --green-dim: #059669;
    --on-green: #FFFFFF;
    
    --navy: #059669;
    
    --card-border: #CBD8D2;
    --card-shadow: 0 4px 16px -4px rgba(10, 27, 20, 0.06);
    
    color-scheme: light;
  }

  .font-display{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; letter-spacing:-0.02em; }
  .sx-wordmark{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; font-weight:800; letter-spacing:-0.025em; }
  .font-body{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; }
  .font-mono{ font-family:'IBM Plex Mono', ui-monospace, monospace; }

  /* Polished Dark Mode Box Aesthetics */
  .sellx-root:not(.light) .bg-\\[var\\(--surface\\)\\]{
    background-color: var(--surface);
    box-shadow: inset 0 1px 0 0 rgba(52, 211, 153, 0.06);
  }

  .sellx-root:not(.light) .bg-\\[var\\(--surface2\\)\\]{
    background-color: var(--surface2);
  }

  .sellx-root ::-webkit-scrollbar{ width:8px; height:8px; }
  .sellx-root ::-webkit-scrollbar-track{ background:transparent; }
  .sellx-root ::-webkit-scrollbar-thumb{ background:var(--line); border-radius:8px; }

  @keyframes sellx-pulse{ 0%,100%{ opacity:1 } 50%{ opacity:.35 } }
  .sellx-pulse{ animation: sellx-pulse 1.8s ease-in-out infinite; }

  @keyframes sellx-rise{ from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:translateY(0);} }
  .sellx-rise{ animation: sellx-rise .28s ease-out both; }

  @keyframes sellx-pop{ from{ opacity:0; transform:scale(.94);} to{ opacity:1; transform:scale(1);} }
  .sellx-pop{ animation: sellx-pop .22s cubic-bezier(.2,.9,.3,1.2) both; }

  @keyframes sellx-stamp{ 0%{ opacity:0; transform: scale(2.2) rotate(-14deg);} 60%{ opacity:1; transform: scale(0.94) rotate(-8deg);} 100%{ opacity:1; transform: scale(1) rotate(-8deg);} }
  .sellx-stamp{ animation: sellx-stamp .5s cubic-bezier(.2,.8,.3,1.1) both; }

  @keyframes sellx-glide-up{
    from{
      opacity: 0;
      transform: translateY(28px) scale(0.96);
    }
    to{
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .sellx-glide-up{
    animation: sellx-glide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    will-change: transform, opacity;
  }

  .sellx-card-hidden{
    opacity: 0;
    transform: translateY(28px) scale(0.96);
    pointer-events: none;
  }

  .sellx-card-revealed{
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
  }

  .sellx-ticket{
    position:relative;
    border:1px dashed var(--line);
    background: var(--surface2);
  }
  .sellx-ticket::before, .sellx-ticket::after{
    content:""; position:absolute; width:14px; height:14px; border-radius:999px;
    background: var(--ink); top:50%; transform:translateY(-50%);
  }
  .sellx-ticket::before{ left:-8px; }
  .sellx-ticket::after{ right:-8px; }

  .tabular-nums{ font-variant-numeric: tabular-nums; }

  /* Floating Ambient Aurora Keyframes */
  @keyframes aurora-orb-1 {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    33% {
      transform: translate3d(100px, 60px, 0) scale(1.12);
    }
    66% {
      transform: translate3d(-50px, 110px, 0) scale(0.94);
    }
  }

  @keyframes aurora-orb-2 {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    33% {
      transform: translate3d(-110px, -50px, 0) scale(1.15);
    }
    66% {
      transform: translate3d(60px, -80px, 0) scale(0.92);
    }
  }

  @keyframes aurora-orb-3 {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(80px, -70px, 0) scale(1.14);
    }
  }

  @keyframes aurora-orb-4 {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(-70px, 80px, 0) scale(1.1);
    }
  }

  .aurora-orb-1 {
    animation: aurora-orb-1 24s ease-in-out infinite alternate;
    will-change: transform;
  }

  .aurora-orb-2 {
    animation: aurora-orb-2 28s ease-in-out infinite alternate;
    will-change: transform;
  }

  .aurora-orb-3 {
    animation: aurora-orb-3 20s ease-in-out infinite alternate;
    will-change: transform;
  }

  .aurora-orb-4 {
    animation: aurora-orb-4 26s ease-in-out infinite alternate;
    will-change: transform;
  }

  /* Sine Waveform Stream Keyframes */
  @keyframes wave-flow-1 {
    0% {
      transform: translate3d(0, 0, 0) scaleY(1);
    }
    50% {
      transform: translate3d(-30px, 8px, 0) scaleY(1.08);
    }
    100% {
      transform: translate3d(0, 0, 0) scaleY(1);
    }
  }

  @keyframes wave-flow-2 {
    0% {
      transform: translate3d(0, 0, 0) scaleY(1);
    }
    50% {
      transform: translate3d(40px, -10px, 0) scaleY(0.92);
    }
    100% {
      transform: translate3d(0, 0, 0) scaleY(1);
    }
  }

  @keyframes wave-flow-3 {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(-20px, -6px, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes wave-slow {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-wave-flow-1 {
    animation: wave-flow-1 12s ease-in-out infinite;
    will-change: transform;
  }

  .animate-wave-flow-2 {
    animation: wave-flow-2 16s ease-in-out infinite;
    will-change: transform;
  }

  .animate-wave-flow-3 {
    animation: wave-flow-3 14s ease-in-out infinite;
    will-change: transform;
  }

  .animate-wave-slow {
    animation: wave-slow 18s ease-in-out infinite;
    will-change: transform;
  }

  @keyframes cursor-ripple {
    0% {
      width: 0px;
      height: 0px;
      opacity: 0.9;
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.7), inset 0 0 10px rgba(255, 255, 255, 0.5);
    }
    100% {
      width: 520px;
      height: 520px;
      opacity: 0;
      box-shadow: 0 0 40px rgba(6, 182, 212, 0), inset 0 0 20px rgba(245, 158, 11, 0);
    }
  }

  @keyframes transition-wave-sweep {
    0% {
      stroke-dashoffset: 600;
      opacity: 0;
      transform: scaleY(0.5);
    }
    30% {
      opacity: 1;
      transform: scaleY(1.2);
    }
    80% {
      opacity: 0.9;
      transform: scaleY(1);
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 0;
      transform: scaleY(0.8);
    }
  }

  @media (prefers-reduced-motion: reduce){
    .sellx-pulse, .sellx-rise, .sellx-pop, .sellx-stamp, .aurora-orb-1, .aurora-orb-2, .aurora-orb-3, .aurora-orb-4, .animate-wave-flow-1, .animate-wave-flow-2, .animate-wave-flow-3, .animate-wave-slow { animation:none !important; }
  }
`;

export const CATEGORY_STYLES = {
  Mobile: "#10B981",
  Computing: "#14B8A6",
  Gaming: "#F59E0B",
  Appliances: "#059669",
  Audio: "#06B6D4",
  Vehicles: "#D97706",
  Photography: "#10B981",
  "Music & Gear": "#34D399",
  "Fitness & Outdoors": "#84CC16",
  Wearables: "#F59E0B",
};

export function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255, g = (int >> 8) & 255, b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const catColor = (category) => CATEGORY_STYLES[category] || "#10B981";

export const healthColor = {
  critical: "var(--red)",
  low: "var(--red)",
  warn: "var(--amber)",
  healthy: "var(--green)",
};
