import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Briefcase, DollarSign, ShieldCheck, Sparkles } from 'lucide-react';

export default function PostJobModal({ isOpen, onClose }) {
  const { addJob, openPaymentModal, currentUser, companies, showToast } = useApp();

  const isRejected = React.useMemo(() => {
    const compName = (currentUser?.companyName || '').toLowerCase().trim();
    if (!compName) return false;
    const comp = (companies || []).find(c => 
      (c.name && c.name.toLowerCase().trim() === compName) ||
      (c.id && c.id === currentUser?.companyId)
    );
    return comp?.status === 'Rejected';
  }, [companies, currentUser]);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Core Engineering',
    companyName: currentUser?.companyName || 'Corporate Recruiter',
    companyLogo: '🏢',
    location: 'Bangalore, Karnataka',
    mode: 'Hybrid',
    salaryMin: 18,
    salaryMax: 24,
    minCgpa: 7.5,
    maxBacklogs: 0,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
    eligibleBatch: '2026',
    deadline: '2026-10-15',
    openings: 5,
    requiredSkills: 'React, Node.js, TypeScript, PostgreSQL, System Design',
    description: ''
  });

  useEffect(() => {
    if (currentUser?.companyName) {
      setFormData(prev => ({
        ...prev,
        companyName: currentUser.companyName
      }));
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleBranchToggle = (branch) => {
    setFormData(prev => {
      const exists = prev.eligibleBranches.includes(branch);
      if (exists) {
        return { ...prev, eligibleBranches: prev.eligibleBranches.filter(b => b !== branch) };
      } else {
        return { ...prev, eligibleBranches: [...prev.eligibleBranches, branch] };
      }
    });
  };

  const handleDirectPost = () => {
    if (isRejected) {
      if (showToast) showToast('Cannot post job: Company is rejected by TPO Directorate', 'error');
      return;
    }
    const preparedJob = {
      ...formData,
      salaryMin: parseFloat(formData.salaryMin),
      salaryMax: parseFloat(formData.salaryMax),
      minCgpa: parseFloat(formData.minCgpa),
      maxBacklogs: parseInt(formData.maxBacklogs || 0),
      openings: parseInt(formData.openings || 1),
      salaryDisplay: `₹${formData.salaryMin} - ₹${formData.salaryMax} LPA`,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    };
    addJob(preparedJob);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRejected) {
      if (showToast) showToast('Cannot post job: Company is rejected by TPO Directorate', 'error');
      return;
    }

    const preparedJob = {
      ...formData,
      salaryMin: parseFloat(formData.salaryMin),
      salaryMax: parseFloat(formData.salaryMax),
      minCgpa: parseFloat(formData.minCgpa),
      maxBacklogs: parseInt(formData.maxBacklogs || 0),
      openings: parseInt(formData.openings || 1),
      salaryDisplay: `₹${formData.salaryMin} - ₹${formData.salaryMax} LPA`,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    };

    // Close this modal and trigger Razorpay corporate entrance / listing fee checkout
    onClose();
    openPaymentModal({
      type: 'job_listing',
      title: 'Recruiter Entrance & Job Listing Fee',
      amount: 2500,
      onSuccess: (paymentResult) => {
        addJob({
          ...preparedJob,
          isPaid: true,
          paymentId: paymentResult?.razorpay_payment_id || `pay_${Date.now()}`
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Create New Campus Placement Opening
              </h3>
              <p className="text-xs text-slate-500">
                Post verified full-time or internship requirements to university placement pool
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {isRejected && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
              ⚠️ Posting disabled: "{currentUser?.companyName}" registration was declined by TPO Directorate.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. SDE-1 (Full Stack)"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Batch</label>
              <input
                type="text"
                value={formData.eligibleBatch}
                onChange={(e) => setFormData({ ...formData, eligibleBatch: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Min Salary (LPA)</label>
              <input
                type="number"
                step="0.5"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: parseFloat(e.target.value) })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Salary (LPA)</label>
              <input
                type="number"
                step="0.5"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: parseFloat(e.target.value) })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.minCgpa}
                onChange={(e) => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Backlogs</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.maxBacklogs}
                onChange={(e) => setFormData({ ...formData, maxBacklogs: parseInt(e.target.value) || 0 })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Eligible Branches */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Eligible Disciplines / Branches</label>
            <div className="flex flex-wrap gap-2">
              {['Computer Science & Engineering', 'Information Technology', 'Electronics & Comm.', 'Electrical Engg.', 'Mechanical Engg.', 'All Branches'].map(b => (
                <button
                  type="button"
                  key={b}
                  onClick={() => handleBranchToggle(b)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    formData.eligibleBranches.includes(b)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Open Vacancies</label>
              <input
                type="number"
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value) })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role Description & Responsibilities</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe candidate day-to-day impact, technologies used, and hiring process..."
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Listing fee notice */}
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Standard corporate entrance fee of <strong>₹2,500</strong> is processed securely via <strong>Razorpay (UPI, Cards, NetBanking)</strong> before publishing.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDirectPost}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all cursor-pointer"
            >
              Publish Directly (Demo)
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pay via Razorpay & Publish (₹2,500)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
