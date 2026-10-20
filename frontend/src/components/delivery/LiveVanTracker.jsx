import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Radio, 
  Truck, 
  MapPin, 
  Navigation, 
  Gauge, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Zap,
  ThermometerSnowflake,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

// Checkpoints along NH44
const CHECKPOINTS = [
  { id: 'cp1', name: 'Tirunelveli Central Dairy', area: 'Union Dispatch Yard', distanceKm: 0, time: '06:00 PM', lat: 8.7139, lng: 77.7567 },
  { id: 'cp2', name: 'Gangaikondan Checkpoint', area: 'SIPCOT Industrial Zone', distanceKm: 18, time: '07:30 PM', lat: 8.8475, lng: 77.7794 },
  { id: 'cp3', name: 'Kayathar Toll Plaza', area: 'NH44 Highway Junction', distanceKm: 35, time: '09:00 PM', lat: 8.9568, lng: 77.7744 },
  { id: 'cp4', name: 'Kovilpatti Bypass', area: 'Inam Maniyachi Ring Road', distanceKm: 52, time: '10:15 PM', lat: 9.1725, lng: 77.8682 },
  { id: 'cp5', name: "Kuttiammal's Dairy Hub", area: 'Kovilpatti Main Bazaar', distanceKm: 58, time: '10:45 PM', lat: 9.1742, lng: 77.8732 },
];

export const LiveVanTracker = () => {
  const { showNotification } = useShop();
  
  // Socket.IO State
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLiveDriverConnected, setIsLiveDriverConnected] = useState(false);
  const socketRef = useRef(null);

  // Telemetry State
  const [currentPos, setCurrentPos] = useState({ lat: 8.9568, lng: 77.7744, speedKmh: 42, heading: 15 });
  const [remainingDistanceKm, setRemainingDistanceKm] = useState(23.0);
  const [etaMinutes, setEtaMinutes] = useState(32);
  const [cargoTemp, setCargoTemp] = useState(3.4);
  const [breadcrumbs, setBreadcrumbs] = useState([
    { lat: 8.7139, lng: 77.7567 },
    { lat: 8.8475, lng: 77.7794 },
    { lat: 8.9568, lng: 77.7744 }
  ]);

  // Driver Mode State (watchPosition on real mobile/laptop GPS)
  const [isDriverBroadcasting, setIsDriverBroadcasting] = useState(false);
  const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState(null);
  const [gpsWatchId, setGpsWatchId] = useState(null);

  // Simulation Fallback State
  const [isSimulating, setIsSimulating] = useState(true);
  const [progressPercent, setProgressPercent] = useState(48);

  // Leaflet Map Container Ref
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const vanMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  // 1. Initialize Socket.IO connection to Backend
  useEffect(() => {
    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('tracking:join', { tripId: 'trip-nh44-night-feeder' });
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('tracking:initial-state', (trip) => {
      if (trip && trip.currentPosition) {
        setCurrentPos(trip.currentPosition);
        setRemainingDistanceKm(trip.remainingDistanceKm || 23.0);
        setEtaMinutes(trip.etaMinutes || 32);
        setIsLiveDriverConnected(Boolean(trip.isLiveDriverConnected));
        if (trip.breadcrumbs) setBreadcrumbs(trip.breadcrumbs);
      }
    });

    socket.on('van:location-update', (data) => {
      if (data && data.currentPosition) {
        setCurrentPos(data.currentPosition);
        setRemainingDistanceKm(data.remainingDistanceKm);
        setEtaMinutes(data.etaMinutes);
        setIsLiveDriverConnected(true);
        if (data.breadcrumbs) setBreadcrumbs(data.breadcrumbs);
      }
    });

    socket.on('trip:driver-status', (status) => {
      setIsLiveDriverConnected(Boolean(status.isLiveDriverConnected));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    let mapInstance = null;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      try {
        const L = (await import('leaflet')).default;

        // Cleanup existing map if any
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }

        // Create Leaflet Map centered between Tirunelveli and Kovilpatti
        mapInstance = L.map(mapContainerRef.current, {
          center: [8.944, 77.815],
          zoom: 10,
          zoomControl: true
        });

        leafletMapRef.current = mapInstance;

        // OpenStreetMap CartoDB Positron / OSM Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18
        }).addTo(mapInstance);

        // Highway Route Coordinates
        const routeCoords = CHECKPOINTS.map(cp => [cp.lat, cp.lng]);

        // Route Polyline (Highway Track)
        L.polyline(routeCoords, {
          color: '#0284c7',
          weight: 6,
          opacity: 0.7,
          dashArray: '8, 8'
        }).addTo(mapInstance);

        // Checkpoint Markers
        CHECKPOINTS.forEach((cp, idx) => {
          const isOrigin = idx === 0;
          const isDest = idx === CHECKPOINTS.length - 1;

          const markerHtml = `
            <div style="
              background: ${isDest ? '#10b981' : isOrigin ? '#3b82f6' : '#64748b'};
              color: white;
              font-weight: 900;
              font-size: 11px;
              padding: 4px 8px;
              border-radius: 12px;
              border: 2px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              white-space: nowrap;
              text-align: center;
            ">
              ${isDest ? '🏪 Shop (Destination)' : isOrigin ? '🥛 Tirunelveli Dairy' : cp.name}
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'checkpoint-marker',
            iconSize: [120, 30],
            iconAnchor: [60, 15]
          });

          L.marker([cp.lat, cp.lng], { icon: customIcon })
            .addTo(mapInstance)
            .bindPopup(`<strong>${cp.name}</strong><br/>${cp.area}<br/>Expected: ${cp.time}`);
        });

        // Van Custom Animated SVG Icon
        const vanHtml = `
          <div style="position: relative; width: 44px; height: 44px;">
            <div style="
              position: absolute;
              inset: -8px;
              border-radius: 50%;
              background: rgba(16, 185, 129, 0.35);
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              position: relative;
              width: 44px;
              height: 44px;
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              border: 3px solid white;
              border-radius: 14px;
              box-shadow: 0 8px 16px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 20px;
            ">
              🚚
            </div>
          </div>
        `;

        const vanIcon = L.divIcon({
          html: vanHtml,
          className: 'van-live-marker',
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const vanMarker = L.marker([currentPos.lat, currentPos.lng], { icon: vanIcon }).addTo(mapInstance);
        vanMarkerRef.current = vanMarker;
        vanMarker.bindPopup(`<strong>Aavin Insulated Van (TN-69-AV-2026)</strong><br/>Driver: S. Selvam<br/>Temp: ${cargoTemp}°C`);

      } catch (err) {
        console.error('[Leaflet Map Init Error]:', err);
      }
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // 3. Update Van Marker Position on Map when currentPos changes
  useEffect(() => {
    if (vanMarkerRef.current && currentPos.lat && currentPos.lng) {
      vanMarkerRef.current.setLatLng([currentPos.lat, currentPos.lng]);
    }
  }, [currentPos]);

  // 4. Smooth Highway Simulation Loop (Active when Driver is not broadcasting)
  useEffect(() => {
    if (isDriverBroadcasting || !isSimulating) return;

    const interval = setInterval(() => {
      setProgressPercent(prev => {
        const next = prev >= 100 ? 0 : parseFloat((prev + 0.15).toFixed(2));
        
        // Compute lat/lng along highway checkpoints
        const totalSegments = CHECKPOINTS.length - 1;
        const segmentIndex = Math.min(Math.floor((next / 100) * totalSegments), totalSegments - 1);
        const segmentProgress = ((next / 100) * totalSegments) - segmentIndex;

        const p1 = CHECKPOINTS[segmentIndex];
        const p2 = CHECKPOINTS[segmentIndex + 1];

        const lat = p1.lat + (p2.lat - p1.lat) * segmentProgress;
        const lng = p1.lng + (p2.lng - p1.lng) * segmentProgress;
        const remainingKm = parseFloat((58 * (1 - next / 100)).toFixed(1));
        const remMins = Math.max(0, Math.round((remainingKm / 42) * 60));

        setCurrentPos({ lat, lng, speedKmh: Math.floor(40 + Math.sin(Date.now() / 2000) * 4), heading: 18 });
        setRemainingDistanceKm(remainingKm);
        setEtaMinutes(remMins);

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDriverBroadcasting, isSimulating]);

  // 5. Driver Real Mobile GPS Broadcasting (navigator.geolocation.watchPosition)
  const toggleDriverGpsBroadcasting = () => {
    if (isDriverBroadcasting) {
      // Stop broadcasting
      if (gpsWatchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(gpsWatchId);
        setGpsWatchId(null);
      }
      setIsDriverBroadcasting(false);
      socketRef.current?.emit('driver:end-trip', { tripId: 'trip-nh44-night-feeder' });
      showNotification('Driver GPS Broadcasting Stopped.');
    } else {
      // Start broadcasting
      if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser.', 'error');
        return;
      }

      showNotification('Starting Real Mobile GPS Telemetry Broadcast...');
      setIsDriverBroadcasting(true);
      setIsSimulating(false);

      socketRef.current?.emit('driver:start-trip', {
        tripId: 'trip-nh44-night-feeder',
        driverName: 'S. Selvam (Route Driver)',
        driverPhone: '9443299009'
      });

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, heading, accuracy } = position.coords;
          setGpsAccuracyMeters(Math.round(accuracy));

          const payload = {
            tripId: 'trip-nh44-night-feeder',
            lat: latitude,
            lng: longitude,
            speed: speed || 11.5, // m/s
            heading: heading || 0,
            accuracy: accuracy || 5,
            timestamp: new Date().toISOString()
          };

          socketRef.current?.emit('driver:location-update', payload);
        },
        (error) => {
          console.warn('[Driver Geolocation Error]:', error.message);
          showNotification(`GPS Broadcast Notice: ${error.message}.`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      setGpsWatchId(watchId);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-5 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{isDriverBroadcasting ? 'Driver Mobile GPS Live' : isLiveDriverConnected ? 'Live Driver Stream' : 'Live Highway GPS Engine'}</span>
            </span>
            <span className="text-xs text-emerald-200 font-semibold flex items-center gap-1">
              {socketConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Socket.IO Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reconnecting Socket...</span>
                </>
              )}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">Aavin Night Supply Van Live GPS</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Insulated cold-chain supply van (TN-69-AV-2026) carrying tomorrow's morning milk & curd crates along NH44 to our Kovilpatti shop.
          </p>
        </div>

        {/* Live Status & ETA Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl text-center shadow-lg shrink-0">
          <span className="text-[10px] text-emerald-200 uppercase font-black tracking-wider block">Arrival Telemetry</span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
            {remainingDistanceKm <= 0.5 ? 'Arrived at Shop 🏪' : `ETA: ${etaMinutes} Mins`}
          </div>
          <span className="text-xs text-emerald-300 font-bold block mt-1">
            {remainingDistanceKm} km remaining • Speed: {currentPos.speedKmh || 42} km/h
          </span>
        </div>
      </div>

      {/* 2. Driver Geolocation Mobile Broadcaster Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${isDriverBroadcasting ? 'bg-emerald-600 animate-pulse' : 'bg-slate-800'}`}>
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">Driver Mobile GPS Telemetry</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDriverBroadcasting ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                {isDriverBroadcasting ? 'Broadcasting Real watchPosition()' : 'Standby Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isDriverBroadcasting ? `GPS Accuracy: ±${gpsAccuracyMeters || 5} meters • Streaming coordinates to Socket.IO` : 'Driver can toggle this on mobile phone to transmit real-time satellite coordinates'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={toggleDriverGpsBroadcasting}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2 ${
              isDriverBroadcasting 
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>{isDriverBroadcasting ? 'Stop GPS Broadcast' : 'Start Driver GPS Broadcast'}</span>
          </button>
        </div>
      </div>

      {/* 3. Interactive Leaflet Map Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
              OpenStreetMap NH44 Highway Route (Tirunelveli ➔ Kovilpatti)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Lat: {currentPos.lat.toFixed(4)}</span>
            <span>•</span>
            <span>Lng: {currentPos.lng.toFixed(4)}</span>
          </div>
        </div>

        {/* The Leaflet DOM element */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10"
        />
      </div>

      {/* 4. Live Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Gauge className="w-4 h-4 text-blue-500" />
            <span>Vehicle Speed</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {currentPos.speedKmh || 42} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">Smooth NH44 Flow</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <ThermometerSnowflake className="w-4 h-4 text-sky-500" />
            <span>Cargo Bay Temp</span>
          </div>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono mt-1">
            {cargoTemp}°C
          </div>
          <span className="text-[10px] text-sky-500 font-bold block mt-0.5">Insulated Milk Chiller Optimal</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Navigation className="w-4 h-4 text-emerald-500" />
            <span>Remaining Track</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {remainingDistanceKm} <span className="text-xs text-slate-400 font-normal">km</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Total Route: 58 km</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Truck className="w-4 h-4 text-indigo-500" />
            <span>Assigned Vehicle</span>
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white font-mono mt-1">
            TN-69-AV-2026
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Driver: S. Selvam (+91 94432 99009)</span>
        </div>

      </div>

      {/* 5. Checkpoints Stepper */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="font-black text-xs uppercase tracking-wider text-slate-500">Route Waypoints & Scheduled Timings</h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {CHECKPOINTS.map((cp, idx) => {
            const isPassed = idx <= 2;
            const isCurrent = idx === 2;
            return (
              <div 
                key={cp.id}
                className={`p-3 rounded-2xl border text-xs transition ${
                  isCurrent 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-700' 
                    : isPassed 
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{cp.time}</span>
                  {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="font-black text-slate-900 dark:text-white mt-1">{cp.name}</div>
                <div className="text-[10px] text-slate-500">{cp.distanceKm} km from Dairy</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
