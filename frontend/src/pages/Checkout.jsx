import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder, listTailors } from "../api";
import toast from "react-hot-toast";

const CHECKOUT_STYLES = `
.checkout-page { min-height: 60vh; background: #f8f9fb; padding-bottom: 64px; }
.checkout-stepper { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 24px 0 20px; }
.checkout-stepper-inner { max-width: 600px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: center; gap: 0; }
.checkout-step { display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative; min-width: 60px; }
.checkout-step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; border: 2px solid #d4d4d8; background: #fff; color: #a1a1aa; transition: all 0.25s; }
.checkout-step.active .checkout-step-circle { background: var(--clr-primary); border-color: var(--clr-primary); color: #fff; box-shadow: 0 2px 10px rgba(124,58,237,0.3); }
.checkout-step.completed .checkout-step-circle { background: var(--clr-primary); border-color: var(--clr-primary); color: #fff; }
.checkout-step-label { font-size: 0.75rem; font-weight: 500; color: #a1a1aa; text-align: center; white-space: nowrap; }
.checkout-step.active .checkout-step-label { color: var(--clr-primary); font-weight: 600; }
.checkout-step.completed .checkout-step-label { color: var(--clr-primary); }
.checkout-step-dash { flex: 1; height: 2px; min-width: 30px; background: #e5e7eb; margin: 0 4px; align-self: center; margin-bottom: 22px; }
.checkout-step-dash.completed { background: var(--clr-primary); }
.checkout-body { max-width: 1120px; margin: 0 auto; padding: 32px 24px 0; display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
@media (max-width: 900px) { .checkout-body { grid-template-columns: 1fr; } }
.checkout-form-card, .checkout-delivery-card, .checkout-confirm-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px 32px 28px; }
.checkout-form-title, .checkout-delivery-title { display: flex; align-items: center; gap: 10px; font-size: 1.2rem; font-weight: 700; color: #18181b; margin: 0 0 24px; }
.checkout-form-title svg, .checkout-delivery-title svg { color: var(--clr-primary); }
.checkout-form-group { margin-bottom: 18px; }
.checkout-form-label { display: block; font-size: 0.78rem; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.checkout-form-input { width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.95rem; color: #18181b; background: #fafafa; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit; }
.checkout-form-input:focus { border-color: var(--clr-primary); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
.checkout-form-input::placeholder { color: #a1a1aa; }
.checkout-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 500px) { .checkout-form-row { grid-template-columns: 1fr; } }
.checkout-continue-btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 32px; background: linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-primary-2) 100%); color: #fff; border: none; border-radius: 12px; font-size: 0.98rem; font-weight: 700; cursor: pointer; transition: transform 0.15s, box-shadow 0.18s; box-shadow: 0 4px 16px rgba(124,58,237,0.25); margin-top: 8px; }
.checkout-continue-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,58,237,0.35); }
.checkout-continue-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.checkout-summary-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px 28px 24px; }
.checkout-summary-title { font-size: 1.15rem; font-weight: 700; color: #18181b; margin: 0 0 20px; }
.checkout-summary-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #f4f4f5; }
.checkout-summary-item:last-of-type { border-bottom: none; }
.checkout-summary-item-name { font-size: 0.95rem; font-weight: 500; color: #3f3f46; max-width: 200px; }
.checkout-summary-item-price { font-size: 0.95rem; font-weight: 700; color: var(--clr-primary); white-space: nowrap; }
.checkout-summary-divider { border: none; border-top: 1px solid #f1f1f4; margin: 16px 0; }
.checkout-summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.93rem; }
.checkout-summary-row span:first-child { color: #71717a; }
.checkout-summary-row span:last-child { color: #3f3f46; font-weight: 600; }
.checkout-summary-total { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
.checkout-summary-total span:first-child { font-size: 1.02rem; font-weight: 700; color: #18181b; }
.checkout-summary-total span:last-child { font-size: 1.15rem; font-weight: 800; color: #dc2626; }
.checkout-step-check { width: 32px; height: 32px; border-radius: 50%; background: #22c55e; border: 2px solid #22c55e; display: flex; align-items: center; justify-content: center; color: #fff; }
.checkout-delivery-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.checkout-delivery-option { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border: 2px solid #e5e7eb; border-radius: 14px; cursor: pointer; transition: all 0.2s; background: #fff; }
.checkout-delivery-option:hover { border-color: var(--clr-glow); background: #faf5ff; }
.checkout-delivery-option.selected { border-color: var(--clr-primary); background: #f5f3ff; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
.checkout-delivery-option-icon { width: 40px; height: 40px; border-radius: 10px; background: #f4f4f5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.checkout-delivery-option.selected .checkout-delivery-option-icon { background: #ede9fe; }
.checkout-delivery-option-icon svg { width: 20px; height: 20px; color: #71717a; }
.checkout-delivery-option.selected .checkout-delivery-option-icon svg { color: var(--clr-primary); }
.checkout-delivery-option-info { flex: 1; min-width: 0; }
.checkout-delivery-option-name { font-size: 0.98rem; font-weight: 600; color: #18181b; margin: 0 0 2px; }
.checkout-delivery-option-desc { font-size: 0.82rem; color: #71717a; margin: 0; }
.checkout-delivery-option-radio { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #d4d4d8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.checkout-delivery-option.selected .checkout-delivery-option-radio { border-color: var(--clr-primary); }
.checkout-delivery-option-radio-dot { width: 12px; height: 12px; border-radius: 50%; background: transparent; transition: background 0.2s; }
.checkout-delivery-option.selected .checkout-delivery-option-radio-dot { background: var(--clr-primary); }
.checkout-nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; gap: 16px; }
.checkout-back-btn { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #52525b; font-size: 0.92rem; font-weight: 600; cursor: pointer; padding: 8px 4px; border-radius: 8px; transition: color 0.15s; }
.checkout-back-btn:hover { color: var(--clr-primary); }
.checkout-payment-box { margin-top: 10px; margin-bottom: 24px; }
.checkout-payment-details { background: #fafafa; border-top: 1px solid #e5e7eb; padding: 20px; border-radius: 0 0 14px 14px; margin-top: -16px; margin-bottom: 12px; border-left: 2px solid var(--clr-primary); border-right: 2px solid var(--clr-primary); border-bottom: 2px solid var(--clr-primary); }
.checkout-card-form { display: flex; flex-direction: column; gap: 16px; }
.checkout-card-form-row { display: flex; gap: 16px; }
.checkout-bank-details { display: flex; flex-direction: column; gap: 14px; }
.checkout-bank-details p { font-size: 0.9rem; color: #52525b; margin: 0; }
.checkout-bank-account-box { background: #fff; border: 1px dashed #d4d4d8; padding: 16px; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; }
.checkout-bank-line { display: flex; justify-content: space-between; font-size: 0.88rem; }
.checkout-bank-line span:first-child { color: #71717a; }
.checkout-bank-line span:last-child { color: #18181b; font-weight: 600; }
.checkout-confirm-title { font-size: 1.35rem; font-weight: 700; color: #18181b; margin: 0 0 24px; }
.checkout-confirm-shipping-box { background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px; }
.checkout-confirm-shipping-header { display: flex; align-items: center; gap: 8px; }
.checkout-confirm-shipping-header h4 { font-size: 0.95rem; font-weight: 700; color: #18181b; margin: 0; }
.checkout-confirm-shipping-info { padding-left: 26px; font-size: 0.9rem; color: #52525b; line-height: 1.6; }
.checkout-confirm-items { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.checkout-confirm-item { display: flex; align-items: center; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid #f4f4f4; }
.checkout-confirm-item:last-child { border-bottom: none; padding-bottom: 0; }
.checkout-confirm-item-img { width: 60px; height: 60px; border-radius: 10px; background: #f4f4f5; display: flex; align-items: center; justify-content: center; color: #a1a1aa; overflow: hidden; }
.checkout-confirm-item-img img { width: 100%; height: 100%; object-fit: cover; }
.checkout-confirm-item-info { flex: 1; }
.checkout-confirm-item-name { font-size: 0.98rem; font-weight: 600; color: #18181b; margin: 0 0 4px; }
.checkout-confirm-item-meta { font-size: 0.85rem; color: #71717a; margin: 0; }
.checkout-confirm-item-price { font-size: 1rem; font-weight: 700; color: #18181b; }
.checkout-confirm-payment-badge { display: flex; width: 100%; align-items: center; gap: 10px; background: #eef2ff; color: #4f46e5; padding: 16px 20px; border-radius: 12px; font-size: 0.95rem; font-weight: 600; margin-bottom: 24px; }
.checkout-confirm-actions { display: flex; align-items: center; gap: 16px; margin-top: 10px; }
.checkout-action-back-btn { display: flex; align-items: center; justify-content: center; gap: 6px; background: #fff; border: 1px solid #e5e7eb; color: #18181b; font-size: 0.95rem; font-weight: 600; cursor: pointer; padding: 14px 24px; border-radius: 50px; transition: all 0.2s; min-width: 110px; }
.checkout-action-back-btn:hover { background: #f4f4f5; }
.checkout-place-order-btn { display: flex; align-items: center; justify-content: center; gap: 8px; flex: 1; padding: 14px 24px; background: #059669; color: #fff; border: none; border-radius: 50px; font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(5,150,105,0.2); }
.checkout-place-order-btn:hover { background: #047857; transform: translateY(-1px); }
.checkout-place-order-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.checkout-success-container { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 20px; max-width: 600px; margin: 0 auto; }
.checkout-success-icon { width: 80px; height: 80px; background: #dcfce7; color: #16a34a; border-radius: 24px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.checkout-success-badge { display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 6px 16px; border-radius: 50px; font-size: 0.85rem; font-weight: 700; margin-bottom: 16px; }
.checkout-success-title { font-size: 2rem; font-weight: 800; color: #18181b; margin: 0 0 12px; }
.checkout-success-desc { font-size: 0.95rem; color: #52525b; margin: 0 0 8px; line-height: 1.5; }
.checkout-success-desc strong { color: #18181b; font-weight: 700; }
.checkout-success-subdesc { font-size: 0.9rem; color: #71717a; margin: 0 0 32px; }
.checkout-success-details { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; width: 100%; padding: 24px; margin-bottom: 32px; display: flex; flex-direction: column; gap: 16px; }
.checkout-success-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; font-size: 0.9rem; text-align: left; }
.checkout-success-row span:first-child { color: #71717a; min-width: 120px; }
.checkout-success-row span:last-child { color: #18181b; font-weight: 600; text-align: right; }
.checkout-success-row.highlight span:last-child { color: #4f46e5; }
.checkout-success-actions { display: flex; align-items: center; justify-content: center; gap: 16px; width: 100%; }
.checkout-success-btn-secondary { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e5e7eb; color: #18181b; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
.checkout-success-btn-secondary:hover { background: #f4f4f5; }
.checkout-success-btn-primary { display: flex; align-items: center; gap: 8px; background: var(--clr-primary); color: #fff; border: none; padding: 12px 32px; border-radius: 50px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(124,58,237,0.25); }
.checkout-success-btn-primary:hover { background: var(--clr-primary-2); transform: translateY(-1px); }
@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
`;

const STEPS = ["Shipping", "Delivery", "Payment", "Confirm", "Complete"];

const SRI_LANKAN_DISTRICTS = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
    "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala",
    "Mannar", "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
    "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

export default function Checkout() {
    const { selectedCartItems, selectedCartSubtotal, clearSelectedItems } = useCart();
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ── All hooks must be declared before any early return ──

    // ── Auth redirect effect ──
    useEffect(() => {
        if (!loading && !user) {
            toast.error("Please login or create an account to proceed to checkout.");
            navigate("/login", { state: { returnUrl: "/checkout", step: location.state?.step || 1 } });
        }
    }, [user, loading, navigate, location.state]);

    const SHIPPING_COST = 500;
    const total = selectedCartSubtotal + SHIPPING_COST;

    // ── Multi-step state ──
    const [currentStep, setCurrentStep] = useState(location.state?.step || 1);
    const [placingOrder, setPlacingOrder] = useState(false);

    // ── Step 1: Shipping ──
    const [form, setForm] = useState({
        fullName: "", phoneNumber: "", city: "", streetAddress: "", district: "",
    });

    // ── Step 2: Delivery ──
    const [deliveryMethod, setDeliveryMethod] = useState("home");
    const [tailors, setTailors] = useState([]);

    useEffect(() => {
        if (currentStep === 2 && tailors.length === 0) {
            listTailors()
                .then((res) => setTailors(res.data || []))
                .catch((err) => console.error("Error fetching tailors:", err));
        }
    }, [currentStep, tailors.length]);

    // ── Step 3: Payment ──
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

    // ── Step 4: Order ID ──
    const [orderId, setOrderId] = useState(null);

    // ── Early return for auth loading/guard (after all hooks) ──
    if (loading || !user) {
        return (
            <div className="checkout-page flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium">Verifying secure access...</p>
            </div>
        );
    }

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
        setForm((prev) => ({ ...prev, [name]: value }));
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

    const handleContinueToPayment = () => {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCardChange = (e) => {
        setCardDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("Please log in to place an order.");
            navigate("/login");
            return;
        }

        setPlacingOrder(true);
        try {
            const items = selectedCartItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                unit: item.unit || "m",
                image: item.image || null,
            }));

            const res = await createOrder({
                items,
                total_price: total,
                status: "pending",
                shipping: {
                    fullName: form.fullName,
                    phoneNumber: form.phoneNumber,
                    streetAddress: form.streetAddress,
                    city: form.city,
                    district: form.district,
                },
                payment_method: paymentMethod,
                delivery_method: deliveryMethod,
            });

            const newOrderId = res.data.order_id || "ORD-" + Date.now();
            setOrderId(newOrderId);

            if (clearSelectedItems) clearSelectedItems();

            toast.success("Order placed successfully!");
            setCurrentStep(5);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Order failed:", err);
            const msg = err.response?.data?.detail || "Failed to place order. Please try again.";
            toast.error(msg);
        } finally {
            setPlacingOrder(false);
        }
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
            <style>{CHECKOUT_STYLES}</style>

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
                                    <div className={`checkout-step${isActive ? " active" : ""}${isCompleted ? " completed" : ""}`}>
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
                                        <div className={`checkout-step-dash${isCompleted ? " completed" : ""}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Body ── */}
            <div className="checkout-body" style={currentStep === 5 ? { display: "block", maxWidth: "800px" } : {}}>

                {/* ══ STEP 1: Shipping ══ */}
                {currentStep === 1 && (
                    <div className="checkout-form-card">
                        <h2 className="checkout-form-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            Shipping Information
                        </h2>

                        <div className="checkout-form-group">
                            <label className="checkout-form-label">Full Name</label>
                            <input type="text" name="fullName" className="checkout-form-input"
                                placeholder="Kamal Jayawardena" value={form.fullName} onChange={handleChange} />
                        </div>

                        <div className="checkout-form-row">
                            <div className="checkout-form-group">
                                <label className="checkout-form-label">Phone Number</label>
                                <input type="tel" name="phoneNumber" className="checkout-form-input"
                                    placeholder="0771234567" value={form.phoneNumber} onChange={handleChange} maxLength={15} />
                                {form.phoneNumber && !isValidPhone(form.phoneNumber) && (
                                    <span style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", display: "block" }}>
                                        Phone number must be exactly 10 digits.
                                    </span>
                                )}
                            </div>
                            <div className="checkout-form-group">
                                <label className="checkout-form-label">City</label>
                                <input type="text" name="city" className="checkout-form-input"
                                    placeholder="Colombo" value={form.city} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="checkout-form-group">
                            <label className="checkout-form-label">Street Address</label>
                            <input type="text" name="streetAddress" className="checkout-form-input"
                                placeholder="No. 45, Main Street" value={form.streetAddress} onChange={handleChange} />
                        </div>

                        <div className="checkout-form-group">
                            <label className="checkout-form-label">District</label>
                            <select name="district" className="checkout-form-input"
                                value={form.district} onChange={handleChange}
                                style={{ maxWidth: "260px" }}>
                                <option value="" disabled>Select District</option>
                                {SRI_LANKAN_DISTRICTS.map((dist) => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
                        </div>

                        <button className="checkout-continue-btn" onClick={handleContinueToDelivery}>
                            Continue to Delivery
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* ══ STEP 2: Delivery ══ */}
                {currentStep === 2 && (
                    <div className="checkout-delivery-card">
                        <h2 className="checkout-delivery-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="15" height="13" rx="2" />
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                            Delivery Options
                        </h2>

                        <div className="checkout-delivery-options">
                            {/* Home Delivery */}
                            <div className={`checkout-delivery-option${deliveryMethod === "home" ? " selected" : ""}`}
                                onClick={() => setDeliveryMethod("home")}>
                                <div className="checkout-delivery-option-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <div className="checkout-delivery-option-info">
                                    <p className="checkout-delivery-option-name">Home Delivery</p>
                                    <p className="checkout-delivery-option-desc">Deliver to your address · LKR 500</p>
                                </div>
                                <div className="checkout-delivery-option-radio">
                                    <div className="checkout-delivery-option-radio-dot" />
                                </div>
                            </div>

                            {/* Find a Tailor / Designer */}
                            <div className="checkout-delivery-option"
                                style={{ border: "2px solid transparent", background: "linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg,#7c3aed,#db2777) border-box" }}
                                onClick={() => {
                                    sessionStorage.setItem("clothstreet_checkout_cart", JSON.stringify(selectedCartItems));
                                    navigate("/find-tailor-designer");
                                }}>
                                <div className="checkout-delivery-option-icon"
                                    style={{ background: "linear-gradient(135deg,#ede9fe,#fce7f3)" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <div className="checkout-delivery-option-info">
                                    <p className="checkout-delivery-option-name">
                                        Find a Tailor / Designer
                                        <span style={{ marginLeft: 8, fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff", verticalAlign: "middle" }}>NEW</span>
                                    </p>
                                    <p className="checkout-delivery-option-desc">Get custom tailoring or design work</p>
                                </div>
                                <div className="checkout-delivery-option-radio" style={{ borderColor: "#c4b5fd" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-nav-row">
                            <button className="checkout-back-btn" onClick={handleBack}>← Back</button>
                            <button className="checkout-continue-btn" onClick={handleContinueToPayment}>
                                Continue to Payment
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══ STEP 3: Payment ══ */}
                {currentStep === 3 && (
                    <div className="checkout-delivery-card">
                        <h2 className="checkout-delivery-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            Payment Method
                        </h2>

                        <div className="checkout-payment-box">
                            <div className="checkout-delivery-options" style={{ marginBottom: 0 }}>

                                {/* Card */}
                                <div className={`checkout-delivery-option${paymentMethod === "card" ? " selected" : ""}`}
                                    style={{ borderRadius: paymentMethod === "card" ? "14px 14px 0 0" : "14px", borderBottom: paymentMethod === "card" ? "none" : "" }}
                                    onClick={() => setPaymentMethod("card")}>
                                    <div className="checkout-delivery-option-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
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
                                {paymentMethod === "card" && (
                                    <div className="checkout-payment-details">
                                        <div className="checkout-card-form">
                                            <div className="checkout-form-group" style={{ marginBottom: 0 }}>
                                                <label className="checkout-form-label">Card Number</label>
                                                <input type="text" name="number" className="checkout-form-input"
                                                    placeholder="0000 0000 0000 0000" value={cardDetails.number}
                                                    onChange={handleCardChange} maxLength={19} />
                                            </div>
                                            <div className="checkout-card-form-row">
                                                <div className="checkout-form-group" style={{ marginBottom: 0, flex: 1 }}>
                                                    <label className="checkout-form-label">Expiry Date</label>
                                                    <input type="text" name="expiry" className="checkout-form-input"
                                                        placeholder="MM/YY" value={cardDetails.expiry}
                                                        onChange={handleCardChange} maxLength={5} />
                                                </div>
                                                <div className="checkout-form-group" style={{ marginBottom: 0, flex: 1 }}>
                                                    <label className="checkout-form-label">CVV</label>
                                                    <input type="text" name="cvv" className="checkout-form-input"
                                                        placeholder="123" value={cardDetails.cvv}
                                                        onChange={handleCardChange} maxLength={4} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bank Transfer */}
                                <div className={`checkout-delivery-option${paymentMethod === "bank" ? " selected" : ""}`}
                                    style={{ borderRadius: paymentMethod === "bank" ? "14px 14px 0 0" : "14px", borderBottom: paymentMethod === "bank" ? "none" : "", marginTop: paymentMethod === "card" ? 12 : 0 }}
                                    onClick={() => setPaymentMethod("bank")}>
                                    <div className="checkout-delivery-option-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="7" width="20" height="14" rx="2" />
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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
                                {paymentMethod === "bank" && (
                                    <div className="checkout-payment-details">
                                        <div className="checkout-bank-details">
                                            <p>Transfer the total amount to this account and keep the receipt.</p>
                                            <div className="checkout-bank-account-box">
                                                <div className="checkout-bank-line"><span>Bank:</span><span>Commercial Bank</span></div>
                                                <div className="checkout-bank-line"><span>Name:</span><span>ClothStreet Pvt Ltd</span></div>
                                                <div className="checkout-bank-line"><span>Account:</span><span>1000 2345 6789</span></div>
                                                <div className="checkout-bank-line"><span>Branch:</span><span>Colombo 03</span></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="checkout-nav-row" style={{ marginTop: 0 }}>
                            <button className="checkout-back-btn" onClick={handleBack}>← Back</button>
                            <button className="checkout-continue-btn" onClick={handleReviewOrder}>
                                Review Order
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══ STEP 4: Confirm ══ */}
                {currentStep === 4 && (
                    <div className="checkout-confirm-card">
                        <h2 className="checkout-confirm-title">Review Your Order</h2>

                        <div className="checkout-confirm-shipping-box">
                            <div className="checkout-confirm-shipping-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                <h4>Shipping to</h4>
                            </div>
                            <div className="checkout-confirm-shipping-info">
                                {form.fullName}<br />
                                {form.streetAddress}, {form.city}, {form.district}<br />
                                {form.phoneNumber}
                            </div>
                        </div>

                        <div className="checkout-confirm-items">
                            {selectedCartItems.map((item) => (
                                <div className="checkout-confirm-item" key={item.id}>
                                    <div className="checkout-confirm-item-img">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="checkout-confirm-item-info">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
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

                        <div className="checkout-confirm-payment-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            {getPaymentMethodDisplay()}
                        </div>

                        <div className="checkout-confirm-actions">
                            <button className="checkout-action-back-btn" onClick={handleBack}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                Back
                            </button>
                            <button className="checkout-place-order-btn" onClick={handlePlaceOrder} disabled={placingOrder}>
                                {placingOrder ? (
                                    <>
                                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        Place Order · LKR {total.toLocaleString()}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* ══ STEP 5: Complete ══ */}
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
                            Your supplier will contact you within 24 hours.
                        </p>

                        <div className="checkout-success-details">
                            <div className="checkout-success-row">
                                <span>Order ID</span><span>{orderId}</span>
                            </div>
                            <div className="checkout-success-row">
                                <span>Payment Method</span><span>{getPaymentMethodDisplay()}</span>
                            </div>
                            <div className="checkout-success-row highlight">
                                <span>Total Paid</span><span>LKR {total.toLocaleString()}</span>
                            </div>
                            <div className="checkout-success-row">
                                <span>Delivery to</span><span>{form.streetAddress}, {form.city}</span>
                            </div>
                        </div>

                        <div className="checkout-success-actions">
                            <button className="checkout-success-btn-secondary" onClick={() => navigate("/orders")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                                View My Orders
                            </button>
                            <button className="checkout-success-btn-primary" onClick={() => navigate("/shop")}>
                                Continue Shopping
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Order Summary sidebar (steps 1–4) ── */}
                {currentStep < 5 && (
                    <div className="checkout-summary-card">
                        <h3 className="checkout-summary-title">Order Summary</h3>
                        {selectedCartItems.map((item) => (
                            <div className="checkout-summary-item" key={item.id}>
                                <span className="checkout-summary-item-name">
                                    {item.name} ({item.quantity}{item.unit || "m"})
                                </span>
                                <span className="checkout-summary-item-price">
                                    LKR {(item.unitPrice * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}
                        <hr className="checkout-summary-divider" />
                        <div className="checkout-summary-row">
                            <span>Subtotal</span><span>LKR {selectedCartSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="checkout-summary-row">
                            <span>Shipping</span><span>LKR {SHIPPING_COST.toLocaleString()}</span>
                        </div>
                        <div className="checkout-summary-total">
                            <span>Total</span><span>LKR {total.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
