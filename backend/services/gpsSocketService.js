import { Server } from 'socket.io';

/**
 * Real-Time GPS Tracking Service using Socket.IO
 * Connects driver mobile device (watchPosition) with Admin live map and Customer tracking view
 */
class GpsSocketService {
  constructor() {
    this.io = null;
    this.activeTrips = new Map(); // Key: tripId, Value: TripState
    this.initDefaultTrip();
  }

  initDefaultTrip() {
    const defaultTripId = 'trip-nh44-night-feeder';
    this.activeTrips.set(defaultTripId, {
      tripId: defaultTripId,
      routeName: 'Tirunelveli Central Feeder Dairy ➔ Kovilpatti Agency Shop (NH44)',
      vehicleNumber: 'TN-69-AV-2026 (Insulated Cold Chain Van)',
      driverName: 'S. Selvam',
      driverPhone: '9443299009',
      status: 'IN_TRANSIT', // 'WAITING' | 'IN_TRANSIT' | 'COMPLETED'
      currentPosition: {
        lat: 8.9568, // Kayathar Toll Plaza approx
        lng: 77.7744,
        speedKmh: 42,
        heading: 12,
        accuracyMeters: 5,
        timestamp: new Date().toISOString()
      },
      destination: {
        name: "Kuttiammal's Dairy Hub (Kovilpatti Shop)",
        lat: 9.1742,
        lng: 77.8732
      },
      origin: {
        name: 'Tirunelveli Central Feeder Dairy',
        lat: 8.7139,
        lng: 77.7567
      },
      breadcrumbs: [
        { lat: 8.7139, lng: 77.7567, timestamp: '06:00 PM' },
        { lat: 8.8475, lng: 77.7794, timestamp: '07:30 PM' },
        { lat: 8.9568, lng: 77.7744, timestamp: '09:00 PM' }
      ],
      totalDistanceKm: 58.0,
      remainingDistanceKm: 23.0,
      etaMinutes: 32,
      lastUpdated: new Date().toISOString(),
      isLiveDriverConnected: false
    });
  }

  /**
   * Initialize Socket.IO with Express HTTP Server
   */
  init(httpServer, corsOptions) {
    this.io = new Server(httpServer, {
      cors: corsOptions || {
        origin: '*',
        methods: ['GET', 'POST']
      },
      pingTimeout: 30000,
      pingInterval: 10000
    });

    this.io.on('connection', (socket) => {
      console.log(`📡 [Socket.IO]: Client connected: ${socket.id}`);

      // 1. Client joins tracking channel (Admin or Customer)
      socket.on('tracking:join', ({ tripId = 'trip-nh44-night-feeder' } = {}) => {
        socket.join(`trip:${tripId}`);
        const trip = this.activeTrips.get(tripId) || this.activeTrips.get('trip-nh44-night-feeder');
        socket.emit('tracking:initial-state', trip);
        console.log(`🗺️ [Socket.IO]: ${socket.id} joined tracking for ${tripId}`);
      });

      // 2. Driver starts broadcasting live GPS from mobile
      socket.on('driver:start-trip', (driverData) => {
        const tripId = driverData?.tripId || 'trip-nh44-night-feeder';
        socket.join(`trip:${tripId}`);
        socket.data.isDriver = true;
        socket.data.tripId = tripId;

        let trip = this.activeTrips.get(tripId);
        if (!trip) {
          this.initDefaultTrip();
          trip = this.activeTrips.get(tripId);
        }

        trip.isLiveDriverConnected = true;
        trip.driverSocketId = socket.id;
        if (driverData?.driverName) trip.driverName = driverData.driverName;
        if (driverData?.driverPhone) trip.driverPhone = driverData.driverPhone;
        trip.status = 'IN_TRANSIT';

        this.io.to(`trip:${tripId}`).emit('trip:driver-status', {
          isLiveDriverConnected: true,
          driverName: trip.driverName,
          status: 'LIVE_GPS_BROADCASTING'
        });

        console.log(`🚚 [Socket.IO]: Driver connected & broadcasting on ${tripId}`);
      });

      // 3. Driver sends real-time GPS coordinates (watchPosition stream)
      socket.on('driver:location-update', (gpsPayload) => {
        const tripId = socket.data.tripId || gpsPayload.tripId || 'trip-nh44-night-feeder';
        const trip = this.activeTrips.get(tripId);

        if (!trip) return;

        const { lat, lng, speed, heading, accuracy, battery } = gpsPayload;

        if (typeof lat !== 'number' || typeof lng !== 'number') return;

        // Calculate distance to destination (Haversine formula)
        const distToDest = this.calculateDistanceKm(lat, lng, trip.destination.lat, trip.destination.lng);
        const speedKmh = Math.max(0, Math.round(speed ? speed * 3.6 : (trip.currentPosition.speedKmh || 40)));
        const etaMinutes = speedKmh > 5 ? Math.round((distToDest / speedKmh) * 60) : Math.round((distToDest / 40) * 60);

        trip.currentPosition = {
          lat,
          lng,
          speedKmh,
          heading: heading || 0,
          accuracyMeters: accuracy || 5,
          battery: battery || 100,
          timestamp: new Date().toISOString()
        };

        trip.remainingDistanceKm = parseFloat(distToDest.toFixed(1));
        trip.etaMinutes = etaMinutes;
        trip.lastUpdated = new Date().toISOString();
        trip.isLiveDriverConnected = true;

        // Add breadcrumb (capped at 200 points to prevent memory leak)
        trip.breadcrumbs.push({ lat, lng, timestamp: new Date().toLocaleTimeString() });
        if (trip.breadcrumbs.length > 200) {
          trip.breadcrumbs.shift();
        }

        // Broadcast to all listening clients (Admins and Customers)
        this.io.to(`trip:${tripId}`).emit('van:location-update', {
          tripId,
          currentPosition: trip.currentPosition,
          remainingDistanceKm: trip.remainingDistanceKm,
          etaMinutes: trip.etaMinutes,
          breadcrumbs: trip.breadcrumbs,
          isLiveDriverConnected: true
        });
      });

      // 4. Driver completes trip / reaches shop
      socket.on('driver:end-trip', ({ tripId = 'trip-nh44-night-feeder' } = {}) => {
        const trip = this.activeTrips.get(tripId);
        if (trip) {
          trip.status = 'COMPLETED';
          trip.isLiveDriverConnected = false;
          trip.remainingDistanceKm = 0;
          trip.etaMinutes = 0;
          this.io.to(`trip:${tripId}`).emit('trip:completed', {
            tripId,
            message: 'Supply Van has arrived safely at Kovilpatti Agency Shop!'
          });
        }
      });

      // 5. Client Disconnect Handling
      socket.on('disconnect', () => {
        if (socket.data.isDriver) {
          const tripId = socket.data.tripId || 'trip-nh44-night-feeder';
          const trip = this.activeTrips.get(tripId);
          if (trip) {
            trip.isLiveDriverConnected = false;
            this.io.to(`trip:${tripId}`).emit('trip:driver-status', {
              isLiveDriverConnected: false,
              status: 'DRIVER_DISCONNECTED'
            });
          }
          console.log(`🚚 [Socket.IO]: Driver disconnected from ${tripId}`);
        }
        console.log(`🔌 [Socket.IO]: Client disconnected: ${socket.id}`);
      });
    });

    console.log('🛰️ [GpsSocketService]: Initialized Socket.IO Live Telemetry Engine');
  }

  /**
   * Helper: Calculate Haversine Distance in Kilometers
   */
  calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  getTripState(tripId = 'trip-nh44-night-feeder') {
    return this.activeTrips.get(tripId) || this.activeTrips.get('trip-nh44-night-feeder');
  }
}

export const gpsSocketService = new GpsSocketService();
