import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./BrowseMaterials.css";

/* ─── Sample fabric data ──────────────────────────────────── */
const FABRICS = [
  {
    id: "fab_001",
    name: "Premium Cotton Twill",
    type: "Cotton",
    supplier: "Lanka Fabrics Co. · Pettah",
    rating: 4.8,
    colors: ["#1e293b", "#991b1b", "#1e3a5f"],
    price: 850,
    minOrder: 50,
    location: "Pettah",
    badge: "new",
    inStock: true,
    bgColor: "#d4c5a9",
  },
  {
    id: "fab_002",
    name: "Silk Satin Blend",
    type: "Silk",
    supplier: "Royal Fabrics Ltd. · Panadura",
    rating: 4.9,
    colors: ["#f5f5dc", "#c084fc", "#ec4899", "#60a5fa", "#facc15", "#a3e635"],
    price: 2300,
    minOrder: 30,
    location: "Panadura",
    badge: "popular",
    inStock: true,
    bgColor: "#e8d5c4",
  },
  {
    id: "fab_003",
    name: "Linen Canvas",
    type: "Linen",
    supplier: "Natural Fibers · Pettah",
    rating: 4.7,
    colors: ["#1e293b", "#78716c", "#d6d3d1"],
    price: 1200,
    minOrder: 40,
    location: "Pettah",
    badge: null,
    inStock: true,
    bgColor: "#c8bfa9",
  },
  {
    id: "fab_004",
    name: "Polyester Georgette",
    type: "Polyester",
    supplier: "Modern Textiles · Colombo",
    rating: 4.5,
    colors: ["#c084fc", "#ec4899", "#f472b6", "#a78bfa", "#818cf8", "#fb923c"],
    price: 650,
    minOrder: 80,
    location: "Colombo",
    badge: null,
    inStock: true,
    bgColor: "#d5c4d9",
  },
  {
    id: "fab_005",
    name: "Denim Heavy Weight",
    type: "Denim",
    supplier: "Blue Star Fabrics · Pettah",
    rating: 4.8,
    colors: ["#1e3a5f", "#2563eb", "#3b82f6"],
    price: 950,
    minOrder: 65,
    location: "Pettah",
    badge: null,
    inStock: true,
    bgColor: "#8ba4c4",
  },
  {
    id: "fab_006",
    name: "Chiffon Deluxe",
    type: "Chiffon",
    supplier: "Elegant Fabrics · Panadura",
    rating: 4.6,
    colors: ["#f9a8d4", "#c084fc", "#f472b6", "#fda4af", "#fb923c", "#fbbf24"],
    price: 1800,
    minOrder: 25,
    location: "Panadura",
    badge: "out-of-stock",
    inStock: false,
    bgColor: "#f0ccd4",
  },
  {
    id: "fab_007",
    name: "Wool Blend Suiting",
    type: "Wool",
    supplier: "Premium Cloths · Colombo",
    rating: 4.8,
    colors: ["#1e293b", "#374151", "#6b7280"],
    price: 1250,
    minOrder: 20,
    location: "Colombo",
    badge: null,
    inStock: true,
    bgColor: "#b8a99a",
  },
  {
    id: "fab_008",
    name: "Rayon Printed",
    type: "Rayon",
    supplier: "Color Works Textiles · Pettah",
    rating: 4.4,
    colors: ["#c084fc", "#a78bfa", "#818cf8"],
    price: 780,
    minOrder: 55,
    location: "Pettah",
    badge: null,
    inStock: true,
    bgColor: "#c7b8d4",
  },
];

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

/* ─── Component ───────────────────────────────────────────── */
export default function BrowseMaterials() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [maxMinOrder, setMaxMinOrder] = useState(100);

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    return FABRICS.filter((fab) => {
      // Search
      if (
        searchQuery &&
        !fab.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !fab.supplier.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !fab.type.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [searchQuery, selectedTypes, selectedLocations, maxPrice, maxMinOrder]);

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
        <div className="bm-hero-inner">
          <div className="bm-breadcrumb">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span>Fabric Marketplace</span>
          </div>

          <h1 className="bm-hero-title">Browse Premium Fabrics</h1>
          <p className="bm-hero-subtitle">
            Connect with 8+ verified fabric suppliers across Sri Lanka
          </p>
        </div>
      </section>

      {/* ============ Search Bar ============ */}
      <div className="bm-search-wrap">
        <div className="bm-search-bar">
          <svg
            className="bm-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search fabrics, suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="bm-search-input"
          />
          <button
            className="bm-filter-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            id="bm-filter-toggle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="4" y1="21" y2="14" />
              <line x1="4" x2="4" y1="10" y2="3" />
              <line x1="12" x2="12" y1="21" y2="12" />
              <line x1="12" x2="12" y1="8" y2="3" />
              <line x1="20" x2="20" y1="21" y2="16" />
              <line x1="20" x2="20" y1="12" y2="3" />
              <line x1="2" x2="6" y1="14" y2="14" />
              <line x1="10" x2="14" y1="8" y2="8" />
              <line x1="18" x2="22" y1="16" y2="16" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* ============ Main Content ============ */}
      <div className="bm-main">
        {/* ── Sidebar ── */}
        <aside
          className={`bm-sidebar ${sidebarOpen ? "bm-sidebar-visible" : "bm-sidebar-hidden"}`}
          id="bm-sidebar"
        >
          <h2 className="bm-sidebar-title">Filters</h2>

          {/* Fabric Type */}
          <div className="bm-filter-group">
            <div className="bm-filter-label">Fabric Type</div>
            <div className="bm-checkbox-list">
              {FABRIC_TYPES.map((type) => (
                <label className="bm-checkbox-item" key={type}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                  />
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
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleLocation(loc)}
                  />
                  {loc}
                </label>
              ))}
            </div>
          </div>

          {/* Price Per Meter */}
          <div className="bm-filter-group">
            <div className="bm-filter-label">Price Per Meter</div>
            <input
              type="range"
              className="bm-range-track"
              min={0}
              max={5000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              id="bm-price-range"
            />
            <div className="bm-range-values">
              <span className="bm-range-val">Rs 0</span>
              <span className="bm-range-val">Rs {maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Min Order */}
          <div className="bm-filter-group">
            <div className="bm-filter-label">Min Order (Meters)</div>
            <input
              type="range"
              className="bm-range-track"
              min={0}
              max={200}
              step={5}
              value={maxMinOrder}
              onChange={(e) => setMaxMinOrder(Number(e.target.value))}
              id="bm-min-order-range"
            />
            <div className="bm-range-values">
              <span className="bm-range-val">0m</span>
              <span className="bm-range-val">{maxMinOrder}m</span>
            </div>
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="bm-content">
          <p className="bm-result-count">
            <strong>{filteredFabrics.length}</strong> fabrics found
          </p>

          <div className="bm-grid">
            {filteredFabrics.map((fab) => (
              <div
                className="bm-card"
                key={fab.id}
                id={`card-${fab.id}`}
                onClick={() => navigate(`/shop/${fab.id}`)}
                style={{ cursor: "pointer" }}
              >
                {/* Image */}
                <div className="bm-card-image-wrap">
                  <div
                    className="bm-card-image-placeholder"
                    style={{ background: fab.bgColor }}
                  >
                    ✦ {fab.name}
                  </div>

                  {/* Wishlist */}
                  <button className="bm-card-wishlist" aria-label="Add to wishlist">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>

                  {/* Badge */}
                  {fab.badge && (
                    <span
                      className={`bm-card-badge ${
                        fab.badge === "new"
                          ? "bm-badge-new"
                          : fab.badge === "popular"
                            ? "bm-badge-popular"
                            : fab.badge === "out-of-stock"
                              ? "bm-badge-out-of-stock"
                              : ""
                      }`}
                    >
                      {fab.badge === "out-of-stock"
                        ? "Out of Stock"
                        : fab.badge.charAt(0).toUpperCase() + fab.badge.slice(1)}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="bm-card-body">
                  <div className="bm-card-type">{fab.type}</div>

                  <div className="bm-card-header">
                    <h3 className="bm-card-name">{fab.name}</h3>
                    <div className="bm-card-rating">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#facc15"
                        stroke="#facc15"
                        strokeWidth="1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {fab.rating}
                    </div>
                  </div>

                  <div className="bm-card-supplier">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {fab.supplier}
                  </div>

                  {/* Color Swatches */}
                  <div className="bm-swatches">
                    {fab.colors.map((color, i) => (
                      <span
                        key={i}
                        className="bm-swatch"
                        style={{ background: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Price / Min Order */}
                  <div className="bm-card-meta">
                    <div className="bm-meta-item">
                      <span className="bm-meta-label">Price/meter</span>
                      <span className="bm-meta-value bm-price-highlight">
                        Rs {fab.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="bm-meta-item">
                      <span className="bm-meta-label">Min Order</span>
                      <span className="bm-meta-value">{fab.minOrder} m</span>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <button
                    className="bm-add-cart-btn"
                    disabled={!fab.inStock}
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(fab); }}
                    id={`add-cart-${fab.id}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    {fab.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFabrics.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                color: "#6b7280",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ margin: "0 auto 1rem", opacity: 0.4 }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                No fabrics found
              </p>
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
