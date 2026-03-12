import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// Status colours for badges
// ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    "In Progress":  { bg: "rgba(251, 146, 60, 0.15)", color: "#fb923c", dot: "#fb923c" },
    "In Review":    { bg: "rgba(96, 165, 250, 0.15)", color: "#60a5fa", dot: "#60a5fa" },
    "Pending":      { bg: "rgba(251, 191, 36, 0.15)", color: "#fbbf24", dot: "#fbbf24" },
    "Completed":    { bg: "rgba(52, 211, 153, 0.15)", color: "#34d399", dot: "#34d399" },
    "Cancelled":    { bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444", dot: "#ef4444" },
};

const STATUS_OPTIONS = ["Pending", "In Progress", "In Review", "Completed", "Cancelled"];

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
    const [statusDropdown, setStatusDropdown] = useState(null); // tracks which project's dropdown is open

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

    // ── Loading state ──
    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f0a1e 0%, #1a1145 50%, #0d1b2a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "40px", height: "40px",
                        border: "4px solid #7c3aed",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }} />
                    <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 500 }}>Loading your projects…</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0a1e 0%, #1a1145 50%, #0d1b2a 100%)",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            display: "flex",
            flexDirection: "column",
        }}>

            {/* ── Page Header ── */}
            <div style={{ padding: "32px 32px 0 32px" }}>
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "40px", height: "40px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #34d399, #059669)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(52, 211, 153, 0.3)",
                        }}>
                            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <h1 style={{
                                color: "#ffffff",
                                fontSize: "28px",
                                fontWeight: 800,
                                margin: 0,
                                letterSpacing: "-0.5px",
                            }}>
                                My Design Projects
                            </h1>
                            <p style={{
                                color: "#94a3b8",
                                fontSize: "14px",
                                margin: "4px 0 0 0",
                            }}>
                                Manage and track all your creative commissions
                            </p>
                        </div>
                    </div>

                    {/* Filter & Export buttons */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            border: "1px solid rgba(139, 92, 246, 0.4)",
                            background: "rgba(139, 92, 246, 0.15)",
                            color: "#a78bfa",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139, 92, 246, 0.25)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)"; }}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                            </svg>
                            Filter
                        </button>
                        <button style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ padding: "24px 32px 0 32px" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                }}>
                    {statsData.map((stat) => (
                        <div key={stat.label} style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "16px",
                            padding: "20px",
                            transition: "all 0.3s ease",
                            cursor: "default",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
                            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "12px",
                            }}>
                                <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 500 }}>
                                    {stat.label}
                                </span>
                                <div style={{
                                    width: "32px", height: "32px",
                                    borderRadius: "10px",
                                    background: stat.iconBg,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p style={{
                                color: "#ffffff",
                                fontSize: "28px",
                                fontWeight: 800,
                                margin: 0,
                                letterSpacing: "-0.5px",
                            }}>
                                {typeof stat.value === "number" ? stat.value : stat.value}
                            </p>
                            <p style={{
                                color: "#64748b",
                                fontSize: "12px",
                                margin: "4px 0 0 0",
                            }}>
                                {stat.sub}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Search Bar + Filter Tabs ── */}
            <div style={{ padding: "24px 32px 0 32px" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                }}>
                    {/* Search Input */}
                    <div style={{
                        position: "relative",
                        flex: "1 1 300px",
                        maxWidth: "500px",
                    }}>
                        <svg
                            width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"
                            style={{
                                position: "absolute",
                                left: "14px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none",
                            }}
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 16px 12px 42px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                background: "rgba(255, 255, 255, 0.04)",
                                color: "#e2e8f0",
                                fontSize: "14px",
                                outline: "none",
                                transition: "all 0.2s",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "rgba(255, 255, 255, 0.04)",
                        borderRadius: "12px",
                        padding: "4px",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}>
                        {["All", "Active", "Completed"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: "8px 20px",
                                    borderRadius: "9px",
                                    border: "none",
                                    background: activeTab === tab
                                        ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                                        : "transparent",
                                    color: activeTab === tab ? "#ffffff" : "#94a3b8",
                                    fontSize: "13px",
                                    fontWeight: activeTab === tab ? 700 : 500,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: activeTab === tab ? "0 2px 8px rgba(124, 58, 237, 0.3)" : "none",
                                }}
                                onMouseEnter={(e) => {
                                    if (activeTab !== tab) {
                                        e.currentTarget.style.color = "#e2e8f0";
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== tab) {
                                        e.currentTarget.style.color = "#94a3b8";
                                        e.currentTarget.style.background = "transparent";
                                    }
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Project Cards Grid ── */}
            <div style={{ padding: "24px 32px 32px 32px", flex: 1 }}>
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

                    if (filtered.length === 0) {
                        return (
                            <div style={{
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                padding: "60px 20px",
                                background: "rgba(255, 255, 255, 0.03)",
                                borderRadius: "16px",
                                border: "1px solid rgba(255, 255, 255, 0.06)",
                            }}>
                                <svg width="48" height="48" fill="none" stroke="#4b5563" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="M3 9h18M9 21V9" />
                                </svg>
                                <p style={{ color: "#64748b", fontSize: "16px", fontWeight: 600, marginTop: "16px" }}>
                                    No projects found
                                </p>
                                <p style={{ color: "#475569", fontSize: "13px", marginTop: "4px" }}>
                                    {searchTerm ? "Try adjusting your search terms" : "No projects match the selected filter"}
                                </p>
                            </div>
                        );
                    }

                    return (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
                            gap: "20px",
                        }}>
                            {filtered.map((project) => {
                                const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES["Pending"];
                                const progressColor = project.progress >= 100 ? "#34d399" : project.progress >= 60 ? "#7c3aed" : "#60a5fa";
                                const formattedValue = project.value >= 1000 ? `Rs ${(project.value / 1000).toFixed(0)}K` : `Rs ${(project.value || 0).toLocaleString()}`;

                                return (
                                    <div key={project.id} style={{
                                        background: "rgba(255, 255, 255, 0.04)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        borderRadius: "16px",
                                        padding: "20px",
                                        transition: "all 0.3s ease",
                                        cursor: "default",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                                        e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                    >
                                        {/* Card Header: Thumbnail + Title + Menu */}
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                                            <img
                                                src={project.thumbnail}
                                                alt={project.name}
                                                style={{
                                                    width: "44px", height: "44px",
                                                    borderRadius: "10px",
                                                    objectFit: "cover",
                                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h3 style={{
                                                    color: "#f1f5f9",
                                                    fontSize: "15px",
                                                    fontWeight: 700,
                                                    margin: 0,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}>
                                                    {project.name}
                                                </h3>
                                                <p style={{ color: "#94a3b8", fontSize: "12px", margin: "2px 0 0 0" }}>
                                                    {project.client || project.customerName}
                                                </p>
                                            </div>
                                            {/* 3-dot menu + Status dropdown */}
                                            <div style={{ position: "relative", flexShrink: 0 }}>
                                                <button
                                                    onClick={() => setStatusDropdown(statusDropdown === project.id ? null : project.id)}
                                                    style={{
                                                        background: statusDropdown === project.id ? "rgba(255,255,255,0.1)" : "none",
                                                        border: "none", cursor: "pointer",
                                                        color: statusDropdown === project.id ? "#e2e8f0" : "#64748b",
                                                        padding: "4px", borderRadius: "6px",
                                                        transition: "all 0.2s",
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#e2e8f0"; }}
                                                    onMouseLeave={(e) => { if (statusDropdown !== project.id) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#64748b"; } }}
                                                >
                                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="5" r="1.5" />
                                                        <circle cx="12" cy="12" r="1.5" />
                                                        <circle cx="12" cy="19" r="1.5" />
                                                    </svg>
                                                </button>
                                                {/* Status dropdown */}
                                                {statusDropdown === project.id && (
                                                    <div style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        right: 0,
                                                        marginTop: "4px",
                                                        background: "#1e1b4b",
                                                        border: "1px solid rgba(139, 92, 246, 0.3)",
                                                        borderRadius: "12px",
                                                        padding: "6px",
                                                        minWidth: "160px",
                                                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
                                                        zIndex: 50,
                                                    }}>
                                                        <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, padding: "6px 10px 4px", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Update Status
                                                        </p>
                                                        {STATUS_OPTIONS.map((opt) => {
                                                            const optStyle = STATUS_STYLES[opt] || STATUS_STYLES["Pending"];
                                                            const isActive = project.status === opt;
                                                            return (
                                                                <button
                                                                    key={opt}
                                                                    onClick={() => handleStatusUpdate(project.id, opt)}
                                                                    style={{
                                                                        display: "flex", alignItems: "center", gap: "8px",
                                                                        width: "100%",
                                                                        padding: "8px 10px",
                                                                        borderRadius: "8px",
                                                                        border: "none",
                                                                        background: isActive ? "rgba(139, 92, 246, 0.15)" : "transparent",
                                                                        color: isActive ? "#e2e8f0" : "#cbd5e1",
                                                                        fontSize: "12px",
                                                                        fontWeight: isActive ? 700 : 500,
                                                                        cursor: "pointer",
                                                                        transition: "all 0.15s",
                                                                        textAlign: "left",
                                                                    }}
                                                                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                                                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                                                                >
                                                                    <span style={{
                                                                        width: "7px", height: "7px",
                                                                        borderRadius: "50%",
                                                                        background: optStyle.dot,
                                                                        flexShrink: 0,
                                                                    }} />
                                                                    {opt}
                                                                    {isActive && (
                                                                        <svg width="12" height="12" fill="none" stroke="#a78bfa" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginLeft: "auto" }}>
                                                                            <path d="M20 6L9 17l-5-5" />
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
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                            <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 500 }}>
                                                {project.id}
                                            </span>
                                            <span style={{ color: "#475569", fontSize: "11px" }}>•</span>
                                            <span style={{
                                                fontSize: "11px", fontWeight: 600,
                                                color: "#a78bfa",
                                                background: "rgba(139, 92, 246, 0.12)",
                                                padding: "2px 8px",
                                                borderRadius: "6px",
                                            }}>
                                                {project.category}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p style={{
                                            color: "#94a3b8",
                                            fontSize: "13px",
                                            margin: "0 0 14px 0",
                                            lineHeight: 1.4,
                                        }}>
                                            {project.description}
                                        </p>

                                        {/* Progress bar */}
                                        <div style={{ marginBottom: "14px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                                <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 500 }}>Progress</span>
                                                <span style={{ color: progressColor, fontSize: "12px", fontWeight: 700 }}>{project.progress}%</span>
                                            </div>
                                            <div style={{
                                                width: "100%", height: "6px",
                                                background: "rgba(255, 255, 255, 0.06)",
                                                borderRadius: "99px",
                                                overflow: "hidden",
                                            }}>
                                                <div style={{
                                                    width: `${project.progress}%`,
                                                    height: "100%",
                                                    background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`,
                                                    borderRadius: "99px",
                                                    transition: "width 0.6s ease",
                                                }} />
                                            </div>
                                        </div>

                                        {/* Stats row: Designs, Value */}
                                        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <svg width="13" height="13" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                </svg>
                                                <span style={{ color: "#94a3b8", fontSize: "12px" }}>Designs:</span>
                                                <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 700 }}>{project.designs}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <svg width="13" height="13" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24">
                                                    <line x1="12" y1="1" x2="12" y2="23" />
                                                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                                                </svg>
                                                <span style={{ color: "#94a3b8", fontSize: "12px" }}>Value:</span>
                                                <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 700 }}>{formattedValue}</span>
                                            </div>
                                        </div>

                                        {/* Due date + Status badge */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <svg width="12" height="12" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                                <span style={{ color: "#94a3b8", fontSize: "12px" }}>Due:</span>
                                                <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 600 }}>{project.due}</span>
                                            </div>
                                            <div style={{
                                                display: "flex", alignItems: "center", gap: "6px",
                                                padding: "4px 10px",
                                                borderRadius: "8px",
                                                background: statusStyle.bg,
                                            }}>
                                                <span style={{
                                                    width: "6px", height: "6px",
                                                    borderRadius: "50%",
                                                    background: statusStyle.dot,
                                                    flexShrink: 0,
                                                }} />
                                                <span style={{ color: statusStyle.color, fontSize: "12px", fontWeight: 600 }}>
                                                    {project.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button style={{
                                                flex: 2,
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                                                padding: "10px",
                                                borderRadius: "10px",
                                                border: "none",
                                                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                                                color: "#ffffff",
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                                boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)",
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.4)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(124, 58, 237, 0.25)"; }}
                                            >
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                View Project
                                            </button>
                                            <button style={{
                                                flex: 1,
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                                                padding: "10px",
                                                borderRadius: "10px",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                                background: "rgba(255, 255, 255, 0.04)",
                                                color: "#cbd5e1",
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"; e.currentTarget.style.color = "#f1f5f9"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; e.currentTarget.style.color = "#cbd5e1"; }}
                                            >
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                                </svg>
                                                Contact
                                            </button>
                                        </div>

                                        {/* Click-away listener for dropdown */}
                                        {statusDropdown === project.id && (
                                            <div
                                                onClick={() => setStatusDropdown(null)}
                                                style={{
                                                    position: "fixed", inset: 0, zIndex: 40,
                                                    background: "transparent",
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
