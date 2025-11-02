'use client';

import React, { useState } from 'react';
import { X, FileText, Settings, Calendar, Filter, Download, Layout, TrendingUp, DollarSign } from 'lucide-react';

// ============================================================================
// 1. CUSTOM REPORT BUILDER MODAL (Blue Gradient)
// ============================================================================
interface CustomReportBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: (data: any) => void;
}

export function CustomReportBuilderModal({ isOpen, onClose, onGenerate }: CustomReportBuilderModalProps) {
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('general_ledger');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['date', 'voucher', 'description', 'debit', 'credit', 'balance']);
  const [groupBy, setGroupBy] = useState('none');
  const [sortBy, setSortBy] = useState('date');
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    voucherTypes: [] as string[],
    costCenters: [] as string[]
  });

  const availableColumns = [
    { id: 'date', name: 'Date' },
    { id: 'voucher', name: 'Voucher Number' },
    { id: 'type', name: 'Voucher Type' },
    { id: 'description', name: 'Description' },
    { id: 'debit', name: 'Debit' },
    { id: 'credit', name: 'Credit' },
    { id: 'balance', name: 'Running Balance' },
    { id: 'costCenter', name: 'Cost Center' },
    { id: 'project', name: 'Project' },
    { id: 'department', name: 'Department' },
    { id: 'createdBy', name: 'Created By' }
  ];

  const toggleColumn = (columnId: string) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter(c => c !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };

  const handleGenerate = () => {
    const reportConfig = {
      reportName,
      reportType,
      dateRange,
      selectedAccounts,
      selectedColumns,
      groupBy,
      sortBy,
      filters
    };
    console.log('Generating custom report:', reportConfig);
    onGenerate?.(reportConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Custom Report Builder</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Name *</label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., Monthly Cash Flow Analysis"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general_ledger">General Ledger</option>
                <option value="trial_balance">Trial Balance</option>
                <option value="account_statement">Account Statement</option>
                <option value="transaction_list">Transaction List</option>
                <option value="aged_analysis">Aged Analysis</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range *</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Column Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Columns to Include</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableColumns.map((column) => (
                <label
                  key={column.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.id)}
                    onChange={() => toggleColumn(column.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{column.name}</span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">No Grouping</option>
                <option value="account">Account</option>
                <option value="date">Date (Monthly)</option>
                <option value="voucher_type">Voucher Type</option>
                <option value="cost_center">Cost Center</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="voucher">Voucher Number</option>
                <option value="amount">Amount (High to Low)</option>
                <option value="account">Account Code</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Advanced Filters</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Amount</label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Amount</label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                  placeholder="999999.99"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-800 font-medium mb-3">📊 Report Configuration Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium">Report Details:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Type: {reportType.replace('_', ' ').toUpperCase()}</li>
                  <li>• Columns: {selectedColumns.length}</li>
                  <li>• Grouping: {groupBy === 'none' ? 'None' : groupBy}</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Data Range:</p>
                <ul className="mt-1 space-y-1">
                  <li>• From: {dateRange.start || 'Not set'}</li>
                  <li>• To: {dateRange.end || 'Not set'}</li>
                  <li>• Sorted by: {sortBy}</li>
                </ul>
              </div>
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
          <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
            Save Template
          </button>
          <button
            onClick={handleGenerate}
            disabled={!reportName || !dateRange.start || !dateRange.end}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. AGED RECEIVABLES/PAYABLES REPORT MODAL (Green Gradient)
// ============================================================================
interface AgedAnalysisReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'receivables' | 'payables';
  onGenerate?: (data: any) => void;
}

export function AgedAnalysisReportModal({ isOpen, onClose, type, onGenerate }: AgedAnalysisReportModalProps) {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [agingBuckets, setAgingBuckets] = useState([
    { label: 'Current', days: 0 },
    { label: '1-30 Days', days: 30 },
    { label: '31-60 Days', days: 60 },
    { label: '61-90 Days', days: 90 },
    { label: '90+ Days', days: 999 }
  ]);
  const [groupBy, setGroupBy] = useState('customer');
  const [includeZeroBalances, setIncludeZeroBalances] = useState(false);
  const [currency, setCurrency] = useState('INR');

  const handleGenerate = () => {
    console.log('Generating aged analysis report:', { type, asOfDate, agingBuckets, groupBy, includeZeroBalances, currency });
    onGenerate?.({ type, asOfDate, agingBuckets, groupBy, includeZeroBalances, currency });
    onClose();
  };

  if (!isOpen) return null;

  const title = type === 'receivables' ? 'Aged Receivables Report' : 'Aged Payables Report';
  const partyLabel = type === 'receivables' ? 'Customer' : 'Vendor';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Report Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">As of Date *</label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>

          {/* Aging Buckets */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Aging Buckets</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                {agingBuckets.map((bucket, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200">
                    <span className="w-8 text-center text-sm font-medium text-gray-600">{index + 1}</span>
                    <input
                      type="text"
                      value={bucket.label}
                      readOnly
                      className="flex-1 px-3 py-1 border border-gray-300 rounded bg-gray-50 text-sm"
                    />
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {bucket.days === 0 ? '0 days' : bucket.days === 999 ? '90+ days' : `≤ ${bucket.days} days`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="customer">{partyLabel}</option>
                <option value="sales_person">Sales Person</option>
                <option value="region">Region</option>
                <option value="payment_terms">Payment Terms</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 w-full">
                <input
                  type="checkbox"
                  checked={includeZeroBalances}
                  onChange={(e) => setIncludeZeroBalances(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Include zero balances</span>
              </label>
            </div>
          </div>

          {/* Sample Preview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-800 font-medium mb-3">📊 Report Preview</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-green-900">{partyLabel}</th>
                    <th className="px-3 py-2 text-right text-green-900">Current</th>
                    <th className="px-3 py-2 text-right text-green-900">1-30</th>
                    <th className="px-3 py-2 text-right text-green-900">31-60</th>
                    <th className="px-3 py-2 text-right text-green-900">61-90</th>
                    <th className="px-3 py-2 text-right text-green-900">90+</th>
                    <th className="px-3 py-2 text-right text-green-900 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="text-green-700">
                  <tr className="border-t border-green-200">
                    <td className="px-3 py-2">ABC Ltd</td>
                    <td className="px-3 py-2 text-right">₹50,000</td>
                    <td className="px-3 py-2 text-right">₹25,000</td>
                    <td className="px-3 py-2 text-right">₹15,000</td>
                    <td className="px-3 py-2 text-right">₹0</td>
                    <td className="px-3 py-2 text-right">₹0</td>
                    <td className="px-3 py-2 text-right font-semibold">₹90,000</td>
                  </tr>
                  <tr className="border-t border-green-200">
                    <td className="px-3 py-2">XYZ Corp</td>
                    <td className="px-3 py-2 text-right">₹30,000</td>
                    <td className="px-3 py-2 text-right">₹0</td>
                    <td className="px-3 py-2 text-right">₹20,000</td>
                    <td className="px-3 py-2 text-right">₹10,000</td>
                    <td className="px-3 py-2 text-right text-red-600 font-semibold">₹5,000</td>
                    <td className="px-3 py-2 text-right font-semibold">₹65,000</td>
                  </tr>
                </tbody>
              </table>
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
            onClick={handleGenerate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. CASH FLOW STATEMENT MODAL (Teal Gradient)
// ============================================================================
interface CashFlowStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: (data: any) => void;
}

export function CashFlowStatementModal({ isOpen, onClose, onGenerate }: CashFlowStatementModalProps) {
  const [method, setMethod] = useState<'direct' | 'indirect'>('indirect');
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [includeNonCashItems, setIncludeNonCashItems] = useState(true);
  const [showComparative, setShowComparative] = useState(false);
  const [detailLevel, setDetailLevel] = useState('summary');

  const handleGenerate = () => {
    console.log('Generating cash flow statement:', { method, period, includeNonCashItems, showComparative, detailLevel });
    onGenerate?.({ method, period, includeNonCashItems, showComparative, detailLevel });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Cash Flow Statement</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Preparation Method *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMethod('indirect')}
                className={`p-4 border rounded-lg transition-colors ${
                  method === 'indirect'
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium mb-1">Indirect Method</div>
                <div className="text-xs">Start with net income and adjust for non-cash items</div>
              </button>
              <button
                onClick={() => setMethod('direct')}
                className={`p-4 border rounded-lg transition-colors ${
                  method === 'direct'
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium mb-1">Direct Method</div>
                <div className="text-xs">Show actual cash receipts and payments</div>
              </button>
            </div>
          </div>

          {/* Period Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={period.start}
                onChange={(e) => setPeriod({ ...period, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <input
                type="date"
                value={period.end}
                onChange={(e) => setPeriod({ ...period, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Detail Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Detail Level</label>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="summary">Summary (Main categories only)</option>
              <option value="detailed">Detailed (Include subcategories)</option>
              <option value="transaction">Transaction Level (All transactions)</option>
            </select>
          </div>

          {/* Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={includeNonCashItems}
                onChange={(e) => setIncludeNonCashItems(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Include non-cash items disclosure</span>
                <p className="text-xs text-gray-500">Depreciation, amortization, gains/losses on disposal</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={showComparative}
                onChange={(e) => setShowComparative(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Show comparative period</span>
                <p className="text-xs text-gray-500">Include previous period for comparison</p>
              </div>
            </label>
          </div>

          {/* Statement Structure Preview */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h4 className="text-teal-800 font-medium mb-3">📊 Statement Structure</h4>
            <div className="text-sm text-teal-700 space-y-2">
              <div className="font-medium">1. Operating Activities</div>
              <div className="pl-4 text-xs">
                {method === 'indirect'
                  ? '• Net Income + Adjustments (Depreciation, Changes in Working Capital)'
                  : '• Cash Receipts from Customers - Cash Paid to Suppliers/Employees'
                }
              </div>
              <div className="font-medium mt-2">2. Investing Activities</div>
              <div className="pl-4 text-xs">• Purchase/Sale of Fixed Assets, Investments</div>
              <div className="font-medium mt-2">3. Financing Activities</div>
              <div className="pl-4 text-xs">• Borrowings, Repayments, Dividends, Share Capital</div>
              <div className="font-medium mt-2">Net Increase/(Decrease) in Cash</div>
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
            onClick={handleGenerate}
            disabled={!period.start || !period.end}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate Statement
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. ACCOUNT RECONCILIATION REPORT MODAL (Purple Gradient)
// ============================================================================
interface AccountReconciliationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: (data: any) => void;
}

export function AccountReconciliationReportModal({ isOpen, onClose, onGenerate }: AccountReconciliationReportModalProps) {
  const [accountCode, setAccountCode] = useState('');
  const [reconciliationDate, setReconciliationDate] = useState('');
  const [bankStatementBalance, setBankStatementBalance] = useState('');
  const [showUnreconciledOnly, setShowUnreconciledOnly] = useState(true);
  const [includeOutstandingItems, setIncludeOutstandingItems] = useState(true);

  const handleGenerate = () => {
    console.log('Generating reconciliation report:', { accountCode, reconciliationDate, bankStatementBalance, showUnreconciledOnly, includeOutstandingItems });
    onGenerate?.({ accountCode, reconciliationDate, bankStatementBalance, showUnreconciledOnly, includeOutstandingItems });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Account Reconciliation Report</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Account Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account *</label>
            <select
              value={accountCode}
              onChange={(e) => setAccountCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Bank Account</option>
              <option value="1002">1002 - Bank Account - HDFC</option>
              <option value="1003">1003 - Bank Account - ICICI</option>
              <option value="1004">1004 - Bank Account - SBI</option>
              <option value="1005">1005 - Bank Account - Axis</option>
            </select>
          </div>

          {/* Reconciliation Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reconciliation Date *</label>
              <input
                type="date"
                value={reconciliationDate}
                onChange={(e) => setReconciliationDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Statement Balance *</label>
              <input
                type="number"
                step="0.01"
                value={bankStatementBalance}
                onChange={(e) => setBankStatementBalance(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={showUnreconciledOnly}
                onChange={(e) => setShowUnreconciledOnly(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Show unreconciled items only</span>
                <p className="text-xs text-gray-500">Filter out already reconciled transactions</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={includeOutstandingItems}
                onChange={(e) => setIncludeOutstandingItems(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Include outstanding items section</span>
                <p className="text-xs text-gray-500">Show deposits in transit and outstanding checks</p>
              </div>
            </label>
          </div>

          {/* Reconciliation Preview */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-purple-800 font-medium mb-3">📋 Reconciliation Format</h4>
            <div className="text-sm text-purple-700 space-y-2">
              <div className="flex justify-between font-medium">
                <span>Bank Statement Balance</span>
                <span>₹X,XXX,XXX</span>
              </div>
              <div className="pl-4 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Add: Deposits in Transit</span>
                  <span>₹XXX,XXX</span>
                </div>
                <div className="flex justify-between">
                  <span>Less: Outstanding Checks</span>
                  <span>(₹XXX,XXX)</span>
                </div>
              </div>
              <div className="flex justify-between font-bold border-t border-purple-300 pt-2">
                <span>Adjusted Bank Balance</span>
                <span>₹X,XXX,XXX</span>
              </div>
              <div className="flex justify-between font-medium mt-3">
                <span>Book Balance (per GL)</span>
                <span>₹X,XXX,XXX</span>
              </div>
              <div className="flex justify-between font-bold text-purple-900">
                <span>Difference</span>
                <span>₹0.00</span>
              </div>
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
            onClick={handleGenerate}
            disabled={!accountCode || !reconciliationDate || !bankStatementBalance}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. PROFIT & LOSS STATEMENT MODAL (Orange Gradient)
// ============================================================================
interface ProfitLossStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: (data: any) => void;
}

export function ProfitLossStatementModal({ isOpen, onClose, onGenerate }: ProfitLossStatementModalProps) {
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [format, setFormat] = useState('single_step');
  const [comparisonPeriod, setComparisonPeriod] = useState('none');
  const [includeBudget, setIncludeBudget] = useState(false);
  const [groupBy, setGroupBy] = useState('natural');

  const handleGenerate = () => {
    console.log('Generating P&L statement:', { period, format, comparisonPeriod, includeBudget, groupBy });
    onGenerate?.({ period, format, comparisonPeriod, includeBudget, groupBy });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Profit & Loss Statement</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Period */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={period.start}
                onChange={(e) => setPeriod({ ...period, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="date"
                value={period.end}
                onChange={(e) => setPeriod({ ...period, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Statement Format</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormat('single_step')}
                className={`p-4 border rounded-lg transition-colors ${
                  format === 'single_step'
                    ? 'bg-orange-50 border-orange-300 text-orange-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium mb-1">Single-Step</div>
                <div className="text-xs">All revenues minus all expenses</div>
              </button>
              <button
                onClick={() => setFormat('multi_step')}
                className={`p-4 border rounded-lg transition-colors ${
                  format === 'multi_step'
                    ? 'bg-orange-50 border-orange-300 text-orange-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium mb-1">Multi-Step</div>
                <div className="text-xs">Separate operating and non-operating</div>
              </button>
            </div>
          </div>

          {/* Comparison */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comparison Period</label>
            <select
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="none">No Comparison</option>
              <option value="previous_period">Previous Period</option>
              <option value="previous_year">Previous Year Same Period</option>
              <option value="ytd">Year-to-Date Comparison</option>
            </select>
          </div>

          {/* Grouping */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expense Grouping</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="natural">By Nature (Salaries, Rent, Utilities, etc.)</option>
              <option value="function">By Function (COGS, Admin, Selling, etc.)</option>
              <option value="department">By Department</option>
              <option value="project">By Project</option>
            </select>
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={includeBudget}
                onChange={(e) => setIncludeBudget(e.target.checked)}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Include budget comparison</span>
                <p className="text-xs text-gray-500">Show actual vs budget variance</p>
              </div>
            </label>
          </div>

          {/* Statement Preview */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-orange-800 font-medium mb-3">📊 Statement Structure</h4>
            <div className="text-sm text-orange-700 space-y-2">
              {format === 'single_step' ? (
                <>
                  <div className="font-medium">Revenues</div>
                  <div className="pl-4 text-xs">• Sales, Service Income, Other Revenue</div>
                  <div className="font-medium mt-2">Expenses</div>
                  <div className="pl-4 text-xs">• All operating and non-operating expenses</div>
                  <div className="font-bold mt-2">Net Profit/Loss</div>
                </>
              ) : (
                <>
                  <div className="font-medium">Net Sales</div>
                  <div className="font-medium">Cost of Goods Sold</div>
                  <div className="font-bold">Gross Profit</div>
                  <div className="font-medium mt-2">Operating Expenses</div>
                  <div className="font-bold">Operating Income</div>
                  <div className="font-medium mt-2">Other Income & Expenses</div>
                  <div className="font-bold">Net Profit Before Tax</div>
                  <div className="font-medium">Income Tax</div>
                  <div className="font-bold">Net Profit After Tax</div>
                </>
              )}
            </div>
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
            onClick={handleGenerate}
            disabled={!period.start || !period.end}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate Statement
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. BALANCE SHEET MODAL (Indigo Gradient)
// ============================================================================
interface BalanceSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: (data: any) => void;
}

export function BalanceSheetModal({ isOpen, onClose, onGenerate }: BalanceSheetModalProps) {
  const [asOfDate, setAsOfDate] = useState('');
  const [format, setFormat] = useState('account');
  const [detailLevel, setDetailLevel] = useState('summary');
  const [includeComparative, setIncludeComparative] = useState(false);
  const [showPercentages, setShowPercentages] = useState(false);

  const handleGenerate = () => {
    console.log('Generating balance sheet:', { asOfDate, format, detailLevel, includeComparative, showPercentages });
    onGenerate?.({ asOfDate, format, detailLevel, includeComparative, showPercentages });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Balance Sheet</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* As Of Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">As of Date *</label>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Balance Sheet Format</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormat('account')}
                className={`p-4 border rounded-lg transition-colors ${
                  format === 'account'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium mb-1">Account Format</div>
                <div className="text-xs">Assets = Liabilities + Equity (Horizontal)</div>
              </button>
              <button
                onClick={() => setFormat('report')}
                className={`p-4 border rounded-lg transition-colors ${
                  format === 'report'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium mb-1">Report Format</div>
                <div className="text-xs">Vertical layout (Assets, then Liab. + Equity)</div>
              </button>
            </div>
          </div>

          {/* Detail Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Detail Level</label>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="summary">Summary (Main categories only)</option>
              <option value="detailed">Detailed (Include subcategories)</option>
              <option value="account_level">Account Level (Individual accounts)</option>
            </select>
          </div>

          {/* Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={includeComparative}
                onChange={(e) => setIncludeComparative(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Include comparative figures</span>
                <p className="text-xs text-gray-500">Show previous year for comparison</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={showPercentages}
                onChange={(e) => setShowPercentages(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Show percentages</span>
                <p className="text-xs text-gray-500">Display each item as % of total assets</p>
              </div>
            </label>
          </div>

          {/* Balance Sheet Structure */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="text-indigo-800 font-medium mb-3">📊 Balance Sheet Structure</h4>
            <div className="grid grid-cols-2 gap-6 text-sm text-indigo-700">
              <div>
                <div className="font-bold mb-2">ASSETS</div>
                <div className="space-y-1 text-xs">
                  <div>Current Assets</div>
                  <div className="pl-3">• Cash & Bank</div>
                  <div className="pl-3">• Receivables</div>
                  <div className="pl-3">• Inventory</div>
                  <div className="mt-2">Non-Current Assets</div>
                  <div className="pl-3">• Fixed Assets</div>
                  <div className="pl-3">• Investments</div>
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">LIABILITIES & EQUITY</div>
                <div className="space-y-1 text-xs">
                  <div>Current Liabilities</div>
                  <div className="pl-3">• Payables</div>
                  <div className="pl-3">• Short-term Loans</div>
                  <div className="mt-2">Non-Current Liabilities</div>
                  <div className="pl-3">• Long-term Loans</div>
                  <div className="mt-2">Equity</div>
                  <div className="pl-3">• Share Capital</div>
                  <div className="pl-3">• Retained Earnings</div>
                </div>
              </div>
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
            onClick={handleGenerate}
            disabled={!asOfDate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate Balance Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
