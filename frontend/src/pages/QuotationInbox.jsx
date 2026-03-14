import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const STATUS_MAP = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  quoted: { label: "Quoted", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  accepted: { label: "Accepted", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
  completed: { label: "Completed", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-700" },
};

export default function QuotationInbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (!user?.uid) return;
    const fetchQuotations = async () => {
      try {
        const q = query(
          collection(db, "quotations"),
          where("providerId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const data = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
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
    if (activeTab === "All") return true;
    return q.status?.toLowerCase() === activeTab.toLowerCase();
  });

  // NEW: Handler to mark an accepted quotation's order as completed
  const handleCompleteOrder = async (e, quotationId) => {
    e.stopPropagation(); // Prevent navigating to quotation-response page
    try {
      // Get the quotation data first (we need customerId for the notification)
      const _quotationRef = doc(db, "quotations", quotationId);
      const _quotationSnap = await getDocs(query(
        collection(db, "quotations"),
        where("__name__", "==", quotationId)
      ));

      // Get quotation data from our local state instead
      const quotationData = quotations.find(q => q.id === quotationId);
      if (!quotationData) {
        alert("Quotation not found.");
        return;
      }

      // Find the order linked to this quotation
      const ordersQuery = query(
        collection(db, "orders"),
        where("quotationId", "==", quotationId)
      );
      const ordersSnap = await getDocs(ordersQuery);

      if (ordersSnap.empty) {
        // No order exists yet — create one from quotation data, then mark completed
        const newOrder = {
          customerId: quotationData.customerId || "",
          customer_id: quotationData.customerId || "",
          providerId: quotationData.providerId || "",
          quotationId: quotationId,
          serviceType: quotationData.serviceType || "Service",
          description: quotationData.description || quotationData.requirements || "",
          customerName: quotationData.customerName || "Customer",
          finalPrice: quotationData.proposedPrice || quotationData.grandTotal || quotationData.budget || 0,
          total_price: quotationData.proposedPrice || quotationData.grandTotal || quotationData.budget || 0,
          price: quotationData.proposedPrice || quotationData.grandTotal || quotationData.budget || 0,
          total: quotationData.proposedPrice || quotationData.grandTotal || quotationData.budget || 0,
          items: quotationData.items || [],
          status: "completed",
          createdAt: serverTimestamp(),
          created_at: new Date().toISOString(),
        };
        // Add tailorId or designerId based on provider type
        if (quotationData.providerType === "tailor") {
          newOrder.tailorId = quotationData.providerId;
        } else {
          newOrder.designerId = quotationData.providerId;
        }
        await addDoc(collection(db, "orders"), newOrder);
      } else {
        // Update all matching orders to "completed"
        for (const orderDoc of ordersSnap.docs) {
          await updateDoc(doc(db, "orders", orderDoc.id), { status: "completed" });
        }
      }

      // Update the quotation status to "completed"
      await updateDoc(doc(db, "quotations", quotationId), { status: "completed" });

      // Send a notification to the customer
      const providerName = quotationData.providerName || user?.name || "Your provider";
      const serviceDesc = quotationData.description || quotationData.serviceType || "your order";
      await addDoc(collection(db, "notifications"), {
        userId: quotationData.customerId,
        type: "order_completed",
        title: "Order Completed! ✅",
        message: `${providerName} has completed ${serviceDesc}. Thank you for choosing ClothStreetSL!`,
        quotationId: quotationId,
        read: false,
        createdAt: serverTimestamp(),
      });

      // Update local state so UI reflects immediately
      setQuotations((prev) =>
        prev.map((q) => q.id === quotationId ? { ...q, status: "completed" } : q)
      );
    } catch (err) {
      console.error("Complete order error:", err);
      alert("Failed to complete order. Please try again.");
    }
  };

  const stats = {
    pending: quotations.filter((q) => q.status === "pending").length,
    quoted: quotations.filter((q) => q.status === "quoted").length,
    accepted: quotations.filter((q) => q.status === "accepted" || q.status === "completed").length,
  };
  stats.total = stats.pending; // Incoming Requests only counts pending/new orders

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "—";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Sticky Professional Header ── */}
      <div className="bg-white border-b px-6 py-10 sticky top-0 z-30 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-5 mb-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quotation Requests</h1>
              <p className="text-sm text-slate-500 font-bold italic">Review new requirements and engage with potential clients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Incoming Requests", value: stats.total, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, bg: "bg-blue-50", accent: "text-blue-600" },
            { label: "Awaiting Quote", value: stats.pending, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" strokeWidth="2.5" /></svg>, bg: "bg-amber-50", accent: "text-amber-600" },
            { label: "Negotiating", value: stats.quoted, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16v1m4-12V3c0-1.105-1.343-2-3-2s-3 .895-3 2v2m0 16v2c0 1.105 1.343 2 3 2s3-.895 3-2v-2" /></svg>, bg: "bg-blue-50", accent: "text-blue-600" },
            { label: "Successful Bids", value: stats.accepted, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M5 13l4 4L19 7" /></svg>, bg: "bg-emerald-50", accent: "text-emerald-600" },
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

        {/* ── Interactive Filters ── */}
        <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {["All", "Pending", "Quoted", "Accepted", "Completed", "Rejected"].map((tab) => (
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

        {/* ── Quotation Stream ── */}
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
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => navigate(`/quotation-response/${q.id}`, { state: { quotation: q } })}
                >
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Brand Avatar */}
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-2xl text-white shrink-0 shadow-xl shadow-slate-200 group-hover:bg-blue-600 transition-colors">
                        {q.customerName?.charAt(0) || "?"}
                      </div>

                      {/* Content Engine */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {q.customerName || "Prototyping Session"}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text} border border-transparent group-hover:border-current/20`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
                            {style.label}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 font-bold mb-6 line-clamp-2 leading-relaxed italic">
                          "{q.requirements || "No specific design brief provided"}"
                        </p>

                        {/* Intelligence Row */}
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            Logged: {formatDate(q.createdAt)}
                          </span>
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            Milestone: {q.expectedDate || "TBA"}
                          </span>
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                            </svg>
                            {q.items?.length || 0} Components
                          </span>
                          {q.designImages?.length > 0 && (
                            <span className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-md text-blue-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                              </svg>
                              Assets Included
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Navigation Logic */}
                      <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all self-center shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* NEW: Complete Order button for accepted quotations */}
                  {q.status === "accepted" && (
                    <div className="px-8 pb-6 pt-0">
                      <button
                        onClick={(e) => handleCompleteOrder(e, q.id)}
                        className="w-full py-3 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Complete Order
                      </button>
                    </div>
                  )}

                  {/* Show completed badge for completed quotations */}
                  {q.status === "completed" && (
                    <div className="px-8 pb-6 pt-0">
                      <div className="w-full py-3 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 border border-blue-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Order Completed
                      </div>
                    </div>
                  )}
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
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">System Idle</h3>
            <p className="max-w-xs mx-auto text-slate-400 font-bold italic leading-relaxed">
              No active quotation requests found. New opportunities will be logged here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
