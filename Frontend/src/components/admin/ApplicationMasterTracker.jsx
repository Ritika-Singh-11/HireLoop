import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Search, 
  Filter, 
  Building, 
  User, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar, 
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';

export default function ApplicationMasterTracker() {
  const { applications, updateApplicationStatus, companies } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');

  const companyNames = ['All', ...new Set(applications.map(a => a.companyName))];
  const statuses = ['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Rejected'];

  const filteredApps = applications.filter(app => {
    const studentName = app.studentName || 'Aarav Sharma';
    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesCompany = companyFilter === 'All' || app.companyName === companyFilter;

    return matchesSearch && matchesStatus && matchesCompany;
  });

  const totalApps = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'Interview Scheduled').length;
  const offeredCount = applications.filter(a => a.status === 'Offered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Cross-Campus Application Registry</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Master Application Tracker & Status Pipeline
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete institutional oversight of which candidate has applied to which recruiting partner, their pipeline phase, and decision outcomes.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Applications</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalApps}</p>
          <span className="text-[11px] text-slate-400">Across all drives</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-blue-700">Shortlisted Pool</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{shortlistedCount}</p>
          <span className="text-[11px] text-blue-600 font-semibold">Cleared first screening</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-purple-700">Interviewing</span>
          <p className="text-2xl font-black text-purple-700 mt-1">{interviewCount}</p>
          <span className="text-[11px] text-purple-600 font-semibold">Active evaluation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700">Offers Extended</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{offeredCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Placement confirmed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, company, or target role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            {companyNames.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Companies' : c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Applied Job & Company</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4">ATS Fit</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">TPO Status Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No application records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => {
                  const studentName = app.studentName || 'Aarav Sharma';
                  const rollNo = app.studentRoll || '21BCSE104';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {studentName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{studentName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{rollNo}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{app.jobTitle}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                          <Building className="w-3 h-3 text-slate-400" />
                          {app.companyName}
                        </p>
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{app.appliedAt || 'Recent'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 w-fit">
                            <Sparkles className="w-3 h-3" />
                            {app.atsScore || 88}% ATS Fit
                          </span>
                          {app.assessmentScore !== undefined ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border w-fit ${
                              app.assessmentPassed !== false
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              <Code2 className="w-3 h-3" />
                              {app.assessmentScore}% Test ({app.assessmentPassed !== false ? 'Passed' : 'Failed'})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 w-fit">
                              <Code2 className="w-3 h-3 text-slate-400" />
                              Test Pending
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Offered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Interview Scheduled'
                            ? 'bg-purple-100 text-purple-800'
                            : app.status === 'Shortlisted'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview</option>
                          <option value="Offered">Offered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
