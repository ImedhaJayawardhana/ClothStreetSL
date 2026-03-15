import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { uploadImage, updateQuotationDeliverables } from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { db } from "../firebase/firebase";
import { doc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp, getDoc } from "firebase/firestore";

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

  /* ── Action States ── */
  const [actionMode, setActionMode] = useState(null); // "hibernate", "cancel", "upload"
  const [actionReason, setActionReason] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  const handleStatusChange = async (newStatus) => {
    if ((newStatus === "hibernated" || newStatus === "cancelled") && !actionReason) {
      toast.error("Please provide a reason.");
      return;
    }
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    
    try {
      setSubmitting(true);
      await updateDoc(doc(db, "quotations", quotationId), {
        status: newStatus,
        statusReason: actionReason || "",
        updatedAt: serverTimestamp()
      });
      toast.success(`Order marked as ${newStatus}.`);
      setQuotation(prev => ({ ...prev, status: newStatus, statusReason: actionReason }));
      setActionMode(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDesignerDelivery = async () => {
    if (uploadFiles.length === 0) {
      toast.error("Please select files to upload.");
      return;
    }
    setUploading(true);
    try {
      const urls = [];
      for (const file of Array.from(uploadFiles)) {
        const res = await uploadImage(file, "designs");
        if (res.data && res.data.url) urls.push(res.data.url);
      }
      await updateQuotationDeliverables(quotationId, urls);
      toast.success("Design files delivered successfully!");
      setQuotation(prev => ({ ...prev, status: "design_delivered", designDeliverables: urls }));
      setActionMode(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to deliver designs.");
    } finally {
      setUploading(false);
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

  const isAlreadyQuoted = quotation.status !== "pending";

  const isDesigner = quotation.providerType === "designer";
  const isInProgress = quotation.status === "accepted" || quotation.status === "design_in_progress";

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/quotation-inbox")}
            className="w-9 h-9 rounded-xl hover: border flex items-center justify-center transition-colors cursor-pointer text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-white">
            <h1 className="text-xl font-bold">Order Details</h1>
            <p className="text-sm">{quotation.customerName || "Customer"} · {formatDate(quotation.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ══════════ CUSTOMER INFO ══════════ */}
        <div className="rounded-2xl border shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
              {quotation.customerName?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold">{quotation.customerName}</h2>
              <p className="text-sm">{quotation.customerEmail}</p>
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
              quotation.status === "pending" ? "bg-amber-100 text-amber-700" :
              quotation.status === "quoted" ? "bg-blue-100 text-blue-700" :
              isInProgress ? "bg-violet-100 text-violet-700" :
              quotation.status === "design_delivered" || quotation.status === "completed" ? "bg-emerald-100 text-emerald-700" :
              quotation.status === "hibernated" ? "bg-amber-100 text-amber-700" :
              "bg-rose-100 text-rose-700"
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

        {/* ══════════ PRICING FORM (only if pending) ══════════ */}
        {!isAlreadyQuoted && (
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

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3">
               <button
                 onClick={handleSubmit}
                 disabled={submitting}
                 className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white"
               >
                 {submitting ? "Sending..." : "Send Quotation"}
               </button>
               <button
                 onClick={handleDecline}
                 className="px-8 py-4 border hover: font-bold rounded-2xl text-sm transition-colors cursor-pointer"
               >
                 Decline Request
               </button>
             </div>
          </>
        )}

        {/* ══════════ ALREADY RESPONDED ACTIONS ══════════ */}
        {isAlreadyQuoted && (
          <div className="rounded-2xl border shadow-sm p-6 text-center">
            
            <h3 className="text-xl font-bold mb-2">Order Management</h3>
            {quotation.grandTotal && (
              <p className="text-xl font-bold text-violet-600 mb-6">Total Value: LKR {quotation.grandTotal.toLocaleString()}</p>
            )}

            {/* STATUS TIMELINE */}
            <div className="mb-8 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-0 opacity-50"></div>
              <h4 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider relative z-10 flex items-center justify-between">
                Order Timeline
                {quotation.completionDate && (
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-indigo-700 border border-indigo-100 shadow-sm flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline: {quotation.completionDate}
                  </span>
                )}
              </h4>
              <div className="relative pl-6 space-y-6 z-10 before:absolute before:inset-y-2 before:left-2.5 before:-ml-px before:w-0.5 before:bg-slate-200">
                
                {/* Step 1: Request Received */}
                <div className="relative">
                  <div className="absolute -left-[30px] rounded-full w-5 h-5 bg-violet-500 border-4 border-white shadow shadow-violet-200"></div>
                  <div>
                    <span className="text-xs font-semibold text-violet-600 block mb-0.5">Step 1</span>
                    <h5 className="font-bold text-slate-800 text-sm">Request Received</h5>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(quotation.createdAt)}</p>
                  </div>
                </div>

                {/* Step 2: Quoted */}
                <div className="relative opacity-100">
                  <div className={`absolute -left-[30px] rounded-full w-5 h-5 border-4 border-white shadow ${quotation.quotedAt ? "bg-violet-500 shadow-violet-200" : "bg-slate-300 shadow-slate-200"}`}></div>
                  <div>
                    <span className={`text-xs font-semibold block mb-0.5 ${quotation.quotedAt ? "text-violet-600" : "text-slate-400"}`}>Step 2</span>
                    <h5 className={`font-bold text-sm ${quotation.quotedAt ? "text-slate-800" : "text-slate-400"}`}>Quotation Sent</h5>
                    {quotation.quotedAt && <p className="text-xs text-slate-500 mt-1">{formatDate(quotation.quotedAt)}</p>}
                  </div>
                </div>

                {/* Step 3: Accepted / In Progress */}
                {(quotation.status === "accepted" || quotation.status === "design_in_progress" || quotation.status === "completed" || quotation.status === "design_delivered") && (
                  <div className="relative opacity-100">
                    <div className="absolute -left-[30px] rounded-full w-5 h-5 bg-violet-500 border-4 border-white shadow shadow-violet-200"></div>
                    <div>
                      <span className="text-xs font-semibold text-violet-600 block mb-0.5">Step 3</span>
                      <h5 className="font-bold text-slate-800 text-sm">Customer Accepted Payment</h5>
                      {quotation.acceptedAt && <p className="text-xs text-slate-500 mt-1">{formatDate(quotation.acceptedAt)}</p>}
                    </div>
                  </div>
                )}

                {/* Step 4: Finished / Cancelled */}
                {(quotation.status === "completed" || quotation.status === "design_delivered" || quotation.status === "cancelled" || quotation.status === "hibernated") && (
                  <div className="relative opacity-100">
                    <div className={`absolute -left-[30px] rounded-full w-5 h-5 border-4 border-white shadow ${(quotation.status === "completed" || quotation.status === "design_delivered") ? "bg-emerald-500 shadow-emerald-200" : "bg-rose-500 shadow-rose-200"}`}></div>
                    <div>
                      <span className={`text-xs font-semibold block mb-0.5 ${(quotation.status === "completed" || quotation.status === "design_delivered") ? "text-emerald-600" : "text-rose-600"}`}>Final Step</span>
                      <h5 className="font-bold text-slate-800 text-sm">
                        {quotation.status === "completed" ? "Order Completed" : 
                         quotation.status === "design_delivered" ? "Design Delivered" : 
                         quotation.status === "hibernated" ? "Hibernated" : "Cancelled"}
                      </h5>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(quotation.updatedAt)}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* IN PROGRESS ACTIONS */}
            {isInProgress && !actionMode && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
                <button
                  onClick={() => setActionMode("upload")}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition-all"
                >
                  <span className="text-2xl">{isDesigner ? "📥" : "✅"}</span>
                  {isDesigner ? "Deliver Designs" : "Mark as Completed"}
                </button>
                <button
                  onClick={() => setActionMode("hibernate")}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold transition-all"
                >
                  <span className="text-2xl">💤</span>
                  Hibernate Order
                </button>
                <button
                  onClick={() => setActionMode("cancel")}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold transition-all"
                >
                  <span className="text-2xl">❌</span>
                  Cancel Order
                </button>
              </div>
            )}

            {/* ACTION FORMS */}
            {actionMode === "upload" && (
              <div className="mt-6 border-t pt-6 text-left">
                <h4 className="font-bold mb-4">{isDesigner ? "Upload Design Deliverables" : "Complete Order"}</h4>
                {isDesigner ? (
                  <div className="space-y-4">
                    <input 
                      type="file" 
                      multiple 
                      className="w-full border p-3 rounded-xl"
                      onChange={(e) => setUploadFiles(Array.from(e.target.files))}
                    />
                    <div className="flex gap-3">
                      <button onClick={handleDesignerDelivery} disabled={uploading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex-1">
                        {uploading ? "Uploading..." : "Upload & Deliver"}
                      </button>
                      <button onClick={() => setActionMode(null)} className="border px-6 py-2 rounded-xl font-bold hover:">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleCompleteOrder} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold flex-1">Confirm Completion</button>
                    <button onClick={() => setActionMode(null)} className="border px-6 py-2 rounded-xl font-bold hover:">Back</button>
                  </div>
                )}
              </div>
            )}

            {(actionMode === "hibernate" || actionMode === "cancel") && (
              <div className="mt-6 border-t pt-6 text-left">
                <h4 className="font-bold mb-4 text-rose-600">{actionMode === "cancel" ? "Cancel Order" : "Hibernate Order"}</h4>
                <div className="space-y-4">
                  <select 
                    className="w-full border p-3 rounded-xl focus:outline-none focus:border-violet-500"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                  >
                    <option value="">Select a reason...</option>
                    {actionMode === "cancel" ? (
                      <>
                        <option value="Customer requested cancellation">Customer requested cancellation</option>
                        <option value="Material out of stock">Material out of stock</option>
                        <option value="Unable to meet deadline">Unable to meet deadline</option>
                        <option value="Other">Other</option>
                      </>
                    ) : (
                      <>
                        <option value="Awaiting customer details">Awaiting customer details</option>
                        <option value="Awaiting fabric delivery">Awaiting fabric delivery</option>
                        <option value="Delayed by third party">Delayed by third party</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStatusChange(actionMode === "cancel" ? "cancelled" : "hibernated")} 
                      disabled={submitting} 
                      className={`${actionMode === "cancel" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700"} text-white px-6 py-2 rounded-xl font-bold flex-1`}
                    >
                      {submitting ? "Saving..." : "Confirm"}
                    </button>
                    <button onClick={() => { setActionMode(null); setActionReason(""); }} className="border px-6 py-2 rounded-xl font-bold hover:">Go Back</button>
                  </div>
                </div>
              </div>
            )}
            
            {quotation.statusReason && (
               <div className="mt-4 p-4 border border-rose-100 bg-rose-50 rounded-xl text-left">
                  <p className="text-sm font-bold text-rose-800">Reason: <span className="font-normal">{quotation.statusReason}</span></p>
               </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
