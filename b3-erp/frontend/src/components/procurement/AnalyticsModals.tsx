"use client"

import React, { useState } from 'react'
import { X, Plus, CheckCircle, Download, Calendar, BarChart3, PieChart, LineChart as LineChartIcon, Settings, Save, Mail, Clock, FileText, Eye, Filter, Target, TrendingUp, DollarSign, Users } from 'lucide-react'

// ==================== INTERFACES ====================

export interface ReportConfig {
  id?: string
  reportName: string
  reportType: 'spend_analysis' | 'supplier_performance' | 'savings' | 'compliance' | 'cycle_time' | 'custom'
  description: string
  metrics: string[]
  filters: {
    dateRange: string
    startDate?: string
    endDate?: string
    category?: string[]
    supplier?: string[]
    department?: string[]
    status?: string[]
  }
  groupBy: 'category' | 'supplier' | 'department' | 'month' | 'quarter' | 'year'
  chartType: 'bar' | 'line' | 'pie' | 'table' | 'combo'
  includeComparisons: boolean
  comparisonPeriod?: string
  createdBy: string
  createdDate: string
  isPublic: boolean
  scheduledExport?: boolean
}

export interface DashboardWidget {
  id: string
  type: 'kpi' | 'chart' | 'table' | 'metric'
  title: string
  position: { x: number; y: number; w: number; h: number }
  config: any
}

export interface ScheduledReport {
  id?: string
  reportId: string
  reportName: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  dayOfWeek?: number
  dayOfMonth?: number
  time: string
  recipients: string[]
  format: 'excel' | 'pdf' | 'csv'
  includeCharts: boolean
  active: boolean
  nextRun?: string
}

// ==================== CREATE CUSTOM REPORT MODAL ====================

interface CreateCustomReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ReportConfig) => void
}

export const CreateCustomReportModal: React.FC<CreateCustomReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ReportConfig>({
    reportName: '',
    reportType: 'spend_analysis',
    description: '',
    metrics: [],
    filters: {
      dateRange: 'last30days'
    },
    groupBy: 'category',
    chartType: 'bar',
    includeComparisons: false,
    createdBy: 'Current User',
    createdDate: new Date().toISOString().split('T')[0],
    isPublic: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const availableMetrics = {
    spend_analysis: ['Total Spend', 'Average Order Value', 'Spend by Category', 'Spend Trend', 'Budget Variance'],
    supplier_performance: ['On-Time Delivery', 'Quality Score', 'Lead Time', 'Price Variance', 'Response Time'],
    savings: ['Cost Savings', 'Cost Avoidance', 'Negotiated Discounts', 'Volume Savings', 'Process Savings'],
    compliance: ['Contract Compliance', 'PO Accuracy', 'Maverick Spending', 'Policy Adherence', 'Audit Score'],
    cycle_time: ['Requisition to PO', 'PO to Delivery', 'Invoice Processing', 'Approval Time', 'Total Cycle Time'],
    custom: ['Total Spend', 'Order Count', 'Supplier Count', 'Average Lead Time', 'Savings Rate']
  }

  const toggleMetric = (metric: string) => {
    if (formData.metrics.includes(metric)) {
      setFormData({ ...formData, metrics: formData.metrics.filter(m => m !== metric) })
    } else {
      setFormData({ ...formData, metrics: [...formData.metrics, metric] })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.reportName) newErrors.reportName = 'Report name is required'
      if (!formData.reportType) newErrors.reportType = 'Report type is required'
    } else if (step === 2) {
      if (formData.metrics.length === 0) newErrors.metrics = 'Select at least one metric'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = () => {
    if (validateStep(3)) {
      onSubmit(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Create Custom Report</h2>
              <p className="text-sm opacity-90">Step {currentStep} of 3</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name *</label>
                <input
                  type="text"
                  value={formData.reportName}
                  onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.reportName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Monthly Spend Analysis"
                />
                {errors.reportName && <p className="text-red-500 text-xs mt-1">{errors.reportName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type *</label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any, metrics: [] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="spend_analysis">Spend Analysis</option>
                  <option value="supplier_performance">Supplier Performance</option>
                  <option value="savings">Cost Savings</option>
                  <option value="compliance">Compliance Metrics</option>
                  <option value="cycle_time">Cycle Time Analysis</option>
                  <option value="custom">Custom Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the purpose of this report..."
                />
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="text-blue-500 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Make this report available to all users</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Metrics Selection */}
          {currentStep === 2 && (
            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="font-semibold text-blue-900">Select Metrics to Include</p>
                <p className="text-sm text-blue-700 mt-1">Choose the metrics you want to track in this report</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {availableMetrics[formData.reportType].map(metric => (
                  <button
                    key={metric}
                    onClick={() => toggleMetric(metric)}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      formData.metrics.includes(metric)
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{metric}</span>
                      {formData.metrics.includes(metric) && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                  </button>
                ))}
              </div>

              {errors.metrics && <p className="text-red-500 text-xs">{errors.metrics}</p>}
            </div>
          )}

          {/* Step 3: Filters & Visualization */}
          {currentStep === 3 && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={formData.filters.dateRange}
                  onChange={(e) => setFormData({
                    ...formData,
                    filters: { ...formData.filters, dateRange: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisQuarter">This Quarter</option>
                  <option value="thisYear">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
                <select
                  value={formData.groupBy}
                  onChange={(e) => setFormData({ ...formData, groupBy: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="category">Category</option>
                  <option value="supplier">Supplier</option>
                  <option value="department">Department</option>
                  <option value="month">Month</option>
                  <option value="quarter">Quarter</option>
                  <option value="year">Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { value: 'bar', icon: BarChart3, label: 'Bar' },
                    { value: 'line', icon: LineChartIcon, label: 'Line' },
                    { value: 'pie', icon: PieChart, label: 'Pie' },
                    { value: 'table', icon: FileText, label: 'Table' },
                    { value: 'combo', icon: TrendingUp, label: 'Combo' }
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setFormData({ ...formData, chartType: value as any })}
                      className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        formData.chartType === value
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.includeComparisons}
                    onChange={(e) => setFormData({ ...formData, includeComparisons: e.target.checked })}
                    className="text-blue-500 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Include period-over-period comparisons</span>
                </label>
              </div>

              {formData.includeComparisons && (
                <div className="ml-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compare With</label>
                  <select
                    value={formData.comparisonPeriod || 'previousPeriod'}
                    onChange={(e) => setFormData({ ...formData, comparisonPeriod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="previousPeriod">Previous Period</option>
                    <option value="previousYear">Same Period Last Year</option>
                    <option value="baseline">Baseline Period</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t px-3 py-2 bg-gray-50 flex justify-between">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== EXPORT REPORT MODAL ====================

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  reportName?: string
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reportName
}) => {
  const [formData, setFormData] = useState({
    format: 'excel',
    includeCharts: true,
    includeRawData: true,
    includeSummary: true,
    pageOrientation: 'landscape',
    emailReport: false,
    emailRecipients: ''
  })

  const handleSubmit = () => {
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Export Report</h2>
              {reportName && <p className="text-sm opacity-90">{reportName}</p>}
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {['excel', 'pdf', 'csv'].map(format => (
                <button
                  key={format}
                  onClick={() => setFormData({ ...formData, format })}
                  className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                    formData.format === format
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Options</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.includeCharts}
                  onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                  className="text-green-500 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">Include charts and visualizations</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.includeRawData}
                  onChange={(e) => setFormData({ ...formData, includeRawData: e.target.checked })}
                  className="text-green-500 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">Include raw data tables</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.includeSummary}
                  onChange={(e) => setFormData({ ...formData, includeSummary: e.target.checked })}
                  className="text-green-500 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">Include executive summary</span>
              </label>
            </div>
          </div>

          {formData.format === 'pdf' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Orientation</label>
              <select
                value={formData.pageOrientation}
                onChange={(e) => setFormData({ ...formData, pageOrientation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          )}

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.emailReport}
                onChange={(e) => setFormData({ ...formData, emailReport: e.target.checked })}
                className="text-green-500 focus:ring-green-500 rounded"
              />
              <span className="text-sm text-gray-700">Email report after export</span>
            </label>
          </div>

          {formData.emailReport && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Recipients</label>
              <input
                type="text"
                value={formData.emailRecipients}
                onChange={(e) => setFormData({ ...formData, emailRecipients: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
          )}
        </div>

        <div className="border-t px-3 py-2 bg-gray-50 flex justify-between">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== SCHEDULE REPORT MODAL ====================

interface ScheduleReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ScheduledReport) => void
  report?: ReportConfig
}

export const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  report
}) => {
  const [formData, setFormData] = useState<ScheduledReport>({
    reportId: report?.id || '',
    reportName: report?.reportName || '',
    frequency: 'monthly',
    time: '08:00',
    recipients: [],
    format: 'excel',
    includeCharts: true,
    active: true
  })

  const [currentRecipient, setCurrentRecipient] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addRecipient = () => {
    if (!currentRecipient.trim()) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentRecipient)) {
      setErrors({ recipient: 'Invalid email address' })
      return
    }
    setFormData({
      ...formData,
      recipients: [...formData.recipients, currentRecipient]
    })
    setCurrentRecipient('')
    setErrors({})
  }

  const removeRecipient = (index: number) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (formData.recipients.length === 0) newErrors.recipients = 'Add at least one recipient'

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Schedule Report</h2>
              {report && <p className="text-sm opacity-90">{report.reportName}</p>}
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {formData.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
              <select
                value={formData.dayOfWeek || 1}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="0">Sunday</option>
              </select>
            </div>
          )}

          {formData.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Month</label>
              <input
                type="number"
                value={formData.dayOfMonth || 1}
                onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                min="1"
                max="31"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {['excel', 'pdf', 'csv'].map(format => (
                <button
                  key={format}
                  onClick={() => setFormData({ ...formData, format: format as any })}
                  className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                    formData.format === format
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.includeCharts}
                onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                className="text-purple-500 focus:ring-purple-500 rounded"
              />
              <span className="text-sm text-gray-700">Include charts and visualizations</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Recipients *</label>
            <div className="flex gap-3 mb-3">
              <input
                type="email"
                value={currentRecipient}
                onChange={(e) => setCurrentRecipient(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="email@example.com"
                onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
              />
              <button
                onClick={addRecipient}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {errors.recipient && <p className="text-red-500 text-xs mb-2">{errors.recipient}</p>}

            {formData.recipients.length > 0 && (
              <div className="space-y-2">
                {formData.recipients.map((recipient, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-900">{recipient}</span>
                    <button onClick={() => removeRecipient(index)} className="text-red-600 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.recipients && <p className="text-red-500 text-xs mt-2">{errors.recipients}</p>}
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="text-purple-500 focus:ring-purple-500 rounded"
              />
              <span className="text-sm text-gray-700">Activate schedule immediately</span>
            </label>
          </div>
        </div>

        <div className="border-t px-3 py-2 bg-gray-50 flex justify-between">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== DASHBOARD CUSTOMIZATION MODAL ====================

interface DashboardCustomizationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (widgets: DashboardWidget[]) => void
  currentWidgets?: DashboardWidget[]
}

export const DashboardCustomizationModal: React.FC<DashboardCustomizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentWidgets = []
}) => {
  const [selectedWidgets, setSelectedWidgets] = useState<DashboardWidget[]>(currentWidgets)

  const availableWidgets = [
    { id: 'total-spend', title: 'Total Spend', type: 'kpi' as const, icon: DollarSign },
    { id: 'order-count', title: 'Total Orders', type: 'kpi' as const, icon: FileText },
    { id: 'supplier-count', title: 'Active Suppliers', type: 'kpi' as const, icon: Users },
    { id: 'savings', title: 'Cost Savings', type: 'kpi' as const, icon: Target },
    { id: 'spend-trend', title: 'Spend Trend', type: 'chart' as const, icon: LineChartIcon },
    { id: 'category-breakdown', title: 'Spend by Category', type: 'chart' as const, icon: PieChart },
    { id: 'supplier-performance', title: 'Supplier Performance', type: 'chart' as const, icon: BarChart3 },
    { id: 'top-suppliers', title: 'Top Suppliers', type: 'table' as const, icon: FileText }
  ]

  const toggleWidget = (widget: typeof availableWidgets[0]) => {
    const exists = selectedWidgets.find(w => w.id === widget.id)
    if (exists) {
      setSelectedWidgets(selectedWidgets.filter(w => w.id !== widget.id))
    } else {
      setSelectedWidgets([
        ...selectedWidgets,
        {
          id: widget.id,
          type: widget.type,
          title: widget.title,
          position: { x: 0, y: 0, w: 2, h: 1 },
          config: {}
        }
      ])
    }
  }

  const handleSubmit = () => {
    onSubmit(selectedWidgets)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Customize Dashboard</h2>
              <p className="text-sm opacity-90">{selectedWidgets.length} widgets selected</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-3">
            <p className="font-semibold text-teal-900">Available Widgets</p>
            <p className="text-sm text-teal-700 mt-1">Select the widgets you want to display on your dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableWidgets.map(widget => {
              const Icon = widget.icon
              const isSelected = selectedWidgets.some(w => w.id === widget.id)

              return (
                <button
                  key={widget.id}
                  onClick={() => toggleWidget(widget)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-teal-600' : 'text-gray-500'}`} />
                      <div>
                        <p className={`font-semibold ${isSelected ? 'text-teal-900' : 'text-gray-900'}`}>
                          {widget.title}
                        </p>
                        <p className="text-xs text-gray-500">{widget.type.toUpperCase()}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle className="w-6 h-6 text-teal-600" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t px-3 py-2 bg-gray-50 flex justify-between">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
