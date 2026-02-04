'use client'

import { useState } from 'react'
import {
  Calculator,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  Users,
  ArrowUpRight,
  BarChart3
} from 'lucide-react'

interface EstimationStats {
  totalEstimates: number
  pendingEstimates: number
  approvedEstimates: number
  convertedToOrders: number
  totalEstimatedValue: number
  avgEstimateValue: number
  conversionRate: number
  avgProcessingTime: number
  estimatesThisMonth: number
  winRate: number
}

interface Estimate {
  id: string
  customer: string
  project: string
  estimatedValue: number
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'converted'
  createdDate: string
  validUntil: string
  estimator: string
  priority: 'high' | 'medium' | 'low'
  items: number
}

interface RecentActivity {
  id: string
  estimateId: string
  action: string
  user: string
  timestamp: string
  status: string
}

export default function EstimationDashboard() {
  const [stats] = useState<EstimationStats>({
    totalEstimates: 156,
    pendingEstimates: 23,
    approvedEstimates: 45,
    convertedToOrders: 38,
    totalEstimatedValue: 450000000,
    avgEstimateValue: 2884615,
    conversionRate: 24.4,
    avgProcessingTime: 3.5,
    estimatesThisMonth: 42,
    winRate: 84.4
  })

  const [recentEstimates] = useState<Estimate[]>([
    {
      id: 'EST-2025-089',
      customer: 'ABC Manufacturing Ltd',
      project: 'Hydraulic Press System Installation',
      estimatedValue: 45000000,
      status: 'approved',
      createdDate: '2025-10-15',
      validUntil: '2025-11-15',
      estimator: 'Estimator Team A',
      priority: 'high',
      items: 25
    },
    {
      id: 'EST-2025-090',
      customer: 'XYZ Industries Inc',
      project: 'CNC Machine Upgrade Package',
      estimatedValue: 32000000,
      status: 'under_review',
      createdDate: '2025-10-16',
      validUntil: '2025-11-16',
      estimator: 'Estimator Team B',
      priority: 'high',
      items: 18
    },
    {
      id: 'EST-2025-091',
      customer: 'Tech Solutions Pvt Ltd',
      project: 'Automation System Integration',
      estimatedValue: 28000000,
      status: 'submitted',
      createdDate: '2025-10-17',
      validUntil: '2025-11-17',
      estimator: 'Estimator Team A',
      priority: 'medium',
      items: 22
    },
    {
      id: 'EST-2025-092',
      customer: 'Global Exports Corp',
      project: 'Complete Production Line Setup',
      estimatedValue: 56000000,
      status: 'draft',
      createdDate: '2025-10-18',
      validUntil: '2025-11-18',
      estimator: 'Estimator Team C',
      priority: 'high',
      items: 35
    }
  ])

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: 'ACT-001',
      estimateId: 'EST-2025-089',
      action: 'Estimate approved by management',
      user: 'Approval Manager',
      timestamp: '2025-10-18 14:30',
      status: 'approved'
    },
    {
      id: 'ACT-002',
      estimateId: 'EST-2025-090',
      action: 'Sent to technical review',
      user: 'Estimator Team B',
      timestamp: '2025-10-18 12:15',
      status: 'under_review'
    },
    {
      id: 'ACT-003',
      estimateId: 'EST-2025-091',
      action: 'Submitted to customer',
      user: 'Estimator Team A',
      timestamp: '2025-10-17 16:45',
      status: 'submitted'
    },
    {
      id: 'ACT-004',
      estimateId: 'EST-2025-088',
      action: 'Converted to sales order',
      user: 'Sales Team',
      timestamp: '2025-10-17 11:20',
      status: 'converted'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'under_review':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'converted':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 px-3 py-2">
      <div className="w-full space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estimation & Costing</h1>
            <p className="text-gray-600 mt-1">Project estimation, cost calculation, and quotation management</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md">
            <Calculator className="h-5 w-5" />
            New Estimate
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Pending Estimates</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.pendingEstimates}</p>
                <p className="text-xs text-blue-700 mt-1">{stats.totalEstimates} total</p>
              </div>
              <Clock className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Est. Value</p>
                <p className="text-2xl font-bold text-green-900 mt-1">₹{(stats.totalEstimatedValue / 10000000).toFixed(1)}Cr</p>
                <p className="text-xs text-green-700 mt-1">Pipeline value</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.conversionRate}%</p>
                <p className="text-xs text-purple-700 mt-1">{stats.convertedToOrders} converted</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Win Rate</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.winRate}%</p>
                <p className="text-xs text-orange-700 mt-1">Approved estimates</p>
              </div>
              <CheckCircle className="h-10 w-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Recent Estimates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Estimates</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {recentEstimates.map((estimate) => (
                  <div key={estimate.id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{estimate.id}</p>
                        <p className="text-sm text-gray-600 mt-1">{estimate.customer}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(estimate.status)}`}>
                        {estimate.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-700">{estimate.project}</p>
                      <p className="text-xs text-gray-500 mt-1">{estimate.items} items</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">Estimated Value</p>
                        <p className="font-semibold text-gray-900">₹{(estimate.estimatedValue / 10000000).toFixed(2)}Cr</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${getPriorityColor(estimate.priority)}`}>
                          {estimate.priority.toUpperCase()}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">Valid: {estimate.validUntil}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.estimateId}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                      {activity.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Estimate Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.avgEstimateValue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Processing Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgProcessingTime} days</p>
                <p className="text-xs text-green-600 mt-1">-0.5 days improvement</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.estimatesThisMonth}</p>
                <p className="text-xs text-green-600 mt-1">+18% from last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
