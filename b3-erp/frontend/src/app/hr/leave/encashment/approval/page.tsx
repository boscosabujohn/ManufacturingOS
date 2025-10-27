'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle, Search, Filter, X, AlertCircle, DollarSign, Clock, User } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface EncashmentApproval {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  requestDate: string;
  leaveType: string;
  leaveTypeCode: string;
  availableBalance: number;
  requestedDays: number;
  perDayRate: number;
  totalAmount: number;
  status: 'pending_approval' | 'approved' | 'rejected';
  submittedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
  paymentMode?: 'salary' | 'cheque' | 'bank_transfer';
  financialYear: string;
  remarks?: string;
  eligibility: {
    isEligible: boolean;
    maxAllowed: number;
    minRetention: number;
    issues?: string[];
  };
}

const mockApprovalQueue: EncashmentApproval[] = [
  {
    id: 'ECR007', employeeId: 'EMP105', employeeName: 'Arjun Mehta', employeeCode: 'E105', department: 'Production', designation: 'Supervisor',
    requestDate: '2025-10-23', leaveType: 'Earned Leave', leaveTypeCode: 'EL', availableBalance: 18, requestedDays: 10,
    perDayRate: 1350, totalAmount: 13500, status: 'pending_approval', submittedOn: '2025-10-23', financialYear: '2025-26',
    eligibility: { isEligible: true, maxAllowed: 9, minRetention: 5 }
  },
  {
    id: 'ECR008', employeeId: 'EMP112', employeeName: 'Neha Kapoor', employeeCode: 'E112', department: 'Quality', designation: 'QC Inspector',
    requestDate: '2025-10-22', leaveType: 'Privilege Leave', leaveTypeCode: 'PL', availableBalance: 12, requestedDays: 6,
    perDayRate: 1200, totalAmount: 7200, status: 'pending_approval', submittedOn: '2025-10-22', financialYear: '2025-26',
    eligibility: { isEligible: true, maxAllowed: 6, minRetention: 5 }
  },
  {
    id: 'ECR009', employeeId: 'EMP089', employeeName: 'Rahul Singh', employeeCode: 'E089', department: 'Maintenance', designation: 'Technician',
    requestDate: '2025-10-21', leaveType: 'Earned Leave', leaveTypeCode: 'EL', availableBalance: 8, requestedDays: 7,
    perDayRate: 1100, totalAmount: 7700, status: 'pending_approval', submittedOn: '2025-10-21', financialYear: '2025-26',
    eligibility: { isEligible: false, maxAllowed: 4, minRetention: 5, issues: ['Requested days exceed maximum allowed (50% of balance)', 'Minimum 5 days must be retained'] }
  },
  {
    id: 'ECR010', employeeId: 'EMP134', employeeName: 'Divya Reddy', employeeCode: 'E134', department: 'HR', designation: 'HR Executive',
    requestDate: '2025-10-20', leaveType: 'Comp Off', leaveTypeCode: 'CO', availableBalance: 4, requestedDays: 2,
    perDayRate: 1250, totalAmount: 2500, status: 'pending_approval', submittedOn: '2025-10-20', financialYear: '2025-26',
    eligibility: { isEligible: true, maxAllowed: 2, minRetention: 0 }
  },
  {
    id: 'ECR011', employeeId: 'EMP076', employeeName: 'Manoj Kumar', employeeCode: 'E076', department: 'Production', designation: 'Operator',
    requestDate: '2025-10-19', leaveType: 'Earned Leave', leaveTypeCode: 'EL', availableBalance: 20, requestedDays: 8,
    perDayRate: 1050, totalAmount: 8400, status: 'approved', submittedOn: '2025-10-19', approvedBy: 'Rajesh Kumar', approvedOn: '2025-10-24', paymentMode: 'salary', financialYear: '2025-26',
    eligibility: { isEligible: true, maxAllowed: 10, minRetention: 5 }
  },
  {
    id: 'ECR012', employeeId: 'EMP098', employeeName: 'Pooja Sharma', employeeCode: 'E098', department: 'Stores', designation: 'Storekeeper',
    requestDate: '2025-10-18', leaveType: 'Earned Leave', leaveTypeCode: 'EL', availableBalance: 6, requestedDays: 5,
    perDayRate: 1150, totalAmount: 5750, status: 'rejected', submittedOn: '2025-10-18', approvedBy: 'Rajesh Kumar', approvedOn: '2025-10-24',
    rejectionReason: 'Insufficient balance - minimum retention not met', financialYear: '2025-26',
    eligibility: { isEligible: false, maxAllowed: 3, minRetention: 5, issues: ['Available balance below minimum retention requirement'] }
  }
];

const departments = ['All Departments', 'Production', 'Quality', 'Maintenance', 'HR', 'Stores'];

export default function EncashmentApprovalPage() {
  const [approvalQueue, setApprovalQueue] = useState<EncashmentApproval[]>(mockApprovalQueue);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('All Departments');
  const [filterStatus, setFilterStatus] = useState<string>('pending_approval');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return approvalQueue.filter(req => {
      const matchesSearch = req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || req.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) || req.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = filterDepartment === 'All Departments' || req.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [approvalQueue, searchTerm, filterDepartment, filterStatus]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { status: string; text: string }> = {
      'pending_approval': { status: 'warning', text: 'Pending Approval' },
      'approved': { status: 'success', text: 'Approved' },
      'rejected': { status: 'error', text: 'Rejected' }
    };
    const config = statusMap[status] || { status: 'default', text: status };
    return <StatusBadge status={config.status as any} text={config.text} />;
  };

  const columns: Column<EncashmentApproval>[] = [
    {
      id: 'employee',
      header: 'Employee',
      accessor: 'employeeName',
      sortable: true,
      render: (v, row) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.employeeCode} • {row.department}</div>
          <div className="text-xs text-gray-500">{row.designation}</div>
        </div>
      )
    },
    {
      id: 'request',
      header: 'Request Details',
      accessor: 'id',
      sortable: true,
      render: (v, row) => (
        <div>
          <div className="font-mono text-sm font-semibold text-blue-600">{v}</div>
          <div className="text-xs text-gray-500">{new Date(row.submittedOn).toLocaleDateString()}</div>
          <div className="text-xs">
            <span className="font-medium text-gray-700">{row.leaveTypeCode}</span>
            <span className="text-gray-500 ml-1">• {row.requestedDays} days</span>
          </div>
        </div>
      )
    },
    {
      id: 'balance',
      header: 'Balance & Eligibility',
      accessor: 'availableBalance',
      sortable: true,
      render: (v, row) => (
        <div className="text-xs">
          <div className="font-medium text-gray-900">Available: {v} days</div>
          <div className="text-blue-600">Requested: {row.requestedDays} days</div>
          {row.eligibility.isEligible ? (
            <div className="text-green-600">✓ Eligible (Max: {row.eligibility.maxAllowed})</div>
          ) : (
            <div className="text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Not Eligible
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
          {row.approvedOn && <div className="text-xs text-gray-500 mt-1">{new Date(row.approvedOn).toLocaleDateString()}</div>}
          {row.rejectionReason && <div className="text-xs text-red-600 mt-1">{row.rejectionReason}</div>}
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
          {row.status === 'pending_approval' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); }} className="text-green-600 hover:text-green-800 text-sm font-medium">
                Approve
              </button>
              <button onClick={(e) => { e.stopPropagation(); }} className="text-red-600 hover:text-red-800 text-sm font-medium">
                Reject
              </button>
            </>
          )}
          <button onClick={(e) => { e.stopPropagation(); }} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View
          </button>
        </div>
      )
    }
  ];

  const stats = useMemo(() => {
    const pending = approvalQueue.filter(r => r.status === 'pending_approval').length;
    const approved = approvalQueue.filter(r => r.status === 'approved').length;
    const rejected = approvalQueue.filter(r => r.status === 'rejected').length;
    const pendingAmount = approvalQueue.filter(r => r.status === 'pending_approval').reduce((sum, r) => sum + r.totalAmount, 0);
    const approvedAmount = approvalQueue.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.totalAmount, 0);
    const eligibilityIssues = approvalQueue.filter(r => r.status === 'pending_approval' && !r.eligibility.isEligible).length;
    return { pending, approved, rejected, pendingAmount, approvedAmount, eligibilityIssues };
  }, [approvalQueue]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDepartment('All Departments');
    setFilterStatus('pending_approval');
  };

  const activeFilterCount = [filterDepartment !== 'All Departments', filterStatus !== 'pending_approval', searchTerm !== ''].filter(Boolean).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-7 h-7 text-green-600" />
            Encashment Approval
          </h1>
          <p className="text-gray-600 mt-1">Review and approve employee leave encashment requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" /> Pending
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
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
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Eligibility Issues
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.eligibilityIssues}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Pending Amount</div>
          <div className="text-2xl font-bold text-blue-600">₹{(stats.pendingAmount / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600 mb-1">Approved Amount</div>
          <div className="text-2xl font-bold text-purple-600">₹{(stats.approvedAmount / 1000).toFixed(0)}K</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by employee name, code, or request ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="all">All Status</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <DataTable data={filteredData} columns={columns} pagination={{ enabled: true, pageSize: 10 }} sorting={{ enabled: true, defaultSort: { column: 'request', direction: 'desc' } }} emptyMessage="No encashment requests pending approval" />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Approval Guidelines
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1 ml-7">
          <li>✓ Verify employee has sufficient leave balance before approval</li>
          <li>✓ Check maximum encashment limit: 50% of available balance per financial year</li>
          <li>✓ Ensure minimum retention of 5 days in leave balance after encashment</li>
          <li>✓ Validate per-day rate matches employee's current basic salary</li>
          <li>✓ Review upcoming planned leaves to avoid balance shortage</li>
          <li>✓ Check if employee has pending/rejected encashment requests in current FY</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          <CheckCircle className="w-5 h-5 inline mr-2" />
          Approval Process
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Review request details: employee info, leave type, days, and amount</li>
          <li>✓ Verify eligibility criteria and system-flagged issues</li>
          <li>✓ Approve eligible requests or reject with clear reason</li>
          <li>✓ Approved requests forwarded to Finance for processing</li>
          <li>✓ Rejection notifications sent to employee with explanation</li>
        </ul>
      </div>
    </div>
  );
}
