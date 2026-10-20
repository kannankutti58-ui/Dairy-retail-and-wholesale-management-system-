import express from 'express';
import { gpsSocketService } from '../services/gpsSocketService.js';

const router = express.Router();

// Get active trip telemetry state
router.get('/trip', (req, res) => {
  const trip = gpsSocketService.getTripState('trip-nh44-night-feeder');
  return res.json({
    success: true,
    data: trip
  });
});

router.get('/trip/:tripId', (req, res) => {
  const tripId = req.params.tripId || 'trip-nh44-night-feeder';
  const trip = gpsSocketService.getTripState(tripId);

  return res.json({
    success: true,
    data: trip
  });
});

// Highway Checkpoints Master List
router.get('/checkpoints', (req, res) => {
  const checkpoints = [
    {
      id: 'cp1',
      name: 'Tirunelveli Central Feeder Dairy',
      area: 'Union Dispatch Yard',
      distanceKm: 0,
      scheduledTime: '06:00 PM',
      coordinates: { lat: 8.7139, lng: 77.7567 }
    },
    {
      id: 'cp2',
      name: 'Gangaikondan Checkpoint',
      area: 'SIPCOT Industrial Zone',
      distanceKm: 18,
      scheduledTime: '07:30 PM',
      coordinates: { lat: 8.8475, lng: 77.7794 }
    },
    {
      id: 'cp3',
      name: 'Kayathar Toll Plaza',
      area: 'NH44 Highway Junction',
      distanceKm: 35,
      scheduledTime: '09:00 PM',
      coordinates: { lat: 8.9568, lng: 77.7744 }
    },
    {
      id: 'cp4',
      name: 'Kovilpatti Bypass',
      area: 'Inam Maniyachi Ring Road',
      distanceKm: 52,
      scheduledTime: '10:15 PM',
      coordinates: { lat: 9.1725, lng: 77.8682 }
    },
    {
      id: 'cp5',
      name: "Kuttiammal's Dairy Hub (Agency Shop)",
      area: 'Kovilpatti Main Bazaar',
      distanceKm: 58,
      scheduledTime: '10:45 PM',
      coordinates: { lat: 9.1742, lng: 77.8732 }
    }
  ];

  return res.json({
    success: true,
    route: 'NH44 Night Feeder Cold Chain Route',
    totalDistanceKm: 58,
    checkpoints
  });
});

export default router;
