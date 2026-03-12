import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ── Leg definitions ── */
const LEGS = {
  standard: [
    { key: "ordered", label: "Order Placed", icon: "📋" },
    { key: "confirmed", label: "Confirmed", icon: "✅" },
    { key: "shipped", label: "Shipped", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "🏠" },
  ],
  tailor: [
    { key: "ordered", label: "Order Placed", icon: "📋" },
    { key: "confirmed", label: "Confirmed", icon: "✅" },
    { key: "fabric_shipped", label: "Fabric Shipped to Tailor", icon: "📦" },
    { key: "received_by_tailor", label: "Received by Tailor", icon: "✂️" },
    { key: "tailoring", label: "Tailoring In Progress", icon: "🧵" },
    { key: "tailoring_done", label: "Tailoring Complete", icon: "👔" },
    { key: "shipped_to_customer", label: "Shipped to You", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "🏠" },
  ],
  designer: [
    { key: "ordered", label: "Order Placed", icon: "📋" },
    { key: "confirmed", label: "Confirmed", icon: "✅" },
    { key: "fabric_shipped", label: "Fabric Shipped to Designer", icon: "📦" },
    { key: "received_by_designer", label: "Received by Designer", icon: "🎨" },
    { key: "designing", label: "Design In Progress", icon: "✏️" },
    { key: "design_done", label: "Design Complete", icon: "👗" },
    { key: "shipped_to_customer", label: "Shipped to You", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "🏠" },
  ],
};

/* ── Mock data for demo (used when no Firestore data) ── */
const MOCK_TRACKING = {
  orderId: "ORD-2026-143",
  product: "Premium Silk Fabric - Navy Blue",
  seller: "Lanka Textiles Co.",
  providerName: "Nimal Perera",
  providerType: "tailor",
  amount: 45000,
  currentStep: "tailoring",
  expectedDate: "3/24/2026",
  timeline: [
    { step: "ordered", date: "Mar 1, 2026", time: "10:30 AM", note: "Order placed successfully" },
    { step: "confirmed", date: "Mar 1, 2026", time: "2:15 PM", note: "Seller confirmed the order" },
    { step: "fabric_shipped", date: "Mar 3, 2026", time: "9:00 AM", note: "Fabric dispatched to Nimal Perera's workshop" },
    { step: "received_by_tailor", date: "Mar 5, 2026", time: "11:45 AM", note: "Nimal Perera received the fabric" },
    { step: "tailoring", date: "Mar 6, 2026", time: "8:00 AM", note: "Work has begun on your order" },
  ],
};

export default function OrderTracking() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (order) return;
    const fetchOrder = async () => {
      try {
        const snap = await getDoc(doc(db, "orders", orderId));
        if (snap.exists()) {
          setOrder({ id: snap.id, ...snap.data() });
        } else {
          // Use mock data for demo
          setOrder(MOCK_TRACKING);
        }
      } catch {
        setOrder(MOCK_TRACKING);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const trackingData = order || MOCK_TRACKING;
  const providerType = trackingData.providerType || "standard";
  const legs = LEGS[providerType] || LEGS.standard;
  const currentStep = trackingData.currentStep || trackingData.status?.toLowerCase().replace(/ /g, "_") || "ordered";
  const currentIdx = legs.findIndex((l) => l.key === currentStep);
  const timeline = trackingData.timeline || [];
  const progressPercent = Math.max(0, Math.min(100, ((currentIdx) / (legs.length - 1)) * 100));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white mb-4 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Order Tracking</h1>
              <p className="text-purple-200 text-sm">{trackingData.orderId || orderId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ══════════ ORDER SUMMARY ══════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">{trackingData.product || "Order"}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{trackingData.seller || "—"}</p>
              {trackingData.providerName && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-violet-50 border border-violet-100 text-xs font-semibold text-violet-700">
                  {providerType === "tailor" ? "✂️" : "🎨"} {trackingData.providerName}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {trackingData.amount && (
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">Amount</p>
                  <p className="text-lg font-bold text-gray-900">Rs {trackingData.amount.toLocaleString()}</p>
                </div>
              )}
              {trackingData.expectedDate && (
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">Expected By</p>
                  <p className="text-sm font-bold text-gray-900">{trackingData.expectedDate}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════ MULTI-LEG PROGRESS BAR ══════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Delivery Journey
            <span className="text-xs font-medium text-gray-400 ml-auto">
              {Math.round(progressPercent)}% complete
            </span>
          </h3>

          {/* ── Horizontal stepper (desktop) ── */}
          <div className="hidden sm:block">
            {/* Progress bar track */}
            <div className="relative mb-2">
              <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 rounded-full" />
              <div
                className="absolute top-5 left-6 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `calc(${progressPercent}% - 48px + 48px * ${progressPercent / 100})` }}
              />
            </div>

            <div className="flex justify-between relative">
              {legs.map((leg, idx) => {
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                //const isFuture = idx > currentIdx;

                return (
                  <div key={leg.key} className="flex flex-col items-center" style={{ width: `${100 / legs.length}%` }}>
                    {/* Circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all z-10 ${isCompleted
                          ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200"
                          : isCurrent
                            ? "bg-white border-violet-500 shadow-lg shadow-violet-100 ring-4 ring-violet-100"
                            : "bg-gray-100 border-gray-200 text-gray-400"
                        }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className={isCurrent ? "text-base" : "text-sm opacity-60"}>{leg.icon}</span>
                      )}
                    </div>
                    {/* Label */}
                    <p className={`text-[11px] font-semibold text-center mt-2 leading-tight max-w-[80px] ${isCompleted ? "text-violet-600" : isCurrent ? "text-gray-900" : "text-gray-400"
                      }`}>
                      {leg.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Vertical stepper (mobile) ── */}
          <div className="sm:hidden space-y-0">
            {legs.map((leg, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isLast = idx === legs.length - 1;

              return (
                <div key={leg.key} className="flex gap-3">
                  {/* Vertical line + circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 shrink-0 z-10 ${isCompleted
                          ? "bg-violet-600 border-violet-600 text-white"
                          : isCurrent
                            ? "bg-white border-violet-500 ring-4 ring-violet-100"
                            : "bg-gray-100 border-gray-200"
                        }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className={`text-xs ${isCurrent ? "" : "opacity-60"}`}>{leg.icon}</span>
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-[24px] ${isCompleted ? "bg-violet-400" : "bg-gray-200"}`} />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${isCompleted ? "text-violet-600" : isCurrent ? "text-gray-900" : "text-gray-400"
                      }`}>
                      {leg.label}
                    </p>
                    {isCurrent && (
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════ TIMELINE ══════════ */}
        {timeline.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              Activity Timeline
            </h3>

            <div className="space-y-0">
              {timeline.map((event, idx) => {
                const isLatest = idx === timeline.length - 1;
                const legInfo = legs.find((l) => l.key === event.step);

                return (
                  <div key={idx} className="flex gap-4">
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full shrink-0 z-10 ${isLatest ? "bg-violet-600 ring-4 ring-violet-100" : "bg-gray-300"
                        }`} />
                      {idx < timeline.length - 1 && (
                        <div className="w-0.5 flex-1 min-h-[40px] bg-gray-200" />
                      )}
                    </div>

                    {/* Event info */}
                    <div className="pb-5 -mt-1 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm">{legInfo?.icon || "📌"}</span>
                        <p className={`text-sm font-bold ${isLatest ? "text-gray-900" : "text-gray-700"}`}>
                          {legInfo?.label || event.step}
                        </p>
                      </div>
                      {event.note && (
                        <p className="text-xs text-gray-500 mb-1">{event.note}</p>
                      )}
                      <p className="text-[11px] text-gray-400">
                        {event.date}{event.time ? ` · ${event.time}` : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════ HELP BOX ══════════ */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-1">Need help with your order?</h4>
              <p className="text-xs text-gray-600 mb-3">
                Contact us if you have questions about the delivery or tracking.
              </p>
              <button
                onClick={() => window.open("mailto:support@clothstreet.lk", "_blank")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
