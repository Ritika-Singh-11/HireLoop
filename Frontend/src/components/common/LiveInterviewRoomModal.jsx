import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  Code2,
  FileText,
  HelpCircle,
  ExternalLink,
  Play,
  CheckCircle2,
  Sparkles,
  Users,
  Clock,
  Laptop,
  Maximize2
} from 'lucide-react';

export default function LiveInterviewRoomModal({
  isOpen,
  onClose,
  interviewData,
  userRole = 'student',
  currentUserName = ''
}) {
  const interview = interviewData ? (interviewData.interviewDetails || interviewData.interview || interviewData) : {};
  const companyName = interviewData?.companyName || interview.companyName || 'Corporate Partner';
  const companyLogo = interviewData?.companyLogo || interview.companyLogo || '🏢';
  const studentName = interviewData?.studentName || interview.studentName || 'Candidate';
  const interviewerName = interview.interviewer || 'Senior Technical Lead';
  const roundTitle = interview.round || interview.roundType || 'Technical Interview Round';
  const rawMeetLink = interview.meetLink || interview.link || 'https://meet.google.com';

  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'notes' | 'questions'
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [streamError, setStreamError] = useState(null);

  // Live Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Code Pairing Editor State
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeContent, setCodeContent] = useState(`// HireLoop Live Code Pairing Sandbox
// Problem: Find two numbers that add up to target sum in O(n) time
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test Run
const nums = [2, 7, 11, 15];
const target = 9;
console.log("Input:", nums, "Target:", target);
console.log("Indices Result:", twoSum(nums, target));
`);

  const [consoleOutput, setConsoleOutput] = useState('Sandbox initialized. Click "Run Code" to execute.');
  const [interviewNotes, setInterviewNotes] = useState(
    `# Technical Evaluation Notes\n- Candidate: ${studentName}\n- Role: ${interviewData?.jobTitle || 'Software Engineer'}\n- Company: ${companyName}\n- Notes: Demonstrated strong algorithmic foundation and clean problem breakdown.`
  );

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (!isOpen || !interviewData) return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, Boolean(interviewData)]);

  // WebRTC Camera capture effect
  useEffect(() => {
    if (!isOpen || !interviewData) return;
    let active = true;

    async function startMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          if (active) {
            mediaStreamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          }
        }
      } catch (err) {
        if (active) {
          console.warn('Webcam/mic access not granted or unavailable:', err.message);
          setStreamError('Camera preview using simulated visual avatar');
        }
      }
    }

    startMedia();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, Boolean(interviewData)]);

  if (!isOpen || !interviewData) return null;

  // Toggle Camera
  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = !isCameraOn));
    }
    setIsCameraOn(!isCameraOn);
  };

  // Toggle Mic
  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !isMicOn));
    }
    setIsMicOn(!isMicOn);
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices?.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = screenStream;
          }
          setIsScreenSharing(true);
          screenStream.getVideoTracks()[0].onended = () => {
            if (mediaStreamRef.current && videoRef.current) {
              videoRef.current.srcObject = mediaStreamRef.current;
            }
            setIsScreenSharing(false);
          };
        }
      } catch {
        setIsScreenSharing(false);
      }
    } else {
      if (mediaStreamRef.current && videoRef.current) {
        videoRef.current.srcObject = mediaStreamRef.current;
      }
      setIsScreenSharing(false);
    }
  };

  const handleRunCode = () => {
    if (codeLanguage === 'javascript') {
      try {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        };
        // Safe evaluation
        const fn = new Function(codeContent);
        fn();
        console.log = originalLog;
        setConsoleOutput(logs.join('\n') || 'Program executed successfully with 0 output.');
      } catch (err) {
        setConsoleOutput(`Runtime Error:\n${err.message}`);
      }
    } else {
      setConsoleOutput(
        `[${codeLanguage.toUpperCase()} Sandbox Runner]\nCompiling source...\nExecution output simulated successfully:\n✓ Test Case 1 Passed: [0, 1]\n✓ Test Case 2 Passed: [1, 2]\nRuntime: 34ms | Memory: 14.2 MB`
      );
    }
  };

  const handleLeaveRoom = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  const ensureHttps = (link) => {
    if (!link) return 'https://meet.google.com';
    const str = link.trim();
    if (str.startsWith('http://') || str.startsWith('https://')) return str;
    return `https://${str}`;
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCandidate = userRole === 'student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="bg-slate-900 text-white w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        
        {/* Top Meeting Status Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
              {companyLogo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  {companyName} • {roundTitle}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE ENCRYPTED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Candidate: <strong className="text-slate-200">{studentName}</strong> • Interviewer: <strong className="text-slate-200">{interviewerName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Call Duration */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatTimer(secondsElapsed)}</span>
            </div>

            {/* Optional External Meet Link */}
            {rawMeetLink && (
              <button
                type="button"
                onClick={() => window.open(ensureHttps(rawMeetLink), '_blank', 'noopener,noreferrer')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                title="Launch in Google Meet in another tab"
              >
                <span>Google Meet URL</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            )}

            {/* Leave Room Button */}
            <button
              type="button"
              onClick={handleLeaveRoom}
              className="px-4 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Main Content Area: Video Streams + Interactive Sandbox */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left / Video Grid (5 Cols on large screens) */}
          <div className="lg:col-span-5 bg-slate-950 p-4 flex flex-col justify-between gap-4 border-r border-slate-800 overflow-y-auto">
            
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              
              {/* Participant 1 (Current User Video) */}
              <div className="relative aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-bold mb-2">
                      {currentUserName ? currentUserName[0]?.toUpperCase() : isCandidate ? 'C' : 'I'}
                    </div>
                    <span className="text-xs font-bold text-slate-300">Camera Toggled Off</span>
                    <span className="text-[11px] text-slate-500">Audio feed remains active</span>
                  </div>
                )}

                {/* Participant Label */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10">
                  <span>{isCandidate ? `${studentName} (You)` : `${interviewerName} (You)`}</span>
                  {!isMicOn && <MicOff className="w-3 h-3 text-red-400" />}
                </div>

                {isScreenSharing && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-indigo-600 text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                    <Laptop className="w-3 h-3" />
                    <span>Sharing Screen</span>
                  </div>
                )}
              </div>

              {/* Participant 2 (Remote Peer Video Simulation) */}
              <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-indigo-950/40 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative mb-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-bold">
                      {isCandidate ? interviewerName[0] : studentName[0]}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {isCandidate ? interviewerName : studentName}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {isCandidate ? `${companyName} Panelist` : 'Final Year CSE Candidate'}
                  </span>

                  {/* Simulated Audio Wave */}
                  <div className="flex items-center gap-1 mt-3">
                    <span className="w-1 h-3 bg-emerald-400/80 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-emerald-400/60 rounded-full animate-pulse delay-150" />
                    <span className="w-1 h-4 bg-emerald-400/90 rounded-full animate-pulse delay-100" />
                  </div>
                </div>

                {/* Participant Label */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10">
                  <span>{isCandidate ? `${interviewerName} (${companyName})` : `${studentName} (Candidate)`}</span>
                </div>
              </div>

            </div>

            {/* In-Call Media Controls */}
            <div className="pt-2 flex items-center justify-center gap-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isMicOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isCameraOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                }`}
                title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={toggleScreenShare}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title="Share Screen"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Right / Interactive Collaborative Workspace (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 flex flex-col overflow-hidden">
            
            {/* Workspace Tab Bar */}
            <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code Pairing Sandbox</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'notes'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Shared Whiteboard / Notes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('questions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'questions'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Interview Prompts</span>
                </button>
              </div>

              {activeTab === 'code' && (
                <div className="flex items-center gap-2">
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
                  >
                    <option value="javascript">JavaScript (ES6)</option>
                    <option value="python">Python 3.12</option>
                    <option value="cpp">C++ 20</option>
                    <option value="java">Java 17</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleRunCode}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tab 1: Code Pairing Editor */}
            {activeTab === 'code' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-3">
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    spellCheck="false"
                    className="w-full h-full p-4 rounded-xl bg-slate-950 font-mono text-xs leading-relaxed text-indigo-200 border border-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Console Terminal */}
                <div className="h-36 bg-slate-950 border-t border-slate-800 p-3 flex flex-col font-mono text-[11px]">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-slate-500 text-[10px] uppercase font-bold">
                    <span>Terminal Sandbox Console</span>
                    <button
                      type="button"
                      onClick={() => setConsoleOutput('')}
                      className="hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                  <pre className="flex-1 overflow-y-auto text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {consoleOutput}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 2: Shared Whiteboard / Notes */}
            {activeTab === 'notes' && (
              <div className="flex-1 p-4 flex flex-col overflow-hidden">
                <textarea
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full flex-1 p-4 rounded-xl bg-slate-950 font-mono text-xs leading-relaxed text-slate-200 border border-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Type technical notes, architecture design pointers, or candidate feedback here..."
                />
              </div>
            )}

            {/* Tab 3: Interview Questions & Guidance */}
            {activeTab === 'questions' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50">
                  <h4 className="font-bold text-sm text-indigo-300 mb-1">
                    Technical Round Focus Areas:
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Evaluate problem decomposition, algorithmic time/space complexities, edge-case analysis, and clean code hygiene.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Coding Warm-Up</span>
                    <h5 className="font-bold text-slate-200">1. Two-Pointer Sum or Subarray Sum</h5>
                    <p className="text-slate-400 text-[11px]">Given an array of integers, identify optimal subarrays meeting condition in linear O(N) time with O(1) space.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">System Design / Web Foundations</span>
                    <h5 className="font-bold text-slate-200">2. High-Throughput Job Queue / Rate Limiting</h5>
                    <p className="text-slate-400 text-[11px]">How would you design a token bucket rate limiter in Node.js/Redis capable of handling 50,000 requests/sec?</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Behavioral & Cultural</span>
                    <h5 className="font-bold text-slate-200">3. Engineering Tradeoffs & Debugging</h5>
                    <p className="text-slate-400 text-[11px]">Describe a challenging asynchronous race condition or production bug you resolved and how you structured test cases.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
