import React from 'react';

/**
 * StatusBadge - Standardized Enterprise Status Badges
 * Uses soft tinted backgrounds and subtle borders matching the color system:
 * - Success: #16A34A (Green)
 * - Warning/Pending: #D97706 (Amber)
 * - Active/Info: #2563EB (Blue)
 * - Error/Rejected: #DC2626 (Red)
 * - Neutral: #64748B (Slate)
 */
export default function StatusBadge({ status, size = 'sm', showDot = true, className = '' }) {
  const normalized = (status || '').toString().toLowerCase().trim();

  let style = {
    bg: 'bg-slate-50',
    text: 'text-[#64748B]',
    border: 'border-slate-200',
    dot: 'bg-slate-400'
  };

  if (
    normalized.includes('offer') ||
    normalized.includes('selected') ||
    normalized.includes('placed') ||
    normalized.includes('approved') ||
    normalized.includes('success') ||
    normalized.includes('accepted')
  ) {
    style = {
      bg: 'bg-emerald-50',
      text: 'text-[#16A34A]',
      border: 'border-emerald-200',
      dot: 'bg-[#16A34A]'
    };
  } else if (
    normalized.includes('shortlist') ||
    normalized.includes('interview') ||
    normalized.includes('live') ||
    normalized.includes('active') ||
    normalized.includes('oa') ||
    normalized.includes('assessment')
  ) {
    style = {
      bg: 'bg-blue-50',
      text: 'text-[#2563EB]',
      border: 'border-blue-200',
      dot: 'bg-[#2563EB]'
    };
  } else if (
    normalized.includes('pending') ||
    normalized.includes('review') ||
    normalized.includes('wait') ||
    normalized.includes('action') ||
    normalized.includes('upcoming')
  ) {
    style = {
      bg: 'bg-amber-50',
      text: 'text-[#D97706]',
      border: 'border-amber-200',
      dot: 'bg-[#D97706]'
    };
  } else if (
    normalized.includes('reject') ||
    normalized.includes('decline') ||
    normalized.includes('block') ||
    normalized.includes('fail') ||
    normalized.includes('critical') ||
    normalized.includes('high')
  ) {
    style = {
      bg: 'bg-rose-50',
      text: 'text-[#DC2626]',
      border: 'border-rose-200',
      dot: 'bg-[#DC2626]'
    };
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px]' 
    : 'px-2.5 py-1 text-[12px]';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${style.bg} ${style.text} ${style.border} ${sizeClasses} ${className}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      )}
      <span className="capitalize">{status}</span>
    </span>
  );
}
