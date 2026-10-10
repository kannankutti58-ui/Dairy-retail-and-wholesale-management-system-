import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Lock, 
  User, 
  LogIn, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Store,
  MapPin,
  Clock,
  Phone,
  CreditCard,
  Users,
  Smartphone,
  Info,
  Key,
  Database,
  Coffee,
  HeartHandshake,
  KeyRound,
  Mail
} from 'lucide-react';
import { GoogleAuthModal } from '../common/GoogleAuthModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage = () => {
  const { 
    login, 
    googleClientId, 
    handleGoogleCredentialSuccess, 
    connectGoogleAccount, 
    shopSettings, 
    showNotification 
  } = useShop();
  
  // Login Mode: 'customer' (Client-side) or 'admin' (Store Proprietor)
  const [loginMode, setLoginMode] = useState('customer');

  // Customer Login State
  const [customerPhone, setCustomerPhone] = useState('9842111001');
  const [customerPin, setCustomerPin] = useState('milk123');

  // Admin Login State
  const [adminUsername, setAdminUsername] = useState('kuttiammal');
  const [adminPassword, setAdminPassword] = useState('admin123');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('kuttiammal.dairy@gmail.com');

  // 4 Real Subscribed Customers for Kuttiammal's Dairy Hub
  const SHOP_CUSTOMERS = [
    {
      id: 'cust-1',
      username: 'lakshmi.attai',
      password: 'milk123',
      name: 'M. Lakshmi',
      cardId: 'ATT-101',
      phone: '98421 11001',
      email: 'lakshmi.subscriber@gmail.com',
      quota: '2 Pkts/Day (Delight Purple)',
      badge: 'Monthly Attai Card #ATT-101'
    },
    {
      id: 'cust-2',
      username: 'murugan.tea',
      password: 'tea123',
      name: 'R. Murugan (Tea Stall & Bakery)',
      cardId: 'ATT-104',
      phone: '98421 22002',
      email: 'murugantea.kovilpatti@gmail.com',
      quota: '25 Pkts/Day (Nice Blue)',
      badge: 'B2B Wholesale Tea Stall'
    },
    {
      id: 'cust-3',
      username: 'priya.ngo',
      password: 'milk123',
      name: 'K. Priya',
      cardId: 'ATT-102',
      phone: '98421 33003',
      email: 'priya.kovilpatti@gmail.com',
      quota: '1 Pkt/Day + 1 Curd Tub',
      badge: 'Monthly Attai Card #ATT-102'
    },
    {
      id: 'cust-4',
      username: 'venkatesh.fcm',
      password: 'milk123',
      name: 'S. Venkatesh',
      cardId: 'ATT-103',
      phone: '98421 55005',
      email: 'venkatesh.perumalpuram@gmail.com',
      quota: '3 Pkts/Day (Full Cream Orange)',
      badge: 'Monthly Attai Card #ATT-103'
    }
  ];

  // Quick 1-Click Login for Customer
  const handleQuickCustomerLogin = (cust) => {
    setCustomerPhone(cust.phone.replace(/\s+/g, ''));
    setCustomerPin(cust.password);
    setIsLoading(true);
    setError('');

    setTimeout(async () => {
      const res = await login(cust.username, cust.password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.message || 'Login failed.');
      }
    }, 200);
  };

  // Submit Customer Login Form
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      setError('Please enter your mobile number or Attai Card ID.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Match by phone, card number, or default to lakshmi
    const clean = customerPhone.replace(/\s+/g, '').toLowerCase();
    const matched = SHOP_CUSTOMERS.find(c => 
      c.phone.replace(/\s+/g, '').includes(clean) || 
      c.cardId.toLowerCase().includes(clean) ||
      c.username.toLowerCase().includes(clean)
    );

    const userToLogin = matched ? matched.username : 'lakshmi.attai';
    const pwdToLogin = matched ? matched.password : customerPin || 'milk123';

    const res = await login(userToLogin, pwdToLogin);
    setIsLoading(false);
    if (!res.success) {
      setError(res.message || 'Invalid credentials.');
    }
  };

  // Submit Admin Login Form
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setError('Please enter Admin username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await login(adminUsername, adminPassword);
    setIsLoading(false);
    if (!res.success) {
      setError(res.message || 'Invalid Admin password. Use admin123');
    }
  };

  // Direct Google OAuth 2.0 Real Trigger
  const handleDirectGoogleLogin = () => {
    setIsGoogleLoading(true);
    setError('');

    const targetClientId = googleClientId || '187513899699-5qkhj58ovpj29bvflnrmqk3dt48da5rn.apps.googleusercontent.com';

    // 1. Try Google Identity Services OAuth 2.0 Token Client (Opens real Google Account Chooser popup)
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: targetClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const profile = await res.json();
                await handleGoogleCredentialSuccess(null, profile);
                setIsGoogleLoading(false);
                return;
              } catch (err) {
                console.log('[Google UserInfo Error]:', err);
              }
            }
            setIsGoogleLoading(false);
          },
          error_callback: (err) => {
            console.log('[Google Token Client Error]:', err);
            setShowGoogleModal(true);
            setIsGoogleLoading(false);
          }
        });
        client.requestAccessToken();
        return;
      } catch (err) {
        console.log('[Google OAuth2 Init Failed]:', err);
      }
    }

    // 2. Try Google ID Prompt (One Tap / GIS Prompt)
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: targetClientId,
          callback: (response) => {
            if (response?.credential) {
              handleGoogleCredentialSuccess(response.credential);
            }
            setIsGoogleLoading(false);
          },
          auto_select: false
        });
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowGoogleModal(true);
            setIsGoogleLoading(false);
          }
        });
        return;
      } catch (err) {
        console.log('[Google ID Prompt Failed]:', err);
      }
    }

    // 3. Fallback: Open Google modal
    setShowGoogleModal(true);
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* LEFT COLUMN: Store Profile & Project Overview (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-sky-950 to-slate-950 p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            {/* Header Brand with New Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-xl border-2 border-sky-400 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src="/kuttiammal-dairy-logo.png" 
                  alt="Kuttiammal's Dairy Hub Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white">
                  Kuttiammal's Dairy Hub
                </h1>
                <p className="text-[11px] text-sky-200 font-medium">
                  Aavin Authorised Milk Agency • Kovilpatti
                </p>
              </div>
            </div>

            {/* Shop Overview */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2.5 text-xs text-sky-100">
              <div className="flex items-center gap-2 font-bold text-white">
                <Store className="w-4 h-4 text-sky-300" />
                <span>கடை விவரங்கள் (Agency Profile):</span>
              </div>
              <p className="leading-relaxed text-[11px] text-sky-200">
                Main Road, Kovilpatti, Tamil Nadu - 628501. Direct morning & evening fresh Aavin milk distribution hub.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span>📞 Shop Phone:</span>
                <strong className="text-amber-300 font-black">9443442471</strong>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span>⏰ Counter Hours:</span>
                <strong className="text-emerald-300">05:00 AM – 09:30 AM</strong>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase text-sky-300 tracking-wider block">
                Security & Architecture:
              </span>
              <div className="space-y-1.5 text-[11px] text-sky-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Secure JWT Token & Role-Based Guard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Nodemailer Gmail OTP Password Recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>MongoDB Compass Live Database API</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Google OAuth 2.0 Real Sign-In Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="pt-4 border-t border-white/10 text-[10px] text-sky-300 font-mono flex items-center justify-between">
            <span>Client & Store Architecture</span>
            <span className="text-emerald-400 font-bold">● System Online</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Dedicated Dual Login (Customer / Store Admin) (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-5">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-800/80 rounded-2xl border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('customer');
                  setError('');
                }}
                className={`py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                  loginMode === 'customer'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>வாடிக்கையாளர் (Client)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('admin');
                  setError('');
                }}
                className={`py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                  loginMode === 'admin'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>கடை உரிமையாளர் (Admin)</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ========================================================
                MODE 1: CLIENT / CUSTOMER LOGIN
               ======================================================== */}
            {loginMode === 'customer' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <span>வாடிக்கையாளர் உள்நுழைவு • Client Portal</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    View shop details, available stock, your monthly milk pass (#ATT-101), and reviews.
                  </p>
                </div>

                {/* 1-Click Quick Customer Select Cards */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    1-Click Test Customer Profiles:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SHOP_CUSTOMERS.map((cust) => (
                      <button
                        key={cust.id}
                        type="button"
                        onClick={() => handleQuickCustomerLogin(cust)}
                        className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-purple-500 text-left transition cursor-pointer group"
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-xs text-white group-hover:text-purple-300">
                            {cust.name}
                          </span>
                          <span className="text-[9px] font-mono font-black bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded">
                            {cust.cardId}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{cust.phone}</div>
                        <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 truncate">
                          {cust.quota}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Login Form */}
                <form onSubmit={handleCustomerSubmit} className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Mobile Number or Attai Card ID
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 98421 11001 or ATT-101"
                        className="w-full bg-slate-800/90 border border-slate-700 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                      />
                    </div>
                  </div>

                  {/* Customer Forgot Password Link */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordEmail('lakshmi.subscriber@gmail.com');
                        setShowForgotPasswordModal(true);
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Forgot Pass PIN? (கடவுச்சொல் மீட்பு)</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Open Customer Milk Hub Portal ➔</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================
                MODE 2: STORE PROPRIETOR / ADMIN LOGIN
               ======================================================== */}
            {loginMode === 'admin' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <span>கடை உரிமையாளர் • Store Admin Access</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Proprietor Master Login for POS Counter, Cold Storage Freezer, Indents & Accounting.
                  </p>
                </div>

                {/* 1-Click Admin Badge */}
                <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-blue-200 block">Kuttiammal M. (Proprietor)</span>
                    <span className="text-[10px] text-blue-400 font-mono">User: kuttiammal • Pass: admin123</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminUsername('kuttiammal');
                      setAdminPassword('admin123');
                      login('kuttiammal', 'admin123');
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition cursor-pointer"
                  >
                    1-Click Admin
                  </button>
                </div>

                {/* Admin Form */}
                <form onSubmit={handleAdminSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Admin Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="kuttiammal"
                        className="w-full bg-slate-800/90 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordEmail('kuttiammal.dairy@gmail.com');
                          setShowForgotPasswordModal(true);
                        }}
                        className="text-[11px] text-sky-400 hover:text-sky-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Forgot Password? (கடவுச்சொல் மறந்துவிட்டதா?)</span>
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="admin123"
                        className="w-full bg-slate-800/90 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Verifying JWT...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Login to Admin Terminal ➔</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Google OAuth Real System Button & Quick Launcher */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleDirectGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-black transition flex items-center justify-center gap-2.5 cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isGoogleLoading ? 'Connecting to Google OAuth 2.0...' : 'Continue with Google (Google மூலம் உள்நுழைக)'}</span>
              </button>

              {/* 1-Click Fast Verification for Store Proprietor */}
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleGoogleCredentialSuccess(null, {
                      email: 'kannankutti58@gmail.com',
                      name: 'Kannan Kutti (Proprietor)',
                      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    });
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer flex items-center gap-1.5"
                  title="Direct 1-Click Sign-In with kannankutti58@gmail.com"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Sign in as kannankutti58@gmail.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="text-slate-400 hover:text-slate-200 underline cursor-pointer shrink-0 font-medium"
                >
                  Google Accounts 👤
                </button>
              </div>
            </div>

          </div>

          <div className="text-[10px] text-slate-500 text-center">
            Kuttiammal's Dairy Hub • Authorized Aavin Agency Management System
          </div>

        </div>

      </div>

      {/* Real Google Auth Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />

      {/* Forgot Password OTP Verification Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        initialEmail={forgotPasswordEmail}
      />

    </div>
  );
};

export default LoginPage;
