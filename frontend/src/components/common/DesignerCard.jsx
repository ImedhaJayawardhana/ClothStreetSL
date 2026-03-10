export default function DesignerCard({ designer }) {
    // Color mapping for specialty pills
    const specialtyColors = {
        'Bridal Couture': 'bg-pink-50 text-pink-700 border-pink-100',
        'Evening Wear': 'bg-violet-50 text-violet-700 border-violet-100',
        'Traditional Wear': 'bg-amber-50 text-amber-700 border-amber-100',
        'Handloom Designs': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Streetwear': 'bg-orange-50 text-orange-700 border-orange-100',
        'Urban Fashion': 'bg-blue-50 text-blue-700 border-blue-100',
        'Resort Wear': 'bg-cyan-50 text-cyan-700 border-cyan-100',
        'Swimwear': 'bg-teal-50 text-teal-700 border-teal-100',
        'Corporate Wear': 'bg-slate-50 text-slate-700 border-slate-100',
        'Uniforms': 'bg-gray-50 text-gray-700 border-gray-200',
        'Kids Wear': 'bg-rose-50 text-rose-700 border-rose-100',
        'Playful Prints': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-100 transition-all duration-300 group flex flex-col">

            {/* ── Image Section ── */}
            <div className="relative h-52 overflow-hidden bg-gray-100">
                <img
                    src={designer.image}
                    alt={designer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Rating badge — top right */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md shadow-sm px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700">{designer.rating}</span>
                </div>

                {/* Availability + works badges — bottom */}
                <div className="absolute inset-x-0 bottom-0 p-3 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent">
                    <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
                        designer.status === 'Available'
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-gray-800/90 text-gray-300'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                            designer.status === 'Available' ? 'bg-white' : 'bg-gray-400'
                        }`} />
                        {designer.status}
                    </div>
                    <div className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        +4 works
                    </div>
                </div>
            </div>

            {/* ── Card Body ── */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Name & Location */}
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{designer.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {designer.location}
                    </div>
                </div>

                {/* Specialty pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {designer.specialties.map((spec, idx) => (
                        <span key={idx} className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                            specialtyColors[spec] || 'bg-violet-50 text-violet-700 border-violet-100'
                        }`}>
                            {spec}
                        </span>
                    ))}
                </div>

                {/* Styles */}
                <div className="mb-3">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Styles</p>
                    <div className="flex flex-wrap gap-1.5">
                        {designer.styles.map((style, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full">
                                {style}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tools */}
                <div className="mb-4">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tools</p>
                    <div className="flex flex-wrap gap-1.5">
                        {designer.tools.map((tool, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] font-medium rounded-full border border-gray-100">
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="text-gray-400 mb-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <div className="text-sm font-bold text-gray-900">{designer.projects}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-0.5">Projects</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="text-gray-400 mb-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="text-sm font-bold text-gray-900">{designer.experience}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-0.5">Experience</div>
                    </div>
                </div>

                {/* Price Range & Actions */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500 font-medium">Price Range</span>
                        <span className="text-sm font-bold text-gray-900">{designer.priceRange}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-rose-200 flex items-center justify-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Portfolio
                        </button>
                        <button className="w-full py-2.5 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
