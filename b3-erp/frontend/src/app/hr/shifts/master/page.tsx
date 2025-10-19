'use client';

import { Clock, Plus, Edit, Trash2 } from 'lucide-react';

export default function ShiftMasterPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-8 w-8 text-blue-600" />
          Shift Master
        </h1>
        <p className="text-gray-600 mt-2">Define and manage work shift templates</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Shift
          </button>
        </div>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'General Shift', start: '09:00 AM', end: '06:00 PM', break: '1 hour', color: 'blue' },
          { name: 'Night Shift', start: '10:00 PM', end: '07:00 AM', break: '1 hour', color: 'purple' },
          { name: 'Morning Shift', start: '06:00 AM', end: '03:00 PM', break: '30 mins', color: 'green' },
          { name: 'Evening Shift', start: '03:00 PM', end: '12:00 AM', break: '30 mins', color: 'orange' },
          { name: 'Weekend Shift', start: '10:00 AM', end: '07:00 PM', break: '1 hour', color: 'red' },
          { name: 'Flexi Shift', start: '10:00 AM', end: '07:00 PM', break: '1 hour', color: 'teal' },
        ].map((shift, i) => (
          <div key={i} className={`bg-gradient-to-br from-${shift.color}-50 to-${shift.color}-100 rounded-lg shadow-sm border border-${shift.color}-200 p-6`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{shift.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800`}>Active</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Start Time:</span>
                <span className="text-sm font-medium text-gray-900">{shift.start}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">End Time:</span>
                <span className="text-sm font-medium text-gray-900">{shift.end}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Break:</span>
                <span className="text-sm font-medium text-gray-900">{shift.break}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button className="px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
