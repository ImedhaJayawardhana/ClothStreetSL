import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

/* ─── Shared fabric data (imported inline for simplicity) ─── */
export const FABRICS = [
  {
    id: "fab_001",
    name: "Premium Cotton Twill",
    type: "Cotton",
    supplier: "Lanka Fabrics Co.",
    supplierLocation: "Pettah, Colombo",
    rating: 4.8,
    reviewCount: 142,
    colors: [{ hex: "#1e293b", name: "Navy" }, { hex: "#991b1b", name: "Crimson" }, { hex: "#1e3a5f", name: "Ocean" }],
    price: 850,
    minOrder: 50,
    location: "Pettah",
    badge: "new",
    inStock: true,
    bgColor: "#d4c5a9",
    tags: ["Cotton", "Twill", "Garment"],
    description:
      "A premium cotton twill with excellent durability and a smooth finish. Perfect for trousers, jackets, and tailored garments that demand quality craftsmanship.",
    material: "100% Cotton",
    weight: "180 GSM",
    width: "58 inches",
    origin: "Sri Lanka",
    careInstructions: "Machine wash cold, tumble dry low",
  },
  {
    id: "fab_002",
    name: "Silk Satin Blend",
    type: "Silk",
    supplier: "Royal Fabrics Ltd.",
    supplierLocation: "Panadura, Colombo",
    rating: 4.9,
    reviewCount: 218,
    colors: [
      { hex: "#f5f5dc", name: "Champagne" },
      { hex: "#c084fc", name: "Lavender" },
      { hex: "#ec4899", name: "Rose" },
      { hex: "#60a5fa", name: "Sky" },
    ],
    price: 2300,
    minOrder: 30,
    location: "Panadura",
    badge: "popular",
    inStock: true,
    bgColor: "#e8d5c4",
    tags: ["Luxury", "Bridal", "Silk"],
    description:
      "Experience the natural elegance of raw silk, prized for its rich texture and subtle sheen. Ideal for premium garments that celebrate timeless craftsmanship — from bridal wear to evening gowns and luxury scarves.",
    material: "100% Raw Silk",
    weight: "120 GSM",
    width: "44 inches",
    origin: "Sri Lanka",
    careInstructions: "Dry clean recommended",
  },
  {
    id: "fab_003",
    name: "Linen Canvas",
    type: "Linen",
    supplier: "Natural Fibers",
    supplierLocation: "Pettah, Colombo",
    rating: 4.7,
    reviewCount: 98,
    colors: [{ hex: "#1e293b", name: "Charcoal" }, { hex: "#78716c", name: "Stone" }, { hex: "#d6d3d1", name: "Mist" }],
    price: 1200,
    minOrder: 40,
    location: "Pettah",
    badge: null,
    inStock: true,
    bgColor: "#c8bfa9",
    tags: ["Linen", "Natural", "Summer"],
    description:
      "A breathable, natural linen canvas with a crisp, textured finish. Great for summer clothing, home textiles, and sustainable fashion lines.",
    material: "100% Linen",
    weight: "210 GSM",
    width: "54 inches",
    origin: "Sri Lanka",
    careInstructions: "Machine wash warm, line dry",
  },
  {
    id: "fab_004",
    name: "Polyester Georgette",
    type: "Polyester",
    supplier: "Modern Textiles",
    supplierLocation: "Colombo 03",
    rating: 4.5,
    reviewCount: 77,
    colors: [
      { hex: "#c084fc", name: "Purple" },
      { hex: "#ec4899", name: "Pink" },
      { hex: "#f472b6", name: "Blush" },
      { hex: "#a78bfa", name: "Violet" },
    ],
    price: 650,
    minOrder: 80,
    location: "Colombo",
    badge: null,
    inStock: true,
    bgColor: "#d5c4d9",
    tags: ["Polyester", "Georgette", "Drape"],
    description:
      "Lightweight and flowy polyester georgette with excellent drape. A versatile choice for sarees, evening wear, and contemporary fashion.",
    material: "100% Polyester",
    weight: "75 GSM",
    width: "60 inches",
    origin: "Sri Lanka",
    careInstructions: "Hand wash cold, drip dry",
  },
  {
    id: "fab_005",
    name: "Denim Heavy Weight",
    type: "Denim",
    supplier: "Blue Star Fabrics",
    supplierLocation: "Pettah, Colombo",
    rating: 4.8,
    reviewCount: 163,
    colors: [{ hex: "#1e3a5f", name: "Dark Blue" }, { hex: "#2563eb", name: "Classic" }, { hex: "#3b82f6", name: "Light" }],
    price: 950,
    minOrder: 65,
    location: "Pettah",
    badge: null,
    inStock: true,
    bgColor: "#8ba4c4",
    tags: ["Denim", "Heavy", "Jeans"],
    description:
      "A sturdy, heavy-weight denim fabric for durable garments. Ideal for jeans, jackets, and workwear that need to stand the test of time.",
    material: "98% Cotton, 2% Elastane",
    weight: "340 GSM",
    width: "58 inches",
    origin: "Sri Lanka",
    careInstructions: "Machine wash cold, inside out",
  },
  {
    id: "fab_006",
    name: "Chiffon Deluxe",
    type: "Chiffon",
    supplier: "Elegant Fabrics",
    supplierLocation: "Panadura",
    rating: 4.6,
    reviewCount: 54,
    colors: [
      { hex: "#f9a8d4", name: "Petal" },
      { hex: "#c084fc", name: "Lilac" },
      { hex: "#f472b6", name: "Hot Pink" },
      { hex: "#fda4af", name: "Blush" },
    ],
    price: 1800,
    minOrder: 25,
    location: "Panadura",
    badge: "out-of-stock",
    inStock: false,
    bgColor: "#f0ccd4",
    tags: ["Chiffon", "Sheer", "Occasion"],
    description:
      "An ultra-light, sheer chiffon with a delicate hand feel. Perfect for evening gowns, veils, and layered occasion wear.",
    material: "100% Polyester Chiffon",
    weight: "55 GSM",
    width: "56 inches",
    origin: "Sri Lanka",
    careInstructions: "Dry clean only",
  },
  {
    id: "fab_007",
    name: "Wool Blend Suiting",
    type: "Wool",
    supplier: "Premium Cloths",
    supplierLocation: "Colombo 07",
    rating: 4.8,
    reviewCount: 89,
    colors: [{ hex: "#1e293b", name: "Charcoal" }, { hex: "#374151", name: "Slate" }, { hex: "#6b7280", name: "Grey" }],
    price: 1250,
    minOrder: 20,
    location: "Colombo",
    badge: null,
    inStock: true,
    bgColor: "#b8a99a",
    tags: ["Wool", "Suiting", "Formal"],
    description:
      "A fine wool-blend suiting fabric with a smooth surface and excellent structure. The go-to choice for formal suits, blazers, and professional attire.",
    material: "70% Wool, 30% Polyester",
    weight: "280 GSM",
    width: "60 inches",
    origin: "Sri Lanka",
    careInstructions: "Dry clean recommended",
  },
  {
    id: "fab_008",
    name: "Rayon Printed",
    type: "Rayon",
    supplier: "Color Works Textiles",
    supplierLocation: "Pettah, Colombo",
    rating: 4.4,
    reviewCount: 61,
    colors: [{ hex: "#c084fc", name: "Purple" }, { hex: "#a78bfa", name: "Violet" }, { hex: "#818cf8", name: "Indigo" }],
    price: 780,
    minOrder: 55,
    location: "Pettah",
    badge: null,
    inStock: true,
    bgColor: "#c7b8d4",
    tags: ["Rayon", "Printed", "Casual"],
    description:
      "Vibrant printed rayon with a soft drape and breathable feel. Ideal for casual dresses, skirts, and everyday fashion pieces.",
    material: "100% Viscose Rayon",
    weight: "110 GSM",
    width: "44 inches",
    origin: "Sri Lanka",
    careInstructions: "Hand wash cold, line dry",
  },
];

/* ─── Style tokens (light theme — matches shop page) ────────── */
const C = {
  bgPage: "#f3f4f6",
  bgCard: "#ffffff",
  bgCardAlt: "#f9fafb",
  border: "#e5e7eb",
  borderPurple: "rgba(124,58,237,0.35)",
  purple: "#7c3aed",
  purpleLight: "#6d28d9",
  purpleDark: "#5b21b6",
  purpleMuted: "rgba(124,58,237,0.08)",
  white: "#ffffff",
  text: "#111827",
  textMuted: "#6b7280",
  textFaint: "#9ca3af",
  yellow: "#f59e0b",
  green: "#059669",
  greenBg: "rgba(5,150,105,0.1)",
  greenBorder: "rgba(5,150,105,0.3)",
};

/* ─── Stars helper ─────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="16" height="16" viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? C.yellow : "#e5e7eb"}
          stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

/* ─── Main component ───────────────────────────────────────── */
export default function ProductDetail() {
  const { fabricId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fabric = FABRICS.find((f) => f.id === fabricId);

  const [selectedColor, setSelectedColor] = useState(fabric?.colors[0] ?? null);
  const [qty, setQty] = useState(fabric?.minOrder ?? 1);
  const [unit, setUnit] = useState("Meters");
  const [activeImg, setActiveImg] = useState(0);

  if (!fabric) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: C.bgPage, color: C.text, flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: "1.3rem", fontWeight: 700 }}>Fabric not found</p>
        <Link to="/shop" style={{ color: C.purple, textDecoration: "none" }}>← Back to Shop</Link>
      </div>
    );
  }

  const total = (fabric.price * qty).toLocaleString();

  function decreaseQty() { setQty((q) => Math.max(fabric.minOrder, q - 1)); }
  function increaseQty() { setQty((q) => q + 1); }

  function handleAddToCart() {
    addToCart({ id: fabric.id, name: fabric.name, unitPrice: fabric.price, quantity: qty });
  }

  /* ── Thumbnail placeholder images (colour blocks) ── */
  const thumbs = [fabric.bgColor, selectedColor?.hex ?? fabric.bgColor, "#2d1b69"];

  /* ======================================================== */
  return (
    <div className="pd-page" style={{ minHeight: "100vh", color: C.text, fontFamily: "inherit", paddingBottom: "3rem" }}>

      {/* ── Back breadcrumb ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.25rem 1.5rem 0" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            color: C.textMuted, fontSize: "0.85rem", padding: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.purple}
          onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Marketplace
        </button>
      </div>

      {/* ── Main content grid ── */}
      <div style={{
        maxWidth: 1100, margin: "1.5rem auto 4rem", padding: "0 1.5rem",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem",
        alignItems: "flex-start",
      }}
        className="pd-grid"
      >

        {/* ═══════════ LEFT — Image Gallery ═══════════ */}
        <div>
          {/* Main image */}
          <div style={{
            borderRadius: 16, overflow: "hidden", position: "relative",
            height: 360, background: thumbs[activeImg],
            border: `1px solid ${C.border}`,
          }}>
            {/* In-stock badge */}
            {fabric.inStock && (
              <span style={{
                position: "absolute", top: 14, left: 14,
                background: C.greenBg, border: `1px solid ${C.greenBorder}`,
                color: C.green, fontSize: "0.7rem", fontWeight: 700,
                padding: "4px 10px", borderRadius: 999,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>● IN STOCK</span>
            )}
            {/* Wishlist */}
            <button style={{
              position: "absolute", top: 14, right: 14,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              border: `1px solid ${C.border}`, cursor: "pointer", color: C.textMuted,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
            {/* Slide counter */}
            <span style={{
              position: "absolute", bottom: 14, right: 14, fontSize: "0.75rem",
              color: "#374151", background: "rgba(255,255,255,0.85)", padding: "3px 10px",
              borderRadius: 999,
            }}>{activeImg + 1} / {thumbs.length}</span>
          </div>

          {/* Thumbnails */}
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {thumbs.map((bg, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                style={{
                  flex: 1, height: 80, borderRadius: 10, background: bg,
                  border: i === activeImg ? `2px solid ${C.purple}` : `1px solid ${C.border}`,
                  cursor: "pointer", overflow: "hidden",
                  boxShadow: i === activeImg ? `0 0 0 3px rgba(124,58,237,0.25)` : "none",
                  transition: "border 0.2s",
                }}
              />
            ))}
          </div>

          {/* Trust badges */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16,
          }}>
            {[
              { icon: "🛡️", label: "Quality Assured", sub: "Lab tested" },
              { icon: "🚚", label: "Fast Delivery", sub: "Island-wide" },
              { icon: "↩️", label: "Easy Returns", sub: "7-day policy" },
            ].map((b) => (
              <div key={b.label} style={{
                background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "12px 8px", textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>{b.icon}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.text }}>{b.label}</div>
                <div style={{ fontSize: "0.65rem", color: C.textMuted }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════ RIGHT — Product Info ═══════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {fabric.tags.map((tag) => (
              <span key={tag} style={{
                padding: "4px 12px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600,
                background: C.purpleMuted, border: `1px solid ${C.borderPurple}`, color: C.purple,
              }}>{tag}</span>
            ))}
          </div>

          {/* Name */}
          <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800,
            letterSpacing: "-0.02em", color: C.text, lineHeight: 1.2 }}>
            {fabric.name}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Stars rating={fabric.rating} />
            <span style={{ fontWeight: 700, color: C.text, fontSize: "0.9rem" }}>{fabric.rating}</span>
            <span style={{ color: C.textMuted, fontSize: "0.85rem" }}>({fabric.reviewCount} reviews)</span>
          </div>

          {/* Price box */}
          <div style={{
            background: C.bgCardAlt, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          }}>
            <div>
              <div style={{ fontSize: "0.65rem", color: C.textFaint, textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: 4 }}>Price Per Meter</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: C.purple,
                letterSpacing: "-0.02em" }}>
                LKR {fabric.price.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.65rem", color: C.textFaint, textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: 4 }}>Min. Order</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: C.text }}>{fabric.minOrder} m</div>
            </div>
          </div>

          {/* Supplier */}
          <div style={{
            background: C.bgCardAlt, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "0.85rem 1.1rem", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", flexShrink: 0,
            }}>🏭</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.text, fontSize: "0.92rem" }}>{fabric.supplier}</div>
              <div style={{ fontSize: "0.75rem", color: C.textMuted, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {fabric.supplierLocation}
              </div>
            </div>
            <span style={{
              fontSize: "0.68rem", fontWeight: 700,
              background: C.greenBg, border: `1px solid ${C.greenBorder}`,
              color: C.green, padding: "3px 10px", borderRadius: 999,
            }}>★ Premium Partner</span>
            <button style={{
              padding: "6px 14px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600,
              background: C.purpleMuted, border: `1px solid ${C.borderPurple}`,
              color: C.purple, cursor: "pointer", whiteSpace: "nowrap",
            }}>View Store</button>
          </div>

          {/* Description */}
          <p style={{ margin: 0, fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.75 }}>
            {fabric.description}
          </p>

          {/* Colour selector */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: C.text }}>Select Colour</span>
              <span style={{ fontSize: "0.82rem", color: C.purple }}>{selectedColor?.name}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {fabric.colors.map((c) => (
                <button key={c.hex} onClick={() => setSelectedColor(c)}
                  title={c.name}
                  style={{
                    width: 30, height: 30, borderRadius: "50%", background: c.hex, border: "none",
                    cursor: "pointer", outline: selectedColor?.hex === c.hex
                      ? `3px solid ${C.purple}` : `2px solid ${C.border}`,
                    outlineOffset: 2, transition: "outline 0.15s, transform 0.15s",
                    transform: selectedColor?.hex === c.hex ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Spec grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Material", value: fabric.material },
              { label: "Weight", value: fabric.weight },
              { label: "Width", value: fabric.width },
              { label: "Origin", value: fabric.origin },
            ].map((s) => (
              <div key={s.label} style={{
                background: C.bgCardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px",
              }}>
                <div style={{ fontSize: "0.65rem", color: C.textFaint, textTransform: "uppercase",
                  letterSpacing: "0.07em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: C.text }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Quantity + Unit selector */}
          <div style={{
            background: C.bgCardAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem 1.1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              {/* Decrement */}
              <button onClick={decreaseQty} style={{
                width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                background: C.bgCard, color: C.text, cursor: "pointer",
                fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center",
              }}>−</button>
              <span style={{ minWidth: 40, textAlign: "center", fontSize: "1.1rem", fontWeight: 700, color: C.text }}>{qty}</span>
              <button onClick={increaseQty} style={{
                width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`,
                background: C.bgCard, color: C.text, cursor: "pointer",
                fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center",
              }}>+</button>

              {/* Unit toggle */}
              {["Meters", "Yards"].map((u) => (
                <button key={u} onClick={() => setUnit(u)} style={{
                  padding: "6px 18px", borderRadius: 8, border: `1px solid ${C.border}`,
                  background: unit === u ? `linear-gradient(135deg,${C.purple},${C.purpleDark})` : C.bgCard,
                  color: unit === u ? "#fff" : C.textMuted, cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                  transition: "background 0.2s",
                }}>{u}</button>
              ))}

              {/* Total */}
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: "0.65rem", color: C.textFaint, textTransform: "uppercase",
                  letterSpacing: "0.07em" }}>Total</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: C.purple }}>
                  LKR {total}
                </div>
              </div>
            </div>
            <div style={{ fontSize: "0.72rem", color: C.textFaint }}>
              Min. order: {fabric.minOrder} meters · Price is per meter
            </div>
          </div>

          {/* CTA buttons */}
          <button
            disabled={!fabric.inStock}
            onClick={handleAddToCart}
            style={{
              width: "100%", padding: "1rem", borderRadius: 12,
              background: fabric.inStock
                ? `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`
                : "#d1d5db",
              color: C.white, border: "none", cursor: fabric.inStock ? "pointer" : "not-allowed",
              fontWeight: 700, fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: fabric.inStock ? "0 4px 24px rgba(124,58,237,0.4)" : "none",
              transition: "opacity 0.2s, transform 0.15s",
            }}
            onMouseEnter={e => { if (fabric.inStock) e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {fabric.inStock ? `Add to Cart · LKR ${total}` : "Out of Stock"}
          </button>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={{
              width: 46, height: 46, borderRadius: 10,
              background: C.bgCard, border: `1px solid ${C.border}`,
              color: C.textMuted, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          {/* Care instructions */}
          <div style={{
            background: C.bgCardAlt, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" />
              <path d="M12 8v4l3 3" />
            </svg>
            <div>
              <div style={{ fontSize: "0.65rem", color: C.textFaint, textTransform: "uppercase",
                letterSpacing: "0.07em" }}>Care Instructions</div>
              <div style={{ fontSize: "0.82rem", color: C.text, marginTop: 2 }}>{fabric.careInstructions}</div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Responsive style ── */}
      <style>{`
        .pd-page {
          background: #f3f4f6;
        }
        @media (max-width: 768px) {
          .pd-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
