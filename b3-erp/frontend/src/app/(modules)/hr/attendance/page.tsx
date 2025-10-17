'use client';

import { useState } from 'react';
import { Search, Filter, Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  workHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'work_from_home';
  lateBy: number; // minutes
  earlyExit: number; // minutes
  overtimeHours: number;
  location: string;
  remarks: string;
  approvedBy: string | null;
}

const mockAttendance: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    employeeId: 'EMP-1001',
    employeeName: 'Rajesh Kumar',
    department: 'Production',
    date: '2025-10-17',
    checkIn: '08:55',
    checkOut: '18:30',
    workHours: 9.5,
    status: 'present',
    lateBy: 0,
    earlyExit: 0,
    overtimeHours: 1.5,
    location: 'Factory Floor A',
    remarks: 'Overtime approved for urgent order',
    approvedBy: 'Production Manager',
  },
  {
    id: 'ATT-002',
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    department: 'Quality Control',
    date: '2025-10-17',
    checkIn: '09:15',
    checkOut: '17:45',
    workHours: 8.5,
    status: 'late',
    lateBy: 15,
    earlyExit: 0,
    overtimeHours: 0.5,
    location: 'QC Lab',
    remarks: 'Traffic delay notified',
    approvedBy: 'QC Head',
  },
  {
    id: 'ATT-003',
    employeeId: 'EMP-1003',
    employeeName: 'Amit Patel',
    department: 'Engineering',
    date: '2025-10-17',
    checkIn: '09:00',
    checkOut: null,
    workHours: 0,
    status: 'work_from_home',
    lateBy: 0,
    earlyExit: 0,
    overtimeHours: 0,
    location: 'Remote',
    remarks: 'WFH - Design review meeting',
    approvedBy: 'Engineering Manager',
  },
  {
    id: 'ATT-004',
    employeeId: 'EMP-1004',
    employeeName: 'Sneha Reddy',
    department: 'Finance',
    date: '2025-10-17',
    checkIn: '09:00',
    checkOut: '13:00',
    workHours: 4,
    status: 'half_day',
    lateBy: 0,
    earlyExit: 0,
    overtimeHours: 0,
    location: 'Finance Office',
    remarks: 'Medical appointment - approved half day',
    approvedBy: 'Finance Manager',
  },
  {
    id: 'ATT-005',
    employeeId: 'EMP-1005',
    employeeName: 'Vikram Singh',
    department: 'HR',
    date: '2025-10-17',
    checkIn: '-',
    checkOut: null,
    workHours: 0,
    status: 'on_leave',
    lateBy: 0,
    earlyExit: 0,
    overtimeHours: 0,
    location: '-',
    remarks: 'Planned leave - Sick leave',
    approvedBy: 'HR Manager',
  },
  {
    id: 'ATT-006',
    employeeId: 'EMP-1006',
    employeeName: 'Kavita Desai',
    department: 'Procurement',
    date: '2025-10-17',
    checkIn: '-',
    checkOut: null,
    workHours: 0,
    status: 'absent',
    lateBy: 0,
    earlyExit: 0,
    overtimeHours: 0,
    location: '-',
    remarks: 'Unplanned absence - pending justification',
    approvedBy: null,
  },
];

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAttendance = mockAttendance.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const paginatedAttendance = filteredAttendance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const statusConfig = {
      present: { label: 'Present', color: 'bg-green-100 text-green-800 border-green-200' },
      absent: { label: 'Absent', color: 'bg-red-100 text-red-800 border-red-200' },
      late: { label: 'Late', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      half_day: { label: 'Half Day', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      on_leave: { label: 'On Leave', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      work_from_home: { label: 'WFH', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const stats = [
    {
      title: 'Total Present',
      value: '142',
      change: '+8 from yesterday',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      title: 'On Leave',
      value: '12',
      change: 'Planned leaves',
      icon: AlertCircle,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Absent',
      value: '3',
      change: '2 unplanned',
      icon: XCircle,
      gradient: 'from-red-500 to-rose-600',
    },
    {
      title: 'Avg Work Hours',
      value: '8.5h',
      change: '+0.5h this week',
      icon: Clock,
      gradient: 'from-blue-500 to-cyan-600',
    },
  ];

  const departments = ['all', 'Production', 'Quality Control', 'Engineering', 'Finance', 'HR', 'Procurement'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance System</h1>
          <p className="text-gray-600">Time and attendance tracking for all employees</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, employee ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half_day">Half Day</option>
                  <option value="on_leave">On Leave</option>
                  <option value="work_from_home">Work From Home</option>
                </select>
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Work Hours
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{record.employeeId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{record.department}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{record.date}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{record.checkIn}</span>
                      {record.lateBy > 0 && (
                        <span className="ml-1 text-xs text-red-600">({record.lateBy}m late)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {record.checkOut || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{record.workHours}h</span>
                        {record.overtimeHours > 0 && (
                          <span className="ml-1 text-xs text-blue-600">(+{record.overtimeHours}h OT)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                        View
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAttendance.length)} of {filteredAttendance.length} records
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      currentPage === idx + 1
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-transparent'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
