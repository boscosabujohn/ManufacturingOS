'use client'

import { useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  Save,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  DollarSign,
  Percent,
  AlertCircle,
  ArrowRight,
  FileText,
  TrendingDown
} from 'lucide-react'
import type {
  ApprovalThreshold,
  ApprovalRequest,
  ApproverRole
} from './ApprovalMatrix'

interface CreateThresholdModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (threshold: Partial<ApprovalThreshold>) => void
}

interface EditThresholdModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (threshold: ApprovalThreshold) => void
  threshold: ApprovalThreshold | null
}

interface ViewRequestModalProps {
  isOpen: boolean
  onClose: () => void
  request: ApprovalRequest | null
  currentUserRole?: ApproverRole
  onApprove?: (requestId: string, comments?: string) => void
  onReject?: (requestId: string, comments: string) => void
}

const roleOptions: { value: ApproverRole; label: string }[] = [
  { value: 'sales_rep', label: 'Sales Rep' },
  { value: 'sales_manager', label: 'Sales Manager' },
  { value: 'director', label: 'Director' },
  { value: 'vp_sales', label: 'VP Sales' },
  { value: 'cfo', label: 'CFO' },
  { value: 'ceo', label: 'CEO' }
]

export const CreateThresholdModal: React.FC<CreateThresholdModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    conditionType: 'deal_value' as 'deal_value' | 'discount_percent' | 'margin_percent' | 'custom_field',
    conditionOperator: 'greater_than' as 'greater_than' | 'less_than' | 'equals' | 'between',
    conditionValue: '',
    conditionValueEnd: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    autoEscalateAfterHours: ''
  })

  const [requiredApprovers, setRequiredApprovers] = useState<{ role: ApproverRole; count: number }[]>([
    { role: 'sales_manager', count: 1 }
  ])

  const handleAddApprover = () => {
    setRequiredApprovers([...requiredApprovers, { role: 'sales_manager', count: 1 }])
  }

  const handleRemoveApprover = (index: number) => {
    if (requiredApprovers.length > 1) {
      setRequiredApprovers(requiredApprovers.filter((_, i) => i !== index))
    }
  }

  const handleApproverChange = (index: number, field: 'role' | 'count', value: any) => {
    setRequiredApprovers(requiredApprovers.map((approver, i) =>
      i === index ? { ...approver, [field]: value } : approver
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let conditionValue: number | [number, number]
    if (formData.conditionOperator === 'between') {
      conditionValue = [parseFloat(formData.conditionValue), parseFloat(formData.conditionValueEnd)]
    } else {
      conditionValue = parseFloat(formData.conditionValue)
    }

    const newThreshold: Partial<ApprovalThreshold> = {
      name: formData.name,
      description: formData.description,
      condition: {
        type: formData.conditionType,
        operator: formData.conditionOperator,
        value: conditionValue
      },
      requiredApprovers,
      priority: formData.priority,
      autoEscalateAfterHours: formData.autoEscalateAfterHours ? parseInt(formData.autoEscalateAfterHours) : undefined
    }

    onSave(newThreshold)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Create Approval Threshold</h2>
              <p className="text-sm opacity-90">Define rules for when approvals are required</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Threshold Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., High Value Deal Approval"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={2}
                placeholder="Brief description of this threshold..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Escalate After (Hours)</label>
                <input
                  type="number"
                  value={formData.autoEscalateAfterHours}
                  onChange={(e) => setFormData({ ...formData, autoEscalateAfterHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="24"
                />
              </div>
            </div>
          </div>

          {/* Trigger Condition */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Trigger Condition</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition Type *</label>
                <select
                  value={formData.conditionType}
                  onChange={(e) => setFormData({ ...formData, conditionType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="deal_value">Deal Value</option>
                  <option value="discount_percent">Discount Percentage</option>
                  <option value="margin_percent">Margin Percentage</option>
                  <option value="custom_field">Custom Field</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operator *</label>
                <select
                  value={formData.conditionOperator}
                  onChange={(e) => setFormData({ ...formData, conditionOperator: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="greater_than">Greater Than</option>
                  <option value="less_than">Less Than</option>
                  <option value="equals">Equals</option>
                  <option value="between">Between</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value * {formData.conditionType.includes('percent') && '(%)'}
                  {formData.conditionType === 'deal_value' && '($)'}
                </label>
                <input
                  type="number"
                  required
                  value={formData.conditionValue}
                  onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  step="0.01"
                  placeholder="Enter value"
                />
              </div>

              {formData.conditionOperator === 'between' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Value * {formData.conditionType.includes('percent') && '(%)'}
                    {formData.conditionType === 'deal_value' && '($)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.conditionValueEnd}
                    onChange={(e) => setFormData({ ...formData, conditionValueEnd: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    step="0.01"
                    placeholder="Enter end value"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Required Approvers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Required Approvers</h3>
              <button
                type="button"
                onClick={handleAddApprover}
                className="flex items-center gap-2 px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Level
              </button>
            </div>

            <div className="space-y-3">
              {requiredApprovers.map((approver, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-700">Level {index + 1}</span>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                        <select
                          value={approver.role}
                          onChange={(e) => handleApproverChange(index, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {roleOptions.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Count</label>
                        <input
                          type="number"
                          min="1"
                          value={approver.count}
                          onChange={(e) => handleApproverChange(index, 'count', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveApprover(index)}
                      disabled={requiredApprovers.length === 1}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              Create Threshold
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const EditThresholdModal: React.FC<EditThresholdModalProps> = ({ isOpen, onClose, onSave, threshold }) => {
  if (!isOpen || !threshold) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...threshold,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Edit Approval Threshold</h2>
            <p className="text-sm opacity-90 mt-1">{threshold.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a simplified edit modal. In production, this would include all fields similar to the Create modal with pre-filled data.
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Threshold Name</label>
              <input
                type="text"
                value={threshold.name}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={threshold.description}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const ViewRequestModal: React.FC<ViewRequestModalProps> = ({
  isOpen,
  onClose,
  request,
  currentUserRole,
  onApprove,
  onReject
}) => {
  const [comment, setComment] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)

  if (!isOpen || !request) return null

  const canApprove = currentUserRole && request.approvers.some(
    a => a.role === currentUserRole && a.status === 'pending'
  )

  const handleApproveClick = () => {
    if (onApprove) {
      onApprove(request.id, comment || undefined)
      setComment('')
      onClose()
    }
  }

  const handleRejectClick = () => {
    if (comment.trim() && onReject) {
      onReject(request.id, comment)
      setComment('')
      setIsRejecting(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full  max-h-[90vh] overflow-y-auto">
        <div className={`sticky top-0 text-white p-3 flex items-center justify-between ${
          request.status === 'approved' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
          request.status === 'rejected' ? 'bg-gradient-to-r from-red-600 to-rose-600' :
          'bg-gradient-to-r from-yellow-600 to-orange-600'
        }`}>
          <div>
            <h2 className="text-2xl font-bold">{request.quoteName}</h2>
            <p className="text-sm opacity-90 mt-1">Approval Request Details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Request Summary */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Customer</p>
              <p className="text-lg font-bold text-gray-900">{request.customerName}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs text-green-600 mb-1">Deal Value</p>
              <p className="text-lg font-bold text-green-700">${request.dealValue.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <p className="text-xs text-red-600 mb-1">Discount</p>
              <p className="text-lg font-bold text-red-700">{request.discountPercent}%</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-600 mb-1">Margin</p>
              <p className="text-lg font-bold text-blue-700">{request.marginPercent}%</p>
            </div>
          </div>

          {/* Justification */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Justification
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-700">{request.justification}</p>
            </div>
          </div>

          {/* Approval Progress */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Approval Timeline
            </h3>
            <div className="space-y-3">
              {request.approvers.map((approver, index) => (
                <div key={approver.id} className="flex items-start gap-2">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      approver.status === 'approved' ? 'bg-green-100' :
                      approver.status === 'rejected' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      {approver.status === 'approved' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                       approver.status === 'rejected' ? <XCircle className="h-5 w-5 text-red-600" /> :
                       <Clock className="h-5 w-5 text-yellow-600" />}
                    </div>
                    {index < request.approvers.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{approver.name}</p>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {approver.role.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        approver.status === 'approved' ? 'bg-green-100 text-green-700' :
                        approver.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {approver.status.toUpperCase()}
                      </span>
                    </div>
                    {approver.respondedAt && (
                      <p className="text-xs text-gray-500">
                        {new Date(approver.respondedAt).toLocaleString()}
                      </p>
                    )}
                    {approver.comments && (
                      <p className="text-sm text-gray-700 mt-1 italic">"{approver.comments}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Section */}
          {canApprove && !isRejecting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Your Action Required</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  rows={3}
                  placeholder="Add any comments about your decision..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApproveClick}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Approve
                </button>
                <button
                  onClick={() => setIsRejecting(true)}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Rejection Form */}
          {canApprove && isRejecting && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-red-900 mb-3">Rejection Reason Required</h3>
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                  rows={3}
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRejectClick}
                  disabled={!comment.trim()}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setIsRejecting(false)
                    setComment('')
                  }}
                  className="flex-1 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
