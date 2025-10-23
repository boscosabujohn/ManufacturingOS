'use client';

import { useMemo, useState } from 'react';
import { Calendar, Search, Filter, Download } from 'lucide-react';

type CalEvent = { id: string; title: string; resource: string; day: number; time: string; durationHrs: number; color: string };
const EVENTS: CalEvent[] = [
  { id: 'E1', title: 'Install - Tower A', resource: 'Sara Ali', day: 2, time: '10:00', durationHrs: 3, color: 'bg-teal-600' },
  { id: 'E2', title: 'Design Review', resource: 'Priya Patel', day: 3, time: '14:00', durationHrs: 2, color: 'bg-indigo-600' },
  { id: 'E3', title: 'Site Survey', resource: 'Rahul Kumar', day: 4, time: '09:00', durationHrs: 2, color: 'bg-amber-600' },
  { id: 'E4', title: 'Client Handover', resource: 'Amit Singh', day: 5, time: '16:00', durationHrs: 1, color: 'bg-emerald-600' },
];

export default function ResourceCalendarPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = useMemo(() => EVENTS.filter(e => [e.title, e.resource].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))), [searchTerm]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-teal-600" />
          Resource Calendar
        </h1>
        <p className="text-gray-600 mt-2">Resource availability and scheduling</p>
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
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm font-medium">Working Days</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">22</p>
            </div>
            <Calendar className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Available Hours</p>
              <p className="text-3xl font-bold text-green-900 mt-1">1,760</p>
            </div>
            <Calendar className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Allocated Hours</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">1,432</p>
            </div>
            <Calendar className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Utilization</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">81%</p>
            </div>
            <Calendar className="h-12 w-12 text-yellow-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Week grid: Mon-Sun */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 text-xs font-medium text-gray-600">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
            <div key={d} className="px-3 py-2 border-r last:border-r-0 border-gray-200">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[280px]">
          {Array.from({length:7}).map((_, col) => (
            <div key={col} className="border-r last:border-r-0 border-gray-200 p-2">
              <div className="space-y-2">
                {filtered.filter(e => e.day===col+1).map(e => (
                  <div key={e.id} className={`text-white ${e.color} rounded-md px-2 py-2 shadow-sm`}> 
                    <div className="text-xs font-semibold leading-tight">{e.time} • {e.title}</div>
                    <div className="text-[11px] opacity-90">{e.resource} • {e.durationHrs}h</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
