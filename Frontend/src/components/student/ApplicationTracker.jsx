import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OfferLetterModal from '../common/OfferLetterModal';
import LiveInterviewRoomModal from '../common/LiveInterviewRoomModal';
import TestSandboxModal from './TestSandboxModal';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Trophy, 
  XCircle, 
  ExternalLink, 
  ArrowRight, 
  FileCheck,
  ChevronDown,
  Building,
  Sparkles,
  ShieldCheck,
  Check,
  Video,
  Code2,
  Play
} from 'lucide-react';

const STATUS_STEPS = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer'];

export default function ApplicationTracker() {
  const { 
    applications, 
    setApplications, 
    student, 
    showToast, 
    addNotification, 
    acceptOffer, 
    declineOffer,
    assessments,
    submissions,
    submitAssessmentAttempt
  } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [joiningInterview, setJoiningInterview] = useState(null);
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
      studentName: app.studentName || student.name,
      studentRoll: app.studentRoll || student.rollNumber,
      studentBranch: app.studentBranch || student.branch,
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

  const handleAcceptOffer = async (offerId) => {
    if (acceptOffer) {
      await acceptOffer(offerId);
    }
    setSelectedOfferApp(prev => prev ? { ...prev, offerAccepted: true, offerDeclined: false } : null);
  };

  const handleDeclineOffer = async (offerId) => {
    if (declineOffer) {
      await declineOffer(offerId);
    }
    setSelectedOfferApp(prev => prev ? { ...prev, offerDeclined: true, offerAccepted: false } : null);
  };

  const myApps = applications.filter(a => 
    a.studentId === student.id || 
    (a.studentEmail && student.email && a.studentEmail.toLowerCase() === student.email.toLowerCase()) ||
    (a.studentRoll && student.rollNumber && a.studentRoll.toLowerCase() === student.rollNumber.toLowerCase()) ||
    (!a.studentId && a.studentName === student.name)
  );

  const displayApps = myApps.length > 0 ? myApps : applications;

  const filteredApps = displayApps.filter(app => {
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  const getStepState = (currentStatus, stepName) => {
    if (currentStatus === 'Rejected') {
      return stepName === 'Applied' ? 'completed' : 'rejected';
    }
    const order = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepName);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Campus Placement Application Tracker
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status progression from 1-Click Apply to Final Placement Offer
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Offer'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === tab
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-5">
        {filteredApps.map((app) => {
          const isExpanded = expandedId === app.id;
          const isOffer = app.status === 'Offer';
          const isInterview = app.status === 'Interview Scheduled';
          const isRejected = app.status === 'Rejected';

          return (
            <div
              key={app.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOffer
                  ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-400/30'
                  : isInterview
                  ? 'border-indigo-300 shadow-sm'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="p-6">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-2xl shrink-0">
                      {app.companyLogo || '🏢'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {app.jobTitle}
                        </h3>
                        <span className="font-semibold text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {app.companyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Applied on: {app.appliedDate}</span>
                        <span>•</span>
                        <span>ATS Match: <strong className="text-slate-700">{app.matchScore}%</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      isOffer
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isInterview
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : isRejected
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : app.status === 'Shortlisted'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {isOffer && <Trophy className="w-3.5 h-3.5 text-emerald-600" />}
                      {isInterview && <Calendar className="w-3.5 h-3.5 text-purple-600" />}
                      {isRejected && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                      <span>{app.status}</span>
                    </span>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* 5-Step Visual Progression Stepper */}
                <div className="mt-8 relative">
                  <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                    {STATUS_STEPS.map((step, idx) => {
                      const state = getStepState(app.status, step);
                      return (
                        <div key={step} className="flex flex-col items-center text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              state === 'completed'
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                : state === 'current'
                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse'
                                : 'bg-white text-slate-400 border-2 border-slate-200'
                            }`}
                          >
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span
                            className={`mt-2 text-xs font-semibold ${
                              state === 'current'
                                ? 'text-indigo-700 font-bold'
                                : state === 'completed'
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Offer Letter Box if extended */}
                {(app.status === 'Offer' || app.status === 'Offered' || app.offerAccepted || app.offerDeclined) && (() => {
                  const offerDetails = app.offerDetails || {
                    designation: app.jobTitle || 'Software Development Engineer',
                    package: '₹18.5 LPA',
                    joiningDate: '2026-07-15',
                    location: 'Bangalore, India'
                  };
                  return (
                    <div className={`mt-6 p-5 rounded-2xl border transition-all ${
                      app.offerAccepted 
                        ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 shadow-sm'
                        : app.offerDeclined
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-gradient-to-r from-amber-50/70 via-emerald-50/70 to-teal-50 border-amber-200 shadow-md'
                    }`}>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        <div className="flex items-start gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 ${
                            app.offerAccepted
                              ? 'bg-emerald-600 shadow-emerald-600/30'
                              : app.offerDeclined
                              ? 'bg-slate-500 shadow-slate-500/20'
                              : 'bg-indigo-600 shadow-indigo-600/30 animate-pulse'
                          }`}>
                            {app.offerAccepted ? <CheckCircle2 className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                Official Campus Placement Offer
                              </span>
                              {app.offerAccepted ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  Accepted & Digitally Signed
                                </span>
                              ) : app.offerDeclined ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  Offer Declined
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                                  Decision Pending
                                </span>
                              )}
                            </div>

                            <div className="text-sm font-extrabold text-slate-950 mt-1">
                              {offerDetails.designation} • CTC: <span className="text-emerald-700 font-mono text-base">{offerDetails.package}</span>
                            </div>

                            <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span>Joining Date: <strong>{offerDetails.joiningDate}</strong></span>
                              <span>•</span>
                              <span>Location: <strong>{offerDetails.location}</strong></span>
                              {app.offerAccepted && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-700 font-medium">Status: Employment confirmed</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 lg:shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/60">
                          {!app.offerAccepted && !app.offerDeclined && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDeclineOffer(app.id || app._id)}
                                className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold border border-slate-300 hover:border-rose-200 transition-colors cursor-pointer"
                              >
                                Decline Offer
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAcceptOffer(app.id || app._id)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                <span>Accept & Sign</span>
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedOfferApp(app)}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileCheck className="w-4 h-4 text-emerald-400" />
                            <span>{app.offerAccepted ? 'View Signed Offer (PDF)' : 'View Full Offer (PDF)'}</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })()}

                {/* Online Assessment (OA Round) Callout if Shortlisted */}
                {(app.status === 'Shortlisted' || app.status === 'shortlisted' || app.status === 'Assessment' || app.status === 'OA') && (() => {
                  const completedSub = (submissions || []).find(s => 
                    (s.companyName && app.companyName && s.companyName.toLowerCase() === app.companyName.toLowerCase()) ||
                    s.assessmentId === app.jobId
                  );
                  return (
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50/50 to-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                          <Code2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                              Round 2: Online Technical Assessment (OA)
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                              Test Link Active
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-800 mt-0.5">
                            {app.companyName} Campus Screening Challenge • 60 Mins Timed Sandbox
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            {completedSub ? (
                              <span className={completedSub.passed ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                                Verified Score: {completedSub.percentage}% ({completedSub.passed ? 'PASSED' : 'NOT CLEARED'})
                              </span>
                            ) : (
                              'Includes Core Computer Science & Aptitude MCQs + Algorithmic Coding Challenge.'
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const matchedAsm = (assessments || []).find(a => 
                            a.jobId === app.jobId || 
                            (a.companyName && app.companyName && a.companyName.toLowerCase() === app.companyName.toLowerCase())
                          ) || assessments?.[0] || {
                            id: 'asm-1',
                            title: `${app.companyName} Campus Technical Assessment`,
                            companyName: app.companyName,
                            companyLogo: app.companyLogo || '💻',
                            durationMinutes: 60,
                            passingMarks: 60
                          };
                          setTakingAssessment(matchedAsm);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-300" />
                        <span>{completedSub ? 'Retake / Practice OA' : 'Launch OA Test Sandbox'}</span>
                      </button>
                    </div>
                  );
                })()}

                {/* Interview Callout if scheduled */}
                {(app.status === 'Interview Scheduled' || app.status === 'interview_scheduled' || app.interviewDetails || app.interview) && (
                  (() => {
                    const interview = app.interviewDetails || app.interview || {};
                    return (
                      <div className="mt-6 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                              {interview.round || 'Technical Interview'}
                            </div>
                            <div className="text-xs font-semibold text-slate-800">
                              {interview.date || 'TBD'} at {interview.time || 'TBD'} {interview.interviewer ? `(Interviewer: ${interview.interviewer})` : ''}
                            </div>
                            {interview.notes && (
                              <div className="text-[11px] text-slate-600 mt-0.5">
                                {interview.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setJoiningInterview(app)}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                        >
                          <Video className="w-4 h-4 text-emerald-300" />
                          <span>Join Live Interview Room</span>
                        </button>
                      </div>
                    );
                  })()
                )}

                {/* Collapsible Timeline History */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-slate-100 text-xs animate-fadeIn space-y-2">
                    <h4 className="font-bold text-slate-900 mb-2">Application Activity Log:</h4>
                    <div className="divide-y divide-slate-100">
                      {(app.history || []).map((h, i) => (
                        <div key={i} className="py-2 flex items-start justify-between gap-4">
                          <div>
                            <span className="font-semibold text-slate-800">{h.status}</span>
                            <p className="text-slate-500 mt-0.5">{h.note}</p>
                          </div>
                          <span className="text-slate-400 font-mono text-[11px] shrink-0">{h.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {filteredApps.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No applications in this category</h3>
            <p className="text-xs text-slate-500 mt-1">Check back later or apply to more campus drives.</p>
          </div>
        )}
      </div>

      {/* Official Offer Letter Modal */}
      {selectedOfferApp && (
        <OfferLetterModal
          isOpen={!!selectedOfferApp}
          onClose={() => setSelectedOfferApp(null)}
          offer={formatOffer(selectedOfferApp)}
          onAccept={handleAcceptOffer}
          onDecline={handleDeclineOffer}
        />
      )}

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

      {/* Proctored Assessment Sandbox Modal */}
      {takingAssessment && (
        <TestSandboxModal
          isOpen={!!takingAssessment}
          onClose={() => setTakingAssessment(null)}
          assessment={takingAssessment}
          onSubmitTest={submitAssessmentAttempt}
        />
      )}

    </div>
  );
}
