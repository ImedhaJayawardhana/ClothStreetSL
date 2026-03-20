import { useState, useEffect} from"react";
import { useParams, useLocation, useNavigate} from"react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { createOrder } from "../api";

export default function QuotationReview() {
 const { quotationId} = useParams();
 const location = useLocation();
 const navigate = useNavigate();
 const { user} = useAuth();
 const { clearCart} = useCart();

 const [quotation, setQuotation] = useState(location.state?.quotation || null);
 const [loading, setLoading] = useState(!location.state?.quotation);
 const [processing, setProcessing] = useState(false);
 const [showPayment, setShowPayment] = useState(false);
 const [paymentMethod, setPaymentMethod] = useState("card");

 useEffect(() => {
 if (quotation) return;
 const fetch = async () => {
 try {
 const snap = await getDoc(doc(db,"quotations", quotationId));
 if (snap.exists()) setQuotation({ id: snap.id, ...snap.data()});
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
            const isDesigner = quotation.providerType === "designer";
            const newStatus = isDesigner ? "design_in_progress" : "accepted";

            // 1. Update quotation status
            await updateDoc(doc(db, "quotations", quotationId), {
                status: newStatus,
                acceptedAt: serverTimestamp(),
                acceptedBy: user?.uid || "",
                paymentMethod: paymentMethod,
            });

            // 2. Create a service-only order so it shows in the Orders page.
            //    We do NOT re-include fabric items here because those were already
            //    purchased as a separate order during checkout. Including them again
            //    would cause the same fabric to appear as both "completed" (the
            //    original checkout order) and "pending" (this service order).
            const serviceCharge = (quotation.laborCharge || 0) + (quotation.additionalCharges || 0);
            const orderItems = [
                {
                    name: `Service: ${isDesigner ? "Design" : "Tailoring"} by ${quotation.providerName || "Provider"}`,
                    quantity: 1,
                    unit: "service",
                    unitPrice: serviceCharge,
                },
            ];

            const orderRes = await createOrder({
                items: orderItems,
                total_price: serviceCharge,
                status: "pending",
                provider_type: quotation.providerType || (isDesigner ? "designer" : "tailor"),
                provider_name: quotation.providerName || "Provider",
                provider_id: quotation.providerId || "",   // ← tailor/designer UID → stored as tailorId/designerId in Firestore
                quotation_id: quotationId,
                payment_method: paymentMethod,
            });
            const newOrderId = orderRes?.data?.order_id || null;

            // 3. Clear the cart if it's the final checkout (tailor, or standard, but NOT the middle designer step)
            if (!isDesigner) {
                clearCart();
                try { 
                    sessionStorage.removeItem("clothstreet_checkout_cart"); 
                    sessionStorage.removeItem("clothstreet_combo_tailor");
                    sessionStorage.removeItem("clothstreet_checkout_mode");
                } catch { /* */ }
            }

            toast.success("Payment successful! Order confirmed.");
            
            if (isDesigner) {
                navigate(`/designer-timeline/${quotationId}`);
            } else if (newOrderId) {
                navigate(`/order-tracking/${newOrderId}`);
            } else {
                navigate("/orders");
            }
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
 await updateDoc(doc(db,"quotations", quotationId), {
 status:"rejected",
 rejectedAt: serverTimestamp(),
 rejectedBy: user?.uid ||"",
});
 toast.success("Quotation declined.");
 navigate("/quotations/offers");
} catch (err) {
 console.error("Error rejecting:", err);
 toast.error("Something went wrong.");
} finally {
 setProcessing(false);
}
};

 const formatDate = (ts) => {
 if (!ts?.seconds) return"—";
 return new Date(ts.seconds * 1000).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric"});
};

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
 </div>
 );
}

 if (!quotation) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="text-center">
 <h2 className="text-xl font-bold mb-2">Quotation not found</h2>
 <button onClick={() => navigate("/quotations/offers")} className="text-amber-600 font-semibold hover:underline cursor-pointer">← Back to Quotations</button>
 </div>
 </div>
 );
}

    const materialTotal = quotation.items?.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 1), 0) || 0;
    const labor = quotation.laborCharge || 0;
    const additional = quotation.additionalCharges || 0;
    // For designers, materials are carried over to tailor/checkout, not paid here
    const isDesigner = quotation.providerType === "designer";
    const payableTotal = isDesigner ? (labor + additional) : (materialTotal + labor + additional);
    const grandTotal = quotation.grandTotal || (materialTotal + labor + additional);
    const isPending = quotation.status === "quoted";

 return (
 <div className="min-h-screen">
 {/* ── Header ── */}
 <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-600 px-6 py-6">
 <div className="max-w-3xl mx-auto flex items-center gap-3">
 <button onClick={() => navigate("/quotations/offers")} className="w-9 h-9 rounded-xl hover: border flex items-center justify-center transition-colors cursor-pointer">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
 </button>
 <div>
 <h1 className="text-xl font-bold">Review Quotation</h1>
 <p className="text-sm">From {quotation.providerName ||"Provider"}</p>
 </div>
 </div>
 </div>

 <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

 {/* ══════════ PROVIDER INFO ══════════ */}
 <div className="rounded-2xl border shadow-sm p-6">
 <div className="flex items-center gap-4">
 <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${
 quotation.providerType ==="designer"
 ?"bg-gradient-to-br from-rose-500 to-pink-600"
 :"bg-gradient-to-br from-amber-500 to-amber-600"
}`}>
 {quotation.providerName?.charAt(0) ||"?"}
 </div>
 <div className="flex-1 min-w-0">
 <h2 className="text-lg font-bold">{quotation.providerName}</h2>
 <p className="text-sm capitalize">{quotation.providerType ||"—"}</p>
 </div>
 <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
 isPending ?"" :
 quotation.status ==="accepted" ?"bg-emerald-100 text-emerald-700" :
""
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
 <div className="rounded-2xl border shadow-sm overflow-hidden">
 {/* Bill header */}
 <div className="bg-gradient-to-r from-amber-600 to-amber-600 px-6 py-4">
 <div className="flex justify-between items-center">
 <div>
 <p className="text-xs text-amber-200 uppercase tracking-wider font-semibold">Quotation</p>
 <p className="text-base font-bold">{quotation.providerName}</p>
 </div>
 <div className="text-right">
 <p className="text-xs text-amber-200 uppercase tracking-wider font-semibold">Quoted On</p>
 <p className="text-sm font-semibold">{formatDate(quotation.quotedAt)}</p>
 </div>
 </div>
 </div>

 {/* Bill items */}
 <div className="px-6 py-5 space-y-3">
 <p className="text-xs font-bold uppercase tracking-wider">Materials</p>
 {quotation.items?.map((item, idx) => (
 <div key={idx} className="flex justify-between items-center text-sm">
 <div className="flex items-center gap-3">
 {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover border" />}
 <span className="">{item.name} × {item.quantity} {item.unit ||"m"}</span>
 </div>
 <span className="font-semibold">LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}</span>
 </div>
 ))}

 <hr className="" />

 <div className="flex justify-between text-sm">
 <span className="">Material Subtotal</span>
 <span className="font-semibold">LKR {materialTotal.toLocaleString()}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="">Labor / Service Charge</span>
 <span className="font-semibold">LKR {labor.toLocaleString()}</span>
 </div>
 {additional > 0 && (
 <div className="flex justify-between text-sm">
 <span className="">
 Additional{quotation.additionalNote ?` (${quotation.additionalNote})` :""}
 </span>
 <span className="font-semibold">LKR {additional.toLocaleString()}</span>
 </div>
 )}

                        <hr className="" />

                        <div className="flex justify-between items-center pt-1">
                            <span className="text-base font-bold">Total Quotation Value</span>
                            <span className="text-xl font-bold text-gray-700">LKR {grandTotal.toLocaleString()}</span>
                        </div>

                        {/* Separate Payable Amount for Designers */}
                        {isDesigner && (
                            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100 flex justify-between items-center">
                                <div>
                                    <span className="text-sm font-bold text-amber-900 block">Designer Fee (Pay Now)</span>
                                    <span className="text-xs text-amber-700">Materials will be paid later in the process.</span>
                                </div>
                                <span className="text-2xl font-extrabold text-slate-900">LKR {payableTotal.toLocaleString()}</span>
                            </div>
                        )}
                        {!isDesigner && (
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold">Total to Pay</span>
                                <span className="text-2xl font-extrabold text-slate-900">LKR {payableTotal.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>

 {/* ══════════ PROVIDER REMARKS ══════════ */}
 {quotation.providerRemarks && (
 <div className="rounded-2xl border shadow-sm p-6">
 <h3 className="text-base font-bold mb-3 flex items-center gap-2">
 <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
 </svg>
 Provider Remarks
 </h3>
 <p className="text-sm leading-relaxed rounded-xl p-4 border whitespace-pre-wrap">
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
 className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-200 cursor-pointer disabled:opacity-50"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 Accept & Proceed to Payment
 </button>
 <button
 onClick={handleReject}
 disabled={processing}
 className="px-8 py-4 border hover: font-bold rounded-2xl text-sm transition-colors cursor-pointer disabled:opacity-50"
 >
 Decline
 </button>
 </div>
 ) : (
 /* ── Payment Step ── */
 <div className="rounded-2xl border-2 border-emerald-200 shadow-sm p-6">
 <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
 <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
 </svg>
 Payment
 </h3>
                            <p className="text-sm mb-6">
                                Amount to pay: <span className="font-bold text-slate-900">LKR {payableTotal.toLocaleString()}</span>
                            </p>

 {/* Payment method selection */}
 <div className="space-y-3 mb-6">
 {[
 { id:"card", label:"Credit / Debit Card", icon:"💳", desc:"Visa, Mastercard, Amex"},
 { id:"bank", label:"Bank Transfer", icon:"🏦", desc:"Direct bank transfer"},
 { id:"cod", label:"Cash on Delivery", icon:"💵", desc:"Pay when you receive"},
 ].map((method) => (
 <div
 key={method.id}
 onClick={() => setPaymentMethod(method.id)}
 className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
 paymentMethod === method.id
 ?"border-emerald-500 bg-emerald-50/50"
 :" hover:"
}`}
 >
 <span className="text-2xl">{method.icon}</span>
 <div className="flex-1">
 <p className="text-sm font-bold">{method.label}</p>
 <p className="text-xs">{method.desc}</p>
 </div>
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
 paymentMethod === method.id ?"border-emerald-500" :""
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
 className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-200 cursor-pointer disabled:opacity-50"
 >
 {processing ? (
 <>
 <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
 Processing...
 </>
 ) : (
 <>
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
 </svg>
                                        Confirm & Pay LKR {payableTotal.toLocaleString()}
                                    </>
 )}
 </button>
 <button
 onClick={() => setShowPayment(false)}
 className="px-6 py-4 hover: font-semibold rounded-2xl text-sm transition-colors cursor-pointer"
 >
 Back
 </button>
 </div>
 </div>
 )}
 </>
 ) : (
 /* ── Already responded ── */
                    <div className="rounded-2xl border shadow-sm p-6 text-center">
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl ${
                            (quotation.status === "accepted" || quotation.status === "design_in_progress" || quotation.status === "design_completed" || quotation.status === "design_delivered") ? "bg-emerald-50" : ""
                        }`}>
                            {(quotation.status === "accepted" || quotation.status === "design_in_progress" || quotation.status === "design_completed" || quotation.status === "design_delivered") ? "✅" : "❌"}
                        </div>
                        <h3 className="text-lg font-bold mb-1">
                            {(quotation.status === "accepted" || quotation.status === "design_in_progress" || quotation.status === "design_completed" || quotation.status === "design_delivered") ? "Quotation Accepted & Paid" : "Quotation Declined"}
                        </h3>
                        <p className="text-2xl font-extrabold text-slate-900 mb-2">LKR {(quotation.status === "rejected" ? grandTotal : payableTotal).toLocaleString()}</p>
                        {quotation.paymentMethod && (
                            <p className="text-sm capitalize">Payment: {quotation.paymentMethod}</p>
                        )}
                        
                        {(quotation.status === "design_in_progress" || quotation.status === "design_completed" || quotation.status === "design_delivered") && (
                            <button
                                onClick={() => navigate(`/designer-timeline/${quotationId}`)}
                                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors"
                            >
                                View Design Timeline
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        )}
                        
                        {quotation.status === "rejected" && !isDesigner && (
                            <div className="mt-6 flex flex-col gap-3 text-left">
                                <h4 className="font-bold text-gray-800 mb-2 text-center">What would you like to do next?</h4>
                                <button
                                    onClick={() => navigate(`/request-quote/${quotation.providerId}?combo=${quotation.serviceMode === 'combo_tailor'}`, {
                                        state: { designerDeliverables: quotation.designImages }
                                    })}
                                    className="px-6 py-3 bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-50 font-bold rounded-xl transition-colors text-center"
                                >
                                    Try Re-quoting {quotation.providerName}
                                </button>
                                <button
                                    onClick={() => navigate(`/find-tailor-designer?mode=${quotation.serviceMode || 'tailor'}`)}
                                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors text-center"
                                >
                                    Find Another Tailor
                                </button>
                                <button
                                    onClick={() => {
                                         sessionStorage.setItem("clothstreet_checkout_step", "3");
                                         navigate("/checkout");
                                    }}
                                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-center"
                                >
                                    Cancel Tailoring & Buy Fabric Only
                                </button>
                            </div>
                        )}
                    </div>
                )}
 </div>
 </div>
 );
}
