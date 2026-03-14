import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getFabric, listFabrics } from "../api";
import ReviewSection from "../components/common/ReviewSection";

/* ─── Style tokens ─────────────────────────────────────────── */
const C = {
  bgPage: "var(--clr-bg)",
  bgCard: "var(--clr-surface)",
  bgCardAlt: "var(--clr-surface-2)",
  border: "var(--clr-border-2)",
  borderPurple: "rgba(37, 99, 235, 0.2)",
  purple: "var(--clr-primary)",
  purpleLight: "var(--clr-primary-2)",
  purpleDark: "#1e40af",
  purpleMuted: "var(--clr-glow)",
  white: "#ffffff",
  text: "var(--clr-text)",
  textMuted: "var(--clr-text-2)",
  textFaint: "var(--clr-muted)",
  yellow: "#f59e0b",
  green: "#10b981",
  greenBg: "rgba(16, 185, 129, 0.1)",
  greenBorder: "rgba(16, 185, 129, 0.2)",
};

const BG_COLORS = [
  "#d4c5a9", "#e8d5c4", "#c8bfa9", "#d5c4d9",
  "#8ba4c4", "#f0ccd4", "#b8a99a", "#c7b8d4",
];

/* ─── Stars helper ─────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="16" height="16" viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? C.yellow : "#e5e7eb"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

/* ─── Loading Skeleton ─────────────────────────────────────── */
function ProductSkeleton() {
  return (
    <div style={{
      maxWidth: 1100, margin: "1.5rem auto", padding: "0 1.5rem",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem"
    }}>
      <div style={{ borderRadius: 16, height: 480, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[80, 200, 60, 120, 80, 60].map((h, i) => (
          <div key={i} style={{ height: h, borderRadius: 12, background: "#f1f5f9", animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────── */
export default function ProductDetail() {
  const { fabricId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // ── ALL useState calls must be here at the top ──
  const [fabric, setFabric] = useState(null);
  const [relatedFabrics, setRelatedFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [qty, setQty] = useState(1); // ← MOVED HERE from inside functions

  // ── Fetch fabric from FastAPI ──
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getFabric(fabricId);
        const data = res.data;
        setFabric({
          ...data,
          inStock: data.stock > 0,
          bgColor: data.bgColor || BG_COLORS[0],
          colors: data.colors || [{ hex: "#1e293b", name: data.color || "Default" }],
          tags: data.tags || [data.type, "Fabric"].filter(Boolean),
          rating: data.rating || 4.5,
          reviewCount: data.reviewCount || 0,
          minOrder: data.minOrder || data.min_order || 10,
          supplier: data.supplier || "ClothStreet Supplier",
          supplierId: data.supplier_id || data.sellerId || "default",
          supplierLocation: data.supplierLocation || "Sri Lanka",
          description: data.description || `Premium ${data.type} fabric available at ClothStreet.`,
          material: data.material || data.type,
          weight: data.weight || "N/A",
          width: data.width || "N/A",
          origin: data.origin || "Sri Lanka",
          careInstructions: data.careInstructions || "Follow standard care instructions",
        });

        const relRes = await listFabrics();
        const related = (relRes.data || [])
          .filter((f) => f.id !== fabricId)
          .slice(0, 4)
          .map((f, idx) => ({
            ...f,
            inStock: f.stock > 0,
            bgColor: f.bgColor || BG_COLORS[idx % BG_COLORS.length],
            rating: f.rating || 4.5,
          }));
        setRelatedFabrics(related);
      } catch (err) {
        console.error("Failed to fetch fabric:", err);
        setError("Fabric not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    if (fabricId) fetchData();
  }, [fabricId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Product link copied to clipboard!");
    });
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ display: "block", backgroundPosition: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => setZoomStyle({ display: "none" });

  // ── qty is now available here from useState at top ──
  function handleAddToCart() {
    addToCart({ id: fabric.id, name: fabric.name, unitPrice: fabric.price, quantity: qty });
  }

  // ── Loading state ──
  if (loading) return <ProductSkeleton />;

  // ── Error / not found ──
  if (error || !fabric) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: C.bgPage, color: C.text,
        flexDirection: "column", gap: 16
      }}>
        <p style={{ fontSize: "1.3rem", fontWeight: 700 }}>
          {error || "Fabric not found"}
        </p>
        <Link to="/shop" style={{ color: C.purple, textDecoration: "none" }}>
          ← Back to Shop
        </Link>
      </div>
    );
  }

  // ── total uses qty from useState at top ──
  const total = (fabric.price * qty).toLocaleString();

  const thumbColors = [
    fabric.bgColor,
    fabric.colors?.[0]?.hex || fabric.bgColor,
    "#2d1b69",
  ];

  const mainImageSrc = fabric.image_url || null;

  return (
    <div className="pd-page" style={{
      minHeight: "100vh", color: C.text,
      fontFamily: "inherit", paddingBottom: "3rem"
    }}>

      {/* ── Back breadcrumb ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.25rem 1.5rem 0" }}>
        <button onClick={() => navigate(-1)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            color: C.textMuted, fontSize: "0.85rem", padding: 0, transition: "color 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.purple}
          onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Marketplace
        </button>
      </div>

      {/* ── Main content grid ── */}
      <div style={{
        maxWidth: 1100, margin: "1.5rem auto 4rem", padding: "0 1.5rem",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem",
        alignItems: "flex-start"
      }} className="pd-grid">

        {/* ═══════════ LEFT — Image Gallery ═══════════ */}
        <div style={{ position: "sticky", top: "2rem" }}>
          <div style={{ display: "flex", gap: 16 }}>
            {/* Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 80 }}>
              {thumbColors.map((bg, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  style={{
                    width: "100%", height: 80, borderRadius: 10,
                    background: mainImageSrc && i === 0 ? `url(${mainImageSrc}) center/cover` : bg,
                    border: i === activeImg ? `2px solid ${C.purple}` : `1px solid ${C.border}`,
                    cursor: "pointer", overflow: "hidden",
                    boxShadow: i === activeImg ? `0 0 0 3px rgba(124,58,237,0.15)` : "none",
                    transition: "border 0.2s, transform 0.2s",
                    transform: i === activeImg ? "scale(1.02)" : "scale(1)"
                  }} />
              ))}
            </div>

            {/* Main image */}
            <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
              style={{
                flex: 1, borderRadius: 16, overflow: "hidden", position: "relative",
                height: 480, background: mainImageSrc ? `url(${mainImageSrc}) center/cover` : thumbColors[activeImg],
                border: `1px solid ${C.border}`, cursor: "crosshair"
              }}>

              {/* Zoom overlay */}
              <div style={{
                ...zoomStyle, position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: mainImageSrc ? `url(${mainImageSrc})` : `none`,
                backgroundColor: thumbColors[activeImg],
                backgroundSize: "200%", zIndex: 10
              }} />

              {/* In-stock badge */}
              {fabric.inStock && (
                <span style={{
                  position: "absolute", top: 14, left: 14, zIndex: 20,
                  background: C.greenBg, border: `1px solid ${C.greenBorder}`,
                  color: C.green, fontSize: "0.7rem", fontWeight: 700,
                  padding: "4px 10px", borderRadius: 999,
                  textTransform: "uppercase", letterSpacing: "0.06em"
                }}>
                  ● IN STOCK
                </span>
              )}
              {!fabric.inStock && (
                <span style={{
                  position: "absolute", top: 14, left: 14, zIndex: 20,
                  background: "#fef2f2", border: "1px solid #fecaca",
                  color: "#dc2626", fontSize: "0.7rem", fontWeight: 700,
                  padding: "4px 10px", borderRadius: 999,
                  textTransform: "uppercase", letterSpacing: "0.06em"
                }}>
                  ● OUT OF STOCK
                </span>
              )}

              {/* Wishlist */}
              <button style={{
                position: "absolute", top: 14, right: 14, zIndex: 20,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.9)", border: `1px solid ${C.border}`,
                cursor: "pointer", color: C.textMuted, display: "flex",
                alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)", transition: "color 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 24 }}>
            {[
              { icon: "🛡️", label: "Quality Assured", sub: "Lab tested" },
              { icon: "🚚", label: "Fast Delivery", sub: "Island-wide" },
              { icon: "↩️", label: "Easy Returns", sub: "7-day policy" },
            ].map((b) => (
              <div key={b.label} style={{
                background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "16px 8px", textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.02)"
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
                padding: "4px 12px", borderRadius: 999,
                fontSize: "0.72rem", fontWeight: 600,
                background: C.purpleMuted, border: `1px solid ${C.borderPurple}`,
                color: C.purple
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
            <span style={{ fontWeight: 700, color: C.text, fontSize: "0.9rem" }}>
              {fabric.rating?.toFixed(1)}
            </span>
            <span style={{ color: C.textMuted, fontSize: "0.85rem" }}>
              ({fabric.reviewCount} reviews)
            </span>
          </div>

          {/* Price box */}
          <div style={{
            background: C.bgCardAlt, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "1rem 1.25rem",
            display: "flex", justifyContent: "space-between", alignItems: "flex-end"
          }}>
            <div>
              <div style={{
                fontSize: "0.65rem", color: C.textFaint,
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4
              }}>
                Price Per Meter
              </div>
              <div style={{
                fontSize: "1.8rem", fontWeight: 800, color: C.purple,
                letterSpacing: "-0.02em"
              }}>
                LKR {fabric.price?.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "0.65rem", color: C.textFaint,
                textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4
              }}>
                Stock Available
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: C.text }}>
                {fabric.stock} m
              </div>
            </div>
          </div>

          {/* Quantity selector */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: C.bgCardAlt, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "0.85rem 1.1rem"
          }}>
            <span style={{ fontSize: "0.75rem", color: C.textFaint, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quantity (meters)
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: `1px solid ${C.border}`, background: C.bgCard,
                  cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: C.text
                }}>−</button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: `1px solid ${C.border}`, background: C.bgCard,
                  cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: C.text
                }}>+</button>
            </div>
          </div>

          {/* Color */}
          {fabric.color && (
            <div style={{
              background: C.bgCardAlt, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "0.85rem 1.1rem"
            }}>
              <div style={{
                fontSize: "0.75rem", color: C.textFaint, marginBottom: 6,
                textTransform: "uppercase", letterSpacing: "0.05em"
              }}>Color</div>
              <div style={{ fontWeight: 600, color: C.text }}>{fabric.color}</div>
              {fabric.colors && fabric.colors.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {fabric.colors.map((c, i) => (
                    <span key={i} style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: c.hex || c, border: `1px solid ${C.border}`,
                      display: "inline-block"
                    }} title={c.name || c} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Supplier */}
          <div style={{
            background: C.bgCardAlt, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "0.85rem 1.1rem",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", flexShrink: 0
            }}>🏭</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.text, fontSize: "0.92rem" }}>
                {fabric.supplier}
              </div>
              <div style={{
                fontSize: "0.75rem", color: C.textMuted,
                display: "flex", alignItems: "center", gap: 4, marginTop: 2
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {fabric.supplierLocation}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              <span style={{
                fontSize: "0.68rem", fontWeight: 700,
                background: C.greenBg, border: `1px solid ${C.greenBorder}`,
                color: C.green, padding: "3px 10px", borderRadius: 999
              }}>
                ★ Verified Supplier
              </span>
              <button 
                onClick={() => navigate(`/store/${fabric.supplierId}`)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: C.purpleMuted, 
                  border: `1px solid ${C.borderPurple}`,
                  color: C.purple,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}>
                View Store
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button disabled={!fabric.inStock} onClick={handleAddToCart}
              style={{
                flex: 1, padding: "1rem", borderRadius: 12,
                background: fabric.inStock
                  ? `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`
                  : "#d1d5db",
                color: C.white, border: "none",
                cursor: fabric.inStock ? "pointer" : "not-allowed",
                fontWeight: 700, fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: fabric.inStock ? "0 4px 24px rgba(124,58,237,0.4)" : "none",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={e => { if (fabric.inStock) e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {fabric.inStock ? `Add to Cart · LKR ${total}` : "Out of Stock"}
            </button>
            <button onClick={handleShare}
              style={{
                width: 56, height: 56, borderRadius: 12, background: C.bgCard,
                border: `1px solid ${C.border}`, color: C.textMuted, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "color 0.2s, border 0.2s"
              }}
              title="Share Product"
              onMouseEnter={e => { e.currentTarget.style.color = C.purple; e.currentTarget.style.borderColor = C.purpleMuted; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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
                { id: "reviews", label: "Reviews" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "0 0 12px 0", background: "none", border: "none",
                    fontWeight: activeTab === tab.id ? 700 : 600, fontSize: "0.9rem",
                    cursor: "pointer",
                    color: activeTab === tab.id ? C.purpleDark : C.textMuted,
                    borderBottom: activeTab === tab.id ? `3px solid ${C.purple}` : "3px solid transparent",
                    transition: "all 0.2s"
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ minHeight: 200 }}>

              {/* Description Tab */}
              {activeTab === "description" && (
                <div>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: C.text, lineHeight: 1.7 }}>
                    {fabric.description}
                  </p>
                  <ul style={{ marginTop: 16, paddingLeft: 20, color: C.textMuted, fontSize: "0.9rem", lineHeight: 1.8 }}>
                    <li>Premium quality {fabric.type?.toLowerCase()} from Sri Lanka</li>
                    <li>Ideal for high-end tailoring and boutique collections</li>
                    <li>Sustainably sourced and tested for durability</li>
                  </ul>
                </div>
              )}

              {/* Specs Tab */}
              {activeTab === "specs" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Material", value: fabric.material || fabric.type },
                    { label: "Fabric Weight", value: fabric.weight || "N/A" },
                    { label: "Roll Width", value: fabric.width || "N/A" },
                    { label: "Color", value: fabric.color || "Various" },
                    { label: "Care Instructions", value: fabric.careInstructions || "Standard care" },
                    { label: "Stock Available", value: `${fabric.stock} Meters` },
                  ].map((s) => (
                    <div key={s.label} style={{
                      background: C.bgCardAlt,
                      border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px"
                    }}>
                      <div style={{
                        fontSize: "0.7rem", color: C.textFaint,
                        textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6
                      }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 600, color: C.text }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <ReviewSection targetType="product" targetId={fabricId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedFabrics.length > 0 && (
        <div style={{ maxWidth: 1100, margin: "0 auto 4rem", padding: "0 1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: 24 }}>
            You May Also Like
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {relatedFabrics.map((rel, idx) => (
              <Link key={rel.id} to={`/shop/${rel.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  background: C.bgCard, borderRadius: 12,
                  border: `1px solid ${C.border}`, overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{
                    height: 160,
                    background: rel.image_url ? `url(${rel.image_url}) center/cover` : BG_COLORS[idx % BG_COLORS.length],
                    position: "relative"
                  }}>
                    {rel.inStock && (
                      <span style={{
                        position: "absolute", top: 10, left: 10,
                        background: C.greenBg, border: `1px solid ${C.greenBorder}`,
                        color: C.green, fontSize: "0.6rem", fontWeight: 700,
                        padding: "2px 8px", borderRadius: 999
                      }}>IN STOCK</span>
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{
                      fontSize: "0.7rem", color: C.purple, fontWeight: 700,
                      marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase"
                    }}>
                      {rel.type}
                    </div>
                    <div style={{
                      fontWeight: 700, fontSize: "0.95rem", color: C.text,
                      marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>
                      {rel.name}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 800, color: C.text, fontSize: "1.1rem" }}>
                        LKR {rel.price?.toLocaleString()}
                      </div>
                      <Stars rating={rel.rating} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .pd-page { background: var(--clr-bg); }
        @media (max-width: 768px) { .pd-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
