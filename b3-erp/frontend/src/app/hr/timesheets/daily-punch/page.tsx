'use client';

import { useState, useMemo } from 'react';
import { Clock, LogIn, LogOut, Coffee, Calendar, User, AlertCircle, CheckCircle, Timer } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

interface PunchRecord {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  totalHours: number;
  workHours: number;
  breakHours: number;
  status: 'in' | 'out' | 'on_break' | 'completed';
  overtimeHours?: number;
}

export default function DailyPunchPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([
    {
      id: '1',
      employeeCode: 'KMF2020001',
      employeeName: 'Rajesh Kumar',
      department: 'Production',
      date: selectedDate,
      punchIn: '09:00 AM',
      punchOut: null,
      breakStart: '01:00 PM',
      breakEnd: '01:30 PM',
      totalHours: 0,
      workHours: 4,
      breakHours: 0.5,
      status: 'in'
    },
    {
      id: '2',
      employeeCode: 'KMF2020015',
      employeeName: 'Priya Sharma',
      department: 'Quality Control',
      date: selectedDate,
      punchIn: '08:55 AM',
      punchOut: '05:00 PM',
      breakStart: '12:30 PM',
      breakEnd: '01:00 PM',
      totalHours: 8,
      workHours: 7.5,
      breakHours: 0.5,
      status: 'completed'
    },
    {
      id: '3',
      employeeCode: 'KMF2021003',
      employeeName: 'Amit Patel',
      department: 'Warehouse',
      date: selectedDate,
      punchIn: '09:05 AM',
      punchOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: 0,
      workHours: 4,
      breakHours: 0,
      status: 'in'
    },
    {
      id: '4',
      employeeCode: 'KMF2019012',
      employeeName: 'Sunita Verma',
      department: 'Assembly',
      date: selectedDate,
      punchIn: '08:50 AM',
      punchOut: null,
      breakStart: '12:45 PM',
      breakEnd: null,
      totalHours: 0,
      workHours: 0,
      breakHours: 0,
      status: 'on_break'
    },
    {
      id: '5',
      employeeCode: 'KMF2020028',
      employeeName: 'Deepak Singh',
      department: 'Production',
      date: selectedDate,
      punchIn: '09:00 AM',
      punchOut: '06:30 PM',
      breakStart: '01:00 PM',
      breakEnd: '01:45 PM',
      totalHours: 9.5,
      workHours: 8.75,
      breakHours: 0.75,
      status: 'completed',
      overtimeHours: 0.75
    }
  ]);

  const filteredRecords = useMemo(() => {
    return punchRecords.filter(record => {
      const matchesSearch =
        employeeSearch === '' ||
        record.employeeCode.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        record.employeeName.toLowerCase().includes(employeeSearch.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [punchRecords, employeeSearch, departmentFilter, statusFilter]);

  const stats = useMemo(() => {
    const today = punchRecords.filter(r => r.date === selectedDate);
    return {
      total: today.length,
      punchedIn: today.filter(r => r.status === 'in' || r.status === 'on_break').length,
      onBreak: today.filter(r => r.status === 'on_break').length,
      completed: today.filter(r => r.status === 'completed').length
    };
  }, [punchRecords, selectedDate]);

  const columns: Column<PunchRecord>[] = [
    {
      key: 'employeeCode',
      label: 'Employee Code',
      sortable: true,
      render: (v: string) => <div className="font-semibold text-gray-900">{v}</div>
    },
    {
      key: 'employeeName',
      label: 'Employee Name',
      sortable: true,
      render: (v: string, row: PunchRecord) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.department}</div>
        </div>
      )
    },
    {
      key: 'punchIn',
      label: 'Punch In',
      sortable: true,
      render: (v: string | null) => (
        <div className="flex items-center gap-2">
          {v ? (
            <>
              <LogIn className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{v}</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">Not punched</span>
          )}
        </div>
      )
    },
    {
      key: 'breakStart',
      label: 'Break Time',
      sortable: false,
      render: (_: any, row: PunchRecord) => (
        <div className="text-sm">
          {row.breakStart && row.breakEnd ? (
            <div className="flex items-center gap-1 text-yellow-700">
              <Coffee className="w-4 h-4" />
              <span>{row.breakStart} - {row.breakEnd}</span>
            </div>
          ) : row.breakStart ? (
            <div className="flex items-center gap-1 text-orange-600">
              <Coffee className="w-4 h-4" />
              <span>Started {row.breakStart}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">No break</span>
          )}
        </div>
      )
    },
    {
      key: 'punchOut',
      label: 'Punch Out',
      sortable: true,
      render: (v: string | null) => (
        <div className="flex items-center gap-2">
          {v ? (
            <>
              <LogOut className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">{v}</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">Not punched</span>
          )}
        </div>
      )
    },
    {
      key: 'workHours',
      label: 'Work Hours',
      sortable: true,
      render: (_: any, row: PunchRecord) => (
        <div>
          <div className="font-semibold text-blue-700">{row.workHours.toFixed(2)} hrs</div>
          {row.overtimeHours && row.overtimeHours > 0 && (
            <div className="text-xs text-orange-600">+{row.overtimeHours.toFixed(2)} OT</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (v: string) => {
        const statusMap: Record<string, any> = {
          'in': { status: 'active', text: 'Working' },
          'on_break': { status: 'warning', text: 'On Break' },
          'out': { status: 'inactive', text: 'Punched Out' },
          'completed': { status: 'success', text: 'Completed' }
        };
        const mapped = statusMap[v] || statusMap['out'];
        return <StatusBadge status={mapped.status} text={mapped.text} />;
      }
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-8 w-8 text-blue-600" />
          Daily Punch In/Out
        </h1>
        <p className="text-gray-600 mt-2">Factory workers time tracking - Punch in/out management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <User className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Currently Working</p>
              <p className="text-3xl font-bold text-green-700">{stats.punchedIn}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">On Break</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.onBreak}</p>
            </div>
            <Coffee className="w-12 h-12 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed Today</p>
              <p className="text-3xl font-bold text-purple-700">{stats.completed}</p>
            </div>
            <Timer className="w-12 h-12 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Employee
            </label>
            <input
              type="text"
              placeholder="Code or name..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Production">Production</option>
              <option value="Assembly">Assembly</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Packaging">Packaging</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="in">Currently Working</option>
              <option value="on_break">On Break</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert for employees not punched in */}
      {filteredRecords.filter(r => !r.punchIn && r.date === selectedDate).length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-900">Pending Punch In</h3>
              <p className="text-sm text-yellow-700">
                {filteredRecords.filter(r => !r.punchIn && r.date === selectedDate).length} employees haven't punched in yet today.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Punch Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Today's Punch Records ({filteredRecords.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time tracking of employee punch in/out times
          </p>
        </div>
        <DataTable data={filteredRecords} columns={columns} />
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Punch In/Out Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Punch In:</strong> Record start time when arriving at factory (tolerance: ±15 minutes)</li>
          <li>• <strong>Break Time:</strong> Log break start/end times (standard break: 30-60 minutes)</li>
          <li>• <strong>Punch Out:</strong> Record end time when leaving factory</li>
          <li>• <strong>Work Hours:</strong> Automatically calculated excluding break time</li>
          <li>• <strong>Overtime:</strong> Hours exceeding 8 hours/day are marked as OT</li>
          <li>• <strong>Bulk Entry:</strong> Supervisors can use "Bulk Punch Entry" for managing multiple workers</li>
        </ul>
      </div>
    </div>
  );
}
