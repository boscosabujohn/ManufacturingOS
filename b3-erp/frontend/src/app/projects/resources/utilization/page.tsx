'use client';

import { useMemo, useState } from 'react';
import { PieChart, Search, Filter, Download, TrendingUp, User, Briefcase } from 'lucide-react';

type Resource = {
  id: string;
  name: string;
  role: string;
  dept: string;
  utilization: number; // 0-100
  billablePct: number; // 0-100
  projects: number;
};

const RESOURCES: Resource[] = [
  { id: 'E-101', name: 'Amit Singh', role: 'Project Manager', dept: 'Projects', utilization: 82, billablePct: 90, projects: 4 },
  { id: 'E-214', name: 'Priya Patel', role: 'Designer', dept: 'Design', utilization: 65, billablePct: 80, projects: 3 },
  { id: 'E-307', name: 'Rahul Kumar', role: 'Engineer', dept: 'Engineering', utilization: 92, billablePct: 95, projects: 5 },
  { id: 'E-118', name: 'Sara Ali', role: 'Installer', dept: 'Installation', utilization: 48, billablePct: 60, projects: 2 },
  { id: 'E-512', name: 'Vikram Reddy', role: 'Developer', dept: 'IT', utilization: 71, billablePct: 30, projects: 2 },
];

export default function ResourceUtilizationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const depts = useMemo(() => ['all', ...Array.from(new Set(RESOURCES.map(r => r.dept)))], []);
  const filtered = useMemo(() => RESOURCES.filter(r => {
    const matchesSearch = [r.name, r.role, r.dept, r.id].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = deptFilter === 'all' ? true : r.dept === deptFilter;
    return matchesSearch && matchesDept;
  }), [searchTerm, deptFilter]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <PieChart className="h-8 w-8 text-teal-600" />
          Resource Utilization
        </h1>
        <p className="text-gray-600 mt-2">Resource usage analytics and optimization</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search resources..."
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
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Avg. Utilization</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">78%</p>
            </div>
            <PieChart className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Optimal (70-85%)</p>
              <p className="text-3xl font-bold text-green-900 mt-1">68</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Under-utilized</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">24</p>
            </div>
            <PieChart className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Over-utilized</p>
              <p className="text-3xl font-bold text-red-900 mt-1">12</p>
            </div>
            <PieChart className="h-12 w-12 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <select value={deptFilter} onChange={(e)=>setDeptFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            {depts.map(d => <option key={d} value={d}>{d==='all'?'All Departments':d}</option>)}
          </select>
          <button className="ml-auto px-3 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"><Download className="h-4 w-4" /> Export</button>
        </div>
      </div>

      {/* Resource table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Role/Dept</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Utilization</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Billable</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-500" /><div className="flex flex-col"><span className="font-medium text-gray-900">{r.name}</span><span className="text-xs text-gray-500">{r.id}</span></div></div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.role} • {r.dept}</td>
                  <td className="px-4 py-3">
                    <div className="w-44">
                      <div className="h-2 w-full bg-gray-100 rounded"><div className={`h-2 rounded ${r.utilization>85?'bg-red-500':r.utilization<60?'bg-yellow-500':'bg-green-600'}`} style={{ width: `${r.utilization}%` }} /></div>
                      <div className="mt-1 text-xs text-gray-600">{r.utilization}%</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-44">
                      <div className="h-2 w-full bg-gray-100 rounded"><div className="h-2 rounded bg-indigo-500" style={{ width: `${r.billablePct}%` }} /></div>
                      <div className="mt-1 text-xs text-gray-600">{r.billablePct}% billable</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 flex items-center gap-2"><Briefcase className="h-4 w-4 text-gray-500" /> {r.projects}</td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No resources</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
