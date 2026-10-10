import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { MorningPOS } from './components/pos/MorningPOS';
import { WhatsAppChatHub } from './components/whatsapp/WhatsAppChatHub';
import { FreezerMonitor } from './components/inventory/FreezerMonitor';
import { ProductsCatalog } from './components/inventory/ProductsCatalog';
import { ExpiryWatch } from './components/inventory/ExpiryWatch';
import { AdvanceOrderPlanner } from './components/ordering/AdvanceOrderPlanner';
import { SmartPrediction } from './components/ordering/SmartPrediction';
import { FestivalPrediction } from './components/ordering/FestivalPrediction';
import { CustomerManagementHub } from './components/customers/CustomerManagementHub';
import { RouteOptimizer } from './components/delivery/RouteOptimizer';
import { LoyaltyAndFeedback } from './components/customers/LoyaltyAndFeedback';
import { ExpenseManagement } from './components/finance/ExpenseManagement';
import { LeftoverToCurdEngine } from './components/inventory/LeftoverToCurdEngine';
import { EventBulkOrders } from './components/events/EventBulkOrders';
import { FinancialAnalytics } from './components/analytics/FinancialAnalytics';
import { BusinessReports } from './components/analytics/BusinessReports';
import { CustomerPortalView } from './components/customer-portal/CustomerPortalView';
import { SettingsPage } from './components/settings/SettingsPage';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

function ToastNotification() {
  const { notification } = useShop();

  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className={`p-4 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-bold border ${
        notification.type === 'error'
          ? 'bg-rose-50 text-rose-900 border-rose-200 shadow-rose-500/10'
          : notification.type === 'warning'
          ? 'bg-amber-50 text-amber-900 border-amber-200 shadow-amber-500/10'
          : 'bg-emerald-50 text-emerald-950 border-emerald-200 shadow-emerald-500/10'
      }`}>
        {notification.type === 'error' ? (
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
        ) : notification.type === 'warning' ? (
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        )}
        <span className="leading-snug">{notification.message}</span>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, loggedInUser, activeTab } = useShop();

  // Authentication guard
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Dedicated Client-Side Portal (Customer View only)
  if (loggedInUser?.role === 'client' || loggedInUser?.role === 'customer' || loggedInUser?.role === 'b2b_wholesale') {
    return (
      <div className="min-h-screen w-full bg-[#f1f5f9] flex flex-col text-slate-800 antialiased font-sans">
        <Navbar />
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-6xl mx-auto w-full">
          <CustomerPortalView />
        </main>
        <ToastNotification />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'daily-sales':
        return <MorningPOS />;
      case 'freezer-monitor':
        return <FreezerMonitor />;
      case 'whatsapp-chat':
        return <WhatsAppChatHub />;
      case 'stock-management':
        return <ProductsCatalog />;
      case 'expiry-watch':
        return <ExpiryWatch />;
      case 'order-prediction':
        return <AdvanceOrderPlanner />;
      case 'smart-prediction':
        return <SmartPrediction />;
      case 'festival-prediction':
        return <FestivalPrediction />;
      case 'customer-management':
        return <CustomerManagementHub />;
      case 'route-delivery':
        return <RouteOptimizer />;
      case 'loyalty-feedback':
        return <LoyaltyAndFeedback />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'curd-production':
        return <LeftoverToCurdEngine />;
      case 'bulk-orders':
        return <EventBulkOrders />;
      case 'reports-analytics':
        return <FinancialAnalytics />;
      case 'gst-reports':
        return <BusinessReports />;
      case 'customer-portal':
        return <CustomerPortalView />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex flex-col text-slate-800 antialiased font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto w-full min-w-0">
          {renderActiveView()}
        </main>
      </div>

      <ToastNotification />
    </div>
  );
}

export function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

export default App;
