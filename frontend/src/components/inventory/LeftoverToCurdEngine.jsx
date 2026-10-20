import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Pagination } from '../common/Pagination';
import { 
  RotateCcw, 
  ShieldCheck, 
  Award, 
  Plus, 
  Flame, 
  Clock, 
  Droplets, 
  DollarSign, 
  CheckCircle2,
  TrendingUp,
  Layers
} from 'lucide-react';

export const LeftoverToCurdEngine = () => {
  const {
    milkProducts,
    curdProducts,
    curdConversionLogs,
    convertLeftoverMilkToCurd,
    showNotification
  } = useShop();

  const [leftoverPackets, setLeftoverPackets] = useState(12);
  const [selectedMilkType, setSelectedMilkType] = useState('aavin-orange');
  const [cultureTime, setCultureTime] = useState('09:30 PM');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const litersCalculated = leftoverPackets * 0.5;
  const kgCurdCalculated = litersCalculated;
  const curdMarketValue = kgCurdCalculated * 60;

  const handleConvert = (e) => {
    e.preventDefault();
    if (leftoverPackets <= 0) return;
    convertLeftoverMilkToCurd({
      leftoverPackets: Number(leftoverPackets),
      starterCultureTime: cultureTime,
      milkVariety: selectedMilkType
    });
    showNotification(`Inoculated ${leftoverPackets} unsold milk packets into ${kgCurdCalculated}kg fresh morning curd (₹${curdMarketValue} saved)!`);
  };

  const totalCurdProducedKg = curdConversionLogs.reduce((sum, log) => sum + log.convertedToCurdKg, 0);
  const totalValueRecovered = curdConversionLogs.reduce((sum, log) => sum + log.wastePreventedValue, 0);

  const paginatedLogs = curdConversionLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-orange-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Zero-Waste Operations
            </span>
            <span className="text-xs text-amber-100 font-medium">
              Aavin Inoculation & Fermentation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Curd Production & Leftover Culturing</h2>
          <div className="flex items-center gap-3 text-xs text-amber-100 mt-1">
            <span>Formula: <strong>1.0 Litre Unsold Milk = 1.0 kg Fresh Curd</strong></span>
            <span>•</span>
            <span>Culture Temp: <strong>42°C Starter</strong></span>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-amber-100 uppercase font-black tracking-wider block">Wastage Value Recovered</span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            ₹{totalValueRecovered}
          </div>
          <span className="text-[10px] text-amber-100 font-bold block mt-0.5">
            {totalCurdProducedKg} kg Total Curd Yield
          </span>
        </div>
      </div>

      {/* 2. Fermentation Cycle Stages Indicator */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">1</div>
            <div>
              <div className="font-extrabold text-slate-900">Evening Inoculation</div>
              <div className="text-[11px] text-slate-500 font-mono">09:30 PM (Starter Culture 42°C)</div>
            </div>
          </div>
          <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black">2</div>
            <div>
              <div className="font-extrabold text-slate-900">Overnight Setting</div>
              <div className="text-[11px] text-slate-500 font-mono">6 Hours Controlled Incubation</div>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">3</div>
            <div>
              <div className="font-extrabold text-slate-900">Morning Retail Sale</div>
              <div className="text-[11px] text-slate-500 font-mono">05:00 AM Counter Ready (₹60/kg)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Conversion Form & Live Stock Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Inoculation Form (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-amber-200 p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-orange-600" />
              <span>Evening Leftover Culturing Batch</span>
            </h3>
            <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Zero Waste
            </span>
          </div>

          <form onSubmit={handleConvert} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Unsold Milk Variety
              </label>
              <select
                value={selectedMilkType}
                onChange={(e) => setSelectedMilkType(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none"
              >
                <option value="aavin-orange">Aavin Full Cream (Orange - Thick Rich Curd)</option>
                <option value="aavin-purple">Aavin Delight (Purple - Standard Curd)</option>
                <option value="aavin-blue">Aavin Nice (Blue - Light Buttermilk Quality)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Unsold Packets (500ml)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={leftoverPackets}
                  onChange={(e) => setLeftoverPackets(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-2.5 font-mono font-black text-base text-slate-900 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono font-bold mt-1 block">
                  = {litersCalculated} Litres Volume
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Inoculation Time</label>
                <input
                  type="text"
                  value={cultureTime}
                  onChange={(e) => setCultureTime(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Yield preview card */}
            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-950 block tracking-wider">Estimated Batch Output</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Curd Output</span>
                  <strong className="text-slate-950 font-black text-sm font-mono">{kgCurdCalculated} Kg</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Ready At</span>
                  <strong className="text-emerald-700 font-black text-sm font-mono">05:00 AM</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Value Saved</span>
                  <strong className="text-amber-800 font-black text-sm font-mono">₹{curdMarketValue}</strong>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Inoculate Leftover Milk Batch</span>
            </button>
          </form>
        </div>

        {/* Right: Curd Stock & Inoculation History (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Active Inventory */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-3.5">
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Current Curd Inventory</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {curdProducts.map((curd) => (
                <div key={curd.id} className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-slate-900">{curd.name}</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {curd.type === 'homemade-from-leftover' ? 'Homemade Vat' : 'Packaged Cup'}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 font-mono">
                    <span className="font-black text-slate-900 text-sm">₹{curd.mrp}</span>
                    <span className="text-xs text-slate-700 font-bold">
                      Stock: {curd.currentStock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Logs */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-3.5">
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Recent Inoculation Log History</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              {paginatedLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-900">{log.batchQuality}</strong>
                    <span className="font-mono font-black text-emerald-700 text-sm">
                      +₹{log.wastePreventedValue} Saved
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{log.date} ({log.leftoverMilkPackets} pkts / {log.convertedToCurdKg}kg)</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Ready 05:00 AM</span>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={curdConversionLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>

        </div>

      </div>

    </div>
  );
};
