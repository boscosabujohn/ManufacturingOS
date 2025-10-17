'use client';

import { useState } from 'react';
import { Search, Filter, Download, CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity' | 'unpaid' | 'comp_off';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedOn: string;
  approvedBy: string | null;
  approvedOn: string | null;
  rejectionReason: string | null;
  balance: {
    sick: number;
    casual: number;
    annual: number;
  };
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LV-001',
    employeeId: 'EMP-1001',
    employeeName: 'Rajesh Kumar',
    department: 'Production',
    leaveType: 'sick',
    startDate: '2025-10-20',
    endDate: '2025-10-22',
    totalDays: 3,
    reason: 'Medical treatment for fever',
    status: 'approved',
    appliedOn: '2025-10-15',
    approvedBy: 'Production Manager',
    approvedOn: '2025-10-16',
    rejectionReason: null,
    balance: { sick: 7, casual: 12, annual: 18 },
  },
  {
    id: 'LV-002',
    employeeId: 'EMP-1002',
    employeeName: 'Priya Sharma',
    department: 'Quality Control',
    leaveType: 'annual',
    startDate: '2025-11-01',
    endDate: '2025-11-10',
    totalDays: 10,
    reason: 'Family vacation',
    status: 'pending',
    appliedOn: '2025-10-17',
    approvedBy: null,
    approvedOn: null,
    rejectionReason: null,
    balance: { sick: 10, casual: 10, annual: 20 },
  },
  {
    id: 'LV-003',
    employeeId: 'EMP-1003',
    employeeName: 'Amit Patel',
    department: 'Engineering',
    leaveType: 'casual',
    startDate: '2025-10-25',
    endDate: '2025-10-25',
    totalDays: 1,
    reason: 'Personal work',
    status: 'approved',
    appliedOn: '2025-10-16',
    approvedBy: 'Engineering Manager',
    approvedOn: '2025-10-17',
    rejectionReason: null,
    balance: { sick: 12, casual: 9, annual: 15 },
  },
  {
    id: 'LV-004',
    employeeId: 'EMP-1004',
    employeeName: 'Sneha Reddy',
    department: 'Finance',
    leaveType: 'maternity',
    startDate: '2025-11-15',
    endDate: '2026-03-15',
    totalDays: 120,
    reason: 'Maternity leave',
    status: 'approved',
    appliedOn: '2025-10-10',
    approvedBy: 'HR Manager',
    approvedOn: '2025-10-11',
    rejectionReason: null,
    balance: { sick: 10, casual: 12, annual: 18 },
  },
  {
    id: 'LV-005',
    employeeId: 'EMP-1005',
    employeeName: 'Vikram Singh',
    department: 'HR',
    leaveType: 'casual',
    startDate: '2025-10-30',
    endDate: '2025-10-31',
    totalDays: 2,
    reason: 'Family function',
    status: 'rejected',
    appliedOn: '2025-10-17',
    approvedBy: 'HR Manager',
    approvedOn: '2025-10-17',
    rejectionReason: 'Insufficient coverage during this period',
    balance: { sick: 8, casual: 12, annual: 16 },
  },
  {
    id: 'LV-006',
    employeeId: 'EMP-1006',
    employeeName: 'Kavita Desai',
    department: 'Procurement',
    leaveType: 'comp_off',
    startDate: '2025-10-28',
    endDate: '2025-10-28',
    totalDays: 1,
    reason: 'Compensatory off for weekend work',
    status: 'pending',
    appliedOn: '2025-10-17',
    approvedBy: null,
    approvedOn: null,
    rejectionReason: null,
    balance: { sick: 10, casual: 12, annual: 20 },
  },
];

export default function LeavePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLeaveRequests = mockLeaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesLeaveType = leaveTypeFilter === 'all' || request.leaveType === leaveTypeFilter;
    return matchesSearch && matchesStatus && matchesLeaveType;
  });

  const totalPages = Math.ceil(filteredLeaveRequests.length / itemsPerPage);
  const paginatedLeaveRequests = filteredLeaveRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: LeaveRequest['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
      cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getLeaveTypeBadge = (leaveType: LeaveRequest['leaveType']) => {
    const typeConfig = {
      sick: { label: 'Sick Leave', color: 'bg-red-50 text-red-700 border-red-100' },
      casual: { label: 'Casual Leave', color: 'bg-blue-50 text-blue-700 border-blue-100' },
      annual: { label: 'Annual Leave', color: 'bg-purple-50 text-purple-700 border-purple-100' },
      maternity: { label: 'Maternity', color: 'bg-pink-50 text-pink-700 border-pink-100' },
      paternity: { label: 'Paternity', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
      unpaid: { label: 'Unpaid', color: 'bg-gray-50 text-gray-700 border-gray-100' },
      comp_off: { label: 'Comp Off', color: 'bg-green-50 text-green-700 border-green-100' },
    };

    const config = typeConfig[leaveType];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const stats = [
    {
      title: 'Pending Requests',
      value: '18',
      change: '8 this week',
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      title: 'Approved',
      value: '124',
      change: 'This month',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Rejected',
      value: '5',
      change: 'This month',
      icon: XCircle,
      gradient: 'from-red-500 to-rose-600',
    },
    {
      title: 'Avg Leave Days',
      value: '12.5',
      change: 'Per employee/year',
      icon: CalendarDays,
      gradient: 'from-blue-500 to-cyan-600',
    },
  ];

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const gradientMap: { [key: string]: string } = {
              'from-yellow-500 to-orange-600': 'from-yellow-50 to-yellow-100',
              'from-green-500 to-emerald-600': 'from-green-50 to-green-100',
              'from-red-500 to-rose-600': 'from-red-50 to-red-100',
              'from-blue-500 to-cyan-600': 'from-blue-50 to-blue-100'
            }
            const borderMap: { [key: string]: string } = {
              'from-yellow-500 to-orange-600': 'border-yellow-200',
              'from-green-500 to-emerald-600': 'border-green-200',
              'from-red-500 to-rose-600': 'border-red-200',
              'from-blue-500 to-cyan-600': 'border-blue-200'
            }
            const textMap: { [key: string]: { title: string; value: string } } = {
              'from-yellow-500 to-orange-600': { title: 'text-yellow-600', value: 'text-yellow-900' },
              'from-green-500 to-emerald-600': { title: 'text-green-600', value: 'text-green-900' },
              'from-red-500 to-rose-600': { title: 'text-red-600', value: 'text-red-900' },
              'from-blue-500 to-cyan-600': { title: 'text-blue-600', value: 'text-blue-900' }
            }
            const iconMap: { [key: string]: string } = {
              'from-yellow-500 to-orange-600': 'text-yellow-600',
              'from-green-500 to-emerald-600': 'text-green-600',
              'from-red-500 to-rose-600': 'text-red-600',
              'from-blue-500 to-cyan-600': 'text-blue-600'
            }
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${gradientMap[stat.gradient]} rounded-lg p-4 border ${borderMap[stat.gradient]}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${textMap[stat.gradient].title}`}>{stat.title}</p>
                    <p className={`text-2xl font-bold mt-1 ${textMap[stat.gradient].value}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${iconMap[stat.gradient]}`} />
                </div>
              </div>
            )
          })}
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
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={leaveTypeFilter}
                  onChange={(e) => setLeaveTypeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Leave Types</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="annual">Annual Leave</option>
                  <option value="maternity">Maternity</option>
                  <option value="paternity">Paternity</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="comp_off">Comp Off</option>
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

        {/* Leave Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-24rem)]">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Days
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
                {paginatedLeaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{request.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        <div className="text-xs text-gray-500">{request.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{request.department}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLeaveTypeBadge(request.leaveType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{request.startDate}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{request.endDate}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{request.totalDays}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                        View
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-800 font-medium mr-3">
                            Approve
                          </button>
                          <button className="text-red-600 hover:text-red-800 font-medium">
                            Reject
                          </button>
                        </>
                      )}
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLeaveRequests.length)} of {filteredLeaveRequests.length} requests
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
