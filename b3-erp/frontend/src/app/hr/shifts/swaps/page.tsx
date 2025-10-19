'use client';

import { RefreshCw, Plus, Check, X } from 'lucide-react';

export default function ShiftSwapsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <RefreshCw className="h-8 w-8 text-blue-600" />
          Shift Swaps
        </h1>
        <p className="text-gray-600 mt-2">Manage shift exchange requests between employees</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Pending Requests</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">8</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Approved</p>
          <p className="text-2xl font-bold text-green-900 mt-1">24</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-red-600 text-sm font-medium">Rejected</p>
          <p className="text-2xl font-bold text-red-900 mt-1">3</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">This Month</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">35</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Request Swap
          </button>
        </div>
      </div>

      {/* Swap Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Shift</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Shift</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">EMP{1001 + i}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                  <div className="text-sm text-gray-500">EMP{2001 + i}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Oct {15 + i}, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">General</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">Night</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' :
                    i % 3 === 1 ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Approved' : 'Rejected'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {i % 3 === 0 && (
                    <div className="flex gap-2">
                      <button className="text-green-600 hover:text-green-900">
                        <Check className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
