'use client';

import { Clock, Plus, Edit } from 'lucide-react';

export default function WorkingHoursPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-8 w-8 text-blue-600" />
          Working Hours Configuration
        </h1>
        <p className="text-gray-600 mt-2">Define standard working hours and schedules</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Working Hours List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Break Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { name: 'General Shift', start: '09:00 AM', end: '06:00 PM', hours: '9 hours', break: '1 hour' },
              { name: 'Flexi Shift', start: '10:00 AM', end: '07:00 PM', hours: '9 hours', break: '1 hour' },
              { name: 'Early Shift', start: '07:00 AM', end: '04:00 PM', hours: '9 hours', break: '1 hour' },
            ].map((schedule, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.start}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.end}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.hours}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.break}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Edit className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
