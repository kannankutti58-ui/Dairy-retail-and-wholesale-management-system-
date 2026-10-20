import FreezerLog from '../models/FreezerLog.js';
import { sendWhatsAppAlert } from '../services/whatsappService.js';
import { sendSmsAlert } from '../services/smsService.js';

export const logFreezerTelemetry = async (req, res) => {
  try {
    const { unitId, tempCelsius, powerStatus, targetPhone } = req.body;
    const isAlert = tempCelsius > 4.0 || powerStatus === 'OFF';

    const log = new FreezerLog({
      unitId: unitId || 'FRZ-01',
      temperatureCelsius: tempCelsius || 2.4,
      powerSupplyStatus: powerStatus || 'Mains_AC',
      isAlertCondition: isAlert,
      dispatchedAlertPhone: targetPhone || '7604936341',
      timestamp: new Date()
    });

    await log.save();

    if (isAlert) {
      await sendWhatsAppAlert(targetPhone || '7604936341', `🚨 EMERGENCY FREEZER ALERT: Unit ${unitId} Temp ${tempCelsius}°C exceeds 4°C!`);
      await sendSmsAlert(targetPhone || '7604936341', `🚨 Aavin Freezer Alert: Unit ${unitId} Temp ${tempCelsius}C!`);
    }

    res.json({ success: true, isAlert, log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
