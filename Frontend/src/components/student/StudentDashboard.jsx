import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LiveInterviewRoomModal from '../common/LiveInterviewRoomModal';
import OfferLetterModal from '../common/OfferLetterModal';
import TestSandboxModal from './TestSandboxModal';
import StatCard from '../common/StatCard';
import { 
  Briefcase, 
  Send, 
  CheckCircle, 
  Calendar, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  BrainCircuit, 
  Clock, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Video,
  Code2
} from 'lucide-react';

export default function StudentDashboard({ onNavigate }) {
  const { student, applications, jobs, announcements, assessments, acceptOffer, declineOffer } = useApp();
  const [joiningInterview, setJoiningInterview] = useState(null);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [takingAssessment, setTakingAssessment] = useState(null);

  const formatOffer = (app) => {
    if (!app) return null;
    const details = app.offerDetails || app.offer || {};
    const pkgStr = String(details.package || details.totalLpa || 18.5);
    const pkgNum = parseFloat(pkgStr.replace(/[^0-9.]/g, '')) || 18.5;
    const appIdStr = (app.id || app._id || 'APP').toString();
    const offerCode = details.offerCode || `TPC-OFFER-2026-${appIdStr.slice(-4).toUpperCase()}`;

    return {
      id: app.id || app._id,
      applicationId: app.id || app._id,
      offerCode,
      companyName: app.companyName,
      companyLogo: app.companyLogo || '🏢',
      studentName: app.studentName || student?.name || 'Candidate',
      studentRoll: app.studentRoll || student?.rollNumber || '21BCSE104',
      studentBranch: app.studentBranch || student?.branch || 'CSE',
      designation: details.designation || app.jobTitle || 'Software Development Engineer - I',
      ctc: {
        totalLpa: pkgNum,
        baseLpa: details.baseLpa ? Number(details.baseLpa) : Number((pkgNum * 0.75).toFixed(2)),
        variableBonusLpa: details.variableBonusLpa ? Number(details.variableBonusLpa) : Number((pkgNum * 0.20).toFixed(2)),
        joiningBonus: details.joiningBonus ? Number(details.joiningBonus) : Number((pkgNum * 0.05).toFixed(2)),
        currency: 'INR'
      },
      joiningDate: details.joiningDate || '2026-07-15',
      location: details.location || 'Bangalore, India',
      status: app.offerAccepted ? 'accepted' : app.offerDeclined ? 'declined' : 'issued',
      signatoryName: details.signatoryName || 'Sameer Verma',
      signatoryTitle: details.signatoryTitle || 'Head of Campus Talent Acquisition',
      createdAt: app.appliedDate || new Date().toISOString()
    };
  };

  const isDemoStudent = !student?.email || student?.email === 'aarav.sharma@campus.edu';
  const myApps = applications.filter(a => 
    (student?.id && a.studentId === student.id) || 
    (a.studentEmail && student?.email && a.studentEmail.toLowerCase() === student.email.toLowerCase()) ||
    (a.studentRoll && student?.rollNumber && a.studentRoll.toLowerCase() === student.rollNumber.toLowerCase()) ||
    (isDemoStudent && (a.studentName === 'Aarav Sharma' || a.studentId === 'stu-101'))
  );

  const shortlistedCount = myApps.filter(a => a.status === 'Shortlisted' || a.status === 'shortlisted').length;
  const interviewCount = myApps.filter(a => a.status === 'Interview Scheduled' || a.status === 'interview_scheduled' || a.interviewDetails || a.interview).length;
  const offerCount = myApps.filter(a => a.status === 'Offer' || a.status === 'Offered' || a.status === 'offered' || a.offerDetails || a.offer || a.offerAccepted).length;

  const upcomingInterview = myApps.find(a => 
    (a.status === 'Interview Scheduled' || a.status === 'interview_scheduled' || a.interviewDetails || a.interview) &&
    !a.offerAccepted && !a.offerDeclined && a.status !== 'Offer' && a.status !== 'Offered'
  );
  const activeOffer = myApps.find(a => 
    a.status === 'Offer' || a.status === 'Offered' || a.status === 'offered' || a.offerDetails || a.offer || a.offerAccepted || a.offerDeclined
  );
  const activeOaApp = myApps.find(a => 
    (a.status === 'Shortlisted' || a.status === 'shortlisted' || a.status === 'Assessment' || a.status === 'OA') &&
    !a.offerAccepted && !a.offerDeclined && a.status !== 'Offer' && a.status !== 'Offered'
  );

  return (
    <div className="space-y-6">
      
      {/* Enterprise Student Welcome Header */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-[#1E3A8A] text-xs font-semibold mb-2.5 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Campus Placement Season 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Welcome back, {student.name}
            </h1>
            <p className="mt-1.5 text-[#64748B] text-sm leading-relaxed">
              {student.branch} &bull; Roll: <span className="font-mono text-[#0F172A] font-medium">{student.rollNumber}</span> &bull; CGPA: <span className="font-semibold text-[#0F172A]">{student.cgpa}</span> / 10.0
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('resume-analyzer')}
              className="px-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-[#1E3A8A]" />
              <span>ATS Resume Check</span>
            </button>
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>AI Mock Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row using StatCard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Applications"
          value={myApps.length}
          subtext="Submitted drives"
          icon={Send}
          color="blue"
        />
        <StatCard
          label="Shortlisted"
          value={shortlistedCount}
          subtext="Active assessment rounds"
          icon={CheckCircle}
          color="amber"
          onClick={() => onNavigate('assessments')}
        />
        <StatCard
          label="Interviews"
          value={interviewCount}
          subtext="Scheduled rounds"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          label="Offers Received"
          value={offerCount}
          subtext={offerCount > 0 ? "Placement confirmed" : "In active consideration"}
          icon={Trophy}
          color="emerald"
        />
      </div>

      {/* Action alerts: Interview, OA & Offer spotlight */}
      {(upcomingInterview || activeOffer || activeOaApp) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeOaApp && (() => {
            const matchedAssessment = assessments?.find(as => 
              as.companyName?.toLowerCase().includes(activeOaApp.companyName?.toLowerCase()) ||
              activeOaApp.companyName?.toLowerCase().includes(as.companyName?.toLowerCase())
            ) || assessments?.[0];

            return (
              <div className="bg-white rounded-[14px] border border-amber-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Code2 className="w-4 h-4 text-amber-600" />
                    <span>Round 2: Online Assessment (OA)</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    {activeOaApp.companyName} — {activeOaApp.jobTitle}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 font-normal">
                    Shortlisted for Technical Screening • Anti-Cheat Proctored Sandbox
                  </p>
                </div>

                <div className="mt-4 p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#0F172A] truncate max-w-[160px]">
                      {matchedAssessment?.title || 'Technical DSA Assessment'}
                    </div>
                    <div className="text-[#64748B] text-[11px]">
                      {matchedAssessment?.duration || '60 mins'} • Proctored
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (matchedAssessment) {
                        setTakingAssessment(matchedAssessment);
                      } else {
                        onNavigate('assessments');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Start Test</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {upcomingInterview && (() => {
            const interview = upcomingInterview.interviewDetails || upcomingInterview.interview || {};
            return (
              <div className="bg-white rounded-[14px] border border-blue-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#1E3A8A] text-xs font-semibold uppercase tracking-wider mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Upcoming Interview</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    {upcomingInterview.companyName} — {upcomingInterview.jobTitle}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 font-normal">
                    {interview.round || 'Technical Interview Round'}
                  </p>
                </div>
                <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#0F172A]">
                      {interview.date || 'Scheduled'} at {interview.time || 'TBD'}
                    </div>
                    <div className="text-[#64748B] text-[11px]">
                      Interviewer: {interview.interviewer || 'Campus Hiring Panel'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJoiningInterview(upcomingInterview)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] text-white font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-200" />
                    <span>Join Room</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {activeOffer && (() => {
            const offerDetails = activeOffer.offerDetails || activeOffer.offer || {};
            const pkgDisplay = offerDetails.package || (offerDetails.totalLpa ? `₹${offerDetails.totalLpa} LPA` : '₹18.5 LPA');
            return (
              <div className={`rounded-[14px] border p-6 shadow-xs relative transition-all flex flex-col justify-between ${
                activeOffer.offerAccepted
                  ? 'bg-white border-emerald-300'
                  : activeOffer.offerDeclined
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-emerald-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Trophy className={`w-4 h-4 ${activeOffer.offerDeclined ? 'text-slate-500' : 'text-emerald-700'}`} />
                    <span className={activeOffer.offerDeclined ? 'text-slate-600' : 'text-emerald-700'}>
                      {activeOffer.offerAccepted
                        ? 'Placement Offer Accepted'
                        : activeOffer.offerDeclined
                        ? 'Placement Offer Declined'
                        : 'Active Placement Offer'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-semibold text-[#0F172A]">
                      {activeOffer.companyName}
                    </h3>
                    <span className={`text-xl font-bold ${activeOffer.offerDeclined ? 'text-slate-400 line-through' : 'text-emerald-600'}`}>
                      {pkgDisplay}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 font-normal">
                    Role: {offerDetails.designation || activeOffer.jobTitle || 'Software Engineer'} • Location: {offerDetails.location || 'Bangalore, India'}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between pt-3 border-t border-[#E2E8F0] text-xs gap-2">
                  <span className="text-[#64748B]">
                    {activeOffer.offerAccepted
                      ? 'Status: Confirmed with TPO Directorate'
                      : activeOffer.offerDeclined
                      ? 'Status: Candidate opted out'
                      : `Valid till: ${offerDetails.validTill || 'Soon'}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setSelectedOfferApp(activeOffer)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                        activeOffer.offerAccepted 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                          : activeOffer.offerDeclined 
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      <span>{activeOffer.offerAccepted ? 'View Signed Offer' : activeOffer.offerDeclined ? 'View Offer' : 'Review & Sign'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Pinned College Announcements */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-[#0F172A] text-base">
              Placement Cell Official Notices
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">Updated today</span>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {announcements.slice(0, 3).map((ann) => (
            <div key={ann.id} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0F172A] text-sm hover:text-[#1E3A8A] transition-colors">
                      {ann.title}
                    </span>
                    {ann.pinned && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                        {ann.badge || 'Urgent'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#64748B] mt-2">
                    <span>{ann.author}</span>
                    <span>•</span>
                    <span>{ann.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('jobs')}
          className="group cursor-pointer bg-white p-5 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm transition-all"
        >
          <div className="p-2.5 w-fit rounded-lg bg-blue-50 text-[#1E3A8A] group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-[#0F172A] mt-3.5 text-sm group-hover:text-[#1E3A8A] transition-colors">
            Explore Open Drives
          </h4>
          <p className="text-xs text-[#64748B] mt-1">
            Browse {jobs.length} campus openings with AI match scores & 1-click apply.
          </p>
        </div>

        <div
          onClick={() => onNavigate('assessments')}
          className="group cursor-pointer bg-white p-5 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-amber-400 hover:shadow-sm transition-all"
        >
          <div className="p-2.5 w-fit rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-[#0F172A] mt-3.5 text-sm group-hover:text-amber-700 transition-colors">
            Online Assessments (OA)
          </h4>
          <p className="text-xs text-[#64748B] mt-1">
            Proctored screening tests with real-time code editor & Aptitude MCQs.
          </p>
        </div>

        <div
          onClick={() => onNavigate('resume-builder')}
          className="group cursor-pointer bg-white p-5 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-indigo-400 hover:shadow-sm transition-all"
        >
          <div className="p-2.5 w-fit rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-[#0F172A] mt-3.5 text-sm group-hover:text-indigo-600 transition-colors">
            Resume Builder & PDF
          </h4>
          <p className="text-xs text-[#64748B] mt-1">
            Select modern campus templates and export your verified ATS resume.
          </p>
        </div>

        <div
          onClick={() => onNavigate('mock-interview')}
          className="group cursor-pointer bg-white p-5 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-emerald-400 hover:shadow-sm transition-all"
        >
          <div className="p-2.5 w-fit rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-[#0F172A] mt-3.5 text-sm group-hover:text-emerald-600 transition-colors">
            AI Mock Interview
          </h4>
          <p className="text-xs text-[#64748B] mt-1">
            Practice role-specific technical questions with speech & AI scorecards.
          </p>
        </div>
      </div>

      {/* In-App Live Interview Room Modal */}
      {joiningInterview && (
        <LiveInterviewRoomModal
          isOpen={!!joiningInterview}
          onClose={() => setJoiningInterview(null)}
          interviewData={joiningInterview}
          userRole="student"
          currentUserName={student?.name || 'Candidate'}
        />
      )}

      {/* Offer Letter Review & Signature Modal */}
      {selectedOfferApp && (
        <OfferLetterModal
          isOpen={!!selectedOfferApp}
          onClose={() => setSelectedOfferApp(null)}
          offer={formatOffer(selectedOfferApp)}
          onAccept={async (offerId) => {
            if (acceptOffer) await acceptOffer(offerId);
            setSelectedOfferApp(prev => prev ? { ...prev, offerAccepted: true, offerDeclined: false } : null);
          }}
          onDecline={async (offerId) => {
            if (declineOffer) await declineOffer(offerId);
            setSelectedOfferApp(prev => prev ? { ...prev, offerDeclined: true, offerAccepted: false } : null);
          }}
        />
      )}

      {/* Proctored Online Assessment Test Sandbox Modal */}
      {takingAssessment && (
        <TestSandboxModal
          isOpen={!!takingAssessment}
          onClose={() => setTakingAssessment(null)}
          assessment={takingAssessment}
          onSubmitTest={async (id, payload) => {
            console.log('OA attempt submitted from dashboard:', id, payload);
          }}
        />
      )}

    </div>
  );
}
