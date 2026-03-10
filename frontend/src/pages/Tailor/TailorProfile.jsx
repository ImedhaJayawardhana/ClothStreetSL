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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      text: "Absolutely stunning work! The suit fit perfectly.",
      rating: 5,
      reviewer: "Shalini Fernando",
    },
    {
      id: 2,
      text: "Professional and punctual, will recommend!",
      rating: 4,
      reviewer: "Ravi Wijesinghe",
    },
  ],
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function Skeleton({ className }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
  );
}

// ─── ShareIcon ────────────────────────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

// ─── Portfolio Gallery ─────────────────────────────────────────────────────────

function PortfolioGallery({ images, editMode, onAddImages, onDeleteImage }) {
  const fileRef = useRef();

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="font-semibold text-gray-700 text-sm">Portfolio</span>
        {editMode && (
          <>
            <button
              onClick={() => fileRef.current.click()}
              className="text-xs text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1 hover:bg-indigo-50 transition-colors font-medium"
            >
              + Add Photos
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onAddImages(Array.from(e.target.files))}
            />
          </>
        )}
      </div>

      {/* Scrollable row */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-4 pt-2 scrollbar-hide">
        {images.length === 0 && (
          <div className="w-36 h-36 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
            No photos yet
          </div>
        )}
        {images.map((img, idx) => (
          <div key={idx} className="relative flex-shrink-0">
            <img
              src={img}
              alt={`Portfolio ${idx + 1}`}
              className="w-36 h-36 object-cover rounded-xl"
            />
            {editMode && (
              <button
                onClick={() => onDeleteImage(idx, img)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────

function ReviewCard({ review }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
      <p className="text-gray-800 font-semibold text-sm leading-relaxed">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-2 mt-auto">
        <StarRow count={review.rating} size={13} />
        <span className="text-yellow-500 font-bold text-sm">{review.rating}.0</span>
      </div>
      <p className="text-gray-400 text-xs">&mdash; {review.reviewer}</p>
    </div>
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

  // Edit draft fields
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

  // Determine which tailorId to load:
  //  • If URL param present, use it (public view of a specific tailor)
  //  • Otherwise, fall back to the logged-in tailor's own profile
  const resolvedTailorId = tailorId || authUser?.uid;

  // Is the logged-in user viewing THEIR OWN profile?
  const isOwner = authUser?.uid && authUser.uid === resolvedTailorId;

  // ── Load tailor data from Firestore ──
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
          // First time: scaffold with defaults for owner, show placeholder for visitors
          setTailor({ ...DEFAULT_TAILOR, uid: resolvedTailorId });
        }
      } catch (err) {
        console.error("Failed to load tailor profile:", err);
        setTailor({ ...DEFAULT_TAILOR, uid: resolvedTailorId });
      } finally {
        setLoading(false);
      }
    };

    fetchTailor();
  }, [resolvedTailorId]);

  // ── Enter edit mode: copy tailor data into draft state ──
  const enterEditMode = () => {
    setDraftBio(tailor.bio || "");
    setDraftPrice(tailor.startingPrice || 0);
    setDraftServices([...(tailor.services || [])]);
    setDraftCustomTypes([...(tailor.customizationTypes || [])]);
    setDraftPortfolioImages([...(tailor.portfolioImages || [])]);
    setDraftProfilePhoto(tailor.profilePhoto || "");
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
  };

  // ── Profile photo upload ──
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

  // ── Portfolio images: add new files ──
  const handleAddPortfolioImages = async (files) => {
    const urls = [];
    for (const file of files) {
      try {
        const storageRef = ref(
          storage,
          `tailors/${resolvedTailorId}/portfolio/${Date.now()}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      } catch (err) {
        console.error("Portfolio upload failed:", err);
      }
    }
    setDraftPortfolioImages((prev) => [...prev, ...urls]);
  };

  // ── Portfolio images: delete ──
  const handleDeletePortfolioImage = async (idx, url) => {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (_) {
      // ok to ignore if already gone
    }
    setDraftPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Save changes to Firestore ──
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
      await setDoc(doc(db, "tailors", resolvedTailorId), updatedData, {
        merge: true,
      });
      setTailor((prev) => ({ ...prev, ...updatedData }));
      setEditMode(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Share profile ──
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
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Left skeleton */}
          <div className="flex-1 flex flex-col gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          {/* Right skeleton */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const displayPortfolioImages = editMode
    ? draftPortfolioImages
    : tailor.portfolioImages || [];
  const displayServices = editMode ? draftServices : tailor.services || [];
  const displayCustomTypes = editMode
    ? draftCustomTypes
    : tailor.customizationTypes || [];
  const displayBio = editMode ? draftBio : tailor.bio;
  const displayPrice = editMode ? draftPrice : tailor.startingPrice;
  const displayProfilePhoto = editMode
    ? draftProfilePhoto
    : tailor.profilePhoto;
  const reviews = tailor.reviews || DEFAULT_TAILOR.reviews;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ── Top bar: Edit / Save / Cancel buttons (owner only) ── */}
        <div className="flex items-center justify-end mb-4 gap-2">
          {isOwner && !editMode && (
            <button
              onClick={enterEditMode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>
          )}
          {editMode && (
            <>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </>
          )}
        </div>

        {/* ── Main layout: 2 columns on large screens ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ══════════════════════════════════════════════════════════
              LEFT COLUMN  (bio, profile, portfolio, reviews)
          ══════════════════════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* ── Bio tagline ── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              {editMode ? (
                <textarea
                  className="w-full text-gray-800 text-lg font-bold leading-relaxed resize-none border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  rows={4}
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  placeholder="Write your bio or tagline…"
                />
              ) : (
                <p className="text-gray-800 text-lg font-bold leading-relaxed">
                  {displayBio}
                </p>
              )}
            </div>

            {/* ── Profile photo + name + rating ── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
              {/* Circular profile photo */}
              <div className="relative flex-shrink-0">
                {displayProfilePhoto ? (
                  <img
                    src={displayProfilePhoto}
                    alt={tailor.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-200">
                    {tailor.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {editMode && (
                  <>
                    <button
                      onClick={() => profilePhotoRef.current.click()}
                      disabled={uploadingPhoto}
                      className="absolute inset-0 w-20 h-20 rounded-full bg-black/40 flex items-center justify-center text-white text-xs font-medium hover:bg-black/60 transition-colors"
                    >
                      {uploadingPhoto ? "…" : "Upload"}
                    </button>
                    <input
                      ref={profilePhotoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePhotoChange}
                    />
                  </>
                )}
              </div>

              {/* Name + rating */}
              <div className="flex flex-col gap-1">
                <p className="text-gray-900 font-bold text-xl">{tailor.name}</p>
                <div className="flex items-center gap-1.5">
                  <StarIcon filled size={18} />
                  <span className="text-yellow-500 font-bold text-sm">
                    {tailor.rating?.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">rating</span>
                </div>
              </div>
            </div>

            {/* ── Portfolio gallery ── */}
            <PortfolioGallery
              images={displayPortfolioImages}
              editMode={editMode}
              onAddImages={handleAddPortfolioImages}
              onDeleteImage={handleDeletePortfolioImage}
            />

            {/* ── Reviews section ── */}
            <div className="flex flex-col gap-4">
              <h2 className="text-gray-800 font-bold text-base flex items-center gap-2">
                <span className="text-yellow-400">⭐</span> Reviews
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((review, idx) => (
                  <ReviewCard key={review.id ?? idx} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT COLUMN  (pricing card)
          ══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5 sticky top-24">
              {/* Starting price */}
              <div>
                {editMode ? (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium">
                      Starting Price (LKR)
                    </label>
                    <input
                      type="number"
                      value={draftPrice}
                      onChange={(e) => setDraftPrice(e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2 text-gray-800 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-bold text-xl">
                    Starting Price{" "}
                    <span className="text-black">LKR {Number(displayPrice).toLocaleString()}</span>
                  </p>
                )}
              </div>

              {/* Services */}
              <div>
                <p className="text-gray-700 font-semibold text-sm mb-2">Services</p>
                <ul className="flex flex-col gap-1">
                  {displayServices.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      {s}
                      {editMode && (
                        <button
                          onClick={() =>
                            setDraftServices((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="ml-auto text-red-400 hover:text-red-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newServiceInput}
                      onChange={(e) => setNewServiceInput(e.target.value)}
                      placeholder="Add service…"
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newServiceInput.trim()) {
                          setDraftServices((prev) => [
                            ...prev,
                            newServiceInput.trim(),
                          ]);
                          setNewServiceInput("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newServiceInput.trim()) {
                          setDraftServices((prev) => [
                            ...prev,
                            newServiceInput.trim(),
                          ]);
                          setNewServiceInput("");
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-200"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Customization Types */}
              <div>
                <p className="text-gray-700 font-semibold text-sm mb-2">
                  Customization Types
                </p>
                <ul className="flex flex-col gap-1">
                  {displayCustomTypes.map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      {c}
                      {editMode && (
                        <button
                          onClick={() =>
                            setDraftCustomTypes((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="ml-auto text-red-400 hover:text-red-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newCustomTypeInput}
                      onChange={(e) => setNewCustomTypeInput(e.target.value)}
                      placeholder="Add type…"
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newCustomTypeInput.trim()) {
                          setDraftCustomTypes((prev) => [
                            ...prev,
                            newCustomTypeInput.trim(),
                          ]);
                          setNewCustomTypeInput("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newCustomTypeInput.trim()) {
                          setDraftCustomTypes((prev) => [
                            ...prev,
                            newCustomTypeInput.trim(),
                          ]);
                          setNewCustomTypeInput("");
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-200"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                {/* Contact Me */}
                <button className="w-full py-2.5 rounded-xl border-2 border-gray-900 text-gray-900 font-semibold text-sm hover:bg-gray-900 hover:text-white transition-colors duration-200">
                  Contact Me
                </button>

                {/* Request Quotation + Save Tailor */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    Request Quotation
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors">
                    <span className="text-red-500 text-base leading-none">♥</span>
                    Save Tailor
                  </button>
                </div>

                {/* Share Profile */}
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <ShareIcon />
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
