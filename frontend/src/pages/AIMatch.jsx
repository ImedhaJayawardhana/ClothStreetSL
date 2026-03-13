import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Mock Fallback Data
const mockResults = {
  materials: [
    { id: 1, name: 'Premium Cotton Fabric', supplier: 'TextileCo Lanka', price: 'LKR 450/m', rating: 4.8, match: 97, color: 'White' },
    { id: 2, name: 'Polyester Blend', supplier: 'FabricHub Colombo', price: 'LKR 280/m', rating: 4.5, match: 89, color: 'Blue' },
    { id: 3, name: 'Organic Linen', supplier: 'EcoTextile SL', price: 'LKR 620/m', rating: 4.9, match: 85, color: 'Beige' }
  ],
  tailors: [
    { id: 1, name: 'Nimal Perera', location: 'Colombo 05', experience: '12 years', rating: 4.9, match: 96, speciality: 'Formal Wear' },
    { id: 2, name: 'Kamala Silva', location: 'Kandy', experience: '8 years', rating: 4.7, match: 91, speciality: 'Traditional' },
    { id: 3, name: 'Ravi Fernando', location: 'Galle', experience: '15 years', rating: 4.8, match: 88, speciality: 'Casual Wear' }
  ]
};

export default function AIMatch() {
  const { addToCart } = useCart();
  
  const [formData, setFormData] = useState({
    garmentType: '',
    budget: 50000,
    quantity: 100,
    quality: 'Standard'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Estimated price per piece
  const pricePerPiece = Math.round(formData.budget / formData.quantity);

  const handleSubmit = async () => {
    // Validate: garmentType must be selected
    if (!formData.garmentType) {
      setError('Please select a garment type');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('API failed');

      const data = await res.json();
      setResults(data);

    } catch (err) {
      console.warn("API failed, falling back to mock data", err);
      // Fallback to mock data if API not ready
      setTimeout(() => {
        setResults(mockResults);
        setLoading(false);
      }, 1500); // simulate network delay
    }
  };

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
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                {/* Total Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">Total Budget (LKR )</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">LKR </span>
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
                    Estimated: ≈ LKR {pricePerPiece} per piece
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
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white text-lg font-bold shadow-lg transition-all transform ${
                      loading
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-0.5 shadow-purple-500/30'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <span>✦ Get AI Recommendations →</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Info Cards */}
          <div className="w-full lg:w-2/5 space-y-6">
            
            {/* Smart AI Engine Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1a0533] to-[#2d1b69] p-6 text-white shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20"></path>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300">
                      <path d="M12 2v20"></path>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Smart AI Engine</h3>
                    <p className="text-purple-200 text-sm">Trained on 10,000+ orders</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/20 text-green-400 rounded-full p-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <p className="text-purple-100 text-sm">Best fabric types for your garment</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/20 text-green-400 rounded-full p-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <p className="text-purple-100 text-sm">Most cost-effective suppliers</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/20 text-green-400 rounded-full p-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <p className="text-purple-100 text-sm">Top-rated tailors with relevant experience</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-green-500/20 text-green-400 rounded-full p-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <p className="text-purple-100 text-sm">Optimized quantities to reduce waste</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Card */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                </svg>
                <h3 className="font-bold text-lg text-gray-900">How It Works</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">🎯 Enter your project requirements</h4>
                    <p className="text-sm text-gray-500 mt-1">Specify your garment, budget, and desired quality.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">📈 AI analyzes market data & past orders</h4>
                    <p className="text-sm text-gray-500 mt-1">Our engine matches your needs against 10,000+ data points.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">3</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">💡 Receive personalized matches</h4>
                    <p className="text-sm text-gray-500 mt-1">Get instant curated lists of fabrics and expert tailors.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge Card */}
            <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <h3 className="font-bold text-lg">Trusted by 5,000+ businesses</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                AI has helped ClothStreet businesses save an average of <strong className="text-white">23% on procurement costs</strong> and reduce sourcing time by <strong className="text-white">65%</strong>.
              </p>
            </div>
          </div>
          
        </div>

        {/* RESULTS SECTION */}
        {loading && (
          <div className="mt-16 flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Analyzing market data & past orders...</p>
          </div>
        )}

        {results && !loading && (
          <div className="mt-16 animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Your Perfect Matches</h2>
              <p className="text-gray-500 mt-2">We found the best suppliers and tailors for your specific requirements.</p>
            </div>

            {/* Materials Subsection */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </span>
                Recommended Materials
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.materials.map((material) => (
                  <div key={material.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
                      material.match >= 90 ? 'bg-green-100 text-green-700' :
                      material.match >= 75 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {material.match}% Match
                    </div>
                    
                    <h4 className="font-bold text-lg text-gray-900 pr-16">{material.name}</h4>
                    <p className="text-sm text-gray-500 mb-4">{material.supplier}</p>
                    
                    <div className="flex gap-4 mb-6">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        <span className="text-yellow-400">⭐</span> {material.rating}
                      </div>
                      <div className="text-sm font-medium text-gray-900 border-l border-gray-200 pl-4">
                        {material.price}
                      </div>
                      <div className="text-sm text-gray-500 border-l border-gray-200 pl-4">
                        {material.color}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <Link
                        to="/shop"
                        className="flex-1 text-center py-2.5 px-3 rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 font-medium transition-colors text-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => addToCart({ ...material, unitPrice: parseInt(material.price.replace(/\D/g, '')), quantity: 1, type: 'fabric', image: 'https://images.unsplash.com/photo-1605000578643-4f9339e07fb6?auto=format&fit=crop&q=80&w=400' })}
                        className="flex-1 py-2.5 px-3 rounded-xl text-white bg-purple-600 hover:bg-purple-700 font-medium transition-colors text-sm shadow-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tailors Subsection */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </span>
                Recommended Tailors
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.tailors.map((tailor) => (
                  <div key={tailor.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
                      tailor.match >= 90 ? 'bg-green-100 text-green-700' :
                      tailor.match >= 75 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {tailor.match}% Match
                    </div>
                    
                    <h4 className="font-bold text-lg text-gray-900 pr-16">{tailor.name}</h4>
                    <p className="text-sm text-gray-500 mb-4">{tailor.location}</p>
                    
                    <div className="flex gap-4 mb-6">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        <span className="text-yellow-400">⭐</span> {tailor.rating}
                      </div>
                      <div className="text-sm font-medium text-gray-900 border-l border-gray-200 pl-4">
                        {tailor.experience}
                      </div>
                      <div className="text-sm text-gray-500 border-l border-gray-200 pl-4">
                        {tailor.speciality}
                      </div>
                    </div>
                    
                    <Link
                      to={`/tailors`}
                      className="block text-center w-full py-2.5 px-4 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white font-medium transition-colors text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </section>
    </div>
  );
}
