import mongoose from 'mongoose';

const indentOrderSchema = new mongoose.Schema({
  indentId: { type: String, required: true, unique: true },
  dateForTomorrow: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  totalCrates: { type: Number, required: true },
  totalPackets: { type: Number, required: true },
  totalLiters: { type: Number, required: true },
  estimatedSupplyCost: { type: Number, required: true },
  items: [
    {
      variety: String,
      crates: Number,
      packets: Number,
      costRate: Number,
      totalCost: Number
    }
  ],
  bufferBonusPercent: { type: Number, default: 0 },
  status: { type: String, enum: ['Dispatched to Feeder Union', 'Approved by Tender Head', 'Night Truck in Transit', 'Received at Agency'], default: 'Dispatched to Feeder Union' },
  tenderOfficer: { type: String, default: 'Thiru. R. Shanmugam' },
  assignedVehicle: { type: String, default: 'TN-72-B-4412 (Eicher 14ft Insulated Tanker)' }
});

export const IndentOrder = mongoose.models.IndentOrder || mongoose.model('IndentOrder', indentOrderSchema);
