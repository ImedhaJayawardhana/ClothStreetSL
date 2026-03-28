import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const [role, setRole] = useState(location.state?.defaultRole || 'customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await register(name, email, password, role);

      const returnUrl = location.state?.returnUrl;
      if (returnUrl) {
        navigate(returnUrl, { state: location.state });
      } else if (role === 'designer') {
        navigate('/designer-dashboard');
      } else if (role === 'seller') {
        navigate('/dashboard');
      } else if (role === 'tailor') {
        navigate('/tailor-dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || err.message || 'Failed to create account. Please try again.';
      setError(msg);
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(role);

      const returnUrl = location.state?.returnUrl;
      if (returnUrl) {
        navigate(returnUrl, { state: location.state });
      } else if (role === 'designer') {
        navigate('/designer-dashboard');
      } else if (role === 'seller') {
        navigate('/dashboard');
      } else if (role === 'tailor') {
        navigate('/tailor-dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google.');
    }
    setLoading(false);
  }

  const roleOptions = [
    {
      value: 'customer',
      label: 'Customer',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      value: 'tailor',
      label: 'Tailor',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M20 4 8.12 15.88" />
          <path d="M14.47 14.48 20 20" />
          <path d="M8.12 8.12 12 12" />
        </svg>
      ),
    },
    {
      value: 'designer',
      label: 'Designer',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      ),
    },
    {
      value: 'seller',
      label: 'Seller',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
          <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
          <path d="M12 3v6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans py-12">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1920&q=80"
          alt="Textile background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-amber-50/90 to-slate-100/95"></div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-4 py-8">
        {/* Brand */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group relative">
            <img src={logo} alt="ClothStreet Logo" className="w-48 sm:w-56 h-auto object-contain mx-auto -my-6 group-hover:scale-105 transition-transform duration-300 mix-blend-darken relative z-10" />
            <span className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase pt-2 inline-block relative z-20">Sri Lanka's Textile Ecosystem</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-2xl -mr-16 -mt-16"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">New Protocol</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Create Account</h1>
              <p className="text-sm text-slate-400 font-bold mt-2 font-serif italic">Join the digital textile revolution in Sri Lanka</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl mb-6 text-red-600">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '1rem', padding: '0 16px', gap: '10px', transition: 'border-color 0.2s' }}>
                  <svg style={{ width: '20px', height: '20px', flexShrink: 0, color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Enter your legal name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '14px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '1rem', padding: '0 16px', gap: '10px', transition: 'border-color 0.2s' }}>
                  <svg style={{ width: '20px', height: '20px', flexShrink: 0, color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter your professional email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '14px 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}
                    required
                  />
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-amber-600/30 focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-300 outline-none transition-all duration-300 shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-600 transition-colors duration-300"
                    >
                      {showPassword
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                  <div className="relative group">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-amber-600/30 focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-300 outline-none transition-all duration-300 shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-600 transition-colors duration-300"
                    >
                      {showConfirm
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identify Your Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {roleOptions.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border text-[9px] font-black uppercase tracking-tighter transition-all duration-300
                        ${role === value
                          ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-600/20'
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-amber-600/30'
                        }`}
                    >
                      <span className={role === value ? 'text-white' : 'text-slate-500'}>{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 border border-slate-800 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/10 hover:bg-amber-600 hover:border-amber-500 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Register
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Sync with Google
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-slate-200 py-4 px-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 hover:border-amber-600/30 hover:bg-slate-50 group shadow-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Sign up with Google</span>
            </button>

            {/* Sign In Link */}
            <div className="text-center mt-10">
              <p className="text-sm text-slate-400 font-bold">
                Already registered?{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-700 underline underline-offset-4 decoration-2 font-black">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
            Secure Digital Protocol &copy; {new Date().getFullYear()} ClothStreet Lanka <br />
            <Link to="#" className="hover:text-amber-600 transition-colors mx-2">Terms</Link>
            <span className="text-slate-200">|</span>
            <Link to="#" className="hover:text-amber-600 transition-colors mx-2">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
