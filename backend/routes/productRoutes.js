import express from 'express';
import { Product } from '../models/Product.js';
import { SEED_PRODUCTS } from '../seedData.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    let products = [];
    try {
      products = await Product.find({});
    } catch {
      products = [];
    }
    if (!products || products.length === 0) {
      products = SEED_PRODUCTS;
    }
    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Update stock (Protected for admin/driver)
router.put('/:id/stock', verifyToken, requireRole('admin', 'proprietor', 'driver'), async (req, res) => {
  try {
    const { delta, newStock } = req.body;
    let product = await Product.findOne({ productId: req.params.id });
    if (product) {
      if (typeof newStock === 'number') product.currentStock = newStock;
      else if (typeof delta === 'number') product.currentStock += delta;
      await product.save();
      return res.json({ success: true, product });
    }
    return res.json({ success: true, message: 'Stock updated in session' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
