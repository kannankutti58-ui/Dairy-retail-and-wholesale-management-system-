import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  CalendarCheck,
  Users,
  RotateCcw,
  ClipboardList,
  TrendingUp,
  Globe,
  Settings,
  Navigation,
  Gift,
  DollarSign,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  PartyPopper,
  FileSpreadsheet,
  MessageCircle,
  ThermometerSnowflake
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, t } = useShop();

  const coreNav = [
    {
      id: 'dashboard',
      label: t('dashboard', 'Live Dashboard'),
      badge: 'Live',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300',
      icon: LayoutDashboard,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',
      activeBg: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20'
    },
    {
      id: 'daily-sales',
      label: t('daily_sales', 'Daily Sales & POS'),
      badge: 'Counter',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300',
      icon: ShoppingCart,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',
      activeBg: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20'
    },
    {
      id: 'freezer-monitor',
      label: t('freezer_monitor', 'Freezer & Cold Storage'),
      badge: '3.2°C ❄️',
      badgeColor: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 border border-cyan-300 font-bold',
      icon: ThermometerSnowflake,
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
      activeBg: 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 text-white shadow-md shadow-cyan-500/20'
    },
    {
      id: 'whatsapp-chat',
      label: t('whatsapp_chat', 'Omni-Channel Communications'),
      badge: '🟢 3 New',
      badgeColor: 'bg-emerald-500 text-white font-black animate-pulse',
      icon: MessageCircle,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300',
      activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20'
    },
    {
      id: 'stock-management',
      label: t('stock_management', 'Stock & Products Catalog'),
      badge: 'Catalog',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300',
      icon: Package,
      iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300',
      activeBg: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20'
    },
    {
      id: 'expiry-watch',
      label: t('expiry_watch', 'Expiry & Freshness Watch'),
      badge: 'Alerts',
      badgeColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300',
      icon: AlertOctagon,
      iconBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300',
      activeBg: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/20'
    }
  ];

  const predictionNav = [
    {
      id: 'order-prediction',
      label: t('order_prediction', "Tomorrow's Indent Plan"),
      icon: CalendarCheck,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300',
      activeBg: 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-md shadow-indigo-500/20'
    },
    {
      id: 'smart-prediction',
      label: t('smart_prediction', 'AI Smart Indent Engine'),
      badge: 'AI 94%',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-300',
      icon: Sparkles,
      iconBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300',
      activeBg: 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/20'
    },
    {
      id: 'festival-prediction',
      label: t('festival_prediction', 'Festival Spike Predictor'),
      badge: 'Spikes',
      badgeColor: 'bg-pink-100 dark:bg-pink-950/60 text-pink-900 dark:text-pink-300 border border-pink-300',
      icon: PartyPopper,
      iconBg: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300',
      activeBg: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/20'
    }
  ];

  const operationsNav = [
    {
      id: 'customer-management',
      label: t('customer_management', 'Customers & Monthly Attai'),
      icon: Users,
      iconBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300',
      activeBg: 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/20'
    },
    {
      id: 'route-delivery',
      label: t('route_delivery', 'Delivery Routes & Van GPS'),
      badge: 'Live 🚚',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 font-bold',
      icon: Navigation,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300',
      activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20'
    },
    {
      id: 'loyalty-feedback',
      label: t('loyalty_feedback', 'Loyalty Points & Feedback'),
      icon: Gift,
      iconBg: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300',
      activeBg: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/20'
    },
    {
      id: 'curd-production',
      label: t('curd_production', 'Leftover Milk to Curd Unit'),
      icon: RotateCcw,
      iconBg: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300',
      activeBg: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/20'
    },
    {
      id: 'bulk-orders',
      label: t('bulk_orders', 'Events & Bulk Booking'),
      icon: ClipboardList,
      iconBg: 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300',
      activeBg: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/20'
    }
  ];

  const financeAdminNav = [
    {
      id: 'expenses',
      label: t('expenses', 'Shop Expense Book'),
      icon: DollarSign,
      iconBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300',
      activeBg: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/20'
    },
    {
      id: 'reports-analytics',
      label: t('reports_analytics', 'Financial Analytics & P&L'),
      icon: TrendingUp,
      iconBg: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300',
      activeBg: 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md shadow-teal-500/20'
    },
    {
      id: 'gst-reports',
      label: t('gst_reports', 'GST & Monthly Reports'),
      badge: 'GSTR-1',
      badgeColor: 'bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300 border border-teal-300',
      icon: FileSpreadsheet,
      iconBg: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
      activeBg: 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-md shadow-teal-500/20'
    },
    {
      id: 'customer-portal',
      label: t('customer_portal', 'Client / Customer Portal'),
      icon: Globe,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300',
      activeBg: 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-500/20'
    },
    {
      id: 'settings',
      label: t('settings', 'Agency Settings & Config'),
      icon: Settings,
      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      activeBg: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md'
    }
  ];

  const renderNavGroup = (items, groupTitle, titleColor) => (
    <div className="space-y-1 mb-4">
      {groupTitle && (
        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider ${titleColor}`}>
          {groupTitle}
        </div>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={isActive ? { background: 'var(--theme-gradient)' } : {}}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
              isActive
                ? 'text-white shadow-md scale-[1.02]'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'bg-white/20 text-white' : item.iconBg
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="truncate text-left font-extrabold">{item.label}</span>
            </div>

            {item.badge && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black shrink-0 ml-1.5 ${
                isActive ? 'bg-white/25 text-white border border-white/30' : item.badgeColor
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-full lg:w-64 shrink-0 p-3 sm:p-4 bg-white dark:bg-slate-900 lg:border-r border-slate-200 dark:border-slate-800 lg:min-h-[calc(100vh-65px)] flex flex-col justify-between select-none transition-colors duration-200">
      
      {/* Upper Section */}
      <div className="space-y-2">
        {renderNavGroup(coreNav, "Aavin Core Modules", 'text-blue-700 dark:text-blue-400')}
        {renderNavGroup(predictionNav, 'Demand & Indents', 'text-purple-700 dark:text-purple-400')}
        {renderNavGroup(operationsNav, 'Distribution & Routes', 'text-emerald-700 dark:text-emerald-400')}
        {renderNavGroup(financeAdminNav, 'Finance & Settings', 'text-teal-700 dark:text-teal-400')}
      </div>

      {/* Bottom Info Card */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-200 dark:border-slate-700 p-3.5 rounded-2xl space-y-1 text-xs">
          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Tirunelveli Central Dairy</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            Feeder Union Supply Route Active
          </p>
        </div>
      </div>

    </aside>
  );
};
