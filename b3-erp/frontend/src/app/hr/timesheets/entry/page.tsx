'use client';

import { FileText, Plus, Save } from 'lucide-react';

export default function TimesheetEntryPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Timesheet Entry
        </h1>
        <p className="text-gray-600 mt-2">Log project hours and activities</p>
      </div>

      {/* Week Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Week 42: Oct 14 - Oct 20, 2025</option>
            <option>Week 41: Oct 7 - Oct 13, 2025</option>
          </select>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Submit for Approval
            </button>
          </div>
        </div>
      </div>

      {/* Timesheet Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">Project / Task</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mon<br/>14</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tue<br/>15</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Wed<br/>16</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thu<br/>17</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Fri<br/>18</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sat<br/>19</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sun<br/>20</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {['Project Alpha - Development', 'Project Beta - Testing', 'Project Gamma - Design'].map((project, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white">{project}</td>
                {[...Array(7)].map((_, day) => (
                  <td key={day} className="px-4 py-4 text-center">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      defaultValue={day < 5 ? 8 : 0}
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">40</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-6 py-4 text-sm text-gray-900 sticky left-0 bg-gray-50">Total Hours</td>
              {[...Array(7)].map((_, day) => (
                <td key={day} className="px-4 py-4 text-center text-sm font-bold text-gray-900">{day < 5 ? 8 : 0}</td>
              ))}
              <td className="px-6 py-4 text-center text-sm font-bold text-blue-900">40</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <div className="mt-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          <Plus className="h-4 w-4" />
          Add Project/Task
        </button>
      </div>
    </div>
  );
}
