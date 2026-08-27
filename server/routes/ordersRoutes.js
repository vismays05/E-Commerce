import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import db from '../db.js';

const router = express.Router();

// GET /api/orders - Fetch user order history
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, source: 'MongoDB Atlas', data: orders });
    } catch (err) {
      console.warn('MongoDB orders fetch failed:', err.message);
    }
  }

  const rows = db.prepare('SELECT * FROM orders ORDER BY rowid DESC').all();
  const orders = rows.map(r => ({
    ...r,
    items: JSON.parse(r.items)
  }));

  res.json({ success: true, source: 'SQLite', data: orders });
});

// POST /api/orders - Create and save new order
router.post('/', async (req, res) => {
  const { items, pincode, slot, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart items are required to place an order.'
    });
  }

  const total = items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  const totalMrp = items.reduce((acc, item) => acc + (Number(item.mrp || item.price || 0) * Number(item.quantity || 1)), 0);
  const savings = Math.max(0, totalMrp - total);


  const orderId = 'DMART-' + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const deliverySlot = slot === 'express' ? 'Express 2-Hour Delivery' : 'Tomorrow Morning (8 AM - 11 AM)';

  const newOrderData = {
    id: orderId,
    date: dateStr,
    items,
    total,
    savings,
    status: 'Order Placed & Packed',
    slot: deliverySlot,
    pincode: pincode || '400001',
    paymentMethod: paymentMethod || 'upi'
  };

  // Try MongoDB Atlas
  if (mongoose.connection.readyState === 1) {
    try {
      const created = await Order.create(newOrderData);
      return res.status(201).json({
        success: true,
        source: 'MongoDB Atlas',
        message: 'Order saved in MongoDB Atlas successfully!',
        data: created
      });
    } catch (err) {
      console.warn('MongoDB order insert failed, using SQLite:', err.message);
    }
  }

  // SQLite Fallback
  db.prepare(`
    INSERT INTO orders (id, date, items, total, savings, status, slot, pincode, paymentMethod)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    orderId,
    dateStr,
    JSON.stringify(items),
    total,
    savings,
    'Order Placed & Packed',
    deliverySlot,
    pincode || '400001',
    paymentMethod || 'upi'
  );

  res.status(201).json({
    success: true,
    source: 'SQLite',
    message: 'Order saved in SQLite database successfully!',
    data: newOrderData
  });
});

// GET /api/orders/:id - Get single order by ID
router.get('/:id', async (req, res) => {
  const orderId = req.params.id;

  if (mongoose.connection.readyState === 1) {
    try {
      const order = await Order.findOne({ id: orderId }).lean();
      if (order) {
        return res.json({ success: true, source: 'MongoDB Atlas', data: order });
      }
    } catch (err) {
      console.warn('MongoDB single order lookup failed:', err.message);
    }
  }

  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  if (!row) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const order = {
    ...row,
    items: JSON.parse(row.items)
  };

  res.json({ success: true, source: 'SQLite', data: order });
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status field is required.' });
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await Order.findOneAndUpdate({ id: orderId }, { status }, { new: true }).lean();
      if (updated) {
        return res.json({ success: true, source: 'MongoDB Atlas', message: `Order status updated to '${status}'`, data: updated });
      }
    } catch (err) {
      console.warn('MongoDB order status update failed:', err.message);
    }
  }

  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
  const updatedRow = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

  res.json({
    success: true,
    source: 'SQLite',
    message: `Order status updated to '${status}'`,
    data: {
      ...updatedRow,
      items: JSON.parse(updatedRow.items)
    }
  });
});

export default router;

