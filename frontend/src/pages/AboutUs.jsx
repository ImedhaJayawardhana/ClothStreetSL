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
