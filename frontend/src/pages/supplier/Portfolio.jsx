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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12">
            {/* ── Header Banner ──────────────────────────────────────── */}
            <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 pt-10 pb-5 px-6 lg:px-12 overflow-hidden">
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
                                    Premium Supplier
                                </span>
                            </div>
                            <div className="flex items-center gap-5 text-purple-100 text-sm font-medium">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                                    </svg>
                                    <span className="text-white font-bold tracking-wide">4.7</span> / 5.0
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
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>