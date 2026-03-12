import { useState } from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./Checkout.css";

const STEPS = ["Shipping", "Delivery", "Payment", "Confirm", "Complete"];

export default function Checkout() {
  const { cartItems, cartSubtotal } = useCart();

  const SHIPPING_COST = 2500;
  const total = cartSubtotal + SHIPPING_COST;

  /* ── Form state ── */
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

  const handleContinue = () => {
    const { fullName, phoneNumber, city, streetAddress, district } = form;
    if (!fullName || !phoneNumber || !city || !streetAddress || !district) {
      toast.error("Please fill in all shipping details.");
      return;
    }
    toast.success("Shipping details saved! Delivery step coming soon.");
  };

  /* ── Current step (1-indexed) ── */
  const currentStep = 1;

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
                  <div className="checkout-step-circle">{stepNum}</div>
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
        {/* ── Shipping Form ── */}
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
          <button className="checkout-continue-btn" onClick={handleContinue}>
            Continue to Delivery
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ── Order Summary ── */}
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
