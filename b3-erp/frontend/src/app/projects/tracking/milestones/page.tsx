'use client';

import { useMemo, useState } from 'react';
import { Flag, Search, Filter, PlusCircle, Download, CalendarDays, Link2 } from 'lucide-react';

type Milestone = {
  id: string;
  title: string;
  project: string;
  owner: string;
  due: string;
  status: 'planned' | 'in_progress' | 'achieved' | 'overdue';
  progress: number;
  dependencies?: string[];
};

const MILESTONES: Milestone[] = [
  { id: 'MS-101', title: 'Design Sign-off', project: 'Kitchen Fitout - Tower A', owner: 'Priya Patel', due: '2025-10-21', status: 'achieved', progress: 100 },
  { id: 'MS-102', title: 'Material Procurement Complete', project: 'Luxury Villa Wardrobes', owner: 'Amit Singh', due: '2025-10-28', status: 'in_progress', progress: 65, dependencies: ['MS-101'] },
  { id: 'MS-103', title: 'Assembly Line Ready', project: 'Corporate Pantry Rollout', owner: 'Rahul Kumar', due: '2025-10-24', status: 'overdue', progress: 40 },
  { id: 'MS-104', title: 'QC Gate Pass', project: 'Showroom Refurbishment', owner: 'QC Team', due: '2025-11-05', status: 'planned', progress: 0, dependencies: ['MS-102'] },
];

export default function MilestonesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'planned'|'in_progress'|'achieved'|'overdue'>('all');
  const data = useMemo(() => MILESTONES.filter(m => {
    const matchSearch = [m.title, m.project, m.owner, m.id].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter==='all' ? true : m.status === statusFilter;
    return matchSearch && matchStatus;
  }), [searchTerm, statusFilter]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Flag className="h-8 w-8 text-teal-600" />
          Milestones
        </h1>
        <p className="text-gray-600 mt-2">Track key project milestones and deliverables</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search milestones..."
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
              Add Milestone
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Total Milestones</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">24</p>
            </div>
            <Flag className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Achieved</p>
              <p className="text-3xl font-bold text-green-900 mt-1">16</p>
            </div>
            <Flag className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Upcoming</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">5</p>
            </div>
            <Flag className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold text-red-900 mt-1">3</p>
            </div>
            <Flag className="h-12 w-12 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Milestones table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Milestone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Dependencies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{m.title}</span>
                      <span className="text-xs text-gray-500">{m.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.project}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.owner}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gray-500" /> {m.due}</td>
                  <td className="px-4 py-3">
                    <div className="w-40">
                      <div className="h-2 w-full bg-gray-100 rounded"><div className={`h-2 rounded ${m.progress>=100?'bg-green-600':m.progress>=50?'bg-blue-600':'bg-yellow-500'}`} style={{ width: `${m.progress}%` }} /></div>
                      <div className="mt-1 text-xs text-gray-600">{m.progress}%</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${m.status==='achieved'?'bg-green-50 text-green-700':m.status==='in_progress'?'bg-blue-50 text-blue-700':m.status==='planned'?'bg-gray-100 text-gray-700':'bg-red-50 text-red-700'}`}>{m.status.replace('_',' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {m.dependencies?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {m.dependencies.map(d => (
                          <span key={d} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs text-gray-700"><Link2 className="h-3 w-3" /> {d}</span>
                        ))}
                      </div>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
              {data.length===0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No milestones</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
