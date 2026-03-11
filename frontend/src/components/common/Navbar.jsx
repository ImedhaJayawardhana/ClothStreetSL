import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
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
            <Link to="/" className="px-4 py-2.5 rounded-md bg-purple-50 text-purple-700 font-medium text-sm transition-colors">
                Home
            </Link>
            <Link to="/shop" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Shop
            </Link>
        </>
    );

    // Links for Customer Role
    const customerLinks = (
        <>
            <Link to="/shop" className="px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                Shop
            </Link>
            <Link to="/tailors" className="px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                Tailors
            </Link>
            <Link to="/designers" className="px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                Designers
            </Link>
            <Link to="/match" className="px-4 py-2.5 rounded-md text-purple-600 hover:bg-purple-50 font-medium text-sm transition-colors">
                AI Match
            </Link>
        </>
    );

    // Links for Supplier, Tailor, Designer Role
    const businessLinks = (
        <>
            <Link to={user?.role === "tailor" ? "/tailor-dashboard" : "/dashboard"} className="px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                Dashboard
            </Link>
            <Link to="/shop" className="px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                Shop
            </Link>
            <Link to="/tailors" className="px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                Tailors
            </Link>
            <Link to="/designers" className="px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                Designers
            </Link>
            <Link to="/match" className="px-4 py-2.5 rounded-md text-purple-600 hover:bg-purple-50 font-medium text-sm transition-colors">
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
        <nav className="border-b border-gray-100 bg-white relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-600 text-white shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-purple-700 tracking-tight">ClothStreet</span>
                        </Link>
                    </div>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center space-x-2">
                        {!user && unauthLinks}
                        {user?.role === "customer" && customerLinks}
                        {(user?.role === "seller" || user?.role === "tailor" || user?.role === "designer") && businessLinks}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-5">
                        <Link to="/cart" className="relative p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm bg-gray-50/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-purple-600 text-white text-[11px] font-bold leading-none shadow-sm">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {!user ? (
                            <div className="flex items-center space-x-4 ml-2">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-5 py-2.5 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm">
                                    Signup
                                </Link>
                            </div>
                        ) : (
                            <div className="relative ml-2" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold border-2 border-transparent hover:border-purple-300 transition-all focus:outline-none"
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        {user.role === "customer" ? (
                                            <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                                Profile
                                            </Link>
                                        ) : (
                                            <Link
                                                to={user?.role === "tailor" ? "/tailor-profile" : user?.role === "designer" ? "/designer-profile" : "/portfolio"}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                            >
                                                Portfolio
                                            </Link>
                                        )}

                                        {user.role === "seller" && (
                                            <Link to="/inventory" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                                Inventory
                                            </Link>
                                        )}

                                        <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                            Orders
                                        </Link>

                                        <div className="border-t border-gray-50 mt-1 pt-1">
                                            <button
                                                onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
