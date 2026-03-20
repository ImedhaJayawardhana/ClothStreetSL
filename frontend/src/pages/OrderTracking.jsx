import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getOrder } from "../api";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ── Leg definitions for each order type ── */
const LEGS = {
  standard: [
    { key: "pending", label: "Order Placed", icon: "📋" },
    { key: "confirmed", label: "Confirmed", icon: "✅" },
    { key: "shipped", label: "Shipped", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "🏠" },
  ],
  tailor: [
    { key: "pending", label: "Quotation Sent", icon: "📝" },
    { key: "quoted", label: "Quote Received", icon: "📩" },
    { key: "confirmed", label: "Quote Accepted & Paid", icon: "💳" },
    { key: "fabric_shipped", label: "Fabric Shipped to Tailor", icon: "📦" },
    { key: "received_by_tailor", label: "Received by Tailor", icon: "✂️" },
    { key: "tailoring", label: "Tailoring In Progress", icon: "🧵" },
    { key: "tailoring_done", label: "Tailoring Complete", icon: "👔" },
    { key: "shipped_to_customer", label: "Shipped to You", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "🏠" },
  ],
  designer: [
    { key: "pending", label: "Quotation Sent", icon: "📝" },
    { key: "quoted", label: "Quote Received", icon: "📩" },
    { key: "confirmed", label: "Quote Accepted & Paid", icon: "💳" },
    { key: "design_in_progress", label: "Design In Progress", icon: "🎨" },
    { key: "design_completed", label: "Design Complete", icon: "👗" },
    { key: "design_delivered", label: "Designs Delivered", icon: "📥" },
  ],
  combo: [
    { key: "pending", label: "Designer Quote Sent", icon: "📝" },
    { key: "quoted", label: "Designer Quote Received", icon: "📩" },
    { key: "confirmed", label: "Designer Paid", icon: "💳" },
    { key: "design_in_progress", label: "Design In Progress", icon: "🎨" },
    { key: "design_completed", label: "Design Complete", icon: "👗" },
    { key: "design_delivered", label: "Designs Delivered", icon: "📥" },
    { key: "tailor_quote_sent", label: "Tailor Quote Sent", icon: "✂️" },
    { key: "tailor_confirmed", label: "Tailor Confirmed", icon: "💳" },
    { key: "tailoring", label: "Tailoring In Progress", icon: "🧵" },
    { key: "tailoring_done", label: "Tailoring Complete", icon: "👔" },
    { key: "shipped_to_customer", label: "Shipped to You", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "🏠" },
  ],
};

/* ── Map quotation/order status to the correct leg key ── */
function resolveCurrentStep(order, quotation) {
  const status = (order.currentStep || order.status || "pending").toLowerCase().replace(/ /g, "_");

  // For quotation-based orders, use quotation status to find the right step
  if (quotation) {
    const qStatus = (quotation.status || "").toLowerCase();
    // Map quotation statuses to leg keys
    const qMap = {
      pending: "pending",
      quoted: "quoted",
      accepted: "confirmed",
      confirmed: "confirmed",
      design_in_progress: "design_in_progress",
      design_completed: "design_completed",
      design_delivered: "design_delivered",
      tailoring: "tailoring",
      tailoring_done: "tailoring_done",
      shipped_to_customer: "shipped_to_customer",
      shipped: "shipped",
      delivered: "delivered",
      completed: "delivered",
    };
    return qMap[qStatus] || status;
  }

  // For standard orders, map directly
  const sMap = {
    pending: "pending",
    confirmed: "confirmed",
    processing: "confirmed",
    shipped: "shipped",
    delivered: "delivered",
    completed: "delivered",
  };
  return sMap[status] || status;
}

/* ── Payment method display ── */
function getPaymentLabel(method) {
  switch (method) {
    case "card": return "Credit / Debit Card";
    case "bank": return "Bank Transfer";
    case "koko": return "Koko (BNPL)";
    case "cod": return "Cash on Delivery";
    default: return method || "—";
  }
}

/* ── Format Firestore timestamps or ISO strings ── */
function formatTimestamp(ts) {
  if (!ts) return "";
  if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  if (typeof ts === "string") return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return "";
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(null);

  // Fetch order from API if not passed via state
  useEffect(() => {
    if (order) return;
    const fetchOrder = async () => {
      try {
        const res = await getOrder(orderId);
        setOrder(res.data || res);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Could not load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, order]);

  // Fetch linked quotation for timeline data
  useEffect(() => {
    if (!order?.quotationId) return;
    const fetchQuotation = async () => {
      try {
        const snap = await getDoc(doc(db, "quotations", order.quotationId));
        if (snap.exists()) {
          setQuotation({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Failed to fetch quotation:", err);
      }
    };
    fetchQuotation();
  }, [order?.quotationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
        <p className="text-sm text-slate-500">{error || "We couldn't find this order."}</p>
        <button onClick={() => navigate("/orders")} className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-all">
          Back to My Orders
        </button>
      </div>
    );
  }

  /* ── Derive tracking data ── */
  const providerType = order.providerType || (quotation?.providerType) || "standard";
  const legs = LEGS[providerType] || LEGS.standard;
  const currentStep = resolveCurrentStep(order, quotation);
  const currentIdx = Math.max(0, legs.findIndex((l) => l.key === currentStep));
  const progressPercent = Math.max(0, Math.min(100, (currentIdx / (legs.length - 1)) * 100));

  /* ── Build display data ── */
  const itemNames = order.items?.map((i) => i.name).join(", ") || "Order";
  const totalPrice = order.total_price || order.finalPrice || order.amount || 0;
  const shippingAddress = order.shipping
    ? `${order.shipping.streetAddress || ""}, ${order.shipping.city || ""}, ${order.shipping.district || ""}`.replace(/^, |, $/g, "")
    : null;
  const orderDate = order.created_at || order.createdAt;
  const orderDateStr = orderDate ? new Date(orderDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null;

  /* ── Build timeline from order + quotation data ── */
  const buildTimeline = () => {
    if (order.timeline?.length > 0) return order.timeline;

    const events = [];
    const isQuotationBased = !!quotation;

    if (isQuotationBased) {
      // Quotation sent
      events.push({ step: "pending", date: formatTimestamp(quotation.createdAt), note: `Quotation request sent to ${quotation.providerName || "provider"}` });

      // Quote received
      if (quotation.quotedAt || ["quoted", "accepted", "design_in_progress", "design_completed", "design_delivered", "completed"].includes(quotation.status)) {
        events.push({ step: "quoted", date: formatTimestamp(quotation.quotedAt), note: `${quotation.providerName || "Provider"} sent you a quote` });
      }

      // Accepted & paid
      if (quotation.acceptedAt || ["accepted", "design_in_progress", "design_completed", "design_delivered", "completed"].includes(quotation.status)) {
        events.push({ step: "confirmed", date: formatTimestamp(quotation.acceptedAt), note: `You accepted the quotation and paid${quotation.paymentMethod ? ` via ${getPaymentLabel(quotation.paymentMethod)}` : ""}` });
      }

      // Designer-specific steps
      if (providerType === "designer" || providerType === "combo") {
        if (["design_in_progress", "design_completed", "design_delivered", "completed"].includes(quotation.status)) {
          events.push({ step: "design_in_progress", date: formatTimestamp(quotation.acceptedAt), note: `${quotation.providerName || "Designer"} started working on your design` });
        }
        if (["design_completed", "design_delivered", "completed"].includes(quotation.status)) {
          events.push({ step: "design_completed", date: formatTimestamp(quotation.designCompletedAt), note: "Design work is complete" });
        }
        if (["design_delivered", "completed"].includes(quotation.status)) {
          events.push({ step: "design_delivered", date: formatTimestamp(quotation.designDeliveredAt), note: "Design files delivered to you" });
        }
      }

      // Tailor-specific steps (after quotation)
      if (providerType === "tailor") {
        const tStatus = quotation.status;
        if (["fabric_shipped", "received_by_tailor", "tailoring", "tailoring_done", "shipped_to_customer", "delivered", "completed"].includes(tStatus)) {
          events.push({ step: "fabric_shipped", date: "", note: "Fabric dispatched to tailor's workshop" });
        }
        if (["received_by_tailor", "tailoring", "tailoring_done", "shipped_to_customer", "delivered", "completed"].includes(tStatus)) {
          events.push({ step: "received_by_tailor", date: "", note: `${quotation.providerName || "Tailor"} received the fabric` });
        }
        if (["tailoring", "tailoring_done", "shipped_to_customer", "delivered", "completed"].includes(tStatus)) {
          events.push({ step: "tailoring", date: "", note: "Tailoring work has begun" });
        }
        if (["tailoring_done", "shipped_to_customer", "delivered", "completed"].includes(tStatus)) {
          events.push({ step: "tailoring_done", date: "", note: "Your garment is ready" });
        }
        if (["shipped_to_customer", "delivered", "completed"].includes(tStatus)) {
          events.push({ step: "shipped_to_customer", date: "", note: "Your order has been shipped" });
        }
        if (["delivered", "completed"].includes(tStatus)) {
          events.push({ step: "delivered", date: "", note: "Order delivered successfully" });
        }
      }
    } else {
      // Standard order timeline
      events.push({ step: "pending", date: orderDateStr || "—", note: "Order placed successfully" });
      if (currentIdx >= 1) events.push({ step: "confirmed", date: "", note: "Order confirmed by seller" });
      if (currentIdx >= 2) events.push({ step: "shipped", date: "", note: "Order has been shipped" });
      if (currentIdx >= 3) events.push({ step: "delivered", date: "", note: "Order delivered" });
    }

    return events;
  };

  const displayTimeline = buildTimeline();

  /* ── Provider badge ── */
  const providerIcon = providerType === "designer" ? "🎨" : providerType === "tailor" ? "✂️" : providerType === "combo" ? "✂️🎨" : null;
  const providerName = order.providerName || quotation?.providerName;
  const providerLabel = providerType === "designer" ? "Designer" : providerType === "tailor" ? "Tailor" : providerType === "combo" ? "Designer + Tailor" : null;

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-600 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate("/orders")} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-white/80 mb-4 transition-colors cursor-pointer text-white/90">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Orders
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">Order Tracking</h1>
              <p className="text-sm text-white/70">{order.id || orderId}</p>
            </div>
            {providerLabel && (
              <span className="ml-auto px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
                {providerIcon} {providerLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ══════════ ORDER SUMMARY ══════════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-900 truncate">{itemNames}</h2>
              {orderDateStr && <p className="text-sm text-slate-500 mt-0.5">Placed on {orderDateStr}</p>}
              {providerName && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700">
                  {providerIcon} {providerName}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {totalPrice > 0 && (
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500">Total</p>
                  <p className="text-lg font-bold text-slate-900">LKR {totalPrice.toLocaleString()}</p>
                </div>
              )}
              {(order.deadline || quotation?.completionDate) && (
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-500">Expected By</p>
                  <p className="text-sm font-bold text-slate-900">{order.deadline || quotation?.completionDate}</p>
                </div>
              )}
            </div>
          </div>

          {/* Extra order details */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {order.items?.length > 0 && (
              <div>
                <span className="text-slate-500">Items: </span>
                <span className="font-semibold text-slate-700">
                  {order.items.map((i) => `${i.name} (${i.quantity}${i.unit || "m"})`).join(", ")}
                </span>
              </div>
            )}
            {(order.payment_method || quotation?.paymentMethod) && (
              <div>
                <span className="text-slate-500">Payment: </span>
                <span className="font-semibold text-slate-700">{getPaymentLabel(order.payment_method || quotation?.paymentMethod)}</span>
              </div>
            )}
            {shippingAddress && (
              <div className="sm:col-span-2">
                <span className="text-slate-500">Shipping to: </span>
                <span className="font-semibold text-slate-700">
                  {order.shipping?.fullName ? `${order.shipping.fullName}, ` : ""}{shippingAddress}
                </span>
              </div>
            )}
            {order.delivery_method && (
              <div>
                <span className="text-slate-500">Delivery: </span>
                <span className="font-semibold text-slate-700 capitalize">{order.delivery_method.replace(/_/g, " ")}</span>
              </div>
            )}
            {quotation?.description && (
              <div className="sm:col-span-2">
                <span className="text-slate-500">Service: </span>
                <span className="font-semibold text-slate-700">{quotation.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* ══════════ MULTI-LEG PROGRESS BAR ══════════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {providerType === "standard" ? "Delivery Journey" : `${providerLabel || "Service"} Journey`}
            <span className="text-xs font-medium text-slate-400 ml-auto">
              {Math.round(progressPercent)}% complete
            </span>
          </h3>

          {/* ── Horizontal stepper (desktop) ── */}
          <div className="hidden sm:block">
            <div className="relative mb-2">
              <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 rounded-full" />
              <div className="absolute top-5 left-6 h-1 bg-gradient-to-r from-amber-500 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `calc(${progressPercent}% - 48px + 48px * ${progressPercent / 100})` }} />
            </div>
            <div className="flex justify-between relative">
              {legs.map((leg, idx) => {
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={leg.key} className="flex flex-col items-center" style={{ width: `${100 / legs.length}%` }}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all z-10 ${isCompleted ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-200" : isCurrent ? "bg-white border-amber-500 shadow-lg shadow-amber-100 ring-4 ring-amber-100" : "bg-white border-slate-200"}`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <span className={isCurrent ? "text-base" : "text-sm opacity-60"}>{leg.icon}</span>
                      )}
                    </div>
                    <p className={`text-[11px] font-semibold text-center mt-2 leading-tight max-w-[80px] ${isCompleted ? "text-amber-600" : isCurrent ? "text-slate-800" : "text-slate-400"}`}>
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
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 shrink-0 z-10 ${isCompleted ? "bg-amber-600 border-amber-600 text-white" : isCurrent ? "bg-white border-amber-500 ring-4 ring-amber-100" : "bg-white border-slate-200"}`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <span className={`text-xs ${isCurrent ? "" : "opacity-60"}`}>{leg.icon}</span>
                      )}
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 min-h-[24px] ${isCompleted ? "bg-amber-400" : "bg-slate-100"}`} />}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${isCompleted ? "text-amber-600" : isCurrent ? "text-slate-800" : "text-slate-400"}`}>{leg.label}</p>
                    {isCurrent && <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Current</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════ TIMELINE ══════════ */}
        {displayTimeline.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              Activity Timeline
            </h3>
            <div className="space-y-0">
              {displayTimeline.map((event, idx) => {
                const isLatest = idx === displayTimeline.length - 1;
                const legInfo = legs.find((l) => l.key === event.step);
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full shrink-0 z-10 ${isLatest ? "bg-amber-600 ring-4 ring-amber-100" : "bg-slate-300"}`} />
                      {idx < displayTimeline.length - 1 && <div className="w-0.5 flex-1 min-h-[40px] bg-slate-100" />}
                    </div>
                    <div className="pb-5 -mt-1 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm">{legInfo?.icon || "📌"}</span>
                        <p className={`text-sm font-bold ${isLatest ? "text-slate-900" : "text-slate-600"}`}>{legInfo?.label || event.step}</p>
                      </div>
                      {event.note && <p className="text-xs text-slate-500 mb-1">{event.note}</p>}
                      {event.date && <p className="text-[11px] text-slate-400">{event.date}{event.time ? ` · ${event.time}` : ""}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════ DESIGNER DELIVERABLES (if applicable) ══════════ */}
        {quotation?.designDeliverables?.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-emerald-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              📦 Design Deliverables
            </h3>
            {quotation.designDeliveryMessage && (
              <p className="text-sm text-slate-600 bg-amber-50 rounded-xl p-4 mb-4 whitespace-pre-wrap border border-amber-100">
                <span className="font-bold text-amber-700 block mb-1">Message from Designer:</span>
                {quotation.designDeliveryMessage}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quotation.designDeliverables.map((url, idx) => (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer"
                  className="group rounded-xl border-2 border-slate-100 hover:border-amber-200 p-3 flex flex-col items-center gap-2 transition-all hover:shadow-md">
                  <div className="w-full aspect-square rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center">
                    {url.toLowerCase().includes('.pdf') ? (
                      <span className="text-4xl">📄</span>
                    ) : (
                      <img src={url} alt={`Design ${idx + 1}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-amber-600 group-hover:text-amber-700">Download File {idx + 1}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ HELP BOX ══════════ */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-50 rounded-2xl border border-amber-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800 mb-1">Need help with your order?</h4>
              <p className="text-xs text-slate-500 mb-3">Contact us if you have questions about the delivery or tracking.</p>
              <button onClick={() => window.open("mailto:support@clothstreet.lk", "_blank")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
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
