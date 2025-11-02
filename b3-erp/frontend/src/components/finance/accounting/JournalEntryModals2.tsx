'use client';

import React, { useState } from 'react';
import { X, Calendar, Copy, RefreshCw, FileUp, FileDown, Search, Filter } from 'lucide-react';

// ============================================================================
// 7. RECURRING JOURNAL ENTRY MODAL (Indigo Gradient)
// ============================================================================
interface RecurringJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onSave?: (data: any) => void;
}

export function RecurringJournalEntryModal({ isOpen, onClose, entryId, onSave }: RecurringJournalEntryModalProps) {
  const [frequency, setFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endType, setEndType] = useState<'date' | 'occurrences'>('date');
  const [occurrences, setOccurrences] = useState('12');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [autoPost, setAutoPost] = useState(false);
  const [description, setDescription] = useState('Monthly rent expense');
  const [amount, setAmount] = useState('25000.00');

  const handleSave = () => {
    console.log('Creating recurring entry:', { frequency, startDate, endDate, endType, occurrences, dayOfMonth, autoPost, description, amount });
    onSave?.({ frequency, startDate, endDate, endType, occurrences, dayOfMonth, autoPost, description, amount });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Setup Recurring Journal Entry</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Entry Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entry Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Monthly rent expense"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Recurrence Pattern */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recurrence Pattern</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semiannual">Semi-Annual</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              {frequency === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month</label>
                  <select
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="1">1st day of month</option>
                    <option value="15">15th day of month</option>
                    <option value="last">Last day of month</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End By</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEndType('date')}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      endType === 'date'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Date
                  </button>
                  <button
                    onClick={() => setEndType('occurrences')}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      endType === 'occurrences'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Count
                  </button>
                </div>
              </div>
            </div>
            {endType === 'date' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Occurrences</label>
                <input
                  type="number"
                  value={occurrences}
                  onChange={(e) => setOccurrences(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={autoPost}
                onChange={(e) => setAutoPost(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Automatically post entries</span>
                <p className="text-xs text-gray-500">Entries will be posted automatically on the scheduled date</p>
              </div>
            </label>
          </div>

          {/* Preview Schedule */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="text-indigo-800 font-medium mb-3">📅 Schedule Preview</h4>
            <div className="space-y-2 text-sm text-indigo-700">
              <p>First entry: Feb 1, 2025</p>
              <p>Second entry: Mar 1, 2025</p>
              <p>Third entry: Apr 1, 2025</p>
              <p className="pt-2 border-t border-indigo-300 text-indigo-600">
                ... and {parseInt(occurrences) - 3} more occurrences
              </p>
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
            onClick={handleSave}
            disabled={!startDate || !description}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Recurring Entry
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. MULTI-CURRENCY JOURNAL ENTRY MODAL (Cyan Gradient)
// ============================================================================
interface MultiCurrencyJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

interface CurrencyLine {
  id: string;
  accountCode: string;
  accountName: string;
  currency: string;
  foreignAmount: string;
  exchangeRate: string;
  baseAmount: string;
  debitCredit: 'debit' | 'credit';
}

export function MultiCurrencyJournalEntryModal({ isOpen, onClose, onSave }: MultiCurrencyJournalEntryModalProps) {
  const [entryDate, setEntryDate] = useState('');
  const [baseCurrency] = useState('INR');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<CurrencyLine[]>([
    { id: '1', accountCode: '', accountName: '', currency: 'USD', foreignAmount: '', exchangeRate: '83.50', baseAmount: '', debitCredit: 'debit' },
    { id: '2', accountCode: '', accountName: '', currency: 'INR', foreignAmount: '', exchangeRate: '1.00', baseAmount: '', debitCredit: 'credit' }
  ]);

  const updateLine = (id: string, field: keyof CurrencyLine, value: string) => {
    setLines(lines.map(line => {
      if (line.id === id) {
        const updated = { ...line, [field]: value };
        // Auto-calculate base amount
        if (field === 'foreignAmount' || field === 'exchangeRate') {
          const foreign = parseFloat(field === 'foreignAmount' ? value : updated.foreignAmount) || 0;
          const rate = parseFloat(field === 'exchangeRate' ? value : updated.exchangeRate) || 0;
          updated.baseAmount = (foreign * rate).toFixed(2);
        }
        return updated;
      }
      return line;
    }));
  };

  const calculateTotals = () => {
    const totalDebit = lines.filter(l => l.debitCredit === 'debit').reduce((sum, line) => sum + (parseFloat(line.baseAmount) || 0), 0);
    const totalCredit = lines.filter(l => l.debitCredit === 'credit').reduce((sum, line) => sum + (parseFloat(line.baseAmount) || 0), 0);
    return { totalDebit, totalCredit, difference: totalDebit - totalCredit };
  };

  const { totalDebit, totalCredit, difference } = calculateTotals();
  const isBalanced = Math.abs(difference) < 0.01;

  const handleSave = () => {
    if (!isBalanced) {
      alert('Entry must be balanced in base currency');
      return;
    }
    console.log('Creating multi-currency entry:', { entryDate, description, baseCurrency, lines });
    onSave?.({ entryDate, description, baseCurrency, lines });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Multi-Currency Journal Entry</h2>
              <p className="text-white/80 text-sm">Base Currency: {baseCurrency}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entry Date *</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Foreign exchange transaction"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Currency Lines */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Account</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Dr/Cr</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Currency</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Foreign Amount</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Exchange Rate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Base Amount ({baseCurrency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lines.map((line) => (
                    <tr key={line.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={line.accountCode}
                          onChange={(e) => updateLine(line.id, 'accountCode', e.target.value)}
                          placeholder="Account"
                          className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={line.debitCredit}
                          onChange={(e) => updateLine(line.id, 'debitCredit', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="debit">Dr</option>
                          <option value="credit">Cr</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={line.currency}
                          onChange={(e) => updateLine(line.id, 'currency', e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="JPY">JPY</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={line.foreignAmount}
                          onChange={(e) => updateLine(line.id, 'foreignAmount', e.target.value)}
                          placeholder="0.00"
                          className="w-32 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.0001"
                          value={line.exchangeRate}
                          onChange={(e) => updateLine(line.id, 'exchangeRate', e.target.value)}
                          placeholder="1.0000"
                          className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={line.baseAmount}
                          readOnly
                          className="w-32 px-2 py-1 border border-gray-200 rounded text-sm text-right bg-gray-50"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={5} className="px-3 py-2 text-right font-semibold text-gray-900">
                      Totals in {baseCurrency}:
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Debit:</span>
                          <span className="font-semibold">₹{totalDebit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Credit:</span>
                          <span className="font-semibold">₹{totalCredit.toFixed(2)}</span>
                        </div>
                        {!isBalanced && (
                          <div className="flex justify-between text-red-600">
                            <span>Diff:</span>
                            <span className="font-semibold">₹{Math.abs(difference).toFixed(2)}</span>
                          </div>
                        )}
                        {isBalanced && (
                          <div className="text-green-600 text-center">✓ Balanced</div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <h4 className="text-cyan-800 font-medium mb-2">💱 Exchange Rate Information</h4>
            <p className="text-sm text-cyan-700">
              Exchange rates are applied automatically. All amounts are calculated in base currency ({baseCurrency}) for balancing.
              Foreign exchange gains/losses will be calculated based on the rates at transaction date.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isBalanced ? (
              <span className="text-green-600 font-medium">✓ Entry is balanced in base currency</span>
            ) : (
              <span className="text-red-600 font-medium">⚠ Entry must be balanced before saving</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isBalanced}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. JOURNAL ENTRY TEMPLATE MODAL (Violet Gradient)
// ============================================================================
interface JournalEntryTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (template: any) => void;
}

export function JournalEntryTemplateModal({ isOpen, onClose, onSelect }: JournalEntryTemplateModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const templates = [
    {
      id: 'T001',
      name: 'Monthly Depreciation',
      category: 'Depreciation',
      description: 'Standard depreciation entry for fixed assets',
      usageCount: 124,
      lastUsed: '2025-01-15'
    },
    {
      id: 'T002',
      name: 'Rent Payment',
      category: 'Expenses',
      description: 'Monthly office rent expense',
      usageCount: 98,
      lastUsed: '2025-01-10'
    },
    {
      id: 'T003',
      name: 'Salary Accrual',
      category: 'Payroll',
      description: 'Month-end salary accrual',
      usageCount: 86,
      lastUsed: '2025-01-31'
    },
    {
      id: 'T004',
      name: 'Prepaid Insurance',
      category: 'Prepayments',
      description: 'Monthly insurance prepayment amortization',
      usageCount: 72,
      lastUsed: '2025-01-20'
    },
    {
      id: 'T005',
      name: 'Interest Accrual',
      category: 'Finance',
      description: 'Monthly interest accrual on loan',
      usageCount: 64,
      lastUsed: '2025-01-25'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: any) => {
    console.log('Selected template:', template);
    onSelect?.(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Journal Entry Templates</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Depreciation">Depreciation</option>
                <option value="Expenses">Expenses</option>
                <option value="Payroll">Payroll</option>
                <option value="Prepayments">Prepayments</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          {/* Templates List */}
          <div className="space-y-3 max-h-[calc(90vh-16rem)] overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-violet-50 hover:border-violet-300 transition-colors cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template);
                    }}
                    className="px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors text-sm"
                  >
                    Use Template
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>ID: {template.id}</span>
                  <span>Used {template.usageCount} times</span>
                  <span>Last used: {template.lastUsed}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No templates found matching your criteria
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. BULK IMPORT JOURNAL ENTRIES MODAL (Emerald Gradient)
// ============================================================================
interface BulkImportJournalEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (data: any) => void;
}

export function BulkImportJournalEntriesModal({ isOpen, onClose, onImport }: BulkImportJournalEntriesModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'create' | 'validate'>('validate');
  const [autoPost, setAutoPost] = useState(false);
  const [skipErrors, setSkipErrors] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) return;
    console.log('Importing journal entries:', { file: file.name, importMode, autoPost, skipErrors });
    onImport?.({ file, importMode, autoPost, skipErrors });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Bulk Import Journal Entries</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
              <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-block"
              >
                Choose File
              </label>
              {file && (
                <p className="mt-3 text-sm text-gray-600">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}
              {!file && (
                <p className="mt-3 text-sm text-gray-500">
                  Supported formats: Excel (.xlsx, .xls) or CSV (.csv)
                </p>
              )}
            </div>
          </div>

          {/* Import Mode */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Import Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setImportMode('validate')}
                className={`p-3 border rounded-lg transition-colors ${
                  importMode === 'validate'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Validate Only</div>
                <div className="text-xs mt-1">Check for errors without importing</div>
              </button>
              <button
                onClick={() => setImportMode('create')}
                className={`p-3 border rounded-lg transition-colors ${
                  importMode === 'create'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Validate & Import</div>
                <div className="text-xs mt-1">Import entries after validation</div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={autoPost}
                onChange={(e) => setAutoPost(e.target.checked)}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Automatically post imported entries</span>
                <p className="text-xs text-gray-500">Entries will be posted immediately after import</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={skipErrors}
                onChange={(e) => setSkipErrors(e.target.checked)}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Skip entries with errors</span>
                <p className="text-xs text-gray-500">Continue importing valid entries even if some have errors</p>
              </div>
            </label>
          </div>

          {/* Template Download */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="text-emerald-800 font-medium mb-3">📥 Download Template</h4>
            <p className="text-sm text-emerald-700 mb-3">
              Use our template to ensure your data is formatted correctly
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2">
                <FileDown className="w-4 h-4" />
                Excel Template
              </button>
              <button className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm flex items-center gap-2">
                <FileDown className="w-4 h-4" />
                CSV Template
              </button>
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
            onClick={handleImport}
            disabled={!file}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {importMode === 'validate' ? 'Validate File' : 'Import Entries'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. EXPORT JOURNAL ENTRIES MODAL (Slate Gradient)
// ============================================================================
interface ExportJournalEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport?: (data: any) => void;
}

export function ExportJournalEntriesModal({ isOpen, onClose, onExport }: ExportJournalEntriesModalProps) {
  const [dateRange, setDateRange] = useState<'all' | 'range' | 'period'>('period');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('excel');
  const [includeFields, setIncludeFields] = useState({
    voucherNumber: true,
    date: true,
    type: true,
    description: true,
    accountCode: true,
    accountName: true,
    debit: true,
    credit: true,
    costCenter: true,
    project: true,
    status: true,
    createdBy: true
  });

  const handleExport = () => {
    console.log('Exporting journal entries:', { dateRange, startDate, endDate, format, includeFields });
    onExport?.({ dateRange, startDate, endDate, format, includeFields });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Export Journal Entries</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Date Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => setDateRange('all')}
                className={`p-2 border rounded-lg transition-colors ${
                  dateRange === 'all'
                    ? 'bg-slate-50 border-slate-300 text-slate-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setDateRange('period')}
                className={`p-2 border rounded-lg transition-colors ${
                  dateRange === 'period'
                    ? 'bg-slate-50 border-slate-300 text-slate-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Current Period
              </button>
              <button
                onClick={() => setDateRange('range')}
                className={`p-2 border rounded-lg transition-colors ${
                  dateRange === 'range'
                    ? 'bg-slate-50 border-slate-300 text-slate-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Custom Range
              </button>
            </div>
            {dateRange === 'range' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Export Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFormat('excel')}
                className={`p-3 border rounded-lg transition-colors ${
                  format === 'excel'
                    ? 'bg-slate-50 border-slate-300 text-slate-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Excel</div>
                <div className="text-xs">.xlsx</div>
              </button>
              <button
                onClick={() => setFormat('csv')}
                className={`p-3 border rounded-lg transition-colors ${
                  format === 'csv'
                    ? 'bg-slate-50 border-slate-300 text-slate-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">CSV</div>
                <div className="text-xs">.csv</div>
              </button>
              <button
                onClick={() => setFormat('pdf')}
                className={`p-3 border rounded-lg transition-colors ${
                  format === 'pdf'
                    ? 'bg-slate-50 border-slate-300 text-slate-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">PDF</div>
                <div className="text-xs">.pdf</div>
              </button>
            </div>
          </div>

          {/* Include Fields */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Fields</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(includeFields).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setIncludeFields({ ...includeFields, [key]: e.target.checked })}
                    className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-slate-800 font-medium mb-2">📊 Export Summary</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Estimated entries: 234</li>
              <li>• Estimated file size: ~2.5 MB</li>
              <li>• Selected fields: {Object.values(includeFields).filter(Boolean).length} of {Object.keys(includeFields).length}</li>
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
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Export Entries
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. FILTER JOURNAL ENTRIES MODAL (Purple Gradient)
// ============================================================================
interface FilterJournalEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: any) => void;
}

export function FilterJournalEntriesModal({ isOpen, onClose, onApply }: FilterJournalEntriesModalProps) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [voucherType, setVoucherType] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [costCenter, setCostCenter] = useState('');
  const [project, setProject] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  const toggleArrayValue = (arr: string[], value: string, setter: (arr: string[]) => void) => {
    if (arr.includes(value)) {
      setter(arr.filter(v => v !== value));
    } else {
      setter([...arr, value]);
    }
  };

  const handleApply = () => {
    const filters = {
      dateRange,
      voucherType,
      status,
      amountRange,
      costCenter,
      project,
      createdBy
    };
    console.log('Applying filters:', filters);
    onApply?.(filters);
    onClose();
  };

  const handleReset = () => {
    setDateRange({ start: '', end: '' });
    setVoucherType([]);
    setStatus([]);
    setAmountRange({ min: '', max: '' });
    setCostCenter('');
    setProject('');
    setCreatedBy('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Filter Journal Entries</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Date Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                placeholder="Start Date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                placeholder="End Date"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Voucher Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['JV', 'ADJ', 'RV', 'REC', 'OPN', 'CLS'].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleArrayValue(voucherType, type, setVoucherType)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    voucherType.includes(type)
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {['Draft', 'Posted', 'Reversed'].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleArrayValue(status, s, setStatus)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    status.includes(s)
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={amountRange.min}
                onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                placeholder="Min Amount"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                value={amountRange.max}
                onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                placeholder="Max Amount"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Cost Center & Project */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Center</label>
                <input
                  type="text"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  placeholder="Enter cost center"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="Enter project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Created By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
            <select
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Users</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
              <option value="bob">Bob Johnson</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-between">
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
