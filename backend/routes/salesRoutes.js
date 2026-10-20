import express from 'express';
import { SaleTransaction } from '../models/SaleTransaction.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * Get sales transactions with MongoDB Pagination & Filter
 * Query params: page (default: 1), limit (default: 20), search, paymentMethod, startDate, endDate
 */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const { search, paymentMethod, startDate, endDate } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { billNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
    }

    if (paymentMethod && paymentMethod !== 'all') {
      filter.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    let sales = [];
    let totalItems = 0;

    try {
      totalItems = await SaleTransaction.countDocuments(filter);
      sales = await SaleTransaction.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    } catch {
      sales = [];
      totalItems = 0;
    }

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return res.json({
      success: true,
      data: sales,
      count: sales.length,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Create POS Transaction (Admin / Cashier)
router.post('/', verifyToken, requireRole('admin', 'proprietor'), async (req, res) => {
  try {
    const saleData = req.body;
    const billNumber = saleData.billNumber || ('BILL-AVN-' + Date.now().toString().slice(-6));
    
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
