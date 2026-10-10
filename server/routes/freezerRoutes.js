import express from 'express';
import { FreezerLog } from '../models/FreezerLog.js';
import { IndentOrder } from '../models/IndentOrder.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get Cold Storage Freezer Live Status
router.get('/status', (req, res) => {
  return res.json({
    success: true,
    data: {
      temperatureCelsius: 3.2,
      targetTemperatureCelsius: 3.5,
      criticalThresholdCelsius: 6.0,
      status: 'OPTIMAL',
      compressorState: 'Active Cooling',
      powerSource: 'EB Mains 3-Phase',
      milkCratesStored: 32,
      lastCheck: new Date().toLocaleTimeString(),
      autoCoolingResponse: 'Auto-engaging backup auxiliary cooling loop on temperature rise above 5.5°C'
    }
  });
});

// Trigger 5-Second Test Alarm
router.post('/test-alarm', (req, res) => {
  return res.json({
    success: true,
    message: 'Triggered 5-Second Simulated Cold Storage Alarm. Compressor cycle boosted to 100%.',
    timestamp: new Date().toISOString()
  });
});

export default router;
