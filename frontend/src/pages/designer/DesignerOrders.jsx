import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// Status colours for badges
// ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    "In Progress": { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
    "In Review": { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
    "Pending": { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-500" },
    "Completed": { bg: "bg-green-100", text: "text-green-600", dot: "bg-green-500" },
    "Cancelled": { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
};

const STATUS_OPTIONS = ["Pending", "In Progress", "In Review", "Completed", "Cancelled"];

const ITEMS_PER_PAGE = 6;

// ─────────────────────────────────────────────────────────────
// Mock / fallback project data (matches screenshot)
// ─────────────────────────────────────────────────────────────
const FALLBACK_PROJECTS = [
    {
        id: "DFS-2026-011",
        name: "Summer Resort Collection",
        client: "Boutique Elegance",
        category: "Fashion Collection",
        description: "Complete resort wear line with modern batik prints",
        progress: 70,
        designs: 12,
        value: 280000,
        due: "3/20/2026",
        status: "In Progress",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=120&h=120&fit=crop",
    },
    {
        id: "DFS-2026-012",
        name: "Bridal Couture Series",
        client: "Chamara & Ishani",
        category: "Bridal Design",
        description: "Custom bridal gown with traditional Kandyan elements",
        progress: 85,
        designs: 3,
        value: 450000,
        due: "3/25/2026",
        status: "In Review",
        thumbnail: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=120&h=120&fit=crop",
    },
    {
        id: "DFS-2026-013",
        name: "Corporate Uniform Design",
        client: "Tech Solutions Lanka",
        category: "Corporate Wear",
        description: "Professional uniform collection for tech company staff",
        progress: 25,
        designs: 5,
        value: 180000,
        due: "4/1/2026",
        status: "Pending",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    },
    {
        id: "DFS-2026-014",
        name: "Festival Capsule Collection",
        client: "Artisan Threads",
        category: "Festive Wear",
        description: "Limited edition festive capsule collection with handloom details",
        progress: 100,
        designs: 8,
        value: 320000,
        due: "3/5/2026",
        status: "Completed",
        thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=120&h=120&fit=crop",
    },
];

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function DesignerOrders() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, revenue: 0 });
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusDropdown, setStatusDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProject, setSelectedProject] = useState(null);

    // Reset page when filter/search changes
    useEffect(() => { setCurrentPage(1); }, [activeTab, searchTerm]);

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
                const ordersSnap = await getDocs(query(collection(db, "orders"), where("designerId", "==", uid)));
                const allOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

                const counts = { total: allOrders.length, active: 0, completed: 0, revenue: 0 };
                allOrders.forEach((o) => {
                    const s = (o.status || "").toLowerCase();
                    if (["confirmed", "in progress", "fabric ordered", "ready to deliver", "pending", "in review"].includes(s)) counts.active++;
                    if (s === "completed") counts.completed++;
                    counts.revenue += o.total || o.price || 0;
                });

                setStats(counts.total > 0 ? counts : { total: 4, active: 3, completed: 1, revenue: 1230000 });
                setOrders(allOrders.length > 0 ? allOrders : FALLBACK_PROJECTS);
            } catch (err) {
                console.error("DesignerOrders fetch error:", err);
                setStats({ total: 4, active: 3, completed: 1, revenue: 1230000 });
                setOrders(FALLBACK_PROJECTS);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // ── Update order status in Firestore ──
    const handleStatusUpdate = async (projectId, newStatus) => {
        try {
            // Only write to Firestore for real docs (not mock IDs)
            if (!projectId.startsWith("DFS-")) {
                await updateDoc(doc(db, "orders", projectId), { status: newStatus });
            }
            setOrders((prev) =>
                prev.map((o) => (o.id === projectId ? { ...o, status: newStatus, progress: newStatus === "Completed" ? 100 : o.progress } : o))
            );
            // Update stats
            setStats((prev) => {
                const updated = { ...prev };
                const oldOrder = orders.find((o) => o.id === projectId);
                if (oldOrder) {
                    const oldS = (oldOrder.status || "").toLowerCase();
                    const newS = newStatus.toLowerCase();
                    if (["in progress", "pending", "in review", "confirmed"].includes(oldS)) updated.active--;
                    if (oldS === "completed") updated.completed--;
                    if (["in progress", "pending", "in review", "confirmed"].includes(newS)) updated.active++;
                    if (newS === "completed") updated.completed++;
                }
                return updated;
            });
        } catch (err) {
            console.error("Status update failed:", err);
        }
        setStatusDropdown(null);
    };

    // ── Export orders to CSV ──
    const handleExport = () => {
        const headers = ["ID", "Name", "Client", "Category", "Status", "Progress (%)", "Designs", "Value (Rs)", "Due Date"];
        const rows = orders.map((o) => [
            o.id,
            o.name || "",
            o.client || o.customerName || "",
            o.category || "",
            o.status || "",
            o.progress || 0,
            o.designs || 0,
            o.value || 0,
            o.due || "",
        ]);
        const csvContent = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `designer_projects_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // ── Format revenue ──
    const formatRevenue = (val) => {
        if (val >= 1000000) return `Rs ${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `Rs ${(val / 1000).toFixed(0)}K`;
        return `Rs ${val.toLocaleString()}`;
    };

    // ── Stat cards data ──
    const statsData = [
        {
            label: "Total Projects",
            sub: "All time",
            value: stats.total,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            ),
            iconBg: "rgba(139, 92, 246, 0.15)",
        },
        {
            label: "Active",
            sub: "In progress",
            value: stats.active,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="#60a5fa" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            ),
            iconBg: "rgba(96, 165, 250, 0.15)",
        },
        {
            label: "Completed",
            sub: "Delivered",
            value: stats.completed,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                </svg>
            ),
            iconBg: "rgba(52, 211, 153, 0.15)",
        },
        {
            label: "Revenue",
            sub: "Lifetime earnings",
            value: formatRevenue(stats.revenue),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="#f472b6" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                </svg>
            ),
            iconBg: "rgba(244, 114, 182, 0.15)",
        },
    ];

    // ── Helper ──
    const displayName = user?.name || user?.email || "Designer";
    const avatarLetter = displayName.charAt(0).toUpperCase();

    // ── Loading state ──
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Loading your projects…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            {/* Added a custom animation for the cards */}
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .do-card { animation: fadeSlideUp 0.4s ease both; }
                .do-card:nth-child(1) { animation-delay: 0.0s; }
                .do-card:nth-child(2) { animation-delay: 0.06s; }
                .do-card:nth-child(3) { animation-delay: 0.12s; }
                .do-card:nth-child(4) { animation-delay: 0.18s; }
                .do-card:nth-child(5) { animation-delay: 0.24s; }
                .do-card:nth-child(6) { animation-delay: 0.30s; }
            `}</style>

            {/* ── Purple Header Bar ── */}
            <div className="bg-purple-600 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl shadow-lg shrink-0">
                        {avatarLetter}
                    </div>
                    <div>
                        <p className="text-white font-bold text-xl leading-tight">My Design Projects</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block text-xs bg-purple-500 text-white px-2.5 py-0.5 rounded-full font-medium">
                                Active Workspace
                            </span>
                            <span className="text-purple-200 text-sm">
                                Manage and track your design orders
                            </span>
                        </div>
                    </div>
                </div>
                {/* Export Button */}
                <button onClick={handleExport} className="flex items-center gap-2 bg-white text-purple-700 hover:bg-purple-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow-md border border-purple-100 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Export
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 flex-1 w-full">

                {/* ── Stat Cards ── */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsData.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                                    {/* Re-using the SVG children but styling the container */}
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 leading-tight">
                                {typeof stat.value === "number" ? stat.value : stat.value}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                        </div>
                    ))}
                </section>

                {/* ── Search Bar + Filter Tabs ── */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative w-full md:max-w-md">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 w-full md:w-auto overflow-x-auto scrollbar-hide">
                        {["All", "Active", "Completed"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
                                        ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Project Cards Grid ── */}
                {(() => {
                    // Filter by tab
                    let filtered = orders;
                    if (activeTab === "Active") {
                        filtered = filtered.filter((o) => {
                            const s = (o.status || "").toLowerCase();
                            return ["in progress", "pending", "in review", "confirmed", "fabric ordered", "ready to deliver"].includes(s);
                        });
                    } else if (activeTab === "Completed") {
                        filtered = filtered.filter((o) => (o.status || "").toLowerCase() === "completed");
                    }
                    // Filter by search
                    if (searchTerm.trim()) {
                        const q = searchTerm.toLowerCase();
                        filtered = filtered.filter((o) =>
                            (o.name || "").toLowerCase().includes(q) ||
                            (o.client || o.customerName || "").toLowerCase().includes(q) ||
                            (o.category || "").toLowerCase().includes(q) ||
                            (o.id || "").toLowerCase().includes(q)
                        );
                    }

                    const totalFiltered = filtered.length;
                    const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
                    const safePage = Math.min(currentPage, totalPages);
                    const paginatedItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

                    if (filtered.length === 0) {
                        return (
                            <div className="flex flex-col items-center justify-center py-16 px-5 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm mt-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 9h18M9 21V9" />
                                    </svg>
                                </div>
                                <p className="text-gray-900 text-lg font-bold">No projects found</p>
                                <p className="text-gray-500 text-sm mt-1 text-center max-w-sm">
                                    {searchTerm ? "Try adjusting your search terms" : "No projects match the selected filter"}
                                </p>
                            </div>
                        );
                    }

                    return (
                        <>
                            {/* Results count */}
                            <div className="flex items-center justify-between mb-4 px-1">
                                <p className="text-sm text-gray-500">
                                    Showing <span className="font-semibold text-gray-900">{(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, totalFiltered)}</span> of <span className="font-semibold text-gray-900">{totalFiltered}</span> projects
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedItems.map((project) => {
                                    const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES["Pending"];
                                    const progressColor = project.progress >= 100 ? "bg-green-500" : project.progress >= 60 ? "bg-purple-500" : "bg-blue-500";
                                    const formattedValue = project.value >= 1000 ? `Rs ${(project.value / 1000).toFixed(0)}K` : `Rs ${(project.value || 0).toLocaleString()}`;

                                    return (
                                        <div key={project.id} className="do-card bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">

                                            {/* Card Header: Thumbnail + Title + Menu */}
                                            <div className="flex items-start gap-3 mb-4">
                                                <img
                                                    src={project.thumbnail}
                                                    alt={project.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-gray-900 text-base font-bold truncate">
                                                        {project.name}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm truncate mt-0.5">
                                                        {project.client || project.customerName}
                                                    </p>
                                                </div>
                                                {/* 3-dot menu + Status dropdown */}
                                                <div className="relative shrink-0">
                                                    <button
                                                        onClick={() => setStatusDropdown(statusDropdown === project.id ? null : project.id)}
                                                        className={`p-1.5 rounded-lg transition-colors ${statusDropdown === project.id ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="5" r="1.5" />
                                                            <circle cx="12" cy="12" r="1.5" />
                                                            <circle cx="12" cy="19" r="1.5" />
                                                        </svg>
                                                    </button>

                                                    {/* Status dropdown */}
                                                    {statusDropdown === project.id && (
                                                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-100 rounded-xl p-1.5 min-w-[160px] shadow-lg z-50">
                                                            <p className="text-gray-400 text-[10px] font-bold px-2.5 py-1.5 uppercase tracking-wider">
                                                                Update Status
                                                            </p>
                                                            {STATUS_OPTIONS.map((opt) => {
                                                                const optStyle = STATUS_STYLES[opt] || STATUS_STYLES["Pending"];
                                                                const isActive = project.status === opt;
                                                                return (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => handleStatusUpdate(project.id, opt)}
                                                                        className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm transition-colors text-left ${isActive ? `${optStyle.bg} ${optStyle.text} font-bold` : "text-gray-600 font-medium hover:bg-gray-50"
                                                                            }`}
                                                                    >
                                                                        <span className={`w-2 h-2 rounded-full shrink-0 ${optStyle.dot}`} />
                                                                        {opt}
                                                                        {isActive && (
                                                                            <svg className={`w-4 h-4 ml-auto ${optStyle.text}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order ID + Category badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-gray-500 text-xs font-medium">
                                                    {project.id}
                                                </span>
                                                <span className="text-gray-300 text-xs">•</span>
                                                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                                                    {project.category}
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-5 h-10">
                                                {project.description}
                                            </p>

                                            {/* Progress bar */}
                                            <div className="mb-5 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                                <div className="flex justify-between mb-2 items-center">
                                                    <span className="text-gray-600 text-xs font-medium">Progress</span>
                                                    <span className={`text-xs font-bold ${progressColor.replace('bg-', 'text-')}`}>{project.progress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats row: Designs, Value */}
                                            <div className="flex items-center gap-5 mb-5 px-1">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                    </svg>
                                                    <span className="text-gray-500 text-xs">Designs:</span>
                                                    <span className="text-gray-900 text-xs font-bold">{project.designs}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                                                    </svg>
                                                    <span className="text-gray-500 text-xs">Value:</span>
                                                    <span className="text-gray-900 text-xs font-bold">{formattedValue}</span>
                                                </div>
                                            </div>

                                            {/* Due date + Status badge */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-1.5 text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                    <span className="text-xs font-medium">Due: <span className="text-gray-900 font-bold">{project.due}</span></span>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusStyle.bg}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                                    <span className={`text-[11px] font-bold ${statusStyle.text}`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2">
                                                <button onClick={() => setSelectedProject(project)} className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-2.5 px-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View Project
                                                </button>
                                                <button onClick={() => window.location.href = `mailto:${project.clientEmail || ''}?subject=Regarding%20Project%20${project.id}%20-%20${encodeURIComponent(project.name || '')}`} className="flex justify-center items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all border border-gray-200">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    Message
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-10">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={safePage === 1}
                                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${safePage === 1
                                                ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                                                : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Prev
                                    </button>

                                    <div className="flex gap-1.5">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${safePage === i + 1
                                                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                                        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={safePage === totalPages}
                                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${safePage === totalPages
                                                ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                                                : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                                            }`}
                                    >
                                        Next
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    );
                })()}
            </main>

            {/* ── Project Detail Modal ── */}
            {selectedProject && (() => {
                const sp = selectedProject;
                const spStatus = STATUS_STYLES[sp.status] || STATUS_STYLES["Pending"];
                const spProgress = sp.progress >= 100 ? "bg-green-500" : sp.progress >= 60 ? "bg-purple-500" : "bg-blue-500";
                const spValue = sp.value >= 1000 ? `Rs ${(sp.value / 1000).toFixed(0)}K` : `Rs ${(sp.value || 0).toLocaleString()}`;
                return (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
                        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="relative">
                                <img src={sp.thumbnail} alt={sp.name} className="w-full h-48 object-cover rounded-t-3xl" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl" />
                                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all">
                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-4 left-5 right-5">
                                    <h2 className="text-white text-xl font-bold drop-shadow-sm">{sp.name}</h2>
                                    <p className="text-white/80 text-sm mt-0.5">{sp.client || sp.customerName}</p>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">
                                {/* ID + Category + Status */}
                                <div className="flex items-center flex-wrap gap-2">
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">{sp.id}</span>
                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">{sp.category}</span>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${spStatus.bg}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${spStatus.dot}`} />
                                        <span className={`text-[11px] font-bold ${spStatus.text}`}>{sp.status}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-1">Description</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{sp.description || "No description provided."}</p>
                                </div>

                                {/* Progress */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex justify-between mb-2 items-center">
                                        <span className="text-gray-700 text-sm font-semibold">Progress</span>
                                        <span className={`text-sm font-bold ${spProgress.replace('bg-', 'text-')}`}>{sp.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-700 ${spProgress}`} style={{ width: `${sp.progress}%` }} />
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                                        <p className="text-lg font-bold text-purple-700">{sp.designs}</p>
                                        <p className="text-[11px] text-purple-500 font-medium">Designs</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                        <p className="text-lg font-bold text-emerald-700">{spValue}</p>
                                        <p className="text-[11px] text-emerald-500 font-medium">Value</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                                        <p className="text-lg font-bold text-blue-700">{sp.due}</p>
                                        <p className="text-[11px] text-blue-500 font-medium">Due Date</p>
                                    </div>
                                </div>

                                {/* Close button */}
                                <button onClick={() => setSelectedProject(null)} className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors text-sm">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
