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

export default router;
