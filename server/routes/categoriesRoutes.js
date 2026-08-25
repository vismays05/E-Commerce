import express from 'express';
import { categories, heroBanners } from '../../src/data/products.js';

const router = express.Router();

// GET /api/categories - Fetch all categories
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// GET /api/categories/banners - Fetch hero banners
router.get('/banners', (req, res) => {
  res.json({
    success: true,
    data: heroBanners
  });
});

export default router;
