import React, { useState } from 'react';
import { MonthlyBookletLedger } from '../booklet/MonthlyBookletLedger';
import { WholesaleClientsManager } from '../wholesale/WholesaleClientsManager';
import { HomeDeliveryManager } from '../delivery/HomeDeliveryManager';
import { LoyaltyAndFeedback } from './LoyaltyAndFeedback';
import { RouteOptimizer } from '../delivery/RouteOptimizer';
import { BookOpen, Store, Truck, Gift, Navigation } from 'lucide-react';

export const CustomerManagementHub = () => {
  const [customerSubTab, setCustomerSubTab] = useState('booklet');

  const subTabs = [
    { id: 'booklet', label: 'Monthly Cards (Attai)', icon: BookOpen, color: 'from-purple-600 to-indigo-700' },
    { id: 'wholesale', label: 'Wholesale Accounts', icon: Store, color: 'from-amber-600 to-orange-700' },
    { id: 'delivery', label: 'Home Delivery Checklist', icon: Truck, color: 'from-emerald-600 to-teal-700' },
    { id: 'loyalty', label: 'Loyalty & VIP Reviews', icon: Gift, color: 'from-pink-600 to-rose-700' },
    { id: 'route-opt', label: 'Route GPS Optimizer', icon: Navigation, color: 'from-blue-600 to-cyan-700' }
  ];

  const activeTabData = subTabs.find(t => t.id === customerSubTab) || subTabs[0];

  return (
    <div className="space-y-6">
      
      {/* Colorful Pill Sub-Tab Bar */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-2 shadow-xs flex items-center space-x-2 overflow-x-auto text-xs scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = customerSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCustomerSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold transition-all flex items-center space-x-2 shrink-0 ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-md scale-[1.02]`
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Component */}
      <div>
        {customerSubTab === 'booklet' && <MonthlyBookletLedger />}
        {customerSubTab === 'wholesale' && <WholesaleClientsManager />}
        {customerSubTab === 'delivery' && <HomeDeliveryManager />}
        {customerSubTab === 'loyalty' && <LoyaltyAndFeedback />}
        {customerSubTab === 'route-opt' && <RouteOptimizer />}
      </div>

    </div>
  );
};
