import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
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
  CheckCircle2, 
  Loader2,
  Sparkles
} from 'lucide-react';

function AppContent() {
  const { 
    currentUser, 
    currentRole, 
    authLoading,
    toast, 
    isAuthModalOpen, 
    closeAuthModal
  } = useApp();
  
  // Navigation tabs state per role
  const [studentTab, setStudentTab] = useState('dashboard');
  const [recruiterTab, setRecruiterTab] = useState('dashboard');
  const [adminTab, setAdminTab] = useState('dashboard');

  const currentActiveTab = 
    currentRole === 'student' ? studentTab :
    currentRole === 'recruiter' ? recruiterTab :
    adminTab;

  const handleNavigate = (targetTab) => {
    if (currentRole === 'student') setStudentTab(targetTab);
    else if (currentRole === 'recruiter') setRecruiterTab(targetTab);
    else if (currentRole === 'admin') setAdminTab(targetTab);
  };

  // Loading spinner during auth bootstrap
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1E3A8A] flex items-center justify-center shadow-md">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-[#64748B]">
          <Loader2 className="w-4 h-4 animate-spin text-[#1E3A8A]" />
          <span>Restoring RecruitLoop session…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-[#2563EB] selection:text-white">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#0F172A] text-white shadow-xl text-xs font-medium border border-[#334155]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Modern Enterprise Layout with Sidebar & TopHeader */}
      <AppLayout activeTab={currentActiveTab} onNavigate={handleNavigate}>
        {/* If not authenticated in the selected role panel: show Role-Specific Gate */}
        {!currentUser ? (
          <WelcomeGate targetRole={currentRole} />
        ) : (
          <>
            {/* STUDENT ROLE SCREENS */}
            {currentRole === 'student' && (
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

            {/* RECRUITER ROLE SCREENS */}
            {currentRole === 'recruiter' && (
              <>
                {recruiterTab === 'dashboard' && <RecruiterDashboard onNavigate={setRecruiterTab} />}
                {recruiterTab === 'applicants' && <ApplicantManager />}
              </>
            )}

            {/* PLACEMENT CELL (TPC ADMIN) ROLE SCREENS */}
            {currentRole === 'admin' && (
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
          </>
        )}
      </AppLayout>

      {/* Global Modals */}
      <PaymentModal />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
      />
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
