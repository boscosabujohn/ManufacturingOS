'use client';

import { Building2, Plus, Users, TrendingUp } from 'lucide-react';

export default function DepartmentsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="h-8 w-8 text-indigo-600" />
          Departments
        </h1>
        <p className="text-gray-600 mt-2">Manage organizational departments</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-700">All Departments</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        </div>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Engineering', head: 'Sarah Johnson', count: 145, color: 'blue' },
          { name: 'Sales', head: 'Michael Chen', count: 89, color: 'green' },
          { name: 'Marketing', head: 'Emily Davis', count: 42, color: 'purple' },
          { name: 'Finance', head: 'Robert Wilson', count: 38, color: 'yellow' },
          { name: 'Human Resources', head: 'Lisa Anderson', count: 25, color: 'pink' },
          { name: 'Operations', head: 'David Brown', count: 112, color: 'orange' },
        ].map((dept, i) => (
          <div key={i} className={`bg-gradient-to-br from-${dept.color}-50 to-${dept.color}-100 rounded-lg p-6 border border-${dept.color}-200 hover:shadow-lg transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
              <Building2 className={`h-10 w-10 text-${dept.color}-600`} />
              <span className={`px-3 py-1 bg-${dept.color}-200 text-${dept.color}-800 rounded-full text-xs font-semibold`}>
                Active
              </span>
            </div>
            <h3 className={`text-xl font-bold text-${dept.color}-900 mb-2`}>{dept.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Department Head: {dept.head}</p>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-300">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">{dept.count} Employees</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">+5%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
