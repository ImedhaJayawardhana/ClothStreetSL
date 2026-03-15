import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createQuotation, uploadImage } from "../api";
import toast from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const REQUEST_QUOTE_STYLES = `
.rq-page { min-height: 60vh; background: #f8f9fb; padding-bottom: 64px; }
.rq-provider-card { max-width: 960px; margin: -32px auto 0; padding: 0 24px; position: relative; z-index: 20; }
.rq-provider-inner { background: #fff; border-radius: 20px; padding: 24px 28px; display: flex; align-items: center; gap: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
.rq-provider-avatar { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800; color: #fff; flex-shrink: 0; }
.rq-provider-avatar.tailor { background: linear-gradient(135deg, #7c3aed, #6d28d9); }
.rq-provider-avatar.designer { background: linear-gradient(135deg, #e11d48, #db2777); }
.rq-provider-info { flex: 1; min-width: 0; }
.rq-provider-name { font-size: 1.15rem; font-weight: 700; color: #18181b; margin: 0 0 4px; }
.rq-provider-meta { font-size: 0.85rem; color: #71717a; margin: 0; display: flex; align-items: center; gap: 8px; }
.rq-provider-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.rq-provider-badge.tailor { background: #ede9fe; color: #7c3aed; }
.rq-provider-badge.designer { background: #fce7f3; color: #db2777; }
.rq-content { max-width: 960px; margin: 0 auto; padding: 28px 24px 0; }
.rq-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px 28px 24px; margin-bottom: 24px; }
.rq-section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.rq-section-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rq-section-icon.purple { background: #ede9fe; color: #7c3aed; }
.rq-section-icon.blue { background: #dbeafe; color: #2563eb; }
.rq-section-icon.amber { background: #fef3c7; color: #d97706; }
.rq-section-icon.rose { background: #fce7f3; color: #e11d48; }
.rq-section-icon.emerald { background: #d1fae5; color: #059669; }
.rq-section-icon svg { width: 18px; height: 18px; }
.rq-section-title { font-size: 1.1rem; font-weight: 700; color: #18181b; margin: 0; }
.rq-section-subtitle { font-size: 0.82rem; color: #71717a; margin: 2px 0 0; }
.rq-product-list { display: flex; flex-direction: column; gap: 10px; }
.rq-product-item { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border: 2px solid #e5e7eb; border-radius: 14px; cursor: pointer; transition: all 0.2s; background: #fff; }
.rq-product-item:hover { border-color: #c4b5fd; background: #faf5ff; }
.rq-product-item.selected { border-color: #7c3aed; background: #f5f3ff; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
.rq-product-checkbox { width: 22px; height: 22px; border-radius: 6px; border: 2px solid #d4d4d8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; background: #fff; }
.rq-product-item.selected .rq-product-checkbox { background: #7c3aed; border-color: #7c3aed; }
.rq-product-img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; background: #f4f4f5; flex-shrink: 0; }
.rq-product-info { flex: 1; min-width: 0; }
.rq-product-name { font-size: 0.95rem; font-weight: 600; color: #18181b; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rq-product-meta { font-size: 0.8rem; color: #71717a; margin: 0; }
.rq-product-price { font-size: 0.9rem; font-weight: 700; color: #7c3aed; white-space: nowrap; flex-shrink: 0; }
.rq-date-input { width: 100%; max-width: 280px; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.95rem; color: #18181b; background: #fafafa; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit; }
.rq-date-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
.rq-textarea { width: 100%; min-height: 120px; padding: 14px 16px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 0.93rem; color: #18181b; background: #fafafa; outline: none; resize: vertical; font-family: inherit; line-height: 1.5; transition: border-color 0.2s, box-shadow 0.2s; }
.rq-textarea:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
.rq-textarea::placeholder { color: #a1a1aa; }
.rq-upload-zone { border: 2px dashed #d4d4d8; border-radius: 14px; padding: 32px 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: #fafafa; }
.rq-upload-zone:hover { border-color: #7c3aed; background: #f5f3ff; }
.rq-upload-zone.dragging { border-color: #7c3aed; background: #ede9fe; }
.rq-upload-icon { width: 48px; height: 48px; border-radius: 14px; background: #ede9fe; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: #7c3aed; }
.rq-upload-text { font-size: 0.92rem; font-weight: 600; color: #3f3f46; margin: 0 0 4px; }
.rq-upload-hint { font-size: 0.78rem; color: #a1a1aa; margin: 0; }
.rq-upload-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-top: 16px; }
.rq-upload-preview { position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 1; background: #f4f4f5; border: 1px solid #e5e7eb; }
.rq-upload-preview img { width: 100%; height: 100%; object-fit: cover; }
.rq-upload-preview-remove { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.rq-upload-preview-remove:hover { background: rgba(220,38,38,0.85); }
.rq-size-gender-toggle { display: flex; gap: 8px; margin-bottom: 20px; }
.rq-gender-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: 2px solid #e5e7eb; border-radius: 12px; background: #fff; font-size: 0.9rem; font-weight: 600; color: #52525b; cursor: pointer; transition: all 0.2s; }
.rq-gender-btn:hover { border-color: #c4b5fd; background: #faf5ff; }
.rq-gender-btn.active { border-color: #7c3aed; background: #f5f3ff; color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
.rq-size-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 500px) { .rq-size-grid { grid-template-columns: 1fr; } }
.rq-size-field { display: flex; flex-direction: column; gap: 6px; }
.rq-size-label { font-size: 0.78rem; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; }
.rq-size-input-wrap { position: relative; }
.rq-size-input { width: 100%; padding: 11px 50px 11px 14px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.93rem; color: #18181b; background: #fafafa; outline: none; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s; }
.rq-size-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); background: #fff; }
.rq-size-unit { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 0.8rem; font-weight: 600; color: #a1a1aa; }
.rq-submit-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 16px 32px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #fff; border: none; border-radius: 14px; font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: transform 0.15s, box-shadow 0.18s; box-shadow: 0 4px 16px rgba(124,58,237,0.25); }
.rq-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.35); }
.rq-submit-btn:active { transform: translateY(0); }
.rq-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
.rq-back-link { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: #52525b; font-size: 0.9rem; font-weight: 600; cursor: pointer; padding: 8px 4px; border-radius: 8px; transition: color 0.15s; margin-bottom: 24px; }
.rq-back-link:hover { color: #7c3aed; }
.rq-body-diagram { display: flex; justify-content: center; padding: 16px; margin-bottom: 16px; }
.rq-body-diagram svg { width: 120px; height: auto; opacity: 0.15; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const MEASUREMENTS = {
    men: [
        { key: "chest", label: "Chest", placeholder: "e.g. 40" },
        { key: "waist", label: "Waist", placeholder: "e.g. 34" },
        { key: "hip", label: "Hip", placeholder: "e.g. 42" },
        { key: "shoulder", label: "Shoulder Width", placeholder: "e.g. 18" },
        { key: "height", label: "Height", placeholder: "e.g. 72" },
        { key: "armLength", label: "Arm Length", placeholder: "e.g. 25" },
        { key: "inseam", label: "Inseam", placeholder: "e.g. 32" },
        { key: "neck", label: "Neck", placeholder: "e.g. 16" },
    ],
    women: [
        { key: "bust", label: "Bust", placeholder: "e.g. 36" },
        { key: "waist", label: "Waist", placeholder: "e.g. 28" },
        { key: "hip", label: "Hip", placeholder: "e.g. 40" },
        { key: "shoulder", label: "Shoulder Width", placeholder: "e.g. 15" },
        { key: "height", label: "Height", placeholder: "e.g. 65" },
        { key: "armLength", label: "Arm Length", placeholder: "e.g. 23" },
        { key: "inseam", label: "Inseam", placeholder: "e.g. 30" },
        { key: "bustPoint", label: "Bust Point", placeholder: "e.g. 10" },
    ],
};

export default function RequestQuote() {
    const { providerId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems } = useCart();
    const fileInputRef = useRef(null);

    // Provider info from navigation state or URL params
    const provider = location.state?.provider || null;
    const providerType = provider?.providerType ||
        (providerId?.startsWith("designer-") ? "designer" : "tailor");

    // Get tailorId or designerId from URL query params too (e.g. /request-quote?tailorId=xxx)
    const searchParams = new URLSearchParams(location.search);
    const tailorIdFromQuery = searchParams.get("tailorId");
    const designerIdFromQuery = searchParams.get("designerId");
    const resolvedProviderId = providerId || tailorIdFromQuery || designerIdFromQuery;

    // ── Available cart items ──
    const [availableItems, setAvailableItems] = useState([]);

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            setAvailableItems(cartItems);
        } else {
            try {
                const stored = sessionStorage.getItem("clothstreet_checkout_cart");
                if (stored) setAvailableItems(JSON.parse(stored));
            } catch { /* empty */ }
        }
    }, [cartItems]);

    // ── Form State ──
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [expectedDate, setExpectedDate] = useState("");
    const [requirements, setRequirements] = useState(
        location.state?.designerNotes 
            ? `Designer Notes:\n${location.state.designerNotes}\n\nMy Requirements:\n` 
            : ""
    );
    const [designImages, setDesignImages] = useState([]);
    const [attachedDesigns, setAttachedDesigns] = useState(location.state?.designerDeliverables || []);
    const [gender, setGender] = useState("men");
    const [measurements, setMeasurements] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [providerInfo, setProviderInfo] = useState(provider);

    // Fetch provider if missing
    useEffect(() => {
        if (!providerInfo && resolvedProviderId) {
            const fetchProvider = async () => {
                try {
                    const type = designerIdFromQuery ? "designer" : "tailor";
                    let data;
                    if (type === "designer") {
                        const designerSnap = await getDoc(doc(db, "designers", resolvedProviderId));
                        if (designerSnap.exists()) data = designerSnap.data();
                    } else {
                        const tailorSnap = await getDoc(doc(db, "tailors", resolvedProviderId));
                        if (tailorSnap.exists()) data = tailorSnap.data();
                    }
                    if (data) setProviderInfo({ ...data, providerType: type });
                } catch (err) {
                    console.error("Failed to fetch provider info:", err);
                }
            };
            fetchProvider();
        }
    }, [resolvedProviderId, providerInfo, designerIdFromQuery]);

    // ── Product toggle ──
    const toggleProduct = (itemId) => {
        setSelectedProducts((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    // ── Measurement update ──
    const handleMeasurement = (key, value) => {
        setMeasurements((prev) => ({ ...prev, [key]: value }));
    };

    // ── Image handling ──
    const handleFiles = (files) => {
        const newImages = Array.from(files)
            .filter((f) => f.type.startsWith("image/"))
            .slice(0, 10 - designImages.length)
            .map((file) => ({ file, preview: URL.createObjectURL(file) }));
        setDesignImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setDesignImages((prev) => {
            const copy = [...prev];
            URL.revokeObjectURL(copy[index].preview);
            copy.splice(index, 1);
            return copy;
        });
    };

    const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => setDragging(false);
    const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); };

    // ── Submit via FastAPI ──
    const handleSubmit = async () => {
        // Validation
        if (!resolvedProviderId) {
            toast.error("No tailor or designer selected.");
            return;
        }
        if (!expectedDate) {
            toast.error("Please pick an expected date.");
            return;
        }
        if (!requirements.trim()) {
            toast.error("Please describe your requirements.");
            return;
        }
        if (!user) {
            toast.error("Please log in to submit a quote request.");
            navigate("/login");
            return;
        }

        setSubmitting(true);

        try {
            // Build selected items array for the quotation
            const selectedItemData = availableItems
                .filter((item) => selectedProducts.includes(item.id))
                .map((item) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image || "",
                    unitPrice: item.unitPrice || 0,
                    quantity: item.quantity || 1,
                    unit: item.unit || "m",
                }));

            // Estimated price from selected items
            const estimatedPrice = selectedItemData
                .reduce((sum, item) => sum + item.unitPrice * (item.quantity || 1), 0) || 0;

            // Upload local images
            const uploadedUrls = [];
            if (designImages.length > 0) {
                toast.loading("Uploading images...", { id: "uploadToast" });
                for (let i = 0; i < designImages.length; i++) {
                    const res = await uploadImage(designImages[i].file, "quote_references");
                    uploadedUrls.push(res.data.url);
                }
                toast.dismiss("uploadToast");
            }
            
            const finalImages = [...attachedDesigns, ...uploadedUrls];

            // Submit via FastAPI with new schema
            await createQuotation({
                providerId: resolvedProviderId,
                providerName: providerInfo?.name || "",
                providerType: providerType || "tailor",
                serviceMode: searchParams.get("combo") === "true" ? "combo_tailor" : undefined,
                linkedQuotationId: location.state?.designerQuotationId || undefined,
                description: requirements.trim(),
                requirements: requirements.trim(),
                budget: estimatedPrice,
                expectedDate: expectedDate,
                gender: gender,
                items: selectedItemData,
                measurements: measurements,
                designImages: finalImages,
                customerName: user?.name || user?.displayName || "",
                customerEmail: user?.email || "",
            });

            toast.success("Quote request submitted successfully!");

            // Clean up image previews
            designImages.forEach((img) => URL.revokeObjectURL(img.preview));

            // Navigate to quotations page
            navigate("/quotations/offers");
        } catch (err) {
            console.error("Error submitting quote:", err);
            const detail = err.response?.data?.detail;
            const msg = typeof detail === "string"
                ? detail
                : "Failed to submit. Please try again.";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    return (
        <div className="rq-page">
            <style>{REQUEST_QUOTE_STYLES}</style>

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-14 px-4">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Quote Request
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white">
                        Request a{" "}
                        <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                            Custom Quote
                        </span>
                    </h1>
                    <p className="text-base text-violet-200/70 max-w-md mx-auto">
                        Tell us your vision and get a personalized quote
                    </p>
                </div>
            </section>

            {/* ── Provider Card ── */}
            {providerInfo && (
                <div className="rq-provider-card">
                    <div className="rq-provider-inner">
                        <div className={`rq-provider-avatar ${providerType}`}>
                            {providerInfo.name?.charAt(0) || "?"}
                        </div>
                        <div className="rq-provider-info">
                            <p className="rq-provider-name">{providerInfo.name}</p>
                            <p className="rq-provider-meta">
                                {providerInfo.location}
                                {providerInfo.rating && (
                                    <><span>·</span><span style={{ color: "#f59e0b" }}>★</span>{providerInfo.rating.toFixed(1)}</>
                                )}
                            </p>
                        </div>
                        <span className={`rq-provider-badge ${providerType}`}>
                            {providerType === "tailor" ? "✂️ Tailor" : "🎨 Designer"}
                        </span>
                    </div>
                </div>
            )}

            {/* ── Main Content ── */}
            <div className="rq-content">
                <button className="rq-back-link" onClick={() => navigate(-1)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                </button>

                {/* 1. Select Products */}
                <div className="rq-section">
                    <div className="rq-section-header">
                        <div className="rq-section-icon purple">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="rq-section-title">Select Products</h3>
                            <p className="rq-section-subtitle">Choose which items you need custom work for</p>
                        </div>
                    </div>

                    {availableItems.length > 0 ? (
                        <div className="rq-product-list">
                            {availableItems.map((item) => {
                                const isSelected = selectedProducts.includes(item.id);
                                return (
                                    <div key={item.id}
                                        className={`rq-product-item${isSelected ? " selected" : ""}`}
                                        onClick={() => toggleProduct(item.id)}>
                                        <div className="rq-product-checkbox">
                                            {isSelected && (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </div>
                                        {item.image && <img src={item.image} alt={item.name} className="rq-product-img" />}
                                        <div className="rq-product-info">
                                            <p className="rq-product-name">{item.name}</p>
                                            <p className="rq-product-meta">{item.quantity} {item.unit || "m"}</p>
                                        </div>
                                        <span className="rq-product-price">
                                            LKR {(item.unitPrice * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <p style={{ color: "#71717a", fontSize: "0.9rem", marginBottom: 8 }}>
                                No items in your cart.
                            </p>
                            <p style={{ color: "#a1a1aa", fontSize: "0.8rem" }}>
                                You can still submit a quote request — just describe your requirements below.
                            </p>
                        </div>
                    )}
                </div>

                {/* 2. Expected Date */}
                <div className="rq-section">
                    <div className="rq-section-header">
                        <div className="rq-section-icon blue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="rq-section-title">Expected Date</h3>
                            <p className="rq-section-subtitle">When do you need this completed?</p>
                        </div>
                    </div>
                    <input type="date" className="rq-date-input"
                        value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} min={minDate} />
                </div>

                {/* 3. Requirements */}
                <div className="rq-section">
                    <div className="rq-section-header">
                        <div className="rq-section-icon amber">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="rq-section-title">Your Requirements</h3>
                            <p className="rq-section-subtitle">Describe what you want — style, fit, details, anything</p>
                        </div>
                    </div>
                    <textarea className="rq-textarea"
                        placeholder="E.g., I need a slim-fit shirt with a mandarin collar, using navy blue cotton..."
                        value={requirements} onChange={(e) => setRequirements(e.target.value)} maxLength={2000} />
                    <p style={{ textAlign: "right", fontSize: "0.75rem", color: "#a1a1aa", marginTop: "6px" }}>
                        {requirements.length}/2000
                    </p>
                </div>

                {/* 4. Design Images */}
                <div className="rq-section">
                    <div className="rq-section-header">
                        <div className="rq-section-icon rose">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="rq-section-title">Design Images</h3>
                            <p className="rq-section-subtitle">Upload reference images (max 10) — optional</p>
                        </div>
                    </div>

                    <div className={`rq-upload-zone${dragging ? " dragging" : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <div className="rq-upload-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <p className="rq-upload-text">Click to upload or drag & drop</p>
                        <p className="rq-upload-hint">
                            PNG, JPG, WEBP · {10 - designImages.length} slots remaining
                        </p>
                    </div>

                    <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                        onChange={(e) => handleFiles(e.target.files)} />

                    {designImages.length > 0 && (
                        <div className="rq-upload-preview-grid">
                            {designImages.map((img, idx) => (
                                <div key={`upload-${idx}`} className="rq-upload-preview">
                                    <img src={img.preview} alt={`Design Upload ${idx + 1}`} />
                                    <button className="rq-upload-preview-remove"
                                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {attachedDesigns.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Attached from Designer</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {attachedDesigns.map((url, idx) => {
                                    const isPdf = url.toLowerCase().includes('.pdf');
                                    return (
                                        <div key={`attached-${idx}`} className="relative border rounded-lg overflow-hidden bg-gray-50 aspect-square flex flex-col items-center justify-center">
                                            {isPdf ? (
                                                <div className="text-3xl">📄</div>
                                            ) : (
                                                <img src={url} alt={`Attached ${idx+1}`} className="w-full h-full object-cover" />
                                            )}
                                            <button 
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                onClick={() => setAttachedDesigns(prev => prev.filter((_, i) => i !== idx))}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                </div>

                {/* 5. Size Chart */}
                <div className="rq-section">
                    <div className="rq-section-header">
                        <div className="rq-section-icon emerald">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="rq-section-title">Size Chart</h3>
                            <p className="rq-section-subtitle">Provide your body measurements (in inches) — optional</p>
                        </div>
                    </div>

                    <div className="rq-size-gender-toggle">
                        {["men", "women"].map((g) => (
                            <button key={g} className={`rq-gender-btn${gender === g ? " active" : ""}`}
                                onClick={() => setGender(g)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="7" r="4" />
                                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                                </svg>
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="rq-body-diagram">
                        <svg viewBox="0 0 100 220" fill="none" stroke="#7c3aed" strokeWidth="1.5">
                            <circle cx="50" cy="22" r="15" />
                            <line x1="50" y1="37" x2="50" y2="48" />
                            <line x1="20" y1="55" x2="80" y2="55" />
                            <line x1="20" y1="55" x2="25" y2="120" />
                            <line x1="80" y1="55" x2="75" y2="120" />
                            <line x1="30" y1="95" x2="70" y2="95" strokeDasharray="4 3" />
                            <line x1="25" y1="120" x2="75" y2="120" />
                            <line x1="20" y1="55" x2="8" y2="115" />
                            <line x1="80" y1="55" x2="92" y2="115" />
                            <line x1="35" y1="120" x2="30" y2="200" />
                            <line x1="65" y1="120" x2="70" y2="200" />
                        </svg>
                    </div>

                    <div className="rq-size-grid">
                        {MEASUREMENTS[gender].map((field) => (
                            <div key={field.key} className="rq-size-field">
                                <label className="rq-size-label">{field.label}</label>
                                <div className="rq-size-input-wrap">
                                    <input type="number" className="rq-size-input"
                                        placeholder={field.placeholder} value={measurements[field.key] || ""}
                                        onChange={(e) => handleMeasurement(field.key, e.target.value)}
                                        min="0" step="0.5" />
                                    <span className="rq-size-unit">in</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button className="rq-submit-btn" onClick={handleSubmit}
                    disabled={submitting || !requirements.trim() || !expectedDate}
                    style={{ marginBottom: "32px" }}>
                    {submitting ? (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                style={{ animation: "spin 1s linear infinite" }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            Submit Quote Request
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
