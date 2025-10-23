'use client';

import { useMemo, useState } from 'react';
import { FileText, Search, Filter, PlusCircle, Download, Calendar, User, CheckCircle, Clock } from 'lucide-react';

type Report = {
  id: string;
  title: string;
  project: string;
  projectCode: string;
  status: 'draft' | 'submitted' | 'approved';
  period: string; // e.g. 2025-W42 or Oct 2025
  author: string;
  createdAt: string;
};

const MOCK_REPORTS: Report[] = Array.from({ length: 22 }).map((_, i) => ({
  id: `RPT-${100 + i}`,
  title: i % 3 === 0 ? 'Weekly Status - Execution' : i % 3 === 1 ? 'Risk & Issues Update' : 'Milestone Progress',
  project: i % 2 === 0 ? 'Kitchen Fitout - Tower A' : 'Luxury Villa Wardrobes',
  projectCode: i % 2 === 0 ? 'KF-A' : 'LVW-09',
  status: (['draft', 'submitted', 'approved'] as const)[i % 3],
  period: `2025-W${(40 + (i % 6)).toString().padStart(2, '0')}`,
  author: i % 2 === 0 ? 'Amit Singh' : 'Priya Patel',
  createdAt: `2025-10-${(10 + (i % 10)).toString().padStart(2, '0')}`,
}));

export default function StatusReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'submitted' | 'approved'>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const authors = useMemo(() => ['all', ...Array.from(new Set(MOCK_REPORTS.map(r => r.author)))], []);
  const filtered = useMemo(() => {
    return MOCK_REPORTS.filter(r => {
      const matchesSearch = [r.title, r.project, r.projectCode, r.author, r.period].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      const matchesAuthor = authorFilter === 'all' ? true : r.author === authorFilter;
      return matchesSearch && matchesStatus && matchesAuthor;
    });
  }, [searchTerm, statusFilter, authorFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-8 w-8 text-teal-600" />
          Status Reports
        </h1>
        <p className="text-gray-600 mt-2">Project status and progress reports</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <PlusCircle className="h-4 w-4" />
              Create Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Total Reports</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">156</p>
            </div>
            <FileText className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">12</p>
            </div>
            <FileText className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Published</p>
              <p className="text-3xl font-bold text-green-900 mt-1">142</p>
            </div>
            <FileText className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Draft</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">14</p>
            </div>
            <FileText className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 mr-auto">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filters</span>
          </div>
          <select value={statusFilter} onChange={(e)=>{setStatusFilter(e.target.value as any); setPage(1);}} className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
          </select>
          <select value={authorFilter} onChange={(e)=>{setAuthorFilter(e.target.value); setPage(1);}} className="px-3 py-2 border rounded-lg text-sm">
            {authors.map(a => <option key={a} value={a}>{a==='all'?'All Authors':a}</option>)}
          </select>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg" onClick={()=>{setStatusFilter('all'); setAuthorFilter('all'); setSearchTerm(''); setPage(1);}}>Reset</button>
        </div>
      </div>

      {/* Reports table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Report</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Period</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pageData.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{r.title}</span>
                      <span className="text-xs text-gray-500">{r.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.project} <span className="text-gray-400">({r.projectCode})</span></td>
                  <td className="px-4 py-3 text-sm text-gray-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-500" /> {r.period}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 flex items-center gap-2"><User className="h-4 w-4 text-gray-500" /> {r.author}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${r.status==='approved'?'bg-green-50 text-green-700':r.status==='submitted'?'bg-blue-50 text-blue-700':'bg-yellow-50 text-yellow-700'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-gray-700 hover:text-gray-900 text-sm flex items-center gap-1"><FileText className="h-4 w-4" /> View</button>
                      <button className="text-teal-700 hover:text-teal-900 text-sm flex items-center gap-1"><Download className="h-4 w-4" /> PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No reports</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">Showing {(page-1)*pageSize + 1}-{Math.min(page*pageSize, filtered.length)} of {filtered.length}</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded disabled:opacity-50" onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1}>Prev</button>
            <div className="px-2 text-sm">{page} / {totalPages}</div>
            <button className="px-3 py-1 text-sm border rounded disabled:opacity-50" onClick={()=>setPage(Math.min(totalPages,page+1))} disabled={page===totalPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
