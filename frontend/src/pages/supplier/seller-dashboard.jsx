import Navbar from "../../components/common/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ──  existing AuthContext 
import { useAuth } from "../../context/AuthContext";
// ── Firebase ─────────────────────────────────────────────────
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";
// ─────────────────────────────────────────────────────────────
// Static UI data
// ─────────────────────────────────────────────────────────────
const quickActions = [
  {
    label: "Fabric Marketplace",
    desc: "Browse 500+ verified suppliers",
    route: "/shop",
    iconBg: "bg-purple-100",
    icon: (
      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path strokeWidth="2" d="M3 6h18" />
        <path strokeWidth="2" d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: "Find Tailors",
    desc: "1,200+ skilled professionals",
    route: "/tailors",
    iconBg: "bg-violet-100",
    icon: (
      <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="6" cy="6" r="3" strokeWidth="2" />
        <circle cx="6" cy="18" r="3" strokeWidth="2" />
        <line x1="20" x2="8.12" y1="4" y2="15.88" strokeWidth="2" />
        <line x1="14.47" x2="20" y1="14.48" y2="20" strokeWidth="2" />
        <line x1="8.12" x2="12" y1="8.12" y2="12" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Find Designers",
    desc: "Creative talent across Sri Lanka",
    route: "/designers",
    iconBg: "bg-rose-100",
    icon: (
      <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" strokeWidth="2" />
        <path strokeWidth="2" d="M8.5 14.5A6 6 0 003 20h18a6 6 0 00-5.5-5.5" />
      </svg>
    ),
  },
  {
    label: "AI Smart Match",
    desc: "Get personalised recommendations",
    route: "/match",
    iconBg: "bg-purple-50",
    icon: (
      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
  },
];
const FOOTER_LINKS = {
  Platform: ["Fabric Marketplace", "Find Tailors", "AI Recommendations", "Order Tracking", "Join as Supplier"],
  "For Business": ["List Your Fabrics", "Tailor Registration", "Designer Portal", "Bulk Orders", "Enterprise Solutions"],
};
// Matches the status strings your seed data uses
const statusColours = {
  "Confirmed":        "bg-blue-100 text-blue-600",
  "In Production":    "bg-orange-100 text-orange-600",
  "Fabric Ordered":   "bg-indigo-100 text-indigo-600",
  "Ready to Deliver": "bg-purple-100 text-purple-600",
  "Shipped":          "bg-cyan-100 text-cyan-600",
  "Completed":        "bg-green-100 text-green-600",
};
// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const navigate    = useNavigate();
  // user.name, user.email, user.role, user.uid — all from AuthContext
  const { user }    = useAuth();
  // Extra Firestore fields not in AuthContext (logoUrl, shopName, isOpen)
  const [sellerProfile, setSellerProfile] = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [stats,    setStats]    = useState({
    active: 0, inProduction: 0, readyToDeliver: 0, completed: 0,
  });
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);
  // Redirect non-sellers away from this page
  useEffect(() => {
    if (user && user.role !== "seller") {
      navigate("/");
    }
  }, [user, navigate]);
  // Firestore reads — runs once when user is available
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const uid = user.uid;
        // ── READ sellers.doc(uid) → shopName, logoUrl, isOpen ──
        const sellerSnap = await getDoc(doc(db, "sellers", uid));
        if (sellerSnap.exists()) {
          setSellerProfile(sellerSnap.data());
        }
        // ── READ orders where sellerId == uid ──────────────────
        const ordersSnap = await getDocs(
          query(collection(db, "orders"), where("sellerId", "==", uid))
        );
        const allOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        <Navbar />
        // Count by status for the stats cards
        setStats({
          active: allOrders.filter((o) =>
            ["Confirmed", "In Production", "Fabric Ordered", "Ready to Deliver", "Shipped"].includes(o.status)
          ).length,
          inProduction:   allOrders.filter((o) => o.status === "In Production").length,
          readyToDeliver: allOrders.filter((o) => o.status === "Ready to Deliver").length,
          completed:      allOrders.filter((o) => o.status === "Completed").length,
        });
        // Sort newest first, keep the 3 most recent for the table
        const sorted = [...allOrders].sort((a, b) => {
          const toMs = (v) => v?.toDate?.().getTime() ?? new Date(v ?? 0).getTime();
          return toMs(b.createdAt) - toMs(a.createdAt);
        });
        setOrders(sorted.slice(0, 3));
        // ── READ tailors orderBy rating desc limit 2 ───────────
        const tailorsSnap = await getDocs(
          query(collection(db, "tailors"), orderBy("rating", "desc"), limit(2))
        );
        setTopRated(tailorsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("SellerDashboard fetch error:", err);
        setError("Could not load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  // Helper — format Firestore Timestamp or ISO string
  const formatDate = (raw) => {
    if (!raw) return "";
    const d = raw?.toDate ? raw.toDate() : new Date(raw);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  // Display name priority: Firestore shopName → AuthContext user.name → email
  const displayName  = sellerProfile?.shopName || user?.name || user?.email || "Seller";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const statsData = [
    {
      label: "Active Orders", value: stats.active,
      color: "text-purple-700", bg: "bg-purple-50",
      icon: <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M12 6v6l4 2" /></svg>,
    },
    {
      label: "In Production", value: stats.inProduction,
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
  // ── Loading / error screens ───────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading your dashboard…</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow text-center max-w-sm">
        <p className="text-red-500 font-semibold mb-3">⚠️ {error}</p>
        <button onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700">
          Retry
        </button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

 
      <div className="bg-purple-600 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {sellerProfile?.logoUrl ? (
            <img src={sellerProfile.logoUrl} alt="Shop logo"
              className="w-12 h-12 rounded-2xl object-cover shadow-lg" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl shadow-lg">
              {avatarLetter}
            </div>
          )}
          <div>
            <p className="text-purple-200 text-sm">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},
            </p>
            {/* displayName uses same user object as Navbar */}
            <p className="text-white font-bold text-xl leading-tight">{displayName}</p>
            <span className="inline-block mt-1 text-xs bg-purple-500 text-white px-2.5 py-0.5 rounded-full font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>
        <button onClick={() => navigate("/seller-shop")}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          My Profile
        </button>
      </div>
      {/* Your existing <Navbar /> is rendered by the router — no duplicate here */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

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

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button key={action.label} onClick={() => navigate(action.route)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all text-left group">
                <div className={`w-12 h-12 rounded-2xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <p className="font-bold text-gray-900 text-sm">{action.label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">{action.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                </svg>
                <h2 className="font-bold text-gray-900">Recent Orders</h2>
              </div>
              {/* /orders matches the Orders link in your Navbar dropdown */}
              <button onClick={() => navigate("/orders")}
                className="text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">No orders yet.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{order.orderId || order.id}</p>
                        <p className="text-xs text-gray-500">
                          {order.itemName || order.item || "Order"} · {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColours[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                      <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                        LKR {Number(order.total ?? order.totalAmount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={() => navigate("/orders")}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-purple-600 font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Order History & Track Orders
              </button>
            </div>
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* AI Match — /ai-match matches your Navbar AI Match link */}
            <div className="bg-purple-600 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500 rounded-full opacity-50" />
              <div className="absolute -right-2 -top-4 w-16 h-16 bg-purple-400 rounded-full opacity-30" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-1">Try AI Smart Match</h3>
                <p className="text-purple-200 text-sm mb-4 leading-snug">
                  Get AI-powered fabric and tailor recommendations for your project.
                </p>
                <button onClick={() => navigate("/match")}
                  className="w-full bg-white text-purple-600 font-bold py-2.5 rounded-xl text-sm hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  Get Recommendations
                </button>
              </div>
            </div>
            {/* Top Rated — from tailors collection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                  <path d="M13 2L15.09 8.26L22 9L17 13.74L18.18 21L13 17.77L7.82 21L9 13.74L4 9L10.91 8.26L13 2Z" />
                </svg>
                <h3 className="font-bold text-gray-900 text-sm">Top Rated This Week</h3>
              </div>
              {topRated.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-400 text-sm">No data yet.</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {topRated.map((tailor) => {
                    const tailorName   = tailor.name || tailor.shopName || "Tailor";
                    const avatarColors = ["bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-emerald-500"];
                    const color        = avatarColors[tailorName.charCodeAt(0) % avatarColors.length];
                    return (
                      <div key={tailor.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          {tailor.photoUrl ? (
                            <img src={tailor.photoUrl} alt={tailorName} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-sm font-bold`}>
                              {tailorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{tailorName}</p>
                            <p className="text-xs text-gray-500">{tailor.specialty || tailor.skills?.[0] || "Tailor"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                          </svg>
                          <span className="text-sm font-bold text-gray-800">
                            {tailor.rating ? Number(tailor.rating).toFixed(1) : "N/A"}
                          </span>
                        </div>
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
