import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { Building, CheckCircle, XCircle, ShieldCheck, ExternalLink, Mail, MapPin, Sparkles } from 'lucide-react';

export default function CompanyApprovals() {
  const { companies, approveCompany, rejectCompany, showToast } = useApp();
  const [backendCompanies, setBackendCompanies] = useState([]);
  const [recentlyConfirmedCompIds, setRecentlyConfirmedCompIds] = useState(new Set());
  const [recentlyRejectedCompIds, setRecentlyRejectedCompIds] = useState(new Set());

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await api.getCompanies();
        if (res?.companies?.length) {
          setBackendCompanies(res.companies);
        }
      } catch (err) {
        console.warn('Using client companies fallback:', err);
      }
    }
    loadCompanies();
  }, []);

  // Cleanly merge backend and local companies so all registered companies are visible
  const combinedMap = new Map();
  // 1. Load backend companies first
  (backendCompanies || []).forEach(bc => {
    if (bc?.name) {
      combinedMap.set(bc.name.trim().toLowerCase(), {
        ...bc,
        id: bc._id || bc.id,
        registeredAt: bc.registeredAt || (bc.createdAt ? new Date(bc.createdAt).toISOString().split('T')[0] : '2026-09-01')
      });
    }
  });

  // 2. Overlay local companies (saved in localStorage) so approved state is permanent
  (companies || []).forEach(c => {
    if (c?.name) {
      const key = c.name.trim().toLowerCase();
      const existing = combinedMap.get(key);
      const isPermanentlyApproved = c.status === 'Approved' || existing?.status === 'Approved';
      combinedMap.set(key, {
        ...(existing || {}),
        ...c,
        id: existing?.id || c.id,
        status: isPermanentlyApproved ? 'Approved' : (c.status || existing?.status || 'Pending')
      });
    }
  });
  const allCompanies = Array.from(combinedMap.values());

  const handleStatusChange = async (companyId, newStatus, compName) => {
    const compIdentifier = compName || companyId;
    if (newStatus === 'Approved') {
      approveCompany(compIdentifier);
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch {}
      setRecentlyConfirmedCompIds(prev => new Set(prev).add(companyId));
      setTimeout(() => {
        setRecentlyConfirmedCompIds(prev => {
          const next = new Set(prev);
          next.delete(companyId);
          return next;
        });
      }, 3000);
    } else {
      rejectCompany(compIdentifier);
      setRecentlyRejectedCompIds(prev => new Set(prev).add(companyId));
      setTimeout(() => {
        setRecentlyRejectedCompIds(prev => {
          const next = new Set(prev);
          next.delete(companyId);
          return next;
        });
      }, 3000);
    }

    setBackendCompanies(prev => prev.map(c => 
      (c._id === companyId || c.id === companyId || (c.name && compName && c.name.toLowerCase() === compName.toLowerCase())) 
        ? { ...c, status: newStatus } 
        : c
    ));

    try {
      await api.updateCompanyStatus(companyId, newStatus, compName);
      showToast(`Company status updated to ${newStatus} in recruitment registry!`);
    } catch (err) {
      console.warn('Could not sync company status with backend:', err);
    }
  };

  const approvedCount = allCompanies.filter(c => c.status === 'Approved').length;
  const pendingCount = allCompanies.filter(c => c.status === 'Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Company Verification & Drive Authorizations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review corporate recruiter registrations, verify background credentials, and authorize campus job listings
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          {approvedCount} Approved • {pendingCount} Pending
        </div>
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allCompanies.map((comp) => {
          const isApproved = comp.status === 'Approved';
          const isPending = comp.status === 'Pending';
          const isRejected = comp.status === 'Rejected';

          return (
            <div
              key={comp.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                isPending ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                    {comp.logo || '🏢'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{comp.name}</h3>
                    <p className="text-xs text-slate-500">{comp.industry}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isApproved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isPending
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {comp.status}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{comp.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{comp.contactPerson} ({comp.contactEmail})</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Registered: {comp.registeredAt}</span>
                <div className="flex items-center gap-2">
                  {isPending ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(comp.id, 'Rejected', comp.name)}
                        className="px-3.5 py-1.5 rounded-lg border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-300 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(comp.id, 'Approved', comp.name)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Confirm & Approve</span>
                      </button>
                    </>
                  ) : isApproved ? (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        recentlyConfirmedCompIds.has(comp.id)
                          ? 'bg-emerald-500 text-white shadow-md border border-emerald-400 font-extrabold animate-pulse'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      }`}>
                        <CheckCircle className={`w-3.5 h-3.5 ${recentlyConfirmedCompIds.has(comp.id) ? 'text-white' : 'text-emerald-600'}`} />
                        <span>{recentlyConfirmedCompIds.has(comp.id) ? 'Confirmed! 🎉' : 'Confirmed ✓'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(comp.id, 'Rejected', comp.name)}
                        className="text-xs text-slate-500 hover:text-rose-600 underline font-medium cursor-pointer transition-colors"
                      >
                        Revoke / Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        recentlyRejectedCompIds.has(comp.id)
                          ? 'bg-rose-500 text-white shadow-md border border-rose-400 font-extrabold animate-pulse'
                          : 'bg-rose-50 text-rose-700 border border-rose-300'
                      }`}>
                        <XCircle className={`w-3.5 h-3.5 ${recentlyRejectedCompIds.has(comp.id) ? 'text-white' : 'text-rose-600'}`} />
                        <span>{recentlyRejectedCompIds.has(comp.id) ? 'Rejected! ✗' : 'Rejected ✗'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(comp.id, 'Approved', comp.name)}
                        className="text-xs text-slate-500 hover:text-emerald-600 underline font-medium cursor-pointer transition-colors"
                      >
                        Re-Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
