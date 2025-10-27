'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Edit, Trash2, ChevronDown, ChevronRight, DollarSign,
  Building, CreditCard, TrendingUp, ShoppingBag, Briefcase, AlertCircle,
  CheckCircle, Eye, Filter, Download, XCircle, Power, PowerOff, FileText,
  Copy, Archive, BarChart3, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';

// TypeScript Interfaces
interface Account {
  code: string;
  name: string;
  type: 'Assets' | 'Liabilities' | 'Equity' | 'Income' | 'Expenses';
  parentCode?: string;
  balance: number;
  debitBalance: number;
  creditBalance: number;
  isActive: boolean;
  description?: string;
  children?: Account[];
  level: number;
  hasChildren: boolean;
}

// Mock Accounts Data - Indian Chart of Accounts Structure
const mockAccounts: Account[] = [
  // Assets (1000-1999)
  { code: '1000', name: 'Current Assets', type: 'Assets', balance: 1500000, debitBalance: 1500000, creditBalance: 0, isActive: true, level: 0, hasChildren: true, description: 'Short-term assets' },
  { code: '1010', name: 'Cash and Cash Equivalents', type: 'Assets', parentCode: '1000', balance: 500000, debitBalance: 500000, creditBalance: 0, isActive: true, level: 1, hasChildren: true },
  { code: '1011', name: 'Cash in Hand', type: 'Assets', parentCode: '1010', balance: 50000, debitBalance: 50000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '1012', name: 'Cash at Bank - HDFC Current Account', type: 'Assets', parentCode: '1010', balance: 350000, debitBalance: 350000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '1013', name: 'Cash at Bank - ICICI Savings Account', type: 'Assets', parentCode: '1010', balance: 100000, debitBalance: 100000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '1020', name: 'Accounts Receivable', type: 'Assets', parentCode: '1000', balance: 450000, debitBalance: 450000, creditBalance: 0, isActive: true, level: 1, hasChildren: true },
  { code: '1021', name: 'Trade Receivables - Domestic', type: 'Assets', parentCode: '1020', balance: 350000, debitBalance: 350000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '1022', name: 'Trade Receivables - Export', type: 'Assets', parentCode: '1020', balance: 100000, debitBalance: 100000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '1030', name: 'Inventory', type: 'Assets', parentCode: '1000', balance: 550000, debitBalance: 550000, creditBalance: 0, isActive: true, level: 1, hasChildren: true },
  { code: '1031', name: 'Raw Materials', type: 'Assets', parentCode: '1030', balance: 250000, debitBalance: 250000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '1032', name: 'Work in Progress', type: 'Assets', parentCode: '1030', balance: 150000, debitBalance: 150000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '1033', name: 'Finished Goods', type: 'Assets', parentCode: '1030', balance: 150000, debitBalance: 150000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },

  { code: '1500', name: 'Fixed Assets', type: 'Assets', balance: 2750000, debitBalance: 3000000, creditBalance: 250000, isActive: true, level: 0, hasChildren: true, description: 'Long-term assets' },
  { code: '1510', name: 'Property, Plant & Equipment', type: 'Assets', parentCode: '1500', balance: 2750000, debitBalance: 3000000, creditBalance: 250000, isActive: true, level: 1, hasChildren: true },
  { code: '1511', name: 'Land and Building', type: 'Assets', parentCode: '1510', balance: 1500000, debitBalance: 1500000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '1512', name: 'Plant and Machinery', type: 'Assets', parentCode: '1510', balance: 800000, debitBalance: 1000000, creditBalance: 200000, isActive: true, level: 2, hasChildren: false },
  { code: '1513', name: 'Furniture and Fixtures', type: 'Assets', parentCode: '1510', balance: 180000, debitBalance: 200000, creditBalance: 20000, isActive: true, level: 2, hasChildren: false },
  { code: '1514', name: 'Vehicles', type: 'Assets', parentCode: '1510', balance: 270000, debitBalance: 300000, creditBalance: 30000, isActive: true, level: 2, hasChildren: false },

  // Liabilities (2000-2999)
  { code: '2000', name: 'Current Liabilities', type: 'Liabilities', balance: 825000, debitBalance: 0, creditBalance: 825000, isActive: true, level: 0, hasChildren: true, description: 'Short-term obligations' },
  { code: '2010', name: 'Accounts Payable', type: 'Liabilities', parentCode: '2000', balance: 450000, debitBalance: 0, creditBalance: 450000, isActive: true, level: 1, hasChildren: true },
  { code: '2011', name: 'Trade Payables - Domestic', type: 'Liabilities', parentCode: '2010', balance: 350000, debitBalance: 0, creditBalance: 350000, isActive: true, level: 2, hasChildren: false },
  { code: '2012', name: 'Trade Payables - Import', type: 'Liabilities', parentCode: '2010', balance: 100000, debitBalance: 0, creditBalance: 100000, isActive: true, level: 2, hasChildren: false },
  { code: '2020', name: 'Statutory Liabilities', type: 'Liabilities', parentCode: '2000', balance: 175000, debitBalance: 0, creditBalance: 175000, isActive: true, level: 1, hasChildren: true },
  { code: '2021', name: 'GST Payable - CGST', type: 'Liabilities', parentCode: '2020', balance: 50000, debitBalance: 0, creditBalance: 50000, isActive: true, level: 2, hasChildren: false },
  { code: '2022', name: 'GST Payable - SGST', type: 'Liabilities', parentCode: '2020', balance: 50000, debitBalance: 0, creditBalance: 50000, isActive: true, level: 2, hasChildren: false },
  { code: '2023', name: 'GST Payable - IGST', type: 'Liabilities', parentCode: '2020', balance: 25000, debitBalance: 0, creditBalance: 25000, isActive: true, level: 2, hasChildren: false },
  { code: '2024', name: 'TDS Payable', type: 'Liabilities', parentCode: '2020', balance: 35000, debitBalance: 0, creditBalance: 35000, isActive: true, level: 2, hasChildren: false },
  { code: '2025', name: 'PF Payable', type: 'Liabilities', parentCode: '2020', balance: 15000, debitBalance: 0, creditBalance: 15000, isActive: true, level: 2, hasChildren: false },
  { code: '2030', name: 'Accrued Expenses', type: 'Liabilities', parentCode: '2000', balance: 200000, debitBalance: 0, creditBalance: 200000, isActive: true, level: 1, hasChildren: true },
  { code: '2031', name: 'Salary Payable', type: 'Liabilities', parentCode: '2030', balance: 150000, debitBalance: 0, creditBalance: 150000, isActive: true, level: 2, hasChildren: false },
  { code: '2032', name: 'Interest Payable', type: 'Liabilities', parentCode: '2030', balance: 50000, debitBalance: 0, creditBalance: 50000, isActive: true, level: 2, hasChildren: false },

  { code: '2500', name: 'Long-term Liabilities', type: 'Liabilities', balance: 1500000, debitBalance: 0, creditBalance: 1500000, isActive: true, level: 0, hasChildren: true, description: 'Long-term obligations' },
  { code: '2510', name: 'Term Loans', type: 'Liabilities', parentCode: '2500', balance: 1200000, debitBalance: 0, creditBalance: 1200000, isActive: true, level: 1, hasChildren: false },
  { code: '2520', name: 'Debentures', type: 'Liabilities', parentCode: '2500', balance: 300000, debitBalance: 0, creditBalance: 300000, isActive: true, level: 1, hasChildren: false },

  // Equity (3000-3999)
  { code: '3000', name: 'Owner\'s Equity', type: 'Equity', balance: 2000000, debitBalance: 0, creditBalance: 2000000, isActive: true, level: 0, hasChildren: true, description: 'Shareholder equity' },
  { code: '3010', name: 'Share Capital', type: 'Equity', parentCode: '3000', balance: 1000000, debitBalance: 0, creditBalance: 1000000, isActive: true, level: 1, hasChildren: true },
  { code: '3011', name: 'Equity Share Capital', type: 'Equity', parentCode: '3010', balance: 800000, debitBalance: 0, creditBalance: 800000, isActive: true, level: 2, hasChildren: false },
  { code: '3012', name: 'Preference Share Capital', type: 'Equity', parentCode: '3010', balance: 200000, debitBalance: 0, creditBalance: 200000, isActive: true, level: 2, hasChildren: false },
  { code: '3020', name: 'Reserves and Surplus', type: 'Equity', parentCode: '3000', balance: 1000000, debitBalance: 0, creditBalance: 1000000, isActive: true, level: 1, hasChildren: true },
  { code: '3021', name: 'General Reserve', type: 'Equity', parentCode: '3020', balance: 500000, debitBalance: 0, creditBalance: 500000, isActive: true, level: 2, hasChildren: false },
  { code: '3022', name: 'Retained Earnings', type: 'Equity', parentCode: '3020', balance: 500000, debitBalance: 0, creditBalance: 500000, isActive: true, level: 2, hasChildren: false },

  // Income (4000-4999)
  { code: '4000', name: 'Revenue', type: 'Income', balance: 3500000, debitBalance: 0, creditBalance: 3500000, isActive: true, level: 0, hasChildren: true, description: 'Operating income' },
  { code: '4010', name: 'Sales Revenue', type: 'Income', parentCode: '4000', balance: 3200000, debitBalance: 0, creditBalance: 3200000, isActive: true, level: 1, hasChildren: true },
  { code: '4011', name: 'Domestic Sales', type: 'Income', parentCode: '4010', balance: 2400000, debitBalance: 0, creditBalance: 2400000, isActive: true, level: 2, hasChildren: false },
  { code: '4012', name: 'Export Sales', type: 'Income', parentCode: '4010', balance: 800000, debitBalance: 0, creditBalance: 800000, isActive: true, level: 2, hasChildren: false },
  { code: '4020', name: 'Other Income', type: 'Income', parentCode: '4000', balance: 300000, debitBalance: 0, creditBalance: 300000, isActive: true, level: 1, hasChildren: true },
  { code: '4021', name: 'Interest Income', type: 'Income', parentCode: '4020', balance: 150000, debitBalance: 0, creditBalance: 150000, isActive: true, level: 2, hasChildren: false },
  { code: '4022', name: 'Dividend Income', type: 'Income', parentCode: '4020', balance: 100000, debitBalance: 0, creditBalance: 100000, isActive: true, level: 2, hasChildren: false },
  { code: '4023', name: 'Miscellaneous Income', type: 'Income', parentCode: '4020', balance: 50000, debitBalance: 0, creditBalance: 50000, isActive: true, level: 2, hasChildren: false },

  // Expenses (5000-5999)
  { code: '5000', name: 'Operating Expenses', type: 'Expenses', balance: 2100000, debitBalance: 2100000, creditBalance: 0, isActive: true, level: 0, hasChildren: true, description: 'Cost of operations' },
  { code: '5010', name: 'Cost of Goods Sold', type: 'Expenses', parentCode: '5000', balance: 1200000, debitBalance: 1200000, creditBalance: 0, isActive: true, level: 1, hasChildren: true },
  { code: '5011', name: 'Raw Material Consumed', type: 'Expenses', parentCode: '5010', balance: 800000, debitBalance: 800000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5012', name: 'Direct Labor', type: 'Expenses', parentCode: '5010', balance: 300000, debitBalance: 300000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5013', name: 'Manufacturing Overhead', type: 'Expenses', parentCode: '5010', balance: 100000, debitBalance: 100000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5020', name: 'Administrative Expenses', type: 'Expenses', parentCode: '5000', balance: 400000, debitBalance: 400000, creditBalance: 0, isActive: true, level: 1, hasChildren: true },
  { code: '5021', name: 'Salary - Administrative', type: 'Expenses', parentCode: '5020', balance: 250000, debitBalance: 250000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5022', name: 'Office Rent', type: 'Expenses', parentCode: '5020', balance: 80000, debitBalance: 80000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5023', name: 'Office Supplies', type: 'Expenses', parentCode: '5020', balance: 40000, debitBalance: 40000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5024', name: 'Utilities', type: 'Expenses', parentCode: '5020', balance: 30000, debitBalance: 30000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5030', name: 'Selling and Distribution Expenses', type: 'Expenses', parentCode: '5000', balance: 300000, debitBalance: 300000, creditBalance: 0, isActive: true, level: 1, hasChildren: true },
  { code: '5031', name: 'Marketing Expenses', type: 'Expenses', parentCode: '5030', balance: 150000, debitBalance: 150000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5032', name: 'Sales Commission', type: 'Expenses', parentCode: '5030', balance: 100000, debitBalance: 100000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5033', name: 'Transportation', type: 'Expenses', parentCode: '5030', balance: 50000, debitBalance: 50000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5040', name: 'Financial Expenses', type: 'Expenses', parentCode: '5000', balance: 200000, debitBalance: 200000, creditBalance: 0, isActive: true, level: 1, hasChildren: true },
  { code: '5041', name: 'Interest Expense', type: 'Expenses', parentCode: '5040', balance: 150000, debitBalance: 150000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5042', name: 'Bank Charges', type: 'Expenses', parentCode: '5040', balance: 30000, debitBalance: 30000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
  { code: '5043', name: 'Depreciation', type: 'Expenses', parentCode: '5040', balance: 20000, debitBalance: 20000, creditBalance: 0, isActive: true, level: 2, hasChildren: false },
];

export default function ChartOfAccountsPage() {
  const router = useRouter();
  const [accounts] = useState<Account[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1000', '2000', '3000', '4000', '5000']));

  // Build tree structure
  const buildTree = (accounts: Account[]): Account[] => {
    const accountMap = new Map<string, Account>();
    const tree: Account[] = [];

    // Create map
    accounts.forEach((account) => {
      accountMap.set(account.code, { ...account, children: [] });
    });

    // Build tree
    accountMap.forEach((account) => {
      if (account.parentCode) {
        const parent = accountMap.get(account.parentCode);
        if (parent) {
          parent.children!.push(account);
        }
      } else {
        tree.push(account);
      }
    });

    return tree;
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || account.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? account.isActive : !account.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const accountTree = buildTree(filteredAccounts);

  // Statistics
  const stats = {
    totalAccounts: accounts.length,
    assetsAccounts: accounts.filter((a) => a.type === 'Assets' && a.level === 0).length,
    liabilitiesAccounts: accounts.filter((a) => a.type === 'Liabilities' && a.level === 0).length,
    activeAccounts: accounts.filter((a) => a.isActive).length,
  };

  const typeConfig = {
    Assets: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Building },
    Liabilities: { color: 'bg-red-100 text-red-700 border-red-300', icon: CreditCard },
    Equity: { color: 'bg-purple-100 text-purple-700 border-purple-300', icon: TrendingUp },
    Income: { color: 'bg-green-100 text-green-700 border-green-300', icon: DollarSign },
    Expenses: { color: 'bg-orange-100 text-orange-700 border-orange-300', icon: ShoppingBag },
  };

  const toggleNode = (code: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedNodes(newExpanded);
  };

  const renderAccount = (account: Account) => {
    const isExpanded = expandedNodes.has(account.code);
    const TypeIcon = typeConfig[account.type].icon;
    const indentLevel = account.level * 2;

    return (
      <div key={account.code}>
        <div
          className={`flex items-center py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
            account.level === 0 ? 'bg-gray-50 font-semibold' : ''
          }`}
          style={{ paddingLeft: `${indentLevel + 1}rem` }}
        >
          <div className="flex items-center flex-1 space-x-3">
            {account.hasChildren ? (
              <button
                onClick={() => toggleNode(account.code)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <TypeIcon className={`h-5 w-5 ${typeConfig[account.type].color.split(' ')[1]}`} />

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-semibold text-blue-600">{account.code}</span>
                <span className={`text-sm ${account.level === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {account.name}
                </span>
                {account.description && account.level === 0 && (
                  <span className="text-xs text-gray-500">- {account.description}</span>
                )}
              </div>
            </div>

            <span className={`px-2 py-1 text-xs font-semibold rounded border ${typeConfig[account.type].color}`}>
              {account.type}
            </span>

            <div className="text-right min-w-[150px]">
              <div className="font-bold text-gray-900">₹{account.balance.toLocaleString()}</div>
              {account.level > 0 && (
                <div className="text-xs text-gray-500 flex items-center justify-end space-x-2">
                  {account.debitBalance > 0 && (
                    <span className="text-orange-600">Dr: ₹{account.debitBalance.toLocaleString()}</span>
                  )}
                  {account.creditBalance > 0 && (
                    <span className="text-green-600">Cr: ₹{account.creditBalance.toLocaleString()}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {account.isActive ? (
                <span className="flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </span>
              ) : (
                <span className="flex items-center text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => router.push(`/finance/accounting/ledger-report?account=${account.code}`)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
               
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
               
              >
                <Edit className="h-4 w-4" />
              </button>
              {account.level > 0 && (
                <>
                  <button
                    className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                   
                  >
                    {account.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </button>
                  <button
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                   
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {isExpanded && account.children && account.children.length > 0 && (
          <div>
            {account.children.map((child) => renderAccount(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Action Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={() => alert('Add New Account functionality')}
                className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Account</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Accounts</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalAccounts}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Assets Accounts</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.assetsAccounts}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Liabilities Accounts</p>
                <p className="text-2xl font-bold text-red-900 mt-1">{stats.liabilitiesAccounts}</p>
              </div>
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Accounts</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{stats.activeAccounts}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Account code or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setStatusFilter('all');
            }}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
          <button
            onClick={() => setExpandedNodes(new Set(accounts.filter(a => a.level === 0).map(a => a.code)))}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
            <span>Expand All</span>
          </button>
          <button
            onClick={() => setExpandedNodes(new Set())}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
            <span>Collapse All</span>
          </button>
          <button
            onClick={() => alert('Export functionality')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Account Tree */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Account Hierarchy</h2>
            <div className="text-sm text-gray-600">
              Showing {filteredAccounts.length} of {accounts.length} accounts
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {accountTree.map((account) => renderAccount(account))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Accounts Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
