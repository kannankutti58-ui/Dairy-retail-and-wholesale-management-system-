import mongoose from 'mongoose';

const reviewFeedbackSchema = new mongoose.Schema({
  author: { type: String, required: true },
  phone: { type: String, default: '7604936341' },
  customerType: { type: String, enum: ['Attai Subscriber', 'Wholesale Client', 'Retail Walk-in'], default: 'Attai Subscriber' },
  cardNo: { type: String, default: 'ATT-101' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  product: { type: String, default: 'Aavin Delight Purple Milk & Fresh Curd' },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString() },
  timestamp: { type: Date, default: Date.now },
  verifiedBuyer: { type: Boolean, default: true },
  proprietorReply: { type: String, default: 'மிக்க நன்றி! எங்கள் ஆவின் பாலகத்தின் நல்வாழ்த்துகள்!' }
});

export const ReviewFeedback = mongoose.models.ReviewFeedback || mongoose.model('ReviewFeedback', reviewFeedbackSchema);
