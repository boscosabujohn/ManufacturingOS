'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, Calendar, DollarSign, FileText, Tag, Building2, Users } from 'lucide-react';

// ============================================================================
// 1. CREATE JOURNAL ENTRY MODAL (Blue Gradient)
// ============================================================================
interface CreateJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: string;
  credit: string;
  costCenter?: string;
  project?: string;
  department?: string;
}

export function CreateJournalEntryModal({ isOpen, onClose, onSave }: CreateJournalEntryModalProps) {
  const [entryDate, setEntryDate] = useState('');
  const [voucherType, setVoucherType] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState('1.00');
  const [tags, setTags] = useState<string[]>([]);
  const [lines, setLines] = useState<JournalLine[]>([
    { id: '1', accountCode: '', accountName: '', description: '', debit: '', credit: '', costCenter: '', project: '', department: '' },
    { id: '2', accountCode: '', accountName: '', description: '', debit: '', credit: '', costCenter: '', project: '', department: '' }
  ]);

  const addLine = () => {
    setLines([...lines, {
      id: Date.now().toString(),
      accountCode: '',
      accountName: '',
      description: '',
      debit: '',
      credit: '',
      costCenter: '',
      project: '',
      department: ''
    }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter(line => line.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof JournalLine, value: string) => {
    setLines(lines.map(line => line.id === id ? { ...line, [field]: value } : line));
  };

  const calculateTotals = () => {
    const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
    const difference = totalDebit - totalCredit;
    return { totalDebit, totalCredit, difference };
  };

  const { totalDebit, totalCredit, difference } = calculateTotals();
  const isBalanced = Math.abs(difference) < 0.01;

  const handleSave = () => {
    if (!isBalanced) {
      alert('Journal entry must be balanced (Debits = Credits)');
      return;
    }
    console.log('Creating journal entry:', { entryDate, voucherType, referenceNumber, description, currency, exchangeRate, lines, tags });
    onSave?.({ entryDate, voucherType, referenceNumber, description, currency, exchangeRate, lines, tags });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full  my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Create Journal Entry</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entry Date *</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type *</label>
              <select
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="JV">Journal Voucher (JV)</option>
                <option value="ADJ">Adjustment Entry (ADJ)</option>
                <option value="RV">Reversal Entry (RV)</option>
                <option value="REC">Recurring Entry (REC)</option>
                <option value="OPN">Opening Entry (OPN)</option>
                <option value="CLS">Closing Entry (CLS)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="REF-2025-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rate</label>
              <input
                type="number"
                step="0.0001"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Enter journal entry description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Journal Lines */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Journal Lines</h3>
              <button
                onClick={addLine}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Line
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Account Code *</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Account Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Debit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Credit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cost Center</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Project</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lines.map((line, index) => (
                      <tr key={line.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.accountCode}
                            onChange={(e) => updateLine(line.id, 'accountCode', e.target.value)}
                            placeholder="1001"
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.accountName}
                            onChange={(e) => updateLine(line.id, 'accountName', e.target.value)}
                            placeholder="Account"
                            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.description}
                            onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                            placeholder="Line description"
                            className="w-40 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={line.debit}
                            onChange={(e) => updateLine(line.id, 'debit', e.target.value)}
                            placeholder="0.00"
                            className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={line.credit}
                            onChange={(e) => updateLine(line.id, 'credit', e.target.value)}
                            placeholder="0.00"
                            className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.costCenter}
                            onChange={(e) => updateLine(line.id, 'costCenter', e.target.value)}
                            placeholder="CC"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.project}
                            onChange={(e) => updateLine(line.id, 'project', e.target.value)}
                            placeholder="PRJ"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeLine(line.id)}
                            disabled={lines.length <= 2}
                            className="text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right font-semibold text-gray-900">Totals:</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">
                        ₹{totalDebit.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">
                        ₹{totalCredit.toFixed(2)}
                      </td>
                      <td colSpan={3} className="px-3 py-2">
                        {!isBalanced && (
                          <span className="text-xs text-red-600 font-medium">
                            Difference: ₹{Math.abs(difference).toFixed(2)}
                          </span>
                        )}
                        {isBalanced && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Balanced
                          </span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Optional)</label>
            <div className="flex gap-2 flex-wrap">
              {['Month-End', 'Year-End', 'Adjustment', 'Depreciation', 'Accrual', 'Prepayment'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tags.includes(tag)
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isBalanced ? (
              <span className="text-green-600 font-medium">✓ Entry is balanced and ready to save</span>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
// 2. EDIT JOURNAL ENTRY MODAL (Green Gradient)
// ============================================================================
interface EditJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onSave?: (data: any) => void;
}

export function EditJournalEntryModal({ isOpen, onClose, entryId, onSave }: EditJournalEntryModalProps) {
  const [entryDate, setEntryDate] = useState('2025-01-15');
  const [voucherType, setVoucherType] = useState('JV');
  const [referenceNumber, setReferenceNumber] = useState('JE-2025-0123');
  const [description, setDescription] = useState('Monthly depreciation adjustment for equipment');
  const [status, setStatus] = useState('Draft');
  const [lines, setLines] = useState<JournalLine[]>([
    { id: '1', accountCode: '6500', accountName: 'Depreciation Expense', description: 'Equipment depreciation', debit: '5000.00', credit: '', costCenter: 'CC-001', project: 'PRJ-A', department: 'Production' },
    { id: '2', accountCode: '1800', accountName: 'Accumulated Depreciation', description: 'Equipment depreciation', debit: '', credit: '5000.00', costCenter: 'CC-001', project: 'PRJ-A', department: 'Production' }
  ]);

  const addLine = () => {
    setLines([...lines, {
      id: Date.now().toString(),
      accountCode: '',
      accountName: '',
      description: '',
      debit: '',
      credit: '',
      costCenter: '',
      project: '',
      department: ''
    }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter(line => line.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof JournalLine, value: string) => {
    setLines(lines.map(line => line.id === id ? { ...line, [field]: value } : line));
  };

  const calculateTotals = () => {
    const totalDebit = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
    const difference = totalDebit - totalCredit;
    return { totalDebit, totalCredit, difference };
  };

  const { totalDebit, totalCredit, difference } = calculateTotals();
  const isBalanced = Math.abs(difference) < 0.01;

  const handleSave = () => {
    if (!isBalanced) {
      alert('Journal entry must be balanced (Debits = Credits)');
      return;
    }
    console.log('Updating journal entry:', entryId, { entryDate, voucherType, referenceNumber, description, status, lines });
    onSave?.({ entryId, entryDate, voucherType, referenceNumber, description, status, lines });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full  my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Journal Entry</h2>
              <p className="text-white/80 text-sm">Entry ID: {entryId || 'JE-2025-0123'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Status Badge */}
          <div className="mb-3 flex items-center gap-3">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {status}
            </span>
            <span className="text-sm text-gray-600">Only draft entries can be edited</span>
          </div>

          {/* Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entry Date *</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type *</label>
              <select
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="JV">Journal Voucher (JV)</option>
                <option value="ADJ">Adjustment Entry (ADJ)</option>
                <option value="RV">Reversal Entry (RV)</option>
                <option value="REC">Recurring Entry (REC)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Journal Lines */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Journal Lines</h3>
              <button
                onClick={addLine}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Line
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Account Code</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Account Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Debit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Credit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cost Center</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">Action</th>
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
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.accountName}
                            onChange={(e) => updateLine(line.id, 'accountName', e.target.value)}
                            className="w-40 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.description}
                            onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                            className="w-40 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={line.debit}
                            onChange={(e) => updateLine(line.id, 'debit', e.target.value)}
                            className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={line.credit}
                            onChange={(e) => updateLine(line.id, 'credit', e.target.value)}
                            className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.costCenter}
                            onChange={(e) => updateLine(line.id, 'costCenter', e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeLine(line.id)}
                            disabled={lines.length <= 2}
                            className="text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right font-semibold text-gray-900">Totals:</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">
                        ₹{totalDebit.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">
                        ₹{totalCredit.toFixed(2)}
                      </td>
                      <td colSpan={2} className="px-3 py-2">
                        {!isBalanced && (
                          <span className="text-xs text-red-600 font-medium">
                            Difference: ₹{Math.abs(difference).toFixed(2)}
                          </span>
                        )}
                        {isBalanced && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Balanced
                          </span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Last modified: Jan 15, 2025 at 10:30 AM by John Doe
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Update Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. VIEW JOURNAL ENTRY MODAL (Purple Gradient)
// ============================================================================
interface ViewJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
}

export function ViewJournalEntryModal({ isOpen, onClose, entryId }: ViewJournalEntryModalProps) {
  if (!isOpen) return null;

  const entryData = {
    voucherNumber: 'JE-2025-0123',
    entryDate: '2025-01-15',
    voucherType: 'Journal Voucher (JV)',
    referenceNumber: 'REF-2025-001',
    description: 'Monthly depreciation adjustment for equipment',
    status: 'Posted',
    currency: 'INR',
    totalDebit: 5000.00,
    totalCredit: 5000.00,
    createdBy: 'John Doe',
    createdDate: '2025-01-15 09:30 AM',
    postedBy: 'Jane Smith',
    postedDate: '2025-01-15 02:45 PM',
    tags: ['Month-End', 'Depreciation'],
    lines: [
      { accountCode: '6500', accountName: 'Depreciation Expense', description: 'Equipment depreciation', debit: 5000.00, credit: 0, costCenter: 'CC-001', project: 'PRJ-A', department: 'Production' },
      { accountCode: '1800', accountName: 'Accumulated Depreciation', description: 'Equipment depreciation', debit: 0, credit: 5000.00, costCenter: 'CC-001', project: 'PRJ-A', department: 'Production' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Journal Entry Details</h2>
              <p className="text-white/80 text-sm">{entryData.voucherNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Status</div>
              <div className="text-xl font-bold text-blue-900">{entryData.status}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 mb-1">Total Debit</div>
              <div className="text-xl font-bold text-green-900">₹{entryData.totalDebit.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Total Credit</div>
              <div className="text-xl font-bold text-purple-900">₹{entryData.totalCredit.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Currency</div>
              <div className="text-xl font-bold text-gray-900">{entryData.currency}</div>
            </div>
          </div>

          {/* Entry Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Entry Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Entry Date</label>
                <p className="text-gray-900">{entryData.entryDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Voucher Type</label>
                <p className="text-gray-900">{entryData.voucherType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Reference Number</label>
                <p className="text-gray-900">{entryData.referenceNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tags</label>
                <div className="flex gap-2 mt-1">
                  {entryData.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{entryData.description}</p>
              </div>
            </div>
          </div>

          {/* Journal Lines */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Journal Lines</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Account</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Debit</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Credit</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cost Center</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Project</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entryData.lines.map((line, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{line.accountCode}</div>
                        <div className="text-sm text-gray-600">{line.accountName}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{line.description}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {line.debit > 0 ? `₹${line.debit.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {line.credit > 0 ? `₹${line.credit.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{line.costCenter}</td>
                      <td className="px-4 py-3 text-gray-700">{line.project}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-right font-semibold text-gray-900">Totals:</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{entryData.totalDebit.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{entryData.totalCredit.toLocaleString()}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit Trail</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Created by {entryData.createdBy}</p>
                  <p className="text-sm text-gray-600">{entryData.createdDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Posted by {entryData.postedBy}</p>
                  <p className="text-sm text-gray-600">{entryData.postedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex justify-end">
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
// 4. DELETE JOURNAL ENTRY MODAL (Red Gradient)
// ============================================================================
interface DeleteJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onConfirm?: () => void;
}

export function DeleteJournalEntryModal({ isOpen, onClose, entryId, onConfirm }: DeleteJournalEntryModalProps) {
  const [reason, setReason] = useState('');

  const handleDelete = () => {
    console.log('Deleting journal entry:', entryId, 'Reason:', reason);
    onConfirm?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Delete Journal Entry</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <p className="text-gray-900 font-medium mb-2">
              Are you sure you want to delete this journal entry?
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Entry ID: <span className="font-mono">{entryId || 'JE-2025-0123'}</span>
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="text-red-800 font-medium mb-2">⚠️ Warning</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• This action cannot be undone</li>
                <li>• Only draft entries can be deleted</li>
                <li>• Posted entries must be reversed instead</li>
                <li>• All associated data will be permanently removed</li>
              </ul>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Deletion *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Provide a reason for deleting this entry..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!reason.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. POST JOURNAL ENTRY MODAL (Teal Gradient)
// ============================================================================
interface PostJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onConfirm?: () => void;
}

export function PostJournalEntryModal({ isOpen, onClose, entryId, onConfirm }: PostJournalEntryModalProps) {
  const [postDate, setPostDate] = useState(new Date().toISOString().split('T')[0]);
  const [verifyChecks, setVerifyChecks] = useState({
    balanced: true,
    validAccounts: true,
    withinPeriod: true,
    authorized: false
  });

  const canPost = Object.values(verifyChecks).every(check => check);

  const handlePost = () => {
    console.log('Posting journal entry:', entryId, 'Post date:', postDate);
    onConfirm?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Post Journal Entry</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <p className="text-gray-900 font-medium mb-2">
              Entry ID: <span className="font-mono">{entryId || 'JE-2025-0123'}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Posting will finalize this entry and update the general ledger. Once posted, the entry cannot be edited.
            </p>
          </div>

          {/* Post Date */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Date *</label>
            <input
              type="date"
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Validation Checks */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Pre-Post Validation</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span className="text-sm text-gray-700">Entry is balanced (Debits = Credits)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span className="text-sm text-gray-700">All accounts are valid and active</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span className="text-sm text-gray-700">Entry date is within an open accounting period</span>
              </div>
              <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={verifyChecks.authorized}
                  onChange={(e) => setVerifyChecks({ ...verifyChecks, authorized: e.target.checked })}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">I verify that I am authorized to post this entry</span>
              </label>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-blue-800 font-medium mb-2">📊 Impact Summary</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 2 accounts will be updated</li>
              <li>• Total impact: ₹5,000.00</li>
              <li>• General Ledger will be updated immediately</li>
              <li>• Trial Balance will reflect changes</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            disabled={!canPost}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Post Entry
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. REVERSE JOURNAL ENTRY MODAL (Orange Gradient)
// ============================================================================
interface ReverseJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId?: string;
  onConfirm?: (data: any) => void;
}

export function ReverseJournalEntryModal({ isOpen, onClose, entryId, onConfirm }: ReverseJournalEntryModalProps) {
  const [reversalDate, setReversalDate] = useState('');
  const [reversalReason, setReversalReason] = useState('');
  const [autoPost, setAutoPost] = useState(true);

  const handleReverse = () => {
    console.log('Reversing journal entry:', entryId, { reversalDate, reversalReason, autoPost });
    onConfirm?.({ entryId, reversalDate, reversalReason, autoPost });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Reverse Journal Entry</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <p className="text-gray-900 font-medium mb-2">
              Original Entry: <span className="font-mono">{entryId || 'JE-2025-0123'}</span>
            </p>
            <p className="text-gray-600 text-sm">
              This will create a reversal entry with opposite debits and credits to cancel out the original entry.
            </p>
          </div>

          {/* Reversal Details */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reversal Date *</label>
            <input
              type="date"
              value={reversalDate}
              onChange={(e) => setReversalDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">The reversal entry will be dated on this date</p>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Reversal *</label>
            <textarea
              value={reversalReason}
              onChange={(e) => setReversalReason(e.target.value)}
              rows={3}
              placeholder="Explain why this entry is being reversed..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div className="mb-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={autoPost}
                onChange={(e) => setAutoPost(e.target.checked)}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Automatically post reversal entry</span>
                <p className="text-xs text-gray-500">If unchecked, the reversal entry will be saved as draft</p>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 className="text-orange-800 font-medium mb-3">📋 Reversal Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">New Voucher Number:</span>
                <span className="font-mono text-gray-900">RV-2025-0045</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Reference to Original:</span>
                <span className="font-mono text-gray-900">JE-2025-0123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Reversed Amount:</span>
                <span className="font-semibold text-gray-900">₹5,000.00</span>
              </div>
              <div className="pt-2 border-t border-orange-300">
                <p className="text-orange-700">
                  The original entry will be marked as "Reversed" and linked to the new reversal entry.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReverse}
            disabled={!reversalDate || !reversalReason}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Reversal
          </button>
        </div>
      </div>
    </div>
  );
}
