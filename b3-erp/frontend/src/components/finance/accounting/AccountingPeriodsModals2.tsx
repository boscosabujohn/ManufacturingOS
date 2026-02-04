'use client';

import React, { useState } from 'react';
import { X, Calendar, TrendingUp, Archive, Settings, AlertTriangle, Copy, FileText } from 'lucide-react';

// ============================================================================
// 7. YEAR-END CLOSE MODAL (Orange Gradient)
// ============================================================================
interface YearEndCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  fiscalYear?: string;
  onConfirm?: (data: any) => void;
}

export function YearEndCloseModal({ isOpen, onClose, fiscalYear, onConfirm }: YearEndCloseModalProps) {
  const [runChecklist, setRunChecklist] = useState(true);
  const [closeAllPeriods, setCloseAllPeriods] = useState(true);
  const [generateClosingEntries, setGenerateClosingEntries] = useState(true);
  const [transferRetainedEarnings, setTransferRetainedEarnings] = useState(true);
  const [createNextYear, setCreateNextYear] = useState(true);
  const [archiveData, setArchiveData] = useState(false);

  const yearEndChecklist = [
    { id: 1, item: 'All periods in fiscal year are closed', status: 'complete' },
    { id: 2, item: 'Trial balance is balanced', status: 'complete' },
    { id: 3, item: 'All bank reconciliations completed', status: 'complete' },
    { id: 4, item: 'Fixed asset depreciation posted', status: 'complete' },
    { id: 5, item: 'Inventory counted and adjusted', status: 'pending' },
    { id: 6, item: 'Accruals and prepayments posted', status: 'complete' },
    { id: 7, item: 'Year-end adjustments reviewed', status: 'complete' },
    { id: 8, item: 'Financial statements generated', status: 'pending' }
  ];

  const handleClose = () => {
    const data = {
      fiscalYear,
      closeAllPeriods,
      generateClosingEntries,
      transferRetainedEarnings,
      createNextYear,
      archiveData
    };
    console.log('Year-end close:', data);
    onConfirm?.(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full  my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Archive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Year-End Close</h2>
              <p className="text-white/80 text-sm">Fiscal Year {fiscalYear || '2025'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Year-End Checklist */}
          {runChecklist && (
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Year-End Checklist</h3>
              <div className="space-y-2">
                {yearEndChecklist.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      item.status === 'complete'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <span className={`text-sm ${
                      item.status === 'complete' ? 'text-green-900' : 'text-yellow-900'
                    }`}>
                      {item.item}
                    </span>
                    {item.status === 'complete' ? (
                      <span className="text-green-600 font-medium text-sm">✓ Complete</span>
                    ) : (
                      <span className="text-yellow-600 font-medium text-sm">⏳ Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Year-End Actions */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Year-End Actions</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={closeAllPeriods}
                  onChange={(e) => setCloseAllPeriods(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Close all open periods in fiscal year</span>
                  <p className="text-xs text-gray-500">Automatically close any remaining open periods</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={generateClosingEntries}
                  onChange={(e) => setGenerateClosingEntries(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Generate closing entries</span>
                  <p className="text-xs text-gray-500">Create journal entries to close revenue and expense accounts</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={transferRetainedEarnings}
                  onChange={(e) => setTransferRetainedEarnings(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Transfer net income to retained earnings</span>
                  <p className="text-xs text-gray-500">Move year's profit/loss to equity account</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={createNextYear}
                  onChange={(e) => setCreateNextYear(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Create next fiscal year periods</span>
                  <p className="text-xs text-gray-500">Automatically set up periods for FY {parseInt(fiscalYear || '2025') + 1}</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={archiveData}
                  onChange={(e) => setArchiveData(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Archive fiscal year data</span>
                  <p className="text-xs text-gray-500">Create backup archive of all year data</p>
                </div>
              </label>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-orange-800 font-medium mb-2">Critical Year-End Process</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• This is a critical operation that cannot be easily undone</li>
                  <li>• All year-end adjustments should be completed before proceeding</li>
                  <li>• Financial statements should be reviewed and approved</li>
                  <li>• This process may take several minutes to complete</li>
                  <li>• Recommended to perform during off-hours</li>
                  <li>• Backup of database is strongly recommended</li>
                </ul>
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
            onClick={handleClose}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Start Year-End Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. BULK CREATE PERIODS MODAL (Teal Gradient)
// ============================================================================
interface BulkCreatePeriodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (data: any) => void;
}

export function BulkCreatePeriodsModal({ isOpen, onClose, onCreate }: BulkCreatePeriodsModalProps) {
  const [fiscalYear, setFiscalYear] = useState('2025');
  const [fiscalYearStart, setFiscalYearStart] = useState('2025-01-01');
  const [periodType, setPeriodType] = useState('monthly');
  const [namingPattern, setNamingPattern] = useState('month_year');
  const [initialStatus, setInitialStatus] = useState('open');
  const [periodsToCreate, setPeriodsToCreate] = useState(12);

  const handleCreate = () => {
    const data = {
      fiscalYear,
      fiscalYearStart,
      periodType,
      namingPattern,
      initialStatus,
      periodsToCreate
    };
    console.log('Bulk creating periods:', data);
    onCreate?.(data);
    onClose();
  };

  // Calculate periods based on settings
  const previewPeriods = () => {
    const start = new Date(fiscalYearStart);
    const periods = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < Math.min(periodsToCreate, 3); i++) {
      const periodStart = new Date(start);
      if (periodType === 'monthly') {
        periodStart.setMonth(start.getMonth() + i);
        const monthName = monthNames[periodStart.getMonth()];
        periods.push(`${monthName} ${fiscalYear}`);
      } else if (periodType === 'quarterly') {
        periodStart.setMonth(start.getMonth() + (i * 3));
        periods.push(`Q${i + 1} ${fiscalYear}`);
      }
    }
    return periods;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Bulk Create Periods</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Fiscal Year Details */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year *</label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="2024">FY 2024</option>
                <option value="2025">FY 2025</option>
                <option value="2026">FY 2026</option>
                <option value="2027">FY 2027</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year Start Date *</label>
              <input
                type="date"
                value={fiscalYearStart}
                onChange={(e) => setFiscalYearStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Period Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Period Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'monthly', label: 'Monthly', count: 12 },
                { value: 'quarterly', label: 'Quarterly', count: 4 },
                { value: 'yearly', label: 'Yearly', count: 1 }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setPeriodType(type.value);
                    setPeriodsToCreate(type.count);
                  }}
                  className={`p-3 rounded-lg border transition-colors ${
                    periodType === type.value
                      ? 'bg-teal-50 border-teal-300 text-teal-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs mt-1">{type.count} periods</div>
                </button>
              ))}
            </div>
          </div>

          {/* Naming Pattern */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Naming Pattern</label>
            <select
              value={namingPattern}
              onChange={(e) => setNamingPattern(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="month_year">Month Year (e.g., January 2025)</option>
              <option value="short_month_year">Short Month Year (e.g., Jan 2025)</option>
              <option value="quarter_year">Quarter Year (e.g., Q1 2025)</option>
              <option value="numeric">Numeric (e.g., 2025-01)</option>
            </select>
          </div>

          {/* Initial Status */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Initial Status for All Periods</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setInitialStatus('open')}
                className={`p-3 rounded-lg border transition-colors ${
                  initialStatus === 'open'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">🔓 Open</div>
                <div className="text-xs mt-1">Allow transactions</div>
              </button>
              <button
                onClick={() => setInitialStatus('closed')}
                className={`p-3 rounded-lg border transition-colors ${
                  initialStatus === 'closed'
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">🔒 Closed</div>
                <div className="text-xs mt-1">Block transactions</div>
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <h4 className="text-teal-800 font-medium mb-3">📅 Periods to be Created</h4>
            <div className="space-y-2 mb-3">
              {previewPeriods().map((period, index) => (
                <div key={index} className="text-sm text-teal-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span>{period}</span>
                </div>
              ))}
              {periodsToCreate > 3 && (
                <div className="text-sm text-teal-600 pl-8">
                  ... and {periodsToCreate - 3} more periods
                </div>
              )}
            </div>
            <div className="text-sm text-teal-700 border-t border-teal-300 pt-3">
              <p>• Total periods: {periodsToCreate}</p>
              <p>• Period type: {periodType.charAt(0).toUpperCase() + periodType.slice(1)}</p>
              <p>• Status: {initialStatus === 'open' ? 'Open' : 'Closed'}</p>
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
            onClick={handleCreate}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Create {periodsToCreate} Periods
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. PERIOD SETTINGS MODAL (Indigo Gradient)
// ============================================================================
interface PeriodSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: any) => void;
}

export function PeriodSettingsModal({ isOpen, onClose, onSave }: PeriodSettingsModalProps) {
  const [defaultPeriodType, setDefaultPeriodType] = useState('monthly');
  const [autoClosePeriods, setAutoClosePeriods] = useState(false);
  const [daysAfterPeriodEnd, setDaysAfterPeriodEnd] = useState('5');
  const [warnBeforeClose, setWarnBeforeClose] = useState(true);
  const [warningDays, setWarningDays] = useState('3');
  const [allowFutureDating, setAllowFutureDating] = useState(false);
  const [futureDatingLimit, setFutureDatingLimit] = useState('30');
  const [requireApprovalToReopen, setRequireApprovalToReopen] = useState(true);

  const handleSave = () => {
    const settings = {
      defaultPeriodType,
      autoClosePeriods,
      daysAfterPeriodEnd,
      warnBeforeClose,
      warningDays,
      allowFutureDating,
      futureDatingLimit,
      requireApprovalToReopen
    };
    console.log('Saving period settings:', settings);
    onSave?.(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Accounting Period Settings</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Default Settings */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Default Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Period Type</label>
              <select
                value={defaultPeriodType}
                onChange={(e) => setDefaultPeriodType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Auto-Close Settings */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Close Settings</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={autoClosePeriods}
                  onChange={(e) => setAutoClosePeriods(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Automatically close periods</span>
                  <p className="text-xs text-gray-500">Close periods automatically after period end date</p>
                </div>
              </label>

              {autoClosePeriods && (
                <div className="ml-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days after period end to auto-close
                  </label>
                  <input
                    type="number"
                    value={daysAfterPeriodEnd}
                    onChange={(e) => setDaysAfterPeriodEnd(e.target.value)}
                    min="1"
                    max="30"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="ml-2 text-sm text-gray-600">days</span>
                </div>
              )}
            </div>
          </div>

          {/* Warning Settings */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Warning Settings</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={warnBeforeClose}
                  onChange={(e) => setWarnBeforeClose(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Warn before period close</span>
                  <p className="text-xs text-gray-500">Send notifications before auto-closing periods</p>
                </div>
              </label>

              {warnBeforeClose && (
                <div className="ml-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warning days before close
                  </label>
                  <input
                    type="number"
                    value={warningDays}
                    onChange={(e) => setWarningDays(e.target.value)}
                    min="1"
                    max="10"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="ml-2 text-sm text-gray-600">days</span>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Dating */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Dating</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={allowFutureDating}
                  onChange={(e) => setAllowFutureDating(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">Allow future dating</span>
                  <p className="text-xs text-gray-500">Permit transactions with future dates</p>
                </div>
              </label>

              {allowFutureDating && (
                <div className="ml-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Future dating limit
                  </label>
                  <input
                    type="number"
                    value={futureDatingLimit}
                    onChange={(e) => setFutureDatingLimit(e.target.value)}
                    min="1"
                    max="365"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="ml-2 text-sm text-gray-600">days in future</span>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h3>
            <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={requireApprovalToReopen}
                onChange={(e) => setRequireApprovalToReopen(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Require approval to reopen periods</span>
                <p className="text-xs text-gray-500">Closed periods can only be reopened by authorized users</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. PERIOD ADJUSTMENT MODAL (Purple Gradient)
// ============================================================================
interface PeriodAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodId?: string;
  periodName?: string;
  onSave?: (data: any) => void;
}

export function PeriodAdjustmentModal({ isOpen, onClose, periodId, periodName, onSave }: PeriodAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState('accrual');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [debitAccount, setDebitAccount] = useState('');
  const [creditAccount, setCreditAccount] = useState('');
  const [createRecurring, setCreateRecurring] = useState(false);

  const handleSave = () => {
    const adjustment = {
      periodId,
      adjustmentType,
      description,
      amount,
      debitAccount,
      creditAccount,
      createRecurring
    };
    console.log('Creating period adjustment:', adjustment);
    onSave?.(adjustment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Period Adjustment</h2>
              <p className="text-white/80 text-sm">{periodName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Adjustment Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Adjustment Type *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'accrual', label: 'Accrual', desc: 'Revenue/expense recognition' },
                { value: 'prepayment', label: 'Prepayment', desc: 'Prepaid expense amortization' },
                { value: 'depreciation', label: 'Depreciation', desc: 'Asset depreciation' },
                { value: 'provision', label: 'Provision', desc: 'Estimated liability' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setAdjustmentType(type.value)}
                  className={`p-3 rounded-lg border transition-colors text-left ${
                    adjustmentType === type.value
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Monthly depreciation adjustment"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Accounts */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Debit Account *</label>
              <select
                value={debitAccount}
                onChange={(e) => setDebitAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Account</option>
                <option value="6500">6500 - Depreciation Expense</option>
                <option value="5100">5100 - Rent Expense</option>
                <option value="5200">5200 - Insurance Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credit Account *</label>
              <select
                value={creditAccount}
                onChange={(e) => setCreditAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Account</option>
                <option value="1800">1800 - Accumulated Depreciation</option>
                <option value="1400">1400 - Prepaid Rent</option>
                <option value="1450">1450 - Prepaid Insurance</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="mb-3">
            <label className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={createRecurring}
                onChange={(e) => setCreateRecurring(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Create as recurring adjustment</span>
                <p className="text-xs text-gray-500">Automatically post this adjustment every period</p>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h4 className="text-purple-800 font-medium mb-3">📝 Adjustment Entry Preview</h4>
            <div className="space-y-2 text-sm text-purple-700">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium capitalize">{adjustmentType}</span>
              </div>
              <div className="flex justify-between">
                <span>Debit ({debitAccount || 'Not selected'}):</span>
                <span className="font-medium">₹{amount || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Credit ({creditAccount || 'Not selected'}):</span>
                <span className="font-medium">₹{amount || '0.00'}</span>
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
            onClick={handleSave}
            disabled={!description || !amount || !debitAccount || !creditAccount}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}
