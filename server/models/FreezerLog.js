import mongoose from 'mongoose';

const freezerLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  temperatureCelsius: { type: Number, required: true },
  targetTemperatureCelsius: { type: Number, default: 3.5 },
  criticalThresholdCelsius: { type: Number, default: 6.0 },
  compressorState: { type: String, enum: ['Active Cooling', 'Idle Eco Cycle', 'Emergency Defrost'], default: 'Active Cooling' },
  powerSource: { type: String, enum: ['EB Mains 3-Phase', 'Diesel Generator Backup', 'Solar Hybrid Inverter'], default: 'EB Mains 3-Phase' },
  status: { type: String, enum: ['OPTIMAL', 'WARNING', 'CRITICAL_ALARM'], default: 'OPTIMAL' },
  alarmTriggered: { type: Boolean, default: false },
  milkCratesStored: { type: Number, default: 32 }
});

export const FreezerLog = mongoose.models.FreezerLog || mongoose.model('FreezerLog', freezerLogSchema);
