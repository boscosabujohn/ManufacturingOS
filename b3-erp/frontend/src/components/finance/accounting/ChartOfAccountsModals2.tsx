import { useState } from 'react';
import { X, Download, Copy, Archive, Eye, Search, Filter, BarChart3, TrendingUp, FileText, AlertTriangle } from 'lucide-react';

// 6. Export Chart of Accounts Modal (Emerald)
export function ExportChartModal({ isOpen, onClose, onExport }: any) {
  const [settings, setSettings] = useState({
    format: 'Excel',
    includeInactive: false,
    includeBalances: true,
    includeOpeningBalances: true,
    includeChildren: true,
    accountTypes: {
      assets: true,
      liabilities: true,
      equity: true,
      income: true,
      expenses: true
    },
    detailLevel: 'all'
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Export Chart of Accounts</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
              <select
                value={settings.format}
                onChange={(e) => setSettings({...settings, format: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Excel">Excel (.xlsx)</option>
                <option value="CSV">CSV (.csv)</option>
                <option value="PDF">PDF Document</option>
                <option value="JSON">JSON (API Format)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Include Account Types</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(settings.accountTypes).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSettings({
                        ...settings,
                        accountTypes: {...settings.accountTypes, [key]: e.target.checked}
                      })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeInactive}
                    onChange={(e) => setSettings({...settings, includeInactive: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Inactive Accounts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeBalances}
                    onChange={(e) => setSettings({...settings, includeBalances: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Current Balances</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeOpeningBalances}
                    onChange={(e) => setSettings({...settings, includeOpeningBalances: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Opening Balances</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.includeChildren}
                    onChange={(e) => setSettings({...settings, includeChildren: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Parent-Child Hierarchy</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detail Level</label>
              <select
                value={settings.detailLevel}
                onChange={(e) => setSettings({...settings, detailLevel: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Levels (Complete Hierarchy)</option>
                <option value="top">Top Level Only</option>
                <option value="leaf">Leaf Accounts Only (No Parents)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button
            onClick={() => { console.log('Export Chart:', settings); onExport(settings); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

// 7. Account Hierarchy Viewer Modal (Indigo)
export function AccountHierarchyModal({ isOpen, onClose }: any) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1000', '2000']));

  const toggleNode = (code: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedNodes(newExpanded);
  };

  const hierarchyData = [
    {
      code: '1000',
      name: 'Current Assets',
      balance: 1500000,
      children: [
        {
          code: '1010',
          name: 'Cash and Cash Equivalents',
          balance: 500000,
          children: [
            { code: '1011', name: 'Cash in Hand', balance: 50000 },
            { code: '1012', name: 'Cash at Bank - HDFC', balance: 350000 },
            { code: '1013', name: 'Cash at Bank - ICICI', balance: 100000 }
          ]
        },
        {
          code: '1020',
          name: 'Accounts Receivable',
          balance: 450000,
          children: [
            { code: '1021', name: 'Trade Receivables - Domestic', balance: 350000 },
            { code: '1022', name: 'Trade Receivables - Export', balance: 100000 }
          ]
        }
      ]
    },
    {
      code: '2000',
      name: 'Current Liabilities',
      balance: 825000,
      children: [
        {
          code: '2010',
          name: 'Accounts Payable',
          balance: 450000,
          children: [
            { code: '2011', name: 'Trade Payables - Domestic', balance: 350000 },
            { code: '2012', name: 'Trade Payables - Import', balance: 100000 }
          ]
        }
      ]
    }
  ];

  const renderNode = (node: any, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.code);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.code}>
        <div
          className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded"
          style={{ paddingLeft: `${level * 24 + 8}px` }}
        >
          <div className="flex items-center gap-2 flex-1" onClick={() => hasChildren && toggleNode(node.code)}>
            {hasChildren ? (
              <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
            ) : (
              <span className="w-4"></span>
            )}
            <span className="font-mono text-sm text-gray-600">{node.code}</span>
            <span className="text-sm text-gray-900">{node.name}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">₹{node.balance.toLocaleString('en-IN')}</span>
        </div>
        {isExpanded && hasChildren && node.children.map((child: any) => renderNode(child, level + 1))}
      </div>
    );
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Account Hierarchy</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-600">Click on parent accounts to expand/collapse</p>
            <div className="flex gap-2">
              <button
                onClick={() => setExpandedNodes(new Set(hierarchyData.flatMap(n => [n.code, ...(n.children?.map(c => c.code) || [])])))}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Expand All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setExpandedNodes(new Set())}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>
          <div className="border rounded-lg divide-y">
            {hierarchyData.map(node => renderNode(node))}
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Close</button>
        </div>
      </div>
    </div>
  );
}

// 8. View Transactions for Account Modal (Slate)
export function ViewAccountTransactionsModal({ isOpen, onClose, account }: any) {
  const mockTransactions = [
    { id: 'T001', date: '2025-10-18', type: 'Journal Entry', ref: 'JE-2025-045', description: 'Customer payment received', debit: 125000, credit: 0, balance: 475000 },
    { id: 'T002', date: '2025-10-17', type: 'Payment', ref: 'PMT-2025-132', description: 'Vendor payment - ABC Suppliers', debit: 0, credit: 85000, balance: 350000 },
    { id: 'T003', date: '2025-10-16', type: 'Invoice', ref: 'INV-2025-289', description: 'Sales invoice to XYZ Corp', debit: 245000, credit: 0, balance: 435000 },
    { id: 'T004', date: '2025-10-15', type: 'Receipt', ref: 'RCT-2025-156', description: 'Receipt from customer', debit: 180000, credit: 0, balance: 190000 },
    { id: 'T005', date: '2025-10-14', type: 'Journal Entry', ref: 'JE-2025-044', description: 'Depreciation adjustment', debit: 0, credit: 65000, balance: 10000 }
  ];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Account Transactions</h2>
            <p className="text-sm text-slate-200 mt-1">{account?.code} - {account?.name}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reference</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Debit</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Credit</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Balance</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((txn, index) => (
                  <tr key={txn.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                    <td className="px-4 py-3 text-sm text-gray-900">{txn.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{txn.type}</td>
                    <td className="px-4 py-3 text-sm font-mono text-blue-600">{txn.ref}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{txn.description}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-700">
                      {txn.debit > 0 ? `₹${txn.debit.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-red-700">
                      {txn.credit > 0 ? `₹${txn.credit.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                      ₹{txn.balance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-700 font-medium">
            <Download className="h-4 w-4" />
            Export to Excel
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800">Close</button>
        </div>
      </div>
    </div>
  );
}

// 9. Map Account to External System Modal (Yellow)
export function MapAccountModal({ isOpen, onClose, onSave, account }: any) {
  const [mappings, setMappings] = useState({
    tally: '',
    quickbooks: '',
    sap: '',
    custom1: '',
    custom2: ''
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Map Account to External Systems</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Mapping: {account?.code} - {account?.name}</p>
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tally Account Code</label>
              <input
                type="text"
                value={mappings.tally}
                onChange={(e) => setMappings({...mappings, tally: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter Tally account code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QuickBooks Account ID</label>
              <input
                type="text"
                value={mappings.quickbooks}
                onChange={(e) => setMappings({...mappings, quickbooks: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter QuickBooks account ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SAP G/L Account</label>
              <input
                type="text"
                value={mappings.sap}
                onChange={(e) => setMappings({...mappings, sap: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter SAP G/L account"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom System 1</label>
              <input
                type="text"
                value={mappings.custom1}
                onChange={(e) => setMappings({...mappings, custom1: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter custom system 1 code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom System 2</label>
              <input
                type="text"
                value={mappings.custom2}
                onChange={(e) => setMappings({...mappings, custom2: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter custom system 2 code"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button
            onClick={() => { console.log('Save Mappings:', mappings); onSave(mappings); }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Save Mappings
          </button>
        </div>
      </div>
    </div>
  );
}

// 10. Account Validation Modal (Pink)
export function AccountValidationModal({ isOpen, onClose }: any) {
  const validationResults = [
    { type: 'error', account: '1012', issue: 'Duplicate account code', details: 'Account code already exists in the system' },
    { type: 'warning', account: '2025', issue: 'High balance variance', details: 'Balance differs from expected by 15%' },
    { type: 'error', account: '5011', issue: 'Invalid parent reference', details: 'Parent account 5010 does not exist' },
    { type: 'warning', account: '1033', issue: 'Inactive with balance', details: 'Inactive account has non-zero balance' },
    { type: 'info', account: '4021', issue: 'No transactions', details: 'Account created but no transactions posted' }
  ];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Account Validation Report</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-700">Errors</p>
              <p className="text-3xl font-bold text-red-900 mt-1">2</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-700">Warnings</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">2</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-700">Info</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">1</p>
            </div>
          </div>

          <div className="space-y-3">
            {validationResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.type === 'error' ? 'bg-red-50 border-red-500' :
                  result.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold text-gray-900">{result.account}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        result.type === 'error' ? 'bg-red-100 text-red-700' :
                        result.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {result.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{result.issue}</p>
                    <p className="text-xs text-gray-600 mt-1">{result.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-pink-600 hover:text-pink-700 font-medium">
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Close</button>
        </div>
      </div>
    </div>
  );
}

// 11. Filter Accounts Modal (Violet)
export function FilterAccountsModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({
    accountType: 'all',
    status: 'all',
    balanceRange: 'all',
    parentAccount: '',
    searchText: '',
    hasTransactions: 'all',
    reconciled: 'all'
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-3 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Filter Accounts</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select
                value={filters.accountType}
                onChange={(e) => setFilters({...filters, accountType: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Types</option>
                <option value="Assets">Assets</option>
                <option value="Liabilities">Liabilities</option>
                <option value="Equity">Equity</option>
                <option value="Income">Income</option>
                <option value="Expenses">Expenses</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balance Range</label>
              <select
                value={filters.balanceRange}
                onChange={(e) => setFilters({...filters, balanceRange: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Balances</option>
                <option value="zero">Zero Balance</option>
                <option value="positive">Positive Balance</option>
                <option value="negative">Negative Balance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Has Transactions</label>
              <select
                value={filters.hasTransactions}
                onChange={(e) => setFilters({...filters, hasTransactions: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Accounts</option>
                <option value="yes">With Transactions</option>
                <option value="no">No Transactions</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Text</label>
              <input
                type="text"
                value={filters.searchText}
                onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                placeholder="Search by code or name..."
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-3 py-2 flex justify-between border-t">
          <button
            onClick={() => setFilters({ accountType: 'all', status: 'all', balanceRange: 'all', parentAccount: '', searchText: '', hasTransactions: 'all', reconciled: 'all' })}
            className="px-4 py-2 text-violet-600 hover:text-violet-700 font-medium"
          >
            Clear Filters
          </button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
            <button
              onClick={() => { console.log('Apply Filters:', filters); onApply(filters); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
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
