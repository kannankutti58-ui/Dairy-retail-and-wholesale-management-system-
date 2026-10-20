import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Copy, 
  X, 
  Sparkles, 
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const SmsGatewayModal = ({
  isOpen,
  onClose,
  recipientName = "Customer",
  phone = "7604936341",
  message = "Aavin milk delivery update"
}) => {
  const { showNotification } = useShop();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [gatewayResult, setGatewayResult] = useState(null);
  const [gatewayStatus, setGatewayStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const formattedPhone = `+91 ${cleanPhone.slice(-10)}`;

  // Fetch backend SMS Gateway Status on open
  useEffect(() => {
    if (!isOpen) return;

    fetch('http://localhost:5000/api/communication/sms/status')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setGatewayStatus(data.data);
        }
      })
      .catch(() => {
        setGatewayStatus({
          isConfigured: false,
          provider: 'NONE',
          mode: 'DEVELOPMENT_FALLBACK'
        });
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendViaGateway = async () => {
    setIsSending(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/communication/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          message: message
        })
      });

      const result = await response.json();

      if (result.success && result.configured) {
        setIsSent(true);
        setGatewayResult(result);
        showNotification(`SMS dispatched via ${result.provider} to ${formattedPhone}!`);
      } else if (!result.configured) {
        // Not configured - clear notice without fake success
        setErrorMessage(result.message || 'SMS Gateway credentials are not configured in backend .env');
        showNotification('SMS Gateway not configured. Please use native phone SMS or copy text.', 'info');
      } else {
        setErrorMessage(result.error || 'Failed to dispatch SMS through telecom gateway.');
        showNotification('SMS Gateway Error: ' + (result.error || 'Check provider balance'), 'error');
      }
    } catch (err) {
      setErrorMessage(`Network error connecting to backend: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      showNotification('SMS message text copied to clipboard!');
    }
  };

  const handleLaunchNativeSMS = () => {
    window.location.href = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`;
    showNotification(`Launching native SMS app for ${formattedPhone}`);
  };

  const isConfigured = gatewayStatus?.isConfigured;

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
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm">Aavin SMS Gateway</h3>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${isConfigured ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                  {isConfigured ? 'Gateway Active' : 'Dev / Native Mode'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">TRAI DLT-Compliant Indian Telecom SMS</p>
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

        {/* Error / Status Notice */}
        {errorMessage && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Integration Notice:</strong> {errorMessage}
              <div className="text-[10px] text-amber-700 dark:text-amber-300 mt-1">
                You can directly send via your mobile device's Messages app using the button below.
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {isSent ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-extrabold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivered via Gateway!</span>
                </div>
                <span className="text-[10px] font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                Provider: <strong className="text-slate-900 dark:text-white">{gatewayResult?.provider || 'Fast2SMS'}</strong> • Request ID: <strong>{gatewayResult?.requestId || 'REQ-8891'}</strong>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setIsSent(false); setGatewayResult(null); }}
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
              {isConfigured ? (
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendViaGateway}
                  className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-2xl shadow-lg shadow-slate-900/30 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Transmitting via Fast2SMS / MSG91...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>Send via Direct Indian SMS Gateway</span>
                    </>
                  )}
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleLaunchNativeSMS}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span>Open in Native Phone Messages App</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>DLT Header: VK-AAVIN</span>
          </div>
          <span className="font-mono">Route: Indian GSM +91</span>
        </div>

      </div>
    </div>
  );
};
