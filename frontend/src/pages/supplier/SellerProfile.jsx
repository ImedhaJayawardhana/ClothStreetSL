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
import { getAuth, updatePassword, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { deleteAccount as deleteAccountApi } from "../../api";

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
  const { user, deleteUserAccount } = useAuth();
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
    password: "",
    businessRegNumber: "",
    street: "",
    city: "",
    province: "",
    zip: "",
    bankName: "",
    bankAccount: "",
  });
  // Preferences
  const [preferences, setPreferences] = useState({ emailAlerts: true, smsAlerts: false });
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteFeedback, setDeleteFeedback] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const DELETE_REASONS = ["I found a better alternative", "I'm not using the platform anymore", "Privacy concerns", "Too many emails / notifications", "Other"];
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
          street: sellerData.address?.street || sellerData.shopAddress || sellerData.address || "",
          city: sellerData.address?.city || "",
          province: sellerData.address?.province || "",
          zip: sellerData.address?.zip || "",
          bankName: sellerData.bankName || "",
          bankAccount: sellerData.bankAccount || sellerData.accountNumber || "",
        });
        setPreferences(userData.preferences || sellerData.preferences || { emailAlerts: true, smsAlerts: false });
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
        address: { street: formData.street, city: formData.city, province: formData.province, zip: formData.zip },
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
        await updateDoc(userDocRef, { phone: formData.phone, address: { street: formData.street, city: formData.city, province: formData.province, zip: formData.zip } });
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

        {/* ── Hero Banner ── */}
        <section className="cp-hero rounded-3xl mb-8 shadow-sm">
          <div className="cp-hero-inner" style={{ justifyContent: "space-between" }}>
            
            {/* Left: Icon & Info */}
            <div className="flex items-center gap-6">
              <div className="cp-avatar-wrap">
                <div className="cp-avatar" style={{ border: "none", background: "rgba(255,255,255,0.15)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              </div>
              
              <div className="cp-hero-info">
                <div className="cp-hero-name-row" style={{ marginBottom: "6px" }}>
                  <h1 className="cp-hero-name">{readOnlyData.storeName || "My Store"}</h1>
                </div>
                <div className="cp-hero-contacts">
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "14.5px", fontWeight: "500" }}>
                     Seller Profile
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div>
              {!isEditing ? (
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate(`/store/${user?.uid}`)} className="cp-edit-btn" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    View Store
                  </button>
                  <button onClick={() => setIsEditing(true)} className="cp-edit-btn">
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={handleCancel} className="cp-edit-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)" }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} className="cp-edit-btn" style={{ background: "white", color: "#4c1d95" }}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </section>
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
              label="Street Address"
              name="street"
              value={formData.street}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="City"
              name="city"
              value={formData.city}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="Province"
              name="province"
              value={formData.province}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="Postal / Zip Code"
              name="zip"
              value={formData.zip}
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

        {/* Preferences Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            </svg>
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold text-gray-800">Email Notifications</p><p className="text-xs text-gray-500">Receive order updates and promotions via email.</p></div>
              <button onClick={async () => { const np = { ...preferences, emailAlerts: !preferences.emailAlerts }; setPreferences(np); try { await setDoc(doc(db, "users", user.uid), { preferences: np }, { merge: true }); } catch {} }} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: preferences.emailAlerts ? '#2563eb' : '#d1d5db' }}>
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: preferences.emailAlerts ? '22px' : '2px' }} />
              </button>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold text-gray-800">SMS Alerts</p><p className="text-xs text-gray-500">Get real-time text messages when orders are out for delivery.</p></div>
              <button onClick={async () => { const np = { ...preferences, smsAlerts: !preferences.smsAlerts }; setPreferences(np); try { await setDoc(doc(db, "users", user.uid), { preferences: np }, { merge: true }); } catch {} }} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: preferences.smsAlerts ? '#2563eb' : '#d1d5db' }}>
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: preferences.smsAlerts ? '22px' : '2px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Account Security Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Account Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold text-gray-800">Password</p><p className="text-xs text-gray-500">Send a secure reset link to your email.</p></div>
              <button onClick={async () => { try { await sendPasswordResetEmail(getAuth(), user.email); toast.success("Password reset email sent!"); } catch { toast.error("Failed to send reset email"); } }} className="px-4 py-2 rounded-xl border text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors">Change Password</button>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold text-red-600">Delete Account</p><p className="text-xs text-gray-500">Permanently remove your account and data.</p></div>
              <button onClick={() => { setShowDeleteModal(true); setDeleteStep(1); setDeletePassword(""); setDeleteReason(""); setDeleteFeedback(""); setDeleteError(""); }} className="px-4 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">Delete Account</button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Delete Account Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => { setShowDeleteModal(false); }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center gap-2 mb-6">{[1, 2, 3].map((s) => (<div key={s} className={`w-2.5 h-2.5 rounded-full transition-colors ${s === deleteStep ? 'bg-blue-600' : s < deleteStep ? 'bg-blue-300' : 'bg-gray-200'}`} />))}</div>
            {deleteStep === 1 && (<>
              <div className="text-center mb-4"><span className="text-3xl">🔒</span></div>
              <h3 className="text-lg font-bold text-center mb-1">Verify Your Identity</h3>
              <p className="text-sm text-gray-500 text-center mb-4">Enter your password to continue.</p>
              <input type="password" placeholder="Enter your password" value={deletePassword} onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(""); }} onKeyDown={(e) => e.key === "Enter" && deletePassword.trim() && (setDeleteError(""), setDeleteStep(2))} autoFocus className="w-full border rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              {deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}
              <div className="flex gap-3"><button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Cancel</button><button onClick={() => { if (!deletePassword.trim()) { setDeleteError("Please enter your password."); return; } setDeleteError(""); setDeleteStep(2); }} disabled={!deletePassword.trim()} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50">Continue</button></div>
            </>)}
            {deleteStep === 2 && (<>
              <div className="text-center mb-4"><span className="text-3xl">😔</span></div>
              <h3 className="text-lg font-bold text-center mb-1">Sorry to See You Go</h3>
              <p className="text-sm text-gray-500 text-center mb-4">Could you tell us why you{"'"}re leaving?</p>
              <div className="flex flex-col gap-2 mb-4">{DELETE_REASONS.map((reason) => (<label key={reason} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${deleteReason === reason ? 'border-blue-400 bg-blue-50' : 'hover:bg-gray-50'}`}><input type="radio" name="deleteReason" checked={deleteReason === reason} onChange={() => { setDeleteReason(reason); setDeleteError(""); }} className="accent-blue-600" />{reason}</label>))}</div>
              {deleteReason === "Other" && <textarea placeholder="Your feedback..." value={deleteFeedback} onChange={(e) => setDeleteFeedback(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" rows={3} />}
              {deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}
              <div className="flex gap-3"><button onClick={() => setDeleteStep(1)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Back</button><button onClick={() => { if (!deleteReason) { setDeleteError("Please select a reason."); return; } setDeleteError(""); setDeleteStep(3); }} disabled={!deleteReason} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50">Continue</button></div>
            </>)}
            {deleteStep === 3 && (<>
              <div className="text-center mb-4"><span className="text-3xl">⚠️</span></div>
              <h3 className="text-lg font-bold text-center mb-1">Are You Absolutely Sure?</h3>
              <p className="text-sm text-gray-500 text-center mb-4">This action is <strong>permanent</strong> and cannot be undone.</p>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 text-sm text-red-700"><p className="font-semibold mb-2">Deleting your account will:</p><ul className="list-disc pl-4 space-y-1"><li>Remove your seller profile and store</li><li>Delete your inventory and portfolio</li><li>Remove all transaction history</li><li>Archive your order history</li></ul></div>
              {deleteError && <p className="text-red-500 text-xs mb-3">⚠ {deleteError}</p>}
              <div className="flex gap-3"><button onClick={() => setDeleteStep(2)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Go Back</button><button onClick={async () => { setIsDeleting(true); setDeleteError(""); try { await deleteUserAccount(deletePassword, deleteReason, deleteFeedback || null); setShowDeleteModal(false); navigate("/"); toast.success("Your account has been deleted."); } catch (error) { console.error("Delete failed", error); if (error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') { setDeleteStep(1); setDeleteError("Incorrect password."); } else { setDeleteError("Failed to delete account."); } } finally { setIsDeleting(false); } }} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete My Account"}</button></div>
            </>)}
          </div>
        </div>
      )}
    </div >
  );
}