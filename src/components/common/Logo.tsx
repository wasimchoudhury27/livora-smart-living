import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showTagline = false, 
  inverted = false,
  className = '' 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Modern geometric icon combining Home + Bed + Connected Nodes */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 shadow-md shadow-indigo-600/20 text-white`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-4/5 h-4/5">
          {/* Roof line */}
          <path 
            d="M8 18L20 8L32 18" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Bed headboard and frame */}
          <path 
            d="M11 28V20H29V28" 
            stroke="#93c5fd" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
          />
          <path 
            d="M9 25H31" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          {/* Connected Network Nodes */}
          <circle cx="20" cy="8" r="2.2" fill="#38bdf8" />
          <circle cx="8" cy="18" r="2" fill="#818cf8" />
          <circle cx="32" cy="18" r="2" fill="#818cf8" />
          <circle cx="11" cy="28" r="2" fill="#60a5fa" />
          <circle cx="29" cy="28" r="2" fill="#60a5fa" />
          {/* Smart pulse center node */}
          <circle cx="20" cy="20" r="1.8" fill="#34d399" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${textSizes[size]} ${inverted ? 'text-white' : 'text-slate-900'}`}>
            LIVORA
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200/60 hidden sm:inline-block">
            Smart Living
          </span>
        </div>
        {showTagline && (
          <span className={`text-[11px] font-medium tracking-tight ${inverted ? 'text-slate-400' : 'text-slate-500'}`}>
            Smart Living. Seamless Management.
          </span>
        )}
      </div>
    </div>
  );
};
