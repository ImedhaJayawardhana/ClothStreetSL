import { useState, useEffect, useRef} from"react";
import { useParams, useLocation, useNavigate} from"react-router-dom";
import { collection, addDoc, serverTimestamp} from"firebase/firestore";
import { ref, uploadBytes, getDownloadURL} from"firebase/storage";
import { db, storage} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import { useCart} from"../context/CartContext";
import toast from"react-hot-toast";
import"./RequestQuote.css";

/* ── Measurement fields per gender ── */
const MEASUREMENTS = {
 men: [
 { key:"chest", label:"Chest", placeholder:"e.g. 40"},
 { key:"waist", label:"Waist", placeholder:"e.g. 34"},
 { key:"hip", label:"Hip", placeholder:"e.g. 42"},
 { key:"shoulder", label:"Shoulder Width", placeholder:"e.g. 18"},
 { key:"height", label:"Height", placeholder:"e.g. 72"},
 { key:"armLength", label:"Arm Length", placeholder:"e.g. 25"},
 { key:"inseam", label:"Inseam", placeholder:"e.g. 32"},
 { key:"neck", label:"Neck", placeholder:"e.g. 16"},
 ],
 women: [
 { key:"bust", label:"Bust", placeholder:"e.g. 36"},
 { key:"waist", label:"Waist", placeholder:"e.g. 28"},
 { key:"hip", label:"Hip", placeholder:"e.g. 40"},
 { key:"shoulder", label:"Shoulder Width", placeholder:"e.g. 15"},
 { key:"height", label:"Height", placeholder:"e.g. 65"},
 { key:"armLength", label:"Arm Length", placeholder:"e.g. 23"},
 { key:"inseam", label:"Inseam", placeholder:"e.g. 30"},
 { key:"bustPoint", label:"Bust Point", placeholder:"e.g. 10"},
 ],
};

export default function RequestQuote() {
 const { providerId} = useParams();
 const location = useLocation();
 const navigate = useNavigate();
 const { user} = useAuth();
 const { cartItems} = useCart();
 const fileInputRef = useRef(null);

 /* ── Provider info from navigation state ── */
 const provider = location.state?.provider || null;
 const providerType = provider?.providerType || (providerId?.startsWith("designer-") ?"designer" :"tailor");

 /* ── Cart items from context or sessionStorage fallback ── */
 const [availableItems, setAvailableItems] = useState([]);

 useEffect(() => {
 if (cartItems && cartItems.length > 0) {
 setAvailableItems(cartItems);
} else {
 try {
 const stored = sessionStorage.getItem("clothstreet_checkout_cart");
 if (stored) setAvailableItems(JSON.parse(stored));
} catch {
 /* empty */
}
}
}, [cartItems]);

 /* ── Form State ── */
 const [selectedProducts, setSelectedProducts] = useState([]);
 const [expectedDate, setExpectedDate] = useState("");
 const [requirements, setRequirements] = useState("");
 const [designImages, setDesignImages] = useState([]); // { file, preview}
 const [gender, setGender] = useState("men");
 const [measurements, setMeasurements] = useState({});
 const [submitting, setSubmitting] = useState(false);
 const [dragging, setDragging] = useState(false);

 /* ── Product toggle ── */
 const toggleProduct = (itemId) => {
 setSelectedProducts((prev) =>
 prev.includes(itemId)
 ? prev.filter((id) => id !== itemId)
 : [...prev, itemId]
 );
};

 /* ── Measurement update ── */
 const handleMeasurement = (key, value) => {
 setMeasurements((prev) => ({ ...prev, [key]: value}));
};

 /* ── Image handling ── */
 const handleFiles = (files) => {
 const newImages = Array.from(files)
 .filter((f) => f.type.startsWith("image/"))
 .slice(0, 10 - designImages.length) // max 10 total
 .map((file) => ({
 file,
 preview: URL.createObjectURL(file),
}));
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

 /* ── Drag & Drop ── */
 const handleDragOver = (e) => {
 e.preventDefault();
 setDragging(true);
};
 const handleDragLeave = () => setDragging(false);
 const handleDrop = (e) => {
 e.preventDefault();
 setDragging(false);
 handleFiles(e.dataTransfer.files);
};

 /* ── Submit ── */
 const handleSubmit = async () => {
 if (selectedProducts.length === 0) {
 toast.error("Please select at least one product.");
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

 setSubmitting(true);

 try {
 // Upload images to Firebase Storage
 const imageUrls = [];
 for (const img of designImages) {
 const storageRef = ref(
 storage,
`quotation-images/${Date.now()}-${img.file.name}`
 );
 const snap = await uploadBytes(storageRef, img.file);
 const url = await getDownloadURL(snap.ref);
 imageUrls.push(url);
}

 // Build selected items data
 const selectedItemsData = availableItems
 .filter((item) => selectedProducts.includes(item.id))
 .map((item) => ({
 id: item.id,
 name: item.name,
 quantity: item.quantity,
 unitPrice: item.unitPrice,
 unit: item.unit ||"m",
 image: item.image || null,
}));

 // Create quotation document in Firestore
 await addDoc(collection(db,"quotations"), {
 customerId: user?.uid ||"guest",
 customerName: user?.displayName || user?.email ||"Guest",
 customerEmail: user?.email ||"",
 providerId: providerId,
 providerName: provider?.name ||"Unknown",
 providerType: providerType,
 items: selectedItemsData,
 expectedDate: expectedDate,
 requirements: requirements.trim(),
 designImages: imageUrls,
 gender: gender,
 measurements: measurements,
 status:"pending",
 createdAt: serverTimestamp(),
});

 toast.success("Quote request submitted successfully!");

 // Clean up previews
 designImages.forEach((img) => URL.revokeObjectURL(img.preview));

 // Navigate to orders page
 navigate("/orders");
} catch (err) {
 console.error("Error submitting quote:", err);
 toast.error("Failed to submit quote request. Please try again.");
} finally {
 setSubmitting(false);
}
};

 /* ── Min date (tomorrow) ── */
 const tomorrow = new Date();
 tomorrow.setDate(tomorrow.getDate() + 1);
 const minDate = tomorrow.toISOString().split("T")[0];

 return (
 <div className="rq-page">
 {/* ───────── HERO ───────── */}
 <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-14 px-4">
 <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" />
 <div className="max-w-5xl mx-auto text-center relative z-10">
 <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-4">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 Quote Request
 </span>
 <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
 Request a{""}
 <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
 Custom Quote
 </span>
 </h1>
 <p className="text-base text-violet-200/70 max-w-md mx-auto">
 Tell us your vision and get a personalized quote
 </p>
 </div>
 </section>

 {/* ───────── PROVIDER CARD ───────── */}
 {provider && (
 <div className="rq-provider-card">
 <div className="rq-provider-inner">
 <div className={`rq-provider-avatar ${providerType}`}>
 {provider.name?.charAt(0) ||"?"}
 </div>
 <div className="rq-provider-info">
 <p className="rq-provider-name">{provider.name}</p>
 <p className="rq-provider-meta">
 {provider.location}
 {provider.rating && (
 <>
 <span>·</span>
 <span style={{ color:"#f59e0b"}}>★</span>{""}
 {provider.rating.toFixed(1)}
 </>
 )}
 </p>
 </div>
 <span className={`rq-provider-badge ${providerType}`}>
 {providerType ==="tailor" ?"✂️ Tailor" :"🎨 Designer"}
 </span>
 </div>
 </div>
 )}

 {/* ───────── MAIN CONTENT ───────── */}
 <div className="rq-content">
 {/* Back link */}
 <button className="rq-back-link" onClick={() => navigate(-1)}>
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="m15 18-6-6 6-6" />
 </svg>
 Back
 </button>

 {/* ══════════ 1. SELECT PRODUCTS ══════════ */}
 <div className="rq-section">
 <div className="rq-section-header">
 <div className="rq-section-icon purple">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
 <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
 <line x1="12" y1="22.08" x2="12" y2="12" />
 </svg>
 </div>
 <div>
 <h3 className="rq-section-title">Select Products</h3>
 <p className="rq-section-subtitle">
 Choose which items you need custom work for
 </p>
 </div>
 </div>

 {availableItems.length > 0 ? (
 <div className="rq-product-list">
 {availableItems.map((item) => {
 const isSelected = selectedProducts.includes(item.id);
 return (
 <div
 key={item.id}
 className={`rq-product-item${isSelected ?" selected" :""}`}
 onClick={() => toggleProduct(item.id)}
 >
 <div className="rq-product-checkbox">
 {isSelected && (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 )}
 </div>
 {item.image && (
 <img
 src={item.image}
 alt={item.name}
 className="rq-product-img"
 />
 )}
 <div className="rq-product-info">
 <p className="rq-product-name">{item.name}</p>
 <p className="rq-product-meta">
 {item.quantity} {item.unit ||"m"}
 </p>
 </div>
 <span className="rq-product-price">
 LKR {""}
 {(item.unitPrice * item.quantity).toLocaleString()}
 </span>
 </div>
 );
})}
 </div>
 ) : (
 <p style={{ color:"#71717a", fontSize:"0.9rem", textAlign:"center", padding:"20px 0"}}>
 No items in your cart. Please add items before requesting a quote.
 </p>
 )}
 </div>

 {/* ══════════ 2. EXPECTED DATE ══════════ */}
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
 <p className="rq-section-subtitle">
 When do you need this completed?
 </p>
 </div>
 </div>

 <input
 type="date"
 className="rq-date-input"
 value={expectedDate}
 onChange={(e) => setExpectedDate(e.target.value)}
 min={minDate}
 />
 </div>

 {/* ══════════ 3. REQUIREMENTS ══════════ */}
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
 <p className="rq-section-subtitle">
 Describe what you want — style, fit, details, anything
 </p>
 </div>
 </div>

 <textarea
 className="rq-textarea"
 placeholder="E.g., I need a slim-fit shirt with a mandarin collar, using navy blue cotton. French cuffs preferred. Please see the attached design images for reference..."
 value={requirements}
 onChange={(e) => setRequirements(e.target.value)}
 maxLength={2000}
 />
 <p style={{ textAlign:"right", fontSize:"0.75rem", color:"#a1a1aa", marginTop:"6px"}}>
 {requirements.length}/2000
 </p>
 </div>

 {/* ══════════ 4. DESIGN IMAGES ══════════ */}
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
 <p className="rq-section-subtitle">
 Upload reference images of designs you like (max 10)
 </p>
 </div>
 </div>

 <div
 className={`rq-upload-zone${dragging ?" dragging" :""}`}
 onClick={() => fileInputRef.current?.click()}
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 >
 <div className="rq-upload-icon">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
 <polyline points="17 8 12 3 7 8" />
 <line x1="12" y1="3" x2="12" y2="15" />
 </svg>
 </div>
 <p className="rq-upload-text">
 Click to upload or drag & drop
 </p>
 <p className="rq-upload-hint">
 PNG, JPG, WEBP up to 5MB each · {10 - designImages.length} slots remaining
 </p>
 </div>

 <input
 ref={fileInputRef}
 type="file"
 accept="image/*"
 multiple
 style={{ display:"none"}}
 onChange={(e) => handleFiles(e.target.files)}
 />

 {designImages.length > 0 && (
 <div className="rq-upload-preview-grid">
 {designImages.map((img, idx) => (
 <div key={idx} className="rq-upload-preview">
 <img src={img.preview} alt={`Design ${idx + 1}`} />
 <button
 className="rq-upload-preview-remove"
 onClick={(e) => {
 e.stopPropagation();
 removeImage(idx);
}}
 >
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <line x1="18" y1="6" x2="6" y2="18" />
 <line x1="6" y1="6" x2="18" y2="18" />
 </svg>
 </button>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ══════════ 5. SIZE CHART ══════════ */}
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
 <p className="rq-section-subtitle">
 Provide your body measurements (in inches)
 </p>
 </div>
 </div>

 {/* Gender Toggle */}
 <div className="rq-size-gender-toggle">
 <button
 className={`rq-gender-btn${gender ==="men" ?" active" :""}`}
 onClick={() => setGender("men")}
 >
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="7" r="4" />
 <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
 </svg>
 Men
 </button>
 <button
 className={`rq-gender-btn${gender ==="women" ?" active" :""}`}
 onClick={() => setGender("women")}
 >
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="7" r="4" />
 <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
 </svg>
 Women
 </button>
 </div>

 {/* Body Diagram */}
 <div className="rq-body-diagram">
 <svg viewBox="0 0 100 220" fill="none" stroke="#7c3aed" strokeWidth="1.5">
 {/* Head */}
 <circle cx="50" cy="22" r="15" />
 {/* Neck */}
 <line x1="50" y1="37" x2="50" y2="48" />
 {/* Shoulders */}
 <line x1="20" y1="55" x2="80" y2="55" />
 {/* Torso */}
 <line x1="20" y1="55" x2="25" y2="120" />
 <line x1="80" y1="55" x2="75" y2="120" />
 {/* Waist line */}
 <line x1="30" y1="95" x2="70" y2="95" strokeDasharray="4 3" />
 {/* Hip line */}
 <line x1="25" y1="120" x2="75" y2="120" />
 {/* Left arm */}
 <line x1="20" y1="55" x2="8" y2="115" />
 {/* Right arm */}
 <line x1="80" y1="55" x2="92" y2="115" />
 {/* Left leg */}
 <line x1="35" y1="120" x2="30" y2="200" />
 {/* Right leg */}
 <line x1="65" y1="120" x2="70" y2="200" />
 {/* Inseam */}
 <line x1="50" y1="120" x2="50" y2="200" strokeDasharray="4 3" opacity="0.5" />
 </svg>
 </div>

 {/* Measurement Fields */}
 <div className="rq-size-grid">
 {MEASUREMENTS[gender].map((field) => (
 <div key={field.key} className="rq-size-field">
 <label className="rq-size-label">
 {field.label}
 </label>
 <div className="rq-size-input-wrap">
 <input
 type="number"
 className="rq-size-input"
 placeholder={field.placeholder}
 value={measurements[field.key] ||""}
 onChange={(e) =>
 handleMeasurement(field.key, e.target.value)
}
 min="0"
 step="0.5"
 />
 <span className="rq-size-unit">in</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ══════════ SUBMIT ══════════ */}
 <button
 className="rq-submit-btn"
 onClick={handleSubmit}
 disabled={submitting}
 style={{ marginBottom:"32px"}}
 >
 {submitting ? (
 <>
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:"spin 1s linear infinite"}}>
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
