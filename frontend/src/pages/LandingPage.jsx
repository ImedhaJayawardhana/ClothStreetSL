import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ShoppingBag, Scissors, PenTool, CheckCircle, MessageSquare, Briefcase, Factory } from 'lucide-react';

import logo from '../assets/logo.png';

// Reusable Premium Button Component
const PremiumButton = ({ onClick, children, outline = false, className = "" }) => {
  if (outline) {
    return (
      <button
        onClick={onClick}
        className={`px-8 py-4 rounded-2xl font-semibold text-lg text-orange-600 bg-white border-2 border-orange-500 shadow-sm hover:bg-orange-50 transition-colors ${className}`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 rounded-2xl font-semibold text-lg text-white bg-orange-500 shadow-md hover:bg-orange-600 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  // PremiumButton is extracted outside the component

  return (
    <div
      className="min-h-screen text-slate-900 font-sans selection:bg-orange-200 selection:text-orange-900"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/woven-light.png')", backgroundColor: "#FAFAFA" }}
    >
      {/* NAVIGATION */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg py-4' : 'bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm py-6'}`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <a href="#" className="flex items-center group w-56 md:w-80 h-12 md:h-16 relative">
            <img src={logo} alt="ClothStreet Logo" className="absolute left-0 top-1/2 -translate-y-1/2 h-32 md:h-44 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
            {['Why Us?', 'Features', 'Process', 'Team', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                onClick={(e) => scrollToSection(e, item.toLowerCase().replace(' ', '-'))}
                className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex">
            <button
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_10px_-2px_rgba(249,115,22,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_15px_-3px_rgba(249,115,22,0.5)] transform hover:-translate-y-0.5"
            >
              Partner With Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-900 focus:outline-none bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-white/40 shadow-sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-xl shadow-2xl py-6 border-t border-slate-100 flex flex-col px-6 space-y-5"
          >
            {['Why Us?', 'Features', 'Process', 'Team', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                onClick={(e) => scrollToSection(e, item.toLowerCase().replace(' ', '-'))}
                className="text-lg font-medium text-slate-700 hover:text-orange-500"
              >
                {item}
              </a>
            ))}
            <button onClick={() => navigate('/home')} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium px-6 py-4 rounded-xl w-full text-center shadow-md">
              Partner With Us
            </button>
          </motion.div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        {/* Abstract Background Blur Orbs for depth */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Text */}
            <motion.div
              initial="hidden" animate="visible" variants={staggerContainer}
              className="lg:col-span-6 z-10 text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-orange-200 shadow-sm rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse"></span>
                <span className="text-xs font-bold tracking-wider text-orange-600 uppercase">Live in Sri Lanka</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-[5rem] font-serif font-bold leading-[1.1] mb-6 text-slate-900 drop-shadow-sm"
              >
                Sri Lanka's Unified Apparel Ecosystem
              </motion.h1>

              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif font-bold italic text-orange-500 mb-8 drop-shadow-sm">
                Sourcing Fabrics Just Got Simple
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Stop wasting days in Pettah markets. Connect directly with elite wholesalers, check live stock, and hire master tailors—all from your phone.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <PremiumButton onClick={() => navigate('/shop')} className="w-full sm:w-auto">
                  I'm a Buyer
                </PremiumButton>
                <PremiumButton onClick={() => navigate('/register', { state: { defaultRole: 'seller' } })} outline className="w-full sm:w-auto">
                  I'm a Seller
                </PremiumButton>
              </motion.div>
            </motion.div>

            {/* Complex Multi-Layer Image Stack */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-6 relative h-[500px] md:h-[600px] hidden lg:block perspective-1000"
            >
              {/* Back Layer - Digital Studio */}
              <div className="absolute top-10 right-4 w-[60%] h-[60%] bg-white rounded-3xl p-2 shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500 z-10 border border-slate-100/50">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/10 mix-blend-overlay z-10"></div>
                  <img src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Garment Studio" className="w-full h-full object-cover filter contrast-110" />
                </div>
              </div>

              {/* Middle Layer - Fabric Bazaar */}
              <div className="absolute bottom-10 left-0 w-[65%] h-[55%] bg-white/90 backdrop-blur-sm rounded-3xl p-3 shadow-2xl transform -rotate-3 hover:-rotate-6 transition-transform duration-500 z-20 border border-slate-200/60">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img src="https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Fabric Bazaar" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Front Layer - High-end Tailoring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[55%] h-[75%] bg-white rounded-3xl p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform duration-500 z-30 border-4 border-white">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img src="https://images.pexels.com/photos/461035/pexels-photo-461035.jpeg?auto=compress&cs=tinysrgb&w=800" alt="High-end Tailoring" className="w-full h-full object-cover" />

                  {/* Glassmorphism Badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/40 backdrop-blur-xl border border-white/60 p-4 rounded-xl shadow-lg flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-inner">
                      <Scissors size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-800 font-bold uppercase tracking-wide">Verified Talent</p>
                      <p className="text-sm font-black text-slate-900">Master Tailors Available</p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF MARQUEE */}
      <section className="py-8 bg-slate-900 border-y border-slate-800 relative z-20 overflow-hidden shadow-2xl">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

        <div className="flex text-slate-400 items-center">
          <div className="uppercase tracking-[0.2em] text-xs font-bold text-slate-500 px-8 flex-shrink-0 z-20 bg-slate-900">
            Trusted By Elite Suppliers
          </div>
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex items-center space-x-16 whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity"
          >
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center space-x-2 text-lg font-serif font-bold text-white"><Factory size={20} className="text-orange-500" /> <span>Pettah Central Wholesalers</span></span>
                <span className="flex items-center space-x-2 text-lg font-serif font-bold text-white"><Briefcase size={20} className="text-orange-500" /> <span>Colombo Tex Traders</span></span>
                <span className="flex items-center space-x-2 text-lg font-serif font-bold text-white"><Scissors size={20} className="text-orange-500" /> <span>Galle Master Tailors</span></span>
                <span className="flex items-center space-x-2 text-lg font-serif font-bold text-white"><PenTool size={20} className="text-orange-500" /> <span>Lanka Design Studio</span></span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ECOSYSTEM BENTO GRID */}
      <section id="features" className="py-24 relative z-10">
        <div className="absolute inset-0 bg-stone-50 mix-blend-multiply opacity-50 -z-10"></div>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 drop-shadow-sm">The Complete Ecosystem</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Experience a seamlessly connected platform bringing every facet of the fashion industry into one unified marketplace.</p>
          </div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={fadeInUp} className="group relative bg-white/60 backdrop-blur-sm p-1 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/80">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F4F1EA] h-full rounded-[1.35rem] p-8 border border-white relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-stone-200/40 rounded-full blur-2xl group-hover:bg-orange-200/40 transition-colors duration-500"></div>
                <div className="w-16 h-16 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,1)] rounded-2xl flex items-center justify-center mb-8 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10">
                  <Scissors size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4 relative z-10">High-end Tailoring</h3>
                <p className="text-slate-600 font-medium leading-relaxed relative z-10">Connect instantly with master craftsmen. Browse portfolios, request custom quotes, and turn raw fabric into exceptional garments with full transparency.</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp} className="group relative bg-white/60 backdrop-blur-sm p-1 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/80">
              <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F4F1EA] h-full rounded-[1.35rem] p-8 border border-white relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-stone-200/40 rounded-full blur-2xl group-hover:bg-orange-200/40 transition-colors duration-500"></div>
                <div className="w-16 h-16 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,1)] rounded-2xl flex items-center justify-center mb-8 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10">
                  <ShoppingBag size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4 relative z-10">Fabric Bazaar</h3>
                <p className="text-slate-600 font-medium leading-relaxed relative z-10">A digital counterpart to Pettah's bustling textile markets. Access wholesale inventories, compare GSMs, and secure confirmed stock without leaving your desk.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} className="group relative bg-white/60 backdrop-blur-sm p-1 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/80">
              <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F4F1EA] h-full rounded-[1.35rem] p-8 border border-white relative overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-stone-200/30 rounded-full blur-3xl group-hover:bg-orange-200/30 transition-colors duration-500"></div>
                <div className="w-16 h-16 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,1)] rounded-2xl flex items-center justify-center mb-8 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10">
                  <PenTool size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4 relative z-10">Modern Design Studio</h3>
                <p className="text-slate-600 font-medium leading-relaxed relative z-10">Collaborate with visionary Sri Lankan designers. Conceptualize distinct fashion lines, align patterns with chosen fabrics, and oversee production.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI SHOP ASSISTANT SHOWCASE */}
      <section className="py-32 relative overflow-hidden bg-slate-950 text-white z-0">
        {/* Background Blurred Fabric */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=2000" alt="Dark Fabric Texture" className="w-full h-full object-cover filter blur-sm" />
          <div className="absolute inset-0 bg-slate-950/70 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg text-white">
                Meet Your ClothStreet <br /><span className="italic text-orange-400">AI Assistant.</span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light shadow-sm">
                Not sure how much fabric you need? Our intelligent assistant calculates exact yardage based on your unique body measurements and selected pattern. Perfect fit, zero waste.
              </p>

              <ul className="space-y-6 mb-12">
                {[
                  "Natural language conceptual requests",
                  "Automated, precise yardage calculation",
                  "Direct integration with checkout flow"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-4 text-slate-200 font-medium">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => { window.scrollTo(0, 0); navigate('/register'); }} className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white text-lg font-medium px-8 py-4 rounded-2xl transition-all shadow-xl flex items-center space-x-3 group">
                <MessageSquare size={22} className="group-hover:text-orange-400 transition-colors" />
                <span>Initialize Assistant</span>
              </button>
            </motion.div>

            {/* Right Flow UI Mockup - Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-b from-white/20 to-transparent blur-md"></div>
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative z-10">
                <div className="flex items-center space-x-3 pb-6 border-b border-white/10 mb-8">
                  <div className="flex space-x-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-500/50"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-500/50"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-white/50 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                  </div>
                  <div className="text-sm tracking-widest text-slate-300 font-semibold uppercase ml-2">ClothStreet Matrix</div>
                </div>

                <div className="space-y-8">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-white/20 backdrop-blur-md border border-white/10 text-white p-5 rounded-3xl rounded-tr-sm max-w-[85%] text-base shadow-lg font-medium">
                      Find denim that fits me for a casual jacket. Use measurements from my profile.
                    </div>
                  </div>

                  {/* AI Response Card */}
                  <div className="flex justify-start">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl rounded-tl-sm w-full max-w-[95%] shadow-2xl">
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                          <span className="text-white text-sm font-black tracking-wider">AI</span>
                        </div>
                        <div>
                          <p className="text-base text-slate-200 font-medium leading-relaxed">Based on your saved profile (Height: 5'10", Chest: 40"), you require exactly <strong className="text-orange-400">2.5 meters</strong> of denim for a standard casual jacket block. Here is a premium match:</p>
                        </div>
                      </div>

                      {/* Fabric Product Card internal - glassmorphism */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex space-x-5 border border-white/10 items-center shadow-inner hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="w-20 h-20 rounded-xl bg-slate-800 flex-shrink-0 overflow-hidden shadow-lg border border-white/20">
                          <img src="https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Nolimit Denim" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">Nolimit Premium Denim</h4>
                          <p className="text-sm text-slate-400 mb-3">14oz | Non-stretch | Supplier: Nolimit LK</p>
                          <div className="flex justify-between items-center">
                            <span className="text-orange-400 font-bold text-lg">LKR 2,450<span className="text-xs text-slate-500">/m</span></span>
                            <span className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-md shadow-orange-500/20 text-white text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-lg">Add 2.5m</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEVELOPMENT TEAM */}
      <section id="team" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-stone-50 mix-blend-multiply opacity-30 -z-10"></div>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 drop-shadow-sm">Built by Team CS 129</h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto font-medium">The passionate architects dedicated to transforming the Sri Lankan textile marketplace.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: 'Imedha', role: 'Frontend Developer', img: `https://api.dicebear.com/9.x/avataaars/svg?seed=Alex&backgroundColor=f1f5f9` },
              { name: 'Jaindi', role: 'Frontend Lead', img: `https://api.dicebear.com/9.x/avataaars/svg?seed=Robert&backgroundColor=f1f5f9` },
              { name: 'Methasha', role: 'Backend Lead', img: `https://api.dicebear.com/9.x/avataaars/svg?seed=Caleb&backgroundColor=f1f5f9` },
              { name: 'Thiran', role: 'DataBase Developer', img: '/img/thiranNew.png' },
              { name: 'Kavinda', role: 'DataBase Lead', img: '/img/KavindaNew.png' },
              { name: 'Mario', role: 'Backend Architect', img: '/img/marioNew.png' }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="w-28 h-28 mx-auto mb-4 bg-white rounded-full overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:shadow-[0_8px_30px_rgba(249,115,22,0.2)] border-[6px] border-white group-hover:border-orange-50 transition-all duration-300 transform group-hover:-translate-y-2">
                  <img src={member.img} className="w-full h-full object-cover" alt={member.name} />
                </div>
                <h4 className="font-bold text-slate-900 text-lg tracking-tight">{member.name}</h4>
                <p className="text-sm font-medium text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default LandingPage;
