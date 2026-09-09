import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Users, 
  Building, 
  FileText, 
  Megaphone, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Award,
  DollarSign,
  Briefcase,
  Target,
  Calendar,
  ShieldAlert,
  BrainCircuit,
  Key,
  Layers
} from 'lucide-react';
import { PLACEMENT_STATS } from '../../data/mockData';

export default function PlacementDashboard({ onNavigate }) {
  const { 
    companies, 
    jobs, 
    applications, 
    announcements, 
    studentsList, 
    drivesList, 
    fraudAlerts 
  } = useApp();

  const [backendStats, setBackendStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getPlacementStats();
        if (res?.stats) {
          setBackendStats(res.stats);
        }
      } catch (err) {
        console.warn('Using client dashboard fallback:', err);
      }
    }
    loadStats();
  }, []);

  const totalStudents = backendStats?.totalStudents ?? studentsList.length;
  const placedCount = backendStats?.placedStudents ?? studentsList.filter(s => s.placedCompany).length;
  const placementRate = backendStats?.placementRate ?? Math.round((placedCount / (totalStudents || 1)) * 100);

  const pendingCompanies = backendStats?.pendingCompanyApprovals ?? companies.filter(c => c.status === 'Pending').length;
  const pendingJobs = backendStats?.pendingJobApprovals ?? jobs.filter(j => j.approved === undefined || j.approved === null).length;
  const totalPendingApprovals = pendingCompanies + pendingJobs;

  const liveDrivesCount = backendStats?.liveDrives ?? drivesList.filter(d => d.status === 'Live').length;
  const activeAlertsCount = fraudAlerts.filter(a => !a.status.startsWith('Resolved')).length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold mb-3 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Placement Cell & Training Directorate (TPO Suite)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Placement Administration Console
            </h1>
            <p className="mt-2 text-purple-100/90 text-sm max-w-2xl leading-relaxed">
              Unified control center overseeing campus recruitment drives, student academic validations, corporate authorizations, interview scheduling, and AI talent matching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2.5 rounded-xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-purple-700" />
              <span>Generate TPO Report</span>
            </button>
            <button
              onClick={() => onNavigate('drives')}
              className="px-4 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs border border-purple-400/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>Manage Drives ({liveDrivesCount} Live)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Level Metric Cards (Live reactive values) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Placed Students */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Placed Students</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{placedCount}</span>
            <span className="text-xs text-slate-500">/ {totalStudents} Enrolled</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{placementRate}% Placement Rate</span>
          </div>
        </div>

        {/* Corporate Partners */}
        <div 
          onClick={() => onNavigate('approvals')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Recruiters</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{companies.length}</span>
            <span className="text-xs text-slate-500">Companies</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-semibold">
            {pendingCompanies > 0 ? (
              <span className="text-amber-600 font-bold">⚠️ {pendingCompanies} Verification Pending</span>
            ) : (
              <span className="text-emerald-600 font-bold">✓ All verified</span>
            )}
          </div>
        </div>

        {/* Active Campus Openings */}
        <div 
          onClick={() => onNavigate('job-approvals')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Campus Job Openings</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{jobs.length}</span>
            <span className="text-xs text-slate-500">Listings</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-indigo-600">
            {pendingJobs > 0 ? `${pendingJobs} awaiting approval` : 'All jobs approved'}
          </div>
        </div>

        {/* Pending Action Items */}
        <div 
          onClick={() => onNavigate(activeAlertsCount > 0 ? 'fraud-monitor' : 'job-approvals')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-rose-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Approvals / Alerts</span>
            <div className={`p-2 rounded-xl ${totalPendingApprovals + activeAlertsCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-700">{totalPendingApprovals + activeAlertsCount}</span>
            <span className="text-xs text-slate-500">Tasks</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-rose-600">
            {activeAlertsCount} Compliance Flags • {totalPendingApprovals} Reviews
          </div>
        </div>
      </div>

      {/* Operational Hub Quick Links (14 Features Navigation Gateway) */}
      <div>
        <h2 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" />
          <span>TPO Operational Management Suite</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Feature 2: Student Management */}
          <div
            onClick={() => onNavigate('students')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Student Management</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Verify academic records, view profiles, or enforce suspensions.</p>
            </div>
          </div>

          {/* Feature 4: Job Approvals */}
          <div
            onClick={() => onNavigate('job-approvals')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Job Post Approvals</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Approve or reject recruiter openings and verify CTC packages.</p>
            </div>
          </div>

          {/* Feature 5: Eligibility Management */}
          <div
            onClick={() => onNavigate('eligibility')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Eligibility Policy</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Configure CGPA cutoffs, backlog caps, and Dream offer rules.</p>
            </div>
          </div>

          {/* Feature 6: Drive Management */}
          <div
            onClick={() => onNavigate('drives')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Drive Management</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Create phased campus drives and transition rounds live.</p>
            </div>
          </div>

          {/* Feature 7: Application Management */}
          <div
            onClick={() => onNavigate('applications')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Application Tracker</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Master tracker of every candidate application and status.</p>
            </div>
          </div>

          {/* Feature 8: Interview Scheduling */}
          <div
            onClick={() => onNavigate('interviews')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Interview Scheduling</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Allocate test venues, Google Meet links, and panel slots.</p>
            </div>
          </div>

          {/* Feature 11: AI Matching & ATS */}
          <div
            onClick={() => onNavigate('ai-matching')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-purple-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">AI Placement Matching</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Neural talent matching, batch ATS audits, and recommendations.</p>
            </div>
          </div>

          {/* Feature 14: Fraud Monitor */}
          <div
            onClick={() => onNavigate('fraud-monitor')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-rose-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Fraud Surveillance</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Detect dual-offer violations and ERP mark discrepancies.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Branch-wise Placement Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Branch-Wise Placement Performance</h3>
            <p className="text-xs text-slate-500">Discipline-wise student placements and average package</p>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Detailed Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4 pt-2">
          {PLACEMENT_STATS.branchStats.map((br, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-slate-800">{br.branch}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    {br.placed} / {br.total} Placed ({br.percentage}%)
                  </span>
                  <span className="font-extrabold text-emerald-700">{br.avgCpa} Avg</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${br.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Quick Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('approvals')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-400 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-purple-50 text-purple-700 mb-3">
            <Building className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Company Approvals</h4>
          <p className="text-xs text-slate-500 mt-1">
            Authorize new corporate recruiters and review incoming drive requests.
          </p>
        </div>

        <div
          onClick={() => onNavigate('roles')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-indigo-50 text-indigo-700 mb-3">
            <Key className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Role & Access Control</h4>
          <p className="text-xs text-slate-500 mt-1">
            Delegate placement governance responsibilities across Dean, TPO staff, and SPCs.
          </p>
        </div>

        <div
          onClick={() => onNavigate('announcements')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-pink-400 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-pink-50 text-pink-700 mb-3">
            <Megaphone className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Campus Notice Board</h4>
          <p className="text-xs text-slate-500 mt-1">
            Publish recruitment notices, drive schedules, and eligibility updates to students.
          </p>
        </div>
      </div>

    </div>
  );
}
