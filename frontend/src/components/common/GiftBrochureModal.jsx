import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  Send, 
  Smartphone, 
  Copy, 
  X, 
  CheckCheck, 
  Share2, 
  Printer, 
  ExternalLink, 
  Percent, 
  Tag, 
  Calendar, 
  MapPin, 
  Phone,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SmsGatewayModal } from './SmsGatewayModal';

export const GIFT_TEMPLATES = [
  {
    id: 'festive-hamper',
    title: '🪔 Diwali & Pongal Festive Ghee & Sweet Hamper',
    tamilTitle: 'தீபாவளி & பொங்கல் சிறப்பு ஆவின் நெய் மற்றும் இனிப்பு பரிசு தொகுப்பு',
    category: 'Festival Hamper',
    discount: '15% Off',
    couponCode: 'AAVIN-FESTIVE',
    items: [
      'Aavin Pure Agmark Cow Ghee (500ml Jar)',
      'Traditional Gulab Jamun & Mysore Pak (250g)',
      'Aavin Full Cream Milk (Orange Pouch)',
      'Free Festive Milk Attai Voucher (₹100 Value)'
    ],
    mrpTotal: '₹620',
    offerPrice: '₹520',
    validity: 'Valid for Diwali & Pongal 2026',
    formattedText: `🪔 *KUTTIAMMAL'S DAIRY HUB - FESTIVE GIFT BROCHURE* 🪔
_Aavin Authorised Milk Agency • Kovilpatti_

வணக்கம்! எங்கள் ஆவின் பாலகத்தின் தீபாவளி மற்றும் பொங்கல் சிறப்பு பரிசு தொகுப்பு:

🎁 *Special Festive Hamper Contents:*
1️⃣ Aavin Pure Agmark Cow Ghee (500ml Jar)
2️⃣ Traditional Gulab Jamun & Mysore Pak (250g)
3️⃣ Aavin Full Cream Orange Milk (500ml)
4️⃣ ₹100 Monthly Milk Attai Renewal Voucher

🏷️ *Offer Price: ₹520 only* (MRP ₹620 - Save ₹100!)
🎟️ *Coupon Code: AAVIN-FESTIVE*

📍 *Shop Address:* Main Road, Kovilpatti (Near Feeder Route)
📞 *Helpline & WhatsApp Order:* +91 76049 36341
🥛 _Order today for fresh morning door delivery!_`
  },
  {
    id: 'attai-voucher',
    title: '🎟️ Monthly Milk Pass (Attai) ₹100 Discount Voucher',
    tamilTitle: 'மாதாந்திர ஆவின் அட்டை ₹100 தள்ளுபடி கூப்பன்',
    category: 'Loyalty Voucher',
    discount: '₹100 Flat Cashback',
    couponCode: 'AAVIN100',
    items: [
      'Daily 2 Packets Aavin Delight Purple Milk',
      'Punctual Morning 05:30 AM Door Delivery',
      'Real-Time Digital Punch Card Tracking',
      'Zero Delivery Charges'
    ],
    mrpTotal: '₹1,440/Month',
    offerPrice: '₹1,340/Month',
    validity: 'Valid for next 30 days',
    formattedText: `🎟️ *AAVIN MONTHLY ATTAI PASS - ₹100 DISCOUNT VOUCHER* 🎟️
_Kuttiammal's Dairy Hub • Kovilpatti_

Dear Valued Customer,
Renew or start your 30-Day Aavin Milk Attai Pass and get *₹100 Flat Discount*!

🥛 *Subscription Benefits:*
• Daily 2 Packets Fresh Aavin Milk (4.5% Fat Delight)
• Morning 05:30 AM Doorstep Delivery
• Online Card Punching & WhatsApp Ledger

💰 *Monthly Rate: ₹1,340* (Reg. ₹1,440)
🎟️ *Voucher Promo Code: AAVIN100*

📲 *WhatsApp Renewal:* +91 76049 36341
🏪 *Pay via UPI:* kannankutti58@okaxis`
  },
  {
    id: 'wholesale-b2b',
    title: '☕ Wholesale Tea Stall & Bakery Bulk Milk Booking',
    tamilTitle: 'டீ ஸ்டால் & பேக்கரி மொத்த பால் முன்பதிவு சலுகை',
    category: 'Wholesale B2B',
    discount: '₹2 Less / Pouch',
    couponCode: 'B2B-CRATE',
    items: [
      'Daily 25 to 50 Pouches High Cream Milk',
      'Weekly Transparent Ledger Billing',
      'Free Early Morning 04:30 AM Logistics Delivery',
      'Priority Indent Allocation during Festivals'
    ],
    mrpTotal: '₹30/pkt',
    offerPrice: '₹28/pkt (Wholesale Rate)',
    validity: 'Year-Round Active',
    formattedText: `☕ *AAVIN WHOLESALE B2B MILK BROCHURE* ☕
_Kuttiammal's Dairy Hub • Wholesale Distribution Desk_

Special wholesale pricing for Tea Stalls, Bakeries, Hotels & Caterers in Kovilpatti!

📦 *Wholesale Milk Packages:*
• Aavin Nice Blue 500ml: *₹28/pkt* (Save ₹2/pkt)
• Aavin Full Cream Orange: *₹28/pkt* wholesale rate
• Bulk Crates dispatched at 04:30 AM daily
• Weekly GST Ledger & Invoice Sync

📞 *Call / WhatsApp B2B Desk:* +91 76049 36341
🥛 *Kuttiammal's Dairy Hub • Main Road, Kovilpatti*`
  },
  {
    id: 'curd-quality',
    title: '❄️ Cold-Chain Fresh Thick Curd & Ghee Flyer',
    tamilTitle: 'வீட்டு முறையில் தயாரித்த கெட்டி தயிர் & பசு நெய்',
    category: 'Freshness Guarantee',
    discount: '100% Pure Agmark',
    couponCode: 'FRESH-CURD',
    items: [
      'Natural Thick Curd Cultured at 42°C',
      'Zero Preservatives & Fresh Daily Batch',
      'Chilled in 3.2°C Temperature-Controlled Cold Storage',
      '500g Tub / 1kg Family Pack Available'
    ],
    mrpTotal: '₹35',
    offerPrice: '₹30 / 500g',
    validity: 'Daily Fresh Stock',
    formattedText: `❄️ *FRESH HOMEMADE CURD & PURE COW GHEE FLYER* ❄️
_Kuttiammal's Dairy Hub • Cold Storage Unit_

சுவையான, கெட்டியான புத்தம் புதிய வீட்டு முறை ஆவின் தயிர் & தூய பசு நெய்!

🥛 *Today's Fresh Stock:*
• Fresh Thick Curd 500g: *₹30* (Naturally cultured)
• Aavin Agmark Cow Ghee 500ml: *₹360*
• Cold-Chain Chilled at 3.2°C

📍 *Shop:* Main Road, Kovilpatti
📲 *Reserve on WhatsApp:* +91 76049 36341`
  }
];

export const GiftBrochureModal = ({ isOpen, onClose, defaultRecipientPhone = '7604936341' }) => {
  const { showNotification } = useShop();
  const [selectedTemplate, setSelectedTemplate] = useState(GIFT_TEMPLATES[0]);
  const [recipientPhone, setRecipientPhone] = useState(defaultRecipientPhone);
  const [recipientName, setRecipientName] = useState('Valued Customer');
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [customDiscountNote, setCustomDiscountNote] = useState('');

  if (!isOpen) return null;

  const cleanPhone = (recipientPhone || '7604936341').replace(/[^0-9]/g, '');
  const activeMessage = customDiscountNote 
    ? `${selectedTemplate.formattedText}\n\n📝 *Special Note:* ${customDiscountNote}`
    : selectedTemplate.formattedText;

  // 1. Send to Real-Time WhatsApp
  const handleSendWhatsApp = async () => {
    setIsSendingWhatsApp(true);
    const targetPhone = cleanPhone || '7604936341';

    try {
      // Call backend WhatsApp Multi-Gateway
      const response = await fetch('http://localhost:5000/api/communication/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetPhone,
          message: activeMessage
        })
      });

      const result = await response.json();

      // Launch direct WhatsApp Web / App link
      const waUrl = result.directUrl || `https://api.whatsapp.com/send?phone=91${targetPhone}&text=${encodeURIComponent(activeMessage)}`;
      window.open(waUrl, '_blank');

      showNotification(`🚀 Gift Brochure Dispatched to WhatsApp for +91 ${targetPhone}!`);
    } catch (err) {
      // Direct Web link fallback
      const waUrl = `https://api.whatsapp.com/send?phone=91${targetPhone}&text=${encodeURIComponent(activeMessage)}`;
      window.open(waUrl, '_blank');
      showNotification(`Opening WhatsApp for +91 ${targetPhone}`);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // 2. Copy Brochure Text
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeMessage);
      showNotification('📋 Gift Brochure text copied to clipboard!');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 text-slate-900 dark:text-white shadow-2xl border-2 border-slate-200 dark:border-slate-800 space-y-5 my-8 max-h-[92vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-amber-500/20"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
              >
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg">Aavin Gift Brochure & Festival Vouchers</h3>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                    Real WhatsApp Dispatch
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Send festive offers, ₹100 discount vouchers & B2B brochures directly to WhatsApp & SMS
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Template Selector Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
              Select Brochure / Voucher Category:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GIFT_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplate(t)}
                  className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                    selectedTemplate.id === t.id
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 dark:border-amber-600 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="font-black text-xs leading-snug truncate">{t.title.split(' ')[0]} {t.category}</div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 mt-1 block">
                    {t.discount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Number & Custom Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 block mb-1">
                Recipient WhatsApp / Phone Number:
              </label>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                <span className="text-xs font-mono font-bold text-slate-400">+91</span>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="7604936341"
                  className="bg-transparent text-xs font-mono font-black text-slate-900 dark:text-white outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 block mb-1">
                Customer Name / Business:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="M. Lakshmi / Murugan Tea Stall"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Visual Voucher Flyer Preview */}
          <div className="relative p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white shadow-xl overflow-hidden border-2 border-amber-300">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
            
            <div className="flex items-center justify-between">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>KUTTIAMMAL'S DAIRY HUB • AAVIN AGENCY</span>
              </span>
              <span className="bg-amber-300 text-slate-950 font-black text-xs px-3 py-1 rounded-full font-mono shadow-xs">
                {selectedTemplate.discount}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-xl font-black">{selectedTemplate.title}</h4>
              <p className="text-xs text-amber-100 font-tamil mt-0.5">{selectedTemplate.tamilTitle}</p>
            </div>

            {/* Flyer Items Box */}
            <div className="mt-4 p-3.5 bg-black/25 backdrop-blur-md rounded-2xl border border-white/15 space-y-1.5 text-xs">
              <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider block">Included in this Offer:</span>
              <ul className="space-y-1 text-amber-50">
                {selectedTemplate.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Coupon Code Bar */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-amber-200 block uppercase font-bold">Special Offer Price</span>
                <span className="text-lg font-black font-mono">{selectedTemplate.offerPrice}</span>
                <span className="text-[10px] text-amber-200/80 line-through ml-2 font-mono">{selectedTemplate.mrpTotal}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-amber-200 block uppercase font-bold">Promo Coupon Code</span>
                <span className="bg-white text-slate-900 font-black text-xs px-3 py-1 rounded-lg font-mono tracking-wider border border-amber-200 shadow-xs">
                  {selectedTemplate.couponCode}
                </span>
              </div>
            </div>
          </div>

          {/* Formatted Text Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span>Formatted WhatsApp Message Body:</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Brochure</span>
              </button>
            </div>
            <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {activeMessage}
            </div>
          </div>

          {/* Dispatch Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* 1. Real-Time WhatsApp Button */}
            <button
              type="button"
              disabled={isSendingWhatsApp}
              onClick={handleSendWhatsApp}
              className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSendingWhatsApp ? 'Transmitting to WhatsApp...' : `Send to WhatsApp (+91 ${cleanPhone})`}</span>
            </button>

            {/* 2. SMS Gateway Dispatch */}
            <button
              type="button"
              onClick={() => setShowSmsModal(true)}
              className="py-3.5 px-5 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-2xl shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2.5 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Send Voucher via SMS Gateway</span>
            </button>

          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Store Dispatch Helpline: <strong>+91 76049 36341</strong></span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Sub-modal for Telecom SMS */}
      <SmsGatewayModal
        isOpen={showSmsModal}
        onClose={() => setShowSmsModal(false)}
        recipientName={recipientName}
        phone={cleanPhone}
        message={activeMessage}
      />
    </>
  );
};
