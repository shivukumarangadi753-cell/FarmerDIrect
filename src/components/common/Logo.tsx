import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Bespoke Leaf + Market Canopy Brand Mark */}
      <div className={`relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#164327] via-[#1f5c36] to-[#0f2e1b] text-white p-2 ${iconSize}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Market Roof / Shelter Canopy */}
          <path
            d="M3 14L16 6L29 14"
            stroke="#a7dfb8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Canopy Pillars */}
          <path
            d="M6 14V24M26 14V24M16 14V24"
            stroke="#59bb7b"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Base Foundation Line */}
          <path
            d="M4 25H28"
            stroke="#a7dfb8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Sprouting Vibrant Leaf across center */}
          <path
            d="M16 23C16 23 11 19 11 13C11 10 13.5 7.5 16.5 7.5C18 7.5 21 8.5 21 12C21 17 16 23 16 23Z"
            fill="#59bb7b"
            fillOpacity="0.85"
          />
          <path
            d="M14 17C16 15 18 12.5 19.5 9"
            stroke="#081c10"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-[#0f2e1b] ${titleSize}`}>
            Farm<span className="text-[#2d7a49]">Direct</span>
          </span>
          <span className="inline-flex items-center rounded-full bg-[#164327]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#164327] uppercase tracking-wider">
            DK & Udupi
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-[#63675e] tracking-tight mt-0.5">
            Fair Prices. Fresh Produce. Direct Connections.
          </span>
        )}
      </div>
    </div>
  );
};
