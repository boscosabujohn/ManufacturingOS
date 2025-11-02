'use client';

import React, { useState } from 'react';
import { X, Calendar, Lock, Unlock, Plus, Edit, AlertCircle, CheckCircle, Clock, Archive } from 'lucide-react';

// ============================================================================
// 1. CREATE ACCOUNTING PERIOD MODAL (Blue Gradient)
// ============================================================================
interface CreateAccountingPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (data: any) => void;
}

export function CreateAccountingPeriodModal({ isOpen, onClose, onCreate }: CreateAccountingPeriodModalProps) {
  const [periodName, setPeriodName] = useState('');
  const [periodType, setPeriodType] = useState('monthly');
  const [fiscalYear, setFiscalYear] = useState('2025');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [autoCalculateEndDate, setAutoCalculateEndDate] = useState(true);
  const [status, setStatus] = useState('open');
  const [allowBackdating, setAllowBackdating] = useState(false);

  const handleCreate = () => {
    const period = {
      periodName,
      periodType,
      fiscalYear,
      startDate,
      endDate,
      status,
      allowBackdating
    };
    console.log('Creating accounting period:', period);
    onCreate?.(period);
    onClose();
  };

  // Auto-calculate end date based on period type
  React.useEffect(() => {
    if (autoCalculateEndDate && startDate) {
      const start = new Date(startDate);
      let end = new Date(start);

      switch (periodType) {
        case 'monthly':
          end.setMonth(end.getMonth() + 1);
          end.setDate(0); // Last day of month
          break;
        case 'quarterly':
          end.setMonth(end.getMonth() + 3);
          end.setDate(0);
          break;
        case 'yearly':
          end.setFullYear(end.getFullYear() + 1);
          end.setDate(end.getDate() - 1);
          break;
      }

      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, periodType, autoCalculateEndDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Create Accounting Period</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Period Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Name *</label>
              <input
                type="text"
                value={periodName}
                onChange={(e) => setPeriodName(e.target.value)}
                placeholder="e.g., January 2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year *</label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2024">FY 2024</option>
                <option value="2025">FY 2025</option>
                <option value="2026">FY 2026</option>
              </select>
            </div>
          </div>

          {/* Period Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Period Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {['monthly', 'quarterly', 'yearly'].map((type) => (
                <button
                  key={type}
                  onClick={() => setPeriodType(type)}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    periodType === type
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                  <div className="text-xs mt-1">
                    {type === 'monthly' ? '1 month' : type === 'quarterly' ? '3 months' : '12 months'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Date Range *</label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={autoCalculateEndDate}
                  onChange={(e) => setAutoCalculateEndDate(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                Auto-calculate end date
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={autoCalculateEndDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Initial Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStatus('open')}
                className={`p-3 rounded-lg border transition-colors ${
                  status === 'open'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Unlock className="w-4 h-4" />
                  <span className="font-medium">Open</span>
                </div>
                <div className="text-xs mt-1">Allow transactions</div>
              </button>
              <button
                onClick={() => setStatus('closed')}
                className={`p-3 rounded-lg border transition-colors ${
                  status === 'closed'
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">Closed</span>
                </div>
                <div className="text-xs mt-1">Block transactions</div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={allowBackdating}
                onChange={(e) => setAllowBackdating(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Allow backdating</span>
                <p className="text-xs text-gray-500">Permit transactions dated before the current date</p>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-800 font-medium mb-3">📅 Period Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium">Period Details:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Name: {periodName || 'Not set'}</li>
                  <li>• Type: {periodType.charAt(0).toUpperCase() + periodType.slice(1)}</li>
                  <li>• Fiscal Year: {fiscalYear}</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Date Range:</p>
                <ul className="mt-1 space-y-1">
                  <li>• From: {startDate || 'Not set'}</li>
                  <li>• To: {endDate || 'Not set'}</li>
                  <li>• Status: {status === 'open' ? '🔓 Open' : '🔒 Closed'}</li>
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
          <button
            onClick={handleCreate}
            disabled={!periodName || !startDate || !endDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Period
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. EDIT ACCOUNTING PERIOD MODAL (Green Gradient)
// ============================================================================
interface EditAccountingPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodId?: string;
  onSave?: (data: any) => void;
}

export function EditAccountingPeriodModal({ isOpen, onClose, periodId, onSave }: EditAccountingPeriodModalProps) {
  const [periodName, setPeriodName] = useState('January 2025');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [allowBackdating, setAllowBackdating] = useState(true);
  const [status] = useState('open');

  const handleSave = () => {
    const period = { periodId, periodName, startDate, endDate, allowBackdating };
    console.log('Updating accounting period:', period);
    onSave?.(period);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Accounting Period</h2>
              <p className="text-white/80 text-sm">Period ID: {periodId || 'P-2025-01'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Badge */}
          <div className="mb-6 flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {status === 'open' ? '🔓 Open' : '🔒 Closed'}
            </span>
            <span className="text-sm text-gray-600">
              {status === 'open' ? 'Currently accepting transactions' : 'No new transactions allowed'}
            </span>
          </div>

          {/* Period Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Period Name *</label>
            <input
              type="text"
              value={periodName}
              onChange={(e) => setPeriodName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={allowBackdating}
                onChange={(e) => setAllowBackdating(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Allow backdating</span>
                <p className="text-xs text-gray-500">Permit transactions dated before the current date</p>
              </div>
            </label>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-medium mb-1">Important Notice</h4>
                <p className="text-sm text-yellow-700">
                  Changing period dates may affect existing transactions. Ensure all transactions fall within the new date range.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Last modified: Jan 10, 2025 by John Doe
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. CLOSE ACCOUNTING PERIOD MODAL (Red Gradient)
// ============================================================================
interface CloseAccountingPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodId?: string;
  periodName?: string;
  onConfirm?: () => void;
}

export function CloseAccountingPeriodModal({ isOpen, onClose, periodId, periodName, onConfirm }: CloseAccountingPeriodModalProps) {
  const [reason, setReason] = useState('');
  const [runChecks, setRunChecks] = useState(true);
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [checksCompleted, setChecksCompleted] = useState(false);

  const preCloseChecks = [
    { id: 1, check: 'All transactions are posted', status: 'pass', message: '✓ No draft transactions found' },
    { id: 2, check: 'Trial balance is in balance', status: 'pass', message: '✓ Debits = Credits (₹5,250,000)' },
    { id: 3, check: 'Bank reconciliations complete', status: 'warning', message: '⚠ 1 account not reconciled' },
    { id: 4, check: 'No pending approvals', status: 'pass', message: '✓ All approvals processed' },
    { id: 5, check: 'Month-end adjustments posted', status: 'pass', message: '✓ All adjustments completed' }
  ];

  const handleRunChecks = () => {
    setChecksCompleted(true);
  };

  const handleClose = () => {
    console.log('Closing period:', periodId, 'Reason:', reason);
    onConfirm?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Close Accounting Period</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="mb-6">
            <p className="text-gray-900 font-medium mb-2">
              Period: <span className="font-semibold">{periodName || 'January 2025'}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Closing this period will prevent any new transactions from being posted to it.
            </p>
          </div>

          {/* Pre-Close Checks */}
          {runChecks && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pre-Close Checks</h3>
                {!checksCompleted && (
                  <button
                    onClick={handleRunChecks}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Run Checks
                  </button>
                )}
              </div>

              {checksCompleted && (
                <div className="space-y-3">
                  {preCloseChecks.map((check) => (
                    <div
                      key={check.id}
                      className={`p-4 rounded-lg border ${
                        check.status === 'pass'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            check.status === 'pass' ? 'text-green-900' : 'text-yellow-900'
                          }`}>
                            {check.check}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            check.status === 'pass' ? 'text-green-700' : 'text-yellow-700'
                          }`}>
                            {check.message}
                          </p>
                        </div>
                        <div className="ml-4">
                          {check.status === 'pass' ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Closing (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Enter reason for closing this period..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={runChecks}
                onChange={(e) => setRunChecks(e.target.checked)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Run pre-close validation checks</span>
                <p className="text-xs text-gray-500">Verify period is ready to be closed</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={notifyUsers}
                onChange={(e) => setNotifyUsers(e.target.checked)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Notify users</span>
                <p className="text-xs text-gray-500">Send email notification to accounting team</p>
              </div>
            </label>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">⚠️ Important</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• No new transactions can be posted to this period</li>
              <li>• Existing transactions cannot be edited or deleted</li>
              <li>• Period can be reopened if needed by authorized users</li>
              <li>• Reports for this period will be finalized</li>
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
            onClick={handleClose}
            disabled={runChecks && !checksCompleted}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Close Period
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. REOPEN ACCOUNTING PERIOD MODAL (Green Gradient)
// ============================================================================
interface ReopenAccountingPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodId?: string;
  periodName?: string;
  onConfirm?: () => void;
}

export function ReopenAccountingPeriodModal({ isOpen, onClose, periodId, periodName, onConfirm }: ReopenAccountingPeriodModalProps) {
  const [reason, setReason] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('');
  const [notifyUsers, setNotifyUsers] = useState(true);

  const handleReopen = () => {
    console.log('Reopening period:', periodId, { reason, authorizedBy, notifyUsers });
    onConfirm?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Unlock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Reopen Accounting Period</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-900 font-medium mb-2">
              Period: <span className="font-semibold">{periodName || 'January 2025'}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Reopening this period will allow new transactions to be posted again.
            </p>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Reopening *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why this period needs to be reopened..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Authorization */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authorized By *
            </label>
            <select
              value={authorizedBy}
              onChange={(e) => setAuthorizedBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select authorizing person</option>
              <option value="cfo">CFO - Jane Smith</option>
              <option value="controller">Controller - Bob Johnson</option>
              <option value="finance_manager">Finance Manager - Alice Wong</option>
            </select>
          </div>

          {/* Options */}
          <div className="mb-6">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={notifyUsers}
                onChange={(e) => setNotifyUsers(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Notify accounting team</span>
                <p className="text-xs text-gray-500">Send email notification about period reopening</p>
              </div>
            </label>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-medium mb-1">Audit Trail Notice</h4>
                <p className="text-sm text-yellow-700">
                  This action will be logged in the audit trail. Any new transactions posted to this period after reopening will be clearly identified.
                </p>
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
            onClick={handleReopen}
            disabled={!reason || !authorizedBy}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Reopen Period
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. LOCK ACCOUNTING PERIOD MODAL (Purple Gradient)
// ============================================================================
interface LockAccountingPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodId?: string;
  periodName?: string;
  onConfirm?: () => void;
}

export function LockAccountingPeriodModal({ isOpen, onClose, periodId, periodName, onConfirm }: LockAccountingPeriodModalProps) {
  const [lockReason, setLockReason] = useState('');
  const [permanentLock, setPermanentLock] = useState(false);

  const handleLock = () => {
    console.log('Locking period:', periodId, { lockReason, permanentLock });
    onConfirm?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Lock Accounting Period</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-900 font-medium mb-2">
              Period: <span className="font-semibold">{periodName || 'January 2025'}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Locking prevents all modifications including editing and deleting existing transactions.
            </p>
          </div>

          {/* Lock Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Locking *
            </label>
            <textarea
              value={lockReason}
              onChange={(e) => setLockReason(e.target.value)}
              rows={3}
              placeholder="e.g., Year-end audit, Regulatory compliance, Final close..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Lock Type */}
          <div className="mb-6">
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={permanentLock}
                onChange={(e) => setPermanentLock(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Permanent lock (Year-end close)</span>
                <p className="text-xs text-gray-500">Cannot be unlocked - use for final year-end close only</p>
              </div>
            </label>
          </div>

          {/* Warning */}
          <div className={`border rounded-lg p-4 ${
            permanentLock ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-200'
          }`}>
            <h4 className={`font-medium mb-2 ${permanentLock ? 'text-red-800' : 'text-purple-800'}`}>
              {permanentLock ? '🔴 Permanent Lock Warning' : '🔒 Lock Information'}
            </h4>
            <ul className={`text-sm space-y-1 ${permanentLock ? 'text-red-700' : 'text-purple-700'}`}>
              {permanentLock ? (
                <>
                  <li>• This is a PERMANENT lock - cannot be undone</li>
                  <li>• No modifications will ever be allowed to this period</li>
                  <li>• Use only for final year-end close after audit</li>
                  <li>• Requires CFO authorization</li>
                </>
              ) : (
                <>
                  <li>• Prevents editing and deleting of all transactions</li>
                  <li>• Can be unlocked by authorized users if needed</li>
                  <li>• More restrictive than just closing the period</li>
                  <li>• Recommended for audited periods</li>
                </>
              )}
            </ul>
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
            onClick={handleLock}
            disabled={!lockReason}
            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
              permanentLock ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {permanentLock ? 'Permanently Lock' : 'Lock Period'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. VIEW PERIOD DETAILS MODAL (Indigo Gradient)
// ============================================================================
interface ViewPeriodDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodId?: string;
}

export function ViewPeriodDetailsModal({ isOpen, onClose, periodId }: ViewPeriodDetailsModalProps) {
  if (!isOpen) return null;

  const periodData = {
    id: periodId || 'P-2025-01',
    name: 'January 2025',
    fiscalYear: 'FY 2025',
    type: 'Monthly',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'Closed',
    locked: false,
    transactionCount: 245,
    totalDebits: 5250000,
    totalCredits: 5250000,
    closedDate: '2025-02-05',
    closedBy: 'Jane Smith',
    createdDate: '2024-12-15',
    createdBy: 'John Doe',
    allowBackdating: true
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Period Details</h2>
              <p className="text-white/80 text-sm">{periodData.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Status Badges */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              periodData.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {periodData.status === 'Open' ? '🔓 Open' : '🔒 Closed'}
            </span>
            {periodData.locked && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                🔐 Locked
              </span>
            )}
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {periodData.type}
            </span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Transactions</div>
              <div className="text-2xl font-bold text-blue-900">{periodData.transactionCount}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 mb-1">Total Debits</div>
              <div className="text-2xl font-bold text-green-900">₹{(periodData.totalDebits / 1000000).toFixed(2)}M</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Total Credits</div>
              <div className="text-2xl font-bold text-purple-900">₹{(periodData.totalCredits / 1000000).toFixed(2)}M</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Difference</div>
              <div className="text-2xl font-bold text-gray-900">₹0.00</div>
            </div>
          </div>

          {/* Period Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Period Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Period ID</label>
                <p className="text-gray-900 font-mono">{periodData.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fiscal Year</label>
                <p className="text-gray-900">{periodData.fiscalYear}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Start Date</label>
                <p className="text-gray-900">{periodData.startDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">End Date</label>
                <p className="text-gray-900">{periodData.endDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Period Type</label>
                <p className="text-gray-900">{periodData.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Allow Backdating</label>
                <p className="text-gray-900">{periodData.allowBackdating ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Period Created</p>
                  <p className="text-sm text-gray-600">{periodData.createdDate} by {periodData.createdBy}</p>
                </div>
              </div>
              {periodData.status === 'Closed' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-900 font-medium">Period Closed</p>
                    <p className="text-sm text-gray-600">{periodData.closedDate} by {periodData.closedBy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
