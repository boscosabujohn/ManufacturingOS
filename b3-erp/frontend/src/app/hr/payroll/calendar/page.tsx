'use client';

import { useState, useMemo } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';

interface PayrollCalendarEvent {
  id: string;
  monthYear: string;
  cutoffDate: string;
  attendanceFreeze: string;
  salaryProcessing: string;
  verificationDeadline: string;
  approvalDeadline: string;
  disbursementDate: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  notes?: string;
}

export default function PayrollCalendarPage() {
  const [selectedYear, setSelectedYear] = useState('2025');

  const mockCalendar: PayrollCalendarEvent[] = [
    {
      id: 'CAL-2025-12',
      monthYear: 'December 2025',
      cutoffDate: '2025-12-25',
      attendanceFreeze: '2025-12-26',
      salaryProcessing: '2025-12-27',
      verificationDeadline: '2025-12-28',
      approvalDeadline: '2025-12-29',
      disbursementDate: '2025-12-30',
      status: 'upcoming',
      notes: 'Year-end bonuses to be included'
    },
    {
      id: 'CAL-2025-11',
      monthYear: 'November 2025',
      cutoffDate: '2025-11-25',
      attendanceFreeze: '2025-11-26',
      salaryProcessing: '2025-11-27',
      verificationDeadline: '2025-11-28',
      approvalDeadline: '2025-11-28',
      disbursementDate: '2025-11-29',
      status: 'in_progress'
    },
    {
      id: 'CAL-2025-10',
      monthYear: 'October 2025',
      cutoffDate: '2025-10-25',
      attendanceFreeze: '2025-10-26',
      salaryProcessing: '2025-10-27',
      verificationDeadline: '2025-10-29',
      approvalDeadline: '2025-10-30',
      disbursementDate: '2025-10-31',
      status: 'completed'
    },
    {
      id: 'CAL-2025-09',
      monthYear: 'September 2025',
      cutoffDate: '2025-09-25',
      attendanceFreeze: '2025-09-26',
      salaryProcessing: '2025-09-27',
      verificationDeadline: '2025-09-28',
      approvalDeadline: '2025-09-29',
      disbursementDate: '2025-09-30',
      status: 'completed'
    }
  ];

  const filteredCalendar = useMemo(() => {
    return mockCalendar.filter(event => event.monthYear.includes(selectedYear));
  }, [selectedYear]);

  const stats = {
    upcoming: mockCalendar.filter(e => e.status === 'upcoming').length,
    inProgress: mockCalendar.filter(e => e.status === 'in_progress').length,
    completed: mockCalendar.filter(e => e.status === 'completed').length,
    nextDisbursement: mockCalendar.find(e => e.status === 'upcoming')?.disbursementDate
  };

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
    in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    completed: 'bg-green-100 text-green-700 border-green-200'
  };

  const statusIcons = {
    upcoming: <Clock className="h-4 w-4" />,
    in_progress: <AlertCircle className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Calendar</h1>
        <p className="text-sm text-gray-600 mt-1">Monthly payroll processing schedule and deadlines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.upcoming}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.inProgress}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Next Disbursement</p>
              <p className="text-sm font-bold text-purple-900 mt-1">
                {stats.nextDisbursement && new Date(stats.nextDisbursement).toLocaleDateString('en-IN')}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Calendar Entry
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCalendar.map(event => (
          <div key={event.id} className={`bg-white rounded-lg shadow-sm border-2 ${statusColors[event.status]} p-6`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{event.monthYear}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[event.status]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[event.status]}
                      {event.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </span>
                </div>
                {event.notes && (
                  <p className="text-sm text-gray-600 mt-1">📝 {event.notes}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Attendance Cutoff</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(event.cutoffDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Attendance Freeze</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(event.attendanceFreeze).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Salary Processing</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(event.salaryProcessing).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Verification Deadline</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(event.verificationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Approval Deadline</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(event.approvalDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs font-medium text-green-700 mb-1">💰 Disbursement Date</p>
                  <p className="text-sm font-bold text-green-900">
                    {new Date(event.disbursementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Processing window: {new Date(event.salaryProcessing).toLocaleDateString('en-IN')} - {new Date(event.disbursementDate).toLocaleDateString('en-IN')}
                </div>
                <div className="flex gap-2">
                  {event.status === 'upcoming' && (
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                      Edit Schedule
                    </button>
                  )}
                  {event.status === 'completed' && (
                    <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                      View Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Payroll Processing Timeline</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Day 25:</strong> Attendance cutoff - Last day for attendance marking</li>
          <li>• <strong>Day 26:</strong> Attendance freeze - No changes allowed after this date</li>
          <li>• <strong>Day 27:</strong> Salary processing - Payroll team processes salaries</li>
          <li>• <strong>Day 28:</strong> Verification deadline - Finance team verifies calculations</li>
          <li>• <strong>Day 29:</strong> Approval deadline - Management approves payroll</li>
          <li>• <strong>Day 30/31:</strong> Disbursement - Salaries credited to employee accounts</li>
        </ul>
      </div>
    </div>
  );
}
