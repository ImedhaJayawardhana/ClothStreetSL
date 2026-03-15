import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyOrders, getQuotationOffers, cancelOrder, deleteQuotation } from "../api";
import toast from "react-hot-toast";

// ── Status config ──
const STATUS_STYLES = {
    pending: { bg: "bg-amber-100", text: "text-amber-700", border: "#f59e0b" },
    processing: { bg: "bg-blue-100", text: "text-blue-700", border: "#3b82f6" },
    completed: { bg: "bg-emerald-100", text: "text-emerald-700", border: "#16a34a" },
    cancelled: { bg: "bg-red-100", text: "text-red-600", border: "#dc2626" },
    shipped: { bg: "bg-indigo-100", text: "text-indigo-700", border: "#4f46e5" },
};

const QUOTATION_STATUS_STYLES = {
    pending: { bg: "bg-amber-100", text: "text-amber-700", border: "#f59e0b" },
    accepted: { bg: "bg-emerald-100", text: "text-emerald-700", border: "#16a34a" },
    completed: { bg: "bg-blue-100", text: "text-blue-700", border: "#3b82f6" },
};

// ── Loading Skeleton ──
function OrderSkeleton() {
    return (
        <div className="border rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
            </div>
            <div className="h-3 bg-slate-100 rounded w-3/4 mb-2" />
            <div className="h-8 bg-slate-100 rounded-xl mt-4" />
        </div>
    );
}

export default function CustomerOrders() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // ── State ──
    const [orders, setOrders] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [quotationsLoading, setQuotationsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    // Review Modal
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewOrder, setReviewOrder] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);

    // ── Fetch real orders from FastAPI ──
    useEffect(() => {
        if (!user?.uid) return;

        // Fetch orders
        getMyOrders()
            .then((res) => setOrders(res.data || []))
            .catch((err) => {
                console.error("Error fetching orders:", err);
                toast.error("Failed to load orders.");
            })
            .finally(() => setOrdersLoading(false));

        // Fetch quotations using updated API
        getQuotationOffers()
            .then((res) => setQuotations(res.data || []))
            .catch((err) => console.error("Error fetching quotations:", err))
            .finally(() => setQuotationsLoading(false));
    }, [user]);

    // ── Cancel order ──
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await cancelOrder(orderId);
            setOrders((prev) =>
                prev.map((o) => o.id === orderId ? { ...o, status: "cancelled" } : o)
            );
            toast.success("Order cancelled successfully!");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to cancel order.");
        }
    };

    // ── Delete quotation ──
    const handleDeleteQuotation = async (quotationId) => {
        if (!window.confirm("Are you sure you want to delete this quotation request?")) return;
        try {
            await deleteQuotation(quotationId);
            setQuotations((prev) => prev.filter((q) => q.id !== quotationId));
            toast.success("Quotation deleted successfully!");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to delete quotation.");
        }
    };

    // ── Review handlers ──
    const handleOpenReview = (order) => {
        setReviewOrder(order);
        setReviewText("");
        setReviewRating(5);
        setIsReviewModalOpen(true);
    };

    const handleSubmitReview = () => {
        if (!reviewText.trim()) {
            toast.error("Please write a review before submitting.");
            return;
        }
        setOrders((prev) =>
            prev.map((o) => o.id === reviewOrder.id ? { ...o, status: "completed" } : o)
        );
        setIsReviewModalOpen(false);
        toast.success("Review submitted successfully!");
    };

    // ── Deduplicate: hide completed fabric-only orders that are already
    //    covered by a service/quotation order (same fabric name appears in
    //    a combined order with a "Service:" item or a quotationId).
    const fabricNamesCoveredByService = new Set();
    orders.forEach((order) => {
        const isServiceOrder =
            order.quotationId ||
            order.items?.some((i) => i.name?.toLowerCase().startsWith("service:"));
        if (isServiceOrder) {
            order.items?.forEach((item) => {
                if (!item.name?.toLowerCase().startsWith("service:")) {
                    fabricNamesCoveredByService.add(item.name?.toLowerCase().trim());
                }
            });
        }
    });

    const displayOrders = orders.filter((order) => {
        const isCompleted = ["completed", "delivered"].includes(order.status?.toLowerCase());
        if (isCompleted && fabricNamesCoveredByService.size > 0) {
            // If every item in this completed order is already in a service order, hide it.
            const allCovered = order.items?.every((item) =>
                fabricNamesCoveredByService.has(item.name?.toLowerCase().trim())
            );
            if (allCovered) return false;
        }
        return true;
    });

    // ── Filter orders ──
    const filteredOrders = displayOrders.filter((order) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            order.items?.[0]?.name?.toLowerCase().includes(q) ||
            order.id?.toLowerCase().includes(q) ||
            order.status?.toLowerCase().includes(q);

        if (activeTab === "All") return matchesSearch;
        const status = order.status?.toLowerCase();
        if (activeTab === "Active")
            return matchesSearch && ["pending", "confirmed", "processing", "shipped", "tailoring", "fabric_shipped", "received_by_tailor", "tailoring_done", "shipped_to_customer"].includes(status);
        if (activeTab === "Completed")
            return matchesSearch && ["completed", "delivered"].includes(status);
        return matchesSearch;
    });

    // ── Stats from deduplicated data ──
    const totalOrders = displayOrders.length;
    const activeOrders = displayOrders.filter((o) =>
        ["pending", "confirmed", "processing", "shipped", "tailoring", "fabric_shipped", "received_by_tailor", "tailoring_done", "shipped_to_customer"].includes(o.status?.toLowerCase())
    ).length;
    const completedOrders = displayOrders.filter((o) =>
        ["completed", "delivered"].includes(o.status?.toLowerCase())
    ).length;
    const totalSpent = displayOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);

    // ── Export CSV ──
    const handleExport = () => {
        const csvData = [
            ["Order ID", "Items", "Total (LKR)", "Status", "Date"],
            ...filteredOrders.map((o) => [
                o.id,
                `"${o.items?.map((i) => i.name).join(", ") || "—"}"`,
                o.total_price,
                o.status,
                o.created_at || "—",
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `my_orders_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Orders exported!");
    };

    return (
        <div className="min-h-screen">

            {/* ── Hero Banner ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-11 px-4">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20" />
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Orders</h1>
                            <p className="text-sm mt-0.5 text-white/70">
                                {ordersLoading ? "Loading..." : `${totalOrders} orders total`}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleExport}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export
                    </button>
                </div>
            </section>

            {/* ── Content ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                    {[
                        { label: "Total Orders", value: ordersLoading ? "..." : totalOrders, color: "bg-violet-100 text-violet-600" },
                        { label: "Active", value: ordersLoading ? "..." : activeOrders, sub: "In progress", color: "bg-blue-100 text-blue-600" },
                        { label: "Completed", value: ordersLoading ? "..." : completedOrders, sub: "Delivered", color: "bg-emerald-100 text-emerald-600" },
                        { label: "Total Spent", value: ordersLoading ? "..." : `LKR ${(totalSpent / 1000).toFixed(0)}K`, sub: "Total purchases", color: "bg-amber-100 text-amber-600" },
                    ].map((stat) => (
                        <div key={stat.label} className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div>
                                <p className="text-sm font-medium mb-1 text-slate-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                {stat.sub && <p className="text-xs mt-1 text-slate-400">{stat.sub}</p>}
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search + Tabs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <input type="text" placeholder="Search orders..."
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>

                    <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
                        {["All", "Active", "Completed", "Quotations"].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}>
                                {tab}
                                {tab === "Quotations" && quotations.length > 0 && (
                                    <span className="ml-1.5 text-xs">({quotations.length})</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Quotations Tab ── */}
                {activeTab === "Quotations" ? (
                    quotationsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
                        </div>
                    ) : quotations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {quotations.map((q) => {
                                const statusKey = q.status?.toLowerCase() || "pending";
                                const sc = QUOTATION_STATUS_STYLES[statusKey] || QUOTATION_STATUS_STYLES.pending;
                                return (
                                    <div key={q.id} className="border rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
                                        style={{ borderLeft: `4px solid ${sc.border}` }}>
                                        <div className="flex items-start gap-3.5 mb-3">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white shrink-0">
                                                ✂️
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold truncate text-slate-900">
                                                    Quotation Request
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-0.5">ID: {q.id?.slice(0, 12)}...</p>
                                                <span className={`inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
                                                    {q.status}
                                                </span>
                                            </div>
                                            {/* Delete button for pending/rejected/declined quotes */}
                                            {["pending", "rejected", "declined"].includes(q.status?.toLowerCase()) && (
                                                <button onClick={() => handleDeleteQuotation(q.id)}
                                                    className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors shrink-0 text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">
                                            {q.description || "No description provided"}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-500">
                                            <div>
                                                <span>Provider ID: </span>
                                                <span className="font-semibold text-slate-700">{q.providerId?.slice(0, 8)}...</span>
                                            </div>
                                            <div>
                                                <span>Price: </span>
                                                <span className="font-bold text-violet-600">LKR {q.grandTotal ? q.grandTotal.toLocaleString() : (q.price ? q.price.toLocaleString() : "Pending")}</span>
                                            </div>
                                        </div>

                                        {q.status?.toLowerCase() === "quoted" && (
                                            <button
                                                onClick={() => navigate(`/quotation-review/${q.id}`, { state: { quotation: q } })}
                                                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
                                                Review & Respond
                                            </button>
                                        )}
                                        {q.providerType === "designer" && ["design_in_progress", "design_completed", "design_delivered", "completed"].includes(q.status?.toLowerCase()) && (
                                            <button
                                                onClick={() => navigate(`/designer-timeline/${q.id}`, { state: { quotation: q } })}
                                                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 border-violet-600 text-violet-600 hover:bg-violet-50 transition-all">
                                                Track Design Progress
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-1 text-slate-700">No quotations yet</h3>
                            <p className="text-sm text-slate-400">Request a quote from a tailor or designer.</p>
                            <button onClick={() => navigate("/tailors")}
                                className="mt-4 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all">
                                Browse Tailors
                            </button>
                        </div>
                    )

                ) : (
                    /* ── Orders Tab ── */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {ordersLoading ? (
                            [1, 2, 3, 4].map((i) => <OrderSkeleton key={i} />)
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                const statusKey = order.status?.toLowerCase() || "pending";
                                const ss = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
                                const itemNames = order.items?.map((i) => i.name).join(", ") || "Order";

                                return (
                                    <div key={order.id} className="border rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
                                        style={{ borderLeft: `4px solid ${ss.border}` }}>

                                        {/* Header */}
                                        <div className="flex items-start gap-3.5 mb-3">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-bold text-lg text-indigo-600 shrink-0">
                                                {itemNames.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold truncate text-slate-900">{itemNames}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">Order ID: {order.id?.slice(0, 16)}</p>
                                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${ss.bg} ${ss.text}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Cancel button for pending orders */}
                                            {order.status?.toLowerCase() === "pending" && (
                                                <button onClick={() => handleCancelOrder(order.id)}
                                                    className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors shrink-0 text-slate-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        {/* Items summary */}
                                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""} —{" "}
                                            {order.items?.map((i) => `${i.name} (${i.quantity}${i.unit || "m"})`).join(", ")}
                                        </p>

                                        {/* ── Provider Completion Badge ── */}
                                        {(() => {
                                            const providerType = order.providerType?.toLowerCase();
                                            const providerName = order.providerName;
                                            const isServiceOrder = providerType === "tailor" || providerType === "designer" ||
                                                order.items?.some((i) => i.name?.toLowerCase().startsWith("service:"));
                                            if (!isServiceOrder) return null;

                                            const label = providerType === "designer" ? "Designer" : "Tailor";
                                            const nameTag = providerName ? ` · ${providerName}` : "";
                                            const st = order.status?.toLowerCase();
                                            const isProviderDone = ["completed", "delivered", "design_delivered", "tailoring_done"].includes(st);
                                            const isActive = ["tailoring", "design_in_progress", "in_progress", "received_by_tailor"].includes(st);

                                            if (isProviderDone) {
                                                return (
                                                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3 bg-emerald-50 border border-emerald-200 text-emerald-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                                        </svg>
                                                        <span className="text-xs font-bold">Completed by {label}{nameTag}</span>
                                                    </div>
                                                );
                                            }
                                            if (isActive) {
                                                return (
                                                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3 bg-blue-50 border border-blue-200 text-blue-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        <span className="text-xs font-bold">In Progress by {label}{nameTag}</span>
                                                    </div>
                                                );
                                            }
                                            // Pending — not yet started by provider
                                            return (
                                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3 bg-amber-50 border border-amber-200 text-amber-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                    </svg>
                                                    <span className="text-xs font-bold">Awaiting {label}{nameTag}</span>
                                                </div>
                                            );
                                        })()}

                                        {/* Shipping info */}
                                        {order.shipping && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                    <polyline points="9 22 9 12 15 12 15 22" />
                                                </svg>
                                                {order.shipping?.city || "Home delivery"}
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div className="grid grid-cols-2 gap-2.5 mb-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <span>Items:</span>
                                                <span className="font-semibold text-slate-700">{order.items?.length}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <span>Total:</span>
                                                <span className="font-semibold text-emerald-600">
                                                    LKR {order.total_price?.toLocaleString()}
                                                </span>
                                            </div>
                                            {order.created_at && (
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 col-span-2">
                                                    <span>Placed:</span>
                                                    <span className="font-semibold text-slate-700">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2.5 mt-4">
                                            {["pending", "confirmed", "processing", "shipped", "tailoring", "fabric_shipped", "received_by_tailor", "tailoring_done", "shipped_to_customer"].includes(order.status?.toLowerCase()) && (
                                                <button onClick={() => navigate(`/order-tracking/${order.id}`, { state: { order } })}
                                                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold border hover:bg-slate-50 transition-all text-slate-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="1" y="3" width="15" height="13" rx="2" />
                                                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                                        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                                                    </svg>
                                                    Track
                                                </button>
                                            )}
                                            {order.status?.toLowerCase() === "completed" && (
                                                <button onClick={() => handleOpenReview(order)}
                                                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold border hover:bg-amber-50 hover:border-amber-200 text-amber-600 transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                    Review
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            /* Empty state */
                            <div className="col-span-2 text-center py-16">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold mb-1 text-slate-700">No orders found</h3>
                                <p className="text-sm text-slate-400 mb-4">
                                    {searchQuery ? "Try adjusting your search." : "You haven't placed any orders yet."}
                                </p>
                                {!searchQuery && (
                                    <button onClick={() => navigate("/shop")}
                                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all">
                                        Browse Materials
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Review Modal ── */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Write a Review</h3>
                            <button onClick={() => setIsReviewModalOpen(false)}
                                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <p className="text-sm mb-4 text-slate-600">
                                How was your experience with your order?
                            </p>
                            <div className="flex gap-2 mb-6 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setReviewRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            className={`w-8 h-8 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <textarea rows="4"
                                className="w-full border rounded-xl px-4 py-3 text-sm placeholder-slate-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                                placeholder="Share your feedback about the product and delivery..."
                                value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end gap-3">
                            <button onClick={() => setIsReviewModalOpen(false)}
                                className="px-5 py-2 rounded-xl text-sm font-medium border hover:bg-slate-50 transition-colors text-slate-600">
                                Cancel
                            </button>
                            <button onClick={handleSubmitReview}
                                className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
