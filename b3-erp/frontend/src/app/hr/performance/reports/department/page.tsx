'use client';

import { Building, TrendingUp, Users, Target, Activity } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export default function DepartmentPerformancePage() {
  const departmentData = [
    { name: 'Engineering', avgScore: 4.2, completionPrice: 95, pipRate: 2, promotionReady: 15, prevScore: 4.0 },
    { name: 'Sales', avgScore: 4.5, completionPrice: 98, pipRate: 5, promotionReady: 20, prevScore: 4.2 },
    { name: 'Marketing', avgScore: 3.9, completionPrice: 92, pipRate: 3, promotionReady: 10, prevScore: 3.8 },
    { name: 'Product', avgScore: 4.1, completionPrice: 94, pipRate: 1, promotionReady: 12, prevScore: 4.1 },
    { name: 'HR', avgScore: 4.3, completionPrice: 100, pipRate: 0, promotionReady: 8, prevScore: 4.2 },
    { name: 'Finance', avgScore: 4.0, completionPrice: 96, pipRate: 2, promotionReady: 10, prevScore: 3.9 },
  ];

  const trendData = [
    { month: 'Jan', Eng: 4.0, Sales: 4.2, Mkt: 3.8 },
    { month: 'Feb', Eng: 4.1, Sales: 4.3, Mkt: 3.8 },
    { month: 'Mar', Eng: 4.1, Sales: 4.2, Mkt: 3.9 },
    { month: 'Apr', Eng: 4.2, Sales: 4.4, Mkt: 3.8 },
    { month: 'May', Eng: 4.2, Sales: 4.5, Mkt: 3.9 },
    { month: 'Jun', Eng: 4.3, Sales: 4.5, Mkt: 4.0 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4.2) return 'bg-green-100 text-green-800';
    if (score >= 3.8) return 'bg-purple-100 text-purple-800';
    return 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-8 w-8 text-purple-600" />
            Department Performance
          </h1>
          <p className="text-gray-500 mt-1">Comparative analysis of department-wise metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-500" />
            Average Performance Score
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend />
                <Bar dataKey="avgScore" name="Current Score" fill="#9333ea" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="prevScore" name="Previous Score" fill="#e5e7eb" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            Performance Trends (Top Depts)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis domain={[3, 5]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Eng" name="Engineering" stroke="#9333ea" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Sales" name="Sales" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Mkt" name="Marketing" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* KPI Heatmap */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Department KPI Heatmap</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                <th className="pb-4 font-medium pl-4">Department</th>
                <th className="pb-4 font-medium">Avg Score</th>
                <th className="pb-4 font-medium">Review Completion</th>
                <th className="pb-4 font-medium">PIP Rate</th>
                <th className="pb-4 font-medium">Promotion Ready</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departmentData.map((dept) => (
                <tr key={dept.name} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 pl-4 font-medium text-gray-900 flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    {dept.name}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${getScoreColor(dept.avgScore)}`}>
                      {dept.avgScore}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${dept.completionPrice}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{dept.completionPrice}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-sm ${dept.pipRate > 3 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {dept.pipRate}%
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-purple-600 font-medium text-sm">
                      <Target className="h-4 w-4" />
                      {dept.promotionReady}%
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
