'use client'

import { useState } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Scale, MessageSquare, Eye, FileText } from 'lucide-react'

// Simplified type definitions
export interface LegalReview {
  id: string
  documentType: string
  documentNumber: string
  customerName: string
  contractValue: number
  reviewType: string
  priority: string
  status: string
  riskLevel: string
  customClauses: string[]
  issues: LegalIssue[]
  complianceChecks: ComplianceCheck[]
  [key: string]: any
}

interface LegalIssue {
  id: string
  severity: string
  category: string
  description: string
  recommendation: string
  status: string
}

interface ComplianceCheck {
  name: string
  status: string
  details: string
}

// Approve Legal Review Modal
interface ApproveLegalModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: (data: { comments: string; conditions?: string }) => void
  review: LegalReview | null
}

export function ApproveLegalModal({ isOpen, onClose, onApprove, review }: ApproveLegalModalProps) {
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

  if (!isOpen || !review) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Approve Legal Review</h2>
              <p className="text-sm text-green-100">{review.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Document Summary */}
          <div className="bg-green-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Document Type</p>
                <p className="font-semibold text-gray-900">{review.documentType.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{review.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Risk Level</p>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  review.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                  review.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                  review.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {review.riskLevel.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-gray-600">Contract Value</p>
                <p className="font-semibold text-gray-900">₹{(review.contractValue / 100000).toFixed(2)}L</p>
              </div>
            </div>
          </div>

          {/* Custom Clauses */}
          {review.customClauses && review.customClauses.length > 0 && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Clauses Reviewed</label>
              <ul className="space-y-1 bg-yellow-50 border border-yellow-200 rounded p-3">
                {review.customClauses.map((clause, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    {clause}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resolved Issues */}
          {review.issues && review.issues.filter((i: LegalIssue) => i.status === 'resolved').length > 0 && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Issues Resolved</label>
              <div className="space-y-2">
                {review.issues.filter((i: LegalIssue) => i.status === 'resolved').map((issue: LegalIssue) => (
                  <div key={issue.id} className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-gray-900">{issue.category}</span>
                    </div>
                    <p className="text-gray-700 ml-6">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Status */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Checks</label>
            <div className="grid grid-cols-2 gap-2">
              {review.complianceChecks && review.complianceChecks.map((check: ComplianceCheck, idx: number) => (
                <div key={idx} className={`flex items-center gap-2 p-2 rounded text-sm ${
                  check.status === 'passed' ? 'bg-green-50' :
                  check.status === 'failed' ? 'bg-red-50' :
                  'bg-yellow-50'
                }`}>
                  {check.status === 'passed' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                   check.status === 'failed' ? <XCircle className="h-4 w-4 text-red-600" /> :
                   <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  <span className="font-medium text-gray-900">{check.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Opinion */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Legal Opinion <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Provide legal opinion, compliance confirmation, and any recommendations..."
            />
          </div>

          {/* Conditions */}
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConditions}
                onChange={(e) => setHasConditions(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Conditional Approval (Legal Requirements)</span>
            </label>
            {hasConditions && (
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                rows={3}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Specify mandatory legal conditions (e.g., indemnity clause, jurisdiction changes, insurance requirements)..."
              />
            )}
          </div>

          {/* Risk Acknowledgment */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Scale className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Legal Approval</p>
                <p>All legal issues have been addressed and document is compliant with applicable laws and company policies.</p>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve Document
          </button>
        </div>
      </div>
    </div>
  )
}

// Reject Legal Review Modal
interface RejectLegalModalProps {
  isOpen: boolean
  onClose: () => void
  onReject: (data: { reason: string; comments: string }) => void
  review: LegalReview | null
}

export function RejectLegalModal({ isOpen, onClose, onReject, review }: RejectLegalModalProps) {
  const [reason, setReason] = useState('')
  const [comments, setComments] = useState('')

  const handleSubmit = () => {
    onReject({ reason, comments })
    setReason('')
    setComments('')
    onClose()
  }

  if (!isOpen || !review) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reject Legal Review</h2>
              <p className="text-sm text-red-100">{review.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="bg-red-50 rounded-lg p-3 mb-3">
            <p className="font-semibold text-gray-900">{review.customerName}</p>
            <p className="text-sm text-gray-600">{review.documentType.toUpperCase()} • Risk: {review.riskLevel.toUpperCase()}</p>
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
              <option value="liability-excessive">Liability Exposure Too High</option>
              <option value="ip-rights-unclear">IP Rights Unclear/Unfavorable</option>
              <option value="jurisdiction-unfavorable">Jurisdiction/Dispute Resolution Unfavorable</option>
              <option value="compliance-issues">Compliance Issues Not Resolved</option>
              <option value="missing-clauses">Critical Clauses Missing</option>
              <option value="indemnity-unacceptable">Indemnity Terms Unacceptable</option>
              <option value="payment-terms-risky">Payment Terms Create Legal Risk</option>
              <option value="regulatory-concerns">Regulatory/Licensing Concerns</option>
              <option value="other">Other Legal Issues</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Legal Analysis <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide detailed legal analysis, specific issues, and required changes for approval..."
            />
          </div>

          {/* Critical Issues */}
          {review.issues && review.issues.filter((i: LegalIssue) => i.status === 'open' && i.severity === 'critical').length > 0 && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded p-3">
              <p className="font-semibold text-red-900 mb-2">Critical Issues to Address:</p>
              <ul className="space-y-1">
                {review.issues.filter((i: LegalIssue) => i.status === 'open' && i.severity === 'critical').map((issue: LegalIssue) => (
                  <li key={issue.id} className="text-sm text-red-800">• {issue.category}: {issue.description}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Legal Rejection</p>
                <p>Document will be returned for revisions. All legal issues must be addressed before re-submission.</p>
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
            Reject Document
          </button>
        </div>
      </div>
    </div>
  )
}

// Request Revision Modal
interface RequestRevisionModalProps {
  isOpen: boolean
  onClose: () => void
  onRequestRevision: (data: { changes: string[] }) => void
  review: LegalReview | null
}

export function RequestRevisionModal({ isOpen, onClose, onRequestRevision, review }: RequestRevisionModalProps) {
  const [changes, setChanges] = useState<string[]>([''])

  const addChange = () => {
    setChanges([...changes, ''])
  }

  const updateChange = (index: number, value: string) => {
    const newChanges = [...changes]
    newChanges[index] = value
    setChanges(newChanges)
  }

  const handleSubmit = () => {
    onRequestRevision({ changes: changes.filter(c => c.trim()) })
    setChanges([''])
    onClose()
  }

  if (!isOpen || !review) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Request Revision</h2>
              <p className="text-sm text-orange-100">{review.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <p className="text-sm text-gray-600 mb-2">List all specific changes required for legal approval:</p>

          <div className="space-y-3">
            {changes.map((change, index) => (
              <div key={index}>
                <textarea
                  value={change}
                  onChange={(e) => updateChange(index, e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={`Required change #${index + 1}...`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={addChange}
            className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            + Add Another Change
          </button>
        </div>

        <div className="bg-gray-50 px-3 py-2 flex justify-end gap-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!changes.some(c => c.trim())}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Request Revision
          </button>
        </div>
      </div>
    </div>
  )
}

// View Document Modal
export function ViewLegalDocumentModal({ isOpen, onClose, review }: any) {
  if (!isOpen || !review) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Legal Document Review</h2>
              <p className="text-sm text-indigo-100">{review.documentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Document preview would go here */}
          <div className="bg-indigo-50 rounded-lg p-3">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">{review.customerName}</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-indigo-700">Document Type</p>
                <p className="font-bold text-indigo-900">{review.documentType.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-indigo-700">Risk Level</p>
                <p className="font-bold text-indigo-900">{review.riskLevel.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-indigo-700">Review Type</p>
                <p className="font-bold text-indigo-900">{review.reviewType}</p>
              </div>
            </div>
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

// Add Legal Comment Modal
export function AddLegalCommentModal({ isOpen, onClose, onAddComment, review }: any) {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    onAddComment(comment)
    setComment('')
    onClose()
  }

  if (!isOpen || !review) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Add Legal Comment</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add legal comment, observation, or clarification request..."
          />
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
