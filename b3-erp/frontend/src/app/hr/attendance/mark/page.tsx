'use client';

import { Clock, CheckCircle, XCircle, Calendar, MapPin, Camera } from 'lucide-react';

export default function MarkAttendancePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-8 w-8 text-blue-600" />
          Mark Attendance
        </h1>
        <p className="text-gray-600 mt-2">Check in and check out for daily attendance</p>
      </div>

      {/* Current Status Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-900">Current Status</h2>
            <p className="text-blue-600 text-sm">Friday, October 19, 2025</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-900">09:15 AM</div>
            <p className="text-sm text-blue-600">Current Time</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check In</p>
              <p className="text-lg font-semibold text-green-600">09:00 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">Checked In</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Working Hours</p>
              <p className="text-lg font-semibold text-blue-900">0h 15m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check In/Out Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="h-5 w-5" />
              Check In
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <XCircle className="h-5 w-5" />
              Check Out
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Camera className="h-5 w-5" />
              Mark with Selfie
            </button>
          </div>
        </div>

        {/* Location & Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Details</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">Head Office, Building A</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Shift</p>
                <p className="text-sm text-gray-600">General Shift (09:00 AM - 06:00 PM)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Expected Hours</p>
                <p className="text-sm text-gray-600">9 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's History */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">09:00 AM</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Check In</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Head Office</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Biometric Device #1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
