import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function QuotationReview() {
  const { quotationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quotation, setQuotation] = useState(location.state?.quotation || null);
  const [loading, setLoading] = useState(!location.state?.quotation);
  const [processing, setProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    if (quotation) return;
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "quotations", quotationId));
        if (snap.exists()) setQuotation({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error("Error fetching quotation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [quotationId, quotation]);

  /* ── Accept quotation ── */
  const handleAccept = async () => {
    setProcessing(true);
    try {
      await updateDoc(doc(db, "quotations", quotationId), {
        status: "accepted",
        acceptedAt: serverTimestamp(),
        acceptedBy: user?.uid || "",
        paymentMethod: paymentMethod,
      });
      toast.success("Quotation accepted! Your order is being processed.");
      navigate("/orders");
    } catch (err) {
      console.error("Error accepting:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  /* ── Reject quotation ── */
  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject this quotation?")) return;
    setProcessing(true);
    try {
      await updateDoc(doc(db, "quotations", quotationId), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        rejectedBy: user?.uid || "",
      });
      toast.success("Quotation declined.");
      navigate("/orders");
    } catch (err) {
      console.error("Error rejecting:", err);
      toast.error("Something went wrong.");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (ts) => {
    if (!ts?.seconds) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Quotation not found</h2>
          <button onClick={() => navigate("/orders")} className="text-violet-600 font-semibold hover:underline cursor-pointer">← Back to Orders</button>
        </div>
      </div>
    );
  }

  const materialTotal = quotation.items?.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 1), 0) || 0;
  const labor = quotation.laborCharge || 0;
  const additional = quotation.additionalCharges || 0;
  const grandTotal = quotation.grandTotal || materialTotal + labor + additional;
  const isPending = quotation.status === "quoted";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/orders")} className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 flex items-center justify-center text-white transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Review Quotation</h1>
            <p className="text-purple-200 text-sm">From {quotation.providerName || "Provider"}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ══════════ PROVIDER INFO ══════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 ${
              quotation.providerType === "designer"
                ? "bg-gradient-to-br from-rose-500 to-pink-600"
                : "bg-gradient-to-br from-violet-500 to-purple-600"
            }`}>
              {quotation.providerName?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{quotation.providerName}</h2>
              <p className="text-sm text-gray-500 capitalize">{quotation.providerType || "—"}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              isPending ? "bg-blue-100 text-blue-700" :
              quotation.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-red-700"
            }`}>
              {quotation.status}
            </div>
          </div>
          {quotation.completionDate && (
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className="text-sm text-emerald-700">
                Estimated completion: <span className="font-bold">{quotation.completionDate}</span>
              </span>
            </div>
          )}
        </div>

        {/* ══════════ BILL BREAKDOWN ══════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Bill header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-violet-200 uppercase tracking-wider font-semibold">Quotation</p>
                <p className="text-base font-bold">{quotation.providerName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-violet-200 uppercase tracking-wider font-semibold">Quoted On</p>
                <p className="text-sm font-semibold">{formatDate(quotation.quotedAt)}</p>
              </div>
            </div>
          </div>

          {/* Bill items */}
          <div className="px-6 py-5 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Materials</p>
            {quotation.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-100" />}
                  <span className="text-gray-700">{item.name} × {item.quantity} {item.unit || "m"}</span>
                </div>
                <span className="font-semibold text-gray-900">LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}</span>
              </div>
            ))}

            <hr className="border-gray-100" />

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Material Subtotal</span>
              <span className="font-semibold text-gray-700">LKR {materialTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Labor / Service Charge</span>
              <span className="font-semibold text-gray-700">LKR {labor.toLocaleString()}</span>
            </div>
            {additional > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Additional{quotation.additionalNote ? ` (${quotation.additionalNote})` : ""}
                </span>
                <span className="font-semibold text-gray-700">LKR {additional.toLocaleString()}</span>
              </div>
            )}

            <hr className="border-gray-200" />

            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-bold text-gray-900">Grand Total</span>
              <span className="text-2xl font-extrabold text-violet-600">LKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ══════════ PROVIDER REMARKS ══════════ */}
        {quotation.providerRemarks && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Provider Remarks
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100 whitespace-pre-wrap">
              {quotation.providerRemarks}
            </p>
          </div>
        )}

        {/* ══════════ ACTION AREA ══════════ */}
        {isPending ? (
          <>
            {!showPayment ? (
              /* ── Accept / Reject buttons ── */
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPayment(true)}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-200 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Accept & Proceed to Payment
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-8 py-4 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-2xl text-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  Decline
                </button>
              </div>
            ) : (
              /* ── Payment Step ── */
              <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  Payment
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Amount to pay: <span className="font-bold text-gray-900">LKR {grandTotal.toLocaleString()}</span>
                </p>

                {/* Payment method selection */}
                <div className="space-y-3 mb-6">
                  {[
                    { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, Amex" },
                    { id: "bank", label: "Bank Transfer", icon: "🏦", desc: "Direct bank transfer" },
                    { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive" },
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id ? "border-emerald-500" : "border-gray-300"
                      }`}>
                        {paymentMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confirm */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAccept}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-200 cursor-pointer disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Confirm & Pay LKR {grandTotal.toLocaleString()}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl text-sm transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ── Already responded ── */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl ${
              quotation.status === "accepted" ? "bg-emerald-50" : "bg-red-50"
            }`}>
              {quotation.status === "accepted" ? "✅" : "❌"}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {quotation.status === "accepted" ? "Quotation Accepted" : "Quotation Declined"}
            </h3>
            <p className="text-2xl font-extrabold text-violet-600 mb-2">LKR {grandTotal.toLocaleString()}</p>
            {quotation.paymentMethod && (
              <p className="text-sm text-gray-500 capitalize">Payment: {quotation.paymentMethod}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
