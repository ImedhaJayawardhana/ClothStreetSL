import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroImg from "../assets/textile-hero-bg.png";
import craftImg from "../assets/craftsperson-bg.png";
import "./Home.css";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If the user is logged in, redirect them to their main portal
  if (user) {
    if (user.role === 'designer') return <Navigate to="/designer-dashboard" replace />;
    if (user.role === 'seller') return <Navigate to="/dashboard" replace />;
    if (user.role === 'tailor') return <Navigate to="/tailor-dashboard" replace />;
    return <Navigate to="/shop" replace />;
  }

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
 <Link to="/register" className="btn-outline-hero">
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