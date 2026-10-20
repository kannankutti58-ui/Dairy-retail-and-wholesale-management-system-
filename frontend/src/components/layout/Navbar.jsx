import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  LogOut, 
  User, 
  Bell, 
  Settings, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  X,
  ExternalLink,
  Shield,
  RefreshCw,
  Globe,
  Palette,
  Moon,
  Sun,
  Share2,
  Check,
  Smartphone,
  PhoneCall,
  Mail,
  MessageSquare
} from 'lucide-react';
import { MultiChannelShareModal } from '../common/MultiChannelShareModal';
import { GoogleAuthModal } from '../common/GoogleAuthModal';

export const Navbar = () => {
  const { 
    shopSettings, 
    loggedInUser,
    logout, 
    activeTab, 
    setActiveTab, 
    showNotification,
    currentLanguage,
    setLanguage,
    t,
    themeId,
    setThemeColor,
    customThemeHex,
    isDarkMode,
    toggleDarkMode,
    activeTheme,
    THEME_PRESETS,
    isGoogleConnected,
    googleUser,
    connectGoogleAccount,
    disconnectGoogleAccount
  } = useShop();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showMultiChannelModal, setShowMultiChannelModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const [unreadCount, setUnreadCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [hexInput, setHexInput] = useState(customThemeHex || '#0284c7');

  const languages = [
    { code: 'ta', label: 'தமிழ்', sub: 'Tamil (தமிழ்நாடு)', flag: '🇮🇳' },
    { code: 'en', label: 'English', sub: 'Standard English', flag: '🇬🇧' },
    { code: 'tanglish', label: 'Tanglish', sub: 'Tamil in English letters', flag: '⚡' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi (भारत)', flag: '🕉️' }
  ];

  const notificationsList = [
    {
      id: 'n1',
      type: 'warning',
      title: 'Expiry Watch Alert (FIFO)',
      message: 'Aavin Blue Batch 24/08 (45 packets) expires in 2 days.',
      time: '10m ago',
      actionTab: 'stock-management',
      actionText: 'View Batch'
    },
    {
      id: 'n2',
      type: 'info',
      title: 'Tomorrow Advance Indent',
      message: 'Evening order plan ready for Tirunelveli Central Dairy.',
      time: '35m ago',
      actionTab: 'order-prediction',
      actionText: 'View Indent'
    },
    {
      id: 'n3',
      type: 'success',
      title: 'Van Route Live',
      message: 'Morning delivery routes active with live van tracker.',
      time: '1h ago',
      actionTab: 'route-delivery',
      actionText: 'Track Van'
    }
  ];

  const handleNotificationClick = (item) => {
    setActiveTab(item.actionTab);
    setShowNotifications(false);
    showNotification(`Navigated to ${item.title}`);
  };

  const handleClearNotifications = () => {
    setUnreadCount(0);
    showNotification("All notifications marked as read");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase();
    if (query.includes('milk') || query.includes('stock') || query.includes('blue') || query.includes('orange') || query.includes('ghee')) {
      setActiveTab('stock-management');
      showNotification(`Showing stock results for "${searchQuery}"`);
    } else if (query.includes('sale') || query.includes('bill') || query.includes('pos') || query.includes('cart')) {
      setActiveTab('daily-sales');
      showNotification(`Switched to POS for "${searchQuery}"`);
    } else if (query.includes('customer') || query.includes('card') || query.includes('attai') || query.includes('wholesale')) {
      setActiveTab('customer-management');
      showNotification(`Showing customer results for "${searchQuery}"`);
    } else if (query.includes('order') || query.includes('predict') || query.includes('indent') || query.includes('tomorrow')) {
      setActiveTab('order-prediction');
      showNotification(`Opening order prediction for "${searchQuery}"`);
    } else {
      setActiveTab('dashboard');
      showNotification(`Search matching items on Dashboard`);
    }
    setSearchQuery('');
  };

  const handleApplyCustomHex = (color) => {
    setHexInput(color);
    setThemeColor('custom', color);
    showNotification(`Custom color ${color} applied!`);
  };

  return (
    <>
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 h-16 flex items-center justify-between px-3 sm:px-5 lg:px-6 sticky top-0 z-40 shadow-xs transition-colors duration-200">
        
        {/* Left: Brand Identity with New Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md border-2 border-sky-300 dark:border-slate-700 bg-white p-0.5 shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-200">
              <img 
                src="/kuttiammal-dairy-logo.png" 
                alt="Kuttiammal's Dairy Hub Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                <span>{currentLanguage === 'en' ? (shopSettings?.shopName || "Kuttiammal's Dairy Hub") : t('app_title', 'குட்டியம்மாள் பால் ஏஜென்சி')}</span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                  Aavin
                </span>
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t('kovilpatti_route', 'Kovilpatti Route')}</span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                <span className="hidden sm:inline font-mono">{t('live_sync', 'Live Sync')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Interactive Search Bar (Only for Admin/Staff) */}
        {loggedInUser?.role !== 'client' && loggedInUser?.role !== 'customer' && (
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search', 'Search milk, curd, orders, routes...')}
                className="w-full bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-none rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>
          </form>
        )}

        {/* Right: Controls (Language + Theme + Communication + Alerts + Profile) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          
          {/* 1. Quick Multi-Channel Contact Button */}
          <button
            onClick={() => setShowMultiChannelModal(true)}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition border border-indigo-200 dark:border-indigo-800 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Multi-Channel Contact (Mail, Phone, WhatsApp, SMS)"
          >
            <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden xl:inline">{t('contact_share', 'Contact & Share')}</span>
          </button>

          {/* 2. Multilingual Language Selector */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowLanguageMenu(!showLanguageMenu);
                setShowThemeMenu(false);
                setShowNotifications(false);
                setShowSettingsMenu(false);
                setShowProfileMenu(false);
              }}
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Change Language (மொழி தேர்வு)"
            >
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline uppercase">{currentLanguage}</span>
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
                  {t('select_language', 'Select Language / மொழி')}
                </div>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                      showNotification(`Language switched to ${lang.label}`);
                    }}
                    className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between text-xs cursor-pointer ${
                      currentLanguage === lang.code 
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="font-bold">{lang.label}</div>
                        <div className="text-[10px] text-slate-400">{lang.sub}</div>
                      </div>
                    </div>
                    {currentLanguage === lang.code && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Dynamic Theme & Any Color Palette Picker */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowLanguageMenu(false);
                setShowNotifications(false);
                setShowSettingsMenu(false);
                setShowProfileMenu(false);
              }}
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5"
              title="Theme Color Customizer (எந்த நிறமும் தேர்வு செய்யலாம்)"
            >
              <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3.5 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <h4 className="font-black text-xs uppercase tracking-wider">{t('theme_color', 'Theme Color')}</h4>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Toggle Dark/Light Mode"
                  >
                    {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                    <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                  </button>
                </div>

                {/* Preset Palettes Grid */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preset Palettes:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {THEME_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => setThemeColor(preset.id)}
                        className={`p-2 rounded-xl border-2 transition flex flex-col items-center gap-1 cursor-pointer ${
                          themeId === preset.id ? 'border-slate-900 dark:border-white shadow-md scale-105' : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                        title={preset.name}
                      >
                        <div 
                          className="w-5 h-5 rounded-full shadow-xs flex items-center justify-center text-white text-[10px]"
                          style={{ backgroundColor: preset.primary }}
                        >
                          {themeId === preset.id && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                        <span className="text-[9px] font-bold truncate max-w-full text-slate-700 dark:text-slate-300">
                          {preset.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom HEX Color Picker */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Choose Custom Color (எந்த நிறமும் தேர்வு):
                  </span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={hexInput}
                      onChange={(e) => handleApplyCustomHex(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer bg-transparent p-0.5 shrink-0"
                    />
                    <input 
                      type="text"
                      value={hexInput}
                      onChange={(e) => handleApplyCustomHex(e.target.value)}
                      placeholder="#2563eb"
                      className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 outline-none flex-1"
                    />
                    <button
                      onClick={() => handleApplyCustomHex(hexInput)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* 4. Notification Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLanguageMenu(false);
                setShowThemeMenu(false);
                setShowSettingsMenu(false);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-slate-200 dark:border-slate-700 cursor-pointer" 
              title="Real-Time Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900 dark:text-white">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs uppercase tracking-wider">Live System Alerts</span>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleClearNotifications}
                      className="text-[11px] text-blue-600 hover:underline font-bold"
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-72 overflow-y-auto">
                  {notificationsList.map((item) => (
                    <div key={item.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition flex items-start gap-2.5">
                      <div className="mt-0.5">
                        {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                        {item.type === 'info' && <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0" />}
                        {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs truncate">{item.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{item.message}</p>
                        <button 
                          onClick={() => handleNotificationClick(item)}
                          className="mt-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                        >
                          {item.actionText} <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Google Account Quick Button */}
          <button
            onClick={() => {
              if (isGoogleConnected) {
                showNotification(`Google Account active: ${googleUser?.email || 'kuttiammal.dairy@gmail.com'}`);
              } else {
                setShowGoogleModal(true);
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isGoogleConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title={isGoogleConnected ? `Google Account Connected: ${googleUser?.email}` : "Continue with Google"}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="hidden lg:inline">{isGoogleConnected ? 'Google Connected' : t('continue_google', 'Continue with Google')}</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5"></div>

          {/* 5. User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowLanguageMenu(false);
                setShowThemeMenu(false);
                setShowNotifications(false);
                setShowSettingsMenu(false);
              }}
              className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline font-bold">
                {loggedInUser?.name || shopSettings?.proprietor || "Kuttiammal M."}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900 dark:text-white">
                <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="font-extrabold text-sm">
                    {loggedInUser?.name || shopSettings?.proprietor}
                  </div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                    {loggedInUser?.role === 'customer' ? 'Subscribed Aavin Customer' : 'Store Proprietor & Manager'}
                  </div>
                  {isGoogleConnected && (
                    <div className="mt-1 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>✓ Google: {googleUser?.email}</span>
                    </div>
                  )}
                </div>

                <div className="p-2 space-y-1 text-xs">
                  {loggedInUser?.role !== 'client' && loggedInUser?.role !== 'customer' ? (
                    <>
                      <button 
                        onClick={() => {
                          setActiveTab('settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400" /> {t('settings', 'Agency Settings')}
                      </button>

                      <button 
                        onClick={() => {
                          setActiveTab('customer-portal');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" /> {t('customer_portal', 'Customer Portal')}
                      </button>
                    </>
                  ) : (
                    <div className="p-2 text-slate-500 font-medium text-[11px]">
                      🥛 Attai Card #ATT-101 Verified Active
                    </div>
                  )}
                </div>

                <div className="px-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={logout}
                    className="w-full py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Reusable Multi-Channel Share / Contact Modal */}
      <MultiChannelShareModal
        isOpen={showMultiChannelModal}
        onClose={() => setShowMultiChannelModal(false)}
        title="Multi-Channel Contact & Dispatch"
        recipientName={shopSettings.tenderAgentName || "Thiru. R. Shanmugam (Tender Head)"}
        phone={shopSettings.tenderAgentPhone || "9443442471"}
        email="tender.aavin@tn.gov.in"
        subject={`Aavin Indent Notice - ${shopSettings.shopName || "Kuttiammal Dairy"}`}
        message={`Vanakkam! Kuttiammal Dairy Hub Aavin Agency daily update & advance indent details are ready. Please confirm delivery.`}
        badge="Omni-Channel"
      />

      {/* Google Account OAuth Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </>
  );
};
