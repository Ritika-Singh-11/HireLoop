import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Users, 
  Trophy, 
  Award, 
  Building, 
  PieChart, 
  BarChart3, 
  Sparkles, 
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';
import { PLACEMENT_STATS } from '../../data/mockData';

export default function PlacementAnalytics() {
  const { studentsList, companies, jobs, applications } = useApp();
  const [selectedBatch, setSelectedBatch] = useState('2026');

  // Filter students by cohort batch if selected
  const cohortStudents = selectedBatch === 'All' 
    ? studentsList 
    : studentsList.filter(s => String(s.batch) === selectedBatch || !s.batch);
  const activeStudents = cohortStudents.length > 0 ? cohortStudents : studentsList;

  const totalStudents = activeStudents.length;
  const placedStudentsList = activeStudents.filter(s => s.placedCompany || s.status === 'Placed' || s.offerAccepted);
  const placedStudents = placedStudentsList.length;
  const placementRate = totalStudents > 0 ? Math.min(100, Math.round((placedStudents / totalStudents) * 100)) : 0;

  // Extract all placed package numbers
  const allPlacedPackages = activeStudents
    .map(s => {
      if (s.placedCtc) {
        const num = parseFloat(String(s.placedCtc).replace(/[^0-9.]/g, ''));
        if (!isNaN(num) && num > 0) return num;
      }
      const app = (applications || []).find(a => 
        (a.studentId === s.id || (a.studentEmail && s.email && a.studentEmail.toLowerCase() === s.email.toLowerCase())) &&
        (a.offerAccepted || a.status === 'Offer' || a.status === 'Offered')
      );
      if (app?.offerDetails?.totalLpa) return Number(app.offerDetails.totalLpa);
      if (app?.offerDetails?.package) {
        const num = parseFloat(String(app.offerDetails.package).replace(/[^0-9.]/g, ''));
        if (!isNaN(num) && num > 0) return num;
      }
      return null;
    })
    .filter(p => p !== null && p > 0);

  const highestPackageNum = allPlacedPackages.length > 0 ? Math.max(...allPlacedPackages) : 0;
  const avgPackageNum = allPlacedPackages.length > 0 
    ? (allPlacedPackages.reduce((a, b) => a + b, 0) / allPlacedPackages.length).toFixed(1)
    : '0.0';

  // Dynamic Tier Stats
  const superDreamCount = allPlacedPackages.filter(p => p >= 25).length;
  const dreamCount = allPlacedPackages.filter(p => p >= 15 && p < 25).length;
  const standardCount = allPlacedPackages.filter(p => p < 15).length;
  const totalTierOffers = allPlacedPackages.length || placedStudents || 1;

  const tierStats = [
    { 
      label: 'Super Dream (≥ ₹25 LPA)', 
      count: superDreamCount, 
      percentage: Math.round((superDreamCount / totalTierOffers) * 100), 
      color: 'from-purple-600 to-indigo-600' 
    },
    { 
      label: 'Dream (₹15 - ₹25 LPA)', 
      count: dreamCount, 
      percentage: Math.round((dreamCount / totalTierOffers) * 100), 
      color: 'from-blue-600 to-cyan-600' 
    },
    { 
      label: 'Standard Core (< ₹15 LPA)', 
      count: standardCount, 
      percentage: Math.round((standardCount / totalTierOffers) * 100), 
      color: 'from-emerald-600 to-teal-600' 
    }
  ];

  // Dynamic Top Corporate Recruiters
  const recruiterOfferMap = new Map();
  (applications || []).forEach(a => {
    if ((a.offerAccepted || a.status === 'Offer' || a.status === 'Offered') && a.companyName) {
      const cName = a.companyName.trim();
      const current = recruiterOfferMap.get(cName) || { count: 0, packages: [] };
      current.count += 1;
      const pkg = a.offerDetails?.totalLpa || parseFloat(String(a.offerDetails?.package || '').replace(/[^0-9.]/g, '')) || 0;
      if (pkg > 0) current.packages.push(pkg);
      recruiterOfferMap.set(cName, current);
    }
  });

  const dynamicTopRecruiters = (companies || []).map(c => {
    const data = recruiterOfferMap.get(c.name?.trim()) || { count: 0, packages: [] };
    const avg = data.packages.length > 0 
      ? (data.packages.reduce((acc, p) => acc + p, 0) / data.packages.length).toFixed(1)
      : (data.count > 0 ? '0.0' : '—');
    return {
      company: c.name,
      logo: c.logo || '🏢',
      hires: data.count,
      avgCtc: avg !== '—' ? `₹${avg} LPA` : '—',
      tier: avg !== '—' ? (parseFloat(avg) >= 25 ? 'Super Dream' : parseFloat(avg) >= 15 ? 'Dream' : 'Standard') : 'Standard'
    };
  }).sort((a, b) => b.hires - a.hires).slice(0, 5);

  // Dynamic Academic Discipline Placement Matrix
  const predefinedBranches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const uniqueStudentBranches = Array.from(new Set(activeStudents.map(s => s.branch).filter(Boolean)));
  const allDisciplines = uniqueStudentBranches.length > 0 ? uniqueStudentBranches : predefinedBranches;

  const dynamicBranchStats = allDisciplines.map(branchName => {
    const bKey = branchName.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
    const inBranch = activeStudents.filter(s => {
      if (!s.branch) return false;
      const sKey = s.branch.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
      return sKey.includes(bKey) || bKey.includes(sKey);
    });

    const enrolled = inBranch.length;
    const placed = inBranch.filter(s => s.placedCompany || s.status === 'Placed' || s.offerAccepted).length;
    const rate = enrolled > 0 ? Math.round((placed / enrolled) * 100) : 0;

    const branchPackages = inBranch
      .map(s => {
        if (s.placedCtc) {
          const num = parseFloat(String(s.placedCtc).replace(/[^0-9.]/g, ''));
          if (!isNaN(num) && num > 0) return num;
        }
        const app = (applications || []).find(a => 
          (a.studentId === s.id || (a.studentEmail && s.email && a.studentEmail.toLowerCase() === s.email.toLowerCase())) &&
          (a.offerAccepted || a.status === 'Offer' || a.status === 'Offered')
        );
        if (app?.offerDetails?.totalLpa) return Number(app.offerDetails.totalLpa);
        if (app?.offerDetails?.package) {
          const num = parseFloat(String(app.offerDetails.package).replace(/[^0-9.]/g, ''));
          if (!isNaN(num) && num > 0) return num;
        }
        return null;
      })
      .filter(p => p !== null && p > 0);

    const avg = branchPackages.length > 0 
      ? (branchPackages.reduce((a, b) => a + b, 0) / branchPackages.length).toFixed(1)
      : '—';

    return {
      branch: branchName,
      total: enrolled,
      placed,
      percentage: rate,
      avgCtc: avg !== '—' ? `₹${avg} LPA` : '—'
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Institutional Intelligence • Real-Time Database Metrics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Comprehensive Placement Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated statistical reporting computed live from verified student profiles, departmental cohorts, and corporate offers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Academic Cohort:</span>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="2026">Batch of 2026 (Active)</option>
            <option value="2025">Batch of 2025 (Graduated)</option>
            <option value="All">All Cohorts Combined</option>
          </select>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">{placementRate}%</span>
            <span className="text-xs text-slate-400">({placedStudents} of {totalStudents} Placed)</span>
          </div>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">Live verified student data</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Highest CTC</span>
            <Trophy className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-purple-700">₹{highestPackageNum.toFixed(1)} LPA</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Peak Verified Campus Offer</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Package</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-slate-900">₹{avgPackageNum} LPA</span>
          </div>
          <span className="text-xs text-indigo-600 font-semibold mt-1 block">Across recruited graduates</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Partner Companies</span>
            <Building className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-slate-900">{(companies || []).length}</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">{(jobs || []).length} Active Job Listings</span>
        </div>
      </div>

      {/* CTC Tier Distribution & Recruiter Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CTC Tier Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <PieChart className="w-4 h-4" />
              <h3 className="font-extrabold text-slate-900 text-sm">Package Tier Segmentation</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">Total Placements: {placedStudents}</span>
          </div>

          <div className="space-y-4 pt-1">
            {tierStats.map((tier, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">{tier.label}</span>
                  <span className="font-extrabold text-slate-900">{tier.count} Students ({tier.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${tier.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${tier.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-indigo-50/70 rounded-xl text-xs text-indigo-900 mt-4 leading-relaxed">
            <strong>TPO Policy Milestone:</strong> Over <strong>{Math.round(((superDreamCount + dreamCount) / (totalTierOffers || 1)) * 100)}%</strong> of placed candidates hold premium Dream or Super Dream offers (CTC ≥ ₹15.0 LPA).
          </div>
        </div>

        {/* Top Corporate Recruiters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-purple-700">
              <Building className="w-4 h-4" />
              <h3 className="font-extrabold text-slate-900 text-sm">Top Hiring Corporate Partners</h3>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              Hiring Volume
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {dynamicTopRecruiters.map((rec, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{rec.logo}</span>
                  <div>
                    <p className="font-bold text-slate-900">{rec.company}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">{rec.tier} Tier</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-slate-900">{rec.hires} Offers Issued</p>
                  <p className="text-[11px] font-bold text-emerald-700">{rec.avgCtc} Avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Branch-Wise Granular Performance Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-indigo-700">
            <BarChart3 className="w-4 h-4" />
            <h3 className="font-extrabold text-slate-900 text-sm">Academic Discipline Placement Matrix</h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">Live aggregate across verified student profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Engineering Discipline</th>
                <th className="py-3 px-4">Enrolled Pool</th>
                <th className="py-3 px-4">Placed Count</th>
                <th className="py-3 px-4">Placement Rate</th>
                <th className="py-3 px-4">Average CTC</th>
                <th className="py-3 px-4 text-right">Progression</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {dynamicBranchStats.map((br, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{br.branch}</td>
                  <td className="py-3 px-4 text-slate-500">{br.total} students</td>
                  <td className="py-3 px-4 font-bold text-indigo-700">{br.placed} students</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      br.percentage >= 70
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : br.percentage > 0
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {br.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">{br.avgCtc}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden inline-block align-middle">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          br.percentage >= 70 ? 'bg-emerald-600' : br.percentage > 0 ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                        style={{ width: `${br.percentage}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
