'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle, Clock, Crown, MessageSquare, Eye, AlertTriangle, TrendingUp, Shield } from 'lucide-react'

// Simplified type definitions - full types would be imported from page
export interface ExecutiveApproval {
  id: string
  type: string
  documentNumber: string
  customerName: string
  dealValue: number
  businessJustification: string
  strategicImportance: string
  keyHighlights: string[]
  risks: Risk[]
  financialImpact: FinancialImpact
  status: string
  [key: string]: any
}

interface Risk {
  category: string
  level: string
  description: string
  mitigation: string
}

interface FinancialImpact {
  revenue: number
  margin: number
  marginPercentage: number
  projectedLifetimeValue: number
  paybackPeriod: string
}

// Approve Executive Deal Modal
interface ApproveExecutiveDealModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: (data: { comments: string; conditions?: string }) => void
  approval: ExecutiveApproval | null
}

export function ApproveExecutiveDealModal({ isOpen, onClose, onApprove, approval }: ApproveExecutiveDealModalProps) {
  const [comments, setComments] = useState('')
  const [hasConditions, setHasConditions] = useState(false)
  const [conditions, setConditions] = useState('')

  const handleSubmit = () => {
    onApprove({ comments, conditions: hasConditions ? conditions : undefined })
    setComments('')
    setConditions('')
    setHasConditions(false)
    onClose()
  }

  if (!isOpen || !approval) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Approve Executive Deal</h2>
              <p className="text-sm text-purple-100">{approval.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Deal Overview */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 mb-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-sm text-purple-700 mb-1">Deal Value</p>
                <p className="text-2xl font-bold text-purple-900">₹{(approval.dealValue / 10000000).toFixed(2)}Cr</p>
              </div>
              <div>
                <p className="text-sm text-purple-700 mb-1">Lifetime Value</p>
                <p className="text-2xl font-bold text-purple-900">₹{(approval.financialImpact.projectedLifetimeValue / 10000000).toFixed(2)}Cr</p>
              </div>
              <div>
                <p className="text-sm text-purple-700 mb-1">Margin</p>
                <p className="text-2xl font-bold text-purple-900">{approval.financialImpact.marginPercentage}%</p>
              </div>
            </div>
          </div>

          {/* Business Justification */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Justification</label>
            <p className="text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded p-3">{approval.businessJustification}</p>
          </div>

          {/* Key Highlights */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Strategic Value</label>
            <ul className="space-y-2">
              {approval.keyHighlights.map((highlight, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Assessment */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Risk Assessment & Mitigation</label>
            <div className="space-y-2">
              {approval.risks.map((risk, idx) => (
                <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      risk.level === 'high' ? 'bg-red-100 text-red-700' :
                      risk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {risk.level.toUpperCase()} RISK
                    </span>
                    <span className="font-semibold text-gray-900">{risk.category}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{risk.description}</p>
                  <p className="text-sm text-gray-600 italic">🛡️ {risk.mitigation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Comments */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Executive Decision Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Provide strategic rationale, conditions, or directives for this approval..."
            />
          </div>

          {/* Conditions */}
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConditions}
                onChange={(e) => setHasConditions(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Add Executive Conditions</span>
            </label>
            {hasConditions && (
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                rows={3}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Specify mandatory conditions (e.g., board approval, legal review, partnership agreement terms)..."
              />
            )}
          </div>

          {/* Confirmation */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Crown className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-800">
                <p className="font-semibold mb-1">Executive Approval Confirmation</p>
                <p>This decision commits the organization to a ₹{(approval.dealValue / 10000000).toFixed(2)}Cr deal with strategic implications. Ensure all risk mitigation plans are in place.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!comments.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Crown className="h-4 w-4" />
            Approve Deal
          </button>
        </div>
      </div>
    </div>
  )
}

// Reject Executive Deal Modal
interface RejectExecutiveDealModalProps {
  isOpen: boolean
  onClose: () => void
  onReject: (data: { reason: string; comments: string }) => void
  approval: ExecutiveApproval | null
}

export function RejectExecutiveDealModal({ isOpen, onClose, onReject, approval }: RejectExecutiveDealModalProps) {
  const [reason, setReason] = useState('')
  const [comments, setComments] = useState('')

  const handleSubmit = () => {
    onReject({ reason, comments })
    setReason('')
    setComments('')
    onClose()
  }

  if (!isOpen || !approval) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reject Executive Deal</h2>
              <p className="text-sm text-red-100">{approval.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="bg-red-50 rounded-lg p-3 mb-3">
            <p className="font-semibold text-gray-900">{approval.customerName}</p>
            <p className="text-sm text-gray-600">Deal Value: ₹{(approval.dealValue / 10000000).toFixed(2)}Cr</p>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select reason</option>
              <option value="high-risk">Risk Level Too High</option>
              <option value="insufficient-margin">Insufficient Margin/ROI</option>
              <option value="strategic-misalignment">Strategic Misalignment</option>
              <option value="capacity-constraints">Capacity/Resource Constraints</option>
              <option value="market-conditions">Unfavorable Market Conditions</option>
              <option value="competitive-concerns">Competitive Concerns</option>
              <option value="financial-exposure">Excessive Financial Exposure</option>
              <option value="other">Other Strategic Reasons</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Executive Decision <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide detailed strategic rationale for rejection and alternative recommendations..."
            />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Executive Rejection</p>
                <p>This decision will stop the deal from proceeding. The sales team will be notified of the strategic decision.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason || !comments.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject Deal
          </button>
        </div>
      </div>
    </div>
  )
}

// Put on Hold Modal
interface PutOnHoldModalProps {
  isOpen: boolean
  onClose: () => void
  onHold: (data: { reason: string; reviewDate: string }) => void
  approval: ExecutiveApproval | null
}

export function PutOnHoldModal({ isOpen, onClose, onHold, approval }: PutOnHoldModalProps) {
  const [reason, setReason] = useState('')
  const [reviewDate, setReviewDate] = useState('')

  const handleSubmit = () => {
    onHold({ reason, reviewDate })
    setReason('')
    setReviewDate('')
    onClose()
  }

  if (!isOpen || !approval) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Put Deal on Hold</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Hold <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Explain why this deal needs to be put on hold..."
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || !reviewDate}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Put on Hold
          </button>
        </div>
      </div>
    </div>
  )
}

// View Full Details Modal
interface ViewExecutiveDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  approval: ExecutiveApproval | null
}

export function ViewExecutiveDetailsModal({ isOpen, onClose, approval }: ViewExecutiveDetailsModalProps) {
  if (!isOpen || !approval) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Executive Deal Details</h2>
              <p className="text-sm text-indigo-100">{approval.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Full details would be rendered here - simplified for space */}
          <div className="bg-indigo-50 rounded-lg p-3 mb-3">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">{approval.customerName}</h3>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <p className="text-sm text-indigo-700">Deal Value</p>
                <p className="text-xl font-bold text-indigo-900">₹{(approval.dealValue / 10000000).toFixed(2)}Cr</p>
              </div>
              <div>
                <p className="text-sm text-indigo-700">Lifetime Value</p>
                <p className="text-xl font-bold text-indigo-900">₹{(approval.financialImpact.projectedLifetimeValue / 10000000).toFixed(2)}Cr</p>
              </div>
              <div>
                <p className="text-sm text-indigo-700">Margin</p>
                <p className="text-xl font-bold text-indigo-900">{approval.financialImpact.marginPercentage}%</p>
              </div>
              <div>
                <p className="text-sm text-indigo-700">Payback</p>
                <p className="text-xl font-bold text-indigo-900">{approval.financialImpact.paybackPeriod}</p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-2">Business Justification</h3>
            <p className="text-sm text-gray-700">{approval.businessJustification}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Strategic Value</h3>
            <ul className="space-y-1">
              {approval.keyHighlights.map((highlight, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Add Executive Comment Modal
export function AddExecutiveCommentModal({ isOpen, onClose, onAddComment, approval }: any) {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    onAddComment(comment)
    setComment('')
    onClose()
  }

  if (!isOpen || !approval) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Add Executive Comment</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add executive guidance, strategic direction, or questions..."
            />
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Add Comment
          </button>
        </div>
      </div>
    </div>
  )
}
