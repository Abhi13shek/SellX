import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Sparkles,
  Send,
  X,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  ShoppingCart,
  Check,
  MessageSquareQuote,
  Flame,
  Star,
  ExternalLink,
  Laptop,
  Smartphone,
  Headphones,
  Camera,
  Gamepad2,
  Watch,
  Car,
  Award,
  ArrowUpRight,
  CheckCheck,
  Tag,
  Clock,
  MapPin,
  Scale,
} from "lucide-react";
import {
  extractCriteria,
  scoreProducts,
  generateCopilotAdvice,
  COPILOT_PRESETS,
  WIZARD_CATEGORIES,
  WIZARD_BUDGETS,
  WIZARD_PRIORITIES,
} from "../../services/buyerCopilotEngine.js";
import { fmtINR } from "../../utils/formatters.js";
import { genId } from "../../utils/helpers.js";

// Category Icons mapping for high visual richness
const CATEGORY_ICONS = {
  Mobile: Smartphone,
  Laptop: Laptop,
  Audio: Headphones,
  Camera: Camera,
  Gaming: Gamepad2,
  Wearables: Watch,
  Vehicles: Car,
};

export function BuyerCopilotModal({
  isOpen,
  onClose,
  allProducts = [],
  onOpenProduct,
  onRequestQuote,
  onAddToCart,
  cartIds = new Set(),
}) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [activeMode, setActiveMode] = useState("chat"); // "chat" | "wizard"
  const [isTyping, setIsTyping] = useState(false);
  const [compareModalItem, setCompareModalItem] = useState(null);

  // Guided Wizard States
  const [wizardCat, setWizardCat] = useState("Mobile");
  const [wizardBudget, setWizardBudget] = useState("b-35k");
  const [wizardPriorities, setWizardPriorities] = useState(["battery", "performance"]);

  const chatEndRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: genId("cp-msg"),
          sender: "copilot",
          type: "greeting",
          text: "👋 Welcome to **SellX Buyer Copilot**!\n\nTell me **2-3 details** about your dream item (e.g. *Category, Budget, and Key Must-Haves like battery health, M1/M2 chip, or camera quality*), and I will calculate the **#1 best deal** in our catalog with custom price negotiation targets!",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isTyping, isOpen, activeMode]);

  if (!isOpen) return null;

  // Process and generate Copilot recommendation
  const handleProcessQuery = (queryText, directCriteria = null) => {
    if (!queryText.trim() && !directCriteria) return;

    const userMessage = {
      id: genId("cp-msg"),
      sender: "user",
      type: "text",
      text: queryText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      // 1. Extract criteria from text or use direct parameters
      const criteria = directCriteria || extractCriteria(queryText);

      // 2. Score the catalog
      const scoringResult = scoreProducts(allProducts, criteria);

      // 3. Generate tailored advice & follow-ups
      const advice = generateCopilotAdvice({
        topPick: scoringResult.topPick,
        runnerUp: scoringResult.runnerUp,
        criteria,
      });

      const copilotResponse = {
        id: genId("cp-msg"),
        sender: "copilot",
        type: "recommendation",
        text: advice.greeting,
        summary: advice.topPickSummary,
        topPick: scoringResult.topPick,
        runnerUp: scoringResult.runnerUp,
        budgetAlternative: scoringResult.budgetAlternative,
        rationaleList: advice.rationaleList,
        quickFollowUps: advice.quickFollowUps,
        criteria,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, copilotResponse]);
      setIsTyping(false);
      setActiveMode("chat");
    }, 600);
  };

  // Run Guided Wizard search
  const handleRunWizard = () => {
    const budgetObj = WIZARD_BUDGETS.find((b) => b.id === wizardBudget);
    const budgetVal = budgetObj?.max || 35000;
    const catObj = WIZARD_CATEGORIES.find((c) => c.id === wizardCat);

    const directCriteria = {
      category: wizardCat,
      budget: budgetVal,
      priorities: wizardPriorities,
      rawQuery: `${catObj?.label || wizardCat} under ₹${budgetVal.toLocaleString("en-IN")}`,
    };

    const promptText = `Find me the best pre-owned ${wizardCat} under ${fmtINR(budgetVal)} with focus on ${wizardPriorities.join(" & ")}.`;
    handleProcessQuery(promptText, directCriteria);
  };

  // Handle preset one-click clicks
  const handlePresetClick = (preset) => {
    handleProcessQuery(preset.query, {
      category: preset.category,
      budget: preset.budget,
      priorities: [preset.priority],
      rawQuery: preset.query,
    });
  };

  // Handle follow-up prompt clicks
  const handleFollowUpClick = (prompt, lastTopPick, lastRunnerUp) => {
    if (prompt.startsWith("Make an offer") && lastTopPick) {
      onRequestQuote(lastTopPick.product, lastTopPick.suggestedOffer);
      onClose();
      return;
    }

    if (prompt.includes("Compare") && lastTopPick && lastRunnerUp) {
      setCompareModalItem({
        item1: lastTopPick,
        item2: lastRunnerUp,
      });
      return;
    }

    handleProcessQuery(prompt);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: genId("cp-msg"),
        sender: "copilot",
        type: "greeting",
        text: "🔄 Chat reset! What pre-owned item can I help you find today? Give me **2-3 details** (e.g., budget, device type, or desired features).",
        timestamp: Date.now(),
      },
    ]);
  };

  const togglePriority = (pId) => {
    setWizardPriorities((prev) =>
      prev.includes(pId) ? prev.filter((x) => x !== pId) : [...prev, pId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xl animate-fade-in">
      <div
        className="relative flex flex-col w-full max-w-4xl h-[94vh] sm:h-[88vh] bg-[var(--surface)] border border-[var(--line)] rounded-3xl shadow-2xl overflow-hidden text-[var(--paper)] transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* ================= TOP HEADER ================= */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--line)] bg-[var(--surface2)]/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 ring-2 ring-emerald-400/20">
              <Bot size={22} className="animate-pulse" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[var(--surface)]" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-[var(--paper)]">
                  SellX Buyer Copilot
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Sparkles size={11} className="text-emerald-400" />
                  Hybrid AI
                </span>
              </div>
              <p className="text-xs text-[var(--mist)] hidden sm:flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Real-time marketplace ranking & smart bargain intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-[var(--surface)] border border-[var(--line)] text-xs font-bold shadow-inner">
              <button
                onClick={() => setActiveMode("chat")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeMode === "chat"
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm font-black"
                    : "text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                <Bot size={13} />
                <span>AI Chat</span>
              </button>
              <button
                onClick={() => setActiveMode("wizard")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeMode === "wizard"
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm font-black"
                    : "text-[var(--mist)] hover:text-[var(--paper)]"
                }`}
              >
                <SlidersHorizontal size={13} />
                <span>3-Step Wizard</span>
              </button>
            </div>

            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] border border-transparent hover:border-[var(--line)] transition-all cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] border border-transparent hover:border-[var(--line)] transition-all cursor-pointer"
              title="Close Copilot"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeMode === "wizard" ? (
            /* ================= 3-STEP WIZARD VIEW ================= */
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Wizard Hero Header */}
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                  <Sparkles size={13} />
                  3-Click Match Finder
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-[var(--paper)] tracking-tight">
                  Tell Us Your 3 Key Details
                </h4>
                <p className="text-xs text-[var(--mist)]">
                  Our hybrid scoring algorithm evaluates {allProducts.length} verified listings across budget fit, condition score, and seller reliability.
                </p>
              </div>

              {/* Step 1: Category Picker */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 text-white text-xs font-black flex items-center justify-center shadow-xs">
                      1
                    </span>
                    <label className="text-xs font-black uppercase tracking-wider text-[var(--paper)]">
                      Select Category
                    </label>
                  </div>
                  <span className="text-xs font-bold text-teal-400">
                    {wizardCat} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {WIZARD_CATEGORIES.map((cat) => {
                    const IconComp = CATEGORY_ICONS[cat.id] || Smartphone;
                    const isSelected = wizardCat === cat.id;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setWizardCat(cat.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer group ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-md ring-1 ring-emerald-500/30"
                            : "border-[var(--line)] bg-[var(--surface2)] text-[var(--paper)] hover:border-emerald-500/40 hover:bg-[var(--surface3)]"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl transition-colors ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "bg-[var(--surface)] text-[var(--mist)] group-hover:text-emerald-400"
                          }`}
                        >
                          <IconComp size={16} />
                        </div>
                        <span className="truncate">{cat.label.replace(/^[^\s]+\s/, "")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Target Budget */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 text-white text-xs font-black flex items-center justify-center shadow-xs">
                      2
                    </span>
                    <label className="text-xs font-black uppercase tracking-wider text-[var(--paper)]">
                      Target Budget Range
                    </label>
                  </div>
                  <span className="text-xs font-bold text-teal-400">
                    {WIZARD_BUDGETS.find((b) => b.id === wizardBudget)?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {WIZARD_BUDGETS.map((bg) => {
                    const isSelected = wizardBudget === bg.id;

                    return (
                      <button
                        key={bg.id}
                        onClick={() => setWizardBudget(bg.id)}
                        className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-md ring-1 ring-emerald-500/30"
                            : "border-[var(--line)] bg-[var(--surface2)] text-[var(--paper)] hover:border-emerald-500/40 hover:bg-[var(--surface3)]"
                        }`}
                      >
                        <div>{bg.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Top Priorities / Must-Haves */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 text-white text-xs font-black flex items-center justify-center shadow-xs">
                      3
                    </span>
                    <label className="text-xs font-black uppercase tracking-wider text-[var(--paper)]">
                      Top Priorities & Features (Multi-select)
                    </label>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    {wizardPriorities.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {WIZARD_PRIORITIES.map((pr) => {
                    const active = wizardPriorities.includes(pr.id);

                    return (
                      <button
                        key={pr.id}
                        onClick={() => togglePriority(pr.id)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          active
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-md ring-1 ring-emerald-500/30"
                            : "border-[var(--line)] bg-[var(--surface2)] text-[var(--paper)] hover:border-emerald-500/40 hover:bg-[var(--surface3)]"
                        }`}
                      >
                        <span className="truncate">{pr.label}</span>
                        {active && <Check size={16} className="text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Find Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleRunWizard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-teal-500/25 hover:shadow-teal-500/35 transition-all cursor-pointer active:scale-98"
                >
                  <Sparkles size={18} />
                  <span>Compute & Present #1 Best Recommendation</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            /* ================= CONVERSATIONAL CHAT VIEW ================= */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* One-Click Prompt Presets Banner */}
                {messages.length <= 2 && (
                  <div className="bg-[var(--surface2)]/80 border border-[var(--line)] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-[var(--paper)] uppercase tracking-wider">
                        <Flame size={15} className="text-amber-400 animate-bounce" />
                        <span>Popular Inquiries (1-Click)</span>
                      </div>
                      <span className="text-[11px] text-[var(--mist)]">
                        Click any prompt to instantly find top matches
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {COPILOT_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handlePresetClick(preset)}
                          className="flex items-center justify-between p-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface3)] hover:border-emerald-500/50 text-left text-xs font-bold text-[var(--paper)] transition-all cursor-pointer group shadow-xs"
                        >
                          <span className="truncate">{preset.label}</span>
                          <ChevronRight
                            size={15}
                            className="text-[var(--mist)] group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Timeline */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    } animate-fade-in`}
                  >
                    {/* User Bubble */}
                    {msg.sender === "user" && (
                      <div className="max-w-[85%] sm:max-w-[75%] bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl rounded-tr-md px-5 py-3 text-sm font-semibold shadow-lg shadow-teal-500/10">
                        {msg.text}
                      </div>
                    )}

                    {/* Copilot Bubble */}
                    {msg.sender === "copilot" && (
                      <div className="w-full max-w-3xl space-y-4">
                        {/* Text bubble */}
                        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl rounded-tl-md p-4 sm:p-5 text-sm text-[var(--paper)] leading-relaxed shadow-md space-y-4">
                          {msg.type === "greeting" && (
                            <div className="whitespace-pre-line text-[var(--paper)] font-medium leading-relaxed">
                              {msg.text}
                            </div>
                          )}

                          {msg.type === "recommendation" && (
                            <div className="space-y-4">
                              <p className="font-semibold text-[var(--paper)] text-sm sm:text-base leading-snug">
                                {msg.text}
                              </p>

                              {/* 🏆 Hero Recommendation Card */}
                              {msg.topPick && (
                                <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-[var(--surface2)] to-teal-500/10 p-4 sm:p-6 shadow-xl space-y-5">
                                  {/* Card Top Pill & Seller Trust Badge */}
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)]/80 pb-3.5">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25">
                                        <Award size={13} className="fill-white" />
                                        #1 BEST MATCH
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        ✨ {msg.topPick.matchPercentage}% Fit Score
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-[var(--mist)]">
                                      <ShieldCheck size={14} className="text-emerald-400" />
                                      <span>
                                        Seller: <b className="text-[var(--paper)]">{msg.topPick.product.supplier || "Verified Peer"}</b>
                                      </span>
                                    </div>
                                  </div>

                                  {/* Product Specs Deck */}
                                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                    <div className="relative w-full sm:w-40 h-40 rounded-2xl overflow-hidden bg-[var(--surface3)] border border-[var(--line)] shrink-0 shadow-inner group">
                                      <img
                                        src={msg.topPick.product.image || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"}
                                        alt={msg.topPick.product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-black/80 text-white backdrop-blur-md">
                                        {msg.topPick.product.category}
                                      </span>
                                    </div>

                                    <div className="flex-1 space-y-2.5 w-full">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-base sm:text-lg font-black text-[var(--paper)] leading-snug">
                                          {msg.topPick.product.name}
                                        </h4>
                                        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                                          {msg.topPick.product.condition || "Like New"}
                                        </span>
                                      </div>

                                      {/* Dual Price & Bargain Target Section */}
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                                        <div>
                                          <span className="text-[10px] text-[var(--mist)] uppercase font-extrabold tracking-wider block">
                                            List Price
                                          </span>
                                          <span className="text-base font-black text-[var(--paper)]">
                                            {fmtINR(msg.topPick.product.basePrice)}
                                          </span>
                                        </div>

                                        <div className="border-l border-[var(--line)] pl-3">
                                          <span className="text-[10px] text-emerald-400 uppercase font-extrabold tracking-wider flex items-center gap-1">
                                            <Zap size={11} />
                                            Copilot Target
                                          </span>
                                          <span className="text-base font-black text-emerald-400">
                                            {fmtINR(msg.topPick.suggestedOffer)}
                                          </span>
                                        </div>

                                        <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-[var(--line)] pt-2 sm:pt-0 sm:pl-3 flex items-center">
                                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                            <TrendingDown size={12} />
                                            Save {fmtINR(msg.topPick.potentialSavings)}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Rationale Bullet Points */}
                                      <div className="space-y-1.5 pt-1">
                                        <div className="text-[11px] font-black text-[var(--mist)] uppercase tracking-wider">
                                          Why this is your optimal match:
                                        </div>
                                        <div className="space-y-1">
                                          {msg.rationaleList.map((rat, rIdx) => (
                                            <div
                                              key={rIdx}
                                              className="flex items-start gap-2 text-xs text-[var(--paper)] font-medium"
                                            >
                                              <CheckCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                              <span>{rat}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons Deck */}
                                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[var(--line)]/80">
                                    <button
                                      onClick={() => {
                                        onRequestQuote(msg.topPick.product, msg.topPick.suggestedOffer);
                                        onClose();
                                      }}
                                      className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-teal-500/25 transition-all cursor-pointer active:scale-98"
                                    >
                                      <MessageSquareQuote size={15} />
                                      <span>Bargain at {fmtINR(msg.topPick.suggestedOffer)}</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        onOpenProduct(msg.topPick.product);
                                        onClose();
                                      }}
                                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface3)] text-xs font-bold text-[var(--paper)] transition-all cursor-pointer shadow-xs"
                                    >
                                      <ExternalLink size={14} />
                                      <span>View Specs</span>
                                    </button>

                                    <button
                                      onClick={() => onAddToCart(msg.topPick.product)}
                                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                                        cartIds.has(msg.topPick.product.id)
                                          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400 font-black"
                                          : "border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface3)] text-[var(--paper)]"
                                      }`}
                                    >
                                      <ShoppingCart size={14} />
                                      <span>{cartIds.has(msg.topPick.product.id) ? "Saved" : "Save"}</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* 💡 Value Alternative / Runner Up Mini Card */}
                              {msg.runnerUp && (
                                <div className="border border-[var(--line)] bg-[var(--surface2)]/70 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-xs">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-extrabold text-[var(--mist)] uppercase tracking-wider flex items-center gap-1.5">
                                      <ShieldCheck size={14} className="text-teal-400" />
                                      Runner-Up Value Alternative
                                    </span>
                                    <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                      {msg.runnerUp.matchPercentage}% Fit
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={msg.runnerUp.product.image || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100"}
                                        alt={msg.runnerUp.product.name}
                                        className="w-12 h-12 rounded-xl object-cover border border-[var(--line)] shrink-0"
                                      />
                                      <div>
                                        <p className="text-xs font-bold text-[var(--paper)] line-clamp-1">
                                          {msg.runnerUp.product.name}
                                        </p>
                                        <p className="text-xs font-black text-[var(--paper)] mt-0.5">
                                          {fmtINR(msg.runnerUp.product.basePrice)}{" "}
                                          <span className="text-[11px] font-semibold text-emerald-400">
                                            (Target: {fmtINR(msg.runnerUp.suggestedOffer)})
                                          </span>
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() => {
                                          setCompareModalItem({
                                            item1: msg.topPick,
                                            item2: msg.runnerUp,
                                          });
                                        }}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-all cursor-pointer flex items-center gap-1"
                                      >
                                        <Scale size={12} />
                                        <span>Compare</span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          onOpenProduct(msg.runnerUp.product);
                                          onClose();
                                        }}
                                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface3)] text-[var(--paper)] transition-all cursor-pointer"
                                      >
                                        Inspect
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quick Interactive Follow-Up Chips */}
                        {msg.quickFollowUps && msg.quickFollowUps.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1 pl-1">
                            {msg.quickFollowUps.map((chip, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => handleFollowUpClick(chip, msg.topPick, msg.runnerUp)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:bg-emerald-500/10 hover:border-emerald-500/40 text-xs font-bold text-[var(--paper)] transition-all cursor-pointer shadow-xs active:scale-95"
                              >
                                <Sparkles size={11} className="text-emerald-400" />
                                <span>{chip}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-3 text-xs font-bold text-[var(--mist)] animate-pulse pl-2 py-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                      <Bot size={16} />
                    </div>
                    <span>Evaluating {allProducts.length} listings & computing best match...</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="p-3.5 sm:p-5 border-t border-[var(--line)] bg-[var(--surface2)]/80 backdrop-blur-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProcessQuery(inputQuery);
                  }}
                  className="flex items-center gap-2.5 bg-[var(--surface)] border border-[var(--line)] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-2xl p-1.5 shadow-sm transition-all"
                >
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Give 2-3 details (e.g. MacBook for coding under 45k, or iPhone with 85%+ battery)..."
                    className="flex-1 bg-transparent px-3.5 py-2.5 text-xs sm:text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)] font-medium"
                  />

                  <button
                    type="submit"
                    disabled={!inputQuery.trim()}
                    className="inline-flex items-center justify-center w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-teal-500/25 transition-all cursor-pointer shrink-0 active:scale-95"
                    title="Ask Copilot"
                  >
                    <Send size={16} />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[11px] text-[var(--mist)] px-2 pt-2">
                  <span>💡 Tip: Combine <b>Category</b> + <b>Budget (e.g. 35k)</b> + <b>Must-have</b> for exact pick.</span>
                  <span className="font-extrabold text-emerald-400 hidden sm:inline">⚡ Real-time Deal Intelligence</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Modal Dialog */}
        {compareModalItem && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-5 sm:p-6 max-w-2xl w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-2 text-base font-black text-[var(--paper)]">
                  <Scale size={18} className="text-teal-400" />
                  <span>Item Comparison</span>
                </div>
                <button
                  onClick={() => setCompareModalItem(null)}
                  className="p-1.5 rounded-lg hover:bg-[var(--surface2)] text-[var(--mist)] hover:text-[var(--paper)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Item 1 */}
                <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-4 space-y-3">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                    #1 Top Pick
                  </span>
                  <img
                    src={compareModalItem.item1.product.image}
                    alt={compareModalItem.item1.product.name}
                    className="w-full h-32 object-cover rounded-xl border border-[var(--line)]"
                  />
                  <h5 className="text-xs font-black text-[var(--paper)] line-clamp-2">
                    {compareModalItem.item1.product.name}
                  </h5>
                  <div className="space-y-1 text-xs">
                    <p className="font-black text-emerald-400">
                      Target: {fmtINR(compareModalItem.item1.suggestedOffer)}
                    </p>
                    <p className="text-[var(--mist)] text-[11px]">
                      List Price: {fmtINR(compareModalItem.item1.product.basePrice)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onRequestQuote(compareModalItem.item1.product, compareModalItem.item1.suggestedOffer);
                      setCompareModalItem(null);
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black"
                  >
                    Bargain This
                  </button>
                </div>

                {/* Item 2 */}
                <div className="border border-[var(--line)] bg-[var(--surface2)] rounded-2xl p-4 space-y-3">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[var(--surface3)] text-[var(--paper)] border border-[var(--line)]">
                    Runner-Up
                  </span>
                  <img
                    src={compareModalItem.item2.product.image}
                    alt={compareModalItem.item2.product.name}
                    className="w-full h-32 object-cover rounded-xl border border-[var(--line)]"
                  />
                  <h5 className="text-xs font-black text-[var(--paper)] line-clamp-2">
                    {compareModalItem.item2.product.name}
                  </h5>
                  <div className="space-y-1 text-xs">
                    <p className="font-black text-teal-400">
                      Target: {fmtINR(compareModalItem.item2.suggestedOffer)}
                    </p>
                    <p className="text-[var(--mist)] text-[11px]">
                      List Price: {fmtINR(compareModalItem.item2.product.basePrice)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onRequestQuote(compareModalItem.item2.product, compareModalItem.item2.suggestedOffer);
                      setCompareModalItem(null);
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-[var(--surface3)] hover:bg-[var(--line)] text-[var(--paper)] text-xs font-black border border-[var(--line)]"
                  >
                    Bargain This
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
