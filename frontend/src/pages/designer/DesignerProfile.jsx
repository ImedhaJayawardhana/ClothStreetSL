import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../../firebase/firebase";
import { useAuth } from "../../../context/AuthContext";

// ─── Default / placeholder designer data ───────────────────────────────────────
const DEFAULT_DESIGNER = {
  uid: "",
  name: "New Designer",
  bio: "I create stunning, bespoke fashion pieces that reflect unique aesthetic visions.",
  profilePhoto: "",
  hourlyRate: 5000,
  rating: 5.0,
  services: ["Fashion Illustration", "Bespoke Design", "Consultation"],
  aesthetics: ["Minimalist", "Avant-garde", "Streetwear"],
  portfolioImages: [],
  reviews: [],
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
  const baseColors = {
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };
  const btnColors = {
    purple: "bg-purple-200 hover:bg-red-200 hover:text-red-600 text-purple-600",
    indigo: "bg-indigo-200 hover:bg-red-200 hover:text-red-600 text-indigo-600",
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${baseColors[colorScheme]}`}>
      {label}
      {editMode && onRemove && (
        <button onClick={onRemove}
          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors text-[9px] font-bold ${btnColors[colorScheme]}`}>
          ✕
        </button>
      )}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`bg-purple-100 animate-pulse rounded-xl ${className}`} />;
}

export default function DesignerProfile() {
  const { designerId } = useParams();
  const { user: authUser } = useAuth();

  // ── State ──
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Draft state
  const [draftBio, setDraftBio] = useState("");
  const [draftRate, setDraftRate] = useState(0);
  const [draftServices, setDraftServices] = useState([]);
  const [draftAesthetics, setDraftAesthetics] = useState([]);
  const [draftPortfolioImages, setDraftPortfolioImages] = useState([]);
  const [draftProfilePhoto, setDraftProfilePhoto] = useState("");
  const [newServiceInput, setNewServiceInput] = useState("");
  const [newAestheticInput, setNewAestheticInput] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const profilePhotoRef = useRef();

  const resolvedDesignerId = designerId || authUser?.uid;
  const isOwner = authUser?.uid && authUser.uid === resolvedDesignerId;

  // ── Load designer data ──
  useEffect(() => {
    if (!resolvedDesignerId) {
      setDesigner(DEFAULT_DESIGNER);
      setLoading(false);
      return;
    }
    const fetchDesigner = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "designers", resolvedDesignerId));
        if (snap.exists()) {
          setDesigner({ uid: resolvedDesignerId, ...snap.data() });
        } else {
          setDesigner({ ...DEFAULT_DESIGNER, uid: resolvedDesignerId });
        }
      } catch (error) {
        console.error("Failed to fetch designer profile", error);
        setDesigner({ ...DEFAULT_DESIGNER, uid: resolvedDesignerId });
      } finally {
        setLoading(false);
      }
    };
    fetchDesigner();
  }, [resolvedDesignerId]);

  const enterEditMode = () => {
    setDraftBio(designer.bio || "");
    setDraftRate(designer.hourlyRate || 0);
    setDraftServices([...(designer.services || [])]);
    setDraftAesthetics([...(designer.aesthetics || [])]);
    setDraftPortfolioImages([...(designer.portfolioImages || [])]);
    setDraftProfilePhoto(designer.profilePhoto || "");
    setEditMode(true);
  };

  const cancelEdit = () => setEditMode(false);

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const storageRef = ref(storage, `designers/${resolvedDesignerId}/profilePhoto`);
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
        const storageRef = ref(storage, `designers/${resolvedDesignerId}/portfolio/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setDraftPortfolioImages((prev) => [...prev, url]);
      } catch (err) {
        console.error("Portfolio upload failed:", err);
      }
    }
  };

  const handleDeletePortfolioImage = async (idx, url) => {
    try { 
      await deleteObject(ref(storage, url)); 
    } catch { 
      /* ignore if already deleted */ 
    }
    setDraftPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        uid: resolvedDesignerId,
        name: designer.name || authUser?.displayName || "Designer",
        bio: draftBio,
        profilePhoto: draftProfilePhoto,
        hourlyRate: Number(draftRate),
        services: draftServices,
        aesthetics: draftAesthetics,
        portfolioImages: draftPortfolioImages,
        rating: designer.rating || 5.0,
        reviews: designer.reviews || [],
      };
      await setDoc(doc(db, "designers", resolvedDesignerId), updatedData, { merge: true });
      setDesigner((prev) => ({ ...prev, ...updatedData }));
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
      navigator.share({ title: `${designer?.name} – Designer Profile`, url });
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

  const displayServices = editMode ? draftServices : designer.services || [];
  const displayAesthetics = editMode ? draftAesthetics : designer.aesthetics || [];
  const displayRate = editMode ? draftRate : designer.hourlyRate;
  const displayProfilePhoto = editMode ? draftProfilePhoto : designer.profilePhoto;
  const reviews = designer.reviews || DEFAULT_DESIGNER.reviews;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-fuchsia-800 via-purple-700 to-violet-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-4 right-32 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 left-10 w-48 h-48 rounded-full bg-fuchsia-900/30" />
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
                <img src={displayProfilePhoto} alt={designer.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 border-4 border-white/30 shadow-xl flex items-center justify-center text-white text-4xl font-extrabold backdrop-blur-sm">
                  {designer.name?.charAt(0).toUpperCase()}
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
                  {designer.name}
                </h1>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/25 backdrop-blur-sm">
                  ✦ Master Designer
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 border border-white/20">
                  <StarIcon size={14} filled />
                  <span className="text-yellow-300 font-bold text-sm">{designer.rating?.toFixed(1)}</span>
                  <span className="text-fuchsia-200 text-xs">/ 5.0</span>
                </div>
                {/* Reviews count */}
                <div className="flex items-center gap-1.5 text-fuchsia-200 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{reviews.length} reviews</span>
                </div>
                {/* Location placeholder */}
                <div className="flex items-center gap-1.5 text-fuchsia-200 text-sm">
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
             <div className="bg-white rounded-2xl border border-fuchsia-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-fuchsia-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-gray-800 font-bold text-lg mb-2">Main Content Pending</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  The Bio, Awards, and Enhanced Portfolio modules will be implemented in Step 4. Reviews will be implemented in Step 5.
                </p>
             </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN — Quick Info Sidebar
          ══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-fuchsia-100 shadow-sm overflow-hidden sticky top-24">

              {/* Top accent band */}
              <div className="h-2 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500" />

              <div className="p-6 flex flex-col gap-5">
                {/* Hourly Rate */}
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Hourly Rate</p>
                  {editMode ? (
                    <input
                      type="number"
                      value={draftRate}
                      onChange={(e) => setDraftRate(e.target.value)}
                      className="border border-fuchsia-200 rounded-xl px-3 py-2 text-fuchsia-700 font-extrabold text-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 w-full bg-fuchsia-50/40"
                    />
                  ) : (
                    <p className="text-fuchsia-700 font-extrabold text-2xl">
                      LKR {Number(displayRate).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Design Services */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md bg-fuchsia-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                        fill="none" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 16 4-4-4-4" />
                        <path d="m6 8-4 4 4 4" />
                        <path d="m14.5 4-5 16" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-bold text-sm">Design Services</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                        className="flex-1 border border-fuchsia-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-fuchsia-400 bg-fuchsia-50/40"
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
                        className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-bold transition-colors">
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Aesthetics / Style Traits */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
                        fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="6"/>
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                    </div>
                    <p className="text-gray-700 font-bold text-sm">Aesthetics</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                        className="flex-1 border border-indigo-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-indigo-50/40"
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
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200">
                    Consultation Request
                  </button>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-fuchsia-200 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      Hire Now
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-fuchsia-200 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors">
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
