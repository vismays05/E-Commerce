import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initDB } from './db.js';
import { connectDB } from './config/dbMongo.js';
import productsRoutes from './routes/productsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';

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

// Base route & Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    databases: {
      primary: 'MongoDB Atlas',
      fallback: 'SQLite (database.db)'
    },
    name: 'DMart E-Commerce Express + MongoDB Atlas API',
    version: '1.0.0',
    endpoints: [
      '/api/products',
      '/api/categories',
      '/api/auth/register',
      '/api/auth/login',
      '/api/orders'
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
