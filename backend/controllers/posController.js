import SaleTransaction from '../models/SaleTransaction.js';
import Product from '../models/Product.js';

export const checkoutPOS = async (req, res) => {
  try {
    const { items, totalAmount, paymentMode, transactionRef, customerPhone } = req.body;
    const billNo = `BILL-${Date.now().toString().slice(-6)}`;

    const newSale = new SaleTransaction({
      billNo,
      items: items || [],
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMode || 'Cash',
      transactionRef: transactionRef || null,
      customerPhone: customerPhone || '7604936341',
      timestamp: new Date()
    });

    await newSale.save();
    res.json({ success: true, billNo, transaction: newSale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDailySales = async (req, res) => {
  try {
    const sales = await SaleTransaction.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
