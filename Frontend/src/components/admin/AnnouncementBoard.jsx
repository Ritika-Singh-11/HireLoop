import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';
import { Megaphone, Plus, Pin, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AnnouncementBoard() {
  const { announcements, addAnnouncement, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Placement Drive');
  const [badge, setBadge] = useState('Important');
  const [author, setAuthor] = useState('Training & Placement Office (TPO)');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(true);
  const [backendAnnouncements, setBackendAnnouncements] = useState([]);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const res = await api.getAnnouncements();
        if (res?.announcements?.length) {
          setBackendAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn('Using client announcements fallback:', err);
      }
    }
    loadAnnouncements();
  }, []);

  const allAnnouncements = [
    ...backendAnnouncements.map(a => ({
      ...a,
      id: a._id || a.id,
      date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : (a.date || 'Today')
    })),
    ...announcements.filter(ca => 
      !backendAnnouncements.some(ba => (ba._id === ca.id) || (ba.title === ca.title))
    )
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const noticeData = {
      title,
      category,
      badge,
      author,
      content,
      pinned,
      targetAudience: 'all'
    };

    // Update client context
    addAnnouncement(noticeData);

    // Persist to backend database + dispatch live student notification
    try {
      const res = await api.createAnnouncement(noticeData);
      if (res?.announcement) {
        setBackendAnnouncements(prev => [res.announcement, ...prev]);
        showToast('Notice published and broadcast to student notifications!');
      }
    } catch (err) {
      console.warn('Offline/preview fallback for notice broadcast:', err);
      showToast('Notice broadcasted to local feed.');
    }

    setTitle('');
    setContent('');
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAnnouncement(id);
      setBackendAnnouncements(prev => prev.filter(a => (a._id || a.id) !== id));
      showToast('Notice deleted.');
    } catch (err) {
      console.warn('Could not delete from backend:', err);
      setBackendAnnouncements(prev => prev.filter(a => (a._id || a.id) !== id));
      showToast('Notice removed.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Campus Placement Announcement Board
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast official recruitment notices, drive schedules, and policy advisories directly to students
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
          {allAnnouncements.length} Live Notices
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Compose Notice Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Megaphone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Publish New Campus Notice
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon Winter Internship Assessment Schedule"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Placement Drive">Placement Drive</option>
                  <option value="Policy & Rules">Policy & Rules</option>
                  <option value="Upcoming Drive">Upcoming Drive</option>
                  <option value="Workshop / Prep">Workshop / Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Badge</label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Urgent">Urgent (Red)</option>
                  <option value="Important">Important (Amber)</option>
                  <option value="Info">Info (Blue)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Authority / Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Content *</label>
              <textarea
                rows={4}
                required
                placeholder="Include drive timings, venue, mandatory documents, eligibility rules..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinNotice"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="pinNotice" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Pin to top of Student Dashboard
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>

        {/* Right: Published Notices */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 px-1">Currently Active Campus Notices</h3>
          
          <div className="space-y-3">
            {allAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                      {ann.pinned && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" />
                          <span>{ann.badge || 'Pinned'}</span>
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {ann.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                      {ann.content}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                      <span>{ann.author}</span>
                      <span>•</span>
                      <span>Posted on: {ann.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
