import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Briefcase, Sliders, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react';

const COMMON_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Comm.',
  'Electrical Engg.',
  'Mechanical Engg.',
  'Civil Engg.',
  'Chemical Engg.',
  'Data Science & AI',
  'All Branches'
];

export default function EditJobModal({ isOpen, job, onClose }) {
  const { updateJob, showToast } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    companyName: '',
    location: '',
    mode: 'Hybrid',
    salaryMin: 18,
    salaryMax: 24,
    minCgpa: 7.5,
    maxBacklogs: 0,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
    eligibleBatch: '2026',
    deadline: '',
    openings: 5,
    requiredSkills: '',
    description: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        department: job.department || 'Core Engineering',
        companyName: job.companyName || 'Corporate Recruiter',
        location: job.location || 'Bangalore, India',
        mode: job.mode || 'Hybrid',
        salaryMin: job.salaryMin || 18,
        salaryMax: job.salaryMax || 24,
        minCgpa: job.minCgpa !== undefined ? job.minCgpa : 7.0,
        maxBacklogs: job.maxBacklogs !== undefined ? job.maxBacklogs : 0,
        eligibleBranches: Array.isArray(job.eligibleBranches) && job.eligibleBranches.length > 0
          ? job.eligibleBranches
          : ['Computer Science & Engineering', 'Information Technology'],
        eligibleBatch: job.eligibleBatch || '2026',
        deadline: job.deadline || '2026-10-15',
        openings: job.openings || 5,
        requiredSkills: Array.isArray(job.requiredSkills) 
          ? job.requiredSkills.join(', ') 
          : (job.requiredSkills || 'React, Node.js, Python'),
        description: job.description || ''
      });
    }
  }, [job, isOpen]);

  if (!isOpen || !job) return null;

  const handleBranchToggle = (branch) => {
    setFormData(prev => {
      if (branch === 'All Branches') {
        const isAllAlready = prev.eligibleBranches.includes('All Branches');
        return {
          ...prev,
          eligibleBranches: isAllAlready ? ['Computer Science & Engineering'] : ['All Branches']
        };
      }

      // If toggling a specific branch, remove "All Branches"
      const cleanBranches = prev.eligibleBranches.filter(b => b !== 'All Branches');
      const exists = cleanBranches.includes(branch);
      const nextBranches = exists 
        ? cleanBranches.filter(b => b !== branch)
        : [...cleanBranches, branch];

      return {
        ...prev,
        eligibleBranches: nextBranches.length > 0 ? nextBranches : ['All Branches']
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const preparedData = {
      ...formData,
      salaryMin: parseFloat(formData.salaryMin),
      salaryMax: parseFloat(formData.salaryMax),
      salaryDisplay: `₹${formData.salaryMin} - ₹${formData.salaryMax} LPA`,
      minCgpa: parseFloat(formData.minCgpa),
      maxBacklogs: parseInt(formData.maxBacklogs),
      openings: parseInt(formData.openings),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    };

    updateJob(job.id, preparedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Customize Role & Eligibility Criteria
              </h3>
              <p className="text-xs text-slate-500">
                Adjust academic cutoffs, branch filters, and job package for {formData.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Team</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Eligible Batch</label>
              <input
                type="text"
                value={formData.eligibleBatch}
                onChange={(e) => setFormData({ ...formData, eligibleBatch: e.target.value })}
                placeholder="2026 or All"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Academic Eligibility Section */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>Campus Academic Eligibility Cutoffs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Min CGPA Threshold: <span className="font-extrabold text-indigo-700">{parseFloat(formData.minCgpa).toFixed(1)} / 10.0</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.minCgpa}
                  onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Max Active Backlogs Allowed: <span className="font-extrabold text-indigo-700">{formData.maxBacklogs}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.maxBacklogs}
                  onChange={(e) => setFormData({ ...formData, maxBacklogs: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            {/* Eligible Disciplines / Branches */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Eligible Engineering Disciplines / Branches
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_BRANCHES.map(b => {
                  const isSelected = formData.eligibleBranches.includes(b);
                  return (
                    <button
                      type="button"
                      key={b}
                      onClick={() => handleBranchToggle(b)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTC and Deadlines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Min CTC (LPA)</label>
              <input
                type="number"
                step="0.5"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max CTC (LPA)</label>
              <input
                type="number"
                step="0.5"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply & Save Criteria</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
