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

      {/* ============ MORE SECTIONS COMING (Parts 2–6) ============ */}
    </div>
  );
}