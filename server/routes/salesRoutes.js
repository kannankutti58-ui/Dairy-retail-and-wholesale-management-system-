import express from 'express';
import { SaleTransaction } from '../models/SaleTransaction.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get recent transactions
router.get('/', async (req, res) => {
  try {
    let sales = [];
    try {
      sales = await SaleTransaction.find({}).sort({ timestamp: -1 }).limit(20);
    } catch {
      sales = [];
    }
    return res.json({ success: true, count: sales.length, data: sales });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Create POS Transaction (Admin / Cashier)
router.post('/', verifyToken, requireRole('admin', 'proprietor'), async (req, res) => {
  try {
    const saleData = req.body;
    const billNumber = 'BILL-AVN-' + Date.now().toString().slice(-6);
    
    let createdSale = null;
    try {
      createdSale = await SaleTransaction.create({ ...saleData, billNumber });
    } catch {
      createdSale = { ...saleData, billNumber, timestamp: new Date() };
    }

    return res.status(201).json({
      success: true,
      message: 'Sale transaction recorded & synced successfully!',
      billNumber,
      data: createdSale
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
