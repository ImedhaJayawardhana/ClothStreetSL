import { Routes, Route, Navigate} from"react-router-dom";
import { useAuth} from"./context/AuthContext";
import { Toaster} from"react-hot-toast";
import Home from"./pages/Home";
import Login from"./pages/Login";
import Register from"./pages/Register";
import BrowseTailors from"./pages/BrowseTailors";
import Cart from"./pages/Cart";
import Checkout from"./pages/Checkout";
import BrowseMaterials from"./pages/BrowseMaterials";
import BrowseDesigners from"./pages/BrowseDesigners";
import Navbar from"./components/common/Navbar";
import Footer from"./components/common/Footer";
import SellerDashboard from"./pages/supplier/seller-dashboard";
import SellerProfile from"./pages/supplier/SellerProfile";
import TailorDashboard from"./pages/Tailor/TailorDashboard";
import CustomerProfile from"./pages/CustomerProfile";
import AIMatch from"./pages/AIMatch";
import Inventory from"./pages/supplier/Inventory";
import TailorProfile from"./pages/Tailor/TailorProfile";
import DesignerProfile from"./pages/designer/DesignerProfile";
import DesignerDashboard from"./pages/DesignerDashboard";
import DesignerOrders from"./pages/designer/DesignerOrders";
import ProductDetail from"./pages/ProductDetail";
import Portfolio from"./pages/supplier/Portfolio";
import Store from"./pages/Store";
import CustomerOrders from"./pages/CustomerOrders";
import ForgotPassword from"./pages/ForgotPassword";
import FindTailorDesigner from"./pages/FindTailorDesigner";
import RequestQuote from"./pages/RequestQuote";
import QuotationInbox from"./pages/QuotationInbox";
import QuotationResponse from"./pages/QuotationResponse";
import QuotationReview from"./pages/QuotationReview";
import QuotationOffers from"./pages/QuotationOffers";
import OrderTracking from"./pages/OrderTracking";
import AboutUs from"./pages/AboutUs";
import DesignerTimeline from "./pages/DesignerTimeline";

function PrivateRoute({ children}) {
 const { user} = useAuth();
 return user ? children : <Navigate to="/login" />;
}

function PublicOnlyRoute({ children }) {
 const { user } = useAuth();
 return user ? <Navigate to="/" /> : children;
}

export default function App() {
 return (
 <div className="min-h-screen flex flex-col">
 <Navbar />
 <main className="flex-1">
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/about" element={<AboutUs />} />
 <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
 <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
 <Route path="/forgot-password" element={<ForgotPassword />} />
 <Route path="/tailors" element={<BrowseTailors />} />
 <Route path="/designers" element={<BrowseDesigners />} />
 <Route path="/match" element={<PrivateRoute><AIMatch /></PrivateRoute>} />
 <Route path="/cart" element={<Cart />} />
 <Route path="/checkout" element={<Checkout />} />
 <Route path="/find-tailor-designer" element={<FindTailorDesigner />} />
 <Route path="/request-quote" element={<RequestQuote />} />
 <Route path="/request-quote/:providerId" element={<RequestQuote />} />
 <Route path="/quotation-inbox" element={<QuotationInbox />} />
 <Route path="/quotation-response/:quotationId" element={<QuotationResponse />} />
 <Route path="/quotation-review/:quotationId" element={<QuotationReview />} />
 <Route path="/quotations/offers" element={<PrivateRoute><QuotationOffers /></PrivateRoute>} />
 <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
 <Route path="/designer-timeline/:quotationId" element={<PrivateRoute><DesignerTimeline /></PrivateRoute>} />

 <Route path="/shop" element={<BrowseMaterials />} />
 <Route path="/shop/:fabricId" element={<ProductDetail />} />
 <Route path="/fabrics" element={<BrowseMaterials />} />
 <Route path="/dashboard" element={<SellerDashboard />} />
 <Route path="/seller-profile" element={<PrivateRoute><SellerProfile /></PrivateRoute>} />
 <Route path="/supplier/profile" element={<PrivateRoute><SellerProfile /></PrivateRoute>} />
 <Route path="/tailor-dashboard" element={<TailorDashboard />} />
 <Route path="/designer-dashboard" element={<PrivateRoute><DesignerDashboard /></PrivateRoute>} />
 <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
 <Route path="/profile" element={<PrivateRoute><CustomerProfile /></PrivateRoute>} />
 <Route path="/orders" element={<PrivateRoute><CustomerOrders /></PrivateRoute>} />
 <Route path="/tailor-profile" element={<PrivateRoute><TailorProfile /></PrivateRoute>} />
 <Route path="/tailor/:tailorId" element={<TailorProfile />} />
 <Route path="/designer-profile" element={<PrivateRoute><DesignerProfile /></PrivateRoute>} />
 <Route path="/designer/:designerId" element={<DesignerProfile />} />
 <Route path="/designer-orders" element={<PrivateRoute><DesignerOrders /></PrivateRoute>} />
 <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
 <Route path="/store/:sellerId" element={<Store />} />
 </Routes>
 </main>
 <Footer />
 <Toaster position="bottom-right" />
 </div>
 );
}