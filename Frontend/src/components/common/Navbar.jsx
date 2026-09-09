import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import NotificationDrawer from './NotificationDrawer';
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Crown, 
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  User,
  CheckCircle2,
  Laptop,
  ArrowRight,
  Bell
} from 'lucide-react';

export default function Navbar({ onNavigate }) {
  const { 
    roleUsers,
    currentUser, 
    currentRole, 
    setCurrentRole, 
    student, 
    notifications,
    openPaymentModal,
    openAuthModal,
    logout,
    logoutAllDevices 
  } = useApp();

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = (notifications || []).filter(
    n => (n.role === currentRole || n.role === 'all') && !n.isRead
  ).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    {
      id: 'student',
      label: 'Student View',
      icon: GraduationCap,
      badgeColor: 'bg-indigo-600 text-white',
      hasSession: !!roleUsers?.student
    },
    {
      id: 'recruiter',
      label: 'Recruiter View',
      icon: Briefcase,
      badgeColor: 'bg-emerald-600 text-white',
      hasSession: !!roleUsers?.recruiter
    },
    {
      id: 'admin',
      label: 'Placement Cell (TPC)',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-600 text-white',
      hasSession: !!roleUsers?.admin
    }
  ];

  // Current role specific user
  const roleName = currentRole === 'student' ? 'Student' : currentRole === 'recruiter' ? 'Recruiter' : 'Admin';
  const displayName = currentUser?.name || currentUser?.companyName || (currentUser ? currentUser.email : '');
  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : roleName.slice(0, 2).toUpperCase();

  // Check other active sessions to display helpful indicators
  const otherSession = currentRole === 'student' 
    ? (roleUsers?.recruiter ? { role: 'recruiter', name: roleUsers.recruiter.name || roleUsers.recruiter.companyName, label: 'Recruiter' } : null)
    : (roleUsers?.student ? { role: 'student', name: roleUsers.student.name, label: 'Student' } : null);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Portal Identity */}
          <div 
            onClick={() => setCurrentRole('student')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                  HireLoop
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Campus 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Autonomous Placement & AI Career Portal
              </p>
            </div>
          </div>

          {/* Quick Role Navigation Bar with Session Status Dots */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner">
            {roles.map(r => {
              const Icon = r.icon;
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `${r.badgeColor} shadow-sm scale-100`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{r.label}</span>
                  {/* Green dot if logged into this role */}
                  {r.hasSession && (
                    <span 
                      className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-300' : 'bg-emerald-500'} shadow-xs`} 
                      title={`${r.label} has an active authenticated session`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Account & Actions for Current Role Panel */}
          <div className="flex items-center gap-3">
            
            {/* Student Premium Tag / Button */}
            {currentRole === 'student' && currentUser && (
              student.isPremium ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>PREMIUM</span>
                </div>
              ) : (
                <button
                  onClick={() => openPaymentModal({
                    type: 'student_premium',
                    title: 'Upgrade to Student Career Premium',
                    amount: 499
                  })}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-xs hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Go Premium (₹499)</span>
                </button>
              )
            )}

            {/* Real-Time Notification Bell Button */}
            <button
              type="button"
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications & Placement Alerts"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* If NOT logged in into THIS role panel */}
            {!currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  type="button"
                  onClick={() => openAuthModal('login', currentRole)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('register', currentRole)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all cursor-pointer ${
                    currentRole === 'recruiter'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                      : currentRole === 'admin'
                      ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{currentRole === 'recruiter' ? 'Register Company' : currentRole === 'admin' ? 'Register TPO' : 'Register Student'}</span>
                </button>
              </div>
            ) : (
              /* If LOGGED IN to THIS role panel: User Chip & Dropdown */
              <div className="relative pl-2 border-l border-slate-200" ref={dropdownRef}>
                <div 
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 p-1.5 rounded-xl transition-all select-none"
                  title={`${roleName} session settings & logout`}
                >
                  <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-extrabold shadow-xs ${
                    currentRole === 'recruiter'
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                      : currentRole === 'admin'
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                      : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                  }`}>
                    {initials}
                  </div>
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <div className="font-bold text-slate-800 group-hover:text-indigo-600 flex items-center gap-1">
                      <span>{displayName || `${roleName} User`}</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <span className={`capitalize font-semibold ${
                        currentRole === 'recruiter' ? 'text-emerald-600' : currentRole === 'admin' ? 'text-purple-600' : 'text-indigo-600'
                      }`}>
                        {roleName} Panel
                      </span>
                      <span>• Active</span>
                    </div>
                  </div>
                </div>

                {/* Account & Session Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    
                    {/* User Summary Header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-xs ${
                          currentRole === 'recruiter' ? 'bg-emerald-600' : currentRole === 'admin' ? 'bg-purple-600' : 'bg-indigo-600'
                        }`}>
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {currentUser.email}
                          </p>
                          <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            currentRole === 'recruiter' ? 'bg-emerald-100 text-emerald-800' : currentRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{roleName} Session</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cross-Session Status (If another role is also logged in) */}
                    {otherSession && (
                      <div className="px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                        <span className="truncate">Also signed in as <strong>{otherSession.name}</strong> ({otherSession.label})</span>
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setCurrentRole(otherSession.role);
                          }}
                          className="text-indigo-600 font-bold hover:underline shrink-0 ml-2 cursor-pointer flex items-center gap-0.5"
                        >
                          <span>Switch</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Account Actions */}
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAuthModal('login', currentRole);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Switch {roleName} Account</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAuthModal('register', currentRole);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-slate-400" />
                        <span>Register Another {roleName}</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 my-1" />

                    {/* Logout Actions specifically for THIS role panel */}
                    <div className="py-1">
                      {/* Log Out This Device */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout(currentRole);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <div>
                          <div>Log Out of {roleName} Panel</div>
                          <div className="text-[10px] text-rose-400 font-normal">
                            Sign out of this role (other panels remain logged in)
                          </div>
                        </div>
                      </button>

                      {/* Log Out From All Devices */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logoutAllDevices(currentRole);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Laptop className="w-4 h-4 text-amber-600" />
                        <div>
                          <div>Log Out {roleName} from All Devices</div>
                          <div className="text-[10px] text-amber-600/80 font-normal">
                            Revoke all {roleName.toLowerCase()} sessions
                          </div>
                        </div>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Real-time Notification Drawer */}
      <NotificationDrawer 
        isOpen={notificationDrawerOpen} 
        onClose={() => setNotificationDrawerOpen(false)} 
        onNavigate={onNavigate}
      />
    </header>
  );
}
