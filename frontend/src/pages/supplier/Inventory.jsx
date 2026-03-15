import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listFabrics, createFabric, updateFabric, deleteFabric } from "../../api";

const TABS = ["All", "In Stock", "Low Stock", "Out of Stock"];

const PALETTE_SWATCHES = [
    "#000000", "#374151", "#6b7280", "#9ca3af", "#d1d5db", "#f9fafb",
    "#7f1d1d", "#991b1b", "#dc2626", "#ef4444", "#f87171", "#fca5a5",
    "#78350f", "#92400e", "#d97706", "#f59e0b", "#fcd34d", "#fef08a",
    "#14532d", "#166534", "#16a34a", "#22c55e", "#86efac", "#bbf7d0",
    "#1e3a5f", "#1d4ed8", "#2563eb", "#3b82f6", "#93c5fd", "#bfdbfe",
    "#4c1d95", "#6d28d9", "#7c3aed", "#a855f7", "#c084fc", "#e9d5ff",
    "#831843", "#be185d", "#ec4899", "#f472b6",
];

// ─── Derive stockStatus from stock number ─────────────────────────────────────
function getStockStatus(stock) {
    if (stock <= 0) return "out";
    if (stock <= 10) return "low";
    return "in";
}

const stockStatusConfig = {
    in: { label: "In Stock", bg: "bg-green-100", text: "text-green-700" },
    low: { label: "Low Stock", bg: "bg-amber-100", text: "text-amber-700" },
    out: { label: "Out of Stock", bg: "bg-red-100", text: "text-red-600" },
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="rounded-2xl border shadow-sm overflow-hidden animate-pulse">
            <div className="h-44 bg-slate-100" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
        </div>
    );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
function ItemModal({ item, onClose, onSave, saving }) {
    const [form, setForm] = useState(
        item
            ? { ...item, colors: item.colors ? [...item.colors] : [] }
            : { name: "", type: "", color: "", price: "", stock: "", colors: [], image: null }
    );
    const [imageTab, setImageTab] = useState("url");
    const [imageUrlInput, setImageUrlInput] = useState(item?.image_url || "");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

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
        if (imageUrlInput.trim()) setForm((f) => ({ ...f, image_url: imageUrlInput.trim() }));
    }
    function clearImage() { setForm((f) => ({ ...f, image: null, image_url: null })); setImageUrlInput(""); }

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                    <h3 className="font-bold text-lg">{item ? "Edit Fabric" : "Add New Fabric"}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">

                    {/* Basic fields */}
                    {[
                        { label: "Fabric Name", name: "name", placeholder: "e.g. Premium Cotton Twill" },
                        { label: "Type / Fabric", name: "type", placeholder: "e.g. Cotton" },
                        { label: "Price per meter (LKR)", name: "price", placeholder: "e.g. 1500", type: "number" },
                        { label: "Stock (meters)", name: "stock", placeholder: "e.g. 50", type: "number" },
                    ].map(({ label, name, placeholder, type }) => (
                        <div key={name}>
                            <label className="block text-xs font-semibold mb-1 text-slate-600">{label}</label>
                            <input
                                type={type || "text"}
                                name={name}
                                value={form[name] || ""}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            />
                        </div>
                    ))}

                    {/* Image Section */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-slate-600">Product Image</label>
                        <div className="flex gap-1 bg-slate-50 rounded-xl p-1 mb-3">
                            {[
                                { id: "url", label: "Paste Image URL" },
                                { id: "upload", label: "Upload from Device" },
                            ].map((t) => (
                                <button key={t.id} type="button" onClick={() => setImageTab(t.id)}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${imageTab === t.id ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {imageTab === "url" ? (
                            <div className="flex gap-2">
                                <input type="url" value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    placeholder="https://example.com/fabric.jpg"
                                    className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition" />
                                <button type="button" onClick={handleApplyUrl}
                                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-semibold rounded-xl transition-colors">
                                    Apply
                                </button>
                            </div>
                        ) : (
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 py-5 ${dragOver ? "border-purple-400 bg-purple-50" : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"}`}
                            >
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                {form.image ? (
                                    <img src={form.image} alt="preview" className="h-28 object-contain rounded-lg" />
                                ) : (
                                    <>
                                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeWidth="1.5" d="M3 16l4-4 4 4 4-5 4 5M3 20h18M3 4h18" />
                                        </svg>
                                        <p className="text-xs font-medium text-slate-500">Drag & drop or <span className="font-semibold text-purple-600">browse</span></p>
                                        <p className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 10 MB</p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Preview strip */}
                        {(form.image || form.image_url) && (
                            <div className="mt-2 flex items-center gap-3 bg-slate-50 rounded-xl p-2 border">
                                <img src={form.image || form.image_url} alt="preview"
                                    className="h-14 w-14 object-cover rounded-lg border" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 truncate">Image selected</p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                        {form.image?.startsWith("data:") ? "Local file" : (form.image || form.image_url)}
                                    </p>
                                </div>
                                <button type="button" onClick={clearImage} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2" d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Colour Palette */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-slate-600">
                            Available Colours
                            {form.colors.length > 0 && (
                                <span className="ml-2 text-purple-600">{form.colors.length} selected</span>
                            )}
                        </label>
                        <div className="flex flex-wrap gap-2 p-3 rounded-xl border bg-slate-50 mb-3">
                            {PALETTE_SWATCHES.map((hex) => {
                                const selected = form.colors.includes(hex);
                                return (
                                    <button key={hex} type="button" title={hex} onClick={() => toggleColor(hex)}
                                        className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 focus:outline-none ${selected ? "ring-2 ring-purple-300 scale-110 border-purple-400" : "ring-1 ring-gray-200 border-white"}`}
                                        style={{ backgroundColor: hex }} />
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-slate-500 shrink-0">Custom:</label>
                            <input type="color" defaultValue="#7c3aed"
                                onChange={(e) => addCustomColor(e.target.value)}
                                className="w-10 h-8 rounded-lg border cursor-pointer p-0.5" />
                            <span className="text-xs text-slate-400">Click to open colour picker</span>
                        </div>
                        {form.colors.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {form.colors.map((c) => (
                                    <span key={c}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-white shadow-sm">
                                        <span className="w-3.5 h-3.5 rounded-full inline-block border" style={{ backgroundColor: c }} />
                                        {c}
                                        <button type="button" onClick={() => toggleColor(c)}
                                            className="text-slate-400 hover:text-red-500 transition-colors leading-none">×</button>
                                    </span>
                                ))}
                                <button type="button" onClick={() => setForm((f) => ({ ...f, colors: [] }))}
                                    className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1">
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        disabled={saving || !form.name || !form.type || !form.price || !form.stock}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                    >
                        {saving ? (
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : null}
                        {saving ? "Saving..." : item ? "Save Changes" : "Add Fabric"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Inventory() {
    const { user: authUser } = useAuth();

    // ── State ──
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [viewMode, setViewMode] = useState("grid");
    const [modal, setModal] = useState(null);

    // ── Fetch fabrics from FastAPI ──
    useEffect(() => {
        if (!authUser?.uid) return;
        const fetchFabrics = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await listFabrics();
                // Only show this supplier's fabrics
                const myFabrics = (res.data || []).filter(
                    (f) => f.supplier_id === authUser.uid
                );
                const enriched = myFabrics.map((f) => ({
                    ...f,
                    stockStatus: getStockStatus(f.stock),
                    colors: f.colors || [],
                    sales: f.sales || 0,
                    rating: f.rating || 5.0,
                }));
                setItems(enriched);
            } catch (err) {
                console.error("Failed to fetch fabrics:", err);
                setError("Failed to load inventory. Make sure the backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchFabrics();
    }, [authUser]);

    // ── Derived stats ──
    const totalListings = items.length;
    const totalSales = items.reduce((s, i) => s + (i.sales || 0), 0);
    const lowCount = items.filter((i) => i.stockStatus === "low").length;
    const outCount = items.filter((i) => i.stockStatus === "out").length;
    const stockValue = items.reduce((s, i) => s + (i.price || 0) * (i.stock || 0), 0);

    // ── Filtered + sorted list ──
    const filtered = useMemo(() => {
        let list = [...items];
        if (activeTab === "In Stock") list = list.filter((i) => i.stockStatus === "in");
        if (activeTab === "Low Stock") list = list.filter((i) => i.stockStatus === "low");
        if (activeTab === "Out of Stock") list = list.filter((i) => i.stockStatus === "out");
        if (search) {
            const q = search.toLowerCase();
            list = list.filter((i) =>
                i.name?.toLowerCase().includes(q) ||
                i.type?.toLowerCase().includes(q) ||
                i.color?.toLowerCase().includes(q)
            );
        }
        list.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price") return a.price - b.price;
            if (sortBy === "stock") return b.stock - a.stock;
            if (sortBy === "sales") return b.sales - a.sales;
            return 0;
        });
        return list;
    }, [items, activeTab, search, sortBy]);

    // ── Show success message briefly ──
    function showSuccess(msg) {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    }

    // ── Save fabric (create or update) ──
    async function handleSave(form) {
        setSaving(true);
        setError("");
        try {
            const payload = {
                name: form.name,
                type: form.type,
                color: form.color || "",
                price: Number(form.price),
                stock: Number(form.stock),
                colors: form.colors || [],
                image_url: form.image_url || form.image || null,
                supplier_id: authUser.uid,
            };

            if (modal?.mode === "add") {
                // Create new fabric via FastAPI
                const res = await createFabric(payload);
                const newFabric = {
                    ...payload,
                    id: res.data.fabric_id,
                    supplier_id: authUser.uid,
                    stockStatus: getStockStatus(payload.stock),
                    sales: 0,
                    rating: 5.0,
                };
                setItems((prev) => [newFabric, ...prev]);
                showSuccess("Fabric added successfully! It will now appear in Browse Materials.");
            } else {
                // Update existing fabric via FastAPI
                await updateFabric(form.id, payload);
                setItems((prev) =>
                    prev.map((i) =>
                        i.id === form.id
                            ? { ...i, ...payload, stockStatus: getStockStatus(payload.stock) }
                            : i
                    )
                );
                showSuccess("Fabric updated successfully!");
            }
            setModal(null);
        } catch (err) {
            console.error("Save failed:", err);
            setError(err.response?.data?.detail || "Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    // ── Toggle hide – persists to backend ──
    async function handleToggleHide(id) {
        const item = items.find((i) => i.id === id);
        if (!item) return;
        const newHidden = !item.hidden;
        try {
            await updateFabric(id, { hidden: newHidden });
            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, hidden: newHidden } : i))
            );
            showSuccess(newHidden ? "Product hidden from shop." : "Product is now visible in shop.");
        } catch (err) {
            console.error("Toggle hide failed:", err);
            setError(err.response?.data?.detail || "Failed to update visibility. Please try again.");
        }
    }

    // ── Delete fabric ──
    async function handleDelete(id, name) {
        if (!window.confirm(`Delete "${name}"? This will remove it from the shop permanently.`)) return;
        try {
            await deleteFabric(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
            showSuccess(`"${name}" deleted successfully.`);
        } catch (err) {
            console.error("Delete failed:", err);
            setError(err.response?.data?.detail || "Failed to delete. Please try again.");
        }
    }

    const formatValue = (v) => {
        if (v >= 1_000_000) return `LKR ${(v / 1_000_000).toFixed(1)}M`;
        if (v >= 1_000) return `LKR ${(v / 1_000).toFixed(0)}K`;
        return `LKR ${v}`;
    };

    const stats = [
        {
            label: "Total Listings", value: loading ? "..." : totalListings,
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
            bg: "from-purple-700 to-purple-900",
        },
        {
            label: "Total Sales", value: loading ? "..." : totalSales,
            icon: <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
            bg: "from-emerald-600 to-emerald-800",
        },
        {
            label: "Low / Out Stock", value: loading ? "..." : `${lowCount} / ${outCount}`,
            icon: <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
            bg: "from-amber-500 to-orange-700",
        },
        {
            label: "Stock Value", value: loading ? "..." : formatValue(stockValue),
            icon: <svg className="w-5 h-5 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
            bg: "from-violet-600 to-violet-900",
        },
    ];

    return (
        <div className="min-h-screen">

            {/* ── Hero Header ── */}
            <div className="relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #4c1d95 100%)" }}>
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
                <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-10">
                    <div className="flex items-center gap-2 text-white/60 text-xs mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <Link to="/dashboard" className="hover:text-white transition-colors">Supplier Portal</Link>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="2" d="M9 18l6-6-6-6" />
                        </svg>
                        <span className="text-white">Inventory</span>
                    </div>

                    <div className="flex items-end justify-between flex-wrap gap-4">
                        <div className="text-white">
                            <h1 className="text-3xl font-extrabold tracking-tight">My Inventory</h1>
                            <p className="mt-1 text-sm text-white/70">
                                {loading ? "Loading your fabrics..." : `Manage your ${totalListings} fabric listings on ClothStreet`}
                            </p>
                        </div>
                        <button
                            onClick={() => setModal({ mode: "add" })}
                            className="flex items-center gap-2 bg-white text-purple-700 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-purple-50 transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2.5" d="M12 5v14M5 12h14" />
                            </svg>
                            Add New Fabric
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        {stats.map((stat) => (
                            <div key={stat.label}
                                className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5 shadow-lg relative overflow-hidden text-white`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {stat.icon}
                                    <span className="text-xs font-medium text-white/80">{stat.label}</span>
                                </div>
                                <p className="text-2xl sm:text-3xl font-extrabold leading-none">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Filters & Grid ── */}
            <div className="max-w-7xl mx-auto px-6 py-6">

                {/* Error banner */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Success banner */}
                {successMsg && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        {successMsg}
                    </div>
                )}

                {/* Toolbar */}
                <div className="rounded-2xl shadow-sm border p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[180px]">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="m21 21-4.3-4.3" strokeWidth="2" />
                            </svg>
                            <input type="text" placeholder="Search listings…" value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition" />
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
                            {TABS.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            className="text-xs border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition">
                            <option value="name">Name ↕</option>
                            <option value="price">Price ↕</option>
                            <option value="stock">Stock ↕</option>
                            <option value="sales">Sales ↕</option>
                        </select>
                        <div className="flex items-center gap-1 border rounded-xl p-1">
                            {["grid", "list"].map((v) => (
                                <button key={v} onClick={() => setViewMode(v)}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === v ? "bg-purple-50 text-purple-600" : "text-slate-400 hover:text-slate-600"}`}>
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

                <p className="text-xs mb-4 font-medium text-slate-500">{loading ? "Loading..." : `${filtered.length} listings`}</p>

                {/* Grid View */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {/* Loading skeletons */}
                        {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

                        {/* Real items */}
                        {!loading && filtered.map((item) => {
                            const ss = stockStatusConfig[item.stockStatus] || stockStatusConfig.in;
                            const isHidden = !!item.hidden;
                            return (
                                <div key={item.id}
                                    className={`rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group relative ${isHidden ? "border-amber-200 opacity-70" : ""}`}>
                                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-purple-50 to-gray-100">
                                        {item.image_url || item.image ? (
                                            <img src={item.image_url || item.image} alt={item.name}
                                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isHidden ? "grayscale brightness-75" : ""}`} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                                                    <path d="m9 9 4 4 4-4" strokeWidth="1.5" />
                                                </svg>
                                            </div>
                                        )}
                                        {isHidden && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                    Hidden from customers
                                                </span>
                                            </div>
                                        )}
                                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold ${ss.bg} ${ss.text}`}>
                                            {ss.label}
                                        </span>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-sm leading-tight text-slate-900">{item.name}</h3>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                                <span className="text-xs font-semibold text-slate-600">{item.rating?.toFixed(1)}</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeWidth="2" d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z" />
                                                <circle cx="12" cy="10" r="3" strokeWidth="2" />
                                            </svg>
                                            {item.type} · {item.color || "Various colors"}
                                        </p>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ss.bg} ${ss.text}`}>
                                                {item.stockStatus === "in" ? `In Stock · ${item.stock}m` :
                                                    item.stockStatus === "low" ? `Low Stock · ${item.stock}m` : "Out of Stock · 0m"}
                                            </span>
                                            <span className="text-xs text-slate-400">{item.sales} sales</span>
                                        </div>

                                        {item.colors && item.colors.length > 0 && (
                                            <div className="flex items-center gap-1.5 mb-3">
                                                {item.colors.slice(0, 5).map((c, i) => (
                                                    <span key={i} className="w-4 h-4 rounded-full border shadow-sm ring-1 ring-gray-200"
                                                        style={{ background: c }} />
                                                ))}
                                                {item.colors.length > 5 && (
                                                    <span className="text-xs text-slate-400">+{item.colors.length - 5}</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-1">
                                            <div>
                                                <span className="text-base font-extrabold text-slate-900">
                                                    LKR {item.price?.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-slate-400"> /m</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleToggleHide(item.id)}
                                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${isHidden ? "bg-amber-50 hover:bg-amber-100 text-amber-600" : "bg-slate-50 hover:bg-slate-100 text-slate-600"}`}>
                                                    {isHidden ? "Show" : "Hide"}
                                                </button>
                                                <button onClick={() => setModal({ mode: "edit", item })}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(item.id, item.name)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add New card */}
                        {!loading && (
                            <button onClick={() => setModal({ mode: "add" })}
                                className="rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all flex flex-col items-center justify-center gap-3 min-h-[280px] group">
                                <div className="w-12 h-12 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                    <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2" d="M12 5v14M5 12h14" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-slate-400 group-hover:text-purple-600 transition-colors">
                                    Add New Fabric
                                </span>
                            </button>
                        )}

                        {/* Empty state */}
                        {!loading && filtered.length === 0 && items.length === 0 && (
                            <div className="col-span-3 text-center py-16 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-40">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="m9 9 4 4 4-4" />
                                </svg>
                                <p className="font-semibold text-lg">No fabrics yet</p>
                                <p className="text-sm mt-1">Click "Add New Fabric" to add your first listing</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* List View */
                    <div className="rounded-2xl shadow-sm border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-slate-50">
                                <tr>
                                    {["Item", "Type", "Stock", "Price", "Sales", "Actions"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading && Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="px-5 py-3.5">
                                                <div className="h-4 bg-slate-100 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {!loading && filtered.map((item) => {
                                    const ss = stockStatusConfig[item.stockStatus] || stockStatusConfig.in;
                                    const isHidden = !!item.hidden;
                                    return (
                                        <tr key={item.id}
                                            className={`transition-colors ${isHidden ? "bg-amber-50/40 hover:bg-amber-50/60" : "hover:bg-slate-50"}`}>
                                            <td className="px-5 py-3.5">
                                                <p className="font-semibold text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-400">{item.color}</p>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600">{item.type}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ss.bg} ${ss.text}`}>
                                                    {ss.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-slate-900">LKR {item.price?.toLocaleString()}</td>
                                            <td className="px-5 py-3.5 text-slate-500">{item.sales}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleToggleHide(item.id)}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${isHidden ? "bg-amber-50 hover:bg-amber-100 text-amber-600" : "bg-slate-50 hover:bg-slate-100 text-slate-600"}`}>
                                                        {isHidden ? "Show" : "Hide"}
                                                    </button>
                                                    <button onClick={() => setModal({ mode: "edit", item })}
                                                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl transition-colors">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id, item.name)}
                                                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors">
                                                        Delete
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

            {/* Modal */}
            {modal && (
                <ItemModal
                    item={modal.mode === "edit" ? modal.item : null}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                    saving={saving}
                />
            )}
        </div>
    );
}
