'use client';

import React, { useState, useMemo } from 'react';
import { DollarSign, Plus, Search, Filter, X, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface EncashmentRequest {
  id: string;
  requestDate: string;
  leaveType: string;
  leaveTypeCode: string;
  availableBalance: number;
  requestedDays: number;
  perDayRate: number;
  totalAmount: number;
  status: 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'processed';
  submittedOn?: string;
  approvedBy?: string;
  approvedOn?: string;
  processedOn?: string;
  paymentMode?: 'salary' | 'cheque' | 'bank_transfer';
  rejectionReason?: string;
  financialYear: string;
}

const mockEncashmentRequests: EncashmentRequest[] = [
  { id: 'ECR001', requestDate: '2025-10-20', leaveType: 'Earned Leave', leaveTypeCode: 'EL', availableBalance: 15, requestedDays: 10, perDayRate: 1200, totalAmount: 12000, status: 'submitted', submittedOn: '2025-10-20', financialYear: '2025-26' },
  { id: 'ECR002', requestDate: '2025-09-15', leaveType: 'Earned Leave', leaveTypeCode: 'EL', availableBalance: 12, requestedDays: 8, perDayRate: 1200, totalAmount: 9600, status: 'approved', submittedOn: '2025-09-15', approvedBy: 'Rajesh Kumar', approvedOn: '2025-09-18', paymentMode: 'salary', financialYear: '2025-26' },
  { id: 'ECR003', requestDate: '2025-08-10', leaveType: 'Privilege Leave', leaveTypeCode: 'PL', availableBalance: 10, requestedDays: 5, perDayRate: 1200, totalAmount: 6000, status: 'processed', submittedOn: '2025-08-10', approvedBy: 'Rajesh Kumar', approvedOn: '2025-08-12', processedOn: '2025-08-31', paymentMode: 'bank_transfer', financialYear: '2025-26' },
  { id: 'ECR004', requestDate: '2025-07-05', leaveType: 'Earned Leave', leaveTypeCode: 'EL', availableBalance: 18, requestedDays: 12, perDayRate: 1200, totalAmount: 14400, status: 'rejected', submittedOn: '2025-07-05', approvedBy: 'Rajesh Kumar', approvedOn: '2025-07-07', rejectionReason: 'Insufficient balance after upcoming planned leave', financialYear: '2025-26' },
  { id: 'ECR005', requestDate: '2025-06-20', leaveType: 'Comp Off', leaveTypeCode: 'CO', availableBalance: 3, requestedDays: 2, perDayRate: 1200, totalAmount: 2400, status: 'processed', submittedOn: '2025-06-20', approvedBy: 'Rajesh Kumar', approvedOn: '2025-06-21', processedOn: '2025-06-30', paymentMode: 'salary', financialYear: '2025-26' },
  { id: 'ECR006', requestDate: '2025-10-22', leaveType: 'Earned Leave', leaveTypeCode: 'EL', availableBalance: 15, requestedDays: 5, perDayRate: 1200, totalAmount: 6000, status: 'draft', financialYear: '2025-26' }
];

const leaveTypesForEncashment = [
  { code: 'ALL', name: 'All Types' },
  { code: 'EL', name: 'Earned Leave' },
  { code: 'PL', name: 'Privilege Leave' },
  { code: 'CO', name: 'Comp Off' }
];

export default function EncashmentRequestsPage() {
  const [requests, setRequests] = useState<EncashmentRequest[]>(mockEncashmentRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLeaveType, setFilterLeaveType] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  const filteredData = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) || req.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
      const matchesType = filterLeaveType === 'ALL' || req.leaveTypeCode === filterLeaveType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requests, searchTerm, filterStatus, filterLeaveType]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { status: string; text: string }> = {
      'draft': { status: 'default', text: 'Draft' },
      'submitted': { status: 'info', text: 'Submitted' },
      'pending_approval': { status: 'warning', text: 'Pending Approval' },
      'approved': { status: 'success', text: 'Approved' },
      'rejected': { status: 'error', text: 'Rejected' },
      'processed': { status: 'active', text: 'Processed' }
    };
    const config = statusMap[status] || { status: 'default', text: status };
    return <StatusBadge status={config.status as any} text={config.text} />;
  };

  const columns: Column<EncashmentRequest>[] = [
    {
      id: 'requestId',
      header: 'Request ID',
      accessor: 'id',
      sortable: true,
      render: (v, row) => (
        <div>
          <div className="font-mono font-semibold text-blue-600">{v}</div>
          <div className="text-xs text-gray-500">{new Date(row.requestDate).toLocaleDateString()}</div>
        </div>
      )
    },
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
      id: 'balance',
      header: 'Balance',
      accessor: 'availableBalance',
      sortable: true,
      render: (v, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{v} days</div>
          <div className="text-xs text-blue-600">Req: {row.requestedDays} days</div>
          {row.requestedDays > v && (
            <div className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Exceeds balance
            </div>
          )}
        </div>
      )
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: 'totalAmount',
      sortable: true,
      render: (v, row) => (
        <div className="text-sm">
          <div className="font-semibold text-green-600">₹{v.toLocaleString()}</div>
          <div className="text-xs text-gray-500">@₹{row.perDayRate}/day</div>
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
          {row.submittedOn && <div className="text-xs text-gray-500 mt-1">Submitted: {new Date(row.submittedOn).toLocaleDateString()}</div>}
          {row.rejectionReason && <div className="text-xs text-red-600 mt-1">{row.rejectionReason}</div>}
        </div>
      )
    },
    {
      id: 'approval',
      header: 'Approval',
      accessor: 'approvedBy',
      sortable: false,
      render: (v, row) => (
        <div className="text-xs">
          {v && (
            <>
              <div className="text-gray-900">{v}</div>
              {row.approvedOn && <div className="text-gray-500">{new Date(row.approvedOn).toLocaleDateString()}</div>}
            </>
          )}
          {row.processedOn && <div className="text-green-600 mt-1">Processed: {new Date(row.processedOn).toLocaleDateString()}</div>}
          {row.paymentMode && <div className="text-blue-600 capitalize">{row.paymentMode.replace('_', ' ')}</div>}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'draft' && (
            <>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">Submit</button>
            </>
          )}
          {row.status !== 'draft' && (
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
          )}
        </div>
      )
    }
  ];

  const stats = useMemo(() => {
    const totalRequested = requests.reduce((sum, r) => sum + r.totalAmount, 0);
    const approved = requests.filter(r => r.status === 'approved' || r.status === 'processed').length;
    const pending = requests.filter(r => r.status === 'submitted' || r.status === 'pending_approval').length;
    const processed = requests.filter(r => r.status === 'processed').reduce((sum, r) => sum + r.totalAmount, 0);
    return { total: requests.length, approved, pending, totalRequested, processed };
  }, [requests]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterLeaveType('ALL');
  };

  const activeFilterCount = [filterStatus !== 'all', filterLeaveType !== 'ALL', searchTerm !== ''].filter(Boolean).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-green-600" />
            Encashment Requests
          </h1>
          <p className="text-gray-600 mt-1">Apply for leave encashment and track your requests</p>
        </div>
        <button onClick={() => setShowNewRequestModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Approved</div>
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Total Requested
          </div>
          <div className="text-2xl font-bold text-blue-600">₹{(stats.totalRequested / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Processed</div>
          <div className="text-2xl font-bold text-purple-600">₹{(stats.processed / 1000).toFixed(0)}K</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by request ID or leave type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}>
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">{activeFilterCount}</span>}
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
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processed">Processed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
              <select value={filterLeaveType} onChange={(e) => setFilterLeaveType(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                {leaveTypesForEncashment.map(type => <option key={type.code} value={type.code}>{type.name}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <DataTable data={filteredData} columns={columns} pagination={{ enabled: true, pageSize: 10 }} sorting={{ enabled: true, defaultSort: { column: 'requestId', direction: 'desc' } }} emptyMessage="No encashment requests found" />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Encashment Eligibility & Rules
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1 ml-7">
          <li>✓ Only Earned Leave (EL), Privilege Leave (PL), and Comp Off (CO) are eligible for encashment</li>
          <li>✓ Maximum 50% of available balance can be encashed in a financial year</li>
          <li>✓ Minimum 5 days must be retained in your leave balance after encashment</li>
          <li>✓ Encashment amount is calculated based on your basic salary per day rate</li>
          <li>✓ Approved encashment is processed with the next salary cycle or via bank transfer</li>
          <li>✓ Tax deductions (TDS) apply as per Income Tax Act on encashment amount</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          <DollarSign className="w-5 h-5 inline mr-2" />
          Leave Encashment Process
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Submit encashment request with desired number of days from available balance</li>
          <li>✓ Manager approval required for all encashment requests</li>
          <li>✓ HR verification of balance and eligibility criteria</li>
          <li>✓ Finance processing with salary or separate bank transfer</li>
          <li>✓ Real-time tracking of request status and payment processing</li>
        </ul>
      </div>
    </div>
  );
}
