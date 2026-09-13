import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LiveInterviewRoomModal from '../common/LiveInterviewRoomModal';
import OfferLetterModal from '../common/OfferLetterModal';
import TestSandboxModal from './TestSandboxModal';
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

  const matchedApps = applications.filter(a => 
    a.studentId === student?.id || 
    (a.studentEmail && student?.email && a.studentEmail.toLowerCase() === student.email.toLowerCase()) ||
    (a.studentRoll && student?.rollNumber && a.studentRoll.toLowerCase() === student.rollNumber.toLowerCase()) ||
    (!a.studentId && a.studentName === student?.name)
  );
  const myApps = matchedApps.length > 0 ? matchedApps : applications;

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
      
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Placement Drive 2026 Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {student.name}!
            </h1>
            <p className="mt-2 text-indigo-100/90 text-sm max-w-2xl leading-relaxed">
              {student.branch} • Roll: <span className="font-mono text-white">{student.rollNumber}</span> • CGPA: <span className="font-bold text-amber-300">{student.cgpa}</span> / 10.0
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('resume-analyzer')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-all shadow-md flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>ATS Resume Check</span>
            </button>
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs border border-indigo-400/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Mock Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applied</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{myApps.length}</span>
            <span className="text-xs text-slate-500">Drives</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('assessments')}
          className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-700">Shortlisted</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{shortlistedCount}</span>
            <span className="text-xs text-amber-600 font-semibold flex items-center gap-0.5">
              Active Round <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interviews</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{interviewCount}</span>
            <span className="text-xs text-purple-600 font-semibold">Scheduled</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offers Received</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{offerCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">Congratulations!</span>
          </div>
        </div>
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
              <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/50 rounded-2xl border border-amber-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Code2 className="w-4 h-4 text-amber-600" />
                    <span>Round 2: Online Assessment (OA)</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeOaApp.companyName} — {activeOaApp.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Shortlisted for Technical Screening • Anti-Cheat Proctored Sandbox
                  </p>
                </div>

                <div className="mt-4 p-3 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 truncate max-w-[160px]">
                      {matchedAssessment?.title || 'Technical DSA Assessment'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
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
                    className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
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
              <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Upcoming Interview</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {upcomingInterview.companyName} — {upcomingInterview.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {interview.round || 'Technical Interview Round'}
                  </p>
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {interview.date || 'Scheduled'} at {interview.time || 'TBD'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Interviewer: {interview.interviewer || 'Campus Hiring Panel'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJoiningInterview(upcomingInterview)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Join Live Room</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {activeOffer && (() => {
            const offerDetails = activeOffer.offerDetails || activeOffer.offer || {};
            const pkgDisplay = offerDetails.package || (offerDetails.totalLpa ? `₹${offerDetails.totalLpa} LPA` : '₹18.5 LPA');
            return (
              <div className={`rounded-2xl border p-6 shadow-xs relative transition-all flex flex-col justify-between ${
                activeOffer.offerAccepted
                  ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border-emerald-300'
                  : activeOffer.offerDeclined
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2">
                    <Trophy className={`w-4 h-4 ${activeOffer.offerDeclined ? 'text-slate-500' : 'text-emerald-700'}`} />
                    <span className={activeOffer.offerDeclined ? 'text-slate-600' : 'text-emerald-700'}>
                      {activeOffer.offerAccepted
                        ? '🎉 Placement Offer Formally Accepted'
                        : activeOffer.offerDeclined
                        ? 'Placement Offer Declined'
                        : 'Active Placement Offer (Action Required)'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeOffer.companyName}
                    </h3>
                    <span className={`text-2xl font-black ${activeOffer.offerDeclined ? 'text-slate-400 line-through' : 'text-emerald-600'}`}>
                      {pkgDisplay}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    Role: {offerDetails.designation || activeOffer.jobTitle || 'Software Engineer'} • Location: {offerDetails.location || 'Bangalore, India'}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between pt-3 border-t border-slate-200/60 text-xs gap-2">
                  <span className="text-slate-500">
                    {activeOffer.offerAccepted
                      ? 'Status: Official contract confirmed with TPO Directorate'
                      : activeOffer.offerDeclined
                      ? 'Status: Candidate opted out'
                      : `Accept before: ${offerDetails.validTill || 'Soon'}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setSelectedOfferApp(activeOffer)}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        activeOffer.offerAccepted 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                          : activeOffer.offerDeclined 
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      }`}
                    >
                      <span>{activeOffer.offerAccepted ? 'View Signed Offer' : activeOffer.offerDeclined ? 'View Offer' : 'Review & Sign Offer'}</span>
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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Placement Cell Official Notices
            </h3>
          </div>
          <span className="text-xs text-slate-500">Updated today</span>
        </div>

        <div className="divide-y divide-slate-100">
          {announcements.slice(0, 3).map((ann) => (
            <div key={ann.id} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm hover:text-indigo-600 transition-colors">
                      {ann.title}
                    </span>
                    {ann.pinned && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                        {ann.badge || 'Urgent'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
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
          className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 mt-4 text-sm group-hover:text-indigo-600 transition-colors">
            Explore Open Drives
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Browse {jobs.length} campus openings with AI match scores & 1-click apply.
          </p>
        </div>

        <div
          onClick={() => onNavigate('assessments')}
          className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 mt-4 text-sm group-hover:text-amber-700 transition-colors">
            Online Assessments (OA)
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Proctored screening tests with real-time code editor & Aptitude MCQs.
          </p>
        </div>

        <div
          onClick={() => onNavigate('resume-builder')}
          className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 mt-4 text-sm group-hover:text-purple-600 transition-colors">
            Resume Builder & PDF
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Select modern campus templates and export your verified ATS resume.
          </p>
        </div>

        <div
          onClick={() => onNavigate('mock-interview')}
          className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 mt-4 text-sm group-hover:text-emerald-600 transition-colors">
            AI Mock Interview
          </h4>
          <p className="text-xs text-slate-500 mt-1">
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
