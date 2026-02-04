'use client';

import { useState } from 'react';
import { Clock, Plus, Edit, Users, Calendar, Sun, Moon, Coffee, CheckCircle, AlertCircle } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';
import StatusBadge, { BadgeStatus } from '@/components/StatusBadge';

interface WorkingSchedule {
  id: string;
  name: string;
  type: 'standard' | 'flexible' | 'shift' | 'part_time';
  startTime: string;
  endTime: string;
  breakDuration: number;
  workingHours: number;
  workingDays: string[];
  applicableTo: string;
  employeeCount: number;
  gracePeriod: number;
  status: 'active' | 'inactive';
  createdDate: string;
}

export default function WorkingHoursPage() {
  const [selectedSchedule, setSelectedSchedule] = useState<WorkingSchedule | null>(null);

  const mockSchedules: WorkingSchedule[] = [
    {
      id: 'SCH001',
      name: 'General Office Hours',
      type: 'standard',
      startTime: '09:00',
      endTime: '18:00',
      breakDuration: 60,
      workingHours: 9,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      applicableTo: 'Office Staff, Management',
      employeeCount: 45,
      gracePeriod: 15,
      status: 'active',
      createdDate: '2024-01-01'
    },
    {
      id: 'SCH002',
      name: 'Flexible Working Hours',
      type: 'flexible',
      startTime: '08:00',
      endTime: '22:00',
      breakDuration: 60,
      workingHours: 9,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      applicableTo: 'IT Department, Senior Management',
      employeeCount: 12,
      gracePeriod: 0,
      status: 'active',
      createdDate: '2024-01-01'
    },
    {
      id: 'SCH003',
      name: 'Production Day Shift',
      type: 'shift',
      startTime: '07:00',
      endTime: '16:00',
      breakDuration: 60,
      workingHours: 9,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      applicableTo: 'Production Workers - Day Shift',
      employeeCount: 35,
      gracePeriod: 5,
      status: 'active',
      createdDate: '2024-01-01'
    },
    {
      id: 'SCH004',
      name: 'Production Night Shift',
      type: 'shift',
      startTime: '22:00',
      endTime: '07:00',
      breakDuration: 60,
      workingHours: 9,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      applicableTo: 'Production Workers - Night Shift',
      employeeCount: 28,
      gracePeriod: 5,
      status: 'active',
      createdDate: '2024-01-01'
    },
    {
      id: 'SCH005',
      name: 'Part-Time Schedule',
      type: 'part_time',
      startTime: '10:00',
      endTime: '14:00',
      breakDuration: 0,
      workingHours: 4,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      applicableTo: 'Interns, Contract Staff',
      employeeCount: 8,
      gracePeriod: 10,
      status: 'active',
      createdDate: '2024-06-01'
    },
    {
      id: 'SCH006',
      name: 'Security 24/7 Shift',
      type: 'shift',
      startTime: '00:00',
      endTime: '08:00',
      breakDuration: 30,
      workingHours: 8,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      applicableTo: 'Security Personnel',
      employeeCount: 15,
      gracePeriod: 0,
      status: 'active',
      createdDate: '2024-01-01'
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      standard: <Sun className="w-5 h-5 text-blue-600" />,
      flexible: <Clock className="w-5 h-5 text-purple-600" />,
      shift: <Moon className="w-5 h-5 text-indigo-600" />,
      part_time: <Coffee className="w-5 h-5 text-orange-600" />
    };
    return icons[type as keyof typeof icons] || <Clock className="w-5 h-5 text-gray-600" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      standard: 'bg-blue-100 text-blue-700 border-blue-200',
      flexible: 'bg-purple-100 text-purple-700 border-purple-200',
      shift: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      part_time: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const columns: Column<WorkingSchedule>[] = [
    { id: 'name', accessor: 'name', label: 'Schedule Name', sortable: true,
      render: (v: string, row: WorkingSchedule) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-50">
            {getTypeIcon(row.type)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{v}</div>
            <div className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium border ${getTypeColor(row.type)}`}>
              {row.type.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>
      )
    },
    { id: 'startTime', accessor: 'startTime', label: 'Timings', sortable: true,
      render: (v: string, row: WorkingSchedule) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {formatTime(v)} - {formatTime(row.endTime)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {row.workingHours}h working • {row.breakDuration}min break
          </div>
        </div>
      )
    },
    { id: 'workingDays', accessor: 'workingDays', label: 'Working Days', sortable: false,
      render: (v: string[]) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{v.length} days/week</div>
          <div className="text-xs text-gray-500 mt-1">
            {v.length === 7 ? 'All days' : v.length === 6 ? 'Mon-Sat' : v.length === 5 ? 'Mon-Fri' : `${v.length} days`}
          </div>
        </div>
      )
    },
    { id: 'employeeCount', accessor: 'employeeCount', label: 'Employees', sortable: true,
      render: (v: number, row: WorkingSchedule) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-gray-900">{v}</span>
        </div>
      )
    },
    { id: 'gracePeriod', accessor: 'gracePeriod', label: 'Grace Period', sortable: true,
      render: (v: number) => (
        <div className="text-sm">
          {v > 0 ? (
            <span className="text-green-600 font-medium">{v} minutes</span>
          ) : (
            <span className="text-gray-500">None</span>
          )}
        </div>
      )
    },
    { id: 'status', accessor: 'status', label: 'Status', sortable: true,
      render: (v: string) => <StatusBadge status={v as BadgeStatus} />
    }
  ];

  const stats = {
    total: mockSchedules.length,
    active: mockSchedules.filter(s => s.status === 'active').length,
    totalEmployees: mockSchedules.reduce((sum, s) => sum + s.employeeCount, 0),
    avgHours: mockSchedules.reduce((sum, s) => sum + s.workingHours, 0) / mockSchedules.length
  };

  return (
    <div className="p-6">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-8 w-8 text-blue-600" />
          Working Hours Configuration
        </h1>
        <p className="text-gray-600 mt-2">Define and manage working schedules for different employee groups</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Schedules</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Calendar className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Schedules</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalEmployees}</p>
            </div>
            <Users className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Working Hours</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgHours.toFixed(1)}h</p>
            </div>
            <Clock className="h-10 w-10 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">All Working Schedules</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create New Schedule
          </button>
        </div>
      </div>

      {/* Schedules Table */}
      <DataTable data={mockSchedules} columns={columns} />

      {/* Schedule Types Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Sun className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Standard</h4>
              <p className="text-xs text-blue-700 mt-1">Fixed daily working hours for regular employees</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Clock className="w-6 h-6 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900">Flexible</h4>
              <p className="text-xs text-purple-700 mt-1">Flexible start/end times within defined window</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <Moon className="w-6 h-6 text-indigo-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-indigo-900">Shift</h4>
              <p className="text-xs text-indigo-700 mt-1">Rotating shifts for production and security</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <Coffee className="w-6 h-6 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900">Part-Time</h4>
              <p className="text-xs text-orange-700 mt-1">Reduced hours for contract and intern staff</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
