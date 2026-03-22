import { auth } from "../firebase/firebase";

const BASE_URL = "http://localhost:8000";

// ── Get Firebase token from logged-in user ──────────────
const getToken = async () => {
    if (!auth.currentUser) return null;
    try {
        return await auth.currentUser.getIdToken();
    } catch (error) {
        console.error("Error getting token:", error);
        return null;
    }
};

// ── Submit a new review ─────────────────────────────────
export const submitReview = async (targetType, targetId, rating, comment) => {
    try {
        const token = await getToken();
        if (!token) throw new Error("You must be logged in to review");

        const res = await fetch(`${BASE_URL}/reviews/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ targetType, targetId, rating, comment })
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (error) {
        console.error("submitReview error:", error);
        throw error;
    }
};

// ── Get all reviews for a product / tailor / designer ───
export const getReviews = async (targetType, targetId) => {
    try {
        const res = await fetch(`${BASE_URL}/reviews/${targetType}/${targetId}`);
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (error) {
        console.error("getReviews error:", error);
        throw error;
    }
};

// ── Delete your own review ──────────────────────────────
export const deleteReview = async (reviewId) => {
    try {
        const token = await getToken();
        if (!token) throw new Error("You must be logged in to delete a review");
        
        const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (error) {
        console.error("deleteReview error:", error);
        throw error;
    }
};

// ── Get average rating summary ──────────────────────────
export const getReviewSummary = async (targetType, targetId) => {
    try {
        const res = await fetch(`${BASE_URL}/reviews/summary/${targetType}/${targetId}`);
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (error) {
        console.error("getReviewSummary error:", error);
        throw error;
    }
};

// ── Supplier gets notifications about their products ────
export const getSupplierNotifications = async () => {
    try {
        const token = await getToken();
        if (!token) throw new Error("You must be logged in");

        const res = await fetch(`${BASE_URL}/reviews/supplier/notifications`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (error) {
        console.error("getSupplierNotifications error:", error);
        throw error;
    }
};