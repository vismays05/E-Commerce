import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProducts } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initial Demo User Accounts
const initialUsers = [
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
  },
  {
    id: 'USR-1003',
    fullName: 'Amit Kumar',
    mobile: '9988776655',
    email: 'amit.kumar@example.com',
    password: 'admin123',
    createdAt: new Date().toISOString()
  }
];

// Initialize SQL Tables
export function initDB() {
  console.log('📂 Initializing SQLite Database at:', dbPath);

  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      mobile TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // 2. Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      brand TEXT NOT NULL,
      weightOptions TEXT NOT NULL,
      price REAL NOT NULL,
      mrp REAL NOT NULL,
      rating REAL NOT NULL,
      reviewsCount INTEGER NOT NULL,
      image TEXT NOT NULL,
      badge TEXT,
      expressDelivery INTEGER NOT NULL,
      inStock INTEGER NOT NULL,
      description TEXT
    )
  `);

  // 3. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      savings REAL NOT NULL,
      status TEXT NOT NULL,
      slot TEXT NOT NULL,
      pincode TEXT NOT NULL,
      paymentMethod TEXT NOT NULL
    )
  `);

  // Seed Users if table is empty
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount === 0) {
    console.log('👥 Seeding initial user accounts into SQLite database...');
    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, fullName, mobile, email, password, createdAt)
      VALUES (@id, @fullName, @mobile, @email, @password, @createdAt)
    `);

    const insertManyUsers = db.transaction((users) => {
      for (const u of users) {
        insertUserStmt.run(u);
      }
    });

    insertManyUsers(initialUsers);
    console.log(`✅ Seeded ${initialUsers.length} demo user accounts into SQLite database.`);
  }

  // Seed Products if table is empty
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  if (productCount === 0) {
    console.log('🌱 Seeding SQLite database with DMart product catalog...');
    const insertStmt = db.prepare(`
      INSERT INTO products (
        id, name, category, brand, weightOptions, price, mrp, rating, reviewsCount, image, badge, expressDelivery, inStock, description
      ) VALUES (
        @id, @name, @category, @brand, @weightOptions, @price, @mrp, @rating, @reviewsCount, @image, @badge, @expressDelivery, @inStock, @description
      )
    `);

    const insertMany = db.transaction((products) => {
      for (const prod of products) {
        insertStmt.run({
          ...prod,
          weightOptions: JSON.stringify(prod.weightOptions),
          expressDelivery: prod.expressDelivery ? 1 : 0,
          inStock: prod.inStock ? 1 : 0
        });
      }
    });

    insertMany(initialProducts);
    console.log(`✅ Seeded ${initialProducts.length} DMart products into SQLite database.`);
  }
}

export default db;
