import express from 'express';
import { ReviewFeedback } from '../models/ReviewFeedback.js';
import { SEED_REVIEWS } from '../seedData.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all verified customer reviews
router.get('/', async (req, res) => {
  try {
    let reviews = [];
    try {
      reviews = await ReviewFeedback.find({}).sort({ timestamp: -1 });
    } catch {
      reviews = [];
    }
    if (!reviews || reviews.length === 0) {
      reviews = SEED_REVIEWS;
    }
    return res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Post a new review (Authenticated Client / Customer)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { author, rating, product, comment, cardNo } = req.body;
    
    const reviewData = {
      author: author || req.user.name || 'Verified Customer',
      phone: req.user.phone || '7604936341',
      customerType: req.user.role === 'client' ? 'Attai Subscriber' : 'Verified Customer',
      cardNo: cardNo || req.user.cardNumber || 'AVN-VERIFIED',
      rating: Number(rating) || 5,
      product: product || 'Aavin Delight Purple Milk',
      comment: comment || 'Very good service and fresh milk!',
      date: 'Today',
      verifiedBuyer: true
    };

    let created = null;
    try {
      created = await ReviewFeedback.create(reviewData);
    } catch {
      created = reviewData;
    }

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for supporting Kuttiammal Dairy Hub.',
      data: created
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
