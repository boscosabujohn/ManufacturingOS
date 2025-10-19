'use client';

import { Calendar, Download, Filter, Search } from 'lucide-react';

export default function MonthlyAttendancePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          Monthly Attendance Register
        </h1>
        <p className="text-gray-600 mt-2">Complete monthly attendance records and analysis</p>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 items-center">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>October 2025</option>
              <option>September 2025</option>
              <option>August 2025</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>HR</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Total Days</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">31</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Present</p>
          <p className="text-2xl font-bold text-green-900 mt-1">24</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-red-600 text-sm font-medium">Absent</p>
          <p className="text-2xl font-bold text-red-900 mt-1">2</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Leave</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">3</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Holidays</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">2</p>
        </div>
      </div>

      {/* Monthly Register Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">Employee</th>
                {[...Array(31)].map((_, i) => (
                  <th key={i} className="px-2 py-3 text-center text-xs font-medium text-gray-500">{i + 1}</th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((emp) => (
                <tr key={emp} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                    <div className="text-sm font-medium text-gray-900">John Doe {emp}</div>
                    <div className="text-sm text-gray-500">EMP{1000 + emp}</div>
                  </td>
                  {[...Array(31)].map((_, i) => (
                    <td key={i} className="px-2 py-4 text-center">
                      <span className="inline-block w-6 h-6 rounded bg-green-100 text-green-800 text-xs font-semibold leading-6">P</span>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">24</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
