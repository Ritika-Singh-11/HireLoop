import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Download, 
  Printer, 
  Filter, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  Award,
  TrendingUp,
  BarChart3,
  Building2,
  GraduationCap
} from 'lucide-react';
import { api } from '../../services/api';

const SAMPLE_RECORDS = [
  { roll: '21BCSE104', name: 'Aarav Sharma', branch: 'Computer Science', batch: '2026', cgpa: 8.85, company: 'Zomato', package: '₹18.5 LPA', status: 'Placed' },
  { roll: '21BIT045', name: 'Priya Nambiar', branch: 'Information Technology', batch: '2026', cgpa: 9.12, company: 'Microsoft', package: '₹31.0 LPA', status: 'Placed' },
  { roll: '21BCSE012', name: 'Ananya Verma', branch: 'Computer Science', batch: '2026', cgpa: 8.42, company: 'Razorpay', package: '₹20.0 LPA', status: 'Placed' },
  { roll: '21BECE078', name: 'Rohan Gupta', branch: 'Electronics & Comm.', batch: '2026', cgpa: 7.65, company: 'Deloitte', package: '₹12.5 LPA', status: 'Placed' },
  { roll: '21BCSE089', name: 'Tanmay Saxena', branch: 'Computer Science', batch: '2026', cgpa: 8.95, company: 'Google', package: '₹48.0 LPA', status: 'Placed' },
  { roll: '21BIT018', name: 'Ishita Roy', branch: 'Information Technology', batch: '2026', cgpa: 8.25, company: 'Atlassian', package: '₹24.0 LPA', status: 'Placed' },
  { roll: '21BME044', name: 'Kunal Deshmukh', branch: 'Mechanical Engg.', batch: '2026', cgpa: 7.80, company: 'Tata Motors', package: '₹9.5 LPA', status: 'Placed' },
  { roll: '21BEE056', name: 'Sneha Patel', branch: 'Electrical Engg.', batch: '2026', cgpa: 8.10, company: 'L&T Technology', package: '₹8.8 LPA', status: 'Placed' },
  { roll: '21BCIV023', name: 'Aditya Joshi', branch: 'Civil Engg.', batch: '2026', cgpa: 7.40, company: 'L&T Construction', package: '₹7.8 LPA', status: 'Placed' }
];

export default function PlacementReports() {
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('2026');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [nirfReport, setNirfReport] = useState(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await api.getNirfReports();
        if (res?.report) {
          setNirfReport(res.report);
        }
      } catch (err) {
        console.warn('Using local reporting metrics fallback:', err);
      }
    }
    loadReports();
  }, []);

  const filteredRecords = useMemo(() => {
    return SAMPLE_RECORDS.filter(rec => {
      if (selectedBranch !== 'All' && !rec.branch.includes(selectedBranch)) return false;
      if (selectedBatch !== 'All' && rec.batch !== selectedBatch) return false;
      if (selectedCompany !== 'All' && rec.company !== selectedCompany) return false;
      return true;
    });
  }, [selectedBranch, selectedBatch, selectedCompany]);

  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Student Name', 'Branch', 'Batch', 'CGPA', 'Placed Company', 'Package Offered', 'Placement Status'];
    const rows = filteredRecords.map(r => [
      r.roll,
      `"${r.name}"`,
      `"${r.branch}"`,
      r.batch,
      r.cgpa,
      `"${r.company}"`,
      `"${r.package}"`,
      r.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Campus_Placement_Report_${selectedBranch}_${selectedBatch}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>NIRF & NAAC Accreditation Compliance</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Institutional Placement Reports & Export Suite
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter by engineering discipline, graduation cohort, or visiting employer, and export accredited datasets
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter by Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="All">All Disciplines</option>
              <option value="Computer Science">Computer Science (CSE)</option>
              <option value="Information Technology">Information Technology (IT)</option>
              <option value="Electronics">Electronics (ECE)</option>
              <option value="Mechanical">Mechanical (ME)</option>
              <option value="Electrical">Electrical (EE)</option>
              <option value="Civil">Civil (CE)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Graduation Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="2026">Batch 2026 (Current)</option>
              <option value="2025">Batch 2025 (Previous)</option>
              <option value="All">All Batches</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Company Filter</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="All">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Zomato">Zomato</option>
              <option value="Atlassian">Atlassian</option>
              <option value="Deloitte">Deloitte</option>
            </select>
          </div>
        </div>
      </div>

      {/* NIRF / NAAC Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Institutional Placement %</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {nirfReport ? `${nirfReport.placementRate}%` : '84.5%'}
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">541 of 640 candidates placed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Highest Campus CTC</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700 mt-1">
            {nirfReport ? nirfReport.highestPackage.split(' ')[0] : '₹48.0 LPA'}
          </div>
          <span className="text-xs text-indigo-600 font-semibold mt-0.5 block">Google • Software Engineer</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Average Compensation</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {nirfReport ? nirfReport.averagePackage : '₹14.2 LPA'}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-0.5 block">+18.5% YoY Growth</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Median NIRF Package</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-1">
            {nirfReport ? nirfReport.medianPackage : '₹12.8 LPA'}
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">For Accreditation Audit</span>
        </div>
      </div>

      {/* Branch-Wise Accreditation Table */}
      {nirfReport?.branchStats && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Department-Wise Placement Distribution (NIRF Metric)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Class of 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Department / Discipline</th>
                  <th className="p-3">Enrolled</th>
                  <th className="p-3">Placed</th>
                  <th className="p-3">Placement Rate</th>
                  <th className="p-3 text-right">Median CTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {nirfReport.branchStats.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">{b.branch}</td>
                    <td className="p-3 text-slate-600">{b.enrolled}</td>
                    <td className="p-3 text-slate-900 font-bold">{b.placed}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700">{b.percentage}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${b.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right font-black text-indigo-700">{b.medianCtc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Placement Record Roster — {selectedBranch === 'All' ? 'All Branches' : selectedBranch} ({selectedBatch})
            </h3>
            <p className="text-xs text-slate-500">Official Placement Office Transcript</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {filteredRecords.length} Students Placed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Roll No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5">CGPA</th>
                <th className="p-3.5">Company Placed</th>
                <th className="p-3.5">Package (CTC)</th>
                <th className="p-3.5 pr-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 pl-5 font-mono text-slate-900 font-bold">{r.roll}</td>
                  <td className="p-3.5 font-bold text-slate-900">{r.name}</td>
                  <td className="p-3.5 text-slate-600">{r.branch}</td>
                  <td className="p-3.5 text-slate-800 font-semibold">{r.cgpa}</td>
                  <td className="p-3.5 font-bold text-indigo-700">{r.company}</td>
                  <td className="p-3.5 font-extrabold text-emerald-700">{r.package}</td>
                  <td className="p-3.5 pr-5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.status}
                    </span>
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
