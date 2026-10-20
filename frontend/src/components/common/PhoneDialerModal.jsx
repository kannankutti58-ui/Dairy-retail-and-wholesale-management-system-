import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Delete, 
  Search, 
  Users, 
  Clock, 
  MessageSquare, 
  Smartphone, 
  X, 
  Plus, 
  Check, 
  Sparkles,
  Pause,
  Play,
  Grid
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

// 10 Real Agency Contacts
const AGENCY_CONTACTS = [
  {
    id: 'cnt-1',
    name: 'Thiru. R. Shanmugam (Aavin Feeder Head)',
    role: 'Aavin Central Feeder Head & Tender Officer',
    phone: '7604936341',
    category: 'Aavin Officer',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    avatar: '🏢',
    avatarBg: 'bg-blue-600',
    lastCall: 'Today 04:10 AM'
  },
  {
    id: 'cnt-2',
    name: 'M. Lakshmi (Card #ATT-101)',
    role: 'Monthly Attai Subscriber • Palayamkottai',
    phone: '7604936341',
    category: 'Attai Subscriber',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    avatar: '👩',
    avatarBg: 'bg-pink-600',
    lastCall: 'Today 05:42 AM'
  },
  {
    id: 'cnt-3',
    name: 'Murugan Tea Stall (B2B Wholesale)',
    role: 'Daily 35 Packets • Kovilpatti Bus Stand',
    phone: '7604936341',
    category: 'Wholesale B2B',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    avatar: '🏪',
    avatarBg: 'bg-amber-600',
    lastCall: 'Today 05:15 AM'
  },
  {
    id: 'cnt-4',
    name: 'Annapoorna Hotel & Sweets',
    role: 'Daily 40 Packets • Main Bazaar Route',
    phone: '7604936341',
    category: 'Wholesale B2B',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    avatar: '🍽️',
    avatarBg: 'bg-emerald-600',
    lastCall: 'Yesterday 06:30 PM'
  },
  {
    id: 'cnt-5',
    name: 'K. Priya (Card #ATT-102)',
    role: 'Monthly Attai Subscriber • NGO Colony',
    phone: '9842133003',
    category: 'Attai Subscriber',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    avatar: '👩‍💼',
    avatarBg: 'bg-purple-600',
    lastCall: 'Yesterday 07:15 PM'
  },
  {
    id: 'cnt-6',
    name: 'S. Venkatesh (Card #ATT-103)',
    role: 'Monthly Subscriber • Teacher Colony',
    phone: '9842166006',
    category: 'Attai Subscriber',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    avatar: '👨‍🏫',
    avatarBg: 'bg-cyan-600',
    lastCall: 'Yesterday 08:00 AM'
  },
  {
    id: 'cnt-7',
    name: 'V. Sundar (Retail Customer)',
    role: 'Delight Milk & Curd Inquiry',
    phone: '9842155005',
    category: 'Retail Customer',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    avatar: '👨',
    avatarBg: 'bg-sky-600',
    lastCall: 'Today 06:02 AM'
  },
  {
    id: 'cnt-8',
    name: 'Selvam (Route Van Driver)',
    role: 'Morning Delivery Route • Van TN-72-B-4412',
    phone: '9443299009',
    category: 'Logistics / Van',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    avatar: '🚚',
    avatarBg: 'bg-indigo-600',
    lastCall: 'Today 04:45 AM'
  },
  {
    id: 'cnt-9',
    name: 'Aavin Feeder Dairy Control Room',
    role: 'Tirunelveli Central Dairy Plant Dispatch Desk',
    phone: '9443112345',
    category: 'Aavin Feeder',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    avatar: '🥛',
    avatarBg: 'bg-blue-700',
    lastCall: 'Yesterday 09:30 PM'
  },
  {
    id: 'cnt-10',
    name: 'Kovilpatti Cold Storage Technician',
    role: 'Emergency Freezer & Chiller Maintenance Support',
    phone: '9842177007',
    category: 'Technical Support',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    avatar: '❄️',
    avatarBg: 'bg-rose-600',
    lastCall: '2 days ago'
  }
];

const RECENT_CALLS = [
  { id: 'rec-1', name: 'Thiru. R. Shanmugam', phone: '+91 94434 42471', type: 'incoming', time: 'Today 04:10 AM', duration: '2m 14s' },
  { id: 'rec-2', name: 'M. Lakshmi', phone: '+91 94434 42471', type: 'outgoing', time: 'Today 05:42 AM', duration: '1m 05s' },
  { id: 'rec-3', name: 'Selvam (Van Driver)', phone: '+91 94432 99009', type: 'outgoing', time: 'Today 04:45 AM', duration: '0m 45s' },
  { id: 'rec-4', name: 'Murugan Tea Stall', phone: '+91 94434 42471', type: 'missed', time: 'Yesterday 05:15 AM', duration: 'Missed' },
  { id: 'rec-5', name: 'Annapoorna Hotel', phone: '+91 94434 42471', type: 'incoming', time: 'Yesterday 06:30 PM', duration: '3m 20s' }
];

export const PhoneDialerModal = ({
  isOpen,
  onClose,
  recipientName = "Customer",
  phone = "9443442471"
}) => {
  const { showNotification } = useShop();

  // Navigation tab in phone: 'dialpad' | 'contacts' | 'recents'
  const [activeTab, setActiveTab] = useState('dialpad');
  
  // Dialpad state
  const [dialedDigits, setDialedDigits] = useState('');
  const [searchContact, setSearchContact] = useState('');
  
  // Active call state: 'idle' | 'calling' | 'connected' | 'ended'
  const [callState, setCallState] = useState('idle');
  const [activeCaller, setActiveCaller] = useState({ name: '', phone: '' });
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isOnHold, setIsOnHold] = useState(false);
  const [showInCallKeypad, setShowInCallKeypad] = useState(false);

  // Audio tone synthesizer for realistic dialpad and ringback
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (isOpen && phone) {
      const clean = (phone || '').replace(/[^0-9]/g, '');
      if (clean) {
        setDialedDigits(clean.slice(-10));
      }
    }
  }, [isOpen, phone]);

  useEffect(() => {
    let timer;
    if (callState === 'connected' && !isOnHold) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState, isOnHold]);

  if (!isOpen) return null;

  // Synthesize realistic DTMF dial tone
  const playTone = (freq1 = 697, freq2 = 1209) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freq1;
      osc2.frequency.value = freq2;

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio fallback silent
    }
  };

  const dialKeys = [
    { digit: '1', letters: '', freq: [697, 1209] },
    { digit: '2', letters: 'ABC', freq: [697, 1336] },
    { digit: '3', letters: 'DEF', freq: [697, 1477] },
    { digit: '4', letters: 'GHI', freq: [770, 1209] },
    { digit: '5', letters: 'JKL', freq: [770, 1336] },
    { digit: '6', letters: 'MNO', freq: [770, 1477] },
    { digit: '7', letters: 'PQRS', freq: [852, 1209] },
    { digit: '8', letters: 'TUV', freq: [852, 1336] },
    { digit: '9', letters: 'WXYZ', freq: [852, 1477] },
    { digit: '*', letters: '', freq: [941, 1209] },
    { digit: '0', letters: '+', freq: [941, 1336] },
    { digit: '#', letters: '', freq: [941, 1477] }
  ];

  const handleKeyPress = (key) => {
    playTone(key.freq[0], key.freq[1]);
    if (dialedDigits.length < 15) {
      setDialedDigits(prev => prev + key.digit);
    }
  };

  const handleBackspace = () => {
    setDialedDigits(prev => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    setDialedDigits('');
  };

  // Trigger call
  const startCall = (targetName = null, targetPhone = null) => {
    const rawNum = targetPhone || dialedDigits;
    if (!rawNum) {
      showNotification("Please enter a phone number or select a contact to call.", "warning");
      return;
    }
    const clean = rawNum.replace(/[^0-9]/g, '');
    const foundContact = AGENCY_CONTACTS.find(c => c.phone.includes(clean) || clean.includes(c.phone));
    
    const finalName = targetName || (foundContact ? foundContact.name : (recipientName || 'Aavin Contact'));
    const finalPhone = `+91 ${clean.slice(-10)}`;

    setActiveCaller({ name: finalName, phone: finalPhone });
    setCallState('calling');
    setCallDuration(0);
    setIsMuted(false);
    setIsOnHold(false);

    // Simulated network connection
    setTimeout(() => {
      setCallState('connected');
      showNotification(`Voice call connected with ${finalName} (${finalPhone})`);
    }, 1600);
  };

  const endCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
    }, 1000);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Match contact based on dialed digits
  const matchingContact = dialedDigits ? AGENCY_CONTACTS.find(c => c.phone.includes(dialedDigits)) : null;

  // Filter contacts in Contacts tab
  const filteredContacts = AGENCY_CONTACTS.filter(c => 
    c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
    c.phone.includes(searchContact) ||
    c.role.toLowerCase().includes(searchContact.toLowerCase()) ||
    c.category.toLowerCase().includes(searchContact.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-[36px] max-w-sm w-full text-white shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col h-[640px]">
        
        {/* Top Smartphone Status Bar */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-bold border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-1.5">
            <span>Aavin Jio 5G</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-center font-mono">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ACTIVE CALL SCREEN OVERLAY */}
        {callState !== 'idle' ? (
          <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-black animate-in fade-in duration-200">
            
            {/* Caller Info Header */}
            <div className="text-center pt-4 space-y-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-600/30 ring-4 ring-blue-500/20">
                {activeCaller.name.charAt(0)}
              </div>
              <h3 className="font-extrabold text-lg text-white pt-1">{activeCaller.name}</h3>
              <div className="font-mono text-xs text-slate-400 font-bold">{activeCaller.phone}</div>

              <div className="pt-2">
                {callState === 'calling' && (
                  <div className="text-xs font-bold text-blue-400 flex items-center justify-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span>Calling {activeCaller.name}...</span>
                  </div>
                )}
                {callState === 'connected' && (
                  <div className="space-y-2">
                    <div className="font-mono font-black text-sm text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-950/60 py-1 px-3 rounded-full border border-emerald-800/60 inline-flex mx-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>{isOnHold ? 'ON HOLD' : formatTimer(callDuration)}</span>
                    </div>

                    {/* Audio wave animation */}
                    {!isOnHold && (
                      <div className="flex items-center justify-center gap-1 pt-1">
                        <div className="w-1.5 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-6 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                        <div className="w-1.5 h-8 bg-emerald-300 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-5 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.3s]"></div>
                        <div className="w-1.5 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                )}
                {callState === 'ended' && (
                  <div className="text-xs font-bold text-rose-400">Call Ended</div>
                )}
              </div>
            </div>

            {/* In-Call Keypad (if toggled) */}
            {showInCallKeypad && callState === 'connected' && (
              <div className="bg-slate-800/80 p-3 rounded-3xl border border-slate-700 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {dialKeys.slice(0, 9).map(k => (
                    <button
                      key={k.digit}
                      type="button"
                      onClick={() => playTone(k.freq[0], k.freq[1])}
                      className="h-10 rounded-xl bg-slate-700/80 hover:bg-slate-600 font-bold text-sm text-white flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      {k.digit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* In-Call 6-Button Controls Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {/* Mute */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition cursor-pointer ${
                    isMuted ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800/80 text-white hover:bg-slate-700'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="text-[10px] font-bold">{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                {/* Keypad */}
                <button
                  type="button"
                  onClick={() => setShowInCallKeypad(!showInCallKeypad)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition cursor-pointer ${
                    showInCallKeypad ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800/80 text-white hover:bg-slate-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Keypad</span>
                </button>

                {/* Speaker */}
                <button
                  type="button"
                  onClick={() => setIsSpeaker(!isSpeaker)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition cursor-pointer ${
                    isSpeaker ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800/80 text-white hover:bg-slate-700'
                  }`}
                >
                  {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="text-[10px] font-bold">{isSpeaker ? 'Speaker' : 'Earpiece'}</span>
                </button>

                {/* Hold */}
                <button
                  type="button"
                  onClick={() => setIsOnHold(!isOnHold)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-1 transition cursor-pointer ${
                    isOnHold ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800/80 text-white hover:bg-slate-700'
                  }`}
                >
                  {isOnHold ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  <span className="text-[10px] font-bold">{isOnHold ? 'Resume' : 'Hold'}</span>
                </button>

                {/* WhatsApp Chat Shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    const clean = activeCaller.phone.replace(/[^0-9]/g, '');
                    window.open(`https://api.whatsapp.com/send?phone=91${clean}&text=Vanakkam!`, '_blank');
                  }}
                  className="p-3.5 rounded-2xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 flex flex-col items-center gap-1 transition cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-[10px] font-bold">WhatsApp</span>
                </button>

                {/* Direct SIM launcher */}
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `tel:${activeCaller.phone}`;
                  }}
                  className="p-3.5 rounded-2xl bg-slate-800/80 text-white hover:bg-slate-700 flex flex-col items-center gap-1 transition cursor-pointer"
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-[10px] font-bold">SIM Call</span>
                </button>
              </div>

              {/* Big Red End Call Button */}
              <button
                type="button"
                onClick={endCall}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-sm rounded-full shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </button>
            </div>

          </div>
        ) : (
          /* STANDARD PHONE UI: TABS (DIALPAD / CONTACTS / RECENTS) */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* VIEW 1: DIALPAD */}
            {activeTab === 'dialpad' && (
              <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
                
                {/* Number Display Top Box */}
                <div className="text-center py-2 min-h-[68px] flex flex-col justify-center">
                  <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest flex items-center justify-center gap-2">
                    <span>{dialedDigits || <span className="text-slate-600 text-lg font-sans">Dial a number...</span>}</span>
                    {dialedDigits && (
                      <button
                        type="button"
                        onClick={handleBackspace}
                        className="text-slate-400 hover:text-rose-400 p-1 transition cursor-pointer"
                      >
                        <Delete className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Auto-suggest matching contact */}
                  {matchingContact && (
                    <div 
                      onClick={() => startCall(matchingContact.name, matchingContact.phone)}
                      className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-bold cursor-pointer hover:bg-blue-900 mx-auto transition"
                    >
                      <span>{matchingContact.avatar}</span>
                      <span>{matchingContact.name}</span>
                      <span className="text-emerald-400 font-mono">({matchingContact.phone})</span>
                    </div>
                  )}
                </div>

                {/* Smartphone 12-Key Dialpad Grid */}
                <div className="grid grid-cols-3 gap-3 px-2 py-1 max-w-[280px] mx-auto w-full">
                  {dialKeys.map((k) => (
                    <button
                      key={k.digit}
                      type="button"
                      onClick={() => handleKeyPress(k)}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-blue-600 active:scale-95 transition-all flex flex-col items-center justify-center text-white shadow-md mx-auto cursor-pointer select-none"
                    >
                      <span className="text-xl sm:text-2xl font-black leading-none">{k.digit}</span>
                      {k.letters && (
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider leading-none mt-0.5">
                          {k.letters}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Green Call Action Button */}
                <div className="pt-2 pb-1 flex items-center justify-center gap-4">
                  {dialedDigits && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => startCall()}
                    className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all cursor-pointer ring-4 ring-emerald-500/20"
                    title="Call"
                  >
                    <Phone className="w-7 h-7 text-white fill-current" />
                  </button>

                  {dialedDigits && (
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://api.whatsapp.com/send?phone=91${dialedDigits}&text=Vanakkam!`, '_blank');
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                    >
                      WhatsApp
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* VIEW 2: 10 REAL CONTACTS DIRECTORY */}
            {activeTab === 'contacts' && (
              <div className="flex-1 p-4 flex flex-col space-y-3 overflow-hidden">
                
                {/* Search Header */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search 10 agency contacts..."
                    value={searchContact}
                    onChange={(e) => setSearchContact(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                {/* 10 Contacts List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/60">
                  {filteredContacts.map((cnt) => (
                    <div
                      key={cnt.id}
                      className="pt-2 pb-1.5 flex items-center justify-between gap-2.5 hover:bg-slate-800/40 p-2 rounded-2xl transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl ${cnt.avatarBg} text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-xs`}>
                          {cnt.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-white truncate">{cnt.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{cnt.role}</div>
                          <div className="text-[11px] font-mono font-bold text-blue-400">+91 {cnt.phone}</div>
                        </div>
                      </div>

                      {/* 1-Click Call & WhatsApp Action */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startCall(cnt.name, cnt.phone)}
                          className="p-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl transition cursor-pointer shadow-xs"
                          title={`Call ${cnt.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            window.open(`https://api.whatsapp.com/send?phone=91${cnt.phone}&text=Vanakkam ${encodeURIComponent(cnt.name)}!`, '_blank');
                          }}
                          className="p-2 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 rounded-xl transition cursor-pointer"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* VIEW 3: RECENT CALL HISTORY */}
            {activeTab === 'recents' && (
              <div className="flex-1 p-4 flex flex-col space-y-3 overflow-hidden">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="text-xs font-black uppercase text-slate-400">Recent Agency Calls</span>
                  <span className="text-[10px] text-slate-500 font-mono">Live Call Log</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {RECENT_CALLS.map((call) => (
                    <div
                      key={call.id}
                      onClick={() => startCall(call.name, call.phone)}
                      className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-2xl flex items-center justify-between transition cursor-pointer border border-slate-800/80"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="mt-0.5">
                          {call.type === 'incoming' && <PhoneIncoming className="w-4 h-4 text-emerald-400" />}
                          {call.type === 'outgoing' && <PhoneOutgoing className="w-4 h-4 text-blue-400" />}
                          {call.type === 'missed' && <PhoneMissed className="w-4 h-4 text-rose-400" />}
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-white">{call.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{call.time} • {call.duration}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-2 text-emerald-400 hover:text-emerald-300"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Smartphone Phone App Navigation Tabs */}
            <div className="grid grid-cols-3 bg-slate-950 p-2 border-t border-slate-800 text-xs font-bold">
              
              <button
                type="button"
                onClick={() => setActiveTab('recents')}
                className={`py-2 rounded-2xl flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTab === 'recents' ? 'text-blue-400 bg-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-[10px]">Recents</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dialpad')}
                className={`py-2 rounded-2xl flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTab === 'dialpad' ? 'text-emerald-400 bg-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-[10px]">Keypad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className={`py-2 rounded-2xl flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeTab === 'contacts' ? 'text-blue-400 bg-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-[10px]">Contacts (10)</span>
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
