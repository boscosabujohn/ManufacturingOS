"use client"

import React, { useState } from 'react'
import { X, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Download, Filter, RefreshCw, AlertCircle, CheckCircle, DollarSign, Package } from 'lucide-react'

// ==================== INTERFACES ====================

export interface TurnoverAnalysisData {
  period: string
  startDate: string
  endDate: string
  warehouse?: string
  category?: string
  items: Array<{
    itemCode: string
    itemName: string
    category: string
    avgInventory: number
    costOfGoodsSold: number
    turnoverRatio: number
    daysInInventory: number
    classification: 'fast-moving' | 'medium-moving' | 'slow-moving' | 'non-moving'
  }>
  summary: {
    avgTurnoverRatio: number
    fastMovingCount: number
    slowMovingCount: number
    nonMovingCount: number
  }
}

export interface ABCAnalysisData {
  analysisDate: string
  warehouse?: string
  criteria: 'value' | 'quantity' | 'margin'
  items: Array<{
    itemCode: string
    itemName: string
    annualUsage: number
    unitCost: number
    annualValue: number
    cumulativeValue: number
    cumulativePercentage: number
    classification: 'A' | 'B' | 'C'
  }>
  summary: {
    aClassCount: number
    bClassCount: number
    cClassCount: number
    aClassValue: number
    bClassValue: number
    cClassValue: number
  }
}

export interface ValuationReportData {
  reportDate: string
  warehouse?: string
  valuationMethod: 'FIFO' | 'LIFO' | 'Weighted Average' | 'Standard Cost'
  items: Array<{
    itemCode: string
    itemName: string
    category: string
    quantity: number
    unitCost: number
    totalValue: number
    lastPurchaseDate: string
    lastPurchasePrice: number
  }>
  summary: {
    totalItems: number
    totalQuantity: number
    totalValue: number
    byCategory: Array<{
      category: string
      value: number
      percentage: number
    }>
  }
}

export interface StockAgingData {
  reportDate: string
  warehouse?: string
  items: Array<{
    itemCode: string
    itemName: string
    quantity: number
    value: number
    receiptDate: string
    ageInDays: number
    agingBucket: '0-30' | '31-60' | '61-90' | '91-180' | '180+' | 'years'
    status: 'good' | 'warning' | 'critical'
  }>
  summary: {
    totalValue: number
    bucket_0_30: { quantity: number; value: number; percentage: number }
    bucket_31_60: { quantity: number; value: number; percentage: number }
    bucket_61_90: { quantity: number; value: number; percentage: number }
    bucket_91_180: { quantity: number; value: number; percentage: number }
    bucket_180_plus: { quantity: number; value: number; percentage: number }
  }
}

export interface ReorderAnalysisData {
  analysisDate: string
  warehouse?: string
  items: Array<{
    itemCode: string
    itemName: string
    currentStock: number
    reorderLevel: number
    safetyStock: number
    avgDailyConsumption: number
    leadTimeDays: number
    daysUntilStockout: number
    recommendedOrderQty: number
    urgency: 'critical' | 'high' | 'medium' | 'low'
  }>
  summary: {
    criticalItems: number
    highPriorityItems: number
    totalReorderValue: number
  }
}

export interface CustomReportConfig {
  reportName: string
  reportType: 'turnover' | 'abc-analysis' | 'valuation' | 'aging' | 'reorder' | 'custom'
  dateRange: {
    startDate: string
    endDate: string
  }
  filters: {
    warehouse?: string[]
    category?: string[]
    supplier?: string[]
    minValue?: number
    maxValue?: number
  }
  groupBy?: 'category' | 'warehouse' | 'supplier' | 'month' | 'quarter'
  metrics: string[]
  format: 'pdf' | 'excel' | 'csv'
  schedule?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    recipients: string[]
  }
}

// ==================== TURNOVER ANALYSIS MODAL ====================

interface TurnoverAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => void
}

export const TurnoverAnalysisModal: React.FC<TurnoverAnalysisModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [config, setConfig] = useState({
    period: 'monthly',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    warehouse: '',
    category: '',
    minTurnoverRatio: 0,
    includeNonMoving: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleGenerate = () => {
    const newErrors: Record<string, string> = {}
    if (!config.startDate) newErrors.startDate = 'Start date is required'
    if (!config.endDate) newErrors.endDate = 'End date is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onGenerate(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Inventory Turnover Analysis</h2>
              <p className="text-sm opacity-90">Analyze stock movement and turnover rates</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Period Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Period</label>
            <div className="grid grid-cols-3 gap-3">
              {['monthly', 'quarterly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setConfig({ ...config, period })}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    config.period === period
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={config.startDate}
                onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={config.endDate}
                onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                value={config.warehouse}
                onChange={(e) => setConfig({ ...config, warehouse: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Warehouses</option>
                <option value="WH-001">Main Warehouse</option>
                <option value="WH-002">Production Warehouse</option>
                <option value="WH-003">Finished Goods</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={config.category}
                onChange={(e) => setConfig({ ...config, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="raw-materials">Raw Materials</option>
                <option value="components">Components</option>
                <option value="finished-goods">Finished Goods</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.includeNonMoving}
                onChange={(e) => setConfig({ ...config, includeNonMoving: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include non-moving items</span>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">About Turnover Analysis</p>
                <p className="text-sm text-blue-700">
                  This report calculates inventory turnover ratio (COGS / Avg Inventory) and days in inventory for each item.
                  Items are classified as fast, medium, slow, or non-moving based on turnover rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Generate Analysis
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== ABC ANALYSIS MODAL ====================

interface ABCAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => void
}

export const ABCAnalysisModal: React.FC<ABCAnalysisModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [config, setConfig] = useState({
    analysisDate: new Date().toISOString().split('T')[0],
    warehouse: '',
    criteria: 'value',
    aClassPercentage: 70,
    bClassPercentage: 20,
    cClassPercentage: 10
  })

  const handleGenerate = () => {
    onGenerate(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <PieChart className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">ABC Analysis</h2>
              <p className="text-sm opacity-90">Classify inventory based on value contribution</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Analysis Criteria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Criteria</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'value', label: 'Annual Value', icon: DollarSign },
                { value: 'quantity', label: 'Quantity', icon: Package },
                { value: 'margin', label: 'Profit Margin', icon: TrendingUp }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setConfig({ ...config, criteria: item.value })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    config.criteria === item.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Warehouse Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select
              value={config.warehouse}
              onChange={(e) => setConfig({ ...config, warehouse: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Warehouses</option>
              <option value="WH-001">Main Warehouse</option>
              <option value="WH-002">Production Warehouse</option>
              <option value="WH-003">Finished Goods</option>
            </select>
          </div>

          {/* Classification Percentages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Classification Thresholds</label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Class A (High Value)</span>
                  <span className="text-sm font-bold text-purple-600">{config.aClassPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="80"
                  value={config.aClassPercentage}
                  onChange={(e) => setConfig({ ...config, aClassPercentage: parseInt(e.target.value) })}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Items contributing top {config.aClassPercentage}% of value</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Class B (Medium Value)</span>
                  <span className="text-sm font-bold text-blue-600">{config.bClassPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="30"
                  value={config.bClassPercentage}
                  onChange={(e) => setConfig({ ...config, bClassPercentage: parseInt(e.target.value) })}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Items contributing next {config.bClassPercentage}% of value</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Class C (Low Value)</span>
                  <span className="text-sm font-bold text-gray-600">{config.cClassPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-lg">
                  <div className="h-2 bg-gray-400 rounded-lg" style={{ width: `${config.cClassPercentage}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Remaining {config.cClassPercentage}% of value</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-900 mb-1">ABC Classification Rules</p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• <strong>Class A:</strong> High-value items requiring tight control and frequent review</li>
                  <li>• <strong>Class B:</strong> Medium-value items with moderate control</li>
                  <li>• <strong>Class C:</strong> Low-value items with simple controls</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <PieChart className="w-4 h-4" />
            Generate Analysis
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== VALUATION REPORT MODAL ====================

interface ValuationReportModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => void
}

export const ValuationReportModal: React.FC<ValuationReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [config, setConfig] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    warehouse: '',
    valuationMethod: 'Weighted Average',
    includeZeroStock: false,
    groupByCategory: true,
    format: 'pdf'
  })

  const handleGenerate = () => {
    onGenerate(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Inventory Valuation Report</h2>
              <p className="text-sm opacity-90">Calculate total inventory value</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Date *
            </label>
            <input
              type="date"
              value={config.reportDate}
              onChange={(e) => setConfig({ ...config, reportDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Valuation Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valuation Method</label>
            <div className="grid grid-cols-2 gap-3">
              {['FIFO', 'LIFO', 'Weighted Average', 'Standard Cost'].map((method) => (
                <button
                  key={method}
                  onClick={() => setConfig({ ...config, valuationMethod: method })}
                  className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                    config.valuationMethod === method
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-300 hover:border-green-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Warehouse Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select
              value={config.warehouse}
              onChange={(e) => setConfig({ ...config, warehouse: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Warehouses</option>
              <option value="WH-001">Main Warehouse</option>
              <option value="WH-002">Production Warehouse</option>
              <option value="WH-003">Finished Goods</option>
            </select>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {['pdf', 'excel', 'csv'].map((format) => (
                <button
                  key={format}
                  onClick={() => setConfig({ ...config, format })}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    config.format === format
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-300 hover:border-green-300'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.includeZeroStock}
                onChange={(e) => setConfig({ ...config, includeZeroStock: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Include items with zero stock</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.groupByCategory}
                onChange={(e) => setConfig({ ...config, groupByCategory: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Group by category</span>
            </label>
          </div>

          {/* Method Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900 mb-2">
              {config.valuationMethod === 'FIFO' && 'First-In, First-Out (FIFO)'}
              {config.valuationMethod === 'LIFO' && 'Last-In, First-Out (LIFO)'}
              {config.valuationMethod === 'Weighted Average' && 'Weighted Average Cost'}
              {config.valuationMethod === 'Standard Cost' && 'Standard Cost Method'}
            </p>
            <p className="text-sm text-green-700">
              {config.valuationMethod === 'FIFO' && 'Assumes oldest inventory is sold first. Best for perishable goods.'}
              {config.valuationMethod === 'LIFO' && 'Assumes newest inventory is sold first. Better matches current costs.'}
              {config.valuationMethod === 'Weighted Average' && 'Calculates average cost of all units. Smooths price fluctuations.'}
              {config.valuationMethod === 'Standard Cost' && 'Uses predetermined costs. Good for budgeting and variance analysis.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== STOCK AGING REPORT MODAL ====================

interface StockAgingModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => void
}

export const StockAgingModal: React.FC<StockAgingModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [config, setConfig] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    warehouse: '',
    category: '',
    minValue: 0,
    showOnlyCritical: false
  })

  const handleGenerate = () => {
    onGenerate(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Stock Aging Analysis</h2>
              <p className="text-sm opacity-90">Identify slow-moving and obsolete stock</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Date *
            </label>
            <input
              type="date"
              value={config.reportDate}
              onChange={(e) => setConfig({ ...config, reportDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                value={config.warehouse}
                onChange={(e) => setConfig({ ...config, warehouse: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Warehouses</option>
                <option value="WH-001">Main Warehouse</option>
                <option value="WH-002">Production Warehouse</option>
                <option value="WH-003">Finished Goods</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={config.category}
                onChange={(e) => setConfig({ ...config, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="raw-materials">Raw Materials</option>
                <option value="components">Components</option>
                <option value="finished-goods">Finished Goods</option>
              </select>
            </div>
          </div>

          {/* Minimum Value Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Value ($)
            </label>
            <input
              type="number"
              value={config.minValue}
              onChange={(e) => setConfig({ ...config, minValue: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Only show items with value above this threshold</p>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.showOnlyCritical}
                onChange={(e) => setConfig({ ...config, showOnlyCritical: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Show only critical items (180+ days)</span>
            </label>
          </div>

          {/* Aging Buckets Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-900 mb-3">Aging Buckets</p>
            <div className="space-y-2 text-sm text-orange-700">
              <div className="flex justify-between">
                <span>• 0-30 days</span>
                <span className="text-green-600 font-semibold">Good</span>
              </div>
              <div className="flex justify-between">
                <span>• 31-60 days</span>
                <span className="text-green-600 font-semibold">Good</span>
              </div>
              <div className="flex justify-between">
                <span>• 61-90 days</span>
                <span className="text-yellow-600 font-semibold">Warning</span>
              </div>
              <div className="flex justify-between">
                <span>• 91-180 days</span>
                <span className="text-orange-600 font-semibold">Warning</span>
              </div>
              <div className="flex justify-between">
                <span>• 180+ days</span>
                <span className="text-red-600 font-semibold">Critical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== REORDER ANALYSIS MODAL ====================

interface ReorderAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => void
}

export const ReorderAnalysisModal: React.FC<ReorderAnalysisModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [config, setConfig] = useState({
    analysisDate: new Date().toISOString().split('T')[0],
    warehouse: '',
    urgencyLevel: 'all',
    includeOnOrder: false,
    minLeadTimeDays: 0
  })

  const handleGenerate = () => {
    onGenerate(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Reorder Point Analysis</h2>
              <p className="text-sm opacity-90">Identify items that need reordering</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Analysis Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Analysis Date *
            </label>
            <input
              type="date"
              value={config.analysisDate}
              onChange={(e) => setConfig({ ...config, analysisDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                value={config.warehouse}
                onChange={(e) => setConfig({ ...config, warehouse: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Warehouses</option>
                <option value="WH-001">Main Warehouse</option>
                <option value="WH-002">Production Warehouse</option>
                <option value="WH-003">Finished Goods</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
              <select
                value={config.urgencyLevel}
                onChange={(e) => setConfig({ ...config, urgencyLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Items</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.includeOnOrder}
                onChange={(e) => setConfig({ ...config, includeOnOrder: e.target.checked })}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Include items with pending orders</span>
            </label>
          </div>

          {/* Urgency Levels Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-900 mb-3">Urgency Levels</p>
            <div className="space-y-2 text-sm text-red-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span><strong>Critical:</strong> Stock-out in &lt; 7 days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span><strong>High:</strong> Stock-out in 7-14 days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span><strong>Medium:</strong> Stock-out in 15-30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span><strong>Low:</strong> Stock-out in &gt; 30 days</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">About Reorder Point</p>
                <p className="text-sm text-blue-700">
                  Reorder Point = (Avg Daily Consumption × Lead Time Days) + Safety Stock.
                  This analysis identifies items below their reorder point and calculates recommended order quantities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Analysis
          </button>
        </div>
      </div>
    </div>
  )
}
