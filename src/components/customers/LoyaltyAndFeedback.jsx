import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Award, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  Heart, 
  Gift, 
  Sparkles, 
  Coins, 
  UserCheck, 
  Send,
  ThumbsUp,
  Flame,
  Trophy,
  Crown,
  Medal,
  CheckCircle2,
  Package,
  MessageCircle,
  Tag
} from 'lucide-react';

export const LoyaltyAndFeedback = () => {
  const { showNotification, sendWhatsAppMessage } = useShop();

  // Top 3 Monthly VIP Winners with their exclusive customized Gift Prize Combos
  const [monthlyWinners, setMonthlyWinners] = useState([
    {
      rank: 1,
      rankTitle: '1st Prize Champion',
      medal: '🥇',
      badgeColor: 'bg-amber-400 text-slate-950 font-black',
      gradient: 'from-amber-500/20 via-yellow-500/15 to-orange-500/10 border-amber-300 ring-2 ring-amber-400/30',
      winnerName: 'M. Lakshmi',
      phone: '+91 98421 11001',
      customerType: 'Card #ATT-101 (Palayamkottai)',
      loyaltyPoints: 3450,
      comboName: 'Grand Festive Dairy Delight Hamper',
      comboValue: '₹950 Gift Value',
      items: [
        { name: 'Aavin Pure Cow Ghee (1 Litre Jar)', icon: '🏺' },
        { name: 'Special Milk Peda Box (500g)', icon: '🍬' },
        { name: 'Fresh Homemade Curd (1kg Tub)', icon: '🥣' },
        { name: 'Aavin Special Mysore Pak (250g)', icon: '📦' }
      ],
      voucherIssued: false
    },
    {
      rank: 2,
      rankTitle: '2nd Prize Gold Runner-Up',
      medal: '🥈',
      badgeColor: 'bg-slate-300 text-slate-950 font-black',
      gradient: 'from-slate-200/50 via-sky-100/30 to-slate-100/40 border-slate-300',
      winnerName: 'K. Priya',
      phone: '+91 98421 33003',
      customerType: 'Card #ATT-102 (NGO Colony)',
      loyaltyPoints: 2890,
      comboName: 'Sweet & Ghee Delight Pack',
      comboValue: '₹550 Gift Value',
      items: [
        { name: 'Aavin Pure Cow Ghee (500ml Jar)', icon: '🏺' },
        { name: 'Special Milk Peda Box (250g)', icon: '🍬' },
        { name: 'Fresh Cultured Curd (500g Tub)', icon: '🥣' }
      ],
      voucherIssued: false
    },
    {
      rank: 3,
      rankTitle: '3rd Prize Bronze Star',
      medal: '🥉',
      badgeColor: 'bg-amber-700 text-white font-black',
      gradient: 'from-amber-700/10 via-orange-100/30 to-amber-50/40 border-amber-300',
      winnerName: 'Murugan Tea Stall (B2B)',
      phone: '+91 98421 22002',
      customerType: 'B2B Wholesale (25 pkts/day)',
      loyaltyPoints: 2120,
      comboName: 'Healthy Starter Gift Combo',
      comboValue: '₹350 Gift Value',
      items: [
        { name: 'Aavin Pure Ghee (200ml Jar)', icon: '🏺' },
        { name: 'Aavin Milk Peda (200g)', icon: '🍬' },
        { name: 'Aavin Flavoured Milk (Elaichi)', icon: '🥛' }
      ],
      voucherIssued: false
    }
  ]);

  const [loyaltyUsers, setLoyaltyUsers] = useState([
    { id: 'u1', name: 'M. Lakshmi', phone: '98421 11001', points: 1250, visits: 28, tier: 'Platinum VIP', spent: '₹14,500', nextReward: '₹100 Ghee Discount' },
    { id: 'u2', name: 'K. Priya', phone: '98421 33003', points: 980, visits: 24, tier: 'Gold VIP', spent: '₹8,900', nextReward: 'Free 200g Curd Tub' },
    { id: 'u3', name: 'S. Venkatesh', phone: '98421 66006', points: 420, visits: 18, tier: 'Silver Regular', spent: '₹4,500', nextReward: '₹50 Milk Rebate' },
    { id: 'u4', name: 'Murugan Tea Stall', phone: '98421 22002', points: 820, visits: 30, tier: 'B2B Champion', spent: '₹22,400', nextReward: '1 Free Ghee Tin' },
  ]);

  const [feedback, setFeedback] = useState([
    { id: 'f1', user: 'K. Priya', rating: 5, time: '06:15 AM', comment: 'Always fresh and thick morning milk packets. Thank you Kuttiammal Mam!', tag: 'Verified Buyer', sentiment: 'Positive' },
    { id: 'f2', user: 'V. Sundar', rating: 4, time: '05:50 AM', comment: 'Curd stock is thick and perfect consistency for lunch meals.', tag: 'Attai Subscriber', sentiment: 'Positive' },
    { id: 'f3', user: 'S. Anbu (Hotel)', rating: 5, time: 'Yesterday', comment: 'Aavin Orange milk quality is top tier for our restaurant tea preparations.', tag: 'B2B Wholesale', sentiment: 'Positive' },
  ]);

  const handleIssueGiftVoucher = (winner) => {
    setMonthlyWinners(prev => prev.map(w => w.rank === winner.rank ? { ...w, voucherIssued: true } : w));

    const text = `🎉 *CONGRATULATIONS FROM KUTTIAMMAL'S DAIRY HUB!*
🏆 *You are our ${winner.rankTitle} for this Month!*
👤 *Customer:* ${winner.winnerName} (${winner.customerType})
⭐ *Loyalty Points Score:* ${winner.loyaltyPoints} Pts
----------------------------------------
🎁 *YOUR EXCLUSIVE PRIZE GIFT COMBO:*
✨ *${winner.comboName}* (${winner.comboValue})
${winner.items.map(item => `• ${item.icon} ${item.name}`).join('\n')}
----------------------------------------
📍 *Collect from Agency Counter:* Main Road, Kovilpatti
🙏 _Thank you for being our valuable monthly subscriber!_`;

    sendWhatsAppMessage({
      recipientPhone: winner.phone,
      recipientName: winner.winnerName,
      text,
      recipientType: winner.customerType.includes('Wholesale') ? 'wholesale' : 'subscriber',
      badge: `${winner.rankTitle} • ${winner.comboName}`,
      avatar: winner.avatar || '🎁',
      avatarBg: 'bg-amber-100 text-amber-800'
    });
    
    showNotification(`🎁 Issued ${winner.comboName} gift voucher to ${winner.winnerName}!`);
  };

  const handleRedeemPoints = (user, amount) => {
    setLoyaltyUsers(prev => prev.map(u => u.id === user.id ? { ...u, points: u.points - amount } : u));
    showNotification(`Redeemed ${amount} VIP loyalty points for ${user.name}! ${user.nextReward} voucher issued.`);
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-pink-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Customer Retention & VIP Rewards
            </span>
            <span className="text-xs text-pink-100 font-medium">
              Monthly Top 3 Customer Gift Combos
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Loyalty Rewards, Gift Combos & Reviews</h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-xl">
            Celebrate our top 3 monthly customers with dedicated gift prize hampers, track VIP loyalty tiers, and manage counter feedback.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-pink-100 uppercase font-black tracking-wider block">Customer Satisfaction</span>
          <div className="text-2xl font-black text-white font-mono mt-0.5 flex items-center justify-center gap-1">
            <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>4.9 / 5.0</span>
          </div>
          <span className="text-[10px] text-pink-100 font-bold block mt-0.5">
            42 Active Monthly Subscribers
          </span>
        </div>
      </div>

      {/* 2. TOP 3 MONTHLY WINNERS & EXCLUSIVE GIFT COMBOS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Top 3 Monthly Customers of the Month & Gift Prize Combos</span>
            </h3>
            <p className="text-xs text-slate-500">Rewarding our highest monthly spenders and prompt Attai card renewals with dairy gift hampers</p>
          </div>

          <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
            Monthly Prize Distribution 🎁
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {monthlyWinners.map((winner) => (
            <div
              key={winner.rank}
              className={`rounded-3xl border-2 p-6 shadow-sm flex flex-col justify-between space-y-4 transition bg-white hover:shadow-md ${winner.gradient}`}
            >
              <div className="space-y-3.5">
                
                {/* Medal Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                      {winner.medal}
                    </span>
                    <div>
                      <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full ${winner.badgeColor}`}>
                        {winner.rankTitle}
                      </span>
                      <h4 className="font-black text-base text-slate-900 mt-1">{winner.winnerName}</h4>
                      <span className="text-xs text-slate-500 font-mono font-medium">{winner.customerType}</span>
                    </div>
                  </div>
                </div>

                {/* Score Pill */}
                <div className="flex justify-between items-center p-2.5 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200 text-xs font-mono">
                  <span className="text-slate-600 font-bold">Monthly Points:</span>
                  <strong className="text-indigo-950 font-black">{winner.loyaltyPoints} Points ⭐</strong>
                </div>

                {/* Gift Combo Box */}
                <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-amber-300 space-y-2.5 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-amber-600" />
                      <span>Prize Combo:</span>
                    </span>
                    <strong className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {winner.comboValue}
                    </strong>
                  </div>

                  <div className="font-extrabold text-sm text-slate-900">
                    {winner.comboName}
                  </div>

                  {/* Combo Product Items List */}
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-100 text-xs">
                    {winner.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* WhatsApp Voucher Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleIssueGiftVoucher(winner)}
                  className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 ${
                    winner.voucherIssued
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-pink-600/20'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{winner.voucherIssued ? 'Voucher Dispatched via WhatsApp ✅' : 'Send Gift Voucher (WhatsApp) 🎁'}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 3. VIP Loyalty Ledger & Counter Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: VIP Points Ledger (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-600" />
                <span>Customer Loyalty Ledger</span>
              </h3>
              <p className="text-xs text-slate-500">Auto-calculated points balance per customer monthly spend</p>
            </div>
            <span className="text-xs font-mono font-bold text-pink-800 bg-pink-50 px-3 py-1 rounded-xl">
              Tier Ranking
            </span>
          </div>

          <div className="space-y-3">
            {loyaltyUsers.map(user => (
              <div key={user.id} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-pink-300 transition space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-900">{user.name}</h4>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        user.tier?.includes('Platinum') ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {user.tier || 'VIP Member'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{user.phone} • Total Spend: <strong>{user.spent}</strong></span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Reward Points</span>
                    <div className="text-lg font-black font-mono text-purple-900">{user.points} pts</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Eligible Reward: <strong>{user.nextReward}</strong></span>
                  <button
                    onClick={() => handleRedeemPoints(user, 100)}
                    disabled={user.points < 100}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white rounded-xl font-bold text-xs transition"
                  >
                    Redeem (100 pts)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Counter Customer Satisfaction Reviews (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Counter Customer Reviews</span>
              </h3>
              <p className="text-xs text-slate-500">Live verified buyer feedback from Kovilpatti</p>
            </div>
          </div>

          <div className="space-y-3">
            {feedback.map(item => (
              <div key={item.id} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs text-slate-900">{item.user}</span>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">"{item.comment}"</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">{item.tag}</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
