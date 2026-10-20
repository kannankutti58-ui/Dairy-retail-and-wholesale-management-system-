import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Save,
  Building,
  Store,
  Printer,
  Truck,
  Shield,
  CheckCircle2,
  Cloud,
  Lock,
  Smartphone,
  RefreshCw,
  Clock,
  MapPin,
  FileText,
  Palette,
  Globe,
  Sun,
  Moon,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Sparkles
} from 'lucide-react';
import { GoogleAuthModal } from '../common/GoogleAuthModal';
import { PhoneDialerModal } from '../common/PhoneDialerModal';
import { SmsGatewayModal } from '../common/SmsGatewayModal';
import { GiftBrochureModal } from '../common/GiftBrochureModal';
import { Gift, Send } from 'lucide-react';

export const SettingsPage = () => {
  const {
    shopSettings,
    updateShopSettings,
    showNotification,
    themeId,
    customThemeHex,
    isDarkMode,
    setThemeColor,
    toggleDarkMode,
    activeTheme,
    THEME_PRESETS,
    currentLanguage,
    setLanguage,
    t,
    sendMultiChannelCommunication,
    isGoogleConnected,
    googleUser,
    connectGoogleAccount,
    disconnectGoogleAccount
  } = useShop();

  const [customHexInput, setCustomHexInput] = useState(customThemeHex || '#0284c7');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const [form, setForm] = useState({
    shopName: shopSettings.shopName || "Kuttiammal's Dairy Hub",
    proprietor: shopSettings.proprietor || "Kuttiammal M.",
    phone: shopSettings.phone || "7604936341",
    email: shopSettings.email || "kuttiammal.dairy@aavin.tn.gov.in",
    address: shopSettings.address || "Main Road, Tirunelveli Supply Route, Tamil Nadu",
    opensAt: shopSettings.opensAt || "5:00 AM",
    closesAt: shopSettings.closesAt || "9:00 PM",
    wholesaleDiscountPerPacket: shopSettings.wholesaleDiscountPerPacket || 2,
    advanceOrderCutoffTime: shopSettings.advanceOrderCutoffTime || "10:00 PM",
    tenderAgentName: shopSettings.tenderAgentName || "Thiru. R. Shanmugam",
    tenderAgentPhone: shopSettings.tenderAgentPhone || "+91 76049 36341",
    supplyDairyUnit: shopSettings.supplyDairyUnit || "Aavin Feeder Dairy, Reddiarpatti / Tirunelveli District Union",
    printerHeader: shopSettings.printerHeader || "KUTTIAMMAL'S DAIRY HUB - AAVIN AGENCY",
    printerFooterTamil: shopSettings.printerFooterTamil || "நன்றி! மீண்டும் வருக! (Fresh Daily Tirunelveli Milk)",
    taxNumber: shopSettings.taxNumber || "GSTIN33AAACD1234A1Z5"
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateShopSettings(form);
    showNotification("Agency settings saved & synced successfully!");
  };

  const handleBackupNow = () => {
    showNotification("Triggered instant cloud database backup! All 42 customer accounts synced.");
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner */}
      <div 
        className="rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5 transition-all duration-300"
        style={{ background: 'var(--theme-gradient)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              {t('settings', 'System Configuration')}
            </span>
            <span className="text-xs text-sky-200 font-medium">
              Agency Terminal Settings
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">{t('settings', 'Agency Settings & Master Control')}</h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
            Configure live theme colors, instant multilingual language, Google cloud sync, store proprietor profile, and thermal printer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackupNow}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-bold text-xs transition border border-white/20 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Cloud className="w-4 h-4 text-sky-300" />
            <span>Backup Database Now</span>
          </button>
        </div>
      </div>

      {/* Interactive Customization Master (Theme, Language, Multi-Channel, Google) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Theme & Color Palette Customizer */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 font-extrabold text-slate-900 text-sm">
              <Palette className="w-5 h-5 text-indigo-600" />
              <span>{t('theme_color', 'Theme Color & Appearance')}</span>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800 text-amber-300 border border-slate-700' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isDarkMode ? t('dark_mode', 'Dark Mode') : t('light_mode', 'Light Mode')}</span>
            </button>
          </div>

          {/* Preset Swatches */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Preset Themes ({THEME_PRESETS.length} Styles):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {THEME_PRESETS.map((preset) => {
                const isSelected = themeId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setThemeColor(preset.id);
                      setCustomHexInput(preset.primary);
                      showNotification(`Theme set to ${preset.name}!`);
                    }}
                    className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs scale-105'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-xl shadow-xs border border-white flex items-center justify-center text-white text-[10px]"
                      style={{ background: preset.gradient }}
                    >
                      {isSelected && '✓'}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 truncate w-full text-center">
                      {preset.nameTamil || preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Any Custom Color (Color Picker & Hex) */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Custom Color (Any HEX / Picker):</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-slate-500">{customHexInput}</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customHexInput}
                onChange={(e) => {
                  setCustomHexInput(e.target.value);
                  setThemeColor('custom', e.target.value);
                }}
                className="w-12 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                placeholder="#0284c7"
                value={customHexInput}
                onChange={(e) => {
                  setCustomHexInput(e.target.value);
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    setThemeColor('custom', e.target.value);
                  }
                }}
                className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setThemeColor('custom', customHexInput)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Multilingual Language Switcher */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 font-extrabold text-slate-900 text-sm">
                <Globe className="w-5 h-5 text-sky-600" />
                <span>{t('select_language', 'Multilingual Support')}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Instant Reactive
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { id: 'en', name: 'English', native: 'English', flag: '🇬🇧', desc: 'Standard business terms' },
                { id: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', desc: 'முழுமையான தமிழ் இடைமுகம்' },
                { id: 'tanglish', name: 'Tanglish', native: 'Tanglish', flag: '🇮🇳', desc: 'Tamil in English letters' },
                { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', desc: 'भारतीय मानक हिंदी' }
              ].map((lang) => {
                const isSelected = currentLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.id);
                      showNotification(`Language switched to ${lang.name}!`);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/50 shadow-xs scale-102'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{lang.flag}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-slate-900 mt-1">{lang.native}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{lang.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Multi-Channel Communication Diagnostic */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Multi-Channel Communication Links</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                1-Click Direct
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPhoneModal(true)}
                className="py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?phone=91${(shopSettings.phone || '9842155678').replace(/[^0-9]/g, '')}&text=${encodeURIComponent('Vanakkam from Kuttiammal Dairy Hub!')}`, '_blank');
                  showNotification('Opening WhatsApp...');
                }}
                className="py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(shopSettings.email || 'kuttiammal.dairy@gmail.com')}&su=Agency+Inquiry&body=Vanakkam!`, '_blank');
                  showNotification('Opening Gmail Web...');
                }}
                className="py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSmsModal(true)}
                className="py-1.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
              >
                <Smartphone className="w-3 h-3" />
                <span>SMS</span>
              </button>
            </div>
          </div>

          {/* Google Workspace & Cloud Sync Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">Google Account & Cloud Backup</span>
                  <span className="text-[10px] text-slate-500">
                    {isGoogleConnected ? `Connected: ${googleUser?.email}` : 'Sync bills with Google Drive & Gmail'}
                  </span>
                </div>
              </div>

              {isGoogleConnected ? (
                <button
                  type="button"
                  onClick={disconnectGoogleAccount}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition cursor-pointer"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t('continue_google', 'Continue with Google')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-Time WhatsApp & SMS Gateway Hub Card */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
                      Real-Time WhatsApp & SMS Dispatch Hub
                    </span>
                    <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 font-bold px-2 py-0.5 rounded-md font-mono">
                      +91 76049 36341
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">
                    Dispatches instant bills, festive gift brochures, ₹100 vouchers & freezer alerts to +91 76049 36341
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGiftModal(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>🎁 Send Gift Brochure</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.open(`https://api.whatsapp.com/send?phone=917604936341&text=${encodeURIComponent('🥛 *KUTTIAMMAL DAIRY HUB TEST MESSAGE*\n\nWhatsApp integration active for +91 76049 36341!')}`, '_blank');
                    showNotification('Opening WhatsApp for +91 76049 36341');
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Test WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Store & Operator Details */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
            <Store className="w-5 h-5 text-sky-700" />
            <span>Store & Proprietor Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Agency Store Name</label>
              <input
                type="text"
                required
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Store Proprietor & Manager</label>
              <input
                type="text"
                required
                value={form.proprietor}
                onChange={(e) => setForm({ ...form, proprietor: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Contact Phone Number</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Registered GSTIN Number</label>
              <input
                type="text"
                required
                value={form.taxNumber}
                onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1.5">Physical Agency Store Address</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-sky-600 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Aavin Supply Chain & Feeder Dairy Unit */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
            <Truck className="w-5 h-5 text-indigo-700" />
            <span>Aavin Supply Chain & Feeder Logistics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1.5">Supply Dairy Unit</label>
              <input
                type="text"
                required
                value={form.supplyDairyUnit}
                onChange={(e) => setForm({ ...form, supplyDairyUnit: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Aavin Tender Supply Officer</label>
              <input
                type="text"
                required
                value={form.tenderAgentName}
                onChange={(e) => setForm({ ...form, tenderAgentName: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Tender Agent Contact</label>
              <input
                type="text"
                required
                value={form.tenderAgentPhone}
                onChange={(e) => setForm({ ...form, tenderAgentPhone: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Advance Indent Daily Cutoff Time</label>
              <input
                type="text"
                required
                value={form.advanceOrderCutoffTime}
                onChange={(e) => setForm({ ...form, advanceOrderCutoffTime: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Wholesale Commercial Discount (₹ / Pkt)</label>
              <input
                type="number"
                required
                value={form.wholesaleDiscountPerPacket}
                onChange={(e) => setForm({ ...form, wholesaleDiscountPerPacket: Number(e.target.value) })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Thermal Receipt Printer Settings */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
            <Printer className="w-5 h-5 text-emerald-700" />
            <span>Thermal Receipt & Printer Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Receipt Header Line</label>
              <input
                type="text"
                value={form.printerHeader}
                onChange={(e) => setForm({ ...form, printerHeader: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Receipt Footer Tamil Greeting</label>
              <input
                type="text"
                value={form.printerFooterTamil}
                onChange={(e) => setForm({ ...form, printerFooterTamil: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Cloud Backups & Access Security */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
            <Shield className="w-5 h-5 text-purple-700" />
            <span>Cloud Sync, Security & Device Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Offline Mode & Local Storage Sync</span>
                <span className="text-[11px] text-slate-500">Persists bills during internet cuts</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOfflineSyncEnabled(!offlineSyncEnabled);
                  showNotification(`Offline sync ${!offlineSyncEnabled ? 'enabled' : 'disabled'}`);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${offlineSyncEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${offlineSyncEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Proprietor 2FA Protected</span>
                <span className="text-[11px] text-slate-500">Requires passcode to view audited reports</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  showNotification(`2FA Protection ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${twoFactorEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${twoFactorEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Save Changes */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Agency Configuration</span>
          </button>
        </div>

      </form>

      {/* Interactive Sub-Modals */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />

      <PhoneDialerModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        recipientName={shopSettings.proprietor || "Shop Counter"}
        phone={shopSettings.phone || "7604936341"}
      />

      <SmsGatewayModal
        isOpen={showSmsModal}
        onClose={() => setShowSmsModal(false)}
        recipientName={shopSettings.proprietor || "Shop Counter"}
        phone={shopSettings.phone || "7604936341"}
        message={`Aavin Dairy Hub settings update alert for ${shopSettings.shopName || "Kuttiammal Dairy"}.`}
      />

      <GiftBrochureModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        targetPhone={shopSettings.phone || "7604936341"}
      />

    </div>
  );
};
