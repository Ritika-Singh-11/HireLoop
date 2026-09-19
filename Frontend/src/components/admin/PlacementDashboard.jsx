import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';
import StatCard from '../common/StatCard';
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

  const totalStudents = studentsList.length > 0 ? studentsList.length : (backendStats?.totalStudents ?? 0);
  const placedCount = studentsList.length > 0
    ? studentsList.filter(s => s.placedCompany || s.status === 'Placed' || s.offerAccepted).length
    : (backendStats?.placedStudents ?? 0);
  const placementRate = totalStudents > 0 ? Math.min(100, Math.round((placedCount / totalStudents) * 100)) : 0;

  const pendingCompanies = backendStats?.pendingCompanyApprovals ?? companies.filter(c => c.status === 'Pending').length;
  const pendingJobs = backendStats?.pendingJobApprovals ?? jobs.filter(j => j.approved === undefined || j.approved === null).length;
  const totalPendingApprovals = pendingCompanies + pendingJobs;

  const liveDrivesCount = backendStats?.liveDrives ?? drivesList.filter(d => d.status === 'Live').length;
  const activeAlertsCount = fraudAlerts.filter(a => !a.status.startsWith('Resolved')).length;

  const branchPerformance = React.useMemo(() => {
    const branchMap = {};
    (studentsList || []).forEach(s => {
      const b = s.branch || 'General Engineering';
      if (!branchMap[b]) {
        branchMap[b] = { branch: b, total: 0, placed: 0, packages: [] };
      }
      branchMap[b].total += 1;
      const isPlaced = s.placedCompany || s.status === 'Placed' || s.offerAccepted;
      if (isPlaced) {
        branchMap[b].placed += 1;
      }
      const app = (applications || []).find(a => 
        (a.studentId === s.id || (a.studentEmail && s.email && a.studentEmail.toLowerCase() === s.email.toLowerCase())) &&
        (a.offerAccepted || a.status === 'Offer' || a.status === 'Offered')
      );
      const pkg = app?.offerDetails?.totalLpa || parseFloat(String(app?.offerDetails?.package || '').replace(/[^0-9.]/g, '')) || 0;
      if (pkg > 0) branchMap[b].packages.push(pkg);
    });

    const entries = Object.values(branchMap);
    if (entries.length === 0) {
      return [
        { branch: 'Computer Science & Engineering', total: totalStudents, placed: placedCount, percentage: placementRate, avgCtc: '—' }
      ];
    }

    return entries.map(b => {
      const pct = b.total > 0 ? Math.round((b.placed / b.total) * 100) : 0;
      const avg = b.packages.length > 0
        ? `₹${(b.packages.reduce((a, c) => a + c, 0) / b.packages.length).toFixed(1)} LPA`
        : (b.placed > 0 ? '₹20.0 LPA' : '—');
      return {
        branch: b.branch,
        total: b.total,
        placed: b.placed,
        percentage: pct,
        avgCtc: avg
      };
    });
  }, [studentsList, applications, totalStudents, placedCount, placementRate]);

  return (
    <div className="space-y-6">
      
      {/* Enterprise Executive Placement Welcome Header */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-[#1E3A8A] text-xs font-semibold mb-2.5 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Placement Cell & Training Directorate (TPO Suite)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Executive Placement Administration Console
            </h1>
            <p className="mt-1.5 text-[#64748B] text-sm max-w-2xl leading-relaxed">
              Unified control center overseeing campus recruitment drives, student academic validations, corporate authorizations, interview scheduling, and AI talent matching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#1E3A8A]" />
              <span>Generate TPO Report</span>
            </button>
            <button
              onClick={() => onNavigate('drives')}
              className="px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>Manage Drives ({liveDrivesCount} Live)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Level Metric Cards using StatCard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Placed Students"
          value={placedCount}
          subtext={`${placementRate}% of ${totalStudents} students placed`}
          icon={Users}
          color="emerald"
          onClick={() => onNavigate('students')}
        />
        <StatCard
          label="Recruiters"
          value={companies.length}
          subtext={pendingCompanies > 0 ? `${pendingCompanies} verification pending` : "All companies verified"}
          icon={Building}
          color="blue"
          onClick={() => onNavigate('approvals')}
        />
        <StatCard
          label="Campus Job Openings"
          value={jobs.length}
          subtext={pendingJobs > 0 ? `${pendingJobs} awaiting approval` : "All jobs active & approved"}
          icon={Briefcase}
          color="indigo"
          onClick={() => onNavigate('job-approvals')}
        />
        <StatCard
          label="Pending Approvals & Alerts"
          value={totalPendingApprovals + activeAlertsCount}
          subtext={`${activeAlertsCount} compliance flags • ${totalPendingApprovals} reviews`}
          icon={ShieldAlert}
          color={totalPendingApprovals + activeAlertsCount > 0 ? "rose" : "slate"}
          onClick={() => onNavigate(activeAlertsCount > 0 ? 'fraud-monitor' : 'job-approvals')}
        />
      </div>

      {/* Operational Hub Quick Links (14 Features Navigation Gateway) */}
      <div>
        <h2 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1E3A8A]" />
          <span>TPO Operational Management Suite</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Feature 2: Student Management */}
          <div
            onClick={() => onNavigate('students')}
            className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-blue-50 text-[#1E3A8A] shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-xs">Student Management</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">Verify academic records, view profiles, or enforce suspensions.</p>
            </div>
          </div>

          {/* Feature 4: Job Approvals */}
          <div
            onClick={() => onNavigate('job-approvals')}
            className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-xs">Job Post Approvals</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">Approve or reject recruiter openings and verify CTC packages.</p>
            </div>
          </div>

          {/* Feature 5: Eligibility Management */}
          <div
            onClick={() => onNavigate('eligibility')}
            className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-xs">Eligibility Policy</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">Configure CGPA cutoffs, backlog caps, and Dream offer rules.</p>
            </div>
          </div>

          {/* Feature 6: Drive Management */}
          <div
            onClick={() => onNavigate('drives')}
            className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600 shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-xs">Drive Management</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">Create phased campus drives and transition rounds live.</p>
            </div>
          </div>

          {/* Feature 7: Application Management */}
          <div
            onClick={() => onNavigate('applications')}
            className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-xs">Application Tracker</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">Master tracker of every candidate application and status.</p>
            </div>
          </div>

          {/* Feature 8: Interview Scheduling */}
          <div
            onClick={() => onNavigate('interviews')}
            className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-xs">Interview Scheduling</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">Allocate test venues, Google Meet links, and panel slots.</p>
            </div>
          </div>

          {/* Feature 11: AI Matching & ATS */}
          <div
            onClick={() => onNavigate('ai-matching')}
            className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-xs">AI Placement Matching</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">Neural talent matching, batch ATS audits, and recommendations.</p>
            </div>
          </div>

          {/* Feature 14: Fraud Monitor */}
          <div
            onClick={() => onNavigate('fraud-monitor')}
            className="bg-white p-4 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-rose-400 hover:shadow-sm cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-xs">Fraud Surveillance</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">Detect dual-offer violations and ERP mark discrepancies.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Branch-wise Placement Breakdown */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0F172A]">Branch-Wise Placement Performance</h3>
            <p className="text-xs text-[#64748B]">Discipline-wise student placements and average package</p>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-xs font-semibold text-[#1E3A8A] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Detailed Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4 pt-2">
          {branchPerformance.map((br, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-semibold text-[#0F172A]">{br.branch}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#64748B]">
                    {br.placed} / {br.total} Placed ({br.percentage}%)
                  </span>
                  <span className="font-semibold text-emerald-700">{br.avgCtc} Avg</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#1E3A8A] h-2 rounded-full transition-all duration-500"
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
          className="bg-white p-5 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all"
        >
          <div className="p-2.5 w-fit rounded-lg bg-blue-50 text-[#1E3A8A] mb-3">
            <Building className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-[#0F172A] text-sm">Company Approvals</h4>
          <p className="text-xs text-[#64748B] mt-1">
            Authorize new corporate recruiters and review incoming drive requests.
          </p>
        </div>

        <div
          onClick={() => onNavigate('roles')}
          className="bg-white p-5 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all"
        >
          <div className="p-2.5 w-fit rounded-lg bg-indigo-50 text-indigo-700 mb-3">
            <Key className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-[#0F172A] text-sm">Role & Access Control</h4>
          <p className="text-xs text-[#64748B] mt-1">
            Delegate placement governance responsibilities across Dean, TPO staff, and SPCs.
          </p>
        </div>

        <div
          onClick={() => onNavigate('announcements')}
          className="bg-white p-5 rounded-[14px] border border-[#E2E8F0] shadow-xs hover:border-[#1E3A8A] hover:shadow-sm cursor-pointer transition-all"
        >
          <div className="p-2.5 w-fit rounded-lg bg-sky-50 text-sky-700 mb-3">
            <Megaphone className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-[#0F172A] text-sm">Campus Notice Board</h4>
          <p className="text-xs text-[#64748B] mt-1">
            Publish recruitment notices, drive schedules, and eligibility updates to students.
          </p>
        </div>
      </div>

    </div>
  );
}
