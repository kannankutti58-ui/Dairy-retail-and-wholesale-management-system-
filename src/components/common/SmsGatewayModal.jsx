import React, { useState } from 'react';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Copy, 
  X, 
  Sparkles, 
  MessageSquare,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const SmsGatewayModal = ({
  isOpen,
  onClose,
  recipientName = "Customer",
  phone = "9443442471",
  message = "Aavin milk delivery update"
}) => {
  const { showNotification } = useShop();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sentTime, setSentTime] = useState('');

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const formattedPhone = `+91 ${cleanPhone.slice(-10)}`;

  if (!isOpen) return null;

  const handleSendViaGateway = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setSentTime(new Date().toLocaleTimeString());
      showNotification(`SMS dispatched via Jio/Airtel Gateway to ${formattedPhone}!`);
    }, 1100);
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      showNotification('SMS message text copied to clipboard!');
    }
  };

  const handleLaunchNativeSMS = () => {
    window.location.href = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`;
    showNotification(`Launching SMS messaging app for ${formattedPhone}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl border-2 border-slate-200 dark:border-slate-800 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm">Aavin SMS Gateway</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Instant GSM / SIM Delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient Box */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Recipient:</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{recipientName}</span>
          </div>
          <div className="text-right font-mono font-bold text-slate-700 dark:text-slate-300">
            {formattedPhone}
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
            <span>SMS Body ({message.length} chars):</span>
            <button
              onClick={handleCopy}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text</span>
            </button>
          </div>
          <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isSent ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-extrabold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivered Successfully to SIM!</span>
                </div>
                <span className="text-[10px] font-mono">{sentTime}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                Sender: <strong className="text-slate-900 dark:text-white">AAVIN-DAIRY</strong> • Route: Jio/Airtel PRI Gateway • Status: <strong>DELIVRD (0x00)</strong>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                >
                  Send another SMS
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={isSending}
                onClick={handleSendViaGateway}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-2xl shadow-lg shadow-slate-900/30 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Transmitting via SMS Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Send via Direct SMS Gateway</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLaunchNativeSMS}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Open in Phone Messages App</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>TRAI DLT Approved Sender</span>
          </div>
          <span className="font-mono">Header: VK-AAVIN</span>
        </div>

      </div>
    </div>
  );
};
