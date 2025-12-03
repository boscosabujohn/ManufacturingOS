'use client';

import { useState } from 'react';
import { Users, TrendingUp, Target, Activity, Award, Clock, Phone, Mail, Calendar, MessageSquare, CheckCircle, BarChart3 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  dealsWon: number;
  revenue: number;
  quota: number;
  quotaAttainment: number;
  activePipeline: number;
  pipelineValue: number;
  avgDealSize: number;
  winRate: number;
  salesCycle: number;
  activities: {
    calls: number;
    emails: number;
    meetings: number;
    tasks: number;
  };
  performance: 'excellent' | 'good' | 'needs_improvement';
}

interface ActivityMetric {
  type: string;
  total: number;
  target: number;
  percentage: number;
}

export default function TeamAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [sortBy, setSortBy] = useState<'revenue' | 'quota' | 'winRate'>('revenue');

  // Team Members Data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Senior Sales Executive',
      dealsWon: 34,
      revenue: 950000,
      quota: 900000,
      quotaAttainment: 105.6,
      activePipeline: 28,
      pipelineValue: 450000,
      avgDealSize: 27941,
      winRate: 42.5,
      salesCycle: 38,
      activities: { calls: 285, emails: 892, meetings: 67, tasks: 156 },
      performance: 'excellent',
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'MC',
      role: 'Sales Executive',
      dealsWon: 28,
      revenue: 780000,
      quota: 800000,
      quotaAttainment: 97.5,
      activePipeline: 24,
      pipelineValue: 380000,
      avgDealSize: 27857,
      winRate: 38.9,
      salesCycle: 42,
      activities: { calls: 267, emails: 845, meetings: 58, tasks: 142 },
      performance: 'good',
    },
    {
      id: '3',
      name: 'David Park',
      avatar: 'DP',
      role: 'Sales Executive',
      dealsWon: 27,
      revenue: 720000,
      quota: 750000,
      quotaAttainment: 96.0,
      activePipeline: 22,
      pipelineValue: 420000,
      avgDealSize: 26667,
      winRate: 36.5,
      salesCycle: 45,
      activities: { calls: 248, emails: 798, meetings: 54, tasks: 138 },
      performance: 'good',
    },
    {
      id: '4',
      name: 'Emily Davis',
      avatar: 'ED',
      role: 'Sales Executive',
      dealsWon: 22,
      revenue: 620000,
      quota: 700000,
      quotaAttainment: 88.6,
      activePipeline: 19,
      pipelineValue: 340000,
      avgDealSize: 28182,
      winRate: 33.8,
      salesCycle: 48,
      activities: { calls: 234, emails: 756, meetings: 49, tasks: 125 },
      performance: 'good',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      avatar: 'RW',
      role: 'Junior Sales Executive',
      dealsWon: 19,
      revenue: 540000,
      quota: 650000,
      quotaAttainment: 83.1,
      activePipeline: 17,
      pipelineValue: 290000,
      avgDealSize: 28421,
      winRate: 31.7,
      salesCycle: 52,
      activities: { calls: 212, emails: 698, meetings: 42, tasks: 115 },
      performance: 'needs_improvement',
    },
  ];

  // Team-wide Activity Metrics
  const teamActivities: ActivityMetric[] = [
    { type: 'Calls', total: 1246, target: 1200, percentage: 103.8 },
    { type: 'Emails', total: 3989, target: 3500, percentage: 113.9 },
    { type: 'Meetings', total: 270, target: 300, percentage: 90.0 },
    { type: 'Tasks Completed', total: 676, target: 700, percentage: 96.6 },
  ];

  // Team Performance Overview
  const teamStats = {
    totalRevenue: teamMembers.reduce((sum, m) => sum + m.revenue, 0),
    totalQuota: teamMembers.reduce((sum, m) => sum + m.quota, 0),
    avgQuotaAttainment: Math.round(teamMembers.reduce((sum, m) => sum + m.quotaAttainment, 0) / teamMembers.length),
    totalDealsWon: teamMembers.reduce((sum, m) => sum + m.dealsWon, 0),
    avgWinRate: Math.round(teamMembers.reduce((sum, m) => sum + m.winRate, 0) / teamMembers.length * 10) / 10,
    avgSalesCycle: Math.round(teamMembers.reduce((sum, m) => sum + m.salesCycle, 0) / teamMembers.length),
    activePipeline: teamMembers.reduce((sum, m) => sum + m.activePipeline, 0),
    pipelineValue: teamMembers.reduce((sum, m) => sum + m.pipelineValue, 0),
  };

  const sortedMembers = [...teamMembers].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.revenue - a.revenue;
      case 'quota':
        return b.quotaAttainment - a.quotaAttainment;
      case 'winRate':
        return b.winRate - a.winRate;
      default:
        return 0;
    }
  });

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-700';
      case 'good': return 'bg-blue-100 text-blue-700';
      case 'needs_improvement': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPerformanceLabel = (performance: string) => {
    return performance.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex gap-2 mb-6">
          {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Team Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <Users className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{teamMembers.length}</div>
            <div className="text-green-100">Team Members</div>
            <div className="text-sm mt-2 opacity-90">
              ${(teamStats.totalRevenue / 1000000).toFixed(2)}M total revenue
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <Target className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{teamStats.avgQuotaAttainment}%</div>
            <div className="text-blue-100">Avg Quota Attainment</div>
            <div className="text-sm mt-2 opacity-90">
              ${(teamStats.totalRevenue / 1000).toFixed(0)}K / ${(teamStats.totalQuota / 1000).toFixed(0)}K
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <Award className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">{teamStats.avgWinRate}%</div>
            <div className="text-purple-100">Avg Win Rate</div>
            <div className="text-sm mt-2 opacity-90">
              {teamStats.totalDealsWon} deals won
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <TrendingUp className="w-8 h-8 opacity-80 mb-2" />
            <div className="text-3xl font-bold mb-1">${(teamStats.pipelineValue / 1000000).toFixed(2)}M</div>
            <div className="text-orange-100">Active Pipeline</div>
            <div className="text-sm mt-2 opacity-90">
              {teamStats.activePipeline} deals in pipeline
            </div>
          </div>
        </div>

        {/* Team Activity Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Team Activity Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {teamActivities.map((activity, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900">{activity.type}</span>
                  <span className={`font-semibold ${
                    activity.percentage >= 100 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {activity.total} / {activity.target}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      activity.percentage >= 100 ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(activity.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{activity.percentage.toFixed(1)}% of target</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('revenue')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  sortBy === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSortBy('quota')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  sortBy === 'quota' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Quota Attainment
              </button>
              <button
                onClick={() => setSortBy('winRate')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  sortBy === 'winRate' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Win Rate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Performance */}
      <div className="space-y-6">
        {sortedMembers.map((member, index) => (
          <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  'bg-gradient-to-br from-blue-500 to-blue-700'
                }`}>
                  {member.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    {index < 3 && <Award className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div className="text-sm text-gray-600">{member.role}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                    {getPerformanceLabel(member.performance)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${(member.revenue / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">{member.dealsWon} deals won</div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center gap-1 text-green-700 mb-1">
                  <Target className="w-3 h-3" />
                  <span className="text-xs font-medium">Quota</span>
                </div>
                <div className="text-xl font-bold text-green-900">
                  {member.quotaAttainment.toFixed(1)}%
                </div>
                <div className="text-xs text-green-700 mt-1">
                  ${(member.quota / 1000).toFixed(0)}K goal
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-1 text-blue-700 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">Pipeline</span>
                </div>
                <div className="text-xl font-bold text-blue-900">
                  {member.activePipeline}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  ${(member.pipelineValue / 1000).toFixed(0)}K value
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex items-center gap-1 text-purple-700 mb-1">
                  <BarChart3 className="w-3 h-3" />
                  <span className="text-xs font-medium">Avg Deal</span>
                </div>
                <div className="text-xl font-bold text-purple-900">
                  ${(member.avgDealSize / 1000).toFixed(0)}K
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                <div className="flex items-center gap-1 text-yellow-700 mb-1">
                  <Award className="w-3 h-3" />
                  <span className="text-xs font-medium">Win Rate</span>
                </div>
                <div className="text-xl font-bold text-yellow-900">
                  {member.winRate.toFixed(1)}%
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <div className="flex items-center gap-1 text-orange-700 mb-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">Sales Cycle</span>
                </div>
                <div className="text-xl font-bold text-orange-900">
                  {member.salesCycle}d
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
                <div className="flex items-center gap-1 text-teal-700 mb-1">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">Deals Won</span>
                </div>
                <div className="text-xl font-bold text-teal-900">
                  {member.dealsWon}
                </div>
              </div>
            </div>

            {/* Activity Breakdown */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Activity Breakdown</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{member.activities.calls}</div>
                    <div className="text-xs text-gray-600">Calls</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{member.activities.emails}</div>
                    <div className="text-xs text-gray-600">Emails</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{member.activities.meetings}</div>
                    <div className="text-xs text-gray-600">Meetings</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{member.activities.tasks}</div>
                    <div className="text-xs text-gray-600">Tasks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Quota Progress</span>
                <span className="font-semibold text-gray-900">{member.quotaAttainment.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    member.quotaAttainment >= 100 ? 'bg-green-500' :
                    member.quotaAttainment >= 90 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(member.quotaAttainment, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
