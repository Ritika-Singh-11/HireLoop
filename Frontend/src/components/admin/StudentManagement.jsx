import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  GraduationCap, 
  Building, 
  AlertTriangle,
  UserCheck,
  UserX,
  X
} from 'lucide-react';

export default function StudentManagement() {
  const { studentsList, verifyStudent, toggleBlockStudent, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [backendStudents, setBackendStudents] = useState([]);

  // Modal states
  const [blockModalStudent, setBlockModalStudent] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [viewProfileStudent, setViewProfileStudent] = useState(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await api.getAdminStudents();
        if (res?.students?.length) {
          setBackendStudents(res.students);
        }
      } catch (err) {
        console.warn('Using client student directory fallback:', err);
      }
    }
    loadStudents();
  }, []);

  const allStudents = backendStudents.length > 0
    ? backendStudents.map(bs => ({
        ...bs,
        id: bs._id || bs.id,
        isVerified: bs.isVerified ?? bs.verified ?? false,
        isBlocked: bs.isBlocked ?? false,
        rollNumber: bs.rollNumber || bs.roll || '21BCSE000',
        branch: bs.branch || 'Computer Science',
        batch: bs.batch || '2026',
        cgpa: bs.cgpa || 8.0,
        backlogs: bs.backlogs || 0
      }))
    : studentsList;

  const branches = ['All', ...new Set(allStudents.map(s => s.branch))];

  const filteredStudents = allStudents.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = branchFilter === 'All' || s.branch === branchFilter;

    let matchesStatus = true;
    if (statusFilter === 'Verified') matchesStatus = s.isVerified;
    if (statusFilter === 'Unverified') matchesStatus = !s.isVerified;
    if (statusFilter === 'Blocked') matchesStatus = s.isBlocked;
    if (statusFilter === 'Placed') matchesStatus = !!s.placedCompany;
    if (statusFilter === 'Unplaced') matchesStatus = !s.placedCompany && !s.isBlocked;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const totalCount = allStudents.length;
  const verifiedCount = allStudents.filter(s => s.isVerified).length;
  const blockedCount = allStudents.filter(s => s.isBlocked).length;
  const placedCount = allStudents.filter(s => s.placedCompany).length;

  const handleOpenBlockModal = (student) => {
    setBlockModalStudent(student);
    setBlockReason(student.blockReason || '');
  };

  const handleVerify = async (student) => {
    const studentId = student._id || student.id;
    const nextVerified = !student.isVerified;
    verifyStudent(student.id);

    setBackendStudents(prev => prev.map(s => 
      (s._id === studentId || s.id === studentId) ? { ...s, isVerified: nextVerified, verified: nextVerified } : s
    ));

    try {
      await api.verifyStudent(studentId, nextVerified);
      if (showToast) showToast(nextVerified ? 'Student credentials verified in TPO database!' : 'Verification revoked.');
    } catch (err) {
      console.warn('Could not sync student verification with backend:', err);
    }
  };

  const handleConfirmBlockToggle = async () => {
    if (blockModalStudent) {
      const studentId = blockModalStudent._id || blockModalStudent.id;
      const nextBlocked = !blockModalStudent.isBlocked;
      toggleBlockStudent(blockModalStudent.id, blockReason);

      setBackendStudents(prev => prev.map(s => 
        (s._id === studentId || s.id === studentId) ? { ...s, isBlocked: nextBlocked, blockReason: nextBlocked ? blockReason : null } : s
      ));

      try {
        await api.toggleBlockStudent(studentId, nextBlocked, blockReason);
        if (showToast) showToast(nextBlocked ? 'Student barred from placement drives.' : 'Disciplinary hold lifted.');
      } catch (err) {
        console.warn('Could not sync disciplinary status with backend:', err);
      }

      setBlockModalStudent(null);
      setBlockReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>TPO Student Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Management & Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authenticate student academic records, audit eligibility status, and enforce placement discipline.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
          <span className="text-xs text-slate-400">Class of 2026 Batch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Verified & Eligible</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{verifiedCount}</p>
          <span className="text-xs text-emerald-600 font-semibold">{Math.round((verifiedCount / (totalCount || 1)) * 100)}% Verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Blocked / Suspended</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">{blockedCount}</p>
          <span className="text-xs text-rose-600 font-semibold">Policy violations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">Offers Extended</span>
            <Building className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{placedCount}</p>
          <span className="text-xs text-purple-600 font-semibold">{Math.round((placedCount / (totalCount || 1)) * 100)}% Placed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or campus email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {branches.map(b => (
              <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Unverified">Unverified Only</option>
            <option value="Blocked">Blocked Only</option>
            <option value="Placed">Placed Students</option>
            <option value="Unplaced">Seeking Placement</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Branch & Batch</th>
                <th className="py-3 px-4">Academics</th>
                <th className="py-3 px-4">Placement Status</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">TPO Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No students match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className={`hover:bg-slate-50/60 transition-colors ${s.isBlocked ? 'bg-rose-50/20' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            {s.name}
                            {s.isBlocked && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                Blocked
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{s.rollNumber} • {s.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{s.branch}</p>
                      <p className="text-[11px] text-slate-400">Batch {s.batch}</p>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{s.cgpa}</span>
                        <span className="text-[10px] text-slate-400">CGPA</span>
                      </div>
                      <span className={`text-[10px] font-bold ${s.backlogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {s.backlogs === 0 ? 'Zero Backlogs' : `${s.backlogs} Active Backlog(s)`}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {s.placedCompany ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Placed @ {s.placedCompany}
                          </span>
                          <p className="text-[10px] font-bold text-slate-600 mt-0.5">{s.placedCtc}</p>
                        </div>
                      ) : s.isBlocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Barred from Drives
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Active Job Seeker
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {s.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Pending Review
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewProfileStudent(s)}
                          title="View Details"
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => handleVerify(s)}
                          title={s.isVerified ? "Revoke Verification" : "Mark Verified"}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                            s.isVerified
                              ? 'border border-slate-200 hover:bg-slate-100 text-slate-600'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{s.isVerified ? 'Unverify' : 'Verify'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenBlockModal(s)}
                          title={s.isBlocked ? "Unblock Student" : "Block from Campus Placements"}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                            s.isBlocked
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>{s.isBlocked ? 'Unblock' : 'Block'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block / Unblock Confirmation Modal */}
      {blockModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${blockModalStudent.isBlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {blockModalStudent.isBlocked ? 'Lift Student Suspension' : 'Block Student from Placement'}
                  </h3>
                  <p className="text-xs text-slate-500">{blockModalStudent.name} ({blockModalStudent.rollNumber})</p>
                </div>
              </div>
              <button 
                onClick={() => setBlockModalStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {!blockModalStudent.isBlocked ? (
                <>
                  <p className="text-xs text-slate-600">
                    Blocking a student immediately invalidates all their active job applications and disqualifies them from registering for upcoming campus placement drives.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Reason for Disciplinary Action / Policy Breach:
                    </label>
                    <textarea
                      rows="3"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="e.g. Uninformed absence from interview round, fraudulent CGPA declaration, violation of dress code..."
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <p className="font-bold text-slate-700 mb-1">Current Block Reason:</p>
                  <p className="text-slate-600 italic">"{blockModalStudent.blockReason || 'Disciplinary violation'}"</p>
                  <p className="mt-2 text-slate-500">
                    Are you sure you want to reinstate this student to active placement eligibility?
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setBlockModalStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlockToggle}
                className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-xs ${
                  blockModalStudent.isBlocked
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {blockModalStudent.isBlocked ? 'Confirm Unblock' : 'Enforce Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Quick Inspect Modal */}
      {viewProfileStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-base flex items-center justify-center">
                  {viewProfileStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{viewProfileStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{viewProfileStudent.rollNumber} • {viewProfileStudent.branch}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewProfileStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-semibold block">CGPA Score</span>
                  <span className="text-lg font-black text-indigo-700">{viewProfileStudent.cgpa} / 10.0</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-semibold block">Active Backlogs</span>
                  <span className="text-lg font-black text-slate-800">{viewProfileStudent.backlogs}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-semibold block">Contact Email</span>
                  <span className="font-semibold text-slate-700 break-all">{viewProfileStudent.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-semibold block">Phone</span>
                  <span className="font-semibold text-slate-700">{viewProfileStudent.phone || '+91 98765 43210'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1.5">Registered Technical Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewProfileStudent.skills?.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-0.5">Placement Cell Status:</span>
                <p className="text-amber-800">
                  {viewProfileStudent.isBlocked
                    ? `Suspended: ${viewProfileStudent.blockReason || 'Disciplinary violation'}`
                    : viewProfileStudent.placedCompany
                    ? `Placed at ${viewProfileStudent.placedCompany} with package ${viewProfileStudent.placedCtc}`
                    : 'Actively participating in ongoing recruitment drives.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewProfileStudent(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
