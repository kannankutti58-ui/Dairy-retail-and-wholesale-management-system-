import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { Pagination } from '../common/Pagination';
import { MultiChannelShareModal } from '../common/MultiChannelShareModal';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  Users,
  Store,
  Clock,
  Search,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Flame,
  Droplets,
  DollarSign,
  UserCheck,
  CreditCard,
  QrCode,
  Scan,
  Send,
  MessageCircle,
  Camera,
  Smartphone,
  Share2,
  Mail,
  Phone
} from 'lucide-react';

// Product Visuals Helper
const getProductVisual = (id, category, name) => {
  if (id === 'aavin-blue' || name.toLowerCase().includes('blue')) {
    return {
      gradient: 'from-blue-600 to-sky-700',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
      icon: '🥛',
      spec: '3.0% Fat • Toned Milk',
      packTag: 'Blue Pouch (500ml)',
      barcode: '890126201001'
    };
  }
  if (id === 'aavin-purple' || name.toLowerCase().includes('purple') || name.toLowerCase().includes('delight')) {
    return {
      gradient: 'from-purple-600 to-indigo-700',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
      icon: '🥛',
      spec: '3.5% Fat • Std Milk',
      packTag: 'Purple Pouch (500ml)',
      barcode: '890126201002'
    };
  }
  if (id === 'aavin-orange' || name.toLowerCase().includes('orange') || name.toLowerCase().includes('full cream')) {
    return {
      gradient: 'from-orange-600 to-amber-700',
      badgeBg: 'bg-orange-100 text-orange-950 border-orange-200',
      icon: '🥛',
      spec: '4.5%+ Fat • FCM Milk',
      packTag: 'Orange Pouch (500ml)',
      barcode: '890126201003'
    };
  }
  if (id === 'heritage-daily' || name.toLowerCase().includes('heritage')) {
    return {
      gradient: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-200',
      icon: '🥛',
      spec: '4.0% Fat • Daily Special',
      packTag: 'Green Pouch (500ml)',
      barcode: '890126201004'
    };
  }
  if (name.toLowerCase().includes('ghee')) {
    return {
      gradient: 'from-amber-500 to-yellow-600',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-200',
      icon: '🏺',
      spec: '100% Pure Cow Ghee',
      packTag: 'Aavin Glass Jar',
      barcode: '890126201005'
    };
  }
  if (name.toLowerCase().includes('curd') || name.toLowerCase().includes('buttermilk')) {
    return {
      gradient: 'from-teal-600 to-emerald-700',
      badgeBg: 'bg-teal-100 text-teal-950 border-teal-200',
      icon: '🥣',
      spec: 'Probiotic Fresh Curd',
      packTag: 'Fresh Curd Pack',
      barcode: '890126201006'
    };
  }
  if (name.toLowerCase().includes('butter') || name.toLowerCase().includes('paneer')) {
    return {
      gradient: 'from-yellow-600 to-amber-700',
      badgeBg: 'bg-yellow-100 text-yellow-950 border-yellow-200',
      icon: '🧈',
      spec: 'Fresh Solid Dairy',
      packTag: 'Dairy Fresh',
      barcode: '890126201007'
    };
  }
  if (category === 'sweets' || name.toLowerCase().includes('jamun') || name.toLowerCase().includes('mysore') || name.toLowerCase().includes('peda')) {
    return {
      gradient: 'from-pink-600 to-rose-700',
      badgeBg: 'bg-pink-100 text-pink-950 border-pink-200',
      icon: '🍬',
      spec: 'Pure Ghee Sweets',
      packTag: 'Festival Pack',
      barcode: '890126201008'
    };
  }
  return {
    gradient: 'from-sky-600 to-blue-700',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-200',
    icon: '📦',
    spec: 'Aavin SKU',
    packTag: 'Aavin Pack',
    barcode: '890126201009'
  };
};

// UPI Payment QR & Barcode Component for GPay, PhonePe, Paytm, and BHIM
export const UPIPaymentQRBarcode = ({ 
  amount = 0, 
  upiId = '9842155678@okaxis', 
  shopName = "Kuttiammal's Dairy Hub", 
  onMarkPaid,
  showMarkPaidButton = false,
  compact = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border-2 border-indigo-400/40 shadow-md space-y-3">
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* GPay Badge */}
          <span className="bg-white text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <span className="text-blue-600 font-black">G</span>
            <span className="text-rose-500 font-black">P</span>
            <span className="text-amber-500 font-black">a</span>
            <span className="text-emerald-600 font-black">y</span>
          </span>
          {/* PhonePe Badge */}
          <span className="bg-[#5f259f] text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
            <span>पे</span>
            <span>PhonePe</span>
          </span>
          {/* BHIM UPI Badge */}
          <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            UPI Barcode
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 font-black flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live UPI</span>
        </span>
      </div>

      {/* QR Code + Barcode Content */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl text-slate-900 shadow-inner">
        {/* Scannable SVG QR Code */}
        <div className="flex flex-col items-center shrink-0">
          <div className="p-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 120 120">
              <rect width="120" height="120" fill="#ffffff" />
              {/* Corner Finders */}
              <rect x="8" y="8" width="32" height="32" fill="#0f172a" rx="3" />
              <rect x="14" y="14" width="20" height="20" fill="#ffffff" />
              <rect x="19" y="19" width="10" height="10" fill="#0284c7" />

              <rect x="80" y="8" width="32" height="32" fill="#0f172a" rx="3" />
              <rect x="86" y="14" width="20" height="20" fill="#ffffff" />
              <rect x="91" y="19" width="10" height="10" fill="#5f259f" />

              <rect x="8" y="80" width="32" height="32" fill="#0f172a" rx="3" />
              <rect x="14" y="86" width="20" height="20" fill="#ffffff" />
              <rect x="19" y="91" width="10" height="10" fill="#10b981" />

              {/* Data Modules Pattern */}
              <rect x="46" y="10" width="6" height="6" fill="#0f172a" />
              <rect x="58" y="10" width="6" height="6" fill="#0f172a" />
              <rect x="46" y="22" width="6" height="6" fill="#0f172a" />
              <rect x="64" y="22" width="6" height="6" fill="#0f172a" />
              <rect x="10" y="46" width="6" height="6" fill="#0f172a" />
              <rect x="22" y="46" width="6" height="6" fill="#0f172a" />
              <rect x="10" y="58" width="6" height="6" fill="#0f172a" />
              <rect x="22" y="64" width="6" height="6" fill="#0f172a" />
              <rect x="82" y="46" width="6" height="6" fill="#0f172a" />
              <rect x="94" y="52" width="6" height="6" fill="#0f172a" />
              <rect x="88" y="64" width="6" height="6" fill="#0f172a" />
              <rect x="100" y="58" width="6" height="6" fill="#0f172a" />
              <rect x="46" y="82" width="6" height="6" fill="#0f172a" />
              <rect x="58" y="88" width="6" height="6" fill="#0f172a" />
              <rect x="64" y="100" width="6" height="6" fill="#0f172a" />
              <rect x="82" y="88" width="6" height="6" fill="#0f172a" />
              <rect x="94" y="94" width="6" height="6" fill="#0f172a" />
              <rect x="100" y="82" width="6" height="6" fill="#0f172a" />

              {/* Center GPay/PhonePe Rupee Badge */}
              <rect x="45" y="45" width="30" height="30" rx="6" fill="#0f172a" />
              <text x="60" y="65" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="sans-serif">₹</text>
            </svg>
          </div>
          <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider mt-1">
            Scan GPay / PhonePe
          </span>
        </div>

        {/* Scannable Barcode & UPI Details */}
        <div className="flex-1 w-full space-y-2 text-center sm:text-left">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">UPI VPA / GPay ID</span>
            <div className="font-mono font-black text-xs text-indigo-950 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
              <span>{upiId}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[10px] text-blue-600 hover:text-blue-800 underline ml-1 font-sans font-bold"
              >
                {copied ? 'Copied! ✅' : 'Copy'}
              </button>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block truncate">{shopName}</span>
          </div>

          {/* Barcode Graphic for Optical/Gun Scanner */}
          <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <svg className="w-full h-8" viewBox="0 0 160 35" preserveAspectRatio="none">
              <rect x="2" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="6" y="2" width="4" height="24" fill="#0f172a" />
              <rect x="12" y="2" width="1" height="24" fill="#0f172a" />
              <rect x="15" y="2" width="3" height="24" fill="#0f172a" />
              <rect x="20" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="24" y="2" width="4" height="24" fill="#0f172a" />
              <rect x="30" y="2" width="1" height="24" fill="#0f172a" />
              <rect x="33" y="2" width="3" height="24" fill="#0f172a" />
              <rect x="38" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="42" y="2" width="5" height="24" fill="#0f172a" />
              <rect x="49" y="2" width="1" height="24" fill="#0f172a" />
              <rect x="52" y="2" width="3" height="24" fill="#0f172a" />
              <rect x="57" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="61" y="2" width="4" height="24" fill="#0f172a" />
              <rect x="67" y="2" width="1" height="24" fill="#0f172a" />
              <rect x="70" y="2" width="3" height="24" fill="#0f172a" />
              <rect x="75" y="2" width="3" height="24" fill="#0f172a" />
              <rect x="80" y="2" width="1" height="24" fill="#0f172a" />
              <rect x="83" y="2" width="4" height="24" fill="#0f172a" />
              <rect x="89" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="93" y="2" width="3" height="24" fill="#0f172a" />
              <rect x="98" y="2" width="1" height="24" fill="#0f172a" />
              <rect x="101" y="2" width="4" height="24" fill="#0f172a" />
              <rect x="107" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="111" y="2" width="4" height="24" fill="#0f172a" />
              <rect x="117" y="2" width="1" height="24" fill="#0f172a" />
              <rect x="120" y="2" width="3" height="24" fill="#0f172a" />
              <rect x="125" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="129" y="2" width="4" height="24" fill="#0f172a" />
              <rect x="135" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="139" y="2" width="3" height="24" fill="#0f172a" />
              <rect x="144" y="2" width="2" height="24" fill="#0f172a" />
              <rect x="148" y="2" width="3" height="24" fill="#0f172a" />
              <text x="80" y="32" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">UPI: 9842155678 (GPAY / PHONEPE)</text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-0.5">
            <span className="text-slate-500 font-bold">Total Bill:</span>
            <strong className="font-black text-emerald-700 text-sm font-mono">₹{amount}</strong>
          </div>
        </div>
      </div>

      {showMarkPaidButton && onMarkPaid && (
        <button
          type="button"
          onClick={onMarkPaid}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm UPI / GPay Received (₹{amount})</span>
        </button>
      )}
    </div>
  );
};

export const MorningPOS = () => {
  const {
    shopInfo,
    shopSettings,
    milkProducts,
    curdProducts,
    dairyProducts,
    festivalSweets,
    recordPOSTransaction,
    wholesaleClients,
    bookletCustomers,
    dailySales,
    showNotification,
    sendWhatsAppMessage,
    sendMultiChannelCommunication,
    t
  } = useShop();

  const [customerType, setCustomerType] = useState('retail'); // 'retail', 'wholesale', 'booklet'
  const [selectedWholesaleClient, setSelectedWholesaleClient] = useState('');
  const [selectedBookletCustomer, setSelectedBookletCustomer] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [cashGiven, setCashGiven] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  
  // Barcode Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedCodeInput, setScannedCodeInput] = useState('');
  const [lastScannedItem, setLastScannedItem] = useState(null);

  // Receipt Modal State
  const [receiptToPrint, setReceiptToPrint] = useState(null);
  const [recentlyConfirmedTx, setRecentlyConfirmedTx] = useState(null);
  const [selectedTxForShare, setSelectedTxForShare] = useState(null);

  // Pagination states
  const [productPage, setProductPage] = useState(1);
  const productsPerPage = 6;

  const [txPage, setTxPage] = useState(1);
  const txPerPage = 5;

  const allProducts = [
    ...milkProducts.map(m => ({ ...m, category: 'milk', stockValue: m.currentStock, barcode: getProductVisual(m.id, 'milk', m.name).barcode })),
    ...curdProducts.map(c => ({ ...c, category: 'curd', stockValue: c.currentStock, barcode: getProductVisual(c.id, 'curd', c.name).barcode })),
    ...dairyProducts.map(d => ({ ...d, stockValue: d.stock || 20, barcode: getProductVisual(d.id, d.category, d.name).barcode })),
    ...festivalSweets.map(s => ({ ...s, category: 'sweets', stockValue: s.stock || 15, barcode: getProductVisual(s.id, 'sweets', s.name).barcode }))
  ];

  const filteredProducts = allProducts.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (item.tamilName && item.tamilName.includes(productSearch)) ||
      (item.barcode && item.barcode.includes(productSearch));
    return matchesCategory && matchesSearch;
  });

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productsPerPage,
    productPage * productsPerPage
  );

  const paginatedTransactions = dailySales.slice(
    (txPage - 1) * txPerPage,
    txPage * txPerPage
  );

  const getProductPrice = (item) => {
    if (customerType === 'wholesale' && item.wholesalePrice) {
      return item.wholesalePrice;
    }
    return item.mrp;
  };

  const addToCart = (product, quantityToAdd = 1) => {
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      const price = getProductPrice(product);

      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd, total: (item.quantity + quantityToAdd) * price }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            tamilName: product.tamilName || '',
            unit: product.unit || '1 unit',
            price,
            originalMrp: product.mrp,
            quantity: quantityToAdd,
            total: price * quantityToAdd,
            category: product.category || 'dairy',
            packetColor: product.packetColor
          }
        ];
      }
    });
    showNotification(`Added +${quantityToAdd} ${product.name} to bill!`);
  };

  // Barcode Scanner Match Handler
  const handleBarcodeScan = (code) => {
    const matchedProduct = allProducts.find(p => p.barcode === code.trim() || p.id === code.trim());
    if (matchedProduct) {
      addToCart(matchedProduct, 1);
      setLastScannedItem(matchedProduct);
      setScannedCodeInput('');
      showNotification(`⚡ Barcode Scanned: +1 ${matchedProduct.name} (₹${getProductPrice(matchedProduct)})`);
    } else {
      showNotification(`⚠️ Barcode ${code} not recognized in master catalog!`);
    }
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQty, total: newQty * item.price }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalBillAmount = cart.reduce((sum, item) => sum + item.total, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    let customerName = 'Walk-in Retail Customer';
    let phoneNum = customerPhone || '9842100000';

    if (customerType === 'wholesale') {
      const client = wholesaleClients.find(c => c.id === selectedWholesaleClient);
      customerName = client ? `${client.businessName} (Wholesale)` : 'Wholesale Account';
      phoneNum = client?.phone || phoneNum;
    } else if (customerType === 'booklet') {
      const card = bookletCustomers.find(c => c.id === selectedBookletCustomer);
      customerName = card ? `${card.customerName} (${card.cardNumber})` : 'Monthly Card Subscriber';
      phoneNum = card?.phone || phoneNum;
    }

    const txData = {
      customer: customerName,
      customerType,
      phone: phoneNum,
      items: cart.map(i => `${i.quantity}x ${i.name}`).join(', '),
      itemDetails: [...cart],
      amount: totalBillAmount,
      paymentMethod,
      cashGiven: Number(cashGiven) || totalBillAmount,
      changeReturned: (Number(cashGiven) || totalBillAmount) - totalBillAmount,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newTx = recordPOSTransaction(txData);
    setRecentlyConfirmedTx(newTx);
    setReceiptToPrint(newTx);
    setCart([]);
    setCashGiven('');
    setCustomerPhone('');
    showNotification(`Bill ₹${totalBillAmount} completed for ${customerName}!`);
  };

  const changeDue = Math.max(0, (Number(cashGiven) || 0) - totalBillAmount);

  // WhatsApp Message Generator
  const generateWhatsAppMessageText = (tx) => {
    const text = `🥛 *KUTTIAMMAL'S DAIRY HUB - AAVIN AGENCY*
📍 *Main Road Counter, Kovilpatti*
----------------------------------------
🧾 *Bill No:* ${tx.id}
📅 *Date & Time:* ${tx.date || 'Today'} at ${tx.time}
👤 *Customer:* ${tx.customer}
----------------------------------------
📦 *Items Purchased:*
${tx.itemDetails ? tx.itemDetails.map(i => `• ${i.quantity}x ${i.name} = ₹${i.total}`).join('\n') : `• ${tx.items}`}
----------------------------------------
💰 *TOTAL AMOUNT:* ₹${tx.amount}
💳 *Payment Mode:* ${tx.paymentMethod}
----------------------------------------
🙏 *நன்றி! மீண்டும் வருக!*
✨ _Fresh Daily Direct from Aavin Feeder Dairy_`;

    return text;
  };

  const handleSendWhatsAppBill = (tx) => {
    sendWhatsAppMessage({
      recipientPhone: tx.phone || '98421 11001',
      recipientName: tx.customer || 'Walk-in Retail Customer',
      text: generateWhatsAppMessageText(tx),
      recipientType: tx.type === 'wholesale' ? 'wholesale' : 'subscriber',
      badge: `Bill #${tx.id}`,
      avatar: '🧾',
      avatarBg: 'bg-emerald-100 text-emerald-800'
    });
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
            <span className="bg-white text-blue-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              {t('fast_pos_terminal', 'Fast Morning POS')}
            </span>
            <span className="text-xs text-sky-100 font-medium">
              {t('app_subtitle', 'Barcode & Omni-Channel Terminal')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">{t('daily_sales', 'Daily Sales & POS Counter')}</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-sky-100 mt-1">
            <span>Terminal: <strong>Counter #1 (Main)</strong></span>
            <span>•</span>
            <span>Cashier: <strong>{shopSettings.proprietor}</strong></span>
            <span>•</span>
            <span>Today's Bills: <strong>{dailySales.length} Transactions</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 transition shadow-md shrink-0 border border-emerald-300 animate-pulse"
          >
            <Scan className="w-4 h-4" />
            <span>Barcode Scanner ⚡</span>
          </button>

          <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl text-center shadow-xs shrink-0">
            <span className="text-[10px] text-sky-100 uppercase font-black tracking-wider block">Active Cart</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              ₹{totalBillAmount}
            </div>
            <span className="text-[10px] text-sky-100 font-bold block mt-0.5">
              {totalItemsCount} units
            </span>
          </div>
        </div>
      </div>

      {/* 2. Customer Type Switcher Chips */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider hidden sm:block">Customer:</span>
          
          <button
            onClick={() => setCustomerType('retail')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
              customerType === 'retail'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🛍️ Retail Walk-in</span>
          </button>

          <button
            onClick={() => setCustomerType('wholesale')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
              customerType === 'wholesale'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>🏪 Wholesale (₹2 OFF)</span>
          </button>

          <button
            onClick={() => setCustomerType('booklet')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
              customerType === 'booklet'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>💳 Attai Card Subscriber</span>
          </button>
        </div>

        {customerType === 'wholesale' && (
          <div className="w-full sm:w-auto flex items-center space-x-2">
            <select
              value={selectedWholesaleClient}
              onChange={(e) => setSelectedWholesaleClient(e.target.value)}
              className="bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none w-full"
            >
              <option value="">Select Tea Stall / Hotel Account...</option>
              {wholesaleClients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.businessName} (Balance: ₹{c.pendingBalance})
                </option>
              ))}
            </select>
          </div>
        )}

        {customerType === 'booklet' && (
          <div className="w-full sm:w-auto flex items-center space-x-2">
            <select
              value={selectedBookletCustomer}
              onChange={(e) => setSelectedBookletCustomer(e.target.value)}
              className="bg-purple-50 border-2 border-purple-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none w-full"
            >
              <option value="">Select Monthly Card Holder...</option>
              {bookletCustomers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.cardNumber} - {c.customerName} ({c.packetQuantity} pkts/day)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 3. Main POS Grid: Product Matrix & Active Cart Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Product Selection Matrix with Photos / Visuals (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Category Tabs, Search Bar & Barcode Scanner Quick Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All SKUs', color: 'bg-slate-900' },
                { id: 'milk', label: 'Fresh Milk', color: 'bg-blue-600' },
                { id: 'curd', label: 'Curd', color: 'bg-teal-600' },
                { id: 'dairy', label: 'Ghee & Butter', color: 'bg-amber-600' },
                { id: 'sweets', label: 'Sweets', color: 'bg-pink-600' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setProductPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition shadow-2xs ${
                    activeCategory === cat.id
                      ? `${cat.color} text-white shadow-sm scale-105`
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search SKU / Barcode..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setProductPage(1);
                  }}
                  className="w-full bg-white border-2 border-slate-200 focus:border-blue-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none transition shadow-2xs font-medium"
                />
              </div>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition shadow-xs shrink-0"
                title="Open Barcode Scanner"
              >
                <Scan className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Grid with Visual Cards & Quick Add Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {paginatedProducts.map((product) => {
              const visual = getProductVisual(product.id, product.category, product.name);
              const price = getProductPrice(product);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-400 transition-all p-4 flex flex-col justify-between shadow-xs hover:shadow-md space-y-3 group"
                >
                  {/* Photo & Badge Header */}
                  <div className={`w-full h-20 rounded-2xl bg-gradient-to-r ${visual.gradient} p-2.5 text-white flex items-center justify-between shadow-xs relative overflow-hidden`}>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full block w-fit">
                        {visual.packTag}
                      </span>
                      <div className="text-[11px] font-bold text-white/90 mt-1 font-mono">{visual.spec}</div>
                    </div>
                    <div className="text-3xl drop-shadow-md group-hover:scale-110 transition-transform">
                      {visual.icon}
                    </div>
                  </div>

                  {/* Title & Stock */}
                  <div>
                    <h4 className="font-black text-sm text-slate-900 line-clamp-1 group-hover:text-blue-700 transition">
                      {product.name}
                    </h4>
                    {product.tamilName && (
                      <p className="text-[11px] text-slate-400 font-medium">{product.tamilName}</p>
                    )}
                    <div className="flex justify-between items-center mt-2 text-[10px] font-mono">
                      <span className="text-slate-500">Stock:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {product.stockValue} {product.unit || 'units'}
                      </span>
                    </div>
                  </div>

                  {/* Price & Quick Quantity Steppers */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Rate</span>
                      <span className="text-base font-black text-slate-900 font-mono">₹{price}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>

                      {product.category === 'milk' && (
                        <button
                          onClick={() => addToCart(product, 5)}
                          className="px-2 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-[10px] font-black transition border border-slate-200"
                        >
                          +5
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={productPage}
            totalItems={filteredProducts.length}
            itemsPerPage={productsPerPage}
            onPageChange={setProductPage}
          />
        </div>

        {/* Right Column: Active Bill Basket & Checkout Terminal (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-base text-slate-900 uppercase tracking-wider">
                  Current Sale Bill
                </h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Bill
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs font-bold">Shopping cart is currently empty</p>
                <p className="text-[11px] text-slate-400">Click product photo or scan barcode to add</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs transition hover:border-blue-200"
                  >
                    <div className="flex-1 pr-2">
                      <div className="font-extrabold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        ₹{item.price} × {item.quantity} = <strong className="text-slate-900">₹{item.total}</strong>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono font-black text-sm text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="w-7 h-7 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center justify-center ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bill Summary, WhatsApp Input & Tender */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-200 text-xs">
                {/* Total Display */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-blue-900 block">Total Payable</span>
                    <span className="text-xs text-slate-500 font-bold">{totalItemsCount} units</span>
                  </div>
                  <span className="text-3xl font-black text-blue-950 font-mono">₹{totalBillAmount}</span>
                </div>

                {/* Customer WhatsApp Number for Digital E-Bill */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Customer WhatsApp Phone (for instant e-receipt)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 98421 55678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Payment Method Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700">Payment Method</label>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Instant Counter Bill Save
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Cash', label: '💵 Cash (ரொக்கம்)' },
                      { id: 'UPI QR', label: '📱 UPI / QR' },
                      { id: 'Card / Ledger', label: '📒 Ledger (கடன்)' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`py-2.5 rounded-xl font-black transition text-xs cursor-pointer ${
                          paymentMethod === method.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counter UPI QR Display */}
                {paymentMethod === 'UPI QR' && (
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Counter QR Payment</span>
                      <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">● GPay / PhonePe</span>
                    </div>
                    <UPIPaymentQRBarcode
                      amount={totalBillAmount}
                      upiId="kannankutti58@okaxis"
                      shopName="Kuttiammal's Dairy Hub"
                      showMarkPaidButton={false}
                      compact={true}
                    />
                  </div>
                )}

                {/* Cash Calculator (if cash) */}
                {paymentMethod === 'Cash' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Cash Received (₹)</label>
                        <input
                          type="number"
                          placeholder={totalBillAmount.toString()}
                          value={cashGiven}
                          onChange={(e) => setCashGiven(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 rounded-xl p-2.5 font-mono font-black text-base text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Change Return (₹)</label>
                        <div className="w-full bg-emerald-50 border-2 border-emerald-300 rounded-xl p-2.5 font-mono font-black text-base text-emerald-800">
                          ₹{changeDue}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      {[totalBillAmount, 100, 200, 500].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCashGiven(val.toString())}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-700"
                        >
                          ₹{val}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complete Bill Action */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Complete Bill & Print (₹{totalBillAmount})</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* 4. Recent Transactions Journal Table with WhatsApp & Print Actions */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Today's Counter Transaction History</span>
            </h3>
            <p className="text-xs text-slate-500">Live journal of receipts with WhatsApp dispatch & thermal printing</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-black text-[10px]">
                <th className="py-2.5 px-3">Tx ID</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Items Sold</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3 text-right">Total Amount</th>
                <th className="py-2.5 px-3 text-center">WhatsApp & Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 font-medium">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{tx.id}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{tx.time}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{tx.customer}</td>
                  <td className="py-3 px-3 text-slate-700 max-w-xs truncate">{tx.items}</td>
                  <td className="py-3 px-3">
                    <span className="bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md font-bold text-[10px]">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-slate-900 text-right text-sm">
                    ₹{tx.amount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => handleSendWhatsAppBill(tx)}
                        className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition"
                        title="Send WhatsApp E-Receipt"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedTxForShare(tx)}
                        className="p-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg transition"
                        title="Share E-Bill via Call / Mail / SMS / WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setReceiptToPrint(tx)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition"
                        title="View & Print Thermal Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={txPage}
          totalItems={dailySales.length}
          itemsPerPage={txPerPage}
          onPageChange={setTxPage}
        />
      </div>

      {/* 5. Barcode Scanner Simulation Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border-2 border-emerald-300 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Scan className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                  Live Barcode, GPay & QR Scanner
                </h3>
              </div>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* TOP: GPay & PhonePe Payment Barcode / QR Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase tracking-wider text-slate-700 text-[11px] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>GPay / PhonePe Payment Barcode & QR:</span>
                </span>
                <span className="text-[10px] font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  Cart Bill: ₹{totalBillAmount}
                </span>
              </div>
              <UPIPaymentQRBarcode
                amount={totalBillAmount}
                upiId="9842155678@okaxis"
                shopName={shopSettings.shopName || shopInfo.name}
                showMarkPaidButton={true}
                onMarkPaid={() => {
                  setPaymentMethod('UPI / GPay');
                  setIsScannerOpen(false);
                  showNotification(`📱 Selected UPI / GPay for ₹${totalBillAmount}! Ready to complete bill.`);
                }}
              />
            </div>

            <div className="border-t border-slate-200 pt-2">
              <span className="font-black uppercase tracking-wider text-slate-700 text-[11px] block mb-2 flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-emerald-600" />
                <span>Product SKU Barcode Gun Scanner:</span>
              </span>
            </div>

            {/* Camera Viewport Visual Simulation */}
            <div className="w-full h-36 bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-white border-2 border-dashed border-emerald-400 p-4">
              <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] absolute top-1/2 -translate-y-1/2 animate-pulse"></div>
              
              <Camera className="w-7 h-7 text-emerald-400 mb-1 opacity-75" />
              <span className="text-xs font-mono text-emerald-300 font-bold">Scanning Optical Viewport Ready</span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-mono">Point camera or USB scanner at milk packet barcode</span>
            </div>

            {/* Manual / USB Scanner Code Input */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Enter Barcode or Scan with USB Gun:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. 890126201001"
                  value={scannedCodeInput}
                  onChange={(e) => setScannedCodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && scannedCodeInput) {
                      handleBarcodeScan(scannedCodeInput);
                    }
                  }}
                  className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 font-mono font-bold text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleBarcodeScan(scannedCodeInput)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition"
                >
                  Scan Code
                </button>
              </div>
            </div>

            {/* Quick Demo Barcode Preset Buttons */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Quick Barcode Presets:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: '890126201001', label: '🥛 Aavin Blue Pouch' },
                  { code: '890126201002', label: '🥛 Aavin Purple Pouch' },
                  { code: '890126201003', label: '🥛 Aavin Orange Pouch' },
                  { code: '890126201005', label: '🏺 Aavin Pure Ghee Jar' },
                  { code: '890126201006', label: '🥣 Fresh Curd Pack' }
                ].map(item => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleBarcodeScan(item.code)}
                    className="p-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 rounded-xl text-left font-mono text-[11px] font-bold transition flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-[9px] text-slate-400">{item.code.slice(-4)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsScannerOpen(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Thermal Receipt Print & WhatsApp Share Modal */}
      {receiptToPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-300 font-mono text-xs text-slate-900">
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-400">
              <span className="font-bold text-[10px] uppercase text-slate-500">Official Thermal Receipt</span>
              <button
                onClick={() => setReceiptToPrint(null)}
                className="text-slate-400 hover:text-slate-600 font-sans font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-black text-sm uppercase">{shopSettings.printerHeader || "KUTTIAMMAL'S DAIRY HUB"}</h4>
              <p className="text-[10px] text-slate-600 font-sans">Authorized Aavin Milk Agency, Tirunelveli</p>
              <p className="text-[10px] text-slate-500">GSTIN: {shopSettings.taxNumber}</p>
              <p className="text-[10px] text-slate-500">Ph: {shopSettings.phone}</p>
            </div>

            <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Receipt: <strong>{receiptToPrint.id}</strong></span>
                <span>{receiptToPrint.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Date: {receiptToPrint.date}</span>
                <span>Pay: {receiptToPrint.paymentMethod}</span>
              </div>
              <div className="pt-1 text-slate-600 font-bold truncate">
                Cust: {receiptToPrint.customer}
              </div>
            </div>

            <div className="space-y-1 py-1 text-xs">
              <div className="flex justify-between font-bold border-b border-slate-200 pb-1">
                <span>Item</span>
                <span>Amount</span>
              </div>
              <p className="text-[11px] leading-relaxed pt-1 text-slate-800">
                {receiptToPrint.items}
              </p>
            </div>

            <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 text-sm font-black">
              <div className="flex justify-between text-base">
                <span>TOTAL AMOUNT:</span>
                <span>₹{receiptToPrint.amount}</span>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-dashed border-slate-400 text-slate-600 text-[10px] space-y-1">
              <p className="font-bold text-slate-800">{shopSettings.printerFooterTamil || "நன்றி! மீண்டும் வருக!"}</p>
              <p className="text-[9px]">Fresh Daily Direct From Tirunelveli Dairy</p>
            </div>

            {/* Action Buttons: WhatsApp, Multi-Channel & Thermal Print */}
            <div className="pt-2 space-y-2 font-sans">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSendWhatsAppBill(receiptToPrint)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp E-Receipt</span>
                </button>

                <button
                  onClick={() => {
                    const tx = receiptToPrint;
                    setReceiptToPrint(null);
                    setSelectedTxForShare(tx);
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Call / Mail / SMS</span>
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    window.print();
                    showNotification("Printed thermal receipt slip!");
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setReceiptToPrint(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MultiChannel Share Modal */}
      {selectedTxForShare && (
        <MultiChannelShareModal
          isOpen={Boolean(selectedTxForShare)}
          onClose={() => setSelectedTxForShare(null)}
          title={`E-Bill #${selectedTxForShare.id}`}
          recipientName={selectedTxForShare.customer || 'Walk-in Retail Customer'}
          recipientPhone={selectedTxForShare.phone || '+91 98421 11001'}
          recipientEmail={`customer.${selectedTxForShare.phone?.replace(/[^0-9]/g,'') || 'pos'}@gmail.com`}
          subject={`Aavin Milk E-Receipt - Bill #${selectedTxForShare.id}`}
          defaultMessage={generateWhatsAppMessageText(selectedTxForShare)}
        />
      )}

    </div>
  );
};
