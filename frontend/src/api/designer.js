// ─── Designer API Helper ────────────────────────────────────────────────────
// Functions to call designer-specific backend endpoints.
// All functions require a Firebase auth token for authorization.

const BASE_URL = "http://localhost:8000";

/**
 * Fetch designer dashboard data (stats, recent projects, recent reviews, profile).
 * GET /designers/dashboard
 */
export const getDesignerDashboard = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/designers/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.error("getDesignerDashboard error:", error);
    throw error;
  }
};

/**
 * Update the logged-in designer's profile.
 * PUT /designers/profile
 * @param {Object} data - Profile fields to update (name, bio, speciality, etc.)
 * @param {string} token - Firebase auth token
 */
export const updateDesignerProfile = async (data, token) => {
  try {
    const res = await fetch(`${BASE_URL}/designers/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.error("updateDesignerProfile error:", error);
    throw error;
  }
};

/**
 * Update the status of a specific project/order assigned to this designer.
 * PATCH /designers/orders/{orderId}/status
 * @param {string} orderId - The Firestore document ID of the order
 * @param {string} status - New status (pending, in_progress, completed, cancelled)
 * @param {string} token - Firebase auth token
 */
export const updateDesignerProjectStatus = async (orderId, status, token) => {
  try {
    const res = await fetch(`${BASE_URL}/designers/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.error("updateDesignerProjectStatus error:", error);
    throw error;
  }
};
