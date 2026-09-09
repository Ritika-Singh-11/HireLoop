import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Building2,
  Lock
} from 'lucide-react';

export default function WelcomeGate({ targetRole }) {
  const { currentRole, openAuthModal, roleUsers, setCurrentRole, loginAsDemoAdmin } = useApp();
  const role = targetRole || (currentRole === 'guest' ? 'student' : currentRole);

  const isStudent = role === 'student';
  const isRecruiter = role === 'recruiter';
  const isAdmin = role === 'admin';

  // Check if other role is currently logged in
  const otherSession = isStudent 
    ? (roleUsers?.recruiter ? { role: 'recruiter', name: roleUsers.recruiter.name || roleUsers.recruiter.companyName, label: 'Recruiter Hub' } : null)
    : (roleUsers?.student ? { role: 'student', name: roleUsers.student.name, label: 'Student Portal' } : null);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      
      {/* Role-Specific Hero Header */}
      <div className={`relative rounded-3xl overflow-hidden text-white p-8 sm:p-12 shadow-2xl border ${
        isStudent
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-900/40'
          : isRecruiter
          ? 'bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-emerald-900/40'
          : 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-purple-900/40'
      }`}>
        
        {/* Glow */}
        <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25 ${
          isStudent ? 'bg-indigo-500' : isRecruiter ? 'bg-emerald-500' : 'bg-purple-500'
        }`} />

        <div className="relative z-10 space-y-5 max-w-2xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wide">
            {isStudent && <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />}
            {isRecruiter && <Briefcase className="w-3.5 h-3.5 text-emerald-300" />}
            {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />}
            <span className="uppercase">{role} Authentication Required</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {isStudent && (
              <>Enter the <span className="text-indigo-400">Student Placement Portal</span></>
            )}
            {isRecruiter && (
              <>Access the <span className="text-emerald-400">Corporate Recruiter Hub</span></>
            )}
            {isAdmin && (
              <>Access <span className="text-purple-400">Placement Cell Directorate</span></>
            )}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {isStudent && 'Sign in with your verified college credentials or create a new student profile to access 1-Click campus applications, AI resume analyzers, and mock interviews.'}
            {isRecruiter && 'Sign in with your corporate email or register your organization to post job openings, screen authenticated student profiles, and schedule placement drives.'}
            {isAdmin && 'Authorized access for Campus Placement Officers (TPC). Verify company registrations and monitor university hiring statistics.'}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openAuthModal('login', role)}
              className={`px-5 py-3 rounded-xl text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                isStudent 
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30' 
                  : isRecruiter 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to {role.toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => openAuthModal('register', role)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
            >
              <span>Register New {isStudent ? 'Student Profile' : isRecruiter ? 'Company' : 'TPO Administrator'}</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => loginAsDemoAdmin()}
                className="px-4 py-3 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 border border-purple-400/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Quick 1-Click TPO Login</span>
              </button>
            )}
          </div>

          {/* If already logged into another role */}
          {otherSession && (
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>You are already authenticated in <strong>{otherSession.label}</strong> as {otherSession.name}.</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrentRole(otherSession.role)}
                className="underline font-bold text-white hover:text-indigo-300 cursor-pointer ml-3"
              >
                Switch to {otherSession.label} →
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Feature Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isStudent && (
          <>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Verified Records</span>
              </div>
              <p className="text-[11px] text-slate-500">Roll number and CGPA verified by campus placement cell.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>AI Career Tools</span>
              </div>
              <p className="text-[11px] text-slate-500">Instant ATS match scoring and voice AI mock interviews.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Isolated Session</span>
              </div>
              <p className="text-[11px] text-slate-500">Logging out only closes your student session.</p>
            </div>
          </>
        )}

        {isRecruiter && (
          <>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Candidates</span>
              </div>
              <p className="text-[11px] text-slate-500">Zero fraud or unverified resumes from student applicants.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hiring Pipeline</span>
              </div>
              <p className="text-[11px] text-slate-500">Kanban workflow to screen, shortlist and offer jobs.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Isolated Recruiter Auth</span>
              </div>
              <p className="text-[11px] text-slate-500">Independent company account and secure multi-device sessions.</p>
            </div>
          </>
        )}

        {isAdmin && (
          <>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>TPC Whitelist</span>
              </div>
              <p className="text-[11px] text-slate-500">Restricted administrative access for authorized placement cells.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Campus Analytics</span>
              </div>
              <p className="text-[11px] text-slate-500">Batch-wise offer rates, median package and branch metrics.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Company Verification</span>
              </div>
              <p className="text-[11px] text-slate-500">Approve visiting corporate entities and live drives.</p>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
