'use client';

import { Briefcase, Plus, Edit, Trash2 } from 'lucide-react';

export default function DesignationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-purple-600" />
          Designations
        </h1>
        <p className="text-gray-600 mt-2">Manage job positions and roles</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-700">All Designations</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus className="h-4 w-4" />
            Add Designation
          </button>
        </div>
      </div>

      {/* Designations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { title: 'Senior Engineer', dept: 'Engineering', level: 'Senior', count: 45 },
              { title: 'Product Manager', dept: 'Product', level: 'Manager', count: 12 },
              { title: 'Sales Executive', dept: 'Sales', level: 'Executive', count: 67 },
              { title: 'HR Manager', dept: 'Human Resources', level: 'Manager', count: 3 },
              { title: 'QA Engineer', dept: 'Quality', level: 'Mid-Level', count: 28 },
            ].map((designation, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">{designation.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{designation.dept}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                    {designation.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{designation.count}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
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
