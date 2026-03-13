import { useState, useEffect} from"react";
import { useNavigate} from"react-router-dom";
import { collection, query, where, getDocs} from"firebase/firestore";
import { db} from"../../firebase/firebase";
import { useAuth} from"../../context/AuthContext";

// Dummy data (replace with real data / Firestore later)
const DUMMY_USER = {
  name: "Dfgyh",
  role: "Master Tailor",
  newRequests: 2,
};

const DUMMY_STATS = [
  {
    id: 1,
    label: "Active Orders",
    value: 4,
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "In Progress",
    value: 2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
        <line x1="20" x2="8.12" y1="4" y2="15.88" />
        <line x1="14.47" x2="20" y1="14.48" y2="20" />
        <line x1="8.12" x2="12" y1="8.12" y2="12" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Ready to Deliver",
    value: 1,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" />
        <line x1="23" x2="23" y1="13" y2="11" />
        <polyline points="11 6 7 12 13 12 9 18" />
      </svg>
    ),
  },
  {
    id: 4,
    label: "Completed",
    value: 1,
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-blue-100 transition-all duration-200">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
        {stat.icon}
      </div>
      {/* Number */}
      <p className="text-4xl font-extrabold text-slate-900 leading-none">{stat.value}</p>
      {/* Label */}
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
    </div>
  );
}

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

// ─── Earnings Card ────────────────────────────────────────────────────────────
function EarningsCard({ data }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl" />
      
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
        Total Earnings
      </div>

      {/* Amount */}
      <p className="text-4xl font-black text-slate-900 leading-tight tracking-tight relative z-10">{data.total}</p>

      {/* Sub-label */}
      <p className="text-sm text-slate-500 italic relative z-10">from {data.fromOrders} completed order{data.fromOrders !== 1 ? "s" : ""}</p>

      {/* Growth badge */}
      <div className="mt-auto flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 w-fit relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
        <span className="text-emerald-700 text-[11px] font-black uppercase tracking-tighter">+{data.growthPercent}% growth</span>
      </div>
    </div>
  );
}

// ─── Ratings Card ─────────────────────────────────────────────────────────────
function StarIcon({ filled = true, size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function RatingsCard({ data }) {
  const maxCount = Math.max(...data.breakdown.map((b) => b.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5 h-full hover:shadow-md transition-all">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
          Ratings & Reviews
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= Math.round(data.average)} size={14} />)}
          </div>
          <span className="text-slate-900 font-black text-sm">{data.average}</span>
          <span className="text-[11px] font-bold text-slate-400">({data.total})</span>
        </div>
      </div>

      {/* Breakdown rows */}
      <div className="flex flex-col gap-3">
        {data.breakdown.map((row) => (
          <div key={row.stars} className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 w-2 text-right">{row.stars}</span>
            <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${(row.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900 w-8 text-right">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DUMMY_ORDERS = [
  { id: 1, name: "Wedding Dress", customer: "Shalini Fernando", status: "In Progress", price: "LKR 28,000", iconColor: "text-blue-600", iconBg: "bg-blue-50", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> },
  { id: 2, name: "Business Suits", customer: "Ravi Wijesinghe", status: "Ready to Deliver", price: "LKR 75,000", iconColor: "text-emerald-600", iconBg: "bg-emerald-50", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg> },
  { id: 3, name: "School Uniforms", customer: "Chamara Bandara", status: "Pending", price: "LKR 45,000", iconColor: "text-slate-400", iconBg: "bg-slate-50", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
  { id: 4, name: "Evening Gown", customer: "Nadeesha Perera", status: "Completed", price: "LKR 18,000", iconColor: "text-blue-600", iconBg: "bg-blue-50", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
  { id: 5, name: "Casual Shirts", customer: "Amal Jayawardena", status: "In Progress", price: "LKR 12,000", iconColor: "text-blue-600", iconBg: "bg-blue-50", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" /></svg> },
];

const STATUS_STYLES = {
  "In Progress": "bg-blue-50 text-blue-600",
  "Ready to Deliver": "bg-emerald-50 text-emerald-600",
  "Pending": "bg-slate-50 text-slate-500",
  "Completed": "bg-blue-100 text-blue-700 font-bold",
};

// ─── Active & Recent Orders Card ───────────────────────────────────────────────
function ActiveOrdersCard({ orders }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest flex items-center gap-2">
          Active Collaborations
        </h2>
        <button className="text-blue-600 text-[11px] font-black uppercase tracking-tight hover:underline flex items-center gap-1">
          Full Overview
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Order rows */}
      <div className="flex flex-col divide-y divide-slate-50">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group">
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-50 ${order.iconBg} ${order.iconColor} transition-transform group-hover:scale-105`}>
              {order.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm text-slate-900 truncate">{order.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{order.customer}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${STATUS_STYLES[order.status] || "bg-slate-50 text-slate-600"}`}>
                {order.status}
              </span>
              <p className="font-black text-xs text-slate-900">{order.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DUMMY_REQUESTS = [
  { id: 1, customer: "Dilini Perera", badge: "New", description: "Bridesmaid Dresses (4)", price: "LKR 40,000", due: "Due Apr 15", status: "new" },
  { id: 2, customer: "Colombo Sports Club", badge: "New", description: "Team Jerseys (25)", price: "LKR 62,500", due: "Due Apr 1", status: "new" },
  { id: 3, customer: "Malintha Rajapaksa", badge: "Accepted", description: "Bespoke Suit", price: "LKR 15,000", due: "Due Mar 25", status: "accepted" },
];

// ─── Order Requests Card ──────────────────────────────────────────────────────────────
function OrderRequestsCard({ requests }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest flex items-center gap-2">
          New Job Orders
        </h2>
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-blue-50 text-blue-600 border border-blue-100/50">
          {requests.filter((r) => r.status === "new").length} Priority
        </span>
      </div>

      {/* Request list */}
      <div className="flex flex-col gap-6">
        {requests.map((req) => (
          <div key={req.id} className="flex flex-col gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-sm text-slate-900">{req.customer}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.description}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-emerald-600">{req.price}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{req.due}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {req.status === "new" ? (
                <>
                  <button className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm">Accept Job</button>
                  <button className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all">Archive</button>
                </>
              ) : (
                <span className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest text-center border border-emerald-100/50">✓ Workflow Active</span>
              )}
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-blue-600 hover:border-blue-100 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DUMMY_REVIEWS = [
  { id: 1, stars: 5, quote: "Absolutely stunning work! The wedding dress was exactly what I envisioned. The attention to detail is incredible.", name: "Shalini Fernando", daysAgo: 2 },
  { id: 2, stars: 5, quote: "Professional, punctual and the suits fit perfectly. Would highly recommend to anyone looking for quality tailoring.", name: "Ravi Wijesinghe", daysAgo: 7 },
  { id: 3, stars: 4, quote: "Great quality uniforms delivered on time. Minor stitching issue fixed promptly. Overall very satisfied.", name: "Chamara Bandara", daysAgo: 14 },
];

function StarRow({ count, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
          fill={s <= count ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-all">
      <StarRow count={review.stars} />
      <p className="text-sm font-bold text-slate-600 italic leading-relaxed flex-1">
        &ldquo;{review.quote}&rdquo;
      </p>
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

function RecentReviewsSection({ reviews }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-black text-xs text-slate-800 uppercase tracking-widest flex items-center gap-2">
        Customer Feedback
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────────
export default function TailorDashboard() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const [statCounts, setStatCounts] = useState({ active: null, inProgress: null, readyToDeliver: null, completed: null });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.uid) return;
    const fetchStats = async () => {
      try {
        const col = collection(db, "jobRequests");
        const q = query(col, where("tailorId", "==", authUser.uid));
        const snap = await getDocs(q);
        const counts = { active: 0, inProgress: 0, readyToDeliver: 0, completed: 0 };
        snap.forEach((doc) => {
          const s = (doc.data().status || "").toLowerCase();
          if (s === "active") counts.active++;
          if (s === "in progress") counts.inProgress++;
          if (s === "ready to deliver") counts.readyToDeliver++;
          if (s === "completed") counts.completed++;
        });
        setStatCounts(counts);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [authUser]);

  const liveStats = DUMMY_STATS.map((s) => {
    if (statsLoading) return s;
    const map = { "Active Orders": statCounts.active, "In Progress": statCounts.inProgress, "Ready to Deliver": statCounts.readyToDeliver, "Completed": statCounts.completed };
    return { ...s, value: map[s.label] ?? s.value };
  });

  const displayName = authUser?.name || authUser?.email || "Tailor";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const newReqCount = DUMMY_REQUESTS.filter(r => r.status === "new").length;

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
              {newReqCount > 0 && (
                <span className="inline-block text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm shadow-blue-200">
                  {newReqCount} Assignment{newReqCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/tailor-profile")}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-900 transition-all shadow-sm">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          Tailor Settings
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {liveStats.map((stat) => (
            <StatCard key={stat.id} stat={{ ...stat, value: statsLoading ? <span className="inline-block w-8 h-6 rounded animate-pulse bg-slate-100" /> : stat.value }} />
          ))}
        </div>

        {/* ── Middle Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EarningsCard data={DUMMY_EARNINGS} />
          <RatingsCard data={DUMMY_RATINGS} />
        </div>

        {/* ── Inbox Hook ── */}
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
              <p className="text-slate-400 text-sm font-bold">Review requirements and submit your best quotes</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all group-hover:bg-white group-hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </div>
        </div>

        {/* ── Requests & Active Orders ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OrderRequestsCard requests={DUMMY_REQUESTS} />
          <ActiveOrdersCard orders={DUMMY_ORDERS} />
        </div>

        {/* ── Reviews ── */}
        <RecentReviewsSection reviews={DUMMY_REVIEWS} />
      </main>
    </div>
  );
}