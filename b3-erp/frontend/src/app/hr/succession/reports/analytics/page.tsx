'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Users, Target, Award, BarChart3, AlertCircle } from 'lucide-react';

export default function Page() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const analyticsData = useMemo(() => ({
    overview: {
      totalCriticalPositions: 24,
      positionsWithSuccessors: 20,
      coverageRate: 83,
      avgReadinessScore: 78,
      highPotentialTalent: 18,
      activeDevelopmentPlans: 15
    },
    byDepartment: [
      { department: 'IT', critical: 5, covered: 5, coverage: 100, avgReadiness: 85, highPotential: 4 },
      { department: 'Sales', critical: 4, covered: 4, coverage: 100, avgReadiness: 80, highPotential: 3 },
      { department: 'Finance', critical: 3, covered: 3, coverage: 100, avgReadiness: 75, highPotential: 2 },
      { department: 'HR', critical: 3, covered: 3, coverage: 100, avgReadiness: 78, highPotential: 2 },
      { department: 'Operations', critical: 4, covered: 3, coverage: 75, avgReadiness: 70, highPotential: 3 },
      { department: 'Marketing', critical: 3, covered: 2, coverage: 67, avgReadiness: 72, highPotential: 2 },
      { department: 'Supply Chain', critical: 2, covered: 0, coverage: 0, avgReadiness: 0, highPotential: 2 }
    ],
    readinessDistribution: [
      { level: 'Ready Now', count: 5, percentage: 28 },
      { level: 'Ready in 6 Months', count: 4, percentage: 22 },
      { level: 'Ready in 1 Year', count: 5, percentage: 28 },
      { level: 'Ready in 2 Years', count: 3, percentage: 17 },
      { level: 'Ready in 3+ Years', count: 1, percentage: 5 }
    ],
    riskLevels: [
      { risk: 'Critical Risk', count: 2, percentage: 8 },
      { risk: 'High Risk', count: 3, percentage: 13 },
      { risk: 'Medium Risk', count: 6, percentage: 25 },
      { risk: 'Low Risk', count: 13, percentage: 54 }
    ],
    pipeline: {
      executive: { total: 4, ready: 2, inDevelopment: 2 },
      senior: { total: 8, ready: 5, inDevelopment: 3 },
      midLevel: { total: 12, ready: 8, inDevelopment: 4 }
    }
  }), []);

  const filteredData = useMemo(() => {
    if (selectedDepartment === 'all') return analyticsData.byDepartment;
    return analyticsData.byDepartment.filter(d => d.department === selectedDepartment);
  }, [selectedDepartment, analyticsData]);

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return 'text-green-600';
    if (coverage >= 75) return 'text-teal-600';
    if (coverage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-teal-600';
    if (score >= 65) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-teal-600" />
          Talent Analytics
        </h1>
        <p className="text-sm text-gray-600 mt-1">Succession planning insights and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Critical Positions</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{analyticsData.overview.totalCriticalPositions}</p>
              <p className="text-xs text-purple-700 mt-1">{analyticsData.overview.positionsWithSuccessors} with successors</p>
            </div>
            <Target className="h-10 w-10 text-purple-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-sm border border-teal-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Coverage Rate</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">{analyticsData.overview.coverageRate}%</p>
              <p className="text-xs text-teal-700 mt-1">Succession coverage</p>
            </div>
            <BarChart3 className="h-10 w-10 text-teal-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">High Potential</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{analyticsData.overview.highPotentialTalent}</p>
              <p className="text-xs text-blue-700 mt-1">Identified talents</p>
            </div>
            <Users className="h-10 w-10 text-blue-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Avg. Readiness</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{analyticsData.overview.avgReadinessScore}%</p>
              <p className="text-xs text-green-700 mt-1">Overall readiness score</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm border border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Dev. Plans</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{analyticsData.overview.activeDevelopmentPlans}</p>
              <p className="text-xs text-orange-700 mt-1">Active development</p>
            </div>
            <Award className="h-10 w-10 text-orange-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">At Risk</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{analyticsData.riskLevels[0].count + analyticsData.riskLevels[1].count}</p>
              <p className="text-xs text-red-700 mt-1">High/Critical risk</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Department</label>
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="all">All Departments</option>
          {analyticsData.byDepartment.map(dept => (
            <option key={dept.department} value={dept.department}>{dept.department}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Coverage by Department</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Critical Positions</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Covered</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Coverage %</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Avg. Readiness</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">High Potential</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((dept, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900">{dept.department}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{dept.critical}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{dept.covered}</td>
                  <td className={`py-3 px-4 text-center font-bold ${getCoverageColor(dept.coverage)}`}>{dept.coverage}%</td>
                  <td className={`py-3 px-4 text-center font-bold ${getReadinessColor(dept.avgReadiness)}`}>{dept.avgReadiness || 'N/A'}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{dept.highPotential}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Readiness Distribution</h3>
          <div className="space-y-3">
            {analyticsData.readinessDistribution.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.level}</span>
                  <span className="text-sm font-bold text-teal-600">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-500 rounded-full h-2 transition-all" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Levels</h3>
          <div className="space-y-3">
            {analyticsData.riskLevels.map((item, idx) => {
              const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.risk}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className={`${colors[idx]} rounded-full h-2 transition-all`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Talent Pipeline by Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(analyticsData.pipeline).map(([level, data]) => (
            <div key={level} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-3">{level.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Positions:</span>
                  <span className="text-sm font-bold text-gray-900">{data.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ready Now:</span>
                  <span className="text-sm font-bold text-green-600">{data.ready}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Development:</span>
                  <span className="text-sm font-bold text-blue-600">{data.inDevelopment}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Readiness</span>
                    <span className="text-xs font-bold text-teal-600">{Math.round((data.ready / data.total) * 100)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-500 rounded-full h-2" style={{ width: `${(data.ready / data.total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
