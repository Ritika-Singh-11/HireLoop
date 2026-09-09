import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  Plus, 
  Building, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Sparkles,
  X 
} from 'lucide-react';

export default function InterviewScheduler() {
  const { applications, scheduleInterview, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendInterviews, setBackendInterviews] = useState([]);

  // Form State
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '');
  const [roundType, setRoundType] = useState('Technical Interview 1');
  const [date, setDate] = useState('2026-09-16');
  const [time, setTime] = useState('14:30');
  const [mode, setMode] = useState('Virtual'); // 'Virtual' | 'In-Person'
  const [meetLink, setMeetLink] = useState('https://meet.google.com/hrc-camp-tpo');
  const [venue, setVenue] = useState('TPO Conference Hall B');
  const [interviewer, setInterviewer] = useState('Senior Staff Tech Lead');

  useEffect(() => {
    async function loadInterviews() {
      try {
        const res = await api.getInterviews();
        if (res?.interviews?.length) {
          setBackendInterviews(res.interviews);
        }
      } catch (err) {
        console.warn('Using client interviews fallback:', err);
      }
    }
    loadInterviews();
  }, []);

  // Collect existing scheduled interviews from applications
  const scheduledInterviews = applications
    .filter(a => a.status === 'Interview Scheduled' || a.interview)
    .map(a => ({
      appId: a.id,
      candidate: a.studentName || 'Aarav Sharma',
      roll: a.studentRoll || '21BCSE104',
      company: a.companyName,
      jobTitle: a.jobTitle,
      round: a.interview?.round || 'Technical Screening',
      date: a.interview?.date || '2026-09-15',
      time: a.interview?.time || '11:00 AM',
      mode: a.interview?.mode || 'Virtual',
      link: a.interview?.link || 'https://meet.google.com/xyz-rec-live',
      venue: a.interview?.venue || 'Campus Placement Cell'
    }));

  const allInterviews = [
    ...backendInterviews,
    ...scheduledInterviews.filter(si => 
      !backendInterviews.some(bi => bi.candidate === si.candidate && bi.company === si.company && bi.round === si.round)
    )
  ];

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppId) return;

    const candidateApp = applications.find(a => a.id === selectedAppId);

    const interviewData = {
      round: roundType,
      date,
      time,
      mode,
      link: mode === 'Virtual' ? meetLink : null,
      venue: mode === 'In-Person' ? venue : null,
      interviewer
    };

    scheduleInterview(selectedAppId, interviewData);

    try {
      const payload = {
        candidate: candidateApp?.studentName || 'Aarav Sharma',
        roll: candidateApp?.studentRoll || '21BCSE104',
        company: candidateApp?.companyName || 'Campus Recruiter',
        jobTitle: candidateApp?.jobTitle || 'Software Development Engineer',
        round: roundType,
        date,
        time,
        mode,
        link: mode === 'Virtual' ? meetLink : null,
        venue: mode === 'In-Person' ? venue : null,
        interviewer,
        status: 'Scheduled'
      };
      const res = await api.scheduleInterview(payload);
      if (res?.interview) {
        setBackendInterviews(prev => [res.interview, ...prev]);
      }
    } catch (err) {
      console.warn('Offline/preview fallback for interview schedule:', err);
    }

    setIsModalOpen(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Interview link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Logistics & Testing</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Interview & Assessment Scheduler
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate technical panels, assign Google Meet links or campus interview rooms, and synchronize slots with students.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Slot</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Upcoming Rounds</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{allInterviews.length}</p>
          <span className="text-xs text-indigo-600 font-semibold">Active candidate interviews</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Virtual Panels</span>
            <Video className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {allInterviews.filter(i => i.mode === 'Virtual').length}
          </p>
          <span className="text-xs text-slate-400">Google Meet / Teams sessions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Campus Rooms Booked</span>
            <MapPin className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">
            {allInterviews.filter(i => i.mode === 'In-Person').length}
          </p>
          <span className="text-xs text-slate-400">TPO block interview suites</span>
        </div>
      </div>

      {/* Scheduled Sessions List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="font-extrabold text-slate-900 text-sm">Active & Upcoming Scheduled Interviews</h2>

        <div className="space-y-3">
          {allInterviews.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No interview sessions currently scheduled. Click "Schedule New Slot" to create one.
            </div>
          ) : (
            allInterviews.map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{slot.candidate}</h4>
                      <span className="text-xs text-slate-400 font-mono">({slot.roll})</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {slot.round}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      {slot.company} — {slot.jobTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {slot.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {slot.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {slot.mode === 'Virtual' ? (
                          <span className="text-indigo-600 font-semibold flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" /> Virtual Meeting
                          </span>
                        ) : (
                          <span className="text-purple-600 font-semibold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {slot.venue}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {slot.mode === 'Virtual' && slot.link && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => copyToClipboard(slot.link)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Link</span>
                    </button>
                    <a
                      href={slot.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <span>Join Room</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Schedule Interview Round</h3>
                <p className="text-xs text-slate-500">Dispatch calendar invite and testing credentials to candidate.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Candidate Application *</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.studentName || 'Aarav Sharma'} ({app.studentRoll || '21BCSE104'}) — {app.companyName} ({app.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Round Designation</label>
                  <select
                    value={roundType}
                    onChange={(e) => setRoundType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Coding Assessment">Online Coding Assessment</option>
                    <option value="Technical Interview 1">Technical Interview 1 (DSA/System)</option>
                    <option value="Technical Interview 2">Technical Interview 2 (Projects/Tech)</option>
                    <option value="Managerial Round">Managerial / Fitment Round</option>
                    <option value="HR & Culture Round">HR & Culture Round</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interview Format</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Virtual">Virtual (Google Meet / Teams)</option>
                    <option value="In-Person">In-Person (Campus Suite)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot *</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {mode === 'Virtual' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
                  <input
                    type="url"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Room / Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interviewer / Panelist Name</label>
                <input
                  type="text"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Confirm & Notify Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
