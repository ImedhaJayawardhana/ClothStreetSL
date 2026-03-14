import { useState} from"react";
import { Link, useNavigate} from"react-router-dom";
import { useAuth} from"../context/AuthContext";
import { auth, storage} from"../firebase/firebase";
import { ref, uploadBytes, getDownloadURL} from"firebase/storage";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { deleteAccount } from "../api";
import "./CustomerProfile.css";

// --- Mock Data for Dashboard Widgets ---
const mockOrders = [
 { id:"#CS-8472", date:"Oct 12, 2025", total:"LKR 4,500", status:"Delivered", class:"delivered"},
 { id:"#CS-8591", date:"Nov 03, 2025", total:"LKR 12,000", status:"Shipped", class:"shipped"},
 { id:"#CS-8610", date:"Nov 15, 2025", total:"LKR 3,250", status:"Processing", class:"processing"},
];

const mockTailors = [
 { name:"Saman Tailors", specialty:"Menswear & Suits", rating:"4.8"},
 { name:"Kandy Fashions", specialty:"Dresses & Blouses", rating:"4.5"},
];

export default function CustomerProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
 const [isSaving, setIsSaving] = useState(false);

 // Section-level edit toggles
 const [editingPersonal, setEditingPersonal] = useState(false);
 const [editingMeasurements, setEditingMeasurements] = useState(false);
 const [editingAddress, setEditingAddress] = useState(false);
 const [editingBio, setEditingBio] = useState(false);

 // New photo file tracking
 const [photoFile, setPhotoFile] = useState(null);

 // Form state
 const [formData, setFormData] = useState({
 name: user?.name ||"",
 email: user?.email ||"",
 phone: user?.phone ||"+94 77 000 0000",
 bio: user?.bio ||"",
 photoURL: user?.photoURL ||"",
 measurements: user?.measurements || {
 chest:"", waist:"", hips:"", inseam:"", shoulder:"", sleeve:"",
},
 address: user?.address || {
 street:"", city: user?.city ||"Colombo", province:"", zip:""
},
 preferences: user?.preferences || {
 emailAlerts: true, smsAlerts: false
}
});

 // Get the user's initial letter for the avatar
 const getInitial = () => {
 if (user?.name) return user.name.charAt(0).toUpperCase();
 if (user?.email) return user.email.charAt(0).toUpperCase();
 return"U";
};

 // Validate phone: strip spaces, dashes, brackets, optional +94/0 prefix → must be 10 digits
 const isValidPhone = (phone) => {
 const digits = phone.replace(/[\s\-().+]/g,"").replace(/^94/,"0");
 return /^\d{10}$/.test(digits);
};

 const handleInputChange = (e) => {
 const { name, value} = e.target;
 if (name ==="phone") {
 // Allow only digits, spaces, dashes, plus sign
 const cleaned = value.replace(/[^\d\s\-+]/g,"");
 setFormData((prev) => ({ ...prev, phone: cleaned}));
 return;
}
 setFormData((prev) => ({ ...prev, [name]: value}));
};

 const handleMeasurementChange = (e) => {
 const { name, value} = e.target;
 setFormData((prev) => ({
 ...prev,
 measurements: {
 ...prev.measurements,
 [name]: value,
},
}));
};

 const handleAddressChange = (e) => {
 const { name, value} = e.target;
 setFormData((prev) => ({
 ...prev,
 address: { ...prev.address, [name]: value},
}));
};

 const handlePreferenceToggle = (field) => {
 setFormData((prev) => ({
 ...prev,
 preferences: { ...prev.preferences, [field]: !prev.preferences[field]}
}));
};

 const handlePhotoUpload = (e) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setPhotoFile(file);
 // Show local preview instantly
 const objectUrl = URL.createObjectURL(file);
 setFormData((prev) => ({ ...prev, photoURL: objectUrl}));
};

 const handleCancel = () => {
 setPhotoFile(null); // Clear pending upload
 setFormData({
 name: user?.name ||"",
 email: user?.email ||"",
 phone: user?.phone ||"+94 77 000 0000",
 bio: user?.bio ||"",
 photoURL: user?.photoURL ||"",
 measurements: user?.measurements || {
 chest:"", waist:"", hips:"", inseam:"", shoulder:"", sleeve:"",
},
 address: user?.address || {
 street:"", city: user?.city ||"Colombo", province:"", zip:""
},
 preferences: user?.preferences || {
 emailAlerts: true, smsAlerts: false
}
});
 setEditingPersonal(false);
 setEditingMeasurements(false);
 setEditingAddress(false);
 setEditingBio(false);
 setIsEditing(false);
};

 const handleSave = async () => {
 if (formData.phone && !isValidPhone(formData.phone)) {
 toast.error("Phone number must be exactly 10 digits.");
 return;
}
 try {
 setIsSaving(true);
 let newPhotoURL = formData.photoURL;

 // Upload to Firebase Storage if a new file was selected
 if (photoFile) {
 toast.loading("Uploading photo...", { id:"photo"});
 const storageRef = ref(storage,`users/${user.uid}/profile_${Date.now()}`);
 await uploadBytes(storageRef, photoFile);
 newPhotoURL = await getDownloadURL(storageRef);
 toast.success("Photo uploaded successfully", { id:"photo"});
}

 await updateProfile(user.uid, { ...formData, photoURL: newPhotoURL, city: formData.address.city});
 toast.success("Profile saved!");
 setEditingPersonal(false);
 setEditingMeasurements(false);
 setEditingAddress(false);
 setEditingBio(false);
 setIsEditing(false);
} catch (error) {
 console.error("Failed to update profile", error);
 toast.error("Failed to save profile");
} finally {
 setIsSaving(false);
}
};

 const handlePasswordReset = async () => {
 try {
 await sendPasswordResetEmail(auth, user.email);
 toast.success("Password reset email sent!");
} catch {
 toast.error("Failed to save profile");
}
};

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? This cannot be undone and will permanently delete your account.")) {
      try {
        await deleteAccount();
        await logout();
        navigate("/");
        toast.success("Account deleted");
      } catch (error) {
        console.error("Delete failed", error);
        toast.error("Failed to delete account. Please log in again to verify.");
      }
    }
  };

 // ==================== PROFILE VIEW ====================
 if (!isEditing) {
 return (
 <div>
 {/* Hero Banner */}
 <section className="cp-hero">
 <div className="cp-hero-inner">
 {/* Avatar */}
 <div className="cp-avatar-wrap">
 <div className="cp-avatar">
 {user?.photoURL ? (
 <img src={user.photoURL} alt={user.name ||"Profile"} />
 ) : (
 getInitial()
 )}
 </div>
 <div className="cp-camera-badge">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
 <circle cx="12" cy="13" r="3" />
 </svg>
 </div>
 </div>

 {/* User Info */}
 <div className="cp-hero-info">
 <div className="cp-hero-name-row">
 <h1 className="cp-hero-name">{user?.name ||"User"}</h1>
 <span className="cp-role-badge">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
 </svg>
 Customer
 </span>
 </div>

 <div className="cp-hero-contacts">
 {/* Email */}
 <div className="cp-hero-contact">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect width="20" height="16" x="2" y="4" rx="2" />
 <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
 </svg>
 <span>{user?.email ||"—"}</span>
 </div>

 {/* Phone */}
 <div className="cp-hero-contact">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
 </svg>
 <span>{user?.phone ||"+94 77 000 0000"}</span>
 </div>

 {/* City (from Address Book) */}
 <div className="cp-hero-contact">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
 <circle cx="12" cy="10" r="3" />
 </svg>
 <span>{user?.address?.city || user?.city ||"Colombo"}</span>
 </div>
 </div>
 </div>

 {/* Edit Profile Button */}
 <button className="cp-edit-btn" onClick={() => setIsEditing(true)}>
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 Edit Profile
 </button>
 </div>
 </section>

 {/* ---- Profile Dashboard Content ---- */}
 <div className="cp-edit-wrapper" style={{ paddingTop:"40px", maxWidth:"1000px"}}>

 <div style={{ display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:"28px"}}>

 {/* ====== LEFT COLUMN ====== */}
 <div style={{ display:"flex", flexDirection:"column", gap:"28px"}}>

 {/* About Me */}
 <div className="cp-card" style={{ marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
 About Me
 </h3>
 </div>
 <p style={{ color: user?.bio ?"#374151" :"#9ca3af", fontSize:"14.5px", lineHeight:"1.6"}}>
 {user?.bio ||"No bio added yet. Click'Edit Profile' to tell us about yourself."}
 </p>
 </div>

 {/* Recent Orders Widget */}
 <div className="cp-card" style={{ marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
 Recent Orders
 </h3>
 <Link to="/orders" style={{ display:"inline-flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#6366f1", fontWeight:"600", textDecoration:"none"}}>
 View All
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
 </Link>
 </div>
 <div className="cp-order-list">
 {mockOrders.map((order, idx) => (
 <div className="cp-order-item" key={idx} onClick={() => navigate("/orders")} style={{ cursor:"pointer", borderRadius:"8px", padding:"16px 8px", transition:"background 0.15s ease"}} onMouseEnter={(e) => e.currentTarget.style.background ="#f5f3ff"} onMouseLeave={(e) => e.currentTarget.style.background ="transparent"}>
 <div>
 <p style={{ fontSize:"14px", fontWeight:"700", color:"#1e1b4b"}}>{order.id}</p>
 <p style={{ fontSize:"12.5px", color:"#6b7280", marginTop:"2px"}}>{order.date}</p>
 </div>
 <div style={{ textAlign:"right"}}>
 <p style={{ fontSize:"14.5px", fontWeight:"600", color:"#1e1b4b", marginBottom:"6px"}}>{order.total}</p>
 <span className={`cp-status-pill ${order.class}`}>{order.status}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* ====== RIGHT COLUMN ====== */}
 <div style={{ display:"flex", flexDirection:"column", gap:"28px"}}>

 {/* Address Details */}
 <div className="cp-card" style={{ marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
 Address Details
 </h3>
 </div>
 <div style={{ display:"flex", flexDirection:"column", gap:"12px", fontSize:"14.5px", color:"#374151"}}>
 <div style={{ display:"flex", justifyContent:"space-between"}}>
 <span style={{ color:"#6b7280"}}>Street:</span>
 <span style={{ fontWeight:"500", textAlign:"right"}}>{user?.address?.street ||"—"}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between"}}>
 <span style={{ color:"#6b7280"}}>City:</span>
 <span style={{ fontWeight:"500", textAlign:"right"}}>{user?.address?.city || user?.city ||"—"}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between"}}>
 <span style={{ color:"#6b7280"}}>Province:</span>
 <span style={{ fontWeight:"500", textAlign:"right"}}>{user?.address?.province ||"—"}</span>
 </div>
 <div style={{ display:"flex", justifyContent:"space-between"}}>
 <span style={{ color:"#6b7280"}}>Postal / Zip:</span>
 <span style={{ fontWeight:"500", textAlign:"right"}}>{user?.address?.zip ||"—"}</span>
 </div>
 </div>
 </div>

 {/* Saved Tailors Widget */}
 <div className="cp-card" style={{ marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
 Saved Tailors
 </h3>
 </div>
 <div style={{ display:"flex", flexDirection:"column", gap:"16px"}}>
 {mockTailors.map((tailor, idx) => (
 <div key={idx} style={{ display:"flex", alignItems:"center", gap:"12px"}}>
 <div style={{ width:"40px", height:"40px", borderRadius:"8px", background:"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#4f46e5", fontWeight:"bold", fontSize:"16px"}}>
 {tailor.name.charAt(0)}
 </div>
 <div>
 <p style={{ fontSize:"14px", fontWeight:"600", color:"#1e1b4b"}}>{tailor.name}</p>
 <p style={{ fontSize:"12px", color:"#6b7280", marginTop:"2px"}}>★ {tailor.rating} • {tailor.specialty}</p>
 </div>
 </div>
 ))}
 </div>
 <button
 onClick={() => navigate('/tailors')}
 style={{ width:"100%", marginTop:"20px", padding:"8px 0", borderRadius:"8px", border:"1.5px solid #e0e7ff", background:"#f8fafc", color:"#4f46e5", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}
 >
 Browse Tailors
 </button>
 </div>

 {/* My Measurements */}
 <div className="cp-card" style={{ height:"100%", marginBottom:"0"}}>
 <div className="cp-section-header">
 <h3 className="cp-section-title">
 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
 Measurements
 </h3>
 </div>
 <div className="cp-fields-row" style={{ rowGap:"20px", gridTemplateColumns:"1fr 1fr"}}>
 {["chest","waist","hips","inseam","shoulder","sleeve"].map((field) => (
 <div className="cp-field" key={field}>
 <span className="cp-field-label">{field}</span>
 <span className="cp-field-value" style={{ fontSize:"15px"}}>
 {user?.measurements?.[field] ?`${user.measurements[field]} cm` :"—"}
 </span>
 </div>
 ))}
 </div>
 </div>

 </div>

 </div>

 </div>
 </div>
 );
}

 // ==================== EDIT PROFILE VIEW ====================
 return (
 <div className="cp-edit-wrapper">
 <h2 className="cp-edit-title">Edit Profile</h2>

 {/* ---- Photo Section ---- */}
 <div className="cp-card">
 <div className="cp-photo-section">
 <div className="cp-photo-avatar">
 {formData.photoURL ? (
 <img src={formData.photoURL} alt="Profile" />
 ) : (
 getInitial()
 )}
 </div>
 <div className="cp-photo-actions">
 <label className="cp-upload-btn" style={{ cursor:"pointer"}}>
 Upload new photo
 <input
 type="file"
 accept="image/png, image/jpeg"
 style={{ display:"none"}}
 onChange={handlePhotoUpload}
 />
 </label>
 <span className="cp-photo-hint">
 At least 800×800 px recommended.<br />
 JPG or PNG is allowed.
 </span>
 </div>
 </div>
 </div>

 {/* ---- Personal Info Section ---- */}
 <div className="cp-card">
 <div className="cp-section-header">
 <h3 className="cp-section-title">Personal Info</h3>
 <button
 className="cp-section-edit-btn"
 onClick={() => setEditingPersonal(!editingPersonal)}
 >
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 {editingPersonal ?"Cancel" :"Edit"}
 </button>
 </div>

 {editingPersonal ? (
 <div className="cp-fields-row">
 <div className="cp-field">
 <label className="cp-field-label">Full Name</label>
 <input
 className="cp-input-plain"
 type="text"
 name="name"
 value={formData.name}
 onChange={handleInputChange}
 />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">Email</label>
 <input
 className="cp-input-plain"
 type="email"
 name="email"
 value={formData.email}
 onChange={handleInputChange}
 />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">Phone</label>
 <input
 className="cp-input-plain"
 type="tel"
 name="phone"
 value={formData.phone}
 onChange={handleInputChange}
 placeholder="0771234567"
 maxLength={15}
 />
 {formData.phone && !isValidPhone(formData.phone) && (
 <span style={{ color:"#dc2626", fontSize:"12px", marginTop:"4px", display:"block"}}>
 Phone number must be exactly 10 digits.
 </span>
 )}
 </div>
 </div>
 ) : (
 <div className="cp-fields-row">
 <div className="cp-field">
 <span className="cp-field-label">Full Name</span>
 <span className="cp-field-value">{formData.name ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">Email</span>
 <span className="cp-field-value">{formData.email ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">Phone</span>
 <span className="cp-field-value">{formData.phone ||"—"}</span>
 </div>
 </div>
 )}
 </div>

 {/* ---- Body Measurements Section ---- */}
 <div className="cp-card">
 <div className="cp-section-header">
 <h3 className="cp-section-title">Body Measurements (cm)</h3>
 <button
 className="cp-section-edit-btn"
 onClick={() => setEditingMeasurements(!editingMeasurements)}
 >
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 {editingMeasurements ?"Cancel" :"Edit"}
 </button>
 </div>

 {editingMeasurements ? (
 <div className="cp-fields-row" style={{ rowGap:"16px"}}>
 {["chest","waist","hips","inseam","shoulder","sleeve"].map((field) => (
 <div className="cp-field" key={field}>
 <label className="cp-field-label">{field}</label>
 <input
 className="cp-input-plain"
 type="number"
 name={field}
 value={formData.measurements[field]}
 onChange={handleMeasurementChange}
 placeholder={`e.g. 90`}
 />
 </div>
 ))}
 </div>
 ) : (
 <div className="cp-fields-row" style={{ rowGap:"16px"}}>
 {["chest","waist","hips","inseam","shoulder","sleeve"].map((field) => (
 <div className="cp-field" key={field}>
 <span className="cp-field-label">{field}</span>
 <span className="cp-field-value">
 {formData.measurements[field] ?`${formData.measurements[field]} cm` :"Not set"}
 </span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ---- Address Book Section ---- */}
 <div className="cp-card">
 <div className="cp-section-header">
 <h3 className="cp-section-title">Address Book</h3>
 <button
 className="cp-section-edit-btn"
 onClick={() => setEditingAddress(!editingAddress)}
 >
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 {editingAddress ?"Cancel" :"Edit"}
 </button>
 </div>

 {editingAddress ? (
 <div className="cp-fields-row" style={{ rowGap:"16px", gridTemplateColumns:"1fr 1fr"}}>
 <div className="cp-field" style={{ gridColumn:"1 / -1"}}>
 <label className="cp-field-label">Street Address</label>
 <input className="cp-input-plain" type="text" name="street" value={formData.address.street} onChange={handleAddressChange} />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">City</label>
 <input className="cp-input-plain" type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">Province</label>
 <input className="cp-input-plain" type="text" name="province" value={formData.address.province} onChange={handleAddressChange} />
 </div>
 <div className="cp-field">
 <label className="cp-field-label">Postal / Zip Code</label>
 <input className="cp-input-plain" type="text" name="zip" value={formData.address.zip} onChange={handleAddressChange} />
 </div>
 </div>
 ) : (
 <div className="cp-fields-row" style={{ rowGap:"16px", gridTemplateColumns:"1fr 1fr"}}>
 <div className="cp-field" style={{ gridColumn:"1 / -1"}}>
 <span className="cp-field-label">Street Address</span>
 <span className="cp-field-value">{formData.address.street ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">City</span>
 <span className="cp-field-value">{formData.address.city ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">Province</span>
 <span className="cp-field-value">{formData.address.province ||"—"}</span>
 </div>
 <div className="cp-field">
 <span className="cp-field-label">Postal / Zip Code</span>
 <span className="cp-field-value">{formData.address.zip ||"—"}</span>
 </div>
 </div>
 )}
 </div>

 {/* ---- Preferences Section ---- */}
 <div className="cp-card">
 <h3 className="cp-section-title" style={{ marginBottom:"20px"}}>Preferences</h3>
 <div style={{ display:"flex", flexDirection:"column", gap:"16px"}}>

 {/* Email Toggle */}
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div>
 <p style={{ fontSize:"15px", fontWeight:"600", color:"#1e1b4b"}}>Email Notifications</p>
 <p style={{ fontSize:"13px", color:"#6b7280"}}>Receive order updates and promotions via email.</p>
 </div>
 <label style={{ display:"flex", alignItems:"center", cursor:"pointer"}}>
 <div style={{ position:"relative"}}>
 <input type="checkbox" className="sr-only" checked={formData.preferences.emailAlerts} onChange={() => handlePreferenceToggle("emailAlerts")} style={{ opacity: 0, width: 0, height: 0}} />
 <div style={{ width:"44px", height:"24px", background: formData.preferences.emailAlerts ?"#4f46e5" :"#d1d5db", borderRadius:"999px", transition:"background 0.3s"}}></div>
 <div style={{ position:"absolute", left: formData.preferences.emailAlerts ?"22px" :"2px", top:"2px", width:"20px", height:"20px", background:"white", borderRadius:"50%", transition:"left 0.3s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}></div>
 </div>
 </label>
 </div>

 <div style={{ height:"1px", background:"#f3f4f6"}}></div>

 {/* SMS Toggle */}
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div>
 <p style={{ fontSize:"15px", fontWeight:"600", color:"#1e1b4b"}}>SMS Alerts</p>
 <p style={{ fontSize:"13px", color:"#6b7280"}}>Get real-time text messages when orders are out for delivery.</p>
 </div>
 <label style={{ display:"flex", alignItems:"center", cursor:"pointer"}}>
 <div style={{ position:"relative"}}>
 <input type="checkbox" className="sr-only" checked={formData.preferences.smsAlerts} onChange={() => handlePreferenceToggle("smsAlerts")} style={{ opacity: 0, width: 0, height: 0}} />
 <div style={{ width:"44px", height:"24px", background: formData.preferences.smsAlerts ?"#4f46e5" :"#d1d5db", borderRadius:"999px", transition:"background 0.3s"}}></div>
 <div style={{ position:"absolute", left: formData.preferences.smsAlerts ?"22px" :"2px", top:"2px", width:"20px", height:"20px", background:"white", borderRadius:"50%", transition:"left 0.3s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}></div>
 </div>
 </label>
 </div>

 </div>
 </div>

 {/* ---- Security Section ---- */}
 <div className="cp-card">
 <h3 className="cp-section-title" style={{ marginBottom:"20px"}}>Account Security</h3>
 <div style={{ display:"flex", flexDirection:"column", gap:"16px"}}>
 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div>
 <p style={{ fontSize:"15px", fontWeight:"600", color:"#1e1b4b"}}>Password</p>
 <p style={{ fontSize:"13px", color:"#6b7280"}}>Send a secure reset link to your email ({user?.email}).</p>
 </div>
 <button className="cp-upload-btn" onClick={handlePasswordReset}>Change Password</button>
 </div>

 <div style={{ height:"1px", background:"#f3f4f6"}}></div>

 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center"}}>
 <div>
 <p style={{ fontSize:"15px", fontWeight:"600", color:"#dc2626"}}>Delete Account</p>
 <p style={{ fontSize:"13px", color:"#6b7280"}}>Permanently remove your account and data.</p>
 </div>
 <button
 onClick={handleDeleteAccount}
 style={{
 padding:"8px 16px",
 borderRadius:"8px",
 border:"1.5px solid #fca5a5",
 background:"#fff",
 color:"#dc2626",
 fontSize:"13.5px",
 fontWeight:"500",
 cursor:"pointer"
}}
 >
 Delete Account
 </button>
 </div>
 </div>
 </div>

 {/* ---- Bio Section ---- */}
 <div className="cp-card">
 <div className="cp-section-header">
 <h3 className="cp-section-title">Bio</h3>
 <button
 className="cp-section-edit-btn"
 onClick={() => setEditingBio(!editingBio)}
 >
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
 <path d="m15 5 4 4" />
 </svg>
 {editingBio ?"Cancel" :"Edit"}
 </button>
 </div>

 <textarea
 className="cp-textarea"
 name="bio"
 value={formData.bio}
 onChange={handleInputChange}
 placeholder="Tell us about yourself..."
 disabled={!editingBio}
 style={!editingBio ? { opacity: 0.7, cursor:"not-allowed"} : {}}
 />
 </div>

 {/* ---- Bottom Actions ---- */}
 <div className="cp-bottom-actions">
 <button className="cp-cancel-btn" onClick={handleCancel}>
 Cancel
 </button>
 <button
 className="cp-save-btn"
 onClick={handleSave}
 disabled={isSaving}
 style={isSaving ? { opacity: 0.7, cursor:"not-allowed"} : {}}
 >
 {isSaving ?"Saving..." :"Save Changes"}
 </button>
 </div>
 </div>
 );
}
