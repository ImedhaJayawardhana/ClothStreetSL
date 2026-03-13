import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, updatePassword } from "firebase/auth";
import { toast } from "react-hot-toast";
export default function SellerProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  // Read-only data
  const [readOnlyData, setReadOnlyData] = useState({
    email: "",
    storeName: "",
    nic: "",
    totalEarnings: 0,
  });
  // Editable data
  const [formData, setFormData] = useState({
    phone: "",
    password: "", // Handled separately if changed
    businessRegNumber: "",
    address: "",
    bankName: "",
    bankAccount: "",
  });
  useEffect(() => {
    if (!user) return;
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const uid = user.uid;
        // Fetch seller profile
        const sellerDocRef = doc(db, "sellers", uid);
        const sellerSnap = await getDoc(sellerDocRef);
        let sellerData = {};
        if (sellerSnap.exists()) {
          sellerData = sellerSnap.data();
        }
        // Fetch user document to get extra fields if needed
        const userDocRef = doc(db, "users", uid);
        const userSnap = await getDoc(userDocRef);
        let userData = {};
        if (userSnap.exists()) {
          userData = userSnap.data();
        }
        // Calculate total earnings from completed orders
        let totalEarnings = 0;
        const ordersSnap = await getDocs(
          query(collection(db, "orders"), where("sellerId", "==", uid), where("status", "==", "Completed"))
        );
        ordersSnap.docs.forEach((d) => {
          const data = d.data();
          totalEarnings += Number(data.total ?? data.totalAmount ?? 0);
        });
        // Set state
        setReadOnlyData({
          email: user.email || sellerData.email || userData.email || "",
          storeName: sellerData.shopName || sellerData.storeName || userData.name || user.name || "N/A",
          nic: sellerData.nic || userData.nic || "N/A",
          totalEarnings: totalEarnings,
        });
        setFormData({
          phone: sellerData.phone || userData.phone || "",
          password: "",
          businessRegNumber: sellerData.businessRegNumber || sellerData.brn || "",
          address: sellerData.address || sellerData.shopAddress || "",
          bankName: sellerData.bankName || "",
          bankAccount: sellerData.bankAccount || sellerData.accountNumber || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async () => {
    try {
      const uid = user.uid;
      const sellerDocRef = doc(db, "sellers", uid);
      const updates = {
        phone: formData.phone,
        businessRegNumber: formData.businessRegNumber,
        address: formData.address,
        bankName: formData.bankName,
        bankAccount: formData.bankAccount,
      };
      // Update in Firestore
      await updateDoc(sellerDocRef, updates);
      // Also try to update user doc if it exists to keep in sync
      const userDocRef = doc(db, "users", uid);
      try {
        await updateDoc(userDocRef, { phone: formData.phone, address: formData.address });
      } catch (e) {
        // User doc might not exist or we might not have permissions, ignore
      }
      // Handle password update via Firebase Auth
      if (formData.password && formData.password.trim() !== "") {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updatePassword(currentUser, formData.password);
          setFormData((prev) => ({ ...prev, password: "" }));
          toast.success("Password updated successfully");
        }
      }
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");

      // If it's a re-auth required error for password
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please log out and log back in to change your password.");
      }
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    // Reload would be cleaner but let's just wipe password field
    setFormData((prev) => ({ ...prev, password: "" }));
    // Note: without re-fetching, reverting other fields requires storing original state
    // But for a simple cancel, re-fetching or reloading the page is easiest
    window.location.reload();
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-transparent border-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }
  const InputField = ({ label, name, value, isReadOnly = false, type = "text", placeholder }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {isReadOnly || !isEditing ? (
        <div className="px-4 py-2 border rounded-xl bg-gray-50 text-gray-700 min-h-[42px] flex items-center">
          {type === "password" && !isEditing ? "••••••••" : (value || "Not provided")}
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
        />
      )}
    </div>
  );
  return (
    <div className="min-h-screen font-sans bg-gray-50 py-10 pt-24">
      <div className="max-w-4xl mx-auto px-6">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account, business, and banking information.</p>
          </div>

          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6"></div>