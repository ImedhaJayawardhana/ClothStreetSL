import { useState, useMemo } from "react";
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
const badgeConfig = {
    varient: { label: "Varient", bg: "bg-purple-600", text: "text-white" },
    hidden: { label: "Hidden", bg: "bg-amber-500", text: "text-white" },
};
/* ─── Add/Edit Modal ─────────────────────────────────────────── */
function ItemModal({ item, onClose, onSave }) {
    const [form, setForm] = useState(
        item || { name: "", type: "", category: "", price: "", stock: "", colors: [], stockStatus: "in" }
    );
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg">{item ? "Edit Item" : "Add New Item"}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    {[
                        { label: "Name", name: "name", placeholder: "e.g. Premium Cotton Twill" },
                        { label: "Type / Category", name: "type", placeholder: "e.g. Cotton" },
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
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
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