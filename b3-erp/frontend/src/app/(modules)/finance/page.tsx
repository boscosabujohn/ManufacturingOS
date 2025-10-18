'use client';

import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  CreditCard,
  Package,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Receipt,
  Banknote,
  Calculator,
  BookOpen,
  Settings,
  ArrowRight,
} from 'lucide-react';

export default function FinanceDashboard() {
  // Mock data - will be replaced with API calls
  const dashboardData = {
    cashPosition: {
      totalCash: 12500000,
      bankBalance: 11800000,
      cashInHand: 700000,
      change: 8.5,
      trend: 'up',
    },
    accountsReceivable: {
      total: 8900000,
      current: 6200000,
      overdue: 2700000,
      overduePercentage: 30.3,
    },
    accountsPayable: {
      total: 5600000,
      current: 4100000,
      overdue: 1500000,
      overduePercentage: 26.8,
    },
    monthlyRevenue: {
      current: 15200000,
      previous: 14100000,
      change: 7.8,
    },
    monthlyExpense: {
      current: 9800000,
      previous: 10200000,
      change: -3.9,
    },
    netProfit: {
      amount: 5400000,
      margin: 35.5,
      change: 12.3,
    },
    anticipatedReceipts: {
      thisWeek: 3200000,
      thisMonth: 8900000,
      count: 24,
    },
    anticipatedPayments: {
      thisWeek: 2100000,
      thisMonth: 5600000,
      count: 18,
    },
    budgetUtilization: {
      utilized: 62.5,
      remaining: 37.5,
      status: 'on-track',
    },
  };

  const quickActions = [
    { icon: FileText, label: 'Create Journal Entry', href: '/finance/journal-entries/create', color: 'blue' },
    { icon: Receipt, label: 'Record Payment', href: '/finance/payments/add', color: 'green' },
    { icon: Banknote, label: 'Create Invoice', href: '/finance/invoices/add', color: 'purple' },
    { icon: Calculator, label: 'Bank Reconciliation', href: '/finance/bank-reconciliation', color: 'orange' },
  ];

  const financialReports = [
    { name: 'Profit & Loss', description: 'Income statement for the period', href: '/finance/reports/profit-loss', icon: TrendingUp },
    { name: 'Balance Sheet', description: 'Financial position statement', href: '/finance/reports/balance-sheet', icon: BarChart3 },
    { name: 'Cash Flow', description: 'Cash movement analysis', href: '/finance/reports/cash-flow', icon: Wallet },
    { name: 'Trial Balance', description: 'Account balances verification', href: '/finance/accounting/trial-balance', icon: BookOpen },
  ];

  const recentTransactions = [
    { id: 1, type: 'Journal Entry', number: 'JE-2025-045', date: '2025-10-18', amount: 125000, status: 'Posted' },
    { id: 2, type: 'Payment', number: 'PMT-2025-132', date: '2025-10-18', amount: -85000, status: 'Processed' },
    { id: 3, type: 'Invoice', number: 'INV-2025-289', date: '2025-10-17', amount: 245000, status: 'Sent' },
    { id: 4, type: 'Receipt', number: 'RCT-2025-156', date: '2025-10-17', amount: 180000, status: 'Reconciled' },
    { id: 5, type: 'Journal Entry', number: 'JE-2025-044', date: '2025-10-16', amount: 65000, status: 'Posted' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="w-10 h-10 text-blue-600" />
              Finance Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Comprehensive financial overview and analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>October 2025</span>
              </div>
            </div>
            <Link
              href="/finance/settings"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Cash Position */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            {dashboardData.cashPosition.trend === 'up' ? (
              <ArrowUpRight className="w-6 h-6 text-green-300" />
            ) : (
              <ArrowDownRight className="w-6 h-6 text-red-300" />
            )}
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Cash Position</p>
          <p className="text-3xl font-bold mb-2">{formatCurrency(dashboardData.cashPosition.totalCash)}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-white/20 px-2 py-1 rounded">
              {dashboardData.cashPosition.change > 0 ? '+' : ''}{dashboardData.cashPosition.change}%
            </span>
            <span className="text-blue-100">vs last month</span>
          </div>
        </div>

        {/* Accounts Receivable */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
              {dashboardData.accountsReceivable.overduePercentage}% Overdue
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Accounts Receivable</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(dashboardData.accountsReceivable.total)}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600">
              Current: {formatCurrency(dashboardData.accountsReceivable.current)}
            </span>
          </div>
        </div>

        {/* Accounts Payable */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
              {dashboardData.accountsPayable.overduePercentage}% Overdue
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Accounts Payable</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(dashboardData.accountsPayable.total)}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-blue-600">
              Current: {formatCurrency(dashboardData.accountsPayable.current)}
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-6 h-6 text-green-300" />
          </div>
          <p className="text-purple-100 text-sm mb-1">Net Profit (This Month)</p>
          <p className="text-3xl font-bold mb-2">{formatCurrency(dashboardData.netProfit.amount)}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-white/20 px-2 py-1 rounded">{dashboardData.netProfit.margin}% Margin</span>
            <span className="text-purple-100">+{dashboardData.netProfit.change}%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-blue-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const colorMap: any = {
              blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
              green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
              purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
              orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
            };
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`bg-gradient-to-r ${colorMap[action.color]} text-white p-4 rounded-lg shadow-md transition-all hover:shadow-xl flex items-center gap-3`}
              >
                <action.icon className="w-8 h-8" />
                <span className="font-semibold">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Middle Row - Revenue/Expense & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue vs Expense */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Revenue vs Expense</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Revenue</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(dashboardData.monthlyRevenue.current)}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    +{dashboardData.monthlyRevenue.change}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Expense</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(dashboardData.monthlyExpense.current)}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {dashboardData.monthlyExpense.change}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-red-500 h-3 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Net Profit</span>
                <span className="text-xl font-bold text-purple-600">
                  {formatCurrency(dashboardData.monthlyRevenue.current - dashboardData.monthlyExpense.current)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Anticipated Cash Flow */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Anticipated Cash Flow</h2>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Expected Receipts</span>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {dashboardData.anticipatedReceipts.count} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(dashboardData.anticipatedReceipts.thisWeek)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(dashboardData.anticipatedReceipts.thisMonth)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-900">Expected Payments</span>
                </div>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  {dashboardData.anticipatedPayments.count} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(dashboardData.anticipatedPayments.thisWeek)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(dashboardData.anticipatedPayments.thisMonth)}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Net Cash Flow (This Month)</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(
                    dashboardData.anticipatedReceipts.thisMonth - dashboardData.anticipatedPayments.thisMonth
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Recent Transactions & Financial Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <Link href="/finance/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {transaction.amount > 0 ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.number}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.type} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{transaction.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Reports */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Reports</h2>
          <div className="grid grid-cols-2 gap-4">
            {financialReports.map((report) => (
              <Link
                key={report.name}
                href={report.href}
                className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 rounded-lg p-4 transition-all hover:shadow-md group"
              >
                <report.icon className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2 transition-colors" />
                <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                <p className="text-xs text-gray-600">{report.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/finance/reports"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-semibold">View All Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
