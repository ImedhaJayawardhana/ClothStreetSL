import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDesigner, updateDesigner, uploadImage, getMyOrders } from "../../api";
import ReviewSection from "../../components/common/ReviewSection";
import toast from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";

// ─── Default / placeholder designer data ───────────────────────────────────────
const DEFAULT_DESIGNER = {
    uid: "",
    name: "New Designer",
    location: "Colombo, Sri Lanka",
    bio: "I create stunning, bespoke fashion pieces that reflect unique aesthetic visions.",
    profilePhoto: "",
    hourlyRate: 5000,
    rating: 5.0,
    experience: 0,
    phoneNumber: "",
    services: ["Fashion Illustration", "Bespoke Design", "Consultation"],
    aesthetics: ["Minimalist", "Avant-garde", "Streetwear"],
    portfolioImages: [],
    reviews: [
        { id: 1, text: "An absolute visionary! The custom dress exceeded all my expectations.", rating: 5, reviewer: "Amaya Silva" },
        { id: 2, text: "Highly professional and the attention to detail is unmatched.", rating: 5, reviewer: "Kaveen Fernando" },
    ],
};

// ─── Icons & Helpers ──────────────────────────────────────────────────────────
function StarIcon({ filled = true, size = 16 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
            fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function StarRow({ count, size = 14 }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} filled={s <= count} size={size} />
            ))}
        </div>
    );
}

function ShareIcon({ size = 16 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}

function Tag({ label, onRemove, editMode }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border">
            {label}
            {editMode && onRemove && (
                <button onClick={onRemove}
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors text-[9px] font-bold hover:bg-red-100 text-slate-500">
                    ✕
                </button>
            )}
        </span>
    );
}

// Removed original ReviewCard

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
    return <div className={`animate-pulse rounded-xl ${className}`} />;
}

// ─── Portfolio Gallery ────────────────────────────────────────────────────────
function PortfolioGallery({ images, editMode, onAddImages, onDeleteImage, uploading }) {
    const fileRef = useRef();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="rounded-2xl border border-fuchsia-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                            fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm">Portfolio Gallery</span>
                    {images.length > 0 && (
                        <span className="text-xs text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded-full font-medium">
                            {images.length} photos
                        </span>
                    )}
                </div>
                {editMode && (
                    <>
                        <button onClick={() => fileRef.current.click()} disabled={uploading}
                            className="flex items-center gap-1.5 text-xs text-fuchsia-600 border border-fuchsia-200 rounded-lg px-3 py-1.5 hover:bg-fuchsia-50 transition-colors font-medium">
                            {uploading ? "Uploading…" : "+ Add Photos"}
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
                            fill="none" stroke="#fbcfe8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                        <p className="text-sm text-slate-400">No portfolio photos yet</p>
                    </div>
                ) : (
                    images.map((img, idx) => (
                        <div key={idx} className="relative flex-shrink-0 group cursor-pointer" onClick={() => setSelectedImage(img)}>
                            <img src={img} alt={`Portfolio ${idx + 1}`}
                                className="w-40 h-40 object-cover rounded-xl shadow-sm border border-fuchsia-50 group-hover:shadow-md transition-shadow duration-200" />
                            {editMode && (
                                <button onClick={(e) => { e.stopPropagation(); onDeleteImage(idx); }}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                                    ✕
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="Expanded portfolio"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                        onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DesignerProfile() {
    const { designerId } = useParams();
    const navigate = useNavigate();
    const { user: authUser, updateProfile: updateAuthProfile, deleteUserAccount } = useAuth();

    const [designer, setDesigner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Draft state
    const [draftName, setDraftName] = useState("");
    const [draftLocation, setDraftLocation] = useState("");
    const [draftPhoneNumber, setDraftPhoneNumber] = useState("");
    const [draftExperience, setDraftExperience] = useState(0);
    const [draftRating, setDraftRating] = useState(5.0);
    const [draftBio, setDraftBio] = useState("");
    const [draftRate, setDraftRate] = useState(0);
    const [draftServices, setDraftServices] = useState([]);
    const [draftAesthetics, setDraftAesthetics] = useState([]);
    const [draftPortfolioImages, setDraftPortfolioImages] = useState([]);
    const [draftProfilePhoto, setDraftProfilePhoto] = useState("");
    const [newServiceInput, setNewServiceInput] = useState("");
    const [newAestheticInput, setNewAestheticInput] = useState("");
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [draftAvailability, setDraftAvailability] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const [providerEmail, setProviderEmail] = useState("");

    // Profile settings state (owner only)
    const [profileData, setProfileData] = useState({
        name: "", email: "", phone: "",
        address: { street: "", city: "", province: "", zip: "" },
        preferences: { emailAlerts: true, smsAlerts: false }
    });
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteStep, setDeleteStep] = useState(1);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteReason, setDeleteReason] = useState("");
    const [deleteFeedback, setDeleteFeedback] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Personal orders state (orders where designer is the buyer)
    const [personalOrders, setPersonalOrders] = useState([]);
    const [personalOrdersLoading, setPersonalOrdersLoading] = useState(true);

    const profilePhotoRef = useRef();

    const resolvedDesignerId = designerId || authUser?.uid;
    const isOwner = authUser?.uid && authUser.uid === resolvedDesignerId;

    // ── Load designer data from FastAPI ──
    useEffect(() => {
        if (!resolvedDesignerId) {
            setDesigner(DEFAULT_DESIGNER);
            setLoading(false);
            return;
        }
        const fetchDesigner = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getDesigner(resolvedDesignerId);
                setDesigner({ uid: resolvedDesignerId, ...res.data });
            } catch {
                setDesigner({ ...DEFAULT_DESIGNER, uid: resolvedDesignerId });
            } finally {
                setLoading(false);
            }
        };
        fetchDesigner();
    }, [resolvedDesignerId]);

    // ── Fetch personal orders (where designer is the buyer) ──
    useEffect(() => {
        if (!isOwner) { setPersonalOrdersLoading(false); return; }
        getMyOrders()
            .then(res => setPersonalOrders(res.data || []))
            .catch(err => console.error("Personal orders error:", err))
            .finally(() => setPersonalOrdersLoading(false));
    }, [isOwner]);

    useEffect(() => {
        if (authUser) {
            const saved = authUser.savedDesigners || [];
            setIsSaved(saved.includes(resolvedDesignerId));
        }
    }, [authUser, resolvedDesignerId]);

    // Load user profile data for settings (owner only)
    useEffect(() => {
        if (!isOwner || !resolvedDesignerId) return;
        const fetchUserProfile = async () => {
            try {
                const snap = await getDoc(doc(db, "users", resolvedDesignerId));
                if (snap.exists()) {
                    const d = snap.data();
                    setProfileData({
                        name: d.name || "", email: d.email || "", phone: d.phone || "",
                        address: d.address || { street: "", city: "", province: "", zip: "" },
                        preferences: d.preferences || { emailAlerts: true, smsAlerts: false }
                    });
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        };
        fetchUserProfile();
    }, [isOwner, resolvedDesignerId]);

    const enterEditMode = () => {
        setDraftName(designer.name || "");
        setDraftLocation(designer.location || "");
        setDraftPhoneNumber(designer.phoneNumber || "");
        setDraftExperience(designer.experience || 0);
        setDraftRating(designer.rating || 5.0);
        setDraftBio(designer.bio || "");
        setDraftRate(designer.hourlyRate || 0);
        setDraftServices([...(designer.services || [])]);
        setDraftAesthetics([...(designer.aesthetics || [])]);
        setDraftPortfolioImages([...(designer.portfolioImages || [])]);
        setDraftProfilePhoto(designer.profilePhoto || "");
        setDraftAvailability(designer.availability !== undefined ? designer.availability : true);
        setEditMode(true);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setError("");
    };

    // ── Upload profile photo via FastAPI ──
    const handleProfilePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = ""; // reset so same file can be re-selected
        setUploadingPhoto(true);
        setError("");
        try {
            const res = await uploadImage(file, "designer-photos");
            setDraftProfilePhoto(res.data.url);
        } catch (err) {
            console.error("Photo upload failed:", err);
            const msg = err.response?.data?.detail || err.message || "Failed to upload photo. Make sure the backend server is running.";
            setError(msg);
        }
        setUploadingPhoto(false);
    };

    // ── Upload portfolio images via FastAPI ──
    const handleAddPortfolioImages = async (files) => {
        setUploadingPortfolio(true);
        setError("");
        for (const file of files) {
            try {
                const res = await uploadImage(file, "designer-portfolio");
                setDraftPortfolioImages((prev) => [...prev, res.data.url]);
            } catch (err) {
                console.error("Portfolio upload failed:", err);
                const msg = err.response?.data?.detail || err.message || "Failed to upload image. Make sure the backend server is running.";
                setError(msg);
            }
        }
        setUploadingPortfolio(false);
    };

    const handleDeletePortfolioImage = (idx) => {
        setDraftPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
    };

    // ── Save profile via FastAPI ──
    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            await updateDesigner(resolvedDesignerId, {
                name: draftName,
                location: draftLocation,
                phoneNumber: draftPhoneNumber,
                experience: Number(draftExperience),
                rating: Number(draftRating),
                bio: draftBio,
                hourlyRate: Number(draftRate),
                services: draftServices,
                aesthetics: draftAesthetics,
                portfolioImages: draftPortfolioImages,
                profilePhoto: draftProfilePhoto,
                availability: draftAvailability,
            });
            setDesigner((prev) => ({
                ...prev,
                name: draftName,
                location: draftLocation,
                phoneNumber: draftPhoneNumber,
                experience: Number(draftExperience),
                rating: Number(draftRating),
                bio: draftBio,
                hourlyRate: Number(draftRate),
                services: draftServices,
                aesthetics: draftAesthetics,
                portfolioImages: draftPortfolioImages,
                profilePhoto: draftProfilePhoto,
                availability: draftAvailability,
            }));
            setEditMode(false);
        } catch (err) {
            console.error("Save failed:", err);
            const msg = err.response?.data?.detail || "Failed to save changes. Please try again.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleSave = async () => {
        if (!authUser) {
            toast.error("Please login to save designers");
            return;
        }

        const currentSaved = authUser.savedDesigners || [];
        const isCurrentlySaved = currentSaved.includes(resolvedDesignerId);
        
        let newSaved;
        if (isCurrentlySaved) {
            newSaved = currentSaved.filter(id => id !== resolvedDesignerId);
        } else {
            newSaved = [...currentSaved, resolvedDesignerId];
        }

        try {
            await updateAuthProfile(authUser.uid, { savedDesigners: newSaved });
            toast.success(isCurrentlySaved ? "Designer removed" : "Designer saved!");
        } catch (error) {
            console.error("Failed to update saved designers", error);
            toast.error("Failed to update saved designers");
        }
    };

    const handleContactMe = async () => {
        if (!authUser) {
            toast.error("Please login to see contact details");
            return;
        }
        
        // Ensure we have the latest email
        if (!designer?.email && !providerEmail) {
            try {
                const userSnap = await getDoc(doc(db, "users", resolvedDesignerId));
                if (userSnap.exists()) {
                    setProviderEmail(userSnap.data().email || "");
                }
            } catch (err) {
                console.error("Failed to fetch user email:", err);
            }
        }
        setShowContactModal(true);
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: `${designer?.name} – Designer Profile`, url });
        } else {
            navigator.clipboard.writeText(url);
            alert("Profile link copied to clipboard!");
        }
    };

    // ── Profile settings handlers (owner only) ──
    const DELETE_REASONS = ["I found a better alternative", "I'm not using the platform anymore", "Privacy concerns", "Too many emails / notifications", "Other"];

    const handleProfileInputChange = (e) => { const { name, value } = e.target; setProfileData(prev => ({ ...prev, [name]: value })); };
    const handleAddressChange = (e) => { const { name, value } = e.target; setProfileData(prev => ({ ...prev, address: { ...prev.address, [name]: value } })); };

    const handlePreferenceToggle = async (field) => {
        const newPrefs = { ...profileData.preferences, [field]: !profileData.preferences[field] };
        setProfileData(prev => ({ ...prev, preferences: newPrefs }));
        try { await setDoc(doc(db, "users", resolvedDesignerId), { preferences: newPrefs }, { merge: true }); } catch (err) { console.error("Failed to save preference:", err); }
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            await setDoc(doc(db, "users", resolvedDesignerId), { name: profileData.name, phone: profileData.phone, address: profileData.address }, { merge: true });
            setEditingPersonal(false); setEditingAddress(false); toast.success("Profile saved!");
        } catch (err) { console.error("Error saving profile:", err); toast.error("Failed to save profile"); } finally { setSavingProfile(false); }
    };

    const handlePasswordReset = async () => {
        try { await sendPasswordResetEmail(auth, profileData.email); toast.success("Password reset email sent!"); } catch { toast.error("Failed to send reset email"); }
    };

    const openDeleteModal = () => { setShowDeleteModal(true); setDeleteStep(1); setDeletePassword(""); setDeleteReason(""); setDeleteFeedback(""); setDeleteError(""); };
    const closeDeleteModal = () => { setShowDeleteModal(false); setDeleteStep(1); setDeletePassword(""); setDeleteReason(""); setDeleteFeedback(""); setDeleteError(""); setIsDeleting(false); };
    const handleDeleteStep1 = () => { if (!deletePassword.trim()) { setDeleteError("Please enter your password."); return; } setDeleteError(""); setDeleteStep(2); };
    const handleDeleteStep2 = () => { if (!deleteReason) { setDeleteError("Please select a reason."); return; } setDeleteError(""); setDeleteStep(3); };
    const handleDeleteConfirm = async () => {
        setIsDeleting(true); setDeleteError("");
        try { await deleteUserAccount(deletePassword, deleteReason, deleteFeedback || null); closeDeleteModal(); navigate("/"); toast.success("Your account has been deleted."); }
        catch (error) { console.error("Delete failed", error); if (error?.code === "auth/wrong-password" || error?.code === "auth/invalid-credential") { setDeleteStep(1); setDeleteError("Incorrect password."); } else { setDeleteError("Failed to delete account."); } }
        finally { setIsDeleting(false); }
    };

    // ─── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-amber-50 py-10 px-4">
                <div className="max-w-5xl mx-auto space-y-6">
                    <Skeleton className="h-52 w-full bg-slate-100" />
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-40 w-full bg-slate-100" />
                            <Skeleton className="h-52 w-full bg-slate-100" />
                        </div>
                        <div className="w-full lg:w-72 flex-shrink-0">
                            <Skeleton className="h-80 w-full bg-slate-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const displayServices = editMode ? draftServices : designer?.services || [];
    const displayAesthetics = editMode ? draftAesthetics : designer?.aesthetics || [];
    const displayRate = editMode ? draftRate : (designer?.hourlyRate ?? DEFAULT_DESIGNER.hourlyRate);
    const displayProfilePhoto = editMode ? draftProfilePhoto : designer?.profilePhoto;
    const displayBio = editMode ? draftBio : (designer?.bio ?? DEFAULT_DESIGNER.bio);
    const displayPortfolioImages = editMode ? draftPortfolioImages : designer?.portfolioImages || [];
    const reviews = designer?.reviews || DEFAULT_DESIGNER.reviews;

    return (
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-amber-50">

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-r from-fuchsia-800 via-amber-700 to-amber-800 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full" />
                    <div className="absolute top-4 right-32 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-6 left-10 w-48 h-48 bg-fuchsia-900/30 rounded-full" />
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">

                    {/* Error banner */}
                    {error && (
                        <div className="mb-4 bg-red-500/20 border border-red-300/30 text-white rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </div>
                    )}

                    {/* Edit / Save / Cancel buttons */}
                    <div className="flex justify-end mb-6 gap-2">
                        {isOwner && !editMode && (
                            <button onClick={enterEditMode}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all duration-200 backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Edit Profile
                            </button>
                        )}
                        {editMode && (
                            <>
                                <button onClick={cancelEdit}
                                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all duration-200">
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-lg">
                                    {saving ? (
                                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                    {saving ? "Saving…" : "Save Changes"}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Profile identity row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            {displayProfilePhoto ? (
                                <img src={displayProfilePhoto} alt={designer.name}
                                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl" />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl border-4 border-white/30 shadow-xl bg-white/20 flex items-center justify-center text-4xl font-extrabold text-white backdrop-blur-sm">
                                    {designer.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24"
                                    fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            {editMode && (
                                <>
                                    <button onClick={() => profilePhotoRef.current.click()} disabled={uploadingPhoto}
                                        className="absolute inset-0 w-24 h-24 rounded-2xl bg-black/40 flex items-center justify-center text-white text-xs font-semibold hover:bg-black/50 transition-colors">
                                        {uploadingPhoto ? "Uploading…" : "Change"}
                                    </button>
                                    <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden"
                                        onChange={handleProfilePhotoChange} />
                                </>
                            )}
                        </div>

                        {/* Name, role, rating, location, phone, experience */}
                        <div className="flex-1 min-w-0 text-white">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                {editMode ? (
                                    <input type="text" value={draftName} onChange={(e) => setDraftName(e.target.value)}
                                        className="text-2xl font-extrabold leading-tight bg-white/10 border border-white/20 rounded-xl px-3 py-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 w-full max-w-sm"
                                        placeholder="Your Name" />
                                ) : (
                                    <h1 className="text-3xl font-extrabold leading-tight">{designer.name}</h1>
                                )}
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20 backdrop-blur-sm">
                                    ✦ Master Designer
                                </span>
                                {/* Availability Status */}
                                {editMode ? (
                                    <button
                                        onClick={() => setDraftAvailability(!draftAvailability)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${draftAvailability
                                            ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                                            : 'bg-red-500/20 border-red-400/30 text-red-300'
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${draftAvailability ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        {draftAvailability ? 'Available' : 'Unavailable'}
                                        <span className="text-white/50 ml-0.5">▾</span>
                                    </button>
                                ) : (
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${(designer.availability !== false)
                                        ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                                        : 'bg-red-500/20 border-red-400/30 text-red-300'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${(designer.availability !== false) ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        {(designer.availability !== false) ? 'Available' : 'Unavailable'}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                {/* Rating */}
                                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 border border-white/20">
                                    <StarIcon size={14} filled />
                                    {editMode ? (
                                        <input type="number" step="0.1" min="0" max="5" value={draftRating}
                                            onChange={(e) => setDraftRating(e.target.value)}
                                            className="text-yellow-300 font-bold text-sm bg-transparent border-none w-10 focus:outline-none" />
                                    ) : (
                                        <span className="text-yellow-300 font-bold text-sm">{designer.rating?.toFixed(1)}</span>
                                    )}
                                    <span className="text-white/70 text-xs">/ 5.0</span>
                                </div>
                                {/* Experience */}
                                <div className="flex items-center gap-1.5 text-sm text-white/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {editMode ? (
                                        <div className="flex items-center gap-1">
                                            <input type="number" value={draftExperience}
                                                onChange={(e) => setDraftExperience(e.target.value)}
                                                className="text-sm bg-white/10 border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 w-16" />
                                            <span>yrs exp</span>
                                        </div>
                                    ) : (
                                        <span>{designer.experience || 0} years exp.</span>
                                    )}
                                </div>
                                {/* Reviews */}
                                <div className="flex items-center gap-1.5 text-sm text-white/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <span>{reviews.length} reviews</span>
                                </div>
                                {/* Location */}
                                <div className="flex items-center gap-1.5 text-sm text-white/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {editMode ? (
                                        <input type="text" value={draftLocation} onChange={(e) => setDraftLocation(e.target.value)}
                                            className="text-sm bg-white/10 border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 w-48"
                                            placeholder="City, Sri Lanka" />
                                    ) : (
                                        <span>{designer.location || "Sri Lanka"}</span>
                                    )}
                                </div>
                                {/* Phone */}
                                <div className="flex items-center gap-1.5 text-sm text-white/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    {editMode ? (
                                        <input type="text" value={draftPhoneNumber} onChange={(e) => setDraftPhoneNumber(e.target.value)}
                                            className="text-sm bg-white/10 border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 w-36"
                                            placeholder="Contact Phone" />
                                    ) : (
                                        <span>{designer.phoneNumber || "Not provided"}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Page body ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Back Button */}
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

                        {/* Bio card */}
                        <div className="rounded-2xl border border-fuchsia-100 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                        fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <h2 className="font-bold text-sm">About Me</h2>
                            </div>
                            {editMode ? (
                                <textarea className="w-full text-base leading-relaxed resize-none border border-fuchsia-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-fuchsia-50/40"
                                    rows={4} value={draftBio} onChange={(e) => setDraftBio(e.target.value)}
                                    placeholder="Share the story behind your fashion designing journey…" />
                            ) : (
                                <p className="text-base leading-relaxed text-slate-600">{displayBio || "No bio added yet."}</p>
                            )}
                        </div>

                        {/* Portfolio gallery */}
                        <PortfolioGallery
                            images={displayPortfolioImages}
                            editMode={editMode}
                            onAddImages={handleAddPortfolioImages}
                            onDeleteImage={handleDeletePortfolioImage}
                            uploading={uploadingPortfolio}
                        />

                        {/* Reviews section */}
                        <div className="mt-4">
                            <ReviewSection targetType="designer" targetId={resolvedDesignerId} ownerId={resolvedDesignerId} />
                        </div>
                    </div>

                    {/* ══ RIGHT COLUMN ══ */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="rounded-2xl border border-fuchsia-100 shadow-sm overflow-hidden sticky top-24">

                            <div className="h-2 bg-gradient-to-r from-fuchsia-500 via-amber-500 to-amber-500" />

                            <div className="p-6 flex flex-col gap-5">

                                {/* Hourly Rate */}
                                <div className="pb-4 border-b">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Hourly Rate</p>
                                    {editMode ? (
                                        <input type="number" value={draftRate} onChange={(e) => setDraftRate(e.target.value)}
                                            className="border border-fuchsia-200 rounded-xl px-3 py-2 font-extrabold text-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 w-full" />
                                    ) : (
                                        <p className="font-extrabold text-2xl text-slate-900">
                                            LKR {Number(displayRate).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Design Services */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-md bg-fuchsia-50 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                                                fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <p className="font-bold text-sm">Design Services</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {displayServices.length === 0 && !editMode && (
                                            <p className="text-xs text-slate-400">No services added yet</p>
                                        )}
                                        {displayServices.map((s, i) => (
                                            <Tag key={i} label={s} editMode={editMode} colorScheme="purple"
                                                onRemove={() => setDraftServices((prev) => prev.filter((_, idx) => idx !== i))} />
                                        ))}
                                    </div>
                                    {editMode && (
                                        <div className="flex gap-2 mt-2">
                                            <input type="text" value={newServiceInput}
                                                onChange={(e) => setNewServiceInput(e.target.value)}
                                                placeholder="Add service…"
                                                className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && newServiceInput.trim()) {
                                                        setDraftServices((prev) => [...prev, newServiceInput.trim()]);
                                                        setNewServiceInput("");
                                                    }
                                                }} />
                                            <button onClick={() => {
                                                if (newServiceInput.trim()) {
                                                    setDraftServices((prev) => [...prev, newServiceInput.trim()]);
                                                    setNewServiceInput("");
                                                }
                                            }}
                                                className="px-3 py-1.5 rounded-lg bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 text-sm font-bold transition-colors">
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Aesthetics */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                                                fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                                            </svg>
                                        </div>
                                        <p className="font-bold text-sm">Aesthetics</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {displayAesthetics.length === 0 && !editMode && (
                                            <p className="text-xs text-slate-400">No aesthetics added yet</p>
                                        )}
                                        {displayAesthetics.map((a, i) => (
                                            <Tag key={i} label={a} editMode={editMode} colorScheme="indigo"
                                                onRemove={() => setDraftAesthetics((prev) => prev.filter((_, idx) => idx !== i))} />
                                        ))}
                                    </div>
                                    {editMode && (
                                        <div className="flex gap-2 mt-2">
                                            <input type="text" value={newAestheticInput}
                                                onChange={(e) => setNewAestheticInput(e.target.value)}
                                                placeholder="Add aesthetic…"
                                                className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && newAestheticInput.trim()) {
                                                        setDraftAesthetics((prev) => [...prev, newAestheticInput.trim()]);
                                                        setNewAestheticInput("");
                                                    }
                                                }} />
                                            <button onClick={() => {
                                                if (newAestheticInput.trim()) {
                                                    setDraftAesthetics((prev) => [...prev, newAestheticInput.trim()]);
                                                    setNewAestheticInput("");
                                                }
                                            }}
                                                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-bold transition-colors">
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <hr className="border-slate-100" />

                                {/* CTA Buttons */}
                                <div className="flex flex-col gap-2.5">
                                    <button 
                                        onClick={handleContactMe}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-amber-600 hover:from-fuchsia-700 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Contact Me
                                    </button>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => navigate(isOwner ? "/quotation-inbox" : `/request-quote?designerId=${resolvedDesignerId}`, { state: { provider: designer } })}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-fuchsia-200 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                            {isOwner ? "My Quotations" : "Hire Designer"}
                                        </button>
                                        <button onClick={handleToggleSave} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-fuchsia-200 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                                fill={isSaved ? "#ef4444" : "none"} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                            </svg>
                                            {isSaved ? "Saved" : "Save"}
                                        </button>
                                    </div>
                                    <button onClick={handleShare}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium hover:bg-slate-50 transition-colors">
                                        <ShareIcon size={14} />
                                        Share Profile
                                    </button>
                                </div>

                                {/* Trust badge */}
                                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                        fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                    </svg>
                                    <p className="text-emerald-700 text-xs font-medium">Verified ClothStreet Designer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Owner Personal Orders ── */}
            {isOwner && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="border-t border-slate-200 pt-8 mt-4">
                        <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-fuchsia-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                            </div>
                            Personal Orders
                            <span className="text-xs font-bold text-slate-400 ml-auto">
                                {personalOrdersLoading ? "" : `${personalOrders.length} order${personalOrders.length !== 1 ? "s" : ""}`}
                            </span>
                        </h2>

                        {personalOrdersLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="rounded-2xl border p-5 animate-pulse">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100" />
                                            <div className="flex-1 space-y-2"><div className="h-3 bg-slate-100 rounded w-1/2" /><div className="h-2 bg-slate-100 rounded w-1/3" /></div>
                                        </div>
                                        <div className="h-8 bg-slate-100 rounded-xl" />
                                    </div>
                                ))}
                            </div>
                        ) : personalOrders.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-fuchsia-50 flex items-center justify-center mx-auto mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 mb-1">No personal orders yet</h3>
                                <p className="text-xs text-slate-400">When you purchase fabrics from the shop, they’ll appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {personalOrders.map(order => {
                                    const status = order.status?.toLowerCase() || "pending";
                                    const statusStyles = {
                                        pending: "bg-amber-50 text-amber-700 border-amber-200",
                                        processing: "bg-amber-50 text-amber-700 border-amber-200",
                                        shipped: "bg-amber-50 text-amber-700 border-amber-200",
                                        completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                        delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                        cancelled: "bg-red-50 text-red-600 border-red-200",
                                    };
                                    const sc = statusStyles[status] || statusStyles.pending;
                                    const itemNames = order.items?.map(i => i.name).join(", ") || "Order";
                                    return (
                                        <div key={order.id} className="rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all bg-white">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-100 to-pink-100 flex items-center justify-center font-bold text-fuchsia-600 shrink-0">
                                                    {itemNames.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-900 truncate">{itemNames}</h4>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">ID: {order.id?.slice(0, 16)}</p>
                                                    <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-extrabold text-slate-900 shrink-0">LKR {order.total_price?.toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-3">
                                                {order.items?.length} item{order.items?.length !== 1 ? "s" : ""} — {order.items?.map(i => `${i.name} (${i.quantity}${i.unit || "m"})`).join(", ")}
                                            </p>
                                            {order.created_at && (
                                                <p className="text-[10px] text-slate-400 mb-3">Placed: {new Date(order.created_at).toLocaleDateString()}</p>
                                            )}
                                            {["pending", "processing", "shipped"].includes(status) && (
                                                <button onClick={() => navigate(`/order-tracking/${order.id}`, { state: { order } })}
                                                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50 transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                                    Track Order
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Owner Profile Settings ── */}
            {isOwner && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="border-t border-slate-200 pt-8 mt-4">
                        <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-fuchsia-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            Profile Settings
                        </h2>
                        <div className="flex flex-col gap-5">
                            {/* Personal Info */}
                            <div className="rounded-2xl border border-fuchsia-100 shadow-sm p-6 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-fuchsia-50 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><h3 className="font-bold text-sm">Personal Info</h3></div>
                                    <button onClick={() => setEditingPersonal(!editingPersonal)} className="text-xs font-semibold text-fuchsia-600 hover:text-fuchsia-700">{editingPersonal ? "Cancel" : "Edit"}</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {editingPersonal ? (<>
                                        <div><label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label><input type="text" name="name" value={profileData.name} onChange={handleProfileInputChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400" /></div>
                                        <div><label className="block text-xs font-medium text-slate-400 mb-1">Email</label><input type="email" value={profileData.email} disabled className="w-full border rounded-xl px-3 py-2 text-sm bg-slate-50 text-slate-400 cursor-not-allowed" /></div>
                                        <div><label className="block text-xs font-medium text-slate-400 mb-1">Phone</label><input type="tel" name="phone" value={profileData.phone} onChange={handleProfileInputChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400" placeholder="0771234567" /></div>
                                    </>) : (<>
                                        <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Full Name</span><span className="text-sm font-semibold text-slate-800">{profileData.name || "—"}</span></div>
                                        <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Email</span><span className="text-sm font-semibold text-slate-800">{profileData.email || "—"}</span></div>
                                        <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Phone</span><span className="text-sm font-semibold text-slate-800">{profileData.phone || "—"}</span></div>
                                    </>)}
                                </div>
                            </div>
                            {/* Address Details */}
                            <div className="rounded-2xl border border-fuchsia-100 shadow-sm p-6 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-fuchsia-50 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div><h3 className="font-bold text-sm">Address Details</h3></div>
                                    <button onClick={() => setEditingAddress(!editingAddress)} className="text-xs font-semibold text-fuchsia-600 hover:text-fuchsia-700">{editingAddress ? "Cancel" : "Edit"}</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {editingAddress ? (<>
                                        <div className="sm:col-span-2"><label className="block text-xs font-medium text-slate-400 mb-1">Street Address</label><input type="text" name="street" value={profileData.address.street} onChange={handleAddressChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400" /></div>
                                        <div><label className="block text-xs font-medium text-slate-400 mb-1">City</label><input type="text" name="city" value={profileData.address.city} onChange={handleAddressChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400" /></div>
                                        <div><label className="block text-xs font-medium text-slate-400 mb-1">Province</label><input type="text" name="province" value={profileData.address.province} onChange={handleAddressChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400" /></div>
                                        <div><label className="block text-xs font-medium text-slate-400 mb-1">Postal / Zip</label><input type="text" name="zip" value={profileData.address.zip} onChange={handleAddressChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400" /></div>
                                    </>) : (<>
                                        <div className="sm:col-span-2"><span className="block text-xs font-medium text-slate-400 mb-0.5">Street Address</span><span className="text-sm font-semibold text-slate-800">{profileData.address.street || "—"}</span></div>
                                        <div><span className="block text-xs font-medium text-slate-400 mb-0.5">City</span><span className="text-sm font-semibold text-slate-800">{profileData.address.city || "—"}</span></div>
                                        <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Province</span><span className="text-sm font-semibold text-slate-800">{profileData.address.province || "—"}</span></div>
                                        <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Postal / Zip</span><span className="text-sm font-semibold text-slate-800">{profileData.address.zip || "—"}</span></div>
                                    </>)}
                                </div>
                            </div>
                            {/* Preferences */}
                            <div className="rounded-2xl border border-fuchsia-100 shadow-sm p-6 bg-white">
                                <div className="flex items-center gap-2 mb-5"><div className="w-7 h-7 rounded-lg bg-fuchsia-50 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/></svg></div><h3 className="font-bold text-sm">Preferences</h3></div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-800">Email Notifications</p><p className="text-xs text-slate-500">Receive order updates and promotions via email.</p></div><button onClick={() => handlePreferenceToggle("emailAlerts")} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: profileData.preferences.emailAlerts ? "#10B981" : "#EF4444" }}><div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: profileData.preferences.emailAlerts ? "22px" : "2px" }} /></button></div>
                                    <div className="h-px bg-slate-100" />
                                    <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-800">SMS Alerts</p><p className="text-xs text-slate-500">Get real-time text messages when orders are out for delivery.</p></div><button onClick={() => handlePreferenceToggle("smsAlerts")} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: profileData.preferences.smsAlerts ? "#10B981" : "#EF4444" }}><div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: profileData.preferences.smsAlerts ? "22px" : "2px" }} /></button></div>
                                </div>
                            </div>
                            {/* Account Security */}
                            <div className="rounded-2xl border border-fuchsia-100 shadow-sm p-6 bg-white">
                                <div className="flex items-center gap-2 mb-5"><div className="w-7 h-7 rounded-lg bg-fuchsia-50 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><h3 className="font-bold text-sm">Account Security</h3></div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-800">Password</p><p className="text-xs text-slate-500">Send a secure reset link to your email ({profileData.email}).</p></div><button onClick={handlePasswordReset} className="px-4 py-2 rounded-xl border text-xs font-semibold text-fuchsia-600 hover:bg-fuchsia-50 transition-colors">Change Password</button></div>
                                    <div className="h-px bg-slate-100" />
                                    <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-red-600">Delete Account</p><p className="text-xs text-slate-500">Permanently remove your account and data.</p></div><button onClick={openDeleteModal} className="px-4 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">Delete Account</button></div>
                                </div>
                            </div>
                            {(editingPersonal || editingAddress) && (<div className="flex justify-end"><button onClick={handleSaveProfile} disabled={savingProfile} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-amber-600 hover:from-fuchsia-700 hover:to-amber-700 text-white font-semibold text-sm disabled:opacity-50 transition-colors shadow-md">{savingProfile ? "Saving..." : "Save Changes"}</button></div>)}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Account Modal ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeDeleteModal}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg" onClick={closeDeleteModal}>✕</button>
                        <div className="flex justify-center gap-2 mb-6">{[1, 2, 3].map((s) => (<div key={s} className={`w-2.5 h-2.5 rounded-full transition-colors ${s === deleteStep ? "bg-fuchsia-600" : s < deleteStep ? "bg-fuchsia-300" : "bg-slate-200"}`} />))}</div>
                        {deleteStep === 1 && (<><div className="text-center mb-4"><span className="text-3xl">🔒</span></div><h3 className="text-lg font-bold text-center mb-1">Verify Your Identity</h3><p className="text-sm text-slate-500 text-center mb-4">Enter your password to continue.</p><input type="password" placeholder="Enter your password" value={deletePassword} onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(""); }} onKeyDown={(e) => e.key === "Enter" && handleDeleteStep1()} autoFocus className="w-full border rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />{deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}<div className="flex gap-3"><button onClick={closeDeleteModal} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Cancel</button><button onClick={handleDeleteStep1} disabled={!deletePassword.trim()} className="flex-1 py-2.5 rounded-xl bg-fuchsia-600 text-white text-sm font-semibold disabled:opacity-50">Continue</button></div></>)}
                        {deleteStep === 2 && (<><div className="text-center mb-4"><span className="text-3xl">😔</span></div><h3 className="text-lg font-bold text-center mb-1">Sorry to See You Go</h3><p className="text-sm text-slate-500 text-center mb-4">Could you tell us why you{"'"}re leaving?</p><div className="flex flex-col gap-2 mb-4">{DELETE_REASONS.map((reason) => (<label key={reason} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${deleteReason === reason ? "border-fuchsia-400 bg-fuchsia-50" : "hover:bg-slate-50"}`}><input type="radio" name="deleteReason" checked={deleteReason === reason} onChange={() => { setDeleteReason(reason); setDeleteError(""); }} className="accent-fuchsia-600" />{reason}</label>))}</div>{deleteReason === "Other" && <textarea placeholder="Your feedback..." value={deleteFeedback} onChange={(e) => setDeleteFeedback(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-400" rows={3} />}{deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}<div className="flex gap-3"><button onClick={() => setDeleteStep(1)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Back</button><button onClick={handleDeleteStep2} disabled={!deleteReason} className="flex-1 py-2.5 rounded-xl bg-fuchsia-600 text-white text-sm font-semibold disabled:opacity-50">Continue</button></div></>)}
                        {deleteStep === 3 && (<><div className="text-center mb-4"><span className="text-3xl">⚠️</span></div><h3 className="text-lg font-bold text-center mb-1">Are You Absolutely Sure?</h3><p className="text-sm text-slate-500 text-center mb-4">This action is <strong>permanent</strong> and cannot be undone.</p><div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 text-sm text-red-700"><p className="font-semibold mb-2">Deleting your account will:</p><ul className="list-disc pl-4 space-y-1"><li>Remove your profile and personal data</li><li>Delete your designer profile and portfolio</li><li>Remove all saved items</li><li>Archive your order history</li></ul></div>{deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}<div className="flex gap-3"><button onClick={() => setDeleteStep(2)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Go Back</button><button onClick={handleDeleteConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete My Account"}</button></div></>)}
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowContactModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Contact Details</h3>
                            <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                <p className="text-lg font-bold text-slate-900">{designer?.phoneNumber || "Not provided"}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                                <p className="text-lg font-bold text-slate-900">{designer?.email || providerEmail || "Not provided"}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowContactModal(false)}
                            className="w-full mt-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
