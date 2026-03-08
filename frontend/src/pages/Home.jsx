import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroImg from "../assets/textile-hero-bg.png";
import "./Home.css";

export default function Home() {
  const { user, logout } = useAuth();
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
            The Unified Textile{" "}
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
                <p style={{ margin: "0 0 4px", fontSize: "13px", color: "rgba(209,213,219,0.7)" }}>
                  Logged in as
                </p>
                <p className="hero-user-name">{user.name || user.email}</p>
                {user.email && user.name && (
                  <p className="hero-user-email">{user.email}</p>
                )}
                <span className="hero-user-role">{user.role || "user"}</span>
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
                <Link to="/login" className="btn-outline-hero">
                  View Marketplace
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="hero-search">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(209,213,219,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 12, flexShrink: 0 }}>
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

      {/* ============ MORE SECTIONS COMING (Parts 3–6) ============ */}
    </div>
  );
}