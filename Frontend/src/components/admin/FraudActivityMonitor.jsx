import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Clock, 
  UserX, 
  FileWarning, 
  Eye, 
  ShieldCheck,
  X
} from 'lucide-react';

export default function FraudActivityMonitor() {
  const { fraudAlerts, resolveFraudAlert, toggleBlockStudent, studentsList, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [resolveModalAlert, setResolveModalAlert] = useState(null);
  const [actionNote, setActionNote] = useState('');

  const filteredAlerts = fraudAlerts.filter(a => {
    const matchesSearch = 
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.studentRoll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || a.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const criticalCount = fraudAlerts.filter(a => a.severity === 'Critical' && !a.status.startsWith('Resolved')).length;
  const highCount = fraudAlerts.filter(a => a.severity === 'High' && !a.status.startsWith('Resolved')).length;
  const resolvedCount = fraudAlerts.filter(a => a.status.startsWith('Resolved')).length;

  const handleConfirmResolve = () => {
    if (resolveModalAlert) {
      resolveFraudAlert(resolveModalAlert.id, actionNote);
      setResolveModalAlert(null);
      setActionNote('');
    }
  };

  const handleInstantBlock = (alert) => {
    const student = studentsList.find(s => s.rollNumber === alert.studentRoll);
    if (student) {
      toggleBlockStudent(student.id, `Disciplinary freeze triggered by fraud alert: ${alert.type}`);
      resolveFraudAlert(alert.id, 'Candidate barred from placement participation');
    } else {
      resolveFraudAlert(alert.id, 'Disciplinary action recorded');
      showToast('Student record flagged and penalized.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Placement Integrity Surveillance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Fraud Detection & Discrepancy Monitor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated compliance auditing for dual-offer breaches, ERP vs resume score mismatches, and assessment proctoring violations.
          </p>
        </div>
      </div>

      {/* Surveillance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase">Critical Discrepancies</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-black text-rose-700 mt-2">{criticalCount}</p>
          <span className="text-xs text-rose-600 font-semibold mt-1 block">Requires immediate Dean review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase">Policy Warnings</span>
            <FileWarning className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-700 mt-2">{highCount}</p>
          <span className="text-xs text-amber-600 font-semibold mt-1 block">Dual-offer and attendance alerts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase">Resolved Inquiries</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700 mt-2">{resolvedCount}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Cases settled with audit notes</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or violation type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {['All', 'Critical', 'High', 'Medium'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            No compliance alerts found matching criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isResolved = alert.status.startsWith('Resolved');

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs transition-shadow space-y-4 ${
                  isResolved
                    ? 'border-slate-200 opacity-75'
                    : alert.severity === 'Critical'
                    ? 'border-rose-300 bg-rose-50/10'
                    : 'border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-700'
                        : alert.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">{alert.type}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          alert.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : alert.severity === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity} Severity
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        Candidate: {alert.studentName} <span className="font-mono text-slate-400">({alert.studentRoll})</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
                    isResolved
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {alert.description}
                </p>

                {/* Actions */}
                {!isResolved && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleInstantBlock(alert)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Suspend Candidate</span>
                    </button>

                    <button
                      onClick={() => setResolveModalAlert(alert)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Resolve with Audit Note</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resolve Audit Note Modal */}
      {resolveModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">Close Integrity Alert</h3>
                <p className="text-xs text-slate-500">{resolveModalAlert.studentName} ({resolveModalAlert.studentRoll})</p>
              </div>
              <button onClick={() => setResolveModalAlert(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Audit Resolution Summary:</label>
              <textarea
                rows="3"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="e.g. Student provided official attested ERP marksheet; warning issued regarding test network hops..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setResolveModalAlert(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg shadow-xs"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
