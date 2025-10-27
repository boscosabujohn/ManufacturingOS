'use client';

import React, { useState, useMemo } from 'react';
import { History, Search, Filter, Download, X } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface LeaveRecord {
  id: string;
  leaveType: string;
  leaveTypeCode: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'approved' | 'rejected' | 'cancelled';
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
}

const mockLeaveHistory: LeaveRecord[] = [
  { id: 'L001', leaveType: 'Earned Leave', leaveTypeCode: 'EL', fromDate: '2025-01-15', toDate: '2025-01-17', days: 3, reason: 'Personal work', status: 'approved', appliedOn: '2025-01-10', approvedBy: 'Rajesh Kumar', approvedOn: '2025-01-11' },
  { id: 'L002', leaveType: 'Casual Leave', leaveTypeCode: 'CL', fromDate: '2024-12-20', toDate: '2024-12-20', days: 1, reason: 'Medical checkup', status: 'approved', appliedOn: '2024-12-18', approvedBy: 'Rajesh Kumar', approvedOn: '2024-12-19' },
  { id: 'L003', leaveType: 'Sick Leave', leaveTypeCode: 'SL', fromDate: '2024-11-28', toDate: '2024-11-29', days: 2, reason: 'Fever and cold', status: 'approved', appliedOn: '2024-11-28', approvedBy: 'Rajesh Kumar', approvedOn: '2024-11-28' },
  { id: 'L004', leaveType: 'Earned Leave', leaveTypeCode: 'EL', fromDate: '2024-10-10', toDate: '2024-10-12', days: 3, reason: 'Family function', status: 'approved', appliedOn: '2024-10-05', approvedBy: 'Rajesh Kumar', approvedOn: '2024-10-06' },
  { id: 'L005', leaveType: 'Privilege Leave', leaveTypeCode: 'PL', fromDate: '2024-09-25', toDate: '2024-09-25', days: 1, reason: 'Personal emergency', status: 'rejected', appliedOn: '2024-09-24', approvedBy: 'Rajesh Kumar', approvedOn: '2024-09-24', rejectionReason: 'Insufficient PL balance' },
  { id: 'L006', leaveType: 'Casual Leave', leaveTypeCode: 'CL', fromDate: '2024-08-15', toDate: '2024-08-16', days: 2, reason: 'Attending workshop', status: 'approved', appliedOn: '2024-08-10', approvedBy: 'Rajesh Kumar', approvedOn: '2024-08-11' },
  { id: 'L007', leaveType: 'Earned Leave', leaveTypeCode: 'EL', fromDate: '2024-07-01', toDate: '2024-07-05', days: 5, reason: 'Vacation', status: 'approved', appliedOn: '2024-06-20', approvedBy: 'Rajesh Kumar', approvedOn: '2024-06-22' },
  { id: 'L008', leaveType: 'Comp Off', leaveTypeCode: 'CO', fromDate: '2024-06-10', toDate: '2024-06-10', days: 1, reason: 'Compensatory off for weekend work', status: 'approved', appliedOn: '2024-06-08', approvedBy: 'Rajesh Kumar', approvedOn: '2024-06-09' }
];

export default function LeaveHistoryPage() {
  const [leaveHistory] = useState<LeaveRecord[]>(mockLeaveHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return leaveHistory.filter(leave => {
      const matchesSearch = leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) || leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
      const matchesType = filterType === 'all' || leave.leaveTypeCode === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaveHistory, searchTerm, filterStatus, filterType]);

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <StatusBadge status="success" text="Approved" />;
    if (status === 'rejected') return <StatusBadge status="error" text="Rejected" />;
    return <StatusBadge status="warning" text="Cancelled" />;
  };

  const columns: Column<LeaveRecord>[] = [
    {
      id: 'leaveType',
      header: 'Leave Type',
      accessor: 'leaveType',
      sortable: true,
      render: (v, row) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.leaveTypeCode}</div>
        </div>
      )
    },
    {
      id: 'period',
      header: 'Period',
      accessor: 'fromDate',
      sortable: true,
      render: (v, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(v).toLocaleDateString()} - {new Date(row.toDate).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">{row.days} {row.days === 1 ? 'day' : 'days'}</div>
        </div>
      )
    },
    {
      id: 'reason',
      header: 'Reason',
      accessor: 'reason',
      sortable: false,
      render: (v) => <div className="text-sm text-gray-700 max-w-xs truncate" title={v}>{v}</div>
    },
    {
      id: 'appliedOn',
      header: 'Applied On',
      accessor: 'appliedOn',
      sortable: true,
      render: (v) => <div className="text-sm text-gray-600">{new Date(v).toLocaleDateString()}</div>
    },
    {
      id: 'approver',
      header: 'Approver',
      accessor: 'approvedBy',
      sortable: false,
      render: (v, row) => (
        <div className="text-xs">
          {v && <div className="text-gray-900">{v}</div>}
          {row.approvedOn && <div className="text-gray-500">{new Date(row.approvedOn).toLocaleDateString()}</div>}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (v, row) => (
        <div>
          {getStatusBadge(v)}
          {row.rejectionReason && <div className="text-xs text-red-600 mt-1">{row.rejectionReason}</div>}
        </div>
      )
    }
  ];

  const stats = useMemo(() => {
    const approved = leaveHistory.filter(l => l.status === 'approved').length;
    const rejected = leaveHistory.filter(l => l.status === 'rejected').length;
    const totalDays = leaveHistory.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.days, 0);
    return { total: leaveHistory.length, approved, rejected, totalDays };
  }, [leaveHistory]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
  };

  const activeFilterCount = [filterStatus !== 'all', filterType !== 'all', searchTerm !== ''].filter(Boolean).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-7 h-7 text-blue-600" />
            Leave History
          </h1>
          <p className="text-gray-600 mt-1">View your complete leave records and history</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Total Applications</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Approved</div>
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Total Days Taken</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalDays}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by leave type or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="all">All Types</option>
                <option value="EL">Earned Leave</option>
                <option value="CL">Casual Leave</option>
                <option value="SL">Sick Leave</option>
                <option value="PL">Privilege Leave</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <DataTable
          data={filteredData}
          columns={columns}
          pagination={{ enabled: true, pageSize: 10 }}
          sorting={{ enabled: true, defaultSort: { column: 'appliedOn', direction: 'desc' } }}
          emptyMessage="No leave history found"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          <History className="w-5 h-5 inline mr-2" />
          Leave History Tracking
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Complete chronological history of all leave applications and their status</li>
          <li>✓ Approval workflow tracking with approver details and timestamps</li>
          <li>✓ Rejection reasons displayed for transparency and learning</li>
          <li>✓ Export functionality for personal records and compliance</li>
        </ul>
      </div>
    </div>
  );
}
