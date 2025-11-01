'use client'

import { useState } from 'react'
import { X, Play, Settings, Eye, CheckCircle, AlertTriangle, Clock, Package, BarChart3, Calendar } from 'lucide-react'

// Run MRP Modal
interface RunMRPModalProps {
  isOpen: boolean
  onClose: () => void
  onRun: (config: MRPRunConfig) => void
}

interface MRPRunConfig {
  planningHorizon: number
  leadTimeConsideration: boolean
  safetyStockConsideration: boolean
  reorderPointMethod: string
  includeLotSizing: boolean
  considerSupplierConstraints: boolean
}

export function RunMRPModal({ isOpen, onClose, onRun }: RunMRPModalProps) {
  const [config, setConfig] = useState<MRPRunConfig>({
    planningHorizon: 12,
    leadTimeConsideration: true,
    safetyStockConsideration: true,
    reorderPointMethod: 'Dynamic',
    includeLotSizing: true,
    considerSupplierConstraints: false
  })

  const handleSubmit = () => {
    onRun(config)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Run MRP</h2>
              <p className="text-sm text-blue-100">Configure and execute Material Requirements Planning</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Planning Horizon */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planning Horizon (weeks) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={config.planningHorizon}
              onChange={(e) => setConfig({ ...config, planningHorizon: parseInt(e.target.value) })}
              min={1}
              max={52}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Forward looking period for material planning (1-52 weeks)</p>
          </div>

          {/* Reorder Point Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reorder Point Method <span className="text-red-500">*</span>
            </label>
            <select
              value={config.reorderPointMethod}
              onChange={(e) => setConfig({ ...config, reorderPointMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Dynamic">Dynamic - Based on demand variability</option>
              <option value="Fixed">Fixed - Based on historical average</option>
              <option value="Time-Based">Time-Based - Based on review period</option>
            </select>
          </div>

          {/* Configuration Options */}
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.leadTimeConsideration}
                onChange={(e) => setConfig({ ...config, leadTimeConsideration: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Lead Time Consideration</span>
                <p className="text-xs text-gray-500">Factor in supplier/production lead times</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.safetyStockConsideration}
                onChange={(e) => setConfig({ ...config, safetyStockConsideration: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Safety Stock Consideration</span>
                <p className="text-xs text-gray-500">Include safety stock in net requirements calculation</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.includeLotSizing}
                onChange={(e) => setConfig({ ...config, includeLotSizing: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Include Lot Sizing</span>
                <p className="text-xs text-gray-500">Apply lot sizing rules (EOQ, MOQ, etc.)</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.considerSupplierConstraints}
                onChange={(e) => setConfig({ ...config, considerSupplierConstraints: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Consider Supplier Constraints</span>
                <p className="text-xs text-gray-500">Account for supplier capacity and availability</p>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Before Running MRP</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Ensure all work orders are updated</li>
                  <li>Verify inventory levels are current</li>
                  <li>Check for any pending purchase orders</li>
                  <li>Review BOM accuracy for critical items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Run MRP
          </button>
        </div>
      </div>
    </div>
  )
}

// Configure MRP Settings Modal
interface ConfigureMRPModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: MRPSettings) => void
  currentSettings: MRPSettings
}

export interface MRPSettings {
  planningHorizon: number
  leadTimeConsideration: boolean
  safetyStockConsideration: boolean
  reorderPointMethod: string
  autoApproveThreshold: number
  criticalShortageThreshold: number
  excessStockThreshold: number
}

export function ConfigureMRPModal({ isOpen, onClose, onSave, currentSettings }: ConfigureMRPModalProps) {
  const [settings, setSettings] = useState<MRPSettings>(currentSettings)

  const handleSubmit = () => {
    onSave(settings)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">MRP Configuration</h2>
              <p className="text-sm text-purple-100">System-wide MRP settings and parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Planning Parameters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Planning Parameters
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Planning Horizon (weeks)
                </label>
                <input
                  type="number"
                  value={settings.planningHorizon}
                  onChange={(e) => setSettings({ ...settings, planningHorizon: parseInt(e.target.value) })}
                  min={1}
                  max={52}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reorder Point Method
                </label>
                <select
                  value={settings.reorderPointMethod}
                  onChange={(e) => setSettings({ ...settings, reorderPointMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Dynamic">Dynamic</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Time-Based">Time-Based</option>
                </select>
              </div>
            </div>
          </div>

          {/* Threshold Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Threshold Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Approve Threshold (₹)
                </label>
                <input
                  type="number"
                  value={settings.autoApproveThreshold}
                  onChange={(e) => setSettings({ ...settings, autoApproveThreshold: parseInt(e.target.value) })}
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Orders below this value are auto-approved</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Critical Shortage Threshold (days)
                </label>
                <input
                  type="number"
                  value={settings.criticalShortageThreshold}
                  onChange={(e) => setSettings({ ...settings, criticalShortageThreshold: parseInt(e.target.value) })}
                  min={0}
                  max={30}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Mark as critical if required within</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excess Stock Threshold (%)
                </label>
                <input
                  type="number"
                  value={settings.excessStockThreshold}
                  onChange={(e) => setSettings({ ...settings, excessStockThreshold: parseInt(e.target.value) })}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Above this % of requirement is excess</p>
              </div>
            </div>
          </div>

          {/* Processing Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.leadTimeConsideration}
                  onChange={(e) => setSettings({ ...settings, leadTimeConsideration: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Lead Time Consideration</span>
                  <p className="text-xs text-gray-500">Account for supplier/production lead times</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.safetyStockConsideration}
                  onChange={(e) => setSettings({ ...settings, safetyStockConsideration: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Safety Stock Consideration</span>
                  <p className="text-xs text-gray-500">Include safety stock in calculations</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}

// View Item Details Modal
interface ViewItemDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  item: any | null
}

export function ViewItemDetailsModal({ isOpen, onClose, item }: ViewItemDetailsModalProps) {
  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Material Details</h2>
              <p className="text-sm text-indigo-100">{item.itemCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Summary Header */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-indigo-600 mb-1">Item Code</p>
                <p className="font-bold text-indigo-900">{item.itemCode}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Category</p>
                <p className="font-bold text-indigo-900">{item.category}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">UOM</p>
                <p className="font-bold text-indigo-900">{item.uom}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                  item.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>

          {/* Material Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Material Name</p>
                  <p className="font-semibold text-gray-900">{item.itemName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-semibold text-gray-900">{item.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-600" />
              Inventory Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 mb-1">Gross Requirement</p>
                <p className="text-2xl font-bold text-blue-900">{item.grossRequirement?.toLocaleString()}</p>
                <p className="text-xs text-blue-600">{item.uom}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 mb-1">Scheduled Receipts</p>
                <p className="text-2xl font-bold text-green-900">{item.scheduledReceipts?.toLocaleString()}</p>
                <p className="text-xs text-green-600">{item.uom}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 mb-1">On Hand Inventory</p>
                <p className="text-2xl font-bold text-purple-900">{item.onHandInventory?.toLocaleString()}</p>
                <p className="text-xs text-purple-600">{item.uom}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-600 mb-1">Allocated Quantity</p>
                <p className="text-2xl font-bold text-yellow-900">{item.allocatedQty?.toLocaleString()}</p>
                <p className="text-xs text-yellow-600">{item.uom}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Available Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{item.availableQty?.toLocaleString()}</p>
                <p className="text-xs text-gray-600">{item.uom}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-orange-600 mb-1">Safety Stock</p>
                <p className="text-2xl font-bold text-orange-900">{item.safetyStock?.toLocaleString()}</p>
                <p className="text-xs text-orange-600">{item.uom}</p>
              </div>
            </div>
          </div>

          {/* Net Requirement & Planned Order */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Planning Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-lg p-4 ${item.netRequirement > 0 ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}`}>
                <p className="text-sm font-medium mb-1">Net Requirement</p>
                <p className={`text-3xl font-bold ${item.netRequirement > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.netRequirement?.toLocaleString()} {item.uom}
                </p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">Planned Order Release</p>
                <p className="text-3xl font-bold text-blue-600">
                  {item.plannedOrderRelease?.toLocaleString()} {item.uom}
                </p>
              </div>
            </div>
          </div>

          {/* Procurement Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Procurement Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Suggested Action</p>
                <p className="font-semibold text-gray-900">{item.suggestedAction}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lead Time</p>
                <p className="font-semibold text-gray-900">{item.leadTimeDays} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Required Date</p>
                <p className="font-semibold text-gray-900">{item.requiredDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Preferred Vendor</p>
                <p className="font-semibold text-gray-900">{item.preferredVendor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unit Cost</p>
                <p className="font-semibold text-gray-900">₹{item.unitCost?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="font-semibold text-gray-900">₹{item.totalCost?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Affected Work Orders */}
          {item.affectedWOs && item.affectedWOs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Affected Work Orders</h3>
              <div className="flex flex-wrap gap-2">
                {item.affectedWOs.map((wo: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {wo}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
