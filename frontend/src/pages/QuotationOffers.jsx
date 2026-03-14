import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { deleteQuotation, updateQuotationStatus, deleteCartItem } from "../api";
import toast from "react-hot-toast";

const STATUS_MAP = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  quoted: { label: "Quoted", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  accepted: { label: "Accepted", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { label: "Declined", bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
};

export default function QuotationOffers() {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchOffers = async () => {
      try {
        const q = query(
          collection(db, "quotations"),
          where("customerId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const data = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setQuotations(data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [user]);

  const handleAcceptOffer = async (e, q) => {
    e.stopPropagation();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Update status to Accepted which internally triggers order creation in backend
      await updateQuotationStatus(q.id, "Accepted");

      // 2. Clear related cart items
      try {
        await deleteCartItem(user.uid, q.providerId);
        clearCart();
      } catch {
        // Silently ignore cart errors
      }

      // 3. UI Updates
      toast.success("Order confirmed! Your order has been placed.");
      setQuotations((prev) =>
        prev.map((item) => (item.id === q.id ? { ...item, status: "accepted" } : item))
      );

      // 4. Redirect
      setTimeout(() => {
        navigate("/orders");
      }, 2000);

    } catch (err) {
      setIsProcessing(false);
      toast.error(err.response?.data?.detail || "Failed to accept quotation.");
    }
  };

  const handleDeclineOffer = async (e, q) => {
    e.stopPropagation();
    if (isProcessing) return;

    try {
      await updateQuotationStatus(q.id, "Declined");
      toast.success("Quotation declined.");
      setQuotations((prev) =>
        prev.map((item) => (item.id === q.id ? { ...item, status: "declined" } : item))
      );
    } catch {
      toast.error("Failed to decline quotation.");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this quote request?")) return;
    try {
      await deleteQuotation(id);
      setQuotations((prev) => prev.filter((q) => q.id !== id));
      toast.success("Quote request deleted!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete.");
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    if (activeTab === "All") return true;
    return q.status?.toLowerCase() === activeTab.toLowerCase();
  });

  const stats = {
    total: quotations.length,
    pending: quotations.filter((q) => q.status === "pending").length,
    quoted: quotations.filter((q) => q.status === "quoted").length,
    accepted: quotations.filter((q) => q.status === "accepted").length,
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds && typeof timestamp !== "string") return "—";
    const d = timestamp?.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return d.toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Header ── */}
      <div className="bg-white border-b px-6 py-10 sticky top-0 z-30 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-5 mb-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Quotation Requests</h1>
              <p className="text-sm text-slate-500 font-bold italic">Track your custom tailoring and design quotation requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Requests", value: stats.total, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, bg: "bg-blue-50", accent: "text-blue-600" },
            { label: "Awaiting Quote", value: stats.pending, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" strokeWidth="2.5" /></svg>, bg: "bg-amber-50", accent: "text-amber-600" },
            { label: "Quotes Received", value: stats.quoted, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 8v1" /></svg>, bg: "bg-blue-50", accent: "text-blue-600" },
            { label: "Accepted", value: stats.accepted, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M5 13l4 4L19 7" /></svg>, bg: "bg-emerald-50", accent: "text-emerald-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-blue-100 transition-all group">
              <div className={`w-11 h-11 ${stat.bg} ${stat.accent} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <p className="text-4xl font-black text-slate-900 leading-none">{loading ? "—" : stat.value}</p>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {["All", "Pending", "Quoted", "Accepted", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${activeTab === tab
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-400 hover:text-blue-600 hover:bg-white"
                }`}
            >
              {tab}
              {tab !== "All" && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {quotations.filter((q) => q.status === tab.toLowerCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Quotation Cards ── */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-8 animate-pulse flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-50 rounded w-1/4" />
                  <div className="h-3 bg-slate-50 rounded w-1/2" />
                </div>
                <div className="h-10 w-24 bg-slate-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredQuotations.length > 0 ? (
          <div className="space-y-6">
            {filteredQuotations.map((q) => {
              const style = STATUS_MAP[q.status] || STATUS_MAP.pending;
              const isQuoted = q.status === "quoted";
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => {
                    if (isQuoted) {
                      navigate(`/quotation-review/${q.id}`, { state: { quotation: q } });
                    }
                  }}
                >
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Provider Avatar */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shrink-0 shadow-xl shadow-slate-200 group-hover:scale-105 transition-transform ${q.providerType === "designer"
                        ? "bg-gradient-to-br from-rose-500 to-pink-600"
                        : "bg-gradient-to-br from-violet-500 to-purple-600"
                        }`}>
                        {q.providerName?.charAt(0) || "?"}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {q.providerName || "Provider"}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {style.label}
                          </span>
                          {q.providerType && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-500">
                              {q.providerType}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-500 font-bold mb-4 line-clamp-2 leading-relaxed italic">
                          &quot;{q.requirements || q.description || "No specific brief provided"}&quot;
                        </p>

                        {/* Meta Row */}
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            Sent: {formatDate(q.createdAt)}
                          </span>
                          {q.expectedDate && (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                              </svg>
                              Needed by: {q.expectedDate}
                            </span>
                          )}
                          {q.items?.length > 0 && (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                              </svg>
                              {q.items.length} Items
                            </span>
                          )}
                          {q.grandTotal > 0 && (
                            <span className="flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-md text-emerald-600">
                              LKR {q.grandTotal.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action block */}
                      <div className="flex flex-col items-center gap-3 self-center">
                        {isQuoted ? (
                          <div className="flex flex-col gap-2">
                            <button
                              disabled={isProcessing}
                              onClick={(e) => handleAcceptOffer(e, q)}
                              className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Accept
                            </button>
                            <button
                              disabled={isProcessing}
                              onClick={(e) => handleDeclineOffer(e, q)}
                              className="px-4 py-2 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                            </svg>
                          </div>
                        )}

                        {["pending", "rejected", "declined"].includes(q.status) && (
                          <button
                            onClick={(e) => handleDelete(e, q.id)}
                            className="w-8 h-8 rounded-full border border-red-100 bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Delete Quotation"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100 p-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-100 text-slate-200">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Quotations Yet</h3>
            <p className="max-w-xs mx-auto text-slate-400 font-bold italic leading-relaxed">
              Browse tailors or designers and send them a quotation request to get started.
            </p>
            <button
              onClick={() => navigate("/find-tailor-designer")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors cursor-pointer shadow-lg shadow-blue-200"
            >
              Find a Tailor / Designer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
