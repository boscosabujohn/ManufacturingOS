'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Receipt, Plus, Eye, CheckCircle, XCircle, Clock, User, Wallet, Calendar } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { toast } from '@/hooks/use-toast';

interface TravelExpense {
  id: string;
  expenseNumber: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  travelRequestId: string;
  destination: string;
  travelDates: string;
  submittedDate: string;
  totalExpenses: number;
  advanceAmount: number;
  cardExpenses: number;
  netPayable: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paid';
  itemsCount: number;
  approver?: string;
  approvedDate?: string;
  paidDate?: string;
}

export default function Page() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockExpenses: TravelExpense[] = [
    {
      id: '1',
      expenseNumber: 'EXP-2025-089',
      employeeName: 'Rajesh Kumar',
      employeeCode: 'EMP456',
      department: 'Sales',
      travelRequestId: 'TR-2025-001',
      destination: 'Bangalore, Karnataka',
      travelDates: '10-Nov to 15-Nov 2025',
      submittedDate: '2025-11-16',
      totalExpenses: 28500,
      advanceAmount: 15000,
      cardExpenses: 12500,
      netPayable: 1000,
      status: 'pending',
      itemsCount: 12,
      approver: 'Suresh Iyer'
    },
    {
      id: '2',
      expenseNumber: 'EXP-2025-090',
      employeeName: 'Priya Sharma',
      employeeCode: 'EMP789',
      department: 'Engineering',
      travelRequestId: 'TR-2025-002',
      destination: 'Mumbai, Maharashtra',
      travelDates: '05-Nov to 08-Nov 2025',
      submittedDate: '2025-11-09',
      totalExpenses: 32000,
      advanceAmount: 20000,
      cardExpenses: 8500,
      netPayable: 3500,
      status: 'approved',
      itemsCount: 10,
      approver: 'Madhav Singh',
      approvedDate: '2025-11-10'
    },
    {
      id: '3',
      expenseNumber: 'EXP-2025-091',
      employeeName: 'Amit Singh',
      employeeCode: 'EMP234',
      department: 'Operations',
      travelRequestId: 'TR-2025-003',
      destination: 'Delhi, NCR',
      travelDates: '12-Nov to 14-Nov 2025',
      submittedDate: '2025-11-15',
      totalExpenses: 18500,
      advanceAmount: 10000,
      cardExpenses: 7200,
      netPayable: 1300,
      status: 'rejected',
      itemsCount: 8,
      approver: 'Ramesh Nair',
      approvedDate: '2025-11-16'
    },
    {
      id: '4',
      expenseNumber: 'EXP-2025-092',
      employeeName: 'Meena Rao',
      employeeCode: 'EMP567',
      department: 'Quality',
      travelRequestId: 'TR-2025-004',
      destination: 'Pune, Maharashtra',
      travelDates: '08-Nov to 10-Nov 2025',
      submittedDate: '2025-11-11',
      totalExpenses: 22000,
      advanceAmount: 12000,
      cardExpenses: 9500,
      netPayable: 500,
      status: 'paid',
      itemsCount: 9,
      approver: 'Kavita Sharma',
      approvedDate: '2025-11-12',
      paidDate: '2025-11-25'
    },
    {
      id: '5',
      expenseNumber: 'EXP-2025-093',
      employeeName: 'Suresh Patel',
      employeeCode: 'EMP890',
      department: 'Maintenance',
      travelRequestId: 'TR-2025-005',
      destination: 'Chennai, Tamil Nadu',
      travelDates: '15-Nov to 18-Nov 2025',
      submittedDate: '',
      totalExpenses: 15600,
      advanceAmount: 8000,
      cardExpenses: 0,
      netPayable: 7600,
      status: 'draft',
      itemsCount: 6
    },
    {
      id: '6',
      expenseNumber: 'EXP-2025-094',
      employeeName: 'Kavita Nair',
      employeeCode: 'EMP345',
      department: 'Marketing',
      travelRequestId: 'TR-2025-006',
      destination: 'Kolkata, West Bengal',
      travelDates: '20-Nov to 22-Nov 2025',
      submittedDate: '2025-11-23',
      totalExpenses: 19800,
      advanceAmount: 10000,
      cardExpenses: 8200,
      netPayable: 1600,
      status: 'pending',
      itemsCount: 7,
      approver: 'Deepak Joshi'
    }
  ];

  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter(exp => {
      const matchesStatus = selectedStatus === 'all' || exp.status === selectedStatus;
      const matchesDept = selectedDepartment === 'all' || exp.department === selectedDepartment;
      return matchesStatus && matchesDept;
    });
  }, [selectedStatus, selectedDepartment]);

  const stats = {
    totalExpenses: mockExpenses.length,
    pending: mockExpenses.filter(e => e.status === 'pending').length,
    approved: mockExpenses.filter(e => e.status === 'approved').length,
    totalAmount: mockExpenses.reduce((sum, e) => sum + e.totalExpenses, 0),
    netPayable: mockExpenses.reduce((sum, e) => sum + e.netPayable, 0),
    drafts: mockExpenses.filter(e => e.status === 'draft').length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors];
  };

  const handleViewExpense = (expense: TravelExpense) => {
    toast({
      title: "View Expense",
      description: `Viewing expense ${expense.expenseNumber}`
    });
  };

  const handleApproveExpense = (expense: TravelExpense) => {
    toast({
      title: "Expense Approved",
      description: `Expense ${expense.expenseNumber} has been approved`
    });
  };

  const handleRejectExpense = (expense: TravelExpense) => {
    toast({
      title: "Expense Rejected",
      description: `Expense ${expense.expenseNumber} has been rejected`
    });
  };

  const handleNewExpense = () => {
    router.push('/hr/travel/expenses/submit');
  };

  const columns = [
    { key: 'expenseNumber', label: 'Expense No.', sortable: true,
      render: (v: string) => <div className="font-mono font-semibold text-gray-900">{v}</div>
    },
    { key: 'employeeName', label: 'Employee', sortable: true,
      render: (v: string, row: TravelExpense) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.employeeCode} - {row.department}</div>
        </div>
      )
    },
    { key: 'travelRequestId', label: 'Travel Request', sortable: true,
      render: (v: string, row: TravelExpense) => (
        <div>
          <div className="font-mono text-sm font-semibold text-blue-600">{v}</div>
          <div className="text-xs text-gray-500">{row.destination}</div>
        </div>
      )
    },
    { key: 'travelDates', label: 'Travel Dates', sortable: true,
      render: (v: string) => <div className="text-sm text-gray-700">{v}</div>
    },
    { key: 'totalExpenses', label: 'Total', sortable: true,
      render: (v: number, row: TravelExpense) => (
        <div>
          <div className="text-sm font-bold text-gray-900">₹{v.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-500">{row.itemsCount} items</div>
        </div>
      )
    },
    { key: 'netPayable', label: 'Net Payable', sortable: true,
      render: (v: number) => (
        <div className={`text-sm font-bold ${v >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{v.toLocaleString('en-IN')}
        </div>
      )
    },
    { key: 'submittedDate', label: 'Submitted', sortable: true,
      render: (v: string, row: TravelExpense) => (
        <div>
          {v ? (
            <>
              <div className="text-sm text-gray-700">
                {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              {row.approver && <div className="text-xs text-gray-500">To: {row.approver}</div>}
            </>
          ) : (
            <span className="text-xs text-gray-400">Not submitted</span>
          )}
        </div>
      )
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(v)}`}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </span>
      )
    },
    { key: 'actions', label: 'Actions', sortable: false,
      render: (_: any, row: TravelExpense) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewExpense(row)}
            className="p-1 hover:bg-gray-100 rounded"
            title="View details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApproveExpense(row)}
                className="p-1 hover:bg-green-100 rounded"
                title="Approve"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
              </button>
              <button
                onClick={() => handleRejectExpense(row)}
                className="p-1 hover:bg-red-100 rounded"
                title="Reject"
              >
                <XCircle className="h-4 w-4 text-red-600" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Receipt className="h-8 w-8 text-blue-600" />
          Travel Expenses
        </h1>
        <p className="text-gray-600 mt-2">Manage travel expense submissions and approvals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalExpenses}</p>
            </div>
            <Receipt className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-400" />
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
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
            </div>
            <User className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-indigo-600">₹{(stats.totalAmount / 1000).toFixed(0)}k</p>
            </div>
            <Wallet className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Payable</p>
              <p className="text-xl font-bold text-orange-600">₹{(stats.netPayable / 1000).toFixed(1)}k</p>
            </div>
            <Wallet className="h-10 w-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Quality">Quality</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleNewExpense}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              <Plus className="h-4 w-4" />
              Submit New Expense
            </button>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <DataTable data={filteredExpenses} columns={columns} />

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Travel Expense Submission</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Submit expenses within 15 days of travel completion</li>
          <li>• All expenses must be supported by valid receipts/bills</li>
          <li>• Corporate card transactions are auto-linked to expense reports</li>
          <li>• Advance settlement is processed automatically with net payable amount</li>
          <li>• Approved expenses are paid on 25th of every month</li>
          <li>• Personal expenses on corporate cards must be reimbursed within 7 days</li>
        </ul>
      </div>
    </div>
  );
}
