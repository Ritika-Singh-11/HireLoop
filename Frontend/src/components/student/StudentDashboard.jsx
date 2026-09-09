import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Send, 
  CheckCircle, 
  Calendar, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  BrainCircuit, 
  Clock, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function StudentDashboard({ onNavigate }) {
  const { student, applications, jobs, announcements } = useApp();

  const myApps = applications.filter(a => a.studentId === student.id);
  const shortlistedCount = myApps.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = myApps.filter(a => a.status === 'Interview Scheduled').length;
  const offerCount = myApps.filter(a => a.status === 'Offer').length;

  const upcomingInterview = myApps.find(a => a.status === 'Interview Scheduled' && a.interviewDetails);
  const activeOffer = myApps.find(a => a.status === 'Offer' && a.offerDetails);

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Placement Drive 2026 Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {student.name}!
            </h1>
            <p className="mt-2 text-indigo-100/90 text-sm max-w-2xl leading-relaxed">
              {student.branch} • Roll: <span className="font-mono text-white">{student.rollNumber}</span> • CGPA: <span className="font-bold text-amber-300">{student.cgpa}</span> / 10.0
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('resume-analyzer')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-all shadow-md flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>ATS Resume Check</span>
            </button>
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs border border-indigo-400/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Mock Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applied</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{myApps.length}</span>
            <span className="text-xs text-slate-500">Drives</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shortlisted</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{shortlistedCount}</span>
            <span className="text-xs text-amber-600 font-semibold">Active Round</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interviews</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{interviewCount}</span>
            <span className="text-xs text-purple-600 font-semibold">Scheduled</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offers Received</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{offerCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">Congratulations!</span>
          </div>
        </div>
      </div>

      {/* Action alerts: Interview & Offer spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {upcomingInterview && (
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              <span>Upcoming Interview</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {upcomingInterview.companyName} — {upcomingInterview.jobTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {upcomingInterview.interviewDetails.round}
            </p>
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-900">{upcomingInterview.interviewDetails.date} at {upcomingInterview.interviewDetails.time}</div>
                <div className="text-slate-500 text-[11px]">Interviewer: {upcomingInterview.interviewDetails.interviewer}</div>
              </div>
              <a
                href={upcomingInterview.interviewDetails.meetLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
              >
                <span>Join Meet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {activeOffer && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 shadow-xs relative">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4" />
              <span>Active Placement Offer</span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {activeOffer.companyName}
              </h3>
              <span className="text-2xl font-black text-emerald-600">
                {activeOffer.offerDetails.package}
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 font-medium">
              Role: {activeOffer.offerDetails.designation} • Location: {activeOffer.offerDetails.location}
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-emerald-200/60 text-xs">
              <span className="text-slate-500">Accept before: {activeOffer.offerDetails.validTill}</span>
              <button 
                onClick={() => onNavigate('applications')}
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View Offer Letter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pinned College Announcements */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Placement Cell Official Notices
            </h3>
          </div>
          <span className="text-xs text-slate-500">Updated today</span>
        </div>

        <div className="divide-y divide-slate-100">
          {announcements.slice(0, 3).map((ann) => (
            <div key={ann.id} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm hover:text-indigo-600 transition-colors">
                      {ann.title}
                    </span>
                    {ann.pinned && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                        {ann.badge || 'Urgent'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span>{ann.author}</span>
                    <span>•</span>
                    <span>{ann.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('jobs')}
          className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 mt-4 text-sm group-hover:text-indigo-600 transition-colors">
            Explore Open Drives
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Browse {jobs.length} campus openings with AI match scores & 1-click apply.
          </p>
        </div>

        <div
          onClick={() => onNavigate('resume-builder')}
          className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 mt-4 text-sm group-hover:text-purple-600 transition-colors">
            Resume Builder & PDF
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Select modern campus templates and export your verified ATS resume.
          </p>
        </div>

        <div
          onClick={() => onNavigate('mock-interview')}
          className="group cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="p-3 w-fit rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 mt-4 text-sm group-hover:text-emerald-600 transition-colors">
            AI Mock Interview
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Practice role-specific technical questions with speech & AI scorecards.
          </p>
        </div>
      </div>

    </div>
  );
}
