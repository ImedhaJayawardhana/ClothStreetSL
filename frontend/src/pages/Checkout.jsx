import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./Checkout.css";

const STEPS = ["Shipping", "Delivery", "Payment", "Confirm", "Complete"];

export default function Checkout() {
  const { cartItems, cartSubtotal } = useCart();

  const SHIPPING_COST = 2500;
  const total = cartSubtotal + SHIPPING_COST;

  /* ── Multi-step state ── */
  const [currentStep, setCurrentStep] = useState(1);

  /* ── Step 1: Shipping form state ── */
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    city: "",
    streetAddress: "",
    district: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinueToDelivery = () => {
    const { fullName, phoneNumber, city, streetAddress, district } = form;
    if (!fullName || !phoneNumber || !city || !streetAddress || !district) {
      toast.error("Please fill in all shipping details.");
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Step 2: Delivery state ── */
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [tailors, setTailors] = useState([]);
  const [tailorsLoading, setTailorsLoading] = useState(false);

  useEffect(() => {
    if (currentStep === 2 && tailors.length === 0) {
      setTailorsLoading(true);
      getDocs(collection(db, "tailors"))
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setTailors(data);
        })
        .catch((err) => {
          console.error("Error fetching tailors:", err);
          toast.error("Failed to load tailors.");
        })
        .finally(() => setTailorsLoading(false));
    }
  }, [currentStep, tailors.length]);

  /* ── Step 3: Payment state ── */
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleCardChange = (e) => {
    setCardDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinueToPayment = () => {
    if (deliveryMethod === "tailor" && !selectedTailor) {
      toast.error("Please select a tailor for delivery.");
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReviewOrder = () => {
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error("Please fill in your card details.");
        return;
      }
    }
    toast.success("Payment details saved! Confirm step coming soon.");
  };

  const handlePlaceOrder = () => {
    toast.success("Order Placed Successfully!");
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case "card": return "Credit / Debit Card";
      case "koko": return "Koko (BNPL)";
      case "bank": return "Bank Transfer";
      default: return paymentMethod;
    }
  };

  return (
    <div className="checkout-page">
      {/* ── Stepper ── */}
      <div className="checkout-stepper">
        <div className="checkout-stepper-inner">
          {STEPS.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", flex: idx < STEPS.length - 1 ? 1 : "none" }}>
                <div
                  className={`checkout-step${isActive ? " active" : ""}${isCompleted ? " completed" : ""}`}
                >
                  {isCompleted ? (
                    <div className="checkout-step-check">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    <div className="checkout-step-circle">{stepNum}</div>
                  )}
                  <span className="checkout-step-label">{label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`checkout-step-dash${isCompleted ? " completed" : ""}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="checkout-body">
        {/* ══════════════ STEP 1: Shipping ══════════════ */}
        {currentStep === 1 && (
          <div className="checkout-form-card">
            <h2 className="checkout-form-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Shipping Information
            </h2>

            {/* Full Name */}
            <div className="checkout-form-group">
              <label className="checkout-form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="checkout-form-input"
                placeholder="Kamal Jayawardena"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Phone + City */}
            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label className="checkout-form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="checkout-form-input"
                  placeholder="+94 77 000 0000"
                  value={form.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="checkout-form-group">
                <label className="checkout-form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="checkout-form-input"
                  placeholder="Colombo"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Street Address */}
            <div className="checkout-form-group">
              <label className="checkout-form-label">Street Address</label>
              <input
                type="text"
                name="streetAddress"
                className="checkout-form-input"
                placeholder="No. 45, Main Street"
                value={form.streetAddress}
                onChange={handleChange}
              />
            </div>

            {/* District */}
            <div className="checkout-form-group">
              <label className="checkout-form-label">District</label>
              <input
                type="text"
                name="district"
                className="checkout-form-input"
                placeholder="Colombo"
                value={form.district}
                onChange={handleChange}
                style={{ maxWidth: "260px" }}
              />
            </div>

            {/* Continue Button */}
            <button className="checkout-continue-btn" onClick={handleContinueToDelivery}>
              Continue to Delivery
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* ══════════════ STEP 2: Delivery ══════════════ */}
        {currentStep === 2 && (
          <div className="checkout-delivery-card">
            <h2 className="checkout-delivery-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Delivery Options
            </h2>

            {/* Delivery Method Selection */}
            <div className="checkout-delivery-options">
              {/* Home Delivery */}
              <div
                className={`checkout-delivery-option${deliveryMethod === "home" ? " selected" : ""}`}
                onClick={() => {
                  setDeliveryMethod("home");
                  setSelectedTailor(null);
                }}
              >
                <div className="checkout-delivery-option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="checkout-delivery-option-info">
                  <p className="checkout-delivery-option-name">Home Delivery</p>
                  <p className="checkout-delivery-option-desc">Deliver to your address</p>
                </div>
                <div className="checkout-delivery-option-radio">
                  <div className="checkout-delivery-option-radio-dot" />
                </div>
              </div>

              {/* Tailor Delivery */}
              <div
                className={`checkout-delivery-option${deliveryMethod === "tailor" ? " selected" : ""}`}
                onClick={() => setDeliveryMethod("tailor")}
              >
                <div className="checkout-delivery-option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="checkout-delivery-option-info">
                  <p className="checkout-delivery-option-name">Tailor Delivery</p>
                  <p className="checkout-delivery-option-desc">Deliver to a tailor</p>
                </div>
                <div className="checkout-delivery-option-radio">
                  <div className="checkout-delivery-option-radio-dot" />
                </div>
              </div>
            </div>

            {/* Tailor Selection List (shown when "tailor" selected) */}
            {deliveryMethod === "tailor" && (
              <div className="checkout-tailor-list">
                {tailorsLoading ? (
                  /* Skeleton loaders */
                  [1, 2, 3].map((i) => (
                    <div className="checkout-tailor-skeleton" key={i}>
                      <div className="checkout-tailor-skeleton-icon" />
                      <div className="checkout-tailor-skeleton-lines">
                        <div className="checkout-tailor-skeleton-line" />
                        <div className="checkout-tailor-skeleton-line" />
                        <div className="checkout-tailor-skeleton-line" />
                      </div>
                    </div>
                  ))
                ) : tailors.length === 0 ? (
                  <p style={{ color: "#71717a", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
                    No tailors available at the moment.
                  </p>
                ) : (
                  tailors.map((tailor) => (
                    <div
                      key={tailor.id}
                      className={`checkout-tailor-card${selectedTailor === tailor.id ? " selected" : ""}`}
                      onClick={() => setSelectedTailor(tailor.id)}
                    >
                      <div className="checkout-tailor-card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <div className="checkout-tailor-card-info">
                        <p className="checkout-tailor-card-name">{tailor.name}</p>
                        <p className="checkout-tailor-card-meta">
                          {tailor.location}
                          {tailor.specializations?.length > 0 && ` · ${tailor.specializations[0]}`}
                        </p>
                        <p className="checkout-tailor-card-stats">
                          <span className="star">★</span> {tailor.rating?.toFixed(1) || "N/A"}
                          <span>·</span>
                          {tailor.orders || 0} orders
                        </p>
                      </div>
                      <div className="checkout-tailor-card-radio">
                        <div className="checkout-tailor-card-radio-dot" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Navigation Row */}
            <div className="checkout-nav-row">
              <button className="checkout-back-btn" onClick={handleBack}>
                ← Back
              </button>
              <button className="checkout-continue-btn" onClick={handleContinueToPayment}>
                Continue to Payment
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 3: Payment ══════════════ */}
        {currentStep === 3 && (
          <div className="checkout-delivery-card">
            <h2 className="checkout-delivery-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Payment Method
            </h2>

            <div className="checkout-payment-box">
              <div className="checkout-delivery-options" style={{ marginBottom: "0" }}>
                
                {/* 1. Credit / Debit Card */}
                <div
                  className={`checkout-delivery-option${paymentMethod === "card" ? " selected" : ""}`}
                  style={{ borderRadius: paymentMethod === "card" ? "14px 14px 0 0" : "14px", borderBottom: paymentMethod === "card" ? "none" : "" }}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="checkout-delivery-option-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div className="checkout-delivery-option-info">
                    <p className="checkout-delivery-option-name">Credit / Debit Card</p>
                    <p className="checkout-delivery-option-desc">Pay securely with Visa or Mastercard</p>
                  </div>
                  <div className="checkout-delivery-option-radio">
                    <div className="checkout-delivery-option-radio-dot" />
                  </div>
                </div>

                {/* Card Details Details Box */}
                {paymentMethod === "card" && (
                  <div className="checkout-payment-details">
                    <div className="checkout-card-form">
                      <div className="checkout-form-group" style={{ marginBottom: 0 }}>
                        <label className="checkout-form-label">Card Number</label>
                        <input
                          type="text"
                          name="number"
                          className="checkout-form-input"
                          placeholder="0000 0000 0000 0000"
                          value={cardDetails.number}
                          onChange={handleCardChange}
                          maxLength={19}
                        />
                      </div>
                      <div className="checkout-card-form-row">
                        <div className="checkout-form-group" style={{ marginBottom: 0, flex: 1 }}>
                          <label className="checkout-form-label">Expiry Date</label>
                          <input
                            type="text"
                            name="expiry"
                            className="checkout-form-input"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            maxLength={5}
                          />
                        </div>
                        <div className="checkout-form-group" style={{ marginBottom: 0, flex: 1 }}>
                          <label className="checkout-form-label">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            className="checkout-form-input"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Koko BNPL */}
                <div
                  className={`checkout-delivery-option${paymentMethod === "koko" ? " selected" : ""}`}
                  style={{ borderRadius: paymentMethod === "koko" ? "14px 14px 0 0" : "14px", borderBottom: paymentMethod === "koko" ? "none" : "", marginTop: paymentMethod === "card" ? "12px" : "0" }}
                  onClick={() => setPaymentMethod("koko")}
                >
                  <div className="checkout-delivery-option-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  </div>
                  <div className="checkout-delivery-option-info">
                    <p className="checkout-delivery-option-name">Koko (Buy Now, Pay Later)</p>
                    <p className="checkout-delivery-option-desc">Split into 3 interest-free installments</p>
                  </div>
                  <div className="checkout-delivery-option-radio">
                    <div className="checkout-delivery-option-radio-dot" />
                  </div>
                </div>

                {/* Koko Details Box */}
                {paymentMethod === "koko" && (
                  <div className="checkout-payment-details">
                    <div className="checkout-koko-info">
                      <div className="checkout-koko-logo">koko</div>
                      <p>You will be securely redirected to the Koko app to complete your installment purchase.</p>
                      <button className="checkout-koko-btn" onClick={(e) => e.preventDefault()}>Pay with Koko</button>
                    </div>
                  </div>
                )}

                {/* 3. Bank Transfer */}
                <div
                  className={`checkout-delivery-option${paymentMethod === "bank" ? " selected" : ""}`}
                  style={{ borderRadius: paymentMethod === "bank" ? "14px 14px 0 0" : "14px", borderBottom: paymentMethod === "bank" ? "none" : "", marginTop: paymentMethod === "koko" ? "12px" : "0" }}
                  onClick={() => setPaymentMethod("bank")}
                >
                  <div className="checkout-delivery-option-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="checkout-delivery-option-info">
                    <p className="checkout-delivery-option-name">Bank Transfer</p>
                    <p className="checkout-delivery-option-desc">Deposit directly to our account</p>
                  </div>
                  <div className="checkout-delivery-option-radio">
                    <div className="checkout-delivery-option-radio-dot" />
                  </div>
                </div>

                {/* Bank Details Box */}
                {paymentMethod === "bank" && (
                  <div className="checkout-payment-details">
                    <div className="checkout-bank-details">
                      <p>Please transfer the total amount to the following bank account and upload your payment slip.</p>
                      <div className="checkout-bank-account-box">
                        <div className="checkout-bank-line"><span>Bank:</span><span>Commercial Bank</span></div>
                        <div className="checkout-bank-line"><span>Name:</span><span>ClothStreet Pvt Ltd</span></div>
                        <div className="checkout-bank-line"><span>Account:</span><span>1000 2345 6789</span></div>
                        <div className="checkout-bank-line"><span>Branch:</span><span>Colombo 03</span></div>
                      </div>
                      <div className="checkout-upload-box">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 6px" }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Click here to upload transfer receipt
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Row */}
            <div className="checkout-nav-row" style={{ marginTop: "0" }}>
              <button className="checkout-back-btn" onClick={handleBack}>
                ← Back
              </button>
              <button className="checkout-continue-btn" onClick={handleReviewOrder}>
                Review Order
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 4: Confirm ══════════════ */}
        {currentStep === 4 && (
          <div className="checkout-confirm-card">
            <h2 className="checkout-confirm-title">
              Review Your Order
            </h2>

            {/* Shipping Info Box */}
            <div className="checkout-confirm-shipping-box">
              <div className="checkout-confirm-shipping-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="checkout-confirm-shipping-info">
                <h4>Shipping to</h4>
                {deliveryMethod === "home" ? (
                  <p>
                    {form.fullName}<br />
                    {form.streetAddress}, {form.city}, {form.district}
                  </p>
                ) : (
                  <p>
                    <strong>Tailor Delivery</strong><br />
                    {tailors.find(t => t.id === selectedTailor)?.name || "Selected Tailor"}<br />
                    {tailors.find(t => t.id === selectedTailor)?.location}
                  </p>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="checkout-confirm-items">
              {cartItems.map((item) => (
                <div className="checkout-confirm-item" key={item.id}>
                  <div className="checkout-confirm-item-img">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>
                  <div className="checkout-confirm-item-info">
                    <p className="checkout-confirm-item-name">{item.name}</p>
                    <p className="checkout-confirm-item-meta">{item.quantity} {item.unit || "m"}</p>
                  </div>
                  <div className="checkout-confirm-item-price">
                    Rs {(item.unitPrice * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Badge */}
            <div className="checkout-confirm-payment-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              {getPaymentMethodDisplay()}
            </div>

            {/* Actions */}
            <div className="checkout-nav-row" style={{ marginTop: "0" }}>
              <button className="checkout-back-btn" onClick={handleBack}>
                ← Back
              </button>
              <button className="checkout-place-order-btn" onClick={handlePlaceOrder} style={{ width: "auto", flex: 1, marginLeft: "16px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Place Order · Rs {total.toLocaleString()}
              </button>
            </div>
          </div>
        )}

        {/* ── Order Summary (shown on all steps) ── */}
        <div className="checkout-summary-card">
          <h3 className="checkout-summary-title">Order Summary</h3>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div className="checkout-summary-item" key={item.id}>
              <span className="checkout-summary-item-name">
                {item.name} ({item.quantity}
                {item.unit || "m"})
              </span>
              <span className="checkout-summary-item-price">
                Rs {(item.unitPrice * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}

          <hr className="checkout-summary-divider" />

          {/* Subtotal */}
          <div className="checkout-summary-row subtotal">
            <span>Subtotal</span>
            <span>Rs {cartSubtotal.toLocaleString()}</span>
          </div>

          {/* Shipping */}
          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span>Rs {SHIPPING_COST.toLocaleString()}</span>
          </div>

          {/* Total */}
          <div className="checkout-summary-total">
            <span>Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
