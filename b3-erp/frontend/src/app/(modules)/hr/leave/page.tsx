'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, CalendarDays, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import {
  LeaveService,
  LeaveApplication,
  LeaveApplicationStatus,
  LeaveTypeCode
} from '@/services/leave.service';

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

// Transform service leave application to page format
const transformLeaveApplication = (leave: LeaveApplication): LeaveRequest => {
  const statusMap: Record<LeaveApplicationStatus, LeaveRequest['status']> = {
    [LeaveApplicationStatus.PENDING]: 'pending',
    [LeaveApplicationStatus.APPROVED]: 'approved',
    [LeaveApplicationStatus.REJECTED]: 'rejected',
    [LeaveApplicationStatus.CANCELLED]: 'cancelled',
    [LeaveApplicationStatus.WITHDRAWN]: 'cancelled',
  };

  const leaveTypeMap: Record<LeaveTypeCode, LeaveRequest['leaveType']> = {
    [LeaveTypeCode.SICK]: 'sick',
    [LeaveTypeCode.CASUAL]: 'casual',
    [LeaveTypeCode.ANNUAL]: 'annual',
    [LeaveTypeCode.MATERNITY]: 'maternity',
    [LeaveTypeCode.PATERNITY]: 'paternity',
    [LeaveTypeCode.UNPAID]: 'unpaid',
    [LeaveTypeCode.COMPENSATORY]: 'comp_off',
    [LeaveTypeCode.BEREAVEMENT]: 'casual',
    [LeaveTypeCode.STUDY]: 'casual',
    [LeaveTypeCode.MARRIAGE]: 'casual',
  };

  return {
    id: leave.id,
    employeeId: leave.employeeCode || leave.employeeId,
    employeeName: leave.employeeName || 'Unknown',
    department: leave.departmentName || 'Unknown',
    leaveType: leave.leaveTypeCode ? leaveTypeMap[leave.leaveTypeCode] : 'casual',
    startDate: new Date(leave.startDate).toISOString().split('T')[0],
    endDate: new Date(leave.endDate).toISOString().split('T')[0],
    totalDays: leave.totalDays,
    reason: leave.reason,
    status: statusMap[leave.status],
    appliedOn: new Date(leave.appliedAt).toISOString().split('T')[0],
    approvedBy: leave.approverName || null,
    approvedOn: leave.approvedAt ? new Date(leave.approvedAt).toISOString().split('T')[0] : null,
    rejectionReason: leave.rejectionReason || null,
    balance: { sick: 10, casual: 12, annual: 20 }, // Default values - would come from balance service
  };
};

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    avgLeaveDays: 0
  });
  const itemsPerPage = 10;

  // Load leave applications from service
  useEffect(() => {
    const loadLeaveData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch leave applications and statistics
        const [applications, leaveStats] = await Promise.all([
          LeaveService.getLeaveApplications(),
          LeaveService.getStatistics()
        ]);

        setLeaveRequests(applications.map(transformLeaveApplication));

        // Calculate average leave days
        const totalDays = applications.reduce((sum, app) => sum + app.totalDays, 0);
        const avgDays = applications.length > 0 ? totalDays / applications.length : 0;

        setStats({
          pending: leaveStats.pendingApplications,
          approved: leaveStats.approvedApplications,
          rejected: leaveStats.rejectedApplications,
          avgLeaveDays: Math.round(avgDays * 10) / 10
        });
      } catch (err) {
        console.error('Error loading leave data:', err);
        setError('Failed to load leave requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadLeaveData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await LeaveService.approveLeave(id);
      // Refresh the data
      const applications = await LeaveService.getLeaveApplications();
      setLeaveRequests(applications.map(transformLeaveApplication));
    } catch (err) {
      console.error('Error approving leave:', err);
      alert('Failed to approve leave. Please try again.');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please enter the rejection reason:');
    if (reason) {
      try {
        await LeaveService.rejectLeave(id, reason);
        // Refresh the data
        const applications = await LeaveService.getLeaveApplications();
        setLeaveRequests(applications.map(transformLeaveApplication));
      } catch (err) {
        console.error('Error rejecting leave:', err);
        alert('Failed to reject leave. Please try again.');
      }
    }
  };

  const filteredLeaveRequests = leaveRequests.filter(request => {
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

  const statsCards = [
    {
      title: 'Pending Requests',
      value: stats.pending.toString(),
      change: 'Awaiting approval',
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      title: 'Approved',
      value: stats.approved.toString(),
      change: 'This period',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Rejected',
      value: stats.rejected.toString(),
      change: 'This period',
      icon: XCircle,
      gradient: 'from-red-500 to-rose-600',
    },
    {
      title: 'Avg Leave Days',
      value: stats.avgLeaveDays.toString(),
      change: 'Per request',
      icon: CalendarDays,
      gradient: 'from-blue-500 to-cyan-600',
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen px-3 py-2 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen px-3 py-2 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-red-500 text-lg font-medium">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-3 py-2">
      <div className="w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {statsCards.map((stat, index) => {
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
                className={`bg-gradient-to-br ${gradientMap[stat.gradient]} rounded-lg p-3 border ${borderMap[stat.gradient]}`}
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
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
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedLeaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{request.id}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        <div className="text-xs text-gray-500">{request.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{request.department}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {getLeaveTypeBadge(request.leaveType)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{request.startDate}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{request.endDate}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{request.totalDays}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                        View
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-800 font-medium mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
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
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 border-t border-gray-200">
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
