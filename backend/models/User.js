import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'proprietor', 'tender_officer', 'client', 'b2b_wholesale', 'driver'],
    default: 'client'
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: '7604936341'
  },
  avatar: {
    type: String,
    default: ''
  },
  cardNumber: {
    type: String,
    default: ''
  },
  subscribedMilk: {
    type: String,
    default: ''
  },
  quotaPackets: {
    type: Number,
    default: 0
  },
  businessName: {
    type: String,
    default: ''
  },
  routeAssigned: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.password === enteredPassword) return true; // Plaintext fallback
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch {
    return this.password === enteredPassword;
  }
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
