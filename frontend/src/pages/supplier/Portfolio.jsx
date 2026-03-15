import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { uploadImage } from "../../api";
import { toast } from "react-hot-toast";
import "../CustomerProfile.css";

// ─── Portfolio Gallery (reusable) ─────────────────────────────────────────────
function PortfolioGallery({ images, editMode, onAddImages, onDeleteImage, uploading }) {
    const fileRef = useRef();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="rounded-2xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                            fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm">Portfolio Gallery</span>
                    {images.length > 0 && (
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            {images.length} photos
                        </span>
                    )}
                </div>
                {editMode && (
                    <>
                        <button
                            onClick={() => fileRef.current.click()}
                            disabled={uploading}
                            className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-1.5 hover:bg-purple-50 transition-colors font-medium disabled:opacity-50"
                        >
                            {uploading ? (
                                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            )}
                            {uploading ? "Uploading..." : "Add Photos"}
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                            onChange={(e) => { onAddImages(Array.from(e.target.files)); e.target.value = ""; }} />
                    </>
                )}
            </div>

            <div className="flex gap-3 overflow-x-auto px-5 pb-5 pt-1" style={{ scrollbarWidth: "none" }}>
                {images.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center py-10 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                            fill="none" stroke="#d8b4fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                        <p className="text-sm text-slate-400">No portfolio photos yet</p>
                    </div>
                ) : (
                    images.map((img, idx) => (
                        <div key={idx} className="relative flex-shrink-0 group cursor-pointer" onClick={() => setSelectedImage(img)}>
                            <img src={img} alt={`Portfolio ${idx + 1}`}
                                className="w-40 h-40 object-cover rounded-xl shadow-sm border group-hover:shadow-md transition-shadow duration-200" />
                            {editMode && (
                                <button onClick={(e) => { e.stopPropagation(); onDeleteImage(idx); }}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                                    ✕
                                </button>
                            )}
                            <div className="absolute inset-0 rounded-xl bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    <line x1="11" y1="8" x2="11" y2="14"></line>
                                    <line x1="8" y1="11" x2="14" y2="11"></line>
                                </svg>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-6 right-6 text-white hover:text-slate-300 rounded-full p-2 transition-all"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <img src={selectedImage} alt="Expanded portfolio"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                        onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────
function Tag({ label, onRemove, editMode }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border">
            {label}
            {editMode && onRemove && (
                <button onClick={onRemove}
                    className="w-3.5 h-3.5 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors text-[9px] font-bold text-slate-500">
                    ✕
                </button>
            )}
        </span>
    );
}

// ─── Main Portfolio Page ───────────────────────────────────────────────────────
export default function Portfolio() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Draft state for editing
    const [draftAbout, setDraftAbout] = useState("");
    const [draftLocation, setDraftLocation] = useState("");
    const [draftPhone, setDraftPhone] = useState("");
    const [draftSpecialties, setDraftSpecialties] = useState([]);
    const [draftFabricTypes, setDraftFabricTypes] = useState([]);
    const [draftPortfolioImages, setDraftPortfolioImages] = useState([]);
    const [draftLogoUrl, setDraftLogoUrl] = useState("");
    const [newSpecialtyInput, setNewSpecialtyInput] = useState("");
    const [newFabricTypeInput, setNewFabricTypeInput] = useState("");
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

    const logoRef = useRef();

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            try {
                const snap = await getDoc(doc(db, "sellers", user.uid));
                if (snap.exists()) setProfile(snap.data());
                else setProfile({});
            } catch (err) {
                console.error("Error fetching profile", err);
                setProfile({});
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const displayName = profile?.shopName || user?.name || user?.email || "Seller";
    const avatarLetter = displayName.charAt(0).toUpperCase();

    const enterEditMode = () => {
        setDraftAbout(profile?.about || "");
        setDraftLocation(profile?.location || "");
        setDraftPhone(profile?.phone || "");
        setDraftSpecialties([...(profile?.specialties || [])]);
        setDraftFabricTypes([...(profile?.fabricTypes || [])]);
        setDraftPortfolioImages([...(profile?.portfolioImages || [])]);
        setDraftLogoUrl(profile?.logoUrl || "");
        setEditMode(true);
        setError("");
    };

    const cancelEdit = () => {
        setEditMode(false);
        setError("");
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = "";
        setUploadingLogo(true);
        try {
            const res = await uploadImage(file, "sellers");
            setDraftLogoUrl(res.data.url);
        } catch (err) {
            const msg = err.response?.data?.detail || err.message || "Failed to upload photo.";
            setError(msg);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleAddPortfolioImages = async (files) => {
        setUploadingPortfolio(true);
        for (const file of files) {
            try {
                const res = await uploadImage(file, "portfolio");
                setDraftPortfolioImages((prev) => [...prev, res.data.url]);
            } catch (err) {
                const msg = err.response?.data?.detail || err.message || "Failed to upload image.";
                setError(msg);
            }
        }
        setUploadingPortfolio(false);
    };

    const handleDeletePortfolioImage = (idx) => {
        setDraftPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            const updates = {
                about: draftAbout,
                location: draftLocation,
                phone: draftPhone,
                specialties: draftSpecialties,
                fabricTypes: draftFabricTypes,
                portfolioImages: draftPortfolioImages,
                logoUrl: draftLogoUrl,
            };
            await setDoc(doc(db, "sellers", user.uid), updates, { merge: true });
            setProfile((prev) => ({ ...prev, ...updates }));
            setEditMode(false);
            toast.success("Portfolio saved!");
        } catch (err) {
            const msg = err.message || "Failed to save changes.";
            setError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-transparent border-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    const displayPortfolioImages = editMode ? draftPortfolioImages : (profile?.portfolioImages || []);
    const displaySpecialties = editMode ? draftSpecialties : (profile?.specialties || []);
    const displayFabricTypes = editMode ? draftFabricTypes : (profile?.fabricTypes || []);
    const displayAbout = editMode ? draftAbout : profile?.about;
    const displayLogoUrl = editMode ? draftLogoUrl : profile?.logoUrl;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">

            {/* ── Hero Banner ── */}
            <section className="cp-hero shadow-sm">
                <div className="cp-hero-inner" style={{ justifyContent: "space-between" }}>
                    
                    {/* Left: Icon & Info */}
                    <div className="flex items-start gap-6">
                        
                        {/* Avatar / Logo */}
                        <div className="relative flex-shrink-0">
                            {displayLogoUrl ? (
                                <img src={displayLogoUrl} alt={displayName}
                                    className="w-24 h-24 rounded-2xl object-cover shadow-xl" style={{ border: "2px solid rgba(255,255,255,0.4)" }} />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl shadow-xl bg-white/20 flex items-center justify-center text-4xl font-extrabold text-white backdrop-blur-sm" style={{ border: "2px solid rgba(255,255,255,0.4)" }}>
                                    {avatarLetter}
                                </div>
                            )}
                            {/* Verified badge */}
                            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24"
                                    fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            {editMode && (
                                <>
                                    <button onClick={() => logoRef.current.click()} disabled={uploadingLogo}
                                        className="absolute inset-0 w-24 h-24 rounded-2xl bg-black/40 flex items-center justify-center text-white text-xs font-semibold hover:bg-black/50 transition-colors z-20">
                                        {uploadingLogo ? "Uploading…" : "Change"}
                                    </button>
                                    <input ref={logoRef} type="file" accept="image/*" className="hidden"
                                        onChange={handleLogoChange} />
                                </>
                            )}
                        </div>

                        <div className="cp-hero-info" style={{ marginTop: "4px" }}>
                            <div className="cp-hero-name-row" style={{ marginBottom: "6px" }}>
                                <h1 className="cp-hero-name" style={{ fontSize: "28px" }}>{displayName}</h1>
                                <span style={{ display: "inline-flex", alignItems: "center", padding: "1px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: "600", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
                                    ✦ Verified Supplier
                                </span>
                            </div>

                            <div className="cp-hero-contacts" style={{ marginTop: "12px", gap: "24px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.8)" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {editMode ? (
                                        <input type="text" value={draftLocation}
                                            onChange={(e) => setDraftLocation(e.target.value)}
                                            className="text-sm bg-white/10 border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400 w-48 text-white"
                                            placeholder="City, Sri Lanka" />
                                    ) : (
                                        <span style={{ fontSize: "14px", fontWeight: "400" }}>{profile?.location || "Sri Lanka"}</span>
                                    )}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.8)" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    {editMode ? (
                                        <input type="text" value={draftPhone}
                                            onChange={(e) => setDraftPhone(e.target.value)}
                                            className="text-sm bg-white/10 border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400 w-36 text-white"
                                            placeholder="Contact Phone" />
                                    ) : (
                                        <span style={{ fontSize: "14px", fontWeight: "400" }}>{profile?.phone || "Not provided"}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div>
                        {!editMode && (
                            <button onClick={enterEditMode} disabled={saving} className="cp-edit-btn" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Edit Portfolio
                            </button>
                        )}
                        {editMode && (
                            <div className="flex items-center gap-3">
                                <button onClick={cancelEdit} className="cp-edit-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)" }}>
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving} className="cp-edit-btn" style={{ background: "white", color: "#4c1d95" }}>
                                    {saving ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            {/* Error banner */}
            {error && (
                <div className="max-w-5xl mx-auto px-4 mt-6">
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                    </div>
                </div>
            )}

            {/* ── Page body ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm mb-6 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back
                </button>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ══ LEFT COLUMN ══ */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">

                        {/* About Me */}
                        <div className="rounded-2xl border shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                        fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <h2 className="font-bold text-sm">About Me</h2>
                            </div>
                            {editMode ? (
                                <textarea
                                    className="w-full text-base leading-relaxed resize-none border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    rows={4}
                                    value={draftAbout}
                                    onChange={(e) => setDraftAbout(e.target.value)}
                                    placeholder="Write about your fabric business, specialty, years of experience…"
                                />
                            ) : (
                                <p className="text-base leading-relaxed text-slate-600">
                                    {displayAbout || "Welcome to our store! We supply premium quality fabrics globally, guaranteeing both durability and exquisite texture."}
                                </p>
                            )}
                        </div>

                        {/* Portfolio Gallery */}
                        <PortfolioGallery
                            images={displayPortfolioImages}
                            editMode={editMode}
                            onAddImages={handleAddPortfolioImages}
                            onDeleteImage={handleDeletePortfolioImage}
                            uploading={uploadingPortfolio}
                        />

                        {/* Reviews placeholder */}
                        <div className="rounded-2xl border shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                </div>
                                <h2 className="font-bold text-sm">Customer Reviews</h2>
                            </div>
                            <p className="text-sm text-slate-400">Reviews from customers will appear here.</p>
                        </div>
                    </div>

                    {/* ══ RIGHT COLUMN ══ */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="rounded-2xl border shadow-sm overflow-hidden sticky top-24">

                            {/* Top accent band */}
                            <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

                            <div className="p-6 flex flex-col gap-5">

                                {/* Specialties */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-md bg-purple-50 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                                                fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <p className="font-bold text-sm">Product Specialities</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {displaySpecialties.length === 0 && !editMode && (
                                            <p className="text-xs text-slate-400">No specialties added yet</p>
                                        )}
                                        {displaySpecialties.map((s, i) => (
                                            <Tag key={i} label={s} editMode={editMode}
                                                onRemove={() => setDraftSpecialties((prev) => prev.filter((_, idx) => idx !== i))} />
                                        ))}
                                    </div>
                                    {editMode && (
                                        <div className="flex gap-2 mt-2">
                                            <input type="text" value={newSpecialtyInput}
                                                onChange={(e) => setNewSpecialtyInput(e.target.value)}
                                                placeholder="Add specialty…"
                                                className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && newSpecialtyInput.trim()) {
                                                        setDraftSpecialties((prev) => [...prev, newSpecialtyInput.trim()]);
                                                        setNewSpecialtyInput("");
                                                    }
                                                }} />
                                            <button onClick={() => {
                                                if (newSpecialtyInput.trim()) {
                                                    setDraftSpecialties((prev) => [...prev, newSpecialtyInput.trim()]);
                                                    setNewSpecialtyInput("");
                                                }
                                            }} className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-bold transition-colors">+</button>
                                        </div>
                                    )}
                                </div>

                                {/* Fabric Types */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                                                fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                                                <line x1="20" x2="8.12" y1="4" y2="15.88" />
                                                <line x1="14.47" x2="20" y1="14.48" y2="20" />
                                                <line x1="8.12" x2="12" y1="8.12" y2="12" />
                                            </svg>
                                        </div>
                                        <p className="font-bold text-sm">Fabric Types Offered</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {displayFabricTypes.length === 0 && !editMode && (
                                            <p className="text-xs text-slate-400">No fabric types added yet</p>
                                        )}
                                        {displayFabricTypes.map((c, i) => (
                                            <Tag key={i} label={c} editMode={editMode}
                                                onRemove={() => setDraftFabricTypes((prev) => prev.filter((_, idx) => idx !== i))} />
                                        ))}
                                    </div>
                                    {editMode && (
                                        <div className="flex gap-2 mt-2">
                                            <input type="text" value={newFabricTypeInput}
                                                onChange={(e) => setNewFabricTypeInput(e.target.value)}
                                                placeholder="Add fabric type…"
                                                className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && newFabricTypeInput.trim()) {
                                                        setDraftFabricTypes((prev) => [...prev, newFabricTypeInput.trim()]);
                                                        setNewFabricTypeInput("");
                                                    }
                                                }} />
                                            <button onClick={() => {
                                                if (newFabricTypeInput.trim()) {
                                                    setDraftFabricTypes((prev) => [...prev, newFabricTypeInput.trim()]);
                                                    setNewFabricTypeInput("");
                                                }
                                            }} className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold transition-colors">+</button>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 border-t flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate(`/store/${user?.uid}`)}
                                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md shadow-purple-200">
                                        View My Store
                                    </button>
                                    <button
                                        onClick={() => navigate("/supplier/profile")}
                                        className="flex justify-center items-center gap-2 border hover:bg-gray-50 text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                        Account Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
