'use client';

import { useState } from 'react';
import { BarChart3, Download, Filter, TrendingUp, Users, Clock, DollarSign, AlertCircle } from 'lucide-react';
import DataTable from '@/components/DataTable';

interface DepartmentOT {
  department: string;
  employees: number;
  totalHours: number;
  avgHoursPerEmployee: number;
  totalCost: number;
  approvedRequests: number;
  pendingRequests: number;
}

export default function OTReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockDepartmentData: DepartmentOT[] = [
    {
      department: 'Production',
      employees: 45,
      totalHours: 458,
      avgHoursPerEmployee: 10.2,
      totalCost: 114500,
      approvedRequests: 85,
      pendingRequests: 12
    },
    {
      department: 'Quality',
      employees: 18,
      totalHours: 189,
      avgHoursPerEmployee: 10.5,
      totalCost: 56700,
      approvedRequests: 34,
      pendingRequests: 5
    },
    {
      department: 'IT',
      employees: 12,
      totalHours: 145,
      avgHoursPerEmployee: 12.1,
      totalCost: 43500,
      approvedRequests: 26,
      pendingRequests: 3
    },
    {
      department: 'Logistics',
      employees: 22,
      totalHours: 234,
      avgHoursPerEmployee: 10.6,
      totalCost: 70200,
      approvedRequests: 42,
      pendingRequests: 6
    },
    {
      department: 'Finance',
      employees: 8,
      totalHours: 96,
      avgHoursPerEmployee: 12.0,
      totalCost: 33600,
      approvedRequests: 18,
      pendingRequests: 2
    },
    {
      department: 'HR',
      employees: 6,
      totalHours: 54,
      avgHoursPerEmployee: 9.0,
      totalCost: 16200,
      approvedRequests: 10,
      pendingRequests: 1
    },
    {
      department: 'Marketing',
      employees: 5,
      totalHours: 45,
      avgHoursPerEmployee: 9.0,
      totalCost: 13500,
      approvedRequests: 8,
      pendingRequests: 2
    }
  ];

  const overallStats = {
    totalHours: mockDepartmentData.reduce((sum, dept) => sum + dept.totalHours, 0),
    totalCost: mockDepartmentData.reduce((sum, dept) => sum + dept.totalCost, 0),
    totalEmployees: mockDepartmentData.reduce((sum, dept) => sum + dept.employees, 0),
    totalRequests: mockDepartmentData.reduce((sum, dept) => sum + dept.approvedRequests + dept.pendingRequests, 0),
    avgHoursPerEmployee: mockDepartmentData.reduce((sum, dept) => sum + dept.totalHours, 0) /
                         mockDepartmentData.reduce((sum, dept) => sum + dept.employees, 0)
  };

  const columns = [
    { key: 'department', label: 'Department', sortable: true,
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="font-semibold text-gray-900">{v}</div>
        </div>
      )
    },
    { key: 'employees', label: 'Employees', sortable: true,
      render: (v: number) => <div className="font-medium text-gray-900">{v}</div>
    },
    { key: 'totalHours', label: 'Total Hours', sortable: true,
      render: (v: number) => (
        <div className="flex items-center gap-1 text-blue-700">
          <Clock className="w-4 h-4" />
          <span className="font-bold">{v} hrs</span>
        </div>
      )
    },
    { key: 'avgHoursPerEmployee', label: 'Avg Hours/Employee', sortable: true,
      render: (v: number) => (
        <div className="font-medium text-gray-900">{v.toFixed(1)} hrs</div>
      )
    },
    { key: 'approvedRequests', label: 'Requests', sortable: true,
      render: (v: number, row: DepartmentOT) => (
        <div className="text-sm">
          <div className="text-green-700 font-medium">{v} Approved</div>
          {row.pendingRequests > 0 && (
            <div className="text-yellow-600">{row.pendingRequests} Pending</div>
          )}
        </div>
      )
    },
    { key: 'totalCost', label: 'Total Cost', sortable: true,
      render: (v: number) => (
        <div className="font-bold text-green-700">₹{v.toLocaleString('en-IN')}</div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Overtime Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive overtime analytics and cost analysis</p>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total OT Hours</p>
              <p className="text-2xl font-bold text-blue-600">{overallStats.totalHours}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <Clock className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-xl font-bold text-green-600">₹{overallStats.totalCost.toLocaleString('en-IN')}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg OT/Employee</p>
              <p className="text-2xl font-bold text-yellow-600">{overallStats.avgHoursPerEmployee.toFixed(1)} hrs</p>
              <p className="text-xs text-gray-500 mt-1">Per month</p>
            </div>
            <TrendingUp className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Employees</p>
              <p className="text-2xl font-bold text-purple-600">{overallStats.totalEmployees}</p>
              <p className="text-xs text-gray-500 mt-1">With OT this month</p>
            </div>
            <Users className="h-10 w-10 text-purple-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-indigo-600">{overallStats.totalRequests}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <BarChart3 className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Department-wise Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Department-wise Overtime Report</h2>
        <DataTable data={mockDepartmentData} columns={columns} />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top OT Departments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top Overtime Departments
          </h3>
          <div className="space-y-3">
            {mockDepartmentData
              .sort((a, b) => b.totalHours - a.totalHours)
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
                      <div className="text-xs text-gray-500">{dept.employees} employees</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{dept.totalHours} hrs</div>
                    <div className="text-xs text-gray-500">₹{dept.totalCost.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Cost Analysis
          </h3>
          <div className="space-y-4">
            {mockDepartmentData
              .sort((a, b) => b.totalCost - a.totalCost)
              .slice(0, 5)
              .map((dept) => {
                const percentage = (dept.totalCost / overallStats.totalCost) * 100;
                return (
                  <div key={dept.department}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{dept.department}</div>
                      <div className="text-sm font-semibold text-green-700">
                        ₹{dept.totalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total cost</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Key Insights</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Production department accounts for highest overtime hours ({mockDepartmentData.find(d => d.department === 'Production')?.totalHours} hrs)</li>
              <li>• Average overtime cost per employee is ₹{Math.round(overallStats.totalCost / overallStats.totalEmployees).toLocaleString('en-IN')}</li>
              <li>• IT department has the highest average OT hours per employee (12.1 hrs)</li>
              <li>• Total overtime cost increased by 12% compared to last month</li>
              <li>• {mockDepartmentData.reduce((sum, d) => sum + d.pendingRequests, 0)} overtime requests are pending approval</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
