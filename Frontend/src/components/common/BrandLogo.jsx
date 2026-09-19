import React from 'react';

/**
 * BrandLogo - Clean, modern enterprise brand identity for RecruitLoop.
 * Features a minimalist geometric recruitment loop mark with Deep Indigo (#1E3A8A)
 * and Accent Blue (#2563EB).
 */
export default function BrandLogo({
  size = 'md',
  showText = true,
  subtitle = '',
  className = '',
  textClassName = '',
  onClick
}) {
  const sizeMap = {
    xs: { box: 'w-7 h-7', svgSize: 28, text: 'text-sm', sub: 'text-[10px]' },
    sm: { box: 'w-8 h-8', svgSize: 32, text: 'text-base', sub: 'text-[11px]' },
    md: { box: 'w-9 h-9', svgSize: 36, text: 'text-lg', sub: 'text-xs' },
    lg: { box: 'w-11 h-11', svgSize: 44, text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-14 h-14', svgSize: 56, text: 'text-2xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Minimalist Enterprise Logo Mark */}
      <div className={`${currentSize.box} rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white shrink-0 shadow-xs`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 text-white"
        >
          {/* Infinity / Continuous Loop Ribbon */}
          <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.267-8-12.356-8-5.096 0-5.096 8 0 8 5.09 0 7.261-8 12.356-8Z" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={`leading-none ${textClassName}`}>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold ${currentSize.text} tracking-tight text-[#0F172A]`}>
              Recruit<span className="text-[#2563EB]">Loop</span>
            </span>
          </div>
          {subtitle && (
            <p className={`${currentSize.sub} text-[#64748B] font-normal mt-0.5 tracking-tight`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
