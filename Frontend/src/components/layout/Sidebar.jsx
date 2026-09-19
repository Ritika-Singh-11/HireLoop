import React from 'react';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import {
  LayoutDashboard,
  Briefcase,
  Trophy,
  Building,
  Code2,
  FileText,
  BrainCircuit,
  Sparkles,
  User,
  Users,
  GraduationCap,
  ShieldCheck,
  Target,
  Calendar,
  Megaphone,
  TrendingUp,
  Key,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenSettings,
  onOpenHelp
}) {
  const { currentRole, logout, currentUser } = useApp();

  // Navigation configurations per role
  const studentNav = [
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Find Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: Trophy },
    { id: 'drives', label: 'Campus Drives', icon: Building },
    { id: 'assessments', label: 'Online Assessments', icon: Code2 },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'resume-analyzer', label: 'AI ATS Scanner', icon: BrainCircuit },
    { id: 'mock-interview', label: 'AI Mock Interview', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const recruiterNav = [
    { id: 'dashboard', label: 'Recruiter Hub', icon: LayoutDashboard },
    { id: 'applicants', label: 'Applicants Pipeline', icon: Users },
  ];

  const adminNav = [
    { id: 'dashboard', label: 'Directorate Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'approvals', label: 'Recruiters', icon: ShieldCheck },
    { id: 'job-approvals', label: 'Job Approvals', icon: Briefcase },
    { id: 'eligibility', label: 'Eligibility', icon: Target },
    { id: 'drives', label: 'Campus Drives', icon: Building },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'announcements', label: 'Notices', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'ai-matching', label: 'AI Matching', icon: BrainCircuit },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'roles', label: 'Staff Roles', icon: Key },
    { id: 'fraud-monitor', label: 'Fraud Alerts', icon: ShieldAlert },
  ];

  const navItems = currentRole === 'student' 
    ? studentNav 
    : currentRole === 'recruiter' 
    ? recruiterNav 
    : adminNav;

  const roleLabel = currentRole === 'student'
    ? 'STUDENT'
    : currentRole === 'recruiter'
    ? 'RECRUITER'
    : 'ADMIN / TPO';

  const handleItemClick = (id) => {
    onNavigate(id);
    if (mobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout(currentRole);
    if (mobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white select-none">
      {/* Top: Logo & Role */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0]">
          <BrandLogo 
            size="sm"
            showText={!isCollapsed}
            onClick={() => handleItemClick('dashboard')}
          />
          {/* Collapse Toggle (Desktop only) */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge */}
        {!isCollapsed ? (
          <div className="px-4 py-3 border-b border-[#E2E8F0]/60">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              {roleLabel} WORKSPACE
            </span>
          </div>
        ) : (
          <div className="py-2.5 text-center border-b border-[#E2E8F0]/60">
            <span className="text-[10px] font-bold text-[#64748B] uppercase">
              {roleLabel.slice(0, 3)}
            </span>
          </div>
        )}

        {/* Main Navigation List */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`relative w-full flex items-center gap-3 px-3 h-11 rounded-lg text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 text-[#1E3A8A] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#1E3A8A] before:rounded-r'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#1E3A8A]' : 'text-[#64748B]'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings, Help, Logout */}
      <div className="p-2 border-t border-[#E2E8F0] space-y-1 bg-white">
        <button
          type="button"
          onClick={() => onOpenSettings ? onOpenSettings() : handleItemClick('profile')}
          title={isCollapsed ? 'Settings' : undefined}
          className={`w-full flex items-center gap-3 px-3 h-10 rounded-lg text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-[#64748B]" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        <button
          type="button"
          onClick={() => onOpenHelp ? onOpenHelp() : null}
          title={isCollapsed ? 'Help & Support' : undefined}
          className={`w-full flex items-center gap-3 px-3 h-10 rounded-lg text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0 text-[#64748B]" />
          {!isCollapsed && <span>Help & Support</span>}
        </button>

        {currentUser && (
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 px-3 h-10 rounded-lg text-[14px] font-medium text-[#DC2626] hover:bg-rose-50 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0 text-[#DC2626]" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed / Sticky Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 bg-white border-r border-[#E2E8F0] transition-all duration-200 ${
          isCollapsed ? 'w-[72px]' : 'w-[250px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Body */}
          <div className="relative w-[260px] max-w-[80vw] h-full bg-white z-10 shadow-2xl animate-slideInLeft">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
