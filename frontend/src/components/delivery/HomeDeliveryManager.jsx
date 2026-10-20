import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Pagination } from '../common/Pagination';
import { User, Home, Check, CheckCircle2, Navigation, Clock, MapPin, Truck } from 'lucide-react';

export const HomeDeliveryManager = () => {
  const {
    deliveryRoutes,
    updateDeliveryStatus,
    showNotification
  } = useShop();

  const [activeRouteId, setActiveRouteId] = useState(deliveryRoutes[0]?.routeId || '');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const activeRoute = deliveryRoutes.find(r => r.routeId === activeRouteId) || deliveryRoutes[0];

  const totalHouses = deliveryRoutes.reduce((sum, r) => sum + r.houses.length, 0);
  const totalDelivered = deliveryRoutes.reduce(
    (sum, r) => sum + r.houses.filter(h => h.status === 'delivered').length, 0
  );

  const paginatedHouses = activeRoute?.houses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  const handleStatusToggle = (routeId, houseId, status, houseName) => {
    updateDeliveryStatus(routeId, houseId, status);
    showNotification(status === 'delivered' ? `Marked ${houseName} as Delivered ✅` : `Marked ${houseName} as Pending ⏳`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Emerald Gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-emerald-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
              Morning Delivery Routes
            </span>
            <span className="text-xs text-emerald-100 font-medium">
              5:15 AM - 6:45 AM Run
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">Home Delivery Routes & Boy Assignment</h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Monitor route boys, track street delivery stops, and log live household deliveries.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3 rounded-xl text-center shrink-0 min-w-[200px] shadow-sm">
          <div className="text-xs font-black text-white font-mono flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{totalDelivered} / {totalHouses} Delivered</span>
          </div>
          <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-300 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${(totalDelivered / (totalHouses || 1)) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-emerald-100 font-bold block mt-1">
            {((totalDelivered / (totalHouses || 1)) * 100).toFixed(0)}% Shift Completed
          </span>
        </div>
      </div>

      {/* Route Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {deliveryRoutes.map((route) => {
          const isSelected = activeRoute?.routeId === route.routeId;
          const deliveredInRoute = route.houses.filter(h => h.status === 'delivered').length;
          const isComplete = deliveredInRoute === route.houses.length;

          return (
            <button
              key={route.routeId}
              onClick={() => {
                setActiveRouteId(route.routeId);
                setCurrentPage(1);
              }}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-50/90 to-white border-emerald-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-extrabold text-sm text-slate-900">{route.routeName}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isComplete
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {deliveredInRoute}/{route.houses.length} Houses
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mt-2">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery Staff: <strong className="text-slate-800">{route.deliveryBoy}</strong></span>
              </p>
            </button>
          );
        })}
      </div>

      {/* Route House Checklist */}
      {activeRoute && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-600" />
                <span>{activeRoute.routeName} — House Stop Checklist</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Assigned to {activeRoute.deliveryBoy} (Dispatched 5:15 AM)</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
              {activeRoute.houses.length} Total Drops
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {paginatedHouses.map((house) => {
              const isDelivered = house.status === 'delivered';

              return (
                <div
                  key={house.id}
                  className={`py-3.5 px-3 rounded-2xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDelivered ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-2xs">
                      <span>{house.houseNo}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-xs text-slate-900">{house.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {house.plan === 'monthly' ? 'Monthly Attai Card' : 'Daily Cash'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">
                        <span className="font-bold text-emerald-800 capitalize bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                          {house.qty}x {house.milkType.replace('-', ' ')} ({house.qty * 0.5}L)
                        </span>
                        {house.notes && (
                          <span className="text-slate-500 italic text-[11px]">"{house.notes}"</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleStatusToggle(activeRoute.routeId, house.id, 'delivered', house.name)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                        isDelivered
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isDelivered ? 'Delivered ✅' : 'Mark Delivered'}</span>
                    </button>

                    <button
                      onClick={() => handleStatusToggle(activeRoute.routeId, house.id, 'pending', house.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        !isDelivered
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>Pending</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={activeRoute.houses.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
