'use client'

import { useState } from 'react'
import {
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  Edit,
  Plus,
  Download,
  Bell,
  Calendar,
  BarChart3,
  Activity,
  CheckCircle,
  Info,
  FileText,
  Users,
  Building2,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react'

// ==================== TYPES ====================

export interface BudgetData {
  id?: string
  category?: string
  department?: string
  budgetAmount?: number
  spentAmount?: number
  committedAmount?: number
  availableAmount?: number
  utilizationPercent?: number
  variance?: number
  variancePercent?: number
  period?: string
  owner?: string
  status?: 'healthy' | 'warning' | 'critical' | 'overspent'
  lastModified?: string
}

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  budget?: BudgetData
  onSubmit?: (data: any) => void
}

// ==================== VIEW BUDGET DETAILS MODAL ====================

export function ViewBudgetDetailsModal({ isOpen, onClose, budget }: BudgetModalProps) {
  if (!isOpen) return null

  const utilizationColor = (percent: number) => {
    if (percent >= 95) return 'text-red-600'
    if (percent >= 85) return 'text-orange-600'
    if (percent >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const statusBadge = (status?: string) => {
    const badges = {
      healthy: 'bg-green-100 text-green-800 border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      critical: 'bg-orange-100 text-orange-800 border-orange-300',
      overspent: 'bg-red-100 text-red-800 border-red-300'
    }
    return badges[status as keyof typeof badges] || badges.healthy
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Budget Details</h2>
              <p className="text-blue-100 text-sm">{budget?.category} - {budget?.period}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Budget</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${budget?.budgetAmount?.toLocaleString()}</p>
              <p className="text-xs text-blue-700 mt-1">{budget?.period}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">Spent</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${budget?.spentAmount?.toLocaleString()}</p>
              <p className="text-xs text-red-700 mt-1">
                {((budget?.spentAmount || 0) / (budget?.budgetAmount || 1) * 100).toFixed(1)}% of budget
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Committed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${budget?.committedAmount?.toLocaleString()}</p>
              <p className="text-xs text-orange-700 mt-1">Pending obligations</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Available</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">${budget?.availableAmount?.toLocaleString()}</p>
              <p className="text-xs text-green-700 mt-1">
                {((budget?.availableAmount || 0) / (budget?.budgetAmount || 1) * 100).toFixed(1)}% remaining
              </p>
            </div>
          </div>

          {/* Utilization Progress */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Budget Utilization</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBadge(budget?.status)}`}>
                {budget?.status?.toUpperCase()}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Overall Utilization</span>
                  <span className={`font-bold ${utilizationColor(budget?.utilizationPercent || 0)}`}>
                    {budget?.utilizationPercent?.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      (budget?.utilizationPercent || 0) >= 95 ? 'bg-gradient-to-r from-red-600 to-red-500' :
                      (budget?.utilizationPercent || 0) >= 85 ? 'bg-gradient-to-r from-orange-600 to-orange-500' :
                      (budget?.utilizationPercent || 0) >= 75 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' :
                      'bg-gradient-to-r from-green-600 to-green-500'
                    }`}
                    style={{ width: `${Math.min(budget?.utilizationPercent || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Spent</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-900">
                      ${budget?.spentAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Committed</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-900">
                      ${budget?.committedAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Available</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-900">
                      ${budget?.availableAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Budget Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{budget?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium text-gray-900">{budget?.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget Owner:</span>
                  <span className="font-medium text-gray-900">{budget?.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium text-gray-900">{budget?.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium text-gray-900">{budget?.lastModified}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Variance Analysis
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Variance Amount:</span>
                  <span className={`font-bold ${(budget?.variance || 0) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(budget?.variance || 0) < 0 ? '-' : '+'}${Math.abs(budget?.variance || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Variance %:</span>
                  <span className={`font-bold ${(budget?.variancePercent || 0) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(budget?.variancePercent || 0) < 0 ? '' : '+'}{budget?.variancePercent?.toFixed(1)}%
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className={`p-3 rounded-lg ${
                    (budget?.variance || 0) < 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-xs ${(budget?.variance || 0) < 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {(budget?.variance || 0) < 0
                        ? `Under budget by $${Math.abs(budget?.variance || 0).toLocaleString()}. Good budget management.`
                        : `Over budget by $${Math.abs(budget?.variance || 0).toLocaleString()}. Review spending immediately.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Required */}
          {(budget?.status === 'critical' || budget?.status === 'overspent') && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900">Action Required</h4>
                <p className="text-sm text-red-700 mt-1">
                  This budget line is {budget?.status === 'overspent' ? 'overspent' : 'critically low'}.
                  Immediate action is required to prevent overspending or request budget adjustment.
                </p>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== ADJUST BUDGET MODAL ====================

export function AdjustBudgetModal({ isOpen, onClose, budget, onSubmit }: BudgetModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease'>('increase')
  const [adjustmentAmount, setAdjustmentAmount] = useState('')
  const [adjustmentPercent, setAdjustmentPercent] = useState('')
  const [useAmount, setUseAmount] = useState(true)
  const [reason, setReason] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [requiresApproval, setRequiresApproval] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newBudget = useAmount
      ? (budget?.budgetAmount || 0) + (adjustmentType === 'increase' ? 1 : -1) * parseFloat(adjustmentAmount)
      : (budget?.budgetAmount || 0) * (1 + (adjustmentType === 'increase' ? 1 : -1) * parseFloat(adjustmentPercent) / 100)

    onSubmit?.({
      adjustmentType,
      adjustmentAmount: useAmount ? parseFloat(adjustmentAmount) : null,
      adjustmentPercent: !useAmount ? parseFloat(adjustmentPercent) : null,
      newBudget,
      reason,
      effectiveDate,
      requiresApproval
    })
  }

  const calculatedNewBudget = useAmount
    ? (budget?.budgetAmount || 0) + (adjustmentType === 'increase' ? 1 : -1) * (parseFloat(adjustmentAmount) || 0)
    : (budget?.budgetAmount || 0) * (1 + (adjustmentType === 'increase' ? 1 : -1) * (parseFloat(adjustmentPercent) || 0) / 100)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Edit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Adjust Budget</h2>
              <p className="text-purple-100 text-sm">{budget?.category} - {budget?.period}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Budget Info */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-900 mb-3">Current Budget Status</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Budget:</span>
                <p className="font-bold text-gray-900 text-lg">${budget?.budgetAmount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Spent:</span>
                <p className="font-medium text-gray-900">${budget?.spentAmount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Available:</span>
                <p className="font-medium text-gray-900">${budget?.availableAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Adjustment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Adjustment Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  adjustmentType === 'increase'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  value="increase"
                  checked={adjustmentType === 'increase'}
                  onChange={(e) => setAdjustmentType(e.target.value as 'increase')}
                  className="sr-only"
                />
                <div className="text-center">
                  <ArrowUpRight className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Increase Budget</span>
                </div>
              </label>

              <label
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  adjustmentType === 'decrease'
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <input
                  type="radio"
                  value="decrease"
                  checked={adjustmentType === 'decrease'}
                  onChange={(e) => setAdjustmentType(e.target.value as 'decrease')}
                  className="sr-only"
                />
                <div className="text-center">
                  <ArrowDownRight className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">Decrease Budget</span>
                </div>
              </label>
            </div>
          </div>

          {/* Adjustment Amount/Percent */}
          <div>
            <div className="flex items-center gap-4 mb-3">
              <label className="text-sm font-medium text-gray-700">
                Adjustment Value <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUseAmount(true)}
                  className={`px-3 py-1 text-xs rounded ${
                    useAmount ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Amount ($)
                </button>
                <button
                  type="button"
                  onClick={() => setUseAmount(false)}
                  className={`px-3 py-1 text-xs rounded ${
                    !useAmount ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Percentage (%)
                </button>
              </div>
            </div>

            {useAmount ? (
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
            ) : (
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={adjustmentPercent}
                  onChange={(e) => setAdjustmentPercent(e.target.value)}
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter percentage"
                />
              </div>
            )}
          </div>

          {/* Calculated New Budget */}
          {(adjustmentAmount || adjustmentPercent) && (
            <div className={`rounded-lg p-4 border-2 ${
              adjustmentType === 'increase'
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">New Budget Amount:</span>
                  <p className={`text-2xl font-bold ${
                    adjustmentType === 'increase' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    ${calculatedNewBudget.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Change:</span>
                  <p className={`text-xl font-semibold ${
                    adjustmentType === 'increase' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {adjustmentType === 'increase' ? '+' : '-'}
                    ${(useAmount ? parseFloat(adjustmentAmount || '0') : Math.abs((budget?.budgetAmount || 0) - calculatedNewBudget)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Effective Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Reason for Adjustment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Justification / Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Explain the reason for this budget adjustment..."
            />
            <p className="text-xs text-gray-500 mt-1">Required for audit trail and approval process</p>
          </div>

          {/* Approval Required */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Submit for approval</span>
                <p className="text-xs text-gray-500">Budget adjustments typically require management approval</p>
              </div>
            </label>
          </div>

          {/* Warning for Decreases */}
          {adjustmentType === 'decrease' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-orange-900">Budget Decrease Warning</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Decreasing the budget may affect planned purchases and commitments.
                  Ensure all stakeholders are notified and committed amounts are reviewed.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {requiresApproval ? 'Submit for Approval' : 'Adjust Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== BUDGET FORECAST MODAL ====================

export function BudgetForecastModal({ isOpen, onClose, budget, onSubmit }: BudgetModalProps) {
  const [forecastPeriod, setForecastPeriod] = useState('quarter')
  const [forecastMethod, setForecastMethod] = useState('historical')
  const [growthRate, setGrowthRate] = useState('')
  const [seasonalAdjustment, setSeasonalAdjustment] = useState(false)
  const [includeCommitments, setIncludeCommitments] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      forecastPeriod,
      forecastMethod,
      growthRate: parseFloat(growthRate),
      seasonalAdjustment,
      includeCommitments
    })
  }

  // Mock forecast data
  const forecastData = {
    currentSpendRate: 125000,
    projectedTotal: 1500000,
    budgetRemaining: 250000,
    projectedOverrun: 0,
    confidence: 85
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Budget Forecast</h2>
              <p className="text-cyan-100 text-sm">{budget?.category} - Predictive Analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
            <h3 className="text-sm font-semibold text-cyan-900 mb-3">Current Budget Status</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-gray-600">Total Budget</span>
                <p className="text-lg font-bold text-gray-900">${budget?.budgetAmount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-600">Spent to Date</span>
                <p className="text-lg font-bold text-gray-900">${budget?.spentAmount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-600">Committed</span>
                <p className="text-lg font-bold text-gray-900">${budget?.committedAmount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-600">Remaining</span>
                <p className="text-lg font-bold text-gray-900">${budget?.availableAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Forecast Parameters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forecast Period
            </label>
            <select
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="month">Next Month</option>
              <option value="quarter">Next Quarter</option>
              <option value="half-year">Next 6 Months</option>
              <option value="year">Year End</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forecasting Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['historical', 'linear', 'custom'].map((method) => (
                <label
                  key={method}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    forecastMethod === method
                      ? 'border-cyan-600 bg-cyan-50'
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={method}
                    checked={forecastMethod === method}
                    onChange={(e) => setForecastMethod(e.target.value)}
                    className="sr-only"
                  />
                  <BarChart3 className="w-6 h-6 mb-2 text-cyan-600" />
                  <span className="text-sm font-medium text-gray-900 capitalize">{method}</span>
                  <span className="text-xs text-gray-500 text-center mt-1">
                    {method === 'historical' && 'Based on past trends'}
                    {method === 'linear' && 'Current run rate'}
                    {method === 'custom' && 'Manual adjustment'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {forecastMethod === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Growth Rate (%)
              </label>
              <input
                type="number"
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="e.g., 5.5 for 5.5% growth"
              />
            </div>
          )}

          {/* Advanced Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={seasonalAdjustment}
                onChange={(e) => setSeasonalAdjustment(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Apply seasonal adjustments</span>
                <p className="text-xs text-gray-500">Account for seasonal spending patterns</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCommitments}
                onChange={(e) => setIncludeCommitments(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Include committed amounts</span>
                <p className="text-xs text-gray-500">Add pending purchase orders and commitments</p>
              </div>
            </label>
          </div>

          {/* Forecast Results Preview */}
          <div className="bg-white rounded-lg p-5 border-2 border-cyan-300">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-600" />
              Forecast Preview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <span className="text-xs text-blue-700">Projected Total Spend</span>
                <p className="text-2xl font-bold text-blue-900">${forecastData.projectedTotal.toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(forecastData.projectedTotal / (budget?.budgetAmount || 1)) * 100}%` }}></div>
                  </div>
                  <span className="text-xs font-medium text-blue-700">
                    {((forecastData.projectedTotal / (budget?.budgetAmount || 1)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <span className="text-xs text-green-700">Budget Remaining</span>
                <p className="text-2xl font-bold text-green-900">${forecastData.budgetRemaining.toLocaleString()}</p>
                <p className="text-xs text-green-700 mt-2">
                  Confidence: {forecastData.confidence}%
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
              <p className="text-sm text-cyan-900">
                <strong>Analysis:</strong> Based on current spending trends, you're projected to finish {
                  forecastData.projectedTotal <= (budget?.budgetAmount || 0)
                    ? `under budget by $${((budget?.budgetAmount || 0) - forecastData.projectedTotal).toLocaleString()}`
                    : `over budget by $${(forecastData.projectedTotal - (budget?.budgetAmount || 0)).toLocaleString()}`
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Generate Forecast Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== BUDGET ALERT SETUP MODAL ====================

export function BudgetAlertSetupModal({ isOpen, onClose, budget, onSubmit }: BudgetModalProps) {
  const [alertThreshold, setAlertThreshold] = useState('85')
  const [alertType, setAlertType] = useState<'utilization' | 'remaining' | 'overrun'>('utilization')
  const [recipients, setRecipients] = useState<string[]>(['budget_owner'])
  const [alertFrequency, setAlertFrequency] = useState('immediate')
  const [escalation, setEscalation] = useState(false)
  const [escalationThreshold, setEscalationThreshold] = useState('95')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      alertThreshold: parseFloat(alertThreshold),
      alertType,
      recipients,
      alertFrequency,
      escalation,
      escalationThreshold: escalation ? parseFloat(escalationThreshold) : null
    })
  }

  const toggleRecipient = (recipient: string) => {
    setRecipients(prev =>
      prev.includes(recipient) ? prev.filter(r => r !== recipient) : [...prev, recipient]
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Budget Alert Setup</h2>
              <p className="text-orange-100 text-sm">{budget?.category} - {budget?.period}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alert Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Alert Trigger Type
            </label>
            <div className="space-y-2">
              {[
                { value: 'utilization', label: 'Budget Utilization %', desc: 'Alert when budget usage reaches threshold' },
                { value: 'remaining', label: 'Amount Remaining', desc: 'Alert when remaining budget falls below amount' },
                { value: 'overrun', label: 'Budget Overrun', desc: 'Alert when spending exceeds budget' }
              ].map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    alertType === type.value
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.value}
                    checked={alertType === type.value}
                    onChange={(e) => setAlertType(e.target.value as any)}
                    className="mt-1 w-4 h-4 text-orange-600"
                  />
                  <div className="ml-3 flex-1">
                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    <p className="text-xs text-gray-500">{type.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Threshold {alertType === 'utilization' ? '(%)' : '($)'}
            </label>
            <div className="relative">
              {alertType === 'utilization' ? (
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              ) : (
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              )}
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                required
                min="0"
                max={alertType === 'utilization' ? '100' : undefined}
                step={alertType === 'utilization' ? '1' : '0.01'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={alertType === 'utilization' ? 'e.g., 85' : 'e.g., 50000'}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {alertType === 'utilization' && `Alert when budget utilization reaches ${alertThreshold}%`}
              {alertType === 'remaining' && `Alert when remaining budget falls below $${alertThreshold}`}
              {alertType === 'overrun' && `Alert when spending exceeds budget by $${alertThreshold}`}
            </p>
          </div>

          {/* Alert Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Frequency
            </label>
            <select
              value={alertFrequency}
              onChange={(e) => setAlertFrequency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="immediate">Immediate (Real-time)</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
              <option value="threshold">Only at Threshold</option>
            </select>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Alert Recipients
            </label>
            <div className="space-y-2">
              {[
                { value: 'budget_owner', label: 'Budget Owner', desc: budget?.owner || 'Primary budget manager' },
                { value: 'department_head', label: 'Department Head', desc: budget?.department || 'Department manager' },
                { value: 'procurement_team', label: 'Procurement Team', desc: 'All procurement team members' },
                { value: 'finance_team', label: 'Finance Team', desc: 'Finance department' },
                { value: 'executives', label: 'Executive Team', desc: 'C-level executives' }
              ].map((recipient) => (
                <label
                  key={recipient.value}
                  className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={recipients.includes(recipient.value)}
                    onChange={() => toggleRecipient(recipient.value)}
                    className="mt-1 w-4 h-4 text-orange-600 rounded"
                  />
                  <div className="ml-3 flex-1">
                    <span className="text-sm font-medium text-gray-900">{recipient.label}</span>
                    <p className="text-xs text-gray-500">{recipient.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Escalation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={escalation}
                onChange={(e) => setEscalation(e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Enable escalation alerts</span>
                <p className="text-xs text-gray-500">Send critical alerts to management at higher threshold</p>
              </div>
            </label>
            {escalation && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escalation Threshold (%)
                </label>
                <input
                  type="number"
                  value={escalationThreshold}
                  onChange={(e) => setEscalationThreshold(e.target.value)}
                  min={alertThreshold}
                  max="100"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 95"
                />
                <p className="text-xs text-gray-500 mt-1">Escalate to executives at this threshold</p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-orange-900 mb-2">Alert Preview</h4>
            <p className="text-sm text-orange-800">
              <strong>Trigger:</strong> When {alertType === 'utilization' ? `budget utilization reaches ${alertThreshold}%` : alertType === 'remaining' ? `remaining budget falls below $${alertThreshold}` : `spending exceeds budget by $${alertThreshold}`}
            </p>
            <p className="text-sm text-orange-800 mt-1">
              <strong>Recipients:</strong> {recipients.length} group(s) will be notified
            </p>
            <p className="text-sm text-orange-800 mt-1">
              <strong>Frequency:</strong> {alertFrequency === 'immediate' ? 'Real-time notifications' : `${alertFrequency} updates`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Configure Alerts
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== EXPORT BUDGET MODAL ====================

export function ExportBudgetModal({ isOpen, onClose, onSubmit }: Omit<BudgetModalProps, 'budget'>) {
  const [exportFormat, setExportFormat] = useState('excel')
  const [exportScope, setExportScope] = useState('current')
  const [includeForecast, setIncludeForecast] = useState(true)
  const [includeVariance, setIncludeVariance] = useState(true)
  const [includeCharts, setIncludeCharts] = useState(false)
  const [dateRange, setDateRange] = useState('ytd')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      format: exportFormat,
      scope: exportScope,
      includeForecast,
      includeVariance,
      includeCharts,
      dateRange
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Export Budget Report</h2>
              <p className="text-green-100 text-sm">Download budget data and analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['excel', 'pdf', 'csv'].map((format) => (
                <label
                  key={format}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    exportFormat === format
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={format}
                    checked={exportFormat === format}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <FileText className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900 uppercase">{format}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Scope
            </label>
            <select
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="current">Current Budget Line</option>
              <option value="department">All Department Budgets</option>
              <option value="category">All Category Budgets</option>
              <option value="all">All Budgets</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="ytd">Year to Date</option>
              <option value="month">Current Month</option>
              <option value="quarter">Current Quarter</option>
              <option value="year">Full Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include in Export
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVariance}
                  onChange={(e) => setIncludeVariance(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-900">Variance analysis and trends</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeForecast}
                  onChange={(e) => setIncludeForecast(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-900">Budget forecast projections</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  disabled={exportFormat === 'csv'}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500 disabled:opacity-50"
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-900">Charts and visualizations</span>
                  {exportFormat === 'csv' && (
                    <p className="text-xs text-gray-500">Not available for CSV format</p>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Export Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Export Preview</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Format: <span className="font-medium uppercase">{exportFormat}</span></p>
              <p>Scope: <span className="font-medium">{exportScope.replace('_', ' ')}</span></p>
              <p>Period: <span className="font-medium">{dateRange === 'ytd' ? 'Year to Date' : dateRange}</span></p>
              <p>Estimated Size: <span className="font-medium">~1.2 MB</span></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
