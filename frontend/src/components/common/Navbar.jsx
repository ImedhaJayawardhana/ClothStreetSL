import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="border-b border-gray-100 bg-white">
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
                        <Link to="/" className="px-4 py-2.5 rounded-md bg-purple-50 text-purple-700 font-medium text-sm transition-colors">
                            Home
                        </Link>
                        <Link to="/shop" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            Shop
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-5">
                        <button className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm bg-gray-50/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                            </svg>
                        </button>
                        <div className="flex items-center space-x-4 ml-2">
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="px-5 py-2.5 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm">
                                Signup
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
