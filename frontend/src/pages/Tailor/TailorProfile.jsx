import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

// ─── Default / placeholder tailor data ───────────────────────────────────────
const DEFAULT_TAILOR = {
  uid: "",
  name: "Nimal Perera",
  bio: "I deliver professional tailoring services with attention to detail, quality fabrics, and flawless stitching.",
  profilePhoto: "",
  startingPrice: 2000,
  rating: 4.7,
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
  return <div className={`bg-purple-100 animate-pulse rounded-xl ${className}`} />;
}

// ─── Portfolio Gallery ────────────────────────────────────────────────────────
function PortfolioGallery({ images, editMode, onAddImages, onDeleteImage }) {
  const fileRef = useRef();

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <span className="font-bold text-gray-800 text-sm">Portfolio Gallery</span>
          {images.length > 0 && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-medium">
              {images.length} photos
            </span>
          )}
        </div>
        {editMode && (
          <>
            <button
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-1.5 text-xs text-purple-600 border border-purple-200 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Photos
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => onAddImages(Array.from(e.target.files))} />
          </>
        )}
      </div>

      {/* Scrollable row */}
      <div className="flex gap-3 overflow-x-auto px-5 pb-5 pt-1"
        style={{ scrollbarWidth: "none" }}>
        {images.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="#d8b4fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p className="text-sm">No portfolio photos yet</p>
          </div>
        ) : (
          images.map((img, idx) => (
            <div key={idx} className="relative flex-shrink-0 group">
              <img src={img} alt={`Portfolio ${idx + 1}`}
                className="w-40 h-40 object-cover rounded-xl shadow-sm border border-purple-50 group-hover:shadow-md transition-shadow duration-200" />
              {editMode && (
                <button onClick={() => onDeleteImage(idx, img)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-purple-200 transition-all duration-200">
      <StarRow count={review.rating} size={14} />
      <p className="text-gray-700 text-sm leading-relaxed font-medium flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-2.5 pt-1 border-t border-gray-50">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {review.reviewer?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-gray-800 font-semibold text-sm">{review.reviewer}</p>
          <div className="flex items-center gap-1">
            <StarIcon size={10} filled />
            <span className="text-yellow-500 text-xs font-bold">{review.rating}.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────
function Tag({ label, onRemove, editMode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
      {label}
      {editMode && onRemove && (
        <button onClick={onRemove}
          className="w-3.5 h-3.5 rounded-full bg-purple-200 hover:bg-red-200 hover:text-red-600 text-purple-600 flex items-center justify-center transition-colors text-[9px] font-bold">
          ✕
        </button>
      )}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TailorProfile() {
  const { tailorId } = useParams();
  const { user: authUser } = useAuth();

  // ── State ──
  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Draft state
  const [draftBio, setDraftBio] = useState("");
  const [draftPrice, setDraftPrice] = useState(0);
  const [draftServices, setDraftServices] = useState([]);
  const [draftCustomTypes, setDraftCustomTypes] = useState([]);
  const [draftPortfolioImages, setDraftPortfolioImages] = useState([]);
  const [draftProfilePhoto, setDraftProfilePhoto] = useState("");
  const [newServiceInput, setNewServiceInput] = useState("");
  const [newCustomTypeInput, setNewCustomTypeInput] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const profilePhotoRef = useRef();

  const resolvedTailorId = tailorId || authUser?.uid;
  const isOwner = authUser?.uid && authUser.uid === resolvedTailorId;

  // ── Load tailor data ──
  useEffect(() => {
    if (!resolvedTailorId) {
      setTailor(DEFAULT_TAILOR);
      setLoading(false);
      return;
    }
    const fetchTailor = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "tailors", resolvedTailorId));
        if (snap.exists()) {
          setTailor({ uid: resolvedTailorId, ...snap.data() });
        } else {
          setTailor({ ...DEFAULT_TAILOR, uid: resolvedTailorId });
        }
      } catch {
        setTailor({ ...DEFAULT_TAILOR, uid: resolvedTailorId });
      } finally {
        setLoading(false);
      }
    };
    fetchTailor();
  }, [resolvedTailorId]);

  const enterEditMode = () => {
    setDraftBio(tailor.bio || "");
    setDraftPrice(tailor.startingPrice || 0);
    setDraftServices([...(tailor.services || [])]);
    setDraftCustomTypes([...(tailor.customizationTypes || [])]);
    setDraftPortfolioImages([...(tailor.portfolioImages || [])]);
    setDraftProfilePhoto(tailor.profilePhoto || "");
    setEditMode(true);
  };

  const cancelEdit = () => setEditMode(false);

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const storageRef = ref(storage, `tailors/${resolvedTailorId}/profilePhoto`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setDraftProfilePhoto(url);
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddPortfolioImages = async (files) => {
    for (const file of files) {
      try {
        const storageRef = ref(storage, `tailors/${resolvedTailorId}/portfolio/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setDraftPortfolioImages((prev) => [...prev, url]);
      } catch (err) {
        console.error("Portfolio upload failed:", err);
      }
    }
  };

  const handleDeletePortfolioImage = async (idx, url) => {
    try { await deleteObject(ref(storage, url)); } catch { /* ignore if already deleted */ }
    setDraftPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        uid: resolvedTailorId,
        name: tailor.name,
        bio: draftBio,
        profilePhoto: draftProfilePhoto,
        startingPrice: Number(draftPrice),
        services: draftServices,
        customizationTypes: draftCustomTypes,
        portfolioImages: draftPortfolioImages,
        rating: tailor.rating,
        reviews: tailor.reviews || [],
      };
      await setDoc(doc(db, "tailors", resolvedTailorId), updatedData, { merge: true });
      setTailor((prev) => ({ ...prev, ...updatedData }));
      setEditMode(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${tailor?.name} – Tailor Profile`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Profile link copied to clipboard!");
    }
  };

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-52 w-full" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-52 w-full" />
            </div>
            <div className="w-full lg:w-72 flex-shrink-0">
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayPortfolioImages = editMode ? draftPortfolioImages : tailor.portfolioImages || [];
  const displayServices = editMode ? draftServices : tailor.services || [];
  const displayCustomTypes = editMode ? draftCustomTypes : tailor.customizationTypes || [];
  const displayBio = editMode ? draftBio : tailor.bio;
  const displayPrice = editMode ? draftPrice : tailor.startingPrice;
  const displayProfilePhoto = editMode ? draftProfilePhoto : tailor.profilePhoto;
  const reviews = tailor.reviews || DEFAULT_TAILOR.reviews;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-4 right-32 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 left-10 w-48 h-48 rounded-full bg-indigo-800/30" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* Edit / Save / Cancel buttons */}
          <div className="flex justify-end mb-6 gap-2">
            {isOwner && !editMode && (
              <button onClick={enterEditMode}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-semibold transition-all duration-200 backdrop-blur-sm">
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
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium transition-all duration-200">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-lg">
                  {saving ? (
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
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
                <div className="w-24 h-24 rounded-2xl bg-white/20 border-4 border-white/30 shadow-xl flex items-center justify-center text-white text-4xl font-extrabold backdrop-blur-sm">
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
                    className="absolute inset-0 w-24 h-24 rounded-2xl bg-black/50 flex items-center justify-center text-white text-xs font-semibold hover:bg-black/70 transition-colors">
                    {uploadingPhoto ? "Uploading…" : "Change"}
                  </button>
                  <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden"
                    onChange={handleProfilePhotoChange} />
                </>
              )}
            </div>

            {/* Name, role, rating */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-white text-3xl font-extrabold leading-tight">
                  {tailor.name}
                </h1>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/25 backdrop-blur-sm">
                  ✦ Master Tailor
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 border border-white/20">
                  <StarIcon size={14} filled />
                  <span className="text-yellow-300 font-bold text-sm">{tailor.rating?.toFixed(1)}</span>
                  <span className="text-purple-200 text-xs">/ 5.0</span>
                </div>
                {/* Reviews count */}
                <div className="flex items-center gap-1.5 text-purple-200 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{reviews.length} reviews</span>
                </div>
                {/* Location placeholder */}
                <div className="flex items-center gap-1.5 text-purple-200 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══════════════════════════════════════════════════════════
              LEFT COLUMN
          ══════════════════════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">

            {/* ── Bio card ── */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
                    fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2 className="text-gray-800 font-bold text-sm">About Me</h2>
              </div>
              {editMode ? (
                <textarea
                  className="w-full text-gray-700 text-base leading-relaxed resize-none border border-purple-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/40"
                  rows={4}
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  placeholder="Write your bio or tagline…"
                />
              ) : (
                <p className="text-gray-700 text-base leading-relaxed">{displayBio}</p>
              )}
            </div>

            {/* ── Portfolio gallery ── */}
            <PortfolioGallery
              images={displayPortfolioImages}
              editMode={editMode}
              onAddImages={handleAddPortfolioImages}
              onDeleteImage={handleDeletePortfolioImage}
            />

            {/* ── Reviews section ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                    fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h2 className="text-gray-800 font-bold text-sm">Customer Reviews</h2>
                <div className="flex items-center gap-1.5 ml-1 px-2.5 py-0.5 rounded-full bg-yellow-50 border border-yellow-100">
                  <StarIcon size={10} filled />
                  <span className="text-yellow-600 font-bold text-xs">{tailor.rating?.toFixed(1)}</span>
                  <span className="text-yellow-500 text-xs">· {reviews.length} reviews</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((review, idx) => (
                  <ReviewCard key={review.id ?? idx} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN — Pricing card
          ══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden sticky top-24">

              {/* Top purple accent band */}
              <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              <div className="p-6 flex flex-col gap-5">
                {/* Starting price */}
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Starting Price</p>
                  {editMode ? (
                    <input
                      type="number"
                      value={draftPrice}
                      onChange={(e) => setDraftPrice(e.target.value)}
                      className="border border-purple-200 rounded-xl px-3 py-2 text-purple-700 font-extrabold text-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-full bg-purple-50/40"
                    />
                  ) : (
                    <p className="text-purple-700 font-extrabold text-2xl">
                      LKR {Number(displayPrice).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Services */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                        fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-bold text-sm">Services</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                        className="flex-1 border border-purple-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 bg-purple-50/40"
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
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-colors">
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Customization Types */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                        fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                        <line x1="20" x2="8.12" y1="4" y2="15.88" />
                        <line x1="14.47" x2="20" y1="14.48" y2="20" />
                        <line x1="8.12" x2="12" y1="8.12" y2="12" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-bold text-sm">Customization Types</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displayCustomTypes.map((c, i) => (
                      <span key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {c}
                        {editMode && (
                          <button onClick={() => setDraftCustomTypes((prev) => prev.filter((_, idx) => idx !== i))}
                            className="w-3.5 h-3.5 rounded-full bg-indigo-200 hover:bg-red-200 hover:text-red-600 text-indigo-600 flex items-center justify-center transition-colors text-[9px] font-bold">
                            ✕
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {editMode && (
                    <div className="flex gap-2 mt-2">
                      <input type="text" value={newCustomTypeInput}
                        onChange={(e) => setNewCustomTypeInput(e.target.value)}
                        placeholder="Add type…"
                        className="flex-1 border border-indigo-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-indigo-50/40"
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
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors">
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <hr className="border-gray-100" />

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2.5">
                  {/* Contact Me — primary */}
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200">
                    Contact Me
                  </button>

                  {/* Request Quotation + Save Tailor */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      Quotation
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <span className="text-red-500 text-sm leading-none">♥</span>
                      Save
                    </button>
                  </div>

                  {/* Share Profile */}
                  <button onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors">
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
    </div>
  );
}
