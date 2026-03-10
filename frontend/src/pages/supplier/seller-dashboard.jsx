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
    route: "/ai-match",
    iconBg: "bg-purple-50",
    icon: (
      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
  },
];
const footerLinks = {
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
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col"