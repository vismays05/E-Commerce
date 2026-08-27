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

  // Get single product detail
  async getProductById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.error('Fetch Product ID Error:', err);
      return null;
    }
  },

  // Create Product (Admin / Seller)
  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (err) {
      console.error('Create Product API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  // Update Product
  async updateProduct(id, updates) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (err) {
      console.error('Update Product API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  // Delete Product
  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      console.error('Delete Product API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  // Fetch Categories
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Categories API Error:', err);
      return null;
    }
  },

  // Fetch Hero Banners
  async getBanners() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/banners`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Banners API Error:', err);
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

  // Get User Profile
  async getUserProfile(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile/${userId}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.error('Fetch Profile API Error:', err);
      return null;
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
  },

  // Fetch Single Order by ID
  async getOrderById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.error('Get Order ID API Error:', err);
      return null;
    }
  },

  // Update Order Status
  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      console.error('Update Order Status API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  // Retrieve persistent Cart
  async getCart(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${userId}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Cart API Error:', err);
      return null;
    }
  },

  // Save / Sync persistent Cart
  async syncCart(userId, items) {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      return await res.json();
    } catch (err) {
      console.error('Sync Cart API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  },

  // Get Search Suggestions
  async getSuggestions(query) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Search suggestions API error:', err);
      return [];
    }
  },

  // Get Wishlist
  async getWishlist(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/wishlist/${userId}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Wishlist API error:', err);
      return null;
    }
  },

  // Sync Wishlist
  async syncWishlist(userId, items) {
    try {
      const res = await fetch(`${API_BASE_URL}/wishlist/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      return await res.json();
    } catch (err) {
      console.error('Sync Wishlist API Error:', err);
      return { success: false, message: 'Server connection failed.' };
    }
  }
};

