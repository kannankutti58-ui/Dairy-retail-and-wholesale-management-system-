import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  TrendingUp, 
  Package, 
  CreditCard, 
  Droplets, 
  ArrowRight, 
  Clock, 
  ShoppingCart, 
  CalendarDays, 
  Store, 
  CalendarCheck, 
  RotateCcw,
  AlertCircle,
  Navigation,
  Gift,
  Star,
  RefreshCw,
  DollarSign,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DashboardOverview = () => {
  const { 
    shopInfo, 
    dailySales, 
    milkProducts, 
    wholesaleClients, 
    activeTab, 
    setActiveTab, 
    showNotification,
    t,
    recentTabs
  } = useShop();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dashboard calculations based on context mock data
  const todayTotalRevenue = dailySales.reduce((sum, sale) => sum + sale.amount, 0);
  const todayCashUPIRevenue = dailySales
    .filter(s => s.paymentMethod === 'Cash' || s.paymentMethod === 'UPI')
    .reduce((sum, sale) => sum + sale.amount, 0);

  // Stock math for Aavin specific 500ml packets -> crates (1 crate = 24 packets = 12 Litres)
  const totalStockPackets = milkProducts.reduce((sum, item) => sum + (item.currentStock || 0), 0);
  const totalStockLitres = totalStockPackets * 0.5;
  const totalStockCrates = (totalStockPackets / 24).toFixed(1);

  // Tomorrow's Indent (Advance Order Planner preview)
  const advanceReq = {
    totalPackets: 280,
    totalCrates: (280/24).toFixed(1),
    totalLiters: 140,
    totalCost: 10450
  };

  const activeCardsCount = 42;
  const curdRecoveredValue = 850;

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. TOP HERO GREETING & SHIFT STATUS */}
      <div 
        className="rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all duration-300"
        style={{ background: 'var(--theme-gradient)' }}
      >
        
        {/* Subtle Decorative Background Bubbles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold border border-white/30 text-white shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t('dairy_feed_live', 'TIRUNELVELI DAIRY AGENCY FEED LIVE')}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {t('welcome_proprietor', 'Welcome')}, {shopInfo?.proprietor || "Kuttiammal M."} <span className="inline-block animate-bounce">🌅</span>
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            {t('app_subtitle', 'Aavin Milk Agency Management System')} • {t('kovilpatti_route', 'Kovilpatti • Tirunelveli Union')}
          </p>
        </div>

        {/* Real-time Clock Card */}
        <div className="relative z-10 bg-white/15 backdrop-blur-md border border-white/25 px-5 py-4 rounded-2xl flex flex-col sm:items-end justify-center shrink-0 shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-sky-200">{t('system_time', 'System Time')}</div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-0.5">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-xs font-semibold text-sky-100 mt-0.5 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-sky-300" />
            <span>{currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* 1.5 RECENTLY ACCESSED MODULES (Quick Jump Bar) */}
      {recentTabs && recentTabs.length > 0 && (
        <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 shrink-0">
            <Clock className="w-4 h-4 text-sky-700" />
            <span>{t('recently_accessed', 'Recently Accessed')}:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {recentTabs.slice(0, 5).map((tab, idx) => (
              <button
                key={tab.id || idx}
                onClick={() => setActiveTab(tab.id)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 text-slate-800 hover:text-sky-800 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{tab.label}</span>
                <span className="text-[10px] text-slate-500 font-normal font-mono">({tab.time})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. PRIMARY ACTION QUICK-LAUNCH BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button 
          onClick={() => setActiveTab('daily-sales')} 
          className="bg-white hover:bg-sky-50/60 border-2 border-sky-100 hover:border-sky-300 p-4 rounded-2xl flex items-center space-x-3 transition group shadow-xs hover:shadow-md text-left cursor-pointer"
        >
          <div className="bg-sky-100 text-sky-700 p-2.5 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition shadow-2xs">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm block leading-tight">{t('daily_sales', 'POS Billing')}</span>
            <span className="text-[10px] text-slate-500 font-medium">{t('new_sale', 'Counter Sales')}</span>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('order-prediction')} 
          className="bg-white hover:bg-indigo-50/60 border-2 border-indigo-100 hover:border-indigo-300 p-4 rounded-2xl flex items-center space-x-3 transition group shadow-xs hover:shadow-md text-left cursor-pointer"
        >
          <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition shadow-2xs">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm block leading-tight">{t('order_prediction', 'AI Indent')}</span>
            <span className="text-[10px] text-slate-500 font-medium">{t('tomorrow_supply_indent', 'Tomorrow Supply')}</span>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('customer-management')} 
          className="bg-white hover:bg-purple-50/60 border-2 border-purple-100 hover:border-purple-300 p-4 rounded-2xl flex items-center space-x-3 transition group shadow-xs hover:shadow-md text-left cursor-pointer"
        >
          <div className="bg-purple-100 text-purple-700 p-2.5 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition shadow-2xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm block leading-tight">{t('customer_management', 'Attai & B2B')}</span>
            <span className="text-[10px] text-slate-500 font-medium">{t('monthly_prepaid_cards', 'Wholesale Cards')}</span>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('route-delivery')} 
          className="bg-white hover:bg-emerald-50/60 border-2 border-emerald-100 hover:border-emerald-300 p-4 rounded-2xl flex items-center space-x-3 transition group shadow-xs hover:shadow-md text-left cursor-pointer"
        >
          <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition shadow-2xs">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm block leading-tight">{t('route_delivery', 'Route GPS')}</span>
            <span className="text-[10px] text-slate-500 font-medium">Door-to-Door</span>
          </div>
        </button>
      </div>

      {/* 3. CURRENT MILK STOCK STATUS (THE PROMINENT MAIN SECTION) */}
      <div className="bg-white rounded-3xl border-2 border-sky-200/80 shadow-md p-6 space-y-6">
        
        {/* Prominent Header Banner with Real-Time Stamp */}
        <div className="bg-gradient-to-r from-sky-50 via-blue-50/60 to-indigo-50 border border-sky-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Live Stock Status Monitor
            </div>
            <h3 className="font-black text-slate-900 text-xl sm:text-2xl flex items-center gap-2">
              <Package className="w-6 h-6 text-sky-700" /> 
              Current Physical Milk Stock Status
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Real-time physical packet inventory in store cooler crates. Updated live on every POS sale.
            </p>
          </div>
          
          <div className="bg-white border-2 border-sky-300 px-5 py-3 rounded-2xl shadow-xs text-left md:text-right min-w-[220px]">
            <div className="text-[10px] font-black text-sky-900 uppercase tracking-widest mb-0.5">As Of (Live)</div>
            <div className="text-lg font-black text-slate-900 font-mono leading-tight">
              {currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-sm font-black text-sky-700 font-mono">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>
        
        {/* Milk Stock Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Blue (Toned) */}
          <div className="bg-gradient-to-br from-blue-50/60 to-white rounded-2xl p-5 border-2 border-blue-200 shadow-xs relative overflow-hidden group hover:border-blue-400 hover:shadow-md transition">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                Aavin Blue (Toned)
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">3.0% Fat</span>
            </div>
            
            <div className="flex items-baseline justify-between mt-3">
              <div>
                <span className="text-4xl font-black text-slate-950 font-mono leading-none">
                  {milkProducts.find(p => p.id === 'aavin-blue')?.currentStock || 0}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1.5">Packets</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-blue-700">
                {((milkProducts.find(p => p.id === 'aavin-blue')?.currentStock || 0) * 0.5).toFixed(0)} Litres
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">₹22 / pkt</span>
              <button 
                onClick={() => setActiveTab('daily-sales')}
                className="text-[11px] font-extrabold text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg flex items-center gap-1 transition shadow-2xs"
              >
                Sell POS <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Purple (Standard) */}
          <div className="bg-gradient-to-br from-purple-50/60 to-white rounded-2xl p-5 border-2 border-purple-200 shadow-xs relative overflow-hidden group hover:border-purple-400 hover:shadow-md transition">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full">
                Aavin Purple (Std)
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">3.5% Fat</span>
            </div>
            
            <div className="flex items-baseline justify-between mt-3">
              <div>
                <span className="text-4xl font-black text-slate-950 font-mono leading-none">
                  {milkProducts.find(p => p.id === 'aavin-purple')?.currentStock || 0}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1.5">Packets</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-purple-700">
                {((milkProducts.find(p => p.id === 'aavin-purple')?.currentStock || 0) * 0.5).toFixed(0)} Litres
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">₹24 / pkt</span>
              <button 
                onClick={() => setActiveTab('daily-sales')}
                className="text-[11px] font-extrabold text-purple-800 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-lg flex items-center gap-1 transition shadow-2xs"
              >
                Sell POS <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Orange (FCM) */}
          <div className="bg-gradient-to-br from-orange-50/60 to-white rounded-2xl p-5 border-2 border-orange-200 shadow-xs relative overflow-hidden group hover:border-orange-400 hover:shadow-md transition">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-600"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-950 bg-orange-100 px-2 py-0.5 rounded-full">
                Aavin Orange (FCM)
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">4.5%+ Fat</span>
            </div>
            
            <div className="flex items-baseline justify-between mt-3">
              <div>
                <span className="text-4xl font-black text-slate-950 font-mono leading-none">
                  {milkProducts.find(p => p.id === 'aavin-orange')?.currentStock || 0}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1.5">Packets</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-orange-700">
                {((milkProducts.find(p => p.id === 'aavin-orange')?.currentStock || 0) * 0.5).toFixed(0)} Litres
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-orange-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">₹30 / pkt</span>
              <button 
                onClick={() => setActiveTab('daily-sales')}
                className="text-[11px] font-extrabold text-orange-900 bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-lg flex items-center gap-1 transition shadow-2xs"
              >
                Sell POS <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Green (Heritage Daily) */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl p-5 border-2 border-emerald-200 shadow-xs relative overflow-hidden group hover:border-emerald-400 hover:shadow-md transition">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-full">
                Heritage Milk (Green)
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">Special</span>
            </div>
            
            <div className="flex items-baseline justify-between mt-3">
              <div>
                <span className="text-4xl font-black text-slate-950 font-mono leading-none">
                  {milkProducts.find(p => p.id === 'heritage-daily')?.currentStock || 0}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1.5">Packets</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-emerald-700">
                {((milkProducts.find(p => p.id === 'heritage-daily')?.currentStock || 0) * 0.5).toFixed(0)} Litres
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">₹27 / pkt</span>
              <button 
                onClick={() => setActiveTab('daily-sales')}
                className="text-[11px] font-extrabold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1 transition shadow-2xs"
              >
                Sell POS <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Live Crate Math Explainer Footnote & Link */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>Standard Packing: <strong>24 Packets = 1 Crate (12 Litres)</strong> • Total Store: <strong className="text-sky-950 font-mono">{totalStockCrates} Crates</strong> ({totalStockPackets} pkts)</span>
          </div>
          <button 
            onClick={() => setActiveTab('stock-management')}
            className="text-xs font-black text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:bg-sky-50 transition shrink-0"
          >
            Manage Full Stock & FIFO <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. REAL-TIME OPERATIONS & PREDICTIONS GRID (New requested features made highly visible!) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Widget 1: Expiry Watch (FIFO) */}
        <div className="bg-white rounded-3xl border-2 border-rose-100 p-5 shadow-xs space-y-3.5 flex flex-col justify-between hover:border-rose-300 transition">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-600" /> FIFO Expiry Watch
              </span>
              <span className="text-xs font-bold text-rose-600">1 Batch Urgent</span>
            </div>
            
            <h4 className="text-base font-black text-slate-900 mt-2">Aavin Blue - Batch 24/08</h4>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Expires in <strong className="text-rose-700">2 Days</strong> (45 packets in stock)
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Auto-Discount: 20%</span>
            <button 
              onClick={() => setActiveTab('stock-management')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Open Expiry Watch
            </button>
          </div>
        </div>

        {/* Widget 2: AI Order Recommendation */}
        <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 shadow-xs space-y-3.5 flex flex-col justify-between hover:border-indigo-300 transition">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" /> AI Order Predictor
              </span>
              <span className="text-xs font-bold text-indigo-600">94% Accuracy</span>
            </div>
            
            <h4 className="text-base font-black text-slate-900 mt-2">Tomorrow's Order Recommendation</h4>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Estimated: <strong className="text-indigo-950 font-mono">₹13,840</strong> (550 pkts / 23 crates)
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700">+10 Orange (Heat)</span>
            <button 
              onClick={() => setActiveTab('order-prediction')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Review Indent
            </button>
          </div>
        </div>

        {/* Widget 3: Live Delivery Route GPS */}
        <div className="bg-white rounded-3xl border-2 border-emerald-100 p-5 shadow-xs space-y-3.5 flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Navigation className="w-3 h-3 text-emerald-600" /> Live Delivery Route
              </span>
              <span className="text-xs font-bold text-emerald-700">8:30 AM Target</span>
            </div>
            
            <h4 className="text-base font-black text-slate-900 mt-2">4 Stops Scheduled (7.0 km)</h4>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Stop 1: <strong className="text-emerald-700">R. Kumar Delivered ✅</strong>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">M. Priya in progress</span>
            <button 
              onClick={() => setActiveTab('route-delivery')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Track Deliveries
            </button>
          </div>
        </div>

      </div>

      {/* 5. VIVID FINANCIAL & OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Collections */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-5 text-white shadow-md space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-100">
            <span>Today's Collections</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black">Live</span>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight pt-1">
            ₹{todayTotalRevenue}
          </div>
          <div className="text-xs text-emerald-100 font-medium pt-1">
            Cash / UPI Tendered: <strong className="font-mono text-white">₹{todayCashUPIRevenue}</strong>
          </div>
        </div>

        {/* Tomorrow Supply Cost */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-5 text-white shadow-md space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-bold text-sky-100">
            <span>Tomorrow's Indent Cost</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black">Tender</span>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight pt-1">
            ₹{advanceReq.totalCost}
          </div>
          <div className="text-xs text-sky-100 font-medium pt-1">
            {advanceReq.totalCrates} Crates ({advanceReq.totalPackets} pkts)
          </div>
        </div>

        {/* Monthly Card Accounts */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl p-5 text-white shadow-md space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-bold text-purple-100">
            <span>Prepaid Cards (Attai)</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black">Subscribed</span>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight pt-1">
            {activeCardsCount} Accounts
          </div>
          <div className="text-xs text-purple-100 font-medium pt-1">
            Monthly advance prepaid households
          </div>
        </div>

        {/* Curd Recovered */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-5 text-white shadow-md space-y-1 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-bold text-amber-100">
            <span>Curd Production</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black">Zero Waste</span>
          </div>
          <div className="text-3xl font-black font-mono tracking-tight pt-1">
            ₹{curdRecoveredValue}
          </div>
          <div className="text-xs text-amber-100 font-medium pt-1">
            Value saved from unsold evening milk
          </div>
        </div>
      </div>

      {/* 6. BOTTOM ROW: QUICK INSIGHTS & RECENT TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Customer Loyalty & Competitor Watch - 6 Cols */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-600" />
                Loyalty & Local Competitor Watch
              </h3>
              <p className="text-xs text-slate-500">Key customer retention and retail market metrics</p>
            </div>
            <button 
              onClick={() => setActiveTab('loyalty-feedback')}
              className="text-xs font-bold text-sky-700 hover:underline"
            >
              View Hub
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Top Customer Card */}
            <div className="p-3.5 bg-pink-50/70 border border-pink-200 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-900 block">Top Loyalty Member</span>
              <div className="font-extrabold text-slate-900 text-sm">M. Lakshmi</div>
              <div className="text-xs text-pink-950 font-mono font-bold">450 Points (120 redeemable)</div>
            </div>

            {/* Competitor Price Card */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">Vijay Milk Shop (50m)</span>
              <div className="font-extrabold text-slate-900 text-sm">Blue: ₹23 (↓1 from you)</div>
              <div className="text-xs text-amber-950 font-mono font-bold">Purple: ₹25 (↑1 from you)</div>
            </div>
          </div>
        </div>

        {/* Live Daily Sales Journal - 6 Cols */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-700" />
                Today's Real-Time Counter Transactions
              </h3>
              <p className="text-xs text-slate-500">Live journal entries with instant print receipts</p>
            </div>
            <button
              onClick={() => setActiveTab('daily-sales')}
              className="text-xs text-sky-700 font-bold hover:underline"
            >
              Open POS
            </button>
          </div>

          <div className="space-y-2">
            {dailySales.slice(0, 3).map(tx => (
              <div key={tx.id} className="p-3 bg-slate-50 hover:bg-sky-50/50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs transition">
                <div>
                  <div className="font-extrabold text-slate-900">{tx.customer}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{tx.time} • {tx.items}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-slate-950 text-sm">
                    ₹{tx.amount}
                  </div>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">{tx.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
