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
  ArrowUpRight,
  ShieldAlert,
  Target
} from 'lucide-react';
import { calculateJobMatchScore } from '../../utils/aiEngine';
import { checkCandidateEligibility } from '../../utils/eligibilityHelper';
import CoverLetterModal from './CoverLetterModal';

export default function JobBoard() {
  const { jobs, applications, applyToJob, student, eligibilityPolicy } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [minCgpaFilter, setMinCgpaFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [coverLetterJob, setCoverLetterJob] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Check if job is applied
  const appliedJobIds = useMemo(() => {
    return new Set(applications.filter(a => 
      (student?.id && a.studentId === student.id) ||
      (a.studentEmail && student?.email && a.studentEmail.toLowerCase() === student.email.toLowerCase()) ||
      (a.studentRoll && student?.rollNumber && a.studentRoll.toLowerCase() === student.rollNumber.toLowerCase())
    ).map(a => a.jobId));
  }, [applications, student]);

  // Smart branch normalization helper
  const matchesBranchSelection = (eligibleBranches = [], selected) => {
    if (selected === 'All') return true;
    if (!eligibleBranches || eligibleBranches.length === 0) return true;

    const sel = selected.toLowerCase().trim();
    const aliases = {
      cse: ['computer science', 'cse', 'comp sci', 'computing'],
      it: ['information technology', 'it', 'infotech'],
      ece: ['electronics', 'ece', 'communication', 'telecom'],
      eee: ['electrical', 'eee'],
      mech: ['mechanical', 'mech'],
      civil: ['civil']
    };

    return eligibleBranches.some(b => {
      const bLow = b.toLowerCase();
      if (bLow.includes('all branches') || bLow.includes('all streams') || bLow.includes('any')) {
        return true;
      }
      if (bLow.includes(sel)) return true;

      for (const [key, list] of Object.entries(aliases)) {
        if (sel.includes(key) || list.some(alias => sel.includes(alias))) {
          if (list.some(alias => bLow.includes(alias))) return true;
        }
      }
      return false;
    });
  };

  const matchesCgpaFilter = (jobMinCgpa, filterValue) => {
    if (filterValue === 'All') return true;
    if (filterValue === 'eligible') {
      return (student.cgpa || 0) >= jobMinCgpa;
    }
    const threshold = parseFloat(filterValue);
    return jobMinCgpa <= threshold;
  };

  // Filtered jobs with smart match scores & synchronized college/company eligibility
  const processedJobs = useMemo(() => {
    return jobs
      .filter(job => job.approved)
      .map(job => {
        const matchScore = calculateJobMatchScore(student, job);
        
        // Strict Synchronized Eligibility: College Placement Policy Overrides!
        const evalResult = checkCandidateEligibility({
          student,
          companyRequirement: job,
          collegePolicy: eligibilityPolicy,
          userApplications: applications
        });

        const isEligibleCgpa = (parseFloat(student.cgpa) || 0) >= (parseFloat(job.minCgpa) || 0);
        const isEligibleBranch = matchesBranchSelection(job.eligibleBranches, student.branch || '');
        const isEligibleBacklogs = job.maxBacklogs === undefined || (parseInt(student.backlogs) || 0) <= parseInt(job.maxBacklogs);
        const isEligibleBatch = !job.eligibleBatch || !student.batch || String(job.eligibleBatch).toLowerCase() === 'all' || String(job.eligibleBatch) === String(student.batch);

        return {
          ...job,
          matchScore,
          isEligible: evalResult.isEligible,
          passesCompany: evalResult.passesCompany,
          passesCollege: evalResult.passesCollege,
          collegeReasons: evalResult.collegeReasons,
          companyReasons: evalResult.companyReasons,
          allReasons: evalResult.allReasons,
          effectiveMinCgpa: evalResult.effectiveMinCgpa,
          effectiveMaxBacklogs: evalResult.effectiveMaxBacklogs,
          eligibilityDetails: evalResult,
          isEligibleCgpa,
          isEligibleBranch,
          isEligibleBacklogs,
          isEligibleBatch
        };
      })
      .filter(job => {
        if (onlyEligible && !job.isEligible) return false;

        // Search filter
        const matchSearch = 
          !searchTerm.trim() ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.requiredSkills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

        // Branch filter
        const matchBranch = matchesBranchSelection(job.eligibleBranches, selectedBranch);

        // CGPA filter
        const matchCgpa = matchesCgpaFilter(job.minCgpa, minCgpaFilter);

        // Mode filter
        const matchMode = modeFilter === 'All' || (job.mode || '').toLowerCase() === modeFilter.toLowerCase();

        return matchSearch && matchBranch && matchCgpa && matchMode;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobs, student, eligibilityPolicy, applications, searchTerm, selectedBranch, minCgpaFilter, modeFilter, onlyEligible]);

  const hasActiveFilters = searchTerm || selectedBranch !== 'All' || minCgpaFilter !== 'All' || modeFilter !== 'All' || onlyEligible;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('All');
    setMinCgpaFilter('All');
    setModeFilter('All');
    setOnlyEligible(false);
  };

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
          <div className="sm:col-span-4 relative">
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
              <option value="All">All Branches & Streams</option>
              <option value="Computer Science">Computer Science (CSE)</option>
              <option value="Information Technology">Information Technology (IT)</option>
              <option value="Electronics">Electronics & Comm (ECE)</option>
              <option value="Electrical">Electrical (EEE)</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All CGPA Requirements</option>
              <option value="eligible">Eligible for My CGPA ({student.cgpa})</option>
              <option value="7.0">Min CGPA &le; 7.0 (Accessible to All)</option>
              <option value="7.5">Min CGPA &le; 7.5</option>
              <option value="8.0">Min CGPA &le; 8.0</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setOnlyEligible(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                onlyEligible
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Only Jobs I'm Eligible For (CGPA &ge; Cutoff & Branch Match)</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-2.5 py-1 text-slate-400 hover:text-slate-700 font-semibold cursor-pointer underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <span className="text-[11px] text-slate-400">
            Showing {processedJobs.length} of {jobs.filter(j => j.approved).length} openings
          </span>
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
                        <span>Max Backlogs: <strong className="text-slate-800">{job.maxBacklogs !== undefined ? job.maxBacklogs : 0}</strong></span>
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
                      disabled={!job.isEligible}
                      onClick={() => setCoverLetterJob(job)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        !job.isEligible
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <FileText className={`w-3.5 h-3.5 ${!job.isEligible ? 'text-slate-300' : 'text-purple-600'}`} />
                      <span>AI Cover Letter</span>
                    </button>

                    {isApplied ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Applied</span>
                      </span>
                    ) : !job.isEligible ? (
                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed flex items-center gap-1.5 shadow-none"
                        title={job.allReasons?.join(' • ') || "You do not meet the academic eligibility cutoffs"}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span>{!job.passesCollege && job.passesCompany ? 'Ineligible (College Policy)' : 'Ineligible'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => applyToJob(job)}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>1-Click Apply</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-xs font-medium cursor-pointer"
                    >
                      {isExpanded ? 'Less' : 'Details'}
                    </button>
                  </div>

                </div>

                {/* Synchronized Eligibility Warning: College Directorate Policy vs Company Cutoff */}
                {!job.isEligible && (
                  <div className="mt-3 space-y-2">
                    {/* College Placement Directorate Restriction */}
                    {!job.passesCollege && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 animate-fadeIn">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="font-bold text-rose-950 flex items-center gap-1.5">
                              <span>Restricted by University Placement Directorate Policy</span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-rose-200 text-rose-900 rounded font-bold uppercase tracking-wider">College Rule</span>
                            </strong>
                          </div>
                          <ul className="list-disc list-inside text-rose-800 space-y-0.5">
                            {(job.collegeReasons || []).map((reason, rIdx) => (
                              <li key={rIdx}>{reason}</li>
                            ))}
                          </ul>
                          {job.passesCompany && (
                            <p className="text-[11px] text-rose-700 font-medium italic pt-0.5">
                              Note: Even though you meet {job.companyName}&apos;s company criteria, University Directorate rules take strict precedence and block this application.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Company Specific Cutoff (if failing company criteria too) */}
                    {!job.passesCompany && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-fadeIn">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <strong className="font-bold text-amber-950 block">Company Recruiter Cutoffs:</strong>
                          <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                            {(job.companyReasons || []).map((reason, rIdx) => (
                              <li key={rIdx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
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
