import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("pageturn_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      return Promise.reject(new Error(
        "Can't reach the server. Check that the backend is running and API_BASE_URL is correct."
      ));
    }

    const status = err.response.status;
    const isAuthEndpoint = err.config?.url?.includes("/auth/login") || err.config?.url?.includes("/auth/register");
    if (status === 401 && !isAuthEndpoint && onUnauthorized) {
      onUnauthorized();
    }

    const message = err.response.data?.error || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const registerUser = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const loginUser = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const fetchMe = () => api.get("/auth/me").then((r) => r.data);
export const updateProfile = (payload) => api.put("/auth/profile", payload).then((r) => r.data);

export const fetchBooks = (params = {}) => api.get("/books", { params }).then((r) => r.data);
export const fetchBook = (id) => api.get(`/books/${id}`).then((r) => r.data);
export const fetchGenres = () => api.get("/books/genres").then((r) => r.data);

export const fetchReviews = (bookId) => api.get(`/books/${bookId}/reviews`).then((r) => r.data);
export const submitReview = (bookId, payload) => api.post(`/books/${bookId}/reviews`, payload).then((r) => r.data);
export const fetchFavorites = () => api.get("/books/favorites").then((r) => r.data);
export const addFavorite = (bookId) => api.post(`/books/${bookId}/favorite`).then((r) => r.data);
export const removeFavorite = (bookId) => api.delete(`/books/${bookId}/favorite`).then((r) => r.data);

export const fetchCart = (type = "purchase") => api.get("/cart", { params: { type } }).then((r) => r.data);
export const addToCart = (payload) => api.post("/cart/items", payload).then((r) => r.data);
export const removeFromCart = (itemId) => api.delete(`/cart/items/${itemId}`).then((r) => r.data);
export const updateCartItem = (itemId, payload) => api.patch(`/cart/items/${itemId}`, payload).then((r) => r.data);

export const checkout = (payload) => api.post("/orders/checkout", payload).then((r) => r.data);
export const fetchOrders = () => api.get("/orders").then((r) => r.data);
export const fetchOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);

export const submitLendingRequests = () => api.post("/lending/requests").then((r) => r.data);
export const fetchMyLendingRequests = (status) =>
  api.get("/lending/requests", { params: status ? { status } : {} }).then((r) => r.data);
export const fetchBorrowedBooks = () => api.get("/lending/borrowed").then((r) => r.data);
export const returnBook = (requestId) => api.post(`/lending/requests/${requestId}/return`).then((r) => r.data);

export const adminFetchBooks = () => api.get("/admin/books").then((r) => r.data);
export const adminCreateBook = (payload) => api.post("/admin/books", payload).then((r) => r.data);
export const adminUpdateBook = (id, payload) => api.put(`/admin/books/${id}`, payload).then((r) => r.data);
export const adminDeleteBook = (id) => api.delete(`/admin/books/${id}`).then((r) => r.data);
export const adminFetchLendingRequests = (status = "pending") =>
  api.get("/admin/lending-requests", { params: { status } }).then((r) => r.data);
export const adminApproveLending = (id) => api.post(`/admin/lending-requests/${id}/approve`).then((r) => r.data);
export const adminRejectLending = (id, notes) =>
  api.post(`/admin/lending-requests/${id}/reject`, { notes }).then((r) => r.data);
export const adminFetchOrders = (status) => api.get("/admin/orders", { params: status ? { status } : {} }).then((r) => r.data);
export const adminApproveOrder = (id) => api.post(`/admin/orders/${id}/approve`).then((r) => r.data);
export const adminRejectOrder = (id) => api.post(`/admin/orders/${id}/reject`).then((r) => r.data);
export const adminAdvanceOrder = (id) => api.post(`/admin/orders/${id}/advance`).then((r) => r.data);
export const adminFetchDashboard = () => api.get("/admin/dashboard").then((r) => r.data);

export default api;

export const mpesaStkPush = (payload) => api.post("/mpesa/stkpush", payload).then((r) => r.data);
