'use client'

import { useState } from 'react'
import {
  Building2,
  PieChart,
  DollarSign,
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface ConsolidatedEntity {
  name: string
  revenue: number
  expenses: number
  assets: number
  liabilities: number
  equity: number
  netIncome: number
}

export default function FinancialConsolidationPage() {
  const [entities] = useState<ConsolidatedEntity[]>([
    { name: 'Manufacturing Unit A', revenue: 250000000, expenses: 180000000, assets: 500000000, liabilities: 200000000, equity: 300000000, netIncome: 70000000 },
    { name: 'Sales Division B', revenue: 180000000, expenses: 140000000, assets: 300000000, liabilities: 120000000, equity: 180000000, netIncome: 40000000 },
    { name: 'Regional Office - North', revenue: 150000000, expenses: 120000000, assets: 250000000, liabilities: 100000000, equity: 150000000, netIncome: 30000000 },
    { name: 'IT Services Division', revenue: 95000000, expenses: 70000000, assets: 150000000, liabilities: 60000000, equity: 90000000, netIncome: 25000000 }
  ])

  const [eliminations] = useState({ revenue: 50000000, expenses: 35000000, assets: 80000000, liabilities: 80000000 })

  const consolidated = {
    revenue: entities.reduce((sum, e) => sum + e.revenue, 0) - eliminations.revenue,
    expenses: entities.reduce((sum, e) => sum + e.expenses, 0) - eliminations.expenses,
    assets: entities.reduce((sum, e) => sum + e.assets, 0) - eliminations.assets,
    liabilities: entities.reduce((sum, e) => sum + e.liabilities, 0) - eliminations.liabilities,
    equity: entities.reduce((sum, e) => sum + e.equity, 0),
    netIncome: entities.reduce((sum, e) => sum + e.netIncome, 0) - (eliminations.revenue - eliminations.expenses)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Consolidation</h1>
            <p className="text-gray-600 mt-1">Consolidated financial statements for group companies</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 shadow-md">
              <RefreshCw className="h-5 w-5" />
              Run Consolidation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Consolidated Revenue', value: consolidated.revenue, icon: DollarSign, color: 'blue' },
            { label: 'Consolidated Assets', value: consolidated.assets, icon: Building2, color: 'green' },
            { label: 'Net Income', value: consolidated.netIncome, icon: TrendingUp, color: 'purple' },
            { label: 'Total Equity', value: consolidated.equity, icon: PieChart, color: 'orange' }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-lg p-5 border border-${stat.color}-200 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-${stat.color}-600`}>{stat.label}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-900 mt-1`}>{formatCurrency(stat.value)}</p>
                </div>
                <stat.icon className={`h-10 w-10 text-${stat.color}-600`} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Consolidated Income Statement</h2>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Entity</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Expenses</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Net Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entities.map((entity, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{entity.name}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(entity.revenue)}</td>
                    <td className="px-6 py-4 text-right font-medium text-orange-600">{formatCurrency(entity.expenses)}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(entity.netIncome)}</td>
                  </tr>
                ))}
                <tr className="bg-yellow-50 font-semibold">
                  <td className="px-6 py-4">Eliminations</td>
                  <td className="px-6 py-4 text-right text-red-600">({formatCurrency(eliminations.revenue)})</td>
                  <td className="px-6 py-4 text-right text-green-600">({formatCurrency(eliminations.expenses)})</td>
                  <td className="px-6 py-4 text-right text-red-600">({formatCurrency(eliminations.revenue - eliminations.expenses)})</td>
                </tr>
                <tr className="bg-violet-100 font-bold border-t-2 border-violet-300">
                  <td className="px-6 py-4 text-violet-900">Consolidated Total</td>
                  <td className="px-6 py-4 text-right text-violet-900">{formatCurrency(consolidated.revenue)}</td>
                  <td className="px-6 py-4 text-right text-violet-900">{formatCurrency(consolidated.expenses)}</td>
                  <td className="px-6 py-4 text-right text-violet-900">{formatCurrency(consolidated.netIncome)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Consolidated Balance Sheet</h2>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Entity</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Assets</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Liabilities</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Equity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entities.map((entity, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{entity.name}</td>
                    <td className="px-6 py-4 text-right font-medium text-blue-600">{formatCurrency(entity.assets)}</td>
                    <td className="px-6 py-4 text-right font-medium text-orange-600">{formatCurrency(entity.liabilities)}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(entity.equity)}</td>
                  </tr>
                ))}
                <tr className="bg-yellow-50 font-semibold">
                  <td className="px-6 py-4">Eliminations</td>
                  <td className="px-6 py-4 text-right text-red-600">({formatCurrency(eliminations.assets)})</td>
                  <td className="px-6 py-4 text-right text-green-600">({formatCurrency(eliminations.liabilities)})</td>
                  <td className="px-6 py-4 text-right">-</td>
                </tr>
                <tr className="bg-violet-100 font-bold border-t-2 border-violet-300">
                  <td className="px-6 py-4 text-violet-900">Consolidated Total</td>
                  <td className="px-6 py-4 text-right text-violet-900">{formatCurrency(consolidated.assets)}</td>
                  <td className="px-6 py-4 text-right text-violet-900">{formatCurrency(consolidated.liabilities)}</td>
                  <td className="px-6 py-4 text-right text-violet-900">{formatCurrency(consolidated.equity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
