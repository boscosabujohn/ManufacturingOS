'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, Edit2, Trash2, Clock, Calendar, Users, Moon, Sun, Sunset } from 'lucide-react';

interface Shift {
  id: string;
  code: string;
  name: string;
  shiftType: 'day' | 'evening' | 'night';
  startTime: string;
  endTime: string;
  duration: number;
  breakTime: number;
  workingDays: string[];
  effectiveFrom: string;
  effectiveTo: string;
  assignedWorkers: number;
  status: 'active' | 'inactive' | 'scheduled';
  allowOvertimeAfter: number;
  shiftPremium: number;
}

export default function ShiftsSettingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock shifts data
  const shifts: Shift[] = [
    {
      id: 'SHIFT-001',
      code: 'DAY-SHIFT-A',
      name: 'Day Shift A',
      shiftType: 'day',
      startTime: '06:00',
      endTime: '14:00',
      duration: 8,
      breakTime: 60,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 45,
      status: 'active',
      allowOvertimeAfter: 8,
      shiftPremium: 0
    },
    {
      id: 'SHIFT-002',
      code: 'DAY-SHIFT-B',
      name: 'Day Shift B',
      shiftType: 'day',
      startTime: '08:00',
      endTime: '16:00',
      duration: 8,
      breakTime: 60,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 52,
      status: 'active',
      allowOvertimeAfter: 8,
      shiftPremium: 0
    },
    {
      id: 'SHIFT-003',
      code: 'EVE-SHIFT-A',
      name: 'Evening Shift A',
      shiftType: 'evening',
      startTime: '14:00',
      endTime: '22:00',
      duration: 8,
      breakTime: 60,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 38,
      status: 'active',
      allowOvertimeAfter: 8,
      shiftPremium: 10
    },
    {
      id: 'SHIFT-004',
      code: 'EVE-SHIFT-B',
      name: 'Evening Shift B',
      shiftType: 'evening',
      startTime: '16:00',
      endTime: '00:00',
      duration: 8,
      breakTime: 60,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 35,
      status: 'active',
      allowOvertimeAfter: 8,
      shiftPremium: 15
    },
    {
      id: 'SHIFT-005',
      code: 'NIGHT-SHIFT-A',
      name: 'Night Shift A',
      shiftType: 'night',
      startTime: '22:00',
      endTime: '06:00',
      duration: 8,
      breakTime: 60,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 28,
      status: 'active',
      allowOvertimeAfter: 8,
      shiftPremium: 25
    },
    {
      id: 'SHIFT-006',
      code: 'NIGHT-SHIFT-B',
      name: 'Night Shift B',
      shiftType: 'night',
      startTime: '00:00',
      endTime: '08:00',
      duration: 8,
      breakTime: 60,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 24,
      status: 'active',
      allowOvertimeAfter: 8,
      shiftPremium: 25
    },
    {
      id: 'SHIFT-007',
      code: 'WEEKEND-DAY',
      name: 'Weekend Day Shift',
      shiftType: 'day',
      startTime: '08:00',
      endTime: '20:00',
      duration: 12,
      breakTime: 90,
      workingDays: ['Sat', 'Sun'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 18,
      status: 'active',
      allowOvertimeAfter: 10,
      shiftPremium: 30
    },
    {
      id: 'SHIFT-008',
      code: 'WEEKEND-NIGHT',
      name: 'Weekend Night Shift',
      shiftType: 'night',
      startTime: '20:00',
      endTime: '08:00',
      duration: 12,
      breakTime: 90,
      workingDays: ['Sat', 'Sun'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 15,
      status: 'active',
      allowOvertimeAfter: 10,
      shiftPremium: 40
    },
    {
      id: 'SHIFT-009',
      code: 'MAINT-SHIFT',
      name: 'Maintenance Shift',
      shiftType: 'day',
      startTime: '08:00',
      endTime: '17:00',
      duration: 9,
      breakTime: 60,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      effectiveFrom: '2025-01-01',
      effectiveTo: '2025-12-31',
      assignedWorkers: 12,
      status: 'active',
      allowOvertimeAfter: 9,
      shiftPremium: 5
    },
    {
      id: 'SHIFT-010',
      code: 'TEMP-SHIFT-01',
      name: 'Temporary Shift',
      shiftType: 'day',
      startTime: '10:00',
      endTime: '18:00',
      duration: 8,
      breakTime: 60,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      effectiveFrom: '2025-10-01',
      effectiveTo: '2025-10-31',
      assignedWorkers: 0,
      status: 'scheduled',
      allowOvertimeAfter: 8,
      shiftPremium: 0
    }
  ];

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shift.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || shift.shiftType === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getShiftIcon = (shiftType: string) => {
    switch (shiftType) {
      case 'day': return <Sun className="w-4 h-4" />;
      case 'evening': return <Sunset className="w-4 h-4" />;
      case 'night': return <Moon className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getShiftTypeColor = (shiftType: string) => {
    switch (shiftType) {
      case 'day': return 'bg-yellow-100 text-yellow-700';
      case 'evening': return 'bg-orange-100 text-orange-700';
      case 'night': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Inline Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
            <p className="text-sm text-gray-500 mt-1">Configure and manage production shifts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Shift</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Shifts</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{shifts.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Clock className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Shifts</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {shifts.filter(shift => shift.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Calendar className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Workers</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {shifts.filter(s => s.status === 'active').reduce((sum, shift) => sum + shift.assignedWorkers, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Shift Types</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">
                {new Set(shifts.map(s => s.shiftType)).size}
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <Sunset className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Shift Types</option>
            <option value="day">Day Shift</option>
            <option value="evening">Evening Shift</option>
            <option value="night">Night Shift</option>
          </select>
        </div>
      </div>

      {/* Shifts List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Break</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Working Days</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Workers</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Premium</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">{shift.code}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{shift.name}</div>
                    <div className="text-xs text-gray-500">
                      Overtime after {shift.allowOvertimeAfter}h
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getShiftTypeColor(shift.shiftType)}`}>
                      {getShiftIcon(shift.shiftType)}
                      {shift.shiftType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {shift.startTime} - {shift.endTime}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-center">{shift.duration}h</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{shift.breakTime}m</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {shift.workingDays.map((day, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {day}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold text-gray-900">
                      <Users className="w-3 h-3 text-gray-400" />
                      {shift.assignedWorkers}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {shift.shiftPremium > 0 ? (
                      <span className="font-bold text-green-600">+{shift.shiftPremium}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}>
                      {shift.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredShifts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No shifts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
