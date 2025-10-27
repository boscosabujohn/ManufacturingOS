'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Download, Building, Calendar, DollarSign, TrendingDown, AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight, FileText, User } from 'lucide-react';

interface Payable {
  id: string;
  payableNumber: string;
  vendorName: string;
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'due_soon' | 'overdue' | 'paid' | 'partially_paid';
  paymentTerms: string;
  purchaseOrder: string;
  category: string;
  agingDays: number;
  assignedTo: string;
}

const mockPayables: Payable[] = [
  {
    id: 'AP-001',
    payableNumber: 'AP-2025-001',
    vendorName: 'Global Materials Supply Co',
    vendorId: 'VEND-001',
    invoiceNumber: 'GMSC-INV-4521',
    invoiceDate: '2025-10-01',
    dueDate: '2025-10-31',
    amount: 125000,
    taxAmount: 18750,
    totalAmount: 143750,
    paidAmount: 143750,
    status: 'paid',
    paymentTerms: 'Net 30',
    purchaseOrder: 'PO-2025-101',
    category: 'Raw Materials',
    agingDays: 0,
    assignedTo: 'Finance Team',
  },
  {
    id: 'AP-002',
    payableNumber: 'AP-2025-002',
    vendorName: 'Precision Tools Manufacturing',
    vendorId: 'VEND-002',
    invoiceNumber: 'PTM-INV-8934',
    invoiceDate: '2025-10-08',
    dueDate: '2025-10-22',
    amount: 85000,
    taxAmount: 12750,
    totalAmount: 97750,
    paidAmount: 50000,
    status: 'partially_paid',
    paymentTerms: 'Net 14',
    purchaseOrder: 'PO-2025-115',
    category: 'Equipment',
    agingDays: 9,
    assignedTo: 'John Accounts',
  },
  {
    id: 'AP-003',
    payableNumber: 'AP-2025-003',
    vendorName: 'Industrial Logistics Ltd',
    vendorId: 'VEND-003',
    invoiceNumber: 'ILL-INV-2341',
    invoiceDate: '2025-10-10',
    dueDate: '2025-10-24',
    amount: 42000,
    taxAmount: 6300,
    totalAmount: 48300,
    paidAmount: 0,
    status: 'due_soon',
    paymentTerms: 'Net 14',
    purchaseOrder: 'PO-2025-122',
    category: 'Freight & Shipping',
    agingDays: 7,
    assignedTo: 'Sarah Finance',
  },
  {
    id: 'AP-004',
    payableNumber: 'AP-2025-004',
    vendorName: 'Energy Power Solutions',
    vendorId: 'VEND-004',
    invoiceNumber: 'EPS-INV-7821',
    invoiceDate: '2025-09-15',
    dueDate: '2025-10-15',
    amount: 38000,
    taxAmount: 5700,
    totalAmount: 43700,
    paidAmount: 0,
    status: 'overdue',
    paymentTerms: 'Net 30',
    purchaseOrder: 'PO-2025-089',
    category: 'Utilities',
    agingDays: 32,
    assignedTo: 'Finance Team',
  },
  {
    id: 'AP-005',
    payableNumber: 'AP-2025-005',
    vendorName: 'Quality Packaging Inc',
    vendorId: 'VEND-005',
    invoiceNumber: 'QPI-INV-5612',
    invoiceDate: '2025-10-12',
    dueDate: '2025-11-11',
    amount: 67000,
    taxAmount: 10050,
    totalAmount: 77050,
    paidAmount: 0,
    status: 'pending',
    paymentTerms: 'Net 30',
    purchaseOrder: 'PO-2025-128',
    category: 'Packaging',
    agingDays: 5,
    assignedTo: 'Michael AP',
  },
  {
    id: 'AP-006',
    payableNumber: 'AP-2025-006',
    vendorName: 'Tech Maintenance Services',
    vendorId: 'VEND-006',
    invoiceNumber: 'TMS-INV-9123',
    invoiceDate: '2025-09-20',
    dueDate: '2025-10-10',
    amount: 15000,
    taxAmount: 2250,
    totalAmount: 17250,
    paidAmount: 0,
    status: 'overdue',
    paymentTerms: 'Net 20',
    purchaseOrder: 'PO-2025-095',
    category: 'Maintenance',
    agingDays: 27,
    assignedTo: 'Finance Team',
  },
];

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  due_soon: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  partially_paid: 'bg-blue-100 text-blue-700',
};

const statusLabels = {
  pending: 'Pending',
  due_soon: 'Due Soon',
  overdue: 'Overdue',
  paid: 'Paid',
  partially_paid: 'Partially Paid',
};

export default function PayablesPage() {
  const router = useRouter();
  const [payables, setPayables] = useState<Payable[]>(mockPayables);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPayables = payables.filter((payable) => {
    const matchesSearch =
      payable.payableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.purchaseOrder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payable.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || payable.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPayables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayables = filteredPayables.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalPayables: payables.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0),
    dueThisWeek: payables
      .filter((p) => {
        const daysUntilDue = Math.ceil((new Date(p.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue >= 0 && p.paidAmount < p.totalAmount;
      })
      .reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0),
    overdue: payables.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0),
    paidThisMonth: payables
      .filter((p) => {
        const paymentDate = new Date(p.invoiceDate);
        const currentMonth = new Date().getMonth();
        return paymentDate.getMonth() === currentMonth && p.status === 'paid';
      })
      .reduce((sum, p) => sum + p.paidAmount, 0),
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Payables</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">${(stats.totalPayables / 1000).toFixed(0)}K</p>
              </div>
              <TrendingDown className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Paid This Month</p>
                <p className="text-2xl font-bold text-green-900 mt-1">${(stats.paidThisMonth / 1000).toFixed(0)}K</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Due This Week</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">${(stats.dueThisWeek / 1000).toFixed(0)}K</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Overdue</p>
                <p className="text-2xl font-bold text-red-900 mt-1">${(stats.overdue / 1000).toFixed(0)}K</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/finance/payables/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Add Payable</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by payable number, vendor, invoice, or PO..."
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
          <option value="paid">Paid</option>
          <option value="partially_paid">Partially Paid</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="Raw Materials">Raw Materials</option>
          <option value="Equipment">Equipment</option>
          <option value="Freight & Shipping">Freight & Shipping</option>
          <option value="Utilities">Utilities</option>
          <option value="Packaging">Packaging</option>
          <option value="Maintenance">Maintenance</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPayables.map((payable) => {
                const balance = payable.totalAmount - payable.paidAmount;
                const isOverdue = new Date(payable.dueDate) < new Date() && balance > 0;

                return (
                  <tr key={payable.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingDown className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{payable.payableNumber}</div>
                          <div className="text-xs text-gray-500">{payable.purchaseOrder}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{payable.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{payable.vendorName}</div>
                          <div className="text-sm text-gray-500">{payable.vendorId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-blue-600">{payable.invoiceNumber}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{payable.paymentTerms}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Invoice: {payable.invoiceDate}</span>
                        </div>
                        <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-blue-600'}`}>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Due: {payable.dueDate}</span>
                        </div>
                        <div className="text-xs text-gray-500">Aging: {payable.agingDays} days</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">${payable.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Base: ${payable.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Tax: ${payable.taxAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-700">${payable.paidAmount.toLocaleString()}</div>
                      {payable.paidAmount > 0 && (
                        <div className="text-xs text-gray-500">
                          {((payable.paidAmount / payable.totalAmount) * 100).toFixed(0)}% paid
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${balance > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                        ${balance.toLocaleString()}
                      </div>
                      {balance > 0 && isOverdue && (
                        <div className="text-xs text-red-600 font-semibold">Payment Overdue</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[payable.status]}`}>
                        {statusLabels[payable.status]}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        <User className="h-3 w-3 inline mr-1" />
                        {payable.assignedTo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => router.push(`/finance/payables/view/${payable.id}`)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                         
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => router.push(`/finance/payables/edit/${payable.id}`)}
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPayables.length)} of{' '}
            {filteredPayables.length} items
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
