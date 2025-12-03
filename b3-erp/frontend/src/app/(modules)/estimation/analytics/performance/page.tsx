'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  TrendingUp,
  Clock,
  Download,
  Filter,
  Target,
  Award,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Percent,
  BarChart3
} from 'lucide-react'
import { ClickableTableRow } from '@/components/reports/ClickableTableRow'

interface EstimatorPerformance {
  name: string
  totalEstimates: number
  won: number
  pending: number
  winRate: number
  avgTurnaround: number
  totalValue: number
  avgValue: number
  accuracy: number
  productivity: number
}

interface CategoryMetrics {
  category: string
  count: number
  value: number
  avgTime: number
  winRate: number
}

export default function EstimationAnalyticsPerformancePage() {
  const router = useRouter()

  const [estimatorPerformance] = useState<EstimatorPerformance[]>([
    {
      name: 'Amit Sharma',
      totalEstimates: 68,
      won: 48,
      pending: 5,
      winRate: 76.2,
      avgTurnaround: 3.2,
      totalValue: 385000000,
      avgValue: 5661765,
      accuracy: 94.5,
      productivity: 92
    },
    {
      name: 'Neha Patel',
      totalEstimates: 62,
      won: 42,
      pending: 6,
      winRate: 75.0,
      avgTurnaround: 3.5,
      totalValue: 425000000,
      avgValue: 6854839,
      accuracy: 91.2,
      productivity: 88
    },
    {
      name: 'Vikram Singh',
      totalEstimates: 58,
      won: 44,
      pending: 3,
      winRate: 80.0,
      avgTurnaround: 2.8,
      totalValue: 168000000,
      avgValue: 2896552,
      accuracy: 96.8,
      productivity: 95
    },
    {
      name: 'Ravi Kumar',
      totalEstimates: 52,
      won: 38,
      pending: 4,
      winRate: 79.2,
      avgTurnaround: 3.0,
      totalValue: 425000000,
      avgValue: 8173077,
      accuracy: 93.5,
      productivity: 90
    },
    {
      name: 'Priya Menon',
      totalEstimates: 45,
      won: 30,
      pending: 8,
      winRate: 81.1,
      avgTurnaround: 4.2,
      totalValue: 215000000,
      avgValue: 4777778,
      accuracy: 89.5,
      productivity: 82
    }
  ])

  const [categoryMetrics] = useState<CategoryMetrics[]>([
    {
      category: 'Premium Modular Kitchen',
      count: 45,
      value: 290000000,
      avgTime: 4.5,
      winRate: 70.0
    },
    {
      category: 'Island Kitchen',
      count: 38,
      value: 185000000,
      avgTime: 4.0,
      winRate: 68.8
    },
    {
      category: 'L-Shaped Kitchen',
      count: 62,
      value: 175000000,
      avgTime: 3.2,
      winRate: 76.3
    },
    {
      category: 'Parallel Kitchen',
      count: 34,
      value: 105000000,
      avgTime: 3.0,
      winRate: 75.0
    },
    {
      category: 'Compact Kitchen',
      count: 28,
      value: 25000000,
      avgTime: 2.5,
      winRate: 81.5
    },
    {
      category: 'Commercial Kitchen',
      count: 24,
      value: 300000000,
      avgTime: 5.5,
      winRate: 63.6
    },
    {
      category: 'Institutional Kitchen',
      count: 18,
      value: 270000000,
      avgTime: 6.0,
      winRate: 62.5
    },
    {
      category: 'Builder Package',
      count: 12,
      value: 230000000,
      avgTime: 5.0,
      winRate: 72.7
    }
  ])

  const getPerformanceColor = (value: number, type: 'winRate' | 'accuracy' | 'productivity') => {
    if (type === 'winRate') {
      if (value >= 75) return 'text-green-600'
      if (value >= 65) return 'text-blue-600'
      if (value >= 55) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'accuracy' || type === 'productivity') {
      if (value >= 90) return 'text-green-600'
      if (value >= 80) return 'text-blue-600'
      if (value >= 70) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  const totalEstimates = estimatorPerformance.reduce((sum, e) => sum + e.totalEstimates, 0)
  const totalValue = estimatorPerformance.reduce((sum, e) => sum + e.totalValue, 0)
  const avgWinRate = (
    estimatorPerformance.reduce((sum, e) => sum + e.winRate, 0) / estimatorPerformance.length
  ).toFixed(1)
  const avgAccuracy = (
    estimatorPerformance.reduce((sum, e) => sum + e.accuracy, 0) / estimatorPerformance.length
  ).toFixed(1)

  return (
    <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Estimates</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalEstimates}</p>
              <p className="text-xs text-blue-700 mt-1">All estimators</p>
            </div>
            <BarChart3 className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Value</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹{(totalValue / 10000000).toFixed(1)}Cr</p>
              <p className="text-xs text-green-700 mt-1">Pipeline created</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Win Rate</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{avgWinRate}%</p>
              <p className="text-xs text-purple-700 mt-1">Team average</p>
            </div>
            <Target className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Accuracy</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{avgAccuracy}%</p>
              <p className="text-xs text-orange-700 mt-1">Team average</p>
            </div>
            <CheckCircle className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Estimator Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Estimator Performance</h2>
          <p className="text-sm text-gray-600 mt-1">Individual performance metrics and KPIs</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimator
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Estimates
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Won
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Turnaround
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productivity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estimatorPerformance.map((estimator) => (
                <ClickableTableRow
                  key={estimator.name}
                  onClick={() => router.push(`/estimation?estimator=${encodeURIComponent(estimator.name)}`)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{estimator.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-gray-900">{estimator.totalEstimates}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-green-600">{estimator.won}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-yellow-600">{estimator.pending}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-sm font-bold ${getPerformanceColor(estimator.winRate, 'winRate')}`}>
                        {estimator.winRate.toFixed(1)}%
                      </span>
                      {estimator.winRate >= 75 && <TrendingUp className="h-4 w-4 text-green-600" />}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{estimator.avgTurnaround.toFixed(1)} days</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(estimator.totalValue / 10000000).toFixed(2)}Cr
                    </div>
                    <div className="text-xs text-gray-500">Avg: ₹{(estimator.avgValue / 100000).toFixed(1)}L</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`text-sm font-bold ${getPerformanceColor(estimator.accuracy, 'accuracy')}`}>
                      {estimator.accuracy.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-20">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${estimator.productivity >= 90
                              ? 'bg-green-600'
                              : estimator.productivity >= 80
                                ? 'bg-blue-600'
                                : 'bg-yellow-600'
                              }`}
                            style={{ width: `${estimator.productivity}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`ml-2 text-sm font-semibold ${getPerformanceColor(estimator.productivity, 'productivity')}`}>
                        {estimator.productivity}%
                      </span>
                    </div>
                  </td>
                </ClickableTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
          <p className="text-sm text-gray-600 mt-1">Performance metrics by kitchen category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Value
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Time
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryMetrics.map((category) => (
                <ClickableTableRow
                  key={category.category}
                  onClick={() => router.push(`/estimation?category=${encodeURIComponent(category.category)}`)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.category}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-gray-900">{category.count}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(category.value / 10000000).toFixed(2)}Cr
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">₹{(category.value / category.count / 100000).toFixed(1)}L</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{category.avgTime.toFixed(1)} days</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className={`text-sm font-bold ${getPerformanceColor(category.winRate, 'winRate')}`}>
                      {category.winRate.toFixed(1)}%
                    </span>
                  </td>
                </ClickableTableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
