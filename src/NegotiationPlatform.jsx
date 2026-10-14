import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Info,
  PackagePlus,
  Send,
  ArrowLeftRight,
  Lock,
  XCircle,
  CheckCircle2,
  Store,
} from "lucide-react";

import { GLOBAL_STYLES } from "./utils/styles.js";
import { fmtINR } from "./utils/formatters.js";
import { genId, getStage } from "./utils/helpers.js";
import { PRODUCTS } from "./data/products.js";
import { INITIAL_DEALS } from "./data/deals.js";
import { PAYMENT_METHODS } from "./data/constants.js";
import { api } from "./services/api.js";

import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { NotificationDrawer } from "./components/layout/NotificationDrawer.jsx";
import { CartDrawer } from "./components/layout/CartDrawer.jsx";
import { WaveformBackground } from "./components/common/WaveformBackground.jsx";

import { CatalogView } from "./components/catalog/CatalogView.jsx";
import { ProductDetailPage } from "./components/catalog/ProductDetailPage.jsx";
import { SellerDesk } from "./components/seller/SellerDesk.jsx";
import { SellerLoginPage } from "./components/seller/SellerLoginPage.jsx";
import { DealRoom } from "./components/dealroom/DealRoom.jsx";

import { RFQModal } from "./components/modals/RFQModal.jsx";
import { AddItemModal } from "./components/modals/AddItemModal.jsx";
import { AcceptConfirmModal } from "./components/modals/AcceptConfirmModal.jsx";
import { DeclineConfirmModal } from "./components/modals/DeclineConfirmModal.jsx";
import { PaymentModal } from "./components/modals/PaymentModal.jsx";
import { AutomationRulesModal } from "./components/modals/AutomationRulesModal.jsx";
import { FooterInfoPage } from "./components/pages/FooterInfoPage.jsx";
import { BuyerCopilotModal } from "./components/copilot/BuyerCopilotModal.jsx";
import { BuyerCopilotFloatingButton } from "./components/copilot/BuyerCopilotFloatingButton.jsx";

const ACCOUNT_SESSION_KEY = "sellx:account-session";
const PAGE_STATE_KEY = "sellx:page-state";
const HISTORY_ROUTE_KEY = "__sellxRoute";
const PAGE_TABS = new Set(["catalog", "desk", "dealroom"]);

function getStoredAccountSession() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNT_SESSION_KEY));
    if (!stored || typeof stored.token !== "string" || !stored.user?.id) return null;
    const { id, email, name, role, verified, createdAt } = stored.user;
    return {
      token: stored.token,
      user: { id, email, name, role, verified, ...(createdAt == null ? {} : { createdAt }) },
    };
  } catch {
    return null;
  }
}

function getStoredPageState() {
  const fallback = { role: "buyer", activeTab: "catalog", activeDealId: null, detailProductId: null, footerInfoTopic: null };
  try {
    const stored = JSON.parse(localStorage.getItem(PAGE_STATE_KEY));
    if (!stored || typeof stored !== "object") return fallback;
    return {
      role: stored.role === "seller" ? "seller" : "buyer",
      activeTab: PAGE_TABS.has(stored.activeTab) ? stored.activeTab : fallback.activeTab,
      activeDealId: typeof stored.activeDealId === "string" ? stored.activeDealId : null,
      detailProductId: typeof stored.detailProductId === "string" ? stored.detailProductId : null,
      footerInfoTopic: typeof stored.footerInfoTopic === "string" ? stored.footerInfoTopic : null,
    };
  } catch {
    return fallback;
  }
}

function routeKey(route) {
  return JSON.stringify(route);
}

export default function App() {
  const [restoredPage] = useState(getStoredPageState);
  const didInitializeRole = useRef(false);
  const navigationRef = useRef({ initialized: false, key: null, depth: 0, replaceNext: false, skipRoleEffect: false });
  const [theme, setTheme] = useState("light");
  const [accountSession, setAccountSession] = useState(getStoredAccountSession);
  const [role, setRole] = useState(() => (accountSession || restoredPage.role !== "seller" ? restoredPage.role : "buyer"));
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(accountSession));
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState("");
  const [activeTab, setActiveTab] = useState(() => (
    accountSession || !["desk", "dealroom"].includes(restoredPage.activeTab) ? restoredPage.activeTab : "catalog"
  ));
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [activeDealId, setActiveDealId] = useState(() => (accountSession ? restoredPage.activeDealId : null));
  const [automationProduct, setAutomationProduct] = useState(null);
  const [footerInfoTopic, setFooterInfoTopic] = useState(restoredPage.footerInfoTopic);

  // Keep the marketplace AI assistant available after the revamp merge.
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [rfqProduct, setRfqProduct] = useState(null);
  const [detailProductId, setDetailProductId] = useState(restoredPage.detailProductId);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [backendProducts, setBackendProducts] = useState(PRODUCTS);
  const [addItemOpen, setAddItemOpen] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: genId("n"),
      text: "SellX backend connected. Live trade desk & deal room APIs active.",
      icon: Info,
      tone: "teal",
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  const [acceptModal, setAcceptModal] = useState({ dealId: null, viewOnly: false });
  const [declineModal, setDeclineModal] = useState({ dealId: null, role: null });
  const [paymentModal, setPaymentModal] = useState({ dealId: null });

  // The API is the shared source of truth: listings, offers, and chat updates
  // created in one browser are visible to the other party's view.
  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedDeals] = await Promise.all([
          api.getProducts().catch(() => null),
          api.getDeals().catch(() => null),
        ]);

        if (fetchedProducts && fetchedProducts.length > 0) {
          setBackendProducts(fetchedProducts);
        }
        if (fetchedDeals && fetchedDeals.length > 0) {
          setDeals(fetchedDeals);
        }
      } catch (err) {
        console.warn("Using local fallback data while backend connects:", err);
      }
    }
    loadData();

    const refreshId = window.setInterval(loadData, 5000);
    return () => window.clearInterval(refreshId);
  }, []);

  useEffect(() => {
    if (!didInitializeRole.current) {
      didInitializeRole.current = true;
      return;
    }
    if (navigationRef.current.skipRoleEffect) {
      navigationRef.current = { ...navigationRef.current, skipRoleEffect: false };
      return;
    }
    setActiveTab(role === "buyer" ? "catalog" : "desk");
    setDetailProductId(null);
  }, [role]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key !== "Escape") return;
      if (copilotOpen) setCopilotOpen(false);
      else if (authModalOpen) setAuthModalOpen(false);
      else if (rfqProduct) setRfqProduct(null);
      else if (addItemOpen) setAddItemOpen(false);
      else if (detailProductId) setDetailProductId(null);
      else if (acceptModal.dealId) setAcceptModal({ dealId: null, viewOnly: false });
      else if (declineModal.dealId) setDeclineModal({ dealId: null, role: null });
      else if (paymentModal.dealId) setPaymentModal({ dealId: null });
      else if (cartOpen) setCartOpen(false);
      else if (notifOpen) setNotifOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [copilotOpen, authModalOpen, rfqProduct, addItemOpen, detailProductId, acceptModal.dealId, declineModal.dealId, paymentModal.dealId, cartOpen, notifOpen]);

  const pushNotification = (text, { icon = Info, tone = "teal", dealId } = {}) => {
    setNotifications((prev) => [{ id: genId("n"), text, icon, tone, dealId }, ...prev].slice(0, 30));
    setUnreadCount((c) => c + 1);
  };

  const allProducts = useMemo(() => {
    const combined = [...sellerProducts, ...backendProducts];
    const map = new Map();
    combined.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item);
    });
    return Array.from(map.values());
  }, [sellerProducts, backendProducts]);

  const detailProduct = useMemo(
    () => (detailProductId ? allProducts.find((product) => product.id === detailProductId) || null : null),
    [allProducts, detailProductId]
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        PAGE_STATE_KEY,
        JSON.stringify({ role, activeTab, activeDealId, detailProductId, footerInfoTopic })
      );
    } catch {
      // Browsing still works if local storage is unavailable.
    }
  }, [role, activeTab, activeDealId, detailProductId, footerInfoTopic]);

  // Mirror SellX page changes into the browser history, so Chrome Back/Forward
  // moves through the screens the buyer has actually visited.
  useEffect(() => {
    const route = { role, activeTab, activeDealId, detailProductId, footerInfoTopic };
    const key = routeKey(route);
    const state = window.history.state;

    if (!navigationRef.current.initialized) {
      const existingEntry = state?.[HISTORY_ROUTE_KEY];
      const depth = Number.isInteger(existingEntry?.depth) && existingEntry.depth >= 0 ? existingEntry.depth : 0;
      window.history.replaceState({ ...state, [HISTORY_ROUTE_KEY]: { route, depth } }, "");
      navigationRef.current = { initialized: true, key, depth, replaceNext: false, skipRoleEffect: false };
      return;
    }

    if (navigationRef.current.key === key) return;

    if (navigationRef.current.replaceNext) {
      window.history.replaceState(
        { ...state, [HISTORY_ROUTE_KEY]: { route, depth: navigationRef.current.depth } },
        ""
      );
      navigationRef.current = { ...navigationRef.current, key, replaceNext: false };
      return;
    }

    const depth = navigationRef.current.depth + 1;
    window.history.pushState({ ...state, [HISTORY_ROUTE_KEY]: { route, depth } }, "");
    navigationRef.current = { ...navigationRef.current, key, depth };
  }, [role, activeTab, activeDealId, detailProductId, footerInfoTopic]);

  useEffect(() => {
    const restoreRoute = (event) => {
      const saved = event.state?.[HISTORY_ROUTE_KEY];
      if (!saved?.route) return;

      const savedRoute = saved.route;
      const canOpenPrivatePage = Boolean(accountSession);
      const nextRole = canOpenPrivatePage && savedRoute.role === "seller" ? "seller" : "buyer";
      const nextTab = PAGE_TABS.has(savedRoute.activeTab) ? savedRoute.activeTab : "catalog";
      const safeTab = !canOpenPrivatePage && (nextTab === "desk" || nextTab === "dealroom") ? "catalog" : nextTab;
      const nextRoute = {
        role: nextRole,
        activeTab: safeTab,
        activeDealId: canOpenPrivatePage && typeof savedRoute.activeDealId === "string" ? savedRoute.activeDealId : null,
        detailProductId: typeof savedRoute.detailProductId === "string" ? savedRoute.detailProductId : null,
        footerInfoTopic: typeof savedRoute.footerInfoTopic === "string" ? savedRoute.footerInfoTopic : null,
      };

      navigationRef.current = {
        initialized: true,
        key: routeKey(nextRoute),
        depth: Number.isInteger(saved.depth) && saved.depth >= 0 ? saved.depth : 0,
        replaceNext: false,
        skipRoleEffect: role !== nextRoute.role,
      };
      setRole(nextRoute.role);
      setActiveTab(nextRoute.activeTab);
      setActiveDealId(nextRoute.activeDealId);
      setDetailProductId(nextRoute.detailProductId);
      setFooterInfoTopic(nextRoute.footerInfoTopic);
    };

    window.addEventListener("popstate", restoreRoute);
    return () => window.removeEventListener("popstate", restoreRoute);
  }, [accountSession]);

  const navigateBack = () => {
    if (navigationRef.current.depth > 0) {
      window.history.back();
      return;
    }

    const isMarketplace = role === "buyer" && activeTab === "catalog" && !detailProductId && !footerInfoTopic;
    if (isMarketplace) {
      window.history.back();
      return;
    }

    navigationRef.current = { ...navigationRef.current, replaceNext: true };
    setRole("buyer");
    setActiveTab("catalog");
    setActiveDealId(null);
    setDetailProductId(null);
    setFooterInfoTopic(null);
  };

  const cartIds = useMemo(() => new Set(cartItems.map((p) => p.id)), [cartItems]);

  const requestAuthentication = (action = "continue") => {
    setAuthReason(action);
    setAuthModalOpen(true);
  };

  const handleLogin = (session) => {
    const { id, email, name, role: accountRole, verified, createdAt } = session.user;
    const safeSession = {
      token: session.token,
      user: { id, email, name, role: accountRole, verified, ...(createdAt == null ? {} : { createdAt }) },
    };
    localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(safeSession));
    setAccountSession(safeSession);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    setRole("buyer");
    setActiveTab("catalog");
    setDetailProductId(null);
    setFooterInfoTopic(null);
    pushNotification("Signed in. Your buyer account is ready.", { icon: Store, tone: "teal" });
  };

  const goToTab = (tab) => {
    if (!isAuthenticated && (tab === "dealroom" || tab === "desk")) {
      requestAuthentication(tab === "desk" ? "open Seller Portal" : "view your offers");
      return;
    }
    setDetailProductId(null);
    setFooterInfoTopic(null);
    setActiveTab(tab);
  };

  const addSellerProduct = async (product) => {
    const sellerName = accountSession?.user?.name || "Verified Owner";
    const sellerProduct = {
      ...product,
      supplier: `${sellerName} (Verified Seller)`,
    };
    setSellerProducts((prev) => [sellerProduct, ...prev]);
    setAddItemOpen(false);
    pushNotification(`"${sellerProduct.name}" is now live on the marketplace.`, { icon: PackagePlus, tone: "brass" });

    try {
      const savedProduct = await api.createProduct(sellerProduct);
      setSellerProducts((prev) => prev.map((item) => (item.id === sellerProduct.id ? savedProduct : item)));
      setBackendProducts((prev) => [savedProduct, ...prev.filter((item) => item.id !== savedProduct.id)]);
    } catch (e) {
      console.warn("Backend sync queued:", e);
    }
  };

  const stats = useMemo(() => {
    const activeRFQs = deals.filter((d) => getStage(d) !== "Closed/Won").length;
    const lockedDeals = deals.filter((d) => d.termSheet?.status === "locked").length;
    const totalSavings = deals
      .filter((d) => d.termSheet?.status === "locked")
      .reduce((sum, d) => sum + ((d.product?.basePrice || 0) - (d.termSheet?.unitPrice || 0)), 0);
    const totalMargin = deals
      .filter((d) => d.termSheet?.status === "locked")
      .reduce((sum, d) => sum + ((d.termSheet?.unitPrice || 0) - (d.product?.cost || 0)), 0);
    return {
      activeRFQs,
      lockedDeals,
      totalSavings: Math.max(0, totalSavings),
      totalMargin: Math.max(0, totalMargin),
    };
  }, [deals]);

  /* ---- actions ---- */

  const submitRFQ = async ({ product, targetPrice, leadTime, handoverType, notes }) => {
    const id = `D-${1000 + deals.length + 1}`;
    const offerMsg = {
      id: genId("m"),
      sender: "buyer",
      type: "offer",
      timestamp: Date.now(),
      offer: { unitPrice: targetPrice, leadTimeDays: leadTime, status: "proposed", previousUnitPrice: null },
    };
    const sysMsg = { id: genId("m"), sender: "system", type: "text", text: "Offer submitted by buyer.", timestamp: Date.now() - 1000 };
    const messages = notes
      ? [sysMsg, offerMsg, { id: genId("m"), sender: "buyer", type: "text", text: notes, timestamp: Date.now() + 1000 }]
      : [sysMsg, offerMsg];

    const fallbackDeal = {
      id,
      product,
      productId: product.id,
      buyerName: accountSession?.user?.name || "You (Buyer)",
      sellerName: product.supplier,
      targetMarginPct: 0.22,
      messages,
      handoverType,
      termSheet: { unitPrice: targetPrice, leadTimeDays: leadTime, handoverType, status: "proposed", expiresAt: Date.now() + 2 * 3600000, lastProposedBy: "buyer" },
      createdAt: Date.now(),
    };

    setRfqProduct(null);

    try {
      const savedDeal = await api.createDeal({
        productId: product.id,
        product,
        buyerName: accountSession?.user?.name || "You (Buyer)",
        initialOffer: { unitPrice: targetPrice, leadTimeDays: leadTime, handoverType, note: notes },
      });
      setDeals((prev) => [savedDeal, ...prev.filter((deal) => deal.id !== savedDeal.id)]);
      setActiveDealId(savedDeal.id);
      setActiveTab("dealroom");
      pushNotification(`Offer sent to ${savedDeal.sellerName || product.supplier} for ${product.name}.`, { icon: Send, tone: "teal", dealId: savedDeal.id });
    } catch (e) {
      console.warn("Backend sync notice:", e);
      setDeals((prev) => [fallbackDeal, ...prev]);
      setActiveDealId(fallbackDeal.id);
      setActiveTab("dealroom");
      pushNotification(`Offer saved locally for ${product.name}. It will sync when the server reconnects.`, { icon: Send, tone: "teal", dealId: fallbackDeal.id });
    }
  };

  const sendMessage = async (dealId, senderRole, text) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id !== dealId
          ? d
          : { ...d, messages: [...d.messages, { id: genId("m"), sender: senderRole, type: "text", text, timestamp: Date.now() }] }
      )
    );

    try {
      const result = await api.postMessage(dealId, { sender: senderRole, text, type: "text" });
      if (result.deal) setDeals((prev) => prev.map((deal) => (deal.id === result.deal.id ? result.deal : deal)));
    } catch (e) {
      console.warn("Backend sync notice:", e);
    }
  };

  const proposeCounter = async (dealId, senderRole, { unitPrice, leadTimeDays }) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const prevOffer = [...d.messages].reverse().find((m) => m.type === "offer" && m.offer?.status === "proposed");
        const messages = d.messages.map((m) =>
          m.type === "offer" && m.offer?.status === "proposed" ? { ...m, offer: { ...m.offer, status: "superseded" } } : m
        );
        const newMsg = {
          id: genId("m"),
          sender: senderRole,
          type: "offer",
          timestamp: Date.now(),
          offer: { unitPrice, leadTimeDays, status: "proposed", previousUnitPrice: prevOffer ? prevOffer.offer.unitPrice : null },
        };
        return {
          ...d,
          messages: [...messages, newMsg],
          termSheet: { unitPrice, leadTimeDays, status: "proposed", expiresAt: Date.now() + 2 * 3600000, lastProposedBy: senderRole },
        };
      })
    );
    pushNotification(
      `${senderRole === "buyer" ? "Buyer" : "Seller"} proposed a counter-offer on ${deals.find((d) => d.id === dealId)?.product?.name || dealId}.`,
      { icon: ArrowLeftRight, tone: senderRole === "buyer" ? "teal" : "brass", dealId }
    );

    try {
      const savedDeal = await api.submitCounter(dealId, { sender: senderRole, unitPrice, leadTimeDays });
      if (savedDeal) setDeals((prev) => prev.map((deal) => (deal.id === savedDeal.id ? savedDeal : deal)));
    } catch (e) {
      console.warn("Backend sync notice:", e);
    }
  };

  const quickCounter = (dealId, pct) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;
    const ts = deal.termSheet;
    proposeCounter(dealId, "seller", { unitPrice: Number((ts.unitPrice * (1 + pct)).toFixed(0)), leadTimeDays: ts.leadTimeDays });
  };

  const requestLock = (dealId, viewOnly = false) => setAcceptModal({ dealId, viewOnly });

  const requestDecline = (dealId, senderRole) => setDeclineModal({ dealId, role: senderRole });

  const confirmLock = async (dealId) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const messages = d.messages.map((m) =>
          m.type === "offer" && m.offer?.status === "proposed" ? { ...m, offer: { ...m.offer, status: "accepted" } } : m
        );
        const checkoutUrl = `https://sellx.trade/checkout/${dealId.toLowerCase()}`;
        const termSheet = { ...d.termSheet, status: "locked", paymentStatus: "unpaid", checkoutUrl, checkoutExpiresAt: Date.now() + 24 * 3600000 };
        const sysMsg = { id: genId("m"), sender: "system", type: "text", text: `Term sheet locked at ${fmtINR(d.termSheet.unitPrice)}. Checkout link generated.`, timestamp: Date.now() };
        return { ...d, messages: [...messages, sysMsg], termSheet };
      })
    );
    pushNotification(`Deal locked for ${deals.find((d) => d.id === dealId)?.product?.name || dealId}. Checkout link generated (24h expiry).`, { icon: Lock, tone: "brass", dealId });

    try {
      const savedDeal = await api.acceptDeal(dealId, role);
      if (savedDeal) setDeals((prev) => prev.map((deal) => (deal.id === savedDeal.id ? savedDeal : deal)));
    } catch (e) {
      console.warn("Backend sync notice:", e);
    }
  };

  const declineDeal = async (dealId, senderRole) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const sysMsg = { id: genId("m"), sender: "system", type: "text", text: `${senderRole === "buyer" ? "Buyer" : "Seller"} declined the deal.`, timestamp: Date.now() };
        return { ...d, termSheet: { ...d.termSheet, status: "declined" }, messages: [...d.messages, sysMsg] };
      })
    );
    pushNotification(`Deal declined for ${deals.find((d) => d.id === dealId)?.product?.name || dealId}.`, { icon: XCircle, tone: "brass", dealId });

    try {
      const savedDeal = await api.declineDeal(dealId, senderRole);
      if (savedDeal) setDeals((prev) => prev.map((deal) => (deal.id === savedDeal.id ? savedDeal : deal)));
    } catch (e) {
      console.warn("Backend sync notice:", e);
    }
  };

  const openPayment = (dealId) => {
    if (!isAuthenticated) {
      requestAuthentication("continue to payment");
      return;
    }
    setPaymentModal({ dealId });
  };

  const confirmPayment = async (dealId, method) => {
    const savedDeal = await api.recordPayment(dealId, method);
    if (savedDeal) {
      setDeals((prev) => prev.map((deal) => (deal.id === savedDeal.id ? savedDeal : deal)));
      pushNotification(`Payment recorded for ${savedDeal.product?.name || dealId}. The deal is ready for safe handover.`, { icon: CheckCircle2, tone: "brass", dealId });
    }
    return savedDeal;
  };

  const verifyHandoverOtp = async (dealId, otp) => {
    const savedDeal = await api.verifyHandoverOtp(dealId, otp);
    if (savedDeal) {
      setDeals((prev) => prev.map((deal) => (deal.id === savedDeal.id ? savedDeal : deal)));
      pushNotification(`Handover verified for ${savedDeal.product?.name || dealId}. The deal is now complete.`, { icon: CheckCircle2, tone: "teal", dealId });
    }
    return savedDeal;
  };

  const saveAutomationRules = async (productId, rules) => {
    setSellerProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, automationRules: rules } : p))
    );
    setBackendProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, automationRules: rules } : p))
    );
    pushNotification(`⚡ Automation rules updated for item.`, { icon: CheckCircle2, tone: "teal" });

    try {
      await api.updateProductAutomation(productId, rules);
    } catch (e) {
      console.warn("Backend sync notice:", e);
    }
  };

  const toggleCart = (product) => {
    if (!isAuthenticated) {
      requestAuthentication("save items to your cart");
      return;
    }
    setCartItems((prev) => {
      const inCart = prev.some((p) => p.id === product.id);
      if (inCart) {
        pushNotification(`Removed "${product.name}" from your cart.`, { icon: Info, tone: "neutral" });
        return prev.filter((p) => p.id !== product.id);
      } else {
        pushNotification(`Added "${product.name}" to your cart.`, { icon: CheckCircle2, tone: "teal" });
        return [...prev, product];
      }
    });
  };

  const removeCartItem = (id) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const handleNotificationClick = (n) => {
    if (n.dealId) {
      setActiveDealId(n.dealId);
      setActiveTab("dealroom");
      setNotifOpen(false);
    }
  };

  const activeDeal = useMemo(
    () => (activeDealId ? deals.find((d) => d.id === activeDealId) || null : null),
    [deals, activeDealId]
  );

  return (
    <div className={`sellx-root ${theme} min-h-screen bg-[var(--ink)] text-[var(--paper)] font-body flex flex-col relative overflow-x-hidden`}>
      <style>{GLOBAL_STYLES}</style>
      
      {/* Dynamic Animated Bilateral Soundwave & Equilibrium Background */}
      <WaveformBackground />

      {/* Header */}
      <Header
        role={role}
        setRole={setRole}
        theme={theme}
        setTheme={setTheme}
        stats={stats}
        cartCount={cartItems.length}
        onOpenCart={() => isAuthenticated ? setCartOpen(true) : requestAuthentication("open your saved items")}
        onOpenNotifications={() => {
          setNotifOpen(true);
          setUnreadCount(0);
        }}
        unreadCount={unreadCount}
        activeTab={activeTab}
        setActiveTab={goToTab}
        sellerAuthed={isAuthenticated}
        isAuthenticated={isAuthenticated}
        onRequestAuth={requestAuthentication}
        onOpenAddItem={() => isAuthenticated ? setAddItemOpen(true) : requestAuthentication("post an item for sale")}
        onSignOut={() => {
          localStorage.removeItem(ACCOUNT_SESSION_KEY);
          localStorage.removeItem(PAGE_STATE_KEY);
          setAccountSession(null);
          setIsAuthenticated(false);
          setRole("buyer");
          setActiveTab("catalog");
          setActiveDealId(null);
          setDetailProductId(null);
          setFooterInfoTopic(null);
          pushNotification("Signed out of your SellX account.", { icon: Store, tone: "neutral" });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-6 py-6 sm:py-8 relative z-10">

        {footerInfoTopic ? (
          <FooterInfoPage
            topic={footerInfoTopic}
            onClose={navigateBack}
            onNavigate={(newRole, tab) => {
              setFooterInfoTopic(null);
              if (newRole === "seller" && !isAuthenticated) {
                requestAuthentication("open Seller Portal");
                return;
              }
              if (newRole) setRole(newRole);
              if (tab) goToTab(tab);
            }}
          />
        ) : detailProduct ? (
          <ProductDetailPage
            product={detailProduct}
            allProducts={allProducts}
            onOpenProduct={(p) => setDetailProductId(p.id)}
            onBack={navigateBack}
            onRequestQuote={(p) => isAuthenticated ? setRfqProduct(p) : requestAuthentication("make an offer")}
            onToggleCart={toggleCart}
            inCart={cartIds.has(detailProduct.id)}
            cart={cartItems}
          />
        ) : (
          <>
            {activeTab === "catalog" && (
              <CatalogView
                products={allProducts}
                onRequestQuote={(p) => isAuthenticated ? setRfqProduct(p) : requestAuthentication("make an offer")}
                onToggleCart={toggleCart}
                cartItems={cartItems}
                onOpenProduct={(p) => setDetailProductId(p.id)}
              />
            )}

            {activeTab === "desk" && (
              <SellerDesk
                deals={deals}
                myListings={sellerProducts}
                onOpenDeal={(dealId) => {
                  setActiveDealId(dealId);
                  setActiveTab("dealroom");
                }}
                onQuickAccept={(dealId) => requestLock(dealId, false)}
                onQuickCounter={quickCounter}
                onQuickReject={(dealId) => requestDecline(dealId, "seller")}
                onAddItem={() => isAuthenticated ? setAddItemOpen(true) : requestAuthentication("post an item for sale")}
                onOpenAutomationRules={(product) => setAutomationProduct(product)}
              />
            )}

            {activeTab === "dealroom" && (
              <DealRoom
                deals={deals}
                activeDeal={activeDeal}
                role={role}
                onSelectDeal={(id) => setActiveDealId(id)}
                onSendMessage={(text, dealId) => {
                  const targetId = dealId || activeDealId || activeDeal?.id;
                  if (targetId) sendMessage(targetId, role, text);
                }}
                onProposeCounter={(offer, dealId) => {
                  const targetId = dealId || activeDealId || activeDeal?.id;
                  if (targetId) proposeCounter(targetId, role, offer);
                }}
                onRequestLock={(a, b) => {
                  let targetId = activeDealId || activeDeal?.id;
                  let viewOnly = false;
                  if (typeof a === "string") {
                    targetId = a;
                    viewOnly = Boolean(b);
                  } else if (typeof a === "boolean") {
                    viewOnly = a;
                    if (typeof b === "string") targetId = b;
                  }
                  if (targetId) requestLock(targetId, viewOnly);
                }}
                onRequestDecline={(a, b) => {
                  let targetId = activeDealId || activeDeal?.id;
                  let senderRole = role;
                  if (typeof a === "string") {
                    if (a.startsWith("D-") || a.startsWith("d-")) {
                      targetId = a;
                      if (typeof b === "string") senderRole = b;
                    } else if (a === "buyer" || a === "seller") {
                      senderRole = a;
                      if (typeof b === "string") targetId = b;
                    } else {
                      targetId = a;
                    }
                  }
                  if (targetId) requestDecline(targetId, senderRole);
                }}
                onOpenPayment={(dealId) => {
                  const targetId = (typeof dealId === "string" ? dealId : null) || activeDealId || activeDeal?.id;
                  if (targetId) openPayment(targetId);
                }}
                onVerifyHandoverOtp={(dealId, otp) => verifyHandoverOtp(dealId, otp)}
                onOpenCatalog={() => goToTab("catalog")}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(newRole, tab) => {
          if (newRole === "seller" && !isAuthenticated) {
            requestAuthentication("open Seller Portal");
            return;
          }
          if (newRole) setRole(newRole);
          if (tab) goToTab(tab);
        }}
        onOpenInfo={(topic) => setFooterInfoTopic(topic)}
        onSelectCategory={(category) => {
          goToTab("catalog");
          setDetailProductId(null);
        }}
      />

      {/* Drawers */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        role={role}
        onClear={() => setNotifications([])}
        onNotificationClick={handleNotificationClick}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeCartItem}
        onClear={() => setCartItems([])}
        onGoToCatalog={() => {
          setCartOpen(false);
          goToTab("catalog");
        }}
        onNegotiateItem={(item) => {
          setCartOpen(false);
          setRfqProduct(item);
        }}
      />

      {/* Modals */}
      <RFQModal
        open={!!rfqProduct}
        product={rfqProduct}
        onClose={() => setRfqProduct(null)}
        onSubmit={submitRFQ}
      />

      <AddItemModal
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onSubmit={addSellerProduct}
      />

      <AutomationRulesModal
        isOpen={!!automationProduct}
        product={automationProduct}
        onClose={() => setAutomationProduct(null)}
        onSaveRules={saveAutomationRules}
      />

      <AcceptConfirmModal
        open={!!acceptModal.dealId}
        deal={deals.find((d) => d.id === acceptModal.dealId)}
        viewOnly={acceptModal.viewOnly}
        role={role}
        onClose={() => setAcceptModal({ dealId: null, viewOnly: false })}
        onConfirm={confirmLock}
      />

      <DeclineConfirmModal
        open={!!declineModal.dealId}
        deal={deals.find((d) => d.id === declineModal.dealId)}
        role={declineModal.role}
        onClose={() => setDeclineModal({ dealId: null, role: null })}
        onConfirm={declineDeal}
      />

      <PaymentModal
        open={!!paymentModal.dealId}
        deal={deals.find((d) => d.id === paymentModal.dealId)}
        onClose={() => setPaymentModal({ dealId: null })}
        onConfirm={confirmPayment}
      />

      {/* The buyer assistant remains available in the revamp without crowding the marketplace toolbar. */}
      {role === "buyer" && (
        <BuyerCopilotFloatingButton onClick={() => setCopilotOpen(true)} />
      )}
      <BuyerCopilotModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        allProducts={allProducts}
        onOpenProduct={(product) => {
          goToTab("catalog");
          setDetailProductId(product.id);
          setCopilotOpen(false);
        }}
        onRequestQuote={(product) => {
          setCopilotOpen(false);
          if (isAuthenticated) setRfqProduct(product);
          else requestAuthentication("make an offer");
        }}
        onAddToCart={toggleCart}
        cartIds={cartIds}
      />

      {authModalOpen && (
        <SellerLoginPage
          modal
          authReason={authReason}
          theme={theme}
          setTheme={setTheme}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
