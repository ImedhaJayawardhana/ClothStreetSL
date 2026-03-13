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
