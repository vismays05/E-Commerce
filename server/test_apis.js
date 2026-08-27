import http from 'http';

const BASE_URL = 'http://localhost:5000';

function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', err => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting DMart REST API Integration Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET / (Server Health Check)', async () => {
    const res = await request('/');
    if (res.status !== 200 || res.data.status !== 'ONLINE') throw new Error('Health check failed');
  });

  // 2. Products List
  await test('GET /api/products (Fetch Catalog)', async () => {
    const res = await request('/api/products');
    if (res.status !== 200 || !Array.isArray(res.data.data)) throw new Error('Failed to fetch products list');
  });

  // 3. Single Product
  await test('GET /api/products/1 (Fetch Product ID 1)', async () => {
    const res = await request('/api/products/1');
    if (res.status !== 200 || !res.data.data) throw new Error('Failed to fetch single product');
  });

  // 4. Create Product
  let createdProdId = null;
  await test('POST /api/products (Create New Product)', async () => {
    const res = await request('/api/products', 'POST', {
      name: 'Test Organic Honey 500g',
      category: 'grocery',
      brand: 'DMart Organic',
      price: 299,
      mrp: 350
    });
    if (res.status !== 201 || !res.data.data) throw new Error('Failed to create product');
    createdProdId = res.data.data.id;
  });

  // 5. Update Product
  await test('PUT /api/products/:id (Update Product)', async () => {
    if (!createdProdId) throw new Error('No created product ID');
    const res = await request(`/api/products/${createdProdId}`, 'PUT', { price: 279 });
    if (res.status !== 200 || res.data.data.price !== 279) throw new Error('Failed to update product');
  });

  // 6. Delete Product
  await test('DELETE /api/products/:id (Delete Product)', async () => {
    if (!createdProdId) throw new Error('No created product ID');
    const res = await request(`/api/products/${createdProdId}`, 'DELETE');
    if (res.status !== 200) throw new Error('Failed to delete product');
  });

  // 7. Categories & Banners
  await test('GET /api/categories & /api/categories/banners', async () => {
    const cats = await request('/api/categories');
    const banners = await request('/api/categories/banners');
    if (cats.status !== 200 || banners.status !== 200) throw new Error('Failed categories test');
  });

  // 8. User Auth Register & Login
  const testMobile = '99' + Math.floor(10000000 + Math.random() * 90000008);
  await test('POST /api/auth/register (Register Account)', async () => {
    const res = await request('/api/auth/register', 'POST', {
      fullName: 'API Test User',
      mobile: testMobile,
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123'
    });
    if (res.status !== 201) throw new Error(`Register failed: ${res.data.message}`);
  });

  await test('POST /api/auth/login (Login Account)', async () => {
    const res = await request('/api/auth/login', 'POST', {
      mobile: testMobile,
      password: 'testpassword123'
    });
    if (res.status !== 200 || !res.data.token) throw new Error('Login failed');
  });

  // 9. Orders Flow
  let testOrderId = null;
  await test('POST /api/orders (Place Order)', async () => {
    const res = await request('/api/orders', 'POST', {
      items: [
        { id: 1, name: 'Sample Oil', price: 100, mrp: 120, quantity: 2 }
      ],
      pincode: '400001',
      slot: 'express',
      paymentMethod: 'upi'
    });
    if (res.status !== 201 || !res.data.data) throw new Error('Order creation failed');
    testOrderId = res.data.data.id;
  });

  await test('PUT /api/orders/:id/status (Update Order Status)', async () => {
    if (!testOrderId) throw new Error('No test order ID');
    const res = await request(`/api/orders/${testOrderId}/status`, 'PUT', { status: 'Delivered' });
    if (res.status !== 200 || res.data.data.status !== 'Delivered') throw new Error('Update order status failed');
  });

  // 10. Cart Sync
  await test('POST & GET /api/cart/:userId (Cart Persistence)', async () => {
    const postRes = await request('/api/cart/USR-TEST', 'POST', {
      items: [{ id: 1, selectedWeight: '1 kg', quantity: 3 }]
    });
    if (postRes.status !== 200) throw new Error('Sync cart failed');

    const getRes = await request('/api/cart/USR-TEST');
    if (getRes.status !== 200 || getRes.data.data.length !== 1) throw new Error('Get cart failed');
  });

  // 11. Wishlist Sync
  await test('POST & GET /api/wishlist/:userId (Wishlist Persistence)', async () => {
    const postRes = await request('/api/wishlist/USR-TEST', 'POST', {
      items: [1, 5, 8]
    });
    if (postRes.status !== 200) throw new Error('Sync wishlist failed');

    const getRes = await request('/api/wishlist/USR-TEST');
    if (getRes.status !== 200 || getRes.data.data.length !== 3) throw new Error('Get wishlist failed');
  });

  // 12. Search Suggestions
  await test('GET /api/products/search/suggestions (Auto-Complete)', async () => {
    const res = await request('/api/products/search/suggestions?q=oil');
    if (res.status !== 200 || !Array.isArray(res.data.data)) throw new Error('Search suggestions failed');
  });

  // 13. Edge Case: 404 Route Handler
  await test('GET /api/nonexistent (Global 404 Handler)', async () => {
    const res = await request('/api/nonexistent');
    if (res.status !== 404 || res.data.success !== false) throw new Error('404 handler failed');
  });

  // 14. Edge Case: Non-existent Product Lookup
  await test('GET /api/products/999999 (Non-existent Product Lookup)', async () => {
    const res = await request('/api/products/999999');
    if (res.status !== 404) throw new Error('Should return 404 for invalid product ID');
  });

  // 15. Edge Case: Invalid Product Creation Validation
  await test('POST /api/products (Validation for missing required fields)', async () => {
    const res = await request('/api/products', 'POST', {});
    if (res.status !== 400 || res.data.success !== false) throw new Error('Should reject product creation missing required fields');
  });

  // 16. Edge Case: Invalid Order Creation Validation
  await test('POST /api/orders (Validation for empty cart order)', async () => {
    const res = await request('/api/orders', 'POST', { items: [] });
    if (res.status !== 400 || res.data.success !== false) throw new Error('Should reject order with empty items');
  });

  console.log(`\n=======================================================`);
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`=======================================================`);
}


runTests();

