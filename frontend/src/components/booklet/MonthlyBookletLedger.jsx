import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Pagination } from '../common/Pagination';
import { MultiChannelShareModal } from '../common/MultiChannelShareModal';
import {
  Calendar,
  Plus,
  Search,
  Phone,
  Check,
  CheckCircle2,
  User,
  BookOpen,
  Clock,
  Droplets,
  MessageCircle,
  Mail,
  Smartphone,
  Share2
} from 'lucide-react';

export const MonthlyBookletLedger = () => {
  const {
    bookletCustomers,
    punchBookletDaily,
    addNewBookletCustomer,
    showNotification,
    sendMultiChannelCommunication,
    t
  } = useShop();

  const [selectedCustomerId, setSelectedCustomerId] = useState(bookletCustomers[0]?.id || '');
  const [searchFilter, setSearchFilter] = useState('');
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [newCardForm, setNewCardForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    subscribedMilk: 'aavin-purple',
    packetQuantity: 2,
    monthlyPaidAmount: 1440
  });

  const filteredCustomers = bookletCustomers.filter(c =>
    c.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.cardNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.phone.includes(searchFilter)
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedCustomer = bookletCustomers.find(c => c.id === selectedCustomerId) || bookletCustomers[0];

  const handleCreateNewCard = (e) => {
    e.preventDefault();
    if (!newCardForm.customerName || !newCardForm.phone) return;
    addNewBookletCustomer(newCardForm);
    setShowNewCardModal(false);
    showNotification(`New monthly card issued to ${newCardForm.customerName}`);
    setNewCardForm({
      customerName: '',
      phone: '',
      address: '',
      subscribedMilk: 'aavin-purple',
      packetQuantity: 2,
      monthlyPaidAmount: 1440
    });
  };

  const todayDay = new Date().getDate() || 24;

  const handlePunchToggle = (day) => {
    if (!selectedCustomer) return;
    punchBookletDaily(selectedCustomer.id, day);
    const wasPunched = selectedCustomer.punchedDays.includes(day);
    showNotification(wasPunched ? `Unmarked Day ${day} collection` : `Marked Day ${day} collection recorded!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Purple/Indigo Gradient */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-sky-700 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-purple-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
              Prepaid Subscription Ledger
            </span>
            <span className="text-xs text-purple-100 font-medium">
              Monthly Household Cards (அட்டை)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">Prepaid Monthly Card Ledger</h2>
          <p className="text-xs text-purple-100 mt-0.5">
            Manage advance monthly subscriptions, record daily punch collections, and issue new subscriber cards.
          </p>
        </div>

        <button
          onClick={() => setShowNewCardModal(true)}
          className="bg-white hover:bg-purple-50 text-purple-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition self-start md:self-auto shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4 text-purple-700" />
          <span>Issue New Card</span>
        </button>
      </div>

      {/* Main Grid: Customer Directory (Left) + Digital Punch Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Customer Directory with Search (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Card #, Name, Phone..."
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border-2 border-slate-200 focus:border-purple-500 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 font-medium focus:outline-none transition shadow-2xs"
            />
          </div>

          <div className="space-y-2.5">
            {paginatedCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              const isPunchedToday = cust.punchedDays.includes(todayDay);

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-50/80 to-white border-purple-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md">
                          {cust.cardNumber}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">{cust.customerName}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {cust.phone}
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPunchedToday
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {isPunchedToday ? 'Collected ✅' : 'Pending ⏳'}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>
                      {cust.packetQuantity} pkts/day ({cust.packetQuantity * 0.5}L)
                    </span>
                    <span className="font-mono text-purple-700 font-bold text-[11px]">
                      {cust.punchedDays.length}/{cust.totalDaysInMonth} days done
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredCustomers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right: Digital Attendance Grid (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
              
              {/* Account Header */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50/50 p-4 rounded-2xl border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-wider text-purple-900 font-mono bg-purple-200 px-2 py-0.5 rounded">
                      {selectedCustomer.cardNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{selectedCustomer.month}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {selectedCustomer.customerName}
                  </h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Quota: <strong className="text-slate-900">{selectedCustomer.packetQuantity} Packets/Day</strong> ({selectedCustomer.subscribedMilk.replace('-', ' ')})
                  </div>

                  {/* Multi-Channel Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <button
                      onClick={() => sendMultiChannelCommunication({ type: 'call', phone: selectedCustomer.phone, recipientName: selectedCustomer.customerName })}
                      className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                      title="Direct Phone Call"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => sendMultiChannelCommunication({ type: 'sms', phone: selectedCustomer.phone, text: `Hello ${selectedCustomer.customerName}, your monthly milk card status: ${selectedCustomer.punchedDays.length}/${selectedCustomer.totalDaysInMonth} collected. - Kuttiammal Dairy`, recipientName: selectedCustomer.customerName })}
                      className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                      title="Direct SMS"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>SMS</span>
                    </button>
                    <button
                      onClick={() => sendMultiChannelCommunication({ type: 'whatsapp', phone: selectedCustomer.phone, recipientName: selectedCustomer.customerName, text: `🥛 *AAVIN MONTHLY CARD UPDATE*\n👤 *Subscriber:* ${selectedCustomer.customerName}\n💳 *Card:* ${selectedCustomer.cardNumber}\n📊 *Collections:* ${selectedCustomer.punchedDays.length}/${selectedCustomer.totalDaysInMonth} Days\n🙏 _Kuttiammal Dairy Hub_` })}
                      className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                      title="WhatsApp Update"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                      title="Share Card Summary via Multi-Channel"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-purple-200 text-right shadow-2xs shrink-0 self-start sm:self-auto">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Advance Paid</span>
                  <div className="text-xl font-black text-purple-950 font-mono">
                    ₹{selectedCustomer.monthlyPaidAmount}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedCustomer.phone}</div>
                </div>
              </div>

              {/* 31-Day Punch Grid Header */}
              <div className="flex items-center justify-between pt-1">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>31-Day Attendance Punch Grid</span>
                </h4>

                <button
                  onClick={() => handlePunchToggle(todayDay)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs ${
                    selectedCustomer.punchedDays.includes(todayDay)
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedCustomer.punchedDays.includes(todayDay) ? `Undo Day ${todayDay}` : `Mark Today (Day ${todayDay})`}</span>
                </button>
              </div>

              {/* 31 Day Grid Buttons */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: selectedCustomer.totalDaysInMonth }, (_, i) => i + 1).map((day) => {
                  const isPunched = selectedCustomer.punchedDays.includes(day);
                  const isToday = day === todayDay;

                  return (
                    <button
                      key={day}
                      onClick={() => handlePunchToggle(day)}
                      className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center border-2 transition text-xs relative ${
                        isPunched
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs hover:bg-emerald-700'
                          : isToday
                          ? 'bg-amber-50 border-amber-400 text-amber-950 font-black shadow-2xs hover:bg-amber-100'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <span className={`text-[8px] uppercase font-bold ${isPunched ? 'text-emerald-100' : 'text-slate-400'}`}>Day</span>
                      <span className="text-xs font-mono font-black leading-none">{day}</span>

                      {isPunched && (
                        <span className="absolute top-1 right-1 text-[8px] font-black">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Days Collected</span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    {selectedCustomer.punchedDays.length} / {selectedCustomer.totalDaysInMonth}
                  </div>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Volume Delivered</span>
                  <div className="text-lg font-black text-purple-900 font-mono mt-0.5">
                    {selectedCustomer.punchedDays.length * (selectedCustomer.packetQuantity * 0.5)} L
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Days Remaining</span>
                  <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">
                    {selectedCustomer.totalDaysInMonth - selectedCustomer.punchedDays.length} days
                  </div>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>

      {/* New Card Modal */}
      {showNewCardModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Issue New Monthly Attai Card</h3>
              <button
                onClick={() => setShowNewCardModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewCard} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Meenakshi"
                  value={newCardForm.customerName}
                  onChange={(e) => setNewCardForm({ ...newCardForm, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="98421 XXXXX"
                    value={newCardForm.phone}
                    onChange={(e) => setNewCardForm({ ...newCardForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Daily Packets</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={newCardForm.packetQuantity}
                    onChange={(e) => setNewCardForm({ ...newCardForm, packetQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Subscribed Milk Variety</label>
                <select
                  value={newCardForm.subscribedMilk}
                  onChange={(e) => setNewCardForm({ ...newCardForm, subscribedMilk: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  <option value="aavin-purple">Aavin Delight (Purple 500ml)</option>
                  <option value="aavin-blue">Aavin Nice (Blue 500ml)</option>
                  <option value="aavin-orange">Aavin Full Cream (Orange 500ml)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Advance Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={newCardForm.monthlyPaidAmount}
                  onChange={(e) => setNewCardForm({ ...newCardForm, monthlyPaidAmount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl transition"
                >
                  Save & Issue Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCardModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Channel Share Modal */}
      {showShareModal && selectedCustomer && (
        <MultiChannelShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`Monthly Card - ${selectedCustomer.customerName}`}
          recipientName={selectedCustomer.customerName}
          recipientPhone={selectedCustomer.phone}
          recipientEmail={`subscriber.${selectedCustomer.id}@gmail.com`}
          subject={`Aavin Monthly Milk Card Summary - ${selectedCustomer.cardNumber}`}
          defaultMessage={`🥛 *KUTTIAMMAL'S DAIRY HUB - MONTHLY CARD SUMMARY*\n👤 *Subscriber:* ${selectedCustomer.customerName}\n💳 *Card:* ${selectedCustomer.cardNumber} (${selectedCustomer.month})\n🥛 *Daily Quota:* ${selectedCustomer.packetQuantity} Packets (${selectedCustomer.subscribedMilk})\n📊 *Punched Days:* ${selectedCustomer.punchedDays.length} of ${selectedCustomer.totalDaysInMonth} collected\n💰 *Advance Paid:* ₹${selectedCustomer.monthlyPaidAmount}\n🙏 _Thank you for choosing Aavin Dairy!_`}
        />
      )}
    </div>
  );
};
