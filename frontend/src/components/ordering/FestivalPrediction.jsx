import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  ShoppingBag, 
  Info,
  PartyPopper,
  DollarSign,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Send,
  Zap,
  Tag,
  Package,
  Clock
} from 'lucide-react';

export const FestivalPrediction = () => {
  const { showNotification } = useShop();

  // Full calendar of major Tamil Nadu festivals up to next year (2026 - 2027)
  const [festivals, setFestivals] = useState([
    { 
      id: 'f1', 
      name: 'Vinayaka Chaturthi', 
      date: '07 Sep 2026', 
      season: 'Autumn Festival',
      icon: '🐘',
      badgeBg: 'bg-orange-100 text-orange-950 border-orange-300',
      gradient: 'from-amber-500/15 to-orange-500/10 border-orange-300',
      increase: '+40% Milk Surge', 
      extraPackets: '+120 pkts (Orange FCM)', 
      gheeSurge: '+15 Ghee Jars',
      targetDishes: 'Kozhukattai, Payasam & Temple Abhishekam', 
      estimatedSurgeRev: '₹7,800',
      applied: false
    },
    { 
      id: 'f2', 
      name: 'Navaratri & Saraswathi Pooja', 
      date: '03 Oct – 12 Oct 2026', 
      season: '10-Day Grand Pooja',
      icon: '🪷',
      badgeBg: 'bg-pink-100 text-pink-950 border-pink-300',
      gradient: 'from-pink-500/15 to-rose-500/10 border-pink-300',
      increase: '+35% Milk & Curd Surge', 
      extraPackets: '+180 pkts (Curd & Purple)', 
      gheeSurge: '+25 Ghee Jars',
      targetDishes: 'Sundal Milk, Butter & Evening Prasadam', 
      estimatedSurgeRev: '₹12,400',
      applied: false
    },
    { 
      id: 'f3', 
      name: 'Deepavali (Diwali Festival of Lights)', 
      date: '08 Nov 2026', 
      season: 'Mega Sweets & Ghee Rush',
      icon: '🪔',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
      gradient: 'from-amber-500/20 via-orange-500/15 to-yellow-500/10 border-amber-400',
      increase: '+80% Pure Ghee & Sweet Surge', 
      extraPackets: '+350 pkts Milk + 80 Ghee Jars', 
      gheeSurge: '+80 Pure Ghee Tins',
      targetDishes: 'Mysore Pak, Gulab Jamun, Laddu & Milk Sweets', 
      estimatedSurgeRev: '₹28,500',
      applied: false
    },
    { 
      id: 'f4', 
      name: 'Karthigai Deepam', 
      date: '02 Dec 2026', 
      season: 'Temple Lamps & Ghee Festival',
      icon: '🕉️',
      badgeBg: 'bg-rose-100 text-rose-950 border-rose-300',
      gradient: 'from-rose-500/15 to-amber-500/10 border-rose-300',
      increase: '+30% Cow Milk & Ghee Surge', 
      extraPackets: '+100 pkts Milk', 
      gheeSurge: '+30 Ghee Jars',
      targetDishes: 'Pori Urundai, Sweet Appam & Deepam Lamps', 
      estimatedSurgeRev: '₹6,900',
      applied: false
    },
    { 
      id: 'f5', 
      name: 'Christmas & New Year 2027', 
      date: '25 Dec 2026 – 01 Jan 2027', 
      season: 'Winter Holiday Season',
      icon: '🎄',
      badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      gradient: 'from-emerald-500/15 to-teal-500/10 border-emerald-300',
      increase: '+45% Milk, Butter & Cream', 
      extraPackets: '+200 pkts (Orange FCM)', 
      gheeSurge: '+40 Butter Blocks',
      targetDishes: 'Plum Cakes, Hot Cocoa & Bakery Cream Orders', 
      estimatedSurgeRev: '₹14,200',
      applied: false
    },
    { 
      id: 'f6', 
      name: 'Thai Pongal & Mattu Pongal 2027', 
      date: '14 Jan – 16 Jan 2027', 
      season: 'Tamil Harvest Festival (Mega Milk Rush)',
      icon: '🌾',
      badgeBg: 'bg-yellow-100 text-yellow-950 border-yellow-300',
      gradient: 'from-yellow-500/20 via-amber-500/15 to-orange-500/10 border-yellow-400',
      increase: '+70% Fresh Cow Milk Surge', 
      extraPackets: '+400 pkts (Orange & Purple)', 
      gheeSurge: '+60 Ghee Jars',
      targetDishes: 'Pot Overflowing Sweet Pongal & Temple Abhishekam', 
      estimatedSurgeRev: '₹24,000',
      applied: false
    },
    { 
      id: 'f7', 
      name: 'Ramzan / Eid-ul-Fitr 2027', 
      date: '20 Mar 2027', 
      season: 'Holy Iftar Milk Festival',
      icon: '🌙',
      badgeBg: 'bg-sky-100 text-sky-950 border-sky-300',
      gradient: 'from-sky-500/15 to-indigo-500/10 border-sky-300',
      increase: '+60% Full Cream Milk & Curd', 
      extraPackets: '+280 pkts Orange FCM', 
      gheeSurge: '+35 Ghee Jars',
      targetDishes: 'Sheer Khurma, Falooda & Cold Sweet Lassi', 
      estimatedSurgeRev: '₹16,500',
      applied: false
    },
    { 
      id: 'f8', 
      name: 'Tamil New Year (Puthandu 2027)', 
      date: '14 Apr 2027', 
      season: 'Chithirai First Day Celebration',
      icon: '🏛️',
      badgeBg: 'bg-purple-100 text-purple-950 border-purple-300',
      gradient: 'from-purple-500/15 to-pink-500/10 border-purple-300',
      increase: '+30% Payasam Milk & Curd', 
      extraPackets: '+140 pkts Purple Std', 
      gheeSurge: '+20 Ghee Jars',
      targetDishes: 'Mango Pachadi, Semiya Payasam & Vadai', 
      estimatedSurgeRev: '₹8,200',
      applied: false
    }
  ]);

  const handleApplyFestivalIndent = (fest) => {
    setFestivals(prev => prev.map(f => f.id === fest.id ? { ...f, applied: true } : f));
    showNotification(`⚡ Extra festival indent applied for ${fest.name}! (${fest.extraPackets} & ${fest.gheeSurge}) automatically added to Feeder planner.`);
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-pink-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Full Calendar 2026 – 2027
            </span>
            <span className="text-xs text-pink-100 font-medium">
              Festival Demand Surge & Pre-Order Planner
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Festival Prediction & Demand Planner</h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-xl">
            Predict high-demand festive days, pre-order extra milk packets, and reserve Aavin pure cow ghee tins for Tirunelveli feeder supply.
          </p>
        </div>

        {/* Global Surge Potential Pill */}
        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-pink-100 uppercase font-black tracking-wider block">Upcoming Festival Season</span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            +₹1,04,500
          </div>
          <span className="text-[10px] text-pink-100 font-bold block mt-0.5">
            8 Major Festive Surges Projected
          </span>
        </div>
      </div>

      {/* 2. Visual Festivals Calendar Grid (Up to Next Year 2027) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-pink-600" />
              <span>Upcoming Festivals Demand Forecast (2026 – 2027)</span>
            </h3>
            <p className="text-xs text-slate-500">Auto-calculate extra crate indents and pure cow ghee tins for Tamil Nadu festivals</p>
          </div>

          <span className="text-xs font-mono font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-xl">
            8 Festivals Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {festivals.map((fest) => (
            <div
              key={fest.id}
              className={`bg-white rounded-3xl border-2 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition h-full ${
                fest.applied ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-slate-200 hover:border-pink-300'
              }`}
            >
              <div className="space-y-3">
                
                {/* Festival Header Badge */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs">
                      {fest.icon}
                    </span>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 leading-snug">{fest.name}</h4>
                      <span className="text-[11px] font-mono text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-pink-600" /> {fest.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Demand Increase Banner */}
                <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-black uppercase text-pink-900 tracking-wider">Demand Surge:</span>
                    <strong className="text-pink-700 font-mono font-black">{fest.increase}</strong>
                  </div>
                  <div className="text-xs font-black text-slate-900 font-mono">
                    {fest.extraPackets}
                  </div>
                  <div className="text-[11px] text-amber-900 font-bold font-mono flex items-center gap-1">
                    <span>🏺 Ghee Target:</span>
                    <strong>{fest.gheeSurge}</strong>
                  </div>
                </div>

                {/* Target Dishes */}
                <div className="text-xs text-slate-600 font-medium min-h-[38px]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Popular Customer Uses:</span>
                  <span className="text-slate-800 line-clamp-2">{fest.targetDishes}</span>
                </div>

              </div>

              {/* Action Button & Estimated Surge Turnover */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-500">Est. Extra Revenue:</span>
                  <strong className="text-emerald-700 font-black font-sans">{fest.estimatedSurgeRev}</strong>
                </div>

                <button
                  onClick={() => handleApplyFestivalIndent(fest)}
                  disabled={fest.applied}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-2xs flex items-center justify-center gap-1.5 ${
                    fest.applied
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-pink-600/20 cursor-pointer'
                  }`}
                >
                  {fest.applied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Indent Applied ✅</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>1-Click Apply Surge ⚡</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
