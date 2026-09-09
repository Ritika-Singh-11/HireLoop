import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Code2, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  ShieldCheck, 
  BrainCircuit, 
  Sparkles, 
  FileText, 
  Award, 
  Layers, 
  Search, 
  ChevronRight, 
  Eye, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import TestSandboxModal from './TestSandboxModal';

export default function AssessmentCenter() {
  const { assessments, submissions, submitAssessmentAttempt, student } = useApp();

  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Launching assessment modal states
  const [selectedAssessmentToStart, setSelectedAssessmentToStart] = useState(null);
  const [showPreTestModal, setShowPreTestModal] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [activeTest, setActiveTest] = useState(null);

  // Scorecard modal state
  const [inspectSubmission, setInspectSubmission] = useState(null);

  // Submission map for quick lookup
  const submissionMap = new Map();
  (submissions || []).forEach(sub => {
    submissionMap.set(sub.assessmentId || sub.assessment?._id || sub.assessment, sub);
  });

  const filteredAssessments = (assessments || []).filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.companyName.toLowerCase().includes(q);
  });

  const handleOpenStartTest = (assessment) => {
    setSelectedAssessmentToStart(assessment);
    setAgreedToRules(false);
    setShowPreTestModal(true);
  };

  const handleConfirmLaunch = () => {
    if (!selectedAssessmentToStart) return;
    setActiveTest(selectedAssessmentToStart);
    setShowPreTestModal(false);
  };

  // Metrics
  const completedCount = (submissions || []).length;
  const passedCount = (submissions || []).filter(s => s.passed).length;
  const avgScore = completedCount > 0 
    ? Math.round(submissions.reduce((acc, s) => acc + (s.percentage || 0), 0) / completedCount) 
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold w-fit mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Screening Sandbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Online Technical Coding & Aptitude Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Take official timed coding challenges and aptitude rounds requested by visiting recruiters. Code against automated unit tests in an anti-cheating proctored environment.
          </p>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Available Tests</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{(assessments || []).length}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Campus drive assessments</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{completedCount}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Tests submitted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pass Rate</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {completedCount > 0 ? `${Math.round((passedCount / completedCount) * 100)}%` : '—'}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{passedCount} cleared cut-off</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Score</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{avgScore > 0 ? `${avgScore}%` : '—'}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Across technical rounds</span>
        </div>
      </div>

      {/* Filter and Tab Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Available Tests ({(assessments || []).length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Scorecards ({completedCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search test or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* View 1: Available Assessments Grid */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredAssessments.map(asm => {
            const sub = submissionMap.get(asm.id || asm._id);
            const isCompleted = !!sub;

            return (
              <div 
                key={asm.id || asm._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Top Bar: Company & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                        {asm.companyLogo}
                      </span>
                      <div>
                        <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                          {asm.companyName}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                          {asm.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize border border-slate-200">
                      {asm.category} Test
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                    {asm.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Duration</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {asm.durationMinutes} Mins
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Format</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Code2 className="w-3 h-3 text-slate-500" />
                        {asm.questionCount || (asm.mcqQuestions?.length || 0) + (asm.codingProblems?.length || 0)} Questions
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Cutoff Marks</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <Trophy className="w-3 h-3 text-emerald-600" />
                        {asm.passingMarks}% Pass
                      </span>
                    </div>
                  </div>

                  {/* Anti-Cheating Surveillance Notice */}
                  <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50/80 px-3 py-2 rounded-xl border border-amber-200 mt-3 font-medium">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Active Proctoring: Max {asm.proctoringRules?.maxTabSwitches || 3} tab switches permitted.</span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {isCompleted ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                          sub.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {sub.passed ? `Cleared: ${sub.percentage}%` : `Score: ${sub.percentage}% (Not cleared)`}
                        </span>
                      </div>
                      <button
                        onClick={() => setInspectSubmission(sub)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Scorecard</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-slate-400 font-medium">
                        Ready to launch anytime
                      </span>
                      <button
                        onClick={() => handleOpenStartTest(asm)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Proctored Test</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Past Scorecards & Submissions */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Assessment Record & Drive Progression</span>
            <span>{completedCount} Tests Completed</span>
          </div>

          <div className="divide-y divide-slate-100">
            {(submissions || []).map((sub, idx) => (
              <div key={idx} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="text-3xl p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                    {sub.companyLogo || '🏢'}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{sub.assessmentTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {sub.companyName} • Submitted on {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-600">
                      <span>MCQ Marks: <strong>{sub.mcqScore || 0}</strong></span>
                      <span>•</span>
                      <span>Coding Marks: <strong>{sub.codingScore || 0}</strong></span>
                      <span>•</span>
                      <span>Proctoring: <strong className={sub.violationsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        {sub.violationsCount === 0 ? 'Zero Violations' : `${sub.violationsCount} Flags`}
                      </strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className={`text-sm font-black block ${sub.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                      {sub.percentage}% Score
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      {sub.totalScore} / {sub.maxScore} marks
                    </span>
                  </div>

                  <button
                    onClick={() => setInspectSubmission(sub)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))}

            {completedCount === 0 && (
              <div className="text-center py-12 p-8">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No assessments completed yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Start an assessment from the "Available Tests" tab to build your verified scorecard!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pre-Test Instructions & Rules Modal */}
      {showPreTestModal && selectedAssessmentToStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedAssessmentToStart.companyLogo}</span>
                <div>
                  <h3 className="font-bold text-base">{selectedAssessmentToStart.title}</h3>
                  <p className="text-xs text-slate-400">Pre-Assessment Instructions & Honor Code</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPreTestModal(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold block">Total Time Limit:</span>
                  <span className="text-slate-900 font-extrabold text-sm">{selectedAssessmentToStart.durationMinutes} Minutes</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Passing Cut-off:</span>
                  <span className="text-emerald-700 font-extrabold text-sm">{selectedAssessmentToStart.passingMarks}% Marks</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Test Instructions:</h4>
                <ul className="space-y-2 text-slate-600 font-medium">
                  {(selectedAssessmentToStart.instructions || []).map((ins, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Proctoring Warning Box */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Anti-Cheating Surveillance Rules</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  During the test, full-screen mode is recommended. Switching browser tabs, minimizing the browser window, or navigating to external tools will be detected. Exceeding <strong>{selectedAssessmentToStart.proctoringRules?.maxTabSwitches || 3} warnings</strong> will result in immediate automatic termination and flagging.
                </p>
              </div>

              {/* Honor Code Checkbox */}
              <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700">
                  I certify that I am <strong>{student.name}</strong> ({student.rollNumber}) and will attempt this assessment independently without external human assistance or unauthorized tools.
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setShowPreTestModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmLaunch}
                  disabled={!agreedToRules}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Proctored Assessment</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Inspect Scorecard Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{inspectSubmission.assessmentTitle}</h3>
                <p className="text-xs text-slate-500">Official Candidate Scorecard Breakdown</p>
              </div>
              <button onClick={() => setInspectSubmission(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div>
                  <span className="text-slate-500 font-semibold block">Total Score</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{inspectSubmission.percentage}%</span>
                  <span className="text-[10px] text-slate-400">({inspectSubmission.totalScore}/{inspectSubmission.maxScore} marks)</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Result Status</span>
                  <span className={`text-base font-extrabold mt-1 block ${inspectSubmission.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                    {inspectSubmission.passed ? 'PASSED' : 'NOT CLEARED'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Surveillance</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                    {inspectSubmission.violationsCount === 0 ? 'Verified Clean' : `${inspectSubmission.violationsCount} Flags`}
                  </span>
                </div>
              </div>

              {/* Coding Submissions */}
              {inspectSubmission.codingSubmissions && inspectSubmission.codingSubmissions.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Coding Challenges Performance:</h4>
                  <div className="space-y-2">
                    {inspectSubmission.codingSubmissions.map((cs, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <strong className="text-slate-800 block">{cs.title || `Problem ${i + 1}`}</strong>
                          <span className="text-slate-500 text-[11px]">Unit Tests: {cs.testsPassed}/{cs.totalTests} passed ({cs.status})</span>
                        </div>
                        <span className="font-extrabold text-indigo-700 font-mono">
                          +{cs.score} marks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Proctored Sandbox Modal */}
      {activeTest && (
        <TestSandboxModal
          isOpen={!!activeTest}
          onClose={() => setActiveTest(null)}
          assessment={activeTest}
          onSubmitTest={submitAssessmentAttempt}
        />
      )}

    </div>
  );
}
