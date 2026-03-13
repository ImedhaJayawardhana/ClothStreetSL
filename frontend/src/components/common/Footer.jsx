import { Link, useNavigate} from"react-router-dom";
import { useAuth} from"../../context/AuthContext";
import toast from"react-hot-toast";

export default function Footer() {
 const { user} = useAuth();
 const navigate = useNavigate();

 const handleListFabrics = (e) => {
 e.preventDefault();
 if (!user) {
 navigate('/login');
 return;
}
 if (user.role ==='seller') {
 navigate('/inventory');
} else {
 toast.error('Only suppliers can list fabrics.');
}
};

 return (
 <footer className="bg-[#0B0F19] py-16 border-t">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

 {/* Brand Column */}
 <div className="space-y-6">
 <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-3">
 <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm">
 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" x2="8.12" y1="4" y2="15.88" /><line x1="14.47" x2="20" y1="14.48" y2="20" /><line x1="8.12" x2="12" y1="8.12" y2="12" />
 </svg>
 </div>
 <span className="text-2xl font-bold tracking-tight">ClothStreet</span>
 </Link>
 <p className="text-sm leading-relaxed max-w-xs">
 Sri Lanka's unified textile ecosystem — connecting fabric suppliers, skilled tailors, and customers in one seamless platform.
 </p>
 <div className="flex items-center gap-4 pt-2">
 <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg hover: hover: transition-colors duration-300">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
 <span className="sr-only">Facebook</span>
 </a>
 <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg hover: hover: transition-colors duration-300">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 5 9.2 5 9.2s1.5.8 3 0C8 2.2 2 4 2 4s1.5 1.5 3 2c-1.3-1.3-2-3-2-3s2-.7 4 0c2.5-3.5 7.5-3 10 1s2.5 0 2.5 0" /></svg>
 <span className="sr-only">Twitter</span>
 </a>
 <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg hover: hover: transition-colors duration-300">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
 <span className="sr-only">Instagram</span>
 </a>
 <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg hover: hover: transition-colors duration-300">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
 <span className="sr-only">LinkedIn</span>
 </a>
 </div>
 </div>

 {/* Platform Links */}
 <div className="space-y-6 lg:ml-8">
 <h3 className="font-semibold tracking-wide">Platform</h3>
 <ul className="space-y-4">
 <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">About Us</Link></li>
 <li><Link to="/shop" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Fabric Marketplace</Link></li>
 <li><Link to="/tailors" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Find Tailors</Link></li>
 <li>
 <Link to="/designers" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">
 Find Designers
 </Link>
 </li>
 <li><Link to="/match" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">AI Recommendations</Link></li>
 <li><Link to="/tracking" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Order Tracking</Link></li>
 <li><Link to="/register" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Join as Supplier</Link></li>
 </ul>
 </div>

 {/* Business Links */}
 <div className="space-y-6">
 <h3 className="font-semibold tracking-wide">For Business</h3>
 <ul className="space-y-4">
 <li><a href="#" onClick={handleListFabrics} className="text-sm hover: transition-colors">List Your Fabrics</a></li>
 <li><Link to="/register" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Join as Tailor</Link></li>
 <li><Link to="/register" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Join as Designer</Link></li>

 <li><Link to="/business/enterprise" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Enterprise Solutions</Link></li>
 </ul>
 </div>

 {/* Contact Information */}
 <div className="space-y-6">
 <h3 className="font-semibold tracking-wide">Contact Us</h3>
 <ul className="space-y-5">
 <li className="flex items-start gap-4">
 <svg className="w-5 h-5 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
 <span className="text-sm leading-relaxed">No. 42, Pettah Market Complex, Colombo 11, Sri Lanka</span>
 </li>
 <li className="flex items-center gap-4">
 <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
 <span className="text-sm">+94 11 234 5678</span>
 </li>
 <li className="flex items-center gap-4">
 <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
 <a href="mailto:hello@clothstreet.lk" className="text-sm hover: transition-colors">hello@clothstreet.lk</a>
 </li>
 </ul>
 </div>

 </div>

 {/* Bottom Bar */}
 <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
 <p className="text-sm">
 © 2026 ClothStreet. All rights reserved.
 </p>
 <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
 <Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Privacy Policy</Link>
 <Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Terms of Service</Link>
 <Link to="/cookies" onClick={() => window.scrollTo(0, 0)} className="text-sm hover: transition-colors">Cookie Policy</Link>
 </div>
 </div>
 </div>
 </footer>
 );
}
