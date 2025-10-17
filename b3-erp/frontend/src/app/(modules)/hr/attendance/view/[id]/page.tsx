'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  TrendingUp,
  BarChart3,
  MapPin,
  Timer,
  Award,
} from 'lucide-react';

interface AttendanceRecord {
  date: string;
  dayOfWeek: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'half_day' | 'leave' | 'holiday';
  hoursWorked: number;
  overtime: number;
  lateBy: number;
  earlyLeave: number;
  location: string;
  remarks: string;
}

interface MonthSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  holidays: number;
  totalHours: number;
  overtimeHours: number;
  lateCount: number;
  attendancePercentage: number;
}

export default function ViewAttendancePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [activeTab, setActiveTab] = useState<'details' | 'summary' | 'analytics'>('details');

  // Mock employee info
  const employee = {
    id: params.id,
    employeeId: 'B3-001',
    name: 'Rajesh Kumar',
    department: 'Production',
    position: 'Production Manager',
  };

  // Mock attendance records
  const attendanceRecords: AttendanceRecord[] = [
    {
      date: '2024-01-20',
      dayOfWeek: 'Saturday',
      checkIn: '09:05',
      checkOut: '18:15',
      status: 'present',
      hoursWorked: 9.17,
      overtime: 0.17,
      lateBy: 5,
      earlyLeave: 0,
      location: 'Factory - Building A',
      remarks: '',
    },
    {
      date: '2024-01-19',
      dayOfWeek: 'Friday',
      checkIn: '08:58',
      checkOut: '18:02',
      status: 'present',
      hoursWorked: 9.07,
      overtime: 0.07,
      lateBy: 0,
      earlyLeave: 0,
      location: 'Factory - Building A',
      remarks: '',
    },
    {
      date: '2024-01-18',
      dayOfWeek: 'Thursday',
      checkIn: '09:10',
      checkOut: '18:20',
      status: 'present',
      hoursWorked: 9.17,
      overtime: 0.17,
      lateBy: 10,
      earlyLeave: 0,
      location: 'Factory - Building A',
      remarks: '',
    },
    {
      date: '2024-01-17',
      dayOfWeek: 'Wednesday',
      checkIn: '09:00',
      checkOut: '13:00',
      status: 'half_day',
      hoursWorked: 4.0,
      overtime: 0,
      lateBy: 0,
      earlyLeave: 300,
      location: 'Factory - Building A',
      remarks: 'Medical appointment',
    },
    {
      date: '2024-01-16',
      dayOfWeek: 'Tuesday',
      checkIn: '-',
      checkOut: '-',
      status: 'leave',
      hoursWorked: 0,
      overtime: 0,
      lateBy: 0,
      earlyLeave: 0,
      location: '-',
      remarks: 'Sick leave approved',
    },
    {
      date: '2024-01-15',
      dayOfWeek: 'Monday',
      checkIn: '08:55',
      checkOut: '18:00',
      status: 'present',
      hoursWorked: 9.08,
      overtime: 0.08,
      lateBy: 0,
      earlyLeave: 0,
      location: 'Factory - Building A',
      remarks: '',
    },
    {
      date: '2024-01-14',
      dayOfWeek: 'Sunday',
      checkIn: '-',
      checkOut: '-',
      status: 'holiday',
      hoursWorked: 0,
      overtime: 0,
      lateBy: 0,
      earlyLeave: 0,
      location: '-',
      remarks: 'Weekly off',
    },
  ];

  // Mock month summary
  const monthSummary: MonthSummary = {
    totalDays: 20,
    presentDays: 16,
    absentDays: 1,
    halfDays: 1,
    leaveDays: 1,
    holidays: 4,
    totalHours: 144.5,
    overtimeHours: 2.5,
    lateCount: 3,
    attendancePercentage: 94,
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'present':
        return { label: 'Present', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'absent':
        return { label: 'Absent', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> };
      case 'half_day':
        return { label: 'Half Day', color: 'bg-yellow-100 text-yellow-700', icon: <AlertTriangle className="w-4 h-4" /> };
      case 'leave':
        return { label: 'Leave', color: 'bg-blue-100 text-blue-700', icon: <Calendar className="w-4 h-4" /> };
      case 'holiday':
        return { label: 'Holiday', color: 'bg-purple-100 text-purple-700', icon: <Calendar className="w-4 h-4" /> };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: null };
    }
  };

  const handleBack = () => {
    router.push('/hr/attendance');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance Details</h1>
              <p className="text-gray-600 mt-1">
                {employee.name} ({employee.employeeId}) • {employee.position}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
            <CheckCircle2 className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{monthSummary.presentDays}</div>
            <div className="text-green-100 text-sm">Present Days</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white">
            <XCircle className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{monthSummary.absentDays}</div>
            <div className="text-red-100 text-sm">Absent Days</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{monthSummary.attendancePercentage}%</div>
            <div className="text-blue-100 text-sm">Attendance Rate</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <Clock className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{monthSummary.totalHours.toFixed(1)}</div>
            <div className="text-purple-100 text-sm">Total Hours</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
            <Timer className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{monthSummary.overtimeHours.toFixed(1)}</div>
            <div className="text-orange-100 text-sm">Overtime Hours</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Daily Details
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'summary'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly Summary
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Daily Details Tab */}
            {activeTab === 'details' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Attendance Records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Day</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Check In</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Check Out</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Hours</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attendanceRecords.map((record, index) => {
                        const statusConfig = getStatusConfig(record.status);
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-4 font-semibold text-gray-900">
                              {new Date(record.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </td>
                            <td className="px-4 py-4 text-gray-600">{record.dayOfWeek}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                {record.checkIn !== '-' && <Clock className="w-4 h-4 text-green-600" />}
                                <span className={`font-semibold ${record.checkIn !== '-' ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {record.checkIn}
                                </span>
                                {record.lateBy > 0 && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                                    Late {record.lateBy}m
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                {record.checkOut !== '-' && <Clock className="w-4 h-4 text-red-600" />}
                                <span className={`font-semibold ${record.checkOut !== '-' ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {record.checkOut}
                                </span>
                                {record.earlyLeave > 0 && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                                    Early {Math.floor(record.earlyLeave / 60)}h {record.earlyLeave % 60}m
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {record.hoursWorked > 0 ? (
                                <div>
                                  <div className="font-semibold text-gray-900">{record.hoursWorked.toFixed(2)} hrs</div>
                                  {record.overtime > 0 && (
                                    <div className="text-xs text-orange-600">+{record.overtime.toFixed(2)} OT</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${statusConfig.color}`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {record.remarks || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Summary</h3>

                {/* Attendance Breakdown */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Attendance Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Present Days</span>
                        <span className="font-bold text-green-600">{monthSummary.presentDays} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Absent Days</span>
                        <span className="font-bold text-red-600">{monthSummary.absentDays} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Half Days</span>
                        <span className="font-bold text-yellow-600">{monthSummary.halfDays} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Leave Days</span>
                        <span className="font-bold text-blue-600">{monthSummary.leaveDays} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Holidays</span>
                        <span className="font-bold text-purple-600">{monthSummary.holidays} days</span>
                      </div>
                      <div className="pt-3 border-t border-blue-300 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total Working Days</span>
                        <span className="font-bold text-blue-600">{monthSummary.totalDays} days</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      Work Hours Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Hours Worked</span>
                        <span className="font-bold text-purple-600">{monthSummary.totalHours.toFixed(1)} hrs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Overtime Hours</span>
                        <span className="font-bold text-orange-600">{monthSummary.overtimeHours.toFixed(1)} hrs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Average Hours/Day</span>
                        <span className="font-bold text-green-600">
                          {(monthSummary.totalHours / monthSummary.presentDays).toFixed(2)} hrs
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Late Count</span>
                        <span className="font-bold text-red-600">{monthSummary.lateCount} times</span>
                      </div>
                      <div className="pt-3 border-t border-purple-300 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Attendance Rate</span>
                        <span className="font-bold text-purple-600">{monthSummary.attendancePercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Attendance Performance
                  </h4>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-700">Attendance Rate</span>
                        <span className="font-bold text-green-600">{monthSummary.attendancePercentage}%</span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${monthSummary.attendancePercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      {monthSummary.attendancePercentage >= 95 ? (
                        <div>
                          <div className="text-4xl mb-2">🏆</div>
                          <div className="font-bold text-green-600">Excellent</div>
                        </div>
                      ) : monthSummary.attendancePercentage >= 85 ? (
                        <div>
                          <div className="text-4xl mb-2">⭐</div>
                          <div className="font-bold text-blue-600">Good</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl mb-2">📊</div>
                          <div className="font-bold text-yellow-600">Average</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance Analytics</h3>
                <div className="p-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Detailed analytics and charts coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
