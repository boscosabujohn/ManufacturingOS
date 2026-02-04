'use client';

import React, { useState } from 'react';
import {
  Radio,
  MapPin,
  Clock,
  Users,
  Plus,
  ChevronRight,
  Calendar,
  Search,
  Filter,
  Zap,
  AlertCircle,
  MoreVertical,
  ArrowRight
} from 'lucide-react';

export default function ServiceDispatch() {
  const [view, setView] = useState<'board' | 'timeline'>('board');

  const dispatchJobs = [
    { id: 'DSP-881', client: 'Sharma Modulars', area: 'Okhla', tech: 'Rajesh K.', time: '09:30 AM', status: 'In Transit', priority: 'High' },
    { id: 'DSP-882', client: 'Prestige Dev', area: 'Gurugram', tech: 'Amit S.', time: '11:00 AM', status: 'Pending', priority: 'Medium' },
    { id: 'DSP-883', client: 'Urban Interiors', area: 'Noida', tech: 'Priya P.', time: '12:45 PM', status: 'Completed', priority: 'Low' },
  ];

  return (
    <div className="space-y-3">
      {/* Premium Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
            <Radio className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dispatch Command Center</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-0.5">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> 8 Technicians Online</span>
              <span>•</span>
              <span>42 Jobs Dispatched Today</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView('board')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'board' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Board
            </button>
            <button
              onClick={() => setView('timeline')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'timeline' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Timeline
            </button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all shadow-lg active:scale-95">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Urgent Queue Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-slate-900 rounded-2xl p-3 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Urgent Dispatch
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'TKT-9922', client: 'Taj Hotels', issue: 'Gas Leakage System', time: '10m ago' },
                  { id: 'TKT-9925', client: 'DLF CyberCity', issue: 'Central HVAC Failure', time: '25m ago' },
                ].map((urgent, idx) => (
                  <div key={idx} className="bg-white/10 hover:bg-white/15 transition-all p-3 rounded-xl border border-white/10 cursor-pointer group/item">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-amber-400 tracking-widest">{urgent.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{urgent.time}</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{urgent.client}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{urgent.issue}</p>
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">Quick Assign</span>
                      <ArrowRight className="h-3 w-3 text-blue-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Radio className="absolute -right-8 -bottom-8 h-32 w-32 text-blue-500/20 pointer-events-none" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
            <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-tight">Active Dispatches</h3>
            <div className="space-y-2">
              {[
                { label: 'En-route', count: 12, color: 'blue' },
                { label: 'On-site', count: 18, color: 'green' },
                { label: 'Paused', count: 3, color: 'amber' },
                { label: 'Return', count: 5, color: 'purple' },
              ].map((status, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{status.label}</span>
                  <span className={`px-2.5 py-0.5 bg-${status.color}-50 text-${status.color}-600 rounded-full text-xs font-black`}>{status.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Dispatch Board */}
        <div className="lg:col-span-3 space-y-3">
          {/* Filters Bar */}
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search client, tech, or job ID..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Today
              </button>
              <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                All Techs
              </button>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2">Job Info</th>
                    <th className="px-3 py-2">Client / Area</th>
                    <th className="px-3 py-2">Technician</th>
                    <th className="px-3 py-2">Schedule</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dispatchJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${job.priority === 'High' ? 'bg-red-50 text-red-500' :
                              job.priority === 'Medium' ? 'bg-blue-50 text-blue-500' :
                                'bg-slate-50 text-slate-400'
                            }`}>
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-slate-900">{job.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{job.client}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{job.area}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                            {job.tech.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{job.tech}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Clock className="h-3.5 w-3.5" />
                          {job.time}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            job.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                          }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 md:flex items-center justify-between border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-2 md:mb-0">Showing 3 of 42 dispatches for Oct 24, 2025</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Previous</button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
