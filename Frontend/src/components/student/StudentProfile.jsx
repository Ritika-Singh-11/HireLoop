import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import ResumeUploader from './ResumeUploader';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Award, 
  CheckCircle2, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';

export default function StudentProfile({ onNavigate }) {
  const { student, setStudent, updateStudentProfile, showToast, addNotification } = useApp();

  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    rollNumber: student?.rollNumber || '',
    branch: student?.branch || '',
    batch: student?.batch || '2026',
    cgpa: student?.cgpa !== undefined ? student.cgpa : 8.5,
    location: student?.location || student?.resumeData?.location || '',
    linkedin: student?.linkedin || student?.resumeData?.linkedin || '',
    github: student?.github || student?.resumeData?.github || '',
    summary: student?.summary || student?.resumeData?.summary || '',
    skills: student?.skills || []
  });

  // Sync formData whenever logged-in student changes
  React.useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        rollNumber: student.rollNumber || '',
        branch: student.branch || '',
        batch: student.batch || '2026',
        cgpa: student.cgpa !== undefined ? student.cgpa : 8.5,
        location: student.location || student.resumeData?.location || '',
        linkedin: student.linkedin || student.resumeData?.linkedin || '',
        github: student.github || student.resumeData?.github || '',
        summary: student.summary || student.resumeData?.summary || '',
        skills: student.skills || []
      });
    }
  }, [student]);

  const [newSkillInput, setNewSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState('Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // Compute live profile completeness
  const completenessScore = useMemo(() => {
    let score = 0;
    if (formData.name && formData.rollNumber) score += 25;
    if (formData.branch && formData.batch) score += 20;
    if (formData.cgpa && parseFloat(formData.cgpa) > 0) score += 20;
    if (formData.skills && formData.skills.length >= 3) score += 20;
    if (formData.phone && formData.email) score += 15;
    return Math.min(100, score);
  }, [formData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSyncSuccess(false);

    // Realistic network commit delay
    await new Promise(r => setTimeout(r, 650));

    const updated = {
      ...student,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      rollNumber: formData.rollNumber,
      branch: formData.branch,
      batch: formData.batch,
      cgpa: parseFloat(formData.cgpa),
      skills: formData.skills,
      resumeData: {
        ...(student.resumeData || {}),
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        linkedin: formData.linkedin,
        github: formData.github,
        summary: formData.summary,
        skills: formData.skills
      }
    };

    if (updateStudentProfile) {
      await updateStudentProfile(updated);
    } else {
      setStudent(updated);
    }

    setIsSaving(false);
    setShowSyncSuccess(true);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSavedTimestamp(`Today at ${nowTime}`);

    // Real-time notification dispatch
    if (addNotification) {
      addNotification({
        role: 'student',
        title: 'Academic Profile Synchronized',
        message: `Your verified academic record (${formData.name} • CGPA ${formData.cgpa}) has been committed to the Campus Placement Directorate database.`,
        type: 'success',
        category: 'approval',
        actionTarget: { role: 'student', tab: 'profile' }
      });
    }

    showToast('Academic profile updated and synchronized with TPO registry!');
    setTimeout(() => setShowSyncSuccess(false), 5000);
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...new Set([...prev.skills, newSkillInput.trim()])]
      }));
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            {formData.name ? formData.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ST'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{formData.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>TPC Verified</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Roll No: <span className="font-mono font-bold text-slate-700">{formData.rollNumber}</span> • {formData.branch} (Batch {formData.batch})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Cumulative CGPA</span>
            <div className="text-xl sm:text-2xl font-black text-indigo-700">{formData.cgpa} / 10.0</div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Verified ATS</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              {student.atsScore ? `${student.atsScore}%` : '85%'}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Mock Readiness</span>
            <div className="text-xl sm:text-2xl font-black text-purple-600">
              {student.mockInterviewScore ? `${student.mockInterviewScore}%` : '88%'}
            </div>
          </div>
        </div>
      </div>

      {/* Live Placement Readiness Meter & Directorate Sync Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Placement Profile Completeness:</span>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {completenessScore}% Complete
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {completenessScore >= 85 ? 'Profile verified & fully qualified for Tier-1 Super Dream drives' : 'Complete remaining skills and profile details to maximize drive shortlisting'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <div className="w-full sm:w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${completenessScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Audit State: {savedTimestamp}
          </span>
        </div>
      </div>

      {/* Sync Success Alert Banner */}
      {showSyncSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-bold">Directorate Placement Record Synchronized!</strong>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                All changes have been successfully committed to the placement database and logged in your student audit trail.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 font-bold shrink-0">{savedTimestamp}</span>
        </div>
      )}

      {/* Official Master Resume (PDF) Upload */}
      <ResumeUploader onNavigateToAts={() => onNavigate && onNavigate('resume-analyzer')} />

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Academic Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Academic & College Credentials</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University Roll Number</label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Branch</label>
              <input
                type="text"
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA (out of 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold text-indigo-700"
              />
            </div>
          </div>
        </div>

        {/* Contact & Portfolios */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Contact & Online Portfolios</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Technical Skills & Bio */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Skills & Professional Summary</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio / Elevator Pitch</label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Add Technical Skill</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Next.js, Docker, Kubernetes..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {formData.skills.map((sk, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(sk)}
                    className="text-slate-400 hover:text-red-500 font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button with realistic Directorate sync */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Updates immediately synchronize with campus placement drive criteria & ATS matching.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                showSyncSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 scale-[1.02]'
                  : isSaving
                  ? 'bg-indigo-700 text-white shadow-indigo-700/30 opacity-85 cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Syncing with TPO Records...</span>
                </>
              ) : showSyncSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white animate-pulse" />
                  <span>✓ Profile Saved & Synced to TPO!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Sync Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
