import React, { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, ImagePlus, PackagePlus, Laptop, Sparkles, MapPin, CheckSquare, Square } from "lucide-react";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { GhostButton, PrimaryButton } from "../common/Buttons.jsx";
import { CATEGORY_ICONS } from "../common/Icons.jsx";
import { CATEGORY_STYLES } from "../../utils/styles.js";
import { CITIES, CONDITIONS } from "../../data/constants.js";
import { genId } from "../../utils/helpers.js";

export function AddItemModal({ open, onClose, onSubmit }) {
  const blank = {
    name: "",
    category: "Mobile",
    askingPrice: "",
    minAcceptablePrice: "",
    condition: "Like New",
    city: "Bangalore",
    locality: "Indiranagar",
    description: "",
    sellerName: "You (Verified Owner)",
    boxIncluded: true,
    billIncluded: true,
    cableIncluded: true,
  };
  const [form, setForm] = useState(blank);
  const [photoSlots, setPhotoSlots] = useState(["", "", ""]);
  const [error, setError] = useState("");
  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (open) {
      setForm(blank);
      setPhotoSlots(["", "", ""]);
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleCheckbox = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));

  const handleSlotFile = (slotIdx) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoSlots((prev) => {
        const next = [...prev];
        next[slotIdx] = reader.result;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const removeSlotPhoto = (slotIdx) => {
    setPhotoSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = "";
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Please enter a title for your item.");
      return;
    }
    if (!form.askingPrice || Number(form.askingPrice) <= 0) {
      setError("Please enter a valid asking price.");
      return;
    }
    setError("");

    const basePrice = Number(form.askingPrice);
    const minAcceptablePrice = form.minAcceptablePrice
      ? Number(form.minAcceptablePrice)
      : Math.round(basePrice * 0.85);

    const uploadedImages = photoSlots.filter(Boolean);
    const finalImages = uploadedImages.length > 0 ? uploadedImages : null;

    const includes = [];
    if (form.boxIncluded) includes.push("Original Box");
    if (form.billIncluded) includes.push("Purchase Bill / Invoice");
    if (form.cableIncluded) includes.push("Original Cable & Accessories");

    onSubmit({
      id: `SP-${genId("p")}`,
      name: form.name.trim(),
      category: form.category,
      icon: CATEGORY_ICONS[form.category] || Laptop,
      image: finalImages ? finalImages[0] : null,
      images: finalImages,
      sku: `USED-${form.name.trim().slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      basePrice,
      cost: Math.round(basePrice * 0.75),
      minAcceptablePrice,
      condition: form.condition,
      city: form.city,
      locality: form.locality.trim() || "Central Area",
      distanceKm: 1.8,
      leadTimeDays: 1,
      description: form.description.trim() || "Pre-owned item in verified condition with genuine accessories.",
      supplier: `${form.sellerName.trim() || "Direct Owner"} (${form.locality || "BLR"})`,
      sellerTrust: {
        rating: 5.0,
        reviewsCount: 1,
        verified: true,
        memberSince: "2024",
      },
      includes: includes.length > 0 ? includes : ["Main Device Unit"],
      highlights: [
        `${form.condition} · Verified`,
        form.billIncluded ? "Original Bill Available" : "First Owner",
        "Handover OTP Protected",
      ],
      sellerAdded: true,
      automationRules: {
        enabled: true,
        floorPrice: minAcceptablePrice,
        autoAcceptPrice: Math.round(basePrice * 0.92),
        autoCounterPrice: Math.round(basePrice * 0.88),
        autoAcceptEnabled: true,
        autoDeclineEnabled: true,
        autoCounterEnabled: true,
      },
    });
  };

  const slotTitles = ["1. Front Angle", "2. Back / Side", "3. Ports & Details"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sellx-pop relative w-full sm:max-w-lg bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] sticky top-0 bg-[var(--surface)] z-10">
          <div>
            <h3 className="font-display font-semibold text-[var(--paper)]">Post an Ad &middot; Sell Your Item</h3>
            <div className="text-xs text-[var(--mist)] mt-0.5">Upload multiple angle photos for faster offers.</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface3)] text-[var(--mist)]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30 sellx-rise">
              <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
              <span className="text-xs text-[var(--paper)]">{error}</span>
            </div>
          )}

          {/* 3-Angle Photo Upload Slots */}
          <div>
            <FieldLabel hint="Add 2-3 angles">Photos from Different Angles</FieldLabel>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[0, 1, 2].map((idx) => {
                const preview = photoSlots[idx];
                return (
                  <div key={idx} className="relative">
                    <input
                      ref={fileInputRefs[idx]}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSlotFile(idx)}
                    />
                    {preview ? (
                      <div className="relative rounded-xl overflow-hidden border border-[var(--line)] aspect-[4/3] bg-[var(--surface2)] group">
                        <img src={preview} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSlotPhoto(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-md bg-black/70 text-white flex items-center justify-center hover:bg-black/90 shadow-sm"
                        >
                          <X size={12} />
                        </button>
                        <span className="absolute bottom-1 left-1 right-1 text-center bg-black/60 text-white text-[9px] font-bold py-0.5 rounded truncate">
                          {slotTitles[idx]}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRefs[idx].current?.click()}
                        className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-[var(--line)] flex flex-col items-center justify-center gap-1 text-[var(--mist)] hover:border-[var(--teal)]/60 hover:text-[var(--paper)] transition-all bg-[var(--surface2)]/40 p-1 text-center"
                      >
                        <ImagePlus size={16} className="text-[var(--teal)]" />
                        <span className="text-[10px] font-bold leading-tight">{slotTitles[idx]}</span>
                        <span className="text-[8px] text-[var(--mist-dim)]">+ Upload</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <FieldLabel>Item Title</FieldLabel>
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. iPhone 13 Pro 128GB Graphite or MacBook Air M1"
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Category</FieldLabel>
              <select
                value={form.category}
                onChange={set("category")}
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none appearance-none"
              >
                {Object.keys(CATEGORY_STYLES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>Condition</FieldLabel>
              <select
                value={form.condition}
                onChange={set("condition")}
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none appearance-none"
              >
                {CONDITIONS.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Row: Asking Price & Minimum Reserve */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel hint="Buyer sees this">Asking Price (₹)</FieldLabel>
              <input
                type="number"
                min="0"
                value={form.askingPrice}
                onChange={set("askingPrice")}
                placeholder="30000"
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-[var(--paper)] outline-none"
              />
            </div>

            <div>
              <FieldLabel hint="Hidden floor">Min Acceptable (₹)</FieldLabel>
              <input
                type="number"
                min="0"
                value={form.minAcceptablePrice}
                onChange={set("minAcceptablePrice")}
                placeholder="27000"
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
              />
            </div>
          </div>

          {/* City & Locality */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>City</FieldLabel>
              <select
                value={form.city}
                onChange={set("city")}
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none appearance-none"
              >
                {CITIES.filter((c) => c !== "All India").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>Neighborhood / Locality</FieldLabel>
              <input
                value={form.locality}
                onChange={set("locality")}
                placeholder="e.g. Indiranagar or Bandra"
                className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
              />
            </div>
          </div>

          {/* Included checklist */}
          <div>
            <FieldLabel>Included in Box</FieldLabel>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <label
                onClick={() => toggleCheckbox("boxIncluded")}
                className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                  form.boxIncluded
                    ? "bg-[var(--teal)]/10 border-[var(--teal)]/40 text-[var(--paper)] font-semibold"
                    : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)]"
                }`}
              >
                {form.boxIncluded ? <CheckSquare size={13} className="text-[var(--teal)]" /> : <Square size={13} />}
                <span>Original Box</span>
              </label>

              <label
                onClick={() => toggleCheckbox("billIncluded")}
                className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                  form.billIncluded
                    ? "bg-[var(--teal)]/10 border-[var(--teal)]/40 text-[var(--paper)] font-semibold"
                    : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)]"
                }`}
              >
                {form.billIncluded ? <CheckSquare size={13} className="text-[var(--teal)]" /> : <Square size={13} />}
                <span>Bill / Invoice</span>
              </label>

              <label
                onClick={() => toggleCheckbox("cableIncluded")}
                className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                  form.cableIncluded
                    ? "bg-[var(--teal)]/10 border-[var(--teal)]/40 text-[var(--paper)] font-semibold"
                    : "bg-[var(--surface2)] border-[var(--line)] text-[var(--mist)]"
                }`}
              >
                {form.cableIncluded ? <CheckSquare size={13} className="text-[var(--teal)]" /> : <Square size={13} />}
                <span>Charger Cable</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <FieldLabel>Description & Details</FieldLabel>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={2}
              placeholder="Battery health, age, scratches if any, reasons for selling..."
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2 text-sm text-[var(--paper)] outline-none resize-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <GhostButton onClick={onClose} className="flex-1" type="button">
              Cancel
            </GhostButton>
            <PrimaryButton type="submit" tone="teal" icon={PackagePlus} className="flex-1 font-bold">
              Publish Ad Now
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
