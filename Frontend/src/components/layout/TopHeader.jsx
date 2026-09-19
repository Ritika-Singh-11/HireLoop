import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Check,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Crown
} from 'lucide-react';

export default function TopHeader({
  pageTitle = 'Dashboard',
  breadcrumbs = [],
  onOpenMobileMenu,
  onOpenNotifications,
  onOpenSearch
}) {
  const {
    roleUsers,
    currentUser,
    currentRole,
    setCurrentRole,
    student,
    notifications,
    openAuthModal,
    openPaymentModal,
    logout
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const roleDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const unreadCount = (notifications || []).filter(
    n => (n.role === currentRole || n.role === 'all') && !n.isRead
  ).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setRoleDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
      emoji: '🎓',
      hasSession: !!roleUsers?.student
    },
    {
      id: 'recruiter',
      label: 'Recruiter',
      icon: Briefcase,
      emoji: '💼',
      hasSession: !!roleUsers?.recruiter
    },
    {
      id: 'admin',
      label: 'Admin / TPO',
      icon: ShieldCheck,
      emoji: '🛡',
      hasSession: !!roleUsers?.admin
    }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];
  const roleName = currentRole === 'student' ? 'Student' : currentRole === 'recruiter' ? 'Recruiter' : 'Admin';
  const displayName = currentUser?.name || currentUser?.companyName || (currentUser ? currentUser.email : '');
  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : roleName.slice(0, 2).toUpperCase();

  const handleRoleSelect = (roleId) => {
    setCurrentRole(roleId);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title / Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#64748B] mb-0.5">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span className="hover:text-[#0F172A] cursor-pointer">{crumb}</span>
                  {idx < breadcrumbs.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 className="text-lg sm:text-xl font-semibold text-[#0F172A] tracking-tight truncate">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Search, Notifications, Role Switcher, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Minimal Search Bar (Desktop) */}
        <div className="hidden lg:flex items-center relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 xl:w-64 h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-slate-50/70 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
          />
        </div>

        {/* Student Premium Indicator if student */}
        {currentRole === 'student' && currentUser && (
          student?.isPremium ? (
            <div className="hidden sm:flex items-center gap-1 px-2.5 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Premium</span>
            </div>
          ) : (
            <button
              onClick={() => openPaymentModal({
                type: 'student_premium',
                title: 'Upgrade to Student Career Premium',
                amount: 499
              })}
              className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade</span>
            </button>
          )
        )}

        {/* Recruiter Organization Badge */}
        {currentRole === 'recruiter' && currentUser && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentUser.companyName || 'Corporate Recruiter'}</span>
          </div>
        )}

        {/* Admin TPO Badge */}
        {currentRole === 'admin' && currentUser && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>TPC Directorate</span>
          </div>
        )}

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
          title="Notifications & Placement Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Professional Role Switcher Dropdown */}
        <div className="relative" ref={roleDropdownRef}>
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-medium text-[#0F172A] transition-colors cursor-pointer shadow-2xs"
            title="Switch workspace role"
          >
            <span>{currentRoleObj.emoji}</span>
            <span className="hidden sm:inline font-semibold">{currentRoleObj.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-150 ${
              roleDropdownOpen ? 'rotate-180 text-[#1E3A8A]' : ''
            }`} />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1.5 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 border-b border-[#E2E8F0]">
                <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Switch workspace
                </p>
              </div>

              <div className="p-1 space-y-0.5">
                {roles.map((r) => {
                  const isSelected = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 text-[#1E3A8A] font-semibold'
                          : 'text-[#0F172A] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{r.emoji}</span>
                        <span>{r.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {r.hasSession && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" title="Active session" />
                        )}
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#1E3A8A]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Auth Actions */}
        {!currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => openAuthModal('login', currentRole)}
              className="px-3 h-8 rounded-lg border border-[#E2E8F0] text-[#0F172A] text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register', currentRole)}
              className="px-3 h-8 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              Register
            </button>
          </div>
        ) : (
          <div className="relative pl-2 border-l border-[#E2E8F0]" ref={userDropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                {initials}
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight">
                <p className="font-semibold text-[#0F172A] truncate max-w-[120px]">
                  {displayName || 'Account'}
                </p>
                <p className="text-[11px] text-[#64748B] capitalize truncate">
                  {roleName}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden xl:block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1.5 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-[#E2E8F0]">
                  <p className="text-xs font-semibold text-[#0F172A] truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[#64748B] capitalize">
                    {roleName} Account
                  </span>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      openAuthModal('login', currentRole);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-[#64748B]" />
                    <span>Switch / Relogin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout(currentRole);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#DC2626] hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#DC2626]" />
                    <span>Sign Out from {roleName}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
