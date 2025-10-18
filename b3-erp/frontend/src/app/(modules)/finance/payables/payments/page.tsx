'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Printer,
  Send,
  Calendar,
  DollarSign,
  TrendingDown,
  Building,
  FileText
} from 'lucide-react';

interface Payment {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  vendorName: string;
  vendorCode: string;
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'Cash' | 'Credit Card' | 'UPI';
  bankAccount: string;
  referenceNumber?: string;
  invoiceNumber?: string;
  amount: number;
  tdsDeducted: number;
  netPayment: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Processed' | 'Failed' | 'Cancelled';
  approvedBy?: string;
  approvedDate?: string;
  processedDate?: string;
  description: string;
  costCenter?: string;
  department?: string;
  createdBy: string;
  createdDate: string;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample payments data
  const payments: Payment[] = [
    {
      id: 'PMT001',
      paymentNumber: 'PMT-2025-001',
      paymentDate: '2025-01-15',
      vendorName: 'ABC Suppliers Pvt Ltd',
      vendorCode: 'VEN-001',
      paymentMethod: 'Bank Transfer',
      bankAccount: 'HDFC Bank - *1234',
      referenceNumber: 'UTR202501151234567',
      invoiceNumber: 'PINV-2025-001',
      amount: 500000,
      tdsDeducted: 10000,
      netPayment: 490000,
      status: 'Processed',
      approvedBy: 'John Doe',
      approvedDate: '2025-01-15',
      processedDate: '2025-01-15',
      description: 'Payment for raw materials purchase',
      costCenter: 'CC-OPS-001',
      department: 'Operations',
      createdBy: 'Jane Smith',
      createdDate: '2025-01-14'
    },
    {
      id: 'PMT002',
      paymentNumber: 'PMT-2025-002',
      paymentDate: '2025-01-18',
      vendorName: 'XYZ Contractors Ltd',
      vendorCode: 'VEN-002',
      paymentMethod: 'Cheque',
      bankAccount: 'ICICI Bank - *5678',
      referenceNumber: 'CHQ-123456',
      invoiceNumber: 'PINV-2025-003',
      amount: 750000,
      tdsDeducted: 15000,
      netPayment: 735000,
      status: 'Approved',
      approvedBy: 'Robert Brown',
      approvedDate: '2025-01-18',
      description: 'Construction work payment',
      costCenter: 'CC-FAC-001',
      department: 'Facilities',
      createdBy: 'Michael Chen',
      createdDate: '2025-01-17'
    },
    {
      id: 'PMT003',
      paymentNumber: 'PMT-2025-003',
      paymentDate: '2025-01-20',
      vendorName: 'DEF Services Inc',
      vendorCode: 'VEN-003',
      paymentMethod: 'UPI',
      bankAccount: 'HDFC Bank - *1234',
      referenceNumber: 'UPI202501201234567890',
      amount: 125000,
      tdsDeducted: 12500,
      netPayment: 112500,
      status: 'Processed',
      approvedBy: 'Sarah Wilson',
      approvedDate: '2025-01-20',
      processedDate: '2025-01-20',
      description: 'Professional fees for consulting',
      costCenter: 'CC-IT-001',
      department: 'IT',
      createdBy: 'Emily Davis',
      createdDate: '2025-01-19'
    },
    {
      id: 'PMT004',
      paymentNumber: 'PMT-2025-004',
      paymentDate: '2025-01-22',
      vendorName: 'GHI Equipment Rentals',
      vendorCode: 'VEN-004',
      paymentMethod: 'Bank Transfer',
      bankAccount: 'SBI - *9012',
      invoiceNumber: 'PINV-2025-005',
      amount: 300000,
      tdsDeducted: 30000,
      netPayment: 270000,
      status: 'Pending Approval',
      description: 'Equipment rental for January 2025',
      costCenter: 'CC-OPS-001',
      department: 'Operations',
      createdBy: 'David Martinez',
      createdDate: '2025-01-21'
    },
    {
      id: 'PMT005',
      paymentNumber: 'PMT-2025-005',
      paymentDate: '2025-01-25',
      vendorName: 'JKL Logistics Pvt Ltd',
      vendorCode: 'VEN-005',
      paymentMethod: 'Bank Transfer',
      bankAccount: 'HDFC Bank - *1234',
      referenceNumber: 'UTR202501251234567',
      invoiceNumber: 'PINV-2025-007',
      amount: 450000,
      tdsDeducted: 9000,
      netPayment: 441000,
      status: 'Processed',
      approvedBy: 'John Doe',
      approvedDate: '2025-01-25',
      processedDate: '2025-01-25',
      description: 'Transportation charges',
      costCenter: 'CC-LOG-001',
      department: 'Logistics',
      createdBy: 'Lisa Anderson',
      createdDate: '2025-01-24'
    },
    {
      id: 'PMT006',
      paymentNumber: 'PMT-2025-006',
      paymentDate: '2025-01-28',
      vendorName: 'MNO Office Supplies',
      vendorCode: 'VEN-006',
      paymentMethod: 'Credit Card',
      bankAccount: 'HDFC Credit Card - *3456',
      amount: 85000,
      tdsDeducted: 0,
      netPayment: 85000,
      status: 'Draft',
      description: 'Office stationery and supplies',
      costCenter: 'CC-HR-001',
      department: 'Human Resources',
      createdBy: 'Patricia White',
      createdDate: '2025-01-27'
    },
    {
      id: 'PMT007',
      paymentNumber: 'PMT-2025-007',
      paymentDate: '2025-01-30',
      vendorName: 'PQR Marketing Agency',
      vendorCode: 'VEN-007',
      paymentMethod: 'Bank Transfer',
      bankAccount: 'ICICI Bank - *5678',
      referenceNumber: 'UTR202501301234567',
      invoiceNumber: 'PINV-2025-010',
      amount: 600000,
      tdsDeducted: 60000,
      netPayment: 540000,
      status: 'Failed',
      description: 'Marketing campaign - Q1 2025',
      costCenter: 'CC-SAL-001',
      department: 'Sales',
      createdBy: 'James Taylor',
      createdDate: '2025-01-29'
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.invoiceNumber && payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;

    let matchesDate = true;
    if (dateFilter === 'this-month') {
      const paymentMonth = new Date(payment.paymentDate).getMonth();
      const currentMonth = new Date().getMonth();
      matchesDate = paymentMonth === currentMonth;
    } else if (dateFilter === 'last-month') {
      const paymentMonth = new Date(payment.paymentDate).getMonth();
      const lastMonth = new Date().getMonth() - 1;
      matchesDate = paymentMonth === lastMonth;
    }

    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  });

  // Calculate statistics
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, pmt) => sum + pmt.amount, 0);
  const totalProcessed = payments.filter(p => p.status === 'Processed').reduce((sum, p) => sum + p.netPayment, 0);
  const pendingApproval = payments.filter(p => p.status === 'Pending Approval').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Draft: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      'Pending Approval': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      Approved: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      Processed: 'bg-green-500/20 text-green-400 border-green-500/50',
      Failed: 'bg-red-500/20 text-red-400 border-red-500/50',
      Cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };
    const icons = {
      Draft: Clock,
      'Pending Approval': AlertTriangle,
      Approved: CheckCircle,
      Processed: CheckCircle,
      Failed: XCircle,
      Cancelled: XCircle
    };
    const Icon = icons[status as keyof typeof icons];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      'Bank Transfer': 'bg-blue-500/20 text-blue-400',
      'Cheque': 'bg-purple-500/20 text-purple-400',
      'Cash': 'bg-green-500/20 text-green-400',
      'Credit Card': 'bg-orange-500/20 text-orange-400',
      'UPI': 'bg-cyan-500/20 text-cyan-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[method as keyof typeof colors]}`}>
        {method}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
            <p className="text-gray-400">Manage vendor payments and disbursements</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg">
              <Plus className="w-5 h-5" />
              Make Payment
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{totalPayments}</div>
            <div className="text-blue-100 text-sm">Total Payments</div>
            <div className="mt-2 text-xs text-blue-100">This period</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalAmount)}</div>
            <div className="text-purple-100 text-sm">Total Amount</div>
            <div className="mt-2 text-xs text-purple-100">Gross payment value</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalProcessed)}</div>
            <div className="text-green-100 text-sm">Processed Payments</div>
            <div className="mt-2 text-xs text-green-100">
              {payments.filter(p => p.status === 'Processed').length} transactions
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 opacity-80" />
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{pendingApproval}</div>
            <div className="text-yellow-100 text-sm">Pending Approval</div>
            <div className="mt-2 text-xs text-yellow-100">Awaiting action</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by payment number, vendor, or invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Processed">Processed</option>
                <option value="Failed">Failed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Methods</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Payment #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Vendor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Method</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">TDS</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Net Payment</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white font-mono">{payment.paymentNumber}</div>
                      {payment.invoiceNumber && (
                        <div className="text-xs text-gray-400 mt-1">Ref: {payment.invoiceNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{payment.vendorName}</div>
                      <div className="text-xs text-gray-400 font-mono mt-1">{payment.vendorCode}</div>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getMethodBadge(payment.paymentMethod)}
                      <div className="text-xs text-gray-400 mt-1">{payment.bankAccount}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-right text-orange-400 font-medium">
                      {payment.tdsDeducted > 0 ? formatCurrency(payment.tdsDeducted) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-green-400 font-medium">
                      {formatCurrency(payment.netPayment)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(payment.status)}
                      {payment.processedDate && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(payment.processedDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                        {(payment.status === 'Draft' || payment.status === 'Failed') && (
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                        {payment.status === 'Processed' && (
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Print Receipt">
                            <Printer className="w-4 h-4 text-purple-400" />
                          </button>
                        )}
                        {payment.status === 'Pending Approval' && (
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No payments found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="text-gray-400 text-sm">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">2</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
