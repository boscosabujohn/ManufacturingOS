'use client'

import { useState } from 'react'
import {
  X,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Send,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  User,
  Calendar,
  Package,
  Building2,
  DollarSign,
  ArrowRight,
  History,
  Download,
  Filter,
  Search,
  Eye,
  Users,
  Zap
} from 'lucide-react'

// ==================== TYPES ====================

export interface ApprovalData {
  id?: string
  documentType?: string
  documentNumber?: string
  title?: string
  requestedBy?: string
  requestedDate?: string
  amount?: number
  currency?: string
  priority?: string
  status?: string
  currentApprover?: string
  approvalLevel?: number
  totalLevels?: number
  dueDate?: string
  department?: string
  vendor?: string
  justification?: string
  attachments?: number
  comments?: number
  approvalHistory?: Array<{
    approver: string
    action: string
    date: string
    comments?: string
    level: number
  }>
  nextApprovers?: string[]
  slaStatus?: string
}

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  approval?: ApprovalData
  onSubmit?: (data: any) => void
}

// ==================== APPROVE MODAL ====================

export function ApproveModal({ isOpen, onClose, approval, onSubmit }: ApprovalModalProps) {
  const [comments, setComments] = useState('')
  const [notifyNext, setNotifyNext] = useState(true)
  const [addConditions, setAddConditions] = useState(false)
  const [conditions, setConditions] = useState('')
  const [attachFiles, setAttachFiles] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      action: 'approved',
      comments,
      notifyNext,
      conditions: addConditions ? conditions : null,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Approve Request</h2>
              <p className="text-green-100 text-sm">{approval?.documentNumber} - {approval?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Summary */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <h3 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Request Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Document:</span>
                <p className="font-medium text-gray-900">{approval?.documentNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Requested By:</span>
                <p className="font-medium text-gray-900">{approval?.requestedBy}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <p className="font-medium text-gray-900">{approval?.currency} {approval?.amount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <p className="font-medium text-gray-900">{approval?.department}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Justification:</span>
                <p className="font-medium text-gray-900">{approval?.justification}</p>
              </div>
            </div>
          </div>

          {/* Approval Level Progress */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Approval Progress</span>
              <span className="text-sm text-blue-700">Level {approval?.approvalLevel} of {approval?.totalLevels}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${((approval?.approvalLevel || 1) / (approval?.totalLevels || 1)) * 100}%` }}
              />
            </div>
            {approval?.nextApprovers && approval.nextApprovers.length > 0 && (
              <p className="text-sm text-blue-700 mt-2">
                Next Approver: <span className="font-medium">{approval.nextApprovers.join(', ')}</span>
              </p>
            )}
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Enter your approval comments and any recommendations..."
            />
            <p className="text-xs text-gray-500 mt-1">Your comments will be visible to all approvers in the chain</p>
          </div>

          {/* Conditional Approval */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={addConditions}
                onChange={(e) => setAddConditions(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Add Conditions to Approval</span>
                <p className="text-xs text-gray-500">Specify conditions that must be met for this approval</p>
              </div>
            </label>
            {addConditions && (
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 mt-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="E.g., Approval valid only if final price is within 5% of quote..."
              />
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyNext}
                onChange={(e) => setNotifyNext(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Notify next approver</span>
                <p className="text-xs text-gray-500">Send email notification to the next approver in the chain</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={attachFiles}
                onChange={(e) => setAttachFiles(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Attach supporting documents</span>
                <p className="text-xs text-gray-500">Add additional files to support your approval decision</p>
              </div>
            </label>
          </div>

          {/* Impact Warning */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900">Approval Impact</h4>
              <p className="text-sm text-green-700 mt-1">
                Approving this request will {approval?.approvalLevel === approval?.totalLevels ?
                  'finalize the approval process and allow execution' :
                  `move it to Level ${(approval?.approvalLevel || 0) + 1} (${approval?.nextApprovers?.[0]})`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              Approve Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== REJECT MODAL ====================

export function RejectModal({ isOpen, onClose, approval, onSubmit }: ApprovalModalProps) {
  const [reason, setReason] = useState('')
  const [category, setCategory] = useState('')
  const [notifyRequester, setNotifyRequester] = useState(true)
  const [allowResubmission, setAllowResubmission] = useState(true)
  const [suggestions, setSuggestions] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      action: 'rejected',
      reason,
      category,
      notifyRequester,
      allowResubmission,
      suggestions,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ThumbsDown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Reject Request</h2>
              <p className="text-red-100 text-sm">{approval?.documentNumber} - {approval?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Summary */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
            <h3 className="text-sm font-semibold text-red-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Request Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Document:</span>
                <p className="font-medium text-gray-900">{approval?.documentNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Requested By:</span>
                <p className="font-medium text-gray-900">{approval?.requestedBy}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <p className="font-medium text-gray-900">{approval?.currency} {approval?.amount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <p className="font-medium text-gray-900">{approval?.department}</p>
              </div>
            </div>
          </div>

          {/* Rejection Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="budget">Budget Exceeded / Not Available</option>
              <option value="policy">Policy Violation</option>
              <option value="incomplete">Incomplete Information</option>
              <option value="justification">Insufficient Justification</option>
              <option value="timing">Inappropriate Timing</option>
              <option value="alternative">Better Alternative Available</option>
              <option value="vendor">Vendor Related Issues</option>
              <option value="compliance">Compliance Concerns</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Rejection Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Provide clear and specific reasons for rejecting this request..."
            />
            <p className="text-xs text-gray-500 mt-1">Be specific to help the requester understand the decision</p>
          </div>

          {/* Suggestions for Resubmission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggestions for Improvement (Optional)
            </label>
            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="E.g., Reduce quantity by 20%, get quotes from 3 vendors, align with Q2 budget..."
            />
            <p className="text-xs text-gray-500 mt-1">Help the requester by suggesting how to address the issues</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyRequester}
                onChange={(e) => setNotifyRequester(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Notify requester immediately</span>
                <p className="text-xs text-gray-500">Send email notification with rejection details</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowResubmission}
                onChange={(e) => setAllowResubmission(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Allow resubmission</span>
                <p className="text-xs text-gray-500">Requester can modify and resubmit the request</p>
              </div>
            </label>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Rejection Impact</h4>
              <p className="text-sm text-red-700 mt-1">
                Rejecting this request will terminate the current approval workflow.
                {allowResubmission ? ' The requester can modify and resubmit.' : ' This is a final rejection.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              Reject Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== DELEGATE MODAL ====================

export function DelegateModal({ isOpen, onClose, approval, onSubmit }: ApprovalModalProps) {
  const [delegateTo, setDelegateTo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [delegateAll, setDelegateAll] = useState(false)
  const [notifyDelegate, setNotifyDelegate] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      delegateTo,
      startDate,
      endDate,
      reason,
      delegateAll,
      timestamp: new Date().toISOString()
    })
  }

  // Mock users for delegation
  const availableApprovers = [
    'Mike Davis - Procurement Manager',
    'Robert Chen - Director of Operations',
    'Emma Wilson - CFO',
    'Lisa Anderson - VP Procurement',
    'David Lee - Senior Manager'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Delegate Approval</h2>
              <p className="text-purple-100 text-sm">Transfer approval authority temporarily</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Request Info (if specific) */}
          {approval?.documentNumber && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-900 mb-2">Delegating Approval For:</h3>
              <p className="text-sm text-purple-800">{approval.documentNumber} - {approval.title}</p>
            </div>
          )}

          {/* Delegate To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delegate To <span className="text-red-500">*</span>
            </label>
            <select
              value={delegateTo}
              onChange={(e) => setDelegateTo(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select approver</option>
              {availableApprovers.map((approver, index) => (
                <option key={index} value={approver}>{approver}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Select a user with appropriate approval authority</p>
          </div>

          {/* Delegation Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Reason for Delegation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Delegation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="E.g., On vacation, attending conference, focus on urgent project..."
            />
          </div>

          {/* Delegation Scope */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={delegateAll}
                onChange={(e) => setDelegateAll(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Delegate all pending approvals</span>
                <p className="text-xs text-gray-500">Transfer all your current and future approvals during this period</p>
              </div>
            </label>
          </div>

          {/* Notification Option */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyDelegate}
                onChange={(e) => setNotifyDelegate(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Notify delegate</span>
                <p className="text-xs text-gray-500">Send email notification about the delegation</p>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900">Delegation Notes</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>You can revoke delegation at any time</li>
                <li>Audit trail will show delegated approvals</li>
                <li>You remain accountable for delegated decisions</li>
                <li>Delegate must have same or higher authority level</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Delegate Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// To be continued in next message due to length...
