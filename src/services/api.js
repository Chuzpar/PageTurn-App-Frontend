import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * API Base URL Configuration
 * Change this to match your backend URL
 * - Android Emulator: http://10.0.2.2:5000/api
 * - iOS Simulator: http://localhost:5001/api
 * - Physical Device: http://YOUR_IP:5000/api
 */
export const API_BASE_URL = "http://localhost:5001/api";

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Request Interceptor
 * Attaches JWT token to every outgoing request
 */
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("pageturn_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor
 * Normalizes error messages for consistent error handling
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.error || err?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ============================================================
// AUTH ENDPOINTS (Sprint 1 - Member 1)
// ============================================================

/**
 * Register a new user
 */
export const registerUser = (payload) => 
  api.post("/auth/register", payload).then((r) => r.data);

/**
 * Login a user
 */
export const loginUser = (payload) => 
  api.post("/auth/login", payload).then((r) => r.data);

/**
 * Get current user profile
 */
export const fetchMe = () => 
  api.get("/auth/me").then((r) => r.data);

/**
 * Update user profile
 */
export const updateProfile = (payload) => 
  api.put("/auth/profile", payload).then((r) => r.data);

// ============================================================
// BOOKS ENDPOINTS (Sprint 2 - Member 2)
// ============================================================

/**
 * Fetch all books with optional search/filter parameters
 */
export const fetchBooks = (params = {}) => 
  api.get("/books", { params }).then((r) => r.data);

/**
 * Fetch a single book by ID
 */
export const fetchBook = (id) => 
  api.get(`/books/${id}`).then((r) => r.data);

/**
 * Fetch all available genres
 */
export const fetchGenres = () => 
  api.get("/books/genres").then((r) => r.data);

// ============================================================
// CART ENDPOINTS (Sprint 3 & 4 - Member 3)
// ============================================================

/**
 * Fetch cart items for a specific cart type
 */
export const fetchCart = (type = "purchase") => 
  api.get("/cart", { params: { type } }).then((r) => r.data);

/**
 * Add item to cart
 */
export const addToCart = (payload) => 
  api.post("/cart/items", payload).then((r) => r.data);

/**
 * Remove item from cart
 */
export const removeFromCart = (itemId) => 
  api.delete(`/cart/items/${itemId}`).then((r) => r.data);

/**
 * Update cart item quantity
 */
export const updateCartItem = (itemId, payload) => 
  api.patch(`/cart/items/${itemId}`, payload).then((r) => r.data);

// ============================================================
// ORDERS / CHECKOUT ENDPOINTS (Sprint 3 - Member 3)
// ============================================================

/**
 * Place an order
 */
export const checkout = (payload) => 
  api.post("/orders/checkout", payload).then((r) => r.data);

/**
 * Fetch order history
 */
export const fetchOrders = () => 
  api.get("/orders").then((r) => r.data);

/**
 * Fetch a single order by ID
 */
export const fetchOrder = (id) => 
  api.get(`/orders/${id}`).then((r) => r.data);

// ============================================================
// LENDING ENDPOINTS (Sprint 4 - Member 3)
// ============================================================

/**
 * Submit lending requests from cart
 */
export const submitLendingRequests = () => 
  api.post("/lending/requests").then((r) => r.data);

/**
 * Fetch user's lending requests
 */
export const fetchMyLendingRequests = (status) =>
  api.get("/lending/requests", { params: status ? { status } : {} })
    .then((r) => r.data);

/**
 * Fetch borrowed books
 */
export const fetchBorrowedBooks = () => 
  api.get("/lending/borrowed").then((r) => r.data);

/**
 * Return a borrowed book
 */
export const returnBook = (requestId) => 
  api.post(`/lending/requests/${requestId}/return`).then((r) => r.data);

// ============================================================
// ADMIN ENDPOINTS (Sprint 2, 4, 5 - Member 4)
// ============================================================

/**
 * Fetch all books (admin view)
 */
export const adminFetchBooks = () => 
  api.get("/admin/books").then((r) => r.data);

/**
 * Create a new book (admin)
 */
export const adminCreateBook = (payload) => 
  api.post("/admin/books", payload).then((r) => r.data);

/**
 * Update a book (admin)
 */
export const adminUpdateBook = (id, payload) => 
  api.put(`/admin/books/${id}`, payload).then((r) => r.data);

/**
 * Delete a book (admin)
 */
export const adminDeleteBook = (id) => 
  api.delete(`/admin/books/${id}`).then((r) => r.data);

/**
 * Fetch lending requests (admin)
 */
export const adminFetchLendingRequests = (status = "pending") =>
  api.get("/admin/lending-requests", { params: { status } })
    .then((r) => r.data);

/**
 * Approve a lending request (admin)
 */
export const adminApproveLending = (id) => 
  api.post(`/admin/lending-requests/${id}/approve`).then((r) => r.data);

/**
 * Reject a lending request (admin)
 */
export const adminRejectLending = (id, notes) =>
  api.post(`/admin/lending-requests/${id}/reject`, { notes })
    .then((r) => r.data);

/**
 * Fetch all orders (admin)
 */
export const adminFetchOrders = (status) => 
  api.get("/admin/orders", { params: status ? { status } : {} })
    .then((r) => r.data);

/**
 * Approve an order (admin)
 */
export const adminApproveOrder = (id) => 
  api.post(`/admin/orders/${id}/approve`).then((r) => r.data);

/**
 * Reject an order (admin)
 */
export const adminRejectOrder = (id) => 
  api.post(`/admin/orders/${id}/reject`).then((r) => r.data);

/**
 * Advance order status (admin)
 */
export const adminAdvanceOrder = (id) => 
  api.post(`/admin/orders/${id}/advance`).then((r) => r.data);

/**
 * Fetch admin dashboard data
 */
export const adminFetchDashboard = () => 
  api.get("/admin/dashboard").then((r) => r.data);

export default api;
