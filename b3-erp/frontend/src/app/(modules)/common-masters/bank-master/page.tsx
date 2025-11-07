'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Download, Filter, X, Building2, CreditCard, TrendingUp, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockBanks, Bank, getBankStats } from '@/data/common-masters/banks';

export default function BankMasterPage() {
  const [banks, setBanks] = useState<Bank[]>(mockBanks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPurpose, setFilterPurpose] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleAddBank = () => showToast('Add bank functionality will be implemented', 'info');
  const handleViewBank = (bank: Bank) => showToast(`Viewing bank: ${bank.bankName}`, 'info');
  const handleEditBank = (bank: Bank) => showToast(`Editing bank: ${bank.bankName}`, 'info');
  const handleExport = () => showToast('Exporting banks data...', 'success');
  const handleSync = () => showToast('Syncing bank data...', 'success');

  const filteredData = useMemo(() => {
    return banks.filter(bank => {
      const matchesSearch =
        bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.accountNumber.includes(searchTerm) ||
        bank.ifscCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || bank.accountType === filterType;
      const matchesPurpose = filterPurpose === 'all' || bank.accountPurpose === filterPurpose;

      return matchesSearch && matchesType && matchesPurpose;
    });
  }, [banks, searchTerm, filterType, filterPurpose]);

  const getAccountTypeColor = (type: string) => {
    const colors = {
      'savings': 'bg-blue-100 text-blue-800',
      'current': 'bg-green-100 text-green-800',
      'cash_credit': 'bg-purple-100 text-purple-800',
      'overdraft': 'bg-orange-100 text-orange-800',
      'fixed_deposit': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: Column<Bank>[] = [
    {
      id: 'bank',
      header: 'Bank Details',
      accessor: 'bankName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {row.isPrimaryAccount && <Building2 className="w-4 h-4 text-blue-600" />}
            {value}
          </div>
          <div className="text-xs text-gray-500">{row.branchName}</div>
          <div className="text-xs">
            <span className="font-mono text-blue-600">{row.ifscCode}</span>
          </div>
        </div>
      )
    },
    {
      id: 'account',
      header: 'Account',
      accessor: 'accountNumber',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-mono font-medium text-gray-900">{value}</div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize mt-1 ${getAccountTypeColor(row.accountType)}`}>
            {row.accountType.replace('_', ' ')}
          </span>
        </div>
      )
    },
    {
      id: 'balance',
      header: 'Balance',
      accessor: 'currentBalance',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-semibold text-gray-900">₹{(value / 1000000).toFixed(2)}M</div>
          <div className="text-xs text-green-600">Available: ₹{(row.availableBalance / 1000000).toFixed(2)}M</div>
          {row.overdraftLimit && (
            <div className="text-xs text-purple-600">OD: ₹{(row.overdraftLimit / 1000000).toFixed(2)}M</div>
          )}
        </div>
      )
    },
    {
      id: 'purpose',
      header: 'Purpose',
      accessor: 'accountPurpose',
      sortable: true,
      render: (value) => (
        <div className="text-xs capitalize">
          {value.replace('_', ' ')}
        </div>
      )
    },
    {
      id: 'transactions',
      header: 'Transactions',
      accessor: 'transactionCount',
      sortable: true,
      render: (value, row) => (
        <div className="text-xs">
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-green-600">In: ₹{(row.totalDeposits / 1000000).toFixed(1)}M</div>
          <div className="text-red-600">Out: ₹{(row.totalWithdrawals / 1000000).toFixed(1)}M</div>
        </div>
      )
    },
    {
      id: 'integration',
      header: 'Integration',
      accessor: 'bankIntegrationEnabled',
      sortable: true,
      render: (value, row) => (
        <div className="text-xs">
          {value ? (
            <>
              <div className="text-green-600 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Enabled
              </div>
              {row.autoReconciliation && <div className="text-blue-600">✓ Auto Recon</div>}
              {row.lastSyncDate && <div className="text-gray-500">Sync: {new Date(row.lastSyncDate).toLocaleDateString()}</div>}
            </>
          ) : (
            <div className="text-gray-400">Manual</div>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} text={value ? 'Active' : 'Inactive'} />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={(e) => { e.stopPropagation(); handleViewBank(row); }}>
            View
          </button>
          <button className="text-green-600 hover:text-green-800 text-sm font-medium" onClick={(e) => { e.stopPropagation(); handleEditBank(row); }}>
            Edit
          </button>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterPurpose('all');
  };

  const activeFilterCount = [filterType !== 'all', filterPurpose !== 'all', searchTerm !== ''].filter(Boolean).length;
  const stats = useMemo(() => getBankStats(), [banks]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {toast && (
            <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
              <div className={`rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 ${
                toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {toast.type === 'error' && <XCircle className="w-5 h-5" />}
                {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
                <span className="font-medium">{toast.message}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-7 h-7 text-blue-600" />
                Bank Master
              </h1>
              <p className="text-gray-600 mt-1">Manage bank accounts and payment processing</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSync} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            <span>Sync</span>
          </button>
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button onClick={handleAddBank} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Add Bank</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Banks</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> Total Balance
          </div>
          <div className="text-2xl font-bold text-green-600">₹{(stats.totalBalance / 10000000).toFixed(1)}Cr</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Available</div>
          <div className="text-2xl font-bold text-blue-600">₹{(stats.totalAvailableBalance / 10000000).toFixed(1)}Cr</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Deposits
          </div>
          <div className="text-2xl font-bold text-purple-600">₹{(stats.totalDeposits / 10000000).toFixed(1)}Cr</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Withdrawals</div>
          <div className="text-2xl font-bold text-orange-600">₹{(stats.totalWithdrawals / 10000000).toFixed(1)}Cr</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Integrated
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.withIntegration}/{stats.active}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by bank name, account number, or IFSC..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}>
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">{activeFilterCount}</span>}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="all">All Types</option>
                <option value="current">Current</option>
                <option value="savings">Savings</option>
                <option value="cash_credit">Cash Credit</option>
                <option value="overdraft">Overdraft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
              <select value={filterPurpose} onChange={(e) => setFilterPurpose(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="all">All Purposes</option>
                <option value="operations">Operations</option>
                <option value="payroll">Payroll</option>
                <option value="tax">Tax</option>
                <option value="vendor_payments">Vendor Payments</option>
                <option value="customer_receipts">Customer Receipts</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable data={filteredData} columns={columns} pagination={{ enabled: true, pageSize: 10 }} sorting={{ enabled: true, defaultSort: { column: 'bank', direction: 'asc' } }} emptyMessage="No banks found" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Bank Account Management
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Multiple bank accounts with purpose-based segregation (operations, payroll, tax, etc.)</li>
          <li>✓ Real-time balance tracking with overdraft limit monitoring</li>
          <li>✓ Bank integration for automatic transaction sync and reconciliation</li>
          <li>✓ Transaction limits (daily, single, monthly) for risk management</li>
          <li>✓ Internet banking integration with API endpoints for automated processing</li>
          <li>✓ GST registration and TDS account designation for tax compliance</li>
        </ul>
      </div>
        </div>
      </div>
    </div>
  );
}
