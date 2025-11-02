import { useState } from 'react';
import { X, Download, Filter, Search, Eye, CheckCircle, XCircle, AlertTriangle, Calendar, FileText, TrendingUp, TrendingDown, BarChart3, RefreshCw, Printer, Mail } from 'lucide-react';

// 1. View Ledger Entry Details Modal (Blue)
export function ViewLedgerEntryModal({ isOpen, onClose, entry }: any) {
  const mockEntry = entry || {
    id: 'GL001',
    date: '2025-01-02',
    voucherNumber: 'PMT-2025-001',
    voucherType: 'Payment',
    description: 'Payment to ABC Suppliers for Invoice INV-2024-125',
    debit: 0,
    credit: 250000,
    balance: 14250000,
    costCenter: 'CC-OPS-001',
    costCenterName: 'Operations',
    department: 'Operations',
    project: 'PRJ-2024-015',
    projectName: 'Hotel Paradise Installation',
    reconciled: true,
    reconciledDate: '2025-01-05',
    reconciledBy: 'Finance Team',
    createdBy: 'John Accountant',
    createdDate: '2025-01-02 10:30 AM',
    approvedBy: 'Sarah Manager',
    approvedDate: '2025-01-02 11:15 AM',
    tags: ['Vendor Payment', 'Operations'],
    attachments: ['invoice_125.pdf', 'payment_receipt.pdf']
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">Ledger Entry Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-700">Voucher Number</p>
              <p className="text-lg font-bold text-blue-900 mt-1">{mockEntry.voucherNumber}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700">Debit</p>
              <p className="text-lg font-bold text-green-900 mt-1">₹{mockEntry.debit.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-700">Credit</p>
              <p className="text-lg font-bold text-red-900 mt-1">₹{mockEntry.credit.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-700">Balance</p>
              <p className="text-lg font-bold text-purple-900 mt-1">₹{mockEntry.balance.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Entry Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">Entry Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-sm font-medium text-gray-600">Date</dt>
                  <dd className="text-sm font-semibold text-gray-900">{mockEntry.date}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-sm font-medium text-gray-600">Voucher Type</dt>
                  <dd>
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {mockEntry.voucherType}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-sm font-medium text-gray-600">Cost Center</dt>
                  <dd className="text-sm font-semibold text-gray-900">{mockEntry.costCenterName}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-sm font-medium text-gray-600">Department</dt>
                  <dd className="text-sm font-semibold text-gray-900">{mockEntry.department}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm font-medium text-gray-600">Project</dt>
                  <dd className="text-sm font-semibold text-gray-900">{mockEntry.projectName}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">Tracking & Audit</h3>
              <dl className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-sm font-medium text-gray-600">Reconciled</dt>
                  <dd>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      mockEntry.reconciled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {mockEntry.reconciled ? 'Yes' : 'No'}
                    </span>
                  </dd>
                </div>
                {mockEntry.reconciled && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-sm font-medium text-gray-600">Reconciled Date</dt>
                      <dd className="text-sm font-semibold text-gray-900">{mockEntry.reconciledDate}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-sm font-medium text-gray-600">Reconciled By</dt>
                      <dd className="text-sm font-semibold text-gray-900">{mockEntry.reconciledBy}</dd>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-sm font-medium text-gray-600">Created By</dt>
                  <dd className="text-sm font-semibold text-gray-900">{mockEntry.createdBy}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-sm font-medium text-gray-600">Created Date</dt>
                  <dd className="text-sm font-semibold text-gray-900">{mockEntry.createdDate}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-sm font-medium text-gray-600">Approved By</dt>
                  <dd className="text-sm font-semibold text-gray-900">{mockEntry.approvedBy}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm font-medium text-gray-600">Approved Date</dt>
                  <dd className="text-sm font-semibold text-gray-900">{mockEntry.approvedDate}</dd>
                </div>
              </dl>
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{mockEntry.description}</p>
            </div>

            {mockEntry.tags && mockEntry.tags.length > 0 && (
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {mockEntry.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mockEntry.attachments && mockEntry.attachments.length > 0 && (
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Attachments</h3>
                <div className="space-y-2">
                  {mockEntry.attachments.map((file: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file}</span>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Close</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Filter Ledger Modal (Purple)
export function FilterLedgerModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    voucherType: 'all',
    minAmount: '',
    maxAmount: '',
    costCenter: '',
    department: '',
    project: '',
    reconciledOnly: false,
    unreconciledOnly: false,
    searchText: ''
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Filter Ledger Entries</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Type</label>
              <select
                value={filters.voucherType}
                onChange={(e) => setFilters({...filters, voucherType: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
              <select
                value={filters.costCenter}
                onChange={(e) => setFilters({...filters, costCenter: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Cost Centers</option>
                <option value="CC-OPS-001">Operations</option>
                <option value="CC-SAL-001">Sales</option>
                <option value="CC-FIN-001">Finance</option>
                <option value="CC-PRD-001">Production</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Production">Production</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={filters.project}
                onChange={(e) => setFilters({...filters, project: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Projects</option>
                <option value="PRJ-2024-015">Hotel Paradise Installation</option>
                <option value="PRJ-2024-023">Restaurant Modernization</option>
                <option value="PRJ-2025-002">Cold Storage Unit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Text</label>
              <input
                type="text"
                value={filters.searchText}
                onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Search by description, voucher number..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reconciliation Status</label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.reconciledOnly}
                    onChange={(e) => setFilters({...filters, reconciledOnly: e.target.checked, unreconciledOnly: e.target.checked ? false : filters.unreconciledOnly})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Reconciled Only</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.unreconciledOnly}
                    onChange={(e) => setFilters({...filters, unreconciledOnly: e.target.checked, reconciledOnly: e.target.checked ? false : filters.reconciledOnly})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Unreconciled Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t sticky bottom-0">
          <button
            onClick={() => setFilters({ startDate: '2025-01-01', endDate: '2025-01-31', voucherType: 'all', minAmount: '', maxAmount: '', costCenter: '', department: '', project: '', reconciledOnly: false, unreconciledOnly: false, searchText: '' })}
            className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear Filters
          </button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
            <button
              onClick={() => { console.log('Apply Filters:', filters); onApply(filters); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Export Ledger Modal (Emerald)
export function ExportLedgerModal({ isOpen, onClose, onExport, accountInfo }: any) {
  const [settings, setSettings] = useState({
    format: 'Excel',
    includeOpeningBalance: true,
    includeClosingBalance: true,
    includeReconciled: true,
    includeUnreconciled: true,
    groupBy: 'none',
    sortBy: 'date',
    sortOrder: 'asc',
    includeSummary: true,
    includeCharts: false
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Export General Ledger</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Account: {accountInfo?.accountCode} - {accountInfo?.accountName}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
              <select
                value={settings.format}
                onChange={(e) => setSettings({...settings, format: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Excel">Excel (.xlsx)</option>
                <option value="CSV">CSV (.csv)</option>
                <option value="PDF">PDF Report</option>
                <option value="JSON">JSON</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
                <select
                  value={settings.groupBy}
                  onChange={(e) => setSettings({...settings, groupBy: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="none">No Grouping</option>
                  <option value="month">By Month</option>
                  <option value="quarter">By Quarter</option>
                  <option value="voucherType">By Voucher Type</option>
                  <option value="costCenter">By Cost Center</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={settings.sortBy}
                  onChange={(e) => setSettings({...settings, sortBy: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="voucherNumber">Voucher Number</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeOpeningBalance}
                    onChange={(e) => setSettings({...settings, includeOpeningBalance: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Opening Balance</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeClosingBalance}
                    onChange={(e) => setSettings({...settings, includeClosingBalance: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Closing Balance</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeSummary}
                    onChange={(e) => setSettings({...settings, includeSummary: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Summary Page</span>
                </label>
                {settings.format === 'PDF' && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.includeCharts}
                      onChange={(e) => setSettings({...settings, includeCharts: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Include Charts (PDF Only)</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button
            onClick={() => { console.log('Export Ledger:', settings); onExport(settings); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            Export Ledger
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Reconcile Entry Modal (Green)
export function ReconcileEntryModal({ isOpen, onClose, onReconcile, entry }: any) {
  const [formData, setFormData] = useState({
    reconciledDate: new Date().toISOString().split('T')[0],
    reconciledAmount: entry?.credit || entry?.debit || 0,
    bankStatementReference: '',
    notes: '',
    attachStatement: false
  });

  const isValid = formData.reconciledDate && formData.reconciledAmount > 0;

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Reconcile Entry</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-blue-700">Voucher Number</p>
                <p className="text-sm font-semibold text-blue-900">{entry?.voucherNumber}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700">Date</p>
                <p className="text-sm font-semibold text-blue-900">{entry?.date}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700">Description</p>
                <p className="text-sm font-semibold text-blue-900">{entry?.description}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700">Amount</p>
                <p className="text-sm font-semibold text-blue-900">
                  ₹{((entry?.debit || 0) + (entry?.credit || 0)).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reconciled Date *</label>
                <input
                  type="date"
                  value={formData.reconciledDate}
                  onChange={(e) => setFormData({...formData, reconciledDate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reconciled Amount *</label>
                <input
                  type="number"
                  value={formData.reconciledAmount}
                  onChange={(e) => setFormData({...formData, reconciledAmount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Statement Reference</label>
              <input
                type="text"
                value={formData.bankStatementReference}
                onChange={(e) => setFormData({...formData, bankStatementReference: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Statement #202501, Line 45"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reconciliation Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Add any notes about this reconciliation..."
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.attachStatement}
                onChange={(e) => setFormData({...formData, attachStatement: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-900">Attach Bank Statement (Optional)</span>
            </label>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button
            onClick={() => { console.log('Reconcile Entry:', formData); onReconcile(formData); }}
            disabled={!isValid}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Reconciled
          </button>
        </div>
      </div>
    </div>
  );
}

// Continue in next file due to length...
