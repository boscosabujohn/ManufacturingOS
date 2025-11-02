import { useState } from 'react';
import { X, Download, Calendar, BarChart3, TrendingUp, TrendingDown, RefreshCw, Search, AlertTriangle, Mail, FileText, Eye } from 'lucide-react';

// 5. Ledger Summary/Analytics Modal (Indigo)
export function LedgerAnalyticsModal({ isOpen, onClose, accountInfo }: any) {
  const analytics = {
    totalDebits: 8500000,
    totalCredits: 7150000,
    netMovement: 1350000,
    transactionCount: 127,
    averageTransactionSize: 122047,
    largestDebit: 850000,
    largestCredit: 650000,
    monthlyTrend: [
      { month: 'Jan', debits: 800000, credits: 650000, net: 150000 },
      { month: 'Feb', debits: 920000, credits: 780000, net: 140000 },
      { month: 'Mar', debits: 1050000, credits: 890000, net: 160000 },
      { month: 'Apr', debits: 980000, credits: 820000, net: 160000 },
      { month: 'May', debits: 1100000, credits: 950000, net: 150000 }
    ],
    byVoucherType: [
      { type: 'Journal Entry', count: 45, amount: 3200000 },
      { type: 'Payment', count: 38, amount: 2850000 },
      { type: 'Receipt', count: 32, amount: 1980000 },
      { type: 'Adjustment', count: 12, amount: 620000 }
    ]
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-white">Ledger Analytics</h2>
            <p className="text-sm text-indigo-200 mt-1">{accountInfo?.accountCode} - {accountInfo?.accountName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700">Total Debits</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹{analytics.totalDebits.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-700">Total Credits</p>
              <p className="text-2xl font-bold text-red-900 mt-1">₹{analytics.totalCredits.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-700">Net Movement</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{analytics.netMovement.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-700">Transactions</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{analytics.transactionCount}</p>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700">Average Transaction</p>
              <p className="text-xl font-bold text-gray-900 mt-1">₹{analytics.averageTransactionSize.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700">Largest Debit</p>
              <p className="text-xl font-bold text-gray-900 mt-1">₹{analytics.largestDebit.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700">Largest Credit</p>
              <p className="text-xl font-bold text-gray-900 mt-1">₹{analytics.largestCredit.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Monthly Trend</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Debits</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Credits</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Net Movement</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlyTrend.map((item, index) => (
                    <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.month}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-700 font-semibold">₹{item.debits.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-700 font-semibold">₹{item.credits.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-right text-blue-700 font-bold">₹{item.net.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* By Voucher Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">By Voucher Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {analytics.byVoucherType.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-gray-700">{item.type}</p>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{item.count} txns</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">₹{item.amount.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Close</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. Print Ledger Modal (Slate)
export function PrintLedgerModal({ isOpen, onClose, onPrint, accountInfo }: any) {
  const [settings, setSettings] = useState({
    orientation: 'portrait',
    pageSize: 'A4',
    includeHeader: true,
    includeFooter: true,
    includePageNumbers: true,
    fontSize: 'normal',
    includeSignature: false,
    signatureName: '',
    signatureDesignation: ''
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Print Ledger</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Account: {accountInfo?.accountCode} - {accountInfo?.accountName}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Orientation</label>
                <select
                  value={settings.orientation}
                  onChange={(e) => setSettings({...settings, orientation: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                <select
                  value={settings.pageSize}
                  onChange={(e) => setSettings({...settings, pageSize: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500"
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Print Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeHeader}
                    onChange={(e) => setSettings({...settings, includeHeader: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Company Header</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeFooter}
                    onChange={(e) => setSettings({...settings, includeFooter: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Footer</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includePageNumbers}
                    onChange={(e) => setSettings({...settings, includePageNumbers: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Page Numbers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeSignature}
                    onChange={(e) => setSettings({...settings, includeSignature: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Signature Section</span>
                </label>
              </div>
            </div>

            {settings.includeSignature && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Signature Name</label>
                  <input
                    type="text"
                    value={settings.signatureName}
                    onChange={(e) => setSettings({...settings, signatureName: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500"
                    placeholder="Authorized Signatory"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={settings.signatureDesignation}
                    onChange={(e) => setSettings({...settings, signatureDesignation: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500"
                    placeholder="Finance Manager"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button
            onClick={() => { console.log('Print Ledger:', settings); onPrint(settings); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
          >
            <FileText className="h-4 w-4" />
            Print Ledger
          </button>
        </div>
      </div>
    </div>
  );
}

// 7. Email Ledger Modal (Cyan)
export function EmailLedgerModal({ isOpen, onClose, onSend, accountInfo }: any) {
  const [formData, setFormData] = useState({
    recipients: '',
    cc: '',
    subject: `Ledger Report - ${accountInfo?.accountName || 'Account'}`,
    message: 'Please find attached the ledger report for your review.',
    format: 'PDF',
    includeAttachments: true
  });

  const isValid = formData.recipients && formData.subject;

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Email Ledger Report</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipients (Email) *</label>
              <input
                type="email"
                multiple
                value={formData.recipients}
                onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="email@example.com, another@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
              <input
                type="email"
                multiple
                value={formData.cc}
                onChange={(e) => setFormData({...formData, cc: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="cc@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({...formData, format: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="Both">Both (PDF & Excel)</option>
              </select>
            </div>

            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
              <p className="text-sm font-medium text-cyan-900">Attachment Preview:</p>
              <p className="text-xs text-cyan-700 mt-1">
                • {accountInfo?.accountCode} - {accountInfo?.accountName} Ledger.{formData.format.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button
            onClick={() => { console.log('Send Email:', formData); onSend(formData); }}
            disabled={!isValid}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

// 8. Ledger Comparison Modal (Orange)
export function CompareLedgerPeriodsModal({ isOpen, onClose, onCompare }: any) {
  const [formData, setFormData] = useState({
    period1Start: '2025-01-01',
    period1End: '2025-01-31',
    period2Start: '2024-01-01',
    period2End: '2024-01-31',
    comparisonType: 'month-over-month',
    showVariance: true,
    showPercentage: true
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Compare Ledger Periods</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comparison Type</label>
              <select
                value={formData.comparisonType}
                onChange={(e) => setFormData({...formData, comparisonType: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="month-over-month">Month over Month</option>
                <option value="quarter-over-quarter">Quarter over Quarter</option>
                <option value="year-over-year">Year over Year</option>
                <option value="custom">Custom Period</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border-r pr-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Period 1 (Current)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.period1Start}
                      onChange={(e) => setFormData({...formData, period1Start: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.period1End}
                      onChange={(e) => setFormData({...formData, period1End: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pl-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Period 2 (Comparison)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.period2Start}
                      onChange={(e) => setFormData({...formData, period2Start: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.period2End}
                      onChange={(e) => setFormData({...formData, period2End: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.showVariance}
                    onChange={(e) => setFormData({...formData, showVariance: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Show Variance (Difference)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.showPercentage}
                    onChange={(e) => setFormData({...formData, showPercentage: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Show Percentage Change</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button
            onClick={() => { console.log('Compare Periods:', formData); onCompare(formData); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <BarChart3 className="h-4 w-4" />
            Compare Periods
          </button>
        </div>
      </div>
    </div>
  );
}

// Export all modals
export {
  LedgerAnalyticsModal,
  PrintLedgerModal,
  EmailLedgerModal,
  CompareLedgerPeriodsModal
};
