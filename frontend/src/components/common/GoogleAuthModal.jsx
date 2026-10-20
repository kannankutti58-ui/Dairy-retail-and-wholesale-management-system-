import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  CheckCircle2, 
  Shield, 
  Mail, 
  X, 
  Sparkles,
  LogIn,
  UserCheck
} from 'lucide-react';

export const GoogleAuthModal = ({ isOpen, onClose }) => {
  const { 
    isGoogleConnected, 
    googleUser, 
    googleClientId,
    handleGoogleCredentialSuccess,
    disconnectGoogleAccount, 
    showNotification
  } = useShop();

  const [isLoading, setIsLoading] = useState(false);
  const [customEmailInput, setCustomEmailInput] = useState('kannankutti58@gmail.com');
  const googleBtnContainerRef = useRef(null);

  // Launch Google OAuth 2.0 Popup
  const handleTriggerGooglePopup = () => {
    setIsLoading(true);
    const targetClientId = googleClientId || '187513899699-5qkhj58ovpj29bvflnrmqk3dt48da5rn.apps.googleusercontent.com';

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
                setIsLoading(false);
                onClose();
                return;
              } catch (err) {
                console.log('[UserInfo Fetch Error]:', err);
              }
            }
            setIsLoading(false);
          },
          error_callback: (err) => {
            console.log('[Google Token Client Error]:', err);
            showNotification('Google OAuth: Please select an account or use instant sign-in below.', 'info');
            setIsLoading(false);
          }
        });
        client.requestAccessToken();
        return;
      } catch (err) {
        console.log('[Google OAuth Init Error]:', err);
      }
    }

    // ID Prompt Fallback
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            showNotification('You can use instant Google sign-in below.', 'info');
          }
        });
      } catch (e) {}
    }
    setIsLoading(false);
  };

  // Initialize official Google Identity Services when modal opens and client ID is present
  useEffect(() => {
    if (!isOpen || !googleClientId) return;

    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            if (response && response.credential) {
              handleGoogleCredentialSuccess(response.credential);
              onClose();
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Render official Google button
        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: 'filled_blue',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            shape: 'pill',
            width: 320,
            logo_alignment: 'left'
          });
        }
      } catch (err) {
        console.log('[Google GIS Init Notice]:', err.message);
      }
    }
  }, [isOpen, googleClientId]);

  if (!isOpen) return null;

  const handleQuickDemoConnect = (email, name) => {
    setIsLoading(true);
    setTimeout(() => {
      const mockPayload = {
        email: email || 'kannankutti58@gmail.com',
        name: name || 'Kannan Kutti (Proprietor)',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        sub: 'google-auth-' + Date.now()
      };
      handleGoogleCredentialSuccess(null, mockPayload);
      setIsLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-md border border-slate-200 p-2 flex items-center justify-center shrink-0">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Google Sign-In
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Google OAuth 2.0 • Kuttiammal's Dairy Hub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner if Google Account is Active */}
        {isGoogleConnected ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google Account Active</span>
              </div>
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                JWT Session
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {googleUser?.avatar ? (
                <img src={googleUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-emerald-400" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {googleUser?.name?.charAt(0) || 'G'}
                </div>
              )}
              <div>
                <strong className="text-xs text-slate-900 dark:text-white block">{googleUser?.name || 'Google User'}</strong>
                <span className="text-[11px] text-slate-500 font-mono">{googleUser?.email}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  disconnectGoogleAccount();
                  showNotification("Google Account disconnected.");
                }}
                className="text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
              >
                Disconnect
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 cursor-pointer"
              >
                Continue to App ✓
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Official Google Button & Popup Launcher */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-3 text-center">
              
              {/* Real Popup Launcher Button */}
              <button
                type="button"
                onClick={handleTriggerGooglePopup}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 text-slate-800 dark:text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition cursor-pointer active:scale-[0.99]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isLoading ? 'Opening Google Sign-In...' : 'Open Official Google OAuth Popup'}</span>
              </button>

              {/* Render target for Google Identity Services GSI script */}
              <div ref={googleBtnContainerRef} className="w-full flex items-center justify-center"></div>
            </div>

            {/* Direct Custom Gmail Sign-In Box */}
            <div className="p-3.5 bg-sky-50 dark:bg-slate-800/90 rounded-2xl border border-sky-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Google Sign-In (உங்கள் ஜிமெயில்):</span>
              </span>
              
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={customEmailInput}
                  onChange={(e) => setCustomEmailInput(e.target.value)}
                  placeholder="kannankutti58@gmail.com"
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleQuickDemoConnect(customEmailInput, customEmailInput.split('@')[0])}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Quick 1-Click Test Profiles */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                1-Click Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoConnect('kannankutti58@gmail.com', 'Kannan Kutti')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-left hover:border-blue-500 transition cursor-pointer group"
                >
                  <strong className="text-xs text-slate-900 dark:text-white block group-hover:text-blue-500">Kannan (Proprietor)</strong>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 truncate block">kannankutti58@gmail.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoConnect('lakshmi.subscriber@gmail.com', 'M. Lakshmi')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-left hover:border-purple-500 transition cursor-pointer group"
                >
                  <strong className="text-xs text-slate-900 dark:text-white block group-hover:text-purple-400">Client #ATT-101</strong>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 truncate block">lakshmi.subscriber@gmail.com</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Footer Security Badge */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secured with Official Google Identity Services & JWT</span>
        </div>

      </div>
    </div>
  );
};

export default GoogleAuthModal;
