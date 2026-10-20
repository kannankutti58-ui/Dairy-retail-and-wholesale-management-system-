import mongoose from 'mongoose';

const monthlyAttaiCardSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, default: '7604936341' },
  address: { type: String, default: 'Palayamkottai, Tirunelveli' },
  subscribedMilk: { type: String, default: 'aavin-purple' },
  milkName: { type: String, default: 'Aavin Delight (Purple Standardised 4.5% Fat)' },
  packetQuantity: { type: Number, default: 2 },
  monthlyPaidAmount: { type: Number, default: 1440 },
  month: { type: String, default: 'August 2026' },
  startDate: { type: String, default: '2026-08-01' },
  validTill: { type: String, default: '2026-08-31' },
  punchedDays: { type: [Number], default: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
  todayCollected: { type: Boolean, default: true },
  totalDaysInMonth: { type: Number, default: 31 },
  deliveryRoute: { type: String, default: 'Route 1: Temple Street & North Car Street' },
  deliveryStatus: { type: String, default: 'Delivered at 05:30 AM' }
});

export const MonthlyAttaiCard = mongoose.models.MonthlyAttaiCard || mongoose.model('MonthlyAttaiCard', monthlyAttaiCardSchema);
