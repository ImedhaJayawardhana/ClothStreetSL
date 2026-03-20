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
      text: "Hi! I'm your ClothStreet AI Assistant. I'm here to help you navigate our fashion ecosystem! I can find specific fabrics, match you with the perfect tailor or designer based on your cart, and even calculate exactly how much material you need for your saved size chart. How can I help you today?",
      fabrics: [],
      providers: [],
      requiredMeters: 0
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "Find a matching tailor for my cart", icon: "✂️" },
    { label: "How much white cotton for a shirt?", icon: "📏" },
    { label: "Show me premium denim fabrics", icon: "✨" },
    { label: "Find a designer for a wedding dress", icon: "🎨" },
  ];

  const handleQuickPrompt = (prompt) => {
    setInputVal(prompt);
    // Use a small timeout to let the state update before sending
    setTimeout(() => {
      document.getElementById('ai-chat-form').requestSubmit();
    }, 10);
  };



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const messageToSend = inputVal.trim();
    if (!messageToSend || loading) return;

    setInputVal('');
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setLoading(true);

    try {
      // Call python backend via API
      const res = await sendChatMessage(messageToSend, user?.uid);
      const data = res.data;
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.message || "Here's what I found for you:",
        fabrics: data.fabrics || [],
        providers: data.providers || [],
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
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 shrink-0 shadow-sm z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div>
          <h1 className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">AI Shop Assistant</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by ClothStreet Intelligence</p>
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
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                  )}
                  
                  <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-slate-900 text-white rounded-br-sm shadow-md' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>

                {/* Results (Assistant only) */}
                {!isUser && (
                  <div className="w-full">
                    {/* Fabric Cards */}
                    {msg.fabrics && msg.fabrics.length > 0 && (
                      <div className="mt-4 w-full pl-10 pr-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                        <div className="flex gap-4 w-max">
                          {msg.fabrics.map(fab => (
                            <div key={fab.id} className="w-[260px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md snap-start">
                              <div className="h-32 bg-slate-100 relative cursor-pointer" onClick={() => navigate(`/shop/${fab.id}`)}>
                                {fab.image_url ? (
                                  <img src={fab.image_url} alt={fab.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400 opacity-50">✦</div>
                                )}
                                {msg.requiredMeters > 0 && (
                                  <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">
                                    Needs {msg.requiredMeters}m
                                  </div>
                                )}
                              </div>
                              <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-bold text-slate-900 text-sm truncate">{fab.name}</h3>
                                <div className="mt-2 text-xs font-bold text-slate-900">
                                  LKR {fab.price?.toLocaleString()}/m
                                </div>
                                <button 
                                  onClick={() => handleAddToCart(fab, msg.requiredMeters)}
                                  className="mt-4 w-full py-2 bg-[#F9A825] hover:bg-[#E69500] text-slate-900 font-bold text-[10px] uppercase tracking-wider transition-colors"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Provider Cards (Tailors/Designers) */}
                    {msg.providers && msg.providers.length > 0 && (
                      <div className="mt-4 w-full pl-10 pr-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                        <div className="flex gap-4 w-max">
                          {msg.providers.map(prov => (
                            <div key={prov.id} className="w-[260px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md snap-start">
                              <div className="p-4 flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A8A88E] mb-1 block">
                                      {prov.type}
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-sm">{prov.name}</h3>
                                  </div>
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-xs">
                                    {prov.name.charAt(0)}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{prov.speciality || prov.bio || "Fashion Expert"}</p>
                                <div className="mt-4 flex items-center gap-2">
                                  <span className="text-[10px] font-medium text-slate-400">{prov.location || "Colombo, SL"}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => navigate(`/${prov.type}/${prov.id}`)}
                                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-[10px] uppercase tracking-wider transition-colors"
                              >
                                View Profile
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-end gap-2 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="px-5 py-4 bg-white border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts & Chat Input */}
      <div className="bg-white border-t border-slate-200 p-4 sm:p-6 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] z-10">
        <div className="max-w-4xl mx-auto">
          {/* Quick Prompt Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(qp.label)}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
              >
                <span>{qp.icon}</span>
                {qp.label}
              </button>
            ))}
          </div>

          <form id="ai-chat-form" onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Describe what you want to make or find..."
              className="w-full pl-5 pr-14 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={!inputVal.trim() || loading}
              className={`absolute right-2 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                inputVal.trim() && !loading
                  ? 'bg-slate-900 text-white hover:bg-black shadow-md'
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
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verify all recommendations before purchasing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

