'use client'

import { useState } from 'react'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  AlertCircle,
  Building2,
  CreditCard,
  PiggyBank,
  BarChart3,
  ArrowUpRight
} from 'lucide-react'

interface CashStats {
  totalCash: number
  bankBalance: number
  cashInHand: number
  todayReceipts: number
  todayPayments: number
  netCashFlow: number
  projectedBalance: number
  overdraftLimit: number
}

interface CashTransaction {
  id: string
  date: string
  type: 'receipt' | 'payment'
  category: string
  description: string
  amount: number
  balance: number
  account: string
  status: 'cleared' | 'pending' | 'reconciled'
}

interface CashForecast {
  date: string
  expectedReceipts: number
  expectedPayments: number
  netFlow: number
  projectedBalance: number
}

export default function CashManagementDashboard() {
  const [stats] = useState<CashStats>({
    totalCash: 15750000,
    bankBalance: 14500000,
    cashInHand: 1250000,
    todayReceipts: 850000,
    todayPayments: 320000,
    netCashFlow: 530000,
    projectedBalance: 16280000,
    overdraftLimit: 5000000
  })

  const [recentTransactions] = useState<CashTransaction[]>([
    {
      id: 'CSH-001',
      date: '2025-10-18',
      type: 'receipt',
      category: 'Sales Receipt',
      description: 'Payment received from ABC Manufacturing Ltd',
      amount: 500000,
      balance: 15750000,
      account: 'Bank - HDFC Current',
      status: 'cleared'
    },
    {
      id: 'CSH-002',
      date: '2025-10-18',
      type: 'payment',
      description: 'Supplier payment - Raw materials',
      category: 'Purchase Payment',
      amount: 250000,
      balance: 15500000,
      account: 'Bank - HDFC Current',
      status: 'cleared'
    },
    {
      id: 'CSH-003',
      date: '2025-10-17',
      type: 'receipt',
      category: 'Sales Receipt',
      description: 'Cash sales - Direct customer',
      amount: 125000,
      balance: 15625000,
      account: 'Cash In Hand',
      status: 'reconciled'
    },
    {
      id: 'CSH-004',
      date: '2025-10-17',
      type: 'payment',
      category: 'Operating Expense',
      description: 'Office rent payment - October 2025',
      amount: 150000,
      balance: 15475000,
      account: 'Bank - HDFC Current',
      status: 'reconciled'
    },
    {
      id: 'CSH-005',
      date: '2025-10-16',
      type: 'receipt',
      category: 'Sales Receipt',
      description: 'Customer payment - Invoice INV-2025-123',
      amount: 750000,
      balance: 15625000,
      account: 'Bank - ICICI Current',
      status: 'pending'
    }
  ])

  const [cashForecast] = useState<CashForecast[]>([
    {
      date: '2025-10-19',
      expectedReceipts: 1200000,
      expectedPayments: 650000,
      netFlow: 550000,
      projectedBalance: 16300000
    },
    {
      date: '2025-10-20',
      expectedReceipts: 850000,
      expectedPayments: 1200000,
      netFlow: -350000,
      projectedBalance: 15950000
    },
    {
      date: '2025-10-21',
      expectedReceipts: 950000,
      expectedPayments: 480000,
      netFlow: 470000,
      projectedBalance: 16420000
    },
    {
      date: '2025-10-22',
      expectedReceipts: 1500000,
      expectedPayments: 850000,
      netFlow: 650000,
      projectedBalance: 17070000
    },
    {
      date: '2025-10-23',
      expectedReceipts: 680000,
      expectedPayments: 920000,
      netFlow: -240000,
      projectedBalance: 16830000
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTypeColor = (type: string) => {
    return type === 'receipt'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'reconciled':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cash Management</h1>
            <p className="text-gray-600 mt-1">Monitor cash flow, bank balances, and cash forecasting</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md">
            <Wallet className="h-5 w-5" />
            Cash Transaction
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-5 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Total Cash & Bank</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">{formatCurrency(stats.totalCash)}</p>
                <p className="text-xs text-emerald-700 mt-1">As of today</p>
              </div>
              <Wallet className="h-10 w-10 text-emerald-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Bank Balance</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(stats.bankBalance)}</p>
                <p className="text-xs text-blue-700 mt-1">Multiple accounts</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Cash In Hand</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(stats.cashInHand)}</p>
                <p className="text-xs text-purple-700 mt-1">Physical cash</p>
              </div>
              <PiggyBank className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Net Cash Flow (Today)</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{formatCurrency(stats.netCashFlow)}</p>
                <p className="text-xs text-orange-700 mt-1">Receipts - Payments</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-green-600" />
              Today's Receipts
            </h3>
            <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(stats.todayReceipts)}</div>
            <p className="text-sm text-gray-600">Collected from customers</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales Receipts:</span>
                  <span className="font-medium">₹625,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Income:</span>
                  <span className="font-medium">₹225,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-red-600" />
              Today's Payments
            </h3>
            <div className="text-3xl font-bold text-red-600 mb-2">{formatCurrency(stats.todayPayments)}</div>
            <p className="text-sm text-gray-600">Paid to suppliers & expenses</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier Payments:</span>
                  <span className="font-medium">₹250,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Expenses:</span>
                  <span className="font-medium">₹70,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-2 rounded-full ${txn.type === 'receipt' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {txn.type === 'receipt' ? (
                          <ArrowDownCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{txn.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(txn.type)}`}>
                            {txn.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">{txn.account}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{txn.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${txn.type === 'receipt' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'receipt' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cash Flow Forecast */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">7-Day Cash Forecast</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {cashForecast.map((forecast, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{new Date(forecast.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${forecast.netFlow >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {forecast.netFlow >= 0 ? '+' : ''}{formatCurrency(forecast.netFlow)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">Receipts</p>
                        <p className="font-medium text-green-600">{formatCurrency(forecast.expectedReceipts)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Payments</p>
                        <p className="font-medium text-red-600">{formatCurrency(forecast.expectedPayments)}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Projected Balance</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(forecast.projectedBalance)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Projected Balance (7 days)</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.projectedBalance)}</p>
            <p className="text-xs text-green-600 mt-1">+{((((stats.projectedBalance - stats.totalCash) / stats.totalCash) * 100).toFixed(1))}% increase</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Overdraft Limit</h3>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overdraftLimit)}</p>
            <p className="text-xs text-gray-600 mt-1">Available credit facility</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Cash Coverage</h3>
              <AlertCircle className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">45 days</p>
            <p className="text-xs text-green-600 mt-1">Based on avg daily burn</p>
          </div>
        </div>
      </div>
    </div>
  )
}
