'use client'

import { useState } from 'react'
import { X, Save, TrendingUp, Calendar, Package, DollarSign, Users, Factory, Download, BarChart3, FileText, Layers } from 'lucide-react'

interface AggregatePlan {
  id: string
  planNumber: string
  planName: string
  planningPeriod: string
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'approved' | 'completed'
  createdBy: string
  createdDate: string
}

interface MonthlyPlanInput {
  month: string
  forecastedDemand: number
  regularTimeCapacity: number
  overtimeCapacity: number
  inventoryTarget: number
}

interface NewPlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan?: AggregatePlan | null
  onSave: (data: Partial<AggregatePlan>) => void
}

interface ExportPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: string, options: any) => void
}

interface ScenarioComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: any
}

export function NewPlanModal({ isOpen, onClose, plan, onSave }: NewPlanModalProps) {
  const [formData, setFormData] = useState({
    planNumber: plan?.planNumber || '',
    planName: plan?.planName || '',
    planningPeriod: plan?.planningPeriod || '',
    startDate: plan?.startDate || '',
    endDate: plan?.endDate || '',
    status: plan?.status || 'draft',
  })

  const [monthlyPlans, setMonthlyPlans] = useState<MonthlyPlanInput[]>([
    { month: 'Month 1', forecastedDemand: 0, regularTimeCapacity: 0, overtimeCapacity: 0, inventoryTarget: 0 },
    { month: 'Month 2', forecastedDemand: 0, regularTimeCapacity: 0, overtimeCapacity: 0, inventoryTarget: 0 },
    { month: 'Month 3', forecastedDemand: 0, regularTimeCapacity: 0, overtimeCapacity: 0, inventoryTarget: 0 },
  ])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const updateMonthlyPlan = (index: number, field: keyof MonthlyPlanInput, value: string | number) => {
    const updated = [...monthlyPlans]
    updated[index] = { ...updated[index], [field]: value }
    setMonthlyPlans(updated)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6" />
            <h2 className="text-xl font-semibold">
              {plan ? 'Edit Aggregate Plan' : 'New Aggregate Plan'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Plan Information */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Plan Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Number *</label>
                <input
                  type="text"
                  value={formData.planNumber}
                  onChange={(e) => setFormData({ ...formData, planNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AP-2025-Q4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planning Period *</label>
                <input
                  type="text"
                  value={formData.planningPeriod}
                  onChange={(e) => setFormData({ ...formData, planningPeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Q4 2025"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Q4 2025 Aggregate Production Plan - Kitchen Products"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Monthly Planning Parameters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Planning Parameters
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Forecasted Demand</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Regular Capacity</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Overtime Capacity</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Inventory Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlyPlans.map((month, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={month.month}
                          onChange={(e) => updateMonthlyPlan(idx, 'month', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Oct 2025"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={month.forecastedDemand}
                          onChange={(e) => updateMonthlyPlan(idx, 'forecastedDemand', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={month.regularTimeCapacity}
                          onChange={(e) => updateMonthlyPlan(idx, 'regularTimeCapacity', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={month.overtimeCapacity}
                          onChange={(e) => updateMonthlyPlan(idx, 'overtimeCapacity', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={month.inventoryTarget}
                          onChange={(e) => updateMonthlyPlan(idx, 'inventoryTarget', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                          min="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setMonthlyPlans([...monthlyPlans, { month: `Month ${monthlyPlans.length + 1}`, forecastedDemand: 0, regularTimeCapacity: 0, overtimeCapacity: 0, inventoryTarget: 0 }])}
                className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
              >
                + Add Month
              </button>
              {monthlyPlans.length > 1 && (
                <button
                  type="button"
                  onClick={() => setMonthlyPlans(monthlyPlans.slice(0, -1))}
                  className="px-3 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                >
                  - Remove Last Month
                </button>
              )}
            </div>
          </div>

          {/* Cost Parameters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cost Parameters (Optional)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium">Regular Time Cost</p>
                <p className="text-sm text-gray-600 mt-1">₹1,340/unit</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-600 font-medium">Overtime Cost</p>
                <p className="text-sm text-gray-600 mt-1">₹1,800/unit</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-600 font-medium">Inventory Holding Cost</p>
                <p className="text-sm text-gray-600 mt-1">₹300/unit/month</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium">Subcontracting Cost</p>
                <p className="text-sm text-gray-600 mt-1">₹1,900/unit</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ExportPlanModal({ isOpen, onClose, onExport }: ExportPlanModalProps) {
  const [exportFormat, setExportFormat] = useState('excel')
  const [includeMonthlyDetails, setIncludeMonthlyDetails] = useState(true)
  const [includeCostBreakdown, setIncludeCostBreakdown] = useState(true)
  const [includeCapacityAnalysis, setIncludeCapacityAnalysis] = useState(true)
  const [includeCharts, setIncludeCharts] = useState(true)

  if (!isOpen) return null

  const handleExport = () => {
    const options = {
      includeMonthlyDetails,
      includeCostBreakdown,
      includeCapacityAnalysis,
      includeCharts,
    }
    onExport(exportFormat, options)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Export Aggregate Plan</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Export Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  exportFormat === 'excel'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Excel</div>
                <div className="text-xs text-gray-500 mt-1">.xlsx</div>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  exportFormat === 'csv'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">CSV</div>
                <div className="text-xs text-gray-500 mt-1">.csv</div>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">PDF</div>
                <div className="text-xs text-gray-500 mt-1">.pdf</div>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Include in Export</label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeMonthlyDetails}
                  onChange={(e) => setIncludeMonthlyDetails(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Monthly Details</p>
                  <p className="text-xs text-gray-500">Demand, production, inventory for each month</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeCostBreakdown}
                  onChange={(e) => setIncludeCostBreakdown(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Cost Breakdown</p>
                  <p className="text-xs text-gray-500">Production, inventory, hiring, overtime costs</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeCapacityAnalysis}
                  onChange={(e) => setIncludeCapacityAnalysis(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Capacity Analysis</p>
                  <p className="text-xs text-gray-500">Utilization rates, overtime usage, workforce levels</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  disabled={exportFormat === 'csv'}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Charts & Visualizations</p>
                  <p className="text-xs text-gray-500">
                    {exportFormat === 'csv' ? 'Not available for CSV format' : 'Graphs and charts for better insights'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ScenarioComparisonModal({ isOpen, onClose, currentPlan }: ScenarioComparisonModalProps) {
  const [activeTab, setActiveTab] = useState<'cost' | 'capacity' | 'workforce'>('cost')

  if (!isOpen || !currentPlan) return null

  // Mock scenario data for comparison
  const scenarios = [
    {
      name: 'Current Plan',
      type: 'current',
      totalCost: currentPlan.months.reduce((sum: number, m: any) => sum + m.totalCost, 0),
      avgCapacityUtilization: 85,
      avgWorkforce: 148,
      overtimeHours: 1500,
      inventoryLevel: 1650,
    },
    {
      name: 'Chase Strategy',
      type: 'chase',
      totalCost: 42500000,
      avgCapacityUtilization: 78,
      avgWorkforce: 145,
      overtimeHours: 500,
      inventoryLevel: 800,
    },
    {
      name: 'Level Strategy',
      type: 'level',
      totalCost: 41800000,
      avgCapacityUtilization: 92,
      avgWorkforce: 150,
      overtimeHours: 2800,
      inventoryLevel: 2200,
    },
    {
      name: 'Hybrid Strategy',
      type: 'hybrid',
      totalCost: 40200000,
      avgCapacityUtilization: 88,
      avgWorkforce: 147,
      overtimeHours: 1800,
      inventoryLevel: 1500,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Scenario Comparison</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex gap-1 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('cost')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'cost'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cost Analysis
            </button>
            <button
              onClick={() => setActiveTab('capacity')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'capacity'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Capacity Utilization
            </button>
            <button
              onClick={() => setActiveTab('workforce')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'workforce'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Workforce & Resources
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'cost' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Cost Comparison</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {scenarios.map((scenario, idx) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-lg p-4 ${
                      scenario.type === 'current'
                        ? 'border-blue-500 bg-blue-50'
                        : scenario.totalCost === Math.min(...scenarios.map(s => s.totalCost))
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-600">{scenario.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ₹{(scenario.totalCost / 10000000).toFixed(1)}Cr
                    </p>
                    {scenario.type === 'current' && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                        Current
                      </span>
                    )}
                    {scenario.totalCost === Math.min(...scenarios.map(s => s.totalCost)) && scenario.type !== 'current' && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                        Lowest Cost
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Cost Insights</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Hybrid Strategy offers 4.5% cost savings compared to current plan</li>
                  <li>• Level Strategy has higher inventory costs but lower workforce variability</li>
                  <li>• Chase Strategy minimizes inventory but increases hiring/layoff costs</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'capacity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Utilization Comparison</h3>

              <div className="space-y-4 mb-6">
                {scenarios.map((scenario, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{scenario.name}</span>
                      <span className="text-sm font-bold text-gray-900">{scenario.avgCapacityUtilization}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          scenario.type === 'current'
                            ? 'bg-blue-600'
                            : scenario.avgCapacityUtilization > 90
                            ? 'bg-red-600'
                            : scenario.avgCapacityUtilization > 80
                            ? 'bg-green-600'
                            : 'bg-yellow-600'
                        }`}
                        style={{ width: `${scenario.avgCapacityUtilization}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>Overtime: {scenario.overtimeHours.toLocaleString()} hrs</span>
                      <span>Inventory: {scenario.inventoryLevel.toLocaleString()} units</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-orange-900 mb-2">Capacity Insights</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Level Strategy maximizes capacity utilization at 92%</li>
                  <li>• Chase Strategy has lower utilization but minimal overtime</li>
                  <li>• Current plan maintains balanced 85% utilization</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'workforce' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workforce & Resource Requirements</h3>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strategy</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Workforce</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Overtime Hours</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Inventory Level</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Flexibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scenarios.map((scenario, idx) => (
                      <tr key={idx} className={scenario.type === 'current' ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {scenario.name}
                          {scenario.type === 'current' && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Current</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">{scenario.avgWorkforce}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">{scenario.overtimeHours.toLocaleString()} hrs</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">{scenario.inventoryLevel.toLocaleString()} units</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            scenario.type === 'chase'
                              ? 'bg-green-100 text-green-700'
                              : scenario.type === 'level'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {scenario.type === 'chase' ? 'High' : scenario.type === 'level' ? 'Low' : 'Medium'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-900 mb-2">Workforce Insights</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Level Strategy maintains stable workforce with minimal hiring/layoff</li>
                  <li>• Chase Strategy adjusts workforce dynamically based on demand</li>
                  <li>• Hybrid approach balances workforce stability with flexibility</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button
              className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Apply Selected Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
