'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Eye, CheckCircle, XCircle, Clock, AlertCircle,
  ChevronLeft, ChevronRight, Filter, User, Users, FileText,
  TrendingUp, Calendar, DollarSign, ShoppingCart, Package,
  Briefcase, Activity, MessageSquare, ThumbsUp, ThumbsDown, Flag
} from 'lucide-react';

interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  type: 'purchase_order' | 'expense' | 'leave' | 'quotation' | 'budget' | 'project' | 'invoice';
  referenceId: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: string;
  requestedDate: string;
  currentApprover: string;
  approvalLevel: string;
  totalLevels: number;
  deadline: string;
  daysRemaining: number;
  comments: number;
  attachments: number;
  history: Array<{
    approver: string;
    action: 'approved' | 'rejected' | 'pending';
    date: string;
    comment?: string;
  }>;
}

const mockApprovals: ApprovalRequest[] = [
  {
    id: 'APR001',
    title: 'Purchase Order Approval - Raw Materials',
    description: 'Bulk purchase of stainless steel sheets and aluminum profiles for Q4 production',
    type: 'purchase_order',
    referenceId: 'PO-2025-10-156',
    amount: 45000,
    status: 'pending',
    priority: 'high',
    requestedBy: 'Procurement Manager',
    requestedDate: '2025-10-15',
    currentApprover: 'Finance Director',
    approvalLevel: 'Level 2 of 3',
    totalLevels: 3,
    deadline: '2025-10-20',
    daysRemaining: 3,
    comments: 2,
    attachments: 3,
    history: [
      { approver: 'Department Head', action: 'approved', date: '2025-10-15 14:30', comment: 'Approved for necessary materials' },
      { approver: 'Finance Director', action: 'pending', date: '2025-10-16 09:00' },
    ],
  },
  {
    id: 'APR002',
    title: 'Employee Expense Reimbursement',
    description: 'Travel expenses for client meeting in New York - accommodation, flights, and meals',
    type: 'expense',
    referenceId: 'EXP-2025-10-089',
    amount: 2850,
    status: 'pending',
    priority: 'medium',
    requestedBy: 'John Smith - Sales',
    requestedDate: '2025-10-14',
    currentApprover: 'Sales Manager',
    approvalLevel: 'Level 1 of 2',
    totalLevels: 2,
    deadline: '2025-10-18',
    daysRemaining: 1,
    comments: 1,
    attachments: 8,
    history: [
      { approver: 'Sales Manager', action: 'pending', date: '2025-10-14 16:45' },
    ],
  },
  {
    id: 'APR003',
    title: 'Sales Quotation - Premium Kitchen Set',
    description: 'Special discount quotation for VIP customer - 25% discount on bulk order',
    type: 'quotation',
    referenceId: 'QT-2025-10-234',
    amount: 125000,
    status: 'approved',
    priority: 'urgent',
    requestedBy: 'Sarah Williams - Sales',
    requestedDate: '2025-10-13',
    currentApprover: 'CEO',
    approvalLevel: 'Completed',
    totalLevels: 3,
    deadline: '2025-10-15',
    daysRemaining: 0,
    comments: 5,
    attachments: 2,
    history: [
      { approver: 'Sales Manager', action: 'approved', date: '2025-10-13 10:15', comment: 'Good opportunity' },
      { approver: 'Sales Director', action: 'approved', date: '2025-10-13 15:30', comment: 'Strategic customer' },
      { approver: 'CEO', action: 'approved', date: '2025-10-14 09:00', comment: 'Approved for relationship building' },
    ],
  },
  {
    id: 'APR004',
    title: 'Annual Leave Request',
    description: 'Vacation leave for 10 days - December holiday period',
    type: 'leave',
    referenceId: 'LEAVE-2025-10-045',
    status: 'pending',
    priority: 'low',
    requestedBy: 'Michael Chen - Production',
    requestedDate: '2025-10-12',
    currentApprover: 'Production Manager',
    approvalLevel: 'Level 1 of 1',
    totalLevels: 1,
    deadline: '2025-10-19',
    daysRemaining: 2,
    comments: 0,
    attachments: 0,
    history: [
      { approver: 'Production Manager', action: 'pending', date: '2025-10-12 11:20' },
    ],
  },
  {
    id: 'APR005',
    title: 'Budget Allocation - IT Infrastructure',
    description: 'Capital expenditure for server upgrade and network infrastructure improvements',
    type: 'budget',
    referenceId: 'BUD-2025-Q4-012',
    amount: 85000,
    status: 'pending',
    priority: 'high',
    requestedBy: 'IT Manager',
    requestedDate: '2025-10-16',
    currentApprover: 'CFO',
    approvalLevel: 'Level 2 of 2',
    totalLevels: 2,
    deadline: '2025-10-25',
    daysRemaining: 8,
    comments: 3,
    attachments: 5,
    history: [
      { approver: 'IT Director', action: 'approved', date: '2025-10-16 14:00', comment: 'Critical for operations' },
      { approver: 'CFO', action: 'pending', date: '2025-10-17 08:30' },
    ],
  },
  {
    id: 'APR006',
    title: 'Project Budget Amendment',
    description: 'Additional budget request for Kitchen Cabinet Project - scope changes',
    type: 'project',
    referenceId: 'PRJ-2025-089',
    amount: 32000,
    status: 'pending',
    priority: 'urgent',
    requestedBy: 'Project Manager',
    requestedDate: '2025-10-17',
    currentApprover: 'Operations Director',
    approvalLevel: 'Level 1 of 2',
    totalLevels: 2,
    deadline: '2025-10-19',
    daysRemaining: 2,
    comments: 4,
    attachments: 6,
    history: [
      { approver: 'Operations Director', action: 'pending', date: '2025-10-17 10:00' },
    ],
  },
  {
    id: 'APR007',
    title: 'Vendor Invoice Payment',
    description: 'Payment approval for supplier invoice - Q3 raw material delivery',
    type: 'invoice',
    referenceId: 'INV-2025-10-567',
    amount: 67500,
    status: 'rejected',
    priority: 'medium',
    requestedBy: 'Accounts Payable',
    requestedDate: '2025-10-10',
    currentApprover: 'Finance Manager',
    approvalLevel: 'Rejected at Level 1',
    totalLevels: 2,
    deadline: '2025-10-15',
    daysRemaining: -2,
    comments: 3,
    attachments: 2,
    history: [
      { approver: 'Finance Manager', action: 'rejected', date: '2025-10-11 13:45', comment: 'Invoice discrepancy - quantity mismatch' },
    ],
  },
  {
    id: 'APR008',
    title: 'Equipment Purchase - CNC Machine',
    description: 'New CNC machine for production line expansion',
    type: 'purchase_order',
    referenceId: 'PO-2025-10-178',
    amount: 150000,
    status: 'pending',
    priority: 'high',
    requestedBy: 'Production Manager',
    requestedDate: '2025-10-16',
    currentApprover: 'CEO',
    approvalLevel: 'Level 3 of 3',
    totalLevels: 3,
    deadline: '2025-10-22',
    daysRemaining: 5,
    comments: 6,
    attachments: 10,
    history: [
      { approver: 'Production Director', action: 'approved', date: '2025-10-16 11:00', comment: 'Essential for capacity increase' },
      { approver: 'Finance Director', action: 'approved', date: '2025-10-16 16:30', comment: 'Budget available' },
      { approver: 'CEO', action: 'pending', date: '2025-10-17 08:00' },
    ],
  },
  {
    id: 'APR009',
    title: 'Training Budget Approval',
    description: 'Annual training program for production staff - safety and quality certifications',
    type: 'budget',
    referenceId: 'BUD-2025-Q4-015',
    amount: 18500,
    status: 'approved',
    priority: 'medium',
    requestedBy: 'HR Manager',
    requestedDate: '2025-10-11',
    currentApprover: 'CFO',
    approvalLevel: 'Completed',
    totalLevels: 2,
    deadline: '2025-10-18',
    daysRemaining: 1,
    comments: 2,
    attachments: 4,
    history: [
      { approver: 'HR Director', action: 'approved', date: '2025-10-11 14:20', comment: 'Necessary for compliance' },
      { approver: 'CFO', action: 'approved', date: '2025-10-12 10:00', comment: 'Approved' },
    ],
  },
  {
    id: 'APR010',
    title: 'Marketing Campaign Budget',
    description: 'Q4 digital marketing campaign - social media and online advertising',
    type: 'budget',
    referenceId: 'BUD-2025-Q4-018',
    amount: 25000,
    status: 'expired',
    priority: 'low',
    requestedBy: 'Marketing Manager',
    requestedDate: '2025-10-05',
    currentApprover: 'Marketing Director',
    approvalLevel: 'Expired at Level 1',
    totalLevels: 2,
    deadline: '2025-10-12',
    daysRemaining: -5,
    comments: 1,
    attachments: 3,
    history: [
      { approver: 'Marketing Director', action: 'pending', date: '2025-10-05 15:30' },
    ],
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-700',
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const typeIcons = {
  purchase_order: ShoppingCart,
  expense: DollarSign,
  leave: Calendar,
  quotation: FileText,
  budget: Briefcase,
  project: Package,
  invoice: FileText,
};

const typeColors = {
  purchase_order: 'bg-purple-100 text-purple-700',
  expense: 'bg-green-100 text-green-700',
  leave: 'bg-blue-100 text-blue-700',
  quotation: 'bg-indigo-100 text-indigo-700',
  budget: 'bg-orange-100 text-orange-700',
  project: 'bg-teal-100 text-teal-700',
  invoice: 'bg-pink-100 text-pink-700',
};

export default function ApprovalsPage() {
  const router = useRouter();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');
  const itemsPerPage = 8;

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    const matchesType = typeFilter === 'all' || approval.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || approval.priority === priorityFilter;
    const matchesView = viewMode === 'all' || approval.status === 'pending';
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesView;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApprovals = filteredApprovals.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: approvals.length,
    pending: approvals.filter((a) => a.status === 'pending').length,
    approved: approvals.filter((a) => a.status === 'approved').length,
    rejected: approvals.filter((a) => a.status === 'rejected').length,
    urgent: approvals.filter((a) => a.priority === 'urgent' && a.status === 'pending').length,
    totalAmount: approvals
      .filter((a) => a.amount && a.status === 'pending')
      .reduce((sum, a) => sum + (a.amount || 0), 0),
  };

  const handleApprove = (approval: ApprovalRequest) => {
    if (confirm(`Approve: ${approval.title}?`)) {
      setApprovals(approvals.map(a =>
        a.id === approval.id ? { ...a, status: 'approved' as const } : a
      ));
    }
  };

  const handleReject = (approval: ApprovalRequest) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setApprovals(approvals.map(a =>
        a.id === approval.id ? { ...a, status: 'rejected' as const } : a
      ));
    }
  };

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return 'text-red-600';
    if (days <= 2) return 'text-orange-600';
    if (days <= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTypeIcon = (type: ApprovalRequest['type']) => {
    const Icon = typeIcons[type];
    return <Icon className="h-4 w-4" />;
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Requests</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Urgent</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{stats.urgent}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Pending Value</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">${(stats.totalAmount / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setViewMode(viewMode === 'pending' ? 'all' : 'pending')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {viewMode === 'pending' ? 'Show All' : 'Show Pending Only'}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search approvals by title, reference, or requester..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="purchase_order">Purchase Order</option>
              <option value="expense">Expense</option>
              <option value="leave">Leave</option>
              <option value="quotation">Quotation</option>
              <option value="budget">Budget</option>
              <option value="project">Project</option>
              <option value="invoice">Invoice</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        )}
      </div>

      {/* Approval Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {paginatedApprovals.map((approval) => (
          <div
            key={approval.id}
            className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition-all"
          >
            {/* Approval Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{approval.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[approval.status]}`}>
                    {approval.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{approval.description}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-full ${typeColors[approval.type]}`}>
                    {getTypeIcon(approval.type)}
                    <span>{approval.type.replace('_', ' ')}</span>
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityColors[approval.priority]}`}>
                    {approval.priority}
                  </span>
                  <span className="text-xs text-gray-500">{approval.referenceId}</span>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Requested By</p>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-900">{approval.requestedBy}</span>
                </div>
              </div>
              {approval.amount && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">{formatAmount(approval.amount)}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Approver</p>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-900 truncate">{approval.currentApprover}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Approval Level</p>
                <span className="text-sm font-semibold text-gray-900">{approval.approvalLevel}</span>
              </div>
            </div>

            {/* Timeline and Status */}
            <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Requested</p>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-900">{approval.requestedDate}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Deadline</p>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-orange-600" />
                  <span className="text-xs font-semibold text-gray-900">{approval.deadline}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Days Left</p>
                <div className="flex items-center space-x-1">
                  <Flag className={`h-3 w-3 ${getDaysRemainingColor(approval.daysRemaining)}`} />
                  <span className={`text-xs font-semibold ${getDaysRemainingColor(approval.daysRemaining)}`}>
                    {approval.daysRemaining > 0 ? approval.daysRemaining : 'Overdue'}
                  </span>
                </div>
              </div>
            </div>

            {/* Approval History Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">Approval Progress</p>
                <span className="text-xs text-gray-500">{approval.history.length} / {approval.totalLevels}</span>
              </div>
              <div className="flex items-center space-x-2">
                {approval.history.map((item, index) => (
                  <div key={index} className="flex items-center flex-1">
                    <div
                      className={`flex-1 h-2 rounded-full ${
                        item.action === 'approved'
                          ? 'bg-green-500'
                          : item.action === 'rejected'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                ))}
                {Array.from({ length: approval.totalLevels - approval.history.length }).map((_, index) => (
                  <div key={`pending-${index}`} className="flex-1 h-2 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{approval.comments} comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-3 w-3" />
                  <span>{approval.attachments} files</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push(`/workflow/approvals/view/${approval.id}`)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
              {approval.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(approval)}
                    className="flex items-center justify-center px-3 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                   
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReject(approval)}
                    className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                   
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredApprovals.length)} of {filteredApprovals.length} approval requests
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
              })
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              ))}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
