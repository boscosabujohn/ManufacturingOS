'use client';

import { useState, useMemo } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Search, Filter, Download, AlertCircle } from 'lucide-react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

interface DailyAttendance {
  id: string;
  employeeCode: string;
  name: string;
  department: string;
  designation: string;
  shift: string;
  checkIn: string;
  checkOut?: string;
  workHours?: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'week_off';
  lateBy?: number;
  location: string;
}

export default function DailyAttendancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate] = useState(new Date());

  const mockAttendance: DailyAttendance[] = [
    { id: '1', employeeCode: 'KMF2020001', name: 'Rajesh Kumar', department: 'Production', designation: 'Manager', shift: 'Day Shift', checkIn: '09:00 AM', checkOut: '06:00 PM', workHours: 9, status: 'present', location: 'Plant A' },
    { id: '2', employeeCode: 'KMF2019002', name: 'Meera Nair', department: 'Quality', designation: 'QC Head', shift: 'General', checkIn: '09:15 AM', checkOut: '06:15 PM', workHours: 9, status: 'late', lateBy: 15, location: 'Quality Lab' },
    { id: '3', employeeCode: 'KMF2021003', name: 'Arun Patel', department: 'IT', designation: 'Sr. Engineer', shift: 'Flexible', checkIn: '10:00 AM', checkOut: '07:00 PM', workHours: 9, status: 'present', location: 'IT Dept' },
    { id: '4', employeeCode: 'KMF2022004', name: 'Kavita Desai', department: 'HR', designation: 'Executive', shift: 'General', checkIn: '09:00 AM', checkOut: '02:00 PM', workHours: 5, status: 'half_day', location: 'HR Dept' },
    { id: '5', employeeCode: 'KMF2020005', name: 'Vikram Singh', department: 'Production', designation: 'Supervisor', shift: 'Night Shift', checkIn: '10:00 PM', checkOut: '06:00 AM', workHours: 8, status: 'present', location: 'Plant A' },
    { id: '6', employeeCode: 'KMF2018006', name: 'Priya Menon', department: 'Finance', designation: 'Accountant', shift: 'General', checkIn: '', status: 'on_leave', location: 'Finance' },
    { id: '7', employeeCode: 'KMF2019007', name: 'Suresh Babu', department: 'Logistics', designation: 'Manager', shift: 'Day Shift', checkIn: '', status: 'absent', location: 'Warehouse' },
    { id: '8', employeeCode: 'KMF2021008', name: 'Anjali Reddy', department: 'Marketing', designation: 'Executive', shift: 'General', checkIn: '09:30 AM', checkOut: '06:30 PM', workHours: 9, status: 'late', lateBy: 30, location: 'Marketing' },
  ];

  const departments = ['all', 'Production', 'Quality', 'IT', 'HR', 'Finance', 'Logistics', 'Marketing'];
  const statuses = ['all', 'present', 'absent', 'late', 'half_day', 'on_leave', 'week_off'];

  const filteredData = useMemo(() => {
    return mockAttendance.filter(att => {
      const matchesSearch = att.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          att.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || att.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || att.status === selectedStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const stats = useMemo(() => {
    const present = mockAttendance.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'half_day').length;
    const absent = mockAttendance.filter(a => a.status === 'absent').length;
    const late = mockAttendance.filter(a => a.status === 'late').length;
    const onLeave = mockAttendance.filter(a => a.status === 'on_leave').length;
    return { total: mockAttendance.length, present, absent, late, onLeave };
  }, []);

  const columns = [
    { key: 'employeeCode', label: 'Employee', sortable: true,
      render: (v: string, row: DailyAttendance) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">{row.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{v}</div>
          </div>
        </div>
      )
    },
    { key: 'department', label: 'Department', sortable: true,
      render: (v: string, row: DailyAttendance) => (
        <div><div className="font-medium text-gray-900">{v}</div><div className="text-xs text-gray-500">{row.designation}</div></div>
      )
    },
    { key: 'shift', label: 'Shift', sortable: true },
    { key: 'checkIn', label: 'Check In', sortable: true,
      render: (v: string, row: DailyAttendance) => (
        <div className="text-sm">
          {v ? (
            <div>
              <div className="font-medium text-gray-900">{v}</div>
              {row.lateBy && <div className="text-xs text-orange-600">Late by {row.lateBy} mins</div>}
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      )
    },
    { key: 'checkOut', label: 'Check Out', sortable: true,
      render: (v?: string) => v ? <div className="font-medium text-gray-900">{v}</div> : <span className="text-gray-400">-</span>
    },
    { key: 'workHours', label: 'Hours', sortable: true,
      render: (v?: number) => v ? <div className="font-semibold text-blue-600">{v}h</div> : <span className="text-gray-400">-</span>
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => <StatusBadge status={v} />
    },
    { key: 'location', label: 'Location', sortable: true }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          Daily Attendance
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage today's attendance - {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.present / stats.total) * 100).toFixed(1)}% of total</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.absent / stats.total) * 100).toFixed(1)}% of total</p>
            </div>
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.late / stats.total) * 100).toFixed(1)}% of total</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-blue-600">{stats.onLeave}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.onLeave / stats.total) * 100).toFixed(1)}% of total</p>
            </div>
            <Users className="h-10 w-10 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Alert for Absences */}
      {stats.absent > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Absent Employees Alert</h3>
              <p className="text-sm text-red-700">{stats.absent} employee{stats.absent > 1 ? 's are' : ' is'} absent today without leave approval. Please follow up.</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or employee code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status === 'all' ? 'All Status' : status.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}
