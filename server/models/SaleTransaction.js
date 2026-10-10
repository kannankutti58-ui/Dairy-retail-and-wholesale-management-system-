import mongoose from 'mongoose';

const saleTransactionSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  customerType: { type: String, enum: ['retail_walkin', 'attai_subscriber', 'wholesale_b2b'], default: 'retail_walkin' },
  customerName: { type: String, default: 'Counter Customer' },
  customerPhone: { type: String, default: '9443442471' },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      unitPrice: Number,
      totalPrice: Number
    }
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  gstTax: { type: Number, default: 0 },
  finalTotal: { type: Number, required: true },
  paymentMode: { type: String, enum: ['cash', 'upi_gpay', 'card', 'attai_card_punch', 'credit_ledger'], default: 'cash' },
  paymentStatus: { type: String, default: 'paid' },
  proprietorCashier: { type: String, default: 'Kuttiammal M.' }
});

export const SaleTransaction = mongoose.models.SaleTransaction || mongoose.model('SaleTransaction', saleTransactionSchema);
