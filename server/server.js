import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initDB } from './db.js';
import { connectDB } from './config/dbMongo.js';
import productsRoutes from './routes/productsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite DB as local fallback
initDB();

// Initialize MongoDB Atlas connection
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);


// Base route & Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    databases: {
      primary: 'MongoDB Atlas',
      fallback: 'SQLite (database.db)'
    },
    name: 'DMart E-Commerce Express REST API Server',
    version: '1.1.0',
    endpoints: [
      { method: 'GET', path: '/api/products', description: 'List/filter product catalog' },
      { method: 'GET', path: '/api/products/:id', description: 'Get single product detail' },
      { method: 'POST', path: '/api/products', description: 'Create a new product' },
      { method: 'PUT', path: '/api/products/:id', description: 'Update product details' },
      { method: 'DELETE', path: '/api/products/:id', description: 'Delete product by ID' },
      { method: 'GET', path: '/api/categories', description: 'Get product categories' },
      { method: 'GET', path: '/api/categories/banners', description: 'Get hero promotional banners' },
      { method: 'POST', path: '/api/auth/register', description: 'Register new user account' },
      { method: 'POST', path: '/api/auth/login', description: 'Authenticate user account' },
      { method: 'GET', path: '/api/auth/users', description: 'List registered user accounts' },
      { method: 'GET', path: '/api/auth/profile/:id', description: 'Get user profile detail' },
      { method: 'GET', path: '/api/orders', description: 'Fetch order history' },
      { method: 'GET', path: '/api/orders/:id', description: 'Fetch single order detail' },
      { method: 'POST', path: '/api/orders', description: 'Create and place new order' },
      { method: 'PUT', path: '/api/orders/:id/status', description: 'Update order status' },
      { method: 'GET', path: '/api/cart/:userId', description: 'Retrieve user persistent cart' },
      { method: 'POST', path: '/api/cart/:userId', description: 'Save/Sync user cart state' }
    ]
  });
});


// Global 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 DMart Express + MongoDB Atlas API Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}/`);
  console.log(`=======================================================`);
});
