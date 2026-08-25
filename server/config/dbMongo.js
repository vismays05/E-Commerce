import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { initialProducts } from '../../src/data/products.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  try {
    console.log('🍃 Connecting to MongoDB Atlas database...');
    // Attempt Mongoose Atlas Connection with timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Successfully connected to MongoDB Atlas Database!');

    // Seed Products if collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding MongoDB Atlas with DMart product catalog...');
      await Product.insertMany(initialProducts);
      console.log(`✅ Seeded ${initialProducts.length} DMart products into MongoDB Atlas.`);
    }

    // Seed Demo Users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('👥 Seeding MongoDB Atlas with demo accounts...');
      await User.insertMany([
        {
          id: 'USR-1001',
          fullName: 'Rohan Sharma',
          mobile: '9876543210',
          email: 'rohan.sharma@example.com',
          password: 'password123',
          createdAt: new Date().toISOString()
        },
        {
          id: 'USR-1002',
          fullName: 'Priya Patel',
          mobile: '9123456789',
          email: 'priya.patel@example.com',
          password: 'dmartpass',
          createdAt: new Date().toISOString()
        }
      ]);
      console.log('✅ Seeded demo user accounts into MongoDB Atlas.');
    }
  } catch (err) {
    console.warn('⚠️ Could not connect to MongoDB Atlas cluster:', err.message);
    console.log('🔄 Running in hybrid mode with SQLite / Local Storage persistence fallback.');
  }
}

export default connectDB;
