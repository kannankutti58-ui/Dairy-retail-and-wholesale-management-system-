import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { RazorpayPaymentModal } from '../common/RazorpayPaymentModal';
import { TaxInvoiceReceiptModal } from '../common/TaxInvoiceReceiptModal';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  Award, 
  Sparkles, 
  Droplets, 
  MapPin, 
  Clock, 
  PauseCircle, 
  PlusCircle, 
  FileText, 
  QrCode, 
  Star, 
  MessageCircle, 
  Send,
  AlertCircle,
  Store,
  Package,
  Check,
  Zap,
  Users,
  IndianRupee,
  ArrowRight,
  HelpCircle,
  CreditCard,
  X,
  ExternalLink,
  PhoneCall,
  Mail,
  Truck,
  HeartHandshake,
  ThumbsUp,
  Receipt,
  Eye,
  Printer
} from 'lucide-react';

export const CustomerPortalView = () => {
  const {
    shopInfo,
    showNotification,
    sendWhatsAppMessage,
    loggedInUser,
    logout,
    setActiveTab,
    milkProducts
  } = useShop();

  // 4 Registered Customer Profiles
  const portalCustomers = [
    {
      id: 'cust-1',
      cardNumber: 'ATT-101',
      customerName: 'M. Lakshmi',
      phone: '98421 11001',
      address: 'House #12/A, Palayamkottai Route, Kovilpatti',
      dailyQuotaPackets: 2,
      preferredMilk: 'Aavin Delight Purple (500ml Std)',
      remainingPackets: 18,
      totalMonthlyPackets: 60,
      validUntil: '30 Oct 2026',
      loyaltyPoints: 3450,
      monthlySpend: '₹1,440',
      lastCollected: 'Today at 06:15 AM',
      punchedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    },
    {
      id: 'cust-2',
      cardNumber: 'ATT-102',
      customerName: 'K. Priya',
      phone: '98421 33003',
      address: 'House #45, NGO Colony Phase 2, Kovilpatti',
      dailyQuotaPackets: 1,
      preferredMilk: 'Aavin Nice Blue + 1 Curd Tub',
      remainingPackets: 12,
      totalMonthlyPackets: 30,
      validUntil: '25 Oct 2026',
      loyaltyPoints: 2120,
      monthlySpend: '₹980',
      lastCollected: 'Today at 05:50 AM',
      punchedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    },
    {
      id: 'cust-3',
      cardNumber: 'ATT-103',
      customerName: 'S. Venkatesh',
      phone: '98421 55005',
      address: 'Flat #302, Perumalpuram Bypass, Kovilpatti',
      dailyQuotaPackets: 3,
      preferredMilk: 'Aavin Full Cream Orange (FCM)',
      remainingPackets: 24,
      totalMonthlyPackets: 90,
      validUntil: '05 Nov 2026',
      loyaltyPoints: 1890,
      monthlySpend: '₹2,700',
      lastCollected: 'Today at 06:30 AM',
      punchedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    },
    {
      id: 'cust-4',
      cardNumber: 'ATT-104',
      customerName: 'R. Murugan (Tea Stall & Bakery)',
      phone: '98421 22002',
      address: 'Shop #8, Main Bazaar Junction, Kovilpatti',
      dailyQuotaPackets: 25,
      preferredMilk: 'Aavin Nice Blue (B2B Commercial)',
      remainingPackets: 140,
      totalMonthlyPackets: 750,
      validUntil: '30 Oct 2026',
      loyaltyPoints: 2890,
      monthlySpend: '₹16,500',
      lastCollected: 'Today at 05:15 AM',
      punchedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    }
  ];

  // Live Available Stock List
  const liveStockData = [
    { 
      id: 'p-1', 
      name: 'Aavin Nice (Blue)', 
      tamilName: 'ஆவின் நைஸ் (நீலம்)', 
      pack: '500 ml Pouch', 
      type: 'Toned Milk (3.0% Fat • 8.5% SNF)', 
      price: '₹22', 
      stock: 48, 
      status: 'In Stock', 
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      icon: '🥛'
    },
    { 
      id: 'p-2', 
      name: 'Aavin Delight (Purple)', 
      tamilName: 'ஆவின் டிலைட் (ஊதா)', 
      pack: '500 ml Pouch', 
      type: 'Standardized Milk (3.5% Fat • 8.5% SNF)', 
      price: '₹24', 
      stock: 35, 
      status: 'In Stock', 
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: '💜'
    },
    { 
      id: 'p-3', 
      name: 'Aavin Full Cream (Orange)', 
      tamilName: 'ஆவின் ஃபுல் கிரீம் (ஆரஞ்சு)', 
      pack: '500 ml Pouch', 
      type: 'Rich Thick Milk (4.5% Fat • 9.0% SNF)', 
      price: '₹30', 
      stock: 24, 
      status: 'In Stock', 
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: '🍊'
    },
    { 
      id: 'p-4', 
      name: 'Aavin Fresh Curd Pouch', 
      tamilName: 'ஆவின் கெட்டித் தயிர்', 
      pack: '500 g Tub/Pouch', 
      type: 'Fermented 42°C Pure Culture', 
      price: '₹30', 
      stock: 20, 
      status: 'Fresh Daily', 
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: '🥣'
    },
    { 
      id: 'p-5', 
      name: 'Aavin Pure Cow Ghee', 
      tamilName: 'ஆவின் சுத்தமான பசு நெய்', 
      pack: '500 ml Glass Jar', 
      type: '100% Traditional Agmark Aroma', 
      price: '₹360', 
      stock: 15, 
      status: 'In Stock', 
      badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      icon: '🧈'
    },
    { 
      id: 'p-6', 
      name: 'Aavin Special Butter', 
      tamilName: 'ஆவின் சிறப்பு வெண்ணெய்', 
      pack: '500 g Block', 
      type: 'Pasteurized Cream Butter', 
      price: '₹275', 
      stock: 10, 
      status: 'In Stock', 
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      icon: '🧈'
    }
  ];

  // Initial Real Customer Reviews
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      customerName: 'M. Lakshmi',
      rating: 5,
      date: '02 Oct 2026',
      comment: 'Very fresh Aavin milk received daily at 6:00 AM! Attai card system is very convenient.',
      verified: true
    },
    {
      id: 'rev-2',
      customerName: 'R. Murugan (Tea Stall)',
      rating: 5,
      date: '01 Oct 2026',
      comment: '35 packets delivered punctually every morning. Thick tea quality is top-notch!',
      verified: true
    },
    {
      id: 'rev-3',
      customerName: 'K. Priya (NGO Colony)',
      rating: 5,
      date: '30 Sep 2026',
      comment: 'The curd is super thick and fresh. Cold storage chilling is maintained properly.',
      verified: true
    },
    {
      id: 'rev-4',
      customerName: 'S. Venkatesh',
      rating: 5,
      date: '28 Sep 2026',
      comment: 'Orange Full Cream milk is excellent for making sweets and baby food.',
      verified: true
    }
  ]);

  // Determine Active Customer based on Logged In User
  const [lookupResult, setLookupResult] = useState(() => {
    if (loggedInUser?.username === 'lakshmi.attai') return portalCustomers[0];
    if (loggedInUser?.username === 'murugan.tea') return portalCustomers[3];
    return portalCustomers[0];
  });

  const [searchPhone, setSearchPhone] = useState(() => lookupResult?.phone || '98421 11001');
  const [isPaused, setIsPaused] = useState(false);
  const [extraPacketsRequested, setExtraPacketsRequested] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [userFeedbackText, setUserFeedbackText] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [pastReceipts, setPastReceipts] = useState([
    {
      id: 'PAY-RZP-984211',
      orderId: 'order_N8v3Kl01',
      amount: 1440,
      customerName: 'M. Lakshmi',
      cardNumber: 'ATT-101',
      phone: '98421 11001',
      planTitle: 'Monthly Milk Attai Pass (60 Packets • 30 Days)',
      preferredMilk: 'Aavin Delight Purple (500ml Std)',
      paymentMethod: 'Razorpay (Google Pay UPI)',
      paidAt: '01 Oct 2026, 06:30 AM',
      validUntil: '30 Oct 2026',
      loyaltyPointsEarned: 100
    },
    {
      id: 'PAY-RZP-873110',
      orderId: 'order_M7a1Pq92',
      amount: 1440,
      customerName: 'M. Lakshmi',
      cardNumber: 'ATT-101',
      phone: '98421 11001',
      planTitle: 'Monthly Milk Attai Pass (60 Packets • 30 Days)',
      preferredMilk: 'Aavin Delight Purple (500ml Std)',
      paymentMethod: 'Razorpay (PhonePe QR)',
      paidAt: '01 Sep 2026, 07:15 AM',
      validUntil: '30 Sep 2026',
      loyaltyPointsEarned: 100
    }
  ]);

  // Sync lookup result if loggedInUser changes
  useEffect(() => {
    if (loggedInUser?.username === 'lakshmi.attai') {
      setLookupResult(portalCustomers[0]);
      setSearchPhone(portalCustomers[0].phone);
    } else if (loggedInUser?.username === 'murugan.tea') {
      setLookupResult(portalCustomers[3]);
      setSearchPhone(portalCustomers[3].phone);
    }
  }, [loggedInUser]);

  // Fetch reviews from MongoDB API if available
  useEffect(() => {
    fetch('http://localhost:5000/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setReviewsList(data.data.map(r => ({
            id: r._id || `rev-${Math.random()}`,
            customerName: r.customerName || 'Aavin Customer',
            rating: r.rating || 5,
            date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            comment: r.comment || r.review || 'Excellent service and quality milk.',
            verified: true
          })));
        }
      })
      .catch(() => {
        // Fallback to local reviews if backend offline
      });
  }, []);

  const handleLookup = (e) => {
    if (e) e.preventDefault();
    if (!searchPhone.trim()) {
      showNotification("Please enter a mobile number or card ID", "warning");
      return;
    }

    const cleanInput = searchPhone.replace(/\s+/g, '').toLowerCase();
    const found = portalCustomers.find(c =>
      c.phone.replace(/\s+/g, '').includes(cleanInput) ||
      c.cardNumber.toLowerCase().includes(cleanInput) ||
      c.customerName.toLowerCase().includes(cleanInput)
    );

    if (found) {
      setLookupResult(found);
      setIsPaused(false);
      setExtraPacketsRequested(0);
      showNotification(`Loaded Attai card for ${found.customerName}`);
    } else {
      showNotification(`Profile for ${searchPhone} not found. Showing ${lookupResult.customerName}`, 'warning');
    }
  };

  const handleSelectCustomer = (cust) => {
    setSearchPhone(cust.phone);
    setLookupResult(cust);
    setIsPaused(false);
    setExtraPacketsRequested(0);
    showNotification(`Switched to ${cust.customerName}'s digital pass`);
  };

  const handleTogglePause = () => {
    const next = !isPaused;
    setIsPaused(next);
    if (next) {
      showNotification("⏸ Milk collection paused for vacation. Card validity automatically extended without losing packets!");
    } else {
      showNotification("▶ Milk collection resumed! You can collect your packets tomorrow morning at counter.");
    }
  };

  const handleAddExtraPackets = () => {
    setExtraPacketsRequested(prev => prev + 1);
    showNotification(`🥛 Requested +1 Extra Milk Packet for tomorrow's pickup!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userFeedbackText.trim()) {
      showNotification("Please enter feedback message", "warning");
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      customerName: lookupResult?.customerName || loggedInUser?.name || 'M. Lakshmi',
      rating: userRating,
      date: 'Today',
      comment: userFeedbackText.trim(),
      verified: true
    };

    // Try posting to Express + MongoDB backend API
    try {
      await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newRev.customerName,
          cardNumber: lookupResult?.cardNumber || 'ATT-101',
          rating: newRev.rating,
          comment: newRev.comment
        })
      });
    } catch {
      // Offline fallback
    }

    setReviewsList(prev => [newRev, ...prev]);
    setUserFeedbackText('');
    showNotification(`⭐ Review submitted successfully! Thank you for rating Kuttiammal's Dairy Hub.`);
  };

  const handleSendWhatsAppBill = () => {
    const text = `🥛 *KUTTIAMMAL'S DAIRY HUB - MONTHLY ATTAI PASS*
👤 *Customer:* ${lookupResult?.customerName}
💳 *Card ID:* ${lookupResult?.cardNumber}
📞 *Phone:* ${lookupResult?.phone}
----------------------------------------
📦 *Daily Plan:* ${lookupResult?.dailyQuotaPackets} Pkts/Day (${lookupResult?.preferredMilk})
📅 *Pass Validity:* ${lookupResult?.validUntil}
⭐ *Remaining Balance:* ${lookupResult?.remainingPackets} / ${lookupResult?.totalMonthlyPackets} Packets
🎁 *Loyalty Reward Points:* ${lookupResult?.loyaltyPoints} Pts
----------------------------------------
🏪 *Agency Counter Hours:* 05:00 AM – 09:30 AM & 05:00 PM – 08:30 PM
📍 *Location:* Main Road, Kovilpatti
📞 *Contact / WhatsApp:* 9443442471
🙏 _Thank you for being our valuable customer!_`;

    sendWhatsAppMessage({
      recipientPhone: lookupResult?.phone || '9443442471',
      recipientName: lookupResult?.customerName,
      text,
      recipientType: 'subscriber',
      badge: `${lookupResult?.cardNumber} • Attai Pass`,
      avatar: '🥛',
      avatarBg: 'bg-blue-100 text-blue-800'
    });
  };

  const handleRazorpaySuccess = (details) => {
    setShowQRModal(false);

    const parsedAmount = Number(details.amount) || Number(lookupResult?.monthlySpend?.replace(/[^0-9]/g, '')) || 1440;
    const newReceipt = {
      id: details.paymentId || `PAY-RZP-${Date.now().toString().slice(-6)}`,
      orderId: details.orderId || `order_${Math.random().toString(36).substring(2, 9)}`,
      amount: parsedAmount,
      customerName: lookupResult?.customerName || "M. Lakshmi",
      cardNumber: lookupResult?.cardNumber || "ATT-101",
      phone: lookupResult?.phone || "98421 11001",
      planTitle: 'Monthly Milk Attai Pass (60 Packets • 30 Days)',
      preferredMilk: lookupResult?.preferredMilk || "Aavin Delight Purple (500ml Std)",
      paymentMethod: `Razorpay (${details.method || 'UPI / QR'})`,
      paidAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      validUntil: '30 Nov 2026',
      loyaltyPointsEarned: 100
    };

    // Update receipts list
    setPastReceipts(prev => [newReceipt, ...prev]);
    setSelectedReceipt(newReceipt);

    // Update customer card in real time
    setLookupResult(prev => ({
      ...prev,
      validUntil: '30 Nov 2026',
      remainingPackets: 60,
      totalMonthlyPackets: 60,
      loyaltyPoints: (prev?.loyaltyPoints || 3450) + 100,
      punchedDays: [1] // fresh new cycle
    }));

    setIsPaused(false);
    setShowReceiptModal(true);
    showNotification(`🎉 Payment of ₹${parsedAmount} received via Razorpay! Pass renewed until 30 Nov 2026.`);
  };

  const handleSendReceiptWhatsApp = (receipt) => {
    const text = `🥛 *KUTTIAMMAL'S DAIRY HUB - OFFICIAL TAX INVOICE*
🧾 *Receipt No:* ${receipt.id}
👤 *Customer:* ${receipt.customerName} (${receipt.cardNumber})
📞 *Phone:* ${receipt.phone}
📅 *Date & Time:* ${receipt.paidAt}
💳 *Payment Mode:* ${receipt.paymentMethod}
----------------------------------------
📦 *Plan:* ${receipt.planTitle}
🥛 *Milk Variant:* ${receipt.preferredMilk}
💰 *Amount Paid:* ₹${Number(receipt.amount).toLocaleString('en-IN')} (GST 0% Exempted)
📅 *Pass Extended Until:* ${receipt.validUntil}
⭐ *VIP Loyalty Points Earned:* +${receipt.loyaltyPointsEarned} Pts
----------------------------------------
✅ *Status:* PAID & VERIFIED (Tamper-Proof Cloud Ledger)
🏪 *Agency:* Kuttiammal's Dairy Hub, Main Road, Kovilpatti
📞 *Helpline:* +91 94434 42471
🙏 _Thank you for subscribing to fresh Aavin Milk!_`;

    sendWhatsAppMessage({
      recipientPhone: receipt.phone || '9443442471',
      recipientName: receipt.customerName,
      text,
      recipientType: 'subscriber',
      badge: `${receipt.cardNumber} • Tax Invoice`,
      avatar: '🧾',
      avatarBg: 'bg-emerald-100 text-emerald-800'
    });
  };

  const punchedDaysList = lookupResult?.punchedDays || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

  return (
    <div className="space-y-6 w-full pb-12">
      
      {/* ========================================================
          1. SHOP DETAILS & LOCATION PROFILE BANNER
         ======================================================== */}
      <div className="bg-gradient-to-r from-blue-800 via-sky-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        {/* Left: Store Branding & Verification with New Logo */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-white border border-white/30">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>வாடிக்கையாளர் தளம் • Authorized Aavin Agency Portal</span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-lg border-2 border-sky-300 shrink-0 overflow-hidden flex items-center justify-center">
              <img 
                src="/kuttiammal-dairy-logo.png" 
                alt="Kuttiammal's Dairy Hub Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Kuttiammal's Dairy Hub
              </h1>
              <p className="text-xs text-sky-200 font-medium">Aavin Authorised Milk Agency • Main Road, Kovilpatti</p>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            Government Authorized Aavin Milk Agency, Wholesale & Monthly Attai Card Distribution Hub. Serving fresh morning & evening milk to Kovilpatti residents.
          </p>

          {/* Shop Meta Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-sky-200">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/15">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Main Road, Kovilpatti - 628501</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/15">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>Morning: 05:00 AM – 09:30 AM | Evening: 05:00 PM – 08:30 PM</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/15 font-mono">
              <Phone className="w-3.5 h-3.5 text-sky-300" />
              <span>Helpline: +91 94434 42471</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Call / WhatsApp / Sign Out) */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <a
            href="tel:9443442471"
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Shop: 9443442471</span>
          </a>

          <a
            href="https://wa.me/919443442471?text=Vanakkam%20Kuttiammal%20Dairy%20Hub,%20I%20have%20an%20inquiry%20regarding%20Aavin%20milk%20stock%20and%20Attai%20pass."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp: 9443442471</span>
          </a>

          <button
            onClick={logout}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Sign Out / Switch User</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. LIVE AVAILABLE MILK & PRODUCT STOCK
         ======================================================== */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-600" />
              <span>இன்றைய பால் இருப்பு & விலை பட்டியல் (Live Available Stock & Rates)</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Daily fresh milk received from Tirunelveli Central Dairy • Chilled at 3.2°C Cold Storage
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Fresh Morning Batch Chilled
            </span>
          </div>
        </div>

        {/* 6 Stock Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveStockData.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-50 hover:bg-sky-50/40 border-2 border-slate-200 hover:border-sky-300 rounded-2xl p-4 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.badgeBg}`}>
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-sm">{item.name}</h3>
                  <div className="text-xs font-bold text-sky-800">{item.tamilName}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{item.pack} • {item.type}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Price / Pack</span>
                  <span className="text-xl font-black text-slate-900 font-mono">{item.price}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-black block">Store Stock</span>
                  <span className="text-sm font-black text-emerald-700 font-mono">{item.stock} Available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. MY DIGITAL MONTHLY MILK PASS (ATTAI CARD)
         ======================================================== */}
      {lookupResult && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Virtual Digital Milk Pass Card (6 Cols) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 rounded-3xl p-6 text-white shadow-xl space-y-4 border-2 border-sky-400/40 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3.5 relative z-10">
                
                {/* Pass Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-sky-200 px-3 py-0.5 rounded-full border border-white/20">
                      Official Aavin Monthly Pass
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1.5">{lookupResult.customerName}</h3>
                    <p className="text-xs text-sky-200 font-mono">{lookupResult.phone} • {lookupResult.address}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-sky-200 uppercase font-bold block">Card ID</span>
                    <div className="text-base font-black font-mono text-amber-300">{lookupResult.cardNumber}</div>
                  </div>
                </div>

                {/* Plan & Remaining Balance Matrix */}
                <div className="grid grid-cols-3 gap-2 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
                  <div>
                    <span className="text-[10px] text-sky-200 uppercase font-bold block">Daily Plan</span>
                    <strong className="text-sm font-black text-white">{lookupResult.dailyQuotaPackets} Pkts/Day</strong>
                    <span className="text-[9px] text-sky-300 block truncate">{lookupResult.preferredMilk}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-sky-200 uppercase font-bold block">Packets Left</span>
                    <strong className="text-lg font-black text-emerald-300 font-mono">{lookupResult.remainingPackets} Pkts</strong>
                    <span className="text-[9px] text-sky-300 block">Active Balance</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-sky-200 uppercase font-bold block">Valid Until</span>
                    <strong className="text-xs font-black text-white font-mono">
                      {isPaused ? 'Extended (+2 Days)' : lookupResult.validUntil}
                    </strong>
                    <span className="text-[9px] text-emerald-300 block">
                      {isPaused ? '⏸ Paused for Vacation' : '● Active'}
                    </span>
                  </div>
                </div>

                {/* Loyalty Score Banner & Bills */}
                <div className="flex justify-between items-center p-2.5 bg-white/10 rounded-xl border border-white/10 text-xs font-mono">
                  <span className="text-sky-200 font-bold">⭐ VIP Loyalty Points:</span>
                  <strong className="text-amber-300 font-black">{lookupResult.loyaltyPoints} Points</strong>
                </div>

              </div>

              {/* Barcode, Razorpay Direct Pay & WhatsApp Actions */}
              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 relative z-10">
                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex-1 min-w-[190px] flex items-center justify-center gap-2 font-mono text-xs text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 px-4 py-2.5 rounded-xl transition shadow-lg font-black cursor-pointer transform active:scale-95 border border-emerald-300/40"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                  <span>⚡ Pay Monthly Pass ({lookupResult.monthlySpend || '₹1,440'}) via Razorpay</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-1.5 font-mono text-xs text-amber-300 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition cursor-pointer"
                    title="Open UPI QR / Apps"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI QR</span>
                  </button>

                  <button
                    onClick={handleSendWhatsAppBill}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Counter Pickup & Vacation Pause Self-Service (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-sky-600" />
                    <h3 className="font-black text-base text-slate-900">
                      Counter Milk Pickup & Plan Options
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                    Counter Pickup 🏪
                  </span>
                </div>

                {/* Pickup Details Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mt-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Daily Milk Ready for Collection:</span>
                    <strong className="text-slate-900 font-black text-sm">{lookupResult.dailyQuotaPackets} Packets ({lookupResult.preferredMilk})</strong>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Agency Counter Location:</span>
                    <strong className="text-slate-900">Main Road, Kovilpatti</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Collection Timings:</span>
                    <strong className="text-emerald-800 font-mono">05:00 AM – 09:30 AM & 05:00 PM – 08:30 PM</strong>
                  </div>
                </div>
              </div>

              {/* Vacation Pause & Extra Milk Controls */}
              <div className="space-y-2.5">
                <div className="text-[11px] text-slate-500 font-medium">
                  {isPaused ? '⏸ Your card is currently paused for vacation. No milk will be deducted until resumed.' : '💡 Going out of town? Click pause to extend your card validity without losing milk.'}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    onClick={handleTogglePause}
                    className={`py-3.5 rounded-2xl font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isPaused
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                    }`}
                  >
                    <PauseCircle className="w-4 h-4" />
                    <span>{isPaused ? 'Resume Card ▶' : 'Pause For Vacation ⏸'}</span>
                  </button>

                  <button
                    onClick={handleAddExtraPackets}
                    className="py-3.5 bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-300 rounded-2xl font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-sky-700" />
                    <span>+1 Extra Packet ({extraPacketsRequested})</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive 30-Day Milk Punch Attendance Calendar */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>30-Day Milk Punch Calendar (மாதாந்திர அட்டை கணக்கு)</span>
                </h3>
                <p className="text-xs text-slate-500">Live calendar showing collected days, remaining quota, and vacation paused dates</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold font-mono">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Collected
                </span>
                <span className="flex items-center gap-1 text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span> Today
                </span>
                <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Paused
                </span>
              </div>
            </div>

            {/* 30 Day Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 text-center text-xs">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const isCollected = punchedDaysList.includes(day) && day <= 27;
                const isToday = day === 27;
                const isPausedDay = isPaused && (day === 28 || day === 29);

                return (
                  <div
                    key={day}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                      isToday
                        ? 'bg-sky-600 text-white border-sky-700 shadow-md font-black scale-105'
                        : isPausedDay
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : isCollected
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-mono">Day {day}</span>
                    <span className="text-sm">
                      {isToday ? '🥛' : isPausedDay ? '⏸️' : isCollected ? '✓' : '○'}
                    </span>
                    <span className="text-[9px] font-bold">
                      {isToday ? 'Today' : isPausedDay ? 'Pause' : isCollected ? 'Picked' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              3B. DIGITAL TAX INVOICES & PAYMENT RECEIPTS LEDGER
             ======================================================== */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  <span>டிஜிட்டல் வரி ரசீதுகள் & பில் வரலாறு (Digital Tax Invoices & Ledger)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Official GST-exempted milk receipts verified with Razorpay payment ID & 1-click thermal print
                </p>
              </div>

              <button
                onClick={() => setShowQRModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Renew Monthly Pass via Razorpay</span>
              </button>
            </div>

            {/* Invoices List */}
            <div className="space-y-3">
              {pastReceipts.map((rcpt, idx) => (
                <div
                  key={rcpt.id || idx}
                  className="bg-slate-50 hover:bg-sky-50/40 border border-slate-200 hover:border-sky-300 rounded-2xl p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-mono text-xs">{rcpt.id}</strong>
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Paid & Verified
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {rcpt.paidAt} • <span className="font-mono text-slate-700 font-semibold">{rcpt.paymentMethod}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rcpt.planTitle} ({rcpt.preferredMilk})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Amount</span>
                      <strong className="text-base font-black text-slate-900 font-mono">₹{Number(rcpt.amount).toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedReceipt(rcpt);
                          setShowReceiptModal(true);
                        }}
                        className="px-3.5 py-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        title="View Full Tax Invoice & Green Tick"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </button>

                      <button
                        onClick={() => handleSendReceiptWhatsApp(rcpt)}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs transition cursor-pointer"
                        title="Send to WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          4. CUSTOMER REVIEWS & 5-STAR FEEDBACK SECTION
         ======================================================== */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-6">
        
        {/* Reviews Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-0.5">
            <h2 className="font-black text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>வாடிக்கையாளர் மதிப்புரைகள் (Verified Customer Reviews & Ratings)</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real feedback from subscribed Attai cardholders and tea stalls in Kovilpatti
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shrink-0">
            <div className="flex text-amber-500 text-sm">★★★★★</div>
            <span className="font-black text-amber-950 text-xs">4.9 / 5.0 (48+ Reviews)</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsList.map((rev) => (
            <div 
              key={rev.id}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 transition hover:border-slate-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-900">{rev.customerName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{rev.comment}"
              </p>

              {rev.verified && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Aavin Customer</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Post New 5-Star Review Form */}
        <div className="bg-sky-50/70 rounded-2xl p-5 border-2 border-sky-200 space-y-3.5">
          <h3 className="font-black text-sm text-sky-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-700" />
            <span>Leave Your Review for Kuttiammal's Dairy Hub ({lookupResult?.customerName})</span>
          </h3>

          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Your Rating:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="text-2xl text-amber-400 focus:outline-none transition hover:scale-125 cursor-pointer"
                  >
                    {star <= userRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Write your feedback (e.g. Milk packets are super fresh and chilled at 3°C!)..."
                value={userFeedbackText}
                onChange={(e) => setUserFeedbackText(e.target.value)}
                className="flex-1 bg-white border-2 border-slate-200 focus:border-sky-500 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-sky-700 hover:bg-sky-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* ========================================================
          5. RAZORPAY CHECKOUT MODAL WITH 3D COIN & UPI QR
         ======================================================== */}
      <RazorpayPaymentModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        amount={Number(lookupResult?.monthlySpend?.replace(/[^0-9]/g, '')) || 1440}
        customerName={lookupResult?.customerName || "M. Lakshmi"}
        customerPhone={lookupResult?.phone || "+91 98421 11001"}
        customerEmail="kannankutti58@gmail.com"
        merchantName="Kuttiammal's Dairy Hub"
        merchantSubtitle="Aavin Authorised Agency • Kovilpatti"
        description={`Aavin Monthly Attai Pass #${lookupResult?.cardNumber || 'ATT-101'} Renewal`}
        cardNumber={lookupResult?.cardNumber || "ATT-101"}
        onPaymentSuccess={handleRazorpaySuccess}
      />

      {/* ========================================================
          6. OFFICIAL TAX INVOICE & GREEN TICK RECEIPT MODAL
         ======================================================== */}
      <TaxInvoiceReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        receiptData={selectedReceipt || pastReceipts[0]}
        onSendWhatsApp={handleSendReceiptWhatsApp}
      />

    </div>
  );
};

export default CustomerPortalView;
