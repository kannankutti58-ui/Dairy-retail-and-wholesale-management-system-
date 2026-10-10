import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Pagination } from '../common/Pagination';
import { MultiChannelShareModal } from '../common/MultiChannelShareModal';
import {
  Search,
  Phone,
  MapPin,
  IndianRupee,
  Store,
  Plus,
  CheckCircle2,
  AlertCircle,
  User,
  MessageCircle,
  Mail,
  Smartphone,
  Share2
} from 'lucide-react';

export const WholesaleClientsManager = () => {
  const {
    wholesaleClients,
    recordWholesalePayment,
    showNotification,
    shopSettings,
    sendWhatsAppMessage,
    sendMultiChannelCommunication,
    t
  } = useShop();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
  const [selectedClientForShare, setSelectedClientForShare] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredClients = wholesaleClients.filter(c =>
    c.businessName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.ownerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.phone.includes(searchFilter)
  );

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalOutstandingCredit = wholesaleClients.reduce((sum, c) => sum + c.pendingBalance, 0);
  const totalDailyQuota = wholesaleClients.reduce((sum, c) => sum + c.dailyQuotaPackets, 0);

  const handleCollectPayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0 || !selectedClientForPayment) return;
    recordWholesalePayment(selectedClientForPayment.id, Number(paymentAmount));
    showNotification(`Recorded ₹${paymentAmount} payment from ${selectedClientForPayment.businessName}`);
    setSelectedClientForPayment(null);
    setPaymentAmount('');
  };

  const getClientStatementText = (client) => {
    return `🥛 *KUTTIAMMAL'S DAIRY HUB - WHOLESALE ACCOUNT STATEMENT*
🏢 *Client:* ${client.businessName}
👤 *Proprietor:* ${client.ownerName}
----------------------------------------
📦 *Daily Standing Quota:* ${client.dailyQuotaPackets} Packets (${client.preferredMilk})
🏷️ *Commercial Rate:* ₹2 Discount / Packet Applied
💰 *CURRENT OUTSTANDING BALANCE:* ₹${client.pendingBalance}
📅 *Last Settlement Date:* ${client.lastPaymentDate}
----------------------------------------
💳 *Payment UPI / GPay:* ${shopSettings.phone || '98421 55678'}
🙏 _Thank you for your business! Aavin Milk Agency, Kovilpatti._`;
  };

  const handleSendWhatsAppLedger = (client) => {
    const text = getClientStatementText(client);

    sendWhatsAppMessage({
      recipientPhone: client.phone || '+91 98421 22002',
      recipientName: `${client.businessName} (${client.ownerName})`,
      text,
      recipientType: 'wholesale',
      badge: `B2B Wholesale • ${client.dailyQuotaPackets} pkts/day`,
      avatar: '🏪',
      avatarBg: 'bg-amber-100 text-amber-800'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Amber/Orange Gradient */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-amber-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              B2B Commercial Accounts
            </span>
            <span className="text-xs text-amber-100 font-medium">
              Tea Stalls, Bakeries & Hotels (₹2 OFF MRP)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Wholesale Commercial Clients</h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
            Manage daily bulk quotas, commercial discounts, WhatsApp statements, and credit ledger settlements.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shrink-0 shadow-xs">
          <span className="text-[10px] text-amber-100 uppercase font-black tracking-wider block">Total Outstanding Credit</span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            ₹{totalOutstandingCredit}
          </div>
          <span className="text-[10px] text-amber-100 font-bold block mt-0.5">
            {totalDailyQuota} pkts daily quota
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tea stall, bakery, owner name, phone..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border-2 border-slate-200 focus:border-amber-500 rounded-2xl pl-10 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none transition shadow-2xs"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold font-mono">
          Showing {filteredClients.length} Commercial Accounts
        </div>
      </div>

      {/* Clients Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-amber-300 transition"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      ₹2 Discount / Pkt Applied
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1.5">{client.businessName}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Proprietor: {client.ownerName}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Ledger Due</span>
                    <div className={`text-lg font-black font-mono ${
                      client.pendingBalance > 0 ? 'text-rose-600' : 'text-emerald-700'
                    }`}>
                      ₹{client.pendingBalance}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{client.address}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Daily Standing Quota: </span>
                    <strong className="text-amber-950 font-black">{client.dailyQuotaPackets} pkts ({client.dailyQuotaPackets * 0.5}L)</strong>
                  </div>
                  <div className="text-amber-900 capitalize font-bold font-sans text-[11px] bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    {client.preferredMilk.replace('-', ' ')}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  Last: <strong>{client.lastPaymentDate}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Direct Phone Call */}
                  <button
                    onClick={() => sendMultiChannelCommunication({ type: 'call', phone: client.phone, recipientName: client.businessName })}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition shadow-2xs"
                    title={`Call ${client.businessName} (${client.phone})`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>

                  {/* Direct SMS */}
                  <button
                    onClick={() => sendMultiChannelCommunication({ type: 'sms', phone: client.phone, text: `Hello ${client.ownerName}, your Aavin wholesale dues balance is Rs.${client.pendingBalance}. - Kuttiammal Dairy Hub`, recipientName: client.businessName })}
                    className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl transition shadow-2xs"
                    title={`Send SMS to ${client.phone}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>

                  {/* Direct WhatsApp */}
                  <button
                    onClick={() => handleSendWhatsAppLedger(client)}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition shadow-2xs"
                    title="Send WhatsApp Statement"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>

                  {/* Multi-Channel Modal */}
                  <button
                    onClick={() => setSelectedClientForShare(client)}
                    className="p-2 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl transition shadow-2xs"
                    title="Share Statement via any Channel"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Settle Payment */}
                  <button
                    onClick={() => {
                      setSelectedClientForPayment(client);
                      setPaymentAmount(client.pendingBalance > 0 ? client.pendingBalance.toString() : '500');
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-xs"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Settle</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredClients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Payment Modal */}
      {selectedClientForPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                Receive Ledger Settlement
              </h4>
              <button
                onClick={() => setSelectedClientForPayment(null)}
                className="text-slate-400 hover:text-slate-600 font-black"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
              <div className="font-black text-slate-900 text-sm">{selectedClientForPayment.businessName}</div>
              <div className="text-slate-600">
                Outstanding Dues: <strong className="text-rose-600 font-mono font-black">₹{selectedClientForPayment.pendingBalance}</strong>
              </div>
            </div>

            <form onSubmit={handleCollectPayment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Settlement Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl p-2.5 font-mono font-black text-lg text-slate-900 focus:outline-none"
                />
              </div>

              {/* Quick Amount Presets */}
              <div className="flex gap-2">
                {[500, 1000, selectedClientForPayment.pendingBalance].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPaymentAmount(val.toString())}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 transition"
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-2xl transition shadow-xs"
                >
                  Confirm Settlement
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedClientForPayment(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-2xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Channel Statement Modal */}
      {selectedClientForShare && (
        <MultiChannelShareModal
          isOpen={Boolean(selectedClientForShare)}
          onClose={() => setSelectedClientForShare(null)}
          title={`Statement - ${selectedClientForShare.businessName}`}
          recipientName={`${selectedClientForShare.businessName} (${selectedClientForShare.ownerName})`}
          recipientPhone={selectedClientForShare.phone}
          recipientEmail={`wholesale.${selectedClientForShare.id}@gmail.com`}
          subject={`Aavin Wholesale Account Statement - ${selectedClientForShare.businessName}`}
          defaultMessage={getClientStatementText(selectedClientForShare)}
        />
      )}

    </div>
  );
};
