'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Calendar, DollarSign, Clock, AlertTriangle, TrendingUp, Download, Eye } from 'lucide-react';

interface PendingBill {
  id: string;
  invoiceNumber: string;
  customerName: string;
  email: string;
  phone: string;
  amount: number;
  dueDate: string;
  invoiceDate: string;
  status: 'overdue' | 'due-soon' | 'pending';
  daysOverdue?: number;
  serviceType: string;
  description: string;
  paymentTerms: string;
}

const mockPendingBills: PendingBill[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-10-001',
    customerName: 'Rajesh Manufacturing',
    email: 'accounts@rajesh-mfg.com',
    phone: '+91-9876543210',
    amount: 45000,
    dueDate: '2025-10-20',
    invoiceDate: '2025-09-20',
    status: 'overdue',
    daysOverdue: 3,
    serviceType: 'Annual Maintenance Contract',
    description: 'Preventive maintenance and inspection for production line equipment',
    paymentTerms: 'Net 30'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-10-002',
    customerName: 'Pune Auto Parts',
    email: 'finance@punemauto.com',
    phone: '+91-9123456789',
    amount: 28500,
    dueDate: '2025-10-25',
    invoiceDate: '2025-09-25',
    status: 'due-soon',
    serviceType: 'Installation & Setup',
    description: 'Installation and calibration of new robotic assembly system',
    paymentTerms: 'Net 30'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-10-003',
    customerName: 'Mumbai Electronics',
    email: 'billing@mumbaielectronics.com',
    phone: '+91-8765432109',
    amount: 62000,
    dueDate: '2025-10-22',
    invoiceDate: '2025-09-22',
    status: 'overdue',
    daysOverdue: 1,
    serviceType: 'Emergency Repair',
    description: 'Emergency on-site repair and component replacement - production line halt',
    paymentTerms: 'Net 30'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-10-004',
    customerName: 'Delhi Manufacturing Hub',
    email: 'payments@delhimfg.com',
    phone: '+91-7654321098',
    amount: 35500,
    dueDate: '2025-10-28',
    invoiceDate: '2025-09-28',
    status: 'due-soon',
    serviceType: 'Preventive Maintenance',
    description: 'Quarterly preventive maintenance and spare parts replacement',
    paymentTerms: 'Net 30'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2025-10-005',
    customerName: 'Bangalore Tech Solutions',
    email: 'ap@bangaloretech.com',
    phone: '+91-6543210987',
    amount: 18900,
    dueDate: '2025-10-30',
    invoiceDate: '2025-10-01',
    status: 'pending',
    serviceType: 'Technical Support',
    description: 'Extended technical support and troubleshooting services - 40 hours',
    paymentTerms: 'Net 30'
  },
  {
    id: '6',
    invoiceNumber: 'INV-2025-10-006',
    customerName: 'Chennai Industrial',
    email: 'finance@chennaiindustrial.com',
    phone: '+91-5432109876',
    amount: 51200,
    dueDate: '2025-10-26',
    invoiceDate: '2025-09-26',
    status: 'overdue',
    daysOverdue: 2,
    serviceType: 'Equipment Replacement',
    description: 'Supply and installation of replacement components for legacy systems',
    paymentTerms: 'Net 30'
  },
  {
    id: '7',
    invoiceNumber: 'INV-2025-10-007',
    customerName: 'Ahmedabad Precision',
    email: 'accounts@ahmedprecision.com',
    phone: '+91-4321098765',
    amount: 42300,
    dueDate: '2025-11-05',
    invoiceDate: '2025-10-06',
    status: 'pending',
    serviceType: 'Training & Documentation',
    description: 'Staff training and comprehensive system documentation preparation',
    paymentTerms: 'Net 30'
  },
  {
    id: '8',
    invoiceNumber: 'INV-2025-10-008',
    customerName: 'Hyderabad Manufacturing',
    email: 'billing@hyderabadmfg.com',
    phone: '+91-3210987654',
    amount: 55800,
    dueDate: '2025-10-24',
    invoiceDate: '2025-09-24',
    status: 'overdue',
    daysOverdue: 4,
    serviceType: 'System Upgrade',
    description: 'Complete software upgrade and firmware updates for production systems',
    paymentTerms: 'Net 30'
  }
];

export default function PendingBillsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('overdue');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'amount' | 'dueDate' | 'daysOverdue'>('dueDate');

  const serviceTypes = ['Annual Maintenance Contract', 'Installation & Setup', 'Emergency Repair', 'Preventive Maintenance', 'Technical Support', 'Equipment Replacement', 'Training & Documentation', 'System Upgrade'];

  const filteredBills = useMemo(() => {
    let filtered = mockPendingBills.filter(bill => {
      const matchesSearch = bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = bill.status === selectedStatus;
      const matchesServiceType = selectedServiceType === 'all' || bill.serviceType === selectedServiceType;
      return matchesSearch && matchesStatus && matchesServiceType;
    });

    // Sort
    if (sortBy === 'amount') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'daysOverdue') {
      filtered.sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0));
    } else {
      filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }

    return filtered;
  }, [searchTerm, selectedStatus, selectedServiceType, sortBy]);

  const stats = {
    total: mockPendingBills.length,
    overdue: mockPendingBills.filter(b => b.status === 'overdue').length,
    dueSoon: mockPendingBills.filter(b => b.status === 'due-soon').length,
    pending: mockPendingBills.filter(b => b.status === 'pending').length,
    totalAmount: mockPendingBills.reduce((sum, b) => sum + b.amount, 0),
    overdueAmount: mockPendingBills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'due-soon': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'due-soon': return <Clock className="h-4 w-4" />;
      case 'pending': return <DollarSign className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-emerald-600" />
            Pending Bills
          </h1>
          <p className="text-gray-600 mt-1">Track and manage outstanding invoices and payments</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus className="h-5 w-5" />
          Create Invoice
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">₹{stats.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdue}</p>
              <p className="text-xs text-gray-500 mt-1">₹{stats.overdueAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Soon</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.dueSoon}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Not Yet Due</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.pending}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Invoice Value</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">₹{(stats.totalAmount / stats.total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice number, customer, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="overdue">Overdue</option>
                <option value="due-soon">Due Soon</option>
                <option value="pending">Not Yet Due</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Service Type</label>
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="all">All Types</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white hover:border-gray-300"
              >
                <option value="dueDate">Due Date</option>
                <option value="amount">Amount (High to Low)</option>
                <option value="daysOverdue">Days Overdue</option>
              </select>
            </div>

            <div></div>

            <div className="flex items-end">
              <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-4">
        {filteredBills.map((bill) => (
          <div key={bill.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{bill.invoiceNumber}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(bill.status)}`}>
                    {getStatusIcon(bill.status)}
                    {bill.status === 'due-soon' ? 'Due Soon' : bill.status === 'overdue' ? 'Overdue' : 'Pending'}
                  </span>
                </div>

                <p className="text-gray-700 font-medium mb-3">{bill.customerName}</p>

                <p className="text-gray-600 text-sm mb-3">{bill.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Amount</p>
                    <p className="text-sm font-semibold text-gray-900">₹{bill.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Due Date</p>
                    <p className="text-sm font-semibold text-gray-900">{new Date(bill.dueDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Invoice Date</p>
                    <p className="text-sm font-semibold text-gray-900">{new Date(bill.invoiceDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Service Type</p>
                    <p className="text-sm font-semibold text-gray-900">{bill.serviceType}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Payment Terms</p>
                    <p className="text-sm font-semibold text-gray-900">{bill.paymentTerms}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">📧</span>
                    {bill.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">📱</span>
                    {bill.phone}
                  </div>
                  {bill.daysOverdue && (
                    <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                      {bill.daysOverdue} day{bill.daysOverdue !== 1 ? 's' : ''} overdue
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-6 flex gap-2 flex-shrink-0">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-emerald-600 hover:text-emerald-700"
                  aria-label="Download"
                 
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-emerald-600 hover:text-emerald-700"
                  aria-label="View"
                 
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredBills.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No pending bills found</p>
            <p className="text-gray-500 text-sm">Excellent! All bills are paid.</p>
          </div>
        )}
      </div>
    </div>
  );
}
