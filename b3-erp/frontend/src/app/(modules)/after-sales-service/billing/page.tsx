'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, FileText, Send, DollarSign, AlertCircle, CheckCircle, Clock, XCircle, Download, TrendingUp, CreditCard } from 'lucide-react';

interface ServiceInvoice {
  id: string;
  invoiceNumber: string;
  invoiceType: 'Service' | 'AMC' | 'Installation' | 'Parts' | 'Warranty';
  customerId: string;
  customerName: string;
  status: 'draft' | 'sent' | 'paid' | 'partial_paid' | 'overdue' | 'void';
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  totalTax: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentTerms: string;
  serviceJobId?: string;
  contractId?: string;
  overdueDays?: number;
}

const mockInvoices: ServiceInvoice[] = [
  {
    id: '1',
    invoiceNumber: 'SI-2025-00123',
    invoiceType: 'Service',
    customerId: 'CUST001',
    customerName: 'Sharma Modular Kitchens Pvt Ltd',
    status: 'paid',
    invoiceDate: '2025-10-10',
    dueDate: '2025-10-25',
    subtotal: 8500,
    totalTax: 1530,
    totalAmount: 10030,
    paidAmount: 10030,
    balanceAmount: 0,
    paymentStatus: 'paid',
    paymentTerms: 'Net 15 days',
    serviceJobId: 'FS-2025-000456',
  },
  {
    id: '2',
    invoiceNumber: 'SI-2025-00134',
    invoiceType: 'AMC',
    customerId: 'CUST002',
    customerName: 'Prestige Developers Bangalore',
    status: 'sent',
    invoiceDate: '2025-10-01',
    dueDate: '2025-10-31',
    subtotal: 312500,
    totalTax: 56250,
    totalAmount: 368750,
    paidAmount: 0,
    balanceAmount: 368750,
    paymentStatus: 'unpaid',
    paymentTerms: 'Net 30 days',
    contractId: 'AMC-2025-0012',
  },
  {
    id: '3',
    invoiceNumber: 'SI-2025-00145',
    invoiceType: 'Installation',
    customerId: 'CUST003',
    customerName: 'Urban Interiors & Designers',
    status: 'partial_paid',
    invoiceDate: '2025-10-05',
    dueDate: '2025-10-20',
    subtotal: 285000,
    totalTax: 51300,
    totalAmount: 336300,
    paidAmount: 150000,
    balanceAmount: 186300,
    paymentStatus: 'partial',
    paymentTerms: '50% Advance, 50% on Completion',
  },
  {
    id: '4',
    invoiceNumber: 'SI-2025-00098',
    invoiceType: 'AMC',
    customerId: 'CUST004',
    customerName: 'Elite Contractors & Builders',
    status: 'overdue',
    invoiceDate: '2025-09-15',
    dueDate: '2025-10-15',
    subtotal: 45000,
    totalTax: 8100,
    totalAmount: 53100,
    paidAmount: 0,
    balanceAmount: 53100,
    paymentStatus: 'unpaid',
    paymentTerms: 'Net 30 days',
    contractId: 'AMC-2024-0234',
    overdueDays: 2,
  },
  {
    id: '5',
    invoiceNumber: 'SI-2025-00156',
    invoiceType: 'Service',
    customerId: 'CUST005',
    customerName: 'DLF Universal Projects',
    status: 'paid',
    invoiceDate: '2025-10-12',
    dueDate: '2025-10-27',
    subtotal: 1200,
    totalTax: 216,
    totalAmount: 1416,
    paidAmount: 1416,
    balanceAmount: 0,
    paymentStatus: 'paid',
    paymentTerms: 'Net 15 days',
    serviceJobId: 'FS-2025-000467',
  },
  {
    id: '6',
    invoiceNumber: 'SI-2025-00167',
    invoiceType: 'Warranty',
    customerId: 'CUST006',
    customerName: 'Signature Interiors Pune',
    status: 'sent',
    invoiceDate: '2025-10-14',
    dueDate: '2025-10-29',
    subtotal: 12000,
    totalTax: 2160,
    totalAmount: 14160,
    paidAmount: 0,
    balanceAmount: 14160,
    paymentStatus: 'unpaid',
    paymentTerms: 'Net 15 days',
  },
  {
    id: '7',
    invoiceNumber: 'SI-2025-00178',
    invoiceType: 'Parts',
    customerId: 'CUST007',
    customerName: 'Royal Homes Hyderabad',
    status: 'draft',
    invoiceDate: '2025-10-17',
    dueDate: '2025-11-01',
    subtotal: 3500,
    totalTax: 630,
    totalAmount: 4130,
    paidAmount: 0,
    balanceAmount: 4130,
    paymentStatus: 'unpaid',
    paymentTerms: 'Net 15 days',
  },
  {
    id: '8',
    invoiceNumber: 'SI-2025-00189',
    invoiceType: 'Installation',
    customerId: 'CUST008',
    customerName: 'Modern Living Ahmedabad',
    status: 'sent',
    invoiceDate: '2025-10-08',
    dueDate: '2025-10-23',
    subtotal: 1650000,
    totalTax: 297000,
    totalAmount: 1947000,
    paidAmount: 0,
    balanceAmount: 1947000,
    paymentStatus: 'unpaid',
    paymentTerms: 'Net 15 days',
  },
  {
    id: '9',
    invoiceNumber: 'SI-2025-00112',
    invoiceType: 'AMC',
    customerId: 'CUST009',
    customerName: 'Decor Studio Chennai',
    status: 'overdue',
    invoiceDate: '2025-09-20',
    dueDate: '2025-10-05',
    subtotal: 80000,
    totalTax: 14400,
    totalAmount: 94400,
    paidAmount: 40000,
    balanceAmount: 54400,
    paymentStatus: 'partial',
    paymentTerms: 'Net 15 days',
    contractId: 'AMC-2025-0078',
    overdueDays: 12,
  },
  {
    id: '10',
    invoiceNumber: 'SI-2025-00201',
    invoiceType: 'Service',
    customerId: 'CUST010',
    customerName: 'Cosmos Furniture Mart',
    status: 'paid',
    invoiceDate: '2025-10-13',
    dueDate: '2025-10-28',
    subtotal: 850,
    totalTax: 153,
    totalAmount: 1003,
    paidAmount: 1003,
    balanceAmount: 0,
    paymentStatus: 'paid',
    paymentTerms: 'Net 15 days',
    serviceJobId: 'FS-2025-000445',
  },
  {
    id: '11',
    invoiceNumber: 'SI-2025-00212',
    invoiceType: 'AMC',
    customerId: 'CUST011',
    customerName: 'Green Valley Builders',
    status: 'void',
    invoiceDate: '2025-09-25',
    dueDate: '2025-10-10',
    subtotal: 75000,
    totalTax: 13500,
    totalAmount: 88500,
    paidAmount: 0,
    balanceAmount: 0,
    paymentStatus: 'unpaid',
    paymentTerms: 'Net 15 days',
  },
  {
    id: '12',
    invoiceNumber: 'SI-2025-00223',
    invoiceType: 'Service',
    customerId: 'CUST012',
    customerName: 'Infinity Kitchen Solutions',
    status: 'sent',
    invoiceDate: '2025-10-16',
    dueDate: '2025-10-31',
    subtotal: 15000,
    totalTax: 2700,
    totalAmount: 17700,
    paidAmount: 0,
    balanceAmount: 17700,
    paymentStatus: 'unpaid',
    paymentTerms: 'Net 15 days',
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  partial_paid: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
  void: 'bg-gray-100 text-gray-700',
};

const statusIcons = {
  draft: Clock,
  sent: Send,
  paid: CheckCircle,
  partial_paid: DollarSign,
  overdue: AlertCircle,
  void: XCircle,
};

const invoiceTypeColors = {
  'Service': 'bg-blue-100 text-blue-700',
  'AMC': 'bg-purple-100 text-purple-700',
  'Installation': 'bg-orange-100 text-orange-700',
  'Parts': 'bg-cyan-100 text-cyan-700',
  'Warranty': 'bg-green-100 text-green-700',
};

export default function ServiceBillingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter invoices
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesType = typeFilter === 'all' || invoice.invoiceType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    totalInvoices: mockInvoices.length,
    draftInvoices: mockInvoices.filter(i => i.status === 'draft').length,
    sentInvoices: mockInvoices.filter(i => i.status === 'sent').length,
    paidInvoices: mockInvoices.filter(i => i.status === 'paid').length,
    overdueInvoices: mockInvoices.filter(i => i.status === 'overdue').length,
    totalInvoiced: mockInvoices.reduce((sum, i) => sum + i.totalAmount, 0),
    totalCollected: mockInvoices.reduce((sum, i) => sum + i.paidAmount, 0),
    totalOutstanding: mockInvoices.reduce((sum, i) => sum + i.balanceAmount, 0),
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Billing</h1>
        <p className="text-gray-600">Manage invoices and payment tracking</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draftInvoices}</p>
            </div>
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-blue-600">{stats.sentInvoices}</p>
            </div>
            <Send className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">{stats.paidInvoices}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-1 lg:col-span-3">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="flex flex-col justify-center">
              <p className="text-xs text-gray-600">Invoiced</p>
              <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.totalInvoiced)}</p>
            </div>
            <div className="flex flex-col justify-center border-l border-gray-200 pl-4">
              <p className="text-xs text-gray-600">Collected</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(stats.totalCollected)}</p>
            </div>
            <div className="flex flex-col justify-center border-l border-gray-200 pl-4">
              <p className="text-xs text-gray-600">Outstanding</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(stats.totalOutstanding)}</p>
            </div>
          </div>
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
                placeholder="Search by invoice number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="partial_paid">Partial Paid</option>
              <option value="overdue">Overdue</option>
              <option value="void">Void</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="Service">Service</option>
              <option value="AMC">AMC</option>
              <option value="Installation">Installation</option>
              <option value="Parts">Parts</option>
              <option value="Warranty">Warranty</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/after-sales-service/billing/payments')}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Payments
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => router.push('/after-sales-service/billing/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedInvoices.map((invoice) => {
                const StatusIcon = statusIcons[invoice.status];
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</span>
                        <span className="text-sm text-gray-600">{invoice.customerName}</span>
                        {invoice.serviceJobId && (
                          <span className="text-xs text-blue-600 mt-1">Job: {invoice.serviceJobId}</span>
                        )}
                        {invoice.contractId && (
                          <span className="text-xs text-purple-600 mt-1">Contract: {invoice.contractId}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${invoiceTypeColors[invoice.invoiceType]}`}>
                        {invoice.invoiceType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${statusColors[invoice.status]}`}>
                          <StatusIcon className="h-3 w-3" />
                          {invoice.status.replace('_', ' ').charAt(0).toUpperCase() + invoice.status.slice(1).replace('_', ' ')}
                        </span>
                        {invoice.overdueDays && invoice.overdueDays > 0 && (
                          <span className="text-xs text-red-600 font-medium">
                            {invoice.overdueDays} days overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-600 text-xs">Issued:</span>
                        <span className="text-gray-900">
                          {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-gray-600 text-xs mt-1">Due:</span>
                        <span className={invoice.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}>
                          {new Date(invoice.dueDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                        <span className="text-xs text-gray-500">Tax: {formatCurrency(invoice.totalTax)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {invoice.paidAmount > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-green-600">{formatCurrency(invoice.paidAmount)}</span>
                          <span className="text-xs text-gray-500">{invoice.paymentStatus === 'paid' ? 'Fully Paid' : 'Partial'}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No payment</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.balanceAmount > 0 ? (
                        <span className="text-sm font-medium text-red-600">{formatCurrency(invoice.balanceAmount)}</span>
                      ) : (
                        <span className="text-sm text-green-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/after-sales-service/billing/view/${invoice.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => router.push(`/after-sales-service/billing/edit/${invoice.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {(invoice.status === 'draft' || invoice.status === 'sent') && (
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Send Invoice"
                          >
                            <Send className="h-4 w-4" />
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
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
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
