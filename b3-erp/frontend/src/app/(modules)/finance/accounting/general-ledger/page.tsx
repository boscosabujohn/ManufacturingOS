'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  FileText
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  voucherNumber: string;
  voucherType: 'Journal Entry' | 'Invoice' | 'Payment' | 'Receipt' | 'Adjustment';
  description: string;
  debit: number;
  credit: number;
  balance: number;
  costCenter?: string;
  department?: string;
  project?: string;
  reconciled: boolean;
}

interface AccountLedger {
  accountCode: string;
  accountName: string;
  accountType: string;
  openingBalance: number;
  entries: LedgerEntry[];
  closingBalance: number;
}

export default function GeneralLedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState('1110');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [searchTerm, setSearchTerm] = useState('');
  const [voucherTypeFilter, setVoucherTypeFilter] = useState('all');
  const [showReconciled, setShowReconciled] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // Sample general ledger data
  const ledgerData: AccountLedger = {
    accountCode: '1110',
    accountName: 'Cash & Bank',
    accountType: 'Asset',
    openingBalance: 14500000,
    closingBalance: 15750000,
    entries: [
      {
        id: 'GL001',
        date: '2025-01-02',
        voucherNumber: 'PMT-2025-001',
        voucherType: 'Payment',
        description: 'Payment to ABC Suppliers for Invoice INV-2024-125',
        debit: 0,
        credit: 250000,
        balance: 14250000,
        costCenter: 'CC-OPS-001',
        department: 'Operations',
        reconciled: true
      },
      {
        id: 'GL002',
        date: '2025-01-05',
        voucherNumber: 'RCP-2025-001',
        voucherType: 'Receipt',
        description: 'Receipt from XYZ Corp for Invoice INV-2025-001',
        debit: 500000,
        credit: 0,
        balance: 14750000,
        costCenter: 'CC-SAL-001',
        department: 'Sales',
        reconciled: true
      },
      {
        id: 'GL003',
        date: '2025-01-08',
        voucherNumber: 'JE-2025-005',
        voucherType: 'Journal Entry',
        description: 'Bank charges for December 2024',
        debit: 0,
        credit: 1500,
        balance: 14748500,
        costCenter: 'CC-FIN-001',
        department: 'Finance',
        reconciled: false
      },
      {
        id: 'GL004',
        date: '2025-01-10',
        voucherNumber: 'RCP-2025-002',
        voucherType: 'Receipt',
        description: 'Receipt from DEF Industries for Invoice INV-2025-003',
        debit: 750000,
        credit: 0,
        balance: 15498500,
        costCenter: 'CC-SAL-001',
        department: 'Sales',
        project: 'PRJ-2025-01',
        reconciled: true
      },
      {
        id: 'GL005',
        date: '2025-01-12',
        voucherNumber: 'PMT-2025-003',
        voucherType: 'Payment',
        description: 'Salary payment for January 2025',
        debit: 0,
        credit: 2000000,
        balance: 13498500,
        costCenter: 'CC-HR-001',
        department: 'Human Resources',
        reconciled: true
      },
      {
        id: 'GL006',
        date: '2025-01-15',
        voucherNumber: 'RCP-2025-003',
        voucherType: 'Receipt',
        description: 'Receipt from GHI Enterprises for Invoice INV-2025-005',
        debit: 300000,
        credit: 0,
        balance: 13798500,
        costCenter: 'CC-SAL-001',
        department: 'Sales',
        reconciled: false
      },
      {
        id: 'GL007',
        date: '2025-01-18',
        voucherNumber: 'PMT-2025-005',
        voucherType: 'Payment',
        description: 'Payment to JKL Contractors for services',
        debit: 0,
        credit: 450000,
        balance: 13348500,
        costCenter: 'CC-OPS-001',
        department: 'Operations',
        reconciled: true
      },
      {
        id: 'GL008',
        date: '2025-01-20',
        voucherNumber: 'RCP-2025-004',
        voucherType: 'Receipt',
        description: 'Receipt from MNO Corporation',
        debit: 1200000,
        credit: 0,
        balance: 14548500,
        costCenter: 'CC-SAL-001',
        department: 'Sales',
        reconciled: true
      },
      {
        id: 'GL009',
        date: '2025-01-22',
        voucherNumber: 'JE-2025-012',
        voucherType: 'Journal Entry',
        description: 'Interest income credited by bank',
        debit: 25000,
        credit: 0,
        balance: 14573500,
        costCenter: 'CC-FIN-001',
        department: 'Finance',
        reconciled: false
      },
      {
        id: 'GL010',
        date: '2025-01-25',
        voucherNumber: 'RCP-2025-005',
        voucherType: 'Receipt',
        description: 'Receipt from PQR Industries for Invoice INV-2025-008',
        debit: 850000,
        credit: 0,
        balance: 15423500,
        costCenter: 'CC-SAL-001',
        department: 'Sales',
        reconciled: true
      },
      {
        id: 'GL011',
        date: '2025-01-28',
        voucherNumber: 'PMT-2025-008',
        voucherType: 'Payment',
        description: 'Payment for office rent - January 2025',
        debit: 0,
        credit: 150000,
        balance: 15273500,
        reconciled: true
      },
      {
        id: 'GL012',
        date: '2025-01-30',
        voucherNumber: 'RCP-2025-006',
        voucherType: 'Receipt',
        description: 'Receipt from STU Enterprises',
        debit: 500000,
        credit: 0,
        balance: 15773500,
        costCenter: 'CC-SAL-001',
        department: 'Sales',
        reconciled: false
      },
      {
        id: 'GL013',
        date: '2025-01-31',
        voucherNumber: 'JE-2025-018',
        voucherType: 'Adjustment',
        description: 'Bank reconciliation adjustment',
        debit: 0,
        credit: 23500,
        balance: 15750000,
        costCenter: 'CC-FIN-001',
        department: 'Finance',
        reconciled: false
      }
    ]
  };

  const filteredEntries = ledgerData.entries.filter(entry => {
    const matchesSearch =
      entry.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVoucherType = voucherTypeFilter === 'all' || entry.voucherType === voucherTypeFilter;
    const matchesReconciled = showReconciled || !entry.reconciled;

    return matchesSearch && matchesVoucherType && matchesReconciled;
  });

  // Calculate statistics
  const totalDebit = ledgerData.entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = ledgerData.entries.reduce((sum, e) => sum + e.credit, 0);
  const netMovement = totalDebit - totalCredit;
  const reconciledCount = ledgerData.entries.filter(e => e.reconciled).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getVoucherTypeBadge = (type: string) => {
    const colors = {
      'Journal Entry': 'bg-purple-500/20 text-purple-400',
      'Invoice': 'bg-green-500/20 text-green-400',
      'Payment': 'bg-red-500/20 text-red-400',
      'Receipt': 'bg-blue-500/20 text-blue-400',
      'Adjustment': 'bg-orange-500/20 text-orange-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">General Ledger</h1>
            <p className="text-gray-400">Detailed transaction history for all accounts</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              Print Ledger
            </button>
          </div>
        </div>

        {/* Account Selection */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">{ledgerData.accountName}</h2>
                  <p className="text-indigo-100 text-sm">Account Code: {ledgerData.accountCode} | Type: {ledgerData.accountType}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Period</div>
              <div className="text-xl font-bold">
                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(ledgerData.openingBalance)}</div>
            <div className="text-blue-100 text-sm">Opening Balance</div>
            <div className="mt-2 text-xs text-blue-100">As on {new Date(startDate).toLocaleDateString()}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalDebit)}</div>
            <div className="text-green-100 text-sm">Total Debits</div>
            <div className="mt-2 text-xs text-green-100">{ledgerData.entries.filter(e => e.debit > 0).length} transactions</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <TrendingDown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalCredit)}</div>
            <div className="text-red-100 text-sm">Total Credits</div>
            <div className="mt-2 text-xs text-red-100">{ledgerData.entries.filter(e => e.credit > 0).length} transactions</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              {netMovement >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(Math.abs(netMovement))}</div>
            <div className="text-purple-100 text-sm">Net Movement</div>
            <div className="mt-2 text-xs text-purple-100">{netMovement >= 0 ? 'Increase' : 'Decrease'}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(ledgerData.closingBalance)}</div>
            <div className="text-orange-100 text-sm">Closing Balance</div>
            <div className="mt-2 text-xs text-orange-100">As on {new Date(endDate).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1110">1110 - Cash & Bank</option>
                <option value="1120">1120 - Accounts Receivable</option>
                <option value="2110">2110 - Accounts Payable</option>
                <option value="4100">4100 - Sales Revenue</option>
                <option value="5110">5110 - Raw Materials</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Voucher Type</label>
              <select
                value={voucherTypeFilter}
                onChange={(e) => setVoucherTypeFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Journal Entry">Journal Entry</option>
                <option value="Invoice">Invoice</option>
                <option value="Payment">Payment</option>
                <option value="Receipt">Receipt</option>
                <option value="Adjustment">Adjustment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showReconciled}
                onChange={(e) => setShowReconciled(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              Show Reconciled
            </label>
            <div className="text-gray-400 text-sm ml-auto">
              Showing {filteredEntries.length} of {ledgerData.entries.length} entries
            </div>
          </div>
        </div>

        {/* Ledger Entries Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Voucher</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Debit</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Credit</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Balance</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Opening Balance Row */}
                <tr className="bg-blue-900/20 border-b-2 border-blue-600">
                  <td className="px-6 py-3 text-blue-400 font-medium">{new Date(startDate).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-blue-400 font-medium" colSpan={2}>Opening Balance</td>
                  <td className="px-6 py-3 text-right text-gray-400">-</td>
                  <td className="px-6 py-3 text-right text-gray-400">-</td>
                  <td className="px-6 py-3 text-right text-blue-400 font-bold">{formatCurrency(ledgerData.openingBalance)}</td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3"></td>
                </tr>

                {/* Transaction Rows */}
                {filteredEntries.map((entry, index) => (
                  <React.Fragment key={entry.id}>
                    <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-white text-sm">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-mono text-sm">{entry.voucherNumber}</div>
                          <div className="mt-1">{getVoucherTypeBadge(entry.voucherType)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{entry.description}</div>
                        {(entry.costCenter || entry.department || entry.project) && (
                          <div className="flex items-center gap-2 mt-1">
                            {entry.department && (
                              <span className="text-xs text-gray-400">{entry.department}</span>
                            )}
                            {entry.costCenter && (
                              <span className="text-xs text-gray-500">• {entry.costCenter}</span>
                            )}
                            {entry.project && (
                              <span className="text-xs text-gray-500">• {entry.project}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-medium ${entry.debit > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-medium ${entry.credit > 0 ? 'text-red-400' : 'text-gray-600'}`}>
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        {formatCurrency(entry.balance)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {entry.reconciled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Reconciled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="View Details"
                          >
                            {expandedEntry === entry.id ? (
                              <ChevronDown className="w-4 h-4 text-blue-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-blue-400" />
                            )}
                          </button>
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="View Voucher">
                            <Eye className="w-4 h-4 text-purple-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedEntry === entry.id && (
                      <tr className="bg-gray-900/50 border-b border-gray-700">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Voucher Number:</span>
                              <span className="text-white ml-2 font-mono">{entry.voucherNumber}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Voucher Type:</span>
                              <span className="text-white ml-2">{entry.voucherType}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Date:</span>
                              <span className="text-white ml-2">{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                            {entry.costCenter && (
                              <div>
                                <span className="text-gray-400">Cost Center:</span>
                                <span className="text-white ml-2">{entry.costCenter}</span>
                              </div>
                            )}
                            {entry.department && (
                              <div>
                                <span className="text-gray-400">Department:</span>
                                <span className="text-white ml-2">{entry.department}</span>
                              </div>
                            )}
                            {entry.project && (
                              <div>
                                <span className="text-gray-400">Project:</span>
                                <span className="text-white ml-2">{entry.project}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {/* Closing Balance Row */}
                <tr className="bg-orange-900/20 border-t-2 border-orange-600">
                  <td className="px-6 py-4 text-orange-400 font-medium">{new Date(endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-orange-400 font-medium" colSpan={2}>Closing Balance</td>
                  <td className="px-6 py-4 text-right text-green-400 font-bold">{formatCurrency(totalDebit)}</td>
                  <td className="px-6 py-4 text-right text-red-400 font-bold">{formatCurrency(totalCredit)}</td>
                  <td className="px-6 py-4 text-right text-orange-400 font-bold text-lg">{formatCurrency(ledgerData.closingBalance)}</td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Ledger Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Entries:</span>
                <span className="text-white font-medium">{ledgerData.entries.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Reconciled:</span>
                <span className="text-green-400 font-medium">{reconciledCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Pending:</span>
                <span className="text-orange-400 font-medium">{ledgerData.entries.length - reconciledCount}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Opening Balance:</span>
                <span className="text-white font-medium">{formatCurrency(ledgerData.openingBalance)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Net Movement:</span>
                <span className={`font-medium ${netMovement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {netMovement >= 0 ? '+' : ''}{formatCurrency(netMovement)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                <span className="text-white font-semibold">Closing Balance:</span>
                <span className="text-white font-bold">{formatCurrency(ledgerData.closingBalance)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
