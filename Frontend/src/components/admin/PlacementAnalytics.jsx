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
  const { studentsList, companies, jobs } = useApp();
  const [selectedBatch, setSelectedBatch] = useState('2026');

  const totalStudents = studentsList.length;
  const placedStudents = studentsList.filter(s => s.placedCompany).length;
  const placementRate = Math.round((placedStudents / (totalStudents || 1)) * 100);

  // CTC Tiers
  const tierStats = [
    { label: 'Super Dream (> ₹25 LPA)', count: 18, percentage: 14, color: 'from-purple-600 to-indigo-600' },
    { label: 'Dream (₹15 - ₹25 LPA)', count: 48, percentage: 38, color: 'from-blue-600 to-cyan-600' },
    { label: 'Standard Core (< ₹15 LPA)', count: 62, percentage: 48, color: 'from-emerald-600 to-teal-600' }
  ];

  // Top Corporate Recruiters
  const topRecruiters = [
    { company: 'Microsoft', logo: '💻', hires: 8, avgCtc: '₹31.5 LPA', tier: 'Super Dream' },
    { company: 'Razorpay', logo: '💳', hires: 12, avgCtc: '₹20.0 LPA', tier: 'Dream' },
    { company: 'Deloitte', logo: '🏢', hires: 24, avgCtc: '₹12.5 LPA', tier: 'Standard' },
    { company: 'Zomato', logo: '🍔', hires: 6, avgCtc: '₹18.0 LPA', tier: 'Dream' },
    { company: 'Atlassian', logo: '🚀', hires: 4, avgCtc: '₹28.0 LPA', tier: 'Super Dream' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Institutional Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Comprehensive Placement Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            In-depth statistical reporting on placement percentages, salary distributions, branch parity, and corporate recruiter hiring trends.
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
            <option value="2025">Batch of 2025 (Completed)</option>
            <option value="2024">Batch of 2024 (Archived)</option>
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
            <span className="text-3xl font-black text-emerald-700">{PLACEMENT_STATS.placementPercentage}%</span>
            <span className="text-xs text-slate-400">({PLACEMENT_STATS.placedStudents} Placed)</span>
          </div>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">↑ 6.2% vs last academic year</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Highest CTC</span>
            <Trophy className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-purple-700">₹48.0 LPA</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Google Cloud Campus Visit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Average Package</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-slate-900">{PLACEMENT_STATS.averagePackage}</span>
          </div>
          <span className="text-xs text-indigo-600 font-semibold mt-1 block">Median: {PLACEMENT_STATS.medianPackage}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Partner Companies</span>
            <Building className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-slate-900">{companies.length}</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">42 On-Campus Drives Hosted</span>
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
            <span className="text-xs font-bold text-slate-400">Total Offers: 128</span>
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
            <strong>TPO Policy Milestone:</strong> Over <strong>52%</strong> of all placed students have secured Dream or Super Dream offers (CTC ≥ ₹15.0 LPA) in the ongoing season.
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
              Volume Leaders
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {topRecruiters.map((rec, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{rec.logo}</span>
                  <div>
                    <p className="font-bold text-slate-900">{rec.company}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">{rec.tier} Tier</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-slate-900">{rec.hires} Offers</p>
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
          <span className="text-xs text-slate-400 font-semibold">Updated with latest drive statistics</span>
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
              {PLACEMENT_STATS.branchStats.map((br, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{br.branch}</td>
                  <td className="py-3 px-4 text-slate-500">{br.total} students</td>
                  <td className="py-3 px-4 font-bold text-indigo-700">{br.placed} students</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {br.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">{br.avgCpa}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden inline-block align-middle">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
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
