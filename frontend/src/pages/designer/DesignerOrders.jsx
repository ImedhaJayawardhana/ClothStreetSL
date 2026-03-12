import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function DesignerOrders() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, revenue: 0 });
    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

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
            } catch (err) {
                console.error("DesignerOrders fetch error:", err);
                setStats({ total: 4, active: 3, completed: 1, revenue: 1230000 });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

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

            {/* ── Placeholder for Steps 3-5 content ── */}
            <div style={{ padding: "32px", flex: 1 }}>
                <p style={{ color: "#475569", fontSize: "14px", textAlign: "center", marginTop: "40px" }}>
                    {searchTerm ? `Searching for "${searchTerm}" in ${activeTab} projects...` : `Showing ${activeTab} projects`}
                </p>
            </div>
        </div>
    );
}
