import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders, getMyQuotations } from "../../api";
import { getTailorDashboard, updateTailorOrderStatus } from "../../api/tailor";
import { auth, db } from "../../firebase/firebase";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

// ─── Keep dummy data only for Earnings, Ratings, Reviews (needs backend later) ───
const DUMMY_EARNINGS = {
  total: "LKR 18,000",
  fromOrders: 1,
  growthPercent: 24,
};

const DUMMY_RATINGS = {
  average: 4.9,
  total: 407,
  breakdown: [
    { stars: 5, count: 312 },
    { stars: 4, count: 85 },
    { stars: 3, count: 8 },
    { stars: 2, count: 2 },
    { stars: 1, count: 0 },
  ],
};

const DUMMY_REVIEWS = [
  { id: 1, stars: 5, quote: "Absolutely stunning work! The wedding dress was exactly what I envisioned. The attention to detail is incredible.", name: "Shalini Fernando", daysAgo: 2 },
  { id: 2, stars: 5, quote: "Professional, punctual and the suits fit perfectly. Would highly recommend to anyone looking for quality tailoring.", name: "Ravi Wijesinghe", daysAgo: 7 },
  { id: 3, stars: 4, quote: "Great quality uniforms delivered on time. Minor stitching issue fixed promptly. Overall very satisfied.", name: "Chamara Bandara", daysAgo: 14 },
];

const STATUS_STYLES = {
  "in progress": "bg-blue-50 text-blue-600",
  "processing": "bg-blue-50 text-blue-600",
  "pending": "bg-slate-50 text-slate-500",
  "completed": "bg-blue-100 text-blue-700 font-bold",
  "cancelled": "bg-red-50 text-red-500",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-blue-100 transition-all duration-200">
      <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
        {stat.icon}
      </div>
      <p className="text-4xl font-extrabold text-slate-900 leading-none">{stat.value}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
    </div>
  );
}

// ─── Earnings Card ────────────────────────────────────────────────────────────
function EarningsCard({ data }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl" />
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />
        </svg>
        Total Earnings
      </div>
      <p className="text-4xl font-black text-slate-900 leading-tight tracking-tight relative z-10">{data.total}</p>
      <p className="text-sm text-slate-500 italic relative z-10">from {data.fromOrders} completed order{data.fromOrders !== 1 ? "s" : ""}</p>
      <div className="mt-auto flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 w-fit relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
        </svg>
        <span className="text-emerald-700 text-[11px] font-black uppercase tracking-tighter">+{data.growthPercent}% growth</span>
      </div>
    </div>
  );
}

// ─── Ratings Card ─────────────────────────────────────────────────────────────
function RatingsCard({ data }) {
  const maxCount = Math.max(...data.breakdown.map((b) => b.count), 1);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5 h-full hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-xs text-slate-500 uppercase tracking-widest">Ratings & Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill={s <= Math.round(data.average) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-slate-900 font-black text-sm">{data.average}</span>
          <span className="text-[11px] font-bold text-slate-400">({data.total})</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {data.breakdown.map((row) => (
          <div key={row.stars} className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 w-2 text-right">{row.stars}</span>
            <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${(row.count / maxCount) * 100}%` }} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900 w-8 text-right">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Active Orders Card ───────────────────────────────────────────────────────
function ActiveOrdersCard({ orders, loading, onStatusChange }) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-4">Active Collaborations</h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="h-2 bg-slate-100 rounded w-1/3" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-4">Active Collaborations</h2>
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 font-bold text-center">No active orders yet</p>
          <p className="text-xs text-slate-300 text-center">Orders from customers will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest">Active Collaborations</h2>
        <span className="text-xs font-bold text-slate-400">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="flex flex-col divide-y divide-slate-50">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-50 bg-blue-50 text-blue-600 transition-transform group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm text-slate-900 truncate">
                {order.items?.[0]?.name || "Order"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${STATUS_STYLES[order.status?.toLowerCase()] || "bg-slate-50 text-slate-600"}`}>
                {order.status}
              </span>
              <p className="font-black text-xs text-slate-900">
                LKR {order.total_price?.toLocaleString()}
              </p>
              {/* NEW: Status dropdown to change order status */}
              {onStatusChange && (
                <select
                  className="text-[10px] font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 cursor-pointer focus:outline-none focus:border-blue-400"
                  value={order.status?.toLowerCase() || "pending"}
                  onChange={(e) => onStatusChange(order.id, e.target.value, order.quotationId)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="tailoring">Tailoring</option>
                  <option value="tailoring_done">Tailoring Done</option>
                  <option value="shipped_to_customer">Shipped to Customer</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Order Requests Card ──────────────────────────────────────────────────────
function OrderRequestsCard({ requests, loading, onAccept, onDecline }) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-4">New Job Orders</h2>
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border border-slate-50 rounded-2xl animate-pulse space-y-3">
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-2 bg-slate-100 rounded w-1/3" />
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-slate-100 rounded-xl" />
                <div className="flex-1 h-8 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pendingRequests = requests ? requests.filter(r => r.status === "pending") : [];

  if (pendingRequests.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-4">New Job Orders</h2>
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 font-bold text-center">No new requests yet</p>
          <p className="text-xs text-slate-300 text-center">Quotation requests from customers will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest">New Job Orders</h2>
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100/50">
          {pendingRequests.length} Pending
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {pendingRequests.map((req) => (
          <div key={req.id} className="flex flex-col gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-sm text-slate-900">{req.description}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                  Fabric ID: {req.fabric_id || "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-emerald-600">
                  LKR {req.price?.toLocaleString()}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                  {req.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {req.status === "pending" ? (
                <>
                  <button
                    onClick={() => onAccept(req.id)}
                    className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm"
                  >
                    Send Quote
                  </button>
                  <button
                    onClick={() => onDecline(req.id)}
                    className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all"
                  >
                    Decline
                  </button>
                </>
              ) : (
                <span className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest text-center border border-emerald-100/50">
                  ✓ {req.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-all">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill={s <= review.stars ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <p className="text-sm font-bold text-slate-600 italic leading-relaxed flex-1">&ldquo;{review.quote}&rdquo;</p>
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black flex items-center justify-center border border-blue-100/50">
            {review.name.charAt(0)}
          </div>
          <span className="font-extrabold text-xs text-slate-900">{review.name}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {review.daysAgo === 1 ? "Yesterday" : `${review.daysAgo}d ago`}
        </span>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function TailorDashboard() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  // ── State ──
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [quotationsLoading, setQuotationsLoading] = useState(true);

  // Stats derived from real orders
  const [statCounts, setStatCounts] = useState({
    active: 0,
    inProgress: 0,
    readyToDeliver: 0,
    completed: 0,
    revenue: 0,
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [_dashboardLoading, setDashboardLoading] = useState(true);
  const [_dashboardError, setDashboardError] = useState("");

  // ── Fetch real orders ──
  useEffect(() => {
    if (!authUser?.uid) return;

    // Fetch ASSIGNED orders (where tailor is the provider, not the customer)
    const fetchAssignedOrders = async () => {
      try {
        const uid = authUser.uid;
        const [snap1, snap2] = await Promise.all([
          getDocs(query(collection(db, "orders"), where("tailorId", "==", uid))),
          getDocs(query(collection(db, "orders"), where("providerId", "==", uid))),
        ]);

        const seenIds = new Set();
        const assignedOrders = [];
        [...snap1.docs, ...snap2.docs].forEach((d) => {
          if (!seenIds.has(d.id)) {
            seenIds.add(d.id);
            assignedOrders.push({ id: d.id, ...d.data() });
          }
        });

        // Sort descending by creation date
        assignedOrders.sort((a, b) => {
          const tA = a.created_at?.toMillis ? a.created_at.toMillis() : new Date(a.created_at || 0).getTime();
          const tB = b.created_at?.toMillis ? b.created_at.toMillis() : new Date(b.created_at || 0).getTime();
          return tB - tA;
        });

        setOrders(assignedOrders);

        const counts = { active: 0, inProgress: 0, readyToDeliver: 0, completed: 0, revenue: 0 };
        assignedOrders.forEach((o) => {
          const s = (o.status || "").toLowerCase();
          if (["pending", "confirmed", "in review", "accepted"].includes(s)) counts.active++;
          if (["processing", "in_progress", "tailoring"].includes(s)) counts.inProgress++;
          if (["tailoring_done", "shipped_to_customer", "ready to deliver"].includes(s)) counts.readyToDeliver++;
          if (["completed", "delivered"].includes(s)) {
            counts.completed++;
            counts.revenue += Number(o.total_price || o.total || o.price || 0);
          }
        });
        setStatCounts(counts);
      } catch (err) {
        console.error("Assigned orders fetch error:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchAssignedOrders();

    // Fetch quotations
    getMyQuotations()
      .then((res) => setQuotations(res.data || []))
      .catch((err) => console.error("Quotations fetch error:", err))
      .finally(() => setQuotationsLoading(false));

  }, [authUser]);

  // ── NEW: Fetch dashboard data from backend API ──
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!auth.currentUser) return;
        const token = await auth.currentUser.getIdToken();
        const data = await getTailorDashboard(token);
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setDashboardError("Failed to load dashboard data");
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboard();
  }, [authUser]);

  // ── Handler to update order status via API and sync linked quotation ──
  const handleOrderStatusChange = async (orderId, newStatus, quotationId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await updateTailorOrderStatus(orderId, newStatus, token);

      // Update local order state
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
      );

      // ── Sync the linked quotation so customer Order Tracking updates ──
      // The backend already does this, but sync from frontend too as a fallback
      const orderToQuotationStatus = {
        pending:             "accepted",
        in_progress:         "tailoring",
        tailoring:           "tailoring",
        tailoring_done:      "tailoring_done",
        shipped_to_customer: "shipped_to_customer",
        delivered:           "delivered",
        completed:           "completed",
        cancelled:           "cancelled",
      };
      const qStatus = orderToQuotationStatus[newStatus];
      // Find quotationId from the order if not passed directly
      const order = orders.find((o) => o.id === orderId);
      const qId = quotationId || order?.quotationId;
      if (qId && qStatus) {
        await updateDoc(doc(db, "quotations", qId), { status: qStatus });
      }

      toast.success(`Order status updated to "${newStatus.replace(/_/g, " ")}".`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update order status. Please try again.");
    }
  };



  // ── Accept / Decline quotation handlers ──
  const handleAccept = (quotationId) => {
    // Instead of accepting directly, navigate to the response page to provide price/deadline
    navigate(`/quotation-response/${quotationId}`);
  };

  const handleDecline = async (quotationId) => {
    try {
      const { updateQuotationStatus } = await import("../../api");
      await updateQuotationStatus(quotationId, "completed"); // or a "declined" status
      setQuotations((prev) => prev.filter((q) => q.id !== quotationId));
    } catch (err) {
      console.error("Decline error:", err);
    }
  };

  // ── Stat cards config ── (NEW: use real API data when available)
  const stats = [
    {
      id: 1, label: "Active Orders", value: dashboardData ? dashboardData.activeOrders : statCounts.active,
      color: "text-blue-600", bg: "bg-blue-50",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
    },
    {
      id: 2, label: "Pending", value: dashboardData ? dashboardData.pendingOrders : statCounts.inProgress,
      color: "text-blue-600", bg: "bg-blue-50",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" /></svg>,
    },
    {
      id: 3, label: "Total Orders", value: dashboardData ? dashboardData.totalOrders : (statCounts.active + statCounts.inProgress + statCounts.readyToDeliver + statCounts.completed),
      color: "text-emerald-600", bg: "bg-emerald-50",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" /><line x1="23" x2="23" y1="13" y2="11" /><polyline points="11 6 7 12 13 12 9 18" /></svg>,
    },
    {
      id: 4, label: "Completed", value: dashboardData ? dashboardData.completedOrders : statCounts.completed,
      color: "text-blue-600", bg: "bg-blue-50",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    },
  ];

  const displayName = authUser?.name || authUser?.email || "Tailor";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const pendingCount = quotations.filter((q) => q.status === "pending").length;

  return (
    <div className="min-h-screen font-sans flex flex-col bg-white">

      {/* ── Sticky Header ── */}
      <div className="px-6 py-5 flex items-center justify-between border-b bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/20">
            {avatarLetter}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"}
            </p>
            <p className="font-extrabold text-2xl text-slate-900 leading-tight">{displayName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-black bg-slate-100 text-slate-600 uppercase tracking-widest border border-slate-200/50">
                Master Tailor
              </span>
              {pendingCount > 0 && (
                <span className="inline-block text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm shadow-blue-200">
                  {pendingCount} New Request{pendingCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/tailor-profile")}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-900 transition-all shadow-sm"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          Tailor Settings
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              stat={{
                ...stat,
                value: ordersLoading
                  ? <span className="inline-block w-8 h-6 rounded animate-pulse bg-slate-100" />
                  : stat.value,
              }}
            />
          ))}
        </div>

        {/* ── Earnings + Ratings ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EarningsCard data={{
            total: `LKR ${(statCounts.revenue || 0).toLocaleString()}`,
            fromOrders: statCounts.completed || 0,
            growthPercent: statCounts.completed > 0 ? 100 : 0
          }} />
          {/* NEW: Use real ratings from API when available, fallback to dummy */}
          <RatingsCard data={dashboardData ? {
            average: dashboardData.averageRating || DUMMY_RATINGS.average,
            total: dashboardData.totalReviews || DUMMY_RATINGS.total,
            breakdown: DUMMY_RATINGS.breakdown,
          } : DUMMY_RATINGS} />
        </div>

        {/* ── Quotation Inbox Hook ── */}
        <div
          onClick={() => navigate("/quotation-inbox")}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-lg text-white uppercase tracking-tight">Active Quotation Requests</h3>
              <p className="text-slate-400 text-sm font-bold">
                {quotationsLoading ? "Loading..." : `${pendingCount} pending request${pendingCount !== 1 ? "s" : ""} to review`}
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all group-hover:bg-white group-hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        {/* ── Requests + Active Orders ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OrderRequestsCard
            requests={quotations}
            loading={quotationsLoading}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
          <ActiveOrdersCard
            orders={orders}
            loading={ordersLoading}
            onStatusChange={handleOrderStatusChange}
          />
        </div>

        {/* ── Reviews — NEW: Use real reviews from API when available ── */}
        <div className="flex flex-col gap-6">
          <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest">Customer Feedback</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(dashboardData?.recentReviews?.length > 0
              ? dashboardData.recentReviews.map((r) => (
                <ReviewCard key={r.id} review={{
                  id: r.id,
                  stars: r.rating,
                  quote: r.comment,
                  name: r.userName,
                  daysAgo: Math.max(1, Math.floor((Date.now() - new Date(r.createdAt).getTime()) / 86400000)) || 1,
                }} />
              ))
              : DUMMY_REVIEWS.map((r) => <ReviewCard key={r.id} review={r} />)
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
