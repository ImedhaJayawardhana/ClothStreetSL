import axios from "axios";
import { getAuth } from "firebase/auth";

const BASE_URL = "http://localhost:8000";

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
});

// Automatically attach Firebase token to every request
api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Users ───────────────────────────────────────────
// replace the registerUser line in api.js with this
export const registerUser = (data, token) =>
    api.post("/users/register", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
export const getCurrentUser = () => api.get("/users/me");
export const deleteAccount = ({ reason, feedback }) =>
    api.delete("/users/me", { data: { reason, feedback } });

// ─── Tailors ─────────────────────────────────────────
export const createTailor = (data) => api.post("/tailors", data);
export const listTailors = () => api.get("/tailors");
export const getTailor = (id) => api.get(`/tailors/${id}`);
export const updateTailor = (id, data) => api.patch(`/tailors/${id}`, data);

// ─── Designers ───────────────────────────────────────
export const createDesigner = (data) => api.post("/designers", data);
export const listDesigners = () => api.get("/designers");
export const getDesigner = (id) => api.get(`/designers/${id}`);
export const updateDesigner = (id, data) => api.patch(`/designers/${id}`, data);

// ─── Fabrics ─────────────────────────────────────────
export const createFabric = (data) => api.post("/fabrics", data);
export const listFabrics = () => api.get("/fabrics");
export const getFabric = (id) => api.get(`/fabrics/${id}`);
export const getFabricById = getFabric; // Alias used by ProductDetail.jsx
export const updateFabric = (id, data) => api.patch(`/fabrics/${id}`, data);
export const deleteFabric = (id) => api.delete(`/fabrics/${id}`);

// ─── Quotations ──────────────────────────────────────
export const createQuotation = (data) => api.post("/quotations", data);
export const getMyQuotations = () => api.get("/quotations/my");
export const getQuotationInbox = () => api.get("/quotations/inbox");
export const getQuotationOffers = () => api.get("/quotations/offers");
export const getQuotation = (id) => api.get(`/quotations/${id}`);
export const updateQuotation = (id, data) =>
    api.patch(`/quotations/${id}`, data);
export const updateQuotationStatus = (id, status) =>
    api.patch(`/quotations/${id}`, { status });
export const updateQuotationDeliverables = (quotationId, files, message = "") => api.patch(`/quotations/${quotationId}/deliver`, { files, message });
export const deleteQuotation = (id) => api.delete(`/quotations/${id}`);

// ─── Cart ────────────────────────────────────────────
export const fetchCart = () => api.get("/cart");
export const saveCart = (items) => api.put("/cart", { items });
export const clearCartBackend = () => api.delete("/cart");
export const deleteCartItem = (customerId, providerId) =>
    api.delete(`/cart/${customerId}/item/${providerId}`);

// ─── Orders ──────────────────────────────────────────
export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my");
export const getOrder = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (id) => api.delete(`/orders/${id}`);

// ─── Storage ─────────────────────────────────────────
export const uploadImage = (file, folder = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/storage/upload?folder=${folder}`, formData);
};
export const deleteImage = (filename) =>
    api.delete(`/storage/delete?filename=${filename}`);

// ─── AI Chat ─────────────────────────────────────────
export const sendChatMessage = (prompt, userId) =>
    api.post("/ai/chat", { prompt, userId });