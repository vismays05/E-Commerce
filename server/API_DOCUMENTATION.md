# DMart E-Commerce REST API Documentation

The DMart E-Commerce REST API backend is built with Express.js and features a dual-database architecture: **MongoDB Atlas** as the primary cloud database, with **SQLite (`database.db`)** as an instant local fallback.

**Base URL**: `http://localhost:5000`

---

## Table of Contents
1. [Health Check & Server Status](#1-health-check--server-status)
2. [Products API](#2-products-api)
3. [Categories & Banners API](#3-categories--banners-api)
4. [User Authentication API](#4-user-authentication-api)
5. [Orders API](#5-orders-api)
6. [Cart Persistence API](#6-cart-persistence-api)

---

## 1. Health Check & Server Status

### GET `/`
Check server status, active databases, and list available endpoints.

**Response `200 OK`**:
```json
{
  "status": "ONLINE",
  "databases": {
    "primary": "MongoDB Atlas",
    "fallback": "SQLite (database.db)"
  },
  "name": "DMart E-Commerce Express REST API Server",
  "version": "1.1.0",
  "endpoints": [...]
}
```

---

## 2. Products API

### GET `/api/products`
Retrieve product catalog with optional filtering, search, and sorting.

**Query Parameters**:
- `category` (string, optional): Filter by category ID (e.g., `grocery`, `dairy`, `personal-care`, `home`).
- `search` (string, optional): Search keyword against product name, brand, or category.
- `maxPrice` (number, optional): Maximum price threshold.
- `minDiscount` (number, optional): Minimum percentage discount off MRP.
- `expressOnly` (boolean, optional): `true` to filter items available for 2-hour express delivery.
- `sortBy` (string, optional): `price-low`, `price-high`, `rating`, or default (most reviewed).

**Example Request**:
```bash
curl "http://localhost:5000/api/products?category=grocery&maxPrice=500&sortBy=price-low"
```

---

### GET `/api/products/:id`
Retrieve single product details by product ID.

**Example Request**:
```bash
curl "http://localhost:5000/api/products/1"
```

---

### POST `/api/products`
Create a new product catalog item.

**Request Body**:
```json
{
  "name": "Organic Almond Milk 1L",
  "category": "dairy",
  "brand": "DMart Select",
  "weightOptions": ["1 L", "2 L"],
  "price": 180,
  "mrp": 220,
  "rating": 4.8,
  "reviewsCount": 42,
  "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b",
  "badge": "ORGANIC",
  "expressDelivery": true,
  "inStock": true,
  "description": "Pure unflavored organic almond milk"
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:5000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Organic Almonds",
    "category": "grocery",
    "brand": "DMart Healthy",
    "weightOptions": ["500 g", "1 kg"],
    "price": 450,
    "mrp": 550
  }'
```

---

### PUT `/api/products/:id`
Update an existing product item by ID.

**Example Request**:
```bash
curl -X PUT "http://localhost:5000/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{ "price": 285, "inStock": true }'
```

---

### DELETE `/api/products/:id`
Remove a product from the database.

**Example Request**:
```bash
curl -X DELETE "http://localhost:5000/api/products/100"
```

---

## 3. Categories & Banners API

### GET `/api/categories`
Retrieve DMart category tree.

---

### GET `/api/categories/banners`
Retrieve homepage hero promotional banners.

---

## 4. User Authentication API

### POST `/api/auth/register`
Register a new customer account.

**Request Body**:
```json
{
  "fullName": "Rahul Sharma",
  "mobile": "9876543210",
  "email": "rahul.sharma@example.com",
  "password": "securepassword123"
}
```

---

### POST `/api/auth/login`
Authenticate customer using mobile number and password.

**Request Body**:
```json
{
  "mobile": "9876543210",
  "password": "securepassword123"
}
```

---

### GET `/api/auth/profile/:id`
Fetch user profile by user ID.

---

### GET `/api/auth/users`
List all registered user accounts (admin view).

---

## 5. Orders API

### GET `/api/orders`
Fetch order history.

---

### GET `/api/orders/:id`
Fetch order details by order ID (e.g. `DMART-879412`).

---

### POST `/api/orders`
Place a new order.

**Request Body**:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Fortune Sunlite Refined Sunflower Oil",
      "price": 145,
      "mrp": 175,
      "selectedWeight": "1 L",
      "quantity": 2
    }
  ],
  "pincode": "400001",
  "slot": "express",
  "paymentMethod": "upi"
}
```

---

### PUT `/api/orders/:id/status`
Update order delivery status.

**Request Body**:
```json
{
  "status": "Out for Delivery"
}
```

---

## 6. Cart Persistence API

### GET `/api/cart/:userId`
Fetch persistent cart for user ID.

---

### POST `/api/cart/:userId`
Sync active cart state for user ID.

**Request Body**:
```json
{
  "items": [
    { "id": 1, "selectedWeight": "5 kg", "quantity": 1 }
  ]
}
```
