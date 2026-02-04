'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  DollarSign,
  User,
  Shield,
  AlertTriangle,
  MoreVertical,
  Paperclip,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Bell,
  Copy,
  Archive,
  Send,
  History,
  Key,
  Scale,
  ChevronDown,
  ChevronRight,
  File,
  FileCheck,
  FilePlus,
  FileX,
  Briefcase,
  Award,
  Timer,
  CalendarCheck
} from 'lucide-react'

// Import Contract Modals
import {
  CreateContractModal,
  ViewContractDetailsModal,
  RenewContractModal,
  AmendContractModal,
  TerminateContractModal,
  ContractData
} from '@/components/procurement/ContractModals'

interface Contract {
  id: string
  contractNumber: string
  title: string
  vendorName: string
  vendorCode: string
  type: 'purchase' | 'service' | 'maintenance' | 'lease' | 'nda' | 'framework'
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'renewed' | 'under_review'
  value: number
  currency: string
  startDate: string
  endDate: string
  renewalDate?: string
  department: string
  owner: string
  category: string
  paymentTerms: string
  autoRenew: boolean
  renewalNotice: number // days
  compliance: number // percentage
  risk: 'low' | 'medium' | 'high'
  documents: {
    type: string
    name: string
    uploadDate: string
    size: string
  }[]
  milestones: {
    title: string
    date: string
    status: 'pending' | 'completed' | 'overdue'
    value?: number
  }[]
  amendments: number
  lastReviewDate?: string
  nextReviewDate?: string
  tags?: string[]
}

interface ContractStats {
  total: number
  active: number
  expiringSoon: number
  expired: number
  totalValue: number
  avgCompliance: number
  highRisk: number
  pendingRenewal: number
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      contractNumber: 'CON-2024-001',
      title: 'Annual IT Support and Maintenance',
      vendorName: 'Tech Supplies Co.',
      vendorCode: 'VEND-001',
      type: 'maintenance',
      status: 'active',
      value: 250000,
      currency: 'USD',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      renewalDate: '2024-11-01',
      department: 'IT',
      owner: 'John Smith',
      category: 'IT Services',
      paymentTerms: 'Quarterly',
      autoRenew: true,
      renewalNotice: 60,
      compliance: 95,
      risk: 'low',
      documents: [
        { type: 'Main Contract', name: 'IT_Support_Contract_2024.pdf', uploadDate: '2023-12-15', size: '2.5 MB' },
        { type: 'SLA', name: 'SLA_Agreement.pdf', uploadDate: '2023-12-15', size: '1.2 MB' },
        { type: 'Amendment', name: 'Amendment_1.pdf', uploadDate: '2024-03-10', size: '0.8 MB' }
      ],
      milestones: [
        { title: 'Q1 Payment', date: '2024-03-31', status: 'completed', value: 62500 },
        { title: 'Q2 Payment', date: '2024-06-30', status: 'completed', value: 62500 },
        { title: 'Q3 Payment', date: '2024-09-30', status: 'pending', value: 62500 },
        { title: 'Q4 Payment', date: '2024-12-31', status: 'pending', value: 62500 }
      ],
      amendments: 1,
      lastReviewDate: '2024-06-15',
      nextReviewDate: '2024-09-15',
      tags: ['Critical', 'Auto-Renew']
    },
    {
      id: '2',
      contractNumber: 'CON-2024-002',
      title: 'Office Space Lease Agreement',
      vendorName: 'Prime Properties Ltd',
      vendorCode: 'VEND-015',
      type: 'lease',
      status: 'active',
      value: 480000,
      currency: 'USD',
      startDate: '2023-04-01',
      endDate: '2025-03-31',
      renewalDate: '2025-01-01',
      department: 'Administration',
      owner: 'Sarah Johnson',
      category: 'Facility',
      paymentTerms: 'Monthly',
      autoRenew: false,
      renewalNotice: 90,
      compliance: 100,
      risk: 'low',
      documents: [
        { type: 'Lease Agreement', name: 'Office_Lease_2023-25.pdf', uploadDate: '2023-03-15', size: '3.8 MB' },
        { type: 'Floor Plan', name: 'Office_Layout.pdf', uploadDate: '2023-03-15', size: '1.5 MB' }
      ],
      milestones: [
        { title: 'Monthly Rent', date: '2024-01-31', status: 'completed', value: 20000 },
        { title: 'Monthly Rent', date: '2024-02-29', status: 'pending', value: 20000 }
      ],
      amendments: 0,
      lastReviewDate: '2024-01-10',
      nextReviewDate: '2024-07-10'
    },
    {
      id: '3',
      contractNumber: 'CON-2024-003',
      title: 'Chemical Supply Framework Agreement',
      vendorName: 'Chemical Supplies Global',
      vendorCode: 'VEND-005',
      type: 'framework',
      status: 'under_review',
      value: 1500000,
      currency: 'USD',
      startDate: '2024-02-01',
      endDate: '2026-01-31',
      renewalDate: '2025-11-01',
      department: 'Production',
      owner: 'Mike Davis',
      category: 'Raw Materials',
      paymentTerms: 'Net 30',
      autoRenew: true,
      renewalNotice: 120,
      compliance: 88,
      risk: 'medium',
      documents: [
        { type: 'Framework Agreement', name: 'Chemical_Framework_2024.pdf', uploadDate: '2024-01-20', size: '4.2 MB' },
        { type: 'Price List', name: 'Chemical_Prices_2024.xlsx', uploadDate: '2024-01-20', size: '0.5 MB' },
        { type: 'Safety Certificates', name: 'Safety_Certs.pdf', uploadDate: '2024-01-20', size: '2.1 MB' }
      ],
      milestones: [
        { title: 'Initial Order', date: '2024-02-15', status: 'completed', value: 125000 },
        { title: 'Q2 Target', date: '2024-06-30', status: 'pending', value: 375000 }
      ],
      amendments: 2,
      lastReviewDate: '2024-01-15',
      nextReviewDate: '2024-04-15',
      tags: ['High Value', 'Strategic']
    },
    {
      id: '4',
      contractNumber: 'CON-2024-004',
      title: 'Logistics and Transportation Services',
      vendorName: 'Fast Logistics Inc',
      vendorCode: 'VEND-008',
      type: 'service',
      status: 'expired',
      value: 180000,
      currency: 'USD',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      department: 'Supply Chain',
      owner: 'Emma Wilson',
      category: 'Logistics',
      paymentTerms: 'Monthly',
      autoRenew: false,
      renewalNotice: 45,
      compliance: 92,
      risk: 'low',
      documents: [
        { type: 'Service Agreement', name: 'Logistics_Contract_2023.pdf', uploadDate: '2022-12-10', size: '2.8 MB' }
      ],
      milestones: [],
      amendments: 0,
      tags: ['Expired', 'Renewal Required']
    },
    {
      id: '5',
      contractNumber: 'CON-2024-005',
      title: 'Non-Disclosure Agreement',
      vendorName: 'Innovation Partners',
      vendorCode: 'VEND-020',
      type: 'nda',
      status: 'active',
      value: 0,
      currency: 'USD',
      startDate: '2024-01-15',
      endDate: '2027-01-14',
      department: 'R&D',
      owner: 'Robert Chen',
      category: 'Legal',
      paymentTerms: 'N/A',
      autoRenew: false,
      renewalNotice: 30,
      compliance: 100,
      risk: 'low',
      documents: [
        { type: 'NDA', name: 'NDA_Innovation_2024.pdf', uploadDate: '2024-01-10', size: '0.8 MB' }
      ],
      milestones: [],
      amendments: 0,
      tags: ['Confidential', 'R&D']
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedContract, setExpandedContract] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  // Modal state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const [isAmendModalOpen, setIsAmendModalOpen] = useState(false)
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false)

  const stats: ContractStats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiringSoon: contracts.filter(c => {
      if (c.status !== 'active') return false
      const endDate = new Date(c.endDate)
      const today = new Date()
      const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 90 && daysUntilExpiry > 0
    }).length,
    expired: contracts.filter(c => c.status === 'expired').length,
    totalValue: contracts.reduce((sum, c) => sum + c.value, 0),
    avgCompliance: Math.round(contracts.reduce((sum, c) => sum + c.compliance, 0) / contracts.length),
    highRisk: contracts.filter(c => c.risk === 'high').length,
    pendingRenewal: contracts.filter(c => {
      if (!c.renewalDate) return false
      const renewalDate = new Date(c.renewalDate)
      const today = new Date()
      return renewalDate <= today && c.status === 'active'
    }).length
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700 border-gray-300',
      active: 'bg-green-100 text-green-700 border-green-300',
      expired: 'bg-red-100 text-red-700 border-red-300',
      terminated: 'bg-orange-100 text-orange-700 border-orange-300',
      renewed: 'bg-blue-100 text-blue-700 border-blue-300',
      under_review: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    }
    return colors[risk as keyof typeof colors] || colors.low
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <FileText className="h-4 w-4" />
      case 'service':
        return <Briefcase className="h-4 w-4" />
      case 'maintenance':
        return <Shield className="h-4 w-4" />
      case 'lease':
        return <Building2 className="h-4 w-4" />
      case 'nda':
        return <Key className="h-4 w-4" />
      case 'framework':
        return <Scale className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const calculateDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const days = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus
    const matchesType = selectedType === 'all' || contract.type === selectedType
    const matchesRisk = selectedRisk === 'all' || contract.risk === selectedRisk
    const matchesSearch =
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.vendorName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesType && matchesRisk && matchesSearch
  })

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-500 mt-1">Manage vendor contracts, track compliance and renewals</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Contract
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">Total Contracts</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-500 mt-1">Active</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            {stats.expiringSoon > 0 && (
              <span className="animate-pulse">
                <Bell className="h-4 w-4 text-yellow-600" />
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
          <p className="text-sm text-gray-500 mt-1">Expiring Soon</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <FileX className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
          <p className="text-sm text-gray-500 mt-1">Expired</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">${(stats.totalValue / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-gray-500 mt-1">Total Value</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.avgCompliance}%</p>
          <p className="text-sm text-gray-500 mt-1">Compliance</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
          <p className="text-sm text-gray-500 mt-1">High Risk</p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="h-8 w-8 text-orange-500" />
            {stats.pendingRenewal > 0 && (
              <span className="animate-pulse">
                <Bell className="h-4 w-4 text-orange-600" />
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.pendingRenewal}</p>
          <p className="text-sm text-gray-500 mt-1">Due Renewal</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts, vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
              <option value="renewed">Renewed</option>
              <option value="under_review">Under Review</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="purchase">Purchase</option>
              <option value="service">Service</option>
              <option value="maintenance">Maintenance</option>
              <option value="lease">Lease</option>
              <option value="nda">NDA</option>
              <option value="framework">Framework</option>
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-2">
        {filteredContracts.map((contract) => {
          const daysUntilExpiry = calculateDaysUntilExpiry(contract.endDate)
          const isExpanded = expandedContract === contract.id

          return (
            <div key={contract.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Contract Header */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTypeIcon(contract.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{contract.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                        {contract.autoRenew && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Auto-Renew
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(contract.risk)}`}>
                          {contract.risk} risk
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {contract.vendorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {contract.contractNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {contract.owner}
                        </span>
                        {contract.value > 0 && (
                          <span className="flex items-center gap-1 font-medium text-gray-900">
                            <DollarSign className="h-3 w-3" />
                            {contract.currency} {contract.value.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm font-medium text-gray-900">{contract.startDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="text-sm font-medium text-gray-900">{contract.endDate}</p>
                          {contract.status === 'active' && daysUntilExpiry <= 90 && daysUntilExpiry > 0 && (
                            <p className="text-xs text-yellow-600 mt-1">
                              Expires in {daysUntilExpiry} days
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Compliance</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  contract.compliance >= 90 ? 'bg-green-600' :
                                  contract.compliance >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${contract.compliance}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{contract.compliance}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Documents</p>
                          <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            {contract.documents.length} files
                          </p>
                        </div>
                      </div>

                      {contract.tags && contract.tags.length > 0 && (
                        <div className="flex gap-2">
                          {contract.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedContract(isExpanded ? null : contract.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedContract(contract)
                        setIsViewModalOpen(true)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Edit className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Edit</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">More</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {/* Documents Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documents
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {contract.documents.map((doc, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <File className="h-5 w-5 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                            </div>
                            <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                              <Download className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-700">Download</span>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setSelectedContract(contract)
                            setShowUploadModal(true)
                          }}
                          className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-gray-600"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="text-sm">Add Document</span>
                        </button>
                      </div>
                    </div>

                    {/* Milestones Section */}
                    {contract.milestones.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4" />
                          Milestones
                        </h4>
                        <div className="space-y-2">
                          {contract.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                {milestone.status === 'completed' ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : milestone.status === 'overdue' ? (
                                  <AlertCircle className="h-5 w-5 text-red-600" />
                                ) : (
                                  <Clock className="h-5 w-5 text-yellow-600" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                                  <p className="text-xs text-gray-500">Due: {milestone.date}</p>
                                </div>
                              </div>
                              {milestone.value && (
                                <span className="text-sm font-medium text-gray-900">
                                  ${milestone.value.toLocaleString()}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="flex gap-3 pt-3 border-t">
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1">
                        <Send className="h-4 w-4" />
                        Send for Review
                      </button>
                      <button
                        onClick={() => {
                          setSelectedContract(contract)
                          setIsRenewModalOpen(true)
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Renew Contract
                      </button>
                      <button
                        onClick={() => {
                          setSelectedContract(contract)
                          setIsAmendModalOpen(true)
                        }}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-1"
                      >
                        <FilePlus className="h-4 w-4" />
                        Add Amendment
                      </button>
                      <button className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                        <History className="h-4 w-4" />
                        View History
                      </button>
                      <button
                        onClick={() => {
                          setSelectedContract(contract)
                          setIsTerminateModalOpen(true)
                        }}
                        className="px-3 py-1.5 text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Terminate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-3 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-2">
                Contract: {selectedContract.contractNumber} - {selectedContract.title}
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500 mb-2">
                  Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 25MB)
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="contract-upload"
                />
                <label
                  htmlFor="contract-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose Files
                </label>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Modals */}
      <CreateContractModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('Creating contract:', data)
          setIsCreateModalOpen(false)
        }}
      />

      <ViewContractDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        contract={selectedContract as ContractData | null}
      />

      <RenewContractModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        contract={selectedContract as ContractData | null}
        onSubmit={(data) => {
          console.log('Renewing contract:', data)
          setIsRenewModalOpen(false)
        }}
      />

      <AmendContractModal
        isOpen={isAmendModalOpen}
        onClose={() => setIsAmendModalOpen(false)}
        contract={selectedContract as ContractData | null}
        onSubmit={(data) => {
          console.log('Amending contract:', data)
          setIsAmendModalOpen(false)
        }}
      />

      <TerminateContractModal
        isOpen={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        contract={selectedContract as ContractData | null}
        onSubmit={(data) => {
          console.log('Terminating contract:', data)
          setIsTerminateModalOpen(false)
        }}
      />
    </div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}