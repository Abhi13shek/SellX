import React, { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, ImagePlus, PackagePlus, Laptop } from "lucide-react";
import { FieldLabel } from "../common/FieldLabel.jsx";
import { GhostButton, PrimaryButton } from "../common/Buttons.jsx";
import { CATEGORY_ICONS } from "../common/Icons.jsx";
import { CATEGORY_STYLES } from "../../utils/styles.js";
import { genId } from "../../utils/helpers.js";

export function AddItemModal({ open, onClose, onSubmit }) {
  const blank = {
    name: "",
    category: "Computing",
    sku: "",
    basePrice: "",
    leadTimeDays: "",
    description: "",
    supplier: "Your Company",
  };
  const [form, setForm] = useState(blank);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm(blank);
      setImagePreview("");
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Give the listing a name.");
      return;
    }
    if (!form.basePrice || Number(form.basePrice) <= 0) {
      setError("Enter a valid list price.");
      return;
    }
    setError("");
    onSubmit({
      id: `SP-${genId("p")}`,
      name: form.name.trim(),
      category: form.category,
      icon: CATEGORY_ICONS[form.category] || Laptop,
      image: imagePreview || null,
      sku:
        form.sku.trim() ||
        `SX-${form.name.trim().slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      basePrice: Number(form.basePrice),
      cost: Number(form.basePrice) * 0.75,
      leadTimeDays: Number(form.leadTimeDays) || 3,
      description: form.description.trim() || "Pre-owned item in verified working condition.",
      supplier: form.supplier.trim() || "Verified Seller",
      sellerAdded: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="ledgr-pop relative w-full sm:max-w-lg bg-[var(--surface)] border border-[var(--line)] sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)] sticky top-0 bg-[var(--surface)] z-10">
          <div>
            <h3 className="font-display font-semibold text-[var(--paper)]">List a pre-owned item</h3>
            <div className="text-xs text-[var(--mist)] mt-0.5">Goes live on the second-hand marketplace immediately.</div>
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
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/30 ledgr-rise">
              <AlertTriangle size={14} className="text-[var(--red)] shrink-0 mt-0.5" />
              <span className="text-xs text-[var(--paper)]">{error}</span>
            </div>
          )}

          <div>
            <FieldLabel>Product photo</FieldLabel>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => setImagePreview("")}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-[var(--line)] flex flex-col items-center justify-center gap-2 text-[var(--mist)] hover:border-[var(--teal)]/50 hover:text-[var(--paper)] transition-colors"
              >
                <ImagePlus size={22} />
                <span className="text-xs font-semibold">Upload a photo</span>
                <span className="text-[11px] text-[var(--mist-dim)]">No photo? A styled placeholder is used instead.</span>
              </button>
            )}
          </div>

          <div>
            <FieldLabel>Product name</FieldLabel>
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Industrial 3D Printer"
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

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
            <FieldLabel hint="buyer-facing">List price (₹)</FieldLabel>
            <input
              type="number"
              min="0"
              value={form.basePrice}
              onChange={set("basePrice")}
              placeholder="0"
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
            />
          </div>

          <div>
            <FieldLabel>Lead time (days)</FieldLabel>
            <input
              type="number"
              min="0"
              value={form.leadTimeDays}
              onChange={set("leadTimeDays")}
              placeholder="14"
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm font-mono text-[var(--paper)] outline-none"
            />
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Specs, certifications, packaging..."
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm text-[var(--paper)] outline-none resize-none placeholder:text-[var(--mist-dim)]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <GhostButton onClick={onClose} className="flex-1" type="button">
              Cancel
            </GhostButton>
            <PrimaryButton type="submit" tone="brass" icon={PackagePlus} className="flex-1">
              List product
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
