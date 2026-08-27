import express from 'express';
import db from '../db.js';

const router = express.Router();

// Ensure carts table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS carts (
    userId TEXT PRIMARY KEY,
    items TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// GET /api/cart/:userId - Retrieve user cart
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const row = db.prepare('SELECT * FROM carts WHERE userId = ?').get(userId);

  if (!row) {
    return res.json({
      success: true,
      data: []
    });
  }

  res.json({
    success: true,
    data: JSON.parse(row.items),
    updatedAt: row.updatedAt
  });
});

// POST /api/cart/:userId - Save/Sync user cart
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      message: 'Items array is required to sync cart.'
    });
  }

  const updatedAt = new Date().toISOString();
  const itemsJson = JSON.stringify(items);

  db.prepare(`
    INSERT INTO carts (userId, items, updatedAt)
    VALUES (?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      items = excluded.items,
      updatedAt = excluded.updatedAt
  `).run(userId, itemsJson, updatedAt);

  res.json({
    success: true,
    message: 'Cart synced successfully!',
    data: items,
    updatedAt
  });
});

export default router;
