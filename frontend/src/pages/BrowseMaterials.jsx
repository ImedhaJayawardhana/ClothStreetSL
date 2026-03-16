import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { listFabrics } from "../api";
import heroImg from "../assets/textile-hero-bg.png";
import "./BrowseMaterials.css";

const FABRIC_TYPES = [
    "Cotton",
    "Silk",
    "Linen",
    "Polyester",
    "Denim",
    "Chiffon",
    "Wool",
    "Rayon",
];

const LOCATIONS = [
    "Pettah",
    "Panadura",
    "Colombo",
    "Kandy",
    "Galle",
    "Negombo",
];

// Fallback background colors for fabrics without images
const BG_COLORS = [
    "#d4c5a9", "#e8d5c4", "#c8bfa9", "#d5c4d9",
    "#8ba4c4", "#f0ccd4", "#b8a99a", "#c7b8d4",
];

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function FabricCardSkeleton() {
    return (
        <div className="bm-card" style={{ pointerEvents: "none" }}>
            <div className="bm-card-image-wrap">
                <div className="bm-card-image-placeholder"
                    style={{ background: "#e2e8f0", animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
            <div className="bm-card-body" style={{ gap: "8px" }}>
                <div style={{ height: 12, background: "#e2e8f0", borderRadius: 6, width: "40%" }} />
                <div style={{ height: 16, background: "#e2e8f0", borderRadius: 6, width: "80%" }} />
                <div style={{ height: 12, background: "#e2e8f0", borderRadius: 6, width: "60%" }} />
                <div style={{ height: 36, background: "#e2e8f0", borderRadius: 8, marginTop: 8 }} />
            </div>
        </div>
    );
}

/* ─── Component ───────────────────────────────────────────── */
export default function BrowseMaterials() {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // ── Real data state ──
    const [fabrics, setFabrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search
    const [searchQuery, setSearchQuery] = useState("");

    // Filters
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [maxMinOrder, setMaxMinOrder] = useState(100);

    // Mobile sidebar toggle
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ── Fetch fabrics from FastAPI ──
    useEffect(() => {
        const fetchFabrics = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await listFabrics();
                const data = (res.data || []).filter((f) => !f.hidden);
                // Assign fallback bg colors if no image
                const enriched = data.map((fab, idx) => ({
                    ...fab,
                    bgColor: fab.bgColor || BG_COLORS[idx % BG_COLORS.length],
                    inStock: fab.stock > 0,
                    // Normalize location — use supplier_id location or fallback
                    location: fab.location || "Colombo",
                    // Normalize colors array
                    colors: fab.colors || ["#1e293b"],
                    // Normalize rating
                    rating: fab.rating || 4.5,
                    // Normalize minOrder
                    minOrder: fab.minOrder || fab.min_order || 10,
                }));
                setFabrics(enriched);
            } catch (err) {
                console.error("Failed to fetch fabrics:", err);
                setError("Failed to load fabrics. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchFabrics();
    }, []);

    /* ── Toggle helpers ── */
    function toggleType(type) {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    }

    function toggleLocation(loc) {
        setSelectedLocations((prev) =>
            prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
        );
    }

    /* ── Filtered fabrics ── */
    const filteredFabrics = useMemo(() => {
        return fabrics.filter((fab) => {
            // Search
            if (
                searchQuery &&
                !fab.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !fab.supplier_id?.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !fab.type?.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                return false;
            }
            // Fabric type
            if (selectedTypes.length > 0 && !selectedTypes.includes(fab.type)) {
                return false;
            }
            // Location
            if (
                selectedLocations.length > 0 &&
                !selectedLocations.includes(fab.location)
            ) {
                return false;
            }
            // Price
            if (fab.price > maxPrice) return false;
            // Min order
            if (fab.minOrder > maxMinOrder) return false;

            return true;
        });
    }, [fabrics, searchQuery, selectedTypes, selectedLocations, maxPrice, maxMinOrder]);

    /* ── Add to cart handler ── */
    function handleAddToCart(fab) {
        addToCart({
            id: fab.id,
            name: fab.name,
            unitPrice: fab.price,
            quantity: 1,
        });
    }

    return (
        <div>
            {/* ============ Hero Header ============ */}
            <section className="bm-hero">
                <img src={heroImg} className="bm-hero-bg" alt="Fabric Shop Background" />
                <div className="bm-hero-overlay"></div>
                <div className="bm-hero-inner">
                    <div className="bm-breadcrumb">
                        <Link to="/">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                        <span>Fabric Marketplace</span>
                    </div>
                    <h1 className="bm-hero-title">Browse Premium Fabrics</h1>
                    <p className="bm-hero-subtitle">
                        {loading
                            ? "Loading fabrics..."
                            : `${fabrics.length}+ verified fabric suppliers across Sri Lanka`}
                    </p>
                </div>
            </section>

            {/* ============ Search Bar ============ */}
            <div className="bm-search-wrap">
                <div className="bm-search-bar">
                    <svg className="bm-search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for fabrics, suppliers, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        id="bm-search-input"
                    />
                    <button
                        className="bm-filter-btn"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        id="bm-filter-toggle"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" />
                            <line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" />
                            <line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" />
                            <line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" />
                            <line x1="18" x2="22" y1="16" y2="16" />
                        </svg>
                        Filters
                    </button>
                </div>
            </div>

            {/* ============ Error Banner ============ */}
            {error && (
                <div style={{
                    maxWidth: 900, margin: "1rem auto", padding: "12px 16px",
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: 12, color: "#dc2626", fontSize: 14,
                    display: "flex", alignItems: "center", gap: 8,
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginLeft: "auto", fontSize: 12, color: "#dc2626",
                            background: "none", border: "1px solid #fecaca",
                            borderRadius: 6, padding: "4px 10px", cursor: "pointer"
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* ============ Main Content ============ */}
            <div className="bm-main">
                {/* ── Sidebar ── */}
                <aside className={`bm-sidebar ${sidebarOpen ? "bm-sidebar-visible" : "bm-sidebar-hidden"}`}
                    id="bm-sidebar">
                    <h2 className="bm-sidebar-title">Filters</h2>

                    {/* Fabric Type */}
                    <div className="bm-filter-group">
                        <div className="bm-filter-label">Fabric Type</div>
                        <div className="bm-checkbox-list">
                            {FABRIC_TYPES.map((type) => (
                                <label className="bm-checkbox-item" key={type}>
                                    <input type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => toggleType(type)} />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bm-filter-group">
                        <div className="bm-filter-label">Location</div>
                        <div className="bm-checkbox-list">
                            {LOCATIONS.map((loc) => (
                                <label className="bm-checkbox-item" key={loc}>
                                    <input type="checkbox"
                                        checked={selectedLocations.includes(loc)}
                                        onChange={() => toggleLocation(loc)} />
                                    {loc}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Per Meter */}
                    <div className="bm-filter-group">
                        <div className="bm-filter-label">Price Per Meter</div>
                        <input type="range" className="bm-range-track"
                            min={0} max={5000} step={50} value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            id="bm-price-range" />
                        <div className="bm-range-values">
                            <span className="bm-range-val">LKR 0</span>
                            <span className="bm-range-val">LKR {maxPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Min Order */}
                    <div className="bm-filter-group">
                        <div className="bm-filter-label">Min Order (Meters)</div>
                        <input type="range" className="bm-range-track"
                            min={0} max={200} step={5} value={maxMinOrder}
                            onChange={(e) => setMaxMinOrder(Number(e.target.value))}
                            id="bm-min-order-range" />
                        <div className="bm-range-values">
                            <span className="bm-range-val">0m</span>
                            <span className="bm-range-val">{maxMinOrder}m</span>
                        </div>
                    </div>
                </aside>

                {/* ── Product Grid ── */}
                <div className="bm-content">
                    {/* Result count */}
                    {!loading && (
                        <p className="bm-result-count">
                            <strong>{filteredFabrics.length}</strong> fabrics found
                        </p>
                    )}

                    <div className="bm-grid">
                        {/* Loading skeletons */}
                        {loading && (
                            Array.from({ length: 6 }).map((_, i) => (
                                <FabricCardSkeleton key={i} />
                            ))
                        )}

                        {/* Real fabric cards */}
                        {!loading && filteredFabrics.map((fab, idx) => (
                            <div
                                className="bm-card"
                                key={fab.id}
                                id={`card-${fab.id}`}
                                onClick={() => navigate(`/shop/${fab.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                {/* Image */}
                                <div className="bm-card-image-wrap">
                                    {fab.image_url ? (
                                        <img
                                            src={fab.image_url}
                                            alt={fab.name}
                                            className="bm-card-image-placeholder"
                                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                        />
                                    ) : (
                                        <div
                                            className="bm-card-image-placeholder"
                                            style={{ background: BG_COLORS[idx % BG_COLORS.length] }}
                                        >
                                            ✦ {fab.name}
                                        </div>
                                    )}

                                    {/* Stock badge */}
                                    {!fab.inStock && (
                                        <span className="bm-card-badge bm-badge-out-of-stock">
                                            Out of Stock
                                        </span>
                                    )}
                                    {fab.inStock && fab.stock <= 10 && (
                                        <span className="bm-card-badge bm-badge-new">
                                            Low Stock
                                        </span>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="bm-card-body">
                                    <div className="bm-card-type">{fab.type}</div>

                                    <div className="bm-card-header">
                                        <h3 className="bm-card-name">{fab.name}</h3>
                                        <div className="bm-card-rating">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                            {fab.rating?.toFixed(1) || "4.5"}
                                        </div>
                                    </div>

                                    <div className="bm-card-supplier">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        {fab.color || fab.location || "Sri Lanka"}
                                    </div>

                                    {/* Color Swatches */}
                                    {fab.colors && fab.colors.length > 0 && (
                                        <div className="bm-swatches">
                                            {fab.colors.map((color, i) => (
                                                <span key={i} className="bm-swatch"
                                                    style={{ background: color }} title={color} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Color text if no swatches array */}
                                    {(!fab.colors || fab.colors.length === 0) && fab.color && (
                                        <div className="bm-swatches">
                                            <span className="bm-card-type">{fab.color}</span>
                                        </div>
                                    )}

                                    {/* Price / Stock */}
                                    <div className="bm-card-meta">
                                        <div className="bm-meta-item">
                                            <span className="bm-meta-label">Price/meter</span>
                                            <span className="bm-meta-value bm-price-highlight">
                                                LKR {fab.price?.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="bm-meta-item">
                                            <span className="bm-meta-label">Stock</span>
                                            <span className="bm-meta-value">{fab.stock} m</span>
                                        </div>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        className="bm-add-cart-btn"
                                        disabled={!fab.inStock}
                                        onClick={(e) => { e.stopPropagation(); handleAddToCart(fab); }}
                                        id={`add-cart-${fab.id}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                        </svg>
                                        {fab.inStock ? "Add to Cart" : "Out of Stock"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state */}
                    {!loading && filteredFabrics.length === 0 && !error && (
                        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#6b7280" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round" style={{ margin: "0 auto 1rem", opacity: 0.4 }}>
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No fabrics found</p>
                            <p style={{ fontSize: "0.85rem" }}>
                                Try adjusting your filters or search terms.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
