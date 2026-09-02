export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  .sellx-root{
    /* Dark Mode — Custom Palette */
    --ink: #050914;                /* Background: #050914 */
    --surface: #0D1424;            /* Surface: #0D1424 */
    --surface2: #141E33;           /* Elevated surface & input fields */
    --surface3: #1D2A40;           /* Interactive chips */
    --surface-elevated: #0D1424;
    
    --line: #1D2A40;               /* Border: #1D2A40 */
    --line-soft: rgba(29, 42, 64, 0.5);
    --line-highlight: #A8C4EC;     /* Accent: #A8C4EC */
    
    --paper: #F8FAFC;              /* Text: #F8FAFC */
    --paper-dim: #E2E8F0;
    --mist: #8896AA;               /* Muted Text: #8896AA */
    --mist-dim: #556275;
    
    /* 1. PRIMARY (#0474C4) & SECONDARY (#06457F) */
    --teal: #0474C4;               /* Primary: #0474C4 */
    --teal-dim: #06457F;           /* Secondary: #06457F */
    --teal-glow: rgba(4, 116, 196, 0.35);
    --on-teal: #FFFFFF;
    
    --brass: #06457F;              /* Secondary: #06457F */
    --brass-dim: #0474C4;
    --brass-text: #A8C4EC;         /* Accent: #A8C4EC */
    --on-brass: #FFFFFF;
    
    /* 2. TEAL ACCENT (#2C444C) & ACCENT (#A8C4EC) */
    --accent: #A8C4EC;             /* Accent: #A8C4EC */
    --teal-accent: #2C444C;        /* Teal Accent: #2C444C */
    
    --price: #38bdf8;              /* Electric Sky Blue for Price Tags */
    --red: #f43f5e;
    --red-dim: #e11d48;
    --amber: #f59e0b;
    
    /* 3. SAFETY & TRUST GREEN (#10B981) */
    --green: #10b981;
    --green-dim: #059669;
    --on-green: #ffffff;
    
    --navy: #A8C4EC;
    
    --card-border: #1D2A40;
    --card-shadow: 0 8px 24px -6px rgba(5, 9, 20, 0.8), inset 0 1px 0 0 rgba(168, 196, 236, 0.06);
    
    color-scheme: dark;
  }

  .sellx-root.light{
    /* Light Mode — Clean White/Whisper Canvas */
    --ink: #F8FAFC;                /* Light Canvas */
    --surface: #FFFFFF;            /* Pure White card surface */
    --surface2: #EDF2F7;           /* Light tint for inputs & elevated */
    --surface3: #E2E8F0;           /* Soft hover surface */
    --surface-elevated: #FFFFFF;
    
    --line: #CBD5E1;               /* Hairline border */
    --line-soft: #F1F5F9;
    --line-highlight: #A8C4EC;
    
    --paper: #0D1424;              /* Deep surface text */
    --paper-dim: #1E293B;
    --mist: #64748B;               /* Muted text */
    --mist-dim: #94A3B8;
    
    /* Primary & Secondary */
    --teal: #0474C4;               /* Primary: #0474C4 */
    --teal-dim: #06457F;           /* Secondary: #06457F */
    --teal-glow: rgba(4, 116, 196, 0.2);
    --on-teal: #FFFFFF;
    
    --brass: #06457F;
    --brass-dim: #0474C4;
    --brass-text: #06457F;
    --on-brass: #FFFFFF;
    
    --accent: #A8C4EC;
    --teal-accent: #2C444C;
    
    --price: #0474C4;
    --red: #e11d48;
    --red-dim: #be123c;
    --amber: #ea580c;
    
    --green: #10b981;
    --green-dim: #059669;
    --on-green: #ffffff;
    
    --navy: #0474C4;
    
    --card-border: #CBD5E1;
    --card-shadow: 0 4px 16px -4px rgba(13, 20, 36, 0.06);
    
    color-scheme: light;
  }

  .font-display{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; letter-spacing:-0.02em; }
  .sx-wordmark{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; font-weight:800; letter-spacing:-0.025em; }
  .font-body{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; }
  .font-mono{ font-family:'IBM Plex Mono', ui-monospace, monospace; }

  /* Polished Dark Mode Box Aesthetics */
  .sellx-root:not(.light) .bg-\\[var\\(--surface\\)\\]{
    background-color: var(--surface);
    box-shadow: inset 0 1px 0 0 rgba(168, 196, 236, 0.05);
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

  @media (prefers-reduced-motion: reduce){
    .sellx-pulse, .sellx-rise, .sellx-pop, .sellx-stamp{ animation:none !important; }
  }
`;

export const CATEGORY_STYLES = {
  Mobile: "#0474C4",
  Computing: "#06457F",
  Gaming: "#0474C4",
  Appliances: "#2C444C",
  Audio: "#8896AA",
  Vehicles: "#06457F",
  Photography: "#0474C4",
  "Music & Gear": "#8896AA",
  "Fitness & Outdoors": "#2C444C",
  Wearables: "#A8C4EC",
};

export function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255, g = (int >> 8) & 255, b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const catColor = (category) => CATEGORY_STYLES[category] || "#0474C4";

export const healthColor = {
  critical: "var(--red)",
  low: "var(--red)",
  warn: "var(--amber)",
  healthy: "var(--green)",
};
