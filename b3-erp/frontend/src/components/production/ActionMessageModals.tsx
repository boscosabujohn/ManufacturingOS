'use client'

import { useState } from 'react'
import {
  X,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  Package,
  Calendar,
  DollarSign,
  User,
  Clock,
  FileText,
  TrendingUp,
  AlertCircle,
  Zap,
  Settings,
  MessageSquare,
  ShoppingCart,
  Factory
} from 'lucide-react'

// Interfaces
interface ApproveActionModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: (data: ApprovalData) => void
  actionMessage: ActionMessage | null
}

interface RejectActionModalProps {
  isOpen: boolean
  onClose: () => void
  onReject: (data: RejectionData) => void
  actionMessage: ActionMessage | null
}

interface ViewActionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  actionMessage: ActionMessage | null
}

export interface ActionMessage {
  id: string
  type: 'Purchase Order' | 'Reschedule' | 'Cancel Order' | 'Expedite' | 'Transfer'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  materialCode: string
  materialName: string
  quantity: number
  uom: string
  currentDate?: string
  suggestedDate: string
  reason: string
  impact: string
  affectedWorkOrders: string[]
  unitCost?: number
  totalCost?: number
  supplier?: string
  leadTime?: number
  currentStatus?: string
  history?: ActionHistory[]
}

export interface ActionHistory {
  id: string
  action: string
  performedBy: string
  performedAt: string
  comments?: string
  status: 'approved' | 'rejected' | 'pending'
}

interface ApprovalData {
  implementationDate: string
  assignedTo: string
  comments: string
  autoExecute: boolean
}

interface RejectionData {
  reason: string
  detailedExplanation: string
  alternativeSuggestion?: string
}

// Approve Action Modal
export function ApproveActionModal({ isOpen, onClose, onApprove, actionMessage }: ApproveActionModalProps) {
  const [formData, setFormData] = useState<ApprovalData>({
    implementationDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    comments: '',
    autoExecute: false
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.implementationDate) {
      newErrors.implementationDate = 'Implementation date is required'
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please select a user to assign this action'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onApprove(formData)
      onClose()
      // Reset form
      setFormData({
        implementationDate: new Date().toISOString().split('T')[0],
        assignedTo: '',
        comments: '',
        autoExecute: false
      })
      setErrors({})
    }
  }

  if (!isOpen || !actionMessage) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Approve Action Message</h2>
              <p className="text-sm text-green-100">Approve and schedule action implementation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Action Message Summary */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 mb-3">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Action Message Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-green-600 mb-1">Action Type</p>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  actionMessage.type === 'Purchase Order' ? 'bg-blue-100 text-blue-700' :
                  actionMessage.type === 'Reschedule' ? 'bg-yellow-100 text-yellow-700' :
                  actionMessage.type === 'Cancel Order' ? 'bg-red-100 text-red-700' :
                  actionMessage.type === 'Expedite' ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {actionMessage.type === 'Purchase Order' && <ShoppingCart className="h-4 w-4" />}
                  {actionMessage.type === 'Reschedule' && <Clock className="h-4 w-4" />}
                  {actionMessage.type === 'Expedite' && <Zap className="h-4 w-4" />}
                  {actionMessage.type}
                </span>
              </div>
              <div>
                <p className="text-sm text-green-600 mb-1">Priority</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                  actionMessage.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                  actionMessage.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                  actionMessage.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {actionMessage.priority}
                </span>
              </div>
              <div>
                <p className="text-sm text-green-600 mb-1">Material Code</p>
                <p className="font-bold text-green-900">{actionMessage.materialCode}</p>
              </div>
              <div>
                <p className="text-sm text-green-600 mb-1">Material Name</p>
                <p className="font-bold text-green-900">{actionMessage.materialName}</p>
              </div>
              <div>
                <p className="text-sm text-green-600 mb-1">Quantity</p>
                <p className="font-bold text-green-900">{actionMessage.quantity.toLocaleString()} {actionMessage.uom}</p>
              </div>
              <div>
                <p className="text-sm text-green-600 mb-1">Suggested Date</p>
                <p className="font-bold text-green-900">{actionMessage.suggestedDate}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <p className="text-sm font-semibold text-green-700 mb-1">Reason</p>
              <p className="text-sm text-gray-700">{actionMessage.reason}</p>
            </div>
          </div>

          {/* Approval Form */}
          <div className="space-y-2">
            {/* Implementation Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Implementation Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.implementationDate}
                  onChange={(e) => setFormData({ ...formData, implementationDate: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.implementationDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.implementationDate && (
                <p className="text-xs text-red-600 mt-1">{errors.implementationDate}</p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a user...</option>
                  <option value="procurement_manager">Procurement Manager</option>
                  <option value="production_planner">Production Planner</option>
                  <option value="materials_coordinator">Materials Coordinator</option>
                  <option value="purchasing_agent">Purchasing Agent</option>
                  <option value="inventory_manager">Inventory Manager</option>
                </select>
              </div>
              {errors.assignedTo && (
                <p className="text-xs text-red-600 mt-1">{errors.assignedTo}</p>
              )}
            </div>

            {/* Approval Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Comments
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={4}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Add any additional notes or instructions..."
                />
              </div>
            </div>

            {/* Auto-Execute */}
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.autoExecute}
                onChange={(e) => setFormData({ ...formData, autoExecute: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Auto-Execute Action</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Automatically execute this action on the implementation date</p>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Before Approving</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Verify the suggested date aligns with production schedule</li>
                  <li>Ensure assigned user has capacity to handle this action</li>
                  <li>Check if supplier/vendor can meet the required timeline</li>
                  <li>Review impact on affected work orders</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve Action
          </button>
        </div>
      </div>
    </div>
  )
}

// Reject Action Modal
export function RejectActionModal({ isOpen, onClose, onReject, actionMessage }: RejectActionModalProps) {
  const [formData, setFormData] = useState<RejectionData>({
    reason: '',
    detailedExplanation: '',
    alternativeSuggestion: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.reason) {
      newErrors.reason = 'Please select a rejection reason'
    }

    if (!formData.detailedExplanation.trim()) {
      newErrors.detailedExplanation = 'Detailed explanation is required'
    } else if (formData.detailedExplanation.trim().length < 20) {
      newErrors.detailedExplanation = 'Please provide at least 20 characters of explanation'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onReject(formData)
      onClose()
      // Reset form
      setFormData({
        reason: '',
        detailedExplanation: '',
        alternativeSuggestion: ''
      })
      setErrors({})
    }
  }

  if (!isOpen || !actionMessage) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reject Action Message</h2>
              <p className="text-sm text-red-100">Provide reason for rejecting this action</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Action Message Summary */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 mb-1">Rejecting Action</p>
                <p className="font-bold text-red-900 text-lg">{actionMessage.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-600 mb-1">Material</p>
                <p className="font-bold text-red-900">{actionMessage.materialCode}</p>
                <p className="text-sm text-red-700">{actionMessage.materialName}</p>
              </div>
            </div>
          </div>

          {/* Rejection Form */}
          <div className="space-y-2">
            {/* Rejection Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a reason...</option>
                <option value="Incorrect Data">Incorrect Data</option>
                <option value="Alternative Solution Available">Alternative Solution Available</option>
                <option value="Budget Constraints">Budget Constraints</option>
                <option value="Supplier Issues">Supplier Issues</option>
                <option value="Timeline Not Feasible">Timeline Not Feasible</option>
                <option value="Inventory Already Available">Inventory Already Available</option>
                <option value="Work Order Cancelled">Work Order Cancelled</option>
                <option value="Other">Other</option>
              </select>
              {errors.reason && (
                <p className="text-xs text-red-600 mt-1">{errors.reason}</p>
              )}
            </div>

            {/* Detailed Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Explanation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.detailedExplanation}
                onChange={(e) => setFormData({ ...formData, detailedExplanation: e.target.value })}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.detailedExplanation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please provide a detailed explanation for why this action is being rejected. Include any relevant information that will help understand the decision..."
              />
              {errors.detailedExplanation && (
                <p className="text-xs text-red-600 mt-1">{errors.detailedExplanation}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum 20 characters ({formData.detailedExplanation.length} / 20)
              </p>
            </div>

            {/* Alternative Suggestion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternative Suggestion <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                value={formData.alternativeSuggestion}
                onChange={(e) => setFormData({ ...formData, alternativeSuggestion: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="If you have an alternative solution or suggestion, please describe it here..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide alternative actions or solutions that could address the underlying issue
              </p>
            </div>
          </div>

          {/* Warning Box */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Impact of Rejection</p>
                <p className="text-xs">
                  Rejecting this action message may result in material shortages, production delays, or missed delivery dates.
                  Ensure you have a valid alternative solution before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
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
            <XCircle className="h-4 w-4" />
            Reject Action
          </button>
        </div>
      </div>
    </div>
  )
}

// View Action Details Modal
export function ViewActionDetailsModal({ isOpen, onClose, actionMessage }: ViewActionDetailsModalProps) {
  if (!isOpen || !actionMessage) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Action Message Details</h2>
              <p className="text-sm text-blue-100">{actionMessage.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Summary Header */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  actionMessage.type === 'Purchase Order' ? 'bg-blue-100 text-blue-700' :
                  actionMessage.type === 'Reschedule' ? 'bg-yellow-100 text-yellow-700' :
                  actionMessage.type === 'Cancel Order' ? 'bg-red-100 text-red-700' :
                  actionMessage.type === 'Expedite' ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {actionMessage.type}
                </span>
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  actionMessage.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                  actionMessage.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                  actionMessage.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {actionMessage.priority} Priority
                </span>
              </div>
              {actionMessage.currentStatus && (
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  Status: {actionMessage.currentStatus}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <p className="text-sm text-blue-600 mb-1">Material Code</p>
                <p className="font-bold text-blue-900">{actionMessage.materialCode}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600 mb-1">Material Name</p>
                <p className="font-bold text-blue-900">{actionMessage.materialName}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600 mb-1">Quantity</p>
                <p className="font-bold text-blue-900">{actionMessage.quantity.toLocaleString()} {actionMessage.uom}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600 mb-1">UOM</p>
                <p className="font-bold text-blue-900">{actionMessage.uom}</p>
              </div>
            </div>
          </div>

          {/* Material Information */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Material Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
              <div>
                <p className="text-sm text-gray-600">Material Code</p>
                <p className="font-semibold text-gray-900">{actionMessage.materialCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Material Name</p>
                <p className="font-semibold text-gray-900">{actionMessage.materialName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Required Quantity</p>
                <p className="font-semibold text-gray-900">{actionMessage.quantity.toLocaleString()} {actionMessage.uom}</p>
              </div>
              {actionMessage.supplier && (
                <div>
                  <p className="text-sm text-gray-600">Preferred Supplier</p>
                  <p className="font-semibold text-gray-900">{actionMessage.supplier}</p>
                </div>
              )}
              {actionMessage.leadTime && (
                <div>
                  <p className="text-sm text-gray-600">Lead Time</p>
                  <p className="font-semibold text-gray-900">{actionMessage.leadTime} days</p>
                </div>
              )}
            </div>
          </div>

          {/* Date Comparison */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Timeline Comparison
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {actionMessage.currentDate && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-600 font-medium mb-1">Current Date</p>
                  <p className="text-2xl font-bold text-yellow-900">{actionMessage.currentDate}</p>
                  <p className="text-xs text-yellow-600 mt-1">Existing schedule</p>
                </div>
              )}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600 font-medium mb-1">Suggested Date</p>
                <p className="text-2xl font-bold text-green-900">{actionMessage.suggestedDate}</p>
                <p className="text-xs text-green-600 mt-1">Recommended by MRP</p>
              </div>
            </div>
          </div>

          {/* Cost Details */}
          {(actionMessage.unitCost || actionMessage.totalCost) && (
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Cost Details
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {actionMessage.unitCost && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-blue-600 mb-1">Unit Cost</p>
                    <p className="text-2xl font-bold text-blue-900">₹{actionMessage.unitCost.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">per {actionMessage.uom}</p>
                  </div>
                )}
                {actionMessage.totalCost && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-sm text-green-600 mb-1">Total Cost</p>
                    <p className="text-2xl font-bold text-green-900">₹{actionMessage.totalCost.toLocaleString()}</p>
                    <p className="text-xs text-green-600">for {actionMessage.quantity.toLocaleString()} {actionMessage.uom}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reason and Impact */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Reason and Impact Analysis
            </h3>
            <div className="space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-700 mb-1">Reason</p>
                    <p className="text-sm text-gray-700">{actionMessage.reason}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-1">Impact</p>
                    <p className="text-sm text-gray-700">{actionMessage.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Affected Work Orders */}
          {actionMessage.affectedWorkOrders && actionMessage.affectedWorkOrders.length > 0 && (
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Factory className="h-5 w-5 text-blue-600" />
                Affected Work Orders
              </h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {actionMessage.affectedWorkOrders.map((wo, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium border border-purple-300">
                      {wo}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-purple-600 mt-3">
                  {actionMessage.affectedWorkOrders.length} work order(s) will be impacted by this action
                </p>
              </div>
            </div>
          )}

          {/* Action History */}
          {actionMessage.history && actionMessage.history.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Action History
              </h3>
              <div className="space-y-3">
                {actionMessage.history.map((historyItem) => (
                  <div key={historyItem.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          historyItem.status === 'approved' ? 'bg-green-100' :
                          historyItem.status === 'rejected' ? 'bg-red-100' :
                          'bg-yellow-100'
                        }`}>
                          {historyItem.status === 'approved' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                           historyItem.status === 'rejected' ? <XCircle className="h-5 w-5 text-red-600" /> :
                           <Clock className="h-5 w-5 text-yellow-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{historyItem.action}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            by {historyItem.performedBy} on {new Date(historyItem.performedAt).toLocaleString()}
                          </p>
                          {historyItem.comments && (
                            <p className="text-sm text-gray-700 mt-2 italic">"{historyItem.comments}"</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        historyItem.status === 'approved' ? 'bg-green-100 text-green-700' :
                        historyItem.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {historyItem.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
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
