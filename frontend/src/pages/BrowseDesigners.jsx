import { useState } from 'react';

export default function BrowseDesigners() {
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

        </div>
    );
}
