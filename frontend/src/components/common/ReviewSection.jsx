import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { submitReview, getReviews, deleteReview, getReviewSummary } from "../../api/reviews";
import { Link } from "react-router-dom";

// ─── Style tokens matching ClothStreetSL theme ─────────────
const C = {
    bgCardAlt: "var(--clr-surface-2, #f8fafc)",
    border: "var(--clr-border-2, #e2e8f0)",
    purple: "var(--clr-primary, #7c3aed)",
    purpleDark: "#1e40af",
    purpleMuted: "var(--clr-glow, #f3e8ff)",
    white: "#ffffff",
    text: "var(--clr-text, #0f172a)",
    textMuted: "var(--clr-text-2, #64748b)",
    yellow: "#f59e0b",
    redBg: "#fef2f2",
    redText: "#ef4444",
};

// ─── Star Icon Helpers ─────────────────────────────────────
function StarIcon({ filled = true, size = 16, onClick, onMouseEnter, onMouseLeave, style }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? C.yellow : "none"}
            stroke={filled ? C.yellow : "#cbd5e1"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ cursor: onClick ? "pointer" : "default", transition: "all 0.2s", ...style }}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function StarsDisplay({ rating, size = 16 }) {
    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= Math.round(rating)} size={size} />
            ))}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────
export default function ReviewSection({ targetType, targetId, ownerId }) {
    const { user: authUser } = useAuth();
    
    // Check if the current user is the owner of this profile/product
    const isOwner = authUser && (ownerId ? authUser.uid === ownerId : authUser.uid === targetId);

    // State
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    // Initial fetch
    useEffect(() => {
        if (targetId) fetchData();
        // eslint-disable-next-line
    }, [targetId, authUser]);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [reviewsData, summaryData] = await Promise.all([
                getReviews(targetType, targetId),
                getReviewSummary(targetType, targetId)
            ]);

            // Sort by newest first
            const sortedReviews = reviewsData.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setReviews(sortedReviews);
            setSummary(summaryData);

            // Check if current user already left a review
            if (authUser) {
                const userReview = sortedReviews.find(r => r.customerId === authUser.uid);
                setHasReviewed(!!userReview);
                if (userReview) setShowForm(false);
            }
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            setError("Failed to load reviews. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            alert("Please select a rating from 1 to 5 stars.");
            return;
        }

        setSubmitting(true);
        setError("");
        try {
            await submitReview(targetType, targetId, rating, comment);
            
            // Reset form and refresh data
            setRating(0);
            setComment("");
            setShowForm(false);
            await fetchData();
            
        } catch (err) {
            console.error("Submit error:", err);
            setError(err.message || "Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await deleteReview(reviewId);
            await fetchData(); // Refresh data
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete review.");
        }
    };

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) {
            distribution[r.rating]++;
        }
    });

    if (loading) {
        return (
            <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", border: `3px solid ${C.purpleMuted}`, borderTopColor: C.purple, animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", fontFamily: "inherit" }}>
            
            {/* Header / Summary Box */}
            <div style={{ display: "flex", gap: "32px", alignItems: "center", background: C.bgCardAlt, padding: "24px", borderRadius: "16px", border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
                
                {/* Average Display */}
                <div style={{ textAlign: "center", minWidth: "120px" }}>
                    <div style={{ fontSize: "3rem", fontWeight: 800, color: C.text, lineHeight: 1 }}>
                        {summary.averageRating.toFixed(1)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                        <StarsDisplay rating={summary.averageRating} size={20} />
                    </div>
                    <div style={{ fontSize: "0.8rem", color: C.textMuted }}>
                        Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Distribution Bars */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", minWidth: "200px" }}>
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = distribution[star];
                        const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
                        return (
                            <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8rem", color: C.textMuted }}>
                                <span style={{ width: "12px" }}>{star}</span>
                                <span style={{ color: C.yellow }}>★</span>
                                <div style={{ flex: 1, height: "6px", background: C.border, borderRadius: "3px", overflow: "hidden" }}>
                                    <div style={{ width: `${pct}%`, height: "100%", background: C.yellow, borderRadius: "3px", transition: "width 0.5s ease" }} />
                                </div>
                                <span style={{ width: "24px", textAlign: "right" }}>{Math.round(pct)}%</span>
                            </div>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    {!authUser ? (
                        <div>
                            <p style={{ fontSize: "0.85rem", color: C.textMuted, margin: "0 0 8px" }}>Sign in to leave a review</p>
                            <Link to="/login" style={{ padding: "10px 20px", borderRadius: "8px", background: C.text, color: C.white, textDecoration: "none", fontWeight: 600, display: "inline-block", fontSize: "0.9rem" }}>
                                Login
                            </Link>
                        </div>
                    ) : isOwner ? (
                        <div style={{ background: C.bgCardAlt, color: C.textMuted, padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, border: `1px dashed ${C.border}` }}>
                            You cannot review your own {targetType}
                        </div>
                    ) : hasReviewed ? (
                        <div style={{ background: C.purpleMuted, color: C.purpleDark, padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}>
                            ✓ You have reviewed this {targetType}
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            style={{ padding: "10px 20px", borderRadius: "8px", background: showForm ? "transparent" : C.text, border: showForm ? `1px solid ${C.border}` : "none", color: showForm ? C.text : C.white, fontWeight: 600, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }}
                        >
                            {showForm ? "Cancel Review" : "Write a Review"}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div style={{ padding: "12px 16px", background: C.redBg, color: C.redText, borderRadius: "8px", fontSize: "0.9rem", fontWeight: 500 }}>
                    {error}
                </div>
            )}

            {/* Review Form */}
            {showForm && authUser && !hasReviewed && !isOwner && (
                <div style={{ background: C.bgCardAlt, padding: "24px", borderRadius: "16px", border: `1px solid ${C.border}`, animation: "fadeIn 0.3s ease" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: C.text }}>Rate and review this {targetType}</h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        
                        {/* Interactive Star Picker */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: C.text }}>Your Rating <span style={{color: C.redText}}>*</span></label>
                            <div style={{ display: "flex", gap: "4px" }} onMouseLeave={() => setHoverRating(0)}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon 
                                        key={star} 
                                        size={32}
                                        filled={star <= (hoverRating || rating)}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        style={{ transform: hoverRating === star ? "scale(1.1)" : "scale(1)" }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Comment Box */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: C.text }}>Your Review (Optional)</label>
                            <textarea 
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="What did you like or dislike? How was the quality / service?" 
                                rows="4"
                                disabled={submitting}
                                style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: `1px solid ${C.border}`, fontSize: "0.95rem", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} 
                            />
                        </div>

                        {/* Submit Row */}
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
                            <span style={{ fontSize: "0.8rem", color: C.textMuted }}>Posting publicly as <strong>{authUser.displayName || "Anonymous"}</strong></span>
                            <button 
                                onClick={handleSubmitReview}
                                disabled={submitting || rating === 0}
                                style={{ padding: "10px 24px", borderRadius: "8px", background: rating === 0 ? "#cbd5e1" : C.purple, color: C.white, border: "none", fontWeight: 700, cursor: rating === 0 ? "not-allowed" : "pointer", boxShadow: rating > 0 ? "0 2px 8px rgba(124,58,237,0.3)" : "none", transition: "all 0.2s" }}
                            >
                                {submitting ? "Submitting..." : "Publish Review"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", margin: "8px 0", color: C.text }}>Customer Reviews</h3>
                
                {reviews.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", background: C.bgCardAlt, borderRadius: "12px", border: `1px dashed ${C.border}` }}>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.95rem" }}>No reviews yet. Be the first to review this {targetType}!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} style={{ border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px", background: C.white }}>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem" }}>
                                        {review.customerName ? review.customerName.charAt(0).toUpperCase() : "A"}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: "0.95rem", color: C.text }}>{review.customerName || "Anonymous User"}</div>
                                        <div style={{ fontSize: "0.75rem", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            Verified Customer
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "0.8rem", color: C.textMuted, marginBottom: "4px" }}>
                                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                    {authUser && authUser.uid === review.customerId && (
                                        <button 
                                            onClick={() => handleDeleteReview(review.id)}
                                            style={{ background: "none", border: "none", color: C.redText, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0 }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <StarsDisplay rating={review.rating} />
                            
                            {review.comment && (
                                <p style={{ margin: "12px 0 0", fontSize: "0.95rem", color: C.text, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}
