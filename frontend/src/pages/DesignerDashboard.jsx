import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DesignerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [jobRequests, setJobRequests] = useState([]);
  //const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ active: 0, inProgress: 0, readyToDeliver: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  // Status badge colors
  const statusColours = {
    "In Progress": "bg-orange-100 text-orange-600",
    "Ready to Deliver": "bg-blue-100 text-blue-600",
    "Pending": "bg-slate-100 text-slate-600",
    "Completed": "bg-emerald-100 text-emerald-600",
    "Accepted": "bg-blue-50 text-blue-600",
    "New": "bg-orange-100 text-orange-600 font-bold",
  };

  const FALLBACK_REQUESTS = [
    { id: "mock_req_1", customer: "Hiruni Siriwardena", status: "New", description: "Evening Gown Design (Custom)", price: "LKR 25,000", due: "Due next week" },
    { id: "mock_req_2", customer: "Studio Red", status: "New", description: "Bridal Wear Sketches (3 items)", price: "LKR 45,000", due: "Due tomorrow" },
    { id: "mock_req_3", customer: "Amandi Perera", status: "Accepted", description: "Casual Dress Pattern", price: "LKR 8,500", due: "Due in 3 days" },
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

  useEffect(() => {
    if (user && user.role !== "designer") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const uid = user.uid;
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
          const toMs = v => v?.toDate?.().getTime() ?? new Date(v ?? 0).getTime();
          return toMs(b.createdAt) - toMs(a.createdAt);
        });
        setOrders(sorted.length > 0 ? sorted.slice(0, 5) : FALLBACK_ORDERS);

        const reqSnap = await getDocs(query(collection(db, "jobRequests"), where("designerId", "==", uid)));
        const reqs = reqSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setJobRequests(reqs.length > 0 ? reqs : FALLBACK_REQUESTS);
      } catch (err) {
        console.error("DesignerDashboard fetch error:", err);
        setOrders(FALLBACK_ORDERS);
        setJobRequests(FALLBACK_REQUESTS);

      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAccept = async (id) => {
    try { await updateDoc(doc(db, "jobRequests", id), { status: "Accepted" }); } catch (e) { console.error(e); }
    setJobRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Accepted" } : r));
  };
  const handleDecline = async (id) => {
    try { await updateDoc(doc(db, "jobRequests", id), { status: "Declined" }); } catch (e) { console.error(e); }
    setJobRequests(prev => prev.filter(r => r.id !== id));
  };


  const displayName = user?.name || user?.email || "Designer";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const newReqCount = jobRequests.filter(r => (r.status || "").toLowerCase() === "new").length;

  const statsData = [
    { label: "Active Orders", value: stats.active, color: "text-blue-600", bg: "bg-blue-50", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M12 6v6l4 2" /></svg> },
    { label: "In Progress", value: stats.inProgress, color: "text-orange-500", bg: "bg-orange-50", icon: <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg> },
    { label: "Ready to Deliver", value: stats.readyToDeliver, color: "text-emerald-600", bg: "bg-emerald-50", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1" strokeWidth="2" /><path strokeWidth="2" d="M16 8h4l3 5v3h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg> },
    { label: "Completed", value: stats.completed, color: "text-blue-600", bg: "bg-blue-50", icon: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M9 12l2 2 4-4" /></svg> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Preparing your creative space...</p>
      </div>
    </div>
  );

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
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}
            </p>
            <p className="font-extrabold text-2xl text-slate-900 leading-tight">{displayName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 uppercase tracking-widest border border-slate-200/50">
                Fashion Designer
              </span>
              {newReqCount > 0 && (
                <span className="inline-block text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm shadow-blue-200">
                  {newReqCount} New Job{newReqCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/designer-profile")}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-900 transition-all shadow-sm">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          Profile Settings
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">
        {/* ── Stat Cards ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {statsData.map((stat) => (
            <div key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-default group">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <p className={`text-3xl font-black text-slate-900`}>{stat.value}</p>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* ── Row 2 ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl" />
            <div className="relative">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Project Revenue</p>
              <h3 className="font-black text-4xl text-slate-900 mb-1">LKR 65,000</h3>
              <p className="text-sm font-bold text-slate-400 mb-6 italic">from 8 successful collaborations</p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 transition-colors hover:bg-emerald-100">
                <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                <span className="text-emerald-700 text-xs font-black uppercase tracking-tighter">+24.8% growth</span>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Portfolio Impact</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900">4.9</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => <svg key={s} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>)}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[{ s: 5, c: 110, p: 95 }, { s: 4, c: 10, p: 8 }, { s: 3, c: 4, p: 3 }].map(row => (
                <div key={row.s} className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 w-2 shrink-0">{row.s}</span>
                  <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.p}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 w-10 text-right">{row.c}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inbox Access ── */}
        <div
          onClick={() => navigate("/quotation-inbox")}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-lg text-white uppercase tracking-tight">Collaboration Request Inbox</h3>
              <p className="text-slate-400 text-sm font-bold">Manage new design briefs and client inquiries</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all group-hover:bg-white group-hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </div>
        </div>

        {/* ── Main Dashboard Flow ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Incoming Requests */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Live Job Requests
              </h2>
              {jobRequests.length > 0 && <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Action Required</span>}
            </div>
            {jobRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold italic">Clear horizon. No job requests pending.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {jobRequests.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-black text-slate-900 mb-0.5">{req.customerName || req.customer}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{req.description || req.item}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-slate-900">{req.price}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{req.dueDate || req.due}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {(req.status || "").toLowerCase() === "new" ? (
                          <>
                            <button onClick={() => handleAccept(req.id)} className="px-6 py-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-all shadow-sm">Accept Brief</button>
                            <button onClick={() => handleDecline(req.id)} className="px-6 py-2 bg-white border border-slate-200 text-slate-500 text-[11px] font-black uppercase tracking-widest rounded-lg hover:border-rose-200 hover:text-rose-500 transition-all">Archived</button>
                          </>
                        ) : (
                          <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 rounded-lg">✓ Proposal Accepted</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${statusColours[req.status] || "bg-slate-100 text-slate-600"}`}>{req.status}</span>
                        <button className="w-9 h-9 border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:text-blue-600 hover:border-blue-100 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">Active Orders</h3>
                <button onClick={() => navigate("/orders")} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Full Report</button>
              </div>
              <div className="divide-y divide-slate-50">
                {orders.map(order => (
                  <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-slate-900 truncate">{order.itemName || "Custom Project"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{order.customerName}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${statusColours[order.status] || "bg-slate-100 text-slate-600"}`}>{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
