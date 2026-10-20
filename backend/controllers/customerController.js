import MonthlyAttaiCard from '../models/MonthlyAttaiCard.js';

export const getAllAttaiCards = async (req, res) => {
  try {
    const cards = await MonthlyAttaiCard.find();
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const punchDailyQuota = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await MonthlyAttaiCard.findOne({ cardId });
    if (!card) return res.status(404).json({ success: false, message: 'Attai card not found' });

    card.remainingBalance = Math.max(0, (card.remainingBalance || 60) - 1);
    await card.save();
    res.json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
