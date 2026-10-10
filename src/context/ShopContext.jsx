import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MILK_PRODUCTS,
  CURD_PRODUCTS,
  DAIRY_PRODUCTS,
  FESTIVAL_SWEETS,
  WHOLESALE_CLIENTS,
  MONTHLY_BOOKLET_CUSTOMERS,
  HOME_DELIVERY_ROUTES,
  EVENT_BULK_ORDERS,
  SUPPLY_CHAIN_INFO,
  INITIAL_LEFTOVER_CURD_LOGS
} from '../data/initialMockData';
import { TRANSLATIONS, THEME_PRESETS } from '../data/translations';

export const INITIAL_WHATSAPP_CHATS = [
  {
    id: 'c1',
    name: 'M. Lakshmi (Attai Subscriber)',
    phone: '+91 98421 11001',
    avatar: '👩',
    avatarBg: 'bg-pink-100 text-pink-700',
    type: 'subscriber',
    badge: 'Card #ATT-101',
    status: 'online',
    unreadCount: 2,
    lastTime: '05:42 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Vanakkam Kuttiammal Mam! 🙏', time: '05:40 AM' },
      { id: 'm2', sender: 'customer', text: 'Today relatives are visiting our home in Palayamkottai. Can you please add 2 extra Orange Full Cream milk packets with my regular 2 Purple packets in morning 5:30 AM delivery?', time: '05:42 AM' }
    ]
  },
  {
    id: 'c2',
    name: 'Murugan Tea Stall (B2B Wholesale)',
    phone: '+91 98421 22002',
    avatar: '🏪',
    avatarBg: 'bg-amber-100 text-amber-800',
    type: 'wholesale',
    badge: 'B2B Client • 25 pkts/day',
    status: 'online',
    unreadCount: 1,
    lastTime: '05:15 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Good morning Mam. Today is festival pooja so our tea stall needs 35 packets Aavin Nice Blue instead of 25 pkts.', time: '05:12 AM' },
      { id: 'm2', sender: 'customer', text: 'Please send with the first morning delivery route van. Also please send yesterday ledger bill copy.', time: '05:15 AM' }
    ]
  },
  {
    id: 'c3',
    name: 'Thiru. R. Shanmugam (Aavin Tender Owner & Feeder Officer)',
    phone: '+91 94431 54321',
    avatar: '🏢',
    avatarBg: 'bg-blue-100 text-blue-800',
    type: 'officer',
    badge: 'Tirunelveli Central Feeder Dairy • Tender Head',
    status: 'online',
    unreadCount: 0,
    lastTime: '04:10 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Kuttiammal Agency, your morning indent (23 Crates / 550 pkts) has been dispatched on Vehicle TN-72-B-4412.', time: '04:05 AM' },
      { id: 'm2', sender: 'me', text: 'Received the shipment crates safely at 04:30 AM. Thank you Sir!', time: '04:10 AM' }
    ]
  },
  {
    id: 'c4',
    name: 'K. Priya (House #45)',
    phone: '+91 98421 33003',
    avatar: '👩‍💼',
    avatarBg: 'bg-purple-100 text-purple-700',
    type: 'subscriber',
    badge: 'Card #ATT-102',
    status: 'online',
    unreadCount: 0,
    lastTime: 'Yesterday',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Mam, is 1kg fresh homemade curd available for evening purchase?', time: 'Yesterday' },
      { id: 'm2', sender: 'me', text: 'Yes Priya Mam! Fresh batch cultured at 42°C is ready in store cooler. Kept 1 tub reserved for you.', time: 'Yesterday' }
    ]
  },
  {
    id: 'c5',
    name: 'Annapoorna Hotel & Sweets',
    phone: '+91 98421 44004',
    avatar: '🍽️',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    type: 'wholesale',
    badge: 'B2B Client • 40 pkts/day',
    status: 'last seen 10m ago',
    unreadCount: 0,
    lastTime: 'Yesterday',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Mam, we transferred ₹2,000 via Google Pay towards our weekly milk settlement. Please check.', time: 'Yesterday' },
      { id: 'm2', sender: 'me', text: 'Payment received and updated in your wholesale ledger! Current balance due: ₹450.', time: 'Yesterday' }
    ]
  },
  {
    id: 'c6',
    name: 'S. Venkatesh (Teacher Colony)',
    phone: '+91 98421 66006',
    avatar: '👨‍🏫',
    avatarBg: 'bg-cyan-100 text-cyan-800',
    type: 'subscriber',
    badge: 'Card #ATT-103',
    status: 'online',
    unreadCount: 0,
    lastTime: 'Yesterday',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Good morning Mam, I will come by 6:00 AM to collect my 1 packet Aavin Blue.', time: 'Yesterday' }
    ]
  },
  {
    id: 'c7',
    name: 'V. Sundar (New Customer)',
    phone: '+91 98421 55005',
    avatar: '👨',
    avatarBg: 'bg-sky-100 text-sky-700',
    type: 'retail',
    badge: 'Retail Inquiry',
    status: 'online',
    unreadCount: 1,
    lastTime: '06:02 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Hello, do you provide home delivery in NGO Colony? I want to take a 30-day monthly Attai card for Aavin Delight Purple.', time: '06:02 AM' }
    ]
  }
];

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Authentication & JWT State
  const [jwtToken, setJwtToken] = useState(() => {
    try {
      return localStorage.getItem('aavin_jwt_token') || '';
    } catch {
      return '';
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('aavin_is_authenticated');
      return savedAuth !== null ? JSON.parse(savedAuth) : false;
    } catch {
      return false;
    }
  });

  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aavin_logged_in_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Navigation & Recently Accessed Tracker
  const [activeTab, setActiveTabState] = useState('dashboard');
  const [recentTabs, setRecentTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_recent_tabs');
      return saved ? JSON.parse(saved) : [
        { id: 'dashboard', label: 'Live Dashboard', time: 'Just now' },
        { id: 'daily-sales', label: 'Daily Sales & POS', time: '5m ago' },
        { id: 'freezer-monitor', label: 'Freezer & Cold Storage', time: '12m ago' }
      ];
    } catch {
      return [
        { id: 'dashboard', label: 'Live Dashboard', time: 'Just now' },
        { id: 'daily-sales', label: 'Daily Sales & POS', time: '5m ago' }
      ];
    }
  });

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    setRecentTabs(prev => {
      const tabNames = {
        'dashboard': 'Live Dashboard',
        'daily-sales': 'Daily Sales & POS',
        'freezer-monitor': 'Freezer & Cold Storage',
        'whatsapp-chat': 'WhatsApp Communications',
        'stock-management': 'Stock & Products Catalog',
        'expiry-watch': 'Expiry & Freshness Watch',
        'order-prediction': "Tomorrow's Indent Plan",
        'smart-prediction': 'AI Smart Indent Engine',
        'festival-prediction': 'Festival Spike Predictor',
        'customer-management': 'Customers & Monthly Attai',
        'route-delivery': 'Delivery Routes & Van GPS',
        'loyalty-feedback': 'Loyalty & Feedback',
        'expenses': 'Shop Expense Book',
        'curd-production': 'Leftover Milk to Curd Unit',
        'bulk-orders': 'Events & Bulk Booking',
        'reports-analytics': 'Financial Analytics & P&L',
        'gst-reports': 'GST & Monthly Reports',
        'customer-portal': 'Client Milk Hub Portal',
        'settings': 'Agency Settings & Config'
      };
      const label = tabNames[tabId] || tabId;
      const filtered = prev.filter(t => t.id !== tabId);
      const updated = [{ id: tabId, label, time: 'Just now' }, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('aavin_recent_tabs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const [searchTerm, setSearchTerm] = useState('');

  // Real JWT & API Login Action
  const login = async (username, password) => {
    try {
      const cleanUser = (username || '').trim().toLowerCase();
      let response = null;

      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUser, password })
        });
        response = await res.json();
      } catch {
        response = null;
      }

      if (response && response.success) {
        setJwtToken(response.token);
        setIsAuthenticated(true);
        setLoggedInUser(response.user);

        try {
          localStorage.setItem('aavin_jwt_token', response.token);
          localStorage.setItem('aavin_is_authenticated', 'true');
          localStorage.setItem('aavin_logged_in_user', JSON.stringify(response.user));
        } catch {}

        if (response.user.role === 'client') {
          setActiveTab('customer-portal');
        } else {
          setActiveTab('dashboard');
        }

        showNotification(`Welcome back ${response.user.name}! Authenticated with JWT.`);
        return { success: true, user: response.user };
      }

      // Offline / In-Memory Mock JWT Fallback
      const mockAccounts = {
        'kuttiammal': { name: 'Kuttiammal M.', role: 'admin', phone: '9443442471', businessName: "Kuttiammal's Dairy Hub" },
        'shanmugam.aavin': { name: 'Thiru. R. Shanmugam', role: 'tender_officer', phone: '9443442471', businessName: 'Tirunelveli District Feeder Dairy' },
        'lakshmi.attai': { name: 'M. Lakshmi', role: 'client', phone: '9443442471', cardNumber: 'ATT-101', subscribedMilk: 'aavin-purple', quotaPackets: 2 },
        'murugan.tea': { name: 'M. Murugesan (Murugan Tea Stall)', role: 'b2b_wholesale', phone: '9443442471', businessName: 'Murugan Tea Stall', quotaPackets: 35 },
        'selvam.route': { name: 'S. Selvam (Route Driver)', role: 'driver', phone: '9443299009', routeAssigned: 'Route 1: Temple Street' }
      };

      const userProfile = mockAccounts[cleanUser] || {
        name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
        role: cleanUser.includes('attai') || cleanUser.includes('client') ? 'client' : 'admin',
        phone: '9443442471'
      };

      const mockToken = `mock-jwt-${cleanUser}-${Date.now()}`;
      setJwtToken(mockToken);
      setIsAuthenticated(true);
      setLoggedInUser({ username: cleanUser, ...userProfile });

      try {
        localStorage.setItem('aavin_jwt_token', mockToken);
        localStorage.setItem('aavin_is_authenticated', 'true');
        localStorage.setItem('aavin_logged_in_user', JSON.stringify({ username: cleanUser, ...userProfile }));
      } catch {}

      if (userProfile.role === 'client') {
        setActiveTab('customer-portal');
      } else {
        setActiveTab('dashboard');
      }

      showNotification(`Logged in as ${userProfile.name} (${userProfile.role})`);
      return { success: true, user: { username: cleanUser, ...userProfile } };
    } catch (err) {
      showNotification(`Login failed: ${err.message}`, 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
    setJwtToken('');
    setCurrentCustomerUser(null);
    try {
      localStorage.removeItem('aavin_is_authenticated');
      localStorage.removeItem('aavin_logged_in_user');
      localStorage.removeItem('aavin_jwt_token');
      localStorage.removeItem('aavin_customer_user');
    } catch {}
    showNotification("Logged out safely.");
  };

  const loginAsCustomer = (customerData) => {
    if (!customerData) return false;
    setIsAuthenticated(true);
    const userObj = {
      username: customerData.phone || customerData.cardNumber || 'lakshmi.attai',
      name: customerData.customerName || 'M. Lakshmi',
      role: 'client',
      customerDetails: customerData
    };
    setLoggedInUser(userObj);
    setCurrentCustomerUser(customerData);
    setActiveTab('customer-portal');

    try {
      localStorage.setItem('aavin_is_authenticated', 'true');
      localStorage.setItem('aavin_logged_in_user', JSON.stringify(userObj));
      localStorage.setItem('aavin_customer_user', JSON.stringify(customerData));
    } catch (e) {}

    showNotification(`🙏 Vanakkam ${customerData.customerName || 'Customer'}! Logged into Aavin Customer Portal.`);
    return true;
  };

  // Multilingual Localization State (Tamil, English, Tanglish, Hindi)
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return localStorage.getItem('aavin_language') || 'ta';
    } catch {
      return 'ta';
    }
  });

  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('aavin_language', lang);
    } catch {}
  };

  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    if (langDict && langDict[key]) return langDict[key];
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback || key;
  };

  // Google Account Integration & OAuth 2.0 State
  const [isGoogleConnected, setIsGoogleConnected] = useState(() => {
    try {
      return localStorage.getItem('aavin_google_connected') === 'true';
    } catch {
      return false;
    }
  });

  const [googleUser, setGoogleUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_google_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [googleClientId, setGoogleClientId] = useState(() => {
    try {
      return localStorage.getItem('aavin_google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    } catch {
      return '';
    }
  });

  const saveGoogleClientId = (clientId) => {
    setGoogleClientId(clientId);
    try {
      localStorage.setItem('aavin_google_client_id', clientId);
    } catch {}
  };

  const handleGoogleCredentialSuccess = async (credentialJwt, directPayload = null) => {
    try {
      let payload = directPayload;

      if (!payload && credentialJwt) {
        // Decode Google JWT Token
        const base64Url = credentialJwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        payload = JSON.parse(jsonPayload);
      }

      if (!payload) return;

      const profile = {
        name: payload.name || 'Google User',
        email: payload.email || 'kuttiammal.dairy@gmail.com',
        avatar: payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        connectedAt: new Date().toLocaleString(),
        service: 'Google OAuth 2.0 (Real ID Token)'
      };

      setIsGoogleConnected(true);
      setGoogleUser(profile);

      try {
        localStorage.setItem('aavin_google_connected', 'true');
        localStorage.setItem('aavin_google_user', JSON.stringify(profile));
      } catch {}

      // Generate verified JWT Token on backend & login user
      try {
        const res = await fetch('http://localhost:5000/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar
          })
        });
        const data = await res.json();

        if (data && data.success && data.token) {
          setJwtToken(data.token);
          setIsAuthenticated(true);
          setLoggedInUser(data.user);

          try {
            localStorage.setItem('aavin_jwt_token', data.token);
            localStorage.setItem('aavin_is_authenticated', 'true');
            localStorage.setItem('aavin_logged_in_user', JSON.stringify(data.user));
          } catch {}

          if (data.user.role === 'client' || data.user.role === 'customer') {
            setActiveTab('customer-portal');
          } else {
            setActiveTab('dashboard');
          }

          showNotification(`🎉 Authenticated with Google as ${profile.email}!`);
          return;
        }
      } catch {}

      // Fallback
      setIsAuthenticated(true);
      setLoggedInUser({
        username: profile.email.split('@')[0],
        name: profile.name,
        email: profile.email,
        role: profile.email.includes('lakshmi') ? 'client' : 'admin'
      });
      showNotification(`🎉 Logged in with Google Account (${profile.email})!`);
    } catch (err) {
      showNotification(`Google sign-in error: ${err.message}`, 'error');
    }
  };

  const connectGoogleAccount = (customEmail = null) => {
    handleGoogleCredentialSuccess(null, {
      email: customEmail || 'kuttiammal.dairy@gmail.com',
      name: 'Kuttiammal M.'
    });
  };

  const disconnectGoogleAccount = () => {
    setIsGoogleConnected(false);
    setGoogleUser(null);
    try {
      localStorage.removeItem('aavin_google_connected');
      localStorage.removeItem('aavin_google_user');
    } catch {}
    showNotification("Disconnected from Google Account.");
  };

  // Dynamic Theme State (Any color & dark mode)
  const [themeId, setThemeId] = useState(() => {
    try {
      return localStorage.getItem('aavin_theme_id') || 'blue';
    } catch {
      return 'blue';
    }
  });

  const [customThemeHex, setCustomThemeHex] = useState(() => {
    try {
      return localStorage.getItem('aavin_custom_theme_hex') || '#0284c7';
    } catch {
      return '#0284c7';
    }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('aavin_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const setThemeColor = (id, customHex = null) => {
    setThemeId(id);
    try {
      localStorage.setItem('aavin_theme_id', id);
    } catch {}

    if (id === 'custom' && customHex) {
      setCustomThemeHex(customHex);
      try {
        localStorage.setItem('aavin_custom_theme_hex', customHex);
      } catch {}
    } else if (id !== 'custom') {
      const preset = THEME_PRESETS.find(p => p.id === id);
      if (preset) {
        setCustomThemeHex(preset.primary);
        try {
          localStorage.setItem('aavin_custom_theme_hex', preset.primary);
        } catch {}
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('aavin_dark_mode', String(next));
      } catch {}
      return next;
    });
  };

  const getActiveThemeValues = () => {
    if (themeId === 'custom') {
      const hex = customThemeHex || '#0284c7';
      return {
        id: 'custom',
        name: 'Custom Theme',
        nameTamil: 'விருப்ப நிறம்',
        primary: hex,
        secondary: hex,
        gradient: `linear-gradient(135deg, ${hex} 0%, ${hex}cc 50%, #0f172a 100%)`,
        lightBg: `${hex}1a`,
        activeText: hex,
        border: hex
      };
    }
    const preset = THEME_PRESETS.find(p => p.id === themeId);
    return preset || THEME_PRESETS[0];
  };

  const activeTheme = getActiveThemeValues();

  // Dynamically set CSS variables across document
  useEffect(() => {
    const root = document.documentElement;
    const current = getActiveThemeValues();
    root.style.setProperty('--theme-primary', current.primary);
    root.style.setProperty('--theme-secondary', current.secondary);
    root.style.setProperty('--theme-gradient', current.gradient);
    root.style.setProperty('--theme-light-bg', current.lightBg);
    root.style.setProperty('--theme-border', current.border);

    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeId, customThemeHex, isDarkMode]);

  // Universal Multi-Channel Dispatch Helper
  const sendMultiChannelCommunication = ({ type = 'whatsapp', phone = '9443442471', email = '', recipientName = 'Customer', subject = '', text = '' }) => {
    const cleanPhone = (phone || '9443442471').replace(/[^0-9]/g, '');
    const cleanEmail = (email || '').trim();

    if (type === 'whatsapp') {
      const waUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    } else if (type === 'phone' || type === 'call') {
      window.location.href = `tel:+91${cleanPhone}`;
    } else if (type === 'email') {
      const mailUrl = `mailto:${cleanEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      window.location.href = mailUrl;
    } else if (type === 'sms') {
      const smsUrl = `sms:+91${cleanPhone}?body=${encodeURIComponent(text)}`;
      window.location.href = smsUrl;
    } else if (type === 'google') {
      connectGoogleAccount();
    }
  };

  // Shop & Configuration Settings
  const [shopSettings, setShopSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_shop_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          phone: "9443442471",
          tenderAgentPhone: "+91 94434 42471"
        };
      }
      return {
        shopName: "Kuttiammal's Dairy Hub",
        proprietor: "Kuttiammal M.",
        phone: "9443442471",
        email: "kuttiammal.dairy@aavin.tn.gov.in",
        address: "Main Road, Tirunelveli Supply Route, Tamil Nadu",
        opensAt: "5:00 AM",
        closesAt: "9:00 PM",
        wholesaleDiscountPerPacket: 2,
        advanceOrderCutoffTime: "10:00 PM",
        defaultBufferPercent: 0,
        tenderAgentName: "Thiru. R. Shanmugam",
        tenderAgentPhone: "+91 94434 42471",
        supplyDairyUnit: "Aavin Feeder Dairy, Reddiarpatti / Tirunelveli District Union",
        printerHeader: "KUTTIAMMAL'S DAIRY HUB - AAVIN AGENCY",
        printerFooterTamil: "நன்றி! மீண்டும் வருக! (Fresh Daily Tirunelveli Milk)",
        taxNumber: "GSTIN33AAACD1234A1Z5"
      };
    } catch {
      return {
        shopName: "Kuttiammal's Dairy Hub",
        proprietor: "Kuttiammal M.",
        phone: "9443442471",
        email: "kuttiammal.dairy@aavin.tn.gov.in",
        address: "Main Road, Tirunelveli Supply Route, Tamil Nadu",
        opensAt: "5:00 AM",
        closesAt: "9:00 PM",
        wholesaleDiscountPerPacket: 2,
        advanceOrderCutoffTime: "10:00 PM",
        defaultBufferPercent: 0,
        tenderAgentName: "Thiru. R. Shanmugam",
        tenderAgentPhone: "+91 94434 42471",
        supplyDairyUnit: "Aavin Feeder Dairy, Reddiarpatti / Tirunelveli District Union",
        printerHeader: "KUTTIAMMAL'S DAIRY HUB - AAVIN AGENCY",
        printerFooterTamil: "நன்றி! மீண்டும் வருக! (Fresh Daily Tirunelveli Milk)",
      };
    }
  });

  const shopInfo = {
    name: shopSettings.shopName || "Kuttiammal's Dairy Hub",
    proprietor: shopSettings.proprietor || "Kuttiammal M.",
    phone: shopSettings.phone || "9443442471",
    email: shopSettings.email || "kuttiammal.dairy@aavin.tn.gov.in",
    address: shopSettings.address || "Main Road, Tirunelveli Supply Route, Tamil Nadu",
    opensAt: shopSettings.opensAt || "5:00 AM",
    region: "Tirunelveli District",
    tagline: "Authorized Aavin Milk Agency"
  };

  // Core Data States
  const [milkProducts, setMilkProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_milk_products');
      return saved ? JSON.parse(saved) : MILK_PRODUCTS;
    } catch {
      return MILK_PRODUCTS;
    }
  });

  const [curdProducts, setCurdProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_curd_products');
      return saved ? JSON.parse(saved) : CURD_PRODUCTS;
    } catch {
      return CURD_PRODUCTS;
    }
  });

  const [dairyProducts, setDairyProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_dairy_products');
      return saved ? JSON.parse(saved) : DAIRY_PRODUCTS;
    } catch {
      return DAIRY_PRODUCTS;
    }
  });

  const [festivalSweets, setFestivalSweets] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_festival_sweets');
      return saved ? JSON.parse(saved) : FESTIVAL_SWEETS;
    } catch {
      return FESTIVAL_SWEETS;
    }
  });

  const [stockInwardLogs, setStockInwardLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_stock_inward_logs');
      return saved ? JSON.parse(saved) : [
        { id: 'IN-101', date: '2026-08-27', productName: 'Aavin Nice (Blue 500ml)', previousStock: 24, addedQty: 24, unit: 'packets', newStock: 48, time: '04:30 AM' },
        { id: 'IN-102', date: '2026-08-27', productName: 'Aavin Full Cream (Orange 500ml)', previousStock: 72, addedQty: 48, unit: 'packets', newStock: 120, time: '04:30 AM' },
        { id: 'IN-103', date: '2026-08-26', productName: 'Aavin Pure Ghee (Jar 500ml)', previousStock: 10, addedQty: 15, unit: 'bottles', newStock: 25, time: '09:00 AM' }
      ];
    } catch {
      return [];
    }
  });

  const [wholesaleClients, setWholesaleClients] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_wholesale_clients');
      return saved ? JSON.parse(saved) : WHOLESALE_CLIENTS;
    } catch {
      return WHOLESALE_CLIENTS;
    }
  });

  const [bookletCustomers, setBookletCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_booklet_customers');
      return saved ? JSON.parse(saved) : MONTHLY_BOOKLET_CUSTOMERS;
    } catch {
      return MONTHLY_BOOKLET_CUSTOMERS;
    }
  });

  const [deliveryRoutes, setDeliveryRoutes] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_delivery_routes');
      return saved ? JSON.parse(saved) : HOME_DELIVERY_ROUTES;
    } catch {
      return HOME_DELIVERY_ROUTES;
    }
  });

  const [eventOrders, setEventOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_event_orders');
      return saved ? JSON.parse(saved) : EVENT_BULK_ORDERS;
    } catch {
      return EVENT_BULK_ORDERS;
    }
  });

  const [curdConversionLogs, setCurdConversionLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_curd_logs');
      return saved ? JSON.parse(saved) : INITIAL_LEFTOVER_CURD_LOGS;
    } catch {
      return INITIAL_LEFTOVER_CURD_LOGS;
    }
  });

  const [supplyChain, setSupplyChain] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_supply_chain');
      return saved ? JSON.parse(saved) : SUPPLY_CHAIN_INFO;
    } catch {
      return SUPPLY_CHAIN_INFO;
    }
  });

  // Daily Financials & Transactions
  const [dailySales, setDailySales] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_daily_sales');
      return saved ? JSON.parse(saved) : [
        { id: 'TX-88201', time: '05:08 AM', customer: 'Walk-in Retail Customer', items: '2x Aavin Purple', amount: 48, paymentMethod: 'Cash', type: 'retail' },
        { id: 'TX-88202', time: '05:14 AM', customer: 'Murugan Tea Stall', items: '24x Aavin Orange', amount: 672, paymentMethod: 'Credit Ledger', type: 'wholesale' },
        { id: 'TX-88203', time: '05:22 AM', customer: 'Walk-in Retail Customer', items: '1x Aavin Blue, 1x Curd Pouch', amount: 57, paymentMethod: 'UPI / GPay', type: 'retail' },
        { id: 'TX-88204', time: '05:40 AM', customer: 'Sri Krishna Bakery', items: '36x Aavin Orange', amount: 1008, paymentMethod: 'UPI / GPay', type: 'wholesale' },
        { id: 'TX-88205', time: '06:10 AM', customer: 'Walk-in Retail Customer', items: '1x Aavin Ghee 500ml, 1x Mysore Pak', amount: 490, paymentMethod: 'Cash', type: 'retail' }
      ];
    } catch {
      return [];
    }
  });

  // Advance Orders
  const [advanceOrdersHistory, setAdvanceOrdersHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_advance_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'adv-2026-08-27',
          dateForTomorrow: '2026-08-28',
          submittedAt: '02:30 PM Today',
          supplier: 'Tirunelveli Central Dairy (Tender: R. Shanmugam)',
          items: {
            'aavin-blue': { packets: 48, crates: 2, costPerPkt: 18, totalCost: 864 },
            'aavin-purple': { packets: 168, crates: 7, costPerPkt: 20, totalCost: 3360 },
            'aavin-orange': { packets: 144, crates: 6, costPerPkt: 25, totalCost: 3600 },
            'heritage-daily': { packets: 24, crates: 1, costPerPkt: 21, totalCost: 504 }
          },
          totalPackets: 384,
          totalCrates: 16,
          totalLiters: 192,
          estimatedSupplyCost: 8328,
          status: 'Transmitted to Dairy'
        }
      ];
    } catch {
      return [];
    }
  });

  // WhatsApp Hub State
  const [whatsAppConversations, setWhatsAppConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_whatsapp_chats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure officer Shanmugam c3 is present
          const hasOfficer = parsed.some(c => c.id === 'c3' || (c.phone && c.phone.includes('94431')));
          if (!hasOfficer) {
            return [...parsed, INITIAL_WHATSAPP_CHATS[2]];
          }
          return parsed.map(c => {
            if (c.id === 'c3' || (c.phone && c.phone.includes('94431'))) {
              return {
                ...c,
                name: 'Thiru. R. Shanmugam (Aavin Tender Owner & Feeder Officer)',
                type: 'officer',
                badge: 'Tirunelveli Central Feeder Dairy • Tender Head'
              };
            }
            return c;
          });
        }
      }
      return INITIAL_WHATSAPP_CHATS;
    } catch {
      return INITIAL_WHATSAPP_CHATS;
    }
  });

  const [selectedWhatsAppChatId, setSelectedWhatsAppChatId] = useState('c3');

  // Toast Notification
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('aavin_is_authenticated', JSON.stringify(isAuthenticated));
      localStorage.setItem('aavin_logged_in_user', JSON.stringify(loggedInUser));
      localStorage.setItem('aavin_shop_settings', JSON.stringify(shopSettings));
      localStorage.setItem('aavin_milk_products', JSON.stringify(milkProducts));
      localStorage.setItem('aavin_curd_products', JSON.stringify(curdProducts));
      localStorage.setItem('aavin_dairy_products', JSON.stringify(dairyProducts));
      localStorage.setItem('aavin_festival_sweets', JSON.stringify(festivalSweets));
      localStorage.setItem('aavin_stock_inward_logs', JSON.stringify(stockInwardLogs));
      localStorage.setItem('aavin_wholesale_clients', JSON.stringify(wholesaleClients));
      localStorage.setItem('aavin_booklet_customers', JSON.stringify(bookletCustomers));
      localStorage.setItem('aavin_delivery_routes', JSON.stringify(deliveryRoutes));
      localStorage.setItem('aavin_event_orders', JSON.stringify(eventOrders));
      localStorage.setItem('aavin_curd_logs', JSON.stringify(curdConversionLogs));
      localStorage.setItem('aavin_supply_chain', JSON.stringify(supplyChain));
      localStorage.setItem('aavin_daily_sales', JSON.stringify(dailySales));
      localStorage.setItem('aavin_advance_orders', JSON.stringify(advanceOrdersHistory));
      localStorage.setItem('aavin_whatsapp_chats', JSON.stringify(whatsAppConversations));
    } catch {
      // ignore storage sync errors
    }
  }, [
    isAuthenticated, loggedInUser, shopSettings,
    milkProducts, curdProducts, dairyProducts, festivalSweets,
    stockInwardLogs, wholesaleClients, bookletCustomers, deliveryRoutes,
    eventOrders, curdConversionLogs, supplyChain, dailySales, advanceOrdersHistory,
    whatsAppConversations
  ]);

  // Customer Portal User State
  const [currentCustomerUser, setCurrentCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aavin_customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const updateShopSettings = (newSettings) => {
    setShopSettings(prev => ({ ...prev, ...newSettings }));
    showNotification('Settings updated successfully');
  };

  const todayTotalRevenue = dailySales.reduce((sum, item) => sum + item.amount, 0);
  const todayCashUPIRevenue = dailySales
    .filter(item => item.paymentMethod !== 'Credit Ledger')
    .reduce((sum, item) => sum + item.amount, 0);

  const calculateTomorrowAdvanceRequirement = () => {
    let bookletBlue = 0;
    let bookletPurple = 0;
    let bookletOrange = 0;
    bookletCustomers.forEach(cust => {
      if (cust.subscribedMilk === 'aavin-blue') bookletBlue += cust.packetQuantity;
      if (cust.subscribedMilk === 'aavin-purple') bookletPurple += cust.packetQuantity;
      if (cust.subscribedMilk === 'aavin-orange') bookletOrange += cust.packetQuantity;
    });

    let wholesaleOrange = 0;
    let wholesalePurple = 0;
    wholesaleClients.forEach(ws => {
      if (ws.preferredMilk === 'aavin-orange') wholesaleOrange += ws.dailyQuotaPackets;
      if (ws.preferredMilk === 'aavin-purple') wholesalePurple += ws.dailyQuotaPackets;
    });

    let deliveryBlue = 0;
    let deliveryPurple = 0;
    let deliveryOrange = 0;
    deliveryRoutes.forEach(r => {
      r.houses.forEach(h => {
        if (h.milkType === 'aavin-blue') deliveryBlue += h.qty;
        if (h.milkType === 'aavin-purple') deliveryPurple += h.qty;
        if (h.milkType === 'aavin-orange') deliveryOrange += h.qty;
      });
    });

    let eventPurple = 0;
    let eventOrange = 0;
    eventOrders.forEach(evt => {
      if (evt.date && (evt.date.includes('Tomorrow') || evt.date.includes('2026-08-28') || evt.date.includes('2026-08-27'))) {
        evt.items.forEach(it => {
          if (it.type === 'aavin-purple') eventPurple += it.qtyPackets;
          if (it.type === 'aavin-orange') eventOrange += it.qtyPackets;
        });
      }
    });

    const retailBufferBlue = 20;
    const retailBufferPurple = 30;
    const retailBufferOrange = 24;
    const retailBufferCurd = 24; // 1 crate (24 pouches / 12L)

    const totalBluePackets = bookletBlue + deliveryBlue + retailBufferBlue;
    const totalPurplePackets = bookletPurple + wholesalePurple + deliveryPurple + eventPurple + retailBufferPurple;
    const totalOrangePackets = bookletOrange + wholesaleOrange + deliveryOrange + eventOrange + retailBufferOrange;
    const totalCurdPackets = retailBufferCurd;

    const cratesBlue = Math.ceil(totalBluePackets / 24);
    const cratesPurple = Math.ceil(totalPurplePackets / 24);
    const cratesOrange = Math.ceil(totalOrangePackets / 24);
    const cratesCurd = Math.ceil(totalCurdPackets / 24);

    const costRateBlue = 18;
    const costRatePurple = 20;
    const costRateOrange = 25;
    const costRateCurd = 28;

    const roundedPacketsBlue = cratesBlue * 24;
    const roundedPacketsPurple = cratesPurple * 24;
    const roundedPacketsOrange = cratesOrange * 24;
    const roundedPacketsCurd = cratesCurd * 24;

    const totalEstimatedCost = 
      (roundedPacketsBlue * costRateBlue) +
      (roundedPacketsPurple * costRatePurple) +
      (roundedPacketsOrange * costRateOrange) +
      (roundedPacketsCurd * costRateCurd);

    return {
      blue: { packets: roundedPacketsBlue, crates: cratesBlue, liters: roundedPacketsBlue * 0.5, costRate: costRateBlue, cost: roundedPacketsBlue * costRateBlue, breakdown: { booklet: bookletBlue, delivery: deliveryBlue, retail: retailBufferBlue } },
      purple: { packets: roundedPacketsPurple, crates: cratesPurple, liters: roundedPacketsPurple * 0.5, costRate: costRatePurple, cost: roundedPacketsPurple * costRatePurple, breakdown: { booklet: bookletPurple, wholesale: wholesalePurple, delivery: deliveryPurple, event: eventPurple, retail: retailBufferPurple } },
      orange: { packets: roundedPacketsOrange, crates: cratesOrange, liters: roundedPacketsOrange * 0.5, costRate: costRateOrange, cost: roundedPacketsOrange * costRateOrange, breakdown: { booklet: bookletOrange, wholesale: wholesaleOrange, delivery: deliveryOrange, event: eventOrange, retail: retailBufferOrange } },
      curd: { packets: roundedPacketsCurd, crates: cratesCurd, liters: roundedPacketsCurd * 0.5, costRate: costRateCurd, cost: roundedPacketsCurd * costRateCurd, breakdown: { retail: retailBufferCurd } },
      totalCrates: cratesBlue + cratesPurple + cratesOrange + cratesCurd,
      totalPackets: roundedPacketsBlue + roundedPacketsPurple + roundedPacketsOrange + roundedPacketsCurd,
      totalLiters: (roundedPacketsBlue + roundedPacketsPurple + roundedPacketsOrange + roundedPacketsCurd) * 0.5,
      totalCost: totalEstimatedCost,
      workingCapitalSurplus: todayCashUPIRevenue - totalEstimatedCost
    };
  };

  // Add stock to any product with Date and Quantity
  const addStockToProduct = ({ productId, quantityToAdd, entryDate, unit = 'units' }) => {
    const qty = Number(quantityToAdd);
    if (!qty || qty <= 0) return { success: false };

    let productName = '';
    let previousStock = 0;
    let newStock = 0;

    // Check milk products
    if (milkProducts.some(m => m.id === productId)) {
      setMilkProducts(prev => prev.map(m => {
        if (m.id === productId) {
          productName = m.name;
          previousStock = m.currentStock;
          newStock = previousStock + qty;
          return { ...m, currentStock: newStock };
        }
        return m;
      }));
    } else if (curdProducts.some(c => c.id === productId)) {
      setCurdProducts(prev => prev.map(c => {
        if (c.id === productId) {
          productName = c.name;
          previousStock = c.currentStock;
          newStock = previousStock + qty;
          return { ...c, currentStock: newStock };
        }
        return c;
      }));
    } else if (festivalSweets.some(s => s.id === productId)) {
      setFestivalSweets(prev => prev.map(s => {
        if (s.id === productId) {
          productName = s.name;
          previousStock = s.stock || 0;
          newStock = previousStock + qty;
          return { ...s, stock: newStock };
        }
        return s;
      }));
    } else {
      setDairyProducts(prev => prev.map(d => {
        if (d.id === productId) {
          productName = d.name;
          previousStock = d.stock || 0;
          newStock = previousStock + qty;
          return { ...d, stock: newStock };
        }
        return d;
      }));
    }

    const newLog = {
      id: `IN-${Date.now().toString().slice(-4)}`,
      date: entryDate || new Date().toISOString().split('T')[0],
      productName: productName || productId,
      productId,
      previousStock,
      addedQty: qty,
      unit,
      newStock,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setStockInwardLogs(prev => [newLog, ...prev]);
    showNotification(`Stock Refill: Added ${qty} ${unit} to ${productName}. Current: ${previousStock} ➔ New Total: ${newStock}`);
    return { success: true, productName, previousStock, addedQty: qty, newStock };
  };

  const recordPOSTransaction = (transaction) => {
    setDailySales(prev => [transaction, ...prev]);

    if (transaction.itemsList && Array.isArray(transaction.itemsList)) {
      transaction.itemsList.forEach(cartItem => {
        if (cartItem.productId.startsWith('aavin-') || cartItem.productId.startsWith('heritage-')) {
          setMilkProducts(prev => prev.map(m => m.id === cartItem.productId ? { ...m, currentStock: Math.max(0, m.currentStock - cartItem.quantity) } : m));
        } else if (cartItem.productId.includes('curd')) {
          setCurdProducts(prev => prev.map(c => c.id === cartItem.productId ? { ...c, currentStock: Math.max(0, c.currentStock - cartItem.quantity) } : c));
        } else if (cartItem.productId.includes('sweet')) {
          setFestivalSweets(prev => prev.map(s => s.id === cartItem.productId ? { ...s, stock: Math.max(0, s.stock - cartItem.quantity) } : s));
        } else {
          setDairyProducts(prev => prev.map(d => d.id === cartItem.productId ? { ...d, stock: Math.max(0, d.stock - cartItem.quantity) } : d));
        }
      });
    }

    showNotification(`Sale recorded: ₹${transaction.amount}`);
  };

  const punchBookletDaily = (customerId, dayNumber = 27) => {
    setBookletCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const isAlreadyPunched = c.punchedDays.includes(dayNumber);
        const newPunchedDays = isAlreadyPunched
          ? c.punchedDays.filter(d => d !== dayNumber)
          : [...c.punchedDays, dayNumber].sort((a, b) => a - b);
        
        const todayCollected = newPunchedDays.includes(27);
        return { ...c, punchedDays: newPunchedDays, todayCollected };
      }
      return c;
    }));
    showNotification(`Monthly card punch updated`);
  };

  const convertLeftoverMilkToCurd = ({ leftoverPackets, starterCultureTime = '09:30 PM', milkVariety = 'aavin-orange' }) => {
    const litersConverted = leftoverPackets * 0.5;
    const kgCurdProduced = litersConverted;
    const wastePreventedValue = litersConverted * 60;

    const newLog = {
      id: `curd-log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      leftoverMilkPackets: leftoverPackets,
      convertedToCurdKg: kgCurdProduced,
      starterCultureAddedAt: starterCultureTime,
      readyByTime: '05:00 AM (Next Morning)',
      batchQuality: 'Thick Homemade Fresh Curd',
      sellingPricePerKg: 60,
      status: 'Fermenting overnight for 5:00 AM opening',
      wastePreventedValue
    };

    setCurdConversionLogs(prev => [newLog, ...prev]);
    setMilkProducts(prev => prev.map(m => m.id === milkVariety ? { ...m, currentStock: Math.max(0, m.currentStock - leftoverPackets) } : m));
    setCurdProducts(prev => prev.map(c => c.id === 'homemade-fresh-curd' ? { ...c, currentStock: c.currentStock + kgCurdProduced } : c));

    showNotification(`Converted ${leftoverPackets} packets (${litersConverted}L) unsold milk to fresh curd`);
  };

  const submitAdvanceOrderToDairy = (orderDetails) => {
    const newOrder = {
      id: `adv-${Date.now()}`,
      dateForTomorrow: orderDetails.dateForTomorrow || '2026-08-28',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      supplier: supplyChain.tenderAgentName + ' (Tirunelveli)',
      items: orderDetails.items,
      totalPackets: orderDetails.totalPackets,
      totalCrates: orderDetails.totalCrates,
      totalLiters: orderDetails.totalLiters,
      estimatedSupplyCost: orderDetails.totalCost,
      status: 'Transmitted to Tender Head'
    };

    setAdvanceOrdersHistory(prev => [newOrder, ...prev]);
    showNotification(`Advance order of ${orderDetails.totalCrates} crates sent to Tirunelveli Tender Agent`);
  };

  const updateDeliveryStatus = (routeId, houseId, newStatus) => {
    setDeliveryRoutes(prev => prev.map(route => {
      if (route.routeId === routeId) {
        return {
          ...route,
          houses: route.houses.map(h => h.id === houseId ? { ...h, status: newStatus } : h)
        };
      }
      return route;
    }));
    showNotification(`Delivery status updated: ${newStatus}`);
  };

  const recordWholesalePayment = (clientId, amount) => {
    setWholesaleClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          pendingBalance: Math.max(0, client.pendingBalance - amount),
          lastPaymentDate: '2026-08-27'
        };
      }
      return client;
    }));

    setDailySales(prev => [
      {
        id: `ws-pay-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customer: wholesaleClients.find(c => c.id === clientId)?.businessName || 'Wholesale Client',
        items: 'Ledger Credit Settlement',
        amount: Number(amount),
        paymentMethod: 'Cash / UPI Settlement',
        type: 'wholesale-settlement'
      },
      ...prev
    ]);

    showNotification(`Payment of ₹${amount} recorded`);
  };

  const addNewBookletCustomer = (newCustomer) => {
    const id = `card-${100 + bookletCustomers.length + 1}`;
    const cardObj = {
      id,
      cardNumber: `AVN-2026-${100 + bookletCustomers.length + 1}`,
      customerName: newCustomer.customerName,
      phone: newCustomer.phone,
      address: newCustomer.address,
      subscribedMilk: newCustomer.subscribedMilk,
      packetQuantity: Number(newCustomer.packetQuantity),
      monthlyPaidAmount: Number(newCustomer.monthlyPaidAmount),
      month: 'August 2026',
      startDate: '2026-08-01',
      validTill: '2026-08-31',
      punchedDays: [],
      todayCollected: false,
      totalDaysInMonth: 31
    };
    setBookletCustomers(prev => [...prev, cardObj]);
    showNotification(`Monthly Card issued for ${newCustomer.customerName}`);
  };

  const addNewEventOrder = (eventData) => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      eventName: eventData.eventName,
      contactPerson: eventData.contactPerson,
      phone: eventData.phone,
      date: eventData.date,
      eventTime: eventData.eventTime || '05:30 AM',
      items: eventData.items,
      status: 'Confirmed & Advance Recorded',
      advanceReceived: Number(eventData.advanceReceived || 0),
      balanceDue: Number(eventData.totalAmount - (eventData.advanceReceived || 0))
    };
    setEventOrders(prev => [newEvent, ...prev]);
    showNotification(`Bulk event booking saved`);
  };

  const triggerNightDeliveryTruckArrival = () => {
    setSupplyChain(prev => ({
      ...prev,
      status: 'Truck Arrived at Shop! Fresh Morning Stock Received',
      expectedNightArrival: 'Arrived at 04:05 AM'
    }));
    setMilkProducts(prev => prev.map(m => {
      if (m.id === 'aavin-blue') return { ...m, currentStock: m.currentStock + 48 };
      if (m.id === 'aavin-purple') return { ...m, currentStock: m.currentStock + 72 };
      if (m.id === 'aavin-orange') return { ...m, currentStock: m.currentStock + 120 };
      if (m.id === 'heritage-daily') return { ...m, currentStock: m.currentStock + 24 };
      return m;
    }));
    showNotification('Fresh milk supply received from Tirunelveli Dairy');
  };

  const sendWhatsAppMessage = ({
    chatId,
    recipientPhone,
    recipientName = 'Customer',
    text,
    recipientType = 'subscriber',
    badge = '',
    avatar = '👤',
    avatarBg = 'bg-slate-100 text-slate-700',
    sender = 'me',
    navigate = true
  }) => {
    const cleanPhone = (recipientPhone || '').replace(/[^0-9]/g, '');
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = `m_${Date.now()}`;

    // 1. Determine targetChatId synchronously BEFORE updating state
    let targetChatId = chatId;

    if (!targetChatId) {
      if (recipientType === 'officer' || (recipientName && recipientName.toLowerCase().includes('shanmugam'))) {
        targetChatId = 'c3';
      } else {
        const found = (whatsAppConversations || []).find(c => {
          const cClean = (c.phone || '').replace(/[^0-9]/g, '');
          const phoneMatch = cleanPhone && cClean && (cClean.includes(cleanPhone) || cleanPhone.includes(cClean));
          const nameMatch = recipientName && (c.name || '').toLowerCase().includes(recipientName.toLowerCase().split(' ')[0]);
          return phoneMatch || nameMatch;
        });
        targetChatId = found ? found.id : `c_${Date.now()}`;
      }
    }

    const newMsg = {
      id: msgId,
      sender,
      text,
      time: nowTime
    };

    setWhatsAppConversations(prev => {
      const foundIndex = prev.findIndex(c => c.id === targetChatId);
      let updatedList = [...prev];

      if (foundIndex >= 0) {
        const targetChat = updatedList[foundIndex];
        updatedList[foundIndex] = {
          ...targetChat,
          name: recipientType === 'officer' ? 'Thiru. R. Shanmugam (Aavin Tender Owner & Feeder Officer)' : targetChat.name,
          phone: recipientPhone || targetChat.phone,
          lastTime: nowTime,
          unreadCount: sender === 'customer' ? (targetChat.unreadCount || 0) + 1 : 0,
          messages: [...targetChat.messages, newMsg]
        };
      } else {
        const newChat = {
          id: targetChatId,
          name: recipientName,
          phone: recipientPhone || '+91 94431 54321',
          avatar,
          avatarBg,
          type: recipientType,
          badge: badge || (recipientType === 'officer' ? 'Tirunelveli Central Feeder Dairy • Tender Head' : 'Customer'),
          status: 'online',
          unreadCount: sender === 'customer' ? 1 : 0,
          lastTime: nowTime,
          messages: [newMsg]
        };
        updatedList = [newChat, ...updatedList];
      }

      try {
        localStorage.setItem('aavin_whatsapp_chats', JSON.stringify(updatedList));
      } catch (e) {}

      return updatedList;
    });

    // Directly set selected chat ID so the UI opens the Tender Owner's chat immediately!
    setSelectedWhatsAppChatId(targetChatId);

    if (navigate) {
      setActiveTab('whatsapp-chat');
    }

    showNotification(`💬 Message dispatched to ${recipientName} in WhatsApp Hub!`);

    if (sender === 'me') {
      setTimeout(() => {
        setWhatsAppConversations(prev => {
          return prev.map(c => {
            if (c.id === targetChatId) {
              const replyText = recipientType === 'officer'
                ? `Vanakkam Kuttiammal Agency! Tomorrow's indent received and scheduled for 10:45 PM night route vehicle TN-72-B-4412. All crates confirmed. 👍`
                : `Vanakkam Kuttiammal Mam! Received your update & details. Thank you! 🙏`;

              const replyMsg = {
                id: `reply_${Date.now()}`,
                sender: 'customer',
                text: replyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              return {
                ...c,
                lastTime: replyMsg.time,
                messages: [...c.messages, replyMsg]
              };
            }
            return c;
          });
        });
      }, 1200);
    }
  };

  return (
    <ShopContext.Provider value={{
      isAuthenticated,
      loggedInUser,
      jwtToken,
      login,
      logout,
      recentTabs,
      shopInfo,
      shopSettings,
      updateShopSettings,
      activeTab,
      setActiveTab,
      searchTerm,
      setSearchTerm,
      milkProducts,
      curdProducts,
      dairyProducts,
      festivalSweets,
      stockInwardLogs,
      addStockToProduct,
      wholesaleClients,
      bookletCustomers,
      deliveryRoutes,
      eventOrders,
      curdConversionLogs,
      supplyChain,
      dailySales,
      advanceOrdersHistory,
      whatsAppConversations,
      setWhatsAppConversations,
      selectedWhatsAppChatId,
      setSelectedWhatsAppChatId,
      sendWhatsAppMessage,
      notification,
      todayTotalRevenue,
      todayCashUPIRevenue,
      calculateTomorrowAdvanceRequirement,
      recordPOSTransaction,
      punchBookletDaily,
      convertLeftoverMilkToCurd,
      submitAdvanceOrderToDairy,
      updateDeliveryStatus,
      recordWholesalePayment,
      addNewBookletCustomer,
      addNewEventOrder,
      triggerNightDeliveryTruckArrival,
      showNotification,
      currentCustomerUser,
      setCurrentCustomerUser,
      loginAsCustomer,
      currentLanguage,
      setLanguage,
      t,
      themeId,
      customThemeHex,
      isDarkMode,
      setThemeColor,
      toggleDarkMode,
      activeTheme,
      THEME_PRESETS,
      sendMultiChannelCommunication,
      isGoogleConnected,
      googleUser,
      googleClientId,
      saveGoogleClientId,
      handleGoogleCredentialSuccess,
      connectGoogleAccount,
      disconnectGoogleAccount
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);

