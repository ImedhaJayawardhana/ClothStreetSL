import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

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

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "—";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading request…</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Request not found</h2>
          <button onClick={() => navigate("/quotation-inbox")} className="text-violet-600 font-semibold hover:underline cursor-pointer">
            ← Back to Inbox
          </button>
        </div>
      </div>
    );
  }

  const isAlreadyQuoted = quotation.status === "quoted" || quotation.status === "accepted" || quotation.status === "rejected";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/quotation-inbox")}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Quote Request Details</h1>
            <p className="text-purple-200 text-sm">{quotation.customerName || "Customer"} · {formatDate(quotation.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ══════════ CUSTOMER INFO ══════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
              {quotation.customerName?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{quotation.customerName}</h2>
              <p className="text-sm text-gray-500">{quotation.customerEmail}</p>
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
              quotation.status === "pending" ? "bg-amber-100 text-amber-700" :
              quotation.status === "quoted" ? "bg-blue-100 text-blue-700" :
              quotation.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-red-700"
            }`}>
              {quotation.status}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Expected By</p>
              <p className="text-sm font-bold text-gray-900">{quotation.expectedDate || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Gender</p>
              <p className="text-sm font-bold text-gray-900 capitalize">{quotation.gender || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Items</p>
              <p className="text-sm font-bold text-gray-900">{quotation.items?.length || 0} selected</p>
            </div>
          </div>
        </div>

        {/* ══════════ SELECTED ITEMS ══════════ */}
        {quotation.items?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              </svg>
              Selected Products
            </h3>
            <div className="divide-y divide-gray-100">
              {quotation.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} {item.unit || "m"}</p>
                  </div>
                  <p className="text-sm font-bold text-violet-600 whitespace-nowrap">
                    Rs {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Material Total</span>
              <span className="text-base font-bold text-gray-900">Rs {materialTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* ══════════ REQUIREMENTS ══════════ */}
        {quotation.requirements && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Customer Requirements
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100 whitespace-pre-wrap">
              {quotation.requirements}
            </p>
          </div>
        )}

        {/* ══════════ DESIGN IMAGES ══════════ */}
        {quotation.designImages?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
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
                  className="rounded-xl overflow-hidden aspect-square bg-gray-100 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <img src={url} alt={`Design ${idx + 1}`} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ MEASUREMENTS ══════════ */}
        {quotation.measurements && Object.keys(quotation.measurements).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Body Measurements
              <span className="text-xs text-gray-400 font-normal capitalize">({quotation.gender})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(quotation.measurements)
                .filter(([, val]) => val)
                .map(([key, val]) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                    <p className="text-xs text-gray-400 font-medium capitalize mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {val}<span className="text-xs text-gray-400 ml-0.5">in</span>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ══════════ PRICING FORM  (only if pending) ══════════ */}
        {!isAlreadyQuoted ? (
          <>
            <div className="bg-white rounded-2xl border-2 border-violet-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8" />
                  <path d="M12 18V6" />
                </svg>
                Your Quotation
              </h3>
              <p className="text-sm text-gray-500 mb-6">Enter your pricing to send the customer a quote</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {/* Labor Charge */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Labor / Service Charge *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rs</span>
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
                      placeholder="e.g. 5000"
                      value={laborCharge}
                      onChange={(e) => setLaborCharge(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                {/* Additional Charges */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Additional Charges
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rs</span>
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  If Additional Charges, Describe
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
                  placeholder="e.g. Thread, buttons, express finishing..."
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                />
              </div>

              {/* Completion Date */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Possible Completion Date *
                </label>
                <input
                  type="date"
                  className="max-w-xs px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  min={minDate}
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Remarks / Notes for Customer
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all resize-y min-h-[80px]"
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
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 rounded-2xl p-4 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Preview Bill
              </span>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${showBillPreview ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* ── Bill Preview ── */}
            {showBillPreview && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Quotation Bill Preview</h3>
                  <p className="text-xs text-gray-400 mt-1">This is what the customer will see</p>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Bill header */}
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 text-white">
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
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Materials</div>
                    {quotation.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{item.name} × {item.quantity} {item.unit || "m"}</span>
                        <span className="font-semibold text-gray-900">Rs {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}</span>
                      </div>
                    ))}

                    <hr className="border-gray-100 my-2" />

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Material Subtotal</span>
                      <span className="font-semibold text-gray-700">Rs {materialTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Labor / Service Charge</span>
                      <span className="font-semibold text-gray-700">Rs {labor.toLocaleString()}</span>
                    </div>
                    {additional > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          Additional{additionalNote ? ` (${additionalNote})` : ""}
                        </span>
                        <span className="font-semibold text-gray-700">Rs {additional.toLocaleString()}</span>
                      </div>
                    )}

                    <hr className="border-gray-200 my-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">Grand Total</span>
                      <span className="text-xl font-extrabold text-violet-600">Rs {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Completion date footer */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-sm">
                    <span className="text-gray-500">Est. Completion</span>
                    <span className="font-bold text-gray-900">{completionDate || "Not set"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                className="px-8 py-4 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-2xl text-sm transition-colors cursor-pointer"
              >
                Decline Request
              </button>
            </div>
          </>
        ) : (
          /* ── Already responded card ── */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
              quotation.status === "quoted" ? "bg-blue-50" :
              quotation.status === "accepted" ? "bg-emerald-50" :
              "bg-red-50"
            }`}>
              {quotation.status === "quoted" ? "💰" :
               quotation.status === "accepted" ? "✅" : "❌"}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {quotation.status === "quoted" ? "Quotation Sent" :
               quotation.status === "accepted" ? "Quotation Accepted!" :
               "Request Declined"}
            </h3>
            {quotation.grandTotal && (
              <p className="text-2xl font-extrabold text-violet-600 mb-2">Rs {quotation.grandTotal.toLocaleString()}</p>
            )}
            {quotation.completionDate && (
              <p className="text-sm text-gray-500">Completion by: <span className="font-semibold">{quotation.completionDate}</span></p>
            )}
            <button
              onClick={() => navigate("/quotation-inbox")}
              className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              ← Back to Inbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
