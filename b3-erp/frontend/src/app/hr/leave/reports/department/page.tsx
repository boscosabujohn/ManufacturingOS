'use client';

import React, { useState, useMemo } from 'react';
import { Building, Users, TrendingUp, Calendar, Download, AlertCircle } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';

interface DepartmentLeaveData {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  totalLeaveDays: number;
  avgLeavesPerEmployee: number;
  utilizationRate: number;
  pendingApplications: number;
  topLeaveType: string;
  teamAvailability: number;
  color: string;
}

const mockDepartmentData: DepartmentLeaveData[] = [
  { departmentId: 'PROD', departmentName: 'Production', totalEmployees: 80, totalLeaveDays: 1680, avgLeavesPerEmployee: 21, utilizationRate: 70, pendingApplications: 12, topLeaveType: 'EL', teamAvailability: 88, color: 'bg-blue-500' },
  { departmentId: 'QC', departmentName: 'Quality Control', totalEmployees: 25, totalLeaveDays: 525, avgLeavesPerEmployee: 21, utilizationRate: 70, pendingApplications: 3, topLeaveType: 'CL', teamAvailability: 92, color: 'bg-green-500' },
  { departmentId: 'MAINT', departmentName: 'Maintenance', totalEmployees: 30, totalLeaveDays: 600, avgLeavesPerEmployee: 20, utilizationRate: 67, pendingApplications: 5, topLeaveType: 'EL', teamAvailability: 90, color: 'bg-orange-500' },
  { departmentId: 'STORE', departmentName: 'Stores & Logistics', totalEmployees: 20, totalLeaveDays: 440, avgLeavesPerEmployee: 22, utilizationRate: 73, pendingApplications: 2, topLeaveType: 'CL', teamAvailability: 85, color: 'bg-purple-500' },
  { departmentId: 'HR', departmentName: 'Human Resources', totalEmployees: 12, totalLeaveDays: 252, avgLeavesPerEmployee: 21, utilizationRate: 70, pendingApplications: 1, topLeaveType: 'EL', teamAvailability: 92, color: 'bg-pink-500' },
  { departmentId: 'FIN', departmentName: 'Finance & Accounts', totalEmployees: 15, totalLeaveDays: 300, avgLeavesPerEmployee: 20, utilizationRate: 67, pendingApplications: 2, topLeaveType: 'CL', teamAvailability: 93, color: 'bg-yellow-500' },
  { departmentId: 'IT', departmentName: 'IT & Admin', totalEmployees: 18, totalLeaveDays: 378, avgLeavesPerEmployee: 21, utilizationRate: 70, pendingApplications: 3, topLeaveType: 'WFH', teamAvailability: 94, color: 'bg-indigo-500' }
];

interface DepartmentLeaveType {
  department: string;
  EL: number;
  CL: number;
  SL: number;
  PL: number;
  ML: number;
  CO: number;
}

const mockLeaveTypeBreakdown: DepartmentLeaveType[] = [
  { department: 'Production', EL: 672, CL: 336, SL: 252, PL: 210, ML: 126, CO: 84 },
  { department: 'Quality Control', EL: 210, CL: 131, SL: 79, PL: 63, ML: 26, CO: 16 },
  { department: 'Maintenance', EL: 240, CL: 150, SL: 90, PL: 60, ML: 36, CO: 24 },
  { department: 'Stores & Logistics', EL: 176, CL: 110, SL: 66, PL: 44, ML: 22, CO: 22 },
  { department: 'Human Resources', EL: 101, CL: 63, SL: 38, PL: 25, ML: 13, CO: 12 },
  { department: 'Finance & Accounts', EL: 120, CL: 75, SL: 45, PL: 30, ML: 18, CO: 12 },
  { department: 'IT & Admin', EL: 151, CL: 94, SL: 57, PL: 38, ML: 19, CO: 19 }
];

export default function DepartmentReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current_fy');
  const [sortBy, setSortBy] = useState<'name' | 'employees' | 'leaves' | 'utilization'>('name');

  const columns: Column<DepartmentLeaveData>[] = [
    {
      id: 'department',
      header: 'Department',
      accessor: 'departmentName',
      sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded ${row.color}`}></div>
          <div>
            <div className="font-medium text-gray-900">{v}</div>
            <div className="text-xs text-gray-500">{row.departmentId}</div>
          </div>
        </div>
      )
    },
    {
      id: 'employees',
      header: 'Employees',
      accessor: 'totalEmployees',
      sortable: true,
      render: (v) => (
        <div className="text-sm">
          <div className="font-semibold text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">members</div>
        </div>
      )
    },
    {
      id: 'leaves',
      header: 'Total Leaves',
      accessor: 'totalLeaveDays',
      sortable: true,
      render: (v, row) => (
        <div className="text-sm">
          <div className="font-semibold text-blue-600">{v} days</div>
          <div className="text-xs text-gray-500">Avg: {row.avgLeavesPerEmployee}/emp</div>
        </div>
      )
    },
    {
      id: 'utilization',
      header: 'Utilization',
      accessor: 'utilizationRate',
      sortable: true,
      render: (v) => (
        <div className="text-sm">
          <div className={`font-semibold ${v >= 75 ? 'text-red-600' : v >= 60 ? 'text-orange-600' : 'text-green-600'}`}>
            {v}%
          </div>
          <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
            <div className={`${v >= 75 ? 'bg-red-500' : v >= 60 ? 'bg-orange-500' : 'bg-green-500'} h-1.5 rounded-full`} style={{ width: `${v}%` }}></div>
          </div>
        </div>
      )
    },
    {
      id: 'availability',
      header: 'Team Availability',
      accessor: 'teamAvailability',
      sortable: true,
      render: (v) => (
        <div className="text-sm">
          <div className="font-semibold text-green-600">{v}%</div>
          <div className="text-xs text-gray-500">available</div>
        </div>
      )
    },
    {
      id: 'pending',
      header: 'Pending',
      accessor: 'pendingApplications',
      sortable: true,
      render: (v) => (
        <div className="text-sm">
          <div className={`font-semibold ${v > 5 ? 'text-orange-600' : 'text-gray-900'}`}>{v}</div>
          <div className="text-xs text-gray-500">applications</div>
        </div>
      )
    },
    {
      id: 'topType',
      header: 'Most Used',
      accessor: 'topLeaveType',
      sortable: false,
      render: (v) => (
        <div className="text-sm">
          <div className="font-mono font-medium text-blue-600">{v}</div>
        </div>
      )
    }
  ];

  const overallStats = useMemo(() => {
    const totalEmployees = mockDepartmentData.reduce((sum, d) => sum + d.totalEmployees, 0);
    const totalLeaves = mockDepartmentData.reduce((sum, d) => sum + d.totalLeaveDays, 0);
    const totalPending = mockDepartmentData.reduce((sum, d) => sum + d.pendingApplications, 0);
    const avgUtilization = mockDepartmentData.reduce((sum, d) => sum + d.utilizationRate, 0) / mockDepartmentData.length;
    return { totalEmployees, totalLeaves, totalPending, avgUtilization };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-7 h-7 text-purple-600" />
            Department-wise Leave Report
          </h1>
          <p className="text-gray-600 mt-1">Analyze leave patterns and utilization across departments</p>
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
            <Users className="w-4 h-4" /> Total Employees
          </div>
          <div className="text-2xl font-bold text-gray-900">{overallStats.totalEmployees}</div>
          <div className="text-xs text-gray-500 mt-1">across {mockDepartmentData.length} departments</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Total Leaves
          </div>
          <div className="text-2xl font-bold text-blue-600">{overallStats.totalLeaves.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">days taken</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Utilization</div>
          <div className="text-2xl font-bold text-orange-600">{overallStats.avgUtilization.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">across all depts</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Pending
          </div>
          <div className="text-2xl font-bold text-purple-600">{overallStats.totalPending}</div>
          <div className="text-xs text-gray-500 mt-1">applications</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Department Summary</h2>
        </div>
        <DataTable data={mockDepartmentData} columns={columns} pagination={{ enabled: false }} sorting={{ enabled: true, defaultSort: { column: 'department', direction: 'asc' } }} emptyMessage="No department data found" />
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Type Distribution by Department</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-blue-600">EL</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-green-600">CL</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-red-600">SL</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-purple-600">PL</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-pink-600">ML</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-orange-600">CO</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaveTypeBreakdown.map(dept => (
                <tr key={dept.department} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.department}</td>
                  <td className="text-right py-3 px-4 text-blue-600">{dept.EL}</td>
                  <td className="text-right py-3 px-4 text-green-600">{dept.CL}</td>
                  <td className="text-right py-3 px-4 text-red-600">{dept.SL}</td>
                  <td className="text-right py-3 px-4 text-purple-600">{dept.PL}</td>
                  <td className="text-right py-3 px-4 text-pink-600">{dept.ML}</td>
                  <td className="text-right py-3 px-4 text-orange-600">{dept.CO}</td>
                  <td className="text-right py-3 px-4 font-semibold text-gray-900">
                    {dept.EL + dept.CL + dept.SL + dept.PL + dept.ML + dept.CO}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-gray-900">Total</td>
                <td className="text-right py-3 px-4 text-blue-600">{mockLeaveTypeBreakdown.reduce((s, d) => s + d.EL, 0)}</td>
                <td className="text-right py-3 px-4 text-green-600">{mockLeaveTypeBreakdown.reduce((s, d) => s + d.CL, 0)}</td>
                <td className="text-right py-3 px-4 text-red-600">{mockLeaveTypeBreakdown.reduce((s, d) => s + d.SL, 0)}</td>
                <td className="text-right py-3 px-4 text-purple-600">{mockLeaveTypeBreakdown.reduce((s, d) => s + d.PL, 0)}</td>
                <td className="text-right py-3 px-4 text-pink-600">{mockLeaveTypeBreakdown.reduce((s, d) => s + d.ML, 0)}</td>
                <td className="text-right py-3 px-4 text-orange-600">{mockLeaveTypeBreakdown.reduce((s, d) => s + d.CO, 0)}</td>
                <td className="text-right py-3 px-4 text-gray-900">
                  {mockLeaveTypeBreakdown.reduce((s, d) => s + d.EL + d.CL + d.SL + d.PL + d.ML + d.CO, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">High Utilization Departments</h2>
          <div className="space-y-3">
            {mockDepartmentData.filter(d => d.utilizationRate >= 70).sort((a, b) => b.utilizationRate - a.utilizationRate).map(dept => (
              <div key={dept.departmentId} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded ${dept.color}`}></div>
                    <div className="font-medium text-gray-900">{dept.departmentName}</div>
                  </div>
                  <div className="text-red-600 font-semibold">{dept.utilizationRate}%</div>
                </div>
                <div className="mt-2 text-xs text-gray-600 ml-4">
                  {dept.totalLeaveDays} days used • Team availability: {dept.teamAvailability}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Departments Requiring Attention</h2>
          <div className="space-y-3">
            {mockDepartmentData.filter(d => d.pendingApplications > 3 || d.teamAvailability < 90).map(dept => (
              <div key={dept.departmentId} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <div className="font-medium text-gray-900">{dept.departmentName}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-yellow-800 ml-6 space-y-1">
                  {dept.pendingApplications > 3 && <div>• {dept.pendingApplications} pending applications (needs attention)</div>}
                  {dept.teamAvailability < 90 && <div>• Team availability at {dept.teamAvailability}% (below threshold)</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          <Building className="w-5 h-5 inline mr-2" />
          Department Report Insights
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Department-wise leave consumption, utilization rate, and team availability metrics</li>
          <li>✓ Leave type distribution showing EL, CL, SL, PL, ML, and CO usage by department</li>
          <li>✓ Identification of high-utilization departments requiring resource planning</li>
          <li>✓ Pending applications tracking for timely approval workflow management</li>
          <li>✓ Average leaves per employee for inter-department comparison and benchmarking</li>
        </ul>
      </div>
    </div>
  );
}
