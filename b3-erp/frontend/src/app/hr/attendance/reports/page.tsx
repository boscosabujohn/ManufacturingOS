'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Download, Filter, Calendar, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';

interface DepartmentReport {
  department: string;
  totalEmployees: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateMarks: number;
  attendanceRate: number;
  punctualityRate: number;
}

export default function AttendanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockDepartmentReports: DepartmentReport[] = [
    {
      department: 'Production',
      totalEmployees: 45,
      presentDays: 990,
      absentDays: 18,
      leaveDays: 32,
      lateMarks: 67,
      attendanceRate: 98.27,
      punctualityRate: 93.23
    },
    {
      department: 'Quality',
      totalEmployees: 12,
      presentDays: 264,
      absentDays: 3,
      leaveDays: 9,
      lateMarks: 15,
      attendanceRate: 98.91,
      punctualityRate: 94.32
    },
    {
      department: 'IT',
      totalEmployees: 8,
      presentDays: 176,
      absentDays: 0,
      leaveDays: 8,
      lateMarks: 5,
      attendanceRate: 100,
      punctualityRate: 97.16
    },
    {
      department: 'HR',
      totalEmployees: 5,
      presentDays: 110,
      absentDays: 1,
      leaveDays: 4,
      lateMarks: 3,
      attendanceRate: 99.10,
      punctualityRate: 97.27
    },
    {
      department: 'Finance',
      totalEmployees: 6,
      presentDays: 132,
      absentDays: 4,
      leaveDays: 6,
      lateMarks: 8,
      attendanceRate: 97.22,
      punctualityRate: 93.94
    },
    {
      department: 'Logistics',
      totalEmployees: 15,
      presentDays: 330,
      absentDays: 6,
      leaveDays: 12,
      lateMarks: 18,
      attendanceRate: 98.28,
      punctualityRate: 94.55
    },
    {
      department: 'Marketing',
      totalEmployees: 4,
      presentDays: 88,
      absentDays: 2,
      leaveDays: 2,
      lateMarks: 6,
      attendanceRate: 97.78,
      punctualityRate: 93.18
    }
  ];

  const overallStats = {
    totalEmployees: mockDepartmentReports.reduce((sum, dept) => sum + dept.totalEmployees, 0),
    avgAttendanceRate: mockDepartmentReports.reduce((sum, dept) => sum + dept.attendanceRate, 0) / mockDepartmentReports.length,
    avgPunctualityRate: mockDepartmentReports.reduce((sum, dept) => sum + dept.punctualityRate, 0) / mockDepartmentReports.length,
    totalLateMarks: mockDepartmentReports.reduce((sum, dept) => sum + dept.lateMarks, 0),
    totalAbsences: mockDepartmentReports.reduce((sum, dept) => sum + dept.absentDays, 0)
  };

  const columns: Column<DepartmentReport>[] = [
    { id: 'department', accessor: 'department', label: 'Department', sortable: true,
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="font-semibold text-gray-900">{v}</div>
        </div>
      )
    },
    { id: 'totalEmployees', accessor: 'totalEmployees', label: 'Employees', sortable: true,
      render: (v: number) => <div className="font-medium text-gray-900">{v}</div>
    },
    { id: 'presentDays', accessor: 'presentDays', label: 'Days Summary', sortable: true,
      render: (v: number, row: DepartmentReport) => (
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-medium">{v} Present</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600">{row.absentDays} Absent</span>
            <span className="text-blue-600">{row.leaveDays} Leave</span>
          </div>
        </div>
      )
    },
    { id: 'lateMarks', accessor: 'lateMarks', label: 'Late Marks', sortable: true,
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="font-medium text-gray-900">{v}</span>
        </div>
      )
    },
    { id: 'attendanceRate', accessor: 'attendanceRate', label: 'Attendance %', sortable: true,
      render: (v: number) => {
        const color = v >= 95 ? 'text-green-600 bg-green-50' : v >= 85 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
        return (
          <div className="text-sm">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${color}`}>
              {v >= 95 ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {v.toFixed(2)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${v}%` }}></div>
            </div>
          </div>
        );
      }
    },
    { id: 'punctualityRate', accessor: 'punctualityRate', label: 'Punctuality %', sortable: true,
      render: (v: number) => {
        const color = v >= 90 ? 'text-green-600 bg-green-50' : v >= 75 ? 'text-yellow-600 bg-yellow-50' : 'text-orange-600 bg-orange-50';
        return (
          <div className="text-sm">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${color}`}>
              {v >= 90 ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {v.toFixed(2)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${v}%` }}></div>
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Attendance Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive attendance analytics and insights</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="production">Production</option>
              <option value="quality">Quality</option>
              <option value="it">IT</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              More Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-indigo-600">{overallStats.totalEmployees}</p>
            </div>
            <Users className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-green-600">{overallStats.avgAttendanceRate.toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1">+2.3% vs last month</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Punctuality</p>
              <p className="text-2xl font-bold text-blue-600">{overallStats.avgPunctualityRate.toFixed(1)}%</p>
            </div>
            <CheckCircle className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late Arrivals</p>
              <p className="text-2xl font-bold text-yellow-600">{overallStats.totalLateMarks}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Absences</p>
              <p className="text-2xl font-bold text-red-600">{overallStats.totalAbsences}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>

      {/* Department-wise Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Department-wise Attendance Report</h2>
        <DataTable data={mockDepartmentReports} columns={columns} />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Performing Departments
          </h3>
          <div className="space-y-3">
            {mockDepartmentReports
              .sort((a, b) => b.attendanceRate - a.attendanceRate)
              .slice(0, 5)
              .map((dept, idx) => (
                <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-gray-200 text-gray-700' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{dept.department}</div>
                      <div className="text-xs text-gray-500">{dept.totalEmployees} employees</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{dept.attendanceRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Attendance</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Departments Needing Attention
          </h3>
          <div className="space-y-3">
            {mockDepartmentReports
              .sort((a, b) => b.lateMarks - a.lateMarks)
              .slice(0, 5)
              .map((dept) => (
                <div key={dept.department} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{dept.department}</div>
                    <div className="flex items-center gap-1 text-orange-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{dept.lateMarks}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Late marks this month</span>
                    <span className="text-orange-600 font-medium">
                      {dept.punctualityRate.toFixed(1)}% punctual
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
