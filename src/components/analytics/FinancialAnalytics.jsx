import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Calendar, 
  Download, 
  Droplets,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { BusinessReports } from './BusinessReports';

export const FinancialAnalytics = () => {
  const {
    todayTotalRevenue,
    calculateTomorrowAdvanceRequirement,
    curdConversionLogs,
    wholesaleClients,
    dailySales,
    showNotification,
    setActiveTab
  } = useShop();

  const advanceReq = calculateTomorrowAdvanceRequirement();
  const totalWastePreventedValue = curdConversionLogs.reduce((sum, c) => sum + c.wastePreventedValue, 0);
  const totalWholesaleCredit = wholesaleClients.reduce((sum, c) => sum + c.pendingBalance, 0);
  const estimatedAgencyMargin = Math.round(todayTotalRevenue * 0.16);

  const [dateRange, setDateRange] = useState('Today (27 Aug)');

  const handleExportStatement = () => {
    showNotification("Generating & downloading Financial P&L Statement (PDF/Excel)...");
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner with Teal/Emerald Theme */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-sky-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-teal-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Executive P&L Analytics
            </span>
            <span className="text-xs text-teal-100 font-medium">
              Sales, Margin & Turnover Metrics
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Financial Analytics & Profit Margins</h2>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            Real-time daily collection auditing, margin breakdowns, supply indent costs, and zero-waste value recovery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('gst-reports')}
            className="px-4 py-2.5 bg-white text-teal-950 rounded-2xl font-black text-xs transition shadow-sm hover:bg-teal-50 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-teal-700" />
            <span>Open GST Tax Reports</span>
          </button>
          
          <button
            onClick={handleExportStatement}
            className="px-4 py-2.5 bg-teal-800/80 hover:bg-teal-800 text-white rounded-2xl font-bold text-xs transition shadow-sm border border-white/20 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 High-Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-5 rounded-3xl border-2 border-emerald-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
            <span>Gross Revenue Today</span>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full">5:00 AM Live</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono pt-1">
            ₹{todayTotalRevenue}
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-0.5">Cash, UPI & Ledger Collections</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-5 rounded-3xl border-2 border-blue-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-sky-800">
            <span>Tomorrow Supply Indent</span>
            <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2 py-0.5 rounded-full">Tender</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono pt-1">
            ₹{advanceReq.totalCost}
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-0.5">{advanceReq.totalCrates} Crates ({advanceReq.totalPackets} Packets)</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50/60 p-5 rounded-3xl border-2 border-purple-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-purple-800">
            <span>Estimated Agency Margin</span>
            <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2 py-0.5 rounded-full">~16% Net</span>
          </div>
          <div className="text-3xl font-black text-purple-950 font-mono pt-1">
            ₹{estimatedAgencyMargin}
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-0.5">Agency retail & wholesale commission</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-5 rounded-3xl border-2 border-amber-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-amber-800">
            <span>Curd Value Saved</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">Zero-Waste</span>
          </div>
          <div className="text-3xl font-black text-amber-950 font-mono pt-1">
            ₹{totalWastePreventedValue}
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-0.5">Recovered from unsold evening packets</p>
        </div>

      </div>

      {/* 3. Detailed Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Volume Breakdown by Milk Variety (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                <span>Daily Sales Volume Distribution</span>
              </h3>
              <p className="text-xs text-slate-500">Breakdown of packets sold across retail counters & wholesale routes</p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl">
              550 Pkts Total
            </span>
          </div>

          <div className="space-y-4">
            
            {/* Blue */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-900">Aavin Nice Blue (Toned)</span>
                <span className="font-mono text-slate-900">250 Packets (45.5%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '45.5%' }}></div>
              </div>
            </div>

            {/* Purple */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-purple-900">Aavin Delight Purple (Standard)</span>
                <span className="font-mono text-slate-900">220 Packets (40.0%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* Orange */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-orange-950">Aavin Full Cream Orange (FCM)</span>
                <span className="font-mono text-slate-900">80 Packets (14.5%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '14.5%' }}></div>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Retail Cash</span>
              <strong className="text-slate-900 font-mono text-sm font-black">62%</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">UPI / GPay</span>
              <strong className="text-slate-900 font-mono text-sm font-black">28%</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">B2B Credit</span>
              <strong className="text-slate-900 font-mono text-sm font-black">10%</strong>
            </div>
          </div>
        </div>

        {/* Right: Payment Channels & B2B Credit Ledger (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                <span>Credit Ledger & Due Status</span>
              </h3>
              <p className="text-xs text-slate-500">Outstanding B2B balances</p>
            </div>
          </div>

          <div className="p-4 bg-rose-50/70 border-2 border-rose-200 rounded-2xl space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">Total B2B Ledger Due</span>
              <span className="text-xl font-black text-rose-700 font-mono">₹{totalWholesaleCredit}</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Accumulated outstanding dues across tea stalls & hotel client accounts.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Top Account Balances:</span>
            {wholesaleClients.slice(0, 3).map(client => (
              <div key={client.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-900">{client.businessName}</div>
                  <div className="text-[10px] text-slate-500">{client.ownerName} ({client.phone})</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-rose-600 text-sm">₹{client.pendingBalance}</div>
                  <span className="text-[9px] text-slate-400">Due</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
