import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DesignerCard({ designer }) {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showPortfolioModal, setShowPortfolioModal] = useState(false);

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
        <>
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
                            <Link
                                to={`/designer/${designer.id}`}
                                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-rose-200 flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Portfolio
                            </Link>
                            <button
                                onClick={() => setShowContactModal(true)}
                                className="w-full py-2.5 px-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ────────── CONTACT MODAL ────────── */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowContactModal(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowContactModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src={designer.image}
                                alt={designer.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-violet-100"
                            />
                            <div>
                                <h3 className="font-bold text-gray-900">{designer.name}</h3>
                                <p className="text-sm text-gray-500">{designer.location}</p>
                            </div>
                        </div>

                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Get in touch</h4>

                        {/* Contact options */}
                        <div className="space-y-3">
                            {/* Email */}
                            {designer.email && (
                                <a
                                    href={`mailto:${designer.email}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-violet-50 border border-gray-100 hover:border-violet-200 rounded-xl transition-all duration-200 group/link"
                                >
                                    <div className="w-10 h-10 bg-violet-100 group-hover/link:bg-violet-200 rounded-lg flex items-center justify-center transition-colors">
                                        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">Send Email</p>
                                        <p className="text-xs text-gray-500 truncate">{designer.email}</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}

                            {/* Phone */}
                            {designer.phone && (
                                <a
                                    href={`tel:${designer.phone}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all duration-200 group/link"
                                >
                                    <div className="w-10 h-10 bg-blue-100 group-hover/link:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">Call Now</p>
                                        <p className="text-xs text-gray-500 truncate">{designer.phone}</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}

                            {/* WhatsApp */}
                            {designer.whatsapp && (
                                <a
                                    href={`https://wa.me/${designer.whatsapp.replace('+', '')}?text=Hi ${encodeURIComponent(designer.name)}, I found your profile on ClothStreet and I'd like to discuss a project.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 rounded-xl transition-all duration-200 group/link"
                                >
                                    <div className="w-10 h-10 bg-emerald-100 group-hover/link:bg-emerald-200 rounded-lg flex items-center justify-center transition-colors">
                                        <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
                                        <p className="text-xs text-gray-500 truncate">Chat on WhatsApp</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ────────── PORTFOLIO MODAL ────────── */}
            {showPortfolioModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowPortfolioModal(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowPortfolioModal(false)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Hero Image */}
                        <div className="relative h-56 bg-gray-100">
                            <img
                                src={designer.image}
                                alt={designer.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <h3 className="text-2xl font-bold text-white mb-1">{designer.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-full">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {designer.location}
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-full">
                                        <svg className="w-3 h-3 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {designer.rating}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Portfolio Body */}
                        <div className="p-6">
                            {/* Status & Experience */}
                            <div className="flex items-center justify-between mb-5">
                                <div className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 ${
                                    designer.status === 'Available'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        designer.status === 'Available' ? 'bg-emerald-500' : 'bg-gray-400'
                                    }`} />
                                    {designer.status}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span><b className="text-gray-900">{designer.projects}</b> projects</span>
                                    <span><b className="text-gray-900">{designer.experience}</b> exp</span>
                                </div>
                            </div>

                            {/* Specialties */}
                            <div className="mb-4">
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialties</p>
                                <div className="flex flex-wrap gap-2">
                                    {designer.specialties.map((spec, idx) => (
                                        <span key={idx} className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                                            specialtyColors[spec] || 'bg-violet-50 text-violet-700 border-violet-100'
                                        }`}>
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Styles */}
                            <div className="mb-4">
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Design Styles</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {designer.styles.map((style, idx) => (
                                        <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full">
                                            {style}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tools */}
                            <div className="mb-5">
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tools & Software</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {designer.tools.map((tool, idx) => (
                                        <span key={idx} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] font-medium rounded-full border border-gray-100">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price & Contact CTA */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-500">Price Range</span>
                                    <span className="text-sm font-bold text-gray-900">{designer.priceRange}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowPortfolioModal(false);
                                        setShowContactModal(true);
                                    }}
                                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-rose-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Contact {designer.name.split(' ')[0]}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
