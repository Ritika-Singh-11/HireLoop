import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Building, 
  Calendar, 
  MapPin, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  QrCode,
  Sparkles,
  Download,
  Code2
} from 'lucide-react';

export default function DrivePassModal({ isOpen, onClose, passData, onStartOA }) {
  if (!isOpen || !passData) return null;

  const {
    hallTicketCode,
    companyName,
    companyLogo,
    roleTitle,
    ctcDisplay,
    tier,
    scheduledDate,
    venue,
    currentRound,
    studentName,
    studentRoll,
    studentBranch,
    studentCgpa
  } = passData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-8">
        
        {/* Top Control Bar */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Placement Gate Pass Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Institutional Header */}
          <div className="border-b-2 border-dashed border-slate-200 pb-5 text-center relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Directorate of Training & Placement</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              CAMPUS RECRUITMENT HALL TICKET
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Academic Placement Season 2025 - 2026 • Verified Candidate Pass
            </p>

            {/* Hall Ticket Code Pill */}
            <div className="mt-3 inline-block bg-slate-900 text-amber-300 font-mono font-black text-xs px-4 py-1.5 rounded-xl shadow-xs tracking-widest border border-slate-700">
              PASS ID: {hallTicketCode}
            </div>
          </div>

          {/* Drive & Company Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-indigo-50/80 border border-indigo-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                {companyLogo || '🏢'}
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
                  Target Employer
                </span>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  {companyName}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {roleTitle} • <strong className="text-indigo-700">{ctcDisplay}</strong>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                tier === 'Super Dream'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : tier === 'Dream'
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {tier} Tier
              </span>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Eligible</span>
              </div>
            </div>
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Candidate Name</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{studentName}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">University Roll</span>
              <p className="text-xs font-mono font-extrabold text-indigo-700 mt-0.5">{studentRoll}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Discipline</span>
              <p className="text-xs font-semibold text-slate-900 mt-0.5 truncate">{studentBranch}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Verified CGPA</span>
              <p className="text-xs font-black text-emerald-600 mt-0.5">{studentCgpa} / 10.0</p>
            </div>
          </div>

          {/* Reporting Logistics */}
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <span><strong>Reporting Date & Time:</strong> {scheduledDate} • 09:00 AM IST</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span><strong>Venue / Link:</strong> {venue}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span><strong>Initial Reporting Stage:</strong> {currentRound || 'Pre-Placement Talk & Screening'}</span>
            </div>
          </div>

          {/* Active OA Banner if current round is Assessment */}
          {(currentRound === 'Online Assessment' || currentRound?.toLowerCase().includes('assessment') || currentRound?.toLowerCase().includes('oa')) && onStartOA && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-xs">Stage 2: Online Assessment Active</h4>
                  <p className="text-[11px] text-amber-700">Proctored test sandbox is ready for this candidate.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onStartOA}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Launch Test Sandbox</span>
              </button>
            </div>
          )}

          {/* Barcode & Security Stamp */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                Digital Verification Hash
              </div>
              <div className="font-mono text-xs font-bold text-slate-800 tracking-tighter mt-0.5">
                ||| | |||| || ||| ||||| | |||| ||| |||| |
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{hallTicketCode}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center p-1 shadow-xs">
                <QrCode className="w-11 h-11 text-white" />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <strong className="text-slate-900 block">TPC Security Seal</strong>
                Digitally authenticated.<br />Carry official College ID.
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Formals dress code mandatory for campus recruitment rounds.
          </span>
          <div className="flex items-center gap-2">
            {(currentRound === 'Online Assessment' || currentRound?.toLowerCase().includes('assessment') || currentRound?.toLowerCase().includes('oa')) && onStartOA && (
              <button
                type="button"
                onClick={onStartOA}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Launch OA Test</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
