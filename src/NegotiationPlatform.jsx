import React, { useState, useEffect, useMemo } from "react";
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
import { InvoiceModal } from "./components/modals/InvoiceModal.jsx";
import { AutomationRulesModal } from "./components/modals/AutomationRulesModal.jsx";
import { Confetti } from "./components/common/Confetti.jsx";
import { FooterInfoPage } from "./components/pages/FooterInfoPage.jsx";
import { BuyerCopilotModal } from "./components/copilot/BuyerCopilotModal.jsx";
import { BuyerCopilotFloatingButton } from "./components/copilot/BuyerCopilotFloatingButton.jsx";

const SELLER_SESSION_KEY = "sellx:seller-session";

function getStoredSellerSession() {
  try {
    const stored = JSON.parse(localStorage.getItem(SELLER_SESSION_KEY));
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

export default function App() {
  const [theme, setTheme] = useState("light");
  const [sellerSession, setSellerSession] = useState(getStoredSellerSession);
  const [role, setRole] = useState(() => (getStoredSellerSession() ? "seller" : "buyer"));
  const [sellerAuthed, setSellerAuthed] = useState(() => Boolean(sellerSession));
  const [activeTab, setActiveTab] = useState("catalog");
  const [authViewOpen, setAuthViewOpen] = useState(false);
  const [authTargetTab, setAuthTargetTab] = useState(null);
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [activeDealId, setActiveDealId] = useState(null);
  const [automationProduct, setAutomationProduct] = useState(null);
  const [footerInfoTopic, setFooterInfoTopic] = useState(null);

  const [copilotOpen, setCopilotOpen] = useState(false);
  const [rfqProduct, setRfqProduct] = useState(null);
  const [rfqInitialPrice, setRfqInitialPrice] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
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
  const [invoiceDeal, setInvoiceDeal] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  // Load initial products and deals from backend API
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
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key !== "Escape") return;
      if (invoiceDeal) setInvoiceDeal(null);
      else if (copilotOpen) setCopilotOpen(false);
      else if (rfqProduct) { setRfqProduct(null); setRfqInitialPrice(null); }
      else if (addItemOpen) setAddItemOpen(false);
      else if (detailProduct) setDetailProduct(null);
      else if (acceptModal.dealId) setAcceptModal({ dealId: null, viewOnly: false });
      else if (declineModal.dealId) setDeclineModal({ dealId: null, role: null });
      else if (paymentModal.dealId) setPaymentModal({ dealId: null });
      else if (cartOpen) setCartOpen(false);
      else if (notifOpen) setNotifOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [invoiceDeal, copilotOpen, rfqProduct, addItemOpen, detailProduct, acceptModal.dealId, declineModal.dealId, paymentModal.dealId, cartOpen, notifOpen]);

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

  const cartIds = useMemo(() => new Set(cartItems.map((p) => p.id)), [cartItems]);

  const goToTab = (tab) => {
    setDetailProduct(null);
    setFooterInfoTopic(null);

    if (tab === "catalog") {
      setActiveTab("catalog");
      setAuthViewOpen(false);
      setAuthTargetTab(null);
      return;
    }

    if ((tab === "desk" || tab === "dealroom") && !sellerAuthed) {
      setAuthTargetTab(tab);
      setAuthViewOpen(true);
      return;
    }

    if (tab === "desk") {
      if (role !== "seller") setRole("seller");
    }

    setActiveTab(tab);
    setAuthViewOpen(false);
    setAuthTargetTab(null);
  };

  const addSellerProduct = async (product) => {
    setSellerProducts((prev) => [product, ...prev]);
    setAddItemOpen(false);
    pushNotification(`"${product.name}" is now live on the marketplace.`, { icon: PackagePlus, tone: "brass" });

    try {
      await api.createProduct(product);
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

  const submitRFQ = async ({ product, targetPrice, leadTime, notes }) => {
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

    const deal = {
      id,
      product,
      productId: product.id,
      buyerName: "You (Buyer)",
      sellerName: product.supplier,
      targetMarginPct: 0.22,
      messages,
      termSheet: { unitPrice: targetPrice, leadTimeDays: leadTime, status: "proposed", expiresAt: Date.now() + 2 * 3600000, lastProposedBy: "buyer" },
      createdAt: Date.now(),
    };

    setDeals((prev) => [deal, ...prev]);
    setRfqProduct(null);
    setActiveDealId(id);
    setActiveTab("dealroom");
    pushNotification(`Offer submitted to ${product.supplier} for ${product.name}.`, { icon: Send, tone: "teal", dealId: id });

    try {
      await api.createDeal({
        productId: product.id,
        product,
        buyerName: "You (Buyer)",
        initialOffer: { unitPrice: targetPrice, leadTimeDays: leadTime, note: notes },
      });
    } catch (e) {
      console.warn("Backend sync notice:", e);
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
      await api.postMessage(dealId, { sender: senderRole, text, type: "text" });
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
      await api.submitCounter(dealId, { sender: senderRole, unitPrice, leadTimeDays });
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
    setConfettiActive(true);
    pushNotification(`Deal locked for ${deals.find((d) => d.id === dealId)?.product?.name || dealId}. Checkout link generated (24h expiry).`, { icon: Lock, tone: "brass", dealId });

    try {
      await api.acceptDeal(dealId, role);
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
      await api.declineDeal(dealId, senderRole);
    } catch (e) {
      console.warn("Backend sync notice:", e);
    }
  };

  const openPayment = (dealId) => setPaymentModal({ dealId });

  const confirmPayment = (dealId, method) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const termSheet = { ...d.termSheet, paymentStatus: "paid", paymentMethod: method, paidAt: Date.now() };
        const label = PAYMENT_METHODS.find((m) => m.key === method)?.label || method;
        const sysMsg = { id: genId("m"), sender: "system", type: "text", text: `Payment received via ${label}.`, timestamp: Date.now() };
        return { ...d, messages: [...messages, sysMsg], termSheet };
      })
    );
    setConfettiActive(true);
    pushNotification(`Payment received for ${deals.find((d) => d.id === dealId)?.product?.name || dealId}.`, { icon: CheckCircle2, tone: "brass", dealId });
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

  const handleLoginSuccess = (session) => {
    const { id, email, name, role: userRole, verified, createdAt } = session.user;
    const safeSession = {
      token: session.token,
      user: { id, email, name, role: userRole, verified, ...(createdAt == null ? {} : { createdAt }) },
    };
    localStorage.setItem(SELLER_SESSION_KEY, JSON.stringify(safeSession));
    setSellerSession(safeSession);
    setSellerAuthed(true);
    setAuthViewOpen(false);

    const destination = authTargetTab || "desk";
    if (destination === "desk") {
      setRole("seller");
      setActiveTab("desk");
    } else if (destination === "dealroom") {
      setActiveTab("dealroom");
    } else {
      setActiveTab("catalog");
    }
    setAuthTargetTab(null);
    pushNotification("Signed in successfully.", { icon: Store, tone: "brass" });
  };

  const handleSignOut = () => {
    localStorage.removeItem(SELLER_SESSION_KEY);
    setSellerSession(null);
    setSellerAuthed(false);
    setRole("buyer");
    setActiveTab("catalog");
    setAuthViewOpen(false);
    setAuthTargetTab(null);
    pushNotification("Signed out of trade desk.", { icon: Store, tone: "neutral" });
  };

  // If in dedicated Auth view (opened when user clicked "My Listings", "Bargain Chats", or "Sign In")
  if (authViewOpen) {
    return (
      <div className={`sellx-root ${theme} min-h-screen bg-[var(--ink)] text-[var(--paper)] font-body flex flex-col`}>
        <style>{GLOBAL_STYLES}</style>
        <SellerLoginPage
          theme={theme}
          setTheme={setTheme}
          onLogin={handleLoginSuccess}
          onBack={() => {
            setAuthViewOpen(false);
            setAuthTargetTab(null);
            setActiveTab("catalog");
          }}
          titleHint={authTargetTab === "dealroom" ? "Sign in for Bargain Chats" : "Sign in to Seller Trade Desk"}
        />
        <NotificationDrawer
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          notifications={notifications}
          onClear={() => setNotifications([])}
          onNotificationClick={handleNotificationClick}
        />
      </div>
    );
  }

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
        onOpenCart={() => setCartOpen(true)}
        onOpenNotifications={() => {
          setNotifOpen(true);
          setUnreadCount(0);
        }}
        unreadCount={unreadCount}
        activeTab={activeTab}
        setActiveTab={goToTab}
        sellerAuthed={sellerAuthed}
        onOpenCopilot={() => setCopilotOpen(true)}
        onOpenAuth={() => {
          setAuthTargetTab("desk");
          setAuthViewOpen(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-6 py-6 sm:py-8 relative z-10">

        {footerInfoTopic ? (
          <FooterInfoPage
            topic={footerInfoTopic}
            onClose={() => setFooterInfoTopic(null)}
            onNavigate={(newRole, tab) => {
              setFooterInfoTopic(null);
              if (newRole) setRole(newRole);
              if (tab) goToTab(tab);
            }}
          />
        ) : detailProduct ? (
          <ProductDetailPage
            product={detailProduct}
            allProducts={allProducts}
            onOpenProduct={(p) => setDetailProduct(p)}
            onBack={() => setDetailProduct(null)}
            onRequestQuote={(p, suggestedPrice) => {
              setRfqInitialPrice(suggestedPrice || null);
              setRfqProduct(p);
            }}
            onToggleCart={toggleCart}
            inCart={cartIds.has(detailProduct.id)}
            cart={cartItems}
          />
        ) : (
          <>
            {activeTab === "catalog" && (
              <CatalogView
                products={allProducts}
                onRequestQuote={(p, suggestedPrice) => {
                  setRfqInitialPrice(suggestedPrice || null);
                  setRfqProduct(p);
                }}
                onToggleCart={toggleCart}
                cartItems={cartItems}
                onOpenProduct={(p) => setDetailProduct(p)}
                onOpenCopilot={() => setCopilotOpen(true)}
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
                onAddItem={() => setAddItemOpen(true)}
                onOpenAutomationRules={(product) => setAutomationProduct(product)}
                onOpenInvoice={(deal) => setInvoiceDeal(deal)}
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
                onOpenCatalog={() => goToTab("catalog")}
                onOpenInvoice={(deal) => setInvoiceDeal(deal)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(newRole, tab) => {
          if (newRole) setRole(newRole);
          if (tab) goToTab(tab);
        }}
        onOpenInfo={(topic) => setFooterInfoTopic(topic)}
        onSelectCategory={(category) => {
          goToTab("catalog");
          setDetailProduct(null);
        }}
      />

      {/* Drawers */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
        onNotificationClick={handleNotificationClick}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeCartItem}
        onCheckout={(item) => {
          setCartOpen(false);
          setRfqProduct(item);
        }}
      />

      {/* Floating Buyer Copilot Button */}
      {role === "buyer" && (
        <BuyerCopilotFloatingButton onClick={() => setCopilotOpen(true)} />
      )}

      {/* Buyer Copilot Hybrid AI Modal */}
      <BuyerCopilotModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        allProducts={allProducts}
        onOpenProduct={(p) => {
          setDetailProduct(p);
          setCopilotOpen(false);
        }}
        onRequestQuote={(p, suggestedPrice) => {
          setRfqInitialPrice(suggestedPrice || null);
          setRfqProduct(p);
          setCopilotOpen(false);
        }}
        onAddToCart={toggleCart}
        cartIds={cartIds}
      />

      {/* Modals */}
      <RFQModal
        open={!!rfqProduct}
        product={rfqProduct}
        initialPrice={rfqInitialPrice}
        onClose={() => {
          setRfqProduct(null);
          setRfqInitialPrice(null);
        }}
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
        onConfirmPayment={confirmPayment}
        onOpenInvoice={(deal) => setInvoiceDeal(deal)}
      />

      {invoiceDeal && (
        <InvoiceModal
          deal={invoiceDeal}
          onClose={() => setInvoiceDeal(null)}
        />
      )}

      {/* Celebration Confetti */}
      <Confetti active={confettiActive} onComplete={() => setConfettiActive(false)} />
    </div>
  );
}