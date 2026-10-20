import express from 'express';
import { pushService } from '../services/pushService.js';

const router = express.Router();

// Get VAPID Public Key for Client PushManager Registration
router.get('/vapid-public-key', (req, res) => {
  return res.json({
    success: true,
    publicKey: pushService.getPublicKey()
  });
});

// Register / Save Push Subscription
router.post('/subscribe', (req, res) => {
  try {
    const { subscription, clientInfo } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription object. Must contain endpoint and keys.'
      });
    }

    pushService.addSubscription(subscription, clientInfo);

    return res.status(201).json({
      success: true,
      message: 'Push subscription registered successfully!',
      subscribersCount: pushService.getSubscriptionsCount()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to register push subscription',
      error: error.message
    });
  }
});

// Trigger Instant or 5-Minute Test Web Push Alert
router.post('/send-test-alert', async (req, res) => {
  try {
    const { note } = req.body;
    const result = await pushService.sendTestPushAlert({ note });

    return res.json({
      success: true,
      message: 'Test Web Push Notification dispatched to all registered browsers/devices!',
      result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send test push alert',
      error: error.message
    });
  }
});

// Trigger Freezer Critical Temperature Push Notification
router.post('/send-freezer-alert', async (req, res) => {
  try {
    const { temperature = 6.2, target = 3.5, threshold = 5.5, shopName = "Kuttiammal's Dairy Hub" } = req.body;

    const result = await pushService.sendFreezerAlert({
      temperature: Number(temperature),
      target: Number(target),
      threshold: Number(threshold),
      shopName
    });

    return res.json({
      success: true,
      message: `Cold storage emergency push alert sent for ${temperature}°C!`,
      result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send freezer alert',
      error: error.message
    });
  }
});

// Get Push Service Status
router.get('/status', (req, res) => {
  return res.json({
    success: true,
    data: {
      service: 'Web Push (VAPID / Browser Push Notifications)',
      hasPublicKey: Boolean(pushService.getPublicKey()),
      subscribersCount: pushService.getSubscriptionsCount()
    }
  });
});

export default router;
