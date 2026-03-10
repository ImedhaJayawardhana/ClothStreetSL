import React from 'react';

export default function AIMatch() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a0533] to-[#2d1b69] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Abstract Background Element for extra visual pop (optional) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[80px]"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-md mb-6 shadow-sm">
            <span className="text-purple-300 text-sm font-semibold tracking-wide">✦ Powered by Machine Learning</span>
          </div>
          
          {/* Large Bold Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            AI-Powered Smart Match
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-purple-100/90 max-w-2xl mx-auto leading-relaxed">
            Get intelligent recommendations for fabric suppliers and tailors based on your specific project requirements
          </p>
        </div>
      </section>

      {/* Main Content Area placeholder for Step 2+ */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-500 py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
          <p>Main content area (Step 2+ goes here)</p>
        </div>
      </section>
    </div>
  );
}
