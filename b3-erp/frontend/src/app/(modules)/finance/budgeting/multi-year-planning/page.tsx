'use client'

import { useState } from 'react'
import {
  Calendar,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Plus,
  Download,
  Edit,
  Copy,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

interface YearlyBudget {
  year: number
  revenue: number
  operatingExpenses: number
  capitalExpenditure: number
  netIncome: number
  growthRate: number
  status: 'draft' | 'approved' | 'active' | 'completed'
}

interface Department {
  name: string
  budgets: { [year: number]: number }
}

export default function MultiYearPlanningPage() {
  const [planHorizon, setPlanHorizon] = useState(5)
  const [baseYear] = useState(2025)

  const [yearlyBudgets] = useState<YearlyBudget[]>([
    {
      year: 2025,
      revenue: 500000000,
      operatingExpenses: 350000000,
      capitalExpenditure: 50000000,
      netIncome: 100000000,
      growthRate: 0,
      status: 'active'
    },
    {
      year: 2026,
      revenue: 575000000,
      operatingExpenses: 390000000,
      capitalExpenditure: 75000000,
      netIncome: 110000000,
      growthRate: 15,
      status: 'approved'
    },
    {
      year: 2027,
      revenue: 661250000,
      operatingExpenses: 438750000,
      capitalExpenditure: 85000000,
      netIncome: 137500000,
      growthRate: 15,
      status: 'draft'
    },
    {
      year: 2028,
      revenue: 760437500,
      operatingExpenses: 494062500,
      capitalExpenditure: 95000000,
      netIncome: 171375000,
      growthRate: 15,
      status: 'draft'
    },
    {
      year: 2029,
      revenue: 874503125,
      operatingExpenses: 556171875,
      capitalExpenditure: 100000000,
      netIncome: 218331250,
      growthRate: 15,
      status: 'draft'
    }
  ])

  const [departments] = useState<Department[]>([
    {
      name: 'Operations',
      budgets: { 2025: 150000000, 2026: 165000000, 2027: 181500000, 2028: 199650000, 2029: 219615000 }
    },
    {
      name: 'Sales & Marketing',
      budgets: { 2025: 75000000, 2026: 82500000, 2027: 90750000, 2028: 99825000, 2029: 109807500 }
    },
    {
      name: 'R&D',
      budgets: { 2025: 50000000, 2026: 60000000, 2027: 72000000, 2028: 86400000, 2029: 103680000 }
    },
    {
      name: 'IT',
      budgets: { 2025: 35000000, 2026: 38500000, 2027: 42350000, 2028: 46585000, 2029: 51243500 }
    },
    {
      name: 'Administration',
      budgets: { 2025: 40000000, 2026: 44000000, 2027: 48400000, 2028: 53240000, 2029: 58564000 }
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: amount >= 10000000 ? 'compact' : 'standard',
      compactDisplay: 'short'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'approved':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'completed':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalPlannedRevenue = yearlyBudgets.reduce((sum, y) => sum + y.revenue, 0)
  const totalCapex = yearlyBudgets.reduce((sum, y) => sum + y.capitalExpenditure, 0)
  const totalNetIncome = yearlyBudgets.reduce((sum, y) => sum + y.netIncome, 0)
  const avgGrowthRate = yearlyBudgets.filter(y => y.growthRate > 0).reduce((sum, y) => sum + y.growthRate, 0) / yearlyBudgets.filter(y => y.growthRate > 0).length

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 px-3 py-2">
      <div className="w-full space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Multi-Year Budget Planning</h1>
            <p className="text-gray-600 mt-1">Strategic financial planning and forecasting across multiple years</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              <Download className="h-5 w-5" />
              Export Plan
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md">
              <Plus className="h-5 w-5" />
              New Plan
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Planning Horizon</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{planHorizon} Years</p>
                <p className="text-xs text-blue-700 mt-1">{baseYear}-{baseYear + planHorizon - 1}</p>
              </div>
              <Calendar className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Planned Revenue</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalPlannedRevenue)}</p>
                <p className="text-xs text-green-700 mt-1">{planHorizon}-year total</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Capex</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(totalCapex)}</p>
                <p className="text-xs text-purple-700 mt-1">Investment planned</p>
              </div>
              <Target className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Growth Rate</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{avgGrowthRate.toFixed(1)}%</p>
                <p className="text-xs text-orange-700 mt-1">Year-over-year</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Year-by-Year Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Year-by-Year Financial Plan</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Year</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Revenue</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Operating Expenses</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Capex</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Net Income</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Growth %</th>
                    <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {yearlyBudgets.map((budget) => (
                    <tr key={budget.year} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="font-semibold text-gray-900">FY {budget.year}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-900">
                        {formatCurrency(budget.revenue)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-orange-600">
                        {formatCurrency(budget.operatingExpenses)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-purple-600">
                        {formatCurrency(budget.capitalExpenditure)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-green-600">
                        {formatCurrency(budget.netIncome)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          budget.growthRate > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {budget.growthRate > 0 && <TrendingUp className="h-3 w-3" />}
                          {budget.growthRate > 0 ? `+${budget.growthRate}%` : 'Base'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(budget.status)}`}>
                          {budget.status === 'active' && <CheckCircle className="h-3 w-3" />}
                          {budget.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                            <Edit className="h-4 w-4 text-gray-600" />
                            <span className="text-gray-700">Edit</span>
                          </button>
                          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                            <Copy className="h-4 w-4 text-gray-600" />
                            <span className="text-gray-700">Copy</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Department-wise Planning */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Department-wise Budget Allocation</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Department</th>
                    {yearlyBudgets.map(y => (
                      <th key={y.year} className="px-3 py-2 text-right text-sm font-semibold text-gray-700">
                        {y.year}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700">CAGR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departments.map((dept) => {
                    const total = Object.values(dept.budgets).reduce((sum, val) => sum + val, 0)
                    const years = Object.keys(dept.budgets).length
                    const firstYear = dept.budgets[baseYear]
                    const lastYear = dept.budgets[baseYear + years - 1]
                    const cagr = ((Math.pow(lastYear / firstYear, 1 / (years - 1)) - 1) * 100).toFixed(1)

                    return (
                      <tr key={dept.name} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-900">{dept.name}</td>
                        {yearlyBudgets.map(y => (
                          <td key={y.year} className="px-3 py-2 text-right font-medium text-gray-700">
                            {formatCurrency(dept.budgets[y.year])}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-right font-bold text-gray-900">
                          {formatCurrency(total)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <TrendingUp className="h-3 w-3" />
                            {cagr}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Key Assumptions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Key Planning Assumptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Revenue Growth</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Annual growth: 15%
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  New market expansion
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Product line diversification
                </li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Capital Investment</h3>
              </div>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Technology upgrades
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Capacity expansion
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Infrastructure development
                </li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Efficiency Targets</h3>
              </div>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Cost optimization: 5% annually
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Process automation
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Margin improvement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
