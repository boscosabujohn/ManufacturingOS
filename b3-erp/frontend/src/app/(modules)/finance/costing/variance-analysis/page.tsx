'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Package,
  Users,
  Settings,
  Calendar,
  FileText
} from 'lucide-react'

interface VarianceData {
  id: string
  productCode: string
  productName: string
  period: string
  quantityProduced: number
  standardCost: {
    material: number
    labor: number
    overhead: number
    total: number
  }
  actualCost: {
    material: number
    labor: number
    overhead: number
    total: number
  }
  variance: {
    material: number
    labor: number
    overhead: number
    total: number
  }
  variancePercent: {
    material: number
    labor: number
    overhead: number
    total: number
  }
}

export default function VarianceAnalysisPage() {
  const [variances] = useState<VarianceData[]>([
    {
      id: 'VAR-001',
      productCode: 'PRD-HP500',
      productName: 'Hydraulic Press HP-500',
      period: 'October 2025',
      quantityProduced: 12,
      standardCost: {
        material: 850000,
        labor: 250000,
        overhead: 180000,
        total: 1280000
      },
      actualCost: {
        material: 912000,
        labor: 235000,
        overhead: 188000,
        total: 1335000
      },
      variance: {
        material: 62000,
        labor: -15000,
        overhead: 8000,
        total: 55000
      },
      variancePercent: {
        material: 7.3,
        labor: -6.0,
        overhead: 4.4,
        total: 4.3
      }
    },
    {
      id: 'VAR-002',
      productCode: 'PRD-CM350',
      productName: 'CNC Machine CM-350',
      period: 'October 2025',
      quantityProduced: 8,
      standardCost: {
        material: 1250000,
        labor: 380000,
        overhead: 270000,
        total: 1900000
      },
      actualCost: {
        material: 1198000,
        labor: 395000,
        overhead: 262000,
        total: 1855000
      },
      variance: {
        material: -52000,
        labor: 15000,
        overhead: -8000,
        total: -45000
      },
      variancePercent: {
        material: -4.2,
        labor: 3.9,
        overhead: -3.0,
        total: -2.4
      }
    },
    {
      id: 'VAR-003',
      productCode: 'PRD-CP1000',
      productName: 'Control Panel CP-1000',
      period: 'October 2025',
      quantityProduced: 25,
      standardCost: {
        material: 420000,
        labor: 95000,
        overhead: 68000,
        total: 583000
      },
      actualCost: {
        material: 435000,
        labor: 92000,
        overhead: 71000,
        total: 598000
      },
      variance: {
        material: 15000,
        labor: -3000,
        overhead: 3000,
        total: 15000
      },
      variancePercent: {
        material: 3.6,
        labor: -3.2,
        overhead: 4.4,
        total: 2.6
      }
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(Math.abs(amount))
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600' // Unfavorable
    if (variance < 0) return 'text-green-600' // Favorable
    return 'text-gray-600' // No variance
  }

  const getVarianceBgColor = (variance: number) => {
    if (variance > 0) return 'bg-red-50 border-red-200'
    if (variance < 0) return 'bg-green-50 border-green-200'
    return 'bg-gray-50 border-gray-200'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-5 w-5 text-red-600" />
    if (variance < 0) return <TrendingDown className="h-5 w-5 text-green-600" />
    return <CheckCircle className="h-5 w-5 text-gray-600" />
  }

  // Calculate totals
  const totalStandard = variances.reduce((sum, v) => sum + (v.standardCost.total * v.quantityProduced), 0)
  const totalActual = variances.reduce((sum, v) => sum + (v.actualCost.total * v.quantityProduced), 0)
  const totalVariance = totalActual - totalStandard
  const totalVariancePercent = ((totalVariance / totalStandard) * 100)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Variance Analysis</h1>
            <p className="text-gray-600 mt-1">Standard vs Actual cost analysis and variance reporting</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              <Calendar className="h-5 w-5" />
              October 2025
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-md">
              <FileText className="h-5 w-5" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Standard Cost</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(totalStandard)}</p>
                <p className="text-xs text-blue-700 mt-1">Budgeted</p>
              </div>
              <BarChart3 className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Actual Cost</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(totalActual)}</p>
                <p className="text-xs text-purple-700 mt-1">Incurred</p>
              </div>
              <Settings className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className={`bg-gradient-to-br rounded-lg p-5 border shadow-sm ${
            totalVariance > 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-green-50 to-green-100 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>Total Variance</p>
                <p className={`text-2xl font-bold mt-1 ${totalVariance > 0 ? 'text-red-900' : 'text-green-900'}`}>
                  {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
                </p>
                <p className={`text-xs mt-1 ${totalVariance > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  {totalVariance > 0 ? 'Unfavorable' : 'Favorable'}
                </p>
              </div>
              {totalVariance > 0 ? (
                <AlertTriangle className="h-10 w-10 text-red-600" />
              ) : (
                <CheckCircle className="h-10 w-10 text-green-600" />
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Variance %</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{Math.abs(totalVariancePercent).toFixed(1)}%</p>
                <p className="text-xs text-orange-700 mt-1">Of standard cost</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Detailed Variance Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Product-wise Variance Analysis</h2>
          </div>
          <div className="p-6 space-y-6">
            {variances.map((variance) => (
              <div key={variance.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                {/* Product Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{variance.productName}</h3>
                      <p className="text-sm text-gray-600">{variance.productCode} • {variance.period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Quantity Produced</p>
                    <p className="text-2xl font-bold text-gray-900">{variance.quantityProduced} units</p>
                  </div>
                </div>

                {/* Cost Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cost Component</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Standard (Per Unit)</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actual (Per Unit)</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Variance</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Variance %</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Material Variance */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">Material Cost</td>
                        <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(variance.standardCost.material)}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(variance.actualCost.material)}</td>
                        <td className={`px-6 py-4 text-right font-semibold ${getVarianceColor(variance.variance.material)}`}>
                          {variance.variance.material > 0 ? '+' : ''}{formatCurrency(variance.variance.material)}
                        </td>
                        <td className={`px-6 py-4 text-right font-semibold ${getVarianceColor(variance.variance.material)}`}>
                          {variance.variancePercent.material > 0 ? '+' : ''}{variance.variancePercent.material.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getVarianceBgColor(variance.variance.material)}`}>
                            {getVarianceIcon(variance.variance.material)}
                            {variance.variance.material > 0 ? 'Unfavorable' : variance.variance.material < 0 ? 'Favorable' : 'On Track'}
                          </span>
                        </td>
                      </tr>

                      {/* Labor Variance */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">Labor Cost</td>
                        <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(variance.standardCost.labor)}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(variance.actualCost.labor)}</td>
                        <td className={`px-6 py-4 text-right font-semibold ${getVarianceColor(variance.variance.labor)}`}>
                          {variance.variance.labor > 0 ? '+' : ''}{formatCurrency(variance.variance.labor)}
                        </td>
                        <td className={`px-6 py-4 text-right font-semibold ${getVarianceColor(variance.variance.labor)}`}>
                          {variance.variancePercent.labor > 0 ? '+' : ''}{variance.variancePercent.labor.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getVarianceBgColor(variance.variance.labor)}`}>
                            {getVarianceIcon(variance.variance.labor)}
                            {variance.variance.labor > 0 ? 'Unfavorable' : variance.variance.labor < 0 ? 'Favorable' : 'On Track'}
                          </span>
                        </td>
                      </tr>

                      {/* Overhead Variance */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">Overhead Cost</td>
                        <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(variance.standardCost.overhead)}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(variance.actualCost.overhead)}</td>
                        <td className={`px-6 py-4 text-right font-semibold ${getVarianceColor(variance.variance.overhead)}`}>
                          {variance.variance.overhead > 0 ? '+' : ''}{formatCurrency(variance.variance.overhead)}
                        </td>
                        <td className={`px-6 py-4 text-right font-semibold ${getVarianceColor(variance.variance.overhead)}`}>
                          {variance.variancePercent.overhead > 0 ? '+' : ''}{variance.variancePercent.overhead.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getVarianceBgColor(variance.variance.overhead)}`}>
                            {getVarianceIcon(variance.variance.overhead)}
                            {variance.variance.overhead > 0 ? 'Unfavorable' : variance.variance.overhead < 0 ? 'Favorable' : 'On Track'}
                          </span>
                        </td>
                      </tr>

                      {/* Total Variance */}
                      <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                        <td className="px-6 py-4 text-gray-900">Total Cost</td>
                        <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(variance.standardCost.total)}</td>
                        <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(variance.actualCost.total)}</td>
                        <td className={`px-6 py-4 text-right text-lg ${getVarianceColor(variance.variance.total)}`}>
                          {variance.variance.total > 0 ? '+' : ''}{formatCurrency(variance.variance.total)}
                        </td>
                        <td className={`px-6 py-4 text-right text-lg ${getVarianceColor(variance.variance.total)}`}>
                          {variance.variancePercent.total > 0 ? '+' : ''}{variance.variancePercent.total.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border ${getVarianceBgColor(variance.variance.total)}`}>
                            {getVarianceIcon(variance.variance.total)}
                            {variance.variance.total > 0 ? 'Unfavorable' : variance.variance.total < 0 ? 'Favorable' : 'On Track'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
