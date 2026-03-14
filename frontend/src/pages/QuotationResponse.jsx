import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { doc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function QuotationResponse() {
  const { quotationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quotation, setQuotation] = useState(location.state?.quotation || null);
  const [loading, setLoading] = useState(!location.state?.quotation);

  /* ── Pricing form ── */
  const [laborCharge, setLaborCharge] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);

  /* ── Fetch from Firestore if not passed via state ── */
  useEffect(() => {
    if (quotation) return;
    const fetchQuotation = async () => {
      try {
        const snap = await getDoc(doc(db, "quotations", quotationId));
        if (snap.exists()) {
          setQuotation({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error fetching quotation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
  }, [quotationId, quotation]);

  /* ── Bill calculations ── */
  const materialTotal = quotation?.items?.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0
  ) || 0;
  const labor = parseFloat(laborCharge) || 0;
  const additional = parseFloat(additionalCharges) || 0;
  const grandTotal = materialTotal + labor + additional;

  /* ── Min completion date (tomorrow) ── */
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  /* ── Submit quotation ── */
  const handleSubmit = async () => {
    if (!labor) {
      toast.error("Please enter a labor charge.");
      return;
    }
    if (!completionDate) {
      toast.error("Please set a completion date.");
      return;
    }

    setSubmitting(true);
    try {
      await updateDoc(doc(db, "quotations", quotationId), {
        status: "quoted",
        laborCharge: labor,
        additionalCharges: additional,
        additionalNote: additionalNote.trim(),
        completionDate: completionDate,
        providerRemarks: remarks.trim(),
        grandTotal: grandTotal,
        quotedAt: serverTimestamp(),
        quotedBy: user?.uid || "",
      });

      toast.success("Quotation sent to customer!");
      navigate("/quotation-inbox");
    } catch (err) {
      console.error("Error sending quotation:", err);
      toast.error("Failed to send quotation.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Handle declining ── */
  const handleDecline = async () => {
    if (!window.confirm("Are you sure you want to decline this request?")) return;
    try {
      await updateDoc(doc(db, "quotations", quotationId), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        rejectedBy: user?.uid || "",
      });
      toast.success("Request declined.");
      navigate("/quotation-inbox");
    } catch (err) {
      console.error("Error declining:", err);
      toast.error("Failed to decline request.");
    }
  };

  // NEW: Complete Order handler
  const handleCompleteOrder = async () => {
    if (!quotation) return;
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("quotationId", "==", quotationId)
      );
      const ordersSnap = await getDocs(ordersQuery);

      if (ordersSnap.empty) {
        // Create an order if none exists
        const newOrder = {
          customerId: quotation.customerId || "",
          customer_id: quotation.customerId || "",
          providerId: quotation.providerId || "",
          quotationId: quotationId,
          serviceType: quotation.serviceType || "Service",
          description: quotation.description || quotation.requirements || "",
          customerName: quotation.customerName || "Customer",
          finalPrice: quotation.proposedPrice || quotation.grandTotal || quotation.budget || 0,
          total_price: quotation.proposedPrice || quotation.grandTotal || quotation.budget || 0,
          price: quotation.proposedPrice || quotation.grandTotal || quotation.budget || 0,
          total: quotation.proposedPrice || quotation.grandTotal || quotation.budget || 0,
          items: quotation.items || [],
          status: "completed",
          createdAt: serverTimestamp(),
          created_at: new Date().toISOString(),
        };
        if (quotation.providerType === "tailor") newOrder.tailorId = quotation.providerId;
        else newOrder.designerId = quotation.providerId;

        await addDoc(collection(db, "orders"), newOrder);
      } else {
        // Update existing orders
        for (const orderDoc of ordersSnap.docs) {
          await updateDoc(doc(db, "orders", orderDoc.id), { status: "completed" });
        }
      }

      await updateDoc(doc(db, "quotations", quotationId), { status: "completed" });

      const providerName = quotation.providerName || user?.name || "Your provider";
      const serviceDesc = quotation.description || quotation.serviceType || "your order";
      await addDoc(collection(db, "notifications"), {
        userId: quotation.customerId,
        type: "order_completed",
        title: "Order Completed! ✅",
        message: `${providerName} has completed ${serviceDesc}. Thank you for choosing ClothStreetSL!`,
        quotationId: quotationId,
        read: false,
        createdAt: serverTimestamp(),
      });

      setQuotation({ ...quotation, status: "completed" });
      toast.success("Order marked as completed!");
    } catch (err) {
      console.error("Complete order error:", err);
      toast.error("Failed to complete order.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "—";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading request…</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Request not found</h2>
          <button onClick={() => navigate("/quotation-inbox")} className="text-violet-600 font-semibold hover:underline cursor-pointer">
            ← Back to Inbox
          </button>
        </div>
      </div>
    );
  }

  const isAlreadyQuoted = quotation.status === "quoted" || quotation.status === "accepted" || quotation.status === "rejected" || quotation.status === "completed";

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/quotation-inbox")}
            className="w-9 h-9 rounded-xl hover: border flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">Quote Request Details</h1>
            <p className="text-sm">{quotation.customerName || "Customer"} · {formatDate(quotation.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ══════════ CUSTOMER INFO ══════════ */}
        <div className="rounded-2xl border shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-xl shrink-0">
              {quotation.customerName?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold">{quotation.customerName}</h2>
              <p className="text-sm">{quotation.customerEmail}</p>
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${quotation.status === "pending" ? "bg-amber-100 text-amber-700" :
              quotation.status === "quoted" ? "" :
                quotation.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                  ""
              }`}>
              {quotation.status}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-xl p-3 border">
              <p className="text-xs font-medium mb-0.5">Expected By</p>
              <p className="text-sm font-bold">{quotation.expectedDate || "—"}</p>
            </div>
            <div className="rounded-xl p-3 border">
              <p className="text-xs font-medium mb-0.5">Gender</p>
              <p className="text-sm font-bold capitalize">{quotation.gender || "—"}</p>
            </div>
            <div className="rounded-xl p-3 border">
              <p className="text-xs font-medium mb-0.5">Items</p>
              <p className="text-sm font-bold">{quotation.items?.length || 0} selected</p>
            </div>
          </div>
        </div>

        {/* ══════════ SELECTED ITEMS ══════════ */}
        {quotation.items?.length > 0 && (
          <div className="rounded-2xl border shadow-sm p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              </svg>
              Selected Products
            </h3>
            <div className="divide-y divide-gray-100">
              {quotation.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-xs">{item.quantity} {item.unit || "m"}</p>
                  </div>
                  <p className="text-sm font-bold text-violet-600 whitespace-nowrap">
                    LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between items-center">
              <span className="text-sm font-medium">Material Total</span>
              <span className="text-base font-bold">LKR {materialTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* ══════════ REQUIREMENTS ══════════ */}
        {quotation.requirements && (
          <div className="rounded-2xl border shadow-sm p-6">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Customer Requirements
            </h3>
            <p className="text-sm leading-relaxed rounded-xl p-4 border whitespace-pre-wrap">
              {quotation.requirements}
            </p>
          </div>
        )}

        {/* ══════════ DESIGN IMAGES ══════════ */}
        {quotation.designImages?.length > 0 && (
          <div className="rounded-2xl border shadow-sm p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Reference Images ({quotation.designImages.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {quotation.designImages.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl overflow-hidden aspect-square border hover:shadow-lg transition-shadow"
                >
                  <img src={url} alt={`Design ${idx + 1}`} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ MEASUREMENTS ══════════ */}
        {quotation.measurements && Object.keys(quotation.measurements).length > 0 && (
          <div className="rounded-2xl border shadow-sm p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Body Measurements
              <span className="text-xs font-normal capitalize">({quotation.gender})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(quotation.measurements)
                .filter(([, val]) => val)
                .map(([key, val]) => (
                  <div key={key} className="rounded-xl p-3 border text-center">
                    <p className="text-xs font-medium capitalize mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-lg font-bold">
                      {val}<span className="text-xs ml-0.5">in</span>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ══════════ PRICING FORM (only if pending) ══════════ */}
        {!isAlreadyQuoted ? (
          <>
            <div className="rounded-2xl border-2 border-violet-200 shadow-sm p-6">
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8" />
                  <path d="M12 18V6" />
                </svg>
                Your Quotation
              </h3>
              <p className="text-sm mb-6">Enter your pricing to send the customer a quote</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {/* Labor Charge */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Labor / Service Charge *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold">LKR </span>
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
                      placeholder="e.g. 5000"
                      value={laborCharge}
                      onChange={(e) => setLaborCharge(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                {/* Additional Charges */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Additional Charges
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold">LKR </span>
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
                      placeholder="e.g. 1000"
                      value={additionalCharges}
                      onChange={(e) => setAdditionalCharges(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Additional charges note */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  If Additional Charges, Describe
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
                  placeholder="e.g. Thread, buttons, express finishing..."
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                />
              </div>

              {/* Completion Date */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Possible Completion Date *
                </label>
                <input
                  type="date"
                  className="max-w-xs px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  min={minDate}
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Remarks / Notes for Customer
                </label>
                <textarea
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all resize-y min-h-[80px]"
                  placeholder="Any notes, conditions, or details you want to share..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* ── Bill Preview Toggle ── */}
            <button
              onClick={() => setShowBillPreview(!showBillPreview)}
              className="w-full border hover: rounded-2xl p-4 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Preview Bill
              </span>
              <svg className={`w-5 h-5 transition-transform ${showBillPreview ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* ── Bill Preview ── */}
            {showBillPreview && (
              <div className="rounded-2xl border shadow-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold">Quotation Bill Preview</h3>
                  <p className="text-xs mt-1">This is what the customer will see</p>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  {/* Bill header */}
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-violet-200 uppercase tracking-wider font-semibold">Quotation From</p>
                        <p className="text-base font-bold">{quotation.providerName || user?.displayName || "Provider"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-violet-200 uppercase tracking-wider font-semibold">Date</p>
                        <p className="text-sm font-semibold">{new Date().toLocaleDateString("en-GB")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bill body */}
                  <div className="px-6 py-4 space-y-3">
                    {/* Material items */}
                    <div className="text-xs font-bold uppercase tracking-wider mb-2">Materials</div>
                    {quotation.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="">{item.name} × {item.quantity} {item.unit || "m"}</span>
                        <span className="font-semibold">LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}</span>
                      </div>
                    ))}

                    <hr className="my-2" />

                    <div className="flex justify-between items-center text-sm">
                      <span className="">Material Subtotal</span>
                      <span className="font-semibold">LKR {materialTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="">Labor / Service Charge</span>
                      <span className="font-semibold">LKR {labor.toLocaleString()}</span>
                    </div>
                    {additional > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="">
                          Additional{additionalNote ? ` (${additionalNote})` : ""}
                        </span>
                        <span className="font-semibold">LKR {additional.toLocaleString()}</span>
                      </div>
                    )}

                    <hr className="my-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold">Grand Total</span>
                      <span className="text-xl font-extrabold text-violet-600">LKR {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Completion date footer */}
                  <div className="px-6 py-3 border-t flex justify-between items-center text-sm">
                    <span className="">Est. Completion</span>
                    <span className="font-bold">{completionDate || "Not set"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send Quotation
                  </>
                )}
              </button>

              <button
                onClick={handleDecline}
                className="px-8 py-4 border hover: font-bold rounded-2xl text-sm transition-colors cursor-pointer"
              >
                Decline Request
              </button>
            </div>
          </>
        ) : (
          /* ── Already responded card ── */
          <div className="rounded-2xl border shadow-sm p-6 text-center">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${quotation.status === "quoted" ? "" :
              quotation.status === "accepted" ? "bg-emerald-50" :
                quotation.status === "completed" ? "bg-blue-50" :
                  ""
              }`}>
              {quotation.status === "quoted" ? "💰" :
                quotation.status === "accepted" ? "✅" :
                  quotation.status === "completed" ? "📦" : "❌"}
            </div>
            <h3 className="text-lg font-bold mb-1">
              {quotation.status === "quoted" ? "Quotation Sent" :
                quotation.status === "accepted" ? "Quotation Accepted!" :
                  quotation.status === "completed" ? "Order Completed!" :
                    "Request Declined"}
            </h3>
            {quotation.grandTotal && (
              <p className="text-2xl font-extrabold text-violet-600 mb-2">LKR {quotation.grandTotal.toLocaleString()}</p>
            )}
            {quotation.completionDate && (
              <p className="text-sm">Completion by: <span className="font-semibold">{quotation.completionDate}</span></p>
            )}

            {quotation.status === "completed" && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-left my-6 mx-auto max-w-sm">
                <p className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Order Details</p>

                {/* Items list */}
                <div className="space-y-2 mb-4">
                  {quotation.items?.length > 0 ? quotation.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-sm pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                      <span className="text-slate-600 pr-4">{item.name || item.item || "Custom Item"} <span className="font-semibold text-slate-400">x{item.quantity || 1}</span></span>
                      <span className="font-bold text-slate-800 shrink-0">LKR {(item.unitPrice || item.price || 0).toLocaleString()}</span>
                    </div>
                  )) : (
                    <div className="flex justify-between items-start text-sm">
                      <span className="text-slate-600 pr-4">{quotation.serviceType || "Custom Design Service"}</span>
                      <span className="font-bold text-slate-800 shrink-0">LKR {(quotation.grandTotal || quotation.budget || 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Additional details */}
                {(quotation.description || quotation.requirements) && (
                  <div className="text-sm">
                    <p className="font-bold text-slate-700 mb-1">Requirements:</p>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">{quotation.description || quotation.requirements}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons for accepted status */}
            {quotation.status === "accepted" && (
              <div className="mt-6">
                <button
                  onClick={handleCompleteOrder}
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Complete Order Now
                </button>
              </div>
            )}

            <button
              onClick={() => navigate("/quotation-inbox")}
              className="mt-4 px-6 py-2 hover: font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              ← Back to Inbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
