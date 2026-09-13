import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Target, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  GraduationCap, 
  Sliders, 
  Award, 
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

const ALL_CAMPUS_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Comm.',
  'Electrical Engg.',
  'Mechanical Engg.',
  'Civil Engg.',
  'Chemical Engg.',
  'Data Science & AI'
];

export default function EligibilityManager() {
  const { eligibilityPolicy, updateEligibilityPolicy, studentsList } = useApp();
  const [policy, setPolicy] = useState(eligibilityPolicy);
  const [isSaved, setIsSaved] = useState(false);

  const toggleBranch = (branch) => {
    setPolicy(prev => {
      const exists = prev.allowedBranches.includes(branch);
      const updated = exists 
        ? prev.allowedBranches.filter(b => b !== branch)
        : [...prev.allowedBranches, branch];
      return { ...prev, allowedBranches: updated };
    });
  };

  useEffect(() => {
    async function fetchPolicy() {
      try {
        const res = await api.getEligibilityPolicy();
        if (res?.policy) {
          setPolicy(res.policy);
          updateEligibilityPolicy(res.policy);
        }
      } catch (err) {
        console.warn('Using local policy fallback:', err);
      }
    }
    fetchPolicy();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateEligibilityPolicy(policy);
    } catch (err) {
      console.warn('API update fallback to local state:', err);
    }

    updateEligibilityPolicy(policy);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Real-time calculation of eligible students based on current input policy
  const eligibleStudents = studentsList.filter(s => {
    const cgpaOk = s.cgpa >= policy.minCgpa;
    const backlogsOk = s.backlogs <= policy.maxBacklogs;
    const branchOk = policy.allowedBranches.includes(s.branch);
    const verifiedOk = s.isVerified;
    const notBlocked = !s.isBlocked;
    return cgpaOk && backlogsOk && branchOk && verifiedOk && notBlocked;
  });

  const eligibilityRate = Math.round((eligibleStudents.length / (studentsList.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Placement Policy Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Campus Recruitment Eligibility Rules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure academic cutoffs, branch privileges, dream CTC tiers, and backlog restrictions for university placement drives.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Policy Saved!' : 'Save & Publish Rules'}</span>
        </button>
      </div>

      {/* Live Impact Simulator Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-300">
              Live Eligibility Impact Preview
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-black text-emerald-400">{eligibleStudents.length}</span>
              <span className="text-slate-300 text-sm">of {studentsList.length} enrolled students meet these rules</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Based on active verification, CGPA ≥ {policy.minCgpa}, max {policy.maxBacklogs} backlogs, and {policy.allowedBranches.length} allowed branches.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-center">
              <span className="text-xs text-slate-300 block">Eligibility Rate</span>
              <span className="text-2xl font-black text-white">{eligibilityRate}%</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-xs text-slate-300 block">Restricted</span>
              <span className="text-2xl font-black text-rose-400">{studentsList.length - eligibleStudents.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Synchronization & Precedence Notice */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
            Institutional Policy Precedence Enforced & Synchronized
          </h4>
          <p className="text-xs text-indigo-900 mt-0.5 leading-relaxed">
            University Directorate rules configured here strictly take precedence over all company-specific cutoffs. Even if an employer offers attractive compensation packages or has lower minimum requirements, students who do not satisfy this College Eligibility Policy are automatically blocked from applying or registering across both the <strong>Job Board</strong> and <strong>Campus Recruitment Drives</strong>.
          </p>
        </div>
      </div>

      {/* Policy Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Academic Cutoffs */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 text-indigo-700 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5" />
            <h2 className="font-extrabold text-slate-900 text-sm">Academic Criteria Cutoffs</h2>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700">Minimum CGPA Threshold</label>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {policy.minCgpa.toFixed(1)} / 10.0
              </span>
            </div>
            <input
              type="range"
              min="5.0"
              max="9.0"
              step="0.1"
              value={policy.minCgpa}
              onChange={(e) => setPolicy({ ...policy, minCgpa: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">Students below this CGPA cannot register for standard campus drives.</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700">Maximum Active Backlogs Permitted</label>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {policy.maxBacklogs} Backlog(s)
              </span>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(count => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setPolicy({ ...policy, maxBacklogs: count })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    policy.maxBacklogs === count
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {count === 0 ? '0 (Strict Clean)' : `${count}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Eligible Batch Year</label>
              <input
                type="text"
                value={policy.eligibleBatch}
                onChange={(e) => setPolicy({ ...policy, eligibleBatch: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min. T&P Attendance %</label>
              <input
                type="number"
                value={policy.minAttendancePercentage || 75}
                onChange={(e) => setPolicy({ ...policy, minAttendancePercentage: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Multi-Offer & CTC Tier Rules */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 text-purple-700 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5" />
            <h2 className="font-extrabold text-slate-900 text-sm">Tiered CTC & Offer Policies</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dream Offer Cutoff (LPA)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={policy.dreamThreshold}
                  onChange={(e) => setPolicy({ ...policy, dreamThreshold: parseFloat(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <span className="text-[10px] text-slate-400">Offers above this count as Dream.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Super Dream Cutoff (LPA)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  step="0.5"
                  value={policy.superDreamThreshold}
                  onChange={(e) => setPolicy({ ...policy, superDreamThreshold: parseFloat(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <span className="text-[10px] text-slate-400">Top-tier packages.</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={policy.allowMultipleOffers}
                onChange={(e) => setPolicy({ ...policy, allowMultipleOffers: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-purple-900 block">
                  Permit Higher Tier Upgrades (One-Student-One-Tier Rule)
                </span>
                <p className="text-[11px] text-purple-700 mt-0.5 leading-relaxed">
                  Students with a Standard offer (&lt;₹{policy.dreamThreshold} LPA) may interview for Dream companies. Once a student secures a Dream or Super Dream offer, their participation is frozen to ensure equitable opportunities for peers.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Branch Inclusions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <GraduationCap className="w-5 h-5" />
              <h2 className="font-extrabold text-slate-900 text-sm">Permitted Academic Disciplines</h2>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPolicy({ ...policy, allowedBranches: [...ALL_CAMPUS_BRANCHES] })}
                className="text-indigo-600 font-bold hover:underline"
              >
                Select All
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setPolicy({ ...policy, allowedBranches: [] })}
                className="text-slate-500 hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {ALL_CAMPUS_BRANCHES.map((br) => {
              const isChecked = policy.allowedBranches.includes(br);
              return (
                <div
                  key={br}
                  onClick={() => toggleBranch(br)}
                  className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span>{br}</span>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
              );
            })}
          </div>
        </div>

      </form>
    </div>
  );
}
