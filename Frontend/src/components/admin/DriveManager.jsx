import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles,
  ChevronRight,
  X,
  UserCheck,
  UserX,
  Award,
  Filter,
  Check,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../../services/api';

const DEFAULT_PHASES = [
  'Pre-Placement Talk',
  'Online Assessment',
  'Technical Interview 1',
  'Technical Interview 2',
  'HR & Offer Extension'
];

export default function DriveManager() {
  const { drivesList, setDrivesList, createPlacementDrive, updateDrivePhase, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDriveForRoster, setSelectedDriveForRoster] = useState(null);
  const [isAdvancingPhase, setIsAdvancingPhase] = useState(false);

  // Sync with backend on mount
  useEffect(() => {
    async function fetchDrives() {
      try {
        const res = await api.getDrives();
        if (res?.drives && res.drives.length > 0) {
          setDrivesList(res.drives);
        }
      } catch (err) {
        console.warn('Using local drives fallback:', err);
      }
    }
    fetchDrives();
  }, []);

  // New Drive Form State
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    companyLogo: '🏢',
    roleTitle: '',
    ctcDisplay: '₹14 - ₹18 LPA',
    scheduledDate: '',
    venue: 'Campus Placement Lab & Google Meet',
    tier: 'Dream',
    minCgpa: 7.0,
    maxBacklogs: 0,
    phases: DEFAULT_PHASES,
    currentPhase: DEFAULT_PHASES[0],
    eligibleCount: 150
  });

  const filteredDrives = drivesList.filter(d => {
    if (filterStatus === 'All') return true;
    return d.status === filterStatus;
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newDrive.companyName || !newDrive.roleTitle) return;

    const payload = {
      ...newDrive,
      eligibilityCriteria: {
        minCgpa: parseFloat(newDrive.minCgpa),
        maxBacklogs: parseInt(newDrive.maxBacklogs),
        allowedBranches: [
          'Computer Science & Engineering',
          'Information Technology',
          'Electronics & Comm.',
          'Data Science & AI'
        ],
        eligibleBatch: '2026',
        allowMultipleOffers: true
      }
    };

    try {
      const res = await api.createDrive(payload);
      if (res?.drive) {
        setDrivesList(prev => [res.drive, ...prev]);
      } else {
        createPlacementDrive(newDrive);
      }
    } catch (err) {
      createPlacementDrive(newDrive);
    }

    setIsCreateModalOpen(false);
    if (showToast) showToast(`Campus Placement Drive for ${newDrive.companyName} published!`);

    setNewDrive({
      companyName: '',
      companyLogo: '🏢',
      roleTitle: '',
      ctcDisplay: '₹14 - ₹18 LPA',
      scheduledDate: '',
      venue: 'Campus Placement Lab & Google Meet',
      tier: 'Dream',
      minCgpa: 7.0,
      maxBacklogs: 0,
      phases: DEFAULT_PHASES,
      currentPhase: DEFAULT_PHASES[0],
      eligibleCount: 150
    });
  };

  const handleAdvancePhase = async (drive) => {
    const currentIndex = drive.phases.indexOf(drive.currentPhase);
    if (currentIndex < drive.phases.length - 1) {
      const nextPhase = drive.phases[currentIndex + 1];
      setIsAdvancingPhase(true);
      try {
        await api.updateDrivePhase(drive.id, nextPhase);
      } catch (err) {
        console.warn('Backend phase update notice:', err);
      } finally {
        setIsAdvancingPhase(false);
      }

      updateDrivePhase(drive.id, nextPhase);
      if (showToast) {
        showToast(`${drive.companyName} recruitment round advanced to: ${nextPhase}`);
      }
    }
  };

  const handleUpdateCandidate = async (driveId, candidateId, newStatus, nextRound) => {
    try {
      await api.updateCandidateDriveStatus(driveId, {
        candidateId,
        status: newStatus,
        currentRound: nextRound
      });
    } catch (err) {
      console.warn('Candidate status fallback:', err);
    }

    // Update in local state
    setDrivesList(prev => prev.map(d => {
      if (d.id !== driveId) return d;
      const updatedCandidates = (d.candidates || []).map(c => {
        if (c._id === candidateId || c.id === candidateId || c.hallTicketCode === candidateId) {
          return {
            ...c,
            status: newStatus,
            currentRound: nextRound || c.currentRound
          };
        }
        return c;
      });
      return { ...d, candidates: updatedCandidates };
    }));

    if (selectedDriveForRoster && selectedDriveForRoster.id === driveId) {
      setSelectedDriveForRoster(prev => ({
        ...prev,
        candidates: prev.candidates.map(c => {
          if (c._id === candidateId || c.id === candidateId || c.hallTicketCode === candidateId) {
            return { ...c, status: newStatus, currentRound: nextRound || c.currentRound };
          }
          return c;
        })
      }));
    }

    if (showToast) showToast(`Candidate updated to "${newStatus}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>On-Campus Recruitment Drives</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Placement Drive Management & Round Progression
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee multi-stage campus placement drives, track candidate advancement across technical rounds, and extend official offers.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Campus Drive</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['All', 'Live', 'Upcoming', 'Completed'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === st
                ? 'bg-purple-100 text-purple-800'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st} Drives
          </button>
        ))}
      </div>

      {/* Drives List */}
      <div className="space-y-5">
        {filteredDrives.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            No recruitment drives found in this category.
          </div>
        ) : (
          filteredDrives.map(drive => {
            const currentPhaseIdx = drive.phases ? drive.phases.indexOf(drive.currentPhase) : 0;
            const isFinished = drive.phases && currentPhaseIdx === drive.phases.length - 1;
            const candidateList = drive.candidates || [];
            const registeredCount = candidateList.length;

            return (
              <div
                key={drive.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-5"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                      {drive.companyLogo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-lg">{drive.companyName}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                          {drive.tier || 'Dream'} Tier
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          drive.status === 'Live'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : drive.status === 'Upcoming'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {drive.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">{drive.roleTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <div className="text-right">
                      <span className="text-slate-400 block font-semibold">Compensation</span>
                      <span className="font-extrabold text-emerald-700 text-sm">{drive.ctcDisplay}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="text-right">
                      <span className="text-slate-400 block font-semibold">Candidates</span>
                      <button
                        onClick={() => setSelectedDriveForRoster(drive)}
                        className="font-extrabold text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{registeredCount} Registered</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Date: {drive.scheduledDate || 'Ongoing'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Venue: {drive.venue}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-purple-700">
                    <Clock className="w-3.5 h-3.5" />
                    Active Stage: <strong>{drive.currentPhase}</strong>
                  </span>
                </div>

                {/* Phased Visual Pipeline */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>Recruitment Rounds Progression</span>
                    <span className="text-purple-700">
                      Step {currentPhaseIdx + 1} of {(drive.phases || []).length}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(drive.phases || DEFAULT_PHASES).map((phaseName, pIdx) => {
                      const isPast = pIdx < currentPhaseIdx;
                      const isCurrent = pIdx === currentPhaseIdx;

                      return (
                        <div
                          key={pIdx}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold'
                              : isPast
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className="text-[10px] mb-0.5 opacity-80">Round {pIdx + 1}</div>
                          <div className="text-xs truncate">{phaseName}</div>
                          {isPast && <div className="text-[10px] mt-1 text-emerald-600 font-bold">✓ Cleared</div>}
                          {isCurrent && <div className="text-[10px] mt-1 text-purple-200 font-extrabold animate-pulse">● In Progress</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Drive Phase Advancement Actions & Roster Trigger */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedDriveForRoster(drive)}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View Candidate Roster & Hall Tickets ({registeredCount})</span>
                  </button>

                  {!isFinished ? (
                    <button
                      onClick={() => handleAdvancePhase(drive)}
                      disabled={isAdvancingPhase}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isAdvancingPhase ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      <span>Advance to Next Round</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Drive Concluded (Offers Released)</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Candidate Roster Drawer / Modal */}
      {selectedDriveForRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-xl">
                    Candidate Roster: {selectedDriveForRoster.companyName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {selectedDriveForRoster.roleTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Active Round: <strong className="text-purple-700">{selectedDriveForRoster.currentPhase}</strong> • Manage round qualifications and offers.
                </p>
              </div>
              <button onClick={() => setSelectedDriveForRoster(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate List Table */}
            {(!selectedDriveForRoster.candidates || selectedDriveForRoster.candidates.length === 0) ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                No candidates have registered for this drive yet. Eligible students can register from their Student Portal.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Hall Ticket Pass</th>
                      <th className="p-3">CGPA / Branch</th>
                      <th className="p-3">Round & Status</th>
                      <th className="p-3 text-right">TPC Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedDriveForRoster.candidates.map((cand, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{cand.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-500">{cand.studentRoll}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-indigo-700">
                          {cand.hallTicketCode || 'PENDING-PASS'}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-emerald-700">{cand.studentCgpa} CGPA</span>
                          <div className="text-[11px] text-slate-500">{cand.studentBranch}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cand.status === 'Offered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cand.status === 'Shortlisted'
                              ? 'bg-indigo-100 text-indigo-800'
                              : cand.status === 'Eliminated'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {cand.status}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">{cand.currentRound}</div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {cand.status !== 'Offered' && cand.status !== 'Eliminated' && (
                              <>
                                <button
                                  onClick={() => handleUpdateCandidate(
                                    selectedDriveForRoster.id,
                                    cand._id || cand.id || cand.hallTicketCode,
                                    'Shortlisted',
                                    selectedDriveForRoster.currentPhase
                                  )}
                                  className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200"
                                >
                                  Advance
                                </button>
                                <button
                                  onClick={() => handleUpdateCandidate(
                                    selectedDriveForRoster.id,
                                    cand._id || cand.id || cand.hallTicketCode,
                                    'Offered',
                                    'Offer Extension'
                                  )}
                                  className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200"
                                >
                                  Offer
                                </button>
                                <button
                                  onClick={() => handleUpdateCandidate(
                                    selectedDriveForRoster.id,
                                    cand._id || cand.id || cand.hallTicketCode,
                                    'Eliminated',
                                    cand.currentRound
                                  )}
                                  className="px-2 py-1 rounded hover:bg-rose-50 text-rose-600 text-[11px] font-bold"
                                >
                                  Eliminate
                                </button>
                              </>
                            )}
                            {cand.status === 'Offered' && (
                              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" />
                                <span>Offer Extended</span>
                              </span>
                            )}
                            {cand.status === 'Eliminated' && (
                              <span className="text-[11px] font-semibold text-slate-400">
                                Disqualified
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Official records synchronized with Student Placement Profiles.
              </span>
              <button
                onClick={() => setSelectedDriveForRoster(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Placement Drive Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Create New Placement Drive</h3>
                <p className="text-xs text-slate-500">Configure on-campus recruitment rounds and eligibility gates.</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cisco Systems"
                    value={newDrive.companyName}
                    onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Logo / Emoji</label>
                  <input
                    type="text"
                    value={newDrive.companyLogo}
                    onChange={(e) => setNewDrive({ ...newDrive, companyLogo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Designation / Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer (Cloud Infrastructure)"
                  value={newDrive.roleTitle}
                  onChange={(e) => setNewDrive({ ...newDrive, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CTC Package Display</label>
                  <input
                    type="text"
                    value={newDrive.ctcDisplay}
                    onChange={(e) => setNewDrive({ ...newDrive, ctcDisplay: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recruitment Tier</label>
                  <select
                    value={newDrive.tier}
                    onChange={(e) => setNewDrive({ ...newDrive, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Standard">Standard (&lt; ₹15 LPA)</option>
                    <option value="Dream">Dream (₹15 - ₹25 LPA)</option>
                    <option value="Super Dream">Super Dream (&gt; ₹25 LPA)</option>
                  </select>
                </div>
              </div>

              {/* Automated Eligibility Gate Inputs */}
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2">
                <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                  Eligibility Filter Gates:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Min CGPA Cutoff</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newDrive.minCgpa}
                      onChange={(e) => setNewDrive({ ...newDrive, minCgpa: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Max Active Backlogs</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={newDrive.maxBacklogs}
                      onChange={(e) => setNewDrive({ ...newDrive, maxBacklogs: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Drive Date</label>
                  <input
                    type="date"
                    value={newDrive.scheduledDate}
                    onChange={(e) => setNewDrive({ ...newDrive, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Venue / Test Link</label>
                  <input
                    type="text"
                    value={newDrive.venue}
                    onChange={(e) => setNewDrive({ ...newDrive, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
                >
                  Launch Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
