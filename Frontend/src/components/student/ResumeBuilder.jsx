import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Layout, 
  Eye, 
  Edit3,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link
} from 'lucide-react';

export default function ResumeBuilder() {
  const { student, updateStudentResume, showToast } = useApp();
  
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [template, setTemplate] = useState('modern'); // 'modern' | 'academic' | 'executive'
  
  const [resume, setResume] = useState(() => ({
    fullName: student.resumeData?.fullName || student.name,
    email: student.resumeData?.email || student.email,
    phone: student.resumeData?.phone || student.phone,
    location: student.resumeData?.location || 'Bangalore, India',
    linkedin: student.resumeData?.linkedin || 'linkedin.com/in/aaravsharma',
    github: student.resumeData?.github || 'github.com/aaravsharma',
    summary: student.resumeData?.summary || '',
    education: student.resumeData?.education || [],
    experience: student.resumeData?.experience || [],
    projects: student.resumeData?.projects || [],
    skills: student.resumeData?.skills || []
  }));

  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    updateStudentResume(resume);
  };

  const handlePrint = () => {
    window.print();
  };

  // Education Helpers
  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '', score: '' }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Experience Helpers
  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', period: '', details: [''] }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Projects Helpers
  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', tech: '', description: '' }]
    }));
  };

  const updateProject = (index, field, value) => {
    setResume(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Skills
  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      setResume(prev => ({
        ...prev,
        skills: [...new Set([...prev.skills, newSkill.trim()])]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header (No Print) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Interactive Campus Resume Builder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select standard ATS templates, update sections, and export verified PDF
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Template Chooser */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                template === 'modern' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Modern Tech
            </button>
            <button
              onClick={() => setTemplate('academic')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                template === 'academic' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Classic Academic
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Form Controls (No Print) */}
        <div className="no-print lg:col-span-6 space-y-5">
          
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                  className="w-full mt-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Email Address</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => setResume({ ...resume, email: e.target.value })}
                  className="w-full mt-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Phone</label>
                <input
                  type="text"
                  value={resume.phone}
                  onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                  className="w-full mt-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600">Location</label>
                <input
                  type="text"
                  value={resume.location}
                  onChange={(e) => setResume({ ...resume, location: e.target.value })}
                  className="w-full mt-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600">LinkedIn URL</label>
                <input
                  type="text"
                  value={resume.linkedin}
                  onChange={(e) => setResume({ ...resume, linkedin: e.target.value })}
                  className="w-full mt-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600">GitHub Profile</label>
                <input
                  type="text"
                  value={resume.github}
                  onChange={(e) => setResume({ ...resume, github: e.target.value })}
                  className="w-full mt-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600">Professional Summary</label>
              <textarea
                rows={3}
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                className="w-full mt-1 text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Education</h3>
              <button
                type="button"
                onClick={addEducation}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Degree</span>
              </button>
            </div>
            {resume.education.map((edu, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-2 relative">
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                  <input
                    placeholder="Institution / College"
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    placeholder="Degree (e.g. B.Tech in CSE)"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    placeholder="Year (e.g. 2022 - 2026)"
                    value={edu.year}
                    onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    placeholder="Score (e.g. CGPA: 8.85 / 10)"
                    value={edu.score}
                    onChange={(e) => updateEducation(idx, 'score', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Work / Internship Experience */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Internships & Experience</h3>
              <button
                type="button"
                onClick={addExperience}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>
            </div>
            {resume.experience.map((exp, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-2 relative">
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                  <input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    placeholder="Duration"
                    value={exp.period}
                    onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Key contributions (1 per line or bullet point)"
                  value={Array.isArray(exp.details) ? exp.details.join('\n') : exp.details}
                  onChange={(e) => updateExperience(idx, 'details', e.target.value.split('\n'))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Projects</h3>
              <button
                type="button"
                onClick={addProject}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>
            {resume.projects.map((proj, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-2 relative">
                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                  <input
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => updateProject(idx, 'title', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    placeholder="Tech Stack"
                    value={proj.tech}
                    onChange={(e) => updateProject(idx, 'tech', e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Impact and description"
                  value={proj.description}
                  onChange={(e) => updateProject(idx, 'description', e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Skills & Proficiencies
            </h3>
            <form onSubmit={addSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill (e.g. Next.js, Kubernetes)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
              >
                Add
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {resume.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="text-slate-400 hover:text-red-500 text-xs"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Live Resume Sheet Preview (Printable Canvas) */}
        <div className="lg:col-span-6">
          <div className="sticky top-20">
            <div className="no-print text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Live ATS Document Preview</span>
              <span className="text-[11px] text-indigo-600 font-normal">Ready for Print / PDF Export</span>
            </div>

            {/* A4 Sheet Container */}
            <div 
              id="printable-resume"
              className={`resume-sheet bg-white rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-10 text-slate-800 transition-all font-sans min-h-[750px] ${
                template === 'academic' ? 'font-serif' : ''
              }`}
            >
              
              {/* Header */}
              <div className={`pb-4 border-b ${template === 'academic' ? 'border-black text-center' : 'border-indigo-500'}`}>
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${template === 'academic' ? 'text-black' : 'text-slate-900'}`}>
                  {resume.fullName || 'Student Name'}
                </h1>
                <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600 ${template === 'academic' ? 'justify-center' : ''}`}>
                  {resume.email && <span>{resume.email}</span>}
                  {resume.phone && <span>• {resume.phone}</span>}
                  {resume.location && <span>• {resume.location}</span>}
                  {resume.linkedin && <span>• {resume.linkedin}</span>}
                  {resume.github && <span>• {resume.github}</span>}
                </div>
              </div>

              {/* Summary */}
              {resume.summary && (
                <div className="mt-4">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 ${template === 'academic' ? 'text-black' : 'text-indigo-700'}`}>
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {resume.summary}
                  </p>
                </div>
              )}

              {/* Education */}
              {resume.education.length > 0 && (
                <div className="mt-5">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${template === 'academic' ? 'text-black border-slate-300' : 'text-indigo-700 border-indigo-100'}`}>
                    Education
                  </h2>
                  <div className="space-y-2">
                    {resume.education.map((edu, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex items-baseline justify-between font-bold text-slate-900">
                          <span>{edu.institution}</span>
                          <span className="text-slate-500 font-normal">{edu.year}</span>
                        </div>
                        <div className="flex items-baseline justify-between text-slate-600 mt-0.5">
                          <span>{edu.degree}</span>
                          <span className="font-semibold text-slate-800">{edu.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {resume.experience.length > 0 && (
                <div className="mt-5">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${template === 'academic' ? 'text-black border-slate-300' : 'text-indigo-700 border-indigo-100'}`}>
                    Experience & Internships
                  </h2>
                  <div className="space-y-3">
                    {resume.experience.map((exp, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex items-baseline justify-between font-bold text-slate-900">
                          <span>{exp.role} — {exp.company}</span>
                          <span className="text-slate-500 font-normal">{exp.period}</span>
                        </div>
                        <ul className="mt-1 list-disc list-inside text-slate-600 space-y-0.5">
                          {Array.isArray(exp.details) ? (
                            exp.details.map((d, dIdx) => <li key={dIdx}>{d}</li>)
                          ) : (
                            <li>{exp.details}</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resume.projects.length > 0 && (
                <div className="mt-5">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${template === 'academic' ? 'text-black border-slate-300' : 'text-indigo-700 border-indigo-100'}`}>
                    Key Engineering Projects
                  </h2>
                  <div className="space-y-2.5">
                    {resume.projects.map((proj, i) => (
                      <div key={i} className="text-xs">
                        <div className="font-bold text-slate-900">
                          {proj.title} <span className="text-slate-500 font-normal text-[11px]">— ({proj.tech})</span>
                        </div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resume.skills.length > 0 && (
                <div className="mt-5">
                  <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${template === 'academic' ? 'text-black border-slate-300' : 'text-indigo-700 border-indigo-100'}`}>
                    Technical Skills & Tools
                  </h2>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    {resume.skills.join(' • ')}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
