import { sendWhatsAppAlert } from '../services/whatsappService.js';
import { sendSmsAlert } from '../services/smsService.js';

export const sendBrochureWhatsApp = async (req, res) => {
  try {
    const { phone, brochureType, customMessage } = req.body;
    const targetPhone = phone || '7604936341';
    const result = await sendWhatsAppAlert(targetPhone, customMessage || `🎁 Aavin Festive Gift Brochure for ${brochureType}`);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendBrochureSms = async (req, res) => {
  try {
    const { phone, message } = req.body;
    const targetPhone = phone || '7604936341';
    const result = await sendSmsAlert(targetPhone, message || 'Aavin Dairy Pass Voucher Code: AAVIN100');
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
