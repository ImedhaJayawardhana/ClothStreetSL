import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "./Checkout.css";

const STEPS = ["Shipping", "Delivery", "Payment", "Confirm", "Complete"];

export default function Checkout() {
    const { cartItems, cartSubtotal, clearCart } = useCart();
    const navigate = useNavigate();

    const SHIPPING_COST = 500;
    const total = cartSubtotal + SHIPPING_COST;

    /* ── Multi-step state ── */
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(location.state?.step || 1);

    /* ── Step 1: Shipping form state ── */
    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        city: "",
        streetAddress: "",
        district: "",
    });

    // Validate phone: strip spaces/dashes/+94 prefix → must be 10 digits
    const isValidPhone = (phone) => {
        const digits = phone.replace(/[\s\-().+]/g, "").replace(/^94/, "0");
        return /^\d{10}$/.test(digits);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNumber") {
            const cleaned = value.replace(/[^\d\s\-+]/g, "");
            setForm((prev) => ({ ...prev, phoneNumber: cleaned }));
            return;
        }
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleContinueToDelivery = () => {
        const { fullName, phoneNumber, city, streetAddress, district } = form;
        if (!fullName || !phoneNumber || !city || !streetAddress || !district) {
            toast.error("Please fill in all shipping details.");
            return;
        }
        if (!isValidPhone(phoneNumber)) {
            toast.error("Phone number must be exactly 10 digits.");
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
            getDocs(collection(db, "tailors"))
                .then((snapshot) => {
                    setTailorsLoading(true); // ✅ moved inside async callback
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

    /* ── Step 5: Complete state ── */
    const [orderId, setOrderId] = useState(null);

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
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePlaceOrder = () => {
        const newOrderId = "ORD-2026-" + Math.floor(100 + Math.random() * 900);
        setOrderId(newOrderId);
        if (clearCart) clearCart();
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
            {currentStep < 5 && (
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
            )}

            {/* ── Body ── */}
            <div className="checkout-body" style={currentStep === 5 ? { display: "block", maxWidth: "800px" } : {}}>
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
                                    placeholder="0771234567"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    maxLength={15}
                                />
                                {form.phoneNumber && !isValidPhone(form.phoneNumber) && (
                                    <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                                        Phone number must be exactly 10 digits.
                                    </span>
                                )}
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



                            {/* Find a Tailor / Designer */}
                            <div
                                className="checkout-delivery-option checkout-delivery-option-highlight"
                                onClick={() => {
                                    // Store cart context for the quote request flow
                                    sessionStorage.setItem(
                                        "clothstreet_checkout_cart",
                                        JSON.stringify(cartItems)
                                    );
                                    navigate("/find-tailor-designer");
                                }}
                            >
                                <div className="checkout-delivery-option-icon" style={{ background: "linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#7c3aed" }}>
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <div className="checkout-delivery-option-info">
                                    <p className="checkout-delivery-option-name">
                                        Find a Tailor / Designer
                                        <span style={{ marginLeft: "8px", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", background: "linear-gradient(135deg, #7c3aed, #db2777)", color: "#fff", verticalAlign: "middle" }}>NEW</span>
                                    </p>
                                    <p className="checkout-delivery-option-desc">Get custom tailoring or design work for your fabrics</p>
                                </div>
                                <div className="checkout-delivery-option-radio" style={{ borderColor: "#c4b5fd" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>



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
                            <div className="checkout-confirm-shipping-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <h4>Shipping to</h4>
                            </div>
                            <div className="checkout-confirm-shipping-info">
                                <>
                                    {form.fullName}<br />
                                    {form.streetAddress}, {form.city}, {form.district}
                                </>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <p className="checkout-confirm-item-name">{item.name}</p>
                                            <div className="checkout-confirm-item-price">
                                                LKR {(item.unitPrice * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                        <p className="checkout-confirm-item-meta">{item.quantity} {item.unit || "m"}</p>
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
                        <div className="checkout-confirm-actions">
                            <button className="checkout-action-back-btn" onClick={handleBack}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Back
                            </button>
                            <button className="checkout-place-order-btn" onClick={handlePlaceOrder}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Place Order · LKR {total.toLocaleString()}
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════ STEP 5: Complete ══════════════ */}
                {currentStep === 5 && (
                    <div className="checkout-success-container">
                        <div className="checkout-success-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>

                        <div className="checkout-success-badge">Order Confirmed!</div>

                        <h2 className="checkout-success-title">Thank you for your order!</h2>
                        <p className="checkout-success-desc">
                            Your order <strong>{orderId}</strong> has been placed successfully.
                        </p>
                        <p className="checkout-success-subdesc">
                            You'll receive a confirmation and your supplier will contact you within 24 hours.
                        </p>

                        <div className="checkout-success-details">
                            <div className="checkout-success-row">
                                <span>Order ID</span>
                                <span>{orderId}</span>
                            </div>
                            <div className="checkout-success-row">
                                <span>Payment Method</span>
                                <span>{getPaymentMethodDisplay()}</span>
                            </div>
                            <div className="checkout-success-row highlight">
                                <span>Total Paid</span>
                                <span>LKR {total.toLocaleString()}</span>
                            </div>
                            <div className="checkout-success-row">
                                <span>Delivery to</span>
                                <span>{`${form.streetAddress}, ${form.city}`}</span>
                            </div>
                        </div>

                        <div className="checkout-success-actions">
                            <button className="checkout-success-btn-secondary" onClick={() => toast("Tracking features coming soon!", { icon: "🚚" })}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                                Track My Order
                            </button>
                            <button className="checkout-success-btn-primary" onClick={() => window.location.href = "/"}>
                                Continue Shopping
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Order Summary (shown on steps 1-4) ── */}
                {currentStep < 5 && (
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
                                    LKR {(item.unitPrice * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}

                        <hr className="checkout-summary-divider" />

                        {/* Subtotal */}
                        <div className="checkout-summary-row subtotal">
                            <span>Subtotal</span>
                            <span>LKR {cartSubtotal.toLocaleString()}</span>
                        </div>

                        {/* Shipping */}
                        <div className="checkout-summary-row">
                            <span>Shipping</span>
                            <span>LKR {SHIPPING_COST.toLocaleString()}</span>
                        </div>

                        {/* Total */}
                        <div className="checkout-summary-total">
                            <span>Total</span>
                            <span>LKR {total.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
