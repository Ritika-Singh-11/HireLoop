import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Sparkles,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, onNavigate }) {
  const {
    currentRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    setCurrentRole
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'priority'

  if (!isOpen) return null;

  // Filter notifications for current role + institutional broadcast ('all')
  const roleNotifications = notifications.filter(
    n => n.role === currentRole || n.role === 'all'
  );

  const unreadCount = roleNotifications.filter(n => !n.isRead).length;

  const filteredNotifications = roleNotifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'priority') return n.type === 'urgent' || n.type === 'warning';
    return true;
  });

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diff = Math.max(0, Date.now() - new Date(dateStr).getTime());
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const getCategoryIcon = (category, type) => {
    if (type === 'urgent') return AlertCircle;
    if (type === 'warning') return AlertTriangle;
    if (category === 'interview') return Calendar;
    if (category === 'application') return Briefcase;
    if (category === 'drive') return Sparkles;
    if (category === 'approval') return ShieldCheck;
    return Bell;
  };

  const getTypeStyle = (type, isRead) => {
    if (type === 'urgent') {
      return {
        cardBg: isRead ? 'bg-white' : 'bg-rose-50/60 border-rose-200',
        iconBg: 'bg-rose-100 text-rose-600',
        badge: 'bg-rose-100 text-rose-700 border-rose-200',
      };
    }
    if (type === 'warning') {
      return {
        cardBg: isRead ? 'bg-white' : 'bg-amber-50/60 border-amber-200',
        iconBg: 'bg-amber-100 text-amber-600',
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
      };
    }
    if (type === 'success') {
      return {
        cardBg: isRead ? 'bg-white' : 'bg-emerald-50/60 border-emerald-200',
        iconBg: 'bg-emerald-100 text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      };
    }
    return {
      cardBg: isRead ? 'bg-white' : 'bg-indigo-50/60 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
  };

  const handleActionClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.actionTarget) {
      if (notif.actionTarget.role && notif.actionTarget.role !== currentRole) {
        setCurrentRole(notif.actionTarget.role);
      }
      if (onNavigate && notif.actionTarget.tab) {
        onNavigate(notif.actionTarget.tab);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500 text-white animate-pulse">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 capitalize">
                {currentRole === 'admin' ? 'TPO Directorate' : currentRole} Activity Feed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls & Filters Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({roleNotifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('priority')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeFilter === 'priority'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Priority
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsRead(currentRole)}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}

            {roleNotifications.length > 0 && (
              <button
                onClick={() => clearAllNotifications(currentRole)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 font-semibold p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                title="Clear read notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">You're all caught up!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {activeFilter === 'unread'
                    ? 'No new unread notifications in your queue.'
                    : 'No notifications found under this filter.'}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const Icon = getCategoryIcon(notif.category, notif.type);
              const styles = getTypeStyle(notif.type, notif.isRead);

              return (
                <div
                  key={notif.id}
                  className={`pt-3 first:pt-0 group relative p-3 rounded-xl border transition-all ${
                    styles.cardBg
                  } ${!notif.isRead ? 'border-l-4 shadow-xs' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Category Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 line-clamp-1">
                            {notif.title}
                          </span>
                          <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded border ${styles.badge}`}>
                            {notif.category}
                          </span>
                        </div>

                        {/* Relative Timestamp */}
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formatTimeAgo(notif.createdAt)}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {notif.message}
                      </p>

                      {/* Action Bar */}
                      <div className="pt-2 flex items-center justify-between">
                        {notif.actionTarget ? (
                          <button
                            onClick={() => handleActionClick(notif)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
                          >
                            <span>Open {notif.actionTarget.tab ? notif.actionTarget.tab.replace('-', ' ') : 'View'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <div />
                        )}

                        <div className="flex items-center gap-2">
                          {!notif.isRead && (
                            <button
                              onClick={() => markNotificationRead(notif.id)}
                              className="text-[11px] text-slate-400 hover:text-indigo-600 font-medium cursor-pointer"
                              title="Mark as read"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
                            title="Dismiss notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80 text-center">
          <p className="text-[11px] text-slate-400">
            HireLoop Placement Alert Engine • Real-Time Synchronization Active
          </p>
        </div>

      </div>
    </div>
  );
}
