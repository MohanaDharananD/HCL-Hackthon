import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('retail_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Product APIs
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getByCategory: (cat) => api.get(`/products/category/${cat}`),
};

// Order APIs
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  getMyOrders: () => api.get('/orders/my'),
  create: (data) => api.post('/orders', data),
  checkout: () => api.post('/orders/checkout'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  updateQuantity: (productId, quantity) => api.put('/cart/update', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

export default api;
