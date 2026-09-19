import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import BrandLogo from '../common/BrandLogo';
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building,
  Users,
  FileText,
  BrainCircuit,
  Calendar,
  Award,
  BarChart3,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Zap,
  Target,
  Trophy
} from 'lucide-react';

export default function HomePage() {
  const {
    openAuthModal,
    loginAsDemoStudent,
    loginAsDemoRecruiter,
    loginAsDemoAdmin
  } = useApp();

  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'recruiters' | 'tpo'

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#2563EB] selection:text-white">
      
      {/* 1. Public Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <BrandLogo size="md" subtitle="Campus Placement & Hiring Platform" />

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#64748B]">
            <a href="#features" className="hover:text-[#0F172A] transition-colors">Features</a>
            <a href="#for-roles" className="hover:text-[#0F172A] transition-colors">Who It's For</a>
            <a href="#how-it-works" className="hover:text-[#0F172A] transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-[#0F172A] transition-colors">Impact & Stats</a>
          </nav>

          {/* Quick Access CTA */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openAuthModal('login', 'student')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('portals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Next-Gen Enterprise Campus Recruitment Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Bridging Students, Recruiters & <span className="text-[#1E3A8A]">University Placement Cells</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            The unified placement operating system. Experience 1-Click campus applications, AI-powered ATS resume matching, corporate hiring drives, and institutional compliance governance in one seamless ecosystem.
          </p>

          {/* 3 Role Gate Cards */}
          <div id="portals" className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            
            {/* Student Card */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center border border-blue-100">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Student Portal</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Verified college profile, 1-Click job applications, AI ATS resume score, and live mock interviews.
                  </p>
                </div>
                <div className="space-y-1.5 text-xs text-[#0F172A] pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Auto-verified CGPA & roll numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Direct campus drive passes</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal('login', 'student')}
                    className="w-full py-2 px-3 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('register', 'student')}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    Register
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => loginAsDemoStudent()}
                  className="w-full py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] border border-blue-200 text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#2563EB]" />
                  <span>1-Click Demo Student (Aarav)</span>
                </button>
              </div>
            </div>

            {/* Recruiter Card */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Corporate Recruiter Hub</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Post verified campus roles, filter candidate resumes by skills and CGPA, and manage hiring stages.
                  </p>
                </div>
                <div className="space-y-1.5 text-xs text-[#0F172A] pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Zero fraudulent or inflated resumes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Kanban applicant pipeline</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal('login', 'recruiter')}
                    className="w-full py-2 px-3 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('register', 'recruiter')}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    Register
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => loginAsDemoRecruiter()}
                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>1-Click Demo Recruiter (Razorpay)</span>
                </button>
              </div>
            </div>

            {/* Admin / TPO Card */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">TPC Directorate (Admin)</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Verify visiting employers, enforce institutional eligibility rules, schedule drive venues, and view reports.
                  </p>
                </div>
                <div className="space-y-1.5 text-xs text-[#0F172A] pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Dream/Super-Dream policy lock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Real-time batch placement analytics</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal('login', 'admin')}
                    className="w-full py-2 px-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    TPO Login
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('register', 'admin')}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    Register
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => loginAsDemoAdmin()}
                  className="w-full py-1.5 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>1-Click Instant TPO Login (Dean)</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Platform Impact Stats Bar */}
      <section id="stats" className="py-12 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-[14px] bg-slate-50/70 border border-[#E2E8F0]">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A]">94.2%</div>
              <div className="text-xs font-semibold text-[#64748B] mt-1">University Placement Rate</div>
            </div>
            <div className="p-4 rounded-[14px] bg-slate-50/70 border border-[#E2E8F0]">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">120+</div>
              <div className="text-xs font-semibold text-[#64748B] mt-1">Verified Corporate Recruiters</div>
            </div>
            <div className="p-4 rounded-[14px] bg-slate-50/70 border border-[#E2E8F0]">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#16A34A]">₹48.0 LPA</div>
              <div className="text-xs font-semibold text-[#64748B] mt-1">Highest Domestic Package</div>
            </div>
            <div className="p-4 rounded-[14px] bg-slate-50/70 border border-[#E2E8F0]">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB]">100%</div>
              <div className="text-xs font-semibold text-[#64748B] mt-1">Academic Record Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What is RecruitLoop? (Core Value Proposition) */}
      <section id="features" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
              Unified Placement Architecture
            </h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
              One Operating System for Campus Hiring
            </h3>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Traditional campus placements suffer from lost emails, fake resume scores, manual spreadsheet tracking, and chaotic drive days. RecruitLoop digitizes and unifies the entire placement lifecycle.
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center border border-blue-100">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">For Students</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Apply to verified campus openings in 1-Click with your college-authenticated CGPA and credentials. Get instant ATS feedback on your resume and practice with AI voice mock interviews.
              </p>
              <ul className="space-y-2 text-xs text-[#0F172A] pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>1-Click campus job applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>AI ATS match score & keyword suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Campus drive entry pass with QR code</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">For Corporate Recruiters</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Access pre-verified student candidate pools without fraud or inflated grades. Manage your hiring funnel with a drag-and-drop Kanban pipeline and schedule Google Meet technical interviews.
              </p>
              <ul className="space-y-2 text-xs text-[#0F172A] pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Direct job posting with custom criteria</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Automated ATS ranking of candidate resumes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Integrated interview scheduling & offer rollout</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">For TPO / University Admin</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Maintain complete institutional control. Approve visiting employers, enforce Dream and Super-Dream offer policies, coordinate multi-lab test sessions, and generate audit-ready placement reports.
              </p>
              <ul className="space-y-2 text-xs text-[#0F172A] pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Employer verification & blacklist controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Dual-offer freeze & policy enforcement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Department & branch performance analytics</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Interactive Role Feature Deep Dive */}
      <section id="for-roles" className="py-16 md:py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Designed Specifically for Each Stakeholder
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Select a role to see how RecruitLoop simplifies your daily placement tasks.
            </p>

            {/* Role Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-[#E2E8F0] mt-4">
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'students' 
                    ? 'bg-white text-[#1E3A8A] shadow-xs' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                🎓 For Students
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recruiters')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'recruiters' 
                    ? 'bg-white text-emerald-800 shadow-xs' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                💼 For Recruiters
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tpo')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tpo' 
                    ? 'bg-white text-purple-800 shadow-xs' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                🛡 For TPO Directorate
              </button>
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="bg-slate-50/70 rounded-[20px] border border-[#E2E8F0] p-8 max-w-4xl mx-auto">
            {activeTab === 'students' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E2E8F0] pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#0F172A]">Student Career Acceleration Suite</h4>
                    <p className="text-xs text-[#64748B]">From resume building to offer letter acceptance in one dashboard.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login', 'student')}
                    className="px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
                  >
                    Enter Student Portal →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#1E3A8A]" />
                      <span>Official PDF Resume Upload & Parser</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Upload your personal PDF resume. Text is cleanly parsed and synced across your campus applications.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-[#1E3A8A]" />
                      <span>AI ATS Score & Keyword Match</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Check compatibility scores against company job descriptions and identify missing technical keywords.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                      <span>AI Mock Technical Interview</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Practice role-specific coding and behavioral interview questions with real-time feedback.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-[#1E3A8A]" />
                      <span>Live Application & Offer Tracker</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Monitor your shortlisting, interview calls, and officially accept or decline placement offers.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recruiters' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E2E8F0] pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#0F172A]">Corporate Hiring & Screening Console</h4>
                    <p className="text-xs text-[#64748B]">Source, screen, and interview authenticated university candidates.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login', 'recruiter')}
                    className="px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold cursor-pointer"
                  >
                    Enter Recruiter Hub →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>Post Campus Openings</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Configure branch criteria, minimum CGPA, backlog limits, and compensation packages.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>Kanban Candidate Pipeline</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Review applicants, view ATS match scores, and move candidates between stages seamlessly.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Google Meet & Room Scheduler</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Schedule virtual Google Meet interviews or allocate university campus interview rooms.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Direct Offer Rollouts</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Issue official placement offer letters directly into candidate portals with acceptance tracking.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tpo' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E2E8F0] pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#0F172A]">Placement Cell (TPC) Directorate</h4>
                    <p className="text-xs text-[#64748B]">Institutional governance, policy enforcement, and accreditation analytics.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login', 'admin')}
                    className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Enter TPO Directorate →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>Company Whitelisting & Rejections</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Review visiting companies. Rejected companies are immediately blocked from student views.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-purple-700" />
                      <span>Dream / Super Dream Policy Lock</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Enforce campus rules: once a student lands a Dream offer, standard company applications freeze.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-purple-700" />
                      <span>University Placement Analytics</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">View branch-wise placement percentages, median salary packages, and company visit histories.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                    <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-purple-700" />
                      <span>Fraud & Dual-Offer Monitor</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Detect profile discrepancies, ERP vs resume score mismatches, and multiple conflicting offers.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 6. How It Works (3 Steps) */}
      <section id="how-it-works" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              How RecruitLoop Works
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Streamlined end-to-end recruitment process from verification to final selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1E3A8A] font-extrabold text-sm flex items-center justify-center mx-auto border border-blue-200">
                1
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Register & Verify</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Students register with their verified roll number and branch. Recruiters register company profiles, which are reviewed and authorized by the TPO Cell.
              </p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16A34A] font-extrabold text-sm flex items-center justify-center mx-auto border border-emerald-200">
                2
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Match & Apply</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Eligible students apply in 1-Click. AI calculates ATS match scores and recruiters receive pre-screened talent pools matching job requirements.
              </p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 text-center space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 font-extrabold text-sm flex items-center justify-center mx-auto border border-purple-200">
                3
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">Interview & Offer</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Interviews are scheduled via Google Meet or campus test centers. Final offers are rolled out with automated compliance and policy locks.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Public Minimal Footer */}
      <footer className="bg-white py-8 border-t border-[#E2E8F0] text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-6">
            <span>© 2026 RecruitLoop / HireLoop Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#0F172A]">
            <button type="button" onClick={() => openAuthModal('login', 'student')} className="hover:underline cursor-pointer">Student Portal</button>
            <button type="button" onClick={() => openAuthModal('login', 'recruiter')} className="hover:underline cursor-pointer">Recruiter Hub</button>
            <button type="button" onClick={() => openAuthModal('login', 'admin')} className="hover:underline cursor-pointer">TPO Directorate</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
