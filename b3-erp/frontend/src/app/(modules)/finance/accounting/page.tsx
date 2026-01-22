'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, Download, BookOpen, Calendar, DollarSign, FileText, AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight, User, TrendingUp, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  accountCode: string;
  accountName: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  entryType: 'journal_entry' | 'adjustment' | 'closing' | 'reversal' | 'accrual';
  referenceNumber: string;
  postedBy: string;
  postedDate: string;
  status: 'draft' | 'posted' | 'reversed';
}

const mockJournalEntries: JournalEntry[] = [
  {
    id: 'JE-001',
    entryNumber: 'JE-2025-001',
    entryDate: '2025-10-01',
    accountCode: '1000',
    accountName: 'Cash - Operating Account',
    description: 'Customer payment received from Hotel Paradise Ltd',
    debitAmount: 172500,
    creditAmount: 0,
    entryType: 'journal_entry',
    referenceNumber: 'INV-2025-001',
    postedBy: 'Finance Team',
    postedDate: '2025-10-01',
    status: 'posted',
  },
  {
    id: 'JE-002',
    entryNumber: 'JE-2025-002',
    entryDate: '2025-10-01',
    accountCode: '4000',
    accountName: 'Revenue - Product Sales',
    description: 'Revenue recognition for Hotel Paradise Ltd',
    debitAmount: 0,
    creditAmount: 172500,
    entryType: 'journal_entry',
    referenceNumber: 'INV-2025-001',
    postedBy: 'Finance Team',
    postedDate: '2025-10-01',
    status: 'posted',
  },
  {
    id: 'JE-003',
    entryNumber: 'JE-2025-003',
    entryDate: '2025-10-08',
    accountCode: '5000',
    accountName: 'COGS - Raw Materials',
    description: 'Cost of goods sold for October production',
    debitAmount: 125000,
    creditAmount: 0,
    entryType: 'journal_entry',
    referenceNumber: 'PO-2025-101',
    postedBy: 'John Accountant',
    postedDate: '2025-10-08',
    status: 'posted',
  },
  {
    id: 'JE-004',
    entryNumber: 'JE-2025-004',
    entryDate: '2025-10-08',
    accountCode: '1200',
    accountName: 'Inventory - Raw Materials',
    description: 'Inventory reduction for production consumption',
    debitAmount: 0,
    creditAmount: 125000,
    entryType: 'journal_entry',
    referenceNumber: 'PO-2025-101',
    postedBy: 'John Accountant',
    postedDate: '2025-10-08',
    status: 'posted',
  },
  {
    id: 'JE-005',
    entryNumber: 'JE-2025-005',
    entryDate: '2025-10-15',
    accountCode: '5100',
    accountName: 'Depreciation Expense',
    description: 'Monthly depreciation adjustment for equipment',
    debitAmount: 12500,
    creditAmount: 0,
    entryType: 'adjustment',
    referenceNumber: 'ADJ-2025-10',
    postedBy: 'Sarah Finance',
    postedDate: '2025-10-15',
    status: 'posted',
  },
  {
    id: 'JE-006',
    entryNumber: 'JE-2025-006',
    entryDate: '2025-10-15',
    accountCode: '1500',
    accountName: 'Accumulated Depreciation',
    description: 'Accumulated depreciation contra account',
    debitAmount: 0,
    creditAmount: 12500,
    entryType: 'adjustment',
    referenceNumber: 'ADJ-2025-10',
    postedBy: 'Sarah Finance',
    postedDate: '2025-10-15',
    status: 'posted',
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  posted: 'bg-green-100 text-green-700',
  reversed: 'bg-red-100 text-red-700',
};

const statusLabels = {
  draft: 'Draft',
  posted: 'Posted',
  reversed: 'Reversed',
};

const entryTypeColors = {
  journal_entry: 'bg-blue-100 text-blue-700',
  adjustment: 'bg-purple-100 text-purple-700',
  closing: 'bg-orange-100 text-orange-700',
  reversal: 'bg-red-100 text-red-700',
  accrual: 'bg-yellow-100 text-yellow-700',
};

const entryTypeLabels = {
  journal_entry: 'Journal Entry',
  adjustment: 'Adjustment',
  closing: 'Closing Entry',
  reversal: 'Reversal',
  accrual: 'Accrual',
};

export default function AccountingPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.accountCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || entry.entryType === typeFilter;
    const matchesAccount = accountFilter === 'all' || entry.accountCode.startsWith(accountFilter);
    return matchesSearch && matchesType && matchesAccount;
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalEntries: entries.length,
    thisMonth: entries.filter((e) => {
      const entryMonth = new Date(e.entryDate).getMonth();
      const currentMonth = new Date().getMonth();
      return entryMonth === currentMonth;
    }).length,
    totalCredits: entries.reduce((sum, e) => sum + e.creditAmount, 0),
    totalDebits: entries.reduce((sum, e) => sum + e.debitAmount, 0),
  };

  const balance = stats.totalDebits - stats.totalCredits;

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Stats */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Entries</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalEntries}</p>
                <p className="text-xs text-blue-600 mt-1">This Month: {stats.thisMonth}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Credits</p>
                <p className="text-2xl font-bold text-green-900 mt-1">${(stats.totalCredits / 1000).toFixed(0)}K</p>
              </div>
              <ArrowDownCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Total Debits</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">${(stats.totalDebits / 1000).toFixed(0)}K</p>
              </div>
              <ArrowUpCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Balance</p>
                <p className={`text-2xl font-bold mt-1 ${balance === 0 ? 'text-green-900' : 'text-purple-900'}`}>
                  ${Math.abs(balance).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 mt-1">{balance === 0 ? 'Balanced' : balance > 0 ? 'Debit' : 'Credit'}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/finance/accounting/add')}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-fit flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by entry number, account, description, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="journal_entry">Journal Entry</option>
          <option value="adjustment">Adjustment</option>
          <option value="closing">Closing Entry</option>
          <option value="reversal">Reversal</option>
          <option value="accrual">Accrual</option>
        </select>
        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Accounts</option>
          <option value="1">1000 - Assets</option>
          <option value="2">2000 - Liabilities</option>
          <option value="3">3000 - Equity</option>
          <option value="4">4000 - Revenue</option>
          <option value="5">5000 - Expenses</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEntries.map((entry) => {
                const isDebit = entry.debitAmount > 0;

                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className={`h-10 w-10 bg-gradient-to-br ${isDebit ? 'from-yellow-500 to-orange-600' : 'from-green-500 to-emerald-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {isDebit ? (
                            <ArrowUpCircle className="h-5 w-5 text-white" />
                          ) : (
                            <ArrowDownCircle className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{entry.entryNumber}</div>
                          <div className="text-xs text-gray-500">{entry.referenceNumber}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Posted by {entry.postedBy}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {entry.entryDate}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Posted: {entry.postedDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono font-semibold text-blue-600">{entry.accountCode}</div>
                      <div className="text-sm text-gray-700 font-medium">{entry.accountName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">{entry.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      {entry.debitAmount > 0 ? (
                        <div className="font-bold text-orange-700">${entry.debitAmount.toLocaleString()}</div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {entry.creditAmount > 0 ? (
                        <div className="font-bold text-green-700">${entry.creditAmount.toLocaleString()}</div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${entryTypeColors[entry.entryType]}`}>
                        {entryTypeLabels[entry.entryType]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[entry.status]}`}>
                        {statusLabels[entry.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => router.push(`/finance/accounting/view/${entry.id}`)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"

                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        {entry.status === 'draft' && (
                          <button
                            onClick={() => router.push(`/finance/accounting/edit/${entry.id}`)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"

                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEntries.length)} of{' '}
            {filteredEntries.length} items
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
  );
}
