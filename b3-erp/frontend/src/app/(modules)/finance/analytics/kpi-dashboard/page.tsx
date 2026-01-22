'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface KPI {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down'
  target: number
  actual: number
  icon: any
  color: string
}

export default function KPIDashboardPage() {
  const [period] = useState('This Month')

  const [kpis] = useState<KPI[]>([
    {
      label: 'Revenue',
      value: '₹45.2Cr',
      change: 12.5,
      trend: 'up',
      target: 42000000,
      actual: 45200000,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Gross Profit Margin',
      value: '38.5%',
      change: 2.3,
      trend: 'up',
      target: 35,
      actual: 38.5,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Operating Expenses',
      value: '₹12.8Cr',
      change: -5.2,
      trend: 'down',
      target: 14000000,
      actual: 12800000,
      icon: CreditCard,
      color: 'orange'
    },
    {
      label: 'Net Profit Margin',
      value: '22.3%',
      change: 3.8,
      trend: 'up',
      target: 20,
      actual: 22.3,
      icon: Activity,
      color: 'purple'
    },
    {
      label: 'Current Ratio',
      value: '2.45',
      change: 0.15,
      trend: 'up',
      target: 2.0,
      actual: 2.45,
      icon: BarChart3,
      color: 'cyan'
    },
    {
      label: 'Quick Ratio',
      value: '1.85',
      change: 0.12,
      trend: 'up',
      target: 1.5,
      actual: 1.85,
      icon: PieChart,
      color: 'indigo'
    },
    {
      label: 'Days Sales Outstanding',
      value: '42 days',
      change: -5,
      trend: 'down',
      target: 45,
      actual: 42,
      icon: ShoppingCart,
      color: 'pink'
    },
    {
      label: 'Days Payable Outstanding',
      value: '38 days',
      change: 3,
      trend: 'up',
      target: 35,
      actual: 38,
      icon: Package,
      color: 'teal'
    },
    {
      label: 'Return on Assets',
      value: '15.2%',
      change: 1.8,
      trend: 'up',
      target: 12,
      actual: 15.2,
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      label: 'Debt-to-Equity',
      value: '0.65',
      change: -0.08,
      trend: 'down',
      target: 0.8,
      actual: 0.65,
      icon: BarChart3,
      color: 'violet'
    },
    {
      label: 'Working Capital',
      value: '₹28.5Cr',
      change: 8.2,
      trend: 'up',
      target: 250000000,
      actual: 285000000,
      icon: DollarSign,
      color: 'amber'
    },
    {
      label: 'Cash Conversion Cycle',
      value: '52 days',
      change: -4,
      trend: 'down',
      target: 55,
      actual: 52,
      icon: Activity,
      color: 'rose'
    }
  ])

  const getProgressColor = (actual: number, target: number) => {
    const percentage = (actual / target) * 100
    if (percentage >= 100) return 'bg-green-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial KPI Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor key performance indicators and metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
            const progress = (kpi.actual / kpi.target) * 100

            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${kpi.color}-100`}>
                    <Icon className={`h-5 w-5 text-${kpi.color}-600`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {kpi.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress to Target</span>
                    <span className="font-medium">{Math.min(progress, 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(kpi.actual, kpi.target)} transition-all`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing KPIs</h3>
            <div className="space-y-3">
              {kpis
                .filter(k => (k.actual / k.target) >= 1)
                .slice(0, 5)
                .map((kpi, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <kpi.icon className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-900">{kpi.label}</span>
                    </div>
                    <span className="text-green-700 font-semibold">{((kpi.actual / kpi.target) * 100).toFixed(0)}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Needs Attention</h3>
            <div className="space-y-3">
              {kpis
                .filter(k => (k.actual / k.target) < 0.9)
                .slice(0, 5)
                .map((kpi, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <kpi.icon className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-900">{kpi.label}</span>
                    </div>
                    <span className="text-orange-700 font-semibold">{((kpi.actual / kpi.target) * 100).toFixed(0)}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
