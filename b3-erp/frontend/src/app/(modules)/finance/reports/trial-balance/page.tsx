'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TrialBalanceAccount {
  accountCode: string;
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  debit: number;
  credit: number;
  openingBalance: number;
  closingBalance: number;
}

export default function TrialBalancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showZeroBalances, setShowZeroBalances] = useState(false);

  // Sample trial balance data
  const trialBalanceAccounts: TrialBalanceAccount[] = [
    // Assets
    { accountCode: '1110', accountName: 'Cash & Bank', accountType: 'Asset', debit: 15750000, credit: 0, openingBalance: 14500000, closingBalance: 15750000 },
    { accountCode: '1120', accountName: 'Accounts Receivable', accountType: 'Asset', debit: 12500000, credit: 0, openingBalance: 11000000, closingBalance: 12500000 },
    { accountCode: '1130', accountName: 'Inventory', accountType: 'Asset', debit: 6750000, credit: 0, openingBalance: 6000000, closingBalance: 6750000 },
    { accountCode: '1210', accountName: 'Land & Buildings', accountType: 'Asset', debit: 25000000, credit: 0, openingBalance: 25000000, closingBalance: 25000000 },
    { accountCode: '1220', accountName: 'Plant & Machinery', accountType: 'Asset', debit: 15000000, credit: 0, openingBalance: 16000000, closingBalance: 15000000 },
    { accountCode: '1230', accountName: 'Furniture & Fixtures', accountType: 'Asset', debit: 2500000, credit: 0, openingBalance: 2700000, closingBalance: 2500000 },
    { accountCode: '1240', accountName: 'Vehicles', accountType: 'Asset', debit: 3000000, credit: 0, openingBalance: 3500000, closingBalance: 3000000 },
    // Liabilities
    { accountCode: '2110', accountName: 'Accounts Payable', accountType: 'Liability', debit: 0, credit: 8500000, openingBalance: 9000000, closingBalance: 8500000 },
    { accountCode: '2120', accountName: 'GST Payable', accountType: 'Liability', debit: 0, credit: 2500000, openingBalance: 2200000, closingBalance: 2500000 },
    { accountCode: '2130', accountName: 'TDS Payable', accountType: 'Liability', debit: 0, credit: 1500000, openingBalance: 1300000, closingBalance: 1500000 },
    { accountCode: '2210', accountName: 'Term Loans', accountType: 'Liability', debit: 0, credit: 17500000, openingBalance: 18000000, closingBalance: 17500000 },
    // Equity
    { accountCode: '3100', accountName: 'Share Capital', accountType: 'Equity', debit: 0, credit: 20000000, openingBalance: 20000000, closingBalance: 20000000 },
    { accountCode: '3200', accountName: 'Retained Earnings', accountType: 'Equity', debit: 0, credit: 5000000, openingBalance: 4000000, closingBalance: 5000000 },
    // Revenue
    { accountCode: '4100', accountName: 'Sales Revenue', accountType: 'Revenue', debit: 0, credit: 42000000, openingBalance: 0, closingBalance: 42000000 },
    { accountCode: '4200', accountName: 'Other Income', accountType: 'Revenue', debit: 0, credit: 3000000, openingBalance: 0, closingBalance: 3000000 },
    // Expenses
    { accountCode: '5110', accountName: 'Raw Materials', accountType: 'Expense', debit: 15000000, credit: 0, openingBalance: 0, closingBalance: 15000000 },
    { accountCode: '5120', accountName: 'Direct Labor', accountType: 'Expense', debit: 10000000, credit: 0, openingBalance: 0, closingBalance: 10000000 },
    { accountCode: '5210', accountName: 'Salaries & Wages', accountType: 'Expense', debit: 6000000, credit: 0, openingBalance: 0, closingBalance: 6000000 },
    { accountCode: '5220', accountName: 'Rent & Utilities', accountType: 'Expense', debit: 2000000, credit: 0, openingBalance: 0, closingBalance: 2000000 },
    { accountCode: '5230', accountName: 'Marketing Expenses', accountType: 'Expense', debit: 1500000, credit: 0, openingBalance: 0, closingBalance: 1500000 },
    { accountCode: '5240', accountName: 'Depreciation', accountType: 'Expense', debit: 1500000, credit: 0, openingBalance: 0, closingBalance: 1500000 },
    { accountCode: '5250', accountName: 'Interest Expense', accountType: 'Expense', debit: 750000, credit: 0, openingBalance: 0, closingBalance: 750000 },
    { accountCode: '5260', accountName: 'Professional Fees', accountType: 'Expense', debit: 500000, credit: 0, openingBalance: 0, closingBalance: 500000 }
  ];

  const filteredAccounts = trialBalanceAccounts.filter(account => {
    const matchesSearch =
      account.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || account.accountType === typeFilter;
    const matchesZeroBalance = showZeroBalances || (account.debit !== 0 || account.credit !== 0);

    return matchesSearch && matchesType && matchesZeroBalance;
  });

  // Calculate totals
  const totalDebit = filteredAccounts.reduce((sum, acc) => sum + acc.debit, 0);
  const totalCredit = filteredAccounts.reduce((sum, acc) => sum + acc.credit, 0);
  const difference = totalDebit - totalCredit;
  const isBalanced = Math.abs(difference) < 1; // Allow for rounding errors

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      Asset: 'bg-blue-500/20 text-blue-400',
      Liability: 'bg-red-500/20 text-red-400',
      Equity: 'bg-purple-500/20 text-purple-400',
      Revenue: 'bg-green-500/20 text-green-400',
      Expense: 'bg-orange-500/20 text-orange-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Trial Balance</h1>
            <p className="text-gray-400">Verify the mathematical accuracy of the general ledger</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Balance Status Card */}
        <div className={`bg-gradient-to-br ${
          isBalanced ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
        } rounded-xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isBalanced ? (
                <CheckCircle className="w-12 h-12" />
              ) : (
                <AlertCircle className="w-12 h-12" />
              )}
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {isBalanced ? 'Books are Balanced' : 'Books are Out of Balance'}
                </h2>
                <p className="text-white/90">
                  {isBalanced
                    ? 'Total debits equal total credits. The books are in balance.'
                    : `Difference of ${formatCurrency(Math.abs(difference))} detected.`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Difference</div>
              <div className="text-3xl font-bold">{formatCurrency(Math.abs(difference))}</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalDebit)}</div>
            <div className="text-blue-100 text-sm">Total Debits</div>
            <div className="mt-2 text-xs text-blue-100">{filteredAccounts.filter(a => a.debit > 0).length} accounts</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(totalCredit)}</div>
            <div className="text-red-100 text-sm">Total Credits</div>
            <div className="mt-2 text-xs text-red-100">{filteredAccounts.filter(a => a.credit > 0).length} accounts</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{filteredAccounts.length}</div>
            <div className="text-purple-100 text-sm">Total Accounts</div>
            <div className="mt-2 text-xs text-purple-100">With non-zero balances</div>
          </div>

          <div className={`bg-gradient-to-br ${
            isBalanced ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'
          } rounded-xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              {isBalanced ? <CheckCircle className="w-8 h-8 opacity-80" /> : <AlertCircle className="w-8 h-8 opacity-80" />}
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">{isBalanced ? '0.00%' : ((difference / totalDebit) * 100).toFixed(2) + '%'}</div>
            <div className={`${isBalanced ? 'text-green-100' : 'text-orange-100'} text-sm`}>
              {isBalanced ? 'Variance' : 'Imbalance'}
            </div>
            <div className={`mt-2 text-xs ${isBalanced ? 'text-green-100' : 'text-orange-100'}`}>
              {isBalanced ? 'Perfect balance' : 'Needs adjustment'}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2025-01">January 2025</option>
                <option value="2024-12">December 2024</option>
                <option value="2024-11">November 2024</option>
                <option value="2024-Q4">Q4 2024</option>
                <option value="2024">FY 2024</option>
              </select>
            </div>

            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by account name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="Asset">Assets</option>
                <option value="Liability">Liabilities</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expenses</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showZeroBalances}
                onChange={(e) => setShowZeroBalances(e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
              />
              Show Zero Balances
            </label>
          </div>
        </div>

        {/* Trial Balance Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Account Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Account Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Opening Balance</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Debit</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Credit</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account, index) => (
                  <tr key={account.accountCode} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-white font-mono text-sm">{account.accountCode}</td>
                    <td className="px-6 py-4 text-white">{account.accountName}</td>
                    <td className="px-6 py-4">
                      {getTypeBadge(account.accountType)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-300 font-medium">
                      {formatCurrency(account.openingBalance)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${account.debit > 0 ? 'text-blue-400' : 'text-gray-600'}`}>
                        {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${account.credit > 0 ? 'text-red-400' : 'text-gray-600'}`}>
                        {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-medium">
                      {formatCurrency(account.closingBalance)}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-t-2 border-indigo-600">
                  <td className="px-6 py-4 font-bold text-white text-lg" colSpan={4}>
                    Total
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-blue-400 text-lg">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-red-400 text-lg">
                    {formatCurrency(totalCredit)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isBalanced ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                        <CheckCircle className="w-4 h-4" />
                        Balanced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
                        <AlertCircle className="w-4 h-4" />
                        {formatCurrency(Math.abs(difference))}
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Trial Balance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Period:</span>
                <span className="text-white font-medium">{selectedPeriod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Accounts:</span>
                <span className="text-white font-medium">{filteredAccounts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Debit Accounts:</span>
                <span className="text-blue-400 font-medium">{filteredAccounts.filter(a => a.debit > 0).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Credit Accounts:</span>
                <span className="text-red-400 font-medium">{filteredAccounts.filter(a => a.credit > 0).length}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Debits:</span>
                <span className="text-blue-400 font-medium">{formatCurrency(totalDebit)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Credits:</span>
                <span className="text-red-400 font-medium">{formatCurrency(totalCredit)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                <span className="text-white font-semibold">Balance Status:</span>
                {isBalanced ? (
                  <span className="flex items-center gap-1 text-green-400 font-bold">
                    <CheckCircle className="w-4 h-4" />
                    Balanced
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    Out of Balance
                  </span>
                )}
              </div>
              {!isBalanced && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Difference:</span>
                  <span className="text-red-400 font-bold">{formatCurrency(Math.abs(difference))}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
