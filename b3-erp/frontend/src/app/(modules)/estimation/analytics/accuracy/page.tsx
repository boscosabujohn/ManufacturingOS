'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react'
import { ClickableTableRow } from '@/components/reports/ClickableTableRow'

interface AccuracyData {
  projectName: string
  estimateNumber: string
  category: string
  estimatedCost: number
  actualCost: number
  variance: number
  variancePercent: number
  status: 'accurate' | 'over-estimated' | 'under-estimated'
  completedDate: string
  estimator: string
}

export default function EstimationAnalyticsAccuracyPage() {
  const router = useRouter()

  const [accuracyData] = useState<AccuracyData[]>([
    {
      projectName: 'Luxury Villa Kitchen',
      estimateNumber: 'EST-2025-0095',
      category: 'Island Kitchen',
      estimatedCost: 6500000,
      actualCost: 6350000,
      variance: -150000,
      variancePercent: -2.3,
      status: 'accurate',
      completedDate: '2025-10-08',
      estimator: 'Amit Sharma'
    },
    {
      projectName: 'Corporate Cafeteria',
      estimateNumber: 'EST-2025-0088',
      category: 'Institutional Kitchen',
      estimatedCost: 9500000,
      actualCost: 10200000,
      variance: 700000,
      variancePercent: 7.4,
      status: 'under-estimated',
      completedDate: '2025-10-05',
      estimator: 'Neha Patel'
    },
    {
      projectName: '3BHK L-Shaped Kitchen',
      estimateNumber: 'EST-2025-0092',
      category: 'L-Shaped Kitchen',
      estimatedCost: 2750000,
      actualCost: 2720000,
      variance: -30000,
      variancePercent: -1.1,
      status: 'accurate',
      completedDate: '2025-10-03',
      estimator: 'Vikram Singh'
    },
    {
      projectName: 'Builder Package - 50 Units',
      estimateNumber: 'EST-2025-0080',
      category: 'Builder Package',
      estimatedCost: 18500000,
      actualCost: 17800000,
      variance: -700000,
      variancePercent: -3.8,
      status: 'accurate',
      completedDate: '2025-09-28',
      estimator: 'Ravi Kumar'
    },
    {
      projectName: 'Premium Penthouse Kitchen',
      estimateNumber: 'EST-2025-0085',
      category: 'Premium Modular Kitchen',
      estimatedCost: 7800000,
      actualCost: 8500000,
      variance: 700000,
      variancePercent: 9.0,
      status: 'under-estimated',
      completedDate: '2025-09-25',
      estimator: 'Amit Sharma'
    },
    {
      projectName: 'Compact Studio Kitchen',
      estimateNumber: 'EST-2025-0090',
      category: 'Compact Kitchen',
      estimatedCost: 850000,
      actualCost: 820000,
      variance: -30000,
      variancePercent: -3.5,
      status: 'accurate',
      completedDate: '2025-09-22',
      estimator: 'Vikram Singh'
    },
    {
      projectName: 'Hotel Chain - 8 Kitchens',
      estimateNumber: 'EST-2025-0075',
      category: 'Commercial Kitchen',
      estimatedCost: 22000000,
      actualCost: 23800000,
      variance: 1800000,
      variancePercent: 8.2,
      status: 'under-estimated',
      completedDate: '2025-09-18',
      estimator: 'Neha Patel'
    },
    {
      projectName: 'Parallel Kitchen with Utility',
      estimateNumber: 'EST-2025-0082',
      category: 'Parallel Kitchen',
      estimatedCost: 3200000,
      actualCost: 3150000,
      variance: -50000,
      variancePercent: -1.6,
      status: 'accurate',
      completedDate: '2025-09-15',
      estimator: 'Ravi Kumar'
    },
    {
      projectName: 'Restaurant Kitchen Setup',
      estimateNumber: 'EST-2025-0070',
      category: 'Commercial Kitchen',
      estimatedCost: 8500000,
      actualCost: 9500000,
      variance: 1000000,
      variancePercent: 11.8,
      status: 'under-estimated',
      completedDate: '2025-09-10',
      estimator: 'Neha Patel'
    },
    {
      projectName: 'Duplex Island Kitchen',
      estimateNumber: 'EST-2025-0078',
      category: 'Island Kitchen',
      estimatedCost: 5200000,
      actualCost: 4950000,
      variance: -250000,
      variancePercent: -4.8,
      status: 'accurate',
      completedDate: '2025-09-08',
      estimator: 'Amit Sharma'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accurate':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'over-estimated':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'under-estimated':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) <= 5) return 'text-green-600'
    if (variance > 0) return 'text-red-600'
    return 'text-blue-600'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accurate':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'over-estimated':
        return <TrendingDown className="h-5 w-5 text-blue-600" />
      case 'under-estimated':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <XCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const totalProjects = accuracyData.length
  const accurateCount = accuracyData.filter(d => d.status === 'accurate').length
  const underEstimatedCount = accuracyData.filter(d => d.status === 'under-estimated').length
  const overEstimatedCount = accuracyData.filter(d => d.status === 'over-estimated').length
  const accuracyRate = ((accurateCount / totalProjects) * 100).toFixed(1)
  const avgVariance = (
    accuracyData.reduce((sum, d) => sum + Math.abs(d.variancePercent), 0) / totalProjects
  ).toFixed(1)

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Completed Projects</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalProjects}</p>
              <p className="text-xs text-blue-700 mt-1">Analyzed</p>
            </div>
            <Target className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Accurate (±5%)</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{accurateCount}</p>
              <p className="text-xs text-green-700 mt-1">{accuracyRate}% rate</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Under-Estimated</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{underEstimatedCount}</p>
              <p className="text-xs text-red-700 mt-1">Cost overruns</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Over-Estimated</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{overEstimatedCount}</p>
              <p className="text-xs text-blue-700 mt-1">Cost savings</p>
            </div>
            <TrendingDown className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Variance</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{avgVariance}%</p>
              <p className="text-xs text-purple-700 mt-1">Absolute deviation</p>
            </div>
            <Percent className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Accuracy Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Accuracy Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Accurate (±5%)</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{accurateCount}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(accurateCount / totalProjects) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              {((accurateCount / totalProjects) * 100).toFixed(1)}% of projects
            </p>
          </div>

          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">Under-Estimated</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{underEstimatedCount}</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${(underEstimatedCount / totalProjects) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-red-700 mt-2">
              {((underEstimatedCount / totalProjects) * 100).toFixed(1)}% of projects
            </p>
          </div>

          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Over-Estimated</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{overEstimatedCount}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(overEstimatedCount / totalProjects) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              {((overEstimatedCount / totalProjects) * 100).toFixed(1)}% of projects
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Accuracy Data */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Estimation vs Actual Cost Analysis</h2>
          <p className="text-sm text-gray-600 mt-1">Completed projects with cost comparison</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimated Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimator
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accuracyData.map((data) => (
                <ClickableTableRow
                  key={data.estimateNumber}
                  onClick={() => router.push(`/estimation?estimateId=${encodeURIComponent(data.estimateNumber)}`)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{data.projectName}</div>
                    <div className="text-xs text-gray-500">{data.estimateNumber}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{data.category}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(data.estimatedCost / 100000).toFixed(2)}L
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(data.actualCost / 100000).toFixed(2)}L
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-bold ${getVarianceColor(data.variancePercent)}`}>
                      {data.variancePercent > 0 && '+'}
                      {data.variancePercent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.variance > 0 && '+'}₹{(Math.abs(data.variance) / 100000).toFixed(1)}L
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(data.status)}
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(data.status)}`}>
                        {data.status === 'accurate' && 'Accurate'}
                        {data.status === 'over-estimated' && 'Over'}
                        {data.status === 'under-estimated' && 'Under'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{data.estimator}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{data.completedDate}</div>
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
