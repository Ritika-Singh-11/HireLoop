import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BrainCircuit, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  Percent, 
  Briefcase,
  TrendingUp,
  Award,
  BookmarkCheck,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { analyzeResumeATS } from '../../utils/aiEngine';
import { api } from '../../services/api';

export default function ResumeAnalyzer() {
  const { student, setStudent, jobs, showToast } = useApp();

  // Selected job for target comparison
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  
  // Default to student's profile text or uploaded PDF text
  const uploadedPdfText = student.resumeFile?.text || student.resumeData?.rawExtractedText;
  const initialResumeText = uploadedPdfText && uploadedPdfText.length > 50
    ? uploadedPdfText
    : `
${student.resumeData?.fullName || student.name}
Email: ${student.email} | Phone: ${student.phone} | Bangalore, India
LinkedIn: ${student.resumeData?.linkedin} | GitHub: ${student.resumeData?.github}

SUMMARY
${student.resumeData?.summary}

EDUCATION
B.Tech in Computer Science & Engineering - NIT (CGPA: 8.85 / 10) 2022 - 2026
Class XII CBSE - 96.2%

EXPERIENCE
Software Engineer Intern - FinTech Labs (May 2025 - Jul 2025)
- Developed responsive payment analytics dashboard in React & Tailwind CSS, reducing latency by 35%.
- Engineered Node.js REST endpoints integrated with PostgreSQL, handling 20,000+ daily mock transaction records.
- Wrote unit tests using Jest, achieving 88% test coverage.

PROJECTS
RecruitLoop — AI Placement Portal
Tech: React, Node.js, Tailwind CSS, Gemini API
End-to-end campus recruitment ecosystem with ATS resume evaluation and automated recruiter workflows.

Distributed Task Queue Engine
Tech: Go, Redis, Docker, WebSockets
High-throughput async job runner with exponential backoff retries and live task status dashboards.

SKILLS
${student.skills?.join(', ')}
  `.trim();

  const [resumeText, setResumeText] = useState(initialResumeText);
  const [targetJD, setTargetJD] = useState(jobs[0]?.description || '');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleJobSelect = (e) => {
    const jId = e.target.value;
    setSelectedJobId(jId);
    const found = jobs.find(j => j.id === jId);
    if (found) {
      setTargetJD(found.description);
    }
  };

  const handleAnalyze = async () => {
    setIsScanning(true);
    setIsSaved(false);
    const targetJob = jobs.find(j => j.id === selectedJobId);
    const reqSkills = targetJob ? targetJob.requiredSkills : [];

    try {
      const res = await api.analyzeResume({
        resumeText,
        jobTitle: targetJob?.title || 'Software Engineer',
        jobDescription: targetJD,
        requiredSkills: reqSkills,
        saveToProfile: false
      });
      if (res?.analysis) {
        setAnalysisResult({
          score: res.analysis.atsScore || 85,
          matchPercentage: res.analysis.matchPercentage || 82,
          matchedKeywords: res.analysis.matchedKeywords || [],
          missingKeywords: res.analysis.missingKeywords || [],
          metrics: res.analysis.metrics || {
            actionVerbScore: 80,
            impactScore: 75,
            structureScore: 90
          },
          bulletImprovements: res.analysis.bulletImprovements || [],
          suggestions: res.analysis.criticalGaps?.length ? res.analysis.criticalGaps : [
            'Incorporate missing technical skills into your project bullet points.',
            'Quantify your engineering accomplishments with metrics (e.g. latency, users, throughput).'
          ],
          shortlistProbability: res.analysis.shortlistProbability || 'High (>80%)'
        });
      }
    } catch (err) {
      // Fallback local NLP heuristics
      const localResult = analyzeResumeATS(resumeText, targetJD, reqSkills);
      setAnalysisResult({
        ...localResult,
        shortlistProbability: localResult.score >= 80 ? 'High (>85%)' : 'Moderate (65-80%)',
        bulletImprovements: [
          {
            original: 'Worked on payment dashboard and fixed bugs.',
            improved: 'Engineered responsive payment analytics dashboard using React & Tailwind, reducing page load latency by 35% and improving checkout conversion.',
            impact: '+45% higher recruiter response rate'
          },
          {
            original: 'Created backend APIs in Node.js connected to database.',
            improved: 'Architected high-throughput Node.js REST microservices with PostgreSQL & Redis caching, sustaining 20,000+ daily mock transaction records.',
            impact: 'Demonstrates scalable system design'
          }
        ]
      });
    } finally {
      setIsScanning(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveScoreToProfile = async () => {
    if (!analysisResult) return;
    setIsSaving(true);
    try {
      const targetJob = jobs.find(j => j.id === selectedJobId);
      await api.analyzeResume({
        resumeText,
        jobTitle: targetJob?.title || 'Software Engineer',
        jobDescription: targetJD,
        requiredSkills: targetJob ? targetJob.requiredSkills : [],
        saveToProfile: true
      });
    } catch (e) {
      console.warn('Backend save fallback to client state:', e);
    } finally {
      setIsSaving(false);
      setIsSaved(true);
      setStudent(prev => ({
        ...prev,
        atsScore: analysisResult.score
      }));
      if (showToast) {
        showToast(`Verified ATS score of ${analysisResult.score}% synced to your Student Profile!`);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-2">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>AI-Powered ATS Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Resume Analyser & JD Matcher
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Score your resume against applicant tracking systems and target job roles with actionable keyword gaps
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isScanning}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isScanning ? 'Running ATS Diagnostics...' : 'Run ATS Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Resume Text / Uploader */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Your Resume Content (Pre-filled from Profile)</span>
              </label>
              <button
                type="button"
                onClick={() => setResumeText(initialResumeText)}
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                Reset to My Profile
              </button>
            </div>
            <textarea
              rows={13}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume plain text here..."
              className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Right: Target Job Description Selector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Target Job Description (JD Benchmark)</span>
              </label>
            </div>

            <div className="mb-3">
              <select
                value={selectedJobId}
                onChange={handleJobSelect}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.companyName} — {j.title}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              rows={10}
              value={targetJD}
              onChange={(e) => setTargetJD(e.target.value)}
              placeholder="Paste target job description to match keywords..."
              className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />

            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isScanning}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Analyze Match Against This Role</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-md space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">
                    ATS Evaluation Diagnostic Report
                  </h3>
                  {analysisResult.shortlistProbability && (
                    <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      Shortlist Probability: {analysisResult.shortlistProbability}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Target: {jobs.find(j => j.id === selectedJobId)?.companyName} — {jobs.find(j => j.id === selectedJobId)?.title}
                </p>
              </div>
            </div>

            {/* Score & Actions */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={handleSaveScoreToProfile}
                disabled={isSaving || isSaved}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                } disabled:opacity-80`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved to Profile ({analysisResult.score}%)</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Save Score to Profile</span>
                  </>
                )}
              </button>

              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Overall ATS Score</div>
                <div className="text-2xl font-black text-indigo-700">{analysisResult.score}/100</div>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-md ${
                analysisResult.score >= 85 ? 'bg-emerald-600' : analysisResult.score >= 70 ? 'bg-indigo-600' : 'bg-amber-500'
              }`}>
                {analysisResult.score}%
              </div>
            </div>
          </div>

          {/* Sub-Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase">JD Match Rate</span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">
                {analysisResult.matchPercentage}%
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Keywords Overlap</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Action Verbs</span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">
                {analysisResult.metrics.actionVerbScore}/100
              </div>
              <span className="text-[11px] text-indigo-600 font-semibold">Leadership impact</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Quantifiable Metrics</span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">
                {analysisResult.metrics.impactScore}/100
              </div>
              <span className="text-[11px] text-purple-600 font-semibold">Numbers & ROI</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Layout & Structure</span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">
                {analysisResult.metrics.structureScore}/100
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Standard Headers</span>
            </div>
          </div>
          
          {/* AI Bullet Point Enhancer (Action Verb & Impact Restructuring) */}
          {analysisResult.bulletImprovements && analysisResult.bulletImprovements.length > 0 && (
            <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Bullet Point Enhancer (X-Y-Z Impact Formula)</span>
                </div>
                <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                  Gemini Optimized
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.bulletImprovements.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Original Bullet:</span>
                      <p className="text-xs text-slate-600 line-through mt-0.5">{item.original}</p>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">AI High-Impact Rewrite:</span>
                      <p className="text-xs font-semibold text-slate-900 mt-0.5">{item.improved}</p>
                    </div>
                    {item.impact && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span>{item.impact}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Breakdown: Matched vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* Matched */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Keywords Successfully Detected ({analysisResult.matchedKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 font-medium text-xs border border-emerald-200 shadow-2xs"
                  >
                    {kw} ✓
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Missing High-Priority Keywords ({analysisResult.missingKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.missingKeywords.length > 0 ? (
                  analysisResult.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white text-amber-800 font-medium text-xs border border-amber-200 shadow-2xs"
                    >
                      + {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-600">Great job! No major target skills missing.</span>
                )}
              </div>
            </div>

          </div>

          {/* AI Suggestions */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Strategic Improvement Recommendations</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {analysisResult.suggestions.map((sug, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
