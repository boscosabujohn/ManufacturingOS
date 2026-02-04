'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Lock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Copy
} from 'lucide-react'

interface Clause {
  id: string
  name: string
  category: 'essential' | 'legal' | 'operational' | 'financial' | 'compliance'
  description: string
  fullText: string
  isRequired: boolean
  usageCount: number
  lastUsed: string
  status: 'active' | 'review' | 'deprecated'
  version: string
  approvedBy: string
  approvalDate: string
  applicableContractTypes: string[]
}

export default function CPQContractsClausesPage() {
  const router = useRouter()

  const [clauses] = useState<Clause[]>([
    {
      id: 'CLS-001',
      name: 'Confidentiality Agreement',
      category: 'essential',
      description: 'Standard confidentiality clause protecting business information',
      fullText: 'Both parties agree to maintain confidentiality of all proprietary information shared during the course of this agreement. Disclosure to third parties requires prior written consent.',
      isRequired: true,
      usageCount: 456,
      lastUsed: '2024-10-18',
      status: 'active',
      version: '2.1',
      approvedBy: 'Legal Department',
      approvalDate: '2024-01-15',
      applicableContractTypes: ['Sales', 'Service', 'Partnership']
    },
    {
      id: 'CLS-002',
      name: 'Intellectual Property Rights',
      category: 'legal',
      description: 'Defines ownership of IP created during project execution',
      fullText: 'All intellectual property rights, including designs, specifications, and custom solutions, remain the property of the company unless explicitly transferred in writing.',
      isRequired: true,
      usageCount: 423,
      lastUsed: '2024-10-18',
      status: 'active',
      version: '1.8',
      approvedBy: 'Legal Department',
      approvalDate: '2024-02-10',
      applicableContractTypes: ['Sales', 'Service']
    },
    {
      id: 'CLS-003',
      name: 'Payment Terms',
      category: 'financial',
      description: 'Standard payment schedule and terms',
      fullText: 'Payment shall be made as per agreed milestones. Late payment attracts interest at 18% per annum. Advance payment is non-refundable.',
      isRequired: true,
      usageCount: 512,
      lastUsed: '2024-10-18',
      status: 'active',
      version: '3.0',
      approvedBy: 'Finance & Legal',
      approvalDate: '2024-03-05',
      applicableContractTypes: ['Sales', 'Service', 'Partnership']
    },
    {
      id: 'CLS-004',
      name: 'Limitation of Liability',
      category: 'legal',
      description: 'Defines liability limits for both parties',
      fullText: "Company's liability is limited to the contract value. No liability for indirect, consequential, or punitive damages. Force majeure events exclude liability.",
      isRequired: false,
      usageCount: 378,
      lastUsed: '2024-10-17',
      status: 'active',
      version: '2.5',
      approvedBy: 'Legal Department',
      approvalDate: '2024-01-20',
      applicableContractTypes: ['Sales', 'Service']
    },
    {
      id: 'CLS-005',
      name: 'Termination Clause',
      category: 'legal',
      description: 'Conditions for contract termination',
      fullText: 'Either party may terminate with 30 days notice. Immediate termination allowed for material breach. Upon termination, payment for completed work is due.',
      isRequired: true,
      usageCount: 445,
      lastUsed: '2024-10-17',
      status: 'active',
      version: '2.2',
      approvedBy: 'Legal Department',
      approvalDate: '2024-02-15',
      applicableContractTypes: ['Sales', 'Service', 'Partnership']
    },
    {
      id: 'CLS-006',
      name: 'Warranty Terms',
      category: 'operational',
      description: 'Product and service warranty coverage',
      fullText: 'Company warrants products against manufacturing defects for 36 months. Installation warranty covers 12 months. Misuse or damage voids warranty.',
      isRequired: true,
      usageCount: 489,
      lastUsed: '2024-10-18',
      status: 'active',
      version: '1.5',
      approvedBy: 'Service & Legal',
      approvalDate: '2024-04-01',
      applicableContractTypes: ['Sales', 'Service']
    },
    {
      id: 'CLS-007',
      name: 'Dispute Resolution',
      category: 'legal',
      description: 'Mechanism for resolving disputes',
      fullText: 'Disputes shall be resolved through arbitration under Indian Arbitration Act. Venue: Mumbai. Arbitration costs shared equally. Legal proceedings as last resort.',
      isRequired: false,
      usageCount: 367,
      lastUsed: '2024-10-16',
      status: 'active',
      version: '2.0',
      approvedBy: 'Legal Department',
      approvalDate: '2024-01-10',
      applicableContractTypes: ['Sales', 'Service', 'Partnership']
    },
    {
      id: 'CLS-008',
      name: 'Force Majeure',
      category: 'operational',
      description: 'Protection for uncontrollable events',
      fullText: 'Neither party liable for delays due to acts of God, war, government actions, pandemics, or natural disasters. Performance suspended during force majeure. Contract may be terminated if event exceeds 90 days.',
      isRequired: false,
      usageCount: 334,
      lastUsed: '2024-10-15',
      status: 'active',
      version: '1.3',
      approvedBy: 'Legal Department',
      approvalDate: '2024-05-12',
      applicableContractTypes: ['Sales', 'Service', 'Partnership']
    },
    {
      id: 'CLS-009',
      name: 'Delivery & Installation',
      category: 'operational',
      description: 'Terms for product delivery and installation',
      fullText: 'Delivery within agreed timeline. Installation within 7 days of delivery. Customer to provide site readiness. Delays due to site issues not company liability.',
      isRequired: true,
      usageCount: 467,
      lastUsed: '2024-10-18',
      status: 'active',
      version: '1.7',
      approvedBy: 'Operations & Legal',
      approvalDate: '2024-03-20',
      applicableContractTypes: ['Sales']
    },
    {
      id: 'CLS-010',
      name: 'Compliance & Regulations',
      category: 'compliance',
      description: 'Adherence to laws and regulations',
      fullText: 'Both parties agree to comply with all applicable laws, including labor, environmental, and safety regulations. Company maintains ISO certifications. Customer responsible for obtaining necessary permits.',
      isRequired: true,
      usageCount: 398,
      lastUsed: '2024-10-17',
      status: 'active',
      version: '1.4',
      approvedBy: 'Compliance & Legal',
      approvalDate: '2024-06-01',
      applicableContractTypes: ['Sales', 'Service', 'Partnership']
    },
    {
      id: 'CLS-011',
      name: 'Data Protection & Privacy',
      category: 'compliance',
      description: 'GDPR and data privacy compliance',
      fullText: 'Personal data collected will be processed per data protection laws. Data used only for contract purposes. Customer data not shared with third parties without consent. Data breach notification within 72 hours.',
      isRequired: true,
      usageCount: 412,
      lastUsed: '2024-10-18',
      status: 'active',
      version: '2.3',
      approvedBy: 'IT Security & Legal',
      approvalDate: '2024-07-15',
      applicableContractTypes: ['Sales', 'Service', 'Partnership']
    },
    {
      id: 'CLS-012',
      name: 'Amendments & Modifications',
      category: 'operational',
      description: 'Process for contract changes',
      fullText: 'Contract amendments require written agreement from both parties. Minor modifications allowed with email confirmation. Major changes need new contract addendum with signatures.',
      isRequired: false,
      usageCount: 289,
      lastUsed: '2024-10-14',
      status: 'active',
      version: '1.2',
      approvedBy: 'Legal Department',
      approvalDate: '2024-08-05',
      applicableContractTypes: ['Sales', 'Service', 'Partnership']
    }
  ])

  const getCategoryColor = (category: string) => {
    const colors: any = {
      essential: 'bg-red-100 text-red-700 border-red-200',
      legal: 'bg-purple-100 text-purple-700 border-purple-200',
      operational: 'bg-blue-100 text-blue-700 border-blue-200',
      financial: 'bg-green-100 text-green-700 border-green-200',
      compliance: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[category] || colors.essential
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-green-100 text-green-700 border-green-200',
      review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      deprecated: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[status] || colors.active
  }

  const totalClauses = clauses.length
  const requiredClauses = clauses.filter(c => c.isRequired).length
  const activeClauses = clauses.filter(c => c.status === 'active').length
  const totalUsage = clauses.reduce((sum, c) => sum + c.usageCount, 0)

  return (
    <div className="w-full h-full px-4 py-2">
      {/* Action Buttons */}
      <div className="mb-3 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Clause
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Clauses</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalClauses}</p>
              <p className="text-xs text-blue-700 mt-1">Available</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Required</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{requiredClauses}</p>
              <p className="text-xs text-red-700 mt-1">Mandatory</p>
            </div>
            <Lock className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{activeClauses}</p>
              <p className="text-xs text-green-700 mt-1">In use</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Usage</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{totalUsage}</p>
              <p className="text-xs text-purple-700 mt-1">Contracts</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-3 flex gap-3 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap">
          All Clauses ({totalClauses})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Essential ({clauses.filter(c => c.category === 'essential').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Legal ({clauses.filter(c => c.category === 'legal').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Operational ({clauses.filter(c => c.category === 'operational').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Financial ({clauses.filter(c => c.category === 'financial').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Compliance ({clauses.filter(c => c.category === 'compliance').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Required Only ({requiredClauses})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clauses by name, category, or contract type..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clauses List */}
      <div className="space-y-3">
        {clauses.map((clause) => (
          <div
            key={clause.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{clause.name}</h3>
                  {clause.isRequired && (
                    <Lock className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{clause.id} • Version {clause.version}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getCategoryColor(clause.category)}`}>
                  {clause.category}
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(clause.status)}`}>
                  {clause.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{clause.description}</p>

            {/* Full Text */}
            <div className="bg-gray-50 rounded p-3 mb-3">
              <p className="text-xs text-gray-700 leading-relaxed">{clause.fullText}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
              <div>
                <p className="text-gray-500">Usage Count</p>
                <p className="font-semibold text-gray-900">{clause.usageCount}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Used</p>
                <p className="font-semibold text-gray-900">
                  {new Date(clause.lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Approved By</p>
                <p className="font-semibold text-gray-900">{clause.approvedBy}</p>
              </div>
              <div>
                <p className="text-gray-500">Approval Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(clause.approvalDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Applicable Contract Types */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Applicable to:</p>
              <div className="flex gap-2 flex-wrap">
                {clause.applicableContractTypes.map((type) => (
                  <span key={type} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-1">
                <Plus className="h-3 w-3" />
                Add to Contract
              </button>
              <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Preview
              </button>
              <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                <Edit className="h-3 w-3" />
                Edit
              </button>
              <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                <Copy className="h-3 w-3" />
                Duplicate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Clause Info */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">Legal Clause Management:</h3>
        <ul className="text-xs text-purple-700 space-y-1">
          <li><strong>Pre-approved:</strong> All clauses reviewed and approved by legal team</li>
          <li><strong>Version Control:</strong> Track clause changes with version history</li>
          <li><strong>Required Clauses:</strong> Red lock icon indicates mandatory inclusion</li>
          <li><strong>Compliance:</strong> Ensures contracts meet legal and regulatory standards</li>
          <li><strong>Reusability:</strong> Use proven clauses across multiple contracts</li>
        </ul>
      </div>
    </div>
  )
}
