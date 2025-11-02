'use client';

import { useState } from 'react';
import { BarChart3, Calendar, Download, Filter, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';

interface DepartmentSummary {
  department: string;
  totalEmployees: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  avgHoursPerEmployee: number;
  attendance: number;
}

interface EmployeeTimesheet {
  employeeCode: string;
  employeeName: string;
  department: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  projectHours: number;
  punchHours: number;
  daysWorked: number;
}

export default function TimesheetReportsPage() {
  const [reportType, setReportType] = useState<'department' | 'employee' | 'project'>('department');
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock department summary data
  const departmentData: DepartmentSummary[] = [
    {
      department: 'Production',
      totalEmployees: 85,
      totalHours: 14960,
      regularHours: 13600,
      overtimeHours: 1360,
      avgHoursPerEmployee: 176,
      attendance: 98.5
    },
    {
      department: 'Assembly',
      totalEmployees: 62,
      totalHours: 10912,
      regularHours: 9920,
      overtimeHours: 992,
      avgHoursPerEmployee: 176,
      attendance: 97.2
    },
    {
      department: 'Quality Control',
      totalEmployees: 28,
      totalHours: 4928,
      regularHours: 4480,
      overtimeHours: 448,
      avgHoursPerEmployee: 176,
      attendance: 99.1
    },
    {
      department: 'Warehouse',
      totalEmployees: 45,
      totalHours: 7920,
      regularHours: 7200,
      overtimeHours: 720,
      avgHoursPerEmployee: 176,
      attendance: 96.8
    },
    {
      department: 'Packaging',
      totalEmployees: 38,
      totalHours: 6688,
      regularHours: 6080,
      overtimeHours: 608,
      avgHoursPerEmployee: 176,
      attendance: 98.0
    },
    {
      department: 'Engineering',
      totalEmployees: 15,
      totalHours: 2680,
      regularHours: 2400,
      overtimeHours: 280,
      avgHoursPerEmployee: 178.7,
      attendance: 99.5
    }
  ];

  // Mock employee timesheet data
  const employeeData: EmployeeTimesheet[] = [
    {
      employeeCode: 'KMF2020001',
      employeeName: 'Rajesh Kumar',
      department: 'Production',
      totalHours: 184,
      regularHours: 168,
      overtimeHours: 16,
      projectHours: 0,
      punchHours: 184,
      daysWorked: 22
    },
    {
      employeeCode: 'KMF2021005',
      employeeName: 'Priya Sharma',
      department: 'Engineering',
      totalHours: 192,
      regularHours: 160,
      overtimeHours: 32,
      projectHours: 192,
      punchHours: 0,
      daysWorked: 20
    },
    // Add more...
  ];

  const departmentColumns: Column<DepartmentSummary>[] = [
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (v: string) => <div className="font-semibold text-gray-900">{v}</div>
    },
    {
      key: 'totalEmployees',
      label: 'Employees',
      sortable: true,
      render: (v: number) => <div className="text-center font-medium text-blue-700">{v}</div>
    },
    {
      key: 'totalHours',
      label: 'Total Hours',
      sortable: true,
      render: (v: number) => <div className="text-right font-semibold text-gray-900">{v.toLocaleString()}</div>
    },
    {
      key: 'regularHours',
      label: 'Regular Hours',
      sortable: true,
      render: (v: number) => <div className="text-right text-green-700">{v.toLocaleString()}</div>
    },
    {
      key: 'overtimeHours',
      label: 'OT Hours',
      sortable: true,
      render: (v: number) => <div className="text-right text-orange-700 font-medium">{v.toLocaleString()}</div>
    },
    {
      key: 'avgHoursPerEmployee',
      label: 'Avg Hours/Employee',
      sortable: true,
      render: (v: number) => <div className="text-right text-purple-700">{v.toFixed(1)}</div>
    },
    {
      key: 'attendance',
      label: 'Attendance %',
      sortable: true,
      render: (v: number) => (
        <div className="text-center">
          <span className={`font-semibold ${v >= 98 ? 'text-green-700' : v >= 95 ? 'text-yellow-700' : 'text-red-700'}`}>
            {v.toFixed(1)}%
          </span>
        </div>
      )
    }
  ];

  const employeeColumns: Column<EmployeeTimesheet>[] = [
    {
      key: 'employeeCode',
      label: 'Employee Code',
      sortable: true,
      render: (v: string) => <div className="font-semibold text-gray-900">{v}</div>
    },
    {
      key: 'employeeName',
      label: 'Employee Name',
      sortable: true,
      render: (v: string, row: EmployeeTimesheet) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.department}</div>
        </div>
      )
    },
    {
      key: 'totalHours',
      label: 'Total Hours',
      sortable: true,
      render: (v: number) => <div className="text-right font-semibold text-blue-700">{v}</div>
    },
    {
      key: 'regularHours',
      label: 'Regular',
      sortable: true,
      render: (v: number) => <div className="text-right text-green-700">{v}</div>
    },
    {
      key: 'overtimeHours',
      label: 'Overtime',
      sortable: true,
      render: (v: number) => <div className="text-right text-orange-700 font-medium">{v}</div>
    },
    {
      key: 'projectHours',
      label: 'Project',
      sortable: true,
      render: (v: number) => <div className="text-right text-purple-700">{v}</div>
    },
    {
      key: 'punchHours',
      label: 'Punch',
      sortable: true,
      render: (v: number) => <div className="text-right text-indigo-700">{v}</div>
    },
    {
      key: 'daysWorked',
      label: 'Days Worked',
      sortable: true,
      render: (v: number) => <div className="text-center font-medium text-gray-700">{v}</div>
    }
  ];

  const totals = {
    employees: departmentData.reduce((sum, d) => sum + d.totalEmployees, 0),
    totalHours: departmentData.reduce((sum, d) => sum + d.totalHours, 0),
    regularHours: departmentData.reduce((sum, d) => sum + d.regularHours, 0),
    overtimeHours: departmentData.reduce((sum, d) => sum + d.overtimeHours, 0)
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Timesheet Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive reports for factory punch records and office project hours</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-blue-700">{totals.employees}</p>
              <p className="text-xs text-gray-500 mt-1">Across all departments</p>
            </div>
            <Users className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-green-700">{(totals.totalHours / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <Clock className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overtime Hours</p>
              <p className="text-3xl font-bold text-orange-700">{(totals.overtimeHours / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-500 mt-1">{((totals.overtimeHours / totals.totalHours) * 100).toFixed(1)}% of total</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Hours/Employee</p>
              <p className="text-3xl font-bold text-purple-700">{(totals.totalHours / totals.employees).toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Standard: 176 hrs/month</p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="department">Department Summary</option>
              <option value="employee">Employee Timesheet</option>
              <option value="project">Project Hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Production">Production</option>
              <option value="Assembly">Assembly</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Packaging">Packaging</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {reportType === 'department' ? 'Department-wise Summary' :
             reportType === 'employee' ? 'Employee Timesheet Report' :
             'Project Hours Report'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {reportType === 'department' ? 'Hours breakdown by department' :
             reportType === 'employee' ? 'Individual employee hour tracking' :
             'Project-wise hour allocation'}
          </p>
        </div>

        {reportType === 'department' && (
          <DataTable data={departmentData} columns={departmentColumns} />
        )}

        {reportType === 'employee' && (
          <DataTable data={employeeData} columns={employeeColumns} />
        )}

        {reportType === 'project' && (
          <div className="p-8 text-center text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Project Hours Report</p>
            <p className="text-sm mt-2">Project-wise hour allocation will be displayed here</p>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Key Insights</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Production has the highest overtime at {departmentData[0].overtimeHours} hours</li>
            <li>• Engineering has the best attendance rate at 99.5%</li>
            <li>• Overall overtime is {((totals.overtimeHours / totals.regularHours) * 100).toFixed(1)}% of regular hours</li>
            <li>• Average hours per employee: {(totals.totalHours / totals.employees).toFixed(1)} hrs/month</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-900 mb-3">Report Features</h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• <strong>Factory Workers:</strong> Punch in/out time tracking with break management</li>
            <li>• <strong>Office Staff:</strong> Project-based hour allocation and tracking</li>
            <li>• <strong>Overtime Calculation:</strong> Automatic OT computation beyond standard hours</li>
            <li>• <strong>Export Options:</strong> Download reports in Excel, PDF formats</li>
            <li>• <strong>Attendance Integration:</strong> Linked with attendance and leave systems</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
