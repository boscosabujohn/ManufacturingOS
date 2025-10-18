'use client'

import { useState } from 'react'
import { RefreshCw, Calendar, CheckCircle, Clock, FileText, DollarSign, TrendingUp } from 'lucide-react'

interface RecurringTransaction {
  id: string
  templateName: string
  transactionType: 'journal_entry' | 'invoice' | 'payment' | 'accrual'
  description: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  amount: number
  startDate: string
  endDate: string
  nextOccurrence: string
  lastPosted: string
  totalOccurrences: number
  completedOccurrences: number
  status: 'active' | 'paused' | 'completed' | 'expired'
  autoPost: boolean
  accountsAffected: string[]
}

export default function RecurringTransactionsPage() {
  const [transactions] = useState<RecurringTransaction[]>([
    {
      id: '1',
      templateName: 'Monthly Rent Payment',
      transactionType: 'journal_entry',
      description: 'Office rent payment - Monthly recurring',
      frequency: 'monthly',
      amount: 150000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      nextOccurrence: '2025-11-01',
      lastPosted: '2025-10-01',
      totalOccurrences: 12,
      completedOccurrences: 10,
      status: 'active',
      autoPost: true,
      accountsAffected: ['Rent Expense', 'Cash']
    },
    {
      id: '2',
      templateName: 'Quarterly Insurance Premium',
      transactionType: 'payment',
      description: 'Business insurance premium - Quarterly',
      frequency: 'quarterly',
      amount: 75000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      nextOccurrence: '2026-01-01',
      lastPosted: '2025-10-01',
      totalOccurrences: 4,
      completedOccurrences: 4,
      status: 'completed',
      autoPost: true,
      accountsAffected: ['Insurance Expense', 'Bank Account']
    },
    {
      id: '3',
      templateName: 'Monthly Depreciation',
      transactionType: 'accrual',
      description: 'Fixed assets depreciation - Monthly',
      frequency: 'monthly',
      amount: 85000,
      startDate: '2025-01-01',
      endDate: '2026-12-31',
      nextOccurrence: '2025-11-01',
      lastPosted: '2025-10-01',
      totalOccurrences: 24,
      completedOccurrences: 10,
      status: 'active',
      autoPost: true,
      accountsAffected: ['Depreciation Expense', 'Accumulated Depreciation']
    },
    {
      id: '4',
      templateName: 'Weekly Salary Accrual',
      transactionType: 'accrual',
      description: 'Employee salary accrual - Weekly',
      frequency: 'weekly',
      amount: 250000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      nextOccurrence: '2025-10-21',
      lastPosted: '2025-10-14',
      totalOccurrences: 52,
      completedOccurrences: 42,
      status: 'active',
      autoPost: false,
      accountsAffected: ['Salary Expense', 'Salary Payable']
    },
    {
      id: '5',
      templateName: 'Monthly Software Subscription',
      transactionType: 'invoice',
      description: 'ERP software subscription - Monthly',
      frequency: 'monthly',
      amount: 45000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      nextOccurrence: '2025-11-01',
      lastPosted: '2025-10-01',
      totalOccurrences: 12,
      completedOccurrences: 10,
      status: 'active',
      autoPost: true,
      accountsAffected: ['Software Expense', 'Accounts Payable']
    },
    {
      id: '6',
      templateName: 'Annual License Fee',
      transactionType: 'payment',
      description: 'Business license renewal - Yearly',
      frequency: 'yearly',
      amount: 25000,
      startDate: '2025-04-01',
      endDate: '2030-04-01',
      nextOccurrence: '2026-04-01',
      lastPosted: '2025-04-01',
      totalOccurrences: 5,
      completedOccurrences: 1,
      status: 'active',
      autoPost: false,
      accountsAffected: ['License Expense', 'Bank Account']
    }
  ])

  const [stats] = useState({
    totalRecurring: 18,
    activeRecurring: 14,
    pausedRecurring: 2,
    completedRecurring: 2,
    totalMonthlyValue: 1250000,
    upcomingThisWeek: 3
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'journal_entry': return 'bg-blue-100 text-blue-700'
      case 'invoice': return 'bg-purple-100 text-purple-700'
      case 'payment': return 'bg-green-100 text-green-700'
      case 'accrual': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getFrequencyBadge = (frequency: string) => {
    const badges = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    }
    return badges[frequency as keyof typeof badges] || frequency
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recurring Transactions</h1>
            <p className="text-gray-600 mt-1">Automated recurring journal entries and payments</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700">
            <RefreshCw className="h-5 w-5" />
            New Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="h-6 w-6 text-emerald-600" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRecurring}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.activeRecurring}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="text-sm text-gray-600">Paused</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pausedRecurring}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.completedRecurring}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-gray-600">This Week</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.upcomingThisWeek}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6 text-teal-600" />
              <span className="text-sm text-gray-600">Monthly Value</span>
            </div>
            <p className="text-xl font-bold text-teal-600">{formatCurrency(stats.totalMonthlyValue)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {transactions.map((txn) => (
            <div key={txn.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{txn.templateName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(txn.transactionType)}`}>
                      {txn.transactionType.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {getFrequencyBadge(txn.frequency)}
                    </span>
                    {txn.autoPost && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        AUTO-POST
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{txn.description}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    txn.status === 'active' ? 'bg-green-100 text-green-700' :
                    txn.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                    txn.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {txn.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Amount</p>
                  <p className="text-lg font-bold text-emerald-700">{formatCurrency(txn.amount)}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Next Occurrence</p>
                  <p className="text-sm font-semibold text-blue-700">{new Date(txn.nextOccurrence).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Last Posted</p>
                  <p className="text-sm font-semibold text-purple-700">{new Date(txn.lastPosted).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Progress</p>
                  <p className="text-sm font-semibold text-teal-700">{txn.completedOccurrences}/{txn.totalOccurrences}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-teal-600 h-1.5 rounded-full"
                      style={{ width: `${(txn.completedOccurrences / txn.totalOccurrences) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-600 mb-2">Accounts Affected:</p>
                <div className="flex flex-wrap gap-2">
                  {txn.accountsAffected.map((account, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {account}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  Edit Template
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
                  Post Now
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  View History
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Recurring Transaction Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Flexible Scheduling</h4>
              <ul className="space-y-1 text-sm">
                <li>• Daily, weekly, monthly, quarterly, yearly</li>
                <li>• Custom date ranges and end dates</li>
                <li>• Skip weekends and holidays option</li>
                <li>• Multi-year planning support</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Automation Options</h4>
              <ul className="space-y-1 text-sm">
                <li>• Auto-post or require manual approval</li>
                <li>• Email notifications before posting</li>
                <li>• Automatic reversal entries</li>
                <li>• Batch processing capabilities</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Control & Audit</h4>
              <ul className="space-y-1 text-sm">
                <li>• Complete posting history log</li>
                <li>• Pause/resume functionality</li>
                <li>• Template versioning</li>
                <li>• Audit trail for all changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
