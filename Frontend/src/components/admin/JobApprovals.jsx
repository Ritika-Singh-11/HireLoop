import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Building, 
  DollarSign, 
  GraduationCap, 
  MapPin, 
  Eye, 
  X,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function JobApprovals() {
  const { jobs, approveJob, rejectJob } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [rejectModalJob, setRejectModalJob] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewJobModal, setViewJobModal] = useState(null);
  const [confirmingJobId, setConfirmingJobId] = useState(null);
  const [recentlyConfirmedIds, setRecentlyConfirmedIds] = useState(new Set());
  const [recentlyRejectedIds, setRecentlyRejectedIds] = useState(new Set());

  const handleApprove = async (job) => {
    const jobId = job.id || job._id;
    setConfirmingJobId(jobId);
    await approveJob(jobId);

    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.7 }
      });
    } catch {}

    setRecentlyConfirmedIds(prev => new Set(prev).add(jobId));
    setConfirmingJobId(null);

    setTimeout(() => {
      setRecentlyConfirmedIds(prev => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }, 3000);
  };

  const handleConfirmReject = async () => {
    if (rejectModalJob) {
      const jobId = rejectModalJob.id || rejectModalJob._id;
      await rejectJob(jobId, rejectReason);
      setRecentlyRejectedIds(prev => new Set(prev).add(jobId));
      setRejectModalJob(null);
      setRejectReason('');

      setTimeout(() => {
        setRecentlyRejectedIds(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      }, 3000);
    }
  };

  const getJobStatus = (job) => {
    if (job.approved === false && job.rejectionReason) return 'Rejected';
    if (job.approved === true) return 'Approved';
    return 'Pending';
  };

  const filteredJobs = jobs.filter(job => {
    const status = getJobStatus(job);
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = jobs.length;
  const approvedCount = jobs.filter(j => j.approved === true).length;
  const pendingCount = jobs.filter(j => j.approved === undefined || (j.approved === null)).length;
  const rejectedCount = jobs.filter(j => j.approved === false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Job & Drive Post Review</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Campus Job Approvals & CTC Verification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Scrutinize recruiter-submitted job descriptions, salary CTC disclosures, and ensure alignment with campus hiring policies.
        </p>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Openings</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          <span className="text-[11px] text-slate-400">All submitted jobs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-amber-700">Pending Review</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-amber-600 font-semibold">Requires TPO Action</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700">Published / Approved</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{approvedCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Live for Students</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-rose-700">Rejected Openings</span>
          <p className="text-2xl font-black text-rose-700 mt-1">{rejectedCount}</p>
          <span className="text-[11px] text-rose-600 font-semibold">Flagged / Withdrawn</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search job title, company, or job location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Job Approvals List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            No job postings match your search or filter.
          </div>
        ) : (
          filteredJobs.map(job => {
            const status = getJobStatus(job);
            return (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                    {job.companyLogo || '💼'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{job.title}</h3>
                      {status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Approved & Live
                        </span>
                      )}
                      {status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {job.companyName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location} ({job.mode || 'On-site'})
                      </span>
                      <span>•</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        {job.salaryDisplay || `${job.salaryMin} - ${job.salaryMax} LPA`}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        Min CGPA: {job.minCgpa || '6.5'}
                      </span>
                    </div>

                    {job.rejectionReason && (
                      <p className="mt-2 text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 inline-block">
                        <strong>Rejection Note:</strong> {job.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => setViewJobModal(job)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View JD</span>
                  </button>

                  {/* Dynamic Confirmation Button */}
                  <button
                    type="button"
                    onClick={() => handleApprove(job)}
                    disabled={confirmingJobId === (job.id || job._id)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      recentlyConfirmedIds.has(job.id || job._id)
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105 border border-emerald-400 font-extrabold animate-pulse'
                        : status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/90 border border-emerald-300 font-extrabold shadow-none'
                        : status === 'Rejected'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-2xs hover:shadow-sm'
                    }`}
                  >
                    {recentlyConfirmedIds.has(job.id || job._id) ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                        <span>Confirmed! 🎉</span>
                      </>
                    ) : status === 'Approved' ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirmed & Live</span>
                      </>
                    ) : status === 'Rejected' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Re-Confirm Job</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Confirm & Approve</span>
                      </>
                    )}
                  </button>

                  {/* Dynamic Rejection Button */}
                  <button
                    type="button"
                    onClick={() => setRejectModalJob(job)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      recentlyRejectedIds.has(job.id || job._id)
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105 border border-rose-400 font-extrabold animate-pulse'
                        : status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100/90 border border-rose-300 font-extrabold shadow-none'
                        : 'text-rose-600 hover:bg-rose-50 active:scale-95 border border-rose-200'
                    }`}
                  >
                    <XCircle className={`w-3.5 h-3.5 ${recentlyRejectedIds.has(job.id || job._id) ? 'text-white' : status === 'Rejected' ? 'text-rose-600' : 'text-rose-500'}`} />
                    <span>
                      {recentlyRejectedIds.has(job.id || job._id)
                        ? 'Rejected! ✗'
                        : status === 'Rejected'
                        ? 'Rejected & Flagged'
                        : 'Reject'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-base">Reject Job Posting</h3>
              </div>
              <button onClick={() => setRejectModalJob(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Provide feedback to <strong>{rejectModalJob.companyName}</strong> regarding why "<strong>{rejectModalJob.title}</strong>" does not meet campus recruitment guidelines.
            </p>

            <div className="mt-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Feedback / Rejection Reason:</label>
              <textarea
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. CTC breakdown contains unacceptable variable component, bond period exceeds guidelines, duplicate opening..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectModalJob(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Job Modal */}
      {viewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{viewJobModal.companyLogo || '💼'}</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{viewJobModal.title}</h3>
                  <p className="text-xs text-slate-500">{viewJobModal.companyName} • {viewJobModal.department || 'Engineering'}</p>
                </div>
              </div>
              <button onClick={() => setViewJobModal(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-semibold block">Offered CTC</span>
                  <span className="text-base font-black text-emerald-700">{viewJobModal.salaryDisplay}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-semibold block">Minimum CGPA</span>
                  <span className="text-base font-black text-indigo-700">{viewJobModal.minCgpa || '6.5'} / 10.0</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-semibold block">Work Mode</span>
                  <span className="text-base font-black text-slate-800">{viewJobModal.mode || 'Hybrid'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1">Job Description & Responsibilities:</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {viewJobModal.description || 'Full stack role involving architecture design, API development, performance scaling, and active collaboration with product teams.'}
                </p>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewJobModal.skills?.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-400 font-mono">ID: {viewJobModal.id || viewJobModal._id}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const j = viewJobModal;
                    setViewJobModal(null);
                    setRejectModalJob(j);
                  }}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    getJobStatus(viewJobModal) === 'Rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'text-rose-600 hover:bg-rose-50 border border-rose-200 active:scale-95'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{getJobStatus(viewJobModal) === 'Rejected' ? 'Rejected ✗' : 'Reject Job'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApprove(viewJobModal);
                    setViewJobModal(null);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                    getJobStatus(viewJobModal) === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  }`}
                >
                  {getJobStatus(viewJobModal) === 'Approved' ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Confirmed & Published ✓</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Confirm & Approve Job</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setViewJobModal(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
