import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function BrowseTailors() {
    const [searchQuery, setSearchQuery] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [activeSpecialization, setActiveSpecialization] = useState('All');
    const [tailors, setTailors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTailors() {
            try {
                const querySnapshot = await getDocs(collection(db, "tailors"));
                const tailorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTailors(tailorsData);
            } catch (error) {
                console.error("Error fetching tailors:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTailors();
    }, []);

    const handleAddMockData = async () => {
        setLoading(true);
        const mockTailors = [
            {
                name: "Kamal Perera",
                location: "Colombo 07",
                specializations: ["Bespoke Suits", "Formal Wear"],
                skills: ["Suit Tailoring", "Pattern Drafting", "Alterations"],
                rating: 4.9,
                orders: 487,
                experience: 15,
                priceMin: 15000,
                priceMax: 45000,
                status: "Available",
                portfolioImages: [
                    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=500&q=80",
                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80"
                ]
            },
            {
                name: "Samanthi Silva",
                location: "Kandy",
                specializations: ["Wedding Dresses", "Evening Gowns"],
                skills: ["Bridal Wear", "Embroidery", "Beading", "Custom Fitting"],
                rating: 4.8,
                orders: 312,
                experience: 10,
                priceMin: 25000,
                priceMax: 150000,
                status: "Busy",
                portfolioImages: [
                    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
                    "https://images.unsplash.com/photo-1566207274740-0f8cf6b7d5a5?auto=format&fit=crop&w=500&q=80"
                ]
            },
            {
                name: "Ruwan Textiles",
                location: "Galle",
                specializations: ["Casual Wear", "Shirts", "Traditional Wear"],
                skills: ["Cotton Shirts", "Sarongs", "Bulk Orders"],
                rating: 4.6,
                orders: 850,
                experience: 8,
                priceMin: 2500,
                priceMax: 10000,
                status: "Available",
                portfolioImages: [
                    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80",
                    "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=500&q=80"
                ]
            }
        ];

        try {
            for (const tailor of mockTailors) {
                const newDocRef = doc(collection(db, "tailors"));
                await setDoc(newDocRef, tailor);
            }
            const querySnapshot = await getDocs(collection(db, "tailors"));
            const tailorsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setTailors(tailorsData);
            setSearchQuery('');
            setAvailableOnly(false);
            setActiveSpecialization('All');
        } catch (error) {
            console.error("Error adding mock data", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTailors = tailors.filter(tailor => {
        const matchesSearch =
            tailor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tailor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tailor.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesAvailable = availableOnly ? tailor.status === 'Available' : true;
        const matchesSpecialization = activeSpecialization === 'All' || tailor.specializations?.includes(activeSpecialization);

        return matchesSearch && matchesAvailable && matchesSpecialization;
    });

    const SPECIALIZATIONS = [
        'All Specializations', 'Bespoke Suits', 'Formal Wear', 'Wedding Dresses',
        'Evening Gowns', 'Casual Wear', 'Shirts', 'Kids Clothing',
        'School Uniforms', 'Traditional Wear', 'Sarongs', 'Blouses', 'Saree Fitting'
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* ───────────── HERO BANNER ───────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-20 px-4">
                {/* Decorative blurred orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    {/* Label pill */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Professional Network
                    </span>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                        Find Expert{' '}
                        <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                            Tailors
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-violet-200/70 max-w-xl mx-auto">
                        6+ verified professionals ready for your garment needs
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center justify-center gap-8 mt-8">
                        <div className="flex items-center gap-2 text-violet-300/80">
                            <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Verified Professionals</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-violet-300/80">
                            <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Top Rated</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-violet-300/80">
                            <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Quick Turnaround</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────── SEARCH BAR ROW ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search input */}
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, location, or skill..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Available Now toggle */}
                        <button
                            onClick={() => setAvailableOnly(!availableOnly)}
                            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                                availableOnly
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm shadow-emerald-100'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                availableOnly ? 'bg-emerald-500' : 'bg-gray-300'
                            }`} />
                            Available Now
                        </button>
                    </div>
                </div>
            </div>

            {/* ───────────── SPECIALIZATION FILTER PILLS ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {SPECIALIZATIONS.map((spec) => {
                        const key = spec === 'All Specializations' ? 'All' : spec;
                        const isActive = activeSpecialization === key;
                        return (
                            <button
                                key={spec}
                                onClick={() => setActiveSpecialization(key)}
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                                    isActive
                                        ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600'
                                }`}
                            >
                                {spec}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ───────────── RESULTS COUNT ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">{loading ? '...' : filteredTailors.length}</span> tailors found
                </p>
            </div>

            {/* ───────────── TAILORS GRID ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-gray-200 rounded-md w-2/3"></div>
                                    <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 rounded-xl w-full mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredTailors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                        {filteredTailors.map(tailor => (
                            <div key={tailor.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-100 transition-all duration-300 group flex flex-col">
                                
                                {/* Header Image Area */}
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <div className="absolute inset-0 flex">
                                        <div className="w-3/5 h-full">
                                            <img src={tailor.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=500&q=80'} alt="Portfolio 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="w-2/5 h-full border-l border-white/20">
                                            <img src={tailor.portfolioImages?.[1] || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=500&q=80'} alt="Portfolio 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 delay-75" />
                                        </div>
                                    </div>

                                    {/* Badges Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-3 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent">
                                        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
                                            tailor.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-gray-800/90 text-gray-300'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${tailor.status === 'Available' ? 'bg-white' : 'bg-gray-400'}`}></span>
                                            {tailor.status || 'Busy'}
                                        </div>
                                        <div className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                            +{tailor.portfolioImages?.length > 2 ? tailor.portfolioImages.length - 2 : 4} works
                                        </div>
                                    </div>
                                    
                                    {/* Star Rating Badge */}
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md shadow-sm px-2 py-1 rounded-lg flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-xs font-bold text-gray-700">{tailor.rating?.toFixed(1) || '4.8'}</span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{tailor.name}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-1 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="line-clamp-1">{tailor.location}</span>
                                        </div>
                                    </div>

                                    {/* Specializations & Skills */}
                                    <div className="mb-5 flex-grow">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {tailor.specializations?.slice(0, 2).map((spec, idx) => (
                                                <span key={idx} className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-100">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                            <span className="font-semibold text-gray-600">Expertise:</span> {tailor.skills?.slice(0, 3).join(', ')}
                                            {tailor.skills?.length > 3 && ` +${tailor.skills.length - 3} more`}
                                        </p>
                                    </div>

                                    {/* Stats Boxes */}
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <div className="text-gray-400 mb-1">
                                                <svg className="w-4 h-4" autoFocus fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900">{tailor.orders || 0}+</div>
                                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-0.5">Orders</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <div className="text-gray-400 mb-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900">{tailor.experience || 0} yrs</div>
                                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-0.5">Experience</div>
                                        </div>
                                    </div>

                                    {/* Price Range & Actions */}
                                    <div className="pt-4 border-t border-gray-100 mt-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs text-gray-500 font-medium">Starting from</span>
                                            <span className="text-sm font-bold text-gray-900">
                                                Rs {tailor.priceMin?.toLocaleString() || '1,500'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="w-full py-2.5 px-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-violet-200 flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Portfolio
                                            </button>
                                            <button className="w-full py-2.5 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-3xl border border-gray-100 border-dashed p-12 text-center mt-6">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No tailors found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            We couldn't find any professionals matching your current filters. Try adjusting your search or clearing filters.
                        </p>
                        <button 
                            onClick={() => {
                                setSearchQuery('');
                                setAvailableOnly(false);
                                setActiveSpecialization('All');
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Clear all filters
                        </button>
                        <button 
                            onClick={handleAddMockData}
                            className="inline-flex items-center gap-2 px-5 py-2.5 mt-4 sm:mt-0 sm:ml-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-violet-200"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Populate Mock Tailors
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
