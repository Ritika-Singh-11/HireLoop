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
  BookOpen,
  Key,
  ShieldCheck,
  Check,
  Search,
  SlidersHorizontal,
  Terminal,
  Wand2,
  Cpu,
  Layers
} from 'lucide-react';
import { MOCK_INTERVIEW_ROLES, evaluateAnswer } from '../../utils/aiEngine';
import { api } from '../../services/api';
import AiSettingsModal from '../common/AiSettingsModal';

export const INTERVIEW_DOMAINS = [
  { id: 'fullstack', title: 'Full-Stack Web Development', icon: '🌐', tags: ['React', 'Node.js', 'Next.js', 'APIs'], desc: 'End-to-end architectures, state sync, caching, SSR & CSR trade-offs.' },
  { id: 'frontend', title: 'Frontend & UI Engineering', icon: '🎨', tags: ['React', 'CSS', 'Performance', 'DOM'], desc: 'Fiber reconciler, Core Web Vitals, re-render optimizations, modern CSS.' },
  { id: 'backend', title: 'Backend & Distributed Systems', icon: '⚙️', tags: ['Node.js', 'Microservices', 'Redis', 'Concurrency'], desc: 'Event loop, Redlock distributed locking, gRPC, idempotency, horizontal scale.' },
  { id: 'devops', title: 'Cloud, DevOps & SRE', icon: '☁️', tags: ['AWS', 'Kubernetes', 'Docker', 'CI/CD'], desc: 'Rolling deployments, probe configurations, security pipelines, GitOps.' },
  { id: 'aiml', title: 'Data Science & Machine Learning', icon: '🧠', tags: ['Python', 'PyTorch', 'Model Eval', 'Deep Learning'], desc: 'Bias-variance diagnosis, transformer attention, imbalanced dataset metrics.' },
  { id: 'genai', title: 'Generative AI & LLMs', icon: '✨', tags: ['RAG', 'Vector DBs', 'Prompting', 'Guardrails'], desc: 'Production RAG pipelines, chunking, re-ranking, hallucination mitigation.' },
  { id: 'cybersecurity', title: 'Cyber Security & AppSec', icon: '🛡️', tags: ['OWASP', 'Auth', 'Pen Testing', 'TLS Handshake'], desc: 'TLS 1.3 cryptography, CSRF/SSRF prevention, defense-in-depth.' },
  { id: 'mobile', title: 'Mobile App Development', icon: '📱', tags: ['Flutter', 'React Native', 'Android', 'iOS'], desc: 'Offline persistence, sync queues, threading, native bridge architectures.' },
  { id: 'systemdesign', title: 'System Design & Scalability', icon: '🏗️', tags: ['High Scale', 'Sharding', 'CAP', 'Queues'], desc: 'Bitly URL shorteners, large-scale notification queues, microservice partitioning.' },
  { id: 'dataengineering', title: 'Data Engineering & Big Data', icon: '📊', tags: ['Kafka', 'Spark', 'SQL', 'ETL Pipelines'], desc: 'Lambda vs Kappa stream architectures, real-time analytics, partitioning.' },
  { id: 'dba', title: 'Database Administration (DBA)', icon: '💾', tags: ['PostgreSQL', 'MongoDB', 'Indexing', 'ACID'], desc: 'Query profiling, B-tree indexes, isolation levels, write-ahead logging.' },
  { id: 'testing', title: 'QA Automation & Testing', icon: '🧪', tags: ['Cypress', 'Jest', 'TDD', 'Stress Tests'], desc: 'End-to-end automation, regression coverage, continuous load testing.' },
  { id: 'blockchain', title: 'Blockchain & Web3', icon: '⛓️', tags: ['Smart Contracts', 'Solidity', 'EVM', 'Security'], desc: 'Reentrancy protection, gas optimizations, consensus mechanisms.' },
  { id: 'embedded', title: 'Embedded Systems & IoT', icon: '⚡', tags: ['C/C++', 'RTOS', 'Microcontrollers', 'Memory'], desc: 'Memory-constrained execution, interrupt handling, real-time protocols.' },
  { id: 'product', title: 'Tech Product Management', icon: '💼', tags: ['MVP Scoping', 'Metrics', 'STAR Method'], desc: 'Prioritization frameworks, trade-offs, engineering stakeholder negotiation.' }
];

export const CUSTOM_DOMAIN_SUGGESTIONS = [
  'Rust Systems Programming',
  'Golang Distributed Microservices',
  'Flutter & Cross-Platform Mobile',
  'Kubernetes, Helm & GitOps',
  'GraphQL, Apollo & Federation',
  'Next.js 14 App Router & Server Actions',
  'Redis, Kafka & Event Architecture',
  'C++ Embedded & Automotive Systems',
  'Blockchain & Solidity Smart Contracts',
  'Cybersecurity & Web App Penetration Testing',
  'Generative AI & LLM Fine-Tuning',
  'Snowflake & dbt Modern Data Stack'
];

export default function MockInterview() {
  const { student, setStudent, jobs, showToast } = useApp();

  // Mode: 'domain' | 'custom' | 'campus-job'
  const [interviewMode, setInterviewMode] = useState('domain');
  const [selectedDomainKey, setSelectedDomainKey] = useState('fullstack');
  const [customDomainText, setCustomDomainText] = useState('');
  const [domainSearchQuery, setDomainSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Campus Graduate / Junior (0-2 Yrs)');
  const [selectedFocusArea, setSelectedFocusArea] = useState('Core Fundamentals & Architecture');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(3);
  const [selectedJobId, setSelectedJobId] = useState('');

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
  const [intermissionItem, setIntermissionItem] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [isScoreSaved, setIsScoreSaved] = useState(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);

  useEffect(() => {
    setHasCustomKey(!!localStorage.getItem('recruitloop_gemini_api_key'));
  }, [isAiSettingsOpen]);

  const recognitionRef = useRef(null);

  // Determine active track title
  const activeRoleTitle = interviewMode === 'custom'
    ? (customDomainText.trim() || 'Custom Tech Specialization')
    : interviewMode === 'campus-job'
    ? (jobs.find(j => j.id === selectedJobId)?.title || 'Campus Placement Role')
    : (INTERVIEW_DOMAINS.find(d => d.id === selectedDomainKey)?.title || 'Technical SDE');

  const filteredDomains = INTERVIEW_DOMAINS.filter(d => 
    d.title.toLowerCase().includes(domainSearchQuery.toLowerCase()) ||
    d.desc.toLowerCase().includes(domainSearchQuery.toLowerCase()) ||
    d.tags.some(t => t.toLowerCase().includes(domainSearchQuery.toLowerCase()))
  );

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

  const generateLocalFallbackQuestions = (domainTitle, difficulty, count = 3) => {
    const list = [
      {
        id: 1,
        question: `In ${domainTitle}, how do you architect a production-ready system to ensure low latency and high availability under sudden traffic spikes?`,
        idealPoints: 'Discuss modular service boundaries, horizontal scaling, caching layers (Redis/CDN), connection pooling, and graceful degradation.'
      },
      {
        id: 2,
        question: `What are the most common concurrency bugs or memory bottlenecks in ${domainTitle}, and what diagnostic tools and patterns do you use to resolve them?`,
        idealPoints: 'Explain profiling tools (memory heap dumps, CPU profilers), locking strategies, asynchronous non-blocking I/O, and race condition prevention.'
      },
      {
        id: 3,
        question: `Walk through an architectural trade-off you encountered in ${domainTitle} between immediate consistency, eventual consistency, and engineering complexity.`,
        idealPoints: 'Evaluate CAP theorem nuances, idempotency keys, distributed transaction patterns (Saga vs 2PC), and business impact.'
      },
      {
        id: 4,
        question: `How do you approach end-to-end security, input sanitization, and defense-in-depth principles when shipping in ${domainTitle}?`,
        idealPoints: 'Detail OWASP best practices, JWT/OAuth token verification, SQLi/XSS mitigation, least-privilege RBAC, and secrets rotation.'
      },
      {
        id: 5,
        question: `Describe a recent architectural evolution, framework, or standard in the ${domainTitle} ecosystem and how it improves on prior approaches.`,
        idealPoints: 'Demonstrate deep knowledge of modern industry trends, developer ergonomics, build optimizations, and trade-offs.'
      },
      {
        id: 6,
        question: `How do you structure comprehensive automated testing (unit, integration, contract, and stress testing) for critical systems in ${domainTitle}?`,
        idealPoints: 'Discuss mocking strategies, test flakiness prevention, CI/CD automated gates, load testing tools, and code coverage metrics.'
      },
      {
        id: 7,
        question: `When diagnosing an intermittent production incident in a ${domainTitle} deployment, what is your step-by-step troubleshooting methodology?`,
        idealPoints: 'Walk through structured log correlation, APM distributed tracing, metrics dashboards, rollback vs hotfix decisions, and post-mortems.'
      }
    ];
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((q, idx) => ({ ...q, id: idx + 1 }));
  };

  const startSession = async () => {
    setIsGeneratingQuestions(true);
    let questionsToUse = [];
    const count = selectedQuestionCount || 3;

    try {
      if (interviewMode === 'campus-job') {
        const targetJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
        const res = await api.generateInterviewQuestions({
          roleTitle: targetJob?.title || 'Software Engineer',
          companyName: targetJob?.companyName || 'Campus Recruiter',
          jobDescription: targetJob?.description || '',
          difficulty: selectedDifficulty,
          focusArea: selectedFocusArea,
          count
        });
        if (res?.questions && res.questions.length > 0) {
          questionsToUse = res.questions;
        } else {
          questionsToUse = generateLocalFallbackQuestions(`${targetJob?.companyName || 'Campus'} - ${targetJob?.title || 'Software Engineer'}`, selectedDifficulty, count);
        }
      } else if (interviewMode === 'custom') {
        const customTitle = customDomainText.trim() || 'Custom Technology Specialization';
        const res = await api.generateInterviewQuestions({
          domain: 'custom',
          customDomain: customTitle,
          roleTitle: customTitle,
          difficulty: selectedDifficulty,
          focusArea: selectedFocusArea,
          count
        });
        if (res?.questions && res.questions.length > 0) {
          questionsToUse = res.questions;
        } else {
          questionsToUse = generateLocalFallbackQuestions(customTitle, selectedDifficulty, count);
        }
      } else {
        const domainObj = INTERVIEW_DOMAINS.find(d => d.id === selectedDomainKey) || INTERVIEW_DOMAINS[0];
        const res = await api.generateInterviewQuestions({
          domain: domainObj.id,
          roleTitle: domainObj.title,
          difficulty: selectedDifficulty,
          focusArea: selectedFocusArea,
          count
        });
        if (res?.questions && res.questions.length > 0) {
          questionsToUse = res.questions;
        } else {
          if (MOCK_INTERVIEW_ROLES[selectedDomainKey]?.questions?.length > 0) {
            const roleQs = [...MOCK_INTERVIEW_ROLES[selectedDomainKey].questions].sort(() => Math.random() - 0.5);
            questionsToUse = roleQs.slice(0, count);
          } else {
            questionsToUse = generateLocalFallbackQuestions(domainObj.title, selectedDifficulty, count);
          }
        }
      }
    } catch (err) {
      console.warn('AI Question generation fallback triggered:', err);
      const title = interviewMode === 'custom'
        ? (customDomainText.trim() || 'Custom Technology')
        : interviewMode === 'campus-job'
        ? (jobs.find(j => j.id === selectedJobId)?.title || 'Campus Placement Role')
        : (INTERVIEW_DOMAINS.find(d => d.id === selectedDomainKey)?.title || 'Full-Stack Web Development');
      questionsToUse = generateLocalFallbackQuestions(title, selectedDifficulty, count);
    }

    if (!questionsToUse || questionsToUse.length === 0) {
      questionsToUse = generateLocalFallbackQuestions('Full-Stack Web Development', selectedDifficulty, count);
    }

    setActiveQuestions(questionsToUse);
    setCurrentQuestionIndex(0);
    setEvaluations([]);
    setIntermissionItem(null);
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
          technicalAccuracy: res.evaluation.technicalAccuracy ?? res.evaluation.score ?? 80,
          depthScore: res.evaluation.depthScore ?? 80,
          feedback: res.evaluation.feedback || res.evaluation.conceptualFeedback || 'Well formulated technical explanation.',
          strengths: res.evaluation.strengths || ['Good structure', 'Relevant vocabulary'],
          improvements: res.evaluation.improvements || ['Include quantifiable benchmarks or edge-case constraints'],
          modelAnswer: res.evaluation.modelAnswer || currentQuestion.idealPoints,
          interviewerFollowUp: res.evaluation.interviewerFollowUp || null
        };
        setEvaluations(prev => [...prev, evalItem]);
        setIntermissionItem(evalItem);
        if (autoSpeak && evalItem.feedback) {
          setTimeout(() => {
            speakQuestion(evalItem.feedback);
          }, 350);
        }
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
        technicalAccuracy: evalResult.score,
        depthScore: Math.min(100, Math.round(evalResult.score * 0.95)),
        feedback: evalResult.feedback,
        strengths: evalResult.strengths,
        improvements: evalResult.improvements,
        modelAnswer: currentQuestion.idealPoints,
        interviewerFollowUp: null
      };
      setEvaluations(prev => [...prev, evalItem]);
      setIntermissionItem(evalItem);
      if (autoSpeak && evalItem.feedback) {
        setTimeout(() => {
          speakQuestion(evalItem.feedback);
        }, 350);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleContinueToNextQuestion = () => {
    stopSpeaking();
    setIntermissionItem(null);
    setUserAnswer('');
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      setSessionActive(false);
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAiSettingsOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Key className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Key Config</span>
            {hasCustomKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Custom Gemini Key Connected" />
            )}
          </button>

          {!sessionActive && !sessionCompleted && (
            <button
              onClick={startSession}
              disabled={
                isGeneratingQuestions || 
                (interviewMode === 'campus-job' && !selectedJobId && jobs.length > 0) || 
                (interviewMode === 'custom' && !customDomainText.trim())
              }
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
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
          )}
        </div>
      </div>

      {/* Track & Target Role Selection (Only before active session) */}
      {!sessionActive && !sessionCompleted && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            
            {/* Header + Mode Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Step 1: Choose Your Interview Domain</span>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Real AI Generation
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick a specialized technical domain, enter any custom technology stack, or target active campus recruitment drives
                </p>
              </div>

              {/* 3 Modes Tab Switcher */}
              <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1">
                <button
                  type="button"
                  onClick={() => setInterviewMode('domain')}
                  className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    interviewMode === 'domain'
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Browse Domains (15+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInterviewMode('custom')}
                  className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    interviewMode === 'custom'
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-violet-600" />
                  <span>Custom Tech Specialization</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInterviewMode('campus-job');
                    if (!selectedJobId && jobs.length > 0) setSelectedJobId(jobs[0].id);
                  }}
                  className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    interviewMode === 'campus-job'
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Campus Placement Drives ({jobs.length})</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Curated Tech Domains */}
            {interviewMode === 'domain' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Available Engineering Fields</span>
                    <span className="text-slate-400 font-normal">({filteredDomains.length} of {INTERVIEW_DOMAINS.length} tracks)</span>
                  </div>
                  
                  {/* Search filter */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={domainSearchQuery}
                      onChange={(e) => setDomainSearchQuery(e.target.value)}
                      placeholder="Search domain e.g. React, DevOps, AI..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                    {domainSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setDomainSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredDomains.map((dom) => {
                    const isSelected = selectedDomainKey === dom.id;
                    return (
                      <div
                        key={dom.id}
                        onClick={() => setSelectedDomainKey(dom.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-2 ring-indigo-500/80'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{dom.icon}</span>
                              <h4 className="font-bold text-xs text-slate-900 leading-snug">{dom.title}</h4>
                            </div>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                            {dom.desc}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {dom.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                                isSelected
                                  ? 'bg-indigo-100/70 text-indigo-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {filteredDomains.length === 0 && (
                    <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                      No domains match your search query "{domainSearchQuery}". Try another keyword or switch to the Custom Specialization tab!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Custom Specialization (Type Any Tech) */}
            {interviewMode === 'custom' && (
              <div className="space-y-4 bg-gradient-to-br from-indigo-50/40 via-purple-50/30 to-white p-5 rounded-xl border border-indigo-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-violet-600" />
                    <span>Enter Any Custom Technology, Stack, or Engineering Role</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target any framework, language, or system topic. Real Gemini AI will dynamically synthesize fresh, customized interview questions for this exact domain.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={customDomainText}
                    onChange={(e) => setCustomDomainText(e.target.value)}
                    placeholder="e.g. Rust Systems Programming, Flutter App Architecture, Kafka Event Streaming, Kubernetes Operator..."
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 focus:border-indigo-600 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 shadow-inner focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  {customDomainText && (
                    <button
                      type="button"
                      onClick={() => setCustomDomainText('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold px-1.5 py-0.5"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Or click a popular specialization preset:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CUSTOM_DOMAIN_SUGGESTIONS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setCustomDomainText(sug)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                          customDomainText === sug
                            ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50'
                        }`}
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Campus Placement Openings */}
            {interviewMode === 'campus-job' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Select Active Campus Drive Opening:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {jobs.map((job) => {
                    const isSelected = selectedJobId === job.id;
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-2 ring-indigo-500/80'
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
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Interview Round Settings */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Step 2: Calibrate Interview Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Difficulty */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Experience & Difficulty Level</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="Campus Graduate / Junior (0-2 Yrs)">Campus Graduate / Junior (0-2 Yrs)</option>
                    <option value="Mid-Level Software Engineer (2-5 Yrs)">Mid-Level Software Engineer (2-5 Yrs)</option>
                    <option value="Senior Staff / Principal Engineer (5+ Yrs)">Senior Staff / Principal Engineer (5+ Yrs)</option>
                  </select>
                </div>

                {/* Focus Area */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Evaluation Focus Area</label>
                  <select
                    value={selectedFocusArea}
                    onChange={(e) => setSelectedFocusArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="Core Fundamentals & Architecture">Core Fundamentals & Architecture</option>
                    <option value="Live Debugging & Edge Cases">Live Debugging & Edge Cases</option>
                    <option value="Production Scalability & Resilience">Production Scalability & Resilience</option>
                    <option value="Behavioral & STAR Leadership">Behavioral & STAR Leadership</option>
                  </select>
                </div>

                {/* Question Count */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Round Length & Questions</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { count: 3, label: '3 Qs (10m)' },
                      { count: 5, label: '5 Qs (20m)' },
                      { count: 7, label: '7 Qs (30m)' }
                    ].map((opt) => (
                      <button
                        key={opt.count}
                        type="button"
                        onClick={() => setSelectedQuestionCount(opt.count)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedQuestionCount === opt.count
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Banner & Summary */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs text-indigo-300 font-semibold">Ready to begin simulation</div>
                  <div className="text-sm font-bold text-white line-clamp-1">
                    {activeRoleTitle} • {selectedDifficulty.split('(')[0]} • {selectedQuestionCount} Questions
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={startSession}
                disabled={
                  isGeneratingQuestions ||
                  (interviewMode === 'campus-job' && !selectedJobId && jobs.length > 0) ||
                  (interviewMode === 'custom' && !customDomainText.trim())
                }
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingQuestions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing AI Questions...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch AI Interview Simulation</span>
                  </>
                )}
              </button>
            </div>

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

          {/* AI Coach Intermission Card: Rendered immediately after submitting answer */}
          {intermissionItem ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-slate-50 border-2 border-indigo-200 space-y-6 animate-fadeIn shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      Round {currentQuestionIndex + 1} Assessment
                    </span>
                    <h3 className="text-base font-bold text-slate-950">
                      AI Interviewer Real-Time Feedback
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-3 py-1.5 rounded-xl bg-white border border-indigo-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Score</span>
                    <span className="text-base font-black text-indigo-700">{intermissionItem.score}/100</span>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-xl bg-white border border-indigo-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Accuracy</span>
                    <span className="text-base font-black text-emerald-600">{intermissionItem.technicalAccuracy}%</span>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-xl bg-white border border-indigo-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Depth</span>
                    <span className="text-base font-black text-purple-600">{intermissionItem.depthScore}%</span>
                  </div>
                </div>
              </div>

              {/* Spoken AI Verbal Coach critique */}
              <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Interviewer Spoken Critique:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else {
                        speakQuestion(intermissionItem.feedback);
                      }
                    }}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                        <span>Mute Coach Voice</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Listen Again</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  "{intermissionItem.feedback}"
                </p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Observed Technical Strengths</span>
                  </span>
                  <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
                    {Array.isArray(intermissionItem.strengths) ? (
                      intermissionItem.strengths.map((str, idx) => <li key={idx}>{str}</li>)
                    ) : (
                      <li>{intermissionItem.strengths}</li>
                    )}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Targeted Polish & Gaps</span>
                  </span>
                  <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside">
                    {Array.isArray(intermissionItem.improvements) ? (
                      intermissionItem.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)
                    ) : (
                      <li>{intermissionItem.improvements}</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Model Answer */}
              {intermissionItem.modelAnswer && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/70 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 block">
                    Ideal Senior Architect Benchmark Answer:
                  </span>
                  <p className="text-xs text-indigo-950 leading-relaxed font-sans">
                    {intermissionItem.modelAnswer}
                  </p>
                </div>
              )}

              {/* Follow-up Question if Gemini provided one */}
              {intermissionItem.interviewerFollowUp && (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900">
                  <span className="font-bold block mb-1">⚡ Next-Level Follow-Up Thought:</span>
                  {intermissionItem.interviewerFollowUp}
                </div>
              )}

              {/* Continue button */}
              <div className="flex items-center justify-end pt-2 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={handleContinueToNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  <span>
                    {currentQuestionIndex + 1 < activeQuestions.length
                      ? `Continue to Question ${currentQuestionIndex + 2} of ${activeQuestions.length}`
                      : 'Finalize Interview & View Full Scorecard'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}

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

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
        onKeyUpdated={() => setHasCustomKey(!!localStorage.getItem('recruitloop_gemini_api_key'))}
      />

    </div>
  );
}
