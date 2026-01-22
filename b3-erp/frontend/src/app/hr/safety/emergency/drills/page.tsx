'use client';

import React, { useState } from 'react';
import {
  Bell,
  Search,
  Plus,
  Calendar,
  Clock,
  Users,
  Timer,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  ArrowUpRight,
  MoreVertical,
  ChevronRight,
  Info,
  MapPin
} from 'lucide-react';

// Mock Data
const drillStats = {
  averageTime: '3m 42s',
  participationRate: 98.2,
  drillsThisYear: 6,
  successRate: 100
};

const drillHistory = [
  {
    id: 'DRL-2024-004',
    type: 'Full Plant Evacuation',
    date: '2024-03-12',
    startTime: '10:00 AM',
    duration: '3m 15s',
    participants: 452,
    rating: 'Exceeds Expectations',
    status: 'Completed'
  },
  {
    id: 'DRL-2024-003',
    type: 'Admin Block Fire Drill',
    date: '2024-02-05',
    startTime: '02:30 PM',
    duration: '2m 45s',
    participants: 84,
    rating: 'Satisfactory',
    status: 'Completed'
  },
  {
    id: 'DRL-2024-002',
    type: 'Chemical Leak Simulation',
    date: '2024-01-18',
    startTime: '11:15 AM',
    duration: '5m 10s',
    participants: 120,
    rating: 'Satisfactory',
    status: 'Completed'
  },
  {
    id: 'DRL-2023-015',
    type: 'Night Shift Evacuation',
    date: '2023-12-04',
    startTime: '01:00 AM',
    duration: '4m 05s',
    participants: 65,
    rating: 'Needs Improvement',
    status: 'Completed'
  }
];

export default function EvacuationDrillsPage() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-8 w-8 text-orange-600" />
            Evacuation Drills & Exercises
          </h1>
          <p className="text-gray-500 mt-1">Manage scheduled safety exercises, track performance metrics, and log regulatory compliance</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Drill
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Evacuation Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{drillStats.averageTime}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Timer className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-[10px] text-green-600 mt-4 flex items-center gap-1 font-bold italic">
            <TrendingDown className="w-3 h-3" /> 12s faster than previous avg
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Participation Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{drillStats.participationRate}%</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: `${drillStats.participationRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drills (YTD)</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{drillStats.drillsThisYear}</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-tighter">Next scheduled: <span className="text-orange-600 font-bold">April 15</span></p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Regulatory Compliance</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">100%</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 font-medium italic">OSHA Category A Compliant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drill History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setFilter('All')}
                  className={`text-xs font-bold pb-2 border-b-2 transition-colors ${filter === 'All' ? 'border-orange-600 text-gray-900' : 'border-transparent text-gray-400'}`}
                >
                  Recent Activity
                </button>
                <button
                  onClick={() => setFilter('Upcoming')}
                  className={`text-xs font-bold pb-2 border-b-2 transition-colors ${filter === 'Upcoming' ? 'border-orange-600 text-gray-900' : 'border-transparent text-gray-400'}`}
                >
                  Upcoming Schedule
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Drill Type & ID</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4 text-center">Duration</th>
                    <th className="px-6 py-4">Performance Rating</th>
                    <th className="px-6 py-4 text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  {drillHistory.map((drill) => (
                    <tr key={drill.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors uppercase">{drill.type}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 tracking-tighter">{drill.id} · {drill.participants} Enrolled</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{drill.date}</div>
                        <div className="text-[10px] text-gray-400">{drill.startTime}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs text-gray-600 flex items-center justify-center gap-1.5 font-black italic">
                          <Timer className="w-3.5 h-3.5 text-blue-400" /> {drill.duration}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${drill.rating === 'Exceeds Expectations' ? 'bg-green-50 text-green-700' :
                            drill.rating === 'Satisfactory' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                          }`}>
                          {drill.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-center">
              <button className="text-xs font-bold text-orange-600 hover:underline">View Comprehensive Historical Archive</button>
            </div>
          </div>
        </div>

        {/* Sidebar: Next Up & Observations */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-xl text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Next Drill Session</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Administrative Block A</h3>
            <p className="text-xs text-gray-400 flex items-center gap-2 mb-6 italic">
              <MapPin className="w-3.5 h-3.5 text-orange-600" /> Primary Assembly Point: East Lawn
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-800">
                <span className="text-gray-400">Scheduled Date</span>
                <span className="font-bold">April 15, 2024</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-800">
                <span className="text-gray-400">Response Team</span>
                <span className="font-bold">Team Omega</span>
              </div>
            </div>

            <button className="w-full py-2 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors shadow-md flex items-center justify-center gap-2">
              View Readiness Checklist <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Key Observations
            </h3>
            <div className="space-y-4">
              {[
                { text: 'Assembly Point B signage needs replacement.', priority: 'Medium' },
                { text: 'Stairwell 4 lighting flickering during evacuation.', priority: 'High' }
              ].map((obs, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${obs.priority === 'High' ? 'bg-red-500' : 'bg-orange-500'}`} />
                  <div>
                    <p className="text-[11px] text-gray-600 leading-relaxed font-medium italic">{obs.text}</p>
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-1 inline-block">{obs.priority} Priority</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-1">
              View All Observations <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
