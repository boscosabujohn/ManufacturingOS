'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle, MessageSquare, Eye, Percent, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react'

export interface DiscountRequest {
  id: string
  quoteNumber: string
  customerName: string
  customerType: 'new' | 'repeat' | 'vip' | 'strategic'
  industry: string
  originalValue: number
  discountPercentage: number
  discountAmount: number
  finalValue: number
  requestedBy: string
  requestDate: string
  reason: string
  justification: string
  currentApprover: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  productCategory: string
  quantity: number
  competitorPrice?: number
  marginAfterDiscount: number
  approvalChain: ApprovalStep[]
  comments: Comment[]
}

interface ApprovalStep {
  level: number
  approver: string
  role: string
  status: 'pending' | 'approved' | 'rejected'
  actionDate?: string
  comments?: string
}

interface Comment {
  id: string
  author: string
  message: string
  timestamp: string
}

// Approve Discount Modal
interface ApproveDiscountModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: (data: { comments: string; conditions?: string }) => void
  discount: DiscountRequest | null
}

export function ApproveDiscountModal({ isOpen, onClose, onApprove, discount }: ApproveDiscountModalProps) {
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

  if (!isOpen || !discount) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Approve Discount</h2>
              <p className="text-sm text-green-100">{discount.quoteNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Discount Summary */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 mb-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-sm text-green-700 mb-1">Original Value</p>
                <p className="text-xl font-bold text-green-900">₹{(discount.originalValue / 100000).toFixed(2)}L</p>
              </div>
              <div>
                <p className="text-sm text-red-700 mb-1">Discount</p>
                <p className="text-xl font-bold text-red-700">{discount.discountPercentage}%</p>
                <p className="text-xs text-red-600">₹{(discount.discountAmount / 100000).toFixed(2)}L</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 mb-1">Final Value</p>
                <p className="text-xl font-bold text-blue-900">₹{(discount.finalValue / 100000).toFixed(2)}L</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Margin After Discount</p>
                  <p className="text-lg font-bold text-green-900">{discount.marginAfterDiscount}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-700">Customer Type</p>
                  <span className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm font-semibold">
                    {discount.customerType.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Request Info */}
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{discount.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Quantity</p>
                <p className="font-semibold text-gray-900">{discount.quantity} units</p>
              </div>
              <div>
                <p className="text-gray-600">Product Category</p>
                <p className="font-semibold text-gray-900">{discount.productCategory}</p>
              </div>
              <div>
                <p className="text-gray-600">Requested By</p>
                <p className="font-semibold text-gray-900">{discount.requestedBy}</p>
              </div>
            </div>
          </div>

          {/* Justification */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Justification</label>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-gray-700"><strong>Reason:</strong> {discount.reason}</p>
              <p className="text-sm text-gray-700 mt-2">{discount.justification}</p>
            </div>
          </div>

          {/* Competitor Price */}
          {discount.competitorPrice && (
            <div className="mb-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <p className="font-semibold text-orange-900">Competitive Analysis</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-orange-700">Competitor Price</p>
                  <p className="font-bold text-orange-900">₹{(discount.competitorPrice / 100000).toFixed(2)}L</p>
                </div>
                <div>
                  <p className="text-orange-700">Price Difference</p>
                  <p className={`font-bold ${discount.competitorPrice > discount.finalValue ? 'text-green-700' : 'text-red-700'}`}>
                    {discount.competitorPrice > discount.finalValue ? '✓ Cheaper' : '✗ Costlier'} by ₹{(Math.abs(discount.competitorPrice - discount.finalValue) / 100000).toFixed(2)}L
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Approval Comments */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Provide your approval comments, margin analysis, or strategic justification..."
            />
          </div>

          {/* Conditional Approval */}
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConditions}
                onChange={(e) => setHasConditions(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Add Conditions (e.g., minimum order qty, payment terms)</span>
            </label>
            {hasConditions && (
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                rows={2}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Specify conditions for this discount approval..."
              />
            )}
          </div>

          {/* Margin Warning */}
          {discount.marginAfterDiscount < 20 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-1">Low Margin Warning</p>
                  <p>This discount reduces margin to {discount.marginAfterDiscount}%, which is below the 20% minimum threshold. Ensure strategic justification is documented.</p>
                </div>
              </div>
            </div>
          )}
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
            disabled={!comments.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve Discount
          </button>
        </div>
      </div>
    </div>
  )
}

// Reject Discount Modal
interface RejectDiscountModalProps {
  isOpen: boolean
  onClose: () => void
  onReject: (data: { reason: string; comments: string }) => void
  discount: DiscountRequest | null
}

export function RejectDiscountModal({ isOpen, onClose, onReject, discount }: RejectDiscountModalProps) {
  const [reason, setReason] = useState('')
  const [comments, setComments] = useState('')

  const handleSubmit = () => {
    onReject({ reason, comments })
    setReason('')
    setComments('')
    onClose()
  }

  if (!isOpen || !discount) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reject Discount</h2>
              <p className="text-sm text-red-100">{discount.quoteNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Discount Summary */}
          <div className="bg-red-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{discount.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Discount Requested</p>
                <p className="font-semibold text-red-700">{discount.discountPercentage}%</p>
              </div>
              <div>
                <p className="text-gray-600">Margin After</p>
                <p className="font-semibold text-gray-900">{discount.marginAfterDiscount}%</p>
              </div>
            </div>
          </div>

          {/* Rejection Reason */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select a reason</option>
              <option value="margin-too-low">Margin Too Low (Below Minimum Threshold)</option>
              <option value="customer-credit-risk">Customer Credit Risk</option>
              <option value="no-strategic-value">No Strategic Value / One-time Deal</option>
              <option value="discount-not-justified">Discount Not Adequately Justified</option>
              <option value="competitor-price-unverified">Competitor Price Not Verified</option>
              <option value="payment-terms-unfavorable">Payment Terms Unfavorable</option>
              <option value="exceeds-approval-limit">Exceeds Approval Authority Limit</option>
              <option value="alternative-available">Alternative Solution Available</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Detailed Comments */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide detailed explanation for rejection and recommendations (e.g., acceptable discount percentage, required conditions, alternative options)..."
            />
          </div>

          {/* Alternative Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-sm font-semibold text-blue-900 mb-2">Suggested Alternatives:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Reduce discount to maintain minimum {((discount.originalValue * 0.20) / 100000).toFixed(2)}L margin</li>
              <li>• Request 50% advance payment for discount approval</li>
              <li>• Add volume commitment for future orders</li>
              <li>• Consider value-add services instead of price reduction</li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Confirm Rejection</p>
                <p>This discount request will be rejected and sent back to {discount.requestedBy}. The sales team will need to revise the discount or proceed with original pricing.</p>
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
            disabled={!reason || !comments.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject Discount
          </button>
        </div>
      </div>
    </div>
  )
}

// Add Comment Modal (reusing with discount context)
interface AddDiscountCommentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddComment: (comment: string) => void
  discount: DiscountRequest | null
}

export function AddDiscountCommentModal({ isOpen, onClose, onAddComment, discount }: AddDiscountCommentModalProps) {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    onAddComment(comment)
    setComment('')
    onClose()
  }

  if (!isOpen || !discount) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Comment</h2>
              <p className="text-sm text-blue-100">{discount.quoteNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Discount Info */}
          <div className="bg-purple-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{discount.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Discount</p>
                <p className="font-semibold text-purple-700">{discount.discountPercentage}%</p>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add your comment, question, or request for clarification..."
            />
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

// View Quote Modal
interface ViewQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  discount: DiscountRequest | null
}

export function ViewQuoteModal({ isOpen, onClose, discount }: ViewQuoteModalProps) {
  if (!isOpen || !discount) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quote Details</h2>
              <p className="text-sm text-purple-100">{discount.quoteNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Quote Header */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <p className="text-sm text-purple-600 mb-1">Quote Number</p>
                <p className="font-bold text-purple-900">{discount.quoteNumber}</p>
              </div>
              <div>
                <p className="text-sm text-purple-600 mb-1">Customer Type</p>
                <span className="px-2 py-1 bg-purple-200 text-purple-900 rounded-full text-xs font-semibold">
                  {discount.customerType.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-purple-600 mb-1">Priority</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  discount.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  discount.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {discount.priority.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-purple-600 mb-1">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  discount.status === 'approved' ? 'bg-green-100 text-green-700' :
                  discount.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {discount.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Customer Name</p>
                <p className="font-semibold text-gray-900">{discount.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Industry</p>
                <p className="font-semibold text-gray-900">{discount.industry}</p>
              </div>
              <div>
                <p className="text-gray-600">Product Category</p>
                <p className="font-semibold text-gray-900">{discount.productCategory}</p>
              </div>
              <div>
                <p className="text-gray-600">Quantity</p>
                <p className="font-semibold text-gray-900">{discount.quantity} units</p>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing Details</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-600 mb-1">Original Value</p>
                <p className="text-2xl font-bold text-blue-900">₹{(discount.originalValue / 100000).toFixed(2)}L</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-sm text-red-600 mb-1">Discount</p>
                <p className="text-2xl font-bold text-red-700">{discount.discountPercentage}%</p>
                <p className="text-sm text-red-600 mt-1">₹{(discount.discountAmount / 100000).toFixed(2)}L</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-600 mb-1">Final Value</p>
                <p className="text-2xl font-bold text-green-900">₹{(discount.finalValue / 100000).toFixed(2)}L</p>
                <p className="text-sm text-green-600 mt-1">Margin: {discount.marginAfterDiscount}%</p>
              </div>
            </div>
          </div>

          {/* Justification */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discount Justification</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-900 mb-2">Reason: {discount.reason}</p>
              <p className="text-sm text-gray-700">{discount.justification}</p>
            </div>
          </div>

          {/* Approval Chain */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Approval Chain</h3>
            <div className="space-y-2">
              {discount.approvalChain.map((step) => (
                <div key={step.level} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Level {step.level}: {step.approver}</p>
                      <p className="text-sm text-gray-600">{step.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      step.status === 'approved' ? 'bg-green-100 text-green-700' :
                      step.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {step.status.toUpperCase()}
                    </span>
                  </div>
                  {step.comments && (
                    <p className="text-sm text-gray-600 mt-2 italic">&ldquo;{step.comments}&rdquo;</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comments Thread */}
          {discount.comments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discussion</h3>
              <div className="space-y-2">
                {discount.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">{comment.author}</p>
                      <p className="text-xs text-gray-500">{comment.timestamp}</p>
                    </div>
                    <p className="text-sm text-gray-700">{comment.message}</p>
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
