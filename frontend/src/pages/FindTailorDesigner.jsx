import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import designersData from "../data/designersData";
import toast from "react-hot-toast";

export default function FindTailorDesigner() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Read mode from query params
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get("mode") || sessionStorage.getItem("clothstreet_service_mode") || "tailor";

    // ── Flow State ──
    // For 'both' mode: step 1 = designer, step 2 = tailor
    const [comboStep, setComboStep] = useState(1);
    const [selectedProviderId, setSelectedProviderId] = useState(null);
    const [comboDesigner, setComboDesigner] = useState(null);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [tailors, setTailors] = useState([]);
    const [dbDesigners, setDbDesigners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch providers from Firestore
    useEffect(() => {
        async function fetchProviders() {
            try {
                const [tailorsSnap, designersSnap] = await Promise.all([
                    getDocs(collection(db, "tailors")),
                    getDocs(collection(db, "designers"))
                ]);
                
                const tailorsData = tailorsSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    providerType: "tailor",
                }));

                const dbDesignersData = designersSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    providerType: "designer",
                }));

                setTailors(tailorsData);
                setDbDesigners(dbDesignersData);
            } catch (err) {
                console.error("Error fetching providers:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProviders();
    }, []);

    // Combine manual designers with DB designers
    const localDesigners = designersData.map((d) => ({
        id: `designer-${d.id}`,
        name: d.name,
        location: d.location,
        rating: d.rating,
        specializations: d.specialties,
        experience: parseInt(d.experience) || 0,
        orders: parseInt(d.projects) || 0,
        priceMin: parseInt(d.priceRange?.replace(/[^\d]/g, "")) || 0,
        status: d.status,
        image: d.image,
        providerType: "designer",
    }));

    const allDesigners = [...dbDesigners, ...localDesigners];

    // Determine what to show based on mode and step
    let displayList = [];
    let pageTitle = "";
    let pageSubtitle = "";

    if (mode === "tailor") {
        displayList = tailors;
        pageTitle = "Pick a Tailor";
        pageSubtitle = "Choose a professional to custom-make your outfit";
    } else if (mode === "designer") {
        displayList = allDesigners;
        pageTitle = "Pick a Designer";
        pageSubtitle = "Choose a professional to design your custom outfit";
    } else if (mode === "both") {
        if (comboStep === 1) {
            displayList = allDesigners;
            pageTitle = "Step 1: Pick a Designer";
            pageSubtitle = "First, choose someone to design your custom outfit";
        } else {
            displayList = tailors;
            pageTitle = "Step 2: Pick a Tailor";
            pageSubtitle = "Now, choose someone to bring the design to life";
        }
    }

    // Filter by search
    const filteredProviders = displayList.filter((p) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(q);
        const locMatch = p.location?.toLowerCase().includes(q);
        const specMatch = p.specializations?.some((s) => s.toLowerCase().includes(q));
        return nameMatch || locMatch || specMatch;
    });

    const handleSelect = (provider) => {
        if (selectedProviderId === provider.id) {
            setSelectedProviderId(null);
        } else {
            setSelectedProviderId(provider.id);
        }
    };

    const handleContinue = () => {
        if (!selectedProviderId) return;

        const selectedProvider = displayList.find(p => p.id === selectedProviderId);

        if (mode === "both" && comboStep === 1) {
            // Save designer, move to step 2
            setComboDesigner(selectedProvider);
            setSelectedProviderId(null);
            setSearchQuery("");
            setComboStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (mode === "both" && comboStep === 2) {
            // Save tailor to session storage to use later, navigate to designer flow
            sessionStorage.setItem("clothstreet_combo_tailor", JSON.stringify(selectedProvider));
            navigate(`/request-quote/${comboDesigner.id}?designerId=${comboDesigner.id}&combo=true`, {
                state: { provider: comboDesigner }
            });
            return;
        }

        // Standard flow (single mode)
        const param = selectedProvider.providerType === "designer" ? `designerId=${selectedProvider.id}` : `tailorId=${selectedProvider.id}`;
        navigate(`/request-quote/${selectedProvider.id}?${param}`, {
            state: { provider: selectedProvider }
        });
    };

    const handleBack = () => {
        if (mode === "both" && comboStep === 2) {
            setComboStep(1);
            setSelectedProviderId(comboDesigner?.id || null);
            setComboDesigner(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            navigate("/checkout", { state: { step: 2 } });
        }
    };

    const selectedProviderDetails = displayList.find(p => p.id === selectedProviderId);

    return (
        <div className="min-h-screen relative pb-24">
            {/* ───────────── HERO BANNER ───────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-16 px-4">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <button
                        onClick={handleBack}
                        className="absolute -top-4 left-0 inline-flex items-center gap-2 text-sm font-semibold hover:text-white text-violet-200 transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {mode === "both" && comboStep === 2 ? "Back to Designers" : "Back to Checkout"}
                    </button>

                    <div className="text-center pt-8">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            {mode === "both" ? "Combo Service" : "Custom Service"}
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-white">
                            {pageTitle.split(":")[0]}
                            {pageTitle.includes(":") && ": "}
                            <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                                {pageTitle.includes(":") ? pageTitle.split(":")[1] : ""}
                            </span>
                        </h1>
                        <p className="text-base text-violet-200/70 max-w-lg mx-auto">
                            {pageSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* ───────────── SEARCH ───────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <div className="rounded-2xl shadow-xl shadow-gray-200/60 border bg-white p-4 sm:p-5">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, location, or specialization..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl pl-12 pr-10 py-3 text-sm placeholder-gray-400 outline-none transition-all duration-200"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ───────────── RESULTS COUNT ───────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                        {loading ? "..." : filteredProviders.length}
                    </span>{" "}
                    professionals found
                </p>
            </div>

            {/* ───────────── PROVIDERS GRID ───────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm animate-pulse">
                                <div className="h-2 bg-gradient-to-r from-violet-100 to-purple-100" />
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gray-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                                            <div className="h-3 bg-gray-100 rounded w-1/3" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-20 bg-gray-100 rounded-full" />
                                        <div className="h-6 w-16 bg-gray-100 rounded-full" />
                                    </div>
                                    <div className="h-10 rounded-xl bg-gray-100 w-full mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProviders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {filteredProviders.map((provider) => {
                            const isSelected = selectedProviderId === provider.id;
                            const isTailor = provider.providerType === "tailor";

                            return (
                                <div
                                    key={provider.id}
                                    className={`rounded-2xl bg-white border-2 overflow-hidden transition-all duration-200 cursor-pointer flex flex-col relative
                                        ${isSelected
                                            ? "border-violet-500 shadow-lg shadow-violet-100 transform -translate-y-1"
                                            : "border-gray-100 shadow-sm hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5"
                                        }`}
                                    onClick={() => handleSelect(provider)}
                                >
                                    {/* Selection Checkmark */}
                                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-10
                                        ${isSelected ? "bg-violet-500 border-violet-500 text-white" : "border-gray-300 bg-white/50"}`}>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Top accent bar */}
                                    <div className={`h-1.5 w-full ${isTailor ? "bg-gradient-to-r from-violet-500 to-purple-500" : "bg-gradient-to-r from-rose-500 to-pink-500"}`} />

                                    <div className="p-6 flex flex-col flex-grow">
                                        {/* Header */}
                                        <div className="flex items-start gap-3.5 mb-4 pr-8">
                                            {/* Avatar / Image */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 text-white shadow-inner
                                                ${isTailor ? "bg-gradient-to-br from-violet-500 to-purple-600" : "bg-gradient-to-br from-rose-500 to-pink-600"}`}>
                                                {provider.name?.charAt(0) || "?"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-base font-bold truncate transition-colors ${isSelected ? "text-violet-700" : "text-gray-900"}`}>
                                                    {provider.name}
                                                </h3>
                                                <div className="flex items-center gap-1 mt-0.5 text-gray-500">
                                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-sm truncate">{provider.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Type badge + specializations */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                                                ${isTailor ? "bg-violet-50 text-violet-700 border border-violet-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                                                {provider.providerType}
                                            </span>
                                            {provider.specializations?.slice(0, 2).map((spec, idx) => (
                                                <span key={idx} className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-medium border border-gray-200 bg-gray-50 text-gray-600">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stats row */}
                                        <div className="grid grid-cols-2 gap-3 mb-2 flex-grow">
                                            <div className="rounded-xl p-3 border border-gray-100 bg-gray-50/50">
                                                <div className="text-xs font-medium text-gray-500 mb-0.5">Rating</div>
                                                <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                                    <span className="text-amber-500">★</span> {provider.rating?.toFixed(1) || "N/A"}
                                                </div>
                                            </div>
                                            <div className="rounded-xl p-3 border border-gray-100 bg-gray-50/50">
                                                <div className="text-xs font-medium text-gray-500 mb-0.5">Experience</div>
                                                <div className="text-sm font-bold text-gray-900">{provider.experience || 0} yrs</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Selection indicator highlight bottom */}
                                    <div className={`h-1 w-full transition-colors ${isSelected ? "bg-violet-500" : "bg-transparent"}`} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center mt-6">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No professionals found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            Try adjusting your search or clearing filters.
                        </p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {/* ───────────── BOTTOM STICKY BAR ───────────── */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 transition-transform duration-300 transform ${selectedProviderId ? "translate-y-0" : "translate-y-full"}`}>
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-inner
                            ${selectedProviderDetails?.providerType === "tailor" ? "bg-gradient-to-br from-violet-500 to-purple-600" : "bg-gradient-to-br from-rose-500 to-pink-600"}`}>
                            {selectedProviderDetails?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-0.5">Selected {selectedProviderDetails?.providerType}</p>
                            <p className="font-bold text-gray-900">{selectedProviderDetails?.name}</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleContinue}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-base font-bold rounded-xl transition-all shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-300 transform hover:-translate-y-0.5"
                    >
                        {mode === "both" && comboStep === 1 ? "Continue to Tailor Selection" : "Request Quote"}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
