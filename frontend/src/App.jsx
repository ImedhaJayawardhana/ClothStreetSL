import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseTailors from "./pages/BrowseTailors";
import Cart from "./pages/Cart";
import BrowseMaterials from "./pages/BrowseMaterials";
import BrowseDesigners from "./pages/BrowseDesigners";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import SellerDashboard from "./pages/supplier/seller-dashboard";
import TailorDashboard from "./pages/Tailor/TailorDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import AIMatch from "./pages/AIMatch";


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
          <Route path="/tailors" element={<BrowseTailors />} />
          <Route path="/designers" element={<BrowseDesigners />} />
          <Route path="/match" element={<AIMatch />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/shop" element={<BrowseMaterials />} />
          <Route path="/fabrics" element={<BrowseMaterials />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/tailor-dashboard" element={<TailorDashboard />} />
          <Route path="/profile" element={<PrivateRoute><CustomerProfile /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}