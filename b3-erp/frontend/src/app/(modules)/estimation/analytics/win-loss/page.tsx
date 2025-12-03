'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Target,
  Award,
  XCircle,
  DollarSign,
  Calendar,
  Users,
  Percent,
  BarChart3
} from 'lucide-react'

interface WinLossData {
  category: string
  totalEstimates: number
  won: number
  lost: number
  pending: number
  winRate: number
  avgWinValue: number
  avgLossValue: number
  totalWonValue: number
  totalLostValue: number
}

export default function EstimationAnalyticsWinLossPage() {
  const router = useRouter()

  const [winLossData] = useState<WinLossData[]>([
    {
      category: 'Premium Modular Kitchen',
      totalEstimates: 45,
      won: 28,
      lost: 12,
      pending: 5,
      winRate: 70.0,
      avgWinValue: 6800000,
      avgLossValue: 7200000,
      totalWonValue: 190400000,
      totalLostValue: 86400000
    },
    {
      category: 'Island Kitchen',
      totalEstimates: 38,
      won: 22,
      lost: 10,
      pending: 6,
      winRate: 68.8,
      avgWinValue: 5200000,
      avgLossValue: 5800000,
      totalWonValue: 114400000,
      totalLostValue: 58000000
    },
    {
      category: 'L-Shaped Kitchen',
      totalEstimates: 62,
      won: 45,
      lost: 14,
      pending: 3,
      winRate: 76.3,
      avgWinValue: 2900000,
      avgLossValue: 3100000,
      totalWonValue: 130500000,
      totalLostValue: 43400000
    },
    {
      category: 'Parallel Kitchen',
      totalEstimates: 34,
      won: 24,
      lost: 8,
      pending: 2,
      winRate: 75.0,
      avgWinValue: 3100000,
      avgLossValue: 3300000,
      totalWonValue: 74400000,
      totalLostValue: 26400000
    },
    {
      category: 'Compact Kitchen',
      totalEstimates: 28,
      won: 22,
      lost: 5,
      pending: 1,
      winRate: 81.5,
      avgWinValue: 920000,
      avgLossValue: 950000,
      totalWonValue: 20240000,
      totalLostValue: 4750000
    },
    {
      category: 'Commercial Kitchen',
      totalEstimates: 24,
      won: 14,
      lost: 8,
      pending: 2,
      winRate: 63.6,
      avgWinValue: 12500000,
      avgLossValue: 13800000,
      totalWonValue: 175000000,
      totalLostValue: 110400000
    },
    {
      category: 'Institutional Kitchen',
      totalEstimates: 18,
      won: 10,
      lost: 6,
      pending: 2,
      winRate: 62.5,
      avgWinValue: 15200000,
      avgLossValue: 16500000,
      totalWonValue: 152000000,
      totalLostValue: 99000000
    },
    {
      category: 'Builder Package',
      totalEstimates: 12,
      won: 8,
      lost: 3,
      pending: 1,
      winRate: 72.7,
      avgWinValue: 22000000,
      avgLossValue: 24000000,
      totalWonValue: 176000000,
      totalLostValue: 72000000
    }
  ])

  interface LossReason {
    reason: string
    count: number
    percentage: number
    avgValue: number
  }

  const [lossReasons] = useState<LossReason[]>([
    { reason: 'Price too high', count: 28, percentage: 42.4, avgValue: 8500000 },
    { reason: 'Lost to competitor', count: 18, percentage: 27.3, avgValue: 6200000 },
    { reason: 'Timeline not feasible', count: 10, percentage: 15.2, avgValue: 5800000 },
    { reason: 'Customer budget changed', count: 6, percentage: 9.1, avgValue: 7100000 },
    { reason: 'Project cancelled', count: 4, percentage: 6.1, avgValue: 4500000 }
  ])

  const getWinRateColor = (rate: number) => {
    if (rate >= 75) return 'text-green-600'
    if (rate >= 65) return 'text-blue-600'
    if (rate >= 55) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getWinRateBgColor = (rate: number) => {
    if (rate >= 75) return 'bg-green-100 border-green-200'
    if (rate >= 65) return 'bg-blue-100 border-blue-200'
    if (rate >= 55) return 'bg-yellow-100 border-yellow-200'
    return 'bg-red-100 border-red-200'
  }

  const totalEstimates = winLossData.reduce((sum, d) => sum + d.totalEstimates, 0)
  const totalWon = winLossData.reduce((sum, d) => sum + d.won, 0)
  const totalLost = winLossData.reduce((sum, d) => sum + d.lost, 0)
  const totalPending = winLossData.reduce((sum, d) => sum + d.pending, 0)
  const overallWinRate = ((totalWon / (totalWon + totalLost)) * 100).toFixed(1)
  const totalWonValue = winLossData.reduce((sum, d) => sum + d.totalWonValue, 0)
  const totalLostValue = winLossData.reduce((sum, d) => sum + d.totalLostValue, 0)

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
              <p className="text-xs text-blue-700 mt-1">All categories</p>
            </div>
            <BarChart3 className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Won</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{totalWon}</p>
              <p className="text-xs text-green-700 mt-1">₹{(totalWonValue / 10000000).toFixed(1)}Cr value</p>
            </div>
            <Award className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Lost</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{totalLost}</p>
              <p className="text-xs text-red-700 mt-1">₹{(totalLostValue / 10000000).toFixed(1)}Cr value</p>
            </div>
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Win Rate</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{overallWinRate}%</p>
              <p className="text-xs text-purple-700 mt-1">Overall success</p>
            </div>
            <Target className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Win/Loss by Category */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Win/Loss Analysis by Category</h2>
          <p className="text-sm text-gray-600 mt-1">Performance metrics across kitchen categories</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Won
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lost
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Won Value
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lost Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {winLossData.map((data) => (
                <tr key={data.category} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{data.category}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-gray-900">{data.totalEstimates}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-green-600">{data.won}</span>
                      <span className="text-xs text-gray-500">₹{(data.totalWonValue / 10000000).toFixed(1)}Cr</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-red-600">{data.lost}</span>
                      <span className="text-xs text-gray-500">₹{(data.totalLostValue / 10000000).toFixed(1)}Cr</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-yellow-600">{data.pending}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-sm font-bold ${getWinRateColor(data.winRate)}`}>
                        {data.winRate.toFixed(1)}%
                      </span>
                      {data.winRate >= 70 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(data.totalWonValue / 10000000).toFixed(2)}Cr
                    </div>
                    <div className="text-xs text-gray-500">Avg: ₹{(data.avgWinValue / 100000).toFixed(1)}L</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(data.totalLostValue / 10000000).toFixed(2)}Cr
                    </div>
                    <div className="text-xs text-gray-500">Avg: ₹{(data.avgLossValue / 100000).toFixed(1)}L</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loss Reasons Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Loss Reasons</h2>
            <p className="text-sm text-gray-600 mt-1">Why estimates were not converted</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lossReasons.map((reason, index) => (
                <div key={reason.reason} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{reason.reason}</span>
                      <span className="text-sm font-semibold text-red-600">{reason.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${reason.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{reason.percentage.toFixed(1)}% of losses</span>
                      <span className="text-xs text-gray-500">Avg: ₹{(reason.avgValue / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Win Rate Trends</h2>
            <p className="text-sm text-gray-600 mt-1">Monthly performance over time</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {['October 2025', 'September 2025', 'August 2025', 'July 2025', 'June 2025', 'May 2025'].map((month, index) => {
                const rate = 72 - index * 2 + Math.random() * 4
                return (
                  <div key={month} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 w-32">{month}</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            rate >= 70 ? 'bg-green-600' : rate >= 60 ? 'bg-blue-600' : 'bg-yellow-600'
                          }`}
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`text-sm font-bold w-16 text-right ${getWinRateColor(rate)}`}>
                      {rate.toFixed(1)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
