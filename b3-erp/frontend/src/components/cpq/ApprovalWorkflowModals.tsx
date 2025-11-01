'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle, MessageSquare, Eye, Clock, User, TrendingUp, AlertCircle, FileText } from 'lucide-react'

export interface ApprovalRequest {
  id: string
  type: 'quote' | 'discount' | 'contract' | 'pricing' | 'proposal'
  documentNumber: string
  customerName: string
  value: number
  requestedBy: string
  requestDate: string
  currentApprover: string
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reason: string
  dueDate: string
  approvalChain: ApprovalStep[]
  slaStatus: 'on-time' | 'at-risk' | 'breached'
  timeRemaining: string
}

export interface ApprovalStep {
  level: number
  approver: string
  role: string
  status: 'pending' | 'approved' | 'rejected' | 'skipped'
  actionDate?: string
  comments?: string
  turnaroundTime?: string
}

// Approve Modal
interface ApproveModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: (data: { comments: string; conditions?: string }) => void
  request: ApprovalRequest | null
}

export function ApproveModal({ isOpen, onClose, onApprove, request }: ApproveModalProps) {
  const [comments, setComments] = useState('')
  const [hasConditions, setHasConditions] = useState(false)
  const [conditions, setConditions] = useState('')

  const handleSubmit = () => {
    onApprove({
      comments,
      conditions: hasConditions ? conditions : undefined
    })
    setComments('')
    setConditions('')
    setHasConditions(false)
    onClose()
  }

  if (!isOpen || !request) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Approve Request</h2>
              <p className="text-sm text-green-100">{request.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Request Summary */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{request.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Value</p>
                <p className="font-semibold text-gray-900">₹{(request.value / 100000).toFixed(2)}L</p>
              </div>
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-semibold text-gray-900">{request.type.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-600">Requested By</p>
                <p className="font-semibold text-gray-900">{request.requestedBy}</p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Approval Reason</label>
            <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">{request.reason}</p>
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Provide your approval comments and any recommendations..."
            />
          </div>

          {/* Conditional Approval */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConditions}
                onChange={(e) => setHasConditions(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Conditional Approval</span>
            </label>
            {hasConditions && (
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                rows={3}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Specify conditions that must be met..."
              />
            )}
          </div>

          {/* Confirmation */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Confirm Approval</p>
                <p>By approving this request, you confirm that you have reviewed all details and agree to proceed with the {request.type}.</p>
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
            disabled={!comments.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve Request
          </button>
        </div>
      </div>
    </div>
  )
}

// Reject Modal
interface RejectModalProps {
  isOpen: boolean
  onClose: () => void
  onReject: (data: { reason: string; comments: string }) => void
  request: ApprovalRequest | null
}

export function RejectModal({ isOpen, onClose, onReject, request }: RejectModalProps) {
  const [reason, setReason] = useState('')
  const [comments, setComments] = useState('')

  const handleSubmit = () => {
    onReject({ reason, comments })
    setReason('')
    setComments('')
    onClose()
  }

  if (!isOpen || !request) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reject Request</h2>
              <p className="text-sm text-red-100">{request.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Request Summary */}
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{request.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Value</p>
                <p className="font-semibold text-gray-900">₹{(request.value / 100000).toFixed(2)}L</p>
              </div>
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-semibold text-gray-900">{request.type.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-600">Requested By</p>
                <p className="font-semibold text-gray-900">{request.requestedBy}</p>
              </div>
            </div>
          </div>

          {/* Rejection Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select a reason</option>
              <option value="insufficient-margin">Insufficient Margin</option>
              <option value="high-risk-customer">High Risk Customer</option>
              <option value="credit-limit-exceeded">Credit Limit Exceeded</option>
              <option value="pricing-too-low">Pricing Too Low</option>
              <option value="payment-terms-unfavorable">Payment Terms Unfavorable</option>
              <option value="missing-information">Missing Information</option>
              <option value="policy-violation">Policy Violation</option>
              <option value="competitive-concerns">Competitive Concerns</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Detailed Comments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide detailed explanation for rejection and any recommendations for revisions..."
            />
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Confirm Rejection</p>
                <p>This request will be sent back to {request.requestedBy} with your feedback. They will need to revise and resubmit.</p>
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
            disabled={!reason || !comments.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject Request
          </button>
        </div>
      </div>
    </div>
  )
}

// Add Comment Modal
interface AddCommentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddComment: (comment: string) => void
  request: ApprovalRequest | null
}

export function AddCommentModal({ isOpen, onClose, onAddComment, request }: AddCommentModalProps) {
  const [comment, setComment] = useState('')
  const [isInternal, setIsInternal] = useState(true)

  const handleSubmit = () => {
    onAddComment(comment)
    setComment('')
    setIsInternal(true)
    onClose()
  }

  if (!isOpen || !request) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Comment</h2>
              <p className="text-sm text-blue-100">{request.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Request Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{request.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Value</p>
                <p className="font-semibold text-gray-900">₹{(request.value / 100000).toFixed(2)}L</p>
              </div>
            </div>
          </div>

          {/* Comment Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment Visibility</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isInternal}
                  onChange={() => setIsInternal(true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Internal Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isInternal}
                  onChange={() => setIsInternal(false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Visible to Requester</span>
              </label>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your comment, question, or feedback..."
            />
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
            disabled={!comment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Add Comment
          </button>
        </div>
      </div>
    </div>
  )
}

// View Document Modal
interface ViewDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  request: ApprovalRequest | null
}

export function ViewDocumentModal({ isOpen, onClose, request }: ViewDocumentModalProps) {
  if (!isOpen || !request) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Document Details</h2>
              <p className="text-sm text-indigo-100">{request.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Document Header */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-indigo-600 mb-1">Document Number</p>
                <p className="font-bold text-indigo-900">{request.documentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Type</p>
                <p className="font-bold text-indigo-900">{request.type.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Value</p>
                <p className="font-bold text-indigo-900">₹{(request.value / 100000).toFixed(2)}L</p>
              </div>
              <div>
                <p className="text-sm text-indigo-600 mb-1">Status</p>
                <p className="font-bold text-indigo-900">{request.status.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold text-gray-900">{request.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  request.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {request.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Requested By</p>
                  <p className="font-semibold text-gray-900">{request.requestedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Request Date</p>
                  <p className="font-semibold text-gray-900">{request.requestDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Approver</p>
                  <p className="font-semibold text-gray-900">{request.currentApprover}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-semibold text-gray-900">{request.dueDate}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <p className="text-sm text-gray-900">{request.reason}</p>
              </div>
            </div>
          </div>

          {/* Approval Chain */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Chain</h3>
            <div className="space-y-3">
              {request.approvalChain.map((step) => (
                <div key={step.level} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'approved' ? 'bg-green-100' :
                        step.status === 'rejected' ? 'bg-red-100' :
                        step.status === 'pending' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        {step.status === 'approved' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                         step.status === 'rejected' ? <XCircle className="h-5 w-5 text-red-600" /> :
                         step.status === 'pending' ? <Clock className="h-5 w-5 text-yellow-600" /> :
                         <AlertCircle className="h-5 w-5 text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Level {step.level}: {step.approver}</p>
                        <p className="text-sm text-gray-600">{step.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      step.status === 'approved' ? 'bg-green-100 text-green-700' :
                      step.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      step.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {step.status.toUpperCase()}
                    </span>
                  </div>
                  {step.actionDate && (
                    <div className="ml-11 text-sm">
                      <p className="text-gray-600">
                        {step.actionDate} • TAT: {step.turnaroundTime}
                      </p>
                      {step.comments && (
                        <p className="text-gray-700 mt-1 italic">&ldquo;{step.comments}&rdquo;</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SLA Status */}
          <div className={`rounded-lg p-4 ${
            request.slaStatus === 'on-time' ? 'bg-green-50 border border-green-200' :
            request.slaStatus === 'at-risk' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-5 w-5 ${
                request.slaStatus === 'on-time' ? 'text-green-600' :
                request.slaStatus === 'at-risk' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
              <div>
                <p className="font-semibold text-gray-900">SLA Status: {request.slaStatus.toUpperCase()}</p>
                <p className="text-sm text-gray-600">Time Remaining: {request.timeRemaining}</p>
              </div>
            </div>
          </div>
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
