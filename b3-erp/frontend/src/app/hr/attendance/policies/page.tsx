'use client';

import { FileText, Plus, Edit, Eye } from 'lucide-react';

export default function AttendancePoliciesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Attendance Policies
        </h1>
        <p className="text-gray-600 mt-2">Configure attendance rules and policies</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Policy
          </button>
        </div>
      </div>

      {/* Policies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Regular Working Hours Policy', type: 'Working Hours', status: 'Active' },
          { name: 'Flexi-Time Policy', type: 'Working Hours', status: 'Active' },
          { name: 'Late Arrival Policy', type: 'Tardiness', status: 'Active' },
          { name: 'Early Departure Policy', type: 'Tardiness', status: 'Active' },
          { name: 'Half-Day Policy', type: 'Leave', status: 'Active' },
          { name: 'Grace Period Policy', type: 'General', status: 'Active' },
        ].map((policy, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{policy.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{policy.type}</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {policy.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm">
                <Eye className="h-4 w-4" />
                View
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm">
                <Edit className="h-4 w-4" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
