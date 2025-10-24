'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileText,
  BarChart3
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TransactionStatus = 'draft' | 'posted' | 'reversed' | 'void';
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type JournalEntryType = 'standard' | 'adjusting' | 'closing' | 'reversing';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  subtype: string;
  currency: string;
  isActive: boolean;
  balance: number;
  openingBalance: number;
  fiscalYearStart: string;
}

export interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  costCenter?: string;
  department?: string;
  project?: string;
  reference?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  entryType: JournalEntryType;
  status: TransactionStatus;
  description: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
  createdAt: string;
  postedBy?: string;
  postedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  reversedBy?: string;
  reversedAt?: string;
  period: string;
  fiscalYear: string;
  attachments?: string[];
  notes?: string;
}

export interface TrialBalance {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debit: number;
  credit: number;
  balance: number;
}

export interface GeneralLedgerData {
  accounts: Account[];
  journalEntries: JournalEntry[];
  trialBalance: TrialBalance[];
  period: string;
  fiscalYear: string;
}

// ============================================================================
// PROPS
// ============================================================================

export interface GeneralLedgerAdvancedProps {
  data?: GeneralLedgerData;
  onCreateEntry?: (entry: Partial<JournalEntry>) => void;
  onPostEntry?: (entryId: string) => void;
  onReverseEntry?: (entryId: string) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  editable?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function GeneralLedgerAdvanced({
  data,
  onCreateEntry,
  onPostEntry,
  onReverseEntry,
  onExport,
  editable = false
}: GeneralLedgerAdvancedProps) {
  const [activeTab, setActiveTab] = useState<'entries' | 'trial-balance' | 'accounts'>('entries');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<JournalEntryType | 'all'>('all');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter entries
  const filteredEntries = data?.journalEntries.filter((entry) => {
    const matchesSearch =
      entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesType = typeFilter === 'all' || entry.entryType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700 border-gray-200',
      posted: 'bg-green-100 text-green-700 border-green-200',
      reversed: 'bg-orange-100 text-orange-700 border-orange-200',
      void: 'bg-red-100 text-red-700 border-red-200'
    };

    const icons = {
      draft: Edit,
      posted: CheckCircle,
      reversed: RefreshCw,
      void: XCircle
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.toUpperCase()}
      </span>
    );
  };

  const getTypeBadge = (type: JournalEntryType) => {
    const styles = {
      standard: 'bg-blue-100 text-blue-700',
      adjusting: 'bg-purple-100 text-purple-700',
      closing: 'bg-indigo-100 text-indigo-700',
      reversing: 'bg-pink-100 text-pink-700'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type]}`}>
        {type}
      </span>
    );
  };

  // Calculate statistics
  const totalDrafts = data?.journalEntries.filter((e) => e.status === 'draft').length || 0;
  const totalPosted = data?.journalEntries.filter((e) => e.status === 'posted').length || 0;
  const totalReversed = data?.journalEntries.filter((e) => e.status === 'reversed').length || 0;

  const totalDebitAmount = data?.journalEntries
    .filter((e) => e.status === 'posted')
    .reduce((sum, e) => sum + e.totalDebit, 0) || 0;

  const totalCreditAmount = data?.journalEntries
    .filter((e) => e.status === 'posted')
    .reduce((sum, e) => sum + e.totalCredit, 0) || 0;

  // Trial Balance calculations
  const trialBalanceSummary = {
    totalDebit: data?.trialBalance.reduce((sum, t) => sum + t.debit, 0) || 0,
    totalCredit: data?.trialBalance.reduce((sum, t) => sum + t.credit, 0) || 0,
    isBalanced: false
  };
  trialBalanceSummary.isBalanced = Math.abs(trialBalanceSummary.totalDebit - trialBalanceSummary.totalCredit) < 0.01;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            General Ledger & Journal Entries
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Period: {data?.period || 'January 2025'} | Fiscal Year: {data?.fiscalYear || 'FY 2025'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {editable && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          )}
          <button
            onClick={() => onExport?.('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Total Entries</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{data?.journalEntries.length || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Draft</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalDrafts}</p>
            </div>
            <Edit className="w-8 h-8 text-gray-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 uppercase">Posted</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{totalPosted}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 uppercase">Total Debits</p>
              <p className="text-lg font-bold text-purple-900 mt-1">{formatCurrency(totalDebitAmount)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-600 uppercase">Total Credits</p>
              <p className="text-lg font-bold text-orange-900 mt-1">{formatCurrency(totalCreditAmount)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600 opacity-80" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'entries', label: 'Journal Entries', icon: FileText },
            { id: 'trial-balance', label: 'Trial Balance', icon: BarChart3 },
            { id: 'accounts', label: 'Chart of Accounts', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Journal Entries Tab */}
      {activeTab === 'entries' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="posted">Posted</option>
                <option value="reversed">Reversed</option>
                <option value="void">Void</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="standard">Standard</option>
                <option value="adjusting">Adjusting</option>
                <option value="closing">Closing</option>
                <option value="reversing">Reversing</option>
              </select>

              <div className="text-sm text-gray-600 flex items-center">
                Showing {filteredEntries.length} of {data?.journalEntries.length || 0} entries
              </div>
            </div>
          </div>

          {/* Entries Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Entry #</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Debit</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Credit</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">{entry.entryNumber}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(entry.date)}</td>
                      <td className="px-6 py-4">{getTypeBadge(entry.entryType)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{entry.description}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                        {formatCurrency(entry.totalDebit)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-red-600">
                        {formatCurrency(entry.totalCredit)}
                      </td>
                      <td className="px-6 py-4 text-center">{getStatusBadge(entry.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedEntry(entry)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          {editable && entry.status === 'draft' && (
                            <>
                              <button
                                onClick={() => onPostEntry?.(entry.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Post Entry"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </>
                          )}
                          {editable && entry.status === 'posted' && (
                            <button
                              onClick={() => onReverseEntry?.(entry.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Reverse Entry"
                            >
                              <RefreshCw className="w-4 h-4 text-orange-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Entry Details Modal */}
          {selectedEntry && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Journal Entry Details</h3>
                    <button onClick={() => setSelectedEntry(null)} className="text-gray-400 hover:text-gray-600">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Entry Number</p>
                      <p className="text-lg font-mono text-gray-900">{selectedEntry.entryNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date</p>
                      <p className="text-lg text-gray-900">{formatDate(selectedEntry.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Type</p>
                      <div className="mt-1">{getTypeBadge(selectedEntry.entryType)}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedEntry.status)}</div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Description</p>
                    <p className="text-gray-900 mt-1">{selectedEntry.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Journal Lines</h4>
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Account</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Description</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Debit</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedEntry.lines.map((line) => (
                          <tr key={line.id}>
                            <td className="px-4 py-2">
                              <div className="text-sm">
                                <div className="font-mono text-gray-900">{line.accountCode}</div>
                                <div className="text-gray-600">{line.accountName}</div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">{line.description}</td>
                            <td className="px-4 py-2 text-right text-sm font-medium text-green-600">
                              {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                            </td>
                            <td className="px-4 py-2 text-right text-sm font-medium text-red-600">
                              {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-bold">
                          <td colSpan={2} className="px-4 py-2 text-right text-sm text-gray-700">
                            Totals:
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-green-700">
                            {formatCurrency(selectedEntry.totalDebit)}
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-red-700">
                            {formatCurrency(selectedEntry.totalCredit)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trial Balance Tab */}
      {activeTab === 'trial-balance' && (
        <div className="space-y-4">
          {/* Trial Balance Status */}
          <div
            className={`border rounded-lg p-4 ${
              trialBalanceSummary.isBalanced
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {trialBalanceSummary.isBalanced ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Trial Balance {trialBalanceSummary.isBalanced ? 'Balanced' : 'Out of Balance'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    As of {data?.period || 'January 2025'} | Fiscal Year: {data?.fiscalYear || 'FY 2025'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Variance</p>
                <p
                  className={`text-xl font-bold ${
                    trialBalanceSummary.isBalanced ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {formatCurrency(Math.abs(trialBalanceSummary.totalDebit - trialBalanceSummary.totalCredit))}
                </p>
              </div>
            </div>
          </div>

          {/* Trial Balance Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Account Code</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Account Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Debit</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Credit</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.trialBalance.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-gray-900">{item.accountCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.accountName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{item.accountType}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                        {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-red-600">
                        {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        {formatCurrency(Math.abs(item.balance))}
                        <span className="text-xs ml-1 text-gray-500">
                          {item.balance >= 0 ? 'Dr' : 'Cr'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-bold border-t-2 border-blue-600">
                    <td colSpan={3} className="px-6 py-4 text-right text-sm text-blue-900">
                      Totals:
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-green-700">
                      {formatCurrency(trialBalanceSummary.totalDebit)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-red-700">
                      {formatCurrency(trialBalanceSummary.totalCredit)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-blue-900">
                      {formatCurrency(Math.abs(trialBalanceSummary.totalDebit - trialBalanceSummary.totalCredit))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Chart of Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Subtype</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Balance</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">{account.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{account.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{account.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{account.subtype}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(account.balance)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
