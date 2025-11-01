'use client'

import { useState } from 'react'
import { X, AlertTriangle, ShoppingCart, TrendingDown, Calendar, Package, DollarSign, Clock, Users, FileText, Truck, CheckCircle, AlertCircle } from 'lucide-react'

// Resolve Shortage Modal
interface ResolveShortageModalProps {
  isOpen: boolean
  onClose: () => void
  onResolve: (resolution: ShortageResolution) => void
  shortage: ShortageItem | null
}

interface ShortageItem {
  materialCode: string
  materialName: string
  shortageQuantity: number
  uom: string
  affectedWorkOrders: string[]
  preferredSupplier: string
  alternativeSuppliers: string[]
  currentLeadTime: number
  estimatedImpactValue: number
}

interface ShortageResolution {
  resolutionMethod: string
  selectedSupplier: string
  targetDate: string
  priorityLevel: string
  actionPlan: string
}

export function ResolveShortageModal({ isOpen, onClose, onResolve, shortage }: ResolveShortageModalProps) {
  const [resolution, setResolution] = useState<ShortageResolution>({
    resolutionMethod: 'Emergency Purchase',
    selectedSupplier: shortage?.preferredSupplier || '',
    targetDate: '',
    priorityLevel: 'High',
    actionPlan: ''
  })

  const handleSubmit = () => {
    onResolve(resolution)
    onClose()
  }

  if (!isOpen || !shortage) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Resolve Material Shortage</h2>
              <p className="text-sm text-red-100">Create resolution plan for critical shortage</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Shortage Details */}
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shortage Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-red-600 mb-1">Material</p>
                <p className="font-bold text-red-900">{shortage.materialCode}</p>
                <p className="text-xs text-red-700">{shortage.materialName}</p>
              </div>
              <div>
                <p className="text-sm text-red-600 mb-1">Shortage Quantity</p>
                <p className="font-bold text-red-900">{shortage.shortageQuantity.toLocaleString()} {shortage.uom}</p>
              </div>
              <div>
                <p className="text-sm text-red-600 mb-1">Impact Value</p>
                <p className="font-bold text-red-900">₹{shortage.estimatedImpactValue.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-red-600 mb-2">Affected Work Orders</p>
              <div className="flex flex-wrap gap-2">
                {shortage.affectedWorkOrders.map((wo, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {wo}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Resolution Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resolution Method <span className="text-red-500">*</span>
            </label>
            <select
              value={resolution.resolutionMethod}
              onChange={(e) => setResolution({ ...resolution, resolutionMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Emergency Purchase">Emergency Purchase - Immediate supplier order</option>
              <option value="Expedite Existing Order">Expedite Existing Order - Rush current PO</option>
              <option value="Find Alternative Material">Find Alternative Material - Substitute approved</option>
              <option value="Reschedule Work Orders">Reschedule Work Orders - Adjust production timeline</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Select the most appropriate resolution approach</p>
          </div>

          {/* Supplier Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Selection <span className="text-red-500">*</span>
            </label>
            <select
              value={resolution.selectedSupplier}
              onChange={(e) => setResolution({ ...resolution, selectedSupplier: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value={shortage.preferredSupplier}>{shortage.preferredSupplier} (Preferred)</option>
              {shortage.alternativeSuppliers.map((supplier, idx) => (
                <option key={idx} value={supplier}>{supplier} (Alternative)</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Standard lead time: {shortage.currentLeadTime} days</p>
          </div>

          {/* Target Resolution Date & Priority */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Resolution Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={resolution.targetDate}
                onChange={(e) => setResolution({ ...resolution, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <select
                value={resolution.priorityLevel}
                onChange={(e) => setResolution({ ...resolution, priorityLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Critical">Critical - Production stoppage risk</option>
                <option value="High">High - Multiple WOs affected</option>
                <option value="Medium">Medium - Single WO affected</option>
                <option value="Low">Low - Minimal impact</option>
              </select>
            </div>
          </div>

          {/* Action Plan Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Plan & Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={resolution.actionPlan}
              onChange={(e) => setResolution({ ...resolution, actionPlan: e.target.value })}
              rows={4}
              placeholder="Describe the detailed action plan, escalation steps, and key contacts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-500 mt-1">Include specific actions, responsibilities, and milestones</p>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Resolution Guidelines</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Notify affected work order managers immediately</li>
                  <li>Get approval for premium freight if expedited shipping required</li>
                  <li>Update production schedule based on revised material availability</li>
                  <li>Document all supplier communications and commitments</li>
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
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Create Resolution Plan
          </button>
        </div>
      </div>
    </div>
  )
}

// Create Emergency PO Modal
interface CreateEmergencyPOModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (po: EmergencyPO) => void
  shortage: ShortageItem | null
}

interface EmergencyPO {
  quantity: number
  selectedSupplier: string
  expediteShipping: boolean
  premiumFreightCost: number
  deliveryDate: string
  approverEmail: string
  notes: string
}

export function CreateEmergencyPOModal({ isOpen, onClose, onCreate, shortage }: CreateEmergencyPOModalProps) {
  const [po, setPO] = useState<EmergencyPO>({
    quantity: shortage?.shortageQuantity || 0,
    selectedSupplier: shortage?.preferredSupplier || '',
    expediteShipping: true,
    premiumFreightCost: 0,
    deliveryDate: '',
    approverEmail: '',
    notes: ''
  })

  const calculatePremiumFreight = (expedite: boolean) => {
    if (!expedite || !shortage) return 0
    // Estimate 15% premium for expedited shipping
    return Math.round((shortage.shortageQuantity * 50) * 0.15)
  }

  const handleExpediteChange = (checked: boolean) => {
    setPO({
      ...po,
      expediteShipping: checked,
      premiumFreightCost: calculatePremiumFreight(checked)
    })
  }

  const handleSubmit = () => {
    onCreate(po)
    onClose()
  }

  if (!isOpen || !shortage) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Emergency Purchase Order</h2>
              <p className="text-sm text-orange-100">Fast-track procurement for critical shortage</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Material Summary */}
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Material Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-orange-600 mb-1">Material Code</p>
                <p className="font-bold text-orange-900">{shortage.materialCode}</p>
              </div>
              <div>
                <p className="text-sm text-orange-600 mb-1">Material Name</p>
                <p className="font-bold text-orange-900">{shortage.materialName}</p>
              </div>
              <div>
                <p className="text-sm text-orange-600 mb-1">Shortage Amount</p>
                <p className="font-bold text-orange-900">{shortage.shortageQuantity.toLocaleString()} {shortage.uom}</p>
              </div>
            </div>
          </div>

          {/* Quantity Needed */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity to Order <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <input
                  type="number"
                  value={po.quantity}
                  onChange={(e) => setPO({ ...po, quantity: parseInt(e.target.value) || 0 })}
                  min={shortage.shortageQuantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                {shortage.uom}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum required: {shortage.shortageQuantity.toLocaleString()} {shortage.uom}</p>
          </div>

          {/* Supplier Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-100">
                <input
                  type="radio"
                  name="supplier"
                  value={shortage.preferredSupplier}
                  checked={po.selectedSupplier === shortage.preferredSupplier}
                  onChange={(e) => setPO({ ...po, selectedSupplier: e.target.value })}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">{shortage.preferredSupplier}</span>
                  <span className="ml-2 px-2 py-0.5 bg-orange-600 text-white text-xs rounded-full">Preferred</span>
                  <p className="text-xs text-gray-600">Lead time: {shortage.currentLeadTime} days | Established relationship</p>
                </div>
              </label>
              {shortage.alternativeSuppliers.map((supplier, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-300 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="supplier"
                    value={supplier}
                    checked={po.selectedSupplier === supplier}
                    onChange={(e) => setPO({ ...po, selectedSupplier: e.target.value })}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{supplier}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">Alternative</span>
                    <p className="text-xs text-gray-600">May have different pricing and lead times</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Expedite Shipping */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-gray-300 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={po.expediteShipping}
                onChange={(e) => handleExpediteChange(e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Expedite Shipping (Premium Freight)</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">Rush delivery to meet critical timeline - recommended for emergency orders</p>
                {po.expediteShipping && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-orange-900 mb-1">Premium Freight Cost Estimate</p>
                    <p className="text-2xl font-bold text-orange-600">₹{po.premiumFreightCost.toLocaleString()}</p>
                    <p className="text-xs text-orange-700 mt-1">Based on expedited shipping rates and quantity</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Delivery Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={po.deliveryDate}
              onChange={(e) => setPO({ ...po, deliveryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {po.expediteShipping ? 'Expedited delivery: 2-3 days' : `Standard delivery: ${shortage.currentLeadTime} days`}
            </p>
          </div>

          {/* Approver Notification */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approver Email Notification <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={po.approverEmail}
              onChange={(e) => setPO({ ...po, approverEmail: e.target.value })}
              placeholder="procurement.manager@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">Emergency PO requires immediate approval notification</p>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={po.notes}
              onChange={(e) => setPO({ ...po, notes: e.target.value })}
              rows={3}
              placeholder="Special instructions, payment terms, delivery requirements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Emergency PO Process</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>PO will be flagged for expedited approval workflow</li>
                  <li>Approver will receive immediate notification</li>
                  <li>Supplier will be contacted for rush processing</li>
                  <li>Affected work orders will be updated with revised material timeline</li>
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
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Create Emergency PO
          </button>
        </div>
      </div>
    </div>
  )
}

// View Impact Analysis Modal
interface ViewImpactAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  shortage: ShortageItem | null
}

interface WorkOrderImpact {
  woNumber: string
  productName: string
  quantity: number
  dueDate: string
  customerName: string
  delayDays: number
  revenue: number
  penalty: number
}

export function ViewImpactAnalysisModal({ isOpen, onClose, shortage }: ViewImpactAnalysisModalProps) {
  if (!isOpen || !shortage) return null

  // Mock impact data
  const affectedWorkOrders: WorkOrderImpact[] = shortage.affectedWorkOrders.map((wo, idx) => ({
    woNumber: wo,
    productName: idx === 0 ? 'Premium Mixer Grinder 750W' : idx === 1 ? 'Industrial Food Processor' : 'Commercial Blender Pro',
    quantity: idx === 0 ? 500 : idx === 1 ? 300 : 200,
    dueDate: idx === 0 ? '2025-10-25' : idx === 1 ? '2025-10-27' : '2025-10-28',
    customerName: idx === 0 ? 'RetailCorp India' : idx === 1 ? 'Metro Stores Ltd' : 'Kitchen Pro Distributors',
    delayDays: idx === 0 ? 5 : idx === 1 ? 3 : 2,
    revenue: idx === 0 ? 2500000 : idx === 1 ? 1800000 : 1200000,
    penalty: idx === 0 ? 125000 : idx === 1 ? 90000 : 60000
  }))

  const totalRevenue = affectedWorkOrders.reduce((sum, wo) => sum + wo.revenue, 0)
  const totalPenalties = affectedWorkOrders.reduce((sum, wo) => sum + wo.penalty, 0)
  const additionalCosts = Math.round(shortage.estimatedImpactValue * 0.15) // 15% additional costs
  const totalFinancialImpact = totalPenalties + additionalCosts

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Impact Analysis</h2>
              <p className="text-sm text-yellow-100">Detailed shortage impact on production and business</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Material Overview */}
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">Material Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-yellow-600 mb-1">Material Code</p>
                <p className="font-bold text-yellow-900">{shortage.materialCode}</p>
              </div>
              <div>
                <p className="text-sm text-yellow-600 mb-1">Shortage Quantity</p>
                <p className="font-bold text-yellow-900">{shortage.shortageQuantity.toLocaleString()} {shortage.uom}</p>
              </div>
              <div>
                <p className="text-sm text-yellow-600 mb-1">Affected WOs</p>
                <p className="font-bold text-yellow-900">{shortage.affectedWorkOrders.length}</p>
              </div>
              <div>
                <p className="text-sm text-yellow-600 mb-1">Lead Time</p>
                <p className="font-bold text-yellow-900">{shortage.currentLeadTime} days</p>
              </div>
            </div>
          </div>

          {/* Financial Impact Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              Financial Impact Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">At-Risk Revenue</p>
                <p className="text-2xl font-bold text-blue-900">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-blue-600 mt-1">Total order value</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-600 mb-1">Delay Penalties</p>
                <p className="text-2xl font-bold text-red-900">₹{(totalPenalties / 100000).toFixed(1)}L</p>
                <p className="text-xs text-red-600 mt-1">Contractual penalties</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-600 mb-1">Additional Costs</p>
                <p className="text-2xl font-bold text-orange-900">₹{(additionalCosts / 1000).toFixed(0)}K</p>
                <p className="text-xs text-orange-600 mt-1">Expediting, labor</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm text-purple-600 mb-1">Total Impact</p>
                <p className="text-2xl font-bold text-purple-900">₹{(totalFinancialImpact / 100000).toFixed(1)}L</p>
                <p className="text-xs text-purple-600 mt-1">Total financial exposure</p>
              </div>
            </div>
          </div>

          {/* Production Timeline Visualization */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              Production Timeline Impact
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium text-gray-700">Current Status</div>
                  <div className="flex-1 bg-red-200 h-8 rounded-lg flex items-center px-3">
                    <span className="text-sm font-bold text-red-900">Material Shortage - Production Blocked</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium text-gray-700">Expected Delay</div>
                  <div className="flex-1 bg-yellow-200 h-8 rounded-lg flex items-center px-3">
                    <span className="text-sm font-bold text-yellow-900">3-5 Days - Rush procurement required</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium text-gray-700">Recovery Plan</div>
                  <div className="flex-1 bg-green-200 h-8 rounded-lg flex items-center px-3">
                    <span className="text-sm font-bold text-green-900">Expedited shipping + Overtime production</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Affected Work Orders List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-yellow-600" />
              Affected Work Orders
            </h3>
            <div className="space-y-3">
              {affectedWorkOrders.map((wo, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{wo.woNumber}</h4>
                      <p className="text-sm text-gray-600">{wo.productName}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      {wo.delayDays} days delay
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Quantity</p>
                      <p className="font-semibold text-gray-900">{wo.quantity.toLocaleString()} units</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-semibold text-gray-900">{wo.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Customer</p>
                      <p className="font-semibold text-gray-900">{wo.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Order Value</p>
                      <p className="font-semibold text-gray-900">₹{(wo.revenue / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Penalty Risk</p>
                      <p className="font-semibold text-red-600">₹{(wo.penalty / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Orders at Risk */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-yellow-600" />
              Customer Orders at Risk
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="space-y-2">
                {affectedWorkOrders.map((wo, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">{wo.customerName}</span>
                    </div>
                    <span className="text-sm text-red-700">Due: {wo.dueDate} • Delay: {wo.delayDays} days</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mitigation Strategies */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-yellow-600" />
              Recommended Mitigation Strategies
            </h3>
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Immediate: Emergency Procurement</h4>
                    <p className="text-sm text-green-800">Place emergency PO with expedited shipping to reduce delay from 5 to 2-3 days. Estimated additional cost: ₹{(additionalCosts / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-200 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Short-term: Reschedule Lower Priority WOs</h4>
                    <p className="text-sm text-blue-800">Prioritize customer orders with highest penalties. Shift non-critical WOs to use received material when available.</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">Communication: Proactive Customer Notification</h4>
                    <p className="text-sm text-purple-800">Immediately notify affected customers of potential delays. Negotiate penalty waivers with transparency and recovery plan.</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-200 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-yellow-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Long-term: Increase Safety Stock</h4>
                    <p className="text-sm text-yellow-800">Review safety stock levels for critical materials. Implement dual sourcing strategy to prevent future shortages.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export Analysis
          </button>
        </div>
      </div>
    </div>
  )
}
