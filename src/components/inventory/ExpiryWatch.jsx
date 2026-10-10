import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Calendar, 
  AlertCircle, 
  TrendingDown, 
  Tag, 
  ArrowRight, 
  Clock, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Percent, 
  Sparkles,
  Layers
} from 'lucide-react';

export const ExpiryWatch = () => {
  const { milkProducts, showNotification, setActiveTab } = useShop();

  const [batches, setBatches] = useState([
    { id: 'b1', product: 'Aavin Nice Blue (500ml)', batch: 'Batch 24/08', mfgDate: '24/08/2026', expires: '26/08/2026', daysLeft: 2, stock: 45, discount: 20, priority: 'High Risk' },
    { id: 'b2', product: 'Aavin Delight Purple (500ml)', batch: 'Batch 25/08', mfgDate: '25/08/2026', expires: '27/08/2026', daysLeft: 3, stock: 72, discount: 0, priority: 'Moderate' },
    { id: 'b3', product: 'Aavin Full Cream Orange (500ml)', batch: 'Batch 26/08', mfgDate: '26/08/2026', expires: '28/08/2026', daysLeft: 4, stock: 110, discount: 0, priority: 'Fresh' },
    { id: 'b4', product: 'Heritage Daily Special (Green)', batch: 'Batch 23/08', mfgDate: '23/08/2026', expires: '25/08/2026', daysLeft: 1, stock: 12, discount: 40, priority: 'Critical' },
    { id: 'b5', product: 'Aavin Spiced Buttermilk (200ml)', batch: 'Batch 25/08', mfgDate: '25/08/2026', expires: '27/08/2026', daysLeft: 3, stock: 30, discount: 10, priority: 'Moderate' }
  ].sort((a, b) => a.daysLeft - b.daysLeft));

  const applyDiscount = (batchId, percent) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, discount: percent } : b));
    showNotification(`Applied ${percent}% auto-discount to batch at POS counter!`);
  };

  const handleSendToCurd = (batch) => {
    setActiveTab('curd-production');
    showNotification(`Transferred ${batch.stock} expiring packets of ${batch.product} to Curd Inoculation!`);
  };

  const criticalBatches = batches.filter(b => b.daysLeft <= 2);
  const totalExpiringPackets = criticalBatches.reduce((sum, b) => sum + b.stock, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner with Crimson/Rose Theme */}
      <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-rose-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Inventory Safety & FIFO
            </span>
            <span className="text-xs text-rose-100 font-medium">
              First-In, First-Out Rotation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Expiry Watch & Batch Rotation</h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
            Track batch manufacturing dates, trigger auto-discounts at POS for near-expiry milk, and route unsold packets to zero-waste curd culturing.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-rose-100 uppercase font-black tracking-wider block">Urgent Action Required</span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            {totalExpiringPackets} <span className="text-xs font-bold font-sans">Packets</span>
          </div>
          <span className="text-[10px] text-rose-100 font-bold block mt-0.5">
            {criticalBatches.length} Batches under 48h
          </span>
        </div>
      </div>

      {/* 2. Key KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Monitored Batches</span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {batches.length} <span className="text-sm font-bold text-slate-500 font-sans">Active Batches</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">All Tirunelveli Dairy milk crates tagged</p>
        </div>

        <div className="bg-rose-50/70 p-5 rounded-3xl border-2 border-rose-200 shadow-xs space-y-1">
          <span className="text-xs text-rose-800 font-black uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-600" /> Expires in &le; 48 Hours
          </span>
          <div className="text-3xl font-black text-rose-700 font-mono">
            {totalExpiringPackets} <span className="text-sm font-bold text-rose-600 font-sans">Packets</span>
          </div>
          <p className="text-[11px] text-rose-800 font-medium">Auto-discount applied at POS counter</p>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-3xl border-2 border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs text-emerald-800 font-black uppercase tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Wastage Prevented (Curd)
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            ₹1,480 <span className="text-sm font-bold text-emerald-600 font-sans">Saved</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">Converted to fresh morning curd batches</p>
        </div>
      </div>

      {/* 3. Batch Table List */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>FIFO Batch Prioritization Register</span>
            </h3>
            <p className="text-xs text-slate-500">Sell older batches first to maintain dairy freshness standards</p>
          </div>
        </div>

        <div className="space-y-3">
          {batches.map((batch) => {
            const isCritical = batch.daysLeft <= 1;
            const isUrgent = batch.daysLeft === 2;

            return (
              <div
                key={batch.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCritical
                    ? 'bg-rose-50/80 border-rose-300 shadow-xs'
                    : isUrgent
                    ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-black text-base text-slate-900">{batch.product}</h4>
                    <span className="font-mono text-[10px] font-black bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                      {batch.batch}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isUrgent
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {batch.priority}
                    </span>
                    {batch.discount > 0 && (
                      <span className="bg-pink-100 text-pink-900 border border-pink-300 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                        <Tag className="w-3 h-3 text-pink-700" /> {batch.discount}% POS Discount Active
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                    <span className="font-mono">Mfg Date: <strong>{batch.mfgDate}</strong></span>
                    <span>•</span>
                    <span className={`flex items-center gap-1 font-bold ${
                      isCritical ? 'text-rose-700 font-mono' : isUrgent ? 'text-amber-800 font-mono' : 'text-slate-700 font-mono'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      Expires: <strong>{batch.expires} ({batch.daysLeft} days left)</strong>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-800">Physical Stock: <strong>{batch.stock} Packets</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {batch.discount === 0 && (
                    <button
                      onClick={() => applyDiscount(batch.id, 20)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <Percent className="w-3.5 h-3.5" />
                      <span>Apply 20% Discount</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleSendToCurd(batch)}
                    className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Inoculate into Curd</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
