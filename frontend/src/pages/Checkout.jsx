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

  const handleContinueToPayment = () => {
    if (deliveryMethod === "tailor" && !selectedTailor) {
      toast.error("Please select a tailor for delivery.");
      return;
    }
    toast.success("Delivery option saved! Payment step coming soon.");
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
