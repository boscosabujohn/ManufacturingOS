'use client';

import { useMemo, useState } from 'react';
import { Users, Search, Filter, PlusCircle, Download, AlertTriangle, ChevronRight } from 'lucide-react';

type Res = { id: string; name: string; role: string; dept: string; utilization: number };
const TOP_OVER: Res[] = [
  { id: 'E-307', name: 'Rahul Kumar', role: 'Engineer', dept: 'Engineering', utilization: 92 },
  { id: 'E-101', name: 'Amit Singh', role: 'Project Manager', dept: 'Projects', utilization: 88 },
  { id: 'E-512', name: 'Vikram Reddy', role: 'Developer', dept: 'IT', utilization: 86 },
];

export default function ResourceAllocationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const list = useMemo(() => TOP_OVER, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="h-8 w-8 text-teal-600" />
          Resource Allocation
        </h1>
        <p className="text-gray-600 mt-2">Allocate and manage project resources</p>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <PlusCircle className="h-4 w-4" />
              Allocate Resource
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Total Resources</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">142</p>
            </div>
            <Users className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Allocated</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">98</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Available</p>
              <p className="text-3xl font-bold text-green-900 mt-1">44</p>
            </div>
            <Users className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Over-allocated</p>
              <p className="text-3xl font-bold text-red-900 mt-1">6</p>
            </div>
            <Users className="h-12 w-12 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <a href="/projects/resources/utilization" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">78%</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Avg. across active resources</p>
        </a>
        <a href="/projects/resources/team" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">68</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Across 12 departments</p>
        </a>
        <a href="/projects/resources/calendar" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bookings This Week</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">112</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Meetings, installs, surveys</p>
        </a>
      </div>

      {/* Overutilized list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <h3 className="font-semibold text-gray-800">Top Overutilized Resources</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {list.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{r.name} <span className="text-gray-400">({r.id})</span></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.dept}</td>
                  <td className="px-4 py-3">
                    <div className="w-40">
                      <div className="h-2 w-full bg-gray-100 rounded"><div className={`h-2 rounded ${r.utilization>85?'bg-red-500':'bg-yellow-500'}`} style={{ width: `${r.utilization}%` }} /></div>
                      <div className="mt-1 text-xs text-gray-600">{r.utilization}%</div>
                    </div>
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
