import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  BarChart3, 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  FileSpreadsheet, 
  ShieldCheck, 
  Calendar,
  CheckCircle2,
  Printer,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const BusinessReports = () => {
  const { todayTotalRevenue, showNotification, shopSettings } = useShop();
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

  const handleDownload = (reportName) => {
    showNotification(`Generated & exported ${reportName} to downloads folder!`);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-sky-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-teal-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Taxation & Regulatory
            </span>
            <span className="text-xs text-teal-100 font-medium">
              GSTIN: {shopSettings?.taxNumber || "GSTIN33AAACD1234A1Z5"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">GST & Business Tax Reports</h2>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            Automated monthly GSTR-1 outward supply summaries, GSTR-3B input tax credits, and annual P&L audited statements.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-teal-100 uppercase font-black tracking-wider block">GSTR-1 Status</span>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            Ready to File
          </div>
          <span className="text-[10px] text-teal-100 font-bold block mt-0.5">
            Due 10th of Next Month
          </span>
        </div>
      </div>

      {/* 2. Main Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: GSTR-1 Outward Supply Statement */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 space-y-5 relative overflow-hidden">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-sky-700 mb-1">
                <FileText className="w-5 h-5" />
                <span className="font-black text-xs uppercase tracking-wider">GSTR-1 Tax Statement</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{selectedMonth}</h3>
            </div>
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-3 py-1 rounded-full">
              Filing Due: 10 Sept
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium">B2B Wholesale Taxable Sales (HSN 0401)</span>
              <span className="font-mono font-black text-slate-900 text-sm">₹42,500</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium">B2C Retail Counter Sales</span>
              <span className="font-mono font-black text-slate-900 text-sm">₹29,980</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium">Exempt Milk Supplies (0% Rate)</span>
              <span className="font-mono font-black text-slate-900 text-sm">₹68,856</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-sky-50 border border-sky-200 rounded-2xl">
              <div>
                <span className="text-sky-950 font-black block">Tax Collected (5% on Ghee & Sweets)</span>
                <span className="text-[11px] text-sky-700">CGST 2.5% + SGST 2.5%</span>
              </div>
              <span className="font-mono font-black text-sky-800 text-xl">₹3,624</span>
            </div>
          </div>

          <button 
            onClick={() => handleDownload('GSTR1_Monthly_Return_Aug2026.pdf')}
            className="w-full py-3 bg-sky-700 hover:bg-sky-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download GSTR-1 Tax Filing Sheet (PDF)</span>
          </button>
        </div>

        {/* Right Card: Monthly P&L Ledger & Margin Audit */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 space-y-5 relative overflow-hidden">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 mb-1">
                <BarChart3 className="w-5 h-5" />
                <span className="font-black text-xs uppercase tracking-wider">Agency Profit & Loss Audit</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">Monthly Net Margin</h3>
            </div>
            <span className="bg-sky-100 text-sky-900 border border-sky-300 text-[10px] font-black px-3 py-1 rounded-full">
              Audited
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600"/> Gross Turnover Revenue
              </span>
              <span className="font-mono font-black text-slate-900 text-sm">₹72,480</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-rose-600"/> Supply Dairy Tender Cost
              </span>
              <span className="font-mono font-black text-rose-700 text-sm">₹61,230</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-600"/> Shop Rent, Power & Labor
              </span>
              <span className="font-mono font-black text-amber-900 text-sm">₹4,000</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div>
                <span className="text-emerald-950 font-black block">Net Agency Profit Margin</span>
                <span className="text-[11px] text-emerald-700">10.0% Net Profit Margin</span>
              </div>
              <span className="font-mono font-black text-emerald-700 text-xl">₹7,250</span>
            </div>
          </div>

          <button 
            onClick={() => handleDownload('Monthly_PnL_Ledger_Aug2026.xlsx')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs shadow-emerald-500/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Audited P&L Sheet (.XLSX)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
