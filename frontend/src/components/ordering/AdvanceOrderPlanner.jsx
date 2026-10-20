import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Pagination } from '../common/Pagination';
import { MultiChannelShareModal } from '../common/MultiChannelShareModal';
import {
  Building,
  CheckCircle2,
  AlertTriangle,
  Send,
  Phone,
  Truck,
  Calendar,
  Clock,
  Droplets,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Mail,
  Share2
} from 'lucide-react';

export const AdvanceOrderPlanner = () => {
  const {
    calculateTomorrowAdvanceRequirement,
    todayCashUPIRevenue,
    submitAdvanceOrderToDairy,
    advanceOrdersHistory,
    supplyChain,
    showNotification,
    sendWhatsAppMessage,
    t
  } = useShop();

  const [bufferBonusPercent, setBufferBonusPercent] = useState(5);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTomorrowDate, setSelectedTomorrowDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const rawReq = calculateTomorrowAdvanceRequirement();

  const multiplier = 1 + (bufferBonusPercent / 100);
  const blueCrates = Math.ceil(rawReq.blue.crates * multiplier);
  const purpleCrates = Math.ceil(rawReq.purple.crates * multiplier);
  const orangeCrates = Math.ceil(rawReq.orange.crates * multiplier);
  const curdCrates = Math.ceil((rawReq.curd?.crates || 1) * multiplier);

  const bluePackets = blueCrates * 24;
  const purplePackets = purpleCrates * 24;
  const orangePackets = orangeCrates * 24;
  const curdPackets = curdCrates * 24;

  const totalCrates = blueCrates + purpleCrates + orangeCrates + curdCrates;
  const totalPackets = bluePackets + purplePackets + orangePackets + curdPackets;
  const totalLiters = totalPackets * 0.5;

  const curdCostRate = rawReq.curd?.costRate || 28;

  const totalCost = 
    (bluePackets * rawReq.blue.costRate) +
    (purplePackets * rawReq.purple.costRate) +
    (orangePackets * rawReq.orange.costRate) +
    (curdPackets * curdCostRate);

  const handlePlaceAdvanceOrder = () => {
    const orderData = {
      dateForTomorrow: selectedTomorrowDate,
      items: {
        'aavin-blue': { packets: bluePackets, crates: blueCrates, costPerPkt: rawReq.blue.costRate, totalCost: bluePackets * rawReq.blue.costRate },
        'aavin-purple': { packets: purplePackets, crates: purpleCrates, costPerPkt: rawReq.purple.costRate, totalCost: purplePackets * rawReq.purple.costRate },
        'aavin-orange': { packets: orangePackets, crates: orangeCrates, costPerPkt: rawReq.orange.costRate, totalCost: orangePackets * rawReq.orange.costRate },
        'aavin-curd-pouch': { packets: curdPackets, crates: curdCrates, costPerPkt: curdCostRate, totalCost: curdPackets * curdCostRate }
      },
      totalPackets,
      totalCrates,
      totalLiters,
      totalCost
    };

    submitAdvanceOrderToDairy(orderData);
    showNotification(`Advance order (${totalCrates} crates / ₹${totalCost}) transmitted to ${supplyChain.tenderAgentName}!`);
  };

  const getIndentText = () => {
    return `🥛 *AAVIN MILK AGENCY - DAILY ADVANCE INDENT*
📍 *Agency:* Kuttiammal's Dairy Hub, Kovilpatti
👤 *Proprietor:* Kuttiammal M. (Ph: 98421 55678)
🏢 *To Feeder Dairy:* ${supplyChain.supplyDairyUnit || 'Aavin Feeder Dairy / Tirunelveli District Union'}
👮 *Tender Officer:* ${supplyChain.tenderAgentName || 'Thiru. R. Shanmugam'}
----------------------------------------
📅 *Delivery Target Date:* ${selectedTomorrowDate} (Night Route 10:45 PM)
🚛 *Transport Vehicle:* TN-72-B-4412
----------------------------------------
📦 *CRATE & PACKET INDENT BREAKDOWN:*
🔵 *Aavin Nice Blue (Toned):* ${blueCrates} Crates (${bluePackets} Packets / ${bluePackets * 0.5}L)
🟣 *Aavin Delight Purple (Std):* ${purpleCrates} Crates (${purplePackets} Packets / ${purplePackets * 0.5}L)
🟠 *Aavin Full Cream Orange (FCM):* ${orangeCrates} Crates (${orangePackets} Packets / ${orangePackets * 0.5}L)
🥛 *Aavin Fresh Curd (500ml/Tubs):* ${curdCrates} Crates (${curdPackets} Pouches / ${curdPackets * 0.5}L)
----------------------------------------
📊 *TOTAL VOLUME:* ${totalCrates} Crates (${totalPackets} Packets / ${totalLiters} Litres)
💰 *ESTIMATED INDENT COST:* ₹${totalCost}
----------------------------------------
✅ _Please confirm morning feeder allocation and dispatch with night route vehicle TN-72-B-4412._`;
  };

  const handleSendWhatsAppIndent = () => {
    const text = getIndentText();
    sendWhatsAppMessage({
      chatId: 'c3',
      recipientPhone: supplyChain.tenderAgentPhone || '+91 94431 54321',
      recipientName: 'Thiru. R. Shanmugam (Aavin Tender Owner & Feeder Officer)',
      text,
      recipientType: 'officer',
      badge: 'Tirunelveli Central Feeder Dairy • Tender Head',
      avatar: '🏢',
      avatarBg: 'bg-blue-100 text-blue-800'
    });
  };

  const paginatedOrders = advanceOrdersHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner */}
      <div 
        className="rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5 transition-all duration-300"
        style={{ background: 'var(--theme-gradient)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-indigo-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              {t('indent_plan', 'Daily Indent Terminal')}
            </span>
            <span className="text-xs text-indigo-100 font-medium">
              {t('app_subtitle', 'Aavin Supply Order Planner')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">{t('tomorrow_supply_indent', "Tomorrow's Milk Supply Indent")}</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-100 mt-1">
            <span className="flex items-center gap-1 font-mono"><Clock className="w-3.5 h-3.5 text-sky-300" /> Cutoff: 10:00 PM Tonight</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono"><Truck className="w-3.5 h-3.5 text-emerald-300" /> Dispatch: 10:45 PM Night Feeder Route</span>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-indigo-100 uppercase font-black tracking-wider block">Estimated Tender Cost</span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            ₹{totalCost}
          </div>
          <span className="text-[10px] text-indigo-100 font-bold block mt-0.5">
            {totalCrates} Crates ({totalPackets} pkts / {totalLiters}L)
          </span>
        </div>
      </div>

      {/* 2. Control Bar (Date Picker & Buffer Controls) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{t('delivery_date', 'Supply Delivery Date')}</label>
            <input
              type="date"
              value={selectedTomorrowDate}
              onChange={(e) => setSelectedTomorrowDate(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <span className="text-xs font-bold text-slate-700">{t('safety_buffer', 'Safety Buffer')}:</span>
          {[0, 5, 10, 15].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setBufferBonusPercent(pct)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                bufferBonusPercent === pct
                  ? 'bg-indigo-600 text-white shadow-xs scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              +{pct}%
            </button>
          ))}
        </div>
      </div>

      {/* 3. Indent Grid by Milk Variety */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Blue */}
        <div className="bg-gradient-to-br from-blue-50/70 to-white rounded-3xl p-5 border-2 border-blue-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-black uppercase text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
              Aavin Blue (Toned)
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">₹{rawReq.blue.costRate}/pkt</span>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-950 font-mono">
              {blueCrates} <span className="text-xs font-bold text-slate-500 font-sans">Crates</span>
            </div>
            <div className="text-xs font-bold text-blue-700 font-mono mt-1">
              {bluePackets} Packets ({bluePackets * 0.5}L)
            </div>
          </div>

          <div className="pt-2 border-t border-blue-100 flex justify-between text-xs font-mono">
            <span className="text-slate-500">Cost:</span>
            <strong className="text-slate-900 font-black">₹{bluePackets * rawReq.blue.costRate}</strong>
          </div>
        </div>

        {/* Purple */}
        <div className="bg-gradient-to-br from-purple-50/70 to-white rounded-3xl p-5 border-2 border-purple-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-black uppercase text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
              Aavin Purple (Std)
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">₹{rawReq.purple.costRate}/pkt</span>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-950 font-mono">
              {purpleCrates} <span className="text-xs font-bold text-slate-500 font-sans">Crates</span>
            </div>
            <div className="text-xs font-bold text-purple-700 font-mono mt-1">
              {purplePackets} Packets ({purplePackets * 0.5}L)
            </div>
          </div>

          <div className="pt-2 border-t border-purple-100 flex justify-between text-xs font-mono">
            <span className="text-slate-500">Cost:</span>
            <strong className="text-slate-900 font-black">₹{purplePackets * rawReq.purple.costRate}</strong>
          </div>
        </div>

        {/* Orange */}
        <div className="bg-gradient-to-br from-orange-50/70 to-white rounded-3xl p-5 border-2 border-orange-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-black uppercase text-orange-950 bg-orange-100 px-2.5 py-0.5 rounded-full">
              Aavin Orange (FCM)
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">₹{rawReq.orange.costRate}/pkt</span>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-950 font-mono">
              {orangeCrates} <span className="text-xs font-bold text-slate-500 font-sans">Crates</span>
            </div>
            <div className="text-xs font-bold text-orange-700 font-mono mt-1">
              {orangePackets} Packets ({orangePackets * 0.5}L)
            </div>
          </div>

          <div className="pt-2 border-t border-orange-100 flex justify-between text-xs font-mono">
            <span className="text-slate-500">Cost:</span>
            <strong className="text-slate-900 font-black">₹{orangePackets * rawReq.orange.costRate}</strong>
          </div>
        </div>

        {/* Curd */}
        <div className="bg-gradient-to-br from-cyan-50/70 to-white rounded-3xl p-5 border-2 border-cyan-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-black uppercase text-cyan-950 bg-cyan-100 px-2.5 py-0.5 rounded-full">
              Aavin Fresh Curd
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">₹{curdCostRate}/pkt</span>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-950 font-mono">
              {curdCrates} <span className="text-xs font-bold text-slate-500 font-sans">Crates</span>
            </div>
            <div className="text-xs font-bold text-cyan-700 font-mono mt-1">
              {curdPackets} Pouches/Tubs ({curdPackets * 0.5}L)
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-100 flex justify-between text-xs font-mono">
            <span className="text-slate-500">Cost:</span>
            <strong className="text-slate-900 font-black">₹{curdPackets * curdCostRate}</strong>
          </div>
        </div>

      </div>

      {/* 4. Action Summary & WhatsApp Dispatch Box */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Order Dispatch Target</span>
          <div className="text-base font-black text-slate-900">
            {supplyChain.supplyDairyUnit}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <span>Tender Officer: <strong>{supplyChain.tenderAgentName}</strong></span>
            <span>•</span>
            <span className="font-mono">{supplyChain.tenderAgentPhone}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-5 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md shadow-sky-500/20 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Send Indent (Multi-Channel: Call / Mail / SMS / WA)</span>
          </button>

          <button
            onClick={handleSendWhatsAppIndent}
            className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Indent 📱</span>
          </button>

          <button
            onClick={handlePlaceAdvanceOrder}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Transmit (₹{totalCost})</span>
          </button>
        </div>
      </div>

      {/* Multi-Channel Indent Modal */}
      {showShareModal && (
        <MultiChannelShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`Tomorrow's Milk Indent - ${selectedTomorrowDate}`}
          recipientName={supplyChain.tenderAgentName || 'Thiru. R. Shanmugam (Aavin Tender Head)'}
          recipientPhone={supplyChain.tenderAgentPhone || '+91 94431 54321'}
          recipientEmail="aavin.feeder.tirunelveli@tn.gov.in"
          subject={`Aavin Milk Advance Indent for ${selectedTomorrowDate} - Kuttiammal Dairy Hub Kovilpatti`}
          defaultMessage={getIndentText()}
        />
      )}

      {/* 5. Indent Transmission History */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
            Previous Indents Transmitted
          </h3>
          <span className="text-xs text-slate-400 font-mono">{advanceOrdersHistory.length} Transmissions</span>
        </div>

        <div className="divide-y divide-slate-100">
          {paginatedOrders.map(order => (
            <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-mono font-black text-slate-900">{order.dateForTomorrow}</span>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {order.totalCrates} Crates • {order.totalPackets} Pkts ({order.totalLiters}L)
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-slate-900 text-sm">₹{order.estimatedSupplyCost || order.totalCost}</span>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={advanceOrdersHistory.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  );
};
