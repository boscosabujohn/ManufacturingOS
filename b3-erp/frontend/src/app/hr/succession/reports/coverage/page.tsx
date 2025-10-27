'use client';

import { useState } from 'react';
import { PieChart, Target, Users, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface CoverageData {
  department: string;
  totalPositions: number;
  criticalPositions: number;
  coveredPositions: number;
  uncoveredPositions: number;
  coverageRatio: number;
  avgSuccessorsPerPosition: number;
  readyNow: number;
  inDevelopment: number;
}

export default function Page() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const mockCoverageData: CoverageData[] = [
    {
      department: 'IT',
      totalPositions: 8,
      criticalPositions: 5,
      coveredPositions: 5,
      uncoveredPositions: 0,
      coverageRatio: 100,
      avgSuccessorsPerPosition: 2.8,
      readyNow: 3,
      inDevelopment: 4
    },
    {
      department: 'Sales',
      totalPositions: 7,
      criticalPositions: 4,
      coveredPositions: 4,
      uncoveredPositions: 0,
      coverageRatio: 100,
      avgSuccessorsPerPosition: 2.5,
      readyNow: 2,
      inDevelopment: 3
    },
    {
      department: 'Finance',
      totalPositions: 5,
      criticalPositions: 3,
      coveredPositions: 3,
      uncoveredPositions: 0,
      coverageRatio: 100,
      avgSuccessorsPerPosition: 1.7,
      readyNow: 1,
      inDevelopment: 2
    },
    {
      department: 'HR',
      totalPositions: 4,
      criticalPositions: 3,
      coveredPositions: 3,
      uncoveredPositions: 0,
      coverageRatio: 100,
      avgSuccessorsPerPosition: 1.3,
      readyNow: 1,
      inDevelopment: 2
    },
    {
      department: 'Operations',
      totalPositions: 6,
      criticalPositions: 4,
      coveredPositions: 3,
      uncoveredPositions: 1,
      coverageRatio: 75,
      avgSuccessorsPerPosition: 1.0,
      readyNow: 0,
      inDevelopment: 3
    },
    {
      department: 'Marketing',
      totalPositions: 5,
      criticalPositions: 3,
      coveredPositions: 2,
      uncoveredPositions: 1,
      coverageRatio: 67,
      avgSuccessorsPerPosition: 0.7,
      readyNow: 0,
      inDevelopment: 2
    },
    {
      department: 'Supply Chain',
      totalPositions: 4,
      criticalPositions: 2,
      coveredPositions: 0,
      uncoveredPositions: 2,
      coverageRatio: 0,
      avgSuccessorsPerPosition: 0,
      readyNow: 0,
      inDevelopment: 2
    }
  ];

  const filteredData = selectedDepartment === 'all'
    ? mockCoverageData
    : mockCoverageData.filter(d => d.department === selectedDepartment);

  const getCoverageColor = (ratio: number) => {
    if (ratio >= 90) return 'text-green-600';
    if (ratio >= 75) return 'text-teal-600';
    if (ratio >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCoverageBgColor = (ratio: number) => {
    if (ratio >= 90) return 'bg-green-500';
    if (ratio >= 75) return 'bg-teal-500';
    if (ratio >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const totalCritical = mockCoverageData.reduce((sum, d) => sum + d.criticalPositions, 0);
  const totalCovered = mockCoverageData.reduce((sum, d) => sum + d.coveredPositions, 0);
  const totalUncovered = mockCoverageData.reduce((sum, d) => sum + d.uncoveredPositions, 0);
  const overallCoverage = Math.round((totalCovered / totalCritical) * 100);
  const avgSuccessors = (mockCoverageData.reduce((sum, d) => sum + d.avgSuccessorsPerPosition, 0) / mockCoverageData.length).toFixed(1);
  const totalReadyNow = mockCoverageData.reduce((sum, d) => sum + d.readyNow, 0);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PieChart className="h-6 w-6 text-teal-600" />
          Succession Coverage
        </h1>
        <p className="text-sm text-gray-600 mt-1">Succession planning coverage and readiness metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Critical Positions</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{totalCritical}</p>
              <p className="text-xs text-purple-700 mt-1">Total critical</p>
            </div>
            <Target className="h-10 w-10 text-purple-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Covered</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{totalCovered}</p>
              <p className="text-xs text-green-700 mt-1">{overallCoverage}% coverage</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Uncovered</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{totalUncovered}</p>
              <p className="text-xs text-red-700 mt-1">Need attention</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-sm border border-teal-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Ready Now</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">{totalReadyNow}</p>
              <p className="text-xs text-teal-700 mt-1">Immediate successors</p>
            </div>
            <Users className="h-10 w-10 text-teal-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Overall Coverage</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#14B8A6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(overallCoverage / 100) * 352} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-teal-600">{overallCoverage}%</p>
                  <p className="text-xs text-gray-600">Coverage</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Avg. Successors/Position:</span>
              <span className="font-bold text-gray-900">{avgSuccessors}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Positions:</span>
              <span className="font-bold text-gray-900">{totalCritical}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Covered:</span>
              <span className="font-bold text-green-600">{totalCovered}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Gaps:</span>
              <span className="font-bold text-red-600">{totalUncovered}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Coverage by Department</h3>
          <div className="space-y-3">
            {mockCoverageData.map((dept, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className={`text-sm font-bold ${getCoverageColor(dept.coverageRatio)}`}>{dept.coverageRatio}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className={`${getCoverageBgColor(dept.coverageRatio)} rounded-full h-2 transition-all`} style={{ width: `${dept.coverageRatio}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Department</label>
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="all">All Departments</option>
          {mockCoverageData.map(dept => (
            <option key={dept.department} value={dept.department}>{dept.department}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Coverage Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Total Positions</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Critical</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Covered</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Gaps</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Coverage %</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Avg. Successors</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Ready Now</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">In Dev.</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((dept, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900">{dept.department}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{dept.totalPositions}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{dept.criticalPositions}</td>
                  <td className="py-3 px-4 text-center font-semibold text-green-600">{dept.coveredPositions}</td>
                  <td className="py-3 px-4 text-center font-semibold text-red-600">{dept.uncoveredPositions}</td>
                  <td className={`py-3 px-4 text-center font-bold ${getCoverageColor(dept.coverageRatio)}`}>{dept.coverageRatio}%</td>
                  <td className="py-3 px-4 text-center text-gray-700">{dept.avgSuccessorsPerPosition.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center font-semibold text-teal-600">{dept.readyNow}</td>
                  <td className="py-3 px-4 text-center font-semibold text-blue-600">{dept.inDevelopment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
