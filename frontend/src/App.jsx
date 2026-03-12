import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseTailors from "./pages/BrowseTailors";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import BrowseMaterials from "./pages/BrowseMaterials";
import BrowseDesigners from "./pages/BrowseDesigners";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import SellerDashboard from "./pages/supplier/seller-dashboard";
import TailorDashboard from "./pages/Tailor/TailorDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import AIMatch from "./pages/AIMatch";
import Inventory from "./pages/supplier/Inventory";
import TailorProfile from "./pages/Tailor/TailorProfile";
import DesignerProfile from "./pages/designer/DesignerProfile";
import DesignerDashboard from "./pages/DesignerDashboard";
import DesignerOrders from "./pages/designer/DesignerOrders";
import ProductDetail from "./pages/ProductDetail";
import Portfolio from "./pages/supplier/Portfolio";
import Store from "./pages/Store";
import CustomerOrders from "./pages/CustomerOrders";
import ForgotPassword from "./pages/ForgotPassword";


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/tailors" element={<BrowseTailors />} />
          <Route path="/designers" element={<BrowseDesigners />} />
          <Route path="/match" element={<AIMatch />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/shop" element={<BrowseMaterials />} />
          <Route path="/shop/:fabricId" element={<ProductDetail />} />
          <Route path="/fabrics" element={<BrowseMaterials />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
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