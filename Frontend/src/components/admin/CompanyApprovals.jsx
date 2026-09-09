import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';
import { Building, CheckCircle, XCircle, ShieldCheck, ExternalLink, Mail, MapPin } from 'lucide-react';

export default function CompanyApprovals() {
  const { companies, approveCompany, rejectCompany, showToast } = useApp();
  const [backendCompanies, setBackendCompanies] = useState([]);

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

  const allCompanies = backendCompanies.length > 0
    ? backendCompanies.map(bc => ({
        ...bc,
        id: bc._id || bc.id,
        registeredAt: bc.registeredAt || (bc.createdAt ? new Date(bc.createdAt).toISOString().split('T')[0] : '2026-09-01')
      }))
    : companies;

  const handleStatusChange = async (companyId, newStatus) => {
    if (newStatus === 'Approved') {
      approveCompany(companyId);
    } else {
      rejectCompany(companyId);
    }

    setBackendCompanies(prev => prev.map(c => (c._id === companyId || c.id === companyId) ? { ...c, status: newStatus } : c));

    try {
      await api.updateCompanyStatus(companyId, newStatus);
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
                        onClick={() => handleStatusChange(comp.id, 'Rejected')}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusChange(comp.id, 'Approved')}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Approve
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(comp.id, isApproved ? 'Rejected' : 'Approved')}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                    >
                      {isApproved ? 'Revoke Approval' : 'Re-Approve'}
                    </button>
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
