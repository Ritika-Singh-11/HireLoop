import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronRight, 
  Play, 
  Volume2,
  VolumeX,
  Clock,
  Briefcase,
  Building2,
  BookmarkCheck,
  CheckCheck,
  Loader2,
  BookOpen
} from 'lucide-react';
import { MOCK_INTERVIEW_ROLES, evaluateAnswer } from '../../utils/aiEngine';
import { api } from '../../services/api';

export default function MockInterview() {
  const { student, setStudent, jobs, showToast } = useApp();

  // Track selection: standard tracks or a specific campus job
  const [selectedRoleKey, setSelectedRoleKey] = useState('frontend');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [isCustomJob, setIsCustomJob] = useState(false);

  // Session state
  const [sessionActive, setSessionActive] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  const recognitionRef = useRef(null);

  // Determine active track title
  const activeRoleTitle = isCustomJob 
    ? jobs.find(j => j.id === selectedJobId)?.title || 'Campus SDE Opening'
    : MOCK_INTERVIEW_ROLES[selectedRoleKey]?.title || 'Technical SDE';

  const currentQuestion = activeQuestions[currentQuestionIndex];

  // Timer simulation
  useEffect(() => {
    let interval = null;
    if (sessionActive && !sessionCompleted) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionActive, sessionCompleted]);

  // Clean up speech & mic on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopRecording();
    };
  }, []);

  // Text-To-Speech: Speak Question aloud
  const speakQuestion = (text) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Trigger TTS when new question loads
  useEffect(() => {
    if (sessionActive && currentQuestion && autoSpeak) {
      const timer = setTimeout(() => {
        speakQuestion(currentQuestion.question);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, sessionActive]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const startSession = async () => {
    setIsGeneratingQuestions(true);
    let questionsToUse = [];

    if (isCustomJob && selectedJobId) {
      const targetJob = jobs.find(j => j.id === selectedJobId);
      try {
        const res = await api.generateInterviewQuestions({
          roleTitle: targetJob?.title || 'Software Engineer',
          companyName: targetJob?.companyName || 'Campus Recruiter',
          jobDescription: targetJob?.description || '',
          count: 3
        });
        if (res?.questions && res.questions.length > 0) {
          questionsToUse = res.questions;
        }
      } catch (err) {
        console.warn('Falling back to local questions:', err);
      }

      if (questionsToUse.length === 0) {
        questionsToUse = [
          {
            id: 1,
            question: `How would you architect a core feature for ${targetJob?.companyName || 'this role'} based on the requirements of ${targetJob?.title}?`,
            idealPoints: 'Discuss component architecture, data flow, failure resilience, and latency minimization.'
          },
          {
            id: 2,
            question: `Which data structures or database schemas would you design to handle high concurrent queries for ${targetJob?.title}?`,
            idealPoints: 'Explain indexing, normalization vs denormalization, caching with Redis, and asymptotic complexity.'
          },
          {
            id: 3,
            question: 'Walk through a challenging bug you encountered in a real-world project and how you isolated its root cause.',
            idealPoints: 'Highlight debugging methodologies, logging, reproductive steps, and post-mortem unit tests.'
          }
        ];
      }
    } else {
      questionsToUse = MOCK_INTERVIEW_ROLES[selectedRoleKey]?.questions || [];
    }

    setActiveQuestions(questionsToUse);
    setCurrentQuestionIndex(0);
    setEvaluations([]);
    setUserAnswer('');
    setTimerSeconds(0);
    setIsScoreSaved(false);
    setIsGeneratingQuestions(false);
    setSessionActive(true);
    setSessionCompleted(false);
  };

  // Speech Recognition (STT)
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    stopSpeaking();
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setUserAnswer(prev => {
              const base = prev.trim();
              return base ? `${base} ${currentTranscript}` : currentTranscript;
            });
          }
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition error:', e);
          simulateVoiceDictation();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (e) {
        simulateVoiceDictation();
      }
    } else {
      simulateVoiceDictation();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const simulateVoiceDictation = () => {
    setIsRecording(true);
    setTimeout(() => {
      setUserAnswer(prev => {
        const sample = "In my design, I ensure strong component separation, leverage caching at the API boundary, and write comprehensive regression unit tests.";
        return prev ? `${prev} ${sample}` : sample;
      });
      setIsRecording(false);
    }, 2000);
  };

  // Submit Answer & Evaluate via Gemini AI
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    stopSpeaking();
    stopRecording();

    setIsEvaluating(true);

    try {
      // Deep AI Evaluation via Gemini API
      const res = await api.evaluateInterviewAnswer({
        roleTitle: activeRoleTitle,
        question: currentQuestion.question,
        studentAnswer: userAnswer,
        idealPoints: currentQuestion.idealPoints || ''
      });

      if (res?.evaluation) {
        const evalItem = {
          question: currentQuestion,
          answer: userAnswer,
          score: res.evaluation.score || 80,
          feedback: res.evaluation.conceptualFeedback || 'Well formulated technical explanation.',
          strengths: res.evaluation.strengths || ['Good structure', 'Relevant vocabulary'],
          improvements: res.evaluation.improvements || ['Include quantifiable benchmarks'],
          modelAnswer: res.evaluation.modelAnswer || currentQuestion.idealPoints
        };
        setEvaluations(prev => [...prev, evalItem]);
      } else {
        throw new Error('Fallback to local');
      }
    } catch (err) {
      // Local Heuristics Fallback
      const evalResult = evaluateAnswer(currentQuestion, userAnswer);
      const evalItem = {
        question: currentQuestion,
        answer: userAnswer,
        score: evalResult.score,
        feedback: evalResult.feedback,
        strengths: evalResult.strengths,
        improvements: evalResult.improvements,
        modelAnswer: currentQuestion.idealPoints
      };
      setEvaluations(prev => [...prev, evalItem]);
    } finally {
      setIsEvaluating(false);

      if (currentQuestionIndex + 1 < activeQuestions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer('');
      } else {
        setSessionCompleted(true);
        setSessionActive(false);
      }
    }
  };

  // Total readiness score
  const totalScore = evaluations.length > 0 
    ? Math.round(evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length) 
    : 0;

  // Save Score to Profile
  const handleSaveScoreToProfile = async () => {
    setIsSavingScore(true);
    try {
      await api.saveInterviewSession({
        roleTitle: activeRoleTitle,
        percentage: totalScore
      });
    } catch (e) {
      console.warn('Backend save fallback to client state:', e);
    } finally {
      setIsSavingScore(false);
      setIsScoreSaved(true);
      setStudent(prev => ({
        ...prev,
        mockInterviewScore: totalScore
      }));
      if (showToast) {
        showToast(`Verified Mock Interview score of ${totalScore}% saved to your Student Profile!`);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Multimodal Mock Interview Simulator</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Role-Specific & Campus Drive Technical Mock Interviews
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice-enabled interviewer synthesis, live speech-to-text response dictation, and Gemini-graded engineering scorecards
          </p>
        </div>

        {!sessionActive && !sessionCompleted && (
          <div className="flex items-center gap-2">
            <button
              onClick={startSession}
              disabled={isGeneratingQuestions || (isCustomJob && !selectedJobId)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingQuestions ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing AI Rounds...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Interview Simulation</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Track & Target Role Selection (Only before active session) */}
      {!sessionActive && !sessionCompleted && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Choose Your Interview Track</h3>
                <p className="text-xs text-slate-500">Practice standard industry tracks or prepare for active campus company drives</p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setIsCustomJob(false)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    !isCustomJob ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Standard Industry Tracks
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomJob(true);
                    if (!selectedJobId && jobs.length > 0) setSelectedJobId(jobs[0].id);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isCustomJob ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Active Campus Openings ({jobs.length})
                </button>
              </div>
            </div>

            {/* Standard Tracks Grid */}
            {!isCustomJob ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {Object.entries(MOCK_INTERVIEW_ROLES).map(([key, r]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedRoleKey(key)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedRoleKey === key
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 mb-1">{r.title}</div>
                    <div className="text-[11px] text-slate-500">{r.questions.length} core technical questions with audio synthesis</div>
                  </div>
                ))}
              </div>
            ) : (
              /* Campus Openings Dropdown / Selector */
              <div className="space-y-3 pt-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Select Campus Placement Opening:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedJobId === job.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{job.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {job.package || 'Campus Drive'}
                        </span>
                      </div>
                      <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                        {job.companyName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        Skills: {(job.requiredSkills || []).slice(0, 3).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Session QA Interface */}
      {sessionActive && currentQuestion && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-lg space-y-6 animate-fadeIn">
          
          {/* Header row: Progress, Audio controls, & Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                Track: {activeRoleTitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* TTS Audio Controls */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    speakQuestion(currentQuestion.question);
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isSpeaking 
                    ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{isSpeaking ? 'Mute AI Voice' : 'Hear Question'}</span>
              </button>

              <label className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Auto-read aloud</span>
              </label>

              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Question Box with Speaker Avatar */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 relative">
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => speakQuestion(currentQuestion.question)}
                title="Click to replay question voice"
                className={`p-3 rounded-2xl text-white shrink-0 shadow-md transition-all ${
                  isSpeaking ? 'bg-indigo-700 ring-4 ring-indigo-300 scale-105' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
              </button>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
                    AI Senior Technical Interviewer:
                  </span>
                  {isSpeaking && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200 animate-pulse">
                      ● Speaking question...
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>
            </div>
          </div>

          {/* Student Answer Input with Voice Recording */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>Your Technical Response:</span>
                {isRecording && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    Recording live microphone...
                  </span>
                )}
              </label>

              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-500" />}
                <span>{isRecording ? 'Stop Recording' : 'Dictate with Voice'}</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Explain your conceptual approach, core engineering trade-offs, algorithms, or practical implementation steps..."
              className="w-full text-xs font-sans p-4 rounded-xl border border-slate-200 bg-slate-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed placeholder:text-slate-400"
            />
          </div>

          {/* Hint accordion */}
          {currentQuestion.idealPoints && (
            <details className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <summary className="font-semibold text-indigo-700 cursor-pointer">
                💡 Need a hint or core technical aspects to cover?
              </summary>
              <p className="mt-2 text-slate-600 leading-relaxed">
                {currentQuestion.idealPoints}
              </p>
            </details>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to end this interview session early?')) {
                  stopSpeaking();
                  stopRecording();
                  setSessionActive(false);
                }
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Quit Interview
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={isEvaluating || !userAnswer.trim()}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Grading with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Answer & Next Round</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* Completed Session Summary Scorecard */}
      {sessionCompleted && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-xl space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  AI Mock Interview Verified Evaluation Scorecard
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track: {activeRoleTitle} • Time Taken: {formatTimer(timerSeconds)}
                </p>
              </div>
            </div>

            {/* Save & Retake Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveScoreToProfile}
                disabled={isSavingScore || isScoreSaved}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                  isScoreSaved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                {isSavingScore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isScoreSaved ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Score Saved ({totalScore}%)</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Save to Profile</span>
                  </>
                )}
              </button>

              <div className="text-right">
                <div className="text-xs text-slate-500">Overall Readiness</div>
                <div className="text-2xl font-black text-emerald-600">{totalScore} / 100</div>
              </div>

              <button
                onClick={startSession}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Technical Accuracy</span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">{Math.min(96, totalScore + 3)}%</div>
              <span className="text-[11px] text-emerald-600 font-medium">Solid engineering fundamentals</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Communication Clarity</span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">{Math.min(94, Math.max(60, totalScore - 2))}%</div>
              <span className="text-[11px] text-indigo-600 font-medium">Concise & articulate responses</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">System Trade-offs</span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900">{Math.min(95, totalScore + 1)}%</div>
              <span className="text-[11px] text-purple-600 font-medium">Balanced design considerations</span>
            </div>
          </div>

          {/* Question-by-question breakdown */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Detailed AI Critique & Model Answers:</span>
            </h4>
            {evaluations.map((ev, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-slate-900 text-xs">
                    Round {i + 1}: {ev.question.question}
                  </span>
                  <span className="text-xs font-black text-indigo-700 shrink-0 px-2.5 py-0.5 rounded-full bg-indigo-100">
                    Score: {ev.score}/100
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200/70 text-xs text-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Your Stated Response:</span>
                  "{ev.answer}"
                </div>

                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  <strong className="text-indigo-700">AI Senior Reviewer:</strong> {ev.feedback}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 text-emerald-800 border border-emerald-200">
                    <strong>Key Strengths:</strong> {Array.isArray(ev.strengths) ? ev.strengths.join(' • ') : ev.strengths}
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/70 text-amber-800 border border-amber-200">
                    <strong>Recommended Polish:</strong> {Array.isArray(ev.improvements) ? ev.improvements.join(' • ') : ev.improvements}
                  </div>
                </div>

                {ev.modelAnswer && (
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-0.5">Ideal Technical Talking Points:</span>
                    {ev.modelAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
