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

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-10 px-4 flex items-center justify-center">
        <Skeleton className="h-64 w-full max-w-4xl" />
      </div>
    );
  }

  // Temporary UI to verify State & Firebase structure
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100 text-center max-w-xl w-full">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Designer Profile State</h1>
        
        <p className="text-gray-500 mb-2">Designer ID: {resolvedDesignerId}</p>
        <p className="text-gray-500 mb-6">Is Owner: {isOwner ? 'Yes' : 'No'}</p>

        <div className="text-left bg-gray-50 p-4 rounded-xl mb-6 text-sm overflow-auto format-pre">
          <pre>{JSON.stringify(designer, null, 2)}</pre>
        </div>
        
        {isOwner && (
          <div className="flex gap-2 justify-center mb-6">
             {!editMode ? (
                <button onClick={enterEditMode} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition">
                  Enter Edit Mode
                </button>
             ) : (
                <>
                  <button onClick={cancelEdit} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition disabled:opacity-50">
                    {saving ? "Saving..." : "Save Mock Update"}
                  </button>
                </>
             )}
          </div>
        )}

        {editMode && (
          <div className="bg-purple-50 p-4 rounded-xl text-sm mb-4">
             Edit mode active. Change Bio:
             <textarea 
               value={draftBio} 
               onChange={(e) => setDraftBio(e.target.value)}
               className="mt-2 w-full p-2 border border-purple-200 rounded block"
             />
          </div>
        )}

        <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-xl border border-purple-100 font-medium text-sm mt-4">
          ✅ Step 2 State & Firebase integration complete. Ready for Step 3.
        </div>
      </div>
    </div>
  );
}
