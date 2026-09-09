import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';

export default function StudentProfile({ onNavigate }) {
  const { student, setStudent, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: student.name || '',
    email: student.email || '',
    phone: student.phone || '',
    rollNumber: student.rollNumber || '',
    branch: student.branch || '',
    batch: student.batch || '2026',
    cgpa: student.cgpa || 8.5,
    location: student.resumeData?.location || 'Bangalore, India',
    linkedin: student.resumeData?.linkedin || '',
    github: student.resumeData?.github || '',
    summary: student.resumeData?.summary || '',
    skills: student.skills || []
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
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

    setStudent(updated);
    showToast('Academic profile updated and verified successfully!');
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

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Update Profile Record</span>
          </button>
        </div>

      </form>

    </div>
  );
}
