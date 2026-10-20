import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  BrainCircuit, 
  CloudSun, 
  CalendarCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Send,
  Droplets,
  Package,
  Layers,
  ThermometerSun
} from 'lucide-react';

export const SmartPrediction = () => {
  const { showNotification, shopSettings } = useShop();

  const [quantities, setQuantities] = useState({
    blue: 250,
    purple: 220,
    orange: 80,
    heritage: 24
  });

  const [bufferBonus, setBufferBonus] = useState(0);

  const handleQtyChange = (key, value) => {
    setQuantities(prev => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const totalPackets = (quantities.blue + quantities.purple + quantities.orange + quantities.heritage) + Math.round((quantities.blue + quantities.purple + quantities.orange + quantities.heritage) * (bufferBonus / 100));
  const totalCrates = (totalPackets / 24).toFixed(1);
  const totalLiters = (totalPackets * 0.5).toFixed(1);
  
  // Cost calculation based on official supply tender rates (₹18 blue, ₹20 purple, ₹25 orange, ₹21 green)
  const totalCost = (quantities.blue * 18) + (quantities.purple * 20) + (quantities.orange * 25) + (quantities.heritage * 21);

  const handleConfirmOrder = () => {
    showNotification(`Transmitted tomorrow's indent (${totalPackets} pkts / ${totalCrates} crates / ₹${totalCost}) to ${shopSettings.supplyDairyUnit}!`);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-sky-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-indigo-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              AI Demand Intelligence
            </span>
            <span className="text-xs text-indigo-100 font-medium">
              Real-Time Order Forecasting Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Smart Order Prediction (AI)</h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
            Machine learning forecast combining 30-day historical consumption patterns, local weather heat spikes, and Attai standing card quotas.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-indigo-100 uppercase font-black tracking-wider block">Predicted Indent Value</span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            ₹{totalCost}
          </div>
          <span className="text-[10px] text-indigo-100 font-bold block mt-0.5">
            {totalCrates} Crates ({totalPackets} Packets / {totalLiters}L)
          </span>
        </div>
      </div>

      {/* 2. Insight Context Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-sky-50 to-blue-50/60 border-2 border-sky-200 p-5 rounded-3xl space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-sky-800">
            <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-sky-600" /> 7-Day Trend</span>
            <span className="bg-sky-100 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-full">+5.2% Surge</span>
          </div>
          <div className="text-base font-black text-slate-900">Steady Morning Retail Consumption</div>
          <p className="text-[11px] text-slate-600">Weekend residential morning demand increasing across Palayamkottai route.</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border-2 border-amber-200 p-5 rounded-3xl space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-amber-800">
            <span className="flex items-center gap-1.5"><ThermometerSun className="w-4 h-4 text-amber-600" /> Weather Spike</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">34°C Hot</span>
          </div>
          <div className="text-base font-black text-slate-900">Heatwave: Full Cream Milk & Curd ↑</div>
          <p className="text-[11px] text-slate-600">AI automatically added <strong>+10 Orange FCM packets</strong> for tea stalls & lassi makers.</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 border-2 border-purple-200 p-5 rounded-3xl space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-purple-800">
            <span className="flex items-center gap-1.5"><CalendarCheck className="w-4 h-4 text-purple-600" /> Standing Accounts</span>
            <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2 py-0.5 rounded-full">42 Attai Cards</span>
          </div>
          <div className="text-base font-black text-slate-900">Guaranteed Household Quotas</div>
          <p className="text-[11px] text-slate-600">Base committed volume of <strong>112 packets</strong> reserved for prepaid monthly subscribers.</p>
        </div>
      </div>

      {/* 3. Prediction Breakdown & Editable Form */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Tomorrow's Recommended Indent Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500">Tune quantities or accept AI recommended forecast before dispatching to dairy</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Safety Buffer:</span>
            {[0, 5, 10].map(pct => (
              <button
                key={pct}
                type="button"
                onClick={() => setBufferBonus(pct)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  bufferBonus === pct
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                +{pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Variety Rows */}
        <div className="space-y-3">
          
          {/* Blue */}
          <div className="p-4 bg-gradient-to-r from-blue-50/70 to-white border-2 border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Aavin Nice Blue (Toned)
                </span>
                <span className="text-xs text-slate-500 font-mono">₹18 Cost / ₹22 MRP</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">30-day baseline: 242 pkts • <strong className="text-emerald-700 font-bold">+8 pkts (Weekend retail tea boost)</strong></p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Crates</span>
                <span className="text-xs font-bold font-mono text-slate-700">{(quantities.blue / 24).toFixed(1)} Crates</span>
              </div>
              <input
                type="number"
                value={quantities.blue}
                onChange={(e) => handleQtyChange('blue', e.target.value)}
                className="w-24 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-xl p-2.5 font-mono font-black text-lg text-center text-slate-900 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Purple */}
          <div className="p-4 bg-gradient-to-r from-purple-50/70 to-white border-2 border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Aavin Delight Purple (Standard)
                </span>
                <span className="text-xs text-slate-500 font-mono">₹20 Cost / ₹24 MRP</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">30-day baseline: 225 pkts • <strong className="text-purple-800 font-bold">Standard family residential consumption</strong></p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Crates</span>
                <span className="text-xs font-bold font-mono text-slate-700">{(quantities.purple / 24).toFixed(1)} Crates</span>
              </div>
              <input
                type="number"
                value={quantities.purple}
                onChange={(e) => handleQtyChange('purple', e.target.value)}
                className="w-24 bg-white border-2 border-purple-300 focus:border-purple-600 rounded-xl p-2.5 font-mono font-black text-lg text-center text-slate-900 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Orange */}
          <div className="p-4 bg-gradient-to-r from-orange-50/70 to-white border-2 border-orange-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-orange-950 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  Aavin Full Cream Orange (FCM)
                </span>
                <span className="text-xs text-slate-500 font-mono">₹25 Cost / ₹30 MRP</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">30-day baseline: 70 pkts • <strong className="text-amber-800 font-bold">+10 pkts (Commercial tea stall heat spike)</strong></p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Crates</span>
                <span className="text-xs font-bold font-mono text-slate-700">{(quantities.orange / 24).toFixed(1)} Crates</span>
              </div>
              <input
                type="number"
                value={quantities.orange}
                onChange={(e) => handleQtyChange('orange', e.target.value)}
                className="w-24 bg-white border-2 border-orange-300 focus:border-orange-600 rounded-xl p-2.5 font-mono font-black text-lg text-center text-slate-900 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Heritage */}
          <div className="p-4 bg-gradient-to-r from-emerald-50/70 to-white border-2 border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Heritage Milk Special (Green)
                </span>
                <span className="text-xs text-slate-500 font-mono">₹21 Cost / ₹27 MRP</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">Stable subscription quota (1 Crate = 24 Packets)</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Crates</span>
                <span className="text-xs font-bold font-mono text-slate-700">1.0 Crates</span>
              </div>
              <input
                type="number"
                value={quantities.heritage}
                onChange={(e) => handleQtyChange('heritage', e.target.value)}
                className="w-24 bg-white border-2 border-emerald-300 focus:border-emerald-600 rounded-xl p-2.5 font-mono font-black text-lg text-center text-slate-900 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

        </div>

        {/* Confirmation Footer */}
        <div className="p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-2 border-indigo-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-indigo-900">Total Indent Supply Summary</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
              ₹{totalCost} <span className="text-xs font-bold text-slate-500 font-sans">estimated cost</span>
            </div>
            <div className="text-xs text-slate-600 font-mono mt-0.5">
              Total Order: <strong>{totalPackets} Packets</strong> ({totalCrates} Crates / {totalLiters} Litres)
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Transmit Indent to Dairy</span>
          </button>
        </div>
      </div>

    </div>
  );
};
