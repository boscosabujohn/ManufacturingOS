'use client';

import { useMemo, useState } from 'react';
import { BarChart3, Search, Filter, Download, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';

const velocityData = [
  { week: 'W34', stories: 18 },
  { week: 'W35', stories: 22 },
  { week: 'W36', stories: 20 },
  { week: 'W37', stories: 24 },
  { week: 'W38', stories: 25 },
  { week: 'W39', stories: 23 },
  { week: 'W40', stories: 26 },
];

const statusBreakdown = [
  { status: 'Todo', count: 54 },
  { status: 'In Progress', count: 38 },
  { status: 'Blocked', count: 6 },
  { status: 'Review', count: 12 },
  { status: 'Done', count: 245 },
];

export default function PerformanceMetricsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredVelocity = useMemo(() => velocityData, []);
  const filteredStatus = useMemo(() => statusBreakdown, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-teal-600" />
          Performance Metrics
        </h1>
        <p className="text-gray-600 mt-2">KPIs and project performance indicators</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search metrics..."
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
              <p className="text-teal-600 text-sm font-medium">Schedule Performance</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">0.92</p>
            </div>
            <BarChart3 className="h-12 w-12 text-teal-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Cost Performance</p>
              <p className="text-3xl font-bold text-green-900 mt-1">1.05</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Quality Index</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">94%</p>
            </div>
            <BarChart3 className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Resource Utilization</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">87%</p>
            </div>
            <BarChart3 className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Velocity (Stories per Week)</h3>
            <span className="text-xs text-gray-500">Last 7 weeks</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredVelocity} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="stories" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Tasks by Status</h3>
            <span className="text-xs text-gray-500">Current</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredStatus} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SLA table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-800">KPI Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">KPI</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Target</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Current</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[
                { k: 'On-time Delivery', t: '95%', c: '92%', trend: 'down' },
                { k: 'Defect Rate', t: '< 2%', c: '1.4%', trend: 'up' },
                { k: 'Lead Time', t: '< 21 days', c: '19 days', trend: 'up' },
                { k: 'Budget Variance', t: '±5%', c: '+3%', trend: 'flat' },
              ].map((r) => (
                <tr key={r.k}>
                  <td className="px-4 py-2 text-sm text-gray-800">{r.k}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{r.t}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{r.c}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${r.trend==='up'?'bg-green-50 text-green-700':r.trend==='down'?'bg-red-50 text-red-700':'bg-gray-100 text-gray-700'}`}>{r.trend}</span>
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
