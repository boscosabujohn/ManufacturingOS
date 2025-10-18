'use client'

import { useState } from 'react'
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Package,
  Users,
  Settings,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Edit
} from 'lucide-react'

interface JobCost {
  id: string
  jobNumber: string
  jobName: string
  customer: string
  startDate: string
  endDate: string
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  estimatedCost: {
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
  completionPercentage: number
  billingAmount: number
  profitMargin: number
}

export default function JobCostingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [jobs] = useState<JobCost[]>([
    {
      id: 'JOB-001',
      jobNumber: 'J-2025-001',
      jobName: 'Custom Hydraulic Press System',
      customer: 'ABC Manufacturing Ltd',
      startDate: '2025-09-01',
      endDate: '2025-11-30',
      status: 'in_progress',
      estimatedCost: {
        material: 2500000,
        labor: 800000,
        overhead: 500000,
        total: 3800000
      },
      actualCost: {
        material: 2650000,
        labor: 750000,
        overhead: 480000,
        total: 3880000
      },
      variance: {
        material: 150000,
        labor: -50000,
        overhead: -20000,
        total: 80000
      },
      completionPercentage: 75,
      billingAmount: 5500000,
      profitMargin: 29.45
    },
    {
      id: 'JOB-002',
      jobNumber: 'J-2025-002',
      jobName: 'CNC Machine Installation & Setup',
      customer: 'XYZ Industries',
      startDate: '2025-08-15',
      endDate: '2025-10-15',
      status: 'completed',
      estimatedCost: {
        material: 1800000,
        labor: 600000,
        overhead: 400000,
        total: 2800000
      },
      actualCost: {
        material: 1750000,
        labor: 620000,
        overhead: 390000,
        total: 2760000
      },
      variance: {
        material: -50000,
        labor: 20000,
        overhead: -10000,
        total: -40000
      },
      completionPercentage: 100,
      billingAmount: 3800000,
      profitMargin: 27.37
    },
    {
      id: 'JOB-003',
      jobNumber: 'J-2025-003',
      jobName: 'Automation Line - Phase 1',
      customer: 'Global Tech Solutions',
      startDate: '2025-10-01',
      endDate: '2026-03-31',
      status: 'in_progress',
      estimatedCost: {
        material: 5000000,
        labor: 1500000,
        overhead: 1000000,
        total: 7500000
      },
      actualCost: {
        material: 2800000,
        labor: 750000,
        overhead: 520000,
        total: 4070000
      },
      variance: {
        material: -2200000,
        labor: -750000,
        overhead: -480000,
        total: -3430000
      },
      completionPercentage: 45,
      billingAmount: 12000000,
      profitMargin: 37.5
    },
    {
      id: 'JOB-004',
      jobNumber: 'J-2025-004',
      jobName: 'Control Panel Assembly',
      customer: 'Premium Enterprises',
      startDate: '2025-09-20',
      endDate: '2025-11-20',
      status: 'in_progress',
      estimatedCost: {
        material: 1200000,
        labor: 400000,
        overhead: 250000,
        total: 1850000
      },
      actualCost: {
        material: 1350000,
        labor: 420000,
        overhead: 260000,
        total: 2030000
      },
      variance: {
        material: 150000,
        labor: 20000,
        overhead: 10000,
        total: 180000
      },
      completionPercentage: 60,
      billingAmount: 2500000,
      profitMargin: 18.8
    }
  ])

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'on_hold':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const totalActiveJobs = jobs.filter(j => j.status === 'in_progress').length
  const totalEstimatedCost = jobs.reduce((sum, j) => sum + j.estimatedCost.total, 0)
  const totalActualCost = jobs.reduce((sum, j) => sum + j.actualCost.total, 0)
  const totalBilling = jobs.reduce((sum, j) => sum + j.billingAmount, 0)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Costing</h1>
            <p className="text-gray-600 mt-1">Track costs and profitability of individual jobs and projects</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md">
            <Download className="h-5 w-5" />
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Jobs</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{totalActiveJobs}</p>
                <p className="text-xs text-blue-700 mt-1">In progress</p>
              </div>
              <Briefcase className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Estimated</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{formatCurrency(totalEstimatedCost)}</p>
                <p className="text-xs text-purple-700 mt-1">Budgeted cost</p>
              </div>
              <DollarSign className="h-10 w-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Actual Cost</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">{formatCurrency(totalActualCost)}</p>
                <p className="text-xs text-orange-700 mt-1">Cost incurred</p>
              </div>
              <TrendingDown className="h-10 w-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Billing</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalBilling)}</p>
                <p className="text-xs text-green-700 mt-1">Revenue value</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job name, number, or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.jobName}</h3>
                      <p className="text-sm text-gray-600">{job.jobNumber} • {job.customer}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                          {job.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                          {job.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(job.startDate).toLocaleDateString('en-IN')} - {new Date(job.endDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p className={`text-2xl font-bold ${job.profitMargin >= 25 ? 'text-green-600' : job.profitMargin >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {job.profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Job Completion</span>
                    <span className="font-semibold text-gray-900">{job.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 h-3 rounded-full transition-all"
                      style={{ width: `${job.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Estimated */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-blue-600" />
                      Estimated Cost
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(job.estimatedCost.material)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Labor:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(job.estimatedCost.labor)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Overhead:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(job.estimatedCost.overhead)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-blue-600">{formatCurrency(job.estimatedCost.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actual */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-600" />
                      Actual Cost
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(job.actualCost.material)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Labor:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(job.actualCost.labor)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Overhead:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(job.actualCost.overhead)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-orange-600">{formatCurrency(job.actualCost.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Variance */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      Variance
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Material:</span>
                        <span className={`font-medium ${job.variance.material >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {job.variance.material >= 0 ? '+' : ''}{formatCurrency(job.variance.material)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Labor:</span>
                        <span className={`font-medium ${job.variance.labor >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {job.variance.labor >= 0 ? '+' : ''}{formatCurrency(job.variance.labor)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Overhead:</span>
                        <span className={`font-medium ${job.variance.overhead >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {job.variance.overhead >= 0 ? '+' : ''}{formatCurrency(job.variance.overhead)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className={`font-bold ${job.variance.total >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {job.variance.total >= 0 ? '+' : ''}{formatCurrency(job.variance.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 mb-1">Total Billing Amount</p>
                      <p className="text-2xl font-bold text-green-900">{formatCurrency(job.billingAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-700 mb-1">Projected Profit</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(job.billingAmount - job.actualCost.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                    Update Costs
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                    Job Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
