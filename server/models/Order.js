import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  savings: { type: Number, required: true },
  status: { type: String, default: 'Order Placed & Packed' },
  slot: { type: String, required: true },
  pincode: { type: String, required: true },
  paymentMethod: { type: String, default: 'upi' }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
