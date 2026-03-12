import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// Status badge colours (matches seller dashboard pattern)
// ─────────────────────────────────────────────────────────────
const statusColours = {
    "In Progress": "bg-orange-100 text-orange-600",
    "Ready to Deliver": "bg-purple-100 text-purple-600",
    "Pending": "bg-gray-100 text-gray-500",
    "Completed": "bg-green-100 text-green-600",
    "Accepted": "bg-blue-100 text-blue-600",
    "New": "bg-orange-100 text-orange-600",
};

// ─────────────────────────────────────────────────────────────
// Mock / fallback data
// ─────────────────────────────────────────────────────────────
const FALLBACK_REQUESTS = [
    { id: "mock_req_1", customer: "Hiruni Siriwardena", status: "New", description: "Evening Gown Design (Custom)", price: "Rs 25,000", due: "Due next week" },
    { id: "mock_req_2", customer: "Studio Red", status: "New", description: "Bridal Wear Sketches (3 items)", price: "Rs 45,000", due: "Due tomorrow" },
    { id: "mock_req_3", customer: "Amandi Perera", status: "Accepted", description: "Casual Dress Pattern", price: "Rs 8,500", due: "Due in 3 days" },
];

const FALLBACK_ORDERS = [
    { id: "mock_ord_1", itemName: "Evening Gown Project", customerName: "Hiruni Siriwardena", status: "In Progress", total: 25000 },
    { id: "mock_ord_2", itemName: "Bridal Accessories", customerName: "Kavindi Silva", status: "Ready to Deliver", total: 15000 },
    { id: "mock_ord_3", itemName: "Summer Collection", customerName: "Amaya Fernando", status: "Completed", total: 35000 },
];

const FALLBACK_REVIEWS = [
    { id: "rev_1", stars: 5, quote: "Amazing design concepts! Captured exactly what I wanted for my wedding.", name: "Nilushi B.", timeAgo: "2 days ago" },
    { id: "rev_2", stars: 5, quote: "Very professional and creative. Will definitely hire again.", name: "Tariq R.", timeAgo: "1 week ago" },
    { id: "rev_3", stars: 4, quote: "Great work on the patterns, just a small adjustment needed on the sleeves.", name: "Amaya F.", timeAgo: "2 weeks ago" },
];

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function DesignerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [jobRequests, setJobRequests] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ active: 0, inProgress: 0, readyToDeliver: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    // Redirect non-designers away
    useEffect(() => {
        if (user && user.role !== "designer") {
            navigate("/");
        }
    }, [user, navigate]);

    // ── Firestore reads ──
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const uid = user.uid;

                // Orders
                const ordersSnap = await getDocs(query(collection(db, "orders"), where("designerId", "==", uid)));
                const allOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
                const counts = { active: 0, inProgress: 0, readyToDeliver: 0, completed: 0 };
                allOrders.forEach((o) => {
                    const s = (o.status || "").toLowerCase();
                    if (["confirmed", "in progress", "fabric ordered", "ready to deliver"].includes(s)) counts.active++;
                    if (s === "in progress") counts.inProgress++;
                    if (s === "ready to deliver") counts.readyToDeliver++;
                    if (s === "completed") counts.completed++;
                });
                setStats(counts);
                const sorted = [...allOrders].sort((a, b) => {
                    const toMs = (v) => v?.toDate?.().getTime() ?? new Date(v ?? 0).getTime();
                    return toMs(b.createdAt) - toMs(a.createdAt);
                });
                setOrders(sorted.length > 0 ? sorted.slice(0, 5) : FALLBACK_ORDERS);

                // Job Requests
                const reqSnap = await getDocs(query(collection(db, "jobRequests"), where("designerId", "==", uid)));
                const reqs = reqSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setJobRequests(reqs.length > 0 ? reqs : FALLBACK_REQUESTS);

                // Reviews
                const revSnap = await getDocs(query(collection(db, "reviews"), where("designerId", "==", uid)));
                const revs = revSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setReviews(revs.length > 0 ? revs : FALLBACK_REVIEWS);
            } catch (err) {
                console.error("DesignerDashboard fetch error:", err);
                setOrders(FALLBACK_ORDERS);
                setJobRequests(FALLBACK_REQUESTS);
                setReviews(FALLBACK_REVIEWS);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // ── Accept / Decline handlers ──
    const handleAccept = async (id) => {
        try {
            await updateDoc(doc(db, "jobRequests", id), { status: "Accepted" });
        } catch (e) { console.error(e); }
        setJobRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Accepted" } : r)));
    };
    const handleDecline = async (id) => {
        try {
            await updateDoc(doc(db, "jobRequests", id), { status: "Declined" });
        } catch (e) { console.error(e); }
        setJobRequests((prev) => prev.filter((r) => r.id !== id));
    };

    // ── Helper ──
    const formatDate = (raw) => {
        if (!raw) return "";
        const d = raw?.toDate ? raw.toDate() : new Date(raw);
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    };

    const displayName = user?.name || user?.email || "Designer";
    const avatarLetter = displayName.charAt(0).toUpperCase();
    const newReqCount = jobRequests.filter((r) => (r.status || "").toLowerCase() === "new").length;

    // ── Stat cards data (same style as seller dashboard) ──
    const statsData = [
        {
            label: "Active Orders", value: stats.active,
            color: "text-purple-700", bg: "bg-purple-50",
            icon: <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M12 6v6l4 2" /></svg>,
        },
        {
            label: "In Progress", value: stats.inProgress,
            color: "text-orange-500", bg: "bg-orange-50",
            icon: <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>,
        },
        {
            label: "Ready to Deliver", value: stats.readyToDeliver,
            color: "text-blue-500", bg: "bg-blue-50",
            icon: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1" strokeWidth="2" /><path strokeWidth="2" d="M16 8h4l3 5v3h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>,
        },
        {
            label: "Completed", value: stats.completed,
            color: "text-green-600", bg: "bg-green-50",
            icon: <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M9 12l2 2 4-4" /></svg>,
        },
    ];

    // ── Loading / error screens (same as seller dashboard) ──
    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500 font-medium">Loading your dashboard…</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

            {/* ── Purple Header Bar (same style as seller) ── */}
            <div className="bg-purple-600 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl shadow-lg">
                        {avatarLetter}
                    </div>
                    <div>
                        <p className="text-purple-200 text-sm">
                            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},
                        </p>
                        <p className="text-white font-bold text-xl leading-tight">{displayName}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block text-xs bg-purple-500 text-white px-2.5 py-0.5 rounded-full font-medium">
                                Fashion Designer
                            </span>
                            {newReqCount > 0 && (
                                <span className="inline-block text-xs bg-orange-400 text-white px-2.5 py-0.5 rounded-full font-bold">
                                    {newReqCount} new request{newReqCount !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate("/designer-profile")}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    My Profile
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

                {/* ── Stat Cards (same style as seller) ── */}
                <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {statsData.map((stat) => (
                        <div key={stat.label}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                                {stat.icon}
                            </div>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* ── Earnings + Ratings row ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Total Earnings */}
                    <div className="bg-purple-600 rounded-2xl p-5 text-white relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500 rounded-full opacity-50" />
                        <div className="absolute -right-2 -top-4 w-16 h-16 bg-purple-400 rounded-full opacity-30" />
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" />
                                    <path strokeWidth="2" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                                </svg>
                            </div>
                            <p className="text-purple-200 text-sm font-medium mb-1">Total Earnings</p>
                            <h3 className="font-bold text-3xl mb-1">Rs 65,000</h3>
                            <p className="text-purple-200 text-sm mb-4 leading-snug">from 8 completed orders</p>
                            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 w-fit">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                                <span className="text-green-400 text-sm font-semibold">+24% vs last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Ratings & Reviews */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                </svg>
                                <h3 className="font-bold text-gray-900 text-sm">Ratings & Reviews</h3>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <svg key={s} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-amber-500 font-bold text-sm">4.9</span>
                                <span className="text-gray-400 text-sm">(124 reviews)</span>
                            </div>
                        </div>
                        <div className="px-5 py-4 flex flex-col gap-2">
                            {[
                                { stars: 5, count: 110, max: 110 },
                                { stars: 4, count: 10, max: 110 },
                                { stars: 3, count: 4, max: 110 },
                                { stars: 2, count: 0, max: 110 },
                                { stars: 1, count: 0, max: 110 },
                            ].map((row) => (
                                <div key={row.stars} className="flex items-center gap-3">
                                    <span className="text-gray-500 text-sm w-4 text-right">{row.stars}</span>
                                    <svg className="w-3.5 h-3.5 text-amber-400 fill-current flex-shrink-0" viewBox="0 0 24 24">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                            style={{ width: `${row.max > 0 ? (row.count / row.max) * 100 : 0}%` }} />
                                    </div>
                                    <span className="text-gray-400 text-sm w-6 text-right">{row.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Quotation Inbox Quick Access ── */}
                <div
                    onClick={() => navigate("/quotation-inbox")}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl shadow-md p-5 flex items-center justify-between cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base">Quote Requests</h3>
                            <p className="text-purple-200 text-sm">View and respond to customer quote requests</p>
                        </div>
                    </div>
                    <div className="text-white/60 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* ── Order Requests + Recent Orders (3-col like seller) ── */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Order Requests — takes 2 cols */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" strokeWidth="2" />
                                    <path strokeWidth="2" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                </svg>
                                <h2 className="font-bold text-gray-900">Order Requests</h2>
                            </div>
                            {newReqCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-500">
                                    {newReqCount} new
                                </span>
                            )}
                        </div>
                        {jobRequests.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-400 text-sm">No requests yet.</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {jobRequests.map((req) => (
                                    <div key={req.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900 text-sm">{req.customerName || req.customer}</p>
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColours[req.status] || "bg-gray-100 text-gray-600"}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                                                {req.price}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">{req.description || req.item} · {req.dueDate || req.due}</p>
                                        <div className="flex items-center gap-2">
                                            {(req.status || "").toLowerCase() === "new" ? (
                                                <>
                                                    <button onClick={() => handleAccept(req.id)}
                                                        className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold border border-emerald-200 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                        Accept
                                                    </button>
                                                    <button onClick={() => handleDecline(req.id)}
                                                        className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold border border-red-200 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                        Decline
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
                                                    ✓ Accepted
                                                </span>
                                            )}
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors ml-auto flex-shrink-0">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeWidth="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right column — Active Orders + Earnings summary */}
                    <div className="flex flex-col gap-4">
                        {/* Active & Recent Orders */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                                    </svg>
                                    <h3 className="font-bold text-gray-900 text-sm">Active Orders</h3>
                                </div>
                                <button onClick={() => navigate("/orders")}
                                    className="text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1">
                                    View all
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                            {orders.length === 0 ? (
                                <div className="px-5 py-6 text-center text-gray-400 text-sm">No orders yet.</div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {orders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{order.itemName || order.item || order.name || "Order"}</p>
                                                    <p className="text-xs text-gray-500">{order.customerName || order.clientName} · {formatDate(order.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColours[order.status] || "bg-gray-100 text-gray-600"}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Top Rated Reviews summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                                <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                </svg>
                                <h3 className="font-bold text-gray-900 text-sm">Recent Reviews</h3>
                            </div>
                            {reviews.length === 0 ? (
                                <div className="px-5 py-6 text-center text-gray-400 text-sm">No reviews yet.</div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {reviews.map((review) => {
                                        const rName = review.reviewerName || review.name || "Customer";
                                        const avatarColors = ["bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-emerald-500"];
                                        const color = avatarColors[rName.charCodeAt(0) % avatarColors.length];
                                        return (
                                            <div key={review.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
                                                            {rName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{rName}</p>
                                                            <p className="text-xs text-gray-400">{review.timeAgo || "Recently"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <svg key={s} className={`w-3.5 h-3.5 ${s <= (review.stars || review.rating || 0) ? "text-amber-400" : "text-gray-200"} fill-current`} viewBox="0 0 24 24">
                                                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 italic leading-snug pl-9">"{review.quote || review.text}"</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
