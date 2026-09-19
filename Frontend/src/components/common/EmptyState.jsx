import React from 'react';
import { FolderOpen } from 'lucide-react';

/**
 * EmptyState - Clean, minimal enterprise empty state component
 */
export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionText,
  onAction,
  actionIcon: ActionIcon,
  className = ''
}) {
  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-[14px] p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-2xs ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-center text-[#64748B] mb-3">
        <Icon className="w-6 h-6 text-[#64748B]" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-[#0F172A]">
        {title}
      </h3>

      <p className="mt-1.5 text-xs sm:text-sm text-[#64748B] max-w-md leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-2xs"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
