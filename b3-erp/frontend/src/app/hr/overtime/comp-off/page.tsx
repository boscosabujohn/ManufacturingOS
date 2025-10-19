'use client';

import { Calendar, Plus, Search } from 'lucide-react';

export default function CompensatoryOffPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          Compensatory Off
        </h1>
        <p className="text-gray-600 mt-2">Manage comp-off credits and utilization</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Available Comp-Off</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">3.5 days</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Earned This Month</p>
          <p className="text-2xl font-bold text-green-900 mt-1">1.5 days</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Used This Month</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">0.5 days</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Expiring Soon</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">1.0 day</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search comp-off records..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Apply Comp-Off
          </button>
        </div>
      </div>

      {/* Comp-Off History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Earned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Earned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Used</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sep {15 + i}, 2025</td>
                <td className="px-6 py-4 text-sm text-gray-600">Weekend work</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.0</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i % 3 === 0 ? '1.0' : '0.0'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i % 3 === 0 ? '0.0' : '1.0'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dec {15 + i}, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    i % 3 === 0 ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {i % 3 === 0 ? 'Used' : 'Available'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
