import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  BrainCircuit, 
  Search, 
  CheckCircle2, 
  Briefcase, 
  User, 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  Award,
  Send,
  Building
} from 'lucide-react';

export default function AiPlacementIntelligence() {
  const { jobs, studentsList, showToast } = useApp();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [analyzing, setAnalyzing] = useState(false);

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  // Calculate simulated AI match scores for students based on currentJob skills
  const matchedCandidates = studentsList.map(student => {
    let score = 70;
    // Academic bonus
    if (student.cgpa >= 8.5) score += 15;
    else if (student.cgpa >= 7.5) score += 10;

    // Skill match bonus
    const studentSkills = student.skills || [];
    const jobSkills = currentJob?.skills || ['React', 'Node.js', 'JavaScript', 'TypeScript'];
    const common = studentSkills.filter(sk => 
      jobSkills.some(jsk => jsk.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(jsk.toLowerCase()))
    );

    score += Math.min(15, common.length * 5);
    if (student.isBlocked) score = 25;

    return {
      ...student,
      matchScore: Math.min(98, score),
      commonSkills: common
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const handleRecommend = (candidate) => {
    showToast(`AI recommendation for ${candidate.name} dispatched to ${currentJob.companyName} recruitment team!`);
  };

  const handleTriggerBatchScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      showToast('AI batch ATS scan completed! 14 student profiles updated.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GenAI Powered Placement Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Student-Job Matching & ATS Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Leverage neural talent matching to align candidates with recruiter role requirements, predict interview clearance, and optimize resume ATS scores.
          </p>
        </div>

        <button
          onClick={handleTriggerBatchScan}
          disabled={analyzing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>{analyzing ? 'Scanning Resumes...' : 'Run Batch ATS Diagnostic'}</span>
        </button>
      </div>

      {/* Top ATS Batch Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Campus ATS Score</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-purple-700 mt-2">84.2<span className="text-base text-slate-400 font-normal"> / 100</span></p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Tier 1 ATS compliance rate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Skill Gap Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-700 mt-2">12</p>
          <span className="text-xs text-amber-600 font-semibold mt-1 block">Students lacking cloud/system metrics</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">High Compatibility Pool</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-indigo-700 mt-2">
            {matchedCandidates.filter(c => c.matchScore >= 85).length}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">&gt; 85% match for active drives</span>
        </div>
      </div>

      {/* AI Student-Job Match Tool */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-black text-slate-900 text-base">Neural Candidate-Job Compatibility Engine</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select an opening to view AI-ranked talent recommendations.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Target Drive Opening:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.companyName} — {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Job Card Preview */}
        {currentJob && (
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentJob.companyLogo || '💼'}</span>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{currentJob.title}</h4>
                <p className="text-purple-700 font-semibold">{currentJob.companyName} • {currentJob.salaryDisplay}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {currentJob.skills?.map((sk, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-900 font-semibold text-[10px]">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ranked Candidates Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">AI Ranked Candidate</th>
                <th className="py-3 px-4">Branch & CGPA</th>
                <th className="py-3 px-4">Matched Technical Skills</th>
                <th className="py-3 px-4">Compatibility Score</th>
                <th className="py-3 px-4 text-right">Recruiter Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {matchedCandidates.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{c.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{c.rollNumber}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{c.branch}</p>
                    <p className="text-[11px] text-slate-500 font-bold">{c.cgpa} CGPA</p>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {c.commonSkills?.length > 0 ? (
                        c.commonSkills.map((sk, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                            ✓ {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px]">No direct keyword overlap</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            c.matchScore >= 85 ? 'bg-emerald-600' : c.matchScore >= 70 ? 'bg-indigo-600' : 'bg-rose-500'
                          }`}
                          style={{ width: `${c.matchScore}%` }}
                        />
                      </div>
                      <span className="font-black text-slate-900">{c.matchScore}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRecommend(c)}
                      className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Recommend</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
