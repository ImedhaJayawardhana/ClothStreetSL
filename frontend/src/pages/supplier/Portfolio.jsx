import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
export default function Portfolio() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            try {
                const snap = await getDoc(doc(db, "sellers", user.uid));
                if (snap.exists()) setProfile(snap.data());
            } catch (err) {
                console.error("Error fetching profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);
    const displayName = profile?.shopName || user?.name || user?.email || "Nimal Perera";
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
            {/* ── Header Banner ──────────────────────────────────────── */}
            <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 pt-10 pb-5 px-6 lg:px-12 overflow-hidden">
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
                                    Premium Supplier
                                </span>
                            </div>
                            <div className="flex items-center gap-5 text-sm font-medium">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                    <span className="font-bold tracking-wide">4.7</span> / 5.0
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    3 reviews
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
                    {/* Edit Profile Button */}
                    <div className="absolute top-0 right-0 md:static">
                        <button className="flex items-center gap-2 hover: border px-5 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
            {/* ── Main Layout ────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Me */}
                    <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-[17px] font-bold">About Me</h2>
                        </div>
                        <p className="leading-relaxed text-[15px]">
                            {profile?.about || "I deliver professional tailoring and high-quality fabric services with attention to detail and flawless execution."}
                        </p>
                    </div>
                    {/* Portfolio Gallery */}
                    <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-[17px] font-bold">Portfolio Gallery</h2>
                        </div>
                        {/* Empty State */}
                        <div className="border-2 border-dashed rounded-2xl py-16 flex flex-col items-center justify-center">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="font-medium text-sm">No portfolio photos yet</p>
                        </div>
                    </div>
                    {/* Customer Reviews Header Title */}
                    <div className="pt-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                        </div>
                        <h2 className="text-[17px] font-bold">Customer Reviews</h2>
                        <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold ml-2">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                            4.7 · 3 reviews
                        </span>
                    </div>
                    {/* We might display review cards here later */}
                </div>
                {/* Right Column (Sidebar) */}
                <div className="rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border sticky top-8 relative overflow-hidden">
                    {/* Subtle gradient bar at the top edge */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
                    {/* Pricing */}
                    <div className="mb-8 mt-2">
                        <p className="text-xs font-bold tracking-wider uppercase mb-1">Starting Price</p>
                        <p className="text-3xl font-extrabold">LKR 2,000</p>
                    </div>
                    {/* Services */}
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-[15px] font-bold mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Services
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Suits</span>
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Dresses</span>
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Customize designs</span>
                        </div>
                    </div>
                    {/* Customization Types */}
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-[15px] font-bold mb-3">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeWidth="2.5" strokeLinecap="round" d="M12 4v16M4 12h16" />
                                </svg>
                            </div>
                            Customization Types
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Measurement Base</span>
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Design Base</span>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button className="w-full hover: font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md shadow-purple-200">
                            Contact Me
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex justify-center items-center gap-2 border hover:border-green-300 hover:bg-green-50 text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Quotation
                            </button>
                            <button className="flex justify-center items-center gap-2 border hover:bg-gray-50 text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
