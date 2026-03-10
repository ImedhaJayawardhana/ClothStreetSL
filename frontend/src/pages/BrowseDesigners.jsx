import { useState } from 'react';
import DesignerCard from '../components/common/DesignerCard';
import designersData from '../data/designersData';

export default function BrowseDesigners() {
    const [searchQuery, setSearchQuery] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [activeStyle, setActiveStyle] = useState('All');

    const STYLES = [
        'All Styles', 'Bridal Couture', 'Evening Wear', 'Traditional Wear',
        'Handloom Designs', 'Streetwear', 'Urban Fashion',
        'Resort Wear', 'Swimwear', 'Corporate Wear', 'Uniforms',
        'Kids Wear', 'Playful Prints'
    ];

    // ── Filtering logic ──
    const filteredDesigners = designersData.filter(designer => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            designer.name.toLowerCase().includes(query) ||
            designer.location.toLowerCase().includes(query) ||
            designer.styles.some(s => s.toLowerCase().includes(query));

        const matchesAvailable = availableOnly ? designer.status === 'Available' : true;

        const matchesStyle = activeStyle === 'All'
            || designer.specialties.includes(activeStyle)
            || designer.styles.includes(activeStyle);

        return matchesSearch && matchesAvailable && matchesStyle;
    });

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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Creative Network
                    </span>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                        Find Expert{' '}
                        <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                            Designers
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-violet-200/70 max-w-xl mx-auto">
                        6+ creative professionals for your fashion vision
                    </p>
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
                                placeholder="Search by name, location, or style..."
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

            {/* ───────────── STYLE FILTER PILLS ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex flex-wrap items-center gap-2">
                    {STYLES.map((style) => {
                        const key = style === 'All Styles' ? 'All' : style;
                        const isActive = activeStyle === key;
                        return (
                            <button
                                key={style}
                                onClick={() => setActiveStyle(key)}
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                                    isActive
                                        ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600'
                                }`}
                            >
                                {style}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ───────────── RESULTS COUNT ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">{filteredDesigners.length}</span> designers found
                </p>
            </div>

            {/* ───────────── DESIGNERS GRID ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {filteredDesigners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                        {filteredDesigners.map(designer => (
                            <DesignerCard key={designer.id} designer={designer} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-3xl border border-gray-100 border-dashed p-12 text-center mt-6">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No designers found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            We couldn't find any designers matching your current filters. Try adjusting your search or clearing filters.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setAvailableOnly(false);
                                setActiveStyle('All');
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
