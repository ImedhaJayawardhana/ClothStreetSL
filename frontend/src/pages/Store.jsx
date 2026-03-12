import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
/* ─── Shared fabric data (dummy data for now) ─── */
const FABRICS = [
  { id: "fab_001", name: "Premium Cotton Twill", type: "Cotton", supplier: "Lanka Fabrics Co.", rating: 4.8, reviewCount: 142, price: 850, inStock: true, bgColor: "#d4c5a9" },
  { id: "fab_002", name: "Silk Satin Blend", type: "Silk", supplier: "Royal Fabrics Ltd.", rating: 4.9, reviewCount: 218, price: 2300, inStock: true, bgColor: "#e8d5c4" },
  { id: "fab_003", name: "Linen Canvas", type: "Linen", supplier: "Natural Fibers", rating: 4.7, reviewCount: 98, price: 1200, inStock: true, bgColor: "#c8bfa9" },
  { id: "fab_004", name: "Polyester Georgette", type: "Polyester", supplier: "Modern Textiles", rating: 4.5, reviewCount: 77, price: 650, inStock: true, bgColor: "#d5c4d9" },
  { id: "fab_005", name: "Denim Heavy Weight", type: "Denim", supplier: "Blue Star Fabrics", rating: 4.8, reviewCount: 163, price: 950, inStock: true, bgColor: "#8ba4c4" },
  { id: "fab_006", name: "Chiffon Deluxe", type: "Chiffon", supplier: "Elegant Fabrics", rating: 4.6, reviewCount: 54, price: 1800, inStock: false, bgColor: "#f0ccd4" },
  { id: "fab_007", name: "Wool Blend Suiting", type: "Wool", supplier: "Premium Cloths", rating: 4.8, reviewCount: 89, price: 1250, inStock: true, bgColor: "#b8a99a" },
  { id: "fab_008", name: "Rayon Printed", type: "Rayon", supplier: "Color Works Textiles", rating: 4.4, reviewCount: 61, price: 780, inStock: true, bgColor: "#c7b8d4" },
];
export default function Store() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Filter products by the current store (sellerId)
  // For the dummy data layout, `sellerId` matches the `supplier` string.
  const decodedSellerId = decodeURIComponent(sellerId);
  const storeProducts = FABRICS.filter((f) => f.supplier === decodedSellerId);
  useEffect(() => {
    if (!sellerId) return;
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "sellers", sellerId));
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          setProfile({
            shopName: decodedSellerId,
            location: "Sri Lanka",
            rating: 4.8,
            reviews: 142
          });
        }
      } catch (err) {
        console.error("Error fetching profile", err);
        setProfile({
          shopName: decodedSellerId,
          location: "Sri Lanka",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [sellerId]);
  const displayName = profile?.shopName || "Seller Store";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* ── Back breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm font-medium transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>
      {/* ── Header Banner ──────────────────────────────────────── */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 pt-10 pb-5 px-6 lg:px-12 overflow-hidden mt-4">
        {/* Background shapes */}
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-purple-500/20 rounded-full blur-2xl" />
        <div className="absolute bottom-[-80px] right-[-20px] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* Profile Basic Info */}
          <div className="flex items-end gap-5">
            <div className="relative shrink-0">
              {profile?.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={displayName}
                  className="w-28 h-28 object-cover rounded-2xl border-4 border-purple-600 shadow-xl bg-white"
                />
              ) : (
                <div className="w-28 h-28 bg-purple-500 rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-xl border-4 border-purple-600">
                  {avatarLetter}
                </div>
              )}
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-purple-600 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="mb-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold tracking-tight">{displayName}</h1>
                <span className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  Verified Store
                </span>
              </div>
              <div className="flex items-center gap-5 text-purple-100 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  <span className="text-white font-bold tracking-wide">{profile?.rating || "4.8"}</span> / 5.0
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {profile?.reviews || "142"} reviews
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile?.location || "Sri Lanka"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>