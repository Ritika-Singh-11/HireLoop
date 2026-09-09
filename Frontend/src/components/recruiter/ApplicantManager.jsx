import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  Calendar, 
  Trophy, 
  XCircle, 
  Sparkles, 
  Mail, 
  ChevronRight, 
  FileText,
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
  DollarSign,
  Loader2,
  ShieldCheck,
  Award,
  Code2
} from 'lucide-react';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import OfferLetterModal from '../common/OfferLetterModal';
import { api } from '../../services/api';

export default function ApplicantManager() {
  const { applications, jobs, updateApplicationStatus, showToast } = useApp();

  const [selectedJobId, setSelectedJobId] = useState('All');
  const [minCgpaFilter, setMinCgpaFilter] = useState('0');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillSearch, setSkillSearch] = useState('');
  
  // Modal states
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [previewApp, setPreviewApp] = useState(null);
  const [issuingOfferApp, setIssuingOfferApp] = useState(null);
  const [previewOffer, setPreviewOffer] = useState(null);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // Offer Letter Generation Form
  const [offerForm, setOfferForm] = useState({
    designation: 'Software Development Engineer - I',
    totalLpa: 20,
    baseLpa: 15,
    variableBonusLpa: 3.5,
    joiningBonus: 1.5,
    joiningDate: '2026-07-15',
    location: 'Bengaluru HQ / Hybrid',
    signatoryName: 'Campus Talent Acquisition Head',
    signatoryTitle: 'Director - University Relations & Hiring',
    termsAndConditions: 'Subject to successful degree completion with minimum 7.0 CGPA and standard background verification.'
  });

  const filteredApplicants = useMemo(() => {
    return applications.filter(app => {
      if (selectedJobId !== 'All' && app.jobId !== selectedJobId) return false;
      if (statusFilter !== 'All' && app.status !== statusFilter) return false;
      if (branchFilter !== 'All' && !app.studentBranch.toLowerCase().includes(branchFilter.toLowerCase())) return false;
      if (parseFloat(app.studentCgpa) < parseFloat(minCgpaFilter)) return false;
      if (skillSearch.trim()) {
        const query = skillSearch.toLowerCase();
        const hasSkill = (app.studentSkills || []).some(s => s.toLowerCase().includes(query));
        const hasName = app.studentName.toLowerCase().includes(query);
        if (!hasSkill && !hasName) return false;
      }
      return true;
    });
  }, [applications, selectedJobId, statusFilter, branchFilter, minCgpaFilter, skillSearch]);

  const openIssueOfferModal = (app) => {
    const matchedJob = jobs.find(j => j.id === app.jobId);
    const ctcStr = matchedJob?.salary || '20 LPA';
    const parsedNum = parseFloat(ctcStr.replace(/[^0-9.]/g, '')) || 20.0;
    const base = (parsedNum * 0.75).toFixed(1);
    const bonus = (parsedNum * 0.18).toFixed(1);
    const join = (parsedNum * 0.07).toFixed(1);

    setOfferForm({
      designation: app.jobTitle || matchedJob?.title || 'Software Development Engineer - I',
      totalLpa: parsedNum,
      baseLpa: parseFloat(base),
      variableBonusLpa: parseFloat(bonus),
      joiningBonus: parseFloat(join),
      joiningDate: '2026-07-15',
      location: matchedJob?.location || 'Bengaluru HQ / Hybrid',
      signatoryName: 'Arun Sharma',
      signatoryTitle: 'Head of Campus Talent Acquisition',
      termsAndConditions: 'Subject to successful completion of degree with minimum 7.0 CGPA and standard background verification clearance.'
    });
    setIssuingOfferApp(app);
  };

  const handleTotalCtcChange = (newTotal) => {
    const total = parseFloat(newTotal) || 0;
    setOfferForm(prev => ({
      ...prev,
      totalLpa: newTotal,
      baseLpa: (total * 0.75).toFixed(1),
      variableBonusLpa: (total * 0.18).toFixed(1),
      joiningBonus: (total * 0.07).toFixed(1)
    }));
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!issuingOfferApp) return;

    setIsSubmittingOffer(true);
    const app = issuingOfferApp;
    const offerCode = `TPC-OFFER-2026-${(app.id || 'CAND').toString().slice(-4).toUpperCase()}`;

    const offerData = {
      package: `₹${offerForm.totalLpa} LPA`,
      totalLpa: parseFloat(offerForm.totalLpa),
      designation: offerForm.designation,
      joiningDate: offerForm.joiningDate,
      location: offerForm.location,
      baseSalary: `₹${offerForm.baseLpa} LPA`,
      variableBonus: `₹${offerForm.variableBonusLpa} LPA`,
      joiningBonus: `₹${offerForm.joiningBonus} LPA`,
      signatoryName: offerForm.signatoryName,
      signatoryTitle: offerForm.signatoryTitle,
      termsAndConditions: offerForm.termsAndConditions,
      offerCode,
      validTill: '2026-08-31'
    };

    try {
      await api.issueOffer({
        applicationId: app.id,
        designation: offerForm.designation,
        ctc: {
          totalLpa: parseFloat(offerForm.totalLpa),
          baseLpa: parseFloat(offerForm.baseLpa),
          variableBonusLpa: parseFloat(offerForm.variableBonusLpa || 0),
          joiningBonus: parseFloat(offerForm.joiningBonus || 0),
          currency: 'INR'
        },
        joiningDate: offerForm.joiningDate,
        location: offerForm.location,
        signatoryName: offerForm.signatoryName,
        signatoryTitle: offerForm.signatoryTitle,
        termsAndConditions: offerForm.termsAndConditions
      });
    } catch (err) {
      console.warn('Backend offer API notice (fallback local sync active):', err.message || err);
    } finally {
      setIsSubmittingOffer(false);
    }

    updateApplicationStatus(app.id, 'Offer', {
      offer: offerData,
      notes: `Official Campus Offer Extended: ${offerForm.designation} with ₹${offerForm.totalLpa} LPA`
    });

    if (showToast) {
      showToast(`Official Campus Offer extended to ${app.studentName}!`);
    }

    setIssuingOfferApp(null);

    // Automatically preview the generated offer letter
    const generatedOffer = {
      id: app.id,
      offerCode,
      companyName: app.companyName,
      companyLogo: app.companyLogo || '🏢',
      studentName: app.studentName,
      studentRoll: app.studentRoll,
      studentBranch: app.studentBranch,
      designation: offerForm.designation,
      ctc: {
        totalLpa: parseFloat(offerForm.totalLpa),
        baseLpa: parseFloat(offerForm.baseLpa),
        variableBonusLpa: parseFloat(offerForm.variableBonusLpa || 0),
        joiningBonus: parseFloat(offerForm.joiningBonus || 0),
        currency: 'INR'
      },
      joiningDate: offerForm.joiningDate,
      location: offerForm.location,
      status: 'issued',
      signatoryName: offerForm.signatoryName,
      signatoryTitle: offerForm.signatoryTitle,
      termsAndConditions: offerForm.termsAndConditions,
      createdAt: new Date().toISOString()
    };
    setPreviewOffer(generatedOffer);
  };

  const handlePreviewOffer = (app) => {
    const details = app.offerDetails || app.offer || {};
    const pkgNum = parseFloat(details.package ? details.package.replace(/[^0-9.]/g, '') : (details.totalLpa || 20.0)) || 20.0;
    const offerObj = {
      id: app.id,
      offerCode: details.offerCode || `TPC-OFFER-2026-${(app.id || '2026').toString().slice(-4).toUpperCase()}`,
      companyName: app.companyName,
      companyLogo: app.companyLogo || '🏢',
      studentName: app.studentName,
      studentRoll: app.studentRoll,
      studentBranch: app.studentBranch,
      designation: details.designation || app.jobTitle || 'Software Development Engineer',
      ctc: {
        totalLpa: pkgNum,
        baseLpa: details.baseSalary ? parseFloat(details.baseSalary.toString().replace(/[^0-9.]/g, '')) : (pkgNum * 0.75).toFixed(2),
        variableBonusLpa: details.variableBonus ? parseFloat(details.variableBonus.toString().replace(/[^0-9.]/g, '')) : (pkgNum * 0.20).toFixed(2),
        joiningBonus: details.joiningBonus ? parseFloat(details.joiningBonus.toString().replace(/[^0-9.]/g, '')) : (pkgNum * 0.05).toFixed(2),
        currency: 'INR'
      },
      joiningDate: details.joiningDate || '2026-07-15',
      location: details.location || 'Bangalore, India',
      status: app.offerAccepted ? 'accepted' : app.offerDeclined ? 'declined' : 'issued',
      signatoryName: details.signatoryName || 'Campus Talent Acquisition Head',
      signatoryTitle: details.signatoryTitle || 'Director - University Relations',
      termsAndConditions: details.termsAndConditions,
      createdAt: app.appliedDate || new Date().toISOString()
    };
    setPreviewOffer(offerObj);
  };

  const handleQuickStatus = (app, newStatus) => {
    if (newStatus === 'Offer') {
      openIssueOfferModal(app);
    } else {
      updateApplicationStatus(app.id, newStatus);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Campus Applicant Pipeline & ATS Shortlisting
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review candidates, filter by eligibility criteria, schedule interview slots, and extend offers
            </p>
          </div>

          {/* Job Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter by Opening:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Campus Openings ({jobs.length})</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.companyName} — {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multi-Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div>
            <input
              type="text"
              placeholder="Search candidate name or skill..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="0">All CGPA</option>
              <option value="7.5">CGPA &ge; 7.5</option>
              <option value="8.0">CGPA &ge; 8.0</option>
              <option value="8.5">CGPA &ge; 8.5</option>
              <option value="9.0">CGPA &ge; 9.0</option>
            </select>
          </div>

          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="All">All Disciplines</option>
              <option value="Computer Science">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="Electronics">ECE</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="All">All Pipeline Stages</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Offer">Offer Extended</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applicants Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50/50">
          <span>Showing {filteredApplicants.length} Candidate Profiles</span>
          <span>One-Click Status Updates & Interview Scheduling</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredApplicants.map((app) => {
            const isOffer = app.status === 'Offer';
            const isInterview = app.status === 'Interview Scheduled';
            const isShortlisted = app.status === 'Shortlisted';

            return (
              <div key={app.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Candidate Bio */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                      {app.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{app.studentName}</h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {app.studentRoll}
                        </span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          CGPA: {app.studentCgpa}
                        </span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>ATS {app.matchScore}%</span>
                        </span>
                        {app.assessmentScore !== undefined ? (
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            app.assessmentPassed !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            <Code2 className="w-3 h-3" />
                            <span>Test {app.assessmentScore}% ({app.assessmentPassed !== false ? 'Passed' : 'Failed'})</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                            <Code2 className="w-3 h-3 text-slate-400" />
                            <span>Test Pending</span>
                          </span>
                        )}
                        {app.mockInterviewScore !== undefined && (
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            <span>AI Mock {app.mockInterviewScore}%</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 mt-1">
                        <span>{app.studentBranch}</span> • <span className="text-slate-700 font-semibold">{app.jobTitle}</span> ({app.companyName})
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(app.studentSkills || []).slice(0, 6).map((sk, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pipeline Actions & Status */}
                  <div className="flex flex-wrap items-center gap-2 lg:self-center">
                    
                    {/* Status Pill */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      isOffer
                        ? 'bg-emerald-100 text-emerald-800'
                        : isInterview
                        ? 'bg-purple-100 text-purple-800'
                        : isShortlisted
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {app.status}
                    </span>

                    {/* Action buttons */}
                    <button
                      onClick={() => handleQuickStatus(app, 'Shortlisted')}
                      disabled={isShortlisted || isInterview || isOffer}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() => setSchedulingApp(app)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Interview Slot</span>
                    </button>

                    {isOffer ? (
                      <button
                        onClick={() => handlePreviewOffer(app)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        title="Preview generated campus offer letterhead"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Offer Letter</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openIssueOfferModal(app)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Extend Offer</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleQuickStatus(app, 'Rejected')}
                      disabled={app.status === 'Rejected'}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Reject candidate"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setPreviewApp(app)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Details
                    </button>
                  </div>

                </div>

                {/* Cover letter or interview notice if present */}
                {app.interviewDetails && (
                  <div className="mt-3 p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-xs text-purple-900 flex items-center justify-between">
                    <span>
                      <strong>Slot Scheduled:</strong> {app.interviewDetails.round} on {app.interviewDetails.date} at {app.interviewDetails.time} ({app.interviewDetails.interviewer})
                    </span>
                    <a
                      href={app.interviewDetails.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-purple-700 underline"
                    >
                      Open Meet Link
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          {filteredApplicants.length === 0 && (
            <div className="text-center py-12 p-8">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No applicants match this criteria</h4>
              <p className="text-xs text-slate-500 mt-1">Try resetting the CGPA, branch, or stage filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        application={schedulingApp}
        isOpen={!!schedulingApp}
        onClose={() => setSchedulingApp(null)}
        onSchedule={(appId, details) => updateApplicationStatus(appId, 'Interview Scheduled', details)}
      />

      {/* Candidate Profile Details Drawer / Modal */}
      {previewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{previewApp.studentName}</h3>
                <p className="text-xs text-slate-500">{previewApp.studentRoll} • {previewApp.studentEmail}</p>
              </div>
              <button onClick={() => setPreviewApp(null)} className="text-slate-400 hover:text-slate-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-500 font-semibold block">Branch / Discipline:</span>
                  <span className="text-slate-800 font-bold">{previewApp.studentBranch}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Academic CGPA:</span>
                  <span className="text-slate-800 font-bold">{previewApp.studentCgpa} / 10.0</span>
                </div>
              </div>

              {previewApp.coverLetter && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Submitted Cover Letter:</h4>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                    {previewApp.coverLetter}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Technical Skills:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(previewApp.studentSkills || []).map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Campus Placement Offer Modal */}
      {issuingOfferApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <Trophy className="w-5 h-5 text-emerald-100" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Issue Campus Placement Offer</h3>
                  <p className="text-xs text-emerald-100/90">
                    Generate an official university-authenticated appointment letter
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIssuingOfferApp(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Summary Pill Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{issuingOfferApp.studentName}</span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  {issuingOfferApp.studentRoll}
                </span>
                <span className="text-slate-500">• {issuingOfferApp.studentBranch}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <span>{issuingOfferApp.companyName}</span>
                <span className="text-slate-400">/</span>
                <span className="text-indigo-600">{issuingOfferApp.jobTitle}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOffer} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Designation */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Designation / Job Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={offerForm.designation}
                    onChange={(e) => setOfferForm({ ...offerForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Software Development Engineer - I"
                  />
                </div>

                {/* Work Location */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Joining Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={offerForm.location}
                    onChange={(e) => setOfferForm({ ...offerForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Bengaluru HQ / Hybrid"
                  />
                </div>
              </div>

              {/* CTC Breakdown Box */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Compensation & CTC Structure (INR)
                  </span>
                  <span className="text-[11px] text-emerald-700">Auto-balanced base & variables</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Total CTC (LPA) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      required
                      value={offerForm.totalLpa}
                      onChange={(e) => handleTotalCtcChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 font-extrabold text-emerald-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Base Salary (LPA)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={offerForm.baseLpa}
                      onChange={(e) => setOfferForm({ ...offerForm, baseLpa: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Variable Bonus (LPA)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={offerForm.variableBonusLpa}
                      onChange={(e) => setOfferForm({ ...offerForm, variableBonusLpa: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Sign-on / Reloc Bonus
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={offerForm.joiningBonus}
                      onChange={(e) => setOfferForm({ ...offerForm, joiningBonus: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Joining Date & Signatory Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={offerForm.joiningDate}
                    onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Signatory / HR Lead <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={offerForm.signatoryName}
                    onChange={(e) => setOfferForm({ ...offerForm, signatoryName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Arun Sharma"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Signatory Title
                  </label>
                  <input
                    type="text"
                    value={offerForm.signatoryTitle}
                    onChange={(e) => setOfferForm({ ...offerForm, signatoryTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Talent Acquisition Lead"
                  />
                </div>
              </div>

              {/* Special Conditions & Terms */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Offer Terms & Eligibility Prerequisites
                </label>
                <textarea
                  rows={2}
                  value={offerForm.termsAndConditions}
                  onChange={(e) => setOfferForm({ ...offerForm, termsAndConditions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="Degree completion, background verification terms..."
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIssuingOfferApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingOffer}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingOffer ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Letterhead...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Issue Official Campus Offer</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Official Offer Letter Modal (Printable & Downloadable Vector PDF) */}
      <OfferLetterModal
        isOpen={!!previewOffer}
        onClose={() => setPreviewOffer(null)}
        offer={previewOffer}
      />

    </div>
  );
}
