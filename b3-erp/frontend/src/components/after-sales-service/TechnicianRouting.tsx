'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Route,
  Users,
  Navigation,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
  Map as MapIcon,
  Layers
} from 'lucide-react';

export default function TechnicianRouting() {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const technicians = [
    { id: 'T1', name: 'Rajesh Kumar', status: 'On Job', location: 'Okhla Phase III', efficiency: 98, jobs: 4, avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=100&h=100' },
    { id: 'T2', name: 'Amit Sharma', status: 'Traveling', location: 'Gurugram Sec 44', efficiency: 92, jobs: 3, avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=100&h=100' },
    { id: 'T3', name: 'Priya Patel', status: 'Idle', location: 'Noida Sector 62', efficiency: 95, jobs: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100' },
  ];

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Route className="h-6 w-6 text-green-600" />
            </div>
            Technician Routing & Dispatch
          </h2>
          <p className="text-slate-500 mt-1">AI-powered route optimization and real-time field tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold shadow-lg transition-all ${isOptimizing ? 'bg-slate-100 text-slate-400' : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              }`}
          >
            {isOptimizing ? (
              <>
                <Zap className="h-4 w-4 animate-pulse" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Optimize All Routes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Technicians', value: '45', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2 this week' },
          { label: 'Active Routes', value: '128', icon: Route, color: 'text-green-600', bg: 'bg-green-50', trend: '98% efficiency' },
          { label: 'Avg. Travel Time', value: '24m', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-12% improved' },
          { label: 'Fuel Saved', value: '15%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Last 30 days' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 group hover:border-green-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-3 ${stat.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.trend}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Map Representation */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative shadow-2xl border-4 border-white">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-40">
              <svg className="w-full h-full" viewBox="0 0 800 450">
                <path d="M0,100 L800,100 M0,200 L800,200 M0,300 L800,300 M100,0 L100,450 M200,0 L200,450 M300,0 L300,450 M400,0 L400,450 M500,0 L500,450 M600,0 L600,450 M700,0 L700,450" stroke="#334155" strokeWidth="1" />
                <circle cx="150" cy="150" r="2" fill="#4ade80" />
                <circle cx="450" cy="250" r="2" fill="#4ade80" />
                <circle cx="650" cy="120" r="2" fill="#4ade80" />
              </svg>
            </div>

            {/* Map UI Overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <button className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg text-slate-800"><MapIcon className="h-4 w-4" /></button>
              <button className="bg-slate-800/90 backdrop-blur p-2 rounded-lg shadow-lg text-white"><Layers className="h-4 w-4" /></button>
            </div>

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-xs font-bold text-slate-800">42 Field Units Online</span>
            </div>

            {/* Technicians on Map */}
            {technicians.map((tech, idx) => (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: idx === 0 ? '30%' : idx === 1 ? '65%' : '80%',
                  top: idx === 0 ? '40%' : idx === 1 ? '70%' : '30%'
                }}
              >
                <div className="bg-white p-1 rounded-full shadow-xl border-2 border-green-500 relative">
                  <img src={tech.avatar} alt={tech.name} className="w-8 h-8 rounded-full" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white p-2 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-bold">{tech.name}</p>
                  <p className="text-slate-400">{tech.location}</p>
                </div>
              </div>
            ))}

            {/* Path visualization */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M240,180 Q350,250 520,315"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-[dash_10s_linear_infinite]"
              />
              <path
                d="M520,315 Q600,200 640,135"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>

          {/* Quick Assignments */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Unassigned High-Priority Jobs</h3>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black">ACTION REQUIRED</span>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { id: 'JOB-992', title: 'Compressor Repair', loc: 'Dwarka Sec 10', due: 'In 45m', client: 'Modern Kitchens' },
                { id: 'JOB-995', title: 'Safety Audit', loc: 'Mayur Vihar', due: 'In 1h 20m', client: 'PVR Cinemas' },
              ].map((job, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-slate-100 rounded-lg"><Navigation className="h-4 w-4 text-slate-400" /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{job.title}</p>
                      <p className="text-xs text-slate-500">{job.loc} • {job.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {job.due}
                    </span>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technician Leaderboard / List */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Technician Status
            </h3>
            <div className="space-y-3">
              {technicians.map((tech) => (
                <div key={tech.id} className="group">
                  <div className="flex items-center gap-2 mb-3">
                    <img src={tech.avatar} alt={tech.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-green-500 transition-all" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">{tech.name}</h4>
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {tech.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-slate-400">EFFICIENCY SCORE</span>
                    <span className="text-green-600">{tech.efficiency}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${tech.efficiency}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${tech.status === 'On Job' ? 'bg-blue-100 text-blue-700' :
                        tech.status === 'Traveling' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-500'
                      }`}>
                      {tech.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{tech.jobs} jobs completed today</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
              View All Technicians
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Efficiency Insights */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-3 rounded-2xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Zap className="h-5 w-5 text-indigo-300" />
              </div>
              <h3 className="font-bold">AI Route Insights</h3>
            </div>
            <p className="text-indigo-100 text-sm mb-2 leading-relaxed">
              Merging Routes 4 & 12 could save <span className="text-green-400 font-bold">18kg CO2</span> and reduce travel time by 15% today.
            </p>
            <button className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition-colors text-sm">
              Apply Smart Merge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
