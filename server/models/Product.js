import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  weightOptions: [{ type: String }],
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 100 },
  image: { type: String, required: true },
  badge: { type: String },
  expressDelivery: { type: Boolean, default: true },
  inStock: { type: Boolean, default: true },
  description: { type: String }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
