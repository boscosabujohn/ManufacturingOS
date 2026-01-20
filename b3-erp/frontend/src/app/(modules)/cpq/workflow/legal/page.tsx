'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Scale,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
  Eye,
  MessageSquare
} from 'lucide-react'
import {
  ApproveLegalModal,
  RejectLegalModal,
  RequestRevisionModal,
  AddLegalCommentModal,
  ViewLegalDocumentModal,
  LegalReview as ImportedLegalReview
} from '@/components/cpq/LegalWorkflowModals'

interface LegalReview extends ImportedLegalReview {
  documentType: 'contract' | 'proposal' | 'nda' | 'amendment' | 'terms'
  reviewType: 'standard' | 'custom-clauses' | 'high-value' | 'international' | 'compliance'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'revision-needed'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

interface LegalIssue {
  id: string
  severity: 'critical' | 'major' | 'minor'
  category: string
  description: string
  recommendation: string
  status: 'open' | 'resolved' | 'accepted'
}

interface ComplianceCheck {
  name: string
  status: 'passed' | 'failed' | 'warning'
  details: string
}

interface Comment {
  id: string
  author: string
  role: string
  message: string
  timestamp: string
}

export default function CPQWorkflowLegalPage() {
  const router = useRouter()

  // Modal states
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isRevisionOpen, setIsRevisionOpen] = useState(false)
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<LegalReview | null>(null)

  const [reviews] = useState<LegalReview[]>([
    {
      id: 'LEG-001',
      documentType: 'contract',
      documentNumber: 'CONT-2024-890',
      customerName: 'Metro Builders Ltd',
      contractValue: 8200000,
      requestedBy: 'Vikram Desai',
      requestDate: '2024-10-17 02:15 PM',
      reviewType: 'custom-clauses',
      priority: 'urgent',
      status: 'in-review',
      assignedTo: 'Rajesh Khanna',
      dueDate: '2024-10-19 10:00 AM',
      riskLevel: 'high',
      customClauses: [
        'Modified liability cap to 2x contract value',
        'Added force majeure extension clause',
        'Custom payment schedule with milestones'
      ],
      issues: [
        {
          id: 'ISS-001',
          severity: 'critical',
          category: 'Liability',
          description: 'Liability cap increased from 1x to 2x contract value',
          recommendation: 'Reduce to 1.5x or add insurance requirement',
          status: 'open'
        },
        {
          id: 'ISS-002',
          severity: 'major',
          category: 'Force Majeure',
          description: 'Customer added 90-day force majeure suspension clause',
          recommendation: 'Limit to 60 days with termination option',
          status: 'open'
        },
        {
          id: 'ISS-003',
          severity: 'minor',
          category: 'Payment Terms',
          description: 'Payment schedule extends to 90 days',
          recommendation: 'Add interest clause for delayed payments',
          status: 'resolved'
        }
      ],
      complianceChecks: [
        { name: 'Contract Law Compliance', status: 'passed', details: 'Meets Indian Contract Act requirements' },
        { name: 'Data Protection', status: 'warning', details: 'Add GDPR compliance clause if EU data involved' },
        { name: 'Payment Terms', status: 'passed', details: 'Payment terms are enforceable' },
        { name: 'Jurisdiction', status: 'passed', details: 'Mumbai jurisdiction clearly stated' },
        { name: 'IP Rights', status: 'failed', details: 'IP ownership clause is ambiguous' }
      ],
      comments: [
        {
          id: 'CMT-001',
          author: 'Vikram Desai',
          role: 'Sales Executive',
          message: 'Customer insisted on higher liability cap. Large strategic account.',
          timestamp: '2024-10-17 02:20 PM'
        },
        {
          id: 'CMT-002',
          author: 'Rajesh Khanna',
          role: 'Legal Counsel',
          message: 'Reviewing liability terms. IP clause needs clarification before approval.',
          timestamp: '2024-10-18 10:30 AM'
        }
      ]
    },
    {
      id: 'LEG-002',
      documentType: 'nda',
      documentNumber: 'NDA-2024-456',
      customerName: 'TechCorp International',
      contractValue: 0,
      requestedBy: 'Neha Singh',
      requestDate: '2024-10-18 11:00 AM',
      reviewType: 'international',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Meera Iyer',
      dueDate: '2024-10-19 05:00 PM',
      riskLevel: 'medium',
      customClauses: [
        'International jurisdiction (Singapore)',
        'Cross-border data transfer provisions'
      ],
      issues: [
        {
          id: 'ISS-004',
          severity: 'major',
          category: 'Jurisdiction',
          description: 'Singapore law and arbitration specified',
          recommendation: 'Assess cost implications of international arbitration',
          status: 'open'
        }
      ],
      complianceChecks: [
        { name: 'International Law', status: 'warning', details: 'Singapore law requires local counsel review' },
        { name: 'Data Transfer', status: 'passed', details: 'GDPR compliant data transfer mechanisms' },
        { name: 'Confidentiality', status: 'passed', details: 'Standard NDA provisions included' }
      ],
      comments: [
        {
          id: 'CMT-003',
          author: 'Neha Singh',
          role: 'Sales Executive',
          message: 'International customer prefers Singapore jurisdiction. Standard for their contracts.',
          timestamp: '2024-10-18 11:05 AM'
        }
      ]
    },
    {
      id: 'LEG-003',
      documentType: 'contract',
      documentNumber: 'CONT-2024-1234',
      customerName: 'Prestige Properties Ltd',
      contractValue: 4500000,
      requestedBy: 'Rahul Kumar',
      requestDate: '2024-10-16 10:00 AM',
      reviewType: 'high-value',
      priority: 'high',
      status: 'approved',
      assignedTo: 'Rajesh Khanna',
      dueDate: '2024-10-17 05:00 PM',
      riskLevel: 'low',
      customClauses: [],
      issues: [
        {
          id: 'ISS-005',
          severity: 'minor',
          category: 'Warranty',
          description: 'Extended warranty period from 24 to 36 months',
          recommendation: 'Ensure extended warranty costs are factored in pricing',
          status: 'resolved'
        }
      ],
      complianceChecks: [
        { name: 'Contract Law Compliance', status: 'passed', details: 'All clauses legally sound' },
        { name: 'Data Protection', status: 'passed', details: 'Customer data protection clause included' },
        { name: 'Payment Terms', status: 'passed', details: 'Standard payment terms applied' },
        { name: 'Jurisdiction', status: 'passed', details: 'Mumbai jurisdiction specified' },
        { name: 'IP Rights', status: 'passed', details: 'Clear IP ownership defined' }
      ],
      comments: [
        {
          id: 'CMT-004',
          author: 'Rajesh Khanna',
          role: 'Legal Counsel',
          message: 'Standard contract with minor warranty extension. Approved.',
          timestamp: '2024-10-17 02:30 PM'
        }
      ]
    },
    {
      id: 'LEG-004',
      documentType: 'amendment',
      documentNumber: 'AMD-2024-234',
      customerName: 'Urban Homes Pvt Ltd',
      contractValue: 2850000,
      requestedBy: 'Anjali Mehta',
      requestDate: '2024-10-15 03:00 PM',
      reviewType: 'standard',
      priority: 'medium',
      status: 'revision-needed',
      assignedTo: 'Meera Iyer',
      dueDate: '2024-10-18 05:00 PM',
      riskLevel: 'medium',
      customClauses: [
        'Delivery timeline extension by 30 days'
      ],
      issues: [
        {
          id: 'ISS-006',
          severity: 'major',
          category: 'Delivery',
          description: 'Extension does not specify penalty waiver',
          recommendation: 'Add clause explicitly waiving late delivery penalties',
          status: 'open'
        },
        {
          id: 'ISS-007',
          severity: 'minor',
          category: 'Documentation',
          description: 'Amendment not signed by authorized signatory',
          recommendation: 'Obtain signature from director-level authority',
          status: 'open'
        }
      ],
      complianceChecks: [
        { name: 'Amendment Authority', status: 'failed', details: 'Signatory authority not verified' },
        { name: 'Terms Clarity', status: 'warning', details: 'Penalty waiver needs explicit mention' },
        { name: 'Original Contract Link', status: 'passed', details: 'Correctly references original contract' }
      ],
      comments: [
        {
          id: 'CMT-005',
          author: 'Meera Iyer',
          role: 'Legal Counsel',
          message: 'Amendment needs revision. Penalty waiver must be explicit and proper signatory required.',
          timestamp: '2024-10-16 11:00 AM'
        }
      ]
    },
    {
      id: 'LEG-005',
      documentType: 'proposal',
      documentNumber: 'PROP-2024-778',
      customerName: 'Coastal Builders',
      contractValue: 6400000,
      requestedBy: 'Suresh Rao',
      requestDate: '2024-10-14 09:30 AM',
      reviewType: 'standard',
      priority: 'low',
      status: 'approved',
      assignedTo: 'Rajesh Khanna',
      dueDate: '2024-10-15 05:00 PM',
      riskLevel: 'low',
      customClauses: [],
      issues: [],
      complianceChecks: [
        { name: 'Terms & Conditions', status: 'passed', details: 'Standard T&C applied' },
        { name: 'Pricing Terms', status: 'passed', details: 'Price validity clearly stated' },
        { name: 'Payment Terms', status: 'passed', details: 'Payment schedule defined' }
      ],
      comments: [
        {
          id: 'CMT-006',
          author: 'Rajesh Khanna',
          role: 'Legal Counsel',
          message: 'Standard proposal with no legal issues. Approved.',
          timestamp: '2024-10-14 04:00 PM'
        }
      ]
    }
  ])

  const getDocTypeColor = (type: string) => {
    const colors: any = {
      contract: 'bg-blue-100 text-blue-700 border-blue-200',
      proposal: 'bg-green-100 text-green-700 border-green-200',
      nda: 'bg-purple-100 text-purple-700 border-purple-200',
      amendment: 'bg-orange-100 text-orange-700 border-orange-200',
      terms: 'bg-pink-100 text-pink-700 border-pink-200'
    }
    return colors[type] || colors.contract
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-gray-100 text-gray-700 border-gray-200',
      'in-review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      'revision-needed': 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[status] || colors.pending
  }

  const getRiskColor = (risk: string) => {
    const colors: any = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      critical: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[risk] || colors.medium
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

  const getSeverityColor = (severity: string) => {
    const colors: any = {
      minor: 'bg-blue-100 text-blue-700 border-blue-200',
      major: 'bg-orange-100 text-orange-700 border-orange-200',
      critical: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[severity] || colors.minor
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const totalReviews = reviews.length
  const pendingReviews = reviews.filter(r => r.status === 'pending' || r.status === 'in-review').length
  const approvedReviews = reviews.filter(r => r.status === 'approved').length
  const rejectedReviews = reviews.filter(r => r.status === 'rejected').length
  const highRisk = reviews.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length
  const avgReviewTime = '1.8 days'

  // Modal handlers
  const handleApprove = (review: LegalReview) => {
    setSelectedReview(review)
    setIsApproveOpen(true)
  }

  const handleReject = (review: LegalReview) => {
    setSelectedReview(review)
    setIsRejectOpen(true)
  }

  const handleRequestRevision = (review: LegalReview) => {
    setSelectedReview(review)
    setIsRevisionOpen(true)
  }

  const handleAddComment = (review: LegalReview) => {
    setSelectedReview(review)
    setIsCommentOpen(true)
  }

  const handleView = (review: LegalReview) => {
    setSelectedReview(review)
    setIsViewOpen(true)
  }

  const handleApproveSubmit = (data: { comments: string; conditions?: string }) => {
    console.log('Approved:', selectedReview?.documentNumber, data)
    // TODO: API call to approve the legal review
    setIsApproveOpen(false)
  }

  const handleRejectSubmit = (data: { reason: string; comments: string }) => {
    console.log('Rejected:', selectedReview?.documentNumber, data)
    // TODO: API call to reject the legal review
    setIsRejectOpen(false)
  }

  const handleRevisionSubmit = (data: { issues: string; recommendations: string; dueDate: string }) => {
    console.log('Revision requested:', selectedReview?.documentNumber, data)
    // TODO: API call to request revision
    setIsRevisionOpen(false)
  }

  const handleCommentSubmit = (comment: string) => {
    console.log('Comment added:', selectedReview?.documentNumber, comment)
    // TODO: API call to add comment
    setIsCommentOpen(false)
  }

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
              <p className="text-sm font-medium text-blue-600">Total Reviews</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalReviews}</p>
            </div>
            <Scale className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingReviews}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{approvedReviews}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{rejectedReviews}</p>
            </div>
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">High Risk</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{highRisk}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Review</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{avgReviewTime}</p>
            </div>
            <Shield className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Document Type Filters */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap">
          All Reviews ({totalReviews})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Contracts ({reviews.filter(r => r.documentType === 'contract').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          NDAs ({reviews.filter(r => r.documentType === 'nda').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Amendments ({reviews.filter(r => r.documentType === 'amendment').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          High Risk ({highRisk})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by document number, customer, or legal counsel..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Legal Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{review.documentNumber}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getDocTypeColor(review.documentType)}`}>
                    {review.documentType}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(review.status)}`}>
                    {review.status}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getRiskColor(review.riskLevel)}`}>
                    {review.riskLevel} risk
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityColor(review.priority)}`}>
                    {review.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{review.id} • {review.customerName}</p>
              </div>
              {review.contractValue > 0 && (
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">₹{(review.contractValue / 100000).toFixed(2)}L</p>
                  <p className="text-xs text-gray-500">Contract Value</p>
                </div>
              )}
            </div>

            {/* Review Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs">
              <div>
                <p className="text-gray-500">Requested By</p>
                <p className="font-semibold text-gray-900">{review.requestedBy}</p>
              </div>
              <div>
                <p className="text-gray-500">Assigned To</p>
                <p className="font-semibold text-gray-900">{review.assignedTo}</p>
              </div>
              <div>
                <p className="text-gray-500">Request Date</p>
                <p className="font-semibold text-gray-900">{review.requestDate}</p>
              </div>
              <div>
                <p className="text-gray-500">Due Date</p>
                <p className="font-semibold text-gray-900">{review.dueDate}</p>
              </div>
            </div>

            {/* Custom Clauses */}
            {review.customClauses.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Custom Clauses:</p>
                <ul className="space-y-1">
                  {review.customClauses.map((clause, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
                      {clause}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legal Issues */}
            {review.issues.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Legal Issues Found:</p>
                <div className="space-y-2">
                  {review.issues.map((issue) => (
                    <div key={issue.id} className="bg-red-50 border border-red-200 rounded p-3 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className="font-semibold text-gray-900">{issue.category}</span>
                        <span className={`ml-auto px-2 py-0.5 text-xs rounded border ${issue.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                          issue.status === 'accepted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1">{issue.description}</p>
                      <p className="text-gray-600 italic">💡 {issue.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Checks */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Compliance Checks:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {review.complianceChecks.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs bg-gray-50 rounded p-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {getComplianceIcon(check.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{check.name}</p>
                      <p className="text-gray-600">{check.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            {review.comments.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Legal Comments:</p>
                <div className="space-y-2">
                  {review.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded p-3 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <Scale className="h-3 w-3 text-gray-500" />
                        <span className="font-semibold text-gray-900">{comment.author}</span>
                        <span className="text-gray-500">({comment.role})</span>
                        <span className="text-gray-400 ml-auto">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{comment.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {(review.status === 'pending' || review.status === 'in-review') && (
                <>
                  <button
                    onClick={() => handleApprove(review)}
                    className="px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review)}
                    className="px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleRequestRevision(review)}
                    className="px-3 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Request Revision
                  </button>
                  <button
                    onClick={() => handleAddComment(review)}
                    className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Add Comment
                  </button>
                </>
              )}
              <button
                onClick={() => handleView(review)}
                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                View Document
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Legal Review Info */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">Legal Review Process:</h3>
        <ul className="text-xs text-purple-700 space-y-1">
          <li><strong>Standard Review:</strong> Templates and standard contracts (1 business day)</li>
          <li><strong>Custom Clauses:</strong> Contracts with modified/added clauses (2-3 business days)</li>
          <li><strong>High-Value:</strong> Contracts above ₹50L threshold (1-2 business days with VP review)</li>
          <li><strong>International:</strong> Cross-border contracts requiring foreign law assessment (3-5 business days)</li>
          <li><strong>Compliance:</strong> Automated checks for data protection, IP rights, jurisdiction, payment terms</li>
          <li><strong>Risk Assessment:</strong> Low (standard terms), Medium (minor variations), High (custom clauses), Critical (major liability changes)</li>
        </ul>
      </div>

      {/* Modals */}
      <ApproveLegalModal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onApprove={handleApproveSubmit}
        review={selectedReview}
      />

      <RejectLegalModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleRejectSubmit}
        review={selectedReview}
      />

      <RequestRevisionModal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        onRequestRevision={handleRevisionSubmit}
        review={selectedReview}
      />

      <AddLegalCommentModal
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        onAddComment={handleCommentSubmit}
        review={selectedReview}
      />

      <ViewLegalDocumentModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        review={selectedReview}
      />
    </div>
  )
}
