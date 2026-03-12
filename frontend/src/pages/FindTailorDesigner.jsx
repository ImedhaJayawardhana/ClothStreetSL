import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import designersData from "../data/designersData";

export default function FindTailorDesigner() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tailors from Firestore
  useEffect(() => {
    async function fetchTailors() {
      try {
        const snapshot = await getDocs(collection(db, "tailors"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          providerType: "tailor",
        }));
        setTailors(data);
      } catch (err) {
        console.error("Error fetching tailors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTailors();
  }, []);

  // Map designers to a consistent shape
  const designers = designersData.map((d) => ({
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

  // All providers combined
  const allProviders = [
    ...tailors,
    ...designers,
  ];

  // Filter by tab + search
  const filteredProviders = allProviders.filter((p) => {
    if (activeTab === "Tailors" && p.providerType !== "tailor") return false;
    if (activeTab === "Designers" && p.providerType !== "designer") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = p.name?.toLowerCase().includes(q);
      const locationMatch = p.location?.toLowerCase().includes(q);
      const specMatch = p.specializations?.some((s) =>
        s.toLowerCase().includes(q)
      );
      return nameMatch || locationMatch || specMatch;
    }
    return true;
  });

  const handleSelectProvider = (provider) => {
    // Navigate to request quote page with the provider id
    navigate(`/request-quote/${provider.id}`, {
      state: { provider },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ───────────── HERO BANNER ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-16 px-4">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Label pill */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Checkout · Custom Service
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            Find a{" "}
            <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
              Tailor or Designer
            </span>
          </h1>
          <p className="text-base text-violet-200/70 max-w-lg mx-auto">
            Choose a professional to custom-make your purchased fabrics into exactly what you envision
          </p>
        </div>
      </section>

      {/* ───────────── SEARCH + TABS ───────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
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
                className="w-full bg-gray-50 border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Tab Pills */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {["All", "Tailors", "Designers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── RESULTS COUNT ───────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">
            {loading ? "..." : filteredProviders.length}
          </span>{" "}
          professionals found
        </p>
      </div>

      {/* ───────────── PROVIDERS GRID ───────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-3 bg-gradient-to-r from-violet-200 to-purple-200 rounded-t-2xl" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                    <div className="h-6 w-16 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded-xl w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
                onClick={() => handleSelectProvider(provider)}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1.5 w-full ${
                    provider.providerType === "tailor"
                      ? "bg-gradient-to-r from-violet-500 to-purple-500"
                      : "bg-gradient-to-r from-rose-500 to-pink-500"
                  }`}
                />

                <div className="p-6 flex flex-col flex-grow">
                  {/* Header */}
                  <div className="flex items-start gap-3.5 mb-4">
                    {/* Avatar / Image */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 ${
                        provider.providerType === "tailor"
                          ? "bg-gradient-to-br from-violet-500 to-purple-600"
                          : "bg-gradient-to-br from-rose-500 to-pink-600"
                      }`}
                    >
                      {provider.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-violet-700 transition-colors">
                        {provider.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-500 truncate">
                          {provider.location}
                        </span>
                      </div>
                    </div>
                    {/* Rating badge */}
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg shrink-0">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold text-amber-700">
                        {provider.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Type badge + specializations */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        provider.providerType === "tailor"
                          ? "bg-violet-100 text-violet-700 border border-violet-200"
                          : "bg-rose-100 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {provider.providerType === "tailor" ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        )}
                      </svg>
                      {provider.providerType}
                    </span>
                    {provider.specializations?.slice(0, 2).map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold text-gray-600 bg-gray-100 border border-gray-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-2.5 mb-5 flex-grow">
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 font-medium mb-0.5">Orders</div>
                      <div className="text-sm font-bold text-gray-900">{provider.orders || 0}+</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 font-medium mb-0.5">Experience</div>
                      <div className="text-sm font-bold text-gray-900">{provider.experience || 0} yrs</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                      provider.providerType === "tailor"
                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200"
                        : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectProvider(provider);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-gray-50 rounded-3xl border border-gray-100 border-dashed p-12 text-center mt-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Try adjusting your search or clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("All");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ───────────── BACK LINK ───────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <button
          onClick={() => navigate("/checkout")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Checkout
        </button>
      </div>
    </div>
  );
}
