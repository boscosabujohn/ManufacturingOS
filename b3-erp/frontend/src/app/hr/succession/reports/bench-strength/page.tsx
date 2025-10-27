'use client';

import { useState } from 'react';
import { BarChart3, Users, TrendingUp, Award, AlertTriangle } from 'lucide-react';

interface BenchStrength {
  position: string;
  department: string;
  level: 'executive' | 'senior' | 'mid_level';
  currentHolder: string;
  successors: {
    ready_now: number;
    ready_6months: number;
    ready_1year: number;
    ready_2years: number;
    ready_3plus: number;
  };
  totalSuccessors: number;
  benchDepth: 'strong' | 'adequate' | 'weak' | 'critical';
  avgQuality: number;
  retirementRisk: boolean;
}

export default function Page() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDepth, setSelectedDepth] = useState<string>('all');

  const mockBenchData: BenchStrength[] = [
    {
      position: 'CTO',
      department: 'IT',
      level: 'executive',
      currentHolder: 'Rajesh Kumar',
      successors: { ready_now: 1, ready_6months: 0, ready_1year: 1, ready_2years: 0, ready_3plus: 0 },
      totalSuccessors: 2,
      benchDepth: 'strong',
      avgQuality: 92,
      retirementRisk: false
    },
    {
      position: 'CFO',
      department: 'Finance',
      level: 'executive',
      currentHolder: 'Suresh Iyer',
      successors: { ready_now: 0, ready_6months: 0, ready_1year: 1, ready_2years: 0, ready_3plus: 0 },
      totalSuccessors: 1,
      benchDepth: 'adequate',
      avgQuality: 78,
      retirementRisk: true
    },
    {
      position: 'VP Sales',
      department: 'Sales',
      level: 'executive',
      currentHolder: 'Priya Sharma',
      successors: { ready_now: 1, ready_6months: 1, ready_1year: 0, ready_2years: 0, ready_3plus: 0 },
      totalSuccessors: 2,
      benchDepth: 'strong',
      avgQuality: 85,
      retirementRisk: false
    },
    {
      position: 'CHRO',
      department: 'HR',
      level: 'executive',
      currentHolder: 'Anjali Desai',
      successors: { ready_now: 0, ready_6months: 0, ready_1year: 1, ready_2years: 0, ready_3plus: 0 },
      totalSuccessors: 1,
      benchDepth: 'adequate',
      avgQuality: 80,
      retirementRisk: false
    },
    {
      position: 'COO',
      department: 'Operations',
      level: 'executive',
      currentHolder: 'Ramesh Nair',
      successors: { ready_now: 0, ready_6months: 0, ready_1year: 0, ready_2years: 1, ready_3plus: 0 },
      totalSuccessors: 1,
      benchDepth: 'weak',
      avgQuality: 72,
      retirementRisk: true
    },
    {
      position: 'CMO',
      department: 'Marketing',
      level: 'executive',
      currentHolder: 'Amit Verma',
      successors: { ready_now: 0, ready_6months: 0, ready_1year: 0, ready_2years: 1, ready_3plus: 0 },
      totalSuccessors: 1,
      benchDepth: 'weak',
      avgQuality: 75,
      retirementRisk: false
    },
    {
      position: 'IT Lead',
      department: 'IT',
      level: 'senior',
      currentHolder: 'Kavita Singh',
      successors: { ready_now: 2, ready_6months: 1, ready_1year: 1, ready_2years: 0, ready_3plus: 0 },
      totalSuccessors: 4,
      benchDepth: 'strong',
      avgQuality: 88,
      retirementRisk: false
    },
    {
      position: 'Sales Lead',
      department: 'Sales',
      level: 'senior',
      currentHolder: 'Arjun Kapoor',
      successors: { ready_now: 1, ready_6months: 2, ready_1year: 0, ready_2years: 0, ready_3plus: 0 },
      totalSuccessors: 3,
      benchDepth: 'strong',
      avgQuality: 82,
      retirementRisk: false
    },
    {
      position: 'Finance Manager',
      department: 'Finance',
      level: 'senior',
      currentHolder: 'Rahul Mehta',
      successors: { ready_now: 0, ready_6months: 1, ready_1year: 1, ready_2years: 0, ready_3plus: 0 },
      totalSuccessors: 2,
      benchDepth: 'adequate',
      avgQuality: 76,
      retirementRisk: false
    },
    {
      position: 'Supply Chain Manager',
      department: 'Supply Chain',
      level: 'senior',
      currentHolder: 'Vikram Patel',
      successors: { ready_now: 0, ready_6months: 0, ready_1year: 0, ready_2years: 0, ready_3plus: 0 },
      totalSuccessors: 0,
      benchDepth: 'critical',
      avgQuality: 0,
      retirementRisk: true
    }
  ];

  const filteredData = mockBenchData.filter(item => {
    const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;
    const matchesDepth = selectedDepth === 'all' || item.benchDepth === selectedDepth;
    return matchesLevel && matchesDepth;
  });

  const getDepthColor = (depth: string) => {
    switch (depth) {
      case 'strong': return 'bg-green-100 text-green-700 border-green-300';
      case 'adequate': return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'weak': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 85) return 'text-green-600';
    if (quality >= 75) return 'text-teal-600';
    if (quality >= 65) return 'text-blue-600';
    if (quality >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const strongBench = mockBenchData.filter(b => b.benchDepth === 'strong').length;
  const adequateBench = mockBenchData.filter(b => b.benchDepth === 'adequate').length;
  const weakBench = mockBenchData.filter(b => b.benchDepth === 'weak').length;
  const criticalBench = mockBenchData.filter(b => b.benchDepth === 'critical').length;
  const avgQuality = Math.round(mockBenchData.reduce((sum, b) => sum + b.avgQuality, 0) / mockBenchData.length);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-teal-600" />
          Bench Strength
        </h1>
        <p className="text-sm text-gray-600 mt-1">Talent depth and successor pipeline analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Strong</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{strongBench}</p>
            </div>
            <Users className="h-8 w-8 text-green-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-sm border border-teal-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Adequate</p>
              <p className="text-3xl font-bold text-teal-900 mt-1">{adequateBench}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-teal-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Weak</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{weakBench}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Critical</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{criticalBench}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600 opacity-60" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Avg. Quality</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{avgQuality}%</p>
            </div>
            <Award className="h-8 w-8 text-blue-600 opacity-60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Level</label>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Levels</option>
              <option value="executive">Executive</option>
              <option value="senior">Senior</option>
              <option value="mid_level">Mid-Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Bench Depth</label>
            <select value={selectedDepth} onChange={(e) => setSelectedDepth(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Depths</option>
              <option value="strong">Strong</option>
              <option value="adequate">Adequate</option>
              <option value="weak">Weak</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{item.position}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${getDepthColor(item.benchDepth)}`}>
                    {item.benchDepth.toUpperCase()}
                  </span>
                  {item.retirementRisk && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full border-2 bg-orange-100 text-orange-700 border-orange-300">
                      RETIREMENT RISK
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{item.department} • {item.currentHolder} • {item.level.replace('_', '-')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Total Successors</p>
                <p className="text-2xl font-bold text-teal-600">{item.totalSuccessors}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Ready Now</p>
                <p className="text-2xl font-bold text-green-700">{item.successors.ready_now}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">6 Months</p>
                <p className="text-2xl font-bold text-teal-700">{item.successors.ready_6months}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">1 Year</p>
                <p className="text-2xl font-bold text-blue-700">{item.successors.ready_1year}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">2 Years</p>
                <p className="text-2xl font-bold text-purple-700">{item.successors.ready_2years}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">3+ Years</p>
                <p className="text-2xl font-bold text-gray-700">{item.successors.ready_3plus}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Avg. Quality</p>
                <p className={`text-2xl font-bold ${getQualityColor(item.avgQuality)}`}>{item.avgQuality || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-2">Successor Readiness Timeline</p>
              <div className="flex items-center gap-1">
                {item.totalSuccessors > 0 ? (
                  <>
                    {item.successors.ready_now > 0 && <div className="bg-green-500 h-3 rounded" style={{ width: `${(item.successors.ready_now / item.totalSuccessors) * 100}%` }} title={`${item.successors.ready_now} ready now`}></div>}
                    {item.successors.ready_6months > 0 && <div className="bg-teal-500 h-3 rounded" style={{ width: `${(item.successors.ready_6months / item.totalSuccessors) * 100}%` }} title={`${item.successors.ready_6months} in 6 months`}></div>}
                    {item.successors.ready_1year > 0 && <div className="bg-blue-500 h-3 rounded" style={{ width: `${(item.successors.ready_1year / item.totalSuccessors) * 100}%` }} title={`${item.successors.ready_1year} in 1 year`}></div>}
                    {item.successors.ready_2years > 0 && <div className="bg-purple-500 h-3 rounded" style={{ width: `${(item.successors.ready_2years / item.totalSuccessors) * 100}%` }} title={`${item.successors.ready_2years} in 2 years`}></div>}
                    {item.successors.ready_3plus > 0 && <div className="bg-gray-500 h-3 rounded" style={{ width: `${(item.successors.ready_3plus / item.totalSuccessors) * 100}%` }} title={`${item.successors.ready_3plus} in 3+ years`}></div>}
                  </>
                ) : (
                  <div className="bg-red-500 h-3 rounded flex-1"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
