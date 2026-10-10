import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Map, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ThermometerSnowflake,
  Package,
  ArrowRight,
  Radio,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Gauge
} from 'lucide-react';

export const RouteOptimizer = () => {
  const { showNotification } = useShop();

  // Highway Waypoints from Tirunelveli Central Dairy to Kovilpatti Agency Shop (58 km on NH44) - Night Delivery Schedule
  const checkpoints = [
    { id: 'cp1', name: 'Tirunelveli Central Feeder Dairy', area: 'Union Dispatch Yard', distanceKm: 0, time: '06:00 PM', status: 'Passed', x: 50, y: 220 },
    { id: 'cp2', name: 'Gangaikondan Checkpoint', area: 'SIPCOT Industrial Zone', distanceKm: 18, time: '07:30 PM', status: 'Passed', x: 190, y: 160 },
    { id: 'cp3', name: 'Kayathar Toll Plaza', area: 'NH44 Highway Junction', distanceKm: 35, time: '09:00 PM', status: 'Current', x: 350, y: 200 },
    { id: 'cp4', name: 'Kovilpatti Bypass', area: 'Inam Maniyachi Ring Road', distanceKm: 52, time: '10:15 PM', status: 'Upcoming', x: 510, y: 130 },
    { id: 'cp5', name: "Kuttiammal's Dairy Hub (Our Shop)", area: 'Kovilpatti Main Bazaar', distanceKm: 58, time: '10:45 PM', status: 'Destination', x: 650, y: 170 },
  ];

  const totalDistanceKm = 58;

  // Real-time smooth moving progress (starts at 32% on Gangaikondan-Kayathar segment)
  const [progressPercent, setProgressPercent] = useState(32);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1 = very slow realistic live pace, 3 = fast preview
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(42);

  // Smooth continuous slow-speed animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 60; // 60ms interval for smooth fluid movement
    const step = 0.012 * speedMultiplier; // Slow, calm highway pace

    const timer = setInterval(() => {
      setProgressPercent(prev => {
        if (prev >= 100) {
          // Van has reached Kovilpatti shop! Loop back to Tirunelveli Dairy for continuous live tracking
          return 0;
        }
        return parseFloat((prev + step).toFixed(3));
      });

      // Subtle realistic speed fluctuations on NH44 highway (39 - 45 km/h)
      setCurrentSpeedKmh(Math.floor(41 + (Math.sin(Date.now() / 2500) * 4)));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speedMultiplier]);

  // Compute live (x, y) coordinates of the truck on SVG map
  const calculateTruckPosition = (pct) => {
    const totalSegments = checkpoints.length - 1;
    const clampedPct = Math.min(100, Math.max(0, pct));
    const segmentIndex = Math.min(Math.floor((clampedPct / 100) * totalSegments), totalSegments - 1);
    const segmentProgress = ((clampedPct / 100) * totalSegments) - segmentIndex;

    const p1 = checkpoints[segmentIndex];
    const p2 = checkpoints[segmentIndex + 1];

    const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
    const currentY = p1.y + (p2.y - p1.y) * segmentProgress;

    return { x: currentX, y: currentY };
  };

  const truckPos = calculateTruckPosition(progressPercent);
  const currentDistanceKm = ((progressPercent / 100) * totalDistanceKm).toFixed(1);
  const remainingDistanceKm = Math.max(0, (totalDistanceKm - currentDistanceKm)).toFixed(1);
  
  // Remaining ETA in minutes
  const remainingMinutes = Math.max(0, Math.round((remainingDistanceKm / 40) * 60));

  const isArrived = progressPercent >= 98;

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-sky-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-emerald-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Live Night Route GPS</span>
            </span>
            <span className="text-xs text-emerald-200 font-medium">
              Tirunelveli ➔ Kovilpatti (06:00 PM – 10:45 PM Night Feeder)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Aavin Night Supply Van Live Tracker</h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Live real-time telemetry of insulated supply van bringing tomorrow's fresh milk & curd crates along NH44 to our Kovilpatti shop for morning distribution.
          </p>
        </div>

        {/* Live Arrival ETA Pill */}
        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-emerald-100 uppercase font-black tracking-wider block">Night Arrival Status</span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            {isArrived ? 'Arrived at Shop 🏪' : `ETA: ${remainingMinutes} Mins`}
          </div>
          <span className="text-[10px] text-emerald-200 font-bold block mt-0.5">
            {isArrived ? '10:45 PM • Ready for Morning Stock Prep' : `${remainingDistanceKm} km away • Expected by 10:45 PM`}
          </span>
        </div>
      </div>

      {/* 2. Quick Vehicle & Driver Info Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supply Vehicle</span>
            <div className="text-sm font-black text-slate-900 font-mono mt-0.5">TN-72-B-4412</div>
            <span className="text-xs text-emerald-700 font-bold">Aavin Insulated Milk Van</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Feeder Driver</span>
            <div className="text-sm font-black text-slate-900 mt-0.5">Thiru. R. Shanmugam</div>
            <span className="text-xs text-slate-500 font-mono">+91 94431 54321</span>
          </div>
          <a
            href="tel:+919443154321"
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs"
            title="Call Driver"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cargo Onboard</span>
            <div className="text-sm font-black text-slate-900 mt-0.5">23 Crates (550 Packets)</div>
            <span className="text-xs text-cyan-700 font-medium font-mono flex items-center gap-1">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" />
              <span>Chamber Temp: 3.5°C</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. Live Highway Map Canvas with Moving Van */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-600" />
              <span>NH44 Highway Route Map (Tirunelveli ➔ Kovilpatti)</span>
            </h3>
            <p className="text-xs text-slate-500">Live night GPS telemetry moving continuously at a calm, realistic highway pace (06:00 PM – 10:45 PM)</p>
          </div>

          {/* Interactive Simulation Playback Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                isPlaying
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Tracking</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume Live Move</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 3 : 1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                speedMultiplier === 1
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-indigo-50 text-indigo-900 border-indigo-300'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{speedMultiplier === 1 ? '🐢 Realistic Slow Pace' : '⚡ 3x Speed'}</span>
            </button>

            <button
              onClick={() => {
                setProgressPercent(0);
                showNotification('🔄 Reset van location to Tirunelveli Central Feeder Dairy (06:00 PM Departure)');
              }}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-200"
              title="Restart from Tirunelveli Dairy (06:00 PM)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Night Move 🟢</span>
            </div>
          </div>
        </div>

        {/* Real-time Map Canvas */}
        <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-slate-950 via-[#0a192f] to-slate-900 rounded-2xl relative overflow-hidden shadow-inner border border-slate-800">
          
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          {/* SVG Road Network */}
          <svg className="w-full h-full" viewBox="0 0 700 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="nh44Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="35%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Highway Asphalt */}
            <path
              d="M 50 220 Q 120 180 190 160 T 350 200 T 510 130 T 650 170"
              fill="none"
              stroke="#334155"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Active Highway */}
            <path
              d="M 50 220 Q 120 180 190 160 T 350 200 T 510 130 T 650 170"
              fill="none"
              stroke="url(#nh44Gradient)"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
              filter="url(#roadGlow)"
              className="animate-pulse"
            />

            {/* Waypoint Checkpoints */}
            {checkpoints.map((pt, i) => {
              const isPassed = (i / (checkpoints.length - 1)) * 100 <= progressPercent;
              const isShop = i === checkpoints.length - 1;
              const isOrigin = i === 0;

              return (
                <g 
                  key={pt.id} 
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer"
                  onClick={() => {
                    const targetPct = (i / (checkpoints.length - 1)) * 100;
                    setProgressPercent(targetPct);
                    showNotification(`📍 Van jumped to ${pt.name} (${pt.time})`);
                  }}
                >
                  <circle
                    r={isShop || isOrigin ? 11 : 8}
                    fill={isShop ? '#10b981' : isPassed ? '#0284c7' : '#64748b'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="shadow-lg hover:scale-125 transition-transform"
                  />
                  <text
                    y={i % 2 === 0 ? 25 : -15}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {isOrigin ? '🏢 Tirunelveli Dairy' : isShop ? '🏪 Kovilpatti Shop' : pt.name}
                  </text>
                  <text
                    y={i % 2 === 0 ? 37 : -27}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    ({pt.distanceKm} km • {pt.time})
                  </text>
                </g>
              );
            })}

            {/* LIVE ANIMATED MOVING DELIVERY VAN */}
            <g
              transform={`translate(${truckPos.x - 22}, ${truckPos.y - 28})`}
              style={{ transition: 'transform 60ms linear' }}
            >
              {/* Pulsing Radar Circle */}
              <circle cx="22" cy="16" r="22" fill="#38bdf8" opacity="0.25" className="animate-ping" />

              {/* Van Body */}
              <rect x="0" y="6" width="32" height="18" rx="3" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
              
              {/* Windshield */}
              <path d="M 22 8 L 30 8 L 30 15 L 22 15 Z" fill="#bae6fd" />
              
              {/* Loaded Milk Crates on Roof/Flatbed */}
              <rect x="3" y="9" width="5" height="5" fill="#a855f7" rx="1" />
              <rect x="9" y="9" width="5" height="5" fill="#f97316" rx="1" />
              <rect x="15" y="9" width="5" height="5" fill="#38bdf8" rx="1" />

              {/* Headlights Light Beam */}
              <polygon points="30,10 46,4 46,22 30,16" fill="#fef08a" opacity="0.4" />

              {/* Wheels */}
              <circle cx="7" cy="24" r="3.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="25" cy="24" r="3.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />

              {/* Floating Vehicle Badge */}
              <rect x="-8" y="-14" width="62" height="14" rx="4" fill="#0f172a" opacity="0.9" stroke="#38bdf8" strokeWidth="1" />
              <text x="23" y="-4" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                🥛 Aavin Supply
              </text>
            </g>
          </svg>

          {/* Live Telemetry Overlay HUD (Bottom Left) */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl text-white text-xs space-y-1.5 shadow-lg max-w-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-amber-300 font-black flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-400" />
                <span>TN-72-B-4412</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {currentSpeedKmh} km/h (NH44)
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono flex justify-between">
              <span>Passed: <strong>{currentDistanceKm} / {totalDistanceKm} km</strong></span>
              <span>Trip: <strong>{progressPercent.toFixed(0)}%</strong></span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Live Location: {progressPercent < 20 ? 'Near Gangaikondan (07:30 PM)' : progressPercent < 60 ? 'Crossing Kayathar Toll (09:00 PM)' : progressPercent < 90 ? 'Entering Kovilpatti Bypass (10:15 PM)' : 'Arrived at Kuttiammal Dairy Hub (10:45 PM) 🏪'}
            </div>
          </div>

          {/* Next Checkpoint Alert (Bottom Right) */}
          <div className="absolute bottom-3 right-3 hidden sm:block bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl text-white text-xs text-right shadow-lg">
            <span className="text-[10px] text-slate-400 uppercase font-black block">Next Destination</span>
            <div className="font-black text-emerald-300">
              {progressPercent < 30 ? 'Gangaikondan (07:30 PM)' : progressPercent < 60 ? 'Kayathar Toll (09:00 PM)' : progressPercent < 90 ? 'Kovilpatti Bypass (10:15 PM)' : "Kuttiammal's Dairy Shop (10:45 PM) 🏪"}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Checkpoints Journey Timeline Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Night Route Waypoint Timeline (Click any to jump)</span>
            </h3>
            <p className="text-xs text-slate-500">Scheduled night feeder timeline from Tirunelveli Dairy (06:00 PM) to Kovilpatti (10:45 PM)</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
            58.0 km Highway Total
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {checkpoints.map((cp, idx) => {
            const isPassed = (idx / (checkpoints.length - 1)) * 100 <= progressPercent;

            return (
              <div
                key={cp.id}
                onClick={() => {
                  const targetPct = (idx / (checkpoints.length - 1)) * 100;
                  setProgressPercent(targetPct);
                  showNotification(`📍 Van jumped to ${cp.name} (${cp.time})`);
                }}
                className={`p-4 rounded-2xl border-2 transition space-y-2 cursor-pointer hover:shadow-md ${
                  isPassed
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                    isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isPassed ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isPassed ? 'Passed ✅' : 'Upcoming'}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-xs text-slate-900 truncate">{cp.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{cp.area}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">{cp.distanceKm} km</span>
                  <strong className="text-emerald-900 font-black">{cp.time}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
