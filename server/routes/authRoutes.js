import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import db from '../db.js';

const router = express.Router();

// GET /api/auth/users - List all registered accounts
router.get('/users', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const users = await User.find({}, '-password').lean();
      return res.json({ success: true, source: 'MongoDB Atlas', total: users.length, data: users });
    } catch (err) {
      console.warn('MongoDB users fetch failed:', err.message);
    }
  }

  const users = db.prepare('SELECT id, fullName, mobile, email, createdAt FROM users').all();
  res.json({ success: true, source: 'SQLite', total: users.length, data: users });
});

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  const { fullName, mobile, email, password } = req.body;

  if (!fullName || !mobile || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields (fullName, mobile, email, password) are required.'
    });
  }

  const userId = 'USR-' + Math.floor(1000 + Math.random() * 9000);
  const createdAt = new Date().toISOString();

  // Try MongoDB Atlas
  if (mongoose.connection.readyState === 1) {
    try {
      const existing = await User.findOne({ $or: [{ mobile }, { email }] });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Account with this mobile number or email already exists in MongoDB.'
        });
      }

      const newUser = await User.create({
        id: userId,
        fullName,
        mobile,
        email,
        password,
        createdAt
      });

      return res.status(201).json({
        success: true,
        source: 'MongoDB Atlas',
        message: 'DMart account created successfully in MongoDB Atlas!',
        token: 'jwt_mongo_token_' + Date.now(),
        user: { id: newUser.id, fullName: newUser.fullName, mobile: newUser.mobile, email: newUser.email, createdAt: newUser.createdAt }
      });
    } catch (err) {
      console.warn('MongoDB register failed, using SQLite:', err.message);
    }
  }

  // SQLite Fallback
  const existing = db.prepare('SELECT * FROM users WHERE mobile = ? OR email = ?').get(mobile, email);
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Account with this mobile number or email already exists in DMart database.'
    });
  }

  db.prepare(`
    INSERT INTO users (id, fullName, mobile, email, password, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, fullName, mobile, email, password, createdAt);

  res.status(201).json({
    success: true,
    source: 'SQLite',
    message: 'DMart account created successfully in database!',
    token: 'jwt_sqlite_token_' + Date.now(),
    user: { id: userId, fullName, mobile, email, createdAt }
  });
});

// POST /api/auth/login - Authenticate user
router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide mobile number and password.'
    });
  }

  // Try MongoDB Atlas
  if (mongoose.connection.readyState === 1) {
    try {
      const user = await User.findOne({ mobile, password }).lean();
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return res.json({
          success: true,
          source: 'MongoDB Atlas',
          message: 'Signed in successfully via MongoDB Atlas!',
          token: 'jwt_mongo_token_' + Date.now(),
          user: userWithoutPassword
        });
      }
    } catch (err) {
      console.warn('MongoDB login query failed:', err.message);
    }
  }

  // SQLite Fallback
  const user = db.prepare('SELECT * FROM users WHERE mobile = ? AND password = ?').get(mobile, password);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid mobile number or password.'
    });
  }

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    source: 'SQLite',
    message: 'Signed in successfully!',
    token: 'jwt_sqlite_token_' + Date.now(),
    user: userWithoutPassword
  });
});

export default router;
