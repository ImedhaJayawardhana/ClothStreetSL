/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/firebase";
import { registerUser, createTailor, createDesigner, deleteAccount as deleteAccountApi } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function register(name, email, password, role) {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Save to users collection
    await setDoc(doc(db, "users", result.user.uid), {
      uid: result.user.uid,
      name,
      email,
      role,
      createdAt: new Date()
    });

    // Get token for backend calls
    const token = await result.user.getIdToken();

    // Register in FastAPI backend
    await registerUser({ email, name, role }, token);

    // Auto-create role profile in backend
    if (role === "tailor") {
      await createTailor({
        name,
        skills: [],
        location: "Sri Lanka",
        price_range: "Contact for pricing",
        availability: true,
      });
    } else if (role === "designer") {
      await createDesigner({
        name,
        style: "General",
        price_range: "Contact for pricing",
      });
    }

    // New accounts should start with an empty cart — discard any guest cart
    // so CartContext doesn't merge it into the new account's cart.
    localStorage.removeItem("clothstreet_cart");

    return result;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle(role = "customer") {
    const result = await signInWithPopup(auth, googleProvider);
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        role,
        createdAt: new Date()
      });

      // Register in FastAPI backend
      const token = await result.user.getIdToken();
      await registerUser({ email: result.user.email, name: result.user.displayName, role }, token);

      if (role === "tailor") {
        await createTailor({
          name: result.user.displayName,
          skills: [],
          location: "Sri Lanka",
          price_range: "Contact for pricing",
          availability: true,
        });
      } else if (role === "designer") {
        await createDesigner({
          name: result.user.displayName,
          style: "General",
          price_range: "Contact for pricing",
        });
      }
    }
    return result;
  }

  async function updateProfile(uid, data) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });

    // Update local state immediately without waiting for onAuthStateChanged
    setUser(prev => ({
      ...prev,
      ...data
    }));
  }

  async function logout() {
    // Clear localStorage cart keys before signing out
    const currentUser = auth.currentUser;
    if (currentUser) {
      localStorage.removeItem(`clothstreet_cart_${currentUser.uid}`);
    }
    localStorage.removeItem("clothstreet_cart");
    return signOut(auth);
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function deleteUserAccount(password, reason, feedback) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user logged in");

    // Re-authenticate with password
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);

    // Call backend to backup + delete
    await deleteAccountApi({ reason, feedback });

    // Clear local data
    localStorage.removeItem("clothstreet_cart");

    // Sign out
    await signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() });
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout, updateProfile, resetPassword, deleteUserAccount }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}