'use client';

import { BarChart3, Download, Filter } from 'lucide-react';

export default function OTReportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Overtime Reports
        </h1>
        <p className="text-gray-600 mt-2">Overtime analytics and cost analysis</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Production</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Total OT Hours</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">1,248</p>
          <p className="text-xs text-blue-600 mt-1">This month</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Total Cost</p>
          <p className="text-2xl font-bold text-green-900 mt-1">$45,680</p>
          <p className="text-xs text-green-600 mt-1">+12% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Avg OT/Employee</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">8.5 hrs</p>
          <p className="text-xs text-yellow-600 mt-1">Per month</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Employees</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">147</p>
          <p className="text-xs text-purple-600 mt-1">With OT this month</p>
        </div>
      </div>

      {/* Department-wise Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Department-wise Overtime</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Hours/Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { dept: 'Production', employees: 45, hours: 458, cost: 16890 },
              { dept: 'Engineering', employees: 32, hours: 312, cost: 12480 },
              { dept: 'Quality', employees: 18, hours: 189, cost: 7560 },
              { dept: 'Maintenance', employees: 22, hours: 234, cost: 8190 },
              { dept: 'IT', employees: 12, hours: 145, cost: 5800 },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.dept}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.employees}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.hours} hrs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(row.hours / row.employees).toFixed(1)} hrs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${row.cost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
