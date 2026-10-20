import express from 'express';
import { whatsAppService } from '../services/whatsappService.js';
import { smsService } from '../services/smsService.js';

const router = express.Router();

/**
 * 1. WHATSAPP ENDPOINTS
 */

// Get Meta WhatsApp Cloud API status
router.get('/whatsapp/status', (req, res) => {
  return res.json({
    success: true,
    data: whatsAppService.getStatus()
  });
});

// Send WhatsApp Message
router.post('/whatsapp/send', async (req, res) => {
  try {
    const { to, message, templateName, components } = req.body;

    if (!to || (!message && !templateName)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipient phone (to) and message text or templateName.'
      });
    }

    let result;
    if (templateName) {
      result = await whatsAppService.sendTemplateMessage(to, templateName, 'en', components);
    } else {
      result = await whatsAppService.sendTextMessage(to, message);
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process WhatsApp request',
      error: error.message
    });
  }
});

/**
 * 2. SMS GATEWAY ENDPOINTS
 */

// Get SMS Gateway Status
router.get('/sms/status', (req, res) => {
  return res.json({
    success: true,
    data: smsService.getStatus()
  });
});

// Send SMS via Gateway
router.post('/sms/send', async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipient phone number and message content.'
      });
    }

    const result = await smsService.sendSms(phone, message);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process SMS request',
      error: error.message
    });
  }
});

export default router;
