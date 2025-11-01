'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle, Eye, User, MessageSquare, Clock, AlertCircle, ThumbsUp, ThumbsDown, FileText, Calendar, DollarSign } from 'lucide-react'

interface QuoteApproval {
  id: string
  quoteNumber: string
  customerName: string
  value: number
  discount: number
  requester: string
  approvers: {
    name: string
    role: string
    status: 'pending' | 'approved' | 'rejected'
    comments?: string
    date?: string
  }[]
  reason: string
  submittedDate: string
  status: 'pending' | 'approved' | 'rejected' | 'escalated'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface ViewApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  approval: QuoteApproval | null
  onApprove: (approval: QuoteApproval) => void
  onReject: (approval: QuoteApproval) => void
}

interface ApproveRejectModalProps {
  isOpen: boolean
  onClose: () => void
  approval: QuoteApproval | null
  action: 'approve' | 'reject'
  onSubmit: (comments: string, conditions?: string) => void
}

interface ApprovalHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  approval: QuoteApproval | null
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: any) => void
}

export function ViewApprovalModal({ isOpen, onClose, approval, onApprove, onReject }: ViewApprovalModalProps) {
  if (!isOpen || !approval) return null

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-blue-100 text-blue-700 border-blue-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      escalated: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[status] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      low: 'from-gray-600 to-gray-600',
      medium: 'from-yellow-600 to-yellow-600',
      high: 'from-orange-600 to-orange-600',
      urgent: 'from-red-600 to-red-600'
    }
    return colors[priority] || colors.medium
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r ${getPriorityColor(approval.priority)} text-white px-6 py-4 flex items-center justify-between rounded-t-lg`}>
          <div>
            <h2 className="text-xl font-bold">Approval Request Details</h2>
            <p className="text-sm opacity-90">{approval.quoteNumber} - {approval.customerName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 inline-flex text-sm font-semibold rounded-full border ${getStatusColor(approval.status)}`}>
              {approval.status}
            </span>
            <span className="px-3 py-1.5 text-sm font-semibold bg-purple-100 text-purple-700 rounded-full border border-purple-200">
              {approval.priority} priority
            </span>
            <span className="text-sm text-gray-600">
              Submitted: {new Date(approval.submittedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-semibold text-blue-900">Quote Value</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">₹{(approval.value / 100000).toFixed(2)}L</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <p className="text-sm font-semibold text-orange-900">Discount %</p>
              </div>
              <p className="text-2xl font-bold text-orange-900">{approval.discount}%</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-purple-600" />
                <p className="text-sm font-semibold text-purple-900">Requester</p>
              </div>
              <p className="text-lg font-bold text-purple-900">{approval.requester}</p>
            </div>
          </div>

          {/* Reason for Approval */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">Reason for Approval Request:</h3>
            <p className="text-sm text-yellow-800">{approval.reason}</p>
          </div>

          {/* Approval Chain */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Approval Chain:</h3>
            <div className="space-y-3">
              {approval.approvers.map((approver, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        approver.status === 'approved' ? 'bg-green-100' :
                        approver.status === 'rejected' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        <User className={`h-5 w-5 ${
                          approver.status === 'approved' ? 'text-green-600' :
                          approver.status === 'rejected' ? 'text-red-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{approver.name}</p>
                          <span className="text-xs text-gray-500">• {approver.role}</span>
                        </div>
                        {approver.comments && (
                          <div className="flex items-start gap-2 mt-2 bg-white rounded p-2">
                            <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{approver.comments}</p>
                          </div>
                        )}
                        {approver.date && (
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(approver.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {approver.status === 'approved' && (
                        <div className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="h-5 w-5" />
                          <span className="text-sm font-semibold">Approved</span>
                        </div>
                      )}
                      {approver.status === 'rejected' && (
                        <div className="flex items-center gap-1 text-red-600">
                          <ThumbsDown className="h-5 w-5" />
                          <span className="text-sm font-semibold">Rejected</span>
                        </div>
                      )}
                      {approver.status === 'pending' && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-5 w-5" />
                          <span className="text-sm font-semibold">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            {approval.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    onApprove(approval)
                    onClose()
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  Approve Request
                </button>
                <button
                  onClick={() => {
                    onReject(approval)
                    onClose()
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                  Reject Request
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ApproveRejectModal({ isOpen, onClose, approval, action, onSubmit }: ApproveRejectModalProps) {
  const [comments, setComments] = useState('')
  const [conditions, setConditions] = useState('')

  if (!isOpen || !approval) return null

  const handleSubmit = () => {
    if (!comments.trim()) {
      alert('Please provide comments for your decision')
      return
    }
    onSubmit(comments, action === 'approve' ? conditions : undefined)
    setComments('')
    setConditions('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className={`bg-gradient-to-r ${
          action === 'approve' ? 'from-green-600 to-green-600' : 'from-red-600 to-red-600'
        } text-white px-6 py-4 flex items-center justify-between rounded-t-lg`}>
          <div>
            <h2 className="text-xl font-bold">
              {action === 'approve' ? 'Approve' : 'Reject'} Approval Request
            </h2>
            <p className="text-sm opacity-90">{approval.quoteNumber} - {approval.customerName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quote Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Quote Value</p>
                <p className="font-bold text-gray-900">₹{(approval.value / 100000).toFixed(2)}L</p>
              </div>
              <div>
                <p className="text-gray-600">Discount</p>
                <p className="font-bold text-gray-900">{approval.discount}%</p>
              </div>
              <div>
                <p className="text-gray-600">Requested By</p>
                <p className="font-semibold text-gray-900">{approval.requester}</p>
              </div>
              <div>
                <p className="text-gray-600">Priority</p>
                <p className="font-semibold text-gray-900 capitalize">{approval.priority}</p>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Comments <span className="text-red-600">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={action === 'approve' ?
                'Provide approval comments and justification...' :
                'Explain why this request is being rejected...'
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Conditions (only for approve) */}
          {action === 'approve' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Conditions (Optional)
              </label>
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="Add any conditions for this approval (e.g., 50% advance payment required)..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Warning for reject */}
          {action === 'reject' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Important</p>
                  <p className="text-sm text-red-700 mt-1">
                    Rejecting this request will send it back to the requester for revision. Please provide clear guidance on what needs to change.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${
                action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ApprovalHistoryModal({ isOpen, onClose, approval }: ApprovalHistoryModalProps) {
  if (!isOpen || !approval) return null

  // Mock history data - in real app would come from API
  const history = [
    {
      date: approval.submittedDate,
      action: 'Submitted',
      user: approval.requester,
      details: `Submitted approval request for ${approval.discount}% discount`
    },
    ...approval.approvers
      .filter(a => a.date)
      .map(a => ({
        date: a.date!,
        action: a.status === 'approved' ? 'Approved' : 'Rejected',
        user: a.name,
        details: a.comments || `${a.status} by ${a.role}`
      }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Approval History</h2>
            <p className="text-sm opacity-90">{approval.quoteNumber} - {approval.customerName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline Items */}
            <div className="space-y-6">
              {history.map((item, idx) => (
                <div key={idx} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 w-16 h-16 rounded-full flex items-center justify-center ${
                    item.action === 'Approved' ? 'bg-green-100 border-4 border-green-500' :
                    item.action === 'Rejected' ? 'bg-red-100 border-4 border-red-500' :
                    'bg-blue-100 border-4 border-blue-500'
                  }`}>
                    {item.action === 'Approved' && <CheckCircle className="h-6 w-6 text-green-600" />}
                    {item.action === 'Rejected' && <XCircle className="h-6 w-6 text-red-600" />}
                    {item.action === 'Submitted' && <FileText className="h-6 w-6 text-blue-600" />}
                  </div>

                  {/* Content Card */}
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{item.action}</h3>
                        <p className="text-xs text-gray-600 mt-1">by {item.user}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [discountRange, setDiscountRange] = useState({ min: 0, max: 100 })
  const [valueRange, setValueRange] = useState({ min: 0, max: 100 })
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  if (!isOpen) return null

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
    )
  }

  const handleApply = () => {
    onApply({
      statuses: selectedStatuses,
      priorities: selectedPriorities,
      discountRange,
      valueRange,
      dateRange
    })
  }

  const handleReset = () => {
    setSelectedStatuses([])
    setSelectedPriorities([])
    setDiscountRange({ min: 0, max: 100 })
    setValueRange({ min: 0, max: 100 })
    setDateRange({ start: '', end: '' })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold">Filter Approvals</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['pending', 'approved', 'rejected', 'escalated'].map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedStatuses.includes(status)
                      ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Priority</label>
            <div className="grid grid-cols-2 gap-2">
              {['low', 'medium', 'high', 'urgent'].map(priority => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedPriorities.includes(priority)
                      ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Discount Range (%)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min %</label>
                <input
                  type="number"
                  value={discountRange.min}
                  onChange={(e) => setDiscountRange({ ...discountRange, min: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max %</label>
                <input
                  type="number"
                  value={discountRange.max}
                  onChange={(e) => setDiscountRange({ ...discountRange, max: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Value Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Quote Value Range (Lakhs)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min (L)</label>
                <input
                  type="number"
                  value={valueRange.min}
                  onChange={(e) => setValueRange({ ...valueRange, min: Number(e.target.value) })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max (L)</label>
                <input
                  type="number"
                  value={valueRange.max}
                  onChange={(e) => setValueRange({ ...valueRange, max: Number(e.target.value) })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
