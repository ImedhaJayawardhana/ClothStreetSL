import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseTailors from "./pages/BrowseTailors";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import SellerDashboard from "./pages/supplier/seller-dashboard";
import TailorDashboard from "./pages/Tailor/TailorDashboard";

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
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/tailor-dashboard" element={<TailorDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}