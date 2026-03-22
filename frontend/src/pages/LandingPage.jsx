import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! We'll get back to you soon.`);
    e.target.reset();
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing-page-root">
      {/* NAVIGATION */}
      <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none' }}>
        <div className="container nav-container">
          <a href="#" className="logo">Cloth<span className="text-gold">Street</span></a>
          <div className="nav-links" style={{ display: mobileMenuOpen ? 'flex' : '' }}>
            <a href="#problem" onClick={(e) => scrollToSection(e, 'problem')}>Why Us?</a>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')}>Features</a>
            <a href="#flow" onClick={(e) => scrollToSection(e, 'flow')}>Process</a>
            <a href="#team" onClick={(e) => scrollToSection(e, 'team')}>Team</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')}>FAQ</a>
          </div>
          <button onClick={() => navigate('/home')} className="btn btn-primary">Partner With Us</button>
          <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className="fas fa-bars"></i>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="container">
          <span className="hero-badge">Live in Sri Lanka</span>
          <h1>Sourcing Fabrics <br /> <span className="text-italic text-gold">Just Got Simple.</span></h1>
          <p className="hero-text">Stop wasting days in Pettah markets. Connect directly with elite wholesalers, check live stock, and hire master tailors—all from your phone.</p>

          <div className="cta-group">
            <button onClick={() => navigate('/shop')} className="btn btn-primary">I'm a Buyer</button>
            <button onClick={() => navigate('/login')} className="btn btn-outline">I'm a Seller</button>
          </div>

          <div className="hero-image-container">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop" alt="App Dashboard" />
            <div className="float-card">
              <div className="icon-circle"><i className="fa-solid fa-check"></i></div>
              <div className="badge-content">
                <span className="badge-label">Stock Status</span>
                <span>Confirmed Available</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PROBLEM / MISSION */}
      <section id="problem" className="section bg-light">
        <div className="container grid-2">
          <div>
            <h2>The Market is Broken.</h2>
            <div className="problem-list">
              <div className="problem-item fall-in">
                <div className="icon-box icon-red"><i className="fa-solid fa-eye-slash"></i></div>
                <div>
                  <h3>Pricing Opacity</h3>
                  <p>92% of buyers report paying different prices for the same fabric depending on who they ask.</p>
                </div>
              </div>
              <div className="problem-item fall-in">
                <div className="icon-box icon-red"><i className="fa-solid fa-xmark"></i></div>
                <div>
                  <h3>Inventory Risk</h3>
                  <p>64% of wholesalers fear selling online because they can't manage bulk orders and physical stock.</p>
                </div>
              </div>
              <div className="problem-item fall-in">
                <div className="icon-box icon-red"><i className="fa-solid fa-link-slash"></i></div>
                <div>
                  <h3>Disconnected Service</h3>
                  <p>53% of tailors want to connect with fabric sellers, but no platform links sourcing to production.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="solution-box fall-in">
            <h3>The Cloth Street Solution</h3>
            <ul className="check-list">
              <li><i className="fa-solid fa-circle-check"></i> Stock Confirmation Workflow</li>
              <li><i className="fa-solid fa-circle-check"></i> Unified Wholesale & Retail Access</li>
              <li><i className="fa-solid fa-circle-check"></i> Fabric-to-Fashion Integration</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES (BENTO GRID) */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Engineered for Commerce</h2>
            <p>Everything you need to run your fashion business or find materials for your next project.</p>
          </div>

          <div className="bento-grid">
            <div className="card card-wide pop-in">
              <div className="card-icon icon-gold"><i className="fa-solid fa-store"></i></div>
              <h3>One Marketplace, Every Scale</h3>
              <p>Whether you need 5 meters or 500, find wholesale distributors and retail sellers side by side. Compare prices transparently, choose your supplier, and get exactly what you need—all in one place.</p>
            </div>

            <div className="card card-tall pop-in">
              <div className="card-icon icon-white"><i className="fa-solid fa-scissors"></i></div>
              <h3>From Fabric to Fashion</h3>
              <p>Don't just buy fabric. Connect directly with verified tailors and printers to turn your raw material into finished goods instantly. Complete your entire supply chain in one platform.</p>
            </div>

            <div className="card pop-in">
              <div className="card-icon icon-green"><i className="fa-solid fa-check-double"></i></div>
              <h3>Zero Surprises</h3>
              <p>Every order is stock-confirmed before payment. No refunds, no waiting, no disappointments.</p>
            </div>

            <div className="card pop-in">
              <div className="card-icon icon-purple"><i className="fa-solid fa-magnifying-glass"></i></div>
              <h3>Search Like a Pro</h3>
              <p>Filter by the metrics that matter: GSM, weave type, stretch percentage, and more. Find exactly what you're looking for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="flow" className="section bg-dark">
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: 'white' }}>How It Works</h2>
            <p style={{ color: '#94a3b8' }}>From sourcing to stitching in 4 simple steps.</p>
          </div>

          <div className="flow-steps">
            <div className="flow-line"></div>
            <div className="step">
              <div className="step-num">1</div>
              <h3>Search</h3>
              <p>Find fabrics by spec.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Request</h3>
              <p>Ask seller for stock.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Pay</h3>
              <p>Secure checkout via PayHere.</p>
            </div>
            <div className="step">
              <div className="step-num" style={{ background: 'var(--gold)', borderColor: 'var(--gold)' }}>4</div>
              <h3>Create</h3>
              <p>Hire a tailor or Printing agent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Built by Team CS 129</h2>
          </div>
          <div className="team-grid">
            {[
              { name: 'Imedha', role: 'Frontend Developer', seed: 'Alex' },
              { name: 'Jaindi', role: 'Frontend Lead', seed: 'Robert' },
              { name: 'Methasha', role: 'Backend Lead', seed: 'Caleb' },
              { name: 'Thiran', role: 'DataBase Developer', seed: 'Thiran' },
              { name: 'Kavinda', role: 'DataBase Lead', seed: 'Kavinda' },
              { name: 'Mario', role: 'Backend Architect', seed: 'Mario' }
            ].map((member, idx) => (
              <div className="member pop-in" key={idx}>
                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${member.seed}`} className="avatar" alt="Member" />
                <h4>{member.name}</h4>
                <div className="role">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-light">
        <div className="container faq-wrapper">
          <div className="section-header">
            <h2>Common Questions</h2>
          </div>
          <div className="faq-list">
            {[
              { q: "Is Cloth Street free for Buyers?", a: "Yes! Browsing is free. We only charge a small platform fee on completed transactions." },
              { q: "Can I compare wholesale and retail prices?", a: "Absolutely. Our platform brings together wholesalers and retailers, allowing you to compare pricing." },
              { q: "Can I track my delivery?", a: "Yes, we integrate with logistics providers like Prompt Xpress to provide real-time updates." }
            ].map((faq, idx) => (
              <div className={`faq-item ${openFaq === idx ? 'open' : ''}`} key={idx}>
                <div className="faq-head" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  <span>{faq.q}</span>
                  <span className="plus">+</span>
                </div>
                <div className="faq-body">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="container contact-box">
          <div className="section-header">
            <h2>Partner With Us</h2>
            <p>Join the digital revolution of Sri Lanka's textile industry.</p>
          </div>
          <form id="contactForm" onSubmit={handleContactSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" id="name" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" id="email" placeholder="Your Email" required />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea id="message" rows="5" placeholder="How can we help?" required></textarea>
            </div>
            <button type="submit" className="btn btn-dark">Send Inquiry</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="container">
          <span className="footer-logo">Cloth<span className="text-gold">Street</span>.</span>
          <p>&copy; 2025 Team CS-129. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
