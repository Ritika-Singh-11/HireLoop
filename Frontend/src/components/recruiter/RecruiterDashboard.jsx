import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Calendar, 
  Plus, 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Sliders,
  GraduationCap
} from 'lucide-react';
import PostJobModal from './PostJobModal';
import EditJobModal from './EditJobModal';

export default function RecruiterDashboard({ onNavigate }) {
  const { jobs, applications, currentUser } = useApp();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const recruiterCompany = (currentUser?.companyName || '').toLowerCase().trim();
  const isDemoRecruiter = !currentUser?.companyName || currentUser?.email === 'neha.recruiter@razorpay.com';

  const myJobs = React.useMemo(() => {
    if (!recruiterCompany) return jobs;
    return jobs.filter(j => 
      (j.companyName && j.companyName.toLowerCase().trim() === recruiterCompany) ||
      (j.recruiterId && j.recruiterId === currentUser?.id) ||
      (isDemoRecruiter && (!j.companyName || j.companyName.toLowerCase() === 'razorpay'))
    );
  }, [jobs, recruiterCompany, currentUser, isDemoRecruiter]);

  const myJobIds = React.useMemo(() => new Set(myJobs.map(j => String(j.id || j._id))), [myJobs]);

  const companyApps = React.useMemo(() => {
    if (!recruiterCompany && isDemoRecruiter) return applications;
    return applications.filter(a => 
      myJobIds.has(String(a.jobId)) ||
      (recruiterCompany && a.companyName && a.companyName.toLowerCase().trim() === recruiterCompany)
    );
  }, [applications, myJobIds, recruiterCompany, isDemoRecruiter]);

  const totalApps = companyApps.length;
  const shortlisted = companyApps.filter(a => a.status === 'Shortlisted').length;
  const interviews = companyApps.filter(a => a.status === 'Interview Scheduled').length;
  const offers = companyApps.filter(a => a.status === 'Offer').length;

  return (
    <div className="space-y-6">
      
      {/* Recruiter Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Recruitment Console 2026</span>
              {currentUser?.companyName && (
                <span className="ml-2 pl-2 border-l border-emerald-500/40 text-emerald-100 font-extrabold flex items-center gap-1">
                  🏢 {currentUser.companyName}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recruiter Talent Portal {currentUser?.companyName ? `• ${currentUser.companyName}` : ''}
            </h1>
            <p className="mt-2 text-emerald-100/90 text-sm max-w-2xl leading-relaxed">
              Manage university job postings, screen verified student profiles with ATS match analytics, and schedule interviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Campus Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Jobs</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{myJobs.length}</span>
            <span className="text-xs text-slate-500">Live Roles</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Applicants</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalApps}</span>
            <span className="text-xs text-blue-600 font-semibold">Verified Resumes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Shortlisted</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{shortlisted}</span>
            <span className="text-xs text-amber-600 font-semibold">Under Review</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Interviews Set</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{interviews}</span>
            <span className="text-xs text-purple-600 font-semibold">Calendar Slots</span>
          </div>
        </div>
      </div>

      {/* Posted Openings Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Posted Campus Openings</h3>
            <p className="text-xs text-slate-500">Live positions visible to Batch 2026 students</p>
          </div>
          <button
            onClick={() => onNavigate('applicants')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Manage All Candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myJobs.length === 0 ? (
          <div className="p-10 text-center bg-slate-50/50">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No Campus Openings Posted Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              You haven&apos;t posted any positions for {currentUser?.companyName || 'your organization'} yet. Click &quot;Post New Campus Job&quot; above to create your first campus drive opening.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myJobs.map(job => {
              const jobApps = applications.filter(a => a.jobId === job.id);
            return (
              <div key={job.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                    {job.companyLogo || '🏢'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {job.salaryDisplay}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        Min CGPA: {job.minCgpa}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Max Backlogs: {job.maxBacklogs !== undefined ? job.maxBacklogs : 0}
                      </span>
                      <span>•</span>
                      <span>Batch {job.eligibleBatch || '2026'}</span>
                      <span>•</span>
                      <span>Deadline: {job.deadline}</span>
                    </div>
                    {job.eligibleBranches && (
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-slate-400" />
                        <span>Branches: {Array.isArray(job.eligibleBranches) ? job.eligibleBranches.join(', ') : job.eligibleBranches}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900">{jobApps.length} Applicants</div>
                    <div className="text-[11px] text-slate-500">
                      {jobApps.filter(a => a.status === 'Shortlisted').length} shortlisted
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setEditingJob(job)}
                    className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all border border-indigo-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Customize Min CGPA, Backlogs, Eligible Branches & Package"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Edit Eligibility</span>
                  </button>

                  <button
                    onClick={() => onNavigate('applicants')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Applicants
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      {/* Edit Job & Eligibility Modal */}
      <EditJobModal
        isOpen={!!editingJob}
        job={editingJob}
        onClose={() => setEditingJob(null)}
      />

    </div>
  );
}
