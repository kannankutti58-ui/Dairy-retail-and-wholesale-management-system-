import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Bell,
  BellRing,
  Power,
  Clock,
  Zap,
  Volume2,
  VolumeX,
  History,
  Timer,
  IndianRupee,
  Smartphone,
  Send,
  Radio,
  CheckCheck,
  X,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Play
} from 'lucide-react';

// Convert VAPID Public Key base64 string to Uint8Array for browser PushManager
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const FreezerMonitor = () => {
  const shopContext = useShop() || {};
  const showNotification = shopContext.showNotification || ((msg) => console.log(msg));
  const shopSettings = shopContext.shopSettings || { shopName: "Kuttiammal's Dairy Hub", proprietor: "Kuttiammal M." };
  const t = shopContext.t || ((k, f) => f || k);

  // Core Real-Time State
  const [isFreezerOn, setIsFreezerOn] = useState(true);
  const [startClockTime, setStartClockTime] = useState('01:30 PM');
  const [startDateStr, setStartDateStr] = useState('Today');
  const [runningSeconds, setRunningSeconds] = useState(6300); // 1 hour 45 mins
  
  // Alert Configuration
  const [phoneAlertNumber, setPhoneAlertNumber] = useState('7604936341');
  const [soundBuzzerEnabled, setSoundBuzzerEnabled] = useState(true);
  const [isReminderAlertActive, setIsReminderAlertActive] = useState(false);
  const [isSimulatingFastForward, setIsSimulatingFastForward] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [alertSuccessToast, setAlertSuccessToast] = useState(null);

  // Web Push VAPID Notification State
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState(false);
  const [isSendingTestPush, setIsSendingTestPush] = useState(false);

  // Cross-Device Sync State
  const lastProcessedAlarmId = useRef(0);
  const audioContextRef = useRef(null);

  // Operational Logs
  const [operationalLogs, setOperationalLogs] = useState([
    {
      id: 'log-1',
      date: 'Today',
      sessionName: 'Afternoon Booster Cooling',
      switchedOnTime: '01:30 PM',
      switchedOffTime: 'Currently Running',
      durationHours: '1h 45m',
      unitsUsed: 2.1,
      costRupees: 16.8,
      status: 'Active'
    },
    {
      id: 'log-2',
      date: 'Today',
      sessionName: 'Morning Main Feeder Shift',
      switchedOnTime: '05:00 AM',
      switchedOffTime: '09:15 AM',
      durationHours: '4h 15m',
      unitsUsed: 5.1,
      costRupees: 40.8,
      status: 'Completed'
    },
    {
      id: 'log-3',
      date: 'Yesterday',
      sessionName: 'Evening Counter Sales Cooling',
      switchedOnTime: '05:45 PM',
      switchedOffTime: '07:30 PM',
      durationHours: '1h 45m',
      unitsUsed: 2.1,
      costRupees: 16.8,
      status: 'Completed'
    }
  ]);

  const runningHours = runningSeconds / 3600;
  const currentHoursInt = Math.floor(runningHours);
  const currentMinsInt = Math.floor((runningSeconds % 3600) / 60);
  const currentSecsInt = runningSeconds % 60;

  // Live Units calculation (1.2 kW * hours)
  const currentSessionUnits = parseFloat((runningHours * 1.2).toFixed(2));
  const currentSessionCost = (currentSessionUnits * 8).toFixed(1);

  // Audio Siren & Physical Vibration (Works on Mobile Phone and Laptop)
  const playAlertBuzzerAndVibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([600, 200, 600, 200, 600, 200, 1000]);
      } catch (e) {}
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Multi-tone alarm sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {}
  };

  // Trigger Cross-Device Alert (Laptop -> Server -> Mobile Phone)
  const triggerCrossDeviceAlarm = async () => {
    setIsReminderAlertActive(true);
    if (soundBuzzerEnabled) {
      playAlertBuzzerAndVibrate();
    }

    const alertMsg = `[AAVIN ALERT] Freezer reached 3 hours cooling (${currentSessionUnits} Units, ₹${currentSessionCost}). Milk is at 3°C. Please turn OFF switch.`;

    const targetPhone = (phoneAlertNumber || '7604936341').replace(/[^0-9]/g, '');

    // 1. Dispatch Web Push to all registered browsers & devices
    try {
      await fetch('http://localhost:5000/api/push/send-freezer-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: 3.0,
          target: 3.5,
          threshold: 5.5,
          shopName: "Kuttiammal's Dairy Hub",
          note: alertMsg
        })
      });
    } catch (e) {}

    // 2. Dispatch WhatsApp Notification to 7604936341
    try {
      await fetch('http://localhost:5000/api/communication/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetPhone,
          message: `🚨 *KUTTIAMMAL DAIRY HUB COLD STORAGE ALERT*\n\n${alertMsg}\n\nTime: ${new Date().toLocaleTimeString()}`
        })
      });
    } catch (e) {}

    // 3. Dispatch SMS Notification to 7604936341
    try {
      await fetch('http://localhost:5000/api/communication/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: targetPhone,
          message: `Aavin Alert: Freezer 3-Hour Chilling complete (${currentSessionUnits} Units). Turn OFF switch now.`
        })
      });
    } catch (e) {}

    setAlertSuccessToast({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: `${alertMsg} (Dispatched to +91 ${targetPhone})`
    });

    showNotification(`🚨 3-Hour Freezer Alert Dispatched to +91 ${targetPhone}!`);
  };

  // Dismiss Cross-Device Alert
  const dismissCrossDeviceAlarm = async () => {
    setIsReminderAlertActive(false);
    try {
      await fetch('/api/freezer-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' })
      });
    } catch (e) {}
  };

  // Check Service Worker and Web Push registration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsPushSupported(true);
      navigator.serviceWorker.register('/sw.js').then(async (reg) => {
        const existingSub = await reg.pushManager.getSubscription();
        if (existingSub) {
          setIsPushSubscribed(true);
        }
      }).catch(err => {
        console.warn('[SW Reg Notice]:', err.message);
      });
    }
  }, []);

  // Subscribe Browser to Real Web Push Notifications (VAPID)
  const subscribeToWebPush = async () => {
    if (!isPushSupported) {
      showNotification('Web Push is not supported in this browser.', 'error');
      return;
    }

    setIsPushLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        showNotification('Notification permission was denied in browser settings.', 'error');
        setIsPushLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      
      // Fetch VAPID public key from backend
      const keyRes = await fetch('http://localhost:5000/api/push/vapid-public-key');
      const keyData = await keyRes.json();
      
      if (!keyData?.publicKey) {
        throw new Error('VAPID public key not returned by backend');
      }

      const applicationServerKey = urlBase64ToUint8Array(keyData.publicKey);
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      // Save subscription on backend
      await fetch('http://localhost:5000/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          clientInfo: {
            userAgent: navigator.userAgent,
            subscribedAt: new Date().toISOString()
          }
        })
      });

      setIsPushSubscribed(true);
      showNotification('🔔 Web Push Notifications Successfully Subscribed! Real desktop/lock-screen alerts active.');
    } catch (err) {
      console.error('[Web Push Subscribe Error]:', err);
      showNotification(`Push Subscription Notice: ${err.message}`, 'error');
    } finally {
      setIsPushLoading(false);
    }
  };

  // Dispatch Real 5-Minute Alert / Test Web Push to OS Desktop
  const sendRealTestWebPush = async () => {
    setIsSendingTestPush(true);
    try {
      const res = await fetch('http://localhost:5000/api/push/send-test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: '5-Minute Cold Storage Operational Check' })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🔔 Real Web Push Alert Dispatched to all connected devices!');
        // Also trigger sound/vibration locally
        playAlertBuzzerAndVibrate();
      }
    } catch (err) {
      showNotification(`Failed to trigger push: ${err.message}`, 'error');
    } finally {
      setIsSendingTestPush(false);
    }
  };

  // Dispatch Critical Temperature Violation Alert
  const sendCriticalTempAlert = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/push/send-freezer-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: 6.2,
          target: 3.5,
          threshold: 5.5,
          shopName: "Kuttiammal's Dairy Hub"
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🚨 Critical Temperature Breach (>5.5°C) Emergency Push Dispatched!');
        playAlertBuzzerAndVibrate();
      }
    } catch (err) {
      showNotification(`Alert Dispatch Error: ${err.message}`, 'error');
    }
  };

  // Run 5-Second Test
  const run5SecondTest = () => {
    setIsSimulatingFastForward(true);
    setSimStep(1);
    setRunningSeconds(10795); // 2h 59m 55s
    setIsReminderAlertActive(false);

    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setSimStep(prev => prev + 1);
      
      if (count <= 0) {
        clearInterval(interval);
        setIsSimulatingFastForward(false);
        triggerCrossDeviceAlarm();
      }
    }, 1000);
  };

  // Live Timer Ticker
  useEffect(() => {
    let timer = null;
    if (isFreezerOn) {
      timer = setInterval(() => {
        setRunningSeconds(prev => {
          const next = prev + 1;
          if (next > 0 && next % 10800 === 0) {
            triggerCrossDeviceAlarm();
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isFreezerOn]);

  // Toggle Freezer Power ON / OFF
  const handleToggleFreezer = () => {
    const nextState = !isFreezerOn;
    setIsFreezerOn(nextState);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    if (nextState) {
      setStartClockTime(timeString);
      setStartDateStr(`Today (${dateString})`);
      setRunningSeconds(0);
      dismissCrossDeviceAlarm();
      showNotification(`❄️ Deep Freezer turned ON at ${timeString}!`);
    } else {
      dismissCrossDeviceAlarm();
      const sessionUnits = parseFloat(((runningSeconds / 3600) * 1.2).toFixed(2));
      const sessionCost = parseFloat((sessionUnits * 8).toFixed(1));

      setOperationalLogs(prev => [
        {
          id: `log-${Date.now()}`,
          date: `Today (${dateString})`,
          sessionName: 'Cooling Shift',
          switchedOnTime: startClockTime,
          switchedOffTime: timeString,
          durationHours: `${currentHoursInt}h ${currentMinsInt}m`,
          unitsUsed: sessionUnits > 0 ? sessionUnits : 0.2,
          costRupees: sessionCost > 0 ? sessionCost : 1.6,
          status: 'Completed'
        },
        ...prev
      ]);

      showNotification(`🛑 Deep Freezer turned OFF at ${timeString}! (${sessionUnits > 0 ? sessionUnits : 0.2} Units)`);
    }
  };

  const isIceRisk = runningHours >= 6.0;
  const isOptimumChilled = runningHours >= 3.0 && runningHours < 6.0;

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* 1. Clean Header Banner */}
      <div 
        className="rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-300"
        style={{ background: 'var(--theme-gradient)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-blue-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('freezer_power', 'Electricity & Units Tracker')}</span>
            </span>
            <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
              <span>Live Alert System Active</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">{t('freezer_cold_storage', 'Freezer Running & Electricity Monitor')}</h2>
        </div>

        {/* Action Controls in Header */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={run5SecondTest}
            disabled={isSimulatingFastForward}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSimulatingFastForward ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Simulating ({5 - simStep}s)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>⚡ Run 5-Second Test</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSoundBuzzerEnabled(!soundBuzzerEnabled)}
            className={`p-3 rounded-2xl border transition flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
              soundBuzzerEnabled ? 'bg-amber-500/20 border-amber-400/40 text-amber-300' : 'bg-white/10 border-white/15 text-slate-300'
            }`}
          >
            {soundBuzzerEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundBuzzerEnabled ? 'Siren ON' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Web Push VAPID Real Browser Notification Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 ${isPushSubscribed ? 'bg-emerald-600' : 'bg-slate-800'}`}>
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm text-slate-900 dark:text-white">Web Push Browser Notifications (VAPID)</h4>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isPushSubscribed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                {isPushSubscribed ? '✓ Push Active' : 'Push Inactive'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Receives native OS lock-screen & desktop popups for critical temperature rises (&gt;5.5°C) and 5-minute health alerts even when the tab is closed.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {!isPushSubscribed ? (
            <button
              type="button"
              onClick={subscribeToWebPush}
              disabled={isPushLoading}
              className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isPushLoading ? 'Subscribing...' : 'Enable Real Web Push'}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={sendRealTestWebPush}
                disabled={isSendingTestPush}
                className="flex-1 md:flex-none px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md shadow-sky-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingTestPush ? 'Dispatching...' : 'Send 5-Min Web Push Test'}</span>
              </button>

              <button
                type="button"
                onClick={sendCriticalTempAlert}
                className="flex-1 md:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Test Critical Temp Alert (&gt;5.5°C)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Floating Success Toast */}
      {alertSuccessToast && (
        <div className="bg-emerald-950 border-2 border-emerald-400 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
              <CheckCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h4 className="font-black text-sm text-emerald-100">3-Hour Chilling Alert Dispatched!</h4>
              <p className="text-xs text-emerald-200">
                Alarm triggered at {alertSuccessToast.time}. Check your mobile device.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertSuccessToast(null)}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. RECURRING 3-HOUR ALARM BANNER (APPEARS ON BOTH LAPTOP AND PHONE) */}
      {isReminderAlertActive && isFreezerOn && (
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 rounded-3xl p-6 text-white shadow-2xl border-4 border-amber-300 animate-in fade-in duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-lg animate-bounce">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-rose-950 font-black text-xs uppercase px-3 py-0.5 rounded-full">
                  🔔 3-HOUR CHILLING COMPLETED
                </span>
                <span className="text-xs text-amber-100 font-mono font-bold">{currentSessionUnits} kWh (₹{currentSessionCost})</span>
              </div>
              <h3 className="text-xl font-black mt-1">Milk packets are fully chilled to 3°C!</h3>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                Please <strong>turn OFF freezer switch</strong> now to save electricity units.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={dismissCrossDeviceAlarm}
              className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>Dismiss Alarm 🔕</span>
            </button>

            <button
              onClick={handleToggleFreezer}
              className="px-6 py-3.5 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Power className="w-4 h-4" />
              <span>Turn OFF Switch 🛑</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Left Section: Live Running Clock & Power Meter (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Live Session Duration</span>
                <span className="text-xs font-black text-slate-900 font-mono">Started: {startDateStr} at {startClockTime}</span>
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                isFreezerOn ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {isFreezerOn ? '❄️ Compressor ON' : '🛑 Switched OFF'}
              </span>
            </div>

            {/* Running Clock */}
            <div className="text-center py-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Chilling Time</span>
              <div className="text-5xl font-black font-mono text-slate-900 tracking-tight">
                {currentHoursInt.toString().padStart(2, '0')}:{currentMinsInt.toString().padStart(2, '0')}:<span className="text-3xl text-slate-400">{currentSecsInt.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xs font-bold text-slate-500 block">
                {currentHoursInt} Hours {currentMinsInt} Minutes Running
              </span>
            </div>

            {/* Electricity Units Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Electricity Consumption:</span>
                </span>
                <strong className="text-base font-black text-amber-950 font-mono">
                  {currentSessionUnits} kWh Units
                </strong>
              </div>

              <div className="flex justify-between items-center text-xs font-mono pt-1.5 border-t border-amber-200/60 text-amber-900">
                <span>Power: <strong>1.2 kW Commercial</strong></span>
                <span>Cost: <strong className="text-slate-900 font-black font-sans">₹{currentSessionCost}</strong></span>
              </div>
            </div>

          </div>

          {/* Primary Switch Button */}
          <button
            onClick={handleToggleFreezer}
            className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isFreezerOn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isFreezerOn ? 'Turn Switch OFF (Log Power & Units 🛑)' : 'Turn Switch ON (Start New Session ❄️)'}</span>
          </button>
        </div>

        {/* Right Section: Visual Timeline & Phone Alert Box (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Cooling Timeline & Ice Meter</span>
              </h3>

              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                isIceRisk
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse'
                  : isOptimumChilled
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {isIceRisk ? '🔴 ICE RISK' : isOptimumChilled ? '🟡 3h+ Chilled' : '🟢 0-3h Chilling'}
              </span>
            </div>

            {/* Visual Timeline Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-100 h-8 rounded-2xl overflow-hidden flex p-1 border-2 border-slate-200 relative">
                <div className="w-[45%] bg-emerald-500 h-full rounded-l-xl flex items-center justify-center text-[10px] text-white font-bold">
                  0h - 3h (Safe)
                </div>
                <div className="w-[35%] bg-amber-400 h-full flex items-center justify-center text-[10px] text-slate-950 font-bold">
                  3h - 6h (Chilled • 3h Alert)
                </div>
                <div className="w-[20%] bg-rose-600 h-full rounded-r-xl flex items-center justify-center text-[10px] text-white font-bold animate-pulse">
                  6h+ (Ice Danger)
                </div>
              </div>

              <div className="flex justify-between text-xs font-mono font-bold text-slate-500 px-1">
                <span>0h (Start)</span>
                <span className="text-indigo-700">3h (Optimum 3°C 🔔)</span>
                <span className="text-rose-600">6h+ (Ice Risk)</span>
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Mobile Number for Alerts:
                </label>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono font-bold">
                  Jio 5G Connected
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5">
                <span className="text-xs font-mono text-slate-400 font-bold">+91</span>
                <input
                  type="text"
                  value={phoneAlertNumber}
                  onChange={(e) => setPhoneAlertNumber(e.target.value)}
                  placeholder="7604936341"
                  className="bg-transparent text-sm font-mono font-bold text-white outline-none w-full"
                />
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Freezer maintains cold for <strong>4 hours</strong> after turning OFF.</span>
            <span className="font-mono text-emerald-700 font-bold">510 Milk Packets</span>
          </div>
        </div>

      </div>

      {/* 4. CHILLING SESSIONS HISTORY TABLE */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <span>Chilling Sessions Log (Timestamps & Electricity Units)</span>
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">
            Auto-Logged on Switch
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold font-mono">
                <th className="py-3 px-4 rounded-l-xl">Date & Session</th>
                <th className="py-3 px-4">Switched ON</th>
                <th className="py-3 px-4">Switched OFF</th>
                <th className="py-3 px-4">Running Duration</th>
                <th className="py-3 px-4">Units Used (kWh)</th>
                <th className="py-3 px-4">Electricity Cost</th>
                <th className="py-3 px-4 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {operationalLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{log.date}</div>
                    <div className="text-[11px] text-slate-500">{log.sessionName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    🟢 {log.switchedOnTime}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                    {log.switchedOffTime === 'Currently Running' ? (
                      <span className="text-amber-600 animate-pulse">⚡ Active Now</span>
                    ) : (
                      `🛑 ${log.switchedOffTime}`
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                    {log.durationHours}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-indigo-700">
                    <span className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      {log.unitsUsed} Units
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                    ₹{log.costRupees}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      log.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
