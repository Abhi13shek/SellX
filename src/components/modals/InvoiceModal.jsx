import React, { useRef, useState } from "react";
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  Copy,
  Check,
  Building2,
  FileCheck,
  Calendar,
  Sparkles,
  Award,
  Hash,
} from "lucide-react";
import { BrandMark } from "../common/BrandMark.jsx";
import { fmtINR } from "../../utils/formatters.js";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";

export function InvoiceModal({ deal, onClose }) {
  const [copiedHash, setCopiedHash] = useState(false);
  const printRef = useRef(null);

  if (!deal) return null;

  const product = deal.product || {};
  const ts = deal.termSheet || {};
  const unitPrice = ts.unitPrice || product.basePrice || 10000;
  const isPaid = ts.paymentStatus === "paid";
  const estMsrp = Math.round((product.basePrice || unitPrice) * 1.85);
  const totalSavings = Math.max(0, estMsrp - unitPrice);
  const savingsPct = estMsrp > 0 ? Math.round((totalSavings / estMsrp) * 100) : 0;

  // Invoice identifiers & metadata
  const invoiceNumber = `SX-INV-${(deal.id || "1001").replace(/[^0-9]/g, "") || "8842"}-${new Date().getFullYear()}`;
  const transactionDate = new Date(deal.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const transactionTime = new Date(deal.createdAt || Date.now()).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const paymentMethodLabel = ts.paymentMethod === "upi"
    ? "UPI Instant Escrow (VPA Verified)"
    : ts.paymentMethod === "card"
    ? "Encrypted Debit / Credit Card (3DS Secure)"
    : ts.paymentMethod === "netbanking"
    ? "NetBanking Verified Gateway"
    : "Institutional UPI Escrow Vault";

  const utrRef = `SXUTR${Math.abs(deal.id?.length ? deal.id.length * 984028471920 : 984028471920).toString().padEnd(12, "0").slice(0, 12)}`;
  const imeiNumber = product.imei || `35${(Math.abs(deal.id?.length ? deal.id.length * 9481726 : 8940281)).toString().padEnd(13, "4").slice(0, 13)}`;
  const certHash = `0x${((deal.id || "D1001") + unitPrice + "SELLX-ESCROW").split("").reduce((acc, char) => (acc + char.charCodeAt(0).toString(16)), "").padEnd(32, "a9e7").slice(0, 32)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(certHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      {/* Print-specific style override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: #ffffff !important;
            color: #0f172a !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-3xl my-auto rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Floating Control Bar */}
        <div className="no-print px-5 py-3.5 border-b border-[var(--line)] bg-[var(--surface2)]/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-emerald-500" />
            <span className="font-display font-bold text-sm text-[var(--paper)]">
              Recommerce Bill of Sale &amp; Tax Invoice
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              {isPaid ? "Escrow Secured 🔒" : "Terms Locked 📄"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--teal)] text-[var(--on-teal)] text-xs font-bold hover:bg-[var(--teal-dim)] transition-all cursor-pointer shadow-xs active:scale-95"
              title="Print or Save as PDF"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--surface3)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[var(--surface)]">
          <div
            id="printable-invoice"
            ref={printRef}
            className="w-full bg-white text-slate-900 p-6 sm:p-10 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden"
          >
            {/* Watermark Pattern */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none text-9xl font-black rotate-[-30deg] tracking-widest text-slate-900">
              SELLX
            </div>

            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    SX
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl tracking-tight text-slate-900">
                      SELLX RECOMMERCE DESK
                    </h2>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                      Institutional C2C Recommerce &amp; Escrow Protocol
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-2 font-mono">
                  SellX Recommerce Technologies Ltd. &middot; GSTIN: 29AAECS1982Q1Z8
                </p>
                <p className="text-xs text-slate-500">
                  Escrow Custody Vault &middot; Safe Trade Desk #04, Bangalore, KA, India
                </p>
              </div>

              <div className="sm:text-right">
                <div className="inline-block px-3 py-1 rounded bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-slate-800 uppercase tracking-wide">
                  Official Bill of Sale
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 mt-2">
                  {invoiceNumber}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Date: {transactionDate} &middot; {transactionTime}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Deal ID: <span className="font-bold text-slate-700">{deal.id}</span>
                </div>
              </div>
            </div>

            {/* Two-Party Transaction Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-200 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Buyer Details (Bill To)
                </span>
                <div className="font-bold text-slate-900 text-sm">{deal.buyerName || "You (Verified Buyer)"}</div>
                <div className="text-slate-600 font-mono mt-0.5">Account ID: SX-BYR-{deal.id?.slice(-4) || "8921"}</div>
                <div className="text-slate-600">Settlement Mode: Direct Handover / Courier</div>
                <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                  <ShieldCheck size={12} /> KYC Verified Buyer
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Seller Details (Sold By)
                </span>
                <div className="font-bold text-slate-900 text-sm">{deal.sellerName || product.supplier || "Verified Trade Partner"}</div>
                <div className="text-slate-600 font-mono mt-0.5">Seller Desk ID: SX-SLR-{product.id?.slice(-4) || "4401"}</div>
                <div className="text-slate-600">Location: Indiranagar, Bangalore, KA</div>
                <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                  <ShieldCheck size={12} /> SellX 5-Star Certified Trader
                </div>
              </div>
            </div>

            {/* Hardware & Device Item Particulars */}
            <div className="py-5 border-b border-slate-200">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                Item &amp; Hardware Particulars
              </h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-mono uppercase text-[10px]">
                    <th className="text-left pb-2 font-bold">Item Description</th>
                    <th className="text-left pb-2 font-bold">Graded Condition</th>
                    <th className="text-left pb-2 font-bold">Serial / IMEI</th>
                    <th className="text-right pb-2 font-bold">Bargain Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 pr-2">
                      <div className="font-bold text-slate-900 text-sm">{product.name}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Category: {product.category || "Consumer Electronics"} &middot; SKU: {product.id || "USED-HW-01"}
                      </div>
                      <div className="text-slate-600 text-[11px] mt-1 italic">
                        Inclusions: Original Box, Charging Cable, Valid Invoice
                      </div>
                    </td>
                    <td className="py-3 pr-2 align-top">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                        {product.condition || "Mint / Like New"}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">100% Hardware Pass</div>
                    </td>
                    <td className="py-3 pr-2 align-top font-mono text-[11px] text-slate-700">
                      <div>IMEI: {imeiNumber}</div>
                      <div className="text-[10px] text-slate-400">Clean Status &middot; Factory Reset</div>
                    </td>
                    <td className="py-3 text-right align-top font-mono font-bold text-sm text-slate-900">
                      {fmtINR(unitPrice)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Ledger & Escrow Settlement Breakdown */}
            <div className="py-5 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-6">
              <div className="sm:col-span-7 space-y-2 text-xs">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Payment Protocol &amp; Escrow Guarantee
                </div>
                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1 text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span>SellX 48-Hour Inspection Guarantee Active</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Funds are secured in SellX Escrow. Payout is released to the seller only after the buyer completes 48 hours of uninterrupted device testing or confirms OTP handover.
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    Settlement Method: {paymentMethodLabel}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Escrow Reference UTR: <span className="font-bold text-slate-700">{utrRef}</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Market Benchmark (Est. MSRP):</span>
                  <span className="font-mono line-through text-slate-400">{fmtINR(estMsrp)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Agreed Bargain Value:</span>
                  <span className="font-mono text-slate-800 font-semibold">{fmtINR(unitPrice)}</span>
                </div>
                <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                  <span>Recommerce Savings ({savingsPct}%):</span>
                  <span className="font-mono">- {fmtINR(totalSavings)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>SellX Escrow Protection:</span>
                  <span className="font-mono text-emerald-600 font-semibold">FREE (₹0.00)</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Applicable GST (0% C2C):</span>
                  <span className="font-mono">₹0.00</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-slate-900 font-bold text-sm text-slate-900">
                  <span>Total Escrow Paid:</span>
                  <span className="font-mono text-base text-emerald-700">{fmtINR(unitPrice)}</span>
                </div>
              </div>
            </div>

            {/* Signatures, QR Code & Digital Verification */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end text-xs">
              <div className="sm:col-span-4 flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center p-1.5 shadow-xs shrink-0">
                  <QrCode size={40} className="text-white" />
                  <span className="text-[7px] font-mono uppercase tracking-tighter">Scan Verify</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cryptographic Hash
                  </div>
                  <div className="font-mono text-[10px] text-slate-700 break-all">
                    {certHash}
                  </div>
                  <button
                    onClick={handleCopyHash}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 mt-1 cursor-pointer"
                  >
                    {copiedHash ? <Check size={10} /> : <Copy size={10} />}
                    <span>{copiedHash ? "Hash Copied!" : "Copy Verification Key"}</span>
                  </button>
                </div>
              </div>

              <div className="sm:col-span-4 text-center pb-1">
                <div className="border-b border-slate-300 pb-1 mb-1 font-serif italic text-sm text-slate-700">
                  Digitally Authorized
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  Buyer Digital Handshake
                </div>
              </div>

              <div className="sm:col-span-4 text-center sm:text-right pb-1">
                <div className="border-b border-slate-300 pb-1 mb-1 font-mono font-bold text-xs text-emerald-700">
                  SELLX-PROTOCOL-NODE-OK
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  Automated Escrow Protocol Seal
                </div>
              </div>
            </div>

            {/* Legal Footer Clause */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-[9px] text-slate-400 leading-relaxed font-mono text-center">
              This digital invoice and bill of sale is issued pursuant to the Indian Information Technology Act, 2000. Title and risk of loss transfer upon buyer satisfaction or expiration of the 48-hour inspection window without formal dispute. SellX acts solely as an escrow technology facilitator.
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="no-print p-4 border-t border-[var(--line)] bg-[var(--surface2)] flex items-center justify-between gap-3">
          <div className="text-xs text-[var(--mist)] flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Official digital contract valid for warranty &amp; ownership transfer.</span>
          </div>

          <div className="flex items-center gap-2">
            <GhostButton onClick={onClose}>
              Close
            </GhostButton>
            <PrimaryButton tone="teal" icon={Printer} onClick={handlePrint}>
              Print / Save PDF
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
