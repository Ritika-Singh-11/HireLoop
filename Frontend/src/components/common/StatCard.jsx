import React from 'react';

/**
 * StatCard - Standardized Enterprise Dashboard Metric Card
 * Requirements:
 * - Label: 13-14px, 500 weight
 * - Number: 28-36px, 600-700 weight
 * - Supporting text: 12-13px
 * - Equal height, white background, #E2E8F0 border, 14px radius
 */
export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  badgeText,
  iconBg = 'bg-blue-50 text-[#2563EB]',
  onClick,
  className = ''
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-[#E2E8F0] rounded-[14px] p-5 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-xs ${
        onClick ? 'cursor-pointer hover:border-[#CBD5E1]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] sm:text-[14px] font-medium text-[#64748B] truncate">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#0F172A] leading-none">
          {value}
        </span>
        {badgeText && (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-[#64748B]">
            {badgeText}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2.5 flex items-center gap-2 text-[12px] sm:text-[13px] text-[#64748B]">
          {trend && (
            <span className={`inline-flex items-center font-medium ${
              trend.isPositive !== false ? 'text-[#16A34A]' : 'text-[#DC2626]'
            }`}>
              {trend.value || trend}
            </span>
          )}
          {subtext && <span className="truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
