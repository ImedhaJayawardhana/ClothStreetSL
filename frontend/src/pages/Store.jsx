import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { listFabrics } from "../api";
export default function Store() {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [storeProducts, setStoreProducts] = useState([]);
    const [_fabricsLoading, setFabricsLoading] = useState(true);
    const decodedSellerId = decodeURIComponent(sellerId);
    useEffect(() => {
        if (!sellerId) return;
        const fetchProfile = async () => {
            try {
                const sellerSnap = await getDoc(doc(db, "sellers", sellerId));
                let sellerData = sellerSnap.exists() ? sellerSnap.data() : null;

                const userSnap = await getDoc(doc(db, "users", sellerId));
                let userData = userSnap.exists() ? userSnap.data() : null;

                if (sellerData || userData) {
                    setProfile({
                        ...userData,
                        ...sellerData,
                        shopName: sellerData?.shopName || sellerData?.storeName || decodedSellerId,
                        rating: sellerData?.rating || 4.8,
                        reviews: sellerData?.reviews || 142
                    });
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
    }, [sellerId, decodedSellerId]);
    useEffect(() => {
        const fetchFabrics = async () => {
            try {
                const res = await listFabrics();
                const filtered = res.data.filter((f) => f.supplier_id === sellerId && !f.hidden);
                setStoreProducts(filtered);
            } catch (err) {
                console.error("Error fetching fabrics", err);
            } finally {
                setFabricsLoading(false);
            }
        };
        fetchFabrics();
    }, [sellerId, setFabricsLoading]);
    const displayName = profile?.shopName || "Seller Store";
    const avatarLetter = displayName.charAt(0).toUpperCase();
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    return (
        <div className="min-h-screen font-sans pb-12">
            {/* ── Back breadcrumb ── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 hover: text-sm font-medium transition-colors"
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
                <div className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full blur-2xl" />
                <div className="absolute bottom-[-80px] right-[-20px] w-80 h-80 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    {/* Profile Basic Info */}
                    <div className="flex items-end gap-5">
                        <div className="relative shrink-0">
                            {profile?.logoUrl ? (
                                <img
                                    src={profile.logoUrl}
                                    alt={displayName}
                                    className="w-28 h-28 object-cover rounded-2xl border-4 shadow-xl"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl font-bold shadow-xl border-4">
                                    {avatarLetter}
                                </div>
                            )}
                            {/* Verified badge */}
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="mb-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-extrabold tracking-tight">{displayName}</h1>
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                    Verified Store
                                </span>
                            </div>
                            <div className="flex items-center gap-5 text-sm font-medium">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                    <span className="font-bold tracking-wide">{profile?.rating || "4.8"}</span> / 5.0
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
            {/* ── Main Layout ────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Store */}
                    <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h2 className="text-[17px] font-bold">About Store</h2>
                        </div>
                        <p className="leading-relaxed text-[15px]">
                            {profile?.about || "Welcome to our store! We supply premium quality fabrics globally, guaranteeing both durability and exquisite texture. Whether you are looking for luxurious silks, breathable cottons, or custom prints, our collections are carefully curated to ensure top-tier materials for your tailoring and designer needs."}
                        </p>
                    </div>
                    {/* Store Items Grid */}
                    <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-[17px] font-bold">Store Products</h2>
                            </div>
                        </div>
                        {storeProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {storeProducts.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/shop/${item.id}`)}
                                        className="rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group relative cursor-pointer"
                                    >
                                        {/* Image */}
                                        <div className="relative h-44 overflow-hidden bg-slate-100 flex items-center justify-center">
                                            {item.image_url || item.image ? (
                                                <img 
                                                    src={item.image_url || item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full" style={{ background: item.bgColor }} />
                                            )}
                                            
                                            <div className="absolute inset-0 group-hover:bg-black/5 transition-colors duration-300" />
                                            {(() => {
                                                const status = item.stock <= 0 ? "out" : item.stock <= 10 ? "low" : "in";
                                                const statusStyles = {
                                                    in: { label: "In Stock", bg: "bg-green-50 text-green-700 border-green-200" },
                                                    low: { label: "Low Stock", bg: "bg-amber-50 text-amber-700 border-amber-200" },
                                                    out: { label: "Out of Stock", bg: "bg-white/90 text-red-600 border-red-200" },
                                                };
                                                const currentStyle = statusStyles[status];
                                                
                                                return (
                                                    <span className={`absolute top-3 left-3 border text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${currentStyle.bg}`}>
                                                        {currentStyle.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        {/* Body */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-bold text-sm leading-tight line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                    <span className="text-xs font-bold">{item.rating}</span>
                                                </div>
                                            </div>
                                            <div className="text-xs font-semibold mb-3">
                                                {item.type}
                                            </div>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-lg font-extrabold tracking-tight">
                                                    LKR {item.price?.toLocaleString()}
                                                </span>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover: transition-colors">
                                                    <svg className="w-4 h-4 group-hover: transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-2xl py-16 flex flex-col items-center justify-center">
                                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="font-medium text-sm">Products from this seller will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Right Column (Sidebar) */}
                <div className="rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border sticky top-8 relative overflow-hidden">
                    {/* Subtle gradient bar at the top edge */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
                    {/* Supplier Badges */}
                    <div className="mb-8 mt-2">
                        <h3 className="flex items-center gap-2 text-[15px] font-bold mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Achievements
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl border">
                                <span className="text-xl">🏆</span>
                                <div>
                                    <p className="text-sm font-bold">Top Seller 2023</p>
                                    <p className="text-xs">Consistently high ratings</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                <span className="text-xl">⚡</span>
                                <div>
                                    <p className="text-sm font-bold text-green-900">Fast Shipper</p>
                                    <p className="text-xs text-green-700">Dispatches within 24h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Specialities */}
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-[15px] font-bold mb-3">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            Product Specialities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Silks</span>
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Premium Cotton</span>
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Linen Canvas</span>
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Bulk Orders</span>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button className="w-full hover: font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md shadow-purple-200 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Message Seller
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex justify-center items-center gap-2 border hover: hover: text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                Follow Store
                            </button>
                            <button className="flex justify-center items-center gap-2 border hover: hover: text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
