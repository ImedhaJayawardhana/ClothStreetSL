import { useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
/* ─── Sample inventory data (replace with Firestore fetch later) ── */
const SAMPLE_ITEMS = [
    {
        id: "inv_001",
        name: "Velvet Upholstery",
        type: "Textured",
        category: "Colombo",
        rating: 4.6,
        colors: ["#7c3aed", "#dc2626", "#1e3a5f"],
        price: 1800,
        stock: 4,
        sales: 53,
        badge: "varient",
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "inv_002",
        name: "Batik Handloom",
        type: "Batik",
        category: "Kandy",
        rating: 4.9,
        colors: ["#1e293b", "#374151", "#6b7280"],
        price: 3200,
        stock: 40,
        sales: 180,
        badge: null,
        stockStatus: "in",
        image: "https://images.unsplash.com/photo-1558618047-f4d17fd1de69?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "inv_003",
        name: "Polyester Georgette",
        type: "Polyester",
        category: "Colombo",
        rating: 4.5,
        colors: ["#c084fc", "#ec4899", "#f472b6", "#a78bfa"],
        price: 650,
        stock: 0,
        sales: 87,
        badge: "hidden",
        stockStatus: "out",
        image: null,
    },
    {
        id: "inv_004",
        name: "Linen Canvas",
        type: "Active",
        category: "Pettah",
        rating: 4.7,
        colors: ["#d6d3d1", "#a8a29e"],
        price: 1200,
        stock: 18,
        sales: 38,
        badge: null,
        stockStatus: "low",
        image: null,
    },
    {
        id: "inv_005",
        name: "Silk Satin Blend",
        type: "Permanent",
        category: "Kandy",
        rating: 4.9,
        colors: ["#f5f5dc", "#c084fc", "#ec4899", "#60a5fa", "#facc15"],
        price: 2400,
        stock: 45,
        sales: 215,
        badge: null,
        stockStatus: "in",
        image: null,
    },
    {
        id: "inv_006",
        name: "Premium Cotton Twill",
        type: "Cotton",
        category: "Colombo",
        rating: 4.6,
        colors: ["#1e293b", "#991b1b", "#1b3a5c"],
        price: 850,
        stock: 100,
        sales: 342,
        badge: null,
        stockStatus: "in",
        image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=400&q=80",
    },
];
const TABS = ["All", "In Stock", "Low Stock", "Out of Stock"];
const stockStatusConfig = {
    in: { label: "In Stock", bg: "bg-green-100", text: "text-green-700" },
    low: { label: "Low Stock", bg: "bg-amber-100", text: "text-amber-700" },
    out: { label: "Out of Stock", bg: "bg-red-100", text: "text-red-600" },
};
/* ─── Preset colour swatches for the palette ────────────────── */
const PALETTE_SWATCHES = [
    "#000000", "#374151", "#6b7280", "#9ca3af", "#d1d5db", "#f9fafb",
    "#7f1d1d", "#991b1b", "#dc2626", "#ef4444", "#f87171", "#fca5a5",
    "#78350f", "#92400e", "#d97706", "#f59e0b", "#fcd34d", "#fef08a",
    "#14532d", "#166534", "#16a34a", "#22c55e", "#86efac", "#bbf7d0",
    "#1e3a5f", "#1d4ed8", "#2563eb", "#3b82f6", "#93c5fd", "#bfdbfe",
    "#4c1d95", "#6d28d9", "#7c3aed", "#a855f7", "#c084fc", "#e9d5ff",
    "#831843", "#be185d", "#ec4899", "#f472b6",
];
/* ─── Add/Edit Modal ─────────────────────────────────────────── */
function ItemModal({ item, onClose, onSave }) {
    const [form, setForm] = useState(
        item
            ? { ...item, colors: item.colors ? [...item.colors] : [] }
            : { name: "", type: "", category: "", price: "", stock: "", colors: [], stockStatus: "in", image: null }
    );
    /* image tab: "upload" | "url" */
    const [imageTab, setImageTab] = useState("upload");
    const [imageUrlInput, setImageUrlInput] = useState(item?.image || "");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    /* ── Image helpers ── */
    function applyFile(file) {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target.result }));
        reader.readAsDataURL(file);
    }
    function handleFileChange(e) { applyFile(e.target.files[0]); }
    function handleDrop(e) {
        e.preventDefault(); setDragOver(false);
        applyFile(e.dataTransfer.files[0]);
    }
    function handleApplyUrl() {
        if (imageUrlInput.trim()) setForm((f) => ({ ...f, image: imageUrlInput.trim() }));
    }
    function clearImage() { setForm((f) => ({ ...f, image: null })); setImageUrlInput(""); }

    /* ── Colour helpers ── */
    function toggleColor(hex) {
        setForm((f) => {
            const already = f.colors.includes(hex);
            return { ...f, colors: already ? f.colors.filter((c) => c !== hex) : [...f.colors, hex] };
        });
    }
    function addCustomColor(hex) {
        if (!form.colors.includes(hex)) setForm((f) => ({ ...f, colors: [...f.colors, hex] }));
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <h3 className="font-bold text-gray-900 text-lg">{item ? "Edit Item" : "Add New Item"}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
                    {/* Basic fields */}
                    {[
                        { label: "Name", name: "name", placeholder: "e.g. Premium Cotton Twill" },
                        { label: "Type / Fabric", name: "type", placeholder: "e.g. Cotton" },
                        { label: "Location", name: "category", placeholder: "e.g. Colombo" },
                        { label: "Price (Rs)", name: "price", placeholder: "e.g. 1500", type: "number" },
                        { label: "Stock (meters)", name: "stock", placeholder: "e.g. 50", type: "number" },
                    ].map(({ label, name, placeholder, type }) => (
                        <div key={name}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                            <input
                                type={type || "text"}
                                name={name}
                                value={form[name] || ""}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            />
                        </div>
                    ))}

                    {/* Stock Status */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Status</label>
                        <select
                            name="stockStatus"
                            value={form.stockStatus}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        >
                            <option value="in">In Stock</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                        </select>
                    </div>

                    {/* ── Image Section ── */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Product Image</label>

                        {/* Tab toggle */}
                        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-3">
                            {[
                                { id: "upload", label: "Upload from Device" },
                                { id: "url", label: "Paste Image URL" },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setImageTab(t.id)}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${imageTab === t.id ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {imageTab === "upload" ? (
                            /* Drag & drop zone */
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 py-5 ${dragOver ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/40"}`}
                            >
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                {form.image && imageTab === "upload" && !imageUrlInput ? (
                                    <img src={form.image} alt="preview" className="h-28 object-contain rounded-lg" />
                                ) : (
                                    <>
                                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeWidth="1.5" d="M3 16l4-4 4 4 4-5 4 5M3 20h18M3 4h18" />
                                        </svg>
                                        <p className="text-xs text-gray-400 font-medium">Drag & drop or <span className="text-purple-600 font-semibold">browse</span></p>
                                        <p className="text-[11px] text-gray-300">PNG, JPG, WEBP up to 10 MB</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* URL input */
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    placeholder="https://example.com/fabric.jpg"
                                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyUrl}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        )}

                        {/* Preview strip + clear button (visible when image is set) */}
                        {form.image && (
                            <div className="mt-2 flex items-center gap-3 bg-gray-50 rounded-xl p-2">
                                <img src={form.image} alt="preview" className="h-14 w-14 object-cover rounded-lg border border-gray-200" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-700 truncate">Image selected</p>
                                    <p className="text-[11px] text-gray-400 truncate">{form.image.startsWith("data:") ? "Local file" : form.image}</p>
                                </div>
                                <button type="button" onClick={clearImage} className="text-red-400 hover:text-red-600 transition-colors shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2" d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Colour Palette ── */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                            Available Colours
                            {form.colors.length > 0 && (
                                <span className="ml-2 text-purple-600">{form.colors.length} selected</span>
                            )}
                        </label>

                        {/* Swatch grid */}
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-3">
                            {PALETTE_SWATCHES.map((hex) => {
                                const selected = form.colors.includes(hex);
                                return (
                                    <button
                                        key={hex}
                                        type="button"
                                        title={hex}
                                        onClick={() => toggleColor(hex)}
                                        className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 focus:outline-none ${selected ? "border-purple-600 ring-2 ring-purple-300 scale-110" : "border-white ring-1 ring-gray-200"}`}
                                        style={{ backgroundColor: hex }}
                                    />
                                );
                            })}
                        </div>

                        {/* Custom colour picker row */}
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 font-medium shrink-0">Custom:</label>
                            <input
                                type="color"
                                defaultValue="#7c3aed"
                                onChange={(e) => addCustomColor(e.target.value)}
                                className="w-10 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                                title="Pick a custom colour"
                            />
                            <span className="text-xs text-gray-400">Click to open colour picker</span>
                        </div>

                        {/* Selected colours as removable chips */}
                        {form.colors.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {form.colors.map((c) => (
                                    <span
                                        key={c}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-gray-200 bg-white shadow-sm"
                                    >
                                        <span className="w-3.5 h-3.5 rounded-full inline-block border border-gray-300" style={{ backgroundColor: c }} />
                                        {c}
                                        <button
                                            type="button"
                                            onClick={() => toggleColor(c)}
                                            className="text-gray-400 hover:text-red-500 transition-colors leading-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setForm((f) => ({ ...f, colors: [] }))}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        {item ? "Save Changes" : "Add Item"}
                    </button>
                </div>
            </div>
        </div>
    );
}
/* ─── Main Component ─────────────────────────────────────────── */
export default function Inventory() {
    const { user: _user } = useAuth();
    const _navigate = useNavigate();
    const [items, setItems] = useState(SAMPLE_ITEMS);
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [modal, setModal] = useState(null); // null | { mode: "add" | "edit", item?: {...} }
    /* ── Derived stats ── */
    const totalListings = items.length;
    const totalSales = items.reduce((s, i) => s + (i.sales || 0), 0);
    const lowCount = items.filter((i) => i.stockStatus === "low").length;
    const outCount = items.filter((i) => i.stockStatus === "out").length;
    const stockValue = items.reduce((s, i) => s + (i.price || 0) * (i.stock || 0), 0);
    /* ── Filtered + sorted list ── */
    const filtered = useMemo(() => {
        let list = [...items];
        // Tab filter
        if (activeTab === "In Stock") list = list.filter((i) => i.stockStatus === "in");
        if (activeTab === "Low Stock") list = list.filter((i) => i.stockStatus === "low");
        if (activeTab === "Out of Stock") list = list.filter((i) => i.stockStatus === "out");
        // Search
        if (search) {
            const q = search.toLowerCase();
            list = list.filter((i) =>
                i.name.toLowerCase().includes(q) ||
                i.type?.toLowerCase().includes(q) ||
                i.category?.toLowerCase().includes(q)
            );
        }
        // Sort
        list.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price") return a.price - b.price;
            if (sortBy === "stock") return b.stock - a.stock;
            if (sortBy === "sales") return b.sales - a.sales;
            return 0;
        });
        return list;
    }, [items, activeTab, search, sortBy]);
    function handleSave(form) {
        if (modal?.mode === "add") {
            setItems((prev) => [
                ...prev,
                {
                    ...form,
                    id: `inv_${Date.now()}`,
                    rating: 5.0,
                    sales: 0,
                    colors: form.colors || [],
                    badge: null,
                    hidden: false,
                    price: Number(form.price) || 0,
                    stock: Number(form.stock) || 0,
                },
            ]);
        } else {
            setItems((prev) => prev.map((i) => (i.id === form.id ? { ...i, ...form } : i)));
        }
        setModal(null);
    }
    function handleToggleHide(id) {
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, hidden: !i.hidden } : i));
    }
    const formatValue = (v) => {
        if (v >= 1_000_000) return `Rs${(v / 1_000_000).toFixed(1)}M`;
        if (v >= 1_000) return `Rs${(v / 1_000).toFixed(0)}K`;
        return `Rs${v}`;
    };
    const stats = [
        {
            label: "Total Listings",
            value: totalListings,
            icon: (
                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
            ),
            bg: "from-purple-700 to-purple-900",
            valueClass: "text-white",
        },
        {
            label: "Total Sales",
            value: totalSales,
            icon: (
                <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            bg: "from-emerald-600 to-emerald-800",
            valueClass: "text-white",
        },
        {
            label: "Low / Out Stock",
            value: `${lowCount} / ${outCount}`,
            icon: (
                <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            bg: "from-amber-500 to-orange-700",
            valueClass: "text-white",
        },
        {
            label: "Stock Value",
            value: formatValue(stockValue),
            icon: (
                <svg className="w-5 h-5 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            bg: "from-violet-600 to-violet-900",
            valueClass: "text-white",
        },
    ];
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Hero Header ────────────────────────────────────── */}
            <div
                className="relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #4c1d95 100%)" }}
            >
                {/* decorative blobs */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
                <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #c4b5fd, transparent)" }} />
                <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-purple-300 text-xs mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <Link to="/dashboard" className="hover:text-white transition-colors">Supplier Portal</Link>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="2" d="M9 18l6-6-6-6" />
                        </svg>
                        <span className="text-purple-200">Inventory</span>
                    </div>
                    <div className="flex items-end justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Inventory</h1>
                            <p className="text-purple-200 mt-1 text-sm">
                                Manage your {totalListings} fabric listings on ClothStreet
                            </p>
                        </div>
                        <button
                            onClick={() => setModal({ mode: "add" })}
                            className="flex items-center gap-2 bg-white text-purple-700 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-purple-50 transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2.5" d="M12 5v14M5 12h14" />
                            </svg>
                            Add New Item
                        </button>
                    </div>
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5 shadow-lg relative overflow-hidden`}
                            >
                                <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/5" />
                                <div className="flex items-center gap-2 mb-2">
                                    {stat.icon}
                                    <span className="text-xs text-white/70 font-medium">{stat.label}</span>
                                </div>
                                <p className={`text-2xl sm:text-3xl font-extrabold ${stat.valueClass} leading-none`}>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* ── Filters & Grid ────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Toolbar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[180px]">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                                <path d="m21 21-4.3-4.3" strokeWidth="2" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search listings…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            />
                        </div>
                        {/* Filter icon (decorative) */}
                        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <line x1="4" x2="4" y1="21" y2="14" strokeWidth="2" />
                                <line x1="4" x2="4" y1="10" y2="3" strokeWidth="2" />
                                <line x1="12" x2="12" y1="21" y2="12" strokeWidth="2" />
                                <line x1="12" x2="12" y1="8" y2="3" strokeWidth="2" />
                                <line x1="20" x2="20" y1="21" y2="16" strokeWidth="2" />
                                <line x1="20" x2="20" y1="12" y2="3" strokeWidth="2" />
                                <line x1="2" x2="6" y1="14" y2="14" strokeWidth="2" />
                                <line x1="10" x2="14" y1="8" y2="8" strokeWidth="2" />
                                <line x1="18" x2="22" y1="16" y2="16" strokeWidth="2" />
                            </svg>
                        </button>
                        {/* Tabs */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab
                                        ? "bg-purple-600 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-600"
                        >
                            <option value="name">Name ↕</option>
                            <option value="price">Price ↕</option>
                            <option value="stock">Stock ↕</option>
                            <option value="sales">Sales ↕</option>
                        </select>
                        {/* View toggle */}
                        <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
                            {["grid", "list"].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setViewMode(v)}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === v ? "bg-purple-600 text-white" : "text-gray-400 hover:text-gray-700"}`}
                                >
                                    {v === "grid" ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                                            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                                            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                                            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
                                            <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
                                            <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-xs text-gray-500 mb-4 font-medium">{filtered.length} listings</p>

                {/* Grid */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((item) => {
                            const ss = stockStatusConfig[item.stockStatus] || stockStatusConfig.in;
                            const isHidden = !!item.hidden;
                            return (
                                <div
                                    key={item.id}
                                    className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group relative ${isHidden ? "border-amber-200 opacity-70" : "border-gray-100"
                                        }`}
                                >
                                    {/* Image */}
                                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-purple-50 to-gray-100">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isHidden ? "grayscale brightness-75" : ""
                                                    }`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                                                    <path d="m9 9 4 4 4-4" strokeWidth="1.5" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Hidden overlay banner */}
                                        {isHidden && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <span className="flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                        <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
                                                    </svg>
                                                    Hidden from customers
                                                </span>
                                            </div>
                                        )}

                                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold ${ss.bg} ${ss.text}`}>
                                            {ss.label}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className={`font-bold text-sm leading-tight ${isHidden ? "text-gray-400" : "text-gray-900"
                                                }`}>{item.name}</h3>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                                <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeWidth="2" d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z" />
                                                <circle cx="12" cy="10" r="3" strokeWidth="2" />
                                            </svg>
                                            {item.category}
                                        </p>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ss.bg} ${ss.text}`}>
                                                {item.stockStatus === "in" ? `In Stock · ${item.stock}m` :
                                                    item.stockStatus === "low" ? `Low Stock · ${item.stock}m` : "Out of Stock · 0m"}
                                            </span>
                                            <span className="text-xs text-gray-400">{item.sales} sales</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 mb-3">
                                            {item.colors.slice(0, 5).map((c, i) => (
                                                <span
                                                    key={i}
                                                    className="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                                                    style={{ background: c }}
                                                />
                                            ))}
                                            {item.colors.length > 5 && (
                                                <span className="text-xs text-gray-400">+{item.colors.length - 5}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <div>
                                                <span className="text-base font-extrabold text-gray-900">
                                                    Rs {item.price.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-gray-400"> /m</span>
                                            </div>
                                            {/* Action buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Hide toggle */}
                                                <button
                                                    onClick={() => handleToggleHide(item.id)}
                                                    title={isHidden ? "Show listing" : "Hide listing"}
                                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${isHidden
                                                        ? "bg-amber-50 hover:bg-amber-100 text-amber-600"
                                                        : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                                                        }`}
                                                >
                                                    {isHidden ? (
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                            <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" strokeWidth="2" />
                                                        </svg>
                                                    )}
                                                    {isHidden ? "Show" : "Hide"}
                                                </button>
                                                {/* Edit */}
                                                <button
                                                    onClick={() => setModal({ mode: "edit", item })}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add New card */}
                        <button
                            onClick={() => setModal({ mode: "add" })}
                            className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all flex flex-col items-center justify-center gap-3 h-full min-h-[280px] group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2" d="M12 5v14M5 12h14" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-400 group-hover:text-purple-600 transition-colors">
                                Add New Listing
                            </span>
                        </button>
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {["Item", "Category", "Stock", "Price", "Sales", "Actions"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((item) => {
                                    const ss = stockStatusConfig[item.stockStatus] || stockStatusConfig.in;
                                    const isHidden = !!item.hidden;
                                    return (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors ${isHidden ? "bg-amber-50/40 hover:bg-amber-50/60" : "hover:bg-purple-50/20"}`}
                                        >
                                            <td className="px-5 py-3.5">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className={`font-semibold ${isHidden ? "text-gray-400" : "text-gray-900"}`}>{item.name}</p>
                                                        {isHidden && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                                                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                                    <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
                                                                </svg>
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400">{item.type}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600">{item.category}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ss.bg} ${ss.text}`}>
                                                    {ss.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-gray-900">Rs {item.price.toLocaleString()}</td>
                                            <td className="px-5 py-3.5 text-gray-600">{item.sales}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    {/* Hide toggle */}
                                                    <button
                                                        onClick={() => handleToggleHide(item.id)}
                                                        title={isHidden ? "Show listing" : "Hide listing"}
                                                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${isHidden
                                                            ? "bg-amber-50 hover:bg-amber-100 text-amber-600"
                                                            : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                                                            }`}
                                                    >
                                                        {isHidden ? (
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                                <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                <circle cx="12" cy="12" r="3" strokeWidth="2" />
                                                            </svg>
                                                        )}
                                                        {isHidden ? "Show" : "Hide"}
                                                    </button>
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => setModal({ mode: "edit", item })}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modal ─────────────────────────────────────────── */}
            {modal && (
                <ItemModal
                    item={modal.mode === "edit" ? modal.item : null}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
