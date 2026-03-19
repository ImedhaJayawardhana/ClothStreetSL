import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTailor, updateTailor, uploadImage } from "../../api";
import ReviewSection from "../../components/common/ReviewSection";
import toast from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";

// ─── Default / placeholder tailor data ───────────────────────────────────────
const DEFAULT_TAILOR = {
    uid: "",
    name: "Nimal Perera",
    bio: "I deliver professional tailoring services with attention to detail, quality fabrics, and flawless stitching.",
    profilePhoto: "",
    startingPrice: 2000,
    rating: 4.7,
    phoneNumber: "0712345678",
    location: "Colombo, Sri Lanka",
    services: ["Suits", "Dresses", "Customize designs"],
    customizationTypes: ["Measurement Base", "Design Base"],
    portfolioImages: [],
    reviews: [
        {
            id: 1,
            text: "Absolutely stunning work! The suit fit perfectly and the craftsmanship was impeccable.",
            rating: 5,
            reviewer: "Shalini Fernando",
        },
        {
            id: 2,
            text: "Professional and punctual. My wedding dress was delivered exactly as discussed. Highly recommend!",
            rating: 5,
            reviewer: "Ravi Wijesinghe",
        },
        {
            id: 3,
            text: "Great quality uniforms delivered on time. Minor issue was fixed promptly. Very satisfied.",
            rating: 4,
            reviewer: "Chamara Bandara",
        },
    ],
};

// ─── Star Icon ────────────────────────────────────────────────────────────────
function StarIcon({ filled = true, size = 16 }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "#f59e0b" : "none"}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
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

// ─── Share Icon ───────────────────────────────────────────────────────────────
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
    return <div className={`animate-pulse rounded-xl ${className}`} />;
}

// ─── Portfolio Gallery ────────────────────────────────────────────────────────
function PortfolioGallery({ images, editMode, onAddImages, onDeleteImage, uploading }) {
    const fileRef = useRef();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="rounded-2xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                            fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm">Portfolio Gallery</span>
                    {images.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium">
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

            {/* Scrollable row */}
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
                                <button onClick={(e) => { e.stopPropagation(); onDeleteImage(idx, img); }}
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

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-slate-300 rounded-full p-2 transition-all"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Expanded portfolio"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
// Removed original ReviewCard

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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TailorProfile() {
    const { tailorId } = useParams();
    const navigate = useNavigate();
    const { user: authUser, updateProfile: updateAuthProfile, deleteUserAccount } = useAuth();

    // ── State ──
    const [tailor, setTailor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Draft state
    const [draftBio, setDraftBio] = useState("");
    const [draftPrice, setDraftPrice] = useState(0);
    const [draftName, setDraftName] = useState("");
    const [draftLocation, setDraftLocation] = useState("");
    const [draftPhoneNumber, setDraftPhoneNumber] = useState("");
    const [draftExperience, setDraftExperience] = useState(0);
    const [draftRating, setDraftRating] = useState(4.5);
    const [draftServices, setDraftServices] = useState([]);
    const [draftCustomTypes, setDraftCustomTypes] = useState([]);
    const [draftPortfolioImages, setDraftPortfolioImages] = useState([]);
    const [draftProfilePhoto, setDraftProfilePhoto] = useState("");
    const [newServiceInput, setNewServiceInput] = useState("");
    const [newCustomTypeInput, setNewCustomTypeInput] = useState("");
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [draftAvailability, setDraftAvailability] = useState(true);
    const [providerEmail, setProviderEmail] = useState("");
    const [showContactModal, setShowContactModal] = useState(false);

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

    const profilePhotoRef = useRef();

    const resolvedTailorId = tailorId || authUser?.uid;
    const isOwner = authUser?.uid && authUser.uid === resolvedTailorId;

    // ── Load tailor data from FastAPI ──
    useEffect(() => {
        if (!resolvedTailorId) {
            setTailor(DEFAULT_TAILOR);
            setLoading(false);
            return;
        }
        const fetchTailor = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getTailor(resolvedTailorId);
                setTailor({ uid: resolvedTailorId, ...res.data });
            } catch {
                // Tailor profile not created yet — use defaults
                setTailor({ ...DEFAULT_TAILOR, uid: resolvedTailorId });
            } finally {
                setLoading(false);
            }
        };
        fetchTailor();
    }, [resolvedTailorId]);

    // Update isSaved from authUser data
    useEffect(() => {
        if (authUser) {
            const saved = authUser.savedTailors || [];
            setIsSaved(saved.includes(resolvedTailorId));
        }
    }, [authUser, resolvedTailorId]);

    // Load user profile data for settings (owner only)
    useEffect(() => {
        if (!isOwner || !resolvedTailorId) return;
        const fetchUserProfile = async () => {
            try {
                const snap = await getDoc(doc(db, "users", resolvedTailorId));
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
    }, [isOwner, resolvedTailorId]);

    // ── Enter edit mode ──
    const enterEditMode = () => {
        setDraftName(tailor.name || "");
        setDraftLocation(tailor.location || "");
        setDraftPhoneNumber(tailor.phoneNumber || "");
        setDraftExperience(tailor.experience || 0);
        setDraftRating(tailor.rating || 4.5);
        setDraftBio(tailor.bio || "");
        setDraftPrice(tailor.startingPrice || 0);
        setDraftServices([...(tailor.services || [])]);
        setDraftCustomTypes([...(tailor.customizationTypes || [])]);
        setDraftPortfolioImages([...(tailor.portfolioImages || [])]);
        setDraftProfilePhoto(tailor.profilePhoto || "");
        setDraftAvailability(tailor.availability !== undefined ? tailor.availability : true);
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
            const res = await uploadImage(file, "tailors");
            setDraftProfilePhoto(res.data.url);
        } catch (err) {
            console.error("Photo upload failed:", err);
            const msg = err.response?.data?.detail || err.message || "Failed to upload photo. Make sure the backend server is running.";
            setError(msg);
        } finally {
            setUploadingPhoto(false);
        }
    };

    // ── Upload portfolio images via FastAPI ──
    const handleAddPortfolioImages = async (files) => {
        setUploadingPortfolio(true);
        setError("");
        for (const file of files) {
            try {
                const res = await uploadImage(file, "portfolio");
                setDraftPortfolioImages((prev) => [...prev, res.data.url]);

            } catch (err) {
                console.error("Portfolio upload failed:", err);
                const msg = err.response?.data?.detail || err.message || "Failed to upload image. Make sure the backend server is running.";
                setError(msg);
            }
        }
        setUploadingPortfolio(false);
    };

    // ── Delete portfolio image ──
    const handleDeletePortfolioImage = (idx) => {
        setDraftPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
    };

    // ── Save profile via FastAPI ──
    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            await updateTailor(resolvedTailorId, {
                name: draftName,
                location: draftLocation,
                phoneNumber: draftPhoneNumber,
                bio: draftBio,
                startingPrice: Number(draftPrice),
                services: draftServices,
                customizationTypes: draftCustomTypes,
                portfolioImages: draftPortfolioImages,
                profilePhoto: draftProfilePhoto,
                experience: Number(draftExperience),
                rating: Number(draftRating),
                availability: draftAvailability,
            });
            // Update local state immediately
            setTailor((prev) => ({
                ...prev,
                name: draftName,
                location: draftLocation,
                phoneNumber: draftPhoneNumber,
                bio: draftBio,
                startingPrice: Number(draftPrice),
                services: draftServices,
                customizationTypes: draftCustomTypes,
                portfolioImages: draftPortfolioImages,
                profilePhoto: draftProfilePhoto,
                experience: Number(draftExperience),
                rating: Number(draftRating),
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
            toast.error("Please login to save tailors");
            return;
        }

        const currentSaved = authUser.savedTailors || [];
        const isCurrentlySaved = currentSaved.includes(resolvedTailorId);
        
        let newSaved;
        if (isCurrentlySaved) {
            newSaved = currentSaved.filter(id => id !== resolvedTailorId);
        } else {
            newSaved = [...currentSaved, resolvedTailorId];
        }

        try {
            await updateAuthProfile(authUser.uid, { savedTailors: newSaved });
            toast.success(isCurrentlySaved ? "Tailor removed" : "Tailor saved!");
        } catch (error) {
            console.error("Failed to update saved tailors", error);
            toast.error("Failed to update saved tailors");
        }
    };

    // ── Share profile ──
    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: `${tailor?.name} – Tailor Profile`, url });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Profile link copied!");
        }
    };

    const handleContactMe = async () => {
        if (!authUser) {
            toast.error("Please login to see contact details");
            return;
        }
        
        // Ensure we have the latest email
        if (!tailor?.email && !providerEmail) {
            try {
                const userSnap = await getDoc(doc(db, "users", resolvedTailorId));
                if (userSnap.exists()) {
                    setProviderEmail(userSnap.data().email || "");
                }
            } catch (err) {
                console.error("Failed to fetch user email:", err);
            }
        }
        setShowContactModal(true);
    };

    // ── Profile settings handlers (owner only) ──
    const DELETE_REASONS = [
        "I found a better alternative",
        "I'm not using the platform anymore",
        "Privacy concerns",
        "Too many emails / notifications",
        "Other",
    ];

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    };

    const handlePreferenceToggle = async (field) => {
        const newPrefs = { ...profileData.preferences, [field]: !profileData.preferences[field] };
        setProfileData(prev => ({ ...prev, preferences: newPrefs }));
        try {
            await setDoc(doc(db, "users", resolvedTailorId), { preferences: newPrefs }, { merge: true });
        } catch (err) {
            console.error("Failed to save preference:", err);
        }
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            await setDoc(doc(db, "users", resolvedTailorId), {
                name: profileData.name, phone: profileData.phone, address: profileData.address,
            }, { merge: true });
            setEditingPersonal(false);
            setEditingAddress(false);
            toast.success("Profile saved!");
        } catch (err) {
            console.error("Error saving profile:", err);
            toast.error("Failed to save profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, profileData.email);
            toast.success("Password reset email sent!");
        } catch {
            toast.error("Failed to send reset email");
        }
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true); setDeleteStep(1); setDeletePassword(""); setDeleteReason(""); setDeleteFeedback(""); setDeleteError("");
    };
    const closeDeleteModal = () => {
        setShowDeleteModal(false); setDeleteStep(1); setDeletePassword(""); setDeleteReason(""); setDeleteFeedback(""); setDeleteError(""); setIsDeleting(false);
    };
    const handleDeleteStep1 = () => {
        if (!deletePassword.trim()) { setDeleteError("Please enter your password."); return; }
        setDeleteError(""); setDeleteStep(2);
    };
    const handleDeleteStep2 = () => {
        if (!deleteReason) { setDeleteError("Please select a reason."); return; }
        setDeleteError(""); setDeleteStep(3);
    };
    const handleDeleteConfirm = async () => {
        setIsDeleting(true); setDeleteError("");
        try {
            await deleteUserAccount(deletePassword, deleteReason, deleteFeedback || null);
            closeDeleteModal(); navigate("/");
            toast.success("Your account has been deleted. We're sorry to see you go.");
        } catch (error) {
            console.error("Delete failed", error);
            if (error?.code === "auth/wrong-password" || error?.code === "auth/invalid-credential") {
                setDeleteStep(1); setDeleteError("Incorrect password. Please try again.");
            } else { setDeleteError("Failed to delete account. Please try again."); }
        } finally { setIsDeleting(false); }
    };

    // ─── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-10 px-4">
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

    const displayPortfolioImages = editMode ? draftPortfolioImages : tailor?.portfolioImages || [];
    const displayServices = editMode ? draftServices : tailor?.services || [];
    const displayCustomTypes = editMode ? draftCustomTypes : tailor?.customizationTypes || [];
    const displayBio = editMode ? draftBio : (tailor?.bio ?? DEFAULT_TAILOR.bio);
    const displayPrice = editMode ? draftPrice : (tailor?.startingPrice ?? DEFAULT_TAILOR.startingPrice);
    const displayProfilePhoto = editMode ? draftProfilePhoto : tailor?.profilePhoto;
    const reviews = tailor?.reviews || DEFAULT_TAILOR.reviews;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full" />
                    <div className="absolute top-4 right-32 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-6 left-10 w-48 h-48 bg-white/5 rounded-full" />
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
                                <img src={displayProfilePhoto} alt={tailor.name}
                                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl" />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl border-4 border-white/30 shadow-xl bg-white/20 flex items-center justify-center text-4xl font-extrabold text-white backdrop-blur-sm">
                                    {tailor.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {/* Verified badge */}
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

                        {/* Name, role, rating */}
                        <div className="flex-1 min-w-0 text-white">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={draftName}
                                        onChange={(e) => setDraftName(e.target.value)}
                                        className="text-2xl font-extrabold leading-tight bg-white/10 border border-white/20 rounded-xl px-3 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400 w-full max-w-sm"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <h1 className="text-3xl font-extrabold leading-tight">{tailor.name}</h1>
                                )}
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20 backdrop-blur-sm">
                                    ✦ Master Tailor
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
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${(tailor.availability !== false)
                                        ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                                        : 'bg-red-500/20 border-red-400/30 text-red-300'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${(tailor.availability !== false) ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        {(tailor.availability !== false) ? 'Available' : 'Unavailable'}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 border border-white/20">
                                    <StarIcon size={14} filled />
                                    {editMode ? (
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            value={draftRating}
                                            onChange={(e) => setDraftRating(e.target.value)}
                                            className="text-yellow-300 font-bold text-sm bg-transparent border-none w-10 focus:outline-none"
                                        />
                                    ) : (
                                        <span className="text-yellow-300 font-bold text-sm">{tailor.rating?.toFixed(1)}</span>
                                    )}
                                    <span className="text-white/70 text-xs">/ 5.0</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-white/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {editMode ? (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                value={draftExperience}
                                                onChange={(e) => setDraftExperience(e.target.value)}
                                                className="text-sm bg-white/10 border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400 w-16"
                                            />
                                            <span>yrs exp</span>
                                        </div>
                                    ) : (
                                        <span>{tailor.experience || 0} years exp.</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-white/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <span>{reviews.length} reviews</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-white/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={draftLocation}
                                            onChange={(e) => setDraftLocation(e.target.value)}
                                            className="text-sm bg-white/10 border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400 w-48"
                                            placeholder="City, Sri Lanka"
                                        />
                                    ) : (
                                        <span>{tailor.location || "Sri Lanka"}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-white/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={draftPhoneNumber}
                                            onChange={(e) => setDraftPhoneNumber(e.target.value)}
                                            className="text-sm bg-white/10 border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-violet-400 w-36"
                                            placeholder="Contact Phone"
                                        />
                                    ) : (
                                        <span>{tailor.phoneNumber || "Not provided"}</span>
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
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm mb-6 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back
                </button>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ══ LEFT COLUMN ══ */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">

                        {/* Bio card */}
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
                                    value={draftBio}
                                    onChange={(e) => setDraftBio(e.target.value)}
                                    placeholder="Write your bio or tagline…"
                                />
                            ) : (
                                <p className="text-base leading-relaxed text-slate-600">
                                    {displayBio || "No bio added yet."}
                                </p>
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
                            <ReviewSection targetType="tailor" targetId={resolvedTailorId} ownerId={resolvedTailorId} />
                        </div>
                    </div>

                    {/* ══ RIGHT COLUMN ══ */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="rounded-2xl border shadow-sm overflow-hidden sticky top-24">

                            {/* Top accent band */}
                            <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

                            <div className="p-6 flex flex-col gap-5">

                                {/* Starting price */}
                                <div className="pb-4 border-b">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Starting Price</p>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            value={draftPrice}
                                            onChange={(e) => setDraftPrice(e.target.value)}
                                            className="border rounded-xl px-3 py-2 font-extrabold text-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
                                        />
                                    ) : (
                                        <p className="font-extrabold text-2xl text-slate-900">
                                            LKR {Number(displayPrice).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Services */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 rounded-md bg-purple-50 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                                                fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <p className="font-bold text-sm">Services</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {displayServices.length === 0 && !editMode && (
                                            <p className="text-xs text-slate-400">No services added yet</p>
                                        )}
                                        {displayServices.map((s, i) => (
                                            <Tag key={i} label={s} editMode={editMode}
                                                onRemove={() => setDraftServices((prev) => prev.filter((_, idx) => idx !== i))} />
                                        ))}
                                    </div>
                                    {editMode && (
                                        <div className="flex gap-2 mt-2">
                                            <input type="text" value={newServiceInput}
                                                onChange={(e) => setNewServiceInput(e.target.value)}
                                                placeholder="Add service…"
                                                className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
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
                                                className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-bold transition-colors">
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Customization Types */}
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
                                        <p className="font-bold text-sm">Customization Types</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {displayCustomTypes.length === 0 && !editMode && (
                                            <p className="text-xs text-slate-400">No types added yet</p>
                                        )}
                                        {displayCustomTypes.map((c, i) => (
                                            <Tag key={i} label={c} editMode={editMode}
                                                onRemove={() => setDraftCustomTypes((prev) => prev.filter((_, idx) => idx !== i))} />
                                        ))}
                                    </div>
                                    {editMode && (
                                        <div className="flex gap-2 mt-2">
                                            <input type="text" value={newCustomTypeInput}
                                                onChange={(e) => setNewCustomTypeInput(e.target.value)}
                                                placeholder="Add type…"
                                                className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && newCustomTypeInput.trim()) {
                                                        setDraftCustomTypes((prev) => [...prev, newCustomTypeInput.trim()]);
                                                        setNewCustomTypeInput("");
                                                    }
                                                }} />
                                            <button onClick={() => {
                                                if (newCustomTypeInput.trim()) {
                                                    setDraftCustomTypes((prev) => [...prev, newCustomTypeInput.trim()]);
                                                    setNewCustomTypeInput("");
                                                }
                                            }}
                                                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold transition-colors">
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <hr className="border-slate-100" />

                                {/* CTA Buttons */}
                                <div className="flex flex-col gap-2.5">
                                    {/* Contact Me */}
                                    <button 
                                        onClick={handleContactMe}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Contact Me
                                    </button>

                                    {/* Request Quotation + Save */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(isOwner ? "/quotation-inbox" : `/request-quote?tailorId=${resolvedTailorId}`, { state: { provider: tailor } })}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                            {isOwner ? "My Quotations" : "Quotation"}
                                        </button>
                                        <button
                                            onClick={handleToggleSave}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-red-100 text-xs font-semibold hover:bg-red-50 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                                fill={isSaved ? "#ef4444" : "none"} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                            </svg>
                                            {isSaved ? "Saved" : "Save"}
                                        </button>
                                    </div>

                                    {/* Share Profile */}
                                    <button onClick={handleShare}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium hover:bg-slate-50 transition-colors text-slate-600">
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
                                    <p className="text-emerald-700 text-xs font-medium">Verified ClothStreet Tailor</p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Owner Profile Settings ── */}
            {isOwner && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="border-t border-slate-200 pt-8 mt-4">
                        <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            Profile Settings
                        </h2>

                        <div className="flex flex-col gap-5">
                            {/* ── Personal Info ── */}
                            <div className="rounded-2xl border shadow-sm p-6 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </div>
                                        <h3 className="font-bold text-sm">Personal Info</h3>
                                    </div>
                                    <button onClick={() => setEditingPersonal(!editingPersonal)} className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                                        {editingPersonal ? "Cancel" : "Edit"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {editingPersonal ? (
                                        <>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                                                <input type="text" name="name" value={profileData.name} onChange={handleProfileInputChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                                                <input type="email" value={profileData.email} disabled className="w-full border rounded-xl px-3 py-2 text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
                                                <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileInputChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="0771234567" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Full Name</span><span className="text-sm font-semibold text-slate-800">{profileData.name || "—"}</span></div>
                                            <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Email</span><span className="text-sm font-semibold text-slate-800">{profileData.email || "—"}</span></div>
                                            <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Phone</span><span className="text-sm font-semibold text-slate-800">{profileData.phone || "—"}</span></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* ── Address Details ── */}
                            <div className="rounded-2xl border shadow-sm p-6 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                        </div>
                                        <h3 className="font-bold text-sm">Address Details</h3>
                                    </div>
                                    <button onClick={() => setEditingAddress(!editingAddress)} className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                                        {editingAddress ? "Cancel" : "Edit"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {editingAddress ? (
                                        <>
                                            <div className="sm:col-span-2"><label className="block text-xs font-medium text-slate-400 mb-1">Street Address</label><input type="text" name="street" value={profileData.address.street} onChange={handleAddressChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" /></div>
                                            <div><label className="block text-xs font-medium text-slate-400 mb-1">City</label><input type="text" name="city" value={profileData.address.city} onChange={handleAddressChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" /></div>
                                            <div><label className="block text-xs font-medium text-slate-400 mb-1">Province</label><input type="text" name="province" value={profileData.address.province} onChange={handleAddressChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" /></div>
                                            <div><label className="block text-xs font-medium text-slate-400 mb-1">Postal / Zip</label><input type="text" name="zip" value={profileData.address.zip} onChange={handleAddressChange} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" /></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="sm:col-span-2"><span className="block text-xs font-medium text-slate-400 mb-0.5">Street Address</span><span className="text-sm font-semibold text-slate-800">{profileData.address.street || "—"}</span></div>
                                            <div><span className="block text-xs font-medium text-slate-400 mb-0.5">City</span><span className="text-sm font-semibold text-slate-800">{profileData.address.city || "—"}</span></div>
                                            <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Province</span><span className="text-sm font-semibold text-slate-800">{profileData.address.province || "—"}</span></div>
                                            <div><span className="block text-xs font-medium text-slate-400 mb-0.5">Postal / Zip</span><span className="text-sm font-semibold text-slate-800">{profileData.address.zip || "—"}</span></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* ── Preferences ── */}
                            <div className="rounded-2xl border shadow-sm p-6 bg-white">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/></svg>
                                    </div>
                                    <h3 className="font-bold text-sm">Preferences</h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-sm font-semibold text-slate-800">Email Notifications</p><p className="text-xs text-slate-500">Receive order updates and promotions via email.</p></div>
                                        <button onClick={() => handlePreferenceToggle("emailAlerts")} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: profileData.preferences.emailAlerts ? "#7c3aed" : "#d1d5db" }}>
                                            <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: profileData.preferences.emailAlerts ? "22px" : "2px" }} />
                                        </button>
                                    </div>
                                    <div className="h-px bg-slate-100" />
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-sm font-semibold text-slate-800">SMS Alerts</p><p className="text-xs text-slate-500">Get real-time text messages when orders are out for delivery.</p></div>
                                        <button onClick={() => handlePreferenceToggle("smsAlerts")} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: profileData.preferences.smsAlerts ? "#7c3aed" : "#d1d5db" }}>
                                            <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: profileData.preferences.smsAlerts ? "22px" : "2px" }} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ── Account Security ── */}
                            <div className="rounded-2xl border shadow-sm p-6 bg-white">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    </div>
                                    <h3 className="font-bold text-sm">Account Security</h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-sm font-semibold text-slate-800">Password</p><p className="text-xs text-slate-500">Send a secure reset link to your email ({profileData.email}).</p></div>
                                        <button onClick={handlePasswordReset} className="px-4 py-2 rounded-xl border text-xs font-semibold text-purple-600 hover:bg-purple-50 transition-colors">Change Password</button>
                                    </div>
                                    <div className="h-px bg-slate-100" />
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-sm font-semibold text-red-600">Delete Account</p><p className="text-xs text-slate-500">Permanently remove your account and data.</p></div>
                                        <button onClick={openDeleteModal} className="px-4 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">Delete Account</button>
                                    </div>
                                </div>
                            </div>

                            {/* Save button */}
                            {(editingPersonal || editingAddress) && (
                                <div className="flex justify-end">
                                    <button onClick={handleSaveProfile} disabled={savingProfile} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold text-sm disabled:opacity-50 transition-colors shadow-md">
                                        {savingProfile ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Account Modal ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeDeleteModal}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg" onClick={closeDeleteModal}>✕</button>
                        {/* Step dots */}
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3].map((s) => (<div key={s} className={`w-2.5 h-2.5 rounded-full transition-colors ${s === deleteStep ? "bg-purple-600" : s < deleteStep ? "bg-purple-300" : "bg-slate-200"}`} />))}
                        </div>
                        {deleteStep === 1 && (<>
                            <div className="text-center mb-4"><span className="text-3xl">🔒</span></div>
                            <h3 className="text-lg font-bold text-center mb-1">Verify Your Identity</h3>
                            <p className="text-sm text-slate-500 text-center mb-4">Enter your password to continue with account deletion.</p>
                            <input type="password" placeholder="Enter your password" value={deletePassword} onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(""); }} onKeyDown={(e) => e.key === "Enter" && handleDeleteStep1()} autoFocus className="w-full border rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                            {deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}
                            <div className="flex gap-3"><button onClick={closeDeleteModal} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Cancel</button><button onClick={handleDeleteStep1} disabled={!deletePassword.trim()} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold disabled:opacity-50">Continue</button></div>
                        </>)}
                        {deleteStep === 2 && (<>
                            <div className="text-center mb-4"><span className="text-3xl">😔</span></div>
                            <h3 className="text-lg font-bold text-center mb-1">Sorry to See You Go</h3>
                            <p className="text-sm text-slate-500 text-center mb-4">Could you tell us why you{"'"}re leaving?</p>
                            <div className="flex flex-col gap-2 mb-4">
                                {DELETE_REASONS.map((reason) => (<label key={reason} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${deleteReason === reason ? "border-purple-400 bg-purple-50" : "hover:bg-slate-50"}`}><input type="radio" name="deleteReason" checked={deleteReason === reason} onChange={() => { setDeleteReason(reason); setDeleteError(""); }} className="accent-purple-600" />{reason}</label>))}
                            </div>
                            {deleteReason === "Other" && <textarea placeholder="Your feedback helps us improve..." value={deleteFeedback} onChange={(e) => setDeleteFeedback(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" rows={3} />}
                            {deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}
                            <div className="flex gap-3"><button onClick={() => setDeleteStep(1)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Back</button><button onClick={handleDeleteStep2} disabled={!deleteReason} className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold disabled:opacity-50">Continue</button></div>
                        </>)}
                        {deleteStep === 3 && (<>
                            <div className="text-center mb-4"><span className="text-3xl">⚠️</span></div>
                            <h3 className="text-lg font-bold text-center mb-1">Are You Absolutely Sure?</h3>
                            <p className="text-sm text-slate-500 text-center mb-4">This action is <strong>permanent</strong> and cannot be undone.</p>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 text-sm text-red-700">
                                <p className="font-semibold mb-2">Deleting your account will:</p>
                                <ul className="list-disc pl-4 space-y-1"><li>Remove your profile and personal data</li><li>Delete your tailor profile and portfolio</li><li>Remove all saved items</li><li>Archive your order history</li></ul>
                            </div>
                            {deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}
                            <div className="flex gap-3"><button onClick={() => setDeleteStep(2)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Go Back</button><button onClick={handleDeleteConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete My Account"}</button></div>
                        </>)}
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
                                <p className="text-lg font-bold text-slate-900">{tailor?.phoneNumber || "Not provided"}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                                <p className="text-lg font-bold text-slate-900">{tailor?.email || providerEmail || "Not provided"}</p>
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
