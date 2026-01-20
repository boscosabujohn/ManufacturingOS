'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Clock,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  MessageSquare,
  TrendingUp,
  FileText,
  DollarSign,
  Zap,
  Eye
} from 'lucide-react'
import {
  ApproveModal,
  RejectModal,
  AddCommentModal,
  ViewDocumentModal,
  ApprovalRequest,
  ApprovalStep
} from '@/components/cpq/ApprovalWorkflowModals'

export default function CPQWorkflowApprovalsPage() {
  const router = useRouter()

  // Modal states
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)

  const [approvals] = useState<ApprovalRequest[]>([
    {
      id: 'WF-001',
      type: 'quote',
      documentNumber: 'QT-2024-1234',
      customerName: 'Prestige Properties Ltd',
      value: 4500000,
      requestedBy: 'Rahul Kumar',
      requestDate: '2024-10-18 10:30 AM',
      currentApprover: 'Sales Manager',
      status: 'pending',
      priority: 'high',
      reason: 'High value quote requires approval',
      dueDate: '2024-10-20 05:00 PM',
      slaStatus: 'on-time',
      timeRemaining: '1d 6h',
      approvalChain: [
        {
          level: 1,
          approver: 'Priya Sharma',
          role: 'Sales Manager',
          status: 'pending'
        },
        {
          level: 2,
          approver: 'Sunita Reddy',
          role: 'VP Sales',
          status: 'pending'
        }
      ]
    },
    {
      id: 'WF-002',
      type: 'discount',
      documentNumber: 'DISC-2024-567',
      customerName: 'Urban Homes Pvt Ltd',
      value: 2850000,
      requestedBy: 'Neha Singh',
      requestDate: '2024-10-18 09:15 AM',
      currentApprover: 'Finance Head',
      status: 'pending',
      priority: 'urgent',
      reason: '18% discount exceeds approval limit',
      dueDate: '2024-10-19 12:00 PM',
      slaStatus: 'at-risk',
      timeRemaining: '4h',
      approvalChain: [
        {
          level: 1,
          approver: 'Priya Sharma',
          role: 'Sales Manager',
          status: 'approved',
          actionDate: '2024-10-18 10:20 AM',
          comments: 'Customer is repeat buyer, discount justified',
          turnaroundTime: '1h 5m'
        },
        {
          level: 2,
          approver: 'Amit Patel',
          role: 'Finance Head',
          status: 'pending'
        },
        {
          level: 3,
          approver: 'Sunita Reddy',
          role: 'VP Sales',
          status: 'pending'
        }
      ]
    },
    {
      id: 'WF-003',
      type: 'contract',
      documentNumber: 'CONT-2024-890',
      customerName: 'Metro Builders Ltd',
      value: 8200000,
      requestedBy: 'Vikram Desai',
      requestDate: '2024-10-17 02:15 PM',
      currentApprover: 'Legal Department',
      status: 'escalated',
      priority: 'urgent',
      reason: 'Custom clauses added, legal review required',
      dueDate: '2024-10-19 10:00 AM',
      slaStatus: 'breached',
      timeRemaining: 'Overdue by 2h',
      approvalChain: [
        {
          level: 1,
          approver: 'Priya Sharma',
          role: 'Sales Manager',
          status: 'approved',
          actionDate: '2024-10-17 03:00 PM',
          comments: 'High value deal, strategic customer',
          turnaroundTime: '45m'
        },
        {
          level: 2,
          approver: 'Amit Patel',
          role: 'Finance Head',
          status: 'approved',
          actionDate: '2024-10-17 04:30 PM',
          comments: 'Payment terms acceptable',
          turnaroundTime: '1h 30m'
        },
        {
          level: 3,
          approver: 'Rajesh Khanna',
          role: 'Legal Department',
          status: 'pending'
        }
      ]
    },
    {
      id: 'WF-004',
      type: 'pricing',
      documentNumber: 'PRICE-2024-445',
      customerName: 'Royal Residences',
      value: 3200000,
      requestedBy: 'Anjali Mehta',
      requestDate: '2024-10-16 11:20 AM',
      currentApprover: 'None',
      status: 'approved',
      priority: 'medium',
      reason: 'Special pricing for bulk order',
      dueDate: '2024-10-18 05:00 PM',
      slaStatus: 'on-time',
      timeRemaining: 'Completed',
      approvalChain: [
        {
          level: 1,
          approver: 'Priya Sharma',
          role: 'Sales Manager',
          status: 'approved',
          actionDate: '2024-10-16 02:45 PM',
          comments: 'Approved for 50+ unit order',
          turnaroundTime: '3h 25m'
        },
        {
          level: 2,
          approver: 'Amit Patel',
          role: 'Finance Head',
          status: 'approved',
          actionDate: '2024-10-16 04:15 PM',
          comments: 'Pricing maintains required margins',
          turnaroundTime: '1h 30m'
        }
      ]
    },
    {
      id: 'WF-005',
      type: 'proposal',
      documentNumber: 'PROP-2024-778',
      customerName: 'Green Valley Apartments',
      value: 5600000,
      requestedBy: 'Karan Malhotra',
      requestDate: '2024-10-15 03:30 PM',
      currentApprover: 'None',
      status: 'rejected',
      priority: 'high',
      reason: 'Terms and conditions require review',
      dueDate: '2024-10-17 05:00 PM',
      slaStatus: 'on-time',
      timeRemaining: 'Rejected',
      approvalChain: [
        {
          level: 1,
          approver: 'Priya Sharma',
          role: 'Sales Manager',
          status: 'rejected',
          actionDate: '2024-10-15 05:15 PM',
          comments: 'Payment terms too risky. Customer credit history weak.',
          turnaroundTime: '1h 45m'
        }
      ]
    },
    {
      id: 'WF-006',
      type: 'quote',
      documentNumber: 'QT-2024-1189',
      customerName: 'Silver Oak Residency',
      value: 1850000,
      requestedBy: 'Pooja Deshmukh',
      requestDate: '2024-10-18 01:45 PM',
      currentApprover: 'Sales Manager',
      status: 'pending',
      priority: 'low',
      reason: 'Standard quote approval',
      dueDate: '2024-10-21 05:00 PM',
      slaStatus: 'on-time',
      timeRemaining: '3d 2h',
      approvalChain: [
        {
          level: 1,
          approver: 'Priya Sharma',
          role: 'Sales Manager',
          status: 'pending'
        }
      ]
    },
    {
      id: 'WF-007',
      type: 'discount',
      documentNumber: 'DISC-2024-589',
      customerName: 'Coastal Builders',
      value: 6400000,
      requestedBy: 'Suresh Rao',
      requestDate: '2024-10-17 10:00 AM',
      currentApprover: 'VP Sales',
      status: 'pending',
      priority: 'high',
      reason: '22% discount for project deal',
      dueDate: '2024-10-19 05:00 PM',
      slaStatus: 'on-time',
      timeRemaining: '1d 4h',
      approvalChain: [
        {
          level: 1,
          approver: 'Priya Sharma',
          role: 'Sales Manager',
          status: 'approved',
          actionDate: '2024-10-17 11:30 AM',
          comments: 'Large project with repeat customer',
          turnaroundTime: '1h 30m'
        },
        {
          level: 2,
          approver: 'Amit Patel',
          role: 'Finance Head',
          status: 'approved',
          actionDate: '2024-10-17 02:45 PM',
          comments: 'Margins acceptable for project size',
          turnaroundTime: '3h 15m'
        },
        {
          level: 3,
          approver: 'Sunita Reddy',
          role: 'VP Sales',
          status: 'pending'
        }
      ]
    }
  ])

  const getTypeColor = (type: string) => {
    const colors: any = {
      quote: 'bg-blue-100 text-blue-700 border-blue-200',
      discount: 'bg-purple-100 text-purple-700 border-purple-200',
      contract: 'bg-green-100 text-green-700 border-green-200',
      pricing: 'bg-orange-100 text-orange-700 border-orange-200',
      proposal: 'bg-pink-100 text-pink-700 border-pink-200'
    }
    return colors[type] || colors.quote
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      escalated: 'bg-orange-100 text-orange-700 border-orange-200',
      expired: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[status] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      low: 'bg-blue-100 text-blue-700 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      urgent: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[priority] || colors.medium
  }

  const getSLAColor = (slaStatus: string) => {
    const colors: any = {
      'on-time': 'bg-green-100 text-green-700 border-green-200',
      'at-risk': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'breached': 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[slaStatus] || colors['on-time']
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'skipped':
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  // Modal handlers
  const handleApprove = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setIsApproveOpen(true)
  }

  const handleReject = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setIsRejectOpen(true)
  }

  const handleAddComment = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setIsCommentOpen(true)
  }

  const handleView = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setIsViewOpen(true)
  }

  const handleApproveSubmit = (data: { comments: string; conditions?: string }) => {
    console.log('Approved:', selectedRequest?.documentNumber, data)
    // TODO: API call to approve the request
    setIsApproveOpen(false)
  }

  const handleRejectSubmit = (data: { reason: string; comments: string }) => {
    console.log('Rejected:', selectedRequest?.documentNumber, data)
    // TODO: API call to reject the request
    setIsRejectOpen(false)
  }

  const handleCommentSubmit = (comment: string) => {
    console.log('Comment added:', selectedRequest?.documentNumber, comment)
    // TODO: API call to add comment
    setIsCommentOpen(false)
  }

  const totalRequests = approvals.length
  const pendingRequests = approvals.filter(a => a.status === 'pending').length
  const approvedRequests = approvals.filter(a => a.status === 'approved').length
  const rejectedRequests = approvals.filter(a => a.status === 'rejected').length
  const breachedSLA = approvals.filter(a => a.slaStatus === 'breached').length
  const avgApprovalTime = '2.5h'

  return (
    <div className="w-full h-full px-4 py-6">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalRequests}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingRequests}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{approvedRequests}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{rejectedRequests}</p>
            </div>
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">SLA Breach</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{breachedSLA}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Time</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{avgApprovalTime}</p>
            </div>
            <Zap className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Type Filters */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap">
          All Requests ({totalRequests})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Quotes ({approvals.filter(a => a.type === 'quote').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Discounts ({approvals.filter(a => a.type === 'discount').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Contracts ({approvals.filter(a => a.type === 'contract').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Pricing ({approvals.filter(a => a.type === 'pricing').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Proposals ({approvals.filter(a => a.type === 'proposal').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by document number, customer, or approver..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Approval Requests */}
      <div className="space-y-4">
        {approvals.map((approval) => (
          <div
            key={approval.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{approval.documentNumber}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getTypeColor(approval.type)}`}>
                    {approval.type}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(approval.status)}`}>
                    {approval.status}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(approval.priority)}`}>
                    {approval.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{approval.id}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">₹{(approval.value / 100000).toFixed(2)}L</p>
                <p className="text-xs text-gray-500">Value</p>
              </div>
            </div>

            {/* Customer & Request Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-semibold text-gray-900">{approval.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Requested By</p>
                <p className="font-semibold text-gray-900">{approval.requestedBy}</p>
              </div>
              <div>
                <p className="text-gray-500">Request Date</p>
                <p className="font-semibold text-gray-900">{approval.requestDate}</p>
              </div>
              <div>
                <p className="text-gray-500">Due Date</p>
                <p className="font-semibold text-gray-900">{approval.dueDate}</p>
              </div>
            </div>

            {/* SLA Status */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getSLAColor(approval.slaStatus)}`}>
                SLA: {approval.slaStatus}
              </span>
              <span className="text-xs text-gray-600">
                Time Remaining: <span className="font-semibold">{approval.timeRemaining}</span>
              </span>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Approval Reason:</p>
              <p className="text-sm text-gray-700">{approval.reason}</p>
            </div>

            {/* Approval Chain */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Approval Chain:</p>
              <div className="space-y-2">
                {approval.approvalChain.map((step) => (
                  <div key={step.level} className="flex items-start gap-3 text-xs">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStepStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">Level {step.level}: {step.approver}</p>
                        <span className="text-gray-500">({step.role})</span>
                        <span className={`px-2 py-0.5 text-xs rounded border ${
                          step.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                          step.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          step.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      {step.actionDate && (
                        <p className="text-gray-500 mt-0.5">{step.actionDate} • TAT: {step.turnaroundTime}</p>
                      )}
                      {step.comments && (
                        <p className="text-gray-600 mt-1 italic">&ldquo;{step.comments}&rdquo;</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {approval.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(approval)}
                    className="px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(approval)}
                    className="px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleAddComment(approval)}
                    className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Add Comment
                  </button>
                </>
              )}
              <button
                onClick={() => handleView(approval)}
                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                View Document
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">CPQ Approval Workflow:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Unified Workflow:</strong> Single view for all CPQ approval requests (quotes, discounts, contracts, pricing)</li>
          <li><strong>Multi-Level Approvals:</strong> Automatic routing based on value thresholds and request type</li>
          <li><strong>SLA Tracking:</strong> Monitor approval turnaround times and identify bottlenecks</li>
          <li><strong>Priority Management:</strong> Urgent requests highlighted for faster processing</li>
          <li><strong>Escalation:</strong> Automatic escalation for overdue approvals</li>
        </ul>
      </div>

      {/* Modals */}
      <ApproveModal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onApprove={handleApproveSubmit}
        request={selectedRequest}
      />

      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleRejectSubmit}
        request={selectedRequest}
      />

      <AddCommentModal
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        onAddComment={handleCommentSubmit}
        request={selectedRequest}
      />

      <ViewDocumentModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        request={selectedRequest}
      />
    </div>
  )
}
