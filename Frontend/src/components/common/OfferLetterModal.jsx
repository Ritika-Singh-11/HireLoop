import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  GraduationCap,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OfferLetterModal({ isOpen, onClose, offer, onAccept, onDecline }) {
  const { currentRole, showToast } = useApp();
  const printRef = useRef(null);
  const [confirmMode, setConfirmMode] = useState(null); // 'accept' | 'decline' | null
  const [localStatus, setLocalStatus] = useState(offer?.status || 'issued');

  useEffect(() => {
    if (offer?.status) setLocalStatus(offer.status);
  }, [offer?.status]);

  if (!isOpen || !offer) return null;

  const isStudent = currentRole === 'student';
  const isAccepted = localStatus === 'accepted' || localStatus === 'Offer Accepted' || offer.offerAccepted;
  const isDeclined = localStatus === 'declined' || localStatus === 'Offer Declined' || offer.offerDeclined;
  const canTakeAction = Boolean(onAccept || onDecline) && !isAccepted && !isDeclined;

  const handlePrint = () => {
    window.print();
  };

  const handleAcceptClick = () => {
    setLocalStatus('accepted');
    setConfirmMode(null);
    if (onAccept) onAccept(offer.id || offer.applicationId || offer._id);
  };

  const handleDeclineClick = () => {
    setLocalStatus('declined');
    setConfirmMode(null);
    if (onDecline) onDecline(offer.id || offer.applicationId || offer._id);
  };

  // Safe CTC values
  const totalCtc = Number(offer.ctc?.totalLpa) || (typeof offer.ctc === 'number' ? offer.ctc : 18.5);
  const baseLpa = Number(offer.ctc?.baseLpa) || Number((totalCtc * 0.75).toFixed(2));
  const bonusLpa = Number(offer.ctc?.variableBonusLpa) || Number((totalCtc * 0.2).toFixed(2));
  const joiningBonus = Number(offer.ctc?.joiningBonus) || Number((totalCtc * 0.05).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Control Bar (Hidden when Printing) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                <span>Official Campus Offer Letter</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {offer.offerCode || 'TPC-OFFER-2026'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Placement Cell Directorate • Verified Institutional Employment Contract
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Letterhead Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50">
          
          <div 
            ref={printRef}
            className="printable-offer bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 text-slate-800 font-serif leading-relaxed max-w-2xl mx-auto relative space-y-6"
          >
            {/* Background Security Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <span className="text-8xl font-black rotate-[-35deg] tracking-widest text-slate-900 uppercase">
                HIRELOOP TPC
              </span>
            </div>

            {/* University & Placement Cell Directorate Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm font-sans font-extrabold text-sm">
                  <GraduationCap className="w-7 h-7 text-amber-300" />
                </div>
                <div>
                  <h2 className="font-sans font-extrabold text-sm uppercase tracking-wider text-slate-950">
                    Central Training & Placement Directorate
                  </h2>
                  <p className="font-sans text-[11px] text-slate-600 font-semibold">
                    CAMPUS PLACEMENTS 2026 • AUTONOMOUS INSTITUTIONAL BOARD
                  </p>
                  <p className="font-sans text-[10px] text-slate-500">
                    Directorate of Corporate Relations & Industry Partnerships
                  </p>
                </div>
              </div>

              <div className="text-right font-sans text-xs shrink-0">
                <div className="font-mono font-bold text-slate-900 text-[11px]">
                  Ref: {offer.offerCode || 'TPC-OFFER-2026-X81B'}
                </div>
                <div className="text-slate-500 text-[10px]">
                  Date: {new Date(offer.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Corporate Recruiter Banner */}
            <div className="font-sans flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{offer.companyLogo || '🏢'}</span>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Hiring Organization
                  </span>
                  <div className="font-extrabold text-slate-950 text-sm">
                    {offer.companyName}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  TPC Verified Day-1 Recruiter
                </span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="font-sans text-xs space-y-1">
              <p className="font-bold text-slate-900">To,</p>
              <p className="font-extrabold text-sm text-slate-950">{offer.studentName || 'Rohan Verma'}</p>
              <p className="text-slate-600">Roll Number: <strong>{offer.studentRoll || '21BCSE092'}</strong></p>
              <p className="text-slate-600">Discipline: <strong>{offer.studentBranch || 'Computer Science & Engineering'}</strong></p>
              <p className="text-slate-600">Batch: <strong>Graduation Class of 2026</strong></p>
            </div>

            {/* Salutation & Formal Offer Statement */}
            <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-slate-700">
              <p className="font-bold text-slate-900">
                Subject: Formal Offer of Employment for the position of {offer.designation}
              </p>
              
              <p>
                Dear {offer.studentName || 'Candidate'},
              </p>
              
              <p>
                Following your performance throughout the campus placement drive, technical evaluations, and executive interviews conducted in coordination with the Central Training & Placement Cell, we are delighted to offer you employment at <strong>{offer.companyName}</strong> as <strong>{offer.designation}</strong>.
              </p>
            </div>

            {/* Compensation Structure Table */}
            <div className="font-sans space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Compensation & Remuneration Structure
              </h4>
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] uppercase">
                    <tr>
                      <th className="p-2.5">Salary Component</th>
                      <th className="p-2.5 text-right">Annual Value (₹ INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    <tr>
                      <td className="p-2.5 font-medium">Fixed Base Compensation (Annual Gross)</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹ {baseLpa} LPA</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Performance Linked Incentive / Variable Allowance</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹ {bonusLpa} LPA</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Retention & Campus Joining Bonus</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹ {joiningBonus} LPA</td>
                    </tr>
                    <tr className="bg-emerald-50/70 font-extrabold text-emerald-950 border-t-2 border-emerald-200">
                      <td className="p-2.5">Total Cost to Company (CTC)</td>
                      <td className="p-2.5 text-right font-mono text-sm text-emerald-700">₹ {totalCtc} LPA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Terms */}
            <div className="font-sans text-xs space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Date of Joining</span>
                  <p className="font-bold text-slate-900">{offer.joiningDate || '2026-07-15'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Reporting Location</span>
                  <p className="font-bold text-slate-900">{offer.location || 'Bangalore, India'}</p>
                </div>
              </div>
            </div>

            {/* Standard Terms List */}
            <div className="space-y-1.5 text-[11px] text-slate-600 leading-normal">
              <p className="font-bold text-slate-800 font-sans text-xs">Standard Campus Placement Guidelines:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>This offer is contingent upon successful completion of your qualifying degree with zero active backlogs.</li>
                <li>In accordance with campus placement policies, acceptance of this offer constitutes a confirmed placement record.</li>
                <li>Formal onboarding documentation, background verification, and medical declarations will precede joining.</li>
              </ul>
            </div>

            {/* Digital Signatures Block */}
            <div className="font-sans pt-6 border-t border-slate-200 grid grid-cols-2 gap-8">
              {/* Recruiter Signature */}
              <div className="space-y-1">
                <div className="h-10 flex items-center font-script text-indigo-700 font-bold text-lg">
                  {offer.signatoryName || 'Sameer Verma'}
                </div>
                <div className="border-t border-slate-300 pt-1">
                  <p className="font-bold text-xs text-slate-900">{offer.signatoryName || 'Sameer Verma'}</p>
                  <p className="text-[10px] text-slate-500">{offer.signatoryTitle || 'Head of Campus Talent Acquisition'}</p>
                  <p className="text-[10px] text-slate-700 font-semibold">{offer.companyName}</p>
                </div>
              </div>

              {/* TPO Dean Signature & Official University Seal */}
              <div className="space-y-1 text-right">
                <div className="h-10 flex items-center justify-end font-script text-purple-700 font-bold text-lg">
                  Prof. S. K. Verma
                </div>
                <div className="border-t border-slate-300 pt-1">
                  <p className="font-bold text-xs text-slate-900">Prof. S. K. Verma</p>
                  <p className="text-[10px] text-slate-500">Dean & Head of Placement Directorate</p>
                  <p className="text-[10px] text-purple-700 font-bold">University Placement Directorate Seal</p>
                </div>
              </div>
            </div>

            {/* Verification Footer Badge */}
            <div className="pt-3 border-t border-dashed border-slate-200 text-center font-sans text-[10px] text-slate-400">
              Verified Digitally by HireLoop University Portal • Verification Serial: <span className="font-mono font-bold text-slate-600">{offer.offerCode || 'TPC-2026-X81B'}</span>
            </div>

          </div>

        </div>

        {/* Bottom Actions Bar (Hidden when Printing) */}
        <div className="no-print bg-white p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">
              Status:
            </span>
            {isAccepted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Accepted by Candidate
              </span>
            ) : isDeclined ? (
              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                Declined
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                Pending Candidate Decision
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canTakeAction && (
              <>
                {confirmMode === 'accept' ? (
                  <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300">
                    <span className="text-xs font-bold text-emerald-900">Digitally sign & accept?</span>
                    <button
                      type="button"
                      onClick={handleAcceptClick}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmMode(null)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : confirmMode === 'decline' ? (
                  <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-300">
                    <span className="text-xs font-bold text-rose-900">Are you sure you want to decline?</span>
                    <button
                      type="button"
                      onClick={handleDeclineClick}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      Yes, Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmMode(null)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setConfirmMode('decline')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200"
                    >
                      Decline Offer
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmMode('accept')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>Accept & Sign Offer</span>
                    </button>
                  </>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>

      {/* Print CSS Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-offer, .printable-offer * {
            visibility: visible;
          }
          .printable-offer {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20mm;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
