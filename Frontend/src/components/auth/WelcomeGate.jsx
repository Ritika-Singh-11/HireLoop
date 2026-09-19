import React from 'react';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock
} from 'lucide-react';

export default function WelcomeGate({ targetRole }) {
  const { currentRole, openAuthModal, roleUsers, setCurrentRole, loginAsDemoStudent, loginAsDemoRecruiter, loginAsDemoAdmin } = useApp();
  const role = targetRole || (currentRole === 'guest' ? 'student' : currentRole);

  const isStudent = role === 'student';
  const isRecruiter = role === 'recruiter';
  const isAdmin = role === 'admin';

  // Check if other role is currently logged in
  const otherSession = isStudent 
    ? (roleUsers?.recruiter ? { role: 'recruiter', name: roleUsers.recruiter.name || roleUsers.recruiter.companyName, label: 'Recruiter Hub' } : null)
    : (roleUsers?.student ? { role: 'student', name: roleUsers.student.name, label: 'Student Portal' } : null);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      
      {/* Enterprise Role Gate Card */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-8 sm:p-10 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#E2E8F0]">
          <BrandLogo size="md" subtitle="Campus Recruitment & Placement Platform" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#1E3A8A]">
            {isStudent && <GraduationCap className="w-3.5 h-3.5 text-[#1E3A8A]" />}
            {isRecruiter && <Briefcase className="w-3.5 h-3.5 text-[#1E3A8A]" />}
            {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />}
            <span className="uppercase">{role} Authentication Required</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight leading-tight">
            {isStudent && (
              <>Enter the <span className="text-[#1E3A8A]">Student Placement Portal</span></>
            )}
            {isRecruiter && (
              <>Access the <span className="text-[#1E3A8A]">Corporate Recruiter Hub</span></>
            )}
            {isAdmin && (
              <>Access <span className="text-[#1E3A8A]">Placement Cell Directorate</span></>
            )}
          </h1>

          <p className="text-[#64748B] text-sm leading-relaxed max-w-xl">
            {isStudent && 'Sign in with your verified college credentials or create a new student profile to access 1-Click campus applications, AI resume analyzers, and mock interviews.'}
            {isRecruiter && 'Sign in with your corporate email or register your organization to post job openings, screen authenticated student profiles, and schedule placement drives.'}
            {isAdmin && 'Authorized access for Campus Placement Officers (TPC). Verify company registrations and monitor university hiring statistics.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal('login', role)}
            className="px-5 py-2.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In to {role.toUpperCase()}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => openAuthModal('register', role)}
            className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-xs border border-[#CBD5E1] transition-colors cursor-pointer"
          >
            <span>Register New {isStudent ? 'Student Profile' : isRecruiter ? 'Company' : 'TPO Administrator'}</span>
          </button>

          {isStudent && (
            <button
              type="button"
              onClick={() => loginAsDemoStudent()}
              className="px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] border border-blue-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>1-Click Demo Student</span>
            </button>
          )}

          {isRecruiter && (
            <button
              type="button"
              onClick={() => loginAsDemoRecruiter()}
              className="px-4 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1-Click Demo Recruiter</span>
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => loginAsDemoAdmin()}
              className="px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] border border-blue-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Quick 1-Click TPO Login</span>
            </button>
          )}
        </div>

        {/* If already logged into another role */}
        {otherSession && (
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>You are currently authenticated in <strong>{otherSession.label}</strong> as {otherSession.name}.</span>
            </span>
            <button
              type="button"
              onClick={() => setCurrentRole(otherSession.role)}
              className="font-semibold text-[#1E3A8A] hover:underline cursor-pointer ml-3"
            >
              Switch to {otherSession.label} →
            </button>
          </div>
        )}

      </div>

      {/* Feature Checklist */}
      <div className="bg-white rounded-[14px] p-5 border border-[#E2E8F0] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {isStudent && (
          <>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Verified Records</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Roll number and CGPA verified by campus placement cell.</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>AI Career Tools</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Instant ATS match scoring and voice AI mock interviews.</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Isolated Session</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Logging out only closes your student session.</p>
            </div>
          </>
        )}

        {isRecruiter && (
          <>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Candidates</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Zero fraud or unverified resumes from student applicants.</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hiring Pipeline</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Kanban workflow to screen, shortlist and offer jobs.</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Isolated Recruiter Auth</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Independent company account and secure multi-device sessions.</p>
            </div>
          </>
        )}

        {isAdmin && (
          <>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>TPC Whitelist</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Restricted administrative access for authorized placement cells.</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Campus Analytics</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Batch-wise offer rates, median package and branch metrics.</p>
            </div>
            <div className="p-3 bg-slate-50/70 border border-[#E2E8F0] rounded-lg space-y-1">
              <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Company Verification</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Approve visiting corporate entities and live drives.</p>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
