const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '') || 'http://localhost:5000';
const API_BASE_URL = `${baseUrl}/api`;

const api = {
  // Auth
  register: (userData) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }).then(res => res.json()),

  login: (userData) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }).then(res => res.json()),

  getProfile: (token) => fetch(`${API_BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()),

  // Products
  getProducts: () => fetch(`${API_BASE_URL}/products`).then(res => res.json()),
  getProductsByCategory: (category) => fetch(`${API_BASE_URL}/products/category/${category}`).then(res => res.json()),
  getProduct: (id) => fetch(`${API_BASE_URL}/products/${id}`).then(res => res.json()),

  // Cart
  getCart: (token) => fetch(`${API_BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()),

  addToCart: (productId, quantity, token) => fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  }).then(res => res.json()),

  updateCartItem: (productId, quantity, token) => fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  }).then(res => res.json()),

  removeFromCart: (productId, token) => fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()),

  clearCart: (token) => fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()),

  // Orders
  getOrders: (token) => fetch(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()),

  createOrder: (orderData, token) => fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  }).then(res => res.json()),

  // Admin Products
  createProduct: (productData, token) => fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  }).then(res => res.json()),

  updateProduct: (id, productData, token) => fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  }).then(res => res.json()),

  deleteProduct: (id, token) => fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json()),
};

export default api;