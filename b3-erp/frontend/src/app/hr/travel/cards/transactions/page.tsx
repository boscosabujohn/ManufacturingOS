'use client';

import React, { useState, useMemo } from 'react';
import { CreditCard, Calendar, MapPin, CheckCircle, XCircle, AlertTriangle, Download, Link as LinkIcon, Search } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { toast } from '@/hooks/use-toast';

interface CardTransaction {
  id: string;
  transactionId: string;
  cardNumber: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  transactionDate: string;
  merchant: string;
  merchantCategory: 'hotel' | 'restaurant' | 'fuel' | 'transport' | 'retail' | 'online' | 'other';
  location: string;
  amount: number;
  currency: string;
  description: string;
  status: 'captured' | 'linked' | 'unmatched' | 'disputed' | 'personal';
  linkedExpenseId?: string;
  linkedTravelRequest?: string;
  billingCycle: string;
  gstAmount?: number;
  gstNumber?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2025-11');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockTransactions: CardTransaction[] = [
    {
      id: '1',
      transactionId: 'TXN-2025-001234',
      cardNumber: '****4523',
      employeeName: 'Rajesh Kumar',
      employeeCode: 'EMP456',
      department: 'Sales',
      transactionDate: '2025-11-10T14:30:00',
      merchant: 'ITC Grand Central',
      merchantCategory: 'hotel',
      location: 'Bangalore, Karnataka',
      amount: 12500,
      currency: 'INR',
      description: 'Hotel accommodation',
      status: 'linked',
      linkedExpenseId: 'EXP-2025-089',
      linkedTravelRequest: 'TR-2025-001',
      billingCycle: 'Nov 2025',
      gstAmount: 2250,
      gstNumber: '29AABCU9603R1ZM'
    },
    {
      id: '2',
      transactionId: 'TXN-2025-001235',
      cardNumber: '****4523',
      employeeName: 'Rajesh Kumar',
      employeeCode: 'EMP456',
      department: 'Sales',
      transactionDate: '2025-11-11T20:15:00',
      merchant: 'The Oberoi Restaurant',
      merchantCategory: 'restaurant',
      location: 'Bangalore, Karnataka',
      amount: 3200,
      currency: 'INR',
      description: 'Client dinner',
      status: 'linked',
      linkedExpenseId: 'EXP-2025-089',
      linkedTravelRequest: 'TR-2025-001',
      billingCycle: 'Nov 2025',
      gstAmount: 480,
      gstNumber: '29AABCU9603R1ZM'
    },
    {
      id: '3',
      transactionId: 'TXN-2025-001236',
      cardNumber: '****6789',
      employeeName: 'Priya Sharma',
      employeeCode: 'EMP789',
      department: 'Engineering',
      transactionDate: '2025-11-05T09:45:00',
      merchant: 'Uber India',
      merchantCategory: 'transport',
      location: 'Mumbai, Maharashtra',
      amount: 450,
      currency: 'INR',
      description: 'Airport transfer',
      status: 'captured',
      billingCycle: 'Nov 2025'
    },
    {
      id: '4',
      transactionId: 'TXN-2025-001237',
      cardNumber: '****6789',
      employeeName: 'Priya Sharma',
      employeeCode: 'EMP789',
      department: 'Engineering',
      transactionDate: '2025-11-06T12:30:00',
      merchant: 'Amazon.in',
      merchantCategory: 'online',
      location: 'Online',
      amount: 5600,
      currency: 'INR',
      description: 'Office supplies',
      status: 'unmatched',
      billingCycle: 'Nov 2025'
    },
    {
      id: '5',
      transactionId: 'TXN-2025-001238',
      cardNumber: '****3421',
      employeeName: 'Amit Singh',
      employeeCode: 'EMP234',
      department: 'Operations',
      transactionDate: '2025-11-08T16:20:00',
      merchant: 'Indian Oil Petrol Pump',
      merchantCategory: 'fuel',
      location: 'Pune, Maharashtra',
      amount: 3800,
      currency: 'INR',
      description: 'Fuel for company vehicle',
      status: 'linked',
      linkedExpenseId: 'EXP-2025-092',
      linkedTravelRequest: 'TR-2025-005',
      billingCycle: 'Nov 2025',
      gstAmount: 684,
      gstNumber: '27AAACI5649H1ZS'
    },
    {
      id: '6',
      transactionId: 'TXN-2025-001239',
      cardNumber: '****5432',
      employeeName: 'Suresh Patel',
      employeeCode: 'EMP890',
      department: 'Maintenance',
      transactionDate: '2025-11-03T11:15:00',
      merchant: 'Decathlon Sports',
      merchantCategory: 'retail',
      location: 'Chennai, Tamil Nadu',
      amount: 2400,
      currency: 'INR',
      description: 'Personal shopping',
      status: 'personal',
      billingCycle: 'Nov 2025'
    },
    {
      id: '7',
      transactionId: 'TXN-2025-001240',
      cardNumber: '****4523',
      employeeName: 'Rajesh Kumar',
      employeeCode: 'EMP456',
      department: 'Sales',
      transactionDate: '2025-11-12T08:30:00',
      merchant: 'SpiceJet Airlines',
      merchantCategory: 'transport',
      location: 'Bangalore, Karnataka',
      amount: 8900,
      currency: 'INR',
      description: 'Flight change charges',
      status: 'disputed',
      billingCycle: 'Nov 2025'
    },
    {
      id: '8',
      transactionId: 'TXN-2025-001241',
      cardNumber: '****6789',
      employeeName: 'Priya Sharma',
      employeeCode: 'EMP789',
      department: 'Engineering',
      transactionDate: '2025-11-07T19:45:00',
      merchant: 'Cafe Coffee Day',
      merchantCategory: 'restaurant',
      location: 'Mumbai, Maharashtra',
      amount: 680,
      currency: 'INR',
      description: 'Team meeting refreshments',
      status: 'captured',
      billingCycle: 'Nov 2025'
    }
  ];

  // Safe Date Display Component
  const DateDisplay = ({ date, type = 'date' }: { date: string, type?: 'date' | 'time' }) => {
    const [mounted, setMounted] = useState(false);
    React.useEffect(() => setMounted(true), []);

    if (!mounted) return <span>{date}</span>;

    if (type === 'time') {
      return <span>{new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>;
    }
    return <span>{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>;
  };

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(txn => {
      const matchesStatus = selectedStatus === 'all' || txn.status === selectedStatus;
      const matchesMonth = txn.transactionDate.startsWith(selectedMonth);
      const matchesEmployee = selectedEmployee === 'all' || txn.employeeCode === selectedEmployee;
      const matchesSearch = searchTerm === '' ||
        txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesMonth && matchesEmployee && matchesSearch;
    });
  }, [selectedStatus, selectedMonth, selectedEmployee, searchTerm]);

  const stats = {
    totalTransactions: mockTransactions.length,
    totalAmount: mockTransactions.reduce((sum, t) => sum + t.amount, 0),
    linked: mockTransactions.filter(t => t.status === 'linked').length,
    unmatched: mockTransactions.filter(t => t.status === 'unmatched').length,
    personal: mockTransactions.filter(t => t.status === 'personal').length,
    disputed: mockTransactions.filter(t => t.status === 'disputed').length,
    linkedAmount: mockTransactions.filter(t => t.status === 'linked').reduce((sum, t) => sum + t.amount, 0)
  };

  const getStatusColor = (status: string) => {
    const colors = {
      captured: 'bg-blue-100 text-blue-800',
      linked: 'bg-green-100 text-green-800',
      unmatched: 'bg-yellow-100 text-yellow-800',
      disputed: 'bg-red-100 text-red-800',
      personal: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      hotel: 'bg-blue-100 text-blue-800',
      restaurant: 'bg-green-100 text-green-800',
      fuel: 'bg-orange-100 text-orange-800',
      transport: 'bg-purple-100 text-purple-800',
      retail: 'bg-pink-100 text-pink-800',
      online: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors];
  };

  const handleLinkTransaction = (txn: CardTransaction) => {
    toast({
      title: "Transaction Linked",
      description: `Transaction ${txn.transactionId} linked to expense report`
    });
  };

  const handleMarkPersonal = (txn: CardTransaction) => {
    toast({
      title: "Marked as Personal",
      description: `Transaction ${txn.transactionId} marked as personal expense`
    });
  };

  const columns = [
    {
      key: 'transactionDate', label: 'Date', sortable: true,
      render: (v: string) => (
        <div className="text-sm">
          <div className="font-semibold text-gray-900">
            <DateDisplay date={v} type="date" />
          </div>
          <div className="text-xs text-gray-500">
            <DateDisplay date={v} type="time" />
          </div>
        </div>
      )
    },
    {
      key: 'transactionId', label: 'Transaction ID', sortable: true,
      render: (v: string) => <div className="font-mono text-xs text-gray-700">{v}</div>
    },
    {
      key: 'employeeName', label: 'Employee', sortable: true,
      render: (v: string, row: CardTransaction) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">Card: {row.cardNumber}</div>
        </div>
      )
    },
    {
      key: 'merchant', label: 'Merchant', sortable: true,
      render: (v: string, row: CardTransaction) => (
        <div>
          <div className="text-sm font-semibold text-gray-900">{v}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getCategoryColor(row.merchantCategory)}`}>
              {row.merchantCategory}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'location', label: 'Location', sortable: true,
      render: (v: string) => (
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <MapPin className="h-3 w-3 text-gray-400" />
          {v}
        </div>
      )
    },
    {
      key: 'amount', label: 'Amount', sortable: true,
      render: (v: number, row: CardTransaction) => (
        <div>
          <div className="text-sm font-bold text-gray-900">₹{v.toLocaleString('en-IN')}</div>
          {row.gstAmount && (
            <div className="text-xs text-gray-500">GST: ₹{row.gstAmount}</div>
          )}
        </div>
      )
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (v: string, row: CardTransaction) => (
        <div>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(v)}`}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </span>
          {row.linkedExpenseId && (
            <div className="text-xs text-green-600 mt-1 font-mono">{row.linkedExpenseId}</div>
          )}
        </div>
      )
    },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (_: any, row: CardTransaction) => (
        <div className="flex gap-2">
          {row.status === 'captured' && (
            <button
              onClick={() => handleLinkTransaction(row)}
              className="p-1 hover:bg-green-100 rounded"
              title="Link to expense"
            >
              <LinkIcon className="h-4 w-4 text-green-600" />
            </button>
          )}
          {row.status === 'unmatched' && (
            <>
              <button
                onClick={() => handleLinkTransaction(row)}
                className="p-1 hover:bg-green-100 rounded"
                title="Link to expense"
              >
                <LinkIcon className="h-4 w-4 text-green-600" />
              </button>
              <button
                onClick={() => handleMarkPersonal(row)}
                className="p-1 hover:bg-purple-100 rounded"
                title="Mark as personal"
              >
                <XCircle className="h-4 w-4 text-purple-600" />
              </button>
            </>
          )}
          <button className="p-1 hover:bg-blue-100 rounded">
            <Download className="h-4 w-4 text-blue-600" />
          </button>
        </div>
      )
    }
  ];

  const transactionTabs = [
    { id: 'all', label: 'All Transactions' },
    { id: 'captured', label: 'Captured' },
    { id: 'linked', label: 'Linked' },
    { id: 'unmatched', label: 'Unmatched' },
    { id: 'disputed', label: 'Disputed' },
    { id: 'personal', label: 'Personal' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-blue-600" />
          Card Transactions
        </h1>
        <p className="text-gray-600 mt-2">Auto-captured corporate credit card transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Txns</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</p>
            </div>
            <CreditCard className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-indigo-600">₹{(stats.totalAmount / 1000).toFixed(1)}k</p>
            </div>
            <Calendar className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Linked</p>
              <p className="text-2xl font-bold text-green-600">{stats.linked}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unmatched</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.unmatched}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Personal</p>
              <p className="text-2xl font-bold text-purple-600">{stats.personal}</p>
            </div>
            <XCircle className="h-10 w-10 text-purple-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disputed</p>
              <p className="text-2xl font-bold text-red-600">{stats.disputed}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-teal-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Linked Amt</p>
              <p className="text-xl font-bold text-teal-600">₹{(stats.linkedAmount / 1000).toFixed(1)}k</p>
            </div>
            <CheckCircle className="h-10 w-10 text-teal-400" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar & Tabs */}
        <div className="border-b border-gray-200">
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search merchant, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employees</option>
                <option value="EMP456">Rajesh Kumar</option>
                <option value="EMP789">Priya Sharma</option>
                <option value="EMP234">Amit Singh</option>
                <option value="EMP890">Suresh Patel</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          <div className="px-4 flex overflow-x-auto hide-scrollbar gap-1">
            {transactionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedStatus === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <DataTable data={filteredTransactions} columns={columns} />
      </div>

      {/* Transaction Status Info */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Status Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-1">Captured</h4>
            <p className="text-xs text-blue-800">Transaction synced from bank, pending action</p>
          </div>
          <div className="p-3 bg-green-50 border-l-4 border-green-600 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-1">Linked</h4>
            <p className="text-xs text-green-800">Matched with expense report & travel request</p>
          </div>
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-1">Unmatched</h4>
            <p className="text-xs text-yellow-800">No matching expense found, requires attention</p>
          </div>
          <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-1">Disputed</h4>
            <p className="text-xs text-red-800">Transaction disputed by cardholder</p>
          </div>
          <div className="p-3 bg-purple-50 border-l-4 border-purple-600 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-1">Personal</h4>
            <p className="text-xs text-purple-800">Personal expense, pending reimbursement</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Auto-Capture System</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Transactions are automatically synced from bank within 24 hours</li>
          <li>• System attempts auto-matching with submitted expense reports</li>
          <li>• Unmatched transactions require manual linking or classification</li>
          <li>• Personal expenses must be reimbursed to company within 7 days</li>
          <li>• GST details are automatically extracted when available</li>
          <li>• Monthly reconciliation report generated on 1st of every month</li>
        </ul>
      </div>
    </div>
  );
}
