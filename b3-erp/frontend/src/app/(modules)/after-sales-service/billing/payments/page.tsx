'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, Download, CreditCard, DollarSign, TrendingUp, Calendar, CheckCircle, Building2 } from 'lucide-react';

interface Payment {
  id: string;
  paymentNumber: string;
  invoiceNumber: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  paymentReference?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockPayments: Payment[] = [
  {
    id: '1',
    paymentNumber: 'PMT-2025-000234',
    invoiceNumber: 'SI-2025-00145',
    invoiceId: '3',
    customerId: 'CUST003',
    customerName: 'Urban Interiors & Designers',
    amount: 150000,
    paymentDate: '2025-10-06',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'NEFT/UTR123456789',
    notes: 'Advance payment - 50%',
    status: 'completed',
  },
  {
    id: '2',
    paymentNumber: 'PMT-2025-000245',
    invoiceNumber: 'SI-2025-00123',
    invoiceId: '1',
    customerId: 'CUST001',
    customerName: 'Sharma Modular Kitchens Pvt Ltd',
    amount: 10030,
    paymentDate: '2025-10-11',
    paymentMethod: 'UPI',
    paymentReference: 'UPI/234567890123',
    status: 'completed',
  },
  {
    id: '3',
    paymentNumber: 'PMT-2025-000256',
    invoiceNumber: 'SI-2025-00156',
    invoiceId: '5',
    customerId: 'CUST005',
    customerName: 'DLF Universal Projects',
    amount: 1416,
    paymentDate: '2025-10-13',
    paymentMethod: 'Cash',
    status: 'completed',
  },
  {
    id: '4',
    paymentNumber: 'PMT-2025-000267',
    invoiceNumber: 'SI-2025-00201',
    invoiceId: '10',
    customerId: 'CUST010',
    customerName: 'Cosmos Furniture Mart',
    amount: 1003,
    paymentDate: '2025-10-14',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'RTGS/987654321',
    status: 'completed',
  },
  {
    id: '5',
    paymentNumber: 'PMT-2025-000198',
    invoiceNumber: 'SI-2025-00112',
    invoiceId: '9',
    customerId: 'CUST009',
    customerName: 'Decor Studio Chennai',
    amount: 40000,
    paymentDate: '2025-10-01',
    paymentMethod: 'Cheque',
    paymentReference: 'CHQ#789456',
    notes: 'Partial payment against AMC invoice',
    status: 'completed',
  },
  {
    id: '6',
    paymentNumber: 'PMT-2025-000278',
    invoiceNumber: 'SI-2025-00167',
    invoiceId: '6',
    customerId: 'CUST006',
    customerName: 'Signature Interiors Pune',
    amount: 14160,
    paymentDate: '2025-10-15',
    paymentMethod: 'Credit Card',
    paymentReference: 'CC/VISA/****1234',
    status: 'completed',
  },
  {
    id: '7',
    paymentNumber: 'PMT-2025-000289',
    invoiceNumber: 'SI-2025-00134',
    invoiceId: '2',
    customerId: 'CUST002',
    customerName: 'Prestige Developers Bangalore',
    amount: 368750,
    paymentDate: '2025-10-16',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'NEFT/567890123456',
    notes: 'Quarterly AMC payment',
    status: 'completed',
  },
  {
    id: '8',
    paymentNumber: 'PMT-2025-000295',
    invoiceNumber: 'SI-2025-00189',
    invoiceId: '8',
    customerId: 'CUST008',
    customerName: 'Modern Living Ahmedabad',
    amount: 973500,
    paymentDate: '2025-10-17',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'RTGS/345678901234',
    notes: '50% advance for premium kitchen installation',
    status: 'completed',
  },
  {
    id: '9',
    paymentNumber: 'PMT-2025-000301',
    invoiceNumber: 'SI-2025-00212',
    invoiceId: '11',
    customerId: 'CUST011',
    customerName: 'Green Valley Builders',
    amount: 0,
    paymentDate: '2025-10-17',
    paymentMethod: 'Bank Transfer',
    status: 'pending',
  },
  {
    id: '10',
    paymentNumber: 'PMT-2025-000312',
    invoiceNumber: 'SI-2025-00223',
    invoiceId: '12',
    customerId: 'CUST012',
    customerName: 'Infinity Kitchen Solutions',
    amount: 17700,
    paymentDate: '2025-10-17',
    paymentMethod: 'UPI',
    paymentReference: 'UPI/678901234567',
    status: 'completed',
  },
];

const paymentMethodColors = {
  'Cash': 'bg-green-100 text-green-700',
  'Bank Transfer': 'bg-blue-100 text-blue-700',
  'Cheque': 'bg-purple-100 text-purple-700',
  'UPI': 'bg-orange-100 text-orange-700',
  'Credit Card': 'bg-pink-100 text-pink-700',
  'Debit Card': 'bg-cyan-100 text-cyan-700',
};

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

export default function PaymentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter payments
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    totalPayments: mockPayments.length,
    totalCollected: mockPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    todayCollections: mockPayments
      .filter(p => p.paymentDate === new Date().toISOString().split('T')[0] && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: mockPayments.filter(p => p.status === 'pending').length,
  };

  // Payment method breakdown
  const methodBreakdown = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((acc, payment) => {
      const method = payment.paymentMethod;
      if (!acc[method]) {
        acc[method] = { count: 0, amount: 0 };
      }
      acc[method].count += 1;
      acc[method].amount += payment.amount;
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Collections</h1>
        <p className="text-gray-600">Track and manage payment receipts</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Collected</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalCollected)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Collection</p>
              <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.todayCollections)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(methodBreakdown).map(([method, data]) => (
            <div key={method} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className={`text-xs font-medium mb-1 px-2 py-1 rounded inline-block ${paymentMethodColors[method as keyof typeof paymentMethodColors]}`}>
                {method}
              </p>
              <p className="text-sm text-gray-600 mt-2">{data.count} payments</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(data.amount)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by payment number, invoice, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>
          </div>

          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{payment.paymentNumber}</span>
                      {payment.notes && (
                        <span className="text-xs text-gray-500 mt-1">{payment.notes}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                      {payment.invoiceNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{payment.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${paymentMethodColors[payment.paymentMethod as keyof typeof paymentMethodColors]}`}>
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {payment.paymentReference ? (
                      <span className="text-xs text-gray-600 font-mono">{payment.paymentReference}</span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[payment.status]}`}>
                      {payment.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => router.push(`/after-sales-service/billing/view/${payment.invoiceId}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                     
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
