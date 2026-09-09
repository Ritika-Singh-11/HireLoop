import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  QrCode, 
  ChevronRight, 
  Sparkles, 
  FileText,
  ShieldCheck,
  Loader2,
  Ticket
} from 'lucide-react';
import { api } from '../../services/api';
import DrivePassModal from './DrivePassModal';

export default function StudentDrivesPortal() {
  const { student, drivesList, setDrivesList, showToast } = useApp();
  const [selectedPass, setSelectedPass] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [registeringDriveId, setRegisteringDriveId] = useState(null);

  // Sync drives from backend
  useEffect(() => {
    async function loadDrives() {
      try {
        const res = await api.getDrives();
        if (res?.drives && res.drives.length > 0) {
          setDrivesList(res.drives);
        }
      } catch (err) {
        console.warn('Using local drives fallback:', err);
      }
    }
    loadDrives();
  }, []);

  // Determine eligibility for a given drive
  const checkEligibility = (drive) => {
    const criteria = drive.eligibilityCriteria || {};
    const minCgpa = criteria.minCgpa ?? 7.0;
    const maxBacklogs = criteria.maxBacklogs ?? 0;
    const allowedBranches = criteria.allowedBranches || [];
    const eligibleBatch = criteria.eligibleBatch || '2026';

    const cgpaOk = (student.cgpa || 8.5) >= minCgpa;
    const backlogsOk = (student.backlogs || 0) <= maxBacklogs;
    const branchOk = allowedBranches.length === 0 || allowedBranches.some(b => 
      (student.branch || '').toLowerCase().includes(b.toLowerCase()) ||
      b.toLowerCase().includes((student.branch || '').toLowerCase())
    );
    const batchOk = !eligibleBatch || student.batch === eligibleBatch;
    const notBlocked = !student.isBlocked;

    const isEligible = cgpaOk && backlogsOk && branchOk && batchOk && notBlocked;

    const reasons = [];
    if (!cgpaOk) reasons.push(`Min CGPA required: ${minCgpa} (Yours: ${student.cgpa})`);
    if (!backlogsOk) reasons.push(`Max backlogs: ${maxBacklogs} (Yours: ${student.backlogs})`);
    if (!branchOk) reasons.push(`Discipline not eligible`);
    if (!batchOk) reasons.push(`Eligible for Class of ${eligibleBatch}`);
    if (!notBlocked) reasons.push(`Account under disciplinary hold`);

    return { isEligible, reasons };
  };

  const handleRegister = async (drive) => {
    setRegisteringDriveId(drive.id);
    try {
      const studentData = {
        name: student.name,
        rollNumber: student.rollNumber,
        branch: student.branch,
        cgpa: student.cgpa,
        batch: student.batch
      };

      const res = await api.registerForDrive(drive.id, studentData);

      const passInfo = {
        hallTicketCode: res?.hallTicketCode || `TPO-DRV-2026-${drive.companyName.slice(0, 3).toUpperCase()}-${student.rollNumber.slice(-4)}`,
        companyName: drive.companyName,
        companyLogo: drive.companyLogo || '🏢',
        roleTitle: drive.roleTitle,
        ctcDisplay: drive.ctcDisplay,
        tier: drive.tier,
        scheduledDate: drive.scheduledDate,
        venue: drive.venue,
        currentRound: drive.currentPhase,
        studentName: student.name,
        studentRoll: student.rollNumber,
        studentBranch: student.branch,
        studentCgpa: student.cgpa
      };

      // Update in context
      setDrivesList(prev => prev.map(d => {
        if (d.id !== drive.id) return d;
        const candidate = {
          studentName: student.name,
          studentRoll: student.rollNumber,
          studentBranch: student.branch,
          studentCgpa: student.cgpa,
          currentRound: drive.currentPhase,
          status: 'Registered',
          hallTicketCode: passInfo.hallTicketCode,
          registeredAt: new Date()
        };
        return {
          ...d,
          candidates: [...(d.candidates || []), candidate]
        };
      }));

      setSelectedPass(passInfo);
      setIsPassModalOpen(true);
      if (showToast) showToast(`Registered for ${drive.companyName}! Digital Hall Ticket Generated.`);
    } catch (err) {
      if (showToast) showToast(err.message || 'Registration failed');
    } finally {
      setRegisteringDriveId(null);
    }
  };

  const handleViewPass = (drive, registration) => {
    setSelectedPass({
      hallTicketCode: registration.hallTicketCode || `TPO-DRV-2026-${drive.companyName.slice(0, 3).toUpperCase()}-${student.rollNumber.slice(-4)}`,
      companyName: drive.companyName,
      companyLogo: drive.companyLogo || '🏢',
      roleTitle: drive.roleTitle,
      ctcDisplay: drive.ctcDisplay,
      tier: drive.tier,
      scheduledDate: drive.scheduledDate,
      venue: drive.venue,
      currentRound: drive.currentPhase,
      studentName: student.name,
      studentRoll: student.rollNumber,
      studentBranch: student.branch,
      studentCgpa: student.cgpa
    });
    setIsPassModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Campus Recruitment Directorate</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Active Placement Drives & Digital Hall Tickets
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered on-campus drives for Batch {student.batch} • Academic eligibility verified in real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {drivesList.length} Active Drives
          </span>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="space-y-4">
        {drivesList.map((drive) => {
          const { isEligible, reasons } = checkEligibility(drive);
          const candidates = drive.candidates || [];
          const myRegistration = candidates.find(c => 
            c.studentRoll === student.rollNumber || c.studentName === student.name
          );
          const isRegistered = !!myRegistration;
          const currentPhaseIdx = (drive.phases || []).indexOf(drive.currentPhase);

          return (
            <div
              key={drive.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-5"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                    {drive.companyLogo || '🏢'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{drive.companyName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        drive.tier === 'Super Dream'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : drive.tier === 'Dream'
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {drive.tier || 'Dream'} Tier
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {drive.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{drive.roleTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-slate-400 block font-semibold text-[11px]">Package</span>
                    <span className="font-black text-emerald-700 text-sm">{drive.ctcDisplay}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-right">
                    <span className="text-slate-400 block font-semibold text-[11px]">Reporting Venue</span>
                    <span className="font-semibold text-slate-700 text-xs truncate max-w-[150px] block">{drive.venue}</span>
                  </div>
                </div>
              </div>

              {/* Recruitment Round Stepper */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                  <span>Recruitment Rounds Stepper</span>
                  <span className="text-purple-700">
                    Current Stage: <strong>{drive.currentPhase}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(drive.phases || [
                    'Pre-Placement Talk',
                    'Online Assessment',
                    'Technical Interview 1',
                    'Technical Interview 2',
                    'HR & Offer Extension'
                  ]).map((phaseName, pIdx) => {
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
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Eligibility Bar & Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  {isEligible ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Criteria Met: CGPA {student.cgpa} &ge; {drive.eligibilityCriteria?.minCgpa || 7.0} • 0 Backlogs</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{reasons.join(' • ')}</span>
                    </div>
                  )}
                </div>

                <div>
                  {isRegistered ? (
                    <button
                      type="button"
                      onClick={() => handleViewPass(drive, myRegistration)}
                      className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Ticket className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View Placement Hall Ticket</span>
                    </button>
                  ) : isEligible ? (
                    <button
                      type="button"
                      disabled={registeringDriveId === drive.id}
                      onClick={() => handleRegister(drive)}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {registeringDriveId === drive.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating Pass...</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Register & Get Hall Ticket</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
                    >
                      Ineligible to Register
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hall Ticket Pass Modal */}
      <DrivePassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        passData={selectedPass}
      />

    </div>
  );
}
