import React from 'react';

export default function BrowseTailors() {
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

            {/* Content will be added in subsequent sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <p className="text-gray-400 text-center">More sections coming soon…</p>
            </div>
        </div>
    );
}
