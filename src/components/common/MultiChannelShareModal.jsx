import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  Smartphone, 
  Send, 
  Share2, 
  CheckCheck, 
  ExternalLink, 
  Copy,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { GoogleAuthModal } from './GoogleAuthModal';
import { PhoneDialerModal } from './PhoneDialerModal';
import { SmsGatewayModal } from './SmsGatewayModal';

export const MultiChannelShareModal = ({
  isOpen,
  onClose,
  title = "Multi-Channel Contact & Dispatch",
  recipientName = "Customer",
  phone = "9443442471",
  recipientPhone = "",
  email = "customer@aavin.tn.gov.in",
  recipientEmail = "",
  subject = "Aavin Milk Hub Notice",
  message = "Aavin milk delivery update",
  defaultMessage = "",
  badge = "Direct Communication"
}) => {
  const { showNotification, isGoogleConnected, googleUser, t } = useShop();

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);

  if (!isOpen) return null;

  const actualPhone = phone || recipientPhone || '9443442471';
  const actualEmail = email || recipientEmail || 'customer@aavin.tn.gov.in';
  const actualMessage = message !== "Aavin milk delivery update" ? message : (defaultMessage || message);

  const cleanPhone = (actualPhone || '').replace(/[^0-9]/g, '');
  const cleanEmail = (actualEmail || '').trim();

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(actualMessage)}`;
    window.open(waUrl, '_blank');
    showNotification(`Opening WhatsApp for +91 ${cleanPhone}`);
  };

  const handleGmailWeb = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(actualMessage)}`;
    window.open(gmailUrl, '_blank');
    showNotification(`Opening Gmail Web Composer for ${cleanEmail}`);
  };

  const handleCopyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(actualMessage);
      showNotification('Message content copied to clipboard!');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl border-2 border-slate-200 dark:border-slate-800 space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-md shadow-indigo-500/20"
                style={{ background: 'var(--theme-gradient)' }}
              >
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base">{title}</h3>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    {badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Recipient: <strong>{recipientName}</strong> (+91 {cleanPhone})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message Content Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
              <span>Message Preview:</span>
              <button
                onClick={handleCopyText}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Message</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-mono leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 max-h-28 overflow-y-auto whitespace-pre-wrap">
              {message}
            </p>
          </div>

          {/* Omni-Channel Action Grid */}
          <div className="space-y-3">
            <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider block">
              {t('continue_with', 'Select Communication Channel:')}
            </span>

            {/* 1. Continue with Google */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl font-black text-xs transition shadow-2xs flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <div className="text-left">
                  <div className="font-extrabold">{t('continue_google', 'Continue with Google Account')}</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    {isGoogleConnected ? `Connected: ${googleUser?.email}` : 'Google Workspace Cloud Sync & Gmail'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 rounded-md">
                {isGoogleConnected ? '✓ Active' : 'OAuth'}
              </span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* 2. WhatsApp Direct */}
              <button
                type="button"
                onClick={handleWhatsApp}
                className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition shadow-md shadow-emerald-600/20 flex items-center gap-3 cursor-pointer group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-xs flex items-center justify-between">
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3 text-emerald-200" />
                  </div>
                  <div className="text-[10px] text-emerald-100 font-normal truncate">Open Web / Mobile Chat</div>
                </div>
              </button>

              {/* 3. Phone Call Dialer */}
              <button
                type="button"
                onClick={() => setShowPhoneModal(true)}
                className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs transition shadow-md shadow-blue-600/20 flex items-center gap-3 cursor-pointer group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-xs flex items-center justify-between">
                    <span>Phone Call</span>
                    <Sparkles className="w-3 h-3 text-blue-200" />
                  </div>
                  <div className="text-[10px] text-blue-100 font-normal truncate">In-App Smartphone Dialer & Contacts</div>
                </div>
              </button>

              {/* 4. Gmail / Email Web Composer */}
              <button
                type="button"
                onClick={handleGmailWeb}
                className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs transition shadow-md shadow-indigo-600/20 flex items-center gap-3 cursor-pointer group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-xs flex items-center justify-between">
                    <span>Gmail Web</span>
                    <ExternalLink className="w-3 h-3 text-indigo-200" />
                  </div>
                  <div className="text-[10px] text-indigo-100 font-normal truncate">Launch Gmail Composer</div>
                </div>
              </button>

              {/* 5. SMS Gateway & Dispatch */}
              <button
                type="button"
                onClick={() => setShowSmsModal(true)}
                className="p-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-xs transition shadow-md shadow-slate-900/20 flex items-center gap-3 cursor-pointer group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-xs flex items-center justify-between">
                    <span>SMS Gateway</span>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  </div>
                  <div className="text-[10px] text-slate-300 font-normal truncate">Direct Telecom SIM Dispatch</div>
                </div>
              </button>

            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {t('cancel', 'Close')}
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Modals */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />

      <PhoneDialerModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        recipientName={recipientName}
        phone={cleanPhone}
      />

      <SmsGatewayModal
        isOpen={showSmsModal}
        onClose={() => setShowSmsModal(false)}
        recipientName={recipientName}
        phone={cleanPhone}
        message={actualMessage}
      />
    </>
  );
};
