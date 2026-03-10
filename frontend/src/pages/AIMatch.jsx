import React, { useState } from 'react';

export default function AIMatch() {
  const [formData, setFormData] = useState({
    garmentType: '',
    budget: 50000,
    quantity: 100,
    quality: 'Standard'
  });

  // Estimated price per piece
  const pricePerPiece = Math.round(formData.budget / formData.quantity);

  const handleQualitySelect = (value) => {
    setFormData(prev => ({ ...prev, quality: value }));
  };

  const handleSliderChange = (e) => {
    setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }));
  };

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

      {/* Main Content Area */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN - Requirements Form */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Requirements</h2>
              <p className="text-gray-500 mb-8">Tell us about your project and our AI will find the best matches</p>

              <div className="space-y-6">
                {/* Garment Type */}
                <div>
                  <label htmlFor="garmentType" className="block text-sm font-medium text-gray-700 mb-2">
                    Garment Type<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="garmentType"
                    value={formData.garmentType}
                    onChange={(e) => setFormData({ ...formData, garmentType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none appearance-none"
                  >
                    <option value="" disabled>Select garment type...</option>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Dress">Dress</option>
                    <option value="Suit">Suit</option>
                    <option value="Saree">Saree</option>
                    <option value="Kurta">Kurta</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Total Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">Total Budget (Rs)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs</span>
                    <input
                      type="number"
                      id="budget"
                      min="1000"
                      max="10000000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value ? Number(e.target.value) : '' })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Estimated: ≈ Rs {pricePerPiece} per piece
                  </p>
                </div>

                {/* Quantity Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {formData.quantity} pieces
                    </span>
                  </div>
                  <input
                    type="range"
                    id="quantity"
                    min="10"
                    max="500"
                    value={formData.quantity}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Quality Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality Preference</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Budget', 'Standard', 'Premium', 'Luxury'].map((quality) => (
                      <button
                        key={quality}
                        type="button"
                        onClick={() => handleQualitySelect(quality)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                          formData.quality === quality
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 border border-purple-600'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>✦ Get AI Recommendations →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Info Cards (Step 3 placeholder) */}
          <div className="w-full lg:w-2/5 space-y-6">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full min-h-[400px]">
              <p>Right column info cards (Step 3 goes here)</p>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
