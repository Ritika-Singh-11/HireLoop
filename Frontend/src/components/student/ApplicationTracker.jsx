import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OfferLetterModal from '../common/OfferLetterModal';
import { api } from '../../services/api';
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
  Sparkles
} from 'lucide-react';

const STATUS_STEPS = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer'];

export default function ApplicationTracker() {
  const { applications, setApplications, student, showToast, addNotification } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);

  const formatOffer = (app) => {
    if (!app) return null;
    const details = app.offerDetails || {};
    const pkgNum = parseFloat(details.package ? details.package.replace(/[^0-9.]/g, '') : 18.5) || 18.5;
    return {
      id: app.id,
      offerCode: `TPC-OFFER-2026-${app.id.slice(-4).toUpperCase()}`,
      companyName: app.companyName,
      companyLogo: app.companyLogo || '🏢',
      studentName: app.studentName || student.name,
      studentRoll: app.studentRoll || student.rollNumber,
      studentBranch: app.studentBranch || student.branch,
      designation: details.designation || 'Software Development Engineer - I',
      ctc: {
        totalLpa: pkgNum,
        baseLpa: (pkgNum * 0.75).toFixed(2),
        variableBonusLpa: (pkgNum * 0.20).toFixed(2),
        joiningBonus: (pkgNum * 0.05).toFixed(2),
        currency: 'INR'
      },
      joiningDate: details.joiningDate || '2026-07-15',
      location: details.location || 'Bangalore, India',
      status: app.offerAccepted ? 'accepted' : app.offerDeclined ? 'declined' : 'issued',
      signatoryName: 'Sameer Verma',
      signatoryTitle: 'Head of Campus Talent Acquisition',
      createdAt: app.appliedDate || new Date().toISOString()
    };
  };

  const handleAcceptOffer = (offerId) => {
    setApplications(prev => prev.map(a => a.id === offerId ? {
      ...a,
      offerAccepted: true,
      history: [...(a.history || []), { status: 'Offer Accepted', date: new Date().toISOString().split('T')[0], note: 'Offer accepted and digitally signed by candidate' }]
    } : a));
    setSelectedOfferApp(prev => prev ? { ...prev, offerAccepted: true } : null);
    addNotification({
      role: 'admin',
      title: 'Candidate Accepted Offer',
      message: `${student.name} accepted the placement offer from ${selectedOfferApp?.companyName}.`,
      type: 'success',
      category: 'application'
    });
  };

  const handleDeclineOffer = (offerId) => {
    setApplications(prev => prev.map(a => a.id === offerId ? {
      ...a,
      offerDeclined: true,
      history: [...(a.history || []), { status: 'Offer Declined', date: new Date().toISOString().split('T')[0], note: 'Offer declined by candidate' }]
    } : a));
    setSelectedOfferApp(prev => prev ? { ...prev, offerDeclined: true } : null);
  };

  const myApps = applications.filter(a => a.studentId === student.id);

  const filteredApps = myApps.filter(app => {
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
                {app.status === 'Offer' && app.offerDetails && (
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          Official Campus Placement Offer
                        </div>
                        <div className="text-sm font-extrabold text-slate-900">
                          Designation: {app.offerDetails.designation} • CTC: <span className="text-emerald-700">{app.offerDetails.package}</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Joining Date: {app.offerDetails.joiningDate} • Location: {app.offerDetails.location}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOfferApp(app)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>View Official Offer Letter (PDF)</span>
                    </button>
                  </div>
                )}

                {/* Interview Callout if scheduled */}
                {app.status === 'Interview Scheduled' && app.interviewDetails && (
                  <div className="mt-6 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                          {app.interviewDetails.round}
                        </div>
                        <div className="text-xs font-semibold text-slate-800">
                          {app.interviewDetails.date} at {app.interviewDetails.time} (Interviewer: {app.interviewDetails.interviewer})
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {app.interviewDetails.notes}
                        </div>
                      </div>
                    </div>
                    <a
                      href={app.interviewDetails.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>Join Live Meeting</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
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
      <OfferLetterModal
        isOpen={!!selectedOfferApp}
        onClose={() => setSelectedOfferApp(null)}
        offer={formatOffer(selectedOfferApp)}
        onAccept={handleAcceptOffer}
        onDecline={handleDeclineOffer}
      />

    </div>
  );
}
