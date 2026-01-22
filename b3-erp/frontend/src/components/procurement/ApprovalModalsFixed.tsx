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
  onApprove?: (data: any) => void
  onReject?: (data: any) => void
  onDelegate?: (data: any) => void
  onReturn?: (data: any) => void
  request?: ApprovalData
}

interface BulkActionsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onComplete: () => void
}

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

// ==================== APPROVE MODAL ====================

export function ApproveModal({ isOpen, onClose, request, onApprove }: ApprovalModalProps) {
  const [comments, setComments] = useState('')
  const [notifyNext, setNotifyNext] = useState(true)
  const [addConditions, setAddConditions] = useState(false)
  const [conditions, setConditions] = useState('')
  const [attachFiles, setAttachFiles] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApprove?.({
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
              <p className="text-green-100 text-sm">{request?.documentNumber} - {request?.title}</p>
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
                <p className="font-medium text-gray-900">{request?.documentNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Requested By:</span>
                <p className="font-medium text-gray-900">{request?.requestedBy}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <p className="font-medium text-gray-900">{request?.currency} {request?.amount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <p className="font-medium text-gray-900">{request?.department}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Justification:</span>
                <p className="font-medium text-gray-900">{request?.justification}</p>
              </div>
            </div>
          </div>

          {/* Approval Level Progress */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Approval Progress</span>
              <span className="text-sm text-blue-700">Level {request?.approvalLevel} of {request?.totalLevels}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${((request?.approvalLevel || 1) / (request?.totalLevels || 1)) * 100}%` }}
              />
            </div>
            {request?.nextApprovers && request.nextApprovers.length > 0 && (
              <p className="text-sm text-blue-700 mt-2">
                Next Approver: <span className="font-medium">{request.nextApprovers.join(', ')}</span>
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
                Approving this request will {request?.approvalLevel === request?.totalLevels ?
                  'finalize the approval process and allow execution' :
                  `move it to Level ${(request?.approvalLevel || 0) + 1} (${request?.nextApprovers?.[0]})`}
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

export function RejectModal({ isOpen, onClose, request, onReject }: ApprovalModalProps) {
  const [reason, setReason] = useState('')
  const [category, setCategory] = useState('')
  const [notifyRequester, setNotifyRequester] = useState(true)
  const [allowResubmission, setAllowResubmission] = useState(true)
  const [suggestions, setSuggestions] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onReject?.({
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
              <p className="text-red-100 text-sm">{request?.documentNumber} - {request?.title}</p>
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
                <p className="font-medium text-gray-900">{request?.documentNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Requested By:</span>
                <p className="font-medium text-gray-900">{request?.requestedBy}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <p className="font-medium text-gray-900">{request?.currency} {request?.amount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <p className="font-medium text-gray-900">{request?.department}</p>
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

export function DelegateModalFixed({ isOpen, onClose, request, onDelegate }: ApprovalModalProps) {
  const [delegateTo, setDelegateTo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [delegateAll, setDelegateAll] = useState(false)
  const [notifyDelegate, setNotifyDelegate] = useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDelegate?.({
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
          {request?.documentNumber && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-900 mb-2">Delegating Approval For:</h3>
              <p className="text-sm text-purple-800">{request.documentNumber} - {request.title}</p>
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

// ==================== RETURN MODAL ====================

export function ReturnModalFixed({ isOpen, onClose, request, onReturn }: ApprovalModalProps) {
  const [reason, setReason] = useState('')
  const [questions, setQuestions] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onReturn?.({
      action: 'returned',
      reason,
      questions,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Return for Clarification</h2>
              <p className="text-yellow-100 text-sm">{request?.documentNumber} - {request?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Returning a request allows the requester to provide additional information without rejecting the entire request. The workflow will pause until clarification is provided.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Return <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              placeholder="Why are you returning this request?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific Questions/Clarifications Needed <span className="text-red-500">*</span>
            </label>
            <textarea
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              placeholder="List specific questions or data points needed..."
            />
          </div>

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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Return Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== VIEW HISTORY MODAL ====================

export function ViewHistoryModal({ isOpen, onClose, request }: ApprovalModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Approval History</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">{request?.title}</h3>
            <p className="text-sm text-gray-500">{request?.documentNumber}</p>
          </div>

          <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
            {request?.approvalHistory && request.approvalHistory.map((history, index) => (
              <div key={index} className="relative">
                <div className={`absolute -left-[33px] p-2 rounded-full border-2 ${history.action === 'approved' ? 'bg-green-100 border-green-500 text-green-600' :
                  history.action === 'rejected' ? 'bg-red-100 border-red-500 text-red-600' :
                    'bg-yellow-100 border-yellow-500 text-yellow-600'
                  }`}>
                  {history.action === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                    history.action === 'rejected' ? <XCircle className="w-4 h-4" /> :
                      <RotateCcw className="w-4 h-4" />}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{history.approver}</span>
                      <span className="text-gray-500 text-sm ml-2">Level {history.level}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {history.date}
                    </span>
                  </div>
                  <div className={`text-sm font-medium mb-1 ${history.action === 'approved' ? 'text-green-700' :
                    history.action === 'rejected' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                    {history.action.charAt(0).toUpperCase() + history.action.slice(1)}
                  </div>
                  {history.comments && (
                    <p className="text-sm text-gray-600 mt-2 bg-white p-2 rounded border border-gray-200 italic">
                      "{history.comments}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== VIEW DETAILS MODAL ====================

export function ViewDetailsModal({ isOpen, onClose, request }: ApprovalModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
            <p className="text-sm text-gray-500">{request?.documentNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{request?.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {request?.requestedDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {request?.requestedBy}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">{request?.currency} {request?.amount?.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  General Information
                </h3>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">Department</td>
                        <td className="px-4 py-3">{request?.department}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Document Type</td>
                        <td className="px-4 py-3 capitalize">{request?.documentType?.replace('_', ' ')}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Priority</td>
                        <td className="px-4 py-3 capitalize">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${request?.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            request?.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {request?.priority}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50">Due Date</td>
                        <td className="px-4 py-3">{request?.dueDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Justification
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 leading-relaxed">
                  {request?.justification}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  Vendor Information
                </h3>
                <div className="bg-white border rounded-lg p-4">
                  {request?.vendor ? (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {request.vendor.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{request.vendor}</p>
                          <p className="text-sm text-gray-500">Vendor ID: V-2024-001</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t">
                        <div>
                          <p className="text-gray-500 mb-1">Status</p>
                          <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">Preferred</span>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Contract</p>
                          <p className="font-medium">MSA-2023-089</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No vendor associated with this request.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  Line Items (Summary)
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-2">Item</th>
                        <th className="px-4 py-2 text-right">Qty</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2">Industrial Components</td>
                        <td className="px-4 py-2 text-right">500</td>
                        <td className="px-4 py-2 text-right">$45,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Shipping</td>
                        <td className="px-4 py-2 text-right">1</td>
                        <td className="px-4 py-2 text-right">$5,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== BULK ACTIONS MODAL ====================

export function BulkActionsModal({ isOpen, onClose, selectedCount, onComplete }: BulkActionsModalProps) {
  const [action, setAction] = useState<'approve' | 'reject'>('approve')
  const [comments, setComments] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleExecute = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Bulk Actions
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="font-medium text-purple-900">
              You defined {selectedCount} items for bulk action.
            </p>
            <p className="text-sm text-purple-700 mt-1">
              All selected items receive the same action and comments.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <div className="flex gap-4">
              <label className={`flex-1 p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-center gap-2 ${action === 'approve' ? 'bg-green-50 border-green-500 text-green-700' : 'hover:bg-gray-50'
                }`}>
                <input
                  type="radio"
                  name="action"
                  value="approve"
                  checked={action === 'approve'}
                  onChange={() => setAction('approve')}
                  className="hidden"
                />
                <ThumbsUp className="w-4 h-4" />
                Approve All
              </label>
              <label className={`flex-1 p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-center gap-2 ${action === 'reject' ? 'bg-red-50 border-red-500 text-red-700' : 'hover:bg-gray-50'
                }`}>
                <input
                  type="radio"
                  name="action"
                  value="reject"
                  checked={action === 'reject'}
                  onChange={() => setAction('reject')}
                  className="hidden"
                />
                <ThumbsDown className="w-4 h-4" />
                Reject All
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Enter bulk action comments..."
              required
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={isProcessing || !comments}
            className={`px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 ${isProcessing ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span>Execute Bulk Action</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== EXPORT MODAL ====================

export function ExportApprovalsModal({ isOpen, onClose }: ExportModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Export Data
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm">
            Select the format to export your approval history and current requests.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 group transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded text-red-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700">PDF Report</p>
                  <p className="text-xs text-gray-500">Best for printing and formal records</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </button>

            <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 group transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded text-green-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700">Excel / CSV</p>
                  <p className="text-xs text-gray-500">Best for analysis and data manipulation</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
