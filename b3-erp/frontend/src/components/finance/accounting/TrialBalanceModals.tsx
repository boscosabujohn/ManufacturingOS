'use client';

import React, { useState } from 'react';
import { X, FileText, TrendingUp, Calendar, Filter, Download, Eye, BarChart3, ArrowUpDown } from 'lucide-react';

// ============================================================================
// 1. VIEW TRIAL BALANCE DETAILS MODAL (Blue Gradient)
// ============================================================================
interface ViewTrialBalanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountCode?: string;
}

export function ViewTrialBalanceDetailsModal({ isOpen, onClose, accountCode }: ViewTrialBalanceDetailsModalProps) {
  if (!isOpen) return null;

  const accountDetails = {
    code: accountCode || '1001',
    name: 'Cash in Hand',
    type: 'Asset',
    openingBalance: 125000.00,
    debit: 485000.00,
    credit: 325000.00,
    closingBalance: 285000.00,
    transactionCount: 45,
    lastTransaction: '2025-01-31'
  };

  const recentTransactions = [
    { date: '2025-01-31', voucher: 'JE-2025-0234', description: 'Cash received from customer', debit: 15000, credit: 0 },
    { date: '2025-01-30', voucher: 'JE-2025-0228', description: 'Cash payment for supplies', debit: 0, credit: 8500 },
    { date: '2025-01-28', voucher: 'JE-2025-0215', description: 'Cash sales', debit: 25000, credit: 0 },
    { date: '2025-01-25', voucher: 'JE-2025-0198', description: 'Petty cash expense', debit: 0, credit: 2500 },
    { date: '2025-01-20', voucher: 'JE-2025-0175', description: 'Cash deposit to bank', debit: 0, credit: 50000 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Account Details</h2>
              <p className="text-white/80 text-sm">{accountDetails.code} - {accountDetails.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Opening Balance</div>
              <div className="text-xl font-bold text-blue-900">₹{accountDetails.openingBalance.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 mb-1">Total Debits</div>
              <div className="text-xl font-bold text-green-900">₹{accountDetails.debit.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 mb-1">Total Credits</div>
              <div className="text-xl font-bold text-red-900">₹{accountDetails.credit.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Closing Balance</div>
              <div className="text-xl font-bold text-purple-900">₹{accountDetails.closingBalance.toLocaleString()}</div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Account Type</label>
                <p className="text-gray-900">{accountDetails.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Transaction Count</label>
                <p className="text-gray-900">{accountDetails.transactionCount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Transaction</label>
                <p className="text-gray-900">{accountDetails.lastTransaction}</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Voucher</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Debit</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((txn, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{txn.date}</td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-900">{txn.voucher}</td>
                      <td className="px-4 py-3 text-gray-700">{txn.description}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {txn.debit > 0 ? `₹${txn.debit.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {txn.credit > 0 ? `₹${txn.credit.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All {accountDetails.transactionCount} Transactions →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View in General Ledger
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. TRIAL BALANCE PERIOD COMPARISON MODAL (Purple Gradient)
// ============================================================================
interface TrialBalancePeriodComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrialBalancePeriodComparisonModal({ isOpen, onClose }: TrialBalancePeriodComparisonModalProps) {
  const [period1, setPeriod1] = useState('2025-01');
  const [period2, setPeriod2] = useState('2024-12');
  const [comparisonType, setComparisonType] = useState<'amount' | 'percentage'>('amount');

  if (!isOpen) return null;

  const comparisonData = [
    {
      accountCode: '1001',
      accountName: 'Cash in Hand',
      type: 'Asset',
      period1: 285000,
      period2: 245000,
      variance: 40000,
      variancePercent: 16.33
    },
    {
      accountCode: '1002',
      accountName: 'Bank Account - HDFC',
      type: 'Asset',
      period1: 1250000,
      period2: 1180000,
      variance: 70000,
      variancePercent: 5.93
    },
    {
      accountCode: '1100',
      accountName: 'Accounts Receivable',
      type: 'Asset',
      period1: 650000,
      period2: 720000,
      variance: -70000,
      variancePercent: -9.72
    },
    {
      accountCode: '2001',
      accountName: 'Accounts Payable',
      type: 'Liability',
      period1: 425000,
      period2: 380000,
      variance: 45000,
      variancePercent: 11.84
    },
    {
      accountCode: '3001',
      accountName: 'Share Capital',
      type: 'Equity',
      period1: 1000000,
      period2: 1000000,
      variance: 0,
      variancePercent: 0
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Trial Balance Period Comparison</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Period Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period 1</label>
              <input
                type="month"
                value={period1}
                onChange={(e) => setPeriod1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period 2</label>
              <input
                type="month"
                value={period2}
                onChange={(e) => setPeriod2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Variance Display</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setComparisonType('amount')}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                    comparisonType === 'amount'
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Amount
                </button>
                <button
                  onClick={() => setComparisonType('percentage')}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                    comparisonType === 'percentage'
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  %
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Jan 2025 Total</div>
              <div className="text-xl font-bold text-blue-900">₹3,610,000</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 mb-1">Dec 2024 Total</div>
              <div className="text-xl font-bold text-green-900">₹3,525,000</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Net Change</div>
              <div className="text-xl font-bold text-purple-900">₹85,000 ↑</div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Account Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Account Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Jan 2025</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Dec 2024</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Variance</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.map((row) => (
                    <tr key={row.accountCode} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm text-gray-900">{row.accountCode}</td>
                      <td className="px-4 py-3 text-gray-900">{row.accountName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          row.type === 'Asset' ? 'bg-blue-100 text-blue-700' :
                          row.type === 'Liability' ? 'bg-red-100 text-red-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₹{row.period1.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₹{row.period2.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        row.variance > 0 ? 'text-green-600' : row.variance < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {row.variance > 0 ? '+' : ''}₹{row.variance.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        row.variancePercent > 0 ? 'text-green-600' : row.variancePercent < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {row.variancePercent > 0 ? '+' : ''}{row.variancePercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Export Comparison
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. EXPORT TRIAL BALANCE MODAL (Emerald Gradient)
// ============================================================================
interface ExportTrialBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport?: (data: any) => void;
}

export function ExportTrialBalanceModal({ isOpen, onClose, onExport }: ExportTrialBalanceModalProps) {
  const [exportFormat, setExportFormat] = useState('excel');
  const [includeOptions, setIncludeOptions] = useState({
    accountCode: true,
    accountName: true,
    accountType: true,
    openingBalance: true,
    debitTotal: true,
    creditTotal: true,
    closingBalance: true,
    transactionCount: false,
    zeroBalances: false,
    summary: true
  });
  const [groupBy, setGroupBy] = useState('type');
  const [sortBy, setSortBy] = useState('code');

  const handleExport = () => {
    console.log('Exporting trial balance:', { exportFormat, includeOptions, groupBy, sortBy });
    onExport?.({ exportFormat, includeOptions, groupBy, sortBy });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Export Trial Balance</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Export Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'excel', label: 'Excel', ext: '.xlsx' },
                { value: 'csv', label: 'CSV', ext: '.csv' },
                { value: 'pdf', label: 'PDF', ext: '.pdf' },
                { value: 'json', label: 'JSON', ext: '.json' }
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value)}
                  className={`p-3 border rounded-lg transition-colors ${
                    exportFormat === format.value
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs">{format.ext}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Fields</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(includeOptions).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setIncludeOptions({ ...includeOptions, [key]: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Grouping & Sorting */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="none">No Grouping</option>
                <option value="type">Account Type</option>
                <option value="category">Category</option>
                <option value="parent">Parent Account</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="code">Account Code</option>
                <option value="name">Account Name</option>
                <option value="balance">Balance (High to Low)</option>
                <option value="type">Account Type</option>
              </select>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="text-emerald-800 font-medium mb-3">📊 Export Summary</h4>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Format: {exportFormat.toUpperCase()}</li>
              <li>• Total accounts: 234</li>
              <li>• Selected fields: {Object.values(includeOptions).filter(Boolean).length}</li>
              <li>• Grouping: {groupBy === 'none' ? 'None' : groupBy}</li>
              <li>• Estimated file size: ~450 KB</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Export Trial Balance
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. PRINT TRIAL BALANCE MODAL (Slate Gradient)
// ============================================================================
interface PrintTrialBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint?: (data: any) => void;
}

export function PrintTrialBalanceModal({ isOpen, onClose, onPrint }: PrintTrialBalanceModalProps) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageSize, setPageSize] = useState('A4');
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeFooter, setIncludeFooter] = useState(true);
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  const handlePrint = () => {
    console.log('Printing trial balance:', { orientation, pageSize, includeHeader, includeFooter, showZeroBalances, fontSize });
    onPrint?.({ orientation, pageSize, includeHeader, includeFooter, showZeroBalances, fontSize });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Print Trial Balance</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Page Setup */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Page Setup</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Orientation</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      orientation === 'portrait'
                        ? 'bg-slate-50 border-slate-300 text-slate-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      orientation === 'landscape'
                        ? 'bg-slate-50 border-slate-300 text-slate-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="Letter">Letter (8.5 x 11 in)</option>
                  <option value="Legal">Legal (8.5 x 14 in)</option>
                  <option value="A3">A3 (297 x 420 mm)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <div className="grid grid-cols-3 gap-2">
              {['small', 'normal', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    fontSize === size
                      ? 'bg-slate-50 border-slate-300 text-slate-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Print Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={includeHeader}
                onChange={(e) => setIncludeHeader(e.target.checked)}
                className="w-5 h-5 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Include header</span>
                <p className="text-xs text-gray-500">Company name, report title, and date range</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={includeFooter}
                onChange={(e) => setIncludeFooter(e.target.checked)}
                className="w-5 h-5 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Include footer</span>
                <p className="text-xs text-gray-500">Page numbers and print timestamp</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={showZeroBalances}
                onChange={(e) => setShowZeroBalances(e.target.checked)}
                className="w-5 h-5 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Show zero balances</span>
                <p className="text-xs text-gray-500">Include accounts with zero balance</p>
              </div>
            </label>
          </div>

          {/* Preview Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-slate-800 font-medium mb-2">🖨️ Print Preview</h4>
            <div className="text-sm text-slate-700 space-y-1">
              <p>• Orientation: {orientation.charAt(0).toUpperCase() + orientation.slice(1)}</p>
              <p>• Page size: {pageSize}</p>
              <p>• Estimated pages: {showZeroBalances ? '8-10' : '6-8'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. DRILL DOWN TO LEDGER MODAL (Indigo Gradient)
// ============================================================================
interface DrillDownToLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountCode?: string;
  accountName?: string;
}

export function DrillDownToLedgerModal({ isOpen, onClose, accountCode, accountName }: DrillDownToLedgerModalProps) {
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-01-31' });
  const [filterType, setFilterType] = useState('all');

  if (!isOpen) return null;

  const ledgerEntries = [
    { date: '2025-01-05', voucher: 'JE-2025-0012', type: 'JV', description: 'Opening balance', debit: 125000, credit: 0, balance: 125000 },
    { date: '2025-01-08', voucher: 'JE-2025-0045', type: 'JV', description: 'Cash received from customer ABC Ltd', debit: 50000, credit: 0, balance: 175000 },
    { date: '2025-01-12', voucher: 'JE-2025-0078', type: 'JV', description: 'Payment to supplier XYZ Corp', debit: 0, credit: 30000, balance: 145000 },
    { date: '2025-01-15', voucher: 'JE-2025-0123', type: 'JV', description: 'Cash sales for the week', debit: 85000, credit: 0, balance: 230000 },
    { date: '2025-01-20', voucher: 'JE-2025-0156', type: 'JV', description: 'Office rent payment', debit: 0, credit: 25000, balance: 205000 },
    { date: '2025-01-25', voucher: 'JE-2025-0189', type: 'JV', description: 'Bank deposit', debit: 0, credit: 50000, balance: 155000 },
    { date: '2025-01-28', voucher: 'JE-2025-0215', type: 'JV', description: 'Cash received from customer DEF Inc', debit: 65000, credit: 0, balance: 220000 },
    { date: '2025-01-31', voucher: 'JE-2025-0234', type: 'JV', description: 'Petty cash expenses', debit: 0, credit: 5000, balance: 215000 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">General Ledger - Drill Down</h2>
              <p className="text-white/80 text-sm">{accountCode} - {accountName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="debit">Debits Only</option>
                <option value="credit">Credits Only</option>
              </select>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Voucher</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Debit</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Credit</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ledgerEntries.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{entry.date}</td>
                      <td className="px-4 py-3 font-mono text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                        {entry.voucher}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{entry.description}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-indigo-900">
                        ₹{entry.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-indigo-50 border-t-2 border-indigo-300">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right font-semibold text-gray-900">Totals:</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">₹325,000</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">₹110,000</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-900">₹215,000</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {ledgerEntries.length} transactions
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Export to Excel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. FILTER TRIAL BALANCE MODAL (Cyan Gradient)
// ============================================================================
interface FilterTrialBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: any) => void;
}

export function FilterTrialBalanceModal({ isOpen, onClose, onApply }: FilterTrialBalanceModalProps) {
  const [accountTypes, setAccountTypes] = useState<string[]>([]);
  const [balanceRange, setBalanceRange] = useState({ min: '', max: '' });
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const [accountCodeRange, setAccountCodeRange] = useState({ start: '', end: '' });

  const toggleAccountType = (type: string) => {
    if (accountTypes.includes(type)) {
      setAccountTypes(accountTypes.filter(t => t !== type));
    } else {
      setAccountTypes([...accountTypes, type]);
    }
  };

  const handleApply = () => {
    const filters = { accountTypes, balanceRange, showZeroBalances, accountCodeRange };
    console.log('Applying filters:', filters);
    onApply?.(filters);
    onClose();
  };

  const handleReset = () => {
    setAccountTypes([]);
    setBalanceRange({ min: '', max: '' });
    setShowZeroBalances(false);
    setAccountCodeRange({ start: '', end: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Filter Trial Balance</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Account Types */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Account Types</label>
            <div className="grid grid-cols-2 gap-2">
              {['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleAccountType(type)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    accountTypes.includes(type)
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Balance Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Balance Range</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={balanceRange.min}
                onChange={(e) => setBalanceRange({ ...balanceRange, min: e.target.value })}
                placeholder="Min Balance"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="number"
                value={balanceRange.max}
                onChange={(e) => setBalanceRange({ ...balanceRange, max: e.target.value })}
                placeholder="Max Balance"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Account Code Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Code Range</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={accountCodeRange.start}
                onChange={(e) => setAccountCodeRange({ ...accountCodeRange, start: e.target.value })}
                placeholder="Start Code (e.g., 1000)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="text"
                value={accountCodeRange.end}
                onChange={(e) => setAccountCodeRange({ ...accountCodeRange, end: e.target.value })}
                placeholder="End Code (e.g., 1999)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={showZeroBalances}
                onChange={(e) => setShowZeroBalances(e.target.checked)}
                className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Show accounts with zero balance</span>
                <p className="text-xs text-gray-500">Include accounts that have no activity</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Reset All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
