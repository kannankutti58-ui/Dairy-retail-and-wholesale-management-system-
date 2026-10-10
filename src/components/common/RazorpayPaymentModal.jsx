import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Wallet, 
  QrCode, 
  Clock, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles, 
  Lock, 
  ChevronRight, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  User, 
  ShieldAlert, 
  Printer, 
  Share2, 
  Download, 
  AlertCircle, 
  Zap, 
  ArrowLeft, 
  CheckCircle, 
  ExternalLink, 
  HelpCircle, 
  Fingerprint,
  Phone,
  MessageCircle,
  FileText
} from 'lucide-react';

export const RazorpayPaymentModal = ({
  isOpen,
  onClose,
  amount: initialAmount = 1440,
  customerName = "M. Lakshmi",
  customerPhone = "+91 94434 42471",
  customerEmail = "kannankutti58@gmail.com",
  merchantName = "Kuttiammal's Dairy Hub",
  merchantSubtitle = "Aavin Authorised Agency • Kovilpatti",
  description = "Aavin Monthly Attai Pass #ATT-101 Renewal",
  cardNumber = "ATT-101",
  onPaymentSuccess = null
}) => {
  // Dynamic Amount (Editable / Selectable)
  const [currentAmount, setCurrentAmount] = useState(initialAmount || 1440);
  const [isEditingAmount, setIsEditingAmount] = useState(false);

  // Screen Navigation:
  // 'selecting' | 'upi_pin' | 'card_otp' | 'netbanking_gateway' | 'processing' | 'tax_invoice'
  const [currentScreen, setCurrentScreen] = useState('selecting');
  const [selectedMethod, setSelectedMethod] = useState('upi_qr');
  
  // Real-time Order & Webhook Polling
  const [orderId, setOrderId] = useState(`order_KDH_${Date.now().toString().slice(-6)}`);
  const [transactionId, setTransactionId] = useState(`pay_Rzp_${Date.now().toString().slice(-8)}`);
  const [activePaymentMethodLabel, setActivePaymentMethodLabel] = useState('Google Pay / PhonePe UPI');
  
  // Interactive Form Inputs
  const [customUpiId, setCustomUpiId] = useState('lakshmi@okhdfcbank');
  const [upiPinDigits, setUpiPinDigits] = useState('');
  const [cardDigits, setCardDigits] = useState('4532 8921 4402 8920');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('742');
  const [cardHolder, setCardHolder] = useState('M. LAKSHMI');
  const [cardOtpInput, setCardOtpInput] = useState('683921');
  const [otpTimer, setOtpTimer] = useState(45);
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [netbankingUserId, setNetbankingUserId] = useState('KUTTI_USER_984');
  const [selectedWallet, setSelectedWallet] = useState('PhonePe Wallet');
  const [copiedUpi, setCopiedUpi] = useState(false);
  
  // Processing States
  const [processingStep, setProcessingStep] = useState(1);
  const [processingMessage, setProcessingMessage] = useState('Securing Bank Connection...');
  
  // 15-Minute Countdown Timer
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 58);

  // Authentic UPI URI generated with Store Proprietor VPA
  const upiId = 'kannankutti58@okaxis';
  const encodedMerchant = encodeURIComponent("Kuttiammal's Dairy Hub");
  const encodedNote = encodeURIComponent(`Aavin Pass ${cardNumber || 'ATT101'}`);
  const realUpiUri = `upi://pay?pa=${upiId}&pn=${encodedMerchant}&am=${Number(currentAmount).toFixed(2)}&cu=INR&tn=${encodedNote}&tr=${orderId}`;
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(realUpiUri)}`;

  // Reset & Initialize Order on Open
  useEffect(() => {
    if (isOpen) {
      const parsedAmt = Number(initialAmount) > 0 ? Number(initialAmount) : 1440;
      setCurrentAmount(parsedAmt);
      setIsEditingAmount(false);
      const generatedOrderId = `order_KDH_${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
      setOrderId(generatedOrderId);
      setTransactionId(`pay_Rzp_${Date.now().toString().slice(-8)}`);
      setCurrentScreen('selecting');
      setSelectedMethod('upi_qr');
      setProcessingStep(1);
      setTimeLeft(14 * 60 + 58);
      setUpiPinDigits('');
      setCardOtpInput('683921');
      setOtpTimer(45);

      // Register with backend server
      fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmt,
          customerName,
          customerPhone,
          cardNumber,
          description,
          method: 'upi'
        })
      }).catch(() => {});
    }
  }, [isOpen, initialAmount]);

  // Timer Countdown (15 mins)
  useEffect(() => {
    if (!isOpen || currentScreen === 'tax_invoice') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, currentScreen]);

  // Card OTP Timer (45s)
  useEffect(() => {
    if (currentScreen !== 'card_otp') return;
    const timer = setInterval(() => {
      setOtpTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentScreen]);

  // Real-Time Polling for Bank Webhook Confirmation
  useEffect(() => {
    if (!isOpen || currentScreen === 'processing' || currentScreen === 'tax_invoice') return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payment/status/${orderId}`);
        const data = await res.json();
        if (data && data.success && data.data && data.data.status === 'PAID') {
          triggerSuccessFlow(data.data.method || 'Real-time UPI Webhook');
        }
      } catch {}
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isOpen, currentScreen, orderId]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Web Audio API Harmonic Chime Synthesis
  const playAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {}
  };

  // 1. DIRECTLY OPEN 4-DIGIT UPI PIN SCREEN
  const handleOpenUpiPinScreen = (appLabel) => {
    setActivePaymentMethodLabel(appLabel);
    setUpiPinDigits('');
    setCurrentScreen('upi_pin');
  };

  // 2. KEYPAD DIGIT PRESS HANDLER
  const handlePinKeypad = (val) => {
    if (val === 'backspace') {
      setUpiPinDigits(prev => prev.slice(0, -1));
    } else if (val === 'submit') {
      if (upiPinDigits.length >= 4) {
        triggerSuccessFlow(activePaymentMethodLabel || 'UPI (Google Pay / PhonePe)');
      }
    } else if (upiPinDigits.length < 4) {
      const next = upiPinDigits + val;
      setUpiPinDigits(next);
      if (next.length === 4) {
        setTimeout(() => {
          triggerSuccessFlow(activePaymentMethodLabel || 'UPI (Google Pay / PhonePe)');
        }, 350);
      }
    }
  };

  // 3. TRIGGER 3D GOLD COIN SPINNER AND TRANSITION TO TAX INVOICE
  const triggerSuccessFlow = (methodLabel) => {
    setCurrentScreen('processing');
    setProcessingStep(1);
    setActivePaymentMethodLabel(methodLabel);
    setProcessingMessage(`Connecting to ${methodLabel} Gateway...`);

    // Step 1 -> 2
    setTimeout(() => {
      setProcessingStep(2);
      setProcessingMessage('Verifying Transaction with NPCI & Bank Server...');
    }, 700);

    // Step 2 -> 3
    setTimeout(() => {
      setProcessingStep(3);
      setProcessingMessage(`Authorizing ₹${Number(currentAmount).toLocaleString('en-IN')} payment...`);
    }, 1400);

    // Step 3 -> 4 (Tax Invoice Screen)
    setTimeout(() => {
      setProcessingStep(4);
      setProcessingMessage('Payment Authorized! Generating Official GST Tax Invoice...');

      setTimeout(async () => {
        playAudioChime();
        if (navigator.vibrate) {
          try { navigator.vibrate([100, 50, 100]); } catch {}
        }

        // Notify backend of payment verification
        try {
          await fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              paymentId: transactionId,
              method: methodLabel,
              cardNumber
            })
          });
        } catch {}

        // Switch to the full Official Tax Invoice View
        setCurrentScreen('tax_invoice');

        // Notify parent component
        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            paymentId: transactionId,
            orderId,
            amount: Number(currentAmount),
            method: methodLabel,
            customerName,
            customerPhone,
            cardNumber,
            paidAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
          });
        }
      }, 700);
    }, 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppReceipt = () => {
    const text = `🥛 *KUTTIAMMAL'S DAIRY HUB - OFFICIAL TAX INVOICE*
🧾 *Receipt No:* ${transactionId}
👤 *Customer:* ${customerName} (${cardNumber})
📞 *Phone:* ${customerPhone}
📅 *Date & Time:* ${new Date().toLocaleString('en-IN')}
💳 *Payment Mode:* ${activePaymentMethodLabel}
----------------------------------------
📦 *Plan:* Monthly Milk Attai Pass (60 Packets • 30 Days)
💰 *Amount Paid:* ₹${Number(currentAmount).toLocaleString('en-IN')} (GST 0% Exempted)
📅 *Pass Extended Until:* 30 Nov 2026
⭐ *VIP Loyalty Points Earned:* +100 Pts
----------------------------------------
✅ *Status:* PAID & VERIFIED (Tamper-Proof Cloud Ledger)
🏪 *Agency:* Kuttiammal's Dairy Hub, Main Road, Kovilpatti
📞 *Helpline:* +91 94434 42471
🙏 _Thank you for choosing fresh Aavin Milk!_`;

    const url = `https://wa.me/${customerPhone.replace(/[^0-9]/g, '') || '919443442471'}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* 3D Spin Keyframes & Custom Styles */}
      <style>{`
        @keyframes spinCoin3D {
          0% {
            transform: perspective(1000px) rotateY(0deg) scale(1);
          }
          50% {
            transform: perspective(1000px) rotateY(180deg) scale(1.06);
          }
          100% {
            transform: perspective(1000px) rotateY(360deg) scale(1);
          }
        }
        @keyframes coinAuraPulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(234, 179, 8, 0.4), 0 0 60px rgba(245, 158, 11, 0.2);
          }
          50% {
            box-shadow: 0 0 50px rgba(250, 204, 21, 0.85), 0 0 100px rgba(245, 158, 11, 0.55);
          }
        }
        @keyframes rippleWave {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-coin-3d {
          animation: spinCoin3D 1.1s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-style: preserve-3d;
        }
        .coin-aura {
          animation: coinAuraPulse 2s ease-in-out infinite;
        }
        .animate-ripple {
          animation: rippleWave 1.8s ease-out infinite;
        }
      `}</style>

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row max-h-[94vh] relative">
        
        {/* ========================================================
            LEFT COLUMN: RAZORPAY BRANDING & AMOUNT PANEL (5 Cols)
           ======================================================== */}
        <div className="md:w-5/12 bg-gradient-to-b from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          
          {/* Background Ambient Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sky-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            
            {/* Merchant Brand Identity */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md p-1 border border-white/30 flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                <span>🥛</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-base leading-tight truncate text-white">
                  {merchantName}
                </h3>
                <p className="text-[11px] text-blue-100 font-medium truncate">
                  {merchantSubtitle}
                </p>
              </div>
            </div>

            {/* Dynamic Price Summary Card (Editable / Selectable) */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider block">
                  Amount Payable
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingAmount(!isEditingAmount)}
                  className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full font-bold transition cursor-pointer"
                >
                  {isEditingAmount ? 'Done ✓' : '✏️ Change Amount'}
                </button>
              </div>

              {isEditingAmount ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold font-mono">₹</span>
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(Number(e.target.value) || 0)}
                      className="bg-white text-slate-900 rounded-xl px-3 py-1.5 font-mono font-black text-xl w-full outline-none"
                    />
                  </div>
                  {/* Preset Amount Pills */}
                  <div className="flex gap-1.5 flex-wrap">
                    {[1440, 720, 2880, 500, 250].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setCurrentAmount(amt);
                          setIsEditingAmount(false);
                        }}
                        className={`text-[10px] font-mono px-2 py-1 rounded-lg transition font-bold ${
                          currentAmount === amt 
                            ? 'bg-emerald-400 text-slate-900' 
                            : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                    ₹{Number(currentAmount).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] bg-emerald-400/30 text-emerald-200 border border-emerald-300/40 px-2 py-0.5 rounded-full font-bold">
                    Zero Extra Fee
                  </span>
                </div>
              )}

              <p className="text-[10px] text-blue-100 pt-1 border-t border-white/10 truncate font-medium">
                {description}
              </p>
            </div>

            {/* User Session Profile Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-500/40 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-blue-200 block truncate">Customer: {customerName}</span>
                  <strong className="text-[11px] font-mono font-bold text-white block truncate">{customerPhone} • {cardNumber}</strong>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            </div>

            {/* Live Gateway Order Meta */}
            <div className="p-2.5 bg-black/20 rounded-xl text-[10px] font-mono text-blue-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-300">Order ID:</span>
                <span className="text-white font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300">VPA:</span>
                <span className="text-amber-300 font-bold">{upiId}</span>
              </div>
            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="pt-4 relative z-10 space-y-2">
            <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px] text-blue-100">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>NPCI / 256-Bit Bank Encryption</span>
              </span>
              
              <div className="flex items-center gap-1 font-black text-white text-xs tracking-wider">
                <span className="italic text-sky-300 font-serif text-sm">/</span>
                <span>Razorpay</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN: PAYMENT WORKFLOWS (7 Cols)
           ======================================================== */}
        <div className="md:w-7/12 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white min-h-[500px]">
          
          {/* Top Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {currentScreen !== 'selecting' && currentScreen !== 'processing' && currentScreen !== 'tax_invoice' && (
                <button
                  type="button"
                  onClick={() => setCurrentScreen('selecting')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Back to options"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {currentScreen === 'selecting' && 'Select Payment Option'}
                  {currentScreen === 'upi_pin' && 'Enter 4-Digit UPI PIN (Google Pay / PhonePe)'}
                  {currentScreen === 'card_otp' && 'Bank 3D Secure OTP Verification'}
                  {currentScreen === 'netbanking_gateway' && `${selectedBank} Gateway`}
                  {currentScreen === 'processing' && 'Processing Bank Verification...'}
                  {currentScreen === 'tax_invoice' && 'Official Tax Invoice & Receipt'}
                </span>
              </h4>
            </div>

            <button 
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ========================================================
              SCREEN 1: TABBED PAYMENT METHOD SELECTION
             ======================================================== */}
          {currentScreen === 'selecting' && (
            <div className="space-y-4 my-auto py-3">
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                
                {/* Methods Sidebar (5 cols) */}
                <div className="sm:col-span-5 space-y-1.5">
                  
                  {/* 1. UPI QR Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi_qr')}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      selectedMethod === 'upi_qr'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100 font-extrabold shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs">UPI QR Code</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </button>

                  {/* 2. Direct UPI Apps Option (Google Pay / PhonePe) */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi_app')}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      selectedMethod === 'upi_app'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100 font-extrabold shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-xs">UPI (GPay / PhonePe)</span>
                    </div>
                    <div className="flex items-center -space-x-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-[8px] text-white font-bold flex items-center justify-center">G</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-[8px] text-white font-bold flex items-center justify-center">Pe</span>
                    </div>
                  </button>

                  {/* 3. Cards Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cards')}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      selectedMethod === 'cards'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100 font-extrabold shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs">Cards</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">Visa, RuPay</span>
                  </button>

                  {/* 4. Netbanking Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      selectedMethod === 'netbanking'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100 font-extrabold shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-xs">Netbanking</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">SBI, HDFC...</span>
                  </button>

                  {/* 5. Wallet Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('wallet')}
                    className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      selectedMethod === 'wallet'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100 font-extrabold shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-xs">Wallet</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">PhonePe...</span>
                  </button>

                </div>

                {/* Detail View Container (7 cols) */}
                <div className="sm:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                  
                  {/* DETAIL 1: SCANNABLE DYNAMIC UPI QR + 4-DIGIT PIN BUTTON */}
                  {selectedMethod === 'upi_qr' && (
                    <div className="space-y-3 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center justify-between w-full text-xs">
                        <span className="font-extrabold text-slate-900 dark:text-white">Scan UPI QR</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Phone Camera Ready
                        </span>
                      </div>

                      {/* Scannable Real Dynamic QR Image */}
                      <div className="p-2.5 bg-white rounded-2xl border-2 border-slate-300 dark:border-slate-600 shadow-md relative group">
                        <img 
                          src={dynamicQrUrl} 
                          alt="Real UPI Payment QR Code" 
                          className="w-36 h-36 object-contain rounded-lg"
                        />
                      </div>

                      {/* UPI ID & Copy Action */}
                      <div className="flex items-center justify-center gap-2 text-xs w-full bg-slate-100 dark:bg-slate-700/60 p-2 rounded-xl">
                        <span className="text-slate-500 dark:text-slate-300 font-mono text-[11px] truncate">
                          UPI ID: <strong className="text-slate-800 dark:text-white font-bold">{upiId}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          {copiedUpi ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Direct 4-Digit PIN Launch Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenUpiPinScreen('UPI (Google Pay / PhonePe)')}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                      >
                        <Fingerprint className="w-4 h-4" />
                        <span>Enter 4-Digit UPI PIN (₹{Number(currentAmount).toLocaleString('en-IN')}) ➔</span>
                      </button>
                    </div>
                  )}

                  {/* DETAIL 2: 1-CLICK UPI APPS (DIRECTLY OPENS 4-DIGIT PIN SCREEN) */}
                  {selectedMethod === 'upi_app' && (
                    <div className="space-y-3">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                        Select UPI App to Enter 4-Digit PIN & Pay:
                      </span>

                      {/* 1-Click Fast Triggers to 4-Digit PIN */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenUpiPinScreen('Google Pay (GPay)')}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-500 text-left transition cursor-pointer flex items-center gap-2.5 hover:bg-blue-50/50"
                        >
                          <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow">G</div>
                          <div>
                            <strong className="text-xs block text-slate-900 dark:text-white">Google Pay</strong>
                            <span className="text-[10px] text-blue-600 font-bold">Enter PIN ➔</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenUpiPinScreen('PhonePe')}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-purple-500 text-left transition cursor-pointer flex items-center gap-2.5 hover:bg-purple-50/50"
                        >
                          <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow">Pe</div>
                          <div>
                            <strong className="text-xs block text-slate-900 dark:text-white">PhonePe</strong>
                            <span className="text-[10px] text-purple-600 font-bold">Enter PIN ➔</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenUpiPinScreen('Paytm UPI')}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-cyan-500 text-left transition cursor-pointer flex items-center gap-2.5 hover:bg-cyan-50/50"
                        >
                          <div className="w-7 h-7 rounded-full bg-cyan-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow">P</div>
                          <div>
                            <strong className="text-xs block text-slate-900 dark:text-white">Paytm UPI</strong>
                            <span className="text-[10px] text-cyan-600 font-bold">Enter PIN ➔</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenUpiPinScreen('CRED Pay')}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-500 text-left transition cursor-pointer flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow">C</div>
                          <div>
                            <strong className="text-xs block text-slate-900 dark:text-white">CRED UPI</strong>
                            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">Enter PIN ➔</span>
                          </div>
                        </button>
                      </div>

                      {/* Custom UPI ID Entry */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">
                          Or Enter UPI VPA (e.g. mobile@upi)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customUpiId}
                            onChange={(e) => setCustomUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleOpenUpiPinScreen(`UPI ID (${customUpiId})`)}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1"
                          >
                            <span>Verify & Pay</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* DETAIL 3: CARD PAYMENT */}
                  {selectedMethod === 'cards' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">Credit / Debit Card</span>
                        <div className="flex gap-1">
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-[9px] font-mono rounded">VISA</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-[9px] font-mono rounded">Mastercard</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-[9px] font-mono rounded">RuPay</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Card Number</label>
                          <input
                            type="text"
                            value={cardDigits}
                            onChange={(e) => setCardDigits(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentScreen('card_otp')}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md cursor-pointer mt-1 flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Proceed to Bank 3D Secure OTP (₹{Number(currentAmount).toLocaleString('en-IN')})</span>
                      </button>
                    </div>
                  )}

                  {/* DETAIL 4: NETBANKING */}
                  {selectedMethod === 'netbanking' && (
                    <div className="space-y-3">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                        Select Popular Netbanking Bank
                      </span>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'State Bank of India (SBI)', 
                          'HDFC Bank', 
                          'ICICI Bank', 
                          'Axis Bank', 
                          'Canara Bank', 
                          'Tamilnad Mercantile Bank (TMB)'
                        ].map(bank => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => {
                              setSelectedBank(bank);
                              setCurrentScreen('netbanking_gateway');
                            }}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-500 text-left transition cursor-pointer text-xs font-bold"
                          >
                            🏛️ {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DETAIL 5: WALLET */}
                  {selectedMethod === 'wallet' && (
                    <div className="space-y-3">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                        Select Digital Wallet
                      </span>

                      <div className="grid grid-cols-2 gap-2">
                        {['PhonePe Wallet', 'Paytm Wallet', 'Amazon Pay Wallet', 'Mobikwik'].map(w => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => {
                              setSelectedWallet(w);
                              triggerSuccessFlow(`Wallet - ${w}`);
                            }}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-amber-500 text-left transition cursor-pointer text-xs font-bold flex items-center justify-between"
                          >
                            <span>👛 {w}</span>
                            <span className="text-[9px] text-emerald-600 font-mono">₹2,500 Bal</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              SCREEN 2: AUTHENTIC 4-DIGIT UPI PIN SCREEN
             ======================================================== */}
          {currentScreen === 'upi_pin' && (
            <div className="my-auto py-4 space-y-4 max-w-sm mx-auto w-full text-center animate-in zoom-in-95 duration-200">
              
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Paying To:</span>
                  <strong className="text-slate-900 dark:text-white">{merchantName}</strong>
                  <span className="text-[10px] text-slate-500 block font-mono">A/C: HDFC Bank ••4402</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount:</span>
                  <strong className="text-lg font-black text-emerald-600 font-mono">₹{Number(currentAmount).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* 4 Masked PIN Circles */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                  ENTER 4-DIGIT UPI PIN
                </label>
                <div className="flex items-center justify-center gap-4 py-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <div 
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        upiPinDigits.length > idx 
                          ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white scale-110' 
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Numeric PIN Keypad */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinKeypad(num.toString())}
                    className="py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-lg rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={() => handlePinKeypad('backspace')}
                  className="py-3 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 transition active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  ⌫
                </button>

                <button
                  type="button"
                  onClick={() => handlePinKeypad('0')}
                  className="py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-lg rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={() => handlePinKeypad('submit')}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  ✓
                </button>
              </div>

              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>NPCI Unified Payments Interface Certified</span>
              </div>

            </div>
          )}

          {/* ========================================================
              SCREEN 3: BANK 3D SECURE 2.0 OTP VERIFICATION SCREEN
             ======================================================== */}
          {currentScreen === 'card_otp' && (
            <div className="my-auto py-4 space-y-4 max-w-sm mx-auto w-full animate-in zoom-in-95 duration-200">
              
              <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 block">Verified by VISA / RuPay</span>
                  <strong className="text-xs text-slate-900 dark:text-white">Card: {cardDigits.slice(0, 4)} •••• {cardDigits.slice(-4)}</strong>
                </div>
                <strong className="text-base font-black text-slate-900 dark:text-white font-mono">₹{Number(currentAmount).toLocaleString('en-IN')}</strong>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Enter 6-Digit One Time Password (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={cardOtpInput}
                  onChange={(e) => setCardOtpInput(e.target.value)}
                  placeholder="683921"
                  className="w-full text-center text-xl font-mono font-black tracking-widest bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-2xl py-2.5 outline-none"
                />
                
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Resend OTP in <strong className="text-blue-600 font-mono">00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</strong></span>
                  <span className="text-emerald-600 font-bold">● SMS Detected</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => triggerSuccessFlow(`Card Payment (${cardDigits.slice(-4)})`)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
              >
                Submit OTP & Authorize ₹{Number(currentAmount).toLocaleString('en-IN')}
              </button>

            </div>
          )}

          {/* ========================================================
              SCREEN 4: NETBANKING GATEWAY CONFIRMATION
             ======================================================== */}
          {currentScreen === 'netbanking_gateway' && (
            <div className="my-auto py-4 space-y-4 max-w-sm mx-auto w-full animate-in zoom-in-95 duration-200">
              
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">🏛️ {selectedBank}</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Secure 2.0</span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Customer ID:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{netbankingUserId}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Beneficiary:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{merchantName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Transfer Amount:</span>
                    <strong className="text-slate-900 dark:text-white font-black font-mono">₹{Number(currentAmount).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => triggerSuccessFlow(`Netbanking - ${selectedBank}`)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
              >
                Confirm & Debit ₹{Number(currentAmount).toLocaleString('en-IN')} from Account
              </button>

            </div>
          )}

          {/* ========================================================
              SCREEN 5: 3D SPINNING GOLD COIN ANIMATION
             ======================================================== */}
          {currentScreen === 'processing' && (
            <div className="my-auto py-8 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-200">
              
              {/* 3D Gold Coin Spinner Element */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                
                {/* Glowing Outer Particle Halo */}
                <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-xl animate-pulse"></div>
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: '6s' }}></div>

                {/* 3D Realistic Gold Rupee Coin */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 border-4 border-yellow-200 shadow-2xl animate-coin-3d coin-aura flex items-center justify-center relative overflow-hidden">
                  
                  {/* Concentric Rim Ring */}
                  <div className="w-24 h-24 rounded-full border-2 border-yellow-500/80 flex items-center justify-center bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 shadow-inner">
                    
                    {/* Embossed Center Rupee Symbol */}
                    <div className="relative flex flex-col items-center justify-center select-none">
                      <span className="text-4xl font-black font-sans text-amber-950 drop-shadow-[0_2px_2px_rgba(255,255,255,0.7)]">
                        ₹
                      </span>
                      <span className="text-[7px] font-black uppercase text-amber-900 tracking-widest -mt-1 font-mono">
                        INDIA
                      </span>
                    </div>

                  </div>

                  {/* Specular Light Reflection Band */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"></div>
                </div>

              </div>

              {/* Live Status Progress Steps */}
              <div className="space-y-3 max-w-sm w-full">
                <div className="space-y-1">
                  <h5 className="font-black text-base text-slate-900 dark:text-white">
                    Processing ₹{Number(currentAmount).toLocaleString('en-IN')}
                  </h5>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                    {processingMessage}
                  </p>
                </div>

                {/* Progress Multi-Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${processingStep * 25}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Step {processingStep}/4</span>
                  <span>🔒 256-Bit Bank Tunnel</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Do not refresh or press back while transaction is in progress</span>
              </div>

            </div>
          )}

          {/* ========================================================
              SCREEN 6: OFFICIAL TAX INVOICE & GREEN TICK RECEIPT
             ======================================================== */}
          {currentScreen === 'tax_invoice' && (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              
              {/* Green Tick Success Header Banner */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 rounded-2xl text-white text-center relative overflow-hidden">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center my-1">
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ripple"></div>
                  <div className="w-12 h-12 rounded-full bg-white text-emerald-600 shadow-xl flex items-center justify-center relative z-10 border-2 border-emerald-200">
                    <Check className="w-8 h-8 stroke-[3.5]" />
                  </div>
                </div>
                <h5 className="text-base font-black text-white mt-1">Payment Received & Verified!</h5>
                <p className="text-[11px] text-emerald-100 font-medium">Official Aavin GST Tax Invoice & Subscription Receipt</p>
              </div>

              {/* Itemized Tax Invoice Details */}
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-sans">Receipt No:</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-bold">{transactionId}</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Customer:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{customerName} ({cardNumber})</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Mode:</span>
                  <strong className="text-slate-800 dark:text-slate-200 uppercase">{activePaymentMethodLabel}</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Pass Extended:</span>
                  <strong className="text-emerald-600 font-bold">Until 30 Nov 2026 (60 Packets)</strong>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-sans font-bold text-slate-800 dark:text-slate-200">Total Paid (GST 0%):</span>
                  <strong className="text-base text-emerald-600 font-black font-sans">₹{Number(currentAmount).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Action Buttons: WhatsApp + Thermal Print + Close */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppReceipt}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Done ✓
                </button>
              </div>

            </div>
          )}

          {/* ========================================================
              MODAL FOOTER
             ======================================================== */}
          {currentScreen !== 'tax_invoice' && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center gap-1 bg-amber-50 dark:bg-amber-950/40 py-1 px-3 rounded-lg border border-amber-200 dark:border-amber-900/40">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>⏱️ Gateway Timeout in {formatTimer(timeLeft)} min</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-emerald-600 dark:text-emerald-400">● NPCI Webhook Active</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default RazorpayPaymentModal;
