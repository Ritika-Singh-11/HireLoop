import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Building2
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const {
    login,
    loginWithGoogle,
    loginWithGithub,
    registerStudent,
    registerRecruiter,
    registerAdmin,
    loginAsDemoAdmin,
    authModalTab,
    authModalTargetRole,
    authError
  } = useApp();

  const [activePortal, setActivePortal] = useState('student'); // 'student' | 'recruiter' | 'admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Sync initial tab and role when modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthMode(authModalTab === 'register' ? 'register' : 'login');
      if (authModalTargetRole === 'admin') setActivePortal('admin');
      else if (authModalTargetRole === 'recruiter') setActivePortal('recruiter');
      else setActivePortal('student');
      setFormError('');
    }
  }, [isOpen, authModalTab, authModalTargetRole]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Student register form state
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    branch: 'Computer Science & Engineering',
    batch: '2026',
    cgpa: 8.5,
    skills: 'React, Node.js, Python, SQL, Git'
  });

  // Recruiter register form state
  const [recruiterForm, setRecruiterForm] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    companyLogo: '🏢',
    industry: 'Technology / SaaS',
    website: 'https://',
    location: 'Bangalore, India'
  });

  // Admin register form state
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Central Placement Directorate',
    designation: 'Head of Placement Cell',
    adminSecretKey: 'TPO2026'
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    const success = await login(loginEmail, loginPassword, activePortal);
    setSubmitting(false);
    if (success) {
      onClose();
    } else {
      setFormError(authError || 'Login failed. Please verify your credentials.');
    }
  };

  const handleStudentRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    const success = await registerStudent(studentForm);
    setSubmitting(false);
    if (success) {
      onClose();
    } else {
      setFormError('Registration failed. Please check the details or try another email.');
    }
  };

  const handleRecruiterRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    const success = await registerRecruiter(recruiterForm);
    setSubmitting(false);
    if (success) {
      onClose();
    } else {
      setFormError('Registration failed. Please check the details or try another email.');
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    const success = await registerAdmin(adminForm);
    setSubmitting(false);
    if (success) {
      onClose();
    } else {
      setFormError(authError || 'Admin registration failed. Please verify your details and TPO security key.');
    }
  };

  const handleDemoAdminLogin = () => {
    loginAsDemoAdmin();
    onClose();
  };

  const isStudentPortal = activePortal === 'student';
  const isRecruiterPortal = activePortal === 'recruiter';
  const isAdminPortal = activePortal === 'admin';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">

        {/* Modal Top Header */}
        <div className={`p-6 text-white relative transition-colors duration-300 ${
          isAdminPortal
            ? 'bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900'
            : isStudentPortal 
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900' 
            : 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md border ${
                isAdminPortal
                  ? 'bg-purple-600/90 border-purple-400/30'
                  : isStudentPortal 
                  ? 'bg-indigo-600/90 border-indigo-400/30' 
                  : 'bg-emerald-600/90 border-emerald-400/30'
              }`}>
                {isAdminPortal ? (
                  <ShieldCheck className="w-5 h-5 text-purple-200" />
                ) : isStudentPortal ? (
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                ) : (
                  <Briefcase className="w-5 h-5 text-emerald-300" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">
                  {isAdminPortal ? 'Placement Directorate (TPO)' : isStudentPortal ? 'Student Placement Portal' : 'Corporate Recruiter Hub'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isAdminPortal
                    ? 'Placement Cell Official Authentication & Governance'
                    : isStudentPortal 
                    ? '1-Click Campus Jobs, AI Resumes & ATS Scoring' 
                    : 'Campus Hiring, Verified Candidate Screening & Drives'}
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Panel Selector (Student vs Recruiter vs Admin) */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Authenticating For:</span>
            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setActivePortal('student'); setFormError(''); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isStudentPortal 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => { setActivePortal('recruiter'); setFormError(''); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isRecruiterPortal 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter</span>
              </button>
              <button
                type="button"
                onClick={() => { setActivePortal('admin'); setFormError(''); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAdminPortal 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin (TPO)</span>
              </button>
            </div>
          </div>

          {/* Primary Switcher Tabs: Sign In vs Create Account */}
          <div className="grid grid-cols-2 gap-1 mt-4 bg-white/10 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setFormError(''); }}
              className={`py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? (isAdminPortal ? 'bg-purple-600 text-white shadow-md' : isStudentPortal ? 'bg-indigo-600 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md')
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setFormError(''); }}
              className={`py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? (isAdminPortal ? 'bg-purple-600 text-white shadow-md' : isStudentPortal ? 'bg-indigo-600 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md')
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Register New {isAdminPortal ? 'TPO Official' : isStudentPortal ? 'Student' : 'Company'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto flex-1">

          {/* Error Banner */}
          {(formError || authError) && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError || authError}</span>
            </div>
          )}

          {/* ================= 1. SIGN IN MODE ================= */}
          {authMode === 'login' && (
            <div className="space-y-5">
              
              {/* Context notification */}
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                isStudentPortal 
                  ? 'bg-indigo-50/70 border-indigo-100 text-indigo-900' 
                  : 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isStudentPortal ? 'text-indigo-600' : 'text-emerald-600'}`} />
                <span>
                  Logging into <strong>{isStudentPortal ? 'Student View' : 'Recruiter View'}</strong>. Your session will stay strictly inside this panel.
                </span>
              </div>

              {/* OAuth Social Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all hover:border-slate-300 shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={loginWithGithub}
                  className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all hover:border-slate-300 shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Sign In</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Or sign in with email
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAdminPortal ? 'TPO Official Email' : isStudentPortal ? 'College Email Address' : 'Official Work Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder={isAdminPortal ? "skverma@campus.edu" : isStudentPortal ? "yourname@campus.edu" : "recruiter@company.com"}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${
                    isAdminPortal
                      ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                      : isStudentPortal
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  <span>
                    {submitting 
                      ? 'Signing in…' 
                      : `Sign In to ${isAdminPortal ? 'TPO Directorate' : isStudentPortal ? 'Student Portal' : 'Recruiter Hub'}`}
                  </span>
                  {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                {isAdminPortal && (
                  <div className="pt-2">
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-200" />
                      <span className="shrink mx-2 text-[10px] text-slate-400 uppercase font-bold">Fast Access</span>
                      <div className="flex-grow border-t border-slate-200" />
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoAdminLogin}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>1-Click Instant TPO Login (Dean / Super Admin)</span>
                    </button>
                  </div>
                )}
              </form>

              {/* Seamless toggle to Register */}
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Don't have an account for {isAdminPortal ? 'TPO Directorate' : isStudentPortal ? 'Student' : 'Recruiter'}?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setFormError(''); }}
                    className={`font-bold hover:underline inline-flex items-center gap-1 cursor-pointer ${
                      isAdminPortal ? 'text-purple-600' : isStudentPortal ? 'text-indigo-600' : 'text-emerald-600'
                    }`}
                  >
                    <span>Register here</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ================= 2. REGISTER MODE ================= */}
          {authMode === 'register' && (
            <div className="space-y-4">

              {isAdminPortal ? (
                /* Admin Registration Form */
                <form onSubmit={handleAdminRegister} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text" required placeholder="e.g. Dr. Rajesh Sharma"
                        value={adminForm.name}
                        onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official College Email *</label>
                      <input
                        type="email" required placeholder="tpo.officer@campus.edu"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password" required placeholder="••••••••"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Campus TPO Secret Key *</label>
                      <input
                        type="text" required placeholder="TPO2026"
                        value={adminForm.adminSecretKey}
                        onChange={(e) => setAdminForm({ ...adminForm, adminSecretKey: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500 font-mono tracking-wider"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Cell</label>
                      <input
                        type="text" placeholder="Training & Placement Cell"
                        value={adminForm.department}
                        onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                      <input
                        type="text" placeholder="Head of Placement Cell / Dean"
                        value={adminForm.designation}
                        onChange={(e) => setAdminForm({ ...adminForm, designation: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <span>Authorized TPO Governance Access</span>
                    </div>
                    <p className="text-[11px] text-purple-800 leading-relaxed">
                      Registers exclusively to the Campus Placement Directorate panel. Campus secret key: <span className="font-mono font-bold bg-purple-100 px-1 py-0.5 rounded text-purple-900">TPO2026</span>.
                    </p>
                  </div>

                  <button
                    type="submit" disabled={submitting}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{submitting ? 'Registering administrator…' : 'Register as TPO Officer & Enter Portal'}</span>
                  </button>

                  <div className="pt-2 border-t border-dashed border-purple-200">
                    <button
                      type="button"
                      onClick={handleDemoAdminLogin}
                      className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Or Enter with 1-Click Demo Dean Profile</span>
                    </button>
                  </div>
                </form>
              ) : isStudentPortal ? (
                <form onSubmit={handleStudentRegister} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text" required placeholder="e.g. Rohan Verma"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">College Roll No *</label>
                      <input
                        type="text" required placeholder="e.g. 21BCSE092"
                        value={studentForm.rollNumber}
                        onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">College Email Address *</label>
                      <input
                        type="email" required placeholder="rohan.v@campus.edu"
                        value={studentForm.email}
                        onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password" required placeholder="••••••••"
                        value={studentForm.password}
                        onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Discipline</label>
                      <select
                        value={studentForm.branch}
                        onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics & Comm.">Electronics & Comm.</option>
                        <option value="Electrical Engg.">Electrical Engg.</option>
                        <option value="Mechanical Engg.">Mechanical Engg.</option>
                        <option value="Civil Engg.">Civil Engg.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA (0 - 10)</label>
                      <input
                        type="number" step="0.01" min="0" max="10" required
                        value={studentForm.cgpa}
                        onChange={(e) => setStudentForm({ ...studentForm, cgpa: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Skills (Comma Separated)</label>
                    <input
                      type="text" placeholder="React, Python, Node.js, SQL, Git"
                      value={studentForm.skills}
                      onChange={(e) => setStudentForm({ ...studentForm, skills: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Registers exclusively to the Student Panel. Immediate access to 1-Click Applications & AI Mock Interviews.</span>
                  </div>

                  <button
                    type="submit" disabled={submitting}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{submitting ? 'Creating student account…' : 'Create Student Account & Enter Portal'}</span>
                  </button>
                </form>
              ) : (
                /* Recruiter Registration Form */
                <form onSubmit={handleRecruiterRegister} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                      <input
                        type="text" required placeholder="e.g. Uber Technologies / Swiggy"
                        value={recruiterForm.companyName}
                        onChange={(e) => setRecruiterForm({ ...recruiterForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Representative Name *</label>
                      <input
                        type="text" required placeholder="e.g. Priya Malik"
                        value={recruiterForm.name}
                        onChange={(e) => setRecruiterForm({ ...recruiterForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official Work Email *</label>
                      <input
                        type="email" required placeholder="priya.recruiter@uber.com"
                        value={recruiterForm.email}
                        onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password" required placeholder="••••••••"
                        value={recruiterForm.password}
                        onChange={(e) => setRecruiterForm({ ...recruiterForm, password: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                      <input
                        type="text" placeholder="e.g. Mobility & Logistics / FinTech"
                        value={recruiterForm.industry}
                        onChange={(e) => setRecruiterForm({ ...recruiterForm, industry: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company Website</label>
                      <input
                        type="url" placeholder="https://uber.com"
                        value={recruiterForm.website}
                        onChange={(e) => setRecruiterForm({ ...recruiterForm, website: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>TPC Placement Verification</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Registers exclusively to the Recruiter Panel. You can immediately post openings, which activate upon TPC clearance.
                    </p>
                  </div>

                  <button
                    type="submit" disabled={submitting}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{submitting ? 'Registering company…' : 'Register Company & Enter Recruiter Hub'}</span>
                  </button>
                </form>
              )}

              {/* Seamless toggle to Sign In */}
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setFormError(''); }}
                    className={`font-bold hover:underline inline-flex items-center gap-1 cursor-pointer ${
                      isAdminPortal ? 'text-purple-600' : isStudentPortal ? 'text-indigo-600' : 'text-emerald-600'
                    }`}
                  >
                    <span>Sign in to your account</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
