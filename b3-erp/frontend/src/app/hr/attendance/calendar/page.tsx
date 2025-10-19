'use client';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AttendanceCalendarPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          Attendance Calendar
        </h1>
        <p className="text-gray-600 mt-2">Calendar view of attendance records</p>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">October 2025</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
          {[...Array(35)].map((_, i) => {
            const day = i - 2; // Start from 1st (3rd position)
            const isValidDay = day > 0 && day <= 31;
            return (
              <div
                key={i}
                className={`aspect-square border border-gray-200 rounded-lg p-2 ${
                  isValidDay ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                }`}
              >
                {isValidDay && (
                  <>
                    <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    <div className="text-xs">
                      <span className="inline-block w-full text-center py-1 rounded bg-green-100 text-green-800 font-semibold">
                        P
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-green-100 text-green-800 text-xs font-semibold flex items-center justify-center">P</span>
            <span className="text-sm text-gray-700">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-red-100 text-red-800 text-xs font-semibold flex items-center justify-center">A</span>
            <span className="text-sm text-gray-700">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold flex items-center justify-center">L</span>
            <span className="text-sm text-gray-700">Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-blue-100 text-blue-800 text-xs font-semibold flex items-center justify-center">H</span>
            <span className="text-sm text-gray-700">Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
