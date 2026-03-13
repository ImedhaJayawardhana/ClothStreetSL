// ── theme.css ──
:root {
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  --clr-bg:        #09090f;
  --clr-surface:   #111118;
  --clr-surface-2: #18181f;
  --clr-border:    rgba(255,255,255,0.07);
  --clr-border-2:  rgba(255,255,255,0.13);
  --clr-primary:   #7b5ef8;
  --clr-primary-2: #9b82ff;
  --clr-accent:    #ff6b6b;
  --clr-glow:      rgba(123, 94, 248, 0.35);
  --clr-text:      #f0eeff;
  --clr-text-2:    #9f9cb8;
  --clr-muted:     #555268;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;

  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* BACKGROUND */
body, #root {
  background-color: var(--clr-bg);
  color: var(--clr-text-2);
  font-family: var(--font-body);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  height: 50vh;
  background: radial-gradient(circle, var(--clr-glow) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
  opacity: 0.6;
}

body::after {
  content: "";
  position: fixed;
  bottom: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  height: 50vh;
  background: radial-gradient(circle, rgba(255, 107, 107, 0.15) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
  opacity: 0.6;
}

/* TYPOGRAPHY */
h1, h2, h3, h4 {
  font-family: var(--font-display) !important;
  font-weight: 700;
  color: var(--clr-text) !important;
}

h1 { font-weight: 800; }

p, span, li {
  font-family: var(--font-body) !important;
}

.text-muted, .hint-text {
  color: var(--clr-muted) !important;
}

/* CARDS & CONTAINERS */
.theme-card, .card {
  background: var(--clr-surface) !important;
  border: 1px solid var(--clr-border-2) !important;
  border-radius: var(--radius-lg) !important;
  transition: transform 300ms var(--ease-smooth), box-shadow 300ms var(--ease-smooth) !important;
}

.theme-card:hover, .card:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 0 15px var(--clr-glow) !important;
  border-color: var(--clr-primary) !important;
}

/* BUTTONS */
button, .theme-btn, .btn {
  background: var(--clr-surface-2) !important;
  border: 1px solid var(--clr-border-2) !important;
  color: var(--clr-text) !important;
  border-radius: var(--radius-sm) !important;
  transition: background 300ms var(--ease-smooth), box-shadow 300ms var(--ease-smooth), transform 150ms ease !important;
  cursor: pointer;
  padding: 0.5rem 1rem;
  font-family: var(--font-body);
  font-weight: 500;
}

button:hover, .theme-btn:hover, .btn:hover {
  background: rgba(123, 94, 248, 0.2) !important;
  box-shadow: 0 0 10px var(--clr-glow) !important;
  border-color: var(--clr-primary) !important;
}

button:active, .theme-btn:active, .btn:active {
  transform: scale(0.98) !important;
}

/* INPUTS & FORMS */
input, textarea, select, .theme-input, .form-control {
  background: var(--clr-surface-2) !important;
  border: 1px solid var(--clr-border-2) !important;
  color: var(--clr-text) !important;
  border-radius: var(--radius-sm) !important;
  padding: 0.5rem 1rem;
  transition: outline 300ms var(--ease-smooth), border-color 300ms var(--ease-smooth) !important;
  font-family: var(--font-body);
}

input:focus, textarea:focus, select:focus, .theme-input:focus, .form-control:focus {
  outline: 2px solid var(--clr-primary) !important;
  outline-offset: 2px !important;
  border-color: transparent !important;
}

/* LINKS */
a, .theme-link {
  color: var(--clr-primary-2) !important;
  text-decoration: none;
  transition: color 300ms var(--ease-smooth) !important;
}

a:hover, .theme-link:hover {
  color: var(--clr-text) !important;
}

/* ANIMATIONS */
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up-enter {
  animation: fadeUp 0.6s var(--ease-smooth) forwards;
}

/* A highly specific rule to make sure all page containers get the fadeUp effect */
main > div, #root > div > div {
  animation: fadeUp 0.6s var(--ease-smooth) forwards;
}

/* STAGGER CHILDREN */
/* Using nth-child to add animation delays globally */
main > div > *:nth-child(1), #root > div > div > *:nth-child(1) { animation-delay: 0.05s; }
main > div > *:nth-child(2), #root > div > div > *:nth-child(2) { animation-delay: 0.10s; }
main > div > *:nth-child(3), #root > div > div > *:nth-child(3) { animation-delay: 0.15s; }
main > div > *:nth-child(4), #root > div > div > *:nth-child(4) { animation-delay: 0.20s; }
main > div > *:nth-child(5), #root > div > div > *:nth-child(5) { animation-delay: 0.25s; }
main > div > *:nth-child(6), #root > div > div > *:nth-child(6) { animation-delay: 0.30s; }
main > div > *:nth-child(7), #root > div > div > *:nth-child(7) { animation-delay: 0.35s; }
main > div > *:nth-child(8), #root > div > div > *:nth-child(8) { animation-delay: 0.40s; }
main > div > *:nth-child(9), #root > div > div > *:nth-child(9) { animation-delay: 0.45s; }
main > div > *:nth-child(10), #root > div > div > *:nth-child(10) { animation-delay: 0.50s; }

/* GLOBALIZE TRANSITIONS */
* {
  transition: background-color 300ms var(--ease-smooth), color 300ms var(--ease-smooth), border-color 300ms var(--ease-smooth), box-shadow 300ms var(--ease-smooth), transform 300ms var(--ease-smooth);
}

/* SCROLLBAR */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--clr-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--clr-muted);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--clr-primary);
}


// ── index.html ──
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>frontend</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>


// ── app.css ──
#root {
  margin: 0;
  padding: 0;
  text-align: left;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

// ── AboutUs.jsx ──
import React from'react';
import { Link} from'react-router-dom';

export default function AboutUs() {
 return (
 <div className="min-h-screen flex flex-col font-sans">
 
 {/* ── Hero Section ── */}
 <section className="relative overflow-hidden bg-gradient-to-r from-violet-800 via-purple-700 to-indigo-800 py-24 sm:py-32">
 {/* Background decorative blobs */}
 <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
 <div className="absolute top-24 -left-24 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
 
 <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div className="max-w-2xl text-left">
 <span className="font-bold tracking-widest uppercase text-xs mb-4 block">Welcome to ClothStreet</span>
 <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 leading-tight">
 Weaving Sri Lanka's Fashion Future.
 </h1>
 <p className="mt-6 text-lg leading-8 mb-8">
 ClothStreet is the premier unified textile ecosystem designed to bring fabric suppliers, masterful tailors, visionary designers, and everyday customers together on one seamless platform.
 </p>
 <div className="flex items-center gap-x-6">
 <Link to="/register" className="rounded-xl px-8 py-3.5 text-sm font-bold shadow-sm hover: transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
 Join the Community
 </Link>
 <Link to="/shop" className="text-sm font-semibold leading-6 hover: transition-colors">
 Explore Fabrics <span aria-hidden="true">→</span>
 </Link>
 </div>
 </div>
 
 {/* Hero Images Grid */}
 <div className="hidden lg:grid grid-cols-2 gap-4">
 <div className="grid gap-4 transform translate-y-8">
 <img src="https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&q=80&w=600" alt="Tailor working" className="w-full h-64 object-cover rounded-3xl shadow-2xl border-4" />
 <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600" alt="Fabrics" className="w-full h-48 object-cover rounded-3xl shadow-xl border-4" />
 </div>
 <div className="grid gap-4">
 <img src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&q=80&w=600" alt="Design tools" className="w-full h-56 object-cover rounded-3xl shadow-xl border-4" />
 <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=600&q=80" alt="Fashion design" className="w-full h-72 object-cover rounded-3xl shadow-2xl border-4" />
 </div>
 </div>
 
 </div>
 </div>
 </section>

 {/* ── Mission & Vision ── */}
 <section className="py-24">
 <div className="mx-auto max-w-7xl px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 
 {/* Visual Side */}
 <div className="relative group">
 <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-[2.5rem] transform -rotate-3 transition-transform group-hover:-rotate-1" />
 <img src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800" alt="Tailoring workshop" className="relative rounded-3xl shadow-2xl object-cover w-full h-[500px]" />
 {/* Floating badge */}
 <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl shadow-xl flex items-center gap-4">
 <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
 {new Date().getFullYear()}
 </div>
 <div>
 <p className="text-sm font-medium">Founded In</p>
 <p className="font-bold">Sri Lanka</p>
 </div>
 </div>
 </div>

 {/* Text Side */}
 <div className="space-y-12 lg:pl-8 mt-12 lg:mt-0">
 <div className="space-y-6">
 <div className="inline-flex items-center justify-center p-3 rounded-xl mb-2">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
 </svg>
 </div>
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
 <p className="text-lg leading-relaxed">
 To digitalize and democratize the Sri Lankan custom clothing industry. We aim to empower local artisans—from textile merchants in Pettah to boutique tailors—by providing them with the digital tools necessary to thrive in a modern marketplace while giving customers unprecedented access to bespoke fashion.
 </p>
 </div>
 
 <div className="space-y-6 pt-8 border-t">
 <div className="inline-flex items-center justify-center p-3 bg-fuchsia-100 rounded-xl text-fuchsia-600 mb-2">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 </div>
 <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Vision</h3>
 <p className="text-lg leading-relaxed">
 A Sri Lanka where every individual can easily access high-quality, custom-tailored garments, and where local textile artists are globally recognized for their craftsmanship and quality. We envision a sustainable, deeply connected fashion ecosystem.
 </p>
 </div>
 </div>

 </div>
 </div>
 </section>

 {/* ── Visual Break / Quote ── */}
 <section className="py-24 bg-fuchsia-900 relative overflow-hidden">
 <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=2000" alt="Clothing background" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay" />
 <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
 <svg className="w-12 h-12 mx-auto text-fuchsia-400 mb-8 opacity-75" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
 <h2 className="text-3xl font-light italic leading-relaxed sm:text-4xl text-fuchsia-50">
"We believe that custom clothing is not just about measurements, but about connecting artists with individuals to weave their unique stories into reality."
 </h2>
 </div>
 </section>

 {/* ── Why Choose Us (Pillars) ── */}
 <section className="py-24">
 <div className="mx-auto max-w-7xl px-6 lg:px-8">
 <div className="text-center max-w-2xl mx-auto mb-16">
 <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Platform Pillars</h2>
 <p className="mt-4 text-lg">
 ClothStreet is built on three core pillars that work in harmony to deliver the ultimate custom clothing experience.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {/* Pillar 1 */}
 <div className="rounded-3xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 relative transform hover:-translate-y-4 group">
 <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
 </svg>
 </div>
 <h3 className="text-xl font-bold mb-3">Vast Fabric Marketplace</h3>
 <p className="leading-relaxed">
 Source premium materials directly from top-rated local suppliers. Compare prices, browse textures, and order fabrics effortlessly, knowing you're getting the best quality for your designs.
 </p>
 </div>

 {/* Pillar 2 */}
 <div className="rounded-3xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 relative transform hover:-translate-y-4 group">
 <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 </div>
 <h3 className="text-xl font-bold mb-3">Masterful Artisans</h3>
 <p className="leading-relaxed">
 Connect with highly skilled, verified tailors and visionary designers. Filter by specialty, read authentic customer reviews, and collaborate seamlessly to bring your custom bespoke clothing ideas to life.
 </p>
 </div>

 {/* Pillar 3 */}
 <div className="rounded-3xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 relative transform hover:-translate-y-4 group">
 <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
 </svg>
 </div>
 <h3 className="text-xl font-bold mb-3">Trust & Transparency</h3>
 <p className="leading-relaxed">
 Enjoy peace of mind with our secure quotation system, transparent order tracking, and escrow-style protection. We ensure every stitch is accounted for and every delivery meets expectation.
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* ── CTA Banner ── */}
 <section className="py-16 sm:py-24">
 <div className="mx-auto max-w-7xl px-6 lg:px-8">
 <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 rounded-3xl px-6 py-16 sm:p-20 text-center shadow-2xl relative overflow-hidden">
 {/* Soft glow behind text */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-[100px] opacity-40 mix-blend-screen pointer-events-none" />
 
 <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl mb-4">
 Ready to redefine your wardrobe?
 </h2>
 <p className="relative mx-auto mt-4 max-w-2xl text-lg leading-8 mb-10">
 Join thousands of Sri Lankans who are discovering the perfect fit. Whether you're looking to create, sew, or supply, ClothStreet is your new home.
 </p>
 <div className="relative flex items-center justify-center gap-x-6">
 <Link to="/register" className="rounded-xl px-8 py-3.5 text-sm font-bold shadow-sm hover: transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
 Get Started Today
 </Link>
 <Link to="/shop" className="text-sm font-semibold leading-6 hover: transition-colors">
 Explore Fabrics <span aria-hidden="true">→</span>
 </Link>
 </div>
 </div>
 </div>
 </section>
 
 </div>
 );
}


// ── AIMatch.jsx ──
import React, { useState} from'react';
import { Link} from'react-router-dom';
import { useCart} from'../context/CartContext';

// Mock Fallback Data
const mockResults = {
 materials: [
 { id: 1, name:'Premium Cotton Fabric', supplier:'TextileCo Lanka', price:'LKR 450/m', rating: 4.8, match: 97, color:'White'},
 { id: 2, name:'Polyester Blend', supplier:'FabricHub Colombo', price:'LKR 280/m', rating: 4.5, match: 89, color:'Blue'},
 { id: 3, name:'Organic Linen', supplier:'EcoTextile SL', price:'LKR 620/m', rating: 4.9, match: 85, color:'Beige'}
 ],
 tailors: [
 { id: 1, name:'Nimal Perera', location:'Colombo 05', experience:'12 years', rating: 4.9, match: 96, speciality:'Formal Wear'},
 { id: 2, name:'Kamala Silva', location:'Kandy', experience:'8 years', rating: 4.7, match: 91, speciality:'Traditional'},
 { id: 3, name:'Ravi Fernando', location:'Galle', experience:'15 years', rating: 4.8, match: 88, speciality:'Casual Wear'}
 ]
};

export default function AIMatch() {
 const { addToCart} = useCart();
 
 const [formData, setFormData] = useState({
 garmentType:'',
 budget: 50000,
 quantity: 100,
 quality:'Standard'
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
 method:'POST',
 headers: {'Content-Type':'application/json'},
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
 setFormData(prev => ({ ...prev, quality: value}));
};

 const handleSliderChange = (e) => {
 setFormData(prev => ({ ...prev, quantity: Number(e.target.value)}));
};

 return (
 <div className="min-h-screen flex flex-col">
 {/* Hero Section */}
 <section className="bg-gradient-to-br from-[#1a0533] to-[#2d1b69] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
 {/* Abstract Background Element for extra visual pop (optional) */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full opacity-20 pointer-events-none">
 <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-screen filter blur-[80px]"></div>
 <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full mix-blend-screen filter blur-[100px]"></div>
 </div>

 <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
 {/* Pill Badge */}
 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md mb-6 shadow-sm">
 <span className="text-sm font-semibold tracking-wide">✦ Powered by Machine Learning</span>
 </div>
 
 {/* Large Bold Heading */}
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
 AI-Powered Smart Match
 </h1>
 
 {/* Subtitle */}
 <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
 Get intelligent recommendations for fabric suppliers and tailors based on your specific project requirements
 </p>
 </div>
 </section>

 {/* Main Content Area */}
 <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
 <div className="flex flex-col lg:flex-row gap-8">
 
 {/* LEFT COLUMN - Requirements Form */}
 <div className="w-full lg:w-3/5">
 <div className="rounded-2xl shadow-sm border p-6 md:p-8">
 <h2 className="text-2xl font-bold mb-2">Your Requirements</h2>
 <p className="mb-8">Tell us about your project and our AI will find the best matches</p>

 <div className="space-y-6">
 {/* Garment Type */}
 <div>
 <label htmlFor="garmentType" className="block text-sm font-medium mb-2">
 Garment Type<span className="ml-1">*</span>
 </label>
 <select
 id="garmentType"
 value={formData.garmentType}
 onChange={(e) => setFormData({ ...formData, garmentType: e.target.value})}
 className="w-full px-4 py-3 rounded-xl border focus: focus:ring-2 focus:ring-purple-500/20 focus: transition-all outline-none appearance-none"
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
 {error && <p className="text-sm mt-1">{error}</p>}
 </div>

 {/* Total Budget */}
 <div>
 <label htmlFor="budget" className="block text-sm font-medium mb-2">Total Budget (LKR )</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium">LKR </span>
 <input
 type="number"
 id="budget"
 min="1000"
 max="10000000"
 value={formData.budget}
 onChange={(e) => setFormData({ ...formData, budget: e.target.value ? Number(e.target.value) :''})}
 className="w-full pl-12 pr-4 py-3 rounded-xl border focus: focus:ring-2 focus:ring-purple-500/20 focus: transition-all outline-none"
 />
 </div>
 <p className="text-sm mt-2">
 Estimated: ≈ LKR {pricePerPiece} per piece
 </p>
 </div>

 {/* Quantity Slider */}
 <div>
 <div className="flex justify-between items-center mb-2">
 <label htmlFor="quantity" className="block text-sm font-medium">Quantity</label>
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
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
 className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-purple-600"
 />
 <div className="flex justify-between text-xs mt-2">
 <span>10</span>
 <span>500</span>
 </div>
 </div>

 {/* Quality Toggle */}
 <div>
 <label className="block text-sm font-medium mb-2">Quality Preference</label>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 {['Budget','Standard','Premium','Luxury'].map((quality) => (
 <button
 key={quality}
 type="button"
 onClick={() => handleQualitySelect(quality)}
 className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
 formData.quality === quality
 ?' shadow-md shadow-purple-500/30 border'
 :' border hover: hover:'
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
 className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all transform ${
 loading
 ?' cursor-not-allowed'
 :'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-0.5 shadow-purple-500/30'
}`}
 >
 {loading ? (
 <>
 <div className="w-5 h-5 border-2 border-t-white rounded-full animate-spin"></div>
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
 <div className="rounded-2xl bg-gradient-to-br from-[#1a0533] to-[#2d1b69] p-6 shadow-lg overflow-hidden relative">
 <div className="absolute top-0 right-0 p-8 opacity-10">
 <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M12 2v20"></path>
 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
 </svg>
 </div>
 <div className="relative z-10">
 <div className="flex items-center gap-3 mb-4">
 <div className="p-2 rounded-lg backdrop-blur-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="">
 <path d="M12 2v20"></path>
 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
 </svg>
 </div>
 <div>
 <h3 className="font-bold text-lg">Smart AI Engine</h3>
 <p className="text-sm">Trained on 10,000+ orders</p>
 </div>
 </div>
 <div className="space-y-3">
 <div className="flex items-start gap-3">
 <div className="mt-1 bg-green-500/20 text-green-400 rounded-full p-0.5">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
 </div>
 <p className="text-sm">Best fabric types for your garment</p>
 </div>
 <div className="flex items-start gap-3">
 <div className="mt-1 bg-green-500/20 text-green-400 rounded-full p-0.5">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
 </div>
 <p className="text-sm">Most cost-effective suppliers</p>
 </div>
 <div className="flex items-start gap-3">
 <div className="mt-1 bg-green-500/20 text-green-400 rounded-full p-0.5">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
 </div>
 <p className="text-sm">Top-rated tailors with relevant experience</p>
 </div>
 <div className="flex items-start gap-3">
 <div className="mt-1 bg-green-500/20 text-green-400 rounded-full p-0.5">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
 </div>
 <p className="text-sm">Optimized quantities to reduce waste</p>
 </div>
 </div>
 </div>
 </div>

 {/* How It Works Card */}
 <div className="rounded-2xl border p-6 shadow-sm">
 <div className="flex items-center gap-3 mb-5">
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="">
 <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
 </svg>
 <h3 className="font-bold text-lg">How It Works</h3>
 </div>
 
 <div className="space-y-4">
 <div className="flex gap-4">
 <div className="flex-shrink-0 mt-1">
 <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
 </div>
 <div>
 <h4 className="font-semibold">🎯 Enter your project requirements</h4>
 <p className="text-sm mt-1">Specify your garment, budget, and desired quality.</p>
 </div>
 </div>
 
 <div className="flex gap-4">
 <div className="flex-shrink-0 mt-1">
 <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
 </div>
 <div>
 <h4 className="font-semibold">📈 AI analyzes market data & past orders</h4>
 <p className="text-sm mt-1">Our engine matches your needs against 10,000+ data points.</p>
 </div>
 </div>
 
 <div className="flex gap-4">
 <div className="flex-shrink-0 mt-1">
 <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">3</div>
 </div>
 <div>
 <h4 className="font-semibold">💡 Receive personalized matches</h4>
 <p className="text-sm mt-1">Get instant curated lists of fabrics and expert tailors.</p>
 </div>
 </div>
 </div>
 </div>

 {/* Trust Badge Card */}
 <div className="rounded-2xl p-6 shadow-lg">
 <div className="flex items-center gap-2 mb-3">
 <div className="flex text-yellow-400">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
 </div>
 <h3 className="font-bold text-lg">Trusted by 5,000+ businesses</h3>
 </div>
 <p className="text-sm leading-relaxed">
 AI has helped ClothStreet businesses save an average of <strong className="">23% on procurement costs</strong> and reduce sourcing time by <strong className="">65%</strong>.
 </p>
 </div>
 </div>
 
 </div>

 {/* RESULTS SECTION */}
 {loading && (
 <div className="mt-16 flex flex-col items-center justify-center py-12">
 <div className="w-12 h-12 border-4 border-t-purple-600 rounded-full animate-spin mb-4"></div>
 <p className="font-medium">Analyzing market data & past orders...</p>
 </div>
 )}

 {results && !loading && (
 <div className="mt-16 animate-fade-in-up">
 <div className="text-center mb-10">
 <h2 className="text-3xl font-bold">Your Perfect Matches</h2>
 <p className="mt-2">We found the best suppliers and tailors for your specific requirements.</p>
 </div>

 {/* Materials Subsection */}
 <div className="mb-12">
 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
 <span className="p-2 rounded-lg">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
 </span>
 Recommended Materials
 </h3>
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {results.materials.map((material) => (
 <div key={material.id} className="rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
 <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
 material.match >= 90 ?'bg-green-100 text-green-700' :
 material.match >= 75 ?'bg-yellow-100 text-yellow-700' :
''
}`}>
 {material.match}% Match
 </div>
 
 <h4 className="font-bold text-lg pr-16">{material.name}</h4>
 <p className="text-sm mb-4">{material.supplier}</p>
 
 <div className="flex gap-4 mb-6">
 <div className="flex items-center gap-1 text-sm font-medium">
 <span className="text-yellow-400">⭐</span> {material.rating}
 </div>
 <div className="text-sm font-medium border-l pl-4">
 {material.price}
 </div>
 <div className="text-sm border-l pl-4">
 {material.color}
 </div>
 </div>
 
 <div className="flex gap-3 mt-4">
 <Link
 to="/shop"
 className="flex-1 text-center py-2.5 px-3 rounded-xl hover: font-medium transition-colors text-sm"
 >
 View Details
 </Link>
 <button
 onClick={() => addToCart({ ...material, unitPrice: parseInt(material.price.replace(/\D/g,'')), quantity: 1, type:'fabric', image:'https://images.unsplash.com/photo-1605000578643-4f9339e07fb6?auto=format&fit=crop&q=80&w=400'})}
 className="flex-1 py-2.5 px-3 rounded-xl hover: font-medium transition-colors text-sm shadow-sm"
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
 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
 <span className="p-2 rounded-lg">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
 </span>
 Recommended Tailors
 </h3>
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {results.tailors.map((tailor) => (
 <div key={tailor.id} className="rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
 <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
 tailor.match >= 90 ?'bg-green-100 text-green-700' :
 tailor.match >= 75 ?'bg-yellow-100 text-yellow-700' :
''
}`}>
 {tailor.match}% Match
 </div>
 
 <h4 className="font-bold text-lg pr-16">{tailor.name}</h4>
 <p className="text-sm mb-4">{tailor.location}</p>
 
 <div className="flex gap-4 mb-6">
 <div className="flex items-center gap-1 text-sm font-medium">
 <span className="text-yellow-400">⭐</span> {tailor.rating}
 </div>
 <div className="text-sm font-medium border-l pl-4">
 {tailor.experience}
 </div>
 <div className="text-sm border-l pl-4">
 {tailor.speciality}
 </div>
 </div>
 
 <Link
 to={`/tailors`}
 className="block text-center w-full py-2.5 px-4 rounded-xl hover: hover: font-medium transition-colors text-sm"
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


// ── BrowseDesigners.jsx ──
import { useState} from'react';
import DesignerCard from'../components/common/DesignerCard';
import designersData from'../data/designersData';

export default function BrowseDesigners() {
 const [searchQuery, setSearchQuery] = useState('');
 const [availableOnly, setAvailableOnly] = useState(false);
 const [activeStyle, setActiveStyle] = useState('All');

 const STYLES = [
'All Styles','Bridal Couture','Evening Wear','Traditional Wear',
'Handloom Designs','Streetwear','Urban Fashion',
'Resort Wear','Swimwear','Corporate Wear','Uniforms',
'Kids Wear','Playful Prints'
 ];

 // ── Filtering logic ──
 const filteredDesigners = designersData.filter(designer => {
 const query = searchQuery.toLowerCase();
 const matchesSearch =
 designer.name.toLowerCase().includes(query) ||
 designer.location.toLowerCase().includes(query) ||
 designer.styles.some(s => s.toLowerCase().includes(query));

 const matchesAvailable = availableOnly ? designer.status ==='Available' : true;

 const matchesStyle = activeStyle ==='All'
 || designer.specialties.includes(activeStyle)
 || designer.styles.includes(activeStyle);

 return matchesSearch && matchesAvailable && matchesStyle;
});

 return (
 <div className="min-h-screen">

 {/* ───────────── HERO BANNER ───────────── */}
 <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-20 px-4">
 {/* Decorative blurred orbs */}
 <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" />

 <div className="max-w-7xl mx-auto text-center relative z-10">
 {/* Label pill */}
 <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-5">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
 </svg>
 Creative Network
 </span>

 {/* Heading */}
 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
 Find Expert{''}
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

 {/* ───────────── SEARCH BAR ROW ───────────── */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
 <div className="rounded-2xl shadow-xl shadow-gray-200/60 border p-4 sm:p-5">
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
 {/* Search input */}
 <div className="relative flex-1">
 <div className="absolute left-4 top-1/2 -translate-y-1/2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </div>
 <input
 type="text"
 placeholder="Search by name, location, or style..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full border focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl pl-12 pr-4 py-3 text-sm placeholder-gray-400 outline-none transition-all duration-200"
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery('')}
 className="absolute right-3 top-1/2 -translate-y-1/2 hover: transition-colors"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 )}
 </div>

 {/* Available Now toggle */}
 <button
 onClick={() => setAvailableOnly(!availableOnly)}
 className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
 availableOnly
 ?'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm shadow-emerald-100'
 :' hover: hover:'
}`}
 >
 <span className={`w-2 h-2 rounded-full transition-colors duration-200 ${
 availableOnly ?'bg-emerald-500' :''
}`} />
 Available Now
 </button>
 </div>
 </div>
 </div>

 {/* ───────────── STYLE FILTER PILLS ───────────── */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
 <div className="flex flex-wrap items-center gap-2">
 {STYLES.map((style) => {
 const key = style ==='All Styles' ?'All' : style;
 const isActive = activeStyle === key;
 return (
 <button
 key={style}
 onClick={() => setActiveStyle(key)}
 className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
 isActive
 ?'bg-rose-600 border-rose-600 shadow-md shadow-rose-200'
 :' hover:border-violet-300 hover:text-violet-600'
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
 <p className="text-sm">
 <span className="font-semibold">{filteredDesigners.length}</span> designers found
 </p>
 </div>

 {/* ───────────── DESIGNERS GRID ───────────── */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
 {filteredDesigners.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
 {filteredDesigners.map(designer => (
 <DesignerCard key={designer.id} designer={designer} />
 ))}
 </div>
 ) : (
 <div className="rounded-3xl border border-dashed p-12 text-center mt-6">
 <div className="w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </div>
 <h3 className="text-lg font-bold mb-2">No designers found</h3>
 <p className="max-w-sm mx-auto mb-6">
 We couldn't find any designers matching your current filters. Try adjusting your search or clearing filters.
 </p>
 <button
 onClick={() => {
 setSearchQuery('');
 setAvailableOnly(false);
 setActiveStyle('All');
}}
 className="inline-flex items-center gap-2 px-5 py-2.5 border hover: text-sm font-semibold rounded-xl transition-colors shadow-sm"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
 </svg>
 Clear all filters
 </button>
 </div>
 )}
 </div>

 </div>
 );
}


// ── BrowseMaterials.jsx ──
import { useState, useMemo} from"react";
import { Link, useNavigate} from"react-router-dom";
import { useCart} from"../context/CartContext";
import"./BrowseMaterials.css";

/* ─── Sample fabric data ──────────────────────────────────── */
const FABRICS = [
 {
 id:"fab_001",
 name:"Premium Cotton Twill",
 type:"Cotton",
 supplier:"Lanka Fabrics Co. · Pettah",
 rating: 4.8,
 colors: ["#1e293b","#991b1b","#1e3a5f"],
 price: 850,
 minOrder: 50,
 location:"Pettah",
 badge:"new",
 inStock: true,
 bgColor:"#d4c5a9",
},
 {
 id:"fab_002",
 name:"Silk Satin Blend",
 type:"Silk",
 supplier:"Royal Fabrics Ltd. · Panadura",
 rating: 4.9,
 colors: ["#f5f5dc","#c084fc","#ec4899","#60a5fa","#facc15","#a3e635"],
 price: 2300,
 minOrder: 30,
 location:"Panadura",
 badge:"popular",
 inStock: true,
 bgColor:"#e8d5c4",
},
 {
 id:"fab_003",
 name:"Linen Canvas",
 type:"Linen",
 supplier:"Natural Fibers · Pettah",
 rating: 4.7,
 colors: ["#1e293b","#78716c","#d6d3d1"],
 price: 1200,
 minOrder: 40,
 location:"Pettah",
 badge: null,
 inStock: true,
 bgColor:"#c8bfa9",
},
 {
 id:"fab_004",
 name:"Polyester Georgette",
 type:"Polyester",
 supplier:"Modern Textiles · Colombo",
 rating: 4.5,
 colors: ["#c084fc","#ec4899","#f472b6","#a78bfa","#818cf8","#fb923c"],
 price: 650,
 minOrder: 80,
 location:"Colombo",
 badge: null,
 inStock: true,
 bgColor:"#d5c4d9",
},
 {
 id:"fab_005",
 name:"Denim Heavy Weight",
 type:"Denim",
 supplier:"Blue Star Fabrics · Pettah",
 rating: 4.8,
 colors: ["#1e3a5f","#2563eb","#3b82f6"],
 price: 950,
 minOrder: 65,
 location:"Pettah",
 badge: null,
 inStock: true,
 bgColor:"#8ba4c4",
},
 {
 id:"fab_006",
 name:"Chiffon Deluxe",
 type:"Chiffon",
 supplier:"Elegant Fabrics · Panadura",
 rating: 4.6,
 colors: ["#f9a8d4","#c084fc","#f472b6","#fda4af","#fb923c","#fbbf24"],
 price: 1800,
 minOrder: 25,
 location:"Panadura",
 badge:"out-of-stock",
 inStock: false,
 bgColor:"#f0ccd4",
},
 {
 id:"fab_007",
 name:"Wool Blend Suiting",
 type:"Wool",
 supplier:"Premium Cloths · Colombo",
 rating: 4.8,
 colors: ["#1e293b","#374151","#6b7280"],
 price: 1250,
 minOrder: 20,
 location:"Colombo",
 badge: null,
 inStock: true,
 bgColor:"#b8a99a",
},
 {
 id:"fab_008",
 name:"Rayon Printed",
 type:"Rayon",
 supplier:"Color Works Textiles · Pettah",
 rating: 4.4,
 colors: ["#c084fc","#a78bfa","#818cf8"],
 price: 780,
 minOrder: 55,
 location:"Pettah",
 badge: null,
 inStock: true,
 bgColor:"#c7b8d4",
},
];

const FABRIC_TYPES = [
"Cotton",
"Silk",
"Linen",
"Polyester",
"Denim",
"Chiffon",
"Wool",
"Rayon",
];

const LOCATIONS = [
"Pettah",
"Panadura",
"Colombo",
"Kandy",
"Galle",
"Negombo",
];

/* ─── Component ───────────────────────────────────────────── */
export default function BrowseMaterials() {
 const { addToCart} = useCart();
 const navigate = useNavigate();

 // Search
 const [searchQuery, setSearchQuery] = useState("");

 // Filters
 const [selectedTypes, setSelectedTypes] = useState([]);
 const [selectedLocations, setSelectedLocations] = useState([]);
 const [maxPrice, setMaxPrice] = useState(5000);
 const [maxMinOrder, setMaxMinOrder] = useState(100);

 // Mobile sidebar toggle
 const [sidebarOpen, setSidebarOpen] = useState(false);

 /* ── Toggle helpers ── */
 function toggleType(type) {
 setSelectedTypes((prev) =>
 prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
 );
}

 function toggleLocation(loc) {
 setSelectedLocations((prev) =>
 prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
 );
}

 /* ── Filtered fabrics ── */
 const filteredFabrics = useMemo(() => {
 return FABRICS.filter((fab) => {
 // Search
 if (
 searchQuery &&
 !fab.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
 !fab.supplier.toLowerCase().includes(searchQuery.toLowerCase()) &&
 !fab.type.toLowerCase().includes(searchQuery.toLowerCase())
 ) {
 return false;
}
 // Fabric type
 if (selectedTypes.length > 0 && !selectedTypes.includes(fab.type)) {
 return false;
}
 // Location
 if (
 selectedLocations.length > 0 &&
 !selectedLocations.includes(fab.location)
 ) {
 return false;
}
 // Price
 if (fab.price > maxPrice) return false;
 // Min order
 if (fab.minOrder > maxMinOrder) return false;

 return true;
});
}, [searchQuery, selectedTypes, selectedLocations, maxPrice, maxMinOrder]);

 /* ── Add to cart handler ── */
 function handleAddToCart(fab) {
 addToCart({
 id: fab.id,
 name: fab.name,
 unitPrice: fab.price,
 quantity: 1,
});
}

 return (
 <div>
 {/* ============ Hero Header ============ */}
 <section className="bm-hero">
 <div className="bm-hero-inner">
 <div className="bm-breadcrumb">
 <Link to="/">
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="14"
 height="14"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
 <polyline points="9 22 9 12 15 12 15 22" />
 </svg>
 </Link>
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="12"
 height="12"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="m9 18 6-6-6-6" />
 </svg>
 <span>Fabric Marketplace</span>
 </div>

 <h1 className="bm-hero-title">Browse Premium Fabrics</h1>
 <p className="bm-hero-subtitle">
 Connect with 8+ verified fabric suppliers across Sri Lanka
 </p>
 </div>
 </section>

 {/* ============ Search Bar ============ */}
 <div className="bm-search-wrap">
 <div className="bm-search-bar">
 <svg
 className="bm-search-icon"
 xmlns="http://www.w3.org/2000/svg"
 width="18"
 height="18"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <circle cx="11" cy="11" r="8" />
 <path d="m21 21-4.3-4.3" />
 </svg>
 <input
 type="text"
 placeholder="Search fabrics, suppliers..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 id="bm-search-input"
 />
 <button
 className="bm-filter-btn"
 onClick={() => setSidebarOpen((prev) => !prev)}
 id="bm-filter-toggle"
 >
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <line x1="4" x2="4" y1="21" y2="14" />
 <line x1="4" x2="4" y1="10" y2="3" />
 <line x1="12" x2="12" y1="21" y2="12" />
 <line x1="12" x2="12" y1="8" y2="3" />
 <line x1="20" x2="20" y1="21" y2="16" />
 <line x1="20" x2="20" y1="12" y2="3" />
 <line x1="2" x2="6" y1="14" y2="14" />
 <line x1="10" x2="14" y1="8" y2="8" />
 <line x1="18" x2="22" y1="16" y2="16" />
 </svg>
 Filters
 </button>
 </div>
 </div>

 {/* ============ Main Content ============ */}
 <div className="bm-main">
 {/* ── Sidebar ── */}
 <aside
 className={`bm-sidebar ${sidebarOpen ?"bm-sidebar-visible" :"bm-sidebar-hidden"}`}
 id="bm-sidebar"
 >
 <h2 className="bm-sidebar-title">Filters</h2>

 {/* Fabric Type */}
 <div className="bm-filter-group">
 <div className="bm-filter-label">Fabric Type</div>
 <div className="bm-checkbox-list">
 {FABRIC_TYPES.map((type) => (
 <label className="bm-checkbox-item" key={type}>
 <input
 type="checkbox"
 checked={selectedTypes.includes(type)}
 onChange={() => toggleType(type)}
 />
 {type}
 </label>
 ))}
 </div>
 </div>

 {/* Location */}
 <div className="bm-filter-group">
 <div className="bm-filter-label">Location</div>
 <div className="bm-checkbox-list">
 {LOCATIONS.map((loc) => (
 <label className="bm-checkbox-item" key={loc}>
 <input
 type="checkbox"
 checked={selectedLocations.includes(loc)}
 onChange={() => toggleLocation(loc)}
 />
 {loc}
 </label>
 ))}
 </div>
 </div>

 {/* Price Per Meter */}
 <div className="bm-filter-group">
 <div className="bm-filter-label">Price Per Meter</div>
 <input
 type="range"
 className="bm-range-track"
 min={0}
 max={5000}
 step={50}
 value={maxPrice}
 onChange={(e) => setMaxPrice(Number(e.target.value))}
 id="bm-price-range"
 />
 <div className="bm-range-values">
 <span className="bm-range-val">LKR 0</span>
 <span className="bm-range-val">LKR {maxPrice.toLocaleString()}</span>
 </div>
 </div>

 {/* Min Order */}
 <div className="bm-filter-group">
 <div className="bm-filter-label">Min Order (Meters)</div>
 <input
 type="range"
 className="bm-range-track"
 min={0}
 max={200}
 step={5}
 value={maxMinOrder}
 onChange={(e) => setMaxMinOrder(Number(e.target.value))}
 id="bm-min-order-range"
 />
 <div className="bm-range-values">
 <span className="bm-range-val">0m</span>
 <span className="bm-range-val">{maxMinOrder}m</span>
 </div>
 </div>
 </aside>

 {/* ── Product Grid ── */}
 <div className="bm-content">
 <p className="bm-result-count">
 <strong>{filteredFabrics.length}</strong> fabrics found
 </p>

 <div className="bm-grid">
 {filteredFabrics.map((fab) => (
 <div
 className="bm-card"
 key={fab.id}
 id={`card-${fab.id}`}
 onClick={() => navigate(`/shop/${fab.id}`)}
 style={{ cursor:"pointer"}}
 >
 {/* Image */}
 <div className="bm-card-image-wrap">
 <div
 className="bm-card-image-placeholder"
 style={{ background: fab.bgColor}}
 >
 ✦ {fab.name}
 </div>

 {/* Wishlist */}
 <button className="bm-card-wishlist" aria-label="Add to wishlist">
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
 </svg>
 </button>

 {/* Badge */}
 {fab.badge && (
 <span
 className={`bm-card-badge ${
 fab.badge ==="new"
 ?"bm-badge-new"
 : fab.badge ==="popular"
 ?"bm-badge-popular"
 : fab.badge ==="out-of-stock"
 ?"bm-badge-out-of-stock"
 :""
}`}
 >
 {fab.badge ==="out-of-stock"
 ?"Out of Stock"
 : fab.badge.charAt(0).toUpperCase() + fab.badge.slice(1)}
 </span>
 )}
 </div>

 {/* Body */}
 <div className="bm-card-body">
 <div className="bm-card-type">{fab.type}</div>

 <div className="bm-card-header">
 <h3 className="bm-card-name">{fab.name}</h3>
 <div className="bm-card-rating">
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="14"
 height="14"
 viewBox="0 0 24 24"
 fill="#facc15"
 stroke="#facc15"
 strokeWidth="1"
 >
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 {fab.rating}
 </div>
 </div>

 <div className="bm-card-supplier">
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="12"
 height="12"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
 {fab.supplier}
 </div>

 {/* Color Swatches */}
 <div className="bm-swatches">
 {fab.colors.map((color, i) => (
 <span
 key={i}
 className="bm-swatch"
 style={{ background: color}}
 title={color}
 />
 ))}
 </div>

 {/* Price / Min Order */}
 <div className="bm-card-meta">
 <div className="bm-meta-item">
 <span className="bm-meta-label">Price/meter</span>
 <span className="bm-meta-value bm-price-highlight">
 LKR {fab.price.toLocaleString()}
 </span>
 </div>
 <div className="bm-meta-item">
 <span className="bm-meta-label">Min Order</span>
 <span className="bm-meta-value">{fab.minOrder} m</span>
 </div>
 </div>

 {/* Add to Cart */}
 <button
 className="bm-add-cart-btn"
 disabled={!fab.inStock}
 onClick={(e) => { e.stopPropagation(); handleAddToCart(fab);}}
 id={`add-cart-${fab.id}`}
 >
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <circle cx="8" cy="21" r="1" />
 <circle cx="19" cy="21" r="1" />
 <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
 </svg>
 {fab.inStock ?"Add to Cart" :"Out of Stock"}
 </button>
 </div>
 </div>
 ))}
 </div>

 {filteredFabrics.length === 0 && (
 <div
 style={{
 textAlign:"center",
 padding:"3rem 1rem",
 color:"#6b7280",
}}
 >
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="48"
 height="48"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="1.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 style={{ margin:"0 auto 1rem", opacity: 0.4}}
 >
 <circle cx="11" cy="11" r="8" />
 <path d="m21 21-4.3-4.3" />
 </svg>
 <p style={{ fontSize:"1.1rem", fontWeight: 600}}>
 No fabrics found
 </p>
 <p style={{ fontSize:"0.85rem"}}>
 Try adjusting your filters or search terms.
 </p>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}


// ── BrowseTailors.jsx ──
import React, { useState, useEffect} from'react';
import { collection, getDocs, doc, setDoc} from'firebase/firestore';
import { db} from'../firebase/firebase';
import { useNavigate} from'react-router-dom';

export default function BrowseTailors() {
 const navigate = useNavigate();
 const [searchQuery, setSearchQuery] = useState('');
 const [availableOnly, setAvailableOnly] = useState(false);
 const [activeSpecialization, setActiveSpecialization] = useState('All');
 const [tailors, setTailors] = useState([]);
 const [loading, setLoading] = useState(true);
 const [contactTailor, setContactTailor] = useState(null);

 useEffect(() => {
 async function fetchTailors() {
 try {
 const querySnapshot = await getDocs(collection(db,"tailors"));
 const tailorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
 setTailors(tailorsData);
} catch (error) {
 console.error("Error fetching tailors:", error);
} finally {
 setLoading(false);
}
}
 fetchTailors();
}, []);

 const handleAddMockData = async () => {
 setLoading(true);
 const mockTailors = [
 {
 name:"Kamal Perera",
 location:"Colombo 07",
 specializations: ["Bespoke Suits","Formal Wear"],
 skills: ["Suit Tailoring","Pattern Drafting","Alterations"],
 rating: 4.9,
 orders: 487,
 experience: 15,
 priceMin: 15000,
 priceMax: 45000,
 status:"Available",
 portfolioImages: [
"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=500&q=80",
"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80"
 ]
},
 {
 name:"Samanthi Silva",
 location:"Kandy",
 specializations: ["Wedding Dresses","Evening Gowns"],
 skills: ["Bridal Wear","Embroidery","Beading","Custom Fitting"],
 rating: 4.8,
 orders: 312,
 experience: 10,
 priceMin: 25000,
 priceMax: 150000,
 status:"Busy",
 portfolioImages: [
"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
"https://images.unsplash.com/photo-1566207274740-0f8cf6b7d5a5?auto=format&fit=crop&w=500&q=80"
 ]
},
 {
 name:"Ruwan Textiles",
 location:"Galle",
 specializations: ["Casual Wear","Shirts","Traditional Wear"],
 skills: ["Cotton Shirts","Sarongs","Bulk Orders"],
 rating: 4.6,
 orders: 850,
 experience: 8,
 priceMin: 2500,
 priceMax: 10000,
 status:"Available",
 portfolioImages: [
"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80",
"https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=500&q=80"
 ]
}
 ];

 try {
 for (const tailor of mockTailors) {
 const newDocRef = doc(collection(db,"tailors"));
 await setDoc(newDocRef, tailor);
}
 const querySnapshot = await getDocs(collection(db,"tailors"));
 const tailorsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data()}));
 setTailors(tailorsData);
 setSearchQuery('');
 setAvailableOnly(false);
 setActiveSpecialization('All');
} catch (error) {
 console.error("Error adding mock data", error);
} finally {
 setLoading(false);
}
};

 const filteredTailors = tailors.filter(tailor => {
 const matchesSearch =
 tailor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 tailor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 tailor.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

 const matchesAvailable = availableOnly ? tailor.status ==='Available' : true;
 const matchesSpecialization = activeSpecialization ==='All' || tailor.specializations?.includes(activeSpecialization);

 return matchesSearch && matchesAvailable && matchesSpecialization;
});

 const SPECIALIZATIONS = [
'All Specializations','Bespoke Suits','Formal Wear','Wedding Dresses',
'Evening Gowns','Casual Wear','Shirts','Kids Clothing',
'School Uniforms','Traditional Wear','Sarongs','Blouses','Saree Fitting'
 ];

 return (
 <div className="min-h-screen">

 {/* ───────────── HERO BANNER ───────────── */}
 <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-20 px-4">
 {/* Decorative blurred orbs */}
 <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" />

 <div className="max-w-7xl mx-auto text-center relative z-10">
 {/* Label pill */}
 <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-5">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 Professional Network
 </span>

 {/* Heading */}
 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
 Find Expert{''}
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

 {/* ───────────── SEARCH BAR ROW ───────────── */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
 <div className="rounded-2xl shadow-xl shadow-gray-200/60 border p-4 sm:p-5">
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
 {/* Search input */}
 <div className="relative flex-1">
 <div className="absolute left-4 top-1/2 -translate-y-1/2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </div>
 <input
 type="text"
 placeholder="Search by name, location, or skill..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full border focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl pl-12 pr-4 py-3 text-sm placeholder-gray-400 outline-none transition-all duration-200"
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery('')}
 className="absolute right-3 top-1/2 -translate-y-1/2 hover: transition-colors"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 )}
 </div>

 {/* Available Now toggle */}
 <button
 onClick={() => setAvailableOnly(!availableOnly)}
 className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
 availableOnly
 ?'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm shadow-emerald-100'
 :' hover: hover:'
}`}
 >
 <span className={`w-2 h-2 rounded-full transition-colors duration-200 ${
 availableOnly ?'bg-emerald-500' :''
}`} />
 Available Now
 </button>
 </div>
 </div>
 </div>

 {/* ───────────── SPECIALIZATION FILTER PILLS ───────────── */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
 <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
 {SPECIALIZATIONS.map((spec) => {
 const key = spec ==='All Specializations' ?'All' : spec;
 const isActive = activeSpecialization === key;
 return (
 <button
 key={spec}
 onClick={() => setActiveSpecialization(key)}
 className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
 isActive
 ?'bg-violet-600 border-violet-600 shadow-md shadow-violet-200'
 :' hover:border-violet-300 hover:text-violet-600'
}`}
 >
 {spec}
 </button>
 );
})}
 </div>
 </div>

 {/* ───────────── RESULTS COUNT ───────────── */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
 <p className="text-sm">
 <span className="font-semibold">{loading ?'...' : filteredTailors.length}</span> tailors found
 </p>
 </div>

 {/* ───────────── TAILORS GRID ───────────── */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
 {loading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
 {[1, 2, 3, 4, 5, 6].map(i => (
 <div key={i} className="rounded-3xl border overflow-hidden shadow-sm animate-pulse">
 <div className="h-48"></div>
 <div className="p-6 space-y-4">
 <div className="h-6 rounded-md w-2/3"></div>
 <div className="h-4 rounded-md w-1/3"></div>
 <div className="flex gap-2">
 <div className="h-6 w-16 rounded-full"></div>
 <div className="h-6 w-20 rounded-full"></div>
 </div>
 <div className="h-10 rounded-xl w-full mt-4"></div>
 </div>
 </div>
 ))}
 </div>
 ) : filteredTailors.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
 {filteredTailors.map(tailor => (
 <div key={tailor.id} className="rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-100 transition-all duration-300 group flex flex-col">
 
 {/* Header Image Area */}
 <div className="relative h-48 overflow-hidden">
 <div className="absolute inset-0 flex">
 <div className="w-3/5 h-full">
 <img src={tailor.portfolioImages?.[0] ||'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=500&q=80'} alt="Portfolio 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 </div>
 <div className="w-2/5 h-full border-l">
 <img src={tailor.portfolioImages?.[1] ||'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=500&q=80'} alt="Portfolio 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 delay-75" />
 </div>
 </div>

 {/* Badges Overlay */}
 <div className="absolute inset-x-0 bottom-0 p-3 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent">
 <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
 tailor.status ==='Available' ?'bg-emerald-500/90' :''
}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${tailor.status ==='Available' ?'' :''}`}></span>
 {tailor.status ||'Busy'}
 </div>
 <div className="backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
 +{tailor.portfolioImages?.length > 2 ? tailor.portfolioImages.length - 2 : 4} works
 </div>
 </div>
 
 {/* Star Rating Badge */}
 <div className="absolute top-3 right-3 backdrop-blur-md shadow-sm px-2 py-1 rounded-lg flex items-center gap-1">
 <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
 </svg>
 <span className="text-xs font-bold">{tailor.rating?.toFixed(1) ||'4.8'}</span>
 </div>
 </div>

 {/* Body */}
 <div className="p-6 flex flex-col flex-grow">
 <div className="mb-4">
 <h3 className="text-xl font-bold mb-1 line-clamp-1">{tailor.name}</h3>
 <div className="flex items-center text-sm">
 <svg className="w-4 h-4 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 <span className="line-clamp-1">{tailor.location}</span>
 </div>
 </div>

 {/* Specializations & Skills */}
 <div className="mb-5 flex-grow">
 <div className="flex flex-wrap gap-2 mb-3">
 {tailor.specializations?.slice(0, 2).map((spec, idx) => (
 <span key={idx} className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-100">
 {spec}
 </span>
 ))}
 </div>
 <p className="text-xs leading-relaxed line-clamp-2">
 <span className="font-semibold">Expertise:</span> {tailor.skills?.slice(0, 3).join(',')}
 {tailor.skills?.length > 3 &&` +${tailor.skills.length - 3} more`}
 </p>
 </div>

 {/* Stats Boxes */}
 <div className="grid grid-cols-2 gap-3 mb-5">
 <div className="p-3 rounded-xl border">
 <div className="mb-1">
 <svg className="w-4 h-4" autoFocus fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
 </svg>
 </div>
 <div className="text-sm font-bold">{tailor.orders || 0}+</div>
 <div className="text-[10px] uppercase tracking-wider font-medium mt-0.5">Orders</div>
 </div>
 <div className="p-3 rounded-xl border">
 <div className="mb-1">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <div className="text-sm font-bold">{tailor.experience || 0} yrs</div>
 <div className="text-[10px] uppercase tracking-wider font-medium mt-0.5">Experience</div>
 </div>
 </div>

 {/* Price Range & Actions */}
 <div className="pt-4 border-t mt-auto">
 <div className="flex items-center justify-between mb-4">
 <span className="text-xs font-medium">Starting from</span>
 <span className="text-sm font-bold">
 LKR {tailor.priceMin?.toLocaleString() ||'1,500'}
 </span>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => navigate(`/tailor/${tailor.id}`)}
 className="w-full py-2.5 px-3 bg-violet-600 hover:bg-violet-700 text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-violet-200 flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 Portfolio
 </button>
 <button
 onClick={() => setContactTailor(tailor)}
 className="w-full py-2.5 px-3 border hover: hover: text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
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
 <div className="rounded-3xl border border-dashed p-12 text-center mt-6">
 <div className="w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </div>
 <h3 className="text-lg font-bold mb-2">No tailors found</h3>
 <p className="max-w-sm mx-auto mb-6">
 We couldn't find any professionals matching your current filters. Try adjusting your search or clearing filters.
 </p>
 <button 
 onClick={() => {
 setSearchQuery('');
 setAvailableOnly(false);
 setActiveSpecialization('All');
}}
 className="inline-flex items-center gap-2 px-5 py-2.5 border hover: text-sm font-semibold rounded-xl transition-colors shadow-sm"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
 </svg>
 Clear all filters
 </button>
 <button 
 onClick={handleAddMockData}
 className="inline-flex items-center gap-2 px-5 py-2.5 mt-4 sm:mt-0 sm:ml-4 bg-violet-600 hover:bg-violet-700 text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-violet-200"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
 </svg>
 </button>
 </div>
 )}
 </div>

 {/* ────────── CONTACT MODAL ────────── */}
 {contactTailor && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setContactTailor(null)}>
 <div className="absolute inset-0 backdrop-blur-sm" />
 <div
 className="relative rounded-3xl shadow-2xl max-w-sm w-full p-6"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Close button */}
 <button
 onClick={() => setContactTailor(null)}
 className="absolute top-4 right-4 w-8 h-8 hover: rounded-full flex items-center justify-center transition-colors"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>

 {/* Header */}
 <div className="flex items-center gap-3 mb-6">
 <img
 src={contactTailor.portfolioImages?.[0] ||'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=100&q=80'}
 alt={contactTailor.name}
 className="w-12 h-12 rounded-full object-cover border-2 border-violet-100"
 />
 <div>
 <h3 className="font-bold">{contactTailor.name}</h3>
 <p className="text-sm">{contactTailor.location}</p>
 </div>
 </div>

 <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Get in touch</h4>

 {/* Contact options */}
 <div className="space-y-3">
 {/* Phone */}
 <a
 href={`tel:${contactTailor.phone ||'+94770000000'}`}
 className="flex items-center gap-3 p-3 hover: border hover: rounded-xl transition-all duration-200 group/link"
 >
 <div className="w-10 h-10 group-hover/link: rounded-lg flex items-center justify-center transition-colors">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
 </svg>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold">Call Now</p>
 <p className="text-xs truncate">{contactTailor.phone ||'+94770000000'}</p>
 </div>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </a>

 {/* WhatsApp */}
 <a
 href={`https://wa.me/${(contactTailor.phone ||'+94770000000').replace('+','')}?text=Hi ${encodeURIComponent(contactTailor.name)}, I found your profile on ClothStreet and I'd like to discuss a tailoring project.`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-3 p-3 hover:bg-emerald-50 border hover:border-emerald-200 rounded-xl transition-all duration-200 group/link"
 >
 <div className="w-10 h-10 bg-emerald-100 group-hover/link:bg-emerald-200 rounded-lg flex items-center justify-center transition-colors">
 <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
 </svg>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold">WhatsApp</p>
 <p className="text-xs truncate">Chat on WhatsApp</p>
 </div>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </a>

 {/* View Profile */}
 <button
 onClick={() => {
 setContactTailor(null);
 navigate(`/tailor/${contactTailor.id}`);
}}
 className="w-full flex items-center gap-3 p-3 hover:bg-violet-50 border hover:border-violet-200 rounded-xl transition-all duration-200 group/link"
 >
 <div className="w-10 h-10 bg-violet-100 group-hover/link:bg-violet-200 rounded-lg flex items-center justify-center transition-colors">
 <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
 </svg>
 </div>
 <div className="flex-1 min-w-0 text-left">
 <p className="text-sm font-semibold">View Full Profile</p>
 <p className="text-xs truncate">See portfolio & reviews</p>
 </div>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}


// ── Cart.jsx ──
import { Link} from"react-router-dom";
import { useCart} from"../context/CartContext";
import"./Cart.css";

export default function Cart() {
 const {
 cartItems,
 removeFromCart,
 updateQuantity,
 clearCart,
 cartProductCount,
 cartSubtotal,
} = useCart();

 const SHIPPING_COST = 500;
 const FREE_SHIPPING_THRESHOLD = 50000;
 const shipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
 const total = cartSubtotal + shipping;

 /* ── Empty state ── */
 if (cartItems.length === 0) {
 return (
 <div className="cart-page">
 <div className="cart-header">
 <div className="cart-header-inner">
 <div>
 <h1 className="cart-header-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
 </svg>
 Shopping Cart
 </h1>
 <span className="cart-header-count">0 items in your cart</span>
 </div>
 </div>
 </div>

 <div className="cart-body">
 <div className="cart-empty">
 <div className="cart-empty-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
 </svg>
 </div>
 <h2>Your cart is empty</h2>
 <p>Looks like you haven&apos;t added any fabrics yet. Browse our marketplace to find premium materials.</p>
 <Link to="/shop" className="cart-empty-cta">
 Start Shopping
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </Link>
 </div>
 </div>
 </div>
 );
}

 /* ── Cart with items ── */
 return (
 <div className="cart-page">
 {/* Header */}
 <div className="cart-header">
 <div className="cart-header-inner">
 <div>
 <h1 className="cart-header-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
 </svg>
 Shopping Cart
 </h1>
 <span className="cart-header-count">
 {cartProductCount} {cartProductCount === 1 ?"item" :"items"} in your cart
 </span>
 </div>

 <button className="cart-clear-btn" onClick={clearCart}>
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
 </svg>
 Clear All
 </button>
 </div>
 </div>

 {/* Body */}
 <div className="cart-body">
 {/* Left — Cart Items */}
 <div className="cart-items-section">
 {cartItems.map((item) => (
 <div className="cart-item-card" key={item.id}>
 {/* Product Image */}
 {item.image ? (
 <img src={item.image} alt={item.name} className="cart-item-img" />
 ) : (
 <div className="cart-item-img-placeholder">
 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
 </svg>
 </div>
 )}

 {/* Item Info */}
 <div className="cart-item-info">
 <h3 className="cart-item-name">{item.name}</h3>
 <p className="cart-item-meta">
 {item.supplier}{item.category ?` · ${item.category}` :""}
 </p>

 {/* Quantity controls */}
 <div className="cart-item-qty">
 <button
 onClick={() => updateQuantity(item.id, item.quantity - 1)}
 aria-label="Decrease quantity"
 >
 −
 </button>
 <input
 type="text"
 className="cart-item-qty-val"
 value={item.quantity}
 readOnly
 />
 <button
 onClick={() => updateQuantity(item.id, item.quantity + 1)}
 aria-label="Increase quantity"
 >
 +
 </button>
 <span className="cart-item-unit">metres</span>
 </div>
 </div>

 {/* Price */}
 <div className="cart-item-price">
 <p className="cart-item-total">
 LKR {((item.unitPrice ?? 0) * item.quantity).toLocaleString()}
 </p>
 <p className="cart-item-unit-price">
 LKR {(item.unitPrice ?? 0).toLocaleString()} / metre
 </p>
 </div>

 {/* Delete */}
 <button
 className="cart-item-delete"
 onClick={() => removeFromCart(item.id)}
 aria-label={`Remove ${item.name}`}
 >
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
 </svg>
 </button>
 </div>
 ))}

 <Link to="/shop" className="cart-continue-link">
 ← Continue Shopping
 </Link>
 </div>

 {/* Right — Sidebar */}
 <div className="cart-sidebar">
 {/* Promo Code */}
 <div className="cart-promo-card">
 <h3 className="cart-promo-label">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="m2 9 3-3 3 3" /><path d="M13 18H7a2 2 0 0 1-2-2V6" /><path d="m22 15-3 3-3-3" /><path d="M11 6h6a2 2 0 0 1 2 2v10" />
 </svg>
 Promo Code
 </h3>
 <div className="cart-promo-row">
 <input
 type="text"
 className="cart-promo-input"
 placeholder="e.g. CLOTH10"
 />
 <button className="cart-promo-btn">Apply</button>
 </div>
 </div>

 {/* Order Summary */}
 <div className="cart-summary-card">
 <h3 className="cart-summary-title">Order Summary</h3>

 <div className="cart-summary-row">
 <span>Subtotal</span>
 <span>LKR {cartSubtotal.toLocaleString()}</span>
 </div>

 <div className="cart-summary-row">
 <span>Shipping</span>
 <span>{shipping === 0 ?"Free" :`LKR ${shipping.toLocaleString()}`}</span>
 </div>

 <p className="cart-summary-note">
 Free shipping on orders over LKR {FREE_SHIPPING_THRESHOLD.toLocaleString()}
 </p>

 <hr className="cart-summary-divider" />

 <div className="cart-summary-total">
 <span>Total</span>
 <span>LKR {total.toLocaleString()}</span>
 </div>

 <Link to="/checkout" className="cart-checkout-btn">
 Proceed to Checkout
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </Link>

 <p className="cart-secure-note">
 🔒 Secure checkout · COD &amp; Bank Transfer available
 </p>
 </div>

 {/* Trust Badges */}
 <div className="cart-trust-card">
 <div className="cart-trust-item">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 100% verified suppliers
 </div>
 <div className="cart-trust-item">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 Quality guarantee on all fabrics
 </div>
 <div className="cart-trust-item">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 Free returns within 7 days
 </div>
 <div className="cart-trust-item">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 Island-wide delivery
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}


// ── Checkout.jsx ──
import { useState, useEffect} from"react";
import { collection, getDocs} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useCart} from"../context/CartContext";
import { useNavigate, useLocation} from"react-router-dom";
import toast from"react-hot-toast";
import"./Checkout.css";

const STEPS = ["Shipping","Delivery","Payment","Confirm","Complete"];

export default function Checkout() {
 const { cartItems, cartSubtotal, clearCart} = useCart();
 const navigate = useNavigate();

 const SHIPPING_COST = 500;
 const total = cartSubtotal + SHIPPING_COST;

 /* ── Multi-step state ── */
 const location = useLocation();
 const [currentStep, setCurrentStep] = useState(location.state?.step || 1);

 /* ── Step 1: Shipping form state ── */
 const [form, setForm] = useState({
 fullName:"",
 phoneNumber:"",
 city:"",
 streetAddress:"",
 district:"",
});

 // Validate phone: strip spaces/dashes/+94 prefix → must be 10 digits
 const isValidPhone = (phone) => {
 const digits = phone.replace(/[\s\-().+]/g,"").replace(/^94/,"0");
 return /^\d{10}$/.test(digits);
};

 const handleChange = (e) => {
 const { name, value} = e.target;
 if (name ==="phoneNumber") {
 const cleaned = value.replace(/[^\d\s\-+]/g,"");
 setForm((prev) => ({ ...prev, phoneNumber: cleaned}));
 return;
}
 setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
};

 const handleContinueToDelivery = () => {
 const { fullName, phoneNumber, city, streetAddress, district} = form;
 if (!fullName || !phoneNumber || !city || !streetAddress || !district) {
 toast.error("Please fill in all shipping details.");
 return;
}
 if (!isValidPhone(phoneNumber)) {
 toast.error("Phone number must be exactly 10 digits.");
 return;
}
 setCurrentStep(2);
 window.scrollTo({ top: 0, behavior:"smooth"});
};

 /* ── Step 2: Delivery state ── */
 const [deliveryMethod, setDeliveryMethod] = useState("home");
 const [selectedTailor, setSelectedTailor] = useState(null);
 const [tailors, setTailors] = useState([]);
 const [setTailorsLoading] = useState(false);

 useEffect(() => {
 if (currentStep === 2 && tailors.length === 0) {
 getDocs(collection(db,"tailors"))
 .then((snapshot) => {
 setTailorsLoading(true); // ✅ moved inside async callback
 const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
 setTailors(data);
})
 .catch((err) => {
 console.error("Error fetching tailors:", err);
 toast.error("Failed to load tailors.");
})
 .finally(() => setTailorsLoading(false));
}
}, [currentStep, tailors.length]);

 /* ── Step 5: Complete state ── */
 const [orderId, setOrderId] = useState(null);

 /* ── Step 3: Payment state ── */
 const [paymentMethod, setPaymentMethod] = useState("card");
 const [cardDetails, setCardDetails] = useState({
 number:"",
 expiry:"",
 cvv:"",
});

 const handleCardChange = (e) => {
 setCardDetails((prev) => ({ ...prev, [e.target.name]: e.target.value}));
};

 const handleContinueToPayment = () => {
 if (deliveryMethod ==="tailor" && !selectedTailor) {
 toast.error("Please select a tailor for delivery.");
 return;
}
 setCurrentStep(3);
 window.scrollTo({ top: 0, behavior:"smooth"});
};

 const handleReviewOrder = () => {
 if (paymentMethod ==="card") {
 if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
 toast.error("Please fill in your card details.");
 return;
}
}
 setCurrentStep(4);
 window.scrollTo({ top: 0, behavior:"smooth"});
};

 const handlePlaceOrder = () => {
 const newOrderId ="ORD-2026-" + Math.floor(100 + Math.random() * 900);
 setOrderId(newOrderId);
 if (clearCart) clearCart();
 toast.success("Order Placed Successfully!");
 setCurrentStep(5);
 window.scrollTo({ top: 0, behavior:"smooth"});
};

 const handleBack = () => {
 setCurrentStep((prev) => Math.max(1, prev - 1));
 window.scrollTo({ top: 0, behavior:"smooth"});
};

 const getPaymentMethodDisplay = () => {
 switch (paymentMethod) {
 case"card": return"Credit / Debit Card";
 case"koko": return"Koko (BNPL)";
 case"bank": return"Bank Transfer";
 default: return paymentMethod;
}
};

 return (
 <div className="checkout-page">
 {/* ── Stepper ── */}
 {currentStep < 5 && (
 <div className="checkout-stepper">
 <div className="checkout-stepper-inner">
 {STEPS.map((label, idx) => {
 const stepNum = idx + 1;
 const isActive = stepNum === currentStep;
 const isCompleted = stepNum < currentStep;
 return (
 <div key={label} style={{ display:"flex", alignItems:"center", flex: idx < STEPS.length - 1 ? 1 :"none"}}>
 <div
 className={`checkout-step${isActive ?" active" :""}${isCompleted ?" completed" :""}`}
 >
 {isCompleted ? (
 <div className="checkout-step-check">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 </div>
 ) : (
 <div className="checkout-step-circle">{stepNum}</div>
 )}
 <span className="checkout-step-label">{label}</span>
 </div>
 {idx < STEPS.length - 1 && (
 <div
 className={`checkout-step-dash${isCompleted ?" completed" :""}`}
 />
 )}
 </div>
 );
})}
 </div>
 </div>
 )}

 {/* ── Body ── */}
 <div className="checkout-body" style={currentStep === 5 ? { display:"block", maxWidth:"800px"} : {}}>
 {/* ══════════════ STEP 1: Shipping ══════════════ */}
 {currentStep === 1 && (
 <div className="checkout-form-card">
 <h2 className="checkout-form-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
 Shipping Information
 </h2>

 {/* Full Name */}
 <div className="checkout-form-group">
 <label className="checkout-form-label">Full Name</label>
 <input
 type="text"
 name="fullName"
 className="checkout-form-input"
 placeholder="Kamal Jayawardena"
 value={form.fullName}
 onChange={handleChange}
 />
 </div>

 {/* Phone + City */}
 <div className="checkout-form-row">
 <div className="checkout-form-group">
 <label className="checkout-form-label">Phone Number</label>
 <input
 type="tel"
 name="phoneNumber"
 className="checkout-form-input"
 placeholder="0771234567"
 value={form.phoneNumber}
 onChange={handleChange}
 maxLength={15}
 />
 {form.phoneNumber && !isValidPhone(form.phoneNumber) && (
 <span style={{ color:"#dc2626", fontSize:"12px", marginTop:"4px", display:"block"}}>
 Phone number must be exactly 10 digits.
 </span>
 )}
 </div>
 <div className="checkout-form-group">
 <label className="checkout-form-label">City</label>
 <input
 type="text"
 name="city"
 className="checkout-form-input"
 placeholder="Colombo"
 value={form.city}
 onChange={handleChange}
 />
 </div>
 </div>

 {/* Street Address */}
 <div className="checkout-form-group">
 <label className="checkout-form-label">Street Address</label>
 <input
 type="text"
 name="streetAddress"
 className="checkout-form-input"
 placeholder="No. 45, Main Street"
 value={form.streetAddress}
 onChange={handleChange}
 />
 </div>

 {/* District */}
 <div className="checkout-form-group">
 <label className="checkout-form-label">District</label>
 <input
 type="text"
 name="district"
 className="checkout-form-input"
 placeholder="Colombo"
 value={form.district}
 onChange={handleChange}
 style={{ maxWidth:"260px"}}
 />
 </div>

 {/* Continue Button */}
 <button className="checkout-continue-btn" onClick={handleContinueToDelivery}>
 Continue to Delivery
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </button>
 </div>
 )}

 {/* ══════════════ STEP 2: Delivery ══════════════ */}
 {currentStep === 2 && (
 <div className="checkout-delivery-card">
 <h2 className="checkout-delivery-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="1" y="3" width="15" height="13" rx="2" />
 <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
 <circle cx="5.5" cy="18.5" r="2.5" />
 <circle cx="18.5" cy="18.5" r="2.5" />
 </svg>
 Delivery Options
 </h2>

 {/* Delivery Method Selection */}
 <div className="checkout-delivery-options">
 {/* Home Delivery */}
 <div
 className={`checkout-delivery-option${deliveryMethod ==="home" ?" selected" :""}`}
 onClick={() => {
 setDeliveryMethod("home");
 setSelectedTailor(null);
}}
 >
 <div className="checkout-delivery-option-icon">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
 <polyline points="9 22 9 12 15 12 15 22" />
 </svg>
 </div>
 <div className="checkout-delivery-option-info">
 <p className="checkout-delivery-option-name">Home Delivery</p>
 <p className="checkout-delivery-option-desc">Deliver to your address</p>
 </div>
 <div className="checkout-delivery-option-radio">
 <div className="checkout-delivery-option-radio-dot" />
 </div>
 </div>



 {/* Find a Tailor / Designer */}
 <div
 className="checkout-delivery-option checkout-delivery-option-highlight"
 onClick={() => {
 // Store cart context for the quote request flow
 sessionStorage.setItem(
"clothstreet_checkout_cart",
 JSON.stringify(cartItems)
 );
 navigate("/find-tailor-designer");
}}
 >
 <div className="checkout-delivery-option-icon" style={{ background:"linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)"}}>
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color:"#7c3aed"}}>
 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
 <circle cx="9" cy="7" r="4" />
 <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
 </svg>
 </div>
 <div className="checkout-delivery-option-info">
 <p className="checkout-delivery-option-name">
 Find a Tailor / Designer
 <span style={{ marginLeft:"8px", fontSize:"0.7rem", fontWeight: 700, padding:"2px 8px", borderRadius:"6px", background:"linear-gradient(135deg, #7c3aed, #db2777)", color:"#fff", verticalAlign:"middle"}}>NEW</span>
 </p>
 <p className="checkout-delivery-option-desc">Get custom tailoring or design work for your fabrics</p>
 </div>
 <div className="checkout-delivery-option-radio" style={{ borderColor:"#c4b5fd"}}>
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </div>
 </div>
 </div>



 {/* Navigation Row */}
 <div className="checkout-nav-row">
 <button className="checkout-back-btn" onClick={handleBack}>
 ← Back
 </button>
 <button className="checkout-continue-btn" onClick={handleContinueToPayment}>
 Continue to Payment
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </button>
 </div>
 </div>
 )}

 {/* ══════════════ STEP 3: Payment ══════════════ */}
 {currentStep === 3 && (
 <div className="checkout-delivery-card">
 <h2 className="checkout-delivery-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="2" y="5" width="20" height="14" rx="2" />
 <line x1="2" y1="10" x2="22" y2="10" />
 </svg>
 Payment Method
 </h2>

 <div className="checkout-payment-box">
 <div className="checkout-delivery-options" style={{ marginBottom:"0"}}>

 {/* 1. Credit / Debit Card */}
 <div
 className={`checkout-delivery-option${paymentMethod ==="card" ?" selected" :""}`}
 style={{ borderRadius: paymentMethod ==="card" ?"14px 14px 0 0" :"14px", borderBottom: paymentMethod ==="card" ?"none" :""}}
 onClick={() => setPaymentMethod("card")}
 >
 <div className="checkout-delivery-option-icon">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="2" y="5" width="20" height="14" rx="2" />
 <line x1="2" y1="10" x2="22" y2="10" />
 </svg>
 </div>
 <div className="checkout-delivery-option-info">
 <p className="checkout-delivery-option-name">Credit / Debit Card</p>
 <p className="checkout-delivery-option-desc">Pay securely with Visa or Mastercard</p>
 </div>
 <div className="checkout-delivery-option-radio">
 <div className="checkout-delivery-option-radio-dot" />
 </div>
 </div>

 {/* Card Details Details Box */}
 {paymentMethod ==="card" && (
 <div className="checkout-payment-details">
 <div className="checkout-card-form">
 <div className="checkout-form-group" style={{ marginBottom: 0}}>
 <label className="checkout-form-label">Card Number</label>
 <input
 type="text"
 name="number"
 className="checkout-form-input"
 placeholder="0000 0000 0000 0000"
 value={cardDetails.number}
 onChange={handleCardChange}
 maxLength={19}
 />
 </div>
 <div className="checkout-card-form-row">
 <div className="checkout-form-group" style={{ marginBottom: 0, flex: 1}}>
 <label className="checkout-form-label">Expiry Date</label>
 <input
 type="text"
 name="expiry"
 className="checkout-form-input"
 placeholder="MM/YY"
 value={cardDetails.expiry}
 onChange={handleCardChange}
 maxLength={5}
 />
 </div>
 <div className="checkout-form-group" style={{ marginBottom: 0, flex: 1}}>
 <label className="checkout-form-label">CVV</label>
 <input
 type="text"
 name="cvv"
 className="checkout-form-input"
 placeholder="123"
 value={cardDetails.cvv}
 onChange={handleCardChange}
 maxLength={4}
 />
 </div>
 </div>
 </div>
 </div>
 )}

 {/* 2. Koko BNPL */}
 <div
 className={`checkout-delivery-option${paymentMethod ==="koko" ?" selected" :""}`}
 style={{ borderRadius: paymentMethod ==="koko" ?"14px 14px 0 0" :"14px", borderBottom: paymentMethod ==="koko" ?"none" :"", marginTop: paymentMethod ==="card" ?"12px" :"0"}}
 onClick={() => setPaymentMethod("koko")}
 >
 <div className="checkout-delivery-option-icon">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" />
 <path d="M12 8v4l3 3" />
 </svg>
 </div>
 <div className="checkout-delivery-option-info">
 <p className="checkout-delivery-option-name">Koko (Buy Now, Pay Later)</p>
 <p className="checkout-delivery-option-desc">Split into 3 interest-free installments</p>
 </div>
 <div className="checkout-delivery-option-radio">
 <div className="checkout-delivery-option-radio-dot" />
 </div>
 </div>

 {/* Koko Details Box */}
 {paymentMethod ==="koko" && (
 <div className="checkout-payment-details">
 <div className="checkout-koko-info">
 <div className="checkout-koko-logo">koko</div>
 <p>You will be securely redirected to the Koko app to complete your installment purchase.</p>
 <button className="checkout-koko-btn" onClick={(e) => e.preventDefault()}>Pay with Koko</button>
 </div>
 </div>
 )}

 {/* 3. Bank Transfer */}
 <div
 className={`checkout-delivery-option${paymentMethod ==="bank" ?" selected" :""}`}
 style={{ borderRadius: paymentMethod ==="bank" ?"14px 14px 0 0" :"14px", borderBottom: paymentMethod ==="bank" ?"none" :"", marginTop: paymentMethod ==="koko" ?"12px" :"0"}}
 onClick={() => setPaymentMethod("bank")}
 >
 <div className="checkout-delivery-option-icon">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
 <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeWidth="2" />
 </svg>
 </div>
 <div className="checkout-delivery-option-info">
 <p className="checkout-delivery-option-name">Bank Transfer</p>
 <p className="checkout-delivery-option-desc">Deposit directly to our account</p>
 </div>
 <div className="checkout-delivery-option-radio">
 <div className="checkout-delivery-option-radio-dot" />
 </div>
 </div>

 {/* Bank Details Box */}
 {paymentMethod ==="bank" && (
 <div className="checkout-payment-details">
 <div className="checkout-bank-details">
 <p>Please transfer the total amount to the following bank account and upload your payment slip.</p>
 <div className="checkout-bank-account-box">
 <div className="checkout-bank-line"><span>Bank:</span><span>Commercial Bank</span></div>
 <div className="checkout-bank-line"><span>Name:</span><span>ClothStreet Pvt Ltd</span></div>
 <div className="checkout-bank-line"><span>Account:</span><span>1000 2345 6789</span></div>
 <div className="checkout-bank-line"><span>Branch:</span><span>Colombo 03</span></div>
 </div>
 <div className="checkout-upload-box">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin:"0 auto 6px"}}>
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
 <polyline points="17 8 12 3 7 8" />
 <line x1="12" y1="3" x2="12" y2="15" />
 </svg>
 Click here to upload transfer receipt
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Navigation Row */}
 <div className="checkout-nav-row" style={{ marginTop:"0"}}>
 <button className="checkout-back-btn" onClick={handleBack}>
 ← Back
 </button>
 <button className="checkout-continue-btn" onClick={handleReviewOrder}>
 Review Order
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </button>
 </div>
 </div>
 )}

 {/* ══════════════ STEP 4: Confirm ══════════════ */}
 {currentStep === 4 && (
 <div className="checkout-confirm-card">
 <h2 className="checkout-confirm-title">
 Review Your Order
 </h2>

 {/* Shipping Info Box */}
 <div className="checkout-confirm-shipping-box">
 <div className="checkout-confirm-shipping-header">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
 <h4>Shipping to</h4>
 </div>
 <div className="checkout-confirm-shipping-info">
 <>
 {form.fullName}<br />
 {form.streetAddress}, {form.city}, {form.district}
 </>
 </div>
 </div>

 {/* Items List */}
 <div className="checkout-confirm-items">
 {cartItems.map((item) => (
 <div className="checkout-confirm-item" key={item.id}>
 <div className="checkout-confirm-item-img">
 {item.image ? (
 <img src={item.image} alt={item.name} />
 ) : (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
 <circle cx="8.5" cy="8.5" r="1.5" />
 <polyline points="21 15 16 10 5 21" />
 </svg>
 )}
 </div>
 <div className="checkout-confirm-item-info">
 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px'}}>
 <p className="checkout-confirm-item-name">{item.name}</p>
 <div className="checkout-confirm-item-price">
 LKR {(item.unitPrice * item.quantity).toLocaleString()}
 </div>
 </div>
 <p className="checkout-confirm-item-meta">{item.quantity} {item.unit ||"m"}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Payment Badge */}
 <div className="checkout-confirm-payment-badge">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="2" y="5" width="20" height="14" rx="2" />
 <line x1="2" y1="10" x2="22" y2="10" />
 </svg>
 {getPaymentMethodDisplay()}
 </div>

 {/* Actions */}
 <div className="checkout-confirm-actions">
 <button className="checkout-action-back-btn" onClick={handleBack}>
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
 Back
 </button>
 <button className="checkout-place-order-btn" onClick={handlePlaceOrder}>
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
 <polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 Place Order · LKR {total.toLocaleString()}
 </button>
 </div>
 </div>
 )}

 {/* ══════════════ STEP 5: Complete ══════════════ */}
 {currentStep === 5 && (
 <div className="checkout-success-container">
 <div className="checkout-success-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
 <polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 </div>

 <div className="checkout-success-badge">Order Confirmed!</div>

 <h2 className="checkout-success-title">Thank you for your order!</h2>
 <p className="checkout-success-desc">
 Your order <strong>{orderId}</strong> has been placed successfully.
 </p>
 <p className="checkout-success-subdesc">
 You'll receive a confirmation and your supplier will contact you within 24 hours.
 </p>

 <div className="checkout-success-details">
 <div className="checkout-success-row">
 <span>Order ID</span>
 <span>{orderId}</span>
 </div>
 <div className="checkout-success-row">
 <span>Payment Method</span>
 <span>{getPaymentMethodDisplay()}</span>
 </div>
 <div className="checkout-success-row highlight">
 <span>Total Paid</span>
 <span>LKR {total.toLocaleString()}</span>
 </div>
 <div className="checkout-success-row">
 <span>Delivery to</span>
 <span>{`${form.streetAddress}, ${form.city}`}</span>
 </div>
 </div>

 <div className="checkout-success-actions">
 <button className="checkout-success-btn-secondary" onClick={() => toast("Tracking features coming soon!", { icon:"🚚"})}>
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
 Track My Order
 </button>
 <button className="checkout-success-btn-primary" onClick={() => window.location.href ="/"}>
 Continue Shopping
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
 </button>
 </div>
 </div>
 )}

 {/* ── Order Summary (shown on steps 1-4) ── */}
 {currentStep < 5 && (
 <div className="checkout-summary-card">
 <h3 className="checkout-summary-title">Order Summary</h3>

 {/* Cart Items */}
 {cartItems.map((item) => (
 <div className="checkout-summary-item" key={item.id}>
 <span className="checkout-summary-item-name">
 {item.name} ({item.quantity}
 {item.unit ||"m"})
 </span>
 <span className="checkout-summary-item-price">
 LKR {(item.unitPrice * item.quantity).toLocaleString()}
 </span>
 </div>
 ))}

 <hr className="checkout-summary-divider" />

 {/* Subtotal */}
 <div className="checkout-summary-row subtotal">
 <span>Subtotal</span>
 <span>LKR {cartSubtotal.toLocaleString()}</span>
 </div>

 {/* Shipping */}
 <div className="checkout-summary-row">
 <span>Shipping</span>
 <span>LKR {SHIPPING_COST.toLocaleString()}</span>
 </div>

 {/* Total */}
 <div className="checkout-summary-total">
 <span>Total</span>
 <span>LKR {total.toLocaleString()}</span>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}


// ── CustomerOrders.jsx ──
import { useState, useEffect} from"react";
import { collection, query, where, getDocs} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import { useNavigate} from"react-router-dom";
import toast from"react-hot-toast";

// ── Mock Order Data (Sri Lankan fabric/tailoring orders) ──
const mockOrders = [
 {
 id:"ORD-2026-143",
 product:"Premium Silk Fabric - Navy Blue",
 seller:"Lanka Textiles Co.",
 sellerInitial:"L",
 category:"Fabric",
 description:"5 meters of premium silk fabric",
 deliveryType:"tailor",
 deliveryLabel:"Delivered to Tailor: Nimal Perera",
 quantity: 5,
 unit:"m",
 amount: 45000,
 expectedDate:"3/15/2026",
 status:"Shipped",
 statusClass:"shipped",
 tracking:"TRK-2026-3821",
},
 {
 id:"ORD-2026-138",
 product:"Custom Evening Gown Design",
 seller:"Priya Gunasekara",
 sellerInitial:"P",
 category:"Design",
 description:"Custom designed evening gown with embellishments",
 deliveryType:"home",
 deliveryLabel: null,
 quantity: 1,
 unit:"pc",
 amount: 125000,
 expectedDate:"3/20/2026",
 status:"In Progress",
 statusClass:"in-progress",
 tracking: null,
},
 {
 id:"ORD-2026-142",
 product:"Suit Tailoring Service",
 seller:"Nimal Perera",
 sellerInitial:"N",
 category:"Tailoring",
 description:"2 custom-tailored business suits",
 deliveryType:"home",
 deliveryLabel: null,
 quantity: 2,
 unit:"pc",
 amount: 85000,
 expectedDate:"3/24/2026",
 status:"Confirmed",
 statusClass:"confirmed",
 tracking: null,
},
 {
 id:"ORD-2026-112",
 product:"Batik Cotton Fabric - Multiple Colors",
 seller:"Artisan Threads",
 sellerInitial:"A",
 category:"Fabric",
 description:"8 meters of traditional batik cotton",
 deliveryType:"home",
 deliveryLabel:"Home delivery",
 quantity: 8,
 unit:"m",
 amount: 28000,
 deliveredDate:"3/4/2026",
 status:"Delivered",
 statusClass:"delivered",
 tracking:"TRK-2026-2642",
},
 {
 id:"ORD-2026-108",
 product:"Bridal Saree Design Package",
 seller:"Priya Gunasekara",
 sellerInitial:"P",
 category:"Design",
 description:"Complete bridal saree design with blouse",
 deliveryType:"home",
 deliveryLabel: null,
 quantity: 1,
 unit:"pc",
 amount: 195000,
 expectedDate:"3/8/2026",
 status:"Completed",
 statusClass:"completed",
 tracking: null,
},
];

export default function CustomerOrders() {
 const { user} = useAuth();
 const navigate = useNavigate();
 const [orders, setOrders] = useState(mockOrders);
 const [searchQuery, setSearchQuery] = useState("");
 const [activeTab, setActiveTab] = useState("All");
 const [quotations, setQuotations] = useState([]);
 const [quotationsLoading, setQuotationsLoading] = useState(true);

 // Review Modal State
 const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
 const [reviewOrder, setReviewOrder] = useState(null);
 const [reviewText, setReviewText] = useState("");
 const [reviewRating, setReviewRating] = useState(5);

 const handleDeleteOrder = (orderId) => {
 if (window.confirm("Are you sure you want to remove this order from your history?")) {
 setOrders(prev => prev.filter(o => o.id !== orderId));
 toast.success("Order removed successfully!");
}
};

 const handleOpenReview = (order) => {
 setReviewOrder(order);
 setReviewText("");
 setReviewRating(5);
 setIsReviewModalOpen(true);
};

 const handleSubmitReview = () => {
 if (!reviewText.trim()) {
 toast.error("Please write a review before submitting.");
 return;
}
 // Update order status to"Completed"
 setOrders(prev => prev.map(o => o.id === reviewOrder.id ? { ...o, status:"Completed", statusClass:"completed"} : o));
 setIsReviewModalOpen(false);
 toast.success("Review submitted successfully!");
};

 // Fetch quotations from Firestore
 useEffect(() => {
 if (!user?.uid) return;
 const fetchQuotations = async () => {
 try {
 const q = query(
 collection(db,"quotations"),
 where("customerId","==", user.uid)
 );
 const snap = await getDocs(q);
 const data = snap.docs
 .map((doc) => ({ id: doc.id, ...doc.data()}))
 .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
 setQuotations(data);
} catch (err) {
 console.error("Error fetching quotations:", err);
} finally {
 setQuotationsLoading(false);
}
};
 fetchQuotations();
}, [user]);

 // ── Tab filtering ──
 const filteredOrders = orders.filter((order) => {
 const query = searchQuery.toLowerCase();
 const matchesSearch =
 order.product.toLowerCase().includes(query) ||
 order.seller.toLowerCase().includes(query);

 if (activeTab ==="All") return matchesSearch;
 if (activeTab ==="Active")
 return (
 matchesSearch &&
 ["Shipped","In Progress","Confirmed"].includes(order.status)
 );
 if (activeTab ==="Completed")
 return (
 matchesSearch &&
 ["Delivered","Completed"].includes(order.status)
 );
 return matchesSearch;
});

 // ── Stats ──
 const totalOrders = orders.length;
 const activeOrders = orders.filter((o) =>
 ["Shipped","In Progress","Confirmed"].includes(o.status)
 ).length;
 const completedOrders = orders.filter((o) =>
 ["Delivered","Completed"].includes(o.status)
 ).length;
 const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);

 // ── Status badge colors ──
 const statusStyles = {
 shipped:"",
"in-progress":"bg-amber-100 text-amber-700",
 confirmed:"bg-violet-100 text-violet-700",
 delivered:"bg-emerald-100 text-emerald-700",
 completed:"bg-emerald-100 text-emerald-700",
};

 // ── Card left-border colors ──
 const borderColors = {
 shipped:"#4f46e5",
"in-progress":"#f59e0b",
 confirmed:"#7c3aed",
 delivered:"#16a34a",
 completed:"#16a34a",
};

 return (
 <div className="min-h-screen">

 {/* ════════════ HERO BANNER ════════════ */}
 <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 py-11 px-4">
 {/* Decorative orbs */}
 <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" />

 <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
 {/* Left */}
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center border">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
 </svg>
 </div>
 <div>
 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Orders</h1>
 <p className="text-sm mt-0.5">Track your purchases and deliveries</p>
 </div>
 </div>

 {/* Right: Action Buttons */}
 <div className="flex items-center gap-2.5">

 <button
 onClick={() => {
 const csvData = [
 ["Order ID","Product","Seller","Category","Quantity","Amount (LKR)","Status","Tracking"],
 ...filteredOrders.map(o => [
 o.id,
`"${o.product}"`,
`"${o.seller}"`,
 o.category,
 o.quantity,
 o.amount,
 o.status,
 o.tracking ||"N/A"
 ])
 ].map(e => e.join(",")).join("\n");
 
 const blob = new Blob([csvData], { type:'text/csv;charset=utf-8;'});
 const link = document.createElement("a");
 const url = URL.createObjectURL(blob);
 link.setAttribute("href", url);
 link.setAttribute("download",`my_orders_${new Date().toISOString().split('T')[0]}.csv`);
 link.style.visibility ='hidden';
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 toast.success("Orders exported successfully!");
}}
 className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold hover: shadow-sm hover:shadow-md transition-all cursor-pointer"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
 <polyline points="7 10 12 15 17 10" />
 <line x1="12" y1="15" x2="12" y2="3" />
 </svg>
 Export
 </button>
 </div>
 </div>
 </section>

 {/* ════════════ CONTENT ════════════ */}
 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

 {/* ── Stats Cards ── */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
 {/* Total Orders */}
 <div className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div>
 <p className="text-sm font-medium mb-1">Total Orders</p>
 <p className="text-3xl font-bold">{totalOrders}</p>
 <p className="text-xs mt-1">All time</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
 </svg>
 </div>
 </div>

 {/* Active */}
 <div className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div>
 <p className="text-sm font-medium mb-1">Active</p>
 <p className="text-3xl font-bold">{activeOrders}</p>
 <p className="text-xs mt-1">In progress</p>
 </div>
 <div className="w-10 h-10 rounded-xl flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
 </svg>
 </div>
 </div>

 {/* Completed */}
 <div className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div>
 <p className="text-sm font-medium mb-1">Completed</p>
 <p className="text-3xl font-bold">{completedOrders}</p>
 <p className="text-xs mt-1">Delivered</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 </div>
 </div>

 {/* Total Spent */}
 <div className="border rounded-2xl p-5 flex items-start justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
 <div>
 <p className="text-sm font-medium mb-1">Total Spent</p>
 <p className="text-3xl font-bold">LKR {(totalSpent / 1000).toFixed(0)}K</p>
 <p className="text-xs mt-1">Total purchases</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
 </svg>
 </div>
 </div>
 </div>

 {/* ── Search Bar + Tabs ── */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
 {/* Search */}
 <div className="relative flex-1 max-w-md">
 <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
 </svg>
 </div>
 <input
 type="text"
 placeholder="Search orders..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full border focus: focus:ring-2 focus:ring-indigo-100 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 outline-none transition-all"
 />
 </div>

 {/* Tab Pills */}
 <div className="flex items-center gap-1 rounded-xl p-1">
 {["All","Active","Completed","Quotations"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
 activeTab === tab
 ?" shadow-md shadow-indigo-200"
 :" hover: hover:"
}`}
 >
 {tab}
 {tab ==="Quotations" && quotations.length > 0 && (
 <span className={`ml-1.5 text-xs ${activeTab === tab ?"" :""}`}>
 ({quotations.length})
 </span>
 )}
 </button>
 ))}
 </div>
 </div>

 {/* ── Order Cards Grid / Quotations ── */}
 {activeTab ==="Quotations" ? (
 /* ── QUOTATIONS TAB ── */
 quotationsLoading ? (
 <div className="space-y-4">
 {[1, 2, 3].map((i) => (
 <div key={i} className="rounded-2xl border p-6 animate-pulse">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl" />
 <div className="flex-1 space-y-2">
 <div className="h-4 rounded w-1/3" />
 <div className="h-3 rounded w-1/4" />
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : quotations.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 {quotations.map((q) => {
 const statusColors = {
 pending: { bg:"bg-amber-100", text:"text-amber-700", border:"#f59e0b"},
 quoted: { bg:"", text:"", border:"#3b82f6"},
 accepted: { bg:"bg-emerald-100", text:"text-emerald-700", border:"#16a34a"},
 rejected: { bg:"", text:"", border:"#dc2626"},
};
 const sc = statusColors[q.status] || statusColors.pending;

 return (
 <div
 key={q.id}
 className="border rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
 style={{ borderLeft:`4px solid ${sc.border}`}}
 >
 {/* Header */}
 <div className="flex items-start gap-3.5 mb-3">
 <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
 q.providerType ==="designer"
 ?"bg-gradient-to-br from-rose-500 to-pink-600"
 :"bg-gradient-to-br from-violet-500 to-purple-600"
}`}>
 {q.providerName?.charAt(0) ||"?"}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-sm font-bold truncate">{q.providerName ||"Provider"}</h3>
 <p className="text-xs mt-0.5 capitalize">{q.providerType ||"—"}</p>
 <span className={`inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
 {q.status}
 </span>
 </div>
 </div>

 {/* Requirements preview */}
 <p className="text-sm mb-3 leading-relaxed line-clamp-2">
 {q.requirements ||"No description"}
 </p>

 {/* Details */}
 <div className="grid grid-cols-2 gap-2.5 mb-4">
 <div className="flex items-center gap-1.5 text-xs">
 <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
 </svg>
 <span className="">Expected:</span>
 <span className="font-semibold">{q.expectedDate ||"—"}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 </svg>
 <span className="">Items:</span>
 <span className="font-semibold">{q.items?.length || 0}</span>
 </div>
 {q.grandTotal && (
 <div className="flex items-center gap-1.5 text-xs col-span-2">
 <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
 </svg>
 <span className="">Quoted Amount:</span>
 <span className="font-bold text-violet-600">LKR {q.grandTotal.toLocaleString()}</span>
 </div>
 )}
 </div>

 {/* Actions */}
 <div className="flex gap-2.5">
 {q.status ==="quoted" && (
 <button
 onClick={() => navigate(`/quotation-review/${q.id}`, { state: { quotation: q}})}
 className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
 >
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
 </svg>
 Review & Respond
 </button>
 )}
 </div>
 </div>
 );
})}
 </div>
 ) : (
 <div className="col-span-full text-center py-16">
 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
 <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <h3 className="text-lg font-semibold mb-1">No quotations yet</h3>
 <p className="text-sm">Request a quote from a tailor or designer during checkout.</p>
 </div>
 )
 ) : (
 /* ── Regular Order Cards Grid ── */
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 {filteredOrders.length > 0 ? (
 filteredOrders.map((order) => (
 <div
 key={order.id}
 className="border rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
 style={{ borderLeft:`4px solid ${borderColors[order.statusClass]}`}}
 >
 {/* Card Header */}
 <div className="flex items-start gap-3.5 mb-3">
 <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-bold text-lg shrink-0">
 {order.sellerInitial}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-sm font-bold truncate">{order.product}</h3>
 <p className="text-xs mt-0.5">Seller: {order.seller}</p>
 <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
 {order.id}
 </span>
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-600">
 {order.category}
 </span>
 </div>
 </div>
 {order.status ==="Completed" && (
 <button 
 onClick={() => handleDeleteOrder(order.id)}
 className="w-7 h-7 rounded-lg border flex items-center justify-center hover: hover: hover: transition-colors shrink-0 cursor-pointer"
 title="Delete Order"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
 </svg>
 </button>
 )}
 </div>

 {/* Description */}
 <p className="text-sm mb-3 leading-relaxed">{order.description}</p>

 {/* Delivery Badge */}
 {order.deliveryLabel && (
 <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4 border ${
 order.deliveryType ==="tailor"
 ?"bg-violet-50 text-violet-700 border-violet-200"
 :"bg-emerald-50 text-emerald-700 border-emerald-200"
}`}>
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 {order.deliveryType ==="tailor" ? (
 <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>
 ) : (
 <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>
 )}
 </svg>
 {order.deliveryLabel}
 </div>
 )}

 {/* Details Grid */}
 <div className="grid grid-cols-2 gap-2.5 mb-4">
 <div className="flex items-center gap-1.5 text-xs">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 </svg>
 <span className="">Quantity:</span>
 <span className="font-semibold">{order.quantity}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
 </svg>
 <span className="">Amount:</span>
 <span className="font-semibold text-emerald-600">LKR {order.amount.toLocaleString()}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
 </svg>
 <span className="">{order.deliveredDate ?"Delivered:" :"Expected:"}</span>
 <span className="font-semibold">{order.deliveredDate || order.expectedDate}</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[order.statusClass]}`}>
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 {["delivered","completed"].includes(order.statusClass) ? (
 <polyline points="20 6 9 17 4 12" />
 ) : order.statusClass ==="shipped" ? (
 <><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>
 ) : (
 <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>
 )}
 </svg>
 {order.status}
 </span>
 </div>
 </div>

 {/* Tracking */}
 {order.tracking && (
 <div className="flex items-center gap-1.5 text-xs mb-1">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
 </svg>
 <span>Tracking:</span>
 <span className="font-semibold">{order.tracking}</span>
 </div>
 )}

 {/* Action Buttons */}
 <div className="flex gap-2.5 mt-4">

 {["Shipped","In Progress","Confirmed"].includes(order.status) && (
 <button
 onClick={() => navigate(`/order-tracking/${order.id}`, { state: { order}})}
 className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold border hover: transition-all cursor-pointer"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
 </svg>
 Track
 </button>
 )}

 {["Delivered","Completed"].includes(order.status) && (
 <button
 onClick={() => handleOpenReview(order)}
 disabled={order.status ==="Completed"}
 className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
 order.status ==="Completed"
 ?" border cursor-not-allowed"
 :" border hover: cursor-pointer"
}`}
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 {order.status ==="Completed" ?"Reviewed" :"Review"}
 </button>
 )}
 </div>
 </div>
 ))
 ) : (
 /* Empty State */
 <div className="col-span-full text-center py-16">
 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
 <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 </svg>
 </div>
 <h3 className="text-lg font-semibold mb-1">No orders found</h3>
 <p className="text-sm">Try adjusting your search or filter settings.</p>
 </div>
 )}
 </div>
 )}

 </div>

 {/* ════════════ REVIEW MODAL ════════════ */}
 {isReviewModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
 <div className="rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
 <div className="px-6 py-4 border-b flex items-center justify-between">
 <h3 className="text-lg font-bold">Write a Review</h3>
 <button 
 onClick={() => setIsReviewModalOpen(false)}
 className="w-8 h-8 rounded-full border flex items-center justify-center hover: transition-colors"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
 </button>
 </div>
 <div className="px-6 py-5">
 <p className="text-sm mb-4">How was your experience with <span className="font-semibold">{reviewOrder?.product}</span>?</p>
 
 <div className="flex gap-2 mb-6 justify-center">
 {[1, 2, 3, 4, 5].map((star) => (
 <button 
 key={star} 
 onClick={() => setReviewRating(star)}
 className="focus:outline-none focus:scale-110 transition-transform"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${star <= reviewRating ?"text-amber-400 fill-amber-400" :""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 </button>
 ))}
 </div>

 <textarea 
 rows="4"
 className="w-full border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus: focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
 placeholder="Share your feedback about the product and delivery..."
 value={reviewText}
 onChange={(e) => setReviewText(e.target.value)}
 />
 </div>
 <div className="px-6 py-4 border-t flex justify-end gap-3">
 <button 
 onClick={() => setIsReviewModalOpen(false)}
 className="px-5 py-2 rounded-xl text-sm font-medium border hover: transition-colors"
 >
 Cancel
 </button>
 <button 
 onClick={handleSubmitReview}
 className="px-5 py-2 rounded-xl text-sm font-semibold hover: transition-colors shadow-sm shadow-indigo-200"
 >
 Submit Review
 </button>
 </div>
 </div>
 </div>
 )}

 </div>
 );
}


// ── CustomerProfile.jsx ──
import { useState} from"react";
import { Link, useNavigate} from"react-router-dom";
import { useAuth} from"../context/AuthContext";
import { auth, storage} from"../firebase/firebase";
import { ref, uploadBytes, getDownloadURL} from"firebase/storage";
import { sendPasswordResetEmail, deleteUser} from"firebase/auth";
import toast from"react-hot-toast";
import"./CustomerProfile.css";

// --- Mock Data for Dashboard Widgets ---
const mockOrders = [
 { id:"#CS-8472", date:"Oct 12, 2025", total:"LKR 4,500", status:"Delivered", class:"delivered"},
 { id:"#CS-8591", date:"Nov 03, 2025", total:"LKR 12,000", status:"Shipped", class:"shipped"},
 { id:"#CS-8610", date:"Nov 15, 2025", total:"LKR 3,250", status:"Processing", class:"processing"},
];

const mockTailors = [
 { name:"Saman Tailors", specialty:"Menswear & Suits", rating:"4.8"},
 { name:"Kandy Fashions", specialty:"Dresses & Blouses", rating:"4.5"},
];

export default function CustomerProfile() {
 const { user, updateProfile} = useAuth();
 const navigate = useNavigate();
 const [isEditing, setIsEditing] = useState(false);
 const [isSaving, setIsSaving] = useState(false);

 // Section-level edit toggles
 const [editingPersonal, setEditingPersonal] = useState(false);
 const [editingMeasurements, setEditingMeasurements] = useState(false);
 const [editingAddress, setEditingAddress] = useState(false);
 const [editingBio, setEditingBio] = useState(false);

 // New photo file tracking
 const [photoFile, setPhotoFile] = useState(null);

 // Form state
 const [formData, setFormData] = useState({
 name: user?.name ||"",
 email: user?.email ||"",
 phone: user?.phone ||"+94 77 000 0000",
 bio: user?.bio ||"",
 photoURL: user?.photoURL ||"",
 measurements: user?.measurements || {
 chest:"", waist:"", hips:"", inseam:"", shoulder:"", sleeve:"",
},
 address: user?.address || {
 street:"", city: user?.city ||"Colombo", province:"", zip:""
},
 preferences: user?.preferences || {
 emailAlerts: true, smsAlerts: false
}
});

 // Get the user's initial letter for the avatar
 const getInitial = () => {
 if (user?.name) return user.name.charAt(0).toUpperCase();
 if (user?.email) return user.email.charAt(0).toUpperCase();
 return"U";
};

 // Validate phone: strip spaces, dashes, brackets, optional +94/0 prefix → must be 10 digits
 const isValidPhone = (phone) => {
 const digits = phone.replace(/[\s\-().+]/g,"").replace(/^94/,"0");
 return /^\d{10}$/.test(digits);
};

 const handleInputChange = (e) => {
 const { name, value} = e.target;
 if (name ==="phone") {
 // Allow only digits, spaces, dashes, plus sign
 const cleaned = value.replace(/[^\d\s\-+]/g,"");
 setFormData((prev) => ({ ...prev, phone: cleaned}));
 return;
}
 setFormData((prev) => ({ ...prev, [name]: value}));
};

 const handleMeasurementChange = (e) => {
 const { name, value} = e.target;
 setFormData((prev) => ({
 ...prev,
 measurements: {
 ...prev.measurements,
 [name]: value,
},
}));
};

 const handleAddressChange = (e) => {
 const { name, value} = e.target;
 setFormData((prev) => ({
 ...prev,
 address: { ...prev.address, [name]: value},
}));
};

 const handlePreferenceToggle = (field) => {
 setFormData((prev) => ({
 ...prev,
 preferences: { ...prev.preferences, [field]: !prev.preferences[field]}
}));
};

 const handlePhotoUpload = (e) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setPhotoFile(file);
 // Show local preview instantly
 const objectUrl = URL.createObjectURL(file);
 setFormData((prev) => ({ ...prev, photoURL: objectUrl}));
};

 const handleCancel = () => {
 setPhotoFile(null); // Clear pending upload
 setFormData({
 name: user?.name ||"",
 email: user?.email ||"",
 phone: user?.phone ||"+94 77 000 0000",
 bio: user?.bio ||"",
 photoURL: user?.photoURL ||"",
 measurements: user?.measurements || {
 chest:"", waist:"", hips:"", inseam:"", shoulder:"", sleeve:"",
},
 address: user?.address || {
 street:"", city: user?.city ||"Colombo", province:"", zip:""
},
 preferences: user?.preferences || {
 emailAlerts: true, smsAlerts: false
}
});
 setEditingPersonal(false);
 setEditingMeasurements(false);
 setEditingAddress(false);
 setEditingBio(false);
 setIsEditing(false);
};

 const handleSave = async () => {
 if (formData.phone && !isValidPhone(formData.phone)) {
 toast.error("Phone number must be exactly 10 digits.");
 return;
}
 try {
 setIsSaving(true);
 let newPhotoURL = formData.photoURL;

 // Upload to Firebase Storage if a new file was selected
 if (photoFile) {
 toast.loading("Uploading photo...", { id:"photo"});
 const storageRef = ref(storage,`users/${user.uid}/profile_${Date.now()}`);
 await uploadBytes(storageRef, photoFile);
 newPhotoURL = await getDownloadURL(storageRef);
 toast.success("Photo uploaded successfully", { id:"photo"});
}

 await updateProfile(user.uid, { ...formData, photoURL: newPhotoURL, city: formData.address.city});
 toast.success("Profile saved!");
 setEditingPersonal(false);
 setEditingMeasurements(false);
 setEditingAddress(false);
 setEditingBio(false);
 setIsEditing(false);
} catch (error) {
 console.error("Failed to update profile", error);
 toast.error("Failed to save profile");
} finally {
 setIsSaving(false);
}
};

 const handlePasswordReset = async () => {
 try {
 await sendPasswordResetEmail(auth, user.email);
 toast.success("Password reset email sent!");
} catch {
 toast.error("Failed to save profile");
}
};

 const handleDeleteAccount = async () => {
 if (window.confirm("Are you sure? This cannot be undone and will permanently delete your account.")) {
 try {
 await deleteUser(auth.currentUser);
 toast.success("Account deleted");
} catch {
 toast.error("Failed to save profile");
}
}
};

 // ==================== PROFILE VIEW ====================
 if (!isEditing) {
 return (
 <div>
 {/* Hero Banner */}
 <section className="cp-hero">
 <div className="cp-hero-inner">
 {/* Avatar */}
 <div className="cp-avatar-wrap">
 <div className="cp-avatar">
 {user?.photoURL ? (
 <img src={user.photoURL} alt={user.name ||"Profile"} />
 ) : (
 getInitial()
 )}
 </div>
 <div className="cp-camera-badge">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
 <circle cx="12" cy="13" r="3" />
 </svg>
 </div>
 </div>

 {/* User Info */}
 <div className="cp-hero-info">
 <div className="cp-hero-name-row">
 <h1 className="cp-hero-name">{user?.name ||"User"}</h1>
 <span className="cp-role-badge">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
 </svg>
 Customer
 </span>
 </div>

 <div className="cp-hero-contacts">
 {/* Email */}
 <div className="cp-hero-contact">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="20" height="16" x="2" y="4" rx="2" />
 <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
 </svg>
 <span>{user?.email ||"—"}</span>
 </div>

 {/* Phone */}
 <div className="cp-hero-contact">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
 </svg>
 <span>{user?.phone ||"+94 77 000 0000"}</span>
 </div>

 {/* City (from Address Book) */}
 <div className="cp-hero-contact">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
 <span>{user?.address?.city || user?.city ||"Colombo"}</span>
 </div>
 </div>
 </div>

 {/* Edit Profile Button */}
 <button className="cp-edit-btn" onClick={() => setIsEditing(true)}>
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 Edit Profile
 </button>
 </div>
 </section>

 {/* ---- Profile Dashboard Content ---- */}
 <div className="cp-edit-wrapper" style={{ paddingTop:"40px", maxWidth:"1000px"}}>

 <div style={{ display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:"28px"}}>

 {/* ====== LEFT COLUMN ====== */}
 <div style={{ display:"flex", flexDirection:"column", gap:"28px"}}>

 {/* About Me */}
 <div className="cp-card" style={{ marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
 About Me
 </h3>
 </div>
 <p style={{ color: user?.bio ?"#374151" :"#9ca3af", fontSize:"14.5px", lineHeight:"1.6"}}>
 {user?.bio ||"No bio added yet. Click'Edit Profile' to tell us about yourself."}
 </p>
 </div>

 {/* Recent Orders Widget */}
 <div className="cp-card" style={{ marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
 Recent Orders
 </h3>
 <Link to="/orders" style={{ display:"inline-flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#6366f1", fontWeight:"600", textDecoration:"none"}}>
 View All
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
 </Link>
 </div>
 <div className="cp-order-list">
 {mockOrders.map((order, idx) => (
 <div className="cp-order-item" key={idx} onClick={() => navigate("/orders")} style={{ cursor:"pointer", borderRadius:"8px", padding:"16px 8px", transition:"background 0.15s ease"}} onMouseEnter={(e) => e.currentTarget.style.background ="#f5f3ff"} onMouseLeave={(e) => e.currentTarget.style.background ="transparent"}>
 <div>
 <p style={{ fontSize:"14px", fontWeight:"700", color:"#1e1b4b"}}>{order.id}</p>
 <p style={{ fontSize:"12.5px", color:"#6b7280", marginTop:"2px"}}>{order.date}</p>
 </div>
 <div style={{ textAlign:"right"}}>
 <p style={{ fontSize:"14.5px", fontWeight:"600", color:"#1e1b4b", marginBottom:"6px"}}>{order.total}</p>
 <span className={`cp-status-pill ${order.class}`}>{order.status}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* ====== RIGHT COLUMN ====== */}
 <div style={{ display:"flex", flexDirection:"column", gap:"28px"}}>

 {/* Address Details */}
 <div className="cp-card" style={{ marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
 Address Details
 </h3>
 </div>
 <div style={{ display:"flex", flexDirection:"column", gap:"12px", fontSize:"14.5px", color:"#374151"}}>
 <div style={{ display:"flex", justifyContent:"space-between"}}>
 <span style={{ color:"#6b7280"}}>Street:</span>
 <span style={{ fontWeight:"500", textAlign:"right"}}>{user?.address?.street ||"—"}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between"}}>
 <span style={{ color:"#6b7280"}}>City:</span>
 <span style={{ fontWeight:"500", textAlign:"right"}}>{user?.address?.city || user?.city ||"—"}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between"}}>
 <span style={{ color:"#6b7280"}}>Province:</span>
 <span style={{ fontWeight:"500", textAlign:"right"}}>{user?.address?.province ||"—"}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between"}}>
 <span style={{ color:"#6b7280"}}>Postal / Zip:</span>
 <span style={{ fontWeight:"500", textAlign:"right"}}>{user?.address?.zip ||"—"}</span>
 </div>
 </div>
 </div>

 {/* Saved Tailors Widget */}
 <div className="cp-card" style={{ marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
 Saved Tailors
 </h3>
 </div>
 <div style={{ display:"flex", flexDirection:"column", gap:"16px"}}>
 {mockTailors.map((tailor, idx) => (
 <div key={idx} style={{ display:"flex", alignItems:"center", gap:"12px"}}>
 <div style={{ width:"40px", height:"40px", borderRadius:"8px", background:"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#4f46e5", fontWeight:"bold", fontSize:"16px"}}>
 {tailor.name.charAt(0)}
 </div>
 <div>
 <p style={{ fontSize:"14px", fontWeight:"600", color:"#1e1b4b"}}>{tailor.name}</p>
 <p style={{ fontSize:"12px", color:"#6b7280", marginTop:"2px"}}>★ {tailor.rating} • {tailor.specialty}</p>
 </div>
 </div>
 ))}
 </div>
 <button
 onClick={() => navigate('/tailors')}
 style={{ width:"100%", marginTop:"20px", padding:"8px 0", borderRadius:"8px", border:"1.5px solid #e0e7ff", background:"#f8fafc", color:"#4f46e5", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}
 >
 Browse Tailors
 </button>
 </div>

 {/* My Measurements */}
 <div className="cp-card" style={{ height:"100%", marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
 Measurements
 </h3>
 </div>
 <div className="cp-fields-row" style={{ rowGap:"20px", gridTemplateColumns:"1fr 1fr"}}>
 {["chest","waist","hips","inseam","shoulder","sleeve"].map((field) => (
 <div className="cp-field" key={field}>
 <span className="cp-field-label">{field}</span>
 <span className="cp-field-value" style={{ fontSize:"15px"}}>
 {user?.measurements?.[field] ?`${user.measurements[field]} cm` :"—"}
 </span>
 </div>
 ))}
 </div>
 </div>

 </div>

 </div>

 </div>
 </div>
 );
}

 // ==================== EDIT PROFILE VIEW ====================
 return (
 <div className="cp-edit-wrapper">
 <h2 className="cp-edit-title">Edit Profile</h2>

 {/* ---- Photo Section ---- */}
 <div className="cp-card">
 <div className="cp-photo-section">
 <div className="cp-photo-avatar">
 {formData.photoURL ? (
 <img src={formData.photoURL} alt="Profile" />
 ) : (
 getInitial()
 )}
 </div>
 <div className="cp-photo-actions">
 <label className="cp-upload-btn" style={{ cursor:"pointer"}}>
 Upload new photo
 <input
 type="file"
 accept="image/png, image/jpeg"
 style={{ display:"none"}}
 onChange={handlePhotoUpload}
 />
 </label>
 <span className="cp-photo-hint">
 At least 800×800 px recommended.<br />
 JPG or PNG is allowed.
 </span>
 </div>
 </div>
 </div>

 {/* ---- Personal Info Section ---- */}
 <div className="cp-card">
 <div className="cp-section-header">
 <h3 className="cp-section-title">Personal Info</h3>
 <button
 className="cp-section-edit-btn"
 onClick={() => setEditingPersonal(!editingPersonal)}
 >
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 {editingPersonal ?"Cancel" :"Edit"}
 </button>
 </div>

 {editingPersonal ? (
 <div className="cp-fields-row">
 <div className="cp-field">
 <label className="cp-field-label">Full Name</label>
 <input
 className="cp-input-plain"
 type="text"
 name="name"
 value={formData.name}
 onChange={handleInputChange}
 />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">Email</label>
 <input
 className="cp-input-plain"
 type="email"
 name="email"
 value={formData.email}
 onChange={handleInputChange}
 />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">Phone</label>
 <input
 className="cp-input-plain"
 type="tel"
 name="phone"
 value={formData.phone}
 onChange={handleInputChange}
 placeholder="0771234567"
 maxLength={15}
 />
 {formData.phone && !isValidPhone(formData.phone) && (
 <span style={{ color:"#dc2626", fontSize:"12px", marginTop:"4px", display:"block"}}>
 Phone number must be exactly 10 digits.
 </span>
 )}
 </div>
 </div>
 ) : (
 <div className="cp-fields-row">
 <div className="cp-field">
 <span className="cp-field-label">Full Name</span>
 <span className="cp-field-value">{formData.name ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">Email</span>
 <span className="cp-field-value">{formData.email ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">Phone</span>
 <span className="cp-field-value">{formData.phone ||"—"}</span>
 </div>
 </div>
 )}
 </div>

 {/* ---- Body Measurements Section ---- */}
 <div className="cp-card">
 <div className="cp-section-header">
 <h3 className="cp-section-title">Body Measurements (cm)</h3>
 <button
 className="cp-section-edit-btn"
 onClick={() => setEditingMeasurements(!editingMeasurements)}
 >
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 {editingMeasurements ?"Cancel" :"Edit"}
 </button>
 </div>

 {editingMeasurements ? (
 <div className="cp-fields-row" style={{ rowGap:"16px"}}>
 {["chest","waist","hips","inseam","shoulder","sleeve"].map((field) => (
 <div className="cp-field" key={field}>
 <label className="cp-field-label">{field}</label>
 <input
 className="cp-input-plain"
 type="number"
 name={field}
 value={formData.measurements[field]}
 onChange={handleMeasurementChange}
 placeholder={`e.g. 90`}
 />
 </div>
 ))}
 </div>
 ) : (
 <div className="cp-fields-row" style={{ rowGap:"16px"}}>
 {["chest","waist","hips","inseam","shoulder","sleeve"].map((field) => (
 <div className="cp-field" key={field}>
 <span className="cp-field-label">{field}</span>
 <span className="cp-field-value">
 {formData.measurements[field] ?`${formData.measurements[field]} cm` :"Not set"}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ---- Address Book Section ---- */}
 <div className="cp-card">
 <div className="cp-section-header">
 <h3 className="cp-section-title">Address Book</h3>
 <button
 className="cp-section-edit-btn"
 onClick={() => setEditingAddress(!editingAddress)}
 >
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 {editingAddress ?"Cancel" :"Edit"}
 </button>
 </div>

 {editingAddress ? (
 <div className="cp-fields-row" style={{ rowGap:"16px", gridTemplateColumns:"1fr 1fr"}}>
 <div className="cp-field" style={{ gridColumn:"1 / -1"}}>
 <label className="cp-field-label">Street Address</label>
 <input className="cp-input-plain" type="text" name="street" value={formData.address.street} onChange={handleAddressChange} />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">City</label>
 <input className="cp-input-plain" type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">Province</label>
 <input className="cp-input-plain" type="text" name="province" value={formData.address.province} onChange={handleAddressChange} />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">Postal / Zip Code</label>
 <input className="cp-input-plain" type="text" name="zip" value={formData.address.zip} onChange={handleAddressChange} />
 </div>
 </div>
 ) : (
 <div className="cp-fields-row" style={{ rowGap:"16px", gridTemplateColumns:"1fr 1fr"}}>
 <div className="cp-field" style={{ gridColumn:"1 / -1"}}>
 <span className="cp-field-label">Street Address</span>
 <span className="cp-field-value">{formData.address.street ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">City</span>
 <span className="cp-field-value">{formData.address.city ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">Province</span>
 <span className="cp-field-value">{formData.address.province ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">Postal / Zip Code</span>
 <span className="cp-field-value">{formData.address.zip ||"—"}</span>
 </div>
 </div>
 )}
 </div>

 {/* ---- Preferences Section ---- */}
 <div className="cp-card">
 <h3 className="cp-section-title" style={{ marginBottom:"20px"}}>Preferences</h3>
 <div style={{ display:"flex", flexDirection:"column", gap:"16px"}}>

 {/* Email Toggle */}
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div>
 <p style={{ fontSize:"15px", fontWeight:"600", color:"#1e1b4b"}}>Email Notifications</p>
 <p style={{ fontSize:"13px", color:"#6b7280"}}>Receive order updates and promotions via email.</p>
 </div>
 <label style={{ display:"flex", alignItems:"center", cursor:"pointer"}}>
 <div style={{ position:"relative"}}>
 <input type="checkbox" className="sr-only" checked={formData.preferences.emailAlerts} onChange={() => handlePreferenceToggle("emailAlerts")} style={{ opacity: 0, width: 0, height: 0}} />
 <div style={{ width:"44px", height:"24px", background: formData.preferences.emailAlerts ?"#4f46e5" :"#d1d5db", borderRadius:"999px", transition:"background 0.3s"}}></div>
 <div style={{ position:"absolute", left: formData.preferences.emailAlerts ?"22px" :"2px", top:"2px", width:"20px", height:"20px", background:"white", borderRadius:"50%", transition:"left 0.3s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}></div>
 </div>
 </label>
 </div>

 <div style={{ height:"1px", background:"#f3f4f6"}}></div>

 {/* SMS Toggle */}
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div>
 <p style={{ fontSize:"15px", fontWeight:"600", color:"#1e1b4b"}}>SMS Alerts</p>
 <p style={{ fontSize:"13px", color:"#6b7280"}}>Get real-time text messages when orders are out for delivery.</p>
 </div>
 <label style={{ display:"flex", alignItems:"center", cursor:"pointer"}}>
 <div style={{ position:"relative"}}>
 <input type="checkbox" className="sr-only" checked={formData.preferences.smsAlerts} onChange={() => handlePreferenceToggle("smsAlerts")} style={{ opacity: 0, width: 0, height: 0}} />
 <div style={{ width:"44px", height:"24px", background: formData.preferences.smsAlerts ?"#4f46e5" :"#d1d5db", borderRadius:"999px", transition:"background 0.3s"}}></div>
 <div style={{ position:"absolute", left: formData.preferences.smsAlerts ?"22px" :"2px", top:"2px", width:"20px", height:"20px", background:"white", borderRadius:"50%", transition:"left 0.3s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}></div>
 </div>
 </label>
 </div>

 </div>
 </div>

 {/* ---- Security Section ---- */}
 <div className="cp-card">
 <h3 className="cp-section-title" style={{ marginBottom:"20px"}}>Account Security</h3>
 <div style={{ display:"flex", flexDirection:"column", gap:"16px"}}>
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div>
 <p style={{ fontSize:"15px", fontWeight:"600", color:"#1e1b4b"}}>Password</p>
 <p style={{ fontSize:"13px", color:"#6b7280"}}>Send a secure reset link to your email ({user?.email}).</p>
 </div>
 <button className="cp-upload-btn" onClick={handlePasswordReset}>Change Password</button>
 </div>

 <div style={{ height:"1px", background:"#f3f4f6"}}></div>

 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div>
 <p style={{ fontSize:"15px", fontWeight:"600", color:"#dc2626"}}>Delete Account</p>
 <p style={{ fontSize:"13px", color:"#6b7280"}}>Permanently remove your account and data.</p>
 </div>
 <button
 onClick={handleDeleteAccount}
 style={{
 padding:"8px 16px",
 borderRadius:"8px",
 border:"1.5px solid #fca5a5",
 background:"#fff",
 color:"#dc2626",
 fontSize:"13.5px",
 fontWeight:"500",
 cursor:"pointer"
}}
 >
 Delete Account
 </button>
 </div>
 </div>
 </div>

 {/* ---- Bio Section ---- */}
 <div className="cp-card">
 <div className="cp-section-header">
 <h3 className="cp-section-title">Bio</h3>
 <button
 className="cp-section-edit-btn"
 onClick={() => setEditingBio(!editingBio)}
 >
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 {editingBio ?"Cancel" :"Edit"}
 </button>
 </div>

 <textarea
 className="cp-textarea"
 name="bio"
 value={formData.bio}
 onChange={handleInputChange}
 placeholder="Tell us about yourself..."
 disabled={!editingBio}
 style={!editingBio ? { opacity: 0.7, cursor:"not-allowed"} : {}}
 />
 </div>

 {/* ---- Bottom Actions ---- */}
 <div className="cp-bottom-actions">
 <button className="cp-cancel-btn" onClick={handleCancel}>
 Cancel
 </button>
 <button
 className="cp-save-btn"
 onClick={handleSave}
 disabled={isSaving}
 style={isSaving ? { opacity: 0.7, cursor:"not-allowed"} : {}}
 >
 {isSaving ?"Saving..." :"Save Changes"}
 </button>
 </div>
 </div>
 );
}


// ── DesignerOrders.jsx ──
import { useState, useEffect} from"react";
import { collection, query, where, getDocs, doc, updateDoc} from"firebase/firestore";
import { db} from"../../firebase/firebase";
import { useAuth} from"../../context/AuthContext";
import { useNavigate} from"react-router-dom";

// ─────────────────────────────────────────────────────────────
// Status colours for badges
// ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
"In Progress": { bg:"bg-orange-100", text:"text-orange-600", dot:"bg-orange-500"},
"In Review": { bg:"", text:"", dot:""},
"Pending": { bg:"", text:"", dot:""},
"Completed": { bg:"bg-green-100", text:"text-green-600", dot:"bg-green-500"},
"Cancelled": { bg:"", text:"", dot:""},
};

const STATUS_OPTIONS = ["Pending","In Progress","In Review","Completed","Cancelled"];

const ITEMS_PER_PAGE = 6;

// ─────────────────────────────────────────────────────────────
// Mock / fallback project data (matches screenshot)
// ─────────────────────────────────────────────────────────────
const FALLBACK_PROJECTS = [
 {
 id:"DFS-2026-011",
 name:"Summer Resort Collection",
 client:"Boutique Elegance",
 category:"Fashion Collection",
 description:"Complete resort wear line with modern batik prints",
 progress: 70,
 designs: 12,
 value: 280000,
 due:"3/20/2026",
 status:"In Progress",
 thumbnail:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=120&h=120&fit=crop",
},
 {
 id:"DFS-2026-012",
 name:"Bridal Couture Series",
 client:"Chamara & Ishani",
 category:"Bridal Design",
 description:"Custom bridal gown with traditional Kandyan elements",
 progress: 85,
 designs: 3,
 value: 450000,
 due:"3/25/2026",
 status:"In Review",
 thumbnail:"https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=120&h=120&fit=crop",
},
 {
 id:"DFS-2026-013",
 name:"Corporate Uniform Design",
 client:"Tech Solutions Lanka",
 category:"Corporate Wear",
 description:"Professional uniform collection for tech company staff",
 progress: 25,
 designs: 5,
 value: 180000,
 due:"4/1/2026",
 status:"Pending",
 thumbnail:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
},
 {
 id:"DFS-2026-014",
 name:"Festival Capsule Collection",
 client:"Artisan Threads",
 category:"Festive Wear",
 description:"Limited edition festive capsule collection with handloom details",
 progress: 100,
 designs: 8,
 value: 320000,
 due:"3/5/2026",
 status:"Completed",
 thumbnail:"https://images.unsplash.com/photo-1558171813-4c088753af8f?w=120&h=120&fit=crop",
},
];

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function DesignerOrders() {
 const navigate = useNavigate();
 const { user} = useAuth();
 const [loading, setLoading] = useState(true);
 const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, revenue: 0});
 const [orders, setOrders] = useState([]);
 const [activeTab, setActiveTab] = useState("All");
 const [searchTerm, setSearchTerm] = useState("");
 const [statusDropdown, setStatusDropdown] = useState(null);
 const [currentPage, setCurrentPage] = useState(1);
 const [selectedProject, setSelectedProject] = useState(null);

 // Reset page when filter/search changes
 useEffect(() => { setCurrentPage(1);}, [activeTab, searchTerm]);

 // Redirect non-designers away
 useEffect(() => {
 if (user && user.role !=="designer") {
 navigate("/");
}
}, [user, navigate]);

 // ── Firestore reads ──
 useEffect(() => {
 if (!user) return;
 const fetchData = async () => {
 try {
 const uid = user.uid;
 const ordersSnap = await getDocs(query(collection(db,"orders"), where("designerId","==", uid)));
 const allOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data()}));

 const counts = { total: allOrders.length, active: 0, completed: 0, revenue: 0};
 allOrders.forEach((o) => {
 const s = (o.status ||"").toLowerCase();
 if (["confirmed","in progress","fabric ordered","ready to deliver","pending","in review"].includes(s)) counts.active++;
 if (s ==="completed") counts.completed++;
 counts.revenue += o.total || o.price || 0;
});

 setStats(counts.total > 0 ? counts : { total: 4, active: 3, completed: 1, revenue: 1230000});
 setOrders(allOrders.length > 0 ? allOrders : FALLBACK_PROJECTS);
} catch (err) {
 console.error("DesignerOrders fetch error:", err);
 setStats({ total: 4, active: 3, completed: 1, revenue: 1230000});
 setOrders(FALLBACK_PROJECTS);
} finally {
 setLoading(false);
}
};
 fetchData();
}, [user]);

 // ── Update order status in Firestore ──
 const handleStatusUpdate = async (projectId, newStatus) => {
 try {
 // Only write to Firestore for real docs (not mock IDs)
 if (!projectId.startsWith("DFS-")) {
 await updateDoc(doc(db,"orders", projectId), { status: newStatus});
}
 setOrders((prev) =>
 prev.map((o) => (o.id === projectId ? { ...o, status: newStatus, progress: newStatus ==="Completed" ? 100 : o.progress} : o))
 );
 // Update stats
 setStats((prev) => {
 const updated = { ...prev};
 const oldOrder = orders.find((o) => o.id === projectId);
 if (oldOrder) {
 const oldS = (oldOrder.status ||"").toLowerCase();
 const newS = newStatus.toLowerCase();
 if (["in progress","pending","in review","confirmed"].includes(oldS)) updated.active--;
 if (oldS ==="completed") updated.completed--;
 if (["in progress","pending","in review","confirmed"].includes(newS)) updated.active++;
 if (newS ==="completed") updated.completed++;
}
 return updated;
});
} catch (err) {
 console.error("Status update failed:", err);
}
 setStatusDropdown(null);
};

 // ── Export orders to CSV ──
 const handleExport = () => {
 const headers = ["ID","Name","Client","Category","Status","Progress (%)","Designs","Value (LKR )","Due Date"];
 const rows = orders.map((o) => [
 o.id,
 o.name ||"",
 o.client || o.customerName ||"",
 o.category ||"",
 o.status ||"",
 o.progress || 0,
 o.designs || 0,
 o.value || 0,
 o.due ||"",
 ]);
 const csvContent = [headers, ...rows].map((r) => r.map((v) =>`"${v}"`).join(",")).join("\n");
 const blob = new Blob([csvContent], { type:"text/csv;charset=utf-8;"});
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.href = url;
 link.download =`designer_projects_${new Date().toISOString().slice(0, 10)}.csv`;
 link.click();
 URL.revokeObjectURL(url);
};

 // ── Format revenue ──
 const formatRevenue = (val) => {
 if (val >= 1000000) return`LKR ${(val / 1000000).toFixed(1)}M`;
 if (val >= 1000) return`LKR ${(val / 1000).toFixed(0)}K`;
 return`LKR ${val.toLocaleString()}`;
};

 // ── Stat cards data ──
 const statsData = [
 {
 label:"Total Projects",
 sub:"All time",
 value: stats.total,
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="#a78bfa" strokeWidth="2" viewBox="0 0 24 24">
 <rect x="3" y="3" width="7" height="7" rx="1" />
 <rect x="14" y="3" width="7" height="7" rx="1" />
 <rect x="3" y="14" width="7" height="7" rx="1" />
 <rect x="14" y="14" width="7" height="7" rx="1" />
 </svg>
 ),
 iconBg:"rgba(139, 92, 246, 0.15)",
},
 {
 label:"Active",
 sub:"In progress",
 value: stats.active,
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="#60a5fa" strokeWidth="2" viewBox="0 0 24 24">
 <circle cx="12" cy="12" r="10" />
 <path d="M12 6v6l4 2" />
 </svg>
 ),
 iconBg:"rgba(96, 165, 250, 0.15)",
},
 {
 label:"Completed",
 sub:"Delivered",
 value: stats.completed,
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24">
 <circle cx="12" cy="12" r="10" />
 <path d="M9 12l2 2 4-4" />
 </svg>
 ),
 iconBg:"rgba(52, 211, 153, 0.15)",
},
 {
 label:"Revenue",
 sub:"Lifetime earnings",
 value: formatRevenue(stats.revenue),
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="#f472b6" strokeWidth="2" viewBox="0 0 24 24">
 <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
 <polyline points="16 7 22 7 22 13" />
 </svg>
 ),
 iconBg:"rgba(244, 114, 182, 0.15)",
},
 ];

 // ── Helper ──
 const displayName = user?.name || user?.email ||"Designer";
 const avatarLetter = displayName.charAt(0).toUpperCase();

 // ── Loading state ──
 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="flex flex-col items-center gap-3">
 <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
 <p className="text-sm font-medium">Loading your projects…</p>
 </div>
 </div>
 );
}

 return (
 <div className="min-h-screen font-sans flex flex-col">
 {/* Added a custom animation for the cards */}
 <style>{`
 @keyframes fadeSlideUp {
 from { opacity: 0; transform: translateY(16px);}
 to { opacity: 1; transform: translateY(0);}
}
 .do-card { animation: fadeSlideUp 0.4s ease both;}
 .do-card:nth-child(1) { animation-delay: 0.0s;}
 .do-card:nth-child(2) { animation-delay: 0.06s;}
 .do-card:nth-child(3) { animation-delay: 0.12s;}
 .do-card:nth-child(4) { animation-delay: 0.18s;}
 .do-card:nth-child(5) { animation-delay: 0.24s;}
 .do-card:nth-child(6) { animation-delay: 0.30s;}
`}</style>

 {/* ── Purple Header Bar ── */}
 <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
 {avatarLetter}
 </div>
 <div>
 <p className="font-bold text-xl leading-tight">My Design Projects</p>
 <div className="flex items-center gap-2 mt-1">
 <span className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium">
 Active Workspace
 </span>
 <span className="text-sm">
 Manage and track your design orders
 </span>
 </div>
 </div>
 </div>
 {/* Export Button */}
 <button onClick={handleExport} className="flex items-center gap-2 hover: px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow-md border hover:-translate-y-0.5 w-full sm:w-auto justify-center">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
 </svg>
 Export
 </button>
 </div>

 <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 flex-1 w-full">

 {/* ── Stat Cards ── */}
 <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {statsData.map((stat) => (
 <div key={stat.label} className="rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow">
 <div className="flex items-center justify-between mb-3">
 <span className="text-sm font-medium">{stat.label}</span>
 <div className="w-8 h-8 rounded-lg border flex items-center justify-center">
 {/* Re-using the SVG children but styling the container */}
 {stat.icon}
 </div>
 </div>
 <p className="text-3xl font-bold leading-tight">
 {typeof stat.value ==="number" ? stat.value : stat.value}
 </p>
 <p className="text-xs mt-1">{stat.sub}</p>
 </div>
 ))}
 </section>

 {/* ── Search Bar + Filter Tabs ── */}
 <div className="rounded-2xl p-4 shadow-sm border flex flex-col md:flex-row items-center justify-between gap-4">
 {/* Search Input */}
 <div className="relative w-full md:max-w-md">
 <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 <input
 type="text"
 placeholder="Search projects..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus: transition-all placeholder:"
 />
 </div>

 {/* Filter Tabs */}
 <div className="flex items-center gap-1 p-1 rounded-xl border w-full md:w-auto overflow-x-auto scrollbar-hide">
 {["All","Active","Completed"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
 ?" shadow-sm border"
 :" hover: hover:"
}`}
 >
 {tab}
 </button>
 ))}
 </div>
 </div>

 {/* ── Project Cards Grid ── */}
 {(() => {
 // Filter by tab
 let filtered = orders;
 if (activeTab ==="Active") {
 filtered = filtered.filter((o) => {
 const s = (o.status ||"").toLowerCase();
 return ["in progress","pending","in review","confirmed","fabric ordered","ready to deliver"].includes(s);
});
} else if (activeTab ==="Completed") {
 filtered = filtered.filter((o) => (o.status ||"").toLowerCase() ==="completed");
}
 // Filter by search
 if (searchTerm.trim()) {
 const q = searchTerm.toLowerCase();
 filtered = filtered.filter((o) =>
 (o.name ||"").toLowerCase().includes(q) ||
 (o.client || o.customerName ||"").toLowerCase().includes(q) ||
 (o.category ||"").toLowerCase().includes(q) ||
 (o.id ||"").toLowerCase().includes(q)
 );
}

 const totalFiltered = filtered.length;
 const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
 const safePage = Math.min(currentPage, totalPages);
 const paginatedItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

 if (filtered.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-16 px-5 rounded-2xl border border-dashed shadow-sm mt-4">
 <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
 <rect x="3" y="3" width="18" height="18" rx="2" />
 <path d="M3 9h18M9 21V9" />
 </svg>
 </div>
 <p className="text-lg font-bold">No projects found</p>
 <p className="text-sm mt-1 text-center max-w-sm">
 {searchTerm ?"Try adjusting your search terms" :"No projects match the selected filter"}
 </p>
 </div>
 );
}

 return (
 <>
 {/* Results count */}
 <div className="flex items-center justify-between mb-4 px-1">
 <p className="text-sm">
 Showing <span className="font-semibold">{(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, totalFiltered)}</span> of <span className="font-semibold">{totalFiltered}</span> projects
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {paginatedItems.map((project) => {
 const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES["Pending"];
 const progressColor = project.progress >= 100 ?"bg-green-500" : project.progress >= 60 ?"" :"";
 const formattedValue = project.value >= 1000 ?`LKR ${(project.value / 1000).toFixed(0)}K` :`LKR ${(project.value || 0).toLocaleString()}`;

 return (
 <div key={project.id} className="do-card rounded-2xl p-5 shadow-sm border hover:shadow-md hover:-translate-y-1 transition-all duration-300">

 {/* Card Header: Thumbnail + Title + Menu */}
 <div className="flex items-start gap-3 mb-4">
 <img
 src={project.thumbnail}
 alt={project.name}
 className="w-12 h-12 rounded-xl object-cover border shrink-0"
 />
 <div className="flex-1 min-w-0">
 <h3 className="text-base font-bold truncate">
 {project.name}
 </h3>
 <p className="text-sm truncate mt-0.5">
 {project.client || project.customerName}
 </p>
 </div>
 {/* 3-dot menu + Status dropdown */}
 <div className="relative shrink-0">
 <button
 onClick={() => setStatusDropdown(statusDropdown === project.id ? null : project.id)}
 className={`p-1.5 rounded-lg transition-colors ${statusDropdown === project.id ?"" :" hover: hover:"}`}
 >
 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
 <circle cx="12" cy="5" r="1.5" />
 <circle cx="12" cy="12" r="1.5" />
 <circle cx="12" cy="19" r="1.5" />
 </svg>
 </button>

 {/* Status dropdown */}
 {statusDropdown === project.id && (
 <div className="absolute top-full right-0 mt-1 border rounded-xl p-1.5 min-w-[160px] shadow-lg z-50">
 <p className="text-[10px] font-bold px-2.5 py-1.5 uppercase tracking-wider">
 Update Status
 </p>
 {STATUS_OPTIONS.map((opt) => {
 const optStyle = STATUS_STYLES[opt] || STATUS_STYLES["Pending"];
 const isActive = project.status === opt;
 return (
 <button
 key={opt}
 onClick={() => handleStatusUpdate(project.id, opt)}
 className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm transition-colors text-left ${isActive ?`${optStyle.bg} ${optStyle.text} font-bold` :" font-medium hover:"
}`}
 >
 <span className={`w-2 h-2 rounded-full shrink-0 ${optStyle.dot}`} />
 {opt}
 {isActive && (
 <svg className={`w-4 h-4 ml-auto ${optStyle.text}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
 </svg>
 )}
 </button>
 );
})}
 </div>
 )}
 </div>
 </div>

 {/* Order ID + Category badge */}
 <div className="flex items-center gap-2 mb-3">
 <span className="text-xs font-medium">
 {project.id}
 </span>
 <span className="text-xs">•</span>
 <span className="text-xs font-bold px-2.5 py-0.5 rounded-full">
 {project.category}
 </span>
 </div>

 {/* Description */}
 <p className="text-sm line-clamp-2 mb-5 h-10">
 {project.description}
 </p>

 {/* Progress bar */}
 <div className="mb-5 p-3 rounded-xl border">
 <div className="flex justify-between mb-2 items-center">
 <span className="text-xs font-medium">Progress</span>
 <span className={`text-xs font-bold ${progressColor.replace('bg-','text-')}`}>{project.progress}%</span>
 </div>
 <div className="w-full h-1.5 rounded-full overflow-hidden">
 <div
 className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
 style={{ width:`${project.progress}%`}}
 />
 </div>
 </div>

 {/* Stats row: Designs, Value */}
 <div className="flex items-center gap-5 mb-5 px-1">
 <div className="flex items-center gap-1.5">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
 </svg>
 <span className="text-xs">Designs:</span>
 <span className="text-xs font-bold">{project.designs}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
 <path strokeLinecap="round" strokeLinejoin="round" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
 </svg>
 <span className="text-xs">Value:</span>
 <span className="text-xs font-bold">{formattedValue}</span>
 </div>
 </div>

 {/* Due date + Status badge */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-1.5">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect x="3" y="4" width="18" height="18" rx="2" />
 <line x1="16" y1="2" x2="16" y2="6" />
 <line x1="8" y1="2" x2="8" y2="6" />
 <line x1="3" y1="10" x2="21" y2="10" />
 </svg>
 <span className="text-xs font-medium">Due: <span className="font-bold">{project.due}</span></span>
 </div>
 <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusStyle.bg}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
 <span className={`text-[11px] font-bold ${statusStyle.text}`}>
 {project.status}
 </span>
 </div>
 </div>

 {/* Action buttons */}
 <div className="flex gap-2">
 <button onClick={() => setSelectedProject(project)} className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 font-semibold py-2.5 px-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 View Project
 </button>
 <button onClick={() => window.location.href =`mailto:${project.clientEmail ||''}?subject=Regarding%20Project%20${project.id}%20-%20${encodeURIComponent(project.name ||'')}`} className="flex justify-center items-center gap-2 hover: font-semibold py-2.5 px-4 rounded-xl text-sm transition-all border">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
 </svg>
 Message
 </button>
 </div>
 </div>
 );
})}
 </div>

 {/* Pagination Controls */}
 {totalPages > 1 && (
 <div className="flex items-center justify-center gap-2 mt-10">
 <button
 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
 disabled={safePage === 1}
 className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${safePage === 1
 ?" cursor-not-allowed"
 :" border hover: hover: shadow-sm"
}`}
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
 </svg>
 Prev
 </button>

 <div className="flex gap-1.5">
 {Array.from({ length: totalPages}).map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrentPage(i + 1)}
 className={`w-9 h-9 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${safePage === i + 1
 ?" shadow-md shadow-purple-600/20"
 :" border hover: hover:"
}`}
 >
 {i + 1}
 </button>
 ))}
 </div>

 <button
 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
 disabled={safePage === totalPages}
 className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${safePage === totalPages
 ?" cursor-not-allowed"
 :" border hover: hover: shadow-sm"
}`}
 >
 Next
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
 </svg>
 </button>
 </div>
 )}
 </>
 );
})()}
 </main>

 {/* ── Project Detail Modal ── */}
 {selectedProject && (() => {
 const sp = selectedProject;
 const spStatus = STATUS_STYLES[sp.status] || STATUS_STYLES["Pending"];
 const spProgress = sp.progress >= 100 ?"bg-green-500" : sp.progress >= 60 ?"" :"";
 const spValue = sp.value >= 1000 ?`LKR ${(sp.value / 1000).toFixed(0)}K` :`LKR ${(sp.value || 0).toLocaleString()}`;
 return (
 <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
 <div className="rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
 {/* Modal Header */}
 <div className="relative">
 <img src={sp.thumbnail} alt={sp.name} className="w-full h-48 object-cover rounded-t-3xl" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl" />
 <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 w-8 h-8 hover: rounded-full flex items-center justify-center shadow-md transition-all">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 <div className="absolute bottom-4 left-5 right-5">
 <h2 className="text-xl font-bold drop-shadow-sm">{sp.name}</h2>
 <p className="text-sm mt-0.5">{sp.client || sp.customerName}</p>
 </div>
 </div>

 {/* Modal Body */}
 <div className="p-6 space-y-5">
 {/* ID + Category + Status */}
 <div className="flex items-center flex-wrap gap-2">
 <span className="text-xs font-medium px-2.5 py-1 rounded-lg">{sp.id}</span>
 <span className="text-xs font-bold px-2.5 py-1 rounded-lg">{sp.category}</span>
 <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${spStatus.bg}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${spStatus.dot}`} />
 <span className={`text-[11px] font-bold ${spStatus.text}`}>{sp.status}</span>
 </div>
 </div>

 {/* Description */}
 <div>
 <h4 className="text-sm font-bold mb-1">Description</h4>
 <p className="text-sm leading-relaxed">{sp.description ||"No description provided."}</p>
 </div>

 {/* Progress */}
 <div className="p-4 rounded-xl border">
 <div className="flex justify-between mb-2 items-center">
 <span className="text-sm font-semibold">Progress</span>
 <span className={`text-sm font-bold ${spProgress.replace('bg-','text-')}`}>{sp.progress}%</span>
 </div>
 <div className="w-full h-2 rounded-full overflow-hidden">
 <div className={`h-full rounded-full transition-all duration-700 ${spProgress}`} style={{ width:`${sp.progress}%`}} />
 </div>
 </div>

 {/* Stats Grid */}
 <div className="grid grid-cols-3 gap-3">
 <div className="rounded-xl p-3 text-center">
 <p className="text-lg font-bold">{sp.designs}</p>
 <p className="text-[11px] font-medium">Designs</p>
 </div>
 <div className="bg-emerald-50 rounded-xl p-3 text-center">
 <p className="text-lg font-bold text-emerald-700">{spValue}</p>
 <p className="text-[11px] text-emerald-500 font-medium">Value</p>
 </div>
 <div className="rounded-xl p-3 text-center">
 <p className="text-lg font-bold">{sp.due}</p>
 <p className="text-[11px] font-medium">Due Date</p>
 </div>
 </div>

 {/* Close button */}
 <button onClick={() => setSelectedProject(null)} className="w-full py-3 hover: font-semibold rounded-xl transition-colors text-sm">
 Close
 </button>
 </div>
 </div>
 </div>
 );
})()}
 </div>
 );
}


// ── DesignerProfile.jsx ──
import React, { useState, useEffect, useRef} from"react";
import { useParams} from"react-router-dom";
import { doc, getDoc, setDoc} from"firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject} from"firebase/storage";
import { db, storage} from"../../firebase/firebase";
import { useAuth} from"../../context/AuthContext";

// ─── Default / placeholder designer data ───────────────────────────────────────
const DEFAULT_DESIGNER = {
 uid:"",
 name:"New Designer",
 location:"Colombo, Sri Lanka",
 bio:"I create stunning, bespoke fashion pieces that reflect unique aesthetic visions.",
 profilePhoto:"",
 hourlyRate: 5000,
 rating: 5.0,
 services: ["Fashion Illustration","Bespoke Design","Consultation"],
 aesthetics: ["Minimalist","Avant-garde","Streetwear"],
 portfolioImages: [],
 reviews: [
 {
 id: 1,
 text:"An absolute visionary! The custom dress exceeded all my expectations.",
 rating: 5,
 reviewer:"Amaya Silva",
},
 {
 id: 2,
 text:"Highly professional and the attention to detail is unmatched. I love the streetwear collection.",
 rating: 5,
 reviewer:"Kaveen Fernando",
},
 ],
};

// ─── Icons & Helpers ──────────────────────────────────────────────────────────
function StarIcon({ filled = true, size = 16}) {
 return (
 <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
 fill={filled ?"#f59e0b" :"none"} stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 );
}

function StarRow({ count, size = 14}) {
 return (
 <div className="flex gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => (
 <StarIcon key={s} filled={s <= count} size={size} />
 ))}
 </div>
 );
}

function ShareIcon({ size = 16}) {
 return (
 <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
 <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
 <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
 </svg>
 );
}

function Tag({ label, onRemove, editMode, colorScheme ="purple"}) {
 const baseColors = {
 purple:"",
 indigo:"",
};
 const btnColors = {
 purple:" hover: hover:",
 indigo:" hover: hover:",
};
 
 return (
 <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${baseColors[colorScheme]}`}>
 {label}
 {editMode && onRemove && (
 <button onClick={onRemove}
 className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors text-[9px] font-bold ${btnColors[colorScheme]}`}>
 ✕
 </button>
 )}
 </span>
 );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review}) {
 return (
 <div className="border border-fuchsia-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-fuchsia-200 transition-all duration-200">
 <StarRow count={review.rating} size={14} />
 <p className="text-sm leading-relaxed font-medium flex-1">
 &ldquo;{review.text}&rdquo;
 </p>
 <div className="flex items-center gap-2.5 pt-1 border-t">
 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
 {review.reviewer?.charAt(0).toUpperCase() ||"U"}
 </div>
 <div>
 <p className="font-semibold text-sm">{review.reviewer}</p>
 <div className="flex items-center gap-1">
 <StarIcon size={10} filled />
 <span className="text-yellow-500 text-xs font-bold">{review.rating}.0</span>
 </div>
 </div>
 </div>
 </div>
 );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className}) {
 return <div className={` animate-pulse rounded-xl ${className}`} />;
}

// ─── Portfolio Gallery ────────────────────────────────────────────────────────
function PortfolioGallery({ images, editMode, onAddImages, onDeleteImage}) {
 const fileRef = useRef();

 return (
 <div className="rounded-2xl border border-fuchsia-100 shadow-sm overflow-hidden">
 {/* Header */}
 <div className="flex items-center justify-between px-5 pt-5 pb-3">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-lg bg-fuchsia-100 flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
 fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
 <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
 </svg>
 </div>
 <span className="font-bold text-sm">Portfolio Gallery</span>
 {images.length > 0 && (
 <span className="text-xs text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded-full font-medium">
 {images.length} photos
 </span>
 )}
 </div>
 {editMode && (
 <>
 <button
 onClick={() => fileRef.current.click()}
 className="flex items-center gap-1.5 text-xs text-fuchsia-600 border border-fuchsia-200 rounded-lg px-3 py-1.5 hover:bg-fuchsia-50 transition-colors font-medium"
 >
 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
 </svg>
 Add Photos
 </button>
 <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
 onChange={(e) => onAddImages(Array.from(e.target.files))} />
 </>
 )}
 </div>

 {/* Scrollable row */}
 <div className="flex gap-3 overflow-x-auto px-5 pb-5 pt-1"
 style={{ scrollbarWidth:"none"}}>
 {images.length === 0 ? (
 <div className="w-full flex flex-col items-center justify-center py-10 gap-2">
 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
 fill="none" stroke="#fbcfe8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
 <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
 </svg>
 <p className="text-sm">No portfolio photos yet</p>
 </div>
 ) : (
 images.map((img, idx) => (
 <div key={idx} className="relative flex-shrink-0 group">
 <img src={img} alt={`Portfolio ${idx + 1}`}
 className="w-40 h-40 object-cover rounded-xl shadow-sm border border-fuchsia-50 group-hover:shadow-md transition-shadow duration-200" />
 {editMode && (
 <button onClick={() => onDeleteImage(idx, img)}
 className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs hover: shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
 ✕
 </button>
 )}
 {/* Hover overlay */}
 <div className="absolute inset-0 rounded-xl group-hover: transition-colors duration-200" />
 </div>
 ))
 )}
 </div>
 </div>
 );
}

export default function DesignerProfile() {
 const { designerId} = useParams();
 const { user: authUser} = useAuth();

 // ── State ──
 const [designer, setDesigner] = useState(null);
 const [loading, setLoading] = useState(true);
 const [editMode, setEditMode] = useState(false);
 const [saving, setSaving] = useState(false);

 // Draft state
 const [draftName, setDraftName] = useState("");
 const [draftLocation, setDraftLocation] = useState("");
 const [draftBio, setDraftBio] = useState("");
 const [draftRate, setDraftRate] = useState(0);
 const [draftServices, setDraftServices] = useState([]);
 const [draftAesthetics, setDraftAesthetics] = useState([]);
 const [draftPortfolioImages, setDraftPortfolioImages] = useState([]);
 const [draftProfilePhoto, setDraftProfilePhoto] = useState("");
 const [newServiceInput, setNewServiceInput] = useState("");
 const [newAestheticInput, setNewAestheticInput] = useState("");
 const [uploadingPhoto, setUploadingPhoto] = useState(false);
 const [isSaved, setIsSaved] = useState(false); // Bookmarked state

 const profilePhotoRef = useRef();

 const resolvedDesignerId = designerId || authUser?.uid;
 const isOwner = authUser?.uid && authUser.uid === resolvedDesignerId;

 // ── Load designer data ──
 useEffect(() => {
 if (!resolvedDesignerId) {
 setDesigner(DEFAULT_DESIGNER);
 setLoading(false);
 return;
}
 const fetchDesigner = async () => {
 setLoading(true);
 try {
 const snap = await getDoc(doc(db,"designers", resolvedDesignerId));
 if (snap.exists()) {
 setDesigner({ uid: resolvedDesignerId, ...snap.data()});
} else {
 setDesigner({ ...DEFAULT_DESIGNER, uid: resolvedDesignerId});
}
} catch (error) {
 console.error("Failed to fetch designer profile", error);
 setDesigner({ ...DEFAULT_DESIGNER, uid: resolvedDesignerId});
} finally {
 setLoading(false);
}
};
 fetchDesigner();
}, [resolvedDesignerId]);

 const enterEditMode = () => {
 setDraftName(designer.name ||"");
 setDraftLocation(designer.location ||"");
 setDraftBio(designer.bio ||"");
 setDraftRate(designer.hourlyRate || 0);
 setDraftServices([...(designer.services || [])]);
 setDraftAesthetics([...(designer.aesthetics || [])]);
 setDraftPortfolioImages([...(designer.portfolioImages || [])]);
 setDraftProfilePhoto(designer.profilePhoto ||"");
 setEditMode(true);
};

 const cancelEdit = () => setEditMode(false);

 const handleProfilePhotoChange = async (e) => {
 const file = e.target.files[0];
 if (!file) return;
 setUploadingPhoto(true);
 try {
 const storageRef = ref(storage,`designers/${resolvedDesignerId}/profilePhoto`);
 await uploadBytes(storageRef, file);
 const url = await getDownloadURL(storageRef);
 setDraftProfilePhoto(url);
} catch (err) {
 console.error("Photo upload failed:", err);
 alert("Photo upload failed:" + err.message);
} finally {
 setUploadingPhoto(false);
}
};

 const handleAddPortfolioImages = async (files) => {
 for (const file of files) {
 try {
 const storageRef = ref(storage,`designers/${resolvedDesignerId}/portfolio/${Date.now()}_${file.name}`);
 await uploadBytes(storageRef, file);
 const url = await getDownloadURL(storageRef);
 setDraftPortfolioImages((prev) => [...prev, url]);
} catch (err) {
 console.error("Portfolio upload failed:", err);
 alert("Portfolio upload failed:" + err.message);
}
}
};

 const handleDeletePortfolioImage = async (idx, url) => {
 try { 
 await deleteObject(ref(storage, url)); 
} catch { 
 /* ignore if already deleted */ 
}
 setDraftPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
};

 const handleSave = async () => {
 setSaving(true);
 try {
 const updatedData = {
 uid: resolvedDesignerId,
 name: draftName || authUser?.displayName ||"Designer",
 location: draftLocation,
 bio: draftBio,
 profilePhoto: draftProfilePhoto,
 hourlyRate: Number(draftRate),
 services: draftServices,
 aesthetics: draftAesthetics,
 portfolioImages: draftPortfolioImages,
 rating: designer.rating || 5.0,
 reviews: designer.reviews || [],
};
 await setDoc(doc(db,"designers", resolvedDesignerId), updatedData, { merge: true});
 setDesigner((prev) => ({ ...prev, ...updatedData}));
 setEditMode(false);
} catch (err) {
 console.error("Save failed:", err);
} finally {
 setSaving(false);
}
};

 const handleShare = () => {
 const url = window.location.href;
 if (navigator.share) {
 navigator.share({ title:`${designer?.name} – Designer Profile`, url});
} else {
 navigator.clipboard.writeText(url);
 alert("Profile link copied to clipboard!");
}
};

 // ─── Loading skeleton ──────────────────────────────────────────────────────
 if (loading) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-10 px-4">
 <div className="max-w-5xl mx-auto space-y-6">
 <Skeleton className="h-52 w-full" />
 <div className="flex flex-col lg:flex-row gap-6">
 <div className="flex-1 space-y-4">
 <Skeleton className="h-40 w-full" />
 <Skeleton className="h-52 w-full" />
 </div>
 <div className="w-full lg:w-72 flex-shrink-0">
 <Skeleton className="h-80 w-full" />
 </div>
 </div>
 </div>
 </div>
 );
}

 const displayServices = editMode ? draftServices : designer.services || [];
 const displayAesthetics = editMode ? draftAesthetics : designer.aesthetics || [];
 const displayRate = editMode ? draftRate : designer.hourlyRate;
 const displayProfilePhoto = editMode ? draftProfilePhoto : designer.profilePhoto;
 const displayBio = editMode ? draftBio : designer.bio;
 const displayName = editMode ? draftName : designer.name;
 const displayLocation = editMode ? draftLocation : designer.location ||"Sri Lanka";
 const displayPortfolioImages = editMode ? draftPortfolioImages : designer.portfolioImages || [];
 const reviews = designer.reviews || DEFAULT_DESIGNER.reviews;

 return (
 <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50">

 {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
 <div className="bg-gradient-to-r from-fuchsia-800 via-purple-700 to-violet-800 relative overflow-hidden">
 {/* Decorative elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full" />
 <div className="absolute top-4 right-32 w-32 h-32 rounded-full" />
 <div className="absolute -bottom-6 left-10 w-48 h-48 rounded-full bg-fuchsia-900/30" />
 </div>

 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
 {/* Edit / Save / Cancel buttons */}
 <div className="flex justify-end mb-6 gap-2">
 {isOwner && !editMode && (
 <button onClick={enterEditMode}
 className="flex items-center gap-2 px-4 py-2 rounded-xl hover: border text-sm font-semibold transition-all duration-200 backdrop-blur-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
 </svg>
 Edit Profile
 </button>
 )}
 {editMode && (
 <>
 <button onClick={cancelEdit}
 className="px-4 py-2 rounded-xl hover: border text-sm font-medium transition-all duration-200">
 Cancel
 </button>
 <button onClick={handleSave} disabled={saving}
 className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-sm font-semibold transition-colors shadow-lg">
 {saving ? (
 <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 12a9 9 0 1 1-6.219-8.56" />
 </svg>
 ) : (
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 )}
 {saving ?"Saving…" :"Save Changes"}
 </button>
 </>
 )}
 </div>

 {/* Profile identity row */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
 {/* Avatar */}
 <div className="relative flex-shrink-0">
 {displayProfilePhoto ? (
 <img src={displayProfilePhoto} alt={designer.name}
 className="w-24 h-24 rounded-2xl object-cover border-4 shadow-xl" />
 ) : (
 <div className="w-24 h-24 rounded-2xl border-4 shadow-xl flex items-center justify-center text-4xl font-extrabold backdrop-blur-sm">
 {designer.name?.charAt(0).toUpperCase()}
 </div>
 )}
 {/* Verified badge */}
 <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-400 rounded-full border-2 flex items-center justify-center shadow-md">
 <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24"
 fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 </div>
 {editMode && (
 <>
 <button onClick={() => profilePhotoRef.current.click()} disabled={uploadingPhoto}
 className="absolute inset-0 w-24 h-24 rounded-2xl flex items-center justify-center text-xs font-semibold hover: transition-colors">
 {uploadingPhoto ?"Uploading…" :"Change"}
 </button>
 <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden"
 onChange={handleProfilePhotoChange} />
 </>
 )}
 </div>

 {/* Name, role, rating */}
 <div className="flex-1 min-w-0">
 <div className="flex flex-wrap items-center gap-2 mb-1">
 {editMode ? (
 <input type="text" value={draftName} onChange={(e) => setDraftName(e.target.value)}
 className="text-2xl font-extrabold leading-tight px-3 py-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 w-full max-w-sm"
 placeholder="Your Name"
 />
 ) : (
 <h1 className="text-3xl font-extrabold leading-tight">
 {displayName}
 </h1>
 )}
 <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm">
 ✦ Master Designer
 </span>
 </div>

 <div className="flex flex-wrap items-center gap-4 mt-2">
 {/* Rating */}
 <div className="flex items-center gap-1.5 rounded-full px-3 py-1 border">
 <StarIcon size={14} filled />
 <span className="text-yellow-300 font-bold text-sm">{designer.rating?.toFixed(1)}</span>
 <span className="text-fuchsia-200 text-xs">/ 5.0</span>
 </div>
 {/* Reviews count */}
 <div className="flex items-center gap-1.5 text-fuchsia-200 text-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
 </svg>
 <span>{reviews.length} reviews</span>
 </div>
 {/* Location placeholder */}
 <div className="flex items-center gap-1.5 text-fuchsia-200 text-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
 {editMode ? (
 <input type="text" value={draftLocation} onChange={(e) => setDraftLocation(e.target.value)}
 className="text-sm px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded w-48"
 placeholder="e.g. Colombo, Sri Lanka"
 />
 ) : (
 <span>{displayLocation}</span>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* ── Page body ─────────────────────────────────────────────────────────── */}
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <div className="flex flex-col lg:flex-row gap-6">

 {/* ══════════════════════════════════════════════════════════
 LEFT COLUMN
 ══════════════════════════════════════════════════════════ */}
 <div className="flex-1 flex flex-col gap-6 min-w-0">

 {/* ── Bio card ── */}
 <div className="rounded-2xl border border-fuchsia-100 shadow-sm p-6">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-7 h-7 rounded-lg bg-fuchsia-100 flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
 <circle cx="12" cy="7" r="4" />
 </svg>
 </div>
 <h2 className="font-bold text-sm">About Me</h2>
 </div>
 {editMode ? (
 <textarea
 className="w-full text-base leading-relaxed resize-none border border-fuchsia-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-fuchsia-50/40"
 rows={4}
 value={draftBio}
 onChange={(e) => setDraftBio(e.target.value)}
 placeholder="Share the story behind your fashion designing journey…"
 />
 ) : (
 <p className="text-base leading-relaxed">{displayBio}</p>
 )}
 </div>

 {/* ── Portfolio gallery ── */}
 <PortfolioGallery
 images={displayPortfolioImages}
 editMode={editMode}
 onAddImages={handleAddPortfolioImages}
 onDeleteImage={handleDeletePortfolioImage}
 />

 {/* ── Reviews section ── */}
 <div>
 <div className="flex items-center gap-2 mb-4">
 <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
 fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 </div>
 <h2 className="font-bold text-sm">Customer Reviews</h2>
 <div className="flex items-center gap-1.5 ml-1 px-2.5 py-0.5 rounded-full bg-yellow-50 border border-yellow-100">
 <StarIcon size={10} filled />
 <span className="text-yellow-600 font-bold text-xs">{designer?.rating?.toFixed(1) ||"5.0"}</span>
 <span className="text-yellow-500 text-xs">· {reviews.length} reviews</span>
 </div>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {reviews.map((review, idx) => (
 <ReviewCard key={review.id ?? idx} review={review} />
 ))}
 </div>
 </div>
 </div>

 {/* ══════════════════════════════════════════════════════════
 RIGHT COLUMN — Quick Info Sidebar
 ══════════════════════════════════════════════════════════ */}
 <div className="w-full lg:w-72 flex-shrink-0">
 <div className="rounded-2xl border border-fuchsia-100 shadow-sm overflow-hidden sticky top-24">

 {/* Top accent band */}
 <div className="h-2 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500" />

 <div className="p-6 flex flex-col gap-5">
 {/* Hourly Rate */}
 <div className="pb-4 border-b">
 <p className="text-xs font-medium uppercase tracking-wider mb-1">Hourly Rate</p>
 {editMode ? (
 <input
 type="number"
 value={draftRate}
 onChange={(e) => setDraftRate(e.target.value)}
 className="border border-fuchsia-200 rounded-xl px-3 py-2 text-fuchsia-700 font-extrabold text-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400 w-full bg-fuchsia-50/40"
 />
 ) : (
 <p className="text-fuchsia-700 font-extrabold text-2xl">
 LKR {Number(displayRate).toLocaleString()}
 </p>
 )}
 </div>

 {/* Design Services */}
 <div>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-5 h-5 rounded-md bg-fuchsia-100 flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
 fill="none" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="m18 16 4-4-4-4" />
 <path d="m6 8-4 4 4 4" />
 <path d="m14.5 4-5 16" />
 </svg>
 </div>
 <p className="font-bold text-sm">Design Services</p>
 </div>
 <div className="flex flex-wrap gap-2">
 {displayServices.map((s, i) => (
 <Tag key={i} label={s} editMode={editMode} colorScheme="purple"
 onRemove={() => setDraftServices((prev) => prev.filter((_, idx) => idx !== i))} />
 ))}
 </div>
 {editMode && (
 <div className="flex gap-2 mt-2">
 <input type="text" value={newServiceInput}
 onChange={(e) => setNewServiceInput(e.target.value)}
 placeholder="Add service…"
 className="flex-1 border border-fuchsia-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-fuchsia-400 bg-fuchsia-50/40"
 onKeyDown={(e) => {
 if (e.key ==="Enter" && newServiceInput.trim()) {
 setDraftServices((prev) => [...prev, newServiceInput.trim()]);
 setNewServiceInput("");
}
}} />
 <button onClick={() => {
 if (newServiceInput.trim()) {
 setDraftServices((prev) => [...prev, newServiceInput.trim()]);
 setNewServiceInput("");
}
}}
 className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-sm font-bold transition-colors">
 +
 </button>
 </div>
 )}
 </div>

 {/* Aesthetics / Style Traits */}
 <div>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-5 h-5 rounded-md flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
 fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10"/>
 <circle cx="12" cy="12" r="6"/>
 <circle cx="12" cy="12" r="2"/>
 </svg>
 </div>
 <p className="font-bold text-sm">Aesthetics</p>
 </div>
 <div className="flex flex-wrap gap-2">
 {displayAesthetics.map((a, i) => (
 <Tag key={i} label={a} editMode={editMode} colorScheme="indigo"
 onRemove={() => setDraftAesthetics((prev) => prev.filter((_, idx) => idx !== i))} />
 ))}
 </div>
 {editMode && (
 <div className="flex gap-2 mt-2">
 <input type="text" value={newAestheticInput}
 onChange={(e) => setNewAestheticInput(e.target.value)}
 placeholder="Add aesthetic…"
 className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
 onKeyDown={(e) => {
 if (e.key ==="Enter" && newAestheticInput.trim()) {
 setDraftAesthetics((prev) => [...prev, newAestheticInput.trim()]);
 setNewAestheticInput("");
}
}} />
 <button onClick={() => {
 if (newAestheticInput.trim()) {
 setDraftAesthetics((prev) => [...prev, newAestheticInput.trim()]);
 setNewAestheticInput("");
}
}}
 className="px-3 py-1.5 rounded-lg hover: text-sm font-bold transition-colors">
 +
 </button>
 </div>
 )}
 </div>

 {/* Divider */}
 <hr className="" />

 {/* CTA Buttons */}
 <div className="flex flex-col gap-2.5">
 {/* Contact Me — primary */}
 <button onClick={() => alert("Redirecting to Consultation form...")} className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200">
 Consultation Request
 </button>

 <div className="flex gap-2">
 <button onClick={() => alert("Initiating Hire Request...")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-fuchsia-200 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors">
 <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
 Hire Now
 </button>
 <button onClick={() => setIsSaved(!isSaved)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-fuchsia-200 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-300 transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" 
 fill={isSaved ?"#ef4444" :"none"} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
 </svg>
 {isSaved ?"Saved" :"Save"}
 </button>
 </div>

 {/* Share Profile */}
 <button onClick={handleShare}
 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium hover: hover: transition-colors">
 <ShareIcon size={14} />
 Share Profile
 </button>
 </div>

 {/* Trust badge */}
 <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
 </svg>
 <p className="text-emerald-700 text-xs font-medium">Verified ClothStreet Designer</p>
 </div>
 </div>
 </div>
 </div>

 </div>
 </div>
 </div>
 );
}


// ── DesignerDashboard.jsx ──
import { useState, useEffect} from"react";
import { collection, query, where, getDocs, doc, updateDoc} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import { useNavigate} from"react-router-dom";

// ─────────────────────────────────────────────────────────────
// Status badge colours (matches seller dashboard pattern)
// ─────────────────────────────────────────────────────────────
const statusColours = {
"In Progress":"bg-orange-100 text-orange-600",
"Ready to Deliver":"",
"Pending":"",
"Completed":"bg-green-100 text-green-600",
"Accepted":"",
"New":"bg-orange-100 text-orange-600",
};

// ─────────────────────────────────────────────────────────────
// Mock / fallback data
// ─────────────────────────────────────────────────────────────
const FALLBACK_REQUESTS = [
 { id:"mock_req_1", customer:"Hiruni Siriwardena", status:"New", description:"Evening Gown Design (Custom)", price:"LKR 25,000", due:"Due next week"},
 { id:"mock_req_2", customer:"Studio Red", status:"New", description:"Bridal Wear Sketches (3 items)", price:"LKR 45,000", due:"Due tomorrow"},
 { id:"mock_req_3", customer:"Amandi Perera", status:"Accepted", description:"Casual Dress Pattern", price:"LKR 8,500", due:"Due in 3 days"},
];

const FALLBACK_ORDERS = [
 { id:"mock_ord_1", itemName:"Evening Gown Project", customerName:"Hiruni Siriwardena", status:"In Progress", total: 25000},
 { id:"mock_ord_2", itemName:"Bridal Accessories", customerName:"Kavindi Silva", status:"Ready to Deliver", total: 15000},
 { id:"mock_ord_3", itemName:"Summer Collection", customerName:"Amaya Fernando", status:"Completed", total: 35000},
];

const FALLBACK_REVIEWS = [
 { id:"rev_1", stars: 5, quote:"Amazing design concepts! Captured exactly what I wanted for my wedding.", name:"Nilushi B.", timeAgo:"2 days ago"},
 { id:"rev_2", stars: 5, quote:"Very professional and creative. Will definitely hire again.", name:"Tariq R.", timeAgo:"1 week ago"},
 { id:"rev_3", stars: 4, quote:"Great work on the patterns, just a small adjustment needed on the sleeves.", name:"Amaya F.", timeAgo:"2 weeks ago"},
];

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function DesignerDashboard() {
 const navigate = useNavigate();
 const { user} = useAuth();

 const [orders, setOrders] = useState([]);
 const [jobRequests, setJobRequests] = useState([]);
 const [reviews, setReviews] = useState([]);
 const [stats, setStats] = useState({ active: 0, inProgress: 0, readyToDeliver: 0, completed: 0});
 const [loading, setLoading] = useState(true);

 // Redirect non-designers away
 useEffect(() => {
 if (user && user.role !=="designer") {
 navigate("/");
}
}, [user, navigate]);

 // ── Firestore reads ──
 useEffect(() => {
 if (!user) return;
 const fetchData = async () => {
 try {
 const uid = user.uid;

 // Orders
 const ordersSnap = await getDocs(query(collection(db,"orders"), where("designerId","==", uid)));
 const allOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data()}));
 const counts = { active: 0, inProgress: 0, readyToDeliver: 0, completed: 0};
 allOrders.forEach((o) => {
 const s = (o.status ||"").toLowerCase();
 if (["confirmed","in progress","fabric ordered","ready to deliver"].includes(s)) counts.active++;
 if (s ==="in progress") counts.inProgress++;
 if (s ==="ready to deliver") counts.readyToDeliver++;
 if (s ==="completed") counts.completed++;
});
 setStats(counts);
 const sorted = [...allOrders].sort((a, b) => {
 const toMs = (v) => v?.toDate?.().getTime() ?? new Date(v ?? 0).getTime();
 return toMs(b.createdAt) - toMs(a.createdAt);
});
 setOrders(sorted.length > 0 ? sorted.slice(0, 5) : FALLBACK_ORDERS);

 // Job Requests
 const reqSnap = await getDocs(query(collection(db,"jobRequests"), where("designerId","==", uid)));
 const reqs = reqSnap.docs.map((d) => ({ id: d.id, ...d.data()}));
 setJobRequests(reqs.length > 0 ? reqs : FALLBACK_REQUESTS);

 // Reviews
 const revSnap = await getDocs(query(collection(db,"reviews"), where("designerId","==", uid)));
 const revs = revSnap.docs.map((d) => ({ id: d.id, ...d.data()}));
 setReviews(revs.length > 0 ? revs : FALLBACK_REVIEWS);
} catch (err) {
 console.error("DesignerDashboard fetch error:", err);
 setOrders(FALLBACK_ORDERS);
 setJobRequests(FALLBACK_REQUESTS);
 setReviews(FALLBACK_REVIEWS);
} finally {
 setLoading(false);
}
};
 fetchData();
}, [user]);

 // ── Accept / Decline handlers ──
 const handleAccept = async (id) => {
 try {
 await updateDoc(doc(db,"jobRequests", id), { status:"Accepted"});
} catch (e) { console.error(e);}
 setJobRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status:"Accepted"} : r)));
};
 const handleDecline = async (id) => {
 try {
 await updateDoc(doc(db,"jobRequests", id), { status:"Declined"});
} catch (e) { console.error(e);}
 setJobRequests((prev) => prev.filter((r) => r.id !== id));
};

 // ── Helper ──
 const formatDate = (raw) => {
 if (!raw) return"";
 const d = raw?.toDate ? raw.toDate() : new Date(raw);
 return d.toLocaleDateString("en-GB", { day:"numeric", month:"short"});
};

 const displayName = user?.name || user?.email ||"Designer";
 const avatarLetter = displayName.charAt(0).toUpperCase();
 const newReqCount = jobRequests.filter((r) => (r.status ||"").toLowerCase() ==="new").length;

 // ── Stat cards data (same style as seller dashboard) ──
 const statsData = [
 {
 label:"Active Orders", value: stats.active,
 color:"", bg:"",
 icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M12 6v6l4 2" /></svg>,
},
 {
 label:"In Progress", value: stats.inProgress,
 color:"text-orange-500", bg:"bg-orange-50",
 icon: <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>,
},
 {
 label:"Ready to Deliver", value: stats.readyToDeliver,
 color:"", bg:"",
 icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1" strokeWidth="2" /><path strokeWidth="2" d="M16 8h4l3 5v3h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>,
},
 {
 label:"Completed", value: stats.completed,
 color:"text-green-600", bg:"bg-green-50",
 icon: <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M9 12l2 2 4-4" /></svg>,
},
 ];

 // ── Loading / error screens (same as seller dashboard) ──
 if (loading) return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="flex flex-col items-center gap-3">
 <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
 <p className="text-sm font-medium">Loading your dashboard…</p>
 </div>
 </div>
 );

 return (
 <div className="min-h-screen font-sans flex flex-col">

 {/* ── Purple Header Bar (same style as seller) ── */}
 <div className="px-6 py-5 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
 {avatarLetter}
 </div>
 <div>
 <p className="text-sm">
 Good {new Date().getHours() < 12 ?"morning" : new Date().getHours() < 18 ?"afternoon" :"evening"},
 </p>
 <p className="font-bold text-xl leading-tight">{displayName}</p>
 <div className="flex items-center gap-2 mt-1">
 <span className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium">
 Fashion Designer
 </span>
 {newReqCount > 0 && (
 <span className="inline-block text-xs bg-orange-400 px-2.5 py-0.5 rounded-full font-bold">
 {newReqCount} new request{newReqCount !== 1 ?"s" :""}
 </span>
 )}
 </div>
 </div>
 </div>
 <button onClick={() => navigate("/designer-profile")}
 className="flex items-center gap-2 hover: border px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
 </svg>
 My Profile
 </button>
 </div>

 <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

 {/* ── Stat Cards (same style as seller) ── */}
 <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {statsData.map((stat) => (
 <div key={stat.label}
 className="rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow">
 <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
 {stat.icon}
 </div>
 <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
 <p className="text-sm mt-1">{stat.label}</p>
 </div>
 ))}
 </section>

 {/* ── Earnings + Ratings row ── */}
 <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {/* Total Earnings */}
 <div className="rounded-2xl p-5 relative overflow-hidden">
 <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-50" />
 <div className="absolute -right-2 -top-4 w-16 h-16 rounded-full opacity-30" />
 <div className="relative">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" />
 <path strokeWidth="2" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
 </svg>
 </div>
 <p className="text-sm font-medium mb-1">Total Earnings</p>
 <h3 className="font-bold text-3xl mb-1">LKR 65,000</h3>
 <p className="text-sm mb-4 leading-snug">from 8 completed orders</p>
 <div className="flex items-center gap-1.5 border rounded-full px-3 py-1 w-fit">
 <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
 <polyline points="16 7 22 7 22 13" />
 </svg>
 <span className="text-green-400 text-sm font-semibold">+24% vs last month</span>
 </div>
 </div>
 </div>

 {/* Ratings & Reviews */}
 <div className="rounded-2xl shadow-sm border overflow-hidden">
 <div className="flex items-center justify-between px-5 py-4 border-b">
 <div className="flex items-center gap-2">
 <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 <h3 className="font-bold text-sm">Ratings & Reviews</h3>
 </div>
 <div className="flex items-center gap-1.5">
 <div className="flex gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => (
 <svg key={s} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 ))}
 </div>
 <span className="text-amber-500 font-bold text-sm">4.9</span>
 <span className="text-sm">(124 reviews)</span>
 </div>
 </div>
 <div className="px-5 py-4 flex flex-col gap-2">
 {[
 { stars: 5, count: 110, max: 110},
 { stars: 4, count: 10, max: 110},
 { stars: 3, count: 4, max: 110},
 { stars: 2, count: 0, max: 110},
 { stars: 1, count: 0, max: 110},
 ].map((row) => (
 <div key={row.stars} className="flex items-center gap-3">
 <span className="text-sm w-4 text-right">{row.stars}</span>
 <svg className="w-3.5 h-3.5 text-amber-400 fill-current flex-shrink-0" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 <div className="flex-1 h-2 rounded-full overflow-hidden">
 <div className="h-full bg-amber-400 rounded-full transition-all duration-500"
 style={{ width:`${row.max > 0 ? (row.count / row.max) * 100 : 0}%`}} />
 </div>
 <span className="text-sm w-6 text-right">{row.count}</span>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── Quotation Inbox Quick Access ── */}
 <div
 onClick={() => navigate("/quotation-inbox")}
 className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl shadow-md p-5 flex items-center justify-between cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all group"
 >
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl border flex items-center justify-center">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <div>
 <h3 className="font-bold text-base">Quote Requests</h3>
 <p className="text-sm">View and respond to customer quote requests</p>
 </div>
 </div>
 <div className="group-hover: transition-colors">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
 </svg>
 </div>
 </div>

 {/* ── Order Requests + Recent Orders (3-col like seller) ── */}
 <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

 {/* Order Requests — takes 2 cols */}
 <div className="lg:col-span-2 rounded-2xl shadow-sm border overflow-hidden">
 <div className="flex items-center justify-between px-6 py-4 border-b">
 <div className="flex items-center gap-2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
 <circle cx="9" cy="7" r="4" strokeWidth="2" />
 <path strokeWidth="2" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
 </svg>
 <h2 className="font-bold">Order Requests</h2>
 </div>
 {newReqCount > 0 && (
 <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-500">
 {newReqCount} new
 </span>
 )}
 </div>
 {jobRequests.length === 0 ? (
 <div className="px-6 py-10 text-center text-sm">No requests yet.</div>
 ) : (
 <div className="divide-y divide-gray-50">
 {jobRequests.map((req) => (
 <div key={req.id} className="px-6 py-4 hover: transition-colors">
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <p className="font-semibold text-sm">{req.customerName || req.customer}</p>
 <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColours[req.status] ||""}`}>
 {req.status}
 </span>
 </div>
 <span className="font-bold text-sm whitespace-nowrap">
 {req.price}
 </span>
 </div>
 <p className="text-xs mb-2">{req.description || req.item} · {req.dueDate || req.due}</p>
 <div className="flex items-center gap-2">
 {(req.status ||"").toLowerCase() ==="new" ? (
 <>
 <button onClick={() => handleAccept(req.id)}
 className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold border border-emerald-200 transition-colors">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
 Accept
 </button>
 <button onClick={() => handleDecline(req.id)}
 className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg hover: text-xs font-semibold border transition-colors">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
 Decline
 </button>
 </>
 ) : (
 <span className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
 ✓ Accepted
 </span>
 )}
 <button className="w-8 h-8 flex items-center justify-center rounded-lg border hover: hover: transition-colors ml-auto flex-shrink-0">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
 </svg>
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Right column — Active Orders + Earnings summary */}
 <div className="flex flex-col gap-4">
 {/* Active & Recent Orders */}
 <div className="rounded-2xl shadow-sm border overflow-hidden">
 <div className="flex items-center justify-between px-5 py-4 border-b">
 <div className="flex items-center gap-2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
 </svg>
 <h3 className="font-bold text-sm">Active Orders</h3>
 </div>
 <button onClick={() => navigate("/orders")}
 className="text-sm hover: font-semibold flex items-center gap-1">
 View all
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
 </button>
 </div>
 {orders.length === 0 ? (
 <div className="px-5 py-6 text-center text-sm">No orders yet.</div>
 ) : (
 <div className="divide-y divide-gray-50">
 {orders.map((order) => (
 <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover: transition-colors">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
 </svg>
 </div>
 <div>
 <p className="font-semibold text-sm">{order.itemName || order.item || order.name ||"Order"}</p>
 <p className="text-xs">{order.customerName || order.clientName} · {formatDate(order.createdAt)}</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColours[order.status] ||""}`}>
 {order.status}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Top Rated Reviews summary */}
 <div className="rounded-2xl shadow-sm border overflow-hidden">
 <div className="flex items-center gap-2 px-5 py-4 border-b">
 <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 <h3 className="font-bold text-sm">Recent Reviews</h3>
 </div>
 {reviews.length === 0 ? (
 <div className="px-5 py-6 text-center text-sm">No reviews yet.</div>
 ) : (
 <div className="divide-y divide-gray-50">
 {reviews.map((review) => {
 const rName = review.reviewerName || review.name ||"Customer";
 const avatarColors = ["","","bg-rose-500","bg-emerald-500"];
 const color = avatarColors[rName.charCodeAt(0) % avatarColors.length];
 return (
 <div key={review.id} className="px-5 py-3.5 hover: transition-colors">
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-xs font-bold`}>
 {rName.charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="font-semibold text-sm">{rName}</p>
 <p className="text-xs">{review.timeAgo ||"Recently"}</p>
 </div>
 </div>
 <div className="flex gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => (
 <svg key={s} className={`w-3.5 h-3.5 ${s <= (review.stars || review.rating || 0) ?"text-amber-400" :""} fill-current`} viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 ))}
 </div>
 </div>
 <p className="text-xs italic leading-snug pl-9">"{review.quote || review.text}"</p>
 </div>
 );
})}
 </div>
 )}
 </div>
 </div>
 </section>

 </main>
 </div>
 );
}


// ── FindTailorDesigner.jsx ──
import { useState, useEffect} from"react";
import { collection, getDocs} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useNavigate} from"react-router-dom";
import designersData from"../data/designersData";

export default function FindTailorDesigner() {
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState("All");
 const [searchQuery, setSearchQuery] = useState("");
 const [tailors, setTailors] = useState([]);
 const [loading, setLoading] = useState(true);

 // Fetch tailors from Firestore
 useEffect(() => {
 async function fetchTailors() {
 try {
 const snapshot = await getDocs(collection(db,"tailors"));
 const data = snapshot.docs.map((doc) => ({
 id: doc.id,
 ...doc.data(),
 providerType:"tailor",
}));
 setTailors(data);
} catch (err) {
 console.error("Error fetching tailors:", err);
} finally {
 setLoading(false);
}
}
 fetchTailors();
}, []);

 // Map designers to a consistent shape
 const designers = designersData.map((d) => ({
 id:`designer-${d.id}`,
 name: d.name,
 location: d.location,
 rating: d.rating,
 specializations: d.specialties,
 experience: parseInt(d.experience) || 0,
 orders: parseInt(d.projects) || 0,
 priceMin: parseInt(d.priceRange?.replace(/[^\d]/g,"")) || 0,
 status: d.status,
 image: d.image,
 providerType:"designer",
}));

 // All providers combined
 const allProviders = [
 ...tailors,
 ...designers,
 ];

 // Filter by tab + search
 const filteredProviders = allProviders.filter((p) => {
 if (activeTab ==="Tailors" && p.providerType !=="tailor") return false;
 if (activeTab ==="Designers" && p.providerType !=="designer") return false;

 if (searchQuery) {
 const q = searchQuery.toLowerCase();
 const nameMatch = p.name?.toLowerCase().includes(q);
 const locationMatch = p.location?.toLowerCase().includes(q);
 const specMatch = p.specializations?.some((s) =>
 s.toLowerCase().includes(q)
 );
 return nameMatch || locationMatch || specMatch;
}
 return true;
});

 const handleSelectProvider = (provider) => {
 // Navigate to request quote page with the provider id
 navigate(`/request-quote/${provider.id}`, {
 state: { provider},
});
};

 return (
 <div className="min-h-screen">
 {/* ───────────── HERO BANNER ───────────── */}
 <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-16 px-4">
 {/* Decorative orbs */}
 <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" />

 <div className="max-w-5xl mx-auto relative z-10">
 {/* Back Button */}
 <button
 onClick={() => navigate("/checkout", { state: { step: 2}})}
 className="absolute -top-4 left-0 inline-flex items-center gap-2 text-sm font-semibold hover: transition-colors cursor-pointer"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 Back to Checkout
 </button>

 <div className="text-center pt-8">
 {/* Label pill */}
 <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-5">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
 </svg>
 Checkout · Custom Service
 </span>

 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
 Find a{""}
 <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
 Tailor or Designer
 </span>
 </h1>
 <p className="text-base text-violet-200/70 max-w-lg mx-auto">
 Choose a professional to custom-make your purchased fabrics into exactly what you envision
 </p>
 </div>
 </div>
 </section>

 {/* ───────────── SEARCH + TABS ───────────── */}
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
 <div className="rounded-2xl shadow-xl shadow-gray-200/60 border p-4 sm:p-5">
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
 {/* Search */}
 <div className="relative flex-1">
 <div className="absolute left-4 top-1/2 -translate-y-1/2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </div>
 <input
 type="text"
 placeholder="Search by name, location, or specialization..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full border focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl pl-12 pr-4 py-3 text-sm placeholder-gray-400 outline-none transition-all duration-200"
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery("")}
 className="absolute right-3 top-1/2 -translate-y-1/2 hover: transition-colors cursor-pointer"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 )}
 </div>

 {/* Tab Pills */}
 <div className="flex items-center gap-1 rounded-xl p-1">
 {["All","Tailors","Designers"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
 activeTab === tab
 ?"bg-violet-600 shadow-md shadow-violet-200"
 :" hover: hover:"
}`}
 >
 {tab}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* ───────────── RESULTS COUNT ───────────── */}
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
 <p className="text-sm">
 <span className="font-semibold">
 {loading ?"..." : filteredProviders.length}
 </span>{""}
 professionals found
 </p>
 </div>

 {/* ───────────── PROVIDERS GRID ───────────── */}
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
 {loading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div
 key={i}
 className="rounded-2xl border overflow-hidden shadow-sm animate-pulse"
 >
 <div className="h-3 bg-gradient-to-r from-violet-200 to-purple-200 rounded-t-2xl" />
 <div className="p-6 space-y-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-xl" />
 <div className="flex-1 space-y-2">
 <div className="h-4 rounded w-2/3" />
 <div className="h-3 rounded w-1/3" />
 </div>
 </div>
 <div className="flex gap-2">
 <div className="h-6 w-20 rounded-full" />
 <div className="h-6 w-16 rounded-full" />
 </div>
 <div className="h-10 rounded-xl w-full mt-2" />
 </div>
 </div>
 ))}
 </div>
 ) : filteredProviders.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
 {filteredProviders.map((provider) => (
 <div
 key={provider.id}
 className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
 onClick={() => handleSelectProvider(provider)}
 >
 {/* Top accent bar */}
 <div
 className={`h-1.5 w-full ${
 provider.providerType ==="tailor"
 ?"bg-gradient-to-r from-violet-500 to-purple-500"
 :"bg-gradient-to-r from-rose-500 to-pink-500"
}`}
 />

 <div className="p-6 flex flex-col flex-grow">
 {/* Header */}
 <div className="flex items-start gap-3.5 mb-4">
 {/* Avatar / Image */}
 <div
 className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
 provider.providerType ==="tailor"
 ?"bg-gradient-to-br from-violet-500 to-purple-600"
 :"bg-gradient-to-br from-rose-500 to-pink-600"
}`}
 >
 {provider.name?.charAt(0) ||"?"}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-base font-bold truncate group-hover:text-violet-700 transition-colors">
 {provider.name}
 </h3>
 <div className="flex items-center gap-1 mt-0.5">
 <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 <span className="text-sm truncate">
 {provider.location}
 </span>
 </div>
 </div>
 {/* Rating badge */}
 <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg shrink-0">
 <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
 </svg>
 <span className="text-xs font-bold text-amber-700">
 {provider.rating?.toFixed(1) ||"N/A"}
 </span>
 </div>
 </div>

 {/* Type badge + specializations */}
 <div className="flex flex-wrap gap-1.5 mb-4">
 <span
 className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
 provider.providerType ==="tailor"
 ?"bg-violet-100 text-violet-700 border border-violet-200"
 :"bg-rose-100 text-rose-700 border border-rose-200"
}`}
 >
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 {provider.providerType ==="tailor" ? (
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
 ) : (
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
 )}
 </svg>
 {provider.providerType}
 </span>
 {provider.specializations?.slice(0, 2).map((spec, idx) => (
 <span
 key={idx}
 className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border"
 >
 {spec}
 </span>
 ))}
 </div>

 {/* Stats row */}
 <div className="grid grid-cols-2 gap-2.5 mb-5 flex-grow">
 <div className="rounded-xl p-3 border">
 <div className="text-xs font-medium mb-0.5">Orders</div>
 <div className="text-sm font-bold">{provider.orders || 0}+</div>
 </div>
 <div className="rounded-xl p-3 border">
 <div className="text-xs font-medium mb-0.5">Experience</div>
 <div className="text-sm font-bold">{provider.experience || 0} yrs</div>
 </div>
 </div>

 {/* CTA */}
 <button
 className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
 provider.providerType ==="tailor"
 ?"bg-violet-600 hover:bg-violet-700 shadow-violet-200"
 :"bg-rose-600 hover:bg-rose-700 shadow-rose-200"
}`}
 onClick={(e) => {
 e.stopPropagation();
 handleSelectProvider(provider);
}}
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 Request Quote
 </button>
 </div>
 </div>
 ))}
 </div>
 ) : (
 /* Empty state */
 <div className="rounded-3xl border border-dashed p-12 text-center mt-6">
 <div className="w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </div>
 <h3 className="text-lg font-bold mb-2">No professionals found</h3>
 <p className="max-w-sm mx-auto mb-6">
 Try adjusting your search or clearing filters.
 </p>
 <button
 onClick={() => {
 setSearchQuery("");
 setActiveTab("All");
}}
 className="inline-flex items-center gap-2 px-5 py-2.5 border hover: text-sm font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
 </svg>
 Clear all filters
 </button>
 </div>
 )}
 </div>

 {/* ───────────── BACK LINK ───────────── */}
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
 <button
 onClick={() => navigate("/checkout", { state: { step: 2}})}
 className="inline-flex items-center gap-2 text-sm font-semibold hover:text-violet-600 transition-colors cursor-pointer"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 Back to Checkout
 </button>
 </div>
 </div>
 );
}


// ── ForgotPassword.jsx ──
import React, { useState} from'react';
import { Link} from'react-router-dom';
import { useAuth} from'../context/AuthContext';

export default function ForgotPassword() {
 const [email, setEmail] = useState('');
 const [error, setError] = useState('');
 const [message, setMessage] = useState('');
 const [loading, setLoading] = useState(false);

 const { resetPassword} = useAuth();

 async function handleSubmit(e) {
 e.preventDefault();
 setError('');
 setMessage('');
 setLoading(true);
 try {
 await resetPassword(email);
 setMessage('Check your inbox — we\'ve sent a password reset link to' + email);
} catch (err) {
 if (err.code ==='auth/user-not-found') {
 setError('No account found with that email address.');
} else if (err.code ==='auth/invalid-email') {
 setError('Please enter a valid email address.');
} else {
 setError('Failed to send reset email. Please try again.');
}
}
 setLoading(false);
}

 return (
 <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

 {/* Background Image */}
 <div className="absolute inset-0">
 <img
 src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1920&q=80"
 alt="Textile background"
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-violet-950/85 to-gray-900/90"></div>
 </div>

 {/* Decorative blurred orbs */}
 <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"></div>

 {/* Card */}
 <div className="relative z-10 w-full max-w-md mx-4">

 {/* Logo / Brand */}
 <div className="text-center mb-8">
 <Link to="/" className="inline-flex items-center gap-2">
 <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
 </svg>
 </div>
 <span className="text-lg font-bold tracking-tight">ClothStreet</span>
 </Link>
 <p className="text-xs mt-2 tracking-widest uppercase">Sri Lanka's Textile Ecosystem</p>
 </div>

 {/* Glass Card */}
 <div className="backdrop-blur-xl border rounded-3xl p-8 shadow-2xl shadow-black/40">

 {/* Icon */}
 <div className="flex justify-center mb-6">
 <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 rounded-2xl flex items-center justify-center">
 <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
 </svg>
 </div>
 </div>

 {/* Header */}
 <div className="mb-7 text-center">
 <span className="inline-block text-xs font-semibold tracking-widest text-violet-300 uppercase bg-violet-500/15 border border-violet-500/30 rounded-full px-3 py-1 mb-3">
 Password Reset
 </span>
 <h1 className="text-2xl font-bold">Forgot your password?</h1>
 <p className="text-sm mt-2">No worries — enter your email and we'll send you a reset link.</p>
 </div>

 {/* Error */}
 {error && (
 <div className="flex items-center gap-2 border px-4 py-3 rounded-xl mb-5 text-sm">
 <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 {error}
 </div>
 )}

 {/* Success */}
 {message && (
 <div className="flex items-start gap-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-4 rounded-xl mb-5 text-sm">
 <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <div>
 <p className="font-semibold text-emerald-200 mb-0.5">Email sent!</p>
 <p>{message}</p>
 </div>
 </div>
 )}

 {/* Form - only shown if not yet successfully sent */}
 {!message && (
 <form onSubmit={handleSubmit} className="space-y-4">
 {/* Email */}
 <div className="group">
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
 Email Address
 </label>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors duration-200">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
 </svg>
 </div>
 <input
 type="email"
 placeholder="you@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full border focus:border-violet-500/60 focus: rounded-xl pl-11 pr-4 py-3 text-sm placeholder-white/25 outline-none transition-all duration-200"
 required
 autoFocus
 />
 </div>
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={loading}
 className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-2"
 >
 {loading ? (
 <>
 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
 </svg>
 Sending...
 </>
 ) : (
 <>
 Send Reset Link
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
 </svg>
 </>
 )}
 </button>
 </form>
 )}

 {/* Back to login */}
 <p className="text-center text-sm mt-6">
 Remember your password?{''}
 <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200">
 Back to Sign In
 </Link>
 </p>
 </div>
 </div>
 </div>
 );
}


// ── Home.jsx ──
import { Link, useNavigate} from"react-router-dom";
import { useAuth} from"../context/AuthContext";
import heroImg from"../assets/textile-hero-bg.png";
import craftImg from"../assets/craftsperson-bg.png";
import"./Home.css";

export default function Home() {
 const { user, logout} = useAuth();
 const navigate = useNavigate();

 async function handleLogout() {
 await logout();
 navigate("/login");
}

 return (
 <div>
 {/* ============ HERO SECTION ============ */}
 <section className="hero-section">
 <img src={heroImg} alt="" className="hero-bg" />
 <div className="hero-overlay" />

 <div className="hero-content">
 {/* Badge */}
 <div className="hero-badge">
 <span className="hero-badge-dot" />
 Sri Lanka's #1 Textile Platform
 </div>

 {/* Headline */}
 <h1 className="hero-headline">
 The Unified Textile{""}
 <br />
 Ecosystem <span className="highlight">for Sri Lanka</span>
 </h1>

 {/* Subtitle */}
 <p className="hero-subtext">
 Connect with fabric suppliers, skilled tailors, and designers in one seamless
 platform. Transforming how Sri Lanka's textile industry operates — from fiber
 to fashion.
 </p>

 {user ? (
 /* ── Logged-in state ── */
 <div>
 <div className="hero-user-card">
 <p style={{ margin:"0 0 4px", fontSize:"13px", color:"rgba(209,213,219,0.7)"}}>
 Logged in as
 </p>
 <p className="hero-user-name">{user.name || user.email}</p>
 {user.email && user.name && (
 <p className="hero-user-email">{user.email}</p>
 )}
 <span className="hero-user-role">{user.role ||"user"}</span>
 </div>
 <button onClick={handleLogout} className="hero-logout-btn">
 Logout
 </button>
 </div>
 ) : (
 /* ── Logged-out state ── */
 <div>
 {/* CTA Buttons */}
 <div className="hero-cta-group">
 <Link to="/register" className="btn-primary-hero">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
 </svg>
 Register Now
 </Link>
 <Link to="/shop" className="btn-outline-hero">
 View Marketplace
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </Link>
 </div>

 {/* Search Bar */}
 <div className="hero-search">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(209,213,219,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 12, flexShrink: 0}}>
 <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
 </svg>
 <input type="text" placeholder="Search fabrics, tailors, designs..." />
 <button className="hero-search-btn" aria-label="Search">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </button>
 </div>
 </div>
 )}

 {/* Stats Row */}
 <div className="hero-stats">
 <div className="hero-stat">
 <span className="hero-stat-value">500<span className="accent">+</span></span>
 <span className="hero-stat-label">Fabric Suppliers</span>
 </div>
 <div className="hero-stat">
 <span className="hero-stat-value">1,200<span className="accent">+</span></span>
 <span className="hero-stat-label">Skilled Tailors</span>
 </div>
 <div className="hero-stat">
 <span className="hero-stat-value">10K<span className="accent">+</span></span>
 <span className="hero-stat-label">Orders Completed</span>
 </div>
 <div className="hero-stat">
 <span className="hero-stat-value">98<span className="accent">%</span></span>
 <span className="hero-stat-label">Satisfaction Rate</span>
 </div>
 </div>
 </div>
 </section>

 {/* ============ HOW IT WORKS SECTION ============ */}
 <section className="hiw-section">
 <div className="hiw-container">
 {/* Section Header */}
 <div className="hiw-header">
 <span className="hiw-label">Easy Process</span>
 <h2 className="hiw-title">How It Works</h2>
 <p className="hiw-subtitle">
 From finding the perfect fabric to getting your custom outfit — our platform
 makes every step seamless, transparent, and delightful.
 </p>
 </div>

 {/* Step Cards */}
 <div className="hiw-grid">
 {/* Step 1 */}
 <div className="hiw-card">
 <div className="hiw-step-number">1</div>
 <div className="hiw-icon-wrap">
 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
 </svg>
 </div>
 <h3 className="hiw-card-title">Browse & Select</h3>
 <p className="hiw-card-text">
 Explore thousands of premium fabrics from verified Sri Lankan suppliers. Filter by material, color, and price.
 </p>
 </div>

 {/* Step 2 */}
 <div className="hiw-card hiw-card-featured">
 <div className="hiw-step-number">2</div>
 <div className="hiw-icon-wrap hiw-icon-featured">
 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" />
 </svg>
 </div>
 <h3 className="hiw-card-title">Find Your Craftsperson</h3>
 <p className="hiw-card-text">
 Connect with skilled tailors and designers rated by the community. View portfolios, reviews, and pricing.
 </p>
 </div>

 {/* Step 3 */}
 <div className="hiw-card">
 <div className="hiw-step-number">3</div>
 <div className="hiw-icon-wrap">
 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
 </svg>
 </div>
 <h3 className="hiw-card-title">Track Production</h3>
 <p className="hiw-card-text">
 Monitor every stage of your order in real-time. From cutting to stitching, stay updated with live tracking.
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* ============ FIND CRAFTSPERSON SECTION ============ */}
 <section className="craft-section">
 <div className="craft-container">
 {/* Left — Image */}
 <div className="craft-image-col">
 <div className="craft-image-wrap">
 <img src={craftImg} alt="Premium Sri Lankan textiles" className="craft-image" />
 {/* Floating profile card */}
 <div className="craft-profile-card">
 <div className="craft-profile-avatar">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
 </svg>
 </div>
 <div>
 <p className="craft-profile-name">Kumara S.</p>
 <p className="craft-profile-role">Master Tailor · Colombo</p>
 </div>
 <div className="craft-profile-rating">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 <span>4.9</span>
 </div>
 </div>
 </div>
 </div>

 {/* Right — Content */}
 <div className="craft-content-col">
 <span className="craft-label">Expert Craftspeople</span>
 <h2 className="craft-title">
 Find the Perfect<br />
 Craftsperson for Your<br />
 Vision
 </h2>

 {/* Feature List */}
 <div className="craft-features">
 <div className="craft-feature">
 <div className="craft-feature-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 </div>
 <div>
 <p className="craft-feature-title">Verified Artisans</p>
 <p className="craft-feature-text">Every craftsperson is vetted for skill, reliability, and quality of work before joining our platform.</p>
 </div>
 </div>

 <div className="craft-feature">
 <div className="craft-feature-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
 </svg>
 </div>
 <div>
 <p className="craft-feature-title">Portfolio Reviews</p>
 <p className="craft-feature-text">Browse detailed portfolios with photos of past work, specializations, and customer reviews.</p>
 </div>
 </div>

 <div className="craft-feature">
 <div className="craft-feature-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
 </svg>
 </div>
 <div>
 <p className="craft-feature-title">Direct Communication</p>
 <p className="craft-feature-text">Chat directly with tailors and designers to discuss your requirements before placing an order.</p>
 </div>
 </div>
 </div>

 <Link to="/tailors" className="craft-cta">
 Browse Artisans
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </Link>
 </div>
 </div>
 </section>


 {/* ============ BUILT FOR INDUSTRY SECTION ============ */}
 <section className="industry-section">
 <div className="industry-container">
 {/* Header */}
 <div className="industry-header">
 <span className="industry-label">Why Choose Us</span>
 <h2 className="industry-title">Built for Sri Lanka's Textile Industry</h2>
 <p className="industry-subtitle">
 Everything you need to source, produce, and track your textile orders in one secure, unified platform.
 </p>
 </div>

 {/* 4 Feature Cards */}
 <div className="industry-grid">
 <div className="industry-card">
 <div className="industry-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
 </svg>
 </div>
 <h3 className="industry-card-title">Transparent Matching</h3>
 <p className="industry-card-text">
 Find exactly what you need with our AI-powered matching system that connects you with the right suppliers and tailors.
 </p>
 </div>

 <div className="industry-card">
 <div className="industry-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
 </svg>
 </div>
 <h3 className="industry-card-title">Verified Network</h3>
 <p className="industry-card-text">
 Every supplier and artisan in our ecosystem is strictly vetted to ensure premium quality and unparalleled reliability.
 </p>
 </div>

 <div className="industry-card">
 <div className="industry-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
 </svg>
 </div>
 <h3 className="industry-card-title">End-to-End Coverage</h3>
 <p className="industry-card-text">
 From discovering raw fabric to the final stitch of your custom garment — manage the entire lifecycle here.
 </p>
 </div>

 <div className="industry-card">
 <div className="industry-icon">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
 </svg>
 </div>
 <h3 className="industry-card-title">Secure & Efficient Workflow</h3>
 <p className="industry-card-text">
 Protect your transactions and manage orders with milestone tracking, secure payments, and instant notifications.
 </p>
 </div>
 </div>

 {/* Stats Row */}
 <div className="industry-stats">
 <div className="industry-stat">
 <div className="industry-stat-val">500<span className="accent">+</span></div>
 <div className="industry-stat-label">Verified Suppliers</div>
 </div>
 <div className="industry-stat">
 <div className="industry-stat-val">1,200<span className="accent">+</span></div>
 <div className="industry-stat-label">Skilled Tailors</div>
 </div>
 <div className="industry-stat">
 <div className="industry-stat-val">10K<span className="accent">+</span></div>
 <div className="industry-stat-label">Orders Processed</div>
 </div>
 <div className="industry-stat">
 <div className="industry-stat-val">98<span className="accent">%</span></div>
 <div className="industry-stat-label">Success Rate</div>
 </div>
 </div>
 </div>
 </section>


 {/* ============ TESTIMONIALS SECTION ============ */}
 <section className="testimonials-section">
 <div className="testimonials-container">
 <div className="testimonials-header">
 <span className="testimonials-label">Customer Success</span>
 <h2 className="testimonials-title">Trusted by Thousands</h2>
 <p className="testimonials-subtitle">
 Hear what tailors, designers, and fabric suppliers across Sri Lanka have to say about ClothStreet.
 </p>
 </div>

 <div className="testimonials-grid">
 <div className="testimonial-card">
 <div className="testimonial-stars">
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 </div>
 <p className="testimonial-text">
"ClothStreet completely transformed how I source materials. The quality of fabrics from verified suppliers is unmatched, and tracking my orders has never been easier."
 </p>
 <div className="testimonial-author">
 <div className="testimonial-avatar">P</div>
 <div>
 <h4 className="testimonial-name">Priyanka Fernando</h4>
 <p className="testimonial-role">Fashion Designer · Kandy</p>
 </div>
 </div>
 </div>

 <div className="testimonial-card">
 <div className="testimonial-stars">
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 </div>
 <p className="testimonial-text">
"As a tailor, getting a steady stream of verified customers was challenging. Now, I have clients booking months in advance. Truly the best platform for our industry."
 </p>
 <div className="testimonial-author">
 <div className="testimonial-avatar">S</div>
 <div>
 <h4 className="testimonial-name">Sunil Perera</h4>
 <p className="testimonial-role">Master Tailor · Colombo</p>
 </div>
 </div>
 </div>

 <div className="testimonial-card">
 <div className="testimonial-stars">
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
 </div>
 <p className="testimonial-text">
"We set up our fabric supply store here and saw sales jump within the first week. The platform handles all the logistics and payments, letting us focus on the craft."
 </p>
 <div className="testimonial-author">
 <div className="testimonial-avatar avatar-blue">A</div>
 <div>
 <h4 className="testimonial-name">Aruni Jayawardena</h4>
 <p className="testimonial-role">Fabric Supplier · Matara</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* ============ CTA BANNER SECTION ============ */}
 <section className="cta-banner-section">
 <div className="cta-banner-container">
 <div className="cta-banner-content">
 <h2>Ready to Transform Your Textile Business?</h2>
 <p>Join thousands of suppliers, tailors, and designers who are already growing with ClothStreet.</p>
 <div className="cta-banner-actions">
 <Link to="/register" className="btn-banner-primary">
 Get Started Free
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
 </svg>
 </Link>
 <Link to="/login" className="btn-banner-outline">
 Already a member? Login
 </Link>
 </div>
 </div>
 </div>
 </section>
 </div>
 );
}

// ── Login.jsx ──
import React, { useState} from'react';
import { useNavigate, Link} from'react-router-dom';
import { useAuth} from'../context/AuthContext';

export default function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const [showPassword, setShowPassword] = useState(false);

 const { login, loginWithGoogle} = useAuth();
 const navigate = useNavigate();

 async function handleLogin(e) {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 const res = await login(email, password);
 const { doc, getDoc} = await import('firebase/firestore');
 const { db} = await import('../firebase/firebase');
 const userDoc = await getDoc(doc(db,"users", res.user.uid));
 const role = userDoc.exists() ? userDoc.data().role : null;
 if (role ==='designer') {
 navigate('/designer-dashboard');
} else if (role ==='seller') {
 navigate('/dashboard');
} else if (role ==='tailor') {
 navigate('/tailor-dashboard');
} else {
 navigate('/');
}
} catch {
 setError('Failed to login. Check your email and password.');
}
 setLoading(false);
}

 async function handleGoogleLogin() {
 setError('');
 setLoading(true);
 try {
 await loginWithGoogle();
 navigate('/');
} catch {
 setError('Failed to login with Google.');
}
 setLoading(false);
}

 return (
 <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

 {/* Background Image */}
 <div className="absolute inset-0">
 <img
 src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1920&q=80"
 alt="Textile background"
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-violet-950/85 to-gray-900/90"></div>
 </div>

 {/* Decorative blurred orbs */}
 <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"></div>

 {/* Card */}
 <div className="relative z-10 w-full max-w-md mx-4">

 {/* Logo / Brand */}
 <div className="text-center mb-8">
 <Link to="/" className="inline-flex items-center gap-2">
 <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
 </svg>
 </div>
 <span className="text-lg font-bold tracking-tight">ClothStreet</span>
 </Link>
 <p className="text-xs mt-2 tracking-widest uppercase">Sri Lanka's Textile Ecosystem</p>
 </div>

 {/* Glass Card */}
 <div className="backdrop-blur-xl border rounded-3xl p-8 shadow-2xl shadow-black/40">

 {/* Header */}
 <div className="mb-7">
 <span className="inline-block text-xs font-semibold tracking-widest text-violet-300 uppercase bg-violet-500/15 border border-violet-500/30 rounded-full px-3 py-1 mb-3">
 Welcome Back
 </span>
 <h1 className="text-3xl font-bold">Sign in to your account</h1>
 <p className="text-sm mt-1">Let's shape tomorrow's style together</p>
 </div>

 {/* Error */}
 {error && (
 <div className="flex items-center gap-2 border px-4 py-3 rounded-xl mb-5 text-sm">
 <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 {error}
 </div>
 )}

 {/* Form */}
 <form onSubmit={handleLogin} className="space-y-4">

 {/* Email */}
 <div className="group">
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
 Email Address
 </label>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors duration-200">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
 </svg>
 </div>
 <input
 type="email"
 placeholder="you@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full border focus:border-violet-500/60 focus: rounded-xl pl-11 pr-4 py-3 text-sm placeholder-white/25 outline-none transition-all duration-200"
 required
 />
 </div>
 </div>

 {/* Password */}
 <div className="group">
 <div className="flex items-center justify-between mb-1.5">
 <label className="text-xs font-semibold uppercase tracking-wider">
 Password
 </label>
 <Link to="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors duration-200">
 Forgot password?
 </Link>
 </div>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors duration-200">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 </div>
 <input
 type={showPassword ?'text' :'password'}
 placeholder="••••••••"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full border focus:border-violet-500/60 focus: rounded-xl pl-11 pr-12 py-3 text-sm placeholder-white/25 outline-none transition-all duration-200"
 required
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 hover: transition-colors duration-200"
 >
 {showPassword ? (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
 </svg>
 ) : (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 )}
 </button>
 </div>
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={loading}
 className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-2"
 >
 {loading ? (
 <>
 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
 </svg>
 Signing in...
 </>
 ) : (
 <>
 Sign In
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
 </svg>
 </>
 )}
 </button>
 </form>

 {/* Divider */}
 <div className="flex items-center my-6">
 <div className="flex-grow border-t"></div>
 <span className="px-4 text-xs uppercase tracking-widest">or continue with</span>
 <div className="flex-grow border-t"></div>
 </div>

 {/* Google Button */}
 <button
 onClick={handleGoogleLogin}
 disabled={loading}
 className="w-full hover: border hover: disabled:opacity-60 disabled:cursor-not-allowed rounded-xl py-3 text-sm font-medium hover: transition-all duration-200 flex items-center justify-center gap-3"
 >
 <svg className="w-4 h-4" viewBox="0 0 24 24">
 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
 </svg>
 Sign in with Google
 </button>

 {/* Sign up link */}
 <p className="text-center text-sm mt-6">
 Don't have an account?{''}
 <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200">
 Create one free
 </Link>
 </p>
 </div>

 {/* Footer note */}
 <p className="text-center text-xs mt-6">
 By signing in, you agree to our{''}
 <a href="#" className="hover: transition-colors duration-200">Terms of Service</a>
 {''}and{''}
 <a href="#" className="hover: transition-colors duration-200">Privacy Policy</a>
 </p>
 </div>
 </div>
 );
}


// ── OrderTracking.jsx ──
import { useState, useEffect} from"react";
import { useParams, useLocation, useNavigate} from"react-router-dom";
import { doc, getDoc} from"firebase/firestore";
import { db} from"../firebase/firebase";

/* ── Leg definitions ── */
const LEGS = {
 standard: [
 { key:"ordered", label:"Order Placed", icon:"📋"},
 { key:"confirmed", label:"Confirmed", icon:"✅"},
 { key:"shipped", label:"Shipped", icon:"🚚"},
 { key:"delivered", label:"Delivered", icon:"🏠"},
 ],
 tailor: [
 { key:"ordered", label:"Order Placed", icon:"📋"},
 { key:"confirmed", label:"Confirmed", icon:"✅"},
 { key:"fabric_shipped", label:"Fabric Shipped to Tailor", icon:"📦"},
 { key:"received_by_tailor", label:"Received by Tailor", icon:"✂️"},
 { key:"tailoring", label:"Tailoring In Progress", icon:"🧵"},
 { key:"tailoring_done", label:"Tailoring Complete", icon:"👔"},
 { key:"shipped_to_customer", label:"Shipped to You", icon:"🚚"},
 { key:"delivered", label:"Delivered", icon:"🏠"},
 ],
 designer: [
 { key:"ordered", label:"Order Placed", icon:"📋"},
 { key:"confirmed", label:"Confirmed", icon:"✅"},
 { key:"fabric_shipped", label:"Fabric Shipped to Designer", icon:"📦"},
 { key:"received_by_designer", label:"Received by Designer", icon:"🎨"},
 { key:"designing", label:"Design In Progress", icon:"✏️"},
 { key:"design_done", label:"Design Complete", icon:"👗"},
 { key:"shipped_to_customer", label:"Shipped to You", icon:"🚚"},
 { key:"delivered", label:"Delivered", icon:"🏠"},
 ],
};

/* ── Mock data for demo (used when no Firestore data) ── */
const MOCK_TRACKING = {
 orderId:"ORD-2026-143",
 product:"Premium Silk Fabric - Navy Blue",
 seller:"Lanka Textiles Co.",
 providerName:"Nimal Perera",
 providerType:"tailor",
 amount: 45000,
 currentStep:"tailoring",
 expectedDate:"3/24/2026",
 timeline: [
 { step:"ordered", date:"Mar 1, 2026", time:"10:30 AM", note:"Order placed successfully"},
 { step:"confirmed", date:"Mar 1, 2026", time:"2:15 PM", note:"Seller confirmed the order"},
 { step:"fabric_shipped", date:"Mar 3, 2026", time:"9:00 AM", note:"Fabric dispatched to Nimal Perera's workshop"},
 { step:"received_by_tailor", date:"Mar 5, 2026", time:"11:45 AM", note:"Nimal Perera received the fabric"},
 { step:"tailoring", date:"Mar 6, 2026", time:"8:00 AM", note:"Work has begun on your order"},
 ],
};

export default function OrderTracking() {
 const { orderId} = useParams();
 const location = useLocation();
 const navigate = useNavigate();

 const [order, setOrder] = useState(location.state?.order || null);
 const [loading, setLoading] = useState(!location.state?.order);

 useEffect(() => {
 if (order) return;
 const fetchOrder = async () => {
 try {
 const snap = await getDoc(doc(db,"orders", orderId));
 if (snap.exists()) {
 setOrder({ id: snap.id, ...snap.data()});
} else {
 // Use mock data for demo
 setOrder(MOCK_TRACKING);
}
} catch {
 setOrder(MOCK_TRACKING);
} finally {
 setLoading(false);
}
};
 fetchOrder();
}, [orderId, order]);

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
 </div>
 );
}

 const trackingData = order || MOCK_TRACKING;
 const providerType = trackingData.providerType ||"standard";
 const legs = LEGS[providerType] || LEGS.standard;
 const currentStep = trackingData.currentStep || trackingData.status?.toLowerCase().replace(/ /g,"_") ||"ordered";
 const currentIdx = legs.findIndex((l) => l.key === currentStep);
 const timeline = trackingData.timeline || [];
 const progressPercent = Math.max(0, Math.min(100, ((currentIdx) / (legs.length - 1)) * 100));

 return (
 <div className="min-h-screen">
 {/* ── Header ── */}
 <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-8">
 <div className="max-w-4xl mx-auto">
 <button
 onClick={() => navigate("/orders")}
 className="inline-flex items-center gap-1.5 text-sm font-semibold hover: mb-4 transition-colors cursor-pointer"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
 </svg>
 Back to Orders
 </button>
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl backdrop-blur-sm border flex items-center justify-center">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
 </svg>
 </div>
 <div>
 <h1 className="text-2xl font-bold">Order Tracking</h1>
 <p className="text-sm">{trackingData.orderId || orderId}</p>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

 {/* ══════════ ORDER SUMMARY ══════════ */}
 <div className="rounded-2xl border shadow-sm p-6">
 <div className="flex flex-col sm:flex-row sm:items-center gap-4">
 <div className="flex-1 min-w-0">
 <h2 className="text-lg font-bold truncate">{trackingData.product ||"Order"}</h2>
 <p className="text-sm mt-0.5">{trackingData.seller ||"—"}</p>
 {trackingData.providerName && (
 <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-violet-50 border border-violet-100 text-xs font-semibold text-violet-700">
 {providerType ==="tailor" ?"✂️" :"🎨"} {trackingData.providerName}
 </div>
 )}
 </div>
 <div className="flex items-center gap-4">
 {trackingData.amount && (
 <div className="text-right">
 <p className="text-xs font-medium">Amount</p>
 <p className="text-lg font-bold">LKR {trackingData.amount.toLocaleString()}</p>
 </div>
 )}
 {trackingData.expectedDate && (
 <div className="text-right">
 <p className="text-xs font-medium">Expected By</p>
 <p className="text-sm font-bold">{trackingData.expectedDate}</p>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* ══════════ MULTI-LEG PROGRESS BAR ══════════ */}
 <div className="rounded-2xl border shadow-sm p-6">
 <h3 className="text-base font-bold mb-6 flex items-center gap-2">
 <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
 </svg>
 Delivery Journey
 <span className="text-xs font-medium ml-auto">
 {Math.round(progressPercent)}% complete
 </span>
 </h3>

 {/* ── Horizontal stepper (desktop) ── */}
 <div className="hidden sm:block">
 {/* Progress bar track */}
 <div className="relative mb-2">
 <div className="absolute top-5 left-6 right-6 h-1 rounded-full" />
 <div
 className="absolute top-5 left-6 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-700"
 style={{ width:`calc(${progressPercent}% - 48px + 48px * ${progressPercent / 100})`}}
 />
 </div>

 <div className="flex justify-between relative">
 {legs.map((leg, idx) => {
 const isCompleted = idx < currentIdx;
 const isCurrent = idx === currentIdx;
 //const isFuture = idx > currentIdx;

 return (
 <div key={leg.key} className="flex flex-col items-center" style={{ width:`${100 / legs.length}%`}}>
 {/* Circle */}
 <div
 className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all z-10 ${isCompleted
 ?"bg-violet-600 border-violet-600 shadow-md shadow-violet-200"
 : isCurrent
 ?" border-violet-500 shadow-lg shadow-violet-100 ring-4 ring-violet-100"
 :""
}`}
 >
 {isCompleted ? (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 ) : (
 <span className={isCurrent ?"text-base" :"text-sm opacity-60"}>{leg.icon}</span>
 )}
 </div>
 {/* Label */}
 <p className={`text-[11px] font-semibold text-center mt-2 leading-tight max-w-[80px] ${isCompleted ?"text-violet-600" : isCurrent ?"" :""
}`}>
 {leg.label}
 </p>
 </div>
 );
})}
 </div>
 </div>

 {/* ── Vertical stepper (mobile) ── */}
 <div className="sm:hidden space-y-0">
 {legs.map((leg, idx) => {
 const isCompleted = idx < currentIdx;
 const isCurrent = idx === currentIdx;
 const isLast = idx === legs.length - 1;

 return (
 <div key={leg.key} className="flex gap-3">
 {/* Vertical line + circle */}
 <div className="flex flex-col items-center">
 <div
 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 shrink-0 z-10 ${isCompleted
 ?"bg-violet-600 border-violet-600"
 : isCurrent
 ?" border-violet-500 ring-4 ring-violet-100"
 :""
}`}
 >
 {isCompleted ? (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 ) : (
 <span className={`text-xs ${isCurrent ?"" :"opacity-60"}`}>{leg.icon}</span>
 )}
 </div>
 {!isLast && (
 <div className={`w-0.5 flex-1 min-h-[24px] ${isCompleted ?"bg-violet-400" :""}`} />
 )}
 </div>
 {/* Label */}
 <div className="pb-4">
 <p className={`text-sm font-semibold ${isCompleted ?"text-violet-600" : isCurrent ?"" :""
}`}>
 {leg.label}
 </p>
 {isCurrent && (
 <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">
 Current
 </span>
 )}
 </div>
 </div>
 );
})}
 </div>
 </div>

 {/* ══════════ TIMELINE ══════════ */}
 {timeline.length > 0 && (
 <div className="rounded-2xl border shadow-sm p-6">
 <h3 className="text-base font-bold mb-5 flex items-center gap-2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
 </svg>
 Activity Timeline
 </h3>

 <div className="space-y-0">
 {timeline.map((event, idx) => {
 const isLatest = idx === timeline.length - 1;
 const legInfo = legs.find((l) => l.key === event.step);

 return (
 <div key={idx} className="flex gap-4">
 {/* Timeline dot + line */}
 <div className="flex flex-col items-center">
 <div className={`w-3 h-3 rounded-full shrink-0 z-10 ${isLatest ?"bg-violet-600 ring-4 ring-violet-100" :""
}`} />
 {idx < timeline.length - 1 && (
 <div className="w-0.5 flex-1 min-h-[40px]" />
 )}
 </div>

 {/* Event info */}
 <div className="pb-5 -mt-1 flex-1">
 <div className="flex items-center gap-2 mb-0.5">
 <span className="text-sm">{legInfo?.icon ||"📌"}</span>
 <p className={`text-sm font-bold ${isLatest ?"" :""}`}>
 {legInfo?.label || event.step}
 </p>
 </div>
 {event.note && (
 <p className="text-xs mb-1">{event.note}</p>
 )}
 <p className="text-[11px]">
 {event.date}{event.time ?` · ${event.time}` :""}
 </p>
 </div>
 </div>
 );
})}
 </div>
 </div>
 )}

 {/* ══════════ HELP BOX ══════════ */}
 <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 p-6">
 <div className="flex items-start gap-4">
 <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
 <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
 </svg>
 </div>
 <div className="flex-1">
 <h4 className="text-sm font-bold mb-1">Need help with your order?</h4>
 <p className="text-xs mb-3">
 Contact us if you have questions about the delivery or tracking.
 </p>
 <button
 onClick={() => window.open("mailto:support@clothstreet.lk","_blank")}
 className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
 >
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
 <polyline points="22,6 12,13 2,6" />
 </svg>
 Contact Support
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}


// ── ProductDetail.jsx ──
import { useState} from"react";
import { useParams, Link, useNavigate} from"react-router-dom";
import { useCart} from"../context/CartContext";

/* ─── Shared fabric data (export removed — moved to separate file) ─── */
const FABRICS = [
 {
 id:"fab_001",
 name:"Premium Cotton Twill",
 type:"Cotton",
 supplier:"Lanka Fabrics Co.",
 supplierLocation:"Pettah, Colombo",
 rating: 4.8,
 reviewCount: 142,
 colors: [{ hex:"#1e293b", name:"Navy"}, { hex:"#991b1b", name:"Crimson"}, { hex:"#1e3a5f", name:"Ocean"}],
 price: 850,
 minOrder: 50,
 location:"Pettah",
 badge:"new",
 inStock: true,
 bgColor:"#d4c5a9",
 tags: ["Cotton","Twill","Garment"],
 description:
"A premium cotton twill with excellent durability and a smooth finish. Perfect for trousers, jackets, and tailored garments that demand quality craftsmanship.",
 material:"100% Cotton",
 weight:"180 GSM",
 width:"58 inches",
 origin:"Sri Lanka",
 careInstructions:"Machine wash cold, tumble dry low",
},
 {
 id:"fab_002",
 name:"Silk Satin Blend",
 type:"Silk",
 supplier:"Royal Fabrics Ltd.",
 supplierLocation:"Panadura, Colombo",
 rating: 4.9,
 reviewCount: 218,
 colors: [
 { hex:"#f5f5dc", name:"Champagne"},
 { hex:"#c084fc", name:"Lavender"},
 { hex:"#ec4899", name:"Rose"},
 { hex:"#60a5fa", name:"Sky"},
 ],
 price: 2300,
 minOrder: 30,
 location:"Panadura",
 badge:"popular",
 inStock: true,
 bgColor:"#e8d5c4",
 tags: ["Luxury","Bridal","Silk"],
 description:
"Experience the natural elegance of raw silk, prized for its rich texture and subtle sheen. Ideal for premium garments that celebrate timeless craftsmanship — from bridal wear to evening gowns and luxury scarves.",
 material:"100% Raw Silk",
 weight:"120 GSM",
 width:"44 inches",
 origin:"Sri Lanka",
 careInstructions:"Dry clean recommended",
},
 {
 id:"fab_003",
 name:"Linen Canvas",
 type:"Linen",
 supplier:"Natural Fibers",
 supplierLocation:"Pettah, Colombo",
 rating: 4.7,
 reviewCount: 98,
 colors: [{ hex:"#1e293b", name:"Charcoal"}, { hex:"#78716c", name:"Stone"}, { hex:"#d6d3d1", name:"Mist"}],
 price: 1200,
 minOrder: 40,
 location:"Pettah",
 badge: null,
 inStock: true,
 bgColor:"#c8bfa9",
 tags: ["Linen","Natural","Summer"],
 description:
"A breathable, natural linen canvas with a crisp, textured finish. Great for summer clothing, home textiles, and sustainable fashion lines.",
 material:"100% Linen",
 weight:"210 GSM",
 width:"54 inches",
 origin:"Sri Lanka",
 careInstructions:"Machine wash warm, line dry",
},
 {
 id:"fab_004",
 name:"Polyester Georgette",
 type:"Polyester",
 supplier:"Modern Textiles",
 supplierLocation:"Colombo 03",
 rating: 4.5,
 reviewCount: 77,
 colors: [
 { hex:"#c084fc", name:"Purple"},
 { hex:"#ec4899", name:"Pink"},
 { hex:"#f472b6", name:"Blush"},
 { hex:"#a78bfa", name:"Violet"},
 ],
 price: 650,
 minOrder: 80,
 location:"Colombo",
 badge: null,
 inStock: true,
 bgColor:"#d5c4d9",
 tags: ["Polyester","Georgette","Drape"],
 description:
"Lightweight and flowy polyester georgette with excellent drape. A versatile choice for sarees, evening wear, and contemporary fashion.",
 material:"100% Polyester",
 weight:"75 GSM",
 width:"60 inches",
 origin:"Sri Lanka",
 careInstructions:"Hand wash cold, drip dry",
},
 {
 id:"fab_005",
 name:"Denim Heavy Weight",
 type:"Denim",
 supplier:"Blue Star Fabrics",
 supplierLocation:"Pettah, Colombo",
 rating: 4.8,
 reviewCount: 163,
 colors: [{ hex:"#1e3a5f", name:"Dark Blue"}, { hex:"#2563eb", name:"Classic"}, { hex:"#3b82f6", name:"Light"}],
 price: 950,
 minOrder: 65,
 location:"Pettah",
 badge: null,
 inStock: true,
 bgColor:"#8ba4c4",
 tags: ["Denim","Heavy","Jeans"],
 description:
"A sturdy, heavy-weight denim fabric for durable garments. Ideal for jeans, jackets, and workwear that need to stand the test of time.",
 material:"98% Cotton, 2% Elastane",
 weight:"340 GSM",
 width:"58 inches",
 origin:"Sri Lanka",
 careInstructions:"Machine wash cold, inside out",
},
 {
 id:"fab_006",
 name:"Chiffon Deluxe",
 type:"Chiffon",
 supplier:"Elegant Fabrics",
 supplierLocation:"Panadura",
 rating: 4.6,
 reviewCount: 54,
 colors: [
 { hex:"#f9a8d4", name:"Petal"},
 { hex:"#c084fc", name:"Lilac"},
 { hex:"#f472b6", name:"Hot Pink"},
 { hex:"#fda4af", name:"Blush"},
 ],
 price: 1800,
 minOrder: 25,
 location:"Panadura",
 badge:"out-of-stock",
 inStock: false,
 bgColor:"#f0ccd4",
 tags: ["Chiffon","Sheer","Occasion"],
 description:
"An ultra-light, sheer chiffon with a delicate hand feel. Perfect for evening gowns, veils, and layered occasion wear.",
 material:"100% Polyester Chiffon",
 weight:"55 GSM",
 width:"56 inches",
 origin:"Sri Lanka",
 careInstructions:"Dry clean only",
},
 {
 id:"fab_007",
 name:"Wool Blend Suiting",
 type:"Wool",
 supplier:"Premium Cloths",
 supplierLocation:"Colombo 07",
 rating: 4.8,
 reviewCount: 89,
 colors: [{ hex:"#1e293b", name:"Charcoal"}, { hex:"#374151", name:"Slate"}, { hex:"#6b7280", name:"Grey"}],
 price: 1250,
 minOrder: 20,
 location:"Colombo",
 badge: null,
 inStock: true,
 bgColor:"#b8a99a",
 tags: ["Wool","Suiting","Formal"],
 description:
"A fine wool-blend suiting fabric with a smooth surface and excellent structure. The go-to choice for formal suits, blazers, and professional attire.",
 material:"70% Wool, 30% Polyester",
 weight:"280 GSM",
 width:"60 inches",
 origin:"Sri Lanka",
 careInstructions:"Dry clean recommended",
},
 {
 id:"fab_008",
 name:"Rayon Printed",
 type:"Rayon",
 supplier:"Color Works Textiles",
 supplierLocation:"Pettah, Colombo",
 rating: 4.4,
 reviewCount: 61,
 colors: [{ hex:"#c084fc", name:"Purple"}, { hex:"#a78bfa", name:"Violet"}, { hex:"#818cf8", name:"Indigo"}],
 price: 780,
 minOrder: 55,
 location:"Pettah",
 badge: null,
 inStock: true,
 bgColor:"#c7b8d4",
 tags: ["Rayon","Printed","Casual"],
 description:
"Vibrant printed rayon with a soft drape and breathable feel. Ideal for casual dresses, skirts, and everyday fashion pieces.",
 material:"100% Viscose Rayon",
 weight:"110 GSM",
 width:"44 inches",
 origin:"Sri Lanka",
 careInstructions:"Hand wash cold, line dry",
},
];

/* ─── Style tokens (light theme — matches shop page) ────────── */
const C = {
 bgPage:"#f3f4f6",
 bgCard:"#ffffff",
 bgCardAlt:"#f9fafb",
 border:"#e5e7eb",
 borderPurple:"rgba(124,58,237,0.35)",
 purple:"#7c3aed",
 purpleLight:"#6d28d9",
 purpleDark:"#5b21b6",
 purpleMuted:"rgba(124,58,237,0.08)",
 white:"#ffffff",
 text:"#111827",
 textMuted:"#6b7280",
 textFaint:"#9ca3af",
 yellow:"#f59e0b",
 green:"#059669",
 greenBg:"rgba(5,150,105,0.1)",
 greenBorder:"rgba(5,150,105,0.3)",
};

/* ─── Stars helper ─────────────────────────────────────────── */
function Stars({ rating}) {
 return (
 <span style={{ display:"flex", gap: 2}}>
 {[1, 2, 3, 4, 5].map((n) => (
 <svg key={n} width="16" height="16" viewBox="0 0 24 24"
 fill={n <= Math.round(rating) ? C.yellow :"#e5e7eb"}
 stroke="none">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 ))}
 </span>
 );
}

/* ─── Main component ───────────────────────────────────────── */
export default function ProductDetail() {
 const { fabricId} = useParams();
 const navigate = useNavigate();
 const { addToCart} = useCart();

 const fabric = FABRICS.find((f) => f.id === fabricId);

 // FIX 2 & 3: Removed unused selectedColor/setSelectedColor and unit/setUnit states
 const [qty] = useState(fabric?.minOrder ?? 1);
 const [activeImg, setActiveImg] = useState(0);
 const [activeTab, setActiveTab] = useState("description");

 // Reviews state
 const [reviewsList, setReviewsList] = useState([
 { id: 1, name:"Ayesh Perera", initial:"A", rating: 5, date:"2 days ago", title:"Excellent quality fabric", text:"The drape on this material is phenomenal. Ordered 50 meters for a boutique collection and my clients absolutely love the feel. Will definitely reorder from this supplier.", bg: C.purpleMuted, color: C.purpleDark, border: false},
 { id: 2, name:"Samadhi W.", initial:"S", rating: 4, date:"1 week ago", title:"Very good, colour slightly darker", text:`Great texture. The color is slightly darker in person than on my screen, but still beautiful. Delivery was very fast.`, bg: C.bgCardAlt, color: C.text, border: true}
 ]);
 const [showReviewForm, setShowReviewForm] = useState(false);
 const [reviewForm, setReviewForm] = useState({ name:"", rating: 5, title:"", text:""});

 const handleShare = () => {
 navigator.clipboard.writeText(window.location.href).then(() => {
 alert("Product link copied to clipboard!");
});
};

 // Zoom state
 const [zoomStyle, setZoomStyle] = useState({ display:"none"});

 const handleMouseMove = (e) => {
 const { left, top, width, height} = e.currentTarget.getBoundingClientRect();
 const x = ((e.clientX - left) / width) * 100;
 const y = ((e.clientY - top) / height) * 100;
 setZoomStyle({
 display:"block",
 backgroundPosition:`${x}% ${y}%`,
});
};

 const handleMouseLeave = () => {
 setZoomStyle({ display:"none"});
};

 if (!fabric) {
 return (
 <div style={{
 minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center",
 background: C.bgPage, color: C.text, flexDirection:"column", gap: 16
}}>
 <p style={{ fontSize:"1.3rem", fontWeight: 700}}>Fabric not found</p>
 <Link to="/shop" style={{ color: C.purple, textDecoration:"none"}}>← Back to Shop</Link>
 </div>
 );
}

 const total = (fabric.price * qty).toLocaleString();

 // FIX 4: Removed unused decreaseQty and increaseQty functions
 // qty is now controlled directly via the input onChange below

 function handleAddToCart() {
 addToCart({ id: fabric.id, name: fabric.name, unitPrice: fabric.price, quantity: qty});
}

 /* ── Thumbnail placeholder images (colour blocks) ── */
 const thumbs = [fabric.bgColor, fabric.colors[0]?.hex ?? fabric.bgColor,"#2d1b69"];

 /* ======================================================== */
 return (
 <div className="pd-page" style={{ minHeight:"100vh", color: C.text, fontFamily:"inherit", paddingBottom:"3rem"}}>

 {/* ── Back breadcrumb ── */}
 <div style={{ maxWidth: 1100, margin:"0 auto", padding:"1.25rem 1.5rem 0"}}>
 <button
 onClick={() => navigate(-1)}
 style={{
 display:"inline-flex", alignItems:"center", gap: 6,
 background:"none", border:"none", cursor:"pointer",
 color: C.textMuted, fontSize:"0.85rem", padding: 0,
 transition:"color 0.2s",
}}
 onMouseEnter={e => e.currentTarget.style.color = C.purple}
 onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
 strokeLinecap="round" strokeLinejoin="round">
 <path d="m15 18-6-6 6-6" />
 </svg>
 Back to Marketplace
 </button>
 </div>

 {/* ── Main content grid ── */}
 <div style={{
 maxWidth: 1100, margin:"1.5rem auto 4rem", padding:"0 1.5rem",
 display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2.5rem",
 alignItems:"flex-start",
}}
 className="pd-grid"
 >

 {/* ═══════════ LEFT — Image Gallery ═══════════ */}
 <div style={{ position:"sticky", top:"2rem"}}>

 <div style={{ display:"flex", gap: 16}}>
 {/* Thumbnails (Vertical) */}
 <div style={{ display:"flex", flexDirection:"column", gap: 10, width: 80}}>
 {thumbs.map((bg, i) => (
 <button key={i} onClick={() => setActiveImg(i)}
 style={{
 width:"100%", height: 80, borderRadius: 10, background: bg,
 border: i === activeImg ?`2px solid ${C.purple}` :`1px solid ${C.border}`,
 cursor:"pointer", overflow:"hidden",
 boxShadow: i === activeImg ?`0 0 0 3px rgba(124,58,237,0.15)` :"none",
 transition:"border 0.2s, transform 0.2s",
 transform: i === activeImg ?"scale(1.02)" :"scale(1)",
}}
 />
 ))}
 </div>

 {/* Main image */}
 <div
 onMouseMove={handleMouseMove}
 onMouseLeave={handleMouseLeave}
 style={{
 flex: 1, borderRadius: 16, overflow:"hidden", position:"relative",
 height: 480, background: thumbs[activeImg],
 border:`1px solid ${C.border}`, cursor:"crosshair",
}}
 >
 {/* Zoom overlay */}
 <div style={{
 ...zoomStyle,
 position:"absolute", inset: 0, pointerEvents:"none",
 backgroundImage:`url(${thumbs[activeImg]})`,
 backgroundColor: thumbs[activeImg],
 backgroundSize:"200%",
 zIndex: 10,
}} />

 {/* In-stock badge */}
 {fabric.inStock && (
 <span style={{
 position:"absolute", top: 14, left: 14, zIndex: 20,
 background: C.greenBg, border:`1px solid ${C.greenBorder}`,
 color: C.green, fontSize:"0.7rem", fontWeight: 700,
 padding:"4px 10px", borderRadius: 999,
 textTransform:"uppercase", letterSpacing:"0.06em",
}}>● IN STOCK</span>
 )}
 {/* Wishlist */}
 <button style={{
 position:"absolute", top: 14, right: 14, zIndex: 20,
 width: 36, height: 36, borderRadius:"50%",
 background:"rgba(255,255,255,0.9)",
 border:`1px solid ${C.border}`, cursor:"pointer", color: C.textMuted,
 display:"flex", alignItems:"center", justifyContent:"center",
 boxShadow:"0 1px 4px rgba(0,0,0,0.1)", transition:"color 0.2s",
}}
 onMouseEnter={e => e.currentTarget.style.color ="#ef4444"}
 onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
 strokeLinecap="round" strokeLinejoin="round">
 <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
 </svg>
 </button>
 </div>
 </div>

 {/* Trust badges */}
 <div style={{
 display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: 10, marginTop: 24,
}}>
 {[
 { icon:"🛡️", label:"Quality Assured", sub:"Lab tested"},
 { icon:"🚚", label:"Fast Delivery", sub:"Island-wide"},
 { icon:"↩️", label:"Easy Returns", sub:"7-day policy"},
 ].map((b) => (
 <div key={b.label} style={{
 background: C.bgCard, border:`1px solid ${C.border}`, borderRadius: 10,
 padding:"16px 8px", textAlign:"center",
 boxShadow:"0 1px 4px rgba(0,0,0,0.02)",
}}>
 <div style={{ fontSize:"1.2rem", marginBottom: 6}}>{b.icon}</div>
 <div style={{ fontSize:"0.75rem", fontWeight: 700, color: C.text}}>{b.label}</div>
 <div style={{ fontSize:"0.65rem", color: C.textMuted, marginTop: 2}}>{b.sub}</div>
 </div>
 ))}
 </div>
 </div>

 {/* ═══════════ RIGHT — Product Info ═══════════ */}
 <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem"}}>

 {/* Tags */}
 <div style={{ display:"flex", gap: 8, flexWrap:"wrap"}}>
 {fabric.tags.map((tag) => (
 <span key={tag} style={{
 padding:"4px 12px", borderRadius: 999, fontSize:"0.72rem", fontWeight: 600,
 background: C.purpleMuted, border:`1px solid ${C.borderPurple}`, color: C.purple,
}}>{tag}</span>
 ))}
 </div>

 {/* Name */}
 <h1 style={{
 margin: 0, fontSize:"clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800,
 letterSpacing:"-0.02em", color: C.text, lineHeight: 1.2
}}>
 {fabric.name}
 </h1>

 {/* Rating */}
 <div style={{ display:"flex", alignItems:"center", gap: 10}}>
 <Stars rating={fabric.rating} />
 <span style={{ fontWeight: 700, color: C.text, fontSize:"0.9rem"}}>{fabric.rating}</span>
 <span style={{ color: C.textMuted, fontSize:"0.85rem"}}>({fabric.reviewCount} reviews)</span>
 </div>

 {/* Price box */}
 <div style={{
 background: C.bgCardAlt, border:`1px solid ${C.border}`, borderRadius: 12,
 padding:"1rem 1.25rem", display:"flex", justifyContent:"space-between", alignItems:"flex-end",
}}>
 <div>
 <div style={{
 fontSize:"0.65rem", color: C.textFaint, textTransform:"uppercase",
 letterSpacing:"0.08em", marginBottom: 4
}}>Price Per Meter</div>
 <div style={{
 fontSize:"1.8rem", fontWeight: 800, color: C.purple,
 letterSpacing:"-0.02em"
}}>
 LKR {fabric.price.toLocaleString()}
 </div>
 </div>
 <div style={{ textAlign:"right"}}>
 <div style={{
 fontSize:"0.65rem", color: C.textFaint, textTransform:"uppercase",
 letterSpacing:"0.08em", marginBottom: 4
}}>Min. Order</div>
 <div style={{ fontSize:"1.1rem", fontWeight: 700, color: C.text}}>{fabric.minOrder} m</div>
 </div>
 </div>

 {/* Supplier */}
 <div style={{
 background: C.bgCardAlt, border:`1px solid ${C.border}`, borderRadius: 12,
 padding:"0.85rem 1.1rem", display:"flex", alignItems:"center", gap: 12,
}}>
 <div style={{
 width: 44, height: 44, borderRadius: 10,
 background:`linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
 display:"flex", alignItems:"center", justifyContent:"center",
 fontSize:"1.1rem", flexShrink: 0,
}}>🏭</div>
 <div style={{ flex: 1}}>
 <div style={{ fontWeight: 700, color: C.text, fontSize:"0.92rem"}}>{fabric.supplier}</div>
 <div style={{ fontSize:"0.75rem", color: C.textMuted, display:"flex", alignItems:"center", gap: 4, marginTop: 2}}>
 <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
 </svg>
 {fabric.supplierLocation}
 </div>
 </div>
 <span style={{
 fontSize:"0.68rem", fontWeight: 700,
 background: C.greenBg, border:`1px solid ${C.greenBorder}`,
 color: C.green, padding:"3px 10px", borderRadius: 999,
}}>★ Premium Partner</span>
 <button 
 onClick={() => navigate(`/store/${encodeURIComponent(fabric.supplier)}`)}
 style={{
 padding:"6px 14px", borderRadius: 8, fontSize:"0.75rem", fontWeight: 600,
 background: C.purpleMuted, border:`1px solid ${C.borderPurple}`,
 color: C.purple, cursor:"pointer", whiteSpace:"nowrap",
}}>View Store</button>
 </div>

 {/* CTA Buttons */}
 <div style={{ display:"flex", gap: 12}}>
 <button
 disabled={!fabric.inStock}
 onClick={handleAddToCart}
 style={{
 flex: 1, padding:"1rem", borderRadius: 12,
 background: fabric.inStock
 ?`linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`
 :"#d1d5db",
 color: C.white, border:"none", cursor: fabric.inStock ?"pointer" :"not-allowed",
 fontWeight: 700, fontSize:"1rem",
 display:"flex", alignItems:"center", justifyContent:"center", gap: 8,
 boxShadow: fabric.inStock ?"0 4px 24px rgba(124,58,237,0.4)" :"none",
 transition:"opacity 0.2s, transform 0.15s",
}}
 onMouseEnter={e => { if (fabric.inStock) e.currentTarget.style.opacity ="0.9";}}
 onMouseLeave={e => { e.currentTarget.style.opacity ="1";}}
 >
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
 strokeLinecap="round" strokeLinejoin="round">
 <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
 <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
 </svg>
 {fabric.inStock ?`Add to Cart · LKR ${total}` :"Out of Stock"}
 </button>
 <button onClick={handleShare} style={{
 width: 56, height: 56, borderRadius: 12,
 background: C.bgCard, border:`1px solid ${C.border}`,
 color: C.textMuted, cursor:"pointer",
 display:"flex", alignItems:"center", justifyContent:"center",
 flexShrink: 0, transition:"color 0.2s, border 0.2s",
}}
 title="Share Product"
 onMouseEnter={e => { e.currentTarget.style.color = C.purple; e.currentTarget.style.borderColor = C.purpleMuted;}}
 onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border;}}
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
 strokeLinecap="round" strokeLinejoin="round">
 <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
 <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
 </svg>
 </button>
 </div>

 <hr style={{ border: 0, height: 1, background: C.border, margin:"1rem 0"}} />

 {/* ─── TABS ─── */}
 <div>
 <div style={{ display:"flex", gap: 24, borderBottom:`1px solid ${C.border}`, marginBottom: 20}}>
 {[
 { id:"description", label:"Description"},
 { id:"specs", label:"Specifications"},
 { id:"reviews", label:`Reviews (${fabric.reviewCount})`}
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 style={{
 padding:"0 0 12px 0", background:"none", border:"none",
 fontWeight: activeTab === tab.id ? 700 : 600,
 fontSize:"0.9rem", cursor:"pointer",
 color: activeTab === tab.id ? C.purpleDark : C.textMuted,
 borderBottom: activeTab === tab.id ?`3px solid ${C.purple}` :"3px solid transparent",
 transition:"all 0.2s",
}}
 >{tab.label}</button>
 ))}
 </div>

 {/* TAB CONTENT */}
 <div style={{ minHeight: 200}}>

 {/* Description Tab */}
 {activeTab ==="description" && (
 <div style={{ animation:"fadeIn 0.3s ease"}}>
 <p style={{ margin: 0, fontSize:"0.95rem", color: C.text, lineHeight: 1.7}}>{fabric.description}</p>
 <ul style={{ marginTop: 16, paddingLeft: 20, color: C.textMuted, fontSize:"0.9rem", lineHeight: 1.8}}>
 <li>Premium quality {fabric.type.toLowerCase()} directly from {fabric.supplierLocation}</li>
 <li>Ideal for high-end tailoring and boutique collections</li>
 <li>Sustainably sourced and rigorously tested for durability</li>
 </ul>
 </div>
 )}

 {/* Specs Tab */}
 {activeTab ==="specs" && (
 <div style={{ animation:"fadeIn 0.3s ease"}}>
 <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12}}>
 {[
 { label:"Material Composition", value: fabric.material},
 { label:"Fabric Weight", value: fabric.weight},
 { label:"Roll Width", value: fabric.width},
 { label:"Country of Origin", value: fabric.origin},
 { label:"Care Instructions", value: fabric.careInstructions},
 { label:"Minimum Order", value:`${fabric.minOrder} Meters`},
 ].map((s) => (
 <div key={s.label} style={{
 background: C.bgCardAlt, border:`1px solid ${C.border}`, borderRadius: 10, padding:"12px 16px",
}}>
 <div style={{
 fontSize:"0.7rem", color: C.textFaint, textTransform:"uppercase",
 letterSpacing:"0.05em", marginBottom: 6
}}>{s.label}</div>
 <div style={{ fontSize:"0.95rem", fontWeight: 600, color: C.text}}>{s.value}</div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Reviews Tab */}
 {activeTab ==="reviews" && (
 <div style={{ animation:"fadeIn 0.3s ease", display:"flex", flexDirection:"column", gap: 24}}>
 {/* Reviews Summary */}
 <div style={{ display:"flex", gap: 32, alignItems:"center", background: C.bgCardAlt, padding: 24, borderRadius: 16, border:`1px solid ${C.border}`}}>
 <div style={{ textAlign:"center"}}>
 <div style={{ fontSize:"3rem", fontWeight: 800, color: C.text, lineHeight: 1}}>{fabric.rating}</div>
 <div style={{ display:"flex", justifyContent:"center", margin:"8px 0"}}><Stars rating={fabric.rating} /></div>
 <div style={{ fontSize:"0.8rem", color: C.textMuted}}>Based on {fabric.reviewCount} reviews</div>
 </div>
 <div style={{ flex: 1, display:"flex", flexDirection:"column", gap: 6}}>
 {[5, 4, 3, 2, 1].map(star => {
 const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2;
 return (
 <div key={star} style={{ display:"flex", alignItems:"center", gap: 10, fontSize:"0.8rem", color: C.textMuted}}>
 <span style={{ width: 12}}>{star}</span>
 <span style={{ color: C.yellow}}>★</span>
 <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3, overflow:"hidden"}}>
 <div style={{ width:`${pct}%`, height:"100%", background: C.yellow, borderRadius: 3}} />
 </div>
 <span style={{ width: 24, textAlign:"right"}}>{pct}%</span>
 </div>
 )
})}
 </div>
 <div>
 <button onClick={() => setShowReviewForm(!showReviewForm)} style={{
 padding:"10px 20px", borderRadius: 8, background: C.text, color: C.white,
 border:"none", fontWeight: 600, cursor:"pointer"
}}>
 {showReviewForm ?"Cancel Review" :"Write a Review"}
 </button>
 </div>
 </div>

 {/* Review Form */}
 {showReviewForm && (
 <div style={{ background: C.bgCardAlt, padding: 24, borderRadius: 16, border:`1px solid ${C.border}`, animation:"fadeIn 0.3s ease"}}>
 <h3 style={{ margin:"0 0 16px", fontSize:"1.1rem"}}>Write your review</h3>
 <div style={{ display:"flex", flexDirection:"column", gap: 16}}>
 <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 16}}>
 <div>
 <label style={{ display:"block", fontSize:"0.8rem", fontWeight: 600, marginBottom: 6}}>Your Name</label>
 <input
 type="text"
 value={reviewForm.name}
 onChange={e => setReviewForm({ ...reviewForm, name: e.target.value})}
 placeholder="John Doe"
 style={{ width:"100%", padding:"10px 12px", borderRadius: 8, border:`1px solid ${C.border}`, fontSize:"0.9rem", outline:"none", boxSizing:"border-box"}}
 />
 </div>
 <div>
 <label style={{ display:"block", fontSize:"0.8rem", fontWeight: 600, marginBottom: 6}}>Rating</label>
 <select
 value={reviewForm.rating}
 onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value)})}
 style={{ width:"100%", padding:"10px 12px", borderRadius: 8, border:`1px solid ${C.border}`, fontSize:"0.9rem", outline:"none", background: C.bgCard, boxSizing:"border-box"}}
 >
 <option value="5">5 Stars - Excellent</option>
 <option value="4">4 Stars - Very Good</option>
 <option value="3">3 Stars - Average</option>
 <option value="2">2 Stars - Poor</option>
 <option value="1">1 Star - Terrible</option>
 </select>
 </div>
 </div>
 <div>
 <label style={{ display:"block", fontSize:"0.8rem", fontWeight: 600, marginBottom: 6}}>Review Title</label>
 <input
 type="text"
 value={reviewForm.title}
 onChange={e => setReviewForm({ ...reviewForm, title: e.target.value})}
 placeholder="Summary of your experience"
 style={{ width:"100%", padding:"10px 12px", borderRadius: 8, border:`1px solid ${C.border}`, fontSize:"0.9rem", outline:"none", boxSizing:"border-box"}}
 />
 </div>
 <div>
 <label style={{ display:"block", fontSize:"0.8rem", fontWeight: 600, marginBottom: 6}}>Review Content</label>
 <textarea
 value={reviewForm.text}
 onChange={e => setReviewForm({ ...reviewForm, text: e.target.value})}
 placeholder="What did you like or dislike?"
 rows="4"
 style={{ width:"100%", padding:"10px 12px", borderRadius: 8, border:`1px solid ${C.border}`, fontSize:"0.9rem", outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box"}}
 />
 </div>
 <div style={{ display:"flex", justifyContent:"flex-end"}}>
 <button
 onClick={() => {
 if (!reviewForm.name || !reviewForm.text) { alert("Please fill in your name and review content."); return;}
 const newReview = {
 id: Date.now(),
 name: reviewForm.name,
 initial: reviewForm.name.charAt(0).toUpperCase(),
 rating: reviewForm.rating,
 date:"Just now",
 title: reviewForm.title ||"User Review",
 text: reviewForm.text,
 bg: C.purpleMuted, color: C.purpleDark, border: false
};
 setReviewsList([newReview, ...reviewsList]);
 setReviewForm({ name:"", rating: 5, title:"", text:""});
 setShowReviewForm(false);
}}
 style={{
 padding:"10px 24px", borderRadius: 8, background: C.purple, color: C.white,
 border:"none", fontWeight: 700, cursor:"pointer", boxShadow:"0 2px 8px rgba(124,58,237,0.3)"
}}>Submit Review</button>
 </div>
 </div>
 </div>
 )}

 {/* Sample Reviews */}
 <div style={{ display:"flex", flexDirection:"column", gap: 16}}>
 <h3 style={{ fontSize:"1.1rem", margin:"0 0 8px"}}>Recent Customer Reviews</h3>
 {reviewsList.map(review => (
 <div key={review.id} style={{ borderBottom:`1px solid ${C.border}`, paddingBottom: 16}}>
 <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 8}}>
 <div style={{ display:"flex", alignItems:"center", gap: 10}}>
 <div style={{ width: 36, height: 36, borderRadius:"50%", background: review.bg, border: review.border ?`1px solid ${C.border}` :'none', color: review.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight: 700}}>{review.initial}</div>
 <div>
 <div style={{ fontWeight: 600, fontSize:"0.9rem"}}>{review.name}</div>
 <div style={{ fontSize:"0.75rem", color: C.green}}>✓ Verified Buyer</div>
 </div>
 </div>
 <span style={{ fontSize:"0.8rem", color: C.textFaint}}>{review.date}</span>
 </div>
 <Stars rating={review.rating} />
 <div style={{ fontWeight: 700, fontSize:"0.95rem", marginTop: 8}}>{review.title}</div>
 <p style={{ margin:"4px 0 0", fontSize:"0.9rem", color: C.textMuted, lineHeight: 1.6}}>{review.text}</p>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* ── Related Products ── */}
 <div style={{ maxWidth: 1100, margin:"0 auto 4rem", padding:"0 1.5rem"}}>
 <h2 style={{ fontSize:"1.4rem", fontWeight: 800, color: C.text, marginBottom: 24}}>You May Also Like</h2>
 <div style={{
 display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap: 20,
}}>
 {FABRICS.filter(f => f.id !== fabric.id).slice(0, 4).map(rel => (
 <Link key={rel.id} to={`/shop/${rel.id}`} style={{ textDecoration:"none", color:"inherit"}}>
 <div style={{
 background: C.bgCard, borderRadius: 12, border:`1px solid ${C.border}`,
 overflow:"hidden", transition:"transform 0.2s, box-shadow 0.2s", cursor:"pointer",
}}
 onMouseEnter={e => { e.currentTarget.style.transform ="translateY(-4px)"; e.currentTarget.style.boxShadow ="0 10px 25px rgba(0,0,0,0.05)";}}
 onMouseLeave={e => { e.currentTarget.style.transform ="none"; e.currentTarget.style.boxShadow ="none";}}
 >
 <div style={{ height: 160, background: rel.bgColor, position:"relative"}}>
 {rel.inStock && (
 <span style={{
 position:"absolute", top: 10, left: 10, background: C.greenBg, border:`1px solid ${C.greenBorder}`,
 color: C.green, fontSize:"0.6rem", fontWeight: 700, padding:"2px 8px", borderRadius: 999,
}}>IN STOCK</span>
 )}
 </div>
 <div style={{ padding: 16}}>
 <div style={{ fontSize:"0.7rem", color: C.purple, fontWeight: 700, marginBottom: 4, letterSpacing:"0.05em", textTransform:"uppercase"}}>{rel.type}</div>
 <div style={{ fontWeight: 700, fontSize:"0.95rem", color: C.text, marginBottom: 8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{rel.name}</div>
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div style={{ fontWeight: 800, color: C.text, fontSize:"1.1rem"}}>LKR {rel.price}</div>
 <div style={{ display:"flex", gap: 2}}><Stars rating={rel.rating} /></div>
 </div>
 </div>
 </div>
 </Link>
 ))}
 </div>
 </div>

 {/* ── Responsive style ── */}
 <style>{`
 .pd-page {
 background: #f3f4f6;
}
 @media (max-width: 768px) {
 .pd-grid { grid-template-columns: 1fr !important;}
}
`}</style>
 </div>
 );
}


// ── QuotationInbox.jsx ──
import { useState, useEffect} from"react";
import { collection, query, where, getDocs} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import { useNavigate} from"react-router-dom";

const STATUS_MAP = {
 pending: { label:"Pending", bg:"bg-amber-100", text:"text-amber-700", dot:"bg-amber-500"},
 quoted: { label:"Quoted", bg:"", text:"", dot:""},
 accepted: { label:"Accepted", bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500"},
 rejected: { label:"Rejected", bg:"", text:"", dot:""},
};

export default function QuotationInbox() {
 const { user} = useAuth();
 const navigate = useNavigate();
 const [quotations, setQuotations] = useState([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState("All");

 useEffect(() => {
 if (!user?.uid) return;

 const fetchQuotations = async () => {
 try {
 const q = query(
 collection(db,"quotations"),
 where("providerId","==", user.uid)
 );
 const snap = await getDocs(q);
 const data = snap.docs
 .map((doc) => ({ id: doc.id, ...doc.data()}))
 .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
 setQuotations(data);
} catch (err) {
 console.error("Error fetching quotations:", err);
} finally {
 setLoading(false);
}
};
 fetchQuotations();
}, [user]);

 const filteredQuotations = quotations.filter((q) => {
 if (activeTab ==="All") return true;
 return q.status?.toLowerCase() === activeTab.toLowerCase();
});

 const stats = {
 total: quotations.length,
 pending: quotations.filter((q) => q.status ==="pending").length,
 quoted: quotations.filter((q) => q.status ==="quoted").length,
 accepted: quotations.filter((q) => q.status ==="accepted").length,
};

 const formatDate = (timestamp) => {
 if (!timestamp?.seconds) return"—";
 return new Date(timestamp.seconds * 1000).toLocaleDateString("en-GB", {
 day:"numeric", month:"short", year:"numeric",
});
};

 return (
 <div className="min-h-screen">
 {/* ── Header ── */}
 <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-8">
 <div className="max-w-6xl mx-auto">
 <div className="flex items-center gap-3 mb-1">
 <div className="w-10 h-10 rounded-xl border flex items-center justify-center">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <div>
 <h1 className="text-2xl font-bold">Quote Requests</h1>
 <p className="text-sm">Manage incoming quote requests from customers</p>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
 {/* ── Stat Cards ── */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label:"Total Requests", value: stats.total, icon:"📋", bg:"bg-violet-50", accent:"text-violet-600"},
 { label:"Pending", value: stats.pending, icon:"⏳", bg:"bg-amber-50", accent:"text-amber-600"},
 { label:"Quoted", value: stats.quoted, icon:"💰", bg:"", accent:""},
 { label:"Accepted", value: stats.accepted, icon:"✅", bg:"bg-emerald-50", accent:"text-emerald-600"},
 ].map((stat) => (
 <div key={stat.label} className="rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow">
 <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>
 {stat.icon}
 </div>
 <p className="text-3xl font-extrabold">{loading ?"—" : stat.value}</p>
 <p className="text-sm font-medium mt-1">{stat.label}</p>
 </div>
 ))}
 </div>

 {/* ── Tab Filter ── */}
 <div className="rounded-2xl border shadow-sm p-4 flex items-center gap-2 overflow-x-auto">
 {["All","Pending","Quoted","Accepted","Rejected"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === tab
 ?"bg-violet-600 shadow-md shadow-violet-200"
 :" hover: hover:"
}`}
 >
 {tab}
 {tab !=="All" && (
 <span className={`ml-1.5 text-xs ${activeTab === tab ?"text-violet-200" :""}`}>
 ({quotations.filter((q) => q.status === tab.toLowerCase()).length})
 </span>
 )}
 </button>
 ))}
 </div>

 {/* ── Quotation List ── */}
 {loading ? (
 <div className="space-y-4">
 {[1, 2, 3].map((i) => (
 <div key={i} className="rounded-2xl border p-6 animate-pulse">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl" />
 <div className="flex-1 space-y-2">
 <div className="h-4 rounded w-1/3" />
 <div className="h-3 rounded w-1/4" />
 </div>
 <div className="h-8 w-24 rounded-full" />
 </div>
 </div>
 ))}
 </div>
 ) : filteredQuotations.length > 0 ? (
 <div className="space-y-4">
 {filteredQuotations.map((q) => {
 const statusStyle = STATUS_MAP[q.status] || STATUS_MAP.pending;
 return (
 <div
 key={q.id}
 className="rounded-2xl border shadow-sm hover:shadow-md hover:border-violet-100 transition-all cursor-pointer group"
 onClick={() => navigate(`/quotation-response/${q.id}`, { state: { quotation: q}})}
 >
 <div className="p-6">
 <div className="flex items-start gap-4">
 {/* Customer avatar */}
 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
 {q.customerName?.charAt(0) ||"?"}
 </div>

 {/* Main info */}
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="text-base font-bold truncate group-hover:text-violet-700 transition-colors">
 {q.customerName ||"Unknown Customer"}
 </h3>
 <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
 {statusStyle.label}
 </span>
 </div>

 <p className="text-sm mb-3 line-clamp-1">
 {q.requirements ||"No description"}
 </p>

 {/* Meta row */}
 <div className="flex flex-wrap items-center gap-4 text-xs">
 <span className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect width="18" height="18" x="3" y="4" rx="2" />
 <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" />
 <line x1="3" x2="21" y1="10" y2="10" />
 </svg>
 Received: {formatDate(q.createdAt)}
 </span>
 <span className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
 </svg>
 Expected: {q.expectedDate ||"—"}
 </span>
 <span className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
 </svg>
 {q.items?.length || 0} item{q.items?.length !== 1 ?"s" :""}
 </span>
 {q.designImages?.length > 0 && (
 <span className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect x="3" y="3" width="18" height="18" rx="2" />
 <circle cx="8.5" cy="8.5" r="1.5" />
 <polyline points="21 15 16 10 5 21" />
 </svg>
 {q.designImages.length} image{q.designImages.length !== 1 ?"s" :""}
 </span>
 )}
 </div>
 </div>

 {/* Arrow */}
 <div className="shrink-0 group-hover:text-violet-500 transition-colors self-center">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
 </svg>
 </div>
 </div>
 </div>
 </div>
 );
})}
 </div>
 ) : (
 <div className="rounded-3xl border border-dashed p-12 text-center">
 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <h3 className="text-lg font-bold mb-2">No quote requests yet</h3>
 <p className="max-w-sm mx-auto">
 When customers request quotes from you, they&apos;ll appear here.
 </p>
 </div>
 )}
 </div>
 </div>
 );
}


// ── QuotationResponse.jsx ──
import { useState, useEffect} from"react";
import { useParams, useLocation, useNavigate} from"react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import toast from"react-hot-toast";

export default function QuotationResponse() {
 const { quotationId} = useParams();
 const location = useLocation();
 const navigate = useNavigate();
 const { user} = useAuth();

 const [quotation, setQuotation] = useState(location.state?.quotation || null);
 const [loading, setLoading] = useState(!location.state?.quotation);

 /* ── Pricing form ── */
 const [laborCharge, setLaborCharge] = useState("");
 const [additionalCharges, setAdditionalCharges] = useState("");
 const [additionalNote, setAdditionalNote] = useState("");
 const [completionDate, setCompletionDate] = useState("");
 const [remarks, setRemarks] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [showBillPreview, setShowBillPreview] = useState(false);

 /* ── Fetch from Firestore if not passed via state ── */
 useEffect(() => {
 if (quotation) return;
 const fetchQuotation = async () => {
 try {
 const snap = await getDoc(doc(db,"quotations", quotationId));
 if (snap.exists()) {
 setQuotation({ id: snap.id, ...snap.data()});
}
} catch (err) {
 console.error("Error fetching quotation:", err);
} finally {
 setLoading(false);
}
};
 fetchQuotation();
}, [quotationId, quotation]);

 /* ── Bill calculations ── */
 const materialTotal = quotation?.items?.reduce(
 (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
 0
 ) || 0;
 const labor = parseFloat(laborCharge) || 0;
 const additional = parseFloat(additionalCharges) || 0;
 const grandTotal = materialTotal + labor + additional;

 /* ── Min completion date (tomorrow) ── */
 const tomorrow = new Date();
 tomorrow.setDate(tomorrow.getDate() + 1);
 const minDate = tomorrow.toISOString().split("T")[0];

 /* ── Submit quotation ── */
 const handleSubmit = async () => {
 if (!labor) {
 toast.error("Please enter a labor charge.");
 return;
}
 if (!completionDate) {
 toast.error("Please set a completion date.");
 return;
}

 setSubmitting(true);
 try {
 await updateDoc(doc(db,"quotations", quotationId), {
 status:"quoted",
 laborCharge: labor,
 additionalCharges: additional,
 additionalNote: additionalNote.trim(),
 completionDate: completionDate,
 providerRemarks: remarks.trim(),
 grandTotal: grandTotal,
 quotedAt: serverTimestamp(),
 quotedBy: user?.uid ||"",
});

 toast.success("Quotation sent to customer!");
 navigate("/quotation-inbox");
} catch (err) {
 console.error("Error sending quotation:", err);
 toast.error("Failed to send quotation.");
} finally {
 setSubmitting(false);
}
};

 /* ── Handle declining ── */
 const handleDecline = async () => {
 if (!window.confirm("Are you sure you want to decline this request?")) return;
 try {
 await updateDoc(doc(db,"quotations", quotationId), {
 status:"rejected",
 rejectedAt: serverTimestamp(),
 rejectedBy: user?.uid ||"",
});
 toast.success("Request declined.");
 navigate("/quotation-inbox");
} catch (err) {
 console.error("Error declining:", err);
 toast.error("Failed to decline request.");
}
};

 const formatDate = (timestamp) => {
 if (!timestamp?.seconds) return"—";
 return new Date(timestamp.seconds * 1000).toLocaleDateString("en-GB", {
 day:"numeric", month:"short", year:"numeric",
});
};

 /* ── Loading ── */
 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="flex flex-col items-center gap-3">
 <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
 <p className="text-sm font-medium">Loading request…</p>
 </div>
 </div>
 );
}

 if (!quotation) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="text-center">
 <h2 className="text-xl font-bold mb-2">Request not found</h2>
 <button onClick={() => navigate("/quotation-inbox")} className="text-violet-600 font-semibold hover:underline cursor-pointer">
 ← Back to Inbox
 </button>
 </div>
 </div>
 );
}

 const isAlreadyQuoted = quotation.status ==="quoted" || quotation.status ==="accepted" || quotation.status ==="rejected";

 return (
 <div className="min-h-screen">
 {/* ── Header ── */}
 <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-6">
 <div className="max-w-4xl mx-auto flex items-center gap-3">
 <button
 onClick={() => navigate("/quotation-inbox")}
 className="w-9 h-9 rounded-xl hover: border flex items-center justify-center transition-colors cursor-pointer"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
 </svg>
 </button>
 <div>
 <h1 className="text-xl font-bold">Quote Request Details</h1>
 <p className="text-sm">{quotation.customerName ||"Customer"} · {formatDate(quotation.createdAt)}</p>
 </div>
 </div>
 </div>

 <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

 {/* ══════════ CUSTOMER INFO ══════════ */}
 <div className="rounded-2xl border shadow-sm p-6">
 <div className="flex items-center gap-4 mb-4">
 <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-xl shrink-0">
 {quotation.customerName?.charAt(0) ||"?"}
 </div>
 <div className="flex-1 min-w-0">
 <h2 className="text-lg font-bold">{quotation.customerName}</h2>
 <p className="text-sm">{quotation.customerEmail}</p>
 </div>
 <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
 quotation.status ==="pending" ?"bg-amber-100 text-amber-700" :
 quotation.status ==="quoted" ?"" :
 quotation.status ==="accepted" ?"bg-emerald-100 text-emerald-700" :
""
}`}>
 {quotation.status}
 </span>
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
 <div className="rounded-xl p-3 border">
 <p className="text-xs font-medium mb-0.5">Expected By</p>
 <p className="text-sm font-bold">{quotation.expectedDate ||"—"}</p>
 </div>
 <div className="rounded-xl p-3 border">
 <p className="text-xs font-medium mb-0.5">Gender</p>
 <p className="text-sm font-bold capitalize">{quotation.gender ||"—"}</p>
 </div>
 <div className="rounded-xl p-3 border">
 <p className="text-xs font-medium mb-0.5">Items</p>
 <p className="text-sm font-bold">{quotation.items?.length || 0} selected</p>
 </div>
 </div>
 </div>

 {/* ══════════ SELECTED ITEMS ══════════ */}
 {quotation.items?.length > 0 && (
 <div className="rounded-2xl border shadow-sm p-6">
 <h3 className="text-base font-bold mb-4 flex items-center gap-2">
 <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
 </svg>
 Selected Products
 </h3>
 <div className="divide-y divide-gray-100">
 {quotation.items.map((item, idx) => (
 <div key={idx} className="flex items-center gap-4 py-3">
 {item.image && (
 <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
 )}
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold truncate">{item.name}</p>
 <p className="text-xs">{item.quantity} {item.unit ||"m"}</p>
 </div>
 <p className="text-sm font-bold text-violet-600 whitespace-nowrap">
 LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
 </p>
 </div>
 ))}
 </div>
 <div className="mt-3 pt-3 border-t flex justify-between items-center">
 <span className="text-sm font-medium">Material Total</span>
 <span className="text-base font-bold">LKR {materialTotal.toLocaleString()}</span>
 </div>
 </div>
 )}

 {/* ══════════ REQUIREMENTS ══════════ */}
 {quotation.requirements && (
 <div className="rounded-2xl border shadow-sm p-6">
 <h3 className="text-base font-bold mb-3 flex items-center gap-2">
 <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
 <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
 </svg>
 Customer Requirements
 </h3>
 <p className="text-sm leading-relaxed rounded-xl p-4 border whitespace-pre-wrap">
 {quotation.requirements}
 </p>
 </div>
 )}

 {/* ══════════ DESIGN IMAGES ══════════ */}
 {quotation.designImages?.length > 0 && (
 <div className="rounded-2xl border shadow-sm p-6">
 <h3 className="text-base font-bold mb-4 flex items-center gap-2">
 <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect x="3" y="3" width="18" height="18" rx="2" />
 <circle cx="8.5" cy="8.5" r="1.5" />
 <polyline points="21 15 16 10 5 21" />
 </svg>
 Reference Images ({quotation.designImages.length})
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
 {quotation.designImages.map((url, idx) => (
 <a
 key={idx}
 href={url}
 target="_blank"
 rel="noopener noreferrer"
 className="rounded-xl overflow-hidden aspect-square border hover:shadow-lg transition-shadow"
 >
 <img src={url} alt={`Design ${idx + 1}`} className="w-full h-full object-cover" />
 </a>
 ))}
 </div>
 </div>
 )}

 {/* ══════════ MEASUREMENTS ══════════ */}
 {quotation.measurements && Object.keys(quotation.measurements).length > 0 && (
 <div className="rounded-2xl border shadow-sm p-6">
 <h3 className="text-base font-bold mb-4 flex items-center gap-2">
 <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
 <circle cx="9" cy="7" r="4" />
 <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
 </svg>
 Body Measurements
 <span className="text-xs font-normal capitalize">({quotation.gender})</span>
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {Object.entries(quotation.measurements)
 .filter(([, val]) => val)
 .map(([key, val]) => (
 <div key={key} className="rounded-xl p-3 border text-center">
 <p className="text-xs font-medium capitalize mb-1">{key.replace(/([A-Z])/g," $1")}</p>
 <p className="text-lg font-bold">
 {val}<span className="text-xs ml-0.5">in</span>
 </p>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* ══════════ PRICING FORM (only if pending) ══════════ */}
 {!isAlreadyQuoted ? (
 <>
 <div className="rounded-2xl border-2 border-violet-200 shadow-sm p-6">
 <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
 <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <circle cx="12" cy="12" r="10" />
 <path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8" />
 <path d="M12 18V6" />
 </svg>
 Your Quotation
 </h3>
 <p className="text-sm mb-6">Enter your pricing to send the customer a quote</p>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
 {/* Labor Charge */}
 <div>
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
 Labor / Service Charge *
 </label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold">LKR </span>
 <input
 type="number"
 className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
 placeholder="e.g. 5000"
 value={laborCharge}
 onChange={(e) => setLaborCharge(e.target.value)}
 min="0"
 />
 </div>
 </div>

 {/* Additional Charges */}
 <div>
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
 Additional Charges
 </label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold">LKR </span>
 <input
 type="number"
 className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
 placeholder="e.g. 1000"
 value={additionalCharges}
 onChange={(e) => setAdditionalCharges(e.target.value)}
 min="0"
 />
 </div>
 </div>
 </div>

 {/* Additional charges note */}
 <div className="mb-5">
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
 If Additional Charges, Describe
 </label>
 <input
 type="text"
 className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
 placeholder="e.g. Thread, buttons, express finishing..."
 value={additionalNote}
 onChange={(e) => setAdditionalNote(e.target.value)}
 />
 </div>

 {/* Completion Date */}
 <div className="mb-5">
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
 Possible Completion Date *
 </label>
 <input
 type="date"
 className="max-w-xs px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
 value={completionDate}
 onChange={(e) => setCompletionDate(e.target.value)}
 min={minDate}
 />
 </div>

 {/* Remarks */}
 <div>
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
 Remarks / Notes for Customer
 </label>
 <textarea
 className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all resize-y min-h-[80px]"
 placeholder="Any notes, conditions, or details you want to share..."
 value={remarks}
 onChange={(e) => setRemarks(e.target.value)}
 rows={3}
 />
 </div>
 </div>

 {/* ── Bill Preview Toggle ── */}
 <button
 onClick={() => setShowBillPreview(!showBillPreview)}
 className="w-full border hover: rounded-2xl p-4 flex items-center justify-between transition-colors cursor-pointer"
 >
 <span className="flex items-center gap-2 text-sm font-bold">
 <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 Preview Bill
 </span>
 <svg className={`w-5 h-5 transition-transform ${showBillPreview ?"rotate-180" :""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
 </svg>
 </button>

 {/* ── Bill Preview ── */}
 {showBillPreview && (
 <div className="rounded-2xl border shadow-lg p-6">
 <div className="text-center mb-6">
 <h3 className="text-lg font-bold">Quotation Bill Preview</h3>
 <p className="text-xs mt-1">This is what the customer will see</p>
 </div>

 <div className="border rounded-xl overflow-hidden">
 {/* Bill header */}
 <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
 <div className="flex justify-between items-center">
 <div>
 <p className="text-xs text-violet-200 uppercase tracking-wider font-semibold">Quotation From</p>
 <p className="text-base font-bold">{quotation.providerName || user?.displayName ||"Provider"}</p>
 </div>
 <div className="text-right">
 <p className="text-xs text-violet-200 uppercase tracking-wider font-semibold">Date</p>
 <p className="text-sm font-semibold">{new Date().toLocaleDateString("en-GB")}</p>
 </div>
 </div>
 </div>

 {/* Bill body */}
 <div className="px-6 py-4 space-y-3">
 {/* Material items */}
 <div className="text-xs font-bold uppercase tracking-wider mb-2">Materials</div>
 {quotation.items?.map((item, idx) => (
 <div key={idx} className="flex justify-between items-center text-sm">
 <span className="">{item.name} × {item.quantity} {item.unit ||"m"}</span>
 <span className="font-semibold">LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}</span>
 </div>
 ))}

 <hr className="my-2" />

 <div className="flex justify-between items-center text-sm">
 <span className="">Material Subtotal</span>
 <span className="font-semibold">LKR {materialTotal.toLocaleString()}</span>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="">Labor / Service Charge</span>
 <span className="font-semibold">LKR {labor.toLocaleString()}</span>
 </div>
 {additional > 0 && (
 <div className="flex justify-between items-center text-sm">
 <span className="">
 Additional{additionalNote ?` (${additionalNote})` :""}
 </span>
 <span className="font-semibold">LKR {additional.toLocaleString()}</span>
 </div>
 )}

 <hr className="my-2" />

 <div className="flex justify-between items-center">
 <span className="text-base font-bold">Grand Total</span>
 <span className="text-xl font-extrabold text-violet-600">LKR {grandTotal.toLocaleString()}</span>
 </div>
 </div>

 {/* Completion date footer */}
 <div className="px-6 py-3 border-t flex justify-between items-center text-sm">
 <span className="">Est. Completion</span>
 <span className="font-bold">{completionDate ||"Not set"}</span>
 </div>
 </div>
 </div>
 )}

 {/* ── Action Buttons ── */}
 <div className="flex flex-col sm:flex-row gap-3">
 <button
 onClick={handleSubmit}
 disabled={submitting}
 className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
 >
 {submitting ? (
 <>
 <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
 Sending...
 </>
 ) : (
 <>
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <line x1="22" y1="2" x2="11" y2="13" />
 <polygon points="22 2 15 22 11 13 2 9 22 2" />
 </svg>
 Send Quotation
 </>
 )}
 </button>

 <button
 onClick={handleDecline}
 className="px-8 py-4 border hover: font-bold rounded-2xl text-sm transition-colors cursor-pointer"
 >
 Decline Request
 </button>
 </div>
 </>
 ) : (
 /* ── Already responded card ── */
 <div className="rounded-2xl border shadow-sm p-6 text-center">
 <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
 quotation.status ==="quoted" ?"" :
 quotation.status ==="accepted" ?"bg-emerald-50" :
""
}`}>
 {quotation.status ==="quoted" ?"💰" :
 quotation.status ==="accepted" ?"✅" :"❌"}
 </div>
 <h3 className="text-lg font-bold mb-1">
 {quotation.status ==="quoted" ?"Quotation Sent" :
 quotation.status ==="accepted" ?"Quotation Accepted!" :
"Request Declined"}
 </h3>
 {quotation.grandTotal && (
 <p className="text-2xl font-extrabold text-violet-600 mb-2">LKR {quotation.grandTotal.toLocaleString()}</p>
 )}
 {quotation.completionDate && (
 <p className="text-sm">Completion by: <span className="font-semibold">{quotation.completionDate}</span></p>
 )}
 <button
 onClick={() => navigate("/quotation-inbox")}
 className="mt-4 px-6 py-2 hover: font-semibold rounded-xl text-sm transition-colors cursor-pointer"
 >
 ← Back to Inbox
 </button>
 </div>
 )}
 </div>
 </div>
 );
}


// ── QuotationReview.jsx ──
import { useState, useEffect} from"react";
import { useParams, useLocation, useNavigate} from"react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp} from"firebase/firestore";
import { db} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import toast from"react-hot-toast";

export default function QuotationReview() {
 const { quotationId} = useParams();
 const location = useLocation();
 const navigate = useNavigate();
 const { user} = useAuth();

 const [quotation, setQuotation] = useState(location.state?.quotation || null);
 const [loading, setLoading] = useState(!location.state?.quotation);
 const [processing, setProcessing] = useState(false);
 const [showPayment, setShowPayment] = useState(false);
 const [paymentMethod, setPaymentMethod] = useState("card");

 useEffect(() => {
 if (quotation) return;
 const fetch = async () => {
 try {
 const snap = await getDoc(doc(db,"quotations", quotationId));
 if (snap.exists()) setQuotation({ id: snap.id, ...snap.data()});
} catch (err) {
 console.error("Error fetching quotation:", err);
} finally {
 setLoading(false);
}
};
 fetch();
}, [quotationId, quotation]);

 /* ── Accept quotation ── */
 const handleAccept = async () => {
 setProcessing(true);
 try {
 await updateDoc(doc(db,"quotations", quotationId), {
 status:"accepted",
 acceptedAt: serverTimestamp(),
 acceptedBy: user?.uid ||"",
 paymentMethod: paymentMethod,
});
 toast.success("Quotation accepted! Your order is being processed.");
 navigate("/orders");
} catch (err) {
 console.error("Error accepting:", err);
 toast.error("Something went wrong. Please try again.");
} finally {
 setProcessing(false);
}
};

 /* ── Reject quotation ── */
 const handleReject = async () => {
 if (!window.confirm("Are you sure you want to reject this quotation?")) return;
 setProcessing(true);
 try {
 await updateDoc(doc(db,"quotations", quotationId), {
 status:"rejected",
 rejectedAt: serverTimestamp(),
 rejectedBy: user?.uid ||"",
});
 toast.success("Quotation declined.");
 navigate("/orders");
} catch (err) {
 console.error("Error rejecting:", err);
 toast.error("Something went wrong.");
} finally {
 setProcessing(false);
}
};

 const formatDate = (ts) => {
 if (!ts?.seconds) return"—";
 return new Date(ts.seconds * 1000).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric"});
};

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
 </div>
 );
}

 if (!quotation) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="text-center">
 <h2 className="text-xl font-bold mb-2">Quotation not found</h2>
 <button onClick={() => navigate("/orders")} className="text-violet-600 font-semibold hover:underline cursor-pointer">← Back to Orders</button>
 </div>
 </div>
 );
}

 const materialTotal = quotation.items?.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 1), 0) || 0;
 const labor = quotation.laborCharge || 0;
 const additional = quotation.additionalCharges || 0;
 const grandTotal = quotation.grandTotal || materialTotal + labor + additional;
 const isPending = quotation.status ==="quoted";

 return (
 <div className="min-h-screen">
 {/* ── Header ── */}
 <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 px-6 py-6">
 <div className="max-w-3xl mx-auto flex items-center gap-3">
 <button onClick={() => navigate("/orders")} className="w-9 h-9 rounded-xl hover: border flex items-center justify-center transition-colors cursor-pointer">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
 </button>
 <div>
 <h1 className="text-xl font-bold">Review Quotation</h1>
 <p className="text-sm">From {quotation.providerName ||"Provider"}</p>
 </div>
 </div>
 </div>

 <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

 {/* ══════════ PROVIDER INFO ══════════ */}
 <div className="rounded-2xl border shadow-sm p-6">
 <div className="flex items-center gap-4">
 <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${
 quotation.providerType ==="designer"
 ?"bg-gradient-to-br from-rose-500 to-pink-600"
 :"bg-gradient-to-br from-violet-500 to-purple-600"
}`}>
 {quotation.providerName?.charAt(0) ||"?"}
 </div>
 <div className="flex-1 min-w-0">
 <h2 className="text-lg font-bold">{quotation.providerName}</h2>
 <p className="text-sm capitalize">{quotation.providerType ||"—"}</p>
 </div>
 <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
 isPending ?"" :
 quotation.status ==="accepted" ?"bg-emerald-100 text-emerald-700" :
""
}`}>
 {quotation.status}
 </div>
 </div>
 {quotation.completionDate && (
 <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2">
 <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
 </svg>
 <span className="text-sm text-emerald-700">
 Estimated completion: <span className="font-bold">{quotation.completionDate}</span>
 </span>
 </div>
 )}
 </div>

 {/* ══════════ BILL BREAKDOWN ══════════ */}
 <div className="rounded-2xl border shadow-sm overflow-hidden">
 {/* Bill header */}
 <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
 <div className="flex justify-between items-center">
 <div>
 <p className="text-xs text-violet-200 uppercase tracking-wider font-semibold">Quotation</p>
 <p className="text-base font-bold">{quotation.providerName}</p>
 </div>
 <div className="text-right">
 <p className="text-xs text-violet-200 uppercase tracking-wider font-semibold">Quoted On</p>
 <p className="text-sm font-semibold">{formatDate(quotation.quotedAt)}</p>
 </div>
 </div>
 </div>

 {/* Bill items */}
 <div className="px-6 py-5 space-y-3">
 <p className="text-xs font-bold uppercase tracking-wider">Materials</p>
 {quotation.items?.map((item, idx) => (
 <div key={idx} className="flex justify-between items-center text-sm">
 <div className="flex items-center gap-3">
 {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover border" />}
 <span className="">{item.name} × {item.quantity} {item.unit ||"m"}</span>
 </div>
 <span className="font-semibold">LKR {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}</span>
 </div>
 ))}

 <hr className="" />

 <div className="flex justify-between text-sm">
 <span className="">Material Subtotal</span>
 <span className="font-semibold">LKR {materialTotal.toLocaleString()}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="">Labor / Service Charge</span>
 <span className="font-semibold">LKR {labor.toLocaleString()}</span>
 </div>
 {additional > 0 && (
 <div className="flex justify-between text-sm">
 <span className="">
 Additional{quotation.additionalNote ?` (${quotation.additionalNote})` :""}
 </span>
 <span className="font-semibold">LKR {additional.toLocaleString()}</span>
 </div>
 )}

 <hr className="" />

 <div className="flex justify-between items-center pt-1">
 <span className="text-base font-bold">Grand Total</span>
 <span className="text-2xl font-extrabold text-violet-600">LKR {grandTotal.toLocaleString()}</span>
 </div>
 </div>
 </div>

 {/* ══════════ PROVIDER REMARKS ══════════ */}
 {quotation.providerRemarks && (
 <div className="rounded-2xl border shadow-sm p-6">
 <h3 className="text-base font-bold mb-3 flex items-center gap-2">
 <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
 </svg>
 Provider Remarks
 </h3>
 <p className="text-sm leading-relaxed rounded-xl p-4 border whitespace-pre-wrap">
 {quotation.providerRemarks}
 </p>
 </div>
 )}

 {/* ══════════ ACTION AREA ══════════ */}
 {isPending ? (
 <>
 {!showPayment ? (
 /* ── Accept / Reject buttons ── */
 <div className="flex flex-col sm:flex-row gap-3">
 <button
 onClick={() => setShowPayment(true)}
 disabled={processing}
 className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-200 cursor-pointer disabled:opacity-50"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 Accept & Proceed to Payment
 </button>
 <button
 onClick={handleReject}
 disabled={processing}
 className="px-8 py-4 border hover: font-bold rounded-2xl text-sm transition-colors cursor-pointer disabled:opacity-50"
 >
 Decline
 </button>
 </div>
 ) : (
 /* ── Payment Step ── */
 <div className="rounded-2xl border-2 border-emerald-200 shadow-sm p-6">
 <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
 <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
 </svg>
 Payment
 </h3>
 <p className="text-sm mb-6">
 Amount to pay: <span className="font-bold">LKR {grandTotal.toLocaleString()}</span>
 </p>

 {/* Payment method selection */}
 <div className="space-y-3 mb-6">
 {[
 { id:"card", label:"Credit / Debit Card", icon:"💳", desc:"Visa, Mastercard, Amex"},
 { id:"bank", label:"Bank Transfer", icon:"🏦", desc:"Direct bank transfer"},
 { id:"cod", label:"Cash on Delivery", icon:"💵", desc:"Pay when you receive"},
 ].map((method) => (
 <div
 key={method.id}
 onClick={() => setPaymentMethod(method.id)}
 className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
 paymentMethod === method.id
 ?"border-emerald-500 bg-emerald-50/50"
 :" hover:"
}`}
 >
 <span className="text-2xl">{method.icon}</span>
 <div className="flex-1">
 <p className="text-sm font-bold">{method.label}</p>
 <p className="text-xs">{method.desc}</p>
 </div>
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
 paymentMethod === method.id ?"border-emerald-500" :""
}`}>
 {paymentMethod === method.id && (
 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
 )}
 </div>
 </div>
 ))}
 </div>

 {/* Confirm */}
 <div className="flex flex-col sm:flex-row gap-3">
 <button
 onClick={handleAccept}
 disabled={processing}
 className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-200 cursor-pointer disabled:opacity-50"
 >
 {processing ? (
 <>
 <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
 Processing...
 </>
 ) : (
 <>
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
 </svg>
 Confirm & Pay LKR {grandTotal.toLocaleString()}
 </>
 )}
 </button>
 <button
 onClick={() => setShowPayment(false)}
 className="px-6 py-4 hover: font-semibold rounded-2xl text-sm transition-colors cursor-pointer"
 >
 Back
 </button>
 </div>
 </div>
 )}
 </>
 ) : (
 /* ── Already responded ── */
 <div className="rounded-2xl border shadow-sm p-6 text-center">
 <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl ${
 quotation.status ==="accepted" ?"bg-emerald-50" :""
}`}>
 {quotation.status ==="accepted" ?"✅" :"❌"}
 </div>
 <h3 className="text-lg font-bold mb-1">
 {quotation.status ==="accepted" ?"Quotation Accepted" :"Quotation Declined"}
 </h3>
 <p className="text-2xl font-extrabold text-violet-600 mb-2">LKR {grandTotal.toLocaleString()}</p>
 {quotation.paymentMethod && (
 <p className="text-sm capitalize">Payment: {quotation.paymentMethod}</p>
 )}
 </div>
 )}
 </div>
 </div>
 );
}


// ── Register.jsx ──
import React, { useState} from'react';
import { useNavigate, Link} from'react-router-dom';
import { useAuth} from'../context/AuthContext';

export default function SignIn() {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [role, setRole] = useState('customer');
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirm, setShowConfirm] = useState(false);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const { register, loginWithGoogle} = useAuth();
 const navigate = useNavigate();

 async function handleRegister(e) {
 e.preventDefault();
 setError('');
 if (password !== confirmPassword) return setError('Passwords do not match.');
 if (password.length < 6) return setError('Password must be at least 6 characters.');
 setLoading(true);
 try {
 await register(name, email, password, role);
 if (role ==='designer') {
 navigate('/designer-dashboard');
} else if (role ==='seller') {
 navigate('/dashboard');
} else if (role ==='tailor') {
 navigate('/tailor-dashboard');
} else {
 navigate('/');
}
} catch {
 setError('Failed to create account. Please try again.');
}
 setLoading(false);
}

 async function handleGoogleSignIn() {
 setError('');
 setLoading(true);
 try {
 await loginWithGoogle(role);
 navigate('/');
} catch (err) {
 setError(err.message ||'Failed to sign in with Google.');
}
 setLoading(false);
}

 const roleOptions = [
 { value:'customer', label:'Customer', icon:'🛍️'},
 { value:'tailor', label:'Tailor', icon:'✂️'},
 { value:'designer', label:'Designer', icon:'🎨'},
 { value:'seller', label:'Seller', icon:'🏪'},
 ];

 return (
 <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-10">

 {/* Background Image */}
 <div className="absolute inset-0">
 <img
 src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1920&q=80"
 alt="Textile background"
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-violet-950/85 to-gray-900/90"></div>
 </div>

 {/* Decorative orbs */}
 <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"></div>

 {/* Card */}
 <div className="relative z-10 w-full max-w-md mx-4">

 {/* Brand */}
 <div className="text-center mb-8">
 <Link to="/" className="inline-flex items-center gap-2">
 <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
 </svg>
 </div>
 <span className="text-lg font-bold tracking-tight">ClothStreet</span>
 </Link>
 <p className="text-xs mt-2 tracking-widest uppercase">Sri Lanka's Textile Ecosystem</p>
 </div>

 {/* Glass Card */}
 <div className="backdrop-blur-xl border rounded-3xl p-8 shadow-2xl shadow-black/40">

 {/* Header */}
 <div className="mb-7">
 <span className="inline-block text-xs font-semibold tracking-widest text-violet-300 uppercase bg-violet-500/15 border border-violet-500/30 rounded-full px-3 py-1 mb-3">
 Join the Ecosystem
 </span>
 <h1 className="text-3xl font-bold">Create your account</h1>
 <p className="text-sm mt-1">Make your own style with Sri Lanka's best</p>
 </div>

 {/* Error */}
 {error && (
 <div className="flex items-center gap-2 border px-4 py-3 rounded-xl mb-5 text-sm">
 <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 {error}
 </div>
 )}

 <form onSubmit={handleRegister} className="space-y-4">

 {/* Full Name */}
 <div className="group">
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors duration-200">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
 </svg>
 </div>
 <input
 type="text"
 placeholder="Your full name"
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="w-full border focus:border-violet-500/60 focus: rounded-xl pl-11 pr-4 py-3 text-sm placeholder-white/25 outline-none transition-all duration-200"
 required
 />
 </div>
 </div>

 {/* Email */}
 <div className="group">
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Email Address</label>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors duration-200">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
 </svg>
 </div>
 <input
 type="email"
 placeholder="you@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full border focus:border-violet-500/60 focus: rounded-xl pl-11 pr-4 py-3 text-sm placeholder-white/25 outline-none transition-all duration-200"
 required
 />
 </div>
 </div>

 {/* Password */}
 <div className="group">
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors duration-200">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 </div>
 <input
 type={showPassword ?'text' :'password'}
 placeholder="Min. 6 characters"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full border focus:border-violet-500/60 focus: rounded-xl pl-11 pr-12 py-3 text-sm placeholder-white/25 outline-none transition-all duration-200"
 required
 />
 <button type="button" onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 hover: transition-colors duration-200">
 {showPassword
 ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
 : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}
 </button>
 </div>
 </div>

 {/* Confirm Password */}
 <div className="group">
 <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Confirm Password</label>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors duration-200">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
 </svg>
 </div>
 <input
 type={showConfirm ?'text' :'password'}
 placeholder="Repeat your password"
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 className="w-full border focus:border-violet-500/60 focus: rounded-xl pl-11 pr-12 py-3 text-sm placeholder-white/25 outline-none transition-all duration-200"
 required
 />
 <button type="button" onClick={() => setShowConfirm(!showConfirm)}
 className="absolute right-4 top-1/2 -translate-y-1/2 hover: transition-colors duration-200">
 {showConfirm
 ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
 : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
}
 </button>
 </div>
 </div>

 {/* Role selector */}
 <div>
 <label className="block text-xs font-semibold uppercase tracking-wider mb-2">I am a...</label>
 <div className="grid grid-cols-4 gap-2">
 {roleOptions.map(({ value, label, icon}) => (
 <button
 key={value}
 type="button"
 onClick={() => setRole(value)}
 className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all duration-200
 ${role === value
 ?'bg-violet-600/40 border-violet-500/60 shadow-lg shadow-violet-500/20'
 :' hover: hover:'
}`}
 >
 <span className="text-base">{icon}</span>
 {label}
 </button>
 ))}
 </div>
 </div>

 {/* Submit */}
 <button
 type="submit"
 disabled={loading}
 className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-2"
 >
 {loading ? (
 <>
 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
 </svg>
 Creating Account...
 </>
 ) : (
 <>
 Create Account
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
 </svg>
 </>
 )}
 </button>
 </form>

 {/* Divider */}
 <div className="flex items-center my-6">
 <div className="flex-grow border-t"></div>
 <span className="px-4 text-xs uppercase tracking-widest">or continue with</span>
 <div className="flex-grow border-t"></div>
 </div>

 {/* Google */}
 <button
 onClick={handleGoogleSignIn}
 disabled={loading}
 className="w-full hover: border hover: disabled:opacity-60 disabled:cursor-not-allowed rounded-xl py-3 text-sm font-medium hover: transition-all duration-200 flex items-center justify-center gap-3"
 >
 <svg className="w-4 h-4" viewBox="0 0 24 24">
 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
 </svg>
 Sign up with Google
 </button>

 {/* Login link */}
 <p className="text-center text-sm mt-6">
 Already have an account?{''}
 <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200">
 Sign in
 </Link>
 </p>
 </div>

 {/* Footer */}
 <p className="text-center text-xs mt-6">
 By signing up, you agree to our{''}
 <a href="#" className="hover: transition-colors duration-200">Terms of Service</a>
 {''}and{''}
 <a href="#" className="hover: transition-colors duration-200">Privacy Policy</a>
 </p>
 </div>
 </div>
 );
}

// ── RequestQuote.jsx ──
import { useState, useEffect, useRef} from"react";
import { useParams, useLocation, useNavigate} from"react-router-dom";
import { collection, addDoc, serverTimestamp} from"firebase/firestore";
import { ref, uploadBytes, getDownloadURL} from"firebase/storage";
import { db, storage} from"../firebase/firebase";
import { useAuth} from"../context/AuthContext";
import { useCart} from"../context/CartContext";
import toast from"react-hot-toast";
import"./RequestQuote.css";

/* ── Measurement fields per gender ── */
const MEASUREMENTS = {
 men: [
 { key:"chest", label:"Chest", placeholder:"e.g. 40"},
 { key:"waist", label:"Waist", placeholder:"e.g. 34"},
 { key:"hip", label:"Hip", placeholder:"e.g. 42"},
 { key:"shoulder", label:"Shoulder Width", placeholder:"e.g. 18"},
 { key:"height", label:"Height", placeholder:"e.g. 72"},
 { key:"armLength", label:"Arm Length", placeholder:"e.g. 25"},
 { key:"inseam", label:"Inseam", placeholder:"e.g. 32"},
 { key:"neck", label:"Neck", placeholder:"e.g. 16"},
 ],
 women: [
 { key:"bust", label:"Bust", placeholder:"e.g. 36"},
 { key:"waist", label:"Waist", placeholder:"e.g. 28"},
 { key:"hip", label:"Hip", placeholder:"e.g. 40"},
 { key:"shoulder", label:"Shoulder Width", placeholder:"e.g. 15"},
 { key:"height", label:"Height", placeholder:"e.g. 65"},
 { key:"armLength", label:"Arm Length", placeholder:"e.g. 23"},
 { key:"inseam", label:"Inseam", placeholder:"e.g. 30"},
 { key:"bustPoint", label:"Bust Point", placeholder:"e.g. 10"},
 ],
};

export default function RequestQuote() {
 const { providerId} = useParams();
 const location = useLocation();
 const navigate = useNavigate();
 const { user} = useAuth();
 const { cartItems} = useCart();
 const fileInputRef = useRef(null);

 /* ── Provider info from navigation state ── */
 const provider = location.state?.provider || null;
 const providerType = provider?.providerType || (providerId?.startsWith("designer-") ?"designer" :"tailor");

 /* ── Cart items from context or sessionStorage fallback ── */
 const [availableItems, setAvailableItems] = useState([]);

 useEffect(() => {
 if (cartItems && cartItems.length > 0) {
 setAvailableItems(cartItems);
} else {
 try {
 const stored = sessionStorage.getItem("clothstreet_checkout_cart");
 if (stored) setAvailableItems(JSON.parse(stored));
} catch {
 /* empty */
}
}
}, [cartItems]);

 /* ── Form State ── */
 const [selectedProducts, setSelectedProducts] = useState([]);
 const [expectedDate, setExpectedDate] = useState("");
 const [requirements, setRequirements] = useState("");
 const [designImages, setDesignImages] = useState([]); // { file, preview}
 const [gender, setGender] = useState("men");
 const [measurements, setMeasurements] = useState({});
 const [submitting, setSubmitting] = useState(false);
 const [dragging, setDragging] = useState(false);

 /* ── Product toggle ── */
 const toggleProduct = (itemId) => {
 setSelectedProducts((prev) =>
 prev.includes(itemId)
 ? prev.filter((id) => id !== itemId)
 : [...prev, itemId]
 );
};

 /* ── Measurement update ── */
 const handleMeasurement = (key, value) => {
 setMeasurements((prev) => ({ ...prev, [key]: value}));
};

 /* ── Image handling ── */
 const handleFiles = (files) => {
 const newImages = Array.from(files)
 .filter((f) => f.type.startsWith("image/"))
 .slice(0, 10 - designImages.length) // max 10 total
 .map((file) => ({
 file,
 preview: URL.createObjectURL(file),
}));
 setDesignImages((prev) => [...prev, ...newImages]);
};

 const removeImage = (index) => {
 setDesignImages((prev) => {
 const copy = [...prev];
 URL.revokeObjectURL(copy[index].preview);
 copy.splice(index, 1);
 return copy;
});
};

 /* ── Drag & Drop ── */
 const handleDragOver = (e) => {
 e.preventDefault();
 setDragging(true);
};
 const handleDragLeave = () => setDragging(false);
 const handleDrop = (e) => {
 e.preventDefault();
 setDragging(false);
 handleFiles(e.dataTransfer.files);
};

 /* ── Submit ── */
 const handleSubmit = async () => {
 if (selectedProducts.length === 0) {
 toast.error("Please select at least one product.");
 return;
}
 if (!expectedDate) {
 toast.error("Please pick an expected date.");
 return;
}
 if (!requirements.trim()) {
 toast.error("Please describe your requirements.");
 return;
}

 setSubmitting(true);

 try {
 // Upload images to Firebase Storage
 const imageUrls = [];
 for (const img of designImages) {
 const storageRef = ref(
 storage,
`quotation-images/${Date.now()}-${img.file.name}`
 );
 const snap = await uploadBytes(storageRef, img.file);
 const url = await getDownloadURL(snap.ref);
 imageUrls.push(url);
}

 // Build selected items data
 const selectedItemsData = availableItems
 .filter((item) => selectedProducts.includes(item.id))
 .map((item) => ({
 id: item.id,
 name: item.name,
 quantity: item.quantity,
 unitPrice: item.unitPrice,
 unit: item.unit ||"m",
 image: item.image || null,
}));

 // Create quotation document in Firestore
 await addDoc(collection(db,"quotations"), {
 customerId: user?.uid ||"guest",
 customerName: user?.displayName || user?.email ||"Guest",
 customerEmail: user?.email ||"",
 providerId: providerId,
 providerName: provider?.name ||"Unknown",
 providerType: providerType,
 items: selectedItemsData,
 expectedDate: expectedDate,
 requirements: requirements.trim(),
 designImages: imageUrls,
 gender: gender,
 measurements: measurements,
 status:"pending",
 createdAt: serverTimestamp(),
});

 toast.success("Quote request submitted successfully!");

 // Clean up previews
 designImages.forEach((img) => URL.revokeObjectURL(img.preview));

 // Navigate to orders page
 navigate("/orders");
} catch (err) {
 console.error("Error submitting quote:", err);
 toast.error("Failed to submit quote request. Please try again.");
} finally {
 setSubmitting(false);
}
};

 /* ── Min date (tomorrow) ── */
 const tomorrow = new Date();
 tomorrow.setDate(tomorrow.getDate() + 1);
 const minDate = tomorrow.toISOString().split("T")[0];

 return (
 <div className="rq-page">
 {/* ───────── HERO ───────── */}
 <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 py-14 px-4">
 <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" />
 <div className="max-w-5xl mx-auto text-center relative z-10">
 <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-200 uppercase bg-violet-500/15 border border-violet-400/25 rounded-full px-4 py-1.5 mb-4">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 Quote Request
 </span>
 <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
 Request a{""}
 <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
 Custom Quote
 </span>
 </h1>
 <p className="text-base text-violet-200/70 max-w-md mx-auto">
 Tell us your vision and get a personalized quote
 </p>
 </div>
 </section>

 {/* ───────── PROVIDER CARD ───────── */}
 {provider && (
 <div className="rq-provider-card">
 <div className="rq-provider-inner">
 <div className={`rq-provider-avatar ${providerType}`}>
 {provider.name?.charAt(0) ||"?"}
 </div>
 <div className="rq-provider-info">
 <p className="rq-provider-name">{provider.name}</p>
 <p className="rq-provider-meta">
 {provider.location}
 {provider.rating && (
 <>
 <span>·</span>
 <span style={{ color:"#f59e0b"}}>★</span>{""}
 {provider.rating.toFixed(1)}
 </>
 )}
 </p>
 </div>
 <span className={`rq-provider-badge ${providerType}`}>
 {providerType ==="tailor" ?"✂️ Tailor" :"🎨 Designer"}
 </span>
 </div>
 </div>
 )}

 {/* ───────── MAIN CONTENT ───────── */}
 <div className="rq-content">
 {/* Back link */}
 <button className="rq-back-link" onClick={() => navigate(-1)}>
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <path d="m15 18-6-6 6-6" />
 </svg>
 Back
 </button>

 {/* ══════════ 1. SELECT PRODUCTS ══════════ */}
 <div className="rq-section">
 <div className="rq-section-header">
 <div className="rq-section-icon purple">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
 <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
 <line x1="12" y1="22.08" x2="12" y2="12" />
 </svg>
 </div>
 <div>
 <h3 className="rq-section-title">Select Products</h3>
 <p className="rq-section-subtitle">
 Choose which items you need custom work for
 </p>
 </div>
 </div>

 {availableItems.length > 0 ? (
 <div className="rq-product-list">
 {availableItems.map((item) => {
 const isSelected = selectedProducts.includes(item.id);
 return (
 <div
 key={item.id}
 className={`rq-product-item${isSelected ?" selected" :""}`}
 onClick={() => toggleProduct(item.id)}
 >
 <div className="rq-product-checkbox">
 {isSelected && (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 )}
 </div>
 {item.image && (
 <img
 src={item.image}
 alt={item.name}
 className="rq-product-img"
 />
 )}
 <div className="rq-product-info">
 <p className="rq-product-name">{item.name}</p>
 <p className="rq-product-meta">
 {item.quantity} {item.unit ||"m"}
 </p>
 </div>
 <span className="rq-product-price">
 LKR {""}
 {(item.unitPrice * item.quantity).toLocaleString()}
 </span>
 </div>
 );
})}
 </div>
 ) : (
 <p style={{ color:"#71717a", fontSize:"0.9rem", textAlign:"center", padding:"20px 0"}}>
 No items in your cart. Please add items before requesting a quote.
 </p>
 )}
 </div>

 {/* ══════════ 2. EXPECTED DATE ══════════ */}
 <div className="rq-section">
 <div className="rq-section-header">
 <div className="rq-section-icon blue">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
 <line x1="16" x2="16" y1="2" y2="6" />
 <line x1="8" x2="8" y1="2" y2="6" />
 <line x1="3" x2="21" y1="10" y2="10" />
 </svg>
 </div>
 <div>
 <h3 className="rq-section-title">Expected Date</h3>
 <p className="rq-section-subtitle">
 When do you need this completed?
 </p>
 </div>
 </div>

 <input
 type="date"
 className="rq-date-input"
 value={expectedDate}
 onChange={(e) => setExpectedDate(e.target.value)}
 min={minDate}
 />
 </div>

 {/* ══════════ 3. REQUIREMENTS ══════════ */}
 <div className="rq-section">
 <div className="rq-section-header">
 <div className="rq-section-icon amber">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
 </svg>
 </div>
 <div>
 <h3 className="rq-section-title">Your Requirements</h3>
 <p className="rq-section-subtitle">
 Describe what you want — style, fit, details, anything
 </p>
 </div>
 </div>

 <textarea
 className="rq-textarea"
 placeholder="E.g., I need a slim-fit shirt with a mandarin collar, using navy blue cotton. French cuffs preferred. Please see the attached design images for reference..."
 value={requirements}
 onChange={(e) => setRequirements(e.target.value)}
 maxLength={2000}
 />
 <p style={{ textAlign:"right", fontSize:"0.75rem", color:"#a1a1aa", marginTop:"6px"}}>
 {requirements.length}/2000
 </p>
 </div>

 {/* ══════════ 4. DESIGN IMAGES ══════════ */}
 <div className="rq-section">
 <div className="rq-section-header">
 <div className="rq-section-icon rose">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
 <circle cx="8.5" cy="8.5" r="1.5" />
 <polyline points="21 15 16 10 5 21" />
 </svg>
 </div>
 <div>
 <h3 className="rq-section-title">Design Images</h3>
 <p className="rq-section-subtitle">
 Upload reference images of designs you like (max 10)
 </p>
 </div>
 </div>

 <div
 className={`rq-upload-zone${dragging ?" dragging" :""}`}
 onClick={() => fileInputRef.current?.click()}
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 >
 <div className="rq-upload-icon">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
 <polyline points="17 8 12 3 7 8" />
 <line x1="12" y1="3" x2="12" y2="15" />
 </svg>
 </div>
 <p className="rq-upload-text">
 Click to upload or drag & drop
 </p>
 <p className="rq-upload-hint">
 PNG, JPG, WEBP up to 5MB each · {10 - designImages.length} slots remaining
 </p>
 </div>

 <input
 ref={fileInputRef}
 type="file"
 accept="image/*"
 multiple
 style={{ display:"none"}}
 onChange={(e) => handleFiles(e.target.files)}
 />

 {designImages.length > 0 && (
 <div className="rq-upload-preview-grid">
 {designImages.map((img, idx) => (
 <div key={idx} className="rq-upload-preview">
 <img src={img.preview} alt={`Design ${idx + 1}`} />
 <button
 className="rq-upload-preview-remove"
 onClick={(e) => {
 e.stopPropagation();
 removeImage(idx);
}}
 >
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <line x1="18" y1="6" x2="6" y2="18" />
 <line x1="6" y1="6" x2="18" y2="18" />
 </svg>
 </button>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ══════════ 5. SIZE CHART ══════════ */}
 <div className="rq-section">
 <div className="rq-section-header">
 <div className="rq-section-icon emerald">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
 <circle cx="9" cy="7" r="4" />
 <line x1="19" y1="8" x2="19" y2="14" />
 <line x1="22" y1="11" x2="16" y2="11" />
 </svg>
 </div>
 <div>
 <h3 className="rq-section-title">Size Chart</h3>
 <p className="rq-section-subtitle">
 Provide your body measurements (in inches)
 </p>
 </div>
 </div>

 {/* Gender Toggle */}
 <div className="rq-size-gender-toggle">
 <button
 className={`rq-gender-btn${gender ==="men" ?" active" :""}`}
 onClick={() => setGender("men")}
 >
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="7" r="4" />
 <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
 </svg>
 Men
 </button>
 <button
 className={`rq-gender-btn${gender ==="women" ?" active" :""}`}
 onClick={() => setGender("women")}
 >
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="7" r="4" />
 <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
 </svg>
 Women
 </button>
 </div>

 {/* Body Diagram */}
 <div className="rq-body-diagram">
 <svg viewBox="0 0 100 220" fill="none" stroke="#7c3aed" strokeWidth="1.5">
 {/* Head */}
 <circle cx="50" cy="22" r="15" />
 {/* Neck */}
 <line x1="50" y1="37" x2="50" y2="48" />
 {/* Shoulders */}
 <line x1="20" y1="55" x2="80" y2="55" />
 {/* Torso */}
 <line x1="20" y1="55" x2="25" y2="120" />
 <line x1="80" y1="55" x2="75" y2="120" />
 {/* Waist line */}
 <line x1="30" y1="95" x2="70" y2="95" strokeDasharray="4 3" />
 {/* Hip line */}
 <line x1="25" y1="120" x2="75" y2="120" />
 {/* Left arm */}
 <line x1="20" y1="55" x2="8" y2="115" />
 {/* Right arm */}
 <line x1="80" y1="55" x2="92" y2="115" />
 {/* Left leg */}
 <line x1="35" y1="120" x2="30" y2="200" />
 {/* Right leg */}
 <line x1="65" y1="120" x2="70" y2="200" />
 {/* Inseam */}
 <line x1="50" y1="120" x2="50" y2="200" strokeDasharray="4 3" opacity="0.5" />
 </svg>
 </div>

 {/* Measurement Fields */}
 <div className="rq-size-grid">
 {MEASUREMENTS[gender].map((field) => (
 <div key={field.key} className="rq-size-field">
 <label className="rq-size-label">
 {field.label}
 </label>
 <div className="rq-size-input-wrap">
 <input
 type="number"
 className="rq-size-input"
 placeholder={field.placeholder}
 value={measurements[field.key] ||""}
 onChange={(e) =>
 handleMeasurement(field.key, e.target.value)
}
 min="0"
 step="0.5"
 />
 <span className="rq-size-unit">in</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ══════════ SUBMIT ══════════ */}
 <button
 className="rq-submit-btn"
 onClick={handleSubmit}
 disabled={submitting}
 style={{ marginBottom:"32px"}}
 >
 {submitting ? (
 <>
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:"spin 1s linear infinite"}}>
 <path d="M21 12a9 9 0 1 1-6.219-8.56" />
 </svg>
 Submitting...
 </>
 ) : (
 <>
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <line x1="22" y1="2" x2="11" y2="13" />
 <polygon points="22 2 15 22 11 13 2 9 22 2" />
 </svg>
 Submit Quote Request
 </>
 )}
 </button>
 </div>
 </div>
 );
}


// ── Store.jsx ──
import { useState, useEffect} from"react";
import { useParams, useNavigate} from"react-router-dom";
import { db} from"../firebase/firebase";
import { doc, getDoc} from"firebase/firestore";
/* ─── Shared fabric data (dummy data for now) ─── */
const FABRICS = [
 { id:"fab_001", name:"Premium Cotton Twill", type:"Cotton", supplier:"Lanka Fabrics Co.", rating: 4.8, reviewCount: 142, price: 850, inStock: true, bgColor:"#d4c5a9"},
 { id:"fab_002", name:"Silk Satin Blend", type:"Silk", supplier:"Royal Fabrics Ltd.", rating: 4.9, reviewCount: 218, price: 2300, inStock: true, bgColor:"#e8d5c4"},
 { id:"fab_003", name:"Linen Canvas", type:"Linen", supplier:"Natural Fibers", rating: 4.7, reviewCount: 98, price: 1200, inStock: true, bgColor:"#c8bfa9"},
 { id:"fab_004", name:"Polyester Georgette", type:"Polyester", supplier:"Modern Textiles", rating: 4.5, reviewCount: 77, price: 650, inStock: true, bgColor:"#d5c4d9"},
 { id:"fab_005", name:"Denim Heavy Weight", type:"Denim", supplier:"Blue Star Fabrics", rating: 4.8, reviewCount: 163, price: 950, inStock: true, bgColor:"#8ba4c4"},
 { id:"fab_006", name:"Chiffon Deluxe", type:"Chiffon", supplier:"Elegant Fabrics", rating: 4.6, reviewCount: 54, price: 1800, inStock: false, bgColor:"#f0ccd4"},
 { id:"fab_007", name:"Wool Blend Suiting", type:"Wool", supplier:"Premium Cloths", rating: 4.8, reviewCount: 89, price: 1250, inStock: true, bgColor:"#b8a99a"},
 { id:"fab_008", name:"Rayon Printed", type:"Rayon", supplier:"Color Works Textiles", rating: 4.4, reviewCount: 61, price: 780, inStock: true, bgColor:"#c7b8d4"},
];
export default function Store() {
 const { sellerId} = useParams();
 const navigate = useNavigate();
 const [profile, setProfile] = useState(null);
 const [loading, setLoading] = useState(true);
 // Filter products by the current store (sellerId)
 // For the dummy data layout,`sellerId` matches the`supplier` string.
 const decodedSellerId = decodeURIComponent(sellerId);
 const storeProducts = FABRICS.filter((f) => f.supplier === decodedSellerId);
 useEffect(() => {
 if (!sellerId) return;
 const fetchProfile = async () => {
 try {
 const snap = await getDoc(doc(db,"sellers", sellerId));
 if (snap.exists()) {
 setProfile(snap.data());
} else {
 setProfile({
 shopName: decodedSellerId,
 location:"Sri Lanka",
 rating: 4.8,
 reviews: 142
});
}
} catch (err) {
 console.error("Error fetching profile", err);
 setProfile({
 shopName: decodedSellerId,
 location:"Sri Lanka",
});
} finally {
 setLoading(false);
}
};
 fetchProfile();
}, [sellerId , decodedSellerId]);
 const displayName = profile?.shopName ||"Seller Store";
 const avatarLetter = displayName.charAt(0).toUpperCase();
 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
 </div>
 );
}
 return (
 <div className="min-h-screen font-sans pb-12">
 {/* ── Back breadcrumb ── */}
 <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-2">
 <button
 onClick={() => navigate(-1)}
 className="flex items-center gap-2 hover: text-sm font-medium transition-colors"
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="m15 18-6-6 6-6" />
 </svg>
 Back
 </button>
 </div>
 {/* ── Header Banner ──────────────────────────────────────── */}
 <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 pt-10 pb-5 px-6 lg:px-12 overflow-hidden mt-4">
 {/* Background shapes */}
 <div className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full blur-2xl" />
 <div className="absolute bottom-[-80px] right-[-20px] w-80 h-80 rounded-full blur-3xl" />
 <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
 {/* Profile Basic Info */}
 <div className="flex items-end gap-5">
 <div className="relative shrink-0">
 {profile?.logoUrl ? (
 <img
 src={profile.logoUrl}
 alt={displayName}
 className="w-28 h-28 object-cover rounded-2xl border-4 shadow-xl"
 />
 ) : (
 <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl font-bold shadow-xl border-4">
 {avatarLetter}
 </div>
 )}
 {/* Verified badge */}
 <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 shadow-sm">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
 </svg>
 </div>
 </div>
 <div className="mb-1">
 <div className="flex items-center gap-3 mb-2">
 <h1 className="text-3xl font-extrabold tracking-tight">{displayName}</h1>
 <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
 <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 Verified Store
 </span>
 </div>
 <div className="flex items-center gap-5 text-sm font-medium">
 <div className="flex items-center gap-1.5">
 <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 <span className="font-bold tracking-wide">{profile?.rating ||"4.8"}</span> / 5.0
 </div>
 <div className="flex items-center gap-1.5">
 <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
 </svg>
 {profile?.reviews ||"142"} reviews
 </div>
 <div className="flex items-center gap-1">
 <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 {profile?.location ||"Sri Lanka"}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 {/* ── Main Layout ────────────────────────────────────────── */}
 <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
 {/* Left Column (Main Content) */}
 <div className="lg:col-span-2 space-y-6">
 {/* About Store */}
 <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-8 h-8 rounded-full flex items-center justify-center">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
 </svg>
 </div>
 <h2 className="text-[17px] font-bold">About Store</h2>
 </div>
 <p className="leading-relaxed text-[15px]">
 {profile?.about ||"Welcome to our store! We supply premium quality fabrics globally, guaranteeing both durability and exquisite texture. Whether you are looking for luxurious silks, breathable cottons, or custom prints, our collections are carefully curated to ensure top-tier materials for your tailoring and designer needs."}
 </p>
 </div>
 {/* Store Items Grid */}
 <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full flex items-center justify-center">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 </div>
 <h2 className="text-[17px] font-bold">Store Products</h2>
 </div>
 </div>
 {storeProducts.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {storeProducts.map((item) => (
 <div
 key={item.id}
 onClick={() => navigate(`/shop/${item.id}`)}
 className="rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group relative cursor-pointer"
 >
 {/* Image */}
 <div className="relative h-44 overflow-hidden" style={{ background: item.bgColor}}>
 <div className="absolute inset-0 group-hover: transition-colors duration-300" />
 {item.inStock ? (
 <span className="absolute top-3 left-3 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
 In Stock
 </span>
 ) : (
 <span className="absolute top-3 left-3 border text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
 Out of Stock
 </span>
 )}
 </div>
 {/* Body */}
 <div className="p-4">
 <div className="flex items-start justify-between gap-2 mb-1">
 <h3 className="font-bold text-sm leading-tight line-clamp-2">
 {item.name}
 </h3>
 <div className="flex items-center gap-1 shrink-0">
 <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 <span className="text-xs font-bold">{item.rating}</span>
 </div>
 </div>
 <div className="text-xs font-semibold mb-3">
 {item.type}
 </div>
 <div className="flex items-center justify-between mt-auto">
 <span className="text-lg font-extrabold tracking-tight">
 LKR {item.price.toLocaleString()}
 </span>
 <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover: transition-colors">
 <svg className="w-4 h-4 group-hover: transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
 </svg>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="border-2 border-dashed rounded-2xl py-16 flex flex-col items-center justify-center">
 <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 <p className="font-medium text-sm">Products from this seller will appear here.</p>
 </div>
 )}
 </div>
 </div>
 {/* Right Column (Sidebar) */}
 <div className="rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border sticky top-8 relative overflow-hidden">
 {/* Subtle gradient bar at the top edge */}
 <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
 {/* Supplier Badges */}
 <div className="mb-8 mt-2">
 <h3 className="flex items-center gap-2 text-[15px] font-bold mb-3">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
 </svg>
 Achievements
 </h3>
 <div className="flex flex-col gap-3">
 <div className="flex items-center gap-3 p-3 rounded-xl border">
 <span className="text-xl">🏆</span>
 <div>
 <p className="text-sm font-bold">Top Seller 2023</p>
 <p className="text-xs">Consistently high ratings</p>
 </div>
 </div>
 <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
 <span className="text-xl">⚡</span>
 <div>
 <p className="text-sm font-bold text-green-900">Fast Shipper</p>
 <p className="text-xs text-green-700">Dispatches within 24h</p>
 </div>
 </div>
 </div>
 </div>
 {/* Specialities */}
 <div className="mb-8">
 <h3 className="flex items-center gap-2 text-[15px] font-bold mb-3">
 <div className="w-5 h-5 rounded-full flex items-center justify-center">
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
 </svg>
 </div>
 Product Specialities
 </h3>
 <div className="flex flex-wrap gap-2">
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Silks</span>
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Premium Cotton</span>
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Linen Canvas</span>
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Bulk Orders</span>
 </div>
 </div>
 {/* Action Buttons */}
 <div className="flex flex-col gap-3">
 <button className="w-full hover: font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md shadow-purple-200 flex items-center justify-center gap-2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
 </svg>
 Message Seller
 </button>
 <div className="grid grid-cols-2 gap-3">
 <button className="flex justify-center items-center gap-2 border hover: hover: text-sm font-semibold py-2.5 rounded-xl transition-colors">
 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
 </svg>
 Follow Store
 </button>
 <button className="flex justify-center items-center gap-2 border hover: hover: text-sm font-semibold py-2.5 rounded-xl transition-colors">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
 </svg>
 Share
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}


// ── Inventory.jsx ──
import { useState, useMemo, useRef} from"react";
import { Link, useNavigate} from"react-router-dom";
import { useAuth} from"../../context/AuthContext";
/* ─── Sample inventory data (replace with Firestore fetch later) ── */
const SAMPLE_ITEMS = [
 {
 id:"inv_001",
 name:"Velvet Upholstery",
 type:"Textured",
 category:"Colombo",
 rating: 4.6,
 colors: ["#7c3aed","#dc2626","#1e3a5f"],
 price: 1800,
 stock: 4,
 sales: 53,
 badge:"varient",
 stockStatus:"low",
 image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
},
 {
 id:"inv_002",
 name:"Batik Handloom",
 type:"Batik",
 category:"Kandy",
 rating: 4.9,
 colors: ["#1e293b","#374151","#6b7280"],
 price: 3200,
 stock: 40,
 sales: 180,
 badge: null,
 stockStatus:"in",
 image:"https://images.unsplash.com/photo-1558618047-f4d17fd1de69?auto=format&fit=crop&w=400&q=80",
},
 {
 id:"inv_003",
 name:"Polyester Georgette",
 type:"Polyester",
 category:"Colombo",
 rating: 4.5,
 colors: ["#c084fc","#ec4899","#f472b6","#a78bfa"],
 price: 650,
 stock: 0,
 sales: 87,
 badge:"hidden",
 stockStatus:"out",
 image: null,
},
 {
 id:"inv_004",
 name:"Linen Canvas",
 type:"Active",
 category:"Pettah",
 rating: 4.7,
 colors: ["#d6d3d1","#a8a29e"],
 price: 1200,
 stock: 18,
 sales: 38,
 badge: null,
 stockStatus:"low",
 image: null,
},
 {
 id:"inv_005",
 name:"Silk Satin Blend",
 type:"Permanent",
 category:"Kandy",
 rating: 4.9,
 colors: ["#f5f5dc","#c084fc","#ec4899","#60a5fa","#facc15"],
 price: 2400,
 stock: 45,
 sales: 215,
 badge: null,
 stockStatus:"in",
 image: null,
},
 {
 id:"inv_006",
 name:"Premium Cotton Twill",
 type:"Cotton",
 category:"Colombo",
 rating: 4.6,
 colors: ["#1e293b","#991b1b","#1b3a5c"],
 price: 850,
 stock: 100,
 sales: 342,
 badge: null,
 stockStatus:"in",
 image:"https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=400&q=80",
},
];
const TABS = ["All","In Stock","Low Stock","Out of Stock"];
const stockStatusConfig = {
 in: { label:"In Stock", bg:"bg-green-100", text:"text-green-700"},
 low: { label:"Low Stock", bg:"bg-amber-100", text:"text-amber-700"},
 out: { label:"Out of Stock", bg:"", text:""},
};
/* ─── Preset colour swatches for the palette ────────────────── */
const PALETTE_SWATCHES = [
"#000000","#374151","#6b7280","#9ca3af","#d1d5db","#f9fafb",
"#7f1d1d","#991b1b","#dc2626","#ef4444","#f87171","#fca5a5",
"#78350f","#92400e","#d97706","#f59e0b","#fcd34d","#fef08a",
"#14532d","#166534","#16a34a","#22c55e","#86efac","#bbf7d0",
"#1e3a5f","#1d4ed8","#2563eb","#3b82f6","#93c5fd","#bfdbfe",
"#4c1d95","#6d28d9","#7c3aed","#a855f7","#c084fc","#e9d5ff",
"#831843","#be185d","#ec4899","#f472b6",
];
/* ─── Add/Edit Modal ─────────────────────────────────────────── */
function ItemModal({ item, onClose, onSave}) {
 const [form, setForm] = useState(
 item
 ? { ...item, colors: item.colors ? [...item.colors] : []}
 : { name:"", type:"", category:"", price:"", stock:"", colors: [], stockStatus:"in", image: null}
 );
 /* image tab:"upload" |"url" */
 const [imageTab, setImageTab] = useState("upload");
 const [imageUrlInput, setImageUrlInput] = useState(item?.image ||"");
 const [dragOver, setDragOver] = useState(false);
 const fileInputRef = useRef(null);

 function handleChange(e) {
 setForm({ ...form, [e.target.name]: e.target.value});
}

 /* ── Image helpers ── */
 function applyFile(file) {
 if (!file || !file.type.startsWith("image/")) return;
 const reader = new FileReader();
 reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target.result}));
 reader.readAsDataURL(file);
}
 function handleFileChange(e) { applyFile(e.target.files[0]);}
 function handleDrop(e) {
 e.preventDefault(); setDragOver(false);
 applyFile(e.dataTransfer.files[0]);
}
 function handleApplyUrl() {
 if (imageUrlInput.trim()) setForm((f) => ({ ...f, image: imageUrlInput.trim()}));
}
 function clearImage() { setForm((f) => ({ ...f, image: null})); setImageUrlInput("");}

 /* ── Colour helpers ── */
 function toggleColor(hex) {
 setForm((f) => {
 const already = f.colors.includes(hex);
 return { ...f, colors: already ? f.colors.filter((c) => c !== hex) : [...f.colors, hex]};
});
}
 function addCustomColor(hex) {
 if (!form.colors.includes(hex)) setForm((f) => ({ ...f, colors: [...f.colors, hex]}));
}

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
 {/* Header */}
 <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
 <h3 className="font-bold text-lg">{item ?"Edit Item" :"Add New Item"}</h3>
 <button onClick={onClose} className="hover: transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path d="M18 6 6 18M6 6l12 12" />
 </svg>
 </button>
 </div>

 {/* Scrollable body */}
 <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
 {/* Basic fields */}
 {[
 { label:"Name", name:"name", placeholder:"e.g. Premium Cotton Twill"},
 { label:"Type / Fabric", name:"type", placeholder:"e.g. Cotton"},
 { label:"Location", name:"category", placeholder:"e.g. Colombo"},
 { label:"Price (LKR )", name:"price", placeholder:"e.g. 1500", type:"number"},
 { label:"Stock (meters)", name:"stock", placeholder:"e.g. 50", type:"number"},
 ].map(({ label, name, placeholder, type}) => (
 <div key={name}>
 <label className="block text-xs font-semibold mb-1">{label}</label>
 <input
 type={type ||"text"}
 name={name}
 value={form[name] ||""}
 onChange={handleChange}
 placeholder={placeholder}
 className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
 />
 </div>
 ))}

 {/* Stock Status */}
 <div>
 <label className="block text-xs font-semibold mb-1">Stock Status</label>
 <select
 name="stockStatus"
 value={form.stockStatus}
 onChange={handleChange}
 className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
 >
 <option value="in">In Stock</option>
 <option value="low">Low Stock</option>
 <option value="out">Out of Stock</option>
 </select>
 </div>

 {/* ── Image Section ── */}
 <div>
 <label className="block text-xs font-semibold mb-2">Product Image</label>

 {/* Tab toggle */}
 <div className="flex gap-1 rounded-xl p-1 mb-3">
 {[
 { id:"upload", label:"Upload from Device"},
 { id:"url", label:"Paste Image URL"},
 ].map((t) => (
 <button
 key={t.id}
 type="button"
 onClick={() => setImageTab(t.id)}
 className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${imageTab === t.id ?" shadow-sm" :" hover:"}`}
 >
 {t.label}
 </button>
 ))}
 </div>

 {imageTab ==="upload" ? (
 /* Drag & drop zone */
 <div
 onDragOver={(e) => { e.preventDefault(); setDragOver(true);}}
 onDragLeave={() => setDragOver(false)}
 onDrop={handleDrop}
 onClick={() => fileInputRef.current?.click()}
 className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 py-5 ${dragOver ?"" :" hover: hover:"}`}
 >
 <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
 {form.image && imageTab ==="upload" && !imageUrlInput ? (
 <img src={form.image} alt="preview" className="h-28 object-contain rounded-lg" />
 ) : (
 <>
 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="1.5" d="M3 16l4-4 4 4 4-5 4 5M3 20h18M3 4h18" />
 </svg>
 <p className="text-xs font-medium">Drag & drop or <span className="font-semibold">browse</span></p>
 <p className="text-[11px]">PNG, JPG, WEBP up to 10 MB</p>
 </>
 )}
 </div>
 ) : (
 /* URL input */
 <div className="flex gap-2">
 <input
 type="url"
 value={imageUrlInput}
 onChange={(e) => setImageUrlInput(e.target.value)}
 placeholder="https://example.com/fabric.jpg"
 className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
 />
 <button
 type="button"
 onClick={handleApplyUrl}
 className="px-4 py-2 hover: text-sm font-semibold rounded-xl transition-colors"
 >
 Apply
 </button>
 </div>
 )}

 {/* Preview strip + clear button (visible when image is set) */}
 {form.image && (
 <div className="mt-2 flex items-center gap-3 rounded-xl p-2">
 <img src={form.image} alt="preview" className="h-14 w-14 object-cover rounded-lg border" />
 <div className="flex-1 min-w-0">
 <p className="text-xs font-semibold truncate">Image selected</p>
 <p className="text-[11px] truncate">{form.image.startsWith("data:") ?"Local file" : form.image}</p>
 </div>
 <button type="button" onClick={clearImage} className="hover: transition-colors shrink-0">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M18 6 6 18M6 6l12 12" />
 </svg>
 </button>
 </div>
 )}
 </div>

 {/* ── Colour Palette ── */}
 <div>
 <label className="block text-xs font-semibold mb-2">
 Available Colours
 {form.colors.length > 0 && (
 <span className="ml-2">{form.colors.length} selected</span>
 )}
 </label>

 {/* Swatch grid */}
 <div className="flex flex-wrap gap-2 p-3 rounded-xl border mb-3">
 {PALETTE_SWATCHES.map((hex) => {
 const selected = form.colors.includes(hex);
 return (
 <button
 key={hex}
 type="button"
 title={hex}
 onClick={() => toggleColor(hex)}
 className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 focus:outline-none ${selected ?" ring-2 ring-purple-300 scale-110" :" ring-1 ring-gray-200"}`}
 style={{ backgroundColor: hex}}
 />
 );
})}
 </div>

 {/* Custom colour picker row */}
 <div className="flex items-center gap-2">
 <label className="text-xs font-medium shrink-0">Custom:</label>
 <input
 type="color"
 defaultValue="#7c3aed"
 onChange={(e) => addCustomColor(e.target.value)}
 className="w-10 h-8 rounded-lg border cursor-pointer p-0.5"
 title="Pick a custom colour"
 />
 <span className="text-xs">Click to open colour picker</span>
 </div>

 {/* Selected colours as removable chips */}
 {form.colors.length > 0 && (
 <div className="flex flex-wrap gap-2 mt-3">
 {form.colors.map((c) => (
 <span
 key={c}
 className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm"
 >
 <span className="w-3.5 h-3.5 rounded-full inline-block border" style={{ backgroundColor: c}} />
 {c}
 <button
 type="button"
 onClick={() => toggleColor(c)}
 className="hover: transition-colors leading-none"
 >
 ×
 </button>
 </span>
 ))}
 <button
 type="button"
 onClick={() => setForm((f) => ({ ...f, colors: []}))}
 className="text-xs hover: transition-colors px-2 py-1"
 >
 Clear all
 </button>
 </div>
 )}
 </div>
 </div>

 {/* Footer */}
 <div className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0">
 <button onClick={onClose} className="px-4 py-2 text-sm hover: font-medium transition-colors">
 Cancel
 </button>
 <button
 onClick={() => onSave(form)}
 className="px-5 py-2 hover: text-sm font-semibold rounded-xl transition-colors"
 >
 {item ?"Save Changes" :"Add Item"}
 </button>
 </div>
 </div>
 </div>
 );
}
/* ─── Main Component ─────────────────────────────────────────── */
export default function Inventory() {
 const { user: _user} = useAuth();
 const _navigate = useNavigate();
 const [items, setItems] = useState(SAMPLE_ITEMS);
 const [activeTab, setActiveTab] = useState("All");
 const [search, setSearch] = useState("");
 const [sortBy, setSortBy] = useState("name");
 const [viewMode, setViewMode] = useState("grid"); // grid | list
 const [modal, setModal] = useState(null); // null | { mode:"add" |"edit", item?: {...}}
 /* ── Derived stats ── */
 const totalListings = items.length;
 const totalSales = items.reduce((s, i) => s + (i.sales || 0), 0);
 const lowCount = items.filter((i) => i.stockStatus ==="low").length;
 const outCount = items.filter((i) => i.stockStatus ==="out").length;
 const stockValue = items.reduce((s, i) => s + (i.price || 0) * (i.stock || 0), 0);
 /* ── Filtered + sorted list ── */
 const filtered = useMemo(() => {
 let list = [...items];
 // Tab filter
 if (activeTab ==="In Stock") list = list.filter((i) => i.stockStatus ==="in");
 if (activeTab ==="Low Stock") list = list.filter((i) => i.stockStatus ==="low");
 if (activeTab ==="Out of Stock") list = list.filter((i) => i.stockStatus ==="out");
 // Search
 if (search) {
 const q = search.toLowerCase();
 list = list.filter((i) =>
 i.name.toLowerCase().includes(q) ||
 i.type?.toLowerCase().includes(q) ||
 i.category?.toLowerCase().includes(q)
 );
}
 // Sort
 list.sort((a, b) => {
 if (sortBy ==="name") return a.name.localeCompare(b.name);
 if (sortBy ==="price") return a.price - b.price;
 if (sortBy ==="stock") return b.stock - a.stock;
 if (sortBy ==="sales") return b.sales - a.sales;
 return 0;
});
 return list;
}, [items, activeTab, search, sortBy]);
 function handleSave(form) {
 if (modal?.mode ==="add") {
 setItems((prev) => [
 ...prev,
 {
 ...form,
 id:`inv_${Date.now()}`,
 rating: 5.0,
 sales: 0,
 colors: form.colors || [],
 badge: null,
 hidden: false,
 price: Number(form.price) || 0,
 stock: Number(form.stock) || 0,
},
 ]);
} else {
 setItems((prev) => prev.map((i) => (i.id === form.id ? { ...i, ...form} : i)));
}
 setModal(null);
}
 function handleToggleHide(id) {
 setItems((prev) => prev.map((i) => i.id === id ? { ...i, hidden: !i.hidden} : i));
}
 const formatValue = (v) => {
 if (v >= 1_000_000) return`LKR ${(v / 1_000_000).toFixed(1)}M`;
 if (v >= 1_000) return`LKR ${(v / 1_000).toFixed(0)}K`;
 return`LKR ${v}`;
};
 const stats = [
 {
 label:"Total Listings",
 value: totalListings,
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
 </svg>
 ),
 bg:"from-purple-700 to-purple-900",
 valueClass:"",
},
 {
 label:"Total Sales",
 value: totalSales,
 icon: (
 <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
 </svg>
 ),
 bg:"from-emerald-600 to-emerald-800",
 valueClass:"",
},
 {
 label:"Low / Out Stock",
 value:`${lowCount} / ${outCount}`,
 icon: (
 <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
 </svg>
 ),
 bg:"from-amber-500 to-orange-700",
 valueClass:"",
},
 {
 label:"Stock Value",
 value: formatValue(stockValue),
 icon: (
 <svg className="w-5 h-5 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
 </svg>
 ),
 bg:"from-violet-600 to-violet-900",
 valueClass:"",
},
 ];
 return (
 <div className="min-h-screen">
 {/* ── Hero Header ────────────────────────────────────── */}
 <div
 className="relative overflow-hidden"
 style={{ background:"linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #4c1d95 100%)"}}
 >
 {/* decorative blobs */}
 <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
 style={{ background:"radial-gradient(circle, #a78bfa, transparent)"}} />
 <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full opacity-10"
 style={{ background:"radial-gradient(circle, #c4b5fd, transparent)"}} />
 <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-10">
 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-xs mb-4">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
 </svg>
 <Link to="/dashboard" className="hover: transition-colors">Supplier Portal</Link>
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M9 18l6-6-6-6" />
 </svg>
 <span className="">Inventory</span>
 </div>
 <div className="flex items-end justify-between flex-wrap gap-4">
 <div>
 <h1 className="text-3xl font-extrabold tracking-tight">My Inventory</h1>
 <p className="mt-1 text-sm">
 Manage your {totalListings} fabric listings on ClothStreet
 </p>
 </div>
 <button
 onClick={() => setModal({ mode:"add"})}
 className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl shadow-lg hover: transition-colors text-sm"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2.5" d="M12 5v14M5 12h14" />
 </svg>
 Add New Item
 </button>
 </div>
 {/* Stats Row */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
 {stats.map((stat) => (
 <div
 key={stat.label}
 className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5 shadow-lg relative overflow-hidden`}
 >
 <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full" />
 <div className="flex items-center gap-2 mb-2">
 {stat.icon}
 <span className="text-xs font-medium">{stat.label}</span>
 </div>
 <p className={`text-2xl sm:text-3xl font-extrabold ${stat.valueClass} leading-none`}>
 {stat.value}
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>
 {/* ── Filters & Grid ────────────────────────────────── */}
 <div className="max-w-7xl mx-auto px-6 py-6">
 {/* Toolbar */}
 <div className="rounded-2xl shadow-sm border p-4 mb-6">
 <div className="flex flex-wrap items-center gap-3">
 {/* Search */}
 <div className="relative flex-1 min-w-[180px]">
 <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <circle cx="11" cy="11" r="8" strokeWidth="2" />
 <path d="m21 21-4.3-4.3" strokeWidth="2" />
 </svg>
 <input
 type="text"
 placeholder="Search listings…"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
 />
 </div>
 {/* Filter icon (decorative) */}
 <button className="flex items-center gap-1.5 px-3 py-2 border rounded-xl text-sm hover: hover: transition-colors">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <line x1="4" x2="4" y1="21" y2="14" strokeWidth="2" />
 <line x1="4" x2="4" y1="10" y2="3" strokeWidth="2" />
 <line x1="12" x2="12" y1="21" y2="12" strokeWidth="2" />
 <line x1="12" x2="12" y1="8" y2="3" strokeWidth="2" />
 <line x1="20" x2="20" y1="21" y2="16" strokeWidth="2" />
 <line x1="20" x2="20" y1="12" y2="3" strokeWidth="2" />
 <line x1="2" x2="6" y1="14" y2="14" strokeWidth="2" />
 <line x1="10" x2="14" y1="8" y2="8" strokeWidth="2" />
 <line x1="18" x2="22" y1="16" y2="16" strokeWidth="2" />
 </svg>
 </button>
 {/* Tabs */}
 <div className="flex items-center gap-1 rounded-xl p-1">
 {TABS.map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab
 ?" shadow-sm"
 :" hover:"
}`}
 >
 {tab}
 </button>
 ))}
 </div>
 {/* Sort */}
 <select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 className="text-xs border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
 >
 <option value="name">Name ↕</option>
 <option value="price">Price ↕</option>
 <option value="stock">Stock ↕</option>
 <option value="sales">Sales ↕</option>
 </select>
 {/* View toggle */}
 <div className="flex items-center gap-1 border rounded-xl p-1">
 {["grid","list"].map((v) => (
 <button
 key={v}
 onClick={() => setViewMode(v)}
 className={`p-1.5 rounded-lg transition-all ${viewMode === v ?"" :" hover:"}`}
 >
 {v ==="grid" ? (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
 <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
 <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
 <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
 </svg>
 ) : (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
 <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
 <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
 </svg>
 )}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Results count */}
 <p className="text-xs mb-4 font-medium">{filtered.length} listings</p>

 {/* Grid */}
 {viewMode ==="grid" ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {filtered.map((item) => {
 const ss = stockStatusConfig[item.stockStatus] || stockStatusConfig.in;
 const isHidden = !!item.hidden;
 return (
 <div
 key={item.id}
 className={` rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group relative ${isHidden ?"border-amber-200 opacity-70" :""
}`}
 >
 {/* Image */}
 <div className="relative h-44 overflow-hidden bg-gradient-to-br from-purple-50 to-gray-100">
 {item.image ? (
 <img
 src={item.image}
 alt={item.name}
 className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isHidden ?"grayscale brightness-75" :""
}`}
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center">
 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
 <path d="m9 9 4 4 4-4" strokeWidth="1.5" />
 </svg>
 </div>
 )}
 {/* Hidden overlay banner */}
 {isHidden && (
 <div className="absolute inset-0 flex items-center justify-center">
 <span className="flex items-center gap-1.5 bg-amber-500 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
 <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
 </svg>
 Hidden from customers
 </span>
 </div>
 )}

 <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold ${ss.bg} ${ss.text}`}>
 {ss.label}
 </span>
 </div>

 {/* Body */}
 <div className="p-4">
 <div className="flex items-start justify-between gap-2 mb-1">
 <h3 className={`font-bold text-sm leading-tight ${isHidden ?"" :""
}`}>{item.name}</h3>
 <div className="flex items-center gap-1 shrink-0">
 <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 <span className="text-xs font-semibold">{item.rating}</span>
 </div>
 </div>

 <p className="text-xs mb-2 flex items-center gap-1">
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z" />
 <circle cx="12" cy="10" r="3" strokeWidth="2" />
 </svg>
 {item.category}
 </p>

 <div className="flex items-center gap-2 mb-3">
 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ss.bg} ${ss.text}`}>
 {item.stockStatus ==="in" ?`In Stock · ${item.stock}m` :
 item.stockStatus ==="low" ?`Low Stock · ${item.stock}m` :"Out of Stock · 0m"}
 </span>
 <span className="text-xs">{item.sales} sales</span>
 </div>

 <div className="flex items-center gap-1.5 mb-3">
 {item.colors.slice(0, 5).map((c, i) => (
 <span
 key={i}
 className="w-4 h-4 rounded-full border shadow-sm ring-1 ring-gray-200"
 style={{ background: c}}
 />
 ))}
 {item.colors.length > 5 && (
 <span className="text-xs">+{item.colors.length - 5}</span>
 )}
 </div>

 <div className="flex items-center justify-between pt-1">
 <div>
 <span className="text-base font-extrabold">
 LKR {item.price.toLocaleString()}
 </span>
 <span className="text-xs"> /m</span>
 </div>
 {/* Action buttons */}
 <div className="flex items-center gap-2">
 {/* Hide toggle */}
 <button
 onClick={() => handleToggleHide(item.id)}
 title={isHidden ?"Show listing" :"Hide listing"}
 className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${isHidden
 ?"bg-amber-50 hover:bg-amber-100 text-amber-600"
 :" hover:"
}`}
 >
 {isHidden ? (
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
 <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
 </svg>
 ) : (
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
 <circle cx="12" cy="12" r="3" strokeWidth="2" />
 </svg>
 )}
 {isHidden ?"Show" :"Hide"}
 </button>
 {/* Edit */}
 <button
 onClick={() => setModal({ mode:"edit", item})}
 className="flex items-center gap-1.5 px-3 py-1.5 hover: text-xs font-semibold rounded-xl transition-colors"
 >
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
 </svg>
 Edit
 </button>
 </div>
 </div>
 </div>
 </div>
 );
})}

 {/* Add New card */}
 <button
 onClick={() => setModal({ mode:"add"})}
 className="rounded-2xl border-2 border-dashed hover: hover: transition-all flex flex-col items-center justify-center gap-3 h-full min-h-[280px] group"
 >
 <div className="w-12 h-12 rounded-full group-hover: flex items-center justify-center transition-colors">
 <svg className="w-6 h-6 group-hover: transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M12 5v14M5 12h14" />
 </svg>
 </div>
 <span className="text-sm font-semibold group-hover: transition-colors">
 Add New Listing
 </span>
 </button>
 </div>
 ) : (
 /* List View */
 <div className="rounded-2xl shadow-sm border overflow-hidden">
 <table className="w-full text-sm">
 <thead className="border-b">
 <tr>
 {["Item","Category","Stock","Price","Sales","Actions"].map((h) => (
 <th key={h} className="px-5 py-3 text-left text-xs font-semibold whitespace-nowrap">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {filtered.map((item) => {
 const ss = stockStatusConfig[item.stockStatus] || stockStatusConfig.in;
 const isHidden = !!item.hidden;
 return (
 <tr
 key={item.id}
 className={`transition-colors ${isHidden ?"bg-amber-50/40 hover:bg-amber-50/60" :"hover:"}`}
 >
 <td className="px-5 py-3.5">
 <div>
 <div className="flex items-center gap-2">
 <p className={`font-semibold ${isHidden ?"" :""}`}>{item.name}</p>
 {isHidden && (
 <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
 <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
 <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
 </svg>
 Hidden
 </span>
 )}
 </div>
 <p className="text-xs">{item.type}</p>
 </div>
 </td>
 <td className="px-5 py-3.5">{item.category}</td>
 <td className="px-5 py-3.5">
 <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ss.bg} ${ss.text}`}>
 {ss.label}
 </span>
 </td>
 <td className="px-5 py-3.5 font-bold">LKR {item.price.toLocaleString()}</td>
 <td className="px-5 py-3.5">{item.sales}</td>
 <td className="px-5 py-3.5">
 <div className="flex items-center gap-2">
 {/* Hide toggle */}
 <button
 onClick={() => handleToggleHide(item.id)}
 title={isHidden ?"Show listing" :"Hide listing"}
 className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${isHidden
 ?"bg-amber-50 hover:bg-amber-100 text-amber-600"
 :" hover:"
}`}
 >
 {isHidden ? (
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
 <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
 </svg>
 ) : (
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
 <circle cx="12" cy="12" r="3" strokeWidth="2" />
 </svg>
 )}
 {isHidden ?"Show" :"Hide"}
 </button>
 {/* Edit */}
 <button
 onClick={() => setModal({ mode:"edit", item})}
 className="flex items-center gap-1.5 px-3 py-1.5 hover: text-xs font-semibold rounded-xl transition-colors"
 >
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
 </svg>
 Edit
 </button>
 </div>
 </td>
 </tr>
 );
})}

 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* ── Modal ─────────────────────────────────────────── */}
 {modal && (
 <ItemModal
 item={modal.mode ==="edit" ? modal.item : null}
 onClose={() => setModal(null)}
 onSave={handleSave}
 />
 )}
 </div>
 );
}


// ── Portfolio.jsx ──
import { useState, useEffect} from"react";
import { useAuth} from"../../context/AuthContext";
import { db} from"../../firebase/firebase";
import { doc, getDoc} from"firebase/firestore";
export default function Portfolio() {
 const { user} = useAuth();
 const [profile, setProfile] = useState(null);
 const [loading, setLoading] = useState(true);
 useEffect(() => {
 if (!user) return;
 const fetchProfile = async () => {
 try {
 const snap = await getDoc(doc(db,"sellers", user.uid));
 if (snap.exists()) setProfile(snap.data());
} catch (err) {
 console.error("Error fetching profile", err);
} finally {
 setLoading(false);
}
};
 fetchProfile();
}, [user]);
 const displayName = profile?.shopName || user?.name || user?.email ||"Nimal Perera";
 const avatarLetter = displayName.charAt(0).toUpperCase();
 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
 </div>
 );
}
 return (
 <div className="min-h-screen font-sans pb-12">
 {/* ── Header Banner ──────────────────────────────────────── */}
 <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 pt-10 pb-5 px-6 lg:px-12 overflow-hidden">
 {/* Background shapes */}
 <div className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full blur-2xl" />
 <div className="absolute bottom-[-80px] right-[-20px] w-80 h-80 rounded-full blur-3xl" />
 <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
 {/* Profile Basic Info */}
 <div className="flex items-end gap-5">
 <div className="relative shrink-0">
 {profile?.logoUrl ? (
 <img
 src={profile.logoUrl}
 alt={displayName}
 className="w-28 h-28 object-cover rounded-2xl border-4 shadow-xl"
 />
 ) : (
 <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl font-bold shadow-xl border-4">
 {avatarLetter}
 </div>
 )}
 {/* Verified badge */}
 <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 shadow-sm">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
 </svg>
 </div>
 </div>
 <div className="mb-1">
 <div className="flex items-center gap-3 mb-2">
 <h1 className="text-3xl font-extrabold tracking-tight">{displayName}</h1>
 <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
 <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 Premium Supplier
 </span>
 </div>
 <div className="flex items-center gap-5 text-sm font-medium">
 <div className="flex items-center gap-1.5">
 <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 <span className="font-bold tracking-wide">4.7</span> / 5.0
 </div>
 <div className="flex items-center gap-1.5">
 <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
 </svg>
 3 reviews
 </div>
 <div className="flex items-center gap-1">
 <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 {profile?.location ||"Sri Lanka"}
 </div>
 </div>
 </div>
 </div>
 {/* Edit Profile Button */}
 <div className="absolute top-0 right-0 md:static">
 <button className="flex items-center gap-2 hover: border px-5 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-sm">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
 </svg>
 Edit Profile
 </button>
 </div>
 </div>
 </div>
 {/* ── Main Layout ────────────────────────────────────────── */}
 <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
 {/* Left Column (Main Content) */}
 <div className="lg:col-span-2 space-y-6">
 {/* About Me */}
 <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-8 h-8 rounded-full flex items-center justify-center">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
 </svg>
 </div>
 <h2 className="text-[17px] font-bold">About Me</h2>
 </div>
 <p className="leading-relaxed text-[15px]">
 {profile?.about ||"I deliver professional tailoring and high-quality fabric services with attention to detail and flawless execution."}
 </p>
 </div>
 {/* Portfolio Gallery */}
 <div className="rounded-3xl p-6 sm:p-8 shadow-sm border">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-8 h-8 rounded-full flex items-center justify-center">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 </div>
 <h2 className="text-[17px] font-bold">Portfolio Gallery</h2>
 </div>
 {/* Empty State */}
 <div className="border-2 border-dashed rounded-2xl py-16 flex flex-col items-center justify-center">
 <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 <p className="font-medium text-sm">No portfolio photos yet</p>
 </div>
 </div>
 {/* Customer Reviews Header Title */}
 <div className="pt-2 flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
 <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 </div>
 <h2 className="text-[17px] font-bold">Customer Reviews</h2>
 <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold ml-2">
 <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 4.7 · 3 reviews
 </span>
 </div>
 {/* We might display review cards here later */}
 </div>
 {/* Right Column (Sidebar) */}
 <div className="rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border sticky top-8 relative overflow-hidden">
 {/* Subtle gradient bar at the top edge */}
 <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
 {/* Pricing */}
 <div className="mb-8 mt-2">
 <p className="text-xs font-bold tracking-wider uppercase mb-1">Starting Price</p>
 <p className="text-3xl font-extrabold">LKR 2,000</p>
 </div>
 {/* Services */}
 <div className="mb-8">
 <h3 className="flex items-center gap-2 text-[15px] font-bold mb-3">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 Services
 </h3>
 <div className="flex flex-wrap gap-2">
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Suits</span>
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Dresses</span>
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Customize designs</span>
 </div>
 </div>
 {/* Customization Types */}
 <div className="mb-8">
 <h3 className="flex items-center gap-2 text-[15px] font-bold mb-3">
 <div className="w-5 h-5 rounded-full flex items-center justify-center">
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2.5" strokeLinecap="round" d="M12 4v16M4 12h16" />
 </svg>
 </div>
 Customization Types
 </h3>
 <div className="flex flex-wrap gap-2">
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Measurement Base</span>
 <span className="px-3 py-1.5 text-xs font-semibold rounded-full border">Design Base</span>
 </div>
 </div>
 {/* Action Buttons */}
 <div className="flex flex-col gap-3">
 <button className="w-full hover: font-bold text-[15px] py-3.5 rounded-xl transition-colors shadow-md shadow-purple-200">
 Contact Me
 </button>
 <div className="grid grid-cols-2 gap-3">
 <button className="flex justify-center items-center gap-2 border hover:border-green-300 hover:bg-green-50 text-sm font-semibold py-2.5 rounded-xl transition-colors">
 <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
 Quotation
 </button>
 <button className="flex justify-center items-center gap-2 border hover: hover: text-sm font-semibold py-2.5 rounded-xl transition-colors">
 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
 </svg>
 Save
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}


// ── seller-dashboard.jsx ──
import Navbar from"../../components/common/Navbar";
import { useState, useEffect} from"react";
import { useNavigate} from"react-router-dom";
// ── existing AuthContext 
import { useAuth} from"../../context/AuthContext";
// ── Firebase ─────────────────────────────────────────────────
import { db} from"../../firebase/firebase";
import {
 collection,
 query,
 where,
 getDocs,
 doc,
 getDoc,
 orderBy,
 limit,
} from"firebase/firestore";
// ─────────────────────────────────────────────────────────────
// Static UI data
// ─────────────────────────────────────────────────────────────
const quickActions = [
 {
 label:"Fabric Marketplace",
 desc:"Browse 500+ verified suppliers",
 route:"/shop",
 iconBg:"",
 icon: (
 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
 <path strokeWidth="2" d="M3 6h18" />
 <path strokeWidth="2" d="M16 10a4 4 0 0 1-8 0" />
 </svg>
 ),
},
 {
 label:"Find Tailors",
 desc:"1,200+ skilled professionals",
 route:"/tailors",
 iconBg:"bg-violet-100",
 icon: (
 <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <circle cx="6" cy="6" r="3" strokeWidth="2" />
 <circle cx="6" cy="18" r="3" strokeWidth="2" />
 <line x1="20" x2="8.12" y1="4" y2="15.88" strokeWidth="2" />
 <line x1="14.47" x2="20" y1="14.48" y2="20" strokeWidth="2" />
 <line x1="8.12" x2="12" y1="8.12" y2="12" strokeWidth="2" />
 </svg>
 ),
},
 {
 label:"Find Designers",
 desc:"Creative talent across Sri Lanka",
 route:"/designers",
 iconBg:"bg-rose-100",
 icon: (
 <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <circle cx="12" cy="8" r="4" strokeWidth="2" />
 <path strokeWidth="2" d="M8.5 14.5A6 6 0 003 20h18a6 6 0 00-5.5-5.5" />
 </svg>
 ),
},
 {
 label:"AI Smart Match",
 desc:"Get personalised recommendations",
 route:"/match",
 iconBg:"",
 icon: (
 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 ),
},
];
const FOOTER_LINKS = {
 Platform: ["Fabric Marketplace","Find Tailors","AI Recommendations","Order Tracking","Join as Supplier"],
"For Business": ["List Your Fabrics","Tailor Registration","Designer Portal","Bulk Orders","Enterprise Solutions"],
};
// Matches the status strings your seed data uses
const statusColours = {
"Confirmed":"",
"In Production":"bg-orange-100 text-orange-600",
"Fabric Ordered":"",
"Ready to Deliver":"",
"Shipped":"bg-cyan-100 text-cyan-600",
"Completed":"bg-green-100 text-green-600",
};
// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function SellerDashboard() {
 const navigate = useNavigate();
 // user.name, user.email, user.role, user.uid — all from AuthContext
 const { user} = useAuth();
 // Extra Firestore fields not in AuthContext (logoUrl, shopName, isOpen)
 const [sellerProfile, setSellerProfile] = useState(null);
 const [orders, setOrders] = useState([]);
 const [topRated, setTopRated] = useState([]);
 const [stats, setStats] = useState({
 active: 0, inProduction: 0, readyToDeliver: 0, completed: 0,
});
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 // Redirect non-sellers away from this page
 useEffect(() => {
 if (user && user.role !=="seller") {
 navigate("/");
}
}, [user, navigate]);
 // Firestore reads — runs once when user is available
 useEffect(() => {
 if (!user) return;
 const fetchData = async () => {
 try {
 const uid = user.uid;
 // ── READ sellers.doc(uid) → shopName, logoUrl, isOpen ──
 const sellerSnap = await getDoc(doc(db,"sellers", uid));
 if (sellerSnap.exists()) {
 setSellerProfile(sellerSnap.data());
}
 // ── READ orders where sellerId == uid ──────────────────
 const ordersSnap = await getDocs(
 query(collection(db,"orders"), where("sellerId","==", uid))
 );
 const allOrders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data()}));
 <Navbar />
 // Count by status for the stats cards
 setStats({
 active: allOrders.filter((o) =>
 ["Confirmed","In Production","Fabric Ordered","Ready to Deliver","Shipped"].includes(o.status)
 ).length,
 inProduction: allOrders.filter((o) => o.status ==="In Production").length,
 readyToDeliver: allOrders.filter((o) => o.status ==="Ready to Deliver").length,
 completed: allOrders.filter((o) => o.status ==="Completed").length,
});
 // Sort newest first, keep the 3 most recent for the table
 const sorted = [...allOrders].sort((a, b) => {
 const toMs = (v) => v?.toDate?.().getTime() ?? new Date(v ?? 0).getTime();
 return toMs(b.createdAt) - toMs(a.createdAt);
});
 setOrders(sorted.slice(0, 3));
 // ── READ tailors orderBy rating desc limit 2 ───────────
 const tailorsSnap = await getDocs(
 query(collection(db,"tailors"), orderBy("rating","desc"), limit(2))
 );
 setTopRated(tailorsSnap.docs.map((d) => ({ id: d.id, ...d.data()})));
} catch (err) {
 console.error("SellerDashboard fetch error:", err);
 setError("Could not load dashboard data. Please refresh.");
} finally {
 setLoading(false);
}
};
 fetchData();
}, [user]);
 // Helper — format Firestore Timestamp or ISO string
 const formatDate = (raw) => {
 if (!raw) return"";
 const d = raw?.toDate ? raw.toDate() : new Date(raw);
 return d.toLocaleDateString("en-GB", { day:"numeric", month:"short"});
};
 // Display name priority: Firestore shopName → AuthContext user.name → email
 const displayName = sellerProfile?.shopName || user?.name || user?.email ||"Seller";
 const avatarLetter = displayName.charAt(0).toUpperCase();
 const statsData = [
 {
 label:"Active Orders", value: stats.active,
 color:"", bg:"",
 icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M12 6v6l4 2" /></svg>,
},
 {
 label:"In Production", value: stats.inProduction,
 color:"text-orange-500", bg:"bg-orange-50",
 icon: <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>,
},
 {
 label:"Ready to Deliver", value: stats.readyToDeliver,
 color:"", bg:"",
 icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1" strokeWidth="2" /><path strokeWidth="2" d="M16 8h4l3 5v3h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>,
},
 {
 label:"Completed", value: stats.completed,
 color:"text-green-600", bg:"bg-green-50",
 icon: <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M9 12l2 2 4-4" /></svg>,
},
 ];
 // ── Loading / error screens ───────────────────────────────
 if (loading) return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="flex flex-col items-center gap-3">
 <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
 <p className="text-sm font-medium">Loading your dashboard…</p>
 </div>
 </div>
 );
 if (error) return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="rounded-2xl p-8 shadow text-center max-w-sm">
 <p className="font-semibold mb-3">⚠️ {error}</p>
 <button onClick={() => window.location.reload()}
 className="px-4 py-2 rounded-xl text-sm font-semibold hover:">
 Retry
 </button>
 </div>
 </div>
 );
 return (
 <div className="min-h-screen font-sans flex flex-col">

 
 <div className="px-6 py-5 flex items-center justify-between">
 <div className="flex items-center gap-4">
 {sellerProfile?.logoUrl ? (
 <img src={sellerProfile.logoUrl} alt="Shop logo"
 className="w-12 h-12 rounded-2xl object-cover shadow-lg" />
 ) : (
 <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
 {avatarLetter}
 </div>
 )}
 <div>
 <p className="text-sm">
 Good {new Date().getHours() < 12 ?"morning" : new Date().getHours() < 18 ?"afternoon" :"evening"},
 </p>
 {/* displayName uses same user object as Navbar */}
 <p className="font-bold text-xl leading-tight">{displayName}</p>
 <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">
 {user?.role}
 </span>
 </div>
 </div>
 <button onClick={() => navigate("/seller-shop")}
 className="flex items-center gap-2 hover: border px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
 </svg>
 My Profile
 </button>
 </div>
 {/* Your existing <Navbar /> is rendered by the router — no duplicate here */}
 <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

 <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {statsData.map((stat) => (
 <div key={stat.label}
 className="rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow">
 <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
 {stat.icon}
 </div>
 <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
 <p className="text-sm mt-1">{stat.label}</p>
 </div>
 ))}
 </section>

 <section>
 <h2 className="text-base font-bold mb-4">Quick Actions</h2>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {quickActions.map((action) => (
 <button key={action.label} onClick={() => navigate(action.route)}
 className="rounded-2xl p-5 shadow-sm border hover:shadow-md hover: transition-all text-left group">
 <div className={`w-12 h-12 rounded-2xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
 {action.icon}
 </div>
 <p className="font-bold text-sm">{action.label}</p>
 <p className="text-xs mt-1 leading-snug">{action.desc}</p>
 </button>
 ))}
 </div>
 </section>

 <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Recent Orders */}
 <div className="lg:col-span-2 rounded-2xl shadow-sm border overflow-hidden">
 <div className="flex items-center justify-between px-6 py-4 border-b">
 <div className="flex items-center gap-2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
 </svg>
 <h2 className="font-bold">Recent Orders</h2>
 </div>
 {/* /orders matches the Orders link in your Navbar dropdown */}
 <button onClick={() => navigate("/orders")}
 className="text-sm hover: font-semibold flex items-center gap-1">
 View all
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
 </button>
 </div>
 {orders.length === 0 ? (
 <div className="px-6 py-10 text-center text-sm">No orders yet.</div>
 ) : (
 <div className="divide-y divide-gray-50">
 {orders.map((order) => (
 <div key={order.id} className="flex items-center justify-between px-6 py-4 hover: transition-colors">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
 </svg>
 </div>
 <div>
 <p className="font-semibold text-sm">{order.orderId || order.id}</p>
 <p className="text-xs">
 {order.itemName || order.item ||"Order"} · {formatDate(order.createdAt)}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColours[order.status] ||""}`}>
 {order.status}
 </span>
 <span className="font-bold text-sm whitespace-nowrap">
 LKR {Number(order.total ?? order.totalAmount ?? 0).toLocaleString()}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}
 <div className="px-6 py-4 border-t">
 <button onClick={() => navigate("/orders")}
 className="w-full flex items-center justify-center gap-2 text-sm hover: font-medium py-2 rounded-xl hover: transition-colors border">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
 </svg>
 View Order History & Track Orders
 </button>
 </div>
 </div>
 {/* Right column */}
 <div className="flex flex-col gap-4">
 {/* AI Match — /ai-match matches your Navbar AI Match link */}
 <div className="rounded-2xl p-5 relative overflow-hidden">
 <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-50" />
 <div className="absolute -right-2 -top-4 w-16 h-16 rounded-full opacity-30" />
 <div className="relative">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 </div>
 <h3 className="font-bold text-lg mb-1">Try AI Smart Match</h3>
 <p className="text-sm mb-4 leading-snug">
 Get AI-powered fabric and tailor recommendations for your project.
 </p>
 <button onClick={() => navigate("/match")}
 className="w-full font-bold py-2.5 rounded-xl text-sm hover: transition-colors flex items-center justify-center gap-2">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 Get Recommendations
 </button>
 </div>
 </div>
 {/* Top Rated — from tailors collection */}
 <div className="rounded-2xl shadow-sm border overflow-hidden">
 <div className="flex items-center gap-2 px-5 py-4 border-b">
 <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
 <path d="M13 2L15.09 8.26L22 9L17 13.74L18.18 21L13 17.77L7.82 21L9 13.74L4 9L10.91 8.26L13 2Z" />
 </svg>
 <h3 className="font-bold text-sm">Top Rated This Week</h3>
 </div>
 {topRated.length === 0 ? (
 <div className="px-5 py-6 text-center text-sm">No data yet.</div>
 ) : (
 <div className="divide-y divide-gray-50">
 {topRated.map((tailor) => {
 const tailorName = tailor.name || tailor.shopName ||"Tailor";
 const avatarColors = ["","","bg-rose-500","bg-emerald-500"];
 const color = avatarColors[tailorName.charCodeAt(0) % avatarColors.length];
 return (
 <div key={tailor.id} className="flex items-center justify-between px-5 py-3.5 hover: transition-colors">
 <div className="flex items-center gap-3">
 {tailor.photoUrl ? (
 <img src={tailor.photoUrl} alt={tailorName} className="w-9 h-9 rounded-full object-cover" />
 ) : (
 <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-sm font-bold`}>
 {tailorName.charAt(0).toUpperCase()}
 </div>
 )}
 <div>
 <p className="font-semibold text-sm">{tailorName}</p>
 <p className="text-xs">{tailor.specialty || tailor.skills?.[0] ||"Tailor"}</p>
 </div>
 </div>
 <div className="flex items-center gap-1">
 <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
 <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
 </svg>
 <span className="text-sm font-bold">
 {tailor.rating ? Number(tailor.rating).toFixed(1) :"N/A"}
 </span>
 </div>
 </div>
 );
})}
 </div>
 )}
 </div>
 </div>
 </section>
 </main>
 
 </div>
 );
}


// ── TailorDashboard.jsx ──
import { useState, useEffect} from"react";
import { useNavigate} from"react-router-dom";
import { collection, query, where, getDocs} from"firebase/firestore";
import { db} from"../../firebase/firebase";
import { useAuth} from"../../context/AuthContext";

// Dummy data (replace with real data / Firestore later)
const DUMMY_USER = {
 name:"Dfgyh",
 role:"Master Tailor",
 newRequests: 2,
};



const DUMMY_STATS = [
 {
 id: 1,
 label:"Active Orders",
 value: 4,
 color:"",
 bg:"",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 <path d="m3.3 7 8.7 5 8.7-5" />
 <path d="M12 22V12" />
 </svg>
 ),
},
 {
 id: 2,
 label:"In Progress",
 value: 2,
 color:"text-violet-500",
 bg:"bg-violet-50",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
 <line x1="20" x2="8.12" y1="4" y2="15.88" />
 <line x1="14.47" x2="20" y1="14.48" y2="20" />
 <line x1="8.12" x2="12" y1="8.12" y2="12" />
 </svg>
 ),
},
 {
 id: 3,
 label:"Ready to Deliver",
 value: 1,
 color:"text-orange-500",
 bg:"bg-orange-50",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" />
 <line x1="23" x2="23" y1="13" y2="11" />
 <polyline points="11 6 7 12 13 12 9 18" />
 </svg>
 ),
},
 {
 id: 4,
 label:"Completed",
 value: 1,
 color:"text-emerald-500",
 bg:"bg-emerald-50",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
 <polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 ),
},
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat}) {
 return (
 <div className="rounded-2xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
 {/* Icon */}
 <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
 {stat.icon}
 </div>
 {/* Number */}
 <p className="text-4xl font-extrabold leading-none">{stat.value}</p>
 {/* Label */}
 <p className="text-sm font-medium">{stat.label}</p>
 </div>
 );
}

const DUMMY_EARNINGS = {
 total:"LKR 18,000",
 fromOrders: 1,
 growthPercent: 24,
};

const DUMMY_RATINGS = {
 average: 4.9,
 total: 407,
 breakdown: [
 { stars: 5, count: 312},
 { stars: 4, count: 85},
 { stars: 3, count: 8},
 { stars: 2, count: 2},
 { stars: 1, count: 0},
 ],
};

// ─── Earnings Card ────────────────────────────────────────────────────────────
function EarningsCard({ data}) {
 return (
 <div className="bg-gradient-to-br from-violet-700 via-purple-600 to-indigo-700 rounded-2xl p-6 flex flex-col gap-3 shadow-lg h-full">
 {/* Header */}
 <div className="flex items-center gap-2 text-sm font-medium">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" />
 <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
 <path d="M12 18V6" />
 </svg>
 Total Earnings
 </div>

 {/* Amount */}
 <p className="text-4xl font-extrabold leading-tight tracking-tight">{data.total}</p>

 {/* Sub-label */}
 <p className="text-sm">from {data.fromOrders} completed order{data.fromOrders !== 1 ?"s" :""}</p>

 {/* Growth badge */}
 <div className="mt-auto flex items-center gap-1.5 border rounded-full px-3 py-1 w-fit">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
 <polyline points="16 7 22 7 22 13" />
 </svg>
 <span className="text-green-400 text-sm font-semibold">+{data.growthPercent}% vs last month</span>
 </div>
 </div>
 );
}

// ─── Ratings Card ─────────────────────────────────────────────────────────────
function StarIcon({ filled = true, size = 16}) {
 return (
 <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
 fill={filled ?"#f59e0b" :"none"} stroke="#f59e0b" strokeWidth="1.5"
 strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 );
}

function RatingsCard({ data}) {
 const maxCount = Math.max(...data.breakdown.map((b) => b.count), 1);

 return (
 <div className="rounded-2xl border shadow-sm p-6 flex flex-col gap-4 h-full">
 {/* Title row */}
 <div className="flex items-center justify-between">
 <h2 className="font-bold text-base flex items-center gap-2">
 <span className="text-yellow-400">⭐</span> Ratings &amp; Reviews
 </h2>
 <div className="flex items-center gap-1.5">
 <div className="flex gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= Math.round(data.average)} size={14} />)}
 </div>
 <span className="text-yellow-500 font-bold text-sm">{data.average}</span>
 <span className="text-sm">({data.total} reviews)</span>
 </div>
 </div>

 {/* Breakdown rows */}
 <div className="flex flex-col gap-2">
 {data.breakdown.map((row) => (
 <div key={row.stars} className="flex items-center gap-3">
 <span className="text-sm w-4 text-right">{row.stars}</span>
 <StarIcon filled size={13} />
 <div className="flex-1 h-2 rounded-full overflow-hidden">
 <div
 className="h-full bg-yellow-400 rounded-full transition-all duration-500"
 style={{ width:`${(row.count / maxCount) * 100}%`}}
 />
 </div>
 <span className="text-sm w-6 text-right">{row.count}</span>
 </div>
 ))}
 </div>
 </div>
 );
}

const DUMMY_ORDERS = [
 {
 id: 1,
 name:"Wedding Dress",
 customer:"Shalini Fernando",
 status:"In Progress",
 price:"LKR 28,000",
 iconColor:"",
 iconBg:"",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
 <path d="M3 6h18" />
 <path d="M16 10a4 4 0 0 1-8 0" />
 </svg>
 ),
},
 {
 id: 2,
 name:"Business Suits",
 customer:"Ravi Wijesinghe",
 status:"Ready to Deliver",
 price:"LKR 75,000",
 iconColor:"",
 iconBg:"",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 <path d="m3.3 7 8.7 5 8.7-5" />
 <path d="M12 22V12" />
 </svg>
 ),
},
 {
 id: 3,
 name:"School Uniforms",
 customer:"Chamara Bandara",
 status:"Pending",
 price:"LKR 45,000",
 iconColor:"",
 iconBg:"",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" />
 <polyline points="12 6 12 12 16 14" />
 </svg>
 ),
},
 {
 id: 4,
 name:"Evening Gown",
 customer:"Nadeesha Perera",
 status:"Completed",
 price:"LKR 18,000",
 iconColor:"text-emerald-500",
 iconBg:"bg-emerald-50",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
 <polyline points="22 4 12 14.01 9 11.01" />
 </svg>
 ),
},
 {
 id: 5,
 name:"Casual Shirts",
 customer:"Amal Jayawardena",
 status:"In Progress",
 price:"LKR 12,000",
 iconColor:"text-violet-400",
 iconBg:"bg-violet-50",
 icon: (
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
 <line x1="20" x2="8.12" y1="4" y2="15.88" />
 <line x1="14.47" x2="20" y1="14.48" y2="20" />
 <line x1="8.12" x2="12" y1="8.12" y2="12" />
 </svg>
 ),
},
];

const STATUS_STYLES = {
"In Progress":"bg-orange-100 text-orange-600",
"Ready to Deliver":"",
"Pending":"",
"Completed":"bg-emerald-100 text-emerald-600",
};

// ─── Active & Recent Orders Card ───────────────────────────────────────────────
function ActiveOrdersCard({ orders}) {
 return (
 <div className="rounded-2xl border shadow-sm p-6 flex flex-col gap-4">
 {/* Header */}
 <div className="flex items-center justify-between">
 <h2 className="font-bold text-base flex items-center gap-2">
 <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
 </svg>
 Active &amp; Recent Orders
 </h2>
 <button className="text-violet-600 text-sm font-medium hover:text-violet-800 transition-colors flex items-center gap-1">
 View All
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="m9 18 6-6-6-6" />
 </svg>
 </button>
 </div>

 {/* Order rows */}
 <div className="flex flex-col divide-y divide-gray-50">
 {orders.map((order) => (
 <div key={order.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
 {/* Icon */}
 <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center ${order.iconBg} ${order.iconColor}`}>
 {order.icon}
 </div>
 {/* Name + customer */}
 <div className="flex-1 min-w-0">
 <p className="font-semibold text-sm truncate">{order.name}</p>
 <p className="text-xs truncate">{order.customer}</p>
 </div>
 {/* Status badge */}
 <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLES[order.status]}`}>
 {order.status}
 </span>
 {/* Price */}
 <p className="font-bold text-sm whitespace-nowrap pl-2">{order.price}</p>
 </div>
 ))}
 </div>
 </div>
 );
}

// ─── Order Requests data ────────────────────────────────────────────────────────────
const DUMMY_REQUESTS = [
 {
 id: 1,
 customer:"Dilini Perera",
 badge:"New",
 description:"Bridesmaid Dresses (4)",
 price:"LKR 40,000",
 due:"Due Apr 15",
 status:"new",
},
 {
 id: 2,
 customer:"Colombo Sports Club",
 badge:"New",
 description:"Team Jerseys (25)",
 price:"LKR 62,500",
 due:"Due Apr 1",
 status:"new",
},
 {
 id: 3,
 customer:"Malintha Rajapaksa",
 badge:"Accepted",
 description:"Bespoke Suit",
 price:"LKR 15,000",
 due:"Due Mar 25",
 status:"accepted",
},
];

// ─── Order Requests Card ──────────────────────────────────────────────────────────────
function OrderRequestsCard({ requests}) {
 return (
 <div className="rounded-2xl border shadow-sm p-6 flex flex-col gap-5">
 {/* Header */}
 <div className="flex items-center justify-between">
 <h2 className="font-bold text-base flex items-center gap-2">
 <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
 <circle cx="9" cy="7" r="4" />
 <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
 </svg>
 Order Requests
 </h2>
 <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
 {requests.filter((r) => r.status ==="new").length} new
 </span>
 </div>

 {/* Request list */}
 <div className="flex flex-col gap-5">
 {requests.map((req) => (
 <div key={req.id} className="flex flex-col gap-2">
 {/* Customer name + badge */}
 <div className="flex items-center gap-2">
 <p className="font-semibold text-sm">{req.customer}</p>
 {req.status ==="new" ? (
 <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-500">New</span>
 ) : (
 <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">Accepted</span>
 )}
 </div>

 {/* Description */}
 <p className="text-xs">{req.description}</p>

 {/* Price + due */}
 <div className="flex items-center gap-3">
 <span className="text-emerald-600 font-semibold text-sm">{req.price}</span>
 <span className="text-xs">{req.due}</span>
 </div>

 {/* Action row */}
 <div className="flex items-center gap-2">
 {req.status ==="new" ? (
 <>
 {/* Accept */}
 <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold border border-emerald-200 transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
 <circle cx="12" cy="7" r="4" />
 </svg>
 Accept
 </button>
 {/* Decline */}
 <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover: text-xs font-semibold border transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" />
 <line x1="15" x2="9" y1="9" y2="15" />
 <line x1="9" x2="15" y1="9" y2="15" />
 </svg>
 Decline
 </button>
 </>
 ) : (
 <span className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
 ✓ Accepted
 </span>
 )}
 {/* Chat bubble */}
 <button className="w-8 h-8 flex items-center justify-center rounded-lg border hover: hover: transition-colors flex-shrink-0">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
 </svg>
 </button>
 </div>

 {/* Divider (skip last) */}
 {req.id !== requests[requests.length - 1].id && (
 <div className="border-t mt-1" />
 )}
 </div>
 ))}
 </div>
 </div>
 );
}

// ─── Recent Reviews data ────────────────────────────────────────────────────────────
const DUMMY_REVIEWS = [
 {
 id: 1,
 stars: 5,
 quote:"Absolutely stunning work! The wedding dress was exactly what I envisioned. The attention to detail is incredible.",
 name:"Shalini Fernando",
 daysAgo: 2,
},
 {
 id: 2,
 stars: 5,
 quote:"Professional, punctual and the suits fit perfectly. Would highly recommend to anyone looking for quality tailoring.",
 name:"Ravi Wijesinghe",
 daysAgo: 7,
},
 {
 id: 3,
 stars: 4,
 quote:"Great quality uniforms delivered on time. Minor stitching issue fixed promptly. Overall very satisfied.",
 name:"Chamara Bandara",
 daysAgo: 14,
},
];
function StarRow({ count, size = 14}) {
 return (
 <div className="flex gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => (
 <svg key={s} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
 fill={s <= count ?"#f59e0b" :"none"} stroke="#f59e0b" strokeWidth="1.5"
 strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 ))}
 </div>
 );
}

function ReviewCard({ review}) {
 return (
 <div className="rounded-2xl border shadow-sm p-5 flex flex-col gap-3">
 {/* Stars */}
 <StarRow count={review.stars} />
 {/* Quote */}
 <p className="text-sm italic leading-relaxed flex-1">
 &ldquo;{review.quote}&rdquo;
 </p>
 {/* Reviewer row */}
 <div className="flex items-center justify-between mt-1">
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
 {review.name.charAt(0)}
 </div>
 <span className="font-semibold text-sm">{review.name}</span>
 </div>
 <span className="text-xs">
 {review.daysAgo === 1 ?"1 day ago" :`${review.daysAgo} days ago`}
 </span>
 </div>
 </div>
 );
}

function RecentReviewsSection({ reviews}) {
 return (
 <div className="flex flex-col gap-4">
 <h2 className="font-bold text-base flex items-center gap-2">
 <span className="text-yellow-400">⭐</span> Recent Reviews
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
 </div>
 </div>
 );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TailorDashboard() {
 const { user: authUser} = useAuth();
 const navigate = useNavigate();

 // ── Live stat counts from Firestore ──
 const [statCounts, setStatCounts] = useState({
 active: null,
 inProgress: null,
 readyToDeliver: null,
 completed: null,
});
 const [statsLoading, setStatsLoading] = useState(true);

 useEffect(() => {
 if (!authUser?.uid) return;
 const fetchStats = async () => {
 try {
 const col = collection(db,"jobRequests");
 const q = query(col, where("tailorId","==", authUser.uid));
 const snap = await getDocs(q);

 const counts = { active: 0, inProgress: 0, readyToDeliver: 0, completed: 0};
 snap.forEach((doc) => {
 const status = (doc.data().status ||"").toLowerCase();
 if (status ==="active") counts.active++;
 if (status ==="in progress") counts.inProgress++;
 if (status ==="ready to deliver") counts.readyToDeliver++;
 if (status ==="completed") counts.completed++;
});
 setStatCounts(counts);
} catch (err) {
 console.error("Failed to load job stats:", err);
} finally {
 setStatsLoading(false);
}
};
 fetchStats();
}, [authUser]);

 // Merge live counts into the stat card definitions (fallback to dummy while loading)
 const liveStats = DUMMY_STATS.map((s) => {
 if (statsLoading) return s;
 const countMap = {
"Active Orders": statCounts.active,
"In Progress": statCounts.inProgress,
"Ready to Deliver": statCounts.readyToDeliver,
"Completed": statCounts.completed,
};
 return { ...s, value: countMap[s.label] ?? s.value};
});

 const displayName = authUser?.name || authUser?.email ||"Tailor";
 const avatarLetter = displayName.charAt(0).toUpperCase();

 // The order requests might have'new' status
 const newReqCount = DUMMY_REQUESTS.filter(r => r.status ==="new").length;

 return (
 <div className="min-h-screen font-sans flex flex-col">
 {/* ── Purple Header Bar ── */}
 <div className="px-6 py-5 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
 {avatarLetter}
 </div>
 <div>
 <p className="text-sm">
 Good {new Date().getHours() < 12 ?"morning" : new Date().getHours() < 18 ?"afternoon" :"evening"},
 </p>
 <p className="font-bold text-xl leading-tight">{displayName}</p>
 <div className="flex items-center gap-2 mt-1">
 <span className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">
 Master Tailor
 </span>
 {newReqCount > 0 && (
 <span className="inline-block text-xs bg-orange-400 px-2.5 py-0.5 rounded-full font-bold">
 {newReqCount} new request{newReqCount !== 1 ?"s" :""}
 </span>
 )}
 </div>
 </div>
 </div>
 <button onClick={() => navigate("/tailor-profile")}
 className="flex items-center gap-2 hover: border px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
 </svg>
 My Profile
 </button>
 </div>

 <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">


 {/* ── Stat Cards ── */}
 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {liveStats.map((stat) => (
 <StatCard key={stat.id} stat={{
 ...stat,
 value: statsLoading
 ? <span className="inline-block w-8 h-6 rounded animate-pulse" />
 : stat.value,
}} />
 ))}
 </div>

 {/* ── Earnings + Ratings ── */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <EarningsCard data={DUMMY_EARNINGS} />
 <RatingsCard data={DUMMY_RATINGS} />
 </div>

 {/* ── Quotation Inbox Quick Access ── */}
 <div
 onClick={() => navigate("/quotation-inbox")}
 className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-md p-5 flex items-center justify-between cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all group"
 >
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl border flex items-center justify-center">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 </div>
 <div>
 <h3 className="font-bold text-base">Quote Requests</h3>
 <p className="text-sm">View and respond to customer quote requests</p>
 </div>
 </div>
 <div className="group-hover: transition-colors">
 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
 </svg>
 </div>
 </div>

 {/* ── Orders Row ── */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <OrderRequestsCard requests={DUMMY_REQUESTS} />
 <ActiveOrdersCard orders={DUMMY_ORDERS} />
 </div>

 {/* ── Recent Reviews ── */}
 <RecentReviewsSection reviews={DUMMY_REVIEWS} />
 </main>
 </div>
 );
}

// ── TailorProfile.jsx ──
import { useState, useEffect, useRef} from"react";
import { useParams, useNavigate} from"react-router-dom";
import {
 doc,
 getDoc,
 setDoc,
} from"firebase/firestore";
import {
 ref,
 uploadBytes,
 getDownloadURL,
 deleteObject,
} from"firebase/storage";
import { db, storage} from"../../firebase/firebase";
import { useAuth} from"../../context/AuthContext";

// ─── Default / placeholder tailor data ───────────────────────────────────────
const DEFAULT_TAILOR = {
 uid:"",
 name:"Nimal Perera",
 bio:"I deliver professional tailoring services with attention to detail, quality fabrics, and flawless stitching.",
 profilePhoto:"",
 startingPrice: 2000,
 rating: 4.7,
 services: ["Suits","Dresses","Customize designs"],
 customizationTypes: ["Measurement Base","Design Base"],
 portfolioImages: [],
 reviews: [
 {
 id: 1,
 text:"Absolutely stunning work! The suit fit perfectly and the craftsmanship was impeccable.",
 rating: 5,
 reviewer:"Shalini Fernando",
},
 {
 id: 2,
 text:"Professional and punctual. My wedding dress was delivered exactly as discussed. Highly recommend!",
 rating: 5,
 reviewer:"Ravi Wijesinghe",
},
 {
 id: 3,
 text:"Great quality uniforms delivered on time. Minor issue was fixed promptly. Very satisfied.",
 rating: 4,
 reviewer:"Chamara Bandara",
},
 ],
};

// ─── Star Icon ────────────────────────────────────────────────────────────────
function StarIcon({ filled = true, size = 16}) {
 return (
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width={size}
 height={size}
 viewBox="0 0 24 24"
 fill={filled ?"#f59e0b" :"none"}
 stroke="#f59e0b"
 strokeWidth="1.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 );
}

function StarRow({ count, size = 14}) {
 return (
 <div className="flex gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => (
 <StarIcon key={s} filled={s <= count} size={size} />
 ))}
 </div>
 );
}

// ─── Share Icon ───────────────────────────────────────────────────────────────
function ShareIcon({ size = 16}) {
 return (
 <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
 <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
 <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
 </svg>
 );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className}) {
 return <div className={` animate-pulse rounded-xl ${className}`} />;
}

// ─── Portfolio Gallery ────────────────────────────────────────────────────────
function PortfolioGallery({ images, editMode, onAddImages, onDeleteImage}) {
 const fileRef = useRef();
 const [selectedImage, setSelectedImage] = useState(null);

 return (
 <div className="rounded-2xl border shadow-sm overflow-hidden">
 {/* Header */}
 <div className="flex items-center justify-between px-5 pt-5 pb-3">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-lg flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
 fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
 <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
 </svg>
 </div>
 <span className="font-bold text-sm">Portfolio Gallery</span>
 {images.length > 0 && (
 <span className="text-xs px-2 py-0.5 rounded-full font-medium">
 {images.length} photos
 </span>
 )}
 </div>
 {editMode && (
 <>
 <button
 onClick={() => fileRef.current.click()}
 className="flex items-center gap-1.5 text-xs border rounded-lg px-3 py-1.5 hover: transition-colors font-medium"
 >
 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
 </svg>
 Add Photos
 </button>
 <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
 onChange={(e) => onAddImages(Array.from(e.target.files))} />
 </>
 )}
 </div>

 {/* Scrollable row */}
 <div className="flex gap-3 overflow-x-auto px-5 pb-5 pt-1"
 style={{ scrollbarWidth:"none"}}>
 {images.length === 0 ? (
 <div className="w-full flex flex-col items-center justify-center py-10 gap-2">
 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
 fill="none" stroke="#d8b4fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
 <circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
 </svg>
 <p className="text-sm">No portfolio photos yet</p>
 </div>
 ) : (
 images.map((img, idx) => (
 <div key={idx} className="relative flex-shrink-0 group cursor-pointer" onClick={() => setSelectedImage(img)}>
 <img src={img} alt={`Portfolio ${idx + 1}`}
 className="w-40 h-40 object-cover rounded-xl shadow-sm border group-hover:shadow-md transition-shadow duration-200" />
 {editMode && (
 <button onClick={(e) => { e.stopPropagation(); onDeleteImage(idx, img);}}
 className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs hover: shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
 ✕
 </button>
 )}
 {/* Hover overlay */}
 <div className="absolute inset-0 rounded-xl group-hover: transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
 <circle cx="11" cy="11" r="8"></circle>
 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
 <line x1="11" y1="8" x2="11" y2="14"></line>
 <line x1="8" y1="11" x2="14" y2="11"></line>
 </svg>
 </div>
 </div>
 ))
 )}
 </div>

 {/* Lightbox Modal */}
 {selectedImage && (
 <div 
 className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 transition-opacity" 
 onClick={() => setSelectedImage(null)}
 >
 <button 
 className="absolute top-6 right-6 hover: hover: rounded-full p-2 transition-all"
 onClick={(e) => { e.stopPropagation(); setSelectedImage(null);}}
 >
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="18" y1="6" x2="6" y2="18"></line>
 <line x1="6" y1="6" x2="18" y2="18"></line>
 </svg>
 </button>
 <img 
 src={selectedImage} 
 alt="Expanded portfolio" 
 className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain" 
 onClick={(e) => e.stopPropagation()} 
 />
 </div>
 )}
 </div>
 );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review}) {
 return (
 <div className="border rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md hover: transition-all duration-200">
 <StarRow count={review.rating} size={14} />
 <p className="text-sm leading-relaxed font-medium flex-1">
 &ldquo;{review.text}&rdquo;
 </p>
 <div className="flex items-center gap-2.5 pt-1 border-t">
 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
 {review.reviewer?.charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="font-semibold text-sm">{review.reviewer}</p>
 <div className="flex items-center gap-1">
 <StarIcon size={10} filled />
 <span className="text-yellow-500 text-xs font-bold">{review.rating}.0</span>
 </div>
 </div>
 </div>
 </div>
 );
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────
function Tag({ label, onRemove, editMode}) {
 return (
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border">
 {label}
 {editMode && onRemove && (
 <button onClick={onRemove}
 className="w-3.5 h-3.5 rounded-full hover: hover: flex items-center justify-center transition-colors text-[9px] font-bold">
 ✕
 </button>
 )}
 </span>
 );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TailorProfile() {
 const { tailorId} = useParams();
 const navigate = useNavigate();
 const { user: authUser} = useAuth();

 // ── State ──
 const [tailor, setTailor] = useState(null);
 const [loading, setLoading] = useState(true);
 const [editMode, setEditMode] = useState(false);
 const [saving, setSaving] = useState(false);

 // Draft state
 const [draftBio, setDraftBio] = useState("");
 const [draftPrice, setDraftPrice] = useState(0);
 const [draftServices, setDraftServices] = useState([]);
 const [draftCustomTypes, setDraftCustomTypes] = useState([]);
 const [draftPortfolioImages, setDraftPortfolioImages] = useState([]);
 const [draftProfilePhoto, setDraftProfilePhoto] = useState("");
 const [newServiceInput, setNewServiceInput] = useState("");
 const [newCustomTypeInput, setNewCustomTypeInput] = useState("");
 const [uploadingPhoto, setUploadingPhoto] = useState(false);
 const [isSaved, setIsSaved] = useState(false); // Bookmarked state

 const profilePhotoRef = useRef();

 const resolvedTailorId = tailorId || authUser?.uid;
 const isOwner = authUser?.uid && authUser.uid === resolvedTailorId;

 // ── Load tailor data ──
 useEffect(() => {
 if (!resolvedTailorId) {
 setTailor(DEFAULT_TAILOR);
 setLoading(false);
 return;
}
 const fetchTailor = async () => {
 setLoading(true);
 try {
 const snap = await getDoc(doc(db,"tailors", resolvedTailorId));
 if (snap.exists()) {
 setTailor({ uid: resolvedTailorId, ...snap.data()});
} else {
 setTailor({ ...DEFAULT_TAILOR, uid: resolvedTailorId});
}
} catch {
 setTailor({ ...DEFAULT_TAILOR, uid: resolvedTailorId});
} finally {
 setLoading(false);
}
};
 fetchTailor();
}, [resolvedTailorId]);

 const enterEditMode = () => {
 setDraftBio(tailor.bio ||"");
 setDraftPrice(tailor.startingPrice || 0);
 setDraftServices([...(tailor.services || [])]);
 setDraftCustomTypes([...(tailor.customizationTypes || [])]);
 setDraftPortfolioImages([...(tailor.portfolioImages || [])]);
 setDraftProfilePhoto(tailor.profilePhoto ||"");
 setEditMode(true);
};

 const cancelEdit = () => setEditMode(false);

 const handleProfilePhotoChange = async (e) => {
 const file = e.target.files[0];
 if (!file) return;
 setUploadingPhoto(true);
 try {
 const storageRef = ref(storage,`tailors/${resolvedTailorId}/profilePhoto`);
 await uploadBytes(storageRef, file);
 const url = await getDownloadURL(storageRef);
 setDraftProfilePhoto(url);
} catch (err) {
 console.error("Photo upload failed:", err);
} finally {
 setUploadingPhoto(false);
}
};

 const handleAddPortfolioImages = async (files) => {
 for (const file of files) {
 try {
 const storageRef = ref(storage,`tailors/${resolvedTailorId}/portfolio/${Date.now()}_${file.name}`);
 await uploadBytes(storageRef, file);
 const url = await getDownloadURL(storageRef);
 setDraftPortfolioImages((prev) => [...prev, url]);
} catch (err) {
 console.error("Portfolio upload failed:", err);
}
}
};

 const handleDeletePortfolioImage = async (idx, url) => {
 try { await deleteObject(ref(storage, url));} catch { /* ignore if already deleted */}
 setDraftPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
};

 const handleSave = async () => {
 setSaving(true);
 try {
 const updatedData = {
 uid: resolvedTailorId,
 name: tailor.name,
 bio: draftBio,
 profilePhoto: draftProfilePhoto,
 startingPrice: Number(draftPrice),
 services: draftServices,
 customizationTypes: draftCustomTypes,
 portfolioImages: draftPortfolioImages,
 rating: tailor.rating,
 reviews: tailor.reviews || [],
};
 await setDoc(doc(db,"tailors", resolvedTailorId), updatedData, { merge: true});
 setTailor((prev) => ({ ...prev, ...updatedData}));
 setEditMode(false);
} catch (err) {
 console.error("Save failed:", err);
} finally {
 setSaving(false);
}
};

 const handleShare = () => {
 const url = window.location.href;
 if (navigator.share) {
 navigator.share({ title:`${tailor?.name} – Tailor Profile`, url});
} else {
 navigator.clipboard.writeText(url);
 alert("Profile link copied to clipboard!");
}
};

 // ─── Loading skeleton ──────────────────────────────────────────────────────
 if (loading) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-10 px-4">
 <div className="max-w-5xl mx-auto space-y-6">
 <Skeleton className="h-52 w-full" />
 <div className="flex flex-col lg:flex-row gap-6">
 <div className="flex-1 space-y-4">
 <Skeleton className="h-40 w-full" />
 <Skeleton className="h-52 w-full" />
 </div>
 <div className="w-full lg:w-72 flex-shrink-0">
 <Skeleton className="h-80 w-full" />
 </div>
 </div>
 </div>
 </div>
 );
}

 const displayPortfolioImages = editMode ? draftPortfolioImages : tailor.portfolioImages || [];
 const displayServices = editMode ? draftServices : tailor.services || [];
 const displayCustomTypes = editMode ? draftCustomTypes : tailor.customizationTypes || [];
 const displayBio = editMode ? draftBio : tailor.bio;
 const displayPrice = editMode ? draftPrice : tailor.startingPrice;
 const displayProfilePhoto = editMode ? draftProfilePhoto : tailor.profilePhoto;
 const reviews = tailor.reviews || DEFAULT_TAILOR.reviews;

 return (
 <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">

 {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
 <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 relative overflow-hidden">
 {/* Decorative elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full" />
 <div className="absolute top-4 right-32 w-32 h-32 rounded-full" />
 <div className="absolute -bottom-6 left-10 w-48 h-48 rounded-full" />
 </div>

 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
 {/* Edit / Save / Cancel buttons */}
 <div className="flex justify-end mb-6 gap-2">
 {isOwner && !editMode && (
 <button onClick={enterEditMode}
 className="flex items-center gap-2 px-4 py-2 rounded-xl hover: border text-sm font-semibold transition-all duration-200 backdrop-blur-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
 </svg>
 Edit Profile
 </button>
 )}
 {editMode && (
 <>
 <button onClick={cancelEdit}
 className="px-4 py-2 rounded-xl hover: border text-sm font-medium transition-all duration-200">
 Cancel
 </button>
 <button onClick={handleSave} disabled={saving}
 className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-sm font-semibold transition-colors shadow-lg">
 {saving ? (
 <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 12a9 9 0 1 1-6.219-8.56" />
 </svg>
 ) : (
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 )}
 {saving ?"Saving…" :"Save Changes"}
 </button>
 </>
 )}
 </div>

 {/* Profile identity row */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
 {/* Avatar */}
 <div className="relative flex-shrink-0">
 {displayProfilePhoto ? (
 <img src={displayProfilePhoto} alt={tailor.name}
 className="w-24 h-24 rounded-2xl object-cover border-4 shadow-xl" />
 ) : (
 <div className="w-24 h-24 rounded-2xl border-4 shadow-xl flex items-center justify-center text-4xl font-extrabold backdrop-blur-sm">
 {tailor.name?.charAt(0).toUpperCase()}
 </div>
 )}
 {/* Verified badge */}
 <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-400 rounded-full border-2 flex items-center justify-center shadow-md">
 <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24"
 fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 </div>
 {editMode && (
 <>
 <button onClick={() => profilePhotoRef.current.click()} disabled={uploadingPhoto}
 className="absolute inset-0 w-24 h-24 rounded-2xl flex items-center justify-center text-xs font-semibold hover: transition-colors">
 {uploadingPhoto ?"Uploading…" :"Change"}
 </button>
 <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden"
 onChange={handleProfilePhotoChange} />
 </>
 )}
 </div>

 {/* Name, role, rating */}
 <div className="flex-1 min-w-0">
 <div className="flex flex-wrap items-center gap-2 mb-1">
 <h1 className="text-3xl font-extrabold leading-tight">
 {tailor.name}
 </h1>
 <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm">
 ✦ Master Tailor
 </span>
 </div>

 <div className="flex flex-wrap items-center gap-4 mt-2">
 {/* Rating */}
 <div className="flex items-center gap-1.5 rounded-full px-3 py-1 border">
 <StarIcon size={14} filled />
 <span className="text-yellow-300 font-bold text-sm">{tailor.rating?.toFixed(1)}</span>
 <span className="text-xs">/ 5.0</span>
 </div>
 {/* Reviews count */}
 <div className="flex items-center gap-1.5 text-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
 </svg>
 <span>{reviews.length} reviews</span>
 </div>
 {/* Location placeholder */}
 <div className="flex items-center gap-1.5 text-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
 <span>Sri Lanka</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* ── Page body ─────────────────────────────────────────────────────────── */}
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {/* Back Button */}
 <button 
 onClick={() => navigate('/tailors')}
 className="flex items-center gap-2 hover: font-medium text-sm mb-6 transition-colors"
 >
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="15 18 9 12 15 6"></polyline>
 </svg>
 Back to Tailors
 </button>

 <div className="flex flex-col lg:flex-row gap-6">

 {/* ══════════════════════════════════════════════════════════
 LEFT COLUMN
 ══════════════════════════════════════════════════════════ */}
 <div className="flex-1 flex flex-col gap-6 min-w-0">

 {/* ── Bio card ── */}
 <div className="rounded-2xl border shadow-sm p-6">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-7 h-7 rounded-lg flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
 <circle cx="12" cy="7" r="4" />
 </svg>
 </div>
 <h2 className="font-bold text-sm">About Me</h2>
 </div>
 {editMode ? (
 <textarea
 className="w-full text-base leading-relaxed resize-none border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
 rows={4}
 value={draftBio}
 onChange={(e) => setDraftBio(e.target.value)}
 placeholder="Write your bio or tagline…"
 />
 ) : (
 <p className="text-base leading-relaxed">{displayBio}</p>
 )}
 </div>

 {/* ── Portfolio gallery ── */}
 <PortfolioGallery
 images={displayPortfolioImages}
 editMode={editMode}
 onAddImages={handleAddPortfolioImages}
 onDeleteImage={handleDeletePortfolioImage}
 />

 {/* ── Reviews section ── */}
 <div>
 <div className="flex items-center gap-2 mb-4">
 <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24"
 fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
 </svg>
 </div>
 <h2 className="font-bold text-sm">Customer Reviews</h2>
 <div className="flex items-center gap-1.5 ml-1 px-2.5 py-0.5 rounded-full bg-yellow-50 border border-yellow-100">
 <StarIcon size={10} filled />
 <span className="text-yellow-600 font-bold text-xs">{tailor.rating?.toFixed(1)}</span>
 <span className="text-yellow-500 text-xs">· {reviews.length} reviews</span>
 </div>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {reviews.map((review, idx) => (
 <ReviewCard key={review.id ?? idx} review={review} />
 ))}
 </div>
 </div>
 </div>

 {/* ══════════════════════════════════════════════════════════
 RIGHT COLUMN — Pricing card
 ══════════════════════════════════════════════════════════ */}
 <div className="w-full lg:w-72 flex-shrink-0">
 <div className="rounded-2xl border shadow-sm overflow-hidden sticky top-24">

 {/* Top purple accent band */}
 <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

 <div className="p-6 flex flex-col gap-5">
 {/* Starting price */}
 <div className="pb-4 border-b">
 <p className="text-xs font-medium uppercase tracking-wider mb-1">Starting Price</p>
 {editMode ? (
 <input
 type="number"
 value={draftPrice}
 onChange={(e) => setDraftPrice(e.target.value)}
 className="border rounded-xl px-3 py-2 font-extrabold text-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
 />
 ) : (
 <p className="font-extrabold text-2xl">
 LKR {Number(displayPrice).toLocaleString()}
 </p>
 )}
 </div>

 {/* Services */}
 <div>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-5 h-5 rounded-md flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
 fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 </div>
 <p className="font-bold text-sm">Services</p>
 </div>
 <div className="flex flex-wrap gap-2">
 {displayServices.map((s, i) => (
 <Tag key={i} label={s} editMode={editMode}
 onRemove={() => setDraftServices((prev) => prev.filter((_, idx) => idx !== i))} />
 ))}
 </div>
 {editMode && (
 <div className="flex gap-2 mt-2">
 <input type="text" value={newServiceInput}
 onChange={(e) => setNewServiceInput(e.target.value)}
 placeholder="Add service…"
 className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
 onKeyDown={(e) => {
 if (e.key ==="Enter" && newServiceInput.trim()) {
 setDraftServices((prev) => [...prev, newServiceInput.trim()]);
 setNewServiceInput("");
}
}} />
 <button onClick={() => {
 if (newServiceInput.trim()) {
 setDraftServices((prev) => [...prev, newServiceInput.trim()]);
 setNewServiceInput("");
}
}}
 className="px-3 py-1.5 rounded-lg hover: text-sm font-bold transition-colors">
 +
 </button>
 </div>
 )}
 </div>

 {/* Customization Types */}
 <div>
 <div className="flex items-center gap-2 mb-3">
 <div className="w-5 h-5 rounded-md flex items-center justify-center">
 <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24"
 fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
 <line x1="20" x2="8.12" y1="4" y2="15.88" />
 <line x1="14.47" x2="20" y1="14.48" y2="20" />
 <line x1="8.12" x2="12" y1="8.12" y2="12" />
 </svg>
 </div>
 <p className="font-bold text-sm">Customization Types</p>
 </div>
 <div className="flex flex-wrap gap-2">
 {displayCustomTypes.map((c, i) => (
 <span key={i}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border">
 {c}
 {editMode && (
 <button onClick={() => setDraftCustomTypes((prev) => prev.filter((_, idx) => idx !== i))}
 className="w-3.5 h-3.5 rounded-full hover: hover: flex items-center justify-center transition-colors text-[9px] font-bold">
 ✕
 </button>
 )}
 </span>
 ))}
 </div>
 {editMode && (
 <div className="flex gap-2 mt-2">
 <input type="text" value={newCustomTypeInput}
 onChange={(e) => setNewCustomTypeInput(e.target.value)}
 placeholder="Add type…"
 className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
 onKeyDown={(e) => {
 if (e.key ==="Enter" && newCustomTypeInput.trim()) {
 setDraftCustomTypes((prev) => [...prev, newCustomTypeInput.trim()]);
 setNewCustomTypeInput("");
}
}} />
 <button onClick={() => {
 if (newCustomTypeInput.trim()) {
 setDraftCustomTypes((prev) => [...prev, newCustomTypeInput.trim()]);
 setNewCustomTypeInput("");
}
}}
 className="px-3 py-1.5 rounded-lg hover: text-sm font-bold transition-colors">
 +
 </button>
 </div>
 )}
 </div>

 {/* Divider */}
 <hr className="" />

 {/* CTA Buttons */}
 <div className="flex flex-col gap-2.5">
 {/* Contact Me — primary */}
 <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200">
 Contact Me
 </button>

 {/* Request Quotation + Save Tailor */}
 <div className="flex gap-2">
 <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-semibold hover: hover: transition-colors">
 <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
 Quotation
 </button>
 <button onClick={() => setIsSaved(!isSaved)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-semibold hover: hover: transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" 
 fill={isSaved ?"#ef4444" :"none"} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
 </svg>
 {isSaved ?"Saved" :"Save"}
 </button>
 </div>

 {/* Share Profile */}
 <button onClick={handleShare}
 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium hover: hover: transition-colors">
 <ShareIcon size={14} />
 Share Profile
 </button>
 </div>

 {/* Trust badge */}
 <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
 <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"
 fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
 </svg>
 <p className="text-emerald-700 text-xs font-medium">Verified ClothStreet Tailor</p>
 </div>
 </div>
 </div>
 </div>

 </div>
 </div>
 </div>
 );
}


// ── DesignerCard.jsx ──
import { useState} from'react';
import { Link} from'react-router-dom';

export default function DesignerCard({ designer}) {
 const [showContactModal, setShowContactModal] = useState(false);
 const [showPortfolioModal, setShowPortfolioModal] = useState(false);

 // Color mapping for specialty pills
 const specialtyColors = {
'Bridal Couture':'',
'Evening Wear':'bg-violet-50 text-violet-700 border-violet-100',
'Traditional Wear':'bg-amber-50 text-amber-700 border-amber-100',
'Handloom Designs':'bg-emerald-50 text-emerald-700 border-emerald-100',
'Streetwear':'bg-orange-50 text-orange-700 border-orange-100',
'Urban Fashion':'',
'Resort Wear':'bg-cyan-50 text-cyan-700 border-cyan-100',
'Swimwear':'bg-teal-50 text-teal-700 border-teal-100',
'Corporate Wear':'',
'Uniforms':'',
'Kids Wear':'bg-rose-50 text-rose-700 border-rose-100',
'Playful Prints':'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
};

 return (
 <>
 <div className="rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-100 transition-all duration-300 group flex flex-col">

 {/* ── Image Section ── */}
 <div className="relative h-52 overflow-hidden">
 <img
 src={designer.image}
 alt={designer.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 />

 {/* Rating badge — top right */}
 <div className="absolute top-3 right-3 backdrop-blur-md shadow-sm px-2.5 py-1 rounded-lg flex items-center gap-1">
 <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
 </svg>
 <span className="text-xs font-bold">{designer.rating}</span>
 </div>

 {/* Availability + works badges — bottom */}
 <div className="absolute inset-x-0 bottom-0 p-3 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent">
 <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
 designer.status ==='Available'
 ?'bg-emerald-500/90'
 :''
}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${
 designer.status ==='Available' ?'' :''
}`} />
 {designer.status}
 </div>
 <div className="backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
 +4 works
 </div>
 </div>
 </div>

 {/* ── Card Body ── */}
 <div className="p-6 flex flex-col flex-grow">
 {/* Name & Location */}
 <div className="mb-3">
 <h3 className="text-xl font-bold mb-1">{designer.name}</h3>
 <div className="flex items-center text-sm">
 <svg className="w-4 h-4 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
 specialtyColors[spec] ||'bg-violet-50 text-violet-700 border-violet-100'
}`}>
 {spec}
 </span>
 ))}
 </div>

 {/* Styles */}
 <div className="mb-3">
 <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5">Styles</p>
 <div className="flex flex-wrap gap-1.5">
 {designer.styles.map((style, idx) => (
 <span key={idx} className="px-2.5 py-1 text-[11px] font-medium rounded-full">
 {style}
 </span>
 ))}
 </div>
 </div>

 {/* Tools */}
 <div className="mb-4">
 <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5">Tools</p>
 <div className="flex flex-wrap gap-1.5">
 {designer.tools.map((tool, idx) => (
 <span key={idx} className="px-2.5 py-1 text-[11px] font-medium rounded-full border">
 {tool}
 </span>
 ))}
 </div>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 gap-3 mb-4">
 <div className="p-3 rounded-xl border">
 <div className="mb-1">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
 </svg>
 </div>
 <div className="text-sm font-bold">{designer.projects}</div>
 <div className="text-[10px] uppercase tracking-wider font-medium mt-0.5">Projects</div>
 </div>
 <div className="p-3 rounded-xl border">
 <div className="mb-1">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
 </svg>
 </div>
 <div className="text-sm font-bold">{designer.experience}</div>
 <div className="text-[10px] uppercase tracking-wider font-medium mt-0.5">Experience</div>
 </div>
 </div>

 {/* Price Range & Actions */}
 <div className="pt-4 border-t mt-auto">
 <div className="flex items-center justify-between mb-4">
 <span className="text-xs font-medium">Price Range</span>
 <span className="text-sm font-bold">{designer.priceRange}</span>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <Link
 to={`/designer/${designer.id}`}
 className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-rose-200 flex items-center justify-center gap-1.5"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 View Portfolio
 </Link>
 <button
 onClick={() => setShowContactModal(true)}
 className="w-full py-2.5 px-3 border hover: hover: text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
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

 {/* ────────── CONTACT MODAL ────────── */}
 {showContactModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowContactModal(false)}>
 <div className="absolute inset-0 backdrop-blur-sm" />
 <div
 className="relative rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Close button */}
 <button
 onClick={() => setShowContactModal(false)}
 className="absolute top-4 right-4 w-8 h-8 hover: rounded-full flex items-center justify-center transition-colors"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
 <h3 className="font-bold">{designer.name}</h3>
 <p className="text-sm">{designer.location}</p>
 </div>
 </div>

 <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Get in touch</h4>

 {/* Contact options */}
 <div className="space-y-3">
 {/* Email */}
 {designer.email && (
 <a
 href={`mailto:${designer.email}`}
 className="flex items-center gap-3 p-3 hover:bg-violet-50 border hover:border-violet-200 rounded-xl transition-all duration-200 group/link"
 >
 <div className="w-10 h-10 bg-violet-100 group-hover/link:bg-violet-200 rounded-lg flex items-center justify-center transition-colors">
 <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
 </svg>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold">Send Email</p>
 <p className="text-xs truncate">{designer.email}</p>
 </div>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </a>
 )}

 {/* Phone */}
 {designer.phone && (
 <a
 href={`tel:${designer.phone}`}
 className="flex items-center gap-3 p-3 hover: border hover: rounded-xl transition-all duration-200 group/link"
 >
 <div className="w-10 h-10 group-hover/link: rounded-lg flex items-center justify-center transition-colors">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
 </svg>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold">Call Now</p>
 <p className="text-xs truncate">{designer.phone}</p>
 </div>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </a>
 )}

 {/* WhatsApp */}
 {designer.whatsapp && (
 <a
 href={`https://wa.me/${designer.whatsapp.replace('+','')}?text=Hi ${encodeURIComponent(designer.name)}, I found your profile on ClothStreet and I'd like to discuss a project.`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-3 p-3 hover:bg-emerald-50 border hover:border-emerald-200 rounded-xl transition-all duration-200 group/link"
 >
 <div className="w-10 h-10 bg-emerald-100 group-hover/link:bg-emerald-200 rounded-lg flex items-center justify-center transition-colors">
 <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
 </svg>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold">WhatsApp</p>
 <p className="text-xs truncate">Chat on WhatsApp</p>
 </div>
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
 <div className="absolute inset-0 backdrop-blur-sm" />
 <div
 className="relative rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Close button */}
 <button
 onClick={() => setShowPortfolioModal(false)}
 className="absolute top-4 right-4 z-10 w-8 h-8 hover: backdrop-blur-md rounded-full flex items-center justify-center transition-colors shadow-sm"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>

 {/* Hero Image */}
 <div className="relative h-56">
 <img
 src={designer.image}
 alt={designer.name}
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
 <div className="absolute bottom-4 left-6">
 <h3 className="text-2xl font-bold mb-1">{designer.name}</h3>
 <div className="flex items-center gap-2">
 <div className="flex items-center gap-1 backdrop-blur-md text-xs font-medium px-2 py-1 rounded-full">
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 {designer.location}
 </div>
 <div className="flex items-center gap-1 backdrop-blur-md text-xs font-medium px-2 py-1 rounded-full">
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
 designer.status ==='Available'
 ?'bg-emerald-50 text-emerald-700 border border-emerald-200'
 :' border'
}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${
 designer.status ==='Available' ?'bg-emerald-500' :''
}`} />
 {designer.status}
 </div>
 <div className="flex items-center gap-4 text-sm">
 <span><b className="">{designer.projects}</b> projects</span>
 <span><b className="">{designer.experience}</b> exp</span>
 </div>
 </div>

 {/* Specialties */}
 <div className="mb-4">
 <p className="text-[11px] font-semibold uppercase tracking-wider mb-2">Specialties</p>
 <div className="flex flex-wrap gap-2">
 {designer.specialties.map((spec, idx) => (
 <span key={idx} className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
 specialtyColors[spec] ||'bg-violet-50 text-violet-700 border-violet-100'
}`}>
 {spec}
 </span>
 ))}
 </div>
 </div>

 {/* Styles */}
 <div className="mb-4">
 <p className="text-[11px] font-semibold uppercase tracking-wider mb-2">Design Styles</p>
 <div className="flex flex-wrap gap-1.5">
 {designer.styles.map((style, idx) => (
 <span key={idx} className="px-2.5 py-1 text-[11px] font-medium rounded-full">
 {style}
 </span>
 ))}
 </div>
 </div>

 {/* Tools */}
 <div className="mb-5">
 <p className="text-[11px] font-semibold uppercase tracking-wider mb-2">Tools & Software</p>
 <div className="flex flex-wrap gap-1.5">
 {designer.tools.map((tool, idx) => (
 <span key={idx} className="px-2.5 py-1 text-[11px] font-medium rounded-full border">
 {tool}
 </span>
 ))}
 </div>
 </div>

 {/* Price & Contact CTA */}
 <div className="pt-4 border-t">
 <div className="flex items-center justify-between mb-4">
 <span className="text-sm">Price Range</span>
 <span className="text-sm font-bold">{designer.priceRange}</span>
 </div>
 <button
 onClick={() => {
 setShowPortfolioModal(false);
 setShowContactModal(true);
}}
 className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-rose-200 flex items-center justify-center gap-2"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
 </svg>
 Contact {designer.name.split('')[0]}
 </button>
 </div>
 </div>
 </div>
 </div>
 )}
 </>
 );
}


// ── Footer.jsx ──
import { Link, useNavigate} from"react-router-dom";
import { useAuth} from"../../context/AuthContext";
import toast from"react-hot-toast";

export default function Footer() {
 const { user} = useAuth();
 const navigate = useNavigate();

 const handleListFabrics = (e) => {
 e.preventDefault();
 if (!user) {
 navigate('/login');
 return;
}
 if (user.role ==='seller') {
 navigate('/inventory');
} else {
 toast.error('Only suppliers can list fabrics.');
}
};

 return (
 <footer className="bg-[#0B0F19] py-16 border-t">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

 {/* Brand Column */}
 <div className="space-y-6">
 <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3">
 <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" />
 </svg>
 </div>
 <span className="text-2xl font-bold tracking-tight">ClothStreet</span>
 </Link>
 <p className="text-sm leading-relaxed max-w-xs">
 Sri Lanka's unified textile ecosystem — connecting fabric suppliers, skilled tailors, and customers in one seamless platform.
 </p>
 <div className="flex items-center gap-4 pt-2">
 <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg hover: hover: transition-colors duration-300">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
 <span className="sr-only">Facebook</span>
 </a>
 <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg hover: hover: transition-colors duration-300">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 5 9.2 5 9.2s1.5.8 3 0C8 2.2 2 4 2 4s1.5 1.5 3 2c-1.3-1.3-2-3-2-3s2-.7 4 0c2.5-3.5 7.5-3 10 1s2.5 0 2.5 0" /></svg>
 <span className="sr-only">Twitter</span>
 </a>
 <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg hover: hover: transition-colors duration-300">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
 <span className="sr-only">Instagram</span>
 </a>
 <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg hover: hover: transition-colors duration-300">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
 <span className="sr-only">LinkedIn</span>
 </a>
 </div>
 </div>

 {/* Platform Links */}
 <div className="space-y-6 lg:ml-8">
 <h3 className="font-semibold tracking-wide">Platform</h3>
 <ul className="space-y-4">
 <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">About Us</Link></li>
 <li><Link to="/shop" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Fabric Marketplace</Link></li>
 <li><Link to="/tailors" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Find Tailors</Link></li>
 <li>
 <Link to="/designers" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">
 Find Designers
 </Link>
 </li>
 <li><Link to="/match" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">AI Recommendations</Link></li>
 <li><Link to="/tracking" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Order Tracking</Link></li>
 <li><Link to="/register" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Join as Supplier</Link></li>
 </ul>
 </div>

 {/* Business Links */}
 <div className="space-y-6">
 <h3 className="font-semibold tracking-wide">For Business</h3>
 <ul className="space-y-4">
 <li><a href="#" onClick={handleListFabrics} className="text-sm hover: transition-colors">List Your Fabrics</a></li>
 <li><Link to="/register" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Join as Tailor</Link></li>
 <li><Link to="/register" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Join as Designer</Link></li>

 <li><Link to="/business/enterprise" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Enterprise Solutions</Link></li>
 </ul>
 </div>

 {/* Contact Information */}
 <div className="space-y-6">
 <h3 className="font-semibold tracking-wide">Contact Us</h3>
 <ul className="space-y-5">
 <li className="flex items-start gap-4">
 <svg className="w-5 h-5 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
 <span className="text-sm leading-relaxed">No. 42, Pettah Market Complex, Colombo 11, Sri Lanka</span>
 </li>
 <li className="flex items-center gap-4">
 <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
 <span className="text-sm">+94 11 234 5678</span>
 </li>
 <li className="flex items-center gap-4">
 <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
 <a href="mailto:hello@clothstreet.lk" className="text-sm hover: transition-colors">hello@clothstreet.lk</a>
 </li>
 </ul>
 </div>

 </div>

 {/* Bottom Bar */}
 <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
 <p className="text-sm">
 © 2026 ClothStreet. All rights reserved.
 </p>
 <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
 <Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Privacy Policy</Link>
 <Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Terms of Service</Link>
 <Link to="/cookies" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Cookie Policy</Link>
 </div>
 </div>
 </div>
 </footer>
 );
}


// ── Navbar.jsx ──
import { useState, useEffect, useRef} from"react";
import { Link} from"react-router-dom";
import { useAuth} from"../../context/AuthContext";
import { useCart} from"../../context/CartContext";

export default function Navbar() {
 const { user, logout} = useAuth();
 const { cartProductCount} = useCart();
 const [isProfileOpen, setIsProfileOpen] = useState(false);
 const profileRef = useRef(null);

 // Close dropdown when clicking outside
 useEffect(() => {
 function handleClickOutside(e) {
 if (profileRef.current && !profileRef.current.contains(e.target)) {
 setIsProfileOpen(false);
}
}
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

 // Default Links for Unauthenticated Users
 const unauthLinks = (
 <>
 <Link to="/" className="px-4 py-2.5 rounded-md font-medium text-sm transition-colors">
 Home
 </Link>
 <Link to="/shop" className="flex items-center gap-2 px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
 </svg>
 Shop
 </Link>
 </>
 );

 const customerLinks = (
 <>
 <Link to="/shop" className="px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 Shop
 </Link>
 <Link to="/tailors" className="px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 Tailors
 </Link>
 <Link to="/designers" className="px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 Designers
 </Link>
 <Link to="/match" className="px-4 py-2.5 rounded-md hover: font-medium text-sm transition-colors">
 AI Match
 </Link>
 </>
 );

 const businessLinks = (
 <>
 <Link to={user?.role ==="tailor" ?"/tailor-dashboard" : user?.role ==="designer" ?"/designer-dashboard" :"/dashboard"} className="px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 Dashboard
 </Link>
 <Link to="/quotation-inbox" className="px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 Quotations
 </Link>
 <Link to="/shop" className="px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 Shop
 </Link>
 <Link to="/tailors" className="px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 Tailors
 </Link>
 <Link to="/designers" className="px-4 py-2.5 rounded-md hover: hover: font-medium text-sm transition-colors">
 Designers
 </Link>
 <Link to="/match" className="px-4 py-2.5 rounded-md hover: font-medium text-sm transition-colors">
 AI Match
 </Link>
 </>
 );

 const handleLogout = async () => {
 try {
 await logout();
} catch (error) {
 console.error("Failed to log out", error);
}
};

 return (
 <nav className="border-b relative z-50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between items-center h-16">
 {/* Logo Section */}
 <div className="flex items-center">
 <Link to="/" className="flex items-center gap-2">
 <div className="flex items-center justify-center w-8 h-8 rounded-md shadow-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" />
 </svg>
 </div>
 <span className="text-xl font-bold tracking-tight">ClothStreet</span>
 </Link>
 </div>

 {/* Center Links */}
 <div className="hidden md:flex items-center space-x-2">
 {!user && unauthLinks}
 {user?.role ==="customer" && customerLinks}
 {(user?.role ==="seller" || user?.role ==="tailor" || user?.role ==="designer") && businessLinks}
 </div>

 {/* Right Section */}
 <div className="flex items-center space-x-5">
 <Link to="/cart" className="relative p-2 rounded-xl border hover: transition-colors shadow-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
 </svg>
 {cartProductCount > 0 && (
 <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold leading-none shadow-sm">
 {cartProductCount > 99 ?"99+" : cartProductCount}
 </span>
 )}
 </Link>

 {!user ? (
 <div className="flex items-center space-x-4 ml-2">
 <Link to="/login" className="text-sm font-medium hover: transition-colors">
 Login
 </Link>
 <Link to="/register" className="px-5 py-2.5 rounded-md text-sm font-medium hover: transition-colors shadow-sm">
 Signup
 </Link>
 </div>
 ) : (
 <div className="relative ml-2" ref={profileRef}>
 <button
 onClick={() => setIsProfileOpen(!isProfileOpen)}
 className="flex items-center justify-center w-10 h-10 rounded-full font-bold border-2 border-transparent hover: transition-all focus:outline-none"
 >
 {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() ||'U'}
 </button>

 {isProfileOpen && (
 <div className="absolute right-0 mt-3 w-48 rounded-xl shadow-lg border py-2 z-50">
 <div className="px-4 py-2 border-b mb-1">
 <p className="text-sm font-medium truncate">{user.name ||'User'}</p>
 <p className="text-xs truncate">{user.email}</p>
 </div>

 {user.role ==="customer" ? (
 <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm hover: hover: transition-colors">
 Profile
 </Link>
 ) : (
 <Link
 to={user?.role ==="tailor" ?"/tailor-profile" : user?.role ==="designer" ?"/designer-profile" :"/portfolio"}
 onClick={() => setIsProfileOpen(false)}
 className="block px-4 py-2 text-sm hover: hover: transition-colors"
 >
 Portfolio
 </Link>
 )}

 {user.role ==="seller" && (
 <Link to="/inventory" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm hover: hover: transition-colors">
 Inventory
 </Link>
 )}

 <Link to={user?.role ==="designer" ?"/designer-orders" :"/orders"} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover: hover: transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
 <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
 </svg>
 Orders
 </Link>

 {(user.role ==="tailor" || user.role ==="designer") && (
 <Link to="/quotation-inbox" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover: hover: transition-colors">
 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 Quotation Inbox
 </Link>
 )}

 <div className="border-t mt-1 pt-1">
 <button
 onClick={() => { handleLogout(); setIsProfileOpen(false);}}
 className="block w-full text-left px-4 py-2 text-sm hover: transition-colors"
 >
 Logout
 </button>
 </div>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 </div>
 </nav>
 );
}


