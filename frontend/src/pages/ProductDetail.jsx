import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

/* ─── Shared fabric data (export removed — moved to separate file) ─── */
const FABRICS = [
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

  // FIX 2 & 3: Removed unused selectedColor/setSelectedColor and unit/setUnit states
  const [qty] = useState(fabric?.minOrder ?? 1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  // Reviews state
  const [reviewsList, setReviewsList] = useState([
    { id: 1, name: "Ayesh Perera", initial: "A", rating: 5, date: "2 days ago", title: "Excellent quality fabric", text: "The drape on this material is phenomenal. Ordered 50 meters for a boutique collection and my clients absolutely love the feel. Will definitely reorder from this supplier.", bg: C.purpleMuted, color: C.purpleDark, border: false },
    { id: 2, name: "Samadhi W.", initial: "S", rating: 4, date: "1 week ago", title: "Very good, colour slightly darker", text: `Great texture. The color is slightly darker in person than on my screen, but still beautiful. Delivery was very fast.`, bg: C.bgCardAlt, color: C.text, border: true }
  ]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, title: "", text: "" });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Product link copied to clipboard!");
    });
  };

  // Zoom state
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  if (!fabric) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: C.bgPage, color: C.text, flexDirection: "column", gap: 16
      }}>
        <p style={{ fontSize: "1.3rem", fontWeight: 700 }}>Fabric not found</p>
        <Link to="/shop" style={{ color: C.purple, textDecoration: "none" }}>← Back to Shop</Link>
      </div>
    );
  }

  const total = (fabric.price * qty).toLocaleString();

  // FIX 4: Removed unused decreaseQty and increaseQty functions
  // qty is now controlled directly via the input onChange below

  function handleAddToCart() {
    addToCart({ id: fabric.id, name: fabric.name, unitPrice: fabric.price, quantity: qty });
  }

  /* ── Thumbnail placeholder images (colour blocks) ── */
  const thumbs = [fabric.bgColor, fabric.colors[0]?.hex ?? fabric.bgColor, "#2d1b69"];

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
        <div style={{ position: "sticky", top: "2rem" }}>

          <div style={{ display: "flex", gap: 16 }}>
            {/* Thumbnails (Vertical) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 80 }}>
              {thumbs.map((bg, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  style={{
                    width: "100%", height: 80, borderRadius: 10, background: bg,
                    border: i === activeImg ? `2px solid ${C.purple}` : `1px solid ${C.border}`,
                    cursor: "pointer", overflow: "hidden",
                    boxShadow: i === activeImg ? `0 0 0 3px rgba(124,58,237,0.15)` : "none",
                    transition: "border 0.2s, transform 0.2s",
                    transform: i === activeImg ? "scale(1.02)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            {/* Main image */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                flex: 1, borderRadius: 16, overflow: "hidden", position: "relative",
                height: 480, background: thumbs[activeImg],
                border: `1px solid ${C.border}`, cursor: "crosshair",
              }}
            >
              {/* Zoom overlay */}
              <div style={{
                ...zoomStyle,
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `url(${thumbs[activeImg]})`,
                backgroundColor: thumbs[activeImg],
                backgroundSize: "200%",
                zIndex: 10,
              }} />

              {/* In-stock badge */}
              {fabric.inStock && (
                <span style={{
                  position: "absolute", top: 14, left: 14, zIndex: 20,
                  background: C.greenBg, border: `1px solid ${C.greenBorder}`,
                  color: C.green, fontSize: "0.7rem", fontWeight: 700,
                  padding: "4px 10px", borderRadius: 999,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}>● IN STOCK</span>
              )}
              {/* Wishlist */}
              <button style={{
                position: "absolute", top: 14, right: 14, zIndex: 20,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                border: `1px solid ${C.border}`, cursor: "pointer", color: C.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)", transition: "color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 24,
          }}>
            {[
              { icon: "🛡️", label: "Quality Assured", sub: "Lab tested" },
              { icon: "🚚", label: "Fast Delivery", sub: "Island-wide" },
              { icon: "↩️", label: "Easy Returns", sub: "7-day policy" },
            ].map((b) => (
              <div key={b.label} style={{
                background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "16px 8px", textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
              }}>
                <div style={{ fontSize: "1.2rem", marginBottom: 6 }}>{b.icon}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: C.text }}>{b.label}</div>
                <div style={{ fontSize: "0.65rem", color: C.textMuted, marginTop: 2 }}>{b.sub}</div>
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
          <h1 style={{
            margin: 0, fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800,
            letterSpacing: "-0.02em", color: C.text, lineHeight: 1.2
          }}>
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
              <div style={{
                fontSize: "0.65rem", color: C.textFaint, textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: 4
              }}>Price Per Meter</div>
              <div style={{
                fontSize: "1.8rem", fontWeight: 800, color: C.purple,
                letterSpacing: "-0.02em"
              }}>
                LKR {fabric.price.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "0.65rem", color: C.textFaint, textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: 4
              }}>Min. Order</div>
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
            <button 
              onClick={() => navigate(`/store/${encodeURIComponent(fabric.supplier)}`)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600,
                background: C.purpleMuted, border: `1px solid ${C.borderPurple}`,
                color: C.purple, cursor: "pointer", whiteSpace: "nowrap",
              }}>View Store</button>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              disabled={!fabric.inStock}
              onClick={handleAddToCart}
              style={{
                flex: 1, padding: "1rem", borderRadius: 12,
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
            <button onClick={handleShare} style={{
              width: 56, height: 56, borderRadius: 12,
              background: C.bgCard, border: `1px solid ${C.border}`,
              color: C.textMuted, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "color 0.2s, border 0.2s",
            }}
              title="Share Product"
              onMouseEnter={e => { e.currentTarget.style.color = C.purple; e.currentTarget.style.borderColor = C.purpleMuted; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          <hr style={{ border: 0, height: 1, background: C.border, margin: "1rem 0" }} />

          {/* ─── TABS ─── */}
          <div>
            <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
              {[
                { id: "description", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "reviews", label: `Reviews (${fabric.reviewCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "0 0 12px 0", background: "none", border: "none",
                    fontWeight: activeTab === tab.id ? 700 : 600,
                    fontSize: "0.9rem", cursor: "pointer",
                    color: activeTab === tab.id ? C.purpleDark : C.textMuted,
                    borderBottom: activeTab === tab.id ? `3px solid ${C.purple}` : "3px solid transparent",
                    transition: "all 0.2s",
                  }}
                >{tab.label}</button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div style={{ minHeight: 200 }}>

              {/* Description Tab */}
              {activeTab === "description" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: C.text, lineHeight: 1.7 }}>{fabric.description}</p>
                  <ul style={{ marginTop: 16, paddingLeft: 20, color: C.textMuted, fontSize: "0.9rem", lineHeight: 1.8 }}>
                    <li>Premium quality {fabric.type.toLowerCase()} directly from {fabric.supplierLocation}</li>
                    <li>Ideal for high-end tailoring and boutique collections</li>
                    <li>Sustainably sourced and rigorously tested for durability</li>
                  </ul>
                </div>
              )}

              {/* Specs Tab */}
              {activeTab === "specs" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Material Composition", value: fabric.material },
                      { label: "Fabric Weight", value: fabric.weight },
                      { label: "Roll Width", value: fabric.width },
                      { label: "Country of Origin", value: fabric.origin },
                      { label: "Care Instructions", value: fabric.careInstructions },
                      { label: "Minimum Order", value: `${fabric.minOrder} Meters` },
                    ].map((s) => (
                      <div key={s.label} style={{
                        background: C.bgCardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px",
                      }}>
                        <div style={{
                          fontSize: "0.7rem", color: C.textFaint, textTransform: "uppercase",
                          letterSpacing: "0.05em", marginBottom: 6
                        }}>{s.label}</div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: C.text }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div style={{ animation: "fadeIn 0.3s ease", display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* Reviews Summary */}
                  <div style={{ display: "flex", gap: 32, alignItems: "center", background: C.bgCardAlt, padding: 24, borderRadius: 16, border: `1px solid ${C.border}` }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "3rem", fontWeight: 800, color: C.text, lineHeight: 1 }}>{fabric.rating}</div>
                      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}><Stars rating={fabric.rating} /></div>
                      <div style={{ fontSize: "0.8rem", color: C.textMuted }}>Based on {fabric.reviewCount} reviews</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      {[5, 4, 3, 2, 1].map(star => {
                        const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2;
                        return (
                          <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.8rem", color: C.textMuted }}>
                            <span style={{ width: 12 }}>{star}</span>
                            <span style={{ color: C.yellow }}>★</span>
                            <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: C.yellow, borderRadius: 3 }} />
                            </div>
                            <span style={{ width: 24, textAlign: "right" }}>{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                    <div>
                      <button onClick={() => setShowReviewForm(!showReviewForm)} style={{
                        padding: "10px 20px", borderRadius: 8, background: C.text, color: C.white,
                        border: "none", fontWeight: 600, cursor: "pointer"
                      }}>
                        {showReviewForm ? "Cancel Review" : "Write a Review"}
                      </button>
                    </div>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <div style={{ background: C.bgCardAlt, padding: 24, borderRadius: 16, border: `1px solid ${C.border}`, animation: "fadeIn 0.3s ease" }}>
                      <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>Write your review</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: 6 }}>Your Name</label>
                            <input
                              type="text"
                              value={reviewForm.name}
                              onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                              placeholder="John Doe"
                              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: 6 }}>Rating</label>
                            <select
                              value={reviewForm.rating}
                              onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: "0.9rem", outline: "none", background: C.bgCard, boxSizing: "border-box" }}
                            >
                              <option value="5">5 Stars - Excellent</option>
                              <option value="4">4 Stars - Very Good</option>
                              <option value="3">3 Stars - Average</option>
                              <option value="2">2 Stars - Poor</option>
                              <option value="1">1 Star - Terrible</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: 6 }}>Review Title</label>
                          <input
                            type="text"
                            value={reviewForm.title}
                            onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                            placeholder="Summary of your experience"
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: 6 }}>Review Content</label>
                          <textarea
                            value={reviewForm.text}
                            onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                            placeholder="What did you like or dislike?"
                            rows="4"
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: "0.9rem", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                          />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => {
                              if (!reviewForm.name || !reviewForm.text) { alert("Please fill in your name and review content."); return; }
                              const newReview = {
                                id: Date.now(),
                                name: reviewForm.name,
                                initial: reviewForm.name.charAt(0).toUpperCase(),
                                rating: reviewForm.rating,
                                date: "Just now",
                                title: reviewForm.title || "User Review",
                                text: reviewForm.text,
                                bg: C.purpleMuted, color: C.purpleDark, border: false
                              };
                              setReviewsList([newReview, ...reviewsList]);
                              setReviewForm({ name: "", rating: 5, title: "", text: "" });
                              setShowReviewForm(false);
                            }}
                            style={{
                              padding: "10px 24px", borderRadius: 8, background: C.purple, color: C.white,
                              border: "none", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(124,58,237,0.3)"
                            }}>Submit Review</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sample Reviews */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <h3 style={{ fontSize: "1.1rem", margin: "0 0 8px" }}>Recent Customer Reviews</h3>
                    {reviewsList.map(review => (
                      <div key={review.id} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: review.bg, border: review.border ? `1px solid ${C.border}` : 'none', color: review.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{review.initial}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{review.name}</div>
                              <div style={{ fontSize: "0.75rem", color: C.green }}>✓ Verified Buyer</div>
                            </div>
                          </div>
                          <span style={{ fontSize: "0.8rem", color: C.textFaint }}>{review.date}</span>
                        </div>
                        <Stars rating={review.rating} />
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: 8 }}>{review.title}</div>
                        <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.6 }}>{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto 4rem", padding: "0 1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: 24 }}>You May Also Like</h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20,
        }}>
          {FABRICS.filter(f => f.id !== fabric.id).slice(0, 4).map(rel => (
            <Link key={rel.id} to={`/shop/${rel.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`,
                overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ height: 160, background: rel.bgColor, position: "relative" }}>
                  {rel.inStock && (
                    <span style={{
                      position: "absolute", top: 10, left: 10, background: C.greenBg, border: `1px solid ${C.greenBorder}`,
                      color: C.green, fontSize: "0.6rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                    }}>IN STOCK</span>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: "0.7rem", color: C.purple, fontWeight: 700, marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{rel.type}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: C.text, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rel.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 800, color: C.text, fontSize: "1.1rem" }}>LKR {rel.price}</div>
                    <div style={{ display: "flex", gap: 2 }}><Stars rating={rel.rating} /></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
