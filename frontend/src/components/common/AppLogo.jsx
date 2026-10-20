import React from 'react';
import newLogoImg from '../../assets/kuttiammal-dairy-logo.png';

export const AppLogo = ({ size = 'md', showText = false, className = '' }) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeMap[size] || sizeMap.md} rounded-2xl overflow-hidden shadow-md border-2 border-white/40 dark:border-slate-700 bg-white p-0.5 shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-200`}>
        <img
          src={newLogoImg}
          alt="Kuttiammal's Dairy Hub Logo"
          className="w-full h-full object-contain rounded-xl"
          onError={(e) => {
            // Fallback SVG if image not supported
            e.target.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="font-black text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-1.5">
            <span>Kuttiammal's Dairy Hub</span>
            <span className="px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[9px] font-black uppercase">
              Aavin
            </span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Kovilpatti • Tirunelveli Union
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLogo;
