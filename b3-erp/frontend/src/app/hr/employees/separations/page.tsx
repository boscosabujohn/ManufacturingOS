'use client';

import { UserX, Calendar, FileText, AlertTriangle } from 'lucide-react';

export default function SeparationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserX className="h-8 w-8 text-red-600" />
          Employee Separations
        </h1>
        <p className="text-gray-600 mt-2">Manage employee exits and separations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-red-600 text-sm font-medium">This Month</p>
          <p className="text-2xl font-bold text-red-900 mt-1">5</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-orange-600 text-sm font-medium">This Quarter</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">18</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Notice Period</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">12</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Attrition Rate</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">4.2%</p>
        </div>
      </div>

      {/* Recent Separations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Separations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Working Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Alice Brown', dept: 'Engineering', reason: 'Resignation', date: '2024-01-31', status: 'Clearance Pending' },
                { name: 'Bob Wilson', dept: 'Sales', reason: 'Better Opportunity', date: '2024-01-28', status: 'Cleared' },
                { name: 'Carol Davis', dept: 'Marketing', reason: 'Relocation', date: '2024-01-25', status: 'Cleared' },
              ].map((sep, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sep.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{sep.dept}</td>
                  <td className="px-6 py-4 text-gray-600">{sep.reason}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {sep.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sep.status === 'Cleared' ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {sep.status}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        {sep.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
