import express from 'express';
import db from '../db.js';

const router = express.Router();

// Ensure wishlists table exists in SQLite
db.exec(`
  CREATE TABLE IF NOT EXISTS wishlists (
    userId TEXT PRIMARY KEY,
    items TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// GET /api/wishlist/:userId - Retrieve favorited product IDs
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const row = db.prepare('SELECT * FROM wishlists WHERE userId = ?').get(userId);

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

// POST /api/wishlist/:userId - Save/Sync wishlist items array
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      message: 'Items array of product IDs is required.'
    });
  }

  const updatedAt = new Date().toISOString();
  const itemsJson = JSON.stringify(items);

  db.prepare(`
    INSERT INTO wishlists (userId, items, updatedAt)
    VALUES (?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      items = excluded.items,
      updatedAt = excluded.updatedAt
  `).run(userId, itemsJson, updatedAt);

  res.json({
    success: true,
    message: 'Wishlist updated successfully!',
    data: items,
    updatedAt
  });
});

export default router;
