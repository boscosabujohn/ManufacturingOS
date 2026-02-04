'use client'

import { useState } from 'react'
import { X, Plus, Eye, CheckCircle, FileText, Calendar, Package, DollarSign, Truck, AlertCircle, Clock, ShoppingCart } from 'lucide-react'

// Interfaces
export interface PlannedOrder {
  id: string
  plannedOrderNumber: string
  materialCode: string
  materialName: string
  category: string
  quantity: number
  uom: string
  plannedReleaseDate: string
  plannedReceiptDate: string
  leadTimeDays: number
  supplier: string
  estimatedCost: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  orderType: 'purchase' | 'production' | 'transfer'
  status: 'pending-approval' | 'approved' | 'released' | 'converted'
  sourceRequirements: string[]
  notes: string
}

interface CreatePlannedOrderData {
  materialCode: string
  materialName: string
  orderType: 'purchase' | 'production' | 'transfer'
  quantity: number
  uom: string
  plannedReleaseDate: string
  plannedReceiptDate: string
  supplier: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  notes: string
}

interface ApprovalData {
  comments: string
  conditions: string
  termsAccepted: boolean
}

interface ConvertToPOData {
  poNumber: string
  expectedDeliveryDate: string
  termsAndConditions: string
  vendorConfirmation: boolean
}

// Create Planned Order Modal
interface CreatePlannedOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: CreatePlannedOrderData) => void
}

export function CreatePlannedOrderModal({ isOpen, onClose, onCreate }: CreatePlannedOrderModalProps) {
  const [formData, setFormData] = useState<CreatePlannedOrderData>({
    materialCode: '',
    materialName: '',
    orderType: 'purchase',
    quantity: 0,
    uom: '',
    plannedReleaseDate: '',
    plannedReceiptDate: '',
    supplier: '',
    priority: 'medium',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.materialCode) newErrors.materialCode = 'Material code is required'
    if (!formData.materialName) newErrors.materialName = 'Material name is required'
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0'
    if (!formData.uom) newErrors.uom = 'UOM is required'
    if (!formData.plannedReleaseDate) newErrors.plannedReleaseDate = 'Planned release date is required'
    if (!formData.plannedReceiptDate) newErrors.plannedReceiptDate = 'Planned receipt date is required'
    if (!formData.supplier) newErrors.supplier = 'Supplier/Source is required'

    // Date validation
    if (formData.plannedReleaseDate && formData.plannedReceiptDate) {
      if (new Date(formData.plannedReleaseDate) >= new Date(formData.plannedReceiptDate)) {
        newErrors.plannedReceiptDate = 'Receipt date must be after release date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onCreate(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      materialCode: '',
      materialName: '',
      orderType: 'purchase',
      quantity: 0,
      uom: '',
      plannedReleaseDate: '',
      plannedReceiptDate: '',
      supplier: '',
      priority: 'medium',
      notes: ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  // Mock materials list (in real app, this would come from API)
  const materials = [
    { code: 'RM-SS304-001', name: 'Stainless Steel 304 Sheet (2mm)', uom: 'kg' },
    { code: 'RM-BRASS-002', name: 'Brass Rod (25mm diameter)', uom: 'meter' },
    { code: 'CP-HANDLE-005', name: 'Chrome Plated Lever Handle', uom: 'pcs' },
    { code: 'RM-GRANITE-004', name: 'Granite Slab - Black Galaxy', uom: 'sq.ft' },
    { code: 'CP-GASKET-007', name: 'Silicone Gasket (Food Grade)', uom: 'pcs' },
  ]

  const suppliers = [
    'Steel India Pvt Ltd',
    'Metal Works Limited',
    'Indian Granite Suppliers',
    'Silicone Tech India',
    'Premium Wood Industries',
    'Electric Motors Pvt Ltd',
    'Internal Production',
    'Warehouse Transfer'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Planned Order</h2>
              <p className="text-sm text-green-100">Manually create a new planned order</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Material Selection */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Material Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Code / Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.materialCode}
                  onChange={(e) => {
                    const selected = materials.find(m => m.code === e.target.value)
                    setFormData({
                      ...formData,
                      materialCode: e.target.value,
                      materialName: selected?.name || '',
                      uom: selected?.uom || ''
                    })
                  }}
                  className={`w-full px-3 py-2 border ${errors.materialCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Select Material</option>
                  {materials.map(mat => (
                    <option key={mat.code} value={mat.code}>
                      {mat.code} - {mat.name}
                    </option>
                  ))}
                </select>
                {errors.materialCode && <p className="text-xs text-red-500 mt-1">{errors.materialCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.orderType}
                  onChange={(e) => setFormData({ ...formData, orderType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="purchase">Purchase Order</option>
                  <option value="production">Production Order</option>
                  <option value="transfer">Transfer Order</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quantity and UOM */}
          <div className="mb-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step="0.01"
                  className={`w-full px-3 py-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UOM <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.uom}
                  onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.uom ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="e.g., kg, pcs"
                />
                {errors.uom && <p className="text-xs text-red-500 mt-1">{errors.uom}</p>}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Planning Dates
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Release Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.plannedReleaseDate}
                  onChange={(e) => setFormData({ ...formData, plannedReleaseDate: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.plannedReleaseDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.plannedReleaseDate && <p className="text-xs text-red-500 mt-1">{errors.plannedReleaseDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Receipt Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.plannedReceiptDate}
                  onChange={(e) => setFormData({ ...formData, plannedReceiptDate: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.plannedReceiptDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {errors.plannedReceiptDate && <p className="text-xs text-red-500 mt-1">{errors.plannedReceiptDate}</p>}
              </div>
            </div>
          </div>

          {/* Supplier and Priority */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              Source & Priority
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier / Source <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.supplier ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Select Supplier/Source</option>
                  {suppliers.map(sup => (
                    <option key={sup} value={sup}>{sup}</option>
                  ))}
                </select>
                {errors.supplier && <p className="text-xs text-red-500 mt-1">{errors.supplier}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Add any additional notes or instructions..."
            />
          </div>

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">Creating Planned Order</p>
                <p className="text-xs">Ensure all details are accurate before creating the order. The order will be submitted for approval based on your organization's approval workflow.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Order
          </button>
        </div>
      </div>
    </div>
  )
}

// View Planned Order Modal
interface ViewPlannedOrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: PlannedOrder | null
}

export function ViewPlannedOrderModal({ isOpen, onClose, order }: ViewPlannedOrderModalProps) {
  if (!isOpen || !order) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-approval': return 'bg-yellow-100 text-yellow-700'
      case 'approved': return 'bg-blue-100 text-blue-700'
      case 'released': return 'bg-green-100 text-green-700'
      case 'converted': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Planned Order Details</h2>
              <p className="text-sm text-indigo-100">{order.plannedOrderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Summary Header */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <p className="text-sm text-indigo-600 mb-1">Order Number</p>
                <p className="font-bold text-indigo-900">{order.plannedOrderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Order Type</p>
                <p className="font-bold text-indigo-900 capitalize">{order.orderType}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Priority</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Status</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Material Information */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-600" />
              Material Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-600">Material Code</p>
                  <p className="font-semibold text-gray-900">{order.materialCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Material Name</p>
                  <p className="font-semibold text-gray-900">{order.materialName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">{order.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-semibold text-gray-900">{order.quantity.toLocaleString()} {order.uom}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Timeline */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Dates & Timeline
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-600 mb-1">Planned Release Date</p>
                <p className="text-lg font-bold text-blue-900">{order.plannedReleaseDate}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-600 mb-1">Planned Receipt Date</p>
                <p className="text-lg font-bold text-green-900">{order.plannedReceiptDate}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-purple-600 mb-1">Lead Time</p>
                <p className="text-lg font-bold text-purple-900">{order.leadTimeDays} days</p>
              </div>
            </div>
          </div>

          {/* Source Requirements */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-600" />
              Source Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-600">Supplier / Source</p>
                  <p className="font-semibold text-gray-900">{order.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Source Requirements</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {order.sourceRequirements.map((req, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-indigo-600" />
              Cost Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-600 mb-1">Unit Cost</p>
                <p className="text-xl font-bold text-green-900">
                  {order.estimatedCost > 0 ? `₹${(order.estimatedCost / order.quantity).toFixed(2)}` : '-'}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-600 mb-1">Total Estimated Cost</p>
                <p className="text-xl font-bold text-blue-900">
                  {order.estimatedCost > 0 ? `₹${order.estimatedCost.toLocaleString()}` : '-'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-purple-600 mb-1">Order Type</p>
                <p className="text-xl font-bold text-purple-900 capitalize">{order.orderType}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end border-t border-gray-200">
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

// Approve Order Modal
interface ApproveOrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: PlannedOrder | null
  onApprove: (data: ApprovalData) => void
}

export function ApproveOrderModal({ isOpen, onClose, order, onApprove }: ApproveOrderModalProps) {
  const [approvalData, setApprovalData] = useState<ApprovalData>({
    comments: '',
    conditions: '',
    termsAccepted: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!approvalData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the approval conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onApprove(approvalData)
      handleClose()
    }
  }

  const handleClose = () => {
    setApprovalData({
      comments: '',
      conditions: '',
      termsAccepted: false
    })
    setErrors({})
    onClose()
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Approve Planned Order</h2>
              <p className="text-sm text-blue-100">Review and approve order for processing</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Order Summary */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-blue-600">Order Number</p>
                  <p className="font-semibold text-blue-900">{order.plannedOrderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Material</p>
                  <p className="font-semibold text-blue-900">{order.materialCode}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Quantity</p>
                  <p className="font-semibold text-blue-900">{order.quantity.toLocaleString()} {order.uom}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Estimated Cost</p>
                  <p className="font-semibold text-blue-900">
                    {order.estimatedCost > 0 ? `₹${order.estimatedCost.toLocaleString()}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Supplier</p>
                  <p className="font-semibold text-blue-900">{order.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Receipt Date</p>
                  <p className="font-semibold text-blue-900">{order.plannedReceiptDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Comments <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={approvalData.comments}
              onChange={(e) => setApprovalData({ ...approvalData, comments: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any comments or notes for this approval..."
            />
          </div>

          {/* Conditions */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Conditions <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={approvalData.conditions}
              onChange={(e) => setApprovalData({ ...approvalData, conditions: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special conditions or requirements for this order..."
            />
          </div>

          {/* Terms Acceptance */}
          <div className="mb-3">
            <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 ${errors.termsAccepted ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input
                type="checkbox"
                checked={approvalData.termsAccepted}
                onChange={(e) => setApprovalData({ ...approvalData, termsAccepted: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">I confirm that I have reviewed the order details</span>
                <p className="text-xs text-gray-600 mt-1">
                  By approving this order, I acknowledge that the material requirements, quantities, dates, and costs have been verified and are accurate. I authorize the procurement or production of these materials as specified.
                </p>
              </div>
            </label>
            {errors.termsAccepted && <p className="text-xs text-red-500 mt-2">{errors.termsAccepted}</p>}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Approval Notice</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Approved orders will be released for processing</li>
                  <li>The supplier/production team will be notified</li>
                  <li>Order cannot be easily modified after approval</li>
                  <li>Budget will be allocated for this order</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve Order
          </button>
        </div>
      </div>
    </div>
  )
}

// Convert to PO Modal
interface ConvertToPOModalProps {
  isOpen: boolean
  onClose: () => void
  order: PlannedOrder | null
  onConvert: (data: ConvertToPOData) => void
}

export function ConvertToPOModal({ isOpen, onClose, order, onConvert }: ConvertToPOModalProps) {
  const [poData, setPoData] = useState<ConvertToPOData>({
    poNumber: '',
    expectedDeliveryDate: '',
    termsAndConditions: '',
    vendorConfirmation: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Generate auto PO number
  const generatePONumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 9000) + 1000
    return `PO-${year}-${random}`
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!poData.poNumber) newErrors.poNumber = 'PO Number is required'
    if (!poData.expectedDeliveryDate) newErrors.expectedDeliveryDate = 'Expected delivery date is required'
    if (!poData.vendorConfirmation) newErrors.vendorConfirmation = 'Vendor confirmation is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onConvert(poData)
      handleClose()
    }
  }

  const handleClose = () => {
    setPoData({
      poNumber: '',
      expectedDeliveryDate: '',
      termsAndConditions: '',
      vendorConfirmation: false
    })
    setErrors({})
    onClose()
  }

  // Auto-generate PO number when modal opens
  if (isOpen && !poData.poNumber) {
    setPoData({ ...poData, poNumber: generatePONumber() })
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Convert to Purchase Order</h2>
              <p className="text-sm text-purple-100">Transform planned order into a formal PO</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Planned Order Summary */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Planned Order Summary
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div>
                  <p className="text-sm text-purple-600">Planned Order</p>
                  <p className="font-semibold text-purple-900">{order.plannedOrderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Material</p>
                  <p className="font-semibold text-purple-900">{order.materialCode}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Material Name</p>
                  <p className="font-semibold text-purple-900 text-xs">{order.materialName}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Quantity</p>
                  <p className="font-semibold text-purple-900">{order.quantity.toLocaleString()} {order.uom}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Supplier</p>
                  <p className="font-semibold text-purple-900">{order.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Estimated Cost</p>
                  <p className="font-semibold text-purple-900">
                    {order.estimatedCost > 0 ? `₹${order.estimatedCost.toLocaleString()}` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PO Details */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Purchase Order Details
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={poData.poNumber}
                      onChange={(e) => setPoData({ ...poData, poNumber: e.target.value })}
                      className={`flex-1 px-3 py-2 border ${errors.poNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="PO-2025-XXXX"
                    />
                    <button
                      onClick={() => setPoData({ ...poData, poNumber: generatePONumber() })}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.poNumber && <p className="text-xs text-red-500 mt-1">{errors.poNumber}</p>}
                  <p className="text-xs text-gray-500 mt-1">Auto-generated, but can be edited</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={poData.expectedDeliveryDate}
                    onChange={(e) => setPoData({ ...poData, expectedDeliveryDate: e.target.value })}
                    className={`w-full px-3 py-2 border ${errors.expectedDeliveryDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.expectedDeliveryDate && <p className="text-xs text-red-500 mt-1">{errors.expectedDeliveryDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms and Conditions
                </label>
                <textarea
                  value={poData.termsAndConditions}
                  onChange={(e) => setPoData({ ...poData, termsAndConditions: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter specific terms and conditions for this purchase order..."
                />
                <p className="text-xs text-gray-500 mt-1">Include payment terms, delivery conditions, quality requirements, etc.</p>
              </div>
            </div>
          </div>

          {/* Vendor Confirmation */}
          <div className="mb-3">
            <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 ${errors.vendorConfirmation ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input
                type="checkbox"
                checked={poData.vendorConfirmation}
                onChange={(e) => setPoData({ ...poData, vendorConfirmation: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Vendor Confirmation Required</span>
                <p className="text-xs text-gray-600 mt-1">
                  I confirm that the vendor has been contacted and has agreed to the order specifications, delivery timeline, and pricing. The vendor is ready to receive and process this purchase order.
                </p>
              </div>
            </label>
            {errors.vendorConfirmation && <p className="text-xs text-red-500 mt-2">{errors.vendorConfirmation}</p>}
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-800">
                <p className="font-semibold mb-1">Converting to Purchase Order</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>A formal PO document will be generated</li>
                  <li>The planned order status will change to "Converted"</li>
                  <li>Vendor will receive the official purchase order</li>
                  <li>Budget commitment will be finalized</li>
                  <li>Order tracking will switch to PO tracking system</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Convert to PO
          </button>
        </div>
      </div>
    </div>
  )
}
