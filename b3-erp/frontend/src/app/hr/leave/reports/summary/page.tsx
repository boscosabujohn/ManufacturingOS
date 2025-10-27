'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Calendar, Download, Filter } from 'lucide-react';

interface LeaveSummaryData {
  leaveType: string;
  leaveTypeCode: string;
  totalAllocated: number;
  totalUsed: number;
  totalBalance: number;
  utilizationRate: number;
  avgDaysPerEmployee: number;
  color: string;
}

const mockLeaveSummary: LeaveSummaryData[] = [
  { leaveType: 'Earned Leave', leaveTypeCode: 'EL', totalAllocated: 2400, totalUsed: 1680, totalBalance: 720, utilizationRate: 70, avgDaysPerEmployee: 8.4, color: 'bg-blue-500' },
  { leaveType: 'Casual Leave', leaveTypeCode: 'CL', totalAllocated: 1200, totalUsed: 840, totalBalance: 360, utilizationRate: 70, avgDaysPerEmployee: 4.2, color: 'bg-green-500' },
  { leaveType: 'Sick Leave', leaveTypeCode: 'SL', totalAllocated: 1800, totalUsed: 540, totalBalance: 1260, utilizationRate: 30, avgDaysPerEmployee: 2.7, color: 'bg-red-500' },
  { leaveType: 'Privilege Leave', leaveTypeCode: 'PL', totalAllocated: 1000, totalUsed: 650, totalBalance: 350, utilizationRate: 65, avgDaysPerEmployee: 3.25, color: 'bg-purple-500' },
  { leaveType: 'Maternity Leave', leaveTypeCode: 'ML', totalAllocated: 360, totalUsed: 180, totalBalance: 180, utilizationRate: 50, avgDaysPerEmployee: 90, color: 'bg-pink-500' },
  { leaveType: 'Comp Off', leaveTypeCode: 'CO', totalAllocated: 600, totalUsed: 420, totalBalance: 180, utilizationRate: 70, avgDaysPerEmployee: 2.1, color: 'bg-orange-500' }
];

interface MonthlyTrend {
  month: string;
  leaves: number;
  growth: number;
}

const mockMonthlyTrends: MonthlyTrend[] = [
  { month: 'Apr', leaves: 180, growth: 0 },
  { month: 'May', leaves: 210, growth: 16.7 },
  { month: 'Jun', leaves: 195, growth: -7.1 },
  { month: 'Jul', leaves: 225, growth: 15.4 },
  { month: 'Aug', leaves: 240, growth: 6.7 },
  { month: 'Sep', leaves: 220, growth: -8.3 },
  { month: 'Oct', leaves: 235, growth: 6.8 }
];

export default function LeaveSummaryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current_fy');

  const overallStats = useMemo(() => {
    const totalAllocated = mockLeaveSummary.reduce((sum, l) => sum + l.totalAllocated, 0);
    const totalUsed = mockLeaveSummary.reduce((sum, l) => sum + l.totalUsed, 0);
    const totalBalance = mockLeaveSummary.reduce((sum, l) => sum + l.totalBalance, 0);
    const utilizationRate = (totalUsed / totalAllocated * 100);
    return { totalAllocated, totalUsed, totalBalance, utilizationRate };
  }, []);

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'text-red-600';
    if (rate >= 60) return 'text-orange-600';
    if (rate >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUtilizationBgColor = (rate: number) => {
    if (rate >= 80) return 'bg-red-100';
    if (rate >= 60) return 'bg-orange-100';
    if (rate >= 40) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Leave Summary Report
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive leave utilization and trends analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="current_fy">Current FY (2025-26)</option>
            <option value="last_fy">Last FY (2024-25)</option>
            <option value="ytd">Year to Date</option>
            <option value="last_quarter">Last Quarter</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Total Allocated
          </div>
          <div className="text-2xl font-bold text-gray-900">{overallStats.totalAllocated.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">days</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Total Used</div>
          <div className="text-2xl font-bold text-blue-600">{overallStats.totalUsed.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{overallStats.utilizationRate.toFixed(1)}% utilized</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Total Balance</div>
          <div className="text-2xl font-bold text-green-600">{overallStats.totalBalance.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">days remaining</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Users className="w-4 h-4" /> Employees
          </div>
          <div className="text-2xl font-bold text-purple-600">200</div>
          <div className="text-xs text-gray-500 mt-1">active employees</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Type-wise Breakdown</h2>
        <div className="space-y-4">
          {mockLeaveSummary.map(leave => (
            <div key={leave.leaveTypeCode} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded ${leave.color}`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{leave.leaveType}</div>
                    <div className="text-xs text-gray-500">{leave.leaveTypeCode}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getUtilizationColor(leave.utilizationRate)}`}>
                    {leave.utilizationRate}%
                  </div>
                  <div className="text-xs text-gray-500">utilization</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-2">
                <div>
                  <div className="text-xs text-gray-600">Allocated</div>
                  <div className="text-sm font-semibold text-gray-900">{leave.totalAllocated}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Used</div>
                  <div className="text-sm font-semibold text-blue-600">{leave.totalUsed}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Balance</div>
                  <div className="text-sm font-semibold text-green-600">{leave.totalBalance}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Avg/Employee</div>
                  <div className="text-sm font-semibold text-purple-600">{leave.avgDaysPerEmployee}</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${getUtilizationBgColor(leave.utilizationRate)} h-2 rounded-full`} style={{ width: `${leave.utilizationRate}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Leave Trends</h2>
          <div className="space-y-3">
            {mockMonthlyTrends.map(trend => (
              <div key={trend.month} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 text-sm font-medium text-gray-600">{trend.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(trend.leaves / 250) * 100}%` }}></div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 w-12">{trend.leaves}</div>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium w-16 justify-end ${trend.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(trend.growth).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Utilization Insights</h2>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="text-red-600 font-semibold text-sm">High Utilization</div>
              </div>
              <div className="mt-2 space-y-1">
                {mockLeaveSummary.filter(l => l.utilizationRate >= 70).map(l => (
                  <div key={l.leaveTypeCode} className="text-xs text-red-800">
                    • {l.leaveType}: {l.utilizationRate}% used ({l.totalBalance} days remaining)
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="text-green-600 font-semibold text-sm">Low Utilization</div>
              </div>
              <div className="mt-2 space-y-1">
                {mockLeaveSummary.filter(l => l.utilizationRate < 40).map(l => (
                  <div key={l.leaveTypeCode} className="text-xs text-green-800">
                    • {l.leaveType}: {l.utilizationRate}% used ({l.totalBalance} days available)
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-600 font-semibold text-sm mb-2">Key Metrics</div>
              <div className="space-y-1 text-xs text-blue-800">
                <div>• Average leaves per employee: 21.75 days/year</div>
                <div>• Most utilized: {mockLeaveSummary.sort((a, b) => b.utilizationRate - a.utilizationRate)[0].leaveType}</div>
                <div>• Least utilized: {mockLeaveSummary.sort((a, b) => a.utilizationRate - b.utilizationRate)[0].leaveType}</div>
                <div>• Peak month: July (225 leaves)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          <BarChart3 className="w-5 h-5 inline mr-2" />
          Leave Summary Insights
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Comprehensive leave allocation vs utilization analysis across all leave types</li>
          <li>✓ Monthly trends showing leave consumption patterns and seasonal variations</li>
          <li>✓ Utilization rate color-coding: Red (>80%), Orange (60-80%), Yellow (40-60%), Green (&lt;40%)</li>
          <li>✓ Average days per employee metric for workforce planning</li>
          <li>✓ High/low utilization alerts for proactive leave balance management</li>
        </ul>
      </div>
    </div>
  );
}
