import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/craftsperson-bg.png';

export default function BrowseDesigners() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [activeStyle, setActiveStyle] = useState('All');
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contactDesigner, setContactDesigner] = useState(null);

    useEffect(() => {
        async function fetchDesigners() {
            try {
                const querySnapshot = await getDocs(collection(db, "designers"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDesigners(data);
            } catch (error) {
                console.error("Error fetching designers:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDesigners();
    }, []);

    const STYLES = [
        'All Styles', 'Bridal Couture', 'Evening Wear', 'Traditional Wear',
        'Handloom Designs', 'Streetwear', 'Urban Fashion',
        'Resort Wear', 'Corporate Wear', 'Kids Wear'
    ];

    const filteredDesigners = designers.filter(designer => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            designer.name?.toLowerCase().includes(query) ||
            designer.location?.toLowerCase().includes(query) ||
            designer.services?.some(s => s.toLowerCase().includes(query)) ||
            designer.aesthetics?.some(s => s.toLowerCase().includes(query));

        const matchesAvailable = availableOnly ? designer.availability === true : true;

        const matchesStyle = activeStyle === 'All' ||
            designer.services?.includes(activeStyle) ||
            designer.aesthetics?.includes(activeStyle);

        return matchesSearch && matchesAvailable && matchesStyle;
    });

    return (
        <div className="min-h-screen">

            {/* ───────────── HERO BANNER ───────────── */}
            <section className="relative overflow-hidden" style={{ color: '#fff' }}>
                <img src={heroImg} alt="Designers Background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,10,40,0.90) 0%, rgba(30,20,70,0.84) 40%, rgba(55,30,100,0.76) 100%)', zIndex: 1 }} />

                <div className="max-w-7xl mx-auto text-center relative px-4" style={{ zIndex: 2, paddingTop: '1.5rem', paddingBottom: '2rem' }}>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5 mb-5" style={{ color: '#e9d5ff', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Creative Network
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4" style={{ color: '#ffffff' }}>
                        Find Expert{' '}
                        <span style={{ background: 'linear-gradient(135deg, #f0abfc, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Designers
                        </span>
                    </h1>
                    <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(233,213,255,0.85)' }}>
                        {loading ? '...' : `${designers.length}+`} creative professionals for your fashion vision
                    </p>
                </div>
            </section>

            {/* ───────────── SEARCH BAR ROW ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div style={{ position: 'relative', flex: 1 }}>
                            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center', pointerEvents: 'none', zIndex: 1 }}>
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search by name, location, or style..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '12px', paddingLeft: '44px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', fontSize: '14px', outline: 'none', background: '#fff', color: '#1e293b' }}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setAvailableOnly(!availableOnly)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '12px 20px', borderRadius: '12px', fontSize: '14px',
                                fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer',
                                border: availableOnly ? '1px solid #6ee7b7' : '1px solid #e2e8f0',
                                background: availableOnly ? '#ecfdf5' : '#fff',
                                color: availableOnly ? '#065f46' : '#475569',
                            }}
                        >
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: availableOnly ? '#10b981' : '#cbd5e1', display: 'inline-block' }} />
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
                            <button key={style} onClick={() => setActiveStyle(key)}
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                                    isActive
                                        ? 'bg-fuchsia-600 border-fuchsia-600 text-white shadow-md shadow-fuchsia-200'
                                        : 'bg-white hover:border-violet-300 hover:text-violet-600 border-slate-200'
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
                <p className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-900">{loading ? '...' : filteredDesigners.length}</span> designers found
                </p>
            </div>

            {/* ───────────── DESIGNERS GRID ───────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="rounded-3xl border overflow-hidden shadow-sm animate-pulse">
                                <div className="h-48 bg-slate-100"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-slate-100 rounded-md w-2/3"></div>
                                    <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
                                        <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="h-10 bg-slate-100 rounded-xl w-full mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredDesigners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                        {filteredDesigners.map(designer => (
                            <div key={designer.id} className="rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-100 transition-all duration-300 group flex flex-col bg-white">

                                {/* Header Image Area */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-fuchsia-100 to-purple-100">
                                    {designer.portfolioImages?.[0] ? (
                                        <img src={designer.portfolioImages[0]} alt={designer.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : designer.profilePhoto ? (
                                        <img src={designer.profilePhoto} alt={designer.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-6xl font-extrabold text-fuchsia-200">{designer.name?.charAt(0)}</span>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute inset-x-0 bottom-0 p-3 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent">
                                        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
                                            designer.availability ? 'bg-emerald-500/90 text-white' : 'bg-slate-500/90 text-white'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${designer.availability ? 'bg-white' : 'bg-slate-300'}`} />
                                            {designer.availability ? 'Available' : 'Busy'}
                                        </div>
                                        <div className="backdrop-blur-md bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                            +{(designer.portfolioImages?.length || 0)} works
                                        </div>
                                    </div>

                                    {/* Rating Badge */}
                                    <div className="absolute top-3 right-3 backdrop-blur-md bg-white/90 shadow-sm px-2 py-1 rounded-lg flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-xs font-bold text-slate-800">{designer.rating?.toFixed(1) || '5.0'}</span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold mb-1 line-clamp-1">{designer.name}</h3>
                                        <div className="flex items-center text-sm text-slate-500">
                                            <svg className="w-4 h-4 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="line-clamp-1">{designer.location || 'Sri Lanka'}</span>
                                        </div>
                                    </div>

                                    {/* Services & Aesthetics */}
                                    <div className="mb-5 flex-grow">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {(designer.services || []).slice(0, 2).map((s, idx) => (
                                                <span key={idx} className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                                            <span className="font-semibold text-slate-600">Aesthetics:</span>{' '}
                                            {(designer.aesthetics || []).slice(0, 3).join(', ')}
                                            {(designer.aesthetics?.length || 0) > 3 && ` +${designer.aesthetics.length - 3} more`}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="p-3 rounded-xl border bg-slate-50/50">
                                            <div className="text-sm font-bold text-slate-800">LKR {(designer.hourlyRate || 0).toLocaleString()}</div>
                                            <div className="text-[10px] uppercase tracking-wider font-medium mt-0.5 text-slate-400">Hourly Rate</div>
                                        </div>
                                        <div className="p-3 rounded-xl border bg-slate-50/50">
                                            <div className="text-sm font-bold text-slate-800">{designer.experience || 0} yrs</div>
                                            <div className="text-[10px] uppercase tracking-wider font-medium mt-0.5 text-slate-400">Experience</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 border-t mt-auto">
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => navigate(`/designer/${designer.id}`)}
                                                className="w-full py-2.5 px-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-fuchsia-200 flex items-center justify-center gap-1.5"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Portfolio
                                            </button>
                                            <button
                                                onClick={() => setContactDesigner(designer)}
                                                className="w-full py-2.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="rounded-3xl border border-dashed p-12 text-center mt-6 bg-white">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2">No designers found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6">
                            We couldn't find any designers matching your current filters.
                        </p>
                        <button onClick={() => { setSearchQuery(''); setAvailableOnly(false); setActiveStyle('All'); }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border text-sm font-semibold rounded-xl transition-colors shadow-sm hover:bg-slate-50">
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* ────────── CONTACT MODAL ────────── */}
            {contactDesigner && createPortal(
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                  onClick={() => setContactDesigner(null)}
                >
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} />
                    <div
                      style={{ position: 'relative', zIndex: 1, background: '#ffffff', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', maxWidth: '400px', width: '100%', padding: '24px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setContactDesigner(null)}
                            style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            {contactDesigner.profilePhoto ? (
                                <img src={contactDesigner.profilePhoto} alt={contactDesigner.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-fuchsia-100" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {contactDesigner.name?.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold">{contactDesigner.name}</h3>
                                <p className="text-sm text-slate-500">{contactDesigner.location}</p>
                            </div>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Get in touch</h4>

                        <div className="space-y-3">
                            <a href={`tel:${contactDesigner.phoneNumber || '+94770000000'}`}
                                className="flex items-center gap-3 p-3 hover:bg-slate-50 border rounded-xl transition-all duration-200">
                                <div className="w-10 h-10 bg-fuchsia-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">Call Now</p>
                                    <p className="text-xs text-slate-500 truncate">{contactDesigner.phoneNumber || '+94770000000'}</p>
                                </div>
                            </a>

                            <a href={`https://wa.me/${(contactDesigner.phoneNumber || '+94770000000').replace('+', '')}?text=Hi ${encodeURIComponent(contactDesigner.name)}, I found your profile on ClothStreet and I'd like to discuss a design project.`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 hover:bg-emerald-50 border hover:border-emerald-200 rounded-xl transition-all duration-200">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">WhatsApp</p>
                                    <p className="text-xs text-slate-500 truncate">{contactDesigner.phoneNumber || '+94770000000'}</p>
                                </div>
                            </a>

                            <button onClick={() => { setContactDesigner(null); navigate(`/designer/${contactDesigner.id}`); }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-violet-50 border hover:border-violet-200 rounded-xl transition-all duration-200">
                                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-semibold">View Full Profile</p>
                                    <p className="text-xs text-slate-500">See portfolio & reviews</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}
        </div>
    );
}