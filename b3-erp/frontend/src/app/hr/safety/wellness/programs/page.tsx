'use client';

import React, { useState } from 'react';
import {
  Heart,
  Search,
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Award,
  ChevronRight,
  ArrowRight,
  Dumbbell,
  Brain,
  Apple,
  Sparkles,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';

// Mock Data
const activePrograms = [
  {
    id: 'PRG-001',
    title: 'Precision Focus: Mental Reset',
    icon: Brain,
    category: 'Mental Health',
    participants: 124,
    status: 'In Progress',
    impact: 'High',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'PRG-002',
    title: 'Manufacturing Marathon',
    icon: Dumbbell,
    category: 'Physical Fitness',
    participants: 450,
    status: 'In Progress',
    impact: 'Extreme',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'PRG-003',
    title: 'Nutrition for Night Shifts',
    icon: Apple,
    category: 'Nutrition',
    participants: 85,
    status: 'Upcoming',
    impact: 'Medium',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'PRG-004',
    title: 'Mindful Machining',
    icon: Sparkles,
    category: 'Mental Health',
    participants: 62,
    status: 'In Progress',
    impact: 'Medium',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
];

const engagementStats = {
  totalEnrolled: 842,
  activeChallenges: 2,
  avgParticipation: 78,
  wellnessPoints: '12,450'
};

export default function WellnessProgramsPage() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-orange-600" />
            Corporate Wellness Initiatives
          </h1>
          <p className="text-gray-500 mt-1">Strategic health programs and employee engagement challenges for a thriving workplace</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Launch Program
        </button>
      </div>

      {/* Engagement Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Enrollment</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{engagementStats.totalEnrolled}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-[10px] text-green-600 mt-4 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3 h-3" /> 12% increase this quarter
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Challenges</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{engagementStats.activeChallenges}</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Award className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 italic font-medium">Next starting in 4 days</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Participation</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{engagementStats.avgParticipation}%</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: `${engagementStats.avgParticipation}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-purple-100 border-2 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Site Wellness Points</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{engagementStats.wellnessPoints}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-[10px] text-purple-600 mt-4 font-bold uppercase tracking-tighter cursor-pointer hover:underline">View Rewards Shop</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Hero: Active Challenge */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10">
              <div className="inline-flex items-center px-2 py-0.5 rounded bg-orange-600 text-[10px] font-black uppercase tracking-widest mb-6">Featured Challenge</div>
              <h2 className="text-4xl font-black italic tracking-tighter leading-tight uppercase max-w-lg mb-4">
                The 30-Day <span className="text-orange-500 underline decoration-white">Ergo-Active</span> Industrial Sprint
              </h2>
              <p className="text-gray-400 text-sm max-w-sm font-medium leading-relaxed italic">
                Complete ergonomic checks and reach 10,000 steps daily to unlock the "Industrial Athlete" badge and corporate rewards.
              </p>
            </div>

            <div className="relative z-10 mt-10">
              <div className="flex items-center gap-8 mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Participants</span>
                  <span className="text-xl font-bold tracking-tighter">1,240+</span>
                </div>
                <div className="h-10 w-px bg-gray-800"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Days Left</span>
                  <span className="text-xl font-bold tracking-tighter">12</span>
                </div>
              </div>
              <button className="px-10 py-3 bg-white text-gray-900 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl flex items-center gap-3">
                Join Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <Award className="absolute -bottom-10 -right-10 w-64 h-64 text-orange-500 opacity-10 rotate-12" />
          </div>

          {/* Active Programs Directory */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-xs text-gray-900 uppercase tracking-widest">Active & Upcoming Programs</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search programs..." className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {activePrograms.map((prg) => (
                <div key={prg.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className="flex gap-4">
                    <div className={`p-4 rounded-xl ${prg.bgColor} ${prg.color}`}>
                      <prg.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-gray-900 uppercase tracking-tighter text-base group-hover:text-orange-600 transition-colors underline decoration-transparent group-hover:decoration-orange-200">{prg.title}</h4>
                        <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">{prg.category}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">
                        <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {prg.participants} Enrolled</span>
                        <span className="flex items-center gap-1.5"><TrendingUp className={`w-3 h-3 ${prg.impact === 'Extreme' ? 'text-red-500' : 'text-blue-400'}`} /> {prg.impact} Impact</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${prg.status === 'In Progress' ? 'text-green-600' : 'text-orange-500'}`}>{prg.status}</span>
                      <p className="text-[9px] text-gray-400 mt-1 italic">Starts: June 15</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center italic">
              <button className="text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-widest">View Program Analytics</button>
            </div>
          </div>
        </div>

        {/* Impact Analysis & Upcoming */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <h3 className="font-bold text-gray-900 mb-6 text-xs uppercase tracking-widest flex items-center justify-between">
              Wellness Impact Score <TrendingUp className="w-4 h-4 text-green-500" />
            </h3>
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="88" className="text-orange-600" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">82</span>
                  <p className="text-[9px] text-gray-400 uppercase font-black">Overall Score</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Psychological Safety', score: 88, color: 'bg-purple-500' },
                { label: 'Physical Vitality', score: 72, color: 'bg-blue-500' },
                { label: 'Nutritional Balance', score: 65, color: 'bg-green-500' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>{stat.label}</span>
                    <span>{stat.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color}`} style={{ width: `${stat.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              Upcoming Sessions
            </h3>
            <div className="space-y-6">
              {[
                { time: '14:00', title: 'Ergonomic Workshop', room: 'Conf Room C' },
                { time: '16:30', title: 'Weekly Yoga Flow', room: 'Gym Suite' }
              ].map((sesh, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-gray-900 italic tracking-tighter leading-none">{sesh.time}</span>
                    <div className="w-px h-full bg-gray-100 my-1 group-last:hidden"></div>
                  </div>
                  <div className="pb-6">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors italic leading-none mb-1">{sesh.title}</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">{sesh.room}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2 border border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:border-orange-200 hover:text-orange-600 transition-all">View Full Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
}
