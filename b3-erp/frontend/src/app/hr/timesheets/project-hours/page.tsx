'use client';

import { BarChart3, Download, Filter } from 'lucide-react';

export default function ProjectHoursPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Project Hours Tracking
        </h1>
        <p className="text-gray-600 mt-2">Monitor project-wise time allocation and utilization</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Projects</option>
              <option>Active Projects</option>
              <option>Completed Projects</option>
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
          <p className="text-blue-600 text-sm font-medium">Total Hours</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">3,456</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Billable Hours</p>
          <p className="text-2xl font-bold text-green-900 mt-1">2,890</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Active Projects</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">12</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Avg Hours/Project</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">288</p>
        </div>
      </div>

      {/* Project Hours Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Billable Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { name: 'Project Alpha', members: 8, total: 456, billable: 398, budget: 500, status: 'Active' },
              { name: 'Project Beta', members: 6, total: 378, billable: 345, budget: 400, status: 'Active' },
              { name: 'Project Gamma', members: 5, total: 289, billable: 278, budget: 300, status: 'Active' },
              { name: 'Project Delta', members: 4, total: 234, billable: 212, budget: 250, status: 'Active' },
              { name: 'Project Epsilon', members: 7, total: 412, billable: 389, budget: 450, status: 'Active' },
            ].map((project, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.members}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.total} hrs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.billable} hrs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.budget} hrs</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div
                        className={`h-2 rounded-full ${(project.total / project.budget) > 0.8 ? 'bg-red-600' : 'bg-green-600'}`}
                        style={{ width: `${Math.min((project.total / project.budget) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">{Math.round((project.total / project.budget) * 100)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {project.status}
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
