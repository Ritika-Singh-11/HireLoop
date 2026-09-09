import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Clock, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { calculateJobMatchScore } from '../../utils/aiEngine';
import CoverLetterModal from './CoverLetterModal';

export default function JobBoard() {
  const { jobs, applications, applyToJob, student } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [minCgpaFilter, setMinCgpaFilter] = useState('All');
  const [coverLetterJob, setCoverLetterJob] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Check if job is applied
  const appliedJobIds = useMemo(() => {
    return new Set(applications.filter(a => a.studentId === student.id).map(a => a.jobId));
  }, [applications, student.id]);

  // Filtered jobs with smart match scores
  const processedJobs = useMemo(() => {
    return jobs
      .filter(job => job.approved)
      .map(job => {
        const matchScore = calculateJobMatchScore(student, job);
        const isEligibleCgpa = student.cgpa >= job.minCgpa;
        const isEligibleBranch = job.eligibleBranches.some(b => 
          b.toLowerCase().includes(student.branch.toLowerCase()) || 
          b.toLowerCase().includes('all branches')
        );
        return {
          ...job,
          matchScore,
          isEligible: isEligibleCgpa && isEligibleBranch,
          isEligibleCgpa,
          isEligibleBranch
        };
      })
      .filter(job => {
        // Search filter
        const matchSearch = 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

        // Branch filter
        const matchBranch = selectedBranch === 'All' || 
          job.eligibleBranches.some(b => b.toLowerCase().includes(selectedBranch.toLowerCase()) || b.includes('All Branches'));

        // CGPA filter
        const matchCgpa = minCgpaFilter === 'All' || job.minCgpa <= parseFloat(minCgpaFilter);

        return matchSearch && matchBranch && matchCgpa;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobs, student, searchTerm, selectedBranch, minCgpaFilter]);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search / Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Campus Recruitment Job Openings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified campus drives for Batch {student.batch} • Sorted by AI Profile Compatibility
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {processedJobs.length} Positions Available
            </span>
          </div>
        </div>

        {/* Filter inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, company, or skills (e.g. React, Python)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All Branches</option>
              <option value="Computer Science">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="Electronics">ECE</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">Max CGPA Requirement</option>
              <option value="8.0">Eligible for &ge; 8.0 CGPA</option>
              <option value="7.5">Eligible for &ge; 7.5 CGPA</option>
              <option value="7.0">Eligible for &ge; 7.0 CGPA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid / List */}
      <div className="space-y-4">
        {processedJobs.map((job) => {
          const isApplied = appliedJobIds.has(job.id);
          const isExpanded = expandedJobId === job.id;

          return (
            <div
              key={job.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isApplied
                  ? 'border-emerald-200/90 shadow-xs'
                  : 'border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Company & Role info */}
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 border border-slate-200/70 shadow-xs">
                      {job.companyLogo || '🏢'}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {job.title}
                        </h3>
                        <span className="font-semibold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {job.companyName}
                        </span>
                        
                        {/* AI Match Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          job.matchScore >= 90
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : job.matchScore >= 75
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          <span>{job.matchScore}% Match</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location} ({job.mode})
                        </span>
                        <span>•</span>
                        <span className="font-extrabold text-slate-900">
                          {job.salaryDisplay}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          Min CGPA: <strong className="text-slate-800">{job.minCgpa}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Deadline: {job.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex flex-wrap items-center gap-2.5 lg:self-center">
                    <button
                      type="button"
                      onClick={() => setCoverLetterJob(job)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-600" />
                      <span>AI Cover Letter</span>
                    </button>

                    {isApplied ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => applyToJob(job)}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                      >
                        <span>1-Click Apply</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-xs font-medium"
                    >
                      {isExpanded ? 'Less' : 'Details'}
                    </button>
                  </div>

                </div>

                {/* Eligibility Warning if CGPA / Branch not matching */}
                {!job.isEligible && (
                  <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Eligibility check: {!job.isEligibleCgpa && `Required CGPA is ${job.minCgpa} (Your CGPA: ${student.cgpa}).`} {!job.isEligibleBranch && `Open for: ${job.eligibleBranches.join(', ')}.`}
                    </span>
                  </div>
                )}

                {/* Skills tags */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Skills:</span>
                  {job.requiredSkills.map((sk, idx) => {
                    const studentHasSkill = (student.skills || []).some(s => s.toLowerCase() === sk.toLowerCase());
                    return (
                      <span
                        key={idx}
                        className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium ${
                          studentHasSkill
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {sk} {studentHasSkill && '✓'}
                      </span>
                    );
                  })}
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-3 animate-fadeIn">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">About the Role:</h4>
                      <p className="leading-relaxed">{job.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="font-bold text-slate-900 block mb-1">Eligible Branches:</span>
                        <span>{job.eligibleBranches.join(' • ')}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="font-bold text-slate-900 block mb-1">Total Openings:</span>
                        <span>{job.openings} positions • Batch {job.eligibleBatch}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {processedJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Job Openings Matched</h3>
            <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or filters.</p>
          </div>
        )}
      </div>

      {/* AI Cover Letter Generator Modal */}
      <CoverLetterModal
        job={coverLetterJob}
        student={student}
        isOpen={!!coverLetterJob}
        onClose={() => setCoverLetterJob(null)}
        onApplyWithLetter={(job, letter) => applyToJob(job, letter)}
      />

    </div>
  );
}
