import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import PaymentModal from './components/common/PaymentModal';
import AuthModal from './components/auth/AuthModal';
import WelcomeGate from './components/auth/WelcomeGate';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import JobBoard from './components/student/JobBoard';
import ApplicationTracker from './components/student/ApplicationTracker';
import ResumeBuilder from './components/student/ResumeBuilder';
import ResumeAnalyzer from './components/student/ResumeAnalyzer';
import MockInterview from './components/student/MockInterview';
import AssessmentCenter from './components/student/AssessmentCenter';
import StudentDrivesPortal from './components/student/StudentDrivesPortal';

// Recruiter Components
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import ApplicantManager from './components/recruiter/ApplicantManager';

// Admin Components
import PlacementDashboard from './components/admin/PlacementDashboard';
import CompanyApprovals from './components/admin/CompanyApprovals';
import PlacementReports from './components/admin/PlacementReports';
import AnnouncementBoard from './components/admin/AnnouncementBoard';
import StudentManagement from './components/admin/StudentManagement';
import JobApprovals from './components/admin/JobApprovals';
import EligibilityManager from './components/admin/EligibilityManager';
import DriveManager from './components/admin/DriveManager';
import ApplicationMasterTracker from './components/admin/ApplicationMasterTracker';
import InterviewScheduler from './components/admin/InterviewScheduler';
import PlacementAnalytics from './components/admin/PlacementAnalytics';
import AiPlacementIntelligence from './components/admin/AiPlacementIntelligence';
import TpoRoleManager from './components/admin/TpoRoleManager';
import FraudActivityMonitor from './components/admin/FraudActivityMonitor';

import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  BrainCircuit, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Megaphone, 
  User, 
  LogIn, 
  AlertTriangle, 
  Loader2,
  Target,
  Building,
  Calendar,
  Key,
  ShieldAlert,
  TrendingUp,
  Code2
} from 'lucide-react';

function AppContent() {
  const { 
    currentUser, 
    currentRole, 
    authLoading,
    toast, 
    isAuthModalOpen, 
    closeAuthModal,
    openAuthModal,
    companies 
  } = useApp();
  
  // Navigation tabs state per role
  const [studentTab, setStudentTab] = useState('dashboard');
  const [recruiterTab, setRecruiterTab] = useState('dashboard');
  const [adminTab, setAdminTab] = useState('dashboard');

  // Tab definitions for Student
  const studentNavItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'jobs', label: 'Job Openings', icon: Briefcase },
    { id: 'drives', label: 'Campus Drives', icon: Building },
    { id: 'applications', label: 'My Applications', icon: Trophy },
    { id: 'assessments', label: 'Online Assessments', icon: Code2 },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'resume-analyzer', label: 'AI ATS Scanner', icon: BrainCircuit },
    { id: 'mock-interview', label: 'AI Mock Interview', icon: Sparkles }
  ];

  // Tab definitions for Recruiter
  const recruiterNavItems = [
    { id: 'dashboard', label: 'Recruiter Hub', icon: LayoutDashboard },
    { id: 'applicants', label: 'Applicants Pipeline', icon: Users }
  ];

  // Tab definitions for Admin (TPO Suite - 14 Comprehensive Features)
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'approvals', label: 'Recruiters', icon: ShieldCheck },
    { id: 'job-approvals', label: 'Job Approvals', icon: Briefcase },
    { id: 'eligibility', label: 'Eligibility', icon: Target },
    { id: 'drives', label: 'Drives', icon: Building },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'announcements', label: 'Notices', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'ai-matching', label: 'AI Matching', icon: BrainCircuit },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'roles', label: 'Staff Roles', icon: Key },
    { id: 'fraud-monitor', label: 'Fraud Alerts', icon: ShieldAlert }
  ];

  // Check if current recruiter's company is pending TPC approval
  const currentRecruiterCompany = companies.find(c => 
    c.id === currentUser?.companyId || c.name === currentUser?.companyName
  );
  const isCompanyPending = currentRole === 'recruiter' && currentRecruiterCompany?.status === 'Pending';

  // Loading spinner during auth bootstrap
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
          <Sparkles className="w-6 h-6 text-amber-300" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Restoring HireLoop sessions…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-semibold border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main App Navbar with Role Switcher & User Account */}
      <Navbar onNavigate={(targetTab) => {
        if (currentRole === 'student') setStudentTab(targetTab);
        else if (currentRole === 'recruiter') setRecruiterTab(targetTab);
        else if (currentRole === 'admin') setAdminTab(targetTab);
      }} />

      {/* Recruiter Pending TPC Verification Alert Banner */}
      {isCompanyPending && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-slate-950" />
          <span>
            Notice: Company registration for <strong>{currentRecruiterCompany?.name}</strong> is currently pending TPC Placement Cell authorization. You can draft and propose campus jobs; they will go live to students once verified by the Placement Dean.
          </span>
        </div>
      )}

      {/* Sub-Navbar / Role Tab Navigation Bar (Shown when authenticated in current role) */}
      {currentUser && (
        <div className="no-print bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
                {currentRole === 'student' && studentNavItems.map(tab => {
                  const Icon = tab.icon;
                  const isActive = studentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStudentTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                {currentRole === 'recruiter' && recruiterNavItems.map(tab => {
                  const Icon = tab.icon;
                  const isActive = recruiterTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setRecruiterTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                {currentRole === 'admin' && adminNavItems.map(tab => {
                  const Icon = tab.icon;
                  const isActive = adminTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAdminTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-50 text-purple-800 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Switch / Sign In Trigger */}
              <button
                onClick={() => openAuthModal('login', currentRole)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Switch Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* If not authenticated in the selected role panel: show Role-Specific Gate */}
        {!currentUser && <WelcomeGate targetRole={currentRole} />}

        {/* STUDENT ROLE SCREENS (Active only when authenticated as Student) */}
        {currentRole === 'student' && currentUser && (
          <>
            {studentTab === 'dashboard' && <StudentDashboard onNavigate={setStudentTab} />}
            {studentTab === 'profile' && <StudentProfile onNavigate={setStudentTab} />}
            {studentTab === 'jobs' && <JobBoard onNavigate={setStudentTab} />}
            {studentTab === 'drives' && <StudentDrivesPortal onNavigate={setStudentTab} />}
            {studentTab === 'applications' && <ApplicationTracker onNavigate={setStudentTab} />}
            {studentTab === 'assessments' && <AssessmentCenter onNavigate={setStudentTab} />}
            {studentTab === 'resume-builder' && <ResumeBuilder />}
            {studentTab === 'resume-analyzer' && <ResumeAnalyzer />}
            {studentTab === 'mock-interview' && <MockInterview />}
          </>
        )}

        {/* RECRUITER ROLE SCREENS (Active only when authenticated as Recruiter) */}
        {currentRole === 'recruiter' && currentUser && (
          <>
            {recruiterTab === 'dashboard' && <RecruiterDashboard onNavigate={setRecruiterTab} />}
            {recruiterTab === 'applicants' && <ApplicantManager />}
          </>
        )}

        {/* PLACEMENT CELL (TPC ADMIN) ROLE SCREENS - 14 Comprehensive Features */}
        {currentRole === 'admin' && currentUser && (
          <>
            {adminTab === 'dashboard' && <PlacementDashboard onNavigate={setAdminTab} />}
            {adminTab === 'students' && <StudentManagement />}
            {adminTab === 'approvals' && <CompanyApprovals />}
            {adminTab === 'job-approvals' && <JobApprovals />}
            {adminTab === 'eligibility' && <EligibilityManager />}
            {adminTab === 'drives' && <DriveManager />}
            {adminTab === 'applications' && <ApplicationMasterTracker />}
            {adminTab === 'interviews' && <InterviewScheduler />}
            {adminTab === 'announcements' && <AnnouncementBoard />}
            {adminTab === 'analytics' && <PlacementAnalytics />}
            {adminTab === 'ai-matching' && <AiPlacementIntelligence />}
            {adminTab === 'reports' && <PlacementReports />}
            {adminTab === 'roles' && <TpoRoleManager />}
            {adminTab === 'fraud-monitor' && <FraudActivityMonitor />}
          </>
        )}

      </main>

      {/* Global Modals */}
      <PaymentModal />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
      />

      {/* Footer (No Print) */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">HireLoop (RecruitLoop)</span>
            <span>— Autonomous Campus Placement & AI Career Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>DevFusion Hackathon 2026</span>
            <span>•</span>
            <span>Problem Statement 3</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
