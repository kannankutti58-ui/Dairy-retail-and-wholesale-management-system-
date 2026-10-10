import React, { useEffect } from 'react';
import { 
  Check, 
  Printer, 
  MessageCircle, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Share2, 
  Store,
  Calendar,
  CreditCard,
  User,
  Phone,
  Droplets
} from 'lucide-react';

export const TaxInvoiceReceiptModal = ({
  isOpen,
  onClose,
  receiptData,
  onSendWhatsApp = null
}) => {
  useEffect(() => {
    if (isOpen) {
      // Play satisfying success chime using Web Audio API
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
          osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        }
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen || !receiptData) return null;

  const {
    id = `PAY-RZP-${Date.now().toString().slice(-6)}`,
    amount = 1440,
    customerName = "M. Lakshmi",
    cardNumber = "ATT-101",
    phone = "98421 11001",
    planTitle = "Monthly Milk Attai Pass (60 Packets • 30 Days)",
    preferredMilk = "Aavin Delight Purple (500ml Std)",
    paymentMethod = "Razorpay (UPI / Google Pay)",
    paidAt = new Date().toLocaleString(),
    validUntil = "30 Nov 2026",
    loyaltyPointsEarned = 100
  } = receiptData;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    if (typeof onSendWhatsApp === 'function') {
      onSendWhatsApp(receiptData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* Styles for confetti & success animation */}
      <style>{`
        @keyframes successPop {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes rippleWave {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-success-pop {
          animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-ripple {
          animation: rippleWave 1.8s ease-out infinite;
        }
      `}</style>

      {/* Main Receipt Modal */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh]">
        
        {/* Top Header with Green Tick Animation Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative overflow-hidden shrink-0">
          
          {/* Background Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-teal-300/20 rounded-full blur-xl pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebratory Green Tick Animation */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center my-1">
            {/* Pulsing Ripple Rings */}
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ripple"></div>
            <div className="absolute inset-2 rounded-full bg-emerald-400/50 animate-ping" style={{ animationDuration: '2s' }}></div>

            {/* Solid Check Circle */}
            <div className="w-16 h-16 rounded-full bg-white text-emerald-600 shadow-xl flex items-center justify-center animate-success-pop relative z-10 border-4 border-emerald-200">
              <Check className="w-10 h-10 stroke-[3.5]" />
            </div>
          </div>

          <h3 className="text-xl font-black mt-2 text-white">
            Payment Received & Verified!
          </h3>
          <p className="text-xs text-emerald-100 font-medium">
            Official Aavin GST Tax Invoice & Monthly Pass Receipt
          </p>
        </div>

        {/* Receipt Printable Container */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200 text-xs">
          
          {/* Shop & Agency Header */}
          <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-800 space-y-1">
            <div className="inline-flex items-center gap-2 font-black text-sm text-slate-900 dark:text-white">
              <span>🥛 KUTTIAMMAL'S DAIRY HUB</span>
              <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-md font-bold">
                AAVIN CO-OP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Government Authorised Aavin Milk Agency • Kovilpatti - 628501
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              GSTIN: 33AAACD9443M1Z5 • Phone: +91 94434 42471
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 gap-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">Receipt No:</span>
              <strong className="text-blue-600 dark:text-blue-400 font-black">{id}</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">Date & Time:</span>
              <strong className="text-slate-800 dark:text-slate-200">{paidAt}</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">Customer Name:</span>
              <strong className="text-slate-900 dark:text-white font-sans font-bold">{customerName}</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">Card / Mobile:</span>
              <strong className="text-purple-600 dark:text-purple-400 font-bold">{cardNumber} • {phone}</strong>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
              Pass Subscription Breakdown:
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-xs text-slate-900 dark:text-white block">{planTitle}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">{preferredMilk}</span>
                </div>
                <strong className="font-mono text-sm text-slate-900 dark:text-white">₹{Number(amount).toLocaleString('en-IN')}</strong>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] flex items-center justify-between text-slate-500 font-mono">
                <span>Pass Extended Until: <strong className="text-emerald-600 font-bold">{validUntil}</strong></span>
                <span>Active Quota: <strong className="text-emerald-600 font-bold">60 Packets</strong></span>
              </div>
            </div>
          </div>

          {/* Amount Summary & Tax */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="font-sans">Subtotal (Milk Quota):</span>
              <span>₹{Number(amount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span className="font-sans">GST (Fresh Milk 0%):</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-emerald-300 dark:border-emerald-800 text-sm font-black text-emerald-900 dark:text-emerald-200">
              <span className="font-sans font-bold">Total Paid:</span>
              <span className="text-lg text-emerald-700 dark:text-emerald-400 font-sans">₹{Number(amount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Loyalty & Payment Method Pill */}
          <div className="flex items-center justify-between text-[11px] p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 font-mono text-amber-600 dark:text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{loyaltyPointsEarned} VIP Reward Points Credited</span>
            </div>

            <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
              <span>Mode:</span>
              <strong className="text-slate-800 dark:text-slate-200 uppercase">{paymentMethod}</strong>
            </div>
          </div>

          {/* Official Verification Seal */}
          <div className="p-3 bg-white dark:bg-slate-800/80 border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 block">
                  Official Verification Seal
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Recorded in POS Cloud Ledger • Tamper Proof
                </span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 text-emerald-600 flex flex-col items-center justify-center text-[7px] font-black uppercase font-mono transform rotate-12">
              <span>PAID</span>
              <span className="text-[6px]">VERIFIED</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-2 shrink-0">
          
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send to WhatsApp ({phone})</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Done ✓
          </button>
        </div>

      </div>

    </div>
  );
};

export default TaxInvoiceReceiptModal;
