'use client'

import { useState } from 'react'
import { X, Save, TrendingUp, Calendar, Package, AlertCircle, BarChart3, Download, Settings } from 'lucide-react'

interface DemandForecast {
  id: string
  productCode: string
  productName: string
  category: string
  currentDemand: number
  forecastedDemand: number
  historicalAvg: number
  trend: 'up' | 'down' | 'stable'
  accuracy: number
  lastUpdated: string
  forecastMethod: string
  seasonalityFactor: number
  safetyStock: number
  reorderPoint: number
}

interface NewForecastModalProps {
  isOpen: boolean
  onClose: () => void
  forecast?: DemandForecast | null
  onSave: (data: Partial<DemandForecast>) => void
}

interface ExportForecastModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: string, filters: any) => void
}

interface ForecastAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  forecast: DemandForecast | null
}

export function NewForecastModal({ isOpen, onClose, forecast, onSave }: NewForecastModalProps) {
  const [formData, setFormData] = useState({
    productCode: forecast?.productCode || '',
    productName: forecast?.productName || '',
    category: forecast?.category || '',
    currentDemand: forecast?.currentDemand || 0,
    forecastedDemand: forecast?.forecastedDemand || 0,
    historicalAvg: forecast?.historicalAvg || 0,
    trend: forecast?.trend || 'stable',
    forecastMethod: forecast?.forecastMethod || 'moving-average',
    seasonalityFactor: forecast?.seasonalityFactor || 1.0,
    safetyStock: forecast?.safetyStock || 0,
    reorderPoint: forecast?.reorderPoint || 0,
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-xl font-semibold">
              {forecast ? 'Edit Demand Forecast' : 'New Demand Forecast'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Information */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code *</label>
                <input
                  type="text"
                  value={formData.productCode}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Cabinets">Cabinets</option>
                  <option value="Countertops">Countertops</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Finishes">Finishes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Demand Data */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Demand Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Demand (units) *</label>
                <input
                  type="number"
                  value={formData.currentDemand}
                  onChange={(e) => setFormData({ ...formData, currentDemand: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forecasted Demand (units) *</label>
                <input
                  type="number"
                  value={formData.forecastedDemand}
                  onChange={(e) => setFormData({ ...formData, forecastedDemand: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Historical Average (units)</label>
                <input
                  type="number"
                  value={formData.historicalAvg}
                  onChange={(e) => setFormData({ ...formData, historicalAvg: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Forecasting Parameters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Forecasting Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Method *</label>
                <select
                  value={formData.forecastMethod}
                  onChange={(e) => setFormData({ ...formData, forecastMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="moving-average">Moving Average</option>
                  <option value="exponential-smoothing">Exponential Smoothing</option>
                  <option value="linear-regression">Linear Regression</option>
                  <option value="seasonal-decomposition">Seasonal Decomposition</option>
                  <option value="arima">ARIMA</option>
                  <option value="machine-learning">Machine Learning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trend</label>
                <select
                  value={formData.trend}
                  onChange={(e) => setFormData({ ...formData, trend: e.target.value as 'up' | 'down' | 'stable' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="stable">Stable</option>
                  <option value="up">Increasing</option>
                  <option value="down">Decreasing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seasonality Factor</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.seasonalityFactor}
                  onChange={(e) => setFormData({ ...formData, seasonalityFactor: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">1.0 = no seasonality</p>
              </div>
            </div>
          </div>

          {/* Inventory Parameters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Inventory Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Safety Stock (units)</label>
                <input
                  type="number"
                  value={formData.safetyStock}
                  onChange={(e) => setFormData({ ...formData, safetyStock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Point (units)</label>
                <input
                  type="number"
                  value={formData.reorderPoint}
                  onChange={(e) => setFormData({ ...formData, reorderPoint: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
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
              {forecast ? 'Update Forecast' : 'Create Forecast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ExportForecastModal({ isOpen, onClose, onExport }: ExportForecastModalProps) {
  const [exportFormat, setExportFormat] = useState('excel')
  const [dateRange, setDateRange] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [includeHistorical, setIncludeHistorical] = useState(true)
  const [includeForecasted, setIncludeForecasted] = useState(true)
  const [includeActual, setIncludeActual] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all'])

  if (!isOpen) return null

  const handleExport = () => {
    const filters = {
      dateRange,
      customStartDate: dateRange === 'custom' ? customStartDate : null,
      customEndDate: dateRange === 'custom' ? customEndDate : null,
      includeHistorical,
      includeForecasted,
      includeActual,
      categories: selectedCategories,
    }
    onExport(exportFormat, filters)
    onClose()
  }

  const toggleCategory = (category: string) => {
    if (category === 'all') {
      setSelectedCategories(['all'])
    } else {
      const newCategories = selectedCategories.filter(c => c !== 'all')
      if (selectedCategories.includes(category)) {
        const filtered = newCategories.filter(c => c !== category)
        setSelectedCategories(filtered.length === 0 ? ['all'] : filtered)
      } else {
        setSelectedCategories([...newCategories, category])
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Export Demand Forecasts</h2>
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

          {/* Date Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
            >
              <option value="all">All Time</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="last-year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Data Types */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Data Types</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHistorical}
                  onChange={(e) => setIncludeHistorical(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Historical Demand Data</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeForecasted}
                  onChange={(e) => setIncludeForecasted(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Forecasted Demand Data</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeActual}
                  onChange={(e) => setIncludeActual(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Actual Demand Data</span>
              </label>
            </div>
          </div>

          {/* Product Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Product Categories</label>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'Cabinets', 'Countertops', 'Hardware', 'Accessories', 'Appliances'].map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{category}</span>
                </label>
              ))}
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

export function ForecastAnalyticsModal({ isOpen, onClose, forecast }: ForecastAnalyticsModalProps) {
  const [activeTab, setActiveTab] = useState<'accuracy' | 'variance' | 'trends' | 'seasonality'>('accuracy')

  if (!isOpen || !forecast) return null

  const accuracyData = [
    { month: 'Apr', accuracy: 92 },
    { month: 'May', accuracy: 89 },
    { month: 'Jun', accuracy: 94 },
    { month: 'Jul', accuracy: 91 },
    { month: 'Aug', accuracy: 93 },
    { month: 'Sep', accuracy: forecast.accuracy },
  ]

  const varianceData = [
    { month: 'Apr', forecasted: 450, actual: 435, variance: -3.3 },
    { month: 'May', forecasted: 480, actual: 495, variance: 3.1 },
    { month: 'Jun', forecasted: 520, actual: 510, variance: -1.9 },
    { month: 'Jul', forecasted: 510, actual: 525, variance: 2.9 },
    { month: 'Aug', forecasted: 540, actual: 530, variance: -1.9 },
    { month: 'Sep', forecasted: forecast.forecastedDemand, actual: forecast.currentDemand, variance: 0 },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Forecast Analytics</h2>
            </div>
            <p className="text-sm text-purple-100 mt-1">{forecast.productName} ({forecast.productCode})</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex gap-1 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('accuracy')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'accuracy'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Accuracy Metrics
            </button>
            <button
              onClick={() => setActiveTab('variance')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'variance'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Variance Analysis
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'trends'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Trend Visualization
            </button>
            <button
              onClick={() => setActiveTab('seasonality')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'seasonality'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Seasonality Patterns
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'accuracy' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Accuracy Over Time</h3>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Current Accuracy</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{forecast.accuracy}%</p>
                  <p className="text-xs text-green-700 mt-1">Last updated: {new Date(forecast.lastUpdated).toLocaleDateString()}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">6-Month Average</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">91.5%</p>
                  <p className="text-xs text-blue-700 mt-1">Apr - Sep 2024</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Best Month</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">94%</p>
                  <p className="text-xs text-purple-700 mt-1">June 2024</p>
                </div>
              </div>

              {/* Accuracy Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {accuracyData.map((data, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{data.month}</span>
                        <span className="text-gray-900 font-semibold">{data.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            data.accuracy >= 93 ? 'bg-green-600' : data.accuracy >= 90 ? 'bg-blue-600' : 'bg-orange-600'
                          }`}
                          style={{ width: `${data.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variance' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast vs Actual Demand</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Forecasted</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actual</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Variance</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varianceData.map((data, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{data.month}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-700">{data.forecasted} units</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-700">{data.actual} units</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span className={`font-semibold ${data.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.variance > 0 ? '+' : ''}{data.variance.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            Math.abs(data.variance) <= 2
                              ? 'bg-green-100 text-green-700'
                              : Math.abs(data.variance) <= 5
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {Math.abs(data.variance) <= 2 ? 'Excellent' : Math.abs(data.variance) <= 5 ? 'Good' : 'Needs Review'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demand Trend Analysis</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-blue-900">Overall Trend</h4>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900 capitalize">{forecast.trend}</p>
                  <p className="text-sm text-blue-700 mt-2">Based on 6-month historical data</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-purple-900">Growth Rate</h4>
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-900">+12.3%</p>
                  <p className="text-sm text-purple-700 mt-2">Month-over-month average</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-green-900">Peak Demand</h4>
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-900">{Math.max(...varianceData.map(d => d.actual))} units</p>
                  <p className="text-sm text-green-700 mt-2">Recorded in August 2024</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-orange-900">Forecast Method</h4>
                    <Settings className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-lg font-bold text-orange-900 capitalize">{forecast.forecastMethod.replace('-', ' ')}</p>
                  <p className="text-sm text-orange-700 mt-2">Current prediction model</p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Trend Insights</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Demand shows consistent upward trend over past 6 months</li>
                  <li>• Peak demand periods align with Q3 festival season</li>
                  <li>• Forecast accuracy has improved by 5% in last quarter</li>
                  <li>• Recommended safety stock: {forecast.safetyStock} units</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'seasonality' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonality Patterns</h3>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-900">Seasonality Factor</h4>
                    <p className="text-3xl font-bold text-indigo-900 mt-1">{forecast.seasonalityFactor.toFixed(2)}</p>
                    <p className="text-sm text-indigo-700 mt-1">
                      {forecast.seasonalityFactor > 1.1 ? 'High seasonal variation' :
                       forecast.seasonalityFactor < 0.9 ? 'Low seasonal variation' : 'Moderate seasonal variation'}
                    </p>
                  </div>
                  <Calendar className="h-12 w-12 text-indigo-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Monthly Seasonal Index</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                      const index = 0.85 + (Math.sin((idx / 12) * Math.PI * 2) * 0.3)
                      return (
                        <div key={month} className="text-center">
                          <p className="text-xs font-medium text-gray-600">{month}</p>
                          <p className={`text-sm font-bold ${index > 1 ? 'text-green-600' : 'text-orange-600'}`}>
                            {index.toFixed(2)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-2">Peak Seasons</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>Q1 (Jan-Mar):</strong> Wedding season - 25% increase</li>
                    <li>• <strong>Q3 (Jul-Sep):</strong> Festival season - 30% increase</li>
                    <li>• <strong>Q4 (Oct-Dec):</strong> Year-end projects - 20% increase</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-orange-900 mb-2">Low Seasons</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• <strong>April-May:</strong> Summer slowdown - 15% decrease</li>
                    <li>• <strong>Monsoon (Jun-Jul):</strong> Installation delays - 10% decrease</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
