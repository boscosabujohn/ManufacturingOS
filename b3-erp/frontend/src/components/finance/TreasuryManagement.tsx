'use client';

import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Activity,
  RefreshCw,
  Download,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Globe
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'money_market' | 'fixed_deposit';
  currency: string;
  balance: number;
  availableBalance: number;
  interestRate: number;
  lastUpdated: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'bond' | 'stock' | 'mutual_fund' | 'fixed_deposit' | 'treasury_bill';
  principal: number;
  currentValue: number;
  returnRate: number;
  maturityDate?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Liability {
  id: string;
  name: string;
  type: 'loan' | 'credit_line' | 'bond' | 'mortgage';
  principal: number;
  outstandingBalance: number;
  interestRate: number;
  monthlyPayment: number;
  maturityDate: string;
  lender: string;
}

export interface CashPosition {
  totalCash: number;
  bankBalances: number;
  investmentValue: number;
  totalLiabilities: number;
  netPosition: number;
  liquidityRatio: number;
}

export interface TreasuryManagementData {
  bankAccounts: BankAccount[];
  investments: Investment[];
  liabilities: Liability[];
  cashPosition: CashPosition;
  currency: string;
}

// ============================================================================
// PROPS
// ============================================================================

export interface TreasuryManagementProps {
  data?: TreasuryManagementData;
  onRefresh?: () => void;
  onExport?: (format: 'excel' | 'pdf') => void;
  editable?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TreasuryManagement({
  data,
  onRefresh,
  onExport,
  editable = false
}: TreasuryManagementProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'banking' | 'investments' | 'liabilities'>('overview');

  const formatCurrency = (amount: number, compact = false) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: data?.currency || 'INR',
      minimumFractionDigits: compact ? 0 : 2,
      notation: compact ? 'compact' : 'standard',
      compactDisplay: 'short'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getRiskBadge = (risk: Investment['riskLevel']) => {
    const styles = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    };

    return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[risk]}`}>{risk.toUpperCase()}</span>;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-green-600" />
            Treasury Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Cash, investments, and liability management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Balances
          </button>
          <button
            onClick={() => onExport?.('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Cash Position Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Total Cash</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {formatCurrency(data?.cashPosition.totalCash || 0, true)}
              </p>
            </div>
            <Wallet className="w-10 h-10 text-blue-600 opacity-80" />
          </div>
          <div className="text-xs text-blue-600">All currencies combined</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-green-600 uppercase">Bank Balances</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {formatCurrency(data?.cashPosition.bankBalances || 0, true)}
              </p>
            </div>
            <CreditCard className="w-10 h-10 text-green-600 opacity-80" />
          </div>
          <div className="text-xs text-green-600">{data?.bankAccounts.length || 0} accounts</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-purple-600 uppercase">Investments</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {formatCurrency(data?.cashPosition.investmentValue || 0, true)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-600 opacity-80" />
          </div>
          <div className="text-xs text-purple-600">{data?.investments.length || 0} positions</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-red-600 uppercase">Liabilities</p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {formatCurrency(data?.cashPosition.totalLiabilities || 0, true)}
              </p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-600 opacity-80" />
          </div>
          <div className="text-xs text-red-600">{data?.liabilities.length || 0} obligations</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-indigo-600 uppercase">Net Position</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">
                {formatCurrency(data?.cashPosition.netPosition || 0, true)}
              </p>
            </div>
            <BarChart3 className="w-10 h-10 text-indigo-600 opacity-80" />
          </div>
          <div className="text-xs text-indigo-600">
            Liquidity: {data?.cashPosition.liquidityRatio.toFixed(2) || 0}x
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'banking', label: 'Bank Accounts', icon: CreditCard },
            { id: 'investments', label: 'Investments', icon: TrendingUp },
            { id: 'liabilities', label: 'Liabilities', icon: TrendingDown }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
              <h3 className="text-lg font-semibold text-gray-900">Cash Distribution</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Bank Balances</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(data?.cashPosition.bankBalances || 0)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${((data?.cashPosition.bankBalances || 0) / (data?.cashPosition.totalCash || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Investments</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(data?.cashPosition.investmentValue || 0)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-500 h-3 rounded-full"
                    style={{
                      width: `${((data?.cashPosition.investmentValue || 0) / (data?.cashPosition.totalCash || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Net Position Summary */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="text-lg font-semibold text-gray-900">Net Position Summary</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ArrowUpRight className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600 uppercase font-medium">Total Assets</p>
                      <p className="text-xl font-bold text-green-900">
                        {formatCurrency((data?.cashPosition.bankBalances || 0) + (data?.cashPosition.investmentValue || 0), true)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ArrowDownRight className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="text-xs text-red-600 uppercase font-medium">Total Liabilities</p>
                      <p className="text-xl font-bold text-red-900">{formatCurrency(data?.cashPosition.totalLiabilities || 0, true)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-indigo-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Net Treasury Position</span>
                    <span className="text-2xl font-bold text-indigo-900">{formatCurrency(data?.cashPosition.netPosition || 0, true)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banking Tab */}
      {activeTab === 'banking' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Account Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Currency</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Balance</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Available</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Interest Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.bankAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{account.bankName}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{account.accountNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{account.accountType.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{account.currency}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(account.balance)}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">{formatCurrency(account.availableBalance)}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{formatPercentage(account.interestRate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(account.lastUpdated).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Investments Tab */}
      {activeTab === 'investments' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Principal</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Current Value</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Return Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Gain/Loss</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Maturity</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.investments.map((investment) => {
                  const gainLoss = investment.currentValue - investment.principal;
                  const gainLossPercentage = (gainLoss / investment.principal) * 100;

                  return (
                    <tr key={investment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{investment.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">{investment.type.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">{formatCurrency(investment.principal)}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{formatCurrency(investment.currentValue)}</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">{formatPercentage(investment.returnRate)}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold">
                        <span className={gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {gainLoss >= 0 ? '+' : ''}
                          {formatCurrency(gainLoss)}
                          <span className="text-xs ml-1">({gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%)</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {investment.maturityDate ? new Date(investment.maturityDate).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">{getRiskBadge(investment.riskLevel)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Liabilities Tab */}
      {activeTab === 'liabilities' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lender</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Principal</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Outstanding</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Interest Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Monthly Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Maturity Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.liabilities.map((liability) => (
                  <tr key={liability.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{liability.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{liability.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{liability.lender}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{formatCurrency(liability.principal)}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-red-600">{formatCurrency(liability.outstandingBalance)}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">{formatPercentage(liability.interestRate)}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(liability.monthlyPayment)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(liability.maturityDate).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
