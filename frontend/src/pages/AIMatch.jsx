import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage } from '../api';
import toast from 'react-hot-toast';

export default function AIMatch() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your ClothStreet AI Assistant. I can help you find fabrics by color, material, or even recommend the exact amount of fabric you need if you have measurements saved in your profile! Try asking me to 'find denim that fits me' or 'show me white cotton'.",
      fabrics: [],
      requiredMeters: 0
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const isSeller = user?.role === "seller";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMessage = inputVal.trim();
    setInputVal('');
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Call python backend via API
      const res = await sendChatMessage(userMessage, user?.uid);
      const data = res.data;
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.message || "Here's what I found for you:",
        fabrics: data.fabrics || [],
        requiredMeters: data.required_meters || 0
      }]);
    } catch (err) {
      console.error("AI chat error:", err);
      toast.error("Failed to connect to the AI engine");
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "Sorry, I'm having trouble connecting to the servers right now. Please try again later.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper handling Add to cart
  const handleAddToCart = (fab, reqMeters) => {
    addToCart({
      id: fab.id,
      name: fab.name,
      unitPrice: fab.price,
      quantity: reqMeters > 0 ? reqMeters : 1,
      image: fab.image_url || 'https://images.unsplash.com/photo-1605000578643-4f9339e07fb6?auto=format&fit=crop&q=80&w=400',
      type: 'fabric'
    });
    toast.success(`Added ${reqMeters > 0 ? reqMeters : 1}m of ${fab.name} to cart!`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 shrink-0 shadow-sm z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div>
          <h1 className="font-extrabold text-slate-900 text-lg">AI Shop Assistant</h1>
          <p className="text-xs text-slate-500 font-medium">Powered by ClothStreet SL Intelligence</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            
            return (
              <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                
                {/* Text Bubble */}
                <div className="flex items-end gap-2 max-w-[85%]">
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                  )}
                  
                  <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-br-sm shadow-md' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>

                {/* Fabric Cards (Assistant only) */}
                {msg.fabrics && msg.fabrics.length > 0 && (
                  <div className="mt-4 w-full pl-10 pr-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                    <div className="flex gap-4 w-max">
                      {msg.fabrics.map(fab => (
                        <div key={fab.id} className="w-[280px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans transition-transform hover:-translate-y-1 hover:shadow-md snap-start">
                          
                          {/* Image area */}
                          <div className="h-32 bg-slate-100 relative cursor-pointer" onClick={() => navigate(`/shop/${fab.id}`)}>
                            {fab.image_url ? (
                              <img src={fab.image_url} alt={fab.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400 opacity-50" style={{ backgroundColor: fab.colors?.[0] || '#e2e8f0' }}>
                                ✦ {fab.name.substring(0,2).toUpperCase()}
                              </div>
                            )}
                            
                            {msg.requiredMeters > 0 && (
                              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                Recommends {msg.requiredMeters}m
                              </div>
                            )}
                            
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                              {fab.type || "Fabric"}
                            </div>
                          </div>

                          {/* Body */}
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-slate-900 text-sm truncate">{fab.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{fab.location || "Sri Lanka"}</p>
                            
                            <div className="mt-flex flex gap-3 text-xs font-semibold mt-3 mb-4">
                              <span className="text-slate-900">LKR {fab.price?.toLocaleString()}/m</span>
                              {fab.stock <= 0 ? (
                                <span className="text-red-500">Out of Stock</span>
                              ) : (
                                <span className="text-green-600">{fab.stock}m left</span>
                              )}
                            </div>

                            <div className="mt-auto flex gap-2">
                              {/* Add to Cart or View Details based on Role */}
                              {isSeller ? (
                                <button 
                                  onClick={() => navigate(`/shop/${fab.id}`)}
                                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors border border-slate-200 flex items-center justify-center gap-1.5"
                                >
                                  View Details
                                </button>
                              ) : (
                                <button 
                                  disabled={fab.stock <= 0}
                                  onClick={() => handleAddToCart(fab, msg.requiredMeters)}
                                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                                    fab.stock > 0 
                                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200' 
                                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                  }`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.2 9.3a1 1 0 0 0 1 1.2h12.5a1 1 0 0 0 1-1.2L17 13M9 20h0M15 20h0"/>
                                  </svg>
                                  {msg.requiredMeters > 0 ? `Add ${msg.requiredMeters}m` : 'Add to Cart'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-end gap-2 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="px-5 py-4 bg-white border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="bg-white border-t border-slate-200 p-4 sm:p-6 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Ask me to find fabrics, match colors, or calculate needed lengths..."
              className="w-full pl-5 pr-14 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm shadow-inner"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={!inputVal.trim() || loading}
              className={`absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                inputVal.trim() && !loading
                  ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-md transform hover:scale-105'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-slate-400 font-medium">ClothStreet AI can make mistakes. Verify quantities before purchasing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
