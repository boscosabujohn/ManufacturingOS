'use client'

import { useState } from 'react'
import { X, Save, Download, RefreshCw, Edit, Settings, BarChart3, AlertTriangle, Package, Calendar, FileText, CheckCircle } from 'lucide-react'

interface RunMRPModalProps {
  isOpen: boolean
  onClose: () => void
  onRun: (options: any) => void
}

interface ExportMPSModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: string, options: any) => void
}

interface AdjustPlanModalProps {
  isOpen: boolean
  onClose: () => void
  product: any | null
  onSave: (adjustments: any) => void
}

export function RunMRPModal({ isOpen, onClose, onRun }: RunMRPModalProps) {
  const [includeAllProducts, setIncludeAllProducts] = useState(true)
  const [includeLowLevelCodes, setIncludeLowLevelCodes] = useState(true)
  const [includePhantomItems, setIncludePhantomItems] = useState(true)
  const [regenerative, setRegenerative] = useState(true)
  const [nettingMode, setNettingMode] = useState('full')
  const [horizonWeeks, setHorizonWeeks] = useState(12)
  const [considerLeadTime, setConsiderLeadTime] = useState(true)
  const [considerSafetyStock, setConsiderSafetyStock] = useState(true)

  if (!isOpen) return null

  const handleRun = () => {
    const options = {
      includeAllProducts,
      includeLowLevelCodes,
      includePhantomItems,
      regenerative,
      nettingMode,
      horizonWeeks,
      considerLeadTime,
      considerSafetyStock,
    }
    onRun(options)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Run MRP Cascade</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-blue-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Info Banner */}
          <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">About MRP Cascade</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Material Requirements Planning (MRP) will explode BOMs for all products in the MPS, calculate net requirements,
                  and generate planned orders for raw materials and components based on lead times and inventory levels.
                </p>
              </div>
            </div>
          </div>

          {/* MRP Processing Options */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Processing Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP Type</label>
                <select
                  value={regenerative ? 'regenerative' : 'net-change'}
                  onChange={(e) => setRegenerative(e.target.value === 'regenerative')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="regenerative">Regenerative MRP</option>
                  <option value="net-change">Net Change MRP</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {regenerative ? 'Complete recalculation of all requirements' : 'Only process changed items'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Netting Mode</label>
                <select
                  value={nettingMode}
                  onChange={(e) => setNettingMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full">Full Netting</option>
                  <option value="period">Period Netting</option>
                  <option value="no-netting">No Netting</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">How to offset inventory against requirements</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Planning Horizon (Weeks)</label>
                <input
                  type="number"
                  value={horizonWeeks}
                  onChange={(e) => setHorizonWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="4"
                  max="52"
                />
                <p className="text-xs text-gray-500 mt-1">Number of weeks to plan ahead</p>
              </div>
            </div>
          </div>

          {/* Scope Options */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Scope & Inclusions
            </h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeAllProducts}
                  onChange={(e) => setIncludeAllProducts(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Include All Products</p>
                  <p className="text-xs text-gray-500 mt-1">Process all products in MPS (recommended)</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeLowLevelCodes}
                  onChange={(e) => setIncludeLowLevelCodes(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Process Low-Level Codes</p>
                  <p className="text-xs text-gray-500 mt-1">Ensure correct processing sequence for multi-level BOMs</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includePhantomItems}
                  onChange={(e) => setIncludePhantomItems(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Include Phantom Items</p>
                  <p className="text-xs text-gray-500 mt-1">Process phantom/transient items that don't create inventory</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={considerLeadTime}
                  onChange={(e) => setConsiderLeadTime(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Consider Lead Times</p>
                  <p className="text-xs text-gray-500 mt-1">Offset planned orders by procurement/production lead times</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={considerSafetyStock}
                  onChange={(e) => setConsiderSafetyStock(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Consider Safety Stock</p>
                  <p className="text-xs text-gray-500 mt-1">Maintain safety stock levels for all items</p>
                </div>
              </label>
            </div>
          </div>

          {/* Expected Output */}
          <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Expected Output
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Material requirements for all raw materials and components</li>
              <li>• Planned purchase orders for purchased items</li>
              <li>• Planned production orders for manufactured items</li>
              <li>• Exception messages for shortages and issues</li>
              <li>• Pegging information linking requirements to parent demands</li>
            </ul>
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
              onClick={handleRun}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Run MRP Cascade
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ExportMPSModal({ isOpen, onClose, onExport }: ExportMPSModalProps) {
  const [exportFormat, setExportFormat] = useState('excel')
  const [includeAllPeriods, setIncludeAllPeriods] = useState(true)
  const [periodCount, setPeriodCount] = useState(12)
  const [includeGrossReq, setIncludeGrossReq] = useState(true)
  const [includeNetReq, setIncludeNetReq] = useState(true)
  const [includeProjectedInv, setIncludeProjectedInv] = useState(true)
  const [includePlannedOrders, setIncludePlannedOrders] = useState(true)
  const [includeATP, setIncludeATP] = useState(true)
  const [includeDemandBreakdown, setIncludeDemandBreakdown] = useState(false)
  const [includeCapacity, setIncludeCapacity] = useState(false)
  const [includeCharts, setIncludeCharts] = useState(true)

  if (!isOpen) return null

  const handleExport = () => {
    const options = {
      includeAllPeriods,
      periodCount: includeAllPeriods ? null : periodCount,
      includeGrossReq,
      includeNetReq,
      includeProjectedInv,
      includePlannedOrders,
      includeATP,
      includeDemandBreakdown,
      includeCapacity,
      includeCharts,
    }
    onExport(exportFormat, options)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Export Master Production Schedule</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-gray-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Export Format */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('excel')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  exportFormat === 'excel'
                    ? 'border-gray-600 bg-gray-50 text-gray-700'
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
                    ? 'border-gray-600 bg-gray-50 text-gray-700'
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
                    ? 'border-gray-600 bg-gray-50 text-gray-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">PDF</div>
                <div className="text-xs text-gray-500 mt-1">.pdf</div>
              </button>
            </div>
          </div>

          {/* Period Selection */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Planning Horizon
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={includeAllPeriods}
                  onChange={() => setIncludeAllPeriods(true)}
                  className="w-4 h-4 text-gray-600"
                />
                <span className="text-sm text-gray-700">Export all periods</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!includeAllPeriods}
                  onChange={() => setIncludeAllPeriods(false)}
                  className="w-4 h-4 text-gray-600"
                />
                <span className="text-sm text-gray-700">Export first</span>
                <input
                  type="number"
                  value={periodCount}
                  onChange={(e) => setPeriodCount(Number(e.target.value))}
                  disabled={includeAllPeriods}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                  min="1"
                  max="52"
                />
                <span className="text-sm text-gray-700">periods</span>
              </div>
            </div>
          </div>

          {/* MPS Data Sections */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Include MPS Data
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGrossReq}
                  onChange={(e) => setIncludeGrossReq(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded"
                />
                <span className="text-sm text-gray-700">Gross Requirements</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNetReq}
                  onChange={(e) => setIncludeNetReq(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded"
                />
                <span className="text-sm text-gray-700">Net Requirements</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProjectedInv}
                  onChange={(e) => setIncludeProjectedInv(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded"
                />
                <span className="text-sm text-gray-700">Projected Available Inventory</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePlannedOrders}
                  onChange={(e) => setIncludePlannedOrders(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded"
                />
                <span className="text-sm text-gray-700">Planned Order Releases</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeATP}
                  onChange={(e) => setIncludeATP(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded"
                />
                <span className="text-sm text-gray-700">Available-to-Promise (ATP)</span>
              </label>
            </div>
          </div>

          {/* Additional Data */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Data</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDemandBreakdown}
                  onChange={(e) => setIncludeDemandBreakdown(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded"
                />
                <span className="text-sm text-gray-700">Demand Breakdown (Forecast, Firm Orders, Safety Stock)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCapacity}
                  onChange={(e) => setIncludeCapacity(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded"
                />
                <span className="text-sm text-gray-700">Rough-Cut Capacity Planning</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="w-4 h-4 text-gray-600 rounded"
                  disabled={exportFormat === 'csv'}
                />
                <span className="text-sm text-gray-700">
                  Charts & Visualizations {exportFormat === 'csv' && '(Not available for CSV)'}
                </span>
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
              className="px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export MPS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdjustPlanModal({ isOpen, onClose, product, onSave }: AdjustPlanModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<'override' | 'adjust'>('adjust')
  const [selectedPeriod, setSelectedPeriod] = useState(1)
  const [adjustmentValue, setAdjustmentValue] = useState(0)
  const [adjustmentPercent, setAdjustmentPercent] = useState(0)
  const [reason, setReason] = useState('')

  if (!isOpen || !product) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const adjustments = {
      adjustmentType,
      selectedPeriod,
      adjustmentValue,
      adjustmentPercent,
      reason,
    }
    onSave(adjustments)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Edit className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Adjust Production Plan</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-purple-800 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Info */}
          <div className="mb-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm font-medium text-purple-900">{product.productName}</p>
            <p className="text-xs text-purple-700 mt-1">Product Code: {product.productCode}</p>
          </div>

          {/* Adjustment Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustmentType('adjust')}
                className={`p-3 border-2 rounded-lg text-center ${
                  adjustmentType === 'adjust'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-sm">Adjust by Amount</p>
                <p className="text-xs text-gray-500 mt-1">Add/subtract from current plan</p>
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('override')}
                className={`p-3 border-2 rounded-lg text-center ${
                  adjustmentType === 'override'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-sm">Override Plan</p>
                <p className="text-xs text-gray-500 mt-1">Replace with new value</p>
              </button>
            </div>
          </div>

          {/* Period Selection */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Period to Adjust</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {product.periods?.map((period: any, idx: number) => (
                <option key={idx} value={period.periodNumber}>
                  Period {period.periodNumber} ({period.startDate} to {period.endDate})
                </option>
              ))}
            </select>
          </div>

          {/* Adjustment Value */}
          {adjustmentType === 'adjust' ? (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adjust by Units</label>
                <input
                  type="number"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Or by Percentage</label>
                <input
                  type="number"
                  value={adjustmentPercent}
                  onChange={(e) => setAdjustmentPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Planned Quantity</label>
              <input
                type="number"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                required
              />
            </div>
          )}

          {/* Reason */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Adjustment *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Explain why this adjustment is needed..."
              required
            />
          </div>

          {/* Warning */}
          <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                Manual adjustments may affect material requirements and capacity planning.
                Consider running MRP after making changes.
              </p>
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
              className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
