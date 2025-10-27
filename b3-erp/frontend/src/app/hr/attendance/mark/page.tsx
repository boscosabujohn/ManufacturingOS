'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, MapPin, Camera, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';

export default function MarkAttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:00 AM');
  const [workingHours, setWorkingHours] = useState({ hours: 6, minutes: 15 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const todayLog = [
    { time: '09:00 AM', action: 'Check In', location: 'Head Office', device: 'Biometric Device #1', status: 'success' },
    { time: '01:00 PM', action: 'Break Out', location: 'Head Office', device: 'Mobile App', status: 'success' },
    { time: '02:00 PM', action: 'Break In', location: 'Head Office', device: 'Mobile App', status: 'success' }
  ];

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
            <p className="text-blue-600 text-sm">{currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-900">{formatTime(currentTime)}</div>
            <p className="text-sm text-blue-600">Current Time</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check In</p>
              <p className="text-lg font-semibold text-green-600">{checkInTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-lg font-semibold ${checkedIn ? 'text-green-600' : 'text-red-600'}`}>
                {checkedIn ? 'Checked In' : 'Not Checked In'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Working Hours</p>
              <p className="text-lg font-semibold text-blue-900">{workingHours.hours}h {workingHours.minutes}m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check In/Out Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            {!checkedIn ? (
              <button
                onClick={() => setCheckedIn(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-5 w-5" />
                Check In
              </button>
            ) : (
              <button
                onClick={() => setCheckedIn(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="h-5 w-5" />
                Check Out
              </button>
            )}
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Camera className="h-5 w-5" />
              Mark with Selfie
            </button>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Geo-fencing enabled</p>
                <p className="text-xs mt-1">You must be within 100m of office location</p>
              </div>
            </div>
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
                <p className="text-xs text-green-600 mt-1">✓ Within allowed radius</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Shift</p>
                <p className="text-sm text-gray-600">General Shift (09:00 AM - 06:00 PM)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Expected Hours</p>
                <p className="text-sm text-gray-600">9 hours (including 1hr break)</p>
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
              {todayLog.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      log.action.includes('In') ? 'bg-green-100 text-green-800' :
                      log.action.includes('Out') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Week Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 mb-1">Present</p>
          <p className="text-2xl font-bold text-green-800">4 days</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 mb-1">Absent</p>
          <p className="text-2xl font-bold text-red-800">0 days</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700 mb-1">Late</p>
          <p className="text-2xl font-bold text-yellow-800">1 day</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 mb-1">Avg Hours</p>
          <p className="text-2xl font-bold text-blue-800">8.5h</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700 mb-1">This Month</p>
          <p className="text-2xl font-bold text-purple-800">22 days</p>
        </div>
      </div>
    </div>
  );
}
