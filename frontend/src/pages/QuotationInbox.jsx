import { useState, useEffect} from"react";
import { collection, query, where, getDocs} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import { useNavigate} from"react-router-dom";

const STATUS_MAP = {
 pending: { label:"Pending", bg:"bg-amber-100", text:"text-amber-700", dot:"bg-amber-500"},
 quoted: { label:"Quoted", bg:"", text:"", dot:""},
 accepted: { label:"Accepted", bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500"},
 rejected: { label:"Rejected", bg:"", text:"", dot:""},
};

export default function QuotationInbox() {
 const { user} = useAuth();
 const navigate = useNavigate();
 const [quotations, setQuotations] = useState([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState("All");

 useEffect(() => {
 if (!user?.uid) return;

 const fetchQuotations = async () => {
 try {
 const q = query(
 collection(db,"quotations"),
 where("providerId","==", user.uid)
 );
 const snap = await getDocs(q);
 const data = snap.docs
 .map((doc) => ({ id: doc.id, ...doc.data()}))
 .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
 setQuotations(data);
} catch (err) {
 console.error("Error fetching quotations:", err);
} finally {
 setLoading(false);
}
};
 fetchQuotations();
}, [user]);

 const filteredQuotations = quotations.filter((q) => {
 if (activeTab ==="All") return true;
 return q.status?.toLowerCase() === activeTab.toLowerCase();
});

 const stats = {
 total: quotations.length,
 pending: quotations.filter((q) => q.status ==="pending").length,
 quoted: quotations.filter((q) => q.status ==="quoted").length,
 accepted: quotations.filter((q) => q.status ==="accepted").length,
};

 const formatDate = (timestamp) => {
 if (!timestamp?.seconds) return"—";
 return new Date(timestamp.seconds * 1000).toLocaleDateString("en-GB", {
 day:"numeric", month:"short", year:"numeric",
});
};

 return (
 <div className="min-h-screen">
 {/* ── Header ── */}
 <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-8">
 <div className="max-w-6xl mx-auto">
 <div className="flex items-center gap-3 mb-1">
 <div className="w-10 h-10 rounded-xl border flex items-center justify-center">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <div>
 <h1 className="text-2xl font-bold">Quote Requests</h1>
 <p className="text-sm">Manage incoming quote requests from customers</p>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
 {/* ── Stat Cards ── */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label:"Total Requests", value: stats.total, icon:"📋", bg:"bg-violet-50", accent:"text-violet-600"},
 { label:"Pending", value: stats.pending, icon:"⏳", bg:"bg-amber-50", accent:"text-amber-600"},
 { label:"Quoted", value: stats.quoted, icon:"💰", bg:"", accent:""},
 { label:"Accepted", value: stats.accepted, icon:"✅", bg:"bg-emerald-50", accent:"text-emerald-600"},
 ].map((stat) => (
 <div key={stat.label} className="rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow">
 <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>
 {stat.icon}
 </div>
 <p className="text-3xl font-extrabold">{loading ?"—" : stat.value}</p>
 <p className="text-sm font-medium mt-1">{stat.label}</p>
 </div>
 ))}
 </div>

 {/* ── Tab Filter ── */}
 <div className="rounded-2xl border shadow-sm p-4 flex items-center gap-2 overflow-x-auto">
 {["All","Pending","Quoted","Accepted","Rejected"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === tab
 ?"bg-violet-600 shadow-md shadow-violet-200"
 :" hover: hover:"
}`}
 >
 {tab}
 {tab !=="All" && (
 <span className={`ml-1.5 text-xs ${activeTab === tab ?"text-violet-200" :""}`}>
 ({quotations.filter((q) => q.status === tab.toLowerCase()).length})
 </span>
 )}
 </button>
 ))}
 </div>

 {/* ── Quotation List ── */}
 {loading ? (
 <div className="space-y-4">
 {[1, 2, 3].map((i) => (
 <div key={i} className="rounded-2xl border p-6 animate-pulse">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl" />
 <div className="flex-1 space-y-2">
 <div className="h-4 rounded w-1/3" />
 <div className="h-3 rounded w-1/4" />
 </div>
 <div className="h-8 w-24 rounded-full" />
 </div>
 </div>
 ))}
 </div>
 ) : filteredQuotations.length > 0 ? (
 <div className="space-y-4">
 {filteredQuotations.map((q) => {
 const statusStyle = STATUS_MAP[q.status] || STATUS_MAP.pending;
 return (
 <div
 key={q.id}
 className="rounded-2xl border shadow-sm hover:shadow-md hover:border-violet-100 transition-all cursor-pointer group"
 onClick={() => navigate(`/quotation-response/${q.id}`, { state: { quotation: q}})}
 >
 <div className="p-6">
 <div className="flex items-start gap-4">
 {/* Customer avatar */}
 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
 {q.customerName?.charAt(0) ||"?"}
 </div>

 {/* Main info */}
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="text-base font-bold truncate group-hover:text-violet-700 transition-colors">
 {q.customerName ||"Unknown Customer"}
 </h3>
 <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
 {statusStyle.label}
 </span>
 </div>

 <p className="text-sm mb-3 line-clamp-1">
 {q.requirements ||"No description"}
 </p>

 {/* Meta row */}
 <div className="flex flex-wrap items-center gap-4 text-xs">
 <span className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect width="18" height="18" x="3" y="4" rx="2" />
 <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
 <line x1="3" x2="21" y1="10" y2="10" />
 </svg>
 Received: {formatDate(q.createdAt)}
 </span>
 <span className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
 </svg>
 Expected: {q.expectedDate ||"—"}
 </span>
 <span className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
 </svg>
 {q.items?.length || 0} item{q.items?.length !== 1 ?"s" :""}
 </span>
 {q.designImages?.length > 0 && (
 <span className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect x="3" y="3" width="18" height="18" rx="2" />
 <circle cx="8.5" cy="8.5" r="1.5" />
 <polyline points="21 15 16 10 5 21" />
 </svg>
 {q.designImages.length} image{q.designImages.length !== 1 ?"s" :""}
 </span>
 )}
 </div>
 </div>

 {/* Arrow */}
 <div className="shrink-0 group-hover:text-violet-500 transition-colors self-center">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
 </svg>
 </div>
 </div>
 </div>
 </div>
 );
})}
 </div>
 ) : (
 <div className="rounded-3xl border border-dashed p-12 text-center">
 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <h3 className="text-lg font-bold mb-2">No quote requests yet</h3>
 <p className="max-w-sm mx-auto">
 When customers request quotes from you, they&apos;ll appear here.
 </p>
 </div>
 )}
 </div>
 </div>
 );
}
