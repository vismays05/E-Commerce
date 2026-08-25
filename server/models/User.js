import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
