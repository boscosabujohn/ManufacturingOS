'use client';

import { useState, useMemo } from 'react';
import { Wallet, Plus, CheckCircle, Clock, XCircle, AlertTriangle, Receipt, Eye, Download } from 'lucide-react';
import DataTable from '@/components/DataTable';

interface ExpenseClaim {
  id: string;
  claimNumber: string;
  submissionDate: string;
  category: 'travel' | 'food' | 'accommodation' | 'fuel' | 'supplies' | 'communication' | 'other';
  description: string;
  amount: number;
  billDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  approver: string;
  approvedDate?: string;
  paidDate?: string;
  rejectionReason?: string;
  receiptAttached: boolean;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const mockExpenses: ExpenseClaim[] = [
    {
      id: '1', claimNumber: 'EXP-2024-1201', submissionDate: '2024-10-20', category: 'travel',
      description: 'Client visit - Mumbai', amount: 4500, billDate: '2024-10-18',
      status: 'approved', approver: 'Rajesh Kumar', approvedDate: '2024-10-22', receiptAttached: true
    },
    {
      id: '2', claimNumber: 'EXP-2024-1202', submissionDate: '2024-10-22', category: 'fuel',
      description: 'Fuel for factory visit', amount: 2800, billDate: '2024-10-20',
      status: 'submitted', approver: 'Rajesh Kumar', receiptAttached: true
    },
    {
      id: '3', claimNumber: 'EXP-2024-1203', submissionDate: '2024-10-23', category: 'food',
      description: 'Business lunch with client', amount: 1200, billDate: '2024-10-23',
      status: 'submitted', approver: 'Rajesh Kumar', receiptAttached: true
    },
    {
      id: '4', claimNumber: 'EXP-2024-1204', submissionDate: '2024-10-15', category: 'accommodation',
      description: 'Hotel stay - Bangalore trip', amount: 6800, billDate: '2024-10-12',
      status: 'paid', approver: 'Rajesh Kumar', approvedDate: '2024-10-17',
      paidDate: '2024-10-25', receiptAttached: true
    },
    {
      id: '5', claimNumber: 'EXP-2024-1205', submissionDate: '2024-10-18', category: 'supplies',
      description: 'Office supplies purchase', amount: 3200, billDate: '2024-10-17',
      status: 'rejected', approver: 'Rajesh Kumar',
      rejectionReason: 'Receipt not clear - please resubmit with original bill', receiptAttached: true
    },
    {
      id: '6', claimNumber: 'DRAFT-001', submissionDate: '', category: 'communication',
      description: 'Mobile recharge', amount: 599, billDate: '2024-10-24',
      status: 'draft', approver: '', receiptAttached: false
    },
    {
      id: '7', claimNumber: 'EXP-2024-1206', submissionDate: '2024-10-25', category: 'travel',
      description: 'Local conveyance', amount: 850, billDate: '2024-10-24',
      status: 'submitted', approver: 'Rajesh Kumar', receiptAttached: true
    },
    {
      id: '8', claimNumber: 'EXP-2024-1207', submissionDate: '2024-10-10', category: 'fuel',
      description: 'Petrol - Site visit', amount: 1500, billDate: '2024-10-09',
      status: 'paid', approver: 'Rajesh Kumar', approvedDate: '2024-10-12',
      paidDate: '2024-10-20', receiptAttached: true
    }
  ];

  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter(expense => {
      const matchesStatus = selectedStatus === 'all' || expense.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      return matchesStatus && matchesCategory;
    });
  }, [selectedStatus, selectedCategory]);

  const stats = {
    total: mockExpenses.filter(e => e.status !== 'draft').length,
    draft: mockExpenses.filter(e => e.status === 'draft').length,
    submitted: mockExpenses.filter(e => e.status === 'submitted').length,
    approved: mockExpenses.filter(e => e.status === 'approved').length,
    rejected: mockExpenses.filter(e => e.status === 'rejected').length,
    paid: mockExpenses.filter(e => e.status === 'paid').length,
    totalAmount: mockExpenses.filter(e => e.status !== 'draft').reduce((sum, e) => sum + e.amount, 0),
    approvedAmount: mockExpenses.filter(e => ['approved', 'paid'].includes(e.status)).reduce((sum, e) => sum + e.amount, 0)
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-emerald-100 text-emerald-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: Clock,
      submitted: AlertTriangle,
      approved: CheckCircle,
      rejected: XCircle,
      paid: CheckCircle
    };
    const Icon = icons[status as keyof typeof icons];
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      travel: 'Travel',
      food: 'Food & Dining',
      accommodation: 'Accommodation',
      fuel: 'Fuel',
      supplies: 'Supplies',
      communication: 'Communication',
      other: 'Other'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const columns = [
    { key: 'claimNumber', label: 'Claim No.', sortable: true,
      render: (v: string) => <div className="font-semibold text-gray-900">{v}</div>
    },
    { key: 'submissionDate', label: 'Submitted', sortable: true,
      render: (v: string) => (
        <div className="text-sm text-gray-700">
          {v ? new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
        </div>
      )
    },
    { key: 'category', label: 'Category', sortable: true,
      render: (v: string) => (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
          {getCategoryLabel(v)}
        </span>
      )
    },
    { key: 'description', label: 'Description', sortable: true,
      render: (v: string, row: ExpenseClaim) => (
        <div>
          <div className="text-sm text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">Bill Date: {new Date(row.billDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
        </div>
      )
    },
    { key: 'amount', label: 'Amount', sortable: true,
      render: (v: number) => <div className="text-sm font-semibold text-gray-900">₹{v.toLocaleString('en-IN')}</div>
    },
    { key: 'receiptAttached', label: 'Receipt', sortable: true,
      render: (v: boolean) => (
        v ? <Receipt className="h-5 w-5 text-green-600" /> : <Receipt className="h-5 w-5 text-gray-300" />
      )
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(v)}`}>
          {getStatusIcon(v)}
          {v.toUpperCase()}
        </span>
      )
    },
    { key: 'actions', label: 'Actions', sortable: false,
      render: (_: any, row: ExpenseClaim) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded" title="View Details">
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          {row.receiptAttached && (
            <button className="p-1 hover:bg-gray-100 rounded" title="Download Receipt">
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="h-8 w-8 text-purple-600" />
            My Expenses
          </h1>
          <p className="text-gray-600 mt-2">Track and manage your expense claims</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Claim
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-6">
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
            </div>
            <Receipt className="h-10 w-10 text-purple-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <Clock className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.paid}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amt</p>
              <p className="text-xl font-bold text-indigo-600">₹{(stats.totalAmount / 1000).toFixed(1)}k</p>
            </div>
            <Wallet className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-teal-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-bold text-teal-600">₹{(stats.approvedAmount / 1000).toFixed(1)}k</p>
            </div>
            <CheckCircle className="h-10 w-10 text-teal-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="travel">Travel</option>
              <option value="food">Food & Dining</option>
              <option value="accommodation">Accommodation</option>
              <option value="fuel">Fuel</option>
              <option value="supplies">Supplies</option>
              <option value="communication">Communication</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <DataTable data={filteredExpenses} columns={columns} />

      {/* Info Box */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">Expense Claim Guidelines</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• All expense claims must be submitted within 30 days of bill date</li>
          <li>• Original bills and receipts are mandatory for claims above ₹500</li>
          <li>• Claims are processed and paid by 25th of every month</li>
          <li>• Travel expenses require prior approval from reporting manager</li>
          <li>• Fuel claims must include vehicle number and odometer reading</li>
          <li>• Maximum daily food allowance: ₹1,500 for outstation visits</li>
        </ul>
      </div>
    </div>
  );
}
