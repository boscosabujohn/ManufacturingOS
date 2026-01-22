'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Download, Building, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight, FileText, User, BarChart3, CreditCard, ArrowRight } from 'lucide-react';

interface Receivable {
  id: string;
  receivableNumber: string;
  customerName: string;
  customerId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  collectedAmount: number;
  status: 'pending' | 'due_soon' | 'overdue' | 'collected' | 'partially_collected';
  paymentTerms: string;
  salesOrder: string;
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  agingDays: number;
  collectionAgent: string;
}

const mockReceivables: Receivable[] = [
  {
    id: 'AR-001',
    receivableNumber: 'AR-2025-001',
    customerName: 'Hotel Paradise Ltd',
    customerId: 'CUST-001',
    invoiceNumber: 'INV-2025-001',
    invoiceDate: '2025-10-01',
    dueDate: '2025-10-31',
    amount: 150000,
    taxAmount: 22500,
    totalAmount: 172500,
    collectedAmount: 172500,
    status: 'collected',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-145',
    agingBucket: '0-30',
    agingDays: 0,
    collectionAgent: 'Finance Team',
  },
  {
    id: 'AR-002',
    receivableNumber: 'AR-2025-002',
    customerName: 'Culinary Delights Inc',
    customerId: 'CUST-002',
    invoiceNumber: 'INV-2025-002',
    invoiceDate: '2025-10-05',
    dueDate: '2025-11-04',
    amount: 102000,
    taxAmount: 15300,
    totalAmount: 117300,
    collectedAmount: 60000,
    status: 'partially_collected',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-156',
    agingBucket: '0-30',
    agingDays: 12,
    collectionAgent: 'Sarah Collections',
  },
  {
    id: 'AR-003',
    receivableNumber: 'AR-2025-003',
    customerName: 'City General Hospital',
    customerId: 'CUST-003',
    invoiceNumber: 'INV-2025-003',
    invoiceDate: '2025-10-08',
    dueDate: '2025-10-22',
    amount: 240000,
    taxAmount: 36000,
    totalAmount: 276000,
    collectedAmount: 0,
    status: 'due_soon',
    paymentTerms: 'Net 14',
    salesOrder: 'SO-2025-167',
    agingBucket: '0-30',
    agingDays: 9,
    collectionAgent: 'John AR',
  },
  {
    id: 'AR-004',
    receivableNumber: 'AR-2025-004',
    customerName: 'Springfield Academy',
    customerId: 'CUST-004',
    invoiceNumber: 'INV-2025-004',
    invoiceDate: '2025-08-15',
    dueDate: '2025-09-14',
    amount: 54000,
    taxAmount: 8100,
    totalAmount: 62100,
    collectedAmount: 0,
    status: 'overdue',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-178',
    agingBucket: '90+',
    agingDays: 98,
    collectionAgent: 'Michael Collections',
  },
  {
    id: 'AR-005',
    receivableNumber: 'AR-2025-005',
    customerName: 'Artisan Bakers Co',
    customerId: 'CUST-005',
    invoiceNumber: 'INV-2025-005',
    invoiceDate: '2025-09-10',
    dueDate: '2025-10-10',
    amount: 210000,
    taxAmount: 31500,
    totalAmount: 241500,
    collectedAmount: 0,
    status: 'overdue',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-189',
    agingBucket: '31-60',
    agingDays: 37,
    collectionAgent: 'Finance Team',
  },
  {
    id: 'AR-006',
    receivableNumber: 'AR-2025-006',
    customerName: 'Restaurant Group LLC',
    customerId: 'CUST-006',
    invoiceNumber: 'INV-2025-006',
    invoiceDate: '2025-10-14',
    dueDate: '2025-11-13',
    amount: 95000,
    taxAmount: 14250,
    totalAmount: 109250,
    collectedAmount: 0,
    status: 'pending',
    paymentTerms: 'Net 30',
    salesOrder: 'SO-2025-190',
    agingBucket: '0-30',
    agingDays: 3,
    collectionAgent: 'Sarah Collections',
  },
];

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  due_soon: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
  collected: 'bg-green-100 text-green-700',
  partially_collected: 'bg-blue-100 text-blue-700',
};

const statusLabels = {
  pending: 'Pending',
  due_soon: 'Due Soon',
  overdue: 'Overdue',
  collected: 'Collected',
  partially_collected: 'Partially Collected',
};

const agingBucketColors = {
  '0-30': 'bg-green-100 text-green-700',
  '31-60': 'bg-yellow-100 text-yellow-700',
  '61-90': 'bg-orange-100 text-orange-700',
  '90+': 'bg-red-100 text-red-700',
};

export default function ReceivablesPage() {
  const router = useRouter();
  const [receivables, setReceivables] = useState<Receivable[]>(mockReceivables);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agingFilter, setAgingFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;

  const filteredReceivables = receivables.filter((receivable) => {
    const matchesSearch =
      receivable.receivableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receivable.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receivable.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receivable.salesOrder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || receivable.status === statusFilter;
    const matchesAging = agingFilter === 'all' || receivable.agingBucket === agingFilter;
    return matchesSearch && matchesStatus && matchesAging;
  });

  const totalPages = Math.ceil(filteredReceivables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReceivables = filteredReceivables.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalReceivables: receivables.reduce((sum, r) => sum + (r.totalAmount - r.collectedAmount), 0),
    dueThisWeek: receivables
      .filter((r) => {
        const daysUntilDue = Math.ceil((new Date(r.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue >= 0 && r.collectedAmount < r.totalAmount;
      })
      .reduce((sum, r) => sum + (r.totalAmount - r.collectedAmount), 0),
    overdue: receivables.filter((r) => r.status === 'overdue').reduce((sum, r) => sum + (r.totalAmount - r.collectedAmount), 0),
    collectedThisMonth: receivables
      .filter((r) => {
        const collectionDate = new Date(r.invoiceDate);
        const currentMonth = new Date().getMonth();
        return collectionDate.getMonth() === currentMonth && r.collectedAmount > 0;
      })
      .reduce((sum, r) => sum + r.collectedAmount, 0),
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Receivable Number', 'Customer Name', 'Customer ID', 'Invoice Number', 'Invoice Date', 'Due Date', 'Amount', 'Tax', 'Total', 'Collected', 'Balance', 'Status', 'Aging Bucket', 'Aging Days', 'Payment Terms', 'Sales Order', 'Collection Agent'];
      const rows = filteredReceivables.map(r => [
        r.receivableNumber,
        r.customerName,
        r.customerId,
        r.invoiceNumber,
        r.invoiceDate,
        r.dueDate,
        r.amount,
        r.taxAmount,
        r.totalAmount,
        r.collectedAmount,
        r.totalAmount - r.collectedAmount,
        statusLabels[r.status],
        r.agingBucket,
        r.agingDays,
        r.paymentTerms,
        r.salesOrder,
        r.collectionAgent
      ]);

      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receivables_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
    }, 500);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats */}
          <div className="mb-6 flex items-start gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Receivables</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">₹{(stats.totalReceivables / 1000).toFixed(0)}K</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Collected This Month</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">₹{(stats.collectedThisMonth / 1000).toFixed(0)}K</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Due This Week</p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">₹{(stats.dueThisWeek / 1000).toFixed(0)}K</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">₹{(stats.overdue / 1000).toFixed(0)}K</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/finance/receivables/add')}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
            >
              <Plus className="h-5 w-5" />
              <span>Add Receivable</span>
            </button>
          </div>

          {/* Quick Access Navigation */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Accounts Receivable Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                href="/finance/receivables/aging"
                className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Aging Report</h4>
                  <p className="text-xs text-gray-600">Analyze customer payment aging</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/finance/receivables/credit-management"
                className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Credit Management</h4>
                  <p className="text-xs text-gray-600">Manage customer credit limits</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/finance/receivables/invoices"
                className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Invoices</h4>
                  <p className="text-xs text-gray-600">View and manage AR invoices</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/finance/receivables/collections"
                className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Collections</h4>
                  <p className="text-xs text-gray-600">Track payment collections</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by receivable number, customer, invoice, or SO..."
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
              <option value="pending">Pending</option>
              <option value="due_soon">Due Soon</option>
              <option value="overdue">Overdue</option>
              <option value="collected">Collected</option>
              <option value="partially_collected">Partially Collected</option>
            </select>
            <select
              value={agingFilter}
              onChange={(e) => setAgingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Aging</option>
              <option value="0-30">0-30 Days</option>
              <option value="31-60">31-60 Days</option>
              <option value="61-90">61-90 Days</option>
              <option value="90+">90+ Days</option>
            </select>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receivable</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedReceivables.map((receivable) => {
                    const balance = receivable.totalAmount - receivable.collectedAmount;
                    const isOverdue = new Date(receivable.dueDate) < new Date() && balance > 0;

                    return (
                      <tr key={receivable.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{receivable.receivableNumber}</div>
                              <div className="text-xs text-gray-500">{receivable.salesOrder}</div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${agingBucketColors[receivable.agingBucket]}`}>
                                  {receivable.agingBucket} days
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{receivable.customerName}</div>
                              <div className="text-sm text-gray-500">{receivable.customerId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-blue-600">{receivable.invoiceNumber}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{receivable.paymentTerms}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Invoice: {receivable.invoiceDate}</span>
                            </div>
                            <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-blue-600'}`}>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Due: {receivable.dueDate}</span>
                            </div>
                            <div className="text-xs text-gray-500">Aging: {receivable.agingDays} days</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">₹{receivable.totalAmount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Base: ₹{receivable.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Tax: ₹{receivable.taxAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-green-700">₹{receivable.collectedAmount.toLocaleString()}</div>
                          {receivable.collectedAmount > 0 && (
                            <div className="text-xs text-gray-500">
                              {((receivable.collectedAmount / receivable.totalAmount) * 100).toFixed(0)}% collected
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-bold ${balance > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                            ₹{balance.toLocaleString()}
                          </div>
                          {balance > 0 && isOverdue && (
                            <div className="text-xs text-red-600 font-semibold">Collection Overdue</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[receivable.status]}`}>
                            {statusLabels[receivable.status]}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            <User className="h-3 w-3 inline mr-1" />
                            {receivable.collectionAgent}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => router.push(`/finance/receivables/view/${receivable.id}`)}
                              className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"

                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => router.push(`/finance/receivables/edit/${receivable.id}`)}
                              className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"

                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReceivables.length)} of{' '}
                {filteredReceivables.length} items
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
                          className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
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
      </div>
    </div>
  );
}
