import React from 'react';

/**
 * BrandLogo - High-tech, futuristic brand identity for HireLoop.
 * Features an interlocking talent-infinity loop, neon cyberpunk gradients,
 * and central AI quantum core.
 */
export default function BrandLogo({
  size = 'md',
  showText = true,
  subtitle = 'Autonomous AI Placement Portal',
  versionBadge = 'v2.5 AI',
  className = '',
  textClassName = '',
  onClick
}) {
  // Dimension map
  const sizeMap = {
    xs: { box: 'w-7 h-7', svgSize: 28, text: 'text-base', sub: 'text-[9px]' },
    sm: { box: 'w-8 h-8', svgSize: 32, text: 'text-lg', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', svgSize: 40, text: 'text-xl', sub: 'text-[11px]' },
    lg: { box: 'w-12 h-12', svgSize: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', svgSize: 64, text: 'text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      onClick={onClick}
      className={`group flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Visual Logo Mark */}
      <div className={`relative ${currentSize.box} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Ambient Glow Aura */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-500 rounded-2xl blur-xs opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* SVG Mark */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="bl-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#090d16" />
              <stop offset="50%" stopColor="#111827" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="bl-loop-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="40%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="bl-loop-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <radialGradient id="bl-nexus-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Rounded Dark Glass Container */}
          <rect width="100" height="100" rx="26" fill="url(#bl-bg)" />
          <rect width="100" height="100" rx="26" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" />

          {/* Glowing Center Core */}
          <circle cx="50" cy="50" r="28" fill="url(#bl-nexus-glow)" />

          {/* Tilted Orbital Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="14"
            transform="rotate(-26 50 50)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Infinite Ribbon Loop - Base Track */}
          <path
            d="M 50 50 C 65 30 84 32 84 50 C 84 68 65 70 50 50 C 35 30 16 32 16 50 C 16 68 35 70 50 50 Z"
            stroke="url(#bl-loop-primary)"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Neon Front Ribbon Arc */}
          <path
            d="M 27 63 C 34 69 43 65 50 50 C 57 35 67 31 73 37"
            stroke="url(#bl-loop-secondary)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* AI Nexus Center Hub */}
          <circle cx="50" cy="50" r="9" fill="#090d16" stroke="#818cf8" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="5" fill="#38bdf8" />

          {/* Central AI Quantum Sparkle */}
          <polygon
            points="50,43 51.8,48 57,50 51.8,52 50,57 48.2,52 43,50 48.2,48"
            fill="#ffffff"
          />

          {/* Satellite Orbiting Micro-Nodes */}
          <circle cx="21" cy="41" r="2.8" fill="#38bdf8" />
          <circle cx="79" cy="59" r="2.8" fill="#ec4899" />
          <circle cx="70" cy="33" r="2.2" fill="#a855f7" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={textClassName}>
          <div className="flex items-center gap-2 leading-none">
            <span className={`font-extrabold ${currentSize.text} tracking-tight bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-pink-500 transition-all`}>
              Hire<span className="text-indigo-950">Loop</span>
            </span>

            {versionBadge && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                {versionBadge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className={`${currentSize.sub} text-slate-500 font-medium hidden md:block mt-0.5 tracking-tight`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
