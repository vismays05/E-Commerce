import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import db from '../db.js';

const router = express.Router();

// GET /api/products - Get product catalog with search, filtering, and sorting
router.get('/', async (req, res) => {
  const { category, search, maxPrice, minDiscount, expressOnly, sortBy } = req.query;

  // Use MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};

      if (category && category !== 'all') {
        filter.category = category;
      }
      if (search) {
        const q = new RegExp(search, 'i');
        filter.$or = [{ name: q }, { brand: q }, { category: q }];
      }
      if (maxPrice) {
        filter.price = { $lte: Number(maxPrice) };
      }
      if (expressOnly === 'true') {
        filter.expressDelivery = true;
      }

      let sortQuery = { reviewsCount: -1 };
      if (sortBy === 'price-low') sortQuery = { price: 1 };
      if (sortBy === 'price-high') sortQuery = { price: -1 };
      if (sortBy === 'rating') sortQuery = { rating: -1 };

      let products = await Product.find(filter).sort(sortQuery).lean();

      if (minDiscount) {
        products = products.filter(p => {
          const disc = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          return disc >= Number(minDiscount);
        });
      }

      return res.json({
        success: true,
        source: 'MongoDB Atlas',
        total: products.length,
        data: products
      });
    } catch (err) {
      console.warn('MongoDB query failed, falling back to SQLite:', err.message);
    }
  }

  // SQLite Fallback
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ?)';
    const q = `%${search.toLowerCase()}%`;
    params.push(q, q, q);
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(Number(maxPrice));
  }
  if (expressOnly === 'true') {
    query += ' AND expressDelivery = 1';
  }

  if (sortBy === 'price-low') query += ' ORDER BY price ASC';
  else if (sortBy === 'price-high') query += ' ORDER BY price DESC';
  else if (sortBy === 'rating') query += ' ORDER BY rating DESC';
  else query += ' ORDER BY reviewsCount DESC';

  const rows = db.prepare(query).all(...params);
  let products = rows.map(r => ({
    ...r,
    weightOptions: JSON.parse(r.weightOptions),
    expressDelivery: Boolean(r.expressDelivery),
    inStock: Boolean(r.inStock)
  }));

  if (minDiscount) {
    products = products.filter(p => {
      const disc = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      return disc >= Number(minDiscount);
    });
  }

  res.json({
    success: true,
    source: 'SQLite (database.db)',
    total: products.length,
    data: products
  });
});

// GET /api/products/search/suggestions - Get search auto-complete suggestions
router.get('/search/suggestions', async (req, res) => {
  const q = req.query.q || '';
  if (!q.trim()) {
    return res.json({ success: true, data: [] });
  }

  const queryRegex = new RegExp(q, 'i');

  if (mongoose.connection.readyState === 1) {
    try {
      const matches = await Product.find({
        $or: [{ name: queryRegex }, { brand: queryRegex }, { category: queryRegex }]
      }).limit(6).lean();

      const suggestions = matches.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
        image: p.image
      }));
      return res.json({ success: true, source: 'MongoDB Atlas', data: suggestions });
    } catch (err) {
      console.warn('MongoDB search suggestions failed:', err.message);
    }
  }

  const rows = db.prepare(`
    SELECT id, name, category, brand, price, image FROM products
    WHERE LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ?
    LIMIT 6
  `).all(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`);

  res.json({ success: true, source: 'SQLite', data: rows });
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const product = await Product.findOne({ id: Number(req.params.id) }).lean();
      if (product) {
        return res.json({ success: true, source: 'MongoDB Atlas', data: product });
      }
    } catch (err) {
      console.warn('MongoDB lookup failed:', err.message);
    }
  }

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const product = {
    ...row,
    weightOptions: JSON.parse(row.weightOptions),
    expressDelivery: Boolean(row.expressDelivery),
    inStock: Boolean(row.inStock)
  };

  res.json({ success: true, source: 'SQLite', data: product });
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  const { name, category, brand, weightOptions, price, mrp, rating, reviewsCount, image, badge, expressDelivery, inStock, description } = req.body;

  if (!name || !category || !price || !mrp) {
    return res.status(400).json({
      success: false,
      message: 'Name, category, price, and mrp are required fields.'
    });
  }

  const newId = Date.now();
  const productData = {
    id: newId,
    name,
    category,
    brand: brand || 'DMart',
    weightOptions: Array.isArray(weightOptions) ? weightOptions : ['1 Unit'],
    price: Number(price),
    mrp: Number(mrp),
    rating: Number(rating) || 4.5,
    reviewsCount: Number(reviewsCount) || 10,
    image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
    badge: badge || 'NEW',
    expressDelivery: expressDelivery === undefined ? true : Boolean(expressDelivery),
    inStock: inStock === undefined ? true : Boolean(inStock),
    description: description || 'Fresh DMart Quality Product'
  };

  // Mongo Atlas
  if (mongoose.connection.readyState === 1) {
    try {
      const created = await Product.create(productData);
      return res.status(201).json({
        success: true,
        source: 'MongoDB Atlas',
        message: 'Product created successfully!',
        data: created
      });
    } catch (err) {
      console.warn('MongoDB product create failed, trying SQLite:', err.message);
    }
  }

  // SQLite Fallback
  db.prepare(`
    INSERT INTO products (
      id, name, category, brand, weightOptions, price, mrp, rating, reviewsCount, image, badge, expressDelivery, inStock, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    productData.id,
    productData.name,
    productData.category,
    productData.brand,
    JSON.stringify(productData.weightOptions),
    productData.price,
    productData.mrp,
    productData.rating,
    productData.reviewsCount,
    productData.image,
    productData.badge,
    productData.expressDelivery ? 1 : 0,
    productData.inStock ? 1 : 0,
    productData.description
  );

  res.status(201).json({
    success: true,
    source: 'SQLite',
    message: 'Product created successfully in database!',
    data: productData
  });
});

// PUT /api/products/:id - Update product details
router.put('/:id', async (req, res) => {
  const productId = Number(req.params.id);
  const updates = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await Product.findOneAndUpdate({ id: productId }, updates, { new: true }).lean();
      if (updated) {
        return res.json({ success: true, source: 'MongoDB Atlas', message: 'Product updated successfully!', data: updated });
      }
    } catch (err) {
      console.warn('MongoDB product update failed:', err.message);
    }
  }

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const name = updates.name !== undefined ? updates.name : existing.name;
  const category = updates.category !== undefined ? updates.category : existing.category;
  const brand = updates.brand !== undefined ? updates.brand : existing.brand;
  const weightOptions = updates.weightOptions !== undefined ? JSON.stringify(updates.weightOptions) : existing.weightOptions;
  const price = updates.price !== undefined ? Number(updates.price) : existing.price;
  const mrp = updates.mrp !== undefined ? Number(updates.mrp) : existing.mrp;
  const rating = updates.rating !== undefined ? Number(updates.rating) : existing.rating;
  const reviewsCount = updates.reviewsCount !== undefined ? Number(updates.reviewsCount) : existing.reviewsCount;
  const image = updates.image !== undefined ? updates.image : existing.image;
  const badge = updates.badge !== undefined ? updates.badge : existing.badge;
  const expressDelivery = updates.expressDelivery !== undefined ? (updates.expressDelivery ? 1 : 0) : existing.expressDelivery;
  const inStock = updates.inStock !== undefined ? (updates.inStock ? 1 : 0) : existing.inStock;
  const description = updates.description !== undefined ? updates.description : existing.description;

  db.prepare(`
    UPDATE products SET
      name = ?, category = ?, brand = ?, weightOptions = ?, price = ?, mrp = ?,
      rating = ?, reviewsCount = ?, image = ?, badge = ?, expressDelivery = ?, inStock = ?, description = ?
    WHERE id = ?
  `).run(name, category, brand, weightOptions, price, mrp, rating, reviewsCount, image, badge, expressDelivery, inStock, description, productId);

  const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  res.json({
    success: true,
    source: 'SQLite',
    message: 'Product updated successfully!',
    data: {
      ...updatedProduct,
      weightOptions: JSON.parse(updatedProduct.weightOptions),
      expressDelivery: Boolean(updatedProduct.expressDelivery),
      inStock: Boolean(updatedProduct.inStock)
    }
  });
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  const productId = Number(req.params.id);

  if (mongoose.connection.readyState === 1) {
    try {
      const deleted = await Product.findOneAndDelete({ id: productId });
      if (deleted) {
        return res.json({ success: true, source: 'MongoDB Atlas', message: `Product ${productId} deleted successfully!` });
      }
    } catch (err) {
      console.warn('MongoDB product delete failed:', err.message);
    }
  }

  const result = db.prepare('DELETE FROM products WHERE id = ?').run(productId);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  res.json({ success: true, source: 'SQLite', message: `Product ${productId} deleted successfully!` });
});

export default router;
