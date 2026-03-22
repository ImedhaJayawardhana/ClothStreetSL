// ─── Tailor API Helper ──────────────────────────────────────────────────────
// Functions to call tailor-specific backend endpoints.
// All functions require a Firebase auth token for authorization.

const BASE_URL = "http://localhost:8000";

/**
 * Fetch tailor dashboard data (stats, recent orders, recent reviews, profile).
 * GET /tailors/dashboard
 */
export const getTailorDashboard = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/tailors/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.error("getTailorDashboard error:", error);
    throw error;
  }
};

/**
 * Update the logged-in tailor's profile.
 * PUT /tailors/profile
 * @param {Object} data - Profile fields to update (name, bio, speciality, etc.)
 * @param {string} token - Firebase auth token
 */
export const updateTailorProfile = async (data, token) => {
  try {
    const res = await fetch(`${BASE_URL}/tailors/profile`, {
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
    console.error("updateTailorProfile error:", error);
    throw error;
  }
};

/**
 * Update the status of a specific order assigned to this tailor.
 * PATCH /tailors/orders/{orderId}/status
 * @param {string} orderId - The Firestore document ID of the order
 * @param {string} status - New status (pending, in_progress, completed, cancelled)
 * @param {string} token - Firebase auth token
 */
export const updateTailorOrderStatus = async (orderId, status, token) => {
  try {
    const res = await fetch(`${BASE_URL}/tailors/orders/${orderId}/status`, {
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
    console.error("updateTailorOrderStatus error:", error);
    throw error;
  }
};
