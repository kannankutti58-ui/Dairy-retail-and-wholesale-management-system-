import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tamilName: { type: String, default: '' },
  category: { type: String, enum: ['milk', 'curd', 'ghee', 'sweets', 'biscuits', 'butter'], default: 'milk' },
  brand: { type: String, default: 'Aavin' },
  colorCode: { type: String, default: 'blue' },
  fatContent: { type: String, default: '' },
  snfContent: { type: String, default: '' },
  unit: { type: String, default: '500 ml pouch' },
  mrp: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true },
  currentStock: { type: Number, default: 0 },
  crateCapacity: { type: Number, default: 24 },
  batchNo: { type: String, default: 'BATCH-2026-A1' },
  expiryHours: { type: Number, default: 48 },
  temperatureLimitCelsius: { type: Number, default: 4.0 },
  isFastSelling: { type: Boolean, default: false }
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
