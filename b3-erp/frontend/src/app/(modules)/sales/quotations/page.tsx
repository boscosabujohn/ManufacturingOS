'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, FileText, Calendar, DollarSign, TrendingUp, Send, CheckCircle, Clock, Download, ChevronLeft, ChevronRight, User, Percent } from 'lucide-react';

interface Quotation {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerId: string;
  quoteDate: string;
  validityDate: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  totalAmount: number;
  items: number;
  assignedTo: string;
  discount: number;
  notes: string;
  convertedToOrder: string | null;
}

const mockQuotations: Quotation[] = [
  {
    id: 'QT-001',
    quoteNumber: 'QT-2025-001',
    customerName: 'Hotel Paradise Ltd',
    customerId: 'CUST-001',
    quoteDate: '2025-09-15',
    validityDate: '2025-10-15',
    status: 'converted',
    totalAmount: 150000,
    items: 12,
    assignedTo: 'John Anderson',
    discount: 5,
    notes: 'Premium kitchen setup',
    convertedToOrder: 'SO-2025-001',
  },
  {
    id: 'QT-002',
    quoteNumber: 'QT-2025-002',
    customerName: 'Culinary Delights Inc',
    customerId: 'CUST-002',
    quoteDate: '2025-09-20',
    validityDate: '2025-10-20',
    status: 'sent',
    totalAmount: 102000,
    items: 8,
    assignedTo: 'Sarah Johnson',
    discount: 3,
    notes: 'Commercial restaurant equipment',
    convertedToOrder: null,
  },
  {
    id: 'QT-003',
    quoteNumber: 'QT-2025-003',
    customerName: 'City General Hospital',
    customerId: 'CUST-003',
    quoteDate: '2025-09-25',
    validityDate: '2025-10-25',
    status: 'accepted',
    totalAmount: 240000,
    items: 15,
    assignedTo: 'Michael Chen',
    discount: 8,
    notes: 'Hospital cafeteria renovation',
    convertedToOrder: 'SO-2025-003',
  },
  {
    id: 'QT-004',
    quoteNumber: 'QT-2025-004',
    customerName: 'Tech Startup Inc',
    customerId: 'CUST-007',
    quoteDate: '2025-10-01',
    validityDate: '2025-11-01',
    status: 'sent',
    totalAmount: 85000,
    items: 7,
    assignedTo: 'Emily Davis',
    discount: 0,
    notes: 'Office pantry setup',
    convertedToOrder: null,
  },
  {
    id: 'QT-005',
    quoteNumber: 'QT-2025-005',
    customerName: 'Budget Cafe Chain',
    customerId: 'CUST-008',
    quoteDate: '2025-10-08',
    validityDate: '2025-11-08',
    status: 'rejected',
    totalAmount: 45000,
    items: 5,
    assignedTo: 'Robert Wilson',
    discount: 10,
    notes: 'Budget constraints cited',
    convertedToOrder: null,
  },
  {
    id: 'QT-006',
    quoteNumber: 'QT-2025-006',
    customerName: 'Luxury Resort Group',
    customerId: 'CUST-009',
    quoteDate: '2025-10-12',
    validityDate: '2025-11-12',
    status: 'draft',
    totalAmount: 320000,
    items: 25,
    assignedTo: 'Lisa Martinez',
    discount: 7,
    notes: 'Multiple location rollout',
    convertedToOrder: null,
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  expired: 'bg-orange-100 text-orange-700',
  converted: 'bg-purple-100 text-purple-700',
};

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  rejected: 'Rejected',
  expired: 'Expired',
  converted: 'Converted',
};

export default function QuotationsPage() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredQuotations = quotations.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalQuotes: quotations.length,
    sent: quotations.filter((q) => q.status === 'sent').length,
    accepted: quotations.filter((q) => q.status === 'accepted').length,
    conversionRate: quotations.length > 0
      ? Math.round((quotations.filter((q) => q.status === 'converted' || q.status === 'accepted').length / quotations.length) * 100)
      : 0,
  };

  const handleExport = () => {
    console.log('Exporting quotations data...');
  };

  const handleSendQuote = (id: string) => {
    console.log(`Sending quotation ${id}...`);
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Quotes</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalQuotes}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Sent</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Accepted</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/sales/quotations/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create Quote</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by quote number, customer name, or ID..."
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
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
          <option value="converted">Converted</option>
        </select>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quotation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedQuotations.map((quote) => {
                const isExpired = new Date(quote.validityDate) < new Date() && quote.status === 'sent';

                return (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{quote.quoteNumber}</div>
                          <div className="text-xs text-gray-500">{quote.items} items</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{quote.customerName}</div>
                      <div className="text-sm text-gray-500">{quote.customerId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Quote: {quote.quoteDate}</span>
                        </div>
                        <div className={`flex items-center text-xs ${isExpired ? 'text-red-600 font-semibold' : 'text-blue-600'}`}>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Valid: {quote.validityDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">${quote.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{quote.notes}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Percent className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold text-orange-700">{quote.discount}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[quote.status]}`}>
                        {statusLabels[quote.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{quote.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {quote.convertedToOrder ? (
                        <div className="text-xs font-medium text-green-600">{quote.convertedToOrder}</div>
                      ) : (
                        <div className="text-xs text-gray-400">-</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => router.push(`/sales/quotations/view/${quote.id}`)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                         
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => router.push(`/sales/quotations/edit/${quote.id}`)}
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredQuotations.length)} of{' '}
            {filteredQuotations.length} items
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
