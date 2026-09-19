import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import NotificationDrawer from '../common/NotificationDrawer';
import { AlertTriangle } from 'lucide-react';

export default function AppLayout({
  activeTab,
  onNavigate,
  children
}) {
  const { currentRole, currentUser, companies } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Tab to page title & breadcrumbs mapping per role
  const getMeta = () => {
    if (currentRole === 'recruiter') {
      const recruiterMap = {
        dashboard: { title: 'Recruiter Hub & Openings', crumbs: ['Recruiter', 'Hub & Openings'] },
        applicants: { title: 'Applicants Pipeline', crumbs: ['Recruiter', 'Candidates'] },
      };
      return recruiterMap[activeTab] || {
        title: activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : 'Recruiter Console',
        crumbs: ['Recruiter', 'Portal']
      };
    }

    if (currentRole === 'admin') {
      const adminMap = {
        dashboard: { title: 'Executive Placement Directorate', crumbs: ['Admin / TPO', 'Overview'] },
        students: { title: 'Student Directory & Verification', crumbs: ['Admin / TPO', 'Students'] },
        approvals: { title: 'Corporate Recruiter Approvals', crumbs: ['Admin / TPO', 'Recruiters'] },
        'job-approvals': { title: 'Job Moderation & Approvals', crumbs: ['Admin / TPO', 'Job Postings'] },
        eligibility: { title: 'Placement Policy & Cutoffs', crumbs: ['Admin / TPO', 'Eligibility'] },
        drives: { title: 'Campus Drive Management', crumbs: ['Admin / TPO', 'Drives'] },
        applications: { title: 'Master Application Tracker', crumbs: ['Admin / TPO', 'Applications'] },
        interviews: { title: 'Interview & Venue Scheduler', crumbs: ['Admin / TPO', 'Interviews'] },
        announcements: { title: 'Campus Notice Board', crumbs: ['Admin / TPO', 'Notices'] },
        analytics: { title: 'Placement Analytics & Insights', crumbs: ['Admin / TPO', 'Analytics'] },
        'ai-matching': { title: 'AI Placement Intelligence', crumbs: ['Admin / TPO', 'AI Insights'] },
        reports: { title: 'NIRF & Directorate Reports', crumbs: ['Admin / TPO', 'Reports'] },
        roles: { title: 'Staff Role Governance', crumbs: ['Admin / TPO', 'Roles'] },
        'fraud-monitor': { title: 'Anti-Fraud & Dual-Offer Monitor', crumbs: ['Admin / TPO', 'Fraud Alerts'] },
      };
      return adminMap[activeTab] || {
        title: activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : 'Placement Directorate',
        crumbs: ['Admin / TPO', 'Portal']
      };
    }

    // Default: Student
    const studentMap = {
      dashboard: { title: 'Student Dashboard', crumbs: ['Student', 'Overview'] },
      jobs: { title: 'Campus Job Openings', crumbs: ['Student', 'Jobs & Opportunities'] },
      applications: { title: 'My Applications', crumbs: ['Student', 'Applications Tracker'] },
      drives: { title: 'Campus Placement Drives', crumbs: ['Student', 'Drives'] },
      assessments: { title: 'Online Technical Assessments', crumbs: ['Student', 'Coding & Aptitude'] },
      'resume-builder': { title: 'Resume Builder', crumbs: ['Student', 'Career Documents'] },
      'resume-analyzer': { title: 'AI ATS Scanner', crumbs: ['Student', 'Resume Optimizer'] },
      'mock-interview': { title: 'AI Mock Interview', crumbs: ['Student', 'Interview Prep'] },
      profile: { title: 'My Student Profile', crumbs: ['Student', 'Account'] },
    };
    return studentMap[activeTab] || {
      title: activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : 'Student Dashboard',
      crumbs: ['Student', 'Overview']
    };
  };

  const currentMeta = getMeta();

  // Check if current recruiter's company is pending TPC approval
  const currentRecruiterCompany = companies?.find(c => 
    c.id === currentUser?.companyId || c.name === currentUser?.companyName
  );
  const isCompanyPending = currentRole === 'recruiter' && currentRecruiterCompany?.status === 'Pending';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Vertical Fixed / Sticky Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Column (offset by sidebar width on desktop) */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-200 ${
          isCollapsed ? 'md:ml-[72px]' : 'md:ml-[250px]'
        }`}
      >
        {/* Top Header */}
        <TopHeader
          pageTitle={currentMeta.title}
          breadcrumbs={currentMeta.crumbs}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenNotifications={() => setNotificationDrawerOpen(true)}
        />

        {/* Recruiter Pending TPC Verification Alert Banner */}
        {isCompanyPending && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 sm:px-6 py-2.5 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Company registration for <strong>{currentRecruiterCompany?.name}</strong> is currently pending Placement Cell authorization. Job openings will be held until verified.
            </span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Minimal Enterprise Footer */}
        <footer className="no-print border-t border-[#E2E8F0] bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-[#64748B]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0F172A]">RecruitLoop</span>
              <span>— Enterprise Campus Placement & Recruitment SaaS</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#64748B]">
              <span>Campus Edition 2026</span>
              <span>•</span>
              <span>Privacy & Security</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
    </div>
  );
}
