const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Fetch Products with filter parameters
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/products?${query}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Backend API unreachable, using local data fallback.', err);
      return null;
    }
  },

  // Register User
  async register(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (err) {
      console.error('Registration API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  // Login User
  async login(credentials) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await res.json();
    } catch (err) {
      console.error('Login API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  // Place Order
  async placeOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (err) {
      console.error('Order API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  // Fetch Order History
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Orders API Error:', err);
      return null;
    }
  }
};
