import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Pagination } from '../common/Pagination';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Phone, 
  User, 
  Award, 
  CheckCircle2, 
  Tag, 
  DollarSign,
  Building,
  Truck,
  Layers,
  ArrowRight
} from 'lucide-react';

export const EventBulkOrders = () => {
  const {
    eventOrders,
    addNewEventOrder,
    showNotification
  } = useShop();

  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [eventForm, setEventForm] = useState({
    eventName: '',
    contactPerson: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    eventTime: '04:30 AM',
    milkType: 'aavin-orange',
    qtyLiters: 50,
    advanceReceived: 2000
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventForm.eventName || !eventForm.contactPerson) return;

    const packets = eventForm.qtyLiters * 2;
    const ratePerPkt = eventForm.milkType === 'aavin-orange' ? 28 : 22;
    const totalAmount = packets * ratePerPkt;

    const eventData = {
      eventName: eventForm.eventName,
      contactPerson: eventForm.contactPerson,
      phone: eventForm.phone,
      date: eventForm.date,
      eventTime: eventForm.eventTime,
      totalAmount,
      advanceReceived: Number(eventForm.advanceReceived),
      items: [
        {
          type: eventForm.milkType,
          name: eventForm.milkType === 'aavin-orange' ? 'Aavin Full Cream (Orange)' : 'Aavin Delight (Purple)',
          qtyPackets: packets,
          liters: Number(eventForm.qtyLiters),
          unitRate: ratePerPkt,
          total: totalAmount
        }
      ]
    };

    addNewEventOrder(eventData);
    setShowNewEventModal(false);
    showNotification(`Booked bulk order for ${eventForm.eventName} (${eventForm.qtyLiters}L / ₹${totalAmount})!`);
    setEventForm({
      eventName: '',
      contactPerson: '',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      eventTime: '04:30 AM',
      milkType: 'aavin-orange',
      qtyLiters: 50,
      advanceReceived: 2000
    });
  };

  const paginatedEvents = eventOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalEventVolumeLiters = eventOrders.reduce((sum, e) => {
    const l = e.items.reduce((s, it) => s + (it.liters || 0), 0);
    return sum + l;
  }, 0);

  const totalEventAdvance = eventOrders.reduce((sum, e) => sum + (e.advanceReceived || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-indigo-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Institutional Bookings
            </span>
            <span className="text-xs text-sky-200 font-medium">
              Weddings, Temples & Schools
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Bulk Event Orders & Supply</h2>
          <div className="flex items-center gap-3 text-xs text-sky-100 mt-1">
            <span>Booked Volume: <strong>{totalEventVolumeLiters} Litres</strong></span>
            <span>•</span>
            <span>Advance Tokens Collected: <strong>₹{totalEventAdvance}</strong></span>
          </div>
        </div>

        <button
          onClick={() => setShowNewEventModal(true)}
          className="bg-white hover:bg-sky-50 text-indigo-950 font-black px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 transition self-start md:self-auto shrink-0 shadow-md"
        >
          <Plus className="w-4 h-4 text-sky-700" />
          <span>New Bulk Booking</span>
        </button>
      </div>

      {/* 2. Events Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-sky-300 transition"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-base text-slate-900">{evt.eventName}</h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.contactPerson} ({evt.phone})</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full">
                    {evt.status}
                  </span>
                </div>

                <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 font-semibold font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      Date: <strong className="text-slate-900">{evt.date}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      Delivery: <strong className="text-slate-900">{evt.eventTime}</strong>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    {evt.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{it.name} ({it.liters}L / {it.qtyPackets} pkts)</span>
                        <span className="font-mono font-black text-slate-900">₹{it.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                  <span className="text-[9px] text-sky-800 font-sans block font-black uppercase tracking-wider">Advance Token</span>
                  <strong className="text-sky-950 font-black text-base">₹{evt.advanceReceived}</strong>
                </div>
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-right">
                  <span className="text-[9px] text-rose-800 font-sans block font-black uppercase tracking-wider">Balance Due</span>
                  <strong className="text-rose-950 font-black text-base">₹{evt.balanceDue}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={eventOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                Book Bulk Event Supply
              </h3>
              <button
                onClick={() => setShowNewEventModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Event / Institution Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Reception at Mahal"
                  value={eventForm.eventName}
                  onChange={(e) => setEventForm({ ...eventForm, eventName: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={eventForm.contactPerson}
                    onChange={(e) => setEventForm({ ...eventForm, contactPerson: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="98421 XXXXX"
                    value={eventForm.phone}
                    onChange={(e) => setEventForm({ ...eventForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Delivery Time</label>
                  <input
                    type="text"
                    value={eventForm.eventTime}
                    onChange={(e) => setEventForm({ ...eventForm, eventTime: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Milk Variety</label>
                  <select
                    value={eventForm.milkType}
                    onChange={(e) => setEventForm({ ...eventForm, milkType: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="aavin-orange">Aavin Orange (Full Cream)</option>
                    <option value="aavin-purple">Aavin Purple (Standard)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Volume (Litres)</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    required
                    value={eventForm.qtyLiters}
                    onChange={(e) => setEventForm({ ...eventForm, qtyLiters: Number(e.target.value) })}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-mono font-black text-base text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Advance Payment Received (₹)</label>
                <input
                  type="number"
                  value={eventForm.advanceReceived}
                  onChange={(e) => setEventForm({ ...eventForm, advanceReceived: Number(e.target.value) })}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-mono font-black text-base text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 rounded-2xl transition shadow-xs"
                >
                  Save Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewEventModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-2xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
