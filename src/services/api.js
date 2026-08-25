import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - change this to your backend IP/port
// For emulator: http://10.0.2.2:5000
// For physical device: http://YOUR_IP:5000
const BASE_URL = 'http://10.0.2.2:5000/api';

// Helper to get auth token from storage
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Generic fetch wrapper with auth
const apiRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

// ===== AUTH ENDPOINTS (Member 1) =====
export const authAPI = {
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  getProfile: () => 
    apiRequest('/auth/me'),
  
  updateProfile: (userData) => 
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// ===== BOOKS ENDPOINTS (Member 2) =====
export const booksAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/books?${queryString}`);
  },
  
  getOne: (bookId) => 
    apiRequest(`/books/${bookId}`),
  
  search: (query) => 
    apiRequest(`/books?q=${encodeURIComponent(query)}`),
  
  filter: (filters) => {
    const queryString = new URLSearchParams(filters).toString();
    return apiRequest(`/books?${queryString}`);
  },
};

// ===== CART ENDPOINTS (Member 3) =====
export const cartAPI = {
  getCart: () => 
    apiRequest('/cart'),
  
  addItem: (bookId, quantity = 1) => 
    apiRequest('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId, quantity }),
    }),
  
  removeItem: (itemId) => 
    apiRequest(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),
  
  updateQuantity: (itemId, quantity) => 
    apiRequest(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  
  clearCart: () => 
    apiRequest('/cart', {
      method: 'DELETE',
    }),
};

// ===== ORDERS ENDPOINTS (Member 3) =====
export const ordersAPI = {
  checkout: (orderData) => 
    apiRequest('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  getOrders: () => 
    apiRequest('/orders'),
  
  getOrder: (orderId) => 
    apiRequest(`/orders/${orderId}`),
};

// ===== LENDING ENDPOINTS (Member 3) =====
export const lendingAPI = {
  getRequests: () => 
    apiRequest('/lending/requests'),
  
  createRequest: (bookIds) => 
    apiRequest('/lending/requests', {
      method: 'POST',
      body: JSON.stringify({ book_ids: bookIds }),
    }),
  
  getBorrowed: () => 
    apiRequest('/lending/borrowed'),
  
  returnBook: (requestId) => 
    apiRequest(`/lending/requests/${requestId}/return`, {
      method: 'POST',
    }),
};

// ===== ADMIN ENDPOINTS (Member 4) =====
export const adminAPI = {
  // Book Management
  createBook: (bookData) => 
    apiRequest('/admin/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    }),
  
  updateBook: (bookId, bookData) => 
    apiRequest(`/admin/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    }),
  
  deleteBook: (bookId) => 
    apiRequest(`/admin/books/${bookId}`, {
      method: 'DELETE',
    }),
  
  // Order Management
  approveOrder: (orderId) => 
    apiRequest(`/admin/orders/${orderId}/approve`, {
      method: 'POST',
    }),
  
  rejectOrder: (orderId) => 
    apiRequest(`/admin/orders/${orderId}/reject`, {
      method: 'POST',
    }),
  
  // Lending Management
  getLendingRequests: () => 
    apiRequest('/admin/lending-requests'),
  
  approveLending: (requestId) => 
    apiRequest(`/admin/lending-requests/${requestId}/approve`, {
      method: 'POST',
    }),
  
  rejectLending: (requestId) => 
    apiRequest(`/admin/lending-requests/${requestId}/reject`, {
      method: 'POST',
    }),
  
  // Dashboard
  getDashboard: () => 
    apiRequest('/admin/dashboard'),
};

// ===== GENERAL PURPOSE =====
export default {
  auth: authAPI,
  books: booksAPI,
  cart: cartAPI,
  orders: ordersAPI,
  lending: lendingAPI,
  admin: adminAPI,
};
