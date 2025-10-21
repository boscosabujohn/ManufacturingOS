'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Filter, TrendingUp, TrendingDown, BarChart3, Activity, Clock, Target } from 'lucide-react';

interface OEEMetrics {
  period: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  plannedProductionTime: number;
  actualRunTime: number;
  downtime: number;
  idealCycleTime: number;
  totalPieces: number;
  goodPieces: number;
  defectPieces: number;
}

interface EquipmentOEE {
  equipment: string;
  location: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  trend: 'improving' | 'stable' | 'declining';
  target: number;
}

export default function OEEAnalyticsPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current-month');

  // Mock OEE data over time
  const oeeMetrics: OEEMetrics[] = [
    {
      period: 'Oct 2025',
      availability: 92.5,
      performance: 88.3,
      quality: 96.8,
      oee: 79.1,
      plannedProductionTime: 640,
      actualRunTime: 592,
      downtime: 48,
      idealCycleTime: 1.5,
      totalPieces: 4850,
      goodPieces: 4695,
      defectPieces: 155
    },
    {
      period: 'Sep 2025',
      availability: 93.2,
      performance: 89.5,
      quality: 97.0,
      oee: 80.9,
      plannedProductionTime: 640,
      actualRunTime: 596,
      downtime: 44,
      idealCycleTime: 1.5,
      totalPieces: 4620,
      goodPieces: 4480,
      defectPieces: 140
    },
    {
      period: 'Aug 2025',
      availability: 91.5,
      performance: 87.2,
      quality: 95.7,
      oee: 76.3,
      plannedProductionTime: 640,
      actualRunTime: 585,
      downtime: 55,
      idealCycleTime: 1.5,
      totalPieces: 4440,
      goodPieces: 4250,
      defectPieces: 190
    },
    {
      period: 'Jul 2025',
      availability: 92.0,
      performance: 88.8,
      quality: 95.9,
      oee: 78.3,
      plannedProductionTime: 640,
      actualRunTime: 589,
      downtime: 51,
      idealCycleTime: 1.5,
      totalPieces: 4280,
      goodPieces: 4105,
      defectPieces: 175
    }
  ];

  // Equipment-wise OEE
  const equipmentOEE: EquipmentOEE[] = [
    {
      equipment: 'ASSY-LINE-01',
      location: 'Assembly Department',
      availability: 88.5,
      performance: 85.2,
      quality: 94.8,
      oee: 71.5,
      trend: 'declining',
      target: 85.0
    },
    {
      equipment: 'CNC-CUT-01',
      location: 'Cutting Department - Bay A',
      availability: 94.2,
      performance: 91.5,
      quality: 98.2,
      oee: 84.6,
      trend: 'improving',
      target: 85.0
    },
    {
      equipment: 'WELD-ST-01',
      location: 'Welding Department - Bay B',
      availability: 95.8,
      performance: 93.2,
      quality: 97.5,
      oee: 87.1,
      trend: 'improving',
      target: 85.0
    },
    {
      equipment: 'POLISH-01',
      location: 'Finishing Department',
      availability: 89.2,
      performance: 84.5,
      quality: 95.1,
      oee: 71.7,
      trend: 'stable',
      target: 85.0
    },
    {
      equipment: 'PAINT-BOOTH-01',
      location: 'Finishing Department',
      availability: 91.8,
      performance: 87.8,
      quality: 96.5,
      oee: 77.8,
      trend: 'stable',
      target: 85.0
    },
    {
      equipment: 'PRESS-HYDRO-01',
      location: 'Forming Department',
      availability: 93.5,
      performance: 90.2,
      quality: 97.8,
      oee: 82.5,
      trend: 'improving',
      target: 85.0
    },
    {
      equipment: 'LASER-CUT-02',
      location: 'Cutting Department - Bay B',
      availability: 92.8,
      performance: 88.5,
      quality: 96.2,
      oee: 79.0,
      trend: 'stable',
      target: 85.0
    }
  ];

  const currentMetrics = oeeMetrics[0];
  const previousMetrics = oeeMetrics[1];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-700 bg-green-100';
      case 'stable': return 'text-blue-700 bg-blue-100';
      case 'declining': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4" />;
      case 'declining': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getOEEColor = (oee: number, target: number) => {
    if (oee >= target) return 'text-green-600';
    if (oee >= target * 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricColor = (value: number) => {
    if (value >= 95) return 'text-green-600';
    if (value >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OEE Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Overall Equipment Effectiveness analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="current-month">Current Month (Oct 2025)</option>
            <option value="last-month">Last Month (Sep 2025)</option>
            <option value="last-quarter">Last Quarter (Jul-Sep 2025)</option>
            <option value="ytd">Year to Date (2025)</option>
          </select>
        </div>
      </div>

      {/* OEE Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">OEE</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">{currentMetrics.oee}%</p>
              <p className="text-xs text-purple-600 mt-1">
                {currentMetrics.oee > previousMetrics.oee ? '↑' : '↓'}
                {Math.abs(currentMetrics.oee - previousMetrics.oee).toFixed(1)}% vs last month
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Target className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Availability</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{currentMetrics.availability}%</p>
              <p className="text-xs text-green-600 mt-1">{currentMetrics.downtime}h downtime</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Activity className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Performance</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{currentMetrics.performance}%</p>
              <p className="text-xs text-blue-600 mt-1">{currentMetrics.totalPieces} units produced</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Quality</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{currentMetrics.quality}%</p>
              <p className="text-xs text-orange-600 mt-1">{currentMetrics.defectPieces} defects</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* OEE Formula Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">OEE Calculation Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-green-600" />
              <h4 className="text-md font-bold text-green-900">Availability</h4>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">{currentMetrics.availability}%</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>= Actual Run Time / Planned Production Time</p>
              <p>= {currentMetrics.actualRunTime}h / {currentMetrics.plannedProductionTime}h</p>
              <p className="text-xs text-gray-500 mt-2">Downtime: {currentMetrics.downtime}h</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h4 className="text-md font-bold text-blue-900">Performance</h4>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{currentMetrics.performance}%</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>= (Ideal Cycle Time × Total Pieces) / Run Time</p>
              <p>= ({currentMetrics.idealCycleTime}m × {currentMetrics.totalPieces}) / {currentMetrics.actualRunTime}h</p>
              <p className="text-xs text-gray-500 mt-2">Ideal: {(currentMetrics.idealCycleTime * currentMetrics.totalPieces / 60).toFixed(0)}h</p>
            </div>
          </div>

          <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h4 className="text-md font-bold text-orange-900">Quality</h4>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-2">{currentMetrics.quality}%</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>= Good Pieces / Total Pieces</p>
              <p>= {currentMetrics.goodPieces} / {currentMetrics.totalPieces}</p>
              <p className="text-xs text-gray-500 mt-2">Defects: {currentMetrics.defectPieces} units</p>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-bold text-purple-900 mb-1">Overall Equipment Effectiveness (OEE)</h4>
              <p className="text-sm text-gray-700">= Availability × Performance × Quality</p>
              <p className="text-sm text-gray-700">= {currentMetrics.availability}% × {currentMetrics.performance}% × {currentMetrics.quality}%</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-purple-600">{currentMetrics.oee}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly OEE Trend</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Availability</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Performance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quality</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">OEE</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Pieces</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Good Pieces</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Downtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {oeeMetrics.map((metric, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{metric.period}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${getMetricColor(metric.availability)}`}>{metric.availability}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${getMetricColor(metric.performance)}`}>{metric.performance}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${getMetricColor(metric.quality)}`}>{metric.quality}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="text-lg font-bold text-purple-600">{metric.oee}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{metric.totalPieces.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-green-600 text-right">{metric.goodPieces.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-600 text-right">{metric.downtime}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment-wise OEE */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Equipment-wise OEE Performance</h3>
        <div className="space-y-3">
          {equipmentOEE.map((eq, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{eq.equipment}</h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(eq.trend)}`}>
                    {getTrendIcon(eq.trend)}
                    {eq.trend}
                  </span>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getOEEColor(eq.oee, eq.target)}`}>{eq.oee}%</p>
                  <p className="text-xs text-gray-500">Target: {eq.target}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{eq.location}</p>
                </div>
                <div>
                  <p className="text-xs text-green-600">Availability</p>
                  <p className={`text-sm font-bold ${getMetricColor(eq.availability)}`}>{eq.availability}%</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Performance</p>
                  <p className={`text-sm font-bold ${getMetricColor(eq.performance)}`}>{eq.performance}%</p>
                </div>
                <div>
                  <p className="text-xs text-orange-600">Quality</p>
                  <p className={`text-sm font-bold ${getMetricColor(eq.quality)}`}>{eq.quality}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${eq.oee >= eq.target ? 'bg-green-500' : eq.oee >= eq.target * 0.9 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${eq.oee}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
