import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2, 
  X,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../services/api';

export default function AiSettingsModal({ isOpen, onClose, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const existing = localStorage.getItem('recruitloop_gemini_api_key') || '';
    setCurrentKey(existing);
    setApiKey(existing);
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      localStorage.removeItem('recruitloop_gemini_api_key');
      setCurrentKey('');
      setTestResult({ success: true, message: 'Custom API key removed. Reverted to built-in NLP heuristics.' });
    } else {
      localStorage.setItem('recruitloop_gemini_api_key', trimmed);
      setCurrentKey(trimmed);
      setTestResult({ success: true, message: 'Google Gemini API Key saved and activated successfully!' });
    }
    if (onKeyUpdated) onKeyUpdated(trimmed);
  };

  const handleRemove = () => {
    localStorage.removeItem('recruitloop_gemini_api_key');
    setCurrentKey('');
    setApiKey('');
    setTestResult({ success: true, message: 'Custom key cleared. Default system mode active.' });
    if (onKeyUpdated) onKeyUpdated('');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.evaluateInterviewAnswer({
        roleTitle: 'Software Engineer',
        question: 'What is the advantage of using indexing in a relational database?',
        studentAnswer: 'Indexing speeds up query lookup times from O(N) to O(log N) using B-Trees, though it adds slight write overhead.',
        idealPoints: 'B-Tree lookup speed, storage overhead, write penalty'
      });

      if (res?.evaluation?.score) {
        setTestResult({
          success: true,
          message: `Connection successful! Gemini responded with ${res.evaluation.score}/100 technical grade.`
        });
      } else {
        setTestResult({
          success: false,
          message: 'Received response, but evaluation schema was incomplete.'
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err?.message || 'Failed to connect. Please check your API key quota or validity.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const maskedKey = currentKey 
    ? `${currentKey.substring(0, 7)}••••••••••••${currentKey.substring(currentKey.length - 4)}` 
    : '';

  const modalContent = (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Google Gemini AI Engine</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700">
                  v1.5 Flash / Pro
                </span>
              </div>
              <p className="text-xs text-slate-500">Live ATS Resume Intelligence & Real-Time Mock Interview Grading</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Status Alert Banner */}
          {currentKey ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900">Live Gemini Studio API Active</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs text-emerald-700">
                  Key configured: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-bold">{maskedKey}</code>
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Standard NLP Engine Active</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">Key Optional</span>
                </div>
                <p className="text-xs text-slate-600">
                  System is currently using backend neural heuristics. Connect your Google AI Studio key below for true real-time Gemini LLM reasoning.
                </p>
              </div>
            </div>
          )}

          {/* Key Input Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>Google AI Studio API Key:</span>
              </span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs font-mono px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Keys are securely stored in your browser's private local storage and transmitted via HTTPS headers.
            </p>
          </div>

          {/* Test connection result banner */}
          {testResult && (
            <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
              testResult.success 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed font-medium">{testResult.message}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div>
              {currentKey && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Key</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {currentKey && (
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                Save & Apply Key
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
