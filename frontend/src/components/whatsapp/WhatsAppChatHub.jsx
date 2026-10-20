import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { MultiChannelShareModal } from '../common/MultiChannelShareModal';
import { GiftBrochureModal } from '../common/GiftBrochureModal';
import {
  MessageCircle,
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  CheckCheck,
  Clock,
  User,
  Store,
  Users,
  Building,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Receipt,
  FileText,
  Mail,
  Smartphone,
  ExternalLink,
  Share2,
  Gift
} from 'lucide-react';

export const WhatsAppChatHub = () => {
  const { 
    showNotification,
    whatsAppConversations,
    setWhatsAppConversations,
    selectedWhatsAppChatId,
    setSelectedWhatsAppChatId,
    sendMultiChannelCommunication,
    t
  } = useShop();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [waStatus, setWaStatus] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch WhatsApp Cloud API status from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/communication/whatsapp/status')
      .then(r => r.json())
      .then(d => {
        if (d?.data) setWaStatus(d.data);
      })
      .catch(() => {
        setWaStatus({ isConfigured: false, mode: 'DEVELOPMENT_FALLBACK' });
      });
  }, []);

  const conversations = whatsAppConversations || [];
  const activeChat = conversations.find(c => c.id === selectedWhatsAppChatId) || conversations[0] || {
    id: 'c1',
    name: 'M. Lakshmi (Attai Subscriber)',
    phone: '+91 98421 11001',
    avatar: '👩',
    avatarBg: 'bg-pink-100 text-pink-700',
    type: 'subscriber',
    badge: 'Card #ATT-101',
    status: 'online',
    unreadCount: 0,
    lastTime: 'Just now',
    messages: []
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat.messages, selectedWhatsAppChatId]);

  const filteredConversations = conversations.filter(c => {
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'unread' && c.unreadCount > 0) ||
      (activeFilter === 'subscribers' && c.type === 'subscriber') ||
      (activeFilter === 'wholesale' && c.type === 'wholesale') ||
      (activeFilter === 'officer' && c.type === 'officer');

    const matchesSearch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || '').includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const targetId = activeChat.id;
    const targetPhone = activeChat.phone;
    const messageContent = inputText.trim();

    // Call backend WhatsApp Cloud API asynchronously
    fetch('http://localhost:5000/api/communication/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: targetPhone,
        message: messageContent
      })
    }).catch(err => console.log('[WhatsApp Dispatch notice]:', err));

    setWhatsAppConversations(prev => prev.map(c => {
      if (c.id === targetId) {
        return {
          ...c,
          unreadCount: 0,
          lastTime: newMsg.time,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');
    showNotification(`Dispatched WhatsApp message to ${activeChat.name}!`);

    // Dynamic acknowledgment
    setTimeout(() => {
      setWhatsAppConversations(prev => prev.map(c => {
        if (c.id === targetId) {
          const autoReply = {
            id: `reply_${Date.now()}`,
            sender: 'customer',
            text: 'Thank you Kuttiammal Mam! Received your update. 👍',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return {
            ...c,
            lastTime: autoReply.time,
            messages: [...c.messages, autoReply]
          };
        }
        return c;
      }));
    }, 1200);
  };

  const handleQuickTemplate = (text) => {
    setInputText(text);
  };

  const formatMessageText = (text) => {
    if (!text) return '';
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i} className="font-black text-slate-900">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-emerald-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Live Messaging Hub
            </span>
            <span className="text-xs text-emerald-100 font-medium">
              Real-Time Customer WhatsApp Orders
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">WhatsApp Customer Chat & Orders</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100 mt-1">
            <span>WhatsApp Business Connected: <strong>+91 98421 55678</strong></span>
            <span>•</span>
            <span>Unread Order Requests: <strong>{conversations.reduce((sum, c) => sum + c.unreadCount, 0)} Messages</strong></span>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs shrink-0">
          <span className="text-[10px] text-emerald-100 uppercase font-black tracking-wider block">WhatsApp Status</span>
          <div className="text-xl font-black text-white font-mono mt-0.5 flex items-center justify-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>Active & Synced</span>
          </div>
          <span className="text-[10px] text-emerald-100 font-bold block mt-0.5">
            Auto-responder active
          </span>
        </div>
      </div>

      {/* 2. Main WhatsApp Window Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Pane: Chat List (5 Cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chats, customer or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none transition font-medium"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'subscribers', label: 'Attai Cards' },
                { id: 'wholesale', label: 'Wholesale' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition text-[11px] ${
                    activeFilter === f.id
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[560px]">
            {filteredConversations.map((chat) => {
              const isSelected = chat.id === activeChat.id;
              const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedWhatsAppChatId(chat.id);
                    setWhatsAppConversations(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
                  }}
                  className={`p-4 flex items-start space-x-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-100/70 bg-white'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-2xl ${chat.avatarBg || 'bg-slate-100 text-slate-800'} flex items-center justify-center text-xl shrink-0 shadow-2xs relative`}>
                    <span>{chat.avatar || '👤'}</span>
                    {chat.status === 'online' && (
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">
                        {chat.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                        {chat.lastTime}
                      </span>
                    </div>

                    <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                      {chat.badge || chat.type}
                    </span>

                    <p className="text-xs text-slate-500 truncate leading-snug font-medium">
                      {lastMsg ? lastMsg.text : 'No messages'}
                    </p>
                  </div>

                  {/* Unread Pill */}
                  {(chat.unreadCount || 0) > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono font-black text-[10px] flex items-center justify-center shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Pane: Active WhatsApp Chat Conversation (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#efeae2]/40">
          
          {/* Chat Window Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-2xl ${activeChat.avatarBg || 'bg-slate-100 text-slate-800'} flex items-center justify-center text-lg shadow-2xs`}>
                <span>{activeChat.avatar || '👤'}</span>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">{activeChat.name}</h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                  <span>{activeChat.phone}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{activeChat.status || 'online'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Direct Phone Call */}
              <button
                type="button"
                onClick={() => sendMultiChannelCommunication({ type: 'call', phone: activeChat.phone, recipientName: activeChat.name })}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-2xs"
                title={`Call ${activeChat.name} directly (${activeChat.phone})`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Call</span>
              </button>

              {/* Direct SMS */}
              <button
                type="button"
                onClick={() => sendMultiChannelCommunication({ type: 'sms', phone: activeChat.phone, text: `Hello ${activeChat.name}, update from Kuttiammal Dairy Hub!`, recipientName: activeChat.name })}
                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-2xs"
                title={`Send SMS to ${activeChat.phone}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SMS</span>
              </button>

              {/* Direct Email */}
              <button
                type="button"
                onClick={() => sendMultiChannelCommunication({ type: 'email', email: `customer.${activeChat.phone?.replace(/[^0-9]/g,'')}@gmail.com`, recipientName: activeChat.name, subject: `Aavin Dairy Update for ${activeChat.name}`, text: `Dear ${activeChat.name},\n\nThis is an official notice from Kuttiammal's Dairy Hub, Kovilpatti.` })}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-2xs"
                title="Send Email"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Email</span>
              </button>

              {/* Gift Brochure & Voucher Trigger */}
              <button
                type="button"
                onClick={() => setShowGiftModal(true)}
                className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
                title="Send Festive Gift Brochures & ₹100 Discount Vouchers"
              >
                <Gift className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Gift Brochure</span>
              </button>

              {/* MultiChannel Share Modal Launcher */}
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-2xs"
                title="Open Multi-Channel Share & Compose"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Messages Stream Viewport */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 max-h-[460px]">
            <div className="text-center my-2">
              <span className="bg-slate-200/90 text-slate-700 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                Live Omni-Channel Transcript
              </span>
            </div>

            {activeChat.messages && activeChat.messages.map((msg) => {
              const isMe = msg.sender === 'me';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-lg p-4 rounded-2xl shadow-xs text-xs space-y-1 relative ${
                      isMe
                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-emerald-200 shadow-2xs'
                        : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="leading-relaxed font-medium whitespace-pre-line text-slate-800 font-sans">
                      {formatMessageText(msg.text)}
                    </div>
                    <div className="flex items-center justify-end space-x-1 text-[10px] text-slate-400 font-mono pt-1">
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-sky-600" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Template Chips */}
          <div className="px-4 py-2 bg-white/95 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="font-bold text-slate-400 text-[10px] uppercase shrink-0">Quick Replies:</span>
            {[
              '✅ Order confirmed for morning counter pickup!',
              '🥛 Yes, Aavin Orange & Curd are in store cooling.',
              '🧾 Sent your digital pass & e-bill copy.',
              '🚚 Feeder delivery van is en route from Tirunelveli!'
            ].map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickTemplate(tmpl)}
                className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl text-slate-700 font-semibold whitespace-nowrap transition border border-slate-200"
              >
                {tmpl}
              </button>
            ))}
          </div>

          {/* Chat Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Type a reply to ${activeChat.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-100 border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition font-medium"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-2xl transition shadow-xs shrink-0 flex items-center gap-1.5 font-bold text-xs ${
                inputText.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>

        </div>

      </div>

      {/* MultiChannel Share Modal */}
      {showShareModal && (
        <MultiChannelShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`Message to ${activeChat.name}`}
          recipientName={activeChat.name}
          recipientPhone={activeChat.phone}
          recipientEmail={`customer.${activeChat.phone?.replace(/[^0-9]/g,'')}@gmail.com`}
          subject={`Aavin Milk Agency Update for ${activeChat.name}`}
          defaultMessage={inputText || `Hello ${activeChat.name},\n\nGreetings from Kuttiammal's Dairy Hub, Kovilpatti. Your milk quota and account is active.`}
        />
      )}

      {/* Gift Brochure & Festival Voucher Modal */}
      <GiftBrochureModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        targetPhone={activeChat.phone || "7604936341"}
      />

    </div>
  );
};
