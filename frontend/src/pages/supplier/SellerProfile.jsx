import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, updatePassword } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InputField = ({ label, name, value, isReadOnly = false, type = "text", placeholder, isEditing, handleInputChange }) => (
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
export default function SellerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  // Read-only data
  const [readOnlyData, setReadOnlyData] = useState({
    email: "",
    storeName: "",
    hasShopName: false,
    nic: "",
    totalEarnings: 0,
  });
  // Editable data
  const [formData, setFormData] = useState({
    shopName: "",
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
        const savedShopName = sellerData.shopName || sellerData.storeName;
        const hasShopName = !!savedShopName;

        // Set state
        setReadOnlyData({
          email: user.email || sellerData.email || userData.email || "",
          storeName: savedShopName || userData.name || user.name || "N/A",
          hasShopName: hasShopName,
          nic: sellerData.nic || userData.nic || "N/A",
          totalEarnings: totalEarnings,
        });
        setFormData({
          shopName: savedShopName || "",
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

      if (!readOnlyData.hasShopName && formData.shopName && formData.shopName.trim() !== "") {
        updates.shopName = formData.shopName.trim();
        // Also update local readOnly state so it locks immediately upon save
        setReadOnlyData((prev) => ({
          ...prev,
          storeName: formData.shopName.trim(),
          hasShopName: true,
        }));
      }
      // Update in Firestore
      await setDoc(sellerDocRef, updates, { merge: true });
      // Also try to update user doc if it exists to keep in sync
      const userDocRef = doc(db, "users", uid);
      try {
        await updateDoc(userDocRef, { phone: formData.phone, address: formData.address });
      } catch (error) {
        console.debug("Ignored user doc update error:", error);
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/store/${user?.uid}`)}
                  className="bg-white border text-blue-600 border-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  View My Store
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  Edit Profile
                </button>
              </div>
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
        {/* Account Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField
              label="Email Address"
              value={readOnlyData.email}
              isReadOnly={true}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="Password"
              name="password"
              value={formData.password}
              type="password"
              placeholder={isEditing ? "Enter new password (leave blank to keep)" : ""}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
        {/* Business Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Business Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField
              label={readOnlyData.hasShopName ? "Name of Store / Proprietor" : "Name of Store / Proprietor (Can only be set once)"}
              name="shopName"
              value={readOnlyData.hasShopName || !isEditing ? readOnlyData.storeName : formData.shopName}
              isReadOnly={readOnlyData.hasShopName}
              placeholder="Enter your store name"
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="National Identity Card (NIC)"
              value={readOnlyData.nic}
              isReadOnly={true}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="Business Registration Number"
              name="businessRegNumber"
              value={formData.businessRegNumber}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="Address"
              name="address"
              value={formData.address}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
        {/* Bank Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Bank Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="Bank Account Number"
              name="bankAccount"
              value={formData.bankAccount}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Earnings (Upto Date)</label>
              <div className="px-4 py-2 border rounded-xl bg-green-50 text-green-700 font-bold min-h-[42px] flex items-center">
                LKR {readOnlyData.totalEarnings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}