import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDesigner, updateDesigner, uploadImage } from "../../api";

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

function Tag({ label, onRemove, editMode, colorScheme = "purple" }) {
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

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
    return (
        <div className="border border-fuchsia-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-fuchsia-200 transition-all duration-200">
            <StarRow count={review.rating} size={14} />
            <p className="text-sm leading-relaxed font-medium flex-1">
                &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-2.5 pt-1 border-t">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {review.reviewer?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                    <p className="font-semibold text-sm">{review.reviewer}</p>
                    <div className="flex items-center gap-1">
                        <StarIcon size={10} filled />
                        <span className="text-yellow-500 text-xs font-bold">{review.rating}.0</span>
                    </div>
                </div>
            </div>
        </div>
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
        <div className="rounded-2xl border border-fuchsia-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                            fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    const { user: authUser } = useAuth();

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

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: `${designer?.name} – Designer Profile`, url });
        } else {
            navigator.clipboard.writeText(url);
            alert("Profile link copied to clipboard!");
        }
    };

    // ─── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 py-10 px-4">
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
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50">

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-r from-fuchsia-800 via-purple-700 to-violet-800 relative overflow-hidden">
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
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                                            draftAvailability
                                                ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                                                : 'bg-red-500/20 border-red-400/30 text-red-300'
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${draftAvailability ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        {draftAvailability ? 'Available' : 'Unavailable'}
                                        <span className="text-white/50 ml-0.5">▾</span>
                                    </button>
                                ) : (
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                        (designer.availability !== false)
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
                <button onClick={() => navigate("/browse-designers")}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm mb-6 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back to Designers
                </button>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ══ LEFT COLUMN ══ */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">

                        {/* Bio card */}
                        <div className="rounded-2xl border border-fuchsia-100 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                                        fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                                        fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                                <h2 className="font-bold text-sm">Customer Reviews</h2>
                                <div className="flex items-center gap-1.5 ml-1 px-2.5 py-0.5 rounded-full bg-yellow-50 border border-yellow-100">
                                    <StarIcon size={10} filled />
                                    <span className="text-yellow-600 font-bold text-xs">{designer?.rating?.toFixed(1) || "5.0"}</span>
                                    <span className="text-yellow-500 text-xs">· {reviews.length} reviews</span>
                                </div>
                            </div>
                            {reviews.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">No reviews yet</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {reviews.map((review, idx) => (
                                        <ReviewCard key={review.id ?? idx} review={review} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══ RIGHT COLUMN ══ */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="rounded-2xl border border-fuchsia-100 shadow-sm overflow-hidden sticky top-24">

                            <div className="h-2 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500" />

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
                                                fill="none" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                                        <div className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center">
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
                                                className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
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
                                                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold transition-colors">
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <hr className="border-slate-100" />

                                {/* CTA Buttons */}
                                <div className="flex flex-col gap-2.5">
                                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200">
                                        Consultation Request
                                    </button>
                                    <div className="flex gap-2">
                                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-fuchsia-200 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                            Hire Now
                                        </button>
                                        <button onClick={() => setIsSaved(!isSaved)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-fuchsia-200 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors">
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
        </div>
    );
}
