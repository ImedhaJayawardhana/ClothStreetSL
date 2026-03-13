import { useState, useEffect} from"react";
import { collection, query, where, getDocs} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import { useNavigate} from"react-router-dom";
import toast from"react-hot-toast";

// ── Mock Order Data (Sri Lankan fabric/tailoring orders) ──
const mockOrders = [
 {
 id:"ORD-2026-143",
 product:"Premium Silk Fabric - Navy Blue",
 seller:"Lanka Textiles Co.",
 sellerInitial:"L",
 category:"Fabric",
 description:"5 meters of premium silk fabric",
 deliveryType:"tailor",
 deliveryLabel:"Delivered to Tailor: Nimal Perera",
 quantity: 5,
 unit:"m",
 amount: 45000,
 expectedDate:"3/15/2026",
 status:"Shipped",
 statusClass:"shipped",
 tracking:"TRK-2026-3821",
},
 {
 id:"ORD-2026-138",
 product:"Custom Evening Gown Design",
 seller:"Priya Gunasekara",
 sellerInitial:"P",
 category:"Design",
 description:"Custom designed evening gown with embellishments",
 deliveryType:"home",
 deliveryLabel: null,
 quantity: 1,
 unit:"pc",
 amount: 125000,
 expectedDate:"3/20/2026",
 status:"In Progress",
 statusClass:"in-progress",
 tracking: null,
},
 {
 id:"ORD-2026-142",
 product:"Suit Tailoring Service",
 seller:"Nimal Perera",
 sellerInitial:"N",
 category:"Tailoring",
 description:"2 custom-tailored business suits",
 deliveryType:"home",
 deliveryLabel: null,
 quantity: 2,
 unit:"pc",
 amount: 85000,
 expectedDate:"3/24/2026",
 status:"Confirmed",
 statusClass:"confirmed",
 tracking: null,
},
 {
 id:"ORD-2026-112",
 product:"Batik Cotton Fabric - Multiple Colors",
 seller:"Artisan Threads",
 sellerInitial:"A",
 category:"Fabric",
 description:"8 meters of traditional batik cotton",
 deliveryType:"home",
 deliveryLabel:"Home delivery",
 quantity: 8,
 unit:"m",
 amount: 28000,
 deliveredDate:"3/4/2026",
 status:"Delivered",
 statusClass:"delivered",
 tracking:"TRK-2026-2642",
},
 {
 id:"ORD-2026-108",
 product:"Bridal Saree Design Package",
 seller:"Priya Gunasekara",
 sellerInitial:"P",
 category:"Design",
 description:"Complete bridal saree design with blouse",
 deliveryType:"home",
 deliveryLabel: null,
 quantity: 1,
 unit:"pc",
 amount: 195000,
 expectedDate:"3/8/2026",
 status:"Completed",
 statusClass:"completed",
 tracking: null,
},
];

export default function CustomerOrders() {
 const { user} = useAuth();
 const navigate = useNavigate();
 const [orders, setOrders] = useState(mockOrders);
 const [searchQuery, setSearchQuery] = useState("");
 const [activeTab, setActiveTab] = useState("All");
 const [quotations, setQuotations] = useState([]);
 const [quotationsLoading, setQuotationsLoading] = useState(true);

 // Review Modal State
 const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
 const [reviewOrder, setReviewOrder] = useState(null);
 const [reviewText, setReviewText] = useState("");
 const [reviewRating, setReviewRating] = useState(5);

 const handleDeleteOrder = (orderId) => {
 if (window.confirm("Are you sure you want to remove this order from your history?")) {
 setOrders(prev => prev.filter(o => o.id !== orderId));
 toast.success("Order removed successfully!");
}
};

 const handleOpenReview = (order) => {
 setReviewOrder(order);
 setReviewText("");
 setReviewRating(5);
 setIsReviewModalOpen(true);
};

 const handleSubmitReview = () => {
 if (!reviewText.trim()) {
 toast.error("Please write a review before submitting.");
 return;
}
 // Update order status to"Completed"
 setOrders(prev => prev.map(o => o.id === reviewOrder.id ? { ...o, status:"Completed", statusClass:"completed"} : o));
 setIsReviewModalOpen(false);
 toast.success("Review submitted successfully!");
};

 // Fetch quotations from Firestore
 useEffect(() => {
 if (!user?.uid) return;
 const fetchQuotations = async () => {
 try {
 const q = query(
 collection(db,"quotations"),
 where("customerId","==", user.uid)
 );
 const snap = await getDocs(q);
 const data = snap.docs
 .map((doc) => ({ id: doc.id, ...doc.data()}))
 .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
 setQuotations(data);
} catch (err) {
 console.error("Error fetching quotations:", err);
} finally {
 setQuotationsLoading(false);
}
};
 fetchQuotations();
}, [user]);

 // ── Tab filtering ──
 const filteredOrders = orders.filter((order) => {
 const query = searchQuery.toLowerCase();
 const matchesSearch =
 order.product.toLowerCase().includes(query) ||
 order.seller.toLowerCase().includes(query);

 if (activeTab ==="All") return matchesSearch;
 if (activeTab ==="Active")
 return (
 matchesSearch &&
 ["Shipped","In Progress","Confirmed"].includes(order.status)
 );
 if (activeTab ==="Completed")
 return (
 matchesSearch &&
 ["Delivered","Completed"].includes(order.status)
 );
 return matchesSearch;
});

 // ── Stats ──
 const totalOrders = orders.length;
 const activeOrders = orders.filter((o) =>
 ["Shipped","In Progress","Confirmed"].includes(o.status)
 ).length;
 const completedOrders = orders.filter((o) =>
 ["Delivered","Completed"].includes(o.status)
 ).length;
 const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);

 // ── Status badge colors ──
 const statusStyles = {
 shipped:"",
"in-progress":"bg-amber-100 text-amber-700",
 confirmed:"bg-violet-100 text-violet-700",
 delivered:"bg-emerald-100 text-emerald-700",
 completed:"bg-emerald-100 text-emerald-700",
};

 // ── Card left-border colors ──
 const borderColors = {
 shipped:"#4f46e5",
"in-progress":"#f59e0b",
 confirmed:"#7c3aed",
 delivered:"#16a34a",
 completed:"#16a34a",
};

 return (
 <div className="min-h-screen">

 {/* ════════════ HERO BANNER ════════════ */}
 <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-11 px-4">
 {/* Decorative orbs */}
 <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" />

 <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
 {/* Left */}
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center border">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
 </svg>
 </div>
 <div>
 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Orders</h1>
 <p className="text-sm mt-0.5">Track your purchases and deliveries</p>
 </div>
 </div>

 {/* Right: Action Buttons */}
 <div className="flex items-center gap-2.5">

 <button
 onClick={() => {
 const csvData = [
 ["Order ID","Product","Seller","Category","Quantity","Amount (LKR)","Status","Tracking"],
 ...filteredOrders.map(o => [
 o.id,
`"${o.product}"`,
`"${o.seller}"`,
 o.category,
 o.quantity,
 o.amount,
 o.status,
 o.tracking ||"N/A"
 ])
 ].map(e => e.join(",")).join("\n");
 
 const blob = new Blob([csvData], { type:'text/csv;charset=utf-8;'});
 const link = document.createElement("a");
 const url = URL.createObjectURL(blob);
 link.setAttribute("href", url);
 link.setAttribute("download",`my_orders_${new Date().toISOString().split('T')[0]}.csv`);
 link.style.visibility ='hidden';
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 toast.success("Orders exported successfully!");
}}
 className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold hover: shadow-sm hover:shadow-md transition-all cursor-pointer"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
 <polyline points="7 10 12 15 17 10" />
 <line x1="12" y1="15" x2="12" y2="3" />
 </svg>
 Export
 </button>
 </div>
 </div>
 </section>

 {/* ════════════ CONTENT ════════════ */}
 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

 {/* ── Stats Cards ── */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
 {/* Total Orders */}
 <div className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div>
 <p className="text-sm font-medium mb-1">Total Orders</p>
 <p className="text-3xl font-bold">{totalOrders}</p>
 <p className="text-xs mt-1">All time</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
 </svg>
 </div>
 </div>

 {/* Active */}
 <div className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div>
 <p className="text-sm font-medium mb-1">Active</p>
 <p className="text-3xl font-bold">{activeOrders}</p>
 <p className="text-xs mt-1">In progress</p>
 </div>
 <div className="w-10 h-10 rounded-xl flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
 </svg>
 </div>
 </div>

 {/* Completed */}
 <div className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div>
 <p className="text-sm font-medium mb-1">Completed</p>
 <p className="text-3xl font-bold">{completedOrders}</p>
 <p className="text-xs mt-1">Delivered</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 </div>
 </div>

 {/* Total Spent */}
 <div className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div>
 <p className="text-sm font-medium mb-1">Total Spent</p>
 <p className="text-3xl font-bold">LKR {(totalSpent / 1000).toFixed(0)}K</p>
 <p className="text-xs mt-1">Total purchases</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
 </svg>
 </div>
 </div>
 </div>

 {/* ── Search Bar + Tabs ── */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
 {/* Search */}
 <div className="relative flex-1 max-w-md">
 <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
 </svg>
 </div>
 <input
 type="text"
 placeholder="Search orders..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full border focus: focus:ring-2 focus:ring-indigo-100 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 outline-none transition-all"
 />
 </div>

 {/* Tab Pills */}
 <div className="flex items-center gap-1 rounded-xl p-1">
 {["All","Active","Completed","Quotations"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
 activeTab === tab
 ?" shadow-md shadow-indigo-200"
 :" hover: hover:"
}`}
 >
 {tab}
 {tab ==="Quotations" && quotations.length > 0 && (
 <span className={`ml-1.5 text-xs ${activeTab === tab ?"" :""}`}>
 ({quotations.length})
 </span>
 )}
 </button>
 ))}
 </div>
 </div>

 {/* ── Order Cards Grid / Quotations ── */}
 {activeTab ==="Quotations" ? (
 /* ── QUOTATIONS TAB ── */
 quotationsLoading ? (
 <div className="space-y-4">
 {[1, 2, 3].map((i) => (
 <div key={i} className="rounded-2xl border p-6 animate-pulse">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl" />
 <div className="flex-1 space-y-2">
 <div className="h-4 rounded w-1/3" />
 <div className="h-3 rounded w-1/4" />
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : quotations.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 {quotations.map((q) => {
 const statusColors = {
 pending: { bg:"bg-amber-100", text:"text-amber-700", border:"#f59e0b"},
 quoted: { bg:"", text:"", border:"#3b82f6"},
 accepted: { bg:"bg-emerald-100", text:"text-emerald-700", border:"#16a34a"},
 rejected: { bg:"", text:"", border:"#dc2626"},
};
 const sc = statusColors[q.status] || statusColors.pending;

 return (
 <div
 key={q.id}
 className="border rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
 style={{ borderLeft:`4px solid ${sc.border}`}}
 >
 {/* Header */}
 <div className="flex items-start gap-3.5 mb-3">
 <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
 q.providerType ==="designer"
 ?"bg-gradient-to-br from-rose-500 to-pink-600"
 :"bg-gradient-to-br from-violet-500 to-purple-600"
}`}>
 {q.providerName?.charAt(0) ||"?"}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-sm font-bold truncate">{q.providerName ||"Provider"}</h3>
 <p className="text-xs mt-0.5 capitalize">{q.providerType ||"—"}</p>
 <span className={`inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
 {q.status}
 </span>
 </div>
 </div>

 {/* Requirements preview */}
 <p className="text-sm mb-3 leading-relaxed line-clamp-2">
 {q.requirements ||"No description"}
 </p>

 {/* Details */}
 <div className="grid grid-cols-2 gap-2.5 mb-4">
 <div className="flex items-center gap-1.5 text-xs">
 <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
 </svg>
 <span className="">Expected:</span>
 <span className="font-semibold">{q.expectedDate ||"—"}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 </svg>
 <span className="">Items:</span>
 <span className="font-semibold">{q.items?.length || 0}</span>
 </div>
 {q.grandTotal && (
 <div className="flex items-center gap-1.5 text-xs col-span-2">
 <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
 </svg>
 <span className="">Quoted Amount:</span>
 <span className="font-bold text-violet-600">LKR {q.grandTotal.toLocaleString()}</span>
 </div>
 )}
 </div>

 {/* Actions */}
 <div className="flex gap-2.5">
 {q.status ==="quoted" && (
 <button
 onClick={() => navigate(`/quotation-review/${q.id}`, { state: { quotation: q}})}
 className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
 >
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
 </svg>
 Review & Respond
 </button>
 )}
 </div>
 </div>
 );
})}
 </div>
 ) : (
 <div className="col-span-full text-center py-16">
 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
 <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <h3 className="text-lg font-semibold mb-1">No quotations yet</h3>
 <p className="text-sm">Request a quote from a tailor or designer during checkout.</p>
 </div>
 )
 ) : (
 /* ── Regular Order Cards Grid ── */
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 {filteredOrders.length > 0 ? (
 filteredOrders.map((order) => (
 <div
 key={order.id}
 className="border rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
 style={{ borderLeft:`4px solid ${borderColors[order.statusClass]}`}}
 >
 {/* Card Header */}
 <div className="flex items-start gap-3.5 mb-3">
 <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-bold text-lg shrink-0">
 {order.sellerInitial}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-sm font-bold truncate">{order.product}</h3>
 <p className="text-xs mt-0.5">Seller: {order.seller}</p>
 <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
 {order.id}
 </span>
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-600">
 {order.category}
 </span>
 </div>
 </div>
 {order.status ==="Completed" && (
 <button 
 onClick={() => handleDeleteOrder(order.id)}
 className="w-7 h-7 rounded-lg border flex items-center justify-center hover: hover: hover: transition-colors shrink-0 cursor-pointer"
 title="Delete Order"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
 </svg>
 </button>
 )}
 </div>

 {/* Description */}
 <p className="text-sm mb-3 leading-relaxed">{order.description}</p>

 {/* Delivery Badge */}
 {order.deliveryLabel && (
 <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4 border ${
 order.deliveryType ==="tailor"
 ?"bg-violet-50 text-violet-700 border-violet-200"
 :"bg-emerald-50 text-emerald-700 border-emerald-200"
}`}>
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 {order.deliveryType ==="tailor" ? (
 <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>
 ) : (
 <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>
 )}
 </svg>
 {order.deliveryLabel}
 </div>
 )}

 {/* Details Grid */}
 <div className="grid grid-cols-2 gap-2.5 mb-4">
 <div className="flex items-center gap-1.5 text-xs">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 </svg>
 <span className="">Quantity:</span>
 <span className="font-semibold">{order.quantity}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
 </svg>
 <span className="">Amount:</span>
 <span className="font-semibold text-emerald-600">LKR {order.amount.toLocaleString()}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
 </svg>
 <span className="">{order.deliveredDate ?"Delivered:" :"Expected:"}</span>
 <span className="font-semibold">{order.deliveredDate || order.expectedDate}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[order.statusClass]}`}>
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 {["delivered","completed"].includes(order.statusClass) ? (
 <polyline points="20 6 9 17 4 12" />
 ) : order.statusClass ==="shipped" ? (
 <><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>
 ) : (
 <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>
 )}
 </svg>
 {order.status}
 </span>
 </div>
 </div>

 {/* Tracking */}
 {order.tracking && (
 <div className="flex items-center gap-1.5 text-xs mb-1">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
 </svg>
 <span>Tracking:</span>
 <span className="font-semibold">{order.tracking}</span>
 </div>
 )}

 {/* Action Buttons */}
 <div className="flex gap-2.5 mt-4">

 {["Shipped","In Progress","Confirmed"].includes(order.status) && (
 <button
 onClick={() => navigate(`/order-tracking/${order.id}`, { state: { order}})}
 className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold border hover: transition-all cursor-pointer"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
 </svg>
 Track
 </button>
 )}

 {["Delivered","Completed"].includes(order.status) && (
 <button
 onClick={() => handleOpenReview(order)}
 disabled={order.status ==="Completed"}
 className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
 order.status ==="Completed"
 ?" border cursor-not-allowed"
 :" border hover: cursor-pointer"
}`}
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 {order.status ==="Completed" ?"Reviewed" :"Review"}
 </button>
 )}
 </div>
 </div>
 ))
 ) : (
 /* Empty State */
 <div className="col-span-full text-center py-16">
 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 </svg>
 </div>
 <h3 className="text-lg font-semibold mb-1">No orders found</h3>
 <p className="text-sm">Try adjusting your search or filter settings.</p>
 </div>
 )}
 </div>
 )}

 </div>

 {/* ════════════ REVIEW MODAL ════════════ */}
 {isReviewModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
 <div className="rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
 <div className="px-6 py-4 border-b flex items-center justify-between">
 <h3 className="text-lg font-bold">Write a Review</h3>
 <button 
 onClick={() => setIsReviewModalOpen(false)}
 className="w-8 h-8 rounded-full border flex items-center justify-center hover: transition-colors"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
 </button>
 </div>
 <div className="px-6 py-5">
 <p className="text-sm mb-4">How was your experience with <span className="font-semibold">{reviewOrder?.product}</span>?</p>
 
 <div className="flex gap-2 mb-6 justify-center">
 {[1, 2, 3, 4, 5].map((star) => (
 <button 
 key={star} 
 onClick={() => setReviewRating(star)}
 className="focus:outline-none focus:scale-110 transition-transform"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${star <= reviewRating ?"text-amber-400 fill-amber-400" :""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 </button>
 ))}
 </div>

 <textarea 
 rows="4"
 className="w-full border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus: focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
 placeholder="Share your feedback about the product and delivery..."
 value={reviewText}
 onChange={(e) => setReviewText(e.target.value)}
 />
 </div>
 <div className="px-6 py-4 border-t flex justify-end gap-3">
 <button 
 onClick={() => setIsReviewModalOpen(false)}
 className="px-5 py-2 rounded-xl text-sm font-medium border hover: transition-colors"
 >
 Cancel
 </button>
 <button 
 onClick={handleSubmitReview}
 className="px-5 py-2 rounded-xl text-sm font-semibold hover: transition-colors shadow-sm shadow-indigo-200"
 >
 Submit Review
 </button>
 </div>
 </div>
 </div>
 )}

 </div>
 );
}
