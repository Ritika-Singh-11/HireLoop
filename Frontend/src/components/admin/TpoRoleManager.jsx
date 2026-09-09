import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Key, 
  CheckCircle2, 
  Plus, 
  UserCheck, 
  UserCog, 
  X 
} from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
  'Company Approvals',
  'Job Approvals',
  'Student Verification',
  'Drive Management',
  'Interview Scheduling',
  'Policy Editing',
  'Report Generation',
  'Announcements'
];

export default function TpoRoleManager() {
  const { tpoStaffList, setTpoStaffList, updateStaffRole, showToast } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New staff form
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Assistant TPO Officer',
    department: 'Engineering TPO Cell',
    accessLevel: 'TPO Staff',
    permissions: ['Student Verification', 'Drive Management']
  });

  const handleTogglePermission = (staffId, perm) => {
    const staff = tpoStaffList.find(s => s.id === staffId);
    if (!staff) return;

    const hasPerm = staff.permissions.includes(perm);
    const updatedPerms = hasPerm
      ? staff.permissions.filter(p => p !== perm)
      : [...staff.permissions, perm];

    updateStaffRole(staffId, staff.role, updatedPerms);
  };

  const handleRoleChange = (staffId, newRole) => {
    updateStaffRole(staffId, newRole);
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const createdStaff = {
      ...newStaff,
      id: `staff-${Date.now()}`
    };

    setTpoStaffList(prev => [...prev, createdStaff]);
    setIsAddModalOpen(false);
    showToast(`Staff member "${newStaff.name}" added to Placement Directorate.`);
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      role: 'Assistant TPO Officer',
      department: 'Engineering TPO Cell',
      accessLevel: 'TPO Staff',
      permissions: ['Student Verification', 'Drive Management']
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Placement Directorate Governance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            TPO Staff & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Delegate placement governance responsibilities across Dean, Assistant TPOs, and Student Placement Coordinators (SPCs).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add TPO Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 gap-5">
        {tpoStaffList.map(staff => (
          <div
            key={staff.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-lg flex items-center justify-center shrink-0">
                  {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{staff.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                      {staff.accessLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{staff.role} • {staff.department}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{staff.email} • {staff.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Access Level:</span>
                <select
                  value={staff.role}
                  onChange={(e) => handleRoleChange(staff.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Dean / Head of Placement Directorate">Dean / Super Admin</option>
                  <option value="Assistant TPO Officer">Assistant TPO Officer</option>
                  <option value="Senior Student Placement Coordinator">Student Placement Coordinator (SPC)</option>
                  <option value="Department Placement Faculty Lead">Department Faculty Lead</option>
                </select>
              </div>
            </div>

            {/* Granular Permissions Badges */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Assigned Operational Permissions:
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_PERMISSIONS.map(perm => {
                  const hasPerm = staff.permissions.includes('All Permissions') || staff.permissions.includes(perm);
                  const isAll = staff.permissions.includes('All Permissions');

                  return (
                    <button
                      key={perm}
                      disabled={isAll}
                      onClick={() => handleTogglePermission(staff.id, perm)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        hasPerm
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {hasPerm && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{perm}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Add TPO Directorate Official</h3>
                <p className="text-xs text-slate-500">Grant administrative or student coordinator privileges.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alok Trivedi"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="alok.tpo@campus.edu"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Access Level Role</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Assistant TPO Officer">Assistant TPO Officer</option>
                    <option value="Senior Student Placement Coordinator">Student Coordinator (SPC)</option>
                    <option value="Department Placement Faculty Lead">Department Faculty Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department / Branch</label>
                  <input
                    type="text"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-slate-900 hover:bg-black rounded-lg shadow-xs"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
