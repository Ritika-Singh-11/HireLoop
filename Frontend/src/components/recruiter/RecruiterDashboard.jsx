import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatCard from '../common/StatCard';
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
  GraduationCap,
  ShieldAlert
} from 'lucide-react';
import PostJobModal from './PostJobModal';
import EditJobModal from './EditJobModal';

export default function RecruiterDashboard({ onNavigate }) {
  const { jobs, applications, currentUser, companies } = useApp();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const recruiterCompany = (currentUser?.companyName || '').toLowerCase().trim();
  const isDemoRecruiter = !currentUser?.companyName || currentUser?.email === 'neha.recruiter@razorpay.com';

  const currentCompanyObj = React.useMemo(() => {
    if (!recruiterCompany) return null;
    return (companies || []).find(c => 
      (c.name && c.name.toLowerCase().trim() === recruiterCompany) ||
      (c.id && c.id === currentUser?.companyId)
    );
  }, [companies, recruiterCompany, currentUser]);

  const isRejected = currentCompanyObj?.status === 'Rejected';

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
      
      {/* Rejection Alert Banner if TPO rejected this company */}
      {isRejected && (
        <div className="p-4 rounded-[14px] bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-fadeIn">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm text-rose-900">
              Company Registration Declined by TPO Directorate
            </p>
            <p className="text-rose-700 leading-relaxed">
              Your organization "{currentUser?.companyName}" has been marked as Rejected by the campus placement cell. Posting new campus job openings, receiving new student applications, and coordinating drives are disabled. Please contact the TPO Directorate for resolution.
            </p>
          </div>
        </div>
      )}

      {/* Recruiter Welcome Header */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-[#1E3A8A] text-xs font-semibold mb-2.5 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Campus Recruitment Console 2026</span>
              {currentUser?.companyName && (
                <span className="ml-2 pl-2 border-l border-blue-200 text-[#1E3A8A] font-semibold flex items-center gap-1">
                  🏢 {currentUser.companyName}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Recruiter Talent Portal {currentUser?.companyName ? `• ${currentUser.companyName}` : ''}
            </h1>
            <p className="mt-1.5 text-[#64748B] text-sm max-w-2xl leading-relaxed">
              Manage university job postings, screen verified student profiles with ATS match analytics, and schedule interviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isRejected) return;
                setIsPostModalOpen(true);
              }}
              disabled={isRejected}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 ${
                isRejected 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white cursor-pointer'
              }`}
              title={isRejected ? 'Disabled: Company is rejected by TPO' : 'Post New Campus Job'}
            >
              <Plus className="w-4 h-4" />
              <span>Post New Campus Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row using StatCard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Jobs"
          value={myJobs.length}
          subtext="Live campus roles"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          label="Total Applicants"
          value={totalApps}
          subtext="Verified candidate profiles"
          icon={Users}
          color="indigo"
          onClick={() => onNavigate('applicants')}
        />
        <StatCard
          label="Shortlisted"
          value={shortlisted}
          subtext="Under active screening"
          icon={CheckCircle}
          color="amber"
        />
        <StatCard
          label="Interviews Scheduled"
          value={interviews}
          subtext="Confirmed slots"
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Posted Openings Summary */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0F172A]">Your Posted Campus Openings</h3>
            <p className="text-xs text-[#64748B]">Live positions visible to Batch 2026 students</p>
          </div>
          <button
            onClick={() => onNavigate('applicants')}
            className="text-xs font-semibold text-[#1E3A8A] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myJobs.length === 0 ? (
          <div className="p-10 text-center bg-slate-50/50">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-[#0F172A]">No Campus Openings Posted Yet</h4>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              You haven&apos;t posted any positions for {currentUser?.companyName || 'your organization'} yet. Click &quot;Post New Campus Job&quot; above to create your first campus drive opening.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {myJobs.map(job => {
              const jobApps = applications.filter(a => a.jobId === job.id);
            return (
              <div key={job.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-slate-50 border border-[#E2E8F0] flex items-center justify-center text-xl shrink-0">
                    {job.companyLogo || '🏢'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[#0F172A] text-sm">{job.title}</h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {job.salaryDisplay}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#64748B]">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span className="font-medium text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
                        Min CGPA: {job.minCgpa}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded">
                        Max Backlogs: {job.maxBacklogs !== undefined ? job.maxBacklogs : 0}
                      </span>
                      <span>•</span>
                      <span>Batch {job.eligibleBatch || '2026'}</span>
                      <span>•</span>
                      <span>Deadline: {job.deadline}</span>
                    </div>
                    {job.eligibleBranches && (
                      <div className="text-[11px] text-[#64748B] mt-1 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-[#64748B]" />
                        <span>Branches: {Array.isArray(job.eligibleBranches) ? job.eligibleBranches.join(', ') : job.eligibleBranches}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#0F172A]">{jobApps.length} Applicants</div>
                    <div className="text-[11px] text-[#64748B]">
                      {jobApps.filter(a => a.status === 'Shortlisted').length} shortlisted
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setEditingJob(job)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-semibold transition-colors border border-[#CBD5E1] flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Customize Min CGPA, Backlogs, Eligible Branches & Package"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    <span>Edit Eligibility</span>
                  </button>

                  <button
                    onClick={() => onNavigate('applicants')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
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
