'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Download, FileText, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  salesOrder: string;
  createdBy: string;
  paymentMethod?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2025-001',
    customerName: 'Hotel Paradise Ltd',
    customerId: 'CUST-001',
    invoiceDate: '2025-10-01',
    dueDate: '2025-10-31',
    amount: 150000,
    taxAmount: 22500,
    totalAmount: 172500,
    paidAmount: 172500,
    status: 'paid',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-145',
    createdBy: 'Finance Team',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2025-002',
    customerName: 'Culinary Delights Inc',
    customerId: 'CUST-002',
    invoiceDate: '2025-10-05',
    dueDate: '2025-11-04',
    amount: 102000,
    taxAmount: 15300,
    totalAmount: 117300,
    paidAmount: 50000,
    status: 'partially_paid',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-156',
    createdBy: 'Finance Team',
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2025-003',
    customerName: 'City General Hospital',
    customerId: 'CUST-003',
    invoiceDate: '2025-10-08',
    dueDate: '2025-11-07',
    amount: 240000,
    taxAmount: 36000,
    totalAmount: 276000,
    paidAmount: 0,
    status: 'sent',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-167',
    createdBy: 'Finance Team',
  },
  {
    id: 'INV-004',
    invoiceNumber: 'INV-2025-004',
    customerName: 'Springfield Academy',
    customerId: 'CUST-004',
    invoiceDate: '2025-09-15',
    dueDate: '2025-10-15',
    amount: 54000,
    taxAmount: 8100,
    totalAmount: 62100,
    paidAmount: 0,
    status: 'overdue',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-178',
    createdBy: 'Finance Team',
  },
  {
    id: 'INV-005',
    invoiceNumber: 'INV-2025-005',
    customerName: 'Artisan Bakers Co',
    customerId: 'CUST-005',
    invoiceDate: '2025-10-12',
    dueDate: '2025-11-11',
    amount: 210000,
    taxAmount: 31500,
    totalAmount: 241500,
    paidAmount: 0,
    status: 'draft',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-189',
    createdBy: 'Finance Team',
  },
  {
    id: 'INV-006',
    invoiceNumber: 'INV-2025-006',
    customerName: 'Restaurant Group LLC',
    customerId: 'CUST-006',
    invoiceDate: '2025-10-14',
    dueDate: '2025-11-13',
    amount: 95000,
    taxAmount: 14250,
    totalAmount: 109250,
    paidAmount: 109250,
    status: 'paid',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-190',
    createdBy: 'Finance Team',
    paymentMethod: 'Credit Card',
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  partially_paid: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-orange-100 text-orange-700',
};

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent',
  partially_paid: 'Partially Paid',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.salesOrder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paidAmount: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    pendingAmount: invoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0),
    overdueCount: invoices.filter((inv) => inv.status === 'overdue').length,
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Paid</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  ${(stats.paidAmount / 1000).toFixed(0)}K
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  ${(stats.pendingAmount / 1000).toFixed(0)}K
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Overdue</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{stats.overdueCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/finance/invoices/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice number, customer, or sales order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedInvoices.map((inv) => {
                const balance = inv.totalAmount - inv.paidAmount;
                const isOverdue = new Date(inv.dueDate) < new Date() && balance > 0;

                return (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{inv.invoiceNumber}</div>
                          <div className="text-xs text-gray-500">{inv.salesOrder}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{inv.paymentTerms}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{inv.customerName}</div>
                      <div className="text-sm text-gray-500">{inv.customerId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Invoice: {inv.invoiceDate}</span>
                        </div>
                        <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-blue-600'}`}>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Due: {inv.dueDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">${inv.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Base: ${inv.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Tax: ${inv.taxAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-700">${inv.paidAmount.toLocaleString()}</div>
                      {inv.paymentMethod && (
                        <div className="text-xs text-gray-500">{inv.paymentMethod}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${balance > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                        ${balance.toLocaleString()}
                      </div>
                      {balance > 0 && (
                        <div className="text-xs text-gray-500">
                          {((inv.paidAmount / inv.totalAmount) * 100).toFixed(0)}% paid
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[inv.status]}`}>
                        {statusLabels[inv.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => router.push(`/finance/invoices/view/${inv.id}`)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => router.push(`/finance/invoices/edit/${inv.id}`)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        {inv.status === 'draft' && (
                          <button
                            className="flex items-center space-x-1 px-3 py-1.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-sm font-medium"
                            title="Send Invoice"
                          >
                            <Send className="h-4 w-4" />
                            <span>Send</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of{' '}
            {filteredInvoices.length} items
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
                .filter((page) => {
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
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
    </div>
  );
}
