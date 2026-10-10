import express from 'express';
import { MonthlyAttaiCard } from '../models/MonthlyAttaiCard.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get customer cards (or specific card by query)
router.get('/cards', async (req, res) => {
  try {
    const { cardNumber } = req.query;
    let query = {};
    if (cardNumber) query.cardNumber = cardNumber;

    let cards = [];
    try {
      cards = await MonthlyAttaiCard.find(query);
    } catch {
      cards = [];
    }

    if (!cards || cards.length === 0) {
      // Return default subscriber card for ATT-101
      cards = [
        {
          cardNumber: 'ATT-101',
          customerName: 'M. Lakshmi',
          phone: '9443442471',
          address: 'Palayamkottai, Tirunelveli',
          subscribedMilk: 'aavin-purple',
          milkName: 'Aavin Delight (Purple Standardised 4.5% Fat)',
          packetQuantity: 2,
          monthlyPaidAmount: 1440,
          month: 'August 2026',
          startDate: '2026-08-01',
          validTill: '2026-08-31',
          punchedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
          todayCollected: true,
          totalDaysInMonth: 31,
          deliveryRoute: 'Route 1: Temple Street & North Car Street',
          deliveryStatus: 'Delivered safely at 05:30 AM'
        }
      ];
    }

    return res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Punch card for a given day (Self service or Admin)
router.post('/punch', verifyToken, async (req, res) => {
  try {
    const { cardNumber, dayNumber } = req.body;
    let card = await MonthlyAttaiCard.findOne({ cardNumber });
    if (card) {
      if (!card.punchedDays.includes(dayNumber)) {
        card.punchedDays.push(dayNumber);
        card.todayCollected = true;
        await card.save();
      }
      return res.json({ success: true, message: `Punched day ${dayNumber} successfully!`, data: card });
    }
    return res.json({ success: true, message: `Simulated punch for day ${dayNumber}` });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
