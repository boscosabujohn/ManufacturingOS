'use client';

import { CheckCircle, Clock, Check, X, Eye } from 'lucide-react';

export default function TimesheetApprovalPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <CheckCircle className="h-8 w-8 text-blue-600" />
          Timesheet Approval
        </h1>
        <p className="text-gray-600 mt-2">Review and approve team timesheets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">12</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Approved This Week</p>
              <p className="text-2xl font-bold text-green-900 mt-1">45</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">1,856</p>
            </div>
            <Clock className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Pending Timesheets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Pending Timesheets</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Week</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">JD</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">John Doe</div>
                      <div className="text-sm text-gray-500">EMP{1000 + i}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Week 42</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{38 + i} hrs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{2 + (i % 3)} projects</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct {18 + (i % 3)}, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Check className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
